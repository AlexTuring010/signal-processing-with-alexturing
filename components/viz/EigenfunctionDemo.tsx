'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * The "Trojan horse for Fourier" viz.
 *
 *   Left panel  — Time domain: input cos(2π f₀ t) and the system's output
 *                 |H(f₀)| · cos(2π f₀ t + ∠H(f₀)). Same frequency in/out, only
 *                 amplitude and phase change.
 *   Right panel — Frequency response of the chosen system: full |H(f)| curve
 *                 above, full ∠H(f) curve below, with a marker at the current
 *                 f₀ on each. As the user sweeps f₀, the marker traces the
 *                 curve — students realize they're "discovering" H(f) by
 *                 measurement.
 *
 *   Pure system presets:
 *     - 1st-order RC LP filter:  H(f) = 1 / (1 + j 2π f τ)
 *     - 1st-order RC HP filter:  H(f) = (j 2π f τ) / (1 + j 2π f τ)
 *     - Pure delay (no shape change):  H(f) = e^(-j 2π f t₀)  (|H|=1, linear phase)
 */

type SysId = 'lp' | 'hp' | 'delay'

const TAU = 0.1 // RC time constant (sec) → cutoff ~ 1.59 Hz
const DELAY_T0 = 0.15 // sec, for the delay system

const SYSTEMS: { id: SysId; label: string; H: (f: number) => { mag: number; phase: number } }[] = [
  {
    id: 'lp',
    label: 'RC LP filter (τ = 0.1 s)',
    H: (f) => {
      const wt = 2 * Math.PI * f * TAU
      const denom = 1 + wt * wt
      // H = 1 / (1 + j wt)
      const mag = 1 / Math.sqrt(denom)
      const phase = -Math.atan(wt)
      return { mag, phase }
    },
  },
  {
    id: 'hp',
    label: 'RC HP filter (τ = 0.1 s)',
    H: (f) => {
      const wt = 2 * Math.PI * f * TAU
      // H = j wt / (1 + j wt). |H| = wt/√(1+wt²); phase = π/2 − atan(wt).
      const mag = wt / Math.sqrt(1 + wt * wt)
      const phase = Math.PI / 2 - Math.atan(wt)
      return { mag, phase }
    },
  },
  {
    id: 'delay',
    label: 'Καθαρή καθυστέρηση t₀ = 0.15 s',
    H: (f) => ({ mag: 1, phase: -2 * Math.PI * f * DELAY_T0 }),
  },
]

const F_MIN = 0.2
const F_MAX = 5.0

