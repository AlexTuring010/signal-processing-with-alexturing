'use client'

/**
 * MstPreorderTSP — front-set-7-ask3 («Άπληστη προσέγγιση TSP μέσω MST»).
 *
 * Three stages on the same K_5 graph:
 *   1. «Είσοδος» — show the complete K_5 with all 10 edges and weights.
 *   2. «MST (Prim)» — highlight the MST: {v₂-v₅=1, v₁-v₂=2, v₁-v₃=3, v₁-v₄=5},
 *      cost 11.
 *   3. «Preorder + κύκλος» — root MST at v₁, take preorder
 *      v₁ → v₂ → v₅ → v₃ → v₄ → (back to v₁) and draw it as the Hamilton
 *      cycle the algorithm returns. Show its cost (23) under the panel.
 *
 * The point: a cheap-to-compute MST + a single tree walk gives a feasible TSP
 * tour. (Under triangle inequality this is a 2-approximation.)
 */

import { useState } from 'react'

type NodeId = 'v₁' | 'v₂' | 'v₃' | 'v₄' | 'v₅'

const NODES: Record<NodeId, { x: number; y: number }> = {
  'v₁': { x: 240, y: 70 },
  'v₂': { x: 380, y: 170 },
  'v₃': { x: 100, y: 170 },
  'v₄': { x: 330, y: 320 },
  'v₅': { x: 150, y: 320 },
}
const R = 22

type Edge = { a: NodeId; b: NodeId; w: number }

const EDGES: Edge[] = [
  { a: 'v₁', b: 'v₂', w: 2 },
  { a: 'v₁', b: 'v₃', w: 3 },
  { a: 'v₁', b: 'v₄', w: 5 },
  { a: 'v₁', b: 'v₅', w: 8 },
  { a: 'v₂', b: 'v₃', w: 4 },
  { a: 'v₂', b: 'v₄', w: 7 },
  { a: 'v₂', b: 'v₅', w: 1 },
  { a: 'v₃', b: 'v₄', w: 6 },
  { a: 'v₃', b: 'v₅', w: 9 },
  { a: 'v₄', b: 'v₅', w: 10 },
]

const MST_EDGES = new Set(['v₁-v₂', 'v₁-v₃', 'v₁-v₄', 'v₂-v₅'])
const MST_COST = 11

// Preorder of MST rooted at v₁:
// v₁ children = [v₂, v₃, v₄]; v₂ children = [v₅]; v₃, v₄ leaves.
// preorder = v₁, v₂, v₅, v₃, v₄
const TOUR: NodeId[] = ['v₁', 'v₂', 'v₅', 'v₃', 'v₄', 'v₁']

function edgeKey(a: NodeId, b: NodeId): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

function edgeWeight(a: NodeId, b: NodeId): number {
  const k = edgeKey(a, b)
  return EDGES.find((e) => edgeKey(e.a, e.b) === k)!.w
}

function trim(a: { x: number; y: number }, b: { x: number; y: number }, r: number) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return {
    x1: a.x + (dx / len) * r,
    y1: a.y + (dy / len) * r,
    x2: b.x - (dx / len) * r,
    y2: b.y - (dy / len) * r,
  }
}

