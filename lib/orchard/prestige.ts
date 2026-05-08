import type { OrchardState } from './types'
import { COMPOST_THRESHOLD, COMPOST_YIELD_TIERS } from './defaults'

/* -------------------------------------------------------------------------- */
/*  Prestige (Compost) — Phase 6                                               */
/*                                                                            */
/*  Math + seed shop registry. The store wraps these in actions; UI panels    */
/*  read from them for projections (seed reward + which permanent buffs       */
/*  apply).                                                                   */
/* -------------------------------------------------------------------------- */

/** Coins earned during the current run = lifetime − snapshot at last compost. */
export function currentRunCoins(state: OrchardState): number {
  return Math.max(
    0,
    state.lifetime.coinsEarned - state.prestige.lastCompostLifetime,
  )
}

/**
 * Seed reward formula: floor(sqrt(currentRunCoins / 1000)).
 * 5 k coins → 2 seeds, 100 k → 10, 1 M → 31, 100 M → 316. Sublinear so
 * "one more run" is always worse than "wait a bit longer", per Cookie
 * Clicker convention.
 */
export function seedReward(state: OrchardState): number {
  const c = currentRunCoins(state)
  return Math.floor(Math.sqrt(c / 1000))
}

/** Permanent global yield multiplier from compost-run tier × star-wish bonus. */
export function permanentYieldMult(state: OrchardState): number {
  let mult = 1.0
  for (const [threshold, m] of COMPOST_YIELD_TIERS) {
    if (state.prestige.compostRun >= threshold) mult = m
  }
  // Apply the star-wish "Αιώνια ευλογία" bonus on top of the compost ladder.
  return mult * wishYieldMult(state)
}

/** Whether the player has earned access to the Compost tab. */
export function compostUnlocked(state: OrchardState): boolean {
  return (
    state.prestige.compostRun > 0 ||
    state.lifetime.coinsEarned >= COMPOST_THRESHOLD
  )
}

/* -------------------------------------------------------------------------- */
/*  Seed Shop                                                                  */
/* -------------------------------------------------------------------------- */

export type SeedShopItemId =
  | 'apple-yield'
  | 'product-yield'
  | 'research-rate'
  | 'barn-bonus'
  | 'offline-cap'

export type SeedShopItem = {
  id: SeedShopItemId
  /** Greek display name. */
  name: string
  /** Greek description with the per-purchase effect. */
  description: string
  /** Seeds per purchase. */
  cost: number
  /** Soft cap on purchases (UI shows full bar at maxOwned). */
  maxOwned: number
  /** Single-emoji visual. */
  emoji: string
}

export const SEED_SHOP: SeedShopItem[] = [
  {
    id: 'apple-yield',
    name: 'Καρπερά δέντρα',
    description: '+5% παραγωγή μήλων ανά αγορά (μέχρι +25%).',
    cost: 1,
    maxOwned: 5,
    emoji: '🍎',
  },
  {
    id: 'product-yield',
    name: 'Βελτιωμένες παρτίδες',
    description: '+5% παραγωγή σε χυμό/μηλίτη/μαρμελάδα/πίτα ανά αγορά (μέχρι +25%).',
    cost: 1,
    maxOwned: 5,
    emoji: '🍯',
  },
  {
    id: 'research-rate',
    name: 'Επιταχυντής έρευνας',
    description: '+25% ρυθμός 🧪 ανά αγορά (μέχρι +100%).',
    cost: 3,
    maxOwned: 4,
    emoji: '🧪',
  },
  {
    id: 'barn-bonus',
    name: 'Επεκτάσεις αποθήκης',
    description: '+50 χωρητικότητα αποθήκης ανά αγορά (μέχρι +200).',
    cost: 5,
    maxOwned: 4,
    emoji: '📦',
  },
  {
    id: 'offline-cap',
    name: 'Καλύτερη συντήρηση',
    description: '+1 ώρα στο όριο idle (8h → 16h).',
    cost: 10,
    maxOwned: 8,
    emoji: '⏳',
  },
]

