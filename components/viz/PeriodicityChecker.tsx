'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

// Window (seconds) shown when the sum is NOT periodic. For periodic sums we
// instead size the window to the common period so the alignment is visible.
const FALLBACK_WINDOW = 8

const PRESETS = [
  { label: 'Same f', T1: 1, T2: 1 },
  { label: 'Octave', T1: 1, T2: 0.5 },
  { label: 'Ratio 3:2', T1: 1, T2: 2 / 3 },
  { label: '√2 (NOT periodic)', T1: 1, T2: 1 / Math.sqrt(2) },
] as const

function rationalApprox(x: number, maxDenom = 200): { p: number; q: number } | null {
  // Search for a small p/q with |x - p/q| < tol. The tolerance must be TIGHT:
  // every irrational has excellent rational approximations (√2 ≈ 41/29 to 4e-4),
  // so a loose tol = 1e-3 falsely flagged the √2 preset as periodic (T = 29 s).
  // A genuine rational ratio lands within ~1e-15, so 1e-7 cleanly separates the
  // two. Slider values are multiples of 0.05 → always rational → always periodic.
  const tol = 1e-7
  for (let q = 1; q <= maxDenom; q++) {
    const p = Math.round(x * q)
    if (p === 0) continue
    if (Math.abs(x - p / q) < tol) return { p, q }
  }
  return null
}

function analyze(T1: number, T2: number) {
  const ratio = T1 / T2
  const r = rationalApprox(ratio)
  if (!r) {
    return {
      periodic: false as const,
      ratioText: ratio.toFixed(4),
    }
  }
  // T = LCM(T1, T2) = T1 * q = T2 * p (where T1/T2 = p/q).
  const T = T1 * r.q
  return {
    periodic: true as const,
    ratioText: `${r.p}/${r.q}`,
    period: T,
    p: r.p,
    q: r.q,
  }
}

export function PeriodicityChecker() {
  const [T1, setT1] = useState(1)
  const [T2, setT2] = useState(2 / 3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const result = useMemo(() => analyze(T1, T2), [T1, T2])

  // Size the visible window to the common period (when periodic) so the first
  // alignment always lands on-screen; clamp so tiny/huge periods stay readable.
  const windowEnd = useMemo(
    () =>
      result.periodic && result.period
        ? Math.min(Math.max(result.period * 1.4, 4), 12)
        : FALLBACK_WINDOW,
    [result],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawSum(canvas, colors, T1, T2, result, windowEnd)
  }, [T1, T2, result, windowEnd])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Είναι περιοδικό το άθροισμα cos(2π · t/T₁) + cos(2π · t/T₂);
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τα δύο πάνω γραφήματα είναι οι δύο cosines <strong>ξεχωριστά</strong>· οι κουκκίδες σημειώνουν
        πού ο καθένας <strong>συμπληρώνει πλήρη κύκλο</strong> (κορυφή). Το κάτω είναι το άθροισμα. Το
        άθροισμα ξανακλείνει μόνο όταν <strong>και οι δύο</strong> κορυφώνονται την ίδια στιγμή — εκεί
        πέφτει η <span className="text-emerald-600 dark:text-emerald-400">πράσινη</span> γραμμή. Αυτό
        γίνεται <strong>μόνο αν</strong> ο λόγος <code className="font-mono">T₁/T₂</code> είναι ρητός:
        τότε κάποιοι ακέραιοι <code className="font-mono">q·T₁ = p·T₂ = T</code> πέφτουν μαζί. Άρρητος
        λόγος (π.χ. √2) → οι κορυφές ποτέ δεν ευθυγραμμίζονται → μη περιοδικό.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="Two cosines and their sum, with period-alignment markers"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider
          label="T₁ (sec)"
          value={T1}
          min={0.3}
          max={2}
          step={0.05}
          onChange={setT1}
        />
        <Slider
          label="T₂ (sec)"
          value={T2}
          min={0.3}
          max={2}
          step={0.05}
          onChange={setT2}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setT1(p.T1)
              setT2(p.T2)
            }}
            className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs text-fg-muted hover:border-accent/50 hover:text-fg"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        className={
          'mt-3 rounded-md border px-3 py-2 text-sm ' +
          (result.periodic
            ? 'border-success/40 bg-success/10 text-success'
            : 'border-warn/50 bg-warn/10 text-warn')
        }
        role="status"
      >
        {result.periodic ? (
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Περιοδικό · T₁/T₂ ={' '}
            <code className="font-mono">{result.ratioText}</code>, T = {result.period.toFixed(2)} s
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Μη περιοδικό · T₁/T₂ ≈{' '}
            <code className="font-mono">{result.ratioText}</code> (άρρητος)
          </span>
        )}
      </div>

      {result.periodic && result.period > windowEnd && (
        <p className="mt-2 text-xs text-fg-subtle">
          Η πρώτη ευθυγράμμιση γίνεται στα{' '}
          <code className="font-mono">{result.period.toFixed(2)}s</code> — πέρα από το ορατό
          παράθυρο, αλλά υπάρχει (ο λόγος είναι ρητός).
        </p>
      )}
    </figure>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">{value.toFixed(2)}</span>
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

