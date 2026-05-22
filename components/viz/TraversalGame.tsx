'use client'

/**
 * TraversalGame — «Γίνε ο αλγόριθμος».
 *
 * Two modes over the same trace:
 *  - play  — the learner clicks vertices in a valid BFS/DFS order; the
 *            queue / recursion-stack updates live and wrong clicks are
 *            explained. Retrieval practice: you don't watch the algorithm,
 *            you ARE it.
 *  - watch — a passive auto-player (play / pause / step / reset).
 *
 * All BFS/DFS semantics live here; GraphCanvas is just the dumb renderer.
 * Neighbours are always taken in ascending-id order — the same canonical
 * order the course's adjacency lists use — so "the correct next vertex" is
 * a single, explainable answer.
 */

import { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GraphCanvas } from './GraphCanvas'
import { L06_GRAPH, neighbors } from './graph-types'
import type { GraphData, GraphNodeId, NodeStatus } from './graph-types'

type Algorithm = 'bfs' | 'dfs'
type Mode = 'play' | 'watch'

type Frame = {
  /** vertices visited so far, in order */
  visited: GraphNodeId[]
  /** vertex processed at this frame (null for the initial frame) */
  active: GraphNodeId | null
  /** queue (BFS) or recursion stack (DFS) at this frame */
  structure: GraphNodeId[]
}

/** Simulate the traversal once, recording a frame after each visit. */
function buildTrace(graph: GraphData, start: GraphNodeId, algorithm: Algorithm): Frame[] {
  if (algorithm === 'bfs') {
    const frames: Frame[] = [{ visited: [], active: null, structure: [start] }]
    const discovered = new Set<GraphNodeId>([start])
    let queue: GraphNodeId[] = [start]
    const order: GraphNodeId[] = []
    while (queue.length > 0) {
      const u = queue[0]
      queue = queue.slice(1)
      order.push(u)
      for (const v of neighbors(graph, u)) {
        if (!discovered.has(v)) {
          discovered.add(v)
          queue.push(v)
        }
      }
      frames.push({ visited: [...order], active: u, structure: [...queue] })
    }
    return frames
  }

  // DFS — recursive, recording the call stack (root → current) at each visit.
  const frames: Frame[] = [{ visited: [], active: null, structure: [] }]
  const explored = new Set<GraphNodeId>()
  const order: GraphNodeId[] = []
  const path: GraphNodeId[] = []
  const visit = (u: GraphNodeId) => {
    explored.add(u)
    order.push(u)
    path.push(u)
    frames.push({ visited: [...order], active: u, structure: [...path] })
    for (const v of neighbors(graph, u)) {
      if (!explored.has(v)) visit(v)
    }
    path.pop()
  }
  visit(start)
  return frames
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
  const frames = useMemo(() => buildTrace(graph, start, algorithm), [graph, start, algorithm])
  /** canonical visit order, length = reachable vertex count */
  const order = useMemo(() => frames.slice(1).map((f) => f.active as GraphNodeId), [frames])
  const total = order.length

  const [mode, setMode] = useState<Mode>(initialMode)
  const [progress, setProgress] = useState(0) // vertices visited so far
  const [wrong, setWrong] = useState<{ id: GraphNodeId; msg: string } | null>(null)
  const [playing, setPlaying] = useState(false)

  const reset = (nextMode?: Mode) => {
    setProgress(0)
    setWrong(null)
    setPlaying(false)
    if (nextMode) setMode(nextMode)
  }

  // watch-mode auto-player
  useEffect(() => {
    if (mode !== 'watch' || !playing) return
    if (progress >= total) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setProgress((p) => p + 1), 1150)
    return () => clearTimeout(t)
  }, [mode, playing, progress, total])

  useEffect(() => {
    if (progress === total && total > 0) onSolved?.()
  }, [progress, total, onSolved])

  const frame = frames[progress]
  const done = progress >= total

  // ---- node statuses for the canvas -------------------------------------
  const status: Record<number, NodeStatus> = {}
  for (const v of frame.visited) status[v] = 'visited'
  if (frame.active != null) status[frame.active] = 'active'
  if (algorithm === 'bfs') {
    for (const v of frame.structure) if (!(v in status)) status[v] = 'frontier'
  }
  if (wrong) status[wrong.id] = 'error'

  const visitedSet = new Set(frame.visited)
  const clickableNodes =
    mode === 'play' && !done ? graph.nodes.map((n) => n.id).filter((id) => !visitedSet.has(id)) : []

  // ---- click handling ---------------------------------------------------
  const explain = (clicked: GraphNodeId): string => {
    const correct = order[progress]
    if (algorithm === 'bfs') {
      return `Όχι ακόμη — η ${clicked} δεν είναι η σειρά. Το BFS εξερευνά επίπεδο-επίπεδο: βγάζει κορυφές από την αρχή της ουράς (FIFO). Σωστή επόμενη: η ${correct}.`
    }
    return `Όχι ακόμη — η ${clicked} δεν είναι η σειρά. Το DFS βυθίζεται στον μικρότερο μη-επισκεμμένο γείτονα της τρέχουσας κορυφής· αν δεν υπάρχει, κάνει backtrack. Σωστή επόμενη: η ${correct}.`
  }

  const handleNodeClick = (id: GraphNodeId) => {
    if (mode !== 'play' || done) return
    if (id === order[progress]) {
      setWrong(null)
      setProgress((p) => p + 1)
    } else {
      setWrong({ id, msg: explain(id) })
    }
  }

  // ---- the status message ----------------------------------------------
  let tone: 'info' | 'danger' | 'success' = 'info'
  let message: string
  if (wrong) {
    tone = 'danger'
    message = wrong.msg
  } else if (done) {
    tone = 'success'
    message = `Ολοκληρώθηκε. Σειρά διάσχισης: ${order.join(' → ')}.`
  } else if (progress === 0) {
    message =
      mode === 'play'
        ? `Κάνε κλικ στην κορυφή απ' όπου ξεκινά ο αλγόριθμος — την αφετηρία s = ${start}.`
        : 'Πάτησε «Αναπαραγωγή» για να δεις τη διάσχιση βήμα-βήμα.'
  } else {
    const a = frame.active
    if (algorithm === 'bfs') {
      message = `Βγάλαμε την ${a} από την ουρά και προσθέσαμε στο τέλος τους μη-ανακαλυμμένους γείτονές της.`
    } else {
      message = `Κατεβήκαμε στην ${a} — βάθος ${frame.structure.length} στη στοίβα αναδρομής.`
    }
    if (mode === 'play') message = `Σωστά! ${message}`
  }

  const structureLabel = algorithm === 'bfs' ? 'Ουρά (FIFO)' : 'Στοίβα αναδρομής'
  const structureHint =
    algorithm === 'bfs'
      ? 'Η επόμενη κορυφή βγαίνει από τα αριστερά· οι νέες μπαίνουν δεξιά.'
      : 'Η τρέχουσα κορυφή είναι δεξιά· το backtrack αφαιρεί από τα δεξιά.'

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
                mode === m
                  ? 'bg-bg-elevated text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg',
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
          {frame.structure.length === 0 ? (
            <span className="text-sm italic text-fg-subtle">(άδεια)</span>
          ) : (
            frame.structure.map((id, i) => {
              const isEnd = algorithm === 'bfs' ? i === 0 : i === frame.structure.length - 1
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
          Βήμα {progress} / {total}
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
                setProgress((p) => Math.min(p + 1, total))
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
