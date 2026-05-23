# Handoff — teaching-site rework methodology

You are about to do for the **Signal Processing** course site what another instance of me did for a sister NKUA course site (algorithms). The owner is the same person — they want the SP site brought to the same bar, lecture by lecture, on **the same standard** that's about to be defined below.

This document is the entire transferable methodology — philosophy, kit shape, rollout structure, per-lecture mechanics, and the lessons that were learned the hard way. All course-specific names (lecture numbers, topic names, component names, commit hashes, branch names, PR numbers) from the algorithms run have been stripped — they don't apply to you. Your slides, your topics, your interactives.

## Read this in plan mode — do NOT start coding yet

The user wants you to:
1. Read this file end-to-end.
2. Survey what's already in the SP repo — what stage is it at? what's already built? what topics are in the slides?
3. Produce a **roadmap** of your own: catalogue each lecture, identify the hard concepts in each, sketch the bespoke interactives each lecture needs.
4. **Show that roadmap to the user.** Wait for explicit go-ahead before touching the first lecture.

Treat this whole document as binding pedagogical instructions, the same way the algorithms run treated its analogue.

---

## 1. The standard — non-negotiable

This is the bar for every lecture page. The user has said it repeatedly and emphatically:

> Build the **best possible** teaching material. Go **above and beyond**. **Cost is not a consideration**. Care **deeply** about teaching and quality. **Never cut corners**. Having "the content on the page" is NOT the goal — the goal is each concept genuinely **clicking in a struggling student's brain**.

The user is on a Max plan, has explicitly said they don't care about token budget or time taken, and **will push back hard** if they see shortcuts — "one viz per lecture", "the prose is technically correct so leave it", "this concept is obvious enough", "good enough for now". **None of those are acceptable.** If you find yourself thinking any of them, override the impulse and do the thorough thing.

The user cares about real understanding, not coverage. They have explicitly corrected first passes that met "correct prose + one interactive per lecture" but still left hard concepts as static theory. **Don't make that mistake.**

How to apply, on every lecture:

- **Rewrite, don't patch.** If prose isn't smooth and easy for a weak/struggling student, **rewrite it fresh** — intuition first, built from zero, no leaps, concrete before abstract, generous connective tissue. Facts stay grounded in the lecture PDF; the *writing* is fresh and patient. Prefer a rewrite over an addition whenever it improves the teaching.

- **Interactives wherever a concept can click — NOT one per lecture.** A hard, abstract term does NOT click in a student's brain from prose and a static diagram. It stays an intimidating phrase until the student can *see it move* or *operate it*. So every hard or subtle idea gets its **own bespoke** animation/interactive. A lecture with three hard concepts gets three (or more). **When unsure whether something needs one, build it.**

- **Frame every page on the 5-stage learning loop** (see §2).

- **Use and extend a reusable component kit** (see §3). Build any new component that seems useful — don't be cheap. Components live in something like `components/viz/` and get registered in `mdx-components.tsx` (or whatever the equivalent file is in your repo).

- **One lecture at a time.** Do NOT batch lectures in a row. Give each its own focused pass and surface it for the user to review before moving to the next. **Stop and show — every time.**

The user is on a Max plan and explicitly wants maximum-effort, best-model output, no cutting corners.

---

## 2. The 5-stage learning loop

Every page is framed on a learning loop with five stages. The algorithms run used the Greek names below because the course is taught in Greek; **match your course's language** (likely Greek too at NKUA, but check). If you keep Greek names, here they are; if your course is in another language, translate the stage names but keep the structure.

| Stage | Greek name | What happens on the page |
|---|---|---|
| **Feel** | Νιώσε | Intuition first — analogies, real-life metaphors, the picture before the formula. |
| **See** | Δες | The algorithm or concept laid out — pseudocode, worked example, **interactive visualization**. |
| **Compress** | Συμπύκνωσε | A `RecallCard`: keywords, skeleton steps, the trap. The "card you carry into the exam". |
| **Recall** | Ανακάλεσε | Active recall — fill-in-the-blank (`ClozeDrill`), reorder steps (`ReorderDrill`), reproduce-from-memory (`RecallDrill`). |
| **Recognise** | Αναγνώρισε | A `ThinkingPattern` saying "this is when you reach for this tool" + an `ExamRadar` listing how the topic shows up on past exams. |

Reading makes a student *think* they know it. Producing it themselves is what *locks it in*. The loop is the structure that gets them from one to the other.

---

## 3. The component kit (concepts, not specific files)

The K17 repo built a set of generic MDX components that every lecture page imports. **Build the equivalent set in your repo if it doesn't already exist**, then extend it per-lecture with bespoke visualizations.

