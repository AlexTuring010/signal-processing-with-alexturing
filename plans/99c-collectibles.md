# 99c — Συλλογή (collectibles + pet wardrobe + room)

A persistent, browser-only collection layer that turns the theory pages into a treasure hunt. As the student reads through the site they encounter small thematic objects — a "Στέμμα Αρμονικών" tucked into the Fourier Series page, a "Πορτρέτο Modulation" hanging on the AM overview, a "Λευκό Στρώμα" on white-noise — and clicking them adds the item to a permanent collection that auto-equips on the pet (clothes/accessories) or drops into the pet's room (decorations).

This file is the design contract. Implementation lives under `lib/collectibles/` + `components/collectibles/` and as MDX surface in the existing content pages. It is intentionally written in the same register as `99-tamagotchi.md` and `99b-tycoon.md` — it must compose with both, not replace either.

---

## TL;DR for the impatient reader

> Hidden ⭐-style icons appear on every theory page, themed to the page they sit on. The icon is *visible* the whole time so the student knows there is something to find — but it stays *unclickable* until the section is marked complete (read-first gate). On click, the item gets added to the player's collection, auto-equipped on the pet if it's wearable (hat/glasses/shirt/accessory) or dropped into the pet's new "Δωμάτιο" view if it's a decoration (rug/wall art/furniture). The pet now renders with whatever the player has equipped — across the pet panel, the orchard footer, and Apple Catcher — and the room is a small drag-to-arrange scene in a new pet-panel tab. A `/collection` index page shows silhouettes of unfound items grouped by chapter so the student knows how complete their hunt is. ~40 collectibles at v1, paced one per major page plus ~10 cross-tied to existing systems (orchard milestones, achievements, time-of-day).

---

## Goals

- **Reward reading.** The honest payoff for actually finishing a section is: the page lights up a small object, you tap it, your pet gets a hat. The system should make completing pages feel *more* rewarding, not less.
- **Visual richness, not gacha.** No randomness, no rolls, no duplicates. Every collectible is uniquely placed and uniquely earned. Finding one is a fixed event with a fixed reward.
- **Don't sabotage learning.** The collectibles must never incentivise skim-scrolling for icons. The read-first gate (icon visible but unclickable until *Σήμανε ως ολοκληρωμένο* is toggled) is the central anti-pattern guard.
- **The pet finally feels owned.** Currently every Σιγμάκι is identical to every other one. After v1, two players can show each other their pets and they look meaningfully different.
- **Coherent with the site.** Each item is named for the chapter it lives in and feels like a tasteful prop, not a logo slapped on a hat.
- **Deep enough to last weeks.** ~40 items at launch is enough that nobody finishes the collection in one sitting. Time-locked items extend it past that.
- **Browser-only, no server.** All state in `localStorage`. A reset wipes the collection — same trade-off as the pet and the orchard.

## Non-goals (v1 — explicitly parked)

