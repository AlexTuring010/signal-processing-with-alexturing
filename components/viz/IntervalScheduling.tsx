'use client'

/**
 * IntervalScheduling — why only "earliest finish time" is optimal.
 *
 * L11's core lesson is that plausible greedy rules are usually wrong. This
 * viz runs the same interval-scheduling greedy under three sorting rules
 * on one fixed instance, stepping through pick/skip decisions. The verdict
 * line drives it home: earliest-start gets 3, shortest-interval gets 4,
 * earliest-finish gets 5 — the optimum. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Iv = { id: number; s: number; f: number }

/** Fixed instance — designed so the three rules give 3, 4 and 5. */
const IVS: Iv[] = [
  { id: 1, s: 0, f: 9 },
  { id: 2, s: 1, f: 3 },
  { id: 3, s: 3, f: 6 },
  { id: 4, s: 6, f: 9 },
  { id: 5, s: 8, f: 10 },
  { id: 6, s: 9, f: 12 },
  { id: 7, s: 12, f: 14 },
]
const OPTIMAL = 5
const T_MAX = 14

type Criterion = 'start' | 'short' | 'finish'
const CRITERIA: { key: Criterion; label: string }[] = [
  { key: 'start', label: 'Πρώτη έναρξη' },
  { key: 'short', label: 'Μικρότερο διάστημα' },
  { key: 'finish', label: 'Πρώτη λήξη' },
]

const overlap = (a: Iv, b: Iv) => a.s < b.f && b.s < a.f

type Decision = { iv: Iv; pick: boolean }

function runGreedy(order: Iv[]): Decision[] {
  const picked: Iv[] = []
  return order.map((iv) => {
    const ok = picked.every((p) => !overlap(p, iv))
    if (ok) picked.push(iv)
    return { iv, pick: ok }
  })
}

export function IntervalScheduling() {
  const [criterion, setCriterion] = useState<Criterion>('start')
  const [step, setStep] = useState(0)

  const decisions = useMemo<Decision[]>(() => {
    const by: Record<Criterion, (a: Iv, b: Iv) => number> = {
      start: (a, b) => a.s - b.s || a.id - b.id,
      short: (a, b) => a.f - a.s - (b.f - b.s) || a.id - b.id,
      finish: (a, b) => a.f - b.f || a.id - b.id,
    }
    return runGreedy([...IVS].sort(by[criterion]))
  }, [criterion])

  const last = decisions.length // 7
  const done = step === last
  const count = decisions.slice(0, step).filter((d) => d.pick).length

  /** order-index of each interval id under the current criterion */
  const orderIndex = new Map(decisions.map((d, i) => [d.iv.id, i]))

  const X = (t: number) => 48 + (t / T_MAX) * 540
  const rowY = (id: number) => 34 + (id - 1) * 30

  const cur = step > 0 ? decisions[step - 1] : null
  let note: string
  if (step === 0) {
    note = `Κριτήριο «${CRITERIA.find((c) => c.key === criterion)!.label}». Θα εξετάσουμε τα διαστήματα μ' αυτή τη σειρά και θα κρατάμε όποιο είναι συμβατό. Πάτα «Επόμενο».`
  } else {
    const d = cur as Decision
    note = `Διάστημα ${d.iv.id} [${d.iv.s}–${d.iv.f}]: ${
      d.pick
        ? 'συμβατό με όλα τα ήδη επιλεγμένα → ΕΠΙΛΕΓΕΤΑΙ.'
        : 'συγκρούεται με κάποιο ήδη επιλεγμένο → απορρίπτεται.'
    }`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + criterion toggle */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χρονοπρογραμματισμός — δοκίμασε τρία άπληστα κριτήρια
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {CRITERIA.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setCriterion(c.key)
                setStep(0)
              }}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                criterion === c.key
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* timeline canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 620 268"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .iv-bar { stroke-width: 2; }
            .iv-lbl { font: 700 12px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .iv-tick { font: 600 10px ui-sans-serif, system-ui; fill: #9b8a8d; text-anchor: middle; }
            .iv-ord { font: 600 10px ui-monospace, monospace; fill: #9b8a8d; text-anchor: end; }
          `}</style>

          {/* intervals */}
          {IVS.map((iv) => {
            const idx = orderIndex.get(iv.id) ?? 0
            const decided = idx < step
            const isCurrent = idx === step - 1
            const dec = decisions[idx]
            const picked = dec.pick
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            let textFill = '#1c1214'
            if (decided && picked) {
              fill = '#22c55e'
              stroke = '#15803d'
              textFill = '#ffffff'
            } else if (decided && !picked) {
              fill = '#f3eee9'
              stroke = '#cdbfc0'
              textFill = '#9b8a8d'
            }
            return (
              <g key={iv.id}>
                <rect
                  x={X(iv.s)}
                  y={rowY(iv.id)}
                  width={X(iv.f) - X(iv.s)}
                  height={22}
                  rx={4}
                  fill={fill}
                  stroke={isCurrent ? '#d97706' : stroke}
                  strokeWidth={isCurrent ? 3.5 : 2}
                  className="iv-bar"
                />
                <text
                  x={(X(iv.s) + X(iv.f)) / 2}
                  y={rowY(iv.id) + 11}
                  className="iv-lbl"
                  fill={textFill}
                >
                  {iv.id}
                </text>
                <text x={40} y={rowY(iv.id) + 11} className="iv-ord">
                  {idx + 1}.
                </text>
              </g>
            )
          })}

          {/* time axis */}
          <line x1={X(0)} y1={252} x2={X(T_MAX)} y2={252} stroke="#cdbfc0" strokeWidth={1.5} />
          {Array.from({ length: T_MAX + 1 }, (_, t) => (
            <g key={t}>
              <line x1={X(t)} y1={249} x2={X(t)} y2={255} stroke="#cdbfc0" strokeWidth={1} />
              <text x={X(t)} y={266} className="iv-tick">
                {t}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* count + verdict */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Επιλεγμένα
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">{count}</span>
        <span className="text-sm text-fg-muted">/ βέλτιστο: {OPTIMAL}</span>
        {done && (
          <span
            className={cn(
              'ml-auto rounded-md px-2 py-0.5 text-sm font-bold',
              count === OPTIMAL
                ? 'bg-success/15 text-success'
                : 'bg-danger/15 text-danger',
            )}
          >
            {count === OPTIMAL ? '✓ Βέλτιστο' : `✗ Χάνει ${OPTIMAL - count}`}
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
        {done && criterion !== 'finish' && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Αυτό το κριτήριο απέτυχε — δοκίμασε «Πρώτη λήξη».
            </span>
          </>
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
