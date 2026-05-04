# 04 — Foundations/Systems: "Τι κάνει ένα 'κουτί' σε ένα σήμα;"

**Goal:** Build a complete intuition for systems — what they are, what makes them special when they're LTI, and the operation that fully describes their behavior: convolution. By the end, the reader should understand:

1. What a "system" is (any input→output transformation)
2. Why we obsess over **linearity** and **time-invariance** (LTI) — they make systems mathematically tractable
3. The impulse response **h(t)** as the system's complete fingerprint
4. Convolution `y(t) = x(t) * h(t)` — what it computes and *why* it has the flip-and-slide form
5. Convolution properties (commutative, associative, distributive, identity) and what they mean physically
6. The eigenfunction property: complex exponentials pass through LTI systems unchanged in shape, only scaled by H(f₀). **This is the seed for Fourier.**

**Closes commitments:**
- "Convolution definition" — promised in `/foundations/signals` section 4g (δ(t) sifting). Section closes the loop with an explicit back-reference: *"θυμάσαι από το προηγούμενο κεφάλαιο που είπαμε ότι η δ(t) είναι το «test signal»; Τώρα θα δούμε γιατί."*
- "Why complex exponentials are LTI eigenfunctions" — promised in `/foundations/signals` section 4b. Closed in section 7 (Eigenfunction property).

**Adds commitments:**
- The full Fourier transform interpretation of H(f) is set up here but completed in `/foundations/fourier-transform`. Add to COMMITMENTS.md.
- Lab 3 page is referenced but full version comes later. Add to COMMITMENTS.md.

---

## Source material

- Primary deck: `SE_session4_theory2_2025.pdf` (33 slides)
  - Slides 3-11: Impulse response, convolution, properties, worked example
  - Slides 12-15: Time/frequency description teaser
  - Slides 16-20: LTI response to complex exponentials (eigenfunction property)
  - Slides 21-31: Analysis/synthesis, orthogonal signals, Fourier series intro — **we save this for `05-fourier-series.md`**
- Lab to embed: **Lab 3** (`Εργαστήριο_3Γραμμικά_συστήματα_συνεχούς_χρόνου.pdf`) — checking linearity and time-invariance of given systems

---

## Where this lives on the site

Path: `/foundations/systems`

Sidebar group: **Foundations → Συστήματα** (right after Σήματα)

---

## Page outline

```
1. Τι είναι ένα σύστημα;
2. Properties που μας ενδιαφέρουν
   2a. Γραμμικότητα (linearity)
   2b. Χρονική αμεταβλητότητα (time-invariance)
   2c. LTI = Linear + Time-Invariant (= ΓΧΑ στα ελληνικά)
   2d. Άλλες ιδιότητες σύντομα: αιτιατότητα, ευστάθεια
3. Η κρουστική απόκριση h(t)
   3a. Η ιδέα: τι βγάζει το σύστημα όταν το «χτυπήσουμε» με δ(t);
   3b. Γιατί η h(t) περιγράφει ΠΛΗΡΩΣ ένα LTI σύστημα
4. Συνέλιξη (convolution)
   4a. Από πού βγαίνει: αν ξέρεις την h(t), πώς υπολογίζεις την έξοδο για ΟΠΟΙΑΔΗΠΟΤΕ είσοδο;
   4b. Ο τύπος και η εξήγηση κάθε όρου
   4c. Η οπτική του flip-and-slide                          ← FLAGSHIP VIZ
   4d. Worked example: rect ⊛ triangle
5. Ιδιότητες της συνέλιξης
   5a. Αντιμεταθετική
   5b. Προσεταιριστική
   5c. Επιμεριστική
   5d. Ταυτοτική (η δ(t) είναι το «1» της συνέλιξης)
   5e. Φυσική σημασία της κάθε ιδιότητας
6. Από τη συνέλιξη στη συχνότητα: ένα teaser
   6a. Σήμα στον χρόνο και στη συχνότητα — γιατί τα δύο matter
7. Η eigenfunction property — ΓΙΑΤΙ τα complex exponentials είναι ξεχωριστά
   7a. Η απόδειξη βήμα-βήμα
   7b. Ορισμός του H(f₀)
   7c. Τι σημαίνει αυτό: cos μπαίνει, cos βγαίνει — με νέο πλάτος και φάση
   7d. Forward link: πλήρης θεωρία στο /foundations/fourier-transform
8. Lab 3 (🧪 προαιρετικό)
9. Εξάσκηση
10. Recap + Next up
```

