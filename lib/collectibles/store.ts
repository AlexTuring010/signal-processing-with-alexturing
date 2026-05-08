'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import { VERSION, freshCollectibles } from './defaults'
import { getCollectible } from './registry'
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
   * Pick up a collectible. Sets `found[id]`, queues a banner, plays the
   * discover SFX, auto-equips wearables (replacing any existing item in
   * that slot), auto-places decorations into empty slots. No-op if the
   * id is unknown or already found.
   */
  find: (id: CollectibleId) => boolean
  /** Mark `newSinceSeen` as cleared — called when /collection is opened. */
  markAllSeen: () => void
  /** Dismiss the head-of-queue banner. */
  dismissBanner: (seq: number) => void
  /**
   * Phase 1 debug-only: directly set equipment without going through
   * find. Kept available for development scenarios where you want to
   * preview an item without "finding" it.
   */
  setEquipped: (slot: WearableSlot, id: CollectibleId | null) => void
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadInitial(): CollectiblesState {
  const raw = readJSON<any>(STORAGE_KEYS.collectibles, null)
  if (!raw) return freshCollectibles()
  // Future migrations live here. Keep the switch shape so a v2 schema
  // change has a one-branch home.
  if (raw.version !== VERSION) return freshCollectibles()
  return raw as CollectiblesState
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function persist(state: CollectiblesState) {
  writeJSON(STORAGE_KEYS.collectibles, state)
}

/**
 * Drop a decoration into the first compatible empty slot. If every
 * matching slot is already filled, the item is still recorded as found
 * but not auto-placed — the player can swap it in via the wardrobe
 * (Phase 3). Tabletop items are silently dropped to the inventory if
 * no desk is placed yet — they'll appear when one is.
 */
function placeDecoration(
  state: CollectiblesState,
  slot: Slot,
  id: CollectibleId,
): CollectiblesState {
  const room = state.roomLayout
  switch (slot) {
    case 'floor':
      if (room.floor !== null) return state
      return { ...state, roomLayout: { ...room, floor: id } }
    case 'wall': {
      const idx = room.wall.findIndex((s) => s === null)
      if (idx === -1) return state
      const wall = [...room.wall] as typeof room.wall
      wall[idx] = id
      return { ...state, roomLayout: { ...room, wall } }
    }
    case 'bed':
    case 'desk':
    case 'chair':
    case 'lamp':
      if (room.furniture[slot] !== null) return state
      return {
        ...state,
        roomLayout: {
          ...room,
          furniture: { ...room.furniture, [slot]: id },
        },
      }
    case 'tabletop':
      if (room.furniture.desk === null || room.tabletop !== null) return state
      return { ...state, roomLayout: { ...room, tabletop: id } }
    default:
      return state
  }
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
      // Wearables auto-equip. The previous occupant of the slot is
      // implicitly returned to inventory (it's still in `found`).
      next = {
        ...next,
        equipped: { ...next.equipped, [item.slot]: id },
      }
    } else {
      // Decorations attempt auto-placement; failure is silent — they
      // sit in inventory until the wardrobe places them.
      next = placeDecoration(next, item.slot, id)
    }

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
