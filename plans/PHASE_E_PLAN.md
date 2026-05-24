# Phase E — Past-Exam Integration, Cross-Problem Patterns & Algorithm Description Audit

> **Read this file first in any new session.** It is a resumable plan: do ONE
> task per turn, stop and show, wait for review before the next. The standard
> is unchanged — see [[lecture-rework-standard]] in `~/.claude/projects/.../memory/`.
> No cutting corners. Cost is not a consideration.

---

## 0. How to resume Phase E (after `/clear` or `/reset`)

The user pastes this exact prompt to start any session:

```
Continue Phase E. Before anything else, read plans/PHASE_E_PLAN.md
end-to-end and read the memory files lecture-rework-standard,
pseudocode-philosophy, and site-wide-rollout — treat all of them as
binding. Find the next unchecked task in the Progress tracker at the
top of the plan. Do ONE task only — then stop and show me. Same
standard as Phases A through D: deep, maximum-effort, no cutting
corners. Update the Progress tracker checkbox AND the relevant memory
file when you finish.
```

**Self-orienting protocol on receipt of that prompt:**
1. Read this file end-to-end.
2. Read the three binding memory files (above).
3. Look at the Progress tracker (§ 1) — the first unchecked `☐` is the next
   task. If multiple sub-tasks are stacked under a phase (e.g. E.1 has 17
   per-lecture sub-tasks), pick the first unchecked sub-task in order.
4. Cross-check with `git log feat/site-wide-rollout --oneline -25` — the
   commit titles map to the plan's task labels (`feat(L09-inline-citations)`,
   `feat(L09-pairs)`, etc.). If a commit exists for a task that's not
   ticked, tick it before starting.
5. Execute ONE task. Run typecheck + lint + build. Commit. Push to `fork`.
6. **Update the Progress tracker checkbox and a memory file**, then stop
   and show the user.

---

## 1. Progress tracker

Tick (`☑`) each item as it's committed. Newest tasks go at the bottom of
a sub-list. Update this section in the same commit that finishes the task.

- ☑ **Pre-flight audit** → `plans/E_PREFLIGHT.md` (done 2026-05-24 — branch + bank state captured, 3 user-decision questions surfaced, E.1 sequencing recommended; see [[phase-e-preflight]])
  - ☑ Per-card takedown notice removed (out-of-band on 2026-05-24, commit forthcoming). Future executor: skip this sub-step.
- ☐ **E.1 — Inline `<ExamProblem>` citations** (17 per-lecture sub-tasks):
  - ☐ L01 ☐ L02 ☐ L03 ☐ L04 ☐ L05 ☐ L06 ☐ L07 ☐ L08 ☐ L09
  - ☐ L10 ☐ L11 ☐ L12 ☐ L13 ☐ L14 ☐ L15 ☐ L16 ☐ L17
- ☐ **E.2 — Pattern-pair catalogue** → `plans/E_PATTERN_PAIRS.md`
- ☐ **E.3 — `<RelatedPair>` + bidirectional surfacing** (per-lecture, depends on E.2):
  - filled in by E.2's output
- ☐ **E.4 — Algorithm prose + `keywords` + `nutshell` audit** (17 per-lecture sub-tasks):
  - ☐ L01 ☐ L02 ☐ L03 ☐ L04 ☐ L05 ☐ L06 ☐ L07 ☐ L08 ☐ L09
  - ☐ L10 ☐ L11 ☐ L12 ☐ L13 ☐ L14 ☐ L15 ☐ L16 ☐ L17
- ☐ **E.5 — Transcription completion** (~21 entries; per-paper turns):
  - filled in by pre-flight's enumeration
- ☐ **E.6 — Wire the SOSE flow** (2024/2025 priority, pattern pairs, keyword strips, «πρότυπα σκέψης» tab)
- ☐ **E.7 — Final integration sweep + PR description update**

---

## 2. The big picture

After [[site-wide-rollout]] (theory) and [[phase-d-problem-rework]] (problems)
closed, the K17 site teaches every lecture's concepts and every transcribed
problem to the standard. **What it still does not do well:**

