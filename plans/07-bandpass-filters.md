# 07 — Foundations / Bandpass Signals & Φίλτρα

**Goal:** The last foundations chapter. It does two things at once: (a) introduces **bandpass signals** as the canonical form of every modulated waveform — `x(t) = x_I(t)cos(2πf_c t) - x_Q(t)sin(2πf_c t)` — which sets up AM and FM as special cases. (b) Treats **ideal and real filters** as the LTI systems that select frequency bands — closing the loop with the eigenfunction property and laying the groundwork for demodulation, channel selection, etc.

By the end the reader should:

1. Distinguish **baseband** from **bandpass** signals — what spectrum each has and the canonical examples (audio voice = baseband, AM/FM radio = bandpass).
2. Understand the **Hilbert transform** as a "phase-shifter by -π/2 for positive frequencies, +π/2 for negative" — and why it shows up exactly when we want to manipulate bandpass signals.
3. Construct the **pre-envelope** $x_p(t) = x(t) + j\hat{x}(t)$ and see that its spectrum is **one-sided** (only positive frequencies).
4. Define the **complex envelope** $g(t) = x_p(t)e^{-j2\pi f_c t}$ and understand it as "the bandpass signal demodulated down to baseband".
5. Read and use the **canonical bandpass form** $x(t) = x_I(t)\cos(2\pi f_c t) - x_Q(t)\sin(2\pi f_c t)$ — recognizing $x_I$ as in-phase, $x_Q$ as quadrature, $V(t) = \sqrt{x_I^2 + x_Q^2}$ as envelope, $\theta(t) = \arctan(x_Q/x_I)$ as phase.
6. Recognize the **four ideal filter types** (LP, HP, BP, BS) by their frequency response $|H(f)|$ shape and know they are **non-causal** (theoretical idealizations).
7. Read a **real filter spec** — passband ripple $\delta_p$, stopband ripple $\delta_s$, transition band $f_p$ to $f_s$ — and understand why ideal cannot be achieved.

This chapter is **the last bridge before AM modulation**. Every concept here unblocks something in the modulation chapters.

---

## Closes commitments

