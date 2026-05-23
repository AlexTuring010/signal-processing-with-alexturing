'use client'

/**
 * GreedyColoringOrders — η σειρά αλλάζει το αποτέλεσμα.
 *
 * Front-set-6-ask8 (μέρος 1): the greedy graph coloring depends entirely on
 * vertex order. This viz fixes a single 6-vertex graph and offers three
 * orderings; the same first-available-color rule produces 3 colors on one
 * order and 4 on another. Step-by-step assignment with the current vertex
 * highlighted, neighbor colors banned in the palette, and a chromatic-bar
 * tracker at the bottom. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type V = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

const POS: Record<V, [number, number]> = {
  A: [110, 70],
  B: [240, 40],
  C: [370, 70],
  D: [370, 200],
  E: [240, 230],
  F: [110, 200],
}

const EDGES: [V, V][] = [
  ['A', 'B'],
  ['B', 'C'],
  ['C', 'D'],
  ['D', 'E'],
  ['E', 'F'],
  ['F', 'A'],
  ['A', 'D'], // long diagonal
  ['B', 'E'], // long diagonal
]

const NEIGHBOURS: Record<V, V[]> = (() => {
  const m: Record<V, V[]> = { A: [], B: [], C: [], D: [], E: [], F: [] }
  for (const [u, v] of EDGES) {
    m[u].push(v)
    m[v].push(u)
  }
  return m
})()

type OrderKey = 'good' | 'bad' | 'worst'
const ORDERS: Record<OrderKey, { label: string; order: V[]; tooltip: string }> = {
  good: {
    label: 'Καλή σειρά (3 χρώματα)',
    order: ['A', 'C', 'E', 'B', 'D', 'F'],
    tooltip:
      'A,C,E ταξινομούνται μη γειτονικά → ίδιο χρώμα 1. Μετά B,D,F παίρνουν τα δύο επόμενα χρώματα.',
  },
  bad: {
    label: 'Κακή σειρά (4 χρώματα)',
    order: ['A', 'B', 'C', 'D', 'E', 'F'],
    tooltip:
      'Η σειρά «αλφαβητικά» αναγκάζει το D να βρει 4ο χρώμα — οι γείτονές του (A, C, E) έχουν ήδη πιάσει 3 διαφορετικά.',
  },
  worst: {
    label: 'Χειρότερη σειρά (4 χρώματα)',
    order: ['A', 'D', 'B', 'E', 'C', 'F'],
    tooltip:
      'Πιάνει πρώτα τις δύο «διαγώνιες»: A,D παίρνουν διαφορετικά χρώματα, B,E επίσης. Τότε το C βλέπει γείτονες σε τρία χρώματα και πιάνει ένα 4ο.',
  },
}

const PALETTE = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']
const PALETTE_NAMES = ['κόκκινο', 'μπλε', 'πράσινο', 'κίτρινο', 'μωβ']

type StepInfo = {
  /** vertex assigned at this step */
  v: V
  /** color index 0..3 picked */
  color: number
  /** color indices banned because of neighbors */
  banned: number[]
  note: string
}

function runGreedy(order: V[]): StepInfo[] {
  const color: Partial<Record<V, number>> = {}
  const out: StepInfo[] = []
  for (const v of order) {
    const banned = NEIGHBOURS[v]
      .map((n) => color[n])
      .filter((c) => c !== undefined) as number[]
    const bannedSet = new Set(banned)
    let c = 0
    while (bannedSet.has(c)) c++
    color[v] = c
    out.push({
      v,
      color: c,
      banned: [...new Set(banned)].sort((a, b) => a - b),
      note: makeNote(v, c, banned),
    })
  }
  return out
}

function makeNote(v: V, c: number, banned: number[]): string {
  const usedColors = new Set(banned)
  if (usedColors.size === 0) {
    return `Κορυφή ${v}: κανείς γείτονας δεν έχει χρωματιστεί ακόμα — παίρνει χρώμα ${PALETTE_NAMES[c]} (το πρώτο διαθέσιμο).`
  }
  const bannedNames = banned.map((b) => PALETTE_NAMES[b]).join(', ')
  return `Κορυφή ${v}: οι γείτονές της έχουν ήδη πάρει ${bannedNames}. Το μικρότερο χρώμα που μένει είναι το ${PALETTE_NAMES[c]}.`
}

const VIEW_W = 480
const VIEW_H = 280

export function GreedyColoringOrders() {
  const [orderKey, setOrderKey] = useState<OrderKey>('good')
  const [step, setStep] = useState(0)

  const conf = ORDERS[orderKey]
  const steps = useMemo(() => runGreedy(conf.order), [conf.order])
  const last = steps.length
  const done = step === last
  const numColors = Math.max(...steps.map((s) => s.color)) + 1

  function pick(k: OrderKey) {
    setOrderKey(k)
    setStep(0)
  }

  const assigned: Partial<Record<V, number>> = {}
  steps.slice(0, step).forEach((s) => {
    assigned[s.v] = s.color
  })
  const cur = step > 0 ? steps[step - 1] : null

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Άπληστος χρωματισμός — η σειρά καθορίζει το αποτέλεσμα
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {(Object.keys(ORDERS) as OrderKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pick(k)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                orderKey === k
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {ORDERS[k].label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ίδιος γράφος, ίδιος κανόνας («μικρότερο διαθέσιμο»). Άλλαξε σειρά και δες
        πόσα χρώματα χρειάστηκαν.
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {EDGES.map(([u, v], i) => (
            <line
              key={i}
              x1={POS[u][0]}
              y1={POS[u][1]}
              x2={POS[v][0]}
              y2={POS[v][1]}
              stroke="#cbd5e1"
              strokeWidth={2}
            />
          ))}
          {/* vertices */}
          {(Object.keys(POS) as V[]).map((v) => {
            const c = assigned[v]
            const isCur = cur?.v === v
            const fill = c !== undefined ? PALETTE[c] : '#ffffff'
            const stroke = isCur ? '#d97706' : c !== undefined ? PALETTE[c] : '#9b8a8d'
            return (
              <g key={v}>
                <circle
                  cx={POS[v][0]}
                  cy={POS[v][1]}
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCur ? 4 : 2.5}
                />
                <text
                  x={POS[v][0]}
                  y={POS[v][1] + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={700}
                  fill={c !== undefined ? '#ffffff' : '#1c1214'}
                >
                  {v}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* palette + banned */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-fg-subtle">
          Παλέτα
        </span>
        {PALETTE.slice(0, Math.max(numColors, 4)).map((p, i) => {
          const banned = cur?.banned.includes(i)
          const picked = cur?.color === i
          return (
            <span
              key={i}
              className={cn(
                'inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-medium',
                banned && 'opacity-40 line-through',
                picked && 'ring-2 ring-amber-500',
              )}
              style={{ backgroundColor: p, color: 'white' }}
            >
              {i + 1}
            </span>
          )
        })}
        <span className="ml-2 text-fg-subtle">
          σειρά εξέτασης: {conf.order.join(' → ')}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">
        {cur ? cur.note : conf.tooltip}
      </p>

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
              numColors <= 3
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800',
            )}
          >
            {numColors} χρώμα{numColors === 1 ? '' : 'τα'} —{' '}
            {numColors <= 3 ? 'βέλτιστο' : 'χάνει'}
          </span>
        )}
      </div>
    </section>
  )
}
