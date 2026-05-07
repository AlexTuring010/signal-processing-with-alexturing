import type { OrchardState } from './types'

/* -------------------------------------------------------------------------- */
/*  Research registry — Phase 4                                                */
/*                                                                            */
/*  12 nodes across 4 tiers. Each node has a 🧪 cost paid up front, a real-   */
/*  time duration that ticks down even while the panel is closed (handled     */
/*  by reconcile), and a list of prerequisite node ids. The flat-list shape   */
/*  keeps the UI simple — we just group by tier in the panel.                 */
/* -------------------------------------------------------------------------- */

export type ResearchEffectKind =
  // Tier 1 — Φύτεμα
  | 'richer-soil'      // -10% tree growth time
  | 'better-cap'       // +50% per-tree storage cap
  | 'bigger-orchard'   // +12 plots (total 24)
  // Tier 2 — Συγκομιδή
  | 'auto-harvest'     // trees auto-empty into barn during reconcile
  | 'bigger-barn'      // barn capacity ×2
  // Tier 3 — Παραγωγή
  | 'vintner'          // cidery +1 yield per batch
  | 'jam-tech'         // jam factory +1 yield per batch
  | 'bakery-tech'      // bakery +1 yield per batch
  // Tier 4 — Οικονομία
  | 'partnership'      // 10% chance of doubled batch output
  | 'floor-price'      // market multiplier floor 0.5 → 0.7
  | 'ceiling-price'    // market multiplier ceiling 1.5 → 1.7
  | 'market-mastery'   // +25% sale proceeds across all goods

export type ResearchTier = 1 | 2 | 3 | 4

export type ResearchNode = {
  id: ResearchEffectKind
  tier: ResearchTier
  /** Greek display name. */
  name: string
  /** Short Greek description of the effect. */
  description: string
  /** 🧪 cost paid at start. */
  cost: number
  /** Real-time duration of the research job (ms). */
  durationMs: number
  /** Prerequisites — at least one must be completed for this node to unlock. */
  requires: ResearchEffectKind[]
}

const T1_DUR = 60 * 1000
const T2_DUR = 3 * 60 * 1000
const T3_DUR = 8 * 60 * 1000
const T4_DUR = 20 * 60 * 1000

const NODES: ResearchNode[] = [
  // Tier 1 — Φύτεμα
  {
    id: 'richer-soil',
    tier: 1,
    name: 'Πιο πλούσιο χώμα',
    description: '−10% χρόνος ωρίμανσης για όλα τα δέντρα.',
    cost: 90,
    durationMs: T1_DUR,
    requires: [],
  },
  {
    id: 'better-cap',
    tier: 1,
    name: 'Καλύτερα κιβώτια',
    description: '+50% χωρητικότητα μήλων ανά δέντρο.',
    cost: 90,
    durationMs: T1_DUR,
    requires: [],
  },
  {
    id: 'bigger-orchard',
    tier: 1,
    name: 'Μεγαλύτερο μποστάνι',
    description: '+12 οικόπεδα (σύνολο 24).',
    cost: 120,
    durationMs: T1_DUR,
    requires: [],
  },
  // Tier 2 — Συγκομιδή
  {
    id: 'auto-harvest',
    tier: 2,
    name: 'Αυτόματη συλλογή',
    description: 'Τα δέντρα αδειάζουν μόνα τους στην αποθήκη όταν γεμίσουν.',
    cost: 300,
    durationMs: T2_DUR,
    requires: ['richer-soil', 'better-cap', 'bigger-orchard'],
  },
  {
    id: 'bigger-barn',
    tier: 2,
    name: 'Διπλάσια αποθήκη',
    description: 'Χωρητικότητα αποθήκης ×2.',
    cost: 350,
    durationMs: T2_DUR,
    requires: ['richer-soil', 'better-cap', 'bigger-orchard'],
  },
  // Tier 3 — Παραγωγή
  {
    id: 'vintner',
    tier: 3,
    name: 'Οινοτεχνία',
    description: 'Η κάβα παράγει +1 μηλίτη ανά παρτίδα.',
    cost: 700,
    durationMs: T3_DUR,
    requires: ['auto-harvest', 'bigger-barn'],
  },
  {
    id: 'jam-tech',
    tier: 3,
    name: 'Ζύμωση',
    description: 'Η μαρμελάδα παράγει +1 βάζο ανά παρτίδα.',
    cost: 800,
    durationMs: T3_DUR,
    requires: ['auto-harvest', 'bigger-barn'],
  },
  {
    id: 'bakery-tech',
    tier: 3,
    name: 'Ζαχαροπλαστική',
    description: 'Ο φούρνος παράγει +1 πίτα ανά παρτίδα.',
    cost: 1100,
    durationMs: T3_DUR,
    requires: ['auto-harvest', 'bigger-barn'],
  },
  // Tier 4 — Οικονομία
  {
    id: 'partnership',
    tier: 4,
    name: 'Συνέταιρος',
    description: '10% πιθανότητα διπλάσιας παραγωγής σε κάθε παρτίδα.',
    cost: 1500,
    durationMs: T4_DUR,
    requires: ['vintner', 'jam-tech', 'bakery-tech'],
  },
  {
    id: 'floor-price',
    tier: 4,
    name: 'Καλύτερη φήμη',
    description: 'Το ελάχιστο της τιμής αγοράς ανεβαίνει 0.5 → 0.7.',
    cost: 1700,
    durationMs: T4_DUR,
    requires: ['vintner', 'jam-tech', 'bakery-tech'],
  },
  {
    id: 'ceiling-price',
    tier: 4,
    name: 'Βαθμός συμβολαίου',
    description: 'Το μέγιστο της τιμής αγοράς ανεβαίνει 1.5 → 1.7.',
    cost: 1900,
    durationMs: T4_DUR,
    requires: ['vintner', 'jam-tech', 'bakery-tech'],
  },
  {
    id: 'market-mastery',
    tier: 4,
    name: 'Κυριαρχία αγοράς',
    description: '+25% κέρματα σε κάθε πώληση.',
    cost: 2400,
    durationMs: T4_DUR,
    requires: ['floor-price', 'ceiling-price'],
  },
]

const BY_ID: Record<string, ResearchNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
)

export const ALL_RESEARCH = NODES

export function getResearchNode(id: string): ResearchNode | undefined {
  return BY_ID[id]
}

/** True if `state` has completed `id`. */
export function hasResearch(state: OrchardState, id: ResearchEffectKind): boolean {
  return state.researchTree.completed.includes(id)
}

/**
 * Available = prerequisites satisfied (or none) AND not already completed
 * AND not the in-flight job.
 */
export function isAvailable(
  state: OrchardState,
  node: ResearchNode,
): boolean {
  if (state.researchTree.completed.includes(node.id)) return false
  if (state.researchTree.inProgress?.id === node.id) return false
  if (node.requires.length === 0) return true
  // "OR" semantics: any one of the listed prerequisites unlocks the node.
  return node.requires.some((r) =>
    state.researchTree.completed.includes(r),
  )
}

export function listByTier(): Record<ResearchTier, ResearchNode[]> {
  const out: Record<ResearchTier, ResearchNode[]> = { 1: [], 2: [], 3: [], 4: [] }
  for (const n of NODES) out[n.tier].push(n)
  return out
}

export const TIER_NAMES: Record<ResearchTier, string> = {
  1: 'Φύτεμα',
  2: 'Συγκομιδή',
  3: 'Παραγωγή',
  4: 'Οικονομία',
}
