import type {
  Building,
  BuildingKind,
  GoodKey,
  OrchardState,
  Tree,
} from './types'
import { hasResearch } from './research'
import { getSpecies } from './trees'
import {
  BLUEPRINT_DISCOUNT,
  GOOD_PRICE,
  PET_BUFF_MULT,
  SLEEPING_GROWTH_MULT,
} from './defaults'
import { getBuildingDef } from './buildings'
import { MULT_MAX, MULT_MIN, priceHistory, priceMultiplier } from './market'
import {
  appleYieldShopMult,
  barnBonusShop,
  permanentYieldMult,
  productYieldShopMult,
} from './prestige'

/* -------------------------------------------------------------------------- */
/*  Research effect helpers                                                    */
/*                                                                            */
/*  Centralized read-time getters that fold research-tree completions into    */
/*  game-logic numbers (growth time, storage cap, barn cap, batch yield,      */
/*  market range). Keep this file the single source of truth so each effect   */
/*  is applied consistently across reconcile, store actions, and UI.          */
/* -------------------------------------------------------------------------- */

/**
 * Multiplier on tree growth durations.
 *  - `richer-soil` research: ×0.9 (faster).
 *  - Pet sleeping: ×SLEEPING_GROWTH_MULT (faster) — the strategic tradeoff
 *    against the ×0.5 production penalty while asleep.
 *
 * Caller passes `petSleeping` so this stays a pure function (no store reads).
 */
export function growthTimeMult(
  state: OrchardState,
  petSleeping: boolean = false,
): number {
  let m = 1.0
  if (hasResearch(state, 'richer-soil')) m *= 0.9
  if (petSleeping) m *= SLEEPING_GROWTH_MULT
  return m
}

/** Effective per-tree storage cap (level + research). */
export function effectiveTreeStorage(tree: Tree, state: OrchardState): number {
  const sp = getSpecies(tree.speciesId)
  const base = sp.baseStorage + tree.level * 2
  const mult = hasResearch(state, 'better-cap') ? 1.5 : 1.0
  return Math.floor(base * mult)
}

/**
 * Coin cost to construct a building of `kind`. Halved (BLUEPRINT_DISCOUNT)
 * when the player carries a blueprint for it from a previous compost run.
 */
export function buildCostFor(
  kind: BuildingKind,
  state: OrchardState,
): number {
  const base = getBuildingDef(kind).buildCost
  const discounted = state.prestige.blueprints.includes(kind)
  return Math.ceil(base * (discounted ? BLUEPRINT_DISCOUNT : 1))
}

/** Effective barn capacity (base × research multiplier + Seed Shop additive). */
export function effectiveBarnCapacity(state: OrchardState): number {
  const mult = hasResearch(state, 'bigger-barn') ? 2.0 : 1.0
  return Math.floor(state.barnCapacity * mult + barnBonusShop(state))
}

/**
 * Combined yield multiplier that applies to **all** production:
 *  - permanent compost-tier bonus (+10/+25/+50/+75%)
 *  - active petting buff (×1.10)
 *  Caller multiplies the resource-specific shop bonus on top.
 */
export function globalProductionMult(state: OrchardState): number {
  return permanentYieldMult(state) * petBuffMult(state)
}

/** Tree (apple) yield multiplier — global × apple-yield seed shop. */
export function appleYieldMult(state: OrchardState): number {
  return permanentYieldMult(state) * appleYieldShopMult(state)
}

/** Building output yield multiplier — global × product-yield seed shop. */
export function productYieldMult(state: OrchardState): number {
  return permanentYieldMult(state) * productYieldShopMult(state)
}

/** Effective tree growth milestones (sapling→small, small→mature). */
export function effectiveGrowthMs(
  tree: Tree,
  state: OrchardState,
  petSleeping: boolean = false,
): { toSmall: number; toMature: number } {
  const sp = getSpecies(tree.speciesId)
  const m = growthTimeMult(state, petSleeping)
  return {
    toSmall: Math.round(sp.growthMs.toSmall * m),
    toMature: Math.round(sp.growthMs.toMature * m),
  }
}

/**
 * Multiplier applied on top of the pet's mood mult while a petting buff is
 * active. Returns PET_BUFF_MULT when `petBuffUntil > now`, else 1.0.
 */
export function petBuffMult(
  state: OrchardState,
  now: number = Date.now(),
): number {
  return state.petBuffUntil && state.petBuffUntil > now ? PET_BUFF_MULT : 1.0
}

/**
 * Building batch yield with research bumps + prestige + seed-shop multipliers.
 * Returns a possibly-fractional number; storedOutput accumulates fractions and
 * collectOutput floors at the boundary, so nothing is lost over many batches.
 */
