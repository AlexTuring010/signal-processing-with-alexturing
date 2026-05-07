/* -------------------------------------------------------------------------- */
/*  Orchard types — Phase 2                                                   */
/*                                                                            */
/*  v2 expands Resources with the four building outputs (juice/cider/jam/    */
/*  pies) and introduces a per-building registry. Migration from v1 → v2     */
/*  injects empty defaults for the new fields without resetting progress.    */
/* -------------------------------------------------------------------------- */

export type SpeciesId = 'classic'

/** Goods carried in shared inventory. Building outputs accumulate here. */
export type GoodKey =
  | 'apples'
  | 'juice'
  | 'cider'
  | 'jam'
  | 'pies'

export type Resources = {
  apples: number
  juice: number
  cider: number
  jam: number
  pies: number
  coins: number
  seeds: number
  stars: number
  research: number
}

export type Tree = {
  speciesId: SpeciesId
  plantedAt: number
  /** Stage 0..2 in Phase 1 (sapling → small → mature). 3..4 reserved. */
  growthStage: 0 | 1 | 2 | 3 | 4
  /** Tree-level upgrades. 0 in Phase 1. */
  level: number
  /** Last successful harvest moment, used to track production accumulator. */
  lastHarvestAt: number
  /** Apples currently dangling on the tree (capped). Idle catch-up fills this. */
  storedApples: number
}

export type Plot = {
  id: string
  /** Grid coords; used for adjacency bonuses in later phases. */
  position: { x: number; y: number }
  tree: Tree | null
}

/* -------------------------- Buildings ----------------------------------- */

export type BuildingKind = 'juicer' | 'cidery' | 'jam' | 'bakery'

/** A single recipe is hard-bound to a building kind in Phase 2. */
export type RecipeId = 'juice' | 'cider' | 'jam' | 'pie'

export type Building = {
  id: string
  kind: BuildingKind
  /** 0..MAX_BUILDING_LEVEL. Each level: -10% time, +1 to per-batch yield. */
  level: number
  /** When false, the building sits idle — no inputs consumed. */
  active: boolean
  /** Wall-clock time the current batch started. null = no batch in flight. */
  batchStartedAt: number | null
  /** Output accumulated and not yet collected by the user. */
  storedOutput: number
}

/**
 * Auto-sell rule for a single good. When set, every tick we compare the
 * current price multiplier to `minMult` — if the multiplier is at or above,
 * we liquidate the entire stock at once. `minStock` is a floor: we only
 * sell when stock is strictly greater than this (avoid micro-sales).
 */
export type AutoSellRule = {
  minMult: number
  minStock: number
}

/** A research job currently in progress. Pre-paid and timed at start. */
export type ResearchJob = {
  /** Research-node id from the registry. */
  id: string
  /** When the job kicked off (ms epoch). */
  startedAt: number
  /** How long the job runs (ms), captured at start so it doesn't shift. */
  durationMs: number
}

export type OrchardState = {
  version: 4
  startedAt: number
  lastTickAt: number
  resources: Resources
  /** Maximum apples the barn can hold at once. Surplus is lost. */
  barnCapacity: number
  plots: Plot[]
  buildings: Building[]
  /** Per-good auto-sell rules. Missing key = disabled. */
  autoSell: Partial<Record<GoodKey, AutoSellRule>>
  /** Research progress: completed node ids + the single in-flight job. */
  researchTree: {
    completed: string[]
    inProgress: ResearchJob | null
  }
  /** Lifetime tally — used for prestige math in later phases. */
  lifetime: {
    applesHarvested: number
    coinsEarned: number
    treesPlanted: number
  }
  flags: {
    seenIntro: boolean
    seenFirstHarvest: boolean
    seenFirstSale: boolean
  }
}
