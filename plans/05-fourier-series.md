# 05 — Foundations/Fourier Series: "Πώς φτιάχνεται ένα periodic signal από cosines"

**Goal:** Make Fourier series feel obvious, not magical. By the end the reader should:

1. Believe deeply that **any reasonable periodic signal can be written as a sum of harmonically-related cosines** (or equivalently, complex exponentials).
2. Understand **why this works** — orthogonality of harmonic exponentials lets us extract each component independently.
3. Be able to read a **spectrum** (magnitude/phase plots) and know it's just the same signal viewed differently.
4. Have computed at least one Fourier series by hand (rectangular pulse train → sinc envelope).
5. See the **bridge to the next chapter** — periodic signals → discrete spectrum, non-periodic signals → continuous spectrum (the Fourier transform).

This is the section where the time/frequency duality teased in `/intro` Section 6 finally gets its proper treatment.

---

## Closes commitments

- **"Why a pure cosine produces a single spike in the frequency domain"** — promised in `/intro` Section 6 (TimeFrequencyTeaser). Now closed: a pure cosine is the simplest possible Fourier series with one nonzero coefficient at its frequency. Section explicitly calls back to the intro teaser.

## Adds commitments

- The full Fourier *transform* — defined here only as the spectrum of a periodic signal (discrete) — gets its general treatment in `/foundations/fourier-transform`.
- Properties of Fourier series (Parseval for FS, time shift, etc.) are **deferred to the FT chapter** where the same property family is introduced more generally; we mention them only as needed.
- The relationship between **Fourier series and the eigenfunction property** of LTI systems gets its full payoff in the FT chapter when we'll see why H(f) is the FT of h(t) — but we lay the groundwork here.

---

## Source material

- Primary slides: `SE_session4_theory2_2025.pdf` slides 21-32 (analysis/synthesis, orthogonality, Fourier series equations)
- Secondary: `SE_session56_theory3_2025.pdf` slides 1-11 (recap of Fourier series, rectangular pulse worked example, square wave visualization)
- Key visuals on slides:
  - S4.21: analysis/synthesis diagram (signal → coefficients → signal)
  - S4.22: signal as linear combination of cosines + amplitude/phase spectra
  - S4.23: orthogonal vectors in 3D (motivation)
  - S4.28: harmonic exponentials are orthogonal (the engine)
  - S4.31: synthesis + analysis equations boxed
  - S56.9-10: rectangular pulse train Fourier coefficients → sinc
  - S56.11: square wave 3D visualization (time, frequency, harmonics)

---

## Where this lives on the site

Path: `/foundations/fourier-series`

Sidebar group: **Foundations → Σειρές Fourier** (right after Συστήματα, before Μετασχηματισμός Fourier)

---

## Page outline

```
1. Το ερώτημα: μπορούμε να γράψουμε ένα periodic signal από απλά κομμάτια;
2. Γιατί cosines;
3. Διαίσθηση από διανύσματα: τι σημαίνει «ορθογώνιο σύνολο»
4. Τα harmonic complex exponentials είναι ορθογώνια
5. Η σειρά Fourier — οι δύο βασικές εξισώσεις
   5a. Σύνθεση (synthesis)
   5b. Ανάλυση (analysis) και γιατί δουλεύει
   5c. Σχέση μεταξύ της cosine και της exponential μορφής
6. Φάσμα: το signal στη frequency domain
   6a. Φάσμα πλάτους
   6b. Φάσμα φάσης
   6c. Γιατί τα φάσματα είναι συμμετρικά για real signals
7. Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)
8. Flagship visualization: τετραγωνικός παλμός χτίζεται από harmonics
9. Η γέφυρα προς τον Fourier transform
10. Recap + Next up
```

---

## Detailed content per section

### 1. Το ερώτημα

**(a) Content:**

Frame the problem before the solution.

> *"Στο προηγούμενο κεφάλαιο μάθαμε ότι ένα LTI σύστημα μεταχειρίζεται **κάθε συχνότητα ξεχωριστά**: αν στείλεις ένα cosine συχνότητας $f_0$, βγαίνει cosine ίδιας συχνότητας με νέο πλάτος και φάση. Πανέμορφο, αλλά πολλά πρακτικά σήματα δεν είναι cosines.*
>
> *Παράδειγμα: ένας **τετραγωνικός παλμός** που εναλλάσσεται μεταξύ 0 και 1 με περίοδο 1 ms (δηλαδή 1 kHz). Δεν είναι cosine. Πώς υπολογίζεις τι θα κάνει το LTI σύστημα σε ένα τέτοιο σήμα;*
>
> *Η απάντηση είναι μια από τις πιο όμορφες ιδέες της επιστήμης σημάτων: **κάθε «λογικό» periodic signal μπορεί να γραφτεί σαν άθροισμα από cosines.** Και αν μπορούμε να το γράψουμε έτσι, τότε από γραμμικότητα του LTI συστήματος, η έξοδός του είναι το άθροισμα των εξόδων για κάθε cosine ξεχωριστά — και αυτές τις ξέρουμε.*
>
> *Σε αυτό το κεφάλαιο θα δούμε ποιες ακριβώς cosines χρειαζόμαστε, με ποια πλάτη/φάσεις, και γιατί δουλεύει."*

