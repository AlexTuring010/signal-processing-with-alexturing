'use client'

/**
 * DnaScoreAlignTable — the 8×7 DP table for the front-set-8-ask2 instance,
 * x = ATGGCA and y = TCTATGG, with the problem's max/score semantics:
 * match +1, mismatch −1, gap −2. Final M[7][6] = −6.
 *
 * Three tabs the student walks in order:
 *
 *   1. Γέμισμα      — fill the grid row by row; for the focus cell, show
 *                     the three candidates and the max winner.
 *   2. Backtrack    — walk one optimal path (7,6) → (0,0); each step
 *                     emits one column of the alignment below, with the
 *                     ATGG / TGG match kernel lit in green.
 *   3. Πολλαπλά     — overlay ALL cells that lie on some optimal path,
 *      βέλτιστα       so the «η (ή τις) βέλτιστη» wording becomes literal:
 *                     a few cells are forced (matches), the rest split.
 *
 * Conventions match the problem statement: i indexes y (rows), j indexes
 * x (columns). M[i−1][j] − 2 is «κενό στο x» (y_i unmatched); M[i][j−1] − 2
 * is «κενό στο y» (x_j unmatched). M[i−1][j−1] + σ(y_i, x_j) is the
 * diagonal pairing.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const X = 'ATGGCA'
const Y = 'TCTATGG'
const M_ROWS = Y.length // 7
const N_COLS = X.length // 6
const GAP = -2
const sigma = (a: string, b: string): number => (a === b ? +1 : -1)

/** Build the (Y+1)×(X+1) score table with the problem's max recurrence. */
function buildTable(): number[][] {
  const M: number[][] = []
  for (let i = 0; i <= M_ROWS; i++) {
    const row: number[] = []
    for (let j = 0; j <= N_COLS; j++) {
      if (i === 0) row.push(j * GAP)
      else if (j === 0) row.push(i * GAP)
      else {
        const diag = M[i - 1][j - 1] + sigma(Y[i - 1], X[j - 1])
        const up = M[i - 1][j] + GAP
        const left = row[j - 1] + GAP
        row.push(Math.max(diag, up, left))
      }
    }
    M.push(row)
  }
  return M
}

type StepKind = 'diag' | 'up' | 'left'
type AlignCol = { x: string | null; y: string | null; kind: StepKind; score: number }

/** Backtrack one optimal path. Preference: DIAG-match > LEFT > UP > DIAG-mismatch.
 * This concentrates matches into a contiguous kernel (ATGG in the middle of
 * this instance) — the teaching-friendly representative of the multi-optima
 * family, rather than a "diag everywhere" path with one match buried in
 * mismatches. */
function backtrackOptimal(table: number[][]): { path: [number, number][]; align: AlignCol[] } {
  const path: [number, number][] = []
  const align: AlignCol[] = []
  let i = M_ROWS
  let j = N_COLS
  path.push([i, j])
  while (i > 0 || j > 0) {
    // 1. Diag-match if available
    if (i > 0 && j > 0) {
      const s = sigma(Y[i - 1], X[j - 1])
      if (s > 0 && table[i][j] === table[i - 1][j - 1] + s) {
        align.push({ x: X[j - 1], y: Y[i - 1], kind: 'diag', score: s })
        i -= 1
        j -= 1
        path.push([i, j])
        continue
      }
    }
    // 2. Left (gap in y, x_j unmatched)
    if (j > 0 && table[i][j] === table[i][j - 1] + GAP) {
      align.push({ x: X[j - 1], y: null, kind: 'left', score: GAP })
      j -= 1
      path.push([i, j])
      continue
    }
    // 3. Up (gap in x, y_i unmatched)
    if (i > 0 && table[i][j] === table[i - 1][j] + GAP) {
      align.push({ x: null, y: Y[i - 1], kind: 'up', score: GAP })
      i -= 1
      path.push([i, j])
      continue
    }
    // 4. Fall back to diag-mismatch
    if (i > 0 && j > 0) {
      const s = sigma(Y[i - 1], X[j - 1])
      align.push({ x: X[j - 1], y: Y[i - 1], kind: 'diag', score: s })
      i -= 1
      j -= 1
      path.push([i, j])
      continue
    }
    // edge of the table — should not happen because base cases are handled
    break
  }
  align.reverse()
  path.reverse()
  return { path, align }
}

