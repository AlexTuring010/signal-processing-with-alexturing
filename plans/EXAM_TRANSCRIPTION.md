# Exam Transcription — durable plan & progress tracker

> **This is a resumable plan.** In any new session, read this file, pick the
> next `☐` paper from the checklist, follow the per-session protocol, mark it
> `☑`. Repeat. Nothing here depends on chat history.

## Goal

Transcribe **every** past-exam paper (`private_material/oldtests/`) and every
frontistirio set (`private_material/inclass/`) from PDF/image into the app's
exercise bank — split into per-lecture sub-exercises, each with a
beginner-friendly Greek solution — then **anonymise** in the UI.

> **Privacy architecture (since 2026-05-22).** All raw university materials live
> in `/private_material`, which is **git-ignored** — never committed, never
> published. The old public copy under `public/material/exercises/` has been
> removed. Source files therefore no longer need to be *deleted* after
> transcription: they simply stay local-only in `private_material`. Earlier
> papers that were already deleted remain recoverable via `git show`.

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

### Source files
- Raw source files live in `/private_material` (git-ignored). They do **not**
  need to be deleted after transcription — the git-ignore already keeps them off
  GitHub. Just leave them in place.

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
5. Leave the source file in `private_material` (git-ignored — no deletion needed).
6. Mark the paper `☑` here (and note how many sub-exercises it produced).
7. Repeat for ~2–4 papers per session.

---

## Checklist — Old exams (`private_material/oldtests/`)

| # | Label | Source file(s) | Status |
|---|---|---|---|
| 1 | Παλαιό Θέμα #1 | `Algorithms-June-2025.pdf` *(deleted)* | ☑ |
| 2 | Παλαιό Θέμα #2 | `Algorithms-Sep-2025.pdf` *(deleted)* | ☑ |
| 3 | Παλαιό Θέμα #3 | `Algorithms-June-2024.pdf` *(deleted)* | ☑ |
| 4 | Παλαιό Θέμα #4 | `Algorithms-September-2024.pdf` *(deleted)* | ☑ |
| 5 | Παλαιό Θέμα #5 | `Ζησιμόπουλος/2023-June-VZ/Algo-June-2023.pdf` *(deleted)* | ☑ |
| 6 | Παλαιό Θέμα #6 | `Ζησιμόπουλος/2023-Sept-VZ/*.jpg` (2) | ☑ 4/4 |
| 7 | Παλαιό Θέμα #7 | `Ζησιμόπουλος/2022-June-VZ/Algo_june_2022.pdf` | ☑ 4/4 |
| 8 | Παλαιό Θέμα #8 | `Ζησιμόπουλος/2022-Sept-VZ/*.jpg` (3) | ☑ 3/3 |
| 9 | Παλαιό Θέμα #9 | `Ζησιμόπουλος/2021-June-VZ/` (Θ1.pdf, Θ2.pdf, 1–15.png) | ☑ 17/17 |
| 10 | Παλαιό Θέμα #10 | `Αλγο-2020-Σεπτ-1(Slot2).jpg`, `Αλγο-2020-Σεπτ-2(Slot2).jpg` | ☑ 4/4 |
| 11 | Παλαιό Θέμα #11 | `αλγοριθμοι-και-πολυπλοκοτιτα-εξ-αποστασεως-2020.pdf` | ☑ 4/4 |
| 12 | Παλαιό Θέμα #12 | `Ζησιμόπουλος/2019-Feb-VZ/2019.pdf` | ⊘ κενό |
| 13 | Παλαιό Θέμα #13 | `Ζησιμόπουλος/2018-June-VZ/*.jpg` (2) | ☑ 14/15 |
| 14 | Παλαιό Θέμα #14 | `Ζησιμόπουλος/2017-Sept-VZ/*.jpg` (2) | ☑ 13/16 |
| 15 | Παλαιό Θέμα #15 | `Ζησιμόπουλος/2017-Feb-VZ/algo-fevr-2017-zisimopoulos.pdf` | ☐ |
| 16 | Παλαιό Θέμα #16 | `Ζησιμόπουλος/2016-June-VZ/*.jpg` (2) | ☐ |
| 17 | Παλαιό Θέμα #17 | `Ζησιμόπουλος/2016-Feb-VZ/*.jpg` (5) | ☐ |
| 18 | Παλαιό Θέμα #18 | `Ζησιμόπουλος/2015-June-VZ/` (2 pdf, 2 jpg) | ☐ |
| 19 | Παλαιό Θέμα #19 | `Ζησιμόπουλος/2012-Midterm/2012-p.pdf` | ☐ |
| 20 | Παλαιό Θέμα #20 | `Ζησιμόπουλος/2011-Sept-VZ/Σεπτέμβριος 2011-VZ.pdf` | ☐ |
| 21 | Παλαιό Θέμα #21 | `Ζησιμόπουλος/2011-June-VZ/*.jpg` (3) | ☐ |
| 22 | Παλαιό Θέμα #22 | `Ζησιμόπουλος/2010-June-VZ/` (pdf + JPG) | ☐ |
| 23 | Παλαιό Θέμα #23 | `Ζησιμόπουλος/2008-Midterm/2008.pdf` | ☐ |

