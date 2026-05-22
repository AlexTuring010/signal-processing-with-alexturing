'use client'

/**
 * GreedyStaysAhead — the "ο άπληστος προηγείται" correctness proof, stepped.
 *
 * The proof that earliest-finish-time interval scheduling is optimal is L11's
 * real lesson, and pure prose makes it slippery. This viz puts the greedy
 * solution on a top timeline and an optimal solution on a bottom one, then
 * walks position by position: at every step it shows the invariant
 * f(iᵣ) ≤ f(jᵣ) — the greedy's r-th job never finishes later — and then
 * performs the exchange that rewrites the optimal one job closer to the
 * greedy. After the full chain the optimal has BECOME the greedy's solution,
 * which is exactly why the greedy is optimal. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

type Job = { id: string; label: string; s: number; f: number }
const JOBS: Record<string, Job> = {
  A: { id: 'A', label: 'A', s: 0, f: 2 },
  B: { id: 'B', label: 'B', s: 3, f: 6 },
  Bp: { id: 'Bp', label: 'B′', s: 3, f: 9 },
  C: { id: 'C', label: 'C', s: 7, f: 11 },
  D: { id: 'D', label: 'D', s: 10, f: 14 },
}
const GREEDY = ['A', 'B', 'C']
const T_MAX = 14

type Frame = {
  tag: string
  optimal: string[]
  hiTop: string[]
  hiBot: string[]
  matched: number
  ineq: [string, string] | null
  ghost: string | null
  swapTo: string | null
  note: string
}

const FRAMES: Frame[] = [
  {
    tag: 'Δύο λύσεις',
    optimal: ['A', 'Bp', 'D'],
    hiTop: [],
    hiBot: [],
    matched: 0,
    ineq: null,
    ghost: null,
    swapTo: null,
    note: 'Πάνω η λύση του άπληστου: {A, B, C}. Κάτω μια βέλτιστη λύση: {A, B′, D}. Και οι δύο έγκυρες. Διαλέγουμε τη βέλτιστη ώστε να συμφωνεί με τον άπληστο σε ΟΣΟ ΤΟ ΔΥΝΑΤΟΝ περισσότερες αρχικές εργασίες — και θα δείξουμε ότι μπορούμε πάντα να επεκτείνουμε αυτή τη συμφωνία.',
  },
  {
    tag: 'Θέση 1 — συμφωνούν',
    optimal: ['A', 'Bp', 'D'],
    hiTop: ['A'],
    hiBot: ['A'],
    matched: 1,
    ineq: null,
    ghost: null,
    swapTo: null,
    note: 'Θέση 1: ο άπληστος διάλεξε A, η βέλτιστη επίσης A. Συμφωνούν — i₁ = j₁.',
  },
  {
    tag: 'Θέση 2 — διαφωνούν',
    optimal: ['A', 'Bp', 'D'],
    hiTop: ['B'],
    hiBot: ['Bp'],
    matched: 1,
    ineq: null,
    ghost: null,
    swapTo: null,
    note: 'Θέση 2 — εδώ χωρίζουν. Ο άπληστος διάλεξε B [3–6]. Η βέλτιστη διάλεξε B′ [3–9].',
  },
  {
    tag: 'Ο άπληστος προηγείται',
    optimal: ['A', 'Bp', 'D'],
    hiTop: ['B'],
    hiBot: ['Bp'],
    matched: 1,
    ineq: ['B', 'Bp'],
    ghost: null,
    swapTo: null,
    note: 'Ισχυρισμός: f(i₂) ≤ f(j₂). Γιατί; Το B′ είναι συμβατό με το A — άρα ήταν ΥΠΟΨΗΦΙΟ τη στιγμή που ο άπληστος διάλεγε τη θέση 2. Κι ο άπληστος παίρνει πάντα το υποψήφιο με τον μικρότερο χρόνο λήξης. Άρα f(B) = 6 ≤ 9 = f(B′).',
  },
  {
    tag: 'Ανταλλαγή',
    optimal: ['A', 'B', 'D'],
    hiTop: ['B'],
    hiBot: ['B'],
    matched: 2,
    ineq: null,
    ghost: 'Bp',
    swapTo: 'B',
    note: 'Αντικαθιστούμε στη βέλτιστη το B′ με το B. Έγκυρο: το B τελειώνει στο 6 — όχι αργότερα από το B′ — οπότε το D, που ερχόταν μετά, παραμένει συμβατό. Το πλήθος εργασιών δεν άλλαξε. Η συμφωνία επεκτάθηκε στο {A, B}.',
  },
  {
    tag: 'Θέση 3 — διαφωνούν',
    optimal: ['A', 'B', 'D'],
    hiTop: ['C'],
    hiBot: ['D'],
    matched: 2,
    ineq: null,
    ghost: null,
    swapTo: null,
    note: 'Θέση 3 — ξαναδιαφωνούν. Ο άπληστος διάλεξε C [7–11], η βέλτιστη διάλεξε D [10–14].',
  },
  {
    tag: 'Ο άπληστος προηγείται',
    optimal: ['A', 'B', 'D'],
    hiTop: ['C'],
    hiBot: ['D'],
    matched: 2,
    ineq: ['C', 'D'],
    ghost: null,
    swapTo: null,
    note: 'Ίδιο επιχείρημα: το D είναι συμβατό με το B, άρα ήταν υποψήφιο όταν ο άπληστος διάλεγε τη θέση 3. Ο άπληστος πήρε το μικρότερο χρόνο λήξης → f(C) = 11 ≤ 14 = f(D).',
  },
  {
    tag: 'Ανταλλαγή',
    optimal: ['A', 'B', 'C'],
    hiTop: ['C'],
    hiBot: ['C'],
    matched: 3,
    ineq: null,
    ghost: 'D',
    swapTo: 'C',
    note: 'Ανταλλαγή ξανά: D → C, έγκυρη για τον ίδιο λόγο. Τώρα η βέλτιστη λύση έγινε ΑΚΡΙΒΩΣ {A, B, C} — η λύση του άπληστου.',
  },
  {
    tag: 'Συμπέρασμα',
    optimal: ['A', 'B', 'C'],
    hiTop: ['A', 'B', 'C'],
    hiBot: ['A', 'B', 'C'],
    matched: 3,
    ineq: null,
    ghost: null,
    swapTo: null,
    note: 'Κάθε βέλτιστη λύση μετατρέπεται, μία ανταλλαγή τη φορά, στη λύση του άπληστου — χωρίς ποτέ να χάσει εργασία. Άρα η λύση του άπληστου είναι κι αυτή βέλτιστη. Το κλειδί σε κάθε βήμα: ο άπληστος δεν τελειώνει ποτέ αργότερα. ∎',
  },
]

const PAD_L = 78
const VIEW_W = 640
const PLOT_W = VIEW_W - PAD_L - 24
const VIEW_H = 212
const TOP_Y = 40
const BOT_Y = 110
const BAR_H = 28
const GUIDE_BOTTOM = 168

const X = (t: number) => PAD_L + (t / T_MAX) * PLOT_W

export function GreedyStaysAhead() {
  const [step, setStep] = useState(0)
  const last = FRAMES.length - 1
  const fr = FRAMES[Math.min(step, last)]

  const hiTop = useMemo(() => new Set(fr.hiTop), [fr])
  const hiBot = useMemo(() => new Set(fr.hiBot), [fr])

  function bar(
    jobId: string,
    rowIndex: number,
    y: number,
    hi: boolean,
    matched: boolean,
  ) {
    const j = JOBS[jobId]
    const isSwap = fr.swapTo === jobId
    let fill = '#ffffff'
    let stroke = '#9b8a8d'
    let textFill = '#1c1214'
    if (isSwap) {
      fill = '#22c55e'
      stroke = '#15803d'
      textFill = '#ffffff'
    } else if (hi) {
      fill = '#fde68a'
      stroke = '#d97706'
      textFill = '#7c2d12'
    } else if (matched) {
      fill = '#dbeafe'
      stroke = '#3b82f6'
      textFill = '#1e3a5f'
    }
    return (
      <g key={`${jobId}-${rowIndex}`}>
        <rect
          x={X(j.s)}
          y={y}
          width={Math.max(X(j.f) - X(j.s), 4)}
          height={BAR_H}
          rx={4}
          fill={fill}
          stroke={stroke}
          strokeWidth={hi || isSwap ? 3 : 2}
        />
        <text
          x={(X(j.s) + X(j.f)) / 2}
          y={y + BAR_H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13}
          fontWeight={700}
          fill={textFill}
        >
          {j.label}
        </text>
      </g>
    )
  }

  const ineqText = (() => {
    if (!fr.ineq) return null
    const [iId, jId] = fr.ineq
    return `f(${JOBS[iId].label}) = ${JOBS[iId].f}  ≤  ${JOBS[jId].f} = f(${JOBS[jId].label})`
  })()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο άπληστος προηγείται — η απόδειξη βήμα-βήμα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {fr.tag}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πάνω: ο άπληστος. Κάτω: μια βέλτιστη λύση. Μπλε = θέσεις όπου ήδη
        συμφωνούν.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* row labels */}
          <text
            x={10}
            y={TOP_Y + BAR_H / 2}
            dominantBaseline="central"
            fontSize={12}
            fontWeight={700}
            fill="#9f1239"
          >
            Άπληστος
          </text>
          <text
            x={10}
            y={BOT_Y + BAR_H / 2}
            dominantBaseline="central"
            fontSize={12}
            fontWeight={700}
            fill="#5a4a4d"
          >
            Βέλτιστο
          </text>

          {/* inequality shading + guides */}
          {fr.ineq && (
            <>
              <rect
                x={X(JOBS[fr.ineq[0]].f)}
                y={TOP_Y - 6}
                width={X(JOBS[fr.ineq[1]].f) - X(JOBS[fr.ineq[0]].f)}
                height={GUIDE_BOTTOM - TOP_Y + 6}
                fill="#fde68a"
                fillOpacity={0.35}
              />
              {[fr.ineq[0], fr.ineq[1]].map((jid, k) => (
                <line
                  key={jid}
                  x1={X(JOBS[jid].f)}
                  y1={k === 0 ? TOP_Y - 6 : BOT_Y - 6}
                  x2={X(JOBS[jid].f)}
                  y2={GUIDE_BOTTOM}
                  stroke="#d97706"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                />
              ))}
            </>
          )}

          {/* greedy row */}
          {GREEDY.map((id, i) =>
            bar(id, i, TOP_Y, hiTop.has(id), i < fr.matched),
          )}

          {/* ghost of a removed interval */}
          {fr.ghost && (
            <g>
              <rect
                x={X(JOBS[fr.ghost].s)}
                y={BOT_Y}
                width={Math.max(X(JOBS[fr.ghost].f) - X(JOBS[fr.ghost].s), 4)}
                height={BAR_H}
                rx={4}
                fill="none"
                stroke="#dc2626"
                strokeWidth={1.8}
                strokeDasharray="5 3"
              />
              <text
                x={X(JOBS[fr.ghost].f) - 6}
                y={BOT_Y - 8}
                textAnchor="end"
                fontSize={10}
                fontWeight={700}
                fill="#dc2626"
              >
                {JOBS[fr.ghost].label} ✕
              </text>
            </g>
          )}

          {/* optimal row */}
          {fr.optimal.map((id, i) =>
            bar(id, i, BOT_Y, hiBot.has(id), i < fr.matched),
          )}

          {/* inequality label */}
          {ineqText && (
            <text
              x={(X(JOBS[fr.ineq![0]].f) + X(JOBS[fr.ineq![1]].f)) / 2}
              y={GUIDE_BOTTOM + 18}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#b45309"
            >
              {ineqText}
            </text>
          )}

          {/* time axis */}
          <line
            x1={X(0)}
            y1={VIEW_H - 12}
            x2={X(T_MAX)}
            y2={VIEW_H - 12}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />
          {Array.from({ length: T_MAX + 1 }, (_, t) => t).map((t) => (
            <text
              key={t}
              x={X(t)}
              y={VIEW_H - 2}
              textAnchor="middle"
              fontSize={9}
              fontWeight={600}
              fill="#9b8a8d"
            >
              {t}
            </text>
          ))}
        </svg>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[5.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {fr.note}
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
          disabled={step === last}
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
