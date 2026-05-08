'use client'

import { cn } from '@/lib/utils'
import { isWearable } from '@/lib/collectibles/registry'
import type { Collectible } from '@/lib/collectibles/types'
import { PetSprite } from '@/components/pet/PetSprite'

type Props = {
  item: Collectible
  /** When true, renders a darkened silhouette instead of the colored sprite. */
  silhouette?: boolean
  /** Size in px. Defaults to 64. */
  size?: number
}

/**
 * Visual preview for one collectible. Wearables are previewed on a
 * mini pet sprite (so a hat reads as a hat, not a floating shape);
 * decorations render their self-contained SVG directly.
 *
 * The `silhouette` mode applies a CSS filter to render an unfound
 * item as a dark, low-detail shape — the player gets a hint about
 * the silhouette without spoiling colors or details.
 */
export function ItemPreview({ item, silhouette = false, size = 64 }: Props) {
  const className = silhouette
    ? 'opacity-30 brightness-0 dark:invert dark:opacity-50'
    : ''

  if (isWearable(item)) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          silhouette && 'opacity-40',
        )}
        style={{ width: size, height: size }}
      >
        <PetSprite
          stage="baby"
          mood="neutral"
          size={size - 4}
          still
          equippedOverride={{
            head: item.slot === 'head' ? item.id : null,
            eyes: item.slot === 'eyes' ? item.id : null,
            body: item.slot === 'body' ? item.id : null,
            accessory: item.slot === 'accessory' ? item.id : null,
          }}
          className={className}
        />
      </div>
    )
  }

  // Decoration — render its own SVG. Wrap in a fixed-size box.
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
