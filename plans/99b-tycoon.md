# 99b — Μποστάνι (orchard tycoon, paired with the pet)

A persistent, browser-only tycoon game that grows out of the pet's existing world. Σιγμάκι already lives in a soft-pastel scene with apples; this plan turns the apples into an economy. The game is **deep, idle-friendly, and meant to last weeks of casual play**, not a five-minute distraction.

This file is the design contract. Implementation lives in `lib/orchard/` and `components/orchard/`. It is intentionally written in the same register as `99-tamagotchi.md` (the pet plan) — it must compose with the pet, not replace or compete with it.

---

## TL;DR for the impatient reader

> You inherit an empty orchard. Plant trees, harvest apples, sell them at the market for coins, buy more trees and small buildings (juicer, cidery, jam factory, bakery), unlock new tree species and permanent buffs through **Research**, and eventually **Compost** the whole farm to restart with permanent multipliers (prestige). The pet is the manager — its mood and energy directly modulate output, and feeding/petting/sleeping it is now mechanically meaningful. Reading sections of the actual study site drops one-shot bonuses into the orchard, gently linking the toy to the work.

---

## Goals

- **Addictive in the good sense:** numbers go up *constantly*; there is always something within reach to buy, finish, or unlock; long sessions are rewarded but a 30-second daily check-in keeps progress healthy.
- **Deep enough to last:** at minimum **40+ hours of meaningful progression** before the first prestige (≈ 2–3 weeks of casual play). Multiple prestige layers extend it indefinitely.
- **Coherent with the pet:** the pet is not a separate widget — it is the orchard's manager. Mood, sleep, hunger, sickness all matter.
- **Coherent with the site:** studying produces small, capped bonuses. The tycoon must never feel like a reason to spam-complete sections; rewards are dampened past a daily cap.
- **Browser-only, no server:** all state is `localStorage`, idle progression is reconstructed from `lastTickAt` exactly like the pet's needs decay.
- **Polished, not breathless:** soft animations, restrained particle effects, no slot-machine flashing. We are tasteful with the dopamine.

## Non-goals (v1 — explicitly parked)

These ideas are tempting but either inflate scope, touch the server, or fight the pet plan's spirit. Track them in `99c-…` if they come back.

- No multiplayer, leaderboards, gifting, or shared orchards.
- No real money, no premium currency you can buy. Stars (premium) are earned only through achievements and rare events.
- No notifications when offline. We trust the catch-up math on next visit.
- No PvP, no neighbours, no random other-players' farms.
- No NFTs, no chain, no gimmicks. (Stating it for the record.)
- No 3D, no isometric. The orchard is rendered top-down with simple SVG/Canvas.
- No mobile push or PWA install prompts.

---

## Theme and naming

The game is called **Μποστάνι** (literally "vegetable patch", colloquial; warmer than περιβόλι). Σιγμάκι is the manager. The orchard sits on a small hill with an old wooden barn, a market stall by the road, and progressively more buildings as you unlock them.

Tone is gentle, slightly wry, in Greek throughout. No course terminology bleeds in — this is the playful side of the site, not a hidden lesson. (The teaching philosophy in CLAUDE.md applies to *educational content* only; chrome and toys keep their own voice.)

Visual style continues the pet's "soft Animal Crossing" look: rounded SVGs, low-saturation pastels, tasteful drop shadows, theme-aware via existing `--accent` / `--bg-soft` / `--success` tokens.

---

## Entry point and UI shell

The orchard is intentionally too rich for the 280 px pet panel. It opens as a **fullscreen modal** ("Σκηνή Μποστανιού") that takes over the viewport, with the pet panel and pet button hidden while it is open.

### Where the entry lives

Add a small **🌳 button** in the pet panel header (next to the pencil/rename icon). Visible only after hatch. `aria-label="Άνοιξε το μποστάνι"`. Tapping it:

1. Closes the pet panel.
2. Opens `<OrchardModal />` — a `role="dialog" aria-modal="true"` overlay.
3. Resolves any pending idle production *before* first paint (so the user sees their accrued numbers immediately).
4. Esc / a top-left ✕ / a hardware back gesture all close it.

The collapsed pet button shows a small **🍎 badge** when the orchard has unclaimed harvest waiting (idle apples > 25% of barn capacity, or any building has finished a long-running recipe). This is the tycoon equivalent of the pet's "needs attention" red dot — same UI vocabulary, different reason.

### Modal layout (desktop ≥ 900 px wide)

```
┌──────────────────────────────────────────────────────────────────┐
│  ✕  🌳 Μποστάνι                              🍎 1 234   🪙 87    │
├──────────────────┬─────────────────────────────────────┬─────────┤
│                  │                                     │         │
│   Sidebar tabs   │            Scene canvas             │  Detail │
│                  │  (orchard / buildings / market)     │  panel  │
│  • Δέντρα        │                                     │  for    │
│  • Κτίρια        │                                     │  the    │
│  • Αγορά         │                                     │ select. │
│  • Έρευνα        │                                     │  card   │
│  • Επιτεύγματα   │                                     │         │
│  • Στόχοι ημέρας │                                     │         │
│  • Compost ✨    │                                     │         │
│                  ├─────────────────────────────────────┤         │
│                  │  Pet status strip (mood × multiplier)        │
└──────────────────┴─────────────────────────────────────┴─────────┘
```

### Mobile layout (< 900 px)

A single column. Tabs become a horizontally scrollable bar at the top. Detail panel slides in from the right as a sheet when a card is selected. Critical: must look fine at 360×640.

### Always-visible HUD

Top bar persistent across tabs:

- 🍎 apples · 🪙 coins · 🌱 seeds (only when > 0) · ⭐ stars (only when > 0)
- Pet mood chip with current production multiplier ("😊 ×1.20", click → opens pet panel inline as a popover)
- A subtle pulsing indicator if a research project / cidery batch is finishing within 60 s.