Generic kit (universal, build once, use everywhere):

- **`Algorithm` + `Pseudocode`** — paired block: prose description of the algorithm, then crisp pseudocode below. The `Algorithm` block also takes `idea`, `complexity`, and `io` (input/output) metadata that render as a header.
- **`RecallCard`** — a "carry into the exam" card: `algorithm` name, `keywords` array, `skeleton` steps array, `complexity`, `trap` (the most common mistake).
- **`RecallDrill` / `ClozeDrill` / `ReorderDrill`** — active-recall drills. Cloze is fill-in-the-blank inside pseudocode; Reorder is drag-to-order a list of step descriptions; Recall is reproduce-the-thing-from-memory.
- **`ThinkingPattern`** — "when do I reach for this?" — `signals` array of phrases that should trigger this technique, plus prose explanation.
- **`ExamRadar`** — list of past-exam topic appearances with `likelihood` (`high`/`medium`/`low`) and an optional `note`.
- **`Callout`** — typed boxes: `intuition`, `key`, `note`, `warning`. Used everywhere.
- **`Example`** — collapsible "worked example, click to see solution".
- **`Recap`** — bullet list at end of lecture: "what we keep from this".
- **`NextUp`** — pointer to the next lecture in sequence.
- **`SourceDoc`** — links to the source PDF; carries a `note` that **must** quote the real PDF page count (see §6 on the slide-count rule).

Bespoke visualizations (build per-lecture as needed): live in `components/viz/`. Each one is a `'use client'` React component that animates or interactively demonstrates **one specific concept**. Design principles:

- **Every viz answers a specific question.** Write the one-sentence "this lets the student see X happening" goal before building it.
- **Step-through > static snapshots.** If the concept has phases, make them step-able with prev/next/play/reset.
- **Show invariants visually.** Color what's frozen vs changing; gray out what's been discarded.
- **Annotate.** Label every step with what's happening RIGHT NOW in one short sentence.
- **Keep it lightweight.** SVG + plain React state is usually enough. Heavy charting libraries only when there's no alternative.
- **Tabs for variations.** When a concept has multiple flavours (different parameter regimes, multiple competing approaches, "intuition mode" vs "proof mode"), put them in tabs in the same component — don't make the student scroll between two near-identical figures.

Patterns that recurred and worked well in the algorithms run:

- **A "scan all 11 things"** stepper that ticks a counter into one of N columns — lands a universal-quantifier claim ("ALL of them have property X") by visibly checking each one.
- **An "adversary" tab** where the student tries to construct a counterexample and the viz argues why it's impossible.
- **A "naïve vs tight" race** with a slider over the input — for any analysis where one bound is loose and another is sharp.
- **A "same algorithm, different parameter"** tab group — for showing that one method is many algorithms in disguise.

---

## 4. The rollout structure

Plan the work in **phases**, numerical order within each phase, one lecture per turn, stop and show the user after each.

The algorithms run shape, for reference:

- **First pass** over every lecture: get the kit installed, add the 5-stage loop, ship **one** bespoke interactive per lecture. This is the "scaffolding" pass. **It is NOT enough on its own** — multi-concept lectures will have hard ideas left as static theory after it. Plan for a second pass.
- **Phase A** = deep pass over the late lectures (the ones the user cares most about, often the harder/more exam-weight ones). One lecture at a time, build interactives until every hard concept clicks.
- **Phase B** = deep pass over the early lectures, same standard.
- **Phase C, D, …** = re-pass over any lectures the user flags as not yet meeting the bar.

For Signal Processing the natural phase split will be different — make it based on YOUR slides. Common shapes:

- Foundations → Time-domain analysis → Frequency-domain → Filters → Sampling/DSP → Applications.
- Or whatever the actual course structure dictates.

Don't propose phases in this handoff — propose them when you've read the slides. The user's roadmap-setting is a collaborative step.

---

## 5. Per-lecture mechanics

The mechanical recipe each lecture is worked through:

