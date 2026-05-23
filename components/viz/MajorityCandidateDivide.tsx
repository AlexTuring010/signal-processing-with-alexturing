'use client'

/**
 * MajorityCandidateDivide — the D&C majority-element pattern.
 *
 * Covers two L04 problems with the same shape:
 *  • pt3-th2 — incomparable colored elements; equality test in O(1).
 *  • front-set-4-ask5 — bank cards with an equivalence device.
 *
 * The animation walks the recursion top-down on an array of 12 colored
 * boxes, then unwinds bottom-up: each leaf returns its single colour as
 * candidate; at each internal node we get *one* candidate from each
 * child (left c_L, right c_R) and verify by linear scan of the whole
 * sub-segment — if a candidate's count exceeds half, it survives;
 * otherwise it dies. The root verdict announces «πλειοψηφικό = X» or
 * «NIL». A live readout shows the running 2T(n/2) + Θ(n) cost.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Preset = 'pt3-th2' | 'front-set-4-ask5'

const COLOUR_SWATCH: Record<string, string> = {
  R: 'bg-rose-500 text-white border-rose-700',
  B: 'bg-sky-500 text-white border-sky-700',
  G: 'bg-emerald-500 text-white border-emerald-700',
  Y: 'bg-amber-500 text-black border-amber-700',
  P: 'bg-fuchsia-500 text-white border-fuchsia-700',
}

const PRESETS: Record<
  Preset,
  {
    label: string
    headline: string
    elements: string[]
    elementName: string
    candidateName: string
    legend: { key: string; name: string }[]
  }
> = {
  'pt3-th2': {
    label: 'Παλαιό #3 · ιερογλυφικά',
    headline: 'Πλειοψηφικό σε O(n log n) — μόνο έλεγχοι ισότητας',
    // 12 elements, R appears 7 times → strict majority (7 > 6)
    elements: ['R', 'B', 'R', 'G', 'R', 'R', 'B', 'R', 'R', 'G', 'R', 'Y'],
    elementName: 'στοιχείο',
    candidateName: 'υποψήφιο',
    legend: [
      { key: 'R', name: 'Ιερογλυφικό Α' },
      { key: 'B', name: 'Ιερογλυφικό Β' },
      { key: 'G', name: 'Ιερογλυφικό Γ' },
      { key: 'Y', name: 'Ιερογλυφικό Δ' },
    ],
  },
  'front-set-4-ask5': {
    label: 'Φροντ. #4 · κάρτες & συσκευή',
    headline: 'Ύποπτη κάρτα — DC_CHECK με μία συσκευή ισοδυναμίας',
    // 12 cards, B (account β) appears 7 times → suspect found
    elements: ['B', 'R', 'B', 'B', 'G', 'B', 'B', 'R', 'B', 'P', 'B', 'G'],
    elementName: 'κάρτα',
    candidateName: 'υποψήφια κάρτα',
    legend: [
      { key: 'B', name: 'Λογαριασμός β (ύποπτος)' },
      { key: 'R', name: 'Λογαριασμός ρ' },
      { key: 'G', name: 'Λογαριασμός γ' },
      { key: 'P', name: 'Λογαριασμός π' },
    ],
  },
}

type Node = {
  l: number
  r: number
  depth: number
  /** candidate colour returned, or null if the verification failed. */
  candidate: string | null
  /** scan count of that candidate over the sub-segment. */
  count: number
  /** how many element comparisons / device calls happened here. */
  cost: number
}

function solve(elements: string[]): Node[] {
  const nodes: Node[] = []
  function go(l: number, r: number, depth: number): { cand: string | null; cnt: number } {
    if (l === r) {
      nodes.push({ l, r, depth, candidate: elements[l], count: 1, cost: 0 })
      return { cand: elements[l], cnt: 1 }
    }
    const mid = Math.floor((l + r) / 2)
    const left = go(l, mid, depth + 1)
    const right = go(mid + 1, r, depth + 1)
    const len = r - l + 1
    let chosen: string | null = null
    let chosenCount = 0
    let cost = 0
    const tryCount = (c: string | null) => {
      if (c === null) return 0
      cost += len
      let k = 0
      for (let i = l; i <= r; i++) if (elements[i] === c) k++
      return k
    }
    const lc = tryCount(left.cand)
    if (lc * 2 > len) {
      chosen = left.cand
      chosenCount = lc
    } else if (left.cand !== right.cand) {
      const rc = tryCount(right.cand)
      if (rc * 2 > len) {
        chosen = right.cand
        chosenCount = rc
      } else {
        chosenCount = Math.max(lc, rc)
      }
    } else {
      chosenCount = lc
    }
    nodes.push({ l, r, depth, candidate: chosen, count: chosenCount, cost })
    return { cand: chosen, cnt: chosenCount }
  }
  go(0, elements.length - 1, 0)
  // sort post-order so step animation reveals leaves first, root last
  nodes.sort((a, b) =>
    b.depth - a.depth || a.l - b.l,
  )
  return nodes
}

