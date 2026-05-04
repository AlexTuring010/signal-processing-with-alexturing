'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Visualizes Euler's formula:  e^(jωt) = cos(ωt) + j sin(ωt).
 *
 * Left:   complex plane with a phasor of unit length spinning at angular rate ω.
 * Right:  two stacked time plots — cos(ωt) (the x-projection) and sin(ωt) (the
 *         y-projection). A "playhead" line shows where on the curves the
 *         phasor currently is.
 *
 * Single canvas, laid out by fractions of CSS pixels so it scales cleanly.
 */
export function RotatingPhasor() {
  const [running, setRunning] = useState(true)
  const [omega, setOmega] = useState(2 * Math.PI) // rad/s; default = 1 cycle per sec
  const phaseRef = useRef(0) // current angular position, accumulating
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) // clamp big jumps
      last = now
      if (running) phaseRef.current += omega * dt
      draw()
      raf = requestAnimationFrame(tick)
    }

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const colors = getThemeColors()
      if (!colors) return
      drawScene(canvas, colors, phaseRef.current)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, omega])

  const cyclesPerSec = omega / (2 * Math.PI)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          e<sup>jωt</sup> = cos(ωt) + j · sin(ωt)
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Παίξε'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 260 }}
        className="block h-[260px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Rotating phasor on the complex plane with cosine and sine projections"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          ω ={' '}
          <span className="font-mono text-fg tabular-nums">
            {omega.toFixed(2)} rad/s
          </span>{' '}
          <span className="text-fg-subtle">
            ({cyclesPerSec.toFixed(2)} κύκλοι/s)
          </span>
        </label>
        <input
          type="range"
          min={Math.PI / 2}
          max={4 * Math.PI}
          step={0.05}
          value={omega}
          onChange={(e) => setOmega(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Angular frequency ω"
        />
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Το <span className="text-accent">μπλε σημείο</span> τρέχει κυκλικά γύρω
        από το μοναδιαίο κύκλο με γωνιακή ταχύτητα <em>ω</em>. Η{' '}
        <strong>x-προβολή</strong> του είναι το cos(ωt), η{' '}
        <strong>y-προβολή</strong> είναι το sin(ωt). Δύο διαφορετικά πράγματα,
        ίδια κίνηση. Όταν θα φτάσουμε στο Fourier, θα δούμε γιατί τα LTI
        συστήματα «σκέφτονται» σε μιγαδικά εκθετικά αντί για cos/sin.
      </p>
    </figure>
  )
}

const TRACE_CYCLES = 2 // how much of the cos/sin curves to show at once

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phase: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // --- Layout
  const gap = 16
  const planeW = Math.min(h - 16, Math.max(150, w * 0.35))
  const planeX = 8
  const planeY = (h - planeW) / 2
  const tracesX = planeX + planeW + gap
  const tracesW = w - tracesX - 8
  const traceH = (h - 16 - 8) / 2
  const traceCosY = 8
  const traceSinY = 8 + traceH + 8

  drawComplexPlane(ctx, colors, planeX, planeY, planeW, phase)
  drawTrace(ctx, colors, tracesX, traceCosY, tracesW, traceH, phase, 'cos')
  drawTrace(ctx, colors, tracesX, traceSinY, tracesW, traceH, phase, 'sin')
}

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  size: number,
  phase: number,
) {
  if (!colors) return
  const cx = x + size / 2
  const cy = y + size / 2
  const r = size / 2 - 16

  // Bounding box.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1)

  // Axes.
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(x + 4, cy)
  ctx.lineTo(x + size - 4, cy)
  ctx.moveTo(cx, y + 4)
  ctx.lineTo(cx, y + size - 4)
  ctx.stroke()

  // Axis labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', x + size - 4, cy - 3)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 3, y + 10)

  // Unit circle.
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Phasor tip position.
  const px = cx + r * Math.cos(phase)
  const py = cy - r * Math.sin(phase) // canvas y inverted

  // Projections (dashed).
  ctx.setLineDash([2, 2])
  ctx.strokeStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(px, cy)
  ctx.moveTo(px, py)
  ctx.lineTo(cx, py)
  ctx.stroke()
  ctx.setLineDash([])

  // Phasor line.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()

  // Phasor tip dot.
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(px, py, 4.5, 0, Math.PI * 2)
  ctx.fill()

  // x-projection marker on Re axis.
  ctx.fillStyle = colors.success
  ctx.beginPath()
  ctx.arc(px, cy, 3, 0, Math.PI * 2)
  ctx.fill()
  // y-projection marker on Im axis.
  ctx.fillStyle = colors.warn
  ctx.beginPath()
  ctx.arc(cx, py, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  w: number,
  h: number,
  phase: number,
  kind: 'cos' | 'sin',
) {
  if (!colors) return
  const padY = 6
  const cy = y + h / 2

  // Border.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)

  // Mid-line.
  ctx.beginPath()
  ctx.moveTo(x + 4, cy)
  ctx.lineTo(x + w - 4, cy)
  ctx.stroke()

  const traceMaxAngle = TRACE_CYCLES * 2 * Math.PI

  // Curve.
  const fn = kind === 'cos' ? Math.cos : Math.sin
  const tipColor = kind === 'cos' ? colors.success : colors.warn
  ctx.strokeStyle = tipColor
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = Math.max(80, Math.floor(w))
  for (let i = 0; i <= steps; i++) {
    const a = lerp(i, 0, steps, 0, traceMaxAngle)
    const v = fn(a)
    const xx = lerp(a, 0, traceMaxAngle, x + 6, x + w - 6)
    const yy = lerp(v, 1, -1, y + padY, y + h - padY)
    if (i === 0) ctx.moveTo(xx, yy)
    else ctx.lineTo(xx, yy)
  }
  ctx.stroke()

  // Playhead at current phase mod traceMaxAngle.
  const playhead = ((phase % traceMaxAngle) + traceMaxAngle) % traceMaxAngle
  const xHead = lerp(playhead, 0, traceMaxAngle, x + 6, x + w - 6)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xHead, y + 4)
  ctx.lineTo(xHead, y + h - 4)
  ctx.stroke()
  ctx.setLineDash([])

  // Marker dot at current value.
  const v = fn(phase)
  const yHead = lerp(v, 1, -1, y + padY, y + h - padY)
  ctx.fillStyle = tipColor
  ctx.beginPath()
  ctx.arc(xHead, yHead, 4, 0, Math.PI * 2)
  ctx.fill()

  // Label.
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(kind === 'cos' ? 'cos(ωt)' : 'sin(ωt)', x + 8, y + 13)
}
