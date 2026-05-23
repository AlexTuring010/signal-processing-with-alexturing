'use client'

/**
 * GenericSearchExplorer — the «one algorithm, two faces» insight made operable
 * (L07).
 *
 * The lecture's R-set algorithm — "keep a set R; while there's an edge leaving
 * R, pull a new vertex in" — is left in prose, with a callout claiming that
 * the choice of data structure for which vertex to expand next determines
 * whether you get BFS or DFS. This viz turns that claim into a switch the
 * student flips themselves:
 *
 *   - Tab «Ουρά (FIFO)» — pop the OLDEST waiting vertex → BFS discovery order
 *     1,2,3,4,5,7,8,6 over the canonical L06 graph; the picture grows in
 *     concentric layers.
 *   - Tab «Στοίβα (LIFO)» — pop the NEWEST waiting vertex (with an iterator
 *     model: each stack frame carries the index of its next-to-scan neighbour
 *     so the order matches recursive DFS exactly) → 1,2,3,5,4,6,7,8; the
 *     picture grows along a long chain with visible backtracks.
 *   - Tab «Ελεύθερη επιλογή» — same algorithm, but the learner picks any
 *     frontier vertex to expand. The point: the FINAL set R is the same
 *     regardless of choice. The order changes; the set doesn't.
 *
 * Side-by-side the structure (queue or stack) is drawn live, with pop-end
 * arrowed; the discovery order grows in chips below; the verdict at the end
 * names what you just produced — BFS, DFS, or "your own order".
 *
 * Uses the shared L06_GRAPH so the discovery orders line up byte-for-byte
 * with TraversalGame and every other viz that walks this graph.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GraphCanvas } from './GraphCanvas'
import { L06_GRAPH, neighbors } from './graph-types'
import type { GraphNodeId, NodeStatus } from './graph-types'

type Mode = 'fifo' | 'lifo' | 'free'

/** A single FIFO step: pop u, discover all unvisited neighbours of u. */
type FifoStep = {
  popped: GraphNodeId
  discovered: GraphNodeId[]
  queueAfter: GraphNodeId[]
}

function simulateFifo(start: GraphNodeId): FifoStep[] {
  const out: FifoStep[] = []
  const visited = new Set<GraphNodeId>([start])
  let q: GraphNodeId[] = [start]
  while (q.length > 0) {
    const u = q[0]
    q = q.slice(1)
    const newly: GraphNodeId[] = []
    for (const v of neighbors(L06_GRAPH, u)) {
      if (!visited.has(v)) {
        visited.add(v)
        q.push(v)
        newly.push(v)
      }
    }
    out.push({ popped: u, discovered: newly, queueAfter: [...q] })
  }
  return out
}

/**
 * LIFO with iterator-frames so the order matches recursive DFS exactly:
 * each stack frame is (vertex, lastScannedIdx). A "step" is either DISCOVER
 * (find the next unvisited neighbour, push a new frame for it) or POP (no
 * more unvisited neighbours → frame is removed).
 */
type LifoStep =
  | {
      kind: 'discover'
      from: GraphNodeId
      to: GraphNodeId
      stackAfter: GraphNodeId[]
    }
  | {
      kind: 'pop'
      from: GraphNodeId
      stackAfter: GraphNodeId[]
    }

function simulateLifo(start: GraphNodeId): LifoStep[] {
  const out: LifoStep[] = []
  const visited = new Set<GraphNodeId>([start])
  const stack: [GraphNodeId, number][] = [[start, -1]]
  const adj = new Map<GraphNodeId, GraphNodeId[]>()
  for (const n of L06_GRAPH.nodes) adj.set(n.id, neighbors(L06_GRAPH, n.id))

  while (stack.length > 0) {
    const top = stack[stack.length - 1]
    const [u, lastIdx] = top
    const list = adj.get(u)!
    let next = lastIdx + 1
    while (next < list.length && visited.has(list[next])) next++
    if (next >= list.length) {
      stack.pop()
      out.push({ kind: 'pop', from: u, stackAfter: stack.map((f) => f[0]) })
    } else {
      const v = list[next]
      top[1] = next
      visited.add(v)
      stack.push([v, -1])
      out.push({
        kind: 'discover',
        from: u,
        to: v,
        stackAfter: stack.map((f) => f[0]),
      })
    }
  }
  return out
}

function expandableNeighbours(u: GraphNodeId, visited: Set<GraphNodeId>): GraphNodeId[] {
  return neighbors(L06_GRAPH, u).filter((v) => !visited.has(v))
}