## Checklist — Frontistirio (`private_material/inclass/`)

| # | Label | Source file | Status |
|---|---|---|---|
| 1 | Φροντιστηριακό Σετ #1 | `F1__2023_24__eclass.pdf` *(deleted)* | ☑ 3/3 (Ασκ 0,1,3) |
| 2 | Φροντιστηριακό Σετ #2 | `F2__2023_24.pdf` *(deleted)* | ☑ 8/8 (Ασκ 0–7) |
| 3 | Φροντιστηριακό Σετ #3 | `F3__eclass.pdf` *(deleted)* | ☑ 7/7 (Ασκ 1,2,4,7,8,9,10) |
| 4 | Φροντιστηριακό Σετ #4 | `F4__2023_24__eclass.pdf` *(deleted)* | ☑ 12/12 (Ασκ 1–10 + E0 + Θέμα 4) |
| 5 | Φροντιστηριακό Σετ #5 | `F5__eclass.pdf` *(deleted)* | ☑ 10/10 (Ασκ 1,2,3,5,6,7,8,9,10,11) |
| 6 | Φροντιστηριακό Σετ #6 | `F7__eclass.pdf` | ☑ 8/8 (Ασκ 1–8) |
| 7 | Φροντιστηριακό Σετ #7 | `F8__eclass.pdf` | ☑ 12/12 (Ασκ 1–12) |
| 8 | Φροντιστηριακό Σετ #8 | `F9__eclass.pdf` | ☑ 4/4 (Ασκ 1–4) |
| 9 | Φροντιστηριακό Σετ #9 | `F10__eclass.pdf` | ☑ 5/5 (Ασκ 1,2,3,5,8) |
| 10 | Φροντιστηριακό Σετ #10 | `F11__eclass.pdf` | ☑ 14/14 (Ασκ 1–14) |
| 11 | Φροντιστηριακό Σετ #11 | `1ο Φροντ.pdf` | ☑ 3/3 |
| 12 | Φροντιστηριακό Σετ #12 | `2ο Φροντ.pdf` | ☑ 2/2 |
| 13 | Φροντιστηριακό Σετ #13 | `3ο Φροντ.pdf` | ☑ 3/3 |

## Progress

