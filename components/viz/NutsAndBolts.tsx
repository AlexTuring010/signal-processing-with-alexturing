'use client'

/**
 * NutsAndBolts — randomized cross-pivot matching.
 *
 * For front-set-5-ask2. Two rows of differently-sized objects: nuts
 * (top) and bolts (bottom). The only allowed operation is the
 * comparison device: nut.compare(bolt) → {<, =, >}. No nut-vs-nut, no
 * bolt-vs-bolt. The randomized algorithm:
 *   1. Pick a random nut N as the pivot.
 *   2. Sweep all bolts; the device partitions bolts into (smaller, =, larger).
 *   3. The one matching bolt B is now a pivot for nuts.
 *   4. Sweep all nuts; partition into (smaller, =, larger).
 *   5. Recurse on (small nuts, small bolts) and (large nuts, large bolts).
 *
 * The viz steps through one level of recursion on a fixed instance of
 * 8 nut/bolt pairs (sizes 1..8 reshuffled). Steps:
 *   step 0: initial state — both rows scrambled, no pivot.
 *   step 1: pivot nut chosen at random — highlighted yellow.
 *   step 2..2+n: per-bolt comparison, bolt gets colored & moved into bins.
 *   step 2+n+1: matching bolt found, becomes pivot for nuts.
 *   step 2+n+2..: per-nut comparison & binning.
 *   step end: two sub-instances drawn separately.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

// 8 nut/bolt sizes 1..8 (matching pair = same number).
const NUTS = [5, 2, 8, 1, 6, 4, 7, 3]
const BOLTS = [3, 7, 1, 5, 6, 8, 2, 4]
const PIVOT_NUT_INDEX = 0 // we "randomly" pick the first nut, which is size 5

const W_TOTAL = 28 // base width for size scale

const sizeStyle = (s: number) => ({
  width: `${W_TOTAL + s * 4}px`,
  height: `${20 + s * 3}px`,
})

type Phase =
  | { kind: 'init' }
  | { kind: 'pivot-picked' }
  | { kind: 'bolt-scan'; sweptUpto: number } // 0-indexed bolt cursor
  | { kind: 'bolt-pivot-found' }
  | { kind: 'nut-scan'; sweptUpto: number }
  | { kind: 'done' }

function buildSteps(): Phase[] {
  const steps: Phase[] = [{ kind: 'init' }, { kind: 'pivot-picked' }]
  for (let i = 0; i < BOLTS.length; i++) steps.push({ kind: 'bolt-scan', sweptUpto: i })
  steps.push({ kind: 'bolt-pivot-found' })
  for (let i = 0; i < NUTS.length; i++) steps.push({ kind: 'nut-scan', sweptUpto: i })
  steps.push({ kind: 'done' })
  return steps
}

function compareToPivot(value: number, pivot: number): 'lt' | 'eq' | 'gt' {
  if (value < pivot) return 'lt'
  if (value > pivot) return 'gt'
  return 'eq'
}

export function NutsAndBolts() {
  const steps = useMemo(buildSteps, [])
  const [step, setStep] = useState(0)
  const cur = steps[Math.min(step, steps.length - 1)]
  const finished = cur.kind === 'done'

  const pivotNut = NUTS[PIVOT_NUT_INDEX]

  // Bolt classification state (only known after each bolt scan or after
  // bolt-pivot-found).
  const knownBoltsUpto = (() => {
    if (cur.kind === 'bolt-scan') return cur.sweptUpto + 1
    if (cur.kind === 'bolt-pivot-found') return BOLTS.length
    if (cur.kind === 'nut-scan' || cur.kind === 'done') return BOLTS.length
    return 0
  })()
  const knownNutsUpto = (() => {
    if (cur.kind === 'nut-scan') return cur.sweptUpto + 1
    if (cur.kind === 'done') return NUTS.length
    return 0
  })()
  const boltsKnown = BOLTS.slice(0, knownBoltsUpto)
  const boltVerdicts = boltsKnown.map((b) => compareToPivot(b, pivotNut))

  const matchingBoltSize =
    cur.kind === 'bolt-pivot-found' || cur.kind === 'nut-scan' || cur.kind === 'done'
      ? pivotNut
      : null
  const nutVerdicts = NUTS.slice(0, knownNutsUpto).map((n) =>
    matchingBoltSize !== null ? compareToPivot(n, matchingBoltSize) : 'eq',
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Βίδες ↔ Παξιμάδια — pivot από τη μία πλευρά, διαμέριση στην άλλη
        </div>
        <div className="text-xs text-fg-subtle">n = {NUTS.length}</div>
      </div>

      {/* Nuts row */}
      <div className="mb-2 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-1 text-xs uppercase tracking-wider text-fg-subtle">
          Παξιμάδια
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {NUTS.map((n, i) => {
            const isPivot = i === PIVOT_NUT_INDEX && cur.kind !== 'init'
            const v = i < knownNutsUpto ? nutVerdicts[i] : null
            const tint = isPivot
              ? 'bg-yellow-500/30 border-yellow-500'
              : v === 'lt'
                ? 'bg-rose-500/30 border-rose-500'
                : v === 'gt'
                  ? 'bg-emerald-500/30 border-emerald-500'
                  : v === 'eq'
                    ? 'bg-sky-500/30 border-sky-500'
                    : 'bg-bg-elevated border-border'
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold text-fg',
                  tint,
                )}
                style={sizeStyle(n)}
                title={`size ${n}`}
              >
                {n}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bolts row */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-1 text-xs uppercase tracking-wider text-fg-subtle">
          Βίδες
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {BOLTS.map((b, i) => {
            const v = i < knownBoltsUpto ? boltVerdicts[i] : null
            const tint =
              v === 'lt'
                ? 'bg-rose-500/30 border-rose-500'
                : v === 'gt'
                  ? 'bg-emerald-500/30 border-emerald-500'
                  : v === 'eq'
                    ? 'bg-yellow-500/30 border-yellow-500'
                    : 'bg-bg-elevated border-border'
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-center rounded border-2 font-mono text-[11px] font-bold text-fg',
                  tint,
                )}
                style={sizeStyle(b)}
              >
                {b}
              </div>
            )
          })}
        </div>
      </div>

      {/* Action description */}
      <p className="mb-3 rounded-md border border-border bg-bg-soft/30 px-3 py-2 text-xs text-fg-muted">
        {cur.kind === 'init' && (
          <>Δύο σειρές χωρίς γνωστές σχέσεις. Η μόνη συσκευή συγκρίνει ένα παξιμάδι με μία βίδα.</>
        )}
        {cur.kind === 'pivot-picked' && (
          <>
            Διαλέγουμε ένα <strong>τυχαίο παξιμάδι</strong> (κίτρινο, μέγεθος {pivotNut}) ως pivot.
            Θα δοκιμαστεί διαδοχικά με κάθε βίδα.
          </>
        )}
        {cur.kind === 'bolt-scan' && (
          <>
            Δοκιμή με βίδα #{cur.sweptUpto + 1} (μέγεθος {BOLTS[cur.sweptUpto]}) → {' '}
            {compareToPivot(BOLTS[cur.sweptUpto], pivotNut) === 'lt' && 'μικρότερη (πάει αριστερά)'}
            {compareToPivot(BOLTS[cur.sweptUpto], pivotNut) === 'gt' && 'μεγαλύτερη (πάει δεξιά)'}
            {compareToPivot(BOLTS[cur.sweptUpto], pivotNut) === 'eq' && '★ ΤΑΙΡΙΑΖΕΙ'}
          </>
        )}
        {cur.kind === 'bolt-pivot-found' && (
          <>
            Η βίδα μεγέθους <strong>{pivotNut}</strong> ταίριαξε — γίνεται τώρα pivot
            για τη σειρά των <em>παξιμαδιών</em>. Άλλη μία σάρωση {NUTS.length} συγκρίσεων.
          </>
        )}
        {cur.kind === 'nut-scan' && (
          <>
            Δοκιμή με παξιμάδι #{cur.sweptUpto + 1} (μέγεθος {NUTS[cur.sweptUpto]}) → {' '}
            {compareToPivot(NUTS[cur.sweptUpto], pivotNut) === 'lt' && 'μικρότερο (αριστερά)'}
            {compareToPivot(NUTS[cur.sweptUpto], pivotNut) === 'gt' && 'μεγαλύτερο (δεξιά)'}
            {compareToPivot(NUTS[cur.sweptUpto], pivotNut) === 'eq' && '★ Είναι ο pivot — μεσαία ζώνη.'}
          </>
        )}
        {cur.kind === 'done' && (
          <>
            Τέρμα του επιπέδου. Έχουμε δύο ισόμετρα ζεύγη υπο-συνόλων (μικρά
            παξιμάδια ↔ μικρές βίδες) και (μεγάλα ↔ μεγάλες). Αναδρομή σε καθένα.
          </>
        )}
      </p>

      {/* Bins, after both sweeps */}
      {finished && (
        <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 px-2 py-2">
            <div className="mb-1 font-semibold text-rose-300">Αριστερό υπο-πρόβλημα</div>
            <div className="text-fg-muted">
              Παξιμάδια: {NUTS.filter((n) => n < pivotNut).join(', ')}
            </div>
            <div className="text-fg-muted">
              Βίδες: {BOLTS.filter((b) => b < pivotNut).join(', ')}
            </div>
          </div>
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 px-2 py-2">
            <div className="mb-1 font-semibold text-yellow-300">Ταίρι</div>
            <div className="text-fg-muted">
              παξιμάδι {pivotNut} ↔ βίδα {pivotNut}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-2 py-2">
            <div className="mb-1 font-semibold text-emerald-300">Δεξί υπο-πρόβλημα</div>
            <div className="text-fg-muted">
              Παξιμάδια: {NUTS.filter((n) => n > pivotNut).join(', ')}
            </div>
            <div className="text-fg-muted">
              Βίδες: {BOLTS.filter((b) => b > pivotNut).join(', ')}
            </div>
          </div>
        </div>
      )}

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
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={finished}
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
          >
            Επόμενο →
          </button>
        </div>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {steps.length}
        </span>
      </div>
    </section>
  )
}