**(b) How:**

Connect to *what we just learned* — the eigenfunction property buys us a powerful tool, but only for cosines. The Fourier series is the **vehicle** that lets us apply that tool to general periodic signals.

This framing is critical: Fourier series isn't a separate topic; it's the **extension** of the eigenfunction property from "single cosine" to "any periodic signal".

**(c) Components:**

- One short paragraph
- A small visual: a square wave drawn in time domain, with a question mark over it ("πώς το κάνουμε αυτό;")

---

### 2. Γιατί cosines;

This is a quick philosophical anchor before getting into math.

**(a) Content:**

> *"Πριν δούμε **πώς**, ας ρωτήσουμε **γιατί cosines και όχι κάτι άλλο**.*
>
> *Δύο λόγοι:*
>
> *1. **Φυσική**. Στη φύση, το cosine είναι το «πιο απλό» περιοδικό σήμα. Εμφανίζεται σε εκκρεμή, ταλαντώσεις, ηλεκτρομαγνητικά κύματα — οπουδήποτε υπάρχει επιστροφή σε ισορροπία. Είναι ο φυσικός «δομικός λίθος» του περιοδικού.*
>
> *2. **Μαθηματικά**. Όπως μόλις είδαμε στο προηγούμενο κεφάλαιο, τα LTI συστήματα μεταχειρίζονται τα cosines (πιο τεχνικά: τα complex exponentials) σαν eigenfunctions — απλώς τα πολλαπλασιάζουν με ένα μιγαδικό αριθμό. Δεν αλλάζει το σχήμα τους. Αυτό **κανένα άλλο** σήμα δεν το κάνει εκτός από complex exponentials.*
>
> *Συνδυασμένα: τα cosines είναι ταυτόχρονα **φυσικός** και **μαθηματικός** δομικός λίθος για το περιοδικό. Είναι λοιπόν φυσικό να ρωτάμε «μπορώ να γράψω οποιοδήποτε periodic signal σαν συνδυασμό από cosines;» — και η απάντηση είναι ναι."*

**(b) How:**

Two reasons, two paragraphs. Don't overthink it. The reader doesn't need a deep philosophical argument — just a sense that picking cosines isn't arbitrary.

---

### 3. Διαίσθηση από διανύσματα: τι σημαίνει «ορθογώνιο σύνολο»

**Critical pedagogical move:** before doing Fourier on signals, build the intuition with vectors. Students are familiar with 3D vectors and decomposition — Fourier is the same idea generalized.

**(a) Content:**

> *"Για να καταλάβεις πώς δουλεύει η σειρά Fourier, βοηθάει να σκεφτείς πρώτα **διανύσματα**.*
>
> *Στον τρισδιάστατο χώρο, κάθε σημείο μπορείς να το γράψεις σαν συνδυασμό τριών «βάσεων»:*
>
> *$$\vec{x} = c_1 \hat{i} + c_2 \hat{j} + c_3 \hat{k}$$*
>
> *όπου $\hat{i} = (1,0,0)$, $\hat{j} = (0,1,0)$, $\hat{k} = (0,0,1)$ είναι τα **unit vectors** στους τρεις άξονες.*
>
> *Δύο πράγματα κάνουν αυτή τη βάση χρήσιμη:*
>
> *- **Πληρότητα**: μπορείς να φτιάξεις *οποιοδήποτε* διάνυσμα του χώρου από αυτά τα τρία.*
> *- **Ορθογωνιότητα**: τα τρία διανύσματα είναι **κάθετα** μεταξύ τους ($\hat{i}\cdot\hat{j} = 0$ κλπ.).*
>
> *Η ορθογωνιότητα έχει μια πανέμορφη συνέπεια: αν θέλεις να βρεις τον συντελεστή $c_1$ ενός διανύσματος $\vec{x}$, **απλά πάρε το εσωτερικό γινόμενο** με το $\hat{i}$:*
>
> *$$c_1 = \vec{x} \cdot \hat{i}$$*
>
> *Το $\hat{i}$ «σαρώνει» το $\vec{x}$ και βγάζει μόνο τη συνιστώσα στον x-άξονα. Τα $c_2 \hat{j}$ και $c_3 \hat{k}$ **δεν συνεισφέρουν** στο εσωτερικό γινόμενο γιατί $\hat{j} \cdot \hat{i} = 0$ και $\hat{k} \cdot \hat{i} = 0$. **Αυτή είναι η μαγεία της ορθογωνιότητας: μπορούμε να εξάγουμε κάθε συντελεστή ξεχωριστά**, χωρίς να ανακατευόμαστε με τους άλλους.*
>
> *Η σειρά Fourier είναι **ακριβώς αυτή η ιδέα**, εφαρμοσμένη σε σήματα αντί για διανύσματα.*
>
> *Σαν αυτή την παρομοίωση θα την ξαναβρούμε:*
>
> *- **Διάνυσμα** σε 3D ↔ **σήμα** στο χρόνο*
> *- **Συντεταγμένες** $c_1, c_2, c_3$ ↔ **συντελεστές Fourier** $a_k$*
> *- **Unit vectors** $\hat{i}, \hat{j}, \hat{k}$ ↔ **harmonic complex exponentials** $e^{jk\omega_0 t}$*
> *- **Εσωτερικό γινόμενο** ↔ **ολοκλήρωμα του γινομένου** σε μια περίοδο*
> *- **Ορθογωνιότητα** ↔ **το ολοκλήρωμα μηδενίζεται για διαφορετικές αρμονικές***"*

