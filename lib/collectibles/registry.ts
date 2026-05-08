import type { Collectible, CollectibleId } from './types'

// Phase 1 debug placeholders.
import { TestHat } from '@/components/collectibles/sprites/head/_TestHat'
import { TestGlasses } from '@/components/collectibles/sprites/eyes/_TestGlasses'

// Phase 2 — six real per-page wearables.
import { WelcomeBeanie } from '@/components/collectibles/sprites/head/WelcomeBeanie'
import { HarmonicCrown } from '@/components/collectibles/sprites/head/HarmonicCrown'
import { FmHeadphones } from '@/components/collectibles/sprites/head/FmHeadphones'
import { SpectrumGlasses } from '@/components/collectibles/sprites/eyes/SpectrumGlasses'
import { SignalShirt } from '@/components/collectibles/sprites/body/SignalShirt'
import { AmJacket } from '@/components/collectibles/sprites/body/AmJacket'

/**
 * The full collectibles catalog. Phase 2 adds the six per-page real
 * wearables on top of the Phase 1 debug placeholders. Real catalog
 * sprites for the remaining 28 items land in Phase 5.
 *
 * Registry rows are pure data + their `Sprite` component. No state,
 * no side effects — the store consumes these by id.
 */
export const COLLECTIBLES: Collectible[] = [
  // ---------- Phase 1 debug ----------
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

  // ---------- Phase 2 wearables ----------
  {
    id: 'welcome-beanie',
    name: 'Σκουφάκι Καλωσορίσματος',
    description: 'Από την πρώτη σου ανάγνωση στο site.',
    source: { kind: 'page', slug: 'intro' },
    slot: 'head',
    Sprite: WelcomeBeanie,
    rarity: 'common',
  },
  {
    id: 'signal-shirt',
    name: 'Φανέλα Σήματος',
    description: 'Με τυπωμένο ένα μικρό sine wave.',
    source: { kind: 'page', slug: 'foundations/signals' },
    slot: 'body',
    Sprite: SignalShirt,
    rarity: 'common',
  },
  {
    id: 'harmonic-crown',
    name: 'Στέμμα Αρμονικών',
    description: 'Πέντε ακίδες, ίδιο σχήμα με αρμονικά spectra.',
    source: { kind: 'page', slug: 'foundations/fourier-series' },
    slot: 'head',
    Sprite: HarmonicCrown,
    rarity: 'rare',
  },
  {
    id: 'spectrum-glasses',
    name: 'Φάσμα-Γυαλιά',
    description: 'Φακοί με πρισματική απόχρωση — βλέπεις το φάσμα.',
    source: { kind: 'page', slug: 'foundations/fourier-transform' },
    slot: 'eyes',
    Sprite: SpectrumGlasses,
    rarity: 'rare',
  },
  {
    id: 'am-jacket',
    name: 'Σακάκι AM',
    description: 'Επίσημο, με κουμπί στο κέντρο της φέρουσας.',
    source: { kind: 'page', slug: 'am/conventional' },
    slot: 'body',
    Sprite: AmJacket,
    rarity: 'common',
  },
  {
    id: 'fm-headphones',
    name: 'FM Ακουστικά',
    description: 'Πάντα συντονισμένα στη σωστή συχνότητα.',
    source: { kind: 'page', slug: 'fm/idea' },
    slot: 'head',
    Sprite: FmHeadphones,
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

/** All collectibles whose source is a specific page slug. */
export function collectiblesForSlug(slug: string): Collectible[] {
  return COLLECTIBLES.filter(
    (c) => c.source.kind === 'page' && c.source.slug === slug,
  )
}
