'use client'

/**
 * ClosestPairScan — the strip combine of the closest-pair algorithm.
 *
 * The subtle part of closest-pair is *not* the divide (a vertical median
 * line) — it is the combine: scanning the 2δ-wide strip and proving that
 * each point only checks a CONSTANT number of y-neighbours. This viz makes
 * that visible: the strip is drawn as a δ/2 × δ/2 box grid (≤ 1 point per
 * box), and for each point a 2δ × δ look-ahead window lights up — never
 * more than ~12 boxes, so never more than a constant number of checks,
 * whatever n is. Built for L05.
 *
 * The point layout is hand-designed, not random: every same-side pair is
 * ≥ δ apart (consistent with δ being the per-side minimum) and exactly one
 * cross pair (C–Y) is closer than δ — the pair the recursion misses.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const BOX = 42
const COLS = 4
const ROWS = 8
const GX = 70
const GY = 46
const LX = GX + 2 * BOX // dividing line L, between columns 1 and 2

type Pt = { id: string; col: number; row: number }

/** Hand-designed: ≤ 1 point per box, all same-side pairs ≥ δ apart, and
 *  exactly one cross pair (C–Y) closer than δ. Listed in y-sorted order. */
const POINTS: Pt[] = [
  { id: 'A', col: 1, row: 0 },
  { id: 'W', col: 3, row: 0 },
  { id: 'B', col: 0, row: 2 },
  { id: 'X', col: 2, row: 2 },
  { id: 'C', col: 1, row: 4 },
  { id: 'Y', col: 2, row: 4 },
  { id: 'D', col: 0, row: 6 },
  { id: 'Z', col: 3, row: 6 },
]
const CLOSEST = [4, 5] // indices of C and Y

const side = (p: Pt): 'L' | 'R' => (p.col < 2 ? 'L' : 'R')
const cx = (col: number) => GX + col * BOX + BOX / 2
const cy = (row: number) => GY + row * BOX + BOX / 2

/** Forward y-neighbours of point i that lie inside the 3-row window. */
function windowCandidates(i: number): number[] {
  const out: number[] = []
  for (let j = i + 1; j < POINTS.length; j++) {
    if (POINTS[j].row <= POINTS[i].row + 2) out.push(j)
  }
  return out
}

