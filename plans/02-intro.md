# 02 — Intro section: "Τι είναι ένα Σύστημα Επικοινωνιών;"

**Goal:** The very first content the student reads. By the end of this section, they should:
1. Have a mental model of what a communication system is and what its parts do
2. Know there are *time domain* and *frequency domain* views of any signal — even if they don't yet understand why
3. Understand at a high level what *modulation* is and **why** it exists
4. Feel motivated to keep reading (especially CS students who think "I don't need this")
5. Have a clear roadmap of where the site is going

**This is not a deep section.** It's a soft landing. Math is minimal. The job here is to *paint the big picture* so every later section has context to hook into.

---

## Source material

- Primary slide deck: `SE_session12_introduction_2025.pdf` (58 slides)
- Slides 1-10 are course logistics → **skip entirely**, not relevant for the site
- Slides 11-58 are the actual content we draw from
- Key visuals to reference:
  - Slide 14: classic block diagram (transmitter / channel / receiver)
  - Slides 20-21: speech signal in time vs frequency (huge for intuition)
  - Slide 24: EM spectrum
  - Slides 26-29: frequency band table
  - Slides 41-58: "why CS people need this" / datacenters / Starlink

---

## Structure on the site

The Intro is **a single page**, not a chapter. Path: `/intro` (or `/(content)/intro/page.mdx`).

It is the first thing linked from the landing page and the first item in the sidebar.

### Page outline (sections within the page)

```
1. Καλώς ήρθες  (Hero / hook)
2. Τι είναι "επικοινωνία";
3. Η γενική δομή ενός communication system
4. Παραδείγματα από τον πραγματικό κόσμο
5. Είδη επικοινωνίας (simplex, half-duplex, full-duplex)
6. Πρώτη ματιά: σήμα στον χρόνο και στη συχνότητα  ← teaser only
7. Modulation: τι είναι και γιατί υπάρχει
8. Το ηλεκτρομαγνητικό φάσμα και πώς το μοιραζόμαστε
9. "Είμαι computer scientist, γιατί να με νοιάζει;"  ← callout for CS audience
10. (Προαιρετικό) Σύντομη ιστορική αναδρομή
11. Roadmap: τι θα μάθουμε σε αυτό το site
12. Recap + Next up
```

---

## Detailed content plan, section by section

For each section below: **(a)** what to teach, **(b)** how to teach it (intuition before math), **(c)** what components/vizzes to use.

### 1. Καλώς ήρθες (Hero)

**(a) Content:** Welcome message. One paragraph. State the philosophy: "θεωρούμε ότι ξεκινάς από το μηδέν". Mention that lab content is optional and clearly marked.

**(b) How:** Conversational tone. No equations. One sentence about what they'll be able to do by the end of the site (read a comm system block diagram, understand AM/FM, feel comfortable with Fourier).

**(c) Components:**
- Plain MDX paragraphs
- A `<Callout type="note">` explaining the 🧪 LabBox convention
- Maybe a small visual: animated waveform behind the title (decorative, optional)

---

### 2. Τι είναι "επικοινωνία";

**(a) Content:**
- Define communication informally: *"η μεταφορά πληροφορίας από έναν αποστολέα σε έναν παραλήπτη"*
- Mention Shannon-Weaver model briefly (slide 12) — but **don't overload with terminology**. We name the parts (πηγή / message / πομπός / κανάλι / δέκτης), and that's enough for now.
- A simple, relatable example: two people talking. Mouth = πομπός, αέρας = κανάλι, αυτί = δέκτης.

**(b) How:**
- Start with the everyday example *first* (two people talking)
- Then show: this same structure applies to phones, radio, internet, satellites, you name it
- Avoid technical jargon. "Πληροφορία" needs a sentence of its own — "οτιδήποτε θέλουμε να μεταφέρουμε: φωνή, εικόνα, κείμενο, αρχεία"

**(c) Components:**
- `<Callout type="intuition">` for the "two people talking" analogy
- An inline SVG diagram: simple person → arrow labeled "αέρας" → person, with stick figures and speech bubbles. Hand-drawn / friendly style. Built as a React component (`PeopleTalkingDiagram`).

---

### 3. Η γενική δομή ενός communication system

