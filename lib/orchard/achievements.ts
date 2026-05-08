import type { OrchardState } from './types'
import type { PetState } from '../pet/types'
import { ALL_RESEARCH } from './research'

/* -------------------------------------------------------------------------- */
/*  Achievements — Phase 7                                                     */
/*                                                                            */
/*  Pull-based: every tick we run `check(state, pet)` on every UNMET           */
/*  achievement and queue rewards for the newly-met ones. Conditions stay     */
/*  pure functions of state — no separate event bus to maintain.              */
/* -------------------------------------------------------------------------- */

export type AchievementGroup =
  | 'plant'
  | 'harvest'
  | 'sell'
  | 'build'
  | 'research'
  | 'compost'
  | 'pet'
  | 'meta'

export type Achievement = {
  id: string
  /** Greek display name. */
  name: string
  /** One-line Greek description (used as the unlock toast + panel subtitle). */
  description: string
  group: AchievementGroup
  /** Stars granted on first earn. */
  starReward: number
  /** Pure check — true iff the player has met the condition. */
  check: (state: OrchardState, pet: PetState) => boolean
}

const TIER_IDS: Record<1 | 2 | 3 | 4, string[]> = {
  1: ALL_RESEARCH.filter((n) => n.tier === 1).map((n) => n.id),
  2: ALL_RESEARCH.filter((n) => n.tier === 2).map((n) => n.id),
  3: ALL_RESEARCH.filter((n) => n.tier === 3).map((n) => n.id),
  4: ALL_RESEARCH.filter((n) => n.tier === 4).map((n) => n.id),
}

