'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const T_END = 6.0

const PRESETS = [
  { label: 'Same f', T1: 1, T2: 1 },
  { label: 'Octave', T1: 1, T2: 0.5 },
  { label: 'Ratio 3:2', T1: 1, T2: 2 / 3 },
  { label: '√2 (NOT periodic)', T1: 1, T2: 1 / Math.sqrt(2) },
] as const

function rationalApprox(x: number, maxDenom = 200): { p: number; q: number } | null {
  // Stern-Brocot-like search for a small p/q with |x - p/q| < tol.
  const tol = 1e-3
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawSum(canvas, colors, T1, T2, result.periodic ? result.period : undefined)
  }, [T1, T2, result])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Είναι περιοδικό το άθροισμα cos(2π · t/T₁) + cos(2π · t/T₂);
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Δύο cosines με περιόδους T₁ και T₂. Το άθροισμά τους είναι περιοδικό{' '}
        <strong>μόνο αν</strong> ο λόγος <code className="font-mono">T₁/T₂</code>{' '}
        είναι ρητός αριθμός. Δοκίμασε.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 180 }}
        className="block h-[180px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="Sum of two cosines with adjustable periods"
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

function drawSum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T1: number,
  T2: number,
  period: number | undefined,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 18
  const padY = 12

  // Mid-line.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h / 2)
  ctx.lineTo(w - padX, h / 2)
  ctx.stroke()

  const xt = (t: number) => lerp(t, 0, T_END, padX, w - padX)
  const yv = (v: number) => lerp(v, 2.2, -2.2, padY, h - padY)

  // If finite period <= window, mark its boundary.
  if (period && period <= T_END) {
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = colors.success
    ctx.beginPath()
    ctx.moveTo(xt(period), padY)
    ctx.lineTo(xt(period), h - padY)
    ctx.stroke()
    ctx.fillStyle = colors.success
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`T = ${period.toFixed(2)}s`, xt(period), padY + 8)
    ctx.restore()
  }

  // Sum waveform.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = w * 2
  const w1 = (2 * Math.PI) / T1
  const w2 = (2 * Math.PI) / T2
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T_END)
    const v = Math.cos(w1 * t) + Math.cos(w2 * t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // X-axis labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 2)
  ctx.fillText(`${T_END}s`, w - padX, h - 2)
}
