# Course Inventory — K21 Συστήματα Επικοινωνιών

**Purpose.** Durable reference for chapter planning. Captures what each lecture deck, lab deck, and past exam covers, plus the chapter ↔ slide mapping. Refresh when new source material arrives. Read this before drafting any new chapter plan.

**Date of inventory:** 2026-05-05
**Materials root:** `slides/`, `slides/Εργαστήριο/Εργαστήριο/`, `past_exams/`

---

## 1. Theory slide decks (11 PDFs, slides 1–~40 per deck)

Source folder: `slides/SE_session*.pdf`

### `SE_session1&2_introduction_2025.pdf` — 58 slides
Course intro + the big picture. Slides 1–10 are course logistics (skip). Slides 11–58 cover what a comm system is, block diagram, why we modulate, EM spectrum + radio bands, real-world examples, "why CS people need this".

**Used by:** `/intro` chapter.

### `SE_session3_theory1_2025.pdf` — 35 slides
Signals chapter. CT vs DT, periodicity (continuous-time and discrete-time wraparound rules), even/odd, energy/power, building blocks (rect, triangle, sinc, step, ramp, exponentials, Dirac δ).

**Used by:** `/foundations/signals`.

### `SE_session4_theory2_2025.pdf` — 33 slides
Slides 3–11: impulse response, convolution, properties, worked example.
Slides 12–15: time/frequency description teaser.
Slides 16–20: LTI eigenfunction property (complex exponentials).
Slides 21–32: orthogonality + Fourier series introduction.

**Used by:** `/foundations/systems` (slides 3–20) + `/foundations/fourier-series` (slides 21–32).

### `SE_session5&6_theory3_2025.pdf` — 49 slides
Slides 1–11: rectangular pulse-train Fourier series, square wave visualization (used by `/foundations/fourier-series`).
Slides 12–49: Fourier transform — pairs, properties, modulation theorem, periodic-signal FT (used by `/foundations/fourier-transform` Sections 1–8).

**Used by:** `/foundations/fourier-series` + `/foundations/fourier-transform`.

### `SE_session7&8_theory_2025.pdf` — ~46 slides
Slides 1–16: **Parseval, cross-correlation (ΣΕΣ), autocorrelation (ΣΑΣ), Wiener–Khinchin** — these were absorbed into `/foundations/fourier-transform` Sections 9–10 (Parseval/ESD + Autocorrelation preview).
Slides 17–46: **Hilbert, bandpass signals, complex envelope, I/Q canonical form, ideal+real filters** — used by `/foundations/bandpass-filters`.

**Used by:** `/foundations/fourier-transform` (1–16) + `/foundations/bandpass-filters` (17–46).

### `SE_session9_random1_upload.pdf` — 35+ slides
Random processes. Slides 1–9: definition + categories. Slide 10–13: mean, autocorrelation, autocovariance, cross-correlation, cross-covariance. Slides 14–19: Exercise 1 (cos with random phase) full solution. Slide 20: strict-sense stationarity. Slides 21–23: **wide-sense stationarity (WSS)**. Slides 24–27: Exercise 2/3 + solutions. Slides 28–35: time-averages, **ergodicity** (in mean, in autocorrelation), Exercise 5.

TOC also names PSD (Φάσμα) and Thermal Noise (Λευκός Θόρυβος, Τυπική Διάταξη Δέκτη), but those probably continue past slide 35 or get spread into session 10. **Confirm when planning randomness chapter.**

**Will be used by:** `/randomness/random-processes`, `/randomness/stationarity-autocorrelation`, possibly `/randomness/ergodicity`, `/randomness/psd`.

### `SE_session10_noise.pdf` — ~50 slides (estimated)
Recap-then-extension deck. Opens with the same Random Processes + Thermal Noise TOC as session 9. First ~10 slides recap stationarity briefly. Then **thermal noise, white noise, typical receiver architecture**.

**Will be used by:** `/noise/sources`, `/noise/white-noise`, `/noise/through-filters`, `/noise/snr`.