export function MajorityCandidateDivide({
  preset = 'pt3-th2',
}: {
  preset?: Preset
} = {}) {
  const cfg = PRESETS[preset] ?? PRESETS['pt3-th2']
  const trace = useMemo(() => solve(cfg.elements), [cfg.elements])
  const [step, setStep] = useState(0)
  const cur = trace[Math.min(step, trace.length - 1)]

  const totalCost = trace
    .slice(0, step + 1)
    .reduce((acc, n) => acc + n.cost, 0)

  const finished = step >= trace.length - 1
  const len = cfg.elements.length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{cfg.headline}</div>
        <div className="text-xs text-fg-subtle">n = {len}</div>
      </div>

      {/* Strip — highlight current sub-segment + candidate */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Υπο-πίνακας A[{cur.l + 1}..{cur.r + 1}] · βάθος {cur.depth}
        </div>
        <div className="flex justify-center gap-1">
          {cfg.elements.map((c, i) => {
            const inRange = i >= cur.l && i <= cur.r
            const isCandidate = inRange && cur.candidate === c
            return (
              <span
                key={i}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded border-2 font-mono text-base font-bold transition-all',
                  inRange ? COLOUR_SWATCH[c] : 'border-border/30 bg-bg-elevated text-fg-subtle opacity-30',
                  isCandidate && cur.depth === 0 && cur.candidate ? 'ring-2 ring-offset-2 ring-offset-bg-elevated ring-yellow-400' : '',
                )}
              >
                {c}
              </span>
            )
          })}
        </div>
        <p className="mt-2 text-center text-xs text-fg-muted">
          {cur.l === cur.r ? (
            <>Βάση: μόνο 1 {cfg.elementName} — επιστρέφει τον εαυτό του ως {cfg.candidateName}.</>
          ) : cur.candidate ? (
            <>
              Σάρωσε το διάστημα ({cur.r - cur.l + 1} {cfg.elementName}α){' '}
              <span className="font-mono">{cur.cost}</span> φορές. Ο{' '}
              {cfg.candidateName} <strong>{cur.candidate}</strong> εμφανίζεται{' '}
              {cur.count} φορές (κατώφλι {Math.floor((cur.r - cur.l + 1) / 2) + 1}{' '}
              ή παραπάνω). <strong>Περνά.</strong>
            </>
          ) : (
            <>
              Σάρωσε το διάστημα ({cur.r - cur.l + 1} {cfg.elementName}α){' '}
              <span className="font-mono">{cur.cost}</span> φορές. Κανένας υποψήφιος
              δεν περνά το κατώφλι. <strong>Επιστρέφει NIL.</strong>
            </>
          )}
        </p>
      </div>

      {/* Bar of nodes at depths */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <div className="mb-1 font-semibold uppercase tracking-wider text-fg-subtle">
            Συνολικό κόστος μέχρι τώρα
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-fg">{totalCost}</span>
            <span className="text-fg-muted">συγκρίσεις</span>
          </div>
          <div className="mt-1 text-fg-muted">
            T(n) = 2 T(n/2) + Θ(n) ⇒ Θ(n log n) ={' '}
            <span className="font-mono">
              {Math.round(len * Math.log2(len))}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
          <div className="mb-1 font-semibold uppercase tracking-wider text-fg-subtle">
            Υπόμνημα
          </div>
          <div className="flex flex-wrap gap-2">
            {cfg.legend.map((l) => (
              <span key={l.key} className="flex items-center gap-1">
                <span
                  className={cn('inline-block h-3 w-3 rounded-sm border', COLOUR_SWATCH[l.key])}
                />
                <span className="text-fg-muted">{l.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ⟲ Αρχή
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ← Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(trace.length - 1, s + 1))}
            disabled={finished}
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
          >
            Επόμενο →
          </button>
        </div>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {trace.length}
        </span>
      </div>

      {finished && (
        <div className="mt-3 rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-xs text-fg">
          <strong>Τέρμα.</strong> Το D&C επέστρεψε{' '}
          {cur.candidate ? (
            <>
              πλειοψηφικό <span className="font-mono">{cur.candidate}</span> με{' '}
              {cur.count}/{len} εμφανίσεις ({' '}
              <InlineMath>{`${cur.count} > ${len}/2`}</InlineMath>). Συνολικά{' '}
              <span className="font-mono">{totalCost}</span> συγκρίσεις — σαφώς
              κάτω από τις <span className="font-mono">{len * (len - 1) / 2}</span>{' '}
              του αφελούς <InlineMath>{'O(n^2)'}</InlineMath>.
            </>
          ) : (
            <>
              NIL: κανένας {cfg.candidateName} δεν ξεπέρασε το κατώφλι σε όλον τον
              πίνακα.
            </>
          )}
        </div>
      )}
    </section>
  )
}
