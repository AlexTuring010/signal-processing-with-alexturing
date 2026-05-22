'use client'

/**
 * RecursionExplosion — the same Fibonacci recursion tree, naive vs memoized.
 *
 * The single most important picture in the whole DP chapter: a student who
 * does not *feel* the naive tree exploding will never appreciate why
 * memoization matters. Two coupled controls do all the teaching:
 *
 *  - the n slider grows the tree and the call counters at the same time;
 *  - the naive ⇄ memoized toggle keeps n fixed and lets the student watch the
 *    SAME tree collapse from a bushy exponential mess into a thin linear spine
 *    with green «cache hit» stubs.
 *
 * Clicking any node lights up every other call of the same fib(k): in naive
 * mode that is overlapping subproblems made visible; in memoized mode it is
 * one real computation plus a handful of instant cache hits. A growth table
 * carries the feeling past the drawable range — fib(30) is 2.7 million naive
 * calls against 59 memoized. Built for L14.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'naive' | 'memo'
type Kind = 'compute' | 'hit' | 'base'

type FibNode = {
  uid: string
  k: number
  depth: number
  kind: Kind
  children: FibNode[]
}

const N_MIN = 3
const N_MAX = 7

const SLOT_W = 34
const LEVEL_H = 56
const R = 15
const MARGIN = 26

/** Build the full naive recursion tree for fib(n) — every call is a node. */
function buildNaive(n: number): FibNode {
  let counter = 0
  function rec(k: number, depth: number): FibNode {
    const uid = `x${counter++}`
    if (k <= 1) return { uid, k, depth, kind: 'base', children: [] }
    return {
      uid,
      k,
      depth,
      kind: 'compute',
      children: [rec(k - 1, depth + 1), rec(k - 2, depth + 1)],
    }
  }
  return rec(n, 0)
}

/**
 * Build the memoized recursion tree for fib(n): the first request for a value
 * recurses, every later request is a cache hit — a leaf with no subtree.
 */
function buildMemo(n: number): FibNode {
  const computed = new Set<number>()
  let counter = 0
  function rec(k: number, depth: number): FibNode {
    const uid = `x${counter++}`
    if (computed.has(k)) return { uid, k, depth, kind: 'hit', children: [] }
    computed.add(k)
    if (k <= 1) return { uid, k, depth, kind: 'base', children: [] }
    return {
      uid,
      k,
      depth,
      kind: 'compute',
      children: [rec(k - 1, depth + 1), rec(k - 2, depth + 1)],
    }
  }
  return rec(n, 0)
}

/** Naive call count for fib(n): nodes(k) = 1 + nodes(k−1) + nodes(k−2). */
function naiveCalls(n: number): number {
  const c = [1, 1]
  for (let k = 2; k <= n; k++) c[k] = 1 + c[k - 1] + c[k - 2]
  return c[n]
}

/** Memoized call count for fib(n): n+1 real computations + (n−2) cache hits. */
function memoCalls(n: number): number {
  return n <= 1 ? 1 : 2 * n - 1
}

type Positioned = { uid: string; k: number; depth: number; kind: Kind; x: number; y: number }

/** Assign x to leaves left-to-right, internal nodes at the midpoint of children. */
function layoutTree(root: FibNode) {
  const pos = new Map<string, { x: number; y: number }>()
  let slot = 0
  function assign(node: FibNode): number {
    let x: number
    if (node.children.length === 0) {
      x = slot * SLOT_W
      slot += 1
    } else {
      const xs = node.children.map(assign)
      x = (xs[0] + xs[xs.length - 1]) / 2
    }
    pos.set(node.uid, { x, y: node.depth * LEVEL_H })
    return x
  }
  assign(root)

  const nodes: Positioned[] = []
  const edges: { from: string; to: string }[] = []
  function walk(node: FibNode) {
    const p = pos.get(node.uid)!
    nodes.push({ uid: node.uid, k: node.k, depth: node.depth, kind: node.kind, x: p.x, y: p.y })
    for (const c of node.children) {
      edges.push({ from: node.uid, to: c.uid })
      walk(c)
    }
  }
  walk(root)
  return { nodes, edges }
}

const GROWTH_ROWS = [10, 20, 30]

