# Retrofit — Complex Numbers Reference Page

**This is a retrofit, not a new content section.** It does three things:

1. **Creates a new reference page** `/reference/complex-numbers` — full mini-tutorial on complex numbers, the math we keep needing throughout the course.
2. **Trims `/foundations/systems` Section 7 Βήμα 3** — replaces the inline conjugate refresher with a deep link, but keeps the systems-specific derivation (`H(-f) = H*(f)` for real h(t)) inline since that's topic-specific, not general math.
3. **Updates `/foundations/signals` Section 4b** ("Complex exponentials") — links to the reference for definitions/operations, keeps the signal-specific content (rotating phasor, why we use them in this course) inline.

This continues the architecture pattern established by `/foundations/signal-transformations`: **general math = reference pages, topic-specific application = topic pages**. Reference pages live under a "Reference" subgroup inside the "Foundations" sidebar group.

---

## Part 1: Create `/reference/complex-numbers`

### Page metadata

```yaml
title: "Μιγαδικοί αριθμοί — Reference"
slug: "reference/complex-numbers"
order: 98                      # appears low in sidebar; reference, not flow
prerequisites: []
examWeight: 0                  # not directly examined; supporting math
estimatedReadTime: 12
lastUpdated: "2026-05-XX"
```

### Page outline

```
1. Τι είναι ένας μιγαδικός αριθμός
2. Η μιγαδική επίπεδη — γεωμετρική ερμηνεία
3. Πολική μορφή
4. Η ταυτότητα του Euler
5. Συζυγής αριθμός
6. Πράξεις
   6a. Πρόσθεση και αφαίρεση
   6b. Πολλαπλασιασμός
   6c. Διαίρεση
   6d. Ύψωση σε δύναμη
7. Χρήσιμες ταυτότητες
8. Παραδείγματα και ασκήσεις
```

### Detailed content per section

#### 1. Τι είναι ένας μιγαδικός αριθμός

**(a) Content:**
- Ένας πραγματικός αριθμός είναι ένα σημείο πάνω στην ευθεία. Ένας μιγαδικός είναι ένα σημείο στο **επίπεδο**. Δύο πραγματικοί αριθμοί χρειάζονται για να τον περιγράψουν.
- Notation: $z = a + jb$ όπου $a$ είναι το real part (Re{z}) και $b$ το imaginary part (Im{z}). $j = \sqrt{-1}$ — η ίδια ιδέα με τον $i$ που μπορεί να ξέρεις από μαθηματικά, απλώς οι ηλεκτρολόγοι/τηλεπικοινωνιακοί χρησιμοποιούν $j$ γιατί το $i$ συμβολίζει ρεύμα. Σε αυτό το μάθημα γράφουμε πάντα $j$.
- Examples: $3 + 2j$, $-1 - j$, $5j$ (καθαρά imaginary), $7$ (καθαρά real, ένας πραγματικός είναι ειδική περίπτωση).

**(b) How:**
- Lead with the geometric framing: "ευθεία vs επίπεδο". Concrete and immediate.
- The $j$ vs $i$ notation note prevents a small confusion that bites students at random moments.

**(c) Components:**
- `<Callout type="note">` for the $j$ vs $i$ convention.

#### 2. Μιγαδική επίπεδη — γεωμετρική ερμηνεία

**(a) Content:**
- Σχεδιάζουμε τους μιγαδικούς σε ένα επίπεδο: οριζόντιος άξονας = real part, κάθετος άξονας = imaginary part.
- Παραδείγματα plotted: $1+0j$ (στα δεξιά), $0+1j$ (επάνω), $-1+0j$ (αριστερά), $0-j$ (κάτω), $1+j$ (επάνω-δεξιά).
- Ο μιγαδικός μπορεί να ιδωθεί και ως **διάνυσμα** από την αρχή των αξόνων στο σημείο $(a, b)$.

**(c) Components:**
- `<ComplexPlaneViz />` — interactive complex plane. User clicks/drags a point, viz shows the corresponding $z = a + jb$. Coordinates display live. Shows both Cartesian (a, b) and polar (|z|, ∠z) form.

