'use client'

/**
 * LogVsLinearRace — feel the gap between O(n) and O(log n).
 *
 * The L01 prose claims «σε εκατομμύριο στοιχεία η δυαδική κάνει ~20 συγκρίσεις»
 * but a struggling student reads that as just a number. The viz lets the
 * student crank n from 8 up to 2²⁰ ≈ 1.000.000:
 *
 *   • The linear bar grows linearly and immediately maxes out.
 *   • The binary bar grows imperceptibly — barely a sliver.
 *   • The ratio (linear / binary) on the right makes the gap a tangible
 *     multiplier: ~×50.000 at 1M, ~×5.000 at 100k, ~×100 at 1k.
 *
 * The teaching beat: a multiplicative gap that EXPLODES with n is what
 * "logarithmic vs linear" actually means in practice. Built for L01.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

const EXP_MIN = 3 // n =     8
const EXP_MAX = 20 // n = 1.048.576

function fmt(n: number): string {
  return n.toLocaleString('el-GR')
}

function binaryWorst(n: number): number {
  // Three-way binary search on a sorted array: ⌊log₂ n⌋ + 1 comparisons.
  // For n = 1.048.576 this is 20; for n = 8, it is 4.
  return Math.floor(Math.log2(n)) + 1
}

const PRESETS = [
  { exp: 3, label: '8' },
  { exp: 7, label: '128' },
  { exp: 10, label: '1.024' },
  { exp: 16, label: '65.536' },
  { exp: 20, label: '1.048.576' },
]

export function LogVsLinearRace() {
  const [exp, setExp] = useState(3)
  const n = 2 ** exp
  const lin = n
  const bin = binaryWorst(n)
  const ratio = lin / bin
  const binPct = (bin / lin) * 100

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γραμμική vs Δυαδική — χείριστες συγκρίσεις στο ίδιο n
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
          n = {fmt(n)}
        </span>
      </div>

      {/* slider */}
      <div className="mb-2 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="race-n"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Μέγεθος n
        </label>
        <input
          id="race-n"
          type="range"
          min={EXP_MIN}
          max={EXP_MAX}
          step={1}
          value={exp}
          onChange={(e) => setExp(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-bold text-fg">{fmt(n)}</div>
          <div className="text-[10px] text-fg-subtle">= 2^{exp}</div>
        </div>
      </div>

      {/* presets */}
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          προεπιλογές
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.exp}
            type="button"
            onClick={() => setExp(p.exp)}
            className={cn(
              'rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
              p.exp === exp
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* the bars — linear always 100%, binary shrinks relative to it */}
      <div className="space-y-2">
        <BarRow
          title="Γραμμική αναζήτηση"
          formula="n"
          value={lin}
          widthPct={100}
          tone="danger"
        />
        <BarRow
          title="Δυαδική αναζήτηση"
          formula="⌊log₂ n⌋ + 1"
          value={bin}
          widthPct={Math.max(binPct, 0.2)}
          tone="ok"
          // when the bar is microscopic, lift a label outside so it stays readable
          tinyBar={binPct < 5}
        />
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        Με <strong className="text-fg">n = {fmt(n)}</strong>, η γραμμική κάνει{' '}
        <strong className="font-mono text-fg">{fmt(lin)}</strong> συγκρίσεις και η
        δυαδική <strong className="font-mono text-fg">{fmt(bin)}</strong>. Αναλογία{' '}
        <strong className="font-mono text-fg">
          ×{ratio < 100 ? ratio.toFixed(1) : fmt(Math.round(ratio))}
        </strong>{' '}
        υπέρ της δυαδικής. {exp >= 16 ? (
          <span className="text-fg">
            Διπλασιάζοντας ξανά το n, η γραμμική <em>διπλασιάζεται</em> — η
            δυαδική προσθέτει μία <em>μόνο</em> σύγκριση.
          </span>
        ) : (
          <span>
            Σύρε το slider δεξιά: η μπλε μπάρα μένει σχεδόν αόρατη ενώ η κόκκινη γεμίζει.
          </span>
        )}
      </div>
    </section>
  )
}

function BarRow({
  title,
  formula,
  value,
  widthPct,
  tone,
  tinyBar,
}: {
  title: string
  formula: string
  value: number
  widthPct: number
  tone: 'danger' | 'ok'
  tinyBar?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-2.5',
        tone === 'danger' && 'border-red-500/40 bg-red-500/5',
        tone === 'ok' && 'border-emerald-500/40 bg-emerald-500/5',
      )}
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="text-xs font-semibold text-fg">
          {title}
          <span className="ml-2 font-mono text-[10px] text-fg-subtle">{formula}</span>
        </div>
        <div className="font-mono text-lg font-bold tabular-nums text-fg">
          {fmt(value)}
        </div>
      </div>
      <div className="relative h-3 overflow-hidden rounded bg-bg-soft">
        <div
          className={cn(
            'h-full rounded transition-all duration-200',
            tone === 'danger' && 'bg-red-500/80',
            tone === 'ok' && 'bg-emerald-500/80',
          )}
          style={{ width: `${widthPct}%` }}
        />
        {tinyBar ? (
          <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
            ◀ μικροσκοπική
          </span>
        ) : null}
      </div>
    </div>
  )
}
