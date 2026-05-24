'use client'

/**
 * UnequalSplitGeometric — why T(n)=T(n/2)+T(n/4)+T(n/8)+n is O(n).
 *
 * The key insight: at level k the total subproblem size is
 *   (1/2 + 1/4 + 1/8)^k · n = (7/8)^k · n.
 * Per-level work is therefore (7/8)^k · n (because work is linear in
 * size at every level). The geometric series Σ (7/8)^k converges, so
 * total work is O(n) — the root dominates.
 *
 * The viz shows two things side by side:
 *  1. A bar chart of per-level work, with the (7/8)^k decay visible.
 *  2. A running cumulative sum bar that visibly stops growing — vs a
 *     toggle to a "boundary case" T(n)=T(n/2)+T(n/2)+n where the
 *     ratio is 1 and the sum grows linearly with depth.
 *
 * For front-set-4-ask4.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Variant = {
  id: string
  label: string
  /** Fractional sizes of children at each recursion step. */
  splits: number[]
  /** Whether the geometric ratio is < 1 (sum converges). */
  converges: boolean
  /** Asymptotic answer string. */
  answer: string
  /** Note about why it's like this. */
  note: string
}

const VARIANTS: Variant[] = [
  {
    id: 'ask4',
    label: 'T(n) = T(n/2) + T(n/4) + T(n/8) + n',
    splits: [1 / 2, 1 / 4, 1 / 8],
    converges: true,
    answer: 'O(n) — η ρίζα κυριαρχεί',
    note: 'Σύνολο 1/2 + 1/4 + 1/8 = 7/8 < 1 — η γεωμετρική σειρά συγκλίνει.',
  },
  {
    id: 'balanced',
    label: 'T(n) = 2T(n/2) + n (mergesort)',
    splits: [1 / 2, 1 / 2],
    converges: false,
    answer: 'O(n log n) — κάθε επίπεδο ίδιο',
    note: 'Σύνολο 1/2 + 1/2 = 1 — κάθε επίπεδο κοστίζει το ίδιο n.',
  },
  {
    id: 'over',
    label: 'T(n) = T(n/2) + T(n/2) + T(n/2) + n',
    splits: [1 / 2, 1 / 2, 1 / 2],
    converges: false,
    answer: 'O(n^{log₂ 3}) ≈ O(n^{1.585}) — τα φύλλα κυριαρχούν',
    note: 'Σύνολο 1/2 + 1/2 + 1/2 = 3/2 > 1 — η δουλειά αυξάνει προς τα κάτω.',
  },
]

const LEVELS = 8

export function UnequalSplitGeometric() {
  const [vid, setVid] = useState('ask4')
  const v = useMemo(() => VARIANTS.find((x) => x.id === vid) ?? VARIANTS[0], [vid])

  const ratio = useMemo(() => v.splits.reduce((s, x) => s + x, 0), [v])

  // Per-level work ∝ ratio^k (linear-work recurrences only)
  const works = useMemo(
    () => Array.from({ length: LEVELS }, (_, k) => ratio ** k),
    [ratio],
  )
  const total = works.reduce((s, w) => s + w, 0)
  const maxW = Math.max(...works)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γεωμετρική σειρά κατά βάθος — ποιο επίπεδο κυριαρχεί;
        </div>
        <div className="text-xs text-fg-subtle">
          λόγος r ={' '}
          <span className={cn('font-mono', ratio < 1 ? 'text-success' : ratio === 1 ? 'text-warn' : 'text-rose-500')}>
            {ratio.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Variant tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {VARIANTS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setVid(x.id)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs transition-colors',
              vid === x.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* Per-level bars */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Δουλειά ανά επίπεδο — w(k) = r<sup>k</sup>·n
        </div>
        <div className="flex h-32 items-end gap-1.5">
          {works.map((w, k) => {
            const h = Math.max(w / maxW, 0.04)
            return (
              <div key={k} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      v.converges
                        ? 'bg-emerald-500/70'
                        : ratio === 1
                          ? 'bg-warn'
                          : 'bg-rose-500/70',
                    )}
                    style={{ height: `${h * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-fg-subtle">{k}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-1 text-center text-[11px] text-fg-subtle">επίπεδο k</div>
      </div>

      {/* Cumulative */}
      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <div className="font-semibold uppercase tracking-wider text-fg-subtle">
            Συσσωρευμένη δουλειά (πρώτα 8 επίπεδα)
          </div>
          <div className="mt-1 font-mono text-sm text-fg">{total.toFixed(3)} · n</div>
        </div>
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
          <div className="font-semibold uppercase tracking-wider text-fg-subtle">
            Όριο της γεωμετρικής σειράς
          </div>
          <div className="mt-1 font-mono text-sm text-fg">
            {ratio < 1 ? (1 / (1 - ratio)).toFixed(3) + ' · n  (συγκλίνει)' : '∞  (αποκλίνει)'}
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div
        className={cn(
          'rounded-md border px-3 py-2 text-sm',
          v.converges
            ? 'border-success/50 bg-success/5'
            : ratio === 1
              ? 'border-warn/40 bg-warn/5'
              : 'border-rose-500/50 bg-rose-500/5',
        )}
      >
        <div className="mb-1 font-semibold text-fg">{v.answer}</div>
        <p className="text-xs text-fg-muted">{v.note}</p>
        {v.id === 'ask4' && (
          <p className="mt-1 text-xs text-fg-muted">
            <strong>Επαλήθευση:</strong> εικασία{' '}
            <InlineMath>{'T(n) \\le cn'}</InlineMath> με{' '}
            <InlineMath>{'c \\ge 8'}</InlineMath>, η επαγωγή κλείνει —{' '}
            <InlineMath>{'T(n) = O(n)'}</InlineMath>.
          </p>
        )}
      </div>
    </section>
  )
}
