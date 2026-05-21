# Exam Transcription — durable plan & progress tracker

> **This is a resumable plan.** In any new session, read this file, pick the
> next `☐` paper from the checklist, follow the per-session protocol, mark it
> `☑`. Repeat. Nothing here depends on chat history.

## Goal

Transcribe **every** past-exam paper (`material/exercises/oldtests/`) and every
frontistirio set (`material/exercises/inclass/`) from PDF/image into the app's
exercise bank — split into per-lecture sub-exercises, each with a
beginner-friendly Greek solution — then **anonymise** and **delete the source
file**.

## Conventions

### Anonymisation
- Never display the real exam date/session anywhere in the app.
- Each source paper gets a fixed label: old exams → **`Παλαιό Θέμα #N`**;
  frontistirio → **`Φροντιστηριακό Σετ #N`** (numbers fixed by the checklist
  below — do not renumber).
- Every transcribed exercise carries `paperLabel: 'Παλαιό Θέμα #N'`, **omits**
  `source` (the dated `ExamSource`), and **omits** `sourceFile`.
- `ExerciseCard` auto-renders `<ExamTranscriptionNotice/>` (the takedown notice)
  whenever `paperLabel` is set.

### Splitting & routing
- One `Exercise` object **per sub-exercise** (Q1, Q2a, Q2b…), never per paper.
- `id`: `palaio-thema-{N}-q{n}{a|b…}` or `front-set-{N}-q{n}{a|b…}` (kebab-case).
- `prerequisites: ['lectures/LNN-…']` — the lecture/topic the sub-exercise
  tests. A genuinely cross-topic part may list several slugs; `LectureExercises`
  then shows it on the **latest** of them.
- `problemNumber`: the original label, e.g. `'Θέμα 2α'`.
- `title`: `'Παλαιό Θέμα #N · Θέμα 2α — <σύντομος ελληνικός τίτλος>'`.

### Transcription & solution
- Read the PDF/image directly and transcribe the Greek **completely and
  verbatim** into `statement` (JSX; math via `<InlineMath>`/`<BlockMath>` from
  `@/components/math`).
- `solution`: Greek, **beginner-friendly**, linear "first-time solver" voice,
  concrete examples, no skipped steps. Shown via `ExerciseCard`'s built-in
  "Δες τη λύση" reveal.
- `origin`: `'past-exam'` for oldtests, `'frontistirio'` for inclass.
- `difficulty`: judged per sub-exercise (`easy` / `medium` / `hard`).
- `topic`: the matching `Topic` value.
- Optionally set `formulaIds` to link cheat-sheet entries (`content/practice/formulas.tsx`).

### Replace, don't duplicate
- When a paper is transcribed, **delete its old whole-paper index entry** from
  `content/practice/exercises.tsx` (the `statement: null` placeholder) and add
  the new sub-exercise objects.

### Source deletion
- Only **after** the paper is fully transcribed and `npx tsc --noEmit` is clean:
  `git rm` (or `rm`) the source PDF/image(s) **and** any sibling
  `:Zone.Identifier` files. Recoverable from git history if ever needed.

## Exercise object template

```tsx
{
  id: 'palaio-thema-1-q2a',
  title: 'Παλαιό Θέμα #1 · Θέμα 2α — Master Theorem',
  topic: 'divide-conquer',
  origin: 'past-exam',
  paperLabel: 'Παλαιό Θέμα #1',
  problemNumber: 'Θέμα 2α',
  weight: 25,                       // optional, if printed
  difficulty: 'medium',
  prerequisites: ['lectures/L03-divide-and-conquer-i'],
  statement: ( <>…verbatim Greek…</> ),
  solution: ( <>…beginner-friendly Greek…</> ),
}
```

## Lecture slugs (routing reference)

`L01-eisagogika` · `L02-asymptotic-analysis` · `L03-divide-and-conquer-i` ·
`L04-divide-and-conquer-ii` · `L05-divide-and-conquer-iii` · `L06-graphs-i` ·
`L07-graphs-ii` · `L08-graphs-iii` · `L09-graphs-iv` · `L10-data-structures` ·
`L11-greedy-i` · `L12-greedy-ii` · `L13-greedy-iii` · `L14-dp-i` · `L15-dp-ii` ·
`L16-dp-iii` · `L17-dp-iv` (prefix each with `lectures/`).

## Per-session protocol

