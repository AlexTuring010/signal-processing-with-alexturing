'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * Slider for θ → moves a point around the unit circle. Shows the cosine
 * (real-axis projection) and sine (imaginary-axis projection) live, both as
 * dotted projection lines on the plane and as numerical readouts.
 */

const PRESETS = [
  { label: '0', theta: 0 },
  { label: 'π/4', theta: Math.PI / 4 },
  { label: 'π/2', theta: Math.PI / 2 },
  { label: 'π', theta: Math.PI },
  { label: '3π/2', theta: (3 * Math.PI) / 2 },
] as const

export function EulerUnitCircleViz() {
  const [theta, setTheta] = useState(Math.PI / 4)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Wrap into (-π, π] for cleaner display.
  const thetaWrapped = ((theta + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, theta)
  }, [theta])

  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <canvas
          ref={canvasRef}
          style={{ height: 280 }}
          className="block h-[280px] w-full rounded-sm border border-border bg-bg-soft/40"
          aria-label="Point on the unit circle at angle theta"
        />
        <div className="flex flex-col gap-2">
          <div className="rounded border border-border bg-bg-soft px-2.5 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle">e^(jθ)</div>
            <div className="mt-0.5 font-mono text-sm">
              = <span className="text-success">{cosTheta.toFixed(3)}</span>
              {sinTheta >= 0 ? ' + ' : ' − '}
              <span className="text-warn">{Math.abs(sinTheta).toFixed(3)}j</span>
            </div>
          </div>
          <div className="rounded border border-border bg-bg-soft px-2.5 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-success">cos(θ) = Re</div>
            <div className="mt-0.5 font-mono text-sm text-success">{cosTheta.toFixed(3)}</div>
          </div>
          <div className="rounded border border-border bg-bg-soft px-2.5 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-warn">sin(θ) = Im</div>
            <div className="mt-0.5 font-mono text-sm text-warn">{sinTheta.toFixed(3)}</div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          θ ={' '}
          <span className="font-mono text-fg tabular-nums">{thetaWrapped.toFixed(2)} rad</span>
          <span className="ml-2 text-fg-subtle">
            ({((thetaWrapped * 180) / Math.PI).toFixed(0)}°)
          </span>
        </label>
        <input
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 60}
          value={theta}
          onChange={(e) => setTheta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Theta"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setTheta(p.theta > Math.PI ? p.theta - 2 * Math.PI : p.theta)}
              className="rounded-full border border-border bg-bg-soft px-2.5 py-0.5 text-[11px] text-fg-muted hover:border-accent/50 hover:text-fg"
            >
              θ = {p.label}
            </button>
          ))}
        </div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  theta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) / 2 - 30

  // Axes
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx - r - 10, cy)
  ctx.lineTo(cx + r + 10, cy)
  ctx.moveTo(cx, cy - r - 10)
  ctx.lineTo(cx, cy + r + 10)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', cx + r + 10, cy - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 4, cy - r - 6)
  ctx.textAlign = 'center'
  ctx.fillText('1', cx + r, cy + 12)
  ctx.fillText('−1', cx - r, cy + 12)
  ctx.textAlign = 'left'
  ctx.fillText('1j', cx + 4, cy - r + 4)
  ctx.fillText('−1j', cx + 4, cy + r + 2)

  // Unit circle (dashed)
  ctx.save()
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Position of e^(jθ)
  const px = cx + r * Math.cos(theta)
  const py = cy - r * Math.sin(theta)

  // Angle arc from +Re axis to the vector
  ctx.strokeStyle = colors.success
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.35, 0, -theta, theta < 0)
  ctx.stroke()
  // angle label
  ctx.fillStyle = colors.success
  ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const labelAng = theta / 2
  ctx.fillText('θ', cx + r * 0.5 * Math.cos(labelAng), cy - r * 0.5 * Math.sin(labelAng))

  // Vector
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()

  // Projections
  ctx.save()
  ctx.setLineDash([3, 3])
  // Real-axis projection (cos θ)
  ctx.strokeStyle = colors.success
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(px, cy)
  ctx.stroke()
  // Imaginary-axis projection (sin θ)
  ctx.strokeStyle = colors.warn
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(cx, py)
  ctx.stroke()
  ctx.restore()

  // Labels for projections
  ctx.fillStyle = colors.success
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('cos θ', px, cy + (Math.sin(theta) >= 0 ? 14 : -6))
  ctx.fillStyle = colors.warn
  ctx.textAlign = (Math.cos(theta) >= 0 ? 'right' : 'left') as CanvasTextAlign
  ctx.fillText('sin θ', cx + (Math.cos(theta) >= 0 ? -6 : 6), py + 4)

  // The point itself
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(px, py, 5.5, 0, Math.PI * 2)
  ctx.fill()
  // dot at projections
  ctx.fillStyle = colors.success
  ctx.beginPath()
  ctx.arc(px, cy, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = colors.warn
  ctx.beginPath()
  ctx.arc(cx, py, 3, 0, Math.PI * 2)
  ctx.fill()
}
