# 03 — Foundations/Signals: "Τι είναι ένα Σήμα;"

**Goal:** First *real* content section. By the end, the reader should be comfortable looking at any signal and answering: continuous or discrete? periodic or not? real or complex? deterministic or random? energy or power? They should also know the building-block signals (cosines, complex exponentials, unit step, unit impulse) by name and intuition.

**This is a long section but it must not feel rushed.** Concepts here are foundational for *everything* that follows. We earn understanding here so later sections can hook into it cleanly.

**Closes commitment:** none directly. But it sets up the foundation for fulfilling future commitments (Fourier, modulation, etc).

**Adds commitments:**
- Convolution will be defined in the next section (link forward to `04-systems`)
- Fourier will be built in `05-fourier-series` and `06-fourier-transform`
- The δ(t) properties (sifting, etc.) will be revisited when we use them in convolution and Fourier

---

## Source material

- Primary deck: `SE_session3_theory1_2025.pdf` (35 slides — slides 3-34 are content, 1-2 and 35 are admin/end)
- Lab to embed: **Lab 2** (`Εργαστήριο_2Συνεχή_και_διακριτά_σήματα.pdf`) — fits this section perfectly
- Key visuals on slides:
  - 5: continuous vs discrete time
  - 8: analog vs digital
  - 10-11: periodicity examples (continuous and discrete)
  - 17-18: even/odd signals
  - 22: energy vs power signals
  - 23-26: sinusoidal signals, DC and RMS
  - 30-34: unit impulse construction (build δ(t) as a limit)

---

## Where this lives on the site

Path: `/foundations/signals` (replaces the bootstrap QA placeholder).

Sidebar group: **Foundations → Σήματα**.

---

## Page outline

```
1. Τι είναι ένα σήμα;                           ← intuition first, no math
2. Συνεχούς και διακριτού χρόνου                ← the time axis
3. Αναλογικά και ψηφιακά                        ← the amplitude axis
   3a. Συνέχεια / διακριτότητα — μια ωραία οπτική: τα 4 τεταρτημόρια
4. Δομικοί λίθοι: τα σήματα που θα δούμε ξανά και ξανά
   4a. Cosines / sinusoidal signals
   4b. Complex exponentials e^(jωt)            ← motivate carefully
   4c. Unit step u(t)
   4d. Rectangular pulse Π(t)
   4e. Triangular pulse Λ(t)
   4f. Sinc function
   4g. Unit impulse δ(t)                        ← built as a limit, with intuition
5. Πώς ξεχωρίζουμε σήματα μεταξύ τους — ταξινομία
   5a. Πραγματικά / Μιγαδικά
   5b. ΄Αρτια / Περιττά
   5c. Αιτιατά / Μη αιτιατά
   5d. Αιτιοκρατικά / Τυχαία (deterministic / random)
   5e. Περιοδικά / Μη περιοδικά
6. Ενέργεια και Ισχύς                           ← treated as ONE big topic
   6a. Πότε ένα σήμα έχει "ενέργεια"
   6b. Ορισμός ενέργειας Ex
   6c. Πότε ένα σήμα έχει "ισχύ"
   6d. Ορισμός ισχύος Px
   6e. Σήματα ενέργειας vs σήματα ισχύος
   6f. DC και RMS
7. Lab 2 (🧪 προαιρετικό)                       ← embedded LabBox
8. Εξάσκηση
9. Recap + Next up (→ Συστήματα)
```

---

## Detailed content plan, section by section

For each: **(a)** what to teach, **(b)** how to teach (intuition + analogies before math), **(c)** components/vizzes.

### 1. Τι είναι ένα σήμα;

