'use client'

/**
 * EditDistanceTable — fill the sequence-alignment DP grid, row by row.
 *
 * Every cell M[i][j] is a min over THREE predecessors: diagonal (match /
 * substitution), up (gap in X), left (gap in Y). Each step reveals a row,
 * spotlights cell M[i][n] with its three source cells, and shows the
 * min{…}. The final step backtracks the optimal alignment path. Built for
 * L16, on the lecture's own GAC / AGC instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const X = 'GAC'
const Y = 'AGC'
const M_LEN = X.length
const N_LEN = Y.length
const GAP = 1 // δ
const mism = (a: string, b: string) => (a === b ? 0 : 1) // α

export function EditDistanceTable() {
  const [step, setStep] = useState(0) // 0 = base cases; 1..m = reveal row; m+1 = traceback
  const last = M_LEN + 1

  const M = useMemo(() => {
    const t: number[][] = []
    for (let i = 0; i <= M_LEN; i++) {
      t.push([])
      for (let j = 0; j <= N_LEN; j++) {
        if (i === 0) t[i][j] = j * GAP
        else if (j === 0) t[i][j] = i * GAP
        else
          t[i][j] = Math.min(
            mism(X[i - 1], Y[j - 1]) + t[i - 1][j - 1],
            GAP + t[i - 1][j],
            GAP + t[i][j - 1],
          )
      }
    }
    return t
  }, [])

  /** backtrack the optimal alignment path, preferring the diagonal */
  const path = useMemo(() => {
    const cells = new Set<string>()
    let i = M_LEN
    let j = N_LEN
    cells.add(`${i},${j}`)
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && M[i][j] === mism(X[i - 1], Y[j - 1]) + M[i - 1][j - 1]) {
        i -= 1
        j -= 1
      } else if (i > 0 && M[i][j] === GAP + M[i - 1][j]) {
        i -= 1
      } else {
        j -= 1
      }
      cells.add(`${i},${j}`)
    }
    return cells
  }, [M])

  const done = step === last
  const focusRow = step >= 1 && step <= M_LEN ? step : 0
  const fi = focusRow
  const fj = N_LEN

  const revealed = (r: number, c: number) => r === 0 || c === 0 || r <= step

  let note: string
  if (step === 0) {
    note =
      'Οι βασικές περιπτώσεις: η γραμμή 0 και η στήλη 0 είναι «ευθυγράμμιση με την κενή συμβολοσειρά» — ένα κενό (δ) ανά χαρακτήρα. Πάτα «Επόμενο».'
  } else if (focusRow > 0) {
    const i = focusRow
    const j = N_LEN
    const matchVal = mism(X[i - 1], Y[j - 1]) + M[i - 1][j - 1]
    note =
      `Γραμμή ${i} — χαρακτήρας «${X[i - 1]}». Για το κελί M[${i}][${j}]: ` +
      `ταίριασμα ${X[i - 1]}–${Y[j - 1]} = ${mism(X[i - 1], Y[j - 1])} + διαγώνιο = ${matchVal}· ` +
      `κενό στο X = 1 + πάνω = ${GAP + M[i - 1][j]}· κενό στο Y = 1 + αριστερά = ${GAP + M[i][j - 1]}. ` +
      `M[${i}][${j}] = min = ${M[i][j]}.`
  } else {
    note = `Πέρασμα προς τα πίσω από το (${M_LEN}, ${N_LEN}): η κόκκινη διαδρομή είναι η βέλτιστη ευθυγράμμιση, με απόσταση επεξεργασίας ${M[M_LEN][N_LEN]}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ευθυγράμμιση — γέμισμα του πλέγματος, γραμμή-γραμμή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Απόσταση: ${M[M_LEN][N_LEN]}` : `X=${X} · Y=${Y}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Κόστος κενού δ = 1, κόστος σύγκρουσης α = 1. Κάθε κελί = min τριών γειτόνων.
      </p>

      {/* the grid */}
      <div className="overflow-x-auto">
        <div
          className="grid w-fit gap-px font-mono text-sm"
          style={{ gridTemplateColumns: `3rem repeat(${N_LEN + 1}, 2.5rem)` }}
        >
          {/* header */}
          <div />
          <div className="flex h-7 items-center justify-center text-xs font-semibold text-fg-subtle">
            ∅
          </div>
          {Y.split('').map((ch, j) => (
            <div
              key={`h${j}`}
              className="flex h-7 items-center justify-center text-xs font-bold text-fg"
            >
              {ch}
            </div>
          ))}
          {/* rows */}
          {M.map((row, i) => (
            <div key={i} className="contents">
              <div className="flex items-center justify-center text-xs font-bold text-fg">
                {i === 0 ? '∅' : X[i - 1]}
              </div>
              {row.map((val, j) => {
                const isFocus = i === fi && j === fj && step >= 1 && !done
                const isSrc =
                  step >= 1 &&
                  !done &&
                  i === fi - 1 &&
                  (j === fj - 1 || j === fj)
                const isSrcLeft = step >= 1 && !done && i === fi && j === fj - 1
                const onPath = done && path.has(`${i},${j}`)
                const show = revealed(i, j)
                return (
                  <div
                    key={j}
                    className={cn(
                      'flex h-9 items-center justify-center rounded border',
                      !show && 'border-dashed border-border text-transparent',
                      show &&
                        !isFocus &&
                        !isSrc &&
                        !isSrcLeft &&
                        !onPath &&
                        'border-border bg-bg-soft/50 text-fg',
                      (isSrc || isSrcLeft) && 'border-sky-400 bg-sky-400/20 font-bold text-fg',
                      isFocus && 'border-accent bg-accent/20 font-bold text-fg',
                      onPath && 'border-rose-500 bg-rose-500/20 font-bold text-fg',
                    )}
                  >
                    {show ? val : '·'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* three-way computation */}
      {focusRow > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            {
              label: `Ταίριασμα ${X[focusRow - 1]}–${Y[N_LEN - 1]}`,
              val: mism(X[focusRow - 1], Y[N_LEN - 1]) + M[focusRow - 1][N_LEN - 1],
            },
            { label: 'Κενό στο X', val: GAP + M[focusRow - 1][N_LEN] },
            { label: 'Κενό στο Y', val: GAP + M[focusRow][N_LEN - 1] },
          ].map((c) => (
            <div
              key={c.label}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm',
                c.val === M[focusRow][N_LEN]
                  ? 'border-success/50 bg-success/10'
                  : 'border-border bg-bg-soft/50',
              )}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                {c.label}
              </div>
              <div className="font-mono text-fg">
                = <strong>{c.val}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
          onClick={() => setStep((s) => Math.min(last, s + 1))}
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
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
