'use client'

/**
 * GreedyHorizon — why a greedy algorithm needs a proof.
 *
 * A greedy algorithm commits to the locally-best move and never looks back.
 * This viz makes that visceral: a hiker who can only see the ground right at
 * its feet always steps toward higher ground — and, depending on where it
 * starts, either reaches the true summit or gets stranded on a foothill,
 * never knowing the difference. That gap between "locally best" and
 * "globally best" is the whole reason every greedy rule in L11–L13 must be
 * PROVEN, not just believed. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Terrain heights, left to right. One global summit (idx 14), two foothills. */
const TERRAIN = [
  18, 30, 44, 56, 62, 54, 40, 28, 20, 30, 46, 60, 74, 86, 95, 88, 72, 54, 40,
  30, 44, 56, 48,
]
const SUMMIT = 14 // index of the global maximum

type Start = { idx: number; label: string }
const STARTS: Start[] = [
  { idx: 0, label: 'Αριστερά' },
  { idx: 8, label: 'Κοιλάδα' },
  { idx: 16, label: 'Πλαγιά' },
  { idx: 22, label: 'Δεξιά' },
]

/** Greedy hill-climb from a start index: keep stepping to the higher neighbour. */
function climb(start: number): number[] {
  const path = [start]
  let i = start
  while (path.length < TERRAIN.length + 2) {
    const left = i - 1 >= 0 ? TERRAIN[i - 1] : -Infinity
    const right = i + 1 < TERRAIN.length ? TERRAIN[i + 1] : -Infinity
    if (Math.max(left, right) <= TERRAIN[i]) break // local maximum — greedy stops
    i = right > left ? i + 1 : i - 1
    path.push(i)
  }
  return path
}

const VIEW_W = 640
const VIEW_H = 286
const PAD_X = 40
const STEP_X = (VIEW_W - PAD_X - 22) / (TERRAIN.length - 1)
const BASE_Y = 236
const H_SCALE = 1.95
const X = (i: number) => PAD_X + i * STEP_X
const Y = (h: number) => BASE_Y - h * H_SCALE

