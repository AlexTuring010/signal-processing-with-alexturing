import type { Collectible, CollectibleId } from './types'
import { TestHat } from '@/components/collectibles/sprites/head/_TestHat'
import { TestGlasses } from '@/components/collectibles/sprites/eyes/_TestGlasses'

/**
 * The full collectibles catalog. Phase 1 ships only the two debug
 * placeholders so the layered-sprite pipeline can be tested
 * end-to-end. Real per-page items are added in Phase 2 (six wearables)
 * and Phase 5 (the remaining catalog).
 *
 * Registry rows are pure data + their `Sprite` component. No state, no
 * side effects — the store consumes these by id.
 */
export const COLLECTIBLES: Collectible[] = [
  {
    id: '_test-hat',
    name: '[debug] Test Hat',
    description: 'Phase 1 scaffolding only. Not findable in the wild.',
    source: { kind: 'page', slug: '__debug__' },
    slot: 'head',
    Sprite: TestHat,
    rarity: 'common',
  },
  {
    id: '_test-glasses',
    name: '[debug] Test Glasses',
    description: 'Phase 1 scaffolding only. Not findable in the wild.',
    source: { kind: 'page', slug: '__debug__' },
    slot: 'eyes',
    Sprite: TestGlasses,
    rarity: 'common',
  },
]

const BY_ID: Record<string, Collectible> = Object.fromEntries(
  COLLECTIBLES.map((c) => [c.id, c]),
)

export function getCollectible(id: CollectibleId | null | undefined): Collectible | undefined {
  if (!id) return undefined
  return BY_ID[id]
}
