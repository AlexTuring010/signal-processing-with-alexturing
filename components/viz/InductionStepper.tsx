'use client'

/**
 * InductionStepper — proof-by-induction, line by line.
 *
 * Induction proofs for recurrences are dense algebra. Students stare
 * at six lines of equations and bounce off. The viz reveals one line
 * at a time with a tiny annotation explaining the move ("substitute
 * IH", "apply log a+log b = log ab"). The student presses Next and
 * sees the chain unfold; the IH and target are pinned at top.
 *
 * Presets:
 *  - front-set-3-ask8: T(n)=2T(n/2)+n, prove T(2ᵏ)=k·2ᵏ via k-induction
 *  - front-set-4-ask2: T(n)=2T(n/2)+n, prove T(n)=n log n + n via n-induction
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { BlockMath } from '@/components/math'

type Line = {
  /** LaTeX for the equation/expression on this line. */
  expr: string
  /** Short Greek note describing the move. */
  note: string
}

type Preset = {
  id: string
  title: string
  /** What we're proving (one-line claim). */
  claim: string
  /** Base case statement. */
  baseLatex: string
  baseNote: string
  /** Inductive hypothesis. */
  ihLatex: string
  /** Inductive step — chained equations. */
  steps: Line[]
  conclusionLatex: string
}

const PRESETS: Record<string, Preset> = {
  'front-set-3-ask8': {
    id: 'front-set-3-ask8',
    title: 'front-set-3-ask8 — T(2ᵏ) = k·2ᵏ',
    claim: 'T(n) = n\\log n \\quad \\text{όταν } n = 2^k',
    baseLatex: 'k = 1: \\;\\; T(2) = 2 \\;\\; \\text{vs.} \\;\\; 2\\log 2 = 2 \\cdot 1 = 2 \\;\\checkmark',
    baseNote: 'Από τον ορισμό της αναδρομής.',
    ihLatex: 'T(2^m) = m \\cdot 2^m \\quad (\\text{υπόθεση})',
    steps: [
      {
        expr: 'T(2^{m+1}) = 2\\,T(2^{m+1}/2) + 2^{m+1}',
        note: 'Εφαρμόζουμε τον ορισμό της αναδρομής στο 2^{m+1}.',
      },
      {
        expr: '= 2\\,T(2^m) + 2^{m+1}',
        note: '2^{m+1}/2 = 2^m.',
      },
      {
        expr: '= 2\\,(m \\cdot 2^m) + 2^{m+1}',
        note: 'Αντικαθιστούμε την επαγωγική υπόθεση: T(2^m) = m·2^m.',
      },
      {
        expr: '= m\\cdot 2^{m+1} + 2^{m+1}',
        note: '2 · m · 2^m = m · 2^{m+1}.',
      },
      {
        expr: '= 2^{m+1}(m + 1)',
        note: 'Κοινός παράγοντας 2^{m+1}.',
      },
      {
        expr: '= 2^{m+1} \\cdot \\log 2^{m+1}',
        note: 'log 2^{m+1} = m+1. Άρα ο τύπος T(2^k) = k · 2^k ισχύει για k = m+1. ∎',
      },
    ],
    conclusionLatex:
      'T(2^k) = k \\cdot 2^k = 2^k \\log 2^k \\quad \\Longrightarrow \\quad T(n) = n\\log n',
  },
  'front-set-4-ask2': {
    id: 'front-set-4-ask2',
    title: 'front-set-4-ask2 — T(n) = n log n + n (ακριβής τύπος)',
    claim: 'T(n) = n\\log n + n \\quad (\\text{εικασία})',
    baseLatex: 'n = 1: \\;\\; T(1) = 1 \\;\\; \\text{vs.} \\;\\; 1\\log 1 + 1 = 0 + 1 = 1 \\;\\checkmark',
    baseNote: 'log 1 = 0.',
    ihLatex: 'T(k) = k\\log k + k \\quad \\text{για κάθε } k < n',
    steps: [
      {
        expr: 'T(n) = 2\\,T(n/2) + n',
        note: 'Από τον ορισμό της αναδρομής.',
      },
      {
        expr: '= 2\\,\\left(\\tfrac{n}{2}\\log\\tfrac{n}{2} + \\tfrac{n}{2}\\right) + n',
        note: 'Εφαρμόζουμε την επαγωγική υπόθεση στο k = n/2 < n.',
      },
      {
        expr: '= n\\log\\tfrac{n}{2} + n + n',
        note: 'Αναπτύσσουμε το γινόμενο.',
      },
      {
        expr: '= n(\\log n - \\log 2) + 2n',
        note: 'log(n/2) = log n − log 2.',
      },
      {
        expr: '= n\\log n - n + 2n',
        note: 'log 2 = 1.',
      },
      {
        expr: '= n\\log n + n',
        note: 'Τέλος. Ο τύπος ισχύει και για n. ∎',
      },
    ],
    conclusionLatex: 'T(n) = n\\log n + n = \\Theta(n\\log n)',
  },
}

const FALLBACK_PRESET: Preset = Object.values(PRESETS)[0]

type Props = {
  preset: string
}

export function InductionStepper({ preset: presetId }: Props) {
  const preset = PRESETS[presetId] ?? FALLBACK_PRESET
  const [revealed, setRevealed] = useState(0)
  const total = preset.steps.length

  useEffect(() => setRevealed(0), [preset.id])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επαγωγή — βήμα προς βήμα
        </div>
        <div className="text-xs text-fg-subtle">{preset.title}</div>
      </div>

      {/* Claim + IH pinned */}
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
            Ζητούμενο
          </div>
          <BlockMath>{preset.claim}</BlockMath>
        </div>
        <div className="rounded-lg border border-warn/40 bg-warn/5 px-3 py-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-warn">
            Επαγωγική υπόθεση
          </div>
          <BlockMath>{preset.ihLatex}</BlockMath>
        </div>
      </div>

      {/* Base */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Βάση
        </div>
        <BlockMath>{preset.baseLatex}</BlockMath>
        <p className="text-xs text-fg-muted">{preset.baseNote}</p>
      </div>

      {/* Inductive step */}
      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Επαγωγικό βήμα
        </div>
        <div className="space-y-2">
          {preset.steps.map((line, i) => {
            const shown = i < revealed
            return (
              <div
                key={i}
                className={cn(
                  'rounded-md border px-2 py-1 transition-colors',
                  shown
                    ? 'border-accent/30 bg-bg-elevated'
                    : 'border-border/40 bg-bg-elevated/40 opacity-30',
                )}
              >
                <BlockMath className="!my-1">{line.expr}</BlockMath>
                {shown && (
                  <p className="border-t border-border pt-1 text-[11px] text-fg-muted">
                    <span className="font-semibold text-fg">[{i + 1}]</span> {line.note}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Conclusion */}
      {revealed >= total && (
        <div className="mt-3 rounded-md border border-success/50 bg-success/5 px-3 py-2">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-success">
            Συμπέρασμα
          </div>
          <BlockMath>{preset.conclusionLatex}</BlockMath>
        </div>
      )}

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRevealed(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          γραμμή {revealed} / {total}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(r + 1, total))}
          disabled={revealed >= total}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          + Επόμενη γραμμή
        </button>
      </div>
    </section>
  )
}
