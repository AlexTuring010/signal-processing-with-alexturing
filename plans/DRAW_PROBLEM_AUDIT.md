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

**Total: 21 problems** (1 Noise + 16 AM + 0 FM + 4 Foundations).

### Noise chapter (1 problem)

| # | ID | Source | Weight | What must be drawn | Current state | Candidate viz | Reuse notes | New T2? | Sizing |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `jun25-th1-10` | June 2025 Θ1.10 | 7 | (1) LPF output PSD S_LP(f) + HPF output PSD S_HP(f) side-by-side; (2) autocorrelation R_LP(τ) = N₀W·sinc(2Wτ) AND R_HP(τ) | TEXT-ONLY | `NoiseFilterShapingViz` extended with HPF mode + R_N(τ) autocorrelation panel | Siblings (`proodos26-6`, `sept25-th3-10`, `sept25-th3-11`) already wire `NoiseFilterShapingViz` LPF mode; HPF + autocorrelation are new capabilities | **NEW T2 extension** — add `filterType:'hpf'` prop + R_N(τ) canvas panel to existing `NoiseFilterShapingViz` | **SPLIT (A)+(B)**: (B) T2 extends `NoiseFilterShapingViz`; (A) T1 wires it + full solution rework |

**Cross-reference:** `RELEVANCE_MAP.md §2.G G2` (viz gap filed). `MUST_LEARN_FORMULAS.md §2B`: `wiener-khinchin` weight=3 — this is one of the three exercises; R_LP derivation via W-K inverse FT is the skill. Also: F6 (`bandpass-noise-r`) mis-tag must be removed from `formulaIds` in same T1 step.

---

### AM chapter (16 problems)

Conventional AM waveform + spectrum draws:

