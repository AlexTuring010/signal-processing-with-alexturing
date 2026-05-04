'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
}

export function LabBox({ title = 'Lab — Προαιρετικό', children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section
      className={cn(
        'my-6 overflow-hidden rounded-lg border-2 border-dashed',
        'border-violet-400/40 bg-violet-50/40 dark:border-violet-400/30 dark:bg-violet-400/5',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2 px-4 py-3 text-left',
          'hover:bg-violet-100/40 dark:hover:bg-violet-400/10 transition-colors',
        )}
        aria-expanded={open}
      >
        <FlaskConical className="h-4 w-4 text-violet-600 dark:text-violet-300" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">
          🧪 {title}
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
        <div className="animate-fade-in border-t border-violet-400/30 px-4 py-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  )
}
