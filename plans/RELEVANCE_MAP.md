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
| **AM** — 7 theory pages, 31 exercises | `relmap-am` | **DONE** — §3 below |
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

## §3. AM chapter map

**Theory pages:** `am/overview`, `am/conventional`, `am/dsb-sc`, `am/ssb`, `am/vsb`,
`am/multiplexing`, `am/modulator-demodulator`.

**Exercises (31 past-exam `topic:'am'`; excludes `lec-am-1`; NOT yet Phase-2-reworked):**
`proodos26-1`, `proodos26-2`, `proodos26-3`, `proodos26-4`, `proodos26-5`,
`proodos26-7`, `proodos26-9`, `proodos26-11`, `proodos26-12`, `proodos26-13`,
`sept25-th1-1`, `sept25-th1-2`, `sept25-th1-3`, `sept25-th1-4`, `sept25-th1-5`,
`jan26-th1-1`, `jan26-th2-7`, `jan26-th2-8`, `jan26-th3-mux`, `jun25-th2`,
`pa25-th1-1`, `pa25-th2-2`, `pa25-th2-5`, `pa25-th3-mux`,
`pb25-th1-1`, `pb25-th2-1`, `pb25-th2-2`, `pb25-th2-3`, `pb25-th2-5`,
`pb25-th3-mux`, `pb25-th4-nonlinear`.

**Note on exercise count:** `exercises.tsx` now holds 31 past-exam `topic:'am'`
exercises; §6B stated "21" — the difference reflects exercises added by Pass-C
annotation steps and T/F conceptual problems (e.g. `pb25-th2-1`) that §6B excluded
from its formula-weight corpus.  This step uses `exercises.tsx` as ground truth.

**Source:** homes derived from each card's `formulaIds` + solution content + §6B
formula-usage analysis; verified against actual AM theory page section headings.
§6B cross-check reuses §6B weights throughout — NOT recomputed.
**Regime note:** AM exercises are must-learn-FLAGGED but NOT yet Phase-2-reworked;
theory homes are derived by analysis (formulaIds + solution reading), not inferred
from pre-citing reworked cards as in the noise chapter.

---

### §3.F Forward table

