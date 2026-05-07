'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import { usePetStore } from '../pet/store'
import type { Mood } from '../pet/types'
import type {
  Building,
  BuildingKind,
  GoodKey,
  OrchardState,
  SpeciesId,
  Tree,
} from './types'
import {
  MOOD_MULT,
  SHAKE_BONUS,
  freshOrchard,
  freshResources,
  VERSION,
} from './defaults'
import { reconcile } from './reconcile'
import { plantCost, stageAt, treeStorage, getSpecies } from './trees'
import {
  canBuild,
  getBuildingDef,
  upgradeCost as upgradeCostFor,
} from './buildings'
import type { AutoSellRule } from './types'
import { playOrchardSound } from './audio'
import {
  effectiveBarnCapacity,
  priceForState,
  priceMultiplierForState,
} from './effects'
import { getResearchNode, isAvailable } from './research'

/* -------------------------------------------------------------------------- */
/*  Orchard zustand store — Phase 1                                            */
/*                                                                            */
/*  Cross-cutting rule: the orchard READS from the pet store (mood) and        */
/*  never writes to it. The only orchard → pet write happens via the pet       */
/*  store's own dispatch (later phases, via PetTie footer).                    */
/* -------------------------------------------------------------------------- */

type Toast = {
  id: number
  text: string
  tone: 'good' | 'info' | 'warn'
  expiresAt: number
}

type Store = {
  hydrated: boolean
  state: OrchardState
  /** Transient toasts ("+12 από idle", "Η αποθήκη γέμισε"). */
  toasts: Toast[]
  /** Last action timestamp per plot, for animation triggers. */
  lastShakeAt: Record<string, number>

  hydrate: () => void
  tick: () => void
  /** Plant a tree in an empty plot. No-op if plot full / not enough apples. */
  plant: (plotId: string, speciesId?: SpeciesId) => boolean
  /** Tap-harvest a single tree: empties stored → barn, adds shake bonus. */
  harvest: (plotId: string) => number
  /** Empty every full / non-empty tree into the barn. Returns total moved. */
  harvestAll: () => number
  /** Sell `qty` units of `good` (clipped to stock). Returns coins earned. */
  sellGood: (good: GoodKey, qty: number) => number
  /** Sell every unit of `good` in inventory. Returns coins earned. */
  sellAllGood: (good: GoodKey) => number
  /** Sell every apple in the barn. Returns coins earned. */
  sellAll: () => number
  /** Cost in apples to plant the next tree of `speciesId`. */
  plantCostFor: (speciesId: SpeciesId) => number
  /** Spend coins to construct a new building of `kind`. */
  buildBuilding: (kind: BuildingKind) => boolean
  /** Spend coins to upgrade a building to its next level. */
  upgradeBuilding: (id: string) => boolean
  /** Toggle a building between active (auto-loop) and idle. */
  toggleBuilding: (id: string) => void
  /** Move a building's storedOutput into shared inventory. */
  collectOutput: (id: string) => number
  /** Configure (or clear, with `null`) the auto-sell rule for a good. */
  setAutoSell: (good: GoodKey, rule: AutoSellRule | null) => void
  /** Start a research job (deducts 🧪 cost, sets researchTree.inProgress). */
  startResearch: (id: string) => boolean
  /** Cancel the in-flight research, refund 50% of cost. */
  cancelResearch: () => void
  /** Wipe orchard state and start fresh (for debugging / reset). */
  reset: () => void

  // Selectors
  /** Mood multiplier currently applied to production (read from pet store). */
  currentMoodMult: () => number
  /** Number of trees of a given species across all plots. */
  ownedCount: (speciesId: SpeciesId) => number
}

const NEED_REFRESH_MS = 5000

let toastSeq = 0

