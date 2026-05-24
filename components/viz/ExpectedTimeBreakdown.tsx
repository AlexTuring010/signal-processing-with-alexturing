'use client'

/**
 * ExpectedTimeBreakdown — δες πόσο συνεισφέρει κάθε ζώνη πιθανότητας.
 *
 * For L02 Phase D, the «αναμενόμενος χρόνος Σειριακής Αναζήτησης»
 * problem (front-set-2-ask1). The position-probability tableau is
 * the kind of thing whose «E[T] = Θ(n)» feels arbitrary on paper —
 * but visually, you SEE the last two positions (with p = 1/8 each)
 * dominate the sum and force Θ(n) all by themselves.
 *
 * The viz shows:
 *   - n positions in a row, coloured by their probability density.
 *   - Bars next to each band showing its contribution to E[T]:
 *     `Σ_{i in band} p_i · i`.
 *   - The two p=1/8 positions glow — their contribution alone is ≥ n/4.
 *   - A grand-total E[T] readout plus the «δες — Θ(n)» verdict.
 *
 * Built for L02 Phase D.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Band = {
  name: string
  /** Inclusive start index (1-based). */
  from: (n: number) => number
  /** Inclusive end. */
  to: (n: number) => number
  /** Per-position probability in this band. */
  pEach: (n: number) => number
  color: string
  /** Label for the probability. */
  pLabel: string
  /** Notes for the band (why it matters). */
  note?: string
}

const BANDS: Band[] = [
  {
    name: 'θέσεις 1..n/2',
    from: () => 1,
    to: (n) => Math.floor(n / 2),
    pEach: (n) => 1 / n,
    color: 'bg-sky-400',
    pLabel: '1/n  η καθεμία',
    note: 'Συνολική πιθανότητα 1/2. Πρώτη μισή του πίνακα.',
  },
  {
    name: 'θέσεις n/2+1..n−2',
    from: (n) => Math.floor(n / 2) + 1,
    to: (n) => n - 2,
    pEach: (n) => 1 / (2 * (n - 4)),
    color: 'bg-emerald-400',
    pLabel: '1/(2(n−4))  η καθεμία',
    note: 'Συνολική πιθανότητα ≈ 1/4. Μεσαία ζώνη.',
  },
  {
    name: 'θέσεις n−1, n',
    from: (n) => n - 1,
    to: (n) => n,
    pEach: () => 1 / 8,
    color: 'bg-rose-500',
    pLabel: '1/8  η καθεμία',
    note: 'Συνολική πιθανότητα 1/4. Φεύγουν αδιάφορα στο τέλος — αλλά κουβαλάνε ΟΛΟ το κόστος.',
  },
]

export function ExpectedTimeBreakdown() {
  const [n, setN] = useState(40)

  const rows = useMemo(() => {
    return BANDS.map((b) => {
      const from = b.from(n)
      const to = b.to(n)
      const pEach = b.pEach(n)
      let contribution = 0
      let count = 0
      for (let i = from; i <= to; i++) {
        contribution += pEach * i
        count++
      }
      return {
        ...b,
        from,
        to,
        pEach,
        count,
        contribution,
        totalP: pEach * count,
      }
    })
  }, [n])

  const sumP = rows.reduce((acc, r) => acc + r.totalP, 0)
  const pNotFound = Math.max(0, 1 - sumP)
  const notFoundContribution = pNotFound * (n + 1)
  const ETotal = rows.reduce((acc, r) => acc + r.contribution, 0) + notFoundContribution

  // For visualization: the "linear bound" line at E[T]/n to show ratio.
  const ratio = ETotal / n

  const maxContribution = Math.max(
    ...rows.map((r) => r.contribution),
    notFoundContribution,
    1,
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          E[T] = Σ p_i · i  + p_{`{δεν βρέθηκε}`} · (n+1)
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">σύρε το n</span>
      </div>

      <label className="mb-3 flex items-center gap-2 text-xs">
        <span className="font-mono text-fg-muted">n</span>
        <input
          type="range"
          min={10}
          max={200}
          step={2}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <span className="w-16 text-right font-mono">{n}</span>
      </label>

      {/* Position strip showing colored bands */}
      <div className="mb-4">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
          Πίνακας n = {n} θέσεων (χρώμα = ζώνη)
        </div>
        <div className="flex h-6 overflow-hidden rounded border border-border">
          {Array.from({ length: n }, (_, idx) => {
            const i = idx + 1
            const band = rows.find((r) => i >= r.from && i <= r.to)
            return (
              <div
                key={i}
                className={cn('flex-1 border-r border-bg-elevated last:border-r-0', band?.color)}
                title={`θέση ${i}, p = ${(band?.pEach ?? 0).toFixed(4)}`}
              />
            )
          })}
        </div>
      </div>

      {/* Per-band contributions */}
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className="rounded border border-border bg-bg-soft p-2">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-[12px]">
              <span className="font-medium text-fg">{r.name}</span>
              <span className="font-mono text-[11px] text-fg-subtle">
                {r.count} θέσεις · p = {r.pLabel}
              </span>
            </div>
            <div className="relative h-5 rounded bg-bg-elevated">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 flex items-center justify-end pr-2 text-[10.5px] font-mono font-bold text-white transition-all',
                  r.color,
                )}
                style={{
                  width: `${Math.max(2, (r.contribution / maxContribution) * 100)}%`,
                }}
              >
                συνεισφορά = {r.contribution.toFixed(2)}
              </div>
            </div>
            {r.note && <div className="mt-1 text-[11px] italic text-fg-muted">{r.note}</div>}
          </div>
        ))}

        {pNotFound > 0 && (
          <div className="rounded border border-border bg-bg-soft p-2">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-[12px]">
              <span className="font-medium text-fg">«δεν βρέθηκε»</span>
              <span className="font-mono text-[11px] text-fg-subtle">
                p = {pNotFound.toFixed(4)}, κόστος n+1
              </span>
            </div>
            <div className="relative h-5 rounded bg-bg-elevated">
              <div
                className="absolute inset-y-0 left-0 flex items-center justify-end rounded bg-slate-400 pr-2 text-[10.5px] font-mono font-bold text-white"
                style={{ width: `${Math.max(2, (notFoundContribution / maxContribution) * 100)}%` }}
              >
                συνεισφορά = {notFoundContribution.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grand total */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft px-3 py-2 text-[13px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
            E[T] (στο τρέχον n)
          </div>
          <div className="font-mono text-lg font-bold text-fg">{ETotal.toFixed(2)}</div>
          <div className="font-mono text-[11px] text-fg-subtle">≈ {(ratio).toFixed(3)} · n</div>
        </div>
        <div className="rounded-md border-2 border-emerald-500/60 bg-emerald-50 px-3 py-2 text-[13px] dark:bg-emerald-500/15">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            ασυμπτωτικά
          </div>
          <div className="font-mono text-lg font-bold text-emerald-900 dark:text-emerald-100">
            E[T] = Θ(n)
          </div>
          <div className="text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
            Οι δύο τελευταίες θέσεις από μόνες τους δίνουν ¼·(n−1) = Ω(n).
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        Δες αν ΚΑΠΟΙΑ ζώνη βάλει αυστηρά Ω(n) από μόνη της — και κρατάει την E[T] τουλάχιστον γραμμική, ασχέτως τι κάνουν οι άλλες.
      </div>
    </section>
  )
}
