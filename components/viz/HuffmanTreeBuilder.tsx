'use client'

/**
 * HuffmanTreeBuilder — the greedy merge, step by step.
 *
 * Each step takes the two lowest-frequency trees from the pool and merges
 * them under a new internal node. The tree assembles bottom-up; the pool
 * row below shrinks as it goes. When one tree remains, the prefix codes
 * appear — short for frequent characters, long for rare ones. Built for
 * L13, on the lecture's own a/b/c/d/e/f instance.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type HNode = {
  id: string
  freq: number
  x: number
  y: number
  char?: string
  code?: string
}

const NODES: Record<string, HNode> = {
  a: { id: 'a', freq: 45, x: 60, y: 118, char: 'a', code: '0' },
  c: { id: 'c', freq: 12, x: 148, y: 266, char: 'c', code: '100' },
  b: { id: 'b', freq: 13, x: 236, y: 266, char: 'b', code: '101' },
  f: { id: 'f', freq: 5, x: 324, y: 340, char: 'f', code: '1100' },
  e: { id: 'e', freq: 9, x: 412, y: 340, char: 'e', code: '1101' },
  d: { id: 'd', freq: 16, x: 500, y: 266, char: 'd', code: '111' },
  n14: { id: 'n14', freq: 14, x: 368, y: 266 },
  n25: { id: 'n25', freq: 25, x: 192, y: 192 },
  n30: { id: 'n30', freq: 30, x: 434, y: 192 },
  n55: { id: 'n55', freq: 55, x: 313, y: 118 },
  root: { id: 'root', freq: 100, x: 187, y: 44 },
}

/** Merges in the order Huffman performs them; `a` is the left (0) child. */
const MERGES: { id: string; a: string; b: string }[] = [
  { id: 'n14', a: 'f', b: 'e' },
  { id: 'n25', a: 'c', b: 'b' },
  { id: 'n30', a: 'n14', b: 'd' },
  { id: 'n55', a: 'n25', b: 'n30' },
  { id: 'root', a: 'a', b: 'n55' },
]

const LEAVES = ['a', 'b', 'c', 'd', 'e', 'f']

/** The pool of root frequencies after k merges, ascending. */
const POOL: { freq: number; char?: string }[][] = [
  [
    { freq: 5, char: 'f' },
    { freq: 9, char: 'e' },
    { freq: 12, char: 'c' },
    { freq: 13, char: 'b' },
    { freq: 16, char: 'd' },
    { freq: 45, char: 'a' },
  ],
  [
    { freq: 12, char: 'c' },
    { freq: 13, char: 'b' },
    { freq: 14 },
    { freq: 16, char: 'd' },
    { freq: 45, char: 'a' },
  ],
  [{ freq: 14 }, { freq: 16, char: 'd' }, { freq: 25 }, { freq: 45, char: 'a' }],
  [{ freq: 25 }, { freq: 30 }, { freq: 45, char: 'a' }],
  [{ freq: 45, char: 'a' }, { freq: 55 }],
  [{ freq: 100 }],
]

const describe = (id: string) => {
  const n = NODES[id]
  return n.char ? `${n.char} (${n.freq})` : `υποδέντρο ${n.freq}`
}

export function HuffmanTreeBuilder() {
  const [step, setStep] = useState(0)
  const last = MERGES.length // 5
  const done = step === last

  /** internal node id → its merge index (0-based) */
  const mergeIndex = new Map(MERGES.map((m, i) => [m.id, i]))
  const visible = (id: string) =>
    LEAVES.includes(id) || (mergeIndex.get(id) ?? Infinity) < step
  const cur = step > 0 ? MERGES[step - 1] : null
  const hot = new Set(cur ? [cur.id, cur.a, cur.b] : [])

  let note: string
  if (step === 0) {
    note =
      'Έξι χαρακτήρες με τις συχνότητές τους. Ο αλγόριθμος συγχωνεύει επανειλημμένα τα δύο σπανιότερα δέντρα του pool. Πρώτο ζευγάρι: f (5) και e (9).'
  } else {
    const m = cur as { id: string; a: string; b: string }
    note =
      `Συγχώνευση ${step}: ενώνουμε ${describe(m.a)} και ${describe(m.b)} κάτω από νέο κόμβο συχνότητας ${NODES[m.id].freq}. ` +
      (done
        ? 'Έμεινε ένα δέντρο — η κωδικοποίηση Huffman είναι έτοιμη.'
        : 'Επόμενο: τα δύο σπανιότερα δέντρα που μένουν στο pool.')
  }

  const pool = POOL[step]

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Huffman βήμα-βήμα — συγχώνευσε τα δύο σπανιότερα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? 'Έτοιμο' : `Συγχώνευση ${step}/${last}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Το δέντρο χτίζεται από κάτω προς τα πάνω· οι κωδικοί εμφανίζονται στο τέλος.
      </p>

      {/* the tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox="0 0 560 396"
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {MERGES.map((m, i) => {
            if (i >= step) return null
            const parent = NODES[m.id]
            return [m.a, m.b].map((childId, ci) => {
              const child = NODES[childId]
              const mx = (parent.x + child.x) / 2
              const my = (parent.y + child.y) / 2
              return (
                <g key={`${m.id}-${childId}`}>
                  <line
                    x1={parent.x}
                    y1={parent.y}
                    x2={child.x}
                    y2={child.y}
                    stroke={hot.has(m.id) ? '#9f1239' : '#9b8a8d'}
                    strokeWidth={hot.has(m.id) ? 3 : 1.8}
                  />
                  <text
                    x={mx}
                    y={my}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight={800}
                    fill="#9f1239"
                  >
                    {ci === 0 ? '0' : '1'}
                  </text>
                </g>
              )
            })
          })}

          {/* nodes */}
          {Object.values(NODES).map((n) => {
            if (!visible(n.id)) return null
            const isLeaf = !!n.char
            const isHot = hot.has(n.id)
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isLeaf ? 23 : 20}
                  fill={isLeaf ? '#fde2e4' : isHot ? '#9f1239' : '#ffffff'}
                  stroke={isHot ? '#7e1031' : isLeaf ? '#e0607a' : '#9b8a8d'}
                  strokeWidth={isHot ? 3 : 2}
                />
                {isLeaf ? (
                  <>
                    <text
                      x={n.x}
                      y={n.y - 5}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={800}
                      fill="#1c1214"
                    >
                      {n.char}
                    </text>
                    <text
                      x={n.x}
                      y={n.y + 10}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={600}
                      fill="#5a4a4d"
                    >
                      {n.freq}
                    </text>
                  </>
                ) : (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={13}
                    fontWeight={700}
                    fill={isHot ? '#ffffff' : '#1c1214'}
                  >
                    {n.freq}
                  </text>
                )}
                {/* code, once the tree is complete */}
                {isLeaf && done && (
                  <text
                    x={n.x}
                    y={n.y + 40}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#9f1239"
                    fontFamily="ui-monospace, monospace"
                  >
                    {n.code}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* the pool */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Pool — δέντρα προς συγχώνευση {!done && '(τα δύο μικρότερα = επόμενο ζευγάρι)'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pool.map((p, i) => {
            const next = !done && i < 2
            return (
              <div
                key={i}
                className={cn(
                  'flex h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-2 font-mono text-sm',
                  next
                    ? 'border-amber-500 bg-amber-500/15 font-bold text-fg'
                    : 'border-border bg-bg-elevated text-fg-muted',
                )}
              >
                {p.char && <span className="font-bold not-italic">{p.char}</span>}
                <span>{p.freq}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
