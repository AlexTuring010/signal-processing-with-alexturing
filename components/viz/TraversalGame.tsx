'use client'

/**
 * TraversalGame — «Γίνε ο αλγόριθμος».
 *
 * Two modes over the same graph:
 *  - play  — the learner clicks vertices; the game enforces only the
 *            algorithm's *discipline*, not a memorised sequence.
 *  - watch — a passive auto-player (play / pause / step / reset).
 *
 * IMPORTANT design point — DFS is not a single sequence. From any node you
 * may descend into ANY unvisited neighbour; all such choices are valid DFS.
 * So in DFS mode the game *follows the learner's choices* and only checks
 * the rule: «extend the deepest still-live node; backtrack at dead ends».
 *
 * BFS, by contrast, is driven by a FIFO queue: once we fix the convention
 * that new neighbours are enqueued in ascending-id order, the dequeue order
 * is determined — and the queue panel makes every step self-evident.
 */

import { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GraphCanvas } from './GraphCanvas'
import { L06_GRAPH, neighbors } from './graph-types'
import type { GraphData, GraphNodeId, NodeStatus } from './graph-types'

type Algorithm = 'bfs' | 'dfs'
type Mode = 'play' | 'watch'

/** BFS is FIFO-deterministic: precompute the dequeue order + queue snapshots. */
function simulateBfs(graph: GraphData, start: GraphNodeId) {
  const order: GraphNodeId[] = []
  const queueAfter: GraphNodeId[][] = [[start]]
  const discovered = new Set<GraphNodeId>([start])
  let q: GraphNodeId[] = [start]
  while (q.length > 0) {
    const u = q[0]
    q = q.slice(1)
    order.push(u)
    for (const v of neighbors(graph, u)) {
      if (!discovered.has(v)) {
        discovered.add(v)
        q.push(v)
      }
    }
    queueAfter.push([...q])
  }
  return { order, queueAfter }
}

/**
 * DFS view derived from the learner's actual choices. `current` is the most
 * recently visited node that still has an unvisited neighbour; `legal` is
 * every unvisited neighbour of it (any one is a valid move); `stack` is the
 * recursion path from the root down to `current`.
 */
function dfsView(
  graph: GraphData,
  start: GraphNodeId,
  visited: GraphNodeId[],
  parent: Record<number, number>,
): { current: GraphNodeId | null; legal: GraphNodeId[]; stack: GraphNodeId[]; done: boolean } {
  if (visited.length === 0) {
    return { current: null, legal: [start], stack: [], done: false }
  }
  const seen = new Set(visited)
  const hasUnvisitedNeighbour = (u: GraphNodeId) =>
    neighbors(graph, u).some((v) => !seen.has(v))

  let current: GraphNodeId | null = null
  for (let i = visited.length - 1; i >= 0; i--) {
    if (hasUnvisitedNeighbour(visited[i])) {
      current = visited[i]
      break
    }
  }
  if (current === null) return { current: null, legal: [], stack: [], done: true }

  const legal = neighbors(graph, current).filter((v) => !seen.has(v))
  const stack: GraphNodeId[] = []
  let c: GraphNodeId | undefined = current
  while (c !== undefined) {
    stack.unshift(c)
    c = parent[c]
  }
  return { current, legal, stack, done: false }
}

type Props = {
  graph?: GraphData
  algorithm: Algorithm
  start?: GraphNodeId
  /** Initial mode; the learner can still toggle. Default `play`. */
  mode?: Mode
  title?: string
  onSolved?: () => void
}

