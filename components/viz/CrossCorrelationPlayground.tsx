'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'

/**
 * Cross-correlation R_xy(τ) — the new §10' workhorse.
 *
 * Slides 37-43 of session 5&6 introduce ΣΕΣ (cross-correlation): a measure of
 * how much x(t) and y(t) "look alike when slid by τ". Two pieces missing from
 * the previous /foundations/fourier-transform page:
 *   1. The cross-correlation definition itself (energy / power / periodic).
 *   2. The intuition that R_xy is essentially x(τ) convolved with y*(-τ).
 *
 * This viz lets the student pick x and y from a small library, drag the lag τ,
 * and watch (a) the overlap of x(t) and y(t-τ), (b) the product x·y(t-τ), (c)
 * the resulting R_xy(τ) curve with a marker at the current τ. Two signals can
 * be made orthogonal (R_xy(0) = 0) by picking cos vs sin or rect vs sin.
 *
 * Sister viz to AutocorrelationViz (which is closed-form for canonical random
 * processes); this one is numerical, parametric, focused on the construction.
 */

type SignalId = 'rect' | 'tri' | 'sin' | 'cos' | 'gauss' | 'exp-decay'

type SignalDef = {
  id: SignalId
  label: string
  fn: (t: number) => number
  // optional time-domain support hint (in seconds), for axis scaling
  supportHint: number
}

const SIGNALS: SignalDef[] = [
  {
    id: 'rect',
    label: 'rect(t)',
    fn: (t) => (Math.abs(t) <= 0.5 ? 1 : 0),
    supportHint: 1,
  },
  {
    id: 'tri',
    label: 'Λ(t) τρίγωνο',
    fn: (t) => (Math.abs(t) <= 1 ? 1 - Math.abs(t) : 0),
    supportHint: 1,
  },
  {
    id: 'sin',
    label: 'sin(2πt) on [0,2]',
    fn: (t) => (t >= 0 && t <= 2 ? Math.sin(2 * Math.PI * t) : 0),
    supportHint: 2,
  },
  {
    id: 'cos',
    label: 'cos(2πt) on [0,2]',
    fn: (t) => (t >= 0 && t <= 2 ? Math.cos(2 * Math.PI * t) : 0),
    supportHint: 2,
  },
  {
    id: 'gauss',
    label: 'Gaussian e^(-πt²)',
    fn: (t) => Math.exp(-Math.PI * t * t),
    supportHint: 1.5,
  },
  {
    id: 'exp-decay',
    label: 'e^(-t)·u(t)',
    fn: (t) => (t >= 0 ? Math.exp(-t) : 0),
    supportHint: 3,
  },
]

const T_DOMAIN = 4.5 // window on the time axis (±)
const TAU_RANGE = 4.0 // lag slider range (±)