| Problem | Title | Core concept | Primary theory home | Secondary theory home(s) | Gap? |
| --- | --- | --- | --- | --- | --- |
| `proodos26-1` | Δείκτης διαμόρφωσης από A_c και A_m | Direct μ = Am/Ac computation from given amplitudes | `am/conventional` §2 "Modulation index μ — ο «χορτασμός» της διαμόρφωσης" | `am/conventional` §1 "Η εξίσωση Conventional AM" (signal form context) | No |
| `proodos26-2` | Συνολική ισχύς AM για P_c=100W, m=1 | P_AM = Pc(1+μ²/2) = 150 W; η at μ=1 context | `am/conventional` §5c "Total power" | `am/conventional` §5d "Efficiency η — το «πόσο πάει σε χρήσιμη πληροφορία»"; §2 (μ = 1 context) | No |
| `proodos26-3` | Τι σημαίνει m=1 | Interpret μ = 1: envelope just touches zero, maximum non-overmodulated operation | `am/conventional` §2 "Modulation index μ — ο «χορτασμός» της διαμόρφωσης" | `am/conventional` §3 "Υπερδιαμόρφωση (overmodulation) — τι σπάει και γιατί" (μ = 1 as the boundary) | No |
| `proodos26-4` | Μέγιστο ποσοστό ισχύος στα sidebands | Maximize η = μ²/(2+μ²); η_max = 1/3 at μ = 1 | `am/conventional` §5d "Efficiency η — το «πόσο πάει σε χρήσιμη πληροφορία»" | `am/conventional` §5c "Total power" (P_total formula invoked) | No |
| `proodos26-5` | AM modulator με δίοδο (square-law) | Square-law y = αx²; fc > 3W condition; BPF extracts AM component | `am/modulator-demodulator` §1b "Nonlinear element + bandpass filter (πραγματικός πομπός)" | `am/conventional` §1 "Η εξίσωση Conventional AM" (output form); `am/conventional` §4 "Φάσμα" (BPF selection of 2fc band) | No |
| `proodos26-7` | DSB-SC: σφάλμα φάσης φ στον σύμφωνο αποδιαμορφωτή | Coherent DSB-SC demod with phase error φ → output = m(t)cos(φ); amplitude scales by cos(φ) | `am/dsb-sc` §4a "Ευαισθησία στη φάση" | `am/dsb-sc` §4 "Coherent demodulation — γιατί δουλεύει" | No |
| `proodos26-9` | AM σήμα στο χρόνο και στη συχνότητα: tone modulation | Draw AM waveform AND spectrum for single-tone message (fc=500Hz, fm=1Hz); write x_AM, compute X_AM(f) | `am/conventional` §4 "Φάσμα του AM σήματος" | `am/conventional` §1 "Η εξίσωση Conventional AM" | **Viz gap** — «Σχεδιάστε» draw-time + draw-spectrum, text-only answer (inbox/074) |
| `proodos26-11` | USSB δύο σημάτων: φάσματα baseband και διαμορφωμένων | Draw baseband spectra (sinc(Wt) → rect; sinc²(Wt) → tri) then USSB-modulated spectra keeping only upper sideband | `am/ssb` §2c "Απόδειξη — γιατί το m·cos − m̂·sin δίνει μόνο USB" | `am/ssb` §3 "USSB-AM vs LSSB-AM — δύο επιλογές, ίδια πληροφορία"; `foundations/fourier-transform` (fourier-pair-rect, fourier-pair-tri) | **Viz gap** — static SVG only, not interactive (inbox/080) |
| `proodos26-12` | Συνθήκη μη-επικάλυψης για USSB FDM | Derive minimum carrier spacing from B_SSB = W (f₁ ≥ W/2, f₂ ≥ max(W, f₁+W/2)) | `am/multiplexing` §3 "Συνθήκη μη-επικάλυψης ανά σχήμα διαμόρφωσης" | `am/ssb` §5 "Bandwidth και ισχύς" (B_SSB = W premise) | **Viz gap** — same cluster as proodos26-11/13; interactive overlap-condition viz absent (inbox/080) |
| `proodos26-13` | Φάσμα πολυπλεγμένου σήματος G(f) | Draw combined USSB multiplexed G(f) = X₁(f) + X₂(f) (two USSB lobes) | `am/multiplexing` §4 "Η canonical εξεταστική άσκηση" | `am/ssb` §2c (individual USSB spectrum structure); `am/multiplexing` §3 | **Viz gap** — static SVG only (inbox/080) |
| `sept25-th1-1` | Αρχή λειτουργίας AM — εξίσωση, sidebands | Explain AM: write x_AM equation, derive X_AM(f), show sideband structure, state B_AM = 2W | `am/conventional` §1 "Η εξίσωση Conventional AM" | `am/conventional` §4 "Φάσμα του AM σήματος"; §4b "Bandwidth = 2W" | No |
| `sept25-th1-2` | Conventional AM — μ, ισχύς carrier, ισχύς συνολική | Compute μ = 0.5; Pc = 50 W; P_AM = 56.25 W from Ac=10V, Am=5V | `am/conventional` §5c "Total power" | `am/conventional` §5a "Carrier power"; §2 "Modulation index μ" | No |
| `sept25-th1-3` | AM vs DSB-SC vs SSB — bandwidth & ισχύς | Comparison table: bandwidth (2W/2W/W), power efficiency (η≤1/3, η=100%, η=100%), advantages for all three AM variants | `am/overview` §4 "Ο χώρος των trade-offs" | `am/conventional` §4b "Bandwidth = 2W"; `am/conventional` §5d "Efficiency η"; `am/dsb-sc` §5b "Power efficiency"; `am/ssb` §5 "Bandwidth και ισχύς" | No |
| `sept25-th1-4` | Envelope detector — λειτουργία & συνθήκες | Envelope detector operation; RC range 1/fc ≪ RC ≪ 1/W; μ ≤ 1 condition for distortion-free operation | `am/modulator-demodulator` §2b "Όρια του RC time constant" | `am/modulator-demodulator` §2a "Πώς δουλεύει"; §2c "Όρος για να δουλέψει η envelope detection" (μ ≤ 1); `am/conventional` §2 "Modulation index μ" | No |
| `sept25-th1-5` | AM φάσμα δύο-τόνου message | Draw two-tone AM spectrum: carrier impulse at fc + sidebands at fc±1kHz and fc±2kHz with given amplitudes | `am/conventional` §4 "Φάσμα του AM σήματος" | `am/conventional` §1 "Η εξίσωση Conventional AM" | **Viz gap** — «Σχεδιάστε» draw spectrum, text-only answer (inbox/074) |
| `jan26-th1-1` | Σ/Λ — μορφή AM σήματος | T/F: [Ac·cos(2πt)]cos(2πfct) → ΛΑΘΟΣ; DSB-SC lacks the constant-offset carrier term; correct AM form needs [Ac+m(t)]cos | `am/conventional` §1 "Η εξίσωση Conventional AM" | `am/dsb-sc` §1 "Από Conventional AM στο DSB-SC" (distinguishing feature) | No |
| `jan26-th2-7` | AM σχεδίαση χρόνου + φάσματος | Draw overmodulated AM waveform (μ=2>1, c=cos(20πt), m=2sin(2πt); phase reversals visible) AND spectrum (carrier ± 1Hz sidebands with imaginary-weight from sin) | `am/conventional` §4 "Φάσμα του AM σήματος" | `am/conventional` §3 "Υπερδιαμόρφωση (overmodulation) — τι σπάει και γιατί" (time-domain waveform part); §2 (μ = Am/Ac = 2) | **Viz gap** — draw both time-domain and frequency-domain, text-only (inbox/078) |
| `jan26-th2-8` | DSB-SC με sinc message | Draw DSB-SC spectrum: sinc(2Wt) message → rect(f/2W) shifts to ±fc with NO carrier impulse | `am/dsb-sc` §3 "Φάσμα — μόνο sidebands" | `am/dsb-sc` §1 "Από Conventional AM στο DSB-SC" (signal form); `foundations/fourier-transform` (fourier-pair-rect: sinc ↔ rect) | **Viz gap** — «Σχεδιάστε» draw DSB-SC spectrum, text-only (inbox/081) |
| `jan26-th3-mux` | AM-USSB Multiplexing — sinc + Π σε δύο φέροντα | Draw baseband spectra + USSB-modulated spectra for sinc(2Wt) on f₁=100kHz and Π(4Wt) on f₂=1MHz; draw multiplexed G(f) | `am/multiplexing` §4 "Η canonical εξεταστική άσκηση" | `am/ssb` §5 "Bandwidth και ισχύς" (B_SSB = W); `foundations/fourier-transform` (fourier-pair-rect) | **Viz gap (NEW)** — «Αποτυπώστε σχηματικά» draw problem; text-only solution (no interactive spectrum viz) |
| `jun25-th2` | AM Multiplexing — sinc(Wt) DSB-SC + sinc(6Wt) DSB | Mixed FDM: DSB-SC + conventional AM channels; write signal forms, draw per-channel and combined spectra, derive non-overlap condition for n channels | `am/multiplexing` §4 "Η canonical εξεταστική άσκηση" | `am/multiplexing` §3 "Συνθήκη μη-επικάλυψης ανά σχήμα διαμόρφωσης"; `am/dsb-sc` §3 "Φάσμα — μόνο sidebands"; `am/conventional` §4 "Φάσμα"; `foundations/fourier-transform` | **Viz gap** — draw mixed-FDM spectra, text-only (inbox/078; inbox/081) |
| `pa25-th1-1` | Σ/Λ — μορφή AM σήματος (DSB-SC vs conventional) | T/F: same trap as jan26-th1-1 — [Ac·cos(2πt)]cos(2πfct) → ΛΑΘΟΣ (DSB-SC, no carrier-offset term) | `am/conventional` §1 "Η εξίσωση Conventional AM" | `am/dsb-sc` §1 "Από Conventional AM στο DSB-SC" | No |
| `pa25-th2-2` | Σχεδίαση AM σήματος cos(8πt) με 2sin(2πt) | Draw AM waveform; μ = Am/Ac = 2 > 1 → overmodulation; identify envelope and phase reversals | `am/conventional` §3 "Υπερδιαμόρφωση (overmodulation) — τι σπάει και γιατί" | `am/conventional` §2 "Modulation index μ" (μ = 2 > 1 calculation) | **Viz gap (NEW)** — draw AM waveform, text-only; sibling of `pb25-th2-2` (repeatGroup 'am-draw-cos8pi'); pb25-th2-2 was filed (inbox/077) — pa25-th2-2 mentioned as sibling there |
| `pa25-th2-5` | AM ενός Σ ncos(2πnt), n=1..8 — αρμονικές | Draw baseband amplitude spectrum of Σn·cos(2πnt) (n=1..8) and AM spectrum (carrier + 2×8 sideband lines) | `am/conventional` §4 "Φάσμα του AM σήματος" | `foundations/fourier-series` (multi-harmonic signal representation) | **Viz gap** — «Σχεδιάστε» draw baseband + AM spectra, text-only (inbox/076) |
| `pa25-th3-mux` | AM-USSB Multiplexing — sinc(2Wt) + Π(4Wt) | USSB FDM: draw baseband and modulated spectra, derive non-overlap condition (f₂ ≥ f₁ + W), draw G(f) | `am/multiplexing` §4 "Η canonical εξεταστική άσκηση" | `am/multiplexing` §3 "Συνθήκη μη-επικάλυψης ανά σχήμα διαμόρφωσης"; `am/ssb` §5 "Bandwidth και ισχύς"; `foundations/fourier-transform` | **Viz gap** — draw spectra and G(f), text-only (inbox/081) |
| `pb25-th1-1` | Σ/Λ — μορφή AM (σωστή) | T/F: [Ac+cos(2πt)]cos(2πfct) → ΣΩΣΤΟ; conventional AM form correctly includes carrier-offset term Ac | `am/conventional` §1 "Η εξίσωση Conventional AM" | — | No |
| `pb25-th2-1` | Λόγοι DSB-SC διαμόρφωσης | Motivations for DSB-SC: η = 100% (no carrier power overhead), compared to ηAM ≤ 1/3; same bandwidth as AM (2W) | `am/dsb-sc` §1 "Από Conventional AM στο DSB-SC" | `am/dsb-sc` §5b "Power efficiency" (η = 100% quantification) | No |
| `pb25-th2-2` | AM σχεδίαση cos(8πt) με 2sin(2πt) | Same as pa25-th2-2 (repeatGroup 'am-draw-cos8pi'): draw overmodulated AM waveform; μ = 2 > 1; phase reversals | `am/conventional` §3 "Υπερδιαμόρφωση (overmodulation) — τι σπάει και γιατί" | `am/conventional` §2 "Modulation index μ" (μ = 2 > 1) | **Viz gap** — draw overmodulated AM waveform, text-only (inbox/077) |
| `pb25-th2-3` | AM-LSSB φάσμα με sinc message | Draw LSSB spectrum: sinc(2Wt) → rect baseband; LSSB keeps only lower sideband below fc (sign flip from USSB) | `am/ssb` §3 "USSB-AM vs LSSB-AM — δύο επιλογές, ίδια πληροφορία" | `am/ssb` §2c "Απόδειξη — γιατί το m·cos − m̂·sin δίνει μόνο USB" (LSSB sign convention); `foundations/fourier-transform` (fourier-pair-rect) | **Viz gap** — draw LSSB spectrum, text-only (inbox/081) |
| `pb25-th2-5` | AM φάσμα Σ(10-n)cos(2πnt), n=1..6 | Draw AM spectrum of Σ(10-n)cos(2πnt): count carrier + sideband lines; sibling of pa25-th2-5 | `am/conventional` §4 "Φάσμα του AM σήματος" | `foundations/fourier-series` (multi-harmonic series representation) | **Viz gap** — draw AM spectrum, text-only; pb25-th2-5 also missing `am-spectrum` tag (inbox/077) |
| `pb25-th3-mux` | AM-DSB-SC Multiplexing — sinc(Wt) + Π(Wt) | DSB-SC FDM: write signal forms, draw per-channel spectra, derive non-overlap condition (f₂ ≥ f₁ + 3W/2 for DSB-SC), draw G(f) | `am/multiplexing` §4 "Η canonical εξεταστική άσκηση" | `am/multiplexing` §3 "Συνθήκη μη-επικάλυψης ανά σχήμα διαμόρφωσης"; `am/dsb-sc` §3 "Φάσμα — μόνο sidebands"; `foundations/fourier-transform` | **Viz gap** — draw DSB-SC FDM spectra and G(f), text-only (inbox/081) |
| `pb25-th4-nonlinear` | Μη γραμμικός AM transmitter — α, φάσμα, BPF | Nonlinear y = x²(t) modulator: draw spectrum of y(t) (DC + baseband + DSB-SC component + 2fc harmonics); BPF selects the AM term | `am/modulator-demodulator` §1b "Nonlinear element + bandpass filter (πραγματικός πομπός)" | `foundations/fourier-transform` (fourier-pair-rect, fourier-modulation-theorem for squared-signal spectrum) | **Viz gap** — draw spectrum of y(t) showing all components, text-only (inbox/077) |

