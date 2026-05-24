'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Foundations-level I/Q decomposition viz — recreates the prof's slides 15-16
 * arc, BEFORE any AM/FM context. Sister viz to /modulation/bridge's
 * `IQDecompositionViz` (which leads with bandpass-modulation presets); this one
 * leads with the algebraic derivation a student sees in lecture 1.
 *
 * Two modes:
 *   - `complex` (slide 15): a complex-exponential carrier `A e^{j 2π f_c t}`.
 *     Phasor on the unit circle; Re-projection = A cos(2π f_c t) = x_I(t);
 *     Im-projection = A sin(2π f_c t) = x_Q(t). The animated phasor + the two
 *     time projections make the «in-phase / quadrature» labels concrete.
 *   - `real` (slide 16): a real bandpass `x(t) = A(t) cos(2π f_c t + θ(t))`
 *     decomposed via `cos(α+β) = cosα cosβ − sinα sinβ` into
 *     `x_I cos(2π f_c t) − x_Q sin(2π f_c t)`, with
 *     `x_I = A cos θ`, `x_Q = A sin θ`. Four stacked panels prove the recomposition.
 *
 * The decomposition is foundational because EVERY downstream modulation chapter
 * (AM, DSB, SSB, FM, PM) is just a different choice of (A(t), θ(t)) feeding into
 * this exact identity.
 */

const T_END = 1.5
const SAMPLES_BANDPASS = 720

type Mode = 'complex' | 'real'

type RealPreset = {
  id: string
  label: string
  description: string
  A: (t: number) => number
  theta: (t: number) => number
}

// Slow modulation rate so envelopes stay readable against the faster carrier.
const F_MOD = 1.2

const REAL_PRESETS: RealPreset[] = [
  {
    id: 'amp-only',
    label: 'Μόνο A(t) αλλάζει',
    description:
      'θ = 0 σταθερό. Το πλάτος "ζωγραφίζει" το x(t). Αυτό μοιάζει με AM ή DSB-SC (που θα δούμε αργότερα).',
    A: (t) => 1 + 0.6 * Math.cos(2 * Math.PI * F_MOD * t),
    theta: () => 0,
  },
  {
    id: 'phase-only',
    label: 'Μόνο θ(t) αλλάζει',
    description:
      'A = 1 σταθερό. Η φάση «κουνιέται» γύρω από το 0 — η περιβάλλουσα μένει σταθερή (constant envelope), όπως στο FM / PM.',
    A: () => 1,
    theta: (t) => 1.4 * Math.sin(2 * Math.PI * F_MOD * t),
  },
  {
    id: 'both',
    label: 'Και τα δύο',
    description:
      'Γενικός real bandpass: το πλάτος και η φάση αλλάζουν ανεξάρτητα. Η canonical I/Q μορφή ξεμπλέκει τα δύο.',
    A: (t) => 0.9 + 0.4 * Math.cos(2 * Math.PI * F_MOD * t),
    theta: (t) => 1.0 * Math.sin(2 * Math.PI * F_MOD * 0.7 * t),
  },
  {
    id: 'constant-theta',
    label: 'θ = π/4 σταθερό',
    description:
      'Η πιο απλή περίπτωση: σταθερή φάση π/4 → x_I = cos(π/4), x_Q = sin(π/4) → ίσος καταμερισμός μεταξύ in-phase και quadrature.',
    A: () => 1,
    theta: () => Math.PI / 4,
  },
]