export function RecursionExplosion() {
  const [n, setN] = useState(5)
  const [mode, setMode] = useState<Mode>('naive')
  const [selectedK, setSelectedK] = useState<number | null>(null)

  const { nodes, edges } = useMemo(
    () => layoutTree(mode === 'naive' ? buildNaive(n) : buildMemo(n)),
    [n, mode],
  )
  const posByUid = useMemo(() => {
    const m = new Map<string, Positioned>()
    for (const nd of nodes) m.set(nd.uid, nd)
    return m
  }, [nodes])

  const naive = naiveCalls(n)
  const memo = memoCalls(n)
  const ratio = memo > 0 ? naive / memo : 1
  const ratioLabel = ratio >= 10 ? Math.round(ratio).toString() : (Math.round(ratio * 10) / 10).toString()

  const maxX = Math.max(...nodes.map((nd) => nd.x))
  const maxY = Math.max(...nodes.map((nd) => nd.y))
  const vbW = maxX + 2 * MARGIN
  const vbH = maxY + 2 * MARGIN

  const sameK = selectedK == null ? [] : nodes.filter((nd) => nd.k === selectedK)
  const selCount = sameK.length
  const selHits = sameK.filter((nd) => nd.kind === 'hit').length

  function changeN(value: number) {
    setN(value)
    setSelectedK(null)
  }
  function changeMode(m: Mode) {
    setMode(m)
    setSelectedK(null)
  }
  function reset() {
    setN(5)
    setMode('naive')
    setSelectedK(null)
  }

  let note: string
  if (selectedK != null) {
    if (mode === 'naive') {
      note =
        selCount > 1
          ? `Το fib(${selectedK}) υπολογίζεται ${selCount} φορές μέσα σ' αυτό το δέντρο — και κάθε φορά ξεκινά τον υπολογισμό απ' το μηδέν. Αυτή ακριβώς είναι η επικάλυψη υποπροβλημάτων που κάνει την αφελή αναδρομή εκθετική.`
          : `Το fib(${selectedK}) εμφανίζεται μόνο μία φορά εδώ — από τους λίγους κόμβους που δεν επαναλαμβάνονται. Πάτησε ένα μικρότερο k για να δεις την επικάλυψη.`
    } else {
      const hits = selHits
      note =
        hits > 0
          ? `Το fib(${selectedK}) υπολογίζεται μία μόνο φορά. Ζητείται άλλες ${hits} ${hits === 1 ? 'φορά' : 'φορές'} — και κάθε φορά είναι cache hit (πράσινος κόμβος): η τιμή επιστρέφεται αμέσως, χωρίς κανένα υποδέντρο από κάτω.`
          : `Το fib(${selectedK}) υπολογίζεται μία φορά και εδώ ζητείται μόνο μία φορά — δεν χρειάστηκε cache hit.`
    }
  } else if (mode === 'naive') {
    note =
      'Κάθε κύκλος είναι μία κλήση της fib(). Το δέντρο σχεδόν διπλασιάζεται σε κάθε επίπεδο, γιατί το ίδιο fib(k) ξαναϋπολογίζεται απ’ την αρχή ξανά και ξανά. Πάτησε έναν κόμβο για να το δεις — ή γύρνα στο «Memoized».'
  } else {
    note =
      'Με memoization κάθε fib(k) υπολογίζεται μία μόνο φορά. Κάθε επόμενη φορά που ζητείται, η τιμή επιστρέφεται έτοιμη από τον πίνακα — ο πράσινος κόμβος «cache hit», χωρίς υποδέντρο. Το ίδιο n, αλλά το δέντρο κατέρρευσε.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + mode tabs */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το δέντρο αναδρομής του Fibonacci
        </div>
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {(['naive', 'memo'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => changeMode(m)}
              className={cn(
                'rounded px-2.5 py-0.5 text-xs font-medium transition-colors',
                mode === m
                  ? m === 'naive'
                    ? 'bg-danger text-white'
                    : 'bg-success text-white'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {m === 'naive' ? 'Αφελής' : 'Memoized'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Σύρε το <span className="font-semibold text-fg">n</span> και δες το δέντρο
        κλήσεων. Πάτησε έναν κόμβο για να φωτιστεί κάθε άλλη κλήση του ίδιου fib(k).
      </p>

      {/* n slider */}
      <div className="mb-3 flex items-center gap-3">
        <span className="shrink-0 font-mono text-sm font-bold text-fg">
          fib(<span className="text-accent">{n}</span>)
        </span>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          value={n}
          aria-label="Τιμή του n"
          onChange={(e) => changeN(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
        <span className="shrink-0 text-xs text-fg-subtle">n = {n}</span>
      </div>

      {/* the recursion tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${Math.max(vbW, 280)}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {edges.map((e) => {
            const a = posByUid.get(e.from)!
            const b = posByUid.get(e.to)!
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x + MARGIN}
                y1={a.y + MARGIN}
                x2={b.x + MARGIN}
                y2={b.y + MARGIN}
                stroke="#b6a6a8"
                strokeWidth={1.6}
              />
            )
          })}

          {/* nodes */}
          {nodes.map((nd) => {
            const isSel = selectedK != null && nd.k === selectedK
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            if (nd.kind === 'base') {
              fill = '#f1eae4'
              stroke = '#b6a6a8'
            }
            if (nd.kind === 'hit') {
              fill = '#dcfce7'
              stroke = '#16a34a'
            }
            if (isSel) {
              fill = '#fde68a'
              stroke = '#d97706'
            }
            return (
              <g
                key={nd.uid}
                role="button"
                tabIndex={0}
                aria-label={`fib(${nd.k})${nd.kind === 'hit' ? ', cache hit' : ''}`}
                onClick={() => setSelectedK((cur) => (cur === nd.k ? null : nd.k))}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    setSelectedK((cur) => (cur === nd.k ? null : nd.k))
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {isSel && (
                  <circle
                    cx={nd.x + MARGIN}
                    cy={nd.y + MARGIN}
                    r={R + 4}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={2.4}
                  />
                )}
                <circle
                  cx={nd.x + MARGIN}
                  cy={nd.y + MARGIN}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.2}
                />
                <text
                  x={nd.x + MARGIN}
                  y={nd.y + MARGIN}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  F{nd.k}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-[#9b8a8d] bg-white align-middle" />
          νέος υπολογισμός
        </span>
        {mode === 'memo' && (
          <span>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border border-[#16a34a] bg-[#dcfce7] align-middle" />
            cache hit — έτοιμη τιμή
          </span>
        )}
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full border-2 border-[#d97706] bg-[#fde68a] align-middle" />
          επιλεγμένο fib(k)
        </span>
      </div>

      {/* dual call counter */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            mode === 'naive' ? 'border-danger/50 bg-danger/10' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Αφελής αναδρομή
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {naive.toLocaleString('el')}
          </div>
          <div className="text-xs text-fg-subtle">κλήσεις της fib()</div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            mode === 'memo' ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Με memoization
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {memo.toLocaleString('el')}
          </div>
          <div className="text-xs text-fg-subtle">κλήσεις της fib()</div>
        </div>
      </div>
      <p className="mt-1.5 text-center text-xs text-fg-muted">
        Για fib({n}) το memoization κάνει{' '}
        <span className="font-bold text-accent">{ratioLabel}×</span> λιγότερες κλήσεις.
      </p>

      {/* growth table — past the drawable range */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πέρα από το δέντρο — πόσες κλήσεις χρειάζονται
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="py-1.5 pr-3 font-semibold">fib(n)</th>
              <th className="py-1.5 pr-3 text-right font-semibold">Αφελής</th>
              <th className="py-1.5 text-right font-semibold">Memoization</th>
            </tr>
          </thead>
          <tbody>
            {GROWTH_ROWS.map((gn) => (
              <tr key={gn} className="border-b border-border/60">
                <td className="py-1.5 pr-3 font-mono tabular-nums text-fg">fib({gn})</td>
                <td className="py-1.5 pr-3 text-right font-mono font-semibold tabular-nums text-danger">
                  {naiveCalls(gn).toLocaleString('el')}
                </td>
                <td className="py-1.5 text-right font-mono font-semibold tabular-nums text-success">
                  {memoCalls(gn).toLocaleString('el')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-1 text-xs text-fg-subtle">
          Αφελής: εκθετική, ≈ 2ⁿ. Memoization: γραμμική, 2n−1. Στο fib(30) η διαφορά
          είναι ήδη εκατομμύρια προς δεκάδες.
        </p>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* reset */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Επαναφορά
        </button>
      </div>
    </section>
  )
}