export function GenericSearchExplorer() {
  const [mode, setMode] = useState<Mode>('fifo')
  const fifo = useMemo(() => simulateFifo(1), [])
  const lifo = useMemo(() => simulateLifo(1), [])
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  // Free mode state
  const [freeOrder, setFreeOrder] = useState<GraphNodeId[]>([1])
  const [freeFrontier, setFreeFrontier] = useState<GraphNodeId[]>(() =>
    expandableNeighbours(1, new Set([1])),
  )
  const [freeVisited, setFreeVisited] = useState<Set<GraphNodeId>>(new Set([1]))

  const totalSteps = mode === 'fifo' ? fifo.length : mode === 'lifo' ? lifo.length : 0

  function reset(newMode?: Mode) {
    setStep(0)
    setPlaying(false)
    setFreeOrder([1])
    setFreeVisited(new Set([1]))
    setFreeFrontier(expandableNeighbours(1, new Set([1])))
    if (newMode) setMode(newMode)
  }

  useEffect(() => {
    if (!playing || mode === 'free') return
    if (step >= totalSteps) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(totalSteps, s + 1)), 950)
    return () => clearTimeout(t)
  }, [playing, step, mode, totalSteps])

  // ----------------- derive view state -----------------
  type View = {
    discoveryOrder: GraphNodeId[]
    container: GraphNodeId[] // visible contents of the structure
    active: GraphNodeId | null // the focus of the current step (red)
    visitedDone: Set<GraphNodeId> // popped/backtracked (green)
    done: boolean
    narration: string
  }

  let v: View
  if (mode === 'fifo') {
    if (step === 0) {
      v = {
        discoveryOrder: [1],
        container: [1],
        active: null,
        visitedDone: new Set(),
        done: false,
        narration:
          'Αρχή: Q = [1] — η αφετηρία περιμένει στην ουρά. Πάτα «Βήμα» ή ▶ για να βγει η πρώτη κορυφή από την αρχή της ουράς.',
      }
    } else {
      const last = fifo[step - 1]
      const disc: GraphNodeId[] = [1]
      const visitedDone = new Set<GraphNodeId>()
      for (let i = 0; i < step; i++) {
        for (const d of fifo[i].discovered) disc.push(d)
        if (i < step - 1) visitedDone.add(fifo[i].popped)
      }
      const done = step >= fifo.length
      const narration = done
        ? `Τελείωσε. Σειρά ανακάλυψης (BFS): ${disc.join(' → ')}. Η ουρά άδειασε στο βήμα ${fifo.length}.`
        : `Βγάλαμε την ${last.popped} από την αρχή της ουράς (FIFO). Νέοι γείτονες που μπαίνουν στο τέλος: ${last.discovered.length ? last.discovered.join(', ') : '—'}.`
      // when done, the active vertex is also part of visitedDone
      if (done) visitedDone.add(last.popped)
      v = {
        discoveryOrder: disc,
        container: last.queueAfter,
        active: done ? null : last.popped,
        visitedDone,
        done,
        narration,
      }
    }
  } else if (mode === 'lifo') {
    if (step === 0) {
      v = {
        discoveryOrder: [1],
        container: [1],
        active: 1,
        visitedDone: new Set(),
        done: false,
        narration:
          'Αρχή: στοίβα = [1]. Η ρίζα 1 είναι στην κορυφή και «τρέχει» — στο επόμενο βήμα η αναζήτηση κατεβαίνει στον πρώτο μη-επισκεμμένο γείτονά της.',
      }
    } else {
      const last = lifo[step - 1]
      const disc: GraphNodeId[] = [1]
      for (let i = 0; i < step; i++) {
        const e = lifo[i]
        if (e.kind === 'discover') disc.push(e.to)
      }
      const containerSet = new Set(last.stackAfter)
      const visitedDone = new Set<GraphNodeId>()
      for (const x of disc) if (!containerSet.has(x)) visitedDone.add(x)
      const done = step >= lifo.length
      const top = last.stackAfter[last.stackAfter.length - 1]
      const narration = done
        ? `Τελείωσε. Σειρά ανακάλυψης (DFS): ${disc.join(' → ')}. Η στοίβα άδειασε — όλες οι κλήσεις αναδρομής επέστρεψαν.`
        : last.kind === 'discover'
          ? `Από την κορυφή της στοίβας (${last.from}) ο πρώτος μη-επισκεμμένος γείτονας είναι η ${last.to} → κατεβαίνουμε.`
          : `Η ${last.from} δεν έχει άλλο μη-επισκεμμένο γείτονα → backtrack: αφαιρούμε το πλαίσιό της από την κορυφή.`
      v = {
        discoveryOrder: disc,
        container: last.stackAfter,
        active: done ? null : (top ?? null),
        visitedDone,
        done,
        narration,
      }
    }
  } else {
    // free mode
    const done = freeFrontier.length === 0 && freeVisited.size === L06_GRAPH.nodes.length
    const containerSet = new Set(freeFrontier)
    const visitedDone = new Set<GraphNodeId>()
    for (const x of freeOrder) if (!containerSet.has(x)) visitedDone.add(x)
    const narration =
      freeOrder.length === 1
        ? 'Διάλεξε ΟΠΟΙΑΝ κορυφή θες από το frontier πιο κάτω για να την βγάλεις και να επεξεργαστείς τους γείτονές της.'
        : done
          ? `Τελείωσε. Σειρά ανακάλυψης: ${freeOrder.join(' → ')}. Παρατήρησε: όποιες επιλογές κι αν έκανες, το ΤΕΛΙΚΟ σύνολο V είναι το ίδιο με FIFO και LIFO.`
          : freeFrontier.length === 0
            ? 'Το frontier άδειασε — αλλά δεν φτάσαμε σε όλες τις κορυφές. Αυτό σημαίνει ότι η αφετηρία ΔΕΝ συνδέεται με όσες λείπουν (διαφορετική συνεκτική συνιστώσα).'
            : 'Διάλεξε από το frontier — οποιαδήποτε επιλογή είναι έγκυρη.'
    v = {
      discoveryOrder: freeOrder,
      container: freeFrontier,
      active: freeOrder.length > 0 ? freeOrder[freeOrder.length - 1] : null,
      visitedDone,
      done,
      narration,
    }
  }

  function handleFreePick(picked: GraphNodeId) {
    if (mode !== 'free' || !freeFrontier.includes(picked)) return
    const nv = new Set(freeVisited)
    nv.add(picked)
    const newOnes = expandableNeighbours(picked, nv)
    for (const x of newOnes) nv.add(x)
    setFreeVisited(nv)
    setFreeFrontier([...freeFrontier.filter((x) => x !== picked), ...newOnes])
    setFreeOrder([...freeOrder, picked])
  }

  function handleStep(d: number) {
    if (mode === 'free') return
    setStep((s) => Math.min(totalSteps, Math.max(0, s + d)))
  }

  // node statuses for the canvas
  const status: Record<number, NodeStatus> = {}
  for (const x of v.discoveryOrder) status[x] = 'frontier'
  for (const x of v.visitedDone) status[x] = 'visited'
  if (v.active !== null) status[v.active] = 'active'
  // vertices not in container and not visited: keep frontier from discoveryOrder (they were
  // discovered but we want to distinguish). Simplify: anything in discoveryOrder but NOT in
  // container and NOT visited shouldn't exist — but handle defensively.

  // For FIFO/LIFO we want only container members to be frontier (yellow). Vertices that have
  // been discovered but not yet either in container or visited shouldn't exist with our model.
  // Override: vertices in discoveryOrder but NOT in container and NOT visited → visited.
  const containerSet = new Set(v.container)
  for (const x of v.discoveryOrder) {
    if (!containerSet.has(x) && !v.visitedDone.has(x) && x !== v.active) {
      status[x] = 'visited'
    }
  }
  for (const x of v.container) {
    if (x !== v.active) status[x] = 'frontier'
  }

  const titleByMode: Record<Mode, string> = {
    fifo: 'Ουρά (FIFO) → BFS',
    lifo: 'Στοίβα (LIFO) → DFS',
    free: 'Ελεύθερη επιλογή → δικιά σου σειρά',
  }

  const popHint: Record<Mode, string> = {
    fifo: 'Επόμενη έξοδος ← αριστερά. Νέοι γείτονες μπαίνουν δεξιά (πίσω).',
    lifo: 'Επόμενη έξοδος → δεξιά (κορυφή στοίβας). Νέα πλαίσια μπαίνουν δεξιά.',
    free: 'Κάνε κλικ σε ΟΠΟΙΑ κορυφή του frontier — οποιαδήποτε επιλογή είναι έγκυρη.',
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γενική αναζήτηση — η δομή δεδομένων ορίζει τον αλγόριθμο
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {(['fifo', 'lifo', 'free'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => reset(m)}
              className={cn(
                'px-2.5 py-1 transition-colors',
                mode === m
                  ? 'bg-accent text-accent-fg'
                  : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
              )}
            >
              {m === 'fifo' ? 'Ουρά (FIFO)' : m === 'lifo' ? 'Στοίβα (LIFO)' : 'Ελεύθερη'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-subtle">{popHint[mode]}</p>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <GraphCanvas
            graph={L06_GRAPH}
            status={status}
            clickableNodes={mode === 'free' ? freeFrontier : []}
            onNodeClick={mode === 'free' ? handleFreePick : undefined}
            maxWidthClass="max-w-xl"
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                {mode === 'fifo' ? 'Ουρά' : mode === 'lifo' ? 'Στοίβα' : 'Frontier'}
              </span>
              <span className="text-[11px] text-fg-subtle">{titleByMode[mode]}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {mode === 'fifo' && (
                <span className="text-xs font-bold text-amber-700">→ έξοδος</span>
              )}
              {v.container.length === 0 ? (
                <span className="text-sm italic text-fg-subtle">(άδειο)</span>
              ) : (
                v.container.map((id, i) => {
                  const isPopEnd =
                    (mode === 'fifo' && i === 0) ||
                    (mode === 'lifo' && i === v.container.length - 1)
                  const clickable = mode === 'free' && freeFrontier.includes(id)
                  return (
                    <button
                      key={`${id}-${i}`}
                      type="button"
                      disabled={!clickable}
                      onClick={() => clickable && handleFreePick(id)}
                      className={cn(
                        'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold transition-colors',
                        isPopEnd
                          ? 'border-accent bg-accent/15 text-accent'
                          : 'border-border-strong bg-bg-elevated text-fg',
                        clickable && 'cursor-pointer hover:bg-amber-100',
                      )}
                    >
                      {id}
                    </button>
                  )
                })
              )}
              {mode === 'lifo' && (
                <span className="text-xs font-bold text-amber-700">έξοδος ←</span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Σειρά ανακάλυψης
            </div>
            <div className="flex flex-wrap gap-1.5">
              {v.discoveryOrder.map((x, i) => (
                <span
                  key={`${x}-${i}`}
                  className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border border-emerald-500/50 bg-emerald-50 px-1.5 font-mono text-sm font-semibold text-emerald-800"
                >
                  {x}
                </span>
              ))}
              {v.discoveryOrder.length === L06_GRAPH.nodes.length && (
                <span className="ml-1 inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  ✓ όλες οι 8 κορυφές
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
            {v.narration}
          </div>

          {v.done && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              {mode === 'fifo' && (
                <>
                  <strong>FIFO → BFS.</strong> Η σειρά ανακάλυψης ομαδοποιείται σε
                  επίπεδα: L₀={'{1}'}, L₁={'{2,3}'}, L₂={'{4,5,7,8}'}, L₃={'{6}'}.
                  Κάθε νέο επίπεδο ξεκινάει αφού έχει ολοκληρωθεί το προηγούμενο.
                </>
              )}
              {mode === 'lifo' && (
                <>
                  <strong>LIFO → DFS.</strong> Η σειρά ανακάλυψης σχηματίζει μακριές
                  αλυσίδες: 1→2→3→5→4 (αδιέξοδο, backtrack) → 6 (backtrack), και μετά
                  γυρίζουμε στο 3 και κατεβαίνουμε στο 7→8. Ίδιο σύνολο V — διαφορετική
                  πορεία.
                </>
              )}
              {mode === 'free' && (
                <>
                  <strong>Ελεύθερη επιλογή.</strong> Διάλεξες τη δική σου σειρά. Το
                  τελικό σύνολο που πιάστηκε είναι το ίδιο με FIFO/LIFO. Αυτό
                  είναι το θεώρημα: η σειρά αλλάζει, το σύνολο μένει.
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Καθαρά
        </button>
        {mode !== 'free' && (
          <>
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Πίσω
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              disabled={step >= totalSteps}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              {playing ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" /> Παύση
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" /> Παίξε
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={step >= totalSteps}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Βήμα <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="ml-auto text-xs text-fg-subtle">
              Βήμα {step} / {totalSteps}
            </span>
          </>
        )}
        {mode === 'free' && (
          <span className="ml-auto text-xs text-fg-subtle">
            Ανακαλύφθηκαν {v.discoveryOrder.length} / {L06_GRAPH.nodes.length} κορυφές
          </span>
        )}
      </div>
    </section>
  )
}
