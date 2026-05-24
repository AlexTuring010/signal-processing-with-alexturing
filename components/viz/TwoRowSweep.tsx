'use client'

/**
 * TwoRowSweep — why the edit-distance VALUE fits in linear space, and why the
 * alignment itself does not.
 *
 * The DP fills the grid row by row, and row i depends only on row i−1. So you
 * never need more than TWO rows alive at once: the value OPT(m,n) comes out in
 * O(m+n) space. This viz sweeps the GCTA / CTAG grid and visibly THROWS AWAY
 * every row older than the last two — the student watches three-quarters of
 * the table vanish.
 *
 * Then the catch: the backward pass that recovers the actual alignment needs
 * the whole table. The optimal path is drawn — and half of it runs straight
 * through the rows that were discarded. The value survives; the alignment is
 * gone. That gap is exactly what Hirschberg's algorithm exists to close.
 * Built for L16 on the shared GCTA / CTAG instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EDIT_X, EDIT_Y, buildEditTable, optimalSteps } from './alignment-instance'

const X = EDIT_X
const Y = EDIT_Y
const M = X.length
const N = Y.length
const TABLE = buildEditTable(X, Y)
const LAST = M + 1 // 0 = base, 1..M reveal a row, M+1 = the catch

/** cells visited by the optimal backward pass */
const PATH_CELLS = (() => {
  const set = new Set<string>(['0,0'])
  for (const s of optimalSteps(X, Y)) set.add(`${s.i1},${s.j1}`)
  return set
})()

export function TwoRowSweep() {
  const [step, setStep] = useState(0)
  const catchStep = step === LAST

  const { revealRow, liveRows } = useMemo(() => {
    const rr = Math.min(step, M)
    const live = step === 0 ? [0] : [rr - 1, rr]
    return { revealRow: rr, liveRows: live }
  }, [step])

  const cellState = (r: number): 'pending' | 'memory' | 'discarded' => {
    if (r > revealRow) return 'pending'
    return liveRows.includes(r) ? 'memory' : 'discarded'
  }

  const memoryCells = liveRows.length * (N + 1)
  const fullCells = (M + 1) * (N + 1)

  let note: string
  if (step === 0) {
    note =
      'Ξεκινάμε με τη γραμμή 0 (την «κενή» βάση). Σε κάθε βήμα θα γεμίζει μία νέα γραμμή — και θα κρατάμε μόνο όσες χρειάζονται.'
  } else if (step <= M) {
    note = `Γραμμή ${step}: για να την υπολογίσεις χρειάστηκες ΜΟΝΟ τη γραμμή ${step - 1}. Οι παλιότερες γραμμές δεν ξαναχρειάζονται — τις πετάμε. Στη μνήμη μένουν πάντα 2 γραμμές.`
  } else {
    note = `Η τιμή OPT(m, n) = ${TABLE[M][N]} βγήκε με μόλις 2 γραμμές: χώρος O(m + n) αντί για O(mn). ΟΜΩΣ — το βέλτιστο μονοπάτι (κόκκινο) περνά μέσα από γραμμές που πετάχτηκαν. Το πέρασμα προς τα πίσω τις χρειάζεται όλες. Την τιμή την έχουμε· την ευθυγράμμιση όχι.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γραμμικός χώρος — κράτα μόνο δύο γραμμές
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            catchStep ? 'bg-amber-500/15 text-amber-600' : 'bg-accent/10 text-accent',
          )}
        >
          {catchStep ? 'Η παγίδα' : `Στη μνήμη: ${memoryCells} κελιά`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Κάθε γραμμή εξαρτάται μόνο από την προηγούμενη — άρα δύο γραμμές αρκούν.
      </p>

      {/* memory meter */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-success/40 bg-success/10 px-3 py-2">
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Δύο γραμμές
          </div>
          <div className="font-mono text-sm font-bold text-fg">
            {memoryCells} κελιά · O(m+n)
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Ολόκληρος ο πίνακας
          </div>
          <div className="font-mono text-sm font-bold text-fg-muted">
            {fullCells} κελιά · O(mn)
          </div>
        </div>
      </div>

      {/* the grid */}
      <div className="overflow-x-auto">
        <div
          className="grid w-fit gap-px font-mono text-sm"
          style={{ gridTemplateColumns: `2.5rem repeat(${N + 1}, 2.5rem)` }}
        >
          {/* header */}
          <div />
          <div className="flex h-7 items-center justify-center text-xs font-semibold text-fg-subtle">
            ∅
          </div>
          {Y.split('').map((ch, j) => (
            <div
              key={`h${j}`}
              className="flex h-7 items-center justify-center text-sm font-bold text-fg"
            >
              {ch}
            </div>
          ))}
          {/* rows */}
          {TABLE.map((row, i) => {
            const state = cellState(i)
            const isCurrent = step >= 1 && step <= M && i === step
            return (
              <div key={i} className="contents">
                <div
                  className={cn(
                    'flex items-center justify-center text-sm font-bold',
                    state === 'discarded' ? 'text-fg-subtle/50' : 'text-fg',
                  )}
                >
                  {i === 0 ? '∅' : X[i - 1]}
                </div>
                {row.map((val, j) => {
                  const onPath = catchStep && PATH_CELLS.has(`${i},${j}`)
                  const pathLost = onPath && state === 'discarded'
                  return (
                    <div
                      key={j}
                      className={cn(
                        'flex h-9 items-center justify-center rounded border',
                        state === 'pending' &&
                          'border-dashed border-border text-transparent',
                        state === 'memory' &&
                          !onPath &&
                          !isCurrent &&
                          'border-border bg-bg-soft/50 text-fg',
                        state === 'memory' &&
                          !onPath &&
                          isCurrent &&
                          'border-accent bg-accent/20 font-bold text-fg',
                        state === 'discarded' &&
                          !onPath &&
                          'border-border/40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(148,148,165,0.16)_4px,rgba(148,148,165,0.16)_8px)] text-transparent',
                        onPath &&
                          !pathLost &&
                          'border-rose-500 bg-rose-500/25 font-bold text-fg',
                        pathLost && 'border-rose-500 border-dashed bg-rose-500/10',
                      )}
                    >
                      {state === 'discarded' ? (
                        pathLost ? (
                          <span className="text-rose-500/70">?</span>
                        ) : (
                          ''
                        )
                      ) : state === 'pending' ? (
                        '·'
                      ) : (
                        val
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {catchStep && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-rose-500 bg-rose-500/25" />
            μονοπάτι σε ζωντανή γραμμή
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-dashed border-rose-500 bg-rose-500/10" />
            μονοπάτι σε χαμένη γραμμή — δεν ανακτάται
          </span>
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[3.75rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          catchStep
            ? 'border-amber-500/50 bg-amber-500/10 text-fg'
            : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={catchStep}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {step < M ? 'Επόμενη γραμμή' : step === M ? 'Και τώρα η παγίδα' : 'Επόμενο'}
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
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
