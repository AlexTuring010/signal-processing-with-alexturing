# 04e — Rebuild: Eigenfunction section in /foundations/systems

**This is a rebuild, not a retrofit.** The eigenfunction section in `/foundations/systems` (Section 7) has accumulated patches over multiple review iterations and now reads as a Frankenstein: defensive clarifications, mid-derivation detours, and an unanswered foundational question — *"what does it even mean to send a complex exponential through a microphone?"* — silently sitting underneath everything.

Rather than patch further, we **delete the existing Section 7 entirely and write it from scratch** with three principles:

1. **Real cosines are the main character.** Real signals — physical things you can record with a microphone or transmit over an antenna — are what the student cares about. The math is in service of explaining what happens to *them*.
2. **Complex exponentials are introduced honestly as a mathematical tool**, not pretended to be physical signals. The student is told upfront: these don't exist physically, but they let us do the math much more easily, so we use them as a probe.
3. **The rigorous derivation is tucked away** for curious readers. The main flow shows the result with intuition and a viz; the derivation is collapsible.

---

## What we're removing

The entire current Section 7, which includes:
- Original eigenfunction proof (currently leads the section)
- "Από complex exponentials σε real cosines" + the four-step derivation including conjugate symmetry
- "Πώς υπολογίζω H(f₀)" with delay example
- "Ειδική περίπτωση: όταν H(f₀) είναι πραγματικός" subsection (including the even-h argument)
- All forward-link spoilers about the FT chapter being a continuation
- Various inline callouts ("Quick recap από Φάση", "Μην σε τρομάζουν τα μιγαδικά στη μέση", etc.)

Some of this content survives in the rebuild — but reorganized, retold, and only what fits the new frame. The conjugate-symmetry detour is removed from this section entirely (deferred to FT chapter — see COMMITMENTS update at end of plan).

---

## What we're keeping (still useful)

- The interactive viz `<EigenfunctionDemo />` that lets the student sweep frequency and watch `|H(f)|` and `∠H(f)` curves form. Excellent component, no changes needed beyond what's described below.
- The pure-delay worked example (`h(t) = δ(t-t_d) ⇒ H(f) = e^(-j2πft_d)`) — but moved to a different role in the new flow.
- The closing punchline "ένα LTI σύστημα δεν δημιουργεί ποτέ νέες συχνότητες" — still the right ending.

---

## New section structure

```
Section 7. Πώς συμπεριφέρεται ένα LTI σύστημα σε cosines

7.1 Το ερώτημα
7.2 Ένα μαθηματικό κόλπο που θα μας λύσει τα χέρια
7.3 Το αποτέλεσμα: τι κάνει ένα LTI σε ένα cosine
7.4 Τι λέει ο μιγαδικός αριθμός H(f₀);
7.5 Παράδειγμα: το σύστημα καθαρής καθυστέρησης
7.6 Eigenfunction, και γιατί λέγεται έτσι
7.7 Recap (κλείνει σε «δεν δημιουργούνται νέες συχνότητες»)

[Εμφυτευμένο: η συνηθισμένη απόδειξη — collapsible]
```

---

## Detailed content per subsection

### 7.1 Το ερώτημα

**(a) Content:**

Frame it crisply. We just learned that an LTI system is fully described by its impulse response `h(t)`, and the output for any input is `y(t) = x(t) * h(t)`. But convolution is a heavy operation. Computing it for every input we care about would be miserable.

Question: is there a *class of signals* for which the input-output relationship is dramatically simpler — no integrals, just multiplication?

Answer: yes, **cosines**. And the simplification is so beautiful it tells us something deep about LTI systems.

**(b) How:**

One short paragraph. State the question. Promise the answer. No math yet.

---

### 7.2 Ένα μαθηματικό κόλπο που θα μας λύσει τα χέρια

This is the crucial reframing. We confront the "complex exponentials don't exist physically" issue head-on, before any formula.

**(a) Content:**

