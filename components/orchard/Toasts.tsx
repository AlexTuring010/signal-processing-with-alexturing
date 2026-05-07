'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'

type Props = {
  /**
   * `viewport` (default) pins the stack to the top of the window — for the
   * old fullscreen layout. `panel` pins it to the top of the orchard panel
   * itself, which is what the anchored layout uses.
   */
  anchor?: 'viewport' | 'panel'
}

/**
 * Transient toast stack driven by the orchard store. Auto-prune happens
 * on every tick (the store filters by `expiresAt`) so we just render whatever
 * is currently in the list.
 */
export function Toasts({ anchor = 'viewport' }: Props = {}) {
  const toasts = useOrchardStore((s) => s.toasts)
  const [, setNow] = useState(Date.now())

  // Re-render every 500 ms so dismissed toasts disappear without waiting for
  // the next store action.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none flex flex-col items-center gap-1.5',
        anchor === 'viewport'
          ? 'fixed inset-x-0 top-3 z-[60]'
          : 'absolute inset-x-0 top-12 z-[5]',
      )}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'orchard-toast-in pointer-events-auto rounded-full border px-3 py-1 text-xs font-medium shadow-md',
            t.tone === 'good' && 'border-success/30 bg-success/10 text-success',
            t.tone === 'info' && 'border-accent/30 bg-accent-soft/40 text-accent',
            t.tone === 'warn' && 'border-warn/30 bg-warn/10 text-warn',
          )}
        >
          {t.text}
        </div>
      ))}
    </div>
  )
}
