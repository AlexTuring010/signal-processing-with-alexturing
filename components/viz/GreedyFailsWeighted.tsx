'use client'

/**
 * GreedyFailsWeighted — why no greedy ordering survives once intervals carry
 * weights.
 *
 * L11's «μικρότερος χρόνος λήξης» was provably optimal when every interval was
 * worth 1. The student's instinct is that some ordering must still work — so
 * this viz hands them the two most natural candidates and lets each fail on
 * its own hand-built instance:
 *
 *  - «μικρότερος χρόνος λήξης»: a cheap interval that finishes first blocks a
 *    treasure worth 100 → greedy 3, optimum 100.
 *  - «μεγαλύτερη αξία»: one fat interval is grabbed and shadows two lighter
 *    ones that together beat it → greedy 10, optimum 12.
 *
 * Step through the pick/skip decisions, then reveal the optimum the greedy
 * walked past. The takeaway is the motivation for the whole lecture: no local
 * rule is enough — we need dynamic programming. Built for L14.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Iv = { id: number; s: number; f: number; v: number }
type Crit = 'finish' | 'value'

const overlap = (a: Iv, b: Iv) => a.s < b.f && b.s < a.f

type Scenario = {
  crit: Crit
  label: string
  rule: string
  ivs: Iv[]
  tMax: number
  intro: string
  lesson: string
}

const SCENARIOS: Record<Crit, Scenario> = {
  finish: {
    crit: 'finish',
    label: 'Μικρότερη λήξη',
    rule: 'αύξοντα χρόνο λήξης',
    ivs: [
      { id: 1, s: 1, f: 3, v: 1 },
      { id: 2, s: 2, f: 12, v: 100 },
      { id: 3, s: 4, f: 7, v: 1 },
      { id: 4, s: 8, f: 11, v: 1 },
    ],
    tMax: 12,
    intro:
      'Κανόνας «μικρότερος χρόνος λήξης» — ο νικητής του L11, όταν όλα τα βάρη ήταν 1. Εδώ τα βάρη διαφέρουν. Πάτα «Επόμενο».',
    lesson:
      'Το φθηνό διάστημα 1 τελειώνει πρώτο — ακριβώς ό,τι λατρεύει ο κανόνας «μικρότερη λήξη». Και είναι παγίδα: επιλέγοντάς το, ο άπληστος μπλοκάρει το διάστημα 2 που αξίζει 100.',
  },
  value: {
    crit: 'value',
    label: 'Μεγαλύτερη αξία',
    rule: 'φθίνουσα αξία',
    ivs: [
      { id: 1, s: 1, f: 10, v: 10 },
      { id: 2, s: 1, f: 5, v: 6 },
      { id: 3, s: 6, f: 10, v: 6 },
    ],
    tMax: 10,
    intro:
      'Δεύτερη ιδέα: «πάρε πρώτα το πιο ακριβό». Ακούγεται λογικό — πάτα «Επόμενο» και δες.',
    lesson:
      'Ο κανόνας αρπάζει αμέσως το διάστημα 1 (αξία 10) και έτσι χάνει τα διαστήματα 2 και 3, που είναι μεταξύ τους συμβατά και μαζί αξίζουν 12.',
  },
}

const CRITS: Crit[] = ['finish', 'value']

/** Run the greedy under the tab's criterion; one decision per interval, in sweep order. */
function runGreedy(sc: Scenario): { iv: Iv; pick: boolean }[] {
  const cmp =
    sc.crit === 'finish'
      ? (a: Iv, b: Iv) => a.f - b.f || a.id - b.id
      : (a: Iv, b: Iv) => b.v - a.v || a.id - b.id
  const order = [...sc.ivs].sort(cmp)
  const picked: Iv[] = []
  return order.map((iv) => {
    const ok = picked.every((p) => !overlap(p, iv))
    if (ok) picked.push(iv)
    return { iv, pick: ok }
  })
}

/** Brute-force optimum over all subsets — instances are tiny (≤ 4 intervals). */
function optimum(ivs: Iv[]): { value: number; ids: Set<number> } {
  let best = { value: 0, ids: new Set<number>() }
  for (let mask = 0; mask < 1 << ivs.length; mask++) {
    const chosen = ivs.filter((_, i) => mask & (1 << i))
    let ok = true
    for (let a = 0; a < chosen.length && ok; a++) {
      for (let b = a + 1; b < chosen.length && ok; b++) {
        if (overlap(chosen[a], chosen[b])) ok = false
      }
    }
    if (!ok) continue
    const value = chosen.reduce((s, iv) => s + iv.v, 0)
    if (value > best.value) best = { value, ids: new Set(chosen.map((iv) => iv.id)) }
  }
  return best
}

const VIEW_W = 560
const PAD_L = 38
const PLOT_W = VIEW_W - PAD_L - 20
const ROW_H = 36
const TOP = 14
const AXIS_H = 30

