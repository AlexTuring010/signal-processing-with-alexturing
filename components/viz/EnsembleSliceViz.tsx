'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'
import { mulberry32, uniform } from '@/lib/random'

/**
 * EnsembleSliceViz — "freeze one time, look across the realizations, watch the
 * values pile up into a distribution." This is the mechanism behind the
 * one-time PDF f_{X(t)}: drag the vertical freeze-line through an ensemble of
 * sample functions and see the dots on that line project into a sideways
 * histogram/PDF on the right.
 *
 * The process is built to be the same one used by the WSS≠SSS example: at
 * every t it is zero-mean with unit variance (the red mean line and the ±σ
 * band never move), but its marginal SHAPE drifts from a symmetric bell early
 * to right-skewed late. So the student sees concretely that "mean & variance
 * fixed, shape free" — and that the one-time distribution is a real object you
 * read off the ensemble vertically, not the horizontal R_X view.
 *
 * Construction: each realization is X_r(t) = standardized skew-normal with
 * shape α(t), via the Azzalini representation δ|Z0| + √(1−δ²)·Z1 (Z0,Z1 smooth
 * iid-Gaussian processes built from random-phase cosine sums), recentered and
 * rescaled so mean=0, var=1 at every t regardless of α.
 */

const T_SPAN = 4 // seconds on the time axis
const M = 24 // realizations drawn (a few of infinitely many)
const K = 7 // cosines per smooth Gaussian-ish process
const ALPHA_MAX = 5 // skew-normal shape at t = T_SPAN
const Y_LIM = 3.4 // value-axis half-range
const SQRT_2_OVER_PI = Math.sqrt(2 / Math.PI)

type CosSpec = { f: number[]; ph: number[] }
type Realization = { z0: CosSpec; z1: CosSpec }

function makeSpec(rng: () => number): CosSpec {
  const f: number[] = new Array(K)
  const ph: number[] = new Array(K)
  for (let k = 0; k < K; k++) {
    f[k] = uniform(rng, 0.25, 1.25) // a few cycles over T_SPAN
    ph[k] = uniform(rng, 0, 2 * Math.PI)
  }
  return { f, ph }
}

// Smooth zero-mean, unit-variance, ~Gaussian process (random-phase cosine sum).
function evalZ(spec: CosSpec, t: number): number {
  let s = 0
  for (let k = 0; k < K; k++) s += Math.cos(2 * Math.PI * spec.f[k] * t + spec.ph[k])
  return s * Math.sqrt(2 / K)
}

function alphaAt(t: number): number {
  return (t / T_SPAN) * ALPHA_MAX
}
function deltaOf(alpha: number): number {
  return alpha / Math.sqrt(1 + alpha * alpha)
}

// Standardized skew-normal sample at time t for realization r (mean 0, var 1).
function evalX(r: Realization, t: number): number {
  const d = deltaOf(alphaAt(t))
  const z0 = evalZ(r.z0, t)
  const z1 = evalZ(r.z1, t)
  const m1 = d * SQRT_2_OVER_PI
  const sd = Math.sqrt(1 - (2 * d * d) / Math.PI)
  return (d * Math.abs(z0) + Math.sqrt(1 - d * d) * z1 - m1) / sd
}

// --- standardized skew-normal PDF (for the overlay curve) ---
function phi(z: number) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}
function erf(x: number) {
  const s = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const p = 0.3275911
  const t = 1 / (1 + p * ax)
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax)
  return s * y
}
function bigPhi(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}
function skewNormalStdPdf(x: number, t: number): number {
  const alpha = alphaAt(t)
  const d = deltaOf(alpha)
  const m1 = d * SQRT_2_OVER_PI
  const sd = Math.sqrt(1 - (2 * d * d) / Math.PI)
  const w = m1 + sd * x
  return 2 * phi(w) * bigPhi(alpha * w) * sd
}

export function EnsembleSliceViz() {
  const [t, setT] = useState(0.7 * T_SPAN)
  const [seed, setSeed] = useState(7)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const ensemble = useMemo<Realization[]>(() => {
    const rng = mulberry32(seed * 2654435761)
    const out: Realization[] = []
    for (let r = 0; r < M; r++) out.push({ z0: makeSpec(rng), z1: makeSpec(rng) })
    return out
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, ensemble, t)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [ensemble, t])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Πάγωσε τον χρόνο: από τις realizations στην κατανομή μίας στιγμής
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ensemble of realizations with a draggable freeze-time line projecting into the one-time distribution"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          σύρε τη γραμμή «πάγωσε τον χρόνο» — χρονική στιγμή{' '}
          <span className="font-mono text-fg tabular-nums">t = {t.toFixed(2)} s</span>
        </label>
        <input
          type="range"
          min={0.15 * T_SPAN}
          max={T_SPAN}
          step={0.01}
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Κάθε γαλάζια γραμμή είναι μία realization (μία από άπειρες). Στη{' '}
        <span className="text-accent">κόκκινη γραμμή</span> διαβάζεις τις τιμές{' '}
        <InlineFx>X(t)</InlineFx> όλων των realizations <strong>κάθετα</strong>· δεξιά πέφτουν σε
        μια <strong>κατανομή</strong> — η PDF μίας στιγμής <InlineFx>f_X(t)</InlineFx>. Σύρε τον
        χρόνο: ο μέσος μένει στο 0 και η μπλε λωρίδα <InlineFx>±σ</InlineFx> ακίνητη, αλλά το{' '}
        <strong>σχήμα</strong> στραβώνει: η κορυφή γλιστράει αριστερά, με μακριά ουρά προς τα δεξιά
        (θετική skewness — τη μετράει η ουρά, όχι η κορυφή). Αυτό ακριβώς αφήνει ελεύθερο η WSS.
      </p>
    </figure>
  )
}

