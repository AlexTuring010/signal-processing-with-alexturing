'use client'

/**
 * KnapsackGreedyFail — why the value/weight-ratio greedy loses at 0/1 knapsack.
 *
 * The student's instinct, fresh from L11–L13, is that some greedy rule must
 * work. The most natural one for knapsack is «πάρε πρώτα τον καλύτερο λόγο
 * αξίας/βάρους». This viz hands them exactly that rule and lets it fail on the
 * lecture's own instance:
 *
 *  - greedy grabs items 1 and 2 (best ratios, both small), fills 5 of the 8
 *    kilos, then nothing else fits → value 7;
 *  - the optimum gives up the ratio to PACK the bag exactly — items 2 and 4,
 *    weight 8, value 10.
 *
 * Step through the greedy decisions, watch the 3-kilo gap it can never use,
 * then reveal the optimum it walked past. Built for L15 on the shared
 * knapsack instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KNAPSACK_ITEMS, KNAPSACK_CAP, KNAPSACK_N } from './knapsack-instance'

const ITEMS = KNAPSACK_ITEMS
const CAP = KNAPSACK_CAP
const N = KNAPSACK_N

/** per-item colour, stable across the greedy and the optimum views */
const ITEM_FILL = [
  'bg-sky-500/30 border-sky-500/70',
  'bg-emerald-500/30 border-emerald-500/70',
  'bg-amber-500/30 border-amber-500/70',
  'bg-violet-500/30 border-violet-500/70',
]

/** greedy considers the items by ratio vᵢ/wᵢ, highest first (ties by index) */
const GREEDY_ORDER = [...ITEMS.keys()].sort(
  (a, b) => ITEMS[b].v / ITEMS[b].w - ITEMS[a].v / ITEMS[a].w || a - b,
)

type GStep = {
  idx: number
  fits: boolean
  usedBefore: number
  packed: number[]
  value: number
}

/** run the ratio-greedy; one record per examined item */
function runGreedy(): GStep[] {
  const out: GStep[] = []
  const packed: number[] = []
  let used = 0
  let value = 0
  for (const idx of GREEDY_ORDER) {
    const usedBefore = used
    const fits = used + ITEMS[idx].w <= CAP
    if (fits) {
      packed.push(idx)
      used += ITEMS[idx].w
      value += ITEMS[idx].v
    }
    out.push({ idx, fits, usedBefore, packed: [...packed], value })
  }
  return out
}

/** brute-force optimum over all 2ⁿ subsets */
function optimum(): { value: number; set: number[] } {
  let best = { value: 0, set: [] as number[] }
  for (let mask = 0; mask < 1 << N; mask++) {
    let w = 0
    let v = 0
    const set: number[] = []
    for (let i = 0; i < N; i++) {
      if (mask & (1 << i)) {
        w += ITEMS[i].w
        v += ITEMS[i].v
        set.push(i)
      }
    }
    if (w <= CAP && v > best.value) best = { value: v, set }
  }
  return best
}

/** the capacity bar: packed items as segments, then the empty leftover */
function BagBar({ packed }: { packed: number[] }) {
  const used = packed.reduce((s, i) => s + ITEMS[i].w, 0)
  const leftover = CAP - used
  return (
    <div className="flex h-10 w-full overflow-hidden rounded-md border border-border">
      {packed.map((i) => (
        <div
          key={i}
          style={{ flex: `${ITEMS[i].w} 0 0%` }}
          className={cn(
            'flex items-center justify-center border-r border-border/60 text-xs font-bold text-fg last:border-r-0',
            ITEM_FILL[i],
          )}
        >
          {ITEMS[i].w}
        </div>
      ))}
      {leftover > 0 && (
        <div
          style={{ flex: `${leftover} 0 0%` }}
          className="flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(148,148,165,0.16)_6px,rgba(148,148,165,0.16)_12px)] text-[0.65rem] font-medium text-fg-subtle"
        >
          {leftover === CAP ? 'άδειο' : `κενό ${leftover}`}
        </div>
      )}
    </div>
  )
}

