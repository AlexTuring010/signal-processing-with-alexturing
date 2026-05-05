'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * I/Q decomposition of a bandpass signal: x(t) = x_I(t) cos(2π f_c t) − x_Q(t) sin(2π f_c t).
 *
 * Three panels driven from one preset choice:
 *
 *   Top:    bandpass signal x(t) (the carrier "filled" with envelope/phase)
 *   Mid:    x_I(t) and x_Q(t), the in-phase and quadrature baseband components
 *   Bottom: trace of (x_I(t), x_Q(t)) in the complex plane — the chapter's
 *           load-bearing visual. AM traces a line on the real axis;
 *           FM/PM traces a circle (constant-envelope); SSB an ellipse.
 *
 * Presets cover AM, DSB-SC, FM, PM, SSB so the table in §5 of the chapter
 * has one viz row per row of the canonical-form table.
 */

type PresetId = 'am' | 'dsb' | 'fm' | 'pm' | 'ssb'

type Preset = {
  id: PresetId
  label: string
  description: string
  /** Returns (x_I, x_Q) at time t. Both are real-valued baseband signals. */
  iq: (t: number) => { xi: number; xq: number }
}

// Carrier frequency (visual cycles per unit time). Kept slow enough for the
// envelope/phase trajectory to be readable at the sample rate.
const FC = 4
const F_MSG = 0.4 // message frequency (slow vs carrier)

const PRESETS: Preset[] = [
  {
    id: 'am',
    label: 'AM (with carrier)',
    description:
      'x_I = A_c[1 + μ·m(t)], x_Q = 0. Envelope follows the message, phase is zero. (x_I, x_Q) trace lies on the real axis.',
    iq: (t) => {
      const mu = 0.7
      const m = Math.cos(2 * Math.PI * F_MSG * t)
      return { xi: 1 + mu * m, xq: 0 }
    },
  },
  {
    id: 'dsb',
    label: 'DSB-SC',
    description:
      'x_I = m(t), x_Q = 0. Envelope is |m(t)|; phase flips by π wherever m crosses zero. Trace is still on the real axis but passes through origin.',
    iq: (t) => ({ xi: Math.cos(2 * Math.PI * F_MSG * t), xq: 0 }),
  },
  {
    id: 'fm',
    label: 'FM',
    description:
      'x_I = A_c cos φ(t), x_Q = −A_c sin φ(t). Constant envelope (radius 1), all message info encoded in the phase trajectory φ(t). Trace is a circle.',
    iq: (t) => {
      const beta = 2.5
      const phi = beta * Math.sin(2 * Math.PI * F_MSG * t)
      return { xi: Math.cos(phi), xq: -Math.sin(phi) }
    },
  },
  {
    id: 'pm',
    label: 'PM',
    description:
      'x_I = A_c cos(k_p m(t)), x_Q = −A_c sin(k_p m(t)). Same circular trace as FM (constant envelope), but phase tracks the message directly.',
    iq: (t) => {
      const kp = 1.5
      const m = Math.cos(2 * Math.PI * F_MSG * t)
      return { xi: Math.cos(kp * m), xq: -Math.sin(kp * m) }
    },
  },
  {
    id: 'ssb',
    label: 'SSB (USB)',
    description:
      'x_I = m(t)/2, x_Q = −m̂(t)/2 (Hilbert). For m = cos, m̂ = sin, so trace is a circle of radius ½ but with elliptical asymmetry under broader m.',
    iq: (t) => {
      const m = Math.cos(2 * Math.PI * F_MSG * t)
      const mhat = Math.sin(2 * Math.PI * F_MSG * t) // Hilbert of cos = sin
      return { xi: 0.5 * m, xq: -0.5 * mhat }
    },
  },
]

