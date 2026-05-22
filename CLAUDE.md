# Algorithms Class Hub

Educational website for the **Αλγόριθμοι και Πολυπλοκότητα (K17)** course at NKUA (Department of Informatics & Telecommunications). Built to help classmates actually understand the material — not just memorize it for the exam.

---

## Project identity

- **Name:** Algorithms Class Hub
- **Audience:** Undergraduate students taking K17 — Αλγόριθμοι και Πολυπλοκότητα.
- **Goal:** A study companion that builds understanding from zero. Reader is treated as smart but with significant gaps in prior knowledge (intro CS, discrete math, basic data structures).
- **Material:** Lecture PDFs in `material/Notes2026/` (L01–L17). Raw exam/frontistirio source files live in `private_material/{inclass,oldtests}` — git-ignored, never published; transcribed (anonymised) into the exercise bank. See `plans/EXAM_TRANSCRIPTION.md`.

## Tech stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Math rendering:** KaTeX (via `react-katex` for inline + display, `remark-math`/`rehype-katex` in MDX)
- **Content authoring:** MDX (Markdown + JSX)
- **Visualizations:** D3.js for plots; plain SVG / Canvas for diagrams and step-by-step algorithm traces; Mermaid for graphs/flowcharts when a static diagram suffices.
- **Backend:** Supabase (Postgres + Auth) for comments, replies, profiles, leaderboard
- **Auth:** Supabase Auth — email magic link + Google OAuth. Public read, sign-in required to post.
- **Deployment:** Vercel (auto-deploy from `main` branch)
- **Client-only state (progress, bookmarks, theme):** `localStorage`

## Repository conventions

```
/app                              Next.js App Router pages
  /(content)                      Route group for study content
    /lectures
      /L01-eisagogika/page.mdx
      /L02-asymptotic-analysis/page.mdx
      ...
      /L17-dp-iv/page.mdx
  /practice                       Exam practice hub
    /sose-to-eksamino             «Σώσε το εξάμηνο» exercise-first flow
    /quiz                         Quiz modes
  /sign-in                        Auth (magic link + Google)
  /profile                        User profile
  /auth/callback                  OAuth / OTP exchange
  /auth/sign-out                  POST → sign out
  layout.tsx
  page.tsx                        Landing page

/components
  /ui                             Generic UI: Button, Card, Tabs, Collapsible
  /math                           Math rendering helpers (Eq, InlineMath, BlockMath)
  /viz                            Algorithm visualizations (graph traversals, DP tables, recursion trees, ...)
  /layout                         Header, Sidebar, ProgressDot, Bookmark, Comments, UserMenu
  /content                        Reusable blocks: Callout, Example, ExamProblem, SourceDoc, Recap, NextUp
  /practice                       ExerciseCard, ExerciseLibrary, PrereqChips, QuizCard, FormulaSheetPanel
  /sose                           «Σώσε το εξάμηνο» exercise-first flow

/lib                              Utilities (storage, supabase clients, sose path logic)
/content                          Static content data (sections.ts, practice/*)
/material                         Lecture PDFs (Notes2026) — mirrored under /public/material/
/public/material                  Served URL for the lecture PDFs
/private_material                 Raw exam/frontistirio source files — GIT-IGNORED, never published

/plans                            Per-lecture build plans (handed to Claude Code one at a time)
/archive/sp                       Frozen Signal Processing site (prior tenant of this repo) — DO NOT IMPORT
```

### `/archive/sp` rule

This repo previously hosted a Signal Processing course site. All of that content has been moved into `/archive/sp/` so we keep the git history accessible without polluting the live tree. **Never import from `/archive/sp/`.** When you need a precedent for a component pattern, read it from there but rebuild fresh in `/components/`.

### Auth + RLS model

Unchanged from the previous tenant. Two roles in `profiles.role`: `user` (default) and `moderator`. A profile row is auto-created on signup via `handle_new_user`. Posting comments/replies inserts only as `auth.uid()`. Authors can delete their own comment/reply within 10 minutes; moderators always. See `supabase/migrations/0001_init.sql` for the canonical policy set.

### File & folder naming

- Routes use `kebab-case`. Lecture slugs are `lectures/LNN-topic-in-english` (e.g. `lectures/L03-divide-and-conquer-i`)
- Component files use `PascalCase.tsx`
- MDX content files are always named `page.mdx`

---

## Teaching philosophy (NON-NEGOTIABLE)

These rules apply to **every word of educational content** on the site. They do **not** apply to chrome (button labels, error states, etc.).

