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

- [ ] **Explanation of why a pure cosine produces a single spike in the frequency domain**
       Where it appears: `/intro`, section 6 (TimeFrequencyTeaser teaser)
       Where it should be fulfilled: Foundations / Fourier section
       Notes: The intro plants the seed: "παρατήρησε ότι ένα καθαρό cosine βγάζει ένα 'καρφί' στη συχνότητα. Θα δούμε γιατί στο επόμενο κεφάλαιο." The Fourier chapter must explicitly close the loop and reference back ("θυμάσαι από την εισαγωγή το καρφί στη συχνότητα; Να γιατί.")

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

- [ ] **H(f) is the Fourier transform of h(t) — proven and contextualized**
       Where it appears: `/foundations/systems` section 7 (eigenfunction property derivation introduces H(f₀) but doesn't connect it formally to Fourier)
       Where it should be fulfilled: `/foundations/fourier-transform`
       Notes: Systems chapter ends with two "spoiler" callouts pointing here. The Fourier-transform chapter must explicitly close the loop: "η H(f₀) που είδες στα Συστήματα είναι ο Fourier transform της h(t) — να γιατί κάθε σήμα μπορεί να αναλυθεί σε complex exponentials."

- [ ] **Convolution in time = multiplication in frequency**
       Where it appears: `/foundations/systems` section 6 (teaser callout) and the eigenfunction section
       Where it should be fulfilled: `/foundations/fourier-transform`
       Notes: Systems chapter teases this without proof. Fourier-transform chapter must derive it cleanly and use it in at least one worked example to drive home why frequency-domain analysis is so much easier.

- [ ] **Conjugate symmetry of H(f) for real h(t) — and the related FT symmetry siblings**
       Where it appears: `/foundations/systems` Section 7 collapsible derivation (Βήμα 4) — `H(-f) = H*(f)` is *used* without proof.
       Where it should be fulfilled: `/foundations/fourier-transform`
       Notes: Frame as a **general property of the Fourier transform**, not a one-off about LTI systems. Cover the full family of symmetry pairings:
         - real $h(t)$ ↔ conjugate-symmetric $H(f)$ (the case used in the systems chapter)
         - real-and-even $h(t)$ ↔ real-and-even $H(f)$
         - real-and-odd $h(t)$ ↔ imaginary-and-odd $H(f)$
         - imaginary $h(t)$ ↔ conjugate-antisymmetric $H(f)$
       Reader should leave knowing that *every time* they see a real-valued time signal, they get conjugate symmetry in frequency for free (and why). When closing the loop, back-reference: «θυμάσαι από τα Συστήματα που χρησιμοποιήσαμε $H(-f) = H^*(f)$ ως δεδομένο; Να γιατί.»

- [ ] **Reference pages for trig identities, Fourier pairs, and integrals**
       Where it appears: implied across the site every time a topic page would otherwise inline general math
       Where it should be fulfilled: `/reference/trig-identities`, `/reference/fourier-pairs`, `/reference/integrals`
       Notes: We started the pattern with `/foundations/signal-transformations` and `/reference/complex-numbers` — general math = reference page, topic-specific application = topic page. As later chapters need product-to-sum trig identities (modulation chapters lean on these constantly), the canonical Fourier pairs from the typology, or the integrals from the typology, build the corresponding reference page and link instead of inlining.

- [ ] **Ideal filters and the non-causality trade-off**
       Where it appears: `/foundations/systems` Section 7 (the H(f₀) = 0 case mentioning "ένα φίλτρο όταν «κόβει» μια ζώνη")
       Where it should be fulfilled: `/foundations/bandpass-filters`
       Notes: Once filters are introduced, the chapter must address why "ideal" filters (sharp cutoff in the frequency domain) are physically unrealizable for real-time processing — they require a non-causal h(t). Connect to the sinc impulse response that came up in /foundations/signals.

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

---

## How to use this file

When generating a new plan in the planning chat:

1. **Read this file first.** Check if the new section you're planning fulfills any open commitments.
2. **Reference back explicitly.** If the new section closes an old commitment, the plan should call this out: *"this section fulfills the commitment from /intro that promised X."*
3. **Add new commitments as they appear.** If the new section makes any "we'll see this later" type promises, add them here before declaring the plan done.
4. **Move fulfilled commitments to the lower section.** Don't delete them — keep them as a record.
