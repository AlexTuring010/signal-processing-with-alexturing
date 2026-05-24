'use client'

/**
 * TopoSortClassMatrix — «σε ποιες κλάσεις δουλεύει η τοπολογική ταξινόμηση;»
 *
 * Four tabs, one per class from pt2-th2-2: (i) γραφήματα με θετικά βάρη,
 * (ii) DAG, (iii) δέντρα, (iv) διμερή. Each tab carries a small hand-crafted
 * directed graph; the «Επόμενο» stepper runs the source-extraction algorithm
 * (peel any in-degree-0 vertex into the order). For (i) and (iv) the graph
 * embeds an obvious cycle so topo sort visibly gets stuck — the killer point
 * is that the *property* (weights / bipartiteness) does NOT constrain the
 * cycle structure, so neither class can be answered «ναι». For (ii) the
 * canonical DAG plays out cleanly; for (iii) a rooted directed tree (the only
 * tree flavour that even has «direction») produces a parent-first order.
 *
 * Built for L12 — Phase D.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ClassId = 'weights' | 'dag' | 'tree' | 'bipartite'

type Vertex = {
  id: string
  x: number
  y: number
  group?: 'A' | 'B' // bipartition for tab iv
}

type Edge = {
  from: string
  to: string
  weight?: number
}

type Instance = {
  vertices: Vertex[]
  edges: Edge[]
  /** topological order if one exists, else null (cycle) */
  topoOrder: string[] | null
  /** vertices that get stuck (still have in-degree > 0 at the end) — for cycle cases */
  stuckVertices: string[]
  /** Greek caption shown above the SVG */
  caption: string
  /** verdict shown at the end of the stepper */
  verdict: 'ok' | 'fail'
  /** the canonical reason — used in the closing banner */
  reason: string
}

const INSTANCES: Record<ClassId, Instance> = {
  // ── (i) Γραφήματα με θετικά βάρη ────────────────────────────────────────
  weights: {
    caption:
      'Κατευθυνόμενο γράφημα με αυστηρά θετικά βάρη. Όλες οι ακμές έχουν w ≥ 1 — αλλά υπάρχει και κύκλος A → B → C → A.',
    vertices: [
      { id: 'A', x: 80, y: 80 },
      { id: 'B', x: 220, y: 50 },
      { id: 'C', x: 220, y: 140 },
      { id: 'D', x: 340, y: 95 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'C', to: 'A', weight: 5 }, // closes the cycle
      { from: 'B', to: 'D', weight: 4 },
    ],
    topoOrder: null,
    stuckVertices: ['A', 'B', 'C'],
    verdict: 'fail',
    reason:
      'Η ακμή C → A κλείνει κύκλο. Τα βάρη — όλα θετικά — δεν λένε απολύτως τίποτα για το αν υπάρχει κύκλος. Αρκεί ΕΝΑ τέτοιο γράφημα για να σκοτώσει την απάντηση «πάντα».',
  },

  // ── (ii) DAG ────────────────────────────────────────────────────────────
  dag: {
    caption:
      'Κατευθυνόμενο, άκυκλο γράφημα (DAG) — η κλάση για την οποία ορίζεται η τοπολογική ταξινόμηση. Κάθε ακμή πάει «εμπρός» μόλις βάλεις τις κορυφές σε σωστή σειρά.',
    vertices: [
      { id: 'A', x: 80, y: 70 },
      { id: 'B', x: 80, y: 160 },
      { id: 'C', x: 210, y: 50 },
      { id: 'D', x: 210, y: 140 },
      { id: 'E', x: 340, y: 100 },
    ],
    edges: [
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'E' },
    ],
    topoOrder: ['A', 'B', 'C', 'D', 'E'],
    stuckVertices: [],
    verdict: 'ok',
    reason:
      'Όλες οι κορυφές μπαίνουν στη σειρά. Η τοπολογική ταξινόμηση δουλεύει εξ ορισμού — αυτή ακριβώς είναι η κλάση που λύνει.',
  },

  // ── (iii) Δέντρο (ριζωμένο, κατευθυνόμενο) ───────────────────────────────
  tree: {
    caption:
      'Ριζωμένο κατευθυνόμενο δέντρο: όλες οι ακμές γονιός → παιδί. Είναι ειδική περίπτωση DAG (καμία αναφορά πίσω σε προγόνους), άρα η τοπολογική ταξινόμηση δουλεύει — η ρίζα πρώτη, τα φύλλα τελευταία.',
    vertices: [
      { id: 'r', x: 210, y: 35 },
      { id: 'a', x: 110, y: 110 },
      { id: 'b', x: 310, y: 110 },
      { id: 'c', x: 60, y: 180 },
      { id: 'd', x: 160, y: 180 },
      { id: 'e', x: 260, y: 180 },
      { id: 'f', x: 360, y: 180 },
    ],
    edges: [
      { from: 'r', to: 'a' },
      { from: 'r', to: 'b' },
      { from: 'a', to: 'c' },
      { from: 'a', to: 'd' },
      { from: 'b', to: 'e' },
      { from: 'b', to: 'f' },
    ],
    topoOrder: ['r', 'a', 'b', 'c', 'd', 'e', 'f'],
    stuckVertices: [],
    verdict: 'ok',
    reason:
      'Η ρίζα έχει εσώβαθμο 0 και βγαίνει πρώτη· κάθε επόμενο επίπεδο γίνεται διαθέσιμο όταν φύγει ο γονιός του. Σε ένα δέντρο η σειρά είναι ουσιαστικά «BFS από τη ρίζα».',
  },

  // ── (iv) Διμερές γράφημα (κατευθυνόμενο) ─────────────────────────────────
  bipartite: {
    caption:
      'Κατευθυνόμενο διμερές γράφημα — οι κορυφές χωρίζονται σε δύο χρωματικές κλάσεις (μωβ Α και πορτοκαλί Β), και κάθε ακμή πηγαίνει από Α σε Β ή το αντίθετο. ΑΛΛΑ: ο 4-κύκλος A1 → B1 → A2 → B2 → A1 είναι έγκυρος διμερής κύκλος (άρτιο μήκος).',
    vertices: [
      { id: 'A1', x: 90, y: 60, group: 'A' },
      { id: 'A2', x: 90, y: 170, group: 'A' },
      { id: 'B1', x: 270, y: 60, group: 'B' },
      { id: 'B2', x: 270, y: 170, group: 'B' },
      { id: 'A3', x: 370, y: 115, group: 'A' },
    ],
    edges: [
      { from: 'A1', to: 'B1' },
      { from: 'B1', to: 'A2' },
      { from: 'A2', to: 'B2' },
      { from: 'B2', to: 'A1' }, // closes the 4-cycle
      { from: 'B1', to: 'A3' },
    ],
    topoOrder: null,
    stuckVertices: ['A1', 'A2', 'B1', 'B2'],
    verdict: 'fail',
    reason:
      'Διμερές δεν σημαίνει άκυκλο — οι άρτιοι κύκλοι επιτρέπονται. Ο 4-κύκλος εδώ μπλοκάρει την τοπολογική ταξινόμηση. Αρκεί ΕΝΑ τέτοιο γράφημα για «όχι πάντα».',
  },
}

