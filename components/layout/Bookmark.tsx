'use client'

import { Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  /** Stable identifier — usually `${slug}#${anchor}` or just `${slug}`. */
  id: string
  className?: string
}

export function Bookmark({ id, className }: Props) {
  const bookmarks = useAppStore((s) => s.bookmarks)
  const toggle = useAppStore((s) => s.toggleBookmark)
  const hydrated = useAppStore((s) => s.hydrated)
  const active = hydrated && bookmarks.has(id)

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-soft hover:text-fg',
        active && 'text-accent hover:text-accent',
        className,
      )}
      aria-pressed={active}
      aria-label={active ? 'Αφαίρεση bookmark' : 'Προσθήκη bookmark'}
      title={active ? 'Αφαίρεση bookmark' : 'Προσθήκη bookmark'}
    >
      {active ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <BookmarkIcon className="h-4 w-4" />
      )}
    </button>
  )
}
