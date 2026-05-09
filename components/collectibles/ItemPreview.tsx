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
 * space down to a tight box centered on where each kind of item is
 * drawn. The viewBox center matches the visual center of the item
 * content, so the default `xMidYMid meet` aspect-fit lands the item
 * centered in the preview viewport rather than slumped to one edge.
 */
const SLOT_PREVIEW_VIEWBOX: Record<WearableSlot, string> = {
  // Hat content spans roughly y=9–32, x=42–78 across baby+adult.
  head: '42 9 36 23',
  // Glasses/eyewear sit at y≈45–56, x≈44–76.
  eyes: '40 42 40 18',
  // Body item path traces y=68–94, x=26–94 for both stages.
  body: '18 62 84 36',
  // Held accessories live at x≈84–112, y≈48–72.
  accessory: '82 48 32 24',
}
