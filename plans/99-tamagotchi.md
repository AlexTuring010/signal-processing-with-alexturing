# 99 — Tamagotchi (study-companion virtual pet)

A small persistent virtual pet living in the bottom-left corner of every page. Hat-tip to 90s Tamagotchi: feed it, play with it, watch it grow. State lives in `localStorage` only — no Supabase, no auth, no server. It's a side feature, not a study mechanic — but study activity gives the pet a small boost so the two systems feel connected.

This file is the design contract. Implementation lives in `lib/pet/` and `components/pet/`.

---

## Goal

A delightful, well-made little creature that:

- feels alive (idle bob, expressions, reaction animations) without being noisy or annoying
- is fully optional — closed by default, never blocks the page, never plays sound
- runs entirely client-side (`localStorage`, no network)
- looks coherent in both dark and light theme
- works on mobile (the panel must fit a 360 px viewport)
- never punishes the student — neglect leads to sad / sick states, never to death

The pet is **not** a course concept. Don't tie it to Greek pedagogy text. Use plain Greek labels for actions; keep the playful tone short.

---

## Pet identity

A round blob creature with big oval eyes and a small mouth that changes per emotion. Two tiny nubs for arms, two for feet. Drawn in SVG with smooth shapes (not blocky pixel art — we want "soft Animal Crossing" not "8-bit"). Accent color tracks the site's `--accent` so dark/light themes feel native.

- Default species name: **Σιγμάκι** (a play on the Σ of summation; the user-visible name is set on hatch).
- The user names the pet on first hatch. Default name: `Σιγμάκι`. They can rename later from the panel header (small pencil icon).

### Stages (3)

| Stage   | Trigger                                 | Visual                                                                |
|---------|-----------------------------------------|-----------------------------------------------------------------------|
| `egg`   | Default — appears on first load         | Speckled egg, occasional 1.5s wobble                                  |
| `baby`  | Hatched after a deliberate user action  | Small round form, oversized head (~70% of body), big eyes             |
| `adult` | Total care-time ≥ 3 days *and* avg need over the last 24h ≥ 60 | Slightly larger, slightly more defined features, small antenna tuft |

Stages only progress forward. Adult is terminal; pet stays adult forever.

### Mood (derived, not stored)

Compute from current needs at render time:

- avg ≥ 70 → `happy` 😊 (default smile)
- avg 40–70 → `neutral` 🙂 (small line mouth)
- avg < 40 → `sad` 😔 (downturned mouth)
- any need at 0 for ≥ 1 hour of real time → `sick` 🤒 (overrides others; tilted head + thermometer bubble)
- pet is `sleeping` → `asleep` 💤 (overrides all visuals; small floating Z particles)

---

## State model

`localStorage` key: `spwa:pet` (extends the existing `STORAGE_KEYS` namespace).
Schema version is included so we can migrate later.

```ts
type PetState = {
  version: 1
  hatched: boolean              // false until first action turns egg → baby
  name: string                  // user-set on hatch, default "Σιγμάκι"
  stage: 'egg' | 'baby' | 'adult'
  bornAt: number                // ms epoch — when egg was created
  hatchedAt: number | null      // ms epoch — when transitioned to baby
  needs: { hunger: number; happiness: number; energy: number } // 0..100
  sleeping: boolean
  sickSince: number | null      // ms epoch — when current sick streak began (else null)
  lastTickAt: number            // ms epoch — last decay reconciliation
  cooldowns: { feed: number; play: number; clean: number } // ms epoch — earliest next allowed
  totalActions: number          // lifetime count, just for fun stats
}
```

Loading rules:

- If no record exists → create a fresh `egg` state with all needs at 80.
- If `version` is missing or unknown → reset to fresh state (no migration tooling in v1).
- On every load, compute elapsed since `lastTickAt` and apply decay (see below) before rendering.

---

## Decay model

Designed for casual care: a once-a-day check-in keeps the pet healthy. Needs decay only when the pet is `baby` or `adult`. Eggs do not decay.

Per-need rate (points per hour, while awake):

- `hunger`: 8/h  → 0 in ~12h from full
- `happiness`: 6/h → 0 in ~16h from full
- `energy`: 10/h → 0 in ~10h from full

While `sleeping`:

- `energy` regenerates at +20/h (clamped to 100)
- `hunger` decays at half rate (4/h)
- `happiness` decay paused

Decay is computed as a single closed-form delta on each load / tick:

```
applyDecay(state, nowMs):
  dt_h = max(0, (nowMs - state.lastTickAt) / 3_600_000)
  for each need: clamp(0..100, n - rate * dt_h)
  if sleeping: apply sleep-rates instead
  state.lastTickAt = nowMs
  recompute sickSince:
    if any need == 0:
      sickSince = sickSince ?? nowMs
    else:
      sickSince = null
```

