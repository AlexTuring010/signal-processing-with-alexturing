'use client'

/**
 * PrefixDecoder — why a code must be prefix-free, made visible by decoding.
 *
 * Two tabs, both decoding a bitstring by walking a binary tree from the root.
 *
 *  • «Διφορούμενος»  — the code a→01, b→010, c→1, where a's code is a PREFIX of
 *    b's. In the tree, a does not sit at a leaf: it sits at an internal node
 *    with b hanging below it. The same string 0101 is decoded twice — once
 *    stopping at a (→ aa), once walking past it (→ bc). Two readings, one
 *    string: ambiguous.
 *  • «Απροθεματικός» — a proper prefix-free code, every character at a leaf.
 *    The string 11010001010001 walks cleanly to exactly one reading: abfeed.
 *
 * Step through with prev/next; the lit path, the bit cursor and the growing
 * output all move together. Built for L13.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Node = {
  id: string
  x: number
  y: number
  char?: string
  leaf?: boolean
  /** internal node that ALSO carries a character — the prefix violation */
  problem?: boolean
}
type Edge = { from: string; to: string; bit: 0 | 1 }

type Step = {
  current: string
  litEdges: string[]
  doneCount: number
  activeRange: [number, number] | null
  emitted: string
  note: string
  banner?: string
  verdict?: 'ambiguous' | 'clean'
}

type TabData = {
  id: string
  label: string
  nodes: Node[]
  edges: Edge[]
  viewBox: string
  bits: string
  legend: string
  steps: Step[]
}

const ek = (e: Edge) => `${e.from}-${e.to}`

/* ── Tab 1 — the ambiguous code a→01, b→010, c→1 ──────────────────────── */

const AMBIG_NODES: Node[] = [
  { id: 'root', x: 185, y: 42 },
  { id: 'n0', x: 120, y: 128 },
  { id: 'c', x: 282, y: 128, char: 'c', leaf: true },
  { id: 'nA', x: 120, y: 214, char: 'a', problem: true },
  { id: 'b', x: 66, y: 300, char: 'b', leaf: true },
]
const AMBIG_EDGES: Edge[] = [
  { from: 'root', to: 'n0', bit: 0 },
  { from: 'root', to: 'c', bit: 1 },
  { from: 'n0', to: 'nA', bit: 1 },
  { from: 'nA', to: 'b', bit: 0 },
]