function InlineFx({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[0.95em] text-fg">{children}</span>
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  ensemble: Realization[],
  tSlice: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padL = 34
  const padR = 12
  const padTop = 16
  const padBottom = 26
  const plotW = w - padL - padR
  const plotH = h - padTop - padBottom

  const stripW = Math.max(74, Math.min(150, plotW * 0.3))
  const gap = 12
  const mainW = plotW - stripW - gap
  const dividerX = padL + mainW + gap
  const stripX0 = dividerX

  const xt = (t: number) => padL + (t / T_SPAN) * mainW
  const yv = (v: number) => padTop + ((Y_LIM - v) / (2 * Y_LIM)) * plotH
  const sliceX = xt(tSlice)

  // ±σ band (variance = 1, constant in t) — drawn first, behind everything
  ctx.fillStyle = colors.accentSoft
  ctx.globalAlpha = 0.4
  ctx.fillRect(padL, yv(1), padL + plotW - padL, yv(-1) - yv(1))
  ctx.globalAlpha = 1

  // axes box
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(padL, padTop, mainW, plotH)

  // value-axis ticks (shared by main + strip)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (let v = -3; v <= 3; v++) {
    ctx.fillText(String(v), padL - 4, yv(v) + 3)
  }
  // time-axis ticks
  ctx.textAlign = 'center'
  for (let s = 0; s <= T_SPAN; s++) ctx.fillText(`${s}s`, xt(s), h - 6)
  ctx.fillText('χρόνος t', xt(T_SPAN) - 22, padTop + plotH + 16)

  // realizations (translucent blue) — a few of infinitely many
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  const STEPS = 220
  for (let r = 0; r < ensemble.length; r++) {
    ctx.globalAlpha = 0.32
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * T_SPAN
      const v = Math.max(-Y_LIM, Math.min(Y_LIM, evalX(ensemble[r], t)))
      const x = xt(t)
      const y = yv(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // freeze-time line (red, vertical)
  ctx.strokeStyle = colors.danger
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(sliceX, padTop)
  ctx.lineTo(sliceX, padTop + plotH)
  ctx.stroke()

  // dots = each realization's value at the slice, + faint projection guides
  const sliceVals: number[] = []
  for (let r = 0; r < ensemble.length; r++) {
    const v = evalX(ensemble[r], tSlice)
    sliceVals.push(v)
    const vc = Math.max(-Y_LIM, Math.min(Y_LIM, v))
    const y = yv(vc)
    // guide line from dot toward the distribution strip
    ctx.strokeStyle = colors.fgSubtle
    ctx.globalAlpha = 0.18
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(sliceX, y)
    ctx.lineTo(dividerX, y)
    ctx.stroke()
    ctx.globalAlpha = 1
    // dot
    ctx.fillStyle = colors.danger
    ctx.beginPath()
    ctx.arc(sliceX, y, 2.6, 0, 2 * Math.PI)
    ctx.fill()
  }

  // mean line m_X = 0 (red dashed), across main + strip
  ctx.strokeStyle = colors.danger
  ctx.lineWidth = 1.3
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(padL, yv(0))
  ctx.lineTo(stripX0 + stripW, yv(0))
  ctx.stroke()
  ctx.setLineDash([])

  // ±σ labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('+σ', padL + 3, yv(1) + 10)
  ctx.fillText('−σ', padL + 3, yv(-1) - 4)
  ctx.fillStyle = colors.danger
  ctx.fillText('μέσος = 0', padL + 3, yv(0) - 4)

  // ---- right strip: the one-time distribution ----
  // divider
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(dividerX, padTop)
  ctx.lineTo(dividerX, padTop + plotH)
  ctx.stroke()

  // theoretical PDF scale (peak maps near full strip width)
  const NP = 120
  let pdfMax = 1e-9
  for (let i = 0; i <= NP; i++) {
    const v = -Y_LIM + (i / NP) * 2 * Y_LIM
    pdfMax = Math.max(pdfMax, skewNormalStdPdf(v, tSlice))
  }
  const scale = (stripW - 4) / pdfMax

  // histogram of the slice values (horizontal bars, same density scale)
  const NBINS = 13
  const binW = (2 * Y_LIM) / NBINS
  const counts = new Array(NBINS).fill(0)
  for (const v of sliceVals) {
    const b = Math.floor((v + Y_LIM) / binW)
    if (b >= 0 && b < NBINS) counts[b] += 1
  }
  ctx.fillStyle = colors.accent
  ctx.globalAlpha = 0.28
  for (let b = 0; b < NBINS; b++) {
    if (counts[b] === 0) continue
    const dens = counts[b] / (M * binW)
    const len = Math.min(stripW - 2, dens * scale)
    const yTop = yv(-Y_LIM + (b + 1) * binW)
    const yBot = yv(-Y_LIM + b * binW)
    ctx.fillRect(stripX0 + 1, yTop, len, yBot - yTop - 1)
  }
  ctx.globalAlpha = 1

  // smooth theoretical PDF curve (sideways: x = density, parametrised by value)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= NP; i++) {
    const v = -Y_LIM + (i / NP) * 2 * Y_LIM
    const d = skewNormalStdPdf(v, tSlice)
    const x = stripX0 + d * scale
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // strip header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('κατανομή στο t', stripX0 + stripW / 2, padTop + plotH + 16)
}