function persist(state: OrchardState) {
  writeJSON(STORAGE_KEYS.orchard, state)
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function loadInitial(): OrchardState {
  const raw = readJSON<any>(STORAGE_KEYS.orchard, null)
  if (!raw) return freshOrchard()
  let s: any = raw
  if (s.version === 1) {
    // v1 → v2: inject new resource keys + buildings array.
    const fresh = freshResources()
    s = {
      ...s,
      version: 2,
      resources: { ...fresh, ...s.resources },
      buildings: [],
    }
  }
  if (s.version === 2) {
    // v2 → v3: add autoSell rules map.
    s = { ...s, version: 3, autoSell: {} }
  }
  if (s.version === 3) {
    // v3 → v4: add researchTree state.
    s = {
      ...s,
      version: 4,
      researchTree: { completed: [], inProgress: null },
    }
  }
  if (s.version !== VERSION) return freshOrchard()
  return s as OrchardState
}
/* eslint-enable @typescript-eslint/no-explicit-any */

let buildingSeq = 0
function nextBuildingId(kind: BuildingKind): string {
  return `b-${kind}-${++buildingSeq}-${Date.now().toString(36)}`
}

function moodToMult(mood: Mood): number {
  return MOOD_MULT[mood] ?? 1.0
}

function pushToast(
  toasts: Toast[],
  text: string,
  tone: Toast['tone'] = 'good',
  ttlMs = 2500,
): Toast[] {
  return [
    ...toasts,
    { id: ++toastSeq, text, tone, expiresAt: Date.now() + ttlMs },
  ]
}

function pruneToasts(toasts: Toast[], now: number): Toast[] {
  return toasts.filter((t) => t.expiresAt > now)
}

export const useOrchardStore = create<Store>((set, get) => ({
  hydrated: false,
  state: freshOrchard(0),
  toasts: [],
  lastShakeAt: {},

  hydrate: () => {
    if (get().hydrated) return
    const now = Date.now()
    const loaded = loadInitial()
    const moodNow = moodToMult(usePetStore.getState().mood())
    const { state: ticked, gained } = reconcile(loaded, now, moodNow)
    persist(ticked)
    let toasts: Toast[] = []
    if (gained >= 1 && loaded.lastTickAt > 0 && now - loaded.lastTickAt > 60_000) {
      // Surface idle gains from a real absence (>1 min).
      toasts = pushToast(toasts, `+${Math.floor(gained)} 🍎 όσο έλειπες`, 'info', 4000)
    }
    set({ hydrated: true, state: ticked, toasts })
  },

  tick: () => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const prev = get().state
    let { state: ticked } = reconcile(prev, now, moodMult)

    // Detect a research node that just completed during reconcile, so we
    // can fire SFX + a toast even though completion happens deep inside
    // the pure function.
    const justFinished = ticked.researchTree.completed.find(
      (id) => !prev.researchTree.completed.includes(id),
    )
    if (justFinished) {
      const node = getResearchNode(justFinished)
      if (node) {
        const fresh: Toast = {
          id: ++toastSeq,
          text: `🧪 Ολοκληρώθηκε: ${node.name}`,
          tone: 'good',
          expiresAt: Date.now() + 3200,
        }
        // append directly into the queue we'll set below
        set({ toasts: [...get().toasts, fresh] })
        playOrchardSound('research-done')
      }
    }

    // Auto-sell evaluation. For each good with an active rule, check the
    // current price multiplier against the threshold and the stock against
    // the floor. If both pass, liquidate the entire stock at the live price.
    let coinsAdded = 0
    let lifetimeAdded = 0
    let resources = ticked.resources
    let toastQueue = get().toasts
    for (const [k, rule] of Object.entries(ticked.autoSell)) {
      if (!rule) continue
      const good = k as keyof typeof ticked.resources & (
        | 'apples'
        | 'juice'
        | 'cider'
        | 'jam'
        | 'pies'
      )
      const stock = Math.floor(resources[good] ?? 0)
      if (stock <= rule.minStock) continue
      const mult = priceMultiplierForState(good, ticked.startedAt, now, ticked)
      if (mult < rule.minMult) continue
      const price = priceForState(good, ticked.startedAt, now, ticked)
      const coins = stock * price
      coinsAdded += coins
      lifetimeAdded += coins
      resources = { ...resources, [good]: 0 }
      toastQueue = pushToast(
        toastQueue,
        `Auto · πούλησε ${stock} ${good === 'apples' ? '🍎' : good === 'juice' ? '🧃' : good === 'cider' ? '🍷' : good === 'jam' ? '🍯' : '🥧'} · +${coins.toFixed(2)} 🪙`,
        'good',
        2400,
      )
    }
    if (coinsAdded > 0) {
      ticked = {
        ...ticked,
        resources: {
          ...resources,
          coins: resources.coins + coinsAdded,
        },
        lifetime: {
          ...ticked.lifetime,
          coinsEarned: ticked.lifetime.coinsEarned + lifetimeAdded,
        },
      }
      playOrchardSound('autosell')
    }

    if (ticked !== prev) persist(ticked)
    set({
      state: ticked,
      toasts: pruneToasts(toastQueue, now),
    })
  },

  plant: (plotId, speciesId = 'classic') => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const plot = ticked.plots.find((p) => p.id === plotId)
    if (!plot || plot.tree) return false
    const owned = get().ownedCount(speciesId)
    // The very first sapling is free. Without this, a player who sells all
    // their starter apples before planting becomes soft-locked: 0 apples,
    // 0 trees, no way back. We keep the rule strictly to "first-ever" (gated
    // on lifetime.treesPlanted) so it can't be exploited by selling and
    // re-planting.
    const isFirstEver = ticked.lifetime.treesPlanted === 0
    const cost = isFirstEver ? 0 : plantCost(speciesId, owned)
    if (ticked.resources.apples < cost) return false

    const newTree: Tree = {
      speciesId,
      plantedAt: now,
      growthStage: 0,
      level: 0,
      lastHarvestAt: now,
      storedApples: 0,
    }
    const next: OrchardState = {
      ...ticked,
      resources: { ...ticked.resources, apples: ticked.resources.apples - cost },
      plots: ticked.plots.map((p) =>
        p.id === plotId ? { ...p, tree: newTree } : p,
      ),
      lifetime: {
        ...ticked.lifetime,
        treesPlanted: ticked.lifetime.treesPlanted + 1,
      },
    }
    persist(next)
    playOrchardSound('plant')
    set({ state: next })
    return true
  },

  harvest: (plotId) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const plot = ticked.plots.find((p) => p.id === plotId)
    if (!plot || !plot.tree) return 0
    const tree = plot.tree
    if (tree.storedApples <= 0) return 0

    // Shake bonus: small extra on top of stored, scaled by stageMult so saplings
    // give nothing. Capped so spam-clicking can't run away with it.
    const stage = stageAt(tree, now)
    const stageBonus = stage === 0 ? 0 : stage === 1 ? 0.5 : 1.0
    const shake = tree.storedApples * SHAKE_BONUS * stageBonus
    const want = tree.storedApples + shake

    // Barn capacity gate (factoring research multiplier).
    const barnCap = effectiveBarnCapacity(ticked)
    const barnSpace = barnCap - ticked.resources.apples
    const moved = Math.max(0, Math.min(want, barnSpace))
    const wasted = Math.max(0, want - moved)

    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        apples: Math.min(barnCap, ticked.resources.apples + moved),
      },
      plots: ticked.plots.map((p) =>
        p.id === plotId
          ? { ...p, tree: { ...tree, storedApples: 0, lastHarvestAt: now } }
          : p,
      ),
      lifetime: {
        ...ticked.lifetime,
        applesHarvested: ticked.lifetime.applesHarvested + moved,
      },
      flags: { ...ticked.flags, seenFirstHarvest: true },
    }
    persist(next)
    let toasts = get().toasts
    if (wasted > 0.5) {
      toasts = pushToast(toasts, 'Η αποθήκη γέμισε', 'warn', 2200)
    }
    if (moved > 0) playOrchardSound('harvest')
    set({
      state: next,
      toasts,
      lastShakeAt: { ...get().lastShakeAt, [plotId]: now },
    })
    return Math.floor(moved)
  },

  harvestAll: () => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    let ticked = reconcile(get().state, now, moodMult).state
    let movedTotal = 0
    let wastedAny = false

    const newPlots = ticked.plots.map((p) => {
      if (!p.tree || p.tree.storedApples <= 0) return p
      const want = p.tree.storedApples
      const barnCap = effectiveBarnCapacity(ticked)
      const space = barnCap - ticked.resources.apples
      const moved = Math.max(0, Math.min(want, space))
      if (want > moved) wastedAny = true
      ticked = {
        ...ticked,
        resources: {
          ...ticked.resources,
          apples: Math.min(barnCap, ticked.resources.apples + moved),
        },
      }
      movedTotal += moved
      return {
        ...p,
        tree: { ...p.tree, storedApples: 0, lastHarvestAt: now },
      }
    })
    const next: OrchardState = {
      ...ticked,
      plots: newPlots,
      lifetime: {
        ...ticked.lifetime,
        applesHarvested: ticked.lifetime.applesHarvested + movedTotal,
      },
      flags: { ...ticked.flags, seenFirstHarvest: true },
    }
    persist(next)
    let toasts = get().toasts
    if (wastedAny) toasts = pushToast(toasts, 'Η αποθήκη γέμισε', 'warn', 2200)
    if (movedTotal > 0) playOrchardSound('harvest-all')
    set({ state: next, toasts })
    return Math.floor(movedTotal)
  },

  sellGood: (good, qty) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const stock = ticked.resources[good] ?? 0
    const moved = Math.max(0, Math.min(qty, stock))
    if (moved <= 0) return 0
    // Live price: base × current walk multiplier × any research proceeds bonus.
    const price = priceForState(good, ticked.startedAt, now, ticked)
    const coins = moved * price
    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        [good]: stock - moved,
        coins: ticked.resources.coins + coins,
      },
      lifetime: {
        ...ticked.lifetime,
        coinsEarned: ticked.lifetime.coinsEarned + coins,
      },
      flags: { ...ticked.flags, seenFirstSale: true },
    }
    persist(next)
    playOrchardSound('sell')
    set({ state: next })
    return coins
  },

  sellAllGood: (good) => get().sellGood(good, get().state.resources[good] ?? 0),

  sellAll: () => get().sellGood('apples', get().state.resources.apples),

  plantCostFor: (speciesId) => {
    if (get().state.lifetime.treesPlanted === 0) return 0
    return plantCost(speciesId, get().ownedCount(speciesId))
  },

  buildBuilding: (kind) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    if (!canBuild(kind, ticked.lifetime.coinsEarned, ticked.buildings)) {
      return false
    }
    const def = getBuildingDef(kind)
    if (ticked.resources.coins < def.buildCost) return false

    const newBuilding: Building = {
      id: nextBuildingId(kind),
      kind,
      level: 0,
      active: true,
      batchStartedAt: null,
      storedOutput: 0,
    }
    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        coins: ticked.resources.coins - def.buildCost,
      },
      buildings: [...ticked.buildings, newBuilding],
    }
    persist(next)
    playOrchardSound('build')
    set({
      state: next,
      toasts: pushToast(get().toasts, `${def.emoji} Χτίστηκε ${def.name}`, 'good'),
    })
    return true
  },

  upgradeBuilding: (id) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const b = ticked.buildings.find((x) => x.id === id)
    if (!b) return false
    const cost = upgradeCostFor(b)
    if (!isFinite(cost)) return false
    if (ticked.resources.coins < cost) return false

    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        coins: ticked.resources.coins - cost,
      },
      buildings: ticked.buildings.map((x) =>
        x.id === id ? { ...x, level: x.level + 1 } : x,
      ),
    }
    persist(next)
    playOrchardSound('upgrade')
    set({ state: next })
    return true
  },

  toggleBuilding: (id) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const next: OrchardState = {
      ...ticked,
      buildings: ticked.buildings.map((x) => {
        if (x.id !== id) return x
        // Toggling off mid-batch: keep the in-flight batch but stop starting new ones.
        return { ...x, active: !x.active }
      }),
    }
    persist(next)
    set({ state: next })
  },

  setAutoSell: (good, rule) => {
    const next: OrchardState = {
      ...get().state,
      autoSell: {
        ...get().state.autoSell,
        [good]: rule ?? undefined,
      },
    }
    persist(next)
    set({ state: next })
  },

  startResearch: (id) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const node = getResearchNode(id)
    if (!node) return false
    if (ticked.researchTree.inProgress) return false
    if (!isAvailable(ticked, node)) return false
    if (ticked.resources.research < node.cost) return false

    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        research: ticked.resources.research - node.cost,
      },
      researchTree: {
        ...ticked.researchTree,
        inProgress: {
          id: node.id,
          startedAt: now,
          durationMs: node.durationMs,
        },
      },
    }
    persist(next)
    playOrchardSound('research-start')
    set({ state: next })
    return true
  },

  cancelResearch: () => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const job = ticked.researchTree.inProgress
    if (!job) return
    const node = getResearchNode(job.id)
    const refund = node ? Math.floor(node.cost * 0.5) : 0
    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        research: ticked.resources.research + refund,
      },
      researchTree: {
        ...ticked.researchTree,
        inProgress: null,
      },
    }
    persist(next)
    set({ state: next })
  },

  collectOutput: (id) => {
    const now = Date.now()
    const moodMult = moodToMult(usePetStore.getState().mood())
    const ticked = reconcile(get().state, now, moodMult).state
    const b = ticked.buildings.find((x) => x.id === id)
    if (!b || b.storedOutput <= 0) return 0
    const def = getBuildingDef(b.kind)
    const moved = Math.floor(b.storedOutput)
    if (moved <= 0) return 0
    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        [def.recipe.output]:
          (ticked.resources[def.recipe.output] ?? 0) + moved,
      },
      buildings: ticked.buildings.map((x) =>
        x.id === id ? { ...x, storedOutput: x.storedOutput - moved } : x,
      ),
    }
    persist(next)
    playOrchardSound('collect')
    set({ state: next })
    return moved
  },

  reset: () => {
    const fresh = freshOrchard()
    persist(fresh)
    set({ state: fresh, toasts: [], lastShakeAt: {} })
  },

  currentMoodMult: () => moodToMult(usePetStore.getState().mood()),

  ownedCount: (speciesId) =>
    get().state.plots.reduce(
      (n, p) => n + (p.tree && p.tree.speciesId === speciesId ? 1 : 0),
      0,
    ),
}))