---

### §3.R Reverse table

#### `am/overview`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §2 "Το AM concept — info στο πλάτος του carrier" | — | `sept25-th1-1` (high-level motivation for AM) | Introductory concept section; no standalone must-learn formula; am-signal §6B weight=17 — the formula is TAUGHT in am/conventional §1, not here |
| §3 "Οι τέσσερις παραλλαγές AM — η οικογένεια" | — | `sept25-th1-3` (comparison context: the four variants and their summary trade-offs) | am-bandwidth overview mention here (2W/2W/W); primary teaching of B_AM = 2W is am/conventional §4b; this section provides the bird's-eye view |
| §4 "Ο χώρος των trade-offs" | `sept25-th1-3` — **hot for 1** | — | am-bandwidth §6B weight=3 (3 exercises use it: sept25-th1-1, sept25-th1-3, sept25-th2-7). §4 is primary for the 1 direct bandwidth+efficiency COMPARISON problem; other 2 bandwidth exercises home to am/conventional §1 and fm chapter ✓ |

#### `am/conventional`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §1 "Η εξίσωση Conventional AM" | `sept25-th1-1`, `jan26-th1-1`, `pa25-th1-1`, `pb25-th1-1` — **hot for 4** | `proodos26-1`, `proodos26-2`, `proodos26-3`, `proodos26-5`, `proodos26-9`, `sept25-th1-2`, `sept25-th1-5`, `jan26-th2-7`, `pa25-th2-2`, `pa25-th2-5`, `pb25-th2-2`, `pb25-th2-5`, `pb25-th4-nonlinear`, `jun25-th2` — secondary for 14 | am-signal §6B weight=17: §1 is primary for 4 exercises where identifying/stating the AM signal form IS the core deliverable (explanatory + T/F problems); the remaining 13 exercises use x_AM as foundational prerequisite machinery — consistent with am-signal being the most ubiquitous formula in the chapter ✓ |
| §2 "Modulation index μ — ο «χορτασμός» της διαμόρφωσης" | `proodos26-1`, `proodos26-3` — **hot for 2** | `proodos26-2`, `sept25-th1-2`, `sept25-th1-4`, `pa25-th2-2`, `pb25-th2-2`, `jan26-th2-7` | am-mu §6B weight=8: §2 is primary for 2 exercises where computing/interpreting μ IS the deliverable; 6 more invoke μ as a step within power, overmodulation, or spectrum problems. 2+6=8 ✓ |
| §3 "Υπερδιαμόρφωση (overmodulation) — τι σπάει και γιατί" | `pa25-th2-2`, `pb25-th2-2` — **hot for 2** | `jan26-th2-7` (overmodulation context), `proodos26-3` (μ=1 as boundary condition) | No dedicated overmodulation formulaId in §6B (overmod waveform recognition is tested without a formula as such). am-mu §6B weight=8 encompasses overmod exercises (μ>1 triggers it); §3 hot for 2 draw-waveform problems where overmodulation IS the deliverable ✓ |
| §4 "Φάσμα του AM σήματος" | `proodos26-9`, `sept25-th1-5`, `jan26-th2-7`, `pa25-th2-5`, `pb25-th2-5` — **hot for 5** | `sept25-th1-1` (spectrum mentioned as part of explanation); `proodos26-5` (BPF selects the 2fc spectrum band) | am-spectrum §6B weight=4: §4 is primary for 4 tagged am-spectrum exercises (proodos26-9, sept25-th1-5, pa25-th2-5, jan26-th2-7); pb25-th2-5 is a 5th with tagging gap (`am-spectrum` absent from its `formulaIds` — sibling of pa25-th2-5 which IS tagged). Hot for 5 ≥ weight 4 ✓; note tagging gap for pb25-th2-5 |
| §5c "Total power" / §5cγ "Γενική (non-tone) μορφή" | `proodos26-2`, `sept25-th1-2` — **hot for 2** | `proodos26-4`, `sept25-th1-3` | am-power §6B weight=4: §5c teaches P_total = Pc(1+μ²/2); 2 exercises primary (direct computation); proodos26-4 homes to §5d (η maximization); sept25-th1-3 homes to am/overview §4 (comparison table, invokes power as secondary). Combined: 2+2=4 ✓ |
| §5d "Efficiency η — το «πόσο πάει σε χρήσιμη πληροφορία»" | `proodos26-4` — **hot for 1** | `proodos26-2`, `sept25-th1-3` | am-eta §6B weight=3: §5d teaches η = μ²/(2+μ²) ≤ 1/3; proodos26-4 (maximize η) is primary; proodos26-2 (μ=1 context gives η = 1/3 as bonus) and sept25-th1-3 (comparison: η_AM ≤ 1/3) are secondaries. 1+2 = 3 combined ✓ |

