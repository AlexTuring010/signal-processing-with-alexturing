'use client'

/**
 * CoinChangeLab — the same greedy rule, two different verdicts.
 *
 * Both pt2-th2-3 and front-set-6-ask5 ask whether «πάντα το μεγαλύτερο κέρμα»
 * gives the minimum number of coins. The answer depends entirely on the coin
 * system. This viz puts both systems side by side under the SAME stepper: a
 * row of available coins on top, the greedy build-up on the left, the optimum
 * on the right, and a chip showing whether the two are tied or whether greedy
 * paid more. Lands the lesson that a "reasonable" greedy rule is not a proof
 * — and the breaking instance for {1,10,25} is one click away. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Instance = 'bad-system' | 'us-system'

type Preset = {
  label: string
  coins: number[]
  target: number
  /** the brute-force optimum — fewest coins to make `target` */
  optimum: number[]
  /** one-liner shown above the canvas */
  intro: string
  /** verdict shown at end */
  verdict: 'tied' | 'greedy-loses'
}

const PRESETS: Record<Instance, Preset> = {
  'bad-system': {
    label: 'Σύστημα {1, 10, 25} — ρέστα 30',
    coins: [25, 10, 1],
    target: 30,
    optimum: [10, 10, 10],
    intro:
      'Νομίσματα {1, 10, 25}· πρέπει να δώσουμε ρέστα 30. Ο άπληστος αρπάζει πρώτα το 25 και μετά το πληρώνει.',
    verdict: 'greedy-loses',
  },
  'us-system': {
    label: 'Σύστημα {1, 5, 10, 25} — ρέστα 30',
    coins: [25, 10, 5, 1],
    target: 30,
    optimum: [10, 10, 10],
    intro:
      'Νομίσματα {1, 5, 10, 25}· πρέπει να δώσουμε ρέστα 30. Με αυτό το σύστημα ο ίδιος άπληστος κανόνας ΠΕΤΥΧΑΙΝΕΙ — δες πώς.',
    verdict: 'tied',
  },
}

/** Run the greedy "largest coin that fits" — return the sequence of coins picked. */
function runGreedy(coins: number[], target: number): number[] {
  const out: number[] = []
  let rem = target
  const desc = [...coins].sort((a, b) => b - a)
  while (rem > 0) {
    const c = desc.find((x) => x <= rem)
    if (c === undefined) break
    out.push(c)
    rem -= c
  }
  return out
}

const INSTANCES: Instance[] = ['bad-system', 'us-system']

const SWATCH: Record<number, string> = {
  1: '#facc15',
  5: '#a78bfa',
  10: '#60a5fa',
  25: '#fb923c',
}

function coinClass(c: number) {
  return SWATCH[c] ?? '#cdbfc0'
}

export function CoinChangeLab() {
  const [instance, setInstance] = useState<Instance>('bad-system')
  const [step, setStep] = useState(0)

  const preset = PRESETS[instance]
  const greedy = useMemo(
    () => runGreedy(preset.coins, preset.target),
    [preset.coins, preset.target],
  )
  const last = greedy.length
  const done = step === last

  function pick(i: Instance) {
    setInstance(i)
    setStep(0)
  }

  const greedySoFar = greedy.slice(0, step)
  const greedySum = greedySoFar.reduce((s, x) => s + x, 0)
  const remaining = preset.target - greedySum
  const greedyTotal = greedy.length
  const optTotal = preset.optimum.length

  let note: string
  if (step === 0) {
    note = preset.intro + ' Πάτα «Επόμενο» για το πρώτο νόμισμα.'
  } else if (!done) {
    const last = greedySoFar[greedySoFar.length - 1]
    note = `Άπληστο νόμισμα νο. ${step}: το μεγαλύτερο που χωρά στο υπόλοιπο ${remaining + last} είναι το ${last}. Μένουν ${remaining}.`
  } else if (preset.verdict === 'tied') {
    note = `Ο άπληστος έδωσε ${greedyTotal} κέρματα — ίδια με τη βέλτιστη (${optTotal}). Εδώ ο κανόνας δουλεύει· χρειάζεται όμως απόδειξη.`
  } else {
    note = `Ο άπληστος έδωσε ${greedyTotal} κέρματα — η βέλτιστη μόνο ${optTotal}. Ένα αντιπαράδειγμα αρκεί: ο κανόνας ΔΕΝ είναι βέλτιστος για αυτό το σύστημα.`
  }

  const success = done && preset.verdict === 'tied'
  const fail = done && preset.verdict === 'greedy-loses'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ρέστα με τον ελάχιστο αριθμό νομισμάτων
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {INSTANCES.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                instance === i
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {PRESETS[i].label}
            </button>
          ))}
        </div>
      </div>

      {/* available coins palette */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Διαθέσιμα
        </span>
        {preset.coins.map((c) => (
          <span
            key={c}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: coinClass(c), borderColor: coinClass(c) }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* two columns: greedy (left) vs optimum (right) */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* greedy column */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Άπληστος
            </span>
            <span className="text-xs text-fg-subtle">
              {greedySoFar.length}/{greedyTotal} κέρμα
              {greedyTotal === 1 ? '' : 'τα'}
            </span>
          </div>
          <div className="flex min-h-[3rem] flex-wrap items-center gap-1.5">
            {greedy.map((c, i) => {
              const placed = i < greedySoFar.length
              const isLast = i === greedySoFar.length - 1
              return (
                <span
                  key={i}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition-opacity',
                    placed ? 'text-white' : 'opacity-20',
                  )}
                  style={{
                    backgroundColor: placed ? coinClass(c) : '#cdbfc0',
                    borderColor: isLast ? '#d97706' : placed ? coinClass(c) : '#cdbfc0',
                    boxShadow: isLast ? '0 0 0 3px #fde68a' : undefined,
                  }}
                >
                  {c}
                </span>
              )
            })}
          </div>
          <div className="mt-2 text-xs">
            <span className="text-fg-subtle">Σύνολο: </span>
            <span className="font-mono font-semibold">
              {greedySum}
              {!done && (
                <span className="text-fg-subtle">
                  {' · '}μένουν <strong>{remaining}</strong>
                </span>
              )}
            </span>
          </div>
        </div>

        {/* optimum column */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Βέλτιστη
            </span>
            <span className="text-xs text-fg-subtle">
              {optTotal} κέρμα{optTotal === 1 ? '' : 'τα'}
            </span>
          </div>
          <div className="flex min-h-[3rem] flex-wrap items-center gap-1.5">
            {preset.optimum.map((c, i) => (
              <span
                key={i}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold text-white"
                style={{ backgroundColor: coinClass(c), borderColor: coinClass(c) }}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs">
            <span className="text-fg-subtle">Σύνολο: </span>
            <span className="font-mono font-semibold">{preset.target}</span>
          </div>
        </div>
      </div>

      {/* note + controls */}
      <p className="mt-3 text-xs leading-relaxed text-fg-muted">{note}</p>

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
              success && 'bg-emerald-100 text-emerald-800',
              fail && 'bg-rose-100 text-rose-800',
            )}
          >
            {success ? `✓ ${greedyTotal} = ${optTotal} — ισοβαθμία` : `✗ ${greedyTotal} > ${optTotal} — ο άπληστος χάνει`}
          </span>
        )}
      </div>
    </section>
  )
}