const CLASS_TABS: { id: ClassId; label: string; sub: string }[] = [
  { id: 'weights', label: '(i) Με θετικά βάρη', sub: 'fail' },
  { id: 'dag', label: '(ii) DAG', sub: 'ok' },
  { id: 'tree', label: '(iii) Δέντρο', sub: 'ok' },
  { id: 'bipartite', label: '(iv) Διμερές', sub: 'fail' },
]

type Phase = {
  /** vertices already pulled into the order, in pull-order */
  ordered: string[]
  /** in-degree of each vertex AFTER this phase */
  inDeg: Record<string, number>
  /** vertex pulled this step (null on step 0 and on the final fail-step) */
  pulled: string | null
  /** edges «greyed out» — i.e. removed because their source is in `ordered` */
  removedEdges: Set<string>
  /** at the final step, whether we got stuck (cycle) */
  stuck: boolean
}

function edgeKey(e: Edge) {
  return `${e.from}->${e.to}`
}

function buildPhases(inst: Instance): Phase[] {
  const inDeg0: Record<string, number> = {}
  inst.vertices.forEach((v) => (inDeg0[v.id] = 0))
  inst.edges.forEach((e) => (inDeg0[e.to] = (inDeg0[e.to] ?? 0) + 1))

  const phases: Phase[] = []
  // Phase 0 = initial state
  phases.push({
    ordered: [],
    inDeg: { ...inDeg0 },
    pulled: null,
    removedEdges: new Set(),
    stuck: false,
  })

  if (inst.topoOrder) {
    const inDeg = { ...inDeg0 }
    const removedEdges = new Set<string>()
    const ordered: string[] = []
    for (const v of inst.topoOrder) {
      ordered.push(v)
      inst.edges
        .filter((e) => e.from === v)
        .forEach((e) => {
          removedEdges.add(edgeKey(e))
          inDeg[e.to] = (inDeg[e.to] ?? 0) - 1
        })
      phases.push({
        ordered: [...ordered],
        inDeg: { ...inDeg },
        pulled: v,
        removedEdges: new Set(removedEdges),
        stuck: false,
      })
    }
    return phases
  }

  // Cycle case: peel sources greedily until none remain
  const inDeg = { ...inDeg0 }
  const removedEdges = new Set<string>()
  const ordered: string[] = []
  // Snapshot vertex order for deterministic pulls
  const vertexOrder = inst.vertices.map((v) => v.id)
  while (true) {
    const next = vertexOrder.find((v) => !ordered.includes(v) && (inDeg[v] ?? 0) === 0)
    if (!next) break
    ordered.push(next)
    inst.edges
      .filter((e) => e.from === next)
      .forEach((e) => {
        removedEdges.add(edgeKey(e))
        inDeg[e.to] = (inDeg[e.to] ?? 0) - 1
      })
    phases.push({
      ordered: [...ordered],
      inDeg: { ...inDeg },
      pulled: next,
      removedEdges: new Set(removedEdges),
      stuck: false,
    })
  }
  // Final phase: stuck (no source remaining, but vertices left)
  phases.push({
    ordered: [...ordered],
    inDeg: { ...inDeg },
    pulled: null,
    removedEdges: new Set(removedEdges),
    stuck: true,
  })
  return phases
}