export function GreedyHorizon() {
  const [startIdx, setStartIdx] = useState(0)
  const [step, setStep] = useState(0)

  const path = useMemo(() => climb(startIdx), [startIdx])
  const last = path.length - 1
  const done = step === last
  const here = path[step]
  const endIdx = path[last]
  const reachedSummit = endIdx === SUMMIT

  function pickStart(idx: number) {
    setStartIdx(idx)
    setStep(0)
  }

  const left = here - 1 >= 0 ? TERRAIN[here - 1] : null
  const right = here + 1 < TERRAIN.length ? TERRAIN[here + 1] : null
  const goesRight = step < last && path[step + 1] === here + 1

  let note: string
  if (!done) {
    const dir = goesRight ? 'δεξιά' : 'αριστερά'
    const winner = goesRight ? right : left
    note = `Θέση ${here} · ύψος ${TERRAIN[here]}. Ο πεζοπόρος βλέπει ΜΟΝΟ τα δύο διπλανά σημεία — αριστερά ${
      left ?? '—'
    }, δεξιά ${right ?? '—'}. Το ψηλότερο είναι ${dir} (${winner}), οπότε ανεβαίνει εκεί.`
  } else if (reachedSummit) {
    note = `Ο πεζοπόρος έφτασε στην κορυφή — ύψος ${TERRAIN[SUMMIT]}, το ψηλότερο σημείο όλου του τοπίου. Εδώ ο άπληστος κανόνας πέτυχε. Αλλά πρόσεξε: πέτυχε επειδή ξεκίνησε στη σωστή «λεκάνη».`
  } else {
    note = `Κόλλημα σε λοφίσκο ύψους ${TERRAIN[endIdx]}. Και οι δύο γείτονες είναι χαμηλότεροι, άρα ο κανόνας «ανέβα» δεν έχει πού να πάει — ο πεζοπόρος σταματά. Η αληθινή κορυφή (${TERRAIN[SUMMIT]}) είναι αλλού, αλλά κοιτάζοντας μόνο τα πόδια του δεν τη βλέπει ποτέ.`
  }

  // ridge polyline + filled mountain polygon
  const ridge = TERRAIN.map((h, i) => `${X(i)},${Y(h)}`).join(' ')
  const mountain = `${X(0)},${BASE_Y} ${ridge} ${X(TERRAIN.length - 1)},${BASE_Y}`
  const trail = path.slice(0, step + 1).map((i) => `${X(i)},${Y(TERRAIN[i]) - 14}`).join(' ')

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + start picker */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο άπληστος πεζοπόρος — τοπικά πάντα ψηλότερα
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {STARTS.map((s) => (
            <button
              key={s.idx}
              type="button"
              onClick={() => pickStart(s.idx)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                startIdx === s.idx
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ίδιος κανόνας («κάνε το βήμα προς τα πάνω»), διαφορετική αφετηρία. Διάλεξε
        αφετηρία και πάτα «Επόμενο».
      </p>

      {/* terrain canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gh-mtn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="100%" stopColor="#dce9d5" />
            </linearGradient>
            <marker
              id="gh-arr"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          {/* mountain body + ridge */}
          <polygon points={mountain} fill="url(#gh-mtn)" />
          <polyline
            points={ridge}
            fill="none"
            stroke="#4d7c4f"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <line
            x1={X(0)}
            y1={BASE_Y}
            x2={X(TERRAIN.length - 1)}
            y2={BASE_Y}
            stroke="#9b8a8d"
            strokeWidth={1.5}
          />

          <g>
            <line
              x1={X(SUMMIT)}
              y1={Y(TERRAIN[SUMMIT])}
              x2={X(SUMMIT)}
              y2={Y(TERRAIN[SUMMIT]) - 34}
              stroke="#a16207"
              strokeWidth={2}
            />
            <path
              d={`M ${X(SUMMIT)} ${Y(TERRAIN[SUMMIT]) - 34} l 20 6 l -20 7 z`}
              fill="#f59e0b"
              stroke="#a16207"
              strokeWidth={1.2}
            />
            <text
              x={X(SUMMIT)}
              y={Y(TERRAIN[SUMMIT]) - 44}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#a16207"
            >
              κορυφή
            </text>
          </g>

          {/* the two neighbours the hiker can currently see */}
          {!done &&
            [here - 1, here + 1].map((ni) =>
              ni >= 0 && ni < TERRAIN.length ? (
                <circle
                  key={ni}
                  cx={X(ni)}
                  cy={Y(TERRAIN[ni])}
                  r={7}
                  fill="#fde68a"
                  stroke="#d97706"
                  strokeWidth={2}
                />
              ) : null,
            )}

          {/* trail walked so far */}
          {step > 0 && (
            <polyline
              points={trail}
              fill="none"
              stroke="#9f1239"
              strokeWidth={2}
              strokeDasharray="3 3"
              strokeLinejoin="round"
            />
          )}

          {/* step arrow */}
          {!done && (
            <line
              x1={X(here)}
              y1={Y(TERRAIN[here]) - 14}
              x2={X(path[step + 1])}
              y2={Y(TERRAIN[path[step + 1]]) - 14}
              stroke="#9f1239"
              strokeWidth={2.5}
              markerEnd="url(#gh-arr)"
            />
          )}

          {/* the hiker */}
          <g>
            <circle
              cx={X(here)}
              cy={Y(TERRAIN[here]) - 14}
              r={9}
              fill={done ? (reachedSummit ? '#16a34a' : '#dc2626') : '#9f1239'}
              stroke="#ffffff"
              strokeWidth={2.5}
            />
            {done && (
              <text
                x={X(here)}
                y={Y(TERRAIN[here]) - 10}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="#ffffff"
              >
                {reachedSummit ? '✓' : '!'}
              </text>
            )}
          </g>

          {/* start marker */}
          <circle
            cx={X(startIdx)}
            cy={Y(TERRAIN[startIdx])}
            r={4}
            fill="#1c1214"
          />
          <text
            x={X(startIdx)}
            y={Y(TERRAIN[startIdx]) + 20}
            textAnchor="middle"
            fontSize={9}
            fontWeight={600}
            fill="#5a4a4d"
          >
            αφετηρία
          </text>
        </svg>
      </div>

      {/* height readout */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Ύψος
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {TERRAIN[here]}
        </span>
        <span className="text-sm text-fg-muted">/ κορυφή: {TERRAIN[SUMMIT]}</span>
        {done && (
          <span
            className={cn(
              'ml-auto rounded-md px-2 py-0.5 text-sm font-bold',
              reachedSummit
                ? 'bg-success/15 text-success'
                : 'bg-danger/15 text-danger',
            )}
          >
            {reachedSummit
              ? '✓ Έφτασε στην κορυφή'
              : `✗ Κόλλησε ${TERRAIN[SUMMIT] - TERRAIN[endIdx]} κάτω απ' την κορυφή`}
          </span>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[4.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
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