**(b) How:**

This is **the most important framing of the chapter**. If the student understands "Fourier = vector decomposition with sinusoids as basis vectors", everything else falls in place.

A direct analogy table is worth real estate.

**(c) Components:**

- `<VectorDecomposition3D />` viz — interactive 3D scene, drag a vector, see its decomposition into x, y, z components. Each component highlighted with a different color. **This sets up the analogy that powers the entire chapter.**
- The analogy table, formatted as a clean reference

---

### 4. Τα harmonic complex exponentials είναι ορθογώνια

**(a) Content:**

> *"Στον κόσμο των σημάτων, το «εσωτερικό γινόμενο» δύο σημάτων $x_1(t)$ και $x_2(t)$ ορίζεται ως:*
>
> *$$\langle x_1, x_2 \rangle = \int_0^T x_1(t)\, x_2^*(t)\, dt$$*
>
> *(Ο συζυγής στο $x_2$ είναι εκεί για να τα κάνει συνεπή με μιγαδικά σήματα — αν τα σήματα είναι real, ο συζυγής δεν αλλάζει τίποτα.)*
>
> *Δύο σήματα είναι **ορθογώνια** αν αυτό το ολοκλήρωμα είναι μηδέν.*
>
> ***Ο πανέμορφος υπολογισμός:** πάρε δύο complex exponentials με συχνότητες που είναι ακέραια πολλαπλάσια του ίδιου $\omega_0 = 2\pi/T$:*
>
> *$$\langle e^{jk\omega_0 t}, e^{jm\omega_0 t} \rangle = \int_0^T e^{jk\omega_0 t}\, e^{-jm\omega_0 t}\, dt = \int_0^T e^{j(k-m)\omega_0 t}\, dt$$*
>
> *Αν $k = m$: ο integrand είναι 1, και το ολοκλήρωμα δίνει $T$.*
> *Αν $k \neq m$: ο integrand είναι ένα complex exponential με ακέραια κύκλους μέσα στο διάστημα $[0, T]$ — ολοκληρωμένο σε ολόκληρους κύκλους δίνει 0.*
>
> *Σε ένα σύμβολο:*
>
> *$$\langle e^{jk\omega_0 t}, e^{jm\omega_0 t} \rangle = T\cdot\delta_{k,m}$$*
>
> *όπου $\delta_{k,m}$ είναι το Kronecker delta: 1 αν $k=m$, 0 αλλιώς.*
>
> ***Δηλαδή τα harmonic complex exponentials σχηματίζουν ένα ορθογώνιο σύνολο** ακριβώς όπως τα $\hat{i}, \hat{j}, \hat{k}$ του 3D χώρου, μόνο που είναι άπειρα στον αριθμό (ένα για κάθε ακέραιο $k = 0, \pm 1, \pm 2, \ldots$).*
>
> *Με την ίδια λογική όπως στα διανύσματα: αν μπορούμε να **γράψουμε** ένα periodic σήμα σαν συνδυασμό από αυτές τις «βάσεις», τότε μπορούμε να **βρούμε κάθε συντελεστή** με εσωτερικό γινόμενο."*

**(b) How:**

The key insight is that the orthogonality calculation is *easy* — it's just an integral of `e^(j(k-m)ω₀t)` which integrates over whole cycles. Walk through it once carefully.

The Kronecker delta notation ($δ_{k,m}$) might be unfamiliar — flag that it's just shorthand for "1 if k=m, 0 otherwise". Don't confuse with Dirac δ.

**(c) Components:**

- A small viz: pick two values of k, watch the product `e^(j(k-m)ω₀t)` over one period and its integral. For k=m the integral is T; for k≠m it's 0. Maybe a slider for k and m, real-time integral readout.
- `<Callout type="key">` summarizing: "harmonic exponentials form an orthogonal basis for periodic signals of period T"

---

