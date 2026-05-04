# 06 — Foundations/Fourier Transform: "Από διακριτό σε συνεχές φάσμα"

**Goal:** Generalize Fourier analysis from periodic signals (Fourier series → discrete spectrum) to *any* signal (Fourier transform → continuous spectrum). By the end the reader should:

1. Understand the **limit-of-period argument**: as $T_0 \to \infty$, FS becomes FT, discrete becomes continuous.
2. Know the **forward and inverse FT** equations and what each integral *does*.
3. Recognize the canonical **transform pairs** that show up everywhere in the rest of the course (rectangle ↔ sinc, triangle ↔ sinc², impulse ↔ 1, cosine ↔ pair of impulses).
4. Use the **properties of FT** as a working toolkit: linearity, time shift, frequency shift (modulation theorem!), time scaling, convolution ↔ multiplication, Parseval, conjugate symmetry, derivative.
5. Understand the **modulation theorem** intuitively: multiplying by a cosine shifts the spectrum by ±f_c. This is the foundation of *all* modulation.
6. Connect everything back: $H(f) = \mathcal{F}\{h(t)\}$, the eigenfunction property's $H(f)$ is finally named.
7. Be able to compute the FT of standard signals and recognize them in the typology.

This is the **biggest and most important foundations section**. Almost every modulation, noise, and digital comm result downstream depends on something derived here. The good news: most of the heavy lifting is *applying* what we've already established (orthogonality, complex exponentials, eigenfunction). The FT is the natural extension, not new physics.

---

## Closes commitments

A *lot*:

- **Limit-of-period argument formalized** (from FS Section 9) — closed in Section 1 of this page
- **Conjugate symmetry of spectrum for real signals** (general FT property) (from FS Section 6c, systems Section 7) — closed in Section 7d
- **Why H(f) of an LTI system is the FT of h(t)** (from systems Section 7) — closed in Section 5b (after introducing convolution-multiplication property)
- **Convolution in time = multiplication in frequency** (from systems Section 6) — closed in Section 5b
- **Why a pure cosine produces a single spike in the frequency domain** (from /intro Section 6) — *fully* closed in Section 6 (FT of cosine = pair of impulses)
- **Real h(t) ↔ conjugate-symmetric H(f) and the FT symmetry family** (from systems Section 7) — closed in Section 7d
- **Why even h(t) gives real H(f)** (from systems Section 7 — note: this was actually answered in the systems page using Euler split, but here we *generalize* it as an FT symmetry property)
- **Parseval for signals** (from FS chapter, deferred) — closed in Section 8

(Some of these overlap; in practice the FT chapter answers the entire FS-deferred + systems-deferred backlog about spectra, properties, and conjugate symmetry.)

## Adds commitments

- **Wiener–Khinchin theorem** — autocorrelation ↔ ESD/PSD relationship is *introduced* here as an FT property in Section 9, but its full role lives in the random processes / noise chapter. Add commitment that the random-process chapter formalizes PSD for *random* signals (this section only treats deterministic signals).
- **Sampling theorem** — we'll *use* multiplication-by-impulse-train in modulation, but the formal sampling theorem treatment is in `/sampling-adc`. Add commitment.
- **Bandpass signals, Hilbert transform** — these belong in the next foundations chapter (`/foundations/bandpass-filters`). Add commitment if not already there.

---

## Source material

- Primary slides: `SE_session56_theory3_2025.pdf` slides 12-49
- Key visuals:
  - S56.12: "Τι θα συμβεί αν T_0 → +∞;" — the bridge
  - S56.15: forward and inverse FT equations
  - S56.18: existence conditions (Dirichlet) — light coverage
  - S56.21: rectangular pulse FT example (sinc envelope)
  - S56.24: properties summary slide
  - S56.27: triangular pulse → sinc² (worked example)
  - S56.30: **modulation theorem** (the diagram showing X(f) → ½[X(f-f_c) + X(f+f_c)])
  - S56.33: FT of periodic signal (sum of impulses) — connects FS and FT
  - S56.36: Parseval, ESD, PSD definitions
  - S56.39: convolution and correlation
  - S56.48: Wiener–Khinchin (FT of autocorrelation = |X(f)|²)

The lecture's typology (`formulas.pdf`) is highly relevant here — it lists most of the transform pairs and properties students will use in the exam. Flag the typology pairs explicitly.

---

## Where this lives on the site

Path: `/foundations/fourier-transform`

Sidebar group: **Foundations → Μετασχηματισμός Fourier** (right after Σειρές Fourier, before Bandpass & Filters)

---

## Page outline

```
1. Από Fourier series σε Fourier transform: το πέρασμα στο όριο
2. Οι δύο εξισώσεις του Fourier transform
3. Conditions of existence (πολύ σύντομο, χωρίς να μπλοκάρουμε)
4. Παραδείγματα — οι «πρωταγωνιστές» που θα δούμε ξανά και ξανά
   4a. Single rectangular pulse → sinc
   4b. Triangular pulse → sinc²
   4c. Single impulse δ(t) → 1
   4d. Constant 1 → δ(f) (από inverse argument)
   4e. cos(2πf₀t) → ½[δ(f-f₀) + δ(f+f₀)]
5. Ιδιότητες του FT — η εργαλειοθήκη
   5a. Γραμμικότητα
   5b. **Convolution ↔ multiplication** (κλείνει major commitment από systems)
   5c. Multiplication ↔ convolution (το αντίστροφο)
   5d. Time shift
   5e. Time scaling
   5f. Differentiation
6. Spectrum of periodic signals: από FT σε FS και πίσω
7. Modulation theorem: ολίσθηση φάσματος (η μαθηματική καρδιά της AM)
8. Conjugate symmetry — γιατί τα φάσματα real signals είναι συμμετρικά
9. Parseval και Energy Spectral Density
10. Autocorrelation και Wiener–Khinchin (preview)
11. Σύνδεση όλου του κεφαλαίου με το H(f) των LTI
12. Σύνοψη + παραπομπές (typology, exam tips)
13. Recap + Next up
```

