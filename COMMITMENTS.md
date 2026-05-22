# Commitments — promises the site has made to readers

This file tracks every "we'll come back to this", "in a later section we'll see why", or "full guide is in another page" promise that exists in the deployed content. **Each commitment must be fulfilled before the site is considered complete.**

When you're writing a new plan, check this file. If you're about to build a section that fulfills one of these commitments, satisfy it explicitly and remove the entry from this list.

When you're reviewing a section and notice a new "we'll come back to this" sentence, add it here.

Format:
```
- [ ] <commitment>
       Where it appears: <page/section>
       Where it should be fulfilled: <target page/section>
       Notes: <anything special>
```

---

## Open commitments

- [ ] **Link the L07 «Ραντάρ εξετάσεων» items to real past-exam problems**
       Where it appears: `/lectures/L07-graphs-ii` — the `ExamRadar` block near the end of the page
       Where it should be fulfilled: the same `ExamRadar` block + the `<LectureExercises>` block at the page end
       Notes: The L07 ExamRadar currently lists exam patterns in the abstract («τρέξε BFS/DFS και δώσε τη σειρά», «απόσταση με BFS», «μοντελοποίηση ως διάσχιση»…). When graph-traversal past-exam problems are transcribed into the exercise bank (`content/practice/exercises.tsx` — see `plans/EXAM_TRANSCRIPTION.md`), come back here and, per radar pattern, link the specific problems that match it, so students can jump straight from a pattern to real exercises. Also make sure those problems surface at the end of the page: `<LectureExercises lectureSlug="lectures/L07-graphs-ii" />` already auto-pulls exercises whose prerequisites point at L07, so the work is (a) tag the new problems correctly and (b) add per-item problem links to the radar — likely a small extension of the `ExamRadar` component (an optional problem id/href per item).

- [ ] **Full Lab 1 page (MATLAB installation + first steps)**
       Where it appears: `/intro` page, in the LabBox before the Recap
       Where it should be fulfilled: `/labs/01-matlab-intro` (path TBD)
       Source material: `Εγκατάσταση_του_Matlab.pdf` + `Εργαστήριο_1intro_matlab.pdf`
       Notes: The intro page promises "Πλήρης οδηγός εγκατάστασης και της Lab 1 θα έρθει σε ξεχωριστή σελίδα". Until this page exists, the LabBox link in the intro should either go nowhere clean or to a clearly-marked "🚧 Σύντομα" placeholder.


- [ ] **Full treatment of the sampling theorem**
       Where it appears: `/intro`, roadmap section
       Where it should be fulfilled: `/sampling-adc`
       Notes: Standard reference. No specific anchor in intro yet, just the roadmap mention.

- [ ] **Full Lab 2 page (continuous & discrete signals in MATLAB)**
       Where it appears: `/foundations/signals` LabBox in section 7
       Where it should be fulfilled: `/labs/02-signals`
       Source material: `Εργαστήριο_2Συνεχή_και_διακριτά_σήματα.pdf`
       Notes: The signals page promises a full lab page with `trapz` integration, even/odd in code, periodicity checks, etc. Until that page is fleshed out, the placeholder at `/labs/02-signals` is fine but should be replaced.

- [ ] **Full Lab 3 page (linearity / TI / convolution in MATLAB)**
       Where it appears: `/foundations/systems` LabBox in section 8
       Where it should be fulfilled: `/labs/03-systems`
       Source material: `Εργαστήριο_3Γραμμικά_συστήματα_συνεχούς_χρόνου.pdf`
       Notes: Page currently a 🚧 placeholder. Must add: numeric linearity / TI checks for several systems, `conv` usage in MATLAB and comparison to analytical solutions, cascade/parallel composition.

