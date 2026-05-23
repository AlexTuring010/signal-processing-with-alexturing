'use client'

/**
 * KnapsackRatioVsDp — the «greedy έτυχε να βγει βέλτιστος» moment for pt7-th3.
 *
 * The pt7-th3 instance (c = (16,9,7,15,10,1), a = (8,5,4,9,6,1), b = 12) is
 * a quiet trap: ratio-greedy on it produces 23 — AND so does the DP. The
 * student needs to feel both:
 *   (a) the greedy scan visibly arrives at 23 with bag {1, 3};
 *   (b) the DP arrives at exactly the same value via M[6][12] = 23.
 * The take-away is the dissonance: «but Knapsack is NP-hard, so the greedy
 * can't always work». And the answer — «not always, but on THIS instance,
 * yes; see KnapsackGreedyFail for the breaking case».
 *
 * Two synchronized panels, single step counter (0 … N+1):
 *   step k ∈ {1..N}: greedy considers item k; DP reveals row k.
 *   step N+1: DP backtracks; both panels show their final {1, 3} = 23.
 *
 * Built for L15 problem pt7-th3.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { i: number; a: number; c: number }

/** Instance from the prompt — already in descending-ratio order (lucky). */
const ITEMS: readonly Item[] = [
  { i: 1, a: 8, c: 16 },
  { i: 2, a: 5, c: 9 },
  { i: 3, a: 4, c: 7 },
  { i: 4, a: 9, c: 15 },
  { i: 5, a: 6, c: 10 },
  { i: 6, a: 1, c: 1 },
]
const B = 12
const N = ITEMS.length

type GreedyEvent =
  | { kind: 'take'; item: Item; remainingBefore: number; remainingAfter: number; valueAfter: number }
  | { kind: 'skip'; item: Item; remainingBefore: number; valueBefore: number; reason: string }