export function TopoSortClassMatrix() {
  const [active, setActive] = useState<ClassId>('weights')
  const [step, setStep] = useState(0)

  const inst = INSTANCES[active]
  const phases = useMemo(() => buildPhases(inst), [inst])
  const last = phases.length - 1
  const phase = phases[step]
  const done = step === last

  function pick(id: ClassId) {
    setActive(id)
    setStep(0)
  }

  let note: string
  if (step === 0) {
    note = `${inst.caption} Πάτα «Επόμενο» για να εκτελέσεις τον αλγόριθμο τοπολογικής ταξινόμησης — σε κάθε βήμα βγάζει μια κορυφή με εσώβαθμο 0.`
  } else if (!done) {
    const justPulled = phase.pulled
    note = `Βήμα ${step}: η κορυφή ${justPulled} έχει εσώβαθμο 0 → την βγάζουμε και την βάζουμε ${step}η στη σειρά. Οι εξερχόμενες ακμές της αφαιρούνται· οι εσώβαθμοι των γειτόνων μειώνονται.`
  } else if (phase.stuck) {
    const stuck = inst.stuckVertices.join(', ')
    note = `Καμία κορυφή με εσώβαθμο 0 δεν απομένει — ο αλγόριθμος κολλάει. Οι κορυφές {${stuck}} σχηματίζουν κύκλο. ${inst.reason}`
  } else {
    note = `Όλες οι κορυφές μπήκαν στη σειρά: ${phase.ordered.join(' → ')}. ${inst.reason}`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τοπολογική ταξινόμηση ανά κλάση
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {CLASS_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t.id)}
              className={cn(
                'rounded px-2 py-1 text-xs font-medium transition-colors',
                active === t.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  'ml-1.5 inline-block rounded-full px-1.5 py-px text-[10px] font-bold',
                  t.sub === 'ok'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800',
                )}
              >
                {t.sub === 'ok' ? '✓' : '✗'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <GraphSvg inst={inst} phase={phase} />

      {/* in-degree row + order ledger */}
      <div className="mt-2 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Εσώβαθμος (count)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {inst.vertices.map((v) => {
              const inOrdered = phase.ordered.includes(v.id)
              const isSource = !inOrdered && (phase.inDeg[v.id] ?? 0) === 0
              return (
                <span
                  key={v.id}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-mono',
                    inOrdered && 'border-emerald-300 bg-emerald-50 text-emerald-700 line-through',
                    !inOrdered && isSource && 'border-amber-400 bg-amber-50 text-amber-700',
                    !inOrdered && !isSource && 'border-border bg-bg text-fg-muted',
                  )}
                >
                  <span className="font-semibold">{v.id}</span>
                  <span>=</span>
                  <span>{phase.inDeg[v.id] ?? 0}</span>
                </span>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Σειρά (μέχρι τώρα)
          </div>
          <div className="flex min-h-[1.75rem] flex-wrap items-center gap-1.5 font-mono text-xs">
            {phase.ordered.length === 0 ? (
              <span className="italic text-fg-subtle">κενή</span>
            ) : (
              phase.ordered.map((v, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                    {v}
                  </span>
                  {i < phase.ordered.length - 1 && (
                    <span className="px-1 text-fg-subtle">→</span>
                  )}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fg-muted">{note}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Προηγ.
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(last, step + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          Επόμ. <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg-muted hover:bg-bg-soft"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Βήμα {step} / {last}
        </span>
        {done && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider',
              inst.verdict === 'ok' && 'bg-emerald-100 text-emerald-800',
              inst.verdict === 'fail' && 'bg-rose-100 text-rose-800',
            )}
          >
            {inst.verdict === 'ok'
              ? '✓ Επιστρέφει σωστή διάταξη'
              : '✗ Κολλάει — υπάρχει κύκλος'}
          </span>
        )}
      </div>
    </section>
  )
}

// ── SVG renderer ────────────────────────────────────────────────────────────

function GraphSvg({ inst, phase }: { inst: Instance; phase: Phase }) {
  const W = 440
  const H = 220
  const r = 18

  const vertexById = Object.fromEntries(inst.vertices.map((v) => [v.id, v]))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full rounded-lg border border-border bg-bg"
      role="img"
      aria-label="Κατευθυνόμενο γράφημα"
    >
      <defs>
        <marker
          id="topo-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
        </marker>
        <marker
          id="topo-arrow-faded"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#cbd5e1" />
        </marker>
        <marker
          id="topo-arrow-cycle"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#dc2626" />
        </marker>
      </defs>

      {/* edges */}
      {inst.edges.map((e, i) => {
        const a = vertexById[e.from]
        const b = vertexById[e.to]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.sqrt(dx * dx + dy * dy)
        const ux = dx / len
        const uy = dy / len
        const x1 = a.x + ux * r
        const y1 = a.y + uy * r
        const x2 = b.x - ux * (r + 4)
        const y2 = b.y - uy * (r + 4)
        const removed = phase.removedEdges.has(edgeKey(e))
        const sourceOrdered = phase.ordered.includes(e.from)
        const targetOrdered = phase.ordered.includes(e.to)
        // Stuck edges (cycle) at end: still active, mark in red
        const stuck =
          phase.stuck && !sourceOrdered && !targetOrdered
        const color = removed
          ? '#cbd5e1'
          : stuck
            ? '#dc2626'
            : '#475569'
        const marker = removed
          ? 'url(#topo-arrow-faded)'
          : stuck
            ? 'url(#topo-arrow-cycle)'
            : 'url(#topo-arrow)'
        // mid label position for weight
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={stuck ? 2.5 : 1.6}
              markerEnd={marker}
              strokeDasharray={removed ? '4 3' : undefined}
            />
            {e.weight !== undefined && (
              <text
                x={mx + 6}
                y={my - 4}
                textAnchor="middle"
                className="select-none"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill={removed ? '#94a3b8' : '#475569'}
              >
                {e.weight}
              </text>
            )}
          </g>
        )
      })}

      {/* vertices */}
      {inst.vertices.map((v) => {
        const inOrdered = phase.ordered.includes(v.id)
        const justPulled = phase.pulled === v.id
        const isSource = !inOrdered && (phase.inDeg[v.id] ?? 0) === 0
        const stuck = phase.stuck && !inOrdered
        let fill = '#ffffff'
        let stroke = '#94a3b8'
        if (inOrdered) {
          fill = '#d1fae5' // emerald-100
          stroke = '#10b981'
        } else if (stuck) {
          fill = '#fee2e2' // rose-100
          stroke = '#dc2626'
        } else if (isSource) {
          fill = '#fef3c7'
          stroke = '#d97706'
        }
        if (v.group === 'A' && !inOrdered && !stuck) {
          fill = isSource ? '#fef3c7' : '#ede9fe' // violet-100
          stroke = isSource ? '#d97706' : '#8b5cf6'
        } else if (v.group === 'B' && !inOrdered && !stuck) {
          fill = isSource ? '#fef3c7' : '#ffedd5' // orange-100
          stroke = isSource ? '#d97706' : '#fb923c'
        }
        return (
          <g key={v.id}>
            <circle
              cx={v.x}
              cy={v.y}
              r={r}
              fill={fill}
              stroke={stroke}
              strokeWidth={justPulled ? 3 : 1.8}
            />
            <text
              x={v.x}
              y={v.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight={600}
              className="select-none"
              fill="#0f172a"
            >
              {v.id}
            </text>
          </g>
        )
      })}

      {/* bipartition tag for tab iv */}
      {inst.vertices.some((v) => v.group) && (
        <g transform="translate(8, 8)">
          <rect
            x={0}
            y={0}
            width={108}
            height={16}
            rx={3}
            fill="#f1f5f9"
            stroke="#cbd5e1"
          />
          <circle cx={10} cy={8} r={4} fill="#ede9fe" stroke="#8b5cf6" />
          <text x={18} y={11} fontSize="9" fill="#475569">
            Α
          </text>
          <circle cx={42} cy={8} r={4} fill="#ffedd5" stroke="#fb923c" />
          <text x={50} y={11} fontSize="9" fill="#475569">
            Β
          </text>
          <text x={62} y={11} fontSize="9" fill="#475569">
            (διμερές)
          </text>
        </g>
      )}
    </svg>
  )
}
