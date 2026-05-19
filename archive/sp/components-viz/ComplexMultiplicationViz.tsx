'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * Two complex numbers and their product, side-by-side on the same plane.
 * The user controls each operand's magnitude and angle. The product
 * vector is shown in green; the readouts make explicit the rule
 * "magnitudes multiply, angles add".
 */

const RANGE = 4

export function ComplexMultiplicationViz() {
  const [r1, setR1] = useState(1)
  const [t1, setT1] = useState(Math.PI / 6)
  const [r2, setR2] = useState(1.5)
  const [t2, setT2] = useState(Math.PI / 3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const productR = r1 * r2
  const productT = t1 + t2

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, r1, t1, r2, t2)
  }, [r1, t1, r2, t2])

  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
        <canvas
          ref={canvasRef}
          style={{ height: 320 }}
          className="block h-[320px] w-full rounded-sm border border-border bg-bg-soft/40"
          aria-label="Two complex numbers and their product on the complex plane"
        />
        <div className="space-y-2">
          <Box color="accent" label="z₁">
            |z₁| = {r1.toFixed(2)} · ∠z₁ = {fmtAngle(t1)}
          </Box>
          <Box color="warn" label="z₂">
            |z₂| = {r2.toFixed(2)} · ∠z₂ = {fmtAngle(t2)}
          </Box>
          <Box color="success" label="z₁ · z₂">
            <div>|z₁·z₂| = |z₁| · |z₂| = <strong>{productR.toFixed(2)}</strong></div>
            <div>∠(z₁·z₂) = ∠z₁ + ∠z₂ = <strong>{fmtAngle(productT)}</strong></div>
          </Box>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SliderRow
          label="|z₁|"
          value={r1}
          min={0}
          max={2}
          step={0.05}
          onChange={setR1}
          format={(v) => v.toFixed(2)}
        />
        <SliderRow
          label="∠z₁"
          value={t1}
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 24}
          onChange={setT1}
          format={fmtAngle}
        />
        <SliderRow
          label="|z₂|"
          value={r2}
          min={0}
          max={2}
          step={0.05}
          onChange={setR2}
          format={(v) => v.toFixed(2)}
        />
        <SliderRow
          label="∠z₂"
          value={t2}
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 24}
          onChange={setT2}
          format={fmtAngle}
        />
      </div>

      <p className="mt-2 text-xs text-fg-muted">
        Πολλαπλασιασμός σε πολική μορφή: <strong>μέτρα πολλαπλασιάζονται, γωνίες προστίθενται</strong>. Γεωμετρικά είναι scaling κατά |z| και στροφή κατά ∠z.
      </p>
    </figure>
  )
}

function fmtAngle(t: number) {
  const overPi = t / Math.PI
  if (Math.abs(overPi) < 0.005) return '0'
  return `${overPi.toFixed(2)}π rad`
}

function Box({
  color,
  label,
  children,
}: {
  color: 'accent' | 'warn' | 'success'
  label: string
  children: React.ReactNode
}) {
  const tone =
    color === 'accent'
      ? 'border-accent/40 bg-accent-soft/30 text-accent'
      : color === 'warn'
        ? 'border-amber-400/50 bg-amber-50/40 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200'
        : 'border-emerald-400/50 bg-emerald-50/40 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200'
  return (
    <div className={'rounded border px-2.5 py-1.5 text-xs ' + tone}>
      <div className="text-[10px] font-semibold uppercase tracking-wider">{label}</div>
      <div className="mt-0.5 font-mono">{children}</div>
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-[rgb(var(--accent))]"
      />
    </label>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  r1: number,
  t1: number,
  r2: number,
  t2: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const scale = Math.min(w, h) / (2 * RANGE) - 6

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

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', xPx(RANGE) - 4, yPx(0) - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im', xPx(0) + 4, yPx(RANGE) + 9)

  // Vectors
  drawVector(ctx, cx, cy, scale, r1, t1, colors.accent, 'z₁')
  drawVector(ctx, cx, cy, scale, r2, t2, 'rgb(217 119 6)', 'z₂')
  drawVector(ctx, cx, cy, scale, r1 * r2, t1 + t2, colors.success, 'z₁·z₂', 3)

  // Highlight that the product's angle is the sum: draw an extra arc from
  // ∠z₁ to ∠z₁+∠z₂ in success color.
  const arcR = scale * Math.min(2.5, Math.max(0.4, r1 * r2 * 0.35))
  ctx.strokeStyle = colors.success
  ctx.lineWidth = 1.2
  ctx.beginPath()
  // canvas arcs use clockwise=false convention for positive angles when using neg start angle
  ctx.arc(cx, cy, arcR, -t1, -(t1 + t2), t2 < 0)
  ctx.stroke()
}

function drawVector(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  r: number,
  t: number,
  color: string,
  label: string,
  width = 2.5,
) {
  const px = cx + r * Math.cos(t) * scale
  const py = cy - r * Math.sin(t) * scale
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()
  // arrowhead
  const headLen = 9
  const headAng = 0.5
  const angle = Math.atan2(-(py - cy), px - cx)
  const ax1 = px - headLen * Math.cos(angle - headAng)
  const ay1 = py + headLen * Math.sin(angle - headAng)
  const ax2 = px - headLen * Math.cos(angle + headAng)
  const ay2 = py + headLen * Math.sin(angle + headAng)
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(ax1, ay1)
  ctx.lineTo(ax2, ay2)
  ctx.closePath()
  ctx.fill()
  // label
  ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, px + 6, py - 4)
}