---

## Detailed content plan, section by section

### 1. Τι είναι ένα σύστημα;

**(a) Content:**
- A system is just a "box" that takes a signal as **input** and produces a signal as **output**.
- Notation: $y(t) = S\{x(t)\}$ — "the system S, given input x, produces y".
- Examples from real life:
  - **Microphone:** acoustic pressure (input) → voltage (output)
  - **Amplifier:** small voltage in → larger voltage out
  - **Filter (LP):** noisy signal in → smoother signal out (high frequencies removed)
  - **Wireless channel:** transmitted signal in → attenuated + delayed + noisy version out
  - **Your ear:** sound pressure in → neural signal out
- The system can be **physical** (electrical circuit, mechanical device) or **mathematical** (an algorithm, a transformation defined by an equation).

**(b) How:**
- Open with "system = box that transforms a signal". Most relatable framing.
- Use the microphone or amplifier example to ground the abstract definition immediately.
- Notation introduced casually: *"για να μην γράφουμε «το σύστημα παίρνει το x και βγάζει το y», γράφουμε y(t) = S{x(t)}"*.

**(c) Components:**
- `<Callout type="intuition">` — system as a box
- `<SystemBoxDiagram />` — simple SVG: input arrow → labeled box → output arrow. Reuse pattern across the page.

---

### 2. Properties που μας ενδιαφέρουν

#### 2a. Γραμμικότητα (Linearity)

**(a) Content:**
- A system is **linear** if it satisfies the **superposition principle**:
$$
S\{a_1 x_1(t) + a_2 x_2(t)\} = a_1 S\{x_1(t)\} + a_2 S\{x_2(t)\}
$$
- In plain Greek: *"αν δώσεις στο σύστημα ένα **άθροισμα** σημάτων, η έξοδος είναι το **άθροισμα των εξόδων** που θα έπαιρνες αν τα έδινες ένα-ένα"*.
- Worked check (from Lab 3):
  - $y(t) = 5x(t)$ → linear ✓
  - $y(t) = 5x(t) + 3$ → **not** linear (the +3 breaks superposition: input 0 gives output 3, not 0)
  - $y(t) = 3[x(t)]^2$ → not linear (squaring breaks it)
  - $y(t) = \cos(x(t))$ → not linear

**(b) How:**
- Lead with the *physical meaning* before the formula: superposition = "no surprises when you combine inputs".
- The "+3" gotcha is gold — students often think any "linear-looking" affine equation is linear. Make the gotcha visible.
- Use the formal equation only after the intuition lands.

**(c) Components:**
- `<LinearityChecker />` — interactive: pick a system from a list, viz shows what happens when you input $x_1$, $x_2$, and $a_1 x_1 + a_2 x_2$ side-by-side. Equality check (with ✓/✗) at the bottom.

---

#### 2b. Χρονική αμεταβλητότητα (Time-invariance)

**(a) Content:**
- A system is **time-invariant** if **delaying the input** results in the **same output, just delayed**:
$$
S\{x(t-t_0)\} = y(t-t_0)
$$
- Plain Greek: *"το σύστημα συμπεριφέρεται το ίδιο, ανεξάρτητα από το πότε ξεκινάς να δίνεις το σήμα. Η σχέση input-output δεν εξαρτάται από τον χρόνο"*.
- Counter-example: $y(t) = t \cdot x(t)$ — here, multiplying by $t$ means the output depends on *when* you input the signal. Not time-invariant.
- A system that is linear but not time-invariant is called LTV (linear time-varying). We don't study those much in this course.

