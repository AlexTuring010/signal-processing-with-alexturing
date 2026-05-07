import type {
  Building,
  GoodKey,
  OrchardState,
  Plot,
  Resources,
  Tree,
} from './types'
import { OFFLINE_FULL_MS, OFFLINE_HALF_MS, makePlots } from './defaults'
import { intervalS, stageMult, yieldPerCycle } from './trees'
import { batchMs, getBuildingDef } from './buildings'
import {
  RESEARCH_PER_MIN_MATURE,
  autoHarvestEnabled,
  effectiveBarnCapacity,
  effectiveBatchYield,
  effectiveGrowthMs,
  effectiveTreeStorage,
  rollPartnership,
  stageAtForState,
} from './effects'
import { getResearchNode } from './research'

/* -------------------------------------------------------------------------- */
/*  Idle catch-up                                                              */
/*                                                                            */
/*  Pure function. Given a state, a wall-clock `now`, and a constant mood     */
/*  multiplier, advance:                                                      */
/*    1. Tree growth (with research-driven growth time)                       */
/*    2. Auto-harvest (if research unlocked)                                  */
/*    3. Building batches (with research-driven yields, partnership rolls)    */
/*    4. Research production (🧪 from mature trees) and in-flight research    */
/*    5. One-shot effects on research completion (e.g. bigger-orchard plots)  */
/* -------------------------------------------------------------------------- */

export type ReconcileResult = {
  state: OrchardState
  wasted: number
  gained: number
}

export function effectiveElapsedMs(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  if (elapsedMs <= OFFLINE_FULL_MS) return elapsedMs
  if (elapsedMs <= OFFLINE_HALF_MS) {
    const overflow = elapsedMs - OFFLINE_FULL_MS
    return OFFLINE_FULL_MS + overflow * 0.5
  }
  return OFFLINE_FULL_MS + (OFFLINE_HALF_MS - OFFLINE_FULL_MS) * 0.5
}

/* ------------------------------ Trees ----------------------------------- */

function stageTransitionTimes(tree: Tree, state: OrchardState): number[] {
  const ms = effectiveGrowthMs(tree, state)
  return [tree.plantedAt + ms.toSmall, tree.plantedAt + ms.toMature]
}

export function tickTree(
  tree: Tree,
  windowStart: number,
  windowEnd: number,
  mood: number,
  state: OrchardState,
): { tree: Tree; produced: number } {
  if (windowEnd <= windowStart) return { tree, produced: 0 }

  const cap = effectiveTreeStorage(tree, state)
  if (tree.storedApples >= cap) {
    return { tree: { ...tree, lastHarvestAt: windowEnd }, produced: 0 }
  }

  const transitions: number[] = []
  for (const ts of stageTransitionTimes(tree, state)) {
    if (ts > windowStart && ts < windowEnd) transitions.push(ts)
  }
  const segments: Array<{ from: number; to: number }> = []
  let cursor = windowStart
  for (const t of transitions) {
    segments.push({ from: cursor, to: t })
    cursor = t
  }
  segments.push({ from: cursor, to: windowEnd })

  let produced = 0
  let stored = tree.storedApples
  let lastHarvest = tree.lastHarvestAt

  for (const seg of segments) {
    if (stored >= cap) break
    const stage = stageAtForState(tree, seg.from, state)
    const sm = stageMult(stage)
    if (sm === 0) {
      lastHarvest = Math.max(lastHarvest, seg.to)
      continue
    }
    const baseInterval = intervalS(tree)
    const effectiveIntervalMs = (baseInterval / Math.max(0.0001, mood * sm)) * 1000
    const since = Math.max(seg.from, lastHarvest)
    const segMs = seg.to - since
    if (segMs <= 0) continue
    const cyclesByTime = Math.floor(segMs / effectiveIntervalMs)
    if (cyclesByTime <= 0) continue
    const perCycle = yieldPerCycle(tree)
    const cyclesByCap = Math.floor((cap - stored) / perCycle)
    const cycles = Math.min(cyclesByTime, cyclesByCap)
    if (cycles <= 0) {
      lastHarvest = Math.max(lastHarvest, seg.to)
      continue
    }
    const gain = cycles * perCycle
    stored += gain
    produced += gain
    lastHarvest = since + cycles * effectiveIntervalMs
  }

  return {
    tree: { ...tree, storedApples: stored, lastHarvestAt: lastHarvest },
    produced,
  }
}

/* ---------------------------- Buildings --------------------------------- */