---

## Detailed content per section

### 1. Από Fourier series σε Fourier transform: το πέρασμα στο όριο

**Closes the bridge promised at the end of FS.**

**(a) Content:**

> *"Στο προηγούμενο κεφάλαιο μάθαμε ότι ένα **periodic** σήμα μπορεί να γραφτεί σαν άθροισμα από αρμονικά συσχετισμένες complex exponentials, και το φάσμα του είναι **διακριτό** — γραμμές μόνο στις συχνότητες $0, \pm f_0, \pm 2f_0, \ldots$.*
>
> *Τι γίνεται όμως όταν το σήμα **δεν είναι** periodic;*
>
> ***Διαισθητικά:** ένα μη-periodic σήμα μπορούμε να το σκεφτούμε σαν periodic με **άπειρη** περίοδο. Καθώς $T_0 \to \infty$:*
>
> *- Η θεμελιώδης συχνότητα $f_0 = 1/T_0 \to 0$.*
> *- Οι αρμονικές $kf_0$ έρχονται ολοένα και πιο κοντά μεταξύ τους.*
> *- Το διακριτό φάσμα μετατρέπεται σε **συνεχές**.*
>
> *Στο όριο, το άθροισμα της σειράς Fourier γίνεται **ολοκλήρωμα**, και τα διακριτά $a_k$ συγχωνεύονται σε μια **συνεχή συνάρτηση συχνότητας** που τη συμβολίζουμε $X(f)$. Αυτή είναι ο **μετασχηματισμός Fourier** του σήματος $x(t)$.*
>
> *Είναι το ίδιο πράγμα με τη σειρά Fourier, απλώς γενικευμένο για να καλύπτει και μη-περιοδικά σήματα. Όλη η διαίσθηση από το προηγούμενο κεφάλαιο μεταφέρεται."*

**(b) How:**

The "limit of period" framing was promised in FS Section 9. Close it explicitly with a back-reference: *"όπως υποσχεθήκαμε..."*. Don't try to do a rigorous limit derivation here (it's a detail that adds clutter); the heuristic argument is enough for intuition.

**(c) Components:**

- **`<PeriodToInfinity />`** viz — already mentioned in FS plan as "should-have" but if it didn't get built there, build it here. Shows a periodic signal's spectrum as period grows. Lines bunch up; in the limit they merge into a continuous curve. **Critical for this section.** If FS already built it, reuse with a link back.
- `<Callout type="connection">` explicitly tying back to the FS chapter and stating "FS = special case of FT for periodic signals (which we'll prove in Section 6 of this page)."

---

### 2. Οι δύο εξισώσεις του Fourier transform

**(a) Content:**

> *"Ο Fourier transform έρχεται σε **δύο** εξισώσεις, ίδιο pattern με τη σειρά Fourier — μία για να **πάμε από χρόνο σε συχνότητα** (ανάλυση), μία για να **γυρίσουμε πίσω** (σύνθεση).*
>
> ***Ευθύς (forward) μετασχηματισμός Fourier — ανάλυση:***
>
> *$$\boxed{X(f) = \int_{-\infty}^{\infty} x(t)\, e^{-j 2\pi f t}\, dt}$$*
>
> *Παίρνει ένα σήμα στον χρόνο και επιστρέφει το **φάσμα** του στη συχνότητα: μια συνεχή συνάρτηση $X(f)$ που λέει, σε κάθε συχνότητα $f$, **πόσο πολύ από αυτή τη συχνότητα υπάρχει** στο σήμα.*
>
> ***Αντίστροφος (inverse) μετασχηματισμός Fourier — σύνθεση:***
>
> *$$\boxed{x(t) = \int_{-\infty}^{\infty} X(f)\, e^{+j 2\pi f t}\, df}$$*
>
> *Παίρνει το φάσμα και ξαναχτίζει το σήμα: ένα **συνεχές «άθροισμα»** από complex exponentials σε όλες τις συχνότητες, η καθεμία ζυγισμένη με $X(f)\, df$.*
>
> *Σημειογραφία: γράφουμε $X(f) = \mathcal{F}\{x(t)\}$ για τον forward και $x(t) = \mathcal{F}^{-1}\{X(f)\}$ για τον inverse. Συχνά γράφουμε επίσης $x(t) \overset{\mathcal{F}}{\longleftrightarrow} X(f)$ για να τονίσουμε ότι το ζευγάρι **time-domain ↔ frequency-domain** είναι αμφίδρομο.*
>
> ***Πρόσεξε την ομοιότητα με τη σειρά Fourier:***
>
> *- Το πρόσημο στο εκθετικό είναι αρνητικό στον forward, θετικό στον inverse — ίδια σύμβαση όπως στους συντελεστές FS.*
> *- Στη FS αθροίζαμε σε ακέραια $k$. Στον FT ολοκληρώνουμε σε συνεχές $f$.*
> *- Στη FS διαιρούσαμε με $T_0$ στους συντελεστές. Στον FT, το «$T_0$» έχει εξαφανιστεί στο άπειρο, οπότε δεν χρειάζεται.*"*

**(b) How:**

Box both equations. Show the symmetry between forward and inverse — they look almost identical except for the sign and the variable.

The notation `X(f) = F{x(t)}` and the bidirectional arrow are heavily used in the rest of the course; introduce them clearly here.

**(c) Components:**

- Both equations boxed
- A small comparison table FS vs FT: "discrete sum over k" vs "continuous integral over f", coefficients vs continuous spectrum, etc.

---

### 3. Conditions of existence (Dirichlet) — σύντομα

**(a) Content:**

Brief mention only — students rarely encounter pathological signals, and existence isn't on the exam.

