import type { Needs, PetState } from './types'
import {
  DECAY_ASLEEP,
  DECAY_AWAKE,
  NEED_MAX,
  NEED_MIN,
  SICK_GRACE_MS,
} from './defaults'

const clamp = (v: number) => Math.max(NEED_MIN, Math.min(NEED_MAX, v))

/**
 * Pure function: returns a new PetState with needs decayed for the elapsed
 * time and `lastTickAt` advanced. Eggs do not decay. Sleeping uses different
 * rates (incl. negative for energy = regen).
 */
export function applyDecay(state: PetState, now: number): PetState {
  if (state.stage === 'egg') {
    return state.lastTickAt === now ? state : { ...state, lastTickAt: now }
  }

  const elapsedMs = Math.max(0, now - state.lastTickAt)
  if (elapsedMs === 0) return state

  const hours = elapsedMs / 3_600_000
  const rates = state.sleeping ? DECAY_ASLEEP : DECAY_AWAKE

  const next: Needs = {
    hunger: clamp(state.needs.hunger - rates.hunger * hours),
    happiness: clamp(state.needs.happiness - rates.happiness * hours),
    energy: clamp(state.needs.energy - rates.energy * hours),
  }

  // Sick tracking: any need at 0 keeps a streak; otherwise reset.
  const anyZero = next.hunger === 0 || next.happiness === 0 || next.energy === 0
  let sickSince = state.sickSince
  if (anyZero) {
    if (sickSince === null) sickSince = now
  } else {
    sickSince = null
  }

  return {
    ...state,
    needs: next,
    sickSince,
    lastTickAt: now,
  }
}

/** Convenience: is the pet currently considered "sick" (zero need persisting past grace)? */
export function isSick(state: PetState, now: number = Date.now()): boolean {
  return state.sickSince !== null && now - state.sickSince >= SICK_GRACE_MS
}

/** Average of all three needs, used by mood + evolution checks. */
export function avgNeed(needs: Needs): number {
  return (needs.hunger + needs.happiness + needs.energy) / 3
}