### 5. Η σειρά Fourier — οι δύο βασικές εξισώσεις

#### 5a. Σύνθεση

**(a) Content:**

> *"Με ορθογώνιο σύνολο στα χέρια μας, μπορούμε τώρα να ορίσουμε τη σειρά Fourier. Ένα periodic σήμα $x(t)$ με περίοδο $T_0$ μπορεί να γραφτεί σαν:*
>
> *$$\boxed{x(t) = \sum_{k=-\infty}^{\infty} a_k\, e^{jk\omega_0 t}}$$*
>
> *όπου $\omega_0 = 2\pi/T_0$ είναι η **θεμελιώδης γωνιακή συχνότητα**, και τα $a_k$ είναι **μιγαδικοί αριθμοί** που λέγονται **συντελεστές Fourier**.*
>
> *Αυτή λέγεται **εξίσωση σύνθεσης**: από τους συντελεστές $a_k$ μπορούμε να ξαναχτίσουμε το σήμα.*
>
> *Σημασία των $a_k$ σε πολική μορφή:*
>
> *- $|a_k|$ — **πόσο πολύ** της αρμονικής $k$ υπάρχει στο σήμα.*
> *- $\angle a_k$ — **σε ποια φάση** ξεκινάει η αρμονική $k$.*"*

#### 5b. Ανάλυση

**(a) Content:**

> *"Πώς όμως βρίσκουμε τα $a_k$ από το σήμα;*
>
> *Από την ορθογωνιότητα. Πάρε το εσωτερικό γινόμενο του $x(t)$ με το $e^{jm\omega_0 t}$:*
>
> *$$\langle x, e^{jm\omega_0 t} \rangle = \int_0^{T_0} x(t)\, e^{-jm\omega_0 t}\, dt$$*
>
> *Αντικατέστησε το $x(t)$ από τη σύνθεση:*
>
> *$$= \int_0^{T_0} \sum_k a_k e^{jk\omega_0 t}\, e^{-jm\omega_0 t}\, dt = \sum_k a_k \int_0^{T_0} e^{j(k-m)\omega_0 t}\, dt$$*
>
> *Από την ορθογωνιότητα, **όλα** τα ολοκληρώματα είναι 0 εκτός από το $k = m$, που δίνει $T_0$. Άρα μένει ένας μόνο όρος:*
>
> *$$\langle x, e^{jm\omega_0 t} \rangle = a_m \cdot T_0$$*
>
> *Λύνοντας ως προς $a_m$ (και αλλάζοντας το $m$ σε $k$ για συνέπεια):*
>
> *$$\boxed{a_k = \frac{1}{T_0}\int_0^{T_0} x(t)\, e^{-jk\omega_0 t}\, dt}$$*
>
> *Αυτή είναι η **εξίσωση ανάλυσης**: από το σήμα παίρνουμε τους συντελεστές.*
>
> *Πρόσεξε ότι το ολοκλήρωμα μπορεί να γίνει σε **οποιοδήποτε** διάστημα μήκους $T_0$ — όχι απαραίτητα από 0 έως $T_0$. Το σήμα είναι περιοδικό, οπότε όλα τα διαστήματα μήκους $T_0$ δίνουν την ίδια τιμή."*

**(b) How:**

This derivation makes the formula feel **inevitable** — it falls out of orthogonality, just like the vector decomposition. *Don't* present the synthesis and analysis equations as separate facts to memorize.

**(c) Components:**

- Both equations boxed
- `<Callout type="connection">`: *"Πρόσεξε την ομορφιά: η εξίσωση ανάλυσης είναι πανομοιότυπη με τη μορφή που είδαμε στο προηγούμενο κεφάλαιο για την $H(f)$ ενός LTI συστήματος. Δεν είναι σύμπτωση — θα δούμε γιατί στο επόμενο κεφάλαιο."*

#### 5c. Σχέση μεταξύ της cosine και της exponential μορφής

**(a) Content:**

> *"Συχνά βλέπουμε τη σειρά Fourier γραμμένη σε δύο μορφές:*
>
> ***Μιγαδική μορφή (αυτή που μόλις δείξαμε):***
>
> *$$x(t) = \sum_{k=-\infty}^{\infty} a_k\, e^{jk\omega_0 t}$$*
>
> ***Πραγματική (cosine) μορφή:***
>
> *$$x(t) = A_0 + \sum_{k=1}^{\infty} A_k\, \cos(k\omega_0 t + \phi_k)$$*
>
> *Οι δύο είναι ισοδύναμες για real signals. Από Euler και τη συζυγή συμμετρία ($a_{-k} = a_k^*$ για real signals — δες παρακάτω), παίρνουμε:*
>
> *- $A_0 = a_0$ (η DC συνιστώσα — μέσος όρος του σήματος σε μια περίοδο)*
> *- $A_k = 2|a_k|$ για $k \geq 1$ (το πλάτος της k-ης αρμονικής)*
> *- $\phi_k = \angle a_k$ (η φάση της k-ης αρμονικής)*
>
> *Σε αυτό το κεφάλαιο θα χρησιμοποιούμε κυρίως τη **μιγαδική μορφή** γιατί τα ολοκληρώματα είναι πιο καθαρά. Αλλά να ξέρεις και τις δύο — εμφανίζονται και οι δύο σε exam προβλήματα και σε τυπολόγια."*