---

## State model

`localStorage` key: `spwa:orchard`. Versioned independently from `spwa:pet`. The two stores cross-subscribe but keep separate persistence so a pet reset does not nuke an orchard and vice versa.

```ts
type OrchardState = {
  version: 1
  startedAt: number              // ms epoch — when first opened
  lastTickAt: number             // last reconciliation
  resources: {
    apples: number               // current barn stock (capped by barn capacity)
    coins: number
    seeds: number                // prestige currency
    stars: number                // achievement currency
    research: number             // research points; spent on research tree
  }
  barnCapacity: number           // upgradeable; default 50
  plots: Plot[]                  // 12 starting; up to 60 at endgame
  buildings: Building[]
  market: MarketState            // current price multipliers, refresh time
  research: { unlocked: Set<string>; inProgress: ResearchJob | null }
  achievements: Set<string>      // ids
  compostRun: number             // count of prestige resets
  permanentBuffs: PermBuff[]     // earned via prestige + achievements
  dailyQuests: DailyQuestState
  events: ActiveEvent[]          // running random events
  studyBoosts: { date: string; usedToday: number } // daily cap tracker
  petTie: {
    lastMoodMult: number         // last computed mult from pet
    sickPenaltyAcked: boolean    // did user dismiss the "your pet is sick" banner
  }
  flags: {
    seenIntro: boolean
    seenFirstHarvest: boolean
    seenFirstSale: boolean
    // ... onboarding gates
  }
}

type Plot = {
  id: string
  position: { x: number; y: number }   // grid coords, used for adjacency bonuses
  tree: Tree | null                    // null = empty
  watered: boolean                     // single-bit flag; click-action
  fertilizerUntil: number              // ms epoch
  decoration: DecorationKind | null    // scarecrow, fence, beehive, etc.
}

type Tree = {
  speciesId: string                    // 'classic' | 'golden' | 'crystal' | ...
  plantedAt: number
  growthStage: 0 | 1 | 2 | 3 | 4       // sapling → small → mature → bountiful → ancient
  level: number                        // upgrade level (0..N)
  lastHarvestAt: number                // for active-tap bonus
  storedApples: number                 // unharvested fruit on the tree (capped)
}

type Building = {
  id: string
  kind: BuildingKind                   // juicer | cidery | jam | bakery | market_stall | ...
  level: number                        // upgrade level
  workers: number                      // staffing tier (gated by research)
  inputBuffer: Record<string, number>
  outputBuffer: Record<string, number>
  recipe: RecipeId | null              // for buildings with multiple recipes
  startedAt: number | null             // for in-progress batches
}
```

### Loading / migration

- Missing record → call `freshOrchard()` factory. Initial state: 12 empty plots in a 4×3 grid, 50-apple barn, no buildings, 0 of every currency, intro modal flag = false.
- Version mismatch → keep currencies and `compostRun`, reset everything else (graceful, communicates "the orchard was renovated"). This is a rare path; we'd only bump version on a breaking schema change.
- On every modal open and every 5 s while open: run `reconcile(now)` (closed-form catch-up; see below).

---

## Currencies

| Symbol | Name | Volume | Sources | Sinks |
|---|---|---|---|---|
| 🍎 | apples (Μήλα) | very high | trees, events | feed buildings, sell, decorations |
| 🪙 | coins (Κέρματα) | medium | sell apples / juice / cider / jam / pies | buy plots, buildings, upgrades, research jumpstarts |
| 🌱 | seeds (Σπόροι) | scarce | compost prestige, rare events | permanent multiplier slots, premium tree species |
| ⭐ | stars (Αστέρια) | very scarce | achievements, study completions, golden cookie equivalents | one-time wishes (instant building, permanent +5%, etc.) |
| 🧪 | research (Έρευνα) | trickle | trees passively over time, "Σπόρος γνώσης" study drops | unlock research tree nodes |

**Conversions** are explicit user actions, never automatic. The market is the only place to convert apples → coins, and its rate fluctuates (see *Market dynamics*).

The five-currency setup is deliberate. Cookie Clicker has one resource and is a masterpiece, but our pet/study integration needs different "shapes" of reward to dispense — coins for sustained progress, stars for *moments*, seeds for prestige permanence, research for thinking-ahead, apples for the loop itself.

---

## The core loop: trees and harvest

This is the ground floor of the game. It must be tactile.

### Plots and the orchard grid

- Start with **12 plots** in a 4×3 grid. Empty plots show a soft dashed outline.
- Plots unlock in waves: 12 → 24 → 36 → 48 → 60. Each new wave costs progressively more coins; the final wave gates behind compost-run ≥ 2.
- Adjacency matters: a beehive decoration boosts pollination of the 4-neighbour plots; a scarecrow blocks "Σαλιάρης" squirrel events on its plot only.

### Tree species (≥ 8 in v1, more via research)

| Species | Unlock | Yield | Interval | Quirk |
|---|---|---|---|---|
| Classic (κλασικό) | start | 1 | 8 s | Reliable. Cheap. |
| Sweet (γλυκό) | 100 sold | 2 | 12 s | Higher absolute yield. |
| Golden (χρυσό) | research | 1 + 0.05 × stars | 14 s | Yield scales with current stars (so achievement-rich players see a different game). |
| Crystal (κρυστάλλινο) | research + 1 compost | 0 apples; emits 0.1 🧪/s | 6 s | Doesn't make apples — generates research passively. |
| Ancient (αρχαίο) | 2 compost | 5 | 60 s | Slow but burst-y. Visual: gnarled trunk, glowing fruit. |
| Bonsai (μπονσάι) | star wish | 1 | 4 s | Constant trickle, ignores mood multipliers (a stable floor). |
| Sequoia (κολοσσιαίο) | 3 compost | 30 | 5 min | Earthquake feel when it drops; takes one full plot but rewards long sessions. |
| Knowledge (Σπόρος γνώσης) | study integration | 3 | 20 s | Yield grows by 0.1 per unique completed section, capped at +5. Visible link to study activity. |
| Compost-bloom | seed shop | 4 | 16 s | Buyable with 🌱; modest price/yield ratio but *immune to squirrel/storm events*. |
| Lab tree (κερασίτικο πείραμα) | research + cidery upgrade | varies | varies | Outputs a random fruit every cycle (see *Recipes* for what can be done with non-apple fruit). |