export function TraversalGame({
  graph = L06_GRAPH,
  algorithm,
  start = 1,
  mode: initialMode = 'play',
  title,
  onSolved,
}: Props) {
  const bfs = useMemo(() => simulateBfs(graph, start), [graph, start])
  const total = bfs.order.length

  const [mode, setMode] = useState<Mode>(initialMode)
  const [visited, setVisited] = useState<GraphNodeId[]>([])
  const [parent, setParent] = useState<Record<number, number>>({})
  const [wrong, setWrong] = useState<{ id: GraphNodeId; msg: string } | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)

  const reset = (nextMode?: Mode) => {
    setVisited([])
    setParent({})
    setWrong(null)
    setNote(null)
    setPlaying(false)
    if (nextMode) setMode(nextMode)
  }

  // --- derive the per-algorithm view ------------------------------------
  let current: GraphNodeId | null
  let legal: GraphNodeId[]
  let structure: GraphNodeId[]
  let done: boolean
  if (algorithm === 'dfs') {
    const v = dfsView(graph, start, visited, parent)
    current = v.current
    legal = v.legal
    structure = v.stack
    done = v.done
  } else {
    const k = visited.length
    done = k >= total
    legal = done ? [] : [bfs.order[k]]
    structure = bfs.queueAfter[Math.min(k, bfs.queueAfter.length - 1)]
    current = visited.length > 0 ? visited[visited.length - 1] : null
  }

  // --- advance ----------------------------------------------------------
  const visit = (x: GraphNodeId) => {
    const nextVisited = [...visited, x]
    if (algorithm === 'dfs') {
      const nextParent = current !== null ? { ...parent, [x]: current } : parent
      setParent(nextParent)
      setVisited(nextVisited)
      const after = dfsView(graph, start, nextVisited, nextParent)
      if (after.done || after.current === x) setNote(null)
      else setNote(`Η ${x} ήταν αδιέξοδο — ο DFS κάνει backtrack στην ${after.current}.`)
    } else {
      setVisited(nextVisited)
      setNote(null)
    }
  }

  // watch-mode auto-player
  useEffect(() => {
    if (mode !== 'watch' || !playing || done) {
      if (done) setPlaying(false)
      return
    }
    const t = setTimeout(() => {
      if (legal.length > 0) visit(legal[0])
    }, 1150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, playing, visited, done])

  useEffect(() => {
    if (done && total > 0) onSolved?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  // --- click handling ---------------------------------------------------
  const explain = (x: GraphNodeId): string => {
    if (algorithm === 'dfs') {
      if (current === null) return `Ξεκίνα από την αφετηρία s = ${start}.`
      return `Η ${x} δεν είναι μη-επισκεμμένος γείτονας της κορυφής όπου βρίσκεσαι (${current}). Ο DFS προχωράει πάντα σε γείτονα της τρέχουσας κορυφής — εδώ μπορείς να διαλέξεις: ${legal.join(', ')}.`
    }
    return `Το BFS βγάζει την κορυφή από την αρχή της ουράς (FIFO). Δες την ουρά πιο κάτω — σωστή επόμενη είναι η ${legal[0]}.`
  }

  const handleNodeClick = (x: GraphNodeId) => {
    if (mode !== 'play' || done) return
    if (legal.includes(x)) {
      setWrong(null)
      visit(x)
    } else {
      setWrong({ id: x, msg: explain(x) })
    }
  }

  // --- node statuses ----------------------------------------------------
  const status: Record<number, NodeStatus> = {}
  for (const v of visited) status[v] = 'visited'
  if (current !== null && !done) status[current] = 'active'
  if (algorithm === 'bfs' && !done) {
    for (const v of structure) if (!(v in status)) status[v] = 'frontier'
  }
  if (wrong) status[wrong.id] = 'error'

  const visitedSet = new Set(visited)
  const clickableNodes =
    mode === 'play' && !done
      ? graph.nodes.map((n) => n.id).filter((id) => !visitedSet.has(id))
      : []

  // --- status message ---------------------------------------------------
  let tone: 'info' | 'danger' | 'success' = 'info'
  let message: string
  if (wrong) {
    tone = 'danger'
    message = wrong.msg
  } else if (done) {
    tone = 'success'
    message =
      algorithm === 'dfs'
        ? `Ολοκληρώθηκε! Μία έγκυρη σειρά DFS: ${visited.join(' → ')}. Υπάρχουν κι άλλες — αυτή είναι η δική σου.`
        : `Ολοκληρώθηκε. Σειρά BFS: ${visited.join(' → ')}.`
  } else if (visited.length === 0) {
    message =
      mode === 'play'
        ? `Κάνε κλικ στην αφετηρία s = ${start} για να ξεκινήσεις.`
        : 'Πάτησε «Αναπαραγωγή» για να δεις τη διάσχιση βήμα-βήμα.'
  } else if (note) {
    message = note
  } else if (algorithm === 'dfs') {
    message = `Βρίσκεσαι στην ${current}. Διάλεξε όποιον μη-επισκεμμένο γείτονά της θέλεις — κάθε επιλογή είναι έγκυρο DFS.`
  } else {
    message = `Έβγαλες την ${visited[visited.length - 1]} από την ουρά. Συνέχισε με την κορυφή στην αρχή της ουράς.`
  }

  const structureLabel = algorithm === 'bfs' ? 'Ουρά (FIFO)' : 'Στοίβα αναδρομής'
  const structureHint =
    algorithm === 'bfs'
      ? 'Η επόμενη κορυφή βγαίνει από τα αριστερά· οι νέες μπαίνουν δεξιά.'
      : 'Δεξιά η κορυφή όπου βρίσκεσαι· σε αδιέξοδο η στοίβα μικραίνει (backtrack).'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          {title ?? `Γίνε ο αλγόριθμος — ${algorithm.toUpperCase()}`}
        </div>
        <div
          role="tablist"
          aria-label="Λειτουργία"
          className="flex gap-1 rounded-lg border border-border bg-bg-soft/60 p-1"
        >
          {(['play', 'watch'] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => reset(m)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                mode === m ? 'bg-bg-elevated text-fg shadow-sm' : 'text-fg-muted hover:text-fg',
              )}
            >
              {m === 'play' ? 'Παίξε το' : 'Παρακολούθησε'}
            </button>
          ))}
        </div>
      </div>

      {/* graph */}
      <GraphCanvas
        graph={graph}
        status={status}
        clickableNodes={clickableNodes}
        onNodeClick={handleNodeClick}
      />

      {/* structure panel */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {structureLabel}
          </span>
          <span className="text-xs text-fg-subtle">{structureHint}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {structure.length === 0 ? (
            <span className="text-sm italic text-fg-subtle">(άδεια)</span>
          ) : (
            structure.map((id, i) => {
              const isEnd = algorithm === 'bfs' ? i === 0 : i === structure.length - 1
              return (
                <span
                  key={`${id}-${i}`}
                  className={cn(
                    'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold',
                    isEnd
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-strong bg-bg-elevated text-fg',
                  )}
                >
                  {id}
                </span>
              )
            })
          )}
        </div>
      </div>

      {/* message */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[3.25rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          tone === 'danger' &&
            'border-red-300/60 bg-red-50/70 text-red-950 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100',
          tone === 'success' &&
            'border-emerald-300/60 bg-emerald-50/70 text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
          tone === 'info' && 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {message}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-fg-subtle">
          Βήμα {visited.length} / {total}
        </span>
        {mode === 'watch' && (
          <>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              disabled={done}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? 'Παύση' : 'Αναπαραγωγή'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                if (legal.length > 0) visit(legal[0])
              }}
              disabled={done}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
              Βήμα
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}
