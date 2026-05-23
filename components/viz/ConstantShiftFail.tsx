'use client'

/**
 * ConstantShiftFail — why "add a constant to make all weights positive,
 * then run Dijkstra" does not work.
 *
 * The tempting fix for negative weights: shift every edge up by a constant k.
 * It silently changes the answer. This viz puts two s→t paths side by side
 * and a slider raises k. Because the longer route has more edges, it absorbs
 * the constant more times — so the path with FEWER edges (and worse real
 * total) overtakes the genuine shortest past some k.
 *
 * Presets (`instance` prop):
 *  • 'l17' (default) — 2-edge route A (real length 2) vs 4-edge route B
 *    (real length −1, the genuine shortest). At k = 4, all weights ≥ 0, and
 *    Dijkstra returns the wrong path. Used by L17 theory.
 *  • 'ask10' — the three-vertex u → v → w example from φροντιστηριακό #7
 *    ask 10: edge u→v = −1, v→w = −3, direct u→w = −3. The 2-hop path is
 *    truly shorter (−4 vs −3); after +4 to every edge, Dijkstra picks the
 *    1-edge direct route (1 vs 4) — wrong.
 */

import { useState } from 'react'

type CNode = { id: string; x: number; y: number }

type CEdge = { from: CNode; to: CNode; base: number }

type Preset = {
  pathA: CEdge[]
  pathB: CEdge[]
  /** smallest k that lifts every weight to ≥ 0 — used in the verdict copy. */
  kNonneg: number
  kMax: number
  /** Which path is the genuine shortest — declared up front so the verdict
   *  logic doesn't have to re-derive it. Must match the path of strictly
   *  smaller real total. */
  realShortest: 'A' | 'B'
  caption: { left: string; right: string }
  intro: { realA: string; realB: string }
}

// ── L17 preset (default) ───────────────────────────────────────────────────
const S_L17: CNode = { id: 's', x: 54, y: 150 }
const A_L17: CNode = { id: 'a', x: 252, y: 64 }
const T_L17: CNode = { id: 't', x: 452, y: 150 }
const B_L17: CNode = { id: 'b', x: 160, y: 238 }
const C_L17: CNode = { id: 'c', x: 252, y: 238 }
const D_L17: CNode = { id: 'd', x: 344, y: 238 }

const PRESET_L17: Preset = {
  pathA: [
    { from: S_L17, to: A_L17, base: 1 },
    { from: A_L17, to: T_L17, base: 1 },
  ],
  pathB: [
    { from: S_L17, to: B_L17, base: 1 },
    { from: B_L17, to: C_L17, base: 1 },
    { from: C_L17, to: D_L17, base: 1 },
    { from: D_L17, to: T_L17, base: -4 },
  ],
  kNonneg: 4,
  kMax: 5,
  realShortest: 'B',
  caption: {
    left: 'Διαδρομή A — 2 ακμές',
    right: 'Διαδρομή B — 4 ακμές',
  },
  intro: { realA: 'A = 2', realB: 'B = −1' },
}

// ── ask10 preset ───────────────────────────────────────────────────────────
const U_AS: CNode = { id: 'u', x: 80, y: 80 }
const V_AS: CNode = { id: 'v', x: 252, y: 220 }
const W_AS: CNode = { id: 'w', x: 424, y: 80 }

const PRESET_ASK10: Preset = {
  // path A = direct edge u → w; path B = 2-hop u → v → w (the real shortest)
  pathA: [{ from: U_AS, to: W_AS, base: -3 }],
  pathB: [
    { from: U_AS, to: V_AS, base: -1 },
    { from: V_AS, to: W_AS, base: -3 },
  ],
  kNonneg: 3,
  kMax: 5,
  realShortest: 'B',
  caption: {
    left: 'Άμεση u → w · 1 ακμή',
    right: 'Έμμεση u → v → w · 2 ακμές',
  },
  intro: { realA: 'A = −3', realB: 'B = −4' },
}

const PRESETS: Record<string, Preset> = {
  l17: PRESET_L17,
  ask10: PRESET_ASK10,
}

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

const R = 22

export function ConstantShiftFail({ instance = 'l17' }: { instance?: string } = {}) {
  const preset = PRESETS[instance] ?? PRESET_L17
  const { pathA, pathB, kNonneg, kMax, realShortest, caption, intro } = preset
  const [k, setK] = useState(0)

  const edgesA = pathA.length
  const edgesB = pathB.length
  const realA = pathA.reduce((s, e) => s + e.base, 0)
  const realB = pathB.reduce((s, e) => s + e.base, 0)
  const totalA = realA + edgesA * k
  const totalB = realB + edgesB * k

  const dijkstraPicks: 'A' | 'B' = totalA < totalB ? 'A' : 'B'
  const correct = dijkstraPicks === realShortest

  // collect unique nodes for rendering
  const nodeMap = new Map<string, CNode>()
  for (const e of [...pathA, ...pathB]) {
    nodeMap.set(e.from.id, e.from)
    nodeMap.set(e.to.id, e.to)
  }
  const terminalIds = new Set<string>()
  if (pathA.length > 0) {
    terminalIds.add(pathA[0].from.id)
    terminalIds.add(pathA[pathA.length - 1].to.id)
  }

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
        Δύο διαδρομές. Πραγματικά μήκη: {intro.realA}, {intro.realB} — άρα η{' '}
        <strong className="text-fg">
          {realShortest === 'A' ? caption.left : caption.right}
        </strong>{' '}
        είναι όντως η συντομότερη.
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
            {caption.left}
          </text>
          <text x={256} y={290} textAnchor="middle" fontSize={12} fontWeight={700} fill="#5a4a4d">
            {caption.right}
          </text>

          {/* edges */}
          {(
            [
              { edges: pathA, path: 'A' as const },
              { edges: pathB, path: 'B' as const },
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
          {Array.from(nodeMap.values()).map((n) => {
            const terminal = terminalIds.has(n.id)
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
          max={kMax}
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
          <div className="font-semibold text-fg">{caption.left}</div>
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
          <div className="font-semibold text-fg">{caption.right}</div>
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
            Με k = {k}, ο Dijkstra επιλέγει την πραγματικά συντομότερη — σωστά.
            {k < kNonneg && ' Αλλά υπάρχουν ακόμη αρνητικά βάρη — '}
            {k < kNonneg &&
              `χρειάζεται k ≥ ${kNonneg} για να γίνουν όλα ≥ 0. Σύρε το παραπέρα.`}
          </>
        ) : (
          <>
            Με k = {k}, ο Dijkstra επιλέγει τη <strong className="text-danger">λάθος</strong>{' '}
            διαδρομή — αυτή με λιγότερες ακμές αλλά μεγαλύτερο πραγματικό βάρος.{' '}
            {k >= kNonneg &&
              `Και με k = ${kNonneg} όλα τα βάρη έγιναν ήδη ≥ 0 — δηλαδή η «διόρθωση» χαλάει την απάντηση πριν καν ολοκληρωθεί.`}
          </>
        )}
      </div>

      {/* why */}
      <div className="mt-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Γιατί:</span> κάθε +1 στο k
        ακριβαίνει τη μία διαδρομή κατά <strong className="text-fg">+{edgesA}</strong> και
        την άλλη κατά <strong className="text-fg">+{edgesB}</strong>. Μια
        διαδρομή με περισσότερες ακμές μετράει τη σταθερά περισσότερες φορές —
        έτσι η σύγκριση αλλοιώνεται.
      </div>
    </section>
  )
}
