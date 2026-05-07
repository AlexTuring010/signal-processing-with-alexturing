import type { SpeciesId, Tree } from './types'

/* -------------------------------------------------------------------------- */
/*  Tree species registry                                                      */
/*                                                                            */
/*  Phase 1 ships with a single species. Other species in 99b-tycoon.md slot  */
/*  in here without changing callers.                                         */
/* -------------------------------------------------------------------------- */

export type Species = {
  id: SpeciesId
  /** Greek display name. */
  name: string
  /** Cost (in apples) to plant the *first* tree of this species. */
  baseCost: number
  /** Cost growth factor per owned tree of this species. */
  costGrowth: number
  /** Seconds per produced apple at stage 2 (mature) at level 0. */
  baseIntervalS: number
  /** Apples produced per cycle at stage 2 (mature) at level 0. */
  baseYield: number
  /** Tree storage cap at level 0. Higher levels add +2 each. */
  baseStorage: number
  /** Real-time milestones to grow from sapling → small → mature. */
  growthMs: { toSmall: number; toMature: number }
}

const CLASSIC: Species = {
  id: 'classic',
  name: 'Κλασικό',
  baseCost: 10,
  costGrowth: 1.15,
  baseIntervalS: 8,
  baseYield: 1,
  baseStorage: 5,
  growthMs: {
    toSmall: 30 * 1000, // 30 s
    toMature: 5 * 60 * 1000, // 5 min
  },
}

const REGISTRY: Record<SpeciesId, Species> = {
  classic: CLASSIC,
}

export function getSpecies(id: SpeciesId): Species {
  return REGISTRY[id]
}

/** Cost (in apples) to plant the next tree of `id`, given how many you already own. */
export function plantCost(id: SpeciesId, ownedCount: number): number {
  const sp = getSpecies(id)
  return Math.ceil(sp.baseCost * Math.pow(sp.costGrowth, ownedCount))
}

/** Total apples on-tree storage cap (level-aware). */
export function treeStorage(tree: Tree): number {
  const sp = getSpecies(tree.speciesId)
  return sp.baseStorage + tree.level * 2
}

/** Effective seconds per apple for `tree` (factoring stage + level). */
export function intervalS(tree: Tree): number {
  const sp = getSpecies(tree.speciesId)
  // Each level shaves 5% off interval, capped at -60% (so floor = 0.40 × base).
  const levelMult = Math.max(0.4, 1 - 0.05 * tree.level)
  return sp.baseIntervalS * levelMult
}

/** Effective per-cycle yield (factoring stage + level). */
export function yieldPerCycle(tree: Tree): number {
  const sp = getSpecies(tree.speciesId)
  return sp.baseYield + 0.5 * tree.level
}

/**
 * Stage modifier on yield. Sapling produces nothing; small at half; mature full.
 * Phase 1 ships stages 0..2 only; 3 and 4 are reserved for later phases.
 */
export function stageMult(stage: Tree['growthStage']): number {
  switch (stage) {
    case 0:
      return 0
    case 1:
      return 0.5
    case 2:
      return 1.0
    case 3:
      return 1.3
    case 4:
      return 1.7
  }
}

/**
 * Determine the tree's growth stage at `now`. Pure: doesn't mutate the tree.
 * Stage 0..2 only in Phase 1. Stage 3 ("bountiful") and 4 ("ancient") need
 * "continuous care" tracking that doesn't exist yet.
 */
export function stageAt(tree: Tree, now: number): Tree['growthStage'] {
  const sp = getSpecies(tree.speciesId)
  const age = now - tree.plantedAt
  if (age < sp.growthMs.toSmall) return 0
  if (age < sp.growthMs.toMature) return 1
  return 2
}

/** Real-time ms remaining until the next stage transition (or null if at terminal Phase 1 stage). */
export function msToNextStage(tree: Tree, now: number): number | null {
  const sp = getSpecies(tree.speciesId)
  const age = now - tree.plantedAt
  if (age < sp.growthMs.toSmall) return sp.growthMs.toSmall - age
  if (age < sp.growthMs.toMature) return sp.growthMs.toMature - age
  return null
}

/** A short Greek label for the current stage, used by the detail card. */
export function stageLabel(stage: Tree['growthStage']): string {
  switch (stage) {
    case 0:
      return 'Φύτρο'
    case 1:
      return 'Νεαρό'
    case 2:
      return 'Ώριμο'
    case 3:
      return 'Καρπερό'
    case 4:
      return 'Αρχαίο'
  }
}
