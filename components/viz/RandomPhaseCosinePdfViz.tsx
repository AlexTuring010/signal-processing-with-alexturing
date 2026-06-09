'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32 } from '@/lib/random'

/**
 * Random-phase cosine, PDF view — for /randomness/random-variables §8.
 *
 *   X(t) = A cos(2π f₁ t + φ),  φ ~ U[0, π]   (the slide-14 "Άσκηση 1" support)
 *
 * The page's point: a frozen instant X(t) is a RANDOM VARIABLE, and the
 * histogram of its values across realizations IS its PDF — the same PDF LOTUS
 * integrates against to get the mean m_X(t).
 *
 *   Top:    ~10 realizations (phases sampled from U[0,π]), draggable time-slice.
 *   Bottom: histogram of the slice values (from many samples) ≈ PDF of X(t),
 *           with the empirical mean marked. The readout matches it to the page's
 *           closed-form m_X(t) = −(2A/π) sin(2π f₁ t).
 *
 * Deliberately scoped to RV / PDF / mean (this page's material). No WSS /
 * autocorrelation — those are built on the later randomness pages.
 */

const PHI_MAX = Math.PI // support U[0, π]
const N_SHOWN = 10
const N_HIST = 600
const SAMPLES = 220
const T_SPAN = 2
const F1 = 1.0
const A = 1.0

const REAL_C = 'rgb(29, 78, 216)'
const SLICE_C = 'rgb(217, 119, 6)'
const HIST_C = 'rgba(217, 119, 6, 0.45)'
const MEAN_C = 'rgb(220, 38, 38)'

function meanTheory(t: number): number {
  return -((2 * A) / Math.PI) * Math.sin(2 * Math.PI * F1 * t)
}

