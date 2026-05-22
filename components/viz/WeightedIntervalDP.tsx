'use client'

/**
 * WeightedIntervalDP — fill the OPT table for weighted interval scheduling.
 *
 * Each step computes M[j] = max{ vⱼ + M[p(j)], M[j−1] } — the "request j
 * in or out?" decision — lighting up the two candidate cells and the
 * interval p(j) it depends on. A final backtrack step reveals which
 * intervals the optimum actually uses. Built for L14, on the lecture's
 * own 8-request instance.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REQS, N, T_MAX, P } from './interval-instance'

/** M[j] = OPT for the first j requests, plus the in/out decision. */
const M: number[] = [0]
const IN: boolean[] = [false]
for (let j = 1; j <= N; j++) {
  const take = REQS[j - 1].v + M[P[j]]
  const skip = M[j - 1]
  M[j] = Math.max(take, skip)
  IN[j] = take > skip
}

/** backtrack from n to read off the chosen requests */
const SOLUTION: number[] = (() => {
  const out: number[] = []
  let j = N
  while (j > 0) {
    if (IN[j]) {
      out.push(j)
      j = P[j]
    } else j -= 1
  }
  return out.sort((a, b) => a - b)
})()

export function WeightedIntervalDP() {
  const [step, setStep] = useState(0)
  const last = N + 1 // 0 intro, 1..N fill, N+1 backtrack

  const j = step >= 1 && step <= N ? step : 0
  const done = step === last
  const filledUpto = Math.min(step, N) // M indices 0..filledUpto are known

  const X = (t: number) => 56 + (t / T_MAX) * 560
  const rowY = (id: number) => 30 + (id - 1) * 26

  let note: string
  if (step === 0) {
    note =
      'Τα αιτήματα ταξινομημένα κατά χρόνο λήξης. M[0] = 0. Θα γεμίσουμε τον πίνακα M από αριστερά προς τα δεξιά.'
  } else if (j > 0) {
    const r = REQS[j - 1]
    note =
      `M[${j}]: το αίτημα ${j} (αξία ${r.v}) — μέσα ή έξω; ` +
      `ΜΕΣΑ: vⱼ + M[p(${j})] = ${r.v} + M[${P[j]}] = ${r.v + M[P[j]]}. ` +
      `ΕΞΩ: M[${j - 1}] = ${M[j - 1]}. ` +
      `Παίρνουμε το μεγαλύτερο → M[${j}] = ${M[j]}, άρα το ${j} είναι ${IN[j] ? 'ΜΕΣΑ' : 'ΕΞΩ'}.`
  } else {
    note = `Πέρασμα προς τα πίσω: η βέλτιστη λύση είναι τα αιτήματα {${SOLUTION.join(', ')}}, με συνολική αξία M[${N}] = ${M[N]}.`
  }

  const solSet = new Set(done ? SOLUTION : [])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σταθμισμένος χρονοπρογραμματισμός — γέμισμα του πίνακα M
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${M[N]}` : step === 0 ? 'Αρχή' : `M[${j}]`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κίτρινο = το αίτημα j · μπλε = ο συμβατός προκάτοχος p(j) · πράσινο = στη λύση.
      </p>

      {/* intervals timeline */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 640 260"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .wi-lbl { font: 700 11px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .wi-tick { font: 600 10px ui-sans-serif, system-ui; fill: #9b8a8d; text-anchor: middle; }
          `}</style>
          {REQS.map((r) => {
            const isJ = r.id === j
            const isP = j > 0 && r.id === P[j] && P[j] !== 0
            const inSol = solSet.has(r.id)
            let fill = '#f3eee9'
            let stroke = '#9b8a8d'
            if (inSol) {
              fill = '#22c55e'
              stroke = '#15803d'
            } else if (isJ) {
              fill = '#fde68a'
              stroke = '#d97706'
            } else if (isP) {
              fill = '#bae6fd'
              stroke = '#0284c7'
            }
            return (
              <g key={r.id}>
                <rect
                  x={X(r.s)}
                  y={rowY(r.id)}
                  width={X(r.f) - X(r.s)}
                  height={18}
                  rx={3}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isJ ? 2.6 : 1.8}
                />
                <text
                  x={(X(r.s) + X(r.f)) / 2}
                  y={rowY(r.id) + 9}
                  className="wi-lbl"
                  fill="#1c1214"
                >
                  {r.id} · v={r.v}
                </text>
              </g>
            )
          })}
          <line x1={X(0)} y1={240} x2={X(T_MAX)} y2={240} stroke="#cdbfc0" strokeWidth={1.5} />
          {Array.from({ length: T_MAX / 2 + 1 }, (_, k) => k * 2).map((t) => (
            <text key={t} x={X(t)} y={254} className="wi-tick">
              {t}
            </text>
          ))}
        </svg>
      </div>

      {/* M table */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας M
        </div>
        <div className="flex gap-1">
          {M.map((val, idx) => {
            const known = idx <= filledUpto
            const isCur = idx === j
            const isCand = j > 0 && (idx === P[j] || idx === j - 1) && idx !== j
            return (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md border font-mono text-sm font-bold',
                    isCur && 'border-accent bg-accent/15 text-fg',
                    !isCur && isCand && 'border-sky-400 bg-sky-400/15 text-fg',
                    !isCur && !isCand && known && 'border-border bg-bg-soft text-fg',
                    !known && 'border-dashed border-border text-transparent',
                  )}
                >
                  {known ? val : '·'}
                </div>
                <span className="font-mono text-[10px] text-fg-subtle">M[{idx}]</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* candidate computation */}
      {j > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              IN[j] ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Το {j} ΜΕΣΑ
            </div>
            <div className="font-mono text-fg">
              v{j} + M[{P[j]}] = {REQS[j - 1].v} + {M[P[j]]} ={' '}
              <strong>{REQS[j - 1].v + M[P[j]]}</strong>
            </div>
          </div>
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              !IN[j] ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Το {j} ΕΞΩ
            </div>
            <div className="font-mono text-fg">
              M[{j - 1}] = <strong>{M[j - 1]}</strong>
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
