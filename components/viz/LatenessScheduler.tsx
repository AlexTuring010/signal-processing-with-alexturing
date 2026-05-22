'use client'

/**
 * LatenessScheduler — minimum maximum lateness: which ordering rule works.
 *
 * One machine, jobs each with a processing time tⱼ and a deadline dⱼ. A job
 * that finishes at fⱼ has lateness ℓⱼ = max(0, fⱼ − dⱼ); the objective is the
 * WORST one, L = maxⱼ ℓⱼ. Three tabs, three ordering rules — each on its own
 * purpose-built instance. «Μικρότερος χρόνος» and «Μικρότερο περιθώριο» each
 * run on a counterexample where they visibly miss the optimum; «Earliest
 * Deadline First» lands exactly on it. Step through the placement: watch each
 * deadline marker, watch the red overshoot grow past it, watch L climb.
 * Built for L12.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Job = { id: string; t: number; d: number }
type Crit = 'time' | 'slack' | 'edf'

type Scenario = {
  label: string
  rule: string
  jobs: Job[]
  intro: string
  correct: boolean
}

const SCENARIOS: Record<Crit, Scenario> = {
  time: {
    label: 'Μικρότερος χρόνος',
    rule: 'αύξουσα σειρά χρόνου επεξεργασίας tⱼ',
    jobs: [
      { id: 'A', t: 2, d: 20 },
      { id: 'B', t: 2, d: 25 },
      { id: 'C', t: 10, d: 10 },
    ],
    correct: false,
    intro:
      'Κανόνας «μικρότερος χρόνος»: τρέξε πρώτα τις σύντομες εργασίες. Οι A και B είναι σύντομες (tⱼ = 2) με μακρινές προθεσμίες· η C είναι μακρά (tⱼ = 10) και λήγει σχεδόν αμέσως. Δες ποια θα προηγηθεί.',
  },
  slack: {
    label: 'Μικρότερο περιθώριο',
    rule: 'αύξουσα σειρά περιθωρίου dⱼ − tⱼ',
    jobs: [
      { id: 'A', t: 8, d: 10 },
      { id: 'B', t: 2, d: 5 },
      { id: 'C', t: 2, d: 14 },
    ],
    correct: false,
    intro:
      'Κανόνας «μικρότερο περιθώριο»: τρέξε πρώτα όποια έχει το μικρότερο dⱼ − tⱼ. Η A έχει περιθώριο μόλις 2 — μοιάζει η πιο επείγουσα. Δες αν αυτό αληθεύει.',
  },
  edf: {
    label: 'Earliest Deadline First',
    rule: 'αύξουσα σειρά προθεσμίας dⱼ',
    jobs: [
      { id: 'A', t: 2, d: 3 },
      { id: 'B', t: 4, d: 6 },
      { id: 'C', t: 3, d: 8 },
      { id: 'D', t: 3, d: 20 },
    ],
    correct: true,
    intro:
      'Κανόνας «Earliest Deadline First»: τρέξε τις εργασίες κατά αύξουσα προθεσμία dⱼ. Δες πού καταλήγει η μέγιστη καθυστέρηση.',
  },
}

const CRITS: Crit[] = ['time', 'slack', 'edf']

const cmp: Record<Crit, (a: Job, b: Job) => number> = {
  time: (a, b) => a.t - b.t || a.d - b.d,
  slack: (a, b) => a.d - a.t - (b.d - b.t) || a.d - b.d,
  edf: (a, b) => a.d - b.d || a.t - b.t,
}

type Placed = { job: Job; s: number; f: number; lateness: number }

/** schedule a fixed order on one machine, back-to-back, no idle time */
function schedule(order: Job[]): Placed[] {
  let t = 0
  return order.map((job) => {
    const s = t
    const f = t + job.t
    t = f
    return { job, s, f, lateness: Math.max(0, f - job.d) }
  })
}

const maxLateness = (order: Job[]) =>
  schedule(order).reduce((m, p) => Math.max(m, p.lateness), 0)

