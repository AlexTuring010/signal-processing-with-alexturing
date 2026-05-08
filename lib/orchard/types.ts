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

/** Per-item purchase counts in the Seed Shop. Missing key = 0. */
export type SeedShopOwned = Partial<Record<string, number>>

/**
 * Prestige state — survives compost. The orchard's "you've done this before"
 * memory: how many times you've reset, what blueprints carry over (so a
 * rebuilt building is half-price), what permanent shop bonuses you own,
 * and the lifetime-coins snapshot at last compost (so we can derive the
 * current run's coin total without a duplicate counter).
 */
export type Prestige = {
  /** Total times the player has composted. 0 = never. */
  compostRun: number
  /** Per-item purchase counts in the Seed Shop. */
  seedShopOwned: SeedShopOwned
  /** Building kinds owned at level ≥ 3 at the most recent compost. */
  blueprints: BuildingKind[]
  /** lifetime.coinsEarned snapshot at the most recent compost. Subtract from
   *  current lifetime.coinsEarned to get this-run earnings. */
  lastCompostLifetime: number
}

/**
 * Snapshot of "lifetime/today-baseline" counters captured at the start of
 * the current daily-quest window. Quest progress = current value − baseline.
 */
export type QuestBaseline = {
  coinsEarned: number
  applesHarvested: number
  treesPlanted: number
  compostRun: number
  researchCompleted: number
  petActions: number
  seedShopBought: number
}

/** Daily-quest state. `selected` = the 3 quest ids chosen for `date`. */
export type QuestsState = {
  /** Local YYYY-MM-DD that `selected` + `baseline` belong to. */
  date: string
  /** Quest ids picked for today. */
  selected: string[]
  baseline: QuestBaseline
  /** Ids completed today (subset of `selected`). */
  completed: string[]
  /** Last date the all-3-done bonus was paid (avoids double-paying). */
  bonusClaimedDate: string | null
}

export type OrchardState = {
  version: 7
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
  /** Prestige state (compost runs + seed shop + blueprints). */
  prestige: Prestige
  /** Earned achievement ids — set semantics, persisted as array. */
  achieved: string[]
  /** Today's daily-quest selection + progress baselines. */
  quests: QuestsState
  /** Petting buff expiry (ms epoch). null = no buff active. */
  petBuffUntil: number | null
  /** Daily caps for cross-system rewards. Reset at local midnight. */
  dailyCaps: {
    /** ISO date (YYYY-MM-DD) the cap window started. */
    date: string
    /** Stars earned today via Apple Catcher. */
    minigameStars: number
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