1. **Locate the source PDF.** It will be a beamer-generated slide deck.
2. **Copy to an ASCII path first.** If the filename has non-ASCII characters (Greek, accents, special characters), the PDF tooling will fail on the real path. Copy to a temp ASCII path before running `pdftotext`/`pdfinfo`.
3. **Run `pdfinfo` and note the `Pages:` value.** This is the **real** PDF page count.
4. **Run `pdftotext -layout` on the temp copy** and read it side-by-side with the page you're reworking.
5. **Read the existing page** (if any). Catalogue the hard concepts. For each, decide: is the prose already smooth? Is there an interactive that makes it click? If either answer is no — build/rewrite.
6. **Build any new bespoke viz** in `components/viz/`. Register in `mdx-components.tsx`.
7. **Edit the lecture's MDX page.** Insert vizzes at the structural point they belong. Rewrite weak prose.
8. **Run `npm run typecheck` + `npm run lint` + `npm run build`.** The build is the **only** check that catches MDX compile errors — never skip it.
9. **Commit per-lecture.** One lecture = one commit. Direct push to your repo (you have write access; no fork-PR dance).
10. **Stop. Show the user the diff or a summary. Wait for their go-ahead before the next lecture.**

### The slide-count rule (mistake learned the hard way)

The `<SourceDoc note="…">` slide count **MUST be the actual PDF page count from `pdfinfo`** — never the beamer footer "N / total" and never the "X / Y" frame counter that appears in `pdftotext` output.

Beamer decks use `\pause` and overlays: each logical frame expands into several physical PDF pages, so the footer total is far below the real page count. In the algorithms run, multiple early lectures had the wrong count noted (off by 2-4×) because someone read the footer instead of running `pdfinfo`. They all had to be corrected.

**Always `pdfinfo` first.** If the deck has overlays (most beamer decks do), the footer is wrong.

---

## 6. Exercise integration — every pass touches problems too

A lecture rework is **not** finished when the prose and the interactives are right. **Every pass also includes a sweep over the problems that touch the lecture**, in both directions:

### What to read each pass

- **Past exam problems.** You are **allowed and encouraged** to read past exam papers (and frontistirio / tutoring problems if the repo has them). Use them as ground truth: when the lecture teaches a pattern, find the **actual exam problems** where that pattern shows up and surface them in the page.
- **The end-of-page exercise block.** Every lecture page has (or should have) an «Ασκήσεις από εξετάσεις» / "exercises from past exams" block near the bottom — typically rendered by a `<LectureExercises lectureSlug="…" />` component or equivalent that pulls from a central exercise bank. **Read this block as part of the pass.** Are the exercises actually well-matched to the concepts the page now teaches? Are 2024/2025 problems (the most recent, most likely to recur in style) prominently surfaced?
- **The «Σώσε το εξάμηνο» (Save the Semester) flow.** The site has (or should have) an exercise-first study path — usually at `/practice/sose-to-eksamino` — that walks the student through problems and routes them back to the lecture when they're stuck. **For each lecture you're reworking, find every problem in that flow that leads to or depends on this lecture.** Make sure the lecture actually delivers what the flow promises when it sends the student here.

### What to do about it

- **Reference exam problems inline when they make a pattern click.** When a lecture introduces a technique, follow up with: «αυτό ακριβώς ζητείται στο Θέμα 3 του Σεπτεμβρίου 2024 — δες το [εδώ](…)». Don't just list problems at the bottom; **cite the specific problem at the specific moment** in the page where the pattern first appears. Use the existing `<ExamProblem year="…" weight="…">` component (or build one if it doesn't exist) for inline problem citations.
- **Tag recent problems prominently.** 2024 and 2025 problems get a year badge in the UI — these are the most likely to recur in style. The site already (or should) have visual badge convention; preserve it.
- **Check that every concept on the page has at least one matched exam problem somewhere.** A "thinking pattern" callout that says "reach for this when you see X" is much stronger if it's followed by an exam problem that has X in its wording.
- **Check that every recent exam problem on relevant topic is reachable from the lecture.** If a 2024 problem hits the lecture's topic and isn't in the end-of-page block, add it.
- **Don't invent exam problems. Don't paraphrase.** Use the actual problem statements (transcribed if a transcription bank exists; linked to source PDF/image if not). The user's [[CLAUDE.md]] equivalent will tell you the project's rules on transcription vs raw scans.

### When you find a gap

If the exam-problem sweep reveals that a concept the page teaches has **no exam-problem analogue** anywhere in the bank, surface this to the user — they may want to weight that concept lower, or hunt for the problem you're missing. Don't silently move on.

This pass is part of the standard. Treating it as optional is one of the corner-cuts the user explicitly does not accept.

---

## 7. Reference pages — a design question, not just content

The K17 repo has a `/formulas` route that was conceived early on as a per-topic "cheat sheet" — definitions, formulas, key recurrences, each entry tagged with a `derivedIn` back-pointer to the lecture where it's introduced. The file's own header comment reads:

> «*Status: skeleton sections. Populate per-lecture as we move through the syllabus.*»

