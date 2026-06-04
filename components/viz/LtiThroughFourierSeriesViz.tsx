'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Slide 5 of session 5&6 (Theory3): «Απόκριση ΓΧΑ συστημάτων σε μιγαδικό
 * εκθετικό σήμα», generalised to a periodic input.
 *
 *   x(t) = Σ_k a_k e^{j2π k f₀ t}    ──── h(t) ────►    y(t) = Σ_k a_k H(k f₀) e^{j2π k f₀ t}
 *
 * Each Fourier coefficient is scaled by H evaluated at its own
 * harmonic frequency. Some harmonics get killed by the filter (LPF
 * drops the high-k tails; BPF keeps a slice), others pass through, the
 * output waveform looks different from the input.
 *
 * 5-panel layout:
 *   (A) input x(t) waveform
 *   (B) output y(t) waveform (overlay vs input optional)
 *   (C) |H(f)| of the chosen system — continuous curve + dots at the
 *       k·f₀ sampling points
 *   (D) input |a_k| stems   →   output |b_k| stems side-by-side
 *   (E) per-harmonic table (k, f_k, |a_k|, |H(kf₀)|, |b_k|)
 *
 * This is the bridge between /foundations/systems (eigenfunction) and
 * /foundations/fourier-transform — students see EVERY harmonic of a
 * periodic signal get processed independently in frequency, exactly
 * like the prof's slide 5 promises.
 */

// ─── Signal presets ───────────────────────────────────────────────

type SignalPreset = {
  id: string
  label: string
  description: string
  // Map of k → (real-form amplitude A_k, phase φ_k); k=0 is DC (A_0 only).
  components: Array<{ k: number; A: number; phi: number }>
}

const SIGNAL_PRESETS: SignalPreset[] = [
  {
    id: 'three-tones',
    label: '3 αρμονικές',
    description: 'cos(2πf₀t) + 0.5·cos(2π·2f₀t) + 0.33·cos(2π·3f₀t)',
    components: [
      { k: 1, A: 1.0, phi: 0 },
      { k: 2, A: 0.5, phi: 0 },
      { k: 3, A: 0.33, phi: 0 },
    ],
  },
  {
    id: 'square',
    label: 'Τετραγωνικός παλμός',
    description: 'DC + odd harmonics with 1/k decay (sinc envelope)',
    components: (() => {
      const arr = [{ k: 0, A: 0.5, phi: 0 }]
      for (let k = 1; k <= 9; k += 2) {
        arr.push({ k, A: 2 / (k * Math.PI), phi: 0 })
      }
      return arr
    })(),
  },
  {
    id: 'sawtooth',
    label: 'Πριονοκυματικό',
    description: 'Όλες οι αρμονικές παρόντες με 1/k decay',
    components: (() => {
      const arr = []
      for (let k = 1; k <= 9; k++) {
        arr.push({ k, A: 2 / (k * Math.PI), phi: -Math.PI / 2 })
      }
      return arr
    })(),
  },
]

// ─── System presets ───────────────────────────────────────────────

type SystemKind = 'lpf' | 'hpf' | 'bpf' | 'allpass'
type SystemPreset = {
  id: SystemKind
  label: string
  description: (cutoff: number) => string
  H: (f: number, cutoff: number) => { mag: number; phase: number }
}

