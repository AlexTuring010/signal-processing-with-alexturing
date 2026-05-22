/**
 * alignment-instance.ts — the shared string-alignment instances for L16.
 *
 * One small instance carries the edit-distance story across four vizzes:
 * AlignmentBuilder (build an alignment, watch its cost form), EditDistanceTable
 * (fill the DP grid), EditGraphViz (the grid as a shortest-path graph) and
 * TwoRowSweep (the value in linear space). It is GCTA vs CTAG — a one-character
 * cyclic shift, chosen so the naive «all-diagonal» alignment costs 4 while the
 * optimum — slide everything over by one gap — costs only 2. The gap genuinely
 * pays for itself, so the student sees WHY the recurrence needs three cases.
 *
 * A second, larger instance (HB_X, HB_Y) drives HirschbergViz, where the
 * divide-and-conquer recursion needs a real rectangle to recurse inside.
 */

/** The small instance — m = n = 4. Edit distance = 2. */
export const EDIT_X = 'GCTA'
export const EDIT_Y = 'CTAG'

/** δ — the gap cost: the price of leaving one character unmatched. */
export const GAP = 1

/** α — the mismatch cost: pairing two DIFFERENT characters. Equal chars: 0. */
export const mismatch = (a: string, b: string): number => (a === b ? 0 : 1)

/** Build the full (m+1)×(n+1) edit-distance DP table for x and y. */
export function buildEditTable(x: string, y: string): number[][] {
  const m = x.length
  const n = y.length
  const M: number[][] = []
  for (let i = 0; i <= m; i++) {
    const row: number[] = []
    for (let j = 0; j <= n; j++) {
      if (i === 0) row.push(j * GAP)
      else if (j === 0) row.push(i * GAP)
      else
        row.push(
          Math.min(
            mismatch(x[i - 1], y[j - 1]) + M[i - 1][j - 1],
            GAP + M[i - 1][j],
            GAP + row[j - 1],
          ),
        )
    }
    M.push(row)
  }
  return M
}

/** Edit distance of x and y — the bottom-right corner of the DP table. */
export function editDistance(x: string, y: string): number {
  const M = buildEditTable(x, y)
  return M[x.length][y.length]
}

/** The three moves of an alignment, walking the grid from (0,0) to (m,n). */
export type StepKind = 'match' | 'gapX' | 'gapY'

/** One move of an alignment: a single edge of the grid graph. */
export type AlignStep = {
  kind: StepKind
  /** the cell this move starts from */
  i0: number
  j0: number
  /** the cell this move lands on */
  i1: number
  j1: number
  /** the X character consumed (match / gapX), or null */
  xi: string | null
  /** the Y character consumed (match / gapY), or null */
  yj: string | null
  /** the cost paid for this move: 0, α or δ */
  cost: number
}

/**
 * Backtrace ONE optimal alignment, preferring the diagonal (match) on ties.
 * Returned in forward order — first move first.
 */
export function optimalSteps(x: string, y: string): AlignStep[] {
  const M = buildEditTable(x, y)
  const steps: AlignStep[] = []
  let i = x.length
  let j = y.length
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      M[i][j] === mismatch(x[i - 1], y[j - 1]) + M[i - 1][j - 1]
    ) {
      steps.push({
        kind: 'match',
        i0: i - 1,
        j0: j - 1,
        i1: i,
        j1: j,
        xi: x[i - 1],
        yj: y[j - 1],
        cost: mismatch(x[i - 1], y[j - 1]),
      })
      i -= 1
      j -= 1
    } else if (i > 0 && M[i][j] === GAP + M[i - 1][j]) {
      steps.push({
        kind: 'gapX',
        i0: i - 1,
        j0: j,
        i1: i,
        j1: j,
        xi: x[i - 1],
        yj: null,
        cost: GAP,
      })
      i -= 1
    } else {
      steps.push({
        kind: 'gapY',
        i0: i,
        j0: j - 1,
        i1: i,
        j1: j,
        xi: null,
        yj: y[j - 1],
        cost: GAP,
      })
      j -= 1
    }
  }
  return steps.reverse()
}

/** The larger DNA instance for HirschbergViz — m = 6, n = 8, distance = 2. */
export const HB_X = 'GTTACG'
export const HB_Y = 'GATTACAG'