- **No trading, gifting, or social features.** Single player.
- **No real-money or premium currency.** No store. No timers behind a paywall.
- **No randomized drops.** Every item has a fixed location. (RNG belongs in the orchard's events, not here.)
- **No procedurally generated rooms.** The room is a single small side-view scene with fixed slots.
- **No pet-vs-pet anything.** Skins don't grant stat bonuses; this is purely cosmetic.
- **No 3D, no isometric.** Layered SVG.
- **No item levels / upgrades.** A hat is a hat. Variation lives in *more* hats, not in upgrading one.
- **No sets / set bonuses.** Tempting in a v1.5 patch but pollutes the read-first contract (students chasing bonuses will skim).
- **No cloud sync.** Same as the pet/orchard.
- **No notifications.** The site never pings the user about an undiscovered item — it's a treasure hunt by design.

These exclusions apply through v1 and stay parked unless someone files a `99d-…` plan.

---

## Theme and naming

The collection is called **Συλλογή** ("collection"). Items are named in Greek with course-thematic flavor — half-serious, half-affectionate. The aesthetic continues the established "soft Animal Crossing" look: rounded SVGs, low-saturation pastels, theme-aware via `--accent` / `--bg-soft` / `--success` / `--warn` / `--danger` tokens.

Three naming patterns:

- **Concept-first**: *"Στέμμα Αρμονικών"* (harmonic crown), *"Φίλτρο Καπέλο"* (filter beanie). Most common.
- **Affectionate-formal**: *"Διοδική Κορνίζα"* (diode frame), *"Κορώνα Compost"* (compost crown). Used for cross-tied items.
- **Tongue-in-cheek**: *"Λευκό Στρώμα Θορύβου"* (literally "white noise rug"), *"WSS Καρέκλα"* (WSS chair, because what's more stationary than a chair). Used sparingly so it doesn't get tiresome.

No course terminology *replaces* the playful tone. This is a treasure hunt; the playful side of the site, not a stealth lecture.

---

## Discovery model (the hybrid pick)

The user has approved the **hybrid** model:

- **On the page itself**: a small ⭐ icon sits in a fixed visual position within the relevant section. It's visible from the moment the page is opened — no hide-and-seek, no scroll-bait. Anyone reading the page passes by it.
- **No per-page counter**: the page does not show "1/2 found here" or any other hint that something is undiscovered. The icon's *presence* is the hint.
- **Read-first gate**: the icon is rendered but not clickable until the section is marked complete via the existing `<CompleteToggle>` (slug stored in `useAppStore.completed`). Before that, hovering shows *"Διάβασε πρώτα την ενότητα"* and the cursor is `not-allowed`.
- **`/collection` index**: a separate page lists every collectible grouped by chapter, with **silhouette + chapter name + lock state** for unfound items. This tells the student *which* chapter to dig into next without spoiling *where* on the page the item lives.

Why this combination works: students who have read a page and forgotten to look around will eventually notice the icon (it's visible), can click it instantly (they've completed the section), and feel rewarded. Students who try to "farm" by toggling sections complete without reading get the icon as their consolation prize — but the toggle is theirs to lie to themselves with, not a system we can police, so we don't try.

### Visual treatment of the on-page icon

- **Unfound + section incomplete**: small grayscale ⭐ at 30% opacity, `cursor: not-allowed`, tooltip *"Διάβασε πρώτα την ενότητα"*. No pulsing — quiet.
- **Unfound + section complete**: full-color ⭐ with a slow `pet-idle-bob`-style breathing pulse and a soft accent glow. Cursor `pointer`. Tooltip *"Πάρε το!"*.
- **Found**: a small green ✓ checkmark badge in the same spot, 50% opacity. Tooltip shows the item name. Clicking it opens the in-room preview ("όπου το έβαλα").

Reduced motion: replace the pulse with a static accent ring. Same visual language as the orchard's reduced-motion treatment.

---

## Pet sprite — layered SVG (the deeper pick)

Currently `components/pet/PetSprite.tsx` renders one monolithic SVG. We refactor it into a layered system so wearable items composite on top.

### Layers (back-to-front)

```
┌─────────────────────────────┐
│  base body (existing SVG)   │
│   ↳ feet, body, arms,       │
│     antenna, cheeks, eyes,  │
│     mouth, sick thermometer │
├─────────────────────────────┤
│  body slot      (cape,      │  ← drawn over body, under head
│                  scarf,     │
│                  shirt)     │
├─────────────────────────────┤
│  eyes slot      (glasses,   │  ← drawn over eyes
│                  monocle,   │
│                  sunglasses)│
├─────────────────────────────┤
│  head slot      (hat,       │  ← drawn at top
│                  crown,     │
│                  headband)  │
├─────────────────────────────┤
│  accessory slot (held item, │  ← drawn beside the body
│                  badge,     │
│                  pet-on-    │
│                  shoulder)  │
└─────────────────────────────┘
```

Four slots: `head` · `eyes` · `body` · `accessory`. At most one item per slot. Items are SVG fragments returned from a per-item render function; they receive `{ stage, mood, adult }` so they can adapt (a hat sits a touch higher on the adult's antenna tuft, etc).

### Item SVG conventions

Every wearable item exports a React component that returns SVG elements **inside** the existing pet `viewBox` (`0 0 120 110`) at the same coordinate space the body uses. Anchor points (head: x=60, y≈25; eyes: x=60, y=50; body center: x=60, y=60; accessory: x=92, y=60) are documented constants in `lib/collectibles/anchors.ts`. The item component uses these anchors so a new hat author doesn't have to reverse-engineer the body coordinates.

```tsx
export function HatBeret({ adult }: ItemRenderProps) {
  const yShift = adult ? -2 : 0
  return (
    <g transform={`translate(60 ${28 + yShift})`}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill="rgb(var(--accent))" />
      {/* … */}
    </g>
  )
}
```

The base `BodySvg` already wraps everything in a `transform="translate(60 60) rotate(${tilt}) translate(-60 -60)"` group for the sick-tilt. Item layers must sit **outside** that group so a tilted sick pet doesn't tilt its hat unrealistically — except the body slot, which sits *inside* (clothing tilts with you).

### Sleep & sickness interaction

- Eyes slot is **suppressed** while `mood === 'asleep'` (the eyes are closed; glasses look weird floating mid-air). The item disappears with a quick fade.
- Sick mood draws the existing thermometer at x=82, y=36. Items in the head slot must not overlap that region — anchors document a "no-fly zone" rectangle so item authors don't draw into it.
- Body slot stays through every mood. Sleeping in a cape is funny on purpose.

### Rendering surfaces — pet appears everywhere

The cosmetic propagates through every place the pet currently renders:

- `components/pet/PetSprite.tsx` (canonical)
- `components/pet/PetButton.tsx` (collapsed pet button — items render at small scale)
- `components/pet/MiniGame.tsx` (Apple Catcher — pet at the bottom)
- `components/orchard/PetFooter.tsx` (orchard panel footer)
- Any future pet rendering surface

This means **`PetSprite`** must accept an `equipped: EquippedSlots` prop and render the layered items. The cleanest path is to read the equipped state from a new `useCollectiblesStore` inside `PetSprite` itself, so call sites don't have to wire the prop manually. (The `still` and `size` props stay; we just add an internal subscription.)

### A note on small-scale rendering

In the collapsed pet button (~36 px sprite) some items will be unreadable. We don't try to render every detail at every size:

- `head` and `eyes` items always render at all sizes.
- `body` items render at >= 64 px only (below that they read as noise).
- `accessory` items render at >= 80 px only.

Below those thresholds the layer is suppressed silently. A small `*` badge appears on the collapsed pet button when the player has cosmetic items equipped that aren't visible at this scale — a quiet hint that *"there's more in the panel."*

---

## Room view — the "Δωμάτιο" tab

Decorations don't go on the pet; they go in the room. We add a new tab to the pet panel, between *Φροντίδα* and *Παίξε* (or in whatever the existing tab order is — to be confirmed at implementation time):

```
┌─────────────────────────────────────────┐
│  Σιγμάκι                            ✕   │
├─────────────────────────────────────────┤
│  Φροντίδα · Δωμάτιο · Παίξε · Συλλογή  │  ← new "Δωμάτιο" tab
├─────────────────────────────────────────┤
│   ╔═══════════════════════════════╗    │
│   ║  ░░░░░ wall  ░░░░░░░░  ░░░░░  ║    │  ← 3 wall slots (back row)
│   ║                               ║    │
│   ║       [pet sprite]            ║    │  ← pet stands here, idle-bobs
│   ║   ░░░░░  ░░░░░  ░░░░░  ░░░░░ ║    │  ← 4 furniture slots (floor)
│   ╚═══════════════════════════════╝    │
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │  ← 1 floor slot (full strip)
├─────────────────────────────────────────┤
│  Ντουλάπα ▼                             │  ← drawer to swap outfits/decor
└─────────────────────────────────────────┘
```

### Slot layout (v1)

- **Floor**: 1 slot. Single rug/carpet item covering the full bottom strip.
- **Wall**: 3 slots. Posters/paintings/clocks. Equal-spaced along the back wall.
- **Furniture**: 4 slots on the floor: bed (right), desk (right-center), chair (left-center), lamp (left). Each slot accepts only items of its kind (you can't put a bed in the lamp slot).
- **Tabletop**: 1 slot, *only available when a desk is placed*. Mug, book, plant, trophy. The first nested-slot decoration on the site.

7 placement zones total. Empty slots show a faint dashed outline with a `+` icon when the wardrobe drawer is open.

### Drag-to-place (v1)

The user explicitly chose the non-cheap version, so v1 ships with **drag-to-place**, not just tap-to-fill:

- Open the wardrobe drawer (`Ντουλάπα` strip at the bottom of the room tab) — shows owned items grouped by slot kind, scrollable.
- **Drag** an item from the drawer onto the room. While dragging, valid slots highlight in green; invalid slots (wrong kind) gray out.
- **Drop** on a valid slot → item placed. Existing item in that slot returns to the inventory.
- **Drag from slot to drawer** to remove without replacing.
- **Tap fallback**: tap an item in the drawer → if exactly one slot is valid and empty, auto-place. Otherwise enter "place mode" where the next slot tap completes the placement. (Touch-friendly + keyboard-accessible.)
- **Keyboard**: each item has Tab focus; Enter selects, arrow keys move between slots, Enter again places.

State is normalized: `roomLayout: { floor, wall: [slot1, slot2, slot3], furniture: { bed, desk, chair, lamp }, tabletop }`. No free-form (x, y) — all slots are named — to keep persistence robust to schema changes.

### Pet animation in the room

The pet idle-bobs at the center-floor anchor. When the player drags a new item in:

- A soft `*` puff at the placement point (reuses the existing pet `Particles` helper).
- Pet does a small head-turn toward the new item (`pet-glance` keyframe — 600 ms).
- A quiet "place" SFX (gated by the existing pet sound toggle).

If the player owns a `bed` and the pet's `mood === 'asleep'`, the pet sprite re-anchors to the bed slot instead of center-floor. This is the only mechanical-feeling interaction between the room and the pet — a tiny, charming detail that rewards owning a bed.

### Mobile

Below 480 px the room scales proportionally; the wardrobe drawer becomes a bottom sheet that slides up from the panel edge. Drag-to-place still works (HTML5 drag-and-drop is touch-supported via Pointer Events polyfill if needed). Each slot must have a **tap target ≥ 44 px** even on the smallest layout — the room may overflow horizontally with `overflow-x-auto` rather than shrink slots below that floor.

---

## State model

`localStorage` key: `spwa:collectibles`. Versioned independently from `spwa:pet` and `spwa:orchard` so a reset of one never nukes another.

```ts
type CollectiblesState = {
  version: 1
  /** ms epoch — first time the player ever picked something up. */
  startedAt: number | null
  /** Per-id pickup time. Stable order = first-found ordering. */
  found: Record<CollectibleId, number>
  /** Currently equipped on the pet sprite. At most one per slot. */
  equipped: {
    head: CollectibleId | null
    eyes: CollectibleId | null
    body: CollectibleId | null
    accessory: CollectibleId | null
  }
  /** Currently placed in the room. */
  roomLayout: {
    floor: CollectibleId | null
    wall: [CollectibleId | null, CollectibleId | null, CollectibleId | null]
    furniture: {
      bed: CollectibleId | null
      desk: CollectibleId | null
      chair: CollectibleId | null
      lamp: CollectibleId | null
    }
    tabletop: CollectibleId | null
  }
  /** "What's new" — items found but the player hasn't viewed in the
   *  collection yet. Cleared when the /collection page is opened. */
  newSinceSeen: CollectibleId[]
}

type CollectibleId = string  // 'fourier-crown', 'white-noise-rug', etc.

type Collectible = {
  id: CollectibleId
  /** Greek display name. */
  name: string
  /** One-line Greek description shown on find + in /collection. */
  description: string
  /** Where to find it. */
  source:
    | { kind: 'page'; slug: string }                     // page-tied
    | { kind: 'achievement'; achievementId: string }     // orchard achievement
    | { kind: 'time'; window: TimeWindow }               // 00:00–06:00, etc.
    | { kind: 'event'; eventId: string }                 // shooting star count, etc.
  /** Equip slot for wearables, room slot for decorations. */
  slot: 'head' | 'eyes' | 'body' | 'accessory'
       | 'floor' | 'wall' | 'bed' | 'desk' | 'chair' | 'lamp' | 'tabletop'
  /** Render — for wearables: SVG fragment as a React component.
   *  For decorations: SVG sprite for the room. */
  Sprite: React.ComponentType<ItemRenderProps>
  /** Optional rarity flavor (purely descriptive: 'common' | 'rare' | 'special'). */
  rarity: 'common' | 'rare' | 'special'
}
```

### Loading / migration

- Missing record → `freshCollectibles()` factory. Empty `found`, all slots `null`, `startedAt: null`.
- Version mismatch → currently a no-op (only v1 exists). When v2 ships, write a migration that preserves `found` (the collection itself) and sensibly defaults the rest.
- The store hydrates lazily on first use, the same way `useOrchardStore.hydrate()` works.

### Read-first gate uses the existing app store

We do **not** add a "section completed" duplicate inside the collectibles store. The on-page `<Collectible>` component subscribes to `useAppStore.completed` (which already drives `<CompleteToggle>`). If `completed.has(slug)` is false, the icon renders unclickable; if true, it's live.

---

## The catalog (v1)

**31 page-tied + 9 cross-tied = 40 items** at launch. The full list (placeholder Greek names, all subject to a polish pass before final commit):

### Wearables — head (12)

| Page | Name | Slot |
|---|---|---|
| `intro` | Σκουφάκι Καλωσορίσματος | head |
| `foundations/signal-transformations` | Καπέλο Μεταμόρφωσης | head |
| `foundations/fourier-series` | Στέμμα Αρμονικών | head |
| `foundations/filters` | Φίλτρο Καπέλο | head |
| `modulation/bridge` | IQ Μπερές | head |
| `am/dsb-sc` | DSB Καπέλο | head |
| `am/vsb` | VSB Σκούφος | head |
| `fm/idea` | FM Ακουστικά | head |
| (cross-tie) | Κορώνα Compost | head |
| (cross-tie) | Φιλόπονο Headband | head |
| (cross-tie) | Lucky Cap | head |
| (cross-tie) | Νυχτερινό Σκουφάκι (00–06) | head |

### Wearables — eyes (3)

| Page | Name | Slot |
|---|---|---|
| `foundations/fourier-transform` | Φάσμα-Γυαλιά | eyes |
| `am/ssb` | Μονόκλ SSB | eyes |
| (cross-tie) | Astral Glasses (5 shooting stars) | eyes |

### Wearables — body (4)

| Page | Name | Slot |
|---|---|---|
| `foundations/signals` | Φανέλα Σήματος | body |
| `am/conventional` | Σακάκι AM | body |
| `fm/pm` | Φάσης Φουλάρι | body |
| (cross-tie) | Studious Vest (50% chapters complete) | body |

### Wearables — accessory (3)

| Page | Name | Slot |
|---|---|---|
| `foundations/systems` | Πινελιά Σύστηματος (badge) | accessory |
| `randomness/why` | Ζάρι Tüche (held die) | accessory |
| (cross-tie) | Πετάλι Ευχών (claim every wish type) | accessory |

### Decorations — floor (3)

| Page | Name | Slot |
|---|---|---|
| `am/multiplexing` | FDM Ταπέτο | floor |
| `fm/bessel` | Bessel Στρώμα | floor |
| `noise/white-noise` | Λευκό Στρώμα Θορύβου | floor |

### Decorations — wall (6)

| Page | Name | Slot |
|---|---|---|
| `foundations/systems` | Πλακέτα Σύστηματος (poster) | wall |
| `reference/spectrum-conventions` | Πίνακας Φασμάτων | wall |
| `am/overview` | Πορτρέτο Modulation | wall |
| `am/modulator-demodulator` | Διοδική Κορνίζα | wall |
| `randomness/random-variables` | Πίνακας Πιθανοτήτων | wall |
| `randomness/psd` | Πόστερ PSD | wall |

> One note: `foundations/systems` has both an *accessory* and a *wall* item — the page is dense enough to host two. This is the only page with two collectibles in v1; everywhere else is one-per-page.

### Decorations — furniture (6)

| Page | Name | Slot |
|---|---|---|
| `randomness/random-processes` | Πολυθρόνα Realizations | chair |
| `randomness/stationarity` | WSS Καρέκλα | chair * |
| `noise/sources` | Στατικό Αμπαζούρ | lamp |
| `fm/in-noise` | Τριγωνικό Φωτιστικό | lamp * |
| `noise/snr` | Φωτιστικό SNR | lamp * |
| `noise/through-filters` | Φίλτρο-Κορνίζα | wall * |

(* indicates the page-tied item has a duplicate slot kind already filled by another item — meaning the player will own multiple "lamps" or multiple "chairs" but can only place one at a time. This is intentional: it gives the player a *choice* about their room, not just a checklist.)

### Decorations — tabletop (3)

| Page | Name | Slot |
|---|---|---|
| `reference/complex-numbers` | Φανάρι Φάσης | tabletop |
| `fm/carson` | Φάκελος Carson | tabletop |
| (cross-tie) | Bonsai Mug (own all bonsai trees) | tabletop |

### Cross-tied specials (already counted above + a few extras)

- **Κορώνα Compost** — compost the orchard 5×.
- **Φιλόπονο Headband** — 30 consecutive days petting Σιγμάκι.
- **Lucky Cap** — win Apple Catcher 10 times.
- **Astral Glasses** — claim 5 shooting-star events.
- **Bonsai Mug** — own all bonsai trees in the orchard.
- **Πετάλι Ευχών** — claim every wish type at least once.
- **Νυχτερινό Σκουφάκι** — open the site between 00:00 and 06:00 local time.
- **Studious Vest** — complete ≥ 50% of all chapters in `useAppStore.completed`.
- **Γενεθλίων Κορώνα** — open the site on the user's birthday (set in profile, optional).

### Empty slot? No

The numbers were chosen so every slot kind has at least 2 items at launch. The smallest groups (eyes: 3, accessory: 3, floor: 3, tabletop: 3) still give the player a real choice from the moment they own a couple of them.

---

## Found UX (the moment of discovery)

When a clickable on-page ⭐ is tapped, the sequence is:

1. **Click feedback** (immediate): icon swallows-in (`scale 1 → 0.6 → 1.2 → 0`) over 240 ms; on completion the green ✓ takes its place at the same anchor.
2. **Banner** (slides in from the top of the viewport, not the panel — this needs to feel global, not panel-scoped): wide pill with the item's SVG sprite on the left, item name + chapter on the right, tone `success`. Auto-dismiss in 5 s; click to dismiss earlier.
3. **Auto-equip / auto-place**:
   - Wearable: occupies its slot. If the slot was already occupied, the previous item returns to inventory with a small "removed: X" subtoast.
   - Decoration: drops into its named slot (floor/bed/desk/chair/lamp/tabletop) if empty, else into inventory with an info subtoast. Does *not* auto-replace existing decorations — feels rude.
4. **Pet reaction**: a single `pet-glance` head-turn animation toward the item. 600 ms, bounded by reduced-motion override.
5. **Sound**: a soft "discover" chime (~300 ms), routed through the existing pet sound toggle so it respects mute.
6. **Side-effect on the orchard**: nothing. Collecting items doesn't grant apples/coins/seeds/stars. We deliberately keep the systems uncrossed in this direction so studying-for-the-orchard never bleeds in here.
7. **State**: `found[id] = now`, `newSinceSeen.push(id)`. If wearable: `equipped[slot] = id`. If decoration into empty slot: `roomLayout[slot] = id`.

Per `99b-tycoon.md` we already have a **toast queue** style component; this banner is **separate** and visually fancier — lower in the layer stack but more prominent typographically. New file: `components/collectibles/FindBanner.tsx`.

---

## The `/collection` index page

Route: `app/collection/page.tsx` (top-level, not under `/(content)` because it's chrome, not study material).

Layout:

```
┌──────────────────────────────────────────────────────┐
│  Συλλογή                              17 / 40  ████░│
├──────────────────────────────────────────────────────┤
│  ▼ Foundations                            6 / 8     │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│   │ 🎩 │ │ 👓 │ │ 🟫 │ │ ╳  │ │ 🪑 │ │ ╳  │         │
│   │name│ │name│ │name│ │ ?? │ │name│ │ ?? │         │
│   └────┘ └────┘ └────┘ └────┘ └────┘ └────┘         │
│  ▶ Modulation (AM)                       4 / 7     │
│  ▶ Modulation (FM)                       2 / 5     │
│  ▶ Randomness                            1 / 5     │
│  ▶ Noise                                 0 / 4     │
│  ▶ Special                               4 / 9     │
└──────────────────────────────────────────────────────┘
```

- **Found items** show full SVG, name, and chapter source. Clicking one opens an in-place preview ("equipped on Σιγμάκι" or "placed on the chair").
- **Unfound items** show a `╳` silhouette, a "??" name, and the **chapter name only** as the hint. No "this is on page X" leak.
- **Locked specials** (e.g. compost crown when compostRun = 0) show silhouette + a small lock icon + a hint about what kind of system unlocks it ("Διαθέσιμο μέσω Compost"). Time-locked items don't even hint at the time window — figure it out.
- Top progress bar shows `found / total` lifetime.
- Opening this page **clears `newSinceSeen`** and removes the orange dot from the panel header.

---

## Pet panel changes

Two additions to `components/pet/PetPanel.tsx`:

### 1. The "Δωμάτιο" tab

Inserted into the existing tab order. Renders the room view + wardrobe drawer described above. The pet sprite within the room is a normal `PetSprite` reading from the new equipment store, so nothing special is wired here — the pet automatically wears whatever it's equipped with.

### 2. Header notification dot

A small orange dot on the pet button (and on the *Δωμάτιο* tab itself) appears whenever `newSinceSeen.length > 0` — i.e. the player has picked up something they haven't viewed yet in `/collection` or worn yet in the wardrobe. Cleared by visiting `/collection` or by opening the wardrobe drawer.

This is the same UX vocabulary as the existing pet "needs attention" red dot; we use orange instead of red so the player can distinguish "someone needs feeding" from "ooh, new hat."

---

## Cross-system contracts

This is where the systems touch each other. Each contract is one direction only — same rule the orchard followed (`orchard reads pet, never writes`).

### Reads — collectibles ← others

- **Pet store** (`usePetStore.state.stage`, `.mood`): item sprites consume these to adapt their position/visibility.
- **App store** (`useAppStore.completed`): the on-page `<Collectible>` reads this to decide if its icon is clickable.
- **Orchard store** (`useOrchardStore.state.prestige.compostRun`, `.achieved`, `.events.log`): cross-tied items poll these to determine eligibility.

### Writes — collectibles → others

**None.** The collectibles store never writes to the pet, app, or orchard stores. The only side-effects of finding a collectible are inside the collectibles store itself + UI banners/sounds. This keeps the system safely additive.

### Eligibility check — when does a cross-tied item appear?

Cross-tied items don't have on-page icons. They auto-grant on first eligibility check that passes:

- Eligibility runs in `useCollectiblesStore.tick(now)`, called every ~10 s while the pet panel is open + on every relevant store action (compost completed, achievement earned, shooting-star claimed). Cheap.
- When eligibility flips for an item the player doesn't own, the same find banner fires + auto-equip happens. The banner explicitly cites the trigger: *"Επίτευγμα: 5 compost. Πάρε το Κορώνα Compost."*

For the time-locked items (Νυχτερινό Σκουφάκι, Γενεθλίων Κορώνα), we check on every panel open + on a single timer set 1 minute past the open boundary. Anti-cheating: `Date.now()` is trusted (we're not going to fight the user's system clock for a hat).

---

## Animations and feedback

- **Find banner enter**: slide-down + scale-up from 95% to 100%, 320 ms. Slide-up exit, 220 ms.
- **Pet glance**: existing pet head-turn keyframe (`pet-glance`, to be authored) — 600 ms ease-out.
- **Item place puff**: 6-particle burst, 500 ms life, reuses the existing pet `Particles` component.
- **Wardrobe drag**: `cursor: grabbing` + slight 95% opacity on the dragged ghost; valid drop slots get a 1.5 px accent ring.
- **Room ambient**: the lamp slot, when filled with any lamp item, gets a single very-slow pulsing soft-light SVG filter (`lamp-glow` keyframe, 4 s loop). Cute, never intrusive.
- **/collection unlock**: when the player crosses 25%, 50%, 75%, 100% of total collectibles, the progress bar plays a one-shot shimmer. Coloring shifts from accent → success at 100%.

All animations cap < 1.5 s (compost ceremony was the lone exception). Reduced-motion: each keyframe collapses to a static end-state via the existing `*` global override in `globals.css`.

---

## Sound

Reuses the existing pet audio gate (`lib/pet/audio.ts`). Three new SFX cues:

- `discover` — soft sparkle chime, ~300 ms. Plays on find.
- `place` — quiet "thunk", ~200 ms. Plays on drop into a slot.
- `equip` — small fabric/swoosh, ~180 ms. Plays on auto-equip from inventory.

All three respect the pet sound toggle (no separate "collectibles audio" preference). No music — same decision as the orchard.

---

## Accessibility

- **On-page icon**: `<button>` with `aria-label="Συλλεκτικό: <chapter>. <state>"` where state is "Διάβασε πρώτα" / "Πάρε το" / "Βρέθηκε". Keyboard focusable in normal tab order.
- **Find banner**: `role="status" aria-live="polite"` so screen readers announce the find without an interrupt.
- **Wardrobe drag-and-drop**: full keyboard alternative via Tab + Enter + arrow keys (described above). Slot focus rings use the existing `*:focus-visible` style.
- **/collection**: cards are `<button>`s with `aria-pressed` for selected. Group expand/collapse via `<button aria-expanded>` (chapter headers).
- **Color**: never the only signal — found state has both color (green) AND a checkmark icon; locked state has both color (gray) AND a lock icon; rarity uses both a color tint AND a small label ("Σπάνιο", "Ειδικό").
- **Motion**: every animation respects `prefers-reduced-motion: reduce`.
- **High contrast**: all new components pass WCAG AA. Spot-check the silhouette state and the lamp glow.

---

## File structure

```
lib/collectibles/
  types.ts              – CollectiblesState, Collectible, ItemRenderProps types
  defaults.ts           – freshCollectibles(), VERSION, slot constants, anchor coords
  registry.ts           – the 40-item registry; pure data + Sprite components
  store.ts              – zustand store: hydrate, find, equip, unequip, place, tick
  eligibility.ts        – pure functions for cross-tied item triggers
  anchors.ts            – exported coordinate constants (HEAD_ANCHOR etc.)

components/collectibles/
  Collectible.tsx       – the on-page ⭐ icon (the one MDX uses)
  FindBanner.tsx        – the slide-down banner on first find
  CollectionGrid.tsx    – the /collection page's chapter-grouped grid
  ChapterGroup.tsx      – one expandable group inside CollectionGrid
  ItemCard.tsx          – the small card for a single found / unfound item
  Wardrobe.tsx          – the drawer of owned items in the room tab
  Room/
    Room.tsx            – the room scene + slot layout
    Slot.tsx            – one slot (floor / wall / furniture / tabletop)
    DropTarget.tsx      – drag-and-drop helper for slots
  sprites/
    head/               – HatBeret.tsx, CrownHarmonics.tsx, …
    eyes/               – SpectrumGlasses.tsx, MonocleSSB.tsx, …
    body/               – JacketAM.tsx, ScarfPM.tsx, …
    accessory/          – BadgeSystems.tsx, DiceTuche.tsx, …
    decor/              – FdmRug.tsx, ModulationPortrait.tsx, …
  PetSprite.tsx         – (modified) accepts equipped slots, layers items

app/collection/
  page.tsx              – the collection index page

mdx-components.tsx      – exports `Collectible` so MDX can use <Collectible id="..." />
```

`app/globals.css` gets a `/* Collectibles */` block:

- `collectible-pulse` — slow breathing pulse on the unfound + clickable icon (1.6 s loop).
- `collectible-found-pop` — scale-in for the ✓ when an item is collected (240 ms).
- `find-banner-in` / `find-banner-out` — slide-down + slide-up.
- `pet-glance` — small head turn (600 ms).
- `lamp-glow` — slow soft-light cycle on the lamp item (4 s loop).
- `wardrobe-grab` — minor visual on the dragged ghost (transient, no looping).

`lib/storage.ts` adds: `collectibles: 'spwa:collectibles'`.

`lib/pet/store.ts` and `lib/orchard/store.ts` are **not** modified — collectibles read from them through public selectors only.

---

## MDX integration

Once `Collectible` is registered in `mdx-components.tsx`, authors place an icon on a page like:

```mdx
import { Collectible } from '@/components/collectibles/Collectible'

## Σύνθεση και ανάλυση

Η εμβληματική κατασκευή του τετραγωνικού παλμού …

<Collectible id="harmonic-crown" />
```

The component knows its own slug from `id` (looked up in the registry) and self-positions: by default, it floats at `right: 1rem; top: 6rem` of its containing section, with `position: sticky` so it follows on scroll until the next `<h2>`. Authors can override placement with a `position` prop if a section's flow doesn't work for the default. The exact placement is pinned during the v1 polish pass — every page gets its on-page icon manually positioned to feel intentional, not random.

---

## Implementation phases

The plan is bigger than `99b` and we **must** firewall it. Each phase is an independent reviewable PR; phases ship to `main` only when the previous phase has been used in real play for ≥ 1 day.

### Phase 1 — Layered pet sprite (1–2 days)

- `lib/collectibles/anchors.ts` constants.
- `lib/collectibles/types.ts`: `Collectible`, `ItemRenderProps`, `EquippedSlots`.
- Refactor `components/pet/PetSprite.tsx` to layer head/eyes/body/accessory items on top of the existing body, with empty slots as no-op.
- One placeholder hat sprite + one placeholder glasses sprite committed to `sprites/head/_test.tsx` so the pipeline is exercised end-to-end.
- A debug-only "force-equip" function in the dev console for manual testing — not surfaced in the UI.

Deliverable: when you set `useCollectiblesStore.setState({ equipped: { head: '_test-hat', … } })` from the console, the pet wears the hat in PetPanel + Apple Catcher + orchard footer.

### Phase 2 — On-page collectibles + find UX (2–3 days)

- `lib/collectibles/store.ts` with hydrate, find, equip.
- `components/collectibles/Collectible.tsx` (the on-page icon).
- `components/collectibles/FindBanner.tsx`.
- Read-first gate via `useAppStore.completed`.
- Sound cues + reduced-motion handling.
- 6 real wearables placed on real pages (intro, foundations/signals, foundations/fourier-series, foundations/fourier-transform, am/conventional, fm/idea) so the first run can find them in order.
- Migration scaffold (only v1 right now, but the migration switch is in place).

Deliverable: a player who completes the intro and looks at the page sees an icon, clicks it, gets a banner, and the pet now has a hat. Repeat for 5 more pages.

### Phase 3 — Δωμάτιο tab + room sprites (3–4 days)

- `components/collectibles/Room/*.tsx` — Room, Slot, DropTarget.
- `components/collectibles/Wardrobe.tsx` (drawer).
- HTML5 drag-and-drop with Pointer Events polyfill + keyboard fallback.
- 6 decorations placed on real pages (am/multiplexing, am/overview, am/modulator-demodulator, randomness/random-processes, noise/sources, noise/snr).
- Pet's `mood === 'asleep'` re-anchors to bed slot when bed is placed.

Deliverable: a player with a rug + a wall poster + a chair can open the room tab and see them all placed; can drag them around between valid slots.

### Phase 4 — `/collection` page + chapter grouping (1–2 days)

- `app/collection/page.tsx`.
- Chapter grouping logic in `lib/collectibles/registry.ts` — each item is tagged with its chapter (foundations, am, fm, randomness, noise, special).
- Silhouette renderer (gray fill, no detail, no name).
- Progress bar + 25/50/75/100% shimmer.
- `newSinceSeen` clearing on visit.
- Pet button orange dot.

Deliverable: a player can navigate to `/collection`, see what they have and what's missing, and know what chapter to look in next.

### Phase 5 — Catalog completion (3–4 days)

- The remaining 28 wearables + decorations authored as SVG sprites.
- Per-page placement of every on-page icon (this is a polish pass through every MDX file).
- Cross-tied eligibility wiring (compost-run, achievement, time, event triggers).
- Polish: every banner copy reviewed by user; every name finalized.

Deliverable: every collectible reachable. The catalog is closed at 40.

### Phase 6 — Polish (open-ended)

- Per-item place-animation tweaks (the lamp glow, the bonsai-mug bobble).
- Mobile pass on the room (drag-and-drop on touch).
- Accessibility audit on the wardrobe + /collection.
- Performance: confirm pet sprite re-renders are cheap (memoize item sprites).
- Empirical balance: do players find them organically? Adjust on-page positions if not.

After Phase 6 the v1 collection ships. Anything beyond is `99d-…` territory (sets, trades, skins, achievement-cosmetic crossover, weekly drops, etc.).

---

## Risks and mitigations

- **Risk: The read-first gate is gameable.** *Mitigation:* it is, and we accept that. Marking complete without reading is a self-deception, not a system-level cheat. We don't need to police it; we only need to make actually reading more rewarding than gaming, and that's done by the rest of the site.
- **Risk: Pet sprite re-render cost.** *Mitigation:* memoize each item's `Sprite` component on `(stage, mood, adult)`. The pet panel's existing rendering surface is already cheap; each layer is one SVG group with ~5–15 nodes.
- **Risk: Catalog scope creep.** *Mitigation:* the catalog is *closed at 40* in this plan. Every additional item is a future plan, not a slow leak.
- **Risk: SVG sprite work is tedious and inconsistent.** *Mitigation:* every sprite uses the established anchors + viewBox; the plan author + the user pair on the first 3–5 items to set the visual bar, then the rest follow. Reject any sprite that doesn't match the bar at PR time.
- **Risk: localStorage size.** *Mitigation:* JSON state at full collection is < 5 KB. No images stored — sprites are React components. Trivially cheap.
- **Risk: Cross-store cycles.** *Mitigation:* one-direction-only contract. Collectibles read; never write. Same rule that worked for the orchard.
- **Risk: Treasure-hunting feels gimmicky next to the actual study material.** *Mitigation:* the on-page icon's footprint is small, sticky in a margin, never inline in prose. A reader who doesn't care about the toy doesn't even have to look at it. We measure success by "does the toy make people read more pages?" — not by collection size.
- **Risk: An item's SVG looks bad small.** *Mitigation:* the small-scale rendering rules above (head/eyes always, body ≥ 64 px, accessory ≥ 80 px) plus the small-scale fallback `*` badge. Anything that doesn't pass the readability bar is suppressed.

---

## Cross-references

- Pairs with `plans/99-tamagotchi.md` (the pet contract). Adds the equipped-slots concept on top of the existing `PetState` without modifying `PetState` — equipment lives in `CollectiblesState`.
- Pairs with `plans/99b-tycoon.md` (the orchard). Cross-tied items read from the orchard's `prestige`, `achieved`, and `events.log` selectors. The orchard is *not* modified.
- Reuses the existing `*` reduced-motion override and the existing `--accent` / `--bg-soft` / `--success` / `--warn` / `--danger` tokens. No new theme tokens.
- `plans/COMMITMENTS.md` — none added by this plan, none satisfied. Update if any forward-looking promise emerges during build.
- The teaching philosophy in `CLAUDE.md` applies to *educational content* only. Collectible names and the `/collection` page are chrome and toy — they keep their own playful Greek voice.