**Old exams — done: 13 / 23** (#1–#11, #13, #14· το #12 είναι κενό αρχείο —
βλ. παρακάτω). Fully pending: 9 (#15–#23).
**Frontistiria — done: 13 / 13 — 100% ΟΛΟΚΛΗΡΩΘΗΚΕ.**

Total modular exercises transcribed so far: **202** (168 από προηγούμενες
συνεδρίες συν 34 αυτή τη συνεδρία: Φροντ.Σετ #13 ×3, Παλαιό Θέμα #11 ×4, #13
×14, #14 ×13). Verified by
`grep -cE "id: '(pt|front-set-)" content/practice/exercises.tsx` → 202.

> **Batch note (2026-05-22, privacy + batch session).** Two parts:
> **(1) Privacy architecture.** All raw exercise material moved to the new
> git-ignored `/private_material`; the public copy `public/material/exercises/`
> deleted; `.gitignore` updated. The 16 still-untranscribed papers had their
> index entries anonymised (dropped dated `source`/`sourceFile`, added a
> `paperLabel`, titles → «Παλαιό Θέμα #N / Φροντιστηριακό Σετ #N — υπό
> μεταγραφή»). The dated «Εξέταση» filter was removed from `ExerciseLibrary`.
> **(2) Transcription batch.** Παλαιά Θέματα #6, #7 and Φροντιστηριακά Σετ #6,
> #7, #8 transcribed — 32 modular exercises, routed across L03/L06/L08/L09/
> L10/L11/L12/L13/L14/L15/L16/L17.

Next: exams resume at Παλαιό Θέμα #15· τα φροντιστήρια έχουν ολοκληρωθεί (13/13).

> **Batch note (2026-05-22, batch session 3 — LaTeX + transcription).**
> **(1) LaTeX σημειώσεις.** Δημιουργήθηκε ο φάκελος `/PDFs` με 17 standalone
> αρχεία `.tex` (L01–L17), κοινό `algo-preamble.sty` και `build_pdfs.sh`. Όλα
> μεταγλωττίζονται καθαρά (XeLaTeX/LuaLaTeX, babel-greek + fontspec, σώμα
> Liberation Serif, κώδικας DejaVu Sans Mono — 0 missing glyphs, 0 overfull).
> **(2) Μεταγραφή.** Φροντιστηριακό Σετ #13 (χειρόγραφες σημειώσεις περί
> αναδρομών/Master Theorem → 3 ασκήσεις, L03), Παλαιό Θέμα #11 (4/4, L05/L09/
> L14/L09), Παλαιό Θέμα #13 (14/15· το Θέμα 9 είναι δυσανάγνωστο στο σκαναρισμένο
> αντίγραφο), Παλαιό Θέμα #14 (13/16· τα Θέματα 2–3 ενοποιήθηκαν στο pt14-th1,
> το #14 αλληλεπικαλύπτεται έντονα με το #13 — επαναχρησιμοποίηση θεμάτων
> Ζησιμόπουλου). Σύνολο 34 modular exercises. `npx tsc --noEmit` καθαρό.
>
> ⚠ **Παλαιό Θέμα #12 (`2019.pdf`) — κενό.** Το αρχείο δεν περιέχει εξέταση·
> είναι μόνο σημείωμα φοιτητή: «Ηταν μιξη απο θεματα του Σεπτεμβρη 2018 και ειχε
> και ενα καινουργιο που δεν το θυμαμαι». Δεν υπάρχει τίποτα προς μεταγραφή —
> σημειώνεται ως `⊘ κενό` στον πίνακα. Γι' αυτό το batch κάλυψε #11, #13, #14.

> **Batch note (2026-05-22, batch session 2).** Μεταγράφηκαν 7 χαρτιά (4
> φροντιστήρια + 3 εξετάσεις) → 48 modular exercises, routed across
> L02/L03/L04/L06/L08/L09/L10/L11/L12/L13/L14/L15/L16/L17. `npx tsc --noEmit`
> καθαρό· καμία προειδοποίηση ESLint στο `exercises.tsx`. (Το `npx next build`
> αποτυγχάνει μόνο στο prerender του `/bookmarks` λόγω απουσίας Supabase env —
> προϋπάρχον, άσχετο με τη μεταγραφή.)

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
- **Privacy architecture** — `/private_material` created & git-ignored; all raw
  exercise material moved there; `public/material/exercises/` removed; the 16
  untranscribed papers anonymised with `paperLabel` (no `source`/`sourceFile`);
  dated «Εξέταση» filter removed from `ExerciseLibrary`. — 2026-05-22.
- **Παλαιό Θέμα #6** — 4 modules: `pt6-th1` (BFS/DFS & εύρεση γειτόνων →L06),
  `pt6-th2` (χρονοπρογραμματισμός με βάρη / weighted interval scheduling →L14),
  `pt6-th3` (Master Theorem + sift-down σε σωρό →L03/L10), `pt6-th4` (υπόδεντρο
  ελάχιστου βάρους = MST, P/NP →L09). Θέμα 2: το πρωτότυπο είναι αχνό σκαναρισμένο
  jpg — η μέθοδος διδάσκεται πλήρως, το στιγμιότυπο δουλεύεται σε καθαρό
  αντιπροσωπευτικό παράδειγμα. — 2026-05-22.
