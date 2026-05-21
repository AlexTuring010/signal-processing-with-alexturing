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
  // ── Παλαιό Θέμα #2 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt2-th1-q1',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.1 — Άθροισμα τετραγώνων vs n²log n',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.1',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Αν <InlineMath>{'f(n) = \\sum_{i=1}^{n} i^2'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n^2 \\log_2 n'}</InlineMath>, κύκλωσε ποιες
          σχέσεις ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
          <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
          · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
          <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτα κλείνουμε το άθροισμα. Υπάρχει γνωστός τύπος:
        </p>
        <BlockMath>{'\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}.'}</BlockMath>
        <p>
          Αν δεν τον θυμάσαι, αρκεί η διαίσθηση: προσθέτεις{' '}
          <InlineMath>{'n'}</InlineMath> όρους, ο μεγαλύτερος είναι{' '}
          <InlineMath>{'n^2'}</InlineMath>, άρα το άθροισμα είναι «κάπου ανάμεσα
          σε <InlineMath>{'n^2'}</InlineMath> και <InlineMath>{'n \\cdot n^2'}</InlineMath>»
          — και πράγματι βγαίνει <InlineMath>{'f(n) = \\Theta(n^3)'}</InlineMath>.
        </p>
        <p>
          Άρα συγκρίνουμε <InlineMath>{'n^3'}</InlineMath> με{' '}
          <InlineMath>{'g(n) = n^2 \\log n'}</InlineMath>. Διαιρώντας:{' '}
          <InlineMath>{'n^3 / (n^2 \\log n) = n / \\log n \\to \\infty'}</InlineMath>.
          Το <InlineMath>{'n'}</InlineMath> νικάει εύκολα τον λογάριθμο, οπότε το{' '}
          <InlineMath>{'f'}</InlineMath> μεγαλώνει <strong>αυστηρά πιο γρήγορα</strong>.
        </p>
        <p>
          Αυτό σημαίνει <InlineMath>{'f = \\omega(g)'}</InlineMath> (αυστηρά
          μεγαλύτερο), το οποίο συνεπάγεται και{' '}
          <InlineMath>{'f = \\Omega(g)'}</InlineMath>.{' '}
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q2',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.2 — Αρμονικό άθροισμα vs log log n',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.2',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Αν <InlineMath>{'f(n) = \\sum_{k=1}^{n} \\tfrac{1}{k}'}</InlineMath> και{' '}
        <InlineMath>{'g(n) = \\log_2\\!\\bigl(\\sqrt{\\log_2 n}\\bigr)'}</InlineMath>,
        κύκλωσε ποιες σχέσεις ισχύουν: (i) <InlineMath>{'O'}</InlineMath> · (ii){' '}
        <InlineMath>{'o'}</InlineMath> · (iii) <InlineMath>{'\\Omega'}</InlineMath>{' '}
        · (iv) <InlineMath>{'\\omega'}</InlineMath> · (v){' '}
        <InlineMath>{'\\Theta'}</InlineMath> · (vi) μη-συγκρίσιμες.
      </p>
    ),
    solution: (
      <>
        <p>
          Δύο «τρομακτικές» εκφράσεις — αλλά απλοποιούνται και οι δύο.
        </p>
        <p>
          <strong>Η <InlineMath>{'f'}</InlineMath>:</strong> το{' '}
          <InlineMath>{'\\sum_{k=1}^{n} 1/k'}</InlineMath> είναι ο{' '}
          <em>αρμονικός αριθμός</em>. Γνωστό αποτέλεσμα:{' '}
          <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath>.
        </p>
        <p>
          <strong>Η <InlineMath>{'g'}</InlineMath>:</strong> ξεδιπλώνουμε από
          μέσα προς τα έξω. Το <InlineMath>{'\\sqrt{x} = x^{1/2}'}</InlineMath>,
          και ο λογάριθμος μιας δύναμης κατεβάζει τον εκθέτη:
        </p>
        <BlockMath>{'g(n) = \\log_2\\bigl((\\log_2 n)^{1/2}\\bigr) = \\tfrac{1}{2}\\log_2(\\log_2 n) = \\Theta(\\log\\log n).'}</BlockMath>
        <p>
          Άρα συγκρίνουμε <InlineMath>{'\\log n'}</InlineMath> με{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath>. Το{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath> είναι «ο λογάριθμος του
          λογαρίθμου» — απίστευτα πιο αργό. Άρα το <InlineMath>{'f'}</InlineMath>{' '}
          μεγαλώνει αυστηρά πιο γρήγορα: <InlineMath>{'f = \\omega(g)'}</InlineMath>,
          άρα και <InlineMath>{'f = \\Omega(g)'}</InlineMath>.
        </p>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q3',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.3 — Master Theorem (περίπτωση 3)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.3',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    formulaIds: ['master-theorem'],
    statement: (
      <p>
        Αν <InlineMath>{'T(n) = 2T(n/2) + n^3'}</InlineMath>, κύκλωσε ποια
        ισχύουν: (i) <InlineMath>{'\\Omega(n^2)'}</InlineMath> · (ii){' '}
        <InlineMath>{'O(n^3)'}</InlineMath> · (iii){' '}
        <InlineMath>{'\\Theta(n^3 \\log_2 n)'}</InlineMath> · (iv){' '}
        <InlineMath>{'\\Theta(n^3)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Master Theorem με <InlineMath>{'a = 2'}</InlineMath>,{' '}
          <InlineMath>{'b = 2'}</InlineMath>, <InlineMath>{'f(n) = n^3'}</InlineMath>.
          Συγκρίνουμε το <InlineMath>{'f'}</InlineMath> με το{' '}
          <InlineMath>{'n^{\\log_b a} = n^{\\log_2 2} = n'}</InlineMath>.
        </p>
        <p>
          Το <InlineMath>{'n^3'}</InlineMath> είναι <strong>πολύ μεγαλύτερο</strong>{' '}
          από το <InlineMath>{'n'}</InlineMath> — Περίπτωση 3. Εκεί κυριαρχεί ο
          όρος <InlineMath>{'f(n)'}</InlineMath> και
        </p>
        <BlockMath>{'T(n) = \\Theta(f(n)) = \\Theta(n^3).'}</BlockMath>
        <p>
          Διαισθητικά: τόση δουλειά γίνεται στη ρίζα του δέντρου αναδρομής που τα
          υπο-επίπεδα δεν προσθέτουν τίποτα ουσιαστικό.
        </p>
        <p>
          Ελέγχουμε: (i) <InlineMath>{'\\Omega(n^2)'}</InlineMath> ✓ (το{' '}
          <InlineMath>{'n^3'}</InlineMath> είναι σίγουρα{' '}
          <InlineMath>{'\\ge n^2'}</InlineMath>). (ii){' '}
          <InlineMath>{'O(n^3)'}</InlineMath> ✓. (iii){' '}
          <InlineMath>{'\\Theta(n^3\\log n)'}</InlineMath> ✗ (δεν υπάρχει
          λογάριθμος — αυτή θα ήταν η Περίπτωση 2). (iv){' '}
          <InlineMath>{'\\Theta(n^3)'}</InlineMath> ✓.
        </p>
        <p>
          <strong>Σωστές: (i), (ii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q4',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.4 — Αναδρομή T(n) = 2T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.4',
    weight: 3,
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Αν <InlineMath>{'T(n) = 2T(\\sqrt{n}) + 1'}</InlineMath>, κύκλωσε ποια
        ισχύουν: (i) <InlineMath>{'\\Theta(n)'}</InlineMath> · (ii){' '}
        <InlineMath>{'\\Theta(\\log_2 n)'}</InlineMath> · (iii){' '}
        <InlineMath>{'\\Theta(\\sqrt{n})'}</InlineMath> · (iv){' '}
        <InlineMath>{'\\Omega(2^n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Η ρίζα ξανά — οπότε το ίδιο κόλπο: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'m = \\log_2 n'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath> και, με{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath>:
        </p>
        <BlockMath>{'S(m) = 2\\,S(m/2) + 1.'}</BlockMath>
        <p>
          Master Theorem για το <InlineMath>{'S'}</InlineMath>:{' '}
          <InlineMath>{'a = 2, b = 2'}</InlineMath>,{' '}
          <InlineMath>{'m^{\\log_b a} = m'}</InlineMath>, και{' '}
          <InlineMath>{'f(m) = 1'}</InlineMath> που είναι πολύ μικρότερο του{' '}
          <InlineMath>{'m'}</InlineMath> — Περίπτωση 1. Άρα{' '}
          <InlineMath>{'S(m) = \\Theta(m)'}</InlineMath>.
        </p>
        <p>
          Γυρνάμε: <InlineMath>{'m = \\log_2 n'}</InlineMath>, οπότε{' '}
          <strong><InlineMath>{'T(n) = \\Theta(\\log n)'}</InlineMath></strong>.
        </p>
        <p>
          Ελέγχουμε: μόνο η (ii) <InlineMath>{'\\Theta(\\log_2 n)'}</InlineMath>{' '}
          είναι σωστή. <strong>Σωστή: (ii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q5',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.5 — Αλγόριθμοι & αρνητικά βάρη',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.5',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Ποιος/οι από τους παρακάτω αλγόριθμους <strong>δεν</strong> λειτουργεί
          ορθά σε γραφήματα που έχουν αρνητικά βάρη στις ακμές τους;
        </p>
        <p>
          (i) Αλγόριθμος Prim · (ii) Αλγόριθμος Αναζήτησης κατά Πλάτος (BFS) ·
          (iii) Αλγόριθμος Dijkstra · (iv) Αλγόριθμος Bellman-Ford.
        </p>
      </>
    ),
    solution: (
      <>
        <p>Πάμε έναν-έναν, σκεπτόμενοι «τι κάνει με αρνητικά βάρη;»</p>
        <ul>
          <li>
            <strong>Prim</strong> (ελάχιστο συνδετικό δέντρο): δουλεύει μια χαρά
            — η λογική «πιο φθηνή ακμή αποκοπής» ισχύει είτε τα βάρη είναι θετικά
            είτε αρνητικά. ✓
          </li>
          <li>
            <strong>Bellman-Ford</strong>: σχεδιάστηκε ακριβώς για{' '}
            <strong>αρνητικά</strong> βάρη — δουλεύει. ✓
          </li>
          <li>
            <strong>Dijkstra</strong>: <strong>σπάει</strong>. Μόλις
            «οριστικοποιήσει» μια κορυφή, δεν την ξανακοιτάζει — μια αρνητική ακμή
            θα μπορούσε να τη βελτιώσει αργότερα, αλλά είναι πια αργά.
          </li>
        </ul>
        <p>
          Το <strong>BFS</strong> απλώς αγνοεί τα βάρη — δεν είναι αλγόριθμος
          συντομότερων διαδρομών με βάρη ούτως ή άλλως, οπότε το «αρνητικά βάρη»
          δεν αλλάζει κάτι ειδικό γι' αυτό.
        </p>
        <p>
          Ο αλγόριθμος που <strong>χαλάει ειδικά εξαιτίας</strong> των αρνητικών
          βαρών είναι ο Dijkstra. <strong>Σωστή: (iii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q6',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.6 — Πολυπλοκότητα δισδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.6',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
          <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath>, για{' '}
          <InlineMath>{'i = 1\\dots n'}</InlineMath>,{' '}
          <InlineMath>{'j = 1\\dots m'}</InlineMath>. Ποιες επιλογές μπορούμε να
          πούμε με <strong>βεβαιότητα</strong> ότι <strong>δεν</strong>{' '}
          αντικατοπτρίζουν τη χρονική πολυπλοκότητα;
        </p>
        <p>
          (i) <InlineMath>{'O(n^3)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(m)'}</InlineMath> · (iii) <InlineMath>{'O(n)'}</InlineMath>{' '}
          · (iv) <InlineMath>{'O(m^2 n^2)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ο πίνακας έχει <InlineMath>{'n \\cdot m'}</InlineMath> κελιά και πρέπει
          να γεμίσουν όλα — άρα η πολυπλοκότητα είναι σίγουρα{' '}
          <InlineMath>{'\\Omega(nm)'}</InlineMath>. Ό,τι είναι{' '}
          <strong>μικρότερο</strong> από αυτό το «κατώφλι» αποκλείεται με
          βεβαιότητα.
        </p>
        <ul>
          <li>
            (ii) <InlineMath>{'O(m)'}</InlineMath>: μικρότερο του{' '}
            <InlineMath>{'nm'}</InlineMath> όταν <InlineMath>{'n > 1'}</InlineMath>.
            <strong> Αδύνατο.</strong>
          </li>
          <li>
            (iii) <InlineMath>{'O(n)'}</InlineMath>: μικρότερο του{' '}
            <InlineMath>{'nm'}</InlineMath> όταν <InlineMath>{'m > 1'}</InlineMath>.
            <strong> Αδύνατο.</strong>
          </li>
          <li>
            (i) <InlineMath>{'O(n^3)'}</InlineMath> και (iv){' '}
            <InlineMath>{'O(m^2 n^2)'}</InlineMath>: αυτά είναι{' '}
            <strong>μεγαλύτερα ή ίσα</strong> του <InlineMath>{'nm'}</InlineMath>{' '}
            — μπορεί κάλλιστα να είναι σωστά (ανάλογα με το πόση δουλειά κάνει
            κάθε κελί). Δεν τα αποκλείουμε με βεβαιότητα.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q7',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.7 — Πολυπλοκότητα μονοδιάστατου πίνακα DP',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.7',
    weight: 3,
    difficulty: 'easy',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <p>
        Λύνουμε ένα πρόβλημα με DP συμπληρώνοντας έναν πίνακα τιμών{' '}
        <InlineMath>{'\\text{OPT}(i)'}</InlineMath> για{' '}
        <InlineMath>{'i = 1\\dots n'}</InlineMath>. Ποιες μπορούμε να πούμε με
        βεβαιότητα ότι <strong>δεν</strong> αντικατοπτρίζουν τη χρονική
        πολυπλοκότητα; (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
        <InlineMath>{'O(n^2)'}</InlineMath> · (iii) <InlineMath>{'O(1)'}</InlineMath>{' '}
        · (iv) <InlineMath>{'O(\\log_2 n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Ο πίνακας έχει <InlineMath>{'n'}</InlineMath> κελιά — πρέπει να γεμίσουν
          όλα, άρα η πολυπλοκότητα είναι σίγουρα{' '}
          <InlineMath>{'\\Omega(n)'}</InlineMath>.
        </p>
        <p>
          Αποκλείονται με βεβαιότητα ό,τι είναι μικρότερο του{' '}
          <InlineMath>{'n'}</InlineMath>: το <InlineMath>{'O(1)'}</InlineMath>{' '}
          (σταθερός χρόνος — δεν προλαβαίνεις να γεμίσεις{' '}
          <InlineMath>{'n'}</InlineMath> κελιά) και το{' '}
          <InlineMath>{'O(\\log_2 n)'}</InlineMath>. Τα{' '}
          <InlineMath>{'O(n)'}</InlineMath> και <InlineMath>{'O(n^2)'}</InlineMath>{' '}
          είναι πιθανά.
        </p>
        <p>
          <strong>Σωστές: (iii), (iv).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q8',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.8 — Φράγματα πολυπλοκότητας της LCS',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.8',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L15-dp-ii'],
    formulaIds: ['lcs'],
    statement: (
      <>
        <p>
          Ποια από τα παρακάτω αποτελούν ορθά φράγματα στην πολυπλοκότητα της
          εύρεσης της <strong>μέγιστης κοινής υπακολουθίας</strong> δύο
          συμβολοσειρών με <InlineMath>{'m'}</InlineMath> και{' '}
          <InlineMath>{'n'}</InlineMath> χαρακτήρες;
        </p>
        <p>
          (i) <InlineMath>{'O(n)'}</InlineMath> · (ii){' '}
          <InlineMath>{'O(n^2 m^2)'}</InlineMath> · (iii){' '}
          <InlineMath>{'O(n \\log_2 m)'}</InlineMath> · (iv){' '}
          <InlineMath>{'\\Theta(mn \\log_2 n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Ο αλγόριθμος DP για τη μέγιστη κοινή υπακολουθία (LCS) γεμίζει έναν
          πίνακα <InlineMath>{'m \\times n'}</InlineMath> με{' '}
          <InlineMath>{'O(1)'}</InlineMath> δουλειά ανά κελί — άρα τρέχει σε{' '}
          <strong><InlineMath>{'\\Theta(mn)'}</InlineMath></strong>.
        </p>
        <p>
          «Ορθό φράγμα» = ένα φράγμα που η πραγματική πολυπλοκότητα{' '}
          <InlineMath>{'\\Theta(mn)'}</InlineMath> όντως το ικανοποιεί.
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n)'}</InlineMath>: το{' '}
            <InlineMath>{'mn'}</InlineMath> δεν είναι <InlineMath>{'O(n)'}</InlineMath>{' '}
            (όταν <InlineMath>{'m > 1'}</InlineMath>). ✗
          </li>
          <li>
            (ii) <InlineMath>{'O(n^2 m^2)'}</InlineMath>: το{' '}
            <InlineMath>{'mn'}</InlineMath> είναι σίγουρα{' '}
            <InlineMath>{'\\le n^2 m^2'}</InlineMath> — σωστό (χαλαρό) άνω φράγμα.
            ✓
          </li>
          <li>
            (iii) <InlineMath>{'O(n\\log m)'}</InlineMath>: πολύ μικρότερο του{' '}
            <InlineMath>{'mn'}</InlineMath>. ✗
          </li>
          <li>
            (iv) <InlineMath>{'\\Theta(mn\\log n)'}</InlineMath>: το{' '}
            <InlineMath>{'\\Theta'}</InlineMath> απαιτεί <em>ακριβή</em> τάξη — ο
            αλγόριθμος είναι <InlineMath>{'\\Theta(mn)'}</InlineMath>, όχι{' '}
            <InlineMath>{'\\Theta(mn\\log n)'}</InlineMath>. ✗
          </li>
        </ul>
        <p>
          <strong>Σωστή: (ii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q9',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.9 — Προβλήματα εκτός P (αν P ≠ NP)',
    topic: 'intro',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.9',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Εάν <InlineMath>{'P \\neq NP'}</InlineMath>, ποια προβλήματα{' '}
          <strong>δεν</strong> ανήκουν στο <InlineMath>{'P'}</InlineMath>;
        </p>
        <p>
          (i) 2-Ικανοποιησιμότητα (2-SAT) · (ii) Κάλυμμα Κορυφών (Vertex Cover) ·
          (iii) Σακίδιο (Knapsack) · (iv) Μέγιστο Επικαλύπτον Δέντρο.
        </p>
      </>
    ),
    solution: (
      <>
        <ul>
          <li>
            <strong>2-SAT:</strong> παρόλο που το γενικό SAT είναι NP-πλήρες, η
            ειδική περίπτωση με <em>δύο</em> μεταβλητές ανά όρο λύνεται σε{' '}
            πολυωνυμικό χρόνο — <strong>ανήκει στο <InlineMath>{'P'}</InlineMath></strong>.
          </li>
          <li>
            <strong>Κάλυμμα κορυφών:</strong> κλασικό NP-πλήρες — αν{' '}
            <InlineMath>{'P \\neq NP'}</InlineMath>, <strong>δεν</strong> ανήκει
            στο <InlineMath>{'P'}</InlineMath>. ✓
          </li>
          <li>
            <strong>Σακίδιο (απόφαση):</strong> NP-πλήρες — <strong>δεν</strong>{' '}
            ανήκει στο <InlineMath>{'P'}</InlineMath>. ✓
          </li>
          <li>
            <strong>Μέγιστο επικαλύπτον δέντρο:</strong> ίδιο με το ελάχιστο
            συνδετικό δέντρο, απλώς αντιστρέφεις τα βάρη — λύνεται με Kruskal/Prim
            σε <InlineMath>{'O(m\\log n)'}</InlineMath>, <strong>ανήκει στο{' '}
            <InlineMath>{'P'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii), (iii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th1-q10',
    title: 'Παλαιό Θέμα #2 · Θέμα 1.10 — Προβλήματα άγνωστης NP-πληρότητας',
    topic: 'intro',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 1.10',
    weight: 3,
    difficulty: 'medium',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <>
        <p>
          Ποια από τα παρακάτω προβλήματα <strong>δεν γνωρίζουμε</strong> αν
          είναι NP-πλήρη;
        </p>
        <p>
          (i) Κωδικοποίηση Huffman · (ii) Μέγιστο Μονοπάτι (Longest Path) ·
          (iii) Παραγοντοποίηση Ακεραίων · (iv) Μονοπάτι Hamilton.
        </p>
      </>
    ),
    solution: (
      <>
        <ul>
          <li>
            <strong>Huffman:</strong> ξέρουμε πολυωνυμικό άπληστο αλγόριθμο{' '}
            <InlineMath>{'O(n\\log n)'}</InlineMath> — είναι στο{' '}
            <InlineMath>{'P'}</InlineMath>, άρα γνωρίζουμε τη θέση του.
          </li>
          <li>
            <strong>Μέγιστο μονοπάτι:</strong> γνωρίζουμε ότι είναι NP-πλήρες.
          </li>
          <li>
            <strong>Μονοπάτι Hamilton:</strong> γνωρίζουμε ότι είναι NP-πλήρες.
          </li>
          <li>
            <strong>Παραγοντοποίηση ακεραίων:</strong> είναι στο{' '}
            <InlineMath>{'NP'}</InlineMath>, αλλά <strong>δεν</strong> έχει
            αποδειχθεί ούτε ότι είναι στο <InlineMath>{'P'}</InlineMath> ούτε ότι
            είναι NP-πλήρες — η θέση του παραμένει <em>ανοιχτό ερώτημα</em>
            (πιστεύεται ότι δεν είναι NP-πλήρες· πάνω σε αυτή τη δυσκολία
            στηρίζεται η κρυπτογραφία RSA).
          </li>
        </ul>
        <p>
          <strong>Σωστή: (iii).</strong>
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th2-1',
    title: 'Παλαιό Θέμα #2 · Θέμα 2.1 — Εκτέλεση του αλγορίθμου Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 2.1',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Εφάρμοσε τον αλγόριθμο του Dijkstra στο παρακάτω γράφημα με αφετηρία
          την κορυφή <InlineMath>{'a'}</InlineMath>. Η απάντηση αρκεί να περιέχει
          τον πλήρη πίνακα που διατηρεί ο Dijkstra σε κάθε βήμα. Το γράφημα έχει
          6 κορυφές <InlineMath>{'a, b, c, d, e, f'}</InlineMath> και τις ακμές
          (με τα βάρη τους):
        </p>
        <ul>
          <li><InlineMath>{'a - d = 1'}</InlineMath></li>
          <li><InlineMath>{'a - c = 5'}</InlineMath></li>
          <li><InlineMath>{'a - b = 4'}</InlineMath></li>
          <li><InlineMath>{'c - b = 2'}</InlineMath></li>
          <li><InlineMath>{'d - b = 3'}</InlineMath></li>
          <li><InlineMath>{'d - e = 5'}</InlineMath></li>
          <li><InlineMath>{'b - e = 1'}</InlineMath></li>
          <li><InlineMath>{'e - f = 2'}</InlineMath></li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Ο Dijkstra κρατάει για κάθε κορυφή μια <strong>τρέχουσα απόσταση</strong>{' '}
          από την <InlineMath>{'a'}</InlineMath>, και σε κάθε βήμα{' '}
          «οριστικοποιεί» την κορυφή με τη μικρότερη τρέχουσα απόσταση, μετά{' '}
          «χαλαρώνει» τις γειτονικές της.
        </p>
        <p>
          Ξεκινάμε: <InlineMath>{'d(a) = 0'}</InlineMath>, όλες οι άλλες{' '}
          <InlineMath>{'\\infty'}</InlineMath>. Ο πίνακας ανά βήμα (οριστικές
          τιμές με <strong>έντονα</strong>):
        </p>
        <BlockMath>{'\\begin{array}{c|cccccc} \\text{Βήμα} & a & b & c & d & e & f \\\\ \\hline \\text{αρχή} & \\mathbf{0} & \\infty & \\infty & \\infty & \\infty & \\infty \\\\ \\text{εξ. } a & \\mathbf{0} & 4 & 5 & 1 & \\infty & \\infty \\\\ \\text{εξ. } d & \\mathbf{0} & 4 & 5 & \\mathbf{1} & 6 & \\infty \\\\ \\text{εξ. } b & \\mathbf{0} & \\mathbf{4} & 5 & \\mathbf{1} & 5 & \\infty \\\\ \\text{εξ. } c & \\mathbf{0} & \\mathbf{4} & \\mathbf{5} & \\mathbf{1} & 5 & \\infty \\\\ \\text{εξ. } e & \\mathbf{0} & \\mathbf{4} & \\mathbf{5} & \\mathbf{1} & \\mathbf{5} & 7 \\\\ \\text{εξ. } f & \\mathbf{0} & \\mathbf{4} & \\mathbf{5} & \\mathbf{1} & \\mathbf{5} & \\mathbf{7} \\end{array}'}</BlockMath>
        <p>Πώς προκύπτει κάθε γραμμή:</p>
        <ul>
          <li>
            <strong>Εξερευνώ <InlineMath>{'a'}</InlineMath> (0):</strong> ακμές{' '}
            <InlineMath>{'a\\!-\\!d=1, a\\!-\\!b=4, a\\!-\\!c=5'}</InlineMath> →{' '}
            <InlineMath>{'d=1, b=4, c=5'}</InlineMath>.
          </li>
          <li>
            <strong>Εξερευνώ <InlineMath>{'d'}</InlineMath> (1, η μικρότερη):</strong>{' '}
            <InlineMath>{'d\\!-\\!b: 1+3=4'}</InlineMath> (ίδιο, καμία αλλαγή)·{' '}
            <InlineMath>{'d\\!-\\!e: 1+5=6'}</InlineMath> → <InlineMath>{'e=6'}</InlineMath>.
          </li>
          <li>
            <strong>Εξερευνώ <InlineMath>{'b'}</InlineMath> (4):</strong>{' '}
            <InlineMath>{'b\\!-\\!e: 4+1=5 < 6'}</InlineMath> →{' '}
            <InlineMath>{'e=5'}</InlineMath>. (<InlineMath>{'b\\!-\\!c: 4+2=6>5'}</InlineMath>,
            όχι.)
          </li>
          <li>
            <strong>Εξερευνώ <InlineMath>{'c'}</InlineMath> (5)</strong> και{' '}
            <strong><InlineMath>{'e'}</InlineMath> (5):</strong> από την{' '}
            <InlineMath>{'e'}</InlineMath>, <InlineMath>{'e\\!-\\!f: 5+2=7'}</InlineMath>{' '}
            → <InlineMath>{'f=7'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Τελικές συντομότερες αποστάσεις από την{' '}
          <InlineMath>{'a'}</InlineMath>:</strong>{' '}
          <InlineMath>{'a{=}0,\\ d{=}1,\\ b{=}4,\\ c{=}5,\\ e{=}5,\\ f{=}7'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th2-2',
    title: 'Παλαιό Θέμα #2 · Θέμα 2.2 — Κλάσεις όπου δουλεύει η τοπολογική ταξινόμηση',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 2.2',
    weight: 5,
    difficulty: 'easy',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>
          Σε ποιες από τις παρακάτω κλάσεις γραφημάτων ο αλγόριθμος της
          τοπολογικής ταξινόμησης επιστρέφει ορθά το ζητούμενο αποτέλεσμα;
        </p>
        <p>
          (i) Γραφήματα με θετικά βάρη στις ακμές τους · (ii) Άκυκλα
          κατευθυνόμενα γραφήματα · (iii) Δέντρα · (iv) Διμερή γραφήματα.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Βασικός κανόνας: η τοπολογική ταξινόμηση υπάρχει (και ο αλγόριθμος τη
          βρίσκει σωστά) <strong>αν και μόνο αν</strong> το γράφημα είναι{' '}
          <strong>DAG</strong> — κατευθυνόμενο και άκυκλο.
        </p>
        <ul>
          <li>
            (ii) <strong>Άκυκλα κατευθυνόμενα γραφήματα:</strong> ακριβώς η
            κλάση για την οποία ορίζεται — δουλεύει πάντα. ✓
          </li>
          <li>
            (iii) <strong>Δέντρα:</strong> ένα κατευθυνόμενο (ριζωμένο) δέντρο{' '}
            <em>είναι</em> ειδική περίπτωση DAG — δεν έχει κύκλους. Άρα η
            τοπολογική ταξινόμηση δουλεύει. ✓
          </li>
          <li>
            (i) <strong>Θετικά βάρη:</strong> τα βάρη είναι εντελώς άσχετα με την
            τοπολογική ταξινόμηση. Ένα γράφημα «με θετικά βάρη» μπορεί κάλλιστα
            να έχει κύκλο → δεν εγγυάται τίποτα. ✗
          </li>
          <li>
            (iv) <strong>Διμερή γραφήματα:</strong> ένα διμερές γράφημα μπορεί να
            έχει κύκλους (άρτιου μήκους) — δεν εγγυάται ακυκλικότητα. ✗
          </li>
        </ul>
        <p>
          <strong>Σωστές: (ii) και (iii)</strong> (το δέντρο ως ειδικός DAG).
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th2-3',
    title: 'Παλαιό Θέμα #2 · Θέμα 2.3 — Άπληστα ρέστα (αποτυγχάνει)',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 2.3',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>
          Εργαζόμαστε ως ταμίες σε κατάστημα. Τα χαρτονομίσματα/κέρματα που
          μπορούμε να επιστρέψουμε ως ρέστα έχουν αξία{' '}
          <InlineMath>{'1, 10, 25'}</InlineMath> ευρώ (απεριόριστα). Στόχος: όταν
          δίνουμε ρέστα, να χρησιμοποιούμε το <strong>μικρότερο πλήθος</strong>{' '}
          κερμάτων.
        </p>
        <p>
          Μπορούμε να πετύχουμε τον στόχο επιλέγοντας πάντα το κέρμα με τη{' '}
          <strong>μεγαλύτερη αξία που δεν ξεπερνά</strong> το υπόλοιπο ποσό; (i)
          ΝΑΙ · (ii) ΟΧΙ. Αιτιολόγησε την απάντηση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Απάντηση: (ii) ΟΧΙ.</strong> Το άπληστο «πάντα το μεγαλύτερο
          κέρμα» <em>δεν</em> δίνει πάντα το ελάχιστο πλήθος για αυτό το σύστημα
          κερμάτων.
        </p>
        <p>
          <strong>Αντιπαράδειγμα.</strong> Πρέπει να δώσουμε ρέστα{' '}
          <InlineMath>{'30'}</InlineMath> ευρώ.
        </p>
        <ul>
          <li>
            <strong>Άπληστα:</strong> το μεγαλύτερο κέρμα που χωράει είναι το{' '}
            <InlineMath>{'25'}</InlineMath>. Μένει <InlineMath>{'5'}</InlineMath>{' '}
            — και πρέπει να το καλύψουμε με πέντε κέρματα του{' '}
            <InlineMath>{'1'}</InlineMath>. Σύνολο:{' '}
            <InlineMath>{'25 + 1 + 1 + 1 + 1 + 1'}</InlineMath> ={' '}
            <strong>6 κέρματα</strong>.
          </li>
          <li>
            <strong>Βέλτιστα:</strong> <InlineMath>{'10 + 10 + 10'}</InlineMath>{' '}
            = <strong>3 κέρματα</strong>.
          </li>
        </ul>
        <p>
          Το άπληστο έδωσε 6, ενώ η βέλτιστη λύση θέλει μόλις 3. Το «μεγαλύτερο
          κέρμα» αρπάζει το <InlineMath>{'25'}</InlineMath> και μας αναγκάζει σε
          πολλά μικρά κέρματα μετά.
        </p>
        <p>
          <strong>Το μάθημα:</strong> ένας άπληστος κανόνας μπορεί να «δείχνει»
          σωστός — εδώ δουλεύει για το σύστημα του ευρώ{' '}
          (<InlineMath>{'1,2,5,10,\\dots'}</InlineMath>), αλλά{' '}
          <strong>όχι για κάθε σύστημα κερμάτων</strong>. Πάντα ψάχνεις
          αντιπαράδειγμα πριν τον εμπιστευτείς.
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th3',
    title: 'Παλαιό Θέμα #2 · Θέμα 3 — Όνομα σκύλου (συντομότερη κοινή υπερακολουθία)',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 3',
    weight: 20,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>
          Ένα ζευγάρι με ονόματα <InlineMath>{'s_1'}</InlineMath> και{' '}
          <InlineMath>{'s_2'}</InlineMath> θέλει να ονομάσει τον σκύλο του με ένα
          όνομα που να <strong>περιέχει και τα δύο ονόματά τους ως
          υπακολουθίες</strong>, και να είναι το <strong>συντομότερο</strong>{' '}
          δυνατό. Π.χ. για ΓΑΒ και ΜΙΑΟΥ, το ΜΙΓΑΒΟΥ ή το ΓΜΙΑΟΥΒ είναι έγκυρα,
          αλλά όχι το ΓΑΒΜΙΑΟΥ (πολύ μακρύ). Σχεδίασε αλγόριθμο Δυναμικού
          Προγραμματισμού που βρίσκει το βέλτιστο μήκος για συμβολοσειρές{' '}
          <InlineMath>{'s_1, s_2'}</InlineMath> μηκών <InlineMath>{'m, n'}</InlineMath>.
        </p>
        <p>
          Ορίζουμε <InlineMath>{'\\text{OPT}(i,j)'}</InlineMath> = το μήκος της
          συντομότερης συμβολοσειράς που περιέχει ως υπακολουθίες τα πρώτα{' '}
          <InlineMath>{'i'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_1'}</InlineMath> και τα πρώτα{' '}
          <InlineMath>{'j'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_2'}</InlineMath>.
        </p>
        <p>
          (i) Το βέλτιστο μήκος δίνεται από την τιμή{' '}
          <InlineMath>{'\\text{OPT}(\\_,\\_)'}</InlineMath>. (ii) Γράψε την
          αναδρομική σχέση. (iii) Ποια η χρονική πολυπλοκότητα και γιατί;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτό το πρόβλημα λέγεται <strong>συντομότερη κοινή υπερακολουθία</strong>{' '}
          (shortest common supersequence) — το «αντίστροφο» της μέγιστης κοινής
          υπακολουθίας.
        </p>
        <p>
          <strong>(i)</strong> Θέλουμε όνομα που να περιέχει{' '}
          <em>ολόκληρα</em> και τα δύο ονόματα — δηλαδή και τα{' '}
          <InlineMath>{'m'}</InlineMath> στοιχεία της{' '}
          <InlineMath>{'s_1'}</InlineMath> και τα <InlineMath>{'n'}</InlineMath>{' '}
          της <InlineMath>{'s_2'}</InlineMath>. Άρα η ζητούμενη τιμή είναι{' '}
          <strong><InlineMath>{'\\text{OPT}(m, n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(ii) Η σκέψη.</strong> Χτίζουμε το όνομα γράμμα-γράμμα και
          κοιτάμε το <strong>τελευταίο</strong> γράμμα που βάζουμε. Συγκρίνουμε
          τα τελευταία γράμματα <InlineMath>{'s_1[i]'}</InlineMath> και{' '}
          <InlineMath>{'s_2[j]'}</InlineMath>:
        </p>
        <ul>
          <li>
            <strong>Αν <InlineMath>{'s_1[i] = s_2[j]'}</InlineMath>:</strong> ένα
            μόνο γράμμα στο τέλος «εξυπηρετεί και τους δύο». Το βάζουμε μία φορά
            (κόστος 1) και λύνουμε το υπόλοιπο για{' '}
            <InlineMath>{'(i-1, j-1)'}</InlineMath>.
          </li>
          <li>
            <strong>Αν διαφέρουν:</strong> το τελευταίο γράμμα του ονόματος είναι{' '}
            είτε το <InlineMath>{'s_1[i]'}</InlineMath> είτε το{' '}
            <InlineMath>{'s_2[j]'}</InlineMath> (όχι και τα δύο μαζί). Πληρώνουμε
            1 και παίρνουμε το <strong>καλύτερο</strong> από τις δύο επιλογές.
          </li>
        </ul>
        <BlockMath>{'\\text{OPT}(i,j) = \\begin{cases} j & i = 0 \\\\ i & j = 0 \\\\ 1 + \\text{OPT}(i-1,j-1) & s_1[i] = s_2[j] \\\\ 1 + \\min\\{ \\text{OPT}(i-1,j),\\, \\text{OPT}(i,j-1) \\} & s_1[i] \\neq s_2[j] \\end{cases}'}</BlockMath>
        <p>
          Οι βασικές περιπτώσεις: αν η μία συμβολοσειρά τελείωσε, πρέπει απλώς να
          «γράψουμε» ό,τι μένει από την άλλη — <InlineMath>{'j'}</InlineMath> ή{' '}
          <InlineMath>{'i'}</InlineMath> γράμματα.
        </p>
        <p>
          <strong>Παράδειγμα (ΓΑΒ, ΜΙΑΟΥ).</strong> Το κοινό γράμμα είναι το «Α».
          Η συντομότερη υπερακολουθία βάζει το «Α» <em>μία</em> φορά και
          μπλέκει γύρω του τα υπόλοιπα: π.χ. ΜΙ-Γ-Α-ΒΟΥ → «ΜΙΓΑΒΟΥ», μήκος 7
          (ενώ το αφελές «κόλλημα» ΓΑΒ+ΜΙΑΟΥ δίνει 8).
        </p>
        <p>
          <strong>(iii) Πολυπλοκότητα.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'(m+1)(n+1)'}</InlineMath> κελιά και κάθε κελί
          υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath> (μία σύγκριση, ένα{' '}
          <InlineMath>{'\\min'}</InlineMath>). Άρα{' '}
          <strong><InlineMath>{'\\Theta(mn)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'pt2-th4',
    title: 'Παλαιό Θέμα #2 · Θέμα 4 — Χρονοπρογραμματισμός & χρόνος αναμονής',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #2',
    problemNumber: 'Θέμα 4',
    weight: 25,
    difficulty: 'hard',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>
          Έχουμε <InlineMath>{'n'}</InlineMath> φοιτητές/τριες· το άτομο{' '}
          <InlineMath>{'i'}</InlineMath> καταθέτει ένα αίτημα με χρόνο
          διεκπεραίωσης <InlineMath>{'t_i'}</InlineMath>. Τοποθετούμε τα{' '}
          <InlineMath>{'n'}</InlineMath> αιτήματα σε μια σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath> και τα διεκπεραιώνουμε ένα-ένα. Ο
          συνολικός χρόνος αναμονής του ατόμου <InlineMath>{'i'}</InlineMath>{' '}
          ισούται με τον χρόνο των αιτημάτων που διεκπεραιώθηκαν{' '}
          <strong>πριν</strong> το δικό του (με βάση τη σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath>) συν τον δικό του χρόνο{' '}
          <InlineMath>{'t_i'}</InlineMath>.
        </p>
        <p>
          (α) Με ποιο άπληστο κριτήριο επιλέγουμε τη σειρά{' '}
          <InlineMath>{'\\pi'}</InlineMath> ώστε να ελαχιστοποιήσουμε τον χρόνο
          αναμονής; (β) Απόδειξε τυπικά την ορθότητα του κριτηρίου.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Το κριτήριο: μικρότερος χρόνος πρώτα</strong> (Shortest
          Processing Time first) — ταξινόμησε τα αιτήματα σε{' '}
          <strong>αύξουσα</strong> σειρά <InlineMath>{'t_i'}</InlineMath> και
          εκτέλεσέ τα έτσι.
        </p>
        <p>
          <em>Μια διευκρίνιση:</em> ο χρόνος αναμονής ενός ατόμου είναι ο χρόνος
          ολοκλήρωσης του αιτήματός του. Το άθροισμα όλων των αναμονών (η
          ποσότητα που έχει νόημα να ελαχιστοποιηθεί) εξαρτάται από τη σειρά —
          ενώ ο χρόνος του <em>τελευταίου</em> ατόμου είναι πάντα{' '}
          <InlineMath>{'\\sum t_i'}</InlineMath>, σταθερός. Άρα βελτιστοποιούμε
          το <strong>συνολικό</strong> (ή μέσο) χρόνο αναμονής.
        </p>
        <p>
          <strong>Γιατί δουλεύει διαισθητικά:</strong> ο χρόνος ενός αιτήματος
          «επιβαρύνει» όλα όσα έρχονται μετά. Ένα μακρύ αίτημα μπροστά καθυστερεί
          τους πάντες· βάζοντας τα σύντομα πρώτα, η καθυστέρηση που «κληρονομούν»
          τα επόμενα είναι όσο το δυνατόν μικρότερη.
        </p>
        <p>
          <strong>(β) Απόδειξη ορθότητας (επιχείρημα ανταλλαγής).</strong> Έστω
          βέλτιστη σειρά <InlineMath>{'S^*'}</InlineMath> που <strong>δεν</strong>{' '}
          είναι ταξινομημένη κατά αύξον <InlineMath>{'t'}</InlineMath>. Τότε
          υπάρχουν δύο <strong>διαδοχικά</strong> αιτήματα{' '}
          <InlineMath>{'i, j'}</InlineMath> (το <InlineMath>{'i'}</InlineMath>{' '}
          ακριβώς πριν το <InlineMath>{'j'}</InlineMath>) με{' '}
          <InlineMath>{'t_i > t_j'}</InlineMath> — δηλαδή «εκτός σειράς».
        </p>
        <p>
          <strong>Αντιμεταθέτουμε</strong> τα <InlineMath>{'i'}</InlineMath> και{' '}
          <InlineMath>{'j'}</InlineMath>. Τι αλλάζει;
        </p>
        <ul>
          <li>
            Όλα τα υπόλοιπα αιτήματα: ο χρόνος ολοκλήρωσής τους{' '}
            <strong>δεν αλλάζει</strong> — το ζευγάρι{' '}
            <InlineMath>{'\\{i,j\\}'}</InlineMath> καταλαμβάνει το ίδιο συνολικό
            διάστημα, απλώς με διαφορετική εσωτερική σειρά.
          </li>
          <li>
            Έστω <InlineMath>{'T'}</InlineMath> ο χρόνος που έχει περάσει πριν το
            ζευγάρι. <strong>Πριν:</strong> το <InlineMath>{'i'}</InlineMath>{' '}
            τελειώνει στο <InlineMath>{'T+t_i'}</InlineMath>, το{' '}
            <InlineMath>{'j'}</InlineMath> στο{' '}
            <InlineMath>{'T+t_i+t_j'}</InlineMath>. Άθροισμα:{' '}
            <InlineMath>{'2T + 2t_i + t_j'}</InlineMath>.
            <br />
            <strong>Μετά:</strong> το <InlineMath>{'j'}</InlineMath> τελειώνει
            στο <InlineMath>{'T+t_j'}</InlineMath>, το{' '}
            <InlineMath>{'i'}</InlineMath> στο{' '}
            <InlineMath>{'T+t_j+t_i'}</InlineMath>. Άθροισμα:{' '}
            <InlineMath>{'2T + 2t_j + t_i'}</InlineMath>.
          </li>
        </ul>
        <p>
          Η διαφορά (πριν − μετά) είναι{' '}
          <InlineMath>{'(2t_i + t_j) - (2t_j + t_i) = t_i - t_j > 0'}</InlineMath>.
          Δηλαδή η αντιμετάθεση <strong>μείωσε</strong> το συνολικό κόστος —
          αντίφαση με το ότι η <InlineMath>{'S^*'}</InlineMath> ήταν βέλτιστη.
        </p>
        <p>
          Άρα καμία βέλτιστη λύση δεν έχει ζευγάρι «εκτός σειράς» — κάθε βέλτιστη
          λύση είναι ταξινομημένη κατά αύξον <InlineMath>{'t'}</InlineMath>,
          ακριβώς όπως κάνει ο άπληστος. <strong>∎</strong>
        </p>
      </>
    ),
  },
  // ── Παλαιό Θέμα #3 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt3-th1',
    title: 'Παλαιό Θέμα #3 · Θέμα 1 — Κατασκευή γραφήματος & εκτέλεση Dijkstra',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #3',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>(α) (10 μονάδες)</strong> Να κατασκευάσεις ένα{' '}
          <strong>κατευθυνόμενο</strong> γράφημα με πέντε κορυφές, εκ των οποίων
          μία θα είναι η κορυφή-πηγή <InlineMath>{'s'}</InlineMath> (με
          εισερχόμενο βαθμό 0), <strong>5 ακμές</strong>, και ένα{' '}
          <strong>μη-αρνητικό κύκλο</strong>, για το οποίο ο αλγόριθμος του
          Dijkstra λειτουργεί σωστά. Να αιτιολογήσεις σύντομα την απάντησή σου.
        </p>
        <p>
          <strong>(β) (10 μονάδες)</strong> Να εφαρμόσεις πλήρως κατάλληλο
          αλγόριθμο στο γράφημα ώστε να υπολογίσεις σωστά τη συντομότερη απόσταση
          όλων των κορυφών από την <InlineMath>{'s'}</InlineMath>. Να
          κατασκευάσεις έναν πίνακα ο οποίος για κάθε βήμα θα δείχνει τις
          τρέχουσες αποστάσεις από την <InlineMath>{'s'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Τι ζητάει.</strong> Θέλουμε γράφημα όπου ο Dijkstra
          δουλεύει σωστά — δηλαδή <strong>όλα τα βάρη μη-αρνητικά</strong> (αυτή
          είναι η μόνη προϋπόθεση του Dijkstra). Ο «μη-αρνητικός κύκλος» δεν
          ενοχλεί: κύκλος με συνολικό βάρος <InlineMath>{'\\ge 0'}</InlineMath>{' '}
          δεν δίνει κανένα κίνητρο να τον διασχίσουμε, οπότε οι συντομότερες
          διαδρομές παραμένουν καλά ορισμένες.
        </p>
        <p>Ένα έγκυρο παράδειγμα — 5 κορυφές <InlineMath>{'s,a,b,c,d'}</InlineMath>, 5 ακμές:</p>
        <ul>
          <li><InlineMath>{'s \\to a'}</InlineMath>, βάρος 2</li>
          <li><InlineMath>{'a \\to b'}</InlineMath>, βάρος 3</li>
          <li><InlineMath>{'b \\to c'}</InlineMath>, βάρος 1</li>
          <li><InlineMath>{'c \\to a'}</InlineMath>, βάρος 4 &nbsp;— κλείνει τον κύκλο <InlineMath>{'a\\to b\\to c\\to a'}</InlineMath></li>
          <li><InlineMath>{'b \\to d'}</InlineMath>, βάρος 6</li>
        </ul>
        <p>
          Η <InlineMath>{'s'}</InlineMath> έχει εισερχόμενο βαθμό 0 ✓. Ο κύκλος{' '}
          <InlineMath>{'a\\to b\\to c\\to a'}</InlineMath> έχει βάρος{' '}
          <InlineMath>{'3+1+4 = 8 \\ge 0'}</InlineMath> — μη-αρνητικός ✓. Όλα τα
          βάρη <InlineMath>{'\\ge 0'}</InlineMath> → ο Dijkstra λειτουργεί σωστά ✓.
        </p>
        <p>
          <strong>(β) Εκτέλεση Dijkstra από την <InlineMath>{'s'}</InlineMath>.</strong>{' '}
          Αρχικά <InlineMath>{'d(s)=0'}</InlineMath>, υπόλοιπα{' '}
          <InlineMath>{'\\infty'}</InlineMath>. Σε κάθε βήμα οριστικοποιούμε την
          κορυφή με τη μικρότερη τρέχουσα τιμή και χαλαρώνουμε τις γείτονές της:
        </p>
        <BlockMath>{'\\begin{array}{c|ccccc} \\text{Βήμα} & s & a & b & c & d \\\\ \\hline \\text{αρχή} & \\mathbf{0} & \\infty & \\infty & \\infty & \\infty \\\\ \\text{εξ. } s & \\mathbf{0} & 2 & \\infty & \\infty & \\infty \\\\ \\text{εξ. } a & \\mathbf{0} & \\mathbf{2} & 5 & \\infty & \\infty \\\\ \\text{εξ. } b & \\mathbf{0} & \\mathbf{2} & \\mathbf{5} & 6 & 11 \\\\ \\text{εξ. } c & \\mathbf{0} & \\mathbf{2} & \\mathbf{5} & \\mathbf{6} & 11 \\\\ \\text{εξ. } d & \\mathbf{0} & \\mathbf{2} & \\mathbf{5} & \\mathbf{6} & \\mathbf{11} \\end{array}'}</BlockMath>
        <ul>
          <li><strong>εξ. <InlineMath>{'s'}</InlineMath>:</strong> <InlineMath>{'s\\to a: 0+2=2'}</InlineMath>.</li>
          <li><strong>εξ. <InlineMath>{'a'}</InlineMath> (2):</strong> <InlineMath>{'a\\to b: 2+3=5'}</InlineMath>.</li>
          <li><strong>εξ. <InlineMath>{'b'}</InlineMath> (5):</strong> <InlineMath>{'b\\to c: 5+1=6'}</InlineMath>· <InlineMath>{'b\\to d: 5+6=11'}</InlineMath>.</li>
          <li><strong>εξ. <InlineMath>{'c'}</InlineMath> (6):</strong> <InlineMath>{'c\\to a: 6+4=10 > 2'}</InlineMath> — η <InlineMath>{'a'}</InlineMath> είναι ήδη οριστική, καμία αλλαγή. (Εδώ φαίνεται γιατί ο μη-αρνητικός κύκλος δεν βλάπτει.)</li>
          <li><strong>εξ. <InlineMath>{'d'}</InlineMath> (11):</strong> καμία εξερχόμενη ακμή.</li>
        </ul>
        <p>
          <strong>Συντομότερες αποστάσεις από την <InlineMath>{'s'}</InlineMath>:</strong>{' '}
          <InlineMath>{'s{=}0,\\ a{=}2,\\ b{=}5,\\ c{=}6,\\ d{=}11'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt3-th2',
    title: 'Παλαιό Θέμα #3 · Θέμα 2 — Πλειοψηφικό στοιχείο σε O(n log n)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #3',
    problemNumber: 'Θέμα 2',
    weight: 30,
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <p>
        Ένας πίνακας <InlineMath>{'n'}</InlineMath> στοιχείων{' '}
        <InlineMath>{'[1\\dots n]'}</InlineMath> έχει ένα{' '}
        <strong>πλειοψηφικό στοιχείο</strong> αν γνήσια πάνω από τα μισά του
        στοιχεία είναι ίδια. Τα στοιχεία <strong>δεν</strong> είναι μεταξύ τους
        συγκρίσιμα (π.χ. ιερογλυφικά ή χρώματα), αλλά μπορούμε σε σταθερό χρόνο
        να αποφασίσουμε αν δύο στοιχεία είναι ίδια. Περίγραψε έναν αλγόριθμο που
        βρίσκει το πλειοψηφικό στοιχείο σε χρόνο <InlineMath>{'O(n\\log n)'}</InlineMath>{' '}
        και αιτιολόγησε την ορθότητά του.
      </p>
    ),
    solution: (
      <>
        <p>
          Η παγίδα: <strong>δεν μπορούμε να ταξινομήσουμε</strong> — τα στοιχεία
          δεν συγκρίνονται με <InlineMath>{'<'}</InlineMath>, μόνο με «ίδιο;».
          Άρα χρειαζόμαστε <strong>διαίρει-και-κυρίευε</strong>.
        </p>
        <p>
          <strong>Η ιδέα-κλειδί.</strong> Σπάμε τον πίνακα στη μέση, σε αριστερό
          και δεξί μισό. <em>Παρατήρηση:</em> αν ένα στοιχείο{' '}
          <InlineMath>{'x'}</InlineMath> είναι πλειοψηφικό σε <strong>όλον</strong>{' '}
          τον πίνακα (πάνω από <InlineMath>{'n/2'}</InlineMath> εμφανίσεις),
          τότε πρέπει να είναι πλειοψηφικό σε <strong>τουλάχιστον ένα</strong>{' '}
          από τα δύο μισά. Γιατί; Αν δεν ήταν πλειοψηφικό σε <em>κανένα</em>{' '}
          μισό, θα είχε <InlineMath>{'\\le |μισό|/2'}</InlineMath> εμφανίσεις σε
          καθένα, σύνολο <InlineMath>{'\\le n/2'}</InlineMath> — άτοπο.
        </p>
        <p>
          <strong>Ο αλγόριθμος <InlineMath>{'\\text{Majority}(A)'}</InlineMath>:</strong>
        </p>
        <ul>
          <li>
            <strong>Βάση:</strong> αν ο πίνακας έχει 1 στοιχείο, αυτό είναι το
            (υποψήφιο) πλειοψηφικό.
          </li>
          <li>
            <strong>Διαίρει:</strong> χώρισε στη μέση· βρες αναδρομικά το
            υποψήφιο πλειοψηφικό <InlineMath>{'x_L'}</InlineMath> του αριστερού
            μισού και <InlineMath>{'x_R'}</InlineMath> του δεξιού.
          </li>
          <li>
            <strong>Κυρίευε:</strong> τα μόνα δυνατά πλειοψηφικά του πλήρους
            πίνακα είναι το <InlineMath>{'x_L'}</InlineMath> ή το{' '}
            <InlineMath>{'x_R'}</InlineMath>. Για καθένα, <strong>σάρωσε όλον
            τον πίνακα</strong> και μέτρησε τις εμφανίσεις του (έλεγχοι ισότητας{' '}
            <InlineMath>{'O(1)'}</InlineMath>). Αν κάποιο ξεπερνά το{' '}
            <InlineMath>{'n/2'}</InlineMath>, αυτό είναι το πλειοψηφικό· αλλιώς
            δεν υπάρχει.
          </li>
        </ul>
        <p>
          <strong>Ορθότητα.</strong> Από την παρατήρηση, αν υπάρχει πλειοψηφικό
          στοιχείο, εμφανίζεται ως υποψήφιο σε ένα τουλάχιστον μισό, άρα το
          εξετάζουμε στο βήμα «κυρίευε». Το τελικό μέτρημα σε όλον τον πίνακα
          επιβεβαιώνει με βεβαιότητα αν όντως ξεπερνά το{' '}
          <InlineMath>{'n/2'}</InlineMath> — άρα δεν δίνουμε ποτέ λάθος απάντηση.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Δύο αναδρομικές κλήσεις στο μισό, και{' '}
          <InlineMath>{'O(n)'}</InlineMath> δουλειά για το μέτρημα:
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + O(n) \\;\\Rightarrow\\; T(n) = O(n\\log n)'}</BlockMath>
        <p>
          (Master Theorem, Περίπτωση 2 — η ίδια αναδρομή με τη συγχωνευτική
          ταξινόμηση).
        </p>
      </>
    ),
  },
  {
    id: 'pt3-th3',
    title: 'Παλαιό Θέμα #3 · Θέμα 3 — Τέλειο ταίριασμα σε δέντρο',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #3',
    problemNumber: 'Θέμα 3',
    weight: 30,
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <p>
        Ένα <strong>τέλειο ταίριασμα</strong> σε ένα γράφημα είναι ένα σύνολο
        ακμών έτσι ώστε κάθε κορυφή να περιέχεται σε <strong>ακριβώς μία</strong>{' '}
        ακμή. Περίγραψε σε φυσική γλώσσα έναν <strong>άπληστο</strong> αλγόριθμο{' '}
        <strong>γραμμικού χρόνου</strong> που αποφασίζει αν ένα{' '}
        <strong>δέντρο</strong> έχει τέλειο ταίριασμα ή όχι, και αιτιολόγησε με
        1-2 προτάσεις την ορθότητά του (δηλαδή γιατί επέλεξες αυτό το κριτήριο
        άπληστης επιλογής).
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Το άπληστο κριτήριο.</strong> Κοίτα ένα{' '}
          <strong>φύλλο</strong> του δέντρου (κορυφή με έναν μόνο γείτονα). Το
          φύλλο έχει μόνο <em>μία</em> ακμή· για να καλυφθεί, αυτή η ακμή{' '}
          <strong>πρέπει</strong> να μπει στο ταίριασμα. Άρα:
        </p>
        <ul>
          <li>
            Διάλεξε ένα φύλλο <InlineMath>{'\\ell'}</InlineMath> και τον γονέα
            του <InlineMath>{'p'}</InlineMath>. Βάλε την ακμή{' '}
            <InlineMath>{'\\{\\ell, p\\}'}</InlineMath> στο ταίριασμα.
          </li>
          <li>
            <strong>Σβήσε</strong> και τις δύο κορυφές{' '}
            <InlineMath>{'\\ell, p'}</InlineMath> (και όλες τις ακμές τους) από
            το δέντρο.
          </li>
          <li>
            Επανέλαβε στο υπόλοιπο δάσος. Αν κάποια στιγμή μείνει{' '}
            <strong>απομονωμένη κορυφή χωρίς γείτονα</strong> (ή μονός αριθμός
            κορυφών), <strong>δεν</strong> υπάρχει τέλειο ταίριασμα. Αν αδειάσει
            το δέντρο, <strong>υπάρχει</strong>.
          </li>
        </ul>
        <p>
          <strong>Γιατί είναι σωστό το κριτήριο.</strong> Η επιλογή για ένα
          φύλλο είναι <strong>αναγκαστική</strong> — δεν υπάρχει καμία άλλη ακμή
          να το καλύψει, οπότε ταιριάζοντάς το με τον γονέα του{' '}
          <em>δεν θυσιάζουμε τίποτα</em>: κάθε τέλειο ταίριασμα (αν υπάρχει)
          είναι υποχρεωμένο να περιέχει ακριβώς αυτή την ακμή. Άρα ο άπληστος
          δεν κάνει ποτέ «κακή» επιλογή.
        </p>
        <p>
          <strong>Γραμμικός χρόνος.</strong> Κάθε κορυφή και κάθε ακμή
          αφαιρείται και εξετάζεται μία φορά → <InlineMath>{'O(n)'}</InlineMath>{' '}
          (μπορεί να υλοποιηθεί π.χ. με μια ουρά από τρέχοντα φύλλα).
        </p>
      </>
    ),
  },
  // ── Παλαιό Θέμα #4 — Θέμα 1 (5 προτάσεις Σωστό/Λάθος) ─────────────────
  {
    id: 'pt4-th1-q1',
    title: 'Παλαιό Θέμα #4 · Θέμα 1.1 — Σ/Λ: P ≠ NP και συντομότερο μονοπάτι',
    topic: 'intro',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 1 — Πρόταση 1',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L01-eisagogika'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν
        γνωρίζουμε ότι <InlineMath>{'P \\neq NP'}</InlineMath>, τότε το πρόβλημα
        της εύρεσης συντομότερου μονοπατιού ανάμεσα σε δύο κορυφές ενός
        γραφήματος <strong>δεν</strong> είναι πολυωνυμικά επιλύσιμο.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong>
        </p>
        <p>
          Το πρόβλημα του συντομότερου μονοπατιού <strong>λύνεται</strong> σε
          πολυωνυμικό χρόνο — το ξέρουμε καλά: BFS για γραφήματα χωρίς βάρη,
          Dijkstra σε <InlineMath>{'O(m\\log n)'}</InlineMath> για θετικά βάρη,
          Bellman-Ford σε <InlineMath>{'O(mn)'}</InlineMath> ακόμη και με
          αρνητικά βάρη. Δηλαδή ανήκει στο <InlineMath>{'P'}</InlineMath>.
        </p>
        <p>
          Η εικασία <InlineMath>{'P \\neq NP'}</InlineMath> αφορά τα{' '}
          <em>δύσκολα</em> προβλήματα (τα NP-πλήρη, όπως SAT, Hamilton, σακίδιο)
          — δεν λέει τίποτα «κακό» για τα προβλήματα που ήδη ξέρουμε να λύνουμε
          γρήγορα. Το συντομότερο μονοπάτι παραμένει στο{' '}
          <InlineMath>{'P'}</InlineMath> ανεξάρτητα από το αν{' '}
          <InlineMath>{'P = NP'}</InlineMath> ή όχι.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th1-q2',
    title: 'Παλαιό Θέμα #4 · Θέμα 1.2 — Σ/Λ: f + g = Θ(max{f, g})',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 1 — Πρόταση 2',
    weight: 4,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν{' '}
        <InlineMath>{'f(n), g(n)'}</InlineMath> είναι θετικές συναρτήσεις με{' '}
        <InlineMath>{'f(n) \\neq g(n)'}</InlineMath>, τότε{' '}
        <InlineMath>{'f(n) + g(n) = \\Theta(\\max\\{f(n), g(n)\\})'}</InlineMath>.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong>
        </p>
        <p>
          Έστω <InlineMath>{'M = \\max\\{f(n), g(n)\\}'}</InlineMath>. Θα δείξουμε
          ότι το <InlineMath>{'f + g'}</InlineMath> είναι «σφηνωμένο» ανάμεσα σε
          δύο σταθερά πολλαπλάσια του <InlineMath>{'M'}</InlineMath> — αυτός είναι
          ο ορισμός του <InlineMath>{'\\Theta'}</InlineMath>.
        </p>
        <ul>
          <li>
            <strong>Κάτω φράγμα:</strong> το άθροισμα είναι τουλάχιστον όσο ο
            μεγαλύτερος όρος: <InlineMath>{'f + g \\ge M'}</InlineMath>. (Οι
            συναρτήσεις είναι θετικές, οπότε ο άλλος όρος μόνο προσθέτει.)
          </li>
          <li>
            <strong>Άνω φράγμα:</strong> κάθε όρος είναι το πολύ{' '}
            <InlineMath>{'M'}</InlineMath>, άρα{' '}
            <InlineMath>{'f + g \\le M + M = 2M'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'M \\le f(n) + g(n) \\le 2M \\;\\Rightarrow\\; f + g = \\Theta(M).'}</BlockMath>
        <p>
          Πρόσεξε: η υπόθεση <InlineMath>{'f \\neq g'}</InlineMath> είναι{' '}
          <strong>άσχετη</strong> — η ιδιότητα ισχύει για <em>κάθε</em> ζεύγος
          θετικών συναρτήσεων. Είναι ένα «δόλωμα» που δεν αλλάζει τίποτα.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th1-q3',
    title: 'Παλαιό Θέμα #4 · Θέμα 1.3 — Σ/Λ: ο Bellman-Ford είναι άπληστος;',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 1 — Πρόταση 3',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Ο
        αλγόριθμος Bellman-Ford ανήκει στην κατηγορία των άπληστων αλγορίθμων.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong>
        </p>
        <p>
          Ο Bellman-Ford είναι αλγόριθμος <strong>δυναμικού προγραμματισμού</strong>,
          όχι άπληστος. Δες πώς δουλεύει: ορίζει υποπροβλήματα{' '}
          <InlineMath>{'\\text{OPT}(i, v)'}</InlineMath> = «συντομότερο{' '}
          <InlineMath>{'v \\to t'}</InlineMath> μονοπάτι με το πολύ{' '}
          <InlineMath>{'i'}</InlineMath> ακμές», και χτίζει τη λύση για όλο και
          μεγαλύτερα <InlineMath>{'i'}</InlineMath>, ξαναχρησιμοποιώντας
          αποθηκευμένες τιμές. Αυτό είναι η υπογραφή του DP.
        </p>
        <p>
          Ένας <em>άπληστος</em> αλγόριθμος παίρνει μία αμετάκλητη τοπική απόφαση
          σε κάθε βήμα και δεν την ξανακοιτάζει (όπως ο Dijkstra ή ο Kruskal). Ο
          Bellman-Ford, αντίθετα, «χαλαρώνει» ακμές ξανά και ξανά για{' '}
          <InlineMath>{'n - 1'}</InlineMath> γύρους — αναθεωρεί συνεχώς. Καθαρό
          δυναμικό προγραμματισμό.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th1-q4',
    title: 'Παλαιό Θέμα #4 · Θέμα 1.4 — Σ/Λ: T(n) = 2T(n−1) + Θ(n)',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 1 — Πρόταση 4',
    weight: 4,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>: «Αν{' '}
        <InlineMath>{'T(n) = 2T(n-1) + \\Theta(n)'}</InlineMath>, τότε{' '}
        <InlineMath>{'T(n) = O(n^2)'}</InlineMath>.»
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong>
        </p>
        <p>
          Η παγίδα: το <InlineMath>{'2T(n-1)'}</InlineMath> δεν είναι «διαίρει
          και κυρίευε» — δεν <em>μικραίνει</em> το πρόβλημα στο μισό, το μικραίνει
          μόνο κατά <InlineMath>{'1'}</InlineMath>, ενώ ταυτόχρονα το{' '}
          <strong>διπλασιάζει</strong>. Αυτό εκρήγνυται.
        </p>
        <p>
          Ξετυλίγουμε: σε κάθε βήμα τα υποπροβλήματα διπλασιάζονται. Μετά από{' '}
          <InlineMath>{'n'}</InlineMath> βήματα έχουμε{' '}
          <InlineMath>{'2^n'}</InlineMath> «φύλλα»:
        </p>
        <BlockMath>{'T(n) = 2T(n-1) + cn = 4T(n-2) + 2c(n-1) + cn = \\dots = 2^n\\,T(0) + (\\text{όροι}).'}</BlockMath>
        <p>
          Μόνο ο όρος <InlineMath>{'2^n T(0)'}</InlineMath> είναι ήδη{' '}
          <strong>εκθετικός</strong>. Άρα <InlineMath>{'T(n) = \\Theta(2^n)'}</InlineMath>{' '}
          — δεν φράσσεται από κανένα πολυώνυμο, πόσο μάλλον από το{' '}
          <InlineMath>{'n^2'}</InlineMath>.
        </p>
        <p>
          <strong>Διαισθητικά:</strong> «δύο αναδρομικές κλήσεις στο{' '}
          <InlineMath>{'n-1'}</InlineMath>» μοιάζει με τον αφελή Fibonacci —
          εκθετικό. Για πολυωνυμικό αποτέλεσμα θα έπρεπε να είχαμε{' '}
          <InlineMath>{'T(n/2)'}</InlineMath>, όχι <InlineMath>{'T(n-1)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th1-q5',
    title: 'Παλαιό Θέμα #4 · Θέμα 1.5 — Σ/Λ: 1 + 2 + … + n = Θ(n²)',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 1 — Πρόταση 5',
    weight: 4,
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>(Σ)ωστό</strong> ή <strong>(Λ)άθος</strong>:{' '}
        <InlineMath>{'1 + 2 + \\cdots + n = \\Theta(n^2)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong>
        </p>
        <p>
          Το άθροισμα των πρώτων <InlineMath>{'n'}</InlineMath> φυσικών έχει
          κλειστό τύπο (ο θρύλος λέει ότι τον βρήκε ο Gauss μικρός):
        </p>
        <BlockMath>{'1 + 2 + \\cdots + n = \\frac{n(n+1)}{2} = \\frac{n^2 + n}{2}.'}</BlockMath>
        <p>
          Ο κυρίαρχος όρος είναι το <InlineMath>{'n^2/2'}</InlineMath> — μια
          σταθερά επί <InlineMath>{'n^2'}</InlineMath> — άρα{' '}
          <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>Χωρίς τον τύπο:</strong> και πάλι το βλέπεις. Οι μισοί όροι
          (από τον <InlineMath>{'n/2'}</InlineMath> ως τον{' '}
          <InlineMath>{'n'}</InlineMath>) είναι ο καθένας{' '}
          <InlineMath>{'\\ge n/2'}</InlineMath>, άρα το άθροισμα είναι{' '}
          <InlineMath>{'\\ge (n/2)(n/2) = n^2/4'}</InlineMath> →{' '}
          <InlineMath>{'\\Omega(n^2)'}</InlineMath>. Και κάθε όρος είναι{' '}
          <InlineMath>{'\\le n'}</InlineMath>, άρα το άθροισμα{' '}
          <InlineMath>{'\\le n \\cdot n = n^2'}</InlineMath> →{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>. Μαζί: <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
        </p>
      </>
    ),
  },
  // ── Παλαιό Θέμα #4 — Θέματα 2–4 (ολοκλήρωση του paper) ────────────────
  {
    id: 'pt4-th2-a',
    title: 'Παλαιό Θέμα #4 · Θέμα 2α — Δίκτυο δρόμων με μη-μοναδικό ΕΕΔ',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 2α',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          Δίνεται ένα δίκτυο επαρχιακών πόλεων στο ίδιο υψόμετρο, συνδεδεμένων με
          αυτοκινητόδρομους. Εν όψει του χειμώνα, οι πόλεις θέλουν να μπορούν να
          καθαρίζουν το <strong>συντομότερο συνολικό μήκος δρόμων</strong> ώστε να
          παραμένει δυνατή η μετάβαση από κάθε πόλη σε κάθε άλλη. Το δίκτυο έχει
          5 πόλεις <InlineMath>{'A, B, C, D, E'}</InlineMath> και τους δρόμους:{' '}
          <InlineMath>{'A\\!-\\!B,\\ A\\!-\\!C,\\ A\\!-\\!E,\\ B\\!-\\!C,\\ B\\!-\\!D,\\ B\\!-\\!E,\\ C\\!-\\!D,\\ D\\!-\\!E'}</InlineMath>.
        </p>
        <p>
          <strong>(α)</strong> Δώσε κατάλληλα μήκη στους δρόμους ώστε να{' '}
          <strong>μην</strong> υπάρχει μοναδική βέλτιστη λύση, και αιτιολόγησε
          γιατί η λύση δεν είναι μοναδική.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα είναι ένα <strong>Ελάχιστο Επικαλύπτον Δέντρο (ΕΕΔ)</strong>:
          ψάχνουμε υποσύνολο δρόμων ελάχιστου συνολικού μήκους που κρατάει όλες
          τις πόλεις συνδεδεμένες.
        </p>
        <p>
          <strong>Πότε δεν είναι μοναδικό το ΕΕΔ;</strong> Όταν υπάρχει{' '}
          <strong>ισοβαθμία</strong> που δημιουργεί πραγματική επιλογή. Αν όλα τα
          βάρη είναι διαφορετικά, το ΕΕΔ είναι μοναδικό· για μη-μοναδικότητα
          χρειαζόμαστε ίσα βάρη στο σωστό σημείο.
        </p>
        <p>
          <strong>Μια καθαρή ανάθεση.</strong> Δώσε στο τρίγωνο{' '}
          <InlineMath>{'A, B, C'}</InlineMath> τρεις <strong>ίσες</strong>{' '}
          φθηνές ακμές, και στις υπόλοιπες μεγαλύτερα, διακριτά βάρη:
        </p>
        <BlockMath>{'A\\!-\\!B = A\\!-\\!C = B\\!-\\!C = 1; \\quad A\\!-\\!E = 2,\\ B\\!-\\!D = 3,\\ B\\!-\\!E = 4,\\ C\\!-\\!D = 5,\\ D\\!-\\!E = 6.'}</BlockMath>
        <p>
          <strong>Γιατί η λύση δεν είναι μοναδική.</strong> Για να συνδέσουμε τις
          <InlineMath>{'A, B, C'}</InlineMath> χρειαζόμαστε <strong>2</strong> από
          τις 3 ακμές του τριγώνου (η 3η θα έκλεινε κύκλο). Και οι τρεις έχουν
          βάρος 1 — άρα και τα τρία ζευγάρια{' '}
          <InlineMath>{'\\{A\\text{-}B, A\\text{-}C\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}B, B\\text{-}C\\}'}</InlineMath>,{' '}
          <InlineMath>{'\\{A\\text{-}C, B\\text{-}C\\}'}</InlineMath> δίνουν ίδιο
          κόστος. Από την <strong>ιδιότητα κύκλου</strong>: στον κύκλο{' '}
          <InlineMath>{'A\\text{-}B\\text{-}C'}</InlineMath> και οι τρεις ακμές
          είναι ταυτόχρονα οι «μέγιστες», οπότε η ιδιότητα δεν αποκλείει
          μοναδικά καμία → προκύπτουν <strong>3 διαφορετικά</strong> ΕΕΔ, όλα με
          το ίδιο ελάχιστο συνολικό μήκος.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th2-b',
    title: 'Παλαιό Θέμα #4 · Θέμα 2β — Εφαρμογή αλγορίθμου ΕΕΔ',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 2β',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <p>
        <strong>(β)</strong> Εφάρμοσε κατάλληλο αλγόριθμο — αναφέροντας
        υποχρεωτικά ποιος είναι — στο παραπάνω οδικό δίκτυο για να βρεις μία
        βέλτιστη λύση (με τα μήκη που έδωσες στο ερώτημα α).
      </p>
    ),
    solution: (
      <>
        <p>
          Ο κατάλληλος αλγόριθμος είναι ο <strong>αλγόριθμος του Kruskal</strong>{' '}
          (ή ισοδύναμα του Prim) για Ελάχιστο Επικαλύπτον Δέντρο.
        </p>
        <p>
          <strong>Ο Kruskal:</strong> ταξινόμησε τις ακμές σε αύξουσα σειρά
          μήκους· σάρωσέ τες με τη σειρά, προσθέτοντας κάθε ακμή στο δέντρο{' '}
          <strong>εκτός αν</strong> κλείνει κύκλο· σταμάτα όταν έχεις{' '}
          <InlineMath>{'n - 1 = 4'}</InlineMath> ακμές.
        </p>
        <p>
          Με τα μήκη του ερωτήματος (α) — ταξινομημένα:{' '}
          <InlineMath>{'A\\text{-}B(1), A\\text{-}C(1), B\\text{-}C(1), A\\text{-}E(2), B\\text{-}D(3), \\dots'}</InlineMath>:
        </p>
        <ul>
          <li><InlineMath>{'A\\text{-}B (1)'}</InlineMath>: προστίθεται.</li>
          <li><InlineMath>{'A\\text{-}C (1)'}</InlineMath>: προστίθεται.</li>
          <li>
            <InlineMath>{'B\\text{-}C (1)'}</InlineMath>: θα έκλεινε τον κύκλο{' '}
            <InlineMath>{'A\\text{-}B\\text{-}C'}</InlineMath> →{' '}
            <strong>απορρίπτεται</strong>.
          </li>
          <li><InlineMath>{'A\\text{-}E (2)'}</InlineMath>: προστίθεται.</li>
          <li><InlineMath>{'B\\text{-}D (3)'}</InlineMath>: προστίθεται — 4 ακμές, τέλος.</li>
        </ul>
        <p>
          <strong>ΕΕΔ:</strong>{' '}
          <InlineMath>{'\\{A\\text{-}B,\\ A\\text{-}C,\\ A\\text{-}E,\\ B\\text{-}D\\}'}</InlineMath>,
          συνολικό μήκος <InlineMath>{'1+1+2+3 = 7'}</InlineMath>.
        </p>
        <p>
          <strong>Η μη-μοναδικότητα φαίνεται εδώ:</strong> στο βήμα όπου
          απορρίψαμε την <InlineMath>{'B\\text{-}C'}</InlineMath>, αν ο αλγόριθμος
          είχε εξετάσει πρώτα την <InlineMath>{'B\\text{-}C'}</InlineMath> αντί
          της <InlineMath>{'A\\text{-}C'}</InlineMath> (ισόβαθμες, βάρος 1), θα
          κατέληγε σε διαφορετικό — αλλά εξίσου βέλτιστο — δέντρο.
        </p>
      </>
    ),
  },
  {
    id: 'pt4-th3',
    title: 'Παλαιό Θέμα #4 · Θέμα 3 — Πλήθος μηδενικών σε 1ᵐ0ⁿ με δυαδική αναζήτηση',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 3',
    weight: 30,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δοσμένης μιας δυαδικής συμβολοσειράς <InlineMath>{'S'}</InlineMath> της
          μορφής <InlineMath>{'1^m 0^n'}</InlineMath> (όπου τα{' '}
          <InlineMath>{'m'}</InlineMath> και <InlineMath>{'n'}</InlineMath> είναι
          άγνωστα, αλλά το <InlineMath>{'k = m + n'}</InlineMath> γνωστό),
          περίγραψε σε <strong>φυσική γλώσσα</strong> έναν αλγόριθμο που βρίσκει
          το <InlineMath>{'n'}</InlineMath> — το πλήθος των εμφανίσεων του{' '}
          <InlineMath>{'0'}</InlineMath> — σε <InlineMath>{'O(\\log k)'}</InlineMath>{' '}
          χρόνο, και δικαιολόγησε την ορθότητα και την πολυπλοκότητά του.
        </p>
        <p>
          <em>Υπόδειξη:</em> ποια αναδρομική σχέση πρέπει να διέπει την{' '}
          <InlineMath>{'T(k)'}</InlineMath> ώστε να ισχύει{' '}
          <InlineMath>{'T(k) = O(\\log k)'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η παρατήρηση-κλειδί.</strong> Η συμβολοσειρά είναι «κιόλας
          ταξινομημένη»: πρώτα όλα τα <InlineMath>{'1'}</InlineMath>, μετά όλα τα{' '}
          <InlineMath>{'0'}</InlineMath>. Υπάρχει ένα μοναδικό{' '}
          <strong>σύνορο</strong> — το σημείο όπου τελειώνουν τα{' '}
          <InlineMath>{'1'}</InlineMath> και αρχίζουν τα{' '}
          <InlineMath>{'0'}</InlineMath>. Αν βρούμε αυτό το σύνορο, βρήκαμε το{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          Δεν χρειάζεται να μετρήσουμε ένα-ένα τα <InlineMath>{'0'}</InlineMath>{' '}
          (αυτό θα ήταν <InlineMath>{'O(k)'}</InlineMath>). Επειδή η ακολουθία
          είναι ταξινομημένη, κάνουμε <strong>δυαδική αναζήτηση</strong>.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Κοίτα τον <strong>μεσαίο</strong>{' '}
          χαρακτήρα <InlineMath>{'S[\\text{mid}]'}</InlineMath>:
        </p>
        <ul>
          <li>
            Αν <InlineMath>{'S[\\text{mid}] = 1'}</InlineMath>: το σύνορο είναι{' '}
            <strong>δεξιότερα</strong> — όλα αριστερά του mid είναι{' '}
            <InlineMath>{'1'}</InlineMath>. Συνέχισε στο δεξί μισό.
          </li>
          <li>
            Αν <InlineMath>{'S[\\text{mid}] = 0'}</InlineMath>: το σύνορο είναι{' '}
            στο mid ή <strong>αριστερότερα</strong>. Συνέχισε στο αριστερό μισό.
          </li>
        </ul>
        <p>
          Συνεχίζεις μέχρι να εντοπίσεις το <strong>πρώτο</strong>{' '}
          <InlineMath>{'0'}</InlineMath>, έστω στη θέση <InlineMath>{'p'}</InlineMath>{' '}
          (μετρώντας από το 1). Τότε <InlineMath>{'m = p - 1'}</InlineMath> και{' '}
          <InlineMath>{'n = k - m = k - p + 1'}</InlineMath>.
        </p>
        <p>
          <strong>Ορθότητα.</strong> Σε κάθε βήμα η αναζήτηση κρατάει την
          ιδιότητα-αναλλοίωτη ότι «το σύνορο βρίσκεται μέσα στο τρέχον διάστημα».
          Αφού η συμβολοσειρά είναι μονότονη (<InlineMath>{'1'}</InlineMath>-μετά-<InlineMath>{'0'}</InlineMath>),
          ένας χαρακτήρας <InlineMath>{'1'}</InlineMath> σημαίνει με βεβαιότητα ότι
          το σύνορο είναι δεξιά, και ένα <InlineMath>{'0'}</InlineMath> ότι είναι
          (το πολύ) εκεί. Άρα δεν «χάνουμε» ποτέ το σύνορο.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε βήμα <strong>υποδιπλασιάζει</strong>{' '}
          το διάστημα αναζήτησης και κάνει <InlineMath>{'O(1)'}</InlineMath>{' '}
          δουλειά. Άρα η αναδρομική σχέση που ζητάει η υπόδειξη είναι
        </p>
        <BlockMath>{'T(k) = T(k/2) + O(1) \\;\\Longrightarrow\\; T(k) = O(\\log k).'}</BlockMath>
      </>
    ),
  },
  {
    id: 'pt4-th4',
    title: 'Παλαιό Θέμα #4 · Θέμα 4 — Διαφημίσεις χορηγών (Σακίδιο)',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #4',
    problemNumber: 'Θέμα 4',
    weight: 40,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>
          Στην πρώτη μέρα ενός φεστιβάλ παρουσιάζονται δύο συγκροτήματα. Από το
          τέλος της συναυλίας του πρώτου μέχρι την έναρξη του δεύτερου μεσολαβεί
          χρόνος <InlineMath>{'T'}</InlineMath>. Σε αυτό το διάστημα η
          διοργανώτρια εταιρεία θα προβάλει διαφημίσεις χορηγών (χωρίς
          επαναλήψεις). Έχουν καταθέσει προτάσεις <InlineMath>{'n'}</InlineMath>{' '}
          εταιρείες· η διαφήμιση <InlineMath>{'i'}</InlineMath> έχει διάρκεια{' '}
          <InlineMath>{'t_i'}</InlineMath> και αποφέρει κέρδος{' '}
          <InlineMath>{'p_i'}</InlineMath> (όλα θετικοί ακέραιοι). Ορίζουμε{' '}
          <InlineMath>{'\\text{OPT}(i, t)'}</InlineMath> = το μέγιστο κέρδος από
          τις διαφημίσεις <InlineMath>{'1, \\dots, i'}</InlineMath> με συνολική
          διάρκεια το πολύ <InlineMath>{'t'}</InlineMath>.
        </p>
        <p>
          (α) Ποια τιμή δίνει το μέγιστο κέρδος; (β) Γράψε τον αναδρομικό τύπο
          του <InlineMath>{'\\text{OPT}(i,t)'}</InlineMath>. (γ) Χρονική
          πολυπλοκότητα του υπολογισμού όλων των υποπροβλημάτων — αιτιολόγησε.
          (δ) Πολυπλοκότητα για τον <em>εντοπισμό</em> των διαφημίσεων που
          δίνουν το μέγιστο κέρδος. (ε) Σε ποιο γνωστό πρόβλημα αντιστοιχεί αν
          επιπλέον κάθε διαφήμιση πρέπει να προβληθεί σε σταθερό διάστημα{' '}
          <InlineMath>{'[s_i, s_i + t_i]'}</InlineMath> εντός του{' '}
          <InlineMath>{'[0, T]'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτό είναι ακριβώς το <strong>πρόβλημα του Σακιδίου (Knapsack)</strong>:
          «διάρκεια» <InlineMath>{'t_i'}</InlineMath> = βάρος αντικειμένου,
          «κέρδος» <InlineMath>{'p_i'}</InlineMath> = αξία, και ο διαθέσιμος
          χρόνος <InlineMath>{'T'}</InlineMath> = χωρητικότητα σακιδίου.
        </p>
        <p>
          <strong>(α)</strong> Θέλουμε το μέγιστο κέρδος έχοντας στη διάθεσή μας{' '}
          <em>όλες</em> τις <InlineMath>{'n'}</InlineMath> διαφημίσεις και
          ολόκληρο τον χρόνο <InlineMath>{'T'}</InlineMath>. Άρα η ζητούμενη τιμή
          είναι <strong><InlineMath>{'\\text{OPT}(n, T)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(β)</strong> Κοιτάμε τη διαφήμιση <InlineMath>{'i'}</InlineMath>{' '}
          — μέσα ή έξω; Αν δεν χωράει (<InlineMath>{'t_i > t'}</InlineMath>) είναι
          αναγκαστικά έξω. Αλλιώς παίρνουμε το καλύτερο από «έξω» και «μέσα»:
        </p>
        <BlockMath>{'\\text{OPT}(i,t) = \\begin{cases} 0 & i = 0 \\\\ \\text{OPT}(i-1,t) & t_i > t \\\\ \\max\\{\\, \\text{OPT}(i-1,t),\\ \\ p_i + \\text{OPT}(i-1,\\,t - t_i) \\,\\} & \\text{αλλιώς} \\end{cases}'}</BlockMath>
        <p>
          <strong>(γ)</strong> Ο πίνακας έχει <InlineMath>{'n \\cdot T'}</InlineMath>{' '}
          κελιά και κάθε κελί υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath>{' '}
          (ένα <InlineMath>{'\\max'}</InlineMath>). Άρα{' '}
          <strong><InlineMath>{'\\Theta(nT)'}</InlineMath></strong>. Προσοχή:
          αυτό είναι <strong>ψευδοπολυωνυμικό</strong> — το{' '}
          <InlineMath>{'T'}</InlineMath> είναι ένας αριθμός, που γράφεται με{' '}
          <InlineMath>{'\\log T'}</InlineMath> δυφία, οπότε το{' '}
          <InlineMath>{'nT'}</InlineMath> είναι εκθετικό ως προς το μέγεθος της
          εισόδου.
        </p>
        <p>
          <strong>(δ)</strong> Έχοντας έτοιμο τον πίνακα, εντοπίζουμε{' '}
          <em>ποιες</em> διαφημίσεις επιλέχθηκαν με ένα πέρασμα προς τα πίσω:
          ξεκινάμε από το <InlineMath>{'\\text{OPT}(n,T)'}</InlineMath> και σε
          κάθε <InlineMath>{'i'}</InlineMath> ρωτάμε «κέρδισε το “μέσα” ή το
          “έξω”;» — μία σύγκριση <InlineMath>{'O(1)'}</InlineMath>, μετά πάμε στο{' '}
          <InlineMath>{'i-1'}</InlineMath>. Συνολικά{' '}
          <strong><InlineMath>{'O(n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(ε)</strong> Αν επιπλέον κάθε διαφήμιση έχει{' '}
          <strong>καθορισμένο</strong> χρονικό παράθυρο{' '}
          <InlineMath>{'[s_i, s_i + t_i]'}</InlineMath>, δεν επιλέγουμε πια απλώς
          «πόσος χρόνος» — επιλέγουμε <em>μη-επικαλυπτόμενα διαστήματα</em>{' '}
          μέγιστου κέρδους. Αυτό είναι ο{' '}
          <strong>Σταθμισμένος Χρονοπρογραμματισμός Διαστημάτων</strong>{' '}
          (weighted interval scheduling).
        </p>
      </>
    ),
  },
  // ── Φροντιστηριακά Σετ — μεταγραμμένες ασκήσεις ───────────────────────
  {
    id: 'front-set-1-ask0',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 0 — Σ/Λ ασυμπτωτικού συμβολισμού',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #1',
    problemNumber: 'Άσκηση 0',
    difficulty: 'easy',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Χαρακτήρισε <strong>Σωστό / Λάθος</strong>:{' '}
        <InlineMath>{'n\\log n + 4n^3 + 2^{\\log n} = O(2^n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong> Δουλεύουμε σε δύο βήματα: πρώτα{' '}
          <em>απλοποιούμε</em> την αριστερή πλευρά, μετά συγκρίνουμε.
        </p>
        <p>
          <strong>Βήμα 1 — ο ύποπτος όρος.</strong> Το{' '}
          <InlineMath>{'2^{\\log n}'}</InlineMath> φαίνεται εκθετικό, αλλά δεν
          είναι: <InlineMath>{'2^{\\log_2 n} = n'}</InlineMath> (το{' '}
          <InlineMath>{'2'}</InlineMath> και ο <InlineMath>{'\\log_2'}</InlineMath>{' '}
          αλληλοαναιρούνται). Άρα η παράσταση είναι{' '}
          <InlineMath>{'n\\log n + 4n^3 + n'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 2 — ο κυρίαρχος όρος.</strong> Από τα τρία,{' '}
          <InlineMath>{'n\\log n,\\ 4n^3,\\ n'}</InlineMath>, το{' '}
          <InlineMath>{'4n^3'}</InlineMath> μεγαλώνει πιο γρήγορα. Ένα άθροισμα
          είναι πάντα <InlineMath>{'\\Theta'}</InlineMath> του μεγαλύτερου όρου
          του, άρα όλη η παράσταση είναι <InlineMath>{'\\Theta(n^3)'}</InlineMath>.
        </p>
        <p>
          <strong>Βήμα 3 — η σύγκριση.</strong> Είναι{' '}
          <InlineMath>{'n^3 = O(2^n)'}</InlineMath>; Ναι — κάθε πολυώνυμο
          «χάνει» από κάθε εκθετική συνάρτηση. Άρα{' '}
          <InlineMath>{'\\Theta(n^3) = O(2^n)'}</InlineMath>, και η πρόταση είναι{' '}
          <strong>σωστή</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask2',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 2 — Σ/Λ για αθροίσματα',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Χαρακτήρισε κάθε πρόταση <strong>Σωστό / Λάθος</strong>:</p>
        <p>
          (α) <InlineMath>{'\\sum_{k=1}^{n} \\tfrac{1}{k} = \\Theta(\\log n)'}</InlineMath>{' '}
          · (β) <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> · (γ){' '}
          <InlineMath>{'2^n = \\Theta\\!\\left(\\sum_{k=0}^{n} \\binom{n}{k}\\right)'}</InlineMath>{' '}
          · (δ) <InlineMath>{'\\log(\\log n) = \\Theta(\\log(\\log n))'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) ΣΩΣΤΟ.</strong> Το{' '}
          <InlineMath>{'\\sum_{k=1}^n 1/k'}</InlineMath> είναι ο{' '}
          <em>αρμονικός αριθμός</em> <InlineMath>{'H_n'}</InlineMath>. Μια
          γνωστή — και πολύ χρήσιμη — ταυτότητα είναι{' '}
          <InlineMath>{'H_n \\approx \\ln n + \\gamma'}</InlineMath>, άρα{' '}
          <InlineMath>{'H_n = \\Theta(\\log n)'}</InlineMath>. (Διαισθητικά: τον
          φράσσεις με ολοκλήρωμα του <InlineMath>{'1/x'}</InlineMath>, που δίνει
          λογάριθμο.)
        </p>
        <p>
          <strong>(β) ΣΩΣΤΟ.</strong> Από την προσέγγιση Stirling,{' '}
          <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>. Γρήγορη
          διαίσθηση: <InlineMath>{'\\log(n!) = \\sum_{k=1}^n \\log k'}</InlineMath>,
          και οι μισοί όροι είναι <InlineMath>{'\\ge \\log(n/2)'}</InlineMath>,
          δίνοντας κάτω φράγμα <InlineMath>{'\\Omega(n\\log n)'}</InlineMath>· το
          άνω <InlineMath>{'O(n\\log n)'}</InlineMath> είναι προφανές αφού κάθε
          όρος είναι <InlineMath>{'\\le \\log n'}</InlineMath>.
        </p>
        <p>
          <strong>(γ) ΣΩΣΤΟ.</strong> Εδώ δεν χρειάζεται καν ασυμπτωτική —
          ισχύει <em>ισότητα</em>. Το διωνυμικό θεώρημα λέει{' '}
          <InlineMath>{'\\sum_{k=0}^{n} \\binom{n}{k} = 2^n'}</InlineMath>{' '}
          ακριβώς. Άρα <InlineMath>{'2^n = \\Theta(2^n)'}</InlineMath> —
          τετριμμένα σωστό.
        </p>
        <p>
          <strong>(δ) ΣΩΣΤΟ.</strong> Κάθε συνάρτηση είναι{' '}
          <InlineMath>{'\\Theta'}</InlineMath> του εαυτού της — το{' '}
          <InlineMath>{'\\Theta'}</InlineMath> είναι ανακλαστικό. Είναι μια
          «δωρεάν» πρόταση που ελέγχει αν προσέχεις: η δεξιά και η αριστερή
          πλευρά είναι πανομοιότυπες.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask0',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 0 — Διάταξη συναρτήσεων κατά ρυθμό αύξησης',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 0',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Διάταξε κάθε ομάδα συναρτήσεων σε <strong>αύξουσα</strong> σειρά ρυθμού αύξησης.</p>
        <p>
          <strong>Ομάδα b:</strong>{' '}
          <InlineMath>{'b_1 = 2^n,\\ \\ b_2 = 4002^{\\,2^n},\\ \\ b_3 = 2^{\\,4002^n},\\ \\ b_4 = 4002^{4002},\\ \\ b_5 = 4002^{\\,n^2}'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα f:</strong>{' '}
          <InlineMath>{'f_1 = n^{n+4} + n!,\\ \\ f_2 = n^{7\\sqrt{n}},\\ \\ f_3 = 4^{3n\\log n},\\ \\ f_4 = 7^{n^2},\\ \\ f_5 = n^{12 + 1/n}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Όταν οι συναρτήσεις είναι «εκθετικοί πύργοι», το εργαλείο είναι ο{' '}
          <strong>λογάριθμος</strong>: συγκρίνουμε τους λογαρίθμους τους, που
          είναι πιο εύκολο, και η σειρά διατηρείται.
        </p>
        <p>
          <strong>Ομάδα b.</strong> Το <InlineMath>{'b_4 = 4002^{4002}'}</InlineMath>{' '}
          δεν εξαρτάται από το <InlineMath>{'n'}</InlineMath> — είναι{' '}
          <strong>σταθερά</strong>, <InlineMath>{'O(1)'}</InlineMath>, το
          μικρότερο. Για τα υπόλοιπα παίρνουμε λογάριθμο:
        </p>
        <BlockMath>{'\\log b_1 = n,\\quad \\log b_5 \\approx 12n^2,\\quad \\log b_2 \\approx 12\\cdot 2^n,\\quad \\log b_3 = 4002^{\\,n}.'}</BlockMath>
        <p>
          Συγκρίνοντας: <InlineMath>{'n < 12n^2 < 12\\cdot 2^n < 4002^n'}</InlineMath>.
          Άρα <strong><InlineMath>{'b_4 < b_1 < b_5 < b_2 < b_3'}</InlineMath></strong>.
        </p>
        <p>
          <strong>Ομάδα f.</strong> Ξανά με λογαρίθμους:{' '}
          <InlineMath>{'\\log f_5 = \\Theta(\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_2 = \\Theta(\\sqrt{n}\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_1 = \\Theta(n\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_3 = \\Theta(n\\log n)'}</InlineMath>,{' '}
          <InlineMath>{'\\log f_4 = \\Theta(n^2)'}</InlineMath>.
        </p>
        <p>
          Τα <InlineMath>{'f_1, f_3'}</InlineMath> πέφτουν στην ίδια κλάση{' '}
          (<InlineMath>{'n\\log n'}</InlineMath>) — χρειάζεται πιο λεπτή
          σύγκριση. Γράφουμε{' '}
          <InlineMath>{'f_3 = 4^{3n\\log n} = (n^{\\log 4})^{3n} = (n^2)^{3n} = n^{6n}'}</InlineMath>,
          ενώ <InlineMath>{'f_1 \\approx n^{n+4}'}</InlineMath>. Άρα{' '}
          <InlineMath>{'f_1 < f_3'}</InlineMath>. Τελική σειρά:{' '}
          <strong><InlineMath>{'f_5 < f_2 < f_1 < f_3 < f_4'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask1',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 1 — Αναμενόμενος χρόνος Σειριακής Αναζήτησης',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Υπολόγισε τον <strong>αναμενόμενο</strong> χρόνο εκτέλεσης μίας
          Σειριακής (γραμμικής) Αναζήτησης σε <InlineMath>{'n'}</InlineMath>{' '}
          διακριτά στοιχεία, όταν η πιθανότητα <InlineMath>{'p_i'}</InlineMath> να
          βρίσκεται το ζητούμενο στη θέση <InlineMath>{'i'}</InlineMath> είναι:
        </p>
        <ul>
          <li>θέσεις <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'n/2'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/n'}</InlineMath>·</li>
          <li>θέσεις <InlineMath>{'n/2+1'}</InlineMath> έως <InlineMath>{'n-2'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/(2(n-4))'}</InlineMath>·</li>
          <li>θέσεις <InlineMath>{'n-1'}</InlineMath> και <InlineMath>{'n'}</InlineMath>: η καθεμία με πιθανότητα <InlineMath>{'1/8'}</InlineMath>·</li>
          <li>«δεν βρέθηκε»: με την υπόλοιπη πιθανότητα <InlineMath>{'1 - \\sum p_i'}</InlineMath>.</li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Η βασική ιδέα.</strong> «Αναμενόμενος χρόνος» σημαίνει{' '}
          <strong>σταθμισμένος μέσος όρος</strong>: για κάθε δυνατή έκβαση,
          πολλαπλασιάζουμε την πιθανότητά της επί το κόστος της, και τα
          προσθέτουμε όλα.
        </p>
        <p>
          Στη σειριακή αναζήτηση, για να βρεις το στοιχείο της θέσης{' '}
          <InlineMath>{'i'}</InlineMath> κάνεις <InlineMath>{'i'}</InlineMath>{' '}
          συγκρίσεις (τις ελέγχεις μία-μία από την αρχή). Αν δεν βρεθεί,
          ελέγχεις και τις <InlineMath>{'n'}</InlineMath> θέσεις. Άρα:
        </p>
        <BlockMath>{'E[T] = \\sum_{i=1}^{n} p_i \\cdot i \\;+\\; p_{\\text{δεν βρέθηκε}} \\cdot (n{+}1).'}</BlockMath>
        <p>
          <strong>Πάνω φράγμα.</strong> Κάθε κόστος είναι το πολύ{' '}
          <InlineMath>{'n+1'}</InlineMath>, και οι πιθανότητες αθροίζουν σε{' '}
          <InlineMath>{'1'}</InlineMath>. Άρα{' '}
          <InlineMath>{'E[T] \\le (n+1)\\sum p = n+1 = O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>Κάτω φράγμα.</strong> Κοίτα μόνο τις θέσεις{' '}
          <InlineMath>{'n-1'}</InlineMath> και <InlineMath>{'n'}</InlineMath>:
          έχουν συνολική πιθανότητα <InlineMath>{'1/8 + 1/8 = 1/4'}</InlineMath>{' '}
          και κόστος <InlineMath>{'\\ge n-1'}</InlineMath>. Μόνο αυτές
          συνεισφέρουν <InlineMath>{'\\ge \\tfrac14 (n-1) = \\Omega(n)'}</InlineMath>.
        </p>
        <p>
          Αφού <InlineMath>{'E[T]'}</InlineMath> είναι ταυτόχρονα{' '}
          <InlineMath>{'O(n)'}</InlineMath> και <InlineMath>{'\\Omega(n)'}</InlineMath>,
          ο αναμενόμενος χρόνος είναι <strong><InlineMath>{'\\Theta(n)'}</InlineMath></strong>.
          Παρά την «τρομακτική» κατανομή, η σειριακή αναζήτηση μένει γραμμική
          κατά μέσο όρο.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask3',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 3 — Σ/Λ: συνεπαγωγές ασυμπτωτικών',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Χαρακτήρισε <strong>Σωστό / Λάθος</strong>:</p>
        <p>
          (α) <InlineMath>{'f(n) = O(g(n)) \\;\\Rightarrow\\; 2^{f(n)} = O(2^{g(n)})'}</InlineMath>{' '}
          · (β) <InlineMath>{'g(n) = \\sum_{k=1}^{n} \\sqrt[k]{k} = \\Theta(n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) ΛΑΘΟΣ.</strong> Η ερώτηση ζητάει αν η συνεπαγωγή ισχύει
          για <em>κάθε</em> <InlineMath>{'f, g'}</InlineMath> — οπότε ένα{' '}
          αντιπαράδειγμα την καταρρίπτει.
        </p>
        <p>
          Πάρε <InlineMath>{'f(n) = 2n'}</InlineMath> και{' '}
          <InlineMath>{'g(n) = n'}</InlineMath>. Είναι{' '}
          <InlineMath>{'f = O(g)'}</InlineMath> ✓ (δύο πολυώνυμα ίδιου βαθμού).
          Όμως <InlineMath>{'2^{f} = 2^{2n} = 4^n'}</InlineMath> ενώ{' '}
          <InlineMath>{'2^{g} = 2^n'}</InlineMath> — και το{' '}
          <InlineMath>{'4^n'}</InlineMath> <strong>δεν</strong> είναι{' '}
          <InlineMath>{'O(2^n)'}</InlineMath> (ο λόγος{' '}
          <InlineMath>{'4^n/2^n = 2^n \\to \\infty'}</InlineMath>). Η εκθετικοποίηση
          «μεγεθύνει» τη σταθερά του εκθέτη — δεν διατηρεί το <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>(β) ΣΩΣΤΟ.</strong> Κάθε όρος <InlineMath>{'\\sqrt[k]{k} = k^{1/k}'}</InlineMath>{' '}
          είναι «σφηνωμένος» ανάμεσα στο <InlineMath>{'1'}</InlineMath> και στο{' '}
          <InlineMath>{'2'}</InlineMath>: για <InlineMath>{'k \\ge 1'}</InlineMath>{' '}
          ισχύει <InlineMath>{'1 \\le k^{1/k} \\le 2'}</InlineMath> (το άνω φράγμα
          γιατί <InlineMath>{'k \\le 2^k'}</InlineMath>, άρα{' '}
          <InlineMath>{'k^{1/k} \\le 2'}</InlineMath>).
        </p>
        <p>
          Άρα το άθροισμα <InlineMath>{'n'}</InlineMath> τέτοιων όρων είναι
          ανάμεσα σε <InlineMath>{'n\\cdot 1 = n'}</InlineMath> και{' '}
          <InlineMath>{'n\\cdot 2 = 2n'}</InlineMath> — δηλαδή{' '}
          <InlineMath>{'g(n) = \\Theta(n)'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask5',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 5 — Τρεις ασυμπτωτικές κατατάξεις',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 5',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Για καθεμία απάντησε ποια σχέση ισχύει:</p>
        <p>
          (α) Η <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> είναι{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>, <InlineMath>{'o(n)'}</InlineMath>{' '}
          ή <InlineMath>{'\\omega(n)'}</InlineMath>; (β) Η{' '}
          <InlineMath>{'f(n) = n^2 2^n / 5^n'}</InlineMath> είναι{' '}
          <InlineMath>{'\\Theta(1)'}</InlineMath>, <InlineMath>{'o(1)'}</InlineMath>{' '}
          ή <InlineMath>{'\\omega(1)'}</InlineMath>;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α)</strong> Συγκρίνουμε την{' '}
          <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> με την{' '}
          <InlineMath>{'n'}</InlineMath>. Κόλπο: γράψε και τις δύο ως δύναμη του{' '}
          <InlineMath>{'2'}</InlineMath>. Είναι{' '}
          <InlineMath>{'n = 2^{\\log n}'}</InlineMath>. Άρα συγκρίνουμε τους
          εκθέτες: <InlineMath>{'\\sqrt{\\log n}'}</InlineMath> έναντι{' '}
          <InlineMath>{'\\log n'}</InlineMath>.
        </p>
        <p>
          Η ρίζα ενός μεγάλου αριθμού είναι πολύ μικρότερη από τον ίδιο τον
          αριθμό: <InlineMath>{'\\sqrt{\\log n} \\ll \\log n'}</InlineMath>. Άρα
          ο εκθέτης της <InlineMath>{'g'}</InlineMath> είναι πολύ μικρότερος, και{' '}
          <strong><InlineMath>{'g(n) = o(n)'}</InlineMath></strong>.
        </p>
        <p>
          <strong>(β)</strong> Ξαναγράφουμε:{' '}
          <InlineMath>{'f(n) = n^2 \\cdot \\dfrac{2^n}{5^n} = n^2 \\left(\\tfrac{2}{5}\\right)^n'}</InlineMath>.
          Το <InlineMath>{'(2/5)^n'}</InlineMath> έχει βάση{' '}
          <InlineMath>{'< 1'}</InlineMath>, άρα <strong>μηδενίζεται εκθετικά</strong> —
          και η εκθετική κατάρρευση «νικάει» εύκολα τον πολυωνυμικό όρο{' '}
          <InlineMath>{'n^2'}</InlineMath>. Συνεπώς{' '}
          <InlineMath>{'f(n) \\to 0'}</InlineMath>, δηλαδή{' '}
          <strong><InlineMath>{'f(n) = o(1)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask6',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 6 — Πολυπλοκότητα εμφωλευμένων βρόχων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 6',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Υπολόγισε τη χρονική πολυπλοκότητα του παρακάτω αλγορίθμου:</p>
        <pre><code>{`Algorithm 1:
  arg ← -1
  για i ← 1 έως 2n  (βήμα 1):
    για j ← i έως i²  (βήμα 1):
      arg ← CALC(j)

procedure CALC(w):
  res ← 0
  για i ← 1 έως √w  (βήμα 0.1):
    res ← res + log(i)
  return res`}</code></pre>
      </>
    ),
    solution: (
      <>
        <p>
          Δουλεύουμε <strong>από μέσα προς τα έξω</strong> — πρώτα η{' '}
          <InlineMath>{'\\text{CALC}'}</InlineMath>, μετά οι δύο βρόχοι.
        </p>
        <p>
          <strong>Η <InlineMath>{'\\text{CALC}(w)'}</InlineMath>.</strong> Ο
          βρόχος της πάει από <InlineMath>{'1'}</InlineMath> έως{' '}
          <InlineMath>{'\\sqrt{w}'}</InlineMath> με βήμα{' '}
          <InlineMath>{'0.1'}</InlineMath> — άρα κάνει{' '}
          <InlineMath>{'\\sqrt{w}/0.1 = 10\\sqrt{w}'}</InlineMath> επαναλήψεις. Το
          βήμα <InlineMath>{'0.1'}</InlineMath> είναι απλώς μια σταθερά· η{' '}
          <InlineMath>{'\\text{CALC}(w) = \\Theta(\\sqrt{w})'}</InlineMath>.
        </p>
        <p>
          <strong>Ο εσωτερικός βρόχος</strong> (για δεδομένο{' '}
          <InlineMath>{'i'}</InlineMath>): το <InlineMath>{'j'}</InlineMath>{' '}
          πάει από <InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'i^2'}</InlineMath> — περίπου <InlineMath>{'i^2'}</InlineMath>{' '}
          επαναλήψεις. Κάθε μία καλεί <InlineMath>{'\\text{CALC}(j)'}</InlineMath>{' '}
          με <InlineMath>{'j'}</InlineMath> το πολύ <InlineMath>{'i^2'}</InlineMath>,
          άρα κόστος το πολύ <InlineMath>{'\\Theta(\\sqrt{i^2}) = \\Theta(i)'}</InlineMath>.
          Συνολικά ο εσωτερικός βρόχος:{' '}
          <InlineMath>{'\\Theta(i^2) \\cdot \\Theta(i) = \\Theta(i^3)'}</InlineMath>.
        </p>
        <p>
          <strong>Ο εξωτερικός βρόχος:</strong> αθροίζουμε για{' '}
          <InlineMath>{'i = 1'}</InlineMath> έως <InlineMath>{'2n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\sum_{i=1}^{2n} \\Theta(i^3) = \\Theta\\!\\big((2n)^4\\big) = \\Theta(n^4).'}</BlockMath>
        <p>
          (Χρησιμοποιήσαμε <InlineMath>{'\\sum_{i=1}^{m} i^3 = \\Theta(m^4)'}</InlineMath>.)
          Η συνολική πολυπλοκότητα είναι{' '}
          <strong><InlineMath>{'\\Theta(n^4)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-2-ask7',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 7 — Πίνακας ασυμπτωτικών σχέσεων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Για κάθε ζεύγος συναρτήσεων <InlineMath>{'A, B'}</InlineMath>{' '}
          παρακάτω, ποιες σχέσεις ισχύουν (<InlineMath>{'A'}</InlineMath> ως προς{' '}
          <InlineMath>{'B'}</InlineMath>): <InlineMath>{'O,\\ o,\\ \\Omega,\\ \\omega,\\ \\Theta'}</InlineMath>;
          (Σταθερές: <InlineMath>{'k,\\ e,\\ c > 1'}</InlineMath>.)
        </p>
        <p>
          1) <InlineMath>{'\\log^k n'}</InlineMath> vs <InlineMath>{'n^e'}</InlineMath>{' '}
          · 2) <InlineMath>{'n^k'}</InlineMath> vs <InlineMath>{'c^n'}</InlineMath>{' '}
          · 3) <InlineMath>{'\\sqrt{n}'}</InlineMath> vs{' '}
          <InlineMath>{'n^{\\sin n}'}</InlineMath> · 4){' '}
          <InlineMath>{'2^n'}</InlineMath> vs <InlineMath>{'2^{n/2}'}</InlineMath>{' '}
          · 5) <InlineMath>{'n^{\\log c}'}</InlineMath> vs{' '}
          <InlineMath>{'c^{\\log n}'}</InlineMath> · 6){' '}
          <InlineMath>{'\\log(n!)'}</InlineMath> vs <InlineMath>{'\\log(n^n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <table>
          <thead>
            <tr><th>A vs B</th><th>O</th><th>o</th><th>Ω</th><th>ω</th><th>Θ</th></tr>
          </thead>
          <tbody>
            <tr><td>1) logᵏn vs nᵉ</td><td>Ναι</td><td>Ναι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>2) nᵏ vs cⁿ</td><td>Ναι</td><td>Ναι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>3) √n vs n^sin n</td><td>Όχι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td><td>Όχι</td></tr>
            <tr><td>4) 2ⁿ vs 2^(n/2)</td><td>Όχι</td><td>Όχι</td><td>Ναι</td><td>Ναι</td><td>Όχι</td></tr>
            <tr><td>5) n^log c vs c^log n</td><td>Ναι</td><td>Όχι</td><td>Ναι</td><td>Όχι</td><td>Ναι</td></tr>
            <tr><td>6) log(n!) vs log(nⁿ)</td><td>Ναι</td><td>Όχι</td><td>Ναι</td><td>Όχι</td><td>Ναι</td></tr>
          </tbody>
        </table>
        <p>
          <strong>1) Πολυλογάριθμος vs πολυώνυμο.</strong> Κάθε δύναμη του{' '}
          <InlineMath>{'\\log n'}</InlineMath> «χάνει» από οποιαδήποτε θετική
          δύναμη του <InlineMath>{'n'}</InlineMath>: <InlineMath>{'\\log^k n = o(n^e)'}</InlineMath>{' '}
          (το επιβεβαιώνεις με <InlineMath>{'k'}</InlineMath> εφαρμογές του
          κανόνα L'Hôpital). Το <InlineMath>{'o'}</InlineMath> δίνει και{' '}
          <InlineMath>{'O'}</InlineMath>.
        </p>
        <p>
          <strong>2) Πολυώνυμο vs εκθετικό.</strong> Όμοια,{' '}
          <InlineMath>{'n^k = o(c^n)'}</InlineMath> — το εκθετικό κερδίζει πάντα.
        </p>
        <p>
          <strong>3) Η παγίδα.</strong> Ο εκθέτης{' '}
          <InlineMath>{'\\sin n'}</InlineMath> <em>ταλαντώνεται</em> ανάμεσα σε{' '}
          <InlineMath>{'-1'}</InlineMath> και <InlineMath>{'1'}</InlineMath>, οπότε
          η <InlineMath>{'n^{\\sin n}'}</InlineMath> πότε είναι πάνω και πότε
          κάτω από την <InlineMath>{'\\sqrt{n} = n^{0.5}'}</InlineMath>. Καμία
          σχέση δεν ισχύει σταθερά → <strong>μη-συγκρίσιμες</strong>.
        </p>
        <p>
          <strong>4)</strong> <InlineMath>{'2^n = (2^{n/2})^2'}</InlineMath> —
          το <InlineMath>{'2^n'}</InlineMath> είναι το τετράγωνο του{' '}
          <InlineMath>{'2^{n/2}'}</InlineMath>, άρα αυστηρά μεγαλύτερο:{' '}
          <InlineMath>{'2^n = \\omega(2^{n/2})'}</InlineMath> (και{' '}
          <InlineMath>{'\\Omega'}</InlineMath>).
        </p>
        <p>
          <strong>5) Ταυτότητα!</strong> Ισχύει{' '}
          <InlineMath>{'c^{\\log n} = n^{\\log c}'}</InlineMath> (παίρνοντας
          λογάριθμο, και οι δύο δίνουν <InlineMath>{'\\log c \\cdot \\log n'}</InlineMath>).
          Είναι <strong>ίσες</strong> → <InlineMath>{'\\Theta'}</InlineMath> (και{' '}
          <InlineMath>{'O, \\Omega'}</InlineMath>).
        </p>
        <p>
          <strong>6)</strong> <InlineMath>{'\\log(n^n) = n\\log n'}</InlineMath>,
          και <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> (Stirling).
          Ίδια τάξη → <InlineMath>{'\\Theta'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-3-ask4',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 4 — Αναδρομή T(n) = T(n−1) + 2ⁿ',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική σχέση <InlineMath>{'T(n) = T(n-1) + 2^n'}</InlineMath>{' '}
        με αρχική συνθήκη <InlineMath>{'T(0) = 5'}</InlineMath>, και δώσε την
        ασυμπτωτική της τάξη.
      </p>
    ),
    solution: (
      <>
        <p>
          Εδώ δεν εφαρμόζεται το Master Theorem (το πρόβλημα μικραίνει κατά{' '}
          <InlineMath>{'1'}</InlineMath>, όχι με διαίρεση). Χρησιμοποιούμε τη{' '}
          μέθοδο της <strong>τηλεσκόπησης</strong>: γράφουμε τη σχέση για
          διαδοχικά <InlineMath>{'n'}</InlineMath> και προσθέτουμε.
        </p>
        <BlockMath>{'\\begin{aligned} T(1) - T(0) &= 2^1 \\\\ T(2) - T(1) &= 2^2 \\\\ &\\;\\;\\vdots \\\\ T(n) - T(n-1) &= 2^n \\end{aligned}'}</BlockMath>
        <p>
          Προσθέτοντας <strong>κατά μέλη</strong>, όλοι οι ενδιάμεσοι όροι στην
          αριστερή στήλη αλληλοαναιρούνται (τηλεσκόπηση) και μένει:
        </p>
        <BlockMath>{'T(n) - T(0) = \\sum_{i=1}^{n} 2^i = 2^{n+1} - 2.'}</BlockMath>
        <p>
          (Το <InlineMath>{'\\sum_{i=1}^n 2^i = 2^{n+1}-2'}</InlineMath> είναι
          γεωμετρική σειρά.) Με <InlineMath>{'T(0) = 5'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = 2^{n+1} - 2 + 5 = 2^{n+1} + 3.'}</BlockMath>
        <p>
          Τέλος, <InlineMath>{'2^{n+1} = 2 \\cdot 2^n'}</InlineMath> — σταθερά
          επί <InlineMath>{'2^n'}</InlineMath> — άρα{' '}
          <strong><InlineMath>{'T(n) = \\Theta(2^n)'}</InlineMath></strong>,
          εκθετική.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-4-ask1',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 1 — Αναδρομή T(n) = √n·T(√n) + n',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες την ασυμπτωτική τάξη της <InlineMath>{'T(n)'}</InlineMath> όταν{' '}
        <InlineMath>{'T(n) = \\sqrt{n}\\;T(\\sqrt{n}) + n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Δύσκολη αναδρομή — και ρίζα, και συντελεστής{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath> μπροστά. Το κλειδί είναι ένα
          έξυπνο κόλπο: <strong>διαιρούμε και τις δύο πλευρές με{' '}
          <InlineMath>{'n'}</InlineMath></strong>.
        </p>
        <BlockMath>{'\\frac{T(n)}{n} = \\frac{\\sqrt{n}\\;T(\\sqrt{n})}{n} + \\frac{n}{n} = \\frac{T(\\sqrt{n})}{\\sqrt{n}} + 1.'}</BlockMath>
        <p>
          Τώρα ορίζουμε μια νέα συνάρτηση{' '}
          <InlineMath>{'S(n) = T(n)/n'}</InlineMath>. Πρόσεξε ότι ο όρος{' '}
          <InlineMath>{'T(\\sqrt{n})/\\sqrt{n}'}</InlineMath> είναι ακριβώς{' '}
          <InlineMath>{'S(\\sqrt{n})'}</InlineMath>. Άρα η σχέση γίνεται απλή:
        </p>
        <BlockMath>{'S(n) = S(\\sqrt{n}) + 1.'}</BlockMath>
        <p>
          Αυτή τη λύνουμε με αλλαγή μεταβλητής <InlineMath>{'n = 2^m'}</InlineMath>:
          τότε <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath>, και με{' '}
          <InlineMath>{'R(m) = S(2^m)'}</InlineMath> παίρνουμε{' '}
          <InlineMath>{'R(m) = R(m/2) + 1'}</InlineMath> — κάθε βήμα
          υποδιπλασιάζει το <InlineMath>{'m'}</InlineMath>, άρα{' '}
          <InlineMath>{'R(m) = \\Theta(\\log m)'}</InlineMath>. Επιστρέφοντας:{' '}
          <InlineMath>{'S(n) = \\Theta(\\log m) = \\Theta(\\log\\log n)'}</InlineMath>.
        </p>
        <p>
          Τέλος, αφού <InlineMath>{'S(n) = T(n)/n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = n \\cdot S(n) = \\Theta(n \\log\\log n).'}</BlockMath>
      </>
    ),
  },
  {
    id: 'front-set-5-ask10',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 10 — Πυθαγόρεια τετράδα σε O(n²)',
    topic: 'data-structures',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 10',
    difficulty: 'hard',
    prerequisites: ['lectures/L10-data-structures'],
    statement: (
      <p>
        Μια <strong>Πυθαγόρεια τετράδα</strong> είναι ακέραιοι{' '}
        <InlineMath>{'(a, b, c, d)'}</InlineMath> με{' '}
        <InlineMath>{'d = \\sqrt{a^2 + b^2 + c^2}'}</InlineMath>, δηλαδή{' '}
        <InlineMath>{'a^2 + b^2 + c^2 = d^2'}</InlineMath>. Σχεδίασε αλγόριθμο{' '}
        <InlineMath>{'O(n^2)'}</InlineMath> που αποφασίζει αν υπάρχει Πυθαγόρεια
        τετράδα σε έναν πίνακα <InlineMath>{'n'}</InlineMath> διακριτών θετικών
        ακεραίων (επιτρέπεται η πολλαπλή χρήση ενός στοιχείου).
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η αφελής λύση.</strong> Δοκίμασε όλες τις τετράδες{' '}
          <InlineMath>{'(a,b,c,d)'}</InlineMath>: τέσσερις εμφωλευμένοι βρόχοι →{' '}
          <InlineMath>{'O(n^4)'}</InlineMath>. Πολύ αργό. Στόχος{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>Η ιδέα-κλειδί.</strong> Αναδιατάσσουμε την εξίσωση:
        </p>
        <BlockMath>{'a^2 + b^2 + c^2 = d^2 \\;\\Longleftrightarrow\\; a^2 + b^2 = d^2 - c^2.'}</BlockMath>
        <p>
          Δηλαδή ψάχνουμε ένα ζεύγος <InlineMath>{'(a,b)'}</InlineMath> και ένα
          ζεύγος <InlineMath>{'(c,d)'}</InlineMath> που να συμφωνούν σε αυτή την
          τιμή. Τα <strong>ζεύγη</strong> είναι μόνο{' '}
          <InlineMath>{'O(n^2)'}</InlineMath> — όχι οι τετράδες. Αν κάναμε
          γραμμικό ψάξιμο για κάθε ζεύγος, θα πέφταμε πάλι σε{' '}
          <InlineMath>{'O(n^4)'}</InlineMath>· γι' αυτό χρειαζόμαστε αναζήτηση{' '}
          <InlineMath>{'O(1)'}</InlineMath> — έναν <strong>πίνακα
          κατακερματισμού</strong> (hash table, από το L10).
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong>
        </p>
        <ul>
          <li>
            <strong>Φάση 1 — χτίσιμο.</strong> Για κάθε ζεύγος στοιχείων{' '}
            <InlineMath>{'(a, b)'}</InlineMath> του πίνακα ({' '}
            <InlineMath>{'O(n^2)'}</InlineMath> ζεύγη), υπολόγισε το άθροισμα{' '}
            <InlineMath>{'a^2 + b^2'}</InlineMath> και βάλ' το σε ένα{' '}
            <strong>hash set</strong> <InlineMath>{'H'}</InlineMath>. Κόστος:{' '}
            <InlineMath>{'O(n^2)'}</InlineMath> (κάθε εισαγωγή{' '}
            <InlineMath>{'O(1)'}</InlineMath> κατά μέσο όρο).
          </li>
          <li>
            <strong>Φάση 2 — ψάξιμο.</strong> Για κάθε ζεύγος{' '}
            <InlineMath>{'(c, d)'}</InlineMath> ({' '}
            <InlineMath>{'O(n^2)'}</InlineMath> ζεύγη), υπολόγισε{' '}
            <InlineMath>{'d^2 - c^2'}</InlineMath>. Αν είναι θετικό{' '}
            <strong>και</strong> υπάρχει στο <InlineMath>{'H'}</InlineMath> →{' '}
            βρήκαμε Πυθαγόρεια τετράδα, επίστρεψε «ΝΑΙ». Κάθε αναζήτηση{' '}
            <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>Αν κανένα ζεύγος δεν πετύχει, επίστρεψε «ΟΧΙ».</li>
        </ul>
        <p>
          <strong>Ορθότητα.</strong> Αν υπάρχει τετράδα με{' '}
          <InlineMath>{'a^2+b^2+c^2=d^2'}</InlineMath>, τότε το άθροισμα{' '}
          <InlineMath>{'a^2+b^2'}</InlineMath> μπήκε στο{' '}
          <InlineMath>{'H'}</InlineMath> στη Φάση 1, και το ζεύγος{' '}
          <InlineMath>{'(c,d)'}</InlineMath> θα το βρει στη Φάση 2 αφού{' '}
          <InlineMath>{'d^2-c^2 = a^2+b^2'}</InlineMath>. Η πολλαπλή χρήση
          στοιχείου επιτρέπεται, οπότε δεν χρειάζεται ειδικός χειρισμός για{' '}
          ίσα <InlineMath>{'a,b,c,d'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> <InlineMath>{'O(n^2) + O(n^2) = O(n^2)'}</InlineMath>{' '}
          (αναμενόμενος χρόνος). Ο πίνακας κατακερματισμού είναι αυτός που
          μετατρέπει το «ψάξε αν υπάρχει» από <InlineMath>{'O(n^2)'}</InlineMath>{' '}
          σε <InlineMath>{'O(1)'}</InlineMath> — χωρίς αυτόν δεν πιάναμε το{' '}
          φράγμα.
        </p>
      </>
    ),
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