export function RandomPhaseCosinePdfViz() {
  const [seed, setSeed] = useState(3)
  const [tSlice, setTSlice] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, seed, tSlice)
  }, [seed, tSlice])

  // empirical mean of the slice values for the readout
  const rng = mulberry32(seed * 101 + 5)
  let sum = 0
  for (let i = 0; i < N_HIST; i++) {
    const phi = rng() * PHI_MAX
    sum += A * Math.cos(2 * Math.PI * F1 * tSlice + phi)
  }
  const meanEmp = sum / N_HIST

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          X(t) = A cos(2π f₁ t + φ), φ ~ U[0, π] — η time-slice είναι ΤΜ με PDF
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
        Πάνω: realizations με τυχαία φάση φ ~ U[0, π] — κάθε γραμμή ένα
        ντετερμινιστικό cosine. Σύρε την <strong>time-slice</strong>: σε σταθερό t
        «τέμνεις» τις realizations και παίρνεις την ΤΜ X(t). Κάτω: το{' '}
        <strong>ιστόγραμμα</strong> των τιμών της — όσες περισσότερες realizations
        μετράς, τόσο καθαρότερα σχηματίζεται η <strong>PDF</strong> της X(t). Η
        κόκκινη γραμμή είναι ο μέσος <span className="font-mono">m_X(t) = E[X(t)]</span>{' '}
        — ακριβώς ό,τι υπολογίζει το LOTUS παραπάνω.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Random-phase cosine realizations and the histogram (PDF) of the time-slice values"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Time-slice t ={' '}
          <span className="font-mono text-fg tabular-nums">{tSlice.toFixed(2)}</span> s
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
        Μέσος της time-slice: <strong>εμπειρικά</strong> (από το ιστόγραμμα){' '}
        <span className="font-mono">{meanEmp.toFixed(3)}</span> ·{' '}
        <strong>θεωρητικά</strong> (LOTUS){' '}
        <span className="font-mono">−(2A/π)·sin(2π f₁ t) = {meanTheory(tSlice).toFixed(3)}</span>.
        Σύρε το t και δες ότι ο μέσος <strong>αλλάζει με τον χρόνο</strong> (δεν
        είναι 0) — γι' αυτό αυτή η ΤΔ <em>δεν</em> έχει σταθερό μέσο.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  seed: number,
  tSlice: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const topH = h * 0.6
  drawEnsemble(ctx, colors, 0, 0, w, topH, seed, tSlice)
  drawHistogram(ctx, colors, 0, topH + 4, w, h - topH - 4, seed, tSlice)
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
  const PAD_X = 44
  const PAD_TOP = 16
  const PAD_BOTTOM = 18

  const rng = mulberry32(seed)
  const phases = Array.from({ length: N_SHOWN }, () => rng() * PHI_MAX)

  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + PAD_X, x0 + pw - PAD_X)
  const yMid = y0 + PAD_TOP + (ph - PAD_TOP - PAD_BOTTOM) / 2
  const amp = (ph - PAD_TOP - PAD_BOTTOM) * 0.42
  const yv = (v: number) => yMid - v * (amp / A)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N_SHOWN} realizations (φ ~ U[0, π])`, x0 + PAD_X, y0 + 11)

  // time-slice line
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
  ctx.fillText(`t = ${tSlice.toFixed(2)}`, xS, y0 + PAD_TOP - 2)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(0))
  ctx.lineTo(x0 + pw - PAD_X, yv(0))
  ctx.stroke()

  // realizations (overlaid, faint)
  for (const phi of phases) {
    ctx.strokeStyle = REAL_C
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let s = 0; s <= SAMPLES; s++) {
      const t = (s / SAMPLES) * T_SPAN
      const v = A * Math.cos(2 * Math.PI * F1 * t + phi)
      const x = xt(t)
      const y = yv(v)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
    // slice dot
    const vS = A * Math.cos(2 * Math.PI * F1 * tSlice + phi)
    ctx.fillStyle = SLICE_C
    ctx.beginPath()
    ctx.arc(xS, yv(vS), 2.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let i = 0; i <= 2; i++) {
    const t = (i / 2) * T_SPAN
    ctx.fillText(`${t.toFixed(0)}s`, xt(t), y0 + ph - 4)
  }
  ctx.textAlign = 'right'
  ctx.fillText('+A', x0 + PAD_X - 4, yv(A) + 3)
  ctx.fillText('−A', x0 + PAD_X - 4, yv(-A) + 3)
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
  const PAD_X = 44
  const PAD_TOP = 16
  const PAD_BOTTOM = 18

  const rng = mulberry32(seed * 101 + 5)
  const vals: number[] = []
  let sum = 0
  for (let i = 0; i < N_HIST; i++) {
    const phi = rng() * PHI_MAX
    const v = A * Math.cos(2 * Math.PI * F1 * tSlice + phi)
    vals.push(v)
    sum += v
  }
  const meanEmp = sum / N_HIST

  const NBINS = 30
  const bins = new Array(NBINS).fill(0)
  for (const v of vals) {
    const idx = Math.min(NBINS - 1, Math.max(0, Math.floor(((v + A) / (2 * A)) * NBINS)))
    bins[idx]++
  }
  const maxBin = Math.max(...bins, 1)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Ιστόγραμμα τιμών στη time-slice ≈ PDF της X(t)', x0 + PAD_X, y0 + 10)

  const xv = (v: number) => lerp(v, -A * 1.2, A * 1.2, x0 + PAD_X, x0 + pw - PAD_X)
  const yh = (c: number) => lerp(c, 0, maxBin * 1.12, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  // x-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // bars
  const binW = (xv(A) - xv(-A)) / NBINS
  ctx.fillStyle = HIST_C
  for (let i = 0; i < NBINS; i++) {
    const v = -A + ((i + 0.5) / NBINS) * 2 * A
    const x = xv(v) - binW / 2
    ctx.fillRect(x + 0.5, yh(bins[i]), binW - 1, yAxis - yh(bins[i]))
  }

  // empirical mean line
  const xm = xv(meanEmp)
  ctx.strokeStyle = MEAN_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xm, yAxis)
  ctx.lineTo(xm, y0 + PAD_TOP)
  ctx.stroke()
  ctx.fillStyle = MEAN_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = xm > (x0 + pw) / 2 ? 'right' : 'left'
  ctx.fillText(`m_X(t) = ${meanEmp.toFixed(2)}`, xm + (xm > (x0 + pw) / 2 ? -4 : 4), y0 + PAD_TOP + 8)

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('−A', xv(-A), yAxis + 12)
  ctx.fillText('0', xv(0), yAxis + 12)
  ctx.fillText('+A', xv(A), yAxis + 12)
  ctx.textAlign = 'right'
  ctx.fillText('τιμή X(t) →', x0 + pw - PAD_X, yAxis + 12)
}
