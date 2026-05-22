'use client'

/**
 * IntervalPartitionAnimator — interval partitioning: the depth lower bound
 * and the greedy that meets it.
 *
 * Two modes over ONE shared 10-job instance. «Βάθος» sweeps a vertical line
 * across time and counts how many jobs run at once — the maximum is the
 * depth, a wall no schedule can beat. «Άπληστος» runs the greedy, opening a
 * new machine only when forced; the moment machine 3 opens, three jobs are
 * provably running together, so depth ≥ 3. Putting both on the same instance
 * makes the correctness proof visible: greedy uses exactly depth machines.
 * Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Job = { id: string; s: number; f: number }
const JOBS: Job[] = [
  { id: 'a', s: 0, f: 3 },
  { id: 'b', s: 1, f: 4 },
  { id: 'c', s: 2, f: 5 },
  { id: 'd', s: 4, f: 7 },
  { id: 'e', s: 5, f: 9 },
  { id: 'f', s: 6, f: 8 },
  { id: 'g', s: 8, f: 11 },
  { id: 'h', s: 9, f: 12 },
  { id: 'i', s: 10, f: 13 },
  { id: 'j', s: 12, f: 15 },
]
const T_MAX = 15

/* ---- greedy interval partitioning ---- */
type PStep = {
  job: Job
  machine: number // 1-based
  opened: boolean
  blockers: string[] // last job of each pre-existing machine (when a machine opens)
}
function runPartition(): PStep[] {
  const sorted = [...JOBS].sort((a, b) => a.s - b.s)
  const machines: Job[] = [] // machines[k] = last job placed on machine k+1
  const steps: PStep[] = []
  for (const job of sorted) {
    let mi = machines.findIndex((last) => last.f <= job.s)
    let opened = false
    let blockers: string[] = []
    if (mi === -1) {
      opened = true
      blockers = machines.map((last) => last.id)
      machines.push(job)
      mi = machines.length - 1
    } else {
      machines[mi] = job
    }
    steps.push({ job, machine: mi + 1, opened, blockers })
  }
  return steps
}
const P_STEPS = runPartition()
const MACHINE_COUNT = Math.max(...P_STEPS.map((s) => s.machine))

/* ---- depth ---- */
const liveAt = (t: number) => JOBS.filter((j) => j.s <= t && t < j.f)

const VIEW_W = 640