#### 3. Πολική μορφή

**(a) Content:**
- Ένας μιγαδικός μπορεί να γραφεί και ως **μέτρο και γωνία** αντί για real/imaginary parts:
$$z = |z| \cdot e^{j\theta}$$
- $|z|$ = magnitude (μέτρο) = απόσταση του σημείου από την αρχή των αξόνων. Πάντα $\geq 0$.
- $\theta$ = angle / phase / argument (γωνία/φάση) = η γωνία που σχηματίζει το διάνυσμα $z$ με τον θετικό real άξονα. Σε rad. Symbol: $\angle z$ ή $\arg(z)$.
- Conversion από Cartesian σε polar:
  - $|z| = \sqrt{a^2 + b^2}$
  - $\angle z = \arctan(b/a)$ — αλλά **πρόσεξε το τεταρτημόριο** (δες παρακάτω)
- Conversion από polar σε Cartesian:
  - $a = |z|\cos\theta$
  - $b = |z|\sin\theta$
- **Quadrant gotcha:** το $\arctan(b/a)$ σου δίνει τιμή στο διάστημα $(-\pi/2, \pi/2)$, που είναι σωστό μόνο όταν το $z$ είναι στο πρώτο ή τέταρτο τεταρτημόριο. Για το δεύτερο και τρίτο, πρόσθεσε ή αφαίρεσε $\pi$. Στους περισσότερους υπολογιστές υπάρχει η συνάρτηση `atan2(b, a)` που τα κάνει σωστά αυτόματα.

**(b) How:**
- Build polar form *after* the visualization is established — students see the geometric meaning of magnitude and angle directly on the complex plane viz.
- The quadrant gotcha is a real exam pitfall — flag it explicitly.

**(c) Components:**
- The same `<ComplexPlaneViz />` from §2 — toggle to show "polar mode" with magnitude and angle annotations on the diagram.
- `<Callout type="warning">` for the quadrant gotcha.

#### 4. Η ταυτότητα του Euler

**(a) Content:**
- Η μαγική ταυτότητα:
$$e^{j\theta} = \cos\theta + j\sin\theta$$
- **Γεωμετρική σημασία:** το $e^{j\theta}$ είναι ένα σημείο πάνω στον **μοναδιαίο κύκλο** (κύκλος ακτίνας 1 γύρω από την αρχή των αξόνων), στη γωνία $\theta$. Δηλαδή: real part = $\cos\theta$, imaginary part = $\sin\theta$.
- Από αυτό προκύπτει ότι κάθε μιγαδικός αριθμός με μέτρο 1 γράφεται σαν $e^{j\theta}$.
- Και πιο γενικά, κάθε μιγαδικός γράφεται σαν $|z| \cdot e^{j\theta}$ — αυτή είναι η πολική μορφή.
- Παραδείγματα:
  - $e^{j0} = 1$
  - $e^{j\pi/2} = j$
  - $e^{j\pi} = -1$ (η διάσημη ταυτότητα του Euler: $e^{j\pi} + 1 = 0$)
  - $e^{j 3\pi/2} = -j$
  - $e^{j 2\pi} = 1$ (επιστροφή στην αρχή)

**Δύο πολύ χρήσιμες σχέσεις:**

Από την Euler και την ιδιότητα $e^{-j\theta} = \cos\theta - j\sin\theta$ (συζυγής της Euler), παίρνουμε:

$$\cos\theta = \frac{e^{j\theta} + e^{-j\theta}}{2}$$

$$\sin\theta = \frac{e^{j\theta} - e^{-j\theta}}{2j}$$

**Αυτές είναι κρίσιμες για όλο το μάθημα.** Κάθε φορά που θα γράφουμε ένα cosine σαν άθροισμα δύο complex exponentials, αυτή τη σχέση θα χρησιμοποιούμε.

**(b) How:**
- Connect explicitly to the unit-circle picture from the earlier viz.
- The cosine-as-sum-of-exponentials identity is so central to the course that it gets its own callout.

