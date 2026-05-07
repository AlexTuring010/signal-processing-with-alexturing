'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import { useAppStore } from '../store'
import type { ActionKind, Mood, PetState } from './types'
import {
  ACTION_EFFECT,
  COOLDOWN_MS,
  DEFAULT_NAME,
  MAX_NAME_LENGTH,
  NEED_MAX,
  NEED_MIN,
  freshEgg,
} from './defaults'
import { applyDecay, avgNeed, isSick } from './decay'
import { maybeEvolve } from './evolve'

const clamp = (v: number) => Math.max(NEED_MIN, Math.min(NEED_MAX, v))

type Boost = {
  id: number
  label: string
  expiresAt: number
}

type Store = {
  hydrated: boolean
  state: PetState
  /** Last action that fired, for one-shot animations. Cleared via `clearAnim`. */
  lastAction: { kind: ActionKind; at: number } | null
  /** Transient toasts ("✨ +8 από διάβασμα"); auto-pruned by selectors. */
  boosts: Boost[]

  hydrate: () => void
  /** Reapplies decay using the current clock. Safe to call frequently. */
  tick: () => void
  /** Run a user action. No-op if disabled — caller should respect `canDo`. */
  dispatch: (kind: ActionKind, opts?: { name?: string }) => void
  /** Forwarded from app store. */
  applyStudyBoost: (kind: 'completion' | 'exercise') => void
  /** Rename pet (clamped to MAX_NAME_LENGTH; falls back to DEFAULT_NAME if empty). */
  rename: (next: string) => void
  /** Wipes the pet and starts a fresh egg. */
  reset: () => void
  /** Compute current mood derived from state. */
  mood: () => Mood
  /** Whether an action is currently allowed (cooldown / sleeping / stage rules). */
  canDo: (kind: ActionKind) => { ok: boolean; reason?: string }
}

let boostCounter = 0

function persist(state: PetState) {
  writeJSON(STORAGE_KEYS.pet, state)
}

function commit(state: PetState, now: number): PetState {
  const decayed = applyDecay(state, now)
  const evolved = maybeEvolve(decayed, now)
  return evolved
}

function loadInitial(): PetState {
  const raw = readJSON<PetState | null>(STORAGE_KEYS.pet, null)
  if (!raw || raw.version !== 1) return freshEgg()
  return raw
}