**(b) How:**

Don't dwell. Most students will see the complex form everywhere; the real form they'll encounter occasionally. The conversion table is enough.

---

### 6. Φάσμα: το signal στη frequency domain

This is where we cash in the time-frequency duality teased back in the intro.

#### 6a. Φάσμα πλάτους

**(a) Content:**

> *"Κάθε συντελεστής $a_k$ είναι μιγαδικός με μέτρο $|a_k|$ και φάση $\angle a_k$. Αν τα γράψουμε σε ένα διάγραμμα ως προς **τη συχνότητα** $f = k f_0 = k/T_0$, παίρνουμε δύο plots:*
>
> *- **Φάσμα πλάτους** (amplitude spectrum): $|a_k|$ έναντι $f$. Διακριτές γραμμές μόνο σε ακέραια πολλαπλάσια του $f_0$.*
> *- **Φάσμα φάσης** (phase spectrum): $\angle a_k$ έναντι $f$. Επίσης διακριτές γραμμές.*
>
> *Δύο πράγματα να προσέξεις αμέσως:*
>
> *1. Το φάσμα είναι **discrete** (διακριτό): σπικς μόνο σε $0, \pm f_0, \pm 2f_0, \ldots$. Δεν υπάρχει σήμα μεταξύ των αρμονικών. Αυτό είναι φυσικό: ένα periodic σήμα έχει μόνο αρμονικά συσχετισμένες συχνότητες.*
> *2. Το φάσμα έχει **και αρνητικές συχνότητες**. Αυτό προκύπτει μαθηματικά από την exponential μορφή — το $e^{j2\pi f t}$ και το $e^{-j2\pi f t}$ μαζί κάνουν ένα cosine. Δεν υπάρχει «αρνητική φυσική συχνότητα», απλά ένας μαθηματικός λογαριασμός."*

#### 6b. Φάσμα φάσης

**(a) Content:**

> *"Το φάσμα φάσης είναι λιγότερο διαισθητικό αλλά εξίσου σημαντικό. Λέει «πότε ξεκινάει» κάθε αρμονική στο σήμα.*
>
> *- Αν όλες οι φάσεις είναι 0, οι αρμονικές «ευθυγραμμίζονται» και πετυχαίνουν peak μαζί στο $t=0$.*
> *- Αν οι φάσεις διαφέρουν, οι αρμονικές δεν ευθυγραμμίζονται, και το σχήμα του σήματος αλλάζει — ακόμα και αν τα πλάτη παραμένουν τα ίδια.*
>
> *Αυτό είναι κρίσιμο για να καταλάβεις γιατί το **φάσμα φάσης δεν είναι "λιγότερο σημαντικό" από το φάσμα πλάτους** — αλλάζοντας μόνο τις φάσεις, μπορείς να μετατρέψεις ένα τετράγωνο σε σχεδόν τίποτα."*

#### 6c. Γιατί τα φάσματα είναι συμμετρικά για real signals

**(a) Content:**

> *"Παρατήρησε στους τύπους του φάσματος μια συμμετρία που εμφανίζεται όταν το σήμα είναι **real**:*
>
> *- Το **φάσμα πλάτους** $|a_k|$ είναι **άρτια** συνάρτηση: $|a_{-k}| = |a_k|$.*
> *- Το **φάσμα φάσης** $\angle a_k$ είναι **περιττή** συνάρτηση: $\angle a_{-k} = -\angle a_k$.*
>
> *Δηλαδή τα πλάτη είναι κατοπτρικά και οι φάσεις αντισυμμετρικά γύρω από το $f=0$.*
>
> *Αυτό προκύπτει από την ιδιότητα **conjugate symmetry**: για real $x(t)$, ισχύει $a_{-k} = a_k^*$. Ο συζυγής σημαίνει ίδιο μέτρο, αντίθετη φάση — εξ ου η συμμετρία.*
>
> *Γι' αυτό σε πολλά διαγράμματα φάσματος **σχεδιάζουμε μόνο το θετικό μισό** — το αρνητικό μισό είναι απλά ο μιγαδικός συζυγής. Δεν χάνουμε πληροφορία.*
>
> *(Forward link: αυτή η συμμετρία είναι ειδική περίπτωση μιας γενικότερης ιδιότητας του [μετασχηματισμού Fourier](/foundations/fourier-transform) που θα δούμε στο επόμενο κεφάλαιο.)"*

**(b) How:**

