/**
 * Algorithm — the dual-view container for one algorithm.
 *
 * The natural-language description is the children: always visible, the
 * primary thing. The pseudocode goes in a `<Pseudocode>` placed last among
 * the children, where it renders as a one-click reveal. This matches what
 * the course actually rewards — a correct description in words — and keeps
 * pseudocode clearly secondary.
 *
 * Server component: pure layout. Interactivity lives in `<Pseudocode>`.
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  /** e.g. "BFS — Αναζήτηση κατά πλάτος" */
  name: string
  /** One-line "the idea" summary, shown as a lead under the title. */
  idea?: string
  /** Complexity tag, e.g. "O(n + m)". */
  complexity?: string
  /** Optional input/output description. */
  io?: { input?: string; output?: string }
  /** Natural-language description first, then a `<Pseudocode>`. */
  children: ReactNode
  className?: string
}

export function Algorithm({ name, idea, complexity, io, children, className }: Props) {
  return (
    <section
      className={cn(
        'my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-md bg-accent/10 px-2 text-[11px] font-bold uppercase tracking-wider text-accent">
            Αλγόριθμος
          </span>
          <span className="text-base font-semibold tracking-tight text-fg">{name}</span>
        </div>
        {complexity && (
          <span className="shrink-0 rounded-md border border-border bg-bg-soft px-2 py-0.5 font-mono text-sm text-fg-muted">
            {complexity}
          </span>
        )}
      </div>

      {idea && (
        <div className="mt-2 border-l-2 border-accent/40 pl-3 text-[0.95rem] italic text-fg-muted">
          {idea}
        </div>
      )}

      {io && (io.input || io.output) && (
        <dl className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
          {io.input && (
            <div className="flex gap-2">
              <dt className="font-semibold text-fg-subtle">Είσοδος:</dt>
              <dd className="text-fg-muted">{io.input}</dd>
            </div>
          )}
          {io.output && (
            <div className="flex gap-2">
              <dt className="font-semibold text-fg-subtle">Έξοδος:</dt>
              <dd className="text-fg-muted">{io.output}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </section>
  )
}