A foreground ticker calls this every 60 s while the panel is open, and once on mount (catches up after the tab was closed). No interval runs in the background — we trust `lastTickAt`.

`prefers-reduced-motion` does not change decay; only animations.

---

## Actions

Each action runs through a single dispatcher (`applyAction`) that:

1. Calls `applyDecay` first (so the action sees current values)
2. Validates cooldown / sleeping / stage
3. Mutates needs, increments `totalActions`, sets new cooldown
4. Triggers a one-shot animation (state flag cleared after the animation duration)

| Action  | Effect                                 | Cooldown | Disabled when                              | Animation         |
|---------|----------------------------------------|----------|--------------------------------------------|-------------------|
| Feed    | +30 hunger, +5 happiness               | 60 s     | sleeping; hunger ≥ 95                      | "om-nom" + crumbs |
| Play    | +25 happiness, −10 energy              | 90 s     | sleeping; energy < 15                      | jump + star burst |
| Sleep   | toggles `sleeping`                     | none     | egg                                         | crossfade + Z's   |
| Pet     | +5 happiness                            | none     | egg                                         | rising hearts     |
| Heal    | clears `sickSince`, sets all needs to 60 | 4 h    | not sick                                    | sparkle           |
| Hatch   | egg → baby, prompts for name            | n/a     | not egg                                     | egg shake → crack |

`Sleep` is shown as a moon icon button that toggles to a sun icon when the pet is asleep. While sleeping, `Feed` and `Play` are disabled with a small "ssh, κοιμάται" tooltip. `Pet` still works (it just nudges the sleeping pet without waking it — small heart, no happiness gain while sleeping is fine).

`Heal` only appears when `sickSince` is non-null. It's the recovery button — you have to actually use it, neglect doesn't auto-resolve.

`Pet` is the always-available free interaction — clicking the sprite itself counts as a Pet (no button needed). It has its own ~800 ms internal cooldown so spam-clicking doesn't spam hearts.

---

## Study integration (small, non-mandatory)

The pet store subscribes to `useAppStore`. On *additions* to these sets it applies a one-shot boost:

| Trigger                          | Effect                                             |
|----------------------------------|----------------------------------------------------|
| `completed.add(slug)`            | +8 happiness, +5 energy, "study sparkle" particle  |
| `solvedExercises.add(key)`       | +5 happiness                                       |

Removals (un-checking a completion) do nothing — we never penalize.

The panel shows a small "✨ +8 από διάβασμα" toast for ~2 s when this fires, but only if the panel is open. If closed, the bonus still applies silently and the next time the user opens the panel the pet is just a bit happier.

---

## UI

### Collapsed (default state on every page)

- Position: `fixed bottom-4 left-4 z-40` (above page content, below modals/header).
- Round 56×56 button with the pet sprite scaled down inside a soft circle.
- A tiny mood emoji floats at the bottom-right of the circle (or 🥚 for egg, 💤 for sleeping).
- A small red dot in the top-right of the button when *any* need is < 20 OR when sick. Disappears once tended.
- `aria-label`: "Φρόντισε το {name}" (or "Δες το αυγουλάκι" before hatch).
- Hover: subtle scale 1.05; the sprite does a happy hop.

### Expanded panel

