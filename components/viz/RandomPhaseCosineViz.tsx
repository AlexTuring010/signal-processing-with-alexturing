'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32 } from '@/lib/random'

/**
 * The canonical random-phase cosine demo.
 *
 *   X(t) = A cos(2π f₀ t + Θ),  Θ ~ Uniform[0, 2π)
 *
 * Each realization is a deterministic cosine — the only thing that
 * differs from realization to realization is the phase Θ. Despite the
 * apparent simplicity, this is enough to make X(t) a *random process*
 * with mean 0 and autocorrelation R_X(τ) = (A²/2) cos(2π f₀ τ).
 *
 * The viz shows N realizations stacked, plus time-slice and ensemble
 * statistics that reveal the WSS structure: at any fixed t the
 * ensemble mean is 0; the autocorrelation depends only on τ = t₁-t₂.
 */

const NUM_REALIZATIONS = 8
const SAMPLES_PER_REAL = 240
const T_SPAN = 4 // seconds shown
const F0 = 1.0 // cosine frequency
const A = 1.0

export function RandomPhaseCosineViz() {
  const [seed, setSeed] = useState(7)
  const [tSlice, setTSlice] = useState(2.0) // moving vertical line
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, seed, tSlice)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, seed, tSlice)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [seed, tSlice])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          X(t) = A cos(2π f₀ t + Θ), Θ ~ U[0, 2π) — ensemble & time-slice
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: 8 «realizations» — διαφορετικές τιμές της τυχαίας φάσης Θ.
        Κάθε γραμμή είναι ένα συγκεκριμένο cosine. Μέσο: η{' '}
        <strong>«time slice»</strong> — αν παγώσεις τον χρόνο σε t και
        διαβάσεις την τιμή κάθε realization, παίρνεις μια <em>τυχαία
        μεταβλητή</em> X(t). Σύρε τη γραμμή και δες πώς η ραβδόγραμμα
        αλλάζει — αλλά το <strong>σχήμα της κατανομής μένει ίδιο</strong>{' '}
        (η arcsine, μαζεμένη στα άκρα ±A) — ένδειξη ότι το process είναι{' '}
        <strong>stationary</strong>.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Random-phase cosine ensemble visualization"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Time slice t ={' '}
          <span className="font-mono text-fg tabular-nums">
            {tSlice.toFixed(2)}
          </span>{' '}
          s
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
      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Παρατήρηση WSS:</strong> για κάθε t, το ensemble μέσο{' '}
        <span className="font-mono">E[X(t)] = 0</span> (ο μέσος όρος των
        cosines με τυχαία φάση είναι 0). Η αυτοσυσχέτιση{' '}
        <span className="font-mono">R_X(τ) = (A²/2)cos(2π f₀ τ)</span>{' '}
        εξαρτάται μόνο από τη <strong>διαφορά</strong> τ = t₁ - t₂, όχι από
        τα t₁ ή t₂ ξεχωριστά. → wide-sense stationary.
      </div>
    </figure>
  )
}

const REAL_C = 'rgb(29, 78, 216)'
const SLICE_C = 'rgb(217, 119, 6)'
const HIST_C = 'rgba(217, 119, 6, 0.5)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  seed: number,
  tSlice: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Top: ensemble of realizations (75% of height)
  const topH = h * 0.7
  drawEnsemble(ctx, colors, 0, 0, w, topH, seed, tSlice)

  // Bottom: histogram of time-slice values (25%)
  const bottomY = topH + 4
  drawHistogram(ctx, colors, 0, bottomY, w, h - bottomY, seed, tSlice)
}

function makeRealizations(seed: number, n: number): number[] {
  const rng = mulberry32(seed)
  const phases: number[] = []
  for (let i = 0; i < n; i++) phases.push(rng() * 2 * Math.PI)
  return phases
}