**(c) Components:**
- `<EulerUnitCircleViz />` — slider for $\theta$, watch the point $e^{j\theta}$ move around the unit circle. Show the corresponding $\cos\theta$ and $\sin\theta$ values updating.
- `<Callout type="key">` for the two cosine/sine-as-exponentials formulas.

#### 5. Συζυγής αριθμός (complex conjugate)

**(a) Content:**
- Definition: αν $z = a + jb$, ο **συζυγής** του είναι $z^* = a - jb$. Ίδιο real part, **αντίθετο** imaginary part.
- Σε πολική μορφή: αν $z = |z| e^{j\theta}$, τότε $z^* = |z| e^{-j\theta}$. Ίδιο μέτρο, **αντίθετη** γωνία.
- Γεωμετρική σημασία: ο συζυγής είναι το **καθρέπτισμα** του $z$ ως προς τον real άξονα.
- Σύμβολα: γράφουμε $z^*$ ή $\bar{z}$. Σε αυτό το μάθημα χρησιμοποιούμε $z^*$.

**Κρίσιμες ιδιότητες:**

1. **$z + z^* = 2\,\mathrm{Re}\{z\}$** — προσθέτοντας έναν μιγαδικό με τον συζυγή του, εξαφανίζονται τα imaginary parts.
2. **$z - z^* = 2j\,\mathrm{Im}\{z\}$** — αφαιρώντας τον συζυγή, μένει μόνο το imaginary part (πολλαπλασιασμένο με $2j$).
3. **$z \cdot z^* = |z|^2$** — γινόμενο με τον συζυγή = τετράγωνο του μέτρου. Πάντα πραγματικός μη-αρνητικός αριθμός.
4. **$(z_1 + z_2)^* = z_1^* + z_2^*$** — ο συζυγής αθροίσματος = άθροισμα συζυγών.
5. **$(z_1 \cdot z_2)^* = z_1^* \cdot z_2^*$** — ο συζυγής γινομένου = γινόμενο συζυγών.
6. **$(z^*)^* = z$** — διπλός συζυγής επιστρέφει το αρχικό.

**(b) How:**
- Lead with the geometric mirror picture. Students understand "flip across an axis" instantly.
- The 6 properties are listed without proofs, as a reference list.
- The first three (especially `z + z* = 2Re{z}` and `z·z* = |z|²`) are the ones the rest of the course leans on most.

**(c) Components:**
- Small viz: pick a point on the complex plane, see its conjugate as a mirrored point.
- `<Callout type="key">` for properties 1 and 3 specifically — these are the workhorses.

#### 6. Πράξεις

#### 6a. Πρόσθεση και αφαίρεση

- Σε Cartesian μορφή, πρόσθεση γίνεται **κατά συνιστώσα**: $(a_1 + jb_1) + (a_2 + jb_2) = (a_1+a_2) + j(b_1+b_2)$.
- Γεωμετρικά: σαν να προσθέτεις διανύσματα.
- Στην **πολική** μορφή η πρόσθεση είναι δύσκολη — θες να μετατρέψεις πρώτα σε Cartesian. Η πολική μορφή λάμπει στους πολλαπλασιασμούς, όχι στις προσθέσεις.

**Optional viz:** δύο μιγαδικοί που προστίθενται με parallelogram rule.

#### 6b. Πολλαπλασιασμός

- Σε **Cartesian:** $(a_1 + jb_1)(a_2 + jb_2) = (a_1 a_2 - b_1 b_2) + j(a_1 b_2 + a_2 b_1)$. Χρήσιμο για άμεσους υπολογισμούς αλλά δεν δίνει γεωμετρική διαίσθηση.
- Σε **πολική:** $(|z_1| e^{j\theta_1})(|z_2| e^{j\theta_2}) = |z_1||z_2| e^{j(\theta_1+\theta_2)}$.
  - **Τα μέτρα πολλαπλασιάζονται. Οι γωνίες προστίθενται.**