### 1. Language

- **Educational content is in Greek.**
- **English technical terms stay in English** when they are more natural than the Greek equivalent. Examples: *recurrence*, *master theorem*, *DAG*, *BFS / DFS*, *MST*, *shortest path*, *greedy choice*, *exchange argument*, *subproblem*, *memoization*, *bottom-up*, *invariant*, *amortized*, *priority queue*.
- Mix freely: "Το BFS επιστρέφει shortest paths σε unweighted graph..." is perfect.
- UI chrome (nav labels, buttons) → Greek primarily, English where standard.

### 2. Zero assumptions

- Never assume any concept is obvious. **Even "what is an algorithm?"** must be explained from scratch with intuition before any pseudocode or math.
- Never write "as you recall from earlier courses...", "you already know that...", "obviously...", "trivially...". Just explain it fresh.
- Treat every reader as if they're meeting recursion, graphs, or amortization for the first time.

### 3. Bottom-up

- Every new concept must be grounded in something already explained earlier in the site.
- Never introduce a definition without first explaining **why it exists** and **why it matters**.
- If a section needs a concept that hasn't been built yet, either build it first or link to where it's built.

### 4. Understanding over memorization

- The goal is "**why does this work?**", not "**what is this?**".
- **Always intuition first, math second.** Real-life analogies, everyday examples, and visual intuition come before formal definitions and proofs.
- After every theorem or recurrence, there should be at least one sentence of "what this is really saying in plain terms".
- Correctness proofs (loop invariants, exchange arguments, induction on subproblem size) get the same treatment: show the picture before the proof.

### 5. Exercise embedding

- Every lecture page ends with an **«Ασκήσεις από εξετάσεις»** block listing matching past-exam and frontistirio problems.
- 2024 / 2025 past-exam problems are tagged with a prominent badge (`Θέμα Εξετάσεων 2024`, `Θέμα Εξετάσεων 2025`) — these are the most likely to recur in style.
- Each exercise card links to the source PDF/image *and*, where transcribed, shows the problem statement inline with a "Λύση" toggle.

---

## Content building blocks (MDX components)

Standardize these so every page has a consistent feel.

| Component | Purpose |
|---|---|
| `<Callout type="intuition\|warning\|key\|note">` | Highlighted insight box |
| `<Example>` | A worked example with a "show solution" toggle |
| `<ExamProblem year="2024-06" weight="…">` | Problem from a past exam, with optional worked solution |
| `<Eq>` / `<InlineMath>` / `<BlockMath>` | KaTeX math rendering |
| `<Viz name="bfs-trace" />` | Mounts a named interactive visualization |
| `<Recap>` | "What we learned" summary at the end of a section |
| `<NextUp>` | Pointer to the next logical lecture |
| `<SourceDoc sources={{ pdf: '...', slides: '...' }} />` | Links to the original PDF in `/public/material/` |
| `<PrerequisitesBar prerequisites={[...]} />` | Top-of-page chip strip pointing to prior lectures |

Every MDX page exports `frontmatter` with: `title`, `slug`, `order`, `prerequisites` (array of slugs), `examWeight` (rough %), `lastUpdated`.

## Math rendering

- Inline math: `$T(n) = 2 T(n/2) + \Theta(n)$`
- Display math: `$$ ... $$`
- Common patterns to standardize:
  - Big-O / Θ / Ω: `O(n \log n)`, `\Theta(n^2)`, `\Omega(n)`
  - Recurrences: `T(n) = aT(n/b) + f(n)`
  - Loop invariants stated in plain Greek/English mix, with the invariant equation in display math.

## Interactive visualizations — design principles

This is what makes the site genuinely better than a textbook. Treat each viz as a teaching tool.

- **Every viz answers a specific question.** Write the one-sentence "this lets the student see X happening" goal before building it.
- **Step-through > static snapshots.** If the algorithm has phases (mergesort merges, BFS layers, DP fills, greedy picks), make them step-able with prev/next.
- **Show invariants visually.** When you trace BFS, highlight the frontier. When you fill a DP table, color cells you've committed to vs. cells you're recomputing.
- **Annotate.** Label every step with what the algorithm "is doing right now" in one short sentence.
- **Keep it lightweight.** SVG and HTML are usually enough.

Catalog of vizzes we'll likely need (built incrementally, per lecture plan):