Don't prove this here — just state it and forward-link. The proof belongs with the FT chapter where we'll have the general FT property to use.

**(c) Components for section 6 overall:**

- `<SpectrumViewer />` — given a signal (preset choices: cosine, sum of two cosines, square wave, sawtooth), show its time-domain plot side-by-side with its amplitude and phase spectra. Toggle to highlight the symmetry. Key lesson: students see that **periodic = discrete spectrum**.

---

### 7. Παράδειγμα: rectangular pulse train (η εμφάνιση του sinc)

This is the canonical worked example. Important because:
- The result (`a_k = ½·sinc(k/2)`) introduces the sinc function in a context where it makes sense
- Foreshadows the FT chapter (where rectangle ↔ sinc becomes a key transform pair)
- Builds confidence: students see a concrete computation done

**(a) Content:**

> *"Ας υπολογίσουμε τη σειρά Fourier ενός **τετραγωνικού παλμικού σήματος** (square wave 50% duty cycle):*
>
> *$$x(t) = \begin{cases} 1 & |t| < T_0/4 \\ 0 & T_0/4 < |t| < T_0/2 \end{cases}$$*
>
> *και περιοδικό με περίοδο $T_0$.*
>
> *Από την εξίσωση ανάλυσης:*
>
> *$$a_k = \frac{1}{T_0}\int_{-T_0/2}^{T_0/2} x(t)\, e^{-jk\omega_0 t}\, dt$$*
>
> *Επειδή το $x(t)$ είναι μη μηδενικό μόνο για $|t| < T_0/4$, το ολοκλήρωμα μειώνεται σε:*
>
> *$$a_k = \frac{1}{T_0}\int_{-T_0/4}^{T_0/4} e^{-jk\omega_0 t}\, dt$$*
>
> *Από Euler, $e^{-jk\omega_0 t} = \cos(k\omega_0 t) - j\sin(k\omega_0 t)$. Το integrand $\cos$ είναι άρτια, το $\sin$ περιττή — και τα όρια είναι συμμετρικά. Άρα το integrand $\sin$ μηδενίζεται και μένει:*
>
> *$$a_k = \frac{1}{T_0}\int_{-T_0/4}^{T_0/4} \cos(k\omega_0 t)\, dt = \frac{1}{T_0} \cdot \left[\frac{\sin(k\omega_0 t)}{k\omega_0}\right]_{-T_0/4}^{T_0/4}$$*
>
> *Με $\omega_0 = 2\pi/T_0$, το $k\omega_0 \cdot T_0/4 = k\pi/2$:*
>
> *$$a_k = \frac{1}{T_0} \cdot \frac{2\sin(k\pi/2)}{k\omega_0} = \frac{\sin(k\pi/2)}{k\pi}$$*
>
> *Παρατηρώντας ότι $\frac{\sin(k\pi/2)}{k\pi/2} = \mathrm{sinc}(k/2)$ (όπου $\mathrm{sinc}(x) = \sin(\pi x)/(\pi x)$), παίρνουμε:*
>
> *$$\boxed{a_k = \frac{1}{2}\mathrm{sinc}(k/2)}$$*
>
> *Σχόλια στο αποτέλεσμα:*
>
> *- $a_0 = 1/2$. Λογικό: ο παλμός είναι 1 για το μισό της περιόδου και 0 για το άλλο μισό, άρα ο μέσος όρος του είναι 1/2.*
> *- $a_k = 0$ για άρτια $k \neq 0$ (γιατί το $\mathrm{sinc}$ μηδενίζεται σε ακέραια non-zero values).*
> *- $|a_k|$ φθίνει σαν $1/k$ για περιττά $k$ — οι αρμονικές γίνονται πιο αδύνατες όσο αυξάνεται η συχνότητα.*
>
> *Η περιβάλλουσα είναι το $\mathrm{sinc}$. **Αυτή είναι η πρώτη φορά που ένα periodic σήμα στο χρόνο δίνει sinc στο φάσμα, και δεν θα είναι η τελευταία.** Στο επόμενο κεφάλαιο θα δούμε ότι rectangular pulse ↔ sinc είναι ένα από τα πιο σημαντικά Fourier transform pairs."*

**(b) How:**

Walk through the integral step-by-step. The even/odd argument that kills the sin term is non-obvious and worth flagging — students often don't see it.

The closing observation about sinc reappearing in FT is a deliberate forward link.

**(c) Components:**

- `<RectangularPulseFourier />` viz: shows the time-domain pulse, the discrete spectrum with sinc envelope highlighted, and a toggle to show the partial sum reconstruction with N harmonics.

---

### 8. Flagship visualization: τετραγωνικός παλμός χτίζεται από harmonics

**(a) Content:**

