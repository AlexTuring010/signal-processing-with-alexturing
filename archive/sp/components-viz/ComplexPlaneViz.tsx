'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Drag a point on the complex plane and watch its Cartesian + polar
 * representations update live. Optional toggles overlay the polar
 * annotations (|z|, ∠z arc) and the complex conjugate.
 */

const RANGE = 3
const SNAP = 0.05

type Props = {
  defaultA?: number
  defaultB?: number
  /** When true, polar overlay starts on. */
  defaultPolar?: boolean
}

export function ComplexPlaneViz({
  defaultA = 1.5,
  defaultB = 1,
  defaultPolar = false,
}: Props) {
  const [a, setA] = useState(defaultA)
  const [b, setB] = useState(defaultB)
  const [showPolar, setShowPolar] = useState(defaultPolar)
  const [showConj, setShowConj] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dragging = useRef(false)

  const mag = Math.sqrt(a * a + b * b)
  const ang = Math.atan2(b, a)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, a, b, showPolar, showConj)
  }, [a, b, showPolar, showConj])

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>, drag: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const newA = Math.round(lerp(px, 0, rect.width, -RANGE, RANGE) / SNAP) * SNAP
    const newB = Math.round(lerp(py, 0, rect.height, RANGE, -RANGE) / SNAP) * SNAP
    if (Math.abs(newA) > RANGE || Math.abs(newB) > RANGE) return
    if (drag || dragging.current) {
      setA(newA)
      setB(newB)
    }
  }

  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <canvas
          ref={canvasRef}
          style={{ height: 280 }}
          className="block h-[280px] w-full cursor-crosshair touch-none rounded-sm border border-border bg-bg-soft/40"
          onPointerDown={(e) => {
            dragging.current = true
            ;(e.target as Element).setPointerCapture(e.pointerId)
            handlePointer(e, true)
          }}
          onPointerMove={(e) => handlePointer(e, false)}
          onPointerUp={(e) => {
            dragging.current = false
            ;(e.target as Element).releasePointerCapture(e.pointerId)
          }}
          aria-label="Drag a point on the complex plane"
        />
        <div className="flex flex-col gap-2">
          <Readout label="Cartesian">
            <span className="font-mono text-sm">
              z = <span className="text-accent">{a.toFixed(2)}</span>
              {b >= 0 ? ' + ' : ' − '}
              <span className="text-accent">{Math.abs(b).toFixed(2)}j</span>
            </span>
          </Readout>
          <Readout label="Polar">
            <span className="font-mono text-sm">
              |z| = <span className="text-accent">{mag.toFixed(2)}</span>
              <br />
              ∠z = <span className="text-accent">{ang.toFixed(2)} rad</span>
              <span className="ml-1 text-xs text-fg-muted">
                ({((ang * 180) / Math.PI).toFixed(0)}°)
              </span>
            </span>
          </Readout>
          {showConj && (
            <Readout label="Conjugate">
              <span className="font-mono text-sm">
                z* = <span className="text-warn">{a.toFixed(2)}</span>
                {b >= 0 ? ' − ' : ' + '}
                <span className="text-warn">{Math.abs(b).toFixed(2)}j</span>
              </span>
            </Readout>
          )}
          <div className="mt-1 flex flex-col gap-1 text-xs">
            <Toggle checked={showPolar} onChange={setShowPolar} label="Πολική επικάλυψη (|z|, ∠z)" />
            <Toggle checked={showConj} onChange={setShowConj} label="Δείξε τον συζυγή z*" />
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-fg-muted">
        Σύρε το σημείο. Real part στον οριζόντιο άξονα, imaginary στον κάθετο.
      </p>
    </figure>
  )
}

function Readout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-border bg-bg-soft px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5">{children}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 transition-colors',
        'hover:bg-bg-soft',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-[rgb(var(--accent))]"
      />
      <span className="text-fg-muted">{label}</span>
    </label>
  )
}

