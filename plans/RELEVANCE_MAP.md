# RELEVANCE_MAP.md — problem ↔ theory bidirectional coverage map

> **Apparatus doc — English prose. Not student-facing.**
> Sibling of `plans/MUST_LEARN_FORMULAS.md`.
> Planner owns and writes this file; builder and reviewer read it.
> Greek text in section headings and exercise titles is reproduced verbatim
> from the site content.

---

## §0. Purpose, method, and chapter status

### Purpose

This file is the project's **bidirectional problem ↔ theory coverage map**.

- **Forward (problem → theory):** for each past-exam exercise card, which theory
  page(s) and section(s) cover its core concept.  Used for two downstream deliverables:
  1. **Gap discovery** — a problem whose core concept has no clear theory home flags a
     theory-fill step needed (or an in-progress rework that blocks coverage).
  2. **Highlight-UI anchor data (future, Playwright-gated)** — when a student arrives at
     a problem via the Save-the-Semester flow, the forward record tells the highlight
     feature which section(s) to surface.  *Exact `#anchor` slugs are resolved in the
     late Playwright-gated highlight pass, NOT here — slugs drift as headings are edited.*

- **Reverse (theory → exercises):** for each theory section, which exercise cards home
  there.  Used for:
  1. **Student-facing «🔥 hot for N exercises» badge** — the exam-coverage sub-goal.
     A section that teaches a formula used in N past-exam problems gets a hotness signal.
  2. **Coverage audits** — sections with zero exercises mapped are candidates for theory
     enrichment or for a new exercise being added to the bank.

### Dovetail with `MUST_LEARN_FORMULAS.md §XB`

The per-formula past-exam counts in `§XB` ("Pass B — weighting") are **hotness at
formula granularity** — the number of distinct exercises that required a given formula.
This file is hotness at **section granularity** (a section is hot for N exercises if its
primary formula is exercised N times).  The two MUST be consistent:

> **Rule:** a theory section teaching a must-learn formula of §XB weight W should be
> hot for **at least W exercises** (it may be more if the section covers several
> formulas).  Reuse the §XB exercise lists; do NOT recount from scratch.

### Per-chapter status

| Chapter | Step | Status |
| --- | --- | --- |
| **Noise** — 5 theory pages, 8 exercises | `relmap-noise` | **DONE** — §2 below |
| AM — 7 theory pages, ~20 exercises | `relmap-am` | TODO |
| FM — 5 theory pages, ~8 exercises | `relmap-fm` | TODO |
| Foundations — 6 theory pages, 22 exercises | `relmap-foundations` | TODO |
| Randomness / PSD — 4 theory pages, inline only | `relmap-randomness` | TODO |
| Modulation bridge — 1 theory page | `relmap-modulation` | TODO |

---

## §1. Reusable conventions

These conventions apply mechanically to every chapter in §3+.  Follow them exactly so
later chapter maps can be written without redesigning the format.

### §1.1 Forward record

```
problem-id → primary theory home (page + section heading)
             [+ secondary home(s) if the solution requires supporting machinery
              taught elsewhere]
gap: no | "viz gap — <description>" | "theory gap — <what is missing>"
```

- **Primary home** — the section where the core concept is TAUGHT from first principles
  (definition, derivation, the main worked example).  "Where a student would go to learn
  how to solve this problem."
- **Secondary home(s)** — sections that teach supporting machinery the solution invokes
  (a formula, a prerequisite concept).  Keep these to genuinely necessary cross-links;
  don't list every page the student should eventually read.
- **Record section HEADING TEXT, not the rehype slug.**  Headings are the stable
  reference; slugs change silently when headings are edited.  Exact slug resolution
  happens in the late Playwright-gated highlight-UI pass.
- Format: `noise/through-filters §5 "Ιδανικό LPF + λευκός — η baseline εφαρμογή"`.

### §1.2 Reverse record

```
theory page#section → hot for N [exercise-id-1, exercise-id-2, ...]
cross-check: §XB formula weight = M; N ≥ M (explain any apparent discrepancy)
```

- **Aggregated per section** — formula-level granularity lives in §XB.
- List the exercise ids so the planner can verify against the forward table.

### §1.3 GAP criterion

A problem is a **theory gap** if its core concept has **no clear theory home** or only a
passing mention.  Do NOT fabricate a home.  Admitted gaps route to the planner as Opus
theory-fill steps.

