# 00 — Project Overview & Roadmap

This is the **map**, not the implementation guide. Per-section build plans (`01-bootstrap.md`, `02-...`) are the actual instructions handed to Claude Code.

## What we're building, in one sentence

A study site for K21 — Συστήματα Επικοινωνιών that teaches the material from the ground up with interactive visualizations, so a classmate who never properly learned signals processing can actually understand modulation, noise, and digital comms — and pass the exam.

## Pedagogical flow (independent of lecture numbering)

The course slides cover topics in a certain order. We are **not** strictly following slide order. We follow a flow that maximizes understanding for a reader who has gaps. Recap and exam-prep sections live separately and reference the main flow.

```
1. INTRO
   └─ What is a communication system? Why do we study this?
      The big picture before any math.

2. FOUNDATIONS (the SP1 recap done properly)
   ├─ Signals: what is a signal, types, energy/power
   ├─ Frequency: what does "frequency" actually mean
   ├─ Fourier series: building any periodic signal from cosines
   ├─ Fourier transform: extending to non-periodic signals
   ├─ Convolution: what it actually does, intuitively
   ├─ LTI systems & filters
   └─ Sampling theorem (light intro — full treatment later)

3. RANDOMNESS
   ├─ Why we need probability for signals (real signals are noisy & unpredictable)
   ├─ Random variables (refresher, fast, but complete)
   ├─ Random processes
   ├─ Stationarity, autocorrelation
   └─ Power spectral density

4. NOISE
   ├─ Where does noise come from physically (thermal, shot, etc.)
   ├─ White noise as a model
   ├─ Noise through filters
   └─ SNR

5. MODULATION — WHY (the bridge)
   ├─ Why we modulate at all (antenna size, multiplexing, etc.)
   └─ Carrier, message, modulated signal — the three players

6. AM (Amplitude Modulation)            ← biggest exam weight
   ├─ Conventional AM: math, spectrum, sidebands
   ├─ Modulation index μ and over-modulation
   ├─ Power: carrier vs sidebands, efficiency
   ├─ DSB-SC: suppress the carrier
   ├─ SSB: suppress one sideband too
   ├─ Demodulation: envelope detector, coherent detection
   └─ Worked exam problems

7. FM (Frequency Modulation)            ← second biggest
   ├─ The idea: encode info in instantaneous frequency
   ├─ Modulation index β
   ├─ Bessel function expansion (using the typology!)
   ├─ NBFM vs WBFM
   ├─ Carson's rule
   ├─ FM vs AM trade-offs
   └─ Worked exam problems

8. SAMPLING & ADC/DAC
   ├─ Sampling theorem (full treatment)
   ├─ Aliasing — interactive demo
   ├─ Quantization, quantization noise
   └─ DAC reconstruction

9. DIGITAL TRANSMISSION (light coverage if exams don't emphasize)
   └─ Basic digital comm concepts

10. EXAM PREP (separate, references back)
    ├─ Past exams worked through
    ├─ Common pitfalls
    ├─ Formula sheet walkthrough (interactive)
    └─ "True/False with justification" practice (Theme 1 in many exams)
```

## Lab content placement (🧪)

Lab material is embedded in `<LabBox>` components inline within the relevant theory sections:

- **Lab 1 (intro to MATLAB)** → embedded into the "Intro" / "How to use this site" area, not in any theory chapter
- **Lab 2 (continuous & discrete signals)** → inside Foundations / Signals
- **Lab 3 (continuous-time linear systems)** → inside Foundations / LTI Systems
- **Lab 4 (MISSING)** — we either skip or build something fitting between labs 3 and 5 once we know enough theory
- **Lab 5 (random signals)** → inside Randomness
- **Labs 6+** — to be created by us based on theory; will land inside Noise, AM, FM, Sampling

## Mapping pedagogical flow ↔ source slides

| Section in flow | Primary source slides |
|---|---|
| 1. Intro | `SE_session12_introduction_2025.pdf` |
| 2. Foundations | `SE_session3_theory1_2025`, `_session4_theory2_2025`, `_session56_theory3_2025`, `_session78_theory_2025` |
| 3. Randomness | `SE_session9_random1_upload.pdf` |
| 4. Noise | `SE_session10_noise.pdf` |
| 5. Modulation intro | `SE_session111213.pdf` (first part) |
| 6. AM | `SE_session111213.pdf` (AM portion) + `SE_session14_AM.pdf` (exercises) |
| 7. FM | `SE_session15_FM.pdf` + `SE_session15_16_16_FM.pdf` |
| 8. Sampling/ADC | (TBD — check session 11-13 deck for coverage; may need supplementing) |
| 9. Digital | (TBD) |
| 10. Exam prep | All past exams + `formulas.pdf` |

## Build order

We build in **two phases** for each section:

**Phase A — Plan & content extraction (in the planning chat)**
- Look at the relevant slides
- Identify what's covered, what's missing, what needs deeper treatment
- Write the per-section plan file (`plans/NN-section.md`)
- Decide on visualizations to build for that section

**Phase B — Implementation (in Claude Code)**
- Hand off the plan
- Claude Code scaffolds pages, writes content, builds vizzes
- We review, iterate, fix gaps

We do **not** build everything in parallel. One section at a time, fully done, then next.

## Iteration with the "stupid student" filter

After Claude Code implements a section, the user reads it as if they know nothing and flags every place that's unclear or feels skipped. We then go back and rewrite. This is the most important quality gate. A section is not "done" until it makes sense to someone with zero prior knowledge.

## Long-term feature additions (not v1)

Park these for later — not for the bootstrap or first content sections:
- Practice quiz mode with auto-grading
- Spaced-repetition flashcards
- Per-user note-taking
- Sharable bookmark sets

---

## What's in `plans/` and what each file is for

- `00-overview.md` (this file) — the map. Read this for big-picture orientation.
- `01-bootstrap.md` — first task for Claude Code: scaffold the empty Next.js site with all infrastructure (theming, nav, layout, MDX, KaTeX, deployment), but **no content yet**. After this is done, the site is a beautiful empty shell ready to receive content.
- `02-XX-...md` — per-section content plans, generated as we work through each topic in the planning chat.
