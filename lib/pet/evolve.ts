import type { PetState } from './types'
import { ADULT_AGE_MS, ADULT_RECENT_AVG } from './defaults'
import { avgNeed } from './decay'

/**
 * Pure function: stage upgrades only. Egg → baby is user-driven (hatch action),
 * never automatic. Baby → adult fires automatically once the pet has been
 * hatched long enough AND its current needs are in good shape.
 */
export function maybeEvolve(state: PetState, now: number): PetState {
  if (state.stage !== 'baby' || state.hatchedAt === null) return state

  const ageSinceHatch = now - state.hatchedAt
  if (ageSinceHatch < ADULT_AGE_MS) return state
  if (avgNeed(state.needs) < ADULT_RECENT_AVG) return state

  return { ...state, stage: 'adult' }
}
