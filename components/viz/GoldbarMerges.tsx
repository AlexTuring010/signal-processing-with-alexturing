'use client'

/**
 * GoldbarMerges — «ένωση ράβδων χρυσού» as Huffman in disguise.
 *
 * The problem doesn't talk about characters or trees, just about WEIGHTS
 * and CUMULATIVE COSTS. So the viz makes the cost ledger the headline:
 * two panels side by side, the same 5 bars [1,2,3,4,5], two different
 * merge orders. The greedy «δύο ελαφρύτερες» runs cost 33; the naive
 * «δύο βαρύτερες» runs cost 50. The visceral lesson — bars merged early
 * get re-paid in EVERY later merge — is recorded in the per-bar
 * «μέτρησες αυτή τη ράβδο X φορές» counter at the right of each row.
 *
 * Built for front-set-7-ask1.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BARS: number[] = [1, 2, 3, 4, 5]
const N = BARS.length // 5
const STEPS = N - 1 // 4 merges total

type Strategy = 'greedy' | 'naive'

type MergeRecord = {
  /** indices into BARS that contributed to each pool item we picked */
  pickedOrigins: [number[], number[]]
  /** the two pool values that got merged */
  picked: [number, number]
  /** sum of the two picks */
  sum: number
  /** running cost after this merge */
  cost: number
  /** pool AFTER this merge */
  pool: { value: number; origins: number[] }[]
}

/** simulate a strategy and return a per-step record. */
function simulate(strategy: Strategy): MergeRecord[] {
  // pool items carry their `origins` — the original bar indices that
  // contributed to them. We track this to render the per-bar payment count
  // (= depth of each bar in the implied merge tree).
  let pool = BARS.map((value, i) => ({ value, origins: [i] }))
  const out: MergeRecord[] = []
  let cost = 0
  for (let s = 0; s < STEPS; s++) {
    // sort ascending; greedy picks the first two, naive picks the last two
    pool = pool.slice().sort((a, b) => a.value - b.value)
    let a: { value: number; origins: number[] }
    let b: { value: number; origins: number[] }
    let rest: { value: number; origins: number[] }[]
    if (strategy === 'greedy') {
      a = pool[0]
      b = pool[1]
      rest = pool.slice(2)
    } else {
      a = pool[pool.length - 1]
      b = pool[pool.length - 2]
      rest = pool.slice(0, pool.length - 2)
    }
    const sum = a.value + b.value
    cost += sum
    const merged = { value: sum, origins: [...a.origins, ...b.origins] }
    pool = [...rest, merged]
    out.push({
      pickedOrigins: [a.origins, b.origins],
      picked: [a.value, b.value],
      sum,
      cost,
      pool,
    })
  }
  return out
}

const GREEDY = simulate('greedy')
const NAIVE = simulate('naive')

/** how many times each original bar contributed to a merge sum so far */
function paymentCount(history: MergeRecord[], step: number, barIndex: number): number {
  // a bar is "paid" once per merge whose pickedOrigins contain it
  let cnt = 0
  for (let i = 0; i < step && i < history.length; i++) {
    const [oa, ob] = history[i].pickedOrigins
    if (oa.includes(barIndex) || ob.includes(barIndex)) cnt++
  }
  return cnt
}

export function GoldbarMerges() {
  const [step, setStep] = useState(0)
  const last = STEPS

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ράβδοι χρυσού — δύο στρατηγικές ένωσης, ένας λογαριασμός
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Συγχώνευση {step}/{last}
        </span>
      </div>

      <p className="mb-3 text-xs text-fg-subtle">
        Πέντε ράβδοι με βάρη {BARS.join(', ')} (σύνολο {BARS.reduce((s, x) => s + x, 0)}). Κάθε
        συγχώνευση δύο ράβδων «κοστίζει» όσο το άθροισμα των βαρών τους. Το συνολικό κόστος = το
        άθροισμα των ενδιάμεσων συνόλων.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <StrategyPanel
          title="Άπληστος — δύο ελαφρύτερες"
          subtitle="η πρόταση της εκφώνησης"
          tone="greedy"
          history={GREEDY}
          step={step}
        />
        <StrategyPanel
          title="Αντι-άπληστος — δύο βαρύτερες"
          subtitle="η εύλογη παγίδα"
          tone="naive"
          history={NAIVE}
          step={step}
        />
      </div>

      {/* the climax — running totals side by side */}
      <ComparePanel step={step} />

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={step >= last}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}

