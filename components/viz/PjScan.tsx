'use client'

/**
 * PjScan — computing every p(j) in O(n) with a two-pointer merge.
 *
 * The obvious way to find all p(j) is an O(n²) double loop; the lecture's
 * O(n) algorithm instead merges two sorted lists — the finish times and the
 * start times — with two pointers i and j. This step-through animates exactly
 * that pseudocode:
 *
 *   if fᵢ ≤ sⱼ  → finish i is early enough to be a predecessor → advance i
 *   else        → p(owner of sⱼ) = i−1                          → advance j
 *
 * Each step lights the two compared cells, shows the fᵢ vs sⱼ verdict, and
 * fills one cell of the p-table. Because every step moves a pointer forward
 * and neither pointer passes n, the whole scan is at most 2n steps. This
 * section was missing from the page entirely — built for L14.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REQS, N } from './interval-instance'

type Action =
  | { type: 'advance'; i: number; j: number; fi: number; sj: number }
  | {
      type: 'record'
      i: number
      j: number
      fi: number | null
      sj: number
      owner: number
      pVal: number
    }

/** Finish times in their canonical 1..n order (REQS is sorted by finish). */
const FINISHES = REQS.map((r) => ({ t: r.f, owner: r.id }))

/** Start times sorted ascending — the j-th start belongs to request `owner`. */
const STARTS = [...REQS]
  .map((r) => ({ t: r.s, owner: r.id }))
  .sort((a, b) => a.t - b.t || a.owner - b.owner)

/** Run the two-pointer scan once, logging the before-state of every step. */
const ACTIONS: Action[] = (() => {
  const acts: Action[] = []
  let i = 1
  let j = 1
  while (j <= N) {
    const sj = STARTS[j - 1].t
    const fi = i <= N ? FINISHES[i - 1].t : null
    if (fi !== null && fi <= sj) {
      acts.push({ type: 'advance', i, j, fi, sj })
      i += 1
    } else {
      acts.push({
        type: 'record',
        i,
        j,
        fi,
        sj,
        owner: STARTS[j - 1].owner,
        pVal: i - 1,
      })
      j += 1
    }
  }
  return acts
})()

const LAST = ACTIONS.length

type ChipState = 'passed' | 'current' | 'pending'

function chipClass(state: ChipState) {
  if (state === 'current') return 'border-accent bg-accent/15 text-fg'
  if (state === 'passed') return 'border-success/40 bg-success/10 text-fg-muted'
  return 'border-border bg-bg-soft/40 text-fg-muted'
}

