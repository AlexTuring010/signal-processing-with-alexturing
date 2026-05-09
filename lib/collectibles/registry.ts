import type {
  Collectible,
  CollectibleId,
  DecorationCollectible,
  WearableCollectible,
} from './types'

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

// Phase 3 — six per-page decorations.
import { FdmRug } from '@/components/collectibles/sprites/decor/FdmRug'
import { ModulationPortrait } from '@/components/collectibles/sprites/decor/ModulationPortrait'
import { DiodeFrame } from '@/components/collectibles/sprites/decor/DiodeFrame'
import { RealizationsArmchair } from '@/components/collectibles/sprites/decor/RealizationsArmchair'
import { StaticLamp } from '@/components/collectibles/sprites/decor/StaticLamp'
import { SnrLamp } from '@/components/collectibles/sprites/decor/SnrLamp'

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

  // ---------- Phase 3 decorations ----------
  // Each decoration has a `placement` in the 256×124 pet-stage coord
  // space — its fixed home when placed. Pet sprite sits centered at
  // x=84–172, y=32–112, so decorations live around / behind it.
  {
    id: 'fdm-rug',
    name: 'FDM Ταπέτο',
    description: 'Ταπέτο με παράλληλες ζώνες — μία ανά κανάλι.',
    source: { kind: 'page', slug: 'am/multiplexing' },
    slot: 'floor',
    Sprite: FdmRug,
    rarity: 'common',
    placement: { x: 18, y: 104, w: 220, h: 20 },
  },
  {
    id: 'modulation-portrait',
    name: 'Πορτρέτο Modulation',
    description: 'Κορνιζαρισμένο σχέδιο με σήμα AM και την περιβάλλουσα.',
    source: { kind: 'page', slug: 'am/overview' },
    slot: 'wall',
    Sprite: ModulationPortrait,
    rarity: 'common',
    placement: { x: 8, y: 6, w: 40, h: 26 },
  },
  {
    id: 'diode-frame',
    name: 'Διοδική Κορνίζα',
    description: 'Μικρό σχηματικό με δίοδο — πολικότητα, διέλευση.',
    source: { kind: 'page', slug: 'am/modulator-demodulator' },
    slot: 'wall',
    Sprite: DiodeFrame,
    rarity: 'common',
    placement: { x: 208, y: 6, w: 40, h: 26 },
  },
  {
    id: 'realizations-armchair',
    name: 'Πολυθρόνα Realizations',
    description: 'Τρεις διαφορετικές τροχιές, ένα κάθισμα.',
    source: { kind: 'page', slug: 'randomness/random-processes' },
    slot: 'chair',
    Sprite: RealizationsArmchair,
    rarity: 'rare',
    placement: { x: 204, y: 56, w: 44, h: 48 },
  },
  {
    id: 'static-lamp',
    name: 'Στατικό Αμπαζούρ',
    description: 'Πηγή με λευκό θόρυβο — αχνά κουκκιδάκια στο σκιάδι.',
    source: { kind: 'page', slug: 'noise/sources' },
    slot: 'lamp',
    Sprite: StaticLamp,
    rarity: 'common',
    placement: { x: 10, y: 58, w: 28, h: 44 },
  },
  {
    id: 'snr-lamp',
    name: 'Φωτιστικό SNR',
    description: 'Σύγχρονο φωτιστικό με «S/N» χαραγμένο στο σκιάδι.',
    source: { kind: 'page', slug: 'noise/snr' },
    slot: 'lamp',
    Sprite: SnrLamp,
    rarity: 'rare',
    placement: { x: 168, y: 50, w: 28, h: 44 },
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

const WEARABLE_SLOTS = new Set(['head', 'eyes', 'body', 'accessory'])

export function isWearable(c: Collectible): c is WearableCollectible {
  return WEARABLE_SLOTS.has(c.slot)
}

export function isDecoration(c: Collectible): c is DecorationCollectible {
  return !WEARABLE_SLOTS.has(c.slot)
}

/** Narrowed lookup — returns only wearable items. */
export function getWearable(
  id: CollectibleId | null | undefined,
): WearableCollectible | undefined {
  const item = getCollectible(id)
  return item && isWearable(item) ? item : undefined
}

/** Narrowed lookup — returns only decoration items. */
export function getDecoration(
  id: CollectibleId | null | undefined,
): DecorationCollectible | undefined {
  const item = getCollectible(id)
  return item && isDecoration(item) ? item : undefined
}