function allTierDone(state: OrchardState, tier: 1 | 2 | 3 | 4): boolean {
  return TIER_IDS[tier].every((id) => state.researchTree.completed.includes(id))
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ---------- Plant ----------
  {
    id: 'plant-1',
    name: 'Πρώτο φύτρο',
    description: 'Φύτεψες το πρώτο σου δέντρο.',
    group: 'plant',
    starReward: 1,
    check: (s) => s.lifetime.treesPlanted >= 1,
  },
  {
    id: 'plant-10',
    name: 'Φυτεμένος κήπος',
    description: 'Φύτεψες 10 δέντρα συνολικά.',
    group: 'plant',
    starReward: 1,
    check: (s) => s.lifetime.treesPlanted >= 10,
  },
  {
    id: 'plant-100',
    name: 'Δασοκόμος',
    description: 'Φύτεψες 100 δέντρα συνολικά.',
    group: 'plant',
    starReward: 2,
    check: (s) => s.lifetime.treesPlanted >= 100,
  },
  {
    id: 'plant-1000',
    name: 'Παππούς του δάσους',
    description: 'Φύτεψες 1.000 δέντρα συνολικά.',
    group: 'plant',
    starReward: 5,
    check: (s) => s.lifetime.treesPlanted >= 1000,
  },

  // ---------- Harvest ----------
  {
    id: 'harvest-1',
    name: 'Πρώτη σοδειά',
    description: 'Μάζεψες το πρώτο σου μήλο.',
    group: 'harvest',
    starReward: 1,
    check: (s) => s.lifetime.applesHarvested >= 1,
  },
  {
    id: 'harvest-100',
    name: 'Καλάθι γεμάτο',
    description: 'Μάζεψες 100 μήλα συνολικά.',
    group: 'harvest',
    starReward: 1,
    check: (s) => s.lifetime.applesHarvested >= 100,
  },
  {
    id: 'harvest-10k',
    name: 'Ασταμάτητος',
    description: 'Μάζεψες 10.000 μήλα συνολικά.',
    group: 'harvest',
    starReward: 2,
    check: (s) => s.lifetime.applesHarvested >= 10_000,
  },
  {
    id: 'harvest-1m',
    name: 'Μύθος του μποστανιού',
    description: 'Μάζεψες 1.000.000 μήλα συνολικά.',
    group: 'harvest',
    starReward: 10,
    check: (s) => s.lifetime.applesHarvested >= 1_000_000,
  },

  // ---------- Sell ----------
  {
    id: 'sell-1',
    name: 'Πρώτη πώληση',
    description: 'Πούλησες κάτι για πρώτη φορά.',
    group: 'sell',
    starReward: 1,
    check: (s) => s.lifetime.coinsEarned > 0,
  },
  {
    id: 'sell-100',
    name: 'Έμπορος',
    description: 'Έφτασες τα 100 κέρματα συνολικά.',
    group: 'sell',
    starReward: 1,
    check: (s) => s.lifetime.coinsEarned >= 100,
  },
  {
    id: 'sell-10k',
    name: 'Επιχειρηματίας',
    description: 'Έφτασες τα 10.000 κέρματα συνολικά.',
    group: 'sell',
    starReward: 2,
    check: (s) => s.lifetime.coinsEarned >= 10_000,
  },
  {
    id: 'sell-1m',
    name: 'Εκατομμυριούχος',
    description: 'Έφτασες το ένα εκατομμύριο κέρματα.',
    group: 'sell',
    starReward: 10,
    check: (s) => s.lifetime.coinsEarned >= 1_000_000,
  },

  // ---------- Build ----------
  {
    id: 'build-juicer',
    name: 'Πρώτο στυφτήρι',
    description: 'Έχτισες το πρώτο σου κτίριο.',
    group: 'build',
    starReward: 1,
    check: (s) => s.buildings.some((b) => b.kind === 'juicer'),
  },
  {
    id: 'build-cidery',
    name: 'Μηλίτης σπιτικός',
    description: 'Έχτισες κάβα.',
    group: 'build',
    starReward: 1,
    check: (s) => s.buildings.some((b) => b.kind === 'cidery'),
  },
  {
    id: 'build-jam',
    name: 'Γλυκό άρωμα',
    description: 'Έχτισες μαρμελάδα.',
    group: 'build',
    starReward: 1,
    check: (s) => s.buildings.some((b) => b.kind === 'jam'),
  },
  {
    id: 'build-bakery',
    name: 'Φουρναρίστικη γωνιά',
    description: 'Έχτισες φούρνο.',
    group: 'build',
    starReward: 2,
    check: (s) => s.buildings.some((b) => b.kind === 'bakery'),
  },
  {
    id: 'build-all',
    name: 'Πλήρης παραγωγή',
    description: 'Έχεις και τα 4 είδη κτιρίων ταυτόχρονα.',
    group: 'build',
    starReward: 3,
    check: (s) => {
      const kinds = new Set(s.buildings.map((b) => b.kind))
      return (
        kinds.has('juicer') &&
        kinds.has('cidery') &&
        kinds.has('jam') &&
        kinds.has('bakery')
      )
    },
  },
  {
    id: 'build-all-max',
    name: 'Master craftsman',
    description: 'Όλα τα κτίρια στο μέγιστο επίπεδο.',
    group: 'build',
    starReward: 5,
    check: (s) => {
      const required: Array<'juicer' | 'cidery' | 'jam' | 'bakery'> = [
        'juicer',
        'cidery',
        'jam',
        'bakery',
      ]
      return required.every((k) => {
        const b = s.buildings.find((x) => x.kind === k)
        return b !== undefined && b.level >= 5
      })
    },
  },

  // ---------- Research ----------
  {
    id: 'research-1',
    name: 'Πρώτη έρευνα',
    description: 'Ολοκλήρωσες τον πρώτο κόμβο έρευνας.',
    group: 'research',
    starReward: 1,
    check: (s) => s.researchTree.completed.length >= 1,
  },
  {
    id: 'research-tier1',
    name: 'Τα βασικά',
    description: 'Ολοκλήρωσες όλη την έρευνα Tier 1.',
    group: 'research',
    starReward: 2,
    check: (s) => allTierDone(s, 1),
  },
  {
    id: 'research-tier2',
    name: 'Συγκομιδή με στρατηγική',
    description: 'Ολοκλήρωσες όλη την έρευνα Tier 2.',
    group: 'research',
    starReward: 2,
    check: (s) => allTierDone(s, 2),
  },
  {
    id: 'research-all',
    name: 'Επιστήμονας μποστανιού',
    description: 'Ολοκλήρωσες όλη την έρευνα.',
    group: 'research',
    starReward: 5,
    check: (s) =>
      ALL_RESEARCH.every((n) => s.researchTree.completed.includes(n.id)),
  },

  // ---------- Compost / prestige ----------
  {
    id: 'compost-1',
    name: 'Πρώτο compost',
    description: 'Έκανες το πρώτο σου compost run.',
    group: 'compost',
    starReward: 2,
    check: (s) => s.prestige.compostRun >= 1,
  },
  {
    id: 'compost-5',
    name: 'Συνηθισμένος ξεκινητής',
    description: '5 compost runs.',
    group: 'compost',
    starReward: 3,
    check: (s) => s.prestige.compostRun >= 5,
  },
  {
    id: 'compost-10',
    name: 'Στρατηγός του compost',
    description: '10 compost runs.',
    group: 'compost',
    starReward: 5,
    check: (s) => s.prestige.compostRun >= 10,
  },
  {
    id: 'seedshop-1',
    name: 'Πρώτη επένδυση',
    description: 'Αγόρασες τον πρώτο σου σπόρο από το κατάστημα.',
    group: 'compost',
    starReward: 1,
    check: (s) =>
      Object.values(s.prestige.seedShopOwned).reduce<number>(
        (n, v) => n + (v ?? 0),
        0,
      ) >= 1,
  },

  // ---------- Pet ----------
  {
    id: 'pet-care',
    name: 'Καλός γονιός',
    description: 'Φρόντισες το πετ 50 φορές.',
    group: 'pet',
    starReward: 2,
    check: (_s, pet) => pet.totalActions >= 50,
  },
  {
    id: 'pet-adult',
    name: 'Μεγάλωσε',
    description: 'Το πετ έγινε ενήλικο.',
    group: 'pet',
    starReward: 2,
    check: (_s, pet) => pet.stage === 'adult',
  },

  // ---------- Meta ----------
  {
    id: 'meta-stars-10',
    name: 'Συλλέκτης άστρων',
    description: 'Συγκέντρωσες 10 ⭐ ταυτόχρονα.',
    group: 'meta',
    starReward: 1,
    check: (s) => s.resources.stars >= 10,
  },
]

const BY_ID: Record<string, Achievement> = Object.fromEntries(
  ALL_ACHIEVEMENTS.map((a) => [a.id, a]),
)

export function getAchievement(id: string): Achievement | undefined {
  return BY_ID[id]
}

/** Group → friendly Greek label, used as section headers in the panel. */
export const GROUP_LABEL: Record<AchievementGroup, string> = {
  plant: 'Φύτεμα',
  harvest: 'Συγκομιδή',
  sell: 'Πώληση',
  build: 'Κτίρια',
  research: 'Έρευνα',
  compost: 'Compost',
  pet: 'Πετ',
  meta: 'Λοιπά',
}

/** Newly-met but not-yet-recorded achievements, given current state + pet. */
export function checkNewAchievements(
  state: OrchardState,
  pet: PetState,
): Achievement[] {
  const earned = new Set(state.achieved)
  const out: Achievement[] = []
  for (const a of ALL_ACHIEVEMENTS) {
    if (earned.has(a.id)) continue
    if (a.check(state, pet)) out.push(a)
  }
  return out
}