/** brute-force the minimum achievable L over every ordering (n is tiny) */
function optimalL(jobs: Job[]): number {
  let best = Infinity
  const rec = (arr: Job[], k: number) => {
    if (k === arr.length) {
      best = Math.min(best, maxLateness(arr))
      return
    }
    for (let i = k; i < arr.length; i++) {
      ;[arr[k], arr[i]] = [arr[i], arr[k]]
      rec(arr, k + 1)
      ;[arr[k], arr[i]] = [arr[i], arr[k]]
    }
  }
  rec([...jobs], 0)
  return best
}

const VIEW_W = 660
const PAD_L = 40
const PAD_R = 70
const PLOT_W = VIEW_W - PAD_L - PAD_R
const TOP = 16
const ROW_H = 42
const AXIS_H = 32

export function LatenessScheduler() {
  const [criterion, setCriterion] = useState<Crit>('time')
  const [step, setStep] = useState(0)

  const sc = SCENARIOS[criterion]

  const { placed, axisMax, critL, edfL, optL } = useMemo(() => {
    const ordered = [...sc.jobs].sort(cmp[criterion])
    const placed = schedule(ordered)
    const total = placed.reduce((s, p) => s + p.job.t, 0)
    const maxD = Math.max(...sc.jobs.map((j) => j.d))
    return {
      placed,
      axisMax: Math.max(total, maxD),
      critL: maxLateness(ordered),
      edfL: maxLateness([...sc.jobs].sort(cmp.edf)),
      optL: optimalL(sc.jobs),
    }
  }, [criterion, sc])

  const last = placed.length
  const done = step === last
  const X = (t: number) => PAD_L + (t / axisMax) * PLOT_W
  const VIEW_H = TOP + placed.length * ROW_H + AXIS_H

  const lSoFar = placed
    .slice(0, step)
    .reduce((m, p) => Math.max(m, p.lateness), 0)

  function pick(c: Crit) {
    setCriterion(c)
    setStep(0)
  }

  let note: string
  if (step === 0) {
    note = sc.intro + ' Πάτα «Επόμενο».'
  } else {
    const p = placed[step - 1]
    note =
      `Εργασία ${p.job.id}: χρόνος επεξεργασίας tⱼ = ${p.job.t}, προθεσμία dⱼ = ${p.job.d}. ` +
      `Τρέχει ${p.s} → ${p.f}. ` +
      (p.lateness > 0
        ? `Τελειώνει ${p.lateness} ${p.lateness === 1 ? 'μονάδα' : 'μονάδες'} μετά την προθεσμία → καθυστέρηση ℓ = ${p.lateness}.`
        : 'Προλαβαίνει την προθεσμία → καθυστέρηση ℓ = 0.') +
      ` Μέγιστη ως τώρα: L = ${lSoFar}.`
  }

  const success = criterion === 'edf'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + criterion tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ελάχιστη μέγιστη καθυστέρηση — τρία κριτήρια
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {CRITS.map((c) => (
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
        Σειρά εκτέλεσης: {sc.rule}. Κάθε γραμμή είναι μία εργασία· η{' '}
        <span className="font-semibold text-amber-700">πορτοκαλί διακεκομμένη</span>{' '}
        είναι η προθεσμία της, το{' '}
        <span className="font-semibold text-red-700">κόκκινο</span> η καθυστέρηση.
      </p>

      {/* timeline canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {placed.map((p, i) => {
            const rowTop = TOP + i * ROW_H
            const revealed = i < step
            const isCurrent = i === step - 1
            const barY = rowTop + 16
            const barH = 20
            const x0 = X(p.s)
            const x1 = X(p.f)
            const xd = X(p.job.d)
            const late = p.lateness > 0
            // split the bar at the deadline
            const withinEnd = Math.max(x0, Math.min(xd, x1))
            const overStart = Math.max(x0, xd)

            return (
              <g key={p.job.id}>
                {/* order number */}
                <text
                  x={PAD_L - 8}
                  y={rowTop + ROW_H / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={600}
                  fill="#9b8a8d"
                >
                  {i + 1}.
                </text>

                {/* the scheduled block */}
                {!revealed ? (
                  <rect
                    x={x0}
                    y={barY}
                    width={Math.max(x1 - x0, 3)}
                    height={barH}
                    rx={4}
                    fill="#ffffff"
                    stroke="#cdbfc0"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                ) : late ? (
                  <>
                    {withinEnd > x0 && (
                      <rect
                        x={x0}
                        y={barY}
                        width={withinEnd - x0}
                        height={barH}
                        rx={3}
                        fill="#fef3c7"
                        stroke={isCurrent ? '#d97706' : '#e0b97a'}
                        strokeWidth={isCurrent ? 2.6 : 1.6}
                      />
                    )}
                    <rect
                      x={overStart}
                      y={barY}
                      width={Math.max(x1 - overStart, 3)}
                      height={barH}
                      rx={3}
                      fill="#f87171"
                      stroke={isCurrent ? '#b91c1c' : '#dc2626'}
                      strokeWidth={isCurrent ? 2.6 : 1.8}
                    />
                  </>
                ) : (
                  <rect
                    x={x0}
                    y={barY}
                    width={Math.max(x1 - x0, 3)}
                    height={barH}
                    rx={4}
                    fill="#86efac"
                    stroke={isCurrent ? '#15803d' : '#22c55e'}
                    strokeWidth={isCurrent ? 2.8 : 2}
                  />
                )}

                {/* job label inside the block */}
                <text
                  x={(x0 + x1) / 2}
                  y={barY + barH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill={revealed ? '#1c1214' : '#9b8a8d'}
                >
                  {p.job.id}
                </text>

                {/* deadline marker */}
                <line
                  x1={xd}
                  y1={rowTop + 13}
                  x2={xd}
                  y2={rowTop + ROW_H - 3}
                  stroke="#d97706"
                  strokeWidth={1.8}
                  strokeDasharray="3 2.5"
                />
                <path
                  d={`M ${xd - 4.5} ${rowTop + 6} L ${xd + 4.5} ${rowTop + 6} L ${xd} ${rowTop + 13} Z`}
                  fill="#d97706"
                />
                <text
                  x={Math.min(Math.max(xd, PAD_L + 10), VIEW_W - PAD_R - 10)}
                  y={rowTop + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="#b45309"
                >
                  d={p.job.d}
                </text>

                {/* lateness readout in the right gutter */}
                {revealed && (
                  <text
                    x={VIEW_W - PAD_R + 34}
                    y={rowTop + ROW_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill={late ? '#dc2626' : '#9b8a8d'}
                  >
                    ℓ={p.lateness}
                  </text>
                )}
              </g>
            )
          })}

          {/* time axis */}
          <line
            x1={X(0)}
            y1={VIEW_H - AXIS_H + 10}
            x2={X(axisMax)}
            y2={VIEW_H - AXIS_H + 10}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />
          {Array.from({ length: axisMax + 1 }, (_, t) => t).map((t) => {
            const showLabel = axisMax <= 16 || t % 2 === 0
            return (
              <g key={t}>
                <line
                  x1={X(t)}
                  y1={VIEW_H - AXIS_H + 7}
                  x2={X(t)}
                  y2={VIEW_H - AXIS_H + 13}
                  stroke="#cdbfc0"
                  strokeWidth={1}
                />
                {showLabel && (
                  <text
                    x={X(t)}
                    y={VIEW_H - AXIS_H + 25}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill="#9b8a8d"
                  >
                    {t}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* L readout + verdict */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Μέγιστη καθυστέρηση L
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {lSoFar}
        </span>
        {done && (
          <span
            className={cn(
              'ml-auto rounded-md px-2 py-0.5 text-sm font-bold',
              success
                ? 'bg-success/15 text-success'
                : 'bg-danger/15 text-danger',
            )}
          >
            {success
              ? `✓ Βέλτιστο (L = ${optL})`
              : `✗ Αντιπαράδειγμα — χάνει κατά ${critL - optL}`}
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
        {done && !success && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              Αυτό το κριτήριο δίνει L = {critL}. Με Earliest Deadline First στο
              ίδιο στιγμιότυπο: L = {edfL}. Ένα αντιπαράδειγμα αρκεί — ο κανόνας
              απορρίπτεται.
            </span>
          </>
        )}
        {done && success && (
          <>
            {' '}
            <span className="font-semibold text-fg">
              L = {critL} — και καμία σειρά εκτέλεσης δεν κατεβάζει τη μέγιστη
              καθυστέρηση χαμηλότερα. Το EDF είναι βέλτιστο· το γιατί το
              αποδεικνύουμε παρακάτω.
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
