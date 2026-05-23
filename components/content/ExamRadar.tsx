/**
 * ExamRadar — «Ραντάρ εξετάσεων».
 *
 * A scannable "this is what they actually ask" block at the close of a
 * lecture. Each item is a thing the exam tends to test, with a likelihood
 * cue. Pairs with the per-exercise `examRadar` coaching field and the
 * `examWeight` frontmatter.
 *
 * Server component: presentational.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Radar, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Likelihood = 'high' | 'medium' | 'low'

export type ExamRadarItem = {
  /** What the exam asks. */
  topic: ReactNode
  likelihood?: Likelihood
  /** Optional one-line elaboration. */
  note?: ReactNode
  /**
   * Optional list of exercise ids in the practice bank that exemplify this
   * radar item. Rendered as clickable badges that deep-link to
   * `/practice#exercise:<id>` — the anchor `ExerciseCard` already sets.
   * Phase D wires these for every lecture.
   */
  relatedExerciseIds?: string[]
}

type Props = {
  title?: string
  items: ExamRadarItem[]
}

const DOT: Record<Likelihood, string> = {
  high: 'bg-danger',
  medium: 'bg-warn',
  low: 'bg-fg-subtle',
}

const LABEL: Record<Likelihood, string> = {
  high: 'συχνό',
  medium: 'πιθανό',
  low: 'σπανιότερο',
}

export function ExamRadar({ title = 'Ραντάρ εξετάσεων', items }: Props) {
  return (
    <aside className="my-5 rounded-lg border border-l-4 border-l-current border-rose-300/60 bg-rose-50/70 px-4 py-3.5 text-rose-950 shadow-sm dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Radar className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const lk = item.likelihood ?? 'medium'
          return (
            <div key={i} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed">
              <span className="mt-1.5 flex shrink-0 items-center gap-1.5">
                <span className={cn('inline-block h-2.5 w-2.5 rounded-full', DOT[lk])} />
              </span>
              <div className="flex-1">
                <span className="font-semibold">{item.topic}</span>
                <span className="ml-1.5 text-xs uppercase tracking-wider opacity-60">
                  {LABEL[lk]}
                </span>
                {item.note && <div className="text-sm opacity-90">{item.note}</div>}
                {item.relatedExerciseIds && item.relatedExerciseIds.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60">
                      Δες το στις ασκήσεις
                    </span>
                    {item.relatedExerciseIds.map((id) => (
                      <Link
                        key={id}
                        href={`/practice#exercise:${id}`}
                        className="inline-flex items-center gap-1 rounded border border-rose-400/50 bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px] font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:text-rose-200 dark:hover:bg-rose-400/20"
                      >
                        {id}
                        <ExternalLink className="h-2.5 w-2.5 opacity-60" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