Eight live in v1; the others get added in v1.1/research expansions. Listed here so the data shape is right from day one.

### Tree growth stages

A planted tree grows through 5 stages over real-world time:

| Stage | Dwell | Visual | Yield modifier |
|---|---|---|---|
| 0 sapling | 30 s | small green sprout | 0% (no harvest yet) |
| 1 small | 5 min | knee-high tree | 50% |
| 2 mature | 30 min | full tree | 100% |
| 3 bountiful | 4 h continuous care | extra-leafy, glowing fruit | 130% |
| 4 ancient | 24 h continuous care + 1 fertilizer applied at stage 3 | gnarled, with fairy-light effect | 170% |

"Continuous care" = no need at 0 in the pet, no full-barn losses, and tree was watered at least once per 12 h period during the dwell.

### Yield mechanics

- Each tree at stage ≥ 1 accumulates apples on the tree itself (`storedApples`), capped at `5 + level × 2`.
- When the cap is hit, the tree pauses production until harvested — visible as fruit visibly dangling, tooltip says *"Γέμισε. Μάζεψέ το."*
- Tap-to-harvest: clicking a tree empties its storage *and* triggers a small "shake bonus" (+10% on this harvest). 5-second cooldown per tree.
- "Μάζεμα" big button: harvests every full tree at once. Free, no cooldown. Required for late-game with 60 plots.
- Apples flow into the **Barn**. If barn is full, surplus is *lost* (small "wasted apples" floater appears, encouraging the player to upgrade the barn or sell faster).

### Tree upgrades

Each tree has a per-tree upgrade level visible on its detail card. Costs scale `100 × 1.6^level` apples. Each level: +0.5 to base yield, −5% to interval (capped at −60%). Caps at level 12. After level 12, the tree displays "ώριμο" and can be upgraded only by global research.

---

## Idle production and catch-up math

The hardest part of a tycoon to get right. Players will close the tab for hours.

### Closed-form per-tree production

For each tree, idle production over a window `[t0, t1]` is computed analytically — *not* simulated frame by frame:

```
produced = floor( (t1 - t0) / interval ) × yield × multipliers(t0..t1)
```

Where `multipliers` is the time-averaged product of: pet mood multiplier, fertilizer multiplier (decays at fertilizer expiry), event multiplier (storm, harvest fever). When a multiplier flips during the window we split the integral at the flip. This is unfortunately not a one-liner but it's a small, pure function and worth the rigor — players will absolutely notice if "I left this on a 1.5× event last night and got nothing extra."

### Offline cap

Idle accumulation is capped per session:

- Up to 8 hours: full rate.
- 8–24 hours: 50% rate.
- > 24 hours: stops accruing.

This is gentle gating: someone who goes on holiday doesn't return to a maxed-out barn that erases two weeks of game arc, but a normal "I closed it overnight" trip is rewarded fully. Communicated as a small toast on first reopen: *"Καλώς όρισες. Το μποστάνι έβγαλε X μήλα όσο έλειπες."* Plus a dim line: *"(Μετά τις 8 ώρες το ρυθμό μειώθηκε.)"*

### Barn overflow

If barn fills mid-window, production after that point is zero for that window (apples-on-tree cap kicks in regardless). The catch-up math accounts for this exactly: it computes a per-tree fill time and stops the tree there. This avoids the classic tycoon gotcha where you log in to a full barn but no idea when it filled.

### Tick frequency while open

`reconcile(now)` is called:

- On modal mount.
- Every 5 s while modal is open (a single `setInterval`).
- On every action that *spends* a resource (so you never undercount your apples).
- On `visibilitychange` → visible.

The cost is one pass through `plots` and `buildings`; trivially cheap even at 60 plots.

---

## Buildings (converters)

Buildings turn apples into higher-value goods. Each has a footprint on the scene canvas and unlocks at a coin threshold or via research.

| Building | Recipe | Output | Time | Notes |
|---|---|---|---|---|
| Πάγκος αγοράς (market stall) | sell 10 🍎 | +1 🪙 (× market price) | instant | Default. The only way to liquidate apples. |
| Στυφτήρι (juicer) | 5 🍎 → 1 🧃 (juice) | sells for 0.8 🪙 | 30 s | Better margin than raw apples at high market prices. |
| Κάβα (cidery) | 12 🍎 → 1 🍷 | sells for 2.5 🪙 | 8 min | Long batches; rewards planning. |
| Μαρμελάδα (jam factory) | 20 🍎 → 1 🍯 | sells for 4 🪙 | 12 min | + grants 2 🧪 research per batch. |
| Φούρνος (bakery) | 3 🍯 + 8 🍎 → 1 🥧 (apple pie) | sells for 18 🪙 | 20 min | Compound recipe; encourages running multiple buildings. |
| Αποθήκη γνώσης (knowledge silo) | passive | +0.5 🧪/min | n/a | Built late-game, lets research keep flowing without dedicated trees. |
| Ξωμάχος (workshop) | 50 🪙 + 1 🍯 → 1 decoration | 5 min | n/a | Crafts scarecrows, beehives, fences. |
| Παρατηρητήριο (observatory) | passive | +1% star drop chance per level | n/a | Buyable with 🌱 only. |

Each building has 5 upgrade levels, each cutting recipe time by 10% and increasing output by 1 unit. Workers (staffing) is a separate axis unlocked via research: hire 1 worker → −15% time; hire 2 → −25%; hire 3 → −33%. Wages: a small per-hour coin drain that scales with worker count, so staffing is a real choice.

