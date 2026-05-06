# Signal Processing Class Hub

Educational website for the **Συστήματα Επικοινωνιών (K21)** course at NKUA (Department of Informatics & Telecommunications, 4th semester). Built to help classmates actually understand the material — not just memorize it for the exam.

---

## Project identity

- **Name:** Signal Processing Class Hub
- **Audience:** Undergraduate students taking K21 — Συστήματα Επικοινωνιών. Some take the optional MATLAB lab, some don't. The site serves both.
- **Goal:** A study companion that builds understanding from zero. Reader is treated as smart but with significant gaps in prior knowledge.

## Tech stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Math rendering:** KaTeX (via `react-katex` or `rehype-katex` for MDX)
- **Content authoring:** MDX (Markdown + JSX) — lets us mix prose, equations, and interactive React components seamlessly
- **Visualizations:** D3.js for data-driven plots; plain Canvas/SVG for simple animations; React state + sliders for interactive demos
- **Backend:** Supabase (Postgres + Auth) for comments, replies, profiles, leaderboard
- **Auth:** Supabase Auth — email magic link + Google OAuth. Public read, sign-in required to post.
- **Deployment:** Vercel (auto-deploy from `main` branch)
- **Client-only state (progress, bookmarks, theme):** `localStorage`

## Repository conventions

```
/app                        Next.js App Router pages
  /(content)                Route group for all study content
    /foundations
      /signals/page.mdx
      /fourier/page.mdx
      ...
    /modulation
      /am/page.mdx
      /fm/page.mdx
    ...
  /practice                 Exam practice hub
  /formulas                 Interactive formula sheet
  /sign-in                  Auth (magic link + Google)
  /profile                  User profile (display name, avatar, my comments)
  /auth/callback            OAuth / OTP exchange
  /auth/sign-out            POST → sign out
  layout.tsx                Root layout (theme, nav, footer)
  page.tsx                  Landing page

/components
  /ui                       Generic UI: Button, Card, Tabs, Collapsible, etc.
  /math                     Math rendering helpers (Eq, InlineMath, BlockMath)
  /viz                      Interactive visualizations (SignalBuilder, AMDemo, FFTViewer, ...)
  /layout                   Header, Sidebar, ProgressDot, Bookmark, ThemeToggle, Comments, UserMenu
  /content                  Reusable content blocks: Callout, LabBox, Example, ExamProblem

/lib                        Utilities (math helpers, signal generation, storage)
  /supabase                 Browser + server clients, types, middleware helper
/content                    Static content data (lecture index, exam questions, formula table)
/public                     Static assets
/supabase/migrations        Postgres schema + RLS policies

/plans                      Per-section build plans (handed to Claude Code one at a time)
```

### Auth + RLS model

- Two roles in `profiles.role`: `user` (default) and `moderator`.
- A profile row is auto-created on signup via the `handle_new_user` trigger.
- Posting comments/replies inserts only as `auth.uid()` and cannot self-award points or self-resolve — RLS enforces this.
- Authors can delete their own comment/reply within 10 minutes; moderators always.
- `is_claude_reply = true` replies are moderator-only.
- See `supabase/migrations/0001_init.sql` for the canonical policy set.

### File & folder naming

- Routes use `kebab-case` and Greek-friendly slugs are translated to English (e.g. `/modulation/am`, not `/διαμόρφωση`)
- Component files use `PascalCase.tsx`
- MDX content files are always named `page.mdx`

---

## Teaching philosophy (NON-NEGOTIABLE)

These rules apply to **every word of educational content** on the site. They do **not** apply to chrome (button labels, error states, etc.).

### 1. Language

- **Educational content is in Greek.**
- **English technical terms stay in English** when they are more natural than the Greek equivalent. Examples: *signal*, *frequency domain*, *sampling*, *modulation*, *carrier*, *bandwidth*, *Fourier transform*, *PSD*, *SNR*, *envelope detector*.
- Mix freely: "Το σήμα στο frequency domain..." is perfect.
- UI chrome (nav labels, buttons) → Greek primarily, but English where it's standard ("Search", "Bookmark" are fine).

### 2. Zero assumptions

- Never assume any concept is obvious. **Even "what is a signal?"** must be explained from scratch with intuition before any math.
- Never write "as you recall from SP1...", "you already know that...", "obviously...", "trivially...". Just explain it fresh.
- Treat every reader as if they either forgot SP1 or never properly understood it.

### 3. Bottom-up

- Every new concept must be grounded in something already explained earlier in the site.
- Never introduce a definition without first explaining **why it exists** and **why it matters**.
- If a section needs a concept that hasn't been built yet, either build it first or link to where it's built.

### 4. Understanding over memorization

- The goal is "**why does this work?**", not "**what is this?**".
- **Always intuition first, math second.** Real-life analogies, everyday examples, and visual intuition come before equations.
- After every formula, there should be at least one sentence of "what this is really saying in plain terms".

### 5. MATLAB / Lab content

- Lab content is **optional** (the lab is a separate course component; theory students should be able to skip it cleanly).
- Embed lab content **inline within the relevant theory section**, clearly marked with a `<LabBox>` component (renders with a 🧪 icon and "Lab — Προαιρετικό" header).
- A reader who skips every `<LabBox>` should still get a complete theory experience.

---

## Content building blocks (MDX components)

Standardize these so every page has a consistent feel. Component contracts:

| Component | Purpose |
|---|---|
| `<Callout type="intuition\|warning\|key\|note">` | Highlighted insight box |
| `<Example>` | A worked example with a "show solution" toggle |
| `<ExamProblem year="2025-09" weight="10%">` | Problem from a past exam, with worked solution behind a toggle |
| `<LabBox>` | 🧪 Optional MATLAB lab content |
| `<Eq>` / `<InlineMath>` / `<BlockMath>` | KaTeX math rendering |
| `<Viz name="am-demo" />` | Mounts an interactive visualization by name |
| `<Recap>` | "What we learned" summary at the end of a section |
| `<NextUp>` | Pointer to the next logical section |

