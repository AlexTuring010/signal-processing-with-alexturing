'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Ideal LP impulse response — a single panel showing
 * h(t) = 2 f_c · sinc(2 f_c t): a sinc that extends to −∞ and +∞, with the
 * t < 0 half shaded so the non-causality is visible directly.
 *
 * This is the §4 visual (the derivation of h_LP and why it can't be built in
 * real time). The ideal-vs-real trade-off comparison — ripple, transition
 * band, the sharpness slider — lives in §7's <IdealVsRealFilterViz />, after
 * those quantities have actually been introduced (§5–§6).
 */

const FC = 1.0 // cutoff used for the displayed sinc

export function IdealSincResponseViz() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawIdealSinc(canvas, colors)
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η κρουστική απόκριση του ιδανικού LP — sinc μέχρι το ±∞
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        <span className="font-mono">h(t) = 2 f_c · sinc(2 f_c t)</span>: μια sinc
        που εκτείνεται μέχρι το <span className="font-mono">−∞</span> και το{' '}
        <span className="font-mono">+∞</span> και δεν μηδενίζεται ποτέ τελείως. Η
        σκιαγραφημένη ζώνη αριστερά (<span className="font-mono">t &lt; 0</span>)
        είναι ακριβώς η μη-αιτιατότητα: για να βγάλεις την έξοδο τώρα θα
        χρειαζόσουν μελλοντικές τιμές του input.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ideal LP impulse response: a sinc extending to ±∞ with the t<0 region shaded to show non-causality"
      />
    </figure>
  )
}

const SINC_C = 'rgb(168, 85, 247)' // violet
const PAD = 18

function drawIdealSinc(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMin = -10
  const tMax = 10
  const yLim = 0.45

  const xt = (t: number) => lerp(t, tMin, tMax, PAD, w - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.6, PAD + 16, h - PAD)
  const yZero = yv(0)

  // shade t < 0 region first so the curve stays crisp on top of it
  ctx.fillStyle = `rgba(${getRGB(SINC_C)}, 0.08)`
  ctx.fillRect(PAD, PAD + 16, xt(0) - PAD, h - PAD * 2 - 16)

  // baseline + y-axis at t = 0
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yZero)
  ctx.lineTo(w - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD + 16)
  ctx.lineTo(xt(0), h - PAD)
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

  // non-causality annotation, sitting over the shaded t < 0 region
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('μη-αιτιατό — ζει για t < 0', xt(-5), PAD + 30)

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