That population **largely did not happen.** Lecture work focused on the lecture pages themselves and the reference page was left half-built. The user has explicitly flagged this and wants the SP rework to **not repeat the mistake**.

The user's framing — verbatim:

> «right now it looks to me like just one idea we had at the beginning and gave up on later and I think it needs to be looked into more»

So: **treat reference pages as a real design question, not a patch job on a half-built thing**.

### Questions to actually answer

Before you decide *what* to put on the reference page, decide *what the reference page is*. Ask yourself, on the record:

- **What is its purpose for the student?** Study companion read between lectures? Pre-exam revision tool? Quick-jump nav when stuck on an exercise? All three? Each implies a different shape.
- **What's the exam regime?** This matters more for SP than for K17. **K17 is closed-book** — its reference page can only be a *study* tool. **SP traditionally hands the student a τυπολόγιο (formula sheet) inside the exam** — so the SP reference page question is fundamentally different. Mirror the in-exam τυπολόγιο so students practise with the same surface? Or build a richer study companion that *contains* the τυπολόγιο plus derivations and intuitions? Or both, with the in-exam subset marked? **You must decide this with the user before you build.**
- **One page or many?** A single `/formulas` mega-page (current K17 shape) vs per-chapter sub-pages vs per-lecture appendices vs a sidebar slide-out (the K17 `FormulaSheetPanel` does this for `/practice`). Each has trade-offs for findability, search, scroll-fatigue.
- **What's the relationship to lecture pages?** K17 has a one-way `derivedIn` pointer from formula → lecture. Should there also be a pointer the other way (lecture surfaces its own reference-page entries)? Should entries be auto-generated from the lecture, or hand-curated?
- **What's the relationship to exercises?** K17's `FormulaSheetPanel` is mounted on `/practice` because students stuck on a problem need quick reminders. Is this enough? Should the reference open *contextually* (the exercise mentions «Nyquist rate» → the τυπολόγιο jumps to that entry)?
- **What entry granularity?** Big formulas only? Definitions too? Worked tiny examples? Common pitfalls? Each granularity is a different document.

### What to do during the audit

