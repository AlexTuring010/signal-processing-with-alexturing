'use client'

import { useEffect, useState } from 'react'
import { Coins, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import { GOOD_META, GOOD_PRICE } from '@/lib/orchard/defaults'
import {
  priceForState,
  priceHistoryForState,
  priceMultiplierForState,
  priceTrendForState,
} from '@/lib/orchard/effects'
import { effectiveMultRange } from '@/lib/orchard/effects'
import { playOrchardSound } from '@/lib/orchard/audio'
import type { GoodKey, OrchardState } from '@/lib/orchard/types'

const SELLABLE: GoodKey[] = ['apples', 'juice', 'cider', 'jam', 'pies']

/**
 * Phase 3 market — fluctuating prices, sparkline trends, optional auto-sell
 * rules per good. Compact for the 280-px panel: each good is a small card
 * with the sparkline tucked into the header row.
 */
export function MarketPanel() {
  const state = useOrchardStore((s) => s.state)
  const startedAt = state.startedAt
  const coins = state.resources.coins

  // 1-second heartbeat for live price ticks. Cheap — closed-form math.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="flex h-full flex-col gap-2 overflow-y-auto p-2.5">
      <header>
        <h3 className="text-xs font-semibold">Πάγκος αγοράς</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          Οι τιμές αλλάζουν με τον χρόνο. Πούλα στο peak.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-bg-soft/40 px-2 py-1.5 text-[11px]">
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Διαθέσιμα κέρματα</span>
          <span className="font-semibold tabular-nums">
            🪙 {coins.toFixed(coins < 10 ? 2 : 1)}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {SELLABLE.map((g) => (
          <GoodCard
            key={g}
            good={g}
            startedAt={startedAt}
            now={now}
            state={state}
          />
        ))}
      </ul>
    </section>
  )
}

function GoodCard({
  good,
  startedAt,
  now,
  state,
}: {
  good: GoodKey
  startedAt: number
  now: number
  state: OrchardState
}) {
  const stock = useOrchardStore((s) => Math.floor(s.state.resources[good] ?? 0))
  const sellGood = useOrchardStore((s) => s.sellGood)
  const sellAllGood = useOrchardStore((s) => s.sellAllGood)
  const rule = useOrchardStore((s) => s.state.autoSell[good])
  const setAutoSell = useOrchardStore((s) => s.setAutoSell)

  const meta = GOOD_META[good]
  const mult = priceMultiplierForState(good, startedAt, now, state)
  const price = priceForState(good, startedAt, now, state)
  const trend = priceTrendForState(good, startedAt, now, state)
  const history = priceHistoryForState(good, startedAt, now, state, 28)
  const range = effectiveMultRange(state)
  const can = stock > 0

  const trendIcon =
    Math.abs(trend) < 0.02 ? (
      <Minus className="h-3 w-3" aria-hidden="true" />
    ) : trend > 0 ? (
      <TrendingUp className="h-3 w-3 text-success" aria-hidden="true" />
    ) : (
      <TrendingDown className="h-3 w-3 text-danger" aria-hidden="true" />
    )

  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-bg-soft/40 p-2">
      {/* Top row: identity + sparkline + price chip */}
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-base leading-none">
          {meta.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold leading-tight">
            {meta.name}
          </div>
          <div className="text-[10px] leading-tight text-fg-subtle tabular-nums">
            Στοκ {stock} · base {GOOD_PRICE[good].toFixed(2)} 🪙
          </div>
        </div>
        <Sparkline
          values={history}
          rangeMin={range.min}
          rangeMax={range.max}
          className="h-5 w-16 shrink-0"
        />
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
            mult >= 1.1
              ? 'bg-success/15 text-success'
              : mult <= 0.9
                ? 'bg-danger/15 text-danger'
                : 'bg-bg-elevated text-fg-muted',
          )}
          title={`Τιμή τώρα: ${price.toFixed(2)} 🪙/μον.`}
        >
          {trendIcon}
          ×{mult.toFixed(2)}
        </span>
      </div>

      {/* Sell + auto-sell row */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => sellAllGood(good)}
          disabled={!can}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-transform',
            can
              ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.01] active:scale-95'
              : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
          )}
        >
          <Coins className="h-3 w-3" aria-hidden="true" />
          {can ? `Πούλα ${stock} → ${(stock * price).toFixed(2)}` : 'Πούλα'}
        </button>
        <AutoSellToggle
          rule={rule}
          onChange={(r) => setAutoSell(good, r)}
        />
      </div>

      {/* Auto-sell config panel (only when active) */}
      {rule && (
        <div className="flex items-center gap-1.5 rounded-lg bg-bg-elevated/60 px-2 py-1.5 text-[10px]">
          <span className="font-medium">Auto ≥</span>
          <input
            type="range"
            min={range.min}
            max={range.max}
            step={0.05}
            value={rule.minMult}
            onChange={(e) =>
              setAutoSell(good, { ...rule, minMult: Number(e.target.value) })
            }
            className="flex-1 accent-[rgb(var(--accent))]"
            aria-label={`Κατώφλι αυτόματης πώλησης για ${meta.name}`}
          />
          <span className="w-10 text-right tabular-nums">
            ×{rule.minMult.toFixed(2)}
          </span>
        </div>
      )}

      {/* Manual partial-sell quick chips: 1, 5, max */}
      {can && (
        <div className="flex items-center gap-1 text-[10px]">
          {[1, Math.min(stock, 5), stock].filter((q, i, arr) =>
            // unique + > 0 + not duplicate of "all"
            q > 0 && arr.indexOf(q) === i,
          ).map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => sellGood(good, qty)}
              className="rounded-full border border-border bg-bg-elevated px-2 py-0.5 text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            >
              ×{qty}
            </button>
          ))}
        </div>
      )}
    </li>
  )
}

