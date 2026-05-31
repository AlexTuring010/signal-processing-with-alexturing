# MUST_LEARN_FORMULAS.md — the must-learn (non-τυπολόγιο) formula record

> **Working record for the cross-cutting "must-learn formula" sub-goal** (owner intent:
> `.overnight/bus/inbox/001-from-human-to-planner.md`). Durable + amnesiac-safe: a fresh
> session should be able to read this file top-to-bottom and know exactly what is on the
> exam formula sheet, what is NOT (and therefore must be memorised), and where each
> non-sheet formula is taught/used. **Apparatus language is English with Greek technical
> terms where natural; the site content it describes is Greek.**

---

## 0. Purpose — what "must-learn" means, and the A→B→C structure

A **must-learn formula** is any formula that is **taught in a theory page or used in a
problem anywhere on the site** and is **NOT printed on the official exam formula sheet —
the τυπολόγιο, `slides/formulas.pdf`.** Those are precisely the formulas a student will
**not** be handed in the exam and therefore must know by heart. (CLAUDE.md already states
the *inverse* convention — "⚠️ This is in the typology — you don't need to memorize it";
the must-learn treatment is its complement, and the two must stay mutually consistent.)

The owner wants every must-learn formula flagged in **three places** (all consistently
worded): **(a)** the theory page where it is taught, **(b) every problem that uses it**
(the placement the owner believes is currently MISSING — verify, don't assert), and
**(c)** the `/formulas` sheet page. Plus a **weight** (= # distinct past-exam exercises
that needed it) and **clickable references** to those exam problems.

The work is staged (owner was explicit it is NOT one naive pass):

- **Pass A — INVENTORY (read-only sweep + log).** One chapter per step. For every formula
  encountered, decide "on the τυπολόγιο or not"; log every non-sheet instance here.
  *No annotation of pages, no weighting yet.* ← **this file is the Pass-A log.**
- **Pass B — PAST-EXAM WEIGHTING.** For each formula the inventory surfaced, count the
  distinct `past_exams/` exercises that used it + collect references. Per-formula steps.
- **Pass C — APPLY.** Add the must-learn callout + weight + references to the three
  placements. Per-chapter/per-placement steps.

**Rendered metadata home (for Pass C):** the single source of truth for "is this
must-learn + weight + exam refs" should live next to the existing formula data
(`content/practice/formulas.tsx`, which already carries an `inTypology: boolean` flag per
entry, and the `formulaIds` map). Writing it once there keeps the three placements
consistent. **This file is the planning/working log, not the rendered source.**

### Status of this file

| Pass | Chapter | Step | State |
| --- | --- | --- | --- |
| A | (ground truth) | τυπολόγιο audit | **DONE** — §1 below (visual PDF audit, 3 pp.) |
| A | Noise — **theory** (5 pages) | `mustlearn-inventory-noise-theory` | **DONE** — §2 below |
| A | Noise — **problems** (8 problems) | `mustlearn-inventory-noise-problems` | **DONE** — §2.7 below |
| A | **Foundations** — theory (6 pages) + problems (22) | `mustlearn-inventory-foundations-randomness-modulation` | **DONE** — §3 below |
| A | **Foundations — supplemental** (signal-transformations + filters, 2 pages) | `mustlearn-inventory-foundations-supplemental` | **DONE** — §7 below |
| A | **Randomness/why** — theory (1 page) + problems (2) | `mustlearn-inventory-foundations-randomness-modulation` | **DONE** — §4 below |
| A | **Randomness/psd** — theory + inline ExamProblems | `mustlearn-inventory-foundations-supplemental` | **DONE** — §7 below |
| A | **Modulation bridge** — theory (1 page) | `mustlearn-inventory-foundations-randomness-modulation` | **DONE** — §5 below |
| A | **AM** — theory (7 pages) + problems (~20) | `mustlearn-inventory-am` | **DONE** — §6 below |
| A | **FM** chapter (5 pages) | `mustlearn-inventory-fm` | **DONE** — §8 below |
| A | **Remaining randomness** (random-variables, random-processes, stationarity) | `mustlearn-inventory-fm` | **DONE** — §8.6 below |
| B | **Noise** — weighting | `mustlearn-passb-noise-formulas` | **DONE** — §2B below |
| B | **AM** — weighting | `mustlearn-passb-am-formulas` | **DONE** — §6B below |
| B | **FM** — weighting | `mustlearn-passb-fm-formulas` | **DONE** — §8B below |
| B | **Foundations** — weighting | `mustlearn-passb-foundations-randomness-formulas` | **DONE** — §3B below |
| B | **Randomness/why** — weighting | `mustlearn-passb-foundations-randomness-formulas` | **DONE** — §4B below |
| B | **Modulation bridge** — weighting | `mustlearn-passb-foundations-randomness-formulas` | **DONE** — §5B below |
| B | **Randomness/PSD + remaining randomness** — weighting | `mustlearn-passb-foundations-randomness-formulas` | **DONE** — §7B below |
| C | Noise — bundle #1 (3 formulas: white-noise-psd·5, bandlimited-noise-power·5, bandlimited-noise-autocorr·1) | placement-(a) noise/white-noise + placement-(b) 5 exercise cards | **DONE** — step `mustlearn-passc-noise-f2-entries-placements` |
| C | Noise — bundle #2 (`lti-output-psd`·3) | placement-(a) noise/through-filters §8στ upgraded + placement-(b) 3 exercise cards extended + placement-(c) by-derivation (getCitedExercises=3) | **DONE** — step `mustlearn-passc-lti-output-psd-bundle` |
| C | Noise — bundle #3 (`wiener-khinchin`·3) | placement-(a) `randomness/psd` §2 warning callout + placement-(b) 3 cards extended + placement-(c) by-derivation (getCitedExercises=3) | **DONE** — step `mustlearn-passc-noise-wiener-khinchin-bundle` |
| C | Noise — bundle #4 (`thermal-noise`·2 + `N₀≈−174`·2 PAGE-ONLY) | placement-(a) `noise/sources` §5 warning callout + §8 −174 callout; placement-(b) 2 card notes extended (thermal triple); placement-(c) getCitedExercises=2 ✓; formulas.tsx thermal-noise row annotated with −174 | **DONE** — step `mustlearn-passc-noise-thermal-bundle` |
| C | Foundations — batch 1 (`cos-power-half`·6, `signal-energy`·2; weight-0 callouts: `signal-power`, `iq-decomposition`, `even-odd-decomposition`) | placement-(a) 5 callouts on `foundations/signals`; placement-(b) 6 cards for cos-power-half (3 T/F tagged + 3 power-sum memorizationNote added) + 2 cards for signal-energy (formulaIds + note extended); placement-(c) by-derivation ✓; §3B corrected cos-power-half weight 3→6 | **DONE** — step `mustlearn-passc-foundations-signals`; getCitedExercises('cos-power-half')=6, getCitedExercises('signal-energy')=2 |
| C | Foundations — batch 2 (`parseval-power`·4, `fourier-series-rect-pulse`·4, `parseval`·1) | placement-(a) warning callout on `foundations/fourier-series` §Parseval + §rect-pulse example; warning callout on `foundations/fourier-transform` §9; placement-(b) proodos26-10 note added; jan26-th2-9/pa25-th2-4/pb25-th2-4 notes extended; all 4 fourier-series-rect-pulse cards noted; jun25-th2 `parseval` tagged + note extended; placement-(c) by-derivation ✓ (all 3 have `derivedIn` set) | **DONE** — step `mustlearn-passc-foundations-fourier-lti`; getCitedExercises('parseval-power')=4, getCitedExercises('fourier-series-rect-pulse')=4, getCitedExercises('parseval')=1 |
| C | Remaining chapters (Randomness, LTI systems formulas) | per-placement | TODO |

---

## 1. τυπολόγιο contents (GROUND TRUTH) — reusable across ALL chapters

> **Write this section once, well — every later chapter inventory (am/fm/foundations)
> REUSES it.** `slides/formulas.pdf` is the ground truth; `content/practice/formulas.tsx`
> mirrors it (via `inTypology`) and is a useful cross-check, but the PDF wins on conflict.

**Audit method (mandatory visual PDF audit, per the project standing facts).** Read
`slides/formulas.pdf` directly as rendered pages (visual view — figures/superscripts/
limits are invisible to `pdftotext`, so the rendered pages were inspected, not just text).
**Real page count = 3 pages.** (`content/practice/formulas.tsx` header comment
independently states "3 pp." — consistent.) Audited 2026-05-28 for this step.

The sheet is titled **«Συστήματα Επικοινωνιών (Κ21)»** and contains exactly the following,
organised into the blocks below.

### Sheet page 1 — Χρήσιμα Ζεύγη Μετασχηματισμού Fourier (FT pairs + properties)

A two-column table `x(t) ↔ X(f)`:

| On-sheet entry (p.1) | matches `formulas.tsx` id |
| --- | --- |
| Duality: `X(t) ↔ x(−f)` | `fourier-duality` |
| Scaling: `x(αt) ↔ (1/\|α\|)·X(f/\|α\|)` | `fourier-scaling` |
| Time shift: `x(t−t₀) ↔ X(f)·e^{−j2πft₀}` | `fourier-shift` |
| Modulation theorem: `x(t)cos(2πf₀t) ↔ ½[X(f−f₀)+X(f+f₀)]` | `fourier-modulation-theorem` |
| Freq shift: `x(t)e^{j2πf₀t} ↔ X(f−f₀)` | `fourier-freq-shift` |
| Convolution: `x(t)∗h(t) ↔ X(f)H(f)` | `fourier-convolution` |
| Multiplication: `x(t)h(t) ↔ X(f)∗H(f)` | `fourier-convolution` |
| Differentiation: `dx/dt ↔ j2πf·X(f)` | `fourier-differentiation` |
| Integration: `∫_{−∞}^{t}x(τ)dτ ↔ X(f)/(j2πf) + X(0)δ(f)/2` | `fourier-integration` |
| `δ(t) ↔ 1`  and  `1 ↔ δ(f)` | `fourier-pair-const-delta` |
| `1/t ↔ −jπ·sgn(f)` | (related to `fourier-pair-sgn`) |
| Rect: `Π(t/T) ↔ T·sinc(fT)` | `fourier-pair-rect` |
| Triangle: `Λ(t/T) ↔ T·sinc²(fT)` | `fourier-pair-tri` |
| `cos(2πf₀t) ↔ ½[δ(f−f₀)+δ(f+f₀)]` | `fourier-pair-cos` |
| `sin(2πf₀t) ↔ (1/2j)[δ(f−f₀)−δ(f+f₀)]` | `fourier-pair-sin` |

### Sheet page 2 — Hilbert transform + Hilbert/Fourier relations + trig identities

- **Hilbert definition:** `x̂(t) = H{x(t)} = x(t)∗(1/πt) = (1/π)∫ x(τ)/(t−τ) dτ`.
- **Hilbert pairs table:** `x̂ ↔ −x`; `x₁∗x₂ ↔ x̂₁∗x₂ or x₁∗x̂₂`; `x(t−t₀) ↔ x̂(t−t₀)`;
  `x(αt) ↔ sgn(α)x̂(αt)`; `cos(t) ↔ sin(t)`; `e^{jt} ↔ −je^{jt}`.
- **Hilbert/Fourier relations:** `F{x̂(t)} = −j·sgn(f)·X(f)` (matches `hilbert` id);
  energy equality `E_x = E_x̂` via `∫\|F{x}\|² df = ∫\|F{x̂}\|² df`.
- **Trig identities (Τριγωνομετρικές Ταυτότητες)** — all on-sheet (`trig-*` ids):
  `cos(x±y)`, `sin(x±y)`, `cos(x)=½(e^{jx}+e^{−jx})`, `sin(x)=(1/2j)(e^{jx}−e^{−jx})`,
  `cos(x)cos(y)=½[cos(x−y)+cos(x+y)]`, `sin(x)sin(y)=½[cos(x−y)−cos(x+y)]`,
  `sin(x)cos(y)=½[sin(x−y)+sin(x+y)]`, `cos²(x)=½[1+cos(2x)]`, `sin²(x)=½[1−cos(2x)]`.

### Sheet page 3 — indefinite integrals + Bessel table

- **Indefinite integrals (`int-*` ids):** `∫cos=sin`, `∫sin=−cos`,
  `∫(a+bx)ⁿ dx=(a+bx)^{n+1}/(b(n+1))`, `∫eˣ=eˣ`, `∫ln(x)dx=x·ln(x)−x`, `∫(1/x)dx=ln\|x\|`,
  `∫(1/cos²x)dx=tan(x)`, `∫(1/sin²x)dx=−1/tan(x)`.
- **Bessel function table** `Jₙ(β_f)` (modulation index 0.00→12.0, sidebands n=0..16) —
  matches `bessel-table` id.

### What is NOT on the sheet → the must-learn universe

The sheet has **no** entries for any of the following families (so anything taught/used
from them is must-learn): signal energy/power definitions, autocorrelation/cross-correlation,
**Wiener–Khinchin / PSD**, random-process statistics (mean/WSS/ergodicity), **any noise
formula** (thermal/Johnson, white-noise PSD, noise figure, equivalent temperature), **PSD
through an LTI system** (`\|H\|²S_X`), bandpass-noise / I/Q decomposition, **SNR / dB**,
AM/FM signal/power/bandwidth/index/Carson/SNR formulas, Fourier-**series** formulas,
filter shapes, and general **Parseval** in the `∫\|x\|²dt = ∫\|X\|²df` form (see edge call
below). In one line: **the τυπολόγιο is a pure transform/trig/integral/Bessel reference —
it contains nothing from random processes, noise, AM, FM, or Fourier series.**

### Cross-check vs `content/practice/formulas.tsx` (`inTypology` flag)

The `FORMULA_SHEET` array tags every entry `inTypology: true|false`. Spot-checking the
`inTypology: true` entries against the visual audit: all Fourier pairs/properties, the
Hilbert relation (`hilbert`), the nine `trig-*`, the eight `int-*`, and `bessel-table` are
genuinely on the sheet — **consistent**. Every `topic:'noise'` entry (`thermal-noise`,
`white-noise-psd`, `lti-output-psd`, `bandpass-noise-r`, `snr`, `noise-figure`) and every
`topic:'random'` entry is flagged `inTypology: false` — **consistent with the sheet having
zero noise/random formulas.** So `formulas.tsx` is a trustworthy mirror here, with **one
live page-level contradiction discovered** (white-noise §10 — see §2 flag F1).

### Ambiguous / edge "is it on the sheet?" calls (flagged, not guessed)

- **General Parseval** `∫\|x(t)\|²dt = ∫\|X(f)\|²df`: the sheet prints **only** the
  *Hilbert-specific* energy equality on p.2 (`∫\|F{x}\|²df = ∫\|F{x̂}\|²df`), **not** the
  general time↔frequency Parseval pair. `formulas.tsx` flags `parseval` as
  `inTypology: false` — consistent with treating general Parseval as must-learn. (Not a
  noise formula; recorded here for the am/fm/foundations passes.)
- **`sgn(t) ↔ 1/(jπf)`**: the sheet prints `1/t ↔ −jπ·sgn(f)` (p.1) + duality; the exact
  `sgn(t)` pair is *derivable* from those but is not itself printed. (Foundations, not noise.)
- **`sinc(x) = sin(πx)/(πx)` definition**: `sinc` appears *inside* on-sheet pairs
  (`T·sinc(fT)`) but its defining formula is not separately printed. Treat as "given via
  the pairs." (Borderline; not a standalone must-learn.)
- **`∫du/(1+u²) = arctan(u)`**: **NOT on the sheet** (p.3 lists only `∫1/cos²=tan` and
  `∫1/sin²=−cot`). This matters for noise — see §2 flag F4.

---

## 2. Pass A inventory — NOISE chapter (theory §2.1–§2.6; problems §2.7)

**Scope.** The **theory side** (§2.1–§2.6, step `mustlearn-inventory-noise-theory`) covers
the 5 noise *theory* pages —
`app/(content)/noise/{sources,white-noise,through-filters,bandpass,snr}/page.mdx`. The
**problems side** (§2.7, step `mustlearn-inventory-noise-problems`) covers the 8
`topic:'noise'` *problems* in `content/practice/exercises.tsx` (+ their companion coaching
in `sose-coaching.tsx`). Together they complete noise Pass A; the problems step REUSES the
§1 τυπολόγιο ground-truth set (no re-audit of `slides/formulas.pdf`).

The remainder of §2 (through §2.6) is the **theory-side** inventory.

**Method / grounding note.** Each row records a formula **taught on the page** and the
**slide the page itself cites** for it (the pages were built with their own mandatory PDF
audits — D7/D8/D9 + d10a/b/c, reviewer-verified — so the slide citations are the pages'
audited grounding, reused here; this step did NOT re-audit `SE_session10_noise.pdf`, whose
audit is owned by those page-build steps). The **on-sheet/off-sheet call** for every row
is grounded in the §1 ground-truth audit of `slides/formulas.pdf`. **Every formula below
is OFF-sheet (must-learn)** — because, per §1, the τυπολόγιο contains no noise formulas at
all. The "why not on sheet" column therefore mostly reduces to "no noise/PSD/SNR family on
the sheet"; it is kept per-row for Pass C wording.

### Headline finding

> **The entire noise chapter is must-learn.** Not a single formula taught on the 5 noise
> theory pages appears on the τυπολόγιο. The must-learn callout (placements a/b/c) applies
> to *every* formula listed below; the only prioritisation is by exam weight (Pass B).

### Placement-(a) status observed on the theory pages (owner-hypothesis evidence)

The owner believes the standardised must-learn signal is largely missing and asked us to
*observe* (the formal verify-don't-assert is the problems step). On the **theory** side it
is **inconsistent**:

- `noise/through-filters` **§8στ already does it right**: states `lti-output-psd` and
  `bandpass-noise-r` are «⚠️ Πρέπει να θυμάσαι (όχι στο επίσημο τυπολόγιο)» and even tags
  `lti-output-psd` "high panic". This is the model wording Pass C should propagate.
- `noise/white-noise` **§10 gets it WRONG**: marks `S_N=N_0/2` as "✓ τυπολόγιο" (flag F1).
- `noise/sources`, `noise/bandpass`, `noise/snr` use **ad-hoc** "μάθε απέξω / να την μάθεις
  απέξω" prose but **no standardised "δεν δίνεται στο τυπολόγιο" callout**.

So a uniform must-learn callout is genuinely needed across the chapter; only through-filters
§8στ currently carries it (for 2 of the formulas).

### 2.1 `/noise/sources` — slides 41–50, 56 (SourceDoc)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `σ² = E[N²] = 4kTRW` (Volts², thermal/Johnson variance) | `thermal-noise` | §3 | slide 43 | no thermal/Johnson formula on sheet |
| `σ² = 4k(T_e+T_i)RW` (receiver internal noise) | `thermal-noise` (variant) | §4 | slide 44 | as above |
| `P_N = E[N²]/(4R) = kTW = kTB` (matched-load power) | `thermal-noise` | §5 | slide 45 | no noise-power formula on sheet |
| `S_N(f) = kT/2` W/Hz, `\|f\|≤10¹²` Hz (thermal PSD) | `thermal-noise` | §5 | slide 45 | no PSD on sheet |
| `S_N(f) = N_0/2`, `N_0 ≜ kT` (white-noise model) | `white-noise-psd` | §6 | slide 47 | no noise PSD on sheet |
| `R_N(τ) = (N_0/2)δ(τ)` (white-noise ΣΑΣ) | `white-noise-psd` | §6 | slide 47 | derived noise result, not printed |
| `F = SNR_in/SNR_out`, `F≥1` (noise figure) | `noise-figure` | §10 | (practical/βιομηχανία) | no NF on sheet |
| `T_e = (F−1)T_0`, `T_0=290 K` | `noise-figure` | §10 | (παράγωγο slide-44) | no NF/T_e on sheet |
| `T_total = T_antenna + T_e` | — | §10 | (παράγωγο) | derived, not on sheet |
| `N_0 ≈ −174 dBm/Hz` @290 K (noise floor) | — | §8 | (πρακτικό) | practical value, not on sheet |
| `P_N[dBm] = −174 + 10log B + F` (in-band noise floor) | — | §8/§10 | (πρακτικό) | engineering rule, not on sheet |
| Gaussian pdf `f_N(x)=(1/σ√2π)e^{−x²/2σ²}` | — (random) | §3 | slide 43 | probability formula; primary home `randomness/random-variables` |
| `k = 1.38×10⁻²³ J/K`, `T_0 = 290 K` (constants) | — | §3/§4 | slide 43/47 | must-remember **values**, not on sheet |

**Context-only (page explicitly states NOT examined in K21 — §9):** shot noise `S(f)=qI₀`;
flicker `S(f)∝1/f`; impulse noise (non-Gaussian); Planck/Nyquist `S(f)=hf/(e^{hf/kT}−1)`
(§8/§11). Off-sheet, but **low must-learn priority** — flag, don't over-treat.

### 2.2 `/noise/white-noise` — slides 46–50, 56

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `S_N(f) = N_0/2` (white PSD, δίψας όψεως) | `white-noise-psd` | §2 | slide 47 | no noise PSD on sheet **— ⚠ §10 wrongly tags it "✓ τυπολόγιο": flag F1** |
| `R_N(τ) = (N_0/2)δ(τ)` (white ΣΑΣ via W-K) | `white-noise-psd` | §2 | slide 47 | derived noise result |
| `S_N⁺(f) = N_0`, `f≥0` (one-sided PSD) | — | §10 | (σύμβαση) | not on sheet |
| `P_N = ∫ N_0/2 df = ∞` (infinite-power fact) | — | §3 | (παράδοξο) | conceptual must-know, not on sheet |
| `P_N = N_0 B` (bandlimited power) | — | §4α | (παραγωγή) | not on sheet |
| `R_N(τ) = N_0 B·sinc(2Bτ)` (bandlimited ΣΑΣ) | — | §4β | (αντίστρ. FT του rect) | not on sheet (rect↔sinc IS, the noise result is not) |
| `R_N(1/2B) = 0` (Nyquist-rate decorrelation) | — | §4γ | (sinc(1)=0) | not on sheet |
| AWGN = WSS + zero-mean + Gauss + flat PSD (label) | — | §7 | slide 50 | a definition/label, not a sheet formula |

### 2.3 `/noise/through-filters` — slides 36–40, 51–56 (richest page)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| **Master eq** `S_Y(f) = \|H(f)\|²·S_X(f)` | `lti-output-psd` | §2γ | slides 38–40 | not on sheet (§8στ flags must-learn, "high panic") |
| `P_Y = R_Y(0) = ∫ \|H(f)\|²·S_X(f) df` | `lti-output-psd` | §2γ | slide 40 | not on sheet |
| `R_Y(τ) = R_X(τ)∗h(τ)∗h(−τ)` (intermediate) | — | §2β | slide 39 | not on sheet |
| `P_Y = N_0 B` (white + ideal LPF) | — | §5 | (παραγωγή) | not on sheet |
| `R_Y(τ) = N_0 B·sinc(2Bτ)` (white + ideal LPF) | — | §5 | (αντίστρ. FT) | not on sheet |
| `\|H(f)\|² = 1/(1+(f/f_c)²)` (RC LPF) | — | §6 | (foundations/filters) | filter shape; noise application off-sheet |
| `S_Y(f) = (N_0/2)/(1+(f/f_c)²)` (RC Lorentzian PSD) | — | §6 | (master eq) | not on sheet |
| `P_Y = πN_0 f_c/2` (RC LPF power) | — | §6α | (arctan integral) | not on sheet — **and** its integral isn't either (flag F4) |
| `R_Y(τ) = (πN_0 f_c/2)·e^{−2πf_c\|τ\|}` (RC ΣΑΣ) | — | §6γ | (αντίστρ. FT Lorentzian) | not on sheet |
| `B_N = (1/\|H(0)\|²)∫₀^∞ \|H(f)\|² df`; `P_Y = N_0 B_N` (equivalent noise bandwidth) | — | §7 | (ορισμός) | not on sheet |
| `R_Y(τ) = N_0 W·cos(2πf_cτ)·sinc(Wτ)` (Άσκηση 8) | `bandpass-noise-r` | §8δ | slides 51–54 | not on sheet (§8στ flags must-learn) |
| `P_Y = N_0 W`, `σ²_Y = N_0 W` (Άσκηση 8) | `bandpass-noise-r` | §8δ/8ε | slides 54–55 | not on sheet |
| `\|H_total\|² = \|H_1\|²·\|H_2\|²` (cascade) | — | §10 | (master eq) | not on sheet |
| `\|H\|² = (2πf)²`, `S_Y = 2π²N_0 f²` (differentiator, FM teaser) | — | §11 | (master eq) | not on sheet |

### 2.4 `/noise/bandpass` — slides 51–56 + SE_session7&8 17–35

I/Q decomposition is grounded in the **canonical I/Q form** (`/modulation/bridge`, session
7&8 slides 17–35) applied to a *random* complex envelope; slide 54 is the `R_N` synthesis
anchor (NOT the I/Q form — see ROADMAP Standing notes). The deterministic I/Q id
`iq-decomposition` exists (`topic:'foundations'`); the *random-process* versions below have
no dedicated formulaId.

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `N(t) = N_I(t)cos(2πf_c t) − N_Q(t)sin(2πf_c t)` (I/Q, random) | (cf. `iq-decomposition`) | §1/§4 | session7&8 17–35 (applied) | no random-process / I/Q formula on sheet |
| `g_N(t) = N_I + jN_Q` (complex envelope) | — | §4 | session7&8 (applied) | not on sheet |
| `N(t)=R(t)cos(2πf_c t+Ψ(t))`, `R=√(N_I²+N_Q²)`, `Ψ=arctan(N_Q/N_I)` (polar) | — | §4 | session7&8 (applied) | not on sheet |
| `R_N(τ) = R_{N_I}(τ)cos(2πf_cτ) − R_{N_I N_Q}(τ)sin(2πf_cτ)` (general joint-WSS) | — | §5α | (παραγωγή) | not on sheet |
| joint-WSS conds: `R_{N_I}=R_{N_Q}`, `R_{N_Q N_I}(τ)=−R_{N_I N_Q}(τ)` | — | §5α | (παραγωγή) | not on sheet |
| `R_{N_I N_Q}(0)=0` (same-time uncorrelated) | — | §5β | (περιττή cross-corr) | not on sheet |
| symmetric spectrum ⇒ `R_{N_I N_Q}≡0` ⇒ independent | — | §5γ | (κανόνας) | not on sheet |
| `S_{N_I}=S_{N_Q}=S_N(f−f_c)+S_N(f+f_c)` (down-convert & fold) | — | §5δ | (παραγωγή) | not on sheet |
| Άσκηση-8 components: `S_{N_I}=N_0` (`\|f\|≤W/2`), `R_{N_I}=N_0 W·sinc(Wτ)` | — | §5δ/5ε | slide 54 (factored) | not on sheet |
| `P_N = P_{N_I} = P_{N_Q} = N_0 W` (equal powers) | — | §5ε | slides 54–55 | not on sheet |
| anchor `R_N(τ)=N_0 W·cos(2πf_cτ)·sinc(Wτ)`, `P_N=N_0 W` | `bandpass-noise-r` | §2/§5ε | slide 54 | not on sheet (same id as 2.3) |

Consequence distributions taught here (not sheet formulas, but must-know): AWGN envelope
`R(t)` ~ **Rayleigh**, phase `Ψ(t)` ~ **uniform** `[0,2π)` (§4).

### 2.5 `/noise/snr` — recap page (thin; pre-D11-rework, no slide numbers in SourceDoc)

The page pins no specific slides (SNR/dB are general definitions; the AM/FM results are
**recaps** whose primary teaching home is the am/fm chapters — noted in the last rows so
Pass B doesn't double-count their weight against this page).

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `SNR = P_signal/P_noise` | `snr` | §1 | (ορισμός) | no SNR on sheet |
| `SNR_dB = 10·log₁₀(SNR)` | `snr` | §1 | (ορισμός) | dB scale not on sheet |
| `SNR_in = P_{s,RF}/(N_0 B)` (input SNR) | — | §2 | (ορισμός) | not on sheet |
| `SNR_ref = P_{s,RF}/(N_0 W)` (reference SNR) | `fm-snr-ref` | §4 | (ορισμός) | not on sheet |
| `G_proc = SNR_out/SNR_in` (processing gain) | — | §3 | (ορισμός) | not on sheet |
| `SNR_out,AM = (μ²P_m/(2+μ²P_m))·SNR_ref` (recap) | `am-output-snr` | §5 | — | not on sheet; **primary home `am/modulator-demodulator`** |
| `SNR_out,FM = 3β²·SNR_ref` (recap) | `fm-snr-out` | §6 | — | not on sheet; **primary home `fm/in-noise`** |
| `S_n^out(f) = N_0 f²/A_c²` (triangular FM noise, recap) | `fm-noise-output-psd` | §6 | — | not on sheet; **primary home `fm/in-noise`** |
| `G_FM/AM = 9β²` (recap) | `fm-gain-am` | §6 | — | not on sheet; **primary home `fm/in-noise`** |

### 2.6 Imported must-learn formulas USED on the noise pages (taught upstream)

These are must-learn (off-sheet) and are **used** on the noise pages but **first taught**
in `randomness/*` (a prerequisite chapter). Listed for completeness so Pass C can decide
whether the must-learn callout should also fire where they are *used* in the noise chapter.
Their primary inventory home is the future `randomness` pass.

- **Wiener–Khinchin** `S_X(f)=F{R_X(τ)}`, `P_X=R_X(0)=∫S_X df` — `wiener-khinchin` — used
  `white-noise §2`, `through-filters §2γ/40`. (off-sheet)
- **WSS** `m_X=const`, `R_X(t₁,t₂)=R_X(τ)`; `R_X(0)=P_X`, `R_X(−τ)=R_X(τ)`,
  `\|R_X(τ)\|≤R_X(0)` — `wss`, `wss-rx-properties` — used throughout. (off-sheet)
- **Random-process mean / autocorrelation** `m_X=E[X(t)]`, `R_X(t₁,t₂)=E[X(t₁)X(t₂)]` —
  `random-mean`, `random-autocorr` — used in derivations. (off-sheet)

---

## 2.7 Pass A inventory — NOISE PROBLEMS (8 problems)

**Scope of this step (`mustlearn-inventory-noise-problems`).** The 8 `topic:'noise'`
problems in `content/practice/exercises.tsx` (located by id; companion coaching in
`content/practice/sose-coaching.tsx`). **Read-only** sweep; the only write is this doc.
Every on/off-sheet call REUSES the §1 ground-truth audit — no re-audit of
`slides/formulas.pdf`. No annotation of the problems (that is Pass C / the per-problem
rework), no weighting (Pass B), no touch to `formulas.tsx`.

The 8 problems (id → one-line): `proodos26-6` (white noise → ideal LPF, find power),
`sept25-th3-10` (thermal-noise PSD), `sept25-th3-11` (white noise → ideal LPF, find power),
`jan26-th1-3` (T/F: white noise ⇔ Gaussian), `jun25-th1-9` (thermal-noise PSD),
`jun25-th1-10` (white noise → LPF + HPF, **draw** spectra + autocorr), `pa25-th1-3` (T/F:
white ⇔ Gaussian), `pb25-th1-3` (T/F: thermal-noise PSD ⇔ Gaussian).

### Headline finding (problems)

> **Every formula used in the noise problems is off-sheet (must-learn)** — consistent with
> §1/§2 (the τυπολόγιο carries zero noise formulas). **5 of the 8** problems use must-learn
> formulas (`proodos26-6`, `sept25-th3-10`, `sept25-th3-11`, `jun25-th1-9`, `jun25-th1-10`);
> the other **3** (`jan26-th1-3`, `pa25-th1-3`, `pb25-th1-3`) are conceptual True/False
> problems on the "white/thermal noise ≠ Gaussian" trap that **write no formula at all** —
> so placement-(b) has nothing to attach to there. Stated explicitly so Pass C does **not**
> bolt a must-learn callout onto a formula-free problem.

### Per-problem must-learn formula instances

Each row = one must-learn formula instance in a problem; the off-sheet call is grounded in
§1; the cross-ref column links to the §2 theory row where the same formula was already
logged (so the two halves of the noise inventory are linked). `\|·\|` = magnitude bars.

| Problem | Must-learn formula (readable) | formulaId | Where used | Cross-ref (§2 theory) | Why not on sheet (§1) |
| --- | --- | --- | --- | --- | --- |
| `proodos26-6` | `S_n(f)=N_0/2` (white-noise PSD) | `white-noise-psd` | statement | §2.2 r1 / §2.1 | no noise PSD on sheet |
| `proodos26-6` | `S_y(f)=\|H(f)\|^2 S_n(f)` (PSD through LTI) | `lti-output-psd` | solution + coaching | §2.3 master eq | no PSD-through-LTI on sheet |
| `proodos26-6` | `P_y=∫_{-W}^{W}(N_0/2)df=N_0 W` (bandlimited power) | — (no id; F2) | solution + coaching | §2.2 §4α / §2.3 §5 | no noise-power formula on sheet |
| `sept25-th3-10` | `S_N(f)=N_0/2=kT/2` W/Hz (thermal PSD) | `thermal-noise` / `white-noise-psd` | solution + coaching | §2.1 (kT/2) / §2.2 | no thermal/PSD formula on sheet |
| `sept25-th3-10` | `P_N=N_0 B=kTB` (matched-load / band power) | `thermal-noise` | solution + coaching | §2.1 (kTW=kTB) | no noise-power formula on sheet |
| `sept25-th3-10` | `N_0≈4×10⁻²¹ W/Hz = −174 dBm/Hz` @290 K | — (no id; F2) | solution + coaching | §2.1 (−174 dBm/Hz) | practical value, not on sheet |
| `sept25-th3-11` | `S_Y(f)=\|H(f)\|^2 S_X(f)` (PSD through LTI) | `lti-output-psd` | solution | §2.3 master eq | no PSD-through-LTI on sheet |
| `sept25-th3-11` | `S_X(f)=N_0/2` (white-noise PSD) | `white-noise-psd` | solution | §2.2 r1 | no noise PSD on sheet |
| `sept25-th3-11` | `P_Y=∫_{-B}^{B}(N_0/2)df=N_0 B` (bandlimited power) | — (no id; F2) | solution + coaching | §2.2 §4α / §2.3 §5 | no noise-power formula on sheet |
| `jun25-th1-9` | `S_N(f)=N_0/2=kT/2` (thermal/white PSD) | `white-noise-psd` / `thermal-noise` | solution + coaching | §2.1 / §2.2 | no thermal/PSD formula on sheet |
| `jun25-th1-9` | `N_0≈−174 dBm/Hz` @290 K | — (no id; F2) | coaching | §2.1 | practical value, not on sheet |
| `jun25-th1-10` | `S_Y(f)=\|H(f)\|^2·(N_0/2)` (PSD through LTI, applied) | `lti-output-psd` / `white-noise-psd` | solution + coaching | §2.3 master eq | no PSD-through-LTI on sheet |
| `jun25-th1-10` | `R_Y(τ)=N_0 W·sinc(2Wτ)` (bandlimited-LPF ΣΑΣ) | — (no id; F2; **see F6**) | solution + coaching | §2.2 §4β / §2.3 §5 | rect↔sinc IS on sheet, the noise ΣΑΣ result is not |
| `jun25-th1-10` | `P_Y^{LPF}=N_0 W` (LPF output power) | — (no id; F2) | solution | §2.2 §4α / §2.3 §5 | no noise-power formula on sheet |

The 3 conceptual T/F problems (`jan26-th1-3`, `pa25-th1-3`, `pb25-th1-3`) contribute **no
rows** — they invoke the *labels* "white = flat PSD" and "Gaussian = amplitude
distribution" (cf. §2.2 "AWGN … (label)") but write no formula and carry no `formulaIds`.
See the judgment-call note below.

### Placement-(b) verification (owner hypothesis — VERIFY, not assert)

The owner (`bus/inbox/001` §2b) believes the explicit problem-side must-learn signal —
«⚠️ αυτόν τον τύπο πρέπει να τον ξέρεις απ' έξω — δεν δίνεται στο τυπολόγιο» — is currently
MISSING. Checked **each** problem's `solution` (exercises.tsx) AND its companion coaching
(sose-coaching.tsx) for (i) the **standardised** must-learn/τυπολόγιο callout, and (ii) any
**ad-hoc** "learn-by-heart" prose (which is *not* the standardised signal — it never names
the τυπολόγιο).

| Problem | Uses must-learn formula? | Standardised «δεν δίνεται στο τυπολόγιο» callout? | Ad-hoc "μάθε/ξέρε απέξω" prose? |
| --- | --- | --- | --- |
| `proodos26-6` | Yes | **NO** | No — coaching says «ξανασυναντιέται σε κάθε SNR άσκηση» (frequency, not τυπολόγιο) |
| `sept25-th3-10` | Yes | **NO** | Partial — coaching «−174 … το νούμερο που πρέπει να ξέρεις» (the dBm value, not the core formula; no τυπολόγιο ref) |
| `sept25-th3-11` | Yes | **NO** | No |
| `jan26-th1-3` | No (conceptual) | **NO** — N/A (no formula) | No |
| `jun25-th1-9` | Yes | **NO** | **Yes** — coaching «Είναι από τους τύπους που πρέπει να ξέρεις απέξω» (closest to the signal, but **no τυπολόγιο reference**) |
| `jun25-th1-10` | Yes | **NO** | No |
| `pa25-th1-3` | No (conceptual) | **NO** — N/A (no formula) | No |
| `pb25-th1-3` | No (conceptual) | **NO** — N/A (no formula) | No |

**Verification conclusion — hypothesis CONFIRMED (with one refinement).** The
**standardised** must-learn/τυπολόγιο callout (placement (b)) is **absent from all 8
problems**, in both the solution and the coaching. Refinement: placement-(b) is not a
total blank — **two coaching entries carry ad-hoc "learn-by-heart" prose** (`jun25-th1-9`:
«πρέπει να ξέρεις απέξω»; `sept25-th3-10`: the −174 dBm value «πρέπει να ξέρεις») — but
**neither names the τυπολόγιο**, so neither is the standardised signal the owner wants and
both are inconsistent with the rest. This mirrors the theory-side finding exactly (§2
placement-(a) observation / **F3**: through-filters §8στ is standardised, while
sources/bandpass/snr are ad-hoc). So the real gap on the problems side is twofold:
**(i)** the standardised "off the sheet" callout is universally missing, and **(ii)** where
any "learn this" awareness exists at all it is ad-hoc and un-anchored to the τυπολόγιο.
Pass C should propagate the §8στ wording («⚠️ Πρέπει να θυμάσαι (όχι στο επίσημο τυπολόγιο)»)
uniformly across the **5 formula-bearing problems** and leave the **3 conceptual problems**
untouched.

### Judgment calls & flags (this step)

- **Conceptual T/F problems use no formula — not a placement-(b) gap.** `jan26-th1-3`,
  `pa25-th1-3`, `pb25-th1-3` test the *distinction* white/thermal noise (flat PSD) vs
  Gaussian (amplitude distribution). They reference the white-noise *definition* as a label
  (cf. §2.2 "AWGN … (label)") but write no formula and carry no `formulaIds`. **Call:** they
  contribute no must-learn instance and need no placement-(b) callout — flagged rather than
  silently forcing a formula match. (Ambiguity admitted: if Pass C decides the *label*
  "white = flat PSD, N_0/2" itself deserves the must-learn treatment, these 3 would gain a
  conceptual callout — that is a Pass-C wording decision, not an inventory fact.)
- **F6 — `jun25-th1-10` `formulaId` mis-tag.** Its `formulaIds` includes `bandpass-noise-r`
  (canonical form `R_Y(τ)=N_0 W·sinc(Wτ)·cos(2πf_cτ)`, `formulas.tsx` L1227), but the
  problem has an **LPF (cutoff W) + HPF (cutoff 10W)** — *no* bandpass filter — and its
  solution derives the **bandlimited-LPF** autocorrelation `R_Y(τ)=N_0 W·sinc(2Wτ)` (no
  carrier factor; `sinc(2Wτ)`, not `sinc(Wτ)`). The tag is loose. Both forms are off-sheet,
  so this does **not** change the must-learn classification — it is a grounding/tagging note
  for Pass C, and it feeds **F2** (the bandlimited-LPF ΣΑΣ has no dedicated `formulaId`).
- **`jun25-th1-10` is a "Σχεδιάστε" (DRAW) problem with a text-only answer** (draw both
  output spectra + both time responses) → a prime bespoke-viz candidate for the Phase-2
  noise-exercise rework. Surfaced to the planner; not actioned in this read-only step.
- **Out-of-scope pointer (for the foundations must-learn pass), surfaced to the planner:**
  `pb25-th1-5` coaching (a `topic:'foundations'` problem, NOT noise) tells students the
  triangular-pulse `sinc²` envelope is «από τα standard Fourier pairs που πρέπει να ξέρεις
  απ' έξω» — but `fourier-pair-tri` **IS on the τυπολόγιο** (§1, sheet p.1), so that is the
  *inverse* error (telling them to memorise an on-sheet formula). Logged for the foundations
  inventory; not actioned here.

---

---

## 2B. Pass B — Noise-Chapter Weighting Results

> **Step:** `mustlearn-passb-noise-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §2 (noise chapter). Weight = count of distinct past-exam exercises that required the formula (either directly or as a key derivation step). References cite `exercises.tsx` problem IDs.

### Exam-paper audit

All theory exam papers available in `past_exams/` were visually audited (images + PDFs):

| Exam session | Files | Audit method |
| --- | --- | --- |
| Πρόοδος Απρίλιος 2026 | `προοδος_2026.jpg` | image read |
| Εξέταση Σεπτεμβρίου 2025 | `2025_sept_exam.jpg` | image read |
| Επι-πτυχίο Ιανουαρίου 2026 | `Epi-Ptyxio-Jan-26_1.jpg`, `_2.jpg` | image read (2 pp.) |
| Εξέταση Ιουνίου 2025 Team A | `Syst-Epik-June-2025.pdf` | PDF read (2 pp.) |
| Πρόοδος Α Μαΐου 2025 | `proodos_a1.jpg`, `proodos_a2.jpg` | image read |
| Πρόοδος Β Μαΐου 2025 | `proodos_b1.jpg`, `proodos_b2.jpg` | image read |
| Solutions compilation 2025 | `systepik-exams-solutions-ΤΗΕΜΑΤΑ-KANELOU.pdf` → copied to `kanelou-exams.pdf` (ASCII path); 23 pp. | PDF read; covers same six sessions above |
| MATLAB/lab exams (2023, 2020–21) | Various | Not audited — lab-only content |

**Coverage note:** No theory exam papers pre-2025 are available. The kanelou-exams compilation confirms the six exam sessions above are the full 2025 academic-year corpus. All 8 `topic:'noise'` exercises already in `exercises.tsx` were confirmed against the original papers. **No additional noise-formula problems were found outside `exercises.tsx`.** Cross-topic rule applied: one FM comparison problem (`sept25-th2-7`) explicitly invokes SNR formulas from §2.5 — counted where applicable.

---

### 2B.1 Core noise formulas (§2.1–§2.4)

#### `white-noise-psd` — S_N(f) = N₀/2 (flat PSD, bilateral)

**Weight: 5** ← highest in the noise chapter

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-6` | Proodos Απρίλιος 2026 · ΘΕΜΑ 6 | S_n(f) = N₀/2 stated as given; foundation for output-power calculation |
| `sept25-th3-10` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 3.10 | Answer to "what is the PSD of thermal noise N(t)?" — S_N = kT/2 = N₀/2 |
| `sept25-th3-11` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 3.11 | S_X = N₀/2 used with `lti-output-psd` to get P_Y = N₀B |
| `jun25-th1-9` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.9 | Answer to "what is the PSD of thermal noise?" — S_N = kT/2 = N₀/2 |
| `jun25-th1-10` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.10 | Refers to previous thermal noise (N₀/2); applied to draw LPF and HPF output spectra |

**Not counted (T/F only):** `jan26-th1-3`, `pa25-th1-3`, `pb25-th1-3` — these engage the *definition* "white = flat PSD, not Gaussian" but write no formula.

---

#### `lti-output-psd` — S_Y(f) = |H(f)|²·S_X(f)

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-6` | Proodos Απρίλιος 2026 · ΘΕΜΑ 6 | Ideal LPF → |H|²=1 for |f|≤W → S_Y = N₀/2 → P_Y = N₀W |
| `sept25-th3-11` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 3.11 | Ideal LPF → |H|²=1 for |f|≤B → P_Y = N₀B |
| `jun25-th1-10` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.10 | Applied to ideal LPF (f_c=W) AND ideal HPF (f_c=10W) to draw both output spectra |

**Not counted:** `sept25-th3-10` and `jun25-th1-9` ask only for the PSD of thermal noise (no filter present); `white-noise-psd` is the answer but `lti-output-psd` is not invoked.

---

#### `thermal-noise` — S_N(f) = kT/2 W/Hz; P_N = kTB = N₀·B

**Weight: 2**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th3-10` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 3.10 | Explicitly asked: "what is the PSD of thermal noise N(t)?"; answer: S_N = kT/2 = N₀/2 where N₀ = kT; full-band power P_N = N₀B = kTB |
| `jun25-th1-9` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.9 | Same question, identical answer |

**Note:** `pb25-th1-3` asks whether thermal noise has a Gaussian amplitude distribution (T/F) — conceptual only, no formula. Same thermal-noise question repeated in two exam sessions (September and June), confirming it is a standard pattern.

---

#### `wiener-khinchin` — R_X(τ) = F⁻¹{S_X(f)}; S_X(f) = F{R_X(τ)}

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-6` | Proodos Απρίλιος 2026 · ΘΕΜΑ 6 | Power consequence P_Y = R_Y(0) = ∫S_Y(f)df: integrates N₀/2 over [−W,W] to get N₀W |
| `sept25-th3-11` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 3.11 | Power consequence: P_Y = ∫S_Y df = N₀B |
| `jun25-th1-10` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.10 | **Full inverse FT required**: part 2 asks "σχεδιάστε την χρονική απόκριση" → R_LP(τ) = N₀·sin(2πWτ)/(2πτ) = N₀W·sinc(2Wτ) via explicit inverse FT; also uses power consequence for both filters |

**Counting rationale:** P_Y = R_Y(0) = ∫S_Y df is the Wiener–Khinchin theorem evaluated at τ=0. Problems that compute output power from output PSD invoke this (proodos26-6, sept25-th3-11). The full forward + inverse FT apparatus is explicitly required only in jun25-th1-10. Problems that only quote the PSD value (sept25-th3-10, jun25-th1-9) do not invoke W-K.

---

#### `bandpass-noise-r` — R_Y(τ) = N₀·W·sinc(Wτ)·cos(2πf_c τ)

**Weight: 0**

**Finding:** No available past-exam exercise explicitly derives or requires the bandpass noise autocorrelation. Exercise `jun25-th1-10` carries `bandpass-noise-r` in its `formulaIds` but this is the confirmed **F6 mis-tag** (§2.7): that problem uses LPF + HPF (no bandpass filter), and its solution derives R_LP = N₀W·sinc(2Wτ) with **no carrier factor**. The bandpass formula is not invoked anywhere in the exercise.

**Pass C note:** Zero exam weight ≠ unimportant — the formula is taught and flagged must-learn in `through-filters §8στ`. Pass C should retain the must-learn callout but set exam-weight = 0 (from available bank) with a note that this formula is examined through theory exercises (§8δ/§8ε) rather than standalone past-exam problems in the current bank.

---

### 2B.2 SNR formulas (§2.5 — many are recaps; primary homes noted)

#### `snr` — SNR = P_signal/P_noise; SNR_dB = 10·log₁₀(SNR)

**Weight: 0**

No past-exam exercise asks a student to compute the basic P_s/P_n ratio from first principles. The SNR definition underlies all noise analysis but is not the operationally demanded formula in any of the 8 noise problems (which focus on PSD and power calculations).

---

#### `fm-snr-ref` — SNR_ref = P_{s,RF}/(N₀W) = A_c²/(2N₀W)

**Weight: 1** (cross-topic: FM problem invoking noise chapter formula)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | Implicit anchor behind both SNR_out,FM = 3β²·SNR_ref and SNR_out,AM = η·SNR_ref; the qualitative comparison table requires knowing SNR_ref as the common baseline |

---

#### `am-output-snr` — SNR_out,AM = η·SNR_ref (primary home: `am/modulator-demodulator`)

**Weight: 1** (cross-topic)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | Referenced in FM-vs-AM comparison: AM column states SNR gain ~ μ² (= η-form of SNR_out,AM) |

---

#### `fm-snr-out` — SNR_out,FM = 3β²·SNR_ref (primary home: `fm/in-noise`)

**Weight: 1** (cross-topic)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | Explicitly quoted: "FM output SNR gain = 3β²"; FM column in comparison table |

---

#### `fm-gain-am` — G_FM/AM = 9β² (primary home: `fm/in-noise`)

**Weight: 1** (cross-topic)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | Explicitly quoted: "FM gain over AM = 9β²"; example β=5 → 225-fold = 23.5 dB |

---

#### `fm-noise-output-psd` — S_n^out(f) = N₀f²/A_c² (triangular noise after FM discriminator)

**Weight: 0**

Not explicitly derived or required in any available past-exam exercise. The result 3β²·SNR_ref in `sept25-th2-7` presupposes this triangular-noise PSD in its derivation, but the qualitative comparison problem does not invoke the triangular-noise formula directly.

---

#### `noise-figure` — F = SNR_in/SNR_out; T_e = (F−1)·T₀

**Weight: 0** — not required in any available past-exam exercise.

#### `snr-input` — SNR_in = P_{s,RF}/(N₀·B)

**Weight: 0** — not directly tested; no past-exam problem computes input SNR from given parameters.

#### Processing gain — G_proc = SNR_out/SNR_in

**Weight: 0** — same: taught in theory but no past-exam problem directly requires computing G_proc.

---

### 2B.3 No-formulaId entries (§2.1–§2.3 F2 category)

These formulas are must-learn (off-sheet) but have no dedicated `formulaId` in `formulas.tsx`. Weighted here for Pass C planning.

| Formula | Weight | Exercises | Note |
| --- | --- | --- | --- |
| **P_N = N₀B** (bandlimited white-noise power) | **5** | proodos26-6, sept25-th3-10, sept25-th3-11, jun25-th1-9, jun25-th1-10 | **`bandlimited-noise-power`** (CREATED step mustlearn-passc-noise-f2-entries; all 5 cards tagged; F2(1) RESOLVED) |
| **N₀ ≈ −174 dBm/Hz @ 290 K** (noise floor value, no id) | **2** | sept25-th3-10 (coaching), jun25-th1-9 (coaching) | PAGE-ONLY per principal decision 0001 — annotated into thermal-noise callouts; no /formulas row |
| **R_N(τ) = N₀B·sinc(2Bτ)** (LPF autocorrelation) | **1** | jun25-th1-10 (explicit R_LP derivation in part 2) | **`bandlimited-noise-autocorr`** (CREATED step mustlearn-passc-noise-f2-entries; jun25-th1-10 tagged; F4/F6 RESOLVED; `bandpass-noise-r` dropped from jun25-th1-10) |
| S_N⁺(f) = N₀, f≥0 (one-sided PSD convention) | 0 | — | Taught in §2.2 but no exam tests the notation distinction |
| B_N (equivalent noise bandwidth) | 0 | — | Taught in through-filters §7; no past-exam derivation |
| P_Y = πN₀f_c/2 (RC LPF power integral) | 0 | — | RC application in through-filters §6; no past-exam |
| R_Y(τ) = (πN₀f_c/2)·e^{−2πf_c\|τ\|} (RC ΣΑΣ) | 0 | — | Same as above |

---

### 2B.4 Ranked summary — noise chapter Pass B

**Ordered by weight (descending), with formulaId and Pass C priority:**

| Rank | Formula | formulaId | Weight | Pass C priority |
| --- | --- | --- | --- | --- |
| 1 | S_N(f) = N₀/2 (white-noise PSD) | `white-noise-psd` | **5** | HIGH — universal, wrong callout on `white-noise` §10 (F1) |
| 1 | P_N = N₀B (bandlimited power) | `bandlimited-noise-power` | **5** | HIGH — F2(1) RESOLVED; all 5 power-computation cards tagged |
| 3 | S_Y = \|H\|²·S_X (LTI output PSD) | `lti-output-psd` | **3** | **PASS-C DONE** — §8στ upgraded to weighted callout + all 3 cards extended with weight+refs |
| 3 | R_X(τ) ↔ S_X(f) (Wiener–Khinchin) | `wiener-khinchin` | **3** | **PASS-C DONE** — warning callout added to `randomness/psd` §2 + all 3 cards tagged, getCitedExercises=3 |
| 5 | S_N = kT/2, P_N = kTB (thermal noise) | `thermal-noise` | **2** | **PASS-C DONE** — `sources` §5 callout + 2 card notes extended (thermal triple) |
| 5 | N₀ ≈ −174 dBm/Hz (noise floor) | — | **2** | **PASS-C DONE (PAGE-ONLY)** — `sources` §8 callout + coaching cards + annotated in `thermal-noise` row |
| 7 | fm-snr-ref, am-output-snr, fm-snr-out, fm-gain-am | various | **1 each** | MEDIUM — cross-topic; primary homes are `fm/in-noise` + `am/mod-demod`; must-learn callout missing from all |
| 8 | R_N = N₀B·sinc(2Bτ) (LPF autocorrelation) | `bandlimited-noise-autocorr` | **1** | MEDIUM — F4/F6 RESOLVED; jun25-th1-10 tagged; derivedIn: noise/white-noise |
| 9 | bandpass-noise-r, noise-figure, fm-noise-output-psd, snr, snr-input, G_proc, RC results, B_N | various | **0** | LOWER — must-learn but zero exam weight in current bank; flag as must-learn without high-weight badge |

---

## 3. Pass A inventory — FOUNDATIONS chapter (theory §3.1–§3.5; problems §3.6)

**Scope.** Six theory pages in `app/(content)/foundations/`: `signals`, `systems`, `fourier-series`,
`fourier-transform`, `signal-transformations`, and `filters`. Plus all `topic:'foundations'` problems
in `content/practice/exercises.tsx` (22 problems) and their companion coaching in `sose-coaching.tsx`.

**Method / grounding note.** Pages `signals` and `systems` read directly. The `fourier-series` and
`fourier-transform` page formulas inferred from `content/practice/formulas.tsx` (`derivedIn` fields)
and problem `formulaIds`. `signal-transformations` and `filters` exist but were not read directly —
see flag **F10**. All on/off-sheet calls grounded in §1 ground-truth audit. This step did **not**
re-audit `slides/formulas.pdf`.

### Headline finding (split: NOT uniformly must-learn)

> Unlike the noise chapter (100% must-learn), the foundations chapter has a **critical split**: the
> **Fourier pairs and properties** that dominate exam problems (rect↔T·sinc, tri↔T·sinc², cos/sin
> pairs, duality, scaling, shift, convolution, modulation theorem) are ALL **on the sheet** (§1 p.1).
> The **structural formulas** — energy/power/RMS, convolution, frequency response, Fourier *series*
> (entirely off-sheet), general Parseval, periodicity conditions, and the I/Q canonical form — are
> **all off-sheet (must-learn)**. This split is non-obvious and is the source of the inverse errors
> in §3.7.

### Placement-(a) status on the theory pages

Inconsistent across the chapter:

- `foundations/signals` does it **correctly** for I/Q (line 341: «ΔΕΝ είναι μέσα στο επίσημο
  τυπολόγιο») and even/odd (line 492: same wording). Other must-learn formulas (energy, power,
  δ sifting, periodicity) are derived/presented without any τυπολόγιο flag.
- `foundations/systems`, `foundations/fourier-series`, `foundations/fourier-transform`:
  not directly checked for callout wording — assumed inconsistent based on site-wide pattern.
- `modulation/bridge`: canonical I/Q form **incorrectly labeled "✓ Στο τυπολόγιο"** (page line
  275) — inverse error, see flag **F7** below and §3.7.

### 3.1 `foundations/signals` — slides 1–35 (SE_session3_theory1_2025.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `E_x = ∫\|x(t)\|² dt` (signal energy) | `signal-energy` | §7α | slide 21 | no energy formula on sheet |
| `P_x = lim(1/2T)∫_{-T}^{T}\|x(t)\|² dt` (signal power) | `signal-power` | §7β | slide 21 | no power formula on sheet |
| `P = A²/2` for `A·cos(2πf_c t + φ)` | `cos-power-half` | §7ε | slide 23 | derived from trig, not printed |
| `R_x^DC = lim(1/2T)∫x dt`; `R_x^RMS = √P_x` | `dc-rms` | §7δ | slide 26 | not on sheet |
| `x_e = (x + x(-t))/2`, `x_o = (x − x(-t))/2` (even/odd) | `even-odd-decomposition` | §8β | slide 18 | page says «ΔΕΝ μέσα στο τυπολόγιο» |
| `∫x(t)δ(t−t₀)dt = x(t₀)` (sifting property) | `delta-sifting` | §4δ | slides 30–33 | not on sheet |
| `δ(−t)=δ(t)`, `δ(at)=(1/\|a\|)δ(t)`, `∫δ dt=1` | `delta-properties` | §4δ | slide 33 | not on sheet |
| `cos(ωn) periodic ↔ 2π/ω ∈ ℚ, integer N` | `discrete-periodic-condition` | §9β | slides 11–12 | not on sheet |
| `T₁/T₂ ∈ ℚ → sum of cosines periodic` | `continuous-periodic-condition` | §9α | slide 10 | not on sheet |
| `x = x_I cos(2πf_c t) − x_Q sin(2πf_c t)` (I/Q canonical) | `iq-decomposition` | §5γ | slide 16 | page says «ΔΕΝ μέσα στο τυπολόγιο»; inTypology: false |

**On-sheet formulas referenced in the signals page (no must-learn callout needed):**
`δ(t)↔1`, `1↔δ(f)`, `e^{±j2πf₀t}↔δ(f∓f₀)` — slide 34 previews these as "θα δεις στο τυπολόγιο".
Rect and triangle pulse definitions (Π, Λ) are on sheet; their FT pairs are on sheet.

### 3.2 `foundations/systems` — slides 3–20 (SE_session4_theory2_2025.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `y(t) = x(t)∗h(t) = ∫x(τ)h(t−τ)dτ` (convolution definition) | `convolution-definition` | §3/§4 | slide 4 | convolution pairs are on sheet; the time-domain definition integral is not |
| Cascade: `h_eff=h₁∗h₂`; parallel: `h₁+h₂`; identity: `x∗δ=x` | `convolution-properties` | §5 | slide 7 | not on sheet |
| `H(f₀) = ∫h(τ)e^{−j2πf₀τ}dτ` (frequency-response definition) | `lti-frequency-response` | §6γ | slides 16–18 | not on sheet |
| `y(t) = H(f₀)·x(t)` for complex-exp input (eigenfunction property) | `lti-eigenfunction` | §6γ | slides 16–18 | not on sheet |
| `y = \|H(f₀)\|A·cos(2πf₀t+φ+∠H)` (LTI cosine corollary) | `lti-cosine-response` | §6δ | (derived) | not on sheet |
| BIBO: `∫\|h(t)\|dt < ∞` | `bibo-stability` | §2β | (background) | not on sheet |

**On-sheet formulas used in systems page:** convolution theorem `x∗h ↔ XH` and
multiplication–convolution dual `xh ↔ X∗H` are on sheet (§1 p.1) — these are the Fourier-domain
form. The time-domain definition `∫x(τ)h(t−τ)dτ` is not.

### 3.3 `foundations/fourier-series` — (FS deck, session3/4 area)

> **The entire Fourier-series chapter is must-learn.** The τυπολόγιο has **no** Fourier *series*
> formulas — it has only Fourier *transform* pairs/properties (§1 p.1). FS synthesis, analysis,
> Parseval, orthogonality, conjugate symmetry, and the LTI-output-for-periodic result are all off-sheet.

| Must-learn formula (readable) | formulaId | Why not on sheet |
| --- | --- | --- |
| `x(t) = Σ aₖ e^{j2πkf₀t}` (synthesis) | `fourier-series-synthesis` | no FS on sheet |
| `aₖ = (1/T₀)∫x(t)e^{−j2πkf₀t}dt` (analysis) | `fourier-series-analysis` | no FS on sheet |
| Real/cosine form: `x = a₀ + 2Σ\|aₖ\|cos(2πkf₀t + ∠aₖ)`, `k≥1` | `fourier-series-dual-form` | no FS on sheet |
| Orthogonality: `(1/T₀)∫e^{j2πkf₀t}e^{−j2πmf₀t}dt = δ_{k,m}` | `fourier-orthogonality` | not on sheet |
| Conjugate symmetry: `a_{−k} = aₖ*` for real x(t) | `fourier-series-conjugate-symmetry` | not on sheet |
| Square-wave aₖ: `aₖ = (Aτ/T₀)sinc(kf₀τ)` | `fourier-series-rect-pulse` | specific result; not on sheet |
| LTI output for periodic input: `bₖ = H(kf₀)·aₖ` | `lti-output-fourier-series` | not on sheet |
| FS Parseval: `P_x = Σ\|aₖ\|² = Σ Aₖ²/2` (power via FS) | `parseval-power` | not on sheet |

### 3.4 `foundations/fourier-transform` — (FT properties deck)

Most FT content is **on the sheet** (§1 p.1 covers the full pairs/properties table). Must-learn
contributions from this page:

| Must-learn formula (readable) | formulaId | Why not on sheet |
| --- | --- | --- |
| General Parseval: `∫\|x(t)\|²dt = ∫\|X(f)\|²df` | `parseval` | Sheet prints only Hilbert energy equality (§1 edge call) — not the general FT version; `parseval` is `inTypology: false` |
| FT definition: `X(f) = ∫x(t)e^{−j2πft}dt`; inverse `x = ∫X(f)e^{j2πft}df` | (**uncertain** — see F11) | Sheet gives only the pairs table, not the definition integrals explicitly — **FLAGGED** |

**On-sheet formulas dominate this page:** all pairs and properties listed in §1 p.1 are on the
sheet — duality, scaling, shift, modulation theorem, convolution/multiplication, differentiation,
integration, and all standard pairs (rect, tri, cos, sin, δ, 1). No must-learn callout needed.

### 3.5 Unread pages — flag F10

`foundations/signal-transformations` and `foundations/filters` exist but were not read directly.
Assessment from indirect evidence:
- **`signal-transformations`**: covers x(at+b) combination rules. These operations derive from the
  on-sheet FT properties (scaling, shift) → likely zero new must-learn formulas. Verify in Pass C.
- **`foundations/filters`**: covers ideal LPF/HPF/BPF and RC filter shape |H(f)|²=1/(1+(f/f_c)²).
  Filter shapes are not on the sheet — already logged in §2.3 (noise/through-filters §6). Verify
  no additional must-learn entries in Pass C.

---

### 3.6 Foundations problems — placement-(b) verification (22 problems)

**ON-SHEET formulaIds** (no must-learn callout needed):
`fourier-pair-rect`, `fourier-pair-tri`, `fourier-pair-cos`, `fourier-pair-sin`,
`fourier-convolution`, `fourier-modulation-theorem`, `fourier-shift` — all §1 p.1 on-sheet
pairs/properties. Problems whose formulaIds consist entirely of these need no placement-(b) work.

**OFF-SHEET formulaIds** (must-learn callout needed — placement-(b) gap):

| Problem IDs | Must-learn formulaId | Coaching callout status |
| --- | --- | --- |
| pa25-th2-4, pa25-th2-9, pb25-th2-4, pb25-th2-9, jan26-th2-4, and others | `parseval-power` (P = Σ Aₖ²/2, power of tone sums) | **ABSENT** — grep of `sose-coaching.tsx` for "parseval" and "τυπολόγιο": **zero matches** |
| jan26-th2-5, pa25-th2-5 ("Φάσμα πλάτους και ισχύς for sin+sinc") | `parseval-power` | **ABSENT** — same |

**Placement-(b) conclusion:** The standardized «δεν δίνεται στο τυπολόγιο» callout for
`parseval-power` is **absent from all foundations problem coaching**. Unlike the noise problems
(which had at least some ad-hoc "learn-by-heart" prose), the foundations problem coaching has
**zero awareness** of the must-learn status for this formula family. Clean gap for Pass C.

**Note — on-sheet problems with coaching inverse error:** Problems `pa25-th1-5` and `pb25-th1-5`
use `fourier-pair-tri` (ON-SHEET) — no must-learn callout is appropriate — but their coaching
wrongly tells students to memorize an on-sheet formula. See flag **F8**.

---

### 3.7 Inverse errors (foundations chapter)

Two inverse-error discoveries confirmed this step (inverse of F1 — a formula that IS on the sheet,
but the site tells students to memorize it):

- **F8** — `pb25-th1-5` and `pa25-th1-5` coaching says sinc² envelope «πρέπει να ξέρεις απ' έξω»,
  but `fourier-pair-tri` IS on the sheet (see §6 below for full description).
- **F7** — `modulation/bridge` line 275 labels the canonical I/Q form "✓ Στο τυπολόγιο" when it
  is NOT on the sheet (see §6 below for full description).

---

## 4. Pass A inventory — RANDOMNESS chapter (theory §4.1; problems §4.2)

**Scope.** This batch covers `randomness/why` only (the introductory/vocabulary page). Remaining
randomness pages (`random-variables`, `random-processes`, `stationarity`, `psd`) are deferred to
later Pass-A steps. Problems: the 2 `topic:'random'` problems in `exercises.tsx`.

**Method.** Page read directly. All on/off-sheet calls from §1 (τυπολόγιο has **zero** random-process
or PSD formulas — the entire randomness chapter is must-learn). FormulaIds `random-mean`,
`random-autocorr`, `random-cross`, `random-phase-cosine`, `wss` are all `inTypology: false`
(consistent with §1). This step did **not** re-audit `slides/formulas.pdf`.

### Headline finding

> **The entire randomness chapter is must-learn.** Not a single formula taught on the randomness
> pages appears on the τυπολόγιο (consistent with §1: the sheet is purely Fourier/Hilbert/trig/
> integral). `randomness/why` is a vocabulary/motivation page — its must-learn formulas are
> definitions (mean, autocorrelation, WSS conditions) that appear verbatim in exam questions
> («υπολογίστε E[X(t)]», «δείξτε ότι η ΤΔ είναι WSS», «R_X(0) = ?»).

### Placement-(a) status

`randomness/why` uses no standardized «δεν δίνεται στο τυπολόγιο» callout. The vocabulary table
(§5) introduces notation as definitions without a must-memorize flag — appropriate for a motivation
page, but the downstream pages (`random-processes`, `stationarity`, `psd`) should carry the standard
callout. Deferred to those pages' Pass-A steps; Pass C can add it to the two lecture problems.

### 4.1 `randomness/why` — slide 6 + 30 (SE_session9_random1_upload.pdf, 40 slides)

| Must-learn formula / definition | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `m_X(t) = E[X(t)] = ∫a·f_{X(t)}(a)da` (mean / μέση τιμή) | `random-mean` | §4 | (ορισμός) | no random-process formula on sheet |
| `R_X(t₁,t₂) = E[X(t₁)X(t₂)]` (autocorrelation / ΣΑΣ) | `random-autocorr` | §5 | (ορισμός) | not on sheet |
| `R_{X,Y}(t₁,t₂) = E[X(t₁)Y(t₂)]` (cross-correlation / ΕΣ) | `random-cross` | §5 | (ορισμός) | not on sheet |
| WSS: `m_X = const` AND `R_X(t₁,t₂) = R_X(τ)` where `τ = t₁−t₂` | `wss` | §5/§6 | (ορισμός) | not on sheet |
| Ergodicity (label): time-average = ensemble-average (for WSS, in ΣΕ) | (within `wss`) | §6 | slide 30 | convention/label — must-know, not a printable formula |
| PSD: `S_X(f) = F{R_X(τ)}` (motivation/forward-look; primary home `randomness/psd`) | `wiener-khinchin` | §7 teaser | (upcoming) | not on sheet; same family as §2.6 |
| `P_X = R_X(0) = ∫S_X(f)df` (forward-look; primary home `randomness/psd`) | `wss-rx-properties` | §7 teaser | (upcoming) | not on sheet; already in §2.6 |

**Context-only (mentioned as motivation, not examined directly from this page):**
`S_Y = S_X\|H\|²` — primary teaching home `noise/through-filters` + `randomness/psd` (already in §2.3).
Autocovariance `C_X = R_X − m_X²` — defined in vocab table; appears in `lec-rp-1` but primary
derivation home in `randomness/random-processes`.

### 4.2 Randomness problems — placement-(b) verification (2 problems)

| Problem | Must-learn formulaIds | Standardized callout? | Ad-hoc awareness? |
| --- | --- | --- | --- |
| `lec-rp-1` (joint statistics — lecture) | `random-mean`, `random-autocorr`, `random-cross` | **NO** | No (lecture origin; minimal coaching) |
| `lec-rp-2` (ergodicity random-phase cosine — lecture) | `random-phase-cosine`, `wss` | **NO** | No (lecture origin; same) |

**Conclusion:** Both problems are lecture-origin (not past-exam). The standardized callout is absent
— consistent with the site-wide pattern from noise. Priority for Pass C is lower than past-exam
problems; add callout when those pages are reworked.

---

## 5. Pass A inventory — MODULATION BRIDGE (`modulation/bridge`)

**Scope.** Single page `app/(content)/modulation/bridge/page.mdx`. No `topic:'bridge'` problems
in `exercises.tsx`; bridge concepts appear embedded in AM/FM/SSB problem `formulaIds` (those
belong to their respective chapter inventories). Source: SE_session7&8_theory_2025.pdf slides 17–35;
SE_session11&12&13.pdf slides 1–9.

### Headline finding (mixed: Hilbert ON sheet; everything built on it is must-learn)

> The **Hilbert transform definition** and its **Fourier-domain property** are both on the sheet
> (§1 p.2). Everything built on them — pre-envelope, complex envelope, canonical I/Q form, polar
> envelope/phase, and the X(f)↔G(f) bandpass-spectrum relation — is **must-learn**. One inverse
> error discovered (F7): the canonical I/Q form is labeled "✓ Στο τυπολόγιο" on the bridge page
> when it is NOT on the sheet.

### 5.1 `modulation/bridge` formula table

| Formula | formulaId | On-sheet? | Slide cite | Note |
| --- | --- | --- | --- | --- |
| Hilbert def: `x̂ = x∗(1/πt) = (1/π)∫x(τ)/(t−τ)dτ` | `hilbert` | **YES** (§1 p.2) | slide 17 | Correctly labeled "✓ Στο τυπολόγιο" in page (§3 intro) |
| Hilbert/Fourier: `F{x̂(t)} = −j·sgn(f)·X(f)` | `hilbert` | **YES** (§1 p.2) | slide 18 | Correctly labeled "✓ Στο τυπολόγιο" in page |
| Hilbert pairs: cos→sin, sin→−cos, e^{jt}→−je^{jt}, x(t−t₀)→x̂(t−t₀), x(αt)→sgn(α)x̂(αt) | (within `hilbert`) | **YES** (§1 p.2 Hilbert pairs table) | slide 18 | On sheet — all listed in §1 |
| Exotic Hilbert pairs: `Π(t)→(1/π)log\|(2t+1)/(2t−1)\|`; `sinc(t)→(1−cos πt)/(πt)` | — | **NO** (not in §1 p.2) | slide 18 | Must-learn for SSB/bandpass applications; no formulaId in exercises |
| Pre-envelope: `x_p(t) = x(t) + j·x̂(t)` | — | **NO** | slides 19–22 | Not on sheet; no formulaId in exercises |
| Complex envelope: `g(t) = x_p(t)·e^{−j2πf_c t}` | — | **NO** | slides 24–28 | Not on sheet; no formulaId in exercises |
| `x(t) = Re{g(t)·e^{j2πf_c t}}` (from complex envelope) | — | **NO** | slides 28–29 | Not on sheet |
| Canonical I/Q: `x = x_I cos(2πf_c t) − x_Q sin(2πf_c t)` | `iq-decomposition` | **NO** (`inTypology: false`) | slide 30 | **F7 — inverse error**: page line 275 labels this "✓ Στο τυπολόγιο" |
| Envelope + phase: `V = √(x_I²+x_Q²)`, `θ = arctan(x_Q/x_I)` | (within `iq-decomposition`) | **NO** | slide 30 | Not on sheet |
| Bandpass spectrum: `X(f) = ½[G(f−f_c) + G*(−f−f_c)]` | — | **NO** | slides 34–35 | Not on sheet; no dedicated formulaId |
| Five-modulation table: AM→`x_I=A_c+m, x_Q=0`; DSB→`x_I=m, x_Q=0`; SSB→`x_I=m/2, x_Q=∓m̂/2`; FM→`x_I=A_c cosφ, x_Q=−A_c sinφ`; PM→`x_I=A_c cos(k_p m), x_Q=−A_c sin(k_p m)` | (per-scheme formulaIds in AM/FM chapters) | **NO** | slide 32 | Must-learn; each row's formulaId lives in respective chapter |

**Placement-(a) status:** Hilbert formulas correctly labeled on-sheet. Canonical I/Q form (line 275)
incorrectly labeled — inverse error F7. Pre-envelope, complex envelope, bandpass spectrum carry no
must-learn callout (oversight; add in Pass C when this page is reworked).

---

## 6. Pass A inventory — AM chapter (theory §6.1–§6.7; problems §6.8)

**Scope.** All 7 theory pages in `app/(content)/am/`: `overview`, `conventional`, `dsb-sc`, `ssb`,
`vsb`, `multiplexing`, `modulator-demodulator`. Plus all `topic:'am'` problems in
`content/practice/exercises.tsx` (~20 problems) and their companion coaching in `sose-coaching.tsx`.

**Method / grounding note.** Pages read directly. All on/off-sheet calls from §1 ground-truth
(τυπολόγιο has **zero AM formulas** — the entire AM chapter is must-learn, with the sole
exception of the Hilbert transform definition and its Fourier relation, which ARE on the sheet).
This step did **not** re-audit `slides/formulas.pdf`.

### Headline finding

> **The entire AM chapter is must-learn.** Not a single AM-specific formula taught on the 7 theory
> pages appears on the τυπολόγιο (consistent with §1: the sheet is purely Fourier-pair/property +
> Hilbert + trig/integral/Bessel). The sole exception is the Hilbert transform (`hilbert` id), which
> IS on the sheet and is correctly labeled as such on the `ssb` and `bridge` pages. Every
> AM-specific formula — signal forms, modulation index, bandwidth, power, efficiency, envelope
> detector conditions, FDM spacing, SNR — is must-learn.

### Placement-(a) status on theory pages

Inconsistent, but better than noise (§2 observation):

- `am/conventional §2` explicitly labels μ: «✓ Ορίζεται μέσα στη Conventional AM (όχι στο
  τυπολόγιο)» and the ThinkingPattern labels P_AM: «πρέπει να θυμάσαι, όχι μέσα στο τυπολόγιο».
  **Two formulas carry standardized callouts.**
- `am/dsb-sc §5a` explicitly labels P_DSB: «(⚠️ «πρέπει να θυμάσαι» — δεν είναι μέσα στο
  επίσημο τυπολόγιο)». **One formula standardized.**
- `am/modulator-demodulator §2b` labels envelope-detector-rc: «⚠️ Πρέπει να θυμάσαι». **One
  formula standardized.**
- `am/ssb`, `am/vsb`, `am/multiplexing`, `am/overview`: **no standardized must-learn callouts**
  found for any formula.

### 6.1 `/am/overview` — slides 1–9 (SE_session11&12&13.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `x_{AM}(t) = [A_c + m(t)]cos(2πf_c t)` (basic AM, conceptual intro) | `am-signal` | §2 | slide 6 | no AM signal formula on sheet |
| `B_{AM} = B_{DSB-SC} = 2W`, `B_{SSB} = W` (bandwidth overview) | `am-bandwidth` | §3 | slide 9 | no AM bandwidth on sheet |
| η ≤ 33% (intro mention; primary detail in §6.2) | `am-eta` | §3 | slide 9 | no AM efficiency on sheet |

**On-sheet formulas used here:** modulation theorem `x(t)cos ↔ ½[X(f-fc)+X(f+fc)]` — on sheet
(`fourier-modulation-theorem`). FT cosine/sine pairs — on sheet.

### 6.2 `/am/conventional` — slides 10–32

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `x(t) = [A_c + m(t)]cos(2πf_c t)` | `am-signal` | §1 | slide 10 | no AM signal on sheet — **line 116 explicitly "όχι στο τυπολόγιο"** |
| `μ = \|min m(t)\|/A_c`; single-tone: `μ = A_m/A_c` | `am-mu` | §2 | slides 16–18 | no modulation index on sheet |
| `X_AM(f) = (A_c/2)[δ(f∓f_c)] + ½[M(f∓f_c)]` | `am-spectrum` | §4 | slides 26–27 | no AM spectrum on sheet |
| `BW = 2W` | `am-bandwidth` | §4b | slide 27 | not on sheet |
| `P_c = A_c²/2` | (part of `am-power`) | §5a | slide 29 | not on sheet |
| `P_sb = μ²A_c²/8` (one sideband); `2P_sb = μ²A_c²/4` | (part of `am-power`) | §5b–5c | slides 29–31 | not on sheet |
| `P_total = (A_c²/2)(1 + μ²/2)` (single-tone compact) | `am-power` | §5c | slide 31 | not on sheet |
| `P_AM = A_c²/2 + P_m/2` (general, zero-mean m) | `am-power` | §5cγ | slides 29–31 | not on sheet — **ThinkingPattern "πρέπει να θυμάσαι, όχι μέσα στο τυπολόγιο"** |
| `η = P_m/(A_c²+P_m)` (general); `= μ²/(2+μ²) ≤ 1/3` (single-tone) | `am-eta` | §5d | slide 31 | not on sheet |

**On-sheet formulas used:** modulation theorem for spectrum derivation; `cos²x = ½(1+cos2x)` trig
identity (on sheet) for power derivation — the derived AM results themselves are off-sheet.

### 6.3 `/am/dsb-sc` — slides 49–67 + slide 14 (askisis)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `x_{DSB}(t) = A_c m(t)cos(2πf_c t)` | `dsb-sc-signal` | §1 | slide 53 | no DSB-SC signal on sheet |
| `P_{DSB} = A_m²/4` (single-tone) | `dsb-sc-power` | §5 | (derived) | not on sheet |
| `P_{DSB} = A_c² P_m/2` (general) | `dsb-sc-power` | §5a | slide 64 | not on sheet — **§5a labels "⚠️ πρέπει να θυμάσαι — δεν μέσα στο τυπολόγιο"** |
| `η_{DSB} = 100%` | (within `dsb-sc-power`) | §5b | (derived) | not on sheet |
| Phase-error coherent demod output: `m̂ = m(t)cos(φ)` | — | §4a | (derived) | not on sheet |
| DSB bandwidth: `BW = 2W` (same as conventional AM) | `am-bandwidth` | §3 | (modulation theorem) | not on sheet |

**On-sheet:** `cos A cos B = ½[cos(A-B)+cos(A+B)]` product-to-sum (for power and demod);
`cos²x = ½(1+cos2x)`.

### 6.4 `/am/ssb` — slides 68–80 + slides 15–17 (askisis)

| Formula | formulaId | On-sheet? | Taught | Slide cite | Note |
| --- | --- | --- | --- | --- | --- |
| Hilbert/FT: `F{m̂} = -j·sgn(f)·M(f)` | `hilbert` | **YES** (§1 p.2) | used throughout | slide 18 (bridge) | Correctly labeled on-sheet in §2b |
| `x_{USB} = A_c m cos(2πf_c t) - A_c m̂ sin(2πf_c t)` | `ssb-signal` | **NO** | §2b | slide 69 | Must-learn — **no explicit callout found** |
| `x_{LSB} = A_c m cos(2πf_c t) + A_c m̂ sin(2πf_c t)` | `ssb-signal` | **NO** | §2b | slide 69 | Must-learn — **no explicit callout found** |
| Single-tone USSB: `A_c A_m cos(2π(f_c+f_m)t)` | — | **NO** | §5b | (trig identity) | Must-learn result |
| `B_{SSB} = W` | `am-bandwidth` | **NO** | §5 | slide 68 | Must-learn |
| `P_x = A_c² P_m` (SSB power, no 1/2 factor) | `ssb-power` | **NO** | §5a | slide 71 | Must-learn — **no explicit callout found** |
| Phase-error output: `y = m cos(φ) ∓ m̂ sin(φ)` | — | **NO** | §4a | (derived) | Must-learn; differentiates SSB from DSB |
| `P_{m̂} = P_m` (Hilbert energy preservation, key fact) | — | **NO** | §5a | (Parseval + \|sgn\|=1) | Must-know; no dedicated formulaId |

**Placement-(a) gap:** `ssb-signal` and `ssb-power` have no standardized must-learn callout — clean
gap for Pass C (same as noise/through-filters before §8στ was added).

### 6.5 `/am/vsb` — slides 8–9 only (SE_session11&12&13.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `x_{VSB}` = full USB + vestige (via shaping filter H_VSB) | `vsb-signal` | §1 | slide 9 (name only) | no VSB on sheet |
| Nyquist symmetry: `H_VSB(f_c+Δ) + H_VSB(f_c-Δ) = const` | `vsb-nyquist-symmetry` | §2 | (Haykin/Lathi — no dedicated slide this year) | not on sheet |
| `B_{VSB} = W + W_vestige`, `W < B_{VSB} < 2W` | `vsb-bandwidth` | §1/§3 | (Haykin) | not on sheet |
| Coherent demod: `M̃(f) = ½M(f)[H(f_c+f)+H(f_c-f)]` | — | §2a | (derived) | not on sheet |

**Note:** page explicitly states «Δεν υπάρχουν dedicated content slides για VSB-AM στο φετινό
deck» — all VSB formulas beyond the bandwidth are from general bibliography. Exam weight 2%; Pass C
priority low.

### 6.6 `/am/multiplexing` — slide 5 + slide 80

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| FDM non-overlap: `Δf ≥ 2W` (AM/DSB), `Δf ≥ W` (SSB), `Δf ≥ W+W_v` (VSB) | `fdm-spacing` | §3 | (modulation theorem applied) | no FDM formula on sheet |
| Superheterodyne demux: `f_LO = f_target + f_IF` (principle) | — | §6 | (practical) | not on sheet |

**Note:** only slide 5 mentions FDM in the deck; the canonical exam template (m=sinc, k=Π in two
carriers) draws primarily on the modulation theorem (on sheet) + non-overlap condition (off sheet).

### 6.7 `/am/modulator-demodulator` — slides 34–~50 + askisis deck

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| Nonlinear modulator condition: `f_c > 3W` | `nonlinear-modulator-fc` | §1b | slides 34–40 | not on sheet |
| Balanced modulator output: `y = 4d₂ m(t)cos(2πf_c t)` (DSB-SC) | — | §1c | slide 66 | circuit result, not on sheet |
| Envelope detector RC range: `1/f_c ≪ RC ≪ 1/W` | `envelope-detector-rc` | §2b | slides 45–47 | not on sheet — **page labels "⚠️ Πρέπει να θυμάσαι"** |
| AM output SNR: `(SNR)_out,AM = η·(SNR)_ref` = `(μ²/2/(1+μ²/2))·SNR_ref` | `am-output-snr` | §5+ | slides 47–50 area | not on sheet — **primary teaching home here; recap in `noise/snr` §5** |
| Threshold effect: envelope detector nonlinear noise enhancement below ~10 dB SNR | — | (threshold section) | slides 50–54 | conceptual must-know, not a formula |

**Cross-chapter note:** `am-output-snr` is already listed in §2.5 as a recap formula; its primary
home is this page. Pass C should mark it in both `am/modulator-demodulator` and `noise/snr` with
consistent wording to avoid double-teaching confusion.

---

### 6.8 Pass A — AM PROBLEMS (~20 problems)

**Scope.** All `topic:'am'` problems in `content/practice/exercises.tsx`. Sources: Πρόοδος
Απρίλιος 2026 (10 problems), Πρόοδος β 2025 (6 problems), Εξέταση Σεπτεμβρίου 2025 (2+ problems),
and 1 lecture problem.

**Method.** Each problem's `formulaIds` cross-checked against `formulas.tsx` `inTypology` flag.
All AM-specific formulaIds are `inTypology:false` (consistent with §1). On-sheet formulaIds
(Fourier pairs, modulation theorem) correctly appear in some problems and need no must-learn callout.

### Headline finding (AM problems)

> **Every AM-specific formula used in AM problems is off-sheet (must-learn).** All `am-*`,
> `dsb-sc-*`, `ssb-*`, `vsb-*`, `nonlinear-modulator-fc`, `envelope-detector-rc`, `am-output-snr`,
> and `fdm-spacing` formulaIds carry `inTypology:false`. On-sheet formulaIds (`fourier-pair-cos/sin/
> rect/tri`, `fourier-modulation-theorem`) that co-appear in some problems are correctly classified
> and need no must-learn callout. **No formulaId inconsistencies found.**

### Per-problem formulaId cross-check

| Problem | AM (off-sheet) formulaIds | On-sheet formulaIds co-present | Must-learn cross-check result |
| --- | --- | --- | --- |
| `proodos26-1` | `am-mu`, `am-signal` | — | Both off-sheet ✓ |
| `proodos26-2` | `am-power`, `am-mu`, `am-eta` | — | All off-sheet ✓ |
| `proodos26-3` | `am-mu`, `am-signal` | — | Both off-sheet ✓ |
| `proodos26-4` | `am-power`, `am-eta` | — | Both off-sheet ✓ |
| `proodos26-5` | `am-signal`, `nonlinear-modulator-fc` | — | Both off-sheet ✓ |
| `proodos26-7` | `dsb-sc-signal` | — | Off-sheet ✓ |
| `proodos26-9` | `am-signal`, `am-spectrum` | `fourier-pair-cos`, `fourier-pair-sin` | AM ids off-sheet ✓; Fourier pairs on-sheet ✓ |
| `proodos26-11` | `ssb-signal` | `fourier-pair-rect`, `fourier-pair-tri` | SSB signal off-sheet ✓; pairs on-sheet ✓ |
| `proodos26-12` | `ssb-signal` | — | Off-sheet ✓ |
| `proodos26-13` | `ssb-signal` | — | Off-sheet ✓ |
| `pb25-th2-1` | none (conceptual — λόγοι DSB-SC) | — | No formulaId → no placement-(b) target |
| `pb25-th2-2` | `am-signal` | — | Off-sheet ✓ |
| `pb25-th2-3` | `ssb-signal` | `fourier-pair-rect` | SSB signal off-sheet ✓; pair on-sheet ✓ |
| `pb25-th2-5` | `am-signal` | — | Off-sheet ✓ |
| `pb25-th3` | `dsb-sc-signal` | — | Off-sheet ✓ |
| `pb25-th4` | `am-signal`, `nonlinear-modulator-fc` | `fourier-pair-rect`, `fourier-modulation-theorem` | AM ids off-sheet ✓; FT tools on-sheet ✓ |
| `sept25-th1-1` | `am-signal`, `am-spectrum`, `am-bandwidth` | — | All off-sheet ✓ |
| `sept25-th1-2` | `am-power`, `am-mu` (inferred from problem content) | — | Off-sheet ✓ |
| `lec-am-1` | `am-mu`, `am-signal` | — | Both off-sheet ✓ |

### Placement-(b) verification

The standardized «δεν δίνεται στο τυπολόγιο» callout is **absent from all AM problems**
(solution + coaching), consistent with the site-wide pattern from noise (§2.7) and foundations
(§3.7). One ad-hoc mention found:

- `sept25-th1-3` coaching: «Πίνακας που πρέπει να ξέρεις απέξω: AM = 2W bandwidth…» — ad-hoc
  «learn by heart», no τυπολόγιο reference. Same ad-hoc/standardised split as noise §2.7 and
  foundations §3.7.

**Conceptual problem:** `pb25-th2-1` tests understanding of *why* DSB-SC is used (no formula) —
no placement-(b) target. Pass C should leave it untouched.

**Conclusion:** Placement-(b) gap is universal across the 18 formula-bearing AM problems. Pass C
should propagate the standardised «⚠️ Πρέπει να θυμάσαι (όχι στο επίσημο τυπολόγιο)» callout
(the §8στ-of-through-filters model) to all 18 problems.

### 6.9 Inverse-error check (AM scope)

**No AM-specific inverse errors found.** No coaching entry for any `topic:'am'` problem tells
students to memorise a formula that IS on the τυπολόγιο.

One FM inverse error surfaced during the AM sweep — logged as **F12** in §7 (out of scope for this
step): `sose-coaching.tsx` (~line 506) says «Ο τύπος του Carson είναι στο τυπολόγιο», but per §1
there are zero FM formulas on the sheet.

---

## 6B. Pass B — AM Chapter Weighting Results

> **Step:** `mustlearn-passb-am-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §6 (AM chapter). Weight = count of distinct past-exam exercises that required the formula (either directly or as a key derivation step). References cite `exercises.tsx` problem IDs.

### Exam-paper audit

All six theory exam-session papers in `past_exams/` were visually audited (images + PDF) for AM content:

| Exam session | Files | AM problems found |
| --- | --- | --- |
| Πρόοδος Απρίλιος 2026 | `προοδος_2026.jpg` | ΘΕΜΑ 1–5, 7, 9, 11–13 (10 problems: conventional AM, DSB-SC, SSB/FDM) |
| Εξέταση Σεπτεμβρίου 2025 | `2025_sept_exam.jpg` | ΘΕΜΑ 1.1–1.5 (5 AM problems) + ΘΕΜΑ 2.7 (FM/AM cross-topic) |
| Επι-πτυχίο Ιανουαρίου 2026 | `Epi-Ptyxio-Jan-26_1.jpg`, `_2.jpg` | ΘΕΜΑ 1.1, ΘΕΜΑ 2.7–2.8, ΘΕΜΑ 3.11–12 |
| Εξέταση Ιουνίου 2025 Team A | `Syst-Epik-June-2025.pdf` → `june2025-exam.pdf` (ASCII copy, 2 pp., visually read) | ΘΕΜΑ 2 entire (DSB-SC + conventional AM multiplexing, 6 sub-problems as `jun25-th2`) |
| Πρόοδος Α Μαΐου 2025 | `proodos_a1.jpg`, `proodos_a2.jpg` | ΘΕΜΑ 1.1, ΘΕΜΑ 2.2, ΘΕΜΑ 2.5, ΘΕΜΑ 3 (USSB) |
| Πρόοδος Β Μαΐου 2025 | `proodos_b1.jpg`, `proodos_b2.jpg` | ΘΕΜΑ 1.1, ΘΕΜΑ 2.2, ΘΕΜΑ 2.3, ΘΕΜΑ 2.5, ΘΕΜΑ 3, ΘΕΜΑ 4 |
| Solutions compilation | `systepik-exams-solutions-ΤΗΕΜΑΤΑ-KANELOU.pdf` | Confirms same six sessions; no additional AM problems found |
| MATLAB/lab exams | Various | Lab-only; not audited |

**Coverage note:** Every AM exercise found in the visual audit matches an exercise already present in `exercises.tsx`. **No additional AM exercises outside `exercises.tsx` were identified.** **One potential coverage gap:** Proodos A 2025 ΘΕΜΑ 4 — `proodos_a2.jpg` image is cut off before ΘΕΜΑ 4 content is visible; no `pa25-th4` exercise exists in `exercises.tsx`. If it parallels `pb25-th4-nonlinear` (the square-law modulator problem), it would add +1 to `am-signal` and `nonlinear-modulator-fc`. Flagged; **not counted** below since unconfirmed.

**Exercise corpus:** 21 distinct past-exam `topic:'am'` exercises (excluding lecture exercise `lec-am-1`) + 1 cross-topic FM exercise (`sept25-th2-7`) that invokes `am-output-snr` and `am-bandwidth`.

**`formulaIds` tagging note:** Several exercises use a formula as a key step but do not list it in `formulaIds`. These are flagged per formula as "(untagged key step)". The `fdm-spacing` formula is consistently absent from all four multiplexing exercises that require it — a uniform tagging gap flagged for Pass C.

---

### 6B.1 Conventional AM formulas (§6.2)

#### `am-signal` — x_AM(t) = [A_c + m(t)]cos(2πf_c t)

**Weight: 17** ← highest in the AM chapter; tested in all six exam sessions

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-1` | Proodos Απρίλιος 2026 · ΘΕΜΑ 1 | Compute μ = Am/Ac from given amplitudes; signal form is the starting model |
| `proodos26-3` | Proodos Απρίλιος 2026 · ΘΕΜΑ 3 | Explain what m=1 means; x_AM = [Ac+m]cos(2πfct) is the core model |
| `proodos26-5` | Proodos Απρίλιος 2026 · ΘΕΜΑ 5 | Square-law modulator circuit; BPF-filtered output produces x_AM form |
| `proodos26-9` | Proodos Απρίλιος 2026 · ΘΕΜΑ 9 | Draw AM signal in time/frequency for fc=500Hz, fm=1Hz; x_AM written explicitly |
| `sept25-th1-1` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.1 | Explain AM operation, write signal equation, show sidebands |
| `sept25-th1-2` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.2 | Compute μ, Pc, P_AM from Ac=10V, Am=5V — signal form is the starting model |
| `sept25-th1-5` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.5 | Draw AM spectrum of m(t)=cos(2π·1kHz·t)+0.5cos(2π·2kHz·t) on fc=100kHz |
| `jan26-th1-1` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.1 | T/F: [Ac·cos(2πt)]cos(2πfct) → ΛΑΘΟΣ (DSB-SC); solution states correct am-signal form [Ac+m]cos |
| `jan26-th2-7` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.7 | Draw AM in time and frequency for c=cos(20πt), m=2sin(2πt) |
| `pa25-th1-1` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 1.1 | T/F: [Ac·cos(2πt)]cos(2πfct) → ΛΑΘΟΣ (DSB-SC); correct am-signal form is the answer |
| `pa25-th2-2` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.2 | Draw AM signal cos(8πt) with m=2sin(2πt); write x_AM and identify overmodulation |
| `pa25-th2-5` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.5 | x(t)=Σncos(2πnt) as message: draw AM spectrum, count harmonics (1 carrier + 2×8 sidebands) |
| `pb25-th1-1` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 1.1 | T/F: [Ac+cos(2πt)]cos(2πfct) → ΣΩΣΤΟ; direct test of conventional AM formula |
| `pb25-th2-2` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.2 | Draw AM signal cos(8πt) with m=2sin(2πt) (repeat-group with pa25-th2-2) |
| `pb25-th2-5` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.5 | x=Σ(10-n)cos(2πnt), n=1..6: draw baseband spectrum, count AM harmonics |
| `pb25-th4-nonlinear` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 4 | Nonlinear y=x²(t) modulator: BPF output → z(t)=m(t)cos(2πfct); am-signal is the target form |
| `jun25-th2` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 2 | Sub-problem 1: x_k(t)=[Ac+k(t)]cos(2πf2t) (conventional AM); write signal form + spectrum |

---

#### `am-mu` — μ = \|min m(t)\|/A_c ; single-tone: μ = A_m/A_c

**Weight: 8**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-1` | Proodos Απρίλιος 2026 · ΘΕΜΑ 1 | Direct: μ = Am/Ac = 5/10 = 0.5 |
| `proodos26-2` | Proodos Απρίλιος 2026 · ΘΕΜΑ 2 | μ=1 used to evaluate P_total and derive η |
| `proodos26-3` | Proodos Απρίλιος 2026 · ΘΕΜΑ 3 | Explain what m=1 means: envelope just touches zero, maximum efficiency |
| `sept25-th1-2` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.2 | μ = Am/Ac = 5/10 = 0.5 (same structure as proodos26-1) |
| `sept25-th1-4` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.4 | Condition μ ≤ 1 for correct envelope-detector operation |
| `pa25-th2-2` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.2 | μ = Am/Ac = 2/1 = 2 > 1 → overmodulation (tagged) |
| `pb25-th2-2` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.2 | μ = 2 > 1 → overmodulation, phase reversals visible in waveform (untagged key step) |
| `jan26-th2-7` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.7 | μ = 2/1 = 2 > 1 → overmodulation identified in time-domain drawing (untagged key step) |

---

#### `am-power` — P_total = (A_c²/2)(1 + μ²/2) ; P_AM = A_c²/2 + P_m/2 (general)

**Weight: 4**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-2` | Proodos Απρίλιος 2026 · ΘΕΜΑ 2 | Direct: P_AM = Pc(1+m²/2) = 100·1.5 = 150 W |
| `proodos26-4` | Proodos Απρίλιος 2026 · ΘΕΜΑ 4 | Derive η_max = 1/3 via P_total formula |
| `sept25-th1-2` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.2 | P_AM = Ac²/2 + Am²/4 = 50 + 6.25 = 56.25 W |
| `sept25-th1-3` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.3 | AM vs DSB-SC vs SSB power comparison: P_AM includes carrier overhead (≤1/3 efficiency) |

---

#### `am-eta` — η = P_m/(A_c² + P_m) = μ²/(2+μ²) ≤ 1/3

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-2` | Proodos Απρίλιος 2026 · ΘΕΜΑ 2 | η_max context: m=1 maximises sideband power, η = 1/3 at maximum |
| `proodos26-4` | Proodos Απρίλιος 2026 · ΘΕΜΑ 4 | Direct: maximize η, find η_max = μ²/(2+μ²)\|_{μ=1} = 1/3 ≈ 33.3% |
| `sept25-th1-3` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.3 | AM power efficiency ≤ 33% in comparison table (untagged key step — only `am-power` and `dsb-sc-power` tagged) |

---

#### `am-spectrum` — X_AM(f) = (A_c/2)[δ(f∓f_c)] + ½[M(f∓f_c)]

**Weight: 4**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-9` | Proodos Απρίλιος 2026 · ΘΕΜΑ 9 | Draw spectrum: carrier impulse + USB + LSB for specific fc, fm |
| `sept25-th1-1` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.1 | Derive and explain AM spectrum, show sideband positions |
| `pa25-th2-5` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.5 | Count harmonics in AM spectrum: 1 carrier + 2×n sidebands per side |
| `jan26-th2-7` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.7 | Draw AM spectrum for c=cos(20πt), m=2sin(2πt) |

---

#### `am-bandwidth` — B_AM = B_DSB-SC = 2W ; B_SSB = W

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th1-1` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.1 | State B_AM = 2W when explaining spectrum structure |
| `sept25-th1-3` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.3 | Bandwidth comparison: AM=2W, DSB-SC=2W, SSB=W — core deliverable of the problem |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | FM-vs-AM comparison: AM bandwidth = 2W as baseline against Carson rule for FM |

---

### 6B.2 DSB-SC formulas (§6.3)

#### `dsb-sc-signal` — x_DSB(t) = A_c·m(t)·cos(2πf_c t)

**Weight: 5**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-7` | Proodos Απρίλιος 2026 · ΘΕΜΑ 7 | Phase-error coherent demod: x_DSB × cos(2πfct+φ) → m(t)cos(φ) after LPF |
| `jan26-th1-1` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.1 | T/F: [Ac·cos(2πt)]cos(2πfct) IS the DSB-SC form — distinguish from conventional AM |
| `jan26-th2-8` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.8 | Draw DSB-SC spectrum for m=2sinc(2Wt): x_DSB=m·cos(2πfct), no carrier impulse |
| `pb25-th3-mux` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 3 | DSB-SC multiplexing of sinc(Wt)+Π(Wt): write x_DSB forms, draw spectra, compute non-overlap |
| `jun25-th2` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 2 | Sub-problem 1: x_m(t)=m(t)cos(2πf1t) (DSB-SC, no carrier); signal form and spectrum |

---

#### `dsb-sc-power` — P_DSB = A_c²·P_m/2 (general) ; P_DSB = A_m²/4 (single-tone)

**Weight: 1**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th1-3` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.3 | DSB-SC has η=100% (P=Ac²Pm/2, no carrier power overhead) in comparison table |

---

#### DSB-SC phase-error demod output — no dedicated formulaId; result: m(t)cos(φ)

**Weight: 1**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-7` | Proodos Απρίλιος 2026 · ΘΕΜΑ 7 | Core of problem: coherent demod with phase error φ → output amplitude scales by cos(φ) |

**Pass C note:** No dedicated `formulaId` in `formulas.tsx` for this result. Suggest creating `dsb-sc-phase-error`. Exam weight 1, but it is the primary exam trap for DSB-SC demodulation.

---

### 6B.3 SSB formulas (§6.4)

#### `ssb-signal` — x_USB = A_c·m(t)·cos(2πf_c t) − A_c·m̂(t)·sin(2πf_c t)

**Weight: 6**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-11` | Proodos Απρίλιος 2026 · ΘΕΜΑ 11 | Draw USSB spectra for sinc(Wt) and sinc²(Wt) — USSB keeps upper sideband only |
| `proodos26-12` | Proodos Απρίλιος 2026 · ΘΕΜΑ 12 | USSB non-overlap condition: B_USSB=W per signal → f1 ≥ W/2, f2 ≥ max(W, f1+W/2) |
| `proodos26-13` | Proodos Απρίλιος 2026 · ΘΕΜΑ 13 | Draw G(f) of multiplexed USSB signal |
| `pb25-th2-3` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.3 | Draw AM-LSSB spectrum for m=2sinc(2Wt): LSB only below fc |
| `pa25-th3-mux` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 3 | USSB multiplexing of sinc(2Wt)+Π(4Wt): spectra + non-overlap + G(f) |
| `jan26-th3-mux` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 3.11–12 | USSB multiplexing of sinc(2Wt)+Π(4Wt) on f1=100kHz, f2=1MHz: spectra + G(f) |

---

#### `ssb-power` — P_SSB = A_c²·P_m (no 1/2 factor compared to P_DSB)

**Weight: 0** — Not required as a key formula step in any past-exam problem. Pass C: add must-learn callout on theory page.

---

### 6B.4 VSB and FDM formulas (§6.5–§6.6)

#### `vsb-signal`, `vsb-nyquist-symmetry`, `vsb-bandwidth` — each

**Weight: 0** — No past-exam exercise requires VSB formulas. Exam weight ~2% (noted on vsb theory page). Must-learn callout needed; low Pass C priority.

---

#### `fdm-spacing` — Δf ≥ 2W (DSB-SC/AM), Δf ≥ W (SSB), Δf ≥ W+W_vestige (VSB)

**Weight: 4**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-12` | Proodos Απρίλιος 2026 · ΘΕΜΑ 12 | USSB non-overlap: f1 ≥ W/2, f2 ≥ max(W, f1+W/2); derived from B_SSB=W per channel |
| `pb25-th3-mux` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 3 | DSB-SC non-overlap: f2−W ≥ f1+W/2 → f2 ≥ f1+3W/2 |
| `pa25-th3-mux` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 3 | USSB non-overlap: f2 ≥ f1+W |
| `jun25-th2` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 2 | Sub-problem 2: find n for non-overlap of DSB-SC and AM channels |

**Tagging gap (HIGH priority for Pass C):** `fdm-spacing` is absent from the `formulaIds` of all four exercises above. The non-overlap condition is the central deliverable of each multiplexing problem.

---

### 6B.5 Modulator/Demodulator formulas (§6.7)

#### `nonlinear-modulator-fc` — f_c > 3W

**Weight: 2**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-5` | Proodos Απρίλιος 2026 · ΘΕΜΑ 5 | Square-law modulator circuit: fc>3W ensures AM term separable from baseband with BPF |
| `pb25-th4-nonlinear` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 4 | Nonlinear y=x²(t) modulator with fc>>W — this is the operating design condition |

---

#### `envelope-detector-rc` — 1/f_c ≪ RC ≪ 1/W

**Weight: 1**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th1-4` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 1.4 | "Describe envelope detector and state basic prerequisites" — RC time-constant condition is the primary formula answer |

---

#### `am-output-snr` — (SNR)_out,AM = η·SNR_ref = (μ²P_m/(2+μ²P_m))·SNR_ref

**Weight: 1** (cross-topic; also counted in §2B from the noise side)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | FM-vs-AM comparison: AM output SNR = η·SNR_ref is the AM baseline; G_FM/AM = 9β² expresses the FM advantage over it |

---

### 6B.6 Formulaid tagging gaps discovered during Pass B

| Formula | Exercises where untagged but key step | Suggested fix for Pass C |
| --- | --- | --- |
| `am-mu` | `pb25-th2-2` (μ=2→overmod), `jan26-th2-7` (same) | Add `am-mu` to both `formulaIds` arrays |
| `am-eta` | `sept25-th1-3` (η≤33% in comparison table) | Add `am-eta` to `formulaIds` |
| `fdm-spacing` | `proodos26-12`, `pb25-th3-mux`, `pa25-th3-mux`, `jun25-th2` | Add `fdm-spacing` to all four |
| DSB-SC phase-error demod | `proodos26-7` (only exercise; output = m(t)cos(φ)) | Create `dsb-sc-phase-error` formulaId in `formulas.tsx` |

---

### 6B.7 Ranked summary — AM chapter Pass B

| Rank | Formula | formulaId | Weight | Pass C priority |
| --- | --- | --- | --- | --- |
| 1 | x_AM = [Ac+m]cos(2πfct) | `am-signal` | **17** | HIGH — tested in all six exam sessions; callout universally missing |
| 2 | μ = Am/Ac (modulation index) | `am-mu` | **8** | HIGH — in nearly every conventional AM exercise; 2 exercises untagged |
| 3 | x_USB/LSB via Hilbert | `ssb-signal` | **6** | HIGH — tested in every exam session with SSB content |
| 4 | x_DSB = Ac·m·cos(2πfct) | `dsb-sc-signal` | **5** | HIGH — fundamental DSB-SC form; no carrier term |
| 5 | X_AM(f) = (Ac/2)δ(f∓fc) + ½M(f∓fc) | `am-spectrum` | **4** | HIGH — drawing AM spectrum is a recurrent pattern |
| 5 | P_AM = (Ac²/2)(1+μ²/2) | `am-power` | **4** | HIGH — repeated power computation |
| 5 | Δf ≥ 2W (DSB), Δf ≥ W (SSB) | `fdm-spacing` | **4** | HIGH — untagged in all 4 multiplexing exercises; must-learn callout missing |
| 8 | B_AM = 2W; B_SSB = W | `am-bandwidth` | **3** | HIGH — universal bandwidth reference |
| 8 | η = μ²/(2+μ²) ≤ 1/3 | `am-eta` | **3** | HIGH — the AM efficiency bound is a signature exam fact |
| 10 | fc > 3W (square-law modulator) | `nonlinear-modulator-fc` | **2** | MEDIUM — dedicated modulator problems |
| 11 | P_DSB = Ac²Pm/2 | `dsb-sc-power` | **1** | MEDIUM — comparison table |
| 11 | 1/fc ≪ RC ≪ 1/W (envelope detector) | `envelope-detector-rc` | **1** | MEDIUM — directly tested Sept 2025 |
| 11 | (SNR)_out,AM = η·SNR_ref | `am-output-snr` | **1** | MEDIUM — cross-topic; primary homes: am/mod-demod + noise/snr |
| 11 | DSB-SC phase-error: output = m(t)cos(φ) | — (no id) | **1** | MEDIUM — primary AM demodulator trap; needs new formulaId |
| 15 | P_SSB = Ac²Pm | `ssb-power` | **0** | LOWER — must-learn callout needed; zero direct exam weight |
| 15 | VSB formulas (vsb-signal, vsb-nyquist-symmetry, vsb-bandwidth) | various | **0 each** | LOWER — exam weight ~2%; must-learn but low priority |

---

## 7. Pass A inventory — FOUNDATIONS supplemental (signal-transformations; filters) and RANDOMNESS/psd

**Scope.** Three pages deferred by the batch-1 pass (flag **F10**):
`app/(content)/foundations/signal-transformations/page.mdx`,
`app/(content)/foundations/filters/page.mdx`,
`app/(content)/randomness/psd/page.mdx`.
All three pages read directly. All on/off-sheet calls grounded in §1 ground-truth (no re-audit of
`slides/formulas.pdf`). No standalone `topic:'signal-transformations'` or `topic:'filters'` entries
found in `exercises.tsx` — the filter/transformation material feeds into `topic:'noise'` problems
already swept in §2.7. The PSD page's inline `ExamProblem` blocks are **not** in `exercises.tsx`
and have no companion coaching in `sose-coaching.tsx`; no separate problems sweep required.
**Flag F10 resolved.** This step did **not** re-audit `slides/formulas.pdf`.

### Headline finding (three-page split)

> **signal-transformations:** zero new must-learn formulas — the page is explicitly a **reference page** for applying on-sheet FT properties (scaling, shift, duality). Every rule taught either IS on the sheet or derives from on-sheet pairs in exam conditions.
>
> **filters:** one clear must-learn (dB gain formula, slide 46; `filter-gain-db` already exists at formulas.tsx L724, inTypology:false, weight 0 — no new entry needed; Pass C must wire placement-(c) must-learn flag). LP/BP impulse responses are derivable from on-sheet rect↔sinc + duality + modulation theorem — borderline, not standalone must-learns.
>
> **randomness/psd:** this page IS the **primary teaching home** for Wiener-Khinchin and $S_Y = |H|^2 S_X$ (both listed in §2.6 as "imported from randomness/*" — now confirmed). One new inverse error: F13 (exponential FT pair wrongly labeled "(τυπολόγιο)").

### 7.1 `foundations/signal-transformations` — (SE_session3/4 quick-reference page)

**Headline: ZERO new must-learn formulas.**

> The page itself says «αυτή είναι σελίδα **αναφοράς**» and routes students to the Fourier-transform
> chapter for the FT property proofs. Every transformation rule derives from on-sheet §1 p.1 properties.

| Formula / rule | On-sheet? | Note |
| --- | --- | --- |
| Time shift $x(t - t_0)$ ↔ $X(f)\cdot e^{-j2\pi ft_0}$ | **YES** — `fourier-shift` (§1 p.1) | On-sheet property |
| Time scaling $x(at)$ ↔ $\frac{1}{\lvert a\rvert}X(f/a)$ | **YES** — `fourier-scaling` (§1 p.1) | On-sheet property |
| Time reversal $x(-t)$ ↔ $X(-f) = X^*(f)$ for real $x$ | Derived from `fourier-scaling` ($a=-1$) + `fourier-duality` (§1 p.1) | Derivable in exam |
| Combination: $x(at+b) = x\bigl(a(t+b/a)\bigr)$ → scale by $a$, shift by $-b/a$ | Procedure derived from `fourier-scaling` + `fourier-shift` (both §1 p.1) | No new formula |
| Convolution $y(t) = \int x(\tau)h(t-\tau)d\tau$ | **Already §3.2** (`convolution-definition`) | No new entry |

**Placement-(a):** No must-learn callouts needed (no off-sheet formulas taught). Page correctly makes no off-sheet formula claims.

**Conclusion:** Zero new must-learn entries. F10 closed for this page.

---

### 7.2 `foundations/filters` — slides 36–46 (SE_session7&8_theory_2025.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| **dB gain**: $\text{Κέρδος (dB)} = 20\log_{10}\lvert H(f)\rvert$ | `filter-gain-db` (L724) | §6α | slide 46 | No dB formula of any kind on the sheet — definition must be known cold |
| **dB inversion**: $\lvert H\rvert = 10^{-\text{dB}/20}$; $\lvert H\rvert^2 = 10^{-\text{dB}/10}$ | — | §6α, `ExamProblem filter-db-conversion` | (derived from above) | Needed to convert spec to linear for filter-power calculations |

**Derivable-from-sheet (exam shortcuts but not standalone must-learns):**

| Formula | On-sheet derivation path |
| --- | --- |
| $h_{LP}(t) = 2f_c\,\mathrm{sinc}(2f_c t)$ | `fourier-pair-rect` ($\Pi(t/T) \leftrightarrow T\,\mathrm{sinc}(fT)$) + `fourier-duality` — both §1 p.1 |
| $h_{BP}(t) = 4W\,\mathrm{sinc}(2Wt)\cos(2\pi f_0 t)$ | LP result above + `fourier-modulation-theorem` (§1 p.1) |
| RC LPF: $\lvert H(f)\rvert^2 = 1/(1+(f/f_c)^2)$ | Circuit result; **already in §2.3** for noise applications |
| Noise bandwidth: $B_N = \frac{1}{\lvert H(0)\rvert^2}\int_0^\infty \lvert H(f)\rvert^2 df$ | **Already in §2.3**; primary home noise/through-filters |

**On-sheet (no must-learn):** $Y(f) = X(f)\cdot H(f)$ — `fourier-convolution`, §1 p.1 (the core filter operation).

**Placement-(a) status:** No standardized «⚠️ Πρέπει να θυμάσαι» callout found for the dB formula. The page introduces and uses it in §6α and `ExamProblem filter-db-conversion` without flagging it as off-sheet. **Clean placement-(a) gap for Pass C.**

**Minor wording issue (not a full inverse error):** `Recap` line says "Τα τέσσερα κλασικά (slide 36): κατωπερατά (LP), υψιπερατά (HP), ζωνοπερατά (BP), απόρριψης ζώνης (BS) — **όλα στο τυπολόγιο**." These are filter-type *names/definitions*, not formulas, and are NOT on the exam formula sheet (§1). Less dangerous than F1/F7/F8/F12 (no student skips memorizing a specific formula value), but Pass C should reword to "standard terminology, not on the formula sheet."

**formulaId gap for F2 list:** `filter-gain-db` already exists (formulas.tsx L724, weight 0) — wire placement-(c) must-learn flag in Pass C; no new entry needed.

**Conclusion:** One must-learn (dB formula, slide 46); LP/BP impulse responses are derivable from on-sheet tools. F10 closed for filters page.

---

### 7.3 `randomness/psd` — slides 36–39 (SE_session9_random1_upload.pdf) + slide 36 (SE_session10_noise.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| **WK (forward)**: $S_X(f) = \mathcal{F}\{R_X(\tau)\} = \int R_X(\tau)e^{-j2\pi f\tau}d\tau$ | `wiener-khinchin` | §2 | slide 36 (session 9) | **PRIMARY teaching home** (§2.6 listed as imported); τυπολόγιο has zero random-process formulas |
| **WK (inverse)**: $R_X(\tau) = \int S_X(f)e^{+j2\pi f\tau}df$ | `wiener-khinchin` | §2 | slide 36 | same |
| **Power from PSD**: $P_X = R_X(0) = \int S_X(f)\,df$ | `wss-rx-properties` | §4 | (inverse WK, $\tau=0$) | not on sheet — page labels "✓ Στο τυπολόγιο μέσω WK" (nuanced claim — see wording note) |
| **PSD properties**: $S_X \in \mathbb{R}$; $S_X(-f) = S_X(f)$; $S_X(f) \ge 0$ (Bochner) | `wss-rx-properties` | §5 | (from $R_X$ real + even + psd) | not on sheet |
| **ESD identity** (energy signal): $\mathcal{F}\{R_x(\tau)\} = \lvert X(f)\rvert^2$ | — (no formulaId) | §3 | slide 36 (session 10) | not on sheet; deterministic bridge — must-know for derivations |
| **LTI ΣΑΣ chain**: $R_Y(\tau) = R_X(\tau) * h(\tau) * h(-\tau)$ | — (no formulaId) | §7β | slide 38 | not on sheet; intermediate must-know derivation step |
| **LTI output PSD**: $S_Y(f) = \lvert H(f)\rvert^2 S_X(f)$ | `lti-output-psd` | §7γ | slide 39 | **CO-PRIMARY home** with noise/through-filters (§2.3); `inTypology:false` confirmed |
| **LTI output power**: $P_Y = R_Y(0) = \int \lvert H(f)\rvert^2 S_X(f)\,df$ | `lti-output-psd` | §7γ | slide 39 | same formulaId as above |
| **Exponential FT pair**: $e^{-a\lvert\tau\rvert} \leftrightarrow 2a/(a^2+(2\pi f)^2)$ | — (no formulaId; **F13**) | §10 + ExamProblem `psd-from-rx` | (RC noise application) | NOT on §1 p.1 FT-pairs table (sheet has δ, rect, tri, cos, sin, 1/t — no exponential pair); **page wrongly labels it "(τυπολόγιο)"** — inverse error F13 |
| **Cross-PSD**: $S_{X,Y}(f) = \mathcal{F}\{R_{X,Y}(\tau)\}$ | — (no formulaId) | §9 | (definition) | not on sheet; used in decorrelated-channels arguments (AM/FM noise analyses) |

**Wording note on "✓ Στο τυπολόγιο μέσω WK" labels.** The page labels $P_X = \int S_X\,df$ and $S_Y = \lvert H\rvert^2 S_X$ as "✓ Στο τυπολόγιο μέσω [WK / αλυσίδας]" — meaning *derivable via the WK chain* from FT tools that ARE on the sheet. This is a nuanced claim (not "literally printed"). However, since WK itself is off-sheet, a student cannot derive these in exam conditions without first memorising WK. The "✓" markers are potentially confusing (they resemble "no need to memorize"). They do NOT create the same "skip memorising a formula value" danger as F1/F7/F8/F12, but Pass C should revise the wording to "derivable via WK (must-learn), not literally printed on the sheet."

**Placement-(a) status:** No standardized «⚠️ Πρέπει να θυμάσαι (όχι στο επίσημο τυπολόγιο)» callout found for any formula on this page. The "✓ μέσω WK" markers are the only annotations — ambiguous and non-standard. Clean placement-(a) gap for all WK-family formulas; Pass C should propagate the §8στ model (noise/through-filters standard wording) to this page.

**formulaId gaps for F2 list:** Three formulas with no `formulaId`: ESD identity; LTI ΣΑΣ chain; exponential FT pair. The exponential pair is the most exam-critical (page says "εμφανίζεται 2-3 φορές κάθε χρόνο στα ΣΕ"). Suggested id: `fourier-pair-exp`.

---

### 7.4 Supplemental problems sweep — no new gaps found

**`topic:'foundations'` problems missed by §3.6:** None. All `topic:'foundations'` exercises in
`exercises.tsx` use formulaIds for on-sheet Fourier pairs/properties (no must-learn callout needed)
or `parseval-power` (already flagged F9 in §8). No problem references `signal-transformations`-specific
or `filters`-specific formulaIds. The δ(t−T₁) time-shift problem (`jun25-th1-3`) uses `fourier-shift`
(on-sheet); time-scaling problems (`jun25-th1-6`, `proodos26-10`) use `fourier-scaling` (on-sheet).

**`topic:'random'` problems missed by §4.2:** None. Only `lec-rp-1` and `lec-rp-2` exist as
`topic:'random'`; both already swept in §4.2.

**Inline PSD ExamProblems in `randomness/psd/page.mdx`:** `psd-from-rx`, `rx-from-psd`,
`lti-output-psd`, `psd-properties`, `white-noise-correlation`, `psd-thermal-lpf`,
`psd-bandpass-power` — embedded in the theory page, not in `exercises.tsx`, not in
`sose-coaching.tsx`. Placement-(b) concept does not apply. All use WK + `lti-output-psd` +
`wss-rx-properties` (all off-sheet, confirmed in §7.3).

---

## 8. Pass A inventory — FM chapter (§8.1–§8.5) + remaining randomness pages (§8.6)

**Scope.** Five FM theory pages in `app/(content)/fm/`: `idea`, `pm`, `bessel`, `carson`,
`in-noise`. Plus 3 remaining randomness pages confirmed to exist:
`randomness/random-variables`, `randomness/random-processes`, `randomness/stationarity`.
All on/off-sheet calls grounded in §1 (zero FM and zero random-process formulas on the
sheet). All FM formulaIds confirmed `inTypology: false` in `content/practice/formulas.tsx`.
This step did **not** re-audit `slides/formulas.pdf`.

**F12 verification.** The formulaId for Carson's rule in `formulas.tsx` is `carson` (id
`fm-bandwidth-carson` does not exist). Confirmed `inTypology: false` ✓. **6** `topic:'fm'`
problems reference it: `sept25-th2-7`, `sept25-th2-8`, `sept25-th2-9`, `jan26-th1-5`,
`jan26-th4-fm`, `jun25-th3-fm`. `sose-coaching.tsx` ~L506 inverse error confirmed:
«Ο τύπος του Carson είναι στο τυπολόγιο» — live, DO NOT fix here (Pass C).

### Headline finding — FM chapter

> **The entire FM chapter is must-learn.** Not a single FM-specific formula taught on the
> 5 FM theory pages appears on the τυπολόγιο (consistent with §1). **One critical nuance:**
> J_n(β) **VALUES** for specific (n, β) pairs ARE on the sheet (Bessel table p.3,
> `bessel-table`, `inTypology: true`). The **formulas derived from Bessel** (Jacobi-Anger
> identity, Bessel-sidebands rule, energy identity `Σ J_n²=1`, Carson bandwidth, NBFM
> approximation) are NOT on the sheet and are must-learn.

### Placement-(a) status — FM chapter (two inverse-error pages discovered)

The FM chapter has the **most severe inverse-error problem found in any chapter so far**.
Two theory pages label must-learn FM formulas as "✓ Στο τυπολόγιο" (flags F14, F15 below).
Contrast: `fm/carson` **correctly** labels Carson as must-learn (line 68: "⚠️ Πρέπει να
θυμάσαι — δεν είναι μέσα στο επίσημο τυπολόγιο"); `fm/in-noise` **correctly** labels
`fm-gain-am` as must-learn (line 574). The same Carson formula therefore has **three**
inconsistent treatments across pages — correct on `fm/carson`, inverse-error on `fm/pm`
(F15), inverse-error in `sose-coaching` (F12).

### 8.1 `fm/idea` — slides 1-18, 26-34 (SE_session15_16_16_FM.pdf)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `f_i(t) = f_c + K_f m(t)` (instantaneous frequency) | `fm-instantaneous-freq` | §2 | slide 6 | no FM formula on sheet |
| `x_FM = A_c cos[2πf_c t + 2πK_f ∫m(τ)dτ]` (general FM signal) | `fm-signal` | §3 | slide 8 | not on sheet — **⚠️ F14: page labels "✓ Στο τυπολόγιο" (line 170)** |
| `β_f = Δf_max/W = K_f max\|m\|/W` (FM modulation index, general) | `fm-beta` | §5 | slide 9 | not on sheet — **⚠️ F14: page labels "✓ Στο τυπολόγιο" (line 221)** |
| Single-tone: `x_FM = A_c cos[2πf_c t + β_f sin(2πf_m t)]` | `fm-single-tone` | §5α | (derived) | not on sheet — **⚠️ F14: page labels "✓ Στο τυπολόγιο" (line 248)** |
| PM/FM duality: `K_p = 2πK_f` (insert integrator before PM → FM output) | — | §4 | slides 12-13 | not on sheet |
| `P_x^FM = A_c²/2` (constant envelope, power independent of β) | `fm-power` | §6α | slide 11 | not on sheet |
| NBFM (β≪1): `x_NBFM ≈ A_c cos(2πf_c t) − A_c φ(t) sin(2πf_c t)` | — | §7α | slides 29-31 | not on sheet |
| NBFM single-tone LSB sign-flip: `A_c cos(ω_c t) + (A_c β_f/2)cos(ω_+t) − (A_c β_f/2)cos(ω_−t)` | — | §7β | slide 33 | not on sheet |
| `G_FM/AM = 9β²` (FM gain over AM, μ=1, same P_T) | `fm-gain-am` | ThinkingPattern | (recap from `fm/in-noise`) | not on sheet — **⚠️ F14: ThinkingPattern ~line 540 calls it "στο τυπολόγιο" (contradicts `fm/in-noise` own labeling)** |

**On-sheet used in derivations:** product-to-sum `cos a cos b = ½[cos(a-b)+cos(a+b)]`,
`cos²x = ½(1+cos 2x)`, modulation theorem — all §1 p.1, no must-learn callout needed.

---

### 8.2 `fm/pm` — slides 4-13, 18, 26, 29-34

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `x_PM = A_c cos[2πf_c t + K_p m(t)]` (PM signal) | `pm-signal` | §1 | slide 7 | not on sheet |
| `β_p = K_p max\|m\|` (PM modulation index, in radians, no W denominator) | `fm-beta` | §2 | slide 7 | not on sheet — **⚠️ F15: page labels "✓ Στο τυπολόγιο (μαζί με β_f)" (line 94)** |
| `f_i^PM(t) = f_c + (K_p/2π)(dm/dt)` (PM inst. freq follows dm/dt, not m) | — | §3 | (derived from def) | not on sheet |
| `K_p = 2πK_f` (duality constant; differentiator before FM = PM) | — | §5 | slides 12-13 | not on sheet |
| `P_x^PM = A_c²/2` (same constant envelope as FM) | `fm-power` | §6 | slide 11 | not on sheet |
| Carson `B ≅ 2W(β+1)` (ισχύει and for PM, β = β_p) | `carson` | §7 | slide 26 | not on sheet — **⚠️ F15: page labels "✓ Στο τυπολόγιο (στο /fm/carson)" (line 222)** |
| Single-tone PM: `Δf_PM = K_p A_m f_m` (freq deviation ∝ f_m — vs FM where Δf = K_f A_m) | — | §3/§13 | (derived) | not on sheet |
| NBFM/NBPM spectrum: `X_NB(f) ≈ (A_c/2)δ(f∓f_c) + (jA_c/2)Φ(f-f_c) − (jA_c/2)Φ(f+f_c)` | — | §9 | slides 30-31 | not on sheet |

**Key distinctions (must-know):** PM phase = β_p cos(2πf_m t) for single-tone; FM phase =
β_f sin(2πf_m t). The cos/sin 90° shift distinguishes them on both time-domain and phasor
diagrams. PM Δf depends on f_m; FM Δf does not.

---

### 8.3 `fm/bessel` — slides 19-25, 29-34, 35-47, 48-50

**Bessel nuance:** J_n(β) VALUES are on the sheet (p.3 table, `bessel-table`,
`inTypology: true`, given in exam). The formulas derived from Bessel below are NOT on the sheet.

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| Jacobi-Anger: `e^{jβ sinθ} = Σ_{n=-∞}^{∞} J_n(β) e^{jnθ}` | `fm-bessel-expansion` | §5 | slides 36/44 | not on sheet (table gives VALUES; the FS-expansion identity is not) |
| `x_FM = A_c Σ J_n(β_f) cos[2π(f_c + n f_m)t]` (Bessel sidebands) | `fm-bessel-sidebands` | §6 | slide 44 | not on sheet |
| `X_FM(f) = (A_c/2) Σ J_n(β_f)[δ(f-f_c-nf_m) + δ(f+f_c+nf_m)]` | (within `fm-bessel-sidebands`) | §6 | slide 44 | not on sheet |
| Bessel symmetry: `J_{-n}(β) = (-1)^n J_n(β)` | `fm-bessel-property` | §7.1 | slide 45 | not on sheet |
| Energy identity: `Σ_{n} J_n²(β) = 1` → `P_FM = A_c²/2` (ανεξ. β) | `fm-bessel-property` | §7.3 | slide 47 | not on sheet |
| Significant sidebands: `N = 2⌊β⌋ + 3` (slide 46, single-tone FM) | — | §9 | slide 46 | not on sheet |
| J_0 roots (carrier null pattern): β ≈ 2.405, 5.520, 8.654 | — | §8 | slide 37 | table gives values; the J_0=0 identification must-know |

**Placement-(a) status:** No inverse errors. `fm/bessel` correctly identifies the Bessel
table as on-sheet and does NOT label the derived formulas as "✓ Στο τυπολόγιο".

---

### 8.4 `fm/carson` — slides 22-26, 27-28, 31, 44-46

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `B ≅ 2W(β+1) = 2(Δf + W)` (Carson's rule, ~98% energy) | `carson` | §1 | slide 26 | not on sheet — **correctly labeled "⚠️ Πρέπει να θυμάσαι" (line 68)** |
| NBFM limit β→0: `B → 2W` (same as AM bandwidth) | — | §3 | slide 31 | limit of Carson |
| WBFM limit β→∞: `B → 2Δf` (deviation-dominated) | — | §4 | (derived from Carson) | limit of Carson |
| Single-tone PM: `N = 2⌊K_p α⌋ + 3`, FM: `N = 2⌊K_f α/f_m⌋ + 3` (slide 46 explicit) | — | §5-§6 | slide 46 | not on sheet |
| W = one-sided bandwidth of m(t) (key operation for non-single-tone: Fourier → read support) | — | §7 (Άσκηση 2) | slides 27-28 | operational definition/procedure |

**Placement-(a) status:** `fm/carson` correctly labels Carson as off-sheet. It is the
reference-correct page that F15 (`fm/pm`) contradicts.

---

### 8.5 `fm/in-noise` — FM demodulator noise analysis

(Hardware: slides 65-66 of SE_session15_16_16_FM.pdf. Quantitative noise analysis: standard bibliography (Haykin/Lathi); no dedicated in-noise slides this year per page SourceDoc note.)

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `S_{v_n}(f) = N_0 f²/A_c²` (triangular noise PSD after FM discriminator) | `fm-noise-output-psd` | §3d | (derivation: discriminator ×j2πf → PSD×f²) | not on sheet |
| `P_n,out = N_0 W³/(3 A_c²)` (output noise power, LPF at ±W) | — (no formulaId) | §4 | (∫₀^W N_0 f²/A_c² df = N_0 W³/(3A_c²)) | not on sheet; the integral `∫f²=W³/3` is also not on sheet (p.3 lists `∫cos`, `∫sin`, `∫eˣ`, `∫(a+bx)ⁿ`, etc. — no `∫f²`) |
| `P_s,out = (Δf)²/2` (single-tone: discriminator output is K_f m(t), power = (K_f A_m)²/2 = (Δf)²/2) | — | §4 | (discriminator definition) | not on sheet |
| `SNR_ref = A_c²/(2 N_0 W)` (universal reference SNR baseline) | `fm-snr-ref` | §4 | (ορισμός) | not on sheet |
| `SNR_out,FM = 3β² · SNR_ref` (single-tone FM output SNR, above threshold) | `fm-snr-out` | §4 | (παραγωγή) | not on sheet — **correctly labeled "πρέπει να θυμάσαι"** |
| `G_FM/AM = 9β²` (FM gain over AM, μ=1, same P_T, ratio `3β²/(1/3)`) | `fm-gain-am` | §5 | (table) | not on sheet — **correctly labeled "πρέπει να θυμάσαι — δεν μέσα στο επίσημο τυπολόγιο" (line 574)** |
| Threshold: ~10 dB SNR_in (small-noise approx breaks → clicks → exponential collapse) | `fm-threshold` | §6 | (bibliography) | conceptual bound |
| Capture effect: ≥6 dB → total capture (FM only, not AM) | — | §7 | (bibliography) | not a printable formula |
| Pre-emphasis τ: 50 μs (Europe) / 75 μs (US) | — | §8 | (bibliography) | practical standard |

**`SNR_out,FM = 3β²` scope note:** valid for **single-tone** message **above threshold**.
For general m(t), the numerator becomes `3 K_f² P_m / (N_0 W³) · (A_c²/2)`.

**Note on F14/F15/F12 consistency:** `fm/in-noise` correctly labels `fm-gain-am` must-learn.
`fm/idea` incorrectly labels it "στο τυπολόγιο" (F14). Pass C should fix F14 to match the
correct behavior already present on `fm/in-noise`.

---

### 8.6 Remaining randomness pages

#### 8.6.1 `randomness/random-variables` — slides 8, 10, 14-19 (SE_session9_random1_upload.pdf)

**Headline: prerequisite recap page (examWeight: 1%). Zero new must-learn entries specific to K21.**

This page is explicitly a "γρήγορος οδηγός" of upstream probability course material. Its
formulas are background for K21 (used constantly in ΤΔ calculations), but none has a
standalone K21 formulaId because they belong to the prerequisite course.

| Formula/definition | formulaId | K21 note |
| --- | --- | --- |
| `E[X] = ∫x f_X(x) dx` (mean) | (absorbed into `random-mean` at RP level) | Primary K21 home: `randomness/random-processes` |
| `σ_X² = E[X²] − μ_X²`, `E[X²] = μ_X² + σ_X²` | — | No dedicated K21 formulaId |
| Linearity: `E[aX+bY] = aE[X]+bE[Y]` | — | prerequisite; used throughout ΤΔ |
| LOTUS: `E[g(X)] = ∫g(x) f_X(x) dx` | — | Key tool for computing m_X(t), R_X — prerequisite |
| Gaussian PDF: `f_N(x)=(1/σ√2π)e^{-x²/2σ²}` | — | primary home also `noise/sources §3`; no K21 formulaId |

**Conclusion:** Zero new must-learn formulaIds. F10 already resolved for this page in §7; no
further flags.

---

#### 8.6.2 `randomness/random-processes` — slides 3-19

**Headline: ALL must-learn** (entire chapter off-sheet, consistent with §1).

| Must-learn formula (readable) | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| `m_X(t) = E[X(t)] = ∫a f_{X(t)}(a) da` (mean function) | `random-mean` | §5 | slide 10 | no ΤΔ formula on sheet |
| `R_X(t_i, t_j) = E[X(t_i) X(t_j)]` (autocorrelation / ΣΑΣ) | `random-autocorr` | §6 | slide 11 | not on sheet |
| `C_X(t_i, t_j) = R_X(t_i, t_j) − m_X(t_i) m_X(t_j)` (autocovariance / ΑΣΔ) | (within `random-autocorr`) | §7 | slide 12 | not on sheet |
| `R_{X,Y}(t_1, t_2) = E[X(t_1) Y(t_2)]` (cross-correlation / ΕΣΑ) | `random-cross` | §8 | slide 12 | not on sheet |
| `C_{X,Y}(t_1, t_2) = R_{X,Y} − m_X(t_1) m_Y(t_2)` (cross-covariance / ΕΣΔ) | (within `random-cross`) | §8 | slide 13 | not on sheet |
| Orthogonal: `R_{X,Y}(t_1,t_2)=0 ∀t_1,t_2` (definition) | — | §8α | slide 13 | definition |
| Uncorrelated: `C_{X,Y}(t_1,t_2)=0 ∀t_1,t_2` (definition; ≠ orthogonal unless zero-mean) | — | §8α | slide 13 | definition |
| Random-phase cosine (WSS edition): `R_X(τ) = (A²/2)cos(2πf₀τ)` for `φ~U[0,2π)` | `random-phase-cosine` | §10 | (Άσκηση 2 preview) | not on sheet |

**Primary Άσκηση 1 computed results (slides 14-19):** For `X(t)=A cos(2πf_1 t+φ)`,
`φ~U[0,π]`: `m_X(t) = -(2A/π)sin(2πf_1 t)` (not WSS); `R_X(t_1,t_2) = (A²/2)cos(2πf_1(t_1-t_2))`
(mόνο διαφορά). For `Y(t)=α cos(2πf_2 t)`, `α~U[0,2]` independent of φ: `R_{X,Y} = m_X(t_1)m_Y(t_2)`,
`C_{X,Y}=0` (ασυσχέτιστες, not ορθογώνιες). These specific values are drill-targets, not
standalone must-learn formulaIds.

**Placement-(a) status:** No standardized must-learn callout. Appropriate (all ΤΔ formulas
are obviously off-sheet; no "✓ Στο τυπολόγιο" inverse errors found).

---

#### 8.6.3 `randomness/stationarity` — slides 20-35

| Must-learn formula / definition | formulaId | Taught | Slide cite | Why not on sheet |
| --- | --- | --- | --- | --- |
| WSS condition 1: `m_X(t) = m_X = const ∀t` | `wss` | §3 | slide 21 | not on sheet |
| WSS condition 2: `R_X(t_i, t_j) = R_X(τ), τ = t_i−t_j` | `wss` | §3 | slide 21 | not on sheet |
| Autocovariance (WSS): `C_X(τ) = R_X(τ) − m_X²` | `wss-rx-properties` | §3α | slide 22 | not on sheet |
| Power from ΣΑΣ: `P_X = R_X(0) = E[X²(t)]` | `wss-rx-properties` | §5 | (direct consequence) | not on sheet |
| `\|R_X(τ)\| ≤ R_X(0)` (maximum at τ=0) | `wss-rx-properties` | §5 | slides 21 area | not on sheet |
| `R_X(−τ) = R_X(τ)` (even symmetry of WSS ΣΑΣ) | `wss-rx-properties` | §5 | — | not on sheet |
| Decomposition: `R_X(τ) = m_X² + R_N(τ)` (DC + zero-mean parts) | — | §7 | slide 27 | not on sheet |
| Asymptotic DC recovery: `m_X = ±√(lim_{\|τ\|→∞} R_X(τ))` | — | §7α | (derived) | not on sheet |
| Ergodicity (mean): `E[x_i(t)] = E[X(t)] = m_X ∀i` | `ergodicity` | §10 | slide 29 | not on sheet |
| Ergodicity (ΣΑΣ): `R_{x_i}(τ) = R_X(τ) ∀i` | `ergodicity` | §11 | slide 30 | not on sheet |
| Time-average definition: `E[x_i(t)] ≜ lim_{T→∞} (1/T) ∫_{-T/2}^{T/2} x_i(t) dt` | — | §9 | slide 28 | not on sheet |

**Canonical results:** `Z(t)=A cos(2πft+θ), θ~U[0,2π)` → WSS with `R_Z(τ)=(A²/2)cos(2πfτ)`,
`m_Z=0`, ergodic (Άσκηση 2+5). For Gaussian ΤΔ: SSS ⟺ WSS (no distinction needed in K21).

**Operational note (slide 30 verbatim):** «Στα ΣΕ, οι ΤΔ υπό μελέτη θεωρούνται (συνήθως)
εργοδικές ως προς τη ΣΑΣ.» — all noise processes in K21 exam problems are assumed ergodic.

**Placement-(a) status:** No standardized must-learn callout. No "✓ Στο τυπολόγιο" inverse
errors. Clean placement-(a) gap for Pass C (lower priority than AM/FM/noise).

---

### 8.7 FM problems — placement-(b) verification (9 problems)

All `topic:'fm'` formulaIds confirmed `inTypology: false` — consistent with §1. No `inTypology`
inconsistencies found across the 9 problems.

| Problem | FM (off-sheet) formulaIds | Cross-check result |
| --- | --- | --- |
| `sept25-th2-6` | `fm-signal`, `fm-instantaneous-freq`, `fm-beta` | All off-sheet ✓ |
| `sept25-th2-7` | `fm-snr-out`, `fm-gain-am`, `carson`, `am-bandwidth`, `am-output-snr` | All off-sheet ✓ |
| `sept25-th2-8` | `fm-beta`, `carson` | Both off-sheet ✓ |
| `sept25-th2-9` | `fm-bessel-sidebands`, `fm-bessel-property`, `carson` | All off-sheet ✓ |
| `jan26-th1-5` | `fm-beta`, `carson` | Both off-sheet ✓ |
| `jan26-th4-fm` | `fm-single-tone`, `fm-beta`, `carson`, `fm-bessel-sidebands`, `fm-power` | All off-sheet ✓ |
| `jun25-th3-fm` | `fm-single-tone`, `fm-beta`, `carson`, `fm-bessel-sidebands`, `fm-power` | All off-sheet ✓ |
| `lec-fm-1` (Session 15 Άσκηση 1) | `fm-single-tone`, `pm-signal` | Both off-sheet ✓ |
| `lec-fm-3` (Session 15 Άσκηση 3) | `fm-bessel-sidebands`, `fm-bessel-property`, `fm-power` | All off-sheet ✓ |

**Placement-(b) verification:**

| Problem | Standardized «δεν δίνεται στο τυπολόγιο» callout? | Ad-hoc awareness? |
| --- | --- | --- |
| `sept25-th2-6` | **NO** | No |
| `sept25-th2-7` | **NO** | No |
| `sept25-th2-8` | **NO** | **YES — INVERSE ERROR (F12)**: coaching ~L506 says «Ο τύπος του Carson είναι στο τυπολόγιο» |
| `sept25-th2-9` | **NO** | No |
| `jan26-th1-5` | **NO** | No |
| `jan26-th4-fm` | **NO** | No |
| `jun25-th3-fm` | **NO** | No |
| `lec-fm-1` | **NO** | No |
| `lec-fm-3` | **NO** | No |

**Conclusion — hypothesis CONFIRMED (same pattern as all prior chapters).** Standardized
placement-(b) callout absent from all 9 FM problems. The sole ad-hoc awareness entry is the
**inverse error F12** — the only coaching note mentioning the τυπολόγιο in the FM context
incorrectly says Carson IS on the sheet. Pass C: propagate «⚠️ Πρέπει να θυμάσαι (όχι στο
επίσημο τυπολόγιο)» to all 9 problems; fix F12 in the process.

---

### 8.8 Remaining random problems — no new gaps

Both `topic:'random'` problems in `exercises.tsx` — `Session 10 — Άσκηση 1` (= `lec-rp-1`,
formulaIds: `random-mean`, `random-autocorr`, `random-cross`) and `Session 10 — Άσκηση 5`
(= `lec-rp-2`, formulaIds: `random-phase-cosine`, `wss`) — were already inventoried in §4.2.
No new `topic:'random'` problems reference `randomness/random-variables`,
`randomness/random-processes`, or `randomness/stationarity` beyond those two. **Zero new gaps.**
Inline ExamProblems in the three pages are not in `exercises.tsx` (same as `randomness/psd`
pattern from §7.4) — placement-(b) concept does not apply to them.

---

## 8B. Pass B — FM Chapter Weighting Results

> **Step:** `mustlearn-passb-fm-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §8 (FM chapter). Weight = count of distinct past-exam exercises that required the formula (either directly or as a key derivation step). References cite `exercises.tsx` problem IDs.

### Exam-paper audit

All theory exam papers in `past_exams/` were visually audited for FM content (images + PDF):

| Exam session | Files | FM problems found | Audit method |
| --- | --- | --- | --- |
| Πρόοδος Απρίλιος 2026 | `προοδος_2026.jpg` | **NONE** — AM/noise/foundations midterm | image read |
| Εξέταση Σεπτεμβρίου 2025 | `2025_sept_exam.jpg` | ΘΕΜΑ 2.6–2.9 (4 FM sub-problems) | image read |
| Επι-πτυχίο Ιανουαρίου 2026 | `Epi-Ptyxio-Jan-26_1.jpg`, `_2.jpg` | ΘΕΜΑ 1.5 (T/F β=0.3 WBFM) + ΘΕΜΑ 4.13–16 (Bessel expansion) | image read (2 pp.) |
| Εξέταση Ιουνίου 2025 Team A | `Syst-Epik-June-2025.pdf` (2 pp., visually read) | ΘΕΜΑ 3.1–3.6 (6 FM sub-problems) | PDF visual read |
| Πρόοδος Α Μαΐου 2025 | `proodos_a1.jpg`, `proodos_a2.jpg` | **NONE** — AM/foundations midterm | image read |
| Πρόοδος Β Μαΐου 2025 | `proodos_b1.jpg`, `proodos_b2.jpg` | **NONE** — AM/foundations midterm | image read |
| Solutions compilation | `systepik-exams-solutions-ΤΗΕΜΑΤΑ-KANELOU.pdf` | Covers same 6 sessions; no additional FM problems | referenced |

**Key structural finding:** FM problems appear **only in the full final exams and Epi-Ptyxio** — the three midterms (Proodos 2026, Proodos A, Proodos B) are AM/foundations-focused and contain **zero FM content**. This means all FM exam weight is concentrated in 3 exam sessions: Sept 2025, Jan 2026, and June 2025.

**Past-exam FM exercise corpus:** 7 distinct exercises (cross-checked against `exercises.tsx`):
`sept25-th2-6`, `sept25-th2-7`, `sept25-th2-8`, `sept25-th2-9`, `jan26-th1-5`, `jan26-th4-fm`, `jun25-th3-fm`. **No additional FM exercises found outside `exercises.tsx`.**

**Cross-reference note for §2B formulas:** `fm-snr-out`, `fm-gain-am`, `fm-snr-ref`, and `am-output-snr` were already counted in §2B via the cross-topic problem `sept25-th2-7` (FM vs AM SNR comparison). For those formulas, §2B is the baseline. Per the step prompt: **note the §2B entry and ADD any additional FM-primary exercises found** — none additional were found. Total weight therefore = §2B weight (1 each).

---

### 8B.1 Core FM signal formulas (§8.1)

#### `fm-signal` — x_FM = A_c cos[2πf_c t + 2πK_f ∫m(τ)dτ]

**Weight: 1**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-6` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.6 | "Εξηγήστε την αρχή λειτουργίας FM — δώστε τη μαθηματική έκφραση του σήματος FM" — general FM signal form is the primary deliverable |

**Note:** The other FM exercises use the **single-tone** form (`fm-single-tone`) or implicitly invoke it. Only `sept25-th2-6` explicitly demands the **general** FM signal expression.

---

#### `fm-instantaneous-freq` — f_i(t) = f_c + K_f m(t)

**Weight: 2** (2 appearances: sept25-th2-6 primary explicit ask, jun25-th3-fm implicit step computing β)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-6` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.6 | "ορίστε τον δείκτη διαμόρφωσης β" — defining β_f = ΔF_max/W = K_f·max\|m\|/W requires stating instantaneous frequency f_i = f_c + K_f m(t) — **primary explicit ask** |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3 | computes β = K_f·A_m/f_m = 1·2/2 = 1 — implicitly invokes f_i = f_c + K_f m(t) (K_f is the frequency sensitivity constant) — **implicit intermediate step** |

---

#### `fm-beta` — β_f = ΔF_max/W = K_f·max\|m\|/W

**Weight: 6** ← tied with `carson` for highest in the FM chapter; tested in all three final-exam sessions

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-6` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.6 | Define FM modulation index β; β_f = ΔF_max/W is the core deliverable |
| `sept25-th2-8` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.8 | m=A_m cos(2πf_m t), f_m=5 kHz, Δf=50 kHz → β_f = Δf/f_m = 50/5 = 10; then Carson B = 2(10+1)·5 = 110 kHz |
| `sept25-th2-9` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.9 | β=2.5 given; student must understand β_f as the sideband count parameter for the Bessel series |
| `jan26-th1-5` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.5 | T/F: β=0.3 → WBFM? ΛΑΘΟΣ — β<1 defines NBFM; β>1 defines WBFM |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.14 | s(t)=10cos(2π·100000t+3sin(2π·1000t)) → read β=3 from signal form; then Carson B = 2(3+1)·1000 = 8 kHz |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.1–3.2 | Sub-1: K_f=1 kHz/V, A_m=2V, W=2 kHz → β=K_f·A_m/W=1; Sub-2: given B₁=16 kHz → β=B/(2W)−1=3 (via Carson inverted) |

---

#### `fm-single-tone` — x_FM = A_c cos[2πf_c t + β_f sin(2πf_m t)]

**Weight: 2**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.13 | s(t)=10cos(2π·100000t+3sin(2π·1000t)) — recognize single-tone FM form to extract A_c=10, f_c=100 kHz, β=3, f_m=1 kHz |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.1–3.2 | m(t)=2cos(2π·2000t) → FM output is single-tone form A_c cos[2πf_ct+β sin(2πf_mt)] |

**Not counted:** `sept25-th2-6` uses the *general* FM signal form (`fm-signal`); `sept25-th2-8` and `sept25-th2-9` implicitly use a single-tone message but their formulaIds tag `fm-beta` + `carson` / `fm-bessel-sidebands` as the primary formulas.

---

### 8B.2 PM formulas (§8.2)

#### `pm-signal` — x_PM = A_c cos[2πf_c t + K_p m(t)]

**Weight: 0**

Only appears in lecture exercise `lec-fm-1` (not a past-exam exercise). No past-exam exercise requires writing the PM signal form as a key step. Pass C should add must-learn callout on `fm/pm` theory page regardless — the exam pattern is to test β_p / Carson for PM, not the signal form directly.

---

### 8B.3 FM power (§8.1–§8.2)

#### `fm-power` — P_FM = A_c²/2 (constant envelope, independent of β)

**Weight: 2**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.16 | "Να υπολογιστεί το ποσοστό ισχύος που μεταφέρεται από το φέρον" — needs P_FM = A_c²/2 = 50 W; carrier fraction = J₀²(3)/1 (via Bessel energy identity) |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.3, 3.6 | Sub-3: "Πόση είναι η ισχύς του FM σήματος;" → P = A_c²/2; Sub-6: "% of power at filter output" → subset of Σ J_n² relative to P_FM |

---

### 8B.4 Bessel formulas (§8.3)

#### `fm-bessel-expansion` — Jacobi-Anger: e^{jβsinθ} = Σ_{n=-∞}^{∞} J_n(β) e^{jnθ}

**Weight: 0**

No past-exam exercise explicitly requires writing or citing the Jacobi-Anger identity by name or formula. The identity is the derivation backbone for `fm-bessel-sidebands`, but exam problems skip directly to the Bessel-sidebands result. **Pass C note:** `fm-bessel-expansion` is a must-learn *derivation tool* rather than a directly evaluated formula — students need it to understand why the Bessel series appears, but the exam tests the result (`fm-bessel-sidebands`).

---

#### `fm-bessel-sidebands` — x_FM = A_c Σ J_n(β_f) cos[2π(f_c + nf_m)t]

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-9` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.9 | β=2.5: (A) "Write Bessel series for FM spectrum" — x_FM = A_c Σ J_n(2.5)cos[2π(f_c+nf_m)t]; (B) "find relative amplitudes for first 3 sideband pairs" using Bessel table |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.15 | "Expand signal using Bessel functions, identify 3 strongest sidebands" for β=3: s(t)=10·Σ J_n(3)cos[2π(100000+n·1000)t] |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.1, 3.5 | Sub-1: "πόσες αρμονικές περιέχονται στο ενεργό εύρος ζώνης;" — count sidebands with significant J_n(β); Sub-5: "πόσες αρμονικές περνάνε από RF filter B_RF=4 kHz?" — identify which Bessel components fall within |

---

#### `fm-bessel-property` — J_{-n}(β) = (−1)^n J_n(β); Σ_n J_n²(β) = 1 (energy identity)

**Weight: 3**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-9` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.9 | (B) "Προσδιορίστε τις σχετικές εντάσεις για τα πρώτα τρία ζεύγη πλευρικών ζωνών" — symmetry J_{-n}=(-1)^n J_n used to read both-side values from Bessel table |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.16 | "% ισχύος που μεταφέρεται από το φέρον" → carrier fraction = A_c² J₀²(3)/2 ÷ P_FM; **energy identity Σ J_n²=1 confirms P_FM = A_c²/2** |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.6 | "% of power at filter output" — compute Σ J_n² for n values within B_RF=8 kHz filter; uses energy identity for normalisation |

---

### 8B.5 Carson's rule (§8.4)

#### `carson` — B ≅ 2W(β+1) = 2(Δf + W)

**Weight: 6** ← tied with `fm-beta` for highest in the FM chapter

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | FM vs AM comparison: FM bandwidth = Carson B=2(β+1)W vs AM bandwidth = 2W; Carson cited explicitly in comparison table |
| `sept25-th2-8` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.8 | β=10 computed, then B = 2(10+1)·5 kHz = 110 kHz — Carson is the primary deliverable |
| `sept25-th2-9` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.9 | (C) "Εκτιμήστε το πρακτικό εύρος ζώνης με τον κανόνα Carson": B ≅ 2(2.5+1)f_m |
| `jan26-th1-5` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.5 | β=0.3 → NBFM (β<1); Carson limit β→0 gives B→2W (same as AM bandwidth) — knowing Carson anchors the NBFM/WBFM distinction |
| `jan26-th4-fm` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 4.14 | β=3, f_m=1 kHz → B = 2(3+1)·1 = 8 kHz — Carson is the primary deliverable of sub-problem 14 |
| `jun25-th3-fm` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 3.2 | Given B₁=16 kHz, W=2 kHz → β = B/(2W)−1 = 3; Carson used in **reverse** to compute β |

**Inverse-error F12 reminder:** `sose-coaching.tsx` ~L506 for `sept25-th2-8` states «Ο τύπος του Carson είναι στο τυπολόγιο» — confirmed WRONG; Carson is `inTypology: false`. Pass C must fix this.

---

### 8B.6 FM-in-noise formulas (§8.5) — cross-reference to §2B

The four noise-chapter formulas that appeared in `sept25-th2-7` were already counted in **§2B** (noise Pass B). Per the step protocol: note §2B as baseline and report any additional FM-primary exercises. **No additional FM exercises beyond `sept25-th2-7` were found for any of these formulas.**

#### `fm-snr-out` — SNR_out,FM = 3β²·SNR_ref

**Total weight: 1** (§2B baseline; no additional FM-primary exercises)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | FM output SNR = 3β²·SNR_ref; listed explicitly in FM column of FM vs AM comparison table |

**→ See §2B for full entry; no additional exercises found in this pass.**

---

#### `fm-gain-am` — G_FM/AM = 9β² (FM advantage over AM, μ=1, equal total power)

**Total weight: 1** (§2B baseline; no additional)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `sept25-th2-7` | Εξέταση Σεπτεμβρίου 2025 · ΘΕΜΑ 2.7 | "FM gain over AM = 9β²"; example β=5 → 225× = 23.5 dB gain |

**→ See §2B for full entry.**

---

#### `fm-snr-ref` — SNR_ref = A_c²/(2N₀W)

**Total weight: 1** (§2B baseline; no additional)

**→ See §2B for full entry (cross-topic `sept25-th2-7`).**

---

#### `fm-noise-output-psd` — S_n^out(f) = N₀f²/A_c² (triangular noise after discriminator)

**Total weight: 0** (§2B confirmed; also confirmed in this FM pass)

`sept25-th2-7` presupposes triangular noise in its derivation of 3β²·SNR_ref, but the qualitative comparison problem does not invoke the triangular-noise formula directly. **No past-exam exercise explicitly derives or evaluates this formula.**

---

### 8B.7 No-formulaId FM entries from §8

| Formula | Exam weight | Note |
| --- | --- | --- |
| NBFM approximation x_NBFM ≈ A_c cos − A_c φ(t) sin | 0 | Conceptually invoked in `jan26-th1-5` (β=0.3 → NBFM), but no exam requires writing the NBFM approximation explicitly |
| P_n,out = N₀W³/(3A_c²) (output noise power) | 0 | No past-exam exercise; `sept25-th2-7` uses 3β²·SNR_ref as a result, not this intermediate |
| PM instant. freq: f_i^PM = f_c + (K_p/2π)dm/dt | 0 | Only in lecture; no past-exam exercise |
| Significant sidebands: N = 2⌊β⌋+3 | 0 | Used as a counting heuristic in Bessel problems but not as a separately-evaluated formula; covered under `fm-bessel-sidebands` |
| WBFM limit β→∞: B→2Δf; NBFM limit β→0: B→2W | 0 | Limits of Carson; invoked conceptually in `jan26-th1-5` but Carson carries the weight |
| Single-tone PM: Δf_PM = K_p A_m f_m | 0 | PM-specific; not tested in any past-exam exercise |

---

### 8B.8 Formulaid tagging gaps discovered during FM Pass B

| Formula | Exercises where untagged but key step | Suggested fix for Pass C |
| --- | --- | --- |
| `fm-instantaneous-freq` | `jun25-th3-fm` (uses K_f·A_m/W to compute β, implicitly using f_i = f_c + K_f m(t)) | Add `fm-instantaneous-freq` to `jun25-th3-fm` formulaIds |

No other significant tagging gaps found. Unlike the AM pass (where `fdm-spacing` was absent from 4 exercises), FM tagging is largely complete.

---

### 8B.9 Coverage gap — no FM exercises in any midterm exam

**Finding:** FM content is **entirely absent** from the three midterm exams (Proodos 2026, Proodos A/B May 2025). All FM exam weight comes from the 3 final/Epi-Ptyxio sessions. This is a pedagogical pattern worth flagging in Pass C coaching: *students who only practice from midterm papers will have zero FM exercise exposure*.

No FM problems were found **outside** `exercises.tsx` — no coverage gap in the exercise bank.

---

### 8B.10 Ranked summary — FM chapter Pass B

| Rank | Formula | formulaId | Weight | Pass C priority |
| --- | --- | --- | --- | --- |
| 1 | β_f = ΔF_max/W (FM modulation index) | `fm-beta` | **6** | HIGH — tested in all 3 final-exam sessions; central to all FM analysis |
| 1 | B ≅ 2W(β+1) (Carson's rule) | `carson` | **6** | HIGH — tested in all 3 final-exam sessions; F12 inverse error in coaching must be fixed |
| 3 | x_FM = A_c Σ J_n cos[2π(f_c+nf_m)t] (Bessel sidebands) | `fm-bessel-sidebands` | **3** | HIGH — every Bessel-type FM problem requires it |
| 3 | J_{-n}=(−1)^n J_n; Σ J_n²=1 (Bessel properties) | `fm-bessel-property` | **3** | HIGH — energy identity is the key for power-fraction problems |
| 5 | A_c cos[2πf_ct+β sin(2πf_mt)] (single-tone FM) | `fm-single-tone` | **2** | HIGH — pattern-recognition for recognizing a given FM signal |
| 5 | P_FM = A_c²/2 (constant FM power) | `fm-power` | **2** | HIGH — required in any power-computation FM problem |
| 7 | x_FM = A_c cos[…+2πK_f∫m dt] (general FM signal) | `fm-signal` | **1** | HIGH — the fundamental definition; F14 inverse error must be fixed |
| 7 | f_i(t) = f_c + K_f m(t) (instantaneous frequency) | `fm-instantaneous-freq` | **2** | HIGH — anchor for understanding K_f and β_f; 2 appearances: sept25-th2-6 explicit + jun25-th3-fm implicit |
| 7 | SNR_out,FM = 3β²·SNR_ref | `fm-snr-out` | **1** | MEDIUM — cross-topic; §2B primary; must-learn callout missing from `fm/in-noise` area |
| 7 | G_FM/AM = 9β² | `fm-gain-am` | **1** | MEDIUM — cross-topic; §2B primary; F14 inverse error ("στο τυπολόγιο" in fm/idea) |
| 7 | SNR_ref = A_c²/(2N₀W) | `fm-snr-ref` | **1** | MEDIUM — cross-topic; §2B primary |
| 12 | x_PM = A_c cos[2πf_ct+K_p m(t)] (PM signal) | `pm-signal` | **0** | LOWER — must-learn; F15 inverse error on fm/pm; no direct exam exercise |
| 12 | e^{jβsinθ} = Σ J_n e^{jnθ} (Jacobi-Anger) | `fm-bessel-expansion` | **0** | LOWER — derivation tool; must-learn for understanding, but exam tests the result |
| 12 | S_n^out = N₀f²/A_c² (triangular FM noise) | `fm-noise-output-psd` | **0** | LOWER — zero direct exam weight (confirmed); must-learn callout still needed on fm/in-noise |
| 12 | FM threshold (~10 dB), capture effect, pre-emphasis | `fm-threshold` + no-id | **0** | LOWER — conceptual must-knows; no formula evaluated in exam |
| 12 | NBFM/WBFM limits, PM distinctions, N=2⌊β⌋+3, P_n,out | various | **0** | LOWER — context/derivation knowledge; no dedicated exam formula |

---

## 3B. Pass B — Foundations Chapter Weighting Results

> **Step:** `mustlearn-passb-foundations-randomness-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §3 (Foundations chapter: signals, systems, Fourier series, Fourier transform, signal-transformations, filters). Weight = count of distinct past-exam exercises that required the formula (either directly or as a key derivation step). References cite `exercises.tsx` problem IDs.

### Exam-paper audit

All six theory exam sessions in `past_exams/` were visually audited for foundations content (images + June 2025 PDF). Same paper corpus as §2B; no additional PDFs.

| Exam session | Files | Foundations exercises found |
| --- | --- | --- |
| Πρόοδος Απρίλιος 2026 | `προοδος_2026.jpg` | ΘΕΜΑ 8 (`proodos26-8`), ΘΕΜΑ 10 (`proodos26-10`) |
| Εξέταση Σεπτεμβρίου 2025 | `2025_sept_exam.jpg` | **NONE** — all AM/FM/noise |
| Επι-πτυχίο Ιανουαρίου 2026 | `Epi-Ptyxio-Jan-26_1.jpg`, `_2.jpg` | ΘΕΜΑ 1.2 (`jan26-th1-2`), ΘΕΜΑ 1.4 (`jan26-th1-4`), ΘΕΜΑ 2.9 (`jan26-th2-9`), ΘΕΜΑ 2.10 (`jan26-th2-10`) |
| Εξέταση Ιουνίου 2025 | `Syst-Epik-June-2025.pdf` (2 pp., visually read) | ΘΕΜΑ 1.1–1.8 (`jun25-th1-1` through `jun25-th1-8`) |
| Πρόοδος Α Μαΐου 2025 | `proodos_a1.jpg`, `proodos_a2.jpg` | ΘΕΜΑ 1.2 (`pa25-th1-2`), ΘΕΜΑ 1.4 (`pa25-th1-4`), ΘΕΜΑ 1.5 (`pa25-th1-5`), ΘΕΜΑ 2.4 (`pa25-th2-4`) |
| Πρόοδος Β Μαΐου 2025 | `proodos_b1.jpg`, `proodos_b2.jpg` | ΘΕΜΑ 1.2 (`pb25-th1-2`), ΘΕΜΑ 1.4 (`pb25-th1-4`), ΘΕΜΑ 1.5 (`pb25-th1-5`), ΘΕΜΑ 2.4 (`pb25-th2-4`) |

**Structural finding:** Foundations content appears in **5 of 6 exam sessions** (only September 2025 is all AM/FM/noise). June 2025 concentrates the most — its entire ΘΕΜΑ 1 (50 pts) covers foundations + noise. The §3 split holds across all sessions: **Fourier pairs/properties dominate (on-sheet, no must-learn callout needed)**; **Fourier series formulas, power/energy, and Parseval are the must-learn core and recur consistently**.

**Must-learn tagging gaps discovered during Pass B (for Pass C) — all FIXED:**
- `cos-power-half` (P = A²/2): was untagged in 3 T/F exercises → **FIXED** in `mustlearn-passc-foundations-signals` (T/F cards tagged; all 6 power-sum + T/F cards have memorizationNote; weight corrected 3→6).
- `fourier-series-rect-pulse`: all 4 exercises wrongly tagged `fourier-pair-rect` → **FIXED** in `mustlearn-passc-tagging-corrections` (tagging) + `mustlearn-passc-foundations-fourier-lti` (memorizationNote on all 4 + theory callout).
- `signal-energy` (E = ∫\|x\|² dt): untagged in `pb25-th4-nonlinear` + `jun25-th2` → **FIXED** in `mustlearn-passc-foundations-signals` (both cards tagged + noted).
- `parseval` (∫\|x\|² dt = ∫\|X\|² df): untagged in `jun25-th2` → **FIXED** in `mustlearn-passc-foundations-fourier-lti` (`jun25-th2` tagged + noted; theory callout on fourier-transform §9).

---

### 3B.1 Fourier series formulas (§3.3)

#### `parseval-power` — P_x = Σ\|aₖ\|² = Σ Aₖ²/2 (power of periodic signal / sum of orthogonal tones)

**Weight: 4** ← highest must-learn weight in the foundations chapter

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `proodos26-10` | Proodos Απρίλιος 2026 · ΘΕΜΑ 10 | Power of m(t)=sin(10πt)+sinc(10t): P_sin = A²/2 = 1/2; sinc is an energy signal (P=0); Parseval-power gives P_total = 1/2 |
| `jan26-th2-9` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.9 | Direct: P = A²/2 + B²/2 + C²/2 for x = Acos(2πf₁t)+Bsin(2πf₂t)+Csin(2πf₃t), f₁≠f₂≠f₃ |
| `pa25-th2-4` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.4 | Same structure: P = A²/2 + B²/2 + C²/2 for three orthogonal tones |
| `pb25-th2-4` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.4 | Same structure: P = A²/2 + B²/2 + C²/2 for three orthogonal tones |

**Exam pattern:** The power-of-sum-of-tones problem appears in **4 distinct exam sessions** (Proodos 2026, Jan 2026, Proodos A, Proodos B) — the single most consistently tested must-learn foundations formula. The same form x = Asin + Bcos + Ccos recurs across the May 2025 midterms and the Jan 2026 Epi-Ptyxio, a clear exam template.

---

#### `fourier-series-rect-pulse` — aₖ = (Aτ/T₀)·sinc(kf₀τ) (FS coefficients of periodic rect-pulse train)

**Weight: 4** ← tied with `parseval-power`

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `jun25-th1-5` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.5 | Draw periodic rect pulse (τ=1s, T=10s) spectrum: aₖ = (τ/T)sinc(kτ/T) = 0.1·sinc(k/10) is the primary deliverable |
| `jun25-th1-6` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.6 | Vary τ→4s, recompute: aₖ = 0.4·sinc(0.4k); first null at k=2.5; direct application of same formula |
| `jun25-th1-8` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 1.8 | "What should Aₖ be for x(t) to describe a periodic rect-pulse train?": answer Aₖ = (2Aτ/T)·sinc(kf₀τ) (single-sided form) |
| `jan26-th1-4` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.4 | T/F: "FS envelope of τ=1s rect is narrower than τ=0.1s" — ΛΑΘΟΣ; requires knowing sinc envelope width = 1/τ (inverse time-BW) from the aₖ sinc shape |

**Pass C status:** Tagging fixed in `mustlearn-passc-tagging-corrections` (all 4 now have `fourier-series-rect-pulse` in formulaIds). memorizationNote added to all 4 cards + theory callout added to `foundations/fourier-series` §rect-pulse example in `mustlearn-passc-foundations-fourier-lti`. getCitedExercises('fourier-series-rect-pulse')=4. DONE.

---

#### `fourier-series-analysis` — aₖ = (1/T₀)∫₀^{T₀} x(t) e^{−j2πkf₀t} dt (general FS analysis)

**Weight: 0** — The general analysis integral is the derivation route to `fourier-series-rect-pulse`. No past-exam exercise requires writing the general formula from scratch.

**Pass C note:** Must-learn callout required on `foundations/fourier-series` theory page (the entire FS chapter is off-sheet). Exam weight zero; low badge priority.

---

#### `fourier-series-synthesis`, `fourier-series-dual-form`, `fourier-orthogonality`, `fourier-series-conjugate-symmetry`, `lti-output-fourier-series` (bₖ = H(kf₀)·aₖ)

**Weight: 0 each** — Structural FS formulas; no past-exam exercise isolates them.

---

### 3B.2 Signal energy and power (§3.1)

#### `cos-power-half` — P = A²/2 for A·cos(2πf₀t + φ) or A·sin(2πf₀t + φ)

**Weight: 6** (corrected — Pass B under-counted at 3; the 3 power-sum cards already tagged at Pass B time add 3 more)

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `jan26-th1-2` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 1.2 | T/F: "m(t)=cos(2πt) είναι σήμα ισχύος" — ΣΩΣΤΟ; P = A²/2 = 1/2 < ∞, E = ∞ |
| `pa25-th1-2` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 1.2 | Identical T/F; same formula |
| `pb25-th1-2` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 1.2 | T/F: "m(t)=cos(2πt) είναι σήμα ενέργειας" — ΛΑΘΟΣ; P = 1/2 → power signal |
| `jan26-th2-9` | Επι-πτυχίο Ιανουαρίου 2026 · ΘΕΜΑ 2.9 | Computation: ισχύς αθροίσματος 3 τόνων → A²/2 + B²/2 + C²/2 per tone |
| `pa25-th2-4` | Πρόοδος Α Μαΐου 2025 · ΘΕΜΑ 2.4 | Computation: ισχύς Asin+Bcos+Ccos → (A²+B²+C²)/2 |
| `pb25-th2-4` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 2.4 | Computation: ισχύς Asin+Bcos+Ccos → (A²+B²+C²)/2 |

**Exam pattern:** Appears in all **3 exam sessions** in TWO distinct forms: (1) T/F "is cos a power signal?" (Jan/Pa/Pb ΘΕΜΑ 1.2) and (2) computation of sum-of-sinusoids power (Jan/Pa/Pb ΘΕΜΑ 2.4/.9). The formula is A²/2 per tone in both contexts.

**Pass C status (step mustlearn-passc-foundations-signals):** DONE — `formulaIds: ['cos-power-half']` added to all 3 T/F cards; `memorizationNote` added to all 6 cards; theory callout added to `foundations/signals` after the derivation Example. getCitedExercises('cos-power-half') = 6. All prose says «βάρος 6 παλιά θέματα». §3B.4 weight updated to 6.

---

#### `signal-energy` — E_x = ∫_{-∞}^{∞} \|x(t)\|² dt

**Weight: 2**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `pb25-th4-nonlinear` | Πρόοδος Β Μαΐου 2025 · ΘΕΜΑ 4 (sub-q 1) | "Find a such that energy of m(t)=a·Π(2Wt) equals 1": E = a²·(1/2W) = 1 → a = √(2W); direct integral of rect² |
| `jun25-th2` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 2 (sub-q 4) | "Υπολογίστε τη συνολική ενέργεια του πολυπλεγμένου σήματος": E_total = E_{x_m} + E_{x_k} (orthogonal carriers); `signal-energy` opens the problem |

**Pass C status (step mustlearn-passc-foundations-signals):** DONE — `signal-energy` added to `formulaIds` of both exercises; existing `memorizationNote` extended with signal-energy flag + weight + cross-ref chip; theory callout added to `foundations/signals` after the E_x formula. getCitedExercises('signal-energy') = 2.

---

#### `parseval` — ∫\|x(t)\|² dt = ∫\|X(f)\|² df (general FT Parseval)

**Weight: 1**

| Exercise | Exam (problem) | How used |
| --- | --- | --- |
| `jun25-th2` | Εξέταση Ιουνίου 2025 · ΘΕΜΑ 2 (sub-q 4) | Energy of sinc(Wt): E = ∫\|M(f)\|² df = (1/W)² · W = 1/W; Parseval bridges E from time to frequency domain for the sinc signal |

**Note:** `signal-energy` and `parseval` co-appear in `jun25-th2` sub-q 4: the definition E = ∫\|x\|² opens it; Parseval computes the sinc signal energy from its known rect spectrum.

---

#### `signal-power` — P_x = lim_{T→∞} (1/2T) ∫_{-T}^{T} \|x(t)\|² dt

**Weight: 0** — General power formula is background. The specific result P = A²/2 (`cos-power-half`) is what the exams test. No exercise requires writing the general limit formula.

---

### 3B.3 LTI systems formulas (§3.2) and other foundations formulas

#### `convolution-definition`, `convolution-properties`, `lti-frequency-response`, `lti-eigenfunction`, `lti-cosine-response`, `bibo-stability`

**Weight: 0 each** — No past-exam foundations exercise requires computing H(f₀) from the definition integral, writing the convolution integral from scratch, or deriving the LTI cosine response. On-sheet FT tools (convolution theorem, multiplication dual) handle all exam spectrum-bandwidth calculations. The time-domain convolution definition is not directly tested in the 22 foundations exercises.

**Pass C note:** All §3.2 formulas are must-learn (all off-sheet) with zero direct past-exam weight. Add callouts on `foundations/systems` theory page. Their exam weight appears in AM/FM/noise chapters where LTI filtering is applied.

---

### 3B.4 Ranked summary — Foundations chapter Pass B

| Rank | Formula | formulaId | Weight | Pass C priority |
| --- | --- | --- | --- | --- |
| 1 | P = Σ Aₖ²/2 (power of sum of orthogonal tones) | `parseval-power` | **4** | **PASS-C DONE** — theory callout on fourier-series §Parseval; proodos26-10 note added; power-sum trio notes extended; getCitedExercises=4 |
| 1 | aₖ = (Aτ/T₀)sinc(kf₀τ) (FS rect-pulse coefficients) | `fourier-series-rect-pulse` | **4** | **PASS-C DONE** — theory callout on fourier-series §rect-pulse; all 4 cards memorizationNote added; tagging fixed in prior step; getCitedExercises=4 |
| 3 | P = A²/2 (power of sinusoid) | `cos-power-half` | **6** (corrected; 3 T/F + 3 power-sum) | **PASS-C DONE** — all 6 cards tagged + theory callout; getCitedExercises=6 |
| 4 | E_x = ∫\|x(t)\|² dt (signal energy) | `signal-energy` | **2** | **PASS-C DONE** — both cards tagged + theory callout; getCitedExercises=2 |
| 5 | ∫\|x\|²dt = ∫\|X\|²df (general Parseval) | `parseval` | **1** | **PASS-C DONE** — theory callout on fourier-transform §9; jun25-th2 tagged + note extended; getCitedExercises=1 |
| 6 | All FS structural formulas (synthesis, analysis-general, orthogonality, conjugate-sym., bₖ=H·aₖ) | various | **0** | MEDIUM — entire FS chapter is off-sheet; callouts needed on `foundations/fourier-series` theory page |
| 6 | All LTI systems formulas (convolution-def, freq-response, eigenfunction, BIBO) | various | **0** | MEDIUM — all must-learn; zero direct weight; invoked via AM/FM/noise chapters |
| 6 | dB gain: 20·log₁₀\|H(f)\| | `filter-gain-db` (formulas.tsx L724, weight 0) | **0** | LOWER — only in inline ExamProblem on filters page; no standalone past-exam exercise; wire must-learn flag in Pass C |
| 6 | signal-power, dc-rms, delta props, periodicity conds, even/odd | various | **0** | LOWER — must-learn callouts on `foundations/signals` theory page; no direct past-exam test |

---

## 4B. Pass B — Randomness/Why Chapter Weighting Results

> **Step:** `mustlearn-passb-foundations-randomness-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §4 (randomness/why page: 1 theory page + 2 lecture problems). Weight = count of distinct past-exam exercises that required the formula.

### Headline finding

> **Zero past-exam exercises test the §4 randomness/why formulas directly.** All 6 exam sessions have zero standalone problems that ask students to compute E[X(t)], verify R_X(t₁,t₂) = R_X(τ), or state WSS conditions. The two exercises in §4.2 (`lec-rp-1`, `lec-rp-2`) are **lecture problems**, not past-exam problems — they originate from Session 10 lecture examples, not any exam in `past_exams/`.

### Per-formula weights

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| m_X(t) = E[X(t)] = ∫a f_{X(t)}(a) da (mean / μέση τιμή) | `random-mean` | **0** | Lecture exercise only (`lec-rp-1`); no past-exam standalone |
| R_X(t₁,t₂) = E[X(t₁)X(t₂)] (autocorrelation / ΣΑΣ) | `random-autocorr` | **0** | Lecture exercise only (`lec-rp-1`) |
| R_{X,Y}(t₁,t₂) = E[X(t₁)Y(t₂)] (cross-correlation / ΕΣ) | `random-cross` | **0** | Lecture exercise only (`lec-rp-1`) |
| WSS: m_X = const AND R_X(t₁,t₂) = R_X(τ) | `wss` | **0** | Lecture exercise only (`lec-rp-2`); noise problems assume WSS but never ask students to verify it |
| Ergodicity: time-average = ensemble-average | (within `wss`) | **0** | Conceptual label; no formula to evaluate in exam |
| S_X(f) = F{R_X(τ)} (WK teaser, forward-look) | `wiener-khinchin` | cross-ref §2B (3) | Primary home `randomness/psd` (§7B); already weighted in §2B |
| P_X = R_X(0) = ∫S_X df (WK consequence, forward-look) | `wss-rx-properties` | cross-ref §2B | Primary home §7B; already counted in §2B |

### Pass C note

Zero past-exam weight ≠ unimportant. These are the **vocabulary** every noise/modulation derivation uses (WSS assumption, E[X(t)] in mean computations, R_X in Wiener–Khinchin). Add must-learn markers on the `randomness/why` and `randomness/random-processes` theory pages, and on the two lecture problems. Priority: lower than high-weight noise/AM/FM formulas.

---

## 5B. Pass B — Modulation Bridge Weighting Results

> **Step:** `mustlearn-passb-foundations-randomness-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §5 (modulation/bridge page). Weight = count of distinct past-exam exercises.

### Headline finding

> **Zero past-exam exercises test bridge-specific formulas (pre-envelope, complex envelope, bandpass spectrum) in isolation.** The bridge page is a theoretical connector; its formulas underlie AM/FM/noise but are never standalone-examined. The only bridge formulaId with past-exam weight is `iq-decomposition` — but its weight comes from AM/FM/noise-chapter exercises already counted in §2B, §6B, §8B.

### Per-formula weights

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| Pre-envelope: x_p(t) = x(t) + j·x̂(t) | — | **0** | Theoretical; not standalone tested |
| Complex envelope: g(t) = x_p(t)·e^{−j2πfct} | — | **0** | Theoretical; not standalone tested |
| x(t) = Re{g(t)·e^{j2πfct}} | — | **0** | Not standalone tested |
| I/Q canonical: x = x_I cos(2πfct) − x_Q sin(2πfct) | `iq-decomposition` | **0** direct | No past-exam exercise explicitly tests the general I/Q form; specific AM/FM/noise results carry the exam weight (counted in §2B, §6B, §8B) |
| Envelope + phase: V = √(x_I²+x_Q²), θ = arctan(x_Q/x_I) | (within `iq-decomposition`) | **0** | Not standalone tested |
| Bandpass spectrum: X(f) = ½[G(f−fc) + G*(−f−fc)] | — | **0** | Not standalone tested |
| Five-modulation table: AM/DSB/SSB/FM/PM (x_I, x_Q per scheme) | (per-scheme ids in AM/FM chapters) | counted in §6B/§8B | Each row's exam weight credited to respective AM/FM chapter |

### Pass C note

Bridge must-learn callouts: all four non-Hilbert formulas (pre-envelope, complex envelope, I/Q canonical, bandpass spectrum) lack the standard «⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο» callout. Fix F7 (line 275 I/Q "✓ Στο τυπολόγιο" → must-learn). Low exam-weight priority — the concepts are tested through AM/FM/noise problems, not through bridge-page questions.

---

## 7B. Pass B — Randomness/PSD + Remaining Randomness Weighting Results

> **Step:** `mustlearn-passb-foundations-randomness-formulas` · **Status:** DONE  
> **Scope:** every must-learn formula in §7 (randomness/psd, foundations/filters, foundations/signal-transformations) and §8.6 (random-variables, random-processes, stationarity).

### Exam-paper audit

Same 6-session corpus as §2B. The inline ExamProblems embedded in `randomness/psd/page.mdx` (`psd-from-rx`, `rx-from-psd`, `lti-output-psd`, `psd-properties`, `white-noise-correlation`, `psd-thermal-lpf`, `psd-bandpass-power`) are **NOT** in `exercises.tsx` and have no companion coaching in `sose-coaching.tsx` — placement-(b) concept does not apply. No standalone `topic:'random'` exercises exist in `exercises.tsx` beyond the two lecture exercises already swept in §4.2.

### Overlap rule applied

Per step specification — these §7 formulas were already counted in §2B (noise chapter Pass B):
- **`lti-output-psd`** (S_Y = \|H\|²S_X): §2B weight = 3 (proodos26-6, sept25-th3-11, jun25-th1-10). **No additional exercises found** in a pure-randomness context. Cross-reference §2B; do not re-count.
- **`wiener-khinchin`** (R_X ↔ S_X): §2B weight = 3 (same three exercises). **No additional exercises found.** Cross-reference §2B; do not re-count.

### 7B.1 `randomness/psd` formulas (§7.3)

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| S_X(f) = F{R_X(τ)} (WK forward) | `wiener-khinchin` | **cross-ref §2B (3)** | No additional exercises in pure-randomness context beyond §2B entries |
| R_X(τ) = F⁻¹{S_X(f)} (WK inverse) | `wiener-khinchin` | same entry | Same |
| P_X = R_X(0) = ∫S_X df (power consequence) | `wss-rx-properties` | **0** direct | The P_X=R_X(0) consequence is used in noise power problems (proodos26-6 etc.) but credited to `wiener-khinchin` in §2B; no exercise tests `wss-rx-properties` in isolation |
| PSD properties: S_X ∈ ℝ, S_X(−f)=S_X(f), S_X≥0 | `wss-rx-properties` | **0** | No past-exam exercise tests these properties directly |
| ESD: F{R_x(τ)} = \|X(f)\|² (energy signal identity) | — (no formulaId) | **0** | Inline psd-page ExamProblems only; not in standalone exercise bank |
| LTI ΣΑΣ chain: R_Y(τ) = R_X(τ)∗h(τ)∗h(−τ) | — | **0** | Intermediate derivation step; not directly examined |
| S_Y(f) = \|H(f)\|²S_X(f) (LTI output PSD) | `lti-output-psd` | **cross-ref §2B (3)** | Co-primary teaching home here; no additional exercises beyond §2B |
| e^{−a\|τ\|} ↔ 2a/(a²+(2πf)²) (exponential FT pair, F13) | — (no formulaId; needs `fourier-pair-exp`) | **0** | Page says "2–3 times/year" — refers to inline PSD ExamProblems, NOT the standalone past-exam bank; zero exercises in `exercises.tsx` require this pair explicitly |
| S_{X,Y}(f) = F{R_{X,Y}(τ)} (cross-PSD) | — | **0** | No past-exam exercise |

### 7B.2 Remaining randomness formulas (§8.6.1–§8.6.3)

**`randomness/random-variables` (§8.6.1):** Zero new must-learn entries specific to K21 — confirmed in Pass A. All formulas (E[X], Var[X], linearity, LOTUS, Gaussian pdf) belong to the prerequisite course.

**`randomness/random-processes` (§8.6.2):**

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| m_X(t) = E[X(t)] | `random-mean` | **0** | Lecture exercise only (`lec-rp-1`) |
| R_X(t_i,t_j) = E[X(t_i)X(t_j)] | `random-autocorr` | **0** | Lecture only |
| C_X(t_i,t_j) = R_X − m_X(ti)m_X(tj) (autocovariance) | (within `random-autocorr`) | **0** | Lecture only |
| R_{X,Y}(t₁,t₂) = E[X(t₁)Y(t₂)] | `random-cross` | **0** | Lecture only |
| Orthogonal / uncorrelated definitions | — | **0** | No formula to evaluate |
| R_X(τ) = (A²/2)cos(2πf₀τ) (random-phase cosine) | `random-phase-cosine` | **0** | Lecture only (`lec-rp-2`) |

**`randomness/stationarity` (§8.6.3):**

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| WSS cond 1: m_X(t) = const | `wss` | **0** | Lecture only (`lec-rp-2`) |
| WSS cond 2: R_X(t_i,t_j) = R_X(τ) | `wss` | **0** | Same |
| \|R_X(τ)\| ≤ R_X(0); R_X(−τ) = R_X(τ) (ΣΑΣ properties) | `wss-rx-properties` | **0** | No direct test |
| Decomp: R_X(τ) = m_X² + R_N(τ) | — | **0** | No direct test |
| Ergodicity: time-average = ensemble-average | `ergodicity` | **0** | Operational assumption stated on slide 30; no formula evaluated |

**`foundations/filters` (§7.2):**

| Formula | formulaId | Weight | Note |
| --- | --- | --- | --- |
| dB gain: 20·log₁₀\|H(f)\| | `filter-gain-db` (formulas.tsx L724, weight 0) | **0** | Only in inline ExamProblem `filter-db-conversion` on filters page; no standalone past-exam exercise; wire must-learn flag in Pass C |
| dB inversion: \|H\| = 10^{−dB/20} | — | **0** | Same |

### 7B.3 Ranked summary — §7 + remaining randomness Pass B

| Rank | Formula | formulaId | Weight | Pass C priority |
| --- | --- | --- | --- | --- |
| 1 | S_Y = \|H\|²S_X (LTI output PSD) | `lti-output-psd` | **cross-ref §2B (3)** | HIGH — co-primary teaching home; must-learn callout missing from psd page (ambiguous "✓ μέσω αλυσίδας" label); fix alongside noise/through-filters §8στ wording |
| 1 | R_X(τ) ↔ S_X(f) (Wiener–Khinchin) | `wiener-khinchin` | **cross-ref §2B (3)** | **PASS-C DONE** — warning callout added after §2 theorem box; inline `\text{}` at power formula cleaned up; all 3 cards tagged |
| 3 | P_X = R_X(0) (power-from-ΣΑΣ) | `wss-rx-properties` | **0** direct | HIGH — implicit in every PSD power-computation (credited via §2B); ambiguous "✓ μέσω WK" label needs explicit must-learn fix |
| 4 | e^{−a\|τ\|} ↔ 2a/(a²+(2πf)²) (exponential FT pair, F13) | — (needs `fourier-pair-exp`) | **0** | HIGH — no standalone exam weight but page flags as frequent; F13 inverse error ("τυπολόγιο") must be fixed; add `fourier-pair-exp` to `formulas.tsx` |
| 5 | All randomness process definitions (E[X], R_X, WSS, ergodicity) | various | **0** | MEDIUM — vocabulary; must-learn callouts on randomness theory pages; lecture-only exercises |
| 6 | PSD properties, ESD identity, LTI ΣΑΣ chain, cross-PSD | various | **0** | MEDIUM — theoretical tools; callouts needed on psd page |
| 7 | dB gain (filters) | `filter-gain-db` (formulas.tsx L724, weight 0) | **0** | LOWER — no standalone past-exam exercise; wire must-learn flag in Pass C |

---

## 9. Cross-chapter flags & discoveries (for the planner — surfaced via bus/inbox)

- **F1 — LIVE MISCITATION (correctness).** `app/(content)/noise/white-noise/page.mdx`
  **line 340** (§10 summary table) marks `S_N(f) = N_0/2` as **"✓ τυπολόγιο"** — i.e. it
  tells students this is on the exam sheet and need not be memorised. **It is NOT on the
  sheet** (§1 ground truth) — confirmed by `formulas.tsx` (`white-noise-psd` is
  `inTypology: false`) and contradicted on the *same chapter* by `through-filters §8στ`,
  which correctly calls the noise formulas «όχι στο επίσημο τυπολόγιο». This is exactly the
  inverse-pattern inconsistency the owner flagged (`inbox/001` §2c). **Recommend a focused
  correction step** (Pass C scope, `noise/**`): flip that cell to the must-learn signal.
  Not fixed here — this step writes only the planning doc.
- **F2 — Several must-learn noise formulas have NO `FORMULA_SHEET` entry** ← PARTIALLY RESOLVED.
  **F2(1) RESOLVED (step mustlearn-passc-noise-f2-entries):** `bandlimited-noise-power` (`P_N=N_0 B`, weight 5) and
  `bandlimited-noise-autocorr` (`R_N=N_0 B·sinc(2Bτ)`, weight 1) CREATED in formulas.tsx (both `derivedIn:
  'noise/white-noise'`, `inTypology: false`). Principal decision 0001: `N_0≈−174 dBm/Hz` stays PAGE-ONLY.
  **Still unresolved (F2 remainder):** equivalent noise bandwidth `B_N`; RC power `πN_0 f_c/2` & RC ΣΑΣ;
  one-sided `N_0`; noise-floor dBm rule & `T_total`; random-process I/Q decomposition; general joint-WSS `R_N`;
  down-convert-&-fold component spectra; input SNR; processing gain; differentiator `\|H\|²=(2πf)²`.
  These remain page-only must-learns pending future principal decisions.
- **F3 — Placement-(a) is inconsistent across the chapter** (see §2 observation):
  through-filters §8στ correct; white-noise §10 wrong (F1); sources/bandpass/snr use ad-hoc
  "μάθε απέξω". Pass C should propagate the §8στ wording uniformly.
- **F4 — `∫du/(1+u²)=arctan` is NOT on the τυπολόγιο** (p.3 lists only `∫1/cos²=tan`,
  `∫1/sin²=−cot`). `through-filters §6α` calls it "τυπολόγιο integral 7-8 σχετικά" — loose
  (it says "related", not "on the sheet"), so not a hard error, but the integral behind the
  RC result `P_Y=πN_0 f_c/2` is itself must-derive/remember. Minor wording flag for Pass C.
  **F4 addendum (`randomness/psd`):** `ExamProblem id="lti-output-psd"` coaching Callout says
  "το ολοκλήρωμα `∫1/(1+x²)dx = arctan x` **είναι στο τυπολόγιο**" — a stronger (and wrong)
  claim than through-filters §6α's "σχετικά". Same integral, harder instance. Pass C should fix
  both pages consistently.
- **F5 — `/noise/snr` is thin / pre-D11-rework** (`lastUpdated 2026-05-05`, no 5-stage
  loop, SourceDoc has no slide numbers). Its must-learn formulas (§2.5) are recap-heavy
  (AM/FM). When D11 reworks it, the must-learn flags should be baked in (coordinate Pass C
  with D11 to avoid double-touch — same logic as the noise-exercise ordering call).
- **F6 — `jun25-th1-10` `formulaId` mis-tag ← RESOLVED (step mustlearn-passc-noise-f2-entries).**
  Dropped `bandpass-noise-r` (carrier form, wrong for LPF+HPF problem); added `bandlimited-noise-power`
  and `bandlimited-noise-autocorr` (the LPF ΣΑΣ `R_Y=N_0 W·sinc(2Wτ)` correctly tagged). `bandpass-noise-r`
  still exists in formulas.tsx (correctly tagged to `noise/through-filters` for the bandpass exercise §8δ);
  its weight-0 status confirmed (§2B.1). Full detail in §2.7. (Surfaced via `bus/inbox/010`.)
- **PROBLEM-SIDE placement-(b) RESULT (owner hypothesis CONFIRMED).** §2.7 verified per
  problem: the **standardised** «δεν δίνεται στο τυπολόγιο» must-learn callout is **absent
  from all 8** noise problems (solution + coaching). Two coaching entries carry **ad-hoc**
  "learn-by-heart" prose (`jun25-th1-9`, `sept25-th3-10`) that does **not** name the
  τυπολόγιο — same ad-hoc/standardised split as theory-side **F3**. The 3 conceptual T/F
  problems (`jan26-th1-3`/`pa25-th1-3`/`pb25-th1-3`) use no formula → no placement-(b)
  target. Pass C: propagate the §8στ wording across the 5 formula-bearing problems; leave
  the 3 conceptual ones alone.
- **Beyond-scope discoveries surfaced to the planner (`bus/inbox/010`):** (1) `jun25-th1-10`
  is a "Σχεδιάστε" (DRAW) problem with a text-only answer → bespoke-viz candidate for the
  Phase-2 noise-exercise rework. (2) `pb25-th1-5` coaching (foundations, NOT noise) tells
  students an **on-sheet** formula (`fourier-pair-tri`, `sinc²`) must be memorised — the
  *inverse* error; flag for the foundations must-learn pass.

---

- **F7 — BRIDGE PAGE CANONICAL I/Q INVERSE ERROR (correctness).** `modulation/bridge` page line 275
  labels the canonical I/Q form `x = x_I cos(2πf_c t) − x_Q sin(2πf_c t)` as **"✓ Στο
  τυπολόγιο"**. This is wrong on three grounds: (a) `formulas.tsx` tags `iq-decomposition` as
  `inTypology: false`, (b) `foundations/signals` line 341 explicitly states «η μορφή αυτή ΔΕΝ
  είναι μέσα στο επίσημο τυπολόγιο», (c) §1 ground-truth audit does not list the I/Q canonical
  form anywhere in the three sheet pages. The bridge page contradicts both `formulas.tsx` and the
  signals page. Students who encounter the bridge page first may fail to memorize a must-learn
  formula. Same inverse-pattern as F1. **Recommend Pass C fix:** change line 275 label from
  "✓ Στο τυπολόγιο" to the standard must-learn callout: «⚠️ Πρέπει να θυμάσαι — δεν δίνεται
  στο τυπολόγιο».
- **F8 — pb25-th1-5 / pa25-th1-5 COACHING INVERSE ERROR (correctness).** `sose-coaching.tsx`
  entry for `pb25-th1-5` (takeaway section, confirmed by direct read) says: *«Είναι από τα
  standard Fourier pairs που πρέπει να ξέρεις απ' έξω»* — referring to the sinc² envelope of a
  triangular pulse (`fourier-pair-tri`, `Λ(t/T) ↔ T·sinc²(fT)`). But `fourier-pair-tri` IS on the
  sheet (§1 p.1; `formulas.tsx` `inTypology: true`). Identical coaching text appears in the sibling
  `pa25-th1-5` entry. This is the inverse of F1: the site tells students to memorize an on-sheet
  formula. **Recommend Pass C fix:** both problem coaching entries need the wording changed to
  «✓ Στο τυπολόγιο — δεν χρειάζεται αποστήθιση» for the `fourier-pair-tri` formula.
- **F9 — `parseval-power` must-learn callout ABSENT from all foundations problem coaching.**
  `parseval-power` (power of sum of tones: P = Σ Aₖ²/2) is the key must-learn formula used in
  foundations problems about power calculations (pa25-th2-4, pa25-th2-9, pb25-th2-4, pb25-th2-9,
  jan26-th2-4, others). Grep of `sose-coaching.tsx` for "parseval" and "τυπολόγιο" in the
  foundations context: **zero matches**. Unlike the noise problems (which had at least some ad-hoc
  "learn-by-heart" prose), the foundations problem coaching has **no awareness at all** of the
  must-learn status for this formula. Clean placement-(b) gap for Pass C.
- **F10 — UNREAD FOUNDATIONS PAGES. ✅ RESOLVED (`mustlearn-inventory-foundations-supplemental`).**
  Both pages read directly in §7. Findings: `signal-transformations` confirmed zero new must-learn
  formulas (reference page for on-sheet FT properties — all transformations derive from on-sheet
  scaling, shift, duality). `filters` contributes one must-learn (dB gain:
  $20\log_{10}\lvert H(f)\rvert$, slide 46; `filter-gain-db` already exists at formulas.tsx L724,
  inTypology:false — no new entry needed, Pass C wires must-learn flag) and confirms RC shape
  $\lvert H\rvert^2=1/(1+(f/f_c)^2)$ is already in §2.3. See §7.1–§7.2 for full inventory.
- **F11 — FT DEFINITION formulaId UNCERTAIN.** `X(f) = ∫x(t)e^{−j2πft}dt` (and its inverse) are
  the most fundamental formulas in the FT chapter. The sheet appears to list only the pairs/
  properties table, not the definition integral explicitly (§1 p.1 description). Whether there is
  a dedicated `fourier-definition` formulaId in `formulas.tsx`, and whether it is `inTypology:
  false`, was not verified in this step. Flagged; verify in Pass C or the FT-page-specific pass.
- **F12 — FM COACHING INVERSE ERROR (correctness).** `sose-coaching.tsx` (~line 506) coaching for
  an FM problem states «Ο τύπος του Carson είναι στο τυπολόγιο» — referring to Carson's bandwidth
  rule `B_c = 2(β+1)f_m`. Per §1 ground truth, the τυπολόγιο has **zero FM formulas**;
  `formulas.tsx` tags `fm-carson-bandwidth` as `inTypology:false`. This is the same inverse-error
  pattern as F1 and F8: an off-sheet formula is described as if it were on the sheet. Surfaced
  during the AM inverse-error sweep (§6.9) — outside AM scope, logged here for the planner.
  **Recommend Pass C fix:** change wording to «⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο»
  for the Carson formula coaching entry.
- **F13 — `randomness/psd` EXPONENTIAL FT PAIR INVERSE ERROR (correctness).** `ExamProblem
  id="psd-from-rx"` Example solution labels the pair $e^{-a\lvert\tau\rvert} \leftrightarrow
  2a/(a^2+(2\pi f)^2)$ as **"Από το γνωστό FT pair (τυπολόγιο)"** — implying it is on the exam
  formula sheet. It is **NOT**: the sheet's FT-pairs table (§1 p.1) lists δ, rect, tri, cos, sin,
  and 1/t — no exponential pair. `formulas.tsx` has no `fourier-pair-exp` entry. The `Callout`
  preceding the solution and the `Take-away` following it correctly say "must-memorize" and
  "πρέπει να **το έχεις απ' έξω**" — directly contradicting the Example body's "(τυπολόγιο)"
  label. Same inverse-error pattern as F1/F7/F8/F12: a student reading only the Example body
  may conclude they do not need to memorize the pair. **Recommend Pass C fix:** replace
  "(τυπολόγιο)" in the Example solution with «⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο
  τυπολόγιο». Also recommend adding a `fourier-pair-exp` entry to `formulas.tsx` (currently
  no formulaId — F2-style gap) since this pair appears "2-3 times per year" in past exams per
  the page's own note.
- **F14 — fm/idea MULTIPLE INVERSE ERRORS (correctness).** `app/(content)/fm/idea/page.mdx`
  labels **four** must-learn FM formulas as "✓ Στο τυπολόγιο":
  (1) `fm-signal` (line 170) — `inTypology: false`;
  (2) `fm-beta` β_f (line 221) — `inTypology: false`;
  (3) `fm-single-tone` (line 248) — `inTypology: false`;
  (4) `fm-gain-am` (9β²) described as "στο τυπολόγιο" in the ThinkingPattern (~line 540) —
  `inTypology: false` and `fm/in-noise` itself correctly says "πρέπει να θυμάσαι — δεν μέσα
  στο επίσημο τυπολόγιο" for this formula.
  Per §1, the τυπολόγιο has **zero FM formulas**. Same pattern as F1/F7/F8/F12/F13.
  **Recommend Pass C fix:** replace all "✓ Στο τυπολόγιο" labels on `fm-signal`, `fm-beta`
  (β_f), `fm-single-tone`, and the 9β² ThinkingPattern description with «⚠️ Πρέπει να
  θυμάσαι — δεν δίνεται στο τυπολόγιο».
- **F15 — fm/pm INVERSE ERRORS including Carson contradiction (correctness).**
  `app/(content)/fm/pm/page.mdx` labels **two** must-learn formulas as "✓ Στο τυπολόγιο":
  (1) `fm-beta` β_p (line 94: "✓ Στο τυπολόγιο (μαζί με β_f)") — `inTypology: false`;
  (2) `carson` (line 222: "✓ Στο τυπολόγιο (στο /fm/carson)") — `inTypology: false`.
  The (2) **directly contradicts** `fm/carson/page.mdx` line 68, which correctly labels
  Carson must-learn ("⚠️ Πρέπει να θυμάσαι — δεν είναι μέσα στο [επίσημο τυπολόγιο]"),
  and sose-coaching F12 (also inverse error on Carson). The same Carson formula now has
  **three inconsistent treatments**: correct on `fm/carson`, inverse-error on `fm/pm`,
  inverse-error in `sose-coaching`. **Recommend Pass C fix:** replace both "✓ Στο
  τυπολόγιο" labels with «⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο»; coordinate
  with F12 fix so all three sites say the same thing.

---

## 10. Placeholders for later passes (do not delete — structure for the whole sub-goal)

- **Pass A — COMPLETE.** All chapters inventoried: Noise §2, Foundations §3, Randomness/why §4, Modulation bridge §5, AM §6, Foundations-supplemental + PSD §7, FM + remaining-randomness §8. Proceed to Pass B.
- **Pass B — NOISE weighting DONE** (`mustlearn-passb-noise-formulas`) — results in §2B. Highest-weight: `white-noise-psd` + bandlimited P_N = N₀B (weight 5 each), `lti-output-psd` + `wiener-khinchin` (weight 3 each). Zero-weight: `bandpass-noise-r`, `noise-figure`, `fm-noise-output-psd`.
- **Pass B — AM weighting DONE** (`mustlearn-passb-am-formulas`) — results in §6B. Highest-weight: `am-signal` (17), `am-mu` (8), `ssb-signal` (6), `dsb-sc-signal` (5), `am-spectrum`/`am-power`/`fdm-spacing` (4 each). Key finding: `fdm-spacing` untagged in all 4 multiplexing exercises; `dsb-sc-phase-error` needs a new formulaId. Zero-weight: `ssb-power`, all VSB formulas.
- **Pass B — FM weighting DONE** (`mustlearn-passb-fm-formulas`) — results in §8B. Highest-weight: `fm-beta` + `carson` (weight 6 each — tied; tested in all 3 final-exam sessions); `fm-bessel-sidebands` + `fm-bessel-property` (weight 3 each); `fm-single-tone` + `fm-power` (weight 2 each). FM problems appear only in final exams (not midterms). Zero-weight: `pm-signal`, `fm-bessel-expansion`, `fm-noise-output-psd`, `fm-threshold`. `fm-snr-out`/`fm-gain-am`/`fm-snr-ref` weight 1 each (cross-topic, from §2B).
- **Pass B — FOUNDATIONS weighting DONE** (`mustlearn-passb-foundations-randomness-formulas`) — results in §3B. Highest-weight: `parseval-power` + `fourier-series-rect-pulse` (weight 4 each — tied; both appear across 4 exam sessions); `cos-power-half` (**6** — corrected from initial 3; 3 T/F + 3 power-sum); `signal-energy` (2); `parseval` (1). **Pass C batch 1 DONE** (`cos-power-half`·6, `signal-energy`·2). **Pass C batch 2 DONE** (`parseval-power`·4, `fourier-series-rect-pulse`·4, `parseval`·1). Zero-weight: all LTI systems formulas, all FS structural formulas, dB gain.
- **Pass B — RANDOMNESS/WHY weighting DONE** (`mustlearn-passb-foundations-randomness-formulas`) — results in §4B. All formulas weight 0 from the past-exam bank (only lecture exercises exist for this chapter). Vocabulary must-learns (`random-mean`, `random-autocorr`, `wss`) need theory-page callouts; low badge priority.
- **Pass B — MODULATION BRIDGE weighting DONE** (`mustlearn-passb-foundations-randomness-formulas`) — results in §5B. All bridge-specific formulas weight 0 (pre-envelope, complex envelope, bandpass spectrum, I/Q canonical not standalone-tested). Exam weight for I/Q already counted via AM/FM/noise chapters. Fix F7 inverse error (line 275) in Pass C.
- **Pass B — RANDOMNESS/PSD + REMAINING RANDOMNESS weighting DONE** (`mustlearn-passb-foundations-randomness-formulas`) — results in §7B. `wiener-khinchin` + `lti-output-psd` cross-reference §2B (weight 3 each, no additional exercises). All remaining randomness formulas weight 0 from past-exam bank (lecture-only exercises; inline ExamProblems not in standalone bank). Critical Pass C items: fix "✓ μέσω WK" ambiguous labels on psd page; fix F13 exponential pair inverse error; add `fourier-pair-exp` formulaId.
- **Pass B — COMPLETE.** All chapters now weighted: Noise §2B · AM §6B · FM §8B · Foundations §3B · Randomness/why §4B · Modulation bridge §5B · Randomness/PSD + remaining §7B. Proceed to Pass C.
- **Pass C — apply**: annotate placements (a) theory pages, (b) problems, (c) `/formulas`,
  driven by a single source of truth in `formulas.tsx`/`formulaIds`.
