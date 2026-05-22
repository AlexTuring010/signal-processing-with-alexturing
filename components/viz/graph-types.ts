/**
 * Shared graph data + types for the algorithm visualisations.
 *
 * `L06_GRAPH` is the 8-vertex graph introduced in L06 and reused throughout
 * the graph lectures (L07 BFS/DFS traces, and later L08/L09). Keeping it here
 * as one constant means every visualization and every worked trace agrees on
 * the same vertices, edges and adjacency order — no drift between a diagram
 * and the prose that describes it.
 */

export type GraphNodeId = number

export type GraphNode = {
  id: GraphNodeId
  /** SVG coordinates inside the graph's `viewBox`. */
  x: number
  y: number
  /** Display label; defaults to the id. */
  label?: string
}

export type GraphEdge = {
  a: GraphNodeId
  b: GraphNodeId
}

export type GraphData = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** SVG viewBox, e.g. "0 0 600 420". */
  viewBox: string
}

/**
 * Visual state of a node during a traversal trace.
 * - `idle`     — not yet touched
 * - `frontier` — discovered, waiting in the queue / on the stack
 * - `active`   — being processed right now
 * - `visited`  — fully processed
 * - `error`    — the learner clicked it out of turn
 */
export type NodeStatus = 'idle' | 'frontier' | 'active' | 'visited' | 'error'

/**
 * The L06 graph: V = {1..8}, m = 11 edges. Natural drawing layout — the
 * same picture used in the L06/L07 lecture slides.
 */
export const L06_GRAPH: GraphData = {
  viewBox: '0 0 600 430',
  nodes: [
    { id: 1, x: 235, y: 64 },
    { id: 2, x: 130, y: 192 },
    { id: 3, x: 332, y: 186 },
    { id: 4, x: 112, y: 322 },
    { id: 5, x: 286, y: 322 },
    { id: 6, x: 286, y: 388 },
    { id: 7, x: 470, y: 72 },
    { id: 8, x: 476, y: 252 },
  ],
  edges: [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 2, b: 3 },
    { a: 2, b: 4 },
    { a: 2, b: 5 },
    { a: 3, b: 5 },
    { a: 3, b: 7 },
    { a: 3, b: 8 },
    { a: 4, b: 5 },
    { a: 5, b: 6 },
    { a: 7, b: 8 },
  ],
}

/**
 * The same graph, laid out by BFS level with root s = 1. Used for the
 * banded "BFS levels" diagram. Levels: L0={1}, L1={2,3}, L2={4,5,7,8},
 * L3={6}.
 */
export const L06_BFS_TREE: GraphData = {
  viewBox: '0 0 620 400',
  nodes: [
    { id: 1, x: 310, y: 58 },
    { id: 2, x: 210, y: 150 },
    { id: 3, x: 410, y: 150 },
    { id: 4, x: 108, y: 242 },
    { id: 5, x: 250, y: 242 },
    { id: 7, x: 392, y: 242 },
    { id: 8, x: 524, y: 242 },
    { id: 6, x: 250, y: 334 },
  ],
  edges: L06_GRAPH.edges,
}

/** Adjacency in ascending-id order — the canonical neighbour order for traces. */
export function neighbors(graph: GraphData, id: GraphNodeId): GraphNodeId[] {
  const out: GraphNodeId[] = []
  for (const e of graph.edges) {
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  }
  return out.sort((p, q) => p - q)
}

/** Order-independent key for an edge, so {a,b} and {b,a} compare equal. */
export function edgeKey(a: GraphNodeId, b: GraphNodeId): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

/** True when edge `e` is the edge between `a` and `b` (in either direction). */
export function sameEdge(e: GraphEdge, a: GraphNodeId, b: GraphNodeId): boolean {
  return edgeKey(e.a, e.b) === edgeKey(a, b)
}