**(a) Content:**
- Drop the textbook definition for a sec. Just say: *"Ένα σήμα είναι **οτιδήποτε αλλάζει** (ή θα μπορούσε να αλλάζει) **σε σχέση με κάτι άλλο** — συνήθως, σε σχέση με τον χρόνο."*
- Examples from everyday life:
  - Η θερμοκρασία στο δωμάτιό σου σε όλη τη μέρα → ένα σήμα του χρόνου
  - Το ύψος ενός κύματος της θάλασσας → ένα σήμα
  - Η τάση στην έξοδο ενός μικροφώνου όταν μιλάς → ένα σήμα
  - Η θέση του ποντικιού στην οθόνη → δύο σήματα (x και y) του χρόνου
- *Then* introduce the math notation: `x(t)` means "η τιμή του σήματος x τη χρονική στιγμή t". Just notation.
- A signal isn't always of time. It can be of space (image), or any other variable. **For this course we focus on signals of time.**

**(b) How:**
- Lead with everyday examples
- The "θερμοκρασία στο δωμάτιο" example is super grounding — every reader can imagine it
- The "ύψος του κύματος" example sets up periodic visualization later
- Notation introduced *casually*, not as a formal definition

**(c) Components:**
- `<Callout type="intuition">` for the everyday signal definition
- A small interactive viz: `<EverydaySignals />` — 3 toggle buttons (Temperature / Wave / Mouse), shows the corresponding signal as a plot animating over a "day"
  - Temperature: smooth daily curve
  - Wave: periodic sinusoid
  - Mouse: jagged trace of an actual cursor path

---

### 2. Συνεχούς και διακριτού χρόνου

**(a) Content:**
- A signal can be defined for **every** moment in time → **continuous-time signal** (analog feel). Notation: `x(t)`.
- Or it can be defined only at **specific moments** (e.g. every millisecond) → **discrete-time signal**. Notation: `x[n]` (square brackets!).
- Examples:
  - Speech recorded by a microphone, before any sampling = continuous-time
  - Temperature reading you log every hour = discrete-time
  - A digital audio file = discrete-time (the computer stores samples)
- **Why we care:** the real world is continuous, but computers can only handle discrete. Sampling (later chapter) is the bridge.

**(b) How:**
- Use the same physical signal viewed two ways: a sine wave drawn as a continuous line vs the same wave shown as dots at discrete times. **Side by side**, same y-axis, same x-axis.
- Critical: explicitly call out the **notation difference** — `x(t)` vs `x[n]`. Many students miss this and get confused later. Add a tiny sticky note: "Πρόσεξε: για συνεχές χρόνο γράφουμε `x(t)` με παρένθεσες, για διακριτό `x[n]` με αγκύλες. Είναι σύμβαση και διευκολύνει."

**(c) Components:**
- `<ContinuousVsDiscreteDemo />` — two synced plots, both show the same cos. Slider for "sample rate" reveals how dense the dots are.
- `<Callout type="key">` for the notation reminder

---

### 3. Αναλογικά και ψηφιακά

**(a) Content:**
- Time is one axis. **Amplitude is the other axis.**
- A signal whose amplitude can take **any** real value → **analog**.
- A signal whose amplitude is restricted to a **finite set of levels** → **digital**.
- *These two axes are independent.* You can have:
  - Continuous time + analog amplitude → "raw audio"
  - Continuous time + digital amplitude → e.g. a square wave that jumps between 0 V and 5 V
  - Discrete time + analog amplitude → "samples with infinite precision" (theoretical)
  - Discrete time + digital amplitude → "what your computer stores" (sampled + quantized)

**(b) How:**
- The 2x2 grid is gold here. Visualize the same underlying signal in all 4 quadrants. Concrete: the same cosine, drawn 4 different ways.
- Emphasize: **most students conflate "continuous time" and "analog"**. They are different axes. We're going to be careful.

**(c) Components:**
- `<FourQuadrantSignalDemo />` — 2x2 grid, same underlying signal, 4 different quantization/sampling settings. Sliders for sample rate and amplitude levels. Watch the same signal degrade gracefully across the grid.
- This viz is doing real pedagogical work — make it clean.

