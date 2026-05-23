'use client'

/**
 * FractionalVsZeroOneKnapsack — same items, same bag, two rule sets.
 *
 * The canonical front-set-7-ask12 instance: w=(10,20,30), v=(60,80,90),
 * W=50. Ratios are (6, 4, 3) — already in decreasing order.
 *
 * Tab «Κλασματικό» — greedy by ratio packs item-1 whole (10/10, value 60),
 * item-2 whole (20/20, value 80), then a 20/30 SLICE of item-3 worth 60.
 * Total weight 50, value 200. Greedy is OPTIMAL.
 *
 * Tab «0-1» — same greedy rule packs item-1 (w=10, v=60), item-2 (w=20,
 * v=80), then item-3 doesn't fit whole (w=30, but only 20 kg left) and we
 * CAN'T take a slice — total value 140. But the OPTIMUM (brute-force) is
 * item-2 + item-3 (w=20+30=50 ✓, v=80+90=170). Greedy loses by 30.
 *
 * The visceral lesson: the «λίγο από κάτι ακριβό» that saves the
 * fractional version is exactly what's forbidden in 0-1.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { id: number; name: string; w: number; v: number }
const ITEMS: Item[] = [
  { id: 1, name: 'A', w: 10, v: 60 },
  { id: 2, name: 'B', w: 20, v: 80 },
  { id: 3, name: 'C', w: 30, v: 90 },
]
const W = 50

const ITEM_COLOR: Record<number, string> = {
  1: 'border-sky-500 bg-sky-500/20',
  2: 'border-emerald-500 bg-emerald-500/20',
  3: 'border-amber-500 bg-amber-500/20',
}
const ITEM_BAR: Record<number, string> = {
  1: 'bg-sky-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
}

type Mode = 'fractional' | 'zeroone'

type Step = {
  itemId: number
  /** weight of this item placed at this step (whole or sliced) */
  added: number
  /** value gained at this step */
  value: number
  /** running used weight after this step */
  used: number
  /** running value after this step */
  totalValue: number
  /** rule applied this step */
  note: string
  /** what fraction of item went in (1 = whole, 0 = none, between = slice) */
  fraction: number
}

/** Compute the steps for fractional greedy. */
function fractionalSteps(): Step[] {
  const out: Step[] = []
  let used = 0
  let value = 0
  for (const it of ITEMS) {
    if (used >= W) break
    if (used + it.w <= W) {
      used += it.w
      value += it.v
      out.push({
        itemId: it.id,
        added: it.w,
        value: it.v,
        used,
        totalValue: value,
        fraction: 1,
        note: `${it.name} χωράει ολόκληρο (${it.w} kg ≤ ${W - (used - it.w)} kg διαθέσιμα). Πάμε.`,
      })
    } else {
      const slice = W - used
      const sliceValue = (slice / it.w) * it.v
      used = W
      value += sliceValue
      out.push({
        itemId: it.id,
        added: slice,
        value: sliceValue,
        used,
        totalValue: value,
        fraction: slice / it.w,
        note: `${it.name} δεν χωράει ολόκληρο (${it.w} > ${slice}). Κόβουμε ${slice}/${it.w} = ${(
          (slice / it.w) *
          100
        ).toFixed(0)}% του ${it.name} και η τσάντα γεμίζει.`,
      })
      break
    }
  }
  return out
}

/** Compute the steps for 0-1 greedy (same ratio order, but cannot slice). */
function zeroOneSteps(): Step[] {
  const out: Step[] = []
  let used = 0
  let value = 0
  for (const it of ITEMS) {
    if (used + it.w <= W) {
      used += it.w
      value += it.v
      out.push({
        itemId: it.id,
        added: it.w,
        value: it.v,
        used,
        totalValue: value,
        fraction: 1,
        note: `${it.name} χωράει ολόκληρο (${it.w} ≤ ${W - (used - it.w)}). Παίρνουμε.`,
      })
    } else {
      out.push({
        itemId: it.id,
        added: 0,
        value: 0,
        used,
        totalValue: value,
        fraction: 0,
        note: `${it.name} δεν χωράει (${it.w} > ${W - used}). 0-1 ΔΕΝ επιτρέπει κόψιμο — απορρίπτεται.`,
      })
    }
  }
  return out
}

/** Brute-force optimum over all 2^n subsets. */
function optimum(): { value: number; chosen: number[] } {
  let best = { value: 0, chosen: [] as number[] }
  for (let mask = 0; mask < 1 << ITEMS.length; mask++) {
    let w = 0
    let v = 0
    const set: number[] = []
    for (let i = 0; i < ITEMS.length; i++) {
      if (mask & (1 << i)) {
        w += ITEMS[i].w
        v += ITEMS[i].v
        set.push(ITEMS[i].id)
      }
    }
    if (w <= W && v > best.value) best = { value: v, chosen: set }
  }
  return best
}

const FRACTIONAL = fractionalSteps()
const ZERO_ONE = zeroOneSteps()
const OPT = optimum()

