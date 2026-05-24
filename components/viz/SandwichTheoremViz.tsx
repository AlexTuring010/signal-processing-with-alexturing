'use client'

/**
 * SandwichTheoremViz — «η σφήνα του Θ».
 *
 * The cleanest way to prove `target ∈ Θ(g)` is to *visibly* sandwich
 * the target between two constants times g — and show the whole picture
 * scaling together as n grows. This viz does exactly that:
 *
 *   - Plot the target curve.
 *   - Plot c_low · g and c_high · g as the two slices of bread.
 *   - The shaded ribbon between them turns green when the target lives
 *     inside.
 *
 * Used by L02 Phase D for:
 *   - pt4-th1-q2:  target = f + g, ribbon = [M, 2M] with M = max{f, g}
 *   - front-set-2-ask3-b:  target = Σ k^{1/k}, ribbon = [n, 2n]
 *
 * Built for L02 Phase D.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Preset = {
  id: string
  title: string
  /** Pretty label of the target. */
  targetLabel: string
  /** Pretty label of the upper-bound function (e.g. "2·max{f,g}"). */
  upperLabel: string
  /** Pretty label of the lower-bound function (e.g. "max{f,g}"). */
  lowerLabel: string
  /** Pretty label of the implied Θ-class. */
  thetaLabel: string
  /** Compute target value. */
  target: (n: number) => number
  /** Upper bound. */
  upper: (n: number) => number
  /** Lower bound. */
  lower: (n: number) => number
  nMin: number
  nMax: number
  /** Description shown next to the slider. */
  description: string
  /** Takeaway line at the bottom. */
  takeaway: string
  /** Optional: parameter sliders (e.g. f, g for pt4-th1-q2). */
  controls?: {
    label: string
    min: number
    max: number
    step: number
    init: number
    /** Re-bind target/upper/lower to use this parameter. */
    onValue: (v: number) => void
  }[]
}

const PLOT = { x0: 56, x1: 700, yTop: 24, yBot: 240 }

/** Build a sandwich preset that uses parametric f, g (for pt4-th1-q2). */
function makeMaxSumPreset(): Preset {
  const PRESETS: { name: string; f: (n: number) => number; g: (n: number) => number }[] = [
    { name: 'f = n, g = n²', f: (n) => n, g: (n) => n * n },
    { name: 'f = n log n, g = n²', f: (n) => n * Math.log2(Math.max(2, n)), g: (n) => n * n },
    { name: 'f = √n, g = n', f: (n) => Math.sqrt(n), g: (n) => n },
    { name: 'f = n³, g = 2ⁿ', f: (n) => n * n * n, g: (n) => Math.pow(2, n) },
    { name: 'f = n², g = n² (ίδια!)', f: (n) => n * n, g: (n) => n * n },
  ]
  // Use a closure-captured pair index that we mutate via onValue.
  const state = { pair: 0 }
  const choose = () => PRESETS[state.pair]
  return {
    id: 'pt4-th1-q2',
    title: 'Σ/Λ: f + g = Θ(max{f, g})',
    targetLabel: 'f(n) + g(n)',
    upperLabel: '2 · max{f, g}',
    lowerLabel: 'max{f, g}',
    thetaLabel: 'Θ(max{f, g})',
    target: (n) => {
      const { f, g } = choose()
      return f(n) + g(n)
    },
    upper: (n) => {
      const { f, g } = choose()
      return 2 * Math.max(f(n), g(n))
    },
    lower: (n) => {
      const { f, g } = choose()
      return Math.max(f(n), g(n))
    },
    nMin: 2,
    nMax: 100,
    description:
      'M ≤ f+g ≤ 2M  όπου M = max{f, g}. Και οι δύο φράχτες είναι σταθερά επί M, οπότε f+g ∈ Θ(M).',
    takeaway:
      'Η υπόθεση f ≠ g είναι «δόλωμα» — η ιδιότητα ισχύει πάντα. Ο μεγαλύτερος όρος είναι το μόνο που μετράει ασυμπτωτικά.',
    controls: [
      {
        label: 'ζευγάρι (f, g)',
        min: 0,
        max: PRESETS.length - 1,
        step: 1,
        init: 0,
        onValue: (v) => {
          state.pair = Math.round(v)
        },
      },
    ],
  }
}

