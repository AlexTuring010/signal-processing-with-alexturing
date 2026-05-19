'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Carson's rule visualization.
 *
 * Shows the same Bessel sideband forest as BesselSpectrumViz but adds
 * a clear "energy contained vs N" curve underneath, illustrating WHY
 * the cutoff is roughly N ≈ β + 1.
 *
 * Top panel: spectrum (impulses at f_c ± n f_m).
 * Bottom panel: cumulative power fraction = (J_0² + 2 Σ_{k=1..n} J_k²)
 * vs n, with horizontal lines at 0.98 and 0.99 thresholds. The bottom
 * curve shows how quickly we accumulate the total signal power as we
 * include more sidebands. Carson's rule corresponds to ~98% energy.
 */

const FC_VIS = 24
const N_MAX = 14

export function CarsonRuleViz() {
  const [beta, setBeta] = useState(3.0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, beta)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, beta)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta])

  // For the readout — find smallest N where cumulative power ≥ 98%
  let p = besselJ(0, beta) ** 2
  let n98 = 0
  for (let n = 1; n <= 30; n++) {
    p += 2 * besselJ(n, beta) ** 2
    if (p >= 0.98) {
      n98 = n
      break
    }
  }
  const carsonN = beta + 1
  const carsonBW = 2 * carsonN

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Carson's rule — γιατί ±(β+1) sidebands αρκούν
      </h4>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: το FM φάσμα και η ζώνη που ορίζει το Carson (μωβ). Κάτω: η
        αθροιστική ισχύς (πόσο % της ολικής ενέργειας έχουμε όταν κρατάμε
        τα ±n sidebands). Η γραμμή στο 98% είναι το cutoff του Carson — και
        περνάει κοντά στο <span className="font-mono">n = β+1</span>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Carson's rule visualization"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β = <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={8}
          step={0.05}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Carson N = β+1
          </div>
          <div className="font-mono text-fg tabular-nums">{carsonN.toFixed(2)}</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Πραγματικό N (98%)
          </div>
          <div className="font-mono text-fg tabular-nums">{n98}</div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            B = 2(β+1)f_m
          </div>
          <div className="font-mono text-fg tabular-nums">{carsonBW.toFixed(2)} · f_m</div>
        </div>
      </div>
    </figure>
  )
}

const POS_C = 'rgb(29, 78, 216)'
const NEG_C = 'rgb(217, 119, 6)'
const CARRIER_C = 'rgb(168, 85, 247)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Top panel: spectrum
  drawSpectrum(ctx, colors, 0, 0, w, h * 0.55, beta)
  // Divider
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(16, h * 0.55)
  ctx.lineTo(w - 16, h * 0.55)
  ctx.stroke()
  // Bottom panel: cumulative power
  drawCumulative(ctx, colors, 0, h * 0.55, w, h * 0.45, beta)
}

function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
) {
  if (!colors) return
  const PAD_X = 32
  const PAD_TOP = 18
  const PAD_BOTTOM = 26
  const fMin = FC_VIS - 9
  const fMax = FC_VIS + 9
  const xf = (f: number) => lerp(f, fMin, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yMagMax = 0.7
  const yPlot = (mag: number) => lerp(mag, 0, yMagMax, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  // Carson shading
  const carsonLeft = xf(FC_VIS - (beta + 1))
  const carsonRight = xf(FC_VIS + (beta + 1))
  ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'
  ctx.fillRect(carsonLeft, y0 + PAD_TOP - 4, carsonRight - carsonLeft, yAxis - y0 - PAD_TOP + 4)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(carsonLeft, y0 + PAD_TOP - 4)
  ctx.lineTo(carsonLeft, yAxis)
  ctx.moveTo(carsonRight, y0 + PAD_TOP - 4)
  ctx.lineTo(carsonRight, yAxis)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = CARRIER_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Carson zone B = 2(β+1)f_m', (carsonLeft + carsonRight) / 2, y0 + PAD_TOP - 5)

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = -9; n <= 9; n++) {
    const x = xf(FC_VIS + n)
    if (n === 0) {
      ctx.fillStyle = colors.fg
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('f_c', x, yAxis + 14)
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    } else if (n % 2 === 0) {
      const sign = n > 0 ? '+' : '−'
      ctx.fillText(`${sign}${Math.abs(n)}`, x, yAxis + 14)
    }
  }

  // Stems
  for (let n = -N_MAX; n <= N_MAX; n++) {
    const f = FC_VIS + n
    if (f < fMin || f > fMax) continue
    const J = besselJ(n, beta)
    const mag = Math.abs(J) / 2
    if (mag < 0.001) continue
    const x = xf(f)
    const yTop = yPlot(mag)
    const isNeg = J < 0
    const isCarrier = n === 0
    ctx.strokeStyle = isCarrier ? CARRIER_C : isNeg ? NEG_C : POS_C
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCarrier ? 2.5 : 1.5
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yTop)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x - 2.5, yTop + 4)
    ctx.lineTo(x, yTop)
    ctx.lineTo(x + 2.5, yTop + 4)
    ctx.closePath()
    ctx.fill()
  }
}

function drawCumulative(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
) {
  if (!colors) return
  const PAD_X = 32
  const PAD_TOP = 14
  const PAD_BOTTOM = 26
  const N_DRAW = 12

  const xf = (n: number) => lerp(n, 0, N_DRAW, x0 + PAD_X, x0 + pw - PAD_X)
  const yp = (p: number) => lerp(p, 0, 1.05, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.moveTo(x0 + PAD_X, yp(0))
  ctx.lineTo(x0 + PAD_X, yp(1.05))
  ctx.stroke()

  // Y-axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const p of [0.25, 0.5, 0.75, 0.98, 1]) {
    const y = yp(p)
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X - 3, y)
    ctx.lineTo(x0 + PAD_X, y)
    ctx.stroke()
    ctx.fillText(p === 0.98 ? '98%' : `${p * 100}%`, x0 + PAD_X - 5, y + 3)
  }

  // 98% threshold line
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yp(0.98))
  ctx.lineTo(x0 + pw - PAD_X, yp(0.98))
  ctx.stroke()
  ctx.setLineDash([])

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  for (let n = 0; n <= N_DRAW; n += 2) {
    const x = xf(n)
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yAxis + 3)
    ctx.stroke()
    ctx.fillText(`${n}`, x, yAxis + 14)
  }
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('Σημαντικά sidebands ±n', x0 + PAD_X, yAxis + 24)

  // Cumulative power curve
  let p = besselJ(0, beta) ** 2
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xf(0), yp(p))
  for (let n = 1; n <= N_DRAW; n++) {
    p += 2 * besselJ(n, beta) ** 2
    ctx.lineTo(xf(n), yp(Math.min(p, 1.05)))
  }
  ctx.stroke()

  // Carson position marker
  const carsonN = beta + 1
  if (carsonN <= N_DRAW) {
    const x = xf(carsonN)
    ctx.strokeStyle = 'rgb(168, 85, 247)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(x, yp(0))
    ctx.lineTo(x, yp(1.05))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgb(168, 85, 247)'
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`n = β+1 = ${carsonN.toFixed(1)}`, x + 4, yp(0.5))
  }

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Αθροιστική ισχύς J₀² + 2·Σ Jₖ²', x0 + PAD_X, y0 + PAD_TOP - 2)
}
