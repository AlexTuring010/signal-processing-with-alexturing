/**
 * knapsack-instance.ts — the single 0/1-knapsack instance the whole of L15
 * is built on.
 *
 * Four items and a bag of capacity 8, chosen so that ONE instance carries the
 * entire knapsack story:
 *
 *  - the ratio-greedy fails on it — it grabs items 1+2 (best ratios, both
 *    small) for value 7, while the optimum is items 2+4 for value 10
 *    (KnapsackGreedyFail);
 *  - the locally-best prefix {1,2} is globally worse than {1}, because it
 *    leaves no room for item 4 (KnapsackWhyTwoVars);
 *  - the (n+1)×(W+1) table fills to OPT(n, W) = 10 (KnapsackTable).
 *
 * Shared so the student carries one mental picture across all three vizzes.
 */

export type KnapsackItem = { w: number; v: number }

/** Four items; index i is the lecture's «αντικείμενο i+1» (1-based). */
export const KNAPSACK_ITEMS: readonly KnapsackItem[] = [
  { w: 2, v: 3 },
  { w: 3, v: 4 },
  { w: 4, v: 5 },
  { w: 5, v: 6 },
]

/** Capacity of the bag, in kilos. */
export const KNAPSACK_CAP = 8

/** Number of items. */
export const KNAPSACK_N = KNAPSACK_ITEMS.length