- *Not a gap:* a problem whose concept is taught in the theory pages, even if that
  section lacks a must-learn callout or polish.  (Must-learn callout gaps belong to
  MUST_LEARN_FORMULAS.md Pass C, not here.)
- *Viz gap:* a "draw this" (σχεδιάστε) problem whose solution is currently text-only.
  Distinct from a theory gap — the concept IS taught, but the exercise card's answer
  should draw it and currently does not.  Surfaces here so a focused viz step can be
  scheduled.
- *Rework-blocker gap:* a problem whose primary theory home is mid-rework and doesn't
  yet cover the tested concept.  Until the rework ships, the home is an incomplete guide.
- *Coverage gap (soft):* a theory section with zero exercises mapped.  Not urgent when
  the section's primary formula is low-weight per §XB (e.g. weight = 0).  Flag but don't
  treat as blocking.

### §1.4 §XB dovetail cross-check

Before finalising a reverse entry: look up the primary formula in the relevant §XB table,
note its weight W, and confirm the reverse entry lists ≥ W exercises.  If fewer, re-check
the forward table.  If more, that is fine (a section may cover multiple formulas across
different §XB entries).

---

## §2. Noise chapter map

**Theory pages:** `noise/sources`, `noise/white-noise`, `noise/through-filters`,
`noise/bandpass`, `noise/snr`.

**Exercises (all reworked, all `topic:'noise'`):** `proodos26-6`, `sept25-th3-10`,
`sept25-th3-11`, `jun25-th1-9`, `jun25-th1-10`, `jan26-th1-3`, `pa25-th1-3`,
`pb25-th1-3`.

**Source:** forward homes derived from each card's `prerequisites` array and solution
cross-links (the reworked cards already cite these), then verified against the theory
pages' section headings.  §XB cross-check uses `MUST_LEARN_FORMULAS.md §2B` weights
throughout — not recomputed.

---

### §2.F Forward table

| Problem | Title | Core concept | Primary theory home | Secondary theory home(s) | Gap? |
| --- | --- | --- | --- | --- | --- |
| `proodos26-6` | Λευκός θόρυβος μέσα από ιδανικό LPF | White noise S_N = N₀/2 through ideal LPF: apply S_Y = \|H\|²S_X, integrate [-W,W] → P = N₀W | `noise/through-filters` §5 "Ιδανικό LPF + λευκός — η baseline εφαρμογή" | `noise/white-noise` §2 "Slide 47 verbatim — ο ορισμός" (S_N = N₀/2 definition) | No |
| `sept25-th3-10` | PSD θερμικού θορύβου | Thermal noise PSD = kT/2 = N₀/2 (flat); bandlimited power P_N = kTB = N₀B | `noise/sources` §5 "Slide 45 verbatim — από διακύμανση σε PSD" | `noise/white-noise` §2 (S_N = N₀/2 model); `noise/sources` §6 "Slide 47 verbatim — γέφυρα προς τη «λευκή» αφαίρεση" (N₀ ≜ kT convention) | No |
| `sept25-th3-11` | Λευκός θόρυβος μέσα από LPF | Same core as `proodos26-6` (variant: bandwidth B instead of W) | `noise/through-filters` §5 "Ιδανικό LPF + λευκός — η baseline εφαρμογή" | `noise/white-noise` §2 "Slide 47 verbatim — ο ορισμός" | No |
| `jun25-th1-9` | Φασματική πυκνότητα ισχύος θερμικού θορύβου | Same core as `sept25-th3-10` (direct "what is the PSD?" question) | `noise/sources` §5 "Slide 45 verbatim — από διακύμανση σε PSD" | `noise/white-noise` §2; `noise/sources` §6 | No |
| `jun25-th1-10` | Λευκός θόρυβος μέσα από LPF + HPF | White noise → LPF (f_c = W) + HPF (f_c = 10W): draw output spectra AND autocorrelation functions (R_LP via W-K inverse FT: R_LP = N₀W·sinc(2Wτ)) | `noise/through-filters` §5 "Ιδανικό LPF + λευκός — η baseline εφαρμογή" (LPF case + R_LP derivation) | `noise/through-filters` §2γ "Slide 40 — από τη ΣΑΣ εξόδου στην ΦΠΙ εξόδου" (master eq, invoked for HPF case); `noise/white-noise` §4β "Αυτοσυσχέτιση" (R_LP = N₀W·sinc(2Wτ) formula) | **Viz gap — see §2.G** |
| `jan26-th1-3` | Σ/Λ — λευκός θόρυβος ⇔ Gaussian | «λευκός» = flat PSD (frequency domain) ≠ «Gaussian» = amplitude distribution (time domain): two orthogonal properties | `noise/white-noise` §6 "Παγίδα κορυφαία — «λευκός» ≠ «Gaussian»" | `noise/sources` §6 (context: PSD = power per Hz, not a probability distribution) | No |
| `pa25-th1-3` | Σ/Λ — λευκός θόρυβος ⇔ Gaussian | Identical to `jan26-th1-3` (same question, exam repeated it in two sessions) | `noise/white-noise` §6 "Παγίδα κορυφαία — «λευκός» ≠ «Gaussian»" | `noise/sources` §6 | No |
| `pb25-th1-3` | Σ/Λ — θερμικός θόρυβος ⇔ Gaussian | Thermal noise IS Gaussian in amplitude (CLT, sources §2), but its PSD is FLAT — the AWGN joint concept: white AND Gaussian, but on two different graphs | `noise/white-noise` §6 "Παγίδα κορυφαία — «λευκός» ≠ «Gaussian»" | `noise/white-noise` §7 "AWGN — η joint ταμπέλα" (thermal = AWGN); `noise/sources` §2 "Slide 42 verbatim — τι είναι ο θερμικός θόρυβος" (CLT → Gaussian amplitude) | No |