export function IqFoundationsViz() {
  const [mode, setMode] = useState<Mode>('complex')
  const [running, setRunning] = useState(true)
  const [fc, setFc] = useState(8)
  const [presetId, setPresetId] = useState<string>('amp-only')
  const phaseRef = useRef(0) // for `complex` mode rotating phasor
  const tRef = useRef(0) // for `real` mode time scrubbing
  const complexCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const realCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const preset = useMemo(
    () => REAL_PRESETS.find((p) => p.id === presetId) ?? REAL_PRESETS[0],
    [presetId],
  )

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) {
        phaseRef.current += 2 * Math.PI * 1 * dt // 1 cycle/sec for the phasor
        tRef.current = (tRef.current + dt * 0.6) % T_END
      }
      const colors = getThemeColors()
      if (!colors) {
        raf = requestAnimationFrame(tick)
        return
      }
      if (mode === 'complex' && complexCanvasRef.current) {
        drawComplexScene(complexCanvasRef.current, colors, phaseRef.current)
      } else if (mode === 'real' && realCanvasRef.current) {
        drawRealScene(realCanvasRef.current, colors, preset, fc, tRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, mode, preset, fc])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          {mode === 'complex'
            ? 'I/Q ενός μιγαδικού φέροντος — slide 15'
            : 'I/Q ενός πραγματικού bandpass σήματος — slide 16'}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="I/Q derivation mode"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
          >
            {(['complex', 'real'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 transition-colors',
                  mode === m
                    ? 'bg-accent text-accent-fg'
                    : 'text-fg-muted hover:text-fg',
                )}
              >
                {m === 'complex' ? 'Μιγαδικό φέρον' : 'Πραγματικό bandpass'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
            aria-label={running ? 'Παύση' : 'Παίξε'}
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Παύση' : 'Παίξε'}
          </button>
        </div>
      </div>

      {mode === 'complex' ? (
        <>
          <p className="mb-2 text-xs text-fg-muted">
            <strong>Slide 15.</strong> Από τον τύπο Euler:{' '}
            <code className="font-mono">A e<sup>j 2π f<sub>c</sub> t</sup> = A cos(2π f<sub>c</sub> t) + j · A sin(2π f<sub>c</sub> t) = x<sub>I</sub>(t) + j x<sub>Q</sub>(t)</code>.
            Το spinning phasor «ζωγραφίζει» ταυτόχρονα την in-phase συνιστώσα x<sub>I</sub> (Re-projection) και την quadrature συνιστώσα x<sub>Q</sub> (Im-projection).
          </p>
          <canvas
            ref={complexCanvasRef}
            style={{ height: 260 }}
            className="block h-[260px] w-full rounded-md border border-border bg-bg-soft/30"
            aria-label="Complex carrier on the unit circle with I and Q projections"
          />
        </>
      ) : (
        <>
          <p className="mb-2 text-xs text-fg-muted">
            <strong>Slide 16.</strong> Για κάθε πραγματικό{' '}
            <code className="font-mono">x(t) = A(t) cos(2π f<sub>c</sub> t + θ(t))</code>, αναπτύσσοντας με{' '}
            <code className="font-mono">cos(α+β) = cosα cosβ − sinα sinβ</code> προκύπτει:
          </p>
          <div className="mb-3 overflow-x-auto rounded-md border border-accent/30 bg-accent-soft/15 px-3 py-2 text-center text-[0.92rem]">
            <code className="font-mono">
              x(t) = <span className="text-success">A(t) cos θ(t)</span>
              {' · cos(2π f'}<sub>c</sub>{' t)'}
              {' − '}
              <span className="text-sky-600 dark:text-sky-300">A(t) sin θ(t)</span>
              {' · sin(2π f'}<sub>c</sub>{' t)'}{' '}
              ≜{' '}
              <span className="text-success">x<sub>I</sub>(t)</span>{' '}cos(2π f<sub>c</sub> t) − {' '}
              <span className="text-sky-600 dark:text-sky-300">x<sub>Q</sub>(t)</span>{' '}sin(2π f<sub>c</sub> t)
            </code>
          </div>
          <div
            role="radiogroup"
            aria-label="Real bandpass preset"
            className="mb-3 flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
          >
            {REAL_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={presetId === p.id}
                onClick={() => setPresetId(p.id)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 transition-colors',
                  presetId === p.id
                    ? 'bg-accent text-accent-fg'
                    : 'text-fg-muted hover:text-fg',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <canvas
            ref={realCanvasRef}
            style={{ height: 360 }}
            className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
            aria-label="Real bandpass signal decomposed into in-phase and quadrature carriers"
          />
          <p className="mt-2 text-[11px] text-fg-subtle">{preset.description}</p>
        </>
      )}

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f<sub>c</sub> = <span className="font-mono text-fg tabular-nums">{fc.toFixed(1)}</span>{' '}
          <span className="text-fg-subtle">(σχετική «οπτική» συχνότητα του φέροντος)</span>
        </label>
        <input
          type="range"
          min={3}
          max={16}
          step={0.5}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency f_c"
        />
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        <strong>Γιατί φούντες:</strong> κάθε modulation scheme (AM / DSB-SC / SSB / FM / PM) είναι απλά
        διαφορετική επιλογή των (x<sub>I</sub>(t), x<sub>Q</sub>(t)). Όλο το modulation chapter αργότερα θα είναι
        «εδώ ορίζω x<sub>I</sub>, εδώ ορίζω x<sub>Q</sub>, και δες τι σήμα παίρνω». Γι' αυτό η canonical I/Q μορφή
        αξίζει χρόνο τώρα.
      </p>
    </figure>
  )
}

// ─── COMPLEX-CARRIER MODE (slide 15) ───────────────────────────────────────

const TRACE_CYCLES = 2

function drawComplexScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phase: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const gap = 16
  const planeW = Math.min(h - 16, Math.max(150, w * 0.36))
  const planeX = 8
  const planeY = (h - planeW) / 2
  const tracesX = planeX + planeW + gap
  const tracesW = w - tracesX - 8
  const traceH = (h - 16 - 8) / 2
  const traceTopY = 8
  const traceBotY = 8 + traceH + 8

  drawComplexPlane(ctx, colors, planeX, planeY, planeW, phase)
  drawProjection(ctx, colors, tracesX, traceTopY, tracesW, traceH, phase, 'cos')
  drawProjection(ctx, colors, tracesX, traceBotY, tracesW, traceH, phase, 'sin')
}

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  size: number,
  phase: number,
) {
  if (!colors) return
  const cx = x + size / 2
  const cy = y + size / 2
  const r = size / 2 - 20

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1)

  // axes
  ctx.beginPath()
  ctx.moveTo(x + 6, cy)
  ctx.lineTo(x + size - 6, cy)
  ctx.moveTo(cx, y + 6)
  ctx.lineTo(cx, y + size - 6)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re  (x_I)', x + size - 4, cy - 3)
  ctx.textAlign = 'left'
  ctx.fillText('Im  (x_Q)', cx + 3, y + 11)

  // unit circle
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  const px = cx + r * Math.cos(phase)
  const py = cy - r * Math.sin(phase)

  // projections (dashed)
  ctx.setLineDash([2, 2])
  ctx.strokeStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(px, cy)
  ctx.moveTo(px, py)
  ctx.lineTo(cx, py)
  ctx.stroke()
  ctx.setLineDash([])

  // phasor
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(px, py, 4.5, 0, Math.PI * 2)
  ctx.fill()

  // I/Q projection dots (color-coded)
  ctx.fillStyle = colors.success
  ctx.beginPath()
  ctx.arc(px, cy, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#0284c7' // sky-600
  ctx.beginPath()
  ctx.arc(cx, py, 3.5, 0, Math.PI * 2)
  ctx.fill()
}