export function KnapsackRatioVsDp() {
  /** greedy scan trace, ordered by item.i (= ratio order here). */
  const greedyTrace = useMemo<GreedyEvent[]>(() => {
    const events: GreedyEvent[] = []
    let remaining = B
    let value = 0
    for (const item of ITEMS) {
      if (item.a <= remaining) {
        events.push({
          kind: 'take',
          item,
          remainingBefore: remaining,
          remainingAfter: remaining - item.a,
          valueAfter: value + item.c,
        })
        remaining -= item.a
        value += item.c
      } else {
        events.push({
          kind: 'skip',
          item,
          remainingBefore: remaining,
          valueBefore: value,
          reason: `απαιτεί ${item.a}, διαθέσιμα ${remaining}`,
        })
      }
    }
    return events
  }, [])

  const greedyTotal = greedyTrace
    .filter((e): e is Extract<GreedyEvent, { kind: 'take' }> => e.kind === 'take')
    .reduce((s, e) => s + e.item.c, 0)

  /** full DP table M[0..N][0..B] */
  const M = useMemo(() => {
    const t: number[][] = [Array(B + 1).fill(0)]
    for (let i = 1; i <= N; i++) {
      const row: number[] = []
      for (let w = 0; w <= B; w++) {
        const it = ITEMS[i - 1]
        row[w] =
          it.a > w
            ? t[i - 1][w]
            : Math.max(t[i - 1][w], it.c + t[i - 1][w - it.a])
      }
      t.push(row)
    }
    return t
  }, [])

  /** backtrack chosen items */
  const dpChosen = useMemo(() => {
    const chosen = new Set<number>()
    let w = B
    for (let i = N; i >= 1; i--) {
      if (M[i][w] !== M[i - 1][w]) {
        chosen.add(i)
        w -= ITEMS[i - 1].a
      }
    }
    return chosen
  }, [M])
  const dpTotal = M[N][B]

  /** steps: 0 = base, 1..N = consider item k, N+1 = backtrack/done */
  const last = N + 1
  const [step, setStep] = useState(0)
  const done = step === last

  /** which greedy events have happened by `step` */
  const greedyShown = greedyTrace.slice(0, step)
  const curGreedy = step >= 1 && step <= N ? greedyTrace[step - 1] : null
  const greedyRemaining = greedyShown.reduce(
    (r, e) => (e.kind === 'take' ? r - e.item.a : r),
    B,
  )
  const greedyValue = greedyShown
    .filter((e): e is Extract<GreedyEvent, { kind: 'take' }> => e.kind === 'take')
    .reduce((s, e) => s + e.item.c, 0)

  const dpRowsShown = Math.min(step, N) // 0..N
  const dpFocusRow = step >= 1 && step <= N ? step : 0
  const dpFocusItem = dpFocusRow >= 1 ? ITEMS[dpFocusRow - 1] : null

  let note: string
  if (step === 0) {
    note =
      'Δύο μέθοδοι, ίδια είσοδος — θα τις τρέξουμε δίπλα-δίπλα. Αριστερά ο άπληστος (φθίνον λόγο cᵢ/aᵢ)· δεξιά ο DP (πίνακας n × b). Πάτα «Επόμενο».'
  } else if (step <= N && curGreedy) {
    const r = (curGreedy.item.c / curGreedy.item.a).toFixed(2)
    if (curGreedy.kind === 'take') {
      note = `Βήμα ${step} — αντικείμενο ${curGreedy.item.i} (a=${curGreedy.item.a}, c=${curGreedy.item.c}, λόγος ${r}). ΕΙΣΕΡΧΕΤΑΙ: χωρητικότητα ${curGreedy.remainingBefore} → ${curGreedy.remainingAfter}, αξία ${curGreedy.valueAfter}. Παράλληλα, ο DP γέμισε τη γραμμή ${step}: M[${step}][${B}] = ${M[step][B]}.`
    } else {
      note = `Βήμα ${step} — αντικείμενο ${curGreedy.item.i} (a=${curGreedy.item.a}, c=${curGreedy.item.c}, λόγος ${r}). ΑΓΝΟΕΙΤΑΙ (${curGreedy.reason}). Παράλληλα, ο DP γέμισε τη γραμμή ${step}: M[${step}][${B}] = ${M[step][B]}.`
    }
  } else {
    note = `Τέλος. Άπληστος → ${greedyTotal}· DP → ${dpTotal}. Συμπίπτουν εδώ — και τα δύο επιλέγουν αντικείμενα {${[...dpChosen].sort((a, b) => a - b).join(', ')}}. Σε αυτό το στιγμιότυπο ο άπληστος βγαίνει τυχαία βέλτιστος· σε άλλη βάση (δες KnapsackGreedyFail στη διάλεξη) αποτυγχάνει.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Άπληστος vs DP στο pt7-th3 — δίπλα-δίπλα, ίδια είσοδος
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Άπληστος ${greedyTotal} = DP ${dpTotal}` : `b = ${B}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Λόγοι cᵢ/aᵢ ήδη φθίνοντες:{' '}
        {ITEMS.map(
          (it) => `${it.i}:${(it.c / it.a).toFixed(2)}`,
        ).join('  ·  ')}
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* greedy panel */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold text-fg">Άπληστος — λόγος αξίας/βάρους</h4>
            <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-xs text-fg">
              αξία = <strong className="text-accent">{greedyValue}</strong> · χώρος{' '}
              {greedyRemaining}/{B}
            </span>
          </div>
          <ol className="space-y-1.5">
            {ITEMS.map((item, idx) => {
              const event = greedyShown[idx]
              const isCurrent = step >= 1 && step - 1 === idx
              return (
                <li
                  key={item.i}
                  className={cn(
                    'flex items-center justify-between rounded border px-2 py-1.5 text-sm transition-colors',
                    !event && 'border-dashed border-border bg-transparent text-fg-subtle',
                    event?.kind === 'take' && 'border-success/60 bg-success/10 text-fg',
                    event?.kind === 'skip' && 'border-rose-400/50 bg-rose-400/10 text-fg',
                    isCurrent && 'ring-2 ring-accent',
                  )}
                >
                  <span className="font-mono">
                    <span className="font-bold">{item.i}.</span>{' '}
                    <span className="text-xs">a={item.a}, c={item.c}</span>
                  </span>
                  <span className="text-xs font-medium">
                    {event?.kind === 'take' && '✓ μπαίνει'}
                    {event?.kind === 'skip' && `✗ skip (${event.reason})`}
                    {!event && '…'}
                  </span>
                </li>
              )
            })}
          </ol>
          <div className="mt-2 rounded bg-bg-elevated px-2 py-1 text-xs font-mono text-fg">
            Επιλογή:{' '}
            <strong>
              {greedyShown
                .filter((e): e is Extract<GreedyEvent, { kind: 'take' }> => e.kind === 'take')
                .map((e) => e.item.i)
                .join(', ') || '—'}
            </strong>
          </div>
        </div>

        {/* DP panel */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold text-fg">DP — πίνακας M[i][w]</h4>
            <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-xs text-fg">
              M[{dpRowsShown}][{B}] ={' '}
              <strong className="text-accent">{M[dpRowsShown][B]}</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <div
              className="grid w-fit gap-px font-mono text-xs"
              style={{ gridTemplateColumns: `2.75rem repeat(${B + 1}, 1.55rem)` }}
            >
              <div />
              {Array.from({ length: B + 1 }, (_, w) => (
                <div
                  key={`hdp${w}`}
                  className={cn(
                    'flex h-5 items-center justify-center font-semibold',
                    w === B ? 'text-accent' : 'text-fg-subtle',
                  )}
                >
                  {w}
                </div>
              ))}
              {M.map((row, i) => {
                const revealed = i <= dpRowsShown
                return (
                  <div key={i} className="contents">
                    <div className="flex items-center px-1 text-[10px] font-semibold text-fg-subtle">
                      {i === 0 ? '0·∅' : `${i}·(${ITEMS[i - 1].a},${ITEMS[i - 1].c})`}
                    </div>
                    {row.map((val, w) => {
                      const isFocus = i === dpFocusRow && w === B && dpFocusRow > 0
                      const inBag = done && dpChosen.has(i)
                      return (
                        <div
                          key={w}
                          className={cn(
                            'flex h-6 items-center justify-center rounded border',
                            !revealed && 'border-dashed border-border text-transparent',
                            revealed && !isFocus && 'border-border bg-bg-elevated text-fg',
                            isFocus && 'border-accent bg-accent/25 font-bold text-fg',
                            inBag && w === B && 'ring-2 ring-emerald-500',
                          )}
                        >
                          {revealed ? val : '·'}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
          {dpFocusItem && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded border border-border bg-bg-elevated px-2 py-1 text-xs">
                <span className="text-fg-subtle">ΕΞΩ:</span> M[{dpFocusRow - 1}][{B}]
                = <strong>{M[dpFocusRow - 1][B]}</strong>
              </div>
              <div className="rounded border border-border bg-bg-elevated px-2 py-1 text-xs">
                <span className="text-fg-subtle">ΜΕΣΑ:</span>
                {dpFocusItem.a <= B
                  ? ` ${dpFocusItem.c} + M[${dpFocusRow - 1}][${B - dpFocusItem.a}] = `
                  : ' (δεν χωράει) '}
                <strong>
                  {dpFocusItem.a <= B
                    ? dpFocusItem.c + M[dpFocusRow - 1][B - dpFocusItem.a]
                    : '—'}
                </strong>
              </div>
            </div>
          )}
          {done && (
            <div className="mt-2 rounded bg-bg-elevated px-2 py-1 text-xs font-mono text-fg">
              Επιλογή:{' '}
              <strong>{[...dpChosen].sort((a, b) => a - b).join(', ')}</strong>
            </div>
          )}
        </div>
      </div>

      {/* verdict footer when done */}
      {done && (
        <div className="mt-3 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm leading-relaxed text-fg">
          <strong>Συμπίπτουν στις {dpTotal}.</strong> Σε αυτή τη βάση είσοδος, ο
          άπληστος βγαίνει τυχαία βέλτιστος. Σε γενικό 0-1 σακίδιο όμως αυτό{' '}
          <em>δεν</em> ισχύει: το πρόβλημα είναι NP-δύσκολο, και πολυωνυμικός
          άπληστος που να βρίσκει το βέλτιστο πάντα θα έδινε P = NP. Δες το
          KnapsackGreedyFail στη διάλεξη για είσοδο όπου σπάει.
        </div>
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
          {step < N ? 'Επόμενο βήμα' : step === N ? 'Επιβεβαίωση' : 'Τέλος'}
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
