'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, normal, periodogram } from '@/lib/random'

/**
 * White Gaussian noise — show one realization in time and the
 * estimated PSD. The point is to make "flat PSD" concrete: as N grows,
 * the periodogram noisy-but-flat appearance becomes visible.
 *
 * Slider: N (number of samples). At small N the periodogram is wildly
 * noisy; at large N it averages flat at N₀/2.
 */

const FS = 1000 // sample rate (Hz)
const N0 = 1.0 // PSD level (one-sided in our display)
const SIGMA = Math.sqrt(N0 * FS / 2) // discrete-time variance for matching PSD

export function WhiteNoiseSimulationViz() {
  const [N, setN] = useState(512)
  const [seed, setSeed] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, N, seed)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, N, seed)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [N, seed])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Λευκός Gaussian θόρυβος — δείγμα + εκτιμώμενη PSD
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: μία realization στον χρόνο — απλά Gaussian τυχαίοι αριθμοί,
        ανεξάρτητοι μεταξύ τους. Κάτω: η εκτιμώμενη PSD (periodogram). Στη
        θεωρία είναι <strong>επίπεδη στα N₀/2</strong>. Αύξησε το N και θα
        δεις την εκτίμηση να σταθεροποιείται κοντά σε αυτή τη τιμή.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="White noise simulation"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          N = <span className="font-mono text-fg tabular-nums">{N}</span> samples (
          {(N / FS).toFixed(2)}s)
        </label>
        <input
          type="range"
          min={64}
          max={4096}
          step={32}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  N: number,
  seed: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Generate noise
  const rng = mulberry32(seed * 991 + 7)
  const xs = new Array<number>(N)
  for (let i = 0; i < N; i++) xs[i] = normal(rng, 0, SIGMA)

  const halfH = h / 2 - 6
  drawTimeDomain(ctx, colors, 0, 0, w, halfH, xs)
  drawPSD(ctx, colors, 0, h / 2 + 6, w, halfH, xs)
}

function drawTimeDomain(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  xs: number[],
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22
  const yLim = SIGMA * 4
  const xt = (i: number) => lerp(i, 0, xs.length - 1, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_TOP, y0 + ph - PAD_BOTTOM)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`n(t) — ${xs.length} samples`, x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // ±σ guides
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 3])
  for (const k of [-2, -1, 1, 2]) {
    const y = yv(k * SIGMA)
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, y)
    ctx.lineTo(x0 + pw - PAD_X, y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Plot noise
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < xs.length; i++) {
    const x = xt(i)
    const y = yv(xs[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawPSD(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  xs: number[],
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22

  // Compute periodogram at K bins on [0, FS/2]
  const K = Math.min(120, Math.floor(xs.length / 4))
  const { f, psd } = periodogram(xs, K, FS)
  // Normalize to one-sided PSD: divide by FS/2 already? In our convention
  // periodogram returns |X(f)|²/N. To match continuous PSD ≈ N₀, multiply
  // by 2/FS for one-sided (so peak ≈ N₀).
  const psdNorm = psd.map((v) => (2 * v) / FS)

  const xf = (fHz: number) => lerp(fHz, 0, FS / 2, x0 + PAD_X, x0 + pw - PAD_X)
  const yMax = N0 * 3
  const yp = (v: number) => lerp(Math.min(v, yMax), 0, yMax, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP + 4)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Εκτίμηση PSD (periodogram)', x0 + PAD_X, y0 + 12)

  // Theoretical PSD line at N₀
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)'
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yp(N0))
  ctx.lineTo(x0 + pw - PAD_X, yp(N0))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`Θεωρητικό N₀ = ${N0.toFixed(1)}`, x0 + pw - PAD_X - 5, yp(N0) - 4)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Periodogram as vertical bars
  ctx.fillStyle = 'rgba(29, 78, 216, 0.6)'
  for (let k = 0; k < f.length; k++) {
    const x = xf(f[k])
    const y = yp(psdNorm[k])
    ctx.fillRect(x - 1, y, 2, yAxis - y)
  }

  // X-axis
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fr of [0, FS / 4, FS / 2]) {
    ctx.fillText(`${fr} Hz`, xf(fr), yAxis + 14)
  }
}
