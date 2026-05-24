'use client'

/**
 * InstanceDimensionLab — make «Πρόβλημα / Στιγμιότυπο / Διάσταση» click.
 *
 * Three words students confuse on day one. The viz lays them out as three
 * literal levels of a hierarchy:
 *
 *   Πρόβλημα    ─ ένας γενικός ορισμός εισόδου/εξόδου
 *      ↓
 *   Στιγμιότυπα ─ πολλά συγκεκριμένα δεδομένα του ίδιου προβλήματος
 *      ↓
 *   Διάσταση    ─ ένας αριθμός ανά στιγμιότυπο που μετράει το μέγεθός του
 *
 * Two tabs (Ταξινόμηση / Knapsack) show that ΤΟ ΙΔΙΟ πρόβλημα γεννά
 * άπειρα στιγμιότυπα — και η «διάσταση» είναι αυτό που τα ταξινομεί
 * όλα κάτω από έναν αριθμό n. Built for L01.
 */

import { useState } from 'react'
import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Problem = 'sort' | 'knapsack'

type KnapsackItem = { c: number; w: number }
type SortInstance = { id: number; values: number[] }
type KnapsackInstance = { id: number; items: KnapsackItem[]; b: number }

const SORT_DESC = {
  title: 'Ταξινόμηση',
  inputLabel: 'Είσοδος',
  inputText: 'n ακέραιοι a₁, a₂, …, aₙ',
  outputLabel: 'Έξοδος',
  outputText: 'οι ίδιοι ακέραιοι σε αύξουσα σειρά',
  dimNote: 'το πλήθος των ακεραίων',
}
const KNAPSACK_DESC = {
  title: 'Knapsack (σακίδιο)',
  inputLabel: 'Είσοδος',
  inputText: 'n αντικείμενα με αξίες c[i], όγκους w[i], και χωρητικότητα b',
  outputLabel: 'Έξοδος',
  outputText: 'υποσύνολο αντικειμένων με τη μέγιστη αξία που χωράει σε όγκο ≤ b',
  dimNote: 'το πλήθος των αντικειμένων',
}

// Deterministic seed sets — kept stable across renders to avoid hydration
// mismatches. The user adds more with the "+ Νέο στιγμιότυπο" button.
const INITIAL_SORT: SortInstance[] = [
  { id: 0, values: [8, 3, 5, 1, 9] },
  { id: 1, values: [4, 2] },
  { id: 2, values: [12, 7, 25, 6, 18, 11, 22, 4] },
]
const INITIAL_KNAPSACK: KnapsackInstance[] = [
  {
    id: 0,
    items: [
      { c: 6, w: 2 },
      { c: 4, w: 3 },
      { c: 5, w: 4 },
    ],
    b: 7,
  },
  {
    id: 1,
    items: [
      { c: 3, w: 1 },
      { c: 5, w: 2 },
    ],
    b: 3,
  },
  {
    id: 2,
    items: [
      { c: 7, w: 3 },
      { c: 2, w: 1 },
      { c: 9, w: 5 },
      { c: 4, w: 2 },
      { c: 6, w: 4 },
    ],
    b: 10,
  },
]

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeSortInstance(id: number): SortInstance {
  const n = randInt(2, 9)
  const values = Array.from({ length: n }, () => randInt(1, 30))
  return { id, values }
}
function makeKnapsackInstance(id: number): KnapsackInstance {
  const n = randInt(2, 6)
  const items = Array.from({ length: n }, () => ({
    c: randInt(1, 9),
    w: randInt(1, 6),
  }))
  const b = randInt(6, 16)
  return { id, items, b }
}