function drawEnsemble(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  seed: number,
  tSlice: number,
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22

  const phases = makeRealizations(seed, NUM_REALIZATIONS)
  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + PAD_X, x0 + pw - PAD_X)
  // Each realization gets its own horizontal strip
  const stripH = (ph - PAD_TOP - PAD_BOTTOM) / NUM_REALIZATIONS
  const yForReal = (i: number, v: number) => {
    const stripCenter = y0 + PAD_TOP + (i + 0.5) * stripH
    return stripCenter - (v / 1.4) * (stripH * 0.4)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Ensemble (8 realizations)', x0 + PAD_X, y0 + 12)

  // Time-slice vertical line (drawn first, behind the curves)
  const xSlice = xt(tSlice)
  ctx.strokeStyle = SLICE_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xSlice, y0 + PAD_TOP)
  ctx.lineTo(xSlice, y0 + ph - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = SLICE_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`t = ${tSlice.toFixed(2)}`, xSlice, y0 + PAD_TOP - 3)

  // Draw each realization in its own strip
  ctx.lineWidth = 1.2
  ctx.strokeStyle = REAL_C
  for (let i = 0; i < NUM_REALIZATIONS; i++) {
    const theta = phases[i]
    // Strip baseline (t-axis for that strip)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, yForReal(i, 0))
    ctx.lineTo(x0 + pw - PAD_X, yForReal(i, 0))
    ctx.stroke()

    ctx.strokeStyle = REAL_C
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let s = 0; s <= SAMPLES_PER_REAL; s++) {
      const t = (s / SAMPLES_PER_REAL) * T_SPAN
      const v = A * Math.cos(2 * Math.PI * F0 * t + theta)
      const x = xt(t)
      const y = yForReal(i, v)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Mark the time-slice intersection
    const vAtSlice = A * Math.cos(2 * Math.PI * F0 * tSlice + theta)
    ctx.fillStyle = SLICE_C
    ctx.beginPath()
    ctx.arc(xSlice, yForReal(i, vAtSlice), 2.5, 0, Math.PI * 2)
    ctx.fill()

    // Realization label
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`X${subscript(i + 1)}`, x0 + PAD_X - 4, yForReal(i, 0) + 3)
  }

  // X-axis labels at bottom
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) {
    const x = xt(t)
    ctx.fillText(`${t}s`, x, y0 + ph - 4)
  }
}

function drawHistogram(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  seed: number,
  tSlice: number,
) {
  if (!colors) return
  // Use a much larger ensemble for the histogram (deterministic from same seed via multiplier)
  const N_HIST = 800
  const phases = makeRealizations(seed * 13 + 1, N_HIST)
  const slice = phases.map((th) => A * Math.cos(2 * Math.PI * F0 * tSlice + th))

  const PAD_X = 50
  const PAD_TOP = 14
  const PAD_BOTTOM = 22

  // Bin into 32 bins from -A to A
  const NBINS = 32
  const bins = new Array(NBINS).fill(0)
  for (const v of slice) {
    const idx = Math.min(NBINS - 1, Math.max(0, Math.floor(((v + A) / (2 * A)) * NBINS)))
    bins[idx]++
  }
  const maxBin = Math.max(...bins)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Κατανομή του X(t) στη time-slice t = ${tSlice.toFixed(2)}`, x0 + PAD_X, y0 + 10)

  const xv = (v: number) => lerp(v, -A * 1.2, A * 1.2, x0 + PAD_X, x0 + pw - PAD_X)
  const yh = (h: number) => lerp(h, 0, maxBin * 1.1, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Bars
  const binW = (xv(A) - xv(-A)) / NBINS
  for (let i = 0; i < NBINS; i++) {
    const v = -A + ((i + 0.5) / NBINS) * 2 * A
    const x = xv(v) - binW / 2
    ctx.fillStyle = HIST_C
    ctx.fillRect(x + 0.5, yh(bins[i]), binW - 1, yAxis - yh(bins[i]))
  }

  // Theoretical PDF overlay: f(x) = 1/(π√(A²-x²))
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 200
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const v = -A + (i / STEPS) * 2 * A
    if (Math.abs(v) >= A * 0.999) continue
    const f = 1 / (Math.PI * Math.sqrt(A * A - v * v))
    // Convert PDF to histogram-count scale: count ≈ f · (binWidthInVoltage) · N
    const binWidthV = (2 * A) / NBINS
    const count = f * binWidthV * N_HIST
    const px = xv(v)
    const py = yh(count)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('-A', xv(-A), yAxis + 12)
  ctx.fillText('0', xv(0), yAxis + 12)
  ctx.fillText('+A', xv(A), yAxis + 12)
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.textAlign = 'left'
  ctx.fillText('PDF: 1/(π√(A²-x²)) — arcsine', x0 + PAD_X + 5, y0 + 22)
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return n
    .toString()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
}
