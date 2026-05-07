import type { GoodKey } from './types'
import { GOOD_PRICE } from './defaults'

/* -------------------------------------------------------------------------- */
/*  Market — Phase 3                                                           */
/*                                                                            */
/*  Deterministic per-good smoothed random walk. The price multiplier for     */
/*  every good follows its own anchor sequence — every PERIOD_MS the walk     */
/*  picks a new anchor in [0.5, 1.5], and we smoothstep-interpolate between   */
/*  consecutive anchors so the line looks continuous, never jumps.            */
/*                                                                            */
/*  The whole walk is a pure function of `(startedAt, good, now)` — no        */
/*  state needs to be persisted, and the line stays the same across reloads.  */
/* -------------------------------------------------------------------------- */

/** One anchor every 30 minutes of real time. */
export const PERIOD_MS = 30 * 60 * 1000

/** Multiplier range. 1.0 = base price; 0.5..1.5 is the dynamic envelope. */
export const MULT_MIN = 0.5
export const MULT_MAX = 1.5

/** Stable index per good for the seed mix — matches GOOD_PRICE iteration order. */
const GOOD_INDEX: Record<GoodKey, number> = {
  apples: 0,
  juice: 1,
  cider: 2,
  jam: 3,
  pies: 4,
}

/** mulberry32: tiny seeded PRNG, returns [0, 1). */
function mulberry32(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Composite seed for a (run, good, anchor) tuple. Stable across reloads. */
function anchorSeed(startedAt: number, goodIdx: number, anchor: number): number {
  // XOR-mix three small ints into a 32-bit seed. The constants are arbitrary
  // primes — they don't need to be cryptographically anything; just spread.
  const a = startedAt | 0
  const b = goodIdx * 0x9e3779b1
  const c = anchor * 0x85ebca6b
  return (a ^ b ^ c) | 0
}

/** Anchor multiplier in [MULT_MIN, MULT_MAX). */
function anchorMultiplier(startedAt: number, good: GoodKey, anchor: number): number {
  const seed = anchorSeed(startedAt, GOOD_INDEX[good], anchor)
  const r = mulberry32(seed)
  return MULT_MIN + r * (MULT_MAX - MULT_MIN)
}

/** Smoothstep ease — soft start and end, S-curve in the middle. */
function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

/**
 * Current price multiplier for `good` at `now`. Smoothly interpolates
 * between the bracketing anchor pair using smoothstep easing.
 */
export function priceMultiplier(
  good: GoodKey,
  startedAt: number,
  now: number,
): number {
  const elapsed = Math.max(0, now - startedAt)
  const idx = Math.floor(elapsed / PERIOD_MS)
  const t = (elapsed % PERIOD_MS) / PERIOD_MS
  const lower = anchorMultiplier(startedAt, good, idx)
  const upper = anchorMultiplier(startedAt, good, idx + 1)
  return lower + (upper - lower) * smoothstep(t)
}

/** Effective per-unit sell price for `good` at `now`. */
export function priceFor(
  good: GoodKey,
  startedAt: number,
  now: number,
): number {
  return GOOD_PRICE[good] * priceMultiplier(good, startedAt, now)
}

/**
 * Sample `points` past multiplier values evenly across `spanMs` ending at
 * `now`. Useful for sparkline rendering. Oldest first, newest last.
 */
export function priceHistory(
  good: GoodKey,
  startedAt: number,
  now: number,
  points = 24,
  spanMs = 12 * 60 * 60 * 1000,
): number[] {
  const out: number[] = []
  if (points <= 1) {
    out.push(priceMultiplier(good, startedAt, now))
    return out
  }
  for (let i = points - 1; i >= 0; i--) {
    const t = now - (i / (points - 1)) * spanMs
    out.push(priceMultiplier(good, startedAt, t))
  }
  return out
}

/**
 * Trend over the last `windowMs` — positive = price has been climbing,
 * negative = falling. Used for the up/down arrow in the market panel.
 */
export function priceTrend(
  good: GoodKey,
  startedAt: number,
  now: number,
  windowMs = 30 * 60 * 1000,
): number {
  const past = priceMultiplier(good, startedAt, now - windowMs)
  const cur = priceMultiplier(good, startedAt, now)
  return cur - past
}