- [ ] **Reference pages for trig identities, Fourier pairs, and integrals**
       Where it appears: implied across the site every time a topic page would otherwise inline general math
       Where it should be fulfilled: `/reference/trig-identities`, `/reference/fourier-pairs`, `/reference/integrals`
       Notes: We started the pattern with `/foundations/signal-transformations` and `/reference/complex-numbers` — general math = reference page, topic-specific application = topic page. As later chapters need product-to-sum trig identities (modulation chapters lean on these constantly), the canonical Fourier pairs from the typology, or the integrals from the typology, build the corresponding reference page and link instead of inlining.



---

## Fulfilled commitments

(Move entries here when satisfied. Keep them for traceability.)

- [x] **Convolution definition and the connection to δ(t)**
       Originally appeared: `/foundations/signals` section 4g
       Fulfilled in: `/foundations/systems` sections 3b and 4
       Notes: Section 3b derives convolution as the consequence of (1) δ-sifting, (2) time-invariance, (3) linearity — explicitly framed as "η συνέλιξη δεν είναι μαγική — αυτό προκύπτει από τις τρεις ιδιότητες που ήδη ξέραμε." The page uses the back-reference "θυμάσαι από το προηγούμενο κεφάλαιο που είπαμε η δ(t) είναι το «test signal»; Να γιατί."

- [x] **Why complex exponentials are LTI eigenfunctions**
       Originally appeared: `/foundations/signals` section 4b (RotatingPhasor + the LTI claim)
       Fulfilled in: `/foundations/systems` section 7
       Notes: Section 7 walks through the algebra step by step — pulling the constant out of the convolution integral, defining H(f₀), arriving at y(t) = H(f₀) · x(t). The EigenfunctionDemo viz then makes it interactive: same frequency in/out, only amplitude and phase change as the user sweeps f₀. The full Fourier interpretation of H(f₀) is deferred to /foundations/fourier-transform (now tracked as a separate open commitment).

- [x] **Why a pure cosine produces a single spike in the frequency domain**
       Originally appeared: `/intro` section 6 (TimeFrequencyTeaser)
       Fulfilled in: `/foundations/fourier-series` section "Φάσμα πλάτους"; *re-confirmed and generalized* in `/foundations/fourier-transform` Section 4e
       Notes: Closed with an explicit recap callout — "θυμάσαι από την εισαγωγή το «καρφί» στη συχνότητα; **Να γιατί.**" — explaining that a pure cosine is the simplest possible Fourier series with only two non-zero coefficients (a_1 = a_{-1} = 1/2), so its spectrum is exactly two lollipops at ±f_0. The SpectrumViewer viz lets the reader see this directly with the "Καθαρό cosine" preset. The FT chapter then re-closes the same promise as the *general* FT identity $\cos(2\pi f_0 t) \leftrightarrow \tfrac{1}{2}\delta(f-f_0) + \tfrac{1}{2}\delta(f+f_0)$ — same answer, valid for any signal in any context, not just for periodic series.