- **L02 / asymptotic:** `BigOPlayground` — toggle functions, watch growth rates; `MasterTheoremTester` (later, in L03).
- **L03 / mergesort:** `MergeSortAnimator` — step through merges with the recursion tree.
- **L03 / master theorem:** `RecurrenceClassifier` — paste an `a, b, f(n)`, see the case.
- **L04 / inversions:** `InversionCounter` — slow vs D&C side by side.
- **L04 / Karatsuba:** `KaratsubaSplit` — pick `x, y`, see the 3-multiplication tree.
- **L05 / closest pair:** `ClosestPairScan` — sweep line + strip check.
- **L06–L09 / graphs:** `GraphCanvas` (reusable), `BFSAnimator`, `DFSAnimator`, `SCCKosaraju`, `TopologicalSort`, `DijkstraAnimator`, `BellmanFordAnimator`, `PrimAnimator`, `KruskalAnimator`, `UnionFindAnimator`.
- **L10 / data structures:** `BinaryHeapAnimator`, `BSTAnimator`, `HashTableProbing`.
- **L11–L13 / greedy:** `IntervalScheduling`, `HuffmanTreeBuilder`, `FractionalKnapsack`, `ExchangeArgumentExplainer`.
- **L14–L17 / DP:** `DPTableFiller` (generic), `LCSTable`, `KnapsackTable`, `EditDistanceTable`, `MatrixChainParens`, `RodCutting`.

---

## Site features (full educational platform)

- **Dark / light theme** with system preference detection. Toggle in header.
- **Progress tracking** — each section has a "mark complete" toggle; sidebar shows progress per chapter. Stored in `localStorage`.
- **Bookmarks** — star any heading or example for quick access from a `/bookmarks` page.
- **Search** — client-side full-text search across all content.
- **Sticky sidebar nav** with current-section highlight; sticky right-side TOC for in-page jumps.
- **Reading time** estimate per section.
- **Prerequisites bar** at the top of each section.
- **Mobile-first.**

---

## Course-specific anchors

- **Exam structure** (from past papers): typically 4–6 problems, ~3 hours, written.
- **Exam weighting heuristic** (eyeballing 2020–2025 papers; refine as we go):
  - Graphs (L06–L09) ≈ 30–35% — biggest single block
  - Dynamic programming (L14–L17) ≈ 25–30%
  - Greedy (L11–L13) ≈ 15–20%
  - Divide & conquer (L03–L05) ≈ 10–15%
  - Asymptotic analysis (L02) ≈ 5–10% (often a quick warm-up problem)
  - Data structures (L10) ≈ 5% (rarely standalone, often a building block)
- **2024 and 2025 exam problems are tagged with a year badge** in the UI so students see immediately which problems are most recent.

---

## Workflow

The site is built incrementally:

1. Lecture-by-lecture, in numerical order (L01 → L17).
2. Each lecture gets a `plans/LNN-topic.md` file with the detailed pedagogical plan: content outline, vizzes to build, exercises to embed, open questions for the instructor.
3. Claude Code implements each plan, then we review and iterate.
4. The user reviews every section as a "stupid student" — flagging anything unclear. We don't move on until that section makes sense to a reader who knows nothing.

**Important:** `CLAUDE.md` (this file) stays small and durable. Per-lecture plans go in `plans/`. Don't bloat this file with content specifics.

### Commitments tracker

`plans/COMMITMENTS.md` is the record of every "we'll come back to this" / "see later lecture" promise the site has made to readers. **Before declaring any section done, check this file** — if the section you just built was supposed to fulfill an open commitment, satisfy it explicitly (with a back-reference: *«θυμάσαι που είπαμε X στο L02; Να γιατί»*) and move the entry to the "Fulfilled" section. **If your section makes any new forward-looking promises, add them to the open list.**

### Comments review loop

When the moderator says **"review pending comments"**, follow `plans/COMMENTS_LOOP.md` — the rules and the CLI scripts (`npm run comments:list / :reply / :resolve`).

---

## Ground rules for Claude Code

- **Don't invent content.** All educational text comes from the planning files in `plans/` (which are based on the actual lecture PDFs in `material/Notes2026/`). If a plan is missing detail, ask — don't fill in from training data, because the course has its own conventions and emphases (notation, proof style, problem flavors).
- **Match the teaching philosophy on every line.** If you're writing a small connector sentence yourself, follow the same rules.
- **Visualizations should be production-quality.** Step-through, annotated, mobile-friendly. Test on mobile.
- **Commit in small, reviewable chunks.** One lecture / feature per commit.
- **No third-party tracking, no analytics.** This is a study tool for classmates.
