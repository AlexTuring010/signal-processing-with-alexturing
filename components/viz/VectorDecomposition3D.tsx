'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * 3D vector decomposition.
 *
 * Sets up the analogy that powers the entire Fourier-series chapter:
 *   vector = c1·î + c2·ĵ + c3·k̂   (orthogonal basis decomposition)
 *
 * Sliders for c1, c2, c3 (the "Fourier coefficients" in the vector world).
 * The viz draws the basis vectors, the resulting vector, and its three
 * component projections — all with isometric projection so it looks 3D
 * without pulling in a 3D library.
 */

const PRESETS = [
  { label: 'Καθαρό x', c1: 1.0, c2: 0, c3: 0 },
  { label: 'Καθαρό y', c1: 0, c2: 1.0, c3: 0 },
  { label: 'Καθαρό z', c1: 0, c2: 0, c3: 1.0 },
  { label: 'Διαγώνιο', c1: 0.7, c2: 0.7, c3: 0.7 },
  { label: 'Μικτό', c1: 0.6, c2: -0.4, c3: 0.8 },
] as const

export function VectorDecomposition3D() {
  const [c1, setC1] = useState(0.6)
  const [c2, setC2] = useState(-0.4)
  const [c3, setC3] = useState(0.8)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, c1, c2, c3)
  }, [c1, c2, c3])

  const inner = (x: number, y: number, z: number) =>
    (c1 * x + c2 * y + c3 * z).toFixed(2)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Διάνυσμα ως συνδυασμός ορθογώνιων αξόνων
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε τους τρεις συντελεστές <em>c₁, c₂, c₃</em>. Το διάνυσμα{' '}
        <code className="font-mono">v = c₁·î + c₂·ĵ + c₃·k̂</code> ζωγραφίζεται
        μαζί με τις τρεις του προβολές. Παρατήρησε ότι κάθε συντελεστής βγαίνει
        από το <strong>εσωτερικό γινόμενο</strong> με τον αντίστοιχο άξονα.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="3D vector and its decomposition into x, y, z components"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Slider label="c₁ (x)" value={c1} onChange={setC1} accent="x" />
        <Slider label="c₂ (y)" value={c2} onChange={setC2} accent="y" />
        <Slider label="c₃ (z)" value={c3} onChange={setC3} accent="z" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setC1(p.c1)
              setC2(p.c2)
              setC3(p.c3)
            }}
            className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs text-fg-muted hover:border-accent/50 hover:text-fg"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-1 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <div>
          <strong>Εσωτερικό γινόμενο με τον x-άξονα:</strong>{' '}
          <code className="font-mono">v · î = {inner(1, 0, 0)} = c₁</code>{' '}
          <span className="text-fg-muted">
            — μόνο η συνιστώσα x επιβιώνει· οι άλλες είναι ορθογώνιες στο î.
          </span>
        </div>
        <div>
          <strong>Με τον y-άξονα:</strong>{' '}
          <code className="font-mono">v · ĵ = {inner(0, 1, 0)} = c₂</code>
        </div>
        <div>
          <strong>Με τον z-άξονα:</strong>{' '}
          <code className="font-mono">v · k̂ = {inner(0, 0, 1)} = c₃</code>
        </div>
      </div>
    </figure>
  )
}

function Slider({
  label,
  value,
  onChange,
  accent,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  accent: 'x' | 'y' | 'z'
}) {
  const tone =
    accent === 'x'
      ? 'text-[rgb(220,38,38)]'
      : accent === 'y'
        ? 'text-[rgb(22,163,74)]'
        : 'text-[rgb(29,78,216)]'
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className={'text-xs font-medium ' + tone}>{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-[rgb(var(--accent))]"
      />
    </label>
  )
}

/* ----------- Drawing (isometric pseudo-3D) ----------- */

// Project a 3D point (x, y, z) ∈ [-1, 1] to 2D screen coords.
// We use a classic isometric-ish projection.
function project(x: number, y: number, z: number, cx: number, cy: number, scale: number) {
  // x → right-down, y → right-up, z → straight up.
  const sx = cx + scale * (x * Math.cos(Math.PI / 6) - y * Math.cos(Math.PI / 6))
  const sy = cy + scale * (x * Math.sin(Math.PI / 6) + y * Math.sin(Math.PI / 6) - z)
  return { sx, sy }
}