type Band = {
  y0: number
  label: string
  kind: 'cos1' | 'cos2' | 'sum'
  color: string
  range: number
}

function drawSum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T1: number,
  T2: number,
  result: ReturnType<typeof analyze>,
  windowEnd: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padX = 24
  const topPad = 18
  const botPad = 16
  const gap = 16
  const bandH = (h - topPad - botPad - 2 * gap) / 3

  const COS1 = '#0284c7' // sky
  const COS2 = '#8b5cf6' // violet

  const bands: Band[] = [
    { y0: topPad, label: 'cos(2π·t/T₁)', kind: 'cos1', color: COS1, range: 1.15 },
    { y0: topPad + bandH + gap, label: 'cos(2π·t/T₂)', kind: 'cos2', color: COS2, range: 1.15 },
    { y0: topPad + 2 * (bandH + gap), label: 'άθροισμα', kind: 'sum', color: colors.accent, range: 2.3 },
  ]

  const xt = (t: number) => lerp(t, 0, windowEnd, padX, w - padX)
  const yvBand = (v: number, b: Band) => lerp(v, b.range, -b.range, b.y0 + 3, b.y0 + bandH - 3)
  const w1 = (2 * Math.PI) / T1
  const w2 = (2 * Math.PI) / T2
  const period = result.periodic ? result.period : undefined

  // Vertical alignment lines at multiples of the common period: each one passes
  // through a crest of BOTH cosines at the same instant. That simultaneity is
  // exactly what "T₁/T₂ rational" buys you.
  if (period && period <= windowEnd + 1e-9) {
    for (let k = 1; k * period <= windowEnd + 1e-9; k++) {
      const x = xt(k * period)
      ctx.save()
      ctx.setLineDash([5, 4])
      ctx.strokeStyle = k === 1 ? colors.success : 'rgba(16, 185, 129, 0.35)'
      ctx.lineWidth = k === 1 ? 1.5 : 1
      ctx.beginPath()
      ctx.moveTo(x, bands[0].y0)
      ctx.lineTo(x, bands[2].y0 + bandH)
      ctx.stroke()
      ctx.restore()
    }
    ctx.fillStyle = colors.success
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`T = ${period.toFixed(2)}s`, xt(period), bands[0].y0 - 5)
  }

  for (const b of bands) {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(b.label, padX, b.y0 - 5)

    // mid-line
    const mid = yvBand(0, b)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padX, mid)
    ctx.lineTo(w - padX, mid)
    ctx.stroke()

    // waveform
    ctx.strokeStyle = b.color
    ctx.lineWidth = 2
    ctx.beginPath()
    const steps = Math.max(64, Math.floor(w - 2 * padX) * 2)
    for (let i = 0; i <= steps; i++) {
      const t = lerp(i, 0, steps, 0, windowEnd)
      const v =
        b.kind === 'cos1'
          ? Math.cos(w1 * t)
          : b.kind === 'cos2'
            ? Math.cos(w2 * t)
            : Math.cos(w1 * t) + Math.cos(w2 * t)
      const x = xt(t)
      const y = yvBand(v, b)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // crest dots — one per completed cycle of each individual cosine
    if (b.kind === 'cos1' || b.kind === 'cos2') {
      const Ti = b.kind === 'cos1' ? T1 : T2
      const yPeak = yvBand(1, b)
      for (let k = 1; k * Ti <= windowEnd + 1e-9; k++) {
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.arc(xt(k * Ti), yPeak, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      // green emphasis exactly where the two crests line up (= common period)
      if (period && period <= windowEnd + 1e-9) {
        for (let k = 1; k * period <= windowEnd + 1e-9; k++) {
          const x = xt(k * period)
          ctx.fillStyle = colors.success
          ctx.beginPath()
          ctx.arc(x, yPeak, 3.6, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = colors.bg
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(x, yPeak, 3.6, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }
  }

  // X-axis labels (shared time axis across all three bands)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 3)
  ctx.fillText(`${windowEnd.toFixed(1)}s`, w - padX, h - 3)
}