1. Pick the next `☐` paper below.
2. Read its source file(s) and transcribe + split + solve.
3. In `content/practice/exercises.tsx`: remove the paper's old index entry, add
   the sub-exercise objects.
4. `npx tsc --noEmit` — must be clean.
5. Delete the source file(s) + any `:Zone.Identifier` siblings.
6. Mark the paper `☑` here (and note how many sub-exercises it produced).
7. Repeat for ~2–4 papers per session.

---

## Checklist — Old exams (`material/exercises/oldtests/`)

| # | Label | Source file(s) | Status |
|---|---|---|---|
| 1 | Παλαιό Θέμα #1 | `Algorithms-June-2025.pdf` *(deleted)* | ☑ |
| 2 | Παλαιό Θέμα #2 | `Algorithms-Sep-2025.pdf` *(deleted)* | ☑ |
| 3 | Παλαιό Θέμα #3 | `Algorithms-June-2024.pdf` *(deleted)* | ☑ |
| 4 | Παλαιό Θέμα #4 | `Algorithms-September-2024.pdf` *(deleted)* | ☑ |
| 5 | Παλαιό Θέμα #5 | `Ζησιμόπουλος/2023-June-VZ/Algo-June-2023.pdf` *(deleted)* | ☑ |
| 6 | Παλαιό Θέμα #6 | `Ζησιμόπουλος/2023-Sept-VZ/*.jpg` (2) | ☐ |
| 7 | Παλαιό Θέμα #7 | `Ζησιμόπουλος/2022-June-VZ/Algo_june_2022.pdf` | ☐ |
| 8 | Παλαιό Θέμα #8 | `Ζησιμόπουλος/2022-Sept-VZ/*.jpg` (3) | ☐ |
| 9 | Παλαιό Θέμα #9 | `Ζησιμόπουλος/2021-June-VZ/` (Θ1.pdf, Θ2.pdf, 1–15.png) | ☐ |
| 10 | Παλαιό Θέμα #10 | `Αλγο-2020-Σεπτ-1(Slot2).jpg`, `Αλγο-2020-Σεπτ-2(Slot2).jpg` | ☐ |
| 11 | Παλαιό Θέμα #11 | `αλγοριθμοι-και-πολυπλοκοτιτα-εξ-αποστασεως-2020.pdf` | ☐ |
| 12 | Παλαιό Θέμα #12 | `Ζησιμόπουλος/2019-Feb-VZ/2019.pdf` | ☐ |
| 13 | Παλαιό Θέμα #13 | `Ζησιμόπουλος/2018-June-VZ/*.jpg` (2) | ☐ |
| 14 | Παλαιό Θέμα #14 | `Ζησιμόπουλος/2017-Sept-VZ/*.jpg` (2) | ☐ |
| 15 | Παλαιό Θέμα #15 | `Ζησιμόπουλος/2017-Feb-VZ/algo-fevr-2017-zisimopoulos.pdf` | ☐ |
| 16 | Παλαιό Θέμα #16 | `Ζησιμόπουλος/2016-June-VZ/*.jpg` (2) | ☐ |
| 17 | Παλαιό Θέμα #17 | `Ζησιμόπουλος/2016-Feb-VZ/*.jpg` (5) | ☐ |
| 18 | Παλαιό Θέμα #18 | `Ζησιμόπουλος/2015-June-VZ/` (2 pdf, 2 jpg) | ☐ |
| 19 | Παλαιό Θέμα #19 | `Ζησιμόπουλος/2012-Midterm/2012-p.pdf` | ☐ |
| 20 | Παλαιό Θέμα #20 | `Ζησιμόπουλος/2011-Sept-VZ/Σεπτέμβριος 2011-VZ.pdf` | ☐ |
| 21 | Παλαιό Θέμα #21 | `Ζησιμόπουλος/2011-June-VZ/*.jpg` (3) | ☐ |
| 22 | Παλαιό Θέμα #22 | `Ζησιμόπουλος/2010-June-VZ/` (pdf + JPG) | ☐ |
| 23 | Παλαιό Θέμα #23 | `Ζησιμόπουλος/2008-Midterm/2008.pdf` | ☐ |

## Checklist — Frontistirio (`material/exercises/inclass/`)