---

### 4. Δομικοί λίθοι: τα σήματα που θα δούμε ξανά και ξανά

This whole section establishes a *vocabulary* of signals. Each subsection: **define → equation → plot → why we care**.

**Critical:** this is not "memorize these formulas". This is "meet your future co-workers". Every signal here will appear dozens of times in later chapters.

#### 4a. Cosine / sinusoidal signals

- General form: $x(t) = A\cos(2\pi f t + \phi)$
- The 3 parameters in plain Greek: $A$ = πλάτος (πόσο ψηλά πάει), $f$ = συχνότητα (πόσες φορές ανά δευτερόλεπτο), $\phi$ = φάση (από πού ξεκινά)
- Period $T = 1/f$
- Angular frequency $\omega = 2\pi f$ — explain *why* the 2π is there: because cosine has period 2π naturally; $2\pi f$ is "how many radians of cosine we sweep per second"
- Why we care: **every signal in this course can be built from cosines** (Fourier — coming soon)

**Viz:** `<CosineExplorer />` — three sliders (A, f, φ), live waveform. Show the corresponding spike(s) in frequency domain too — this gently re-acquaints them with the time-frequency duality from intro.

#### 4b. Complex exponentials e^(jωt)

This is the one that scares students. Handle carefully.

- Start with Euler's formula: $e^{j\omega t} = \cos(\omega t) + j\sin(\omega t)$
- Visual interpretation: a point spinning around the unit circle in the complex plane, at angular speed ω. Cosine = its x-coordinate. Sine = its y-coordinate.
- "Γιατί νοιαζόμαστε;" — because complex exponentials make the math much cleaner. Every cosine equals $\frac{1}{2}(e^{j\omega t} + e^{-j\omega t})$. When we get to Fourier, we'll see that LTI systems treat complex exponentials *as their natural language*.
- Don't go deeper here. We just want the student to:
  - Know what $e^{j\omega t}$ looks like (rotating phasor)
  - Not be afraid when they see it
  - Understand the connection to cosine/sine

**Viz:** `<RotatingPhasor />` — a complex plane on the left, time-domain plot on the right. Animate a phasor spinning. Two horizontal lines on the right show the cosine (x-projection) and sine (y-projection) traced out. Slider for ω. **This single viz is worth 10 paragraphs of explanation.**

#### 4c. Unit step u(t)

- Definition: $u(t) = 1$ για $t \geq 0$, else $0$.
- "Ο διακόπτης" analogy: the moment something turns on. Switching on a circuit at t=0.
- Used everywhere as a "starting at" marker.

**Viz:** simple plot. Optional toggle to shift it: `u(t-t₀)`.

#### 4d. Rectangular pulse Π(t)

- Definition: $\Pi(t/T) = 1$ for $|t| \leq T/2$, else $0$.
- "A rectangle of width T centered at 0, height 1."
- Used as the canonical "limited-duration signal".
- Critical: this signal is in the formula sheet. Students need to recognize it instantly.

**Viz:** plot with adjustable T.

#### 4e. Triangular pulse Λ(t)

- Definition: $\Lambda(t/T)$ — triangle peaking at t=0 with height 1, width 2T.
- Also in the formula sheet. Comes up often.

**Viz:** plot with adjustable T.

#### 4f. Sinc function

- Definition: $\text{sinc}(x) = \sin(\pi x)/(\pi x)$
- Looks like a damped oscillation centered at 0
- Critical because: the Fourier transform of a rectangular pulse **is** a sinc (and vice versa). Spoiler from formula sheet.
- For now, just introduce as a building block. We'll see why it's important when we hit Fourier.

**Viz:** sinc function plot. Mark zero crossings.

#### 4g. Unit impulse δ(t) — the most subtle one

This deserves real estate.

