'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Tiny static illustration of what an "envelope" (περιβάλλουσα) is: a row of
 * discrete vertical lines — "a fence of pickets at different heights" — with a
 * smooth curve threaded through their tops.
 *
 * Lives in /foundations/fourier-transform §2.1, right where the prose asks the
 * reader to *imagine* exactly this picture. No sliders — it is a concept image,
 * not a parameter explorer. The envelope is drawn in the same mauve as the
 * sampling viz below it (where mauve = the curve the coefficients sit on).
 */

// The smooth hump the line-tops lie on. x ∈ [-1, 1]; a clean bell so the
// heights clearly vary and the "curve through the tops" reads instantly.
function envelope(x: number) {
  return Math.exp(-3.2 * x * x)
}

const MAUVE = '#7c3aed'

export function EnvelopeConceptViz() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !ref.current) return
    draw(ref.current, colors)
  }, [])

  return (
    <figure className="my-5 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Τι είναι μια «περιβάλλουσα» (envelope)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διακριτές γραμμές διαφορετικού ύψους (σαν φράχτη με κάγκελα)· η λεία καμπύλη που περνά από
        τις <strong>μύτες</strong> τους είναι η{' '}
        <span style={{ color: MAUVE }} className="font-semibold">
          περιβάλλουσα
        </span>
        .
      </p>
      <canvas
        ref={ref}
        style={{ height: 160 }}
        className="block h-[160px] w-full"
        aria-label="Discrete vertical lines of varying height with a smooth envelope curve passing through their tops"
      />
    </figure>
  )
}

function draw(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padX = 26
  const padTop = 32
  const padBot = 18
  const baseY = h - padBot

  const xMin = -1.15
  const xMax = 1.15
  const xt = (x: number) => lerp(x, xMin, xMax, padX, w - padX)
  const yv = (v: number) => lerp(v, 0, 1, baseY, padTop) // v ∈ [0,1] → baseline..top

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, baseY)
  ctx.lineTo(w - padX, baseY)
  ctx.stroke()

  // smooth envelope curve (dashed mauve) through the tops
  ctx.strokeStyle = MAUVE
  ctx.lineWidth = 2
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  const N = 220
  for (let i = 0; i <= N; i++) {
    const x = lerp(i, 0, N, -1, 1)
    const px = xt(x)
    const py = yv(envelope(x))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // discrete vertical lines ("κάγκελα") with a dot at each top
  const K = 11
  for (let k = 0; k < K; k++) {
    const x = lerp(k, 0, K - 1, -1, 1)
    const px = xt(x)
    const py = yv(envelope(x))
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(px, baseY)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(px, py, 3, 0, 2 * Math.PI)
    ctx.fill()
  }

  // label «περιβάλλουσα» at the top, with a short leader down to the peak
  const cx = xt(0)
  ctx.fillStyle = MAUVE
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('περιβάλλουσα', cx, 13)
  ctx.strokeStyle = MAUVE
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx, 17)
  ctx.lineTo(cx, yv(envelope(0)) - 4)
  ctx.stroke()

  // tiny caption for the discrete lines
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('διακριτές γραμμές διαφορετικού ύψους', w / 2, baseY + 13)
}