**(a) Content:**
- Introduce the formal block diagram (slide 14)
- Walk through each block in plain Greek, **one at a time**:
  - **Πηγή πληροφορίας** → "από εδώ ξεκινά αυτό που θες να στείλεις. Φωνή σου, μήνυμα, αρχείο..."
  - **Επεξεργασία σήματος / Source coding** → "πριν στείλουμε, μερικές φορές το συμπιέζουμε ή το κωδικοποιούμε για ασφάλεια"
  - **Διαμόρφωση (Modulation)** → "το βάζουμε σε μια μορφή που το μέσο μετάδοσης μπορεί να μεταφέρει — επανερχόμαστε σε λίγο"
  - **Κανάλι / Μέσο μετάδοσης** → "αέρας, καλώδιο, οπτική ίνα. Ό,τι κι αν είναι, εισάγει θόρυβο και εξασθένηση"
  - **Δέκτης** → "κάνει το αντίθετο του πομπού. Αποδιαμορφώνει, καθαρίζει, ανακτά την αρχική πληροφορία"
- Introduce the standard notation: `m(t)` = message, `s(t)` = transmitted signal, `r(t)` = received signal, `m̂(t)` = recovered message. **Explain why we put `^` on the recovered one** ("γιατί ποτέ δεν παίρνουμε ακριβώς το αρχικό — λόγω θορύβου").

**(b) How:**
- **Critical:** build up the diagram incrementally. Start with just "πηγή → κανάλι → δέκτης" (3 boxes). Then expand the πομπός into its sub-blocks. Then expand the δέκτης. Each step explained.
- Use a `<Tabs>` or step-by-step animation showing the diagram building up. Bonus points if hovering on any block shows a tooltip with what goes in / out.

**(c) Components & viz:**
- **`CommSystemDiagram`** — interactive React/SVG component
  - Props: `level` (1, 2, or 3) — controls how detailed
  - Hover/tap on a block highlights it and shows a description
  - On mobile: tappable blocks expand inline
  - This is **a flagship viz** for the intro. Spend time on it.
- `<Callout type="key">` listing the 4 signal names: m(t), s(t), r(t), m̂(t)

---

### 4. Παραδείγματα από τον πραγματικό κόσμο

**(a) Content:**
- 3-4 short examples mapping the abstract block diagram onto concrete systems:
  1. **Ραδιόφωνο FM** — μουσική στο studio = m(t), modulation = FM, κανάλι = αέρας, δέκτης = το ραδιόφωνο
  2. **Wi-Fi** — δεδομένα από laptop = m(t), modulation = OFDM (just name it, no detail), κανάλι = αέρας, δέκτης = router
  3. **Οπτική ίνα** — ψηφιακά δεδομένα → laser → light pulses, κανάλι = γυαλί, δέκτης = photodiode
  4. **Δορυφορική επικοινωνία** — short mention with a wow image

**(b) How:**
- Visual-heavy. One small icon/illustration per example.
- For each, show the same `CommSystemDiagram` with the labels filled in for that scenario. This drives home that the model is universal.

**(c) Components:**
- `<Tabs>` or grid of cards, one per example
- Reuses `CommSystemDiagram` with different labels

---

### 5. Είδη επικοινωνίας

**(a) Content:**
- **Simplex** (μονόδρομη) — radio, TV broadcast: only one direction
- **Half-duplex** (ημιαμφίδρομη) — walkie-talkie, CB radio: both directions but not simultaneous
- **Full-duplex** (αμφίδρομη ταυτόχρονη) — phone call, video chat: both ways at once

**(b) How:**
- Tiny animated SVGs showing arrows flowing — for simplex one arrow always one way; for half-duplex arrows alternate; for full-duplex two arrows simultaneous.
- Practical examples first, term second.

**(c) Components:**
- `<DuplexAnimation />` — one component, three modes via prop
- Three small cards arranged horizontally

---

### 6. Πρώτη ματιά: σήμα στον χρόνο και στη συχνότητα (TEASER)