/* ---------------- drawing ---------------- */

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  a: number,
  b: number,
  showPolar: boolean,
  showConj: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const scale = Math.min(w, h) / (2 * RANGE) - 4

  const xPx = (x: number) => cx + x * scale
  const yPx = (y: number) => cy - y * scale

  // Grid
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  for (let g = -RANGE; g <= RANGE; g++) {
    if (g === 0) continue
    ctx.beginPath()
    ctx.moveTo(xPx(g), yPx(-RANGE))
    ctx.lineTo(xPx(g), yPx(RANGE))
    ctx.moveTo(xPx(-RANGE), yPx(g))
    ctx.lineTo(xPx(RANGE), yPx(g))
    ctx.stroke()
  }

  // Axes
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xPx(-RANGE), yPx(0))
  ctx.lineTo(xPx(RANGE), yPx(0))
  ctx.moveTo(xPx(0), yPx(-RANGE))
  ctx.lineTo(xPx(0), yPx(RANGE))
  ctx.stroke()

  // Axis tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let g = -RANGE; g <= RANGE; g++) {
    if (g === 0) continue
    ctx.fillText(String(g), xPx(g), yPx(0) + 12)
  }
  ctx.textAlign = 'left'
  for (let g = -RANGE; g <= RANGE; g++) {
    if (g === 0) continue
    ctx.fillText(`${g}j`, xPx(0) + 4, yPx(g) + 3)
  }
  ctx.fillText('Re', xPx(RANGE) - 14, yPx(0) - 4)
  ctx.fillText('Im', xPx(0) + 4, yPx(RANGE) + 9)

  // Polar annotations (under the vector)
  if (showPolar) {
    const r = Math.sqrt(a * a + b * b)
    const ang = Math.atan2(b, a)
    if (r > 0.05) {
      // Arc for the angle (from positive Re axis to the vector)
      ctx.strokeStyle = colors.success
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(xPx(0), yPx(0), Math.min(scale * 0.6, scale * r * 0.55), 0, -ang, ang < 0)
      ctx.stroke()
      // Angle label
      const labelAng = ang / 2
      const labelR = Math.min(scale * 0.75, scale * r * 0.7)
      ctx.fillStyle = colors.success
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('∠z', xPx(Math.cos(labelAng) * labelR / scale), yPx(Math.sin(labelAng) * labelR / scale))
      // |z| label along the vector
      ctx.fillStyle = colors.accent
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
      const midX = xPx(a / 2)
      const midY = yPx(b / 2)
      const offsetX = (-Math.sin(ang) * 12)
      const offsetY = (-Math.cos(ang) * 12)
      ctx.textAlign = 'center'
      ctx.fillText('|z|', midX + offsetX, midY + offsetY)
    }
  }

  // The vector from origin to z
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(xPx(0), yPx(0))
  ctx.lineTo(xPx(a), yPx(b))
  ctx.stroke()

  // Cartesian dotted projections
  ctx.save()
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.fgSubtle
  ctx.beginPath()
  ctx.moveTo(xPx(a), yPx(b))
  ctx.lineTo(xPx(a), yPx(0))
  ctx.moveTo(xPx(a), yPx(b))
  ctx.lineTo(xPx(0), yPx(b))
  ctx.stroke()
  ctx.restore()

  // Conjugate mirror
  if (showConj) {
    ctx.save()
    ctx.setLineDash([4, 3])
    ctx.strokeStyle = 'rgb(217 119 6)'
    ctx.beginPath()
    ctx.moveTo(xPx(0), yPx(0))
    ctx.lineTo(xPx(a), yPx(-b))
    ctx.stroke()
    ctx.restore()
    ctx.fillStyle = 'rgb(217 119 6)'
    ctx.beginPath()
    ctx.arc(xPx(a), yPx(-b), 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('z*', xPx(a) + 6, yPx(-b) + 4)
  }

  // The point z
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(xPx(a), yPx(b), 5.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = colors.fg
  ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('z', xPx(a) + 7, yPx(b) - 5)
}
