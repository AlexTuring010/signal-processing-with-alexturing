/**
 * Exercise bank — past-exam problems + frontistiria.
 *
 * SCOPE NOTE
 * ----------
 * The original NKUA past-exam papers (all under `material/exercises/`) are
 * scanned images / hand-set typography with no extractable text. We can't
 * mechanically transcribe them. So this bank is, for now, an *index* of
 * every original artifact:
 *
 *   - One entry per past-exam paper (multi-problem) and per frontistirio.
 *   - `statement` and `solution` are `null` — the UI falls back to the
 *     "Άνοιξε το πρωτότυπο" link to `sourceFile`.
 *   - `prerequisites` is inferred from the date of the paper (everything
 *     up to that point in the academic year was fair game) or, for
 *     frontistiria, from the slide-deck title we extracted.
 *
 * As we transcribe problems lecture-by-lecture, replace the paper-level
 * entries with per-problem ones (one card per «ΘΕΜΑ» / «Άσκηση»). The shape
 * is ready: id, title, problemNumber, weight, statement, solution.
 *
 * BADGES
 * ------
 * 2024 / 2025 sources are surfaced with the «Θέμα Εξετάσεων 2024/2025»
 * badge — see `RECENT_SOURCES` in `types.ts` and the `<ExerciseCard>`
 * rendering. They sort first in the practice hub.
 */

import type { Exercise } from './types'
import { InlineMath, BlockMath } from '@/components/math'

/**
 * Every lecture slug, in order. Used so a paper that hits "all lectures"
 * doesn't need to enumerate 17 strings by hand.
 */
const ALL_LECTURES = [
  'lectures/L01-eisagogika',
  'lectures/L02-asymptotic-analysis',
  'lectures/L03-divide-and-conquer-i',
  'lectures/L04-divide-and-conquer-ii',
  'lectures/L05-divide-and-conquer-iii',
  'lectures/L06-graphs-i',
  'lectures/L07-graphs-ii',
  'lectures/L08-graphs-iii',
  'lectures/L09-graphs-iv',
  'lectures/L10-data-structures',
  'lectures/L11-greedy-i',
  'lectures/L12-greedy-ii',
  'lectures/L13-greedy-iii',
  'lectures/L14-dp-i',
  'lectures/L15-dp-ii',
  'lectures/L16-dp-iii',
  'lectures/L17-dp-iv',
]

