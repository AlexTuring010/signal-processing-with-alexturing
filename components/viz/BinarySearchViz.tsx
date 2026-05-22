'use client'

/**
 * BinarySearchViz — «Γίνε ο αλγόριθμος» for binary search.
 *
 * Pick a target, then at each step decide which half to keep. The viz
 * shows the live [lo, hi] window and the middle element; a wrong choice
 * is explained. The point a learner should feel: every step throws away
 * half the array, so even a million elements need only ~20 comparisons.
 *
 * Used by L01 (intro) and reusable in L03 (divide & conquer).
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_ARRAY = [5, 11, 14, 17, 23, 28, 33, 41]
/** 17 → 1 step (best case), 5 → left end, 23 → typical, 41 → right end, 30 → absent. */
const DEFAULT_TARGETS = [17, 5, 23, 41, 30]

type Decision = 'found' | 'left' | 'right'
type Step = { lo: number; hi: number; mid: number; result: Decision }

/** Replay binary search, recording the window + decision at each comparison. */
function buildSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = []
  let lo = 0
  let hi = arr.length - 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, result: 'found' })
      break
    }
    if (arr[mid] < target) {
      steps.push({ lo, hi, mid, result: 'right' })
      lo = mid + 1
    } else {
      steps.push({ lo, hi, mid, result: 'left' })
      hi = mid - 1
    }
  }
  return steps
}

type Props = {
  array?: number[]
  targets?: number[]
}

export function BinarySearchViz({ array = DEFAULT_ARRAY, targets = DEFAULT_TARGETS }: Props) {
  const [target, setTarget] = useState(targets[0])
  const steps = useMemo(() => buildSteps(array, target), [array, target])
  const [progress, setProgress] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)

  const done = progress >= steps.length
  const found = done && steps.length > 0 && steps[steps.length - 1].result === 'found'
  const foundIdx = found ? steps[steps.length - 1].mid : -1
  const cur = done ? null : steps[progress]

  const pickTarget = (t: number) => {
    setTarget(t)
    setProgress(0)
    setWrong(null)
  }
  const reset = () => {
    setProgress(0)
    setWrong(null)
  }

  const decide = (choice: Decision) => {
    if (!cur) return
    if (choice === cur.result) {
      setWrong(null)
      setProgress((p) => p + 1)
      return
    }
    const midVal = array[cur.mid]
    if (cur.result === 'found') {
      setWrong(`Κοίτα ξανά: a[${cur.mid}] = ${midVal} είναι ίσο με το ${target} — μόλις το βρήκες!`)
    } else if (cur.result === 'right') {
      setWrong(
        `a[${cur.mid}] = ${midVal} είναι μικρότερο από το ${target}. Άρα ο στόχος, αν υπάρχει, είναι στο δεξί μισό.`,
      )
    } else {
      setWrong(
        `a[${cur.mid}] = ${midVal} είναι μεγαλύτερο από το ${target}. Άρα ο στόχος, αν υπάρχει, είναι στο αριστερό μισό.`,
      )
    }
  }

  // cell status
  const cellStatus = (i: number): 'mid' | 'active' | 'eliminated' | 'found' => {
    if (found && i === foundIdx) return 'found'
    if (cur) {
      if (i === cur.mid) return 'mid'
      if (i >= cur.lo && i <= cur.hi) return 'active'
      return 'eliminated'
    }
    return 'eliminated'
  }

  let tone: 'info' | 'danger' | 'success' = 'info'
  let message: string
  if (wrong) {
    tone = 'danger'
    message = wrong
  } else if (done) {
    tone = 'success'
    message = found
      ? `Βρέθηκε το ${target} στη θέση ${foundIdx} — με ${steps.length} ${steps.length === 1 ? 'σύγκριση' : 'συγκρίσεις'}.`
      : `Το ${target} δεν υπάρχει στον πίνακα — το διαπιστώσαμε με ${steps.length} συγκρίσεις.`
  } else if (cur) {
    const midVal = array[cur.mid]
    message = `Διάστημα αναζήτησης: θέσεις ${cur.lo}–${cur.hi}. Μεσαίο στοιχείο: a[${cur.mid}] = ${midVal}. Σύγκρινέ το με τον στόχο ${target} — πού συνεχίζεις;`
  } else {
    message = ''
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + target picker */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δυαδική αναζήτηση — διάλεξε στόχο και γίνε ο αλγόριθμος
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-xs text-fg-subtle">Στόχος:</span>
          {targets.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => pickTarget(t)}
              className={cn(
                'rounded-md border px-2 py-0.5 font-mono text-sm transition-colors',
                t === target
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-fg-muted hover:text-fg',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* the array */}
      <div className="overflow-x-auto py-2">
        <div className="mx-auto flex w-fit gap-1.5">
          {array.map((v, i) => {
            const st = cellStatus(i)
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-md border-2 font-mono text-sm font-semibold transition-colors',
                    st === 'mid' && 'border-accent bg-accent/15 text-fg ring-2 ring-accent/30',
                    st === 'active' && 'border-border-strong bg-bg-soft text-fg',
                    st === 'found' && 'border-success bg-success/15 text-fg',
                    st === 'eliminated' && 'border-border bg-bg-soft/40 text-fg-subtle opacity-50',
                  )}
                >
                  {v}
                </div>
                <span className="font-mono text-[10px] text-fg-subtle">{i}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* message */}
      <div
        aria-live="polite"
        className={cn(
          'mt-2 min-h-[3.25rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          tone === 'danger' &&
            'border-red-300/60 bg-red-50/70 text-red-950 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100',
          tone === 'success' &&
            'border-emerald-300/60 bg-emerald-50/70 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
          tone === 'info' && 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {message}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!done ? (
          <>
            <button
              type="button"
              onClick={() => decide('left')}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
            >
              ← Αριστερό μισό
            </button>
            <button
              type="button"
              onClick={() => decide('right')}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
            >
              Δεξί μισό →
            </button>
            <button
              type="button"
              onClick={() => decide('found')}
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Βρέθηκε!
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Ξανά
          </button>
        )}
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Σύγκριση {Math.min(progress + (done ? 0 : 1), steps.length)} / {steps.length}
        </span>
      </div>
    </section>
  )
}