const X_COLOR = 'rgb(220, 38, 38)' // red-ish
const Y_COLOR = 'rgb(22, 163, 74)' // green-ish
const Z_COLOR = 'rgb(29, 78, 216)' // blue-ish

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  c1: number,
  c2: number,
  c3: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cx = w * 0.42
  const cy = h * 0.62
  const scale = Math.min(w, h) * 0.32

  // Origin
  const O = project(0, 0, 0, cx, cy, scale)

  // Faint grid floor (xy-plane at z=0).
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  for (let i = -1; i <= 1; i += 0.5) {
    const a = project(i, -1, 0, cx, cy, scale)
    const b = project(i, 1, 0, cx, cy, scale)
    ctx.beginPath()
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
    ctx.stroke()

    const c = project(-1, i, 0, cx, cy, scale)
    const d = project(1, i, 0, cx, cy, scale)
    ctx.beginPath()
    ctx.moveTo(c.sx, c.sy)
    ctx.lineTo(d.sx, d.sy)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Axes
  drawAxis(ctx, O, project(1.1, 0, 0, cx, cy, scale), X_COLOR, 'x')
  drawAxis(ctx, O, project(0, 1.1, 0, cx, cy, scale), Y_COLOR, 'y')
  drawAxis(ctx, O, project(0, 0, 1.1, cx, cy, scale), Z_COLOR, 'z')

  // The component vectors c1·î, c2·ĵ, c3·k̂ — drawn as colored sub-arrows.
  ctx.lineWidth = 2.5
  drawSegment(ctx, O, project(c1, 0, 0, cx, cy, scale), X_COLOR, 0.7)
  drawSegment(ctx, project(c1, 0, 0, cx, cy, scale), project(c1, c2, 0, cx, cy, scale), Y_COLOR, 0.7)
  drawSegment(
    ctx,
    project(c1, c2, 0, cx, cy, scale),
    project(c1, c2, c3, cx, cy, scale),
    Z_COLOR,
    0.7,
  )

  // The full vector v.
  const V = project(c1, c2, c3, cx, cy, scale)
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(O.sx, O.sy)
  ctx.lineTo(V.sx, V.sy)
  ctx.stroke()
  // Arrowhead
  drawArrowhead(ctx, O, V, colors.fg)
  // Tip dot
  ctx.fillStyle = colors.fg
  ctx.beginPath()
  ctx.arc(V.sx, V.sy, 4, 0, Math.PI * 2)
  ctx.fill()

  // Label v
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('v', V.sx + 7, V.sy - 4)

  // Side panel with the equation.
  const panelX = w * 0.7
  const panelY = h * 0.15
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('v = c₁·î + c₂·ĵ + c₃·k̂', panelX, panelY)
  ctx.font = '11px ui-monospace, monospace'
  ctx.fillStyle = X_COLOR
  ctx.fillText(`c₁ = ${c1.toFixed(2)}`, panelX, panelY + 24)
  ctx.fillStyle = Y_COLOR
  ctx.fillText(`c₂ = ${c2.toFixed(2)}`, panelX, panelY + 40)
  ctx.fillStyle = Z_COLOR
  ctx.fillText(`c₃ = ${c3.toFixed(2)}`, panelX, panelY + 56)
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  from: { sx: number; sy: number },
  to: { sx: number; sy: number },
  color: string,
  label: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(from.sx, from.sy)
  ctx.lineTo(to.sx, to.sy)
  ctx.stroke()
  drawArrowhead(ctx, from, to, color, 6)
  ctx.fillStyle = color
  ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, to.sx + 5, to.sy + 4)
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  from: { sx: number; sy: number },
  to: { sx: number; sy: number },
  color: string,
  alpha: number,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(from.sx, from.sy)
  ctx.lineTo(to.sx, to.sy)
  ctx.stroke()
  ctx.restore()
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  from: { sx: number; sy: number },
  to: { sx: number; sy: number },
  color: string,
  size = 7,
) {
  const dx = to.sx - from.sx
  const dy = to.sy - from.sy
  const len = Math.hypot(dx, dy)
  if (len < 1e-3) return
  const ux = dx / len
  const uy = dy / len
  const baseX = to.sx - ux * size
  const baseY = to.sy - uy * size
  const px = -uy
  const py = ux
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(to.sx, to.sy)
  ctx.lineTo(baseX + px * (size * 0.5), baseY + py * (size * 0.5))
  ctx.lineTo(baseX - px * (size * 0.5), baseY - py * (size * 0.5))
  ctx.closePath()
  ctx.fill()
}

// keep lerp imported even if unused — handy if we later add interactive bg
void lerp
