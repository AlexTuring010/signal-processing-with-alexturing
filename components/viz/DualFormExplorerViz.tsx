'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Slide 22 of session 4 (theory2) + slide 7 of session 5&6:
 *
 *   x(t) = Σ_k A_k cos(2π f_k t + φ_k)
 *        = Σ_k [(A_k/2) e^{jφ_k} e^{j2π f_k t} + (A_k/2) e^{-jφ_k} e^{-j2π f_k t}]
 *
 * The dual-form expansion the prof teaches explicitly. Every cosine
 * splits into TWO complex exponentials at ±f_k with conjugate
 * coefficients (A_k/2)·e^{±jφ_k}. The amplitude spectrum is symmetric
 * around f=0 (each pair contributes (A_k/2) at both ±f_k); the phase
 * spectrum is antisymmetric (±φ_k).
 *
 * The viz mirrors the prof's slide layout: time-domain signal at top,
 * amplitude + phase spectra below, with the symbolic expansion
 * rendered side-by-side. User can edit (A_k, f_k, φ_k) for up to 3
 * cosine components and watch all panels respond live.
 *
 * Why a bespoke viz when SpectrumViewer + RectangularPulseFourier exist:
 * SpectrumViewer takes precomputed a_k presets. This viz starts from
 * the user-defined cosine sum and *derives* the a_k in real time,
 * making the cos→exp mapping explicit. The exam problem
 * `comp-fourier-coeffs` requires exactly this skill (given x(t) as a
 * sum of cosines/sines, find a_k) — this viz is the practice surface
 * for it.
 */

type Component = {
  id: number
  A: number // amplitude (≥0)
  f: number // frequency in units of f₀
  phi: number // phase in radians (-π..π)
}

const F0 = 1
const T0 = 1 / F0

const INITIAL: Component[] = [
  { id: 1, A: 1.0, f: 1, phi: 0 },
  { id: 2, A: 0.6, f: 2, phi: Math.PI / 4 },
]

const PRESETS = [
  {
    label: 'Πρόβλημα τύπου εξετάσεων',
    description: '3 + 4·cos(2πf₀t) − 2·sin(4πf₀t) — όπως το comp-fourier-coeffs.',
    components: [
      { id: 1, A: 3, f: 0, phi: 0 }, // DC = 3
      { id: 2, A: 4, f: 1, phi: 0 }, // 4 cos
      { id: 3, A: 2, f: 2, phi: -Math.PI / 2 }, // -2 sin = 2 cos(... -π/2) — but we want -2sin, not +2cos(-π/2). Use phi = π/2 for the trick: -2sin(x) = 2cos(x + π/2)
    ],
  },
  {
    label: 'Καθαρό cosine + phase',
    description: 'A·cos(2πf₀t + φ) — η σπικ-στο-±f₀ εικόνα της slide 3 του session 5&6.',
    components: [{ id: 1, A: 1, f: 1, phi: Math.PI / 3 }],
  },
  {
    label: '3 αρμονικές, διάφορες φάσεις',
    description: 'Δείχνει την περιττή φάση + άρτιο πλάτος συμμετρία.',
    components: [
      { id: 1, A: 1, f: 1, phi: Math.PI / 6 },
      { id: 2, A: 0.6, f: 2, phi: -Math.PI / 4 },
      { id: 3, A: 0.4, f: 3, phi: Math.PI / 2 },
    ],
  },
]