---

### §2.R Reverse table

#### `noise/sources`

| Section | Primary homes | Secondary appearances | §2B cross-check |
| --- | --- | --- | --- |
| §2 "Slide 42 verbatim — τι είναι ο θερμικός θόρυβος" | — | `pb25-th1-3` (CLT → Gaussian amplitude) | Prerequisite context for thermal-noise formula; thermal-noise §2B weight = 2 (those 2 exercises home to §5 below, not §2) |
| §5 "Slide 45 verbatim — από διακύμανση σε PSD" | `sept25-th3-10`, `jun25-th1-9` — **hot for 2** | — | thermal-noise §2B weight = 2 ✓ exact match |
| §6 "Slide 47 verbatim — γέφυρα προς τη «λευκή» αφαίρεση" | — | `sept25-th3-10`, `jun25-th1-9`, `jan26-th1-3`, `pa25-th1-3` | N₀ ≜ kT convention + "PSD = ισχύς ανά Hz" clarification; no dedicated formula weight in §2B |
| §10 "Noise figure F και η αλυσίδα δέκτη" | — | — | noise-figure §2B weight = 0 ✓ |

#### `noise/white-noise`

| Section | Primary homes | Secondary appearances | §2B cross-check |
| --- | --- | --- | --- |
| §2 "Slide 47 verbatim — ο ορισμός" | — | `proodos26-6`, `sept25-th3-10`, `sept25-th3-11`, `jun25-th1-9` — secondary for 4 | white-noise-psd §2B weight = 5.  The 4 here use S_N = N₀/2 explicitly.  The 5th (`jun25-th1-10`) takes it as a given premise from the linked prior problem `jun25-th1-9`; its primary home is through-filters §5 — consistent |
| §4β "Αυτοσυσχέτιση" | — | `jun25-th1-10` (R_LP = N₀W·sinc(2Wτ) formula) | R_N = N₀B·sinc(2Bτ) §2B weight = 1 (no-id formula, jun25-th1-10) ✓ |
| §6 "Παγίδα κορυφαία — «λευκός» ≠ «Gaussian»" | `jan26-th1-3`, `pa25-th1-3`, `pb25-th1-3` — **hot for 3** | — | white-noise-psd §2B weight = 5 but these 3 are T/F conceptual: §2B explicitly excludes them from the formula-invocation count (no formula is written).  Both are correct simultaneously: the *section* is hot for 3 exercises; the *formula* is invoked in 5 ✓ |
| §7 "AWGN — η joint ταμπέλα" | — | `pb25-th1-3` | Composite concept (AWGN = white + Gaussian); no dedicated §2B entry |

#### `noise/through-filters`

