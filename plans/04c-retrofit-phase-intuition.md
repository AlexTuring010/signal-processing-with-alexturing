# Retrofit — Phase Intuition

**This is a retrofit, not a new section plan.** It fixes a foundation gap: the concept of *phase* (φάση, ∠H(f₀)) is used throughout the foundations and beyond, but never properly built. The signals page mentions it once in a parenthetical (*"φάση (από πού ξεκινά)"*) and then `/foundations/systems` Section 7 leans on phase heavily as if it's a known concept. It is not.

This retrofit does **three** things:

1. **Expands the existing 4a "Cosine" section** in `/foundations/signals` to make phase visible as one of the three knobs.
2. **Adds a new dedicated subsection 4a.5 "Φάση — τι σημαίνει στ' αλήθεια"** that builds the intuition properly.
3. **Adds a brief recap callout to `/foundations/systems` Section 7** before phase shows up as ∠H(f₀), with a deep link back.

Plus a flagship viz: a two-cosines comparator with phase sliders and a time-delay readout, making the phase ↔ time-shift equivalence concrete.

---

## Part 1: Expand `/foundations/signals` Section 4a (Cosines)

### What changes

The current Section 4a treats $A$, $f$, $\phi$ as a quick list. For amplitude and frequency this is fine — students already have intuition for them. For phase, this is wholly insufficient. We expand the section so phase becomes a properly *introduced* knob, not a footnote.

### New content for 4a

Keep the existing structure (general form, period, ω = 2πf explanation), but:

- After introducing the three parameters, **add one sentence** that flags phase will get its own subsection: *"Από τα τρία, η φάση είναι αυτή που μπερδεύει τους πιο πολλούς. Της δίνουμε τη δική της παράγραφο αμέσως μετά."*
- The existing `<CosineExplorer />` viz now should expose all three sliders distinctly. When the phase slider moves, **add a "ισοδύναμη χρονική ολίσθηση" readout** — a small text label showing `Δt = -φ/(2πf) = X.XX s`. This previews the phase-as-time-shift idea before it's even formally introduced.

That's the only change to 4a itself. The real work is the new 4a.5.

---

## Part 2: New subsection 4a.5 "Φάση — τι σημαίνει στ' αλήθεια"

### Where it goes

Immediately after 4a (Cosines) and before 4b (Complex exponentials).

Sub-structure:

```
4a.5 Φάση — τι σημαίνει στ' αλήθεια
   4a.5.1 Δύο cosines, ίδια συχνότητα, αλλά «κάτι» διαφορετικό
   4a.5.2 Phase ↔ time shift — η μετατροπή
   4a.5.3 Σύνδεση με το rotating phasor
   4a.5.4 Μονάδες — radians vs degrees
   4a.5.5 Γιατί μας ενδιαφέρει στις τηλεπικοινωνίες
```

### Content

#### 4a.5.1 Δύο cosines, ίδια συχνότητα, αλλά «κάτι» διαφορετικό

**(a) Content:**

Hook the student with a visual contradiction:

*"Σχεδίασε δύο cosines στον ίδιο άξονα: και τα δύο έχουν πλάτος 1 και συχνότητα 1 Hz. Όμως φαίνονται διαφορετικά. Το ένα έχει peak στο t = 0. Το άλλο έχει peak στο t = 0.25 s. Δεν διαφέρουν σε πλάτος, ούτε σε συχνότητα. Διαφέρουν σε **πότε ξεκινούν τον κύκλο τους**. Αυτό είναι η φάση."*

Then the formal statement:

- Στη γενική μορφή $x(t) = A\cos(2\pi f t + \phi)$, ο όρος $\phi$ μετράει σε **rad** και λέει «πόσο είναι ολισθημένος ο κύκλος ως προς ένα cosine που ξεκινά από το peak στο $t = 0$».
- $\phi = 0$: το cosine έχει peak ακριβώς στο $t = 0$. Είναι το «κανονικό» cosine.
- $\phi = \pi/2$: το cosine έχει ξεκινήσει «νωρίτερα» κατά ένα τέταρτο της περιόδου. Στο $t = 0$ βρίσκεται όπου ένα κανονικό cosine θα ήταν στο $t = T/4$ (δηλαδή στο 0). Άρα είναι ένα **sine** (`-sin`, αν θες να το πάρεις από την Euler — but for now just observe that visually).
- $\phi = \pi$: το cosine είναι «αντεστραμμένο» — peak γίνεται κοιλιά.

#### 4a.5.2 Phase ↔ time shift — η μετατροπή

**(a) Content:**

This is **the** mental model worth committing to memory. Phase and time shift are two ways to describe the **same thing**.

Πάμε αλγεβρικά. Από τους μετασχηματισμούς σήματος (4.5b), ξέρουμε ότι το $\cos(2\pi f (t - t_0))$ είναι το cosine ολισθημένο δεξιά κατά $t_0$. Ξεδιπλώνοντας:
$$\cos(2\pi f (t - t_0)) = \cos(2\pi f t - 2\pi f t_0)$$

