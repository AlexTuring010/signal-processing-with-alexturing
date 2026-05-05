'use client'

import { useRef, useEffect, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM noise spectrum is "triangular" — output noise PSD ∝ f² inside the
 * message band, after FM demodulation.
 *
 * Two stacked panels:
 *   1. Pre-demodulation: white noise PSD (flat) at the receiver input
 *      after the bandpass filter — flat over [-B/2, B/2] around f_c.
 *   2. Post-demodulation: noise PSD at the output of the FM discriminator
 *      = (constant) · f² for |f| ≤ W. This is the famous "noise triangle".
 *
 * Sliders: noise level N_0/2, message bandwidth W. The user can see the
 * triangular shape and how lowering W cuts off more noise (because the
 * noise grows quadratically with f, low-pass filtering at W eliminates
 * most of it).
 *
 * Pedagogical point: pre-emphasis (boost high-freq message components
 * before transmission) and de-emphasis (cut them in the receiver) is
 * used commercially because the triangle means high-frequency message
 * content suffers most from FM noise.
 */

export function FMNoiseTriangleViz() {
  const [N0, setN0] = useState(0.6)
  const [W, setW] = useState(0.7) // 0..1 message bandwidth
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, N0, W)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, N0, W)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [N0, W])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        FM noise triangle — γιατί ο θόρυβος μεγαλώνει με τη συχνότητα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: ο θόρυβος που μπαίνει στον FM discriminator είναι λευκός
        (επίπεδη PSD). Κάτω: ο θόρυβος που <strong>βγαίνει</strong> έχει
        PSD ∝ f². Δηλαδή, οι υψηλές συχνότητες του message «ακούν» πολύ
        περισσότερο θόρυβο από τις χαμηλές. Για αυτό υπάρχει το{' '}
        <strong>pre-emphasis / de-emphasis</strong>: ενισχύουμε τις υψηλές
        πριν στείλουμε, τις κόβουμε στον δέκτη — και ο θόρυβος κόβεται μαζί.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM noise triangle visualization"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Επίπεδο θορύβου N₀ ={' '}
            <span className="font-mono text-fg tabular-nums">{N0.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.05}
            value={N0}
            onChange={(e) => setN0(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Message bandwidth W ={' '}
            <span className="font-mono text-fg tabular-nums">
              {(W * 100).toFixed(0)}%
            </span>{' '}
            του Carson BW
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.02}
            value={W}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  N0: number,
  W: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const rowH = h / 2 - 8
  drawPreDemod(ctx, colors, 0, 0, w, rowH, N0)
  drawPostDemod(ctx, colors, 0, h / 2 + 8, w, rowH, N0, W)
}

function drawPreDemod(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  N0: number,
) {
  if (!colors) return
  const PAD_X = 36
  const PAD_TOP = 22
  const PAD_BOTTOM = 22
  const xf = (f: number) => lerp(f, -1.2, 1.2, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 0, 1.5, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Είσοδος discriminator: λευκός θόρυβος (PSD επίπεδη)', x0 + PAD_X, y0 + 12)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Flat noise rectangle from -1 to 1 with height N0
  const left = xf(-1)
  const right = xf(1)
  const yTop = yv(N0)
  ctx.fillStyle = 'rgba(220, 38, 38, 0.18)'
  ctx.fillRect(left, yTop, right - left, yAxis - yTop)
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(left, yAxis)
  ctx.lineTo(left, yTop)
  ctx.lineTo(right, yTop)
  ctx.lineTo(right, yAxis)
  ctx.stroke()

  // Labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('-B/2', xf(-1), yAxis + 14)
  ctx.fillText('0', xf(0), yAxis + 14)
  ctx.fillText('+B/2', xf(1), yAxis + 14)
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.fillText('N₀/2', xf(0), yTop - 5)
}

function drawPostDemod(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  N0: number,
  W: number,
) {
  if (!colors) return
  const PAD_X = 36
  const PAD_TOP = 22
  const PAD_BOTTOM = 22
  const xf = (f: number) => lerp(f, -1.2, 1.2, x0 + PAD_X, x0 + pw - PAD_X)
  const yMax = 1.5
  const yv = (v: number) => lerp(v, 0, yMax, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Έξοδος discriminator: PSD ∝ f²  («triangle»)', x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // f² parabola from -1 to 1, scaled so peak = N0 * 1.2 (visual)
  const peak = N0 * 1.2
  ctx.fillStyle = 'rgba(220, 38, 38, 0.12)'
  ctx.beginPath()
  ctx.moveTo(xf(-1), yAxis)
  const STEPS = 80
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -1, 1)
    const v = peak * f * f
    ctx.lineTo(xf(f), yv(v))
  }
  ctx.lineTo(xf(1), yAxis)
  ctx.closePath()
  ctx.fill()

  // Outline
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -1, 1)
    const v = peak * f * f
    const px = xf(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Pass-band cut at ±W (LPF after demod)
  const left = xf(-W)
  const right = xf(W)

  // Shade only the part within ±W as "noise that survives"
  ctx.fillStyle = 'rgba(220, 38, 38, 0.4)'
  ctx.beginPath()
  ctx.moveTo(left, yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -W, W)
    const v = peak * f * f
    ctx.lineTo(xf(f), yv(v))
  }
  ctx.lineTo(right, yAxis)
  ctx.closePath()
  ctx.fill()

  // LPF cutoff lines
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(left, y0 + PAD_TOP)
  ctx.lineTo(left, yAxis)
  ctx.moveTo(right, y0 + PAD_TOP)
  ctx.lineTo(right, yAxis)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(34, 197, 94)'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('LPF cut at ±W', (left + right) / 2, y0 + PAD_TOP - 4)

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('-B/2', xf(-1), yAxis + 14)
  ctx.fillText('-W', xf(-W), yAxis + 14)
  ctx.fillText('0', xf(0), yAxis + 14)
  ctx.fillText('+W', xf(W), yAxis + 14)
  ctx.fillText('+B/2', xf(1), yAxis + 14)
}