export function CrossCorrelationPlayground() {
  const [xId, setXId] = useState<SignalId>('rect')
  const [yId, setYId] = useState<SignalId>('sin')
  const [tau, setTau] = useState(0)

  const xFn = useMemo(() => SIGNALS.find((s) => s.id === xId)!.fn, [xId])
  const yFn = useMemo(() => SIGNALS.find((s) => s.id === yId)!.fn, [yId])

  // Precompute R_xy(τ) once per (x, y) pair using numeric integration.
  // R_xy(τ) = ∫ x(t)·y*(t-τ) dt — signals are real, so y* = y.
  const rXyCurve = useMemo(() => computeCrossCorr(xFn, yFn), [xFn, yFn])
  const currentRxy = useMemo(() => sampleCurve(rXyCurve, tau), [rXyCurve, tau])

  const overlapRef = useRef<HTMLCanvasElement | null>(null)
  const productRef = useRef<HTMLCanvasElement | null>(null)
  const rxyRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (overlapRef.current) drawOverlap(overlapRef.current, colors, xFn, yFn, tau)
    if (productRef.current) drawProduct(productRef.current, colors, xFn, yFn, tau)
    if (rxyRef.current) drawCorrelation(rxyRef.current, colors, rXyCurve, tau)
  }, [xFn, yFn, tau, rXyCurve])

  const isOrthogonalAtZero = Math.abs(sampleCurve(rXyCurve, 0)) < 0.02

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Cross-correlation playground — R<sub>xy</sub>(τ) = ∫ x(t)·y*(t−τ) dt
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε δύο σήματα και σύρε τη μετατόπιση <span className="font-mono">τ</span>. Στο πρώτο
        panel βλέπεις τα <span className="font-mono">x(t)</span> και{' '}
        <span className="font-mono">y(t−τ)</span> μαζί. Στο δεύτερο, το γινόμενό τους — η
        ολοκλήρωσή του δίνει το <span className="font-mono">R<sub>xy</sub>(τ)</span>. Το τρίτο
        panel είναι η πλήρης καμπύλη συσχέτισης· ο κόκκινος δείκτης δείχνει το τρέχον σημείο.
      </p>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <SignalPicker label="x(t)" value={xId} onChange={setXId} accent="#3b82f6" />
        <SignalPicker label="y(t)" value={yId} onChange={setYId} accent="#f59e0b" />
      </div>

      <div className="mb-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          Μετατόπιση τ ={' '}
          <span className="font-mono text-fg tabular-nums">{tau.toFixed(2)}</span> s
          <span className="ml-3 text-fg-subtle">
            R<sub>xy</sub>(τ) ={' '}
            <span className="font-mono text-fg tabular-nums">{currentRxy.toFixed(3)}</span>
          </span>
        </label>
        <input
          type="range"
          min={-TAU_RANGE}
          max={TAU_RANGE}
          step={0.05}
          value={tau}
          onChange={(e) => setTau(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel
          title="x(t) και y(t−τ) μαζί"
          subtitle="overlap = πόσο 'πέφτουν πάνω-πάνω'"
        >
          <canvas
            ref={overlapRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Overlap of x(t) and y(t-tau)"
          />
        </Panel>
        <Panel title="x(t) · y(t−τ)" subtitle="integrand του R_xy(τ)">
          <canvas
            ref={productRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Product x(t) y(t-tau)"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel
          title={`R_xy(τ) — η συνάρτηση ετεροσυσχέτισης`}
          subtitle="κόκκινος δείκτης = τρέχον τ"
        >
          <canvas
            ref={rxyRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Cross-correlation curve"
          />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg-muted">
        <strong className="text-fg">Παρατήρηση:</strong>{' '}
        {isOrthogonalAtZero ? (
          <>
            <span className="font-mono">R<sub>xy</sub>(0) ≈ 0</span> — τα δύο σήματα είναι{' '}
            <strong>ορθογώνια</strong> (όπως το rect και το sin με συμμετρικό υποστήριγμα, ή ένα
            άρτιο × ένα περιττό σήμα στο ίδιο διάστημα).
          </>
        ) : (
          <>
            <span className="font-mono">R<sub>xy</sub>(0) ≠ 0</span> — υπάρχει κάποια ομοιότητα.
            Πάει τη μετατόπιση τ στο σημείο που μεγιστοποιείται το <span className="font-mono">|R<sub>xy</sub>|</span>{' '}
            για να βρεις τη βέλτιστη χρονική ευθυγράμμιση των δύο σημάτων.
          </>
        )}
      </div>
    </figure>
  )
}

function SignalPicker({
  label,
  value,
  onChange,
  accent,
}: {
  label: string
  value: SignalId
  onChange: (v: SignalId) => void
  accent: string
}) {
  return (
    <div className="rounded-md border border-border bg-bg p-2">
      <div
        className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {SIGNALS.map((s) => {
          const isActive = value === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] transition ${
                isActive
                  ? 'border-transparent text-white'
                  : 'border-border bg-bg-elevated text-fg-muted hover:bg-bg'
              }`}
              style={isActive ? { background: accent } : undefined}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

function computeCrossCorr(
  x: (t: number) => number,
  y: (t: number) => number,
): { tau: number; value: number }[] {
  // R_xy(τ) = ∫ x(t) y(t-τ) dt
  // Compute over τ ∈ [-TAU_RANGE, TAU_RANGE] with numerical integration.
  const tauSteps = 161
  const tSteps = 400
  const tMin = -T_DOMAIN
  const tMax = T_DOMAIN
  const dt = (tMax - tMin) / tSteps
  const out: { tau: number; value: number }[] = []
  for (let i = 0; i < tauSteps; i++) {
    const tau = -TAU_RANGE + (2 * TAU_RANGE * i) / (tauSteps - 1)
    let sum = 0
    for (let j = 0; j < tSteps; j++) {
      const t = tMin + j * dt
      sum += x(t) * y(t - tau)
    }
    sum *= dt
    out.push({ tau, value: sum })
  }
  return out
}

function sampleCurve(curve: { tau: number; value: number }[], tau: number) {
  if (curve.length === 0) return 0
  // linear interpolation
  if (tau <= curve[0].tau) return curve[0].value
  if (tau >= curve[curve.length - 1].tau) return curve[curve.length - 1].value
  for (let i = 0; i < curve.length - 1; i++) {
    const a = curve[i]
    const b = curve[i + 1]
    if (tau >= a.tau && tau <= b.tau) {
      const t = (tau - a.tau) / (b.tau - a.tau)
      return a.value + (b.value - a.value) * t
    }
  }
  return 0
}

function drawOverlap(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  xFn: (t: number) => number,
  yFn: (t: number) => number,
  tau: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 22

  // axes
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(pad, pad / 2)
  ctx.lineTo(pad, h - pad / 2)
  ctx.stroke()

  const yScale = (h - 2 * pad) / 2.4
  const samples = 500

  // x(t) in blue
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < samples; i++) {
    const t = -T_DOMAIN + (2 * T_DOMAIN * i) / (samples - 1)
    const val = xFn(t)
    const px = pad + ((t + T_DOMAIN) / (2 * T_DOMAIN)) * (w - pad - pad / 2)
    const py = h / 2 - val * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // y(t-tau) in amber
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < samples; i++) {
    const t = -T_DOMAIN + (2 * T_DOMAIN * i) / (samples - 1)
    const val = yFn(t - tau)
    const px = pad + ((t + T_DOMAIN) / (2 * T_DOMAIN)) * (w - pad - pad / 2)
    const py = h / 2 - val * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = '#3b82f6'
  ctx.fillText('x(t)', pad + 4, pad / 2 + 8)
  ctx.fillStyle = '#f59e0b'
  ctx.fillText('y(t−τ)', pad + 38, pad / 2 + 8)

  // t-axis label
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('t', w - pad / 2 - 8, h / 2 - 4)
}

function drawProduct(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  xFn: (t: number) => number,
  yFn: (t: number) => number,
  tau: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 22

  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(pad, pad / 2)
  ctx.lineTo(pad, h - pad / 2)
  ctx.stroke()

  // Fill the product area to show the integrand contribution
  const samples = 500
  const yScale = (h - 2 * pad) / 2.4

  // build polygon for fill (signed area split: positive amber, negative red)
  type Pt = { x: number; y: number; v: number }
  const pts: Pt[] = []
  for (let i = 0; i < samples; i++) {
    const t = -T_DOMAIN + (2 * T_DOMAIN * i) / (samples - 1)
    const v = xFn(t) * yFn(t - tau)
    const px = pad + ((t + T_DOMAIN) / (2 * T_DOMAIN)) * (w - pad - pad / 2)
    const py = h / 2 - v * yScale
    pts.push({ x: px, y: py, v })
  }

  // positive fill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.35)' // green
  let path = false
  ctx.beginPath()
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    if (p.v > 0) {
      if (!path) {
        ctx.moveTo(p.x, h / 2)
        ctx.lineTo(p.x, p.y)
        path = true
      } else {
        ctx.lineTo(p.x, p.y)
      }
    } else if (path) {
      ctx.lineTo(pts[i - 1].x, h / 2)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      path = false
    }
  }
  if (path) {
    ctx.lineTo(pts[pts.length - 1].x, h / 2)
    ctx.closePath()
    ctx.fill()
  }

  // negative fill
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)' // red
  path = false
  ctx.beginPath()
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    if (p.v < 0) {
      if (!path) {
        ctx.moveTo(p.x, h / 2)
        ctx.lineTo(p.x, p.y)
        path = true
      } else {
        ctx.lineTo(p.x, p.y)
      }
    } else if (path) {
      ctx.lineTo(pts[i - 1].x, h / 2)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      path = false
    }
  }
  if (path) {
    ctx.lineTo(pts[pts.length - 1].x, h / 2)
    ctx.closePath()
    ctx.fill()
  }

  // outline product
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.4
  ctx.beginPath()
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  })
  ctx.stroke()

  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('θετική περιοχή = συμβολή+ , αρνητική = συμβολή−', pad + 4, pad / 2 + 8)
  ctx.fillText('t', w - pad / 2 - 8, h / 2 - 4)
}

function drawCorrelation(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  curve: { tau: number; value: number }[],
  tau: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 26

  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad / 2)
  ctx.stroke()

  // dynamic scale
  let maxAbs = 1e-6
  curve.forEach((p) => {
    if (Math.abs(p.value) > maxAbs) maxAbs = Math.abs(p.value)
  })
  const yScale = (h - 2 * pad) / (2 * maxAbs * 1.1)

  // curve
  ctx.strokeStyle = '#7c3aed' // violet
  ctx.lineWidth = 2
  ctx.beginPath()
  curve.forEach((p, i) => {
    const px = w / 2 + (p.tau / TAU_RANGE) * (w / 2 - pad)
    const py = h / 2 - p.value * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()

  // current τ marker
  const currentVal = sampleCurve(curve, tau)
  const taupx = w / 2 + (tau / TAU_RANGE) * (w / 2 - pad)
  const taupy = h / 2 - currentVal * yScale
  ctx.strokeStyle = '#ef4444'
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(taupx, pad / 2)
  ctx.lineTo(taupx, h - pad / 2)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(taupx, taupy, 4.5, 0, 2 * Math.PI)
  ctx.fill()

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('τ', w - pad / 2 - 8, h / 2 - 4)
  ctx.fillText('R_xy(τ)', w / 2 + 6, pad / 2 + 8)

  // tick at τ = 0
  ctx.fillStyle = colors.fg
  ctx.fillText('0', w / 2 - 4, h / 2 + 14)
}
