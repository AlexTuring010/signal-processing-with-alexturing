# Phase F — Bank quality audit + transcription completion

> **Read this file first in any new session.** It is a resumable plan: do
> ONE task per turn, stop and show, wait for review before the next. The
> standard is unchanged — see [[lecture-rework-standard]] and
> [[pseudocode-philosophy]]. No cutting corners. Cost is not a consideration.

---

## 0. How to resume Phase F (after `/clear` or `/reset`)

The user pastes this prompt to start any session:

```
Continue Phase F. Before anything else, read plans/PHASE_F.md end-to-end
and read the memory files lecture-rework-standard, pseudocode-philosophy,
phase-d-problem-rework, and site-wide-rollout — treat them all as
binding. Find the next unchecked task in the Progress tracker at the
top of the plan. Do ONE task only — then stop and show me. Same
standard as Phases A through E: deep, maximum-effort, no cutting
corners. Update the Progress tracker checkbox AND the relevant memory
file when you finish.
```

**Self-orienting protocol on receipt of that prompt:**

1. Read this file end-to-end.
2. Read the 4 binding memory files (above).
3. Look at the Progress tracker (§ 1) — the first unchecked `☐` is the
   next task. **F.1.0 (pre-flight) is the first; do not skip it.**
4. Cross-check with `git log algorithms-class-version --oneline -25` —
   commit titles map to task labels (`feat(F.1.0): …`, `feat(front-set-N): …`
   for F.1.N, `feat(F.2.N-pt#): …` for F.2.N). If a commit exists for a
   task not yet ticked, tick it before starting.
5. Execute ONE task. Run typecheck + lint + test + build. Commit per
   the per-task style (one PDF or one paper per commit). Push to `fork`.
6. **Update the Progress tracker checkbox AND a memory file**, then
   stop and show the user.

---

## 1. Progress tracker

### F.1 — Frontistirio audit pass (priority — 10 PDFs + 1 pre-flight)

10 frontistirio PDFs live in `material/frontistiria/`, covering bank sets
#1–#10. The user added them on 2026-05-25. Each PDF gets the full quality
treatment: two passes (transcription correctness + quality bar) plus a
theory-content audit and PDF-page-link wiring. **One PDF per turn.**

| Task | Source PDF | Bank set (per current tracker) | Bank entries today | Status |
|---|---|---|---|---|
| F.1.0 | *(all 10 PDFs, first-page inspection + UI wiring)* | *(see § 4)* | — | ☐ |
| F.1.1 | `material/frontistiria/F1__2023_24__eclass.pdf` | Φροντιστηριακό Σετ #1 | 3 (Ασκ 0, 1, 3) | ☐ |
| F.1.2 | `material/frontistiria/F2__2023_24.pdf` | Φροντιστηριακό Σετ #2 | 8 (Ασκ 0–7) | ☐ |
| F.1.3 | `material/frontistiria/F3__eclass.pdf` | Φροντιστηριακό Σετ #3 | 7 (Ασκ 1, 2, 4, 7, 8, 9, 10) | ☐ |
| F.1.4 | `material/frontistiria/F4__2023_24__eclass.pdf` | Φροντιστηριακό Σετ #4 | 12 (Ασκ 1–10 + E0 + Θέμα 4) | ☐ |
| F.1.5 | `material/frontistiria/F5_6__eclass.pdf` | Σετ #5 AND/OR #6 (verify in F.1.0) | Set #5: 10, Set #6: 8 | ☐ |
| F.1.6 | `material/frontistiria/F7__eclass.pdf` | Φροντιστηριακό Σετ #6 (per existing tracker — F7 ≠ Set #7) | 8 (Ασκ 1–8) | ☐ |
| F.1.7 | `material/frontistiria/F8__eclass.pdf` | Φροντιστηριακό Σετ #7 | 12 (Ασκ 1–12) | ☐ |
| F.1.8 | `material/frontistiria/F9__eclass.pdf` | Φροντιστηριακό Σετ #8 | 4 (Ασκ 1–4) | ☐ |
| F.1.9 | `material/frontistiria/F10__eclass.pdf` | Φροντιστηριακό Σετ #9 | 4/5 absorbed (Ασκ 1, 3, 5, 8) | ☐ |
| F.1.10 | `material/frontistiria/F11__eclass.pdf` | Φροντιστηριακό Σετ #10 | 13/14 absorbed (Ασκ 1–14 minus 6) | ☐ |