**(b) How:**
- Use the analogy of a microphone: if you say "γεια" at 10:00 and again at 14:00, the recording sounds the same (just shifted in time). That's time-invariance.
- Counter-example must be *visually* clear in the viz: a system whose response visibly changes when you shift the input.

**(c) Components:**
- `<TimeInvarianceChecker />` — toggle to delay the input. Watch what comes out. For a TI system, the output is just the original output delayed. For a non-TI system, the shape itself changes.

---

#### 2c. LTI = Linear + Time-Invariant

**(a) Content:**
- A system that is both linear and time-invariant is called **LTI** (Linear Time-Invariant). Greek term: **ΓΧΑ** (Γραμμικό Χρονικά Αμετάβλητο).
- *Why we obsess over LTI:* almost all the powerful tools we have — convolution, frequency response, Fourier, transfer functions — depend on LTI. **For non-LTI systems, almost none of this works.**
- **Vast majority of physical systems we deal with are LTI** to a good approximation: linear circuits, ideal channels, basic filters, wave propagation through homogeneous media...
- For the rest of this course, "system" by default means "LTI system", unless we explicitly say otherwise.

**(b) How:**
- Big `<Callout type="key">`: *"Όταν λέμε 'σύστημα' σε αυτό το μάθημα, εννοούμε LTI. Όλα τα μαθηματικά που θα δούμε στηρίζονται σε αυτό. Το να ξεχωρίζεις πότε ένα σύστημα είναι LTI και πότε όχι είναι ΕΞΕΤΑΣΤΕΟ."*
- Mention both terms: **LTI** (English, used everywhere internationally) and **ΓΧΑ** (Greek, used in lectures and exams).

**(c) Components:**
- `<Callout type="key">` summarizing why LTI matters
- A small two-column "term reference": LTI = ΓΧΑ

---

#### 2d. Άλλες ιδιότητες (causal, stable) — σύντομα

**(a) Content:**
Brief mention only. We don't need a deep dive but the terms should be familiar.
- **Causal (αιτιατό):** η έξοδος τη χρονική στιγμή $t$ εξαρτάται μόνο από την είσοδο σε χρόνους $\leq t$. Δηλαδή: το σύστημα δεν «βλέπει το μέλλον». Όλα τα φυσικά συστήματα που λειτουργούν σε πραγματικό χρόνο είναι αιτιατά.
- **Stable (ευσταθές):** σε πεπερασμένη είσοδο δίνει πεπερασμένη έξοδο (BIBO stable). Άλλη μια property που θέλουμε από πρακτικά συστήματα.

**(c) Components:**
- Just two short paragraphs. No viz needed.

---

### 3. Η κρουστική απόκριση h(t)

#### 3a. Η ιδέα

**(a) Content:**
- *"Πώς ξέρουμε τι κάνει ένα σύστημα;"*
- One way: send in every possible signal and see what comes out. **Infinite work.**
- Better way: send in **a single special signal** that contains "a bit of every frequency / every duration", and see what comes out. That signal is **δ(t)**.
- The output of an LTI system when the input is δ(t) is called the **impulse response** $h(t)$:
$$
h(t) = S\{\delta(t)\}
$$
- *Back-reference:* "θυμάσαι από το προηγούμενο κεφάλαιο που είπαμε η δ(t) είναι το «test signal»; Να γιατί."

**(b) How:**
- Frame as a question: how do we describe a system with a *single object* instead of having to test it with every possible input?
- Use the analogy of "tapping a bell to see what sound it makes" — the impulse response of the bell tells you how it'll sound when struck by *any* mallet, because any mallet's force profile can be decomposed into a sum of impulses.

**(c) Components:**
- `<ImpulseResponseDemo />` — diagram with three pre-set systems (RC filter, integrator, simple delay), input is δ(t), watch the corresponding h(t) appear at the output.