- Anchored above the button with a slide-up + fade keyframe. Width 280 px (240 on < 400 px viewports).
- `role="dialog"`, `aria-modal="false"`, focus trap is **not** required (it's a non-blocking utility); but Esc closes.
- Sections, top to bottom:
  1. **Header row** — pet name (editable on small pencil click), age in days/hours, close X.
  2. **Stage scene** — a 200×120 box with a soft gradient floor and the pet idling on it. While sleeping, a translucent moon overlay. Click on the pet = Pet action.
  3. **Need bars** — three bars stacked, each 6 px tall:
     - 🍎 Πείνα · bar
     - 🎈 Χαρά · bar
     - ⚡ Ενέργεια · bar
     The bar fill color is `--success` for ≥ 60, `--warn` for 30–60, `--danger` for < 30.
  4. **Action row** — Feed / Play / Sleep / Heal-or-Pet, as 4 equal-width buttons with icon + Greek label. Disabled buttons get reduced opacity and a `title` explaining why.
  5. **Footer** — tiny `fg-subtle` text: "Αποθηκεύεται μόνο στον browser σου." Clicking it expands an inline "Ξεκίνα από την αρχή" reset button (with a confirm step). No analytics.

### First-time / Hatch flow

- Initial state is `egg`. Collapsed button shows 🥚.
- Opening the panel reveals the egg with two wobble cycles; copy: "Ένα αυγουλάκι περιμένει." Single big button: **«Κλώσσα»**.
- Pressing it triggers the crack animation (1.2 s), then a small dialog asks for the name (default `Σιγμάκι`, max 16 chars, trimmed). Submit → `hatched = true`, `stage = baby`, `hatchedAt = now`, panel rerenders to the standard expanded layout.
- This is the only flow that uses an inline form. After hatching, name edits use the pencil icon in the header.

### Reset (rarely needed)

Footer "Ξεκίνα από την αρχή" → confirm → clear `spwa:pet` from storage and create a fresh egg. No undo.

---

## Animations

All keyframes go in `app/globals.css` next to the existing `music-bar` block, prefixed `pet-`. They must respect the existing reduced-motion override (already `*` rules out long animations).

- `pet-idle-bob` — 2.4 s ease-in-out, ±2 px translateY. Always running on baby/adult sprites.
- `pet-wobble` — used by egg, 1.5 s, 4 cycles every ~12 s.
- `pet-eat` — 700 ms, jaw moves + tiny crumb particles fall.
- `pet-jump` — 600 ms, parabolic translateY with a ★ burst at apex.
- `pet-zzz` — 2 s loop, three "z" characters drift up and fade.
- `pet-hearts` — 1 s, 3 hearts rise + fade.
- `pet-hatch` — 1.2 s, egg shudder → crack overlay → baby sprite fade-in.
- `pet-sparkle` — 900 ms, three small sparkle dots radiate outward (used by `Heal` and study boost).

Particles are simple `<span>`s positioned absolutely inside the scene box and animated via the keyframes above. No canvas, no library.

---

## Accessibility

- Collapsed button is a real `<button>` with descriptive `aria-label`.
- Action buttons all have visible Greek labels; icons are `aria-hidden`.
- Need bars expose values via `role="progressbar"` + `aria-valuenow/min/max` + `aria-label`.
- Esc closes the panel; focus returns to the collapsed button.
- The editable name is a real `<input>` reachable by Tab.
- All animations are short (< 1.5 s except idle); reduced-motion users get a static sprite (idle bob handled by the global `*` reduced-motion rule).

---

## File structure

```
lib/pet/
  types.ts          – PetState, NeedKey, ActionKind types
  defaults.ts       – fresh egg factory, constants (decay rates, cooldowns)
  decay.ts          – pure applyDecay(state, now) → state'
  evolve.ts         – pure maybeEvolve(state, now) → state' (called inside tick)
  store.ts          – zustand store: hydrate, tick, actions, study-boost, subscribe to app store

components/pet/
  Tamagotchi.tsx    – root client component; mounts collapsed button; manages open/close + ESC; runs tick interval while open
  PetButton.tsx     – the collapsed 56px round button
  PetPanel.tsx      – the expanded panel
  PetSprite.tsx     – stage- and mood-aware SVG sprite
  NeedBar.tsx       – single labeled progress bar
  ActionRow.tsx     – the 4-button row + tooltips + dispatch
  HatchDialog.tsx   – egg → baby naming flow inline in the panel
  particles.tsx     – tiny helper components for crumbs/hearts/zzz/sparkle
```

`app/globals.css` gets a new "Tamagotchi pet" comment block with the keyframes listed above.

`app/layout.tsx` mounts `<Tamagotchi />` after `<Footer />`. It is a `'use client'` component; the rest of the layout is server-rendered as today.

`lib/storage.ts` gets one new entry: `pet: 'spwa:pet'` in `STORAGE_KEYS`.

---

## Implementation order

1. `lib/pet/types.ts`, `defaults.ts`, `decay.ts`, `evolve.ts` — pure logic, no React.
2. `lib/pet/store.ts` — zustand store with hydrate, tick, action dispatcher, study-boost subscriber.
3. `components/pet/PetSprite.tsx` — the visual; build first so we can iterate on it visually.
4. `components/pet/NeedBar.tsx`, `particles.tsx`.
5. `components/pet/ActionRow.tsx`, `HatchDialog.tsx`, `PetPanel.tsx`.
6. `components/pet/PetButton.tsx`, `Tamagotchi.tsx` (root).
7. Add keyframes to `app/globals.css`.
8. Mount in `app/layout.tsx`. Add `pet` key to `STORAGE_KEYS`.
9. `npm run typecheck`. Fix any types. Run `npm run dev` and play with it.

---

## What this is NOT, in v1

Park these explicitly so we don't scope-creep:

- No multiplayer / shared pets / leaderboards.
- No Supabase persistence — it's a browser toy, intentionally.
- No sounds.
- No achievements / badges screen.
- No customization (color, hat, etc.). Keep one default look.
- No mini-games beyond the single "Play" action.
- No notifications when a need is low while the tab is closed.

If any of these come back as ideas, write them up as `99b-…` etc. — don't bolt onto this plan.
