'use client'

/**
 * InversionCounter — step through `merge-and-count` on two sorted halves.
 *
 * The lecture's subtlest mechanic: when the right half "wins" a comparison,
 * EVERY element still left in the (sorted) left half is larger than it and
 * sits before it — so they all form inversions, counted in one O(1) batch
 * instead of one-by-one. This viz makes that batch visible: the counted
 * left elements light up red and a "+k" badge fires next to the running
 * total. Built for L04.
 *
 * We trace the merge comparison-by-comparison, not level by level — here
 * the inner loop *is* the teaching goal (contrast with MergeSortAnimator,
 * which steps level by level because there the cost shape is the point).
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Frame = {
  /** left pointer when this step's comparison is made */
  i: number
  /** right pointer when this step's comparison is made */
  j: number
  took: 'left' | 'right'
  value: number
  /** mixed inversions added by this step */
  batch: number
  /** running total after this step */
  total: number
  /** output array after this step */
  output: number[]
  note: string
}

/** Build the full merge-and-count trace for two already-sorted halves. */
function trace(left: number[], right: number[]): Frame[] {
  const frames: Frame[] = []
  let i = 0
  let j = 0
  let total = 0
  const output: number[] = []
  while (i < left.length || j < right.length) {
    const takeLeft = j >= right.length || (i < left.length && left[i] <= right[j])
    const beforeI = i
    const beforeJ = j
    let batch = 0
    let value: number
    let note: string
    if (takeLeft) {
      value = left[i]
      output.push(value)
      note =
        j >= right.length
          ? `Το δεξί μισό άδειασε. Κατεβάζουμε το ${value} από το αριστερό — καμία νέα αντιστροφή.`
          : `${value} ≤ ${right[j]}: μικρότερο είναι το αριστερό στοιχείο. Το κατεβάζουμε — κανένα στοιχείο δεν προσπερνά μικρότερό του, άρα 0 νέες αντιστροφές.`
      i++
    } else {
      value = right[j]
      output.push(value)
      batch = left.length - i
      total += batch
      note =
        i >= left.length
          ? `Το αριστερό μισό άδειασε. Κατεβάζουμε το ${value} από το δεξί — καμία νέα αντιστροφή.`
          : `${value} < ${left[i]}: μικρότερο είναι το δεξί στοιχείο. Επειδή το αριστερό μισό είναι ταξινομημένο, το ${value} είναι μικρότερο ΚΑΙ από όλα τα υπόλοιπα αριστερά (${left
              .slice(i)
              .join(', ')}) — καθένα τους σχηματίζει αντιστροφή με το ${value}. Με μία πράξη: +${batch}.`
      j++
    }
    frames.push({
      i: beforeI,
      j: beforeJ,
      took: takeLeft ? 'left' : 'right',
      value,
      batch,
      total,
      output: [...output],
      note,
    })
  }
  return frames
}

/** Count cross inversions directly — used to keep random examples interesting. */
function crossInversions(left: number[], right: number[]): number {
  let c = 0
  for (const b of right) for (const a of left) if (a > b) c++
  return c
}

/** Two random sorted 4-element halves drawn from 8 distinct values. */
function randomHalves(): { left: number[]; right: number[] } {
  for (let attempt = 0; attempt < 30; attempt++) {
    const pool: number[] = []
    while (pool.length < 8) {
      const v = 1 + Math.floor(Math.random() * 20)
      if (!pool.includes(v)) pool.push(v)
    }
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const left = pool.slice(0, 4).sort((a, b) => a - b)
    const right = pool.slice(4).sort((a, b) => a - b)
    // a flat or near-flat example teaches nothing — insist on some action
    if (crossInversions(left, right) >= 3) return { left, right }
  }
  return { left: [2, 3, 8, 9], right: [1, 5, 6, 7] }
}

function Cell({
  value,
  tone,
}: {
  value: number | null
  tone: 'plain' | 'dim' | 'batch' | 'next-l' | 'next-r' | 'fresh' | 'empty'
}) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors',
        tone === 'plain' && 'border-border-strong bg-bg-elevated text-fg',
        tone === 'dim' && 'border-border bg-bg-soft/40 text-fg-subtle opacity-50',
        tone === 'batch' && 'border-rose-500 bg-rose-500/25 text-fg ring-2 ring-rose-400/50',
        tone === 'next-l' && 'border-rose-400 bg-rose-500/5 text-fg ring-1 ring-rose-400/45',
        tone === 'next-r' && 'border-sky-400 bg-sky-500/5 text-fg ring-1 ring-sky-400/45',
        tone === 'fresh' && 'border-accent bg-accent/15 text-fg',
        tone === 'empty' && 'border-dashed border-border text-transparent',
      )}
    >
      {value ?? '·'}
    </div>
  )
}

