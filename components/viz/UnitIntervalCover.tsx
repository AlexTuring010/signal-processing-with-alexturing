'use client'

/**
 * UnitIntervalCover — άπληστο κάλυμμα σημείων με μοναδιαία διαστήματα.
 *
 * Front-set-7-ask7: cover n points with the fewest unit-length closed
 * intervals. Greedy: pick the leftmost uncovered point y, place [y, y+1],
 * skip every covered point, repeat. This viz draws a number line of 9 sample
 * points and walks the algorithm: at each step the active point is ringed,
 * the unit interval is drawn around it, and every point inside fades green.
 * Lands the «το αριστερότερο ακάλυπτο πάντα ορίζει το επόμενο διάστημα» rule
 * visually. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const POINTS = [0.3, 0.7, 1.2, 1.6, 2.4, 3.1, 3.5, 4.6, 5.0]

type Iv = { left: number; right: number; coversIdx: number[] }

function runGreedy(): Iv[] {
  const sorted = [...POINTS].sort((a, b) => a - b)
  const idx = sorted.map((_, i) => i)
  const placed: Iv[] = []
  let i = 0
  while (i < sorted.length) {
    const left = sorted[i]
    const right = left + 1
    const covered: number[] = []
    let j = i
    while (j < sorted.length && sorted[j] <= right + 1e-9) {
      covered.push(idx[j])
      j++
    }
    placed.push({ left, right, coversIdx: covered })
    i = j
  }
  return placed
}

const IVS = runGreedy()
const STEPS = IVS.length

const VIEW_W = 700
const PAD_L = 40
const PAD_R = 24
const PLOT_W = VIEW_W - PAD_L - PAD_R
const Y_AXIS = 80
const T_MAX = 6

const X = (t: number) => PAD_L + (t / T_MAX) * PLOT_W

export function UnitIntervalCover() {
  const [step, setStep] = useState(0)

  const last = STEPS
  const done = step === last

  const placedIvs = IVS.slice(0, step)
  const coveredIdx = useMemo(
    () => new Set(IVS.slice(0, step).flatMap((iv) => iv.coversIdx)),
    [step],
  )
  const cur = step > 0 ? IVS[step - 1] : null
  const nextUncoveredIdx = useMemo(() => {
    const sorted = [...POINTS].sort((a, b) => a - b)
    for (let i = 0; i < sorted.length; i++) {
      if (!coveredIdx.has(i)) return i
    }
    return -1
  }, [coveredIdx])

  let note: string
  if (step === 0) {
    note =
      'Έχουμε 9 σημεία στην ευθεία. Ο άπληστος βρίσκει το αριστερότερο ακάλυπτο και τοποθετεί ένα διάστημα μήκους 1 που ξεκινά εκεί. Πάτα «Επόμενο».'
  } else if (cur && nextUncoveredIdx === -1) {
    note = `Όλα τα σημεία καλύπτονται από ${step} διαστήματα. Δες τα στιγμιότυπα: το αριστερότερο σημείο κάθε διαστήματος ορίζει την αριστερή του άκρη — έτσι το διάστημα «απλώνεται» όσο πιο δεξιά γίνεται.`
  } else if (cur) {
    note = `Βήμα ${step}: διάστημα [${cur.left.toFixed(1)}, ${cur.right.toFixed(1)}] — καλύπτει ${cur.coversIdx.length} σημείο${cur.coversIdx.length === 1 ? '' : 'α'}. Συνεχίζουμε από το αμέσως επόμενο ακάλυπτο.`
  } else {
    note = ''
  }

  // current candidate left (preview the NEXT step)
  const sorted = [...POINTS].sort((a, b) => a - b)
  const nextLeft = nextUncoveredIdx !== -1 ? sorted[nextUncoveredIdx] : null

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ελάχιστα διαστήματα μήκους 1 — «αριστερότερο ακάλυπτο»
        </div>
        <div className="text-xs text-fg-subtle">{POINTS.length} σημεία</div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} 160`}
          className="mx-auto block w-full max-w-3xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* placed intervals */}
          {placedIvs.map((iv, i) => (
            <g key={`pl-${i}`}>
              <rect
                x={X(iv.left)}
                y={Y_AXIS - 28}
                width={X(iv.right) - X(iv.left)}
                height={56}
                rx={4}
                fill="#bbf7d0"
                stroke="#15803d"
                strokeWidth={1.8}
              />
              <text
                x={(X(iv.left) + X(iv.right)) / 2}
                y={Y_AXIS - 32}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#166534"
              >
                I{i + 1}: [{iv.left.toFixed(1)}, {iv.right.toFixed(1)}]
              </text>
            </g>
          ))}

          {/* candidate preview (next interval) when not done */}
          {!done && nextLeft !== null && (
            <g>
              <rect
                x={X(nextLeft)}
                y={Y_AXIS - 28}
                width={X(nextLeft + 1) - X(nextLeft)}
                height={56}
                rx={4}
                fill="none"
                stroke="#d97706"
                strokeWidth={2.5}
                strokeDasharray="5 3"
              />
              <text
                x={(X(nextLeft) + X(nextLeft + 1)) / 2}
                y={Y_AXIS - 32}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#92400e"
              >
                I{step + 1}: [{nextLeft.toFixed(1)}, {(nextLeft + 1).toFixed(1)}]
              </text>
            </g>
          )}

          {/* number-line axis */}
          <line
            x1={X(0)}
            y1={Y_AXIS}
            x2={X(T_MAX)}
            y2={Y_AXIS}
            stroke="#9b8a8d"
            strokeWidth={1.5}
          />
          {Array.from({ length: T_MAX + 1 }, (_, t) => t).map((t) => (
            <g key={`tk-${t}`}>
              <line
                x1={X(t)}
                y1={Y_AXIS - 4}
                x2={X(t)}
                y2={Y_AXIS + 4}
                stroke="#9b8a8d"
                strokeWidth={1}
              />
              <text x={X(t)} y={Y_AXIS + 16} textAnchor="middle" fontSize={10} fill="#9b8a8d">
                {t}
              </text>
            </g>
          ))}

          {/* points */}
          {sorted.map((p, i) => {
            const covered = coveredIdx.has(i)
            const isNext = !done && i === nextUncoveredIdx
            return (
              <g key={`p-${i}`}>
                <circle
                  cx={X(p)}
                  cy={Y_AXIS}
                  r={isNext ? 8 : 6}
                  fill={covered ? '#22c55e' : isNext ? '#fde68a' : '#1c1214'}
                  stroke={isNext ? '#d97706' : '#1c1214'}
                  strokeWidth={isNext ? 2.5 : 1.5}
                />
                <text
                  x={X(p)}
                  y={Y_AXIS + 36}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={isNext ? 700 : 600}
                  fill={covered ? '#15803d' : isNext ? '#d97706' : '#1c1214'}
                >
                  {p.toFixed(1)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{note}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Προηγ.
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(last, step + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          Επόμ. <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg-muted hover:bg-bg-soft"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Διαστήματα: {placedIvs.length}
        </span>
        {done && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            ✓ {STEPS} διαστήματα — βέλτιστο
          </span>
        )}
      </div>
    </section>
  )
}
