'use client'

/**
 * ConstantShiftFail — why "add a constant to make all weights positive,
 * then run Dijkstra" does not work.
 *
 * The tempting fix for negative weights: shift every edge up by a constant k.
 * It silently changes the answer. This viz puts two s→t paths side by side —
 * a 2-edge route (real length 2) and a 4-edge route (real length −1, the
 * genuine shortest). A slider raises k. Because the longer route has more
 * edges, it absorbs the constant more times: each +1 of k costs path B +4 but
 * path A only +2. Past k = 1.5 the shorter route wins on paper — and the
 * minimum shift that makes all weights ≥ 0 (k = 4) is already well past that.
 * Built for L17.
 */

import { useState } from 'react'

type CNode = { id: string; x: number; y: number }
const S: CNode = { id: 's', x: 54, y: 150 }
const A: CNode = { id: 'a', x: 252, y: 64 }
const T: CNode = { id: 't', x: 452, y: 150 }
const B: CNode = { id: 'b', x: 160, y: 238 }
const C: CNode = { id: 'c', x: 252, y: 238 }
const D: CNode = { id: 'd', x: 344, y: 238 }
const R = 22

type CEdge = { from: CNode; to: CNode; base: number }
const PATH_A: CEdge[] = [
  { from: S, to: A, base: 1 },
  { from: A, to: T, base: 1 },
]
const PATH_B: CEdge[] = [
  { from: S, to: B, base: 1 },
  { from: B, to: C, base: 1 },
  { from: C, to: D, base: 1 },
  { from: D, to: T, base: -4 },
]
/** smallest k that lifts every weight to ≥ 0 — the most negative edge is −4. */
const K_NONNEG = 4