- **Bandpass signals and ideal filters** (from FT chapter Section 11 + COMMITMENTS) — closed by Sections 1, 5, 6 of this page
- **Hilbert transform** (was an open promise from the FT chapter — referenced but not built) — closed in Section 2
- **Why even h(t) gives real H(f) connects to ideal filters** (open commitment from systems chapter) — closed in Section 6 (ideal filters have even h(t) in time, hence real H(f), and that's why they have zero phase distortion but are non-causal)

## Adds commitments

- **AM modulation as a bandpass signal with $x_Q = 0$** — explicitly previewed in Section 5, fully treated in `/modulation/am`
- **FM modulation as constant-envelope bandpass with $\theta(t)$ encoding the message** — previewed in Section 5, fully treated in `/modulation/fm`
- **Quadrature receiver / demodulator architecture** — the fact that $x_I, x_Q$ can be extracted by multiplying with $\cos(2\pi f_c t)$ and $-\sin(2\pi f_c t)$ and lowpass filtering — full treatment in modulation chapters

---

## Source material

- Primary slides: `SE_session78_theory_2025.pdf` slides 17-46
  - Slide 17-18: Hilbert transform definition + properties + example
  - Slide 19: Modulation transition (intro)
  - Slide 20: Baseband vs bandpass signals (overview)
  - Slide 21-22: Baseband signal definition + voice spectrum example
  - Slide 23-26: Bandpass signal definition + TV/radio examples + the modulation theorem reused
  - Slide 27: Pre-envelope (with the one-sided-spectrum diagram)
  - Slide 28-29: Complex envelope $g(t)$
  - Slide 30-31: I/Q components and polar form
  - Slide 32-35: Worked modulation examples
  - Slide 36: Filter concept
  - Slide 37: Ideal LP filter
  - Slide 38: Ideal HP filter
  - Slide 39: Ideal BS filter
  - Slide 40: Ideal BP filter
  - Slide 41: Passband / stopband definitions
  - Slide 42-46: Non-ideal LP filter specs

The lecture's typology (`formulas.pdf`) covers the Hilbert transform formula and the canonical bandpass form. Flag both as "✓ Στο τυπολόγιο".

---

## Where this lives on the site

Path: `/foundations/bandpass-filters`

Sidebar group: **Foundations → Bandpass & Φίλτρα** (last chapter of Foundations)

---

## Page outline

```
1. Baseband vs Bandpass — δύο οικογένειες σημάτων
   1a. Baseband signals
   1b. Bandpass signals
   1c. Παραδείγματα από τον πραγματικό κόσμο

2. Hilbert transform — phase-shifter όλων των συχνοτήτων κατά π/2
   2a. Ο ορισμός και η οπτική στη συχνότητα
   2b. Παράδειγμα: cosine → sine
   2c. Ιδιότητες (απλώς για reference)
   2d. Γιατί τη χρειαζόμαστε εδώ

3. Pre-envelope — το ζωνοπερατό σήμα ως «μονόπλευρο φάσμα»
   3a. Ορισμός x_p(t) = x(t) + j·x̂(t)
   3b. Φάσμα του x_p(t): η αρνητική πλευρά εξαφανίζεται
   3c. Διαισθητική σύνδεση με τα complex exponentials

4. Complex envelope — το demodulated baseband ισοδύναμο
   4a. Ορισμός g(t) = x_p(t) · e^(-j2πf_c t)
   4b. Η φασματική εικόνα: ολίσθηση από +f_c στο 0
   4c. Από εδώ προκύπτει: x(t) = Re{g(t) · e^(j2πf_c t)}

5. I/Q components — η canonical μορφή ΚΑΘΕ ζωνοπερατού σήματος
   5a. Η εξίσωση που κρύβει τα πάντα
   5b. Envelope V(t), φάση θ(t), και τα δύο μαζί
   5c. Πέντε εξειδικεύσεις: AM, DSB-SC, SSB, FM, PM

6. Φίλτρα — τα LTI που επιλέγουν συχνότητες
   6a. Τι είναι ένα φίλτρο
   6b. Τα τέσσερα ιδανικά φίλτρα: LP, HP, BP, BS
   6c. Passband, stopband, cutoff

7. Real (non-ideal) φίλτρα
   7a. Γιατί τα ιδανικά δεν υλοποιούνται (non-causal)
   7b. Real spec: ripple, transition band
   7c. Trade-offs (sharper cutoff = πιο μακριά impulse response)

8. Recap + Next up
```

---

## Detailed content per section

### 1. Baseband vs Bandpass

**Pedagogical intent.** Frame this as the natural classification that emerges once you have the FT chapter in hand. Spectrum-centered around 0 → baseband. Spectrum-centered around some $\pm f_c$ → bandpass. Both are real signals, both can be analyzed with FT, but they have **different roles** in communication systems: baseband = original information, bandpass = signal in transit on a carrier.

**Connection to what's been built.** The FT chapter's modulation theorem already showed that multiplication by `cos(2πf_c t)` shifts the spectrum from baseband to bandpass. So bandpass signals aren't a new species — they're what we **get** when we modulate. This chapter just gives them a name and a canonical form to work with.

**Goals for the student:**
- Recognize a baseband signal from its spectrum (concentrated around 0)
- Recognize a bandpass signal from its spectrum (concentrated around `±f_c`)
- Understand why "narrowband" matters: $W \ll f_c$ means the signal is much narrower than the carrier frequency, which justifies treating $f_c$ as constant in many derivations

**Visualizations.**
- A spectrum-comparison viz: pick a signal type (voice, AM radio, TV), see its spectrum; toggle between "baseband form" and "bandpass form" (modulated up to a carrier)
- This is reusable from Section 7 of the FT chapter (`<ModulationTheoremViz />`) — back-link if appropriate, or build a smaller dedicated one

**Real-world examples table.** Make this concrete:

| Signal | Type | Bandwidth | Carrier (if any) |
|---|---|---|---|
| Human voice | Baseband | ~3-4 kHz | — |
| AM radio | Bandpass | ~10 kHz | 540-1700 kHz |
| FM radio | Bandpass | ~200 kHz | 88-108 MHz |
| Wi-Fi (2.4 GHz) | Bandpass | ~20-40 MHz | 2.4 GHz |
| 4G LTE | Bandpass | ~1.4-20 MHz | 700 MHz - 2.6 GHz |

The student should walk away knowing that **almost everything they encounter in real life is bandpass** — phones, radios, TV, Wi-Fi, GPS. Baseband shows up at the source (the audio signal in your microphone) and the destination (after demodulation in your speaker), but in transit, signals are bandpass.

---

### 2. Hilbert transform

**Pedagogical intent.** This is the new tool we need before we can build pre-envelope and complex envelope. Introduce it with frequency-domain intuition first (it's just a phase shifter), formula second.

**The framing that works:**

The Hilbert transform $\hat{x}(t) = \mathcal{H}\{x(t)\}$ is defined in the time domain by convolution with $\frac{1}{\pi t}$:
$$\hat{x}(t) = \frac{1}{\pi}\int_{-\infty}^{\infty} \frac{x(\tau)}{t - \tau}\, d\tau$$

But the **frequency-domain definition is far more illuminating**:
$$\mathcal{H}\{x(t)\} \overset{\mathcal{F}}{\longleftrightarrow} -j\,\text{sgn}(f)\, X(f)$$

In words: **the Hilbert transform multiplies positive frequencies by $-j$ (= phase shift of $-\pi/2$) and negative frequencies by $+j$ (= phase shift of $+\pi/2$)**. The magnitude spectrum is unchanged; only phases shift.

**The canonical example to build intuition:**

What is the Hilbert transform of $\cos(2\pi f_0 t)$?

Cosine has spectrum: ½δ(f-f₀) at +f₀ (real positive) and ½δ(f+f₀) at -f₀ (real positive). After Hilbert (multiply +f by -j, -f by +j):
- At +f₀: ½ becomes -j/2
- At -f₀: ½ becomes +j/2

That spectrum corresponds to... $\sin(2\pi f_0 t)$ — exactly the cosine shifted by $-\pi/2$ in time.

So **the Hilbert transform turns cos into sin, sin into -cos, etc.** The "phase shift by -π/2" is literal at every frequency.

**Properties to mention** (per slide 17, briefly, no need to derive):
- $\mathcal{H}\{\mathcal{H}\{x\}\} = -x$ (apply twice → flips sign — because applying -j twice gives -1)
- $x(t)$ and $\hat{x}(t)$ are orthogonal (zero correlation)
- Distributivity over convolution

**Why we need it here:** because the pre-envelope uses it. We're about to build $x(t) + j\hat{x}(t)$, and the result has a beautifully clean spectrum — but only if we use Hilbert as the imaginary part. Section 3 explains why.

**Visualizations:**
- A "Hilbert in action" viz: input = a few preset signals (cosine, square wave, narrowband bump). Show input spectrum, Hilbert spectrum (with -j·sgn(f) annotation), and output time signal. Critical: highlight that the cosine becomes a sine, makes the abstraction concrete.

**Tag "✓ Στο τυπολόγιο"** for the formula and the -j·sgn(f) frequency-domain version.

---

### 3. Pre-envelope $x_p(t)$

**Pedagogical intent.** Show that combining the signal with its Hilbert transform via $x_p(t) = x(t) + j\hat{x}(t)$ produces something with a remarkable property: **its spectrum has no negative frequencies**. The negative-frequency side gets killed.

**The clean derivation:**

$$X_p(f) = X(f) + j\cdot[-j\,\text{sgn}(f)]\,X(f) = X(f) + \text{sgn}(f)\,X(f) = (1 + \text{sgn}(f))\,X(f)$$

So:
- For $f > 0$: $X_p(f) = 2X(f)$ (positive side **doubled**)
- For $f < 0$: $X_p(f) = 0$ (negative side **vanishes**)
- For $f = 0$: $X_p(f) = X(0)$

**The deep meaning.** A real signal has redundant negative-frequency content (conjugate symmetry). The pre-envelope is a *clever way to repackage the same information using only positive frequencies*. We give up "real-valued in time" to get "one-sided in frequency". Useful trade-off when working with bandpass signals — much easier to manipulate in math and in DSP code.

**Connection back to spectrum-conventions reference.** This is yet another reason students see the "one-sided spectrum" idea, but from a different angle. In `/reference/spectrum-conventions` we showed one-sided as a *visualization choice*. Here it's a *mathematical construction* that genuinely makes the spectrum one-sided. Worth a callout linking back.

**Visualizations:**
- Spectrum-side-by-side viz: a real bandpass signal's two-sided spectrum on the left, its pre-envelope's one-sided spectrum on the right. Annotation showing the +f side doubled, -f side vanished.

---

### 4. Complex envelope $g(t)$

**Pedagogical intent.** Take the pre-envelope (one-sided around $\pm f_c$, but spectrum sits at $+f_c$) and **shift it down to baseband** by multiplying with $e^{-j2\pi f_c t}$. The result is the complex envelope $g(t)$ — a complex-valued, baseband signal that contains all the information of the original bandpass signal.

**The construction:**
$$g(t) = x_p(t)\, e^{-j2\pi f_c t}$$

**What this does in frequency.** Multiplication by $e^{-j2\pi f_c t}$ shifts spectrum by $-f_c$ (frequency-shift property from FT chapter). Pre-envelope $X_p(f)$ was concentrated around $+f_c$; after shift, $G(f)$ is concentrated around $0$. **Now we're back at baseband, but with a complex-valued signal.**

**The reverse direction — reconstructing $x(t)$ from $g(t)$:**

Solving for $x_p(t)$: $x_p(t) = g(t) e^{j2\pi f_c t}$.

Then taking the real part (since $x(t) = \text{Re}\{x_p(t)\}$):

$$\boxed{x(t) = \text{Re}\{g(t)\, e^{j2\pi f_c t}\}}$$

**This is the canonical form for any bandpass signal**, written in complex envelope notation. Every modulation we'll study (AM, DSB-SC, SSB, FM, PM) is fundamentally a **specific choice of $g(t)$**. That's why the complex envelope is so powerful — once you have $g(t)$, you have *all* the information about the modulation.

**Visualizations:**
- A "frequency translation" viz: spectrum of $X_p(f)$ around $+f_c$, slider for $f_c$ (or instead "go!" button), watch it slide down to $G(f)$ around $0$. Annotation: "this is what demodulation does".

---

### 5. I/Q components — the canonical form

**Pedagogical intent.** This is the **biggest payoff section of the whole chapter**. Decompose $g(t)$ into real and imaginary parts: $g(t) = x_I(t) + j\, x_Q(t)$. Then the boxed equation from Section 4 unfolds:

$$x(t) = \text{Re}\{(x_I + jx_Q)(\cos(2\pi f_c t) + j\sin(2\pi f_c t))\}$$
$$= x_I(t)\cos(2\pi f_c t) - x_Q(t)\sin(2\pi f_c t)$$

**The canonical form of every bandpass signal:**

$$\boxed{x(t) = x_I(t)\,\cos(2\pi f_c t) - x_Q(t)\,\sin(2\pi f_c t)}$$

- $x_I(t)$ — **in-phase** component (real part of complex envelope)
- $x_Q(t)$ — **quadrature** component (imaginary part of complex envelope)
- Both $x_I$ and $x_Q$ are **real, baseband** signals

**The polar interpretation:**
- **Envelope** $V(t) = |g(t)| = \sqrt{x_I^2(t) + x_Q^2(t)}$
- **Instantaneous phase** $\theta(t) = \arg(g(t)) = \arctan(x_Q(t)/x_I(t))$
- Bandpass signal in polar: $x(t) = V(t)\cos(2\pi f_c t + \theta(t))$

**Why this is the most important section.** Every modulation scheme is a special case:

| Modulation | $x_I(t)$ | $x_Q(t)$ | $V(t)$ | $\theta(t)$ |
|---|---|---|---|---|
| **AM** (with carrier) | $A_c[1 + k_a m(t)]$ | $0$ | $A_c[1+k_a m(t)]$ | $0$ |
| **DSB-SC** | $A_c m(t)$ | $0$ | $|A_c m(t)|$ | $0$ or $\pi$ |
| **FM** | $A_c\cos(\phi(t))$ | $-A_c\sin(\phi(t))$ | $A_c$ | $\phi(t)$ |
| **PM** | $A_c\cos(k_p m(t))$ | $-A_c\sin(k_p m(t))$ | $A_c$ | $k_p m(t)$ |
| **SSB** | $A_c m(t)/2$ | $\mp A_c \hat{m}(t)/2$ | varies | varies |

**This is the table the student will refer back to in every modulation chapter.** Promise that the next chapters (AM, FM) will derive each of these rows starting from this canonical form. That's the bridge.

**Visualizations:**
- An "I/Q decomposition" viz: take a bandpass signal (e.g. AM-modulated tone, or FM-modulated tone), see its $x_I$ and $x_Q$ components extracted in real time. Polar form too: trace $(x_I(t), x_Q(t))$ in the complex plane to see the envelope and phase trajectory directly. **For AM the trace is along the real axis. For FM it's a circle. This single viz makes the AM-vs-FM distinction visceral.**

**Tag "✓ Στο τυπολόγιο"** for the canonical bandpass form.

---

### 6. Φίλτρα — what they are and the four ideal types

**Pedagogical intent.** Filters are the LTI systems that selectively pass / block frequencies. Now that we have $H(f)$ from the FT chapter, filters are just LTI systems with specific $|H(f)|$ shapes.

**Connection back.** Recap: from the FT chapter, an LTI system has frequency response $H(f) = \mathcal{F}\{h(t)\}$, and output spectrum $Y(f) = X(f)\cdot H(f)$. A **filter** is a particular kind of LTI where we *care about which frequencies pass* — passing some, blocking others.

**The four ideal filters (slides 37-40):**

1. **Lowpass (LP):** $|H(f)| = 1$ for $|f| < f_c$, $0$ otherwise. Passes low frequencies, blocks high.
2. **Highpass (HP):** $|H(f)| = 0$ for $|f| < f_c$, $1$ otherwise. Passes high frequencies, blocks low.
3. **Bandpass (BP):** $|H(f)| = 1$ for $f_1 < |f| < f_2$, $0$ otherwise. Passes a band of frequencies.
4. **Bandstop (BS) / Notch:** $|H(f)| = 0$ for $f_1 < |f| < f_2$, $1$ otherwise. Blocks a band, passes the rest.

**Closes commitment from systems chapter:** the systems chapter teased that "signals with even $h(t)$ have real $H(f)$" and "no time delay", but couldn't give a concrete example because we hadn't covered filters yet. **Now we can:** ideal filters have $|H(f)|$ that is *real* (and even, mostly), which means their impulse response $h(t)$ is even, which means **they don't introduce time delay**. This is the canonical example of the symmetry we promised would land here.

**The catch:** ideal filters are **non-causal** — their impulse response is non-zero for $t < 0$, which means they would need to "see the future". Physically impossible. We work with them mathematically as idealizations, but every real filter is an *approximation*.

**Vocabulary (slide 41):**
- **Passband** (ζώνη διέλευσης): frequencies that pass through unattenuated
- **Stopband** (ζώνη αποκοπής): frequencies that are blocked
- **Cutoff frequency** $f_c$: the boundary

**Visualizations:**
- An interactive filter viewer: pick filter type (LP / HP / BP / BS), see $|H(f)|$, see input signal spectrum, see output spectrum (= input × filter response). Multiple test signals: pure tone, sum of tones, broadband.
- Bonus: show $h(t)$ for ideal LP — students see it's a sinc, which extends to $-\infty$ and $+\infty$. **That visual immediately makes the non-causality concrete.**

**Tag "✓ Στο τυπολόγιο"** for the four ideal filter shapes.

---

### 7. Real (non-ideal) φίλτρα

**Pedagogical intent.** Briefly cover what real filters look like, with the canonical specs. Don't go deep into filter design — that's a whole separate course. Just enough so students can read a filter datasheet or recognize a filter spec on an exam.

**The canonical real-filter spec (slide 42):**

A real lowpass filter has:
- **Passband** $|f| < f_p$: $|H(f)| \in [1-\delta_p, 1+\delta_p]$ — small ripple around 1
- **Transition band** $f_p < |f| < f_s$: monotonic decrease, no spec
- **Stopband** $|f| > f_s$: $|H(f)| < \delta_s$ — small ripple around 0

Where:
- $\delta_p$ = passband ripple
- $\delta_s$ = stopband ripple
- $f_p$ = passband edge
- $f_s$ = stopband edge

**Trade-offs to mention briefly:**
- Sharper cutoff (smaller transition band) → longer impulse response → more delay, more memory needed
- Smaller ripples → also more complex filter
- This is the fundamental design tension; specific filter designs (Butterworth, Chebyshev, elliptic) trade off these differently — but those are out of scope for this course

**Why this matters for this course:** when we get to AM demodulation, we'll need a lowpass filter to recover the message after envelope detection. The filter won't be ideal — it'll have these specs. Students should know what those specs mean.

**Visualizations:**
- Compare ideal vs real LP filter: side by side, same `f_p`. Real one has the ripple + transition band visible. Maybe a slider for "filter order" that morphs from a coarse approximation to a sharp one, showing the ripple-vs-sharpness trade-off.

---

### 8. Recap + Next up

**Recap content** (per existing convention — bullet list of takeaways):

- Σήματα κατατάσσονται σε **baseband** (φάσμα γύρω από 0) και **bandpass** (φάσμα γύρω από ±f_c)
- Η **Hilbert transform** είναι ένας phase-shifter: -π/2 για θετικές συχνότητες, +π/2 για αρνητικές. Το μέτρο μένει αμετάβλητο, αλλάζει μόνο η φάση
- Η **pre-envelope** $x_p = x + j\hat{x}$ έχει μονόπλευρο φάσμα (μηδέν στις αρνητικές συχνότητες)
- Η **complex envelope** $g = x_p \cdot e^{-j2\pi f_c t}$ μεταφέρει το ζωνοπερατό στο baseband, διατηρώντας όλη την πληροφορία
- Κάθε ζωνοπερατό σήμα γράφεται ως $x(t) = x_I\cos(2\pi f_c t) - x_Q\sin(2\pi f_c t)$. Αυτή είναι η **canonical form** που ξεδιπλώνει όλες τις διαμορφώσεις
- AM, FM, PM, SSB είναι όλες ειδικές περιπτώσεις αυτής της μορφής — διαφορετικές επιλογές για $x_I$ και $x_Q$
- Ένα **φίλτρο** είναι ένα LTI με συγκεκριμένη μορφή του $|H(f)|$. Τέσσερα ιδανικά: LP, HP, BP, BS
- Τα ιδανικά φίλτρα είναι μη-αιτιατά (μη υλοποιήσιμα). Real φίλτρα έχουν passband ripple, transition band, stopband ripple — και υπάρχει trade-off ανάμεσα στη σαφήνεια του cutoff και την πολυπλοκότητα

**🎯 Closes commitments:** list the three commitments closed by this chapter (bandpass signals + Hilbert + ideal filters).

**Next up:** This is the **end of Foundations**. The next plan starts the modulation chapters — `/modulation/am` first.

`<NextUp slug="modulation/am">` — *"Επόμενο: AM modulation — η πρώτη και πιο διαδεδομένη μορφή ραδιοφωνικής εκπομπής. Θα δούμε το `x_Q = 0` case σε δράση."*

---

## Pedagogical landmines to watch

These are spots where students will likely get stuck. The plan should pre-empt them in prose, not leave them to inference.

1. **The Hilbert transform's "phase shift by -π/2 for +f, +π/2 for -f"** — students often confuse "for positive f" with "for positive signals". Make clear it's about the *frequency axis*, not the sign of the signal.

2. **Why the pre-envelope's negative spectrum vanishes** — the algebra `(1 + sgn(f))·X(f)` is short, but the *intuition* (we're adding the signal to a signal whose Hilbert transform has 90° lagging phase, and they constructively add at +f, destructively cancel at -f) deserves a sentence.

3. **The complex envelope is complex-valued** — students who absorbed earlier complex-conjugate-symmetry intuition may be confused why we now have a *complex* signal as output. Worth a clarifying note: $g(t)$ being complex isn't a problem; it's by design — that's what lets it carry both magnitude and phase information without redundancy.

4. **The minus sign in `x_I cos - x_Q sin`** — this is *not* an error. It comes from `Re{g·e^(jωt)} = Re{(x_I + jx_Q)(cos + jsin)} = x_I cos - x_Q sin`. The minus is genuine and consequential. Many students miss it and write `+` instead. Worth a callout.

5. **Why ideal filters can't be physically built** — *non-causal impulse response* is the right answer. A sinc extends to $-\infty$, meaning the filter would need to know the input *before* it arrives. Worth a concrete sketch of the sinc impulse response showing it extends backward in time.

---

## Visualizations to build

Priority order:

### Must-have (load-bearing)

1. **`<HilbertTransformViz />`** — input cosine, see it become sine. Sliders for input parameters. Section 2.
2. **`<PreEnvelopeSpectrumViz />`** — bandpass signal spectrum vs its pre-envelope spectrum, side by side. Annotation: "+f side doubled, -f vanishes". Section 3.
3. **`<IQDecompositionViz />`** — flagship of this chapter. Bandpass signal in time, $x_I$ and $x_Q$ extracted, polar trace $(x_I, x_Q)$ in complex plane. Presets for AM, FM. Section 5.
4. **`<FilterTypeViewer />`** — pick filter type (LP/HP/BP/BS), see $|H(f)|$, apply to input spectrum, see output. Section 6.
5. **`<IdealVsRealFilterViz />`** — ideal LP vs real LP comparison. Show ripple, transition band, ideal sinc impulse response. Section 7.

### Should-have

6. **`<ComplexEnvelopeShiftViz />`** — pre-envelope spectrum shifting from $+f_c$ down to $0$. Section 4.
7. **`<BasebandVsBandpassChooser />`** — pick a real-world signal, toggle baseband/bandpass form, see spectrum. Section 1. (Could be a simplified `<ModulationTheoremViz />` from FT chapter — back-link instead if not worth rebuilding.)

---

## Frontmatter

```yaml
title: "Bandpass signals και Φίλτρα"
slug: "foundations/bandpass-filters"
order: 6
prerequisites: ["foundations/signals", "foundations/systems", "foundations/fourier-series", "foundations/fourier-transform"]
examWeight: 8       # not heavily weighted on its own, but its concepts are baked into every modulation problem (~30-40% of exam)
estimatedReadTime: 35
lastUpdated: "2026-05-XX"
```

---

## Acceptance criteria

When the chapter ships:

1. ✅ All 8 sections render with content
2. ✅ All 5 must-have vizzes functional and tested on mobile
3. ✅ The I/Q canonical form table (5 modulations as rows) is present and explicit — this is the bridge to every subsequent chapter
4. ✅ The Hilbert transform's frequency-domain definition (-j·sgn(f)) is the *primary* framing; the time-domain convolution is secondary
5. ✅ The non-causality of ideal filters is explicit, with a sinc impulse response sketch
6. ✅ The 5 pedagogical landmines from the section above are addressed in prose
7. ✅ Closes 3 commitments (bandpass, Hilbert, ideal filters / even h)
8. ✅ The "this is the bridge to AM/FM" framing is explicit, with a forward link to `/modulation/am`
9. ✅ User reviews — stupid student filter passes; if the I/Q decomposition or complex envelope feel like magic, fix before moving on

---

## Updates to COMMITMENTS.md

**Closes (move to "Fulfilled"):**
- Bandpass signals — Section 1, 5
- Hilbert transform — Section 2
- Ideal filters and the non-causality trade-off — Section 6, 7
- Why even h(t) gives real H(f) (concrete example via ideal filters) — Section 6

**Adds new commitments:**
- [ ] **AM modulation as $x_Q = 0$ case of canonical bandpass form** — Section 5 promises full treatment in `/modulation/am`. Closing target: AM chapter Section 1.
- [ ] **FM modulation as constant-envelope $V = $const, message-encoded $\theta(t)$** — Section 5 promises full treatment in `/modulation/fm`. Closing target: FM chapter Section 1.
- [ ] **Quadrature receiver architecture** — Section 5 hints that $x_I, x_Q$ are extractable by mixer + lowpass. Full treatment in modulation chapters.

---

## What is NOT in this section

- ❌ Specific modulation schemes (AM, FM details — next chapters)
- ❌ Filter design methods (Butterworth, Chebyshev — out of scope)
- ❌ Sampling theorem (separate chapter `/sampling-adc`)
- ❌ Hilbert transform proof of orthogonality (just stated)
- ❌ Quadrature receiver architecture diagrams (modulation chapters)

---

## After this is done

This concludes Foundations. Next plan: `08-am-modulation.md` — the first modulation chapter, where we finally cash in everything.

The user previously mentioned a possible **Foundations recap page** to be built later. After this plan ships and is reviewed, that's the natural next decision — build the recap before AM, or push straight into modulation. We'll discuss when we get there.