| # | Label | Source file | Status |
|---|---|---|---|
| 1 | Φροντιστηριακό Σετ #1 | `F1__2023_24__eclass.pdf` *(deleted)* | ☑ 3/3 (Ασκ 0,1,3) |
| 2 | Φροντιστηριακό Σετ #2 | `F2__2023_24.pdf` *(deleted)* | ☑ 8/8 (Ασκ 0–7) |
| 3 | Φροντιστηριακό Σετ #3 | `F3__eclass.pdf` *(deleted)* | ☑ 7/7 (Ασκ 1,2,4,7,8,9,10) |
| 4 | Φροντιστηριακό Σετ #4 | `F4__2023_24__eclass.pdf` *(deleted)* | ☑ 12/12 (Ασκ 1–10 + E0 + Θέμα 4) |
| 5 | Φροντιστηριακό Σετ #5 | `F5__eclass.pdf` *(deleted)* | ☑ 10/10 (Ασκ 1,2,3,5,6,7,8,9,10,11) |
| 6 | Φροντιστηριακό Σετ #6 | `F7__eclass.pdf` | ☐ |
| 7 | Φροντιστηριακό Σετ #7 | `F8__eclass.pdf` | ☐ |
| 8 | Φροντιστηριακό Σετ #8 | `F9__eclass.pdf` | ☐ |
| 9 | Φροντιστηριακό Σετ #9 | `F10__eclass.pdf` | ☐ |
| 10 | Φροντιστηριακό Σετ #10 | `F11__eclass.pdf` | ☐ |
| 11 | Φροντιστηριακό Σετ #11 | `1ο Φροντ.pdf` | ☐ |
| 12 | Φροντιστηριακό Σετ #12 | `2ο Φροντ.pdf` | ☐ |
| 13 | Φροντιστηριακό Σετ #13 | `3ο Φροντ.pdf` | ☐ |

## Progress

**Old exams — fully done: 5 / 23** (#1–#5). Fully pending: 18 (#6–#23).
**Frontistiria — fully done: 5 / 13** (#1–#5). Fully pending: 8 (#6–#13).

Total modular exercises transcribed so far: **89** (14 + 15 + 3 from exams
#1–#3; 9 from exam #4; 7 from exam #5; 41 frontistiria — F1×3, F2×8, F3×7,
F4×12, F5×11).

> **Batch note.** This session: **exam #5 (Παλαιό Θέμα #5) done** (7 modules)
> + **F1 and F5 brought to 100%** (2 + 9 new exercises). All three source files
> deleted. Frontistiria #1–#5 are now fully complete; #6–#13 remain untouched.
> Each session realistically completes ~1 exam + ~2 frontistiria decks at the
> quality bar (verbatim transcription + full beginner solutions).

Next: frontistiria F6–F13; exams resume at Παλαιό Θέμα #6.

## Progress log

_(append one line per completed paper: label — N sub-exercises — date)_

- **Παλαιό Θέμα #1** — 14 sub-exercises (`pt1-th1-q1` … `pt1-th1-q10`,
  `pt1-th2-a`, `pt1-th2-b`, `pt1-th3`, `pt1-th4`), routed to L01/L02/L03/L09/L14/L17.
  Source PDF + `:Zone.Identifier` deleted (recoverable via `git show`). — 2026-05-21.
  ⚠ Note for review: Θέμα 2.2's graph weights were read from a scan; the four
  weight-5 edges should be double-checked against the original if the printed
  multiple-choice options (0/1/2/4) must be matched exactly. The solution
  teaches the counting method regardless.
- **Παλαιό Θέμα #2** — 15 sub-exercises (`pt2-th1-q1` … `pt2-th1-q10`,
  `pt2-th2-1`, `pt2-th2-2`, `pt2-th2-3`, `pt2-th3`, `pt2-th4`), routed to
  L01/L02/L03/L09/L11/L12/L14/L15. Source PDF + `:Zone.Identifier` deleted. — 2026-05-21.
- **Παλαιό Θέμα #3** — 3 sub-exercises (`pt3-th1`→L09, `pt3-th2`→L04,
  `pt3-th3`→L13). Source PDF + `:Zone.Identifier` deleted. — 2026-05-21.
- **Παλαιό Θέμα #4 (partial)** — Θέμα 1 only: 5 sub-exercises
  (`pt4-th1-q1`→L01, `pt4-th1-q2`→L02, `pt4-th1-q3`→L17, `pt4-th1-q4`→L03,
  `pt4-th1-q5`→L02). Θέματα 2–4 still pending; source kept. — 2026-05-21.