export function DualFormExplorerViz() {
  const [components, setComponents] = useState<Component[]>(INITIAL)
  const [showExpansion, setShowExpansion] = useState(true)
  const nextId = useRef(INITIAL.length + 1)

  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  // Compute spectrum lines from cosine components.
  // For each cos component at freq f with amp A and phase φ:
  //   (A/2)·e^{+jφ} at +f
  //   (A/2)·e^{−jφ} at −f
  // For DC component (f=0): A at 0 (no conjugate pair).
  const lines = useMemo(() => {
    type Line = { f: number; mag: number; phase: number }
    const out: Line[] = []
    for (const c of components) {
      if (c.A <= 0) continue
      if (Math.abs(c.f) < 1e-9) {
        // DC: just A at 0
        out.push({ f: 0, mag: Math.abs(c.A), phase: c.A >= 0 ? 0 : Math.PI })
      } else {
        out.push({ f: c.f, mag: c.A / 2, phase: c.phi })
        out.push({ f: -c.f, mag: c.A / 2, phase: -c.phi })
      }
    }
    // Sum duplicates at same frequency (e.g., user adds two cosines at same f)
    const merged = new Map<number, { re: number; im: number }>()
    for (const l of out) {
      const key = Math.round(l.f * 1000) / 1000
      const cur = merged.get(key) ?? { re: 0, im: 0 }
      cur.re += l.mag * Math.cos(l.phase)
      cur.im += l.mag * Math.sin(l.phase)
      merged.set(key, cur)
    }
    const result: Line[] = []
    for (const [f, { re, im }] of merged.entries()) {
      const mag = Math.sqrt(re * re + im * im)
      const phase = Math.atan2(im, re)
      if (mag > 1e-6) result.push({ f, mag, phase })
    }
    return result.sort((a, b) => a.f - b.f)
  }, [components])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, components)
    if (magRef.current) drawSpectrum(magRef.current, colors, lines, 'mag')
    if (phaseRef.current) drawSpectrum(phaseRef.current, colors, lines, 'phase')
  }, [components, lines])

  function update(id: number, patch: Partial<Component>) {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function add() {
    if (components.length >= 3) return
    setComponents((prev) => [...prev, { id: nextId.current++, A: 0.5, f: prev.length + 1, phi: 0 }])
  }

  function remove(id: number) {
    setComponents((prev) => prev.filter((c) => c.id !== id))
  }

  function loadPreset(idx: number) {
    const p = PRESETS[idx]
    setComponents(p.components.map((c, i) => ({ ...c, id: i + 1 })))
    nextId.current = p.components.length + 1
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Cosine ↔ exponential: η μετατροπή ζωντανά
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πληκτρολόγησε <InlineMath>{'A_k, f_k, \\varphi_k'}</InlineMath> για ένα-τρία cosines.
        Στα δεξιά υπολογίζονται και σχεδιάζονται οι μιγαδικοί συντελεστές{' '}
        <InlineMath>{'(A_k/2) e^{\\pm j\\varphi_k}'}</InlineMath> στα <InlineMath>{'\\pm f_k'}</InlineMath>.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-fg-subtle">Προεπιλογές:</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => loadPreset(i)}
            className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-fg-muted hover:bg-accent-soft/40 hover:text-fg"
            title={p.description}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,330px)_1fr] lg:items-start">
        {/* LEFT: editable cosine components */}
        <div className="rounded-md border border-border bg-bg-soft px-3 py-2.5">
          <div className="mb-2 text-[11px] font-semibold tracking-tight">
            Συνιστώσες x(t) = Σ A·cos(2π f t + φ)
          </div>
          <div className="space-y-2">
            {components.map((c, i) => (
              <div
                key={c.id}
                className="rounded border border-border/60 bg-bg-elevated px-2.5 py-1.5"
              >
                <div className="mb-1 flex items-center justify-between text-[10px] text-fg-subtle">
                  <span>όρος {i + 1}</span>
                  {components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="text-fg-subtle hover:text-fg"
                      aria-label="Αφαίρεση"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <NumField
                    label="A"
                    value={c.A}
                    onChange={(v) => update(c.id, { A: v })}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                  <NumField
                    label="f / f₀"
                    value={c.f}
                    onChange={(v) => update(c.id, { f: v })}
                    min={0}
                    max={8}
                    step={1}
                    integer
                  />
                  <NumField
                    label="φ (°)"
                    value={(c.phi * 180) / Math.PI}
                    onChange={(v) => update(c.id, { phi: (v * Math.PI) / 180 })}
                    min={-180}
                    max={180}
                    step={15}
                    disabled={Math.abs(c.f) < 1e-9}
                  />
                </div>
              </div>
            ))}
            {components.length < 3 && (
              <button
                type="button"
                onClick={add}
                className="inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-0.5 text-[10px] text-fg-muted hover:bg-accent-soft/30 hover:text-fg"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                Νέος όρος
              </button>
            )}
          </div>

          <label className="mt-3 flex items-center gap-1.5 text-[10px] text-fg-muted">
            <input
              type="checkbox"
              checked={showExpansion}
              onChange={(e) => setShowExpansion(e.target.checked)}
              className="accent-[rgb(var(--accent))]"
            />
            Εμφάνισε τη συμβολική ανάπτυξη
          </label>
        </div>

        {/* RIGHT: time + amplitude + phase spectra */}
        <div className="space-y-2">
          <Panel title="Στον χρόνο" subtitle="x(t) = Σ A·cos(2πf·t + φ)">
            <canvas
              ref={timeRef}
              style={{ height: 110 }}
              className="block h-[110px] w-full"
              aria-label="Time-domain signal"
            />
          </Panel>
          <Panel
            title="|a_k| — φάσμα πλάτους (slide 22)"
            subtitle="(A/2) σε ±f — άρτιο, συμμετρικό στο f=0"
          >
            <canvas
              ref={magRef}
              style={{ height: 92 }}
              className="block h-[92px] w-full"
              aria-label="Amplitude spectrum"
            />
          </Panel>
          <Panel
            title="∠a_k — φάσμα φάσης"
            subtitle="±φ σε ±f — περιττό, αντισυμμετρικό στο f=0"
          >
            <canvas
              ref={phaseRef}
              style={{ height: 92 }}
              className="block h-[92px] w-full"
              aria-label="Phase spectrum"
            />
          </Panel>
        </div>
      </div>

      {showExpansion && (
        <div className="mt-3 rounded-md border border-border bg-bg-soft px-3 py-2 text-[11px]">
          <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-subtle">
            Συμβολική ανάπτυξη (Euler)
          </div>
          <ExpansionLines components={components} />
        </div>
      )}

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Δοκίμασε:</strong> φόρτωσε «Πρόβλημα τύπου εξετάσεων» —
        το σήμα <InlineMath>{'x(t) = 3 + 4\\cos(2\\pi f_0 t) - 2\\sin(4\\pi f_0 t)'}</InlineMath>{' '}
        είναι το comp-fourier-coeffs ExamProblem. Στο φάσμα πλάτους βλέπεις:{' '}
        <InlineMath>{'a_0 = 3'}</InlineMath>,{' '}
        <InlineMath>{'|a_{\\pm 1}| = 2'}</InlineMath>, και{' '}
        <InlineMath>{'|a_{\\pm 2}| = 1'}</InlineMath>. Στο φάσμα φάσης η{' '}
        <InlineMath>{'2f_0'}</InlineMath> γραμμή έχει{' '}
        <InlineMath>{'\\angle a_2 = +\\pi/2'}</InlineMath> (γιατί{' '}
        <InlineMath>{'-\\sin = \\cos(\\,\\cdot\\,+\\pi/2)'}</InlineMath>),{' '}
        και αντισυμμετρικά στα <InlineMath>{'-2f_0'}</InlineMath>.
      </div>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-border bg-bg-soft px-3 py-2">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="text-[11px] font-semibold tracking-tight">{title}</div>
        {subtitle && (
          <div className="text-[10px] text-fg-subtle">{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  )
}

function NumField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  integer = false,
  disabled = false,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  integer?: boolean
  disabled?: boolean
}) {
  return (
    <label className={cn('flex flex-col gap-0.5', disabled && 'opacity-40')}>
      <span className="text-[9px] uppercase tracking-wider text-fg-subtle">{label}</span>
      <input
        type="number"
        value={integer ? Math.round(value) : Number(value.toFixed(2))}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)))
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full rounded border border-border bg-bg-elevated px-1 py-0.5 font-mono text-[11px]"
      />
    </label>
  )
}

