'use client'

/**
 * WeightedIntervalDP — fill the OPT table for weighted interval scheduling.
 *
 * Each step computes M[j] = max{ vⱼ + M[p(j)], M[j−1] } — the "request j
 * in or out?" decision — lighting up the two candidate cells and the
 * interval p(j) it depends on. A final backtrack step reveals which
 * intervals the optimum actually uses.
 *
 * Two instances share the exact same UI:
 *  - 'lecture' (default, the L14 page) — the 8-request lecture example from
 *    interval-instance.ts. Used in PjExplorer / PjScan too, so the student
 *    builds one mental picture of these 8 intervals.
 *  - 'platform' (pt6-th2 — «πλατφόρμα δόνησης») — the tiny 3-request
 *    counterexample A=[0,10] vp=100, B=[0,5] vp=60, C=[6,10] vp=60. Greedy by
 *    descending price picks A and stops at 100; the DP finds B+C = 120.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REQS as LECTURE_REQS, N as LECTURE_N, T_MAX as LECTURE_T, P as LECTURE_P } from './interval-instance'
import type { Request } from './interval-instance'

type Instance = 'lecture' | 'platform'

type Bundle = {
  reqs: readonly Request[]
  n: number
  tMax: number
  /** p[0..n]: predecessor indices */
  P: readonly number[]
  /** label for each request, in display order */
  labelById: (id: number) => string
  /** intro line — what is the instance about? */
  intro: string
  /** badge text for the value (e.g. «αξία» or «συνδρομή p») */
  valueWord: string
  /** which integer ticks to show on the time axis */
  tickStep: number
}

const PLATFORM_REQS: readonly Request[] = [
  // ordered by finish time: B (0..5), A (0..10), C (6..10)
  { id: 1, s: 0, f: 5, v: 60 },   // B
  { id: 2, s: 0, f: 10, v: 100 }, // A
  { id: 3, s: 6, f: 10, v: 60 },  // C
]

function computeP(reqs: readonly Request[]): number[] {
  const n = reqs.length
  const p: number[] = [0]
  for (let j = 1; j <= n; j++) {
    let best = 0
    for (let i = 1; i < j; i++) {
      if (reqs[i - 1].f <= reqs[j - 1].s) best = i
    }
    p[j] = best
  }
  return p
}

const PLATFORM_P = computeP(PLATFORM_REQS)

const BUNDLES: Record<Instance, Bundle> = {
  lecture: {
    reqs: LECTURE_REQS,
    n: LECTURE_N,
    tMax: LECTURE_T,
    P: LECTURE_P,
    labelById: (id) => `${id}`,
    intro: 'Τα 8 αιτήματα του παραδείγματος, ταξινομημένα κατά χρόνο λήξης. M[0] = 0. Γεμίζουμε αριστερά → δεξιά.',
    valueWord: 'v',
    tickStep: 2,
  },
  platform: {
    reqs: PLATFORM_REQS,
    n: PLATFORM_REQS.length,
    tMax: 11,
    P: PLATFORM_P,
    labelById: (id) => (id === 1 ? 'B' : id === 2 ? 'A' : 'C'),
    intro:
      'Τρία αιτήματα ταξινομημένα κατά χρόνο λήξης: B=[0,5] p=60, A=[0,10] p=100, C=[6,10] p=60. Ο άπληστος «κατά συνδρομή» θα έδινε 100. Δες τι βρίσκει ο DP.',
    valueWord: 'p',
    tickStep: 1,
  },
}

interface Props {
  instance?: Instance
}

export function WeightedIntervalDP({ instance = 'lecture' }: Props) {
  const cfg = BUNDLES[instance]
  const { reqs: REQS, n: N, tMax: T_MAX, P, labelById, valueWord } = cfg

  // M and decisions are derived from the bundle.
  const { M, IN, SOLUTION } = (() => {
    const M: number[] = [0]
    const IN: boolean[] = [false]
    for (let j = 1; j <= N; j++) {
      const take = REQS[j - 1].v + M[P[j]]
      const skip = M[j - 1]
      M[j] = Math.max(take, skip)
      IN[j] = take > skip
    }
    const out: number[] = []
    let j = N
    while (j > 0) {
      if (IN[j]) {
        out.push(j)
        j = P[j]
      } else j -= 1
    }
    return { M, IN, SOLUTION: out.sort((a, b) => a - b) }
  })()

  const [step, setStep] = useState(0)
  const last = N + 1 // 0 intro, 1..N fill, N+1 backtrack

  const j = step >= 1 && step <= N ? step : 0
  const done = step === last
  const filledUpto = Math.min(step, N)

  const X = (t: number) => 56 + (t / T_MAX) * 560
  const rowY = (id: number) => 30 + (id - 1) * 26

  let note: string
  if (step === 0) {
    note = cfg.intro
  } else if (j > 0) {
    const r = REQS[j - 1]
    note =
      `M[${j}]: το αίτημα ${labelById(r.id)} (${valueWord} = ${r.v}) — μέσα ή έξω; ` +
      `ΜΕΣΑ: ${valueWord} + M[p(${j})] = ${r.v} + M[${P[j]}] = ${r.v + M[P[j]]}. ` +
      `ΕΞΩ: M[${j - 1}] = ${M[j - 1]}. ` +
      `Παίρνουμε το μεγαλύτερο → M[${j}] = ${M[j]}, άρα το ${labelById(r.id)} είναι ${IN[j] ? 'ΜΕΣΑ' : 'ΕΞΩ'}.`
  } else {
    const labels = SOLUTION.map((s) => labelById(REQS[s - 1].id)).join(', ')
    note =
      instance === 'platform'
        ? `Πέρασμα προς τα πίσω: βέλτιστο σύνολο {${labels}}, συνολική συνδρομή M[${N}] = ${M[N]}. Ο άπληστος «κατά συνδρομή» θα έδινε A = 100 — εδώ ο DP βρίσκει 120, νικώντας με δύο φθηνότερα ασύμβατα αιτήματα μαζί.`
        : `Πέρασμα προς τα πίσω: η βέλτιστη λύση είναι τα αιτήματα {${SOLUTION.join(', ')}}, με συνολική αξία M[${N}] = ${M[N]}.`
  }

  const solSet = new Set(done ? SOLUTION : [])

  // Compute viewBox height dynamically — rows are spaced by 26px starting at 30.
  const svgH = 30 + N * 26 + 40
  const tickN = Math.floor(T_MAX / cfg.tickStep) + 1

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          {instance === 'platform'
            ? 'Πλατφόρμα δόνησης — γέμισμα του πίνακα M'
            : 'Σταθμισμένος χρονοπρογραμματισμός — γέμισμα του πίνακα M'}
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
          viewBox={`0 0 640 ${svgH}`}
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
                  {labelById(r.id)} · {valueWord}={r.v}
                </text>
              </g>
            )
          })}
          <line x1={X(0)} y1={svgH - 20} x2={X(T_MAX)} y2={svgH - 20} stroke="#cdbfc0" strokeWidth={1.5} />
          {Array.from({ length: tickN }, (_, k) => k * cfg.tickStep).map((t) => (
            <text key={t} x={X(t)} y={svgH - 6} className="wi-tick">
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
              Το {labelById(REQS[j - 1].id)} ΜΕΣΑ
            </div>
            <div className="font-mono text-fg">
              {valueWord}{j} + M[{P[j]}] = {REQS[j - 1].v} + {M[P[j]]} ={' '}
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
              Το {labelById(REQS[j - 1].id)} ΕΞΩ
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
