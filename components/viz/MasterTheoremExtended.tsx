'use client'

/**
 * MasterTheoremExtended — the «log^k bump» case.
 *
 * The standard MT three-case statement doesn't cover f(n) =
 * Θ(n^{log_b a} · log^k n) — the *border* case where f sits exactly
 * on the n^{log_b a} curve but with an extra polylog factor. The
 * extended rule: T(n) = Θ(n^{log_b a} · log^{k+1} n) — the answer
 * gains *one more* log factor.
 *
 * The viz makes the rule concrete by walking through the three
 * candidate cases for the given a, b, f, showing which fail and why,
 * then applying the extended rule.
 *
 * Presets:
 *  - front-set-3-ask9: T(n) = 2T(n/2) + n log n → Θ(n log² n)
 *  - front-set-4-ask10: T(n) = 27T(n/9) + n^{3/2} log n → Θ(n^{3/2} log² n)
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

type Preset = {
  id: string
  title: string
  a: number
  b: number
  /** Display string for f(n). */
  fLatex: string
  /** Display string for the threshold n^{log_b a}. */
  thresholdLatex: string
  /** k in log^k n. */
  k: number
  /** Final answer. */
  resultLatex: string
}

const PRESETS: Record<string, Preset> = {
  'front-set-3-ask9': {
    id: 'front-set-3-ask9',
    title: 'front-set-3-ask9 — 2T(n/2) + n log n',
    a: 2,
    b: 2,
    fLatex: 'n\\log n',
    thresholdLatex: 'n^{\\log_2 2} = n',
    k: 1,
    resultLatex: '\\Theta(n\\log^2 n)',
  },
  'front-set-4-ask10': {
    id: 'front-set-4-ask10',
    title: 'front-set-4-ask10 — 27T(n/9) + n^{3/2} log n',
    a: 27,
    b: 9,
    fLatex: 'n^{3/2}\\log n',
    thresholdLatex: 'n^{\\log_9 27} = n^{3/2}',
    k: 1,
    resultLatex: '\\Theta(n^{3/2}\\log^2 n)',
  },
}

const FALLBACK_PRESET: Preset = Object.values(PRESETS)[0]

type Props = {
  preset: string
}

export function MasterTheoremExtended({ preset: presetId }: Props) {
  const preset = PRESETS[presetId] ?? FALLBACK_PRESET
  const [step, setStep] = useState(0)

  useEffect(() => setStep(0), [preset.id])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επεκτεταμένη περίπτωση του Master Theorem (log<sup>k</sup> bump)
        </div>
        <div className="text-xs text-fg-subtle">{preset.title}</div>
      </div>

      {/* The recurrence */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-center">
        <BlockMath>{`T(n) = ${preset.a}\\,T(n/${preset.b}) + ${preset.fLatex}`}</BlockMath>
        <p className="text-xs text-fg-muted">
          Κατώφλι: <InlineMath>{`n^{\\log_b a} = ${preset.thresholdLatex}`}</InlineMath>
        </p>
      </div>

      {/* Three cases, then extended */}
      <div className="space-y-2">
        {/* Case 1 */}
        <div
          className={cn(
            'rounded-md border px-3 py-2 transition-colors',
            step >= 0
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-border opacity-30',
          )}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Περ. 1 — απαιτεί <InlineMath>{`f = O(n^{\\log_b a - \\varepsilon})`}</InlineMath>
            </span>
            <span className="text-xs text-rose-500">✗ δεν εφαρμόζεται</span>
          </div>
          <p className="text-xs text-fg-muted">
            Εδώ <InlineMath>{preset.fLatex}</InlineMath> είναι μεγαλύτερο από{' '}
            <InlineMath>{preset.thresholdLatex}</InlineMath>, όχι μικρότερο.
          </p>
        </div>

        {/* Case 2 */}
        <div
          className={cn(
            'rounded-md border px-3 py-2 transition-colors',
            step >= 1
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-border opacity-30',
          )}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Περ. 2 — απαιτεί <InlineMath>{`f = \\Theta(n^{\\log_b a})`}</InlineMath>
            </span>
            <span className="text-xs text-rose-500">✗ δεν εφαρμόζεται</span>
          </div>
          <p className="text-xs text-fg-muted">
            Το <InlineMath>{preset.fLatex}</InlineMath> δεν είναι ακριβώς{' '}
            <InlineMath>{preset.thresholdLatex}</InlineMath> — έχει επιπλέον{' '}
            <InlineMath>{'\\log n'}</InlineMath>.
          </p>
        </div>

        {/* Case 3 */}
        <div
          className={cn(
            'rounded-md border px-3 py-2 transition-colors',
            step >= 2
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-border opacity-30',
          )}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Περ. 3 — απαιτεί <InlineMath>{`f = \\Omega(n^{\\log_b a + \\varepsilon})`}</InlineMath>
            </span>
            <span className="text-xs text-rose-500">✗ δεν εφαρμόζεται</span>
          </div>
          <p className="text-xs text-fg-muted">
            Το <InlineMath>{preset.fLatex}</InlineMath> ξεπερνά το κατώφλι μόνο
            κατά έναν παράγοντα <InlineMath>{'\\log n'}</InlineMath> — όχι
            πολυωνυμικά. <strong>Δεν υπάρχει ε &gt; 0 με{' '}
            <InlineMath>{'\\log n = \\Omega(n^{\\varepsilon})'}</InlineMath></strong>.
          </p>
        </div>

        {/* Extended */}
        <div
          className={cn(
            'rounded-md border-2 px-3 py-2 transition-colors',
            step >= 3
              ? 'border-accent bg-accent/10'
              : 'border-border opacity-30',
          )}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Επεκτεταμένη — <InlineMath>{'f = \\Theta(n^{\\log_b a}\\log^k n)'}</InlineMath>
            </span>
            <span className="text-xs text-accent">✓ εφαρμόζεται</span>
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            Εδώ <InlineMath>{`f = ${preset.fLatex} = \\Theta(${preset.thresholdLatex} \\cdot \\log^{${preset.k}} n)`}</InlineMath>,
            άρα <InlineMath>{`k = ${preset.k}`}</InlineMath>. Ο κανόνας:
          </p>
          <BlockMath>{'T(n) = \\Theta(n^{\\log_b a}\\log^{k+1} n)'}</BlockMath>
        </div>

        {/* Result */}
        {step >= 4 && (
          <div className="rounded-md border border-success/50 bg-success/5 px-3 py-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-success">
              Αποτέλεσμα
            </div>
            <BlockMath>{`T(n) = ${preset.resultLatex}`}</BlockMath>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">βήμα {step + 1} / 5</span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, 4))}
          disabled={step >= 4}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
