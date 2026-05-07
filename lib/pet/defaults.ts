import type { PetState } from './types'

export const DEFAULT_NAME = 'Σιγμάκι'
export const MAX_NAME_LENGTH = 16

export const NEED_MAX = 100
export const NEED_MIN = 0

/** Awake decay, points per hour. */
export const DECAY_AWAKE = {
  hunger: 8,
  happiness: 6,
  energy: 10,
} as const

/** Sleep modifies decay: hunger half-rate, happiness paused, energy regen. */
export const DECAY_ASLEEP = {
  hunger: 4,
  happiness: 0,
  energy: -20, // negative = regenerate
} as const

export const COOLDOWN_MS = {
  feed: 60_000,
  play: 90_000,
  clean: 4 * 60 * 60 * 1000, // also reused for heal
} as const

export const ACTION_EFFECT = {
  feed: { hunger: 30, happiness: 5, energy: 0 },
  play: { hunger: 0, happiness: 25, energy: -10 },
  pet: { hunger: 0, happiness: 5, energy: 0 },
  heal: { hunger: 0, happiness: 0, energy: 0 }, // heal sets needs to 60 minimum, handled separately
} as const

/** Adult requires this much real time alive (since hatch) plus solid recent care. */
export const ADULT_AGE_MS = 3 * 24 * 60 * 60 * 1000
export const ADULT_RECENT_AVG = 60

/** A need at 0 must persist this long for `sickSince` to be considered "actually sick". */
export const SICK_GRACE_MS = 60 * 60 * 1000

export function freshEgg(now: number = Date.now()): PetState {
  return {
    version: 1,
    hatched: false,
    name: DEFAULT_NAME,
    stage: 'egg',
    bornAt: now,
    hatchedAt: null,
    needs: { hunger: 80, happiness: 80, energy: 80 },
    sleeping: false,
    sickSince: null,
    lastTickAt: now,
    cooldowns: { feed: 0, play: 0, clean: 0 },
    totalActions: 0,
  }
}