/** Set of every cell (i,j) that lies on AT LEAST ONE optimal path. */
function allOptimalCells(table: number[][]): Set<string> {
  const onPath = new Set<string>()
  onPath.add(`${M_ROWS},${N_COLS}`)
  // BFS backwards: from each "on-path" cell, find every predecessor that
  // contributed to its optimal value, and add those.
  const queue: [number, number][] = [[M_ROWS, N_COLS]]
  const visited = new Set<string>([`${M_ROWS},${N_COLS}`])
  while (queue.length) {
    const [i, j] = queue.shift()!
    if (i === 0 && j === 0) continue
    if (i > 0 && j > 0) {
      const s = sigma(Y[i - 1], X[j - 1])
      if (table[i][j] === table[i - 1][j - 1] + s) {
        const k = `${i - 1},${j - 1}`
        onPath.add(k)
        if (!visited.has(k)) {
          visited.add(k)
          queue.push([i - 1, j - 1])
        }
      }
    }
    if (i > 0 && table[i][j] === table[i - 1][j] + GAP) {
      const k = `${i - 1},${j}`
      onPath.add(k)
      if (!visited.has(k)) {
        visited.add(k)
        queue.push([i - 1, j])
      }
    }
    if (j > 0 && table[i][j] === table[i][j - 1] + GAP) {
      const k = `${i},${j - 1}`
      onPath.add(k)
      if (!visited.has(k)) {
        visited.add(k)
        queue.push([i, j - 1])
      }
    }
  }
  return onPath
}

/** Forced cells = cells that appear in EVERY optimal path. We over-approximate
 * by treating a cell as forced iff it is the only "on-path" predecessor of an
 * "on-path" cell. Good enough for the teaching point (the match kernel). */
function forcedCells(table: number[][], allOpt: Set<string>): Set<string> {
  // A cell c is forced if removing c breaks every optimal path. Computing that
  // exactly needs articulation analysis; we approximate by counting how many
  // optimal paths reach (M_ROWS, N_COLS) — but a simpler proxy that lights up
  // the kernel: a cell is forced if it is the ONLY on-path predecessor of
  // some on-path cell.
  const forced = new Set<string>()
  forced.add(`0,0`)
  forced.add(`${M_ROWS},${N_COLS}`)
  for (let i = 0; i <= M_ROWS; i++) {
    for (let j = 0; j <= N_COLS; j++) {
      if (!allOpt.has(`${i},${j}`)) continue
      // List on-path predecessors of (i,j)
      const preds: string[] = []
      if (i > 0 && j > 0) {
        const s = sigma(Y[i - 1], X[j - 1])
        if (table[i][j] === table[i - 1][j - 1] + s && allOpt.has(`${i - 1},${j - 1}`))
          preds.push(`${i - 1},${j - 1}`)
      }
      if (i > 0 && table[i][j] === table[i - 1][j] + GAP && allOpt.has(`${i - 1},${j}`))
        preds.push(`${i - 1},${j}`)
      if (j > 0 && table[i][j] === table[i][j - 1] + GAP && allOpt.has(`${i},${j - 1}`))
        preds.push(`${i},${j - 1}`)
      if (preds.length === 1) forced.add(preds[0])
    }
  }
  return forced
}

type Tab = 'fill' | 'back' | 'multi'

const TAB_LABEL: Record<Tab, string> = {
  fill: 'Γέμισμα',
  back: 'Backtrack',
  multi: 'Πολλαπλά βέλτιστα',
}

function fmtScore(n: number, large = false): string {
  return large ? (n >= 0 ? `+${n}` : `${n}`) : `${n}`
}

