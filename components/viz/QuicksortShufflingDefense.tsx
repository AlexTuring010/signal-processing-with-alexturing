'use client'

/**
 * QuicksortShufflingDefense — attack vs defence on first-element pivot.
 *
 * For front-set-5-ask3. Two tabs:
 *   • «Επίθεση» — input is sorted [1..n]. Pivot = A[0] is always the
 *     minimum: every partition splits as (empty | rest). The recursion
 *     tree is a left spine of depth n; cumulative comparison cost
 *     grows as 1+2+…+n = Θ(n²). Step through level by level, watch
 *     the bar grow.
 *   • «Άμυνα» — same input, but Fisher-Yates pre-shuffles. We trace
 *     the shuffle slot by slot (random j ∈ [i, n−1]; show the swap),
 *     then drop the (now scrambled) array into the recursive tree
 *     visualisation, which is now balanced. Final cost is Θ(n log n).
 *
 * The "random" choice in Fisher-Yates is deterministic for
 * reproducibility — seeded with a fixed value so every viewer sees the
 * same demo.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Mode = 'attack' | 'defence'

const N = 8
const SORTED = Array.from({ length: N }, (_, i) => i + 1) // [1,2,...,8]

// Deterministic "random" picks for Fisher-Yates so the demo is stable.
const FY_PICKS = [3, 6, 7, 4, 4, 1, 2, 0]

function fyTrace(input: number[]): { arr: number[]; i: number; j: number; before: number[] }[] {
  const arr = input.slice()
  const steps: { arr: number[]; i: number; j: number; before: number[] }[] = []
  for (let i = 0; i < arr.length - 1; i++) {
    const before = arr.slice()
    const j = Math.max(i, FY_PICKS[i % FY_PICKS.length] % arr.length)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    steps.push({ arr: arr.slice(), i, j, before })
  }
  return steps
}

// One level of quicksort partition with pivot = A[0].
function partitionFirstPivot(arr: number[]): { left: number[]; pivot: number; right: number[] } {
  const pivot = arr[0]
  const rest = arr.slice(1)
  return {
    pivot,
    left: rest.filter((v) => v < pivot),
    right: rest.filter((v) => v >= pivot),
  }
}

// Build a recursion-tree representation (each node = an array; leaves
// are size ≤ 1). Returns levels of arrays for drawing.
function buildLevels(arr: number[]): number[][][] {
  const levels: number[][][] = [[arr]]
  for (let d = 0; d < 8; d++) {
    const cur = levels[levels.length - 1]
    const next: number[][] = []
    let allLeaves = true
    for (const node of cur) {
      if (node.length <= 1) {
        next.push(node)
        continue
      }
      allLeaves = false
      const { left, pivot, right } = partitionFirstPivot(node)
      next.push(left.length ? left : [])
      next.push([pivot]) // pivot is "settled"
      next.push(right.length ? right : [])
    }
    if (allLeaves) break
    levels.push(next)
  }
  return levels
}

function arrCost(arr: number[]) {
  return Math.max(0, arr.length - 1)
}

export function QuicksortShufflingDefense() {
  const [mode, setMode] = useState<Mode>('attack')
  const [step, setStep] = useState(0)

  const fySteps = useMemo(() => fyTrace(SORTED), [])
  const shuffled = useMemo(
    () => (fySteps.length ? fySteps[fySteps.length - 1].arr : SORTED),
    [fySteps],
  )

  const inputForTree = mode === 'attack' ? SORTED : shuffled
  const levels = useMemo(() => buildLevels(inputForTree), [inputForTree])

  const maxStep = mode === 'attack' ? levels.length : fySteps.length + levels.length
  const cappedStep = Math.min(step, maxStep - 1)

  const inFyPhase = mode === 'defence' && cappedStep < fySteps.length
  const fyIndex = inFyPhase ? cappedStep : fySteps.length - 1
  const treeLevel = inFyPhase ? 0 : Math.min(cappedStep - (mode === 'defence' ? fySteps.length : 0), levels.length - 1)

  const cumulativeCost = (() => {
    let c = 0
    for (let d = 0; d <= treeLevel; d++) {
      for (const node of levels[d]) c += arrCost(node)
    }
    return c
  })()

  const theoreticalAttack = (N * (N - 1)) / 2
  const theoreticalDefence = Math.round(N * Math.log2(N))

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Quicksort με pivot το πρώτο στοιχείο — επίθεση και άμυνα
        </div>
        <div className="flex gap-1">
          {(['attack', 'defence'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setStep(0)
              }}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium',
                mode === m
                  ? 'border border-accent/50 bg-accent/15 text-accent'
                  : 'border border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/80',
              )}
            >
              {m === 'attack' ? '⚠ Επίθεση' : '🛡 Άμυνα (Fisher–Yates)'}
            </button>
          ))}
        </div>
      </div>

      {/* Input strip */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-1 flex items-baseline justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-fg-subtle">
            {mode === 'attack' ? 'Είσοδος του επιτιθέμενου (ταξινομημένη)' : (
              inFyPhase ? `Ανακάτεψη — i = ${fySteps[fyIndex].i + 1}, τυχαία j = ${fySteps[fyIndex].j + 1}` : 'Μετά την ανακάτεψη'
            )}
          </span>
          <span className="font-mono text-fg-muted">n = {N}</span>
        </div>
        <div className="flex justify-center gap-1">
          {(inFyPhase ? fySteps[fyIndex].arr : inputForTree).map((v, idx) => {
            const swappedThisStep =
              inFyPhase &&
              (idx === fySteps[fyIndex].i || idx === fySteps[fyIndex].j)
            return (
              <span
                key={idx}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded border font-mono text-sm font-bold',
                  swappedThisStep
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                    : 'border-border bg-bg-soft text-fg',
                )}
              >
                {v}
              </span>
            )
          })}
        </div>
      </div>

      {/* Recursion tree */}
      {!inFyPhase && (
        <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
          <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
            Δέντρο αναδρομής quicksort (pivot = A[0] κάθε κόμβου) — επίπεδα 0..{treeLevel}
          </div>
          <div className="space-y-1">
            {levels.slice(0, treeLevel + 1).map((row, d) => (
              <div key={d} className="flex flex-wrap items-center gap-1">
                <span className="w-10 text-right font-mono text-[10px] text-fg-subtle">
                  [{d}]
                </span>
                <div className="flex flex-1 flex-wrap gap-1">
                  {row.map((node, k) => (
                    <span
                      key={k}
                      className={cn(
                        'rounded border px-1.5 py-0.5 font-mono text-[10px]',
                        node.length === 0
                          ? 'border-border/40 text-fg-subtle opacity-40'
                          : node.length === 1
                            ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                            : mode === 'attack'
                              ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                      )}
                    >
                      {node.length === 0 ? '∅' : `[${node.join(',')}]`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost bar */}
      {!inFyPhase && (
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border bg-bg-soft/40 px-3 py-2">
            <div className="text-fg-subtle">Σωρευτικό κόστος (συγκρίσεις)</div>
            <div className="font-mono text-2xl text-fg">{cumulativeCost}</div>
          </div>
          <div className="rounded-md border border-border bg-bg-soft/40 px-3 py-2">
            <div className="text-fg-subtle">Ασυμπτωτικό όριο</div>
            <div className="font-mono text-fg">
              {mode === 'attack' ? (
                <>
                  Θ(n²) ≈ <span className="text-rose-300">{theoreticalAttack}</span>
                </>
              ) : (
                <>
                  Θ(n log n) ≈ <span className="text-emerald-300">{theoreticalDefence}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verdict bar */}
      <p className="mb-3 rounded-md border border-border bg-bg-soft/30 px-3 py-2 text-xs text-fg-muted">
        {mode === 'attack' && treeLevel === 0 && (
          <>
            Επίθεση: ο επιτιθέμενος στέλνει ταξινομημένα δεδομένα. Pivot = 1 = ελάχιστο →
            αριστερά ∅, δεξιά [2..8]. Το δέντρο θα γίνει αριστερή σκάλα βάθους n.
          </>
        )}
        {mode === 'attack' && treeLevel > 0 && (
          <>
            Κάθε επίπεδο: κενό αριστερά (αχρησιμοποίητη αναδρομή), 1 pivot στη μέση,{' '}
            {N - treeLevel - 1} στοιχεία δεξιά. Σταθερά διπλασιάζεται το βάθος, όχι ο
            πλάτος — αυτό είναι το χαρακτηριστικό υπογραφή του Θ(n²) στη quicksort.
          </>
        )}
        {mode === 'defence' && inFyPhase && (
          <>
            Fisher–Yates: σε κάθε θέση i, διάλεξε τυχαία θέση j ∈ [i, n−1] και αντάλλαξε.
            Μετά τις {N - 1} ανταλλαγές, η σειρά είναι ομοιόμορφα τυχαία — και ο
            επιτιθέμενος δεν μπορεί να την προβλέψει.
          </>
        )}
        {mode === 'defence' && !inFyPhase && (
          <>
            Άμυνα: η ίδια quicksort (πρώτο = pivot), αλλά τώρα τρέχει πάνω σε τυχαία
            είσοδο. Τα δέντρα μένουν σχεδόν ισορροπημένα — αναμενόμενος χρόνος{' '}
            Θ(n log n), ανεξάρτητα από το τι έστειλε ο επιτιθέμενος.
          </>
        )}
      </p>

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
            onClick={() => setStep((s) => Math.min(maxStep - 1, s + 1))}
            disabled={cappedStep >= maxStep - 1}
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
          >
            Επόμενο →
          </button>
        </div>
        <span className="text-xs text-fg-subtle">
          βήμα {cappedStep + 1} / {maxStep}
        </span>
      </div>
    </section>
  )
}