> *"Είναι ώρα για το πιο όμορφο visualization αυτού του κεφαλαίου: να δούμε **έναν τετραγωνικό παλμό να χτίζεται μπροστά στα μάτια μας**, αρμονική μετά από αρμονική.*
>
> *Στο παρακάτω demo ξεκινάς με 0 αρμονικές (μόνο τη DC συνιστώσα) και προσθέτεις σταδιακά 1, 3, 5, 7, ... αρμονικές. Παρατήρησε:*
>
> *1. Με την 1η αρμονική (το $f_0$ μόνο), παίρνουμε ένα cosine. Όχι τετράγωνο, αλλά αρχίζει να μυρίζει σωστά.*
> *2. Προσθέτοντας περιττές αρμονικές, οι ακμές γίνονται πιο απότομες και τα οριζόντια μέρη πιο επίπεδα.*
> *3. Με 50 αρμονικές, το αποτέλεσμα είναι σχεδόν τέλειο τετράγωνο — εκτός από κάτι μικρά «αυτάκια» (Gibbs phenomenon) στις άκρες, που δεν φεύγουν ποτέ τελείως αλλά γίνονται πιο στενά.*
>
> *Το να δεις αυτό δουλεύοντας **κάνει τη σειρά Fourier ξαφνικά απτή** — δεν είναι αφηρημένο μαθηματικό αξίωμα, είναι ένας τρόπος να συνθέσεις σήματα από μέσα προς τα έξω."*

**(b) How:**

This is *the* viz of the chapter. Spend real effort.

**(c) Components:**