function drawProjection(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  w: number,
  h: number,
  phase: number,
  kind: 'cos' | 'sin',
) {
  if (!colors) return
  const padY = 8
  const cy = y + h / 2
  const color = kind === 'cos' ? colors.success : '#0284c7'

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
  ctx.beginPath()
  ctx.moveTo(x + 4, cy)
  ctx.lineTo(x + w - 4, cy)
  ctx.stroke()

  const fn = kind === 'cos' ? Math.cos : Math.sin
  const maxAngle = TRACE_CYCLES * 2 * Math.PI

  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = Math.max(120, Math.floor(w))
  for (let i = 0; i <= steps; i++) {
    const a = lerp(i, 0, steps, 0, maxAngle)
    const v = fn(a)
    const xx = lerp(a, 0, maxAngle, x + 6, x + w - 6)
    const yy = lerp(v, 1, -1, y + padY, y + h - padY)
    if (i === 0) ctx.moveTo(xx, yy)
    else ctx.lineTo(xx, yy)
  }
  ctx.stroke()

  const playhead = ((phase % maxAngle) + maxAngle) % maxAngle
  const xHead = lerp(playhead, 0, maxAngle, x + 6, x + w - 6)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xHead, y + 4)
  ctx.lineTo(xHead, y + h - 4)
  ctx.stroke()
  ctx.setLineDash([])

  const v = fn(phase)
  const yHead = lerp(v, 1, -1, y + padY, y + h - padY)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(xHead, yHead, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    kind === 'cos' ? 'x_I(t) = A cos(2π f_c t)' : 'x_Q(t) = A sin(2π f_c t)',
    x + 8,
    y + 14,
  )
}

// ─── REAL-BANDPASS MODE (slide 16) ─────────────────────────────────────────

function drawRealScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: RealPreset,
  fc: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const labelW = 110
  const plotX = labelW + 4
  const plotW = w - plotX - 8
  const gap = 8
  const rows = 4
  const rowH = (h - (rows - 1) * gap - 8) / rows

  const ROWS = [
    {
      title: 'x(t) — το πλήρες σήμα',
      sub: 'A(t) cos(2π f_c t + θ(t))',
      color: '#f97316', // orange
      ymin: -1.8,
      ymax: 1.8,
    },
    {
      title: 'περιβάλλουσα',
      sub: 'A(t)  &  θ(t)',
      color: colors.accent,
      ymin: -1.8,
      ymax: 1.8,
    },
    {
      title: 'I & Q βάσης ζώνης',
      sub: 'x_I = A cos θ · x_Q = A sin θ',
      color: colors.success,
      ymin: -1.8,
      ymax: 1.8,
    },
    {
      title: 'recomposition',
      sub: 'x_I cos(2π f_c t) − x_Q sin(2π f_c t)  =  x(t)',
      color: '#f97316',
      ymin: -1.8,
      ymax: 1.8,
    },
  ]

  // Helper: paint axes + label
  const paintRow = (rowIdx: number, draw: (ctx2: CanvasRenderingContext2D, px: number, py: number, pw: number, ph: number) => void) => {
    const py = 4 + rowIdx * (rowH + gap)
    const row = ROWS[rowIdx]
    // label column
    ctx.fillStyle = colors.fg
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(row.title, 6, py + 14)
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(row.sub, 6, py + 28)
    // plot border + mid line
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.strokeRect(plotX + 0.5, py + 0.5, plotW - 1, rowH - 1)
    ctx.beginPath()
    ctx.moveTo(plotX + 4, py + rowH / 2)
    ctx.lineTo(plotX + plotW - 4, py + rowH / 2)
    ctx.stroke()
    draw(ctx, plotX, py, plotW, rowH)
  }

  const drawCurve = (
    px: number,
    py: number,
    pw: number,
    ph: number,
    fn: (t: number) => number,
    color: string,
    width = 1.8,
    ymin = -1.8,
    ymax = 1.8,
    dash?: number[],
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    if (dash) ctx.setLineDash(dash)
    ctx.beginPath()
    const steps = Math.max(SAMPLES_BANDPASS, Math.floor(pw * 1.5))
    for (let i = 0; i <= steps; i++) {
      const t = lerp(i, 0, steps, 0, T_END)
      const v = fn(t)
      const xx = lerp(t, 0, T_END, px + 4, px + pw - 4)
      const yy = lerp(v, ymax, ymin, py + 4, py + ph - 4)
      if (i === 0) ctx.moveTo(xx, yy)
      else ctx.lineTo(xx, yy)
    }
    ctx.stroke()
    if (dash) ctx.setLineDash([])
  }

  const carrier = (t: number) => Math.cos(2 * Math.PI * fc * t)
  const carrierSin = (t: number) => Math.sin(2 * Math.PI * fc * t)
  const xI = (t: number) => preset.A(t) * Math.cos(preset.theta(t))
  const xQ = (t: number) => preset.A(t) * Math.sin(preset.theta(t))
  const xFull = (t: number) => preset.A(t) * Math.cos(2 * Math.PI * fc * t + preset.theta(t))
  const recomposed = (t: number) =>
    xI(t) * carrier(t) - xQ(t) * carrierSin(t)

  // Row 1 — x(t)
  paintRow(0, (_c, px, py, pw, ph) => {
    drawCurve(px, py, pw, ph, xFull, '#f97316', 1.8)
  })

  // Row 2 — A(t) and θ(t) (θ scaled to fit in the same range for visual comparison)
  paintRow(1, (_c, px, py, pw, ph) => {
    drawCurve(px, py, pw, ph, preset.A, colors.accent, 2)
    drawCurve(px, py, pw, ph, preset.theta, colors.warn, 2)
    // legend
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = colors.accent
    ctx.fillText('A(t)', px + 8, py + 14)
    ctx.fillStyle = colors.warn
    ctx.fillText('θ(t)', px + 50, py + 14)
  })

  // Row 3 — x_I(t) and x_Q(t)
  paintRow(2, (_c, px, py, pw, ph) => {
    drawCurve(px, py, pw, ph, xI, colors.success, 2)
    drawCurve(px, py, pw, ph, xQ, '#0284c7', 2)
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = colors.success
    ctx.fillText('x_I = A cos θ', px + 8, py + 14)
    ctx.fillStyle = '#0284c7'
    ctx.fillText('x_Q = A sin θ', px + 105, py + 14)
  })

  // Row 4 — recomposition (faint dashed orange overlay of x(t) underneath)
  paintRow(3, (_c, px, py, pw, ph) => {
    // x_I cos(2π f_c t) component (green, thin)
    drawCurve(
      px,
      py,
      pw,
      ph,
      (t) => xI(t) * carrier(t),
      colors.success,
      1.1,
      -1.8,
      1.8,
      [4, 3],
    )
    // -x_Q sin(2π f_c t) component (blue, thin)
    drawCurve(
      px,
      py,
      pw,
      ph,
      (t) => -xQ(t) * carrierSin(t),
      '#0284c7',
      1.1,
      -1.8,
      1.8,
      [4, 3],
    )
    // Sum (orange, thick)
    drawCurve(px, py, pw, ph, recomposed, '#f97316', 2)
    // Original x(t) overlay (dashed grey) — should match exactly
    drawCurve(px, py, pw, ph, xFull, colors.fgSubtle, 1, -1.8, 1.8, [2, 4])
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#f97316'
    ctx.fillText('Άθροισμα = x(t) ✓', px + 8, py + 14)
  })

  // Playhead vertical line across all rows
  const xHead = lerp(tNow, 0, T_END, plotX + 4, plotX + plotW - 4)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xHead, 4)
  ctx.lineTo(xHead, h - 4)
  ctx.stroke()
  ctx.setLineDash([])
}
