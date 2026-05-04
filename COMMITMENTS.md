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

- [ ] **Full Lab 1 page (MATLAB installation + first steps)**
       Where it appears: `/intro` page, in the LabBox before the Recap
       Where it should be fulfilled: `/labs/01-matlab-intro` (path TBD)
       Source material: `Εγκατάσταση_του_Matlab.pdf` + `Εργαστήριο_1intro_matlab.pdf`
       Notes: The intro page promises "Πλήρης οδηγός εγκατάστασης και της Lab 1 θα έρθει σε ξεχωριστή σελίδα". Until this page exists, the LabBox link in the intro should either go nowhere clean or to a clearly-marked "🚧 Σύντομα" placeholder.

- [ ] **Full treatment of modulation (AM, FM)**
       Where it appears: `/intro`, section 7
       Where it should be fulfilled: `/modulation/am` and `/modulation/fm`
       Notes: The intro gives a teaser definition of modulation and lists 6 reasons. The full chapters must build on this without re-defining from scratch (instead: "θυμάσαι από την εισαγωγή τι είναι modulation; Τώρα θα δούμε αναλυτικά πώς γίνεται.")

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

- [ ] **Ideal filters and the non-causality trade-off**
       Where it appears: `/foundations/systems` Section 7 (the H(f₀) = 0 case mentioning "ένα φίλτρο όταν «κόβει» μια ζώνη")
       Where it should be fulfilled: `/foundations/bandpass-filters`
       Notes: Once filters are introduced, the chapter must address why "ideal" filters (sharp cutoff in the frequency domain) are physically unrealizable for real-time processing — they require a non-causal h(t). Connect to the sinc impulse response that came up in /foundations/signals.

- [ ] **Random-process PSD and the generalized Wiener–Khinchin theorem**
       Where it appears: `/foundations/fourier-transform` Section 9 (Parseval / ESD) and Section 10 (autocorrelation ↔ |X(f)|² for deterministic signals)
       Where it should be fulfilled: `/randomness/psd` (and earlier parts of the random-processes chapter)
       Notes: The FT chapter only treats deterministic-energy signals: $R_x(\tau) \leftrightarrow |X(f)|^2$. For random / power signals (noise, modulated signals once the message is treated as random), `X(f)` is not well-defined per realization. The random-process chapter must define PSD via expected autocorrelation and derive the random-signal version of Wiener–Khinchin, then connect back to the deterministic version proved here.

- [ ] **AM modulation built on the modulation theorem**
       Where it appears: `/foundations/fourier-transform` Section 7 (modulation theorem promises that "this is exactly the math of AM" and forward-links to /am)
       Where it should be fulfilled: `/am/conventional`, `/am/dsb-sc`, `/am/ssb`, `/am/demodulation`
       Notes: The AM chapters must open by reusing the modulation theorem from the FT page rather than re-deriving it. They should explicitly back-reference: «θυμάσαι από τον FT chapter ότι πολλαπλασιασμός με cos(2π f_c t) μετατοπίζει το φάσμα στις ±f_c; Όλη η AM είναι αυτό, εφαρμοσμένο σε baseband σήματα φωνής/μουσικής, με variations στο πώς διαχειριζόμαστε τις δύο πλευρικές ζώνες και το carrier.» Also: the symmetric ±f_c copies are the reason AM bandwidth is twice the baseband bandwidth.

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

---

## How to use this file

When generating a new plan in the planning chat:

1. **Read this file first.** Check if the new section you're planning fulfills any open commitments.
2. **Reference back explicitly.** If the new section closes an old commitment, the plan should call this out: *"this section fulfills the commitment from /intro that promised X."*
3. **Add new commitments as they appear.** If the new section makes any "we'll see this later" type promises, add them here before declaring the plan done.
4. **Move fulfilled commitments to the lower section.** Don't delete them — keep them as a record.