function StrategyPanel({
  title,
  subtitle,
  tone,
  history,
  step,
}: {
  title: string
  subtitle: string
  tone: Strategy
  history: MergeRecord[]
  step: number
}) {
  const verdictColor =
    tone === 'greedy'
      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300'

  const pool = useMemo(() => {
    if (step === 0) return BARS.map((value, i) => ({ value, origins: [i] }))
    return history[step - 1].pool
  }, [history, step])

  // pre-sort for display
  const poolSorted = [...pool].sort((a, b) => a.value - b.value)

  const currentRecord = step > 0 ? history[step - 1] : undefined
  const cost = currentRecord?.cost ?? 0

  return (
    <div className={cn('rounded-lg border bg-bg-soft/30 p-3', verdictColor)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <div>
          <div className="text-sm font-bold tracking-tight">{title}</div>
          <div className="text-[11px] text-fg-subtle">{subtitle}</div>
        </div>
        <div className="rounded-md border border-current bg-bg-elevated px-2 py-0.5 font-mono text-xs font-bold">
          Κόστος = {cost}
        </div>
      </div>

      {/* pool */}
      <div className="mb-2">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          Pool
        </div>
        <div className="flex flex-wrap gap-1">
          {poolSorted.map((p, i) => {
            // highlight which two will be picked NEXT (top 2 for greedy, bottom 2 for naive)
            const willPick =
              step < STEPS &&
              (tone === 'greedy' ? i < 2 : i >= poolSorted.length - 2)
            return (
              <span
                key={i}
                className={cn(
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-mono text-sm font-bold',
                  willPick
                    ? 'border-amber-500 bg-amber-500/20 text-fg'
                    : 'border-border bg-bg-elevated text-fg-muted',
                )}
              >
                {p.value}
              </span>
            )
          })}
        </div>
      </div>

      {/* merge ledger */}
      <div className="mb-2">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          Λογαριασμός συγχωνεύσεων
        </div>
        <ul className="space-y-0.5 font-mono text-xs">
          {history.slice(0, step).map((r, i) => (
            <li
              key={i}
              className={cn(
                'flex items-center justify-between rounded px-2 py-0.5',
                i === step - 1 && 'bg-amber-500/15 font-bold',
              )}
            >
              <span>
                {r.picked[0]} + {r.picked[1]} = {r.sum}
              </span>
              <span className="text-fg-muted">
                running: {history.slice(0, i + 1).reduce((s, x) => s + x.sum, 0)}
              </span>
            </li>
          ))}
          {history.length === step && step > 0 && (
            <li className="rounded bg-current/20 px-2 py-1 text-center font-bold">
              ΣΥΝΟΛΟ = {cost}
            </li>
          )}
        </ul>
      </div>

      {/* per-bar payments */}
      <div>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          Πληρωμές ανά αρχική ράβδο
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {BARS.map((value, i) => {
            const cnt = paymentCount(history, step, i)
            return (
              <div
                key={i}
                className="rounded border border-border bg-bg-elevated px-1 py-0.5 font-mono text-[11px]"
              >
                <div className="font-bold text-fg">{value}</div>
                <div className="text-fg-subtle">× {cnt}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ComparePanel({ step }: { step: number }) {
  const g = step > 0 ? GREEDY[step - 1].cost : 0
  const n = step > 0 ? NAIVE[step - 1].cost : 0
  const max = Math.max(GREEDY[STEPS - 1].cost, NAIVE[STEPS - 1].cost)
  const gPct = (g / max) * 100
  const nPct = (n / max) * 100
  const done = step >= STEPS
  return (
    <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        Συσσωρευμένο κόστος — οπτική σύγκριση
      </div>
      <div className="space-y-2">
        <div>
          <div className="mb-0.5 flex justify-between text-xs font-bold">
            <span className="text-emerald-700 dark:text-emerald-300">Άπληστος</span>
            <span className="font-mono">{g}</span>
          </div>
          <div className="h-3 overflow-hidden rounded bg-bg-elevated">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${gPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-0.5 flex justify-between text-xs font-bold">
            <span className="text-rose-700 dark:text-rose-300">Αντι-άπληστος</span>
            <span className="font-mono">{n}</span>
          </div>
          <div className="h-3 overflow-hidden rounded bg-bg-elevated">
            <div className="h-full bg-rose-500 transition-all" style={{ width: `${nPct}%` }} />
          </div>
        </div>
      </div>
      {done && (
        <p className="mt-2 text-xs text-fg-muted">
          Τελικός λογαριασμός: <strong className="text-emerald-700 dark:text-emerald-300">{g}</strong>{' '}
          έναντι{' '}
          <strong className="text-rose-700 dark:text-rose-300">{n}</strong>. Διαφορά {n - g} — το{' '}
          βάρος του 5 πληρώθηκε 4 φορές με τον αντι-άπληστο (1+1+1+1=4), αλλά μόλις 2 φορές με τον
          άπληστο. <em>Η σειρά ένωσης μετράει.</em>
        </p>
      )}
    </div>
  )
}
