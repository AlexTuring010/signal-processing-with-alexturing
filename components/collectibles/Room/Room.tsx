'use client'

import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getDecoration } from '@/lib/collectibles/registry'
import { usePetStore } from '@/lib/pet/store'
import type {
  CollectibleId,
  DecorSlot,
} from '@/lib/collectibles/types'
import { PetSprite } from '@/components/pet/PetSprite'
import { Slot } from './Slot'

const ROOM_W = 248
const ROOM_H = 188

type Props = {
  /** Currently-selected item to place. Null means no place-mode. */
  pendingDecoration: CollectibleId | null
  /** Click handler — parent decides whether to place, clear, or no-op. */
  onSlotClick: (slot: DecorSlot, wallIndex?: 0 | 1 | 2) => void
}

/**
 * Side-view room scene. Shows the pet, three wall slots, four
 * furniture slots (lamp/chair/desk/bed), one floor strip, and a
 * tabletop slot that only appears when the desk is placed.
 *
 * Stateless — owner controls the place-mode pending item and slot
 * clicks. This lets the unified CollectionView sit the catalog grid
 * below the room and route taps through one handler.
 */
export function Room({ pendingDecoration, onSlotClick }: Props) {
  const layout = useCollectiblesStore((s) => s.state.roomLayout)
  const petState = usePetStore((s) => s.state)
  const petMood = usePetStore((s) => s.mood())

  const pendingItem = pendingDecoration
    ? getDecoration(pendingDecoration)
    : undefined
  const pendingSlot = pendingItem?.slot ?? null

  function isTarget(slot: DecorSlot): boolean {
    if (!pendingSlot) return false
    if (pendingSlot !== slot) return false
    if (slot === 'tabletop' && layout.furniture.desk === null) return false
    return true
  }

  const petOnBed = petMood === 'asleep' && layout.furniture.bed !== null

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl border border-border"
      style={{
        width: ROOM_W,
        height: ROOM_H,
        background:
          'linear-gradient(180deg, rgb(var(--accent-soft) / 0.25) 0%, rgb(var(--bg-soft)) 70%)',
      }}
    >
      {/* Wall slots — 3 across the top */}
      <div
        className="absolute left-0 right-0 flex justify-center gap-3 px-3"
        style={{ top: 12 }}
      >
        {[0, 1, 2].map((i) => {
          const id = layout.wall[i]
          const item = id ? getDecoration(id) : undefined
          return (
            <Slot
              key={i}
              width={52}
              height={34}
              filled={Boolean(item)}
              isPlacementTarget={isTarget('wall')}
              onClick={() => onSlotClick('wall', i as 0 | 1 | 2)}
              label={`Slot τοίχου ${i + 1}`}
            >
              {item && <item.Sprite />}
            </Slot>
          )
        })}
      </div>

      {/* Pet sprite */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: petOnBed ? ROOM_W - 60 : (ROOM_W - 56) / 2,
          top: petOnBed ? ROOM_H - 84 : ROOM_H - 102,
          width: 56,
          height: 56,
        }}
      >
        <PetSprite
          stage={petState.stage}
          mood={petMood}
          size={50}
          still={petOnBed}
        />
      </div>

      {/* Furniture row */}
      <FurnitureRow
        layout={layout}
        isTarget={isTarget}
        onClick={onSlotClick}
      />

      {/* Floor strip */}
      <div className="absolute bottom-0 left-0 right-0">
        <Slot
          width={ROOM_W}
          height={26}
          filled={layout.floor !== null}
          isPlacementTarget={isTarget('floor')}
          onClick={() => onSlotClick('floor')}
          label="Πάτωμα"
          className="!justify-stretch"
        >
          {layout.floor && (() => {
            const item = getDecoration(layout.floor)
            return item ? <item.Sprite /> : null
          })()}
        </Slot>
      </div>
    </div>
  )
}

function FurnitureRow({
  layout,
  isTarget,
  onClick,
}: {
  layout: ReturnType<typeof useCollectiblesStore.getState>['state']['roomLayout']
  isTarget: (slot: DecorSlot) => boolean
  onClick: (slot: DecorSlot) => void
}) {
  const items: { slot: 'lamp' | 'chair' | 'desk' | 'bed'; left: number }[] = [
    { slot: 'lamp', left: 6 },
    { slot: 'chair', left: 56 },
    { slot: 'desk', left: 134 },
    { slot: 'bed', left: 190 },
  ]
  return (
    <>
      {items.map(({ slot, left }) => {
        const id = layout.furniture[slot]
        const item = id ? getDecoration(id) : undefined
        return (
          <div
            key={slot}
            className="absolute"
            style={{ left, bottom: 26, width: 50, height: 56 }}
          >
            <Slot
              width={50}
              height={56}
              filled={Boolean(item)}
              isPlacementTarget={isTarget(slot)}
              onClick={() => onClick(slot)}
              label={
                slot === 'lamp'
                  ? 'Φωτιστικό'
                  : slot === 'chair'
                    ? 'Κάθισμα'
                    : slot === 'desk'
                      ? 'Γραφείο'
                      : 'Κρεβάτι'
              }
            >
              {item && <item.Sprite />}
            </Slot>
          </div>
        )
      })}
      {layout.furniture.desk !== null && (
        <div
          className="absolute"
          style={{ left: 134 + 10, bottom: 26 + 46, width: 28, height: 28 }}
        >
          <Slot
            width={28}
            height={28}
            filled={layout.tabletop !== null}
            isPlacementTarget={isTarget('tabletop')}
            onClick={() => onClick('tabletop')}
            label="Πάνω στο γραφείο"
          >
            {layout.tabletop && (() => {
              const item = getDecoration(layout.tabletop)
              return item ? <item.Sprite /> : null
            })()}
          </Slot>
        </div>
      )}
    </>
  )
}