- **The puzzle:** how do you describe an "instantaneous event" — something that happens for zero duration but has finite "effect"? E.g. tapping a glass. The tap itself is instantaneous, but it deposits a definite amount of energy.
- **The construction (slide 30):** start with a rectangular pulse $p(t)$ of duration $\epsilon$ and height $1/\epsilon$. Note that the area under it is always 1 (by construction). Now let $\epsilon \to 0$. The pulse gets thinner and taller, but its area stays = 1. The limit is δ(t).
- δ(t) is **not a function** in the usual sense. It's a *distribution*. But for this course, treat it informally: "an infinitely narrow, infinitely tall spike with area 1".
- **Sifting property:** $\int_{-\infty}^{\infty} x(t) \delta(t-t_0)\, dt = x(t_0)$. Plain Greek: "η δ ´σαρώνει' το x(t) και διαλέγει την τιμή του x στο t₀".
- **Why we care:** when we get to convolution and impulse response, δ(t) is *the test signal* we send into systems to characterize them. Forward link to `04-systems`.

**Viz:** `<ImpulseConstruction />` — slider that decreases ε. Watch the rectangle become tall and thin. A counter shows "Εμβαδόν = 1.000" stays constant. End state: a single arrow pointing up labeled δ(t).

**Pedagogical note:** Students who saw this in math classes often have negative feelings about Dirac deltas. Don't let that scare them. Frame it as "ένα χρήσιμο εργαλείο που μοντελοποιεί στιγμιαία γεγονότα" — a useful tool, not a paradox.

---

### 5. Πώς ξεχωρίζουμε σήματα — ταξινομία

**Pacing:** this section is taxonomy. Don't drown the reader. Each subsection is short — 1-2 paragraphs + a small visual + maybe one example.

#### 5a. Πραγματικά / Μιγαδικά