#### `am/dsb-sc`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §1 "Από Conventional AM στο DSB-SC" | `pb25-th2-1` — **hot for 1** | `jan26-th1-1`, `pa25-th1-1` (T/F distinguishing DSB-SC from conventional AM) | dsb-sc-signal §6B weight=5: §1 motivates the form x_DSB = Ac·m·cos(2πfct) and is primary for the conceptual "reasons for DSB-SC" problem; the formula-application exercises home to §3 (spectrum) or §4a (phase error) |
| §3 "Φάσμα — μόνο sidebands" | `jan26-th2-8` — **hot for 1** | `pb25-th3-mux` (per-channel DSB-SC spectrum), `jun25-th2` (DSB-SC component spectrum) | dsb-sc-signal §6B weight=5: §3 teaches "no carrier impulse" DSB-SC spectrum; jan26-th2-8 (draw DSB-SC spectrum) is directly primary; FDM problems invoke §3 as secondary step ✓ |
| §4a "Ευαισθησία στη φάση" | `proodos26-7` — **hot for 1** | — | DSB-SC phase-error output m(t)cos(φ): §6B weight=1 (no dedicated formulaId; suggested `dsb-sc-phase-error` id). proodos26-7 is the only past-exam exercise testing this trap ✓ |
| §5b "Power efficiency" | — | `sept25-th1-3` (comparison table: η_DSB = 100%), `pb25-th2-1` (η=100% quantification as motivation) | dsb-sc-power §6B weight=1 (sept25-th1-3, the comparison exercise). §5b provides the η=100% argument ✓ |

