import { useOrchardStore } from '@/lib/orchard/store'
import { useAppStore } from '@/lib/store'
import { readJSON, STORAGE_KEYS } from '@/lib/storage'

/**
 * Cross-tied item eligibility checks.
 *
 * Each function returns true when the player has earned the item
 * — the store calls these on a tick (panel open + every ~10s) and
 * auto-grants any item whose check passes for a player who doesn't
 * own it yet.
 *
 * Checks pull from sibling stores (orchard, app) and from
 * persisted localStorage values (e.g. the Apple Catcher high score).
 */
export type EligibilityCheck = () => boolean

const TOTAL_CHAPTERS = 25

export const ELIGIBILITY: Record<string, EligibilityCheck> = {
  // Time-locked: open the site between 00:00 and 06:00 local time.
  'night-cap': () => {
    const h = new Date().getHours()
    return h >= 0 && h < 6
  },
  // Orchard prestige: composted at least 5 times.
  'compost-crown': () => {
    return useOrchardStore.getState().state.prestige.compostRun >= 5
  },
  // Apple Catcher mastery: high score ≥ 100.
  'lucky-cap': () => {
    const high = readJSON<number>(STORAGE_KEYS.petGameHigh, 0)
    return high >= 100
  },
  // Study commitment: completed at least half the chapters.
  'studious-vest': () => {
    const completed = useAppStore.getState().completed
    return completed.size >= Math.ceil(TOTAL_CHAPTERS / 2)
  },
}
