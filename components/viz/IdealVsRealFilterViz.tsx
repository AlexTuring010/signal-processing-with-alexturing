'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Ideal vs real LP filter — two panels side by side (the §7 trade-off capstone):
 *
 *   Left:  ideal LP |H(f)| brick wall, with ±f_c labels
 *   Right: real LP |H(f)| with passband ripple δ_p, transition band, stopband
 *          ripple δ_s, and ±f_p/±f_s labels. The "sharpness" slider morphs the
 *          real curve from a wide transition to a sharp one.
 *
 * The point of the slider: a sharper cutoff (right panel approaching the left)
 * costs a narrower transition band — and (from §5) a longer impulse response.
 * The ideal LP's sinc impulse response itself lives in §4's
 * <IdealSincResponseViz />; every quantity labelled here (δ_p, δ_s, f_p, f_s,
 * the trade-off) has been introduced by the time the reader reaches §7.
 *
 * The "sharpness" slider controls the transition-band width via a cosine
 * roll-off (cleaner visual than a true Butterworth/Chebyshev curve and conveys
 * the sharpness/ripple trade-off well enough for pedagogy).
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
        Ideal vs real LP filter — το trade-off του απότομου cutoff
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά: το brick-wall ideal LP. Δεξιά: το real LP με passband ripple{' '}
        <span className="font-mono">δ_p</span>, ζώνη μετάβασης, και stopband
        ripple <span className="font-mono">δ_s</span>. Σύρε το slider «sharpness»:
        όσο πιο απότομο θέλεις το cutoff, τόσο στενότερη γίνεται η ζώνη μετάβασης
        — και (όπως είδαμε με την αποκοπή του sinc) τόσο πιο μακριά η κρουστική
        απόκριση πίσω από αυτό.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 240 }}
        className="block h-[240px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ideal brick-wall LP next to a real LP with passband ripple, a transition band and stopband ripple"
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

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  order: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Two filter responses side by side, each using the full canvas height.
  const splitX = w / 2
  drawIdealResponse(ctx, colors, 0, 0, splitX, h)
  drawRealResponse(ctx, colors, splitX, 0, w - splitX, h, order)
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