#### `am/ssb`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §2b "Διαμορφωτής ολίσθησης φάσης (Hilbert) — κομψή αλγεβρικά" | — | `jan26-th3-mux` (Hilbert formulaId tagged; the form is the tool) | ssb-signal §6B weight=6: §2b introduces the Hilbert-based production method |
| §2c "Απόδειξη — γιατί το m·cos − m̂·sin δίνει μόνο USB" | `proodos26-11` — **hot for 1** | `pb25-th2-3` (LSSB: same proof with sign flip), `proodos26-12`, `proodos26-13`, `pa25-th3-mux`, `jan26-th3-mux` | ssb-signal §6B weight=6: §2c is the primary teaching home for the USSB signal form; proodos26-11 directly exercises "draw USSB spectra for specific baseband signals" — the core of the proof. All 6 ssb-signal exercises depend on §2c's derivation ✓ |
| §3 "USSB-AM vs LSSB-AM — δύο επιλογές, ίδια πληροφορία" | `pb25-th2-3` — **hot for 1** | `proodos26-11`, `proodos26-12`, `proodos26-13`, `pa25-th3-mux`, `jan26-th3-mux` | ssb-signal §6B weight=6: §3 explains USB vs LSB choice; pb25-th2-3 (LSSB draw problem) homes here specifically because the LSSB variant is directly tested. All USSB FDM problems also pass through §3 ✓ |
| §5 "Bandwidth και ισχύς" | — | `proodos26-12` (B_SSB=W underpins non-overlap derivation), `sept25-th1-3` (B_SSB=W in comparison), `pa25-th3-mux`, `pb25-th3-mux`, `jan26-th3-mux` | am-bandwidth §6B weight=3 for B_SSB=W: §5 teaches B_SSB=W; this is invoked in all USSB FDM problems as supporting machinery, never the primary deliverable ✓ |

