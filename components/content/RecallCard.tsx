/**
 * RecallCard — «Κάρτα μνήμης».
 *
 * The compression step of the learning loop. You can't memorise a page;
 * you can hold a handful of keywords and a 3–5-step skeleton. This is the
 * thing a student actually carries into the exam: keyword anchors, the
 * mental skeleton, the complexity, and the one classic trap.
 *
 * Server component: purely presentational.
 */

import type { ReactNode } from 'react'
import { Brain, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** e.g. "BFS" */
  algorithm: string
  /** 4–6 keyword anchors. */
  keywords: string[]
  /** 3–5 mental-skeleton steps. */
  skeleton: ReactNode[]
  /** Complexity, e.g. "O(n + m)". */
  complexity: string
  /** The one mistake students make most. */
  trap: ReactNode
  title?: string
  className?: string
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
      {children}
    </div>
  )
}

export function RecallCard({
  algorithm,
  keywords,
  skeleton,
  complexity,
  trap,
  title = 'Κάρτα μνήμης',
  className,
}: Props) {
  return (
    <section
      className={cn(
        'my-6 overflow-hidden rounded-xl border-2 border-accent/30 bg-bg-elevated shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-accent/20 bg-accent/5 px-4 py-2.5">
        <Brain className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span className="text-sm font-bold tracking-tight text-fg">
          {title} — {algorithm}
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Λέξεις-κλειδιά</Label>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((k, i) => (
              <span
                key={i}
                className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-sm font-medium text-fg"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <Label>Τα βήματα στο μυαλό σου</Label>
          <div className="space-y-1.5">
            {skeleton.map((step, i) => (
              <div key={i} className="flex gap-2 text-sm leading-relaxed text-fg">
                <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-fg">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Πολυπλοκότητα</Label>
          <span className="inline-block rounded-md border border-border bg-bg-soft px-2 py-1 font-mono text-sm text-fg">
            {complexity}
          </span>
        </div>

        <div>
          <Label>Κλασική παγίδα</Label>
          <div className="flex gap-2 rounded-md border border-red-300/60 bg-red-50/70 px-2.5 py-1.5 text-sm leading-relaxed text-red-950 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{trap}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
