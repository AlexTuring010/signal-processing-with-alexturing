'use client'

/**
 * RecurrenceSubstitution — the «θέτω n = 2^m» trick, stepped.
 *
 * The √n family of recurrences (T(n)=T(√n)+1 and friends) confuses
 * students because Master Theorem doesn't apply directly — the problem
 * doesn't shrink by a constant *factor*, it shrinks to a square root.
 * The trick is a change of variable n = 2^m, which converts √n = 2^{m/2}
 * — i.e. m gets halved each step — and *then* Master Theorem applies on
 * the new function S(m) = T(2^m).
 *
 * The viz walks the 4 stages so the symbolic gymnastics is something the
 * student can SEE: (1) the original recurrence; (2) plug in n = 2^m; (3)
 * solve the new Master-Theorem-able recurrence in m; (4) substitute back
 * to get T(n).
 *
 * Built for L03 Phase D — covers pt1-th1-q4, pt2-th1-q4, front-set-3-ask10.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

type Preset = {
  id: string
  title: string
  /** Coefficient a in T(n) = a·T(√n) + 1. */
  a: number
  /** The original recurrence as LaTeX. */
  original: string
  /** S(m) recurrence as LaTeX. */
  newRecurrence: string
  /** S(m) solution as LaTeX. */
  sSolution: string
  /** Final T(n) class as LaTeX (just the Θ(...) bit). */
  tFinal: string
  /** Short note explaining the Master Theorem case used. */
  masterNote: string
}

const PRESETS: Record<string, Preset> = {
  'pt1-th1-q4': {
    id: 'pt1-th1-q4',
    title: 'pt1-th1-q4 — T(n) = T(√n) + 1',
    a: 1,
    original: 'T(n) = T(\\sqrt{n}) + 1',
    newRecurrence: 'S(m) = S(m/2) + 1',
    sSolution: 'S(m) = \\Theta(\\log m)',
    tFinal: '\\Theta(\\log\\log n)',
    masterNote:
      'Master Theorem με a=1, b=2: log_b a = 0, f(m) = Θ(1) — περίπτωση 2 → Θ(log m).',
  },
  'pt2-th1-q4': {
    id: 'pt2-th1-q4',
    title: 'pt2-th1-q4 — T(n) = 2T(√n) + 1',
    a: 2,
    original: 'T(n) = 2\\,T(\\sqrt{n}) + 1',
    newRecurrence: 'S(m) = 2\\,S(m/2) + 1',
    sSolution: 'S(m) = \\Theta(m)',
    tFinal: '\\Theta(\\log n)',
    masterNote:
      'Master Theorem με a=2, b=2: log_b a = 1, f(m) = 1 = O(m^{1-ε}) — περίπτωση 1 → Θ(m).',
  },
  'front-set-3-ask10': {
    id: 'front-set-3-ask10',
    title: 'front-set-3-ask10 — T(n) = T(√n) + 1',
    a: 1,
    original: 'T(n) = T(\\sqrt{n}) + 1',
    newRecurrence: 'S(m) = S(m/2) + 1',
    sSolution: 'S(m) = \\Theta(\\log m)',
    tFinal: '\\Theta(\\log\\log n)',
    masterNote:
      'Master Theorem με a=1, b=2: log_b a = 0, f(m) = Θ(1) — περίπτωση 2 → Θ(log m).',
  },
}

const FALLBACK_PRESET: Preset = Object.values(PRESETS)[0]

type Props = {
  preset: string
}

const STEPS = [
  {
    label: '① Η αρχική',
    short: 'αρχική',
  },
  {
    label: '② Αλλαγή μεταβλητής n = 2ᵐ',
    short: 'n = 2ᵐ',
  },
  {
    label: '③ Master Theorem σε S(m)',
    short: 'S(m) λύση',
  },
  {
    label: '④ Επιστροφή στο n',
    short: 'T(n)',
  },
]

export function RecurrenceSubstitution({ preset: presetId }: Props) {
  const preset = PRESETS[presetId] ?? FALLBACK_PRESET
  const [step, setStep] = useState(0)

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const visible = step

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αντικατάσταση: <span className="font-mono">n = 2ᵐ</span> — βήμα προς βήμα
        </div>
        <div className="text-xs text-fg-subtle">{preset.title}</div>
      </div>

      {/* Step strip */}
      <ol className="mb-3 grid grid-cols-4 gap-1 text-xs">
        {STEPS.map((s, i) => (
          <li
            key={s.short}
            className={cn(
              'rounded-md border px-2 py-1 text-center font-medium transition-colors',
              i <= step
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg-soft/50 text-fg-subtle',
            )}
          >
            <span className="hidden sm:inline">{s.label}</span>
            <span className="sm:hidden">{s.short}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        {visible >= 0 && (
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Η αρχική σχέση
            </div>
            <BlockMath>{preset.original}</BlockMath>
            <p className="text-sm text-fg-muted">
              Το πρόβλημα δεν μικραίνει με σταθερό συντελεστή — μικραίνει με{' '}
              <em>ρίζα</em>. Master Theorem δεν εφαρμόζεται κατευθείαν, χρειάζεται
              αλλαγή μεταβλητής.
            </p>
          </div>
        )}

        {visible >= 1 && (
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              ② Θέτουμε <InlineMath>{'n = 2^m'}</InlineMath>
            </div>
            <p className="text-sm text-fg-muted">
              Τότε <InlineMath>{'\\sqrt{n} = (2^m)^{1/2} = 2^{m/2}'}</InlineMath>.
              Ορίζουμε <InlineMath>{'S(m) = T(2^m)'}</InlineMath> και
              αντικαθιστούμε:
            </p>
            <BlockMath>{preset.newRecurrence}</BlockMath>
            <p className="text-sm text-fg-muted">
              Τώρα η σχέση είναι «κανονική» — το <InlineMath>{'m'}</InlineMath>{' '}
              υποδιπλασιάζεται σε κάθε βήμα.
            </p>
          </div>
        )}

        {visible >= 2 && (
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              ③ Master Theorem σε <InlineMath>{'S(m)'}</InlineMath>
            </div>
            <p className="text-sm text-fg-muted">{preset.masterNote}</p>
            <BlockMath>{preset.sSolution}</BlockMath>
          </div>
        )}

        {visible >= 3 && (
          <div className="mt-4 space-y-1 border-t border-border pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              ④ Επιστροφή <InlineMath>{'m = \\log_2 n'}</InlineMath>
            </div>
            <BlockMath>{`T(n) = S(\\log n) = ${preset.tFinal}`}</BlockMath>
            <div className="rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
              <strong>Συμπέρασμα:</strong>{' '}
              <InlineMath>{`T(n) = ${preset.tFinal}`}</InlineMath>.
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg disabled:opacity-40"
        >
          ← Προηγούμενο
        </button>
        <span className="text-xs text-fg-subtle">
          Βήμα {step + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={step === STEPS.length - 1}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
