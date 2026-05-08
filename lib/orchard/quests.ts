import type { OrchardState, QuestBaseline } from './types'
import type { PetState } from '../pet/types'
import { QUEST_STAR_REWARD, QUESTS_PER_DAY } from './defaults'

/* -------------------------------------------------------------------------- */
/*  Daily quests — Phase 7                                                     */
/*                                                                            */
/*  At local midnight a fresh selection of 3 quests is drawn from the pool    */
/*  using a deterministic date-seeded PRNG so the line-up is the same on      */
/*  every device for the same date. Each quest measures progress as a diff    */
/*  against the baseline captured at midnight (e.g. "earn 50 coins today" →  */
/*  current lifetime coins minus the baseline). When progress reaches the    */
/*  target, the quest is marked complete and the player receives ⭐. Doing   */
/*  all 3 in one day pays a small bonus (per defaults.QUEST_ALL_DONE_BONUS).  */
/* -------------------------------------------------------------------------- */

export type QuestId =
  | 'earn-coins-50'
  | 'earn-coins-200'
  | 'harvest-30'
  | 'harvest-100'
  | 'plant-2'
  | 'plant-5'
  | 'finish-research'
  | 'pet-care-3'
  | 'do-compost'
  | 'buy-seed'

export type Quest = {
  id: QuestId
  /** Greek display name. */
  name: string
  /** One-line Greek hint shown under the progress bar. */
  description: string
  /** Quantity needed to complete. */
  target: number
  /** Stars granted per completion. */
  starReward: number
  /** Current progress (capped at target) given baselines. */
  progress: (state: OrchardState, baseline: QuestBaseline, pet: PetState) => number
}

const sumSeedShop = (s: OrchardState) =>
  Object.values(s.prestige.seedShopOwned).reduce<number>(
    (n, v) => n + (v ?? 0),
    0,
  )

export const ALL_QUESTS: Quest[] = [
  {
    id: 'earn-coins-50',
    name: 'Μικρή πώληση',
    description: 'Κέρδισε 50 κέρματα σήμερα.',
    target: 50,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(50, Math.max(0, s.lifetime.coinsEarned - b.coinsEarned)),
  },
  {
    id: 'earn-coins-200',
    name: 'Καλή ημέρα στην αγορά',
    description: 'Κέρδισε 200 κέρματα σήμερα.',
    target: 200,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(200, Math.max(0, s.lifetime.coinsEarned - b.coinsEarned)),
  },
  {
    id: 'harvest-30',
    name: 'Σοδειά της ημέρας',
    description: 'Συγκόμισε 30 μήλα σήμερα.',
    target: 30,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(
        30,
        Math.max(0, s.lifetime.applesHarvested - b.applesHarvested),
      ),
  },
  {
    id: 'harvest-100',
    name: 'Πλούσια σοδειά',
    description: 'Συγκόμισε 100 μήλα σήμερα.',
    target: 100,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(
        100,
        Math.max(0, s.lifetime.applesHarvested - b.applesHarvested),
      ),
  },
  {
    id: 'plant-2',
    name: 'Δύο νέα δέντρα',
    description: 'Φύτεψε 2 δέντρα σήμερα.',
    target: 2,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(2, Math.max(0, s.lifetime.treesPlanted - b.treesPlanted)),
  },
  {
    id: 'plant-5',
    name: 'Επέκταση μποστανιού',
    description: 'Φύτεψε 5 δέντρα σήμερα.',
    target: 5,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(5, Math.max(0, s.lifetime.treesPlanted - b.treesPlanted)),
  },
  {
    id: 'finish-research',
    name: 'Επιστήμη',
    description: 'Ολοκλήρωσε μία έρευνα σήμερα.',
    target: 1,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(
        1,
        Math.max(
          0,
          s.researchTree.completed.length - b.researchCompleted,
        ),
      ),
  },
  {
    id: 'pet-care-3',
    name: 'Φρόντισε το πετ',
    description: 'Κάνε 3 ενέργειες φροντίδας στο πετ σήμερα.',
    target: 3,
    starReward: QUEST_STAR_REWARD,
    progress: (_s, b, pet) =>
      Math.min(3, Math.max(0, pet.totalActions - b.petActions)),
  },
  {
    id: 'do-compost',
    name: 'Compost run',
    description: 'Κάνε ένα compost σήμερα (μεγάλη πληρωμή).',
    target: 1,
    starReward: QUEST_STAR_REWARD * 2,
    progress: (s, b) =>
      Math.min(1, Math.max(0, s.prestige.compostRun - b.compostRun)),
  },
  {
    id: 'buy-seed',
    name: 'Αγόρασε από κατάστημα σπόρων',
    description: 'Αγόρασε κάτι από το seed shop σήμερα.',
    target: 1,
    starReward: QUEST_STAR_REWARD,
    progress: (s, b) =>
      Math.min(1, Math.max(0, sumSeedShop(s) - b.seedShopBought)),
  },
]

const BY_ID: Record<string, Quest> = Object.fromEntries(
  ALL_QUESTS.map((q) => [q.id, q]),
)

export function getQuest(id: string): Quest | undefined {
  return BY_ID[id]
}

/** Snapshot the values that quests measure progress against. */
export function snapshotBaseline(
  state: OrchardState,
  pet: PetState,
): QuestBaseline {
  return {
    coinsEarned: state.lifetime.coinsEarned,
    applesHarvested: state.lifetime.applesHarvested,
    treesPlanted: state.lifetime.treesPlanted,
    compostRun: state.prestige.compostRun,
    researchCompleted: state.researchTree.completed.length,
    petActions: pet.totalActions,
    seedShopBought: Object.values(state.prestige.seedShopOwned).reduce<number>(
      (n, v) => n + (v ?? 0),
      0,
    ),
  }
}

/* -------- Daily selection sampler ---------- */

/** mulberry32, same prng as the market — deterministic from seed. */
function rand(seed: number): () => number {
  let t = (seed + 0x6d2b79f5) | 0
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let x = Math.imul(t ^ (t >>> 15), t | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

/** djb2-ish hash of "YYYY-MM-DD" → 32-bit signed seed. */
function dateSeed(dateKey: string): number {
  let h = 5381
  for (let i = 0; i < dateKey.length; i++) {
    h = ((h << 5) + h + dateKey.charCodeAt(i)) | 0
  }
  return h
}

/**
 * Pick QUESTS_PER_DAY distinct quest ids for `dateKey`. Same date always
 * yields the same selection (deterministic on date hash) — quests don't
 * shuffle per-device.
 */
export function pickDailyQuests(dateKey: string): string[] {
  const next = rand(dateSeed(dateKey))
  const pool = ALL_QUESTS.map((q) => q.id)
  // Fisher–Yates with the seeded PRNG, then take first N.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, QUESTS_PER_DAY)
}

/** Convenience: every selected quest is complete? */
export function allDoneToday(state: OrchardState): boolean {
  return (
    state.quests.selected.length > 0 &&
    state.quests.selected.every((id) => state.quests.completed.includes(id))
  )
}