export const EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // ΦΡΟΝΤΙΣΤΗΡΙΑ 2023–24 (Έφη Μαλέσιου) — topic-scoped, ordered like the syllabus
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'frontistirio-f1',
    title: 'Φροντιστήριο 1 · Ασυμπτωτικός συμβολισμός (1/2)',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F1',
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    sourceFile: '/material/exercises/inclass/F1__2023_24__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f2',
    title: 'Φροντιστήριο 2 · Ασυμπτωτικός συμβολισμός (2/2)',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F2',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    sourceFile: '/material/exercises/inclass/F2__2023_24.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f3',
    title: 'Φροντιστήριο 3 · Διαίρει και Κυρίευε',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F3',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
    ],
    sourceFile: '/material/exercises/inclass/F3__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f4',
    title: 'Φροντιστήριο 4 · Διαίρει και Κυρίευε (2/2)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F4',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
    ],
    sourceFile: '/material/exercises/inclass/F4__2023_24__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f5',
    title: 'Φροντιστήριο 5 · Αναζήτηση, ταξινόμηση και γραφήματα',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F5',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
    ],
    sourceFile: '/material/exercises/inclass/F5__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f7',
    title: 'Φροντιστήριο 7 · Άπληστοι Αλγόριθμοι (1/2)',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F7',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    sourceFile: '/material/exercises/inclass/F7__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f8',
    title: 'Φροντιστήριο 8 · Άπληστοι Αλγόριθμοι (2/2)',
    topic: 'greedy',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F8',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L11-greedy-i',
      'lectures/L12-greedy-ii',
      'lectures/L13-greedy-iii',
    ],
    sourceFile: '/material/exercises/inclass/F8__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f9',
    title: 'Φροντιστήριο 9 · Δυναμικός προγραμματισμός (1/2)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F9',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    sourceFile: '/material/exercises/inclass/F9__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f10',
    title: 'Φροντιστήριο 10 · Δυναμικός προγραμματισμός (2/2)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F10',
    difficulty: 'hard',
    prerequisites: [
      'lectures/L14-dp-i',
      'lectures/L15-dp-ii',
      'lectures/L16-dp-iii',
      'lectures/L17-dp-iv',
    ],
    sourceFile: '/material/exercises/inclass/F10__eclass.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f11',
    title: 'Φροντιστήριο 11 · Επανάληψη (τελευταίο)',
    topic: 'dp',
    origin: 'frontistirio',
    source: 'frontistirio-2023-24',
    problemNumber: 'F11',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/inclass/F11__eclass.pdf',
    statement: null,
    solution: null,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Παλαιότερα φροντιστήρια (CamScanner — image-only)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'frontistirio-old-1',
    title: '1ο Φροντιστήριο (παλαιότερο)',
    topic: 'asymptotics',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'easy',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
    ],
    sourceFile: '/material/exercises/inclass/1%CE%BF%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-old-2',
    title: '2ο Φροντιστήριο (παλαιότερο)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
    ],
    sourceFile: '/material/exercises/inclass/2%CE%BF%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-old-3',
    title: '3ο Φροντιστήριο (παλαιότερο)',
    topic: 'graphs',
    origin: 'frontistirio',
    source: 'frontistirio-misc',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L06-graphs-i',
      'lectures/L07-graphs-ii',
      'lectures/L08-graphs-iii',
    ],
    sourceFile: '/material/exercises/inclass/3%CE%BF%20%CE%A6%CF%81%CE%BF%CE%BD%CF%84.pdf',
    statement: null,
    solution: null,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 2024 / 2025 ΕΞΕΤΑΣΤΙΚΕΣ — υψηλή προτεραιότητα
  // ═══════════════════════════════════════════════════════════════════════
  // ── Παλαιό Θέμα #1 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt1-th1-q1',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.1 — Σύγκριση σταθερών συναρτήσεων',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.1',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = \\log_n n'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = 4'}</InlineMath>, κύκλωσε ποιες από τις παρακάτω
          σχέσεις ισχύουν:
        </p>
        <p>
          (i) <InlineMath>{'f = O(g)'}</InlineMath> · (ii){' '}
          <InlineMath>{'f = o(g)'}</InlineMath> · (iii){' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath> · (iv){' '}
          <InlineMath>{'f = \\omega(g)'}</InlineMath> · (v){' '}
          <InlineMath>{'f = \\Theta(g)'}</InlineMath> · (vi) οι{' '}
          <InlineMath>{'f, g'}</InlineMath> είναι μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτα ξεκαθαρίζουμε τι είναι κάθε συνάρτηση. Ο{' '}
          <InlineMath>{'\\log_n n'}</InlineMath> είναι «σε ποια δύναμη υψώνω το{' '}
          <InlineMath>{'n'}</InlineMath> για να πάρω <InlineMath>{'n'}</InlineMath>;»
          — η απάντηση είναι πάντα <strong>1</strong>. Άρα{' '}
          <InlineMath>{'f(n) = 1'}</InlineMath> για κάθε <InlineMath>{'n > 1'}</InlineMath>.
          Και <InlineMath>{'g(n) = 4'}</InlineMath>. Έχουμε δηλαδή <strong>δύο
          θετικές σταθερές</strong>.
        </p>
        <p>
          Δύο σταθερές είναι πάντα «του ίδιου μεγέθους» ασυμπτωτικά:{' '}
          <InlineMath>{'1 \\le 1 \\cdot 4'}</InlineMath> δίνει{' '}
          <InlineMath>{'f = O(g)'}</InlineMath>, και{' '}
          <InlineMath>{'1 \\ge \\tfrac14 \\cdot 4'}</InlineMath> δίνει{' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath>. Αφού ισχύουν και τα δύο,
          ισχύει και <InlineMath>{'f = \\Theta(g)'}</InlineMath>.
        </p>
        <p>
          Το <InlineMath>{'o'}</InlineMath> και το <InlineMath>{'\\omega'}</InlineMath>{' '}
          είναι «αυστηρά»: απαιτούν ο λόγος <InlineMath>{'f/g'}</InlineMath> να
          πηγαίνει στο <InlineMath>{'0'}</InlineMath> ή στο{' '}
          <InlineMath>{'\\infty'}</InlineMath>. Εδώ ο λόγος είναι σταθερά{' '}
          <InlineMath>{'1/4'}</InlineMath> — δεν πάει πουθενά. Άρα{' '}
          <strong>όχι</strong> <InlineMath>{'o'}</InlineMath>, <strong>όχι</strong>{' '}
          <InlineMath>{'\\omega'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (i), (iii), (v).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q2',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.2 — Πολυωνυμικό vs υπερπολυωνυμικό',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.2',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = 2^{\\log_2 n}'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n^{\\log_2 n}'}</InlineMath>, κύκλωσε ποιες σχέσεις
          ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
          <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
          · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
          <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το κόλπο εδώ είναι να <strong>απλοποιήσουμε</strong> πριν συγκρίνουμε.
          Το <InlineMath>{'2^{\\log_2 n}'}</InlineMath> είναι «2 υψωμένο στη
          δύναμη που γυρνάει πίσω το <InlineMath>{'n'}</InlineMath>» — δηλαδή{' '}
          <InlineMath>{'f(n) = n'}</InlineMath>. Απλό πολυώνυμο.
        </p>
        <p>
          Το <InlineMath>{'g(n) = n^{\\log_2 n}'}</InlineMath> έχει{' '}
          <strong>εκθέτη που μεγαλώνει</strong> μαζί με το{' '}
          <InlineMath>{'n'}</InlineMath>. Για <InlineMath>{'n = 1024'}</InlineMath>{' '}
          είναι <InlineMath>{'n^{10}'}</InlineMath>· για μεγαλύτερο{' '}
          <InlineMath>{'n'}</InlineMath> ο εκθέτης ανεβαίνει κι άλλο. Είναι{' '}
          <strong>υπερπολυωνυμική</strong> — ξεπερνά κάθε σταθερή δύναμη του{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          Άρα το <InlineMath>{'g'}</InlineMath> «τρέχει» πολύ πιο γρήγορα από το{' '}
          <InlineMath>{'f'}</InlineMath>: ο λόγος{' '}
          <InlineMath>{'f/g = n / n^{\\log_2 n} \\to 0'}</InlineMath>. Αυτό
          σημαίνει <InlineMath>{'f = o(g)'}</InlineMath> — και το{' '}
          <InlineMath>{'o'}</InlineMath> συνεπάγεται πάντα και το{' '}
          <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (i), (ii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q3',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.3 — Άγνωστος εκθέτης',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.3',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = n^{1 + \\tan\\varphi}'}</InlineMath>, με{' '}
          <InlineMath>{'\\varphi \\in [0, 2\\pi]'}</InlineMath>, και{' '}
          <InlineMath>{'g(n) = n^2'}</InlineMath>, κύκλωσε ποιες σχέσεις ισχύουν:
          (i) <InlineMath>{'O'}</InlineMath> · (ii) <InlineMath>{'o'}</InlineMath>{' '}
          · (iii) <InlineMath>{'\\Omega'}</InlineMath> · (iv){' '}
          <InlineMath>{'\\omega'}</InlineMath> · (v) <InlineMath>{'\\Theta'}</InlineMath>{' '}
          · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η παγίδα είναι το <InlineMath>{'\\tan\\varphi'}</InlineMath>. Καθώς το{' '}
          <InlineMath>{'\\varphi'}</InlineMath> διατρέχει το{' '}
          <InlineMath>{'[0, 2\\pi]'}</InlineMath>, η εφαπτομένη παίρνει{' '}
          <strong>όλες τις πραγματικές τιμές</strong> — από{' '}
          <InlineMath>{'-\\infty'}</InlineMath> έως <InlineMath>{'+\\infty'}</InlineMath>{' '}
          (εκτοξεύεται κοντά στα <InlineMath>{'\\pi/2'}</InlineMath> και{' '}
          <InlineMath>{'3\\pi/2'}</InlineMath>).
        </p>
        <p>
          Άρα ο εκθέτης <InlineMath>{'1 + \\tan\\varphi'}</InlineMath> μπορεί να
          είναι <strong>οποιοσδήποτε πραγματικός αριθμός</strong>. Η{' '}
          <InlineMath>{'f'}</InlineMath> θα μπορούσε να είναι{' '}
          <InlineMath>{'n^{0.3}'}</InlineMath> (πολύ πιο αργή από{' '}
          <InlineMath>{'n^2'}</InlineMath>), ή <InlineMath>{'n^2'}</InlineMath>{' '}
          (ίδια), ή <InlineMath>{'n^{100}'}</InlineMath> (πολύ πιο γρήγορη).
        </p>
        <p>
          Αφού δεν μας δίνεται το <InlineMath>{'\\varphi'}</InlineMath>,{' '}
          <strong>καμία</strong> από τις σχέσεις (i)–(v) δεν ισχύει σίγουρα. Δεν
          μπορούμε να κατατάξουμε τις δύο συναρτήσεις χωρίς να ξέρουμε τον
          εκθέτη: <strong>σωστή είναι η (vi) — μη-συγκρίσιμες</strong> (με την
          έννοια ότι η σχέση τους είναι απροσδιόριστη).
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q4',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.4 — Αναδρομή T(n) = T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.4',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'T(n) = T(\\sqrt{n}) + 1'}</InlineMath>, κύκλωσε ποια
          ισχύουν: (i) <InlineMath>{'T(n) \\in o(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'T(n) \\in O(1)'}</InlineMath> · (iii){' '}
          <InlineMath>{'T(n) \\in o(2^n)'}</InlineMath> · (iv){' '}
          <InlineMath>{'T(n) \\in O(\\log_2 \\log_2 n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η ρίζα κάνει αλλαγή μεταβλητής λίγο δύσκολη — οπότε κάνουμε ένα κόλπο.
          Θέτουμε <InlineMath>{'n = 2^m'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'m = \\log_2 n'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath>, και η αναδρομή γίνεται
        </p>
        <BlockMath>{'S(m) = S(m/2) + 1, \\quad \\text{όπου } S(m) = T(2^m).'}</BlockMath>
        <p>
          Αυτή την ξέρουμε: κάθε βήμα <strong>υποδιπλασιάζει</strong> το{' '}
          <InlineMath>{'m'}</InlineMath> και προσθέτει <InlineMath>{'1'}</InlineMath>.
          Πόσες φορές υποδιπλασιάζεις το <InlineMath>{'m'}</InlineMath> μέχρι να
          φτάσεις στο <InlineMath>{'1'}</InlineMath>; <InlineMath>{'\\log_2 m'}</InlineMath>{' '}
          φορές. Άρα <InlineMath>{'S(m) = \\Theta(\\log m)'}</InlineMath>.
        </p>
        <p>
          Γυρνάμε πίσω: <InlineMath>{'m = \\log_2 n'}</InlineMath>, οπότε
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log m) = \\Theta(\\log\\log n).'}</BlockMath>
        <p>
          Το <InlineMath>{'\\log\\log n'}</InlineMath> μεγαλώνει{' '}
          <strong>εξαιρετικά αργά</strong>. Ελέγχουμε: (i){' '}
          <InlineMath>{'o(n)'}</InlineMath> ✓ (πολύ μικρότερο του{' '}
          <InlineMath>{'n'}</InlineMath>). (ii) <InlineMath>{'O(1)'}</InlineMath>{' '}
          ✗ (μεγαλώνει, σιγά αλλά μεγαλώνει). (iii){' '}
          <InlineMath>{'o(2^n)'}</InlineMath> ✓. (iv){' '}
          <InlineMath>{'O(\\log_2\\log_2 n)'}</InlineMath> ✓ (ακριβώς αυτή είναι η
          τάξη του).
        </p>
        <p>
          <strong>Σωστές: (i), (iii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q5',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.5 — Master Theorem',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.5',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    formulaIds: ['master-theorem'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'T(n) = 2T(n/2) + n'}</InlineMath>, κύκλωσε ποια
          ισχύουν: (i) <InlineMath>{'O(n\\log_2 n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'o(n)'}</InlineMath> · (iii) <InlineMath>{'O(n)'}</InlineMath>{' '}
          · (iv) <InlineMath>{'o(n^3)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτή είναι η πιο κλασική αναδρομή — η ίδια με τη συγχωνευτική
          ταξινόμηση (mergesort). Χρησιμοποιούμε το Master Theorem με{' '}
          <InlineMath>{'a = 2'}</InlineMath>, <InlineMath>{'b = 2'}</InlineMath>,{' '}
          <InlineMath>{'f(n) = n'}</InlineMath>.
        </p>
        <p>
          Συγκρίνουμε το <InlineMath>{'f(n) = n'}</InlineMath> με το{' '}
          <InlineMath>{'n^{\\log_b a} = n^{\\log_2 2} = n^1 = n'}</InlineMath>.
          Είναι <strong>ίσα</strong> — αυτή είναι η Περίπτωση 2. Η Περίπτωση 2
          δίνει
        </p>
        <BlockMath>{'T(n) = \\Theta(n \\log n).'}</BlockMath>
        <p>
          Διαισθητικά: το δέντρο αναδρομής έχει{' '}
          <InlineMath>{'\\log_2 n'}</InlineMath> επίπεδα και κάθε επίπεδο κάνει
          συνολικά <InlineMath>{'\\Theta(n)'}</InlineMath> δουλειά → γινόμενο{' '}
          <InlineMath>{'n\\log n'}</InlineMath>.
        </p>
        <p>
          Ελέγχουμε: (i) <InlineMath>{'O(n\\log n)'}</InlineMath> ✓. (ii){' '}
          <InlineMath>{'o(n)'}</InlineMath> ✗ (το <InlineMath>{'n\\log n'}</InlineMath>{' '}
          είναι μεγαλύτερο του <InlineMath>{'n'}</InlineMath>). (iii){' '}
          <InlineMath>{'O(n)'}</InlineMath> ✗ (ίδιος λόγος). (iv){' '}
          <InlineMath>{'o(n^3)'}</InlineMath> ✓ (το <InlineMath>{'n\\log n'}</InlineMath>{' '}
          είναι πολύ μικρότερο του <InlineMath>{'n^3'}</InlineMath>).
        </p>
        <p>
          <strong>Σωστές: (i), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q6',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.6 — Άπληστο κριτήριο του Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.6',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Με ποιο άπληστο κριτήριο λειτουργεί ο αλγόριθμος του Dijkstra;</p>
        <p>
          (i) Επιλογή συντομότερου γείτονα από την τελευταία ακμή που
          προστέθηκε · (ii) Επιλογή της κορυφής με τη μικρότερη απόσταση από την
          αφετηρία · (iii) Επιλογή ακμής ελάχιστου βάρους σε μία δεδομένη τομή ·
          (iv) Επιλογή του συντομότερου σε πλήθος ακμών μονοπατιού.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ας θυμηθούμε τι κάνει ο Dijkstra σε κάθε βήμα. Κρατάει ένα σύνολο{' '}
          <InlineMath>{'S'}</InlineMath> «εξερευνημένων» κορυφών και, από όλες
          τις υπόλοιπες, διαλέγει εκείνη με τη <strong>μικρότερη τρέχουσα
          απόσταση από την αφετηρία</strong> <InlineMath>{'s'}</InlineMath>.
        </p>
        <p>
          Γιατί όχι οι άλλες; Το (i) «τελευταία ακμή» δεν λέει τίποτα — ο
          Dijkstra κοιτάζει <strong>όλη</strong> την απόσταση από την{' '}
          <InlineMath>{'s'}</InlineMath>, όχι ένα μόνο βήμα. Το (iii) «ακμή
          ελάχιστου βάρους σε τομή» είναι το κριτήριο του{' '}
          <strong>Prim</strong> (ελάχιστο συνδετικό δέντρο), όχι του Dijkstra —
          μοιάζουν πολύ αλλά ο Prim κοιτάει «κόστος μίας ακμής» ενώ ο Dijkstra
          «κόστος όλης της διαδρομής». Το (iv) «λιγότερες ακμές» είναι το BFS —
          αγνοεί τα βάρη.
        </p>
        <p>
          <strong>Σωστή: (ii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q7',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.7 — Πολυπλοκότητα δισδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.7',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Λύνουμε ένα πρόβλημα με δυναμικό προγραμματισμό συμπληρώνοντας έναν
          πίνακα με τιμές <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath>, για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath> και{' '}
          <InlineMath>{'j = 1\\dots m'}</InlineMath>. Ποια από τα παρακάτω
          μπορούμε να πούμε με <strong>βεβαιότητα</strong> ότι{' '}
          <strong>δεν</strong> αντικατοπτρίζει τη χρονική πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(mn)'}</InlineMath> · (iii){' '}
          <InlineMath>{'o(m^2 n^2)'}</InlineMath> · (iv){' '}
          <InlineMath>{'O(mn^2)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Κλειδί: ο πίνακας έχει <InlineMath>{'n \\times m'}</InlineMath> κελιά,
          και πρέπει να συμπληρώσουμε <strong>όλα</strong>. Άρα ο αλγόριθμος
          κάνει <strong>τουλάχιστον</strong> <InlineMath>{'n \\cdot m'}</InlineMath>{' '}
          βήματα — η πολυπλοκότητα είναι σίγουρα{' '}
          <InlineMath>{'\\Omega(nm)'}</InlineMath>.
        </p>
        <p>
          Τώρα ελέγχουμε κάθε επιλογή — «μπορεί να ισχύει ή σίγουρα όχι;»
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n)'}</InlineMath>: αυτό είναι{' '}
            <strong>μικρότερο</strong> από <InlineMath>{'nm'}</InlineMath> (όταν{' '}
            <InlineMath>{'m > 1'}</InlineMath>). Αδύνατο — δεν προλαβαίνεις καν να
            γεμίσεις τον πίνακα. <strong>Σίγουρα δεν ισχύει.</strong>
          </li>
          <li>
            (ii) <InlineMath>{'O(mn)'}</InlineMath>: πιθανό — αν κάθε κελί
            γεμίζει σε <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>
            (iii) <InlineMath>{'o(m^2 n^2)'}</InlineMath>: πιθανό — π.χ.{' '}
            <InlineMath>{'O(nm)'}</InlineMath> είναι όντως{' '}
            <InlineMath>{'o(m^2 n^2)'}</InlineMath>.
          </li>
          <li>
            (iv) <InlineMath>{'O(mn^2)'}</InlineMath>: πιθανό — αν κάθε κελί
            θέλει <InlineMath>{'O(n)'}</InlineMath> δουλειά.
          </li>
        </ul>
        <p>
          Μόνο το (i) αποκλείεται με βεβαιότητα.{' '}
          <strong>Σωστή: (i).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q8',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.8 — Πολυπλοκότητα μονοδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.8',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Όμοια, λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath>. Ποια μπορούμε να πούμε με
          βεβαιότητα ότι <strong>δεν</strong> αντικατοπτρίζει τη χρονική
          πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(n^2)'}</InlineMath> · (iii){' '}
          <InlineMath>{'O(1)'}</InlineMath> · (iv){' '}
          <InlineMath>{'O(\\log_2 n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ίδια λογική με το προηγούμενο. Ο πίνακας έχει τώρα{' '}
          <InlineMath>{'n'}</InlineMath> κελιά· πρέπει να γεμίσουν όλα, άρα η
          πολυπλοκότητα είναι σίγουρα <InlineMath>{'\\Omega(n)'}</InlineMath>.
        </p>
        <p>
          Άρα ό,τι είναι <strong>μικρότερο</strong> από{' '}
          <InlineMath>{'n'}</InlineMath> αποκλείεται: το{' '}
          <InlineMath>{'O(1)'}</InlineMath> (σταθερός χρόνος — αδύνατο, δεν
          γεμίζεις <InlineMath>{'n'}</InlineMath> κελιά σε σταθερό χρόνο) και το{' '}
          <InlineMath>{'O(\\log_2 n)'}</InlineMath> (επίσης μικρότερο του{' '}
          <InlineMath>{'n'}</InlineMath>). Το <InlineMath>{'O(n)'}</InlineMath>{' '}
          και το <InlineMath>{'O(n^2)'}</InlineMath> είναι πιθανά.
        </p>
        <p>
          <strong>Σωστές: (iii) και (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q9',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.9 — Προβλήματα εκτός P (αν P ≠ NP)',
    topic: 'intro',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.9',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Εάν <InlineMath>{'P \\neq NP'}</InlineMath>, ποια από τα παρακάτω{' '}
          <strong>δεν</strong> ανήκουν στο <InlineMath>{'P'}</InlineMath>;
        </p>
        <p>
          (i) Κωδικοποίηση Huffman · (ii) Συντομότερο Μονοπάτι · (iii) Μακρύτερο
          Μονοπάτι · (iv) Ικανοποιησιμότητα Λογικών Προτάσεων (SAT).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το <InlineMath>{'P'}</InlineMath> είναι τα προβλήματα που λύνονται σε{' '}
          <strong>πολυωνυμικό χρόνο</strong>. Πάμε ένα-ένα:
        </p>
        <ul>
          <li>
            <strong>Huffman:</strong> έχουμε άπληστο αλγόριθμο{' '}
            <InlineMath>{'O(n\\log n)'}</InlineMath> — ανήκει στο{' '}
            <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>Συντομότερο μονοπάτι:</strong> Dijkstra / Bellman-Ford,
            πολυωνυμικοί — ανήκει στο <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>Μακρύτερο μονοπάτι:</strong> είναι NP-δύσκολο. Δεν ξέρουμε
            πολυωνυμικό αλγόριθμο, και αν <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
            <strong>δεν</strong> ανήκει στο <InlineMath>{'P'}</InlineMath>.
          </li>
          <li>
            <strong>SAT:</strong> το «πρώτο» NP-πλήρες πρόβλημα. Αν{' '}
            <InlineMath>{'P \\neq NP'}</InlineMath>, <strong>δεν</strong> ανήκει
            στο <InlineMath>{'P'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th1-q10',
    title: 'Παλαιό Θέμα #1 · Θέμα 1.10 — Γνωστά NP-πλήρη προβλήματα',
    topic: 'intro',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 1.10',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>Ποια από τα παρακάτω προβλήματα γνωρίζουμε ότι είναι NP-πλήρη;</p>
        <p>
          (i) Ισομορφισμός Γραφημάτων · (ii) Ικανοποιησιμότητα Λογικών
          Προτάσεων (SAT) · (iii) Παραγοντοποίηση Ακεραίων · (iv) Κύκλος
          Hamilton.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          «NP-πλήρες» σημαίνει: είναι στο <InlineMath>{'NP'}</InlineMath>{' '}
          <strong>και</strong> είναι από τα πιο δύσκολα του{' '}
          <InlineMath>{'NP'}</InlineMath> (κάθε άλλο πρόβλημα του{' '}
          <InlineMath>{'NP'}</InlineMath> ανάγεται σε αυτό).
        </p>
        <ul>
          <li>
            <strong>Ισομορφισμός γραφημάτων:</strong> είναι στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά <strong>δεν</strong> ξέρουμε αν
            είναι NP-πλήρες — πιστεύεται ότι δεν είναι. Παγίδα.
          </li>
          <li>
            <strong>SAT:</strong> το αρχετυπικό NP-πλήρες (θεώρημα Cook-Levin).
            ✓
          </li>
          <li>
            <strong>Παραγοντοποίηση ακεραίων:</strong> στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά δεν είναι γνωστό ότι είναι
            NP-πλήρες — γι' αυτό στηρίζεται και η κρυπτογραφία RSA. Παγίδα.
          </li>
          <li>
            <strong>Κύκλος Hamilton:</strong> κλασικό NP-πλήρες πρόβλημα. ✓
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th2-a',
    title: 'Παλαιό Θέμα #1 · Θέμα 2.1 — Ανίχνευση αρνητικού κύκλου',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 2.1',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <p>
        Ποιον αλγόριθμο χρησιμοποιούμε για να αποφασίσουμε αν ένα κατευθυνόμενο
        γράφημα έχει αρνητικό κύκλο; (Αρκεί να τον αναφέρεις ονομαστικά.)
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Ο αλγόριθμος Bellman-Ford.</strong>
        </p>
        <p>
          Γιατί αυτός; Ο Bellman-Ford «χαλαρώνει» (relax) όλες τις ακμές{' '}
          <InlineMath>{'n - 1'}</InlineMath> γύρους, και μετά από τόσους γύρους
          οι αποστάσεις έχουν <strong>σταθεροποιηθεί</strong> — εφόσον δεν
          υπάρχει αρνητικός κύκλος. Άρα κάνουμε <strong>έναν ακόμη</strong>,{' '}
          <InlineMath>{'n'}</InlineMath>-οστό γύρο: αν εκεί κάποια απόσταση{' '}
          <strong>μειωθεί κι άλλο</strong>, σημαίνει ότι μπορούμε να
          «κερδίζουμε» επ' άπειρον γυρνώντας σε έναν κύκλο — δηλαδή υπάρχει
          αρνητικός κύκλος. Ο Dijkstra δεν μπορεί να το κάνει αυτό, γιατί δεν
          δουλεύει καν με αρνητικά βάρη.
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th2-b',
    title: 'Παλαιό Θέμα #1 · Θέμα 2.2 — Πλήθος ελάχιστων συνδετικών δέντρων',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 2.2',
    weight: 11,
    difficulty: 'hard',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Δίνεται το παρακάτω μη-κατευθυνόμενο γράφημα με 6 κορυφές{' '}
          <InlineMath>{'A, B, C, D, E, F'}</InlineMath> και ακμές (με τα βάρη
          τους):
        </p>
        <ul>
          <li><InlineMath>{'C - D = 1'}</InlineMath></li>
          <li><InlineMath>{'B - E = 3'}</InlineMath></li>
          <li><InlineMath>{'A - C = 5'}</InlineMath></li>
          <li><InlineMath>{'A - B = 5'}</InlineMath></li>
          <li><InlineMath>{'C - B = 5'}</InlineMath></li>
          <li><InlineMath>{'D - E = 5'}</InlineMath></li>
          <li><InlineMath>{'D - F = 10'}</InlineMath></li>
        </ul>
        <p>
          (α΄) Πόσα διαφορετικά ελάχιστα επικαλύπτοντα δέντρα (ΕΕΔ) έχει το
          γράφημα; (β΄) Σχεδίασε τα διαφορετικά ΕΕΔ (αν υπάρχουν).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η μέθοδος.</strong> Ένα γράφημα έχει{' '}
          <strong>μοναδικό</strong> ΕΕΔ αν όλα τα βάρη των ακμών είναι
          διαφορετικά. Όταν υπάρχουν <strong>ισοβαθμίες</strong> (ίσα βάρη), ο
          άπληστος αλγόριθμος (Kruskal) μπορεί να έχει{' '}
          <strong>επιλογές</strong> — και κάθε ανεξάρτητη επιλογή πολλαπλασιάζει
          το πλήθος των ΕΕΔ.
        </p>
        <p>
          <strong>Βήμα 1 — υποχρεωτικές ακμές.</strong> Τρέχουμε Kruskal:
          παίρνουμε ακμές σε αύξουσα σειρά κόστους.
        </p>
        <ul>
          <li>
            <InlineMath>{'C-D = 1'}</InlineMath>: η φθηνότερη, μπαίνει — σε κάθε
            ΕΕΔ.
          </li>
          <li>
            <InlineMath>{'B-E = 3'}</InlineMath>: επόμενη φθηνότερη, δεν κλείνει
            κύκλο, μπαίνει — σε κάθε ΕΕΔ.
          </li>
          <li>
            <InlineMath>{'D-F = 10'}</InlineMath>: είναι η <strong>μόνη</strong>{' '}
            ακμή που αγγίζει την <InlineMath>{'F'}</InlineMath> — γέφυρα, μπαίνει
            υποχρεωτικά σε κάθε ΕΕΔ.
          </li>
        </ul>
        <p>
          Ένα ΕΕΔ σε 6 κορυφές έχει 5 ακμές· έχουμε ήδη 3. Μένει να συνδέσουμε
          τις τρεις «νησίδες» <InlineMath>{'\\{A\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{C,D,F\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{B,E\\}'}</InlineMath> με 2 ακμές.
        </p>
        <p>
          <strong>Βήμα 2 — οι επιλογές.</strong> Όλες οι υπόλοιπες ακμές έχουν
          βάρος 5: <InlineMath>{'A-C, A-B, C-B, D-E'}</InlineMath>. Δες ποιες
          νησίδες ενώνει η καθεμία: <InlineMath>{'A-C'}</InlineMath> ενώνει{' '}
          <InlineMath>{'\\{A\\}'}</InlineMath>–<InlineMath>{'\\{C,D,F\\}'}</InlineMath>·{' '}
          <InlineMath>{'A-B'}</InlineMath> ενώνει{' '}
          <InlineMath>{'\\{A\\}'}</InlineMath>–<InlineMath>{'\\{B,E\\}'}</InlineMath>·{' '}
          ενώ <InlineMath>{'C-B'}</InlineMath> και{' '}
          <InlineMath>{'D-E'}</InlineMath> ενώνουν και οι δύο{' '}
          <InlineMath>{'\\{C,D,F\\}'}</InlineMath>–<InlineMath>{'\\{B,E\\}'}</InlineMath>.
        </p>
        <p>
          Πρέπει να διαλέξουμε 2 ακμές που ενώνουν και τις 3 νησίδες χωρίς
          κύκλο. Έγκυρα ζευγάρια: <InlineMath>{'\\{A\\text{-}C, A\\text{-}B\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}C, C\\text{-}B\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}C, D\\text{-}E\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}B, C\\text{-}B\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}B, D\\text{-}E\\}'}</InlineMath>. Το μόνο
          άκυρο ζευγάρι είναι <InlineMath>{'\\{C\\text{-}B, D\\text{-}E\\}'}</InlineMath>{' '}
          — αφήνει την <InlineMath>{'A'}</InlineMath> αποκομμένη.
        </p>
        <p>
          Κάθε έγκυρο ζευγάρι δίνει ένα διαφορετικό ΕΕΔ, όλα με ίδιο συνολικό
          κόστος <InlineMath>{'1 + 3 + 10 + 5 + 5 = 24'}</InlineMath>. Δηλαδή
          κάθε ΕΕΔ αποτελείται από τις υποχρεωτικές{' '}
          <InlineMath>{'\\{C\\text{-}D, B\\text{-}E, D\\text{-}F\\}'}</InlineMath>{' '}
          συν ένα από τα παραπάνω ζευγάρια βάρους 5.
        </p>
        <p>
          <strong>Συμπέρασμα.</strong> Το γράφημα έχει <strong>περισσότερα από
          ένα</strong> ΕΕΔ — υπάρχουν ισοβαθμίες ακμών βάρους 5 που δημιουργούν
          πραγματικές επιλογές. Για να δώσεις τον <em>ακριβή</em> αριθμό στην
          εξέταση, μέτρα — όπως παραπάνω — πόσα έγκυρα ζευγάρια ακμών ελάχιστου
          βάρους ενώνουν τις νησίδες χωρίς κύκλο. Αυτή ακριβώς η καταμέτρηση
          (υποχρεωτικές ακμές → ανεξάρτητες επιλογές στις ισοβαθμίες) είναι η
          ζητούμενη μέθοδος.
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th3',
    title: 'Παλαιό Θέμα #1 · Θέμα 3 — Επίσκεψη αξιοθέατων (DP)',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 3',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Θέλουμε να επισκεφτούμε μία ακολουθία από{' '}
          <InlineMath>{'N'}</InlineMath> αξιοθέατα{' '}
          <InlineMath>{'\\alpha_1, \\alpha_2, \\dots, \\alpha_n'}</InlineMath> σε
          μία πόλη. Οι μόνες επιλογές μετακίνησης είναι <strong>ταξί</strong> ή{' '}
          <strong>ηλεκτρικό πατίνι</strong>, του οποίου η μίσθωση ισχύει για{' '}
          <strong>4 διαδρομές</strong>. Με ταξί, η μετάβαση από το{' '}
          <InlineMath>{'\\alpha_{i-1}'}</InlineMath> στο{' '}
          <InlineMath>{'\\alpha_i'}</InlineMath> κοστίζει{' '}
          <InlineMath>{'c_i'}</InlineMath> (η μετάβαση στο πρώτο αξιοθέατο είναι
          δωρεάν). Η ενοικίαση πατινιού κοστίζει σταθερά{' '}
          <InlineMath>{'S'}</InlineMath>. Ορίζουμε{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> = το ελάχιστο κόστος για να
          επισκεφθούμε τα <InlineMath>{'\\alpha_1, \\dots, \\alpha_i'}</InlineMath>.
        </p>
        <p>
          (i) Ποια τιμή δίνει το ελάχιστο συνολικό κόστος; (ii) Όρισε αναδρομικά
          το <InlineMath>{'\\text{OPT}(i)'}</InlineMath>. (iii) Ποια είναι η
          χρονική πολυπλοκότητα και γιατί;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(i)</strong> Θέλουμε να έχουμε επισκεφθεί <em>όλα</em> τα
          αξιοθέατα, δηλαδή μέχρι το <InlineMath>{'\\alpha_n'}</InlineMath>. Άρα η
          ζητούμενη τιμή είναι <strong><InlineMath>{'\\text{OPT}(n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(ii) Η σκέψη.</strong> Στεκόμαστε στο αξιοθέατο{' '}
          <InlineMath>{'\\alpha_i'}</InlineMath> και ρωτάμε:{' '}
          <em>πώς ήρθα εδώ;</em> Υπάρχουν ακριβώς δύο τρόποι για το{' '}
          <strong>τελευταίο κομμάτι</strong> της διαδρομής:
        </p>
        <ul>
          <li>
            <strong>Με ταξί στο τελευταίο βήμα.</strong> Πλήρωσα{' '}
            <InlineMath>{'c_i'}</InlineMath> για το βήμα{' '}
            <InlineMath>{'\\alpha_{i-1} \\to \\alpha_i'}</InlineMath>, και πριν
            από αυτό είχα ήδη λύσει βέλτιστα το πρόβλημα μέχρι το{' '}
            <InlineMath>{'\\alpha_{i-1}'}</InlineMath>. Κόστος:{' '}
            <InlineMath>{'\\text{OPT}(i-1) + c_i'}</InlineMath>.
          </li>
          <li>
            <strong>Με ένα ενοικιασμένο πατίνι.</strong> Μία μίσθωση καλύπτει 4
            διαδρομές — δηλαδή φέρνει με τη σειρά μέχρι 4 αξιοθέατα. Αν το
            τελευταίο πατίνι με έφερε ως το <InlineMath>{'\\alpha_i'}</InlineMath>,
            ξεκίνησε από το <InlineMath>{'\\alpha_{i-4}'}</InlineMath>. Πλήρωσα{' '}
            <InlineMath>{'S'}</InlineMath> γι' αυτό, και πριν είχα λύσει βέλτιστα
            μέχρι το <InlineMath>{'\\alpha_{i-4}'}</InlineMath>. Κόστος:{' '}
            <InlineMath>{'\\text{OPT}(i-4) + S'}</InlineMath>.
          </li>
        </ul>
        <p>
          Δεν ξέρουμε ποιος τρόπος είναι ο φθηνότερος — οπότε παίρνουμε το{' '}
          <strong>ελάχιστο</strong>:
        </p>
        <BlockMath>{'\\text{OPT}(i) = \\begin{cases} 0 & i = 0 \\\\ \\min\\{\\, \\text{OPT}(i-1) + c_i,\\ \\ \\text{OPT}(\\max(0,\\,i-4)) + S \\,\\} & i \\ge 1 \\end{cases}'}</BlockMath>
        <p>
          (Το <InlineMath>{'\\max(0, i-4)'}</InlineMath> καλύπτει τα πρώτα
          αξιοθέατα: μια μίσθωση πατινιού καλύπτει «μέχρι 4» διαδρομές, οπότε αν
          είμαστε π.χ. στο <InlineMath>{'\\alpha_3'}</InlineMath>, ένα πατίνι από
          την αρχή κοστίζει απλώς <InlineMath>{'S'}</InlineMath>.)
        </p>
        <p>
          <strong>Παράδειγμα.</strong> Έστω <InlineMath>{'n = 5'}</InlineMath>,
          κόμιστρα <InlineMath>{'c = (-, 4, 4, 4, 4, 4)'}</InlineMath> και{' '}
          <InlineMath>{'S = 10'}</InlineMath>. Με μόνο ταξί:{' '}
          <InlineMath>{'4 \\cdot 5 = 20'}</InlineMath>. Με ένα πατίνι για τις 4
          πρώτες διαδρομές (<InlineMath>{'S = 10'}</InlineMath>) και ταξί για την
          5η (<InlineMath>{'+4'}</InlineMath>): <InlineMath>{'14'}</InlineMath>.
          Η αναδρομή ακριβώς αυτό βρίσκει — το <InlineMath>{'\\min'}</InlineMath>{' '}
          σε κάθε βήμα.
        </p>
        <p>
          <strong>(iii) Πολυπλοκότητα.</strong> Έχουμε{' '}
          <InlineMath>{'n + 1'}</InlineMath> υποπροβλήματα ({' '}
          <InlineMath>{'\\text{OPT}(0), \\dots, \\text{OPT}(n)'}</InlineMath>),
          και το καθένα υπολογίζεται σε <strong>σταθερό χρόνο</strong>{' '}
          <InlineMath>{'O(1)'}</InlineMath> — απλώς ένα <InlineMath>{'\\min'}</InlineMath>{' '}
          δύο ήδη υπολογισμένων τιμών. Άρα συνολικά{' '}
          <strong><InlineMath>{'\\Theta(n)'}</InlineMath></strong> — γραμμικός
          χρόνος, επειδή γεμίζουμε έναν μονοδιάστατο πίνακα{' '}
          <InlineMath>{'n'}</InlineMath> θέσεων με <InlineMath>{'O(1)'}</InlineMath>{' '}
          δουλειά ανά θέση.
        </p>
      </>
    ),
  },
  {
    id: 'pt1-th4',
    title: 'Παλαιό Θέμα #1 · Θέμα 4 — Γρήγορη ύψωση σε δύναμη',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #1',
    problemNumber: 'Θέμα 4',
    weight: 25,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Σχεδίασε έναν αποδοτικό αλγόριθμο που, δοσμένων δύο θετικών ακεραίων{' '}
        <InlineMath>{'m'}</InlineMath> και <InlineMath>{'n'}</InlineMath>,
        υπολογίζει την τιμή <InlineMath>{'m^n'}</InlineMath>, και αιτιολόγησε την
        ορθότητα και την πολυπλοκότητά του. Για ευκολία θεώρησε ότι{' '}
        <InlineMath>{'n = 2^k'}</InlineMath> και ότι το γινόμενο δύο ακεραίων
        γίνεται σε σταθερό χρόνο.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η αφελής λύση.</strong> Πολλαπλασιάζουμε το{' '}
          <InlineMath>{'m'}</InlineMath> με τον εαυτό του{' '}
          <InlineMath>{'n'}</InlineMath> φορές: <InlineMath>{'n - 1'}</InlineMath>{' '}
          πολλαπλασιασμοί → <InlineMath>{'O(n)'}</InlineMath>. Δουλεύει, αλλά
          μπορούμε πολύ καλύτερα.
        </p>
        <p>
          <strong>Η ιδέα «διαίρει και κυρίευε».</strong> Παρατήρησε ότι
        </p>
        <BlockMath>{'m^n = m^{n/2} \\cdot m^{n/2} = \\bigl(m^{n/2}\\bigr)^2.'}</BlockMath>
        <p>
          Δηλαδή, αν ξέρω το <InlineMath>{'m^{n/2}'}</InlineMath>, το{' '}
          <InlineMath>{'m^n'}</InlineMath> προκύπτει με{' '}
          <strong>έναν μόνο</strong> πολλαπλασιασμό! Δεν χρειάζεται να το
          υπολογίσω δύο φορές — το υπολογίζω <strong>μία φορά</strong> και το
          τετραγωνίζω.
        </p>
        <p>{'Power(m, n):'}</p>
        <BlockMath>{'\\text{Power}(m, n) = \\begin{cases} 1 & n = 0 \\\\ \\bigl(\\text{Power}(m, n/2)\\bigr)^2 & n > 0 \\end{cases}'}</BlockMath>
        <p>
          <strong>Ορθότητα.</strong> Με επαγωγή στο{' '}
          <InlineMath>{'n'}</InlineMath>. Βάση: <InlineMath>{'n = 0'}</InlineMath>,{' '}
          <InlineMath>{'m^0 = 1'}</InlineMath> ✓. Επαγωγικό βήμα: υποθέτουμε ότι
          το <InlineMath>{'\\text{Power}(m, n/2)'}</InlineMath> επιστρέφει σωστά
          το <InlineMath>{'m^{n/2}'}</InlineMath>· τότε η συνάρτηση επιστρέφει το
          τετράγωνό του, <InlineMath>{'(m^{n/2})^2 = m^n'}</InlineMath> ✓. Άρα
          είναι σωστή για κάθε <InlineMath>{'n = 2^k'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Σε κάθε κλήση κάνουμε{' '}
          <strong>μία</strong> αναδρομική κλήση στο μισό{' '}
          <InlineMath>{'n'}</InlineMath> και έναν πολλαπλασιασμό{' '}
          <InlineMath>{'O(1)'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = T(n/2) + O(1).'}</BlockMath>
        <p>
          Αυτή η αναδρομή λύνεται σε <strong><InlineMath>{'O(\\log n)'}</InlineMath></strong>{' '}
          — κάθε βήμα υποδιπλασιάζει το <InlineMath>{'n'}</InlineMath>, άρα
          φτάνουμε στη βάση μετά από <InlineMath>{'\\log_2 n = k'}</InlineMath>{' '}
          βήματα. Από <InlineMath>{'O(n)'}</InlineMath> σε{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath> — τεράστια βελτίωση: για{' '}
          <InlineMath>{'n = 1{,}000{,}000'}</InlineMath>, από ένα εκατομμύριο
          πολλαπλασιασμούς σε περίπου 20.
        </p>
      </>
    ),
  },
  {
    id: 'exam-sept-2025',
    title: 'Εξεταστική Σεπτεμβρίου 2025 — Πλήρες θέμα',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2025',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Algorithms-Sep-2025.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2024',
    title: 'Εξεταστική Ιουνίου 2024 — Πλήρες θέμα',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2024',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Algorithms-June-2024.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2024',
    title: 'Εξεταστική Σεπτεμβρίου 2024 — Πλήρες θέμα',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2024',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Algorithms-September-2024.pdf',
    statement: null,
    solution: null,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // Παλαιότερα θέματα (Ζησιμόπουλος αρχείο + λοιπά)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'exam-june-2023',
    title: 'Εξεταστική Ιουνίου 2023 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2023',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2023-June-VZ/Algo-June-2023.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2023',
    title: 'Εξεταστική Σεπτεμβρίου 2023 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2023',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2023-Sept-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2022',
    title: 'Εξεταστική Ιουνίου 2022 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2022',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2022-June-VZ/Algo_june_2022.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2022',
    title: 'Εξεταστική Σεπτεμβρίου 2022 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2022',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2022-Sept-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2021',
    title: 'Εξεταστική Ιουνίου 2021 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2021',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2021-June-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-distance-2020',
    title: 'Εξ αποστάσεως εξεταστική 2020',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'distance-2020',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile:
      '/material/exercises/oldtests/%CE%B1%CE%BB%CE%B3%CE%BF%CF%81%CE%B9%CE%B8%CE%BC%CE%BF%CE%B9-%CE%BA%CE%B1%CE%B9-%CF%80%CE%BF%CE%BB%CF%85%CF%80%CE%BB%CE%BF%CE%BA%CE%BF%CF%84%CE%B9%CF%84%CE%B1-%CE%B5%CE%BE-%CE%B1%CF%80%CE%BF%CF%83%CF%84%CE%B1%CF%83%CE%B5%CF%89%CF%82-2020.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2020',
    title: 'Σεπτέμβριος 2020 (Slot 2)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'sept-2020',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile:
      '/material/exercises/oldtests/%CE%91%CE%BB%CE%B3%CE%BF-2020-%CE%A3%CE%B5%CF%80%CF%84-1(Slot2).jpg',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2019',
    title: 'Φεβρουάριος 2019 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2019',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2019-Feb-VZ/2019.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2018',
    title: 'Ιούνιος 2018 (Ζησιμόπουλος)',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'june-2018',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2018-June-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2018',
    title: 'Σεπτέμβριος 2018 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2018',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2018-Sept-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2017',
    title: 'Φεβρουάριος 2017 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2017',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile:
      '/material/exercises/oldtests/Zisimopoulos/2017-Feb-VZ/algo-fevr-2017-zisimopoulos.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2017',
    title: 'Σεπτέμβριος 2017 (Ζησιμόπουλος)',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'sept-2017',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2017-Sept-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2016',
    title: 'Φεβρουάριος 2016 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'feb-2016',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2016-Feb-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2016',
    title: 'Ιούνιος 2016 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'june-2016',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2016-June-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2015',
    title: 'Ιούνιος 2015 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2015',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2015-June-VZ/2015june.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2012',
    title: 'Πρόοδος 2012 (Ζησιμόπουλος)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'midterm-2012',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
      'lectures/L07-graphs-ii',
    ],
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2012-Midterm/2012-p.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2011',
    title: 'Ιούνιος 2011 (Ζησιμόπουλος)',
    topic: 'graphs',
    origin: 'past-exam',
    source: 'june-2011',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2011-June-VZ/',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2011',
    title: 'Σεπτέμβριος 2011 (Ζησιμόπουλος)',
    topic: 'dp',
    origin: 'past-exam',
    source: 'sept-2011',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile:
      '/material/exercises/oldtests/Zisimopoulos/2011-Sept-VZ/%CE%A3%CE%B5%CF%80%CF%84%CE%AD%CE%BC%CE%B2%CF%81%CE%B9%CE%BF%CF%82%202011-VZ.pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2010',
    title: 'Ιούνιος 2010 (Ζησιμόπουλος)',
    topic: 'greedy',
    origin: 'past-exam',
    source: 'june-2010',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    sourceFile:
      '/material/exercises/oldtests/Zisimopoulos/2010-June-VZ/proodos2010(zisimopoulos).pdf',
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2008',
    title: 'Πρόοδος 2008 (Ζησιμόπουλος)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    source: 'midterm-2008',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
    ],
    sourceFile: '/material/exercises/oldtests/Zisimopoulos/2008-Midterm/2008.pdf',
    statement: null,
    solution: null,
  },
]