### Recipe queue

Each building can queue up to 5 batches. The UI shows each batch as a stacked bar with time-remaining. Scroll-wheel changes batch count; long-press auto-queues to barn capacity. Batches resolve in catch-up just like trees.

---

## Market dynamics

Apples sell at a price that *fluctuates* over the day. This is one of the small "I'm thinking strategically" hooks that turns the game from idle to interesting.

- Three goods are tracked: 🍎 apples, 🧃 juice, 🍷 cider, 🍯 jam, 🥧 pies.
- Each has a price multiplier in `[0.5, 1.5]` × base price.
- The multiplier follows a **smoothed pseudo-random walk**: every 30 minutes (real wall time, ticked when modal is open OR catch-up reconciled) we sample a new target and lerp toward it over the next 30 minutes. Seed is derived deterministically from `startedAt + drift` so prices look continuous on reopen.
- A **forecast strip** shows a sparkline of the last 12 hours of each price. No future prediction — the strip is for vibes only.
- An **Auto-sell rule** lets the player set: "Sell apples whenever stock > X and price > Y". Power-user feature, off by default. Toggleable per good.

This single mechanic adds a real-world-time strategic decision to the loop without bolting on a complex simulation: *should I sell now or wait?* Newcomers ignore it and still progress; engaged players profit ~20–30% more by timing.

---

## Research tree (Έρευνα)

The long-term progression layer. Players accumulate 🧪 research from research-producing trees and the knowledge silo, and spend it to unlock permanent upgrades.

### Structure

A 6-tier tree with branches. Each node costs research, possibly some other resource, and time-to-research (not instant — a single "in-progress" job runs at a time). Sample nodes by tier:

```
Tier 1 — Φύτεμα (planting)
  • Πιο πλούσιο χώμα: -10% growth time on all trees
  • Καλύτερο πότισμα: watering effect 2× duration
  • Μικρός χάρτης: unlocks plot wave 2 (24 plots)

Tier 2 — Συγκομιδή (harvest)
  • Βασικό συνεργείο: hire 1 worker per building
  • Αυτόματη συλλογή: trees auto-empty into barn (no manual click required)
  • Καλύτερα κιβώτια: barn capacity ×1.5

Tier 3 — Παραγωγή (production)
  • Οινοτεχνία: unlocks cidery
  • Μαρμελαδοβιομηχανία: unlocks jam factory
  • Ζύμωση: jam factory yields +1 jar

Tier 4 — Είδη δέντρων (species)
  • Χρυσό δέντρο: unlocks Golden tree
  • Κρυστάλλινο δέντρο: unlocks Crystal tree (research producer)
  • Καρπός εργαστηρίου: unlocks Lab tree

Tier 5 — Οικονομία (economy)
  • Καλύτερη φήμη: market price floor +0.1
  • Βαθμός συμβολαίου: market price ceiling +0.1
  • Συνέταιρος: 5% chance of double-output on building batches

Tier 6 — Compost
  • Αρχαία γνώση: ancient trees unlock
  • Αιώνιο μπόνους: +1 permanent prestige slot (raises permanent-buff cap)
  • Κολοσσός: unlocks Sequoia tree species
```

≥ 24 nodes total in v1, with three more tiers' worth lined up but locked behind future content packs.

### Research-in-progress

Only one research job runs at a time. Time scales with tier (5 min, 10 min, 20 min, 1 h, 4 h, 12 h). Star wishes can instant-finish a research job (≤ 2× per compost run).

---

## Compost (prestige)

The defining loop of any good idle game. Compost = burn it all down, get permanent multipliers, restart with the long view.

### Trigger

A subtle "Compost ✨" tab appears once total lifetime coins ≥ 100 000. Before that, the tab is hidden — we don't tease prestige until the player has felt the early game.

### What you get

When you compost:

- Your orchard resets: all plots empty, all buildings sold (you keep building blueprints, so they cost less to rebuild — see below), barn returns to default capacity, apples/coins/research → 0.
- You gain 🌱 seeds: `floor(sqrt(lifetime_coins_this_run / 1000))`. So 100 k coins → 10 seeds, 1 M coins → 31 seeds, 100 M coins → 316 seeds. Cookie-Clicker style sublinear so "one more run" is always worse than "wait a bit longer."
- Stars and achievements are kept.
- Permanent buffs unlocked at thresholds: 1st compost → +10% to all yields permanently; 5th → +25%; 10th → +50%.
- "Blueprints kept" — every building you owned at level ≥ 3 returns at 50% cost on rebuild. Encourages "build everything you can" runs.
- Each species you owned at stage ≥ 4 (ancient) is recorded to a **codex**; codex completion unlocks a final cosmetic at compost run 10 (a glowing pet halo).

### Spending seeds

Seeds are spent in a separate "Seed Shop" panel, **outside** the main research tree:

- 1 🌱 → +5% to a single resource type permanently (stackable, soft-cap at 25%).
- 5 🌱 → +1 permanent-buff slot.
- 10 🌱 → unlock Compost-bloom tree.
- 25 🌱 → unlock the observatory.
- 100 🌱 → unlock Bonsai tree (constant trickle, ignores mood penalties).
- 500 🌱 → +1 to the offline cap (8h → 9h, then 10h, …, max 16h).

Power curve: the first 100 seeds dramatically change the game; subsequent seeds give incremental edge. By design — we want compost to be *desired*, not *required*.

---

## Pet integration (the hook that makes this not generic)

This is what makes the game feel like *our* game and not a re-skin. The pet is mechanically present at every level.

### Mood multiplier

The orchard's global production multiplier is read from the pet store on every reconcile:

| Mood | Multiplier |
|---|---|
| happy 😊 | ×1.20 |
| neutral 🙂 | ×1.00 |
| sad 😔 | ×0.80 |
| sick 🤒 | ×0.50 + a banner "Το {name} είναι άρρωστο. Πάτα Γιατρειά για επαναφορά." |
| asleep 💤 | ×0.50 *but growth time −30%* (so sleeping trades short-term harvest for long-term progress; meaningful tradeoff during a long away-from-keyboard session) |
| egg / not hatched | game is locked behind hatching the egg first |

This is the core lever that ties pet care to game success without making the pet a chore. A casual player who keeps the pet fed at 60+ already gets the full ×1.0 floor; perfectionists chase ×1.20.

### Petting boost

Petting (clicking the pet sprite in the panel, or in the orchard via a small pet-shaped icon in the corner) gives a **5-minute "Καλή διάθεση" buff** of ×1.10 stacked on top of mood. 60-second cooldown — encourages 1 click every 5 minutes if you're around, but doesn't punish forgetting.

### Sick blocks special events

If the pet is sick, random events that would normally trigger (good and bad) are paused. The first thing back online when you heal is the event roller. A small UX touch: it stops the pet feeling like a side-thing.

### Manager actions

Inside the orchard modal, a small footer bar shows:
- Pet sprite (live-updating mood)
- Quick actions: 🍎 Τάισε · 💤 Ύπνος / Ξύπνα · ✨ Γιατρειά (when sick) · ❤ Χάιδεψε

These call into the existing pet store dispatcher unchanged. Cooldowns are shared. Ten quick keypresses to look after the pet from inside the tycoon.

### Pet evolution interplay

Adult pets unlock 2 extra plots (because they "supervise more"). Going from baby to adult during a run plays a small celebratory animation overlaying the orchard: *"Το {name} μεγάλωσε. Δύο νέα οικόπεδα ξεκλείδωσαν."*

---

## Study integration (the link to the actual site)

The whole reason this is a study site. The link must be present but **gentle and capped** — we never want a student deciding to skim a section to "farm" the orchard.

### What study does

- **First completion of a section in a real day:** drops a 🪙 coin reward (small, ~50 × current run multiplier) and **+1 fertilizer pellet** to the player's inventory. Fertilizer can be applied to any plot for a 1-hour ×2 yield buff on that plot.
- **First exercise solved in a real day:** drops 1 🧪 research point.
- **Hitting a daily streak (7 days, 30 days, 100 days of study activity):** awards 1 ⭐ each. Tied to existing app-store streak data if available, otherwise computed from `completed` set growth.
- **Knowledge tree:** the **Σπόρος γνώσης** tree (see species table) literally yields more per *unique* section completed across the whole site, capped at +5. So a student who has completed 50 sections and a student who has completed 5 see different yields, but the curve flattens — the relationship is real, not linear-grindable.

### Daily cap

