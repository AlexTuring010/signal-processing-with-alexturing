/**
 * Type contracts for the Συλλογή feature (plans/99c-collectibles.md).
 *
 * These types are the public surface — `Collectible` is the registry
 * row, `ItemRenderProps` is what each sprite component receives,
 * `CollectiblesState` is the persisted shape backed by localStorage.
 *
 * Phase 1 scope: just the type skeleton + the bare-minimum store
 * fields needed to drive the layered PetSprite refactor. Later phases
 * fill in the source kinds, rarity flavor, and the room layout.
 */
import type { ComponentType } from 'react'
import type { Mood, Stage } from '../pet/types'

/** Wearable slots — at most one item per slot, equipped on the pet sprite. */
export type WearableSlot = 'head' | 'eyes' | 'body' | 'accessory'

/**
 * Decoration slots — items that drop into the room rather than onto the
 * pet. Wall is multi-slot in the room layout (3 slots) but every wall
 * item itself targets the same `'wall'` kind.
 */
export type DecorSlot =
  | 'floor'
  | 'wall'
  | 'bed'
  | 'desk'
  | 'chair'
  | 'lamp'
  | 'tabletop'

export type Slot = WearableSlot | DecorSlot

/** Stable string id, e.g. 'fourier-crown', 'white-noise-rug'. */
export type CollectibleId = string

/** Time-of-day window for time-locked specials, expressed as
 *  `[startHour, endHour)` in local browser time, both 0..24. */
export type TimeWindow = { startHour: number; endHour: number }

export type CollectibleSource =
  | { kind: 'page'; slug: string }
  | { kind: 'achievement'; achievementId: string }
  | { kind: 'time'; window: TimeWindow }
  | { kind: 'event'; eventId: string }

/**
 * Props every item sprite receives. The pet sprite passes its own
 * stage + mood so item authors can adapt position (a hat sits a touch
 * higher on the adult's antenna tuft) or visibility (eyes-slot items
 * are suppressed while the pet is asleep — handled in PetSprite, not
 * the item itself).
 *
 * `egg` is intentionally excluded: an unhatched egg never wears items.
 */
export type ItemRenderProps = {
  stage: Exclude<Stage, 'egg'>
  mood: Mood
  adult: boolean
}

export type Collectible = {
  id: CollectibleId
  /** Greek display name. */
  name: string
  /** One-line Greek description shown on find + in /collection. */
  description: string
  /** Where + how the player earns this item. */
  source: CollectibleSource
  /** Slot kind — determines whether it equips on the pet or drops into a room slot. */
  slot: Slot
  /** SVG fragment renderer. Returns elements *inside* the pet's `0 0 120 110` viewBox. */
  Sprite: ComponentType<ItemRenderProps>
  /** Purely descriptive flavor — no mechanical effect in v1. */
  rarity: 'common' | 'rare' | 'special'
}

/** Currently equipped on the pet sprite. At most one per slot. */
export type EquippedSlots = {
  head: CollectibleId | null
  eyes: CollectibleId | null
  body: CollectibleId | null
  accessory: CollectibleId | null
}

/** Currently placed in the room. */
export type RoomLayout = {
  floor: CollectibleId | null
  /** 3 wall slots, left-to-right along the back wall. */
  wall: [CollectibleId | null, CollectibleId | null, CollectibleId | null]
  furniture: {
    bed: CollectibleId | null
    desk: CollectibleId | null
    chair: CollectibleId | null
    lamp: CollectibleId | null
  }
  /** Tabletop only available when a desk is placed. */
  tabletop: CollectibleId | null
}

export type CollectiblesState = {
  version: 1
  /** ms epoch — first time the player picked any item up. */
  startedAt: number | null
  /** Per-id pickup time. Stable order ⇒ first-found ordering. */
  found: Record<CollectibleId, number>
  equipped: EquippedSlots
  roomLayout: RoomLayout
  /** Items found but not yet viewed in /collection. Drives the
   *  pet-button orange dot. */
  newSinceSeen: CollectibleId[]
}
