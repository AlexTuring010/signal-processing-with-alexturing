'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * WssShapeDriftViz — the picture behind "WSS ✓ but SSS ✗".
 *
 * A zero-mean process whose MARGINAL distribution f_{X(t)}(x) is scrubbed
 * through time. As `t` advances the shape morphs from a symmetric bell to a
 * right-skewed curve — yet the mean stays pinned at 0 and the variance stays
 * pinned at σ² (the ±σ band never moves and never widens). The readout splits
 * the four moments into the two WSS *locks* (mean, variance) and the two it
 * leaves *free* (skewness = 3rd, excess kurtosis = 4th). That split IS the
 * lesson: WSS constrains only the 1st and 2nd moments, so the joint PDF can
 * still change shape ⇒ not SSS.
 *
 * The family is a standardized skew-normal: base shape 2·φ(z)·Φ(αz) with
 * α = α(t), then shifted/scaled so the plotted density has mean 0 and a fixed
 * variance regardless of α. Moments are measured numerically from the curve
 * that is actually drawn, so the printed numbers match the picture exactly.
 */

const SIGMA = 1 // fixed display std: variance σ² = 1 is held constant across t
const ALPHA_MAX = 6 // skew-normal shape at t = 1 (≈ max visible right-skew)

function phi(z: number) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

// erf via Abramowitz & Stegun 7.1.26 (max abs error ≈ 1.5e-7) — for shape only.
function erf(x: number) {
  const s = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const p = 0.3275911
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const t = 1 / (1 + p * ax)
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax)
  return s * y
}

function bigPhi(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

type ShapeModel = {
  pts: Array<[number, number]> // (x, density) of the plotted, standardized curve
  mean: number
  variance: number
  skewness: number
  exKurtosis: number
}

/**
 * Build the standardized skew-normal density for a normalized time tNorm∈[0,1].
 * Returns plot points whose mean is 0 and variance is exactly SIGMA², plus the
 * four moments measured from that same curve.
 */
function buildModel(tNorm: number): ShapeModel {
  const alpha = tNorm * ALPHA_MAX
  const zMin = -7
  const zMax = 9 // longer right tail to capture the skew before standardizing
  const N = 720
  const dz = (zMax - zMin) / N

  const zs: number[] = new Array(N + 1)
  const ps: number[] = new Array(N + 1)
  const w = (i: number) => (i === 0 || i === N ? 0.5 : 1) // trapezoid weights

  // raw density g(z) = 2 φ(z) Φ(αz), then normalize to unit area
  let area = 0
  for (let i = 0; i <= N; i++) {
    const z = zMin + i * dz
    const g = 2 * phi(z) * bigPhi(alpha * z)
    zs[i] = z
    ps[i] = g
    area += w(i) * g * dz
  }
  for (let i = 0; i <= N; i++) ps[i] /= area

  // central moments measured numerically from the (normalized) curve
  let m1 = 0
  for (let i = 0; i <= N; i++) m1 += w(i) * zs[i] * ps[i] * dz
  let m2 = 0
  let m3 = 0
  let m4 = 0
  for (let i = 0; i <= N; i++) {
    const d = zs[i] - m1
    const wp = w(i) * ps[i] * dz
    m2 += wp * d * d
    m3 += wp * d * d * d
    m4 += wp * d * d * d * d
  }
  const sd = Math.sqrt(m2)
  const skewness = m3 / Math.pow(m2, 1.5)
  const exKurtosis = m4 / (m2 * m2) - 3

  // map z → x so the displayed density has mean 0 and std SIGMA:
  // x = (z − m1)·(SIGMA/sd);  f_X(x) = p(z)·dz/dx = p(z)·(sd/SIGMA)
  const k = SIGMA / sd
  const pts: Array<[number, number]> = new Array(N + 1)
  for (let i = 0; i <= N; i++) pts[i] = [(zs[i] - m1) * k, ps[i] / k]

  return { pts, mean: 0, variance: SIGMA * SIGMA, skewness, exKurtosis }
}

export function WssShapeDriftViz() {
  // t is a normalized "time along the record": 0 = early, 1 = late
  const [t, setT] = useState(0.85)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Static extremes drawn as faint ghosts so the drift is visible at a glance.
  const ghostSym = useMemo(() => buildModel(0), [])
  const ghostSkew = useMemo(() => buildModel(1), [])
  const live = useMemo(() => buildModel(t), [t])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, live, ghostSym, ghostSkew)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [live, ghostSym, ghostSkew])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold tracking-tight">
          Ίδιος μέσος, ίδια variance — αλλάζει μόνο το σχήμα
        </h4>
        <p className="mt-1 text-xs text-fg-muted">
          Η κατανομή πλάτους <InlineFx>f</InlineFx> της ΤΔ σε μία χρονική στιγμή{' '}
          <InlineFx>t</InlineFx>. Σύρε τον χρόνο και δες: ο μέσος μένει στο 0 και η variance
          μένει <InlineFx>σ²</InlineFx> (η μπλε λωρίδα <InlineFx>±σ</InlineFx> δεν κουνιέται,
          ούτε φαρδαίνει) — αλλάζει μόνο το <em>σχήμα</em>.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Marginal PDF of a zero-mean process at one time instant, morphing from symmetric to right-skewed while mean and variance stay fixed"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          χρονική στιγμή <span className="font-mono text-fg tabular-nums">t</span>{' '}
          <span className="text-fg-subtle">(νωρίς → αργά)</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
        {/* Locked by WSS */}
        <div className="rounded-md border border-accent/40 bg-accent-soft/20 px-3 py-2">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            🔒 Κλειδωμένα από WSS — δεν αλλάζουν
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="μέσος E[X]" value={live.mean.toFixed(2)} ord="1η ροπή" />
            <Stat label="variance σ²" value={live.variance.toFixed(2)} ord="2η ροπή" />
          </div>
        </div>
        {/* Free to drift */}
        <div className="rounded-md border border-amber-400/50 bg-amber-50/50 px-3 py-2 dark:bg-amber-950/20">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            🔓 Ελεύθερα — αλλάζουν στον χρόνο
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="skewness" value={live.skewness.toFixed(2)} ord="3η ροπή" accent="amber" />
            <Stat
              label="kurtosis (excess)"
              value={live.exKurtosis.toFixed(2)}
              ord="4η ροπή"
              accent="amber"
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Νωρίς (<InlineFx>t≈0</InlineFx>) η κατανομή είναι συμμετρική καμπάνα: skewness 0. Αργά
        (<InlineFx>t≈1</InlineFx>) η κορυφή γλιστράει αριστερά κι αναπτύσσεται μακριά «ουρά» δεξιά:
        θετική skewness. Επειδή <strong>η 1η &amp; 2η ροπή μένουν κλειδωμένες</strong> αλλά{' '}
        <strong>η 3η &amp; 4η αλλάζουν</strong>, η ΤΔ είναι WSS ✓ αλλά όχι SSS ✗ — η joint PDF
        δεν είναι αμετάβλητη στον χρόνο.
      </p>
    </figure>
  )
}