> *"Σχόλιο για τη μαθηματική πληρότητα: ο FT υπάρχει για ένα σήμα $x(t)$ κάτω από ορισμένες συνθήκες (Dirichlet), που χονδρικά απαιτούν το σήμα να είναι «λογικό»: απολύτως ολοκληρώσιμο, με πεπερασμένα ακρότατα και ασυνέχειες σε πεπερασμένο πλήθος. Όλα τα σήματα που θα συναντήσουμε σε αυτό το μάθημα τις πληρούν, οπότε δεν θα μας απασχολήσουν.*
>
> *(Για όσους ψάχνουν: σήματα όπως ο μοναδιαίος βηματικός $u(t)$ ή το $\cos$ τεχνικά **δεν** είναι απολύτως ολοκληρώσιμα, αλλά τα δουλεύουμε με τη βοήθεια **κρουστικών συναρτήσεων** στο φάσμα — δες παρακάτω.)"*

**(b) How:**

One paragraph, expandable for curious readers if you want, but not load-bearing. We'll do the FT of cos and friends in Section 4e using delta functions.

---

### 4. Παραδείγματα — οι πρωταγωνιστές

This section computes the FT of the most important signals. **All of these appear in the typology** that students get during the exam — flag this throughout.

#### 4a. Single rectangular pulse → sinc

**(a) Content:**

> *"Έστω $x(t) = A \cdot \mathrm{rect}(t/T)$ — ένας τετραγωνικός παλμός πλάτους $A$ και συνολικού πλάτους χρόνου $T$ κεντραρισμένος στο 0. Από τον ορισμό:*
>
> *$$X(f) = \int_{-T/2}^{T/2} A\, e^{-j 2\pi f t}\, dt = A \cdot \frac{e^{-j 2\pi f t}}{-j 2\pi f}\Big|_{-T/2}^{T/2}$$*
>
> *Επεξεργαζόμενοι το αποτέλεσμα (παράγουμε αρνητικό εκθετικό μείον θετικό = $-2j\sin$):*
>
> *$$X(f) = A \cdot \frac{\sin(\pi f T)}{\pi f} = AT \cdot \frac{\sin(\pi f T)}{\pi f T} = AT \cdot \mathrm{sinc}(fT)$$*
>
> *όπου χρησιμοποιήσαμε τον ορισμό $\mathrm{sinc}(x) = \sin(\pi x)/(\pi x)$.*
>
> *$$\boxed{A\,\mathrm{rect}(t/T) \overset{\mathcal{F}}{\longleftrightarrow} AT\,\mathrm{sinc}(fT)}$$*
>
> *Παρατηρήσεις:*
>
> *- Το **πλάτος** του φάσματος στο μηδέν είναι $X(0) = AT$ — ίσο με την ολοκλήρωση του παλμού (το «εμβαδόν» του).*
> *- Τα **μηδενικά** του sinc είναι σε $f = \pm 1/T, \pm 2/T, \ldots$ — όσο πιο **στενός** ο παλμός στον χρόνο, τόσο πιο **πλατύ** το φάσμα στη συχνότητα. Αυτή είναι η πρώτη εμφάνιση μιας από τις πιο βαθιές αρχές του Fourier: **time-frequency duality** — στενό στον χρόνο = πλατύ στη συχνότητα και αντίστροφα.*
> *- **Συγκρίνε με την FS του τετραγωνικού παλμικού σήματος** από το προηγούμενο κεφάλαιο: εκεί παίρναμε διακριτές γραμμές με ύψη $\frac{1}{2}\mathrm{sinc}(k/2)$. Εδώ έχουμε **συνεχή** sinc καμπύλη. Είναι η ίδια envelope, απλώς ο periodic έκδοχός του «δειγματίζει» αυτή την envelope στις διακριτές αρμονικές.*"*

**(b) How:**

This is *the* canonical example. Walk through the integral. Highlight time-frequency duality — this principle alone explains huge things later (why a short impulse has a wide spectrum, why a narrowband filter must respond slowly in time, etc.).

The connection back to the FS rectangular pulse is gold. **Reuse imagery from FS chapter** if possible — same rectangle in time, but now show how the FS discrete spikes "live on" the FT sinc envelope.

**(c) Components:**

- `<RectToSincViz />` — interactive: slider for rect width T, see the sinc spectrum widen/narrow inversely. Side-by-side time + frequency plots.
- Tag: "✓ Στο τυπολόγιο" — flag it's in the formula sheet

#### 4b. Triangular pulse → sinc²

**(a) Content:**

State the result, derive briefly using convolution (since rect⊛rect = triangle, and FT(rect⊛rect) = FT(rect)·FT(rect) = sinc·sinc = sinc²) — this elegantly previews Section 5b's convolution property.

> *"$$\boxed{\Lambda(t/T) \overset{\mathcal{F}}{\longleftrightarrow} T \cdot \mathrm{sinc}^2(fT)}$$*
>
> *(Ο τριγωνικός παλμός $\Lambda(t/T)$ έχει βάση $2T$ και κορυφή 1 στο 0.)*
>
> *Διαισθητικά γιατί βγαίνει sinc²: ένα τρίγωνο γράφεται σαν **συνέλιξη δύο rectangles**. Από την ιδιότητα convolution↔multiplication που θα δούμε σε λίγο, ο FT μιας convolution είναι το γινόμενο των επιμέρους FT:*
>
> *$$\mathcal{F}\{\mathrm{rect} * \mathrm{rect}\} = \mathrm{sinc} \cdot \mathrm{sinc} = \mathrm{sinc}^2.$$*
>
> *Tag: ✓ Στο τυπολόγιο."*

#### 4c. Single impulse δ(t) → 1

**(a) Content:**

