import type { GoodKey, OrchardState, Plot, Resources } from './types'

export const VERSION = 7 as const

/** Bonus stars granted when all 3 daily quests are completed in one day. */
export const QUEST_ALL_DONE_BONUS = 2
/** Stars per individual quest. */
export const QUEST_STAR_REWARD = 1
/** How many quests are picked from the pool each day. */
export const QUESTS_PER_DAY = 3

/** Lifetime coins required before the Compost tab becomes visible. The plan
 *  cites 100 k coins; in practice 5 k is reachable in a focused early-session
 *  and gives the player time to feel the early loop before prestige enters. */
export const COMPOST_THRESHOLD = 5000

/** Compost-run thresholds for the permanent global yield bonus. Each entry
 *  is `[compostRunCount, multiplier]`; we pick the largest that applies. */
export const COMPOST_YIELD_TIERS: ReadonlyArray<readonly [number, number]> = [
  [1, 1.10],
  [5, 1.25],
  [10, 1.50],
  [25, 1.75],
] as const

/** Blueprint discount on rebuild — buildings owned at level ≥ 3 at the time
 *  of compost cost half as many coins to construct on the next run. */
export const BLUEPRINT_DISCOUNT = 0.5
export const BLUEPRINT_LEVEL_GATE = 3

/** Petting buff: 5 minutes long, ×1.10 on top of the mood multiplier. */
export const PET_BUFF_MS = 5 * 60 * 1000
export const PET_BUFF_MULT = 1.1
/** Cooldown before another pet press grants a fresh buff. */
export const PET_BUFF_COOLDOWN_MS = 60 * 1000

/** Apple Catcher → orchard hooks. */
export const MINIGAME_APPLES_PER_NORMAL = 0.5
export const MINIGAME_APPLES_PER_GOLDEN = 1.5
/** Stars: 1 per `MINIGAME_SCORE_PER_STAR` score, capped per run + per real day. */
export const MINIGAME_SCORE_PER_STAR = 10
export const MINIGAME_STARS_PER_RUN_CAP = 5
export const MINIGAME_STARS_PER_DAY_CAP = 10

/** Sleeping pet trades production speed (×0.5 mood) for faster growth (-30%). */
export const SLEEPING_GROWTH_MULT = 0.7

export const STARTING_PLOTS = 12
export const STARTING_BARN = 50
/** Gift on first open so the very first sapling can be planted with no friction. */
export const STARTING_APPLES = 10

/** Per-good sell prices. The market panel sells everything at flat rates in
 *  Phase 2; Phase 3 turns these into a price walk. */
export const GOOD_PRICE: Record<GoodKey, number> = {
  apples: 0.1,
  juice: 0.8,
  cider: 2.5,
  jam: 4.0,
  pies: 18.0,
}

/** Greek display labels + emoji for each tradeable good. Used by the HUD,
 *  market panel, and building cards. Single source of truth keeps copy in
 *  sync across the orchard UI. */
export const GOOD_META: Record<GoodKey, { emoji: string; name: string }> = {
  apples: { emoji: '🍎', name: 'Μήλα' },
  juice: { emoji: '🧃', name: 'Χυμός' },
  cider: { emoji: '🍷', name: 'Μηλίτης' },
  jam: { emoji: '🍯', name: 'Μαρμελάδα' },
  pies: { emoji: '🥧', name: 'Μηλόπιτα' },
}

/** Building level cap. Each level cuts batch time -10% and adds +1 yield. */
export const MAX_BUILDING_LEVEL = 5

/** Idle catch-up rate gates. After 8 hours the rate halves; after 24 it stops. */
export const OFFLINE_FULL_MS = 8 * 60 * 60 * 1000
export const OFFLINE_HALF_MS = 24 * 60 * 60 * 1000

/** Pet mood multipliers applied to all production. */
export const MOOD_MULT = {
  happy: 1.2,
  neutral: 1.0,
  sad: 0.8,
  sick: 0.5,
  asleep: 0.5,
} as const

/** Phase 1 market: a flat exchange rate. Replaced in Phase 3 with a price walk. */
export const APPLE_PRICE = 0.1

/** Tap-to-harvest gives a small bonus on top of accumulated apples. */
export const SHAKE_BONUS = 0.1

export function makePlots(count: number, cols = 4): Plot[] {
  const plots: Plot[] = []
  for (let i = 0; i < count; i++) {
    plots.push({
      id: `p${i}`,
      position: { x: i % cols, y: Math.floor(i / cols) },
      tree: null,
    })
  }
  return plots
}

/** Local-timezone "YYYY-MM-DD" key for daily-cap rollover. */
export function localDateKey(t: number = Date.now()): string {
  const d = new Date(t)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function freshResources(): Resources {
  return {
    apples: STARTING_APPLES,
    juice: 0,
    cider: 0,
    jam: 0,
    pies: 0,
    coins: 0,
    seeds: 0,
    stars: 0,
    research: 0,
  }
}

export function freshOrchard(now: number = Date.now()): OrchardState {
  return {
    version: VERSION,
    startedAt: now,
    lastTickAt: now,
    resources: freshResources(),
    barnCapacity: STARTING_BARN,
    plots: makePlots(STARTING_PLOTS),
    buildings: [],
    autoSell: {},
    researchTree: { completed: [], inProgress: null },
    prestige: {
      compostRun: 0,
      seedShopOwned: {},
      blueprints: [],
      lastCompostLifetime: 0,
    },
    petBuffUntil: null,
    dailyCaps: { date: localDateKey(now), minigameStars: 0 },
    achieved: [],
    quests: {
      date: localDateKey(now),
      selected: [],
      baseline: {
        coinsEarned: 0,
        applesHarvested: 0,
        treesPlanted: 0,
        compostRun: 0,
        researchCompleted: 0,
        petActions: 0,
        seedShopBought: 0,
      },
      completed: [],
      bonusClaimedDate: null,
    },
    lifetime: {
      applesHarvested: 0,
      coinsEarned: 0,
      treesPlanted: 0,
    },
    flags: {
      seenIntro: false,
      seenFirstHarvest: false,
      seenFirstSale: false,
    },
  }
}