export function IQDecompositionViz() {
  const [presetId, setPresetId] = useState<PresetId>('am')
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const preset = PRESETS.find((p) => p.id === presetId)!

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, preset, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, preset])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          I/Q decomposition — η canonical form κάθε ζωνοπερατού σήματος
        </h4>
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

      <div
        role="radiogroup"
        aria-label="Modulation preset"
        className="mb-2 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presetId === p.id}
            onClick={() => setPresetId(p.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              presetId === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mb-3 text-[11px] text-fg-subtle">{preset.description}</p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="I/Q decomposition: bandpass signal, in-phase/quadrature components, and complex-plane trajectory"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο πεδίο του χρόνου (πάνω), όλες οι διαμορφώσεις μοιάζουν με
        carrier «γεμισμένο» με κάποια κυματομορφή. Το **complex-plane trace**
        στη βάση τις ξεχωρίζει αμέσως: <strong>AM/DSB</strong> κινείται σε
        ευθεία (x_Q = 0), <strong>FM/PM</strong> σε κύκλο (constant envelope),
        και <strong>SSB</strong> σε έλλειψη. Αυτή η μία εικόνα συμπυκνώνει τη
        διαφορά πληροφορίας μεταξύ τους.
      </div>
    </figure>
  )
}

const PLUS_C = 'rgb(29, 78, 216)' // accent-blue, x_I
const MINUS_C = 'rgb(217, 119, 6)' // amber, x_Q
const TRACE_C = 'rgb(168, 85, 247)' // violet, complex-plane trail

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: Preset,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Layout: top half is two stacked time plots (bandpass + I/Q), bottom is
  // the complex-plane trace (square area on the right of bottom row).
  const topH = h * 0.55
  const botH = h - topH
  const bandpassH = topH * 0.42
  const iqH = topH - bandpassH

  drawBandpass(ctx, colors, 0, 0, w, bandpassH, preset, t)
  drawIQTime(ctx, colors, 0, bandpassH, w, iqH, preset, t)
  // Bottom: time-domain (x_I, x_Q) traces on left, complex-plane trail on right
  const traceW = Math.min(botH * 1.05, w * 0.42)
  drawIQValueReadout(ctx, colors, 0, topH, w - traceW, botH, preset, t)
  drawComplexPlane(ctx, colors, w - traceW, topH, traceW, botH, preset, t)
}