export function EigenfunctionDemo() {
  const [sysId, setSysId] = useState<SysId>('lp')
  const [f0, setF0] = useState(1.0)
  const [trail, setTrail] = useState<number[]>([1.0])
  const sys = SYSTEMS.find((s) => s.id === sysId)!

  // Track unique frequencies the user has visited (for the "discover the curve" effect).
  useEffect(() => {
    setTrail((cur) => {
      // Snap to a small grid to avoid runaway memory with continuous slider drags.
      const snapped = Math.round(f0 * 20) / 20
      if (cur.includes(snapped)) return cur
      const next = [...cur, snapped]
      if (next.length > 50) next.shift()
      return next
    })
  }, [f0])

  // Reset trail when system changes.
  useEffect(() => {
    setTrail([f0])
    // intentional: we want to wipe history on system change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sysId])

  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  const Hf = useMemo(() => sys.H(f0), [sys, f0])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, f0, Hf)
    if (magRef.current) drawMag(magRef.current, colors, sys, f0, trail)
    if (phaseRef.current) drawPhase(phaseRef.current, colors, sys, f0, trail)
  }, [Hf, sys, f0, trail])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Eigenfunction property · cos μπαίνει, cos βγαίνει
          </h4>
          <p className="text-xs text-fg-muted">
            Στείλε ένα cosine στο σύστημα. Έξοδος = cosine ίδιας συχνότητας με
            νέο πλάτος και φάση. Σύρε το <em>f₀</em> και «ανακάλυψε» την H(f).
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Επιλογή συστήματος"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {SYSTEMS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={sysId === s.id}
              onClick={() => setSysId(s.id)}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                sysId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <Panel title="Στον χρόνο" subtitle="μπλε: είσοδος · πράσινο: έξοδος">
          <canvas
            ref={timeRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Cosine input and output"
          />
        </Panel>

        <div className="grid grid-cols-1 gap-3">
          <Panel title="|H(f)| — μέτρο" subtitle="πόσο ενισχύει/εξασθενεί">
            <canvas
              ref={magRef}
              style={{ height: 95 }}
              className="block h-[95px] w-full"
              aria-label="Magnitude response"
            />
          </Panel>
          <Panel title="∠H(f) — φάση" subtitle="πόσο μετατοπίζει χρονικά">
            <canvas
              ref={phaseRef}
              style={{ height: 95 }}
              className="block h-[95px] w-full"
              aria-label="Phase response"
            />
          </Panel>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{f0.toFixed(2)} Hz</span>
          {'  ·  '}|H(f₀)| ={' '}
          <span className="font-mono text-fg tabular-nums">{Hf.mag.toFixed(3)}</span>
          {'  ·  '}∠H(f₀) ={' '}
          <span className="font-mono text-fg tabular-nums">
            {(Hf.phase * 180 / Math.PI).toFixed(1)}°
          </span>
        </label>
        <input
          type="range"
          min={F_MIN}
          max={F_MAX}
          step={0.02}
          value={f0}
          onChange={(e) => setF0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Input frequency f0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Καθώς σύρεις, οι πράσινες κουκκίδες δεξιά χτίζουν την καμπύλη H(f).
        <strong> Αυτό είναι το frequency response του συστήματος</strong> —
        και (spoiler) η εξίσωση που το ορίζει ακριβώς είναι ο Fourier
        transform της h(t).
      </div>
    </figure>
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

/* ----------- Drawing ----------- */

const PAD_X = 22
const PAD_Y = 12

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  f0: number,
  Hf: { mag: number; phase: number },
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Show a couple of cycles depending on f0
  const tEnd = Math.max(2 / f0, 1.0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, h / 2)
  ctx.lineTo(w - PAD_X, h / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1.5', PAD_X - 2, PAD_Y + 9)
  ctx.fillText('−1.5', PAD_X - 2, h - PAD_Y)
  ctx.textAlign = 'center'
  ctx.fillText('0', PAD_X, h - 2)
  ctx.fillText(`${tEnd.toFixed(2)}s`, w - PAD_X, h - 2)

  const px = (t: number) => lerp(t, 0, tEnd, PAD_X, w - PAD_X)
  const py = (y: number) => lerp(y, 1.6, -1.6, PAD_Y, h - PAD_Y)

  // Input cosine (amplitude 1).
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  ctx.beginPath()
  const steps = w * 2
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, tEnd)
    const v = Math.cos(2 * Math.PI * f0 * t)
    const x = px(t)
    const y = py(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Output cosine: |H(f0)| · cos(2π f0 t + ∠H(f0)).
  ctx.strokeStyle = colors.success
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, tEnd)
    const v = Hf.mag * Math.cos(2 * Math.PI * f0 * t + Hf.phase)
    const x = px(t)
    const y = py(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Labels.
  ctx.fillStyle = colors.accent
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('cos(2π f₀ t)', PAD_X + 6, PAD_Y + 13)
  ctx.fillStyle = colors.success
  ctx.fillText('|H(f₀)| · cos(2π f₀ t + ∠H(f₀))', PAD_X + 6, PAD_Y + 28)
}

function drawMag(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  sys: { H: (f: number) => { mag: number; phase: number } },
  f0: number,
  trail: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // X axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, h - PAD_Y)
  ctx.lineTo(w - PAD_X, h - PAD_Y)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [1, 2, 3, 4, 5]) {
    const x = lerp(fk, F_MIN, F_MAX, PAD_X, w - PAD_X)
    ctx.fillText(`${fk}Hz`, x, h - 2)
  }

  // Full curve, very faint (so users see the "true" shape behind their dots).
  const N = 220
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const f = lerp(i, 0, N - 1, F_MIN, F_MAX)
    const m = sys.H(f).mag
    const x = lerp(f, F_MIN, F_MAX, PAD_X, w - PAD_X)
    const y = lerp(m, 1.1, -0.05, PAD_Y, h - PAD_Y)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Trail dots.
  ctx.fillStyle = colors.success
  for (const f of trail) {
    if (f < F_MIN || f > F_MAX) continue
    const m = sys.H(f).mag
    const x = lerp(f, F_MIN, F_MAX, PAD_X, w - PAD_X)
    const y = lerp(m, 1.1, -0.05, PAD_Y, h - PAD_Y)
    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Current marker.
  const mNow = sys.H(f0).mag
  const xNow = lerp(f0, F_MIN, F_MAX, PAD_X, w - PAD_X)
  const yNow = lerp(mNow, 1.1, -0.05, PAD_Y, h - PAD_Y)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(xNow, PAD_Y)
  ctx.lineTo(xNow, h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(xNow, yNow, 4, 0, Math.PI * 2)
  ctx.fill()

  // y-axis ticks for magnitude
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const v of [0, 0.5, 1]) {
    const y = lerp(v, 1.1, -0.05, PAD_Y, h - PAD_Y)
    ctx.fillText(v.toFixed(1), PAD_X - 2, y + 3)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(PAD_X, y)
    ctx.lineTo(w - PAD_X, y)
    ctx.stroke()
  }
}

function drawPhase(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  sys: { H: (f: number) => { mag: number; phase: number } },
  f0: number,
  trail: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // y-range: ±π
  const yLo = -Math.PI
  const yHi = Math.PI

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  // x-axis at phase=0
  const yZero = lerp(0, yHi, yLo, PAD_Y, h - PAD_Y)
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [1, 2, 3, 4, 5]) {
    const x = lerp(fk, F_MIN, F_MAX, PAD_X, w - PAD_X)
    ctx.fillText(`${fk}Hz`, x, h - 2)
  }
  ctx.textAlign = 'right'
  for (const v of [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI]) {
    const y = lerp(v, yHi, yLo, PAD_Y, h - PAD_Y)
    const label = v === 0 ? '0' : v > 0 ? '+π' : '−π'
    if (Math.abs(Math.abs(v) - Math.PI / 2) < 0.01) continue // skip ±π/2 to reduce clutter
    ctx.fillText(label, PAD_X - 2, y + 3)
  }

  // Faint full curve (unwrapped enough for our range).
  const N = 220
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  let pen = false
  for (let i = 0; i < N; i++) {
    const f = lerp(i, 0, N - 1, F_MIN, F_MAX)
    const p = sys.H(f).phase
    if (p < yLo || p > yHi) {
      pen = false
      continue
    }
    const x = lerp(f, F_MIN, F_MAX, PAD_X, w - PAD_X)
    const y = lerp(p, yHi, yLo, PAD_Y, h - PAD_Y)
    if (!pen) {
      ctx.moveTo(x, y)
      pen = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Trail dots.
  ctx.fillStyle = colors.success
  for (const f of trail) {
    if (f < F_MIN || f > F_MAX) continue
    const p = sys.H(f).phase
    if (p < yLo || p > yHi) continue
    const x = lerp(f, F_MIN, F_MAX, PAD_X, w - PAD_X)
    const y = lerp(p, yHi, yLo, PAD_Y, h - PAD_Y)
    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Current marker.
  const pNow = sys.H(f0).phase
  if (pNow >= yLo && pNow <= yHi) {
    const xNow = lerp(f0, F_MIN, F_MAX, PAD_X, w - PAD_X)
    const yNow = lerp(pNow, yHi, yLo, PAD_Y, h - PAD_Y)
    ctx.strokeStyle = colors.fgMuted
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(xNow, PAD_Y)
    ctx.lineTo(xNow, h - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(xNow, yNow, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}
