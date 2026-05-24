'use client'

/**
 * GridGreedyVsOpt — όταν «φθηνότερο επόμενο» δεν αρκεί.
 *
 * Front-set-7-ask5: bottom-row → top-row grid path, 3 allowed moves per step
 * (up, up-left, up-right). The local greedy minimizes the next cell — the
 * actual minimum-cost path is a DP. This viz draws the canonical 4×5 grid
 * from the prompt, walks the greedy path with running total 17, and reveals
 * the true optimum 16 with a colored diff. The student SEES the greedy taking
 * a cheap step that locks it out of the «2» and the «3» in the upper rows.
 * Built for L11.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** rows[0] = bottom row (starting); rows.length-1 = top row (target). */
const GRID: number[][] = [
  [4, 3, 6, 5, 9], // row 1 — bottom (start)
  [6, 8, 7, 7, 2], // row 2
  [5, 6, 7, 3, 4], // row 3
  [3, 9, 9, 6, 9], // row 4 — top (target)
]

const ROWS = GRID.length
const COLS = GRID[0].length

/** Greedy starting cell: min of bottom row → here, column 1 = "3". */
function pickStart(): number {
  let best = 0
  for (let c = 1; c < COLS; c++) if (GRID[0][c] < GRID[0][best]) best = c
  return best
}

/** From (r, c) pick the cheapest of (r+1, c-1), (r+1, c), (r+1, c+1). Ties → middle. */
function greedyNext(r: number, c: number): number {
  const opts: { col: number; v: number; order: number }[] = []
  if (c > 0) opts.push({ col: c - 1, v: GRID[r + 1][c - 1], order: 1 })
  opts.push({ col: c, v: GRID[r + 1][c], order: 0 })
  if (c < COLS - 1) opts.push({ col: c + 1, v: GRID[r + 1][c + 1], order: 2 })
  opts.sort((a, b) => a.v - b.v || a.order - b.order)
  return opts[0].col
}

function runGreedy(): { path: [number, number][]; cost: number } {
  const path: [number, number][] = []
  let r = 0
  let c = pickStart()
  path.push([r, c])
  let cost = GRID[r][c]
  while (r < ROWS - 1) {
    const nc = greedyNext(r, c)
    r++
    c = nc
    path.push([r, c])
    cost += GRID[r][c]
  }
  return { path, cost }
}

/** Brute-force optimum: DP over the grid. */
function runOpt(): { path: [number, number][]; cost: number } {
  const dp: number[][] = GRID.map((row) => row.map(() => Infinity))
  const parent: ([number, number] | null)[][] = GRID.map((row) =>
    row.map(() => null),
  )
  for (let c = 0; c < COLS; c++) dp[0][c] = GRID[0][c]
  for (let r = 1; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const dc of [-1, 0, 1]) {
        const pc = c + dc
        if (pc < 0 || pc >= COLS) continue
        const cand = dp[r - 1][pc] + GRID[r][c]
        if (cand < dp[r][c]) {
          dp[r][c] = cand
          parent[r][c] = [r - 1, pc]
        }
      }
    }
  }
  // pick best end at top row
  let endC = 0
  for (let c = 1; c < COLS; c++) if (dp[ROWS - 1][c] < dp[ROWS - 1][endC]) endC = c
  // backtrack
  const path: [number, number][] = []
  let cur: [number, number] | null = [ROWS - 1, endC]
  while (cur) {
    path.unshift(cur)
    cur = parent[cur[0]][cur[1]]
  }
  return { path, cost: dp[ROWS - 1][endC] }
}

const GREEDY = runGreedy()
const OPT = runOpt()

const CELL = 56
const PAD = 14

