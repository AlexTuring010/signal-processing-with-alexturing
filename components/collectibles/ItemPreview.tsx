'use client'

import { cn } from '@/lib/utils'
import { isWearable } from '@/lib/collectibles/registry'
import type { Collectible, WearableSlot } from '@/lib/collectibles/types'

type Props = {
  item: Collectible
  /** When true, renders a darkened silhouette instead of the colored sprite. */
  silhouette?: boolean
  /** Size in px. Defaults to 64. */
  size?: number
}

/**
 * Visual preview for one collectible — shows ONLY the item, not the
 * pet wearing it. Wearables render inside a slot-specific cropped
 * viewBox so the item fills the preview cleanly (a hat looks like a
 * hat, not a tiny pet with a hat). Decorations render their
 * self-contained SVG directly.
 *
 * The `silhouette` mode applies a CSS filter to dim unfound items.
 */
export function ItemPreview({ item, silhouette = false, size = 64 }: Props) {
  const className = silhouette
    ? 'opacity-30 brightness-0 dark:invert dark:opacity-50'
    : ''

  if (isWearable(item)) {
    return (
      <svg
        viewBox={SLOT_PREVIEW_VIEWBOX[item.slot]}
        width={size}
        height={size}
        className={cn(className)}
        aria-hidden="true"
      >
        <item.Sprite stage="baby" mood="neutral" adult={false} />
      </svg>
    )
  }

  // Decoration — already returns a self-contained <svg> with its own
  // viewBox, so just render it inside a fixed-size container.
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <div className="h-full w-full">
        <item.Sprite />
      </div>
    </div>
  )
}

/**
 * Slot-specific viewBoxes that crop the pet's `0 0 120 110` coord
 * space down to just the region where each kind of item is drawn.
 * The item's sprite uses pet coords as usual; this just crops to its
 * footprint so it fills the preview.
 */
const SLOT_PREVIEW_VIEWBOX: Record<WearableSlot, string> = {
  head: '30 4 60 36',
  eyes: '34 38 52 22',
  body: '14 56 92 48',
  accessory: '78 48 36 26',
}