#### `am/vsb`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| (all sections) | **hot for 0** | 0 | **Coverage gap — see §3.G G3.** vsb-signal, vsb-nyquist-symmetry, vsb-bandwidth all §6B weight=0. No past-exam exercise tests VSB formulas. Consistent with §6B's own finding ("exam weight ~2%"). |

#### `am/multiplexing`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §3 "Συνθήκη μη-επικάλυψης ανά σχήμα διαμόρφωσης" | `proodos26-12` — **hot for 1** (non-overlap condition IS the deliverable) | `pa25-th3-mux`, `pb25-th3-mux`, `jun25-th2` (all derive the condition as a step) | fdm-spacing §6B weight=4 (proodos26-12, pb25-th3-mux, pa25-th3-mux, jun25-th2): §3 teaches the non-overlap condition; proodos26-12 is primary (condition = problem); the other 3 invoke it within the canonical template (§4 primary for those) ✓ |
| §4 "Η canonical εξεταστική άσκηση" | `proodos26-13`, `jan26-th3-mux`, `pa25-th3-mux`, `pb25-th3-mux`, `jun25-th2` — **hot for 5** | `proodos26-12` (non-overlap step is part of the template) | fdm-spacing §6B weight=4: §4 is primary for 5 FDM draw-spectrum+G(f) problems; fdm-spacing weight=4 counts only exercises where the NON-OVERLAP CONDITION is a key derivation step (proodos26-12 + 3 others). §4 hot for 5 ≥ weight 4 ✓ (extra 1 = proodos26-13 / jan26-th3-mux, which draw G(f) without explicitly deriving the spacing condition) |