export function IntervalPartitionAnimator() {
  const [mode, setMode] = useState<'depth' | 'greedy'>('depth')
  const [step, setStep] = useState(0)

  function pickMode(m: 'depth' | 'greedy') {
    setMode(m)
    setStep(0)
  }

  /* ============================ ΒΑΘΟΣ ============================ */
  const depthLast = T_MAX // sweep at t = 0 … T_MAX
  const greedyLast = P_STEPS.length // 0 = nothing placed, k = after k jobs

  const last = mode === 'depth' ? depthLast : greedyLast
  const done = step === last

  // running depth up to the current sweep position
  const depthSoFar = useMemo(() => {
    let m = 0
    for (let t = 0; t <= step; t++) m = Math.max(m, liveAt(t).length)
    return m
  }, [step])

  /* ---- ΒΑΘΟΣ render ---- */
  function renderDepth() {
    const PAD_L = 30
    const PLOT_W = VIEW_W - PAD_L - 24
    const ROW_H = 22
    const TOP = 16
    const H = TOP + JOBS.length * ROW_H + 34
    const X = (t: number) => PAD_L + (t / T_MAX) * PLOT_W
    const t = step
    const live = new Set(liveAt(t).map((j) => j.id))
    const count = live.size

    return (
      <svg
        viewBox={`0 0 ${VIEW_W} ${H}`}
        className="mx-auto block w-full max-w-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* sweep band */}
        <rect
          x={X(t) - 1.5}
          y={TOP - 8}
          width={3}
          height={JOBS.length * ROW_H + 8}
          fill={count >= 3 ? '#dc2626' : '#9f1239'}
        />
        <circle
          cx={X(t)}
          cy={TOP - 12}
          r={11}
          fill={count >= 3 ? '#dc2626' : '#9f1239'}
        />
        <text
          x={X(t)}
          y={TOP - 12}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight={700}
          fill="#ffffff"
        >
          {count}
        </text>

        {/* job rows */}
        {JOBS.map((j, i) => {
          const y = TOP + i * ROW_H
          const isLive = live.has(j.id)
          return (
            <g key={j.id}>
              <text
                x={PAD_L - 8}
                y={y + 11}
                textAnchor="end"
                fontSize={11}
                fontWeight={700}
                fill={isLive ? '#1c1214' : '#9b8a8d'}
              >
                {j.id}
              </text>
              <rect
                x={X(j.s)}
                y={y}
                width={Math.max(X(j.f) - X(j.s), 4)}
                height={16}
                rx={3}
                fill={isLive ? '#fca5a5' : '#f3eee9'}
                stroke={isLive ? '#dc2626' : '#cdbfc0'}
                strokeWidth={isLive ? 2 : 1.5}
              />
            </g>
          )
        })}

        {/* axis */}
        <line
          x1={X(0)}
          y1={H - 26}
          x2={X(T_MAX)}
          y2={H - 26}
          stroke="#cdbfc0"
          strokeWidth={1.5}
        />
        {Array.from({ length: T_MAX + 1 }, (_, k) => k).map((k) => (
          <text
            key={k}
            x={X(k)}
            y={H - 14}
            textAnchor="middle"
            fontSize={9}
            fontWeight={600}
            fill="#9b8a8d"
          >
            {k}
          </text>
        ))}
      </svg>
    )
  }

  /* ---- ΑΠΛΗΣΤΟΣ render ---- */
  function renderGreedy() {
    const PAD_L = 40
    const PLOT_W = VIEW_W - PAD_L - 24
    const LANE_H = 48
    const TOP = 14
    const H = TOP + MACHINE_COUNT * LANE_H + 34
    const X = (t: number) => PAD_L + (t / T_MAX) * PLOT_W
    const laneY = (m: number) => TOP + (m - 1) * LANE_H
    const placed = P_STEPS.slice(0, step)
    const cur = step > 0 ? P_STEPS[step - 1] : null
    const openCount = placed.reduce((m, s) => Math.max(m, s.machine), 0)
    const blockerSet = new Set(cur?.opened ? cur.blockers : [])

    return (
      <svg
        viewBox={`0 0 ${VIEW_W} ${H}`}
        className="mx-auto block w-full max-w-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* lanes */}
        {Array.from({ length: MACHINE_COUNT }, (_, k) => k + 1).map((m) => {
          const open = m <= openCount
          return (
            <g key={m}>
              <rect
                x={PAD_L}
                y={laneY(m) + 4}
                width={PLOT_W}
                height={LANE_H - 8}
                rx={5}
                fill={open ? '#faf4ee' : 'none'}
                stroke={open ? '#cdbfc0' : '#e3d9da'}
                strokeWidth={1.3}
                strokeDasharray={open ? undefined : '5 4'}
              />
              <text
                x={12}
                y={laneY(m) + LANE_H / 2}
                dominantBaseline="central"
                fontSize={12}
                fontWeight={700}
                fill={open ? '#9f1239' : '#cdbfc0'}
              >
                Μ{m}
              </text>
            </g>
          )
        })}

        {/* depth proof line — when a machine opens */}
        {cur?.opened && (
          <line
            x1={X(cur.job.s)}
            y1={laneY(1)}
            x2={X(cur.job.s)}
            y2={laneY(MACHINE_COUNT) + LANE_H}
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        )}

        {/* placed jobs */}
        {placed.map((ps) => {
          const j = ps.job
          const y = laneY(ps.machine) + 11
          const isCur = cur?.job.id === j.id
          const isBlocker = blockerSet.has(j.id)
          let fill = '#ffffff'
          let stroke = '#9b8a8d'
          if (isCur) {
            fill = ps.opened ? '#fca5a5' : '#bbf7d0'
            stroke = ps.opened ? '#dc2626' : '#15803d'
          } else if (isBlocker) {
            fill = '#fca5a5'
            stroke = '#dc2626'
          }
          return (
            <g key={j.id}>
              <rect
                x={X(j.s)}
                y={y}
                width={Math.max(X(j.f) - X(j.s), 4)}
                height={26}
                rx={4}
                fill={fill}
                stroke={stroke}
                strokeWidth={isCur || isBlocker ? 3 : 2}
              />
              <text
                x={(X(j.s) + X(j.f)) / 2}
                y={y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={700}
                fill="#1c1214"
              >
                {j.id}
              </text>
            </g>
          )
        })}

        {/* axis */}
        <line
          x1={X(0)}
          y1={H - 26}
          x2={X(T_MAX)}
          y2={H - 26}
          stroke="#cdbfc0"
          strokeWidth={1.5}
        />
        {Array.from({ length: T_MAX + 1 }, (_, k) => k).map((k) => (
          <text
            key={k}
            x={X(k)}
            y={H - 14}
            textAnchor="middle"
            fontSize={9}
            fontWeight={600}
            fill="#9b8a8d"
          >
            {k}
          </text>
        ))}
      </svg>
    )
  }

  /* ---- notes ---- */
  let note: string
  if (mode === 'depth') {
    const live = liveAt(step)
    if (step === 0) {
      note =
        'Η γραμμή σάρωσης διασχίζει τον χρόνο. Σε κάθε στιγμή μετράμε πόσες εργασίες «τρέχουν» — το μέγιστο αυτού του πλήθους είναι το ΒΑΘΟΣ. Πάτα «Επόμενο».'
    } else if (done) {
      note = `Η σάρωση τελείωσε. Το μέγιστο πλήθος ταυτόχρονων εργασιών ήταν 3 — άρα βάθος = 3. Κάθε λύση χρειάζεται ≥ βάθος μηχανές: τουλάχιστον 3. Δες τώρα τι κάνει ο άπληστος.`
    } else {
      note = `Στιγμή t = ${step}: τρέχουν ${live.length} εργασίες ταυτόχρονα (${live
        .map((j) => j.id)
        .join(', ')}). Μέγιστο ως τώρα: ${depthSoFar}.${
        live.length >= 3 ? ' Τρεις μαζί — αυτές χρειάζονται 3 διαφορετικές μηχανές.' : ''
      }`
    }
  } else {
    const cur = step > 0 ? P_STEPS[step - 1] : null
    if (!cur) {
      note =
        'Ο άπληστος εξετάζει τις εργασίες κατά αύξοντα χρόνο έναρξης. Κάθε εργασία πάει σε μια ελεύθερη μηχανή· αν δεν υπάρχει, ανοίγει νέα. Πάτα «Επόμενο».'
    } else if (cur.opened && cur.blockers.length >= 2) {
      note = `Εργασία ${cur.job.id} [${cur.job.s}–${cur.job.f}]: καμία ανοιχτή μηχανή δεν είναι ελεύθερη — οι ${cur.blockers.join(
        ' και ',
      )} τρέχουν ακόμη. Ανοίγει η Μ${cur.machine}. Πρόσεξε: τη στιγμή ${cur.job.s} τρέχουν ${
        cur.blockers.length + 1
      } εργασίες μαζί (${[...cur.blockers, cur.job.id].join(
        ', ',
      )}) → βάθος ≥ ${cur.blockers.length + 1}. Αυτή είναι η απόδειξη.`
    } else if (cur.opened) {
      note = `Εργασία ${cur.job.id} [${cur.job.s}–${cur.job.f}]: ${
        cur.blockers.length
          ? `η ${cur.blockers.join(', ')} τρέχει ακόμη, `
          : ''
      }ανοίγει η Μ${cur.machine}.`
    } else {
      note = `Εργασία ${cur.job.id} [${cur.job.s}–${cur.job.f}]: η Μ${cur.machine} είναι ελεύθερη (η προηγούμενη εργασία της τελείωσε ώς τη στιγμή ${cur.job.s}) → μπαίνει εκεί, χωρίς νέα μηχανή.`
    }
    if (done) {
      note +=
        ' Τέλος: ο άπληστος χρησιμοποίησε 3 μηχανές. Όσο το βάθος — άρα βέλτιστος.'
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + mode toggle */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Διαμέριση διαστημάτων — {MACHINE_COUNT} μηχανές, βάθος {MACHINE_COUNT}
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['depth', 'greedy'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pickMode(m)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                mode === m
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {m === 'depth' ? 'Βάθος (κάτω φράγμα)' : 'Άπληστος (ο αλγόριθμος)'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        {mode === 'depth'
          ? 'Κόκκινο = εργασία που τρέχει τη στιγμή της σάρωσης.'
          : 'Κάθε λωρίδα είναι μία μηχανή. Κόκκινο = εργασία που μπλοκάρει· πράσινο = μπήκε σε ελεύθερη μηχανή.'}
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        {mode === 'depth' ? renderDepth() : renderGreedy()}
      </div>

      {/* readout */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        {mode === 'depth' ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Βάθος ως τώρα
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums text-fg">
              {depthSoFar}
            </span>
            <span className="text-sm text-fg-muted">
              = ελάχιστες μηχανές που χρειάζεται ΚΑΘΕ λύση
            </span>
          </>
        ) : (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Μηχανές ανοιχτές
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums text-fg">
              {P_STEPS.slice(0, step).reduce((m, s) => Math.max(m, s.machine), 0)}
            </span>
            {done && (
              <span className="ml-auto rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
                ✓ 3 μηχανές = βάθος
              </span>
            )}
          </>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
