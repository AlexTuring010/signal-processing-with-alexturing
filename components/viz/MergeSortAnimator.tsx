'use client'

/**
 * MergeSortAnimator — step through merge sort on 8 elements, level by level.
 *
 * The divide phase splits the array down to singletons; the merge phase
 * recombines adjacent sorted runs back up. A per-level cost meter makes the
 * load-bearing fact visible: every merge level does the same Θ(n) work, and
 * there are log₂n levels — so the total is n·log₂n. Built for L03.
 *
 * Level granularity (not comparison-by-comparison): the teaching goal here
 * is the *shape* of the cost — n per level × log n levels — not the inner
 * two-pointer loop, which the `Algorithm` block covers in prose.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const N = 8 // power of two → clean 8 → 4 → 2 → 1 splits
const LAST = 6 // steps 0–3 divide, steps 4–6 merge

/** Segment boundaries [lo, hi] at a given split level (0 = the whole array). */
function segmentsAtLevel(level: number): Array<[number, number]> {
  const size = N >> level // 8, 4, 2, 1
  const segs: Array<[number, number]> = []
  for (let lo = 0; lo < N; lo += size) segs.push([lo, lo + size - 1])
  return segs
}

/** A random permutation of 1..8, never the already-sorted one. */
function randomPermutation(): number[] {
  const a = Array.from({ length: N }, (_, i) => i + 1)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  if (a.every((v, i) => v === i + 1)) return randomPermutation()
  return a
}

const STEP_NOTES: string[] = [
  'Αφετηρία: ολόκληρος ο πίνακας, αταξινόμητος. Η mergesort δεν ταξινομεί ακόμα — πρώτα διαιρεί.',
  'Διαίρει: σπάμε τον πίνακα στη μέση. Δύο κομμάτια των 4 — κανένα δεν είναι ταξινομημένο ακόμα.',
  'Διαίρει ξανά: κάθε κομμάτι στη μέση του. Τώρα 4 κομμάτια των 2.',
  'Διαίρει ξανά: 8 κομμάτια ενός στοιχείου. Ένας πίνακας ενός στοιχείου είναι πάντα ταξινομημένος — εδώ σταματά η αναδρομή.',
  'Συγχώνευσε: κάθε ζευγάρι μονών στοιχείων γίνεται ένα ταξινομημένο κομμάτι των 2. Η δουλειά όλου του επιπέδου είναι ≈ n.',
  'Συγχώνευσε: ζευγάρια κομματιών των 2 → ταξινομημένα κομμάτια των 4. Πάλι ≈ n συνολική δουλειά σε αυτό το επίπεδο.',
  'Τελική συγχώνευση: τα δύο ταξινομημένα μισά → ένας πλήρως ταξινομημένος πίνακας. Πάλι ≈ n δουλειά.',
]

export function MergeSortAnimator() {
  const [base, setBase] = useState<number[]>(() => [5, 2, 8, 1, 9, 3, 7, 4])
  const [step, setStep] = useState(0)

  const phase: 'divide' | 'merge' = step <= 3 ? 'divide' : 'merge'
  const level = step <= 3 ? step : LAST - step
  const sorted = step >= 4

  const segments = useMemo(() => {
    return segmentsAtLevel(level).map(([lo, hi]) => {
      const slice = base.slice(lo, hi + 1)
      return { lo, values: sorted ? [...slice].sort((x, y) => x - y) : slice }
    })
  }, [base, level, sorted])

  const pieceSize = N / segments.length
  const mergeLevelsDone = step >= 4 ? step - 3 : 0
  const totalWork = mergeLevelsDone * N

  const shuffle = () => {
    setBase(randomPermutation())
    setStep(0)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Mergesort βήμα-βήμα — διαίρει ως το 1, μετά συγχώνευσε
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            phase === 'divide' ? 'bg-accent/10 text-accent' : 'bg-success/15 text-success',
          )}
        >
          {phase === 'divide' ? 'Φάση: Διαίρει' : 'Φάση: Συγχώνευσε'}
        </span>
      </div>

      {/* the segmented array */}
      <div className="overflow-x-auto py-2">
        <div className="mx-auto flex w-fit items-stretch gap-2.5">
          {segments.map((seg) => (
            <div
              key={seg.lo}
              className={cn(
                'flex gap-1 rounded-lg border-2 p-1 transition-colors',
                sorted ? 'border-success/60 bg-success/5' : 'border-border bg-bg-soft/40',
              )}
            >
              {seg.values.map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex h-10 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors',
                    sorted
                      ? 'border-success/50 bg-success/15 text-fg'
                      : 'border-border-strong bg-bg-elevated text-fg',
                  )}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* piece tally */}
      <div className="mt-1 text-center text-xs text-fg-subtle">
        {segments.length === 1 ? '1 κομμάτι' : `${segments.length} κομμάτια`} ×{' '}
        {pieceSize} {pieceSize === 1 ? 'στοιχείο' : 'στοιχεία'}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {STEP_NOTES[step]}
      </div>

      {/* per-level cost meter */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Δουλειά συγχώνευσης ανά επίπεδο</span>
          <span className="font-mono normal-case text-fg-muted">σύνολο: {totalWork}</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-md border px-2 py-1 text-center font-mono text-xs transition-colors',
                i < mergeLevelsDone
                  ? 'border-success/50 bg-success/10 text-fg'
                  : 'border-dashed border-border text-fg-subtle',
              )}
            >
              ≈ n = {N}
            </div>
          ))}
        </div>
        {step === LAST && (
          <div className="mt-1.5 text-center text-xs text-fg-muted">
            3 επίπεδα × n = 3n = n·log₂n = {3 * N} συγκρίσεις
          </div>
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
          disabled={step === LAST}
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
          onClick={shuffle}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Νέος πίνακας
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step + 1} / {LAST + 1}
        </span>
      </div>
    </section>
  )
}
