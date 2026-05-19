'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * VSB shaping filter visualization.
 *
 * Two stacked panels:
 *   Top:    DSB-SC reference spectrum (both sidebands fully present at ±f_c)
 *   Mid:    The VSB shaping filter |H_VSB(f)| — a smooth transition from
 *           passband through f_c to stopband. Slider controls "vestige
 *           width" (how much of the lower sideband is preserved).
 *   Bottom: Resulting VSB spectrum after filter — full upper sideband +
 *           vestige of lower + the symmetric filter behavior at -f_c.
 *
 * Critical pedagogical point: the filter must have ODD-symmetric transition
 * around f_c (i.e., H(f_c + Δ) + H(f_c - Δ) = constant). This is what lets
 * envelope detection still work correctly.
 */

const FC = 4
const W = 1.5 // message bandwidth W

export function VSBShapingViz() {
  const [vestigeWidth, setVestigeWidth] = useState(0.4)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, vestigeWidth)
  }, [vestigeWidth])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        VSB shaping filter — μέρος LSB κρατιέται «κατάλοιπο» (vestige)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: η πλήρης DSB-SC (αναφορά). Μέσο: ο VSB shaping filter{' '}
        <span className="font-mono">H_VSB(f)</span> — έχει ομαλή μετάβαση γύρω
        από το <span className="font-mono">f_c</span> με odd symmetry. Κάτω: το
        αποτέλεσμα — πλήρης USB + vestige του LSB. Σύρε το slider για το πλάτος
        του vestige.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="VSB shaping filter and resulting spectrum"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Vestige width ={' '}
          <span className="font-mono text-fg tabular-nums">{vestigeWidth.toFixed(2)} W</span>
          {' · '}
          Total bandwidth ≈{' '}
          <span className="font-mono text-fg tabular-nums">
            {(W + vestigeWidth).toFixed(2)} (vs {2 * W} για DSB-SC, {W} για SSB)
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={vestigeWidth}
          onChange={(e) => setVestigeWidth(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Vestige width"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί η μετάβαση είναι ομαλή και odd-symmetric:</strong> ο
        envelope detector «προσθέτει» τις συμμετρικές πλευρές του spectrum γύρω
        από το <span className="font-mono">f_c</span>. Αν το{' '}
        <span className="font-mono">H_VSB(f_c + Δ) + H_VSB(f_c − Δ) = const</span>{' '}
        για κάθε <span className="font-mono">Δ</span> εντός message bandwidth,
        τότε η ανάκτηση του message μένει αμέλωτη — ο vestige συμπληρώνει
        ακριβώς όσο λείπει από τη μία πλευρά. Αυτό λέγεται **Nyquist symmetry**
        και είναι η μαθηματική απαίτηση που κάνει το VSB να δουλεύει με
        envelope detection.
      </div>
    </figure>
  )
}

const KEPT_C = 'rgb(29, 78, 216)'
const FILTER_C = 'rgb(217, 119, 6)'
const PAD_X = 26
const PAD_Y = 14

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  vestigeWidth: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  drawDSBReference(ctx, colors, 0, 0, w, rowH)
  drawShapingFilter(ctx, colors, 0, rowH, w, rowH, vestigeWidth)
  drawVSBResult(ctx, colors, 0, 2 * rowH, w, rowH, vestigeWidth)
}

function drawDSBReference(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  const fMax = FC + W + 1
  const fMin = -fMax
  const yMax = 1.2

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('DSB-SC αναφορά: |X_DSB(f)| (πλήρεις δύο sidebands)', x0 + PAD_X, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  // Triangular sidebands at ±f_c
  drawTriangle(ctx, xt, yv, FC - W, FC, 1, FILTER_C, false)
  drawTriangle(ctx, xt, yv, FC, FC + W, 1, FILTER_C, false)
  drawTriangle(ctx, xt, yv, -FC, -FC + W, 1, FILTER_C, false)
  drawTriangle(ctx, xt, yv, -FC - W, -FC, 1, FILTER_C, false)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)
}