const SEED_SHOP_BY_ID: Record<string, SeedShopItem> = Object.fromEntries(
  SEED_SHOP.map((i) => [i.id, i]),
)

export function getSeedShopItem(id: string): SeedShopItem | undefined {
  return SEED_SHOP_BY_ID[id]
}

export function ownedCount(state: OrchardState, id: SeedShopItemId): number {
  return state.prestige.seedShopOwned[id] ?? 0
}

/** -------- Read-time helpers (consumed by effects.ts) -------- */

/** Per-resource yield multiplier from the seed shop. */
export function appleYieldShopMult(state: OrchardState): number {
  return 1 + 0.05 * ownedCount(state, 'apple-yield')
}

export function productYieldShopMult(state: OrchardState): number {
  return 1 + 0.05 * ownedCount(state, 'product-yield')
}

/** Multiplier on 🧪 production rate. */
export function researchRateShopMult(state: OrchardState): number {
  return 1 + 0.25 * ownedCount(state, 'research-rate')
}

/** Flat additive bonus to barn capacity. */
export function barnBonusShop(state: OrchardState): number {
  return 50 * ownedCount(state, 'barn-bonus')
}

/** Extra hours added to the offline-full-rate cap. */
export function offlineCapBonusHours(state: OrchardState): number {
  return ownedCount(state, 'offline-cap')
}

/* -------------------------------------------------------------------------- */
/*  Star Wishes (Ευχές) — spend ⭐                                            */
/*                                                                            */
/*  ⭐ are awarded by quests, achievements, the minigame, and click events.   */
/*  Wishes give them a use — instant boons + a stackable permanent buff.      */
/* -------------------------------------------------------------------------- */

export type StarWishId =
  | 'wish-research-skip'
  | 'wish-extra-seeds'
  | 'wish-yield-bonus'

export type StarWish = {
  id: StarWishId
  /** Greek display name. */
  name: string
  /** Greek description with the per-purchase effect. */
  description: string
  /** Stars per purchase. */
  cost: number
  /** Soft cap (Infinity for re-usable wishes like research-skip). */
  maxOwned: number
  /** Single-emoji visual. */
  emoji: string
  /** True for wishes that have a stackable persistent effect; false for
   *  one-shots that only fire at purchase time. */
  stackable: boolean
}

export const STAR_WISHES: StarWish[] = [
  {
    id: 'wish-research-skip',
    name: 'Άμεση ολοκλήρωση έρευνας',
    description: 'Τελείωσε αμέσως την τρέχουσα έρευνα.',
    cost: 3,
    maxOwned: Infinity,
    emoji: '🧪',
    stackable: false,
  },
  {
    id: 'wish-extra-seeds',
    name: 'Δώρο σπόρων',
    description: '+5 🌱 σπόροι αμέσως.',
    cost: 5,
    maxOwned: Infinity,
    emoji: '🌱',
    stackable: false,
  },
  {
    id: 'wish-yield-bonus',
    name: 'Αιώνια ευλογία',
    description: '+5% μόνιμη παραγωγή ανά αγορά (μέχρι +25%).',
    cost: 10,
    maxOwned: 5,
    emoji: '✨',
    stackable: true,
  },
]

const STAR_WISHES_BY_ID: Record<string, StarWish> = Object.fromEntries(
  STAR_WISHES.map((w) => [w.id, w]),
)

export function getStarWish(id: string): StarWish | undefined {
  return STAR_WISHES_BY_ID[id]
}

export function wishOwned(state: OrchardState, id: StarWishId): number {
  return state.prestige.wishesOwned[id] ?? 0
}

/** Permanent yield boost from the wish-yield-bonus wish (max +25%). */
export function wishYieldMult(state: OrchardState): number {
  return 1 + 0.05 * wishOwned(state, 'wish-yield-bonus')
}
