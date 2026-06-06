'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Riemann sum → integral, for FT §1.
 *
 * The mechanical heart of "the Fourier-series SUM becomes the Fourier-transform
 * INTEGRAL": each synthesis term is a strip of width Δf = 1/T₀, so the sum
 * Σ g(fₖ)·Δf is a Riemann sum, and as T₀ → ∞ (Δf → 0) the strips thin out and
 * the sum becomes ∫ g(f) df.
 *
 * Deliberately ONE idea: strips → area. No spectrum/height bookkeeping (that is
 * §2.1). The curve is a generic smooth bump g(f) = √(1 − (f/2)²) (a semi-ellipse,
 * ∫ = π) chosen because its vertical end-tangents make the convergence visibly
 * slow — you can watch the sum crawl toward π. All readouts/labels live in HTML
 * below the canvas; on the canvas itself we paint only the curve, the strips and
 * a single Δf bracket, so nothing sits unreadably on top of the curve.
 */

const T_MIN = 1
const T_MAX = 20
const HALF_W = 2 // g supported on [−2, 2]
const TRUE_INTEGRAL = Math.PI // ∫ √(1 − (f/2)²) df = π

function g(f: number) {
  if (Math.abs(f) >= HALF_W) return 0
  return Math.sqrt(1 - (f / HALF_W) * (f / HALF_W))
}

function riemannSum(df: number) {
  let s = 0
  const kMax = Math.ceil(HALF_W / df) + 1
  for (let k = -kMax; k <= kMax; k++) s += g(k * df) * df
  return s
}

export function RiemannSumToIntegral() {
  const [T0, setT0] = useState(2)
  const ref = useRef<HTMLCanvasElement | null>(null)
  const df = 1 / T0
  const sum = riemannSum(df)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !ref.current) return
    draw(ref.current, colors, T0)
  }, [T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Το άθροισμα γίνεται ολοκλήρωμα: Σ g(fₖ)·Δf → ∫ g(f) df
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Κάθε όρος του αθροίσματος είναι μια <strong>λωρίδα</strong> πλάτους{' '}
        <span className="font-mono">Δf = 1/T₀</span> — μία ανά αρμονική. Σύρε το{' '}
        <span className="font-mono">T₀</span>: όσο μεγαλώνει, οι λωρίδες{' '}
        <strong>λεπταίνουν</strong> και το άθροισμά τους πλησιάζει το{' '}
        <strong>εμβαδόν κάτω από την καμπύλη</strong> — δηλαδή το ολοκλήρωμα.
      </p>

      <canvas
        ref={ref}
        style={{ height: 230 }}
        className="block h-[230px] w-full"
        aria-label="Riemann rectangles of width Δf under a curve, approaching the area as Δf shrinks"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          {' · '}πλάτος λωρίδας Δf = 1/T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{df.toFixed(3)}</span>
        </label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step={0.1}
          value={T0}
          onChange={(e) => setT0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Period T0 (controls strip width Δf = 1/T0)"
        />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg p-2">
          <span className="text-fg-muted">άθροισμα λωρίδων </span>
          <span className="font-mono">Σ g(fₖ)·Δf</span> ={' '}
          <span
            className="font-mono font-semibold tabular-nums"
            style={{ color: 'rgb(var(--accent))' }}
          >
            {sum.toFixed(4)}
          </span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          <span className="text-fg-muted">εμβαδόν / ολοκλήρωμα </span>
          <span className="font-mono">∫ g(f) df</span> = π ={' '}
          <span className="font-mono font-semibold tabular-nums">
            {TRUE_INTEGRAL.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Αυτό ακριβώς κάνει η σύνθεση της σειράς Fourier: το άθροισμα{' '}
        <span className="font-mono">Σ X(fₖ)·e^(j2πfₖt)·Δf</span> είναι ένα τέτοιο άθροισμα
        Riemann, με <span className="font-mono">Δf = 1/T₀</span>. Καθώς{' '}
        <span className="font-mono">T₀ → ∞</span> (άρα{' '}
        <span className="font-mono">Δf → 0</span>) γίνεται το ολοκλήρωμα{' '}
        <span className="font-mono">∫ X(f)·e^(j2πft) df</span> — ο αντίστροφος Fourier
        transform.
      </div>
    </figure>
  )
}

const PAD_X = 34
const PAD_Y = 18

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function draw(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const df = 1 / T0
  const fDom = 2.5
  const yMax = 1.18

  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // Riemann strips: centred at fₖ = k·Δf, width Δf, height g(fₖ).
  const kMax = Math.ceil(HALF_W / df) + 1
  const showStroke = df > 0.14
  ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
  ctx.strokeStyle = `rgba(${accentRgb}, 0.55)`
  ctx.lineWidth = 0.6
  for (let k = -kMax; k <= kMax; k++) {
    const fc = k * df
    const gh = g(fc)
    if (gh <= 0) continue
    const xL = xt(fc - df / 2)
    const xR = xt(fc + df / 2)
    const yT = yv(gh)
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    if (showStroke) ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }

  // The curve g(f) on top.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 300
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -HALF_W, HALF_W)
    const x = xt(f)
    const y = yv(g(f))
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 8, yZero)
  ctx.lineTo(w - PAD_X + 8, yZero)
  ctx.stroke()

  // Single Δf bracket below the axis, on the central strip [−Δf/2, Δf/2].
  const xa = xt(-df / 2)
  const xb = xt(df / 2)
  const yBr = yZero + 11
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xa, yZero + 3)
  ctx.lineTo(xa, yBr + 3)
  ctx.moveTo(xb, yZero + 3)
  ctx.lineTo(xb, yBr + 3)
  ctx.moveTo(xa, yBr)
  ctx.lineTo(xb, yBr)
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Δf', xb + 4, yBr + 3)

  // Curve label, parked top-left away from the curve.
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('g(f)', PAD_X - 6, PAD_Y + 4)

  // f-edge ticks where the curve meets the axis.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('−2', xt(-HALF_W), yZero + 22)
  ctx.fillText('2', xt(HALF_W), yZero + 22)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 6, yZero - 4)
}