> *"Πριν προχωρήσουμε, χρειαζόμαστε ένα μαθηματικό εργαλείο. Από Euler ξέρουμε ότι:*
>
> *$$\cos(2\pi f_0 t) = \tfrac{1}{2}e^{j 2\pi f_0 t} + \tfrac{1}{2}e^{-j 2\pi f_0 t}$$*
>
> *Δηλαδή κάθε cosine μπορεί να **γραφτεί** σαν άθροισμα δύο complex exponentials σε συχνότητες $+f_0$ και $-f_0$.*
>
> ***Σημαντική διευκρίνηση:** ένα complex exponential **δεν υπάρχει στον φυσικό κόσμο**. Δεν μπορείς να στείλεις ένα $e^{j 2\pi f_0 t}$ σε ένα μικρόφωνο ή σε μια κεραία· φανταστικοί αριθμοί δεν είναι πράγματα που μετριούνται σε volts. Το cosine, αντίθετα, είναι πραγματικό σήμα — και αυτό είναι που πραγματικά δίνουμε στο σύστημα.*
>
> *Όμως **μαθηματικά** μπορούμε να γράψουμε το cosine έτσι. Και επειδή το LTI σύστημα είναι **γραμμικό**, μπορούμε να αναλύσουμε **ξεχωριστά** τι κάνει σε καθένα από τα δύο complex exponentials, και μετά να τα προσθέσουμε. Δεν αλλάζουμε το σήμα — απλώς αλλάζουμε **πώς το γράφουμε** για να μας βολεύει στους υπολογισμούς. Στο τέλος όλα τα μιγαδικά κομμάτια θα ξανασυναντηθούν και θα μας δώσουν πραγματικό αποτέλεσμα — γιατί η είσοδος ήταν εξαρχής πραγματική.*
>
> *Με άλλα λόγια: τα complex exponentials είναι **μαθηματικός φακός** μέσω του οποίου παρατηρούμε ένα φυσικό σήμα. Όχι σήμα από μόνα τους."*

**(b) How:**

This subsection is a *philosophical anchor*. Three short paragraphs. No derivation yet. The reader should walk away knowing:

- Cosines are real and physical.
- Complex exponentials are imaginary/mathematical.
- We can rewrite cosines using complex exponentials because of Euler.
- We do this **only** because the math becomes easier.

The metaphor "μαθηματικός φακός" or "τηλεσκόπιο" (telescope) is worth using — students get analogies.

**(c) Components:**

- A `<Callout type="key">` with the headline: *"Complex exponentials = εργαλείο. Cosines = σήμα."* (or similar punchy phrasing)
- No new viz. Pure prose.

---

### 7.3 Το αποτέλεσμα: τι κάνει ένα LTI σε ένα cosine

This is the **headline result**. State it before deriving it.

**(a) Content:**

> *"Με αυτή την οπτική, μπορούμε να πούμε τι παθαίνει ένα cosine περνώντας από LTI σύστημα. Το αποτέλεσμα είναι το εξής: αν στείλεις στην είσοδο ένα cosine συχνότητας $f_0$:*
>
> *$$x(t) = \cos(2\pi f_0 t)$$*
>
> *η έξοδος θα είναι **πάλι ένα cosine της ίδιας συχνότητας**, απλά με νέο πλάτος και νέα φάση:*
>
> *$$\boxed{y(t) = |H(f_0)|\,\cos\!\big(2\pi f_0 t + \angle H(f_0)\big)}$$*
>
> *όπου $H(f_0)$ είναι ένας μιγαδικός αριθμός που εξαρτάται από:*
>
> *(α) **το σύστημα** (συγκεκριμένα την κρουστική του απόκριση $h(t)$),*
> *(β) **τη συχνότητα** $f_0$ που τον υπολογίζουμε.*
>
> *Συγκεκριμένα ορίζεται από το ολοκλήρωμα:*
>
> *$$H(f_0) = \int_{-\infty}^{\infty} h(\tau)\, e^{-j 2\pi f_0 \tau}\, d\tau$$*
>
> *Δεν θα υπολογίσουμε αυτό το ολοκλήρωμα ακόμα — αυτή είναι δουλειά του [επόμενου κεφαλαίου](/foundations/fourier-transform). Σε αυτή τη σελίδα, μας αρκεί να ξέρουμε ότι **κάθε LTI σύστημα έχει ένα τέτοιο H(f) — μια συνάρτηση που μας λέει τι κάνει σε κάθε συχνότητα**."*

