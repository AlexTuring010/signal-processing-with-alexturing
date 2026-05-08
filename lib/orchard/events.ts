import type { EventCategory, EventInstance, OrchardState } from './types'
import {
  EVENT_INTERVAL_MAX_MS,
  EVENT_INTERVAL_MIN_MS,
} from './defaults'

/* -------------------------------------------------------------------------- */
/*  Random events — Phase 7b                                                   */
/*                                                                            */
/*  Six events that shake up the loop: rain (growth boost), storm (production  */
/*  penalty), squirrel (apple theft), shooting star + lucky hedgehog (click-   */
/*  to-claim), harvest festival (post-milestone production multiplier).       */
/*                                                                            */
/*  One active event at a time. The scheduler in tick() rolls the next based  */
/*  on weighted picks gated by simple state predicates (e.g. storms only fire */
/*  post-compost, festival only after a lifetime apple milestone). Events     */
/*  pause while the pet is sick — the pet store gates "spice" events.         */
/* -------------------------------------------------------------------------- */

export type EventKind =
  | 'rain'
  | 'storm'
  | 'squirrel'
  | 'shooting-star'
  | 'lucky-hedgehog'
  | 'festival'

export type EventDef = {
  kind: EventKind
  /** Greek display name. */
  name: string
  /** One-line Greek description shown in the banner. */
  description: string
  /** Single-emoji visual. */
  emoji: string
  category: EventCategory
  /** ms the effect lasts (or the click window for `click` events). */
  durationMs: number
  /** Sampling weight at roll time. Higher = more frequent. */
  weight: number
  /** Whether this event is allowed to fire given current state. */
  allowed: (state: OrchardState) => boolean
  /**
   * For `instant` events: applied at fire time. Receives a draft state and
   * returns a mutated copy. For non-instant categories this is unused.
   */
  applyOnFire?: (state: OrchardState) => OrchardState
  /**
   * For `click` events: reward applied when the player claims via UI.
   * Receives a draft state and returns mutated. Pure.
   */
  applyOnClaim?: (state: OrchardState) => OrchardState
}

/* ------------------------------ Registry --------------------------------- */

const REGISTRY: Record<EventKind, EventDef> = {
  rain: {
    kind: 'rain',
    name: 'Καλοκαιρινή βροχή',
    description: 'Τα δέντρα μεγαλώνουν 20% πιο γρήγορα για 30 λεπτά.',
    emoji: '🌧️',
    category: 'buff',
    durationMs: 30 * 60 * 1000,
    weight: 30,
    allowed: () => true,
  },
  storm: {
    kind: 'storm',
    name: 'Καταιγίδα',
    description: 'Παραγωγή −50% για 30 λεπτά.',
    emoji: '⛈️',
    category: 'debuff',
    durationMs: 30 * 60 * 1000,
    weight: 10,
    // Only after the player has done at least one compost — keeps early-game
    // less punishing.
    allowed: (s) => s.prestige.compostRun >= 1,
  },
  squirrel: {
    kind: 'squirrel',
    name: 'Σαλιάρης',
    description: 'Ένας σκίουρος έκλεψε μήλα από την αποθήκη.',
    emoji: '🐿️',
    category: 'instant',
    // Visible briefly so the toast/banner can land — no actual ongoing effect.
    durationMs: 8 * 1000,
    weight: 18,
    // Don't fire when the barn is empty — feels mean for nothing.
    allowed: (s) => s.resources.apples >= 5,
    applyOnFire: (s) => {
      const stolen = Math.min(
        Math.floor(s.resources.apples),
        Math.floor(5 + Math.random() * 6), // 5-10
      )
      return {
        ...s,
        resources: { ...s.resources, apples: s.resources.apples - stolen },
      }
    },
  },
  'shooting-star': {
    kind: 'shooting-star',
    name: 'Διάττων αστέρας',
    description: 'Πάτα τον γρήγορα για ένα δωρεάν ⭐!',
    emoji: '🌟',
    category: 'click',
    durationMs: 30 * 1000,
    weight: 15,
    allowed: () => true,
    applyOnClaim: (s) => ({
      ...s,
      resources: { ...s.resources, stars: s.resources.stars + 1 },
    }),
  },
  'lucky-hedgehog': {
    kind: 'lucky-hedgehog',
    name: 'Τυχερός σκαντζόχοιρος',
    description: 'Πάτα τον για να σου αφήσει έναν σπόρο!',
    emoji: '🦔',
    category: 'click',
    durationMs: 60 * 1000,
    weight: 6,
    // Only matters once the player has unlocked compost and seeds make sense.
    allowed: (s) => s.prestige.compostRun >= 1 || s.resources.seeds >= 1,
    applyOnClaim: (s) => ({
      ...s,
      resources: { ...s.resources, seeds: s.resources.seeds + 1 },
    }),
  },
  festival: {
    kind: 'festival',
    name: 'Γιορτή της συγκομιδής',
    description: 'Παραγωγή ×3 για 1 ώρα.',
    emoji: '🎉',
    category: 'buff',
    durationMs: 60 * 60 * 1000,
    weight: 4,
    // A rare big-win event. Gated on a meaningful career milestone so it
    // feels earned rather than random spike.
    allowed: (s) => s.lifetime.applesHarvested >= 1000,
  },
}

export const EVENT_KINDS = Object.keys(REGISTRY) as EventKind[]

export function getEventDef(kind: string): EventDef | undefined {
  return REGISTRY[kind as EventKind]
}

let eventSeq = 0
function nextEventId(kind: string): string {
  return `e-${kind}-${++eventSeq}-${Date.now().toString(36)}`
}

/**
 * Pick one event to fire from the registry. Returns null when no event is
 * eligible (e.g. only storm allowed but storm filtered out by RNG roll).
 */
export function rollEvent(state: OrchardState, now: number): EventInstance | null {
  const eligible = EVENT_KINDS.map((k) => REGISTRY[k]).filter((d) =>
    d.allowed(state),
  )
  if (eligible.length === 0) return null
  const total = eligible.reduce((n, d) => n + d.weight, 0)
  let r = Math.random() * total
  let pick = eligible[0]!
  for (const d of eligible) {
    r -= d.weight
    if (r <= 0) {
      pick = d
      break
    }
  }
  return {
    id: nextEventId(pick.kind),
    kind: pick.kind,
    startedAt: now,
    expiresAt: now + pick.durationMs,
    claimed: false,
  }
}

/** Schedule the next roll (used after current event clears). */
export function scheduleNextEvent(now: number): number {
  const span = EVENT_INTERVAL_MAX_MS - EVENT_INTERVAL_MIN_MS
  return now + EVENT_INTERVAL_MIN_MS + Math.random() * span
}

/* ----------------------- Read-time effect helpers ------------------------ */

/** Multiplier on tree growth time (smaller = faster). */
export function eventGrowthMult(state: OrchardState): number {
  const ev = state.events.active
  if (!ev) return 1.0
  const def = getEventDef(ev.kind)
  if (!def) return 1.0
  // Rain accelerates growth (×0.8 — tree matures 20% faster).
  if (def.kind === 'rain') return 0.8
  return 1.0
}

/** Multiplier on production yield (>1 = boost, <1 = penalty). */
export function eventOutputMult(state: OrchardState): number {
  const ev = state.events.active
  if (!ev) return 1.0
  const def = getEventDef(ev.kind)
  if (!def) return 1.0
  if (def.kind === 'storm') return 0.5
  if (def.kind === 'festival') return 3.0
  return 1.0
}
