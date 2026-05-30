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
| FM — 5 theory pages, 7 exercises | `relmap-fm` | **DONE** — §4 below |
| **Foundations** — 6 theory pages, 22 exercises | `relmap-foundations` | **DONE** — §5 below |
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

## §4. FM chapter map

**Theory pages:** `fm/idea`, `fm/pm`, `fm/bessel`, `fm/carson`, `fm/in-noise`.

**Exercises (7 past-exam `topic:'fm'`; excludes `lec-fm-1`, `lec-fm-3`; NOT yet Phase-2-reworked):**
`sept25-th2-6`, `sept25-th2-7`, `sept25-th2-8`, `sept25-th2-9`,
`jan26-th1-5`, `jan26-th4-fm`, `jun25-th3-fm`.

**Note on theory page set:** the §4 TODO placeholder listed `fm/overview` — the actual
directory contains `fm/carson` (Carson's rule + NBFM/WBFM) instead; there is no
`fm/overview` page.  Corrected here.

**Source:** homes derived from each card's `formulaIds` + solution content + §8B
formula-usage analysis; verified against actual FM theory page section headings.
§8B cross-check reuses §8B weights throughout — NOT recomputed.
**Regime note:** FM theory is fully reworked; FM exercises are NOT yet Phase-2-reworked,
so cards do not pre-cite clean theory homes — homes derived by formulaId + solution
analysis, then verified against page headings.

---

### §4.F Forward table

| Problem | Title | Core concept | Primary theory home | Secondary theory home(s) | Gap? |
| --- | --- | --- | --- | --- | --- |
| `sept25-th2-6` | FM αρχή λειτουργίας + δείκτης β | Explain FM: write x_FM = A_c cos[2πf_c t + 2πK_f ∫m dτ] from instantaneous-frequency definition; define β_f = ΔF_max/W | `fm/idea` §3 "Από στιγμιαία συχνότητα στην εξίσωση FM" | `fm/idea` §5 "Modulation index β_f — η σωστή γενική μορφή" (β definition); `fm/idea` §2 "Στιγμιαία συχνότητα — η μηχανική αναλογία" (f_i = f_c + K_f m(t)) | No |
| `sept25-th2-7` | Σύγκριση FM vs AM | Compare across noise immunity (constant envelope → limiter removes amplitude noise), bandwidth (2(β+1)W vs 2W), power efficiency (A_c²/2 all-useful vs η ≤ 33%), receiver complexity | `fm/in-noise` §9 "AM vs FM — η canonical σύγκριση" | `fm/in-noise` §5 "Η σύγκριση: G = 9β² over AM" (G_FM/AM formula); `fm/carson` §1 "Carson — η εξίσωση + ο ορισμός από τις διαφάνειες" (FM bandwidth = 2(β+1)W); `am/modulator-demodulator` §5c "Output SNR — πίνακας αναφοράς" (AM SNR baseline for comparison) | No |
| `sept25-th2-8` | FM — β και Carson για εμπορικό σήμα | Given Δf = 50 kHz, fm = 5 kHz (single-tone): β = Δf/fm = 10 (WBFM); B_Carson = 2(β+1)fm = 110 kHz | `fm/carson` §7 "Άσκηση 2 — η canonical Carson εξάσκηση (slides 27-28)" | `fm/idea` §5 "Modulation index β_f — η σωστή γενική μορφή" (β = Δf/W formula premise) | No |
| `sept25-th2-9` | FM Bessel — sidebands για β=2.5 | (Α) Write Bessel series x_FM = A_c Σ J_n(2.5) cos[2π(f_c+nf_m)t]; (Β) read J_0≈−0.05 (carrier ≈ null near β=2.405), J_1≈0.50 strongest; (Γ) Carson BW = 2(2.5+1)fm = 7fm | `fm/bessel` §6 "Το WBFM φάσμα — forest of impulses (slide 44)" | `fm/bessel` §10 "Άσκηση 3 — η κανονική εξεταστική (slides 48-50)" (worked analog of same problem type); `fm/bessel` §7.1 "Συμμετρία (slide 45)" + §7.2 "Σύγκλιση (slide 45)" (Bessel properties for part Β); `fm/carson` §1 "Carson — η εξίσωση" (BW in part Γ) | No |
| `jan26-th1-5` | Σ/Λ — β=0.3 είναι WBFM | T/F: ΛΑΘΟΣ — β = 0.3 ≪ 1 → NBFM, not WBFM; WBFM requires β ≫ 1; NBFM linearisation cos ≈ 1, sin ≈ φ applies | `fm/idea` §7 "NBFM vs WBFM — δύο regimes και η σχέση τους με την AM" | `fm/carson` §3 "NBFM όριο — Carson → 2W" (NBFM bandwidth consequence) | No |
| `jan26-th4-fm` | FM — f_c, β, Bessel sidebands, ποσοστό ισχύος | Multi-part (30%): (13) read f_c=100kHz, f_m=1kHz, β=3 from canonical s(t) form; (14) Carson BW = 8kHz; (15) 3 strongest J_n(3): ±2 (4.9V) > ±1 (3.4V) > ±3 (3.1V); (16) carrier power fraction = J_0²(3) = 6.76% | `fm/bessel` §10 "Άσκηση 3 — η κανονική εξεταστική (slides 48-50)" | `fm/idea` §5α "Single-tone ειδική περίπτωση" (pattern-match β from given s(t) form); `fm/carson` §1 "Carson — η εξίσωση" (BW in step 14); `fm/bessel` §7.3 "Energy identity → P_FM = A_c²/2 (slide 47)" (power fraction in step 16 via Σ J_n² = 1) | No |
| `jun25-th3-fm` | FM στα 90 MHz με αλλαγή bandwidth + RF φιλτράρισμα | Multi-step (25%): β₁ = K_f·A_m/fm = 2/2 = 1; harmonics n ≤ B₁/(2fm) = ±4 → 9 total; P_FM = A_c²/2; reduce A_m to narrow BW; RF BRF=4kHz → \|n\| ≤ 1 → 3 harmonics pass; power fraction 97.4% | `fm/carson` §1 "Carson — η εξίσωση + ο ορισμός από τις διαφάνειες" | `fm/idea` §5 "Modulation index β_f — η σωστή γενική μορφή" (β = K_f·A_m/fm computation); `fm/bessel` §9 "Πόσα sidebands μετράνε; (slide 46)" (harmonic count via B/(2fm) rule); `fm/bessel` §7.3 "Energy identity → P_FM = A_c²/2 (slide 47)" (power fraction part 6) | No |

---

### §4.R Reverse table

#### `fm/idea`

| Section | Primary homes | Secondary appearances | §8B cross-check |
| --- | --- | --- | --- |
| §2 "Στιγμιαία συχνότητα — η μηχανική αναλογία" | — | `sept25-th2-6` (f_i = f_c + K_f m(t) is part of the explanatory answer) | fm-instantaneous-freq §8B weight=1; §2 teaches it, but §3 (signal equation derivation) is the primary home for the one exercise that invokes it — consistent ✓ |
| §3 "Από στιγμιαία συχνότητα στην εξίσωση FM" | `sept25-th2-6` — **hot for 1** | — | fm-signal §8B weight=1 ✓ exact match |
| §5 "Modulation index β_f — η σωστή γενική μορφή" | — | `sept25-th2-6` (β definition in explanatory answer), `sept25-th2-8` (β formula premise), `sept25-th2-9` (β given, formula premise), `jan26-th4-fm` (β read from signal as step), `jun25-th3-fm` (β computed from K_f) — secondary for 5 | fm-beta §8B weight=6 (all 6 exercises invoke β): no exercise has "define β" as its standalone deliverable — β is always a step toward Carson or Bessel analysis.  §5 hot for 0 primary; secondary for 5.  The remaining exercise (`jan26-th1-5`) tests the β regime threshold, homing to §7 ✓ |
| §5α "Single-tone ειδική περίπτωση" | — | `jan26-th4-fm` (pattern-match β=3 from canonical s(t) = A_c cos[…+β sin(2πfmt)]), `jun25-th3-fm` (single-tone premise for β = K_f·A_m/fm) | fm-single-tone §8B weight=2: both exercises use the single-tone form as a recognition/decomposition step rather than the primary deliverable ✓ |
| §6α "Η ισχύς του PM/FM σήματος (slide 11)" | — | `jan26-th4-fm` (total P = A_c²/2, used to compute carrier power fraction), `jun25-th3-fm` (FM power = A_c²/2 in part 3) | fm-power §8B weight=2 ✓: both exercises invoke it as a key computational step; both primary homes are elsewhere (fm/bessel §10 and fm/carson §1) |
| §7 "NBFM vs WBFM — δύο regimes και η σχέση τους με την AM" | `jan26-th1-5` — **hot for 1** | — | fm-beta §8B weight=6: jan26-th1-5 is one of the 6 β exercises; the tested concept here is regime threshold (β ≪ 1 → NBFM), NOT a β computation.  §7 hot for 1 ≤ total β weight 6 — consistent; the other 5 β invocations are computational and home to fm/carson or fm/bessel ✓ |
| §8 "Worked example — Άσκηση 2 (slide 27-28)" | — | — | The parallel worked example for β + Carson lives in fm/carson §7 (not here); sept25-th2-8 maps there.  Hot for 0 ✓ |

#### `fm/pm`

| Section | Primary homes | Secondary appearances | §8B cross-check |
| --- | --- | --- | --- |
| §1 "Πώς ορίζεται η PM (slide 7)" | — | — | pm-signal §8B weight=0 ✓ |
| §2 "Modulation index β_p (slide 7)" | — | — | β_p §8B weight=0 for PM-specific invocations ✓ |
| (all sections) | **hot for 0** | `jan26-th1-5` has fm/pm in prerequisites (NBFM/WBFM regime applies equally to PM/FM) but PM-specific formulas are not the core tested concept | **Coverage gap — see §4.G G1** |

#### `fm/bessel`

| Section | Primary homes | Secondary appearances | §8B cross-check |
| --- | --- | --- | --- |
| §6 "Το WBFM φάσμα — forest of impulses (slide 44)" | `sept25-th2-9` — **hot for 1** | `jan26-th4-fm` (§10 is primary; §6 houses the Bessel formula itself), `jun25-th3-fm` (Bessel expansion is implicit in sidebands counting) | fm-bessel-sidebands §8B weight=3 (sept25-th2-9, jan26-th4-fm, jun25-th3-fm): §6 is primary for sept25-th2-9 (writing the series IS the deliverable); secondary for the other 2.  1+2 = 3 ✓ |
| §7.1 "Συμμετρία (slide 45)" | — | `sept25-th2-9` (J_{-n} = (−1)^n J_n used to read ±n intensities), `jan26-th4-fm` (same property applied) | fm-bessel-property §8B weight=3: symmetry half of the property invoked in 2 of 3 exercises ✓ |
| §7.2 "Σύγκλιση — για n > β, J_n ≈ 0 (slide 45)" | — | `sept25-th2-9`, `jan26-th4-fm` (implicit: stopping sideband count at n > β) | Convergence criterion is the practical stopping rule for the Bessel table read in both exercises ✓ |
| §7.3 "Energy identity → P_FM = A_c²/2 (slide 47)" | — | `jan26-th4-fm` (step 16: carrier fraction = J_0²(3)/Σ J_n²(3) = J_0²(3)/1), `jun25-th3-fm` (power fraction 97.4% via Σ J_n² = 1) | fm-bessel-property §8B weight=3: energy identity is the key step for power-fraction computations in 2 of the 3 exercises ✓ |
| §8 "Carrier εξαφάνιση — οι ρίζες του J_0 (slide 37)" | — | `sept25-th2-9` (β=2.5 ≈ 2.405 first J_0 root → carrier ≈ 0 in solution commentary) | Carrier-null pattern is not a separately-weighted formulaId; referenced as an observation in the sept25-th2-9 solution ✓ |
| §9 "Πόσα sidebands μετράνε; (slide 46)" | — | `jun25-th3-fm` (count harmonics via n ≤ B/(2fm)), `jan26-th4-fm` (implicit convergence for finding "3 strongest") | The N ≈ 2⌊β⌋+3 counting heuristic is not a separately-weighted formulaId (§8B.7); practical tool in 2 exercises ✓ |
| §10 "Άσκηση 3 — η κανονική εξεταστική (slides 48-50)" | `jan26-th4-fm` — **hot for 1** | `sept25-th2-9` (3-part version of the same canonical 4-part template) | This section IS the canonical template for the full multi-part Bessel analysis (read f_c/f_m/β from s(t), Carson BW, J_n table read, power fraction); jan26-th4-fm is the exact same 4-part structure; sept25-th2-9 is the 3-part version (stops before the power fraction step).  §8B confirms Bessel formula weight = 3 across the 3 exercises ✓ |

#### `fm/carson`

| Section | Primary homes | Secondary appearances | §8B cross-check |
| --- | --- | --- | --- |
| §1 "Carson — η εξίσωση + ο ορισμός από τις διαφάνειες" | `jun25-th3-fm` — **hot for 1** (Carson drives parts 1, 2, 4, 5, 6 of the multi-step problem) | `sept25-th2-7` (FM bandwidth 2(β+1)W in comparison table), `sept25-th2-8` (formula premise; §7 is primary for that exercise), `sept25-th2-9` (BW in part Γ), `jan26-th4-fm` (BW in step 14) — secondary for 4 | carson §8B weight=6: all 6 FM exercises invoke Carson; §1 is primary for 1 and secondary for 4; `sept25-th2-8` primary routes to §7 (worked example); `jan26-th1-5` routes to §3 (NBFM limit).  1+4+1 (§7)+1 (§3) = 7 total appearances across carson sections ≥ weight 6 ✓ |
| §3 "NBFM όριο — Carson → 2W" | — | `jan26-th1-5` (NBFM regime → bandwidth ≈ 2W as corollary) | NBFM limit is the Carson consequence for β→0; secondary context for the T/F problem ✓ |
| §5 "Carson για PM και FM — slides 26 + 46" | — | — | PM Carson not directly tested (pm-signal weight=0) ✓ |
| §7 "Άσκηση 2 — η canonical Carson εξάσκηση (slides 27-28)" | `sept25-th2-8` — **hot for 1** | — | The worked example in §7 IS exactly sept25-th2-8 (same structure: given Δf + fm → compute β → B_Carson); exact match ✓ |

#### `fm/in-noise`

| Section | Primary homes | Secondary appearances | §8B cross-check |
| --- | --- | --- | --- |
| §4 "Output noise power και SNR_out" | — | `sept25-th2-7` (fm-snr-out = 3β²·SNR_ref cited in comparison table row) | fm-snr-out §8B weight=1 (sept25-th2-7 only) ✓ |
| §5 "Η σύγκριση: G = 9β² over AM" | — | `sept25-th2-7` (fm-gain-am = 9β² appears as a comparison row) | fm-gain-am §8B weight=1 ✓ |
| §9 "AM vs FM — η canonical σύγκριση" | `sept25-th2-7` — **hot for 1** | — | The 4-row comparison table in §9 IS the deliverable of sept25-th2-7; all FM-noise cross-topic formulas route here as context ✓ |
| §1–§3 (derivation chain), §6 (threshold), §7 (capture), §8 (pre-emphasis), §10 (Άσκηση) | **hot for 0** | 0 | **Major coverage gap — see §4.G G2** |

---

### §4.G Gaps

#### G1 — `fm/pm` has zero past-exam exercise coverage (coverage gap, low severity)

`pm-signal` §8B weight=0; β_p §8B weight=0.  No past-exam exercise directly tests PM
signal formulas.  `jan26-th1-5` lists `fm/pm` in prerequisites (the NBFM/WBFM regime
applies to PM as well as FM), but PM-specific formulas are not the core tested concept —
the NBFM regime classification is primary to `fm/idea` §7.

Consistent with §8B's finding ("zero direct exam exercise").  Not blocking; the theory
page is fully reworked.

**Planner note:** low priority; revisit if a future exam includes a dedicated PM
computation (PM instantaneous frequency, PM vs FM comparison derivation).  Currently
fm/pm serves as conceptual background — the exam prefers FM-only problems.

---

#### G2 — `fm/in-noise` derivation sections have zero past-exam exercise coverage (medium severity)

Sections §1–§3 (the derivation chain: bandpass noise → triangular output PSD →
SNR_out formula), §6 (threshold effect), §7 (capture effect), and §8 (pre-emphasis)
have zero past-exam primary exercise homes.

Only `sept25-th2-7` invokes FM noise formulas at all — and it does so **qualitatively**
(a comparison table row, not a step-by-step derivation exercise).  The core formulas:

- `fm-noise-output-psd` (S_n^out = N₀f²/A_c², triangular PSD) — §8B weight=0
- `fm-snr-out` (SNR_out = 3β²·SNR_ref) — §8B weight=1 (single comparison exercise)
- `fm-gain-am` (G = 9β²) — §8B weight=1 (same)
- `fm-snr-ref` (SNR_ref = A_c²/(2N₀W)) — §8B weight=1 (same)

The triangular-PSD derivation (§3a–§3d) and the FM-vs-AM SNR gain derivation (§5) are
never tested as derivation steps on the current exam bank.  This is NOT the same as the
`noise/snr` mid-rework gap (§2.G G1) — `fm/in-noise` is fully reworked.  The exam
simply does not currently test the derivation chain.

After `d11b-snr-comparison-recap` ships (adding SNR comparison exercises to `noise/snr`),
re-check whether those exercises also map here as secondary homes.

**Planner note:** medium priority; consider whether a dedicated "FM noise derivation"
exercise card (deriving the triangular PSD or the 3β² SNR formula step-by-step) should
be added to `exercises.tsx` — currently the theory page's §10 worked example is the
only practice vehicle.  Flag this when the exam bank is next expanded.

---

#### G3 — No FM DRAW/viz gaps in current exercise bank (informational)

No FM past-exam exercise contains a «Σχεδιάστε» / draw-spectrum instruction with a
text-only solution.  FM exercises are uniformly computation/analysis type (write series,
compute β, count sidebands, compute power fraction).  No viz gaps by the §1.3 criterion.

**Informational note for planner:** the Bessel "forest of impulses" spectrum (J_n(β)
heights vs n, for varying β) is inherently visual and would enrich the teaching of
`fm/bessel` §6 and §10.  No existing past-exam exercise requires drawing it, so this is a
theory-page enrichment opportunity rather than an exercise-card rework.  If a viz step is
warranted, it belongs to the `fm/bessel` page and is T2-scope
(`components/viz/` for the component) + T1-scope (wiring into the MDX).

---

## §5. Foundations chapter map

**Theory pages:** `foundations/signals`, `foundations/signal-transformations`,
`foundations/fourier-series`, `foundations/fourier-transform`, `foundations/systems`,
`foundations/filters`.

**Exercises (22 past-exam `topic:'foundations'`):**
`proodos26-8`, `proodos26-10`,
`jan26-th1-2`, `jan26-th1-4`, `jan26-th2-9`, `jan26-th2-10`,
`jun25-th1-1`, `jun25-th1-2`, `jun25-th1-3`, `jun25-th1-4`,
`jun25-th1-5`, `jun25-th1-6`, `jun25-th1-7`, `jun25-th1-8`,
`pa25-th1-2`, `pa25-th1-4`, `pa25-th1-5`, `pa25-th2-4`,
`pb25-th1-2`, `pb25-th1-4`, `pb25-th1-5`, `pb25-th2-4`.

**Source:** homes derived from each card's `formulaIds` + solution content + statement
analysis; verified against actual theory page section headings (all 6 pages read).
§3B cross-check reuses §3B weights throughout — NOT recomputed.  No Sept-2025
foundations exercises exist (that session is entirely AM/FM/noise, confirmed from
`MUST_LEARN_FORMULAS.md §3B` exam-paper audit).

**Regime note:** Foundations theory is fully reworked; foundations exercises are NOT
Phase-2-reworked.  Cards do not pre-cite clean theory homes — homes derived by statement
+ formulaIds + solution analysis, then verified against page headings.  Most exercises
use on-sheet FT pairs/properties (`fourier-pair-rect`, `fourier-pair-cos`, etc.) with no
must-learn callout needed; the must-learn formulas are `parseval-power` (weight 4),
`fourier-series-rect-pulse` (weight 4), `cos-power-half` (weight 3) — per §3B.

---

### §5.F Forward table

| Problem | Title | Core concept | Primary theory home | Secondary theory home(s) | Gap? |
| --- | --- | --- | --- | --- | --- |
| `proodos26-8` | Εύρος του φάσματος του m²(t) | m²(t) = m(t)·m(t) → M(f)∗M(f) in freq. domain (multiplication → convolution duality); support of M∗M = [−W,W]+[−W,W] = [−2W,2W]; bandwidth doubles to 2W | `foundations/fourier-transform` §5 "Ιδιότητες του FT — η εργαλειοθήκη" | `foundations/fourier-transform` §7 "Modulation theorem ⭐" (sinusoidal multiplication is a special case; contextualises the general bandwidth-doubling result) | No |
| `proodos26-10` | Φάσμα πλάτους και ισχύς για sin + sinc | FT of m(t)=sin(10πt)+sinc(10t): sin → impulses at ±5 Hz (height 1/2) via `fourier-pair-sin`; sinc(10t) → rect(f/10)/10 (height 1/10, width 10 Hz) via `fourier-pair-rect`; Power: P_sin = A²/2 = 1/2 (power signal), P_sinc = 0 (energy signal); P_total = 1/2 | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" | `foundations/signals` §"Ενέργεια και Ισχύς" (sinc = energy signal → P=0 classification) | **Viz gap — static SVG, not interactive (see §5.G G2)** |
| `jan26-th1-2` | Σ/Λ — cos είναι σήμα ισχύος | T/F ΣΩΣΤΟ: cos(2πt) has P = A²/2 = 1/2 (finite) → power signal; E = ∫cos²dt = ∞ → not an energy signal | `foundations/signals` §"Ενέργεια και Ισχύς" | — | No |
| `jan26-th1-4` | Σ/Λ — Envelope FS τετραγωνικού παλμού | FS amplitude envelope is sinc-shaped (first null at k = T₀/τ = 10); wider τ → narrower sinc lobe (time-BW reciprocity); T/F about which envelope is narrower requires knowing sinc width ∝ 1/τ | `foundations/fourier-series` §"Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)" | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" (sinc = FT of rect explains why the FS envelope is sinc-shaped) | No |
| `jan26-th2-9` | Ισχύς αθροίσματος cosines + sines | P = A²/2 + B²/2 + C²/2 for x = Acos(2πf₁t)+Bsin(2πf₂t)+Csin(2πf₃t) with all f distinct → orthogonal components → powers add (Parseval-power / FS Parseval theorem) | `foundations/fourier-series` §"Ανακάλεσε — δες τι μένει χωρίς να γυρίσεις πίσω" | `foundations/signals` §"Ενέργεια και Ισχύς" (cos-power-half: each sinusoidal term individually has power A²/2) | No |
| `jan26-th2-10` | Φάσμα πλάτους του sum-of-cosines+sines | «Σχεδιάστε» amplitude spectrum of x = Acos(2πf₁t)+Bsin(2πf₂t)+Csin(2πf₃t): 6 impulses at ±f₁, ±f₂, ±f₃ with heights A/2, B/2, C/2 | `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain" | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" (cos/sin → impulse FT pairs are the derivation tool) | **Viz gap — «Σχεδιάστε», text-only bullet list (see §5.G G2)** |
| `jun25-th1-1` | Σειρά συχνοτήτων: δορυφορικά, ραδιοφωνικά, τηλεοπτικά | AM radio (535 kHz–1.7 MHz) < FM radio (88–108 MHz) < TV VHF/UHF (54–806 MHz) < satellite (4–30 GHz); answer requires knowing standard broadcast band ranges and the physics of propagation vs. bandwidth | — | — | **Soft theory gap — no foundations page teaches comm-band frequency ordering (see §5.G G1)** |
| `jun25-th1-2` | Ρόλος καναλιού στο τηλεπικοινωνιακό σύστημα | Channel = physical medium between Tx and Rx; affects amplitude (path loss/attenuation), phase (group-delay distortion), bandwidth (acts as a filter), and adds AWGN noise | `foundations/systems` §"Τι είναι ένα σύστημα;" | — | No |
| `jun25-th1-3` | Φασματικές συνιστώσες δ(t-T₁) | F{δ(t−T₁)} = e^{−j2πfT₁}; amplitude spectrum = 1 (flat) for all f → infinite spectral components; phase = −2πfT₁ (linear in f) | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" | `foundations/fourier-transform` §5 "Ιδιότητες του FT — η εργαλειοθήκη" (fourier-shift property applied to the δ(t)↔1 base pair) | No |
| `jun25-th1-4` | Φάσμα πλάτους + φάσης 2cos(1000πt+π/4) | FT: 2cos(2π·500·t+π/4) → two impulses at ±500 Hz; amplitude spectrum height = 1; phase spectrum = ±π/4 | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" | — | No |
| `jun25-th1-5` | Περιοδικός τετραγωνικός παλμός — χρόνος + φάσμα | «Σχεδιάστε» time domain AND amplitude spectrum of periodic rect-pulse train (T=10s, τ=1s): aₖ = (τ/T)sinc(kτ/T) = 0.1·sinc(k/10); DC = 0.1; first null at k=10 (1/τ = 1 Hz) | `foundations/fourier-series` §"Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)" | — | **Viz gap — «Σχεδιάστε» both time domain + spectrum, text-only (see §5.G G2)** |
| `jun25-th1-6` | Αν τ μεγαλώσει σε 4sec, τι αλλάζει στο φάσμα | Wider pulse τ=4s: aₖ = 0.4·sinc(0.4k); amplitude grows (0.4 vs 0.1); first null shifts from k=10 to k=2.5 — time-bandwidth reciprocity: wider τ → smaller first-null-k → denser, larger sinc lobe | `foundations/fourier-series` §"Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)" | — | No |
| `jun25-th1-7` | Φάσμα πλάτους & φάσης Σ A_k cos(2πk f_c t + φ_k) | «Σχεδιάστε» amplitude and phase spectra: amplitude impulses at ±kf_c, heights A_k/2 = k²/2 for k=1..6; phase ±kπ/4 | `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain" | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" (cos FT pair: each harmonic → impulse at ±kf_c) | **Viz gap — «Σχεδιάστε», text-only bullet list (see §5.G G2)** |
| `jun25-th1-8` | A_k για περιοδικούς τετραγωνικούς παλμούς | Compute single-sided FS amplitudes Aₖ = (2Aτ/T₀)·sinc(kf₀τ) for periodic rect-pulse train; direct application of fourier-series-rect-pulse | `foundations/fourier-series` §"Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)" | — | No |
| `pa25-th1-2` | Σ/Λ — cos είναι σήμα ισχύος | Same as `jan26-th1-2` — T/F ΣΩΣΤΟ; identical question, different exam session | `foundations/signals` §"Ενέργεια και Ισχύς" | — | No |
| `pa25-th1-4` | Σ/Λ — Bandwidth του M³(f) | T/F ΛΑΘΟΣ: claim "M³(f) bandwidth = W³"; correct is 3W. m³ = m·m² → M³ = M∗M² (bandwidth 2W+W = 3W); each convolution step adds W | `foundations/fourier-transform` §5 "Ιδιότητες του FT — η εργαλειοθήκη" | — | No |
| `pa25-th1-5` | Σ/Λ — Envelope FS τριγωνικού παλμού | T/F ΛΑΘΟΣ: claim "FS envelope is sinusoidal"; correct is sinc²-shaped. Tri pulse FS envelope follows FT pair Λ(t/T) ↔ T·sinc²(fT) (on-sheet; fourier-pair-tri); inverse-error in coaching fixed in step `fix-inverse-corrections-batch` | `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain" | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" (tri↔sinc² FT pair; fourier-pair-tri IS ON-SHEET) | No |
| `pa25-th2-4` | Ισχύς Asin(2πf₁t) + Bcos(2πf₂t) + Ccos(2πf₃t) | Same structure as `jan26-th2-9` (repeatGroup 'power-sum-sinusoids'): P = (A²+B²+C²)/2 | `foundations/fourier-series` §"Ανακάλεσε — δες τι μένει χωρίς να γυρίσεις πίσω" | `foundations/signals` §"Ενέργεια και Ισχύς" | No |
| `pb25-th1-2` | Σ/Λ — cos είναι σήμα ενέργειας | T/F ΛΑΘΟΣ: cos(2πt) has P = 1/2 (finite) → power signal, NOT energy signal (E = ∞); inverse formulation of `jan26-th1-2` | `foundations/signals` §"Ενέργεια και Ισχύς" | — | No |
| `pb25-th1-4` | Σ/Λ — M³(f) bandwidth | Same as `pa25-th1-4` (same exam question, Proodos B) | `foundations/fourier-transform` §5 "Ιδιότητες του FT — η εργαλειοθήκη" | — | No |
| `pb25-th1-5` | Σ/Λ — Envelope FS τριγωνικού = συνημιτονοειδής | T/F ΛΑΘΟΣ: claim "FS envelope is cosine-shaped"; same core as `pa25-th1-5` (variant: «ημιτονοειδής» vs «συνημιτονοειδής» — both ΛΑΘΟΣ, correct answer is sinc²) | `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain" | `foundations/fourier-transform` §"4. Παραδείγματα — οι «πρωταγωνιστές»" (tri↔sinc² FT pair) | No |
| `pb25-th2-4` | Ισχύς Asin + Bcos + Ccos διαφορετικών συχνοτήτων | Same as `jan26-th2-9` and `pa25-th2-4` (repeatGroup 'power-sum-sinusoids'): P = (A²+B²+C²)/2 | `foundations/fourier-series` §"Ανακάλεσε — δες τι μένει χωρίς να γυρίσεις πίσω" | `foundations/signals` §"Ενέργεια και Ισχύς" | No |

---

### §5.R Reverse table

#### `foundations/signals`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| §"Τι είναι ένα σήμα;" through §"Πώς ξεχωρίζουμε σήματα — ταξινομία" | **hot for 0** | 0 | These sections define signal concepts but no past-exam exercise isolates them as standalone deliverables; consistent with §3B (signal-power and signal-energy general definitions weight=0 in the foundations bank) |
| §"Ενέργεια και Ισχύς" | `jan26-th1-2`, `pa25-th1-2`, `pb25-th1-2` — **hot for 3** | `proodos26-10` (sinc = energy signal → P=0), `jan26-th2-9`, `pa25-th2-4`, `pb25-th2-4` (cos-power-half as per-term building block) | cos-power-half §3B weight=3 ✓ exact match (3 T/F exercises where P=A²/2 IS the deliverable); power-sum exercises invoke it as a sub-step (secondary) — consistent |
| §"Παγίδες που πέφτουν στα εξεταστικά" | **hot for 0** | 0 | Exam-trap awareness section; consistent with §3B weight=0 ✓ |
| §"I/Q αναπαράσταση — η canonical form" | **hot for 0** | 0 | I/Q decomposition is tested cross-topic (AM/FM exercises), not in the foundations exercise bank ✓ |

#### `foundations/signal-transformations`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| (all sections) | **hot for 0** | 0 | **Coverage gap — see §5.G G3.** All signal-transformations formulas have §3B weight=0 for the foundations bank (no past-exam problem isolates amplitude-scaling, time-shift, time-reversal, or time-scaling as a standalone foundations question) |

#### `foundations/fourier-series`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| §"Η σειρά Fourier — οι δύο βασικές εξισώσεις" | — | 0 | synthesis+analysis equations must-learn (entire FS chapter is off-sheet per §3B.1) but no exercise isolates them without invoking the rect-pulse formula; their primary exam vehicle is §"Παράδειγμα" below |
| §"Φάσμα: το σήμα στο frequency domain" | `jan26-th2-10`, `jun25-th1-7`, `pa25-th1-5`, `pb25-th1-5` — **hot for 4** | — | FS amplitude spectrum (Aₖ = 2\|aₖ\| at ±kf₀, envelope = FT of one period) is the core concept; fourier-pair-cos/sin/tri used here are all on-sheet → no §3B must-learn weight; hot for 4 consistent with on-sheet status ✓ |
| §"Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)" | `jan26-th1-4`, `jun25-th1-5`, `jun25-th1-6`, `jun25-th1-8` — **hot for 4** | — | fourier-series-rect-pulse §3B weight=4 ✓ exact match |
| §"LTI σε periodic σήμα — κάθε αρμονική ξεχωριστά" | — | 0 | lti-output-fourier-series §3B weight=0 for foundations bank ✓ |
| §"Ανακάλεσε — δες τι μένει χωρίς να γυρίσεις πίσω" | `jan26-th2-9`, `pa25-th2-4`, `pb25-th2-4` — **hot for 3** | `proodos26-10` (parseval-power invoked for the sin-component power P = A²/2) | parseval-power §3B weight=4: 3 primary + 1 secondary = 4 total parseval-power invocations ✓ consistent |

#### `foundations/fourier-transform`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| §"1. Από Fourier series σε Fourier transform: το πέρασμα στο όριο" | — | 0 | Derivation context; no exercise isolates the T→∞ limit argument ✓ |
| §"2. Οι δύο εξισώσεις του Fourier transform" | — | 0 | FT synthesis+analysis equations are on-sheet; no exercise requires writing them from scratch ✓ |
| §"4. Παραδείγματα — οι «πρωταγωνιστές»" | `proodos26-10`, `jun25-th1-3`, `jun25-th1-4` — **hot for 3** | `jan26-th1-4`, `jan26-th2-10`, `jun25-th1-7`, `pa25-th1-5`, `pb25-th1-5` — secondary for 5 | All FT pairs invoked (rect, sin, cos, tri, δ(t)) are on-sheet → §3B weight=0 for these; hot for 3 primary + secondary for 5 (exercises where on-sheet pairs supply supporting machinery) ✓ |
| §5 "Ιδιότητες του FT — η εργαλειοθήκη" | `proodos26-8`, `pa25-th1-4`, `pb25-th1-4` — **hot for 3** | `jun25-th1-3` (fourier-shift property for the δ(t−T₁) phase argument) | fourier-convolution and fourier-shift are on-sheet → §3B weight=0 ✓. Nonetheless, 3 exercises test the non-obvious APPLICATION of on-sheet multiplication↔convolution duality (bandwidth doubles when a signal is squared/cubed) — a trap that consistently recurs |
| §"6. Spectrum of periodic signals: από FT σε FS και πίσω" | — | `jan26-th2-10`, `jun25-th1-7` (FS↔FT bridge contextualises periodic-signal spectrum drawing) | Bridge section; no exercise isolates the T→∞ argument itself ✓ |
| §"7. Modulation theorem ⭐" | — | `proodos26-8` (squaring = self-modulation; modulation theorem contextualises bandwidth-doubling intuition) | fourier-modulation-theorem (on-sheet); no exercise has modulation-theorem application as its primary deliverable ✓ |
| §"9. Parseval και Energy Spectral Density" | — | 0 | FT Parseval (`parseval` §3B weight=1) is cross-topic via `jun25-th2` (topic:'am'); no foundations-bank exercise requires this section as a home ✓ |

#### `foundations/systems`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| §"Τι είναι ένα σύστημα;" | `jun25-th1-2` — **hot for 1** | — | Channel-as-system concept tested; no must-learn formula invoked (§3B.3: all LTI systems formulas weight=0 for foundations bank) ✓ |
| §"Η κρουστική απόκριση h(t)" / §"Συνέλιξη" / §"Ιδιότητες της συνέλιξης" / §"Πώς συμπεριφέρεται ένα LTI σε μία συχνότητα" | **hot for 0** | 0 | LTI convolution and H(f) are foundational machinery tested cross-topic (AM/FM/noise chapters), not as standalone foundations exam deliverables; §3B.3: all weight=0 for foundations bank ✓ |

#### `foundations/filters`

| Section | Primary homes | Secondary appearances | §3B cross-check |
| --- | --- | --- | --- |
| (all sections) | **hot for 0** | 0 | **Coverage gap — see §5.G G3.** filter-gain-db §3B weight=0 (only inline ExamProblem on filters page); no past-exam foundations exercise tests LP/HP/BP/BS filter parameters or specifications ✓ |

---

### §5.G Gaps

#### G1 — `jun25-th1-1` has no foundations theory home (soft theory gap, low severity)

The problem asks to order AM radio (535 kHz–1.7 MHz), FM radio (88–108 MHz),
TV VHF/UHF (54–806 MHz), and satellite (4–30 GHz) by ascending frequency and explain
why.  The correct ordering and rationale (longer-range propagation at low frequencies;
high frequencies needed for large bandwidth and compact antennas; satellite requires
line-of-sight) are general telecommunications context knowledge — not derivable from
any formula on these pages.

None of the six foundations theory pages has a section that explicitly teaches carrier
frequency ranges for standard broadcast systems.  The closest touchpoints are:
- `foundations/signals` §"Τι είναι ένα σήμα;" — real-world signal examples but no
  carrier-frequency taxonomy
- The `am/conventional` and `fm/idea` pages (outside foundations scope) mention specific
  frequency bands in their opening motivation sections

**Severity:** low.  Exam weight = 3 (one session, June 2025 only), factual recall rather
than derivation.

**Planner note:** Options — (a) add a 2–3 line callout in `foundations/signals`
§"Τι είναι ένα σήμα;" listing the broadcast-band frequency hierarchy with a one-sentence
propagation note; or (b) accept that this is served adequately by the AM/FM opening
sections and add no foundations-page fix.  The planner chooses; no urgent rework
warranted.

---

#### G2 — 4 foundations «Σχεδιάστε» exercises with static or text-only solutions (viz gaps) ★ HIGH PRIORITY

The following four foundations exercises are explicit «Σχεδιάστε» / draw-spectrum problems
whose current solutions are text-only or static-SVG-only, violating the FLOOR mandate.

1. **`proodos26-10`** — statement says «να σχεδιαστεί το φάσμα πλάτους».  Current solution
   contains a **static SVG** (rect + impulses at ±5 Hz).  Static SVG = viz gap by the
   precedent of §3.G G1 (where `proodos26-11/13` with static SVGs are filed as viz gaps).
   No interactive element; student cannot vary f₀ or T or observe the mixed energy/power
   decomposition live.  Primary home: `foundations/fourier-transform` §4 "Παραδείγματα".

2. **`jan26-th2-10`** — statement says «σχεδιάστε το φάσμα πλάτους».  Solution is a
   **bullet list** of 6 impulse heights with no diagram.  Primary home:
   `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain".

3. **`jun25-th1-5`** — statement says «Σχεδιάστε (1) το σήμα στον χρόνο και (2) το φάσμα
   πλάτους».  Solution is **text + BlockMath formula** only — no time-domain waveform, no
   spectrum drawing.  A two-part draw problem with zero visual output.  Primary home:
   `foundations/fourier-series` §"Παράδειγμα: rectangular pulse train".

4. **`jun25-th1-7`** — statement says «Σχεδιάστε φάσμα πλάτους και φάσης».  Solution is a
   **bullet list** of per-harmonic heights and phases.  Primary home:
   `foundations/fourier-series` §"Φάσμα: το σήμα στο frequency domain".

**Planner action:** Schedule focused Phase-2 rework steps for each (T1 scope,
`content/practice/exercises.tsx`).  Candidate viz components:

- **`SpectrumLineViz`** — impulse-line spectrum with configurable harmonics; reusable
  for `jan26-th2-10`, `jun25-th1-7`, and the multi-harmonic AM exercises already filed
  in §3.G G1 (`pa25-th2-5`, `pb25-th2-5`).
- **`RectPulseSeriesViz`** — time-domain rect train + discrete FS amplitude spectrum
  with τ/T slider; would serve `jun25-th1-5`, `jun25-th1-6`, and `jan26-th1-4`.
- **`MixedSpectrumViz`** — mixed continuous rect + impulses for `proodos26-10`.

All candidate components belong in `components/viz/` (T2 scope).  Schedule paired
T2-build → T1-wire steps as with the AM viz cluster.

---

#### G3 — `foundations/signal-transformations` and `foundations/filters` have zero past-exam coverage (coverage gaps, low severity)

Per §3B.3, all signal-transformations-specific and filter-specific must-learn formulas
have weight=0 for the foundations exercise bank.  No past-exam problem isolates time-
scaling, time-reversal, amplitude-scaling, or LP/HP filter specification parameters as
a standalone foundations exercise.  Both theory pages are fully reworked.

This is consistent with §3B's own finding — both pages serve as prerequisite context
for the AM/FM/noise chapters (LTI filtering applications, convolution theorem) rather
than as directly examined standalone content.

**Planner note:** Very low priority; revisit if a future exam includes a dedicated
foundations exercise testing time-reversal + spectrum conjugation symmetry, or ideal-LPF
impulse-response properties.

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
