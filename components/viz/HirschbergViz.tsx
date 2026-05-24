'use client'

/**
 * HirschbergViz — the linear-space alignment algorithm, the hardest idea in
 * L16, made into something you can operate.
 *
 * The trick has three moving parts that no static picture lands:
 *
 *  1. f(i,j) — shortest path from the START corner — sweeps in from the left.
 *  2. g(i,j) — shortest path to the END corner — sweeps in from the right.
 *  3. On the MIDDLE column, f(i,mid) + g(i,mid) is the cost of the best path
 *     forced through row i. Its minimum row q is therefore ON some optimal
 *     alignment — one cell of the answer, pinned down with only linear space.
 *
 * Then divide-and-conquer: recurse into the two rectangles around (q,mid).
 * The viz reveals the recursion level by level, the boxes halving each time,
 * and tallies the total area worked — mn + mn/2 + mn/4 + … ≤ 2mn — so the
 * O(mn) time survives. Built for L16 on the shared GTTACG / GATTACAG instance.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HB_X, HB_Y, buildEditTable, optimalSteps } from './alignment-instance'

const X = HB_X
const Y = HB_Y
const M = X.length // 6
const N = Y.length // 8
const MID = N / 2 // 4

const reverse = (s: string) => s.split('').reverse().join('')

// f(i,j) = shortest path (0,0) → (i,j); g(i,j) = shortest path (i,j) → (m,n)
const F = buildEditTable(X, Y)
const GREV = buildEditTable(reverse(X), reverse(Y))
const G = (i: number, j: number) => GREV[M - i][N - j]

// the middle-column analysis: f + g on every row, and its minimiser q
const MIDDLE = Array.from({ length: M + 1 }, (_, i) => ({
  i,
  f: F[i][MID],
  g: G(i, MID),
  sum: F[i][MID] + G(i, MID),
}))
const Q = MIDDLE.reduce((best, r) => (r.sum < MIDDLE[best].sum ? r.i : best), 0)

type Box = { i0: number; i1: number; j0: number; j1: number }
type Pivot = { i: number; j: number; depth: number }

// run the recursion once, collecting boxes per depth, pivots, and path cells
const BOXES: Box[][] = []
const PIVOTS: Pivot[] = []
const PATH = new Set<string>()

function solve(box: Box, depth: number) {
  if (!BOXES[depth]) BOXES[depth] = []
  BOXES[depth].push(box)
  if (box.j1 - box.j0 <= 1) {
    // base case — the optimal path of a one-column-wide strip is forced
    PATH.add(`${box.i0},${box.j0}`)
    for (const s of optimalSteps(
      X.slice(box.i0, box.i1),
      Y.slice(box.j0, box.j1),
    )) {
      PATH.add(`${box.i0 + s.i1},${box.j0 + s.j1}`)
    }
    return
  }
  const mid = Math.floor((box.j0 + box.j1) / 2)
  const fTab = buildEditTable(
    X.slice(box.i0, box.i1),
    Y.slice(box.j0, box.j1),
  )
  const gTab = buildEditTable(
    reverse(X.slice(box.i0, box.i1)),
    reverse(Y.slice(box.j0, box.j1)),
  )
  let q = box.i0
  let best = Infinity
  for (let i = box.i0; i <= box.i1; i++) {
    const sum =
      fTab[i - box.i0][mid - box.j0] + gTab[box.i1 - i][box.j1 - mid]
    if (sum < best) {
      best = sum
      q = i
    }
  }
  PIVOTS.push({ i: q, j: mid, depth })
  PATH.add(`${q},${mid}`)
  solve({ i0: box.i0, i1: q, j0: box.j0, j1: mid }, depth + 1)
  solve({ i0: q, i1: box.i1, j0: mid, j1: box.j1 }, depth + 1)
}
solve({ i0: 0, i1: M, j0: 0, j1: N }, 0)

const MAX_DEPTH = BOXES.length - 1
const AREA = BOXES.map((boxes) =>
  boxes.reduce((a, b) => a + (b.i1 - b.i0) * (b.j1 - b.j0), 0),
)

const LAST = 8
// geometry (px) — vertices ARE cells, boxes span centre-to-centre
const CELL = 34
const HEAD_W = 26
const HEAD_H = 22
const cx = (j: number) => HEAD_W + j * CELL + CELL / 2
const cy = (i: number) => HEAD_H + i * CELL + CELL / 2

export function HirschbergViz() {
  const [step, setStep] = useState(0)

  const numeric = step >= 2 && step <= 4
  // recursion frontier: which depth of boxes is "active"
  const frontier = step < 5 ? -1 : Math.min(step - 4, MAX_DEPTH)
  const pivotDepth = step - 5 // pivots with depth ≤ this are shown
  const showPath = step === LAST

  const cellNumber = (i: number, j: number): number | null => {
    if (step < 2) return null
    if (step === 2) return j <= MID ? F[i][j] : null
    if (step === 3) return j < MID ? F[i][j] : G(i, j)
    // step ≥ 4
    if (j < MID) return F[i][j]
    if (j === MID) return F[i][j] + G(i, j)
    return G(i, j)
  }

  let note: string
  if (step === 0)
    note =
      'Η βέλτιστη ευθυγράμμιση είναι ένα μονοπάτι (0,0) → (m,n) μέσα σ’ αυτό το πλέγμα m×n. Θα το βρούμε ΧΩΡΙΣ ποτέ να κρατήσουμε όλο το πλέγμα στη μνήμη.'
  else if (step === 1)
    note = `Κόψε το πλέγμα στη μεσαία στήλη j = n/2 = ${MID}. Όλη η δουλειά γίνεται γύρω της.`
  else if (step === 2)
    note =
      'f(i,j) = συντομότερο μονοπάτι από την αρχή (0,0). Σαρώνει από αριστερά — και υπολογίζεται κρατώντας μόνο 2 στήλες, σε γραμμικό χώρο.'
  else if (step === 3)
    note =
      'g(i,j) = συντομότερο μονοπάτι ΠΡΟΣ το τέλος (m,n). Το ίδιο ακριβώς, με αντεστραμμένες ακμές, σαρώνοντας από δεξιά.'
  else if (step === 4)
    note = `Στη μεσαία στήλη, f + g = το κόστος του καλύτερου μονοπατιού που ΠΕΡΝΑ από κάθε κελί. Το ελάχιστο (${MIDDLE[Q].sum}) είναι στη γραμμή q = ${Q}.`
  else if (step === 5)
    note = `Άρα κάποια βέλτιστη ευθυγράμμιση περνά από το (q, n/2) = (${Q}, ${MID}). Ένα κελί της απάντησης — κλειδωμένο με γραμμικό χώρο. Σπάμε το πρόβλημα στα δύο ορθογώνια γύρω του.`
  else if (step === 6)
    note =
      'Μέσα σε κάθε ορθογώνιο: ξανά το ίδιο κόλπο, στη δική του μεσαία στήλη. Διαίρει-και-κυρίευε — να οι επόμενες κορυφές.'
  else if (step === 7)
    note =
      'Και πάλι αναδρομικά. Τα ορθογώνια υποδιπλασιάζονται, οι κλειδωμένες κορυφές πληθαίνουν.'
  else
    note =
      'Τα ορθογώνια έγιναν μία στήλη πλατιά — βασική περίπτωση, το μονοπάτι είναι προφανές. Ένωσε τα κομμάτια: να η πλήρης βέλτιστη ευθυγράμμιση, βρεμένη σε O(m+n) χώρο.'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Hirschberg — η βέλτιστη κορυφή, μετά αναδρομή
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            showPath ? 'bg-success/15 text-success' : 'bg-accent/10 text-accent',
          )}
        >
          {showPath ? 'Πλήρες μονοπάτι' : `X=${X} · Y=${Y}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        DP για να βρεθεί η μεσαία κορυφή· διαίρει-και-κυρίευε για να σπάσει το
        πρόβλημα γύρω της.
      </p>

      <div className="flex flex-wrap gap-4">
        {/* the grid */}
        <div className="overflow-x-auto">
          <div
            className="relative"
            style={{
              width: HEAD_W + (N + 1) * CELL,
              height: HEAD_H + (M + 1) * CELL,
            }}
          >
            {/* column headers (Y) */}
            {Y.split('').map((ch, j) => (
              <div
                key={`yh${j}`}
                className="absolute flex items-center justify-center font-mono text-xs font-bold text-fg"
                style={{
                  left: HEAD_W + (j + 1) * CELL,
                  top: 0,
                  width: CELL,
                  height: HEAD_H,
                }}
              >
                {ch}
              </div>
            ))}
            {/* row headers (X) */}
            {X.split('').map((ch, i) => (
              <div
                key={`xh${i}`}
                className="absolute flex items-center justify-center font-mono text-xs font-bold text-fg"
                style={{
                  left: 0,
                  top: HEAD_H + (i + 1) * CELL,
                  width: HEAD_W,
                  height: CELL,
                }}
              >
                {ch}
              </div>
            ))}
            {/* cells */}
            {Array.from({ length: M + 1 }).flatMap((_, i) =>
              Array.from({ length: N + 1 }).map((_, j) => {
                const v = cellNumber(i, j)
                const onPath = showPath && PATH.has(`${i},${j}`)
                const isMinCell = step >= 4 && i === Q && j === MID
                const isMidColHi = j === MID && step >= 1 && step <= 5
                const half =
                  numeric && step >= 3
                    ? j < MID
                      ? 'f'
                      : j > MID
                        ? 'g'
                        : 'sum'
                    : null
                const tone = onPath
                  ? 'border-rose-500 bg-rose-500/25 font-bold text-fg'
                  : isMinCell
                    ? 'border-accent bg-accent/30 font-bold text-fg'
                    : isMidColHi
                      ? 'border-accent/60 bg-accent/10 text-fg'
                      : half === 'f'
                        ? 'border-border/70 bg-sky-400/10 text-fg-muted'
                        : half === 'g'
                          ? 'border-border/70 bg-emerald-400/10 text-fg-muted'
                          : 'border-border/70 bg-bg-soft/40 text-fg-muted'
                return (
                  <div
                    key={`c${i}-${j}`}
                    className={cn(
                      'absolute flex items-center justify-center rounded-sm border font-mono text-xs tabular-nums',
                      tone,
                    )}
                    style={{
                      left: HEAD_W + j * CELL + 1,
                      top: HEAD_H + i * CELL + 1,
                      width: CELL - 2,
                      height: CELL - 2,
                    }}
                  >
                    {v}
                  </div>
                )
              }),
            )}
            {/* recursion boxes — current frontier */}
            {frontier >= 1 &&
              BOXES[frontier]?.map((b, idx) => {
                if (b.i1 === b.i0 || b.j1 === b.j0) return null
                return (
                  <div
                    key={`box${idx}`}
                    className="pointer-events-none absolute rounded-sm border-2 border-dashed border-accent/80"
                    style={{
                      left: cx(b.j0),
                      top: cy(b.i0),
                      width: (b.j1 - b.j0) * CELL,
                      height: (b.i1 - b.i0) * CELL,
                    }}
                  />
                )
              })}
            {/* each frontier box's own middle column */}
            {frontier >= 1 &&
              BOXES[frontier]?.map((b, idx) => {
                if (b.j1 - b.j0 <= 1) return null
                const mid = Math.floor((b.j0 + b.j1) / 2)
                return (
                  <div
                    key={`mid${idx}`}
                    className="pointer-events-none absolute border-l border-dashed border-accent/70"
                    style={{
                      left: cx(mid),
                      top: cy(b.i0),
                      height: (b.i1 - b.i0) * CELL,
                    }}
                  />
                )
              })}
            {/* locked pivots */}
            {PIVOTS.filter((p) => p.depth <= pivotDepth).map((p, idx) => (
              <div
                key={`piv${idx}`}
                className="pointer-events-none absolute flex items-center justify-center rounded-full border-2 border-accent bg-accent"
                style={{
                  left: cx(p.j) - 7,
                  top: cy(p.i) - 7,
                  width: 14,
                  height: 14,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-bg-elevated" />
              </div>
            ))}
          </div>
        </div>

        {/* side panels */}
        {step >= 2 && (
        <div className="flex min-w-[180px] flex-1 flex-col gap-3">
          {/* middle-column f + g */}
          {step >= 4 && (
            <div className="rounded-lg border border-border bg-bg-soft/30 p-2">
              <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
                Μεσαία στήλη — f + g
              </div>
              <div className="grid grid-cols-4 gap-px text-center font-mono text-xs">
                {['i', 'f', 'g', 'f+g'].map((h) => (
                  <div key={h} className="py-0.5 font-bold text-fg-subtle">
                    {h}
                  </div>
                ))}
                {MIDDLE.map((r) => (
                  <div key={r.i} className="contents">
                    {[r.i, r.f, r.g, r.sum].map((val, k) => (
                      <div
                        key={k}
                        className={cn(
                          'rounded-sm py-0.5',
                          r.i === Q
                            ? 'bg-accent/25 font-bold text-fg'
                            : 'bg-bg-soft/40 text-fg-muted',
                        )}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[0.7rem] leading-snug text-fg-muted">
                Ελάχιστο f+g στη γραμμή q = {Q}: η βέλτιστη ευθυγράμμιση περνά
                από το ({Q}, {MID}).
              </p>
            </div>
          )}

          {/* area / time ledger */}
          {step >= 4 && (
            <div className="rounded-lg border border-border bg-bg-soft/30 p-2">
              <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
                Δουλειά ανά επίπεδο αναδρομής
              </div>
              <div className="space-y-1 font-mono text-xs">
                {AREA.map((a, d) => {
                  const shown =
                    d === 0 ? step >= 4 : step >= 5 + d
                  const cum = AREA.slice(0, d + 1).reduce((x, y) => x + y, 0)
                  return (
                    <div
                      key={d}
                      className={cn(
                        'flex items-center justify-between rounded-sm px-1.5 py-0.5',
                        shown
                          ? 'bg-bg-soft/60 text-fg'
                          : 'text-transparent',
                      )}
                    >
                      <span>επίπεδο {d}</span>
                      <span className="text-fg-muted">εμβαδόν {a}</span>
                      <span className="font-bold">Σ {cum}</span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-1.5 text-[0.7rem] leading-snug text-fg-muted">
                Κάθε επίπεδο υποδιπλασιάζει το εμβαδόν: mn + mn/2 + mn/4 + … ≤
                2mn = <strong className="text-fg">O(mn)</strong> χρόνος.
              </p>
            </div>
          )}

          {/* legend */}
          {numeric && (
            <div className="flex flex-col gap-1 text-[0.7rem] text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-sky-400/30" />
                f — από την αρχή
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-emerald-400/30" />
                g — προς το τέλος
              </span>
            </div>
          )}
        </div>
        )}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[3.75rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          showPath
            ? 'border-success/50 bg-success/10 text-fg'
            : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={step === LAST}
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
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