Συγκρίνοντας με τη γενική μορφή $\cos(2\pi f t + \phi)$, βλέπουμε ότι:
$$\phi = -2\pi f t_0 \quad \Longleftrightarrow \quad t_0 = -\frac{\phi}{2\pi f}$$

**Plain Greek:**
- Θετική φάση $\phi > 0$ → αρνητικό $t_0$ → ολίσθηση **αριστερά** → το cosine ξεκίνησε «νωρίτερα», οπότε φαίνεται «μπροστά»
- Αρνητική φάση $\phi < 0$ → θετικό $t_0$ → ολίσθηση **δεξιά** → το cosine ξεκίνησε «αργότερα», φαίνεται «πίσω»

**Sanity check το $\phi = \pi/2$ από την προηγούμενη παράγραφο:**
- $f = 1$ Hz, $\phi = \pi/2$
- $t_0 = -\pi/2 \big/ (2\pi \cdot 1) = -1/4$ s
- Δηλαδή το cosine είναι ολισθημένο κατά $-1/4$ s — **αριστερά κατά ένα τέταρτο της περιόδου** — ακριβώς αυτό που είπαμε ότι κάνει το $\phi = \pi/2$.

`<Callout type="key">`: *"Mental model: η φάση είναι «η ίδια ολίσθηση στον χρόνο, μετρημένη σε rad αντί για s». Σε μια συγκεκριμένη συχνότητα f, οι δύο μονάδες μεταφράζονται με $t_0 = -\phi/(2\pi f)$. Σε διαφορετικές συχνότητες, το ίδιο φ αντιστοιχεί σε διαφορετική ολίσθηση χρόνου — γι' αυτό η φάση είναι **εξαρτώμενη από τη συχνότητα**."*

This is the most important sentence for understanding why phase distortion matters in real systems — different frequencies see different time delays.

#### 4a.5.3 Σύνδεση με το rotating phasor

**(a) Content:**

Back-reference: in section 4b we'll meet rotating phasors. Here we plant the seed:

*"Αν θυμάσαι από αργότερα στη σελίδα τη φωτογραφία του rotating phasor (ένα διάνυσμα που στρίβει στο μιγαδικό επίπεδο), η φάση είναι **η αρχική γωνία** του φάσοντα στο $t = 0$. Για $\phi = 0$ ξεκινά να δείχνει «δεξιά» (πραγματικό άξονα). Για $\phi = \pi/2$ ξεκινά να δείχνει «πάνω». Καθώς ο χρόνος προχωράει, το διάνυσμα στρίβει με γωνιακή ταχύτητα $2\pi f$. Η συχνότητα ελέγχει το πόσο γρήγορα στρίβει· η φάση ελέγχει το από πού ξεκίνησε."*

