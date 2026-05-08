'use client'

import { Sparkles, Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getCollectible } from '@/lib/collectibles/registry'
import type { CollectibleId } from '@/lib/collectibles/types'

type Props = {
  id: CollectibleId
  /**
   * Placement strategy:
   *  - 'sticky' (default): floats in the right margin, sticks to the
   *    viewport top while scrolling within the section.
   *  - 'inline': renders inline at its location in the markdown flow.
   *    Use when the page layout doesn't have room for a margin float.
   */
  position?: 'sticky' | 'inline'
}

/**
 * On-page collectible icon — the heart of the discovery loop.
 *
 * Three visible states:
 *   1. Section incomplete: faint grayscale ⭐ with not-allowed cursor.
 *      Tooltip explains the gate.
 *   2. Section complete + unfound: full-color ⭐ with breathing pulse.
 *      Click to claim.
 *   3. Found: green ✓ checkmark with the item's name in the tooltip.
 *
 * The section is "complete" when its slug is in `useAppStore.completed`
 * — exactly the same flag that drives the existing CompleteToggle. We
 * never write to that store from here, only read.
 */
export function Collectible({ id, position = 'sticky' }: Props) {
  const item = getCollectible(id)
  const completed = useAppStore((s) => s.completed)
  const hydrated = useAppStore((s) => s.hydrated)
  const collectiblesHydrated = useCollectiblesStore((s) => s.hydrated)
  const found = useCollectiblesStore((s) => Boolean(s.state.found[id]))
  const find = useCollectiblesStore((s) => s.find)

  // Render nothing until both stores have hydrated, otherwise we'd
  // briefly show "incomplete" for a finished section or "unfound" for
  // a found item — UI flicker.
  if (!item) return null
  if (!hydrated || !collectiblesHydrated) {
    return <span className={containerClass(position)} aria-hidden="true" />
  }

  const slug =
    item.source.kind === 'page' ? item.source.slug : null
  const sectionComplete = slug !== null && completed.has(slug)

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

  if (!sectionComplete) {
    return (
      <span className={containerClass(position)}>
        <span
          className="inline-flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-full border border-border bg-bg-soft/40 text-fg-subtle/70 opacity-70"
          title="Διάβασε πρώτα την ενότητα"
          aria-label="Συλλεκτικό κλειδωμένο: διάβασε πρώτα την ενότητα"
        >
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
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

function containerClass(position: 'sticky' | 'inline'): string {
  if (position === 'inline') {
    return 'inline-flex align-middle mx-1'
  }
  // Sticky float in the right margin. `float-right` so prose text
  // wraps around it cleanly; `sticky` keeps it visible on scroll.
  return 'float-right ml-3 mb-2 sticky top-24 z-10 not-prose'
}