#### `am/modulator-demodulator`

| Section | Primary homes | Secondary appearances | §6B cross-check |
| --- | --- | --- | --- |
| §1b "Nonlinear element + bandpass filter (πραγματικός πομπός)" | `proodos26-5`, `pb25-th4-nonlinear` — **hot for 2** | — | nonlinear-modulator-fc §6B weight=2 ✓ exact match |
| §2b "Όρια του RC time constant" | `sept25-th1-4` — **hot for 1** | — | envelope-detector-rc §6B weight=1 ✓ |
| §2c "Όρος για να δουλέψει η envelope detection" | — | `sept25-th1-4` (μ ≤ 1 condition as part of envelope-detector question) | am-mu §6B weight=8 (μ ≤ 1 condition tested here); §2b is the primary home for the RC formula |
| §5c "Output SNR — πίνακας αναφοράς" | — | `sept25-th2-7` (cross-topic: FM-vs-AM SNR comparison; topic:'fm', invokes am-output-snr as AM baseline) | am-output-snr §6B weight=1 (cross-topic); `sept25-th2-7` is topic:'fm' — primary FM home is `fm/in-noise`; appears here as secondary because the AM SNR formula taught in §5c is the AM side of the comparison. Consistent with §6B cross-topic note ✓ |

---

### §3.G Gaps

#### G1 — AM viz gap cluster (15 already-surfaced by prior steps) ★ HIGH PRIORITY

The following 15 problems are confirmed DRAW («Σχεδιάστε» / «Αποτυπώστε σχηματικά») or
draw-spectrum problems whose current exercise cards have text-only or static-SVG-only
answers.  They were individually filed by prior builder steps and confirmed consistent
with the FLOOR mandate.  Each needs a focused Phase-2 rework step building an
interactive viz.

