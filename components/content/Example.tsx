'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MathText } from '@/components/math'

type Props = {
  title?: string
  children: ReactNode
  /** Default-open state for the worked solution. */
  defaultOpen?: boolean
}

export function Example({ title = 'Παράδειγμα', children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="my-6 overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 px-4 py-3 text-left',
          'hover:bg-bg-soft transition-colors',
        )}
        aria-expanded={open}
      >
        <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">
          <MathText>{title}</MathText>
        </span>
        <span className="text-xs text-fg-muted">{open ? 'Κρύψε λύση' : 'Δες λύση'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-fg-muted transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="animate-fade-in border-t border-border bg-bg px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  )
}