export function MstPreorderTSP() {
  const [stage, setStage] = useState<0 | 1 | 2>(0)

  const TOUR_EDGES = new Set(
    TOUR.slice(0, -1).map((u, i) => edgeKey(u, TOUR[i + 1])),
  )

  const tourCost = TOUR.slice(0, -1).reduce(
    (sum, u, i) => sum + edgeWeight(u, TOUR[i + 1]),
    0,
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          GREEDY-TSP — MST + προδιατεταγμένη διάσχιση = εφικτός κύκλος
        </div>
        <div className="flex gap-1.5">
          {(['Είσοδος K₅', 'MST (Prim)', 'Preorder + κύκλος'] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStage(i as 0 | 1 | 2)}
              className={
                'rounded-md border px-3 py-1.5 text-xs transition ' +
                (stage === i
                  ? 'border-accent bg-accent text-white font-semibold'
                  : 'border-border bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
              }
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 480 390"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="mpt-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9f1239" />
            </marker>
          </defs>

          {EDGES.map((e) => {
            const a = NODES[e.a]
            const b = NODES[e.b]
            const { x1, y1, x2, y2 } = trim(a, b, R)
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            const k = edgeKey(e.a, e.b)
            const isMst = MST_EDGES.has(k)
            const isTour = TOUR_EDGES.has(k)
            const visible =
              stage === 0 || (stage === 1 && isMst) || (stage === 2 && (isMst || isTour))
            const stroke =
              stage === 2 && isTour ? '#9f1239' : isMst ? '#16a34a' : '#bdb0b2'
            const sw = isTour && stage === 2 ? 3.4 : isMst && stage >= 1 ? 3.2 : 1.5
            const opacity = !visible && stage > 0 ? 0.18 : 1
            return (
              <g key={k} opacity={opacity}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                {stage <= 1 && (
                  <>
                    <rect x={mx - 11} y={my - 10} width={22} height={20} rx={4} fill="#faf4ee" stroke={isMst && stage >= 1 ? '#16a34a' : '#cdbfc0'} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                      {e.w}
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {stage === 2 && (
            <>
              {TOUR.slice(0, -1).map((u, i) => {
                const a = NODES[u]
                const b = NODES[TOUR[i + 1]]
                const { x2, y2 } = trim(a, b, R - 6)
                const { x1, y1 } = trim(a, b, R + 4)
                return (
                  <g key={`tour-${i}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#9f1239"
                      strokeWidth={3.2}
                      strokeDasharray="6 3"
                      markerEnd="url(#mpt-arr)"
                    />
                  </g>
                )
              })}
            </>
          )}

          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const isRoot = id === 'v₁' && stage >= 1
            return (
              <g key={id}>
                <circle
                  cx={NODES[id].x}
                  cy={NODES[id].y}
                  r={R}
                  fill={isRoot ? '#fde2e4' : '#ffffff'}
                  stroke={isRoot ? '#9f1239' : '#1c1214'}
                  strokeWidth={isRoot ? 3 : 1.8}
                />
                <text x={NODES[id].x} y={NODES[id].y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#1c1214">
                  {id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
        {stage === 0 && (
          <span>
            Πλήρης γράφος K₅ με 10 ακμές και βάρη ως αποστάσεις. Στόχος: κύκλος
            Hamilton (μία φορά από κάθε κορυφή).
          </span>
        )}
        {stage === 1 && (
          <>
            <span className="font-semibold text-fg">
              MST = {'{v₂-v₅=1, v₁-v₂=2, v₁-v₃=3, v₁-v₄=5}'}
            </span>
            , συνολικό κόστος <span className="font-mono">{MST_COST}</span>. Από τις
            10 ακμές κρατάμε τις φθηνότερες 4 που δεν κλείνουν κύκλο. Η{' '}
            <span className="font-mono">v₁</span> γίνεται η «ρίζα».
          </>
        )}
        {stage === 2 && (
          <>
            <div className="font-semibold text-fg">
              Preorder από v₁: v₁ → v₂ → v₅ → v₃ → v₄ → v₁
            </div>
            <div className="mt-1 font-mono">
              Κόστος κύκλου: 2 + 1 + 9 + 6 + 5 ={' '}
              <span className="text-fg">{tourCost}</span>
            </div>
            <div className="mt-1.5 text-fg-subtle">
              Ο κύκλος είναι <em>εφικτός</em> γιατί ο γράφος είναι πλήρης — όλες
              οι ακμές υπάρχουν. Δεν είναι ο βέλτιστος κύκλος TSP· είναι ο{' '}
              κύκλος που παράγει το preorder του MST.
            </div>
          </>
        )}
      </div>
    </section>
  )
}
