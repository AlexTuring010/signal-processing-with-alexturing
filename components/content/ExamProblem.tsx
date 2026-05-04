'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  year: string
  weight?: string
  title?: string
  children: ReactNode
}

/**
 * A problem from a past exam. Worked solution lives behind a toggle so the
 * student can attempt it first.
 *
 * Convention: the children should contain the problem statement and a
 * `<Example>` (or similar) for the solution. We don't auto-split — explicit is
 * easier to author.
 */
export function ExamProblem({ year, weight, title = 'Θέμα εξετάσεων', children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <section className="my-6 overflow-hidden rounded-lg border border-accent/40 bg-accent-soft/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-accent-soft/40"
        aria-expanded={open}
      >
        <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">
          {title} — {year}
          {weight && (
            <span className="ml-2 rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-normal text-fg-muted">
              {weight}
            </span>
          )}
        </span>
        <span className="text-xs text-fg-muted">{open ? 'Κρύψε' : 'Δες'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-fg-muted transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="animate-fade-in border-t border-accent/30 bg-bg px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  )
}
