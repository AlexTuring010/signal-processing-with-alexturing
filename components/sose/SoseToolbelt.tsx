'use client'

import { Wrench, Home } from 'lucide-react'
import type { Topic } from '@/content/practice/types'
import { TOPIC_COLORS, TOPIC_LABELS } from '@/content/practice/types'

type Stats = {
  solvedCount: number
  totalCount: number
  weightCovered: number
  totalWeight: number
  weightFraction: number
  perTopic: Record<Topic, number>
}

type Props = {
  position: number
  total: number
  stats: Stats
  topicTotals: Record<Topic, number>
  onBackToLanding: () => void
}

const TOPIC_ORDER: Topic[] = [
  'foundations',
  'modulation',
  'am',
  'fm',
  'random',
  'noise',
]

/**
 * Sticky progress strip shown at the top of every problem in crunch mode.
 * The «εξεταστικό βάρος καλυμμένο» metric is the real-data progress bar:
 * sum of the `weight` field of solved problems / sum of all weights.
 */
export function SoseToolbelt({
  position,
  total,
  stats,
  topicTotals,
  onBackToLanding,
}: Props) {
  const positionPct = Math.round(((position - 1) / Math.max(total - 1, 1)) * 100)
  const weightPct = Math.round(stats.weightFraction * 100)

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Top row: position counter + tools + coverage */}
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-1 text-xs text-fg-muted transition hover:border-accent/50 hover:text-fg"
            title="Πίσω στο landing"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
          </button>
          <span className="font-semibold text-fg">
            Άσκηση{' '}
            <span className="font-mono tabular-nums">{position}</span>{' '}
            <span className="font-normal text-fg-subtle">/ {total}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Wrench className="h-3 w-3" aria-hidden />
            <span className="font-mono tabular-nums">
              {stats.solvedCount}
            </span>{' '}
            εργαλεία
          </span>
          <span className="ml-auto text-xs text-fg-muted">
            <span className="font-mono tabular-nums">{weightPct}%</span> εξετ.
            βάρος καλυμμένο
          </span>
        </div>

        {/* Two stacked progress bars */}
        <div className="space-y-1.5">
          {/* Position progress (where you are in the path) */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-soft">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-fg-subtle/40"
              style={{ width: `${positionPct}%` }}
            />
          </div>
          {/* Coverage progress (real exam weight covered) */}
          <div
            className="relative h-2.5 w-full overflow-hidden rounded-full bg-bg-soft"
            title={`${stats.weightCovered.toFixed(0)}% / ${stats.totalWeight.toFixed(0)}% συνολικού βάρους — δείκτης βασισμένος στα παλαιά εξεταστικά`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${weightPct}%` }}
            />
          </div>
        </div>

        {/* Per-topic breakdown */}
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          {TOPIC_ORDER.map((t) => {
            const solved = stats.perTopic[t]
            const tot = topicTotals[t]
            if (tot === 0) return null
            const isComplete = solved === tot
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono tabular-nums ${
                  isComplete
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : solved > 0
                      ? TOPIC_COLORS[t]
                      : 'border-border bg-bg-soft text-fg-subtle'
                }`}
                title={`${TOPIC_LABELS[t]}: ${solved} από ${tot} λυμένες`}
              >
                <span className="font-sans">{TOPIC_LABELS[t]}</span>
                {solved}/{tot}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
