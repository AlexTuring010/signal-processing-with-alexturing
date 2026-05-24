'use client'

/**
 * MaxEdgeAsBridge — front-set-7-ask11 (i).
 *
 * Counterexample to «η μοναδική μέγιστη ακμή ΔΕΝ ανήκει στο ΕΕΔ»:
 * a triangle u-v(1), v-w(1), u-w(2) PLUS a dangling vertex x connected via
 * u-x(10). 4 edges > |V| − 1 = 3, and u-x(10) is the unique max — but it is
 * the only edge touching x, i.e. a BRIDGE, so every spanning tree must
 * include it. Therefore u-x ∈ every MST.
 *
 * The viz shows the graph; «δείξε ΕΕΔ» highlights {u-v, v-w, u-x} (cost
 * 1+1+10 = 12). The deleted edge u-w would have closed a cycle — that's the
 * one Kruskal can skip. The max edge u-x has no cycle to belong to.
 */

import { useState } from 'react'

const NODES = [
  { id: 'u', x: 130, y: 100 },
  { id: 'v', x: 290, y: 100 },
  { id: 'w', x: 210, y: 220 },
  { id: 'x', x: 130, y: 300 },
]

type Edge = { id: string; a: string; b: string; w: number }

const EDGES: Edge[] = [
  { id: 'uv', a: 'u', b: 'v', w: 1 },
  { id: 'vw', a: 'v', b: 'w', w: 1 },
  { id: 'uw', a: 'u', b: 'w', w: 2 },
  { id: 'ux', a: 'u', b: 'x', w: 10 },
]

const R = 22

function pos(id: string) {
  return NODES.find((n) => n.id === id)!
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

const MST_EDGES = new Set(['uv', 'vw', 'ux'])

export function MaxEdgeAsBridge() {
  const [showMst, setShowMst] = useState(false)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Η μέγιστη ακμή μπορεί να είναι γέφυρα — υποχρεωτική στο ΕΕΔ
        </div>
        <button
          type="button"
          onClick={() => setShowMst((v) => !v)}
          className={
            'rounded-md border px-3 py-1.5 text-xs transition ' +
            (showMst
              ? 'border-success bg-success/10 text-success font-semibold'
              : 'border-border bg-bg-soft/40 text-fg-muted hover:bg-bg-soft')
          }
        >
          {showMst ? 'Κρύψε ΕΕΔ' : 'Δείξε ΕΕΔ'}
        </button>
      </div>

      <p className="mb-3 text-xs text-fg-subtle">
        4 ακμές &gt; |V| − 1 = 3, και η <span className="font-mono">u-x</span>{' '}
        βάρους 10 είναι μοναδικά η μέγιστη. Αλλά είναι η μόνη ακμή που αγγίζει
        την x — γέφυρα — οπότε <strong>πρέπει</strong> να μπει σε κάθε ΕΕΔ.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 420 360"
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {EDGES.map((e) => {
            const a = pos(e.a)
            const b = pos(e.b)
            const { x1, y1, x2, y2 } = trim(a, b, R)
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            const isMax = e.id === 'ux'
            const isMst = MST_EDGES.has(e.id)
            const inTreeHi = showMst && isMst
            const stroke = inTreeHi ? '#16a34a' : isMax ? '#9f1239' : '#bdb0b2'
            const sw = inTreeHi || isMax ? 3.4 : 2
            return (
              <g key={e.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={sw}
                />
                <rect x={mx - 13} y={my - 11} width={26} height={22} rx={4} fill="#faf4ee" stroke={stroke} />
                <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#1c1214">
                  {e.w}
                </text>
              </g>
            )
          })}
          {NODES.map((n) => {
            const isolated = n.id === 'x'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={isolated ? '#fef3c7' : '#ffffff'}
                  stroke={isolated ? '#ca8a04' : '#1c1214'}
                  strokeWidth={isolated ? 2.4 : 1.8}
                />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill="#1c1214">
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-[11px] leading-relaxed text-fg-muted">
          <div className="font-semibold text-fg">Η ιδιότητα κύκλου δεν λέει «μέγιστη του γράφου»</div>
          Λέει «μέγιστη <em>ενός κύκλου</em>». Στον γράφο μας οι κύκλοι είναι
          μόνο το τρίγωνο u-v-w. Η ακμή u-x δεν ανήκει σε κανέναν κύκλο — δεν την αγγίζει η ιδιότητα κύκλου.
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] leading-relaxed text-fg-muted">
          {showMst ? (
            <>
              <div className="font-semibold text-fg">
                ΕΕΔ = {'{u-v, v-w, u-x}'}, κόστος 1 + 1 + 10 = 12.
              </div>
              Πετάμε την u-w(2) — έκλεινε τον κύκλο u-v-w (ιδιότητα κύκλου). Η{' '}
              u-x(10), αν και μέγιστη του γράφου, είναι υποχρεωτική.
            </>
          ) : (
            <>
              <div className="font-semibold text-fg">Σκέψου: ποια ακμή κόβεται;</div>
              Μόνο μία από τις 4 πετιέται — αυτή που κλείνει κύκλο. Δοκίμασε
              «Δείξε ΕΕΔ» και θα δεις ότι η μέγιστη ακμή (u-x) μένει μέσα.
            </>
          )}
        </div>
      </div>
    </section>
  )
}
