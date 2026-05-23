'use client'

/**
 * DivideByNTrick — the «διαιρώ και τις δύο πλευρές με n» move.
 *
 * For front-set-4-ask1: T(n) = √n · T(√n) + n. The trick is to
 * divide both sides by n. The √n in the leading coefficient combines
 * with the √n in the divisor to give S(√n) where S(n) = T(n)/n —
 * which is the simple S(n) = S(√n) + 1 that we already know how to
 * solve (via the [[recurrence-substitution]] viz).
 *
 * Stepped explanation:
 *  ① Original
 *  ② Divide both sides by n
 *  ③ Recognise the S(n) = T(n)/n pattern; resulting recurrence S(n)=S(√n)+1
 *  ④ Solve via substitution → S(n) = Θ(log log n)
 *  ⑤ Multiply by n → T(n) = Θ(n log log n)
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

const STEPS = [
  {
    short: 'αρχική',
    title: '① Η αρχική σχέση',
    body: (
      <>
        <BlockMath>{'T(n) = \\sqrt{n}\\;T(\\sqrt{n}) + n'}</BlockMath>
        <p className="text-sm text-fg-muted">
          Δύο δυσκολίες ταυτόχρονα: ρίζα στο όρισμα <em>και</em> συντελεστής{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath>. Δεν εφαρμόζεται Master Theorem.
        </p>
      </>
    ),
  },
  {
    short: '÷ n',
    title: '② Διαιρούμε και τις δύο πλευρές με n',
    body: (
      <>
        <BlockMath>{'\\frac{T(n)}{n} = \\frac{\\sqrt{n}\\;T(\\sqrt{n})}{n} + \\frac{n}{n}'}</BlockMath>
        <BlockMath>{'\\frac{T(n)}{n} = \\frac{T(\\sqrt{n})}{\\sqrt{n}} + 1'}</BlockMath>
        <p className="text-sm text-fg-muted">
          Το <InlineMath>{'\\sqrt{n}/n = 1/\\sqrt{n}'}</InlineMath> «έσβησε» μαζί με
          τον συντελεστή. Μένει κάτι πιο καθαρό.
        </p>
      </>
    ),
  },
  {
    short: 'S(n)',
    title: '③ Νέα συνάρτηση S(n) = T(n)/n',
    body: (
      <>
        <p className="text-sm text-fg-muted">
          Παρατήρησε ότι ο όρος <InlineMath>{'T(\\sqrt{n})/\\sqrt{n}'}</InlineMath>{' '}
          είναι ακριβώς <InlineMath>{'S(\\sqrt{n})'}</InlineMath>. Η σχέση γίνεται:
        </p>
        <BlockMath>{'S(n) = S(\\sqrt{n}) + 1'}</BlockMath>
        <p className="text-sm text-fg-muted">
          Αυτή είναι η αναδρομή της <InlineMath>{'T(\\sqrt{n}) + 1'}</InlineMath>{' '}
          (την έχουμε λύσει αλλού) — με αλλαγή μεταβλητής{' '}
          <InlineMath>{'n = 2^m'}</InlineMath> γίνεται{' '}
          <InlineMath>{'R(m) = R(m/2) + 1'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    short: 'S λύση',
    title: '④ Λύνουμε την S(n)',
    body: (
      <>
        <p className="text-sm text-fg-muted">
          Master Theorem για <InlineMath>{'R(m) = R(m/2) + 1'}</InlineMath>: a=1,
          b=2, f(m)=Θ(1) — περίπτωση 2 → Θ(log m). Επιστροφή στο n:
        </p>
        <BlockMath>{'S(n) = \\Theta(\\log m) = \\Theta(\\log\\log n)'}</BlockMath>
      </>
    ),
  },
  {
    short: '× n',
    title: '⑤ Πολλαπλασιάζουμε με n',
    body: (
      <>
        <p className="text-sm text-fg-muted">
          Αφού <InlineMath>{'S(n) = T(n)/n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = n \\cdot S(n) = \\Theta(n\\log\\log n)'}</BlockMath>
        <div className="rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
          <strong>Συμπέρασμα:</strong>{' '}
          <InlineMath>{'T(n) = \\Theta(n\\log\\log n)'}</InlineMath>.
        </div>
      </>
    ),
  },
]

export function DivideByNTrick() {
  const [step, setStep] = useState(0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Διαίρεση με n — όταν η αναδρομή «κρύβει» πιο απλή
        </div>
        <div className="text-xs text-fg-subtle">
          T(n) = √n · T(√n) + n → Θ(n log log n)
        </div>
      </div>

      {/* Step strip */}
      <ol className="mb-3 grid grid-cols-5 gap-1 text-[11px]">
        {STEPS.map((s, i) => (
          <li
            key={s.short}
            className={cn(
              'rounded-md border px-1.5 py-1 text-center font-medium transition-colors',
              i <= step
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg-soft/50 text-fg-subtle',
            )}
          >
            {s.short}
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        {STEPS.slice(0, step + 1).map((s, i) => (
          <div
            key={i}
            className={cn(i > 0 ? 'mt-4 border-t border-border pt-3' : '', 'space-y-1')}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {s.title}
            </div>
            {s.body}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg disabled:opacity-40"
        >
          ← Προηγούμενο
        </button>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
          disabled={step === STEPS.length - 1}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