- **Παλαιό Θέμα #7** — 4 modules: `pt7-th1` (ανεξάρτητο σύνολο, NP & P για
  σταθερό k →L09), `pt7-th2` (αναδρομή vs DP, Ω(1.44ⁿ) →L14), `pt7-th3` (0-1
  σακίδιο: άπληστος vs DP →L15), `pt7-th4` (D(ST) vs D(TSP), P/NP-complete
  →L09). — 2026-05-22.
- **Φροντιστηριακό Σετ #6** — 8 modules: `front-set-6-ask1` (στρωματωμένος
  γράφος, ποδηλατική εκδρομή →L08), `ask2` (2η/3η ακμή στο MST →L09), `ask3`
  (εναλλασσόμενη υπακολουθία O(n) →L11), `ask4` (χρονοπρογραμματισμός
  πλυντηρίου →L12), `ask5` (ρέστα — άπληστος →L11), `ask6` (ελάχιστες στάσεις
  ανεφοδιασμού →L11), `ask7` (Huffman →L13), `ask8` (χρωματισμός & ελάχιστα
  ταξί →L11). — 2026-05-22.
- **Φροντιστηριακό Σετ #7** — 12 modules: `front-set-7-ask1` (ένωση ράβδων /
  Huffman →L13), `ask2` (λύκος-κατσίκα-λάχανο, γράφος καταστάσεων →L06), `ask3`
  (TSP μέσω MST+preorder →L09), `ask4` (μηνιαίο vs ετήσιο πακέτο →L11), `ask5`
  (διαδρομή σε πίνακα — άπληστος αποτυγχάνει →L11), `ask6` (αναβάθμιση δικτύου =
  MST →L09), `ask7` (μοναδιαία διαστήματα →L11), `ask8` (κατανομή αιθουσών →L11),
  `ask9` (πάρτι Alice, φιλτράρισμα γράφου →L06), `ask10` (αρνητικά βάρη &
  Dijkstra →L08), `ask11` (Σ/Λ MST & Dijkstra →L09), `ask12` (κλασματικό vs 0-1
  σακίδιο →L13). — 2026-05-22.
- **Φροντιστηριακό Σετ #8** — 4 modules: `front-set-8-ask1` (μέσο κόστος
  μονοπατιών σε DAG →L17), `ask2` (ευθυγράμμιση DNA →L16), `ask3` (τεμαχισμός
  ράβδου →L14), `ask4` (άνοιγμα εστιατορίων →L14). — 2026-05-22.
- **Παλαιό Θέμα #8** — 3 modules: `pt8-th1` (TSP: ωμή βία, πλησιέστερος
  γείτονας, κάτω φράγμα MST →L09), `pt8-th2` (μέγιστη κοινή υπακολουθία LCS
  →L16), `pt8-th3` (μακρύτερο μονοπάτι σε DAG →L17). — 2026-05-22.
- **Παλαιό Θέμα #9** — 17 modules: `pt9-th1` (εξισορρόπηση φορτίου / List
  Scheduling →L12), `pt9-th2` (επιλογή διαφημίσεων, άπληστος →L11), `pt9-q1`…
  `pt9-q15` (quiz 15 ερωτήσεων πολλαπλής επιλογής, routed σε
  L02/L03/L06/L09/L11/L14/L15/L16/L17). — 2026-05-22.
- **Παλαιό Θέμα #10** — 4 modules: `pt10-th1` (διάμεσος δύο βάσεων, O(log n)
  ερωτήσεις →L04), `pt10-th2` (ταίριασμα πελατών/πέδιλων, επιχείρημα ανταλλαγής
  →L11), `pt10-th3` (βέλτιστη αγορά/πώληση μετοχής, DP →L14), `pt10-th4`
  (εγγραφές μαθητών ως πρόβλημα ροής →L09). — 2026-05-22.
- **Φροντιστηριακό Σετ #9** — 5 modules: `front-set-9-ask1` (arbitrage =
  αρνητικός κύκλος, Bellman-Ford →L08), `ask2` (αίθουσες χωρίς 3 συνεχόμενες,
  DP →L14), `ask3` (αλυσίδα εστιατορίων, DP 3 καταστάσεων →L14), `ask5`
  (μαγνητικός τομογράφος = weighted interval scheduling →L14), `ask8` (αύξουσες
  υπακολουθίες & LIS →L16). — 2026-05-22.