- Γεωμετρική σημασία: πολλαπλασιασμός με ένα $z$ είναι **scaling κατά $|z|$ + στροφή κατά $\angle z$**.
- Παράδειγμα: πολλαπλασιασμός με $j$ = πολλαπλασιασμός με $e^{j\pi/2}$ = στροφή κατά 90° (αριστερόστροφα). Πολλαπλασιασμός με $-1 = e^{j\pi}$ = στροφή κατά 180°.

**(b) How:**
- This is *the* reason polar form exists. Multiplication is so much cleaner geometrically that whole branches of math (and our entire frequency-domain analysis) depend on it.
- The "multiply by j = rotate by 90°" example is gold — flag it specifically.

**(c) Components:**
- `<ComplexMultiplicationViz />` — two complex numbers, see the product. Toggle between Cartesian rectangles vs polar arcs to see why polar is cleaner.

#### 6c. Διαίρεση

- Σε **πολική:** $\frac{|z_1| e^{j\theta_1}}{|z_2| e^{j\theta_2}} = \frac{|z_1|}{|z_2|} e^{j(\theta_1 - \theta_2)}$. Μέτρα διαιρούνται, γωνίες αφαιρούνται.
- Σε **Cartesian:** πιο αλγοριθμική. Η τυπική τεχνική είναι **πολλαπλασιασμός αριθμητή και παρονομαστή με τον συζυγή του παρονομαστή**:
$$\frac{z_1}{z_2} = \frac{z_1 \cdot z_2^*}{z_2 \cdot z_2^*} = \frac{z_1 \cdot z_2^*}{|z_2|^2}$$
- Παράδειγμα: $\frac{1}{j} = \frac{1 \cdot (-j)}{j \cdot (-j)} = \frac{-j}{1} = -j$. Δηλαδή $1/j = -j$ — μια από τις πιο χρήσιμες σχέσεις στις τηλεπικοινωνίες.

#### 6d. Ύψωση σε δύναμη

- Σε **πολική:** $z^n = |z|^n e^{jn\theta}$. Μέτρο στη δύναμη n, γωνία πολλαπλασιάζεται με n.
- Παράδειγμα: $(1+j)^4$. Σε πολική: $1+j = \sqrt{2} e^{j\pi/4}$. Άρα $(1+j)^4 = (\sqrt{2})^4 e^{j\pi} = 4 \cdot (-1) = -4$.
- **De Moivre's theorem:** $(\cos\theta + j\sin\theta)^n = \cos(n\theta) + j\sin(n\theta)$ — ειδική περίπτωση όταν $|z| = 1$.

#### 7. Χρήσιμες ταυτότητες — quick reference

A summary box with all the formulas a student might need to look up:

```
Cartesian ↔ Polar:
  z = a + jb = |z|e^(jθ)
  |z| = √(a² + b²)
  θ = atan2(b, a)
  a = |z|cos(θ)
  b = |z|sin(θ)

Euler:
  e^(jθ) = cos(θ) + j·sin(θ)
  e^(-jθ) = cos(θ) - j·sin(θ)
  cos(θ) = (e^(jθ) + e^(-jθ)) / 2
  sin(θ) = (e^(jθ) - e^(-jθ)) / (2j)

Conjugate:
  z* = a - jb = |z|e^(-jθ)
  z + z* = 2·Re{z}
  z - z* = 2j·Im{z}
  z·z* = |z|²
  (z₁ + z₂)* = z₁* + z₂*
  (z₁ · z₂)* = z₁* · z₂*
  (z*)* = z

Operations (polar):
  z₁ · z₂  → magnitudes multiply, angles add
  z₁ / z₂  → magnitudes divide, angles subtract
  z^n      → magnitude^n, angle·n
```

This box can be styled like a formula sheet, monospace, easy to scan.

#### 8. Παραδείγματα και ασκήσεις

5 worked examples + 3 self-check exercises with collapsible solutions. Suggested:

**Worked examples:**