function drawShapingFilter(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  vestigeWidth: number,
) {
  if (!colors) return
  const fMax = FC + W + 1
  const fMin = -fMax
  const yMax = 1.4

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.2, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('VSB shaping filter |H_VSB(f)|', x0 + PAD_X, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  // Smooth transition: H = 1 for f >= f_c + small_buffer, 0.5 at f_c, 0 below f_c - vestigeWidth
  // Use a raised-cosine shaped transition centered at f_c with width 2*vestigeWidth
  const shapingFilter = (f: number) => {
    const af = Math.abs(f)
    const transitionStart = FC - vestigeWidth
    const transitionEnd = FC + vestigeWidth
    if (af > FC + W) return 0 // outside the band
    if (af < transitionStart) return 0 // below the vestige
    if (af > transitionEnd) return 1 // full passband
    // Raised-cosine transition
    const u = (af - transitionStart) / (2 * vestigeWidth)
    return 0.5 * (1 - Math.cos(Math.PI * u))
  }

  // Draw H curve
  const STEPS = 600
  ctx.strokeStyle = FILTER_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = shapingFilter(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // 0.5 line at f_c (the symmetry point)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yv(0.5))
  ctx.lineTo(xt(fMax), yv(0.5))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('0.5', x0 + PAD_X - 3, yv(0.5) + 3)
  ctx.fillText('1', x0 + PAD_X - 3, yv(1) + 3)

  // Mark f_c on x axis
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)
}

function drawVSBResult(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  vestigeWidth: number,
) {
  if (!colors) return
  const fMax = FC + W + 1
  const fMin = -fMax
  const yMax = 1.2

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X_VSB(f)| = |X_DSB(f)| · |H_VSB(f)| — ολόκληρη USB + vestige LSB', x0 + PAD_X, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  // For VSB: at +f_c, USB (f > f_c) is at full height, LSB (f < f_c) is shaped by the filter going from 1 down to 0
  const shapingFilter = (f: number) => {
    const af = Math.abs(f)
    const transitionStart = FC - vestigeWidth
    const transitionEnd = FC + vestigeWidth
    if (af > FC + W) return 0
    if (af < transitionStart) return 0
    if (af > transitionEnd) return 1
    const u = (af - transitionStart) / (2 * vestigeWidth)
    return 0.5 * (1 - Math.cos(Math.PI * u))
  }
  const dsbBase = (f: number) => {
    // Triangle bumps: peak at ±f_c, falling linearly to 0 at ±f_c ± W
    const af = Math.abs(f)
    if (af < FC - W || af > FC + W) return 0
    return 1 - Math.abs(af - FC) / W
  }

  // Filled curve for VSB result
  ctx.fillStyle = `rgba(29, 78, 216, 0.30)`
  ctx.strokeStyle = KEPT_C
  ctx.lineWidth = 1.6
  const STEPS = 600
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = dsbBase(f) * shapingFilter(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Mark vestige region in label
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)
  ctx.fillText('vestige', xt(FC - vestigeWidth / 2), yv(0.3))
  ctx.fillText('full USB', xt(FC + W / 2), yv(0.6))
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  yv: (v: number) => number,
  x0: number,
  pw: number,
  y0: number,
  ph: number,
  yZero: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD_Y + 4)
  ctx.lineTo(xt(0), y0 + ph - PAD_Y)
  ctx.stroke()
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  fLeft: number,
  fRight: number,
  height: number,
  color: string,
  filled: boolean,
) {
  // Triangle peaking in the middle
  const fPeak = (fLeft + fRight) / 2
  ctx.strokeStyle = color
  ctx.fillStyle = filled ? color : `rgba(217, 119, 6, 0.25)`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yv(0))
  ctx.lineTo(xt(fPeak), yv(height))
  ctx.lineTo(xt(fRight), yv(0))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