**File ↔ set mapping is NOT 1:1.** The current `EXAM_TRANSCRIPTION.md`
tracker has `F7 → Set #6`, `F8 → Set #7`, `F9 → Set #8`, `F10 → Set #9`,
`F11 → Set #10`. The first transcription pass for each PDF must CONFIRM
the mapping by reading the PDF's first page (set number, year, frontistirio
teacher) and checking against bank entries with that set's id prefix.

**`F5_6__eclass.pdf` is special.** It may contain Set #5 only, Set #5 + #6
combined, or a renamed Set #5. F.1.0 resolves which. If F5_6 turns out
to cover both sets, F.1.5 may need to split into F.1.5a + F.1.5b (one
turn each).

**Sets #11–#13 are NOT in `material/frontistiria/`.** Their source PDFs
(`1ο Φροντ.pdf`, `2ο Φροντ.pdf`, `3ο Φροντ.pdf`) live elsewhere or are
TBD. If the user adds them later, queue as F.1.11..F.1.13.

### F.2 — Past-exam absorption (deferred from PR #4 merge, ~70 entries)

After F.1 closes, absorb Stelios's PR #4 past-exam transcriptions still
recoverable from `origin/main` (~70 entries). Same two-pass approach:
first absorb the content with our format translation (recipe in § 7),
then bring each entry to the quality bar (§ 2).

| Task | Paper | Stelios's count | Entry ids | Status |
|---|---|---|---|---|
| F.2.1 | Παλαιό Θέμα #8 (`sept-2022`) | 3 | pt8-th1, pt8-th2, pt8-th3 | ☐ |
| F.2.2 | Παλαιό Θέμα #9 part 1 (`june-2021`) | 10 | pt9-q1..pt9-q10 | ☐ |
| F.2.3 | Παλαιό Θέμα #9 part 2 (`june-2021`) | 7 | pt9-q11..q15, pt9-th1, pt9-th2 | ☐ |
| F.2.4 | Παλαιό Θέμα #10 (`sept-2020`) | 4 | pt10-th1..pt10-th4 | ☐ |
| F.2.5 | pt11 remainder + 3 frontistirio entries (mixed) | 6 | pt11-th2/th3/th4, front-set-9-ask2, front-set-10-ask6, front-set-11-ask1 | ☐ |
| F.2.6 | Παλαιό Θέμα #13 (`june-2018`) | 14 | pt13-th1..th15 (one short) | ☐ |
| F.2.7 | Παλαιό Θέμα #14 (`sept-2017`) | 13 | pt14-th1, th4–th9, th11–th16 | ☐ |
| F.2.8 | Παλαιό Θέμα #15 (`feb-2017`) | 9 | pt15-th1, th2, th3, th7, th8, th10, th12, th14, th15 | ☐ |
| F.2.9 | Παλαιό Θέμα #16 remainder (`june-2016`) | 7 | pt16-th1a/b/c, pt16-th2a/b/c, pt16-th3a | ☐ |

---

## 2. The quality standard for every entry