export function effectiveBatchYield(
  building: Building,
  state: OrchardState,
): number {
  let y = building.level + 1 // base yield = 1, +1 per level
  if (building.kind === 'cidery' && hasResearch(state, 'vintner')) y += 1
  if (building.kind === 'jam' && hasResearch(state, 'jam-tech')) y += 1
  if (building.kind === 'bakery' && hasResearch(state, 'bakery-tech')) y += 1
  return y * productYieldMult(state)
}

/**
 * Whether to roll partnership double-output for a single batch. 10% chance
 * when the research is owned. Caller should multiply yield by 2 when this
 * returns true.
 */
export function rollPartnership(state: OrchardState): boolean {
  if (!hasResearch(state, 'partnership')) return false
  return Math.random() < 0.1
}

/** Market multiplier range bounds, factoring research. */
export function effectiveMultRange(state: OrchardState): {
  min: number
  max: number
} {
  const min = hasResearch(state, 'floor-price') ? 0.7 : 0.5
  const max = hasResearch(state, 'ceiling-price') ? 1.7 : 1.5
  return { min, max }
}

/** Bonus multiplier on sale proceeds. `market-mastery` = ×1.25. */
export function saleProceedsMult(state: OrchardState): number {
  return hasResearch(state, 'market-mastery') ? 1.25 : 1.0
}

/** Should reconcile auto-harvest trees when their storage hits cap? */
export function autoHarvestEnabled(state: OrchardState): boolean {
  return hasResearch(state, 'auto-harvest')
}

/**
 * Per-minute 🧪 production rate from a single mature tree. Saplings/small
 * don't produce. Phase 4 baseline rate; future Crystal trees will surpass
 * this dramatically.
 */
export const RESEARCH_PER_MIN_MATURE = 0.2

/** State-aware version of `stageAt`. Honors research + sleeping growth speed. */
export function stageAtForState(
  tree: Tree,
  now: number,
  state: OrchardState,
  petSleeping: boolean = false,
): Tree['growthStage'] {
  const ms = effectiveGrowthMs(tree, state, petSleeping)
  const age = now - tree.plantedAt
  if (age < ms.toSmall) return 0
  if (age < ms.toMature) return 1
  return 2
}

/** State-aware ms-until-next-stage. Returns null at terminal Phase 1 stage. */
export function msToNextStageForState(
  tree: Tree,
  now: number,
  state: OrchardState,
  petSleeping: boolean = false,
): number | null {
  const ms = effectiveGrowthMs(tree, state, petSleeping)
  const age = now - tree.plantedAt
  if (age < ms.toSmall) return ms.toSmall - age
  if (age < ms.toMature) return ms.toMature - age
  return null
}

/**
 * State-aware price multiplier. Internally takes the deterministic walk in
 * [MULT_MIN, MULT_MAX] and remaps it to the research-expanded range. The
 * remap is linear so the line still looks smooth and the determinism is
 * preserved across reloads.
 */
export function priceMultiplierForState(
  good: GoodKey,
  startedAt: number,
  now: number,
  state: OrchardState,
): number {
  const base = priceMultiplier(good, startedAt, now)
  const baseRange = MULT_MAX - MULT_MIN
  const t = baseRange === 0 ? 0 : (base - MULT_MIN) / baseRange
  const range = effectiveMultRange(state)
  return range.min + t * (range.max - range.min)
}

/** State-aware sell price (base × multiplier × proceeds bonus). */
export function priceForState(
  good: GoodKey,
  startedAt: number,
  now: number,
  state: OrchardState,
): number {
  const mult = priceMultiplierForState(good, startedAt, now, state)
  return GOOD_PRICE[good] * mult * saleProceedsMult(state)
}

/** State-aware multiplier history for the market sparkline. */
export function priceHistoryForState(
  good: GoodKey,
  startedAt: number,
  now: number,
  state: OrchardState,
  points = 24,
  spanMs = 12 * 60 * 60 * 1000,
): number[] {
  const baseRange = MULT_MAX - MULT_MIN
  const r = effectiveMultRange(state)
  return priceHistory(good, startedAt, now, points, spanMs).map((b) => {
    const t = baseRange === 0 ? 0 : (b - MULT_MIN) / baseRange
    return r.min + t * (r.max - r.min)
  })
}

/** State-aware trend over the last `windowMs`. */
export function priceTrendForState(
  good: GoodKey,
  startedAt: number,
  now: number,
  state: OrchardState,
  windowMs = 30 * 60 * 1000,
): number {
  const past = priceMultiplierForState(good, startedAt, now - windowMs, state)
  const cur = priceMultiplierForState(good, startedAt, now, state)
  return cur - past
}
