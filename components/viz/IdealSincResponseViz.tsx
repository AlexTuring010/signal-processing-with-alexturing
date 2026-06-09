'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Ideal LP in two stacked domains — the §4 FT-pair visual:
 *
 *   Top:    frequency domain. H(f) = rect(f / 2f_c): the ideal LP brick wall,
 *           1 inside the passband, 0 outside.
 *   Bottom: time domain. h(t) = 2 f_c · sinc(2 f_c t), the inverse Fourier
 *           transform of that rect — a sinc that extends to −∞ and +∞, with the
 *           t < 0 half shaded so the non-causality is visible directly.
 *
 * Stacking them one under the other makes the derivation in §4 literal: the
 * brick wall on top inverse-transforms into the infinite sinc below. The
 * ideal-vs-real trade-off comparison (ripple, transition band, sharpness
 * slider) lives separately in §7's <IdealVsRealFilterViz />, after those
 * quantities have actually been introduced (§5–§6).
 */

const FC = 1.0 // cutoff f_c (so the rect spans |f| < 1, i.e. width 2 f_c)
const PAD = 18

export function IdealSincResponseViz() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors)
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η κρουστική απόκριση του ιδανικού LP — από το rect H(f) στη sinc h(t)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω, στη <strong>συχνότητα</strong>: το ideal LP είναι ένα brick wall,{' '}
        <span className="font-mono">H(f) = rect(f / 2f_c)</span> — 1 μέσα στην
        passband, 0 έξω. Κάτω, στον <strong>χρόνο</strong>: ο inverse Fourier
        transform αυτού του rect είναι{' '}
        <span className="font-mono">h(t) = 2 f_c · sinc(2 f_c t)</span> — μια sinc
        που εκτείνεται μέχρι το <span className="font-mono">−∞</span> και το{' '}
        <span className="font-mono">+∞</span> και δεν μηδενίζεται ποτέ. Η
        σκιαγραφημένη ζώνη (<span className="font-mono">t &lt; 0</span>) είναι
        ακριβώς η μη-αιτιατότητα: για να βγάλεις την έξοδο τώρα θα χρειαζόσουν
        μελλοντικές τιμές του input.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ideal LP in two stacked panels: H(f) = rect brick wall in frequency on top, h(t) = sinc impulse response in time below with the t<0 region shaded for non-causality"
      />
    </figure>
  )
}

const FREQ_C = 'rgb(29, 78, 216)' // accent blue — brick wall, matches the chapter
const SINC_C = 'rgb(168, 85, 247)' // violet — impulse response

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Frequency on top, time below — one under the other.
  const topH = h * 0.44
  const botH = h - topH
  drawFreqRect(ctx, colors, 0, 0, w, topH)
  drawTimeSinc(ctx, colors, 0, topH, w, botH)
}

function drawFreqRect(
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
  ctx.fillText('Συχνότητα:  H(f) = rect(f / 2f_c) — brick wall', x0 + PAD, y0 + 14)

  // axes
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

  // brick wall curve
  ctx.strokeStyle = FREQ_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  ctx.lineTo(xt(-FC), yZero)
  ctx.lineTo(xt(-FC), yv(1))
  ctx.lineTo(xt(FC), yv(1))
  ctx.lineTo(xt(FC), yZero)
  ctx.lineTo(xt(fMax), yZero)
  ctx.stroke()

  ctx.fillStyle = `rgba(${getRGB(FREQ_C)}, 0.16)`
  ctx.beginPath()
  ctx.moveTo(xt(-FC), yZero)
  ctx.lineTo(xt(-FC), yv(1))
  ctx.lineTo(xt(FC), yv(1))
  ctx.lineTo(xt(FC), yZero)
  ctx.closePath()
  ctx.fill()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)
  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)
}

function drawTimeSinc(
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
  ctx.fillText('Χρόνος:  h(t) = 2 f_c · sinc(2 f_c t)', x0 + PAD, y0 + 14)

  // shade t < 0 region first so the curve stays crisp on top of it
  ctx.fillStyle = `rgba(${getRGB(SINC_C)}, 0.08)`
  ctx.fillRect(x0 + PAD, y0 + PAD + 16, xt(0) - (x0 + PAD), ph - PAD * 2 - 16)

  // baseline + y-axis at t = 0
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

  // sinc curve: 2 f_c · sinc(2 f_c t), with 2 f_c = 2 so the peak is h(0) = 2
  const fc = FC
  const STEPS = 800
  ctx.strokeStyle = SINC_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const x = 2 * fc * t
    const v = x === 0 ? 2 * fc : 2 * fc * (Math.sin(Math.PI * x) / (Math.PI * x))
    const px = xt(t)
    const py = yv(v / 5) // normalise so the peak sits at ~0.4 of the panel
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // non-causality annotation, over the shaded t < 0 region
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('μη-αιτιατό — ζει για t < 0', xt(-5), y0 + PAD + 30)

  // tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('+5', xt(5), yZero + 12)
  ctx.fillText('−5', xt(-5), yZero + 12)
  ctx.fillText('+10', xt(10), yZero + 12)
  ctx.fillText('−10', xt(-10), yZero + 12)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '168, 85, 247'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
