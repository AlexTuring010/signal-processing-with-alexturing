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
| A | AM / FM / Foundations / … | per-chapter | TODO (reuse §1 ground truth) |
| B | weighting | per-formula | TODO |
| C | apply | per-placement | TODO |

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

## 3. Discoveries, flags & open questions (for the planner — surfaced via bus/inbox)

- **F1 — LIVE MISCITATION (correctness).** `app/(content)/noise/white-noise/page.mdx`
  **line 340** (§10 summary table) marks `S_N(f) = N_0/2` as **"✓ τυπολόγιο"** — i.e. it
  tells students this is on the exam sheet and need not be memorised. **It is NOT on the
  sheet** (§1 ground truth) — confirmed by `formulas.tsx` (`white-noise-psd` is
  `inTypology: false`) and contradicted on the *same chapter* by `through-filters §8στ`,
  which correctly calls the noise formulas «όχι στο επίσημο τυπολόγιο». This is exactly the
  inverse-pattern inconsistency the owner flagged (`inbox/001` §2c). **Recommend a focused
  correction step** (Pass C scope, `noise/**`): flip that cell to the must-learn signal.
  Not fixed here — this step writes only the planning doc.
- **F2 — Several must-learn noise formulas have NO `FORMULA_SHEET` entry**, so placement
  (c) on `/formulas` cannot link them until entries exist (or it's decided they stay
  "derive/remember" without a sheet-page row). Examples with no `formulaId`: equivalent
  noise bandwidth `B_N`; RC power `πN_0 f_c/2` & RC ΣΑΣ; bandlimited `P_N=N_0 B` &
  `R_N=N_0 B·sinc(2Bτ)`; one-sided `N_0`; noise-floor dBm rule & `T_total`; random-process
  I/Q decomposition; general joint-WSS `R_N`; down-convert-&-fold component spectra; input
  SNR; processing gain; differentiator `\|H\|²=(2πf)²`. **Open question for planner/principal:**
  does Pass C add `formulas.tsx` entries for these, or treat them as page-only must-learns?
- **F3 — Placement-(a) is inconsistent across the chapter** (see §2 observation):
  through-filters §8στ correct; white-noise §10 wrong (F1); sources/bandpass/snr use ad-hoc
  "μάθε απέξω". Pass C should propagate the §8στ wording uniformly.
- **F4 — `∫du/(1+u²)=arctan` is NOT on the τυπολόγιο** (p.3 lists only `∫1/cos²=tan`,
  `∫1/sin²=−cot`). `through-filters §6α` calls it "τυπολόγιο integral 7-8 σχετικά" — loose
  (it says "related", not "on the sheet"), so not a hard error, but the integral behind the
  RC result `P_Y=πN_0 f_c/2` is itself must-derive/remember. Minor wording flag for Pass C.
- **F5 — `/noise/snr` is thin / pre-D11-rework** (`lastUpdated 2026-05-05`, no 5-stage
  loop, SourceDoc has no slide numbers). Its must-learn formulas (§2.5) are recap-heavy
  (AM/FM). When D11 reworks it, the must-learn flags should be baked in (coordinate Pass C
  with D11 to avoid double-touch — same logic as the noise-exercise ordering call).
- **F6 — `jun25-th1-10` `formulaId` mis-tag (grounding, Pass C).** Tagged `bandpass-noise-r`
  (`R_Y=N_0 W·sinc(Wτ)·cos(2πf_cτ)`) but its LPF+HPF solution derives the bandlimited-LPF
  `R_Y=N_0 W·sinc(2Wτ)` (no carrier; `sinc(2Wτ)`). Loose tag; both off-sheet so the
  classification is unaffected. Feeds **F2** (the bandlimited-LPF ΣΑΣ has no `formulaId`).
  Full detail in §2.7. (Surfaced via `bus/inbox/010`.)
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

## 4. Placeholders for later passes (do not delete — structure for the whole sub-goal)

- **Pass A — noise PROBLEMS** (`mustlearn-inventory-noise-problems`): sweep the 8 noise
  problems; classify each used formula against §1; verify placement-(b) presence.
- **Pass A — am / fm / foundations / …**: per-chapter inventories that REUSE §1.
- **Pass B — weighting**: per must-learn formula, count distinct `past_exams/` exercises +
  collect refs (cite specific problems; do not estimate).
- **Pass C — apply**: annotate placements (a) theory pages, (b) problems, (c) `/formulas`,
  driven by a single source of truth in `formulas.tsx`/`formulaIds`.
