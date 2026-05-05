'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Ideal vs real LP filter — three panels:
 *
 *   Top-left:  ideal LP |H(f)| brick wall, with fp/fs labels
 *   Top-right: real LP |H(f)| with passband ripple δ_p, transition band,
 *              stopband ripple δ_s. Slider for "filter order" morphs
 *              the real curve from coarse to sharp.
 *   Bottom:    ideal LP impulse response h(t) — a sinc that extends to
 *              −∞ and +∞. The reader sees the non-causality directly.
 *
 * The "filter order" slider controls the transition-band width via a
 * cosine roll-off (cleaner visual than a true Butterworth/Chebyshev curve
 * and conveys the sharpness/ripple trade-off well enough for pedagogy).
 */

const FP = 1.0 // passband edge
const FS_BASE = 1.6 // stopband edge at order = 0 (widest transition)
const FS_TIGHT = 1.1 // stopband edge at order = 1 (sharpest)
const DELTA_P = 0.06 // passband ripple amplitude
const DELTA_S = 0.05 // stopband ripple amplitude

export function IdealVsRealFilterViz() {
  const [order, setOrder] = useState(0.4)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, order)
  }, [order])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ideal vs real LP filter — και η μη-αιτιατή sinc του ιδανικού
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: το brick-wall ideal LP δίπλα στο real LP με ripple, transition
        band, stopband ripple. Σύρε το slider «sharpness» για να δεις το
        trade-off μεταξύ απότομου cutoff και πολυπλοκότητας. Κάτω: η κρουστική
        απόκριση του ιδανικού — μια sinc που εκτείνεται μέχρι το{' '}
        <span className="font-mono">−∞</span> και το <span className="font-mono">+∞</span>.
        Αυτή ακριβώς είναι η μη-αιτιατότητα.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ideal vs real LP filter response and ideal sinc impulse response"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Sharpness ={' '}
          <span className="font-mono text-fg tabular-nums">{order.toFixed(2)}</span>
          <span className="ml-2 text-fg-subtle">(0 = πιο πλατύ transition · 1 = πιο απότομο)</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={order}
          onChange={(e) => setOrder(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Filter sharpness"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Πιο απότομο cutoff = πιο μακριά κρουστική απόκριση (περισσότερη μνήμη,
        περισσότερη καθυστέρηση). Πιο μικρό ripple = πιο πολύπλοκο φίλτρο.
        Είναι το θεμελιώδες σχεδιαστικό trade-off — δεν παίρνεις «ιδανικό»
        χωρίς κόστος.
      </div>
    </figure>
  )
}

const IDEAL_C = 'rgb(29, 78, 216)' // accent
const REAL_C = 'rgb(217, 119, 6)' // amber
const SINC_C = 'rgb(168, 85, 247)' // violet

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  order: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Top row: two filter responses side by side. Bottom row: sinc impulse response
  const topH = h * 0.55
  const botH = h - topH
  const splitX = w / 2

  drawIdealResponse(ctx, colors, 0, 0, splitX, topH)
  drawRealResponse(ctx, colors, splitX, 0, w - splitX, topH, order)
  drawIdealSinc(ctx, colors, 0, topH, w, botH)
}

const PAD = 18