1. **Find every existing reference-style page or component in the SP repo.** Could be `/formulas`, `/τυπολόγιο`, `/reference`, `/cheat-sheet`, a side panel component, an appendix MDX file. Catalogue what's there and what state it's in (populated, skeleton, abandoned).
2. **Write up the user-facing purpose of each.** Out loud, in the roadmap. "This page exists to do X for student Y when Z." If you can't write that sentence, the page doesn't have a purpose — surface that.
3. **Propose the SP design.** Based on the SP exam regime (does the course really hand students a τυπολόγιο? what's on it?), propose a concrete shape: how many reference surfaces, what each one is for, how they're populated, how they're surfaced to the student.
4. **Plan the per-lecture pass to include reference-page maintenance.** When you rework lecture N, you ALSO update every reference-page entry that derives from N — or propose new entries when the lecture introduces something quick-reference-worthy. **This is mandatory, not optional.**
5. **Consider new reference pages where they make sense.** Don't just inherit the current set. Examples worth thinking about for SP: a Fourier-transform pairs table (signal ↔ transform), a window-function comparison sheet, a "common transfer function" gallery, a sampling-and-aliasing decision card. If a recurring pattern across lectures wants a single home, give it one.
6. **Don't be afraid to delete.** If a reference page exists and the redesign decides it shouldn't, propose deleting it (or absorbing it into a better home). Half-finished pages erode trust in the rest of the site.

### Mindset

The user's verb is *"looked into more"* — they want **thinking**, not patching. Spend real effort on this. If your proposal is "keep the current `/formulas` and just fill in the empty sections" you have probably under-thought it. Push past that. Justify your choices with what the SP student actually needs, what the SP exam regime actually is, and what the rest of the site is doing.

This is **part of the rollout**, not a side project. Bake it into the roadmap.

---

## 8. Lessons learned the hard way

Things the algorithms run got wrong at first and had to fix:

- **One interactive per lecture is not the standard.** The first pass met that bar and the user pushed back: "every hard concept that can click must have its own bespoke interactive". Multi-concept lectures need multi-interactive treatments.
- **Static SVGs that try to do step-by-step explanation should usually be replaced by an interactive.** If you find yourself drawing 4 panels in one SVG to show "before / during / after / done", make it a stepper instead.
- **Prose that piles up dense math (Σ symbols, set-builder, multiple quantifiers) without a "what this is really saying in plain terms" sentence reads as a wall.** Rewrite intuition-first; let the math follow.
- **Don't `npm run build` while `npm run dev` is running.** Both write `.next/` and the concurrent writes corrupt the dev server (`__webpack_modules__[moduleId] is not a function`). Stop dev, build, restart dev.
- **`'use client'` matters.** Any component with state, effects, event handlers, or browser APIs must declare it. Server-component MDX pages can import client components fine, but a client component itself needs the directive.
- **KaTeX warns on Greek letters used in *text* mode inside math (`\text{…}` with Greek inside, or bare Greek in math).** These are noise, not errors — the build still passes. The algorithms run accepted them as known notices.
- **Read times grow.** Lectures that started at ~30 min ended at ~50 min after the rework. That's fine — the page now does the teaching, not just lists facts.

---

## 9. How this run differs from the algorithms run

- **You commit directly.** The algorithms run had a fork-network constraint that forced a push-to-fork + cross-repo PR dance. You don't — you own your repo. Just commit and push to `origin` like normal.
- **Your slides are different.** SP topics (Fourier, sampling, filters, convolution, DFT/FFT, z-transforms, modulation, …) need a different visualization vocabulary than graph traversals and DP tables. **The kit (Algorithm, RecallCard, drills, etc.) carries over; the bespoke viz catalogue does not.** Build SP-specific interactives that fit the topics.
- **Your repo's current state is unknown to me.** The SP repo may already have a partial site, an older version, or a clean slate. Inspect it first and tell the user what you find before proposing the roadmap.
- **Your course language.** Likely Greek (NKUA), but verify from the existing repo content or the slides. Mix English technical terms freely where they're more natural than the Greek equivalent — the algorithms run kept terms like *recurrence*, *master theorem*, *BFS*, *MST*, *greedy choice*, *amortized* in English even in Greek paragraphs. SP equivalents: *FFT*, *passband*, *aliasing*, *impulse response*, *transfer function*, *Nyquist*, *windowing*, *causal*, *LTI* — all fine in English.

---

## 10. Your first move

Do not write code yet. Do this instead:

1. **Inspect the SP repo.** Read the project root README/CLAUDE.md if any, list `app/`, `components/`, `material/` (or whatever the slides folder is called). Note what stage the site is at — clean slate? partial old site? half-reworked?
2. **Catalogue the lecture PDFs.** For each, run the ASCII-copy + `pdfinfo` + `pdftotext -layout` recipe; jot the page count and the rough topic.
3. **Catalogue the exam-problem bank.** Find where past exam problems and (if any) frontistirio problems live in the repo — usually `private_material/` (git-ignored raw sources) and a transcribed bank in `content/` or similar. Note what years are covered, which topics, whether transcriptions exist. **You'll need this for every lecture pass; surfacing the structure now saves repeat work later.**
4. **Locate the «Σώσε το εξάμηνο» flow** (or its SP equivalent — it may be called something else, or may not exist yet). If it exists, map which problems route to which topics. If it doesn't, flag it as a gap.
5. **Catalogue every reference-style surface in the repo** (per §7): existing `/formulas`-style pages, sidebar panels, appendix MDX files, anything that looks like a quick-reference. For each, note: populated or skeleton? what's its purpose? when did the work on it stop? **Then open the design question:** given SP's exam regime (does the course really hand students a τυπολόγιο in the exam?), what *should* the reference surface(s) be? Do not propose to keep things as-is unless you've genuinely justified that's the right answer.
6. **Identify hard concepts per lecture.** Per the standard, these are the ones that would intimidate a struggling student — the ones that need bespoke interactives.
7. **Draft the roadmap.** Propose phases (similar shape to §4 above, but adapted to SP). For each lecture in the first phase, propose 3-6 bespoke interactives with a one-sentence "this lets the student see X" each, **plus** a brief note on which exam problems / Σώσε-το-εξάμηνο problems will be referenced from that lecture, **plus** which reference-page entries it adds/edits/owns. **Treat reference-page design as a first-class deliverable of the roadmap, not an afterthought** — write up your proposed reference-page architecture as a distinct section of the plan.
8. **Show the roadmap to the user. Wait for explicit go-ahead.** No first-lecture work until they say "start".

Use your `ExitPlanMode` or equivalent to surface the plan cleanly.

---

## 11. The single most important principle, restated

> The goal is not "the content on the page". The goal is **each concept genuinely clicking in a struggling student's brain**.

If a sentence reads smoothly to *you* but might leave a weak student staring at an intimidating term — rewrite it. If a concept could be a slider, a stepper, a tab-group, a build-it-yourself puzzle — build it. Be patient, be visual, be generous. Cost is not a consideration. Best possible teaching is.

Go make the plan.