const AMBIG_STEPS: Step[] = [
  {
    current: 'nA',
    litEdges: [],
    doneCount: 0,
    activeRange: null,
    emitted: '',
    note: 'Ο κώδικας είναι a→01, b→010, c→1. Το πρόβλημα: ο κώδικας του a, το «01», είναι πρόθεμα του κώδικα του b, το «010». Στο δέντρο αυτό σημαίνει ότι ο a δεν κάθεται σε φύλλο — κάθεται σε εσωτερικό κόμβο, με το b να κρέμεται από κάτω του.',
  },
  {
    current: 'n0',
    litEdges: ['root-n0'],
    doneCount: 0,
    activeRange: [0, 0],
    emitted: '',
    banner: 'Ανάγνωση Α — «σταμάτα μόλις δεις τον a»',
    note: 'Διαβάζω το 1ο δυφίο, 0 → κατεβαίνω αριστερά.',
  },
  {
    current: 'nA',
    litEdges: ['root-n0', 'n0-nA'],
    doneCount: 0,
    activeRange: [0, 1],
    emitted: '',
    banner: 'Ανάγνωση Α',
    note: 'Διαβάζω το 2ο δυφίο, 1 → φτάνω στον κόμβο a. Επιλέγω να σταματήσω εδώ.',
  },
  {
    current: 'root',
    litEdges: [],
    doneCount: 2,
    activeRange: null,
    emitted: 'a',
    banner: 'Ανάγνωση Α',
    note: 'Βγάζω τον χαρακτήρα a και ξεκινώ ξανά από τη ρίζα.',
  },
  {
    current: 'n0',
    litEdges: ['root-n0'],
    doneCount: 2,
    activeRange: [2, 2],
    emitted: 'a',
    banner: 'Ανάγνωση Α',
    note: 'Διαβάζω το 3ο δυφίο, 0 → αριστερά.',
  },
  {
    current: 'nA',
    litEdges: ['root-n0', 'n0-nA'],
    doneCount: 2,
    activeRange: [2, 3],
    emitted: 'a',
    banner: 'Ανάγνωση Α',
    note: 'Διαβάζω το 4ο δυφίο, 1 → πάλι στον κόμβο a. Σταματώ ξανά.',
  },
  {
    current: 'root',
    litEdges: [],
    doneCount: 4,
    activeRange: null,
    emitted: 'aa',
    banner: 'Ανάγνωση Α — ολοκληρώθηκε',
    note: 'Βγάζω a. Τα δυφία τελείωσαν. Η ανάγνωση Α δίνει «aa».',
  },
  {
    current: 'n0',
    litEdges: ['root-n0'],
    doneCount: 0,
    activeRange: [0, 0],
    emitted: '',
    banner: 'Ανάγνωση Β — «μη σταματάς στον a, συνέχισε»',
    note: 'Ίδια συμβολοσειρά 0101 από την αρχή. Διαβάζω το 1ο δυφίο, 0 → αριστερά.',
  },
  {
    current: 'nA',
    litEdges: ['root-n0', 'n0-nA'],
    doneCount: 0,
    activeRange: [0, 1],
    emitted: '',
    banner: 'Ανάγνωση Β',
    note: 'Διαβάζω 1 → κόμβος a. Αλλά τώρα ΔΕΝ σταματώ — υπάρχει ακόμη δρόμος προς το b από κάτω.',
  },
  {
    current: 'b',
    litEdges: ['root-n0', 'n0-nA', 'nA-b'],
    doneCount: 0,
    activeRange: [0, 2],
    emitted: 'b',
    banner: 'Ανάγνωση Β',
    note: 'Διαβάζω το 3ο δυφίο, 0 → φτάνω στο φύλλο b. Βγάζω b.',
  },
  {
    current: 'c',
    litEdges: ['root-c'],
    doneCount: 3,
    activeRange: [3, 3],
    emitted: 'bc',
    banner: 'Ανάγνωση Β — ολοκληρώθηκε',
    note: 'Ξεκινώ από τη ρίζα. Διαβάζω το 4ο δυφίο, 1 → φύλλο c. Βγάζω c. Η ανάγνωση Β δίνει «bc».',
  },
  {
    current: 'nA',
    litEdges: [],
    doneCount: 4,
    activeRange: null,
    emitted: '',
    verdict: 'ambiguous',
    note: 'Η ίδια συμβολοσειρά 0101 διαβάστηκε και ως «aa» και ως «bc» — δύο τελείως διαφορετικές λέξεις. Διφορούμενη. Φταίει ότι ο κώδικας του a είναι πρόθεμα του κώδικα του b: φτάνοντας στον a, ο αποκωδικοποιητής δεν ξέρει αν πρέπει να σταματήσει ή να συνεχίσει.',
  },
]

/* ── Tab 2 — a proper prefix-free code, every character at a leaf ──────── */

const PREFIX_NODES: Node[] = [
  { id: 'root', x: 220, y: 44 },
  { id: 'n0', x: 130, y: 128 },
  { id: 'n1', x: 320, y: 128 },
  { id: 'n00', x: 80, y: 212 },
  { id: 'b', x: 192, y: 212, char: 'b', leaf: true },
  { id: 'e', x: 268, y: 212, char: 'e', leaf: true },
  { id: 'a', x: 366, y: 212, char: 'a', leaf: true },
  { id: 'f', x: 46, y: 296, char: 'f', leaf: true },
  { id: 'd', x: 120, y: 296, char: 'd', leaf: true },
]
const PREFIX_EDGES: Edge[] = [
  { from: 'root', to: 'n0', bit: 0 },
  { from: 'root', to: 'n1', bit: 1 },
  { from: 'n0', to: 'n00', bit: 0 },
  { from: 'n0', to: 'b', bit: 1 },
  { from: 'n1', to: 'e', bit: 0 },
  { from: 'n1', to: 'a', bit: 1 },
  { from: 'n00', to: 'f', bit: 0 },
  { from: 'n00', to: 'd', bit: 1 },
]