- `<SquareWaveBuilder />` flagship viz. Specs:
  - Three synced views (inspired by the lecture's S56.11 slide):
    1. **Time domain** — the partial sum as a function of t, animating in as the user adds harmonics
    2. **Frequency spectrum** — discrete amplitude spectrum showing the $|a_k|$ values; harmonics that are "active" (included in the sum) are highlighted, others greyed
    3. **3D combined view** (optional, can be flat 2D if 3D is too heavy) — each harmonic drawn as its own waveform stacked, summing visually toward the result
  - Slider or number input for "number of harmonics included" (1, 3, 5, ..., up to ~50)
  - Play button: animates from N=0 to N=50
  - Highlight Gibbs phenomenon at high N — small inline note explaining what those persistent overshoots are
  - Mobile: stack vertically; the 3D view becomes optional

---

### 9. Η γέφυρα προς τον Fourier transform

**(a) Content:**

> *"Η σειρά Fourier δουλεύει για **periodic** σήματα. Αλλά τα πιο πολλά σήματα στην πράξη — μια εκφώνηση, ένας παλμός, μια μετάδοση δεδομένων — **δεν είναι** ακριβώς periodic.*
>
> *Τι γίνεται τότε;*
>
> ***Ιδέα:** ένα μη-περιοδικό σήμα μπορούμε να το σκεφτούμε σαν περιοδικό με **άπειρη** περίοδο. Καθώς το $T_0 \to \infty$:*
>
> *- Η θεμελιώδης συχνότητα $f_0 = 1/T_0 \to 0$.*
> *- Οι αρμονικές $kf_0$ έρχονται ολοένα και πιο κοντά μεταξύ τους.*
> *- Το **διακριτό φάσμα** γίνεται **συνεχές**.*
>
> *Στο όριο, το άθροισμα της σειράς Fourier γίνεται ολοκλήρωμα, και τα διακριτά $a_k$ γίνονται μια **συνεχής συνάρτηση συχνότητας**: ο **μετασχηματισμός Fourier** $X(f)$.*
>
> *Αυτό είναι το αντικείμενο του [επόμενου κεφαλαίου](/foundations/fourier-transform): η γενίκευση της Fourier ανάλυσης από periodic σε **οποιοδήποτε** σήμα. Και θα δούμε ότι η περίφημη $H(f)$ ενός LTI συστήματος, που εμφανίστηκε στο προηγούμενο κεφάλαιο, είναι ακριβώς ο Fourier transform της κρουστικής απόκρισης $h(t)$."*

**(b) How:**

This is a foreshadowing section, not a derivation. Lay the conceptual groundwork. Don't try to prove the FT formula or anything technical — just the picture: discrete → continuous as period → ∞.

**(c) Components:**

- `<PeriodToInfinity />` — small viz showing a periodic signal's spectrum. As the period grows, the spectrum lines get denser. In the limit, they merge into a continuous curve.

---

### 10. Recap + Next up

**(a) Content:**

> *"**Σύνοψη.**
>
> *Ένα periodic σήμα μπορεί να γραφτεί σαν **άθροισμα από αρμονικά συσχετισμένες complex exponentials** (ή ισοδύναμα, cosines):*
>
> *$$x(t) = \sum_k a_k\, e^{jk\omega_0 t}$$*
>
> *με συντελεστές που εξάγονται από:*
>
> *$$a_k = \frac{1}{T_0}\int_{T_0} x(t)\, e^{-jk\omega_0 t}\, dt$$*
>
> *Το **φάσμα** του σήματος είναι το σύνολο των $a_k$ — διακριτό για periodic σήματα, με αρμονικές μόνο σε $kf_0$.*
>
> *Πίσω από το όλο το πράγμα: η **ορθογωνιότητα** των harmonic exponentials, που μας επιτρέπει να εξάγουμε κάθε συντελεστή ξεχωριστά — όπως ακριβώς εξάγουμε τις συντεταγμένες ενός 3D διανύσματος μέσω εσωτερικού γινομένου με τα unit vectors.*
>
> *Στο επόμενο κεφάλαιο: γενίκευση σε **μη-περιοδικά** σήματα, ο μετασχηματισμός Fourier, και η σύνδεσή του με την κρουστική απόκριση των LTI συστημάτων."*
>
> `<NextUp slug="foundations/fourier-transform">` — *"Επόμενο: Μετασχηματισμός Fourier — από διακριτό σε συνεχές φάσμα"*

---

## Visualizations summary

### Must-have (load-bearing)

1. **`<VectorDecomposition3D />`** — 3D vector decomposition with orthogonal basis. Section 3. Sets up the analogy.
2. **`<SpectrumViewer />`** — signal in time + amplitude spectrum + phase spectrum. Section 6.
3. **`<RectangularPulseFourier />`** — pulse train + spectrum + partial sum reconstruction. Section 7.
4. **`<SquareWaveBuilder />`** — flagship 3-view viz of harmonic buildup. Section 8.

### Should-have

5. **`<HarmonicOrthogonalityCheck />`** — pick k, m; see the integral of `e^(j(k-m)ω₀t)`. Section 4.
6. **`<PeriodToInfinity />`** — period growing, spectrum lines merging. Section 9.

---

## Visuals strategy

(Per the appendix in `02-intro.md`.)

- All vizzes built from scratch as React/SVG/Canvas/D3
- Spectra computed from explicit formulas (not from FFT — at this point students don't need numerical artifacts)
- No external assets needed for this section

---

## Frontmatter

```yaml
title: "Σειρές Fourier — periodic signals από cosines"
slug: "foundations/fourier-series"
order: 4
prerequisites: ["intro", "foundations/signals", "foundations/systems"]
examWeight: 12          # foundational; appears in True/False, sets up FT and modulation
estimatedReadTime: 35
lastUpdated: "2026-05-XX"
```

---

## Acceptance criteria

When done:

1. ✅ All 10 numbered sections render with content
2. ✅ All 4 must-have vizzes are functional and tested on mobile
3. ✅ The vector-decomposition analogy (Section 3) is set up before any signal math, with the analogy table visible
4. ✅ The orthogonality argument (Section 4) is concrete, not waved at
5. ✅ Both synthesis and analysis equations are derived (analysis falls out of orthogonality), not just stated
6. ✅ The rectangular pulse worked example (Section 7) is complete with sinc result and three observations
7. ✅ The flagship `<SquareWaveBuilder />` viz includes time, spectrum, and (ideally) 3D combined views, with N-harmonic slider and Gibbs phenomenon flagged
8. ✅ The intro page commitment ("why pure cosine = single spike") is closed with an explicit back-reference
9. ✅ Forward link to FT chapter for: conjugate symmetry of spectra (Section 6c), the limit-of-period argument (Section 9), the connection between H(f) and FT (Section 5b callout, Section 9 closing)
10. ✅ User reviews — the "stupid student" filter passes; if it doesn't, fix before moving on

---

## Updates to COMMITMENTS.md

**Closes (move to "Fulfilled"):**
- "Why a pure cosine produces a single spike in the frequency domain" (from /intro Section 6) — now closed with explicit back-reference in Section 6 of this page

**New open commitments:**
- [ ] **Limit-of-period argument formalized** — Section 9 of this page promises `T₀ → ∞` gives the Fourier transform. Target: `/foundations/fourier-transform`.
- [ ] **Conjugate symmetry of spectrum for real signals (general FT property)** — Section 6c states without proof. Target: `/foundations/fourier-transform`.
- [ ] **Why H(f) of an LTI system is the FT of h(t)** — Section 5b callout teases the connection. Target: `/foundations/fourier-transform`.

(The last one merges with the existing commitment about FT properties, already on the list.)

---

## What is NOT in this section

- ❌ The Fourier transform itself (next section)
- ❌ Properties of Fourier series beyond what we used (defer to FT chapter)
- ❌ Discrete-time Fourier series / DFT (out of scope for this course)
- ❌ Convergence/Dirichlet conditions (mention only briefly if at all — not exam material)
- ❌ Parseval for FS (defer to FT chapter where we'll cover the general version)

---

## After this is done

Next plan: `06-fourier-transform.md` — generalize from periodic to arbitrary signals. The discrete spectrum becomes continuous. We finally name H(f) as the FT of h(t), prove conjugate symmetry, walk through key transform pairs, modulation theorem, Parseval.