export function FractionalVsZeroOneKnapsack() {
  const [mode, setMode] = useState<Mode>('fractional')
  const [step, setStep] = useState(0)

  const trace = mode === 'fractional' ? FRACTIONAL : ZERO_ONE
  const last = trace.length
  const swapMode = (m: Mode) => {
    setMode(m)
    setStep(0)
  }

  const slice = trace.slice(0, step)
  const used = slice.reduce((s, x) => s + x.added, 0)
  const totalValue = slice.reduce((s, x) => s + x.value, 0)

  const greedyTotal =
    mode === 'fractional'
      ? FRACTIONAL.reduce((s, x) => s + x.value, 0)
      : ZERO_ONE.reduce((s, x) => s + x.value, 0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σακίδιο: κλασματικό vs 0-1 — ίδια αντικείμενα, ίδιο όριο, αντίθετα τέλη
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Βήμα {step}/{last}
        </span>
      </div>

      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => swapMode('fractional')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'fractional'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/70',
          )}
        >
          Κλασματικό σακίδιο (επιτρέπεται κόψιμο)
        </button>
        <button
          type="button"
          onClick={() => swapMode('zeroone')}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'zeroone'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/70',
          )}
        >
          0-1 σακίδιο (όλο ή τίποτα)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
        {/* item table */}
        <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Αντικείμενα (σειρά λόγου v/w ↓)
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-fg-muted">
                <th className="text-left">i</th>
                <th className="text-right">wᵢ</th>
                <th className="text-right">vᵢ</th>
                <th className="text-right">vᵢ/wᵢ</th>
                <th className="text-right">πήρα</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((it) => {
                const s = slice.find((x) => x.itemId === it.id)
                const taken = s
                  ? mode === 'fractional'
                    ? s.fraction === 1
                      ? '✓ ολόκληρο'
                      : `${(s.fraction * 100).toFixed(0)}%`
                    : s.fraction === 1
                      ? '✓ ολόκληρο'
                      : '— απορρίφθηκε'
                  : '…'
                return (
                  <tr key={it.id} className="border-t border-border/50">
                    <td className={cn('px-1 py-0.5 font-mono font-bold', ITEM_COLOR[it.id], 'border rounded')}>
                      {it.name}
                    </td>
                    <td className="px-1 py-0.5 text-right font-mono">{it.w}</td>
                    <td className="px-1 py-0.5 text-right font-mono">{it.v}</td>
                    <td className="px-1 py-0.5 text-right font-mono font-bold">
                      {(it.v / it.w).toFixed(1)}
                    </td>
                    <td className="px-1 py-0.5 text-right font-mono">{taken}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mt-2 rounded border border-border bg-bg-elevated px-2 py-1 text-[11px]">
            Χωρητικότητα <span className="font-mono font-bold">W = {W}</span>.
          </div>
        </div>

        {/* bag visualization */}
        <div className="rounded-lg border border-border bg-bg-soft/60 p-3">
          <div className="mb-1 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <span>Τσάντα</span>
            <span className="font-mono normal-case">
              {used.toFixed(0)} / {W} kg · αξία {totalValue.toFixed(0)}
            </span>
          </div>
          <div className="relative h-12 overflow-hidden rounded border-2 border-border bg-bg-elevated">
            {(() => {
              let offset = 0
              return slice
                .filter((s) => s.added > 0)
                .map((s, i) => {
                  const widthPct = (s.added / W) * 100
                  const left = (offset / W) * 100
                  offset += s.added
                  return (
                    <div
                      key={i}
                      className={cn(
                        'absolute top-0 h-full border-r border-border/40 transition-all',
                        ITEM_BAR[s.itemId],
                      )}
                      style={{ left: `${left}%`, width: `${widthPct}%` }}
                      title={`${ITEMS.find((it) => it.id === s.itemId)?.name}: ${s.added.toFixed(0)} kg`}
                    >
                      <div className="flex h-full items-center justify-center text-xs font-bold text-white">
                        {ITEMS.find((it) => it.id === s.itemId)?.name}
                        {s.fraction < 1 && (
                          <span className="ml-1 text-[10px] opacity-90">
                            ({(s.fraction * 100).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
            })()}
          </div>
          {/* note */}
          <div className="mt-2 min-h-[2.5rem] rounded border border-border bg-bg-elevated px-2 py-1 text-xs">
            {step === 0
              ? 'Πάμε με σειρά λόγου v/w. Πρώτο: το αντικείμενο με τον υψηλότερο λόγο.'
              : trace[step - 1].note}
          </div>
        </div>
      </div>

      {/* verdict */}
      {step === last && (
        <div
          className={cn(
            'mt-3 rounded-lg border p-3 text-sm',
            mode === 'fractional'
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : 'border-rose-500/60 bg-rose-500/10',
          )}
        >
          {mode === 'fractional' ? (
            <>
              <strong className="text-emerald-700 dark:text-emerald-300">
                Άπληστος = βέλτιστος.
              </strong>{' '}
              Σύνολο αξίας <span className="font-mono font-bold">{greedyTotal.toFixed(0)}</span>.
              Όλο και κάτι παραπάνω από κάθε άλλη επιλογή — η ορθότητα ζει στη δυνατότητα να κόψεις
              μια φέτα από το «καλύτερο» αντικείμενο.
            </>
          ) : (
            <>
              <strong className="text-rose-700 dark:text-rose-300">Άπληστος ≠ βέλτιστος.</strong>{' '}
              Άπληστος: <span className="font-mono font-bold">{greedyTotal}</span>. ΒΕΛΤΙΣΤΟΣ:{' '}
              <span className="font-mono font-bold">{OPT.value}</span> ={' '}
              {OPT.chosen.map((id) => ITEMS.find((it) => it.id === id)?.name).join(' + ')}{' '}
              (w={OPT.chosen.reduce((s, id) => s + ITEMS.find((it) => it.id === id)!.w, 0)}, ακριβώς
              W). Η σειρά λόγου άφησε «τυφλό σημείο» τις 20 kg κενές, που τις γέμιζε ένα μόνο μεγάλο
              αντικείμενο.
            </>
          )}
        </div>
      )}

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
          disabled={step >= last}
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
      </div>
    </section>
  )
}
