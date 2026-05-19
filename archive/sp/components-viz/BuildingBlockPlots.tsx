'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Tiny non-interactive plots for the canonical building-block signals.
 * Each one is drawn to a fixed 2D coordinate frame with a soft grid + axes
 * and a single curve in the accent color.
 */

type PlotFn = (t: number) => number

type FixedPlotProps = {
  fn: PlotFn
  /** Domain to evaluate, in "math" units. */
  xRange?: [number, number]
  /** Fixed y-range. If omitted, auto-fit (1.1× peak). */
  yRange?: [number, number]
  /** Vertical reference values to draw faint horizontal lines at. */
  yMarks?: number[]
  /** X-positions to label on the axis. */
  xMarks?: { x: number; label: string }[]
  /** Optional caption shown below the plot. */
  caption?: string
  height?: number
  ariaLabel?: string
}

function FixedPlot({
  fn,
  xRange = [-3, 3],
  yRange,
  yMarks = [1],
  xMarks,
  caption,
  height = 140,
  ariaLabel,
}: FixedPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    const { ctx, w, h } = setupCanvas(canvas)
    ctx.clearRect(0, 0, w, h)

    // Sample the function on a dense grid for smooth curves.
    const N = Math.max(w * 2, 200)
    const xs = new Float64Array(N)
    const ys = new Float64Array(N)
    let yMin = Infinity
    let yMax = -Infinity
    for (let i = 0; i < N; i++) {
      const t = lerp(i, 0, N - 1, xRange[0], xRange[1])
      const v = fn(t)
      xs[i] = t
      ys[i] = v
      if (Number.isFinite(v)) {
        if (v < yMin) yMin = v
        if (v > yMax) yMax = v
      }
    }

    let [yLo, yHi] = yRange ?? [
      Math.min(yMin, 0) * 1.1 - 0.05,
      Math.max(yMax, 0) * 1.1 + 0.05,
    ]
    if (yLo === yHi) {
      yLo -= 1
      yHi += 1
    }

    const padX = 18
    const padY = 12
    const px = (x: number) => lerp(x, xRange[0], xRange[1], padX, w - padX)
    const py = (y: number) => lerp(y, yLo, yHi, h - padY, padY)

    // Axes.
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    if (yLo <= 0 && yHi >= 0) {
      const y0 = py(0)
      ctx.beginPath()
      ctx.moveTo(padX, y0)
      ctx.lineTo(w - padX, y0)
      ctx.stroke()
    }
    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const x0 = px(0)
      ctx.beginPath()
      ctx.moveTo(x0, padY)
      ctx.lineTo(x0, h - padY)
      ctx.stroke()
    }

    // Y-mark dashed lines.
    if (yMarks?.length) {
      ctx.save()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = colors.border
      for (const ym of yMarks) {
        if (ym < yLo || ym > yHi) continue
        const y = py(ym)
        ctx.beginPath()
        ctx.moveTo(padX, y)
        ctx.lineTo(w - padX, y)
        ctx.stroke()
        // Label
        ctx.fillStyle = colors.fgSubtle
        ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(String(ym), padX + 2, y - 2)
      }
      ctx.restore()
    }

    // X-marks (vertical short ticks + label).
    if (xMarks?.length) {
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      for (const m of xMarks) {
        const x = px(m.x)
        const yAxis = py(0)
        ctx.strokeStyle = colors.fgSubtle
        ctx.beginPath()
        ctx.moveTo(x, yAxis - 3)
        ctx.lineTo(x, yAxis + 3)
        ctx.stroke()
        ctx.fillText(m.label, x, yAxis + 12)
      }
    }

    // The curve.
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    let pen = false
    let lastY = NaN
    for (let i = 0; i < N; i++) {
      const v = ys[i]
      if (!Number.isFinite(v)) {
        pen = false
        continue
      }
      const x = px(xs[i])
      const y = py(v)
      // Detect step discontinuities (huge jump between adjacent samples).
      if (pen && Number.isFinite(lastY) && Math.abs(y - lastY) > h * 0.6) {
        ctx.moveTo(x, y)
      } else if (!pen) {
        ctx.moveTo(x, y)
        pen = true
      } else {
        ctx.lineTo(x, y)
      }
      lastY = y
    }
    ctx.stroke()
  }, [fn, xRange, yRange, yMarks, xMarks])

  return (
    <figure className="my-3 rounded-md border border-border bg-bg-elevated p-2">
      <canvas
        ref={canvasRef}
        style={{ height }}
        className="block h-full w-full"
        aria-label={ariaLabel}
      />
      {caption && (
        <figcaption className="mt-1 text-center text-xs text-fg-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/* ---------- Specific plots ---------- */

/** Heaviside u(t): 0 for t<0, 1 for t>=0. */
export function UnitStepPlot() {
  return (
    <FixedPlot
      fn={(t) => (t >= 0 ? 1 : 0)}
      xRange={[-2, 4]}
      yRange={[-0.3, 1.3]}
      yMarks={[1]}
      xMarks={[{ x: 0, label: '0' }]}
      caption="u(t) — ο διακόπτης που ανάβει στο t = 0"
      ariaLabel="Plot of the unit step u(t)"
    />
  )
}

/** Rect pulse Π(t/T) with T=1 (so support is [-0.5, 0.5]). */
export function RectPulsePlot() {
  return (
    <FixedPlot
      fn={(t) => (Math.abs(t) <= 0.5 ? 1 : 0)}
      xRange={[-2, 2]}
      yRange={[-0.3, 1.3]}
      yMarks={[1]}
      xMarks={[
        { x: -0.5, label: '−T/2' },
        { x: 0, label: '0' },
        { x: 0.5, label: 'T/2' },
      ]}
      caption="Π(t/T) — ορθογώνιος παλμός πλάτους T, ύψους 1"
      ariaLabel="Plot of a rectangular pulse"
    />
  )
}

/** Triangular pulse Λ(t/T) with T=1 (support [-1, 1], peak 1 at 0). */
export function TriPulsePlot() {
  return (
    <FixedPlot
      fn={(t) => Math.max(0, 1 - Math.abs(t))}
      xRange={[-2, 2]}
      yRange={[-0.3, 1.3]}
      yMarks={[1]}
      xMarks={[
        { x: -1, label: '−T' },
        { x: 0, label: '0' },
        { x: 1, label: 'T' },
      ]}
      caption="Λ(t/T) — τριγωνικός παλμός μέγιστου ύψους 1 στο t = 0"
      ariaLabel="Plot of a triangular pulse"
    />
  )
}

/** sinc(x) = sin(pi x)/(pi x), with sinc(0) = 1. */
export function SincPlot() {
  const sinc = (t: number) => {
    if (t === 0) return 1
    const y = Math.PI * t
    return Math.sin(y) / y
  }
  const zeros: { x: number; label: string }[] = [
    { x: -3, label: '−3' },
    { x: -2, label: '−2' },
    { x: -1, label: '−1' },
    { x: 0, label: '0' },
    { x: 1, label: '1' },
    { x: 2, label: '2' },
    { x: 3, label: '3' },
  ]
  return (
    <FixedPlot
      fn={sinc}
      xRange={[-5, 5]}
      yRange={[-0.4, 1.2]}
      yMarks={[1]}
      xMarks={zeros}
      caption="sinc(x) = sin(πx)/(πx) — μηδενίζει στους ακέραιους πέρα από το 0"
      ariaLabel="Plot of the sinc function"
    />
  )
}
