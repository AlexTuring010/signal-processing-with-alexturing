'use client'

/**
 * IntervalScheduling — four plausible greedy rules, and which one survives.
 *
 * L11's core lesson: most "reasonable" greedy criteria are wrong, and a
 * single counterexample is enough to kill a rule. Each tab is one criterion
 * paired with its OWN purpose-built instance. The three wrong rules each run
 * on a minimal counterexample where they visibly underperform; "earliest
 * finish time" runs on a rich instance and lands exactly on the optimum.
 * Step through the pick/skip decisions and watch the verdict. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Iv = { id: number; s: number; f: number }
type Criterion = 'start' | 'short' | 'fewest' | 'finish'

const overlap = (a: Iv, b: Iv) => a.s < b.f && b.s < a.f

type Scenario = {
  label: string
  /** what this rule examines first */
  rule: string
  ivs: Iv[]
  tMax: number
  optimum: number
  /** true only for the rule that actually works */
  correct: boolean
  intro: string
}

const SCENARIOS: Record<Criterion, Scenario> = {
  start: {
    label: 'Πρώτη έναρξη',
    rule: 'αύξουσα σειρά χρόνου έναρξης',
    ivs: [
      { id: 1, s: 0, f: 20 },
      { id: 2, s: 1, f: 6 },
      { id: 3, s: 6, f: 11 },
      { id: 4, s: 11, f: 16 },
      { id: 5, s: 16, f: 21 },
    ],
    tMax: 21,
    optimum: 4,
    correct: false,
    intro:
      'Κανόνας «πρώτη έναρξη»: εξέτασε τις εργασίες κατά αύξοντα χρόνο έναρξης. Η εργασία 1 ξεκινά πρώτη — δες τι κάνει αυτό.',
  },
  short: {
    label: 'Μικρότερο διάστημα',
    rule: 'αύξουσα σειρά διάρκειας',
    ivs: [
      { id: 1, s: 0, f: 11 },
      { id: 2, s: 10, f: 13 },
      { id: 3, s: 12, f: 24 },
    ],
    tMax: 24,
    optimum: 2,
    correct: false,
    intro:
      'Κανόνας «μικρότερο διάστημα»: εξέτασε πρώτα τη συντομότερη εργασία. Εδώ η συντομότερη είναι η 2 — και κάθεται ακριβώς ανάμεσα στις άλλες δύο.',
  },
  fewest: {
    label: 'Λιγότερες διενέξεις',
    rule: 'αύξουσα σειρά πλήθους συγκρούσεων',
    ivs: [
      { id: 1, s: 0, f: 12 },
      { id: 2, s: 12, f: 24 },
      { id: 3, s: 24, f: 36 },
      { id: 4, s: 36, f: 48 },
      { id: 5, s: 8, f: 15 },
      { id: 6, s: 9, f: 16 },
      { id: 7, s: 20, f: 28 },
      { id: 8, s: 21, f: 29 },
      { id: 9, s: 32, f: 40 },
      { id: 10, s: 33, f: 41 },
    ],
    tMax: 48,
    optimum: 4,
    correct: false,
    intro:
      'Κανόνας «λιγότερες διενέξεις»: για κάθε εργασία μέτρα με πόσες άλλες συγκρούεται, και εξέτασε πρώτα όποια έχει τις λιγότερες. Οι εργασίες 1–4 (η πάνω σειρά) είναι η βέλτιστη λύση.',
  },
  finish: {
    label: 'Πρώτη λήξη',
    rule: 'αύξουσα σειρά χρόνου λήξης',
    ivs: [
      { id: 1, s: 0, f: 9 },
      { id: 2, s: 1, f: 3 },
      { id: 3, s: 3, f: 6 },
      { id: 4, s: 6, f: 9 },
      { id: 5, s: 8, f: 10 },
      { id: 6, s: 9, f: 12 },
      { id: 7, s: 12, f: 14 },
    ],
    tMax: 14,
    optimum: 5,
    correct: true,
    intro:
      'Κανόνας «πρώτη λήξη»: εξέτασε τις εργασίες κατά αύξοντα χρόνο λήξης. Η εργασία 1 είναι μεγάλη και δελεαστική — δες αν ο κανόνας την αποφεύγει.',
  },
}

const CRITERIA: Criterion[] = ['start', 'short', 'fewest', 'finish']

/** number of other intervals each interval conflicts with */
function conflictCounts(ivs: Iv[]): Map<number, number> {
  const m = new Map<number, number>()
  for (const a of ivs) {
    let k = 0
    for (const b of ivs) if (a.id !== b.id && overlap(a, b)) k++
    m.set(a.id, k)
  }
  return m
}

type Decision = { iv: Iv; pick: boolean }

/** run the greedy under one criterion; one Decision per interval, in sweep order */
function runGreedy(crit: Criterion, sc: Scenario): Decision[] {
  const cc = crit === 'fewest' ? conflictCounts(sc.ivs) : null
  const cmp: Record<Criterion, (a: Iv, b: Iv) => number> = {
    start: (a, b) => a.s - b.s || a.id - b.id,
    short: (a, b) => a.f - a.s - (b.f - b.s) || a.id - b.id,
    fewest: (a, b) => cc!.get(a.id)! - cc!.get(b.id)! || a.id - b.id,
    finish: (a, b) => a.f - b.f || a.id - b.id,
  }
  const order = [...sc.ivs].sort(cmp[crit])
  const picked: Iv[] = []
  return order.map((iv) => {
    const ok = picked.every((p) => !overlap(p, iv))
    if (ok) picked.push(iv)
    return { iv, pick: ok }
  })
}