export function GridGreedyVsOpt() {
  const [show, setShow] = useState<'greedy' | 'opt' | 'both'>('greedy')
  const [step, setStep] = useState(0)

  // a step covers cells [0..step]. Step 0 = starting cell.
  const last = ROWS - 1
  const done = step === last

  const greedyCells = new Set(GREEDY.path.slice(0, step + 1).map(([r, c]) => `${r},${c}`))
  const optCells = new Set(OPT.path.slice(0, step + 1).map(([r, c]) => `${r},${c}`))
  const greedyEdgeKeys = new Set<string>()
  GREEDY.path.slice(0, step + 1).forEach((p, i) => {
    if (i === 0) return
    const prev = GREEDY.path[i - 1]
    greedyEdgeKeys.add(`${prev[0]},${prev[1]}-${p[0]},${p[1]}`)
  })
  const optEdgeKeys = new Set<string>()
  OPT.path.slice(0, step + 1).forEach((p, i) => {
    if (i === 0) return
    const prev = OPT.path[i - 1]
    optEdgeKeys.add(`${prev[0]},${prev[1]}-${p[0]},${p[1]}`)
  })

  const W = PAD * 2 + COLS * CELL
  const H = PAD * 2 + ROWS * CELL + 18

  // running totals along each path
  const greedyCost = GREEDY.path.slice(0, step + 1).reduce((s, [r, c]) => s + GRID[r][c], 0)
  const optCost = OPT.path.slice(0, step + 1).reduce((s, [r, c]) => s + GRID[r][c], 0)

  // y inversion: row 0 should render at bottom (y = high)
  const yOf = (r: number) => PAD + (ROWS - 1 - r) * CELL
  const xOf = (c: number) => PAD + c * CELL

  function lineSeg(path: [number, number][], color: string, dashed: boolean) {
    const subpath = path.slice(0, step + 1)
    if (subpath.length < 2) return null
    const pts = subpath.map(([r, c]) => `${xOf(c) + CELL / 2},${yOf(r) + CELL / 2}`).join(' ')
    return (
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={dashed ? '6 4' : undefined}
        strokeLinejoin="round"
      />
    )
  }

  let note: string
  if (step === 0) {
    note = `Ξεκινάμε στην κάτω γραμμή. Ο άπληστος αρπάζει τη φθηνότερη τιμή — κελί (1,${pickStart() + 1}) με κόστος ${GRID[0][pickStart()]}.`
  } else if (!done) {
    const [pr, pc] = GREEDY.path[step - 1]
    const [r, c] = GREEDY.path[step]
    note = `Από (${pr + 1},${pc + 1}) — κόστος ${GRID[pr][pc]} — ο άπληστος πάει στο φθηνότερο επιτρεπτό κελί της επόμενης γραμμής: (${r + 1},${c + 1}) με κόστος ${GRID[r][c]}. Άθροισμα ως τώρα: ${greedyCost}.`
  } else {
    note = `Τέλος διαδρομής. Άπληστος = ${GREEDY.cost}, βέλτιστο = ${OPT.cost}. Διαφορά: ${GREEDY.cost - OPT.cost}. Πάτα «Δες τη βέλτιστη» για να συγκρίνεις.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Παιχνίδι σε πίνακα — γιατί ο άπληστος αποτυγχάνει
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {(['greedy', 'opt', 'both'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShow(s)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                show === s
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {s === 'greedy' ? 'Άπληστος' : s === 'opt' ? 'Βέλτιστη' : 'Και τα δύο'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κίνηση: ακριβώς πάνω, πάνω-αριστερά ή πάνω-δεξιά. Κόστος = άθροισμα κελιών στη διαδρομή.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* grid cells */}
          {GRID.map((row, r) =>
            row.map((v, c) => {
              const key = `${r},${c}`
              const inGreedy = greedyCells.has(key)
              const inOpt = optCells.has(key)
              const showGreedy = show !== 'opt' && inGreedy
              const showOpt = show !== 'greedy' && inOpt
              let fill = '#ffffff'
              let stroke = '#cbd5e1'
              const textFill = '#1c1214'
              if (showGreedy && showOpt) {
                fill = '#fde68a' // both
                stroke = '#a16207'
              } else if (showGreedy) {
                fill = '#fecdd3'
                stroke = '#9f1239'
              } else if (showOpt) {
                fill = '#bae6fd'
                stroke = '#0c4a6e'
              }
              return (
                <g key={key}>
                  <rect
                    x={xOf(c)}
                    y={yOf(r)}
                    width={CELL}
                    height={CELL}
                    rx={6}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.6}
                  />
                  <text
                    x={xOf(c) + CELL / 2}
                    y={yOf(r) + CELL / 2 + 5}
                    textAnchor="middle"
                    fontSize={18}
                    fontWeight={700}
                    fill={textFill}
                  >
                    {v}
                  </text>
                </g>
              )
            }),
          )}
          {/* paths */}
          {show !== 'opt' && lineSeg(GREEDY.path, '#9f1239', false)}
          {show !== 'greedy' && lineSeg(OPT.path, '#0c4a6e', true)}

          {/* start arrow */}
          <text x={PAD + COLS * CELL + 6} y={yOf(0) + CELL / 2 + 4} fontSize={10} fill="#9b8a8d">
            εκκίν.
          </text>
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{note}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-rose-700">
              Άπληστος
            </span>
            <span className="font-mono font-bold text-rose-900">{greedyCost}</span>
          </div>
          <span className="text-fg-subtle">
            Διαδρομή:{' '}
            {GREEDY.path
              .slice(0, step + 1)
              .map(([r, c]) => `(${r + 1},${c + 1})`)
              .join(' → ')}
          </span>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-sky-700">
              Βέλτιστη
            </span>
            <span className="font-mono font-bold text-sky-900">{optCost}</span>
          </div>
          <span className="text-fg-subtle">
            Διαδρομή:{' '}
            {OPT.path
              .slice(0, step + 1)
              .map(([r, c]) => `(${r + 1},${c + 1})`)
              .join(' → ')}
          </span>
        </div>
      </div>

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
          Γραμμή {step + 1} / {ROWS}
        </span>
        {done && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-800">
            ✗ {GREEDY.cost} &gt; {OPT.cost} — διαφορά {GREEDY.cost - OPT.cost}
          </span>
        )}
      </div>
    </section>
  )
}