**(b) How:**

Lead with the boxed result. State the formula for `H(f₀)` afterward, but *defuse it* — the student doesn't need to compute it; they need to know it exists and have intuition for what it means.

**(c) Components:**

- The boxed `y(t) = |H(f₀)|·cos(...)` equation.
- The defining integral, but with explicit "we won't compute this here" framing.
- An "Απόδειξη" expandable that contains the full four-step derivation. See "Tucked derivation" section below for content.

---

### 7.4 Τι λέει ο μιγαδικός αριθμός H(f₀);

This is where `H(f₀)` becomes concrete. Two pieces of information packed into one symbol.

**(a) Content:**

> *"Ο $H(f_0)$ είναι μιγαδικός. Σε πολική μορφή τον γράφουμε:*
>
> *$$H(f_0) = |H(f_0)|\, e^{j\angle H(f_0)}$$*
>
> *Πακετάρει **δύο ξεχωριστές πληροφορίες** για το πώς το σύστημα μεταχειρίζεται τη συχνότητα $f_0$:*
>
> *- Το **μέτρο** $|H(f_0)|$ → πόσο **ενισχύει ή εξασθενεί** το πλάτος του cosine στη συχνότητα αυτή.*
> *- Η **φάση** $\angle H(f_0)$ → πόσο **μετατοπίζει χρονικά** το cosine. Φάση σε rad ↔ time shift, μέσω της σχέσης από [εδώ](/foundations/signals#phase): $t_0 = -\angle H(f_0) / (2\pi f_0)$.*
>
> *Όταν λοιπόν ρωτάμε «τι κάνει αυτό το σύστημα στη συχνότητα $f_0$;» η απάντηση είναι ακριβώς **αυτά τα δύο νούμερα** — κανένα παραπάνω, κανένα λιγότερο.*
>
> *Διαφορετικές συχνότητες παίρνουν πιθανώς διαφορετικά $|H|$ και $\angle H$. Συνολικά η συνάρτηση $H(f)$ μας λέει «τι κάνει το σύστημα **συχνότητα προς συχνότητα**». Αυτή είναι το **frequency response** του συστήματος."*

**(b) How:**

Frame `H(f₀)` as **two-numbers-in-one**. This destigmatizes the complex number. Once they internalize this, the special cases (positive, negative, zero `H`) stop being arbitrary rules.

Add right after a `<Callout type="intuition">`:

> *"Αν θες ένα mental model: $H(f_0)$ είναι σαν ένα **κουπόνι** που λέει «αυτή τη συχνότητα την πειράζω έτσι κι έτσι». Διαφορετικές συχνότητες, διαφορετικά κουπόνια. Όλο μαζί το $H(f)$ είναι ένας πλήρης κατάλογος του τι κάνει το σύστημα σε κάθε συχνότητα."*

**(c) Components:**

- The `<EigenfunctionDemo />` viz lives **here**. Sweep `f₀`, watch input cosine + output cosine, plus the magnitude and phase curves of `H(f)` getting traced out. This is the moment where it all clicks.

The viz already exists — keep it as-is. No bug fixes needed beyond what was already addressed. The viz placement is critical: right after this paragraph, *not* at the end of the section, because *this* is where its purpose lands.

---

### 7.5 Παράδειγμα: το σύστημα καθαρής καθυστέρησης

A concrete example to make `H(f)` feel like a real object you can compute, not a vapor.

**(a) Content:**

> *"Ένα παράδειγμα όπου το $H(f)$ μπορούμε να το βρούμε εύκολα. Πάρε το **σύστημα καθαρής καθυστέρησης**: ό,τι μπει στην είσοδο, βγαίνει στην έξοδο μετά από $t_d$ δευτερόλεπτα.*
>
> *$$y(t) = x(t - t_d)$$*
>
> *Η κρουστική απόκριση είναι $h(t) = \delta(t - t_d)$ — ένας impulse που εμφανίζεται μετά από $t_d$ δευτερόλεπτα. Υπολογίζουμε:*
>
> *$$H(f) = \int_{-\infty}^{\infty} \delta(\tau - t_d)\, e^{-j 2\pi f \tau}\, d\tau = e^{-j 2\pi f t_d}$$*
>
> *(από τη σαρωτική ιδιότητα της δ).*
>
> *Σε πολική μορφή:*
>
> *- $|H(f)| = 1$ για κάθε $f$ — το σύστημα δεν αλλάζει το πλάτος καμίας συχνότητας. Λογικό: μια καθυστέρηση δεν εξασθενεί τίποτα.*
> *- $\angle H(f) = -2\pi f t_d$ — γραμμική φάση ως προς $f$. Από τη [σχέση φάσης ↔ time shift](/foundations/signals#phase), αυτή ακριβώς η φάση αντιστοιχεί σε χρονική ολίσθηση κατά $t_d$ δευτερόλεπτα. **Σε όλες τις συχνότητες την ίδια.***
>
> *Αυτό είναι αυτό που περιμέναμε από ένα σύστημα καθυστέρησης: σε κάθε συχνότητα, ίδιο μέτρο 1 και ίδια χρονική καθυστέρηση. Η μαθηματική πρόβλεψη συμπίπτει με τη φυσική διαίσθηση."*

**(b) How:**

This example is now serving a clearer role: showing that `H(f)` is a *real, concrete object* you can compute for a system you understand intuitively. The math gives you something you'd already expect — that's reassuring, not surprising. *That* is the goal.

**(c) Components:**

- No new viz. The existing `<EigenfunctionDemo />` already has a "delay system" preset.
- A note that the student can use that preset to **verify** the formula they just derived. Closes the loop between math and intuition.

---

### 7.6 Eigenfunction, και γιατί λέγεται έτσι

Now we earn the eigenfunction name, *after* the student has the cosine result.

**(a) Content:**

> *"Όλη αυτή η ανάλυση κρύβει μια ωραία δομική ιδιότητα των LTI συστημάτων.*
>
> *Στην κρυφή απόδειξη παραπάνω, αυτό που πραγματικά υπολογίσαμε ήταν: **όταν περνάει ένα complex exponential** $e^{j 2\pi f_0 t}$ από LTI σύστημα, βγαίνει το **ίδιο complex exponential**, απλώς πολλαπλασιασμένο με τον αριθμό $H(f_0)$:*
>
> *$$e^{j 2\pi f_0 t}\;\longrightarrow\;H(f_0)\cdot e^{j 2\pi f_0 t}$$*
>
> *Το σχήμα δεν αλλάζει. Δεν παραμορφώνεται. Είναι σαν να «αναγνωρίζει» το σύστημα τα complex exponentials σαν δικά του προτιμώμενα σήματα — τους κάνει την **πιο ήπια δυνατή τροποποίηση**: τους πολλαπλασιάζει με μια σταθερά.*
>
> *Αυτή η ιδιότητα έχει ένα όνομα: τα complex exponentials είναι οι **eigenfunctions** των LTI συστημάτων.*
>
> *Αν έχεις δει γραμμική άλγεβρα: ένα eigenvector ενός πίνακα είναι ένα διάνυσμα που, όταν το πολλαπλασιάσεις με τον πίνακα, σου επιστρέφει το ίδιο διάνυσμα απλώς πολλαπλασιασμένο με μια σταθερά (την eigenvalue). Στα LTI συστήματα ισχύει το ακριβές ανάλογο: τα **complex exponentials** είναι οι «eigenvectors» (eigenfunctions, αφού μιλάμε για συναρτήσεις) και οι τιμές $H(f)$ είναι οι αντίστοιχες «eigenvalues».*
>
> *Πρακτικά τι σημαίνει αυτό για εμάς; Ότι **κάθε φορά που μπορούμε να γράψουμε ένα σήμα σαν συνδυασμό από complex exponentials, η ανάλυση του LTI απλοποιείται δραματικά** — γιατί κάθε exponential ταξιδεύει ανεξάρτητα και απλώς ζυγίζεται κατά $H$. Αυτή είναι η βαθιά γέφυρα μεταξύ αυτού του κεφαλαίου και του [επόμενου](/foundations/fourier-transform), όπου θα δούμε ότι **κάθε σήμα** μπορεί να γραφτεί έτσι. Και τότε όλα τα ίδια εργαλεία θα ισχύουν παντού."*

**(b) How:**

Now the eigenfunction name is **earned**. Student first met `H(f₀)` as a useful coefficient → now they understand it's the eigenvalue of the LTI system at frequency `f₀` → and they have a forward-pointing thread that says "this is the seed of the Fourier transform".

This is the right place for the eigenvector analogy from linear algebra (it doesn't gate the headline result anymore — it explains *why* the result has a name).

**(c) Components:**

- Optional small `<Callout type="connection">` with the matrix analogy if it adds clarity, but inline prose probably suffices.

---

### 7.7 Recap

Tight closing. Pull together what we know.

**(a) Content:**

> *"**Σύνοψη.**
>
> *Ένα LTI σύστημα μεταχειρίζεται κάθε συχνότητα ξεχωριστά. Όταν στέλνεις ένα cosine συχνότητας $f_0$ στην είσοδο:*
>
> *- η έξοδος είναι **πάντα cosine ίδιας συχνότητας** $f_0$,*
> *- με νέο **πλάτος** $|H(f_0)|$ και νέα **φάση** $\angle H(f_0)$,*
> *- όπου $H(f)$ είναι το **frequency response** του συστήματος, μια συνάρτηση που μας λέει τι κάνει σε κάθε συχνότητα.*
>
> *Αυτό αξίζει να το πεις δυνατά: **ένα LTI σύστημα δεν δημιουργεί ποτέ νέες συχνότητες.** Αν βάλεις 100 Hz μέσα, παίρνεις 100 Hz έξω. Πάντα. Αν στην έξοδο εμφανίζονται νέες συχνότητες — όπως κάνει ένας modulator — το σύστημα **δεν είναι LTI**.*
>
> *Στο [επόμενο κεφάλαιο](/foundations/fourier-transform) θα δούμε ότι αυτή η συνάρτηση $H(f)$ έχει ένα όνομα και μια ολόκληρη οικογένεια ιδιοτήτων: είναι ο **μετασχηματισμός Fourier** της κρουστικής απόκρισης $h(t)$. Και θα δούμε ότι **κάθε σήμα** — όχι μόνο cosines — μπορεί να αναλυθεί σε complex exponentials, που σημαίνει ότι η eigenfunction property εφαρμόζεται παντού."*

**(b) How:**

Three bullets stating the result. Then the punchline ("δεν δημιουργεί ποτέ νέες συχνότητες"). Then the forward link.

---

## Tucked derivation (collapsible)

Inside Section 7.3, after the boxed cosine result, add a **collapsible expander** titled:

```
▸ Απόδειξη — από πού προκύπτει αυτό; (για όσους θέλουν τη μαθηματική λεπτομέρεια)
```

When expanded, the content is the rigorous derivation. **Important: this is for curious readers only**. The main flow doesn't need it. Content:

> *"Παρακάτω παρουσιάζεται η μαθηματική απόδειξη του αποτελέσματος που μόλις είδαμε. Δεν είναι απαραίτητη για να καταλάβεις τι κάνει ένα LTI σε cosines — αρκεί η οπτική με τα δύο νούμερα ($|H|, \angle H$). Αλλά αν θέλεις να δεις τη ρίζα του αποτελέσματος, εδώ είναι.*
>
> ***Η ιδέα.** Επειδή ένα cosine γράφεται από Euler ως άθροισμα δύο complex exponentials, και επειδή το LTI σύστημα είναι γραμμικό, μπορούμε να αναλύσουμε χωριστά τη συμπεριφορά κάθε exponential και να αθροίσουμε. Όταν το κάνουμε σωστά, τα μιγαδικά κομμάτια αλληλοαναιρούνται και μένει ένα πραγματικό cosine στην έξοδο.*
>
> ***Βήμα 1 — εκθετικό σαν eigenfunction.** Στείλε ένα γενικό complex exponential $x(t) = e^{j 2\pi f_0 t}$ στην είσοδο. Από τη συνέλιξη:*
>
> *$$y(t) = \int h(\tau)\, e^{j 2\pi f_0 (t-\tau)}\, d\tau$$*
>
> *Ο όρος $e^{j 2\pi f_0 t}$ δεν εξαρτάται από το $\tau$· βγαίνει έξω:*
>
> *$$y(t) = e^{j 2\pi f_0 t}\,\underbrace{\int h(\tau)\, e^{-j 2\pi f_0 \tau}\, d\tau}_{\text{ορίζουμε } H(f_0)} = H(f_0)\cdot e^{j 2\pi f_0 t}$$*
>
> *Δηλαδή ένα complex exponential μπαίνει σε ένα LTI και βγαίνει το ίδιο, πολλαπλασιασμένο με το νούμερο $H(f_0)$.*
>
> ***Βήμα 2 — Euler split του cosine.** Από Euler:*
>
> *$$\cos(2\pi f_0 t) = \tfrac{1}{2}e^{j 2\pi f_0 t} + \tfrac{1}{2}e^{-j 2\pi f_0 t}$$*
>
> *Άρα ένα cosine είναι το άθροισμα δύο complex exponentials, σε συχνότητες $+f_0$ και $-f_0$.*
>
> ***Βήμα 3 — γραμμικότητα + eigenfunction στο καθένα.** Από Βήμα 1 ξέρουμε τι κάνει το σύστημα σε κάθε exponential. Από γραμμικότητα του συστήματος, η έξοδος είναι το άθροισμα:*
>
> *$$y(t) = \tfrac{1}{2}H(f_0)e^{j 2\pi f_0 t} + \tfrac{1}{2}H(-f_0)e^{-j 2\pi f_0 t}$$*
>
> ***Βήμα 4 — οι δύο όροι είναι μιγαδικά συζυγείς.** Για ένα φυσικό σύστημα όπου η $h(t)$ είναι real-valued, ισχύει $H(-f_0) = H^*(f_0)$ (αυτή είναι η ιδιότητα της **conjugate symmetry** — θα την αποδείξουμε στο επόμενο κεφάλαιο σαν γενική ιδιότητα του μετασχηματισμού Fourier). Άρα:*
>
> *$$y(t) = \tfrac{1}{2}H(f_0)e^{j 2\pi f_0 t} + \tfrac{1}{2}H^*(f_0)e^{-j 2\pi f_0 t}$$*
>
> *Οι δύο όροι είναι μιγαδικά συζυγείς ο ένας του άλλου. Από την [ιδιότητα](/reference/complex-numbers#conjugate) $z + z^* = 2\,\mathrm{Re}\{z\}$:*
>
> *$$y(t) = 2\,\mathrm{Re}\!\left\{\tfrac{1}{2}H(f_0)e^{j 2\pi f_0 t}\right\} = \mathrm{Re}\!\left\{H(f_0)e^{j 2\pi f_0 t}\right\}$$*
>
> ***Βήμα 5 — πολική μορφή του H.** Γράφουμε $H(f_0) = |H(f_0)|\,e^{j\angle H(f_0)}$:*
>
> *$$y(t) = \mathrm{Re}\!\left\{|H(f_0)|\,e^{j(2\pi f_0 t + \angle H(f_0))}\right\} = |H(f_0)|\,\cos\!\big(2\pi f_0 t + \angle H(f_0)\big)$$*
>
> *Έτσι όπως υποσχεθήκαμε στην ενότητα 7.3."*

**Critical:** The collapsible body uses `H(-f₀) = H*(f₀)` **without proving it here**. It's stated as a fact with a forward link to the FT chapter. This is the deliberate scope cut: the conjugate symmetry derivation is *not* in this section anymore.

---

## Updates to other parts of the page

### Remove other inline references to material that lived in the old Section 7

Search the systems page for any mentions of "συζυγής συμμετρία" or "conjugate symmetry" outside of the tucked derivation. There shouldn't be any after the rebuild — that whole topic moves to the FT chapter. The recap callout in Section 7 about "Quick recap από Φάση" we added earlier is also no longer needed (its function is absorbed into Section 7.4 which links inline to the phase reference). Remove that callout if it still exists.

### Check that the section's NextUp still points correctly

The section ends pointing forward to `/foundations/fourier-series` (per the existing site flow). That's still correct — no change needed.

---

## Updates to COMMITMENTS.md

**Remove (no longer applicable):**
- The commitment about `H(-f) = H*(f)` being derived inline in /foundations/systems is removed since the derivation no longer happens there.

**Add new (open):**
- [ ] **Conjugate symmetry of H(f) for real h(t)** — *used* in `/foundations/systems` Section 7 collapsible derivation (Βήμα 4) without proof. Promised proof location: `/foundations/fourier-transform`, framed as a general FT property (real h ↔ conjugate-symmetric H, plus siblings: even-real h ↔ even-real H, odd-real h ↔ odd-imaginary H, etc.).

**Keep open (unchanged):**
- The "Real h(t) ↔ conjugate-symmetric H(f) and related FT symmetry properties" entry from before, target FT chapter.
- The "Ideal filters and the non-causality trade-off" entry, target filters chapter.

(The first of these slightly overlaps with the new entry; merge them in COMMITMENTS.md so it's one tracked promise rather than two.)

---

## Acceptance criteria

When the rebuild is done:

1. ✅ Section 7 is fully replaced. None of the patched-on edits from previous review iterations survive in their old form.
2. ✅ The "complex exponentials don't exist physically" framing is established before any complex exponential math appears (Section 7.2).
3. ✅ The boxed result `y(t) = |H(f₀)|cos(2πf₀t + ∠H(f₀))` appears in Section 7.3 *before* the derivation, not after.
4. ✅ The full derivation lives in a collapsible expander, not in the main flow.
5. ✅ Conjugate symmetry is used (in Βήμα 4) but not derived; explicitly forward-linked to the FT chapter.
6. ✅ The "Πώς υπολογίζω H" + delay example are folded into Section 7.5 as concrete grounding for `H(f)`, not as a tacked-on bonus.
7. ✅ The "ειδική περίπτωση: όταν H(f₀) είναι πραγματικός" subsection is **removed entirely**. The student has the two-numbers framing from 7.4; they don't need a separate rules table for special cases.
8. ✅ The eigenfunction name appears in Section 7.6, *after* the cosine result is established and the linear-algebra analogy can land cleanly.
9. ✅ The page reads as a single coherent argument, not a series of patches.
10. ✅ User reviews — re-reads as if for the first time and confirms (a) the "complex exponentials don't exist physically" anxiety is dissolved at the start, and (b) `H(f₀)` feels like a concrete two-numbers object by the end of 7.4.

---

## Note for Claude Code

This is a **delete-and-rewrite**, not a series of edits. Don't try to preserve sentences from the existing Section 7 except where this plan explicitly says to. The accumulated edits have made the section internally inconsistent in tone and order; the only way to get a clean read is to start fresh.

Pay special attention to **Section 7.2** (the "complex exponentials are a math tool" framing). This is the section that solves the foundational confusion identified in review. If this paragraph doesn't land, the whole rebuild fails.

The existing `<EigenfunctionDemo />` viz keeps working as-is — the only thing that changes is *where* it sits in the new flow (Section 7.4, right after the "two-numbers-in-one" framing of `H(f₀)`).

After deploy, the smoke test is whether a stupid student reading the whole section feels at the end: (a) "I get what `H(f)` is — it's a function that tells me how the system treats each frequency", and (b) "I'm not weirded out by complex exponentials anymore — they're just math we use to make the analysis easier".