function tryConsumeInputs(
  building: Building,
  resources: Resources,
  plots: Plot[],
): { ok: true; resources: Resources; plots: Plot[] } | { ok: false } {
  const def = getBuildingDef(building.kind)
  let r: Resources = { ...resources }
  let p: Plot[] = plots

  for (const [k, qtyU] of Object.entries(def.recipe.inputs)) {
    const key = k as GoodKey
    const qty = qtyU as number
    if (key === 'apples') {
      const treeTotal = p.reduce(
        (sum, plot) => sum + (plot.tree ? plot.tree.storedApples : 0),
        0,
      )
      const total = r.apples + treeTotal
      if (total < qty) return { ok: false }
      let need = qty
      const fromBarn = Math.min(need, r.apples)
      r = { ...r, apples: r.apples - fromBarn }
      need -= fromBarn
      if (need > 0) {
        p = p.map((plot) => {
          if (!plot.tree || need <= 0) return plot
          const take = Math.min(need, plot.tree.storedApples)
          need -= take
          return {
            ...plot,
            tree: {
              ...plot.tree,
              storedApples: plot.tree.storedApples - take,
            },
          }
        })
      }
    } else {
      const have = r[key] ?? 0
      if (have < qty) return { ok: false }
      r = { ...r, [key]: have - qty }
    }
  }
  return { ok: true, resources: r, plots: p }
}

function tickBuilding(
  building: Building,
  windowStart: number,
  windowEnd: number,
  resources: Resources,
  plots: Plot[],
  state: OrchardState,
): { building: Building; resources: Resources; plots: Plot[] } {
  if (windowEnd <= windowStart) return { building, resources, plots }
  const def = getBuildingDef(building.kind)
  let b: Building = { ...building }
  let r: Resources = resources
  let p: Plot[] = plots
  let cursor = windowStart

  // Yield helper that bakes in the partnership-double roll per batch.
  function batchProduction(): number {
    const base = effectiveBatchYield(b, state)
    return rollPartnership(state) ? base * 2 : base
  }

  // 1) Complete the in-flight batch if it finishes within the window.
  if (b.batchStartedAt !== null) {
    const finishAt = b.batchStartedAt + batchMs(b)
    if (finishAt <= windowEnd) {
      b = {
        ...b,
        storedOutput: Math.min(def.outputCap, b.storedOutput + batchProduction()),
        batchStartedAt: null,
      }
      cursor = finishAt
    } else {
      return { building: b, resources: r, plots: p }
    }
  }

  if (!b.active) return { building: b, resources: r, plots: p }

  // 2) Run as many full back-to-back batches as time + inputs + storage allow.
  while (cursor + batchMs(b) <= windowEnd) {
    if (b.storedOutput >= def.outputCap) break
    const consumed = tryConsumeInputs(b, r, p)
    if (!consumed.ok) break
    r = consumed.resources
    p = consumed.plots
    cursor += batchMs(b)
    b = {
      ...b,
      storedOutput: Math.min(def.outputCap, b.storedOutput + batchProduction()),
    }
  }

  // 3) Start a new batch in flight if there's any leftover time and inputs.
  if (b.storedOutput < def.outputCap && cursor < windowEnd) {
    const consumed = tryConsumeInputs(b, r, p)
    if (consumed.ok) {
      r = consumed.resources
      p = consumed.plots
      b = { ...b, batchStartedAt: cursor }
    }
  }

  return { building: b, resources: r, plots: p }
}

const BUILDING_ORDER: Building['kind'][] = ['juicer', 'cidery', 'jam', 'bakery']

/* ------------------------------ Research -------------------------------- */

/**
 * Rate of 🧪 production from `plot` over a window. Currently only mature
 * (stage-2) classic trees produce; once Crystal trees ship, this branches.
 */
function researchTrickle(
  plots: Plot[],
  state: OrchardState,
  windowStart: number,
  windowEnd: number,
): number {
  if (windowEnd <= windowStart) return 0
  const minutes = (windowEnd - windowStart) / 60000
  let total = 0
  for (const plot of plots) {
    if (!plot.tree) continue
    // We use the END-of-window stage as a rough proxy. This slightly over-
    // counts for trees that just matured during the window — fine for the
    // gentle trickle we want.
    const stage = stageAtForState(plot.tree, windowEnd, state)
    if (stage === 2) total += RESEARCH_PER_MIN_MATURE
  }
  return total * minutes
}

/**
 * Advance the in-flight research job. Returns updated researchTree + a flag
 * describing whether a node just completed (caller may want to play SFX or
 * apply one-shot effects).
 */