| # | ID | Source | Weight | What must be drawn | Current state | Candidate viz | Reuse notes | New T2? | Sizing |
|---|---|---|---|---|---|---|---|---|---|
| 2 | `pb25-th4-nonlinear` | Proodos B 2025 Θ4 | 25 | Spectrum of y(t) = x²(t): (a) baseband rect ±W; (b) DSB-SC component at ±fc with BW 2W (no carrier impulse); (c) DC + harmonics at ±2fc | TEXT-ONLY | `NonlinearModulatorSpectrumViz` | **Exists** at `components/viz/NonlinearModulatorSpectrumViz.tsx`; currently wired only in `am/modulator-demodulator` theory page — NOT in exercises.tsx | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 3 | `jun25-th2` | June 2025 Θ2 | 25 | Mixed FDM: (1) DSB-SC m(t)=sinc(Wt) spectrum (rect ±W/2, no carrier impulse); (2) conventional AM k(t)=sinc(6Wt) spectrum (rect ±3W + carrier impulse at ±f₂); (3) combined G(f) = X_m + X_k | TEXT-ONLY | `FdmCanonicalProblemViz` or extension; alternatively `FDMSpectrumViz` | `FdmCanonicalProblemViz` at `am/multiplexing` handles USSB FDM; mixed DSB-SC + conventional AM FDM needs a mode or separate viz; `FDMSpectrumViz` exists at `components/viz/FDMSpectrumViz.tsx` — check if it handles mixed modes | Possibly **NEW T2 extension** (mixed-mode FDM) if existing components don't support DSB-SC + AM co-channel | **SPLIT (A)+(B)**: (B) verify/extend FDM viz; (A) T1 full solution rework |
| 4 | `pa25-th3-mux` | Proodos A 2025 Θ3 | 25 | (1) USSB baseband spectra: sinc(2Wt)→rect [−W,W]; Π(4Wt)→sinc·(4W) lobe; (2) USSB-modulated spectra: upper sideband only at ±f₁, ±f₂; (3) combined G(f) | TEXT-ONLY | `FdmCanonicalProblemViz` | **Exists** at `am/multiplexing` theory page only; same family as proodos26-11/13 USSB cluster | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 5 | `pb25-th3-mux` | Proodos B 2025 Θ3 | 25 | (1) DSB-SC m(t)=sinc(Wt) per-channel spectrum; (2) DSB-SC k(t)=Π(Wt) per-channel spectrum; (3) non-overlap condition; (4) combined G(f) = X_m + X_k | TEXT-ONLY | `FdmCanonicalProblemViz` with DSB-SC mode | `FdmCanonicalProblemViz` currently targets USSB; DSB-SC FDM may need mode flag; `FDMSpectrumViz` is an alternative | Possibly **NEW T2 extension** if `FdmCanonicalProblemViz` only handles SSB FDM | **SPLIT (A)+(B)**: (B) check/extend FDM viz for DSB-SC mode; (A) T1 full rework |
| 6 | `jan26-th3-mux` | Jan 2026 Θ3.11–12 | 20 | (1) USSB baseband spectra: sinc(2Wt)→rect (BW W), Π(4Wt)→sinc envelope (BW W/2); (2) USSB-modulated at f₁=100kHz, f₂=1MHz; (3) combined G(f) | TEXT-ONLY | `FdmCanonicalProblemViz` | Same family as pa25-th3-mux; same viz component | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 7 | `proodos26-9` | Apr 2026 ΘΕΜΑ 9 | 10 | (1) Time-domain AM waveform: [1+2sin(2πt)]cos(1000πt), showing phase reversals (μ=2>1 overmod); (2) Amplitude spectrum: impulses at ±499, ±500, ±501 Hz | TEXT-ONLY | `AMSignalViz` (waveform) + `AMSpectrumViz` (spectrum) | Both exist in `components/viz/`; `AMSpectrumViz` is single-tone with μ slider; `OvermodulationPhaseReversalViz` also exists and may be better for the time-domain part | No new T2 needed | **(A)-only**: T1 wires existing vizzes + full solution rework |
| 8 | `sept25-th1-5` | Sept 2025 Θ1.5 | 10 | Two-tone AM amplitude spectrum: carrier at ±100kHz + sidebands at ±(100±1)kHz + ±(100±2)kHz with amplitudes from m(t)=cos(2π·1kHz·t)+0.5cos(2π·2kHz·t) | TEXT-ONLY | `AMSpectrumViz` (two-tone extension) | Existing `AMSpectrumViz` is SINGLE-tone only (one fm slider); two-tone requires a new parameter or a different viz; `SpectrumViewer` (theory-page impulse-line viz) is closest | **NEW T2 extension** — add two-tone mode to AMSpectrumViz, OR build SpectrumLineViz (see Foundations cluster) | **SPLIT (A)+(B)**: (B) extend AMSpectrumViz or build SpectrumLineViz; (A) T1 rework |
| 9 | `proodos26-11` | Apr 2026 ΘΕΜΑ 11 | 9 | USSB spectra: (a) rect [f₁, f₁+W/2] for sinc(Wt); (b) triangle peak at f₂ for sinc²(Wt); both + mirrors at −f₁, −f₂ | **STATIC SVG** (not interactive) | `FdmCanonicalProblemViz` or `SSBSpectrumViz` | Static SVG at L994–1025 shows correct shapes; replace with interactive component; `SSBSpectrumViz` exists | No new T2 needed | **(A)-only**: T1 replaces static SVG with interactive viz + full rework |
| 10 | `pa25-th2-5` | Proodos A 2025 Θ2.5 | 8 | (1) Baseband amplitude spectrum of Σn·cos(2πnt), n=1..8: 8 impulse pairs at ±n Hz, heights n/2; (2) AM spectrum: carrier ± all 8 sideband pairs (17 impulse pairs total) | TEXT-ONLY | `SpectrumLineViz` (new) or `SpectrumViewer` with custom presets | `SpectrumViewer` supports presets with |aₖ| bars; custom configurable harmonic set (k=1..8, Aₖ=k/2) plus AM shift is possible with extension; same viz serves `pb25-th2-5` (sibling) | **NEW T2 primitive** `SpectrumLineViz` (configurable harmonic set with amplitude/phase sliders) if SpectrumViewer preset system isn't flexible enough | **SPLIT (A)+(B)**: (B) extend SpectrumViewer or build SpectrumLineViz; (A) T1 wires it for both pa25-th2-5 + pb25-th2-5 |
| 11 | `pb25-th2-5` | Proodos B 2025 Θ2.5 | 8 | (1) Baseband amplitude spectrum of Σ(10-n)·cos(2πnt), n=1..6: 6 impulse pairs at ±n Hz, heights (10-n)/2; (2) AM spectrum: carrier ± 6 sideband pairs | TEXT-ONLY | Same as pa25-th2-5 | Sibling of pa25-th2-5 (same exam structure, different coefficients); wire same viz with different parameters | Reuse T2 build from #10 | **(A)-only once #10 T2 is done**: T1 wires with pb25-th2-5 parameters |
| 12 | `jan26-th2-8` | Jan 2026 Θ2.8 | 8 | DSB-SC amplitude spectrum: sinc(2Wt)→rect(f/2W) (width W, height 1) shifts to ±fc, NO carrier impulse | TEXT-ONLY | `DsbScSpectrumViz` | **Exists** at `components/viz/DsbScSpectrumViz.tsx`; currently wired only in theory pages | No new T2 needed | **(A)-only**: T1 wires existing viz + full solution rework |
| 13 | `proodos26-13` | Apr 2026 ΘΕΜΑ 13 | 8 | Combined G(f) = X_USSB,m + X_USSB,k: rect block at [f₁, f₁+W/2] + triangle at [f₂, f₂+W] (θετικές f), mirrors at negative side | **STATIC SVG** (L1172–1197, not interactive) | `FdmCanonicalProblemViz` | Same component as proodos26-11; replace static SVG with interactive | No new T2 needed | **(A)-only**: T1 replaces static SVG + full rework |
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
| T1: DSB-SC spectrum rework | wire `DsbScSpectrumViz` + rework | `jan26-th2-8` | No |
| T1: LSSB spectrum rework | wire `SSBSpectrumViz` / `UssbVsLssbComparison` + rework | `pb25-th2-3` | No |
| T1: USSB FDM static-SVG → interactive batch | wire `FdmCanonicalProblemViz` + rework | `proodos26-11`, `proodos26-13` (same step) | No |
| T1: USSB FDM text-only batch | wire `FdmCanonicalProblemViz` + rework | `jan26-th3-mux` | No |
| T1: USSB FDM text-only batch | wire `FdmCanonicalProblemViz` + rework | `pa25-th3-mux` | No |
| T1: DSB-SC FDM rework | wire FDM viz + rework | `pb25-th3-mux` | No (if FDM viz extended) |
| T1: mixed FDM rework | wire FDM viz + rework | `jun25-th2` | No (if FDM viz extended) |
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
