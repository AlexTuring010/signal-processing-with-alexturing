# DRAW_PROBLEM_AUDIT.md

> **Apparatus doc — English prose. Not student-facing.**
> Produced by builder step `draw-problem-audit` (iter 95).
> This document drives the Phase-2 DRAW-rework roadmap.
> Planner owns subsequent scheduling; builder + reviewer read.
> Ground truth: live `content/practice/exercises.tsx` (verified 2026-05-31).

---

## Purpose

Enumerate every past-exam exercise card with a visual-imperative statement (draw /
sketch / plot / αποτυπώστε σχηματικά / σχεδιάστε the spectrum/waveform/diagram)
whose current solution is text-only or static-SVG-only, and produce a ranked action
plan for the per-problem rework phase.

---

## Grep patterns used

Run against `content/practice/exercises.tsx` (case-insensitive):

```
σχεδιά        # σχεδιάστε / σχεδιάσετε / Σχεδίαση
σχεδίαση      # title-level draw indicators
αποτυπώστε    # «αποτυπώστε σχηματικά»
σχηματικά     # «δείξτε σχηματικά»
φάσμα         # «φάσμα» near an imperative (context-filtered)
σχήμ          # «σχήμ*» (filtered: figure-references vs draw instructions)
ζωγραφί       # «ζωγραφίζουμε» (prose-side; no statement hits)
plot / draw / sketch   # English variants (no statement hits found)
```

Solution-side gap pattern also checked:
```
βλέπε.*σχήμ | σχήμ.*φαίνεται   # «see the figure» without embedded viz
```
No solution-side «βλέπε σχήμα» gaps discovered that weren't already caught by
the statement-level pass.

---

## Classification scheme

- **(i) Genuine DRAW** — statement contains a visual-imperative (σχεδιάστε / αποτυπώστε
  σχηματικά / να σχεδιαστεί) asking for a spectrum, waveform, or diagram; and the
  current solution is text-only **or** a static non-interactive SVG. Needs a bespoke
  interactive viz embedded in the answer.

- **(ii) Non-imperative** — «σχήμα» (or visually-adjacent word) is a reference to a deck
  figure / a descriptive noun (shape of PSD), not a draw instruction; or the draw
  instruction asks for a circuit/schematic that is already adequately served by an
  existing static SVG (circuit diagrams are the canonical case).

- **(iii) Already adequately vizzed** — an interactive viz is embedded in the solution
  (the `NoiseFilterShapingViz`-style wired component already populates a live canvas
  when the student opens the answer).

- **(iv) Enrichment** — NOT a text-only answer to a draw question, but a viz would
  deepen understanding (e.g., an interactive non-overlap-condition slider for a
  derivation problem). Lower priority; scheduled separately if at all.

---

## Ranking rationale

Chapter-weight order (matches INTENT §4 dependency order and exam-weight distribution):
**Noise** (§2B) → **AM** (§6B) → **FM** (§8B — zero DRAW gaps) → **Foundations** (§3B).

Within each chapter: descending by exam `weight` field (the `exercises.tsx`
`weight:` integer).

---

## §1 Genuine DRAW Problems (the actionable list)

> **§5 (VIZ-FIT VERDICTS, iter 102) is the AUTHORITATIVE fit / sizing / scheduling verdict.** Where §1's 'New T2?', 'Sizing', or 'Recommended planner scheduling' columns disagree with §5, **§5 wins.** (§1 was the initial pass; §5 corrected the FDM cluster from FIT/(A)-only to EXTEND/SPLIT after reading each component's actual draw logic.)

**Total: 21 problems** (1 Noise + 16 AM + 0 FM + 4 Foundations).

### Noise chapter (1 problem)

| # | ID | Source | Weight | What must be drawn | Current state | Candidate viz | Reuse notes | New T2? | Sizing |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `jun25-th1-10` | June 2025 Θ1.10 | 7 | (1) LPF output PSD S_LP(f) + HPF output PSD S_HP(f) side-by-side; (2) autocorrelation R_LP(τ) = N₀W·sinc(2Wτ) AND R_HP(τ) | TEXT-ONLY | `NoiseFilterShapingViz` extended with HPF mode + R_N(τ) autocorrelation panel | Siblings (`proodos26-6`, `sept25-th3-10`, `sept25-th3-11`) already wire `NoiseFilterShapingViz` LPF mode; HPF + autocorrelation are new capabilities | **NEW T2 extension** — add `filterType:'hpf'` prop + R_N(τ) canvas panel to existing `NoiseFilterShapingViz` | **SPLIT (A)+(B)**: (B) T2 extends `NoiseFilterShapingViz`; (A) T1 wires it + full solution rework |

**Cross-reference:** `RELEVANCE_MAP.md §2.G G2` (viz gap filed). `MUST_LEARN_FORMULAS.md §2B`: `wiener-khinchin` weight=3 — this is one of the three exercises; R_LP derivation via W-K inverse FT is the skill. Also: F6 (`bandpass-noise-r`) already clean per §5.D — no removal needed (`formulaIds` does not contain `bandpass-noise-r`).

---

### AM chapter (16 problems)

Conventional AM waveform + spectrum draws:

| # | ID | Source | Weight | What must be drawn | Current state | Candidate viz | Reuse notes | New T2? | Sizing |
|---|---|---|---|---|---|---|---|---|---|
| 2 | `pb25-th4-nonlinear` | Proodos B 2025 Θ4 | 25 | Spectrum of y(t) = x²(t): (a) baseband rect ±W; (b) DSB-SC component at ±fc with BW 2W (no carrier impulse); (c) DC + harmonics at ±2fc | TEXT-ONLY | `NonlinearModulatorSpectrumViz` | **Exists** at `components/viz/NonlinearModulatorSpectrumViz.tsx`; currently wired only in `am/modulator-demodulator` theory page — NOT in exercises.tsx | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 3 | `jun25-th2` | June 2025 Θ2 | 25 | Mixed FDM: (1) DSB-SC m(t)=sinc(Wt) spectrum (rect ±W/2, no carrier impulse); (2) conventional AM k(t)=sinc(6Wt) spectrum (rect ±3W + carrier impulse at ±f₂); (3) combined G(f) = X_m + X_k | TEXT-ONLY | `FdmCanonicalProblemViz` or extension; alternatively `FDMSpectrumViz` | `FdmCanonicalProblemViz` at `am/multiplexing` handles USSB FDM; mixed DSB-SC + conventional AM FDM needs a mode or separate viz; `FDMSpectrumViz` exists at `components/viz/FDMSpectrumViz.tsx` — check if it handles mixed modes | Yes — FdmCanonicalProblemViz T2 extension (§5.B item 1, kMod='am-conventional') | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C); (A) T1 wires + full rework |
| 4 | `pa25-th3-mux` | Proodos A 2025 Θ3 | 25 | (1) USSB baseband spectra: sinc(2Wt)→rect [−W,W]; Π(4Wt)→sinc·(4W) lobe; (2) USSB-modulated spectra: upper sideband only at ±f₁, ±f₂; (3) combined G(f) | TEXT-ONLY | `FdmCanonicalProblemViz` | **Exists** at `am/multiplexing` theory page only; same family as proodos26-11/13 USSB cluster | Yes — FdmCanonicalProblemViz T2 extension (§5.B item 1, kBW=4) | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C); (A) T1 wires + full rework |
| 5 | `pb25-th3-mux` | Proodos B 2025 Θ3 | 25 | (1) DSB-SC m(t)=sinc(Wt) per-channel spectrum; (2) DSB-SC k(t)=Π(Wt) per-channel spectrum; (3) non-overlap condition; (4) combined G(f) = X_m + X_k | TEXT-ONLY | `FdmCanonicalProblemViz` with DSB-SC mode | `FdmCanonicalProblemViz` currently targets USSB; DSB-SC FDM may need mode flag; `FDMSpectrumViz` is an alternative | Yes — FdmCanonicalProblemViz T2 extension (§5.B item 1, mBW=0.5, kBW=1, modType='dsb') | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C); (A) T1 wires + full rework |
| 6 | `jan26-th3-mux` | Jan 2026 Θ3.11–12 | 20 | (1) USSB baseband spectra: sinc(2Wt)→rect (BW W), Π(4Wt)→sinc lobe (first null 4W; exercises.tsx L5171); (2) USSB-modulated at f₁=100kHz, f₂=1MHz; (3) combined G(f) | TEXT-ONLY | `FdmCanonicalProblemViz` | Same family as pa25-th3-mux; same viz component | Yes — FdmCanonicalProblemViz T2 extension (§5.B item 1, kBW=4) | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C); (A) T1 wires + full rework |
| 7 | `proodos26-9` | Apr 2026 ΘΕΜΑ 9 | 10 | (1) Time-domain AM waveform: [1+2sin(2πt)]cos(1000πt), showing phase reversals (μ=2>1 overmod); (2) Amplitude spectrum: impulses at ±499, ±500, ±501 Hz | TEXT-ONLY | `AMSignalViz` (waveform) + `AMSpectrumViz` (spectrum) | Both exist in `components/viz/`; `AMSpectrumViz` is single-tone with μ slider; `OvermodulationPhaseReversalViz` also exists and may be better for the time-domain part | No new T2 needed | **(A)-only**: T1 wires existing vizzes + full solution rework |
| 8 | `sept25-th1-5` | Sept 2025 Θ1.5 | 10 | Two-tone AM amplitude spectrum: carrier at ±100kHz + sidebands at ±(100±1)kHz + ±(100±2)kHz with amplitudes from m(t)=cos(2π·1kHz·t)+0.5cos(2π·2kHz·t) | TEXT-ONLY | `AMSpectrumViz` (two-tone extension) | Existing `AMSpectrumViz` is SINGLE-tone only (one fm slider); two-tone requires a new parameter or a different viz; `SpectrumViewer` (theory-page impulse-line viz) is closest | **NEW T2 extension** — add two-tone mode to AMSpectrumViz, OR build SpectrumLineViz (see Foundations cluster) | **SPLIT (A)+(B)**: (B) extend AMSpectrumViz or build SpectrumLineViz; (A) T1 rework |
| 9 | `proodos26-11` | Apr 2026 ΘΕΜΑ 11 | 9 | USSB spectra: (a) rect [f₁, f₁+W/2] for sinc(Wt); (b) triangle peak at f₂ for sinc²(Wt); both + mirrors at −f₁, −f₂ | **STATIC SVG** (not interactive) | `FdmCanonicalProblemViz` or `SSBSpectrumViz` | Static SVG at L994–1025 shows correct shapes; replace with interactive component; `SSBSpectrumViz` exists | Yes — FdmCanonicalProblemViz T2 extension (§5.B item 1, mBW=0.5, kShape='triangle', kBW=1) | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C); (A) T1 replaces static SVG + full rework |
| 10 | `pa25-th2-5` | Proodos A 2025 Θ2.5 | 8 | (1) Baseband amplitude spectrum of Σn·cos(2πnt), n=1..8: 8 impulse pairs at ±n Hz, heights n/2; (2) AM spectrum: carrier ± all 8 sideband pairs (17 impulse pairs total) | TEXT-ONLY | `SpectrumLineViz` (new) or `SpectrumViewer` with custom presets | `SpectrumViewer` supports presets with |aₖ| bars; custom configurable harmonic set (k=1..8, Aₖ=k/2) plus AM shift is possible with extension; same viz serves `pb25-th2-5` (sibling) | **NEW T2 primitive** `SpectrumLineViz` (configurable harmonic set with amplitude/phase sliders) if SpectrumViewer preset system isn't flexible enough | **SPLIT (A)+(B)**: (B) extend SpectrumViewer or build SpectrumLineViz; (A) T1 wires it for both pa25-th2-5 + pb25-th2-5 |
| 11 | `pb25-th2-5` | Proodos B 2025 Θ2.5 | 8 | (1) Baseband amplitude spectrum of Σ(10-n)·cos(2πnt), n=1..6: 6 impulse pairs at ±n Hz, heights (10-n)/2; (2) AM spectrum: carrier ± 6 sideband pairs | TEXT-ONLY | Same as pa25-th2-5 | Sibling of pa25-th2-5 (same exam structure, different coefficients); wire same viz with different parameters | Reuse T2 build from #10 | **(A)-only once #10 T2 is done**: T1 wires with pb25-th2-5 parameters |
| 12 | `jan26-th2-8` | Jan 2026 Θ2.8 | 8 | DSB-SC amplitude spectrum: sinc(2Wt)→rect(f/2W) (width W, height 1) shifts to ±fc, NO carrier impulse | TEXT-ONLY | `FdmCanonicalProblemViz` (numChannels=1) — DsbScSpectrumViz does NOT fit (§5.A) | `DsbScSpectrumViz` is a single-tone comparison viz (impulse sidebands), cannot draw sinc→rect DSB-SC spectrum (§5.A); route via FdmCanonicalProblemViz T2 extension with numChannels=1 | Yes — via FdmCanonicalProblemViz T2 numChannels=1 (DsbScSpectrumViz does NOT fit, §5.A) | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, numChannels=1); (A) T1 wires + full rework |
| 13 | `proodos26-13` | Apr 2026 ΘΕΜΑ 13 | 8 | Combined G(f) = X_USSB,m + X_USSB,k: rect block at [f₁, f₁+W/2] + triangle at [f₂, f₂+W] (θετικές f), mirrors at negative side | **STATIC SVG** (L1172–1197, not interactive) | `FdmCanonicalProblemViz` | Same component as proodos26-11; replace static SVG with interactive | Yes — FdmCanonicalProblemViz T2 extension (reuses proodos26-11 T2, §5.B item 1) | **SPLIT (A)+(B)**: (B) T2 extends FdmCanonicalProblemViz (§5.B item 1, §5.C — reuses proodos26-11 T2); (A) T1 replaces static SVG + full rework |
| 14 | `pb25-th2-3` | Proodos B 2025 Θ2.3 | 6 | LSSB amplitude spectrum: sinc(2Wt)→rect baseband; LSSB keeps only lower sideband below fc (rect block at [fc-W, fc], NO upper sideband, NO carrier impulse) | TEXT-ONLY | `SSBSpectrumViz` or `UssbVsLssbComparison` | `SSBSpectrumViz` exists; `UssbVsLssbComparison` exists for contrast; either serves the draw requirement | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 15 | `pa25-th2-2` | Proodos A 2025 Θ2.2 | 5 | Overmodulated AM waveform: [1+2sin(2πt)]cos(8πt), μ=2>1, showing phase reversals where envelope crosses zero | TEXT-ONLY | `OvermodulationPhaseReversalViz` | **Exists** at `components/viz/OvermodulationPhaseReversalViz.tsx`; sibling `pb25-th2-2` shares repeatGroup 'am-draw-cos8pi' — same viz, same parameters | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework (pair step with pb25-th2-2) |
| 16 | `pb25-th2-2` | Proodos B 2025 Θ2.2 | 5 | Same as pa25-th2-2 (repeatGroup 'am-draw-cos8pi'): overmodulated AM waveform, μ=2 | TEXT-ONLY | `OvermodulationPhaseReversalViz` | Same viz as pa25-th2-2 | No new T2 needed | **(A)-only**: pair with pa25-th2-2 in same step (repeatGroup → one focused step covers both) |
| 17 | `jan26-th2-7` | Jan 2026 Θ2.7 | 4 | (1) Overmodulated AM waveform: [1+2sin(2πt)]cos(20πt), fc=10Hz, fm=1Hz, μ=2, phase reversals visible; (2) AM spectrum: impulses at ±9, ±10, ±11 Hz | TEXT-ONLY | `OvermodulationPhaseReversalViz` (time) + `AMSpectrumViz` (spectrum) | Same family as pa/pb25-th2-2 overmod cluster; different fc/fm values (cos20πt not cos8πt); same viz components with different parameters | No new T2 needed | **(A)-only**: T1 wires existing vizzes + full solution rework |

