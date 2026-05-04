'use client'

import { Circle, CircleDot, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  slug: string
  /** "current" → reader is on this section right now (half-filled visual). */
  current?: boolean
  className?: string
}

export function ProgressDot({ slug, current, className }: Props) {
  const completed = useAppStore((s) => s.completed)
  const hydrated = useAppStore((s) => s.hydrated)
  const done = hydrated && completed.has(slug)

  if (done) {
    return (
      <CheckCircle2
        className={cn('h-3.5 w-3.5 text-success', className)}
        aria-label="Ολοκληρωμένο"
      />
    )
  }
  if (current) {
    return (
      <CircleDot
        className={cn('h-3.5 w-3.5 text-accent', className)}
        aria-label="Τρέχουσα ενότητα"
      />
    )
  }
  return (
    <Circle
      className={cn('h-3.5 w-3.5 text-fg-subtle/50', className)}
      aria-label="Δεν έχει διαβαστεί"
    />
  )
}
