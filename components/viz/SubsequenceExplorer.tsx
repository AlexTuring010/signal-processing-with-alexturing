'use client'

/**
 * SubsequenceExplorer — the subsequence-vs-substring distinction, the one
 * confusion that must be cleared before LCS makes sense.
 *
 * The student clicks letters of ABCBDAB to keep. The viz reports two things:
 *
 *  - «Υπακολουθία» — true for ANY selection, as long as the kept letters stay
 *    in their original left-to-right order (which clicking guarantees);
 *  - «Υποσυμβολοσειρά» — true ONLY when the kept letters are contiguous, with
 *    no dropped letter in between.
 *
 * The dropped letters sitting inside the span light up red — they are the
 * «gap» that makes a selection a subsequence but not a substring. Built for
 * L15.
 */

import { useMemo, useState } from 'react'
import { Check, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const STRING = 'ABCBDAB'.split('')

/** preset selections, by the indices kept */
const PRESETS: { label: string; keep: number[] }[] = [
  { label: 'Υπακολουθία: BCAB', keep: [1, 2, 5, 6] },
  { label: 'Υποσυμβολοσειρά: CBDA', keep: [2, 3, 4, 5] },
]

function fromIndices(keep: number[]): boolean[] {
  return STRING.map((_, i) => keep.includes(i))
}

export function SubsequenceExplorer() {
  const [kept, setKept] = useState<boolean[]>(() => fromIndices([1, 2, 5, 6]))

  const info = useMemo(() => {
    const idx = kept.map((k, i) => (k ? i : -1)).filter((i) => i >= 0)
    const count = idx.length
    const first = count > 0 ? idx[0] : -1
    const last = count > 0 ? idx[count - 1] : -1
    const contiguous = count > 0 && last - first + 1 === count
    const gap = new Set<number>()
    if (count > 0 && !contiguous) {
      for (let i = first + 1; i < last; i++) if (!kept[i]) gap.add(i)
    }
    const text = idx.map((i) => STRING[i]).join('')
    return { idx, count, contiguous, gap, text }
  }, [kept])

  const toggle = (i: number) =>
    setKept((k) => k.map((v, j) => (j === i ? !v : v)))

  let note: string
  if (info.count === 0) {
    note =
      'Διάλεξε γράμματα κρατώντας τα κλικ. Κάθε επιλογή που σέβεται την αρχική σειρά είναι υπακολουθία — αυτό είναι το εύκολο μέρος.'
  } else if (info.contiguous) {
    note =
      'Τα κρατημένα γράμματα είναι ένα συνεχόμενο κομμάτι — άρα η επιλογή είναι ΚΑΙ υπακολουθία ΚΑΙ υποσυμβολοσειρά.'
  } else {
    note =
      'Ανάμεσα στα κρατημένα υπάρχουν γράμματα που πέταξες (κόκκινα). Αυτό το «κενό» κάνει την επιλογή υπακολουθία αλλά ΟΧΙ υποσυμβολοσειρά: η υποσυμβολοσειρά πρέπει να είναι συνεχόμενη.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 text-sm font-semibold tracking-tight text-fg">
        Υπακολουθία ή υποσυμβολοσειρά;
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Πάτησε γράμματα για να τα κρατήσεις. Δες τι μένει υπακολουθία και τι
        υποσυμβολοσειρά.
      </p>

      {/* the string as clickable chips */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {STRING.map((ch, i) => {
          const on = kept[i]
          const isGap = info.gap.has(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-lg font-bold transition-all',
                on && 'border-accent bg-accent/20 text-fg',
                !on && isGap && 'border-danger/60 bg-danger/15 text-danger',
                !on &&
                  !isGap &&
                  'border-border bg-bg-soft/40 text-fg-subtle opacity-60',
              )}
            >
              {ch}
            </button>
          )
        })}
      </div>

      {/* the resulting selection */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Επιλογή:{' '}
        </span>
        <span className="font-mono text-lg font-bold tracking-[0.2em] text-fg">
          {info.text || '—'}
        </span>
      </div>

      {/* the two verdicts */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Verdict
          label="Υπακολουθία"
          sub="διατηρεί τη σειρά"
          ok={info.count > 0}
          neutral={info.count === 0}
        />
        <Verdict
          label="Υποσυμβολοσειρά"
          sub="πρέπει να είναι συνεχόμενη"
          ok={info.contiguous}
          neutral={info.count === 0}
        />
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.25rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* presets */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setKept(fromIndices(p.keep))}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setKept(STRING.map(() => false))}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Καθάρισε
        </button>
      </div>
    </section>
  )
}

function Verdict({
  label,
  sub,
  ok,
  neutral,
}: {
  label: string
  sub: string
  ok: boolean
  neutral: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2',
        neutral
          ? 'border-border bg-bg-soft/40'
          : ok
            ? 'border-success/50 bg-success/10'
            : 'border-danger/50 bg-danger/10',
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          neutral
            ? 'bg-fg-subtle/20 text-fg-subtle'
            : ok
              ? 'bg-success/20 text-success'
              : 'bg-danger/20 text-danger',
        )}
      >
        {neutral ? '·' : ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-fg">{label}</span>
        <span className="block text-[0.7rem] text-fg-subtle">{sub}</span>
      </span>
    </div>
  )
}
