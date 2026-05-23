'use client'

/**
 * SegmentCrossingsToInversions — the geometric ⇄ inversion isomorphism.
 *
 * For front-set-4-ask9. The setup: two parallel rails (y=0 and y=1)
 * each with n points (p_i and q_i), and n line segments p_i ↔ q_i.
 * Order the segments by p-coordinate; then the q-coordinates form an
 * array Q. The claim is «two segments i<j cross iff Q[i] > Q[j]» — a
 * crossing in the picture is exactly an inversion in Q.
 *
 * Two synced panels:
 *   Top — the segments drawn over a 600×120 SVG. Click any pair (i, j)
 *   and the corresponding two segments turn yellow; a verdict appears
 *   («τέμνονται» / «δεν τέμνονται»).
 *   Bottom — the array Q with positions i and j highlighted in lock-step;
 *   another verdict («αντιστροφή» / «ταξινομημένο ζευγάρι»).
 *
 * A counter pane tracks total crossings = total inversions for the
 * fixed 7-segment instance.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

// p_i are the sorted positions on the bottom rail (1..7).
// q_i are the positions on the top rail; permutation of 1..7 to give a
// non-trivial number of crossings.
const P = [1, 2, 3, 4, 5, 6, 7]
const Q = [3, 1, 5, 2, 7, 4, 6]
//   inversions: (1,2)(1,4)(2,—)…  computed below

const W = 600
const H = 140
const PAD_X = 30
const PAD_Y = 18
const RAIL_X = (i: number) => PAD_X + ((W - 2 * PAD_X) * (i - 1)) / (P.length - 1)

function inversionPairs(): [number, number][] {
  const pairs: [number, number][] = []
  for (let i = 0; i < Q.length; i++) {
    for (let j = i + 1; j < Q.length; j++) {
      if (Q[i] > Q[j]) pairs.push([i, j])
    }
  }
  return pairs
}

export function SegmentCrossingsToInversions() {
  const pairs = useMemo(inversionPairs, [])
  const [pick, setPick] = useState<[number, number] | null>(null)
  const [showAll, setShowAll] = useState(false)

  const isCrossing =
    pick !== null && Q[pick[0]] > Q[pick[1]]

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τομές τμημάτων ⇄ Αντιστροφές στον πίνακα Q
        </div>
        <div className="text-xs text-fg-subtle">n = {P.length}</div>
      </div>

      {/* SVG segments */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-2 py-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
          {/* Rails */}
          <line
            x1={PAD_X / 2}
            y1={PAD_Y}
            x2={W - PAD_X / 2}
            y2={PAD_Y}
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />
          <line
            x1={PAD_X / 2}
            y1={H - PAD_Y}
            x2={W - PAD_X / 2}
            y2={H - PAD_Y}
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />
          <text x={PAD_X / 2 + 4} y={PAD_Y - 4} className="fill-current text-[10px] opacity-60">
            y = 1 (q)
          </text>
          <text x={PAD_X / 2 + 4} y={H - PAD_Y + 14} className="fill-current text-[10px] opacity-60">
            y = 0 (p)
          </text>

          {/* Segments */}
          {P.map((_, i) => {
            const x1 = RAIL_X(P[i])
            const x2 = RAIL_X(Q[i])
            const focused = pick && (pick[0] === i || pick[1] === i)
            const allCrossings =
              showAll && pairs.some(([a, b]) => a === i || b === i)
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={H - PAD_Y}
                  x2={x2}
                  y2={PAD_Y}
                  stroke={focused ? '#facc15' : allCrossings ? '#f97316' : 'currentColor'}
                  strokeOpacity={focused ? 1 : allCrossings ? 0.6 : 0.4}
                  strokeWidth={focused ? 3 : allCrossings ? 2 : 1.4}
                />
                {/* p label */}
                <circle cx={x1} cy={H - PAD_Y} r="3.5" className="fill-current opacity-70" />
                <text
                  x={x1}
                  y={H - PAD_Y + 14}
                  textAnchor="middle"
                  className="fill-current text-[10px]"
                >
                  p{i + 1}
                </text>
                {/* q label */}
                <circle cx={x2} cy={PAD_Y} r="3.5" className="fill-current opacity-70" />
                <text x={x2} y={PAD_Y - 6} textAnchor="middle" className="fill-current text-[10px]">
                  q{i + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Q array — the inversion mirror */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-1 text-xs uppercase tracking-wider text-fg-subtle">
          Πίνακας Q (το q ταξινομημένο κατά p)
        </div>
        <div className="flex justify-center gap-1">
          {Q.map((v, i) => {
            const isPicked = pick && (pick[0] === i || pick[1] === i)
            return (
              <span
                key={i}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded border font-mono text-sm font-bold',
                  isPicked
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300 ring-2 ring-yellow-400'
                    : 'border-border bg-bg-soft text-fg',
                )}
              >
                {v}
              </span>
            )
          })}
        </div>
      </div>

      {/* Verdict */}
      {pick && (
        <div className="mb-3 rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <span className="text-fg-subtle">Ζεύγος (i, j) = ({pick[0] + 1}, {pick[1] + 1}). </span>
          <span className="font-mono text-fg">
            Q[{pick[0] + 1}] = {Q[pick[0]]}, Q[{pick[1] + 1}] = {Q[pick[1]]}
          </span>
          <span
            className={cn(
              'ml-2 rounded px-1.5 py-0.5 font-semibold',
              isCrossing
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-emerald-500/20 text-emerald-300',
            )}
          >
            {isCrossing ? '✗ Τέμνονται · Αντιστροφή' : '✓ Ταξινομημένο ζεύγος · Δεν τέμνονται'}
          </span>
        </div>
      )}

      {/* Pair picker */}
      <div className="mb-3 grid grid-cols-7 gap-1 text-xs">
        {P.map((_, i) =>
          P.map((__, j) => {
            if (i >= j) return <span key={`${i}_${j}`} />
            const inv = Q[i] > Q[j]
            const active = pick && pick[0] === i && pick[1] === j
            return (
              <button
                key={`${i}_${j}`}
                type="button"
                onClick={() => setPick([i, j])}
                className={cn(
                  'rounded border px-1 py-0.5 font-mono',
                  active
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                    : inv
                      ? 'border-rose-500/40 bg-rose-500/5 text-rose-300 hover:bg-rose-500/15'
                      : 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/15',
                )}
              >
                {i + 1},{j + 1}
              </button>
            )
          }),
        )}
      </div>

      {/* Footer ledger */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border bg-bg-soft/40 px-2 py-1">
          <div className="text-fg-subtle">Συνολικές τομές</div>
          <div className="font-mono text-fg">{pairs.length}</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft/40 px-2 py-1">
          <div className="text-fg-subtle">Αντιστροφές στον Q</div>
          <div className="font-mono text-fg">{pairs.length}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAll((b) => !b)}
          className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80"
        >
          {showAll ? '— Κρύψε όλες' : 'Φώτισε όλα τα τμήματα με ≥1 τομή'}
        </button>
        <button
          type="button"
          onClick={() => setPick(null)}
          className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80"
        >
          Καθάρισε επιλογή
        </button>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Διάλεξε δύο τμήματα από το πλέγμα κουμπιών παραπάνω (i, j με i &lt; j).
        Πάνω βλέπεις αν τα δύο τμήματα τέμνονται — κάτω αν το ζευγάρι (Q[i], Q[j])
        είναι αντιστροφή. Πάντα συμπίπτουν. Η μέτρηση τομών είναι λοιπόν το ίδιο
        πρόβλημα με τη μέτρηση αντιστροφών του L04 — Θ(n log n) με τη
        merge-and-count.
      </p>
    </section>
  )
}