- **Φροντιστηριακά Σετ #1–#5 (partial)** — one signature exercise per deck:
  `front-set-1-ask0`→L02, `front-set-2-ask2`→L02, `front-set-3-ask4`→L03,
  `front-set-4-ask1`→L03, `front-set-5-ask10`→L10. Remaining exercises in each
  deck still pending; sources kept. — 2026-05-21.
- **Παλαιό Θέμα #4 (completed)** — Θέματα 2–4: `pt4-th2-a`→L09, `pt4-th2-b`→L09,
  `pt4-th3`→L03, `pt4-th4`→L15 (added to the 5 Θέμα-1 exercises). Paper now 100%
  done; source PDF + `:Zone.Identifier` deleted. — 2026-05-21.
- **Φροντιστηριακό Σετ #2 (7/8)** — +6 exercises rendered via Ghostscript & solved:
  `front-set-2-ask0/ask1/ask3/ask5/ask6/ask7`, all →L02. Only Άσκηση 4 (dense
  scanned multi-part slide) pending; source kept. — 2026-05-21.
- **Φροντιστηριακό Σετ #2 (completed)** — +`front-set-2-ask4`→L02 (ασυμπτωτική
  τάξη & διάταξη συναρτήσεων). Deck now 8/8 (Ασκ 0–7); source PDF deleted. — 2026-05-22.
- **Φροντιστηριακό Σετ #3 (completed)** — +6 exercises: `front-set-3-ask1`
  (Fibonacci κλειστός τύπος), `ask2` (διπλή ρίζα), `ask7` (3 αλγόριθμοι D&C),
  `ask8` (επαγωγή n log n), `ask9` (Master με log-όρο), `ask10` (T(√n)+1) — all
  →L03 (added to `ask4`). Deck now 7/7; source PDF deleted. — 2026-05-22.
- **Φροντιστηριακό Σετ #4 (completed)** — +11 exercises: `front-set-4-ask2/3/4`
  (αναδρομές, αντικατάσταση →L03), `ask5` (πλειοψηφικό στοιχείο →L04), `ask6`
  (σημαία Ολλανδίας →L04), `ask7` (χαμένος όρος →L03), `ask8` (διάμεσος 2
  πινάκων →L04), `ask9` (τομές = αντιστροφές →L04), `ask10` (Master με log-όρο
  →L03), `e0-ask6` & `thema4` (πολυπλοκότητα βρόχων →L02) — added to `ask1`.
  Deck now 12/12; source PDF deleted. — 2026-05-22.
- **Παλαιό Θέμα #5** — 7 modules: `pt5-th1` (συνεκτικές συνιστώσες →L06),
  `pt5-th1b` (σύγκριση ασυμπτωτικών →L02), `pt5-th2-a` (κατάταξη 2^√logn →L02),
  `pt5-th2-b` (Master Theorem →L03), `pt5-th3-a` (Hamiltonian Path ∈ NP →L09),
  `pt5-th3-b` (MST_D ∈ NP, ∈ P →L09), `pt5-th4` (μέγιστο ανεξάρτητο σύνολο σε
  μονοπάτι, DP →L14). Stale `exam-june-2023` index entry removed; source PDF
  deleted. — 2026-05-22.
- **Φροντιστηριακό Σετ #1 (completed)** — +2 exercises: `front-set-1-ask1`
  (διάταξη συναρτήσεων ανά ομάδα), `front-set-1-ask3` (πολυπλοκότητα με log*) —
  both →L02 (added to `ask0`). Deck now 3/3 (Ασκ 0,1,3· η σειρά παραλείπει την
  Ασκ 2); source PDF deleted. — 2026-05-22.
- **Φροντιστηριακό Σετ #5 (completed)** — +9 exercises: `front-set-5-ask1`
  (Stooge Sort →L03), `ask2` (βίδες/παξιμάδια →L04), `ask3` (Quicksort
  ανακάτεμα →L04), `ask5` (συνεκτικές συνιστώσες →L06), `ask6` (μονοπάτι
  μέγιστης αξιοπιστίας →L08), `ask7` (μονοπάτι μέσα από διατεταγμένα υποσύνολα
  →L08), `ask8` (πιο αναξιόπιστο μονοπάτι σε DAG →L08), `ask9` (Σ/Λ
  μετασχηματισμοί βαρών →L08), `ask11` (ζεύγη με δοσμένο άθροισμα →L10) — added
  to `ask10`. Deck now 10/10 (η σειρά παραλείπει την Ασκ 4); source PDF
  deleted. — 2026-05-22.