### `SE_session11&12&13.pdf` — 81 slides
**Title:** Διαμόρφωση ΑΜ (AM Modulation). TOC: (1) Communications + modulation overview, (2) AM with subsections: Conventional AM, Modulator/Demodulator AM, DSB-AM-SC, SSB-AM, VSB-AM.

Confirmed slides 1–20:
- Slides 3–7: communications channels + why modulate + analog vs digital modulation overview
- Slide 9: the four AM techniques named (Conventional/SC/SSB/VSB)
- Slide 10: AM signal `x(t) = (A_c + m(t)) cos(2π f_c t)`
- Slide 11: **Explicit bandpass representation** — `x_I = A_c + m(t)`, `x_Q = 0`, `V(t) = |A_c + m(t)|`, `θ(t) = 0`. **This validates that bandpass-filters chapter is the right prerequisite.**
- Slide 12: overmodulation when `A_c + m(t) < 0`
- Slide 13: modulation index μ = |min m(t)| / A_c, constraint μ ≤ 1
- Slides 14–20: MATLAB plots of carrier + message + modulated signal at μ ∈ {0.5, 1, 2}

Pages 20–81 (not yet inventoried in detail, but per TOC contain): modulator/demodulator architecture, DSB-AM-SC, SSB-AM, VSB-AM, demodulation circuits.

**Will be used by:** `/modulation/intro`, `/am/conventional`, `/am/modulator-demodulator`, `/am/dsb-sc`, `/am/ssb`, `/am/vsb`. **Single deck likely covers all AM chapters.**

### `SE_session14_AM.pdf` — TBD
Per `plans/00-overview.md` mapping: AM exercises. Likely worked-example deck, not new theory. **Inventory when planning AM chapters.**

### `SE_session15_FM.pdf` vs `SE_session15_16_16_FM.pdf` — TBD
Two FM decks. The longer name (`15_16_16`) suggests it's an extended/replacement version covering sessions 15+16. **Compare TOCs when planning FM chapters** — likely use the longer one, which probably absorbs the shorter.

---

## 2. Lab decks (5 PDFs, MATLAB-via-signal-theory)

Source folder: `slides/Εργαστήριο/Εργαστήριο/`

### `Εγκατάσταση του Matlab.pdf` — 1 page
Just the UoA license link (`cc.uoa.gr/logismika/matlab`). Goes in `/intro` footer as a one-time note, **not** a chapter LabBox.

### `Εργαστήριο 1-intro_matlab.pdf` — 30 pages
**Pure MATLAB syntax tutorial.** Vectors, matrix ops, element-wise (`.*`), `plot`/`stem`/`subplot`, anonymous functions, `for`/`if`/`while`, `find`. **Goes in `/intro` once** as "MATLAB σε 5 λεπτά". Theory chapters then assume this and skip syntax recap.

### `Εργαστήριο 2-Συνεχή και διακριτά σήματα.pdf` — 13 pages
Signal-theory-via-MATLAB: CT vs DT signals, masking with `(t>=0)`, custom step/ramp m-files, exponentials, the discrete-cosine `cos(ω₀ n)` ω₀-wraparound demo.

**Pairs with:** `/foundations/signals` — split into 3 LabBoxes (CT vs DT plotting; step/ramp masking; discrete-cosine wraparound).

### `Εργαστήριο 3-Γραμμικά συστήματα συνεχούς χρόνου.pdf` — 6 pages
**Only linearity + time-invariance checks.** Anonymous functions, `y_exp` vs `y_act` side-by-side. **No convolution, no impulse response.**