- Real-valued signals: the values are real numbers. *Most everyday signals.*
- Complex-valued signals: the values are complex. *Mostly mathematical conveniences (we don't transmit complex numbers literally).*
- Why we use complex signals: easier math. We'll see the I/Q representation in later chapters.

**Viz:** real signal as a normal plot; complex signal as two plots (real part / imaginary part) side by side, or one plot in the complex plane parametrized by t.

#### 5b. ΄Αρτια / Περιττά (Even / Odd)

- **Even (άρτιο):** $x(-t) = x(t)$ → mirror-symmetric around y-axis. Cosines are even.
- **Odd (περιττό):** $x(-t) = -x(t)$ → point-symmetric around origin. Sines are odd.
- Any signal can be decomposed into even + odd parts: $x(t) = x_e(t) + x_o(t)$ where $x_e(t) = (x(t)+x(-t))/2$ and $x_o(t) = (x(t)-x(-t))/2$.
- **Why we care:** simplifies many integrals (especially when we compute Fourier coefficients).

**Viz:** `<EvenOddDecomposer />` — student draws or picks a signal, viz shows even part and odd part below.

#### 5c. Αιτιατά / Μη αιτιατά (Causal / Non-causal)

- **Causal:** $x(t) = 0$ for $t < 0$. The signal "starts" at t=0 (or later).
- **Non-causal:** has nonzero values for $t < 0$.
- **Why we care:** real-world signals (anything you record starting at some moment) are causal. Some idealized math signals aren't, which is fine for analysis.

**Viz:** small plot toggle, causal vs non-causal example.

#### 5d. Αιτιοκρατικά / Τυχαία (Deterministic / Random)

- **Deterministic:** completely described by a formula. $x(t) = \cos(2\pi \cdot 5 t)$ — given t, you know x exactly.
- **Random:** values are not predictable. Noise, speech (if you don't know what someone will say), etc.
- **Why we care:** real signals always have randomness. We'll dedicate a whole chapter to random signals.
- *Forward reference:* "Στο επόμενο κεφάλαιο σημάτων θα δούμε deterministic. Στο κεφάλαιο `Τυχαιότητα` θα μάθουμε να δουλεύουμε με τυχαίες διαδικασίες."

#### 5e. Περιοδικά / Μη περιοδικά

- **Periodic:** $x(t) = x(t+T)$ για κάθε $t$ και κάποιο σταθερό $T > 0$. Smallest such $T$ = fundamental period.
- **Aperiodic:** no such T exists.
- **Continuous-time periodicity rule (slide 10):** sum of two periodic signals $x_1$ (period $T_1$) and $x_2$ (period $T_2$) is periodic *only if* $T_1/T_2$ is rational. Otherwise no common period exists. Fun example: $\cos(2\pi t) + \cos(2\pi \sqrt{2} t)$ is **not** periodic.
- **Discrete-time periodicity rule:** $\cos(\omega_0 n)$ is periodic only if $\omega_0/(2\pi)$ is rational. **This is non-obvious** — many students are surprised that $\cos(0.5 n)$ is NOT periodic in discrete time even though its continuous version is. Spend a paragraph on this.

**Viz:** `<PeriodicityChecker />` — adjust T₁ and T₂ for two cosines. Show their sum. Show whether the result is periodic and what its period is. Highlight the rational ratio test.

---

### 6. Ενέργεια και Ισχύς

This is one of the most exam-asked classification questions (recall Jan 2026 Theme 1: "Το σήμα m(t) = cos(2πt) είναι σήμα ισχύος"). Spend time here.

#### 6a. Πότε ένα σήμα έχει "ενέργεια";

- Intuition first: imagine the signal is a voltage across a 1Ω resistor. The instantaneous power dissipated is $|x(t)|^2$. The total energy delivered over all time is $\int_{-\infty}^{\infty} |x(t)|^2 dt$.
- A signal "has finite energy" if this integral converges to a finite number.
- Examples:
  - Rectangular pulse $\Pi(t/T)$: integral over its duration is $T$. Finite. **Energy signal.**
  - $e^{-t}u(t)$ (decaying exponential starting at 0): integral converges. Energy signal.
- A pure cosine $\cos(2\pi f t)$ over all time: integral *diverges* (oscillates forever). NOT an energy signal.

#### 6b. Ορισμός

$$E_x = \int_{-\infty}^{\infty} |x(t)|^2\, dt$$

For discrete signals: $E_x = \sum_{n=-\infty}^{\infty} |x[n]|^2$.

A signal is an **energy signal** if $0 < E_x < \infty$.

#### 6c. Πότε ένα σήμα έχει "ισχύ";

- For signals that exist forever (like a cosine), total energy is infinite. Useless. Instead we ask: **on average, how much power does this signal deliver per unit time?**
- That's the average power:
$$P_x = \lim_{T\to\infty} \frac{1}{T}\int_{-T/2}^{T/2} |x(t)|^2\, dt$$

#### 6d. Σήματα ισχύος

A signal is a **power signal** if $0 < P_x < \infty$.

- A pure cosine has $P_x = A^2/2$ (we'll derive this).
- Periodic signals are typically power signals.

#### 6e. Σήματα ενέργειας vs σήματα ισχύος

**Crucial framing:**
- Energy signal → has finite energy → has **zero** average power (the energy spread over infinite time gives zero per unit time).
- Power signal → has finite (nonzero) power → has **infinite** total energy.
- A signal is **either one or neither**, never both. (E.g. a ramp $x(t) = t \cdot u(t)$ is neither.)

This is *exactly* the kind of conceptual trap that shows up on True/False exam questions. Drive it home with a `<Callout type="key">`.

#### 6f. DC και RMS

- **DC value** = average value = $\bar{x} = \lim_{T\to\infty} \frac{1}{T}\int_{-T/2}^{T/2} x(t)\, dt$
  - For a cosine, DC = 0 (averages out). For a cosine + offset, DC = the offset.
- **RMS** (root-mean-square) = $\sqrt{P_x}$
  - Interpretation: the equivalent DC level that would deliver the same power.
  - For a cosine $A\cos(\omega t)$: RMS $= A/\sqrt{2}$.
- These pop up in exams: "compute the power of $x(t) = A\cos(2\pi f_1 t) + B\sin(2\pi f_2 t)$" requires this.

**Viz:** `<EnergyPowerCalculator />` — pre-set examples (rectangular pulse, decaying exponential, pure cosine, ramp). Show whether each is energy / power / neither, with the integral animated.

**Worked example:** the cosine power derivation.
$$P = \lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2} A^2\cos^2(2\pi f t)\, dt = \frac{A^2}{2}$$
Walk through the $\cos^2 = (1+\cos(2\theta))/2$ trick step-by-step. Students often forget this.

---

### 7. Lab 2 (🧪)

Embedded LabBox. Content draws from `Εργαστήριο_2Συνεχή_και_διακριτά_σήματα.pdf` (13 slides). Topics:

- Defining a time vector in MATLAB: `t = 0:0.001:1;`
- Plotting: `plot(t, x)`, `stem(n, x)` for discrete
- Building basic signals:
  - Cosine: `x = cos(2*pi*5*t);`
  - Step: `u = double(t >= 0);`
  - Rectangular pulse: `p = double(abs(t) <= 0.5);`
  - Ramp: `r = t .* (t >= 0);`
- Periodicity check (programmatic)
- Even/odd decomposition in code
- Computing energy (numerical integration via `trapz`)

**Don't dump all this into the LabBox** — it'd be huge. Instead:
- Brief intro (2-3 sentences)
- 1-2 starter snippets directly here
- Link to the dedicated `/labs/02-signals` page where the full lab content lives

For now, the linked lab page can be a placeholder with the same kind of message we used for Lab 1: "🚧 σύντομα". **Add to COMMITMENTS.md** that the Lab 2 page needs to be built.

---

### 8. Εξάσκηση

3-5 short problems with worked solutions behind a toggle. Drawn from past exams' True/False questions and standard textbook problems.

Suggested:

1. **(True/False)** "Το σήμα $m(t) = \cos(2\pi t)$ είναι σήμα ισχύος." — Yes, it's a power signal because it's periodic. Compute $P_x = 1/2$.
2. **(True/False)** "Το άθροισμα $\cos(2\pi t) + \cos(2\pi \sqrt{2} t)$ είναι περιοδικό σήμα." — No, the ratio of periods is irrational.
3. **Compute** the power of $x(t) = A\cos(2\pi f_1 t) + B\sin(2\pi f_2 t)$ (assuming $f_1 \neq f_2$). Answer: $A^2/2 + B^2/2$. Cross terms vanish in the limit.
4. **Even/odd decomposition** of $x(t) = e^t u(t)$. Should compute $x_e$ and $x_o$ explicitly.
5. **(True/False)** "Το σήμα ράμπα $x(t) = t \cdot u(t)$ είναι σήμα ενέργειας." — No (energy diverges) and not a power signal either (power also diverges since $t^2$ grows). It's neither.

Use the `<ExamProblem>` component. Each problem has:
- Statement
- Hint (collapsible)
- Solution (collapsible)
- Tag like "True/False" or "Computation"

---

### 9. Recap + Next up

`<Recap>`:
- Σήματα είναι ποσότητες που αλλάζουν με το χρόνο
- Διαχωρίζονται σε αναλογικά/ψηφιακά (amplitude axis) και συνεχούς/διακριτού χρόνου (time axis)
- ΄Εχουμε μια βιβλιοθήκη "δομικών λίθων" (cosines, complex exponentials, u(t), Π(t), Λ(t), sinc, δ(t))
- Ταξινομούνται ως πραγματικά/μιγαδικά, άρτια/περιττά, αιτιατά, deterministic/random, periodic
- ΄Ενα σήμα είναι είτε σήμα ενέργειας, είτε σήμα ισχύος, είτε τίποτα από τα δύο

`<NextUp slug="foundations/systems">` — "Επόμενο: Συστήματα — τι κάνει ένα 'κουτί' σε ένα σήμα"

---

## Visualizations to build

Priority-ordered:

### Must-have

1. **`<EverydaySignals />`** — toggle between temperature/wave/mouse signals. Section 1.
2. **`<ContinuousVsDiscreteDemo />`** — same signal, two views. Section 2.
3. **`<FourQuadrantSignalDemo />`** — 2x2 grid showing the same signal in all 4 sampling/quantization combinations. Section 3.
4. **`<CosineExplorer />`** — sliders for A, f, φ. Section 4a.
5. **`<RotatingPhasor />`** — complex plane + time domain, the Euler formula viz. Section 4b. **Flagship for this section.**
6. **`<ImpulseConstruction />`** — animate the limit construction of δ(t). Section 4g.
7. **`<EnergyPowerCalculator />`** — preset signals, show classification. Section 6.

### Should-have

8. **`<PeriodicityChecker />`** — sum of two cosines, show whether result is periodic. Section 5e.
9. **`<EvenOddDecomposer />`** — pick a signal, show even/odd parts. Section 5b.

### Nice-to-have

10. Static plots with `<MiniPlot />` for u(t), Π(t), Λ(t), sinc(t). Section 4c-4f.

---

## Visuals strategy reminder

(See appendix in `02-intro.md` for the full policy.)

- All vizzes are custom-built React/SVG/Canvas, no external assets needed
- All plots are computed from formulas or sample data — no PDF screenshots
- No external assets required for this section

---

## Frontmatter

```yaml
title: "Σήματα — Τι είναι και πώς τα ξεχωρίζουμε"
slug: "foundations/signals"
order: 2
prerequisites: ["intro"]
examWeight: 15           # foundational — appears in True/False and feeds everything else
estimatedReadTime: 35    # minutes (lab content adds ~15 more)
lastUpdated: "2026-05-XX"
```

---

## Acceptance criteria

When this section is done:

1. ✅ All 9 numbered subsections render with content
2. ✅ All "must-have" vizzes are functional and pleasing on mobile
3. ✅ Lab 2 is embedded as a LabBox; its full page is linked (placeholder is fine for now, but added to COMMITMENTS.md)
4. ✅ At least 5 worked exam-style problems in section 8, each with collapsible solution
5. ✅ All forward references (to `04-systems`, `05-fourier-series`, `06-fourier-transform`, randomness chapter) link correctly even if pages are placeholders
6. ✅ The δ(t) section feels intuitive, not magical — `<ImpulseConstruction />` does the heavy lifting
7. ✅ The energy-vs-power treatment is rock solid — that True/False trap from Jan 2026 ("cos is a power signal") should feel obvious to anyone who read this section
8. ✅ Reading time roughly matches the estimate
9. ✅ User reviews with the "stupid student" filter — every unclear point gets fixed

---

## Updates to COMMITMENTS.md

Add these new commitments:

- [ ] **Full Lab 2 page** — promised by the LabBox link in `/foundations/signals` section 7. Target: `/labs/02-signals`.
- [ ] **Convolution definition** — referenced in `/foundations/signals` section 4g (δ(t) sifting property motivates convolution). Target: `/foundations/systems`.
- [ ] **Why complex exponentials are LTI eigenfunctions** — promised in section 4b. Target: `/foundations/systems` and made fully clear in `/foundations/fourier-transform`.

---

## What is NOT in this section

- ❌ Convolution (next section)
- ❌ Any Fourier (later sections)
- ❌ Sampling theorem (full treatment much later)
- ❌ Anything about modulation specifically

---

## After this is done

Next plan: `04-foundations-systems.md` — LTI systems, impulse response, convolution. The natural next step: now that we have signals, what does a "system" do to them?
