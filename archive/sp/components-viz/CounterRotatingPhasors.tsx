'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * The Euler decomposition cos(2π f₀ t) = ½(e^{j 2π f₀ t} + e^{-j 2π f₀ t})
 * shown side-by-side: a complex plane with two phasors of amplitude ½ rotating
 * in opposite directions, and a time plot of their real parts plus the sum.
 *
 * The two phasors are mirror images (complex conjugates) at every instant.
 * Their imaginary parts cancel; their real parts double; the result is a
 * real-valued cosine of unit amplitude. This is the "what negative frequency
 * actually means" picture: not a separate physical signal, just the
 * counter-rotating partner that real cosines need.
 *
 * Slider for f₀ controls the angular rate. Animation via raf.
 */

const F_MIN = 0.2
const F_MAX = 2.0

export function CounterRotatingPhasors() {
  const [running, setRunning] = useState(true)
  const [f0, setF0] = useState(0.7)
  const tRef = useRef(0) // simulated time (s)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, f0, tRef.current)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, f0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Δύο phasors που στρίβουν αντίθετα = ένα cosine
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
        style={{ height: 240 }}
        className="block h-[240px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Two counter-rotating phasors and their real-part sum forming a cosine"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{f0.toFixed(2)}</span> Hz
        </label>
        <input
          type="range"
          min={F_MIN}
          max={F_MAX}
          step={0.05}
          value={f0}
          onChange={(e) => setF0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Frequency f0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Δες ότι οι δύο phasors είναι <strong>μιγαδικά συζυγείς</strong> ο ένας του
        άλλου σε κάθε στιγμή — οι imaginary parts τους ακυρώνονται και μένει μόνο
        το <strong>διπλάσιο του real part</strong>, που είναι το cosine. Αυτή είναι
        η Euler{' '}
        <span className="font-mono">cos θ = ½(e^(jθ) + e^(−jθ))</span> σε action.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  f0: number,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Layout: left half = complex plane (square-ish), right half = time plot
  const splitX = Math.min(w * 0.42, 240)
  drawComplexPlane(ctx, colors, 0, 0, splitX, h, f0, t)
  drawTimePlot(ctx, colors, splitX, 0, w - splitX, h, f0, t)
}

const PLUS_COLOR = 'rgb(29, 78, 216)' // blue (accent)
const MINUS_COLOR = 'rgb(217, 119, 6)' // amber/orange

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  f0: number,
  t: number,
) {
  if (!colors) return
  const cx = x0 + pw / 2
  const cy = y0 + ph / 2
  const R = Math.min(pw, ph) * 0.36 // radius corresponding to amplitude 1 in the plane

  // Background grid
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  // axes
  ctx.beginPath()
  ctx.moveTo(x0 + 8, cy)
  ctx.lineTo(x0 + pw - 8, cy)
  ctx.moveTo(cx, y0 + 8)
  ctx.lineTo(cx, y0 + ph - 8)
  ctx.stroke()

  // Unit circle of amplitude 1 (faint)
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()

  // Half-amplitude circle (where the phasors live) — emphasised
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, R / 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', x0 + pw - 4, cy - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 4, y0 + 12)
  ctx.textAlign = 'center'

  // Phasor angle: θ = 2π f₀ t
  const theta = 2 * Math.PI * f0 * t
  // Two phasors of amplitude ½ — one at +θ (CCW), one at −θ (CW).
  // Canvas y is inverted: subtract sin to put +Im above.
  const drawPhasor = (
    angle: number,
    color: string,
    label: string,
    labelOffset: { x: number; y: number },
  ) => {
    const px = cx + (R / 2) * Math.cos(angle)
    const py = cy - (R / 2) * Math.sin(angle)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(label, px + labelOffset.x, py + labelOffset.y)
  }

  // +f₀ phasor: counter-clockwise → angle = +θ
  drawPhasor(theta, PLUS_COLOR, '+f₀', { x: 6, y: 4 })
  // −f₀ phasor: clockwise → angle = −θ
  drawPhasor(-theta, MINUS_COLOR, '−f₀', { x: 6, y: 4 })

  // Sum vector (real, on Re axis at value cos θ)
  const sumX = cx + R * Math.cos(theta) // 2·(½)·cos θ = cos θ → length R·cos θ on Re axis
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(sumX, cy)
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.beginPath()
  ctx.arc(sumX, cy, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('άθροισμα', cx, cy + 18)

  // Tick mark at amplitude ½ on Re axis
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('½', cx + R / 2, cy + 12)
  ctx.fillText('1', cx + R, cy + 12)
}

function drawTimePlot(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  f0: number,
  t: number,
) {
  if (!colors) return

  const PAD = 14
  const tWindow = 4 / Math.max(f0, 0.1) // show ~4 cycles
  const tStart = t - tWindow * 0.6
  const tEnd = t + tWindow * 0.4
  const yLim = 1.3

  const xt = (tt: number) => lerp(tt, tStart, tEnd, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD, y0 + ph - PAD)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  // playhead (current t)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(t), y0 + PAD)
  ctx.lineTo(xt(t), y0 + ph - PAD)
  ctx.stroke()
  ctx.setLineDash([])

  const STEPS = 240
  const phasorRe = (sign: number) => (tt: number) =>
    0.5 * Math.cos(sign * 2 * Math.PI * f0 * tt) // amplitude ½

  // +f₀ phasor real part (= ½ cos)
  const drawTrace = (
    fn: (tt: number) => number,
    color: string,
    width: number,
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const tt = lerp(i, 0, STEPS, tStart, tEnd)
      const v = fn(tt)
      const px = xt(tt)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // The two real-part traces overlap exactly (Re is even in θ), so we
  // draw them with a slight visual offset by stroking each in their own
  // color: orange first (slightly thicker), blue on top with normal weight.
  drawTrace((tt) => phasorRe(-1)(tt), MINUS_COLOR, 2.5)
  drawTrace((tt) => phasorRe(1)(tt), PLUS_COLOR, 1.4)
  // Sum (cos, full amplitude)
  drawTrace((tt) => Math.cos(2 * Math.PI * f0 * tt), colors.fg, 2)

  // y ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', x0 + PAD - 2, yv(1) + 3)
  ctx.fillText('−1', x0 + PAD - 2, yv(-1) + 3)
  ctx.fillText('0', x0 + PAD - 2, yZero + 3)

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  const lx = x0 + PAD + 4
  let ly = y0 + PAD + 10
  ctx.fillStyle = PLUS_COLOR
  ctx.fillText('Re{e^(j2πf₀t)}', lx, ly)
  ly += 12
  ctx.fillStyle = MINUS_COLOR
  ctx.fillText('Re{e^(−j2πf₀t)}', lx, ly)
  ly += 12
  ctx.fillStyle = colors.fg
  ctx.fillText('άθροισμα = cos(2πf₀t)', lx, ly)
}
