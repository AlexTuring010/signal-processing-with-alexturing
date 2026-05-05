'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Pre-envelope construction shown in the frequency domain:
 *
 *   x(t) is a real bandpass signal — its spectrum X(f) has a "lump" around
 *   +f_c and a mirror lump around −f_c (conjugate symmetry).
 *
 *   x_p(t) = x(t) + j·x̂(t) has spectrum X_p(f) = (1 + sgn f)·X(f), which
 *   doubles the +f side and zeros the −f side.
 *
 * Static side-by-side panels make this visceral. We use a synthetic real
 * spectrum: two Gaussian bumps at ±f_c, of unit height each.
 */

const FC = 2.5
const SIGMA = 0.6

// Real bandpass spectrum |X(f)|: Gaussian pair, height 1 at ±f_c.
function origSpectrum(f: number): number {
  const a = Math.exp(-((f - FC) ** 2) / (2 * SIGMA * SIGMA))
  const b = Math.exp(-((f + FC) ** 2) / (2 * SIGMA * SIGMA))
  return a + b
}

// Pre-envelope spectrum: X_p(f) = (1 + sgn f)·X(f).
//   = 2·X(f) for f > 0
//   = 0 for f < 0
//   = X(0) at f = 0 (irrelevant for our example, X(0) ≈ 0).
function preEnvelopeSpectrum(f: number): number {
  if (f <= 0) return 0
  return 2 * origSpectrum(f)
}

export function PreEnvelopeSpectrumViz() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors)
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Pre-envelope: το αρνητικό μισό του φάσματος εξαφανίζεται
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά: το original real bandpass <span className="font-mono">X(f)</span>{' '}
        — λούτσα πλήρους πλάτους 1 σε κάθε πλευρά (συζυγής συμμετρία). Δεξιά: το{' '}
        <span className="font-mono">X_p(f) = (1 + sgn f)·X(f)</span> — η θετική
        πλευρά **διπλασιάζεται** σε ύψος 2, η αρνητική πλευρά γίνεται μηδέν.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Two-sided bandpass spectrum vs one-sided pre-envelope spectrum"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η ίδια πληροφορία «πακετάρεται» διαφορετικά: real σήμα στον χρόνο →
        two-sided συζυγώς-συμμετρικό φάσμα, ή complex σήμα στον χρόνο →
        one-sided φάσμα. Η αρνητική πλευρά του real signal ήταν ούτως ή άλλως
        ο μιγαδικός συζυγής της θετικής, οπότε δεν χάθηκε νέα πληροφορία.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const splitX = w / 2
  drawPanel(ctx, colors, 0, 0, splitX, h, origSpectrum, '|X(f)|', 'two-sided', 2.5)
  // separator
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(splitX, 8)
  ctx.lineTo(splitX, h - 8)
  ctx.stroke()
  drawPanel(ctx, colors, splitX, 0, w - splitX, h, preEnvelopeSpectrum, '|X_p(f)|', 'one-sided', 2.5)
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fn: (f: number) => number,
  label: string,
  badge: string,
  yLim: number,
) {
  if (!colors) return
  const PAD = 18
  const fMax = 5
  const fMin = -fMax

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.3, y0 + PAD + 12, y0 + ph - PAD)
  const yZero = yv(0)

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x0 + PAD, y0 + 14)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(badge, x0 + PAD, y0 + 26)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 12)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // Curve
  const STEPS = 400
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = fn(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Faint fill under the curve
  ctx.fillStyle = `rgba(${getRGB(colors.accent)}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = fn(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()

  // Tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)

  // y ticks at 1 and 2
  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('2', x0 + PAD - 3, yv(2) + 3)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
