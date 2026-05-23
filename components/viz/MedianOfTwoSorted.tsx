'use client'

/**
 * MedianOfTwoSorted — log-n median search across two sorted arrays.
 *
 * For front-set-4-ask8. Two sorted arrays X, Y of size n each;
 * compare medians, discard halves on alternating sides until each
 * residual range has ≤ 2 elements. The canonical worked example from
 * the prompt is the default preset (median = 4.5).
 *
 * Each step shows: the active sub-ranges (the white cells), the
 * discarded prefix / suffix (faded), the two medians (yellow ring) and
 * a verdict line describing what was just dropped. Footer prints the
 * recurrence T(n) = T(n/2) + O(1) and tracks the rounds count vs the
 * theoretical ⌈log₂ n⌉ bound.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const X_INIT = [1, 2, 3, 4, 5, 27, 28, 29, 30]
const Y_INIT = [-5, -4, -3, -2, -1, 17, 18, 19, 20]

type Step = {
  xl: number
  xr: number
  yl: number
  yr: number
  midX: number
  midY: number
  /** Verdict text, or null on the terminal step. */
  verdict: string
  /** Highlight: which side (X-left / X-right / Y-left / Y-right) was discarded. */
  drop: 'XR' | 'XL' | null
  /** Set on the terminal step. */
  result?: number
}

function compute(X: number[], Y: number[]): Step[] {
  const steps: Step[] = []
  let xl = 0
  let xr = X.length - 1
  let yl = 0
  let yr = Y.length - 1
  while (xr - xl > 1 || yr - yl > 1) {
    const mx = Math.floor((xl + xr) / 2)
    const my = Math.floor((yl + yr) / 2)
    if (X[mx] === Y[my]) {
      steps.push({
        xl,
        xr,
        yl,
        yr,
        midX: mx,
        midY: my,
        verdict: `Οι δύο διάμεσοι ίσοι (X[${mx + 1}] = Y[${my + 1}] = ${X[mx]}). Αυτή είναι η συνολική διάμεσος.`,
        drop: null,
        result: X[mx],
      })
      return steps
    }
    const dropAmount = Math.min(mx - xl, yr - my)
    if (X[mx] < Y[my]) {
      // X μικρότερη μεσαία → πέτα αριστερό του X και δεξί του Y
      steps.push({
        xl,
        xr,
        yl,
        yr,
        midX: mx,
        midY: my,
        verdict: `X[${mx + 1}] = ${X[mx]} < Y[${my + 1}] = ${Y[my]}. Πετάμε αριστερό μισό του X (έως ${mx + 1}) και δεξί μισό του Y (από ${my + 1}+).`,
        drop: 'XL',
      })
      xl = mx
      yr = my + (yr - my - dropAmount)
    } else {
      // Y μικρότερη μεσαία → πέτα δεξί του X, αριστερό του Y
      steps.push({
        xl,
        xr,
        yl,
        yr,
        midX: mx,
        midY: my,
        verdict: `X[${mx + 1}] = ${X[mx]} > Y[${my + 1}] = ${Y[my]}. Πετάμε δεξί μισό του X (από ${mx + 1}+) και αριστερό μισό του Y (έως ${my + 1}).`,
        drop: 'XR',
      })
      xr = xl + (xr - xl - dropAmount)
      yl = my
    }
  }
  // Final step
  const finals = [X[xl], X[xr], Y[yl], Y[yr]].sort((a, b) => a - b)
  const median = (finals[1] + finals[2]) / 2
  steps.push({
    xl,
    xr,
    yl,
    yr,
    midX: Math.floor((xl + xr) / 2),
    midY: Math.floor((yl + yr) / 2),
    verdict: `Μείναν 4 τιμές: {${finals.join(', ')}}. Διάμεσος = (${finals[1]} + ${finals[2]}) / 2 = ${median}.`,
    drop: null,
    result: median,
  })
  return steps
}

function Cell({ v, active, isMedian }: { v: number; active: boolean; isMedian: boolean }) {
  return (
    <span
      className={cn(
        'flex h-9 min-w-[2.2rem] items-center justify-center rounded border px-1 font-mono text-xs font-semibold transition-all',
        active
          ? 'border-border bg-bg-soft text-fg'
          : 'border-border/30 bg-bg-elevated/40 text-fg-subtle opacity-40',
        isMedian && 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-bg-elevated',
      )}
    >
      {v}
    </span>
  )
}

export function MedianOfTwoSorted() {
  const trace = useMemo(() => compute(X_INIT, Y_INIT), [])
  const [step, setStep] = useState(0)
  const cur = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length - 1
  const rounds = step + 1
  const n = X_INIT.length
  const logN = Math.ceil(Math.log2(n))

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Διάμεσος δύο ταξινομημένων — O(log n) πετώντας μισά
        </div>
        <div className="text-xs text-fg-subtle">n = {n}</div>
      </div>

      {/* Two arrays */}
      <div className="mb-3 space-y-2">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <div className="mb-1 flex items-baseline justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-fg-subtle">X</span>
            <span className="font-mono text-fg-muted">
              ενεργές θέσεις: [{cur.xl + 1}..{cur.xr + 1}]
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {X_INIT.map((v, i) => (
              <Cell key={i} v={v} active={i >= cur.xl && i <= cur.xr} isMedian={i === cur.midX} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <div className="mb-1 flex items-baseline justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-fg-subtle">Y</span>
            <span className="font-mono text-fg-muted">
              ενεργές θέσεις: [{cur.yl + 1}..{cur.yr + 1}]
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Y_INIT.map((v, i) => (
              <Cell key={i} v={v} active={i >= cur.yl && i <= cur.yr} isMedian={i === cur.midY} />
            ))}
          </div>
        </div>
      </div>

      <p className="mb-3 rounded-md border border-border bg-bg-soft/30 px-3 py-2 text-xs text-fg-muted">
        {cur.verdict}
      </p>

      {/* Footer ledger */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md border border-border bg-bg-soft/40 px-2 py-1">
          <div className="text-fg-subtle">Βήμα</div>
          <div className="font-mono text-fg">
            {rounds} <span className="text-fg-muted">/ ⌈log₂ {n}⌉ = {logN}</span>
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft/40 px-2 py-1">
          <div className="text-fg-subtle">Αναδρομή</div>
          <div className="font-mono text-fg">T(n) = T(n/2) + O(1)</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft/40 px-2 py-1">
          <div className="text-fg-subtle">Διάμεσος</div>
          <div className="font-mono text-fg">{finished && cur.result !== undefined ? cur.result : '—'}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ⟲ Αρχή
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ← Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(trace.length - 1, s + 1))}
            disabled={finished}
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
          >
            Επόμενο →
          </button>
        </div>
      </div>
    </section>
  )
}