> *"$$\boxed{\delta(t) \overset{\mathcal{F}}{\longleftrightarrow} 1}$$*
>
> *Από τη σαρωτική ιδιότητα της δ:*
>
> *$$\mathcal{F}\{\delta(t)\} = \int_{-\infty}^{\infty} \delta(t)\, e^{-j 2\pi f t}\, dt = e^{-j 2\pi f \cdot 0} = 1$$*
>
> *για κάθε $f$. **Το φάσμα μιας κρούσης είναι σταθερό** — όλες οι συχνότητες παρούσες με ίσο πλάτος. Αυτή είναι η μαθηματική διατύπωση του «μια στιγμιαία κρούση περιέχει όλες τις συχνότητες», που δικαιολογεί γιατί η δ(t) χρησιμοποιείται ως «test signal» για να βρούμε την κρουστική απόκριση.*
>
> *Tag: ✓ Στο τυπολόγιο."*

#### 4d. Constant 1 → δ(f)

**(a) Content:**

> *"$$\boxed{1 \overset{\mathcal{F}}{\longleftrightarrow} \delta(f)}$$*
>
> *Συμμετρικό του 4c — ένα σταθερό σήμα στο χρόνο έχει ένα μόνο σημείο στο φάσμα: το $f=0$ (DC). Το φάσμα του δίνεται από κρούση στο μηδέν.*
>
> *(Παρατήρηση: το `1` δεν είναι τυπικά απολύτως ολοκληρώσιμο — αυτή η σχέση δικαιολογείται μέσω της θεωρίας κατανομών. Δεν θα μας απασχολήσει.)"*

#### 4e. cos(2πf₀t) → ½[δ(f-f₀) + δ(f+f₀)]

**This finally closes the "why pure cosine = single spike" commitment from /intro Section 6.**

**(a) Content:**

> *"$$\boxed{\cos(2\pi f_0 t) \overset{\mathcal{F}}{\longleftrightarrow} \tfrac{1}{2}\delta(f - f_0) + \tfrac{1}{2}\delta(f + f_0)}$$*
>
> *Από Euler:*
>
> *$$\cos(2\pi f_0 t) = \tfrac{1}{2}e^{j 2\pi f_0 t} + \tfrac{1}{2}e^{-j 2\pi f_0 t}$$*
>
> *Από γραμμικότητα και την ιδιότητα 4d (`1 ↔ δ(f)`) μετατοπισμένη με frequency-shift (που θα δούμε στη 5d), παίρνουμε ότι κάθε complex exponential $e^{j 2\pi f_c t}$ έχει FT $\delta(f - f_c)$. Άρα:*
>
> *$$\mathcal{F}\{\cos(2\pi f_0 t)\} = \tfrac{1}{2}\delta(f - f_0) + \tfrac{1}{2}\delta(f + f_0)$$*
>
> *🎯 **Κλείνει η υπόσχεση από την εισαγωγή.** Στο πρώτο κεφάλαιο, στο TimeFrequencyTeaser, είδαμε ότι ένα καθαρό cosine βγάζει ένα «καρφί» στη συχνότητα και υποσχεθήκαμε να εξηγήσουμε γιατί. **Να γιατί:** το φάσμα ενός cosine αποτελείται από **δύο κρούσεις (δέλτα συναρτήσεις)**, μία στη $+f_0$ και μία στη $-f_0$, καθεμία με πλάτος $\frac{1}{2}$. Στα διαγράμματα φαίνονται σαν δύο κάθετες γραμμές («καρφιά») — όλη η ενέργεια του cosine είναι συμπυκνωμένη ακριβώς στη συχνότητα του.*"*

**(b) How:**

Make the closing-of-commitment moment explicit and visible. The student has been waiting for this answer since the *very first page of the site*.

**(c) Components:**

- A spectrum diagram showing the two impulses at ±f₀
- `<Callout type="closes-commitment">` — visually distinct callout style for "we promised X, here's the answer"

---

### 5. Ιδιότητες του FT — η εργαλειοθήκη

For each property: equation + plain-Greek meaning + when we'll use it. Each appears in the typology — flag this.

#### 5a. Γραμμικότητα

> *"$$a x_1(t) + b x_2(t) \overset{\mathcal{F}}{\longleftrightarrow} a X_1(f) + b X_2(f)$$*
>
> *Λογικό από τη γραμμικότητα του ολοκληρώματος. Χρήσιμο γιατί: συχνά το σήμα είναι άθροισμα κομματιών των οποίων ξέρουμε τους FT ξεχωριστά."*

#### 5b. Convolution ↔ multiplication ⭐

**Closes major commitment from systems chapter.**

> *"$$\boxed{x_1(t) * x_2(t) \overset{\mathcal{F}}{\longleftrightarrow} X_1(f) \cdot X_2(f)}$$*
>
> *Σε λόγια: η συνέλιξη στον χρόνο γίνεται απλό **πολλαπλασιασμός** στη συχνότητα.*
>
> *Αυτό είναι ίσως η **πιο σημαντική ιδιότητα του FT** για το μάθημα μας. Δες γιατί: από το κεφάλαιο των συστημάτων, η έξοδος ενός LTI είναι $y(t) = x(t) * h(t)$. Στο frequency domain αυτό γίνεται:*
>
> *$$Y(f) = X(f) \cdot H(f)$$*
>
> *Δηλαδή για να βρεις την έξοδο, **απλώς πολλαπλασιάζεις τα δύο φάσματα**. Η συνέλιξη — με όλο το flip-and-slide της — εξαφανίζεται. Αυτή είναι η πραγματική δύναμη του να δουλεύεις στη συχνότητα.*
>
> ***🎯 Κλείνει υπόσχεση από systems:** Στο κεφάλαιο των συστημάτων είπαμε ότι η εικονική συνάρτηση $H(f_0)$ που εμφανίζεται στην eigenfunction property είναι κάτι ξεχωριστό, και υποσχεθήκαμε να εξηγήσουμε γιατί. Τώρα φαίνεται: **το $H(f)$ ενός LTI συστήματος είναι ο μετασχηματισμός Fourier της κρουστικής του απόκρισης $h(t)$.***
>
> *$$\boxed{H(f) = \mathcal{F}\{h(t)\}}$$*
>
> *Όλη η ανάλυση των LTI στο frequency domain στηρίζεται σε αυτή τη σχέση.*
>
> *Tag: ✓ Στο τυπολόγιο."*