#### 3b. Γιατί η h(t) περιγράφει ΠΛΗΡΩΣ ένα LTI σύστημα

**(a) Content:**
- This is the magic claim: for an **LTI** system, knowing $h(t)$ is **all you need** to predict the output for *any* input.
- Why? Because:
  1. (Sifting property of δ): any input $x(t)$ can be written as a "sum" of shifted, scaled impulses: $x(t) = \int x(\tau)\delta(t-\tau)d\tau$. Plain Greek: "κάθε σήμα είναι μια συνέχεια από στιγμιαίες κρούσεις, μία σε κάθε χρονική στιγμή τ, ύψους x(τ)".
  2. (Time-invariance): a shifted impulse $\delta(t-\tau)$ in produces shifted impulse response $h(t-\tau)$ out.
  3. (Linearity): the response to a sum of inputs = sum of responses.
- Combine all three → the output is a sum (integral) of shifted, scaled impulse responses:
$$
y(t) = \int_{-\infty}^{\infty} x(\tau) h(t-\tau)\, d\tau
$$
- That's **convolution**. The next section is just unpacking what this integral means visually.

**(b) How:**
- This is a *derivation*, not a definition handed down from heaven. Walk through the three steps explicitly: sifting → TI → linearity → convolution falls out.
- Use a `<Callout type="key">`: *"η συνέλιξη δεν είναι μαγική. Είναι αυτό που προκύπτει αν συνδυάσεις τρεις πράγματα που ήδη ξέρεις: (1) ότι κάθε σήμα είναι σύνθεση κρούσεων, (2) ότι το σύστημα είναι TI, (3) ότι το σύστημα είναι γραμμικό."*

**(c) Components:**
- A small step-by-step expandable: "δες τη συναγωγή" — three click-to-expand steps, each adding one more piece (sifting, TI, linearity), culminating in the convolution integral.

---

### 4. Συνέλιξη (Convolution)

#### 4a. Από πού βγαίνει

- Already covered in 3b — but re-state the result here clearly:
$$
y(t) = x(t) * h(t) = \int_{-\infty}^{\infty} x(\tau) h(t-\tau)\, d\tau
$$
- The `*` symbol is the convolution operator (NOT multiplication).
- Convolution can also be written as $y(t) = h(t) * x(t)$ (same thing — see commutative property below).

#### 4b. Ο τύπος εξηγημένος

**(a) Content:**
Walk the student through every symbol in the integral:
- The dummy variable $\tau$ — "εδώ ολοκληρώνουμε σε σχέση με το τ"
- $x(\tau)$ — "η αξία του εισερχόμενου σήματος τη χρονική στιγμή τ"
- $h(t-\tau)$ — "η impulse response, αλλά **αναποδογυρισμένη** (επειδή είναι t-τ αντί για τ-t) **και ολισθημένη** κατά t"
- The product $x(\tau) h(t-\tau)$ — "πολλαπλασιάζω τα δύο σε κάθε σημείο τ και αθροίζω (ολοκληρώνω)"
- The result $y(t)$ — "μία τιμή για κάθε t"

**(b) How:**
- Crucial: each term needs a one-line plain Greek meaning. Students get stuck because "τ-t flipped" sounds arbitrary.
- *Why the flip?* — give the geometric reason. The flip comes from the time-invariance step in the derivation: if input at time τ produces output starting at time τ (and scaled by h delayed by t-τ), then to compute the output at time t, we need h(t-τ), which is h **mirrored** then **shifted right by t**. Picture this in their head before the viz makes it visual.

**(c) Components:**
- A formula breakdown component: each symbol in the integral is hover-able / tap-able and shows its meaning.

#### 4c. Flip-and-slide (FLAGSHIP VIZ)