function drawBandpass(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const PAD = 12
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.2

  const xt = (tt: number) => lerp(tt, tStart, tEnd, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD, y0 + ph - PAD)
  const yZero = yv(0)

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Bandpass: x(t) = x_I(t) cos(2π f_c t) − x_Q(t) sin(2π f_c t)', x0 + PAD, y0 + 12)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD + 4)
  ctx.lineTo(xt(tNow), y0 + ph - PAD)
  ctx.stroke()
  ctx.setLineDash([])

  // envelope traces (faint dashed) — ±|g(t)|
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([2, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    const STEPS = 480
    for (let i = 0; i <= STEPS; i++) {
      const tt = lerp(i, 0, STEPS, tStart, tEnd)
      const { xi, xq } = preset.iq(tt)
      const env = sign * Math.sqrt(xi * xi + xq * xq)
      const px = xt(tt)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // bandpass waveform
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  ctx.beginPath()
  const STEPS = 800
  for (let i = 0; i <= STEPS; i++) {
    const tt = lerp(i, 0, STEPS, tStart, tEnd)
    const { xi, xq } = preset.iq(tt)
    const v = xi * Math.cos(2 * Math.PI * FC * tt) - xq * Math.sin(2 * Math.PI * FC * tt)
    const px = xt(tt)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawIQTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const PAD = 12
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.0

  const xt = (tt: number) => lerp(tt, tStart, tEnd, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD + 8, y0 + ph - PAD)
  const yZero = yv(0)

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('In-phase x_I(t) και Quadrature x_Q(t) — και τα δύο baseband', x0 + PAD, y0 + 10)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD + 8)
  ctx.lineTo(xt(tNow), y0 + ph - PAD)
  ctx.stroke()
  ctx.setLineDash([])

  // x_I (blue)
  drawComponent(ctx, xt, yv, tStart, tEnd, preset, 'xi', PLUS_C)
  // x_Q (orange)
  drawComponent(ctx, xt, yv, tStart, tEnd, preset, 'xq', MINUS_C)

  // legend
  ctx.fillStyle = PLUS_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('— x_I(t)', x0 + PAD + 4, y0 + ph - PAD + 4)
  ctx.fillStyle = MINUS_C
  ctx.fillText('— x_Q(t)', x0 + PAD + 60, y0 + ph - PAD + 4)
}

function drawComponent(
  ctx: CanvasRenderingContext2D,
  xt: (t: number) => number,
  yv: (v: number) => number,
  tStart: number,
  tEnd: number,
  preset: Preset,
  which: 'xi' | 'xq',
  color: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 360
  for (let i = 0; i <= STEPS; i++) {
    const tt = lerp(i, 0, STEPS, tStart, tEnd)
    const { xi, xq } = preset.iq(tt)
    const v = which === 'xi' ? xi : xq
    const px = xt(tt)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawIQValueReadout(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const PAD = 14
  const { xi, xq } = preset.iq(tNow)
  const env = Math.sqrt(xi * xi + xq * xq)
  const phase = Math.atan2(xq, xi)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Στιγμιαίες τιμές στο τρέχον t:', x0 + PAD, y0 + 16)

  ctx.font = '13px ui-sans-serif, system-ui, sans-serif'
  let row = y0 + 38
  const drawRow = (label: string, value: string, color: string) => {
    ctx.fillStyle = color
    ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(label, x0 + PAD, row)
    ctx.fillStyle = colors.fg
    ctx.font = '12px ui-monospace, monospace'
    ctx.fillText(value, x0 + PAD + 80, row)
    row += 22
  }
  drawRow('x_I(t)', xi.toFixed(3), PLUS_C)
  drawRow('x_Q(t)', xq.toFixed(3), MINUS_C)
  drawRow('V(t)', env.toFixed(3), TRACE_C)
  drawRow('θ(t)', `${(phase * 180 / Math.PI).toFixed(1)}°`, TRACE_C)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('V = √(x_I² + x_Q²),  θ = arctan(x_Q/x_I)', x0 + PAD, y0 + ph - PAD - 4)
}

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const cx = x0 + pw / 2
  const cy = y0 + ph / 2
  const R = Math.min(pw, ph) * 0.36

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Trace στο μιγαδικό επίπεδο: g(t) = x_I + j·x_Q', cx, y0 + 12)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + 12, cy)
  ctx.lineTo(x0 + pw - 12, cy)
  ctx.moveTo(cx, y0 + 22)
  ctx.lineTo(cx, y0 + ph - 12)
  ctx.stroke()

  // unit circle (faint, for FM/PM reference)
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()

  // Trail: sample (x_I, x_Q) over a sliding window ending at tNow
  const TRAIL_LEN = 240
  const tWindow = 6 / Math.max(F_MSG, 0.1) // a few message cycles
  ctx.strokeStyle = TRACE_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= TRAIL_LEN; i++) {
    const tt = tNow - tWindow + (i / TRAIL_LEN) * tWindow
    const { xi, xq } = preset.iq(tt)
    const px = cx + xi * R
    const py = cy - xq * R // canvas y inverted
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Current point
  const { xi, xq } = preset.iq(tNow)
  const px = cx + xi * R
  const py = cy - xq * R
  ctx.fillStyle = TRACE_C
  ctx.beginPath()
  ctx.arc(px, py, 4.5, 0, Math.PI * 2)
  ctx.fill()
  // line from origin to point (visualises V, θ)
  ctx.strokeStyle = TRACE_C
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('x_I (Re)', x0 + pw - 14, cy - 4)
  ctx.textAlign = 'left'
  ctx.fillText('x_Q (Im)', cx + 4, y0 + 28)
}