**Conventional AM spectrum / waveform draws:**
- `proodos26-9` — draw AM waveform + spectrum (tone modulation) → text-only (inbox/074)
- `sept25-th1-5` — draw two-tone AM spectrum → text-only (inbox/074)
- `jan26-th2-7` — draw overmodulated AM waveform + spectrum → text-only (inbox/078)
- `pb25-th2-2` — draw overmodulated AM waveform (repeatGroup 'am-draw-cos8pi') → text-only (inbox/077)
- `pa25-th2-5` — draw multi-harmonic baseband + AM spectra → text-only (inbox/076)
- `pb25-th2-5` — draw multi-harmonic AM spectrum → text-only; also missing `am-spectrum` tag (inbox/077)

**DSB-SC / SSB spectrum draws:**
- `jan26-th2-8` — draw DSB-SC spectrum for sinc message → text-only (inbox/081)
- `pb25-th2-3` — draw LSSB spectrum for sinc message → text-only (inbox/081)

**Nonlinear modulator spectrum:**
- `pb25-th4-nonlinear` — draw spectrum of y = x²(t) (all components + BPF) → text-only (inbox/077)

**USSB/FDM spectrum cluster (static SVG or text-only):**
- `proodos26-11` — draw USSB spectra for rect + tri baseband → static SVG only (inbox/080)
- `proodos26-12` — USSB FDM non-overlap interactive viz absent → static/text (inbox/080)
- `proodos26-13` — draw combined G(f) → static SVG only (inbox/080)
- `pa25-th3-mux` — draw USSB FDM spectra + G(f) → text-only (inbox/081)
- `pb25-th3-mux` — draw DSB-SC FDM spectra + G(f) → text-only (inbox/081)
- `jun25-th2` — draw mixed DSB-SC + AM FDM spectra → text-only (inbox/078; inbox/081)

**Planner action:** each item above is a focused Phase-2 exercise-rework step (T1 scope,
`content/practice/exercises.tsx`).  The viz components — AM spectrum sliders, DSB-SC
spectrum shift, SSBFdmSpectrumViz — belong in `components/viz/` (T2 scope) and should be
scheduled as paired steps (T2 viz build → T1 wire-up).  The USSB/FDM cluster
(proodos26-11/12/13) shares one candidate viz component (`SSBFdmSpectrumViz`, per inbox/080).

---

#### G2 — NEW viz gaps discovered during this mapping (2 problems) ★ HIGH PRIORITY

Two additional «Σχεδιάστε» / draw-waveform problems not yet on the existing filed list:

1. **`jan26-th3-mux`** — statement says «Αποτυπώστε σχηματικά το φάσμα πλάτους» (draw
   the amplitude spectrum schematically) for a two-channel USSB FDM problem
   (sinc(2Wt) on f₁=100kHz, Π(4Wt) on f₂=1MHz).  Current solution (verified from
   `exercises.tsx`) is prose-only — describes spectrum structure in words with no
   interactive viz.  Same family as the proodos26-11/12/13 USSB cluster and the pa/pb25
   multiplexing viz-gaps.  **Primary home: am/multiplexing §4.**

2. **`pa25-th2-2`** — statement says «Σχεδιάστε το διαμορφωμένο κατά AM σήμα» (draw
   the AM signal).  Current solution (verified from `exercises.tsx`) is text + formulas
   with no waveform drawing or interactive viz.  Sibling of `pb25-th2-2` (same
   `repeatGroup: 'am-draw-cos8pi'`); `pb25-th2-2` was filed in inbox/077 which named
   `pa25-th2-2` as a sibling, but `pa25-th2-2` was not placed on the filed list.
   **Primary home: am/conventional §3 (overmodulation, μ=2>1).**

**Planner action:** add `jan26-th3-mux` to the USSB/FDM viz-rework batch and
`pa25-th2-2` to the overmodulated-waveform viz-rework batch (sibling of `pb25-th2-2`).

---

#### G3 — `am/vsb` has zero past-exam exercise coverage (coverage gap, low severity)

Per §6B, all VSB formula weights = 0 (vsb-signal, vsb-nyquist-symmetry, vsb-bandwidth).
The theory page is reworked (included in the overall AM theory pass), but no past-exam
exercise card in the bank tests VSB-specific formulas.  Exam weight ~2% (noted on the
VSB theory page itself).

This is consistent with §6B's own finding.  Not blocking.

**Planner note:** low priority; revisit if a future exam includes a dedicated VSB
derivation problem beyond the qualitative trade-off comparison.

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
