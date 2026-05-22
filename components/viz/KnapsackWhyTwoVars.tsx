'use client'

/**
 * KnapsackWhyTwoVars — why a single index cannot describe a knapsack
 * subproblem. The headline lesson of L15: «sometimes you need a second
 * variable».
 *
 * The naive recurrence OPT(i) = «best value using the first i items» is one
 * number. This viz shows that one number cannot exist. It pits two editable
 * choices for the first three items against each other:
 *
 *  - the default trap — A = {1} (value 3, lots of room) vs B = {1,2}
 *    (value 7, nearly full). B is worth MORE now, yet leaves no room for
 *    item 4 and so ends WORSE: 7 against 9.
 *
 * The locally-best prefix is globally worse — because the value of a prefix
 * depends on how much capacity it leaves behind. So the subproblem must be
 * indexed by (i, w). Built for L15 on the shared knapsack instance.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KNAPSACK_ITEMS, KNAPSACK_CAP } from './knapsack-instance'

const ITEMS = KNAPSACK_ITEMS
const CAP = KNAPSACK_CAP
const LAST = ITEMS[ITEMS.length - 1] // item 4 — the «remaining» item
const PREFIX = ITEMS.length - 1 // items 1..3 are the editable prefix

const ITEM_FILL = [
  'bg-sky-500/35 border-sky-500/70',
  'bg-emerald-500/35 border-emerald-500/70',
  'bg-amber-500/35 border-amber-500/70',
]

type Sel = boolean[]

function analyse(sel: Sel) {
  const chosen: number[] = []
  let weight = 0
  let value = 0
  for (let i = 0; i < PREFIX; i++) {
    if (sel[i]) {
      chosen.push(i)
      weight += ITEMS[i].w
      value += ITEMS[i].v
    }
  }
  const valid = weight <= CAP
  const leftover = CAP - weight
  const fits4 = valid && leftover >= LAST.w
  const final = valid ? value + (fits4 ? LAST.v : 0) : -1
  return { chosen, weight, value, valid, leftover, fits4, final }
}

type Analysis = ReturnType<typeof analyse>

/** the «what fits now» bag bar — packed items, then the empty leftover */
function Bag({ a }: { a: Analysis }) {
  if (!a.valid) {
    return (
      <div className="flex h-9 w-full items-center justify-center rounded-md border border-danger/50 bg-danger/10 text-xs font-bold text-danger">
        βάρος {a.weight} &gt; {CAP} — δεν χωράει στο σακίδιο
      </div>
    )
  }
  return (
    <div className="flex h-9 w-full overflow-hidden rounded-md border border-border">
      {a.chosen.map((i) => (
        <div
          key={i}
          style={{ flex: `${ITEMS[i].w} 0 0%` }}
          className={cn(
            'flex items-center justify-center border-r border-border/60 text-[0.7rem] font-bold text-fg last:border-r-0',
            ITEM_FILL[i],
          )}
        >
          {i + 1}
        </div>
      ))}
      {a.leftover > 0 && (
        <div
          style={{ flex: `${a.leftover} 0 0%` }}
          className="flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(148,148,165,0.16)_6px,rgba(148,148,165,0.16)_12px)] text-[0.65rem] font-medium text-fg-subtle"
        >
          {a.leftover} ελεύθερα
        </div>
      )}
    </div>
  )
}

/** does item 4 fit in the leftover? a ghost block tries to slot in */
function Item4Track({ a }: { a: Analysis }) {
  if (!a.valid) return null
  return (
    <div className="relative h-7 w-full overflow-hidden rounded-md border border-border bg-bg-soft/40">
      {/* the slice already used by the prefix */}
      <div
        style={{ width: `${(a.weight / CAP) * 100}%` }}
        className="absolute inset-y-0 left-0 bg-fg-subtle/10"
      />
      {/* item 4 trying to enter, starting right after the prefix */}
      <div
        style={{
          left: `${(a.weight / CAP) * 100}%`,
          width: `${(LAST.w / CAP) * 100}%`,
        }}
        className={cn(
          'absolute inset-y-0 flex items-center justify-center border-2 border-dashed text-[0.7rem] font-bold',
          a.fits4
            ? 'border-violet-500/80 bg-violet-500/30 text-fg'
            : 'border-danger/80 bg-danger/20 text-danger',
        )}
      >
        αντ. 4
      </div>
    </div>
  )
}

function Scenario({
  name,
  sel,
  onToggle,
  a,
}: {
  name: string
  sel: Sel
  onToggle: (i: number) => void
  a: Analysis
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/30 p-3">
      <div className="mb-2 text-sm font-bold text-fg">Σενάριο {name}</div>

      {/* toggle items 1..3 */}
      <div className="mb-2 flex gap-1.5">
        {Array.from({ length: PREFIX }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(i)}
            aria-pressed={sel[i]}
            className={cn(
              'flex-1 rounded-md border px-1 py-1.5 text-center transition-colors',
              sel[i]
                ? ITEM_FILL[i]
                : 'border-border bg-bg-elevated text-fg-muted hover:bg-bg-soft',
            )}
          >
            <div className="text-xs font-bold text-fg">Αντ. {i + 1}</div>
            <div className="font-mono text-[0.65rem] text-fg-muted">
              β{ITEMS[i].w}·α{ITEMS[i].v}
            </div>
          </button>
        ))}
      </div>

      <Bag a={a} />

      <div className="mt-2 mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
        Χωράει το αντικείμενο 4; (βάρος {LAST.w})
      </div>
      <Item4Track a={a} />

      {/* readout */}
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-fg-muted">Αξία τώρα</span>
          <span className="font-mono font-bold text-fg">
            {a.valid ? a.value : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-muted">Ελεύθερος χώρος</span>
          <span className="font-mono font-bold text-fg">
            {a.valid ? a.leftover : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-muted">Αντικείμενο 4</span>
          <span
            className={cn(
              'font-bold',
              !a.valid
                ? 'text-fg-subtle'
                : a.fits4
                  ? 'text-success'
                  : 'text-danger',
            )}
          >
            {!a.valid ? '—' : a.fits4 ? 'χωράει +6' : 'δεν χωράει +0'}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-1.5">
          <span className="font-semibold text-fg">Τελική αξία</span>
          <span className="font-mono text-xl font-bold tabular-nums text-fg">
            {a.valid ? a.final : '✗'}
          </span>
        </div>
      </div>
    </div>
  )
}