/* -------------------------------------------------------------------------- */
/*  Helpers (selector functions exported alongside the store)                  */
/* -------------------------------------------------------------------------- */

/** Total apples currently sitting on all trees (un-harvested). */
export function selectStoredApples(state: OrchardState): number {
  return state.plots.reduce(
    (n, p) => n + (p.tree ? p.tree.storedApples : 0),
    0,
  )
}

/** True when at least one tree has fruit ready and there's barn space for some of it. */
export function selectHasHarvestable(state: OrchardState): boolean {
  return state.plots.some((p) => p.tree && p.tree.storedApples > 0)
}

/** Fraction of barn full (0..1). Honors research-driven capacity multiplier. */
export function selectBarnFraction(state: OrchardState): number {
  const cap = effectiveBarnCapacity(state)
  if (cap <= 0) return 0
  return Math.min(1, state.resources.apples / cap)
}

/** True when *any* tree's storage is full. Useful for the "Μάζεψε" emphasis. */
export function selectAnyTreeFull(state: OrchardState): boolean {
  return state.plots.some(
    (p) => p.tree && p.tree.storedApples >= treeStorage(p.tree),
  )
}

/** Refresh hint for callers — for the pet button badge in later phases. */
export const ORCHARD_TICK_INTERVAL_MS = NEED_REFRESH_MS

export { getSpecies }