| Section | Primary homes | Secondary appearances | §2B cross-check |
| --- | --- | --- | --- |
| §2γ "Slide 40 — από τη ΣΑΣ εξόδου στην ΦΠΙ εξόδου" | — | `jun25-th1-10` (master eq applied to HPF) | lti-output-psd §2B weight = 3; §2γ is the derivation; §5 is the applied baseline (below) |
| §5 "Ιδανικό LPF + λευκός — η baseline εφαρμογή" | `proodos26-6`, `sept25-th3-11`, `jun25-th1-10` — **hot for 3** | — | lti-output-psd §2B weight = 3 ✓ exact match.  P_N = N₀B (no-id formula) §2B weight = 5: all 5 exercises derive bandlimited power from this section or from sources §5 (3 LPF exercises here + 2 thermal exercises at sources §5) ✓ |

#### `noise/bandpass`

| Section | Primary homes | Secondary appearances | §2B cross-check |
| --- | --- | --- | --- |
| §5ε "Η Άσκηση 8 βήμα-βήμα — διάβασε την R_N, ξεκλείδωσε τις συνιστώσες" | — | — | bandpass-noise-r §2B weight = 0 ✓ |
| (all sections) | **hot for 0** | 0 | Coverage gap — see §2.G G3 |

#### `noise/snr`

| Section | Primary homes | Secondary appearances | §2B cross-check |
| --- | --- | --- | --- |
| §1 "Τι είναι το SNR — η μουσική vs το «σσσσ»" | — | — | snr §2B weight = 0 ✓ |
| §2 "Input vs Output SNR — ίδιο σήμα, δύο σημεία μέτρησης" | — | — | snr-input §2B weight = 0 ✓ |
| §3 "Processing gain — αγόρασε ή έχασε SNR ο δέκτης;" | — | — | G_proc §2B weight = 0 ✓ |
| §4 "Reference SNR — ο μόνος δίκαιος κανόνας" | — | — | fm-snr-ref §2B weight = 1 (cross-topic: `sept25-th2-7` is topic:'fm', not topic:'noise') |
| §5 "AM in noise — recap" / §6 "FM in noise — recap" | — | — | am-output-snr §2B weight = 1; fm-snr-out §2B weight = 1 (both cross-topic) |
| §7 "Worked example — σύγκριση SNR για ίδιο πομπό" | — | — | d11b pending — see §2.G G1 |
| (all sections) | **hot for 0** | 0 | **Major gap — see §2.G G1** |

---

### §2.G Gaps

#### G1 — `noise/snr` has zero noise-chapter exercises (rework-blocker + coverage gap) ★ HIGH PRIORITY

None of the 8 noise exercise cards maps to `noise/snr`.  The concepts taught in §1–§4
(SNR definition, dB, input vs output SNR, processing gain, reference SNR = A_c²/(2N₀W))
are exam-relevant but exercised only cross-topic: `sept25-th2-7` (FM-vs-AM comparison,
topic:'fm') invokes SNR formulas, but it is not in the noise exercise bank.

The §2B SNR formula weights are all 0 for the noise-standalone bank, and 1 each for the
cross-topic FM problem — consistent.  But this is not benign:

1. **Active rework-blocker:** `noise/snr` is mid-rework — step `d11a` completed §1–§4
   (SNR formalism core), but `d11b-snr-comparison-recap` (§5–§8: AM/FM recap, worked
   comparison example, 5 ExamProblems, Ανακάλεσε/Αναγνώρισε drills, Recap) is still
   pending.  Until d11b ships, a student sent to the SNR page from a cross-topic SNR
   problem finds an incomplete guide.