- [x] **H(f) is the Fourier transform of h(t) — proven and contextualized** (closed 2026-05-05)
       Originally appeared:
         - `/foundations/systems` section 7 (eigenfunction property derivation introduces H(f₀) but doesn't connect it formally to Fourier).
         - `/foundations/fourier-series` synthesis/analysis section — callout flagging the structural similarity between a_k and H(f₀).
       Fulfilled in: `/foundations/fourier-transform` Sections 5b and 11
       Notes: Section 5b derives convolution↔multiplication, then immediately observes that the integral defining H(f₀) in the systems chapter is letter-for-letter the FT integral, hence $H(f) = \mathcal{F}\{h(t)\}$. A 🎯 closes-commitment callout makes this visible. Section 11 then synthesizes everything (eigenfunction + FT + LTI) into one paragraph: "ο FT είναι το εργαλείο που κάνει τη θεωρία LTI εύκολη — η συνέλιξη γίνεται πολλαπλασιασμός, οι complex exponentials γίνονται απλά νούμερα H(f)."

- [x] **Convolution in time = multiplication in frequency** (closed 2026-05-05)
       Originally appeared: `/foundations/systems` section 6 (teaser callout) and the eigenfunction section
       Fulfilled in: `/foundations/fourier-transform` Section 5b
       Notes: Two-line proof inside a 🎯 closes-commitment callout (change of variable in the inner integral, swap order of integration). The `<ConvolutionInFrequency />` viz lets the reader pick `x(t)` and `h(t)` from a small preset and watch `Y(f) = X(f)·H(f)` form by simple pointwise multiplication — driving home that the flip-and-slide gymnastics of convolution disappears in the frequency domain.

- [x] **Conjugate symmetry of H(f) / a_k for real signals — and the related FT symmetry siblings** (closed 2026-05-05)
       Originally appeared:
         - `/foundations/systems` Section 7 collapsible derivation (Βήμα 4) — `H(-f) = H*(f)` is *used* without proof.
         - `/foundations/fourier-series` Section "Συμμετρίες ±f for real signals" — `a_{-k} = a_k^*` is stated without proof.
       Fulfilled in: `/foundations/fourier-transform` Section 8
       Notes: Section 8 proves $X(-f) = X^*(f)$ for real $x(t)$ in three lines using the FT definition + conjugate properties, then tabulates the full family (real-and-even ↔ real-and-even, real-and-odd ↔ imaginary-and-odd, imaginary ↔ conjugate-antisymmetric). Three 🎯 closes-commitment callouts back-reference the original promises: (i) the systems-chapter use of $H(-f) = H^*(f)$, (ii) the special real-and-even case the systems chapter handled via Euler split, (iii) the unified family across all symmetry types. Reader leaves with the takeaway: real-valued time signal ⇒ conjugate symmetry in frequency, for free.

- [x] **Limit-of-period argument formalized (Σειρά Fourier → μετασχηματισμός Fourier)** (closed 2026-05-05)
       Originally appeared: `/foundations/fourier-series`, Section "Η γέφυρα προς τον Fourier transform" + the `<PeriodToInfinity />` viz
       Fulfilled in: `/foundations/fourier-transform` Section 1
       Notes: Section 1 walks through the heuristic limit ($T_0 \to \infty$, fundamental $f_0 \to 0$, line spacing collapses, sum becomes integral) and shows the explicit replacement $\sum a_k e^{j k \omega_0 t} \to \int X(f) e^{j 2\pi f t}\,df$. A 🎯 closes-commitment callout makes the back-reference to the FS chapter promise. The `<PeriodToInfinity />` viz from the FS chapter is reused to anchor the visual intuition.

- [x] **Parseval for signals** (closed 2026-05-05)
       Originally appeared: `/foundations/fourier-series` (deferred until FT chapter, since the general statement uses the integral form)
       Fulfilled in: `/foundations/fourier-transform` Section 9
       Notes: Section 9 boxes the general Parseval $\int |x(t)|^2 dt = \int |X(f)|^2 df$, defines ESD as $|X(f)|^2$, and a 🎯 closes-commitment callout exhibits the periodic special case $\frac{1}{T_0}\int_{T_0}|x|^2 dt = \sum_k |a_k|^2$ as a corollary, unifying the FS energy formula with the general FT statement.

- [x] **Ideal filters and the non-causality trade-off** (closed 2026-05-05)
       Originally appeared: `/foundations/systems` Section 7 (the H(f₀) = 0 case mentioning "ένα φίλτρο όταν «κόβει» μια ζώνη")
       Fulfilled in: `/foundations/filters` Sections 1–3 (chapter renamed/split from former `/foundations/bandpass-filters` on 2026-05-05)
       Notes: Section 6 names the four ideal filter types (LP, HP, BP, BS) by their $|H(f)|$ shape, ties them to the even-h(t)/real-H(f) symmetry rule from FT §8 (so the "concrete example" promised by the systems chapter finally lands), and the `<FilterTypeViewer />` viz shows which tones survive each filter type. Section 7 introduces the real-filter spec ($\delta_p, \delta_s, f_p, f_s$) and the `<IdealVsRealFilterViz />` viz makes the non-causality concrete by drawing the ideal LP's sinc impulse response extending to ±∞ — a 🎯 closes-commitment callout makes the connection explicit. Trade-off (sharper cutoff = longer impulse response = more delay) named explicitly.

- [x] **Bandpass signals — canonical I/Q form unifying AM/DSB/SSB/FM/PM** (closed 2026-05-05)
       Originally appeared: implicit forward-promise from `/foundations/fourier-transform` Section 7 (modulation theorem) and the FT NextUp pointing at this chapter
       Fulfilled in: `/modulation/bridge` Sections 1, 4, 5 (chapter promoted to first chapter of modulation group on 2026-05-05; previously lived at `/foundations/bandpass-filters` §1, 4, 5)
       Notes: Section 1 names baseband vs bandpass and ties the modulation theorem to the bandpass class. Section 4 derives the complex envelope $g(t) = x_p(t)\,e^{-j 2\pi f_c t}$ and the canonical $x(t) = \mathrm{Re}\{g(t)\,e^{j 2\pi f_c t}\}$. Section 5 unfolds this into the I/Q form $x(t) = x_I\cos - x_Q\sin$ and lays out the five-modulation table (AM, DSB-SC, SSB, FM, PM) as different rows. The `<IQDecompositionViz />` flagship makes AM-vs-FM visceral by tracing $(x_I, x_Q)$ in the complex plane (line for AM, circle for FM). A 🎯 closes-commitment callout names this as the bridge to modulation.

- [x] **Random-process PSD and the generalized Wiener–Khinchin theorem** (closed 2026-05-05)
       Originally appeared: `/foundations/fourier-transform` Section 9 (Parseval / ESD) and Section 10 (autocorrelation ↔ |X(f)|² for deterministic signals)
       Fulfilled in: `/randomness/psd` (Sections 1–3) and the autocorrelation primer in `/randomness/random-processes`
       Notes: The PSD chapter explicitly opens with the FT §10 result (deterministic ESD), then explains why a random-process per-realization $X(f)$ isn't well-defined, motivating the move to PSD via the autocorrelation. Wiener-Khinchin is stated and used. A 🎯 closes-commitment callout in `/randomness/psd` Section 2 makes the back-reference. The output-of-LTI-filter result $S_Y(f) = |H(f)|^2 S_X(f)$ is given as the load-bearing tool for the upcoming Noise group.

- [x] **Full treatment of modulation (AM, FM)** (closed 2026-05-05)
       Originally appeared: `/intro`, section 7
       Fulfilled in: `/am/*` (7 chapters) and `/fm/*` (4 chapters)
       Notes: The AM group covers conventional/DSB-SC/SSB/VSB plus modulator/demodulator + AM-in-noise + multiplexing. The FM group covers the basic idea + β, Bessel sidebands, Carson's rule + NBFM/WBFM, and FM-in-noise + AM-vs-FM trade-offs. Each chapter back-references the intro and chains forward, so a reader who started from /intro reaches the FM chapters without ever needing to re-derive a fundamental.

- [x] **AM modulation built on the modulation theorem** (closed 2026-05-05)
       Originally appeared: `/foundations/fourier-transform` Section 7 (modulation theorem)
       Fulfilled in: `/am/overview`, `/am/conventional` Section 4 (spectrum), `/am/dsb-sc` Section 1 (derived from AM), `/am/ssb` Section 1
       Notes: AM chapters open with the modulation-theorem framing — multiplication by cos(2π f_c t) shifts the spectrum to ±f_c. Bandwidth = 2W is presented as a direct corollary of the symmetric ±f_c copies, not as an independent fact.

- [x] **AM modulation as the x_Q = 0 row of the canonical bandpass form** (closed 2026-05-05)
       Originally appeared: `/modulation/bridge` Section 5b (the I/Q canonical-form table)
       Fulfilled in: `/am/conventional` Section 1, `/am/dsb-sc` Section 1, `/am/ssb` Section 1
       Notes: Each AM-family chapter quotes its row of the §5b table. Conventional AM: $x_I = A_c[1 + \mu m(t)]$, $x_Q = 0$ → envelope detector. DSB-SC: $x_I = A_c m(t)$, $x_Q = 0$, no carrier. SSB: $x_I = m(t)$, $x_Q = \pm \hat m(t)$ — uses Hilbert. The structural decomposition makes the differences in bandwidth, demodulator complexity, and power efficiency fall out of the (x_I, x_Q) choice rather than appearing ad-hoc.

- [x] **FM modulation as constant-envelope $V = A_c$, message-encoded $\theta(t)$** (closed 2026-05-05)
       Originally appeared: `/modulation/bridge` Section 5b (the I/Q canonical-form table) and Section 5a (polar form)
       Fulfilled in: `/fm/idea` Section 4 ("Σύνδεση με την I/Q canonical form")
       Notes: §4 quotes the FM row of the §5b table — $V(t) = A_c$ constant, $\theta(t) = \beta\sin(2\pi f_m t)$ for single-tone — and points the reader to the FM preset of `<IQDecompositionViz />` showing the complex envelope tracing a circle. The constant-envelope property is then explicitly tied to noise resilience: any amplitude noise can be stripped by a limiter before demodulation, since the information lives entirely in the phase. That connection is reinforced in `/fm/in-noise` Section 1 (the "limiter" stage of the receiver block diagram).

- [x] **Quadrature receiver / IQ demodulator architecture** (closed 2026-05-05)
       Originally appeared: `/modulation/bridge` Section 5 (canonical form suggests $x_I$ and $x_Q$ can be extracted by mixing with $\cos$ and $-\sin$ + lowpass)
       Fulfilled in: `/am/dsb-sc` Section "Coherent demodulation" + `<CoherentDemodulationViz />`, `/am/modulator-demodulator` Section "Coherent receiver", `/fm/in-noise` Section 1 (FM discriminator analogue)
       Notes: The DSB-SC chapter draws the full coherent receiver chain: multiply by $2\cos(2\pi f_c t)$ → LPF → recover $m(t)$. The phase-error analysis shows what happens when the receiver oscillator drifts off the carrier (quadrature null at ±90°). The AM modulator/demodulator chapter uses the same architecture for AM coherent demodulation. The FM-in-noise chapter generalizes: instead of multiplying by $\cos$ alone, the FM discriminator extracts the instantaneous frequency, which is the derivative of the angle — analogous role.

- [x] **Hilbert transform — phase-shifter at every frequency** (closed 2026-05-05)
       Originally appeared: implicit forward-promise from FT chapter (mentioned as belonging to bandpass chapter in the FT plan)
       Fulfilled in: `/modulation/bridge` Section 2 (moved from `/foundations/bandpass-filters` §2 on 2026-05-05 when bandpass-filters split into `/foundations/filters` + `/modulation/bridge`)
       Notes: Defined first via its frequency-domain action ($-j\,\mathrm{sgn}(f)$ multiplier) and only secondarily via the time-domain $1/(\pi t)$ convolution. Worked example shows $\cos \to \sin$. Properties (double application = sign flip, orthogonality, distributivity over convolution) listed for reference. The `<HilbertTransformViz />` viz makes the spectrum-multiplier picture concrete with cos, sin, and two-cosine presets. A 🎯 closes-commitment callout flags the closure. Used immediately downstream in §3 (pre-envelope) and §5 (SSB row of the table).

---

## How to use this file

When generating a new plan in the planning chat:

1. **Read this file first.** Check if the new section you're planning fulfills any open commitments.
2. **Reference back explicitly.** If the new section closes an old commitment, the plan should call this out: *"this section fulfills the commitment from /intro that promised X."*
3. **Add new commitments as they appear.** If the new section makes any "we'll see this later" type promises, add them here before declaring the plan done.
4. **Move fulfilled commitments to the lower section.** Don't delete them — keep them as a record.