export function PjScan() {
  const [step, setStep] = useState(0)

  const done = step === LAST
  const action = step >= 1 ? ACTIONS[step - 1] : null
  const i = action ? action.i : 1
  const j = action ? action.j : 1

  const recorded = new Map<number, number>()
  for (let k = 0; k < step; k++) {
    const a = ACTIONS[k]
    if (a.type === 'record') recorded.set(a.owner, a.pVal)
  }
  const justOwner = action && action.type === 'record' ? action.owner : null

  let note: string
  if (!action) {
    note =
      'Δύο ταξινομημένοι πίνακες — οι χρόνοι λήξης και οι χρόνοι έναρξης — και δύο δείκτες i, j που ξεκινούν στο 1. Σε κάθε βήμα συγκρίνουμε τη λήξη fᵢ με την έναρξη sⱼ. Πάτα «Επόμενο».'
  } else if (action.type === 'advance') {
    note = `fᵢ = ${action.fi} ≤ sⱼ = ${action.sj}: η λήξη στη θέση ${action.i} είναι αρκετά νωρίς ώστε το αίτημα να μπορεί να γίνει προκάτοχος. Προχωράμε τον δείκτη i.`
  } else {
    const fiTxt = action.fi === null ? 'δεν έμειναν λήξεις' : `fᵢ = ${action.fi} > sⱼ = ${action.sj}`
    note = `${fiTxt}: ο τελευταίος χρόνος λήξης που πρόλαβε πριν την έναρξη sⱼ = ${action.sj} είναι ο i−1 = ${action.pVal}. Άρα p(${action.owner}) = ${action.pVal}. Προχωράμε τον δείκτη j.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Υπολογισμός όλων των p(j) σε O(n)
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            done ? 'bg-success/15 text-success' : 'bg-accent/10 text-accent',
          )}
        >
          {done ? '✓ όλα τα p(j)' : `Βήμα ${step} / ${LAST}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Συγχώνευση δύο ταξινομημένων πινάκων με δύο δείκτες — όπως το merge της
        συγχωνευτικής ταξινόμησης.
      </p>

      {/* finishes array */}
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        Χρόνοι λήξης fᵢ — ταξινομημένοι
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {FINISHES.map((f, idx) => {
          const pos = idx + 1
          const state: ChipState = pos === i ? 'current' : pos < i ? 'passed' : 'pending'
          return (
            <div key={pos} className="flex shrink-0 flex-col items-center">
              <div
                className={cn(
                  'flex h-12 w-[58px] flex-col items-center justify-center rounded-md border-2',
                  chipClass(state),
                )}
              >
                <span className="font-mono text-base font-bold leading-none tabular-nums">
                  {f.t}
                </span>
                <span className="mt-0.5 text-[10px] text-fg-subtle">αίτ. {f.owner}</span>
              </div>
              <span className="mt-0.5 h-4 text-xs font-bold text-accent">
                {pos === i ? '▲ i' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* starts array */}
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        Χρόνοι έναρξης sⱼ — ταξινομημένοι
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {STARTS.map((s, idx) => {
          const pos = idx + 1
          const state: ChipState = pos === j ? 'current' : pos < j ? 'passed' : 'pending'
          return (
            <div key={pos} className="flex shrink-0 flex-col items-center">
              <div
                className={cn(
                  'flex h-12 w-[58px] flex-col items-center justify-center rounded-md border-2',
                  chipClass(state),
                )}
              >
                <span className="font-mono text-base font-bold leading-none tabular-nums">
                  {s.t}
                </span>
                <span className="mt-0.5 text-[10px] text-fg-subtle">αίτ. {s.owner}</span>
              </div>
              <span className="mt-0.5 h-4 text-xs font-bold text-accent">
                {pos === j ? '▲ j' : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* comparison readout */}
      <div
        className={cn(
          'rounded-lg border px-3 py-2.5 text-center',
          action?.type === 'advance' && 'border-sky-400/50 bg-sky-400/10',
          action?.type === 'record' && 'border-success/50 bg-success/10',
          !action && 'border-border bg-bg-soft/50',
        )}
      >
        {action ? (
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-sm">
            <span className="text-fg">
              fᵢ = <strong>{action.fi ?? '∞'}</strong>
            </span>
            <span className="font-bold text-fg-subtle">
              {action.type === 'advance' ? '≤' : '>'}
            </span>
            <span className="text-fg">
              sⱼ = <strong>{action.sj}</strong>
            </span>
            <span className="text-fg-subtle">→</span>
            <span className="font-sans font-semibold text-fg">
              {action.type === 'advance'
                ? 'προχώρα τον i'
                : `p(${action.owner}) = ${action.pVal}, προχώρα τον j`}
            </span>
          </div>
        ) : (
          <span className="text-sm text-fg-subtle">
            i = 1, j = 1 — έτοιμοι για την πρώτη σύγκριση
          </span>
        )}
      </div>

      {/* p(j) results */}
      <div className="mt-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Αποτέλεσμα — p(j)
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {REQS.map((_, idx) => {
            const owner = idx + 1
            const has = recorded.has(owner)
            const isJust = owner === justOwner
            return (
              <div key={owner} className="flex shrink-0 flex-col items-center gap-0.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-bold',
                    isJust && 'border-success bg-success/20 text-fg',
                    !isJust && has && 'border-border bg-bg-soft text-fg',
                    !has && 'border-dashed border-border text-transparent',
                  )}
                >
                  {has ? recorded.get(owner) : '·'}
                </div>
                <span className="font-mono text-[10px] text-fg-subtle">p({owner})</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
        {done && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Κάθε βήμα προχώρησε έναν δείκτη κατά 1, και κανένας δείκτης δεν
              ξεπερνά το n — άρα το πολύ 2n βήματα συνολικά: O(n).
            </span>
          </>
        )}
      </div>

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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={done}
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