---

### FM chapter (0 problems)

Confirmed by `RELEVANCE_MAP.md §4.G G3`: no FM past-exam exercise contains a «Σχεδιάστε» / draw-spectrum instruction with a text-only solution. All FM exercises are computation / analysis type (write Bessel series, compute β, read J_n table, count sidebands, compute power fraction). No viz gaps by the classification criterion.

**Informational:** the Bessel "forest of impulses" spectrum (J_n(β) heights vs n, for varying β) is an enrichment opportunity for the `fm/bessel` theory page; `BesselSpectrumViz` already exists at `components/viz/BesselSpectrumViz.tsx`. No exercise card rework needed.

---

### Foundations chapter (4 problems)

| # | ID | Source | Weight | What must be drawn | Current state | Candidate viz | Reuse notes | New T2? | Sizing |
|---|---|---|---|---|---|---|---|---|---|
| 18 | `proodos26-10` | Apr 2026 ΘΕΜΑ 10 | 10 | Mixed amplitude spectrum of m(t)=sin(10πt)+sinc(10t): continuous rect (height 1/10, −5 to +5 Hz) from sinc-term PLUS two impulses (height 1/2) at exactly ±5 Hz from sin-term — mixed energy+power signal | **STATIC SVG** (L857–872, not interactive) | `MixedSpectrumViz` (new) | `proodos26-10` is unique: it requires simultaneously showing an impulse (sin) sitting at the edge of a rect (sinc) — no existing viz handles this mixed-type boundary case. `SpectrumViewer` shows either discrete OR continuous, not both mixed. | **NEW T2 primitive** `MixedSpectrumViz` — canvas viz showing continuous rect + discrete impulse at boundary, with N₀ and B sliders | **SPLIT (A)+(B)**: (B) build MixedSpectrumViz; (A) T1 replaces static SVG + full rework |
| 19 | `jan26-th2-10` | Jan 2026 Θ2.10 | 8 | Amplitude spectrum of x(t)=A·cos(2πf₁t)+B·sin(2πf₂t)+C·sin(2πf₃t): 6 impulse pairs at ±f₁, ±f₂, ±f₃ with heights A/2, B/2, C/2 (all positive for amplitude spectrum) | TEXT-ONLY (bullet list only) | `SpectrumViewer` (theory page) or `SpectrumLineViz` (new) | `SpectrumViewer` at `foundations/fourier-series` supports discrete impulse-line spectra with preset harmonic sets; could wire a custom cosines+sines preset; same viz serves `jun25-th1-7`. If `SpectrumViewer` is too rigid for arbitrary mixed cos/sin at distinct frequencies, build `SpectrumLineViz` instead | If `SpectrumViewer` suffices: **reuse** (T1 only). If not: **NEW T2** `SpectrumLineViz` | (A)-only IF SpectrumViewer is flexible; **SPLIT** if SpectrumLineViz needed |
| 20 | `jun25-th1-5` | June 2025 Θ1.5 | 6 | (1) Time-domain: periodic rect train, A=1, T=10s, τ=1s, duty cycle 10%; (2) Amplitude spectrum: discrete impulses at k/10 Hz with heights \|aₖ\| = 0.1\|sinc(k/10)\|, sinc envelope visible | TEXT-ONLY | `RectangularPulseFourier` | **Exists** at `components/viz/RectangularPulseFourier.tsx`; shows periodic rect train + discrete FS spectrum + sinc envelope with τ/T adjustable; directly serves this problem; also serves `jun25-th1-6` (τ=4s variant — enrichment) and `jan26-th1-4` (enrichment) | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 21 | `jun25-th1-7` | June 2025 Θ1.7 | 4 | Amplitude AND phase spectra of x(t)=Σₖ₌₁⁶ k²·cos(2πkfct+kπ/4): 6 impulse pairs, heights k²/2 at ±kfc for amplitude; phase ±kπ/4 at ±kfc | TEXT-ONLY (bullet list only) | `SpectrumViewer` or `SpectrumLineViz` | Same tool as jan26-th2-10; this problem requires amplitude+phase both shown (two panels); `SpectrumViewer` already shows both amplitude and phase spectra | Reuse `SpectrumViewer` or `SpectrumLineViz` from #19 | **(A)-only** if SpectrumViewer flexes; otherwise pair SPLIT with #19 |

**Cross-reference:** `RELEVANCE_MAP.md §5.G G2` (all four filed). Candidate T2 primitives per §5.G G2: `MixedSpectrumViz`, `SpectrumLineViz`, `RectangularPulseFourier` (exists). The `bus/inbox/091` T2 primitive proposals align with the §5.G G2 analysis.

---

## §2 Non-imperative matches (bucket ii)

These grep hits contain a σχεδιά / σχήμ / φάσμα word but are NOT genuine draw-imperative statements, or are circuit-draw problems already served by an existing static SVG circuit.

| ID | Matched phrase | Why not a DRAW gap |
|---|---|---|
| `proodos26-5` | «Σχεδιάστε το κύκλωμα» | Circuit schematic draw (diode AM modulator), NOT a spectrum/waveform draw. Solution already contains a static SVG circuit diagram (L321–349: adder + diode + R + BPF). Adequate for exam use. No interactive spectrum viz needed for a circuit schematic. |
| (prose — many) | «σχήμα της PSD» | Shape-of-PSD descriptor in solution prose (descriptive noun «σχήμα» = "shape"), NOT a draw instruction. Occurs in white-noise T/F problems (jan26-th1-3, pa25-th1-3, pb25-th1-3). |
| (table header) | `<th>Σχήμα</th>` (L1413) | Column header "Figure" in the AM comparison table of `sept25-th1-3`. Not a draw instruction. |
| `jun25-th1-6` | «τι θα συμβεί στο φάσμα» | Question asks about spectral CHANGE (qualitative analysis), not "draw the new spectrum". Statement: «τι θα συμβεί στο φάσμα αν τ=4sec». Answer is qualitative (first null shifts from k=10 to k=2.5). Not a draw imperative; enrichment (can be illustrated with `RectangularPulseFourier` slider once `jun25-th1-5` is reworked). |