const TRAP_A: Sel = [true, false, false] // {1}
const TRAP_B: Sel = [true, true, false] // {1,2}

export function KnapsackWhyTwoVars() {
  const [selA, setSelA] = useState<Sel>(TRAP_A)
  const [selB, setSelB] = useState<Sel>(TRAP_B)

  const a = useMemo(() => analyse(selA), [selA])
  const b = useMemo(() => analyse(selB), [selB])

  const sameSet =
    selA.slice(0, PREFIX).join('') === selB.slice(0, PREFIX).join('')

  let verdict: { kind: 'trap' | 'neutral' | 'pick'; text: string }
  if (!a.valid || !b.valid) {
    verdict = {
      kind: 'pick',
      text: 'Ένα από τα δύο σενάρια ξεπερνά τη χωρητικότητα. Διάλεξε έγκυρα υποσύνολα και στις δύο στήλες.',
    }
  } else if (sameSet) {
    verdict = {
      kind: 'pick',
      text: 'Τα δύο σενάρια διαλέγουν το ίδιο υποσύνολο. Άλλαξε ένα από τα δύο για να τα συγκρίνεις.',
    }
  } else if (a.value === b.value) {
    verdict = {
      kind: 'neutral',
      text: 'Τα δύο prefix έχουν την ίδια αξία τώρα. Άλλαξε ένα ώστε να διαφέρουν — εκεί κρύβεται το δίδαγμα.',
    }
  } else {
    const hiNow = a.value > b.value ? 'Α' : 'Β'
    const hiNowVal = Math.max(a.value, b.value)
    const hiFinal = a.final > b.final ? 'Α' : a.final < b.final ? 'Β' : '='
    if (hiFinal === '=') {
      verdict = {
        kind: 'neutral',
        text: `Το Σενάριο ${hiNow} είναι πιο πλούσιο τώρα, αλλά καταλήγουν στην ίδια τελική αξία. Πάτα «Η παγίδα» για να δεις πότε το «πιο καλό τώρα» χάνει.`,
      }
    } else if (hiFinal !== hiNow) {
      verdict = {
        kind: 'trap',
        text: `Παγίδα! Το Σενάριο ${hiNow} έχει μεγαλύτερη αξία ΤΩΡΑ (${hiNowVal}), αλλά μικρότερη ΤΕΛΙΚΗ αξία — γέμισε το σακίδιο και δεν χώρεσε το αντικείμενο 4. Μια OPT(3) ως ένας αριθμός θα κρατούσε τη μεγαλύτερη-τώρα (${hiNowVal}) και θα έχανε την καλύτερη λύση (${Math.max(a.final, b.final)}). Η αξία ενός prefix εξαρτάται από τον ελεύθερο χώρο — γι’ αυτό χρειάζεται δεύτερη μεταβλητή: OPT(i, w).`,
      }
    } else {
      verdict = {
        kind: 'neutral',
        text: `Εδώ το «πιο πλούσιο τώρα» (Σενάριο ${hiNow}) τυχαίνει να οδηγεί και στην καλύτερη τελική λύση. Δεν ισχύει πάντα — πάτα «Η παγίδα».`,
      }
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 text-sm font-semibold tracking-tight text-fg">
        Γιατί μία μεταβλητή δεν αρκεί
      </div>
      <p className="mb-3 text-xs leading-relaxed text-fg-subtle">
        Διάλεξε τα αντικείμενα 1–3 σε κάθε σενάριο. Μένει το αντικείμενο 4
        (βάρος {LAST.w}, αξία {LAST.v}). Ερώτηση: ποιο prefix οδηγεί στην
        καλύτερη <strong>τελική</strong> λύση;
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Scenario
          name="Α"
          sel={selA}
          a={a}
          onToggle={(i) =>
            setSelA((s) => s.map((v, k) => (k === i ? !v : v)))
          }
        />
        <Scenario
          name="Β"
          sel={selB}
          a={b}
          onToggle={(i) =>
            setSelB((s) => s.map((v, k) => (k === i ? !v : v)))
          }
        />
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 rounded-lg border px-3 py-2 text-sm leading-relaxed',
          verdict.kind === 'trap'
            ? 'border-accent/50 bg-accent/10 text-fg'
            : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {verdict.kind === 'trap' && (
          <span className="mr-1 font-bold text-accent">⚠ </span>
        )}
        {verdict.text}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSelA([...TRAP_A])
            setSelB([...TRAP_B])
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          Η παγίδα: A = {'{1}'}, B = {'{1,2}'}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelA([false, false, false])
            setSelB([false, false, false])
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Καθάρισε
        </button>
      </div>
    </section>
  )
}