export function InversionCounter() {
  const [halves, setHalves] = useState<{ left: number[]; right: number[] }>(() => ({
    left: [2, 3, 8, 9],
    right: [1, 5, 6, 7],
  }))
  const [step, setStep] = useState(0)

  const { left, right } = halves
  const frames = useMemo(() => trace(left, right), [left, right])
  const lastStep = frames.length
  const cur = step === 0 ? null : frames[step - 1]

  const iAfter = cur ? cur.i + (cur.took === 'left' ? 1 : 0) : 0
  const jAfter = cur ? cur.j + (cur.took === 'right' ? 1 : 0) : 0
  const output = cur ? cur.output : []
  const runningTotal = cur ? cur.total : 0
  const batch = cur ? cur.batch : 0
  const batchActive = !!cur && cur.took === 'right' && batch > 0
  const done = step === lastStep

  const note =
    step === 0
      ? 'Δύο ταξινομημένα μισά, έτοιμα να συγχωνευθούν. Πάτα «Επόμενο»: σε κάθε βήμα συγκρίνουμε τα δύο μπροστινά στοιχεία, κατεβάζουμε το μικρότερο — και αν χάσει το αριστερό, μετράμε αντιστροφές.'
      : (cur as Frame).note

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          merge-and-count — συγχώνευσε δύο ταξινομημένα μισά, μέτρα τις μικτές αντιστροφές
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? 'Ολοκληρώθηκε' : 'Συγχώνευση'}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Τα δύο μισά φτάνουν εδώ ήδη ταξινομημένα από την αναδρομή.
      </p>

      {/* the two halves */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-semibold text-rose-500">
            Αριστερό A₁
          </span>
          <div className="flex gap-1.5 overflow-x-auto py-0.5">
            {left.map((v, idx) => {
              const consumed = idx < iAfter
              const inBatch = batchActive && idx >= iAfter
              const isNext = !inBatch && !consumed && idx === iAfter && !done
              return (
                <Cell
                  key={idx}
                  value={v}
                  tone={
                    inBatch ? 'batch' : consumed ? 'dim' : isNext ? 'next-l' : 'plain'
                  }
                />
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-xs font-semibold text-sky-500">
            Δεξί A₂
          </span>
          <div className="flex gap-1.5 overflow-x-auto py-0.5">
            {right.map((v, idx) => {
              const consumed = idx < jAfter
              const isNext = !consumed && idx === jAfter && !done
              return (
                <Cell
                  key={idx}
                  value={v}
                  tone={consumed ? 'dim' : isNext ? 'next-r' : 'plain'}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* merged output */}
      <div className="mt-3 flex items-center gap-2">
        <span className="w-24 shrink-0 text-xs font-semibold text-fg-subtle">
          Συγχωνευμένο
        </span>
        <div className="flex gap-1.5 overflow-x-auto py-0.5">
          {Array.from({ length: left.length + right.length }, (_, idx) => {
            const filled = idx < output.length
            return (
              <Cell
                key={idx}
                value={filled ? output[idx] : null}
                tone={!filled ? 'empty' : idx === output.length - 1 ? 'fresh' : 'plain'}
              />
            )
          })}
        </div>
      </div>

      {/* running inversion count */}
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Μικτές αντιστροφές
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {runningTotal}
        </span>
        {batchActive && (
          <span
            key={step}
            className="animate-fade-in rounded-md bg-rose-500/20 px-2 py-0.5 font-mono text-sm font-bold text-rose-600 dark:text-rose-300"
          >
            +{batch}
          </span>
        )}
        {done && (
          <span className="ml-auto text-xs text-fg-muted">
            Αυτό προστίθεται στις αντιστροφές των δύο μισών.
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
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
          onClick={() => setStep((s) => Math.min(lastStep, s + 1))}
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
        <button
          type="button"
          onClick={() => {
            setHalves(randomHalves())
            setStep(0)
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Νέο παράδειγμα
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {lastStep}
        </span>
      </div>
    </section>
  )
}