const PAD_L = 40
const VIEW_W = 640
const PLOT_W = VIEW_W - PAD_L - 22
const ROW_H = 30
const TOP = 14
const AXIS_H = 34

export function IntervalScheduling() {
  const [criterion, setCriterion] = useState<Criterion>('start')
  const [step, setStep] = useState(0)

  const sc = SCENARIOS[criterion]
  const decisions = useMemo(() => runGreedy(criterion, sc), [criterion, sc])
  const last = decisions.length
  const done = step === last
  const count = decisions.slice(0, step).filter((d) => d.pick).length

  function pick(c: Criterion) {
    setCriterion(c)
    setStep(0)
  }

  const X = (t: number) => PAD_L + (t / sc.tMax) * PLOT_W
  const rows = decisions.length
  const VIEW_H = TOP + rows * ROW_H + AXIS_H
  const cur = step > 0 ? decisions[step - 1] : null

  let note: string
  if (step === 0) {
    note = sc.intro + ' Πάτα «Επόμενο».'
  } else {
    const d = cur as Decision
    note = `Εργασία ${d.iv.id} [${d.iv.s}–${d.iv.f}]: ${
      d.pick
        ? 'συμβατή με όλες τις ήδη επιλεγμένες → ΕΠΙΛΕΓΕΤΑΙ.'
        : 'συγκρούεται με κάποια ήδη επιλεγμένη → απορρίπτεται.'
    }`
  }
  const success = count === sc.optimum

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + criterion tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χρονοπρογραμματισμός — τέσσερα άπληστα κριτήρια
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {CRITERIA.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pick(c)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                criterion === c
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {SCENARIOS[c].label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Εξέταση με σειρά: {sc.rule}. Ο αριθμός αριστερά από κάθε γραμμή είναι η
        σειρά εξέτασης.
      </p>

      {/* timeline canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .is-bar { stroke-width: 2; }
            .is-lbl { font: 700 12px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .is-ord { font: 600 11px ui-monospace, monospace; fill: #9b8a8d; text-anchor: end; }
            .is-tick { font: 600 10px ui-sans-serif, system-ui; fill: #9b8a8d; text-anchor: middle; }
          `}</style>

          {decisions.map((d, i) => {
            const y = TOP + i * ROW_H
            const decided = i < step
            const isCurrent = i === step - 1
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            let textFill = '#1c1214'
            if (decided && d.pick) {
              fill = '#22c55e'
              stroke = '#15803d'
              textFill = '#ffffff'
            } else if (decided) {
              fill = '#f3eee9'
              stroke = '#cdbfc0'
              textFill = '#9b8a8d'
            }
            return (
              <g key={d.iv.id}>
                <text x={PAD_L - 8} y={y + 12} className="is-ord">
                  {i + 1}.
                </text>
                <rect
                  x={X(d.iv.s)}
                  y={y}
                  width={Math.max(X(d.iv.f) - X(d.iv.s), 3)}
                  height={22}
                  rx={4}
                  fill={fill}
                  stroke={isCurrent ? '#d97706' : stroke}
                  strokeWidth={isCurrent ? 3.5 : 2}
                  className="is-bar"
                />
                <text
                  x={(X(d.iv.s) + X(d.iv.f)) / 2}
                  y={y + 12}
                  className="is-lbl"
                  fill={textFill}
                >
                  {d.iv.id}
                </text>
              </g>
            )
          })}

          {/* time axis */}
          <line
            x1={X(0)}
            y1={VIEW_H - AXIS_H + 8}
            x2={X(sc.tMax)}
            y2={VIEW_H - AXIS_H + 8}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />
          {Array.from({ length: sc.tMax + 1 }, (_, t) => t).map((t) => (
            <g key={t}>
              <line
                x1={X(t)}
                y1={VIEW_H - AXIS_H + 5}
                x2={X(t)}
                y2={VIEW_H - AXIS_H + 11}
                stroke="#cdbfc0"
                strokeWidth={1}
              />
              {(sc.tMax <= 24 || t % 4 === 0) && (
                <text x={X(t)} y={VIEW_H - AXIS_H + 23} className="is-tick">
                  {t}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* count + verdict */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Επιλεγμένες
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {count}
        </span>
        <span className="text-sm text-fg-muted">/ βέλτιστο: {sc.optimum}</span>
        {done && (
          <span
            className={cn(
              'ml-auto rounded-md px-2 py-0.5 text-sm font-bold',
              success ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
            )}
          >
            {success
              ? '✓ Πιάνει το βέλτιστο'
              : `✗ Χάνει ${sc.optimum - count}`}
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
        {done && !sc.correct && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Αυτό το στιγμιότυπο είναι αντιπαράδειγμα — ένα και μόνο αρκεί για να
              απορρίψουμε τον κανόνα. Δοκίμασε το «Πρώτη λήξη».
            </span>
          </>
        )}
        {done && sc.correct && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Το μόνο κριτήριο χωρίς αντιπαράδειγμα. Το γιατί το αποδεικνύουμε
              παρακάτω.
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