2. **Gap signal for d11b:** the forward table confirms there is no dedicated noise-bank
   exercise that tests processing gain or input/output SNR calculation from first
   principles.  The 5 ExamProblems scheduled for d11b (the SNR+FM comparison type) are
   the primary vehicle.  This map directly feeds d11b's scope: those ExamProblems, once
   added to the SNR page and to `exercises.tsx` (if they aren't already there), will
   shift this section from hot-for-0 to hot-for-N.

**Planner action:** prioritise `d11b-snr-comparison-recap` (already unblocked per
`bus/inbox/057`, Opus); after d11b ships, re-check this entry and update the reverse
table.  Consider whether any of the d11b ExamProblems should also appear as standalone
`topic:'noise'` exercise cards in `exercises.tsx` (currently they are only embedded inline
on the SNR page).

---

#### G2 — `jun25-th1-10` solution is viz-less for a "draw this" problem (viz gap) ★ HIGH PRIORITY

The problem statement explicitly says «**Σχεδιάστε** (1) το φάσμα εξόδου στα δύο φίλτρα
και (2) τη χρονική απόκριση» — this is a visual drawing problem.  The current solution is
a bare bullet list with no interactive visual and no «Διαίσθηση πρώτα» block:

- **No `NoiseFilterShapingViz`** — the three sibling LPF exercises (`proodos26-6`,
  `sept25-th3-10`, `sept25-th3-11`) all embed this viz; `jun25-th1-10` does not.
  The viz already supports filter-type selection («Διάλεξε «Ιδανικό LPF»...») so it
  likely supports HPF mode too; if so, a side-by-side LPF + HPF display is possible
  without a new component.
- **No full R_LP(τ) derivation** — part 2 asks for the autocorrelation «χρονική
  απόκριση»; the solution just states the result.  The derivation via W-K inverse FT
  (rect PSD → N₀W·sinc(2Wτ)) is the key skill the exam tests (§2B wiener-khinchin
  weight = 3, jun25-th1-10 is one of those 3); it should be worked step by step.
- **No `memorizationNote`** — every other noise exercise card that invokes `lti-output-psd`
  or `white-noise-psd` has a `memorizationNote`; jun25-th1-10 (which invokes both) does
  not.
- **F6 flag inherited:** jun25-th1-10 carries `bandpass-noise-r` in its `formulaIds` —
  confirmed mis-tag in MUST_LEARN §2B (that formula is not used; the problem uses LPF +
  HPF, no bandpass filter).  Should be removed when the card is reworked.

**Planner action:** schedule a focused rework of `jun25-th1-10` — add «Διαίσθηση πρώτα»
block, embed `NoiseFilterShapingViz` (LPF + HPF modes), step-through R_LP derivation via
W-K inverse FT, add `memorizationNote`, remove F6 mis-tag from `formulaIds`.  Scope:
`content/practice/exercises.tsx`.  This is T1-scope content work, Sonnet suffices for
the mechanical parts; the R_LP derivation walk-through benefits from Opus scrutiny.

---

#### G3 — `noise/bandpass` has zero past-exam exercise coverage (coverage gap, low severity)

Per §2B, `bandpass-noise-r` weight = 0.  The theory page is fully reworked (d10a–d10c),
but no past-exam exercise card in the bank tests this formula.  The through-filters §8
worked example (slides 51–55) is on-page only.

This is consistent with §2B's own finding ("Zero exam weight ≠ unimportant — the formula
is taught and flagged must-learn; no past-exam coverage in the current bank").  Not
blocking, but if a future exam includes a bandpass-noise problem, the site has no
exercise card to route a student to — only the theory page.

**Planner note:** low priority; revisit if a new past-exam paper surfaces a bandpass
noise problem.

---

## §3. AM chapter — TODO

Step `relmap-am`.  7 theory pages (`am/overview`, `am/conventional`, `am/dsb-sc`,
`am/ssb`, `am/vsb`, `am/multiplexing`, `am/modulator-demodulator`), ~20 exercises.
Map when scheduled.  Reference: `MUST_LEARN_FORMULAS.md §6B`.

---

## §4. FM chapter — TODO

Step `relmap-fm`.  5 theory pages (`fm/overview`, `fm/idea`, `fm/pm`, `fm/bessel`,
`fm/in-noise`), ~8 exercises.  Map when scheduled.  Reference:
`MUST_LEARN_FORMULAS.md §8B`.

---

## §5. Foundations chapter — TODO

Step `relmap-foundations`.  6 theory pages (`foundations/signals`, `foundations/systems`,
`foundations/fourier-series`, `foundations/fourier-transform`,
`foundations/signal-transformations`, `foundations/filters`), 22 exercises.  Map when
scheduled.  Reference: `MUST_LEARN_FORMULAS.md §3B`.

---

## §6. Randomness / PSD chapter — TODO

Step `relmap-randomness`.  4 theory pages (`randomness/why`, `randomness/random-variables`,
`randomness/random-processes`, `randomness/psd`).  No standalone `topic:'random'` exercise
cards in `exercises.tsx`; exercises are inline `<ExamProblem>` blocks only.  Map when
scheduled.  Reference: `MUST_LEARN_FORMULAS.md §7B`.

---

## §7. Modulation bridge — TODO

Step `relmap-modulation`.  1 theory page (`modulation`), no standalone exercise cards.
Map when scheduled.  Reference: `MUST_LEARN_FORMULAS.md §5B`.
