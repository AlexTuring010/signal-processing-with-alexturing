'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import { VERSION, freshCollectibles } from './defaults'
import { getCollectible, isDecoration } from './registry'
import { playCollectibleSound } from './audio'
import type {
  CollectibleId,
  CollectiblesState,
  Slot,
  WearableSlot,
} from './types'

const WEARABLE_SLOTS: ReadonlySet<Slot> = new Set([
  'head',
  'eyes',
  'body',
  'accessory',
  'skin',
])

function isWearableSlot(slot: Slot): slot is WearableSlot {
  return WEARABLE_SLOTS.has(slot)
}

/**
 * Pending banner for the FindBanner component. Banners are queued so
 * picking up two items in quick succession shows both, one at a time.
 * Transient state — never persisted.
 */
export type PendingBanner = {
  /** Increasing sequence id used as React key. */
  seq: number
  id: CollectibleId
}

let bannerSeq = 0

type Store = {
  state: CollectiblesState
  hydrated: boolean
  /** Pending banners — head of queue is the one currently displayed. */
  banners: PendingBanner[]

  /** Lazy hydration on first PetSprite mount. */
  hydrate: () => void
  /**
   * Pick up a collectible. Sets `found[id]`, queues a banner, plays
   * the discover SFX, and auto-equips wearables. Decorations are NOT
   * auto-placed — the player toggles them on from the catalog.
   */
  find: (id: CollectibleId) => boolean
  /** Mark `newSinceSeen` as cleared — called when /collection is opened. */
  markAllSeen: () => void
  /** Dismiss the head-of-queue banner. */
  dismissBanner: (seq: number) => void
  /**
   * Toggle a decoration on/off the pet stage. The item must already
   * be in `state.found` and must be a decoration. Returns true if
   * the action took effect.
   */
  togglePlaced: (id: CollectibleId) => boolean
  /**
   * Phase 1 debug-only: directly set equipment without going through
   * find. Kept available for development scenarios where you want to
   * preview an item without "finding" it.
   */
  setEquipped: (slot: WearableSlot, id: CollectibleId | null) => void
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadInitial(): CollectiblesState {
  let raw = readJSON<any>(STORAGE_KEYS.collectibles, null)
  if (!raw) return freshCollectibles()
  // v1 → v2: roomLayout is replaced by `placed` (a flat list of ids).
  // Carry over any decoration ids that were placed in the old slotted
  // layout so the player doesn't lose their setup. Wearables and
  // `found` are unchanged.
  if (raw.version === 1) {
    const room = raw.roomLayout ?? {}
    const placed: CollectibleId[] = []
    if (room.floor) placed.push(room.floor)
    if (Array.isArray(room.wall)) {
      for (const w of room.wall) if (w) placed.push(w)
    }
    if (room.furniture) {
      for (const id of Object.values(room.furniture)) {
        if (id) placed.push(id as CollectibleId)
      }
    }
    if (room.tabletop) placed.push(room.tabletop)
    raw = {
      version: 2,
      startedAt: raw.startedAt ?? null,
      found: raw.found ?? {},
      equipped: raw.equipped ?? {
        head: null,
        eyes: null,
        body: null,
        accessory: null,
      },
      placed,
      newSinceSeen: raw.newSinceSeen ?? [],
    }
  }
  if (raw.version === 2) {
    // v2 → v3: add the `skin` equip slot. Existing equipment carries
    // forward; skin starts unequipped.
    raw = {
      ...raw,
      version: 3,
      equipped: { ...raw.equipped, skin: raw.equipped?.skin ?? null },
    }
  }
  if (raw.version !== VERSION) return freshCollectibles()
  // Self-clean: drop any ids in `placed` that don't resolve to a
  // decoration (defensive against past bugs where wearables — esp.
  // skins — slipped in before the slot enforcement was correct).
  if (Array.isArray(raw.placed)) {
    const cleaned = raw.placed.filter((id: string) => {
      const item = getCollectible(id)
      return Boolean(item && isDecoration(item))
    })
    if (cleaned.length !== raw.placed.length) {
      raw = { ...raw, placed: cleaned }
    }
  }
  return raw as CollectiblesState
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function persist(state: CollectiblesState) {
  writeJSON(STORAGE_KEYS.collectibles, state)
}

export const useCollectiblesStore = create<Store>((set, get) => ({
  state: freshCollectibles(),
  hydrated: false,
  banners: [],

  hydrate: () => {
    if (get().hydrated) return
    set({ state: loadInitial(), hydrated: true })
  },

  find: (id) => {
    const item = getCollectible(id)
    if (!item) return false
    const state = get().state
    if (state.found[id]) return false

    const now = Date.now()
    let next: CollectiblesState = {
      ...state,
      startedAt: state.startedAt ?? now,
      found: { ...state.found, [id]: now },
      newSinceSeen: state.newSinceSeen.includes(id)
        ? state.newSinceSeen
        : [...state.newSinceSeen, id],
    }

    if (isWearableSlot(item.slot)) {
      // Wearables auto-equip on find — the previous occupant of the
      // slot stays in `found` (i.e. inventory).
      next = {
        ...next,
        equipped: { ...next.equipped, [item.slot]: id },
      }
    }
    // Decorations: do nothing else. The player toggles them on from
    // the catalog when they want them visible.

    persist(next)
    playCollectibleSound('discover')
    set({
      state: next,
      banners: [...get().banners, { seq: ++bannerSeq, id }],
    })
    return true
  },

  markAllSeen: () => {
    const state = get().state
    if (state.newSinceSeen.length === 0) return
    const next: CollectiblesState = { ...state, newSinceSeen: [] }
    persist(next)
    set({ state: next })
  },

  dismissBanner: (seq) => {
    set({ banners: get().banners.filter((b) => b.seq !== seq) })
  },

  togglePlaced: (id) => {
    const item = getCollectible(id)
    if (!item || !isDecoration(item)) return false
    const state = get().state
    if (!state.found[id]) return false

    const isPlaced = state.placed.includes(id)
    const next: CollectiblesState = {
      ...state,
      placed: isPlaced
        ? state.placed.filter((p) => p !== id)
        : [...state.placed, id],
    }
    persist(next)
    playCollectibleSound('place')
    set({ state: next })
    return true
  },

  setEquipped: (slot, id) => {
    if (id !== null && !getCollectible(id)) {
      // eslint-disable-next-line no-console
      console.warn(`[collectibles] Unknown id "${id}" — ignored.`)
      return
    }
    if (id !== null) {
      const item = getCollectible(id)!
      if (item.slot !== slot) {
        // eslint-disable-next-line no-console
        console.warn(
          `[collectibles] "${id}" is a "${item.slot}" item; cannot equip on slot "${slot}".`,
        )
        return
      }
    }
    const next: CollectiblesState = {
      ...get().state,
      equipped: { ...get().state.equipped, [slot]: id },
    }
    persist(next)
    set({ state: next })
  },
}))

// Phase 1 console hook — kept for dev parity.
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__collectibles =
    useCollectiblesStore
}
