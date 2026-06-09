'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Intro random-phase cosine — the §3 version for /randomness/why.
 *
 * Deliberately minimal and matched to the slide-6 example the §3 prose builds:
 *
 *   X(t) = A cos(2π f₀ t + φ),  φ ∈ {0, π/4, π/2, 3π/4}, each w.p. 1/4
 *
 * Top:    the 4 realizations (one deterministic cosine per phase), stacked,
 *         with a draggable time-slice line. Read horizontally = one realization.
 * Bottom: at the time-slice, the 4 realizations give 4 values — that IS the
 *         random variable X(t). Shown as a tiny discrete distribution (one stem
 *         per distinct value, height = probability). Read vertically = a frozen
 *         instant is a random variable.
 *
 * NOTHING here uses PDF / arcsine / WSS / ensemble-mean / autocorrelation —
 * those are introduced on later pages (/random-variables, /random-processes,
 * /stationarity), where the fuller <RandomPhaseCosineViz /> belongs. Keeping
 * this viz at §3's level is the whole point: it only shows "family of
 * realizations" + "a frozen instant is a random variable".
 */

const PHASES = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]
const PHASE_LABELS = ['0', 'π/4', 'π/2', '3π/4']
const N = PHASES.length
const SAMPLES = 240
const T_SPAN = 4
const F0 = 1.0
const A = 1.0

const REAL_C = 'rgb(29, 78, 216)' // blue — realizations
const SLICE_C = 'rgb(217, 119, 6)' // amber — time-slice + the values it picks out

export function RandomPhaseCosineIntroViz() {
  const [tSlice, setTSlice] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, tSlice)
  }, [tSlice])

  const vals = PHASES.map((ph) => A * Math.cos(2 * Math.PI * F0 * tSlice + ph))

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        X(t) = A cos(2π f₀ t + φ), φ ∈ &#123;0, π/4, π/2, 3π/4&#125; — realizations &amp; time-slice
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: οι <strong>4 realizations</strong> — οι 4 σταθερές φάσεις, καθεμία ένα
        ντετερμινιστικό cosine. Κάθε γραμμή διαβάζεται οριζόντια = μία καταγραφή.
        Σύρε την κάθετη <strong>«time-slice»</strong>: σε κάθε στιγμή t, οι 4
        realizations δίνουν 4 τιμές — αυτές οι τιμές μαζί είναι η{' '}
        <em>τυχαία μεταβλητή</em> X(t). Κάτω: η κατανομή αυτών των τιμών (4 πιθανές
        τιμές, καθεμία με πιθανότητα ¼). Άλλη στιγμή ⇒ άλλες τιμές — αλλά πάντα μια
        τυχαία μεταβλητή.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Four random-phase cosine realizations and the discrete distribution of their values at a time-slice"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Time-slice t ={' '}
          <span className="font-mono text-fg tabular-nums">{tSlice.toFixed(2)}</span> s
          <span className="ml-2 text-fg-subtle">
            — οι 4 τιμές X(t): {vals.map((v) => v.toFixed(2)).join(', ')}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={T_SPAN}
          step={0.01}
          value={tSlice}
          onChange={(e) => setTSlice(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tSlice: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const topH = h * 0.66
  drawRealizations(ctx, colors, 0, 0, w, topH, tSlice)
  drawDistribution(ctx, colors, 0, topH + 4, w, h - topH - 4, tSlice)
}

function drawRealizations(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tSlice: number,
) {
  if (!colors) return
  const PAD_X = 52
  const PAD_TOP = 18
  const PAD_BOTTOM = 18

  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + PAD_X, x0 + pw - PAD_X)
  const stripH = (ph - PAD_TOP - PAD_BOTTOM) / N
  const yFor = (i: number, v: number) => {
    const center = y0 + PAD_TOP + (i + 0.5) * stripH
    return center - (v / 1.4) * (stripH * 0.4)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Οι 4 realizations (μία ανά φάση)', x0 + PAD_X, y0 + 12)

  // time-slice line (behind the curves)
  const xS = xt(tSlice)
  ctx.strokeStyle = SLICE_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xS, y0 + PAD_TOP)
  ctx.lineTo(xS, y0 + ph - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = SLICE_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`t = ${tSlice.toFixed(2)}`, xS, y0 + PAD_TOP - 3)

  for (let i = 0; i < N; i++) {
    const ph = PHASES[i]

    // strip baseline
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, yFor(i, 0))
    ctx.lineTo(x0 + pw - PAD_X, yFor(i, 0))
    ctx.stroke()

    // cosine
    ctx.strokeStyle = REAL_C
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let s = 0; s <= SAMPLES; s++) {
      const t = (s / SAMPLES) * T_SPAN
      const v = A * Math.cos(2 * Math.PI * F0 * t + ph)
      const x = xt(t)
      const y = yFor(i, v)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // value at the slice
    const vS = A * Math.cos(2 * Math.PI * F0 * tSlice + ph)
    ctx.fillStyle = SLICE_C
    ctx.beginPath()
    ctx.arc(xS, yFor(i, vS), 2.6, 0, Math.PI * 2)
    ctx.fill()

    // left label Xᵢ, right label φ=…
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`X${subscript(i + 1)}`, x0 + PAD_X - 5, yFor(i, 0) + 3)
    ctx.textAlign = 'left'
    ctx.fillText(`φ=${PHASE_LABELS[i]}`, x0 + pw - PAD_X + 5, yFor(i, 0) + 3)
  }

  // x-axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) ctx.fillText(`${t}s`, xt(t), y0 + ph - 4)
}

