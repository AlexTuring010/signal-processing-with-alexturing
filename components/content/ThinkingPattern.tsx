/**
 * ThinkingPattern — «Μοτίβο σκέψης».
 *
 * The "recognise it" step. A reusable way of thinking that travels beyond
 * one problem: the trigger signals («όταν βλέπεις…») plus the move to make.
 * Distinct from `Callout` — it has real structure (signals → reasoning) so
 * it renders uniformly across all 17 lectures. Visually a Callout sibling.
 *
 * Server component: presentational.
 */

import type { ReactNode } from 'react'
import { Puzzle } from 'lucide-react'

type Props = {
  title?: string
  /** Trigger phrases — what in a problem statement should fire this pattern. */
  signals?: string[]
  /** The reasoning / the move to make. */
  children: ReactNode
}

export function ThinkingPattern({ title = 'Μοτίβο σκέψης', signals, children }: Props) {
  return (
    <aside className="my-5 rounded-lg border border-l-4 border-l-current border-indigo-300/60 bg-indigo-50/70 px-4 py-3.5 text-indigo-950 shadow-sm dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-100">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Puzzle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>

      {signals && signals.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
            Σινιάλα στην εκφώνηση
          </span>
          {signals.map((s, i) => (
            <span
              key={i}
              className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-medium"
            >
              «{s}»
            </span>
          ))}
        </div>
      )}

      <div className="text-[0.95rem] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