// Tiny inline-monospace helper for the few symbols in the prose around the viz.
function InlineFx({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.95em] text-fg">{children}</span>
}

function Stat({
  label,
  value,
  ord,
  accent,
}: {
  label: string
  value: string
  ord: string
  accent?: 'amber'
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div
        className={
          'font-mono text-base tabular-nums ' +
          (accent === 'amber' ? 'text-amber-700 dark:text-amber-300' : 'text-fg')
        }
      >
        {value}
      </div>
      <div className="text-[9px] text-fg-subtle">{ord}</div>
    </div>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  model: ShapeModel,
  ghostSym: ShapeModel,
  ghostSkew: ShapeModel,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Fixed windows so changes are honest (no auto-rescaling hides the drift).
  const xMin = -4
  const xMax = 5
  const yMax = 0.7

  const padL = 30
  const padR = 14
  const padT = 16
  const padB = 28
  const plotW = w - padL - padR
  const plotH = h - padT - padB
  const xTo = (x: number) => padL + lerp(x, xMin, xMax, 0, plotW)
  const yTo = (y: number) => padT + plotH - lerp(y, 0, yMax, 0, plotH)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  // x ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  for (let xv = -4; xv <= 5; xv++) {
    const px = xTo(xv)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(px, padT + plotH)
    ctx.lineTo(px, padT + plotH + 4)
    ctx.stroke()
    ctx.fillText(String(xv), px, padT + plotH + 15)
  }
  ctx.textAlign = 'left'
  ctx.fillText('τιμή x', padL + plotW - 46, padT + plotH + 15)

  // ±σ band (variance made visible) — fixed at [−σ, +σ], never moves/widens
  {
    const bLo = xTo(-SIGMA)
    const bHi = xTo(SIGMA)
    ctx.fillStyle = colors.accentSoft
    ctx.globalAlpha = 0.45
    ctx.fillRect(bLo, padT, bHi - bLo, plotH)
    ctx.globalAlpha = 1
    // edges
    ctx.strokeStyle = colors.fgMuted
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ;[-SIGMA, SIGMA].forEach((x) => {
      ctx.beginPath()
      ctx.moveTo(xTo(x), padT)
      ctx.lineTo(xTo(x), padT + plotH)
      ctx.stroke()
    })
    ctx.setLineDash([])
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('−σ', xTo(-SIGMA), padT + plotH - 4)
    ctx.fillText('+σ', xTo(SIGMA), padT + plotH - 4)
    ctx.textAlign = 'left'
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText('πλάτος = σ (σταθερό)', xTo(SIGMA) + 6, padT + 11)
  }

  // helper to stroke a model's curve, clipped to the x-window
  const strokeCurve = (m: ShapeModel, style: string, width: number, alpha: number) => {
    ctx.strokeStyle = style
    ctx.lineWidth = width
    ctx.globalAlpha = alpha
    ctx.beginPath()
    let started = false
    for (const [x, y] of m.pts) {
      if (x < xMin - 0.5 || x > xMax + 0.5) {
        started = false
        continue
      }
      const px = xTo(x)
      const py = yTo(Math.min(y, yMax))
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // ghosts: symmetric (t=0) and most-skewed (t=1) extremes
  ctx.setLineDash([3, 3])
  strokeCurve(ghostSym, colors.fgSubtle, 1, 0.55)
  strokeCurve(ghostSkew, colors.fgSubtle, 1, 0.4)
  ctx.setLineDash([])

  // live curve on top
  strokeCurve(model, colors.accent, 2.4, 1)

  // mean line at x = 0 — pinned, never moves
  ctx.strokeStyle = colors.danger
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xTo(0), padT)
  ctx.lineTo(xTo(0), padT + plotH)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.danger
  ctx.font = '11px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('μέσος = 0', xTo(0), padT - 4)
}