export const usePetStore = create<Store>((set, get) => ({
  hydrated: false,
  state: freshEgg(0), // placeholder until hydrate; bornAt=0 prevents weird "age" flashes
  lastAction: null,
  boosts: [],

  hydrate: () => {
    if (get().hydrated) return
    const now = Date.now()
    const loaded = loadInitial()
    const next = commit(loaded, now)
    persist(next)
    set({ hydrated: true, state: next })

    // Subscribe to app-store changes for study boosts.
    let lastCompleted = useAppStore.getState().completed.size
    let lastSolved = useAppStore.getState().solvedExercises.size
    useAppStore.subscribe((s) => {
      if (!get().hydrated) return
      if (s.completed.size > lastCompleted) {
        lastCompleted = s.completed.size
        get().applyStudyBoost('completion')
      } else {
        lastCompleted = s.completed.size
      }
      if (s.solvedExercises.size > lastSolved) {
        lastSolved = s.solvedExercises.size
        get().applyStudyBoost('exercise')
      } else {
        lastSolved = s.solvedExercises.size
      }
    })
  },

  tick: () => {
    const now = Date.now()
    const next = commit(get().state, now)
    if (next === get().state) {
      // Even if state didn't change semantically, prune expired boosts
      const fresh = get().boosts.filter((b) => b.expiresAt > now)
      if (fresh.length !== get().boosts.length) set({ boosts: fresh })
      return
    }
    persist(next)
    const fresh = get().boosts.filter((b) => b.expiresAt > now)
    set({ state: next, boosts: fresh })
  },

  dispatch: (kind, opts) => {
    const now = Date.now()
    let s = commit(get().state, now)

    if (kind === 'hatch') {
      if (s.stage !== 'egg') return
      const nameInput = (opts?.name ?? DEFAULT_NAME).trim().slice(0, MAX_NAME_LENGTH)
      const name = nameInput.length > 0 ? nameInput : DEFAULT_NAME
      s = {
        ...s,
        hatched: true,
        stage: 'baby',
        hatchedAt: now,
        name,
        totalActions: s.totalActions + 1,
      }
      persist(s)
      set({ state: s, lastAction: { kind, at: now } })
      return
    }

    if (s.stage === 'egg') return // no other actions while egg

    if (kind === 'sleep') {
      s = { ...s, sleeping: !s.sleeping, totalActions: s.totalActions + 1 }
      persist(s)
      set({ state: s, lastAction: { kind, at: now } })
      return
    }

    if (kind === 'pet') {
      const fx = ACTION_EFFECT.pet
      const next = s.sleeping
        ? s // sleeping → no happiness gain, just the heart animation
        : {
            ...s,
            needs: {
              ...s.needs,
              happiness: clamp(s.needs.happiness + fx.happiness),
            },
            totalActions: s.totalActions + 1,
          }
      persist(next)
      set({ state: next, lastAction: { kind, at: now } })
      return
    }

    if (kind === 'heal') {
      if (!isSick(s, now) && s.sickSince === null) return
      if (s.cooldowns.clean > now) return
      const lifted = {
        hunger: Math.max(s.needs.hunger, 60),
        happiness: Math.max(s.needs.happiness, 60),
        energy: Math.max(s.needs.energy, 60),
      }
      const next: PetState = {
        ...s,
        needs: lifted,
        sickSince: null,
        cooldowns: { ...s.cooldowns, clean: now + COOLDOWN_MS.clean },
        totalActions: s.totalActions + 1,
      }
      persist(next)
      set({ state: next, lastAction: { kind, at: now } })
      return
    }

    if (kind === 'feed' || kind === 'play') {
      if (s.sleeping) return
      if (s.cooldowns[kind] > now) return
      if (kind === 'feed' && s.needs.hunger >= 95) return
      if (kind === 'play' && s.needs.energy < 15) return

      const fx = ACTION_EFFECT[kind]
      const next: PetState = {
        ...s,
        needs: {
          hunger: clamp(s.needs.hunger + fx.hunger),
          happiness: clamp(s.needs.happiness + fx.happiness),
          energy: clamp(s.needs.energy + fx.energy),
        },
        cooldowns: { ...s.cooldowns, [kind]: now + COOLDOWN_MS[kind] },
        totalActions: s.totalActions + 1,
      }
      persist(next)
      set({ state: next, lastAction: { kind, at: now } })
      return
    }
  },

  applyStudyBoost: (kind) => {
    const now = Date.now()
    let s = commit(get().state, now)
    if (s.stage === 'egg') return // egg doesn't react to study yet

    const dh = kind === 'completion' ? 8 : 5
    const de = kind === 'completion' ? 5 : 0
    const next: PetState = {
      ...s,
      needs: {
        ...s.needs,
        happiness: clamp(s.needs.happiness + dh),
        energy: clamp(s.needs.energy + de),
      },
    }
    s = next
    persist(s)

    const label = kind === 'completion' ? '+8 από διάβασμα' : '+5 από άσκηση'
    const boost: Boost = { id: ++boostCounter, label, expiresAt: now + 2400 }
    set({ state: s, boosts: [...get().boosts, boost] })
  },

  rename: (raw) => {
    const trimmed = raw.trim().slice(0, MAX_NAME_LENGTH)
    const name = trimmed.length > 0 ? trimmed : DEFAULT_NAME
    const next = { ...get().state, name }
    persist(next)
    set({ state: next })
  },

  reset: () => {
    const fresh = freshEgg()
    persist(fresh)
    set({ state: fresh, lastAction: null, boosts: [] })
  },

  mood: () => {
    const s = get().state
    if (s.stage === 'egg') return 'neutral'
    if (s.sleeping) return 'asleep'
    const now = Date.now()
    if (isSick(s, now)) return 'sick'
    const a = avgNeed(s.needs)
    if (a >= 70) return 'happy'
    if (a >= 40) return 'neutral'
    return 'sad'
  },

  canDo: (kind) => {
    const s = get().state
    const now = Date.now()
    switch (kind) {
      case 'hatch':
        return s.stage === 'egg' ? { ok: true } : { ok: false, reason: 'Έχει ήδη βγει.' }
      case 'sleep':
        return s.stage === 'egg' ? { ok: false, reason: 'Δεν έχει κλωσσήσει.' } : { ok: true }
      case 'pet':
        return s.stage === 'egg' ? { ok: false, reason: 'Δεν έχει κλωσσήσει.' } : { ok: true }
      case 'heal':
        if (s.sickSince === null) return { ok: false, reason: 'Δεν είναι άρρωστο.' }
        if (s.cooldowns.clean > now) return { ok: false, reason: 'Σε αναμονή.' }
        return { ok: true }
      case 'feed':
        if (s.stage === 'egg') return { ok: false, reason: 'Δεν έχει κλωσσήσει.' }
        if (s.sleeping) return { ok: false, reason: 'Κοιμάται.' }
        if (s.cooldowns.feed > now) return { ok: false, reason: 'Όχι ακόμη.' }
        if (s.needs.hunger >= 95) return { ok: false, reason: 'Είναι χορτάτο.' }
        return { ok: true }
      case 'play':
        if (s.stage === 'egg') return { ok: false, reason: 'Δεν έχει κλωσσήσει.' }
        if (s.sleeping) return { ok: false, reason: 'Κοιμάται.' }
        if (s.cooldowns.play > now) return { ok: false, reason: 'Όχι ακόμη.' }
        if (s.needs.energy < 15) return { ok: false, reason: 'Δεν έχει ενέργεια.' }
        return { ok: true }
    }
  },
}))

/** Selector: any need < 20 OR sick → show the red attention dot on the collapsed button. */
export function selectNeedsAttention(state: PetState, now: number = Date.now()): boolean {
  if (state.stage === 'egg') return false
  const { hunger, happiness, energy } = state.needs
  const low = hunger < 20 || happiness < 20 || energy < 20
  return low || isSick(state, now)
}

/** Format pet age as "Xη Yω" / "Xω". */
export function formatAge(state: PetState, now: number = Date.now()): string {
  const ref = state.hatchedAt ?? state.bornAt
  const ms = Math.max(0, now - ref)
  const hours = Math.floor(ms / 3_600_000)
  if (hours < 24) return `${hours}ω`
  const days = Math.floor(hours / 24)
  const rem = hours % 24
  return rem === 0 ? `${days}η` : `${days}η ${rem}ω`
}
