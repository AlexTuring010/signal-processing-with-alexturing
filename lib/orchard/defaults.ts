import type { GoodKey, OrchardState, Plot, Resources } from './types'

export const VERSION = 4 as const

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