function makeSumKthRootPreset(): Preset {
  return {
    id: 'front-set-2-ask3-b',
    title: 'Φροντιστηριακό #2 · Άσκηση 3β — Σ k^{1/k} = Θ(n)',
    targetLabel: 'Σ_{k=1}^n k^{1/k}',
    upperLabel: '2n  (αφού k^{1/k} ≤ 2)',
    lowerLabel: 'n  (αφού k^{1/k} ≥ 1)',
    thetaLabel: 'Θ(n)',
    target: (n) => {
      let s = 0
      for (let k = 1; k <= n; k++) s += Math.pow(k, 1 / k)
      return s
    },
    upper: (n) => 2 * n,
    lower: (n) => n,
    nMin: 4,
    nMax: 400,
    description:
      'Κάθε όρος k^{1/k} κάθεται μεταξύ 1 και 2. Άρα Σ n όρων κάθεται μεταξύ n·1 και n·2.',
    takeaway:
      'Όταν κάθε όρος ενός αθροίσματος είναι «σφηνωμένος» μεταξύ δύο σταθερών, το άθροισμα είναι Θ(n).',
  }
}

export const SANDWICH_PRESETS: Record<string, Preset> = {
  'pt4-th1-q2': makeMaxSumPreset(),
  'front-set-2-ask3-b': makeSumKthRootPreset(),
}

type Props = {
  preset: string
}

const SANDWICH_FALLBACK = Object.values(SANDWICH_PRESETS)[0]

