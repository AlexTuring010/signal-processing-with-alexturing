'use client'

import { Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getCollectible } from '@/lib/collectibles/registry'
import type { CollectibleId } from '@/lib/collectibles/types'

type Props = {
  id: CollectibleId
  /**
   * Placement strategy:
   *  - 'float' (default): floats in the right margin, prose wraps
   *    around it. Scrolls naturally with the surrounding text — the
   *    icon is visible when you arrive at that section and slides
   *    away as you read past it.
   *  - 'inline': renders at its insertion point in the markdown flow.
   *    Use when the layout doesn't have room for a margin float, or
   *    when you want the icon embedded in a specific paragraph.
   */
  position?: 'float' | 'inline'
}

/**
 * On-page collectible icon — the heart of the discovery loop.
 *
 * Two visible states:
 *   1. Unfound: pulsing ⭐ in the accent color. Click to claim.
 *   2. Found:   green ✓ checkmark with the item's name in the tooltip.
 *
 * No read-first gate — the icon is clickable as soon as you see it.
 * (We tried gating it behind the section-complete toggle but found it
 * felt punitive without buying us much; readers who skim still skim.)
 */
export function Collectible({ id, position = 'float' }: Props) {
  const item = getCollectible(id)
  const collectiblesHydrated = useCollectiblesStore((s) => s.hydrated)
  const found = useCollectiblesStore((s) => Boolean(s.state.found[id]))
  const find = useCollectiblesStore((s) => s.find)

  // Render nothing until the store has hydrated, otherwise we'd flash
  // an "unfound" pulse for an item that's actually already collected.
  if (!item) return null
  if (!collectiblesHydrated) {
    return <span className={containerClass(position)} aria-hidden="true" />
  }

  if (found) {
    return (
      <span className={containerClass(position)}>
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-success/30 bg-success/15 text-success"
          title={`${item.name} — βρέθηκε`}
          aria-label={`Συλλεκτικό βρέθηκε: ${item.name}`}
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </span>
    )
  }

  return (
    <span className={containerClass(position)}>
      <button
        type="button"
        onClick={() => find(id)}
        title="Πάρε το!"
        aria-label={`Πάρε συλλεκτικό: ${item.name}`}
        className={cn(
          'collectible-pulse inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-accent-soft/60 text-accent shadow-sm transition-transform hover:scale-110 active:scale-95',
        )}
      >
        <Sparkles className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      </button>
    </span>
  )
}

function containerClass(position: 'float' | 'inline'): string {
  if (position === 'inline') {
    return 'inline-flex align-middle mx-1'
  }
  // Float in the right margin so prose wraps around it. Scrolls with
  // the page — the icon is a section marker, not a viewport-pinned
  // attention grabber.
  return 'float-right ml-3 mb-2 mt-1 not-prose'
}
