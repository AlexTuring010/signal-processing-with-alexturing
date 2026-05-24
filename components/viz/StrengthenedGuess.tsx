'use client'

/**
 * StrengthenedGuess — the «strengthen the guess» trick, side by side.
 *
 * For front-set-4-ask3: T(n) = 8T(n/2) + cn². The naive guess
 * T(n) ≤ dn³ fails — substituting gives dn³ + cn², and the leftover
 * cn² kills the induction. The fix: subtract a lower-order term and
 * try T(n) ≤ dn³ − d'n². Now the substitution produces an extra
 * −d'n² + cn² that, when d' ≥ c, is ≤ 0 — and the induction closes.
 *
 * The viz puts the two attempts side by side and lets the student
 * step through the algebra, watching where the naive attempt fails
 * and how the strengthened attempt absorbs the residual.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

type Line = { expr: string; note: string; danger?: boolean; ok?: boolean }

const NAIVE: Line[] = [
  {
    expr: 'T(n) \\le 8\\,T(n/2) + cn^2',
    note: 'Η αναδρομή (γράφουμε ≤ για άνω φράγμα).',
  },
  {
    expr: '\\le 8\\,d(n/2)^3 + cn^2',
    note: 'Αντικαθιστούμε την εικασία T(n/2) ≤ d(n/2)³.',
  },
  {
    expr: '= 8d \\cdot \\tfrac{n^3}{8} + cn^2 = dn^3 + cn^2',
    note: 'Απλοποίηση. Έχουμε dn³ + cn² στο τέλος.',
  },
  {
    expr: 'dn^3 + cn^2 \\;\\not\\le\\; dn^3',
    note: 'Θέλουμε ≤ dn³ — αλλά υπάρχει επιπλέον cn² που δεν εξαφανίζεται. Η επαγωγή ΣΠΑΕΙ.',
    danger: true,
  },
]

const STRONG: Line[] = [
  {
    expr: "T(n) \\le 8\\bigl(d(n/2)^3 - d'(n/2)^2\\bigr) + cn^2",
    note: 'Νέα εικασία: T(n) ≤ dn³ − d′n². Αντικαθιστούμε.',
  },
  {
    expr: "= 8d \\cdot \\tfrac{n^3}{8} - 8d' \\cdot \\tfrac{n^2}{4} + cn^2",
    note: 'Αναπτύσσουμε.',
  },
  {
    expr: "= dn^3 - 2d'n^2 + cn^2",
    note: 'Απλοποίηση.',
  },
  {
    expr: "= dn^3 - d'n^2 - d'n^2 + cn^2",
    note: 'Σπάμε το −2d′n² σε −d′n² − d′n² για να αναγνωρίσουμε τη μορφή της εικασίας.',
  },
  {
    expr: "\\le dn^3 - d'n^2 \\quad (\\text{όταν } d' \\ge c)",
    note: 'Αν d′ ≥ c τότε −d′n² + cn² ≤ 0 — εξαφανίζεται. Η επαγωγή ΚΛΕΙΝΕΙ.',
    ok: true,
  },
]

export function StrengthenedGuess() {
  const [step, setStep] = useState(0)
  const max = Math.max(NAIVE.length, STRONG.length)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το κόλπο της ενίσχυσης — αφαιρώ έναν όρο για να κλείσει η επαγωγή
        </div>
        <div className="text-xs text-fg-subtle">
          T(n) ≤ 8T(n/2) + cn² → O(n³)
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Naive column */}
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
              Αφελής εικασία
            </span>
            <span className="font-mono text-xs text-fg">
              <InlineMath>{'T(n) \\le dn^3'}</InlineMath>
            </span>
          </div>
          <div className="space-y-2">
            {NAIVE.map((line, i) => {
              const shown = i <= step
              return (
                <div
                  key={i}
                  className={cn(
                    'rounded-md border px-2 py-1 transition-colors',
                    shown ? 'opacity-100' : 'opacity-20',
                    line.danger
                      ? 'border-rose-500/60 bg-rose-500/10'
                      : 'border-border bg-bg-elevated',
                  )}
                >
                  <BlockMath className="!my-1">{line.expr}</BlockMath>
                  {shown && (
                    <p className="border-t border-border pt-1 text-[11px] text-fg-muted">
                      {line.note}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Strengthened column */}
        <div className="rounded-lg border border-success/50 bg-success/5 px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-success">
              Ενισχυμένη εικασία
            </span>
            <span className="font-mono text-xs text-fg">
              <InlineMath>{"T(n) \\le dn^3 - d'n^2"}</InlineMath>
            </span>
          </div>
          <div className="space-y-2">
            {STRONG.map((line, i) => {
              const shown = i <= step
              return (
                <div
                  key={i}
                  className={cn(
                    'rounded-md border px-2 py-1 transition-colors',
                    shown ? 'opacity-100' : 'opacity-20',
                    line.ok
                      ? 'border-success/60 bg-success/10'
                      : 'border-border bg-bg-elevated',
                  )}
                >
                  <BlockMath className="!my-1">{line.expr}</BlockMath>
                  {shown && (
                    <p className="border-t border-border pt-1 text-[11px] text-fg-muted">
                      {line.note}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
        <strong>Δίδαγμα.</strong> Όταν η «προφανής» εικασία{' '}
        <InlineMath>{'T \\le dn^k'}</InlineMath> δεν κλείνει την επαγωγή,{' '}
        <em>ενίσχυσε</em> την αφαιρώντας έναν μικρότερης τάξης όρο{' '}
        <InlineMath>{"-d'n^{k-1}"}</InlineMath>. Παράδοξα, η «πιο σφιχτή» εικασία
        είναι ευκολότερο να αποδειχθεί.
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {max}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, max - 1))}
          disabled={step >= max - 1}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