function ExpansionLines({ components }: { components: Component[] }) {
  const lines = components
    .filter((c) => c.A > 1e-6)
    .map((c, i) => {
      if (Math.abs(c.f) < 1e-9) {
        return (
          <div key={c.id} className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-fg-muted">όρος {i + 1}:</span>
            <InlineMath>{`${fmt(c.A)} = ${fmt(c.A)}\\,e^{j 0}\\,e^{j 0 \\cdot 2\\pi f_0 t}`}</InlineMath>
          </div>
        )
      }
      const A2 = (c.A / 2).toFixed(2)
      const phi = c.phi
      const phiStr = phi >= 0 ? `+${phi.toFixed(2)}` : phi.toFixed(2)
      const negPhiStr = (-phi) >= 0 ? `+${(-phi).toFixed(2)}` : (-phi).toFixed(2)
      return (
        <div key={c.id} className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-fg-muted">όρος {i + 1}:</span>
          <InlineMath>
            {`${fmt(c.A)}\\cos(2\\pi(${c.f})f_0 t ${phiStr}) = ${A2}\\,e^{j${phiStr}}\\,e^{j 2\\pi(${c.f}) f_0 t} + ${A2}\\,e^{j${negPhiStr}}\\,e^{-j 2\\pi(${c.f}) f_0 t}`}
          </InlineMath>
        </div>
      )
    })

  if (lines.length === 0) {
    return <div className="text-fg-subtle">— καμία ενεργή συνιστώσα —</div>
  }

  return <div className="space-y-1.5 text-[11px]">{lines}</div>
}

