'use client'

/**
 * StoogeSortViz — the 3-call/2-3 structure made visible.
 *
 * For front-set-5-ask1. Stooge Sort sorts an array via 3 recursive
 * calls each on 2/3 of the array; correctness rests on the (1) sort
 * first 2/3 (2) sort last 2/3 — pushing the global max-third into
 * the right place (3) re-sort first 2/3 argument. Each call costs
 * O(1) extra, giving T(n) = 3T(2n/3) + O(1) → Θ(n^{log_{3/2} 3}) ≈
 * Θ(n^{2.71}).
 *
 * Two panels:
 *  • Array — a 9-element array with three colored thirds. ▶ runs the
 *    full recursion, highlighting which thirds each call touches.
 *  • Tree — the recursion tree growing level by level; counter for
 *    nodes at depth k = 3^k; the comparison with mergesort (2^k) and
 *    bubble (n²) is shown as bars on the right.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

const LOG32_3 = Math.log(3) / Math.log(1.5) // ≈ 2.7095

const INITIAL = [7, 2, 5, 1, 9, 4, 6, 3, 8]

type Action = {
  /** Description of what's happening. */
  label: string
  /** Indices touched (inclusive l..r). */
  l: number
  r: number
  /** Snapshot of the array after this action. */
  snapshot: number[]
}

function stoogeTrace(arr: number[]): Action[] {
  const actions: Action[] = []
  const a = arr.slice()
  function go(l: number, r: number) {
    if (a[l] > a[r]) {
      ;[a[l], a[r]] = [a[r], a[l]]
    }
    actions.push({ label: `Swap-test A[${l + 1}], A[${r + 1}]`, l, r, snapshot: a.slice() })
    if (l + 1 > r) return
    const k = Math.floor((r - l + 1) / 3)
    go(l, r - k)
    go(l + k, r)
    go(l, r - k)
  }
  go(0, a.length - 1)
  return actions
}

export function StoogeSortViz() {
  const [step, setStep] = useState(0)

  const trace = useMemo(() => stoogeTrace(INITIAL), [])
  const cur = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length - 1

  // Recursion tree node count at depth d
  const depth = useMemo(() => Math.floor(Math.log(INITIAL.length) / Math.log(1.5)), [])

  const treeData = useMemo(() => {
    return Array.from({ length: depth + 1 }, (_, k) => ({
      depth: k,
      stooge: 3 ** k,
      merge: 2 ** k,
    }))
  }, [depth])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Stooge Sort — 3 κλήσεις × 2/3 του πίνακα
        </div>
        <div className="text-xs text-fg-subtle">n = {INITIAL.length}</div>
      </div>

      {/* Array */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας μετά το βήμα {step + 1}
        </div>
        <div className="flex justify-center gap-1">
          {cur.snapshot.map((v, i) => {
            const inRange = i >= cur.l && i <= cur.r
            const third = Math.floor((i * 3) / INITIAL.length) // 0,1,2
            const tint =
              third === 0
                ? 'bg-emerald-500/30 border-emerald-500/40'
                : third === 1
                  ? 'bg-amber-500/30 border-amber-500/40'
                  : 'bg-rose-500/30 border-rose-500/40'
            return (
              <span
                key={i}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded border font-mono text-sm font-bold transition-colors',
                  inRange ? tint : 'border-border bg-bg-elevated text-fg-subtle',
                  inRange ? 'text-fg' : '',
                )}
              >
                {v}
              </span>
            )
          })}
        </div>
        <p className="mt-2 text-center text-xs text-fg-muted">{cur.label}</p>
      </div>

      {/* Tree growth */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Δέντρο αναδρομής — κόμβοι ανά επίπεδο
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-fg-subtle">
                <th className="px-2 py-1 text-left">επίπεδο</th>
                <th className="px-2 py-1 text-right">Stooge (3ᵏ)</th>
                <th className="px-2 py-1 text-right">Mergesort (2ᵏ)</th>
                <th className="px-2 py-1 text-left">μήκος μέρους ≈</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {treeData.map((row) => (
                <tr key={row.depth} className="border-b border-border/60">
                  <td className="px-2 py-1 text-fg-subtle">{row.depth}</td>
                  <td className="px-2 py-1 text-right text-rose-400">{row.stooge}</td>
                  <td className="px-2 py-1 text-right text-emerald-400">{row.merge}</td>
                  <td className="px-2 py-1 text-fg-muted">
                    n · (2/3)<sup>{row.depth}</sup> ≈{' '}
                    {(INITIAL.length * (2 / 3) ** row.depth).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asymptotic compare */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2">
          <div className="font-semibold uppercase tracking-wider text-emerald-500">
            Mergesort
          </div>
          <div className="font-mono text-sm text-fg">Θ(n log n)</div>
        </div>
        <div className="rounded-md border border-warn/40 bg-warn/5 px-3 py-2">
          <div className="font-semibold uppercase tracking-wider text-warn">
            Bubble / Insertion
          </div>
          <div className="font-mono text-sm text-fg">Θ(n²)</div>
        </div>
        <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2">
          <div className="font-semibold uppercase tracking-wider text-rose-500">
            Stooge
          </div>
          <div className="font-mono text-sm text-fg">
            Θ(n<sup>{LOG32_3.toFixed(2)}</sup>)
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
        <strong>Δίδαγμα.</strong> Tο σχήμα D&amp;C{' '}
        <em>από μόνο του</em> δεν εγγυάται ταχύτητα.{' '}
        <InlineMath>{'T(n) = 3T(2n/3) + O(1)'}</InlineMath> δίνει Master case 1
        με <InlineMath>{'\\log_{3/2} 3 \\approx 2.71'}</InlineMath> — χειρότερα κι
        από την bubble sort. Stooge.
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          βήμα {Math.min(step + 1, trace.length)} / {trace.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, trace.length - 1))}
          disabled={finished}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
