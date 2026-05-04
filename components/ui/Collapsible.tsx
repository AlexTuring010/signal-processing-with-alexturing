'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  title: ReactNode
  /** Optional small label rendered to the right of the title (e.g. "προαιρετικό"). */
  badge?: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapsible({
  title,
  badge,
  children,
  defaultOpen = false,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section
      className={cn(
        'my-6 overflow-hidden rounded-lg border border-border bg-bg-elevated',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-bg-soft"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-fg-muted transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
        <span className="flex-1 text-sm font-semibold tracking-tight">{title}</span>
        {badge && (
          <span className="shrink-0 rounded-full bg-bg-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
            {badge}
          </span>
        )}
      </button>
      {open && (
        <div className="animate-fade-in border-t border-border px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  )
}