function drawDistribution(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tSlice: number,
) {
  if (!colors) return
  const PAD_X = 52
  const PAD_TOP = 18
  const PAD_BOTTOM = 18
  const PROB_TOP = 0.7 // y headroom (max stem is ½ for this example)

  const xv = (v: number) => lerp(v, -A * 1.25, A * 1.25, x0 + PAD_X, x0 + pw - PAD_X)
  const yp = (p: number) => lerp(p, 0, PROB_TOP, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yBase = yp(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Κατανομή τιμών του X(t) τώρα — η τυχαία μεταβλητή', x0 + PAD_X, y0 + 11)

  // value axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yBase)
  ctx.lineTo(x0 + pw - PAD_X, yBase)
  ctx.stroke()

  // ¼ reference line
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yp(0.25))
  ctx.lineTo(x0 + pw - PAD_X, yp(0.25))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('¼', x0 + PAD_X - 5, yp(0.25) + 3)

  // group the 4 values into distinct stems (two can coincide → ½)
  const vals = PHASES.map((ph) => A * Math.cos(2 * Math.PI * F0 * tSlice + ph))
  const groups: { v: number; p: number }[] = []
  for (const v of vals) {
    const g = groups.find((gr) => Math.abs(gr.v - v) < 0.03 * A)
    if (g) g.p += 0.25
    else groups.push({ v, p: 0.25 })
  }

  // stems (lollipops) at each distinct value, height = probability
  for (const g of groups) {
    const x = xv(g.v)
    ctx.strokeStyle = SLICE_C
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, yBase)
    ctx.lineTo(x, yp(g.p))
    ctx.stroke()
    ctx.fillStyle = SLICE_C
    ctx.beginPath()
    ctx.arc(x, yp(g.p), 3.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = colors.fgMuted
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(fracLabel(g.p), x, yp(g.p) - 5)
  }

  // value-axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('−A', xv(-A), yBase + 12)
  ctx.fillText('0', xv(0), yBase + 12)
  ctx.fillText('+A', xv(A), yBase + 12)
  ctx.textAlign = 'right'
  ctx.fillText('τιμή του X(t) →', x0 + pw - PAD_X, yBase + 12)
}

function fracLabel(p: number): string {
  if (Math.abs(p - 0.25) < 0.01) return '¼'
  if (Math.abs(p - 0.5) < 0.01) return '½'
  if (Math.abs(p - 0.75) < 0.01) return '¾'
  if (Math.abs(p - 1) < 0.01) return '1'
  return p.toFixed(2)
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  }
  return n.toString().split('').map((c) => map[c] ?? c).join('')
}
