import type {
  Building,
  BuildingKind,
  GoodKey,
  RecipeId,
  Resources,
} from './types'
import { MAX_BUILDING_LEVEL } from './defaults'

/* -------------------------------------------------------------------------- */
/*  Building registry — Phase 2                                                */
/*                                                                            */
/*  One recipe per building kind. Each has a build cost, an unlock gate,      */
/*  and a recipe (inputs → output, in milliseconds at level 0). Levels       */
/*  shave time and add to per-batch yield; upgrade cost grows with level.    */
/*                                                                            */
/*  Phase 4 will introduce research-based unlocks; for now, gating is on      */
/*  lifetime coins (juicer/cidery/jam) plus an "owned-prereq" check (bakery   */
/*  needs a jam factory).                                                     */
/* -------------------------------------------------------------------------- */

export type Recipe = {
  id: RecipeId
  /** Inputs consumed at the START of each batch. Keys are GoodKey. */
  inputs: Partial<Record<GoodKey, number>>
  /** Output good produced. */
  output: GoodKey
  /** Base output count per batch at level 0. Each level adds +1. */
  baseYield: number
  /** Base milliseconds per batch at level 0. Each level shaves 10%. */
  baseMs: number
}

const JUICE: Recipe = {
  id: 'juice',
  inputs: { apples: 5 },
  output: 'juice',
  baseYield: 1,
  baseMs: 30 * 1000,
}

const CIDER: Recipe = {
  id: 'cider',
  inputs: { apples: 12 },
  output: 'cider',
  baseYield: 1,
  baseMs: 8 * 60 * 1000,
}

const JAM: Recipe = {
  id: 'jam',
  inputs: { apples: 20 },
  output: 'jam',
  baseYield: 1,
  baseMs: 12 * 60 * 1000,
}

const PIE: Recipe = {
  id: 'pie',
  inputs: { jam: 3, apples: 8 },
  output: 'pies',
  baseYield: 1,
  baseMs: 20 * 60 * 1000,
}

export type BuildingDef = {
  kind: BuildingKind
  /** Greek display name. */
  name: string
  /** Single-emoji visual. */
  emoji: string
  recipe: Recipe
  /** One-time coin cost to construct. */
  buildCost: number
  /** Per-good storage cap on `storedOutput`. Surplus blocks new batches. */
  outputCap: number
  /** Phase 2 unlock gate: lifetime coins threshold (research adds to this in Phase 4). */
  unlockLifetimeCoins: number
  /** When set, a prerequisite building kind that must be built and at level ≥ 1. */
  requires?: BuildingKind
}

const REGISTRY: Record<BuildingKind, BuildingDef> = {
  juicer: {
    kind: 'juicer',
    name: 'Στυφτήρι',
    emoji: '🧃',
    recipe: JUICE,
    buildCost: 50,
    outputCap: 25,
    unlockLifetimeCoins: 2,
  },
  cidery: {
    kind: 'cidery',
    name: 'Κάβα',
    emoji: '🍷',
    recipe: CIDER,
    buildCost: 250,
    outputCap: 15,
    unlockLifetimeCoins: 50,
  },
  jam: {
    kind: 'jam',
    name: 'Μαρμελάδα',
    emoji: '🍯',
    recipe: JAM,
    buildCost: 1500,
    outputCap: 12,
    unlockLifetimeCoins: 500,
  },
  bakery: {
    kind: 'bakery',
    name: 'Φούρνος',
    emoji: '🥧',
    recipe: PIE,
    buildCost: 8000,
    outputCap: 8,
    unlockLifetimeCoins: 2500,
    requires: 'jam',
  },
}

export const BUILDING_KINDS: BuildingKind[] = ['juicer', 'cidery', 'jam', 'bakery']

export function getBuildingDef(kind: BuildingKind): BuildingDef {
  return REGISTRY[kind]
}

/** Effective ms-per-batch for `building` (factoring level + future buffs). */
export function batchMs(building: Building): number {
  const def = getBuildingDef(building.kind)
  // -10% per level, capped at -50% (so floor = 0.50 × base).
  const mult = Math.max(0.5, 1 - 0.1 * building.level)
  return Math.round(def.recipe.baseMs * mult)
}

/** Output produced per completed batch (factoring level). */
export function batchYield(building: Building): number {
  const def = getBuildingDef(building.kind)
  return def.recipe.baseYield + building.level
}

/** Coin cost of the *next* level upgrade. baseCost × 1.7^level. */
export function upgradeCost(building: Building): number {
  if (building.level >= MAX_BUILDING_LEVEL) return Infinity
  const def = getBuildingDef(building.kind)
  return Math.ceil(def.buildCost * Math.pow(1.7, building.level + 1))
}

/** Sufficient inputs in `resources` to start one batch of `building`'s recipe? */
export function hasInputs(
  building: Building,
  resources: Resources,
): boolean {
  const def = getBuildingDef(building.kind)
  for (const [k, qty] of Object.entries(def.recipe.inputs)) {
    if ((resources[k as GoodKey] ?? 0) < (qty as number)) return false
  }
  return true
}

/** Mutates a copy of `resources` to reflect one batch's input consumption. */
export function consumeInputs(
  building: Building,
  resources: Resources,
): Resources {
  const def = getBuildingDef(building.kind)
  const next: Resources = { ...resources }
  for (const [k, qty] of Object.entries(def.recipe.inputs)) {
    const key = k as GoodKey
    next[key] = Math.max(0, (next[key] ?? 0) - (qty as number))
  }
  return next
}

/** Whether `kind` is currently unlockable (eligible to build). */
export function isUnlocked(
  kind: BuildingKind,
  lifetimeCoins: number,
  buildings: Building[],
): boolean {
  const def = getBuildingDef(kind)
  if (lifetimeCoins < def.unlockLifetimeCoins) return false
  if (def.requires) {
    const has = buildings.some((b) => b.kind === def.requires && b.level >= 0)
    if (!has) return false
  }
  return true
}

/** Whether `kind` is eligible *and* not already owned (Phase 2 = 1 of each). */
export function canBuild(
  kind: BuildingKind,
  lifetimeCoins: number,
  buildings: Building[],
): boolean {
  if (!isUnlocked(kind, lifetimeCoins, buildings)) return false
  if (buildings.some((b) => b.kind === kind)) return false
  return true
}

/** Greek-friendly recipe summary like "5 🍎 → 1 🧃" (level-aware on yield). */
export function recipeSummary(building: Building): string {
  const def = getBuildingDef(building.kind)
  const inputs = Object.entries(def.recipe.inputs)
    .map(([k, qty]) => `${qty} ${goodEmoji(k as GoodKey)}`)
    .join(' + ')
  const out = `${batchYield(building)} ${goodEmoji(def.recipe.output)}`
  return `${inputs} → ${out}`
}

function goodEmoji(k: GoodKey): string {
  switch (k) {
    case 'apples':
      return '🍎'
    case 'juice':
      return '🧃'
    case 'cider':
      return '🍷'
    case 'jam':
      return '🍯'
    case 'pies':
      return '🥧'
  }
}

export { goodEmoji }