(Forward link to 4b RotatingPhasor viz when it's introduced; or back-link from 4b back to here.)

#### 4a.5.4 Μονάδες — radians vs degrees

**(a) Content:**

- Σε όλο το μάθημα και σε όλους τους τύπους, η φάση είναι σε **rad** (radians).
- Μερικά διαγράμματα και πίνακες την δείχνουν σε **degrees** (μοίρες) γιατί διαβάζονται πιο φυσικά. Μετατροπή: $180° = \pi$ rad.
- Στους τύπους μη βάλεις ποτέ μοίρες ωμές — ο `cos()` και `sin()` περιμένουν rad.

Παράδειγμα: $\phi = 60°$ = $\pi/3$ rad.

#### 4a.5.5 Γιατί μας ενδιαφέρει στις τηλεπικοινωνίες

**(a) Content:**

Brief teaser to motivate continued attention:

- Όταν ένα σήμα περνάει από ένα LTI σύστημα (π.χ. ένα channel ή ένα filter), εκτός από το πλάτος, αλλάζει και η φάση. Συγκεκριμένα, διαφορετικές συχνότητες αποκτούν διαφορετικές φάσεις στην έξοδο. Αν αυτό γίνει ομοιόμορφα (linear phase με τη συχνότητα), δεν αλλάζει τη μορφή του σήματος — απλώς τη μετατοπίζει στο χρόνο. Αν γίνει ανομοιόμορφα, παραμορφώνεται το σήμα. Αυτό λέγεται **phase distortion** και είναι σοβαρό θέμα στην ποιότητα ήχου, στο σήμα video, και στις ψηφιακές επικοινωνίες.
- Στο επόμενο κεφάλαιο για συστήματα θα δούμε πώς ένα LTI σύστημα δίνει σε κάθε συχνότητα ένα δικό του $|H(f)|$ (κέρδος) και ένα δικό του $\angle H(f)$ (φάση).

Forward link to `/foundations/systems` Section 7.

### Flagship viz for this subsection

`<PhaseTimeShiftDemo />` — the centerpiece for building phase intuition.

**Specs:**

- Two cosines on the same plot (e.g. blue and orange), labeled "cosine 1" and "cosine 2"
- Both have fixed amplitude = 1 and shared frequency $f$ (slider for $f$, default 1 Hz)
- Each has its own phase slider $\phi_1$, $\phi_2$ — display in **both rad and degrees** simultaneously (e.g. "φ₁ = 1.57 rad ≈ 90°")
- A live readout panel showing:
  - $\phi_1 - \phi_2$ (phase difference, in rad)
  - $\Delta t = -(\phi_1 - \phi_2) / (2\pi f)$ (equivalent time shift, in seconds)
- Arrows on the plot annotating "this peak shifted by Δt seconds" — connecting the algebraic formula to the visual reality
- Preset buttons:
  - "Ίδια φάση" (φ₁ = φ₂ = 0)
  - "Quadrature" (φ₁ = 0, φ₂ = π/2 — shows cos and -sin)
  - "Αντίθετη φάση" (φ₁ = 0, φ₂ = π — shows cos and -cos)
  - "Custom" (default — let the user explore)
- Bonus: a small subplot or inset showing the two corresponding rotating phasors at $t = 0$ — connects to 4a.5.3

Mobile: stack vertically. Sliders should be touch-friendly with large hit targets.

---

## Part 3: Recap callout in `/foundations/systems` Section 7

### Where it goes

In Section 7c (where we extend the eigenfunction property from complex exponentials to real cosines), **before** introducing the formula $y(t) = |H(f_0)|\cos(2\pi f_0 t + \angle H(f_0))$.

### Content for the callout

```
<Callout type="recap">
**Quick recap από [Φάση](/foundations/signals#4a.5):** Όταν λέμε ότι ένα cosine έχει φάση φ, εννοούμε ότι αναπαρίσταται σαν $\cos(2\pi f t + \phi)$ — δηλαδή έχει ολισθηθεί στο χρόνο κατά $t_0 = -\phi/(2\pi f)$ σε σχέση με ένα κανονικό cosine. Στην παρακάτω παράγραφο, το $\angle H(f_0)$ θα είναι ακριβώς αυτό: η φάση που το σύστημα προσθέτει στο cosine συχνότητας $f_0$.

Αν δε σου είναι ακόμα ξεκάθαρη η σχέση φάσης ↔ χρονικής ολίσθησης, ρίξε μια ματιά στο [`<PhaseTimeShiftDemo />`](/foundations/signals#4a.5) πριν προχωρήσεις.
</Callout>
```

That's it for systems — no other change needed. The callout makes the section self-sufficient and provides a clear deep link.

---

## Updates to other parts of the site

These are small touch-ups that capitalize on the new content:

### `/foundations/signals` Section 5b (Άρτια / Περιττά)

When discussing why $\cos(-t) = \cos(t)$, can now add a small back-reference: *"αυτό μπορεί να ειδωθεί ως φ = 0 παραμένει φ = 0 κάτω από flip — η φάση δεν αλλάζει για ένα cosine, αυτό το κάνει άρτιο."* (Optional. Don't force it if it doesn't fit cleanly.)

### Frontmatter updates

For `/foundations/signals`:

- `estimatedReadTime`: bump by ~6 minutes (adding the new subsection + reading the recap)
- The page TOC must reflect the new 4a.5 subsection

---

## Acceptance criteria

When this retrofit is done:

1. ✅ `/foundations/signals` Section 4a explicitly flags that phase deserves its own treatment
2. ✅ `<CosineExplorer />` viz includes a "Δt = -φ/(2πf)" live readout
3. ✅ New subsection 4a.5 covers all 5 sub-parts (visual contrast, phase↔time-shift, phasor connection, units, why-we-care)
4. ✅ `<PhaseTimeShiftDemo />` viz is functional with all preset buttons and the rad/deg dual readout
5. ✅ `/foundations/systems` Section 7c has the prerequisite recap callout with deep link
6. ✅ Sidebar TOC for the signals page reflects the new 4a.5 subsection
7. ✅ User reviews with the stupid student filter — the question "what does φ mean and how is it different from a time delay?" has a clean visual + verbal answer findable in under 30 seconds
8. ✅ The phrase "phase-as-frequency-dependent-time-shift" lands in the student's mind — they should understand why uniform phase = pure delay vs. non-uniform phase = distortion

---

## Updates to COMMITMENTS.md

No new open commitments. This retrofit *closes a hidden gap* (the implicit promise that phase would be properly explained somewhere — never delivered).

---

## Note for Claude Code

This retrofit fixes another reader-confusion that came up during the "stupid student" review of `/foundations/systems`. Quote: *"me as a student wouldnt truly have very clear in my mind the whole phase thing"*.

This is load-bearing for **everything** that comes later: AM modulation uses phase explicitly (φ in carrier), FM is *all about* phase (FM literally encodes information in instantaneous phase), demodulation requires understanding what phase means, and exam questions on signal power and bandpass signals routinely include phase terms.

Don't treat as polish. Build the viz with care.