`studyBoosts.usedToday` resets at local midnight (browser TZ). Cap: **3 study drops per real day**. Anything beyond is silently no-op (no error, no scolding — completing a 4th section just doesn't drop anything).

### Why this is gentle

The study side gives the orchard ~5–10% of its income on a heavy-study day. It is meaningful (you notice it), but not so much that the game economy *expects* it. A student doing zero study still progresses normally; a student doing heavy study sees a small consistent edge.

---

## Apple Catcher integration

The existing minigame is currently isolated — fun but disconnected. We hook it into the orchard:

- Every apple caught in Apple Catcher = **0.5 🍎** added to the orchard barn (rounded down at run-end).
- Golden apples in Catcher = +1.5 🍎.
- A run's score reward is paid in **stars** instead of pet happiness when the orchard exists: every 10 score = 1 ⭐ (capped at 5 ⭐ per run, daily cap 10 ⭐ from this source).
- The current "−15 energy" stays. The pet store changes are minimal: end-of-game reward routes to orchard if `OrchardState` exists, else to pet happiness as today.

This keeps Apple Catcher relevant in late game (a fast way to get stars) and gives a reason to play it once you have a 60-plot orchard.

---

## Random events (the "spice")

Every 20 ± 10 minutes (real-time, ticked even if modal is closed but only resolved on next open), a random event may fire. Probability is gated by `compostRun` so early players see the gentle ones, late players see the spicy ones.

### Event catalogue (v1)

| Event | Trigger | Effect | Mitigation |
|---|---|---|---|
| 🐿️ Σαλιάρης (squirrel) | any | steals 5–10 apples from a random un-scarecrow plot | scarecrow on that plot blocks |
| 🌧️ Καλοκαιρινή βροχή | any | +20% growth speed, 30 min | none needed; just enjoy |
| ⛈️ Καταιγίδα | compost ≥ 1 | -50% production, 30 min, 5% chance per plot to lose stage 4 → 3 | build the observatory to halve frequency |
| 🦋 Πεταλούδες | beehive present | +30% yield on adjacent plots, 1 h | beehive required to even fire |
| 👨‍🌾 Πλανόδιος (wandering merchant) | any | offers 1 unique decoration / rare seed for coins or apples | ignore = it leaves; refuse persistently → future merchants offer worse deals (light memory) |
| 🌟 Διάττων αστέρας | rare, 1× per real day max | one free ⭐ on click (pop-up, 30 s window) | clearly attention-grabbing — Cookie Clicker's "golden cookie" equivalent |
| 🎉 Γιορτή της συγκομιδής | total apples produced this run reaches 10 k / 100 k / 1 M | 1 h ×3 production | none needed |
| 🐝 Αδέσποτο μελίσσι | beehive built | wild bee swarm offers to migrate: pay 200 🪙 for a 2nd beehive that produces honey directly | refuse = no penalty |
| 🏚️ Ραγάδα στο φούρνο | bakery in operation | bakery output −50% for 1 h *or* spend 100 🪙 to fix immediately | ignore = wait it out |
| 🦔 Τυχερός σκαντζόχοιρος | any | drops 1 🌱 seed when clicked within 60 s | rare, festive |

10 events at launch; framework supports adding more without code changes (event registry).

### Visual style

Events show as a soft-glow card in the top-right of the scene, sliding in. Click it to open a modal with art and a ✓ accept / ✗ ignore (where applicable). Auto-dismiss after the event window closes.

---

## Daily quests

Three quests refresh at local midnight. Each has a small star reward.

Examples:
- *"Πούλα 50 μήλα"* → 1 ⭐
- *"Φύτεψε 3 νέα δέντρα"* → 1 ⭐
- *"Μάζεψε ένα χρυσό μήλο"* → 1 ⭐
- *"Φρόντισε το {name} 3 φορές"* → 1 ⭐ (links to pet)
- *"Παίξε ένα γύρο Apple Catcher"* → 1 ⭐
- *"Διάβασε μια ενότητα στο site"* → 1 ⭐ + 1 fertilizer

Quests are sampled from a pool of ~25; weighting avoids back-to-back identical quests. All three completed = bonus 2 ⭐ (so a perfect day = 5 ⭐).

---

## Achievements (Επιτεύγματα)

A separate tab. ≥ 50 achievements at launch, organized by group. Each gives 1 ⭐ on first earn, plus a small permanent buff for "milestone" ones.

### Groups

- **Καλλιεργητής (cultivator):** plant the first / 10th / 100th tree; own one of each species; have a maxed tree of every species.
- **Συγκομιδή (harvest):** harvest 100 / 10 k / 1 M lifetime apples.
- **Μάστερ της αγοράς (market):** sell at price ≥ 1.4× / 1.5× / time the peak in 5 consecutive sales.
- **Παραγωγός (producer):** run every building at level ≥ 3 simultaneously; ship 1000 jam jars.
- **Φιλόπονος (devoted):** care for the pet 7 / 30 / 100 days in a row.
- **Σπουδαστής (student):** apply 10 / 50 / 200 study fertilizers.
- **Στρατηγός του compost (prestige):** compost 1× / 5× / 10× / 25×.
- **Καλλιτέχνης (decorator):** craft each decoration; full row of beehives; full row of scarecrows.
- **Κρυφά (hidden, ≥ 8):** grayed-out titles like "???"; reveal on earning. Examples: pet a sick pet 10 times in a row; reach 0 apples and 0 coins in a single run; let a stage-4 tree fall to stage 0; have all currencies < 5 simultaneously.

The 8 "hidden" ones are the tasteful joke layer — they reward weird player behaviour and are great word-of-mouth.

### Permanent buffs from milestone achievements

A handful of achievements grant a small permanent buff (e.g. "Compost 5×" → +1 permanent-buff slot; "Pet ageing 30 days streak" → pet-mood floor lifts from ×0.8 to ×0.9). These are how the achievement tab interacts with mechanics, not just cosmetic.

---

## Onboarding and first run

The first time a player opens Μποστάνι, a 4-step inline tutorial runs. Skippable on step 1 with "Άσε με να εξερευνήσω" (skip). No long popups.

1. *"Πάτα ένα κενό οικόπεδο για να φυτέψεις δέντρο."* → highlights a plot.
2. *"Περίμενε λίγο. Ή πάτα το δέντρο για να το ταρακουνήσεις."* → after first apple drops.
3. *"Πάνε στο πάγκο και πούλα μερικά μήλα."* → highlights market tab.
4. *"Όλα κρατιούνται μόνο στον browser σου. Καλή σοδειά."* → done.

Each step writes to `flags.seenIntro_*`; replays only on hard reset.

A single contextual tip surfaces when the player first hits a barn-full state ("Η αποθήκη γέμισε. Πούλα ή χτίσε μεγαλύτερη."), one when they have 1000+ idle coins ("Δοκίμασε ένα στυφτήρι"), and one when compost first becomes available. We want to remove silent dead-ends without nagging.

---

## Visual scene

The orchard scene canvas is **SVG-first**, with a thin Canvas overlay for fruit-falling particles when many trees harvest at once.

- Top-down view, isometric-ish but flat. Soft pastel hill, dirt road across the bottom for the market stall, barn at the upper-left, buildings populate the right side as built.
- Tree sprites are SVG, 5 frames each (one per growth stage), plus shake animations on tap-harvest.
- Fruit popping out at harvest is short Canvas particles (gravity, 600 ms life). No particle library — same hand-rolled style as the existing pet `Particles` component.
- Day/night cycle: subtle background tint shifts over a 20-minute real-time cycle. Decorative only; doesn't affect mechanics.
- The pet is rendered as a small sprite in the corner of the scene, doing idle bob; tap it for the petting boost.

Reduced motion: idle bob and day/night tint freeze; particles still fire (they're feedback for actions). Matches existing `*` reduced-motion override.

---

## Animations and feedback

- **Tap-to-harvest:** tree shakes 200 ms, fruit pops out as particles, "+N" pop label, soft "thock" sound (only if pet sound is on — reuses the existing audio gate).
- **Sale:** coin burst at the market stall, the coin counter ticker rolls smoothly to the new value (800 ms ease-out).
- **Building completes a batch:** small steam puff, output count chip pulses once.
- **Achievement unlocked:** a banner slides in from the top, 4 s, with the achievement icon and a single Greek line. Stacks if multiple fire at once.
- **Compost:** a dramatic but short sequence — orchard dims, all trees fade to silhouettes, a soft compost pile materializes, seeds tally pops up, then fade-in to the empty new orchard. ≤ 5 s total. Skippable with click.

All sounds are short (< 400 ms), low-volume, optional (re-uses existing sound toggle in `lib/pet/audio.ts`). No music in v1 (decision: ambient music tempts to overdo it).

---

## Balance philosophy and a sample early-game curve

The cardinal rule: **the next purchasable thing is always within 30–60 s of activity OR < 30 min of idle**. If the gap exceeds that, balance is wrong.

A worked early-game minute-by-minute (assuming default pet, ×1.0 multiplier):

| Time | State |
|---|---|
| 0:00 | Open modal. 12 plots, 0 trees, 0 apples, 0 coins. Tutorial step 1. |
| 0:30 | First sapling planted (cost 10 apples → free first sapling on tutorial). Tutorial step 2 hint shows. |
| 0:30→5:30 | Sapling grows to small. Player explores tabs, reads tooltips. Idle catch-up reconciles when they tab back. |
| 5:30 | First fruit drops. Player taps to harvest. +1 apple. |
| 6:00 | Manual market sale. +0.1 coin. *Visible feedback that this is going to be slow without more trees.* |
| 6:30 | Achievement: "Πρώτη συγκομιδή" → 1 ⭐. Banner. |
| 8:00 | Player has ~5 apples. Plants tree #2 (10 apples cost = wait a bit, sell some, plant). |
| 15:00 | 4 trees, ~30 apples/min. Coins start adding up. Build first juicer (cost 200 coins). |
| 30:00 | First juicer batch done. Player notices the better margin. Plants more trees, queues juicer. |
| 1:00:00 | 8 trees, juicer running, market stall set to auto-sell at 1.0+. Research tab unlocked at 100 lifetime coins. First node researched (Πιο πλούσιο χώμα). |
| 4:00:00 | Cidery unlocked, first cidery batch running. Stage 3 tree appearing. |
| 24:00:00 | All v1 buildings up at level ≥ 1. ~200 k coins. Compost tab visible. 12 ⭐, ~10 achievements. |
| Day 3 | First compost. 10 seeds. Player feels the rush of permanent +10%. |
| Week 2 | ~3rd compost. Crystal trees online. Research producing autonomously. |
| Week 4+ | Hunting hidden achievements, codex completion, late-tree specializations. |

Cost growth follows `cost = base × 1.15^owned` for repeatable items (Cookie Clicker exponent — proven good). One-shots scale `base × 2^tier`. The exact base values are tuned empirically; this plan locks the *shape*, not the magic numbers.

### A note on number sizes

We cap displayed numbers at "Tier 1" suffixes (K, M, B) until prestige run 5+, at which point we switch to scientific notation with two decimals. No infinite-scale font shrinking. Display logic lives in one helper.

---

## Accessibility

- All actions reachable by keyboard: Tab through plots, Enter to plant/harvest, arrow keys to navigate the grid.
- Live regions announce major events ("Συγκομίστηκαν 12 μήλα", "Μπήκε σε ισχύ καταιγίδα").
- Color is never the only signal: progress chips have icons; mood is iconified, not just colored.
- All animations < 1.5 s; reduced-motion users get static frames + opacity transitions only.
- High-contrast theme mode passes WCAG AA on every screen.
- Tooltips work on touch (long-press, with a small ⓘ button as fallback for assistive tech).

---

## File structure

```
lib/orchard/
  types.ts              – OrchardState, Plot, Tree, Building, Recipe types
  defaults.ts           – freshOrchard(), constants (base costs, growth times, multipliers)
  reconcile.ts          – pure reconcile(state, now) → state' (the catch-up math)
  trees.ts              – species registry, growth-stage tables, yield helpers
  buildings.ts          – building registry, recipes, batch math
  market.ts             – price walk, price helpers, auto-sell rule resolver
  research.ts           – research tree data, in-progress job resolver
  events.ts             – random-event registry, scheduler, resolver
  achievements.ts       – achievement registry, on-state-change checker
  quests.ts             – daily-quest pool, sampler, completion checker
  prestige.ts           – compost math (seeds = floor(sqrt(coins / 1000))), permanent buffs
  store.ts              – zustand store: hydrate, reconcile, dispatch, subscribe to pet/app stores
  formulas.ts           – tiny helpers: formatNumber, costAt, time-averaged multiplier integration

components/orchard/
  OrchardModal.tsx      – fullscreen dialog; mounts on entry from PetPanel
  HUD.tsx               – top resource strip + pet-mood chip + close button
  Sidebar.tsx           – tabs: Δέντρα · Κτίρια · Αγορά · Έρευνα · Επιτεύγματα · Στόχοι · Compost
  scene/
    Scene.tsx           – the central canvas (SVG + particle layer)
    PlotCard.tsx        – per-plot interactive sprite
    TreeSprite.tsx      – 5-stage tree visuals
    BuildingSprite.tsx  – per-building sprite + queue indicator
    Particles.tsx       – fruit-fall + coin-burst particle helpers
    DayNightTint.tsx    – background tint slow loop
  panels/
    TreesPanel.tsx      – list of plots, plant/upgrade UI
    BuildingsPanel.tsx  – building list, recipe chooser, queue UI
    MarketPanel.tsx     – sparklines + sell controls + auto-sell rules
    ResearchPanel.tsx   – tree-shaped node graph + active job
    AchievementsPanel.tsx
    QuestsPanel.tsx
    CompostPanel.tsx    – the prestige flow + seed shop
    SeedShop.tsx        – nested under CompostPanel
  ui/
    NumberRoll.tsx      – animated odometer for resource counters
    EventCard.tsx       – top-right slide-in for random events
    Tooltip.tsx         – touch-friendly tooltip primitive (or reuse existing)
    Banner.tsx          – top achievement banner
  PetTie.tsx            – the pet sprite + quick-actions footer inside the modal
```

`app/globals.css` gets a new `/* Orchard */` block with these keyframes (orchard-specific):

- `orchard-modal-in` — fade + scale-up enter (240 ms).
- `orchard-tree-shake` — tap harvest feedback (200 ms).
- `orchard-coin-pop` — sale feedback (500 ms).
- `orchard-banner-in` — achievement banner slide (320 ms).
- `orchard-compost` — full-screen dimming sequence (variable, capped 5 s).
- `orchard-day-night` — extremely slow background tint (20 min loop, paused under reduced-motion).

`lib/storage.ts` adds: `orchard: 'spwa:orchard'` and `orchardEvents: 'spwa:orchard-events'` (separate so events can be pruned without rewriting the whole orchard blob).

`components/pet/PetPanel.tsx` adds the small 🌳 button in the header that opens `<OrchardModal />` (controlled at the layout level so the modal can outlive the panel close). The `Tamagotchi` root component or the layout becomes the mount point for the modal portal.

`components/pet/MiniGame.tsx` is patched in `endGame` to award stars/apples to the orchard if it exists, falling back to current pet-happiness reward.

---

## Implementation phases

This is a big plan. We absolutely should not implement it in one sweep. Each phase below should be a single review-able PR.

### Phase 1 — Skeleton (1–2 days)

- `lib/orchard/types.ts`, `defaults.ts`, `reconcile.ts` (pure logic, with unit tests).
- `lib/orchard/store.ts` with hydrate, reconcile, basic plant/harvest/sell.
- Storage key. Cross-store subscription for pet mood multiplier (read-only at this phase).
- `OrchardModal.tsx` shell, basic HUD, sidebar tabs (most disabled).
- TreesPanel + Scene with a tiny grid of plots, a single tree species, plant + tap-harvest.
- Market stall, manual sale only. No price fluctuation yet (flat 1.0 price).
- Modal entry point in PetPanel header.

Deliverable: you can plant a tree, watch it grow, harvest, sell. Numbers go up. Closes and reopens cleanly.

### Phase 2 — Buildings and recipes (2–3 days)

- Buildings registry. Juicer first; cidery + jam + bakery follow.
- Batch queueing UI. Worker hiring.
- BuildingsPanel + BuildingSprite.
- Reconcile updated to resolve queued batches.

### Phase 3 — Market dynamics (1 day)

- Price walk. Sparkline. Auto-sell rules.
- Per-good pricing.

### Phase 4 — Research tree (2–3 days)

- Research data. ResearchPanel as a node graph.
- In-progress job, time, completion.
- Research-producing tree species (Crystal). Knowledge silo building.

### Phase 5 — Pet integration deep cut (1 day)

- Mood multiplier feeding into reconcile correctly across time-varying windows.
- Petting buff. Sleeping tradeoff. Sick banner.
- Pet footer in modal.
- Apple Catcher hook (apples and stars).

### Phase 6 — Compost (2 days)

- Prestige math. CompostPanel + SeedShop.
- Permanent buffs system. Blueprints kept.
- The compost sequence animation.

### Phase 7 — Events, quests, achievements (2–3 days)

- Event scheduler + 10 events.
- Daily quests + 25-quest pool.
- Achievement registry + 50 achievements.
- Banner + Event card UI.

### Phase 8 — Polish (open-ended)

- Particle work, day-night tint, animation tuning.
- Onboarding tutorial passes.
- Number-roll component, tooltip touch support.
- Mobile pass. Accessibility audit. Reduced-motion pass.
- Empirical balance retune (the part the plan deliberately doesn't fix in numbers).

After Phase 8 we have a v1 we can call "done". Anything beyond is `99c-…` territory.

---

## Risks and mitigations

- **Risk: scope explosion.** *Mitigation:* Phases are firewalled; we ship Phase 1–3 to main as a usable but small game and only build forward if it's actually played. Each phase is a complete experience on its own.
- **Risk: balance is broken at launch.** *Mitigation:* numbers are not in the plan; tuning is its own pass; we can hot-fix balance via a single `defaults.ts` change without schema migration.
- **Risk: localStorage size.** *Mitigation:* JSON state at endgame is < 30 KB. Well within quota. Events log is rotated to 200 entries max.
- **Risk: cross-store cycles (pet ↔ orchard).** *Mitigation:* the orchard *reads* pet state at reconcile time; it *never writes* directly. The only orchard → pet write is via the existing pet dispatcher (PetTie footer). One direction of "change" prevents loops.
- **Risk: tycoon mechanics distract from studying.** *Mitigation:* daily caps on study-derived rewards, no orchard notifications, modal must be deliberately opened. The orchard is loud only when you're inside it.
- **Risk: "addictive" tipping into "compulsive."** *Mitigation:* no streaks-broken punishment, no FOMO timers, no daily login bonus screen. Daily quests refresh silently. The game is meant to be cozy, not slot-machine.

---

## What this is NOT, in v1 (parking lot)

- No multiplayer, no neighbour visits, no gifting.
- No real-money anything, no premium IAP.
- No PvP / leaderboards (nice for v1.5).
- No web push / desktop notifications.
- No mobile app shell. Web only.
- No 3D or isometric. Top-down SVG only.
- No voiceover or music. SFX only, behind the existing toggle.
- No "boss" battles / dungeons / combat. This is a farm sim, not a JRPG.
- No randomized seasonal content (Christmas tree, Easter event) — earmarked for v1.1.
- No global event bus / shared world state (would need a server).
- No cloud sync (would need auth + Supabase). Single-device for now.

If any of these come back as ideas, write them up as `99c-…` etc. — don't bolt onto this plan.

---

## Cross-references

- Pairs with `plans/99-tamagotchi.md` (the pet contract). Read both to understand the full toy.
- Update `plans/COMMITMENTS.md` if any forward-looking mechanic in this file ends up referencing future content. (At time of writing, none.)
- The existing `lib/pet/store.ts` exposes `mood()`, `state`, and `dispatch` — those are the entire surface this design needs from it. No pet store changes are required for Phase 1; small additions for Phase 5.
- Existing `STORAGE_KEYS` in `lib/storage.ts` gets extended; do not introduce a parallel storage helper.
- Reduced-motion override and the `--accent` / `--bg-soft` / `--success` / `--warn` / `--danger` tokens already exist and must be reused, not duplicated.