export function SandwichTheoremViz({ preset: presetId }: Props) {
  const lookup = SANDWICH_PRESETS[presetId]
  const preset = lookup ?? SANDWICH_FALLBACK

  const [n, setN] = useState(Math.round((preset.nMin + preset.nMax) / 4))
  const [controlValues, setControlValues] = useState<number[]>(
    preset.controls?.map((c) => c.init) ?? [],
  )

  // Apply control values back to the preset's onValue callbacks.
  useMemo(() => {
    preset.controls?.forEach((c, i) => c.onValue(controlValues[i] ?? c.init))
  }, [preset.controls, controlValues])

  // Sample target, upper, lower at log-spaced n.
  const samples = useMemo(() => {
    const out: { n: number; t: number; up: number; lo: number }[] = []
    const lo = Math.log(preset.nMin)
    const hi = Math.log(preset.nMax)
    for (let i = 0; i < 160; i++) {
      const t = i / 159
      const nv = Math.exp(lo + (hi - lo) * t)
      const tv = preset.target(nv)
      const upV = preset.upper(nv)
      const loV = preset.lower(nv)
      if ([tv, upV, loV].every((v) => Number.isFinite(v) && v > 0)) {
        out.push({ n: nv, t: tv, up: upV, lo: loV })
      }
    }
    return out
  }, [preset, controlValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const yMax = Math.max(...samples.map((s) => s.up)) * 1.05
  const yMin = Math.min(...samples.map((s) => s.lo)) * 0.5
  const yMinLog = Math.log10(Math.max(yMin, 1e-12))
  const yMaxLog = Math.log10(Math.max(yMax, 1))
  const xMinLog = Math.log10(preset.nMin)
  const xMaxLog = Math.log10(preset.nMax)

  const xFor = (nv: number) =>
    PLOT.x0 + ((Math.log10(nv) - xMinLog) / (xMaxLog - xMinLog)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) =>
    PLOT.yBot - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * (PLOT.yBot - PLOT.yTop)

  // Ribbon path: upper line forward, lower line backward.
  const upperPts = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.up).toFixed(1)}`)
  const lowerPts = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.lo).toFixed(1)}`).reverse()
  const ribbon = `M ${upperPts.join(' L ')} L ${lowerPts.join(' L ')} Z`

  const targetLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.t).toFixed(1)}`).join(' ')
  const upperLine = upperPts.join(' ')
  const lowerLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.lo).toFixed(1)}`).join(' ')

  // Find sample closest to current n for the readout.
  const cur = samples.reduce(
    (acc, s) => (Math.abs(s.n - n) < Math.abs(acc.n - n) ? s : acc),
    samples[0],
  )
  const targetInside = cur.t >= cur.lo * 0.999 && cur.t <= cur.up * 1.001

  // Decade gridlines.
  const xTicks: number[] = []
  for (let e = Math.ceil(xMinLog); e <= Math.floor(xMaxLog); e++) xTicks.push(e)

  if (!lookup) {
    return (
      <div className="my-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
        SandwichTheoremViz: άγνωστο preset «{presetId}».
      </div>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{preset.title}</div>
        <span className="font-mono text-[11px] text-fg-subtle">log-log κλίμακα</span>
      </div>

      <p className="mb-2 rounded-md border border-sky-300/50 bg-sky-50/70 px-3 py-1.5 text-[12.5px] leading-relaxed text-sky-900 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-100">
        {preset.description}
      </p>

      {/* Controls */}
      {preset.controls && preset.controls.length > 0 && (
        <div className="mb-3 grid gap-2">
          {preset.controls.map((c, i) => (
            <label key={i} className="flex items-center gap-2 text-xs">
              <span className="w-28 font-medium text-fg-muted">{c.label}</span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={controlValues[i] ?? c.init}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setControlValues((prev) => {
                    const next = [...prev]
                    next[i] = v
                    return next
                  })
                }}
                className="h-1.5 flex-1 cursor-pointer accent-accent"
              />
              <span className="w-10 text-right font-mono">{controlValues[i] ?? c.init}</span>
            </label>
          ))}
        </div>
      )}

      <label className="mb-2 flex items-center gap-2 text-xs">
        <span className="font-mono text-fg-muted">n</span>
        <input
          type="range"
          min={preset.nMin}
          max={preset.nMax}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <span className="w-16 text-right font-mono">{n}</span>
      </label>

      {/* Plot */}
      <svg viewBox="0 0 720 270" className="w-full" role="img" aria-label="η σφήνα γύρω από το target">
        <style>{`
          .sw-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .sw-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .sw-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
        `}</style>

        {xTicks.map((e) => (
          <g key={e}>
            <line x1={xFor(Math.pow(10, e))} x2={xFor(Math.pow(10, e))} y1={PLOT.yTop} y2={PLOT.yBot} className="sw-grid" />
            <text x={xFor(Math.pow(10, e))} y={PLOT.yBot + 12} textAnchor="middle" className="sw-tick">10^{e}</text>
          </g>
        ))}

        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="sw-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="sw-axis" />

        {/* Ribbon */}
        <path d={ribbon} fill="rgb(16 185 129)" opacity={0.18} />

        {/* Upper + lower */}
        <polyline points={upperLine} fill="none" stroke="rgb(16 185 129)" strokeWidth={1.5} strokeDasharray="6 3" />
        <polyline points={lowerLine} fill="none" stroke="rgb(16 185 129)" strokeWidth={1.5} strokeDasharray="6 3" />

        {/* Target */}
        <polyline points={targetLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2.5} />

        {/* Current-n vertical line */}
        <line x1={xFor(cur.n)} x2={xFor(cur.n)} y1={PLOT.yTop} y2={PLOT.yBot} stroke="rgb(217 119 6)" strokeWidth={1.25} strokeDasharray="2 2" />
      </svg>

      {/* Legend + readout */}
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <div className="rounded border border-border bg-bg-soft/40 px-2 py-1.5 text-[12px]">
          <span className="mr-1 inline-block h-2 w-3" style={{ background: 'rgb(37 99 235)' }} />
          target ={' '}
          <span className="font-mono font-semibold">{preset.targetLabel}</span>
          <div className="font-mono text-[11px] text-fg-subtle">
            n = {Math.round(cur.n)} → {cur.t.toExponential(2)}
          </div>
        </div>
        <div className="rounded border border-border bg-bg-soft/40 px-2 py-1.5 text-[12px]">
          <span className="mr-1 inline-block h-2 w-3" style={{ background: 'rgb(16 185 129)' }} />
          φράχτες:{' '}
          <span className="font-mono">{preset.lowerLabel}</span> ≤ target ≤{' '}
          <span className="font-mono">{preset.upperLabel}</span>
          <div className="font-mono text-[11px] text-fg-subtle">
            [{cur.lo.toExponential(2)}, {cur.up.toExponential(2)}]
          </div>
        </div>
        <div
          className={cn(
            'rounded border-2 px-2 py-1.5 text-center text-[12px] font-mono font-bold',
            targetInside
              ? 'border-emerald-500/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
              : 'border-rose-400/60 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
          )}
        >
          {targetInside ? '✓ target ∈ ' : '✗ ξεφεύγει '}
          <span>{preset.thetaLabel}</span>
        </div>
      </div>

      <div className="mt-2 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        {preset.takeaway}
      </div>
    </section>
  )
}
