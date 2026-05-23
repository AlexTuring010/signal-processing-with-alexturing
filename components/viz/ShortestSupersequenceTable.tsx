'use client'

/**
 * ShortestSupersequenceTable — the SCS DP grid for the ΓΑΒ / ΜΙΑΟΥ dog-name
 * exercise (pt2-th3).
 *
 * Mirrors LcsTable visually but on the dual recurrence:
 *   OPT(i, 0) = i,  OPT(0, j) = j
 *   if s1[i] = s2[j]:           OPT(i, j) = 1 + OPT(i-1, j-1)       (diagonal)
 *   else:                       OPT(i, j) = 1 + min{ OPT(i-1, j),   (up = take s1[i])
 *                                                    OPT(i, j-1) }  (left = take s2[j])
 *
 * The «aha» moment the student has to walk away with: the traceback EMITS the
 * supersequence letter by letter, in reverse order. Each non-match step picks
 * one string's last char and decrements only THAT string's index; matches
 * emit one shared char and decrement both. The viz shows the SCS string
 * growing letter-by-letter on the final passes.
 *
 * Built for L15 problem pt2-th3.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const X = 'ΓΑΒ'
const Y = 'ΜΙΑΟΥ'
const M_LEN = X.length // 3 rows
const N_LEN = Y.length // 5 cols

type Move = 'diag' | 'up' | 'left'
type PathCell = { i: number; j: number; move: Move; ch: string; from: 'x' | 'y' | 'both' }

export function ShortestSupersequenceTable() {
  /** full DP table */
  const M = useMemo(() => {
    const t: number[][] = []
    for (let i = 0; i <= M_LEN; i++) {
      t.push([])
      for (let j = 0; j <= N_LEN; j++) {
        if (i === 0) t[i][j] = j
        else if (j === 0) t[i][j] = i
        else if (X[i - 1] === Y[j - 1]) t[i][j] = 1 + t[i - 1][j - 1]
        else t[i][j] = 1 + Math.min(t[i - 1][j], t[i][j - 1])
      }
    }
    return t
  }, [])

  /**
   * Traceback from (m, n) to (0, 0).
   *   match → emit shared char, go diagonally
   *   non-match → emit one string's char; tie-break: prefer-left (the «smaller»
   *               OPT cell, else the left one) so the final string is ΓΜΙΑΒΟΥ —
   *               one of the canonical examples from the prompt.
   *   boundary → walk down the column / across the row emitting whatever's left.
   */
  const path = useMemo<PathCell[]>(() => {
    const cells: PathCell[] = []
    let i = M_LEN
    let j = N_LEN
    while (i > 0 || j > 0) {
      if (i === 0) {
        cells.push({ i, j, move: 'left', ch: Y[j - 1], from: 'y' })
        j -= 1
        continue
      }
      if (j === 0) {
        cells.push({ i, j, move: 'up', ch: X[i - 1], from: 'x' })
        i -= 1
        continue
      }
      if (X[i - 1] === Y[j - 1]) {
        cells.push({ i, j, move: 'diag', ch: X[i - 1], from: 'both' })
        i -= 1
        j -= 1
      } else if (M[i - 1][j] < M[i][j - 1]) {
        cells.push({ i, j, move: 'up', ch: X[i - 1], from: 'x' })
        i -= 1
      } else {
        // strict «<» on left OR tie → prefer left (emit y's char)
        cells.push({ i, j, move: 'left', ch: Y[j - 1], from: 'y' })
        j -= 1
      }
    }
    return cells
  }, [M])

  const scs = useMemo(
    () => path.map((c) => c.ch).reverse().join(''),
    [path],
  )

  // steps: 0 = base · 1..M_LEN = reveal row i · M_LEN + 1 .. M_LEN + path.length = traceback emit
  const last = M_LEN + path.length
  const [step, setStep] = useState(0)
  const done = step === last

  const focusRow = step >= 1 && step <= M_LEN ? step : 0
  const tbCount = Math.max(0, step - M_LEN)
  const shownPath = path.slice(0, tbCount)
  const pathSet = new Map(shownPath.map((c) => [`${c.i},${c.j}`, c]))
  const curPathCell = tbCount > 0 ? path[tbCount - 1] : null
  const built = shownPath.map((c) => c.ch).reverse().join('')

  const revealed = (r: number, c: number) =>
    r === 0 || c === 0 || r <= Math.min(step, M_LEN)

  // focus-cell decomposition during row-reveal
  const fi = focusRow
  const fj = N_LEN
  const fMatch = focusRow > 0 && X[fi - 1] === Y[fj - 1]

  let note: string
  if (step === 0) {
    note =
      'Βάση: η γραμμή 0 είναι (0, 1, 2, …, n) — αν η μία πλευρά είναι κενή, η υπερακολουθία είναι ολόκληρη η άλλη. Ίδια λογική για τη στήλη 0. Πάτα «Επόμενο».'
  } else if (focusRow > 0) {
    const v = M[fi][fj]
    note = fMatch
      ? `Γραμμή ${fi} — χαρακτήρας «${X[fi - 1]}». Στο κελί M[${fi}][${fj}]: s₁[${fi}] = s₂[${fj}] = «${X[fi - 1]}» → ένα γράμμα εξυπηρετεί και τους δύο: 1 + διαγώνιο = 1 + ${M[fi - 1][fj - 1]} = ${v}.`
      : `Γραμμή ${fi} — «${X[fi - 1]}». Στο κελί M[${fi}][${fj}]: «${X[fi - 1]}» ≠ «${Y[fj - 1]}» → δύο διαφορετικά γράμματα, διάλεξε το ένα. 1 + min(πάνω ${M[fi - 1][fj]}, αριστερά ${M[fi][fj - 1]}) = ${v}.`
  } else {
    const t = tbCount
    if (t === path.length) {
      note = `Φτάσαμε στην αρχή (0, 0) — τέλος. Η συντομότερη κοινή υπερακολουθία είναι «${scs}», μήκος ${scs.length}.`
    } else {
      const c = path[t - 1]
      const lead = t === 1 ? 'Ξεκινάμε από το κάτω-δεξιά κελί. ' : ''
      if (c.move === 'diag') {
        note = `${lead}Κελί (${c.i}, ${c.j}): s₁[${c.i}] = s₂[${c.j}] = «${c.ch}». Ένα γράμμα εξυπηρετεί και τους δύο — εκπέμπει «${c.ch}», συνεχίζει διαγώνια.`
      } else if (c.move === 'up') {
        note =
          c.i === 0 || c.j === 0
            ? `${lead}Κελί (${c.i}, ${c.j}): φτάσαμε στο όριο — εκπέμπει ό,τι μένει από το s₁: «${c.ch}».`
            : `${lead}Κελί (${c.i}, ${c.j}): δεν ταιριάζουν. Το «πάνω» (${M[c.i - 1][c.j]}) ≤ το «αριστερά» (${M[c.i][c.j - 1]}) → πάμε πάνω και εκπέμπουμε s₁[${c.i}] = «${c.ch}».`
      } else {
        note =
          c.i === 0 || c.j === 0
            ? `${lead}Κελί (${c.i}, ${c.j}): φτάσαμε στο όριο — εκπέμπει ό,τι μένει από το s₂: «${c.ch}».`
            : `${lead}Κελί (${c.i}, ${c.j}): δεν ταιριάζουν. Το «αριστερά» (${M[c.i][c.j - 1]}) ≤ το «πάνω» (${M[c.i - 1][c.j]}) → πάμε αριστερά και εκπέμπουμε s₂[${c.j}] = «${c.ch}».`
      }
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Συντομότερη κοινή υπερακολουθία — γέμισμα + ανακατασκευή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {tbCount > 0 ? `SCS = ${M[M_LEN][N_LEN]}` : `s₁=${X} · s₂=${Y}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Πράσινο κελί = τα γράμματα ταιριάζουν (διαγώνιο · ένα γράμμα αρκεί)·
        αλλιώς, 1 + min από «πάνω»/«αριστερά» — εκπέμπει το γράμμα μόνο της
        μιας πλευράς.
      </p>

      {/* grid */}
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
                        pCell.move === 'diag' &&
                        'border-emerald-500 bg-emerald-500/30 font-bold text-fg',
                      pCell &&
                        pCell.move !== 'diag' &&
                        'border-violet-500 bg-violet-500/20 font-bold text-fg',
                      isCur && 'ring-2 ring-accent',
                    )}
                  >
                    {show ? val : '·'}
                    {pCell && (
                      <span
                        className={cn(
                          'absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-bold text-white',
                          pCell.move === 'diag'
                            ? 'bg-emerald-500'
                            : 'bg-violet-500',
                        )}
                      >
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
              Ταίριασμα s₁[{fi}] = s₂[{fj}] = «{X[fi - 1]}»
            </div>
            <div className="font-mono text-fg">
              1 + M[{fi - 1}][{fj - 1}] = 1 + {M[fi - 1][fj - 1]} ={' '}
              <strong>{M[fi][fj]}</strong>
            </div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Πάνω (κρατάς s₁[i])', val: M[fi - 1][fj] },
              { label: 'Αριστερά (κρατάς s₂[j])', val: M[fi][fj - 1] },
            ].map((c) => (
              <div
                key={c.label}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm',
                  1 + c.val === M[fi][fj]
                    ? 'border-success/50 bg-success/10'
                    : 'border-border bg-bg-soft/50',
                )}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  {c.label}
                </div>
                <div className="font-mono text-fg">
                  1 + <strong>{c.val}</strong> = {1 + c.val}
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* built supersequence (traceback) */}
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
            SCS{done ? '' : ' (χτίζεται από το τέλος προς την αρχή)'}:{' '}
          </span>
          <span className="font-mono text-lg font-bold tracking-[0.25em] text-fg">
            {built || '…'}
          </span>
          {done && (
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Περιέχει s₁ = «{X}» ως υπακολουθία (το «Α» κάνει «διπλή δουλειά») και
              s₂ = «{Y}» ως υπακολουθία. Μήκος {scs.length} = |s₁| + |s₂| −
              |LCS(s₁, s₂)| = {M_LEN} + {N_LEN} − 1.
            </p>
          )}
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
              : 'Επόμενο γράμμα'}
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