**(a) Content:**
- Set up the idea: *"ένα σήμα μπορούμε να το δούμε με δύο τρόπους — στον χρόνο, και στη συχνότητα"*
- Use the speech signal example from slide 20 — speech in time domain looks chaotic; in frequency domain it has structure
- Then add a 500 Hz cosine on top (slide 21): cosine alone shows up as a single spike in frequency
- **DO NOT try to explain Fourier here.** Just plant the seed: "παρατήρησε ότι ένα καθαρό cosine βγάζει ένα 'καρφί' στη συχνότητα. Θα δούμε γιατί στο επόμενο κεφάλαιο."

**(b) How:**
- This is where intuition matters most. Two side-by-side plots: time on left, frequency on right.
- Pre-recorded short audio sample of speech → show its time/frequency. (We can ship a small WAV/MP3 file.)
- A toggle: "+ προσθήκη 500 Hz cosine" — adds the cosine to the signal, both plots update, student sees the spike appear.
- A second toggle to play the audio so they can hear what they're looking at.
- End with: *"Η συχνότητα δεν είναι κάτι που 'υπάρχει' στον χρόνο. Είναι ένας **διαφορετικός φακός** για να κοιτάξουμε το ίδιο σήμα. Στα επόμενα κεφάλαια θα δούμε γιατί αυτός ο φακός είναι ο πιο χρήσιμος που έχουμε."*

**(c) Components:**
- `<TimeFrequencyTeaser />` — flagship viz for this section
  - Loads a pre-shipped audio sample
  - Computes FFT client-side (use `fft.js` or implement a small one)
  - Two synced plots
  - Toggle to add the cosine
  - Audio play button
- This is one of the most important moments in the whole site. **Make it beautiful.**

---

### 7. Modulation: τι είναι και γιατί υπάρχει

**(a) Content:**
- Define: *"Modulation = παίρνω την πληροφορία μου (που είναι σε χαμηλές συχνότητες — baseband) και τη μεταφέρω σε μια ζώνη υψηλότερων συχνοτήτων (passband) γύρω από μια κεντρική συχνότητα fc."*
- The 6 reasons from slide 23, but **distilled and grouped**:
  - **Πρακτικό μέγεθος κεραίας** (the antenna argument — most important)
  - **Πολυπλεξία** (πολλά σήματα ταυτόχρονα — different stations on different frequencies)
  - **Καλύτερη μετάδοση** (less noise, longer distance, fits the medium)
- The antenna argument deserves real estate: explain that an efficient antenna needs to be ~λ/4 long, where λ = c/f. For 1 kHz audio, that's a **75 km antenna**. Modulate to 100 MHz and it becomes ~75 cm. Boom.
- Demodulation = the reverse, done at the receiver.

**(b) How:**
- **Lead with the antenna argument** because it's the most viscerally convincing. Use real numbers: "η φωνή σου έχει συχνότητες 100Hz–4kHz. Η αντίστοιχη κεραία θα ήταν χιλιόμετρα μακριά. Όχι, ευχαριστώ."
- Multiplexing: simple analogy — "σαν τα διαφορετικά κανάλια στο ραδιόφωνο. Κάθε σταθμός παίζει στη δική του συχνότητα και δεν μπερδεύονται"
- Mention this is a **teaser**: full AM/FM treatment comes later

**(c) Components:**
- `<AntennaSizeDemo />` — slider for frequency, shows resulting antenna length with a building/human/butterfly comparison (echoing the EM spectrum slide visually)
- `<Callout type="key">` summarizing the 3 grouped reasons

---

### 8. Το ηλεκτρομαγνητικό φάσμα και πώς το μοιραζόμαστε

**(a) Content:**
- Show the EM spectrum (slide 24 visual)
- Quickly walk through bands: **Radio → Microwave → Infrared → Visible → UV → X-ray → Gamma**
- Frequency vs wavelength: λ = c/f
- Then zoom into the **radio bands** specifically (slide 26): VLF, LF, MF, HF, VHF, UHF, L, S, C, X, K-band, etc.
- Real-world callouts: "AM ραδιόφωνο = MF (300kHz–3MHz), FM ραδιόφωνο = VHF (88–108 MHz), Wi-Fi = UHF & SHF (2.4 & 5 GHz)"
- Mention: regulatory side — these bands are licensed, you can't just transmit on any frequency

**(b) How:**
- Visual-heavy section. Use a horizontal scrollable spectrum visualization with markers for common technologies.
- Make it interactive: hover/tap a region → "this is where AM radio lives" / "this is microwave ovens" / "this is what 5G uses"