Every entry — whether new (F.1 adds it), fixed (F.1 improves an existing
one), or absorbed (F.2 brings in Stelios's content) — must meet this
checklist before the task is marked done:

1. **Verbatim transcription of the statement** from the PDF, with
   **image analysis**: if the problem has a figure/diagram, the figure
   is reproduced in the entry as JSX/SVG (or at minimum a static SVG
   reflecting the same information). Not just described in prose.
2. **Beginner-friendly Greek solution** per [[lecture-rework-standard]]:
   intuition first, concrete before abstract, no skipped steps, real-life
   analogies before formal definitions. The reader is a smart student
   with significant gaps — explain from zero.
3. **[[pseudocode-philosophy]] applied.** Natural-language description is
   the primary deliverable. Use the `<Algorithm>` + `<Pseudocode>` pair
   from `mdx-components.tsx`; pseudocode collapsed-by-default. Keyword
   chips on the RecallCard (`keywords` array).
4. **Source PDF link with page number.** Every entry sets:
   - `sourceFile: 'material/frontistiria/F<N>__eclass.pdf'` (or the
     appropriate path)
   - `sourcePage: <N>` (1-indexed, the page where the problem starts)

   The UI renders this as a «Δες το πρωτότυπο PDF (σελ. N)» link that
   opens the PDF at the right page via `#page=N`. **Wiring done in F.1.0**
   (type field + ExerciseCard + SoseProblemCard); per-entry `sourcePage`
   values are filled by each F.1.N task.
5. **Νιώσε visuals where the problem has a concrete scenario.** The
   «αναγνώρισε το ντύσιμο» moment — see [[phase-e45-visual-audit]],
   [[phase-e45-chunk-a]] for the four exemplars (`SightseeingScene`,
   `CyclingTripScene`, the static SVGs for `pt4-th2-a` and `pt4-th4`,
   and `RiverCrossingGame` as the retroactive upgrade precedent). Build
   a game when the problem has a state-graph or puzzle structure that
   benefits from the student operating it directly.
6. **Steppable interactives where the algorithm has phases** (DP fill
   walks, BFS layers, greedy picks, Bellman-Ford rounds, etc.). Re-use
   existing vizzes (`KnapsackTable`, `BellmanFordAnimator`,
   `DijkstraAnimator`, `LcsTable`, `HuffmanTreeBuilder`, etc.) where
   they fit; build a new bespoke viz when none does.
7. **Graphs use `routeEdge()` collision-aware routing** — per
   [[phase-e46-edge-routing]] and follow-up chunks B1..B7.3. Build
   module-scope `NODE_RECTS` + per-file `routedEdge(a, b)`; branch on
   `g.kind === 'line' ? <line> : <path>`. Dynamic layouts use
   `useMemo([deps])` to rebuild rects when the layout changes.
   **Post-translation rect frame** (B7.3 standing lesson): when the viz
   renders nodes at a translated position (`<circle cx={nd.x + MARGIN}>`),
   build rects in the translated frame (`x: nd.x + MARGIN - R`), not
   the layout's native frame.
8. **SOSE coaching layer** in `content/practice/sose-coaching.ts` —
   `takeaway` (durable pattern, NOT a restatement of the solution) +
   `examRadar` («Αν δεις X, σκέψου Y»). Optional `relatedIds` for cross-
   problem links.
9. **ThinkingPattern callout** at the lecture page where the problem's
   pattern is taught. If the technique is new, add a `<ThinkingPattern>`
   block to the lecture MDX; if it's an instance of an existing pattern,
   ensure the pattern's signal/cue list cites this entry's recognition
   marker.
10. **RecallCard** if the entry teaches a reusable technique (memorisation
    hook). Per [[pseudocode-philosophy]], populate `keywords` carefully —
    these are the exam-vocabulary chips.

---

## 3. Per-PDF pass cadence (F.1.N, N = 1..10)

For each `F.1.N` task:

### Step 1 — Read the PDF (text + image analysis)

Use the `Read` tool on the PDF path. The tool is multimodal — figures
and diagrams come through as visual content. Capture:
- Set number + frontistirio teacher (front matter)
- Every problem statement (verbatim Greek)
- Every figure/diagram in every problem
- **Any non-exercise educational content** (theory boxes, worked
  examples, definitions, technique demonstrations) — used by Step 5
  below.

If the PDF is large, read in page ranges (`pages: '1-15'`, `'16-30'`,
etc.). For figures, capture enough detail that they can be reproduced as
SVG/JSX or referenced via the PDF-page link.

### Step 2 — Inventory current bank entries for the set

```
grep -nE "id: 'front-set-N-" content/practice/exercises.tsx
```

For each entry: note id, title, current `statement` / `solution` content,
current `sourceFile`, current `sourcePage` (if exists).

### Step 3 — Pass 1: Transcription correctness

Per problem in the PDF:

- **If a matching bank entry exists** (same Ασκ number / same topic):
  - Compare statement against PDF.
    - If statement is verbatim correct → ☑ pass-1 for this entry.
    - If statement is wrong / paraphrased / missing detail / missing
      figures → fix to verbatim, including figures.
  - Compare solution against the PDF's reference solution (if any) AND
    against [[lecture-rework-standard]]:
    - If correct algorithm + beginner-friendly + complete → ☑.
    - If incorrect algorithm / sketchy / missing intuition → flag for
      pass-2 rewrite.
- **If no matching bank entry exists for a problem in the PDF**:
  - Add a new entry. Use the canonical `id` shape
    `front-set-N-ask{number}` (or `front-set-N-th{number}` for «Θέμα»
    style if the PDF uses that label).
  - Transcribe statement verbatim with image rendering.
  - Author the solution per pass-2 standard (no separate pass — do it
    right the first time).
- **If a bank entry exists but isn't in the PDF** (orphan):
  - Verify if it belongs to a different set (re-id and move) or is
    legitimately something we kept that wasn't in the source. Flag for
    user review if unclear.

### Step 4 — Pass 2: Quality bar

For each entry touched in Step 3 (new OR existing-but-flagged), ensure
the full checklist from § 2 above:

- Statement renders cleanly (math, code blocks, images).
- Solution meets [[lecture-rework-standard]]: intuition first, no leaps,
  patient teaching voice, real-life analogy where helpful.
- `<Algorithm>` + `<Pseudocode>` pair if there's an algorithm.
- Νιώσε visual if the problem has a concrete scenario.
- Steppable interactive if the algorithm has phases (use existing viz or
  build a new bespoke one — naming convention
  `components/viz/PascalCase.tsx`).
- Edge-routing for any graph viz per § 2.7.
- SOSE coaching entry.
- ThinkingPattern callout at the host lecture page.
- RecallCard if the entry teaches a reusable technique.

### Step 5 — Educational content audit (theory check)

Scan the PDF for **non-exercise content**: theory boxes, worked examples
demonstrating a technique, definitions, lemma proofs, intuition diagrams,
algorithm summaries. For each piece of theory content found:

- Identify which lecture page (`app/(content)/lectures/L*/page.mdx`) is
  the natural home (per the L01–L17 topic map).
- Read the relevant lecture page section.
- **Audit:** does our page already cover this teaching point?
  - If yes, well-covered or better: ☑ note, skip.
  - If our coverage is weak vs the PDF: improve our page (rewrite
    intuition, add a visual, add a RecallCard, add a ThinkingPattern).
  - If our page doesn't cover it at all and it's teaching-worthy: add a
    new section to the lecture page at full [[lecture-rework-standard]]
    (intuition first, interactive if a concept can click, no shortcuts).
  - If it's a niche extension or not pedagogically useful for our
    audience: ☑ note and skip.

This step IS optional per-PDF (some frontistirios are purely problem sets
with no theory content). The executor judges per-PDF based on what they
actually find. **If theory content IS added to a lecture page, the
lecture page's commit can be part of the same F.1.N commit OR a separate
follow-up** — judge based on commit-size sanity.

### Step 6 — `sourcePage` filling

For every entry that this task touches:
- Set `sourceFile: 'material/frontistiria/F<N>__eclass.pdf'` (the actual
  file, the path now in the working tree).
- Set `sourcePage: <page>` to the 1-indexed page number where the problem
  starts in the PDF.

(The type field + UI wiring are done in F.1.0; this step just populates
the values per entry.)

### Step 7 — Both-flow sanity check

After Pass 1 + Pass 2 + Educational audit + sourcePage fill, spot-check
that the entry renders correctly in:
- `/practice` (the library — find via search/filter)
- `/practice/sose-to-eksamino` (the crunch flow — if a SOSE coaching
  entry exists)
- The relevant lecture page (if the entry is cited via `<ExamProblem>`)

All three surfaces draw from the SAME `content/practice/exercises.tsx`
source, so content fixes propagate automatically. The check is for
**rendering correctness** — does the math render, are images visible,
does the SOSE card show coaching, does the lecture chip deep-link
correctly, does the «Δες το πρωτότυπο PDF (σελ. N)» link open at the
right page.

### Step 8 — Verify, commit, push, update tracker

```
npm run typecheck && npm run lint && npm test && npm run build
```

All four green. Bundle delta should be small per PDF (a few entries
worth of solution prose + maybe a new viz). Sudden large jumps are a
warning sign.

Commit per the existing per-feature style:

```
feat(front-set-N): bring Φροντ. Σετ #N to quality bar (audit + N new entries)

Pass 1 (transcription correctness)
----------------------------------
- ...

Pass 2 (quality bar)
--------------------
- ...

Theory content audit
--------------------
- ...

Source linking
--------------
- sourceFile, sourcePage filled for N entries.

Verification: typecheck + lint + 20/20 tests + build all green.
Bundle delta: ...

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

Push to `fork`. Tick this PDF's checkbox in § 1's tracker. Update the
per-set status row in `plans/EXAM_TRANSCRIPTION.md` if the count
changes. Write or extend a memory file `phase-f1-set-N.md` capturing the
non-obvious decisions made (e.g. «set #N's Ασκ 6 was missing in the
bank, added with new bespoke viz X», «PDF page 12 had a theorem proof
that L0X already covers better», etc.).

---

## 4. Pre-flight task — F.1.0

**Goal:** before any per-PDF work starts, lock down the foundation that
F.1.1..F.1.10 depend on.

**What to do (single turn):**

1. **Inspect each PDF's first page** to confirm the file ↔ set mapping.
   Read `material/frontistiria/F{1,2,3,4,5_6,7,8,9,10,11}__eclass.pdf`
   page 1 only. Note:
   - Set number printed on the PDF
   - Year
   - Teacher / frontistirio name
   - Whether F5_6 is one combined deck or just Set #5 / just Set #6

   Update the F.1.N row in § 1's tracker with the confirmed mapping;
   if anything's off vs the existing `plans/EXAM_TRANSCRIPTION.md`
   tracker, update there too.

2. **Add `sourcePage?: number` to the `Exercise` type** in
   `content/practice/types.ts`. Document:

   ```ts
   /**
    * Page in the source PDF where the problem statement starts.
    * 1-indexed. Used by the UI to deep-link the «Δες το πρωτότυπο»
    * button to the right page (href={`${sourceFile}#page=${sourcePage}`}).
    */
   sourcePage?: number
   ```

3. **Update `ExerciseCard.tsx`** (the practice library card) to render
   the page-anchored link when both `sourceFile` and `sourcePage` are
   set. Existing link copy is «Δες το πρωτότυπο»; new: «Δες το
   πρωτότυπο PDF (σελ. {sourcePage})». Falls back to the existing link
   (without page anchor) when only `sourceFile` is set.

4. **Update `SoseProblemCard.tsx`** (the crunch-flow card) with the same
   change — both surfaces render the same link consistently.

5. **Verify the `#page=N` anchor renders** — `#page=N` is the de facto
   standard supported by Chrome, Firefox, Edge, Safari for in-browser
   PDF viewers. No build step needed; just standard `<a href>`. Confirm
   in browser via a quick dev-server check.

6. **Don't fill any per-entry `sourcePage` yet** — that's the per-PDF
   work in F.1.1..F.1.10. F.1.0 just lays the wiring.

7. typecheck + lint + test + build. Commit:

   ```
   feat(F.1.0): wire sourcePage links + confirm frontistirio PDF mapping

   - Add Exercise.sourcePage?: number to types.ts.
   - ExerciseCard + SoseProblemCard render «Δες το πρωτότυπο PDF (σελ. N)»
     when both sourceFile and sourcePage are set.
   - Inspected material/frontistiria/F{1..11}__eclass.pdf page 1; the
     file↔set mapping is confirmed as ... [your finding].
   - No per-entry sourcePage values changed yet — that's F.1.1..F.1.10.
   ```

   Push to `fork`. Tick F.1.0 in § 1. Write a memory file
   `phase-f1-0-preflight.md` capturing the confirmed PDF-to-set mapping
   and any surprises (e.g. F5_6 contents).

---

## 5. Binding constraints

- **Read [[lecture-rework-standard]] at the start of every session.**
  Same quality bar as Phases A–E.
- **One task per turn, stop and show.** Same cadence as Phases A/B/C/D/E.
- **Don't invent content.** Every transcription is verbatim from the PDF
  (text + image analysis); every solution follows
  [[lecture-rework-standard]]. If a problem statement is ambiguous, flag
  for user review — don't fill in.
- **No `npm run build` while `npm run dev` is running** — see
  [[local-build-env]].
- **Push to `fork` remote, not origin** — see [[pr-workflow]]. PR #5
  auto-updates with each push.
- **Memory must be updated** after each task. Create a new memory file
  per F.1.N task (e.g. `phase-f1-set-1.md`) capturing non-obvious
  decisions. Update `phase-d-problem-rework.md` and `site-wide-rollout.md`
  index lines on the closing commit of each task.
- **Image analysis is the default** — when reading PDFs, the `Read` tool
  is multimodal. Don't text-extract and call it done; figures matter.
- **Both flows always at the same quality** — `/practice` and
  `/practice/sose-to-eksamino` render from the same source; lecture
  pages cite via `<ExamProblem relatedExerciseId>`. Spot-check all three
  per task. (Consistency is automatic via shared source, but verify
  rendering correctness.)
- **F.2 does NOT start until F.1 closes.** F.1 has 1 pre-flight + 10
  PDFs = 11 turns minimum. F.2 has 9 turns. Total Phase F is ~20 task
  turns at the user's set cadence — not a rush.

---

## 6. Recovery — retrieving a deferred F.2 entry from `origin/main`

Each F.2 entry is still on `origin/main` from Stelios's PR #4. To
recover one:

```bash
git show origin/main:content/practice/exercises.tsx | \
  awk "/id: '\${ENTRY_ID}'/,/^  \\},/"
```

Then apply the F.2 reformatting recipe in § 7.

---

## 7. F.2 reformatting recipe (per entry, applied during F.2.N)

When absorbing an entry into our bank, apply these transformations:

1. **Drop** `paperLabel: 'Παλαιό Θέμα #N',` or
   `paperLabel: 'Φροντιστηριακό Σετ #N',`.
2. **Insert** `source: '<dated>',` right after `origin:`. Mapping:
   - `Παλαιό Θέμα #8` → `'sept-2022'`
   - `Παλαιό Θέμα #9` → `'june-2021'`
   - `Παλαιό Θέμα #10` → `'sept-2020'`
   - `Παλαιό Θέμα #11` → `'distance-2020'`
   - `Παλαιό Θέμα #13` → `'june-2018'`
   - `Παλαιό Θέμα #14` → `'sept-2017'`
   - `Παλαιό Θέμα #15` → `'feb-2017'`
   - `Παλαιό Θέμα #16` → `'june-2016'`
   - `Φροντιστηριακό Σετ #N` (1-10) → `'frontistirio-2023-24'`
   - `Φροντιστηριακό Σετ #N` (11-13) → `'frontistirio-misc'`
3. **Rewrite the title** from `'Παλαιό Θέμα #N · Θέμα X — Y'` to
   `'<SourceLabel> · Θέμα X — Y'` using `SOURCE_LABELS` from
   `content/practice/types.ts` (e.g. `Παλαιό Θέμα #11` → `Εξ αποστάσεως
   2020`, `Παλαιό Θέμα #16` → `Ιούνιος 2016`).
4. **Keep** `problemNumber`, `weight`, `topic`, `prerequisites`,
   `difficulty`, `statement`, `solution`, `origin` exactly as Stelios
   wrote them. (`difficulty` may be re-judged during the quality pass.)
5. **Replace any of our placeholder entries** (e.g. `exam-sept-2022` with
   `statement: null`) that map to the same paper — delete the placeholder.
6. **Then run the quality pass per § 2 above** — Stelios's content is
   the seed; bring each entry to the [[lecture-rework-standard]] bar in
   the SAME turn (the format translation is mechanical, the prose
   rewrite is where the work is).
7. **`sourceFile` / `sourcePage` for F.2 entries** — Stelios's
   transcriptions don't carry our `sourcePage` field. Set
   `sourceFile: 'material/past_exams/<file>.pdf'` if the paper is one
   of the four publicly-available 2024/2025 ones; for older Ζησιμόπουλος
   archive (#8 onwards), the source files live in `private_material/`
   per the existing convention. Fill `sourcePage` from the original PDF.

---

## 8. Quick reference: F.1 source files

| Bank Set # | Source PDF (in `material/frontistiria/`) | F.1.N task |
|---|---|---|
| 1 | `F1__2023_24__eclass.pdf` | F.1.1 |
| 2 | `F2__2023_24.pdf` | F.1.2 |
| 3 | `F3__eclass.pdf` | F.1.3 |
| 4 | `F4__2023_24__eclass.pdf` | F.1.4 |
| 5 | `F5_6__eclass.pdf` (verify in F.1.0 — may contain Set #5 only, or both #5 + #6) | F.1.5 |
| 6 | `F7__eclass.pdf` (note: F7 → Set #6 per existing mapping) | F.1.6 |
| 7 | `F8__eclass.pdf` (F8 → Set #7) | F.1.7 |
| 8 | `F9__eclass.pdf` (F9 → Set #8) | F.1.8 |
| 9 | `F10__eclass.pdf` (F10 → Set #9) | F.1.9 |
| 10 | `F11__eclass.pdf` (F11 → Set #10) | F.1.10 |
| 11–13 | *(not in `material/frontistiria/`; out of F.1 scope)* | — |

---

## Appendix A — Why F.1 is broader than just "absorb missing entries"

The previous version of this plan (the original `PHASE_F0_ABSORB.md`
created during the PR #4 merge) framed Phase F as a narrow "absorb
Stelios's transcriptions" task. The user broadened the scope on
2026-05-25 after adding `material/frontistiria/`:

> «we will first do a pass over those, add any exercises that aren't
> already there, or improve any that are there but were not transcribed
> correctly (both answer and solution matter), if they got images we
> analyze those we don't just look at text. All questions have high
> standards as they are part of the learning process … we are not
> rushing … we may need to do one pdf at a time and we may need to do 2
> passes one to make sure everything is transcribed correctly and
> another to make sure they all are meeting our standards (including
> the standards for graphs that got nodes and edges which we had to
> fix before).»

And on PDF page links:

> «we should allow them to open the frontistiria pdf to see the problem
> and solution directly from there if so they wish. So add that
> somewhere in the plan to be done too for any frontistiria problems we
> are able to collect. It will need to tell them the page of the pdf
> where the problem is.»

And on theory content:

> «some frontistiria got educational content inside them, this content
> should be analyzed too just to check if our theory pages cover it or
> if it should be added, again same high standards.»

So F.1 is, simultaneously: (a) a transcription correctness pass over the
entire frontistirio bank using the PDFs as source of truth, (b) a
quality-bar uplift to [[lecture-rework-standard]] for any entry below
bar, (c) a PDF-page deep-linking feature, (d) a theory-content audit
against the lecture pages. **All four happen per PDF, with two passes
(transcription, then quality), spread across ~11 task turns.**

The original F.0 scope (absorb Stelios's PR #4 past-exam transcriptions)
is preserved as Phase F.2, after F.1 closes.