function fmt(v: number): string {
  if (Math.abs(v - Math.round(v)) < 1e-6) return String(Math.round(v))
  return v.toFixed(2)
}

// ─── Drawing ───────────────────────────────────────────────────────

function drawTime(canvas: HTMLCanvasElement, colors: Colors, components: Component[]) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 8
  const padR = 8
  const padT = 6
  const padB = 14
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const midY = padT + innerH / 2

  // Samples over 2 periods
  const N = 500
  const xs = new Float64Array(N)
  let maxAbs = 0
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * (2 * T0)
    let v = 0
    for (const c of components) {
      v += c.A * Math.cos(2 * Math.PI * c.f * F0 * t + c.phi)
    }
    xs[i] = v
    if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v)
  }
  if (maxAbs < 0.001) maxAbs = 1
  const scale = (innerH / 2) * 0.92

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(padL, midY)
  ctx.lineTo(W - padR, midY)
  ctx.stroke()

  // Period boundary
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(padL + innerW / 2, padT)
  ctx.lineTo(padL + innerW / 2, H - padB)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = padL + (i / (N - 1)) * innerW
    const y = midY - (xs[i] / maxAbs) * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('0', padL, H - 1)
  ctx.fillText('T₀', padL + innerW / 2, H - 1)
  ctx.fillText('2T₀', W - padR, H - 1)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: Colors,
  lines: Array<{ f: number; mag: number; phase: number }>,
  kind: 'mag' | 'phase',
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 36
  const padR = 16
  const padT = 12
  const padB = 22
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  // f-axis range
  const fmax = Math.max(3, ...lines.map((l) => Math.abs(l.f) + 1))
  const xOf = (f: number) => padL + ((f + fmax) / (2 * fmax)) * innerW

  if (kind === 'mag') {
    const baselineY = H - padB
    const magMax = Math.max(0.5, ...lines.map((l) => l.mag)) * 1.15
    const yOf = (m: number) => baselineY - (m / magMax) * innerH

    // Baseline
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padL, baselineY)
    ctx.lineTo(W - padR, baselineY)
    ctx.stroke()

    // y axis
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(xOf(0), padT)
    ctx.lineTo(xOf(0), baselineY)
    ctx.stroke()

    // f-ticks (integer multiples of f₀)
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    const fmaxInt = Math.ceil(fmax)
    for (let f = -fmaxInt; f <= fmaxInt; f++) {
      const x = xOf(f)
      if (f === 0) {
        ctx.fillText('0', x, baselineY + 14)
        continue
      }
      ctx.strokeStyle = colors.border
      ctx.beginPath()
      ctx.moveTo(x, baselineY)
      ctx.lineTo(x, baselineY + 3)
      ctx.stroke()
      const label = f === 1 ? 'f₀' : f === -1 ? '−f₀' : `${f}f₀`
      ctx.fillText(label, x, baselineY + 14)
    }

    // Stems with conjugate-pair coloring (matched colors for ±f pairs)
    const PALETTE = ['#0ea5e9', '#f59e0b', '#10b981', '#a855f7', '#ef4444']
    const seenFreqs = new Map<number, number>() // |f| → color idx
    for (const l of lines) {
      const absKey = Math.round(Math.abs(l.f) * 1000) / 1000
      if (!seenFreqs.has(absKey)) seenFreqs.set(absKey, seenFreqs.size % PALETTE.length)
      const color = PALETTE[seenFreqs.get(absKey)!]
      drawStem(ctx, xOf(l.f), baselineY, yOf(l.mag), color, 3.5)

      // Value label
      if (l.mag > magMax * 0.1) {
        ctx.fillStyle = color
        ctx.font = '9.5px ui-monospace, monospace'
        ctx.textAlign = 'center'
        ctx.fillText(l.mag.toFixed(2), xOf(l.f), yOf(l.mag) - 5)
      }
    }

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('|aₖ|', 4, padT + 8)
    ctx.textAlign = 'right'
    ctx.fillText('f', W - padR, baselineY - 4)
  } else {
    // Phase spectrum: y from -π to +π
    const midY = padT + innerH / 2
    const yOf = (ph: number) => midY - (ph / Math.PI) * (innerH / 2)

    // y axis @ f=0
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(xOf(0), padT)
    ctx.lineTo(xOf(0), H - padB)
    ctx.stroke()

    // 0-axis horizontal
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padL, midY)
    ctx.lineTo(W - padR, midY)
    ctx.stroke()

    // ±π lines (faint)
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 4])
    ctx.beginPath()
    ctx.moveTo(padL, padT)
    ctx.lineTo(W - padR, padT)
    ctx.moveTo(padL, H - padB)
    ctx.lineTo(W - padR, H - padB)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui'
    ctx.textAlign = 'right'
    ctx.fillText('+π', padL - 4, padT + 4)
    ctx.fillText('0', padL - 4, midY + 3)
    ctx.fillText('−π', padL - 4, H - padB + 3)

    // f-axis ticks
    ctx.textAlign = 'center'
    const fmaxInt = Math.ceil(fmax)
    for (let f = -fmaxInt; f <= fmaxInt; f++) {
      const x = xOf(f)
      if (f === 0) {
        ctx.fillText('0', x, H - padB + 14)
        continue
      }
      const label = f === 1 ? 'f₀' : f === -1 ? '−f₀' : `${f}f₀`
      ctx.fillText(label, x, H - padB + 14)
    }

    // Phase stems
    const PALETTE = ['#0ea5e9', '#f59e0b', '#10b981', '#a855f7', '#ef4444']
    const seenFreqs = new Map<number, number>()
    for (const l of lines) {
      if (l.mag < 1e-6) continue
      const absKey = Math.round(Math.abs(l.f) * 1000) / 1000
      if (!seenFreqs.has(absKey)) seenFreqs.set(absKey, seenFreqs.size % PALETTE.length)
      const color = PALETTE[seenFreqs.get(absKey)!]
      drawStem(ctx, xOf(l.f), midY, yOf(l.phase), color, 3)

      // Phase value label (degrees)
      const deg = (l.phase * 180) / Math.PI
      ctx.fillStyle = color
      ctx.font = '9px ui-monospace, monospace'
      ctx.textAlign = 'center'
      const tipY = yOf(l.phase)
      ctx.fillText(`${deg.toFixed(0)}°`, xOf(l.f), tipY + (l.phase >= 0 ? -5 : 12))
    }

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('∠aₖ', 4, padT + 8)
  }
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  x: number,
  baselineY: number,
  topY: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x, baselineY)
  ctx.lineTo(x, topY)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, topY, 2.8, 0, 2 * Math.PI)
  ctx.fill()
}