---

## §3 Already-vizzed matches (bucket iii)

These exercises have a visual-imperative statement AND already have an interactive viz
component wired into their solution — no viz gap.

| ID | Embedded viz | Notes |
|---|---|---|
| `proodos26-6` | `NoiseFilterShapingViz` (LPF mode) | White noise through ideal LPF → output PSD. Full interactive viz present. |
| `sept25-th3-10` | `NoiseFilterShapingViz` (LPF mode) | Thermal noise PSD through LPF. Full interactive viz present. |
| `sept25-th3-11` | `NoiseFilterShapingViz` (LPF mode) | White noise through LPF (variant B). Full interactive viz present. |

These three LPF exercises are the model for `jun25-th1-10` (item #1 above), which is the
missing HPF/autocorrelation sibling.

---

## §4 Enrichment viz candidates (NOT text-only draw gaps, lower priority)

These are NOT text-only solutions to «Σχεδιάστε» statements — the problems are computation/derivation-type — but an interactive viz would materially deepen a struggling student's understanding.

| ID | Type | Proposed viz | Priority | Reference |
|---|---|---|---|---|
| `proodos26-12` | USSB FDM non-overlap derivation (algebra, NOT a draw statement) | Interactive carrier-spacing slider showing spectrum overlap/separation of two USSB channels as f₁ and f₂ vary | Medium — connects computation to visual intuition | RELMAP §3.G G1 (USSB FDM cluster); bus/inbox/080 |
| `sept25-th3-10` coaching | Thermal noise bespoke viz: PSD height = kT/2 as function of temperature T and resistance R | `ThermalNoisePSDViz` (new) | Low-medium | bus/inbox/045 + bus/inbox/046 |
| `/noise/snr §2–§3` | SNR two-tap viz: show signal + noise at two points in the receiver chain, with sliding signal power | `SNRPlaygroundViz` (EXISTS at `components/viz/SNRPlaygroundViz.tsx`) | Medium — theory page enrichment, not exercise card | bus/inbox/055 + bus/inbox/096 |
| `jun25-th1-4` | «Σχεδιάστε φάσμα 2cos(1000πt+π/4)» — trivial 2-impulse spectrum; RELMAP §5.F says "No gap" | Could serve as SpectrumLineViz demo once built for jan26-th2-10 | Very low — trivial content | RELMAP §5.F: explicitly classified "No gap" (2 impulses fully described in text) |
| `jun25-th1-6` | Spectral change as τ widens — qualitative follow-up to jun25-th1-5 | `RectangularPulseFourier` slider (reuse once built for #20) | Low — naturally served by jun25-th1-5's viz | — |

---

## Key cross-cutting findings

### Finding 1: Most T2 viz components already exist

The extensive `components/viz/` library already contains components that cover most of the
AM DRAW problems. The blocking issue is that these components are wired into **theory
pages** but NOT into `exercises.tsx` exercise cards. The rework work for most AM problems
is therefore T1-scope (wiring + full solution rework), not T2-scope (building a new viz).

**Existing components NOT YET wired into exercises.tsx** (wired into theory pages only):
- `OvermodulationPhaseReversalViz` → wired in `am/conventional/page.mdx`
- `NonlinearModulatorSpectrumViz` → wired in `am/modulator-demodulator/page.mdx`
- `FdmCanonicalProblemViz` → wired in `am/multiplexing/page.mdx`
- `DsbScSpectrumViz` → wired in `am/dsb-sc/page.mdx`
- `SSBSpectrumViz` / `UssbVsLssbComparison` → wired in `am/ssb/page.mdx`
- `RectangularPulseFourier` → wired in `foundations/fourier-series/page.mdx`

**New T2 primitives still needed** (4 items):
1. `NoiseFilterShapingViz` HPF mode extension + R_N(τ) panel (for `jun25-th1-10`)
2. `SpectrumLineViz` OR extend `SpectrumViewer` for configurable mixed cos/sin harmonic sets (for `jan26-th2-10`, `jun25-th1-7`, `sept25-th1-5` two-tone)
3. `MixedSpectrumViz` for mixed energy+power boundary spectrum (for `proodos26-10`)
4. FDM mixed-mode extension (DSB-SC + conventional AM co-channel) for `jun25-th2` and `pb25-th3-mux` — verify whether `FdmCanonicalProblemViz` or `FDMSpectrumViz` already handles DSB-SC mode before scheduling

### Finding 2: USSB/FDM cluster shares one viz

Problems `proodos26-11`, `proodos26-13`, `jan26-th3-mux`, `pa25-th3-mux` all use USSB
FDM with rect/tri baseband shapes — same `FdmCanonicalProblemViz` or `SSBFdmSpectrumViz`
component. Planner should schedule as a batch once the viz is confirmed wire-ready.
**§5 IS the wire-readiness confirmation and found the cluster NOT wire-ready as-is: the FDM extension (§5.B item 1) is required before any T1 wiring step.** This applies to all 7 FDM problems: `pa25-th3-mux`, `jan26-th3-mux`, `proodos26-11`, `proodos26-13`, `pb25-th3-mux`, `jun25-th2`, `jan26-th2-8`.

### Finding 3: Overmodulated-waveform cluster shares one viz

Problems `pa25-th2-2`, `pb25-th2-2` (repeatGroup `am-draw-cos8pi`), and `jan26-th2-7`
(different fc/fm but same phenomenon) all use `OvermodulationPhaseReversalViz`. These
should be batched.

### Finding 4: Multi-harmonic AM spectrum cluster shares one viz

Problems `pa25-th2-5`, `pb25-th2-5` (and implicitly `sept25-th1-5` two-tone) all need
a configurable impulse-line spectrum with AM shift. Once `SpectrumLineViz` is built, all
three wire with different harmonic parameters.

### Finding 5: Foundations impulse-line spectrum cluster shares one viz

Problems `jan26-th2-10` and `jun25-th1-7` both need a configurable cos/sin impulse-line
spectrum (amplitude + phase panels). Same component, different parameters.

---

## Recommended planner scheduling

Suggested batching for the rework phase (each row = one focused step):

| Step | Scope | Problems | T2 needed? |
|---|---|---|---|
| T2: noise HPF extension | extend `NoiseFilterShapingViz` | — | Yes → builds HPF mode + R_N panel |
| T1: noise LPF+HPF rework | wire extended viz + full rework | `jun25-th1-10` | No (T2 prerequisite above) |
| T2: FDM mixed-mode verify/extend | verify `FDMSpectrumViz` or extend `FdmCanonicalProblemViz` | — | Possibly |
| T1: overmod waveform batch | wire `OvermodulationPhaseReversalViz` + rework | `pa25-th2-2`, `pb25-th2-2` (same step, repeatGroup) | No |
| T1: overmod waveform+spectrum | wire `OvermodulationPhaseReversalViz` + `AMSpectrumViz` + rework | `jan26-th2-7` | No |
| T1: nonlinear modulator rework | wire `NonlinearModulatorSpectrumViz` + rework | `pb25-th4-nonlinear` | No |
| T2: SpectrumLineViz (or SpectrumViewer extension) | new configurable impulse-line viz | — | Yes |
| T1: multi-harmonic AM batch | wire SpectrumLineViz + rework | `pa25-th2-5`, `pb25-th2-5` (one step) | No (T2 prerequisite) |
| T1: two-tone AM rework | wire multi-tone viz + rework | `sept25-th1-5` | No (T2 prerequisite) |
| T1: tone AM waveform+spectrum | wire `AMSignalViz` + `AMSpectrumViz` + rework | `proodos26-9` | No |
| T1: DSB-SC spectrum rework | wire `FdmCanonicalProblemViz` (numChannels=1) + rework | `jan26-th2-8` | via FDM T2 numChannels=1 (DsbScSpectrumViz does NOT fit, §5.A) |
| T1: LSSB spectrum rework | wire `SSBSpectrumViz` / `UssbVsLssbComparison` + rework | `pb25-th2-3` | No |
| T1: USSB FDM static-SVG → interactive batch | wire `FdmCanonicalProblemViz` + rework | `proodos26-11`, `proodos26-13` (same step) | Yes (FDM extension, §5.B/§5.C) |
| T1: USSB FDM text-only batch | wire `FdmCanonicalProblemViz` + rework | `jan26-th3-mux` | Yes (FDM extension, §5.B/§5.C) |
| T1: USSB FDM text-only batch | wire `FdmCanonicalProblemViz` + rework | `pa25-th3-mux` | Yes (FDM extension, §5.B/§5.C) |
| T1: DSB-SC FDM rework | wire FDM viz + rework | `pb25-th3-mux` | Yes (FDM extension, §5.B/§5.C) |
| T1: mixed FDM rework | wire FDM viz + rework | `jun25-th2` | Yes (FDM extension, §5.B/§5.C) |
| T2: MixedSpectrumViz | new mixed energy+power spectrum viz | — | Yes |
| T1: mixed-spectrum rework | wire `MixedSpectrumViz` + rework | `proodos26-10` | No (T2 prerequisite) |
| T1: foundations impulse-line batch | wire `SpectrumViewer` or `SpectrumLineViz` + rework | `jan26-th2-10`, `jun25-th1-7` (one step) | No (if SpectrumLineViz built) |
| T1: rect-pulse FS rework | wire `RectangularPulseFourier` + rework | `jun25-th1-5` | No |

---

## Source citations

- **DRAW gap primary source:** direct grep + live solution verification in
  `content/practice/exercises.tsx` (2026-05-31)
- **Pre-loaded candidate cross-reference:** all 22 pre-loaded candidates verified
  against live statements (not transcribed blindly); classification adjustments noted below
- **Prior step gap filings:** `RELEVANCE_MAP.md §2.G G2`, `§3.G G1`, `§3.G G2`, `§5.G G2`
  (all consistent with and incorporated into this audit)
- **Viz inventory:** `components/viz/*.tsx` glob (2026-05-31); existing component
  purposes verified by reading component docstrings

**Pre-loaded candidate classification adjustments vs. the filing list:**
- `proodos26-12` ("USSB FDM non-overlap") — statement is a derivation question
  («Πόσο πρέπει να είναι τα φέροντα...»), NOT a «Σχεδιάστε» instruction. Filed as
  §4 ENRICHMENT (interactive viz would help, but this is not a text-only answer to a
  draw imperative). No classification change to other candidates.
- All other pre-loaded AM/noise/foundations candidates confirmed as genuine DRAW gaps
  with text-only or static-SVG solutions.

---

## §5 VIZ-FIT VERDICTS

> **Produced by builder step `draw-viz-fit-verification` (iter 102, 2026-06-04).**
> Every verdict is grounded in what the component file ACTUALLY renders (props +
> draw logic read directly) and what exercises.tsx ACTUALLY asks. Component
> reads: `components/viz/*.tsx`. Exercise reads: `content/practice/exercises.tsx`.
> Done problems (overmod-waveform cluster + `pb25-th4-nonlinear`) are omitted —
> they are already closed.

---

### §5.A Per-problem verdict table

**Key:**
- **FIT** — existing component (with at most props + figcaption mapping) draws this
  problem's exact answer. Schedulable as T1-only Opus rework.
- **EXTEND** — nearly fits; bounded change to the component unblocks it. Requires a
  focused T2 extend step before the T1 rework.
- **NEW** — no existing component draws this answer; a new primitive is needed.

---

#### Noise (1 problem)

| ID | Weight | Candidate viz | VERDICT | Exact note | Step type |
|---|---|---|---|---|---|
| `jun25-th1-10` | 13 | `NoiseFilterShapingViz` EXTEND | **EXTEND** | Component (`NoiseFilterShapingViz.tsx` L17–23) has `lpf`, `bpf`, `rc` modes — but **no HPF mode and no R_N(τ) panel**. Problem (exercises.tsx L4241–4248) asks for (1) S_LP(f) + S_HP(f) side-by-side AND (2) autocorrelation R_LP(τ) + R_HP(τ). Spec: add `showDual: true` mode rendering two 3-panel stacks (LPF fc=W, HPF fc=10W) each with an optional R_N(τ) canvas panel (IFT of output PSD). HPF shape: inverted LPF (flat above cutoff, 0 below). R_LPF = N₀W·sinc(2Wτ); R_HPF = Dirac-delta minus bandlimited sinc (show numerically). F6 (`bandpass-noise-r`) tagging note: **already clean** — current formulaIds for `jun25-th1-10` do NOT include `bandpass-noise-r`; no removal needed. | SPLIT (B) T2 extend + (A) T1 rework |

---

#### AM — FDM cluster (6 problems) — THE LOAD-BEARING GROUP

The central question: can `FdmCanonicalProblemViz` or `FDMSpectrumViz` parametrize to
each problem's baseband shapes + carriers + modulation type, or are they hardcoded to
the `am/multiplexing` theory-page example?

**`FdmCanonicalProblemViz.tsx` (definitive read, L1–468):**
- `function FdmCanonicalProblemViz()` — NO props. Zero-argument function.
- Hardcoded baseband pair: m(t) = sinc(2Wt) → rect of half-BW W; k(t) = Π(4Wt) → sinc
  lobe drawn at half-BW **W_K = 2W — WRONG: first null is 4W** (exercises.tsx L5171
  confirmed: K(f)=(1/(4W))sinc(f/(4W)), first null at |f|=4W). These constants are
  module-level (`const W = 1.0`, `const W_K = 2.0`).
- Hardcoded carrier position: `const F1 = 3.0` (carrier 1 at 3W; carrier 2 = F1 +
  spacing).
- Has USSB/DSB-SC toggle (`modType: 'dsb' | 'ssb'`). USSB draws only upper sideband;
  DSB-SC draws full ±W band around each carrier.
- Draws 4 stacked panels: baseband M(f), baseband K(f), modulated spectra, combined G(f).
- Contains `drawRect`, `drawSinc`, `drawSincBand` primitives. No `drawTriangle` or
  `drawConventionalAMImpulse`.

**`FDMSpectrumViz.tsx` (definitive read, L1–255):**
- `function FDMSpectrumViz()` — NO props.
- 3 channels, ALL with **identical** bandwidth W and **triangle-bump** shape (L234–255:
  `drawTriangleBump` for all channels).
- DSB/SSB toggle only. No per-channel modulation type.
- This is a conceptual "channel separation" viz, NOT a per-problem exact-spec renderer.
  **Cannot serve any FDM exam solution viz as-is** — wrong channel count (3 vs 2),
  wrong shapes (triangle vs rect/sinc), identical BW across channels.

| ID | Weight | Candidate viz | VERDICT | Exact note | Step type |
|---|---|---|---|---|---|
| `pa25-th3-mux` | 25 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L5171 confirmed: k(t)=Π(4Wt) → K(f)=(1/(4W))sinc(f/(4W)), first null at 4W. `FdmCanonicalProblemViz` hardcodes `W_K=2.0` (L36) — 2× too narrow; default-config draws k's spectrum at half-BW 2W, producing a wrong answer. **T1-wire AFTER the FdmCanonicalProblemViz extension, passing kBW=4 (USSB Π(4Wt) → first null 4W).** Figcaption mapping: label axes as f₁ and f₂; note M(f) is the rect block and K(f) is the sinc lobe (first null at 4W). | SPLIT (B) T2 extend + (A) T1 rework |
| `jan26-th3-mux` | 20 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L3444: same canonical pair k(t)=Π(4Wt) — same 4W first-null defect as pa25-th3-mux. Default-config draws k at W_K=2W — wrong. **T1-wire AFTER the FdmCanonicalProblemViz extension, passing kBW=4 (USSB Π(4Wt) → first null 4W).** Figcaption MUST state: "viz is schematic — actual f₁=100 kHz, f₂=1 MHz; axis shows relative units of W." | SPLIT (B) T2 extend + (A) T1 rework |
| `proodos26-11` | 9 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L1135–1144: m(t) = sinc(Wt), k(t) = sinc²(Wt). sinc(Wt) → M(f) = (1/W)·rect(f/W) → half-BW = **W/2** (not W). sinc²(Wt) → K(f) = (1/W)·tri(f/W) → **triangle** of half-BW = W (not sinc lobe of 2W). FdmCanonicalProblemViz has hardcoded W=1, W_K=2, sinc-lobe shape for k. Cannot produce triangle shape or W/2 half-bandwidth without props. Spec: add `mBW?: number` (default 1), `kBW?: number` (default 2), `kShape?: 'sinc' | 'triangle'` (default 'sinc') props. With `mBW=0.5, kBW=1, kShape='triangle'`: panel 1 → rect of half-BW W/2; panel 2 → triangle of half-BW W; panels 3–4 → correct USSB shapes. | SPLIT (B) T2 extend + (A) T1 rework |
| `proodos26-13` | 8 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L1337–1343: asks for combined G(f) of the same proodos26-11/12 pair. Reuses same T2 extension (`mBW=0.5, kBW=1, kShape='triangle'`, USSB mode). Panel 4 (G(f)) directly shows the answer. | SPLIT (B) T2 extend + (A) T1 rework (reuses proodos26-11 T2) |
| `pb25-th3-mux` | 25 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L5808: m(t) = sinc(Wt) → rect half-BW **W/2**; k(t) = Π(Wt) → sinc lobe half-BW **W**. DSB-SC for both channels. FdmCanonicalProblemViz DSB mode draws rect half-BW=W and sinc half-BW=2W — both twice as wide. After extension: `mBW=0.5, kBW=1, kShape='sinc', modType='dsb'` → correct. Non-overlap condition f₂ ≥ f₁ + 3W/2 should be verified by the overlap detector logic (currently checks f₂ − W_K ≥ f₁ + W; with kBW=1: f₂ − W ≥ f₁ + W/2 → f₂ ≥ f₁ + 3W/2 ✓). | SPLIT (B) T2 extend + (A) T1 rework (reuses FDM T2) |
| `jun25-th2` | 25 | `FdmCanonicalProblemViz` EXTEND | **EXTEND** | exercises.tsx L4344–4354: m(t)=sinc(Wt) → DSB-SC (NO carrier impulse), k(t)=sinc(6Wt) → **conventional AM** (carrier impulse at ±f₂). FdmCanonicalProblemViz has a global `modType` toggle (dsb/ssb) applied to BOTH channels — cannot do mixed DSB-SC + AM-conventional. Also k's BW is 3W (sinc(6Wt) → rect half-BW = 3W). Spec: add `kMod?: 'same' | 'am-conventional'` prop (default 'same'). When `kMod='am-conventional'`: panel 2 draws k baseband rect; panel 3 draws k as DSB bands PLUS carrier impulse at ±f₂. With `mBW=0.5, kBW=3, kShape='rect', kMod='am-conventional'` on top of the BW/shape extension: all 4 panels correct. This is the hardest change in the extension batch (new draw primitive: carrier impulse). | SPLIT (B) T2 extend + (A) T1 rework (reuses FDM T2) |

**FDM cluster recommendation:** ONE focused T2 step extends `FdmCanonicalProblemViz`
with the following bounded props:
1. `mBW?: number` (default 1.0) — m-channel baseband half-bandwidth in units of W
2. `kBW?: number` (default 2.0) — k-channel baseband half-bandwidth in units of W
3. `kShape?: 'sinc' | 'triangle' | 'rect'` (default 'sinc') — k-channel baseband shape
4. `kMod?: 'same' | 'am-conventional'` (default 'same') — k-channel modulation type override
5. `numChannels?: 1 | 2` (default 2) — when 1, renders m-channel only (4-panel: baseband, skip, modulated, labeled X(f) not G(f))

These 5 props in ONE T2 step unlock: **pa25-th3-mux** (kBW=4, USSB), **jan26-th3-mux**
(kBW=4, USSB), **proodos26-11** (mBW=0.5, kShape='triangle', kBW=1), **proodos26-13**
(same), **pb25-th3-mux** (mBW=0.5, kBW=1, kShape='sinc', modType='dsb'), **jun25-th2**
(mBW=0.5, kBW=3, kShape='rect', kMod='am-conventional'), and **jan26-th2-8** (numChannels=1, mBW=1,
modType='dsb'). That is 7 T1 problems unblocked by 1 T2 extension.

`FDMSpectrumViz` is NOT part of the solution for any exam problem: it has 3 identical
triangle-bump channels and cannot represent any of the above correctly.

---

#### AM — remaining single-channel draws (4 problems)

| ID | Weight | Candidate viz | VERDICT | Exact note | Step type |
|---|---|---|---|---|---|
| `sept25-th1-5` | 10 | `SpectrumLineViz` (NEW) | **NEW** | exercises.tsx L1739–1745: 2-tone AM m(t) = cos(2π·1kHz·t) + 0.5cos(2π·2kHz·t), fc=100kHz. Answer: 5 impulse pairs at {±98, ±99, ±100, ±101, ±102} kHz with heights {1/8, 1/4, Ac/2, 1/4, 1/8}. `SpectrumViewer` has no props (hardcoded presets, L41–109) and displays k·F0 axis labels — cannot show symbolic labels "fc±1" etc. `AMSpectrumViz` is single-tone only. Need `SpectrumLineViz` (see §5.B). | SPLIT (B) T2 SpectrumLineViz + (A) T1 rework |
| `pa25-th2-5` | 8 | `SpectrumLineViz` (NEW) | **NEW** | exercises.tsx L5109: Σₙ₌₁⁸ n·cos(2πnt). Baseband: 8 impulse pairs at ±n Hz, heights n/2. AM: 17 impulse pairs (carrier + 8 USB + 8 LSB). No existing viz draws an arbitrary N-harmonic spectrum at specific labeled positions. SpectrumViewer is preset-only with no props. | SPLIT (B) T2 SpectrumLineViz + (A) T1 rework |
| `pb25-th2-5` | 8 | `SpectrumLineViz` (NEW) | **NEW** | exercises.tsx L5758: Σₙ₌₁⁶ (10−n)·cos(2πnt). Baseband: 6 impulse pairs, heights 4.5/4/3.5/3/2.5/2. AM: 13 impulse pairs. Sibling of pa25-th2-5 — same SpectrumLineViz with different parameters. **Tagging fix to apply in T1 step:** add `'am-spectrum'` to formulaIds (currently only `['am-signal']`; RELEVANCE_MAP inbox/077 confirmed missing). | SPLIT (B) T2 SpectrumLineViz + (A) T1 rework |
| `jan26-th2-8` | 8 | `FdmCanonicalProblemViz` EXTEND (numChannels=1) | **NEW→T1-only after FDM T2** | exercises.tsx L3308–3313: m(t) = 2·sinc(2Wt), DSB-SC, fc = fc. Answer: two rect blocks [fc−W, fc+W] at ±fc, height 1/(2W), NO carrier impulse. `DsbScSpectrumViz` (L1–50): **confirmed does NOT fit** — it is an AM vs DSB-SC comparison viz for single-tone sinusoidal message (impulse sidebands at ±fm from ±fc), with a μ-slider. Draws impulse pairs, not continuous-rect DSB-SC spectrum. Cannot show sinc → rect baseband at all. After the FDM T2 extension adds `numChannels=1` prop: wire FdmCanonicalProblemViz with `numChannels=1, modType='dsb', mBW=1` to show the 3-panel single-channel DSB-SC answer. Becomes T1-only step. | T1-only after FDM T2 extension |
| `pb25-th2-3` | 6 | `SSBSpectrumViz` EXTEND | **EXTEND** | exercises.tsx L5661: m(t) = 2·sinc(2Wt) → M(f) = (1/W)·rect(f/(2W)), LSSB → rect block [fc−W, fc]. `SSBSpectrumViz.tsx` (L1–234) LSB mode: draws a **triangular** lower sideband (path "M centerF → top L centerF → bottom L (centerF−W_MSG)" — right-triangle shape). For a sinc message the answer is a FLAT-TOP rect block, not a triangle. `UssbVsLssbComparison.tsx` (L1–38) also uses triangular or impulse-pair shapes — also wrong. Spec: add `messageShape?: 'rect' | 'triangle'` prop to `SSBSpectrumViz` (default 'triangle' preserves current behavior); when 'rect', the drawSideband paths produce flat-top rect blocks. | SPLIT (B) T2 extend SSBSpectrumViz + (A) T1 rework |

---

#### Foundations (4 problems)

| ID | Weight | Candidate viz | VERDICT | Exact note | Step type |
|---|---|---|---|---|---|
| `jan26-th2-10` | 8 | `SpectrumLineViz` (NEW) | **NEW** | exercises.tsx L3408–3428: x(t) = A·cos(2πf₁t) + B·sin(2πf₂t) + C·sin(2πf₃t), f₁≠f₂≠f₃ arbitrary. Draw amplitude spectrum: 6 impulse pairs at ±f₁, ±f₂, ±f₃, heights A/2, B/2, C/2 (all positive for amplitude spectrum). `SpectrumViewer` (`SpectrumViewer.tsx` L111–222): no props, 4 hardcoded presets, x-axis labels are integer multiples of F0 (k·f₀ for k=−7..+7). Cannot display arbitrary symbolic frequency labels f₁, f₂, f₃ without fundamental restructuring. A new `SpectrumLineViz` that accepts `lines: [{f, mag, label}]` is needed. | SPLIT (B) T2 SpectrumLineViz + (A) T1 rework |
| `jun25-th1-7` | 4 | `SpectrumLineViz` (NEW) or `SpectrumViewer` EXTEND | **NEW/T1-only after SpectrumLineViz T2** | exercises.tsx L3979–4009: x(t) = Σₖ₌₁⁶ k²·cos(2πkfct + kπ/4), Aₖ=k², φₖ=kπ/4. Both amplitude (heights k²/2 at ±kfc) AND phase (±kπ/4) panels required. `SpectrumViewer` already shows both amplitude and phase canvases and operates on integer multiples of F0 (which matches k=1..6 multiples of fc). If extended with a `lines` prop it could serve this problem. However, since `SpectrumLineViz` is built for jan26-th2-10 anyway and must support the phase panel for this problem, route jun25-th1-7 through `SpectrumLineViz` (pass `showPhase=true`). Becomes T1-only after the SpectrumLineViz T2. | T1-only after SpectrumLineViz T2 |
| `jun25-th1-5` | 6 | `RectangularPulseFourier` EXTEND | **EXTEND** | exercises.tsx L3868–3893: τ=1s, T=10s, duty cycle τ/T=**10%**, aₖ = 0.1·sinc(k/10), first null at k=10. `RectangularPulseFourier.tsx` (L20–30): `const T0 = 1.0`, hardcoded `function ak(k) { return 0.5 * sinc(k/2) }` — **50% duty cycle only**. First null at k=2. For 10% duty cycle the sinc envelope is completely different. Also `K_MAX_DRAW = 21` may be insufficient for 10% case (first null at k=10, meaningful content through k~30). Spec: add `dutyCycle?: number` prop (default 0.5) and update `ak(k)` to `dutyCycle * sinc(k * dutyCycle)`. Also expose `period?: number` for the time-domain panel labels. With `dutyCycle=0.1` and `K_MAX_DRAW` bumped to 31: correct. | SPLIT (B) T2 extend RectangularPulseFourier + (A) T1 rework |
| `proodos26-10` | 10 | `MixedSpectrumViz` (NEW) | **NEW** | exercises.tsx L1022–1098: m(t) = sin(10πt) + sinc(10t). |M(f)| = continuous rect (height 1/10) from −5 to +5 Hz PLUS impulse pairs (height 1/2) at EXACTLY ±5 Hz. Current solution has a static SVG (exercises.tsx L1054–1087) that correctly renders this shape. The DRAW phase requirement: replace with INTERACTIVE viz. Build `MixedSpectrumViz` — shows continuous rect + discrete impulse at boundary — with sliders for frequency scale (f₀) and amplitude (A for the periodic term, B for the energy term), letting the student adjust and see how the spectrum changes. The boundary-coincidence (impulse at the rect edge) is the pedagogically critical feature to highlight interactively. | SPLIT (B) T2 MixedSpectrumViz + (A) T1 rework |

---

### §5.B Consolidated T2 primitives actually needed

Six T2 work items. Plan them as **six focused T2 steps** (one primitive per step). The
FDM extension unblocks the most problems (7); the rest are single-problem unblocks.

| # | T2 primitive | Type | Exact spec | Problems unblocked |
|---|---|---|---|---|
| 1 | **`FdmCanonicalProblemViz` extend** | EXTEND | Add props: `mBW?: number` (default 1), `kBW?: number` (default 2), `kShape?: 'sinc'|'triangle'|'rect'` (default 'sinc'), `kMod?: 'same'|'am-conventional'` (default 'same'), `numChannels?: 1|2` (default 2). Add `drawTriangle` canvas primitive (right-triangle sinc² approximation). For `kMod='am-conventional'`: draw k's DSB bands + a carrier impulse arrow at ±f₂. For `numChannels=1`: hide panel 2, relabel panel 4 as X(f). Preserve all existing behavior when props are omitted. **CRITICAL: scale `fMaxModulated` (current L198: `const fMaxModulated = f2 + W_K + 1`) off the `kBW` prop, NOT the hardcoded `W_K` constant — with kBW=4 the hardcoded formula clips the rightmost 2W of k's sinc lobe (canvas renders only to f2+3W instead of f2+5W, cutting off the outer sinc lobes).** | `pa25-th3-mux`, `jan26-th3-mux`, `proodos26-11`, `proodos26-13`, `pb25-th3-mux`, `jun25-th2`, `jan26-th2-8` (7 problems) |
| 2 | **`SpectrumLineViz` (new component)** | NEW | `lines: Array<{fNorm: number, mag: number, phase?: number, label?: string}>`, `fMin: number`, `fMax: number`, `showPhase?: boolean`, `title?: string`. Renders: amplitude panel (impulse sticks at fNorm positions, height = mag, label below each stick), optional phase panel (phase values at same positions). Horizontal axis shows provided labels (e.g. "−f₂", "+f_c−1"); vertical axis autoscales. Mirror symmetry is the caller's responsibility (pass explicit ± pairs). | `jan26-th2-10`, `jun25-th1-7`, `sept25-th1-5`, `pa25-th2-5`, `pb25-th2-5` (5 problems) |
| 3 | **`NoiseFilterShapingViz` extend** | EXTEND | Add `showDual?: boolean` prop (default false). When true: renders two 3-panel stacks side by side — left stack LPF (fc = W, rect passband), right stack HPF (fc = 10W, inverted rect: zero below cutoff, N₀/2 above). Add `showAutocorr?: boolean` prop: when true, each stack gets a 4th panel showing R_N(τ) computed as numerical IFT of output PSD (draw sinc for LPF; show flat-inverted-sinc for HPF). Sliders per stack optional. | `jun25-th1-10` (1 problem) |
| 4 | **`SSBSpectrumViz` extend** | EXTEND | Add `messageShape?: 'rect' | 'triangle'` prop (default 'triangle' preserves all current behavior). When 'rect': replace the triangular path in `drawSideband` with a flat-top rect path (move vertically from yZero to yPeak, step horizontally to the sideband edge, step down to yZero). All USB/LSB/DSB modes work with the new shape. | `pb25-th2-3` (1 problem) |
| 5 | **`RectangularPulseFourier` extend** | EXTEND | Add `dutyCycle?: number` prop (default 0.5, preserves 50% behavior). Update `ak(k)` to `dutyCycle * sinc(k * dutyCycle)`, update the time-domain waveform panel to draw pulses of width `dutyCycle * T0` per period, and bump `K_MAX_DRAW` to at least `Math.ceil(3 / dutyCycle)` (covers 3 mainlobes). Expose `period?: number` for axis labels. | `jun25-th1-5` (1 problem) |
| 6 | **`MixedSpectrumViz` (new component)** | NEW | `contBW: number` (continuous-rect half-bandwidth), `contHeight: number` (rect height), `impulseFreqs: number[]` (impulse positions), `impulseMags: number[]` (impulse heights), `title?: string`. Renders a single amplitude spectrum panel: continuous rect region drawn as a filled shape, discrete impulses drawn as arrows at specified positions. Color-code continuous (blue) vs impulse (amber) to highlight the mixed energy/power nature. Key pedagogical feature: impulses sitting exactly at the rect boundary (this is the proodos26-10 exam scenario) rendered prominently. | `proodos26-10` (1 problem) |

**Total T2 steps: 6.** After all 6, the remaining 16 DRAW problems become T1-only Opus rework steps.

---

### §5.C FDM cluster recommendation (explicit)

**Recommendation: ONE shared T2 extension of `FdmCanonicalProblemViz` serves all 6 FDM
problems (plus jan26-th2-8 as a bonus).**

Rationale: `FdmCanonicalProblemViz` already has the correct 4-panel pedagogical structure
(baseband → modulated → combined), the overlap-detection logic, the DSB/SSB toggle, and
the carrier-spacing slider. The 6 FDM exam problems all ask to draw precisely this 4-panel
answer — they differ only in baseband shapes, bandwidths, and per-channel modulation type.
Parametrizing those differences via 5 props is a bounded, coherent change.

`FDMSpectrumViz` is NOT part of the solution — it uses 3 identical triangle-bump channels
and cannot represent any FDM exam problem correctly.

**USSB vs DSB-SC vs mixed-mode verdict:** these do NOT need different viz components.
They need different prop values on the same extended `FdmCanonicalProblemViz`:
- USSB (pa25-th3-mux, jan26-th3-mux, proodos26-11, proodos26-13): `modType='ssb'`
- DSB-SC FDM (pb25-th3-mux): `modType='dsb'`
- Mixed DSB-SC + conventional AM (jun25-th2): `kMod='am-conventional'`

**Minimal T2 plan:**
1. T2 step: extend `FdmCanonicalProblemViz` with 5 props (as specified in §5.B item 1).
2. T1 steps (7, each Opus, independent of each other once T2 is done):
   - Wire `pa25-th3-mux` (kBW=4, USSB, full solution rework)
   - Wire `jan26-th3-mux` (kBW=4, USSB, figcaption caveat, full rework)
   - Wire `proodos26-11` (mBW=0.5, kShape='triangle', kBW=1, USSB, full rework)
   - Wire `proodos26-13` (same props as proodos26-11, full rework)
   - Wire `pb25-th3-mux` (mBW=0.5, kBW=1, kShape='sinc', modType='dsb', full rework)
   - Wire `jun25-th2` (mBW=0.5, kBW=3, kShape='rect', kMod='am-conventional', full rework)
   - Wire `jan26-th2-8` (numChannels=1, modType='dsb', mBW=1, full rework)

---

### §5.D Tagging fixes to apply in T1 rework steps (DO NOT apply in this step)

These are formulaId tagging corrections the eventual T1 reworks must apply. Recorded here
so the planner can annotate the relevant steps.

- **`pb25-th2-5`** — add `'am-spectrum'` to `formulaIds` (currently `['am-signal']` only).
  Per RELEVANCE_MAP inbox/077: the problem explicitly asks to draw the AM spectrum, making
  `am-spectrum` a primary formulaId. The sibling `pa25-th2-5` already carries it.
- **`jun25-th1-10` F6 mis-tag** — confirmed **already clean**: current `formulaIds` list
  (`['white-noise-psd', 'lti-output-psd', 'bandlimited-noise-power', 'bandlimited-noise-autocorr', 'wiener-khinchin']`)
  does NOT contain `bandpass-noise-r`. No removal needed.

---

*§5 end — produced step `draw-viz-fit-verification`, 2026-06-04.*