Every MDX page exports `frontmatter` with: `title`, `slug`, `order`, `prerequisites` (array of slugs), `examWeight` (rough %), `lastUpdated`.

## Math rendering

- Inline math: `$f(t) = A\cos(2\pi f_c t)$`
- Display math: `$$ ... $$`
- All Greek letters render correctly in KaTeX. Use `\beta`, `\mu`, etc.
- For equations referenced later, give them an id: `<Eq id="eq:am-signal">` so we can link to them.

## Interactive visualizations — design principles

This is what makes the site genuinely better than a textbook. Treat each viz as a teaching tool, not eye candy.

- **Every viz answers a specific question.** Before building one, write the one-sentence "this lets the student see X happening" goal.
- **Sliders > static figures.** If something has a parameter (frequency, amplitude, modulation index, sampling rate), make it draggable.
- **Side-by-side time / frequency** wherever both views matter (which is almost always in this course).
- **Annotate, don't just plot.** Label sidebands, mark the carrier, show where bandwidth is measured.
- **Keep it lightweight.** No 3D unless it earns its place. Most things are 2D plots.

Catalog of vizzes we'll likely need (built incrementally):

- `SignalBuilder` — add cosines one by one, see the resulting waveform (Fourier series intuition)
- `FourierExplorer` — drag a time signal, see its spectrum live
- `SamplingDemo` — show aliasing as you reduce sampling rate
- `LTIDemo` — convolve an input with an impulse response visually
- `AMDemo` — modulation index slider, watch envelope and spectrum
- `DSBvsSSBvsAM` — toggle modulation type, compare bandwidth/power
- `EnvelopeDetector` — animate diode + RC circuit response
- `FMDemo` — vary β, watch Bessel sidebands appear
- `CarsonRule` — visual derivation of Carson bandwidth
- `NoiseThroughFilter` — white noise PSD + LPF + output PSD
- `BesselTable` — interactive J_n(β) lookup matching the formula sheet

---

## Site features (full educational platform)

- **Dark / light theme** with system preference detection. Toggle in header.
- **Progress tracking** — each section has a "mark complete" toggle; sidebar shows progress per chapter. Stored in `localStorage`.
- **Bookmarks** — star any heading or example for quick access from a `/bookmarks` page.
- **Search** — client-side full-text search across all content (use `flexsearch` or `pagefind`).
- **Sticky sidebar nav** with current-section highlight; sticky right-side TOC for in-page jumps.
- **Reading time** estimate per section.
- **Prerequisites bar** at the top of each section — small chips linking to required prior sections (driven by frontmatter).
- **Smooth scroll, smooth section transitions**. Subtle, not flashy.
- **Mobile-first** — most students will read on phones in bed.

---

## Course-specific anchors

- **Official typology:** `formulas.pdf` is given to students *during* the exam. The site has a `/formulas` page that mirrors this typology with interactive expansions (e.g. tap a Fourier pair to see a derivation/visualization). Anything **not** in the typology must be derived or remembered, and the site should flag this when relevant ("⚠️ This is in the typology — you don't need to memorize it").
- **Exam weighting heuristic** (from past exams): AM ≈ 30–40%, FM ≈ 25–35%, Noise ≈ 20%, Foundations/True-False ≈ 20%. We use this to calibrate `examWeight` in frontmatter and to decide depth of treatment.
- **The exam is 2 hours, calculator allowed (no phones/tablets/computers).** Practice problems should be solvable in ~15-20 min each.

---

## Workflow

The site is built incrementally:

1. Lecture-by-lecture, one topic at a time.
2. Each topic gets a `plans/NN-topic.md` file with the detailed pedagogical plan, content outline, vizzes to build, and exam problems to embed. These plans are produced separately (in the planning chat) and handed to Claude Code one at a time.
3. Claude Code implements each plan, then we review and iterate.
4. The user reviews every section as a "stupid student" — flagging anything unclear. We don't move on until that section makes sense to a reader who knows nothing.

**Important:** `CLAUDE.md` (this file) stays small and durable. Per-section plans go in `plans/`. Don't bloat this file with content specifics.

### Commitments tracker

`plans/COMMITMENTS.md` is the record of every "we'll come back to this" / "see later chapter" promise the site has made to readers. **Before declaring any section done, check this file** — if the section you just built was supposed to fulfill an open commitment, satisfy it explicitly (with a back-reference: *"θυμάσαι που είπαμε X στην εισαγωγή; Να γιατί"*) and move the entry to the "Fulfilled" section. **If your section makes any new forward-looking promises, add them to the open list.** This file is the safety net that keeps the site internally consistent across many small build steps.

### Comments review loop

When the moderator says **"review pending comments"**, follow `plans/COMMENTS_LOOP.md` — it has the rules (verdict triage, reply tone, category calibration, hard stops) and the CLI scripts (`npm run comments:list / :reply / :resolve`). Don't review comments without re-reading that file each session.

---

## Ground rules for Claude Code

- **Don't invent content.** All educational text comes from the planning files in `plans/` (which are based on the actual lecture material). If a plan is missing detail, ask — don't fill in from training data, because the course has its own conventions and emphases.
- **Match the teaching philosophy on every line.** If you're writing content yourself for a small connector sentence, follow the same rules.
- **Visualizations should be production-quality.** Not throwaway sketches. Test on mobile.
- **Commit in small, reviewable chunks.** One feature/section per commit.
- **No third-party tracking, no analytics.** This is a study tool for classmates.
