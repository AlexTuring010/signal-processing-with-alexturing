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
| 2 | Παλαιό Θέμα #2 | `Algorithms-Sep-2025.pdf` | ☐ |
| 3 | Παλαιό Θέμα #3 | `Algorithms-June-2024.pdf` | ☐ |
| 4 | Παλαιό Θέμα #4 | `Algorithms-September-2024.pdf` | ☐ |
| 5 | Παλαιό Θέμα #5 | `Ζησιμόπουλος/2023-June-VZ/Algo-June-2023.pdf` | ☐ |
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
| 1 | Φροντιστηριακό Σετ #1 | `F1__2023_24__eclass.pdf` | ☐ |
| 2 | Φροντιστηριακό Σετ #2 | `F2__2023_24.pdf` | ☐ |
| 3 | Φροντιστηριακό Σετ #3 | `F3__eclass.pdf` | ☐ |
| 4 | Φροντιστηριακό Σετ #4 | `F4__2023_24__eclass.pdf` | ☐ |
| 5 | Φροντιστηριακό Σετ #5 | `F5__eclass.pdf` | ☐ |
| 6 | Φροντιστηριακό Σετ #6 | `F7__eclass.pdf` | ☐ |
| 7 | Φροντιστηριακό Σετ #7 | `F8__eclass.pdf` | ☐ |
| 8 | Φροντιστηριακό Σετ #8 | `F9__eclass.pdf` | ☐ |
| 9 | Φροντιστηριακό Σετ #9 | `F10__eclass.pdf` | ☐ |
| 10 | Φροντιστηριακό Σετ #10 | `F11__eclass.pdf` | ☐ |
| 11 | Φροντιστηριακό Σετ #11 | `1ο Φροντ.pdf` | ☐ |
| 12 | Φροντιστηριακό Σετ #12 | `2ο Φροντ.pdf` | ☐ |
| 13 | Φροντιστηριακό Σετ #13 | `3ο Φροντ.pdf` | ☐ |

## Progress log

_(append one line per completed paper: label — N sub-exercises — date)_

- **Παλαιό Θέμα #1** — 14 sub-exercises (`pt1-th1-q1` … `pt1-th1-q10`,
  `pt1-th2-a`, `pt1-th2-b`, `pt1-th3`, `pt1-th4`), routed to L01/L02/L03/L09/L14/L17.
  Source PDF + `:Zone.Identifier` deleted (recoverable via `git show`). — 2026-05-21.
  ⚠ Note for review: Θέμα 2.2's graph weights were read from a scan; the four
  weight-5 edges should be double-checked against the original if the printed
  multiple-choice options (0/1/2/4) must be matched exactly. The solution
  teaches the counting method regardless.