const PREFIX_STEPS: Step[] = [
  {
    current: 'root',
    litEdges: [],
    doneCount: 0,
    activeRange: null,
    emitted: '',
    note: 'Εδώ ο κώδικας είναι απροθεματικός: a→11, b→01, d→001, e→10, f→000 — κάθε χαρακτήρας κάθεται σε φύλλο. Αποκωδικοποίηση: ακολούθησε τα δυφία από τη ρίζα· μόλις φτάσεις σε φύλλο, βγάλε τον χαρακτήρα και ξεκίνα ξανά από τη ρίζα.',
  },
  {
    current: 'a',
    litEdges: ['root-n1', 'n1-a'],
    doneCount: 0,
    activeRange: [0, 1],
    emitted: 'a',
    note: '11 → δεξιά, δεξιά → φτάνω στο φύλλο a. Βγάζω a και επιστρέφω στη ρίζα.',
  },
  {
    current: 'b',
    litEdges: ['root-n0', 'n0-b'],
    doneCount: 2,
    activeRange: [2, 3],
    emitted: 'ab',
    note: '01 → αριστερά, δεξιά → φύλλο b. Βγάζω b.',
  },
  {
    current: 'f',
    litEdges: ['root-n0', 'n0-n00', 'n00-f'],
    doneCount: 4,
    activeRange: [4, 6],
    emitted: 'abf',
    note: '000 → αριστερά, αριστερά, αριστερά → φύλλο f. Βγάζω f.',
  },
  {
    current: 'e',
    litEdges: ['root-n1', 'n1-e'],
    doneCount: 7,
    activeRange: [7, 8],
    emitted: 'abfe',
    note: '10 → δεξιά, αριστερά → φύλλο e. Βγάζω e.',
  },
  {
    current: 'e',
    litEdges: ['root-n1', 'n1-e'],
    doneCount: 9,
    activeRange: [9, 10],
    emitted: 'abfee',
    note: '10 → δεξιά, αριστερά → φύλλο e ξανά. Βγάζω e.',
  },
  {
    current: 'd',
    litEdges: ['root-n0', 'n0-n00', 'n00-d'],
    doneCount: 11,
    activeRange: [11, 13],
    emitted: 'abfeed',
    note: '001 → αριστερά, αριστερά, δεξιά → φύλλο d. Βγάζω d.',
  },
  {
    current: 'root',
    litEdges: [],
    doneCount: 14,
    activeRange: null,
    emitted: 'abfeed',
    verdict: 'clean',
    note: 'Και τα 14 δυφία διαβάστηκαν — με έναν και μοναδικό τρόπο. Η συμβολοσειρά είναι «abfeed». Αφού κάθε χαρακτήρας κάθεται σε φύλλο, κανένας κώδικας δεν είναι πρόθεμα άλλου, και η ανάγνωση είναι πάντα μονοσήμαντη.',
  },
]

const TABS: TabData[] = [
  {
    id: 'ambig',
    label: 'Διφορούμενος',
    nodes: AMBIG_NODES,
    edges: AMBIG_EDGES,
    viewBox: '0 0 350 338',
    bits: '0101',
    legend: 'a→01  ·  b→010  ·  c→1',
    steps: AMBIG_STEPS,
  },
  {
    id: 'prefix',
    label: 'Απροθεματικός',
    nodes: PREFIX_NODES,
    edges: PREFIX_EDGES,
    viewBox: '0 0 420 338',
    bits: '11010001010001',
    legend: 'a→11  ·  b→01  ·  d→001  ·  e→10  ·  f→000',
    steps: PREFIX_STEPS,
  },
]