**(c) Components:**
- `<EMSpectrumExplorer />` — horizontal interactive scale, log-scale frequency axis, hoverable bands
- A simple table for the radio band names

---

### 9. "Είμαι computer scientist, γιατί να με νοιάζει;"

**(a) Content:** (slides 41-58)
- Direct address: most students taking K21 are CS, not EE. They might think this is irrelevant.
- Counter-argument:
  1. Datacenters: 50k servers × 100 Gb/s = 5 Pb/s of comms inside one building
  2. Cloud computing: every API call is a comm system in action
  3. Wireless: every iPhone is a software-defined radio
  4. Starlink: laser links between satellites — pure comms engineering
  5. Future: 6G, neural interfaces, optical computing
- Tone: encouraging, not lecturing

**(b) How:**
- Make it a single styled callout block — visually distinct from the main flow
- A few real numbers / stats to drive it home
- A "fun fact" or two

**(c) Components:**
- `<Callout type="cs-motivation">` — custom variant with a different color/icon to make it stand out

---

### 10. Σύντομη ιστορική αναδρομή (collapsible, optional)

**(a) Content:**
- Smoke signals → drums → optical telegraph (Chappe) → electrical telegraph (Morse 1830s) → telephone (Bell 1876) → wireless (Marconi 1890s) → radio broadcasting (1920s) → TV → satellite → fiber optics → mobile → internet → web (Berners-Lee 1989) → smartphones → 5G → satellite mesh
- Pull from slides 32-40

**(b) How:**
- Collapsed by default. Header "📚 Σύντομη ιστορική αναδρομή (προαιρετικό)"
- Inside: a horizontal timeline component or a simple chronological list
- Brief — one line per milestone

**(c) Components:**
- `<Collapsible>` wrapping a `<Timeline>` component (or just a `<ul>` if Timeline is too much for v1)

---

### 11. Roadmap: τι θα μάθουμε

**(a) Content:**
- A visual map of the rest of the site:
  - **Foundations** (signals, Fourier, systems) — "θα μάθεις να βλέπεις σήματα και στους δύο φακούς"
  - **Randomness & Noise** — "γιατί ο πραγματικός κόσμος δεν είναι ποτέ καθαρός"
  - **Modulation: AM** — "η πιο διάσημη μέθοδος, και η πιο εξεταζόμενη"
  - **Modulation: FM** — "πιο ανθεκτική στον θόρυβο, και βαριά εξεταστέα"
  - **Sampling & Digital** — "πώς το αναλογικό γίνεται ψηφιακό"
- Each item links to its section (initially most are placeholder pages)
- Visual cue for which sections are "must-know for the exam" vs "nice-to-have"

**(b) How:**
- Keep it brief and visual. A grid of cards, each with:
  - Section title
  - 1-line description
  - "Exam weight: 🔥🔥🔥" indicator (3 fire emojis = critical, 1 = light)
  - Link

**(c) Components:**
- `<RoadmapGrid />` — driven by `content/sections.ts`

---

### 12. Recap + Next up

**(a) Content:**
- `<Recap>` block with 4-5 bullets:
  - Τι είναι ένα communication system και ποια τα μέρη του
  - Ο διαχωρισμός χρόνου / συχνότητας
  - Γιατί κάνουμε modulation
  - Το ηλεκτρομαγνητικό φάσμα και τα bands
- `<NextUp slug="foundations/signals">` — "Επόμενο: Τι είναι ένα Σήμα;"

---

## Visualizations to build for this section

Priority-ordered. Each is a separate React component in `/components/viz/`.

### Must-have (block release without these is wrong)

1. **`CommSystemDiagram`** — interactive block diagram with hover tooltips, levels of detail. Used in section 3 and reused in section 4 with different labels.
2. **`TimeFrequencyTeaser`** — speech signal time + freq, with toggle to add a 500 Hz cosine. Pre-shipped audio file. Critical for section 6.

### Should-have

3. **`AntennaSizeDemo`** — frequency slider, antenna length output, scale comparison. Section 7.
4. **`EMSpectrumExplorer`** — interactive EM spectrum with bands. Section 8.

### Nice-to-have (can ship without)

