/**
 * GraphCanvas — a stateless SVG renderer for an undirected graph.
 *
 * It knows nothing about BFS or DFS. Give it a `GraphData`, an optional
 * per-node `status` map, and optional tree/dashed edge sets, and it draws
 * the picture. `TraversalGame` drives it for the interactive traces;
 * lecture MDX can also use it directly for a static diagram.
 *
 * The whole figure renders inside `.graph-canvas` — a wrapper defined in
 * globals.css that pins the colour tokens to light values, so the diagram
 * always reads like a printed insert in both light and dark mode.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { GraphData, GraphEdge, GraphNodeId, NodeStatus } from './graph-types'
import { sameEdge } from './graph-types'

/** Status → node colours. Hard-coded light-surface palette (grey → amber →
 *  crimson → green; red for an out-of-turn click) so it never depends on the
 *  surrounding theme. */
const STATUS_STYLE: Record<NodeStatus, { fill: string; stroke: string; text: string }> = {
  idle: { fill: '#ffffff', stroke: '#9b8a8d', text: '#1c1214' },
  frontier: { fill: '#fef3c7', stroke: '#d97706', text: '#92400e' },
  active: { fill: '#9f1239', stroke: '#7e1031', text: '#ffffff' },
  visited: { fill: '#d1fae5', stroke: '#059669', text: '#065f46' },
  error: { fill: '#fee2e2', stroke: '#dc2626', text: '#991b1b' },
}

const EDGE_NORMAL = '#9b8a8d'
const EDGE_TREE = '#9f1239'

export type LevelBand = { label: string; y: number; height: number }

type Props = {
  graph: GraphData
  /** node id → visual status. Missing ids render as `idle`. */
  status?: Record<number, NodeStatus>
  /** Edges drawn thick + crimson (e.g. the BFS/DFS tree). */
  treeEdges?: GraphEdge[]
  /** Edges drawn dashed (e.g. non-tree / same-level edges). */
  dashedEdges?: GraphEdge[]
  /** Horizontal level bands behind the graph (for the BFS-levels diagram). */
  levelBands?: LevelBand[]
  caption?: ReactNode
  /** Node ids the learner may click. */
  clickableNodes?: number[]
  onNodeClick?: (id: GraphNodeId) => void
  nodeRadius?: number
  /** Tailwind max-width on the svg. Default `max-w-2xl`. */
  maxWidthClass?: string
  className?: string
}

export function GraphCanvas({
  graph,
  status = {},
  treeEdges = [],
  dashedEdges = [],
  levelBands = [],
  caption,
  clickableNodes,
  onNodeClick,
  nodeRadius = 23,
  maxWidthClass = 'max-w-2xl',
  className,
}: Props) {
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]))
  const clickable = new Set(clickableNodes ?? [])
  const [, , vbW] = graph.viewBox.split(/\s+/).map(Number)

  const isTree = (e: GraphEdge) => treeEdges.some((t) => sameEdge(t, e.a, e.b))
  const isDashed = (e: GraphEdge) => dashedEdges.some((d) => sameEdge(d, e.a, e.b))

  return (
    <figure className={cn('graph-canvas', className)}>
      <svg
        viewBox={graph.viewBox}
        className={cn('mx-auto block h-auto w-full', maxWidthClass)}
        role="img"
      >
        {/* level bands (drawn first, behind everything) */}
        {levelBands.map((band, i) => (
          <g key={`band-${i}`}>
            <rect
              x={6}
              y={band.y}
              width={(vbW || 600) - 12}
              height={band.height}
              rx={8}
              fill={EDGE_TREE}
              fillOpacity={0.05}
              stroke={EDGE_TREE}
              strokeOpacity={0.25}
              strokeDasharray="6 4"
            />
            <text
              x={20}
              y={band.y + 22}
              fontSize={13}
              fontWeight={700}
              fill={EDGE_TREE}
              fillOpacity={0.85}
            >
              {band.label}
            </text>
          </g>
        ))}

        {/* edges */}
        {graph.edges.map((e, i) => {
          const A = nodeById.get(e.a)
          const B = nodeById.get(e.b)
          if (!A || !B) return null
          const tree = isTree(e)
          return (
            <line
              key={`edge-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={tree ? EDGE_TREE : EDGE_NORMAL}
              strokeWidth={tree ? 3.5 : 2}
              strokeDasharray={isDashed(e) ? '5 4' : undefined}
              strokeLinecap="round"
            />
          )
        })}

        {/* nodes */}
        {graph.nodes.map((n) => {
          const st = status[n.id] ?? 'idle'
          const c = STATUS_STYLE[st]
          const canClick = clickable.has(n.id) && !!onNodeClick
          return (
            <g
              key={`node-${n.id}`}
              transform={`translate(${n.x} ${n.y})`}
              className={canClick ? 'cursor-pointer' : undefined}
              role={canClick ? 'button' : undefined}
              tabIndex={canClick ? 0 : undefined}
              aria-label={canClick ? `Επίλεξε την κορυφή ${n.label ?? n.id}` : undefined}
              onClick={canClick ? () => onNodeClick!(n.id) : undefined}
              onKeyDown={
                canClick
                  ? (ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault()
                        onNodeClick!(n.id)
                      }
                    }
                  : undefined
              }
            >
              {/* clickable hint ring */}
              {canClick && (
                <circle
                  r={nodeRadius + 6}
                  fill="none"
                  stroke={EDGE_TREE}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
              )}
              {/* generous invisible hit target for touch */}
              {canClick && <circle r={nodeRadius + 15} fill="transparent" />}
              <circle r={nodeRadius} fill={c.fill} stroke={c.stroke} strokeWidth={2.5} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={15}
                fontWeight={700}
                fill={c.text}
              >
                {n.label ?? n.id}
              </text>
            </g>
          )
        })}
      </svg>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
