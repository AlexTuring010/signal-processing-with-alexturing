'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import {
  getDecoration,
  isDecoration,
  COLLECTIBLES,
} from '@/lib/collectibles/registry'
import { usePetStore } from '@/lib/pet/store'
import type {
  CollectibleId,
  DecorSlot,
  DecorationCollectible,
} from '@/lib/collectibles/types'
import { PetSprite } from '@/components/pet/PetSprite'
import { Slot } from './Slot'

const ROOM_W = 256
const ROOM_H = 200

/**
 * Side-view room scene. Layout:
 *
 *   ┌────────────────────────────────────┐
 *   │  ░ ░ ░    ← 3 wall slots           │
 *   │                                     │
 *   │    [pet]   [chair]   [desk]         │
 *   │  [lamp]              [bed]          │
 *   │  ───────── floor ─────────          │
 *   └────────────────────────────────────┘
 *
 * Tap-to-place: clicking an item in the wardrobe sets it as the
 * `pendingPlacement`. While that's set, valid slots highlight; tap a
 * slot to place. Tap the same item or click the X in the wardrobe to
 * cancel. Tap a filled slot (without pending) to remove the item.
 */
export function Room() {
  const layout = useCollectiblesStore((s) => s.state.roomLayout)
  const found = useCollectiblesStore((s) => s.state.found)
  const placeDecoration = useCollectiblesStore((s) => s.placeDecoration)
  const clearSlot = useCollectiblesStore((s) => s.clearSlot)

  const petState = usePetStore((s) => s.state)
  const petMood = usePetStore((s) => s.mood())

  const [pending, setPending] = useState<CollectibleId | null>(null)

  const pendingItem = pending ? getDecoration(pending) : undefined
  const pendingSlot = pendingItem?.slot ?? null

  // Slot-target check: this slot kind matches the pending item AND
  // (for tabletop) the desk is placed.
  function isTarget(slot: DecorSlot): boolean {
    if (!pendingSlot) return false
    if (pendingSlot !== slot) return false
    if (slot === 'tabletop' && layout.furniture.desk === null) return false
    return true
  }

  function handleSlotClick(slot: DecorSlot, wallIndex?: 0 | 1 | 2) {
    if (pending) {
      // Place the pending item, only if this slot is a valid target.
      if (!isTarget(slot)) return
      placeDecoration(pending, wallIndex)
      setPending(null)
    } else {
      // No pending → click on a filled slot removes the item.
      clearSlot(slot, wallIndex)
    }
  }

  const inventory = COLLECTIBLES.filter(
    (c): c is DecorationCollectible =>
      isDecoration(c) && Boolean(found[c.id]),
  )

  // Pet anchors to the bed when asleep + bed is placed; otherwise stands
  // center-floor.
  const petOnBed = petMood === 'asleep' && layout.furniture.bed !== null

  return (
    <div className="flex flex-col gap-2">
      {/* Scene */}
      <div
        className="relative mx-auto overflow-hidden rounded-xl border border-border"
        style={{
          width: ROOM_W,
          height: ROOM_H,
          background:
            'linear-gradient(180deg, rgb(var(--accent-soft) / 0.25) 0%, rgb(var(--bg-soft)) 70%)',
        }}
      >
        {/* Wall slots */}
        <div
          className="absolute left-0 right-0 flex justify-center gap-3 px-3"
          style={{ top: 14 }}
        >
          {[0, 1, 2].map((i) => {
            const id = layout.wall[i]
            const item = id ? getDecoration(id) : undefined
            return (
              <Slot
                key={i}
                width={56}
                height={36}
                filled={Boolean(item)}
                isPlacementTarget={isTarget('wall')}
                onClick={() => handleSlotClick('wall', i as 0 | 1 | 2)}
                label={`Slot τοίχου ${i + 1}`}
              >
                {item && <item.Sprite />}
              </Slot>
            )
          })}
        </div>

        {/* Pet sprite — re-anchors to bed when asleep */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: petOnBed ? ROOM_W - 64 - 4 : (ROOM_W - 64) / 2,
            top: petOnBed ? ROOM_H - 90 : ROOM_H - 110,
            width: 64,
            height: 64,
          }}
        >
          <PetSprite
            stage={petState.stage}
            mood={petMood}
            size={56}
            still={petOnBed}
          />
        </div>

        {/* Furniture row — lamp · chair · desk · bed */}
        <FurnitureRow
          layout={layout}
          isTarget={isTarget}
          onClick={handleSlotClick}
        />

        {/* Floor strip */}
        <div className="absolute bottom-0 left-0 right-0">
          <Slot
            width={ROOM_W}
            height={28}
            filled={layout.floor !== null}
            isPlacementTarget={isTarget('floor')}
            onClick={() => handleSlotClick('floor')}
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

      {/* Wardrobe drawer */}
      <Wardrobe
        items={inventory}
        layout={layout}
        pending={pending}
        onPick={(id) => setPending(pending === id ? null : id)}
      />
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
  // Positions chosen so 4 slots + the pet roughly fit across 256 px,
  // with the pet docked above the desk position by default.
  const items: { slot: 'lamp' | 'chair' | 'desk' | 'bed'; left: number }[] = [
    { slot: 'lamp', left: 8 },
    { slot: 'chair', left: 60 },
    { slot: 'desk', left: 138 },
    { slot: 'bed', left: 196 },
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
            style={{ left, bottom: 28, width: 50, height: 60 }}
          >
            <Slot
              width={50}
              height={60}
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
      {/* Tabletop only enabled when desk is placed */}
      {layout.furniture.desk !== null && (
        <div
          className="absolute"
          style={{ left: 138 + 10, bottom: 28 + 50, width: 30, height: 30 }}
        >
          <Slot
            width={30}
            height={30}
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

/**
 * Horizontal-scroll drawer of owned decoration items grouped by slot
 * kind. Tapping an item enters place-mode for that item; tapping the
 * same item again cancels.
 */
function Wardrobe({
  items,
  layout,
  pending,
  onPick,
}: {
  items: DecorationCollectible[]
  layout: ReturnType<typeof useCollectiblesStore.getState>['state']['roomLayout']
  pending: CollectibleId | null
  onPick: (id: CollectibleId) => void
}) {
  if (items.length === 0) {
    return (
      <p className="text-center text-[11px] leading-snug text-fg-subtle">
        Καμία διακόσμηση στη συλλογή ακόμη.
      </p>
    )
  }

  // An item is "placed" if it appears anywhere in the room layout.
  const placed = new Set<CollectibleId>()
  if (layout.floor) placed.add(layout.floor)
  layout.wall.forEach((id) => id && placed.add(id))
  Object.values(layout.furniture).forEach(
    (id) => id && placed.add(id),
  )
  if (layout.tabletop) placed.add(layout.tabletop)

  return (
    <div className="flex max-h-[88px] flex-col gap-1">
      <div className="flex items-center justify-between px-1 text-[10px] uppercase tracking-wider text-fg-subtle">
        <span>Ντουλάπα</span>
        {pending && (
          <button
            type="button"
            onClick={() => onPick(pending)}
            className="rounded px-1 text-fg-muted hover:text-fg"
          >
            ✕ άκυρο
          </button>
        )}
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-1 pb-1">
        {items.map((item) => {
          const isPending = pending === item.id
          const isPlaced = placed.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              title={item.name}
              aria-pressed={isPending}
              className={cn(
                'group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border bg-bg-soft/60 transition-all',
                isPending
                  ? 'border-accent ring-2 ring-accent/40'
                  : isPlaced
                    ? 'border-success/30 opacity-60'
                    : 'border-border hover:border-accent/50',
              )}
            >
              <div className="h-10 w-10">
                <item.Sprite />
              </div>
              {isPlaced && (
                <span className="absolute right-0.5 top-0.5 rounded-full bg-success px-1 py-0.5 text-[8px] font-bold leading-none text-white">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