5. **`PeopleTalkingDiagram`** — small SVG, decorative. Section 2.
6. **`DuplexAnimation`** — 3-mode arrow animation. Section 5.

### How to handle the audio sample for `TimeFrequencyTeaser`

- Record or find a CC-licensed short Greek-language speech sample (3-4 seconds, "Καλώς ήρθες στα Συστήματα Επικοινωνιών" or similar)
- WAV at 16 kHz mono, ~100 KB
- Place at `/public/audio/intro-speech.wav`
- Compute FFT in browser using `fft.js` (~5 KB) or implement a Cooley-Tukey ourselves (50 lines)
- Window the signal (Hamming) before FFT
- Plot magnitude spectrum

---

## Technical notes for Claude Code

### MDX component imports

This page uses the components: `Callout`, `Example`, `LabBox`, `Recap`, `NextUp`, `Tabs`, `Collapsible`, plus the vizzes listed above. Make sure all are exported from `@/components` and auto-imported into the MDX scope (or imported at the top of the MDX file).

### Frontmatter for this page

```yaml
title: "Εισαγωγή: Τι είναι ένα Σύστημα Επικοινωνιών;"
slug: "intro"
order: 1
prerequisites: []
examWeight: 5            # low — this is foundation/motivation
estimatedReadTime: 15    # minutes (lab content adds ~5 more)
lastUpdated: "2026-05-XX"
```

### Lab content for this section

There's no specific lab pdf for the intro topic. **Lab 1 (MATLAB intro)** does logically belong here — it's about getting MATLAB working and writing a first script. Embed it as a `<LabBox>` near the end (between section 11 and 12), titled "🧪 Lab 1 — Εισαγωγή στο MATLAB (Προαιρετικό)". Content:

- Quick install pointer (link to `Εγκατάσταση_του_Matlab.pdf` content — we'll digest this in a follow-up plan)
- One-liner: this lab is where you set up MATLAB and run your first signal-generating script
- A simple code snippet to whet appetite:
  ```matlab
  t = 0:0.001:1;
  x = cos(2*pi*5*t);
  plot(t, x);
  title('Πρώτο σήμα: cosine 5 Hz');
  ```
- Link to the full Lab 1 page (which we'll build later)

For now, the LabBox can be lightweight; we'll flesh it out when we tackle Lab 1 in detail.

### Accessibility

- All visualizations must work with keyboard navigation
- Audio in `TimeFrequencyTeaser` must have a play/pause button (no autoplay)
- Color choices in the spectrum visualization must work for colorblind users (don't rely on color alone for band labels)

### Mobile considerations

- `CommSystemDiagram`: on small screens, blocks stack vertically; tooltips become inline expansions
- `TimeFrequencyTeaser`: plots stack vertically on mobile (time above frequency)
- `EMSpectrumExplorer`: horizontal scroll is fine; add a scroll-hint indicator

---

## Acceptance criteria for this section

When this section is complete:

1. ✅ The page renders with all 12 numbered subsections
2. ✅ All 4 must-have / should-have vizzes are functional (CommSystemDiagram, TimeFrequencyTeaser, AntennaSizeDemo, EMSpectrumExplorer)
3. ✅ Lab 1 placeholder LabBox is present
4. ✅ Mobile layout works (test at 375px)
5. ✅ Both light and dark theme look good
6. ✅ The section is reviewed by the user using the "stupid student" filter — every place that's unclear is flagged and rewritten
7. ✅ Reading time is roughly accurate (≤ 20 min)
8. ✅ All links to future sections exist (even if they go to placeholder pages)

---

## What is NOT in this section

- ❌ Any actual Fourier math (saved for Foundations)
- ❌ Specific AM/FM equations (saved for Modulation chapters)
- ❌ Sampling theorem (saved for Sampling chapter)
- ❌ Worked exam problems (no exam content this early — but the `examWeight: 5` is set so the practice section knows this is low priority)
- ❌ Deep history (only the optional collapsible)

---

## After this is done

Next plan (`03-foundations-signals.md`) tackles the first **real** content section: "Τι είναι ένα Σήμα;" — the deep, bottom-up treatment of signals (continuous/discrete, periodic/aperiodic, energy/power, basic operations). This is where the SP1-recap-but-actually-from-scratch starts.

---

## Appendix: Visuals strategy

The original lecture slides contain various visuals (block diagrams, charts, photos). Claude Code does **not** have access to those slide images and should not try to reproduce them as bitmaps. Use the following rules per visual type:

### A. Diagrams and charts → recreate from scratch

For block diagrams (e.g. comm system architecture), schematic illustrations, and abstract diagrams (e.g. EM spectrum, frequency band tables): **build as SVG / React components from scratch**. These are described in the plan with enough detail to recreate. Custom-built versions are actually *better* than screenshots because they're themeable (light/dark), interactive, scalable, and accessible.

### B. Generated plots → compute programmatically

For signal plots (time domain, frequency spectrum, FFT outputs): **generate the data programmatically and plot with D3 / Canvas / a charting library**. Don't try to reproduce a static plot from a slide. The `TimeFrequencyTeaser` viz is the prime example — its plots are computed live from a real audio sample.

### C. Decorative slide elements → skip

NKUA logos, slide template backgrounds, the dot-network pattern on the original slides — **skip entirely**. We are not branding the site as NKUA; we have our own brand ("Signal Processing Class Hub"). Picking our own visual identity is a feature, not a regression.

### D. Photos / real-world imagery → request from the user if needed

For specific real-world photos (e.g. a datacenter, a Starlink launch, an undersea cable): if Claude Code judges that a section is significantly weakened without a photo, it should:

1. **Pause and ask the user** rather than inventing a placeholder or scraping random web images
2. The user will source a Creative Commons / public domain image and place it at `/public/images/<descriptive-name>.<ext>`
3. Claude Code then references it via `<img src="/images/...">` or Next.js `<Image>`

For **this intro section specifically**, here's the assessment:

- **Section 2** (Τι είναι επικοινωνία) — `PeopleTalkingDiagram` is custom SVG, no asset needed
- **Section 3** (basic structure) — `CommSystemDiagram` is custom SVG, no asset needed
- **Section 4** (real-world examples) — small icons per example. Use `lucide-react` icons (radio, wifi, satellite-dish, fiber are all available). **No external assets needed.**
- **Section 5** (είδη επικοινωνίας) — `DuplexAnimation` is custom SVG, no asset needed
- **Section 6** (time/freq teaser) — needs an **audio file** (see "Audio sample" below). Plots are programmatic.
- **Section 7** (modulation) — `AntennaSizeDemo` is custom, no asset needed
- **Section 8** (EM spectrum) — `EMSpectrumExplorer` is custom SVG, no asset needed. (The original slide 24 visual is a Wikipedia-derived image; we're recreating it as interactive.)
- **Section 9** (CS motivation) — *optional* photo of a datacenter would add wow factor but is not required. Claude Code should build the section without a photo first; if the user later wants to add one, drop a CC-licensed image at `/public/images/datacenter.jpg` and Claude Code can integrate it.
- **Section 10** (history) — could optionally use small portraits of Morse, Bell, Marconi, Berners-Lee, but this is decorative. Skip for v1.
- **Section 11** (roadmap) — `RoadmapGrid` uses lucide-react icons per card. No external assets needed.

### Audio sample for `TimeFrequencyTeaser`

This is the **one external asset that this section actually needs**. If Claude Code reaches the point of building `TimeFrequencyTeaser` and there's no audio file at `/public/audio/intro-speech.wav`, it should pause and ask the user to provide one.

**Spec for the user to provide:**
- Format: WAV or MP3
- Duration: 3–5 seconds
- Content: Greek speech, ideally something thematic like *"Καλώς ήρθες στα Συστήματα Επικοινωνιών"* or any natural-speech sample with vowels and consonants (vowels show up as nice harmonic structure in the FFT, which is part of the teaching point)
- Sample rate: 16 kHz mono is fine; 44.1 kHz is also fine
- File size: under 500 KB
- Place at: `/public/audio/intro-speech.wav` (or `.mp3`)

The user can record this themselves with any phone or QuickTime / Voice Memos. No fancy audio production needed.

### Summary

For the entire intro section, the **only external asset Claude Code needs from the user is the audio sample**. Everything else is built from scratch using SVG/React/D3, lucide-react icons, or programmatically generated plots. If at any point Claude Code feels a section needs a photo, it should ask first rather than improvise.
