'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  slug: string
  className?: string
}

export function CompleteToggle({ slug, className }: Props) {
  const completed = useAppStore((s) => s.completed)
  const toggle = useAppStore((s) => s.toggleComplete)
  const hydrated = useAppStore((s) => s.hydrated)
  const done = hydrated && completed.has(slug)

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
        done
          ? 'border-success/50 bg-success/10 text-success hover:bg-success/15'
          : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/50 hover:text-fg',
        className,
      )}
      aria-pressed={done}
    >
      {done ? (
        <>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Ολοκληρωμένο
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" aria-hidden="true" />
          Σήμανε ως ολοκληρωμένο
        </>
      )}
    </button>
  )
}
