'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import { VERSION, freshCollectibles } from './defaults'
import { getCollectible } from './registry'
import type {
  CollectibleId,
  CollectiblesState,
  WearableSlot,
} from './types'

type Store = {
  state: CollectiblesState
  hydrated: boolean
  /** Lazy hydration on first PetSprite mount. */
  hydrate: () => void
  /**
   * Phase 1 debug-only: directly set equipment without going through
   * the find flow. Phase 2 introduces `find(id)` which sets `found`
   * AND auto-equips. Until then this is the only way to test the
   * layered sprite pipeline.
   */
  setEquipped: (slot: WearableSlot, id: CollectibleId | null) => void
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadInitial(): CollectiblesState {
  const raw = readJSON<any>(STORAGE_KEYS.collectibles, null)
  if (!raw) return freshCollectibles()
  if (raw.version !== VERSION) return freshCollectibles()
  return raw as CollectiblesState
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function persist(state: CollectiblesState) {
  writeJSON(STORAGE_KEYS.collectibles, state)
}

export const useCollectiblesStore = create<Store>((set, get) => ({
  state: freshCollectibles(),
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({ state: loadInitial(), hydrated: true })
  },

  setEquipped: (slot, id) => {
    // Reject ids that don't exist in the registry, except `null` (clearing
    // a slot is always valid). Catches console typos during debugging.
    if (id !== null && !getCollectible(id)) {
      // eslint-disable-next-line no-console
      console.warn(`[collectibles] Unknown id "${id}" — ignored.`)
      return
    }
    // Reject ids whose slot doesn't match the target slot. A 'head' item
    // can't go into 'eyes'.
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

// Phase 1 console hook — exposes the store to window so we can do
// `__collectibles.setEquipped('head', '_test-hat')` from devtools.
// Stripped from production by the bundler when unused, but harmless
// either way (it's only a reference, no side effects).
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as unknown as Record<string, unknown>).__collectibles =
    useCollectiblesStore
}
