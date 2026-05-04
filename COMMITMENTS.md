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

- [ ] **Convolution definition and the connection to δ(t)**
       Where it appears: `/foundations/signals` section 4g (the δ-sifting property motivates convolution as the natural operation)
       Where it should be fulfilled: `/foundations/systems`
       Notes: The signals page introduces δ(t) and its sifting property, then says "we'll use this when we hit convolution". Systems chapter must define convolution explicitly and reference back: "θυμάσαι το δ(t) που σάρωνε το x(t); Αυτό ακριβώς γενικεύεται σε convolution."

- [ ] **Why complex exponentials are LTI eigenfunctions**
       Where it appears: `/foundations/signals` section 4b (RotatingPhasor + the "LTI systems treat them as their natural language" claim)
       Where it should be fulfilled: First sketched in `/foundations/systems`, made fully clear in `/foundations/fourier-transform`
       Notes: The signals page promises this without proving it. Systems chapter should show H(f) emerges naturally when the input is e^(jωt); Fourier-transform chapter closes the loop with "this is why every signal is built out of complex exponentials".

---

## Fulfilled commitments

(Move entries here when satisfied. Keep them for traceability.)

*(empty)*

---

## How to use this file

When generating a new plan in the planning chat:

1. **Read this file first.** Check if the new section you're planning fulfills any open commitments.
2. **Reference back explicitly.** If the new section closes an old commitment, the plan should call this out: *"this section fulfills the commitment from /intro that promised X."*
3. **Add new commitments as they appear.** If the new section makes any "we'll see this later" type promises, add them here before declaring the plan done.
4. **Move fulfilled commitments to the lower section.** Don't delete them — keep them as a record.