function AutoSellToggle({
  rule,
  onChange,
}: {
  rule: { minMult: number; minStock: number } | undefined
  onChange: (rule: { minMult: number; minStock: number } | null) => void
}) {
  const active = !!rule
  return (
    <button
      type="button"
      onClick={() => {
        playOrchardSound('click')
        onChange(active ? null : { minMult: 1.0, minStock: 0 })
      }}
      title={active ? 'Απενεργοποίηση auto-sell' : 'Ενεργοποίηση auto-sell'}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full px-2 py-1 text-[10px] font-medium transition-colors',
        active
          ? 'bg-success/20 text-success hover:bg-success/30'
          : 'bg-bg-elevated text-fg-subtle hover:text-fg',
      )}
    >
      Auto
    </button>
  )
}

/** Tiny SVG sparkline. Maps `values` (within [rangeMin, rangeMax]) to the box. */
function Sparkline({
  values,
  rangeMin,
  rangeMax,
  className,
}: {
  values: number[]
  rangeMin: number
  rangeMax: number
  className?: string
}) {
  if (values.length === 0) return null
  const min = Math.min(rangeMin, ...values)
  const max = Math.max(rangeMax, ...values)
  const range = max - min || 1
  const W = 100
  const H = 20
  const stepX = W / (values.length - 1 || 1)
  const points = values
    .map((v, i) => {
      const x = i * stepX
      const y = H - ((v - min) / range) * H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  // Trend colour: positive slope = success, negative = danger.
  const trend = values[values.length - 1] - values[0]
  const stroke =
    Math.abs(trend) < 0.02
      ? 'rgb(var(--fg-subtle))'
      : trend > 0
        ? 'rgb(var(--success))'
        : 'rgb(var(--danger))'

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* baseline at multiplier = 1.0 */}
      <line
        x1="0"
        x2={W}
        y1={H - ((1 - min) / range) * H}
        y2={H - ((1 - min) / range) * H}
        stroke="rgb(var(--border))"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