function trim(a: CNode, b: CNode, r: number) {
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

export function ConstantShiftFail() {
  const [k, setK] = useState(0)

  const edgesA = PATH_A.length // 2
  const edgesB = PATH_B.length // 4
  const realA = PATH_A.reduce((s, e) => s + e.base, 0) // 2
  const realB = PATH_B.reduce((s, e) => s + e.base, 0) // −1
  const totalA = realA + edgesA * k
  const totalB = realB + edgesB * k

  const dijkstraPicks: 'A' | 'B' = totalA < totalB ? 'A' : 'B'
  const correct = dijkstraPicks === 'B' // B is the genuine shortest

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          «Πρόσθεσε μια σταθερά» — γιατί δεν δουλεύει
        </div>
        <span
          className={
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ' +
            (correct
              ? 'bg-success/15 text-success'
              : 'bg-danger/15 text-danger')
          }
        >
          {correct ? 'Σωστή απάντηση' : 'Λάθος απάντηση'}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Δύο διαδρομές s→t. Πραγματικά μήκη: A = {realA}, B = {realB} — άρα η{' '}
        <strong className="text-fg">B</strong> είναι όντως η συντομότερη.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 506 304"
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="csf-arr"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9b8a8d" />
            </marker>
            <marker
              id="csf-arr-hi"
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

          {/* path labels */}
          <text x={256} y={24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#5a4a4d">
            Διαδρομή A — {edgesA} ακμές
          </text>
          <text x={256} y={290} textAnchor="middle" fontSize={12} fontWeight={700} fill="#5a4a4d">
            Διαδρομή B — {edgesB} ακμές
          </text>

          {/* edges */}
          {(
            [
              { edges: PATH_A, path: 'A' as const },
              { edges: PATH_B, path: 'B' as const },
            ]
          ).flatMap(({ edges, path }) =>
            edges.map((e, i) => {
              const { x1, y1, x2, y2 } = trim(e.from, e.to, R)
              const picked = dijkstraPicks === path
              const w = e.base + k
              const neg = w < 0
              const mx = (x1 + x2) / 2
              const my = (y1 + y2) / 2
              return (
                <g key={`${path}-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={picked ? '#9f1239' : '#bdb0b2'}
                    strokeWidth={picked ? 3.6 : 2}
                    markerEnd={picked ? 'url(#csf-arr-hi)' : 'url(#csf-arr)'}
                  />
                  <rect
                    x={mx - 15}
                    y={my - 11}
                    width={30}
                    height={21}
                    rx={4}
                    fill={neg ? '#fee2e2' : '#faf4ee'}
                    stroke={neg ? '#dc2626' : picked ? '#9f1239' : '#cdbfc0'}
                  />
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={700}
                    fill={neg ? '#dc2626' : '#1c1214'}
                  >
                    {w}
                  </text>
                </g>
              )
            }),
          )}

          {/* nodes */}
          {[S, A, T, B, C, D].map((n) => {
            const terminal = n.id === 's' || n.id === 't'
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill={terminal ? '#fde2e4' : '#ffffff'}
                  stroke={terminal ? '#9f1239' : '#9b8a8d'}
                  strokeWidth={2.4}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* slider */}
      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0 text-sm font-medium text-fg">
          Σταθερά k
        </span>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={k}
          aria-label="Σταθερά k που προστίθεται σε κάθε ακμή"
          onChange={(e) => setK(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
        <span className="w-28 shrink-0 text-right font-mono text-sm font-bold tabular-nums text-fg">
          +{k} / ακμή
        </span>
      </div>

      {/* the two path totals */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div
          className={
            'rounded-lg border px-3 py-2 text-sm ' +
            (dijkstraPicks === 'A'
              ? 'border-accent/60 bg-accent/10'
              : 'border-border bg-bg-soft/40')
          }
        >
          <div className="font-semibold text-fg">Διαδρομή A · {edgesA} ακμές</div>
          <div className="mt-0.5 font-mono text-fg-muted">
            {realA} + {edgesA}·{k} ={' '}
            <span className="text-lg font-bold text-fg">{totalA}</span>
          </div>
        </div>
        <div
          className={
            'rounded-lg border px-3 py-2 text-sm ' +
            (dijkstraPicks === 'B'
              ? 'border-accent/60 bg-accent/10'
              : 'border-border bg-bg-soft/40')
          }
        >
          <div className="font-semibold text-fg">Διαδρομή B · {edgesB} ακμές</div>
          <div className="mt-0.5 font-mono text-fg-muted">
            {realB} + {edgesB}·{k} ={' '}
            <span className="text-lg font-bold text-fg">{totalB}</span>
          </div>
        </div>
      </div>

      {/* verdict */}
      <div
        className={
          'mt-2 rounded-lg border px-3 py-2 text-sm leading-relaxed ' +
          (correct
            ? 'border-success/50 bg-success/10 text-fg-muted'
            : 'border-danger/50 bg-danger/10 text-fg-muted')
        }
      >
        {correct ? (
          <>
            Με k = {k}, ο Dijkstra θα διάλεγε την{' '}
            <strong className="text-fg">B</strong> ({totalB} &lt; {totalA}) —
            σωστά. {k < K_NONNEG && 'Αλλά υπάρχουν ακόμη αρνητικά βάρη — '}
            {k < K_NONNEG &&
              `χρειάζεται k ≥ ${K_NONNEG} για να γίνουν όλα ≥ 0. Σύρε το παραπέρα.`}
          </>
        ) : (
          <>
            Με k = {k}, ο Dijkstra θα διάλεγε την{' '}
            <strong className="text-danger">A</strong> ({totalA} &lt; {totalB}){' '}
            — <strong className="text-fg">λάθος</strong>: η πραγματικά
            συντομότερη είναι η B.{' '}
            {k >= K_NONNEG &&
              `Και με k = ${K_NONNEG} όλα τα βάρη έγιναν ήδη ≥ 0 — δηλαδή η «διόρθωση» χαλάει την απάντηση πριν καν ολοκληρωθεί.`}
          </>
        )}
      </div>

      {/* why */}
      <div className="mt-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Γιατί:</span> κάθε +1 στο k
        ακριβαίνει τη B κατά <strong className="text-fg">+{edgesB}</strong> (μία
        φορά ανά ακμή) αλλά την A μόνο κατά{' '}
        <strong className="text-fg">+{edgesA}</strong>. Μια διαδρομή με
        περισσότερες ακμές μετράει τη σταθερά περισσότερες φορές — έτσι η
        σύγκριση αλλοιώνεται.
      </div>
    </section>
  )
}