1. Convert $z = 1 + j$ to polar form. → $|z| = \sqrt{2}$, $\angle z = \pi/4$.
2. Compute $j^3$. → $-j$ (geometric: 3 rotations of 90°).
3. Compute $(1+j)(1-j)$. → $1·z·z*$ pattern: $|1+j|^2 = 2$.
4. Express $\cos(2\pi f t)$ as a sum of two complex exponentials. → $(e^{j2\pi ft} + e^{-j2\pi ft})/2$.
5. Compute the conjugate of $H(f) = \frac{1}{1+j 2\pi f}$. → $H^*(f) = \frac{1}{1-j 2\pi f}$. Note this equals $H(-f)$ — the conjugate-symmetry property.

**Self-check exercises:**

1. Convert $-2 + 2j$ to polar form. (Answer: $|z| = 2\sqrt{2}$, $\angle z = 3\pi/4$ — note quadrant!)
2. Compute $(2 + 3j) + (1 - j)$. (Answer: $3 + 2j$.)
3. If $z = 4 e^{j\pi/3}$, find $z^2$. (Answer: $16 e^{j2\pi/3}$.)

Format: `<ExamProblem>` style with hint and solution toggles.

---

## Visualizations to build

1. **`<ComplexPlaneViz />`** — interactive plane, click/drag a point, shows Cartesian and polar forms live. Used in §2, §3, §5.
2. **`<EulerUnitCircleViz />`** — slider for θ, shows $e^{jθ}$ on the unit circle, with $\cos\theta$ and $\sin\theta$ projections. §4.
3. **`<ComplexMultiplicationViz />`** — two complex numbers, see the product geometrically (scaling + rotation). §6b.

All custom React/SVG/Canvas. No external assets.

---

## Part 2: Trim `/foundations/systems` Section 7 Βήμα 3

### What changes

Replace the current Βήμα 3 (which inlines a conjugate refresher) with a tighter version that **keeps the topic-specific derivation** but **outsources the conjugate facts** to the new reference page.

### New text for Βήμα 3

```
**Βήμα 3 — συζυγής συμμετρία για real h(t).** Ορίσαμε:

$$H(f) = \int_{-\infty}^{\infty} h(\tau)\, e^{-j 2\pi f \tau}\, d\tau$$

Ας υπολογίσουμε δύο διαφορετικά πράγματα:

(α) Το $H(-f)$ — απλώς αλλάζουμε πρόσημο στο εκθετικό:
$$H(-f) = \int_{-\infty}^{\infty} h(\tau)\, e^{+j 2\pi f \tau}\, d\tau$$

(β) Τον συζυγή $H^*(f)$ — εφαρμόζοντας τις [ιδιότητες του συζυγή](/reference/complex-numbers#section-5) (ο συζυγής αθροίσματος = άθροισμα συζυγών, του γινομένου = γινόμενο συζυγών), και ότι ο συζυγής του $e^{-jx}$ είναι $e^{+jx}$:
$$H^*(f) = \int_{-\infty}^{\infty} h^*(\tau)\, e^{+j 2\pi f \tau}\, d\tau$$

Σε ένα φυσικό σύστημα, το $h(t)$ είναι **real-valued**, άρα $h^*(\tau) = h(\tau)$. Οπότε τα δύο ολοκληρώματα είναι ίδια:

$$\boxed{H(-f) = H^*(f)}$$

Αυτή είναι η ιδιότητα της **conjugate symmetry**. Θα την ξανασυναντήσουμε όταν θα φτιάχνουμε φάσματα — γι' αυτό σχεδιάζουμε συχνά μόνο το θετικό μισό του άξονα συχνοτήτων: το αρνητικό είναι ο μιγαδικός συζυγής.
```

The link to `/reference/complex-numbers#section-5` (or whatever the actual anchor for §5 ends up being) lets readers refresh their conjugate facts without bloating this page.

### Remove the old conjugate refresher callout

The previous retrofit added an inline conjugate refresher callout right before Βήμα 3. **Remove that callout** — it's now redundant with the reference page.

---

## Part 3: Update `/foundations/signals` Section 4b (Complex exponentials)

### What changes

Currently §4b introduces $e^{j\omega t}$ via Euler's formula and the rotating phasor visualization. The retrofit:

- **Adds a callout at the top of §4b** linking to `/reference/complex-numbers` for readers who need a refresher: *"Αν θες ένα refresher στους μιγαδικούς αριθμούς και την ταυτότητα του Euler, δες [/reference/complex-numbers](/reference/complex-numbers). Παρακάτω εδώ θα δούμε πώς αυτά **εφαρμόζονται** σαν σήματα."*
- **Trims any general complex-number explanation** that's currently inline — Euler's formula intro, conjugate-of-cosine sum, etc. — and replaces with the link.
- **Keeps the signal-specific content:** the rotating phasor picture, why we use complex exponentials *as building blocks for signals*, the $\frac{1}{2}(e^{j\omega t} + e^{-j\omega t})$ decomposition of cosine **(reference link to where this comes from, but state it inline since it's used immediately)**.

The bar: §4b should focus on "complex exponentials as signals", not "complex numbers as math". The reference page handles the latter.

---

## Sidebar architecture

Reference pages live under a "Reference" subgroup inside "Foundations". Sidebar structure:

```
- Εισαγωγή
- Foundations
  - Σήματα
  - Συστήματα
  - Σειρές Fourier        (future)
  - Μετασχηματισμός Fourier (future)
  - Reference
    - Μετασχηματισμοί σήματος
    - Μιγαδικοί αριθμοί     ← new
    - (more in future: trig identities, Fourier pairs, etc.)
- Randomness               (future)
- ...
```

Visual treatment: the "Reference" subgroup header should be **visually distinct** — slightly muted color, smaller font, maybe a subtle "📚" icon — to signal "these are reference pages, not part of the main flow". Reference page items in the sidebar should not show "mark complete" toggles (since they're not flow content meant to be read once and ticked off).

---

## Acceptance criteria

When this retrofit is done:

1. ✅ `/reference/complex-numbers` exists with all 8 sections + 3 vizzes + worked examples + self-check exercises
2. ✅ `<ComplexPlaneViz />`, `<EulerUnitCircleViz />`, `<ComplexMultiplicationViz />` all functional and tested on mobile
3. ✅ Quick-reference summary box in §7 of the reference page is scannable
4. ✅ `/foundations/systems` Βήμα 3 trimmed to the systems-specific derivation, with link to reference page
5. ✅ Inline conjugate refresher callout in `/foundations/systems` removed
6. ✅ `/foundations/signals` §4b updated with reference link at top + general math content trimmed
7. ✅ Sidebar shows "Reference" as a clearly-distinct subgroup under "Foundations" with both signal-transformations and complex-numbers under it
8. ✅ Reference pages don't show "mark complete" toggles
9. ✅ User reviews — the "I don't remember conjugates" gap from the systems page is fully addressable by following the reference link, no inline bloat needed

---

## Updates to COMMITMENTS.md

No new open commitments. This retrofit closes a hidden gap (the implicit promise that complex-number math would be properly explained somewhere — never delivered) and improves architecture for future retrofits.

**However, this also implies a future commitment we should note:** as the course progresses, more general math will need its own reference pages. Likely candidates:

- `/reference/trig-identities` — sin/cos identities used throughout. Especially product-to-sum formulas which appear constantly in modulation.
- `/reference/fourier-pairs` — the canonical FT pairs from the typology, mirrored as an interactive page.
- `/reference/integrals` — the integrals from the typology.

Add a placeholder commitment to COMMITMENTS.md:

- [ ] **Reference pages for trig identities, Fourier pairs, and integrals** — as topic pages start needing these, build the corresponding reference pages and link instead of inlining.

---

## Note for Claude Code

This retrofit fixes the conjugate-symmetry gap in `/foundations/systems` Section 7 properly — by recognizing that conjugate arithmetic is general math that belongs in a reference page, not topic-specific content that belongs in systems. The student's question that triggered this ("can't say I personally understand the συζυγής συμμετρία part... I'm having gaps") gets answered both by the reference page (general conjugate facts) and the trimmed Βήμα 3 (systems-specific derivation now standing alone clearly).

This is also the start of a pattern: **every time we find general math that's been inlined awkwardly, refactor it to a reference page**. Future plans will follow this.