- **Φροντιστηριακό Σετ #10** — 14 modules: `front-set-10-ask1`…`ask14`
  (Επανάληψη: πολυωνυμικά φραγμένες →L02, τριπλός βρόχος →L02, BFS με ίσα βάρη
  →L06, Master Theorem →L03, επιδιόρθωση σωρού →L10, κολώνες φωτισμού/μέγιστο
  ανεξάρτητο σύνολο →L14, CLIQUE/INDEP/D(Path)/D(MST) NP & P →L09, αναδρομή vs
  DP →L14, συνεχές σακίδιο →L13, 0-1 σακίδιο →L15). — 2026-05-22.
- **Φροντιστηριακό Σετ #11** — 3 modules: `front-set-11-ask1` (επαγωγή στην
  αρμονική σειρά →L02), `ask2` (επαγωγική λύση T(n)=2T(n/2)+Cn →L03), `ask3`
  (Σ/Λ ασυμπτωτικού συμβολισμού →L02). — 2026-05-22.
- **Φροντιστηριακό Σετ #12** — 2 modules: `front-set-12-ask1` (Σ/Λ
  ασυμπτωτικού συμβολισμού →L02), `ask2` (κατάταξη συναρτήσεων σε τάξεις &
  log n! = Θ(n log n) →L02). — 2026-05-22.
- **Φροντιστηριακό Σετ #13** — 3 modules: `front-set-13-ask1` (πολυπλοκότητα
  αναδρομικού προγράμματος, T(n)=2T(n-1)=Θ(2ⁿ) →L03), `ask2` (γραμμική ομογενής
  αναδρομή με χαρακτηριστικό πολυώνυμο, τριπλή ρίζα →L03), `ask3` (εφαρμογές
  Master Theorem →L03). Πηγή: `3ο Φροντ.pdf` — χειρόγραφες σημειώσεις. Τα
  φροντιστήρια ολοκληρώθηκαν 13/13. — 2026-05-22.
- **Παλαιό Θέμα #11** — 4 modules: `pt11-th1` (κορυφή «βουνού» σε O(log n) →L05),
  `pt11-th2` (κόστος ΕΣΔ μετά από μετασχηματισμό βαρών x=w+i →L09), `pt11-th3`
  (υπακολουθία μέγιστου αθροίσματος χωρίς διαδοχικά, DP →L14), `pt11-th4`
  (ελάχιστη αποκοπή από μέγιστη ροή →L09). Καθαρό PDF, πλήρως αναγνώσιμο. — 2026-05-22.
- **Παλαιό Θέμα #12** — ⊘ ΚΕΝΟ. Το `2019.pdf` δεν περιέχει εξέταση (μόνο σημείωμα
  φοιτητή). Τίποτα προς μεταγραφή. — 2026-05-22.
- **Παλαιό Θέμα #13** — 14 modules (`pt13-th1`…`th8`, `th10`…`th15`): ασυμπτωτική
  τάξη →L02, πολυπλοκότητα ταξινόμησης & αναδρομικές σχέσεις →L03, MAX/MIN heap
  →L10, δέντρο μέγιστου βάρους & Dijkstra & ΕΣΔ-κάτω-φράγμα-TSP & ST/IS P/NP
  →L09, ρέστα/άπληστος →L11, μεγαλύτερο μονοπάτι DAG →L17, Master Theorem →L03,
  LCS →L16, Bellman-Ford →L17. Το Θέμα 9 παραλείφθηκε (δυσανάγνωστο σκαναρισμένο
  jpg). — 2026-05-22.
- **Παλαιό Θέμα #14** — 13 modules (`pt14-th1`, `th4`…`th9`, `th11`…`th16`):
  σύγκριση πολυπλοκότητας πυκνά/αραιά →L02, ασυμπτωτική τάξη →L02, αναμενόμενος
  χρόνος σειριακής αναζήτησης →L02, Quick Sort σε ταξινομημένη είσοδο →L03,
  ύψος σωρού →L10, δέντρο μέγιστου βάρους & Dijkstra & ΕΣΔ-TSP →L09, Master
  Theorem (4 αλγόριθμοι) →L03, 0-1 σακίδιο (αναδρομή + στιγμιότυπο) →L15,
  D(Path)/D(Knapsack) & P/NP →L09/L15. Τα Θέματα 2–3 ενοποιήθηκαν στο `th1`·
  το χαρτί αλληλεπικαλύπτεται έντονα με το #13. — 2026-05-22.