export function ClosestPairScan() {
  const [step, setStep] = useState(0) // 0 = intro, 1..8 = scanning point step-1

  const curIdx = step - 1
  const cur = step > 0 ? POINTS[curIdx] : null
  const cands = cur ? windowCandidates(curIdx) : []
  const winRows = cur ? Math.min(3, ROWS - cur.row) : 0
  const last = ROWS

  let note: string
  if (step === 0) {
    note =
      'Η ζώνη πλάτους 2δ γύρω από τη γραμμή L, χωρισμένη σε κουτιά δ/2 × δ/2. Κάθε κουτί χωράει το πολύ 1 σημείο — δύο σημεία στο ίδιο κουτί θα απείχαν < δ, κάτι που η αναδρομή θα είχε ήδη βρει. Πάτα «Επόμενο» για να σαρώσεις τα σημεία κατά y.'
  } else if (curIdx === 4) {
    note = `Σημείο C (5 από 8). Σύντροφος σε απόσταση < δ μπορεί να βρίσκεται μόνο μέσα στο φωτισμένο παράθυρο 2δ × δ — ≤ 12 κουτιά, άρα ${cands.length} έλεγχοι. Και να το: το Y, απέναντι από τη L, σχηματίζει ζευγάρι κοντινότερο από δ. Αυτό ακριβώς χάνει η αναδρομή και πιάνει η σάρωση της ζώνης.`
  } else {
    note = `Σημείο ${cur!.id} (${step} από 8). Σύντροφος σε απόσταση < δ μπορεί να βρίσκεται μόνο στο φωτισμένο παράθυρο — τις επόμενες κατά y σειρές κουτιών. Εκεί χωράνε ≤ 12 κουτιά (≤ 1 σημείο το καθένα), άρα το ${cur!.id} ελέγχει μόνο ${cands.length} ${cands.length === 1 ? 'γείτονα' : 'γείτονες'}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σάρωση της ζώνης — γιατί κάθε σημείο ελέγχει σταθερό πλήθος γειτόνων
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Τέλος' : step === 0 ? 'Η ζώνη' : 'Σάρωση'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Τα σημεία ταξινομημένα κατά y· σαρώνουμε από πάνω προς τα κάτω.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 280 416"
          className="mx-auto w-full max-w-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .cp-box { fill: none; stroke: rgb(var(--border)); stroke-width: 1; }
            .cp-win { fill: rgb(var(--accent) / 0.12); }
            .cp-strip { fill: none; stroke: rgb(var(--border-strong)); stroke-width: 1.5; }
            .cp-line-l { stroke: rgb(var(--fg)); stroke-width: 2; stroke-dasharray: 5 3; }
            .cp-delta { stroke: rgb(var(--fg-muted)); stroke-width: 1.5; }
            .cp-cand { stroke: rgb(148 163 184); stroke-width: 1.5; stroke-dasharray: 3 2; }
            .cp-cross { stroke: rgb(234 179 8); stroke-width: 2; }
            .cp-closest { stroke: rgb(34 197 94); stroke-width: 3.5; }
            .cp-txt { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg)); }
            .cp-sub { font: 500 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
            .cp-id { font: 700 10px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
          `}</style>

          {/* top label */}
          <text x={GX + 2 * BOX} y="20" textAnchor="middle" className="cp-txt">
            ζώνη πλάτους 2δ
          </text>
          <line x1={GX} y1="28" x2={GX + 4 * BOX} y2="28" className="cp-delta" />
          <line x1={GX} y1="24" x2={GX} y2="32" className="cp-delta" />
          <line x1={GX + 4 * BOX} y1="24" x2={GX + 4 * BOX} y2="32" className="cp-delta" />

          {/* active look-ahead window */}
          {cur && (
            <rect
              x={GX}
              y={GY + cur.row * BOX}
              width={4 * BOX}
              height={winRows * BOX}
              className="cp-win"
            />
          )}

          {/* box grid */}
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={GX + c * BOX}
                y={GY + r * BOX}
                width={BOX}
                height={BOX}
                className="cp-box"
              />
            )),
          )}

          {/* strip outline + dividing line */}
          <rect x={GX} y={GY} width={4 * BOX} height={ROWS * BOX} className="cp-strip" />
          <line x1={LX} y1={GY - 6} x2={LX} y2={GY + ROWS * BOX + 6} className="cp-line-l" />
          <text x={LX} y={GY + ROWS * BOX + 20} textAnchor="middle" className="cp-sub">
            γραμμή L
          </text>

          {/* δ bracket (left margin, spans two box rows) */}
          <line x1="40" y1={GY} x2="40" y2={GY + 2 * BOX} className="cp-delta" />
          <line x1="36" y1={GY} x2="44" y2={GY} className="cp-delta" />
          <line x1="36" y1={GY + 2 * BOX} x2="44" y2={GY + 2 * BOX} className="cp-delta" />
          <text x="26" y={GY + BOX + 4} textAnchor="middle" className="cp-txt">
            δ
          </text>
          <text x="40" y={GY + 2 * BOX + 16} textAnchor="middle" className="cp-sub">
            δ/2
          </text>
          <line x1="40" y1={GY + 2 * BOX + 20} x2="40" y2={GY + 3 * BOX} className="cp-delta" />
          <line x1="36" y1={GY + 3 * BOX} x2="44" y2={GY + 3 * BOX} className="cp-delta" />

          {/* candidate lines from the current point */}
          {cur &&
            cands.map((j) => {
              const p = POINTS[j]
              const isClosest =
                CLOSEST.includes(curIdx) && CLOSEST.includes(j)
              const cross = side(p) !== side(cur)
              return (
                <line
                  key={`ln-${j}`}
                  x1={cx(cur.col)}
                  y1={cy(cur.row)}
                  x2={cx(p.col)}
                  y2={cy(p.row)}
                  className={
                    isClosest ? 'cp-closest' : cross ? 'cp-cross' : 'cp-cand'
                  }
                />
              )
            })}

          {/* persistent closest-pair line once discovered */}
          {step > CLOSEST[0] && curIdx !== CLOSEST[0] && (
            <line
              x1={cx(POINTS[CLOSEST[0]].col)}
              y1={cy(POINTS[CLOSEST[0]].row)}
              x2={cx(POINTS[CLOSEST[1]].col)}
              y2={cy(POINTS[CLOSEST[1]].row)}
              className="cp-closest"
            />
          )}

          {/* points */}
          {POINTS.map((p, i) => {
            const isCur = i === curIdx
            const isCand = cands.includes(i)
            const isClosest = step > CLOSEST[0] && CLOSEST.includes(i)
            return (
              <g key={p.id}>
                <circle
                  cx={cx(p.col)}
                  cy={cy(p.row)}
                  r={isCur ? 10 : 7}
                  fill={
                    side(p) === 'L' ? 'rgb(244 63 94)' : 'rgb(56 189 248)'
                  }
                  stroke={
                    isCur
                      ? 'rgb(var(--accent))'
                      : isClosest
                        ? 'rgb(34 197 94)'
                        : isCand
                          ? 'rgb(var(--fg))'
                          : 'rgb(var(--bg-elevated))'
                  }
                  strokeWidth={isCur || isClosest ? 3 : 1.5}
                />
                <text x={cx(p.col)} y={cy(p.row) - 12} className="cp-id">
                  {p.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> αριστερά της L
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" /> δεξιά της L
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-yellow-500" /> μικτός υποψήφιος
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-green-500" /> κοντινότερο ζευγάρι
        </span>
      </div>

      {/* per-point check counter */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Έλεγχοι γι' αυτό το σημείο
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {step === 0 ? '—' : cands.length}
        </span>
        <span className="ml-auto text-xs text-fg-muted">
          Εγγύηση: ≤ 11, ανεξάρτητα από το n
        </span>
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