export function GreedyFailsWeighted() {
  const [crit, setCrit] = useState<Crit>('finish')
  const [step, setStep] = useState(0)

  const sc = SCENARIOS[crit]
  const decisions = useMemo(() => runGreedy(sc), [sc])
  const opt = useMemo(() => optimum(sc.ivs), [sc])

  const D = decisions.length
  const last = D + 1
  const done = step === last
  const revealed = done

  const greedyTotal = decisions
    .slice(0, Math.min(step, D))
    .filter((d) => d.pick)
    .reduce((s, d) => s + d.iv.v, 0)
  const greedyFinal = decisions.filter((d) => d.pick).reduce((s, d) => s + d.iv.v, 0)

  function changeCrit(c: Crit) {
    setCrit(c)
    setStep(0)
  }

  const X = (t: number) => PAD_L + (t / sc.tMax) * PLOT_W
  const VIEW_H = TOP + D * ROW_H + AXIS_H

  let note: string
  if (step === 0) {
    note = sc.intro
  } else if (!revealed) {
    const d = decisions[step - 1]
    note = `Διάστημα ${d.iv.id} [${d.iv.s}–${d.iv.f}], αξία ${d.iv.v}: ${
      d.pick
        ? 'συμβατό με όσα έχουν ήδη επιλεγεί → ΕΠΙΛΕΓΕΤΑΙ.'
        : 'συγκρούεται με ήδη επιλεγμένο διάστημα → απορρίπτεται.'
    }`
  } else {
    note = sc.lesson
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + criterion tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί ο άπληστος αποτυγχάνει με βάρη
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {CRITS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => changeCrit(c)}
              className={cn(
                'rounded px-2.5 py-0.5 text-xs font-medium transition-colors',
                crit === c ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {SCENARIOS[c].label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ο άπληστος εξετάζει τα διαστήματα κατά {sc.rule}. Κάθε ράβδος δείχνει την
        αξία της — δες ποια διαλέγει.
      </p>

      {/* timeline */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .gf-lbl { font: 700 11px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .gf-ord { font: 600 11px ui-monospace, monospace; fill: #9b8a8d; text-anchor: end; }
            .gf-tick { font: 600 10px ui-sans-serif, system-ui; fill: #9b8a8d; text-anchor: middle; }
          `}</style>

          {decisions.map((d, i) => {
            const y = TOP + i * ROW_H
            const examined = revealed || i < Math.min(step, D)
            const isCurrent = !revealed && i === step - 1
            const inOpt = opt.ids.has(d.iv.id)

            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            let textFill = '#1c1214'
            if (revealed) {
              if (inOpt) {
                fill = '#fbbf24'
                stroke = '#b45309'
                textFill = '#1c1214'
              } else {
                fill = '#22c55e'
                stroke = '#15803d'
                textFill = '#ffffff'
              }
            } else if (examined && d.pick) {
              fill = '#22c55e'
              stroke = '#15803d'
              textFill = '#ffffff'
            } else if (examined) {
              fill = '#f1eae4'
              stroke = '#cdbfc0'
              textFill = '#9b8a8d'
            }
            return (
              <g key={d.iv.id}>
                <text x={PAD_L - 9} y={y + 13} className="gf-ord">
                  {i + 1}.
                </text>
                <rect
                  x={X(d.iv.s)}
                  y={y}
                  width={Math.max(X(d.iv.f) - X(d.iv.s), 3)}
                  height={26}
                  rx={4}
                  fill={fill}
                  stroke={isCurrent ? '#d97706' : stroke}
                  strokeWidth={isCurrent ? 3.5 : 2}
                />
                <text
                  x={(X(d.iv.s) + X(d.iv.f)) / 2}
                  y={y + 13}
                  className="gf-lbl"
                  fill={textFill}
                >
                  {d.iv.id} · αξία {d.iv.v}
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
              <text x={X(t)} y={VIEW_H - AXIS_H + 22} className="gf-tick">
                {t}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* scoreboard */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            revealed ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Άπληστος
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {revealed ? greedyFinal : greedyTotal}
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center transition-opacity',
            revealed ? 'border-[#b45309]/50 bg-[#fbbf24]/15' : 'border-border bg-bg-soft/40 opacity-50',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Βέλτιστο
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {revealed ? opt.value : '·'}
          </div>
        </div>
      </div>
      {revealed && (
        <p className="mt-1.5 text-center text-sm font-bold text-danger">
          ✗ Ο άπληστος χάνει {opt.value - greedyFinal} — πιάνει μόλις το{' '}
          {Math.round((greedyFinal / opt.value) * 100)}% του βέλτιστου.
        </p>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
        {revealed && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Κανένας απλός κανόνας σειράς δεν αρκεί — γι’ αυτό χρειαζόμαστε
              δυναμικό προγραμματισμό.
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
          {step === D ? 'Δες το βέλτιστο' : 'Επόμενο'}
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
