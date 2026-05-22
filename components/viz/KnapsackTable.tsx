'use client'

/**
 * KnapsackTable — fill the 0/1-knapsack DP table, one row per step.
 *
 * The thing L15 must teach: each cell M[i][w] depends on exactly two
 * cells of the row above — M[i−1][w] (item i out) and M[i−1][w−wᵢ]
 * (item i in). Each step reveals a row and spotlights cell M[i][W],
 * lighting its two source cells and showing the max{…} decision. The
 * last step backtracks to the chosen items. Built for L15, on the
 * lecture's own 4-item instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  KNAPSACK_ITEMS as ITEMS,
  KNAPSACK_CAP as CAP,
  KNAPSACK_N as N,
} from './knapsack-instance'

export function KnapsackTable() {
  const [step, setStep] = useState(0) // 0 = row 0 only, i = rows 0..i revealed
  const last = N

  /** full DP table M[0..N][0..CAP] */
  const M = useMemo(() => {
    const t: number[][] = [Array(CAP + 1).fill(0)]
    for (let i = 1; i <= N; i++) {
      const row: number[] = []
      for (let w = 0; w <= CAP; w++) {
        const it = ITEMS[i - 1]
        row[w] =
          it.w > w
            ? t[i - 1][w]
            : Math.max(t[i - 1][w], it.v + t[i - 1][w - it.w])
      }
      t.push(row)
    }
    return t
  }, [])

  /** which items the optimum uses (backtrack from M[N][CAP]) */
  const solution = useMemo(() => {
    const chosen = new Set<number>()
    let w = CAP
    for (let i = N; i >= 1; i--) {
      if (M[i][w] !== M[i - 1][w]) {
        chosen.add(i)
        w -= ITEMS[i - 1].w
      }
    }
    return chosen
  }, [M])

  const done = step === last
  const focusRow = step // the row revealed this step (0 = none meaningful)
  const it = step >= 1 ? ITEMS[step - 1] : null
  // focus cell M[step][CAP]; its two sources in row step-1
  const srcAbove = step >= 1 ? { r: step - 1, c: CAP } : null
  const srcDiag =
    step >= 1 && it && it.w <= CAP ? { r: step - 1, c: CAP - it.w } : null

  let note: string
  if (step === 0) {
    note =
      'Η γραμμή 0 — μηδέν αντικείμενα — είναι όλο μηδενικά. Κάθε επόμενη γραμμή προσθέτει ένα αντικείμενο. Πάτα «Επόμενο».'
  } else {
    const i = step
    const outVal = M[i - 1][CAP]
    const inVal = it!.v + M[i - 1][CAP - it!.w]
    note =
      `Γραμμή ${i} — αντικείμενο ${i} (βάρος ${it!.w}, αξία ${it!.v}). ` +
      `Για το κελί M[${i}][${CAP}]: αν το ${i} είναι ΕΞΩ → M[${i - 1}][${CAP}] = ${outVal}· ` +
      `αν είναι ΜΕΣΑ → ${it!.v} + M[${i - 1}][${CAP - it!.w}] = ${inVal}. ` +
      `M[${i}][${CAP}] = max = ${M[i][CAP]}.` +
      (done
        ? ` Τέλος: η βέλτιστη αξία είναι ${M[N][CAP]}, με τα αντικείμενα {${[...solution].sort((a, b) => a - b).join(', ')}}.`
        : '')
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σακίδιο — γέμισμα του πίνακα M, γραμμή-γραμμή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${M[N][CAP]}` : `Χωρητικότητα W = ${CAP}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Αντικείμενα (βάρος, αξία):{' '}
        {ITEMS.map((x, i) => `${i + 1}:(${x.w},${x.v})`).join('  ·  ')}
      </p>

      {/* the table */}
      <div className="overflow-x-auto">
        <div
          className="grid w-fit gap-px font-mono text-sm"
          style={{ gridTemplateColumns: `4.75rem repeat(${CAP + 1}, 2.25rem)` }}
        >
          {/* header row */}
          <div className="flex items-center px-1 text-xs font-semibold text-fg-subtle">
            i \ w
          </div>
          {Array.from({ length: CAP + 1 }, (_, w) => (
            <div
              key={`h${w}`}
              className="flex h-7 items-center justify-center text-xs font-semibold text-fg-subtle"
            >
              {w}
            </div>
          ))}
          {/* data rows */}
          {M.map((row, i) => {
            const revealed = i <= step
            return (
              <div key={i} className="contents">
                <div className="flex items-center whitespace-nowrap px-1 text-xs font-semibold text-fg-subtle">
                  {i === 0 ? '0 · ∅' : `${i} · (${ITEMS[i - 1].w},${ITEMS[i - 1].v})`}
                </div>
                {row.map((val, w) => {
                  const isFocus = i === focusRow && w === CAP && step >= 1
                  const isSrc =
                    (srcAbove && srcAbove.r === i && srcAbove.c === w) ||
                    (srcDiag && srcDiag.r === i && srcDiag.c === w)
                  return (
                    <div
                      key={w}
                      className={cn(
                        'flex h-9 items-center justify-center rounded border',
                        !revealed && 'border-dashed border-border text-transparent',
                        revealed &&
                          !isFocus &&
                          !isSrc &&
                          'border-border bg-bg-soft/50 text-fg',
                        isSrc && 'border-sky-400 bg-sky-400/20 font-bold text-fg',
                        isFocus && 'border-accent bg-accent/20 font-bold text-fg',
                      )}
                    >
                      {revealed ? val : '·'}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* focus computation */}
      {step >= 1 && it && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              M[step][CAP] === M[step - 1][CAP]
                ? 'border-success/50 bg-success/10'
                : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Αντικείμενο {step} ΕΞΩ
            </div>
            <div className="font-mono text-fg">
              M[{step - 1}][{CAP}] = <strong>{M[step - 1][CAP]}</strong>
            </div>
          </div>
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              M[step][CAP] !== M[step - 1][CAP]
                ? 'border-success/50 bg-success/10'
                : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Αντικείμενο {step} ΜΕΣΑ
            </div>
            <div className="font-mono text-fg">
              {it.v} + M[{step - 1}][{CAP - it.w}] ={' '}
              <strong>{it.v + M[step - 1][CAP - it.w]}</strong>
            </div>
          </div>
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
          Επόμενη γραμμή
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
          Γραμμή {step} / {last}
        </span>
      </div>
    </section>
  )
}
