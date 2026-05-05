'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Spectrum replication picture of sampling.
 *
 * Top panel: the original baseband spectrum X(f), supported in [-W, W].
 * Bottom panel: the sampled spectrum X_s(f) = (1/T_s) Σ_k X(f - k f_s).
 * Replicas appear at every multiple of f_s.
 *
 * Slider: f_s. When f_s ≥ 2W, replicas don't overlap → recoverable.
 * When f_s < 2W, replicas overlap → aliasing in the frequency domain.
 *
 * The bottom panel highlights the overlap region in red when aliasing
 * occurs, making the failure visible.
 */

const W = 1.0 // baseband bandwidth (Hz)

export function SpectrumReplicaViz() {
  const [fs, setFs] = useState(2.5) // Hz
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, fs)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, fs)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fs])

  const isAliased = fs < 2 * W
  const nyquist = 2 * W

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Φάσμα της δειγματοληψίας — replicas στα πολλαπλάσια του f_s
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: αρχικό baseband φάσμα X(f), στενό σε [-W, W]. Κάτω: το
        φάσμα του σαμπλαρισμένου σήματος — άθροισμα replicas στα 0, ±f_s,
        ±2f_s,... Όταν f_s ≥ 2W, οι replicas δεν αλληλεπικαλύπτονται και
        ένα ιδανικό LPF μπορεί να ανακτήσει το αρχικό. Όταν f_s &lt; 2W,
        έχουμε <strong>spectral overlap</strong> = aliasing.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Spectrum replication visualization"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f_s = <span className="font-mono text-fg tabular-nums">{fs.toFixed(2)}</span> Hz
          {' · '}
          <span className="font-mono text-fg-subtle">2W = {nyquist.toFixed(2)} Hz</span>
          {' · '}
          {isAliased ? (
            <span className="font-medium text-red-600 dark:text-red-400">
              ⚠️ Replicas αλληλεπικαλύπτονται
            </span>
          ) : (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Replicas χωρίς overlap
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.5}
          max={6}
          step={0.05}
          value={fs}
          onChange={(e) => setFs(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>
    </figure>
  )
}

const X_C = 'rgb(217, 119, 6)'
const REPLICA_C = 'rgb(29, 78, 216)'
const OVERLAP_C = 'rgb(220, 38, 38)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fs: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const halfH = h / 2 - 4
  drawOriginal(ctx, colors, 0, 0, w, halfH)
  drawSampled(ctx, colors, 0, h / 2 + 4, w, halfH, fs)
}

function triangleSpectrum(f: number): number {
  // Triangle of width 2W centered at 0, peak 1
  if (Math.abs(f) >= W) return 0
  return 1 - Math.abs(f) / W
}

function drawOriginal(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  const PAD_X = 36
  const PAD_TOP = 18
  const PAD_BOTTOM = 24
  const fSpan = 8
  const xf = (f: number) => lerp(f, -fSpan, fSpan, x0 + PAD_X, x0 + pw - PAD_X)
  const yMax = 1.3
  const yv = (v: number) => lerp(v, yMax, 0, y0 + PAD_TOP + 2, y0 + ph - PAD_BOTTOM)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X(f) — αρχικό φάσμα', x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Triangle X(f)
  ctx.fillStyle = X_C + '33'
  ctx.strokeStyle = X_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xf(-W), yAxis)
  ctx.lineTo(xf(0), yv(1))
  ctx.lineTo(xf(W), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('-W', xf(-W), yAxis + 12)
  ctx.fillText('0', xf(0), yAxis + 12)
  ctx.fillText('+W', xf(W), yAxis + 12)
  ctx.textAlign = 'right'
  ctx.fillText('f', x0 + pw - PAD_X, yAxis + 12)
}

function drawSampled(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fs: number,
) {
  if (!colors) return
  const PAD_X = 36
  const PAD_TOP = 18
  const PAD_BOTTOM = 24
  const fSpan = 8
  const xf = (f: number) => lerp(f, -fSpan, fSpan, x0 + PAD_X, x0 + pw - PAD_X)
  const yMax = 1.3
  const yv = (v: number) => lerp(v, yMax, 0, y0 + PAD_TOP + 2, y0 + ph - PAD_BOTTOM)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    `X_s(f) = Σ_k X(f − k·f_s),  f_s = ${fs.toFixed(2)} Hz`,
    x0 + PAD_X,
    y0 + 12,
  )

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Sum the replicas at sample points along f, accumulating into an array
  const N = 600
  const fGrid: number[] = []
  const sumGrid: number[] = []
  for (let i = 0; i <= N; i++) {
    const f = lerp(i, 0, N, -fSpan, fSpan)
    let s = 0
    const kRange = Math.ceil(fSpan / fs) + 1
    for (let k = -kRange; k <= kRange; k++) {
      s += triangleSpectrum(f - k * fs)
    }
    fGrid.push(f)
    sumGrid.push(s)
  }

  // Draw individual replicas faintly first
  ctx.strokeStyle = REPLICA_C + '60'
  ctx.lineWidth = 1
  const kRange = Math.ceil(fSpan / fs) + 1
  for (let k = -kRange; k <= kRange; k++) {
    const center = k * fs
    if (Math.abs(center) - W > fSpan) continue
    ctx.beginPath()
    ctx.moveTo(xf(center - W), yAxis)
    ctx.lineTo(xf(center), yv(1))
    ctx.lineTo(xf(center + W), yAxis)
    ctx.stroke()
  }

  // Draw sum (the actual X_s(f))
  ctx.fillStyle = REPLICA_C + '40'
  ctx.strokeStyle = REPLICA_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xf(fGrid[0]), yAxis)
  for (let i = 0; i < fGrid.length; i++) {
    ctx.lineTo(xf(fGrid[i]), yv(sumGrid[i]))
  }
  ctx.lineTo(xf(fGrid[fGrid.length - 1]), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // If aliased: highlight overlap zones (where adjacent replicas exceed individual peaks)
  if (fs < 2 * W) {
    ctx.strokeStyle = OVERLAP_C
    ctx.fillStyle = OVERLAP_C + '40'
    ctx.lineWidth = 1.4
    // Overlap: indices where X(f) and X(f - fs) both > 0
    ctx.beginPath()
    let inRegion = false
    for (let i = 0; i < fGrid.length; i++) {
      const f = fGrid[i]
      const main = triangleSpectrum(f)
      const right = triangleSpectrum(f - fs)
      const left = triangleSpectrum(f + fs)
      const overlap = (main > 0 && (right > 0 || left > 0))
      if (overlap) {
        if (!inRegion) {
          ctx.moveTo(xf(f), yv(sumGrid[i]))
          inRegion = true
        } else {
          ctx.lineTo(xf(f), yv(sumGrid[i]))
        }
      } else if (inRegion) {
        ctx.stroke()
        ctx.beginPath()
        inRegion = false
      }
    }
    if (inRegion) ctx.stroke()
  }

  // f_s markers
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xf(0), yAxis + 12)
  for (let k = -Math.floor(fSpan / fs); k <= Math.floor(fSpan / fs); k++) {
    if (k === 0) continue
    const fk = k * fs
    if (Math.abs(fk) > fSpan - 0.3) continue
    ctx.fillText(`${k > 0 ? '+' : ''}${k}f_s`, xf(fk), yAxis + 12)
  }
}