This is the **most important moment of the chapter**. The student finally sees why H(f) is what it is, and why working in the frequency domain transforms LTI analysis. Spend real estate here.

#### 5c. Multiplication ↔ convolution

> *"$$x_1(t) \cdot x_2(t) \overset{\mathcal{F}}{\longleftrightarrow} X_1(f) * X_2(f)$$*
>
> *Δυικό της 5b: πολλαπλασιασμός στον χρόνο = συνέλιξη στη συχνότητα. Φαντάζει τεχνικό τώρα, αλλά γίνεται κρίσιμο όταν δούμε **σαμπλάρισμα** (multiplication by impulse train) και **modulation** (multiplication by carrier cosine).*"*

#### 5d. Time shift

> *"$$x(t - t_0) \overset{\mathcal{F}}{\longleftrightarrow} e^{-j 2\pi f t_0} X(f)$$*
>
> *Σημασία: ολίσθηση στο χρόνο **δεν αλλάζει** το μέτρο του φάσματος ($|e^{-j 2\pi f t_0}| = 1$), προσθέτει μόνο μια **γραμμική φάση** $-2\pi f t_0$. Αυτό **ταυτίζεται** με τη σχέση φάσης ↔ time shift από το [κεφάλαιο της φάσης](/foundations/signals#phase) — δες πώς όλα δένουν.*"*

#### 5e. Time scaling (αλλαγή κλίμακας)

> *"$$x(\alpha t) \overset{\mathcal{F}}{\longleftrightarrow} \tfrac{1}{|\alpha|} X(f/\alpha)$$*
>
> *Σημασία: αν συμπιέσεις το σήμα στον χρόνο (μεγάλο $|\alpha|$), το φάσμα του διαστέλλεται. Αν το επεκτείνεις (μικρό $|\alpha|$), το φάσμα συμπιέζεται. **Time-frequency duality** σε action — ίδιο φαινόμενο που είδαμε στο rectangle ↔ sinc."*

#### 5f. Differentiation

> *"$$\frac{d^k x(t)}{dt^k} \overset{\mathcal{F}}{\longleftrightarrow} (j 2\pi f)^k X(f)$$*
>
> *Σημασία: παράγωγος στον χρόνο = πολλαπλασιασμός με $j 2\pi f$ στη συχνότητα. Διπλώνει τις υψηλές συχνότητες (πιο πολύ ζύγισμα όσο μεγαλώνει το $f$). Χρήσιμο σε διαφορικές εξισώσεις."*

**(c) Components:**

- A summary table at the end of Section 5 listing all properties with "πότε χρησιμοποιείται" notes
- Each property tagged with "✓ Στο τυπολόγιο"

---

### 6. Spectrum of periodic signals: από FT σε FS και πίσω

**(a) Content:**

> *"Ένα periodic σήμα $x(t)$ με περίοδο $T_0$ έχει FT αποτελούμενο από **κρούσεις (Dirac deltas)** στις αρμονικές συχνότητες:*
>
> *$$\boxed{X(f) = \sum_{k=-\infty}^{\infty} a_k\, \delta(f - kf_0)}$$*
>
> *όπου $a_k$ είναι οι συντελεστές της σειράς Fourier του $x(t)$.*
>
> ***Η ένωση FS και FT.** Τα δύο εργαλεία δεν είναι ξεχωριστά. Για μη-περιοδικά σήματα έχουμε **συνεχές φάσμα** $X(f)$. Για periodic σήματα, αυτό το συνεχές φάσμα γίνεται μια συνεχής συνάρτηση που είναι **μηδέν παντού εκτός από τις αρμονικές**, όπου έχουμε κρούσεις. Οι σειρές Fourier είναι λοιπόν **ειδική περίπτωση** του FT — η περίπτωση όπου το φάσμα συγκεντρώνεται σε διακριτά «καρφιά» αντί για συνεχή κατανομή.*
>
> ***Παράδειγμα: cos(2πf₀t).** Όπως είδαμε στη 4e, ο FT του είναι $\frac{1}{2}\delta(f-f_0) + \frac{1}{2}\delta(f+f_0)$. Αν το γράψουμε σε FS μορφή, τα μόνα μη-μηδενικά $a_k$ είναι $a_1 = a_{-1} = 1/2$. Η συνέπεια είναι ακριβώς η ίδια — δύο κρούσεις, ίδιες τιμές, ίδιες θέσεις."*

**(b) How:**

This is a **unification moment**. Students often have FS and FT in separate boxes in their head. Show explicitly that they're the same machine — periodic signals just have spectra that happen to be entirely impulse-like.

**(c) Components:**

- A side-by-side comparison: rectangular pulse FT (continuous sinc) vs rectangular pulse train FT (discrete impulses with sinc-envelope heights). **Same envelope, different spectrum types.**

---

### 7. Modulation theorem ⭐

**(a) Content:**

> *"Από τις πιο σημαντικές ιδιότητες — προετοιμάζει όλο το κεφάλαιο της AM modulation. Πρόκειται για ειδική περίπτωση της ιδιότητας **Multiplication ↔ Convolution** (5c) όταν το ένα από τα δύο σήματα είναι cosine.*
>
> *Έστω σήμα $x(t)$ με FT $X(f)$. Τι γίνεται όταν το πολλαπλασιάσουμε με ένα cosine συχνότητας $f_c$;*
>
> *$$y(t) = A\, x(t) \cos(2\pi f_c t)$$*
>
> *Στη συχνότητα:*
>
> *$$\boxed{Y(f) = \frac{A}{2}\big[ X(f - f_c) + X(f + f_c) \big]}$$*
>
> ***Με λόγια:** πολλαπλασιάζοντας με $\cos(2\pi f_c t)$ στον χρόνο, το φάσμα του $x(t)$ **αναπαράγεται μετατοπισμένο κατά $\pm f_c$**, με τη μισή του πλάτους σε καθεμία.*
>
> ***Η απόδειξη** βγαίνει από την 5c και την 4e: ο FT του cosine είναι δύο κρούσεις στις $\pm f_c$, και η συνέλιξη του $X(f)$ με δύο κρούσεις απλώς τις τοποθετεί σαν κέντρα δύο αντιγράφων του $X(f)$.*
>
> ***Γιατί έχει σημασία:** αυτή είναι **ακριβώς η μαθηματική διαδικασία της AM modulation**. Παίρνουμε ένα baseband σήμα $x(t)$ (φωνή, μουσική) που ζει στις χαμηλές συχνότητες, το πολλαπλασιάζουμε με ένα carrier cosine στη $f_c$, και το **μεταφέρουμε** σε δύο πιστά αντίγραφα γύρω από τις $\pm f_c$. Αυτό μας επιτρέπει να μεταδώσουμε στις υψηλές συχνότητες (όπου οι κεραίες είναι πρακτικού μεγέθους) χωρίς να αλλάξουμε το **σχήμα** της πληροφορίας — μόνο τη θέση της στο φάσμα. Όταν φτάσουμε στο [κεφάλαιο της AM](/modulation/am), αυτή θα είναι η αρχή των πάντων.*"*

**(b) How:**

Spend real estate. Use the lecture's S56.30 visual (or a recreation) — original spectrum centered around 0, modulated spectrum centered around ±f_c.

**(c) Components:**

- **`<ModulationTheoremViz />`** — flagship for this section. Interactive: pick a baseband signal (a triangle, a chunk of speech, a custom shape). Slider for f_c. See the spectrum on the bottom shift and split. Maybe also show the time domain: x(t), cos(2πf_c t), and their product. The product looks like a "rapidly oscillating envelope" — the carrier riding the message. **This single viz sets up modulation viscerally before any AM math.**
- Forward link to `/modulation/am` already in the prose

---

### 8. Conjugate symmetry

**Closes the long-deferred commitment from systems and FS.**

**(a) Content:**

> *"Έχουμε αναφέρει αρκετές φορές τη **conjugate symmetry**: όταν το σήμα $x(t)$ είναι real-valued, το φάσμα $X(f)$ έχει την ιδιότητα:*
>
> *$$\boxed{X(-f) = X^*(f) \quad \text{για real } x(t)}$$*
>
> ***Απόδειξη.** Από τον ορισμό:*
>
> *$$X(f) = \int x(t)\, e^{-j 2\pi f t}\, dt$$*
>
> *Παίρνοντας τον συζυγή και χρησιμοποιώντας τις [ιδιότητες του συζυγή](/reference/complex-numbers#section-5):*
>
> *$$X^*(f) = \int x^*(t)\, e^{+j 2\pi f t}\, dt = \int x(t)\, e^{+j 2\pi f t}\, dt = X(-f)$$*
>
> *όπου χρησιμοποιήσαμε ότι $x^*(t) = x(t)$ αφού το $x$ είναι real.*
>
> ***Συνέπειες:**
>
> *- Το **μέτρο** $|X(f)|$ είναι **άρτια συνάρτηση**: $|X(-f)| = |X(f)|$. Συμμετρικό φάσμα πλάτους.*
> *- Η **φάση** $\angle X(f)$ είναι **περιττή συνάρτηση**: $\angle X(-f) = -\angle X(f)$. Αντισυμμετρικό φάσμα φάσης.*
>
> ***Άρα σε διαγράμματα φάσματος για real signals συχνά σχεδιάζουμε μόνο το θετικό μισό** — το αρνητικό είναι καθρεπτικό αντίγραφο.*
>
> ***🎯 Κλείνει υποσχέσεις:** από το κεφάλαιο των συστημάτων (που χρησιμοποιήσαμε αυτή την ιδιότητα στην απόδειξη της eigenfunction property), και από το κεφάλαιο των σειρών Fourier (που είδαμε ίδιο pattern στα διακριτά $a_k$).*"*

**(b) How:**

Now that we have the FT formula in hand, this proof is one line. *Way* simpler than the inline version we had to do in systems chapter. Highlights the value of having the right tool.

---

### 9. Parseval και Energy Spectral Density

**(a) Content:**

> *"Το **θεώρημα Parseval** λέει ότι η ενέργεια του σήματος είναι **η ίδια** στους δύο τομείς:*
>
> *$$\boxed{E_x = \int_{-\infty}^{\infty} |x(t)|^2\, dt = \int_{-\infty}^{\infty} |X(f)|^2\, df}$$*
>
> *Δηλαδή, αν ολοκληρώσεις το $|x(t)|^2$ στον χρόνο, παίρνεις την ίδια τιμή με το $|X(f)|^2$ στη συχνότητα.*
>
> ***Energy Spectral Density (ESD):** η ποσότητα $|X(f)|^2$ ονομάζεται **φασματική πυκνότητα ενέργειας** (energy spectral density). Λέει «πόση ενέργεια ανά μονάδα συχνότητας» έχει το σήμα γύρω από κάθε $f$. Είναι μια συνεχής μη-αρνητική συνάρτηση.*
>
> ***Power Spectral Density (PSD):** για periodic ή τυχαία σήματα δεν δουλεύουμε σε όρους ενέργειας (που είναι άπειρη) αλλά σε όρους **μέσης ισχύος**. Η αντίστοιχη πυκνότητα λέγεται **φασματική πυκνότητα ισχύος** (PSD), και την συμβολίζουμε $S_x(f)$. Η πλήρης συζήτηση για PSD ζει στο [κεφάλαιο των τυχαίων διαδικασιών](/random-processes), αλλά το είδος ορισμού — «πυκνότητα ενέργειας ή ισχύος ανά συχνότητα» — είναι κοινό.*"*

**(b) How:**

Box the Parseval equation. State ESD and PSD as the spectral density family. Forward-link the proper PSD treatment to the random chapter.

---

### 10. Autocorrelation και Wiener–Khinchin (preview)

**(a) Content:**

> *"Πριν προχωρήσουμε, μια ακόμα σημαντική σύνδεση που θα μας ακολουθεί στα επόμενα κεφάλαια.*
>
> *Η **αυτοσυσχέτιση** ενός σήματος ορίζεται:*
>
> *$$R_x(\tau) = \int_{-\infty}^{\infty} x(t)\, x^*(t-\tau)\, dt$$*
>
> *Με λόγια: «πόσο μοιάζει» το σήμα με τον εαυτό του ολισθημένο κατά $\tau$ δευτερόλεπτα. Στο $\tau = 0$ έχουμε τη μέγιστη αυτοσυσχέτιση (το σήμα ταυτίζεται με τον εαυτό του). Όσο μεγαλώνει το $\tau$, η αυτοσυσχέτιση συνήθως φθίνει.*
>
> ***Θεώρημα Wiener–Khinchin** (μέρος Α — για deterministic σήματα ενέργειας):*
>
> *$$\boxed{R_x(\tau) \overset{\mathcal{F}}{\longleftrightarrow} |X(f)|^2}$$*
>
> *Ο FT της αυτοσυσχέτισης είναι ακριβώς η Energy Spectral Density. Η απόδειξη βγαίνει σε μία γραμμή χρησιμοποιώντας 5b: $R_x(\tau) = x(\tau) * x^*(-\tau)$, οπότε ο FT είναι $X(f) \cdot X^*(f) = |X(f)|^2$.*
>
> ***Γιατί μας ενδιαφέρει:** όταν φτάσουμε σε **τυχαία** σήματα και **θόρυβο**, δεν μπορούμε να μιλήσουμε για «το $X(f)$ του σήματος» (γιατί το σήμα δεν είναι ντετερμινιστικό). Αλλά **μπορούμε** να μιλήσουμε για την αυτοσυσχέτισή του και τη φασματική του πυκνότητα ισχύος. Η σχέση Wiener–Khinchin (γενικευμένη για random signals) είναι αυτή που μας επιτρέπει να αναλύσουμε φάσματα θορύβου, σήματος ομιλίας, κ.λπ.*
>
> *(Φουλ συζήτηση στο [κεφάλαιο των τυχαίων διαδικασιών](/random-processes).)*"*

**(b) How:**

Don't go deep — just plant the seed. The autocorrelation will be central later. Here it's an FT property to be aware of.

---

### 11. Σύνδεση όλου του κεφαλαίου με το H(f) των LTI

**(a) Content:**

A summary callout that brings all threads together.

> *"Πριν κλείσουμε, ας τραβήξουμε όλα τα νήματα.*
>
> *Στο [κεφάλαιο των συστημάτων](/foundations/systems) μάθαμε:*
>
> *1. Ένα LTI σύστημα περιγράφεται από την κρουστική του απόκριση $h(t)$.*
> *2. Όταν περνάει ένα cosine συχνότητας $f_0$, βγαίνει cosine ίδιας συχνότητας με νέο πλάτος $|H(f_0)|$ και φάση $\angle H(f_0)$.*
> *3. Η συνάρτηση $H(f)$ ορίζεται από ένα ολοκλήρωμα.*
>
> ***Τώρα όλα ταιριάζουν:***
>
> *- Το ολοκλήρωμα που όρισε το $H(f)$ είναι **ακριβώς ο μετασχηματισμός Fourier της κρουστικής απόκρισης**: $H(f) = \mathcal{F}\{h(t)\}$.*
> *- Η eigenfunction property λέει ότι complex exponentials περνούν αναλλοίωτα — και το «πόσο πολλαπλασιάζονται» δίνεται από αυτό το $H(f)$.*
> *- Η σχέση $Y(f) = X(f) \cdot H(f)$ (από την 5b) μάς λέει ότι, **στο frequency domain, η ανάλυση του LTI είναι απλός πολλαπλασιασμός** — όχι ολοκλήρωμα συνέλιξης.*
>
> *Άρα ο FT είναι **το εργαλείο** που κάνει τη θεωρία LTI εύκολη. Η συνέλιξη γίνεται πολλαπλασιασμός. Οι complex exponentials γίνονται απλά νούμερα ($H(f)$ σε κάθε συχνότητα). Όλη η αυτή η αφαιρετική θεωρία γίνεται απτή.*
>
> ***Αυτή είναι η πραγματική δύναμη του Fourier για το μάθημα μας** — δεν είναι μαθηματική αφαίρεση, είναι το εργαλείο που μας δίνει την κατανόηση συστημάτων με τον πιο φυσικό τρόπο."*

**(b) How:**

This is the *payoff* paragraph. Multiple commitments closed in one synthesis. Worth real estate.

---

### 12. Σύνοψη + παραπομπές

**(a) Content:**

Quick reference table summarizing:

- Most common transform pairs (rect, triangle, δ, cos, sin, decaying exponential, gaussian) — those in the typology
- Most common properties — those in the typology
- Tags: ✓ Στο τυπολόγιο vs ✗ Πρέπει να ξέρεις απ' έξω

Plus a short paragraph on exam tips: which pairs/properties are most likely to be needed without lookup, which are always available in the typology.

---

### 13. Recap + Next up

**(a) Content:**

Three-bullet summary, then forward link.

> *"**Σύνοψη.**
>
> *- Ο **μετασχηματισμός Fourier** γενικεύει τη σειρά Fourier σε μη-periodic σήματα: το διακριτό φάσμα γίνεται συνεχές.*
> *- Έχουμε **forward** ($x(t) \to X(f)$) και **inverse** ($X(f) \to x(t)$) με συμμετρικές μορφές.*
> *- Η πιο ισχυρή ιδιότητα: **convolution στον χρόνο = multiplication στη συχνότητα** — γι' αυτό το $H(f) = \mathcal{F}\{h(t)\}$ ενός LTI συστήματος μάς δίνει $Y(f) = X(f) H(f)$.*
> *- Το **modulation theorem** δείχνει ότι πολλαπλασιασμός με cosine = ολίσθηση φάσματος. Καρδιά της AM modulation, που έρχεται.*
>
> *Επόμενο: [Bandpass signals και φίλτρα](/foundations/bandpass-filters) — από baseband σε bandpass, τι σημαίνει «ένα σήμα ζει γύρω από μια συχνότητα», και τι κάνουν τα ιδανικά φίλτρα. Είναι η τελευταία γέφυρα πριν φτάσουμε στη modulation."*

`<NextUp slug="foundations/bandpass-filters">` — *"Επόμενο: Bandpass signals και φίλτρα"*

---

## Visualizations summary

### Must-have

1. **`<PeriodToInfinity />`** — period growing, lines bunching up to continuous spectrum. Section 1. (May be reused from FS chapter if built there.)
2. **`<RectToSincViz />`** — rect width slider, sinc spectrum response. Section 4a.
3. **`<ModulationTheoremViz />`** — flagship. Carrier multiplied with baseband, see spectrum split. Section 7.
4. **`<TransformPairsGallery />`** — small carousel/grid of canonical pairs (rect, triangle, δ, cos, exp). Each shows time + frequency side by side. Section 4 (or as standalone reference).

### Should-have

5. **`<ConvolutionInFrequency />`** — show convolution of two signals in time and the multiplication of their spectra in frequency. Section 5b. Key for understanding LTI.
6. **`<TimeFrequencyDualityDemo />`** — narrow ↔ wide trade-off. Multiple presets. Section 4a / 5e.

---

## Visuals strategy

(Per appendix in `02-intro.md`.)

- All vizzes built from scratch as React/SVG/Canvas/D3
- All FT spectra computed analytically from formulas (not FFT — keeps them clean)
- For impulses in the spectrum, use an arrow/spike convention rather than a true Dirac delta (which can't be drawn). Establish convention early and use consistently.

---

## Frontmatter

```yaml
title: "Μετασχηματισμός Fourier — από διακριτό σε συνεχές φάσμα"
slug: "foundations/fourier-transform"
order: 5
prerequisites: ["foundations/signals", "foundations/systems", "foundations/fourier-series"]
examWeight: 18    # heavy — appears directly in exams via spectrum sketches, modulation, properties; also implicit in every modulation question
estimatedReadTime: 50
lastUpdated: "2026-05-XX"
```

---

## Acceptance criteria

When done:

1. ✅ All 13 sections render with content
2. ✅ All 4 must-have vizzes are functional and tested on mobile
3. ✅ The 8 commitments listed at the top of this plan are explicitly closed in the page (with "🎯 Κλείνει υπόσχεση" callouts visible to readers)
4. ✅ Sections 1, 4, 5b, 6, 7, 8, 11 all read as natural derivations, not separate facts to memorize
5. ✅ The modulation theorem (Section 7) lays groundwork that makes the AM chapter immediately accessible
6. ✅ Sections 9-10 plant seeds for the random/noise chapters without going deep (no PSD-as-random-process content here)
7. ✅ The Section 11 synthesis explicitly ties together LTI + FT + Fourier series in one paragraph
8. ✅ All transform pairs and properties tagged "✓ Στο τυπολόγιο" where applicable
9. ✅ User reviews — the "stupid student" filter passes; if anything feels like magic, fix before moving on

---

## Updates to COMMITMENTS.md

**Closes (move to "Fulfilled"):**

- "Why a pure cosine produces a single spike" — Section 4e
- "Convolution ↔ multiplication" — Section 5b
- "H(f) = FT of h(t)" — Sections 5b, 11
- "Conjugate symmetry of spectrum for real signals" — Section 8
- "Parseval for signals" — Section 9
- "Limit-of-period argument" — Section 1
- "Why even h(t) gives real H(f)" (general FT symmetry) — implicit in Section 8 (paired with the systems-page Euler argument)

**New open commitments:**

- [ ] **Sampling theorem and aliasing** — implicitly used in Section 5c (multiplication by impulse train). Target: `/sampling-adc`. Already on list.
- [ ] **Random-process PSD and generalized Wiener–Khinchin** — Section 10 plants the deterministic version, full random treatment promised. Target: `/random-processes`.
- [ ] **AM modulation built on the modulation theorem** — Section 7 promises the modulation theorem is the heart of AM. Target: `/modulation/am`. Already on list.
- [ ] **Bandpass signals and ideal filters** — implicit in this chapter; full treatment promised. Target: `/foundations/bandpass-filters`. Already on list.

---

## What is NOT in this section

- ❌ Discrete-time Fourier transform / DFT / FFT (out of scope)
- ❌ Sampling theorem (next chapter)
- ❌ Random processes / PSD for random signals (later chapter)
- ❌ Specific modulation schemes (modulation chapters)
- ❌ Detailed convergence theorems (Dirichlet) — light mention only

---

## After this is done

Next plan: `07-bandpass-filters.md` — bandpass signals, ideal filters, the bridge to modulation.