**(a) Content:**
- This is *the* operation students need to internalize. Spend real estate.
- The visual algorithm:
  1. Plot $x(\tau)$ on the τ-axis.
  2. Plot $h(\tau)$ on the same axis. **Flip it horizontally** to get $h(-\tau)$.
  3. **Slide** that flipped $h$ to the right by amount $t$ to get $h(t-\tau)$.
  4. **Multiply** $x(\tau) \cdot h(t-\tau)$ at every τ — this is the integrand.
  5. **Integrate** (compute the area under) the product. That single number is $y(t)$.
  6. Move to the next $t$, repeat.
- Output $y(t)$ is built up by sweeping $t$ from $-\infty$ to $+\infty$.

**(b) How:**
- The viz must show: x, h-flipped-and-sliding, the product (highlighted area), and y(t) being built up — all on a synchronized timeline.
- A play/pause/scrub control. Step-by-step mode for the slow learners.

**(c) Components:**
- `<ConvolutionFlipAndSlide />` — **the most important viz in this section**. Specs:
  - 4-panel layout (or 3 stacked + the output building)
  - Top: x(τ) static
  - Second: h(t-τ) — flipped and sliding (red box highlighting current position)
  - Third: their product (green fill = positive contribution)
  - Bottom: y(t) being painted in as t advances
  - Control: scrub bar for t, play/pause, step buttons
  - Preset signal pairs:
    1. Two rectangles → triangle (the classical "easy" convolution)
    2. Rectangle + triangle (the lecture's example, slide 11)
    3. Rectangle + decaying exponential (impulse response of an RC filter style)
    4. Two impulses (verify: shifted impulse)
    5. Allow user-drawn (stretch goal — can be in v2)
- Mobile: panels stack vertically with the same scrub timeline at the bottom.

#### 4d. Worked example: rect ⊛ triangle

**(a) Content:**
- Step through the lecture's example (slide 11) algebraically:
  - $f(\tau) = \Pi(\tau - 0.5)$ (rectangle, 0 to 1)
  - $g(\tau) = \Lambda(\tau)$ (triangle, 0 to 1, peak at 0)
  - For $0 \leq t < 1$: integral evaluates to $t - t^2/2$
  - For $1 \leq t < 2$: integral evaluates to $2 - 2t + t^2/2$  (corrected from slide which has typo)
  - Outside: 0
- Result is a piecewise quadratic curve, peaking at $t=1$.

**(b) How:**
- Show the algebraic derivation alongside the viz state at each t.
- Highlight the **change of integration limits** as the slid h enters/exits the support of x — this is where students struggle most.

**(c) Components:**
- `<Example title="Παράδειγμα: rect ⊛ triangle">` — collapsible solution with:
  - Animation of the flip-slide at three key t values
  - Integral setup at each
  - Final piecewise expression
  - Plot of the resulting y(t)

---

### 5. Ιδιότητες της συνέλιξης

Each property: equation + plain Greek meaning + (where useful) physical/diagrammatic interpretation.

#### 5a. Αντιμεταθετική (commutative)
$$x(t) * h(t) = h(t) * x(t)$$
*"Δεν έχει σημασία ποιο σήμα 'παίζει το ρόλο της εισόδου' και ποιο 'το ρόλο του συστήματος' — το αποτέλεσμα είναι το ίδιο."*
Practical: when computing convolution by hand, flip the **simpler** of the two signals to make the integration easier.

#### 5b. Προσεταιριστική (associative)
$$(x_1(t) * x_2(t)) * x_3(t) = x_1(t) * (x_2(t) * x_3(t))$$
*Physical interpretation:* if you put two LTI systems in **cascade** (output of one feeds input of the next), the combined system is also LTI with impulse response $h_1 * h_2$. The order in which you "compute" the cascade doesn't change the result.

`<CascadeDiagram />` — two boxes h₁, h₂ in series, equivalent to one box h₁*h₂. Visual.

#### 5c. Επιμεριστική (distributive)
$$x(t) * (h_1(t) + h_2(t)) = x(t) * h_1(t) + x(t) * h_2(t)$$
*Physical interpretation:* if you put two LTI systems in **parallel** (same input fed to both, outputs summed), the combined system has impulse response $h_1 + h_2$.

`<ParallelDiagram />` — two boxes in parallel, equivalent to one with sum. Visual.

#### 5d. Ταυτοτική (identity)
$$x(t) * \delta(t) = x(t)$$
$$x(t) * \delta(t-t_0) = x(t-t_0)$$
*"Η δ είναι το «1» της συνέλιξης. Συνελίσσοντας ένα σήμα με δ(t) δεν αλλάζει τίποτα. Με δ(t-t₀) απλώς το ολισθαίνεις κατά t₀."*
A pure delay system has impulse response $\delta(t-t_0)$.

#### 5e. Φυσική σημασία

A `<Callout type="intuition">` summarizing:
- **Commutative** = roles interchangeable
- **Associative** = cascade
- **Distributive** = parallel
- **Identity** = delay/passthrough

---

### 6. Από τη συνέλιξη στη συχνότητα — teaser

**(a) Content:**
- Convolution in time is *messy* — flips, slides, integrals.
- **Hint of magic:** if we change perspective and look at the same signals in the **frequency domain**, convolution becomes... **multiplication**. Just point-by-point multiplication.
- Specifically: if $y(t) = x(t) * h(t)$, then $Y(f) = X(f) \cdot H(f)$.
- **We don't prove this here.** Full treatment in `/foundations/fourier-transform`.
- *Why we mention it now:* this is the main reason Fourier is a *huge* deal. Working in the frequency domain makes convolution trivial.

**(b) How:**
- Single short callout. Teaser, not derivation. Forward link.

**(c) Components:**
- `<Callout type="note">` — the convolution-becomes-multiplication teaser.
- Forward link to `/foundations/fourier-transform`.

---

### 7. Eigenfunction property — γιατί τα complex exponentials είναι ξεχωριστά

**(a) Content:** (slide 16)
- Take an LTI system with impulse response $h(t)$.
- Send in $x(t) = A e^{j(2\pi f_0 t + \phi)}$ — a complex exponential at frequency $f_0$.
- The output is:
$$
y(t) = x(t) * h(t) = \int_{-\infty}^{\infty} h(\tau) A e^{j(2\pi f_0 (t-\tau) + \phi)} d\tau
$$
- Pull the constants out of the integral (they don't depend on τ):
$$
y(t) = A e^{j(2\pi f_0 t + \phi)} \int_{-\infty}^{\infty} h(\tau) e^{-j 2\pi f_0 \tau} d\tau
$$
- Define:
$$
H(f_0) = \int_{-\infty}^{\infty} h(\tau) e^{-j 2\pi f_0 \tau} d\tau
$$
- Then: $y(t) = H(f_0) \cdot x(t)$.
- **Plain Greek:** *"ένα complex exponential μπαίνει στο σύστημα και βγαίνει το ίδιο complex exponential, απλώς **πολλαπλασιασμένο με ένα μιγαδικό αριθμό H(f₀)**. Δεν αλλάζει σχήμα. Δεν παραμορφώνεται. Μόνο πλάτος και φάση αλλάζουν."*
- **This makes complex exponentials the "eigenfunctions" of LTI systems.** (The same way an eigenvector of a matrix is just scaled, not rotated, by the matrix.)

**(b) How:**
- Walk through the algebra slowly. The "pulling constants out" step is the punchline.
- Emphasize: $H(f_0)$ is just a single complex number. Its magnitude $|H(f_0)|$ tells us how much the system amplifies/attenuates that frequency. Its phase $\angle H(f_0)$ tells us how much it delays it.
- **For real signals (cosines/sines):** since cos and sin can be built from complex exponentials, they too come out as cos and sin of the same frequency. Only amplitude and phase change. **No new frequencies are created by an LTI system.**
- This is profound. It means: if you put a 100 Hz sine into an LTI system, you get a 100 Hz sine out. **Always.** No 200 Hz, no 50 Hz. (Non-LTI systems can create new frequencies — that's what modulators do!)

**(c) Components:**
- `<EigenfunctionDemo />` — input: cosine of adjustable frequency, system: pre-set LP filter. Watch the input and output side-by-side. Show: same frequency in/out, different amplitude/phase. Sweep frequency, watch how amplitude/phase change — student is now staring at the **frequency response** $H(f)$.
- This is the **Trojan horse for Fourier**. Students will see the magnitude curve $|H(f)|$ form as they sweep, and that curve *is* the LP filter's frequency response. Forward link.

#### 7d. Forward link

`<Callout type="forward-link">`: *"Η H(f₀) που μόλις ορίσαμε είναι **ο μετασχηματισμός Fourier της h(t)**. Στο επόμενο κεφάλαιο θα δούμε τι είναι ο Fourier και γιατί αλλάζει τα πάντα."*

---

### 8. Lab 3 (🧪)

**Content draws from:** `Εργαστήριο_3Γραμμικά_συστήματα_συνεχούς_χρόνου.pdf` (6 slides). Topics:
- Checking linearity manually for given systems:
  - $y(t) = 5x(t)$ → linear
  - $y(t) = 5x(t) + 3$ → not linear
  - $y(t) = 3[x(t)]^2$ → not linear
  - $y(t) = \cos(x(t))$ → not linear
- Programmatic check in MATLAB: feed $a_1 x_1 + a_2 x_2$ vs $a_1 y_1 + a_2 y_2$ and compare
- Time-invariance check: feed $x(t)$ vs $x(t-2)$ and compare outputs

**LabBox content (kept short):**
- Brief intro
- One snippet showing a programmatic linearity check:
  ```matlab
  t = 0:0.001:2;
  x1 = cos(2*pi*5*t);
  x2 = exp(-0.5*t);
  a1 = 2; a2 = 3;
  
  % System: y = 5x
  y_combined = 5*(a1*x1 + a2*x2);
  y_separate = a1*(5*x1) + a2*(5*x2);
  
  % If linear, these should match
  max(abs(y_combined - y_separate))   % Should be ~0
  ```
- Link to `/labs/03-systems` placeholder.

---

### 9. Εξάσκηση

5 problems with worked solutions:

1. **(Linearity check)** Determine whether $y(t) = x(t-1) + x(t+1)$ is linear. *(Yes — sum of shifts is linear.)*
2. **(Time-invariance)** Determine whether $y(t) = t \cdot x(t)$ is time-invariant. *(No — coefficient depends on time.)*
3. **(Convolution computation)** Compute $\Pi(t/2) * \Pi(t/2)$ — two unit-height rectangles of width 2 each. *(Triangle of width 4, peak 2.)*
4. **(Convolution with δ)** Find $x(t) * \delta(t-3)$ where $x(t) = e^{-t}u(t)$. *(Sifting → $e^{-(t-3)}u(t-3)$.)*
5. **(Eigenfunction)** Given an LTI system that produces $y(t) = 0.5\cos(2\pi \cdot 10 t - \pi/4)$ when the input is $x(t) = \cos(2\pi \cdot 10 t)$, what are $|H(10)|$ and $\angle H(10)$? *($|H(10)| = 0.5$, $\angle H(10) = -\pi/4$.)*

Format: `<ExamProblem>` with collapsible solution.

---

### 10. Recap + Next up

**`<Recap>`:**
- ΄Ενα σύστημα είναι ένα κουτί που μετατρέπει ένα σήμα σε άλλο
- Linearity + Time-Invariance = LTI (ΓΧΑ): η κατηγορία πάνω στην οποία στηρίζονται όλα τα εργαλεία μας
- Η h(t) είναι το «αποτύπωμα» ενός LTI: η έξοδός του όταν δίνουμε δ(t) στην είσοδο
- Convolution: $y = x * h$ = "flip-and-slide". Είναι πώς συνδέονται input και output μέσω της h.
- Ιδιότητες: αντιμεταθετική, προσεταιριστική (cascade), επιμεριστική (parallel), ταυτοτική (δ)
- **Eigenfunction property:** complex exponentials περνούν από LTI και βγαίνουν ίδιοι, απλώς πολλαπλασιασμένοι με H(f₀). Αυτό ορίζει το H(f) — που είναι (spoiler) ο Fourier transform της h(t).

**`<NextUp slug="foundations/fourier-series">`** — *"Επόμενο: Σειρές Fourier — πώς φτιάχνουμε οποιοδήποτε περιοδικό σήμα από cosines"*

---

## Visualizations

### Must-have

1. **`<LinearityChecker />`** — interactive system check. Section 2a.
2. **`<TimeInvarianceChecker />`** — delay input, check output. Section 2b.
3. **`<ImpulseResponseDemo />`** — δ(t) in, h(t) out, three preset systems. Section 3a.
4. **`<ConvolutionFlipAndSlide />`** — **THE flagship viz**. Multi-panel synced animation. Section 4c.
5. **`<EigenfunctionDemo />`** — sweep frequency, watch H(f) form. Section 7. Trojan horse for Fourier.

### Should-have

6. **`<CascadeDiagram />`** + **`<ParallelDiagram />`** — small SVGs for properties. Section 5.
7. **`<SystemBoxDiagram />`** — generic input→box→output. Reusable.

---

## Visuals strategy

(See `02-intro.md` appendix.)

- All vizzes built from scratch as React/SVG/Canvas
- All plots computed on the fly
- No external assets needed for this section

---

## Frontmatter

```yaml
title: "Συστήματα — Συνέλιξη και η Eigenfunction Property"
slug: "foundations/systems"
order: 3
prerequisites: ["intro", "foundations/signals"]
examWeight: 12              # foundational; convolution itself rarely asked directly,
                            # but eigenfunction property and h(t) are everywhere
estimatedReadTime: 40       # minutes (lab adds ~10 more)
lastUpdated: "2026-05-XX"
```

---

## Acceptance criteria

When done:
1. ✅ All 10 numbered subsections render with content
2. ✅ All 5 must-have vizzes are functional and tested on mobile
3. ✅ ConvolutionFlipAndSlide works smoothly: scrub control, presets, no jank
4. ✅ EigenfunctionDemo shows |H(f)| and ∠H(f) curves building up as user sweeps
5. ✅ Lab 3 LabBox is present, linked to `/labs/03-systems` placeholder
6. ✅ All forward references to `/foundations/fourier-series`, `/foundations/fourier-transform` link correctly
7. ✅ Both LTI and ΓΧΑ are introduced and used interchangeably
8. ✅ "+3 breaks linearity" gotcha is visually demonstrated
9. ✅ User reviews with stupid student filter; all unclear points fixed before moving on

---

## Updates to COMMITMENTS.md

**Closes (move to "Fulfilled"):**
- "Convolution definition" — fulfilled in Section 3b/4
- "Why complex exponentials are LTI eigenfunctions" — fulfilled in Section 7

**New open commitments:**
- [ ] **Full Lab 3 page** — `/foundations/systems` LabBox links here. Target: `/labs/03-systems`.
- [ ] **H(f) is the Fourier transform of h(t) — proven and contextualized** — Section 7 promises full treatment in the next chapter. Target: `/foundations/fourier-transform`.
- [ ] **Convolution in time = multiplication in frequency** — Section 6 teases this. Target: `/foundations/fourier-transform`.

---

## What is NOT in this section

- ❌ Fourier series (next plan)
- ❌ Fourier transform (plan 06)
- ❌ Frequency response treatment beyond the eigenfunction setup (plan 06)
- ❌ Filter design (later, plan 07)
- ❌ Discrete-time systems and discrete convolution — we focus on continuous time. Discrete convolution is mentioned only briefly if at all.

---

## After this is done

Next plan: `05-fourier-series.md` — periodic signals as sums of cosines/complex exponentials. The first half of the Fourier story. Where the eigenfunction property pays off and the time/frequency duality teased in the intro becomes concrete.
