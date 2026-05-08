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
  BLUEPRINT_LEVEL_GATE,
  MINIGAME_APPLES_PER_GOLDEN,
  MINIGAME_APPLES_PER_NORMAL,
  MINIGAME_SCORE_PER_STAR,
  MINIGAME_STARS_PER_DAY_CAP,
  MINIGAME_STARS_PER_RUN_CAP,
  MOOD_MULT,
  PET_BUFF_COOLDOWN_MS,
  PET_BUFF_MS,
  SHAKE_BONUS,
  VERSION,
  freshOrchard,
  freshResources,
  localDateKey,
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
  buildCostFor,
  effectiveBarnCapacity,
  petBuffMult,
  priceForState,
  priceMultiplierForState,
} from './effects'
import { getResearchNode, isAvailable } from './research'
import {
  compostUnlocked,
  getSeedShopItem,
  getStarWish,
  ownedCount,
  seedReward,
  wishOwned,
} from './prestige'
import { checkNewAchievements } from './achievements'
import {
  allDoneToday,
  getQuest,
  pickDailyQuests,
  snapshotBaseline,
} from './quests'
import { QUEST_ALL_DONE_BONUS } from './defaults'
import {
  getEventDef,
  rollEvent,
  scheduleNextEvent,
} from './events'
import { isSick } from '../pet/decay'

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
  /**
   * Pet the pet from inside the orchard footer. Forwards to pet.dispatch
   * AND sets petBuffUntil so the next 5 min get a ×1.10 production bonus.
   * 60-second cooldown — repeated taps within the cooldown don't re-stack.
   */
  petPet: () => void
  /**
   * Apple Catcher → orchard hook. Deposits caught apples into the barn at
   * MINIGAME_APPLES_PER_NORMAL / _GOLDEN, and converts score to stars
   * (capped per-run AND per-day). Returns the apples + stars actually
   * granted so the minigame UI can show what happened.
   */
  applyMinigameReward: (
    normalCaught: number,
    goldenCaught: number,
    score: number,
  ) => { apples: number; stars: number }
  /** Claim a click-style random event (shooting star, hedgehog). No-op when
   *  the active event isn't claimable or its window has expired. */
  claimEvent: (id: string) => boolean
  /**
   * Compost the orchard. Wipes plots/buildings/research/auto-sell/in-flight
   * jobs and most resources; preserves seeds/stars + prestige state. Awards
   * floor(sqrt(currentRunCoins / 1000)) seeds and snapshots blueprints
   * (kinds at level ≥ 3) for half-cost rebuilds. Returns the seeds gained.
   */
  compost: () => number
  /** Purchase one tier of a Seed Shop item. Gated by maxOwned and seed cost. */
  buySeedShopItem: (id: string) => boolean
  /** Spend ⭐ on a Star Wish. One-shots fire effects immediately;
   *  stackable wishes increment wishesOwned and apply via effects.ts. */
  claimWish: (id: string) => boolean
  /** Mark the 4-step intro tutorial as seen (skip button or final step). */
  dismissIntro: () => void
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
  if (s.version === 4) {
    // v4 → v5: add pet petting buff + daily reward caps for the minigame hook.
    s = {
      ...s,
      version: 5,
      petBuffUntil: null,
      dailyCaps: { date: localDateKey(), minigameStars: 0 },
    }
  }
  if (s.version === 5) {
    // v5 → v6: add prestige state. Existing lifetime stays intact —
    // lastCompostLifetime starts at 0 so the player's accumulated coins
    // count toward their first compost reward.
    s = {
      ...s,
      version: 6,
      prestige: {
        compostRun: 0,
        seedShopOwned: {},
        blueprints: [],
        lastCompostLifetime: 0,
      },
    }
  }
  if (s.version === 6) {
    // v6 → v7: add achievements + daily quests. Quests start with empty
    // selection; tick() will pick the day's quests on first run after load.
    const today = localDateKey()
    s = {
      ...s,
      version: 7,
      achieved: [],
      quests: {
        date: today,
        selected: [],
        baseline: {
          coinsEarned: s.lifetime?.coinsEarned ?? 0,
          applesHarvested: s.lifetime?.applesHarvested ?? 0,
          treesPlanted: s.lifetime?.treesPlanted ?? 0,
          compostRun: s.prestige?.compostRun ?? 0,
          researchCompleted: s.researchTree?.completed?.length ?? 0,
          petActions: 0,
          seedShopBought: 0,
        },
        completed: [],
        bonusClaimedDate: null,
      },
    }
  }
  if (s.version === 7) {
    // v7 → v8: add random-events scheduler. Schedule the first event a
    // few minutes out so freshly-migrated saves don't fire instantly.
    s = {
      ...s,
      version: 8,
      events: {
        nextScheduledAt: Date.now() + 5 * 60 * 1000,
        active: null,
        log: [],
      },
    }
  }
  if (s.version === 8) {
    // v8 → v9: add wish-shop tracking on prestige.
    s = {
      ...s,
      version: 9,
      prestige: {
        ...s.prestige,
        wishesOwned: s.prestige?.wishesOwned ?? {},
      },
    }
  }
  if (s.version === 9) {
    // v9 → v10: extend flags with one-shot contextual tips. Existing
    // players are assumed to already know the basics, so the tips are
    // pre-marked as seen — fresh runs see them as designed.
    s = {
      ...s,
      version: 10,
      flags: {
        ...s.flags,
        seenBarnFullTip: true,
        seenIdleCoinsTip: true,
        seenCompostUnlockTip: true,
      },
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

/**
 * Read the pet store + orchard buff state once and return everything the
 * reconcile needs: the combined mood multiplier (mood × petting buff) and
 * the sleeping flag (used for the growth-time tradeoff). Centralizes what
 * was previously a duplicated `moodToMult(usePetStore.getState().mood())`
 * pattern across every action.
 */
function readPetMood(orchardState: OrchardState, now: number): {
  moodMult: number
  petSleeping: boolean
} {
  const pet = usePetStore.getState()
  const moodMult = moodToMult(pet.mood()) * petBuffMult(orchardState, now)
  return { moodMult, petSleeping: pet.state.sleeping }
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
    const { moodMult: moodNow, petSleeping } = readPetMood(loaded, now)
    const { state: ticked, gained } = reconcile(loaded, now, moodNow, petSleeping)
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
    const prev = get().state
    const { moodMult, petSleeping } = readPetMood(prev, now)
    let { state: ticked } = reconcile(prev, now, moodMult, petSleeping)

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

    // ----- Random events: resolve expired + roll new ---------------------
    // Pet sickness gates "spice" events, per design — when sick, scheduler
    // simply pushes nextScheduledAt forward each tick.
    const petAlive = usePetStore.getState().state
    const eventsState = ticked.events
    let active = eventsState.active
    let nextScheduledAt = eventsState.nextScheduledAt
    let log = eventsState.log

    if (active && now >= active.expiresAt) {
      // Expired naturally — push to log and clear.
      log = [
        ...log.slice(-19),
        { kind: active.kind, firedAt: active.startedAt, claimed: active.claimed },
      ]
      active = null
      nextScheduledAt = scheduleNextEvent(now)
    }
    if (!active && now >= nextScheduledAt) {
      if (isSick(petAlive, now)) {
        // Pet's sick — defer the next roll without firing anything.
        nextScheduledAt = scheduleNextEvent(now)
      } else {
        const candidate = rollEvent(ticked, now)
        if (candidate) {
          // Apply instant events at fire time so the side-effect lands now,
          // and the banner just shows briefly before auto-clearing.
          const def = getEventDef(candidate.kind)
          let withFire = ticked
          if (def?.applyOnFire) {
            withFire = def.applyOnFire(withFire)
          }
          ticked = {
            ...withFire,
            events: {
              nextScheduledAt: scheduleNextEvent(now), // schedule the next slot now
              active: candidate,
              log,
            },
          }
          // Inform the player immediately. The banner UI is the primary
          // surface; the toast helps when the panel is closed (future).
          toastQueue = pushToast(
            toastQueue,
            `${def?.emoji ?? ''} ${def?.name ?? candidate.kind}`,
            'info',
            3500,
          )
          playOrchardSound(
            def?.category === 'debuff' || def?.category === 'instant'
              ? 'error'
              : 'click',
          )
          // Skip the post-loop assignment below (we already placed events).
          active = candidate
        } else {
          nextScheduledAt = scheduleNextEvent(now)
        }
      }
    }
    // Sync any tweaks back into ticked.events (the fire branch above already
    // assigned ticked.events; this guards the no-fire paths).
    if (
      ticked.events.active !== active ||
      ticked.events.nextScheduledAt !== nextScheduledAt ||
      ticked.events.log !== log
    ) {
      ticked = {
        ...ticked,
        events: { ...ticked.events, active, nextScheduledAt, log },
      }
    }

    // ----- Daily quest rollover + selection ------------------------------
    const todayKey = localDateKey(now)
    const pet = usePetStore.getState().state
    if (ticked.quests.date !== todayKey || ticked.quests.selected.length === 0) {
      ticked = {
        ...ticked,
        quests: {
          date: todayKey,
          selected: pickDailyQuests(todayKey),
          baseline: snapshotBaseline(ticked, pet),
          completed: [],
          // bonusClaimedDate carries over so we don't re-pay for the
          // previous day after a midnight rollover; cleared only when paid.
          bonusClaimedDate: ticked.quests.bonusClaimedDate,
        },
      }
    }

    // Quest completion check.
    let questStars = 0
    const newlyComplete: string[] = []
    for (const id of ticked.quests.selected) {
      if (ticked.quests.completed.includes(id)) continue
      const q = getQuest(id)
      if (!q) continue
      const p = q.progress(ticked, ticked.quests.baseline, pet)
      if (p >= q.target) {
        newlyComplete.push(id)
        questStars += q.starReward
        toastQueue = pushToast(
          toastQueue,
          `🎯 ${q.name} +${q.starReward}⭐`,
          'good',
          3200,
        )
      }
    }
    if (newlyComplete.length > 0) {
      ticked = {
        ...ticked,
        quests: {
          ...ticked.quests,
          completed: [...ticked.quests.completed, ...newlyComplete],
        },
        resources: {
          ...ticked.resources,
          stars: ticked.resources.stars + questStars,
        },
      }
      playOrchardSound('upgrade')
    }
    // All-3 bonus, paid once per local day.
    if (
      allDoneToday(ticked) &&
      ticked.quests.bonusClaimedDate !== todayKey
    ) {
      ticked = {
        ...ticked,
        quests: { ...ticked.quests, bonusClaimedDate: todayKey },
        resources: {
          ...ticked.resources,
          stars: ticked.resources.stars + QUEST_ALL_DONE_BONUS,
        },
      }
      toastQueue = pushToast(
        toastQueue,
        `🏆 Όλοι οι στόχοι +${QUEST_ALL_DONE_BONUS}⭐`,
        'good',
        4000,
      )
      playOrchardSound('research-done')
    }

    // ----- Achievement detection -----------------------------------------
    const newAchievements = checkNewAchievements(ticked, pet)
    if (newAchievements.length > 0) {
      let starsFromAch = 0
      for (const a of newAchievements) {
        starsFromAch += a.starReward
        toastQueue = pushToast(
          toastQueue,
          `🏅 ${a.name} +${a.starReward}⭐`,
          'good',
          4000,
        )
      }
      ticked = {
        ...ticked,
        achieved: [...ticked.achieved, ...newAchievements.map((a) => a.id)],
        resources: {
          ...ticked.resources,
          stars: ticked.resources.stars + starsFromAch,
        },
      }
      playOrchardSound('research-done')
    }

    // ----- One-shot contextual tips --------------------------------------
    // Each tip fires at most once per orchard. Conditions are evaluated
    // against the post-reconcile state so the first time a player crosses
    // the line — barn maxed mid-idle, coins crossing 1000, compost tab
    // unlocking — they get a single nudge.
    const flags = ticked.flags
    if (!flags.seenBarnFullTip) {
      const cap = effectiveBarnCapacity(ticked)
      if (Math.floor(ticked.resources.apples) >= cap && cap > 0) {
        toastQueue = pushToast(
          toastQueue,
          '📦 Η αποθήκη γέμισε. Πούλα ή χτίσε μεγαλύτερη.',
          'warn',
          5000,
        )
        ticked = { ...ticked, flags: { ...flags, seenBarnFullTip: true } }
      }
    }
    if (!ticked.flags.seenIdleCoinsTip && ticked.resources.coins >= 1000) {
      toastQueue = pushToast(
        toastQueue,
        '💡 Με 1000+ 🪙 μπορείς να χτίσεις στυφτήρι.',
        'good',
        5000,
      )
      ticked = {
        ...ticked,
        flags: { ...ticked.flags, seenIdleCoinsTip: true },
      }
    }
    if (!ticked.flags.seenCompostUnlockTip && compostUnlocked(ticked)) {
      toastQueue = pushToast(
        toastQueue,
        '✨ Ο compost ξεκλείδωσε. Δες τη νέα καρτέλα.',
        'good',
        5000,
      )
      ticked = {
        ...ticked,
        flags: { ...ticked.flags, seenCompostUnlockTip: true },
      }
    }

    if (ticked !== prev) persist(ticked)
    set({
      state: ticked,
      toasts: pruneToasts(toastQueue, now),
    })
  },

  plant: (plotId, speciesId = 'classic') => {
    const now = Date.now()
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    let ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
    if (!canBuild(kind, ticked.lifetime.coinsEarned, ticked.buildings)) {
      return false
    }
    const def = getBuildingDef(kind)
    const cost = buildCostFor(kind, ticked) // honors prestige blueprint discount
    if (ticked.resources.coins < cost) return false

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
        coins: ticked.resources.coins - cost,
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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

  petPet: () => {
    const now = Date.now()
    // Cooldown: if a buff is already active and was set within the last
    // PET_BUFF_COOLDOWN_MS window, don't extend it. (We approximate "set
    // recently" by checking that more than PET_BUFF_MS - PET_BUFF_COOLDOWN_MS
    // remains.)
    const remaining =
      get().state.petBuffUntil !== null
        ? get().state.petBuffUntil! - now
        : 0
    const onCooldown = remaining > PET_BUFF_MS - PET_BUFF_COOLDOWN_MS
    // Always forward the pet action so the heart animation + happiness gain
    // fire even if we don't extend the buff. The pet store enforces its own
    // sprite-click 800-ms anti-spam.
    usePetStore.getState().dispatch('pet')
    if (onCooldown) return
    const next: OrchardState = {
      ...get().state,
      petBuffUntil: now + PET_BUFF_MS,
    }
    persist(next)
    set({ state: next })
  },

  applyMinigameReward: (normalCaught, goldenCaught, score) => {
    const now = Date.now()
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    let ticked = reconcile(get().state, now, moodMult, petSleeping).state

    // Daily cap rollover — reset stars if we've crossed local midnight.
    const todayKey = localDateKey(now)
    if (ticked.dailyCaps.date !== todayKey) {
      ticked = {
        ...ticked,
        dailyCaps: { date: todayKey, minigameStars: 0 },
      }
    }

    // Apples — clipped by barn capacity, surplus discarded.
    const wantApples =
      normalCaught * MINIGAME_APPLES_PER_NORMAL +
      goldenCaught * MINIGAME_APPLES_PER_GOLDEN
    const barnCap = effectiveBarnCapacity(ticked)
    const barnSpace = Math.max(0, barnCap - ticked.resources.apples)
    const appleGrant = Math.floor(Math.min(wantApples, barnSpace))

    // Stars — per-run cap + per-day cap.
    const wantStars = Math.floor(score / MINIGAME_SCORE_PER_STAR)
    const runStars = Math.min(wantStars, MINIGAME_STARS_PER_RUN_CAP)
    const dayRoom = Math.max(
      0,
      MINIGAME_STARS_PER_DAY_CAP - ticked.dailyCaps.minigameStars,
    )
    const starGrant = Math.min(runStars, dayRoom)

    if (appleGrant <= 0 && starGrant <= 0) {
      // Nothing to deposit (barn full + day cap hit). Persist nothing.
      set({ state: ticked })
      return { apples: 0, stars: 0 }
    }

    const next: OrchardState = {
      ...ticked,
      resources: {
        ...ticked.resources,
        apples: ticked.resources.apples + appleGrant,
        stars: ticked.resources.stars + starGrant,
      },
      lifetime: {
        ...ticked.lifetime,
        applesHarvested: ticked.lifetime.applesHarvested + appleGrant,
      },
      dailyCaps: {
        date: todayKey,
        minigameStars: ticked.dailyCaps.minigameStars + starGrant,
      },
    }
    persist(next)
    set({ state: next })
    return { apples: appleGrant, stars: starGrant }
  },

  claimEvent: (id) => {
    const state = get().state
    const ev = state.events.active
    if (!ev || ev.id !== id || ev.claimed) return false
    const def = getEventDef(ev.kind)
    if (!def || def.category !== 'click') return false
    const now = Date.now()
    if (now >= ev.expiresAt) return false
    let next: OrchardState = state
    if (def.applyOnClaim) {
      next = def.applyOnClaim(next)
    }
    next = {
      ...next,
      events: {
        ...next.events,
        active: { ...ev, claimed: true },
      },
    }
    persist(next)
    playOrchardSound('research-done')
    set({
      state: next,
      toasts: pushToast(
        get().toasts,
        `${def.emoji} ${def.name} ✓`,
        'good',
        2400,
      ),
    })
    return true
  },

  compost: () => {
    const now = Date.now()
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state

    const seeds = seedReward(ticked)
    if (seeds <= 0) return 0

    // Snapshot blueprints — building kinds at level ≥ BLUEPRINT_LEVEL_GATE
    // get a permanent rebuild discount on future runs.
    const earned = ticked.buildings
      .filter((b) => b.level >= BLUEPRINT_LEVEL_GATE)
      .map((b) => b.kind)
    const blueprintSet = new Set([...ticked.prestige.blueprints, ...earned])
    const blueprints = Array.from(blueprintSet)

    // Wipe most run state. Preserve: prestige (with new compostRun + seeds),
    // stars (high-tier currency), high score, and the lifetime tally itself
    // (which acts as the "career" counter and is the basis of seed math via
    // the `lastCompostLifetime` snapshot).
    const fresh = freshOrchard(now)
    const next: OrchardState = {
      ...fresh,
      // Resources: reset volatile goods, preserve seeds + stars (gain new seeds).
      resources: {
        ...fresh.resources,
        seeds: ticked.resources.seeds + seeds,
        stars: ticked.resources.stars,
      },
      // Lifetime stays cumulative — it's the career counter.
      lifetime: ticked.lifetime,
      // Prestige snapshot.
      prestige: {
        compostRun: ticked.prestige.compostRun + 1,
        seedShopOwned: ticked.prestige.seedShopOwned,
        blueprints,
        lastCompostLifetime: ticked.lifetime.coinsEarned,
        wishesOwned: ticked.prestige.wishesOwned,
      },
    }
    persist(next)
    playOrchardSound('research-done')
    set({
      state: next,
      toasts: pushToast(
        get().toasts,
        `🌱 Compost: +${seeds} σπόρους`,
        'good',
        4000,
      ),
    })
    return seeds
  },

  buySeedShopItem: (id) => {
    const item = getSeedShopItem(id)
    if (!item) return false
    const state = get().state
    if (ownedCount(state, id as never) >= item.maxOwned) return false
    if (state.resources.seeds < item.cost) return false
    const next: OrchardState = {
      ...state,
      resources: {
        ...state.resources,
        seeds: state.resources.seeds - item.cost,
      },
      prestige: {
        ...state.prestige,
        seedShopOwned: {
          ...state.prestige.seedShopOwned,
          [id]: ownedCount(state, id as never) + 1,
        },
      },
    }
    persist(next)
    playOrchardSound('upgrade')
    set({ state: next })
    return true
  },

  claimWish: (id) => {
    const wish = getStarWish(id)
    if (!wish) return false
    const state = get().state
    if (state.resources.stars < wish.cost) return false
    if (
      wish.maxOwned !== Infinity &&
      wishOwned(state, id as never) >= wish.maxOwned
    ) {
      return false
    }
    // Wish-specific side-effects.
    let next: OrchardState = {
      ...state,
      resources: {
        ...state.resources,
        stars: state.resources.stars - wish.cost,
      },
      prestige: {
        ...state.prestige,
        wishesOwned: {
          ...state.prestige.wishesOwned,
          [id]: wishOwned(state, id as never) + 1,
        },
      },
    }
    if (id === 'wish-research-skip') {
      // No active job → wish is wasted; refuse so the player doesn't lose ⭐.
      const job = state.researchTree.inProgress
      if (!job) return false
      next = {
        ...next,
        researchTree: {
          ...next.researchTree,
          // Set startedAt so the timer reads "0 ms remaining" — tick() will
          // mark the job complete on its next pass and play the SFX/toast.
          inProgress: { ...job, startedAt: Date.now() - job.durationMs },
        },
      }
    } else if (id === 'wish-extra-seeds') {
      next = {
        ...next,
        resources: { ...next.resources, seeds: next.resources.seeds + 5 },
      }
    }
    // wish-yield-bonus: tracked in wishesOwned and applied by permanentYieldMult.

    persist(next)
    playOrchardSound('research-done')
    set({
      state: next,
      toasts: pushToast(
        get().toasts,
        `${wish.emoji} ${wish.name} ✓`,
        'good',
        3000,
      ),
    })
    return true
  },

  dismissIntro: () => {
    const state = get().state
    if (state.flags.seenIntro) return
    const next: OrchardState = {
      ...state,
      flags: { ...state.flags, seenIntro: true },
    }
    persist(next)
    set({ state: next })
  },

  collectOutput: (id) => {
    const now = Date.now()
    const { moodMult, petSleeping } = readPetMood(get().state, now)
    const ticked = reconcile(get().state, now, moodMult, petSleeping).state
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

  currentMoodMult: () =>
    moodToMult(usePetStore.getState().mood()) *
    petBuffMult(get().state, Date.now()),

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
