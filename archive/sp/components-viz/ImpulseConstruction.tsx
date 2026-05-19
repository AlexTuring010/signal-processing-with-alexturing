'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const X_RANGE: [number, number] = [-1.6, 1.6]
const Y_PADDING_TOP = 18
const Y_PADDING_BOTTOM = 22

export function ImpulseConstruction() {
  // log scale: ε goes from 1 down to 0.005
  const [logEps, setLogEps] = useState(0)
  const epsilon = Math.pow(10, -logEps) // 1, 0.1, 0.01, 0.005...
  const height = 1 / epsilon
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, epsilon, height)
  }, [epsilon, height])

  const isImpulseLimit = logEps >= 2.0

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πώς φτιάχνεις ένα δ(t)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Παίρνεις ορθογώνιο παλμό πλάτους <em>ε</em> και ύψους <em>1/ε</em> —
        έτσι το εμβαδό είναι <strong>πάντα 1</strong>. Στενεύεις το ε προς το 0.
        Το οριακό «αντικείμενο» είναι το δ(t).
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 220 }}
        className="block h-[220px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="Rectangular pulse limiting to a unit impulse as epsilon goes to zero"
      />

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg-soft px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            ε (πλάτος)
          </div>
          <div className="font-mono text-sm tabular-nums text-fg">
            {epsilon < 0.01 ? epsilon.toExponential(2) : epsilon.toFixed(3)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            ύψος = 1/ε
          </div>
          <div className="font-mono text-sm tabular-nums text-fg">
            {height < 1000 ? height.toFixed(1) : height.toExponential(2)}
          </div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent-soft/30 px-2.5 py-1.5">
          <div className="text-[10px] uppercase tracking-wider text-accent">
            Εμβαδό
          </div>
          <div className="font-mono text-sm tabular-nums text-accent">1.000</div>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Σύρε για να μικρύνει το ε
        </label>
        <input
          type="range"
          min={0}
          max={2.5}
          step={0.05}
          value={logEps}
          onChange={(e) => setLogEps(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Log of 1/epsilon"
        />
        <div className="flex justify-between text-[10px] text-fg-subtle">
          <span>ε = 1</span>
          <span>ε → 0</span>
        </div>
      </div>

      {isImpulseLimit && (
        <p
          role="status"
          className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-1.5 text-xs"
        >
          Στο όριο, ο παλμός γίνεται ένα <strong>βέλος</strong> — άπειρα στενός,
          άπειρα ψηλός, με εμβαδό 1. Αυτό είναι το δ(t).
        </p>
      )}
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  epsilon: number,
  height: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 28

  // Display y-range. Cap so super-tall pulses don't break the layout.
  const yDisplayMax = 6.5
  const yDisplayMin = -0.4
  const px = (x: number) => lerp(x, X_RANGE[0], X_RANGE[1], padX, w - padX)
  const py = (y: number) =>
    lerp(y, yDisplayMax, yDisplayMin, Y_PADDING_TOP, h - Y_PADDING_BOTTOM)

  // X-axis line.
  const yZero = py(0)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, yZero)
  ctx.lineTo(w - padX, yZero)
  ctx.stroke()

  // Y reference lines at 1, 2, 3, 4, 5.
  ctx.save()
  ctx.setLineDash([2, 3])
  ctx.strokeStyle = colors.border
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const yv of [1, 2, 3, 4, 5, 6]) {
    if (yv > yDisplayMax) continue
    const y = py(yv)
    ctx.beginPath()
    ctx.moveTo(padX, y)
    ctx.lineTo(w - padX, y)
    ctx.stroke()
    ctx.fillText(String(yv), padX - 4, y + 3)
  }
  ctx.restore()

  // X axis ticks.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const xv of [-1, 0, 1]) {
    const x = px(xv)
    ctx.fillText(String(xv), x, h - 6)
  }

  // The rectangular pulse.
  const halfEps = epsilon / 2
  const xLeft = px(-halfEps)
  const xRight = px(halfEps)
  const peakDisplay = Math.min(height, yDisplayMax)
  const yTop = py(peakDisplay)

  // Filled rect.
  ctx.fillStyle = `${colors.accent.replace('rgb(', 'rgba(').replace(')', ' / 0.18)')}`
  // Fallback if accent already uses rgba — rebuild from the color string we got.
  // Simpler: draw with composite alpha.
  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = colors.accent
  ctx.fillRect(xLeft, yTop, Math.max(1, xRight - xLeft), yZero - yTop)
  ctx.restore()

  // Outline.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xLeft, yZero)
  ctx.lineTo(xLeft, yTop)
  ctx.lineTo(xRight, yTop)
  ctx.lineTo(xRight, yZero)
  ctx.stroke()

  // If the pulse is taller than the display can show, draw an arrow at top
  // to indicate "off-screen".
  if (height > yDisplayMax) {
    const xMid = (xLeft + xRight) / 2
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.moveTo(xMid, Y_PADDING_TOP - 2)
    ctx.lineTo(xMid - 5, Y_PADDING_TOP + 6)
    ctx.lineTo(xMid + 5, Y_PADDING_TOP + 6)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`→ ${height.toFixed(0)}`, xMid, Y_PADDING_TOP - 6)
  }

  // Center label "0".
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', px(0), h - 6)
}