export function InstanceDimensionLab() {
  const [problem, setProblem] = useState<Problem>('sort')
  const [sortInst, setSortInst] = useState<SortInstance[]>(INITIAL_SORT)
  const [knapInst, setKnapInst] = useState<KnapsackInstance[]>(INITIAL_KNAPSACK)
  const [nextId, setNextId] = useState(100)

  const desc = problem === 'sort' ? SORT_DESC : KNAPSACK_DESC

  const addInstance = () => {
    if (problem === 'sort') {
      setSortInst((prev) => [...prev, makeSortInstance(nextId)])
    } else {
      setKnapInst((prev) => [...prev, makeKnapsackInstance(nextId)])
    }
    setNextId((id) => id + 1)
  }
  const clearExtras = () => {
    if (problem === 'sort') {
      setSortInst(INITIAL_SORT)
    } else {
      setKnapInst(INITIAL_KNAPSACK)
    }
  }
  const resetAll = () => {
    setSortInst(INITIAL_SORT)
    setKnapInst(INITIAL_KNAPSACK)
  }

  const instances: { id: number; n: number; body: React.ReactNode }[] =
    problem === 'sort'
      ? sortInst.map((s) => ({
          id: s.id,
          n: s.values.length,
          body: (
            <div className="flex flex-wrap items-center justify-center gap-1">
              <span className="font-mono text-fg-subtle">{'{'}</span>
              {s.values.map((v, i) => (
                <span key={i} className="font-mono text-sm font-semibold text-fg">
                  {v}
                  {i < s.values.length - 1 ? (
                    <span className="text-fg-subtle">,</span>
                  ) : null}
                </span>
              ))}
              <span className="font-mono text-fg-subtle">{'}'}</span>
            </div>
          ),
        }))
      : knapInst.map((k) => ({
          id: k.id,
          n: k.items.length,
          body: (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center gap-1">
                {k.items.map((it, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded border border-border bg-bg-soft/60 px-1.5 py-0.5 font-mono text-[11px] text-fg"
                    title={`αντικείμενο ${i + 1}: αξία ${it.c}, όγκος ${it.w}`}
                  >
                    <span className="text-fg-subtle">c</span>={it.c}
                    <span className="mx-0.5 text-fg-subtle">·</span>
                    <span className="text-fg-subtle">w</span>={it.w}
                  </span>
                ))}
              </div>
              <div className="text-center font-mono text-[11px] text-fg-subtle">
                b = <span className="font-semibold text-fg">{k.b}</span>
              </div>
            </div>
          ),
        }))

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + tabs */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πρόβλημα — Στιγμιότυπο — Διάσταση
        </div>
        <div className="flex gap-1">
          {(['sort', 'knapsack'] as Problem[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProblem(p)}
              className={cn(
                'rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
                p === problem
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-fg-muted hover:text-fg',
              )}
            >
              {p === 'sort' ? 'Ταξινόμηση' : 'Knapsack'}
            </button>
          ))}
        </div>
      </div>

      {/* level 1: ΠΡΟΒΛΗΜΑ */}
      <div className="mb-1">
        <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">
          1 · Πρόβλημα
        </div>
        <div className="rounded-lg border-2 border-accent/60 bg-accent/5 p-3">
          <div className="text-sm font-semibold text-fg">{desc.title}</div>
          <div className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
            <div>
              <span className="mr-1 text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
                {desc.inputLabel}
              </span>
              <span className="text-fg">{desc.inputText}</span>
            </div>
            <div>
              <span className="mr-1 text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
                {desc.outputLabel}
              </span>
              <span className="text-fg">{desc.outputText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="my-1 flex justify-center text-fg-subtle" aria-hidden="true">
        ↓
      </div>

      {/* level 2 + 3: ΣΤΙΓΜΙΟΤΥΠΑ (with ΔΙΑΣΤΑΣΗ inside each card) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">
            2 · Στιγμιότυπα · 3 · Διάσταση
          </div>
          <span className="font-mono text-[0.65rem] text-fg-subtle">
            {instances.length} στιγμιότυπα
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {instances.map((inst) => (
            <div
              key={inst.id}
              className="rounded-lg border border-border bg-bg-soft/40 p-2.5"
            >
              <div className="mb-1.5 flex items-center justify-between text-[0.6rem] uppercase tracking-wider text-fg-subtle">
                <span className="font-semibold">συγκεκριμένη είσοδος</span>
                <span>#{inst.id + 1}</span>
              </div>
              <div className="mb-2 min-h-[2.5rem] rounded border border-border bg-bg-elevated px-2 py-1.5">
                {inst.body}
              </div>
              <div className="flex items-center justify-between rounded border border-accent/40 bg-accent/10 px-2 py-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-fg-subtle">
                  Διάσταση
                </span>
                <span className="font-mono text-sm font-bold text-accent">
                  n = {inst.n}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* takeaway */}
      <div
        aria-live="polite"
        className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        Ένα πρόβλημα, πολλά διαφορετικά στιγμιότυπα — και κάθε στιγμιότυπο μπορεί
        να έχει δικιά του <strong className="text-fg">διάσταση n</strong> (
        {desc.dimNote}). Η πολυπλοκότητα δεν εκφράζεται για ένα συγκεκριμένο
        στιγμιότυπο — εκφράζεται ως <strong className="text-fg">συνάρτηση του n</strong>{' '}
        και «τα μαζεύει όλα» τα στιγμιότυπα ίδιου μεγέθους σε μία απάντηση.
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addInstance}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Νέο στιγμιότυπο
        </button>
        <button
          type="button"
          onClick={clearExtras}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Κράτα τα αρχικά
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </section>
  )
}
