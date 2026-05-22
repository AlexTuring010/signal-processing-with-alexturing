/**
 * interval-instance.ts — the weighted-interval-scheduling instance L14 is
 * built on.
 *
 * Eight requests, already sorted by finish time (f₁ ≤ f₂ ≤ … ≤ f₈), with the
 * exact p(j) values the lecture slides quote: p(8) = 5, p(7) = 3, p(2) = 0.
 *
 * Shared so PjExplorer, PjScan and WeightedIntervalDP all teach the SAME eight
 * intervals — the student builds one mental picture and reuses it across «τι
 * είναι το p(j)», «πώς το υπολογίζουμε σε O(n)» and «γέμισμα του πίνακα M».
 */

export type Request = { id: number; s: number; f: number; v: number }

/** Eight requests, sorted by finish time as the DP algorithm requires. */
export const REQS: readonly Request[] = [
  { id: 1, s: 1, f: 5, v: 2 },
  { id: 2, s: 2, f: 7, v: 4 },
  { id: 3, s: 4, f: 8, v: 4 },
  { id: 4, s: 3, f: 10, v: 7 },
  { id: 5, s: 6, f: 12, v: 2 },
  { id: 6, s: 9, f: 13, v: 1 },
  { id: 7, s: 8, f: 14, v: 5 },
  { id: 8, s: 12, f: 16, v: 3 },
]

/** Number of requests. */
export const N = REQS.length

/** Latest moment on the time axis — used to scale every timeline. */
export const T_MAX = 16

/**
 * p(j): the largest index i < j whose request finishes no later than request
 * j starts (fᵢ ≤ sⱼ); 0 when no earlier request is compatible.
 *
 * Because the requests are sorted by finish time, the compatible predecessors
 * of j form a prefix 1..p(j); everything in p(j)+1..j−1 overlaps j.
 */
export const P: readonly number[] = (() => {
  const p = [0]
  for (let j = 1; j <= N; j++) {
    let best = 0
    for (let i = 1; i < j; i++) {
      if (REQS[i - 1].f <= REQS[j - 1].s) best = i
    }
    p[j] = best
  }
  return p
})()
