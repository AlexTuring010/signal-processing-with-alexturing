'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Conventional AM spectrum for a single-tone message.
 *
 * For x(t) = [A_c + A_m cos(2π f_m t)] cos(2π f_c t), with μ = A_m/A_c:
 *
 *   X(f) = (A_c/2) [δ(f - f_c) + δ(f + f_c)]                  ← carrier
 *        + (μ A_c / 4) [δ(f - f_c - f_m) + δ(f + f_c + f_m)]  ← upper sidebands
 *        + (μ A_c / 4) [δ(f - f_c + f_m) + δ(f + f_c - f_m)]  ← lower sidebands
 *
 * Five visible "spike pairs" total. Carrier height stays constant; sideband
 * heights scale linearly with μ. Bandwidth = 2 f_m (twice the message
 * bandwidth W). All are impulses, drawn as labelled arrows.
 */

const FC = 4 // visual carrier position in normalised f units
const FM = 1 // visual message frequency
const A_C = 1 // carrier amplitude (held constant)

export function AMSpectrumViz() {
  const [mu, setMu] = useState(0.6)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mu)
  }, [mu])

  const carrierH = A_C / 2
  const sidebandH = (mu * A_C) / 4

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        AM φάσμα — carrier + δύο πλευρικές, για single-tone message
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Για <span className="font-mono">m(t) = A_m cos(2π f_m t)</span>: τρία
        ζεύγη impulses ανά πλευρά συχνότητας — ένα carrier στο{' '}
        <span className="font-mono">±f_c</span> (πορτοκαλί) και δύο sidebands
        στις <span className="font-mono">±f_c ± f_m</span> (μπλε). Σύρε το{' '}
        <span className="font-mono">μ</span> και δες τα sidebands να
        μεγαλώνουν, ενώ το carrier παραμένει σταθερό.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 220 }}
        className="block h-[220px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="AM spectrum: carrier impulses and sideband impulses"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          μ = <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
          {' · '}
          ύψος carrier = <span className="font-mono text-fg tabular-nums">A_c/2 = {carrierH.toFixed(2)}</span>
          {' · '}
          ύψος κάθε sideband = <span className="font-mono text-fg tabular-nums">μA_c/4 = {sidebandH.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index mu"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Παρατήρησε τρεις πράγματα: <strong>(α)</strong> Το carrier ύψος{' '}
        <span className="font-mono">A_c/2</span> δεν εξαρτάται από το{' '}
        <span className="font-mono">μ</span> — είναι πάντα εκεί, ακόμα κι αν δεν
        στέλνεις πληροφορία (μ=0). <strong>(β)</strong> Τα sidebands ύψους{' '}
        <span className="font-mono">μA_c/4</span> κουβαλάνε όλη την πληροφορία.{' '}
        <strong>(γ)</strong> Το συνολικό bandwidth είναι{' '}
        <span className="font-mono">2 f_m</span> — διπλάσιο του message bandwidth.
        Σε γενικότερο message με bandwidth <span className="font-mono">W</span>:{' '}
        <span className="font-mono">BW_AM = 2W</span>.
      </div>
    </figure>
  )
}

const CARRIER_C = 'rgb(217, 119, 6)' // amber for carrier
const SIDEBAND_C = 'rgb(29, 78, 216)' // accent blue for sidebands

const PAD_X = 28
const PAD_Y = 18

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = FC + FM + 1.5
  const fMin = -fMax
  const yMax = 0.7

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // x axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // arrow head
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(w - PAD_X + 6, yZero)
  ctx.lineTo(w - PAD_X - 4, yZero - 4)
  ctx.lineTo(w - PAD_X - 4, yZero + 4)
  ctx.closePath()
  ctx.fill()
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('f', w - PAD_X + 12, yZero + 4)

  // y axis at f=0
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y - 4)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Draw 6 carrier impulses + 4 sideband pairs
  const carrierH = A_C / 2
  const sidebandH = (mu * A_C) / 4

  // Carrier at +f_c and -f_c
  drawImpulse(ctx, xt(FC), yZero, yv(carrierH), CARRIER_C, 'A_c/2')
  drawImpulse(ctx, xt(-FC), yZero, yv(carrierH), CARRIER_C, 'A_c/2')

  // Sidebands at ±f_c ± f_m (4 visible spikes per side: USB at +f_c+f_m, LSB at +f_c-f_m, mirror)
  if (mu > 0.001) {
    drawImpulse(ctx, xt(FC + FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4')
    drawImpulse(ctx, xt(FC - FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4')
    drawImpulse(ctx, xt(-FC + FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4')
    drawImpulse(ctx, xt(-FC - FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4')
  }

  // Bandwidth annotation: BW = 2 f_m around +f_c
  const bwY = h - PAD_Y - 28
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(FC - FM), bwY)
  ctx.lineTo(xt(FC + FM), bwY)
  ctx.stroke()
  ctx.setLineDash([])
  // tick marks
  ctx.beginPath()
  ctx.moveTo(xt(FC - FM), bwY - 4)
  ctx.lineTo(xt(FC - FM), bwY + 4)
  ctx.moveTo(xt(FC + FM), bwY - 4)
  ctx.lineTo(xt(FC + FM), bwY + 4)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('BW = 2 f_m', xt(FC), bwY - 6)

  // Tick labels for ±f_c, ±f_c ± f_m
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xt(FC), yZero + 14)
  ctx.fillText('−f_c', xt(-FC), yZero + 14)
  ctx.fillText('f_c+f_m', xt(FC + FM), yZero + 24)
  ctx.fillText('f_c−f_m', xt(FC - FM), yZero + 24)
  ctx.fillText('0', xt(0), yZero + 14)
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTop: number,
  color: string,
  label: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTop)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, yTop - 6)
  ctx.lineTo(x - 4, yTop + 2)
  ctx.lineTo(x + 4, yTop + 2)
  ctx.closePath()
  ctx.fill()
  // label above the arrow if there's room
  if (yBase - yTop > 10) {
    ctx.font = '8.5px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = color
    ctx.fillText(label, x, yTop - 10)
  }
}