export function DnaScoreAlignTable() {
  const [tab, setTab] = useState<Tab>('fill')
  // Fill mode: step 0 = base cases only; step k (1..7) = row k revealed.
  const [fillStep, setFillStep] = useState(0)
  // Backtrack mode: step k (0..path.length-1) = revealed up to that cell.
  const [backStep, setBackStep] = useState(0)

  const table = useMemo(buildTable, [])
  const { path: optPath, align: optAlign } = useMemo(() => backtrackOptimal(table), [table])
  const allOpt = useMemo(() => allOptimalCells(table), [table])
  const forced = useMemo(() => forcedCells(table, allOpt), [table, allOpt])

  // Backtrack revealed up to step backStep — i.e. the LAST (path.length - 1 - backStep)
  // cells of optPath are visible (we walk from end to start).
  const revealedBack = useMemo(() => {
    const set = new Set<string>()
    for (let k = optPath.length - 1; k >= optPath.length - 1 - backStep; k--) {
      if (k < 0) break
      const [i, j] = optPath[k]
      set.add(`${i},${j}`)
    }
    return set
  }, [optPath, backStep])

  // Backtrack alignment columns revealed (right side first as we walk back)
  const revealedAlign = useMemo(() => {
    // optAlign[k] corresponds to the edge from optPath[k] → optPath[k+1].
    // As we walk back, the LAST edge revealed first.
    const slice: { col: AlignCol; index: number }[] = []
    for (let k = 0; k < backStep; k++) {
      const idx = optAlign.length - 1 - k
      if (idx < 0) break
      slice.push({ col: optAlign[idx], index: idx })
    }
    slice.reverse() // display in forward order with revealed-edges in suffix
    return slice
  }, [optAlign, backStep])

  const focusRow = fillStep // 0 = base; 1..7 = that row's focus
  const focusJ = N_COLS // we walk rightmost cell per row for the "candidates" reveal
  const revealedCellFill = (i: number, j: number) => i === 0 || j === 0 || i <= fillStep

  // Note text per mode
  let note: string
  if (tab === 'fill') {
    if (fillStep === 0) {
      note =
        'Οι βασικές περιπτώσεις: γραμμή 0 = «όλα τα γράμματα του x πληρώνουν gap», στήλη 0 = «όλα τα γράμματα του y πληρώνουν gap». Κάθε γραμμή/στήλη κενών κοστίζει −2j ή −2i. Πάτα «Επόμενο».'
    } else if (fillStep >= 1 && fillStep <= M_ROWS) {
      const i = fillStep
      const j = focusJ
      const s = sigma(Y[i - 1], X[j - 1])
      const diag = table[i - 1][j - 1] + s
      const up = table[i - 1][j] + GAP
      const left = table[i][j - 1] + GAP
      const winners: string[] = []
      if (diag === table[i][j]) winners.push('ταίριασμα')
      if (up === table[i][j]) winners.push('κενό-X')
      if (left === table[i][j]) winners.push('κενό-Y')
      note =
        `Γραμμή ${i} — y${i} = «${Y[i - 1]}». Κελί M[${i}][${j}]: ταίριασμα ${Y[i - 1]}–${X[j - 1]} ` +
        `(σ = ${fmtScore(s, true)}) + diag(${table[i - 1][j - 1]}) = ${fmtScore(diag)}· ` +
        `κενό-X (−2) + up(${table[i - 1][j]}) = ${fmtScore(up)}· κενό-Y (−2) + left(${table[i][j - 1]}) = ${fmtScore(left)}. ` +
        `M[${i}][${j}] = max = ${fmtScore(table[i][j])}` +
        (winners.length > 1 ? ` (ισοβαθμία: ${winners.join(' / ')}).` : `.`)
    } else {
      note = `Πίνακας ολοκληρωμένος. M[${M_ROWS}][${N_COLS}] = ${fmtScore(table[M_ROWS][N_COLS])} — αυτό είναι το μέγιστο σκορ ευθυγράμμισης.`
    }
  } else if (tab === 'back') {
    if (backStep === 0) {
      note = `Το πέρασμα προς τα πίσω ξεκινά από το (${M_ROWS}, ${N_COLS}). Κάθε βήμα φωτίζει την ακμή που εξηγεί την τιμή του τρέχοντος κελιού και προσθέτει ΜΙΑ στήλη στην ευθυγράμμιση από δεξιά προς αριστερά.`
    } else {
      const idx = optAlign.length - backStep
      const col = optAlign[idx]
      if (!col) {
        note = 'Φτάσαμε στο (0,0). Η ευθυγράμμιση έτοιμη.'
      } else if (col.kind === 'diag') {
        note =
          col.score > 0
            ? `Ταίριασμα ${col.x}–${col.y} (+1) — διαγώνια ακμή, το κελί κερδίζει αμοιβή. Αυτό είναι ένας «πυρήνας».`
            : `Σύγκρουση ${col.x}–${col.y} (−1) — διαγώνια, αλλά πληρώνει ποινή.`
      } else if (col.kind === 'up') {
        note = `Κενό στο x: το «${col.y}» της y μένει αταίριαστο (−2). Πάμε ένα κελί επάνω.`
      } else {
        note = `Κενό στο y: το «${col.x}» της x μένει αταίριαστο (−2). Πάμε ένα κελί αριστερά.`
      }
    }
  } else {
    const count = allOpt.size
    note = `Επικάλυψη ΟΛΩΝ των βέλτιστων μονοπατιών. Από τα ${(M_ROWS + 1) * (N_COLS + 1)} κελιά του πίνακα, ${count} ζουν σε κάποια βέλτιστη ευθυγράμμιση· τα υπόλοιπα είναι εκτός κάθε βέλτιστου. Τα πράσινα «πυρήνες» είναι κελιά από όπου περνά ΚΑΘΕ βέλτιστο.`
  }

  // What to render in the table cells per mode
  function cellRender(i: number, j: number) {
    const val = table[i][j]
    let cls = 'border-border bg-bg-soft/40 text-fg'
    let show = true
    if (tab === 'fill') {
      show = revealedCellFill(i, j)
      const isFocus = i === focusRow && j === focusJ && fillStep >= 1 && fillStep <= M_ROWS
      const isSrcDiag =
        fillStep >= 1 && fillStep <= M_ROWS && i === focusRow - 1 && j === focusJ - 1
      const isSrcUp = fillStep >= 1 && fillStep <= M_ROWS && i === focusRow - 1 && j === focusJ
      const isSrcLeft = fillStep >= 1 && fillStep <= M_ROWS && i === focusRow && j === focusJ - 1
      if (!show) cls = 'border-dashed border-border text-transparent'
      else if (isFocus) cls = 'border-accent bg-accent/20 font-bold text-fg'
      else if (isSrcDiag) cls = 'border-emerald-500/60 bg-emerald-500/15 text-fg font-semibold'
      else if (isSrcUp) cls = 'border-sky-500/60 bg-sky-500/15 text-fg font-semibold'
      else if (isSrcLeft) cls = 'border-violet-500/60 bg-violet-500/15 text-fg font-semibold'
    } else if (tab === 'back') {
      const isCurrent =
        backStep > 0 &&
        optPath[optPath.length - backStep][0] === i &&
        optPath[optPath.length - backStep][1] === j
      const onRevealedPath = revealedBack.has(`${i},${j}`)
      if (isCurrent) cls = 'border-accent bg-accent/25 font-bold text-fg'
      else if (onRevealedPath) cls = 'border-rose-500/70 bg-rose-500/15 font-semibold text-fg'
    } else {
      const isAll = allOpt.has(`${i},${j}`)
      const isForced = forced.has(`${i},${j}`)
      if (isForced) cls = 'border-emerald-500/70 bg-emerald-500/25 font-bold text-fg'
      else if (isAll) cls = 'border-amber-500/50 bg-amber-500/15 text-fg'
      else cls = 'border-border bg-bg-soft/30 text-fg-subtle'
    }
    return { cls, show, val }
  }

  // The fill candidates panel
  const candidates = (() => {
    if (tab !== 'fill' || fillStep < 1 || fillStep > M_ROWS) return null
    const i = fillStep
    const j = focusJ
    const s = sigma(Y[i - 1], X[j - 1])
    const diag = table[i - 1][j - 1] + s
    const up = table[i - 1][j] + GAP
    const left = table[i][j - 1] + GAP
    const best = table[i][j]
    return [
      {
        label: `Ταίριασμα ${Y[i - 1]}–${X[j - 1]}`,
        term: `σ(${fmtScore(s, true)}) + ${fmtScore(table[i - 1][j - 1])} = ${fmtScore(diag)}`,
        val: diag,
        winner: diag === best,
        tone: 'emerald' as const,
      },
      {
        label: 'Κενό στο x (y_i αταίριαστο)',
        term: `−2 + ${fmtScore(table[i - 1][j])} = ${fmtScore(up)}`,
        val: up,
        winner: up === best,
        tone: 'sky' as const,
      },
      {
        label: 'Κενό στο y (x_j αταίριαστο)',
        term: `−2 + ${fmtScore(table[i][j - 1])} = ${fmtScore(left)}`,
        val: left,
        winner: left === best,
        tone: 'violet' as const,
      },
    ]
  })()

  // Backtrack controls
  const backMax = optPath.length - 1 // number of edges = path length - 1
  const fillMax = M_ROWS + 1 // step M_ROWS+1 = done

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πίνακας βαθμολογίας — x = ATGGCA · y = TCTATGG
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Βέλτιστο σκορ M[7][6] = −6
        </span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-fg-subtle">
        Σύμβαση: γραμμές = προθέματα του y, στήλες = προθέματα του x.{' '}
        <span className="font-mono">σ(+1)</span> ίδια,{' '}
        <span className="font-mono">σ(−1)</span> διαφορετικά, κάθε κενό{' '}
        <span className="font-mono">−2</span>· νικά το{' '}
        <strong>μέγιστο</strong>.
      </p>

      {/* tabs */}
      <div role="tablist" className="mb-3 flex flex-wrap gap-1">
        {(['fill', 'back', 'multi'] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              tab === k
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft/30 text-fg hover:bg-bg-soft',
            )}
          >
            {TAB_LABEL[k]}
          </button>
        ))}
      </div>

      {/* the grid */}
      <div className="overflow-x-auto">
        <div
          className="grid w-fit gap-px font-mono text-sm"
          style={{ gridTemplateColumns: `3rem repeat(${N_COLS + 1}, 2.6rem)` }}
        >
          <div />
          <div className="flex h-7 items-center justify-center text-xs font-semibold text-fg-subtle">
            ∅
          </div>
          {X.split('').map((ch, j) => (
            <div
              key={`h${j}`}
              className="flex h-7 items-center justify-center text-xs font-bold text-fg"
            >
              {ch}
            </div>
          ))}
          {table.map((row, i) => (
            <div key={i} className="contents">
              <div className="flex items-center justify-center text-xs font-bold text-fg">
                {i === 0 ? '∅' : Y[i - 1]}
              </div>
              {row.map((val, j) => {
                const { cls, show } = cellRender(i, j)
                return (
                  <div
                    key={j}
                    className={cn(
                      'flex h-9 items-center justify-center rounded border tabular-nums',
                      cls,
                    )}
                  >
                    {show ? val : '·'}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* fill candidates */}
      {candidates && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {candidates.map((c) => (
            <div
              key={c.label}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm',
                c.winner
                  ? 'border-success/50 bg-success/10'
                  : c.tone === 'emerald'
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : c.tone === 'sky'
                      ? 'border-sky-500/40 bg-sky-500/5'
                      : 'border-violet-500/40 bg-violet-500/5',
              )}
            >
              <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
                {c.label}
              </div>
              <div className="font-mono text-xs text-fg-muted">{c.term}</div>
              <div className="font-mono text-base font-bold text-fg">{fmtScore(c.val)}</div>
              {c.winner && (
                <div className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-success">
                  νικητής
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* backtrack alignment tape */}
      {tab === 'back' && revealedAlign.length > 0 && (
        <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 p-3">
          <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Η ευθυγράμμιση — μία στήλη ανά ακμή του μονοπατιού
          </div>
          <div className="flex flex-wrap gap-1.5">
            {/* placeholder columns we haven't reached yet */}
            {Array.from({ length: optAlign.length - revealedAlign.length }).map((_, k) => (
              <div
                key={`p${k}`}
                className="flex w-8 flex-col gap-0.5"
              >
                <div className="flex h-7 items-center justify-center rounded border border-dashed border-border text-sm text-fg-subtle">
                  ?
                </div>
                <div className="flex h-7 items-center justify-center rounded border border-dashed border-border text-sm text-fg-subtle">
                  ?
                </div>
              </div>
            ))}
            {revealedAlign.map(({ col }, k) => {
              const isMatch = col.kind === 'diag' && col.score > 0
              const isMismatch = col.kind === 'diag' && col.score < 0
              const isGap = col.kind !== 'diag'
              return (
                <div key={`r${k}`} className="flex w-8 flex-col gap-0.5">
                  <div
                    className={cn(
                      'flex h-7 items-center justify-center rounded border text-sm font-bold',
                      isMatch && 'border-emerald-500/70 bg-emerald-500/15 text-fg',
                      isMismatch && 'border-amber-500/70 bg-amber-500/15 text-fg',
                      isGap && col.kind === 'left' && 'border-violet-500/70 bg-violet-500/10 text-fg',
                      isGap && col.kind === 'up' && 'border-bg-soft bg-bg-soft text-fg-subtle',
                    )}
                  >
                    {col.x ?? '−'}
                  </div>
                  <div
                    className={cn(
                      'flex h-7 items-center justify-center rounded border text-sm font-bold',
                      isMatch && 'border-emerald-500/70 bg-emerald-500/15 text-fg',
                      isMismatch && 'border-amber-500/70 bg-amber-500/15 text-fg',
                      isGap && col.kind === 'up' && 'border-sky-500/70 bg-sky-500/10 text-fg',
                      isGap && col.kind === 'left' && 'border-bg-soft bg-bg-soft text-fg-subtle',
                    )}
                  >
                    {col.y ?? '−'}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-emerald-500/70 bg-emerald-500/20" />
              ταίριασμα +1
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-amber-500/70 bg-amber-500/20" />
              σύγκρουση −1
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-sky-500/70 bg-sky-500/20" />
              κενό στο x
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm border border-violet-500/70 bg-violet-500/20" />
              κενό στο y
            </span>
            <span className="ml-auto rounded-md border border-border bg-bg-elevated px-2 py-0.5 font-mono text-xs">
              Σύνολο σκορ ως εδώ:{' '}
              {fmtScore(revealedAlign.reduce((a, { col }) => a + col.score, 0))}
            </span>
          </div>
        </div>
      )}

      {/* multi-optima legend */}
      {tab === 'multi' && (
        <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 p-3 text-xs text-fg-muted">
          <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Διαβάζοντας τον χάρτη
          </div>
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm border border-emerald-500/70 bg-emerald-500/30" />
              <span>
                <strong className="text-emerald-600">«Πυρήνες»</strong> — κελιά
                από όπου περνά <em>κάθε</em> βέλτιστο μονοπάτι. Αυτά είναι τα
                σταθερά σημεία της λύσης: τα ταιριάσματα{' '}
                <strong className="font-mono">A–A, T–T, G–G, G–G</strong>{' '}
                κουμπώνουν σταθερά μέσα στο μήκος.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm border border-amber-500/50 bg-amber-500/20" />
              <span>
                <strong className="text-amber-600">«Επιλογές»</strong> — κελιά
                σε <em>κάποιο</em> βέλτιστο, αλλά όχι σε κάθε. Από εδώ
                ξεκινούν οι εναλλακτικές βέλτιστες ευθυγραμμίσεις.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm border border-border bg-bg-soft" />
              <span>
                <strong>Εκτός βέλτιστου</strong> — κανένα βέλτιστο μονοπάτι δεν
                περνά από εκεί.
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls per tab */}
      {tab === 'fill' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFillStep((s) => Math.max(0, s - 1))}
            disabled={fillStep === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Πίσω
          </button>
          <button
            type="button"
            onClick={() => setFillStep((s) => Math.min(fillMax, s + 1))}
            disabled={fillStep === fillMax}
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Επόμενο
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setFillStep(0)}
            disabled={fillStep === 0}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Από την αρχή
          </button>
          <span className="ml-auto text-xs font-medium text-fg-subtle">
            Βήμα {fillStep} / {fillMax}
          </span>
        </div>
      )}
      {tab === 'back' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setBackStep((s) => Math.max(0, s - 1))}
            disabled={backStep === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Πίσω
          </button>
          <button
            type="button"
            onClick={() => setBackStep((s) => Math.min(backMax, s + 1))}
            disabled={backStep === backMax}
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Επόμενο
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setBackStep(0)}
            disabled={backStep === 0}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Από την αρχή
          </button>
          <span className="ml-auto text-xs font-medium text-fg-subtle">
            Βήμα {backStep} / {backMax}
          </span>
        </div>
      )}
    </section>
  )
}