export function KnapsackGreedyFail() {
  const [step, setStep] = useState(0) // 0 intro · 1..N greedy · N+1 optimum
  const greedy = useMemo(runGreedy, [])
  const opt = useMemo(optimum, [])
  const last = N + 1
  const revealed = step === last
  const done = revealed

  const greedyFinalPacked = greedy[greedy.length - 1].packed
  const greedyFinal = greedy[greedy.length - 1].value
  const greedyWaste =
    CAP - greedyFinalPacked.reduce((s, i) => s + ITEMS[i].w, 0)
  const shownGreedy = step >= 1 ? greedy[Math.min(step, N) - 1] : null
  const packedNow = revealed ? opt.set : shownGreedy ? shownGreedy.packed : []
  const greedyScore = shownGreedy ? shownGreedy.value : 0

  let note: string
  if (step === 0) {
    note =
      'Ο πιο φυσικός άπληστος κανόνας: ταξινόμησε τα αντικείμενα κατά λόγο αξίας/βάρους και πάρε καθένα που χωράει ακόμα. Πάτα «Επόμενο» και δες πού καταλήγει.'
  } else if (!revealed) {
    const g = shownGreedy!
    const it = ITEMS[g.idx]
    const ratio = (it.v / it.w).toFixed(2)
    const free = CAP - g.usedBefore
    note = g.fits
      ? `Αντικείμενο ${g.idx + 1} — βάρος ${it.w}, αξία ${it.v}, λόγος ${ratio}. Χωράει στα ${free} ελεύθερα κιλά → μπαίνει στο σακίδιο.`
      : `Αντικείμενο ${g.idx + 1} — βάρος ${it.w}, αξία ${it.v}, λόγος ${ratio}. Χρειάζεται ${it.w} κιλά αλλά μένουν μόνο ${free} → απορρίπτεται.`
  } else {
    note = `Ο άπληστος γέμισε το σακίδιο με μικρά «καλόλογα» αντικείμενα και κόλλησε στην αξία ${greedyFinal}, με ${greedyWaste} κιλά αναξιοποίητα. Το βέλτιστο θυσιάζει τον λόγο για να γεμίσει ΑΚΡΙΒΩΣ το σακίδιο: αντικείμενα ${opt.set.map((i) => i + 1).join(' και ')}, βάρος ${CAP}, αξία ${opt.value}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο άπληστος «καλύτερος λόγος» στο σακίδιο
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Χωρητικότητα W = {CAP}
        </span>
      </div>

      {/* item cards with ratios */}
      <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {ITEMS.map((it, i) => {
          const inBag = packedNow.includes(i)
          return (
            <div
              key={i}
              className={cn(
                'rounded-lg border px-2 py-1.5 text-center transition-all',
                inBag ? ITEM_FILL[i] : 'border-border bg-bg-soft/40',
              )}
            >
              <div className="text-xs font-bold text-fg">Αντικείμενο {i + 1}</div>
              <div className="font-mono text-[0.7rem] text-fg-muted">
                β{it.w} · α{it.v} · λόγος {(it.v / it.w).toFixed(2)}
              </div>
            </div>
          )
        })}
      </div>

      {/* the bag */}
      <div className="mb-1 flex items-center justify-between text-xs font-semibold text-fg-subtle">
        <span>{revealed ? 'Το βέλτιστο σακίδιο' : 'Το σακίδιο του άπληστου'}</span>
        <span>γεμάτο: {packedNow.reduce((s, i) => s + ITEMS[i].w, 0)} / {CAP} κιλά</span>
      </div>
      <BagBar packed={packedNow} />

      {/* scoreboard */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center',
            revealed ? 'border-danger/40 bg-danger/5' : 'border-border bg-bg-soft/40',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Άπληστος
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {revealed ? greedyFinal : greedyScore}
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2 text-center transition-opacity',
            revealed
              ? 'border-success/50 bg-success/10'
              : 'border-border bg-bg-soft/40 opacity-50',
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Βέλτιστο
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-fg">
            {revealed ? opt.value : '·'}
          </div>
        </div>
      </div>
      {revealed && (
        <p className="mt-1.5 text-center text-sm font-bold text-danger">
          ✗ Ο άπληστος χάνει {opt.value - greedyFinal} — πιάνει μόλις το{' '}
          {Math.round((greedyFinal / opt.value) * 100)}% του βέλτιστου.
        </p>
      )}

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
          {step === N ? 'Δες το βέλτιστο' : 'Επόμενο'}
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
