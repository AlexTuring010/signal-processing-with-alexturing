'use client'

/**
 * LcsTable — fill the longest-common-subsequence DP grid, then trace the
 * actual subsequence back out of it.
 *
 * The lesson L15 must land: every cell M[i][j] is decided by comparing the
 * two last characters xᵢ and yⱼ. If they MATCH, the cell takes the diagonal
 * plus one (a letter of the LCS); if they DON'T, it takes the max of «up» and
 * «left». Each row-step reveals a row and spotlights M[i][n] with its source
 * cells. The traceback then walks back from M[m][n], lighting the matched
 * cells green and assembling the recovered subsequence — «BCB» — letter by
 * letter. Built for L15 on the lecture's own ABCB / BDCAB instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const X = 'ABCB'
const Y = 'BDCAB'
const M_LEN = X.length // 4 rows
const N_LEN = Y.length // 5 cols

type PathCell = { i: number; j: number; match: boolean; ch: string }

export function LcsTable() {
  /** full DP table */
  const M = useMemo(() => {
    const t: number[][] = []
    for (let i = 0; i <= M_LEN; i++) {
      t.push([])
      for (let j = 0; j <= N_LEN; j++) {
        if (i === 0 || j === 0) t[i][j] = 0
        else if (X[i - 1] === Y[j - 1]) t[i][j] = 1 + t[i - 1][j - 1]
        else t[i][j] = Math.max(t[i - 1][j], t[i][j - 1])
      }
    }
    return t
  }, [])

  /** traceback from (m, n) toward the empty prefix, preferring the diagonal */
  const path = useMemo<PathCell[]>(() => {
    const cells: PathCell[] = []
    let i = M_LEN
    let j = N_LEN
    while (i > 0 && j > 0) {
      if (X[i - 1] === Y[j - 1]) {
        cells.push({ i, j, match: true, ch: X[i - 1] })
        i -= 1
        j -= 1
      } else {
        cells.push({ i, j, match: false, ch: '' })
        if (M[i - 1][j] >= M[i][j - 1]) i -= 1
        else j -= 1
      }
    }
    cells.push({ i, j, match: false, ch: '' })
    return cells
  }, [M])

  const lcs = useMemo(
    () => path.filter((c) => c.match).map((c) => c.ch).reverse().join(''),
    [path],
  )

  const last = M_LEN + path.length
  const [step, setStep] = useState(0)
  const done = step === last

  // step 0 = base · 1..M_LEN = reveal row · M_LEN+1.. = traceback
  const focusRow = step >= 1 && step <= M_LEN ? step : 0
  const tbCount = Math.max(0, step - M_LEN)
  const shownPath = path.slice(0, tbCount)
  const pathSet = new Map(shownPath.map((c) => [`${c.i},${c.j}`, c]))
  const curPathCell = tbCount > 0 ? path[tbCount - 1] : null

  const recovered = shownPath
    .filter((c) => c.match)
    .map((c) => c.ch)
    .reverse()
    .join('')

  const revealed = (r: number, c: number) =>
    r === 0 || c === 0 || r <= Math.min(step, M_LEN)

  // focus-cell decomposition (during row-reveal)
  const fi = focusRow
  const fj = N_LEN
  const fMatch = focusRow > 0 && X[fi - 1] === Y[fj - 1]

  let note: string
  if (step === 0) {
    note =
      'Η γραμμή 0 και η στήλη 0 είναι το «κενό προθέμα»: μήκος κοινής υπακολουθίας 0. Πάτα «Επόμενο».'
  } else if (focusRow > 0) {
    const v = M[fi][fj]
    note = fMatch
      ? `Γραμμή ${fi} — χαρακτήρας «${X[fi - 1]}». Στο κελί M[${fi}][${fj}]: x${fi} = y${fj} = «${X[fi - 1]}» → ζευγάρωμα: 1 + διαγώνιο = 1 + ${M[fi - 1][fj - 1]} = ${v}.`
      : `Γραμμή ${fi} — «${X[fi - 1]}». Στο κελί M[${fi}][${fj}]: «${X[fi - 1]}» ≠ «${Y[fj - 1]}» → max(πάνω ${M[fi - 1][fj]}, αριστερά ${M[fi][fj - 1]}) = ${v}.`
  } else {
    const t = tbCount
    if (t === path.length) {
      note = `Φτάσαμε στο κενό προθέμα — τέλος. Η μέγιστη κοινή υπακολουθία είναι «${lcs}», μήκος ${lcs.length}.`
    } else {
      const c = path[t - 1]
      const lead = t === 1 ? 'Ξεκινάμε από το κάτω-δεξιά κελί. ' : ''
      note = c.match
        ? `${lead}Κελί (${c.i}, ${c.j}): x${c.i} = y${c.j} = «${c.ch}» → ταίριασμα. Το «${c.ch}» είναι γράμμα της LCS· συνεχίζουμε διαγώνια.`
        : `${lead}Κελί (${c.i}, ${c.j}): δεν προήλθε από ταίριασμα — ακολουθούμε το μεγαλύτερο γειτονικό κελί («πάνω» ή «αριστερά»).`
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          LCS — γέμισμα του πίνακα και πέρασμα προς τα πίσω
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {tbCount > 0 ? `LCS = ${M[M_LEN][N_LEN]}` : `x=${X} · y=${Y}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Πράσινο κελί = τα γράμματα ταιριάζουν (διαγώνιο +1)· αλλιώς, το max από
        «πάνω»/«αριστερά».
      </p>

      {/* the grid */}
      <div className="overflow-x-auto">
        <div
          className="grid w-fit gap-px font-mono text-sm"
          style={{ gridTemplateColumns: `2.5rem repeat(${N_LEN + 1}, 2.5rem)` }}
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
          {M.map((rowVals, i) => (
            <div key={i} className="contents">
              <div className="flex items-center justify-center text-sm font-bold text-fg">
                {i === 0 ? '∅' : X[i - 1]}
              </div>
              {rowVals.map((val, j) => {
                const show = revealed(i, j)
                const key = `${i},${j}`
                const pCell = pathSet.get(key)
                const onPath = !!pCell
                const isCur =
                  curPathCell && curPathCell.i === i && curPathCell.j === j
                const isFocus = focusRow > 0 && i === fi && j === fj
                const isSrc =
                  focusRow > 0 &&
                  !isFocus &&
                  ((fMatch && i === fi - 1 && j === fj - 1) ||
                    (!fMatch &&
                      ((i === fi - 1 && j === fj) ||
                        (i === fi && j === fj - 1))))
                const matchCell =
                  i >= 1 && j >= 1 && X[i - 1] === Y[j - 1]
                return (
                  <div
                    key={j}
                    className={cn(
                      'relative flex h-10 items-center justify-center rounded border',
                      !show && 'border-dashed border-border text-transparent',
                      show &&
                        !isFocus &&
                        !isSrc &&
                        !onPath &&
                        matchCell &&
                        'border-emerald-500/40 bg-emerald-500/10 text-fg',
                      show &&
                        !isFocus &&
                        !isSrc &&
                        !onPath &&
                        !matchCell &&
                        'border-border bg-bg-soft/50 text-fg',
                      isSrc && 'border-sky-400 bg-sky-400/20 font-bold text-fg',
                      isFocus && 'border-accent bg-accent/25 font-bold text-fg',
                      pCell &&
                        pCell.match &&
                        'border-emerald-500 bg-emerald-500/30 font-bold text-fg',
                      pCell &&
                        !pCell.match &&
                        'border-rose-500 bg-rose-500/15 font-bold text-fg',
                      isCur && 'ring-2 ring-accent',
                    )}
                  >
                    {show ? val : '·'}
                    {pCell && pCell.match && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[0.6rem] font-bold text-white">
                        {pCell.ch}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* focus-cell decision (row-reveal) */}
      {focusRow > 0 &&
        (fMatch ? (
          <div className="mt-3 rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Ταίριασμα x{fi} = y{fj} = «{X[fi - 1]}»
            </div>
            <div className="font-mono text-fg">
              1 + M[{fi - 1}][{fj - 1}] = 1 + {M[fi - 1][fj - 1]} ={' '}
              <strong>{M[fi][fj]}</strong>
            </div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Πάνω', val: M[fi - 1][fj] },
              { label: 'Αριστερά', val: M[fi][fj - 1] },
            ].map((c) => (
              <div
                key={c.label}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm',
                  c.val === M[fi][fj]
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
        ))}

      {/* recovered subsequence (traceback) */}
      {tbCount > 0 && (
        <div
          className={cn(
            'mt-3 rounded-lg border px-3 py-2 text-center',
            done
              ? 'border-success/50 bg-success/10'
              : 'border-border bg-bg-soft/40',
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            LCS{done ? '' : ' (χτίζεται από το τέλος)'}:{' '}
          </span>
          <span className="font-mono text-lg font-bold tracking-[0.25em] text-fg">
            {recovered || '…'}
          </span>
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
          {step < M_LEN
            ? 'Επόμενη γραμμή'
            : step === M_LEN
              ? 'Πέρασμα προς τα πίσω'
              : 'Επόμενο'}
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