**Pairs with:** `/foundations/systems` linearity/TI sections (NOT the convolution sections — the deck doesn't cover them).

### Lab 4 — MISSING
Not in the folder. Was the natural Fourier-via-MATLAB slot. Either authored elsewhere or skipped this iteration. **Don't author content claiming it exists.**

### `Εργαστήριο 5-ΤΥΧΑΙΑ_ΣΗΜΑΤΑ.pdf` — 21 pages
Most comprehensive lab. `randn`/`hist`/`mean`/`std`/`cov`/`corrcoef`, distribution generators (`normrnd`, `unifrnd`, `exprnd`, `binornd`, `poissrnd`), `xcorr` (biased), `periodogram`, `fir1`+`filter` for LP/HP filtering of noise. ρ ∈ {1, −1, 0.97, 0.76, 0.4} scatter examples. PAM/random-phase/FSK ensembles. Two-sinusoids-in-noise + FIR filtering.

**Pairs with:** `/randomness/*` chapters (multi-section deployment) + back-references from `/foundations/bandpass-filters` and `/foundations/fourier-transform`.

### Coverage gap: Fourier, sampling, modulation labs
None of the existing labs cover Fourier transforms, sampling/Nyquist, or AM/FM modulation in MATLAB. When those theory chapters get LabBoxes, **content must be authored fresh** — synthesised from theory + maybe `formulas.pdf` examples.

---

## 3. Past exams (8 files)

Source folder: `past_exams/`

### Topic frequency (theory exams: Sept'25, Jan'26 ΕπίΠτυχίω, Πρόοδοι A+B, June'25)

| Topic | Sub-problems | Cumulative weight |
| --- | --- | --- |
| **AM (all variants — μ, power, spectra, multiplexing, envelope detector)** | ~22 | **35–40%** |
| **FM — β, Carson BW, Bessel sidebands, power** | ~10 | **25–30%** |
| **Fourier series / spectrum sketching (square, triangle, cosine sums)** | ~10 | **15%** |
| **Noise — thermal, white, PSD, filtering** | ~7 | **12–15%** |
| **Foundations — power-vs-energy, channel role, "why modulate"** | ~9 | **5–10%** |
| **Multiplexing (FDM)** | 4 (paired with SSB/DSB-SC) | part of AM block |
| **Nonlinear AM transmitter (squarer + BPF)** | 1 (Πρόοδος B Θ4) | 25% locally |
| **Sampling / aliasing** | **0** | **0%** |
| **LTI / convolution as theory exercise** | **0** | **0%** |
| **SNR / noise-figure** | **0** | **0%** |
| **Digital modulation (ASK/FSK/PSK/QAM)** | **0** | **0%** |
| **Hilbert transform derivations** | **0** | **0%** (used implicitly in SSB but never asked) |

### Recurring problem patterns (high-confidence across exam corpus)

1. **AM-multiplexing problem** (m(t) = sinc(2Wt), k(t) = Π(4Wt) at f₁/f₂; find non-overlap constraint; sketch G(f)) — appears in **Πρόοδος A Θ3, Πρόοδος B Θ3, Jan'26 Θ3, June'25 Θ2**. The most-repeating problem in the corpus.
2. **AM modulation index + power calculation** — Sept'25 Θ1.2, etc.
3. **FM: single tone + β + Carson + first 3 Bessel sidebands** — Sept'25 Θ2, Jan'26 Θ4, June'25 Θ3.
4. **T/F traps**: AM formula form, m(t) = cos is power-not-energy signal, **white noise PSD is NOT Gaussian** (this is a recurring trap), Fourier scaling of pulse trains.
5. **Power of sum-of-three-sinusoids at distinct frequencies** — Parseval-style. Πρόοδος A/B + Jan'26.
6. **"Why do we modulate?"** essay — 4–5% free points in nearly every exam.
7. **Envelope detector** circuit + valid-detection conditions — Sept'25, Jan'26, June'25.

### MATLAB exam (`MatLab-Team-A/B-June-2023.pdf`)
**Pure MATLAB language**: matrix syntax, vectorization, anonymous vs named functions, indexing, `stem`, one convolution-zero-pad question. **No `fft()`, no AM/FM signal generation.** Confirms MATLAB labs are cleanly separable from theory exam.

### `examWeight` calibration

Use these as the canonical numbers in chapter frontmatter:

- AM (all variants combined across `/am/*`): **35**
- FM: **25**
- Fourier series + spectrum sketching: **15** (of which ~5 in `/foundations/fourier-series`, ~5 in `/foundations/fourier-transform`, ~5 in modulation chapters' spectrum sketches)
- Noise: **12**
- Foundations conceptual (signals, "why modulate", channel role): **8**
- Bandpass/Hilbert/filters as standalone: **3** (load-bearing for AM but rarely tested as own topic)
- Sampling: **0** (build for completeness, not exam weight)
- Random processes: **3** (background for noise; not heavily tested standalone)

---

## 4. Chapter ↔ slide mapping (shipped + planned)

### Shipped (8 routes)
| Chapter | Slides used | Status |
| --- | --- | --- |
| `/intro` | session 1&2 (slides 11–58) | ✅ |
| `/foundations/signals` | session 3 | ✅ |
| `/foundations/systems` | session 4 (3–20) | ✅ |
| `/foundations/fourier-series` | session 4 (21–32) + session 5&6 (1–11) | ✅ |
| `/foundations/fourier-transform` | session 5&6 (12–49) + session 7&8 (1–16) | ✅ |
| `/foundations/bandpass-filters` | session 7&8 (17–46) | ✅ |
| `/foundations/signal-transformations` | derived from session 3 | ✅ (reference) |
| `/reference/complex-numbers` | derived | ✅ (reference) |
| `/reference/spectrum-conventions` | derived | ✅ (reference) |

**No slide is missing coverage.** Session 7&8 slides 1–16 looked like a gap but were absorbed into FT chapter under Parseval+autocorrelation.

### Remaining (planned)
| Chapter | Source slides | Notes |
| --- | --- | --- |
| `/foundations/sampling-light` | (none — synthesised, light intro before random) | ⚠️ Optional. Exams don't test sampling. Could be skipped or built minimal. |
| `/randomness/random-processes` | session 9 (1–19) + session 10 recap | Foundation for noise. Not heavily tested standalone. |
| `/randomness/stationarity-ergodicity` | session 9 (20–35) | WSS, ergodicity. |
| `/randomness/psd` | session 9 (35+) + session 10 | PSD, Wiener-Khinchin generalised to random signals. **Closes commitment** from FT §10. |
| `/noise/sources` + `/noise/white-noise` + `/noise/through-filters` | session 10 | Thermal noise, white noise, FIR/IIR filtering. **12% exam weight.** |
| `/modulation/intro` | session 11&12&13 (slides 1–9) | Why modulate, taxonomy of techniques. **Closes intro commitment.** |
| `/am/conventional` | session 11&12&13 (slides 10–~25) + session 14 exercises | **Highest exam weight.** Closes bandpass §5 commitment (`x_Q = 0` row). |
| `/am/dsb-sc` | session 11&12&13 (DSB-SC section) + session 14 | |
| `/am/ssb` | session 11&12&13 (SSB section) + session 14 | Uses Hilbert (already built). |
| `/am/vsb` | session 11&12&13 (VSB section) | |
| `/am/modulator-demodulator` | session 11&12&13 (modulator/demodulator section) | Includes envelope detector. |
| `/am/multiplexing` | (synthesised — heavily exam-tested) | **Recurring exam problem** — explicit chapter or section warranted. |
| `/fm/idea` + `/fm/modulation-index` + `/fm/bessel` + `/fm/carson` + `/fm/nbfm-vs-wbfm` | session 15_FM + session 15_16_16_FM (compare) | **Second highest exam weight.** Closes bandpass §5 commitment (FM constant-envelope row). |
| `/sampling-adc/*` | (synthesised) | **Optional.** Not exam-tested. |
| `/digital/intro` | (synthesised) | **Optional.** Not exam-tested. |
| `/practice` | All past exams | **High value.** Worked solutions to recurring problems. |
| `/formulas` | typology PDF | Already exists as placeholder; expand with interactive. |

### Lab placement
| Lab | Target chapter | Notes |
| --- | --- | --- |
| Lab installation | `/intro` footer | Just the UoA link. |
| Lab 1 (intro MATLAB) | `/intro` | "MATLAB σε 5 λεπτά" once, then never re-explain syntax. |
| Lab 2 (signals) | `/foundations/signals` | 3 LabBoxes. |
| Lab 3 (LTI) | `/foundations/systems` | Linearity/TI sections only — NOT convolution sections. |
| Lab 4 (missing) | — | Don't promise it. |
| Lab 5 (random signals) | `/randomness/*` | Multi-section deployment. |

---

## 5. Decision log

### "Was bandpass-filters the right Foundations boundary?" — **YES, confirmed.**

**Evidence:** Session 11&12&13 slide 11 (the AM deck) explicitly uses the canonical bandpass form `x(t) = x_I cos(2π f_c t) − x_Q sin(2π f_c t)` and derives AM from it as `x_I = A_c + m(t)`, `x_Q = 0`. The course author treats the canonical form as a prerequisite for AM. By building bandpass-filters last in Foundations (with the I/Q table + the `<IQDecompositionViz />`), we set up exactly what AM consumes on slide 11. The AM chapter can open by quoting "row 1 of the bandpass §5b table" and proceed.

**Implication for chapter linkage:** Each modulation chapter (AM, DSB-SC, SSB, FM, PM) should open with a back-reference to bandpass §5b row, then derive the spectrum + bandwidth + modulator/demodulator from there. Don't re-derive the canonical form.

### "Is `/foundations/sampling-light` worth building?" — **Optional, low priority.**

**Evidence:** Past-exams agent confirmed sampling is **0%** of the exam corpus. The original `00-overview.md` plan included it as foundational coverage, but the empirical evidence from 7 past exams says it doesn't get tested. Build it last in Foundations (after AM/FM/Noise are done) if there's appetite for completeness. Not load-bearing for any other chapter.

### "Hilbert transform exam weight" — **Effectively 0%.**

**Evidence:** Used in SSB derivation but never asked directly. The bandpass-filters chapter's §2 Hilbert treatment is fine for completeness, but don't over-invest in exercises or worked problems — the lecture's typology lists the formula and that's the level students need.

### "Should random-processes get its own deep chapter?" — **Yes but compact.**

**Evidence:** ~3% direct exam weight, but it's the foundation for noise (12% weight). Build a tight `/randomness/*` group covering up to PSD + Wiener-Khinchin generalised, then move quickly to noise.

---

## 6. Recommended next 6 chapters (priority order)

Based on exam weight + dependency graph + commitments-to-close:

1. **`/modulation/intro`** — short bridge chapter. Closes intro commitment. ~1–2 days work.
2. **`/am/conventional`** — biggest single exam topic. Closes bandpass §5 commitment + intro modulation commitment. Flagship modulation chapter.
3. **`/am/dsb-sc`** + **`/am/ssb`** — same exam-block. Multiplexing problem belongs here.
4. **`/am/modulator-demodulator`** — envelope detector circuit, coherent detection.
5. **`/fm/*`** group — second-biggest exam topic. Bessel + Carson are recurring exam patterns.
6. **`/randomness/*`** + **`/noise/*`** — third-biggest combined exam weight. Lab 5 deploys here.

**Skip until later** (low exam priority): `/foundations/sampling-light`, `/sampling-adc/*`, `/digital/*`. Build only after the high-weight content is solid.

---

## 7. How to refresh this file

When new source material arrives (new lecture deck, new exam, new lab):

1. Add a row to the relevant section above.
2. Update `examWeight` calibration if exam patterns shift.
3. Update the decision log with any new boundary calls.
4. Bump the date at the top.

When a planned chapter ships:

1. Move it from "Remaining" to "Shipped" in §4.
2. Move any closed commitments in `COMMITMENTS.md` (the existing process).

Future planning sessions read this file **before** drafting `plans/NN-*.md`, so they can position the new chapter against the full course landscape rather than re-deriving it.