1. **Surface specific past-exam problems INSIDE the lecture pages** — the
   `<ExamProblem>` MDX component is registered but never used inline. Students
   reading the L09 page should see «Αυτό ακριβώς εμφανίστηκε στο Ιούνιος 2024
   Θέμα 3» right next to the concept that explains it.
2. **Make exam ↔ frontistirio recognition reflexive.** The K17 exams almost
   always re-phrase a frontistirio problem in different domain language (the
   user's example: «τραπεζικές κάρτες» in a frontistirio → «αρχαίες πλάκες» in
   the exam, identical algorithm). Students who recognise the pair pass; those
   who don't, panic. The site must teach the pairing explicitly.
3. **Surface natural-language description and keyword-vocabulary as the
   primary deliverable per algorithm.** The course rewards a correct *description*
   of the algorithm — pseudocode is secondary and even discouraged by some
   examiners ("πιο safe να γράψεις σε φυσική γλώσσα"). The `<Algorithm>` and
   `<Pseudocode>` components are already designed this way, but **we need to
   audit every existing lecture page** and make sure the prose description is
   present, complete, and uses the keywords the student would write under
   exam pressure.
4. **Make sure the 2024/2025 papers are reachable from everywhere** — every
   lecture they touch, the SOSE flow, the practice hub. These are the highest-
   signal problems for the exam to recur in style.

The user's framing of the pseudocode/natural-language split (verbatim from
chat 2026-05-22):

> «Νομίζω τα φροντιστήρια είναι αυστηρά σε ψευδοκώδικα για να είναι πολύ
> ακριβές ο αλγόριθμος και πολλοί λανθασμένα νομίζουν ότι πρέπει να τα λύνουν
> έτσι και μετά με μικρά λάθη χάνουν βαθμό.
>
> Εγώ στο site θα έβαζα δύο εκδοχές, μια μόνο ψευδοκώδικα και μια φυσική
> γλώσσα. Φυσική γλώσσα θα το είχα ως το σημαντικότερο: να γνωρίζω πως να
> περιγράψω τον αλγόριθμο. Ψευδοκώδικα ως δευτερεύον και ευέλικτο.
>
> Επίσης είναι πολύ δύσκολο να μάθεις απέξω ακόμα και σε φυσική γλώσσα.
> Συνήθως αρκεί να μάθεις λέξεις-κλειδιά και να έχεις ξεκαθαρίσει κάποια
> βήματα στο μυαλό σου, ίσως το site μπορεί να βοηθάει και σε αυτό.
>
> Και υπάρχουν patterns στον τρόπο σκέψης που επίσης μπορεί κάποιος να μάθει,
> πέρα από την λύση του συγκεκριμένου προβλήματος αξίζει να αναφέρει το site
> και τέτοια πράγματα.»

This is binding. Apply it everywhere on the site.

---

## 3. Binding constraints

- **Read `~/.claude/projects/C--Users-alexg-algorithms-with-steliosrotas/memory/lecture-rework-standard.md` at the start of every session** — same standard, same expectations.
- **One task per turn, stop and show.** Same cadence as Phases A/B/C/D.
- **Don't invent exam problems.** Every cited problem must be a real entry in
  `content/practice/exercises.tsx`, or transcribed first as part of this
  phase under the rules of `plans/EXAM_TRANSCRIPTION.md`.
- **Anonymisation rule from `EXAM_TRANSCRIPTION.md` still applies** — use
  `paperLabel: 'Παλαιό Θέμα #N'`, never display the real exam date in the
  exercise-bank-driven UI. **But** for the lecture-page inline citations
  via `<ExamProblem year="…">`, dated exam papers are the established
  precedent — confirm with the user before scope changes.
- **No `npm run build` while `npm run dev` is running** (see [[local-build-env]]).
- **Push to `fork` remote, not origin** — see [[pr-workflow]]. The open PR
  #3 into `steliosrotas/algorithms-with-steliosrotas` tracks the branch.
- **Memory must be updated** after each task — extend `phase-e-*` memory
  files as the project artifact, and update `site-wide-rollout` with the
  status.