const SYSTEMS: SystemPreset[] = [
  {
    id: 'lpf',
    label: 'LPF (RC)',
    description: (c) => `Lowpass με γωνία ~ ${c.toFixed(2)}·f₀. Σβήνει υψηλές αρμονικές.`,
    H: (f, c) => {
      // |H| = 1/sqrt(1 + (f/c)^2), ∠H = -atan(f/c)
      const ratio = f / Math.max(0.05, c)
      return { mag: 1 / Math.sqrt(1 + ratio * ratio), phase: -Math.atan(ratio) }
    },
  },
  {
    id: 'hpf',
    label: 'HPF (RC)',
    description: (c) => `Highpass με γωνία ~ ${c.toFixed(2)}·f₀. Σβήνει DC + χαμηλές αρμονικές.`,
    H: (f, c) => {
      const ratio = f / Math.max(0.05, c)
      return {
        mag: Math.abs(ratio) / Math.sqrt(1 + ratio * ratio),
        phase: Math.atan(1 / Math.max(0.001, Math.abs(ratio))) * Math.sign(ratio || 1),
      }
    },
  },
  {
    id: 'bpf',
    label: 'BPF (ιδανικό)',
    description: (c) => `Bandpass: κρατάει αρμονικές στη ζώνη γύρω από ${c.toFixed(2)}·f₀ ±0.6·f₀.`,
    H: (f, c) => {
      const w = 0.6
      const af = Math.abs(f)
      const mag = af >= c - w && af <= c + w ? 1 : 0
      return { mag, phase: 0 }
    },
  },
  {
    id: 'allpass',
    label: 'Allpass (καθυστέρηση)',
    description: () =>
      'h(t) = δ(t − 0.15). |H| = 1 σε όλη τη f, μόνο μετατόπιση φάσης.',
    H: (f) => ({ mag: 1, phase: -2 * Math.PI * f * 0.15 }),
  },
]

const F0 = 1
const T0 = 1 / F0

