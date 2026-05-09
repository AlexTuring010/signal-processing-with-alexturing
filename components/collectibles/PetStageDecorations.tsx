'use client'

import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getDecoration } from '@/lib/collectibles/registry'

/**
 * Decoration overlay for the pet stage. Reads the `placed` list from
 * the collectibles store and renders each placed decoration at its
 * registered `placement` position, sized down so it sits as a
 * background prop around the pet.
 *
 * Mounted once at the pet stage and on the orchard pet footer; the
 * pet sprite is rendered separately on top so it stays in front.
 */
export function PetStageDecorations({
  /** Stage width in px — decoration positions are in 256×124 coords
   *  and are scaled to whatever container size you pass. */
  width = 256,
  height = 124,
}: {
  width?: number
  height?: number
}) {
  const placed = useCollectiblesStore((s) => s.state.placed)
  const hydrated = useCollectiblesStore((s) => s.hydrated)

  if (!hydrated) return null

  const sx = width / 256
  const sy = height / 124

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {placed.map((id) => {
        const item = getDecoration(id)
        if (!item) return null
        const { x, y, w, h } = item.placement
        return (
          <div
            key={id}
            className="absolute"
            style={{
              left: x * sx,
              top: y * sy,
              width: w * sx,
              height: h * sy,
            }}
          >
            <item.Sprite />
          </div>
        )
      })}
    </div>
  )
}