export function PrefixDecoder() {
  const [tabId, setTabId] = useState(TABS[0].id)
  const [step, setStep] = useState(0)

  const tab = TABS.find((t) => t.id === tabId) as TabData
  const last = tab.steps.length - 1
  const s = tab.steps[step]
  const nodeMap = new Map(tab.nodes.map((n) => [n.id, n]))

  function selectTab(id: string) {
    setTabId(id)
    setStep(0)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αποκωδικοποίηση — γιατί χρειάζεται απροθεματικός κώδικας
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTab(t.id)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                tabId === t.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Διάβασε τα δυφία ένα-ένα ακολουθώντας το δέντρο από τη ρίζα. Κώδικας:{' '}
        <span className="font-mono font-semibold text-fg">{tab.legend}</span>
      </p>

      {/* bit strip */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Συμβολοσειρά
        </span>
        <div className="flex gap-1">
          {tab.bits.split('').map((bit, i) => {
            const active =
              s.activeRange != null &&
              i >= s.activeRange[0] &&
              i <= s.activeRange[1]
            const done = !active && i < s.doneCount
            return (
              <span
                key={i}
                className={cn(
                  'flex h-7 w-6 items-center justify-center rounded border font-mono text-sm font-bold tabular-nums transition-colors',
                  active
                    ? 'border-accent bg-accent text-accent-fg'
                    : done
                      ? 'border-border bg-bg-soft text-fg-subtle'
                      : 'border-border bg-bg-elevated text-fg',
                )}
              >
                {bit}
              </span>
            )
          })}
        </div>
      </div>

      {/* tree */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={tab.viewBox}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* edges */}
          {tab.edges.map((e) => {
            const p = nodeMap.get(e.from) as Node
            const c = nodeMap.get(e.to) as Node
            const lit = s.litEdges.includes(ek(e))
            const mx = (p.x + c.x) / 2
            const my = (p.y + c.y) / 2
            const dx = c.x - p.x
            const dy = c.y - p.y
            const L = Math.hypot(dx, dy) || 1
            const ox = (-dy / L) * 11
            const oy = (dx / L) * 11
            return (
              <g key={ek(e)}>
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={c.x}
                  y2={c.y}
                  stroke={lit ? '#9f1239' : '#b6a6a8'}
                  strokeWidth={lit ? 4 : 1.8}
                />
                <text
                  x={mx + ox}
                  y={my + oy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={800}
                  fill={lit ? '#9f1239' : '#8a787b'}
                >
                  {e.bit}
                </text>
              </g>
            )
          })}

          {/* nodes */}
          {tab.nodes.map((n) => {
            const isCurrent = s.current === n.id
            const r = n.leaf || n.problem ? 21 : 13
            let fill = '#ffffff'
            let stroke = '#9b8a8d'
            if (n.leaf) {
              fill = '#fde2e4'
              stroke = '#e0607a'
            } else if (n.problem) {
              fill = '#fef0c8'
              stroke = '#d97706'
            }
            return (
              <g key={n.id}>
                {isCurrent && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r + 5}
                    fill="none"
                    stroke="#9f1239"
                    strokeWidth={3}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.2}
                />
                {n.char && (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={16}
                    fontWeight={800}
                    fill={n.problem ? '#92400e' : '#1c1214'}
                  >
                    {n.char}
                  </text>
                )}
                {n.problem && (
                  <text
                    x={n.x + r - 2}
                    y={n.y - r + 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={900}
                    fill="#d97706"
                  >
                    !
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* output */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Έξοδος
        </span>
        {s.emitted ? (
          <div className="flex gap-1">
            {s.emitted.split('').map((ch, i) => (
              <span
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 font-mono text-sm font-bold text-accent"
              >
                {ch}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-fg-subtle">—</span>
        )}
      </div>

      {/* banner + annotation */}
      {s.banner && (
        <div className="mt-2 inline-flex rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {s.banner}
        </div>
      )}
      <div
        aria-live="polite"
        className={cn(
          'mt-2 min-h-[4rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          s.verdict === 'ambiguous'
            ? 'border-danger/40 bg-danger/10 text-fg'
            : s.verdict === 'clean'
              ? 'border-success/40 bg-success/10 text-fg'
              : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {s.verdict === 'ambiguous' && (
          <span className="font-bold text-danger">✗ Διφορούμενη. </span>
        )}
        {s.verdict === 'clean' && (
          <span className="font-bold text-success">✓ Μονοσήμαντη. </span>
        )}
        {s.note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((v) => Math.min(last, v + 1))}
          disabled={step === last}
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