export function LtiThroughFourierSeriesViz() {
  const [sigId, setSigId] = useState<string>('three-tones')
  const [sysId, setSysId] = useState<SystemKind>('lpf')
  const [cutoff, setCutoff] = useState<number>(2.0) // in units of f₀
  const [overlay, setOverlay] = useState<boolean>(true)

  const signal = SIGNAL_PRESETS.find((s) => s.id === sigId)!
  const system = SYSTEMS.find((s) => s.id === sysId)!

  // Compute input + output spectra
  const harmonics = useMemo(() => {
    return signal.components.map((c) => {
      const fk = c.k * F0
      const H = system.H(fk, cutoff)
      // Real-form output amplitude scales by |H(fk)| (no factor of 2 needed since
      // the complex coefficient already encodes the conjugate-pair symmetry).
      // For DC (k=0) we use H at f=0 which may be 1 for LPF, 0 for HPF, 0 for BPF.
      const HDC = c.k === 0 ? system.H(0, cutoff).mag : H.mag
      const mag = c.k === 0 ? HDC : H.mag
      return {
        k: c.k,
        fk,
        Ain: c.A,
        phiIn: c.phi,
        Hmag: mag,
        Hphase: H.phase,
        Aout: c.A * mag,
        phiOut: c.phi + H.phase,
      }
    })
  }, [signal, system, cutoff])

  const inRef = useRef<HTMLCanvasElement | null>(null)
  const outRef = useRef<HTMLCanvasElement | null>(null)
  const hMagRef = useRef<HTMLCanvasElement | null>(null)
  const inSpecRef = useRef<HTMLCanvasElement | null>(null)
  const outSpecRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (inRef.current) drawTime(inRef.current, colors, harmonics, 'in', false)
    if (outRef.current) drawTime(outRef.current, colors, harmonics, 'out', overlay)
    if (hMagRef.current)
      drawHResponse(hMagRef.current, colors, system, cutoff, harmonics.map((h) => h.fk))
    if (inSpecRef.current) drawSpec(inSpecRef.current, colors, harmonics, 'in')
    if (outSpecRef.current) drawSpec(outSpecRef.current, colors, harmonics, 'out')
  }, [harmonics, system, cutoff, overlay])

  const cutoffNeeded = sysId !== 'allpass'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        LTI σε periodic σήμα — κάθε αρμονική ξεχωριστά
      </h4>
      <p className="mb-3 text-xs text-fg-muted">{system.description(cutoff)}</p>

      {/* Controls row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-fg-subtle">σήμα:</span>
          <div className="inline-flex flex-wrap items-center gap-0.5 rounded-full border border-border bg-bg-soft p-0.5">
            {SIGNAL_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSigId(p.id)}
                className={cn(
                  'rounded-full px-2 py-0.5 transition-colors',
                  sigId === p.id
                    ? 'bg-accent text-accent-fg'
                    : 'text-fg-muted hover:text-fg',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-fg-subtle">σύστημα:</span>
          <div className="inline-flex flex-wrap items-center gap-0.5 rounded-full border border-border bg-bg-soft p-0.5">
            {SYSTEMS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSysId(s.id)}
                className={cn(
                  'rounded-full px-2 py-0.5 transition-colors',
                  sysId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {cutoffNeeded && (
          <label className="flex items-center gap-1.5 text-[11px]">
            <span className="text-fg-subtle">cutoff f_c:</span>
            <input
              type="range"
              min="0.3"
              max="6"
              step="0.1"
              value={cutoff}
              onChange={(e) => setCutoff(parseFloat(e.target.value))}
              className="w-32 accent-[rgb(var(--accent))]"
            />
            <span className="w-12 font-mono text-fg">{cutoff.toFixed(1)}·f₀</span>
          </label>
        )}

        <label className="ml-auto flex items-center gap-1.5 text-[11px] text-fg-muted">
          <input
            type="checkbox"
            checked={overlay}
            onChange={(e) => setOverlay(e.target.checked)}
            className="accent-[rgb(var(--accent))]"
          />
          Overlay x(t) στην έξοδο
        </label>
      </div>

      {/* Row 1: input + output time */}
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="x(t) — είσοδος" subtitle={signal.description}>
          <canvas
            ref={inRef}
            style={{ height: 120 }}
            className="block h-[120px] w-full"
            aria-label="Input time-domain signal"
          />
        </Panel>
        <Panel title="y(t) — έξοδος" subtitle="μετά τον φιλτράρισμα">
          <canvas
            ref={outRef}
            style={{ height: 120 }}
            className="block h-[120px] w-full"
            aria-label="Output time-domain signal"
          />
        </Panel>
      </div>

      {/* Row 2: |H(f)| with sampling dots */}
      <div className="mt-3">
        <Panel
          title="|H(f)| — φάσμα του συστήματος"
          subtitle="Τιμή σε κάθε ±k·f₀ → πολλαπλασιαστής της αρμονικής k"
        >
          <canvas
            ref={hMagRef}
            style={{ height: 110 }}
            className="block h-[110px] w-full"
            aria-label="Frequency response magnitude"
          />
        </Panel>
      </div>

      {/* Row 3: input + output spectra */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel title="|a_k| — φάσμα εισόδου" subtitle="discrete stems στα k·f₀">
          <canvas
            ref={inSpecRef}
            style={{ height: 100 }}
            className="block h-[100px] w-full"
            aria-label="Input amplitude spectrum"
          />
        </Panel>
        <Panel
          title="|b_k| = |a_k|·|H(kf₀)| — φάσμα εξόδου"
          subtitle="Ίδιες θέσεις, διαφορετικά ύψη"
        >
          <canvas
            ref={outSpecRef}
            style={{ height: 100 }}
            className="block h-[100px] w-full"
            aria-label="Output amplitude spectrum"
          />
        </Panel>
      </div>

      {/* Row 4: per-harmonic table */}
      <div className="mt-3 rounded-md border border-border bg-bg-soft px-3 py-2 text-[11px]">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-subtle">
          Ανά αρμονική
        </div>
        <table className="w-full tabular-nums">
          <thead>
            <tr className="text-left text-fg-subtle">
              <th className="pb-1 pr-2 font-medium">k</th>
              <th className="pb-1 pr-2 font-medium">f_k</th>
              <th className="pb-1 pr-2 font-medium">|a_k|</th>
              <th className="pb-1 pr-2 font-medium">|H(kf₀)|</th>
              <th className="pb-1 font-medium">|b_k| = |a_k|·|H|</th>
            </tr>
          </thead>
          <tbody>
            {harmonics
              .filter((h) => h.Ain > 1e-6)
              .map((h) => (
                <tr key={h.k}>
                  <td className="pr-2 py-0.5 font-mono text-fg-muted">{h.k}</td>
                  <td className="pr-2 py-0.5 font-mono text-fg-muted">
                    {h.k === 0 ? '0' : `${h.k}f₀`}
                  </td>
                  <td className="pr-2 py-0.5 font-mono">{h.Ain.toFixed(3)}</td>
                  <td className="pr-2 py-0.5 font-mono">
                    {h.Hmag < 0.01 ? '~0' : h.Hmag.toFixed(3)}
                  </td>
                  <td
                    className={cn(
                      'py-0.5 font-mono',
                      h.Aout < 0.01 && h.Ain >= 0.01 && 'text-red-500 line-through opacity-80',
                    )}
                  >
                    {h.Aout.toFixed(3)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Το βασικό μάθημα.</strong> Στον χρόνο το φιλτράρισμα φαίνεται μυστήριο
        (πώς ξέρει το RC ποιες κορυφές να ψαλιδίσει;). Στη συχνότητα η διαδικασία είναι
        τετριμμένη — κάθε <InlineMath>{'a_k'}</InlineMath> πολλαπλασιάζεται ξεχωριστά με{' '}
        <InlineMath>{'H(kf_0)'}</InlineMath>. Δοκίμασε να ρίξεις το cutoff σε ένα LPF
        ώστε να σβήσεις τα <InlineMath>{'k\\geq 3'}</InlineMath>: η έξοδος γίνεται
        αμέσως πιο «λεία», γιατί χάνει ακριβώς τις γρήγορες αρμονικές. Αυτό είναι το
        ίδιο μηχανισμό που γενικεύεται στον επόμενο μετασχηματισμό Fourier.
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
        {subtitle && <div className="text-[10px] text-fg-subtle">{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

// ─── Drawing ───────────────────────────────────────────────────────

type Harmonic = {
  k: number
  fk: number
  Ain: number
  phiIn: number
  Hmag: number
  Hphase: number
  Aout: number
  phiOut: number
}

function drawTime(
  canvas: HTMLCanvasElement,
  colors: Colors,
  harmonics: Harmonic[],
  which: 'in' | 'out',
  overlayIn: boolean,
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 8
  const padR = 8
  const padT = 6
  const padB = 14
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const midY = padT + innerH / 2

  // Compute both signals for consistent scaling
  const N = 480
  const xIn = new Float64Array(N)
  const xOut = new Float64Array(N)
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * (2 * T0)
    let vin = 0
    let vout = 0
    for (const h of harmonics) {
      if (h.k === 0) {
        vin += h.Ain
        vout += h.Aout
      } else {
        vin += h.Ain * Math.cos(2 * Math.PI * h.fk * t + h.phiIn)
        vout += h.Aout * Math.cos(2 * Math.PI * h.fk * t + h.phiOut)
      }
    }
    xIn[i] = vin
    xOut[i] = vout
  }
  let maxAbs = 0
  for (let i = 0; i < N; i++) {
    if (Math.abs(xIn[i]) > maxAbs) maxAbs = Math.abs(xIn[i])
    if (Math.abs(xOut[i]) > maxAbs) maxAbs = Math.abs(xOut[i])
  }
  if (maxAbs < 0.001) maxAbs = 1
  const scale = (innerH / 2) * 0.9

  // Zero line
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

  // Overlay input (faded) on output panel when requested
  if (which === 'out' && overlayIn) {
    ctx.strokeStyle = colors.accent + '55'
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (let i = 0; i < N; i++) {
      const x = padL + (i / (N - 1)) * innerW
      const y = midY - (xIn[i] / maxAbs) * scale
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Main trace
  const samples = which === 'in' ? xIn : xOut
  ctx.strokeStyle = which === 'in' ? colors.accent : '#f59e0b'
  ctx.lineWidth = 1.7
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = padL + (i / (N - 1)) * innerW
    const y = midY - (samples[i] / maxAbs) * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // T0 tick
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('T₀', padL + innerW / 2, H - 1)
}

function drawHResponse(
  canvas: HTMLCanvasElement,
  colors: Colors,
  system: SystemPreset,
  cutoff: number,
  sampleFreqs: number[],
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 32
  const padR = 12
  const padT = 8
  const padB = 22
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const fmax = Math.max(8, ...sampleFreqs.map((f) => Math.abs(f) + 1))
  const xOf = (f: number) => padL + ((f + fmax) / (2 * fmax)) * innerW
  const baselineY = H - padB
  const yOf = (m: number) => baselineY - m * innerH * 0.95

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, baselineY)
  ctx.lineTo(W - padR, baselineY)
  ctx.stroke()
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xOf(0), padT)
  ctx.lineTo(xOf(0), baselineY)
  ctx.stroke()

  // |H(f)| curve (continuous)
  const N = 500
  ctx.strokeStyle = colors.accent + 'bb'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const f = -fmax + (i / (N - 1)) * (2 * fmax)
    const mag = system.H(f, cutoff).mag
    const x = xOf(f)
    const y = yOf(mag)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Sampling dots at each ±k·f₀. A real periodic signal has harmonics at
  // BOTH ±k·f₀ (conjugate pairs), and |H| is even here, so the samples are
  // symmetric — draw the mirror dot too (matches the two-sided spectra below).
  for (const f of sampleFreqs) {
    const mirrored = f === 0 ? [0] : [f, -f]
    for (const ff of mirrored) {
      if (Math.abs(ff) > fmax) continue
      const mag = system.H(ff, cutoff).mag
      const x = xOf(ff)
      const y = yOf(mag)
      // Vertical guide
      ctx.strokeStyle = colors.border
      ctx.setLineDash([1, 3])
      ctx.beginPath()
      ctx.moveTo(x, baselineY)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.setLineDash([])
      // Dot
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // f-axis labels (integer multiples of f₀)
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
    if (Math.abs(f) % 2 === 0 || fmax <= 6) {
      const label = f === 1 ? 'f₀' : f === -1 ? '−f₀' : `${f}f₀`
      ctx.fillText(label, x, baselineY + 14)
    }
  }

  // y label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  ctx.fillText('|H|', 4, padT + 8)
  ctx.fillText('1', padL - 14, yOf(1) + 4)
  ctx.fillText('0', padL - 14, baselineY + 3)
}

function drawSpec(
  canvas: HTMLCanvasElement,
  colors: Colors,
  harmonics: Harmonic[],
  which: 'in' | 'out',
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 30
  const padR = 12
  const padT = 8
  const padB = 22
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const baselineY = H - padB

  const kmax = Math.max(5, ...harmonics.map((h) => h.k) ?? [5])
  const xOf = (k: number) => padL + ((k + kmax) / (2 * kmax)) * innerW
  // Use input max for scaling — keeps the comparison honest
  const maxA = Math.max(0.4, ...harmonics.map((h) => h.Ain)) * 1.15
  const yOf = (m: number) => baselineY - (m / maxA) * innerH

  // Baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, baselineY)
  ctx.lineTo(W - padR, baselineY)
  ctx.stroke()
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xOf(0), padT)
  ctx.lineTo(xOf(0), baselineY)
  ctx.stroke()

  // x-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  for (let k = -kmax; k <= kmax; k++) {
    if (k === 0) {
      ctx.fillText('0', xOf(0), baselineY + 14)
      continue
    }
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(xOf(k), baselineY)
    ctx.lineTo(xOf(k), baselineY + 3)
    ctx.stroke()
    if (Math.abs(k) <= 5 || k % 2 === 0) ctx.fillText(String(k), xOf(k), baselineY + 14)
  }

  // Stems at ±k for each harmonic. For real-form amplitudes,
  // |a_k| (the complex coefficient) = A_k/2 at ±f for k ≠ 0, and A_0 at f=0.
  const baseColor = which === 'in' ? colors.accent : '#f59e0b'
  for (const h of harmonics) {
    const A = which === 'in' ? h.Ain : h.Aout
    if (h.k === 0) {
      drawStem(ctx, xOf(0), baselineY, yOf(A), baseColor, 3.5)
      continue
    }
    const mag = A / 2
    if (mag < 1e-4) continue
    drawStem(ctx, xOf(h.k), baselineY, yOf(mag), baseColor, 3.5)
    drawStem(ctx, xOf(-h.k), baselineY, yOf(mag), baseColor, 3.5)
  }

  // y label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  ctx.fillText(which === 'in' ? '|aₖ|' : '|bₖ|', 4, padT + 8)
  ctx.textAlign = 'right'
  ctx.fillText('k', W - padR, baselineY - 4)
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
  ctx.arc(x, topY, 2.6, 0, 2 * Math.PI)
  ctx.fill()
}
