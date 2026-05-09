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

/** Wearable slots — at most one item per slot, equipped on the pet sprite.
 *  - `skin` recolors / patterns the body itself (stars, gradient, etc).
 *  - `body` covers the body with a shirt/jacket on top of any skin.
 *  - `head`, `eyes`, `accessory` add wearables on top of the body. */
export type WearableSlot = 'head' | 'eyes' | 'body' | 'accessory' | 'skin'

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

type CollectibleBase = {
  id: CollectibleId
  /** Greek display name. */
  name: string
  /** One-line Greek description shown on find + in /collection. */
  description: string
  /** Where + how the player earns this item. */
  source: CollectibleSource
  /** Purely descriptive flavor — no mechanical effect in v1. */
  rarity: 'common' | 'rare' | 'special'
}

/**
 * Wearable item — equips onto the pet sprite. Sprite returns SVG
 * elements *inside* the pet's `0 0 120 110` viewBox using the
 * anchors from `lib/collectibles/anchors.ts`.
 */
export type WearableCollectible = CollectibleBase & {
  slot: WearableSlot
  Sprite: ComponentType<ItemRenderProps>
}

/**
 * Decoration item — sits in the pet-stage background at a fixed
 * position when placed. The Sprite returns its own complete `<svg>`
 * with whatever viewBox suits the item; the `placement` field below
 * tells the stage where to draw it (in 256×124 pet-stage coords).
 */
export type DecorationCollectible = CollectibleBase & {
  slot: DecorSlot
  Sprite: ComponentType
  /** Fixed position + size in the pet-stage's 256×124 coord space. */
  placement: { x: number; y: number; w: number; h: number }
}

export type Collectible = WearableCollectible | DecorationCollectible

/** Currently equipped on the pet sprite. At most one per slot. */
export type EquippedSlots = {
  head: CollectibleId | null
  eyes: CollectibleId | null
  body: CollectibleId | null
  accessory: CollectibleId | null
  skin: CollectibleId | null
}

export type CollectiblesState = {
  version: 3
  /** ms epoch — first time the player picked any item up. */
  startedAt: number | null
  /** Per-id pickup time. Stable order ⇒ first-found ordering. */
  found: Record<CollectibleId, number>
  equipped: EquippedSlots
  /** Decoration ids currently placed in the pet stage. Each
   *  decoration has a fixed `placement` from the registry; this is
   *  just an on/off list of which ones are showing. */
  placed: CollectibleId[]
  /** Items found but not yet viewed in /collection. Drives the
   *  pet-button orange dot. */
  newSinceSeen: CollectibleId[]
}