---

## 4. Pre-flight (mandatory before E.1 is executed)

**Do not start E.1 until this is done.** This is a single-turn task by itself.

### Pre-flight checklist

1. **Pull origin/main and inspect.** Has Stelios added any new exam content
   since 2026-05-22 (the PR #2 merge)? Specifically check:
   - `material/past_exams/` — new PDFs added?
   - `content/practice/exercises.tsx` — new transcribed entries beyond what's
     on `feat/site-wide-rollout`?
   - Any new MDX components for exam citation?

   ```
   git fetch origin main
   git log origin/main --oneline -20
   git diff origin/main..HEAD -- content/practice/exercises.tsx material/ | head -200
   ```

2. **Audit `<ExamProblem>` usage.** Grep for inline `<ExamProblem>` in every
   lecture MDX. Confirm the count is zero — and document, lecture-by-lecture,
   the natural places where it SHOULD appear.

3. **Audit the prose-vs-pseudocode balance.** For every existing `<Algorithm>`
   block on a lecture page, check whether the children include a real
   natural-language description before the `<Pseudocode>`, or whether
   pseudocode is doing all the work alone. Produce a per-lecture verdict
   (✓/✗) and the names of the algorithm blocks that need rewriting.

4. **Audit the SOSE flow.** Read `app/practice/sose-to-eksamino/page.tsx`,
   `lib/sose.ts`, `components/sose/SoseClient.tsx`. Document:
   - How is `SOSE_PATH` constructed? Difficulty ordering?
   - Are 2024/2025 problems prioritised in the path? Tagged in the UI?
   - Does the per-problem coaching (`SOSE_COACHING`) currently surface
     pattern-pairs?

5. **Confirm what's transcribed.** `content/practice/exercises.tsx` has 141
   entries, ~21 with `statement: null`. Generate a list of the 21
   untranscribed entries (id + paperLabel + the lecture(s) they target).
   This is the queue for E.5 (transcription completion).

**Output**: `plans/E_PREFLIGHT.md` — a written audit covering all 5 items.

### Pre-flight code change: ~~remove the per-card takedown notice~~ — DONE

The per-card render of `<ExamTranscriptionNotice />` was removed from
`ExerciseCard.tsx` on 2026-05-24 (out-of-band, ahead of pre-flight). The
component file in `components/content/ExamTranscriptionNotice.tsx` is left
in place for a possible future single-banner mount on `/practice`; nothing
renders it currently. The pre-flight audit only needs to **confirm** this
state and decide whether to (a) leave it as-is, (b) mount a single discreet
notice on the practice hub, or (c) delete the component file entirely.

**Commit message for pre-flight**: `docs(phase-e): preflight audit`.

---

## 5. Tasks

Each task is a single session. After each, stop and show the user.

### Task E.1 — Build the `<ExamProblem>` inline citation pattern

**Goal.** Make every lecture page surface its associated past-exam problems
inline, at the exact moment the page first teaches the pattern that the
problem uses. This is the single most-asked-for-by-students surface and it
is currently empty.

**Inputs.**
- The 141-entry transcribed bank in `content/practice/exercises.tsx`.
- The 4 publicly-available 2024/2025 papers in `material/past_exams/`.
- The lecture pages in `app/(content)/lectures/L*/page.mdx`.
- The pre-flight audit (`plans/E_PREFLIGHT.md`).

**What to build.**
1. **Decide the inline-citation pattern.** Probably:
   - Extend `<ExamProblem>` (currently registered but unused) to render
     compact: «Θέμα Εξετάσεων Ιουνίου 2024 — Θ.3 [Δες την άσκηση →]» with
     deep-link to `/practice#exercise:<id>`. The full statement + solution
     stays in the practice bank; the lecture-page citation is a chip + a
     one-sentence «τι ρωτάει».
   - Add a `relatedExerciseId` prop so the citation is grounded in a real
     bank entry (not invented).
   - Add a `pattern` prop describing the recognition cue
     («αν δεις: ευθυγράμμιση συμβολοσειρών με σκορ +1/-1/-2 → ίδια DP, max
     αντί min»).
2. **Per lecture, decide WHERE the inline citations go.** Use the audit
   from E.1 of E_PREFLIGHT.md. For each lecture, identify 1–3 inline
   citations — placed at the natural «αυτό ακριβώς ζητείται» moment in
   the prose, not lumped at the bottom.
3. **Don't duplicate the end-of-page `<LectureExercises>` block.** That
   bottom block stays (it's the complete index). Inline citations are
   SELECTIVE — they highlight the canonical pattern instance.

**Per-lecture cadence.** L01 → L17, one lecture per turn. Same rhythm as
Phases A/B/C/D.

**Acceptance.** Each lecture page has at least one inline `<ExamProblem>`
citation in its natural body, deep-linking to a real bank entry, AND the
component renders cleanly in both light + dark mode + on mobile.

**Estimated work.** 17 turns (one per lecture). 1 component extension
(`<ExamProblem>` properly built). ~40 inline citations total (~2.5 per
lecture average).

**Commit message template**: `feat(L{NN}-inline-citations): inline ExamProblem citations at the natural pattern moments`.

---

### Task E.2 — Pattern discovery: exam ↔ frontistirio pairs

**Goal.** Systematically identify pairs «same algorithm, different phrasing»
between transcribed past-exam problems and transcribed frontistiria. The user
gave the canonical example: «τραπεζικές κάρτες» frontistirio ⇔ «αρχαίες
πλάκες» exam — identical algorithm under different domain costume. Find every
such pair in the bank, name the underlying pattern, and surface both ways.

**Inputs.**
- Every `'past-exam'` entry in `content/practice/exercises.tsx`.
- Every `'frontistirio'` entry in `content/practice/exercises.tsx`.

**Process.**
1. **Catalogue.** For each transcribed problem, write one line: «id ·
   algorithm-fingerprint · domain». Algorithm fingerprint = «greedy interval
   scheduling by EF», «WIS», «D&C majority element», «BF neg-cycle detect»,
   «hash-table meet-in-the-middle», etc. Domain = the cover story (bank
   cards, ancient tablets, taxi rides, ad slots, lampposts, etc.).
2. **Group by fingerprint.** Anything with ≥ 2 problems on the same
   fingerprint where the cover stories differ is a candidate pair.
3. **For each pair, write the «recognition cue»** — what feature of the
   wording maps the exam problem to the frontistirio template. E.g.
   «σταθερή διάρκεια αντικειμένου + προθεσμία = WIS, ανεξάρτητα από το
   όνομα του αντικειμένου».
4. **Score confidence.** «definite» (truly the same algorithm, just renamed)
   vs «strong analogy» (same algorithm with one parameter changed) vs
   «weak» (overlapping technique, different shape).

**Output.** `plans/E_PATTERN_PAIRS.md` — a written catalogue of pairs with:
- pattern fingerprint name
- list of problem IDs in the pair
- recognition cue
- confidence
- which lecture's ExamRadar should mention this pattern

**No code changes in this task.** It is research + a document.

**Acceptance.** A document the user can scan and either accept or correct.
Realistic estimate: 12–25 pairs (the bank has ~120 transcribed problems
across 17 lectures; the user said "almost every exam has at least one
such pair", so per-exam ≥ 4 papers × 1+ pairs = 8–10 minimum).

**Commit message**: `docs(phase-e): catalogue of exam ↔ frontistirio pattern pairs`.

---

### Task E.3 — Build the `<RelatedPair>` component + retrofit every pair from E.2

**Goal.** Surface every pair from E.2 in BOTH directions, inside the
solution of both problems.

**What to build.**
1. **`<RelatedPair>` component.** Renders an emphasized block:
   - «Ίδια άσκηση, άλλο όνομα» banner
   - one-sentence pattern name
   - the paired problem's title + deep-link
   - the recognition cue («αν δεις X στην εκφώνηση, σκέψου Y»)
   - styled distinctly from a regular Callout so the student notices it
2. **Embed in every problem of every pair.** Both ways — the exam solution
   says «αυτό είναι ισόμορφο με {frontistirio-id}», AND the frontistirio
   solution says «εμφανίστηκε σε εξέταση ως {exam-id}».
3. **Extend per-lecture `<ExamRadar>`** with a new item for each recurring
   pattern surfaced this way (high-likelihood note).

**Per-lecture cadence.** Same. L01 → L17, one lecture per turn — but only
the lectures that have at least one pair. The plan file from E.2 enumerates
which lectures qualify.

**Acceptance.** Every pair is bidirectionally surfaced; ExamRadar items
exist for the recurring patterns; deep links work; production build is
green.

**Commit message template**: `feat(L{NN}-pairs): surface exam ↔ frontistirio pattern pairs in both directions`.

---

### Task E.4 — Audit & enrich the Algorithm natural-language descriptions

**Goal.** Make sure every `<Algorithm>` block on every lecture page has:
1. A complete natural-language description as its primary content (children
   before `<Pseudocode>`), written so a student under exam pressure can
   reconstruct the algorithm in their own words.
2. A `keywords` strip — the «λέξεις-κλειδιά» the user said are the load-
   bearing thing. Currently `RecallCard` has a `keywords` field; we need a
   parallel «exam-vocabulary chip strip» on the Algorithm block itself.
3. A «short version» — 3 sentences max — that the student can memorize.

**What to build.**
1. **Extend `<Algorithm>`** to take an optional `keywords?: string[]` prop
   (already on RecallCard) and an optional `nutshell?: ReactNode` prop
   (the 3-sentence memorizable version). Render both prominently.
2. **Audit every existing Algorithm block site-wide.** For each:
   - If the prose description is thin → rewrite it.
   - If the keywords are missing → author them.
   - If a nutshell is missing → write one.
3. **Pseudocode stays collapsed-by-default** (already the case). No regression.

**Cadence.** L01 → L17, one lecture per turn. The pre-flight audit
already produced the per-lecture verdict; use it.

**Acceptance per lecture.** Every Algorithm block on the page renders with
prose-first, keywords-strip, nutshell, and (collapsed) pseudocode. Reading
just the prose + keywords + nutshell should be enough to reconstruct the
algorithm in natural language.

**Commit message template**: `feat(L{NN}-algo-prose): keywords + nutshell + natural-language description audit`.

---

### Task E.5 — Finish the transcription queue

**Goal.** Bring the 21 untranscribed (`statement: null`) entries up to the
Phase D bar. Without this, parts of the bank are dead-link entries that
just route to the source PDF.

**Inputs.**
- The 21-entry list from `E_PREFLIGHT.md`.
- `private_material/oldtests/` and `private_material/inclass/` (the raw
  source PDFs/images — git-ignored, must be present locally).
- The transcription protocol in `plans/EXAM_TRANSCRIPTION.md`.

**Per-paper cadence.** One paper per turn (a paper may transcribe to
multiple `Exercise` entries). Apply Phase D's full bar to each new entry
as it's transcribed: visuals, thinking-pattern callout, SOSE coaching,
ExamRadar link.

**Acceptance.** Every `statement: null` entry has been replaced with a
real transcribed JSX statement + solution + visualization (Phase D
treatment) OR explicitly documented-and-skipped (per the L05/L07 empty
precedent — only if the entry's content genuinely lives elsewhere).

**Commit message template**: `feat(transcribe-{paperLabel-slug}): transcription + Phase D treatment`.

---

### Task E.6 — Wire the SOSE flow to surface 2024/2025 + pattern pairs

**Goal.** «Σώσε το εξάμηνο» should aggressively prioritise:
1. **2024/2025 papers** — these are the most recent, most likely to recur
   in style.
2. **Pattern-pair signals.** When the user is on a problem that has a
   pair from E.2, the SOSE coaching panel surfaces «αυτό εμφανίστηκε σε
   εξέταση ως X» live.
3. **Keyword vocabulary.** When stuck on a problem, the keywords strip
   from the relevant Algorithm becomes available as a hint.

**What to build / audit.**
1. **Re-check `lib/sose.ts` path-construction logic** — does it already
   surface 2024/2025? If not, weight them.
2. **Extend the SOSE coaching panel** to render `<RelatedPair>` and the
   Algorithm `keywords` strip when the current problem qualifies.
3. **Add a «πρότυπα σκέψης» tab** to the SOSE flow that catalogues every
   pattern from E.2 — the student can browse «what 12 recurring patterns
   should I know cold for the exam».

**Acceptance.** Walking through SOSE for one session, the student
encounters:
- 2024/2025-tagged problems early.
- Pattern-pair hints when relevant.
- Keyword strips on demand.
- A pattern catalogue accessible from the page.

**Commit message**: `feat(sose): surface 2024/2025 + pattern pairs + keyword strips`.

---

### Task E.7 — Final integration pass & release notes

**Goal.** One sweep that verifies the cross-surface integration is coherent.

**Checklist.**
- Every inline `<ExamProblem>` deep-links to a real bank entry.
- Every `<RelatedPair>` links both ways.
- Every Algorithm block has prose + keywords + nutshell.
- The 21 transcription gaps are closed.
- The SOSE flow exposes 2024/2025 + patterns + keywords.
- `npm run typecheck`, `npm run lint`, `npm run build` all pass.
- The open PR #3 description is updated (or PR #4 is opened) to summarise
  Phase E.

**Output**: a commit `feat(phase-e): integration pass + memory update` +
the PR description rewrite. Update both `[[site-wide-rollout]]` and
`[[phase-d-problem-rework]]` memory files; create `[[phase-e-exam-integration]]`
if the work warrants its own memory record.

---

## 6. Components likely to be built or extended

In rough order of when they're needed:

| Component | Status | Phase E work |
|---|---|---|
| `<ExamProblem>` | Registered, never used | Extend with `relatedExerciseId`, `pattern`, deep-link; build per-lecture inline use |
| `<RelatedPair>` | NEW | Build in E.3 |
| `<Algorithm>` | Built, in use | Extend with `keywords?`, `nutshell?`; per-lecture audit in E.4 |
| `<Pseudocode>` | Built, in use | No change — collapsed-by-default already matches the philosophy |
| `SOSE_COACHING` entries | Populated for ~100 problems | Per-pair entries added in E.3; pattern-name field added |
| `lib/sose.ts` | Built | Reweight 2024/2025; add pattern-catalogue; expose keywords |

---

## 7. Common per-task mechanics

Same as Phase D:
1. Pre-flight: read [[lecture-rework-standard]] from memory; read this file.
2. For lecture passes: `pdftotext`/`pdfinfo` on a temp ASCII copy of the PDF
   if any prose is being rewritten; cite real material only.
3. `npm run typecheck` + `lint` + `build` before commit.
4. Commit per task. Push to `fork` remote. The open PR #3 auto-updates.
5. Stop and show the user.
6. Update the memory file.

---

## 8. Acceptance criteria for "Phase E complete"

- Every lecture page has at least one inline `<ExamProblem>` citation at a
  natural body location, NOT lumped at the end.
- Every documented pair from E.2 surfaces bidirectionally on both problems.
- Every Algorithm block has prose-first, keywords, nutshell, and collapsed
  pseudocode.
- Zero `statement: null` entries remain (or each is explicitly
  documented-and-skipped per the L05/L07 precedent).
- The SOSE flow exposes 2024/2025, pattern pairs, and keyword strips.
- The integration commit lands cleanly; build is green; PR description
  is up to date.

---

## 9. Things NOT in scope

- No new lecture material. The 17 lecture pages are closed; Phase E only
  ADDS inline citations and `keywords`/`nutshell` props, never rewrites the
  pedagogical body.
- No new visualizations of algorithms. Phase E surfaces and connects;
  vizzes belong to phases A–D and Phase D for problems.
- No infrastructure refactor (auth, supabase, comments). Leave alone.
- Reference page redesign (`/formulas`) — the SP_HANDOFF discussion flagged
  it as «looked into more», but that's an SP-side question. For K17, the
  current `/formulas` skeleton stays unless the user requests otherwise
  during E.7.