function tickResearch(
  state: OrchardState,
  effectiveEnd: number,
): { tree: OrchardState['researchTree']; completedId: string | null } {
  const job = state.researchTree.inProgress
  if (!job) return { tree: state.researchTree, completedId: null }
  const finishAt = job.startedAt + job.durationMs
  if (finishAt > effectiveEnd) {
    return { tree: state.researchTree, completedId: null }
  }
  const node = getResearchNode(job.id)
  if (!node) {
    // Unknown node id — clear the job to avoid getting stuck.
    return {
      tree: { completed: state.researchTree.completed, inProgress: null },
      completedId: null,
    }
  }
  return {
    tree: {
      completed: [...state.researchTree.completed, job.id],
      inProgress: null,
    },
    completedId: job.id,
  }
}

/* ----------------------- Auto-harvest helper ---------------------------- */

function autoHarvestSweep(
  plots: Plot[],
  resources: Resources,
  barnCap: number,
  state: OrchardState,
  now: number,
): { plots: Plot[]; resources: Resources } {
  if (!autoHarvestEnabled(state)) return { plots, resources }
  let r = resources
  const newPlots = plots.map((p) => {
    if (!p.tree || p.tree.storedApples <= 0) return p
    const cap = effectiveTreeStorage(p.tree, state)
    if (p.tree.storedApples < cap) return p // only sweep when full
    const space = barnCap - r.apples
    if (space <= 0) return p
    const moved = Math.min(p.tree.storedApples, space)
    r = { ...r, apples: r.apples + moved }
    return {
      ...p,
      tree: {
        ...p.tree,
        storedApples: p.tree.storedApples - moved,
        lastHarvestAt: now,
      },
    }
  })
  return { plots: newPlots, resources: r }
}

/* -------------------------------- Top --------------------------------- */

export function reconcile(
  rawState: OrchardState,
  now: number,
  mood: number,
): ReconcileResult {
  const realElapsed = Math.max(0, now - rawState.lastTickAt)
  if (realElapsed === 0) return { state: rawState, wasted: 0, gained: 0 }

  const effective = effectiveElapsedMs(realElapsed)
  const effectiveEnd = rawState.lastTickAt + effective

  // --- 1) Research production (drip 🧪 into resources). Computed against
  // the window so a long offline period accrues research as expected.
  let state: OrchardState = rawState
  const trickle = researchTrickle(state.plots, state, state.lastTickAt, effectiveEnd)
  if (trickle > 0) {
    state = {
      ...state,
      resources: {
        ...state.resources,
        research: state.resources.research + trickle,
      },
    }
  }

  // --- 2) In-flight research completion + one-shot effects.
  const r = tickResearch(state, effectiveEnd)
  state = { ...state, researchTree: r.tree }
  if (r.completedId === 'bigger-orchard') {
    // One-shot: append 12 fresh plots so the player sees them next render.
    const existing = state.plots.length
    const newPlots = makePlots(12).map((p, i) => ({
      ...p,
      id: `p${existing + i}`,
      position: { x: (existing + i) % 4, y: Math.floor((existing + i) / 4) },
    }))
    state = { ...state, plots: [...state.plots, ...newPlots] }
  }

  // --- 3) Tree growth + production.
  let totalGained = 0
  let plots = state.plots.map((p) => {
    if (!p.tree) return p
    const { tree, produced } = tickTree(
      p.tree,
      state.lastTickAt,
      effectiveEnd,
      mood,
      state,
    )
    totalGained += produced
    return { ...p, tree: { ...tree, lastHarvestAt: now } }
  })

  // --- 4) Auto-harvest (if research unlocked) — sweep full trees to barn.
  let resources: Resources = state.resources
  const barnCap = effectiveBarnCapacity(state)
  const swept = autoHarvestSweep(plots, resources, barnCap, state, now)
  plots = swept.plots
  resources = swept.resources

  // --- 5) Buildings — in dependency order (bakery last so it sees fresh jam).
  const byKind: Record<string, Building[]> = {}
  for (const b of state.buildings) (byKind[b.kind] ||= []).push(b)
  const updatedBuildings: Building[] = []
  for (const kind of BUILDING_ORDER) {
    const list = byKind[kind] ?? []
    for (const b of list) {
      const res = tickBuilding(
        b,
        state.lastTickAt,
        effectiveEnd,
        resources,
        plots,
        state,
      )
      updatedBuildings.push(res.building)
      resources = res.resources
      plots = res.plots
    }
  }

  return {
    state: {
      ...state,
      plots,
      buildings: updatedBuildings,
      resources,
      lastTickAt: now,
    },
    wasted: 0,
    gained: totalGained,
  }
}
