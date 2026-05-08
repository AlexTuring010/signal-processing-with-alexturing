'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Props = {
  /** Whether the slot currently holds an item. */
  filled: boolean
  /** Whether this slot is a valid target for the item the player is
   *  trying to place (highlights the slot with an accent ring). */
  isPlacementTarget: boolean
  /** The item's rendered SVG, when filled. */
  children?: ReactNode
  /** Click handler. When in place mode, places the item; otherwise
   *  removes whatever's there. */
  onClick: () => void
  /** Slot bounding-box in CSS — width/height for a `<div>`. */
  width: number
  height: number
  /** Optional rounded-corner class (e.g. for circular lamp bases). */
  className?: string
  /** ARIA label fallback. */
  label: string
}

/**
 * One placement slot in the room. Empty slots show a faint dashed
 * outline only when the player is in place-mode and this slot is a
 * valid target — they're invisible the rest of the time so the room
 * doesn't read as a wireframe.
 */
export function Slot({
  filled,
  isPlacementTarget,
  children,
  onClick,
  width,
  height,
  className,
  label,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ width, height }}
      className={cn(
        'group relative flex items-center justify-center transition-all',
        !filled && !isPlacementTarget && 'cursor-default',
        isPlacementTarget &&
          !filled &&
          'rounded-md border-2 border-dashed border-accent/70 bg-accent/10 hover:bg-accent/20',
        isPlacementTarget &&
          filled &&
          'rounded-md ring-2 ring-accent/70 ring-offset-1 ring-offset-bg',
        filled && !isPlacementTarget && 'cursor-pointer rounded-md hover:ring-2 hover:ring-danger/40',
        className,
      )}
    >
      {children}
    </button>
  )
}