function drawIdealResponse(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  const fMin = -2.5
  const fMax = 2.5
  const yMax = 1.3

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -0.2, y0 + PAD + 16, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Ideal LP — brick wall', x0 + PAD, y0 + 14)

  baseAxes(ctx, colors, x0, y0, pw, ph, xt, yZero)

  // Brick wall curve
  ctx.strokeStyle = IDEAL_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  ctx.lineTo(xt(-FP), yZero)
  ctx.lineTo(xt(-FP), yv(1))
  ctx.lineTo(xt(FP), yv(1))
  ctx.lineTo(xt(FP), yZero)
  ctx.lineTo(xt(fMax), yZero)
  ctx.stroke()

  ctx.fillStyle = `rgba(${getRGB(IDEAL_C)}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xt(-FP), yZero)
  ctx.lineTo(xt(-FP), yv(1))
  ctx.lineTo(xt(FP), yv(1))
  ctx.lineTo(xt(FP), yZero)
  ctx.closePath()
  ctx.fill()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FP), yZero + 12)
  ctx.fillText('−f_c', xt(-FP), yZero + 12)
  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)
}

function drawRealResponse(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  order: number,
) {
  if (!colors) return
  const fMin = -2.5
  const fMax = 2.5
  const yMax = 1.3

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -0.2, y0 + PAD + 16, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Real LP — με ripple + transition', x0 + PAD, y0 + 14)

  baseAxes(ctx, colors, x0, y0, pw, ph, xt, yZero)

  // Real-filter curve: cosine roll-off in transition, with ripple in pass/stop.
  const fs = lerp(order, 0, 1, FS_BASE, FS_TIGHT)
  const responseAt = (f: number) => {
    const a = Math.abs(f)
    if (a <= FP) {
      // passband: 1 + small ripple
      return 1 + DELTA_P * Math.cos(2 * Math.PI * 3 * a)
    }
    if (a >= fs) {
      // stopband: small ripple around 0
      return Math.max(0, DELTA_S * Math.cos(2 * Math.PI * 2 * a))
    }
    // transition: smooth cosine roll-off
    const u = (a - FP) / (fs - FP)
    return 0.5 * (1 + Math.cos(Math.PI * u))
  }

  const STEPS = 600
  ctx.strokeStyle = REAL_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = responseAt(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.fillStyle = `rgba(${getRGB(REAL_C)}, 0.16)`
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = responseAt(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()

  // dashed lines at f_p and f_s
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  for (const f of [FP, -FP, fs, -fs]) {
    ctx.beginPath()
    ctx.moveTo(xt(f), yv(1.2))
    ctx.lineTo(xt(f), yZero + 10)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_p', xt(FP), yZero + 12)
  ctx.fillText('+f_s', xt(fs), yZero + 12)
  ctx.fillText('−f_p', xt(-FP), yZero + 12)
  ctx.fillText('−f_s', xt(-fs), yZero + 12)
  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)

  // ripple annotation
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText(`δ_p ≈ ${DELTA_P.toFixed(2)}`, x0 + PAD + 4, yv(1) - 4)
  ctx.fillText(`δ_s ≈ ${DELTA_S.toFixed(2)}`, x0 + PAD + 4, yZero - 6)
}

function drawIdealSinc(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  const tMin = -10
  const tMax = 10
  const yLim = 0.45

  const xt = (t: number) => lerp(t, tMin, tMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.6, y0 + PAD + 16, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Κρουστική απόκριση του ideal LP — h(t) = 2 f_c · sinc(2 f_c t)', x0 + PAD, y0 + 14)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  // y-axis at t = 0
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 16)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // sinc curve: 2 f_c · sinc(2 f_c t), with 2 f_c = 2 to keep peak at h(0) = 2
  // Use FP as the cutoff for the ideal LP
  const fc = FP
  const STEPS = 800
  ctx.strokeStyle = SINC_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const x = 2 * fc * t
    const v = x === 0 ? 2 * fc : 2 * fc * (Math.sin(Math.PI * x) / (Math.PI * x))
    // normalise so peak is ~0.4 (visual scale)
    const px = xt(t)
    const py = yv(v / 5)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // shade t < 0 region to highlight non-causality
  ctx.fillStyle = `rgba(${getRGB(SINC_C)}, 0.08)`
  ctx.fillRect(x0 + PAD, y0 + PAD + 16, xt(0) - (x0 + PAD), ph - PAD * 2 - 16)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('μη-αιτιατό — ζει για t < 0', xt(-5), y0 + PAD + 30)

  // tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('+5', xt(5), yZero + 12)
  ctx.fillText('−5', xt(-5), yZero + 12)
  ctx.fillText('+10', xt(10), yZero + 12)
  ctx.fillText('−10', xt(-10), yZero + 12)
}

function baseAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  xt: (f: number) => number,
  yZero: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 16)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
