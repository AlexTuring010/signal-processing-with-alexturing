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
import { Callout } from '@/components/content/Callout'
import { ComplexityZooLab } from '@/components/viz/ComplexityZooLab'
import { AsymptoticVerdictExplorer } from '@/components/viz/AsymptoticVerdictExplorer'
import { FunctionOrderingRace } from '@/components/viz/FunctionOrderingRace'
import { LoopComplexityTrace } from '@/components/viz/LoopComplexityTrace'
import { SandwichTheoremViz } from '@/components/viz/SandwichTheoremViz'
import { ExpectedTimeBreakdown } from '@/components/viz/ExpectedTimeBreakdown'
import { ExponentiationBreaksO } from '@/components/viz/ExponentiationBreaksO'
import { RecurrenceClassifier } from '@/components/viz/RecurrenceClassifier'
import { RecurrenceSubstitution } from '@/components/viz/RecurrenceSubstitution'
import { FastExponentiation } from '@/components/viz/FastExponentiation'
import { OneZeroBinarySearch } from '@/components/viz/OneZeroBinarySearch'
import { MissingTermBinarySearch } from '@/components/viz/MissingTermBinarySearch'
import { RecurrenceTelescope } from '@/components/viz/RecurrenceTelescope'
import { CharEquationLab } from '@/components/viz/CharEquationLab'
import { InductionStepper } from '@/components/viz/InductionStepper'
import { UnequalSplitGeometric } from '@/components/viz/UnequalSplitGeometric'
import { StrengthenedGuess } from '@/components/viz/StrengthenedGuess'
import { MasterTheoremExtended } from '@/components/viz/MasterTheoremExtended'
import { DivideByNTrick } from '@/components/viz/DivideByNTrick'
import { StoogeSortViz } from '@/components/viz/StoogeSortViz'
import { BranchingContrast } from '@/components/viz/BranchingContrast'

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
  // Φροντιστηριακά σετ — υπό μεταγραφή (ανωνυμοποιημένα)
  // Τα σετ #1–#8 έχουν μεταγραφεί ανά διάλεξη· τα παρακάτω εκκρεμούν.
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'frontistirio-f10',
    title: 'Φροντιστηριακό Σετ #9 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #9',
    difficulty: 'hard',
    prerequisites: [
      'lectures/L14-dp-i',
      'lectures/L15-dp-ii',
      'lectures/L16-dp-iii',
      'lectures/L17-dp-iv',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-f11',
    title: 'Φροντιστηριακό Σετ #10 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #10',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-old-1',
    title: 'Φροντιστηριακό Σετ #11 — υπό μεταγραφή',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #11',
    difficulty: 'easy',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-old-2',
    title: 'Φροντιστηριακό Σετ #12 — υπό μεταγραφή',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #12',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
    ],
    statement: null,
    solution: null,
  },
  {
    id: 'frontistirio-old-3',
    title: 'Φροντιστηριακό Σετ #13 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #13',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L06-graphs-i',
      'lectures/L07-graphs-ii',
      'lectures/L08-graphs-iii',
    ],
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
        <p>
          Δες πώς δουλεύουν οι πέντε «κουμπιά» πάνω στις δύο σταθερές —
          ο λόγος <InlineMath>{'1/4'}</InlineMath> κάθεται μόνιμα ανάμεσα,
          αρνείται να φύγει στο 0 ή στο ∞:
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q1" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης για σταθερές.</strong> Όταν και οι δύο
          συναρτήσεις είναι θετικές σταθερές (ή απλοποιούνται σε σταθερές),
          ισχύουν αυτόματα <strong>O, Ω, Θ</strong> — και αυτόματα{' '}
          <strong>όχι o, όχι ω</strong>. Η ταυτότητα{' '}
          <InlineMath>{'\\log_n n = 1'}</InlineMath> είναι το «δόλωμα» που
          μετατρέπει το πρόβλημα σε αυτή την τετριμμένη περίπτωση.
        </Callout>
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
        <p>
          Δες το ρυθμό αύξησης πραγματικά: η <InlineMath>{'n'}</InlineMath> και η{' '}
          <InlineMath>{'n^{\\log n}'}</InlineMath> πλάι-πλάι, ο λόγος καταρρέει.
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q2" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: απλοποίησε ΠΡΙΝ συγκρίνεις.</strong> Όροι
          όπως <InlineMath>{'2^{\\log_2 n}'}</InlineMath>,{' '}
          <InlineMath>{'\\log(n^k)'}</InlineMath>, ή{' '}
          <InlineMath>{'\\log_a b'}</InlineMath> κρύβουν την πραγματική τάξη
          τους. Πρώτη κίνηση πάντα: ξεμπλέκεις τις ταυτότητες, μετά μπαίνεις
          στη σύγκριση. Εδώ <InlineMath>{'f = n'}</InlineMath> και{' '}
          <InlineMath>{'g = n^{\\log n}'}</InlineMath> — μια απλή «πολυωνυμικό
          vs υπερ-πολυωνυμικό» μάχη, αλλά μόνο αφού καθαρίσει η αριστερή πλευρά.
        </Callout>
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
        <p>
          Σύρε το <InlineMath>{'\\varphi'}</InlineMath> και κοίτα τα verdicts να
          αλλάζουν: όταν περνά τα κρίσιμα <InlineMath>{'\\varphi'}</InlineMath>{' '}
          (όπου ο εκθέτης ισούται με 2), όλα τα chips κάνουν «flip». Η εκφώνηση
          δεν εγγυάται καμία συγκεκριμένη φ — άρα καμία σχέση δεν ισχύει σίγουρα.
        </p>
        <AsymptoticVerdictExplorer preset="pt1-th1-q3" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «παράμετρος που μπορεί να πάρει κάθε τιμή»</strong> →
          αυτόματο σήμα ότι η σχέση δεν είναι μονοσήμαντη. Η{' '}
          <InlineMath>{'\\tan\\varphi'}</InlineMath> είναι το κλασικό όχημα γι' αυτό:
          διατρέχει όλο το <InlineMath>{'\\mathbb{R}'}</InlineMath> καθώς το{' '}
          <InlineMath>{'\\varphi'}</InlineMath> διατρέχει το{' '}
          <InlineMath>{'[0, 2\\pi]'}</InlineMath>. Η σωστή απάντηση είναι
          «μη-συγκρίσιμες» — όχι «δεν ξέρω».
        </Callout>
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
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'T(n) \\in o(n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'T(n) \\in O(1)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'T(n) \\in o(2^n)'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'T(n) \\in O(\\log_2 \\log_2 n)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Πρώτο σήμα: εμφανίζεται <InlineMath>{'\\sqrt{n}'}</InlineMath> στο
          όρισμα — Master Theorem δεν εφαρμόζεται κατευθείαν, χρειάζεται{' '}
          <strong>αλλαγή μεταβλητής</strong>. Το κλασικό κόλπο: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'m = \\log_2 n'}</InlineMath>. Τότε{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath> και, με{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath>, η αναδρομή γίνεται απλή:
        </p>
        <BlockMath>{'S(m) = S(m/2) + 1.'}</BlockMath>
        <p>
          Δες κάθε στάδιο της λύσης:
        </p>
        <RecurrenceSubstitution preset="pt1-th1-q4" />
        <p>
          Το ωραίο είναι ότι η νέα <InlineMath>{'S(m)'}</InlineMath> είναι αυτή
          ακριβώς της δυαδικής αναζήτησης: κάθε βήμα{' '}
          <strong>υποδιπλασιάζει</strong> το <InlineMath>{'m'}</InlineMath> και
          προσθέτει <InlineMath>{'1'}</InlineMath>· συνολικά{' '}
          <InlineMath>{'\\log_2 m'}</InlineMath> βήματα. Άρα{' '}
          <InlineMath>{'S(m) = \\Theta(\\log m)'}</InlineMath>, και
          επιστρέφοντας στο <InlineMath>{'n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log m) = \\Theta(\\log\\log n).'}</BlockMath>
        <p>
          Το <InlineMath>{'\\log\\log n'}</InlineMath> μεγαλώνει{' '}
          <strong>εξαιρετικά αργά</strong> — για{' '}
          <InlineMath>{'n = 2^{64}'}</InlineMath> είναι 6. Ελέγχουμε:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'o(n)'}</InlineMath> ✓ (πολύ μικρότερο)
          </li>
          <li>
            (ii) <InlineMath>{'O(1)'}</InlineMath> ✗ (μεγαλώνει, σιγά αλλά
            μεγαλώνει)
          </li>
          <li>
            (iii) <InlineMath>{'o(2^n)'}</InlineMath> ✓
          </li>
          <li>
            (iv) <InlineMath>{'O(\\log_2\\log_2 n)'}</InlineMath> ✓ (ακριβώς η
            τάξη του)
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (iii), (iv).</strong>
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «ρίζα στο όρισμα ⇒ θέτω n = 2ᵐ».</strong>{' '}
          Όποτε δεις <InlineMath>{'T(\\sqrt{n})'}</InlineMath> στην αναδρομή,
          αντικατάστησε <InlineMath>{'n = 2^m'}</InlineMath>· η ρίζα γίνεται
          υποδιπλασιασμός, Master Theorem εφαρμόζεται, και στο τέλος επιστρέφεις{' '}
          <InlineMath>{'m = \\log n'}</InlineMath>. Το χαρακτηριστικό σήμα στην
          απάντηση είναι ένα <strong>«διπλό log»</strong>:{' '}
          <InlineMath>{'\\log\\log n'}</InlineMath>.
        </Callout>
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
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n\\log_2 n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'o(n)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'O(n)'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'o(n^3)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτή είναι η πιο κλασική αναδρομή — ταυτόσημη με τη{' '}
          <strong>συγχωνευτική ταξινόμηση</strong>. Master Theorem με{' '}
          <InlineMath>{'a = 2'}</InlineMath>, <InlineMath>{'b = 2'}</InlineMath>,{' '}
          <InlineMath>{'f(n) = n^1'}</InlineMath> (άρα d = 1). Συγκρίνουμε{' '}
          <InlineMath>{'d = 1'}</InlineMath> με{' '}
          <InlineMath>{'\\log_b a = \\log_2 2 = 1'}</InlineMath>: είναι{' '}
          <strong>ίσα</strong> — Περίπτωση 2. Δες το ζωντανά:
        </p>
        <RecurrenceClassifier preset="pt1-th1-q5" />
        <p>
          Η Περίπτωση 2 δίνει <InlineMath>{'T(n) = \\Theta(n \\log n)'}</InlineMath>:
          το δέντρο αναδρομής έχει <InlineMath>{'\\log_2 n'}</InlineMath> επίπεδα
          και κάθε επίπεδο κάνει συνολικά <InlineMath>{'\\Theta(n)'}</InlineMath>{' '}
          δουλειά (όπως στο σχήμα ράβδων που μένουν ίσες).
        </p>
        <p>Ελέγχουμε:</p>
        <ul>
          <li>
            (i) <InlineMath>{'O(n\\log n)'}</InlineMath> ✓
          </li>
          <li>
            (ii) <InlineMath>{'o(n)'}</InlineMath> ✗ —{' '}
            <InlineMath>{'n\\log n > n'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'O(n)'}</InlineMath> ✗ — ίδιος λόγος
          </li>
          <li>
            (iv) <InlineMath>{'o(n^3)'}</InlineMath> ✓ —{' '}
            <InlineMath>{'n\\log n \\ll n^3'}</InlineMath>
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (iv).</strong>
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «η αναδρομή της mergesort».</strong> Όποτε δεις{' '}
          <InlineMath>{'2T(n/2) + n'}</InlineMath>, η απάντηση είναι{' '}
          <strong>πάντα</strong> <InlineMath>{'\\Theta(n\\log n)'}</InlineMath> —{' '}
          Master Theorem περίπτωση 2. Δεν χρειάζεται να ξεδιπλώσεις τίποτα: είναι
          η πιο κοινή αναδρομή του μαθήματος.
        </Callout>
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
        <p>
          Δες τη θέση του καθενός στον ζωολογικό κήπο — πρόσεξε ιδιαίτερα το
          ζευγάρι «συντομότερο vs μακρύτερο μονοπάτι»: μοιάζουν, αλλά ζουν σε
          εντελώς διαφορετικές ζώνες.
        </p>
        <ComplexityZooLab focus="longest-path" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης για τέτοιες εκφωνήσεις.</strong> Για κάθε όνομα
          προβλήματος ρώτα τρία πράγματα, με τη σειρά: (1) «ξέρω πολυωνυμικό
          αλγόριθμο γι' αυτό;» — αν ναι, είναι στο <InlineMath>{'P'}</InlineMath>.
          (2) «είναι κλασικό NP-πλήρες που έχω συναντήσει;» (SAT, Vertex Cover,
          Knapsack, Hamilton, TSP, Longest Path) — αν ναι, εκτός P (υπό την
          εικασία <InlineMath>{'P \\neq NP'}</InlineMath>). (3) Αλλιώς,
          προσοχή: μπορεί να είναι «στο NP αλλά άγνωστης κατάστασης» — Graph
          Isomorphism, Integer Factorization. Πρόσεξε το μοτίβο «συντομότερο =
          εύκολο, μακρύτερο = δύσκολο»: αλλάζεις λέξη, αλλάζεις ζώνη.
        </Callout>
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
          <InlineMath>{'NP'}</InlineMath> ανάγεται σε αυτό). Δεν αρκεί απλώς «να
          είναι στο NP» — αυτό ισχύει για όλα τα παραπάνω.
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
        <p>
          Οι δύο παγίδες — Ισομορφισμός Γραφημάτων και Παραγοντοποίηση
          Ακεραίων — ζουν στην <strong>μεσαία</strong> ζώνη του κήπου: στο NP,
          αλλά άγνωστο αν είναι σε P ή NP-πλήρη. Δες πού:
        </p>
        <ComplexityZooLab focus="graph-iso" />
        <Callout type="warning">
          <strong>«Στο NP» ≠ «NP-πλήρες».</strong> Όλα τα NP-πλήρη είναι στο
          NP, αλλά το NP περιέχει και ολόκληρο το P, και τη μεσαία ζώνη των
          «άγνωστων». Όταν η εκφώνηση ρωτά «ποια <em>γνωρίζουμε</em> ότι είναι
          NP-πλήρη», η απάντηση πρέπει να αποκλείει και τα γνωστά-P (Huffman,
          shortest path, MST) και τα «άγνωστα» (Graph Iso, Integer Factor) —
          ακόμη κι αν τα δεύτερα δεν τα ξέρουμε σε P.
        </Callout>
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
          <strong>Η αφελής λύση.</strong> Πολλαπλασίασε το{' '}
          <InlineMath>{'m'}</InlineMath> με τον εαυτό του{' '}
          <InlineMath>{'n-1'}</InlineMath> φορές → <InlineMath>{'O(n)'}</InlineMath>.
          Δουλεύει — αλλά είναι σπατάλη.
        </p>
        <p>
          <strong>Η ιδέα «διαίρει και κυρίευε»: τετραγώνισε αντί να
          πολλαπλασιάσεις.</strong> Παρατήρησε ότι
        </p>
        <BlockMath>{'m^n = m^{n/2} \\cdot m^{n/2} = \\bigl(m^{n/2}\\bigr)^2.'}</BlockMath>
        <p>
          Αν ξέρω το <InlineMath>{'m^{n/2}'}</InlineMath>, το{' '}
          <InlineMath>{'m^n'}</InlineMath> προκύπτει με <strong>έναν μόνο</strong>{' '}
          πολλαπλασιασμό. Όχι «το υπολογίζω δύο φορές» — το υπολογίζω{' '}
          <em>μία φορά</em> και το τετραγωνίζω. Δες τη διαφορά κλίμακας
          σπρώχνοντας το slider:
        </p>
        <FastExponentiation />
        <p>
          <strong>Ο αλγόριθμος.</strong>
        </p>
        <BlockMath>{'\\text{Power}(m, n) = \\begin{cases} 1 & n = 0 \\\\ \\bigl(\\text{Power}(m, n/2)\\bigr)^2 & n > 0 \\end{cases}'}</BlockMath>
        <p>
          <strong>Ορθότητα.</strong> Επαγωγή στο{' '}
          <InlineMath>{'n'}</InlineMath>. Βάση: <InlineMath>{'n = 0'}</InlineMath>,{' '}
          <InlineMath>{'m^0 = 1'}</InlineMath> ✓. Επαγωγικό βήμα: υποθέτουμε ότι
          η κλήση <InlineMath>{'\\text{Power}(m, n/2)'}</InlineMath> επιστρέφει
          σωστά το <InlineMath>{'m^{n/2}'}</InlineMath>· τότε η συνάρτηση
          επιστρέφει το τετράγωνό του, <InlineMath>{'(m^{n/2})^2 = m^n'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Μία αναδρομική κλήση στο μισό{' '}
          <InlineMath>{'n'}</InlineMath> + ένας <InlineMath>{'O(1)'}</InlineMath>{' '}
          πολλαπλασιασμός:
        </p>
        <BlockMath>{'T(n) = T(n/2) + O(1) \\;\\Longrightarrow\\; T(n) = O(\\log n).'}</BlockMath>
        <p>
          Από <InlineMath>{'O(n)'}</InlineMath> σε{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath>: για{' '}
          <InlineMath>{'n = 10^6'}</InlineMath>, από ένα εκατομμύριο
          πολλαπλασιασμούς σε <strong>περίπου 20</strong>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «τετραγώνισε αντί να πολλαπλασιάσεις».</strong>{' '}
          Όποτε ζητείται «αποδοτικός υπολογισμός μιας δύναμης / στοιχείου σε
          γρήγορη πτώση», ψάξε για ταυτότητα της μορφής{' '}
          <InlineMath>{'f(n) = g(f(n/2))'}</InlineMath> με σταθερό κόστος{' '}
          <InlineMath>{'g'}</InlineMath>. Παραδείγματα: ύψωση σε δύναμη, ύψωση
          πίνακα σε δύναμη (για γρήγορο Fibonacci), modular exponentiation στην
          κρυπτογραφία.
        </Callout>
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
        <AsymptoticVerdictExplorer preset="pt2-th1-q1" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: άθροισμα → κλείστος τύπος (ή φράγμα).</strong>{' '}
          Πριν συγκρίνεις, βάζε το άθροισμα σε «αναγνωρίσιμη» μορφή. Τα τρία
          πιο χρήσιμα κλειστά: <InlineMath>{'\\sum i = \\Theta(n^2)'}</InlineMath>,{' '}
          <InlineMath>{'\\sum i^2 = \\Theta(n^3)'}</InlineMath>,{' '}
          <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath>. Αν δεν θυμάσαι
          τον τύπο, φράξε: το άθροισμα n όρων με μέγιστο M είναι μεταξύ M και nM.
        </Callout>
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
        <AsymptoticVerdictExplorer preset="pt2-th1-q2" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «τρομακτικές εκφράσεις απλοποιούνται όλες».</strong>{' '}
          Όταν δεις <InlineMath>{'\\sum 1/k'}</InlineMath>, σκέψου{' '}
          <InlineMath>{'\\Theta(\\log n)'}</InlineMath>. Όταν δεις{' '}
          <InlineMath>{'\\log(\\sqrt x)'}</InlineMath>, σκέψου{' '}
          <InlineMath>{'\\tfrac12 \\log x'}</InlineMath>. Σχεδόν κάθε «εξωτικός»
          όρος του L02 ανάγεται σε log, n, ή πολυώνυμο — μην παγώσεις απ' την
          εμφάνιση.
        </Callout>
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
          <InlineMath>{'b = 2'}</InlineMath>, <InlineMath>{'f(n) = n^3'}</InlineMath>{' '}
          (άρα d = 3). Συγκρίνουμε <InlineMath>{'d = 3'}</InlineMath> με{' '}
          <InlineMath>{'\\log_b a = \\log_2 2 = 1'}</InlineMath>:{' '}
          <InlineMath>{'3 > 1'}</InlineMath>, <strong>Περίπτωση 3</strong>. Δες
          γιατί η ρίζα κυριαρχεί στη ράβδο «δουλειά ανά επίπεδο» — οι όροι
          φθίνουν γεωμετρικά:
        </p>
        <RecurrenceClassifier preset="pt2-th1-q3" />
        <p>
          Στην περίπτωση 3 κυριαρχεί ο όρος <InlineMath>{'f(n)'}</InlineMath>{' '}
          («τα φύλλα κάνουν λιγότερη δουλειά από τη ρίζα»):
        </p>
        <BlockMath>{'T(n) = \\Theta(f(n)) = \\Theta(n^3).'}</BlockMath>
        <p>Ελέγχουμε:</p>
        <ul>
          <li>
            (i) <InlineMath>{'\\Omega(n^2)'}</InlineMath> ✓ —{' '}
            <InlineMath>{'n^3 \\ge n^2'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'O(n^3)'}</InlineMath> ✓
          </li>
          <li>
            (iii) <InlineMath>{'\\Theta(n^3\\log n)'}</InlineMath> ✗ — δεν υπάρχει
            λογάριθμος (θα ήταν η Περίπτωση 2)
          </li>
          <li>
            (iv) <InlineMath>{'\\Theta(n^3)'}</InlineMath> ✓
          </li>
        </ul>
        <p>
          <strong>Σωστές: (i), (ii), (iv).</strong>
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «ακριβός συνδυασμός ⇒ ρίζα κυριαρχεί».</strong>{' '}
          Όταν το <InlineMath>{'f(n)'}</InlineMath> είναι πολυωνυμικά
          μεγαλύτερο από <InlineMath>{'n^{\\log_b a}'}</InlineMath>, η Περίπτωση
          3 σου χαρίζει την απάντηση: απλώς γράφεις{' '}
          <InlineMath>{'\\Theta(f(n))'}</InlineMath>. Παγίδα: αν διαφέρει μόνο
          κατά <InlineMath>{'\\log'}</InlineMath> (όχι πολυωνυμικά), πέφτεις
          στην επεκτεταμένη περίπτωση — όχι στην 3.
        </Callout>
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
      <>
        <p>
          Αν <InlineMath>{'T(n) = 2T(\\sqrt{n}) + 1'}</InlineMath>, κύκλωσε ποια
          ισχύουν:
        </p>
        <ul>
          <li>
            (i) <InlineMath>{'\\Theta(n)'}</InlineMath>
          </li>
          <li>
            (ii) <InlineMath>{'\\Theta(\\log_2 n)'}</InlineMath>
          </li>
          <li>
            (iii) <InlineMath>{'\\Theta(\\sqrt{n})'}</InlineMath>
          </li>
          <li>
            (iv) <InlineMath>{'\\Omega(2^n)'}</InlineMath>
          </li>
        </ul>
      </>
    ),
    solution: (
      <>
        <p>
          Η ρίζα ξανά — ίδιο κόλπο όπως στο{' '}
          <InlineMath>{'T(\\sqrt{n})+1'}</InlineMath>: θέτουμε{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>· τώρα όμως ο συντελεστής 2
          μπροστά αλλάζει την κατάληξη — η νέα <InlineMath>{'S(m)'}</InlineMath>{' '}
          είναι <InlineMath>{'2S(m/2)+1'}</InlineMath>, που πέφτει στην{' '}
          <strong>Περίπτωση 1</strong> και δίνει Θ(m), όχι Θ(log m).
        </p>
        <RecurrenceSubstitution preset="pt2-th1-q4" />
        <p>
          Επιστρέφοντας <InlineMath>{'m = \\log_2 n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log n).'}</BlockMath>
        <p>
          Ελέγχουμε: μόνο η (ii) είναι σωστή.{' '}
          <strong>Σωστή: (ii).</strong>
        </p>
        <Callout type="warning">
          <strong>Παγίδα — μη μπερδέψεις με το «T(√n)+1»!</strong> Το{' '}
          <InlineMath>{'T(\\sqrt{n})+1'}</InlineMath> δίνει{' '}
          <InlineMath>{'\\Theta(\\log\\log n)'}</InlineMath> (διπλό log)· το{' '}
          <InlineMath>{'2T(\\sqrt{n})+1'}</InlineMath> δίνει{' '}
          <InlineMath>{'\\Theta(\\log n)'}</InlineMath> (απλό log). Η διαφορά
          είναι ο συντελεστής μπροστά: a=1 → MT περίπτωση 2 στο S(m), a=2 → MT
          περίπτωση 1.
        </Callout>
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
        <p>
          Η μεγάλη παγίδα εδώ είναι το <strong>2-SAT</strong>: φαίνεται σαν
          SAT, αλλά είναι ειδική περίπτωση που λύνεται πολυωνυμικά. Δες πού
          ακριβώς ζει:
        </p>
        <ComplexityZooLab focus="2sat" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «μήπως είναι ειδική περίπτωση που πέφτει στο P;»</strong>{' '}
          Πολλά NP-πλήρη έχουν παραλλαγές που λύνονται γρήγορα: 2-SAT (vs SAT),
          ελάχιστο vs μακρύτερο μονοπάτι, MST (vs Steiner Tree στον γενικό
          ορισμό). Όταν δεις παραλλαγή με τη λέξη «δύο», «μέγιστο/ελάχιστο
          συνδετικό», ή κάποιον περιορισμό σε δομή, ρώτα αν η ειδική περίπτωση
          είναι σε P — συχνά ναι.
        </Callout>
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
        <p>
          Η Παραγοντοποίηση Ακεραίων ζει στη μεσαία (άγνωστη) ζώνη — μαζί με
          τον Ισομορφισμό Γραφημάτων. Δες:
        </p>
        <ComplexityZooLab focus="integer-factor" />
        <Callout type="key">
          <strong>«Δεν γνωρίζουμε αν είναι NP-πλήρες» είναι ξεχωριστή απάντηση.</strong>{' '}
          Δεν εννοεί «είναι NP-πλήρες» — εννοεί «είμαστε ακόμη αναποφάσιστοι».
          Μόνο δύο προβλήματα από όσα συναντάς στο μάθημα ζουν εκεί:
          Παραγοντοποίηση Ακεραίων και Ισομορφισμός Γραφημάτων. Όλα τα άλλα
          ονόματα (SAT, Hamilton, Vertex Cover, Knapsack, Longest Path) είναι
          ήδη ταξινομημένα: ή σε P, ή NP-πλήρη. Η ύπαρξη αυτής της «τρίτης
          απάντησης» είναι η κρυφή ευκολία του ερωτήματος — αν την ξεχάσεις,
          ψάχνεις απάντηση από λάθος δύο επιλογές.
        </Callout>
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
        <ComplexityZooLab focus="shortest-path" />
        <Callout type="warning">
          <strong>Παγίδα της εικασίας.</strong> Η <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
          ΔΕΝ «κλειδώνει» όλα τα προβλήματα γραφημάτων έξω από το P. Κλειδώνει
          μόνο όσα είναι NP-πλήρη (μακρύτερο μονοπάτι, Hamilton, TSP, ...). Όταν
          σε εκφώνηση Σ/Λ δεις την υπόθεση <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
          να «αποδεικνύει» ότι κάτι ΔΕΝ είναι σε P, πρώτα ρώτα:{' '}
          <em>«είναι αυτό το κάτι ήδη γνωστό ότι είναι σε P;»</em> Αν ναι, η
          δήλωση είναι λάθος ανεξάρτητα από την εικασία. Εδώ, ο Dijkstra είναι η
          άμεση αντίφαση.
        </Callout>
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
        <p>
          Δες τη σφήνα ζωντανά — άλλαξε ζευγάρι <InlineMath>{'(f, g)'}</InlineMath>{' '}
          και κάνε <InlineMath>{'f = g'}</InlineMath>· η ιδιότητα ισχύει το ίδιο:
        </p>
        <SandwichTheoremViz preset="pt4-th1-q2" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «πιάσε σφήνα γύρω από το άγνωστο».</strong>{' '}
          Όταν μια ποσότητα <InlineMath>{'X'}</InlineMath> μπαίνει μεταξύ δύο
          εκφράσεων ίδιας τάξης (<InlineMath>{'c_1 \\cdot M \\le X \\le c_2 \\cdot M'}</InlineMath>),
          τότε <InlineMath>{'X \\in \\Theta(M)'}</InlineMath> αυτόματα. Δύο πρακτικές
          παραλλαγές: «το άθροισμα είναι μεταξύ του μέγιστου όρου και n φορές το
          μέγιστο» και «κάθε όρος αθροίσματος φράσσεται από σταθερές → άθροισμα Θ(n)».
        </Callout>
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
          <strong>ΛΑΘΟΣ.</strong> Η πρόταση μοιάζει αληθοφανής («δύο αναδρομικές
          κλήσεις + γραμμική δουλειά → πρέπει να μοιάζει με mergesort») αλλά
          είναι τελείως λάθος. Η ζωτική διαφορά: <strong>μικραίνει κατά 1</strong>{' '}
          (όχι στο μισό). Σύγκρινε με το μάτι τα δύο δέντρα:
        </p>
        <BranchingContrast />
        <p>
          Στο <InlineMath>{'2T(n-1)'}</InlineMath> κάθε επίπεδο διπλασιάζει το
          πλήθος υποπροβλημάτων ΚΑΙ χρειάζονται <InlineMath>{'n'}</InlineMath>{' '}
          επίπεδα (όχι <InlineMath>{'\\log n'}</InlineMath>). Άρα τα φύλλα είναι{' '}
          <InlineMath>{'2^n'}</InlineMath> — εκθετικά. Ξεδιπλώνοντας:
        </p>
        <BlockMath>{'T(n) = 2T(n-1) + cn = 4T(n-2) + 2c(n-1) + cn = \\dots = 2^n\\,T(0) + \\text{(πολυωνυμικοί όροι)}.'}</BlockMath>
        <p>
          Μόνο ο όρος <InlineMath>{'2^n T(0)'}</InlineMath> είναι ήδη εκθετικός
          — άρα <InlineMath>{'T(n) = \\Theta(2^n)'}</InlineMath>, ούτε καν
          πολυωνυμικό φράγμα.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — δύο κλήσεις στο n−1 = εκθετικό, στο n/2 = πολυωνυμικό.</strong>{' '}
          Στις αναδρομές «πλήθος κλήσεων» × «πόσο μικραίνει» καθορίζει τα πάντα:
          <ul>
            <li>
              <InlineMath>{'2T(n-1)'}</InlineMath> → βάθος n, fanout 2 → 2ⁿ φύλλα → <strong>εκθετικό</strong>.
            </li>
            <li>
              <InlineMath>{'2T(n/2)'}</InlineMath> → βάθος log n, fanout 2 → n φύλλα → <strong>πολυωνυμικό</strong>.
            </li>
          </ul>
          Όποιος βλέπει <InlineMath>{'2T(n-1)'}</InlineMath> ή{' '}
          <InlineMath>{'aT(n-c)'}</InlineMath> για <InlineMath>{'a > 1'}</InlineMath>{' '}
          πρέπει αμέσως να ψάχνει για εκθετική απάντηση — όπως ακριβώς ο Hanoi.
        </Callout>
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
        <Callout type="key">
          <strong>Πρότυπο σκέψης: τύπος-κλειδί για κάθε αριθμητικό άθροισμα.</strong>{' '}
          <InlineMath>{'1 + 2 + \\cdots + n = n(n+1)/2 = \\Theta(n^2)'}</InlineMath>{' '}
          εμφανίζεται κάθε φορά που έχεις «εξωτερικό βρόχο 1..n, εσωτερικός 1..i»
          (διπλοί βρόχοι με κάτω τριγωνική δομή). Δεύτερο πιο συχνό:{' '}
          <InlineMath>{'\\sum i^2 = \\Theta(n^3)'}</InlineMath>. Αν τα ξέρεις
          απ' έξω, οι ασκήσεις πολυπλοκότητας λύνονται σε δύο γραμμές.
        </Callout>
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
          <strong>Η παρατήρηση-κλειδί: η συμβολοσειρά είναι ήδη ταξινομημένη.</strong>{' '}
          Πρώτα όλα τα <InlineMath>{'1'}</InlineMath>, μετά όλα τα{' '}
          <InlineMath>{'0'}</InlineMath>. Υπάρχει ένα μοναδικό{' '}
          <strong>σύνορο</strong> — βρες το, βρήκες και το{' '}
          <InlineMath>{'n'}</InlineMath>. Αυτή ακριβώς η ιδέα είναι η συνταγή της{' '}
          <strong>δυαδικής αναζήτησης</strong>: σε κάθε βήμα μισαρίζεις το
          διάστημα όπου ξέρεις ότι ζει το σύνορο.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Κοίτα τον μεσαίο χαρακτήρα{' '}
          <InlineMath>{'S[\\text{mid}]'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'S[\\text{mid}] = 1'}</InlineMath> → όλα αριστερά είναι
            επίσης <InlineMath>{'1'}</InlineMath>· συνέχισε <strong>δεξιά</strong>.
          </li>
          <li>
            <InlineMath>{'S[\\text{mid}] = 0'}</InlineMath> → το σύνορο είναι
            στο mid ή πριν· συνέχισε <strong>αριστερά</strong>.
          </li>
        </ul>
        <p>
          Δες το να εκτελείται — οι σλάιντερ ρυθμίζουν m, n και το κουμπί
          «Επόμενο βήμα» κάνει μία σύγκριση κάθε φορά:
        </p>
        <OneZeroBinarySearch />
        <p>
          <strong>Ορθότητα — αναλλοίωτη.</strong> «Το σύνορο ζει εντός του
          τρέχοντος διαστήματος.» Επειδή η ακολουθία είναι μονότονη, κάθε
          σύγκριση συμπεραίνει ασφαλώς προς ποια κατεύθυνση να μειώσουμε.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε βήμα υποδιπλασιάζει το διάστημα με{' '}
          <InlineMath>{'O(1)'}</InlineMath> δουλειά:
        </p>
        <BlockMath>{'T(k) = T(k/2) + O(1) \\;\\Longrightarrow\\; T(k) = O(\\log k).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «αν η είσοδος έχει μοναδικό σύνορο, δυαδική αναζήτηση».</strong>{' '}
          Όποτε δεις μονότονη συνθήκη («πριν μια θέση Α, μετά Β»), η απάντηση
          είναι σχεδόν πάντα δυαδική αναζήτηση — <InlineMath>{'O(\\log k)'}</InlineMath>.
          Παραδείγματα: πρώτη εμφάνιση στοιχείου σε ταξινομημένο πίνακα, χαμένος
          όρος αριθμητικής προόδου (front-set-4-ask7), πρώτο/τελευταίο TRUE σε
          μονότονη συνάρτηση.
        </Callout>
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
  {
    id: 'pt5-th1',
    title: 'Παλαιό Θέμα #5 · Θέμα 1 — Συνεκτικές συνιστώσες γραφήματος',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται ένας απλός μη κατευθυνόμενος γράφος{' '}
          <InlineMath>{'G = (V, E, W)'}</InlineMath> με{' '}
          <InlineMath>{'|V|'}</InlineMath> κόμβους,{' '}
          <InlineMath>{'|E|'}</InlineMath> ακμές και{' '}
          <InlineMath>{'W'}</InlineMath> μια συνάρτηση βάρους στις ακμές. Η
          αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι σε{' '}
          <strong>λίστες γειτνίασης</strong>. Μια <em>συνεκτική συνιστώσα</em>{' '}
          του <InlineMath>{'G'}</InlineMath> είναι ένας υπογράφος του,
          μεγιστικός ως προς την έγκλιση, για τον οποίο ισχύει ότι για κάθε δύο
          κορυφές του υπάρχει μονοπάτι που τις συνδέει.
        </p>
        <p>
          <strong>i.</strong> Να δοθεί αλγόριθμος σε φυσική γλώσσα,{' '}
          <strong>βέλτιστης πολυπλοκότητας</strong>, που βρίσκει τις συνεκτικές
          συνιστώσες του <InlineMath>{'G'}</InlineMath>.{' '}
          <strong>ii.</strong> Να υπολογιστεί η πολυπλοκότητα του αλγορίθμου.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Η ιδέα.</strong> Μια συνεκτική συνιστώσα είναι ένα
          «νησί» κόμβων όπου ο καθένας φτάνει στον καθένα. Αν ξεκινήσουμε μια
          διάσχιση (BFS ή DFS) από έναν κόμβο, θα επισκεφθούμε{' '}
          <em>ακριβώς</em> όλους τους κόμβους του νησιού του — ούτε έναν
          παραπάνω, αφού δεν υπάρχουν ακμές που να βγαίνουν από το νησί.
        </p>
        <p>Ο αλγόριθμος:</p>
        <ul>
          <li>
            Κράτα έναν πίνακα <InlineMath>{'\\text{visited}'}</InlineMath>, όλα{' '}
            <InlineMath>{'\\text{false}'}</InlineMath>, και έναν μετρητή
            συνιστωσών <InlineMath>{'c = 0'}</InlineMath>.
          </li>
          <li>
            Διέτρεξε όλους τους κόμβους <InlineMath>{'v \\in V'}</InlineMath>. Αν
            ο <InlineMath>{'v'}</InlineMath> δεν έχει επισκεφθεί: αύξησε το{' '}
            <InlineMath>{'c'}</InlineMath>, ξεκίνησε <strong>BFS</strong> από
            τον <InlineMath>{'v'}</InlineMath> και σημείωσε κάθε προσβάσιμο
            κόμβο ως «επισκεμμένο», δίνοντάς του την ταυτότητα συνιστώσας{' '}
            <InlineMath>{'c'}</InlineMath>.
          </li>
          <li>
            Το σύνολο των κόμβων που σημειώθηκαν σε αυτό το BFS{' '}
            <em>είναι</em> μία συνεκτική συνιστώσα. Στο τέλος, το{' '}
            <InlineMath>{'c'}</InlineMath> είναι το πλήθος των συνιστωσών.
          </li>
        </ul>
        <p>
          <strong>ii. Πολυπλοκότητα.</strong> Κάθε κόμβος μπαίνει στην ουρά του
          BFS το πολύ μία φορά (μόλις τον σημειώσουμε, δεν τον ξανα-αγγίζουμε) →
          συνολικά <InlineMath>{'O(|V|)'}</InlineMath> για τους κόμβους. Με
          λίστες γειτνίασης, κάθε ακμή <InlineMath>{'\\{u,v\\}'}</InlineMath>{' '}
          εξετάζεται δύο φορές (μία από τον <InlineMath>{'u'}</InlineMath>, μία
          από τον <InlineMath>{'v'}</InlineMath>) → συνολικά{' '}
          <InlineMath>{'O(|E|)'}</InlineMath> για τις ακμές. Ο εξωτερικός
          βρόχος προσθέτει ακόμα <InlineMath>{'O(|V|)'}</InlineMath>:
        </p>
        <BlockMath>{'T(G) = O(|V| + |E|)'}</BlockMath>
        <p>
          Αυτό είναι <strong>βέλτιστο</strong>: οποιοσδήποτε αλγόριθμος πρέπει
          τουλάχιστον να «κοιτάξει» κάθε κόμβο και κάθε ακμή της εισόδου, αλλιώς
          δεν μπορεί να ξέρει σε ποια συνιστώσα ανήκουν — άρα{' '}
          <InlineMath>{'\\Omega(|V|+|E|)'}</InlineMath> είναι κάτω φράγμα, και ο
          αλγόριθμός μας το πετυχαίνει.
        </p>
      </>
    ),
  },
  {
    id: 'pt5-th1b',
    title: 'Παλαιό Θέμα #5 · Θέμα 1 (Β ομάδας) — Σύγκριση εκθετικής με υπερ-πολυωνυμική',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 1 (Β ομάδας)',
    weight: 20,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Θεωρούμε την <InlineMath>{'f(n) = c^{\\sqrt{n\\log n}}'}</InlineMath> με{' '}
        <InlineMath>{'c > 1'}</InlineMath>. Βρες αν είναι{' '}
        <InlineMath>{'O\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</InlineMath> ή{' '}
        <InlineMath>{'\\Omega\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Και οι δύο παραστάσεις είναι τεράστιες — δεν συγκρίνονται με το μάτι.
          Το κόλπο: <strong>παίρνουμε λογάριθμο</strong> και στις δύο. Η σύγκριση
          δεν αλλάζει (ο λογάριθμος είναι γνησίως αύξων), αλλά οι αριθμοί
          γίνονται διαχειρίσιμοι.
        </p>
        <p>
          <strong>Αριστερή πλευρά:</strong>
        </p>
        <BlockMath>{'\\log f(n) = \\sqrt{n\\log n}\\,\\cdot\\,\\log c'}</BlockMath>
        <p>
          <strong>Δεξιά πλευρά:</strong>
        </p>
        <BlockMath>{'\\log\\!\\left((n\\log n)^{\\log^2 n}\\right) = \\log^2 n \\cdot \\log(n\\log n) = \\log^2 n\\,(\\log n + \\log\\log n)'}</BlockMath>
        <p>
          Για μεγάλα <InlineMath>{'n'}</InlineMath>, το{' '}
          <InlineMath>{'\\log(n\\log n) \\approx \\log n'}</InlineMath>, οπότε η
          δεξιά πλευρά είναι περίπου <InlineMath>{'\\log^3 n'}</InlineMath> —{' '}
          <strong>πολυλογαριθμική</strong>.
        </p>
        <p>
          <strong>Η σύγκριση.</strong> Η αριστερή πλευρά περιέχει το{' '}
          <InlineMath>{'\\sqrt{n\\log n} = \\sqrt{n}\\cdot\\sqrt{\\log n}'}</InlineMath>,
          δηλαδή έναν παράγοντα <InlineMath>{'\\sqrt{n} = n^{1/2}'}</InlineMath>{' '}
          — <strong>πολυωνυμικό</strong> ως προς το{' '}
          <InlineMath>{'n'}</InlineMath>. Κάθε θετική δύναμη του{' '}
          <InlineMath>{'n'}</InlineMath> (ακόμα και το{' '}
          <InlineMath>{'n^{1/2}'}</InlineMath>) τελικά «νικά» κάθε δύναμη του{' '}
          <InlineMath>{'\\log n'}</InlineMath>. Άρα:
        </p>
        <BlockMath>{'\\log f(n) = \\Theta\\!\\left(\\sqrt{n}\\,\\sqrt{\\log n}\\right) \\;\\gg\\; \\log^3 n = \\log\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</BlockMath>
        <p>
          Αφού ο λογάριθμος της <InlineMath>{'f(n)'}</InlineMath> ξεπερνά τον
          λογάριθμο της άλλης παράστασης, η ίδια η{' '}
          <InlineMath>{'f(n)'}</InlineMath> μεγαλώνει πολύ πιο γρήγορα:
        </p>
        <BlockMath>{'f(n) = \\Omega\\!\\left((n\\log n)^{\\log^2 n}\\right)'}</BlockMath>
        <p>
          (Στην πραγματικότητα ισχύει και το ισχυρότερο{' '}
          <InlineMath>{'\\omega'}</InlineMath>.)
        </p>
        <p>
          Δες τη μάχη στους <em>λογαρίθμους</em> των δύο εκφράσεων — εκεί όπου
          η σύγκριση γίνεται διαχειρίσιμη («πολυωνυμικό vs πολυλογάριθμος»):
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th1b" />
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης: «log και στις δύο πλευρές».</strong> Όταν δεις
          εκθετικούς πύργους ή υπερβολικές δυνάμεις, πάρε λογάριθμο πρώτα. Η
          σύγκριση διατηρείται (γνησίως αύξων), αλλά μεταφέρεται σε αναγνωρίσιμες
          τάξεις (πολυώνυμα, polylog, σταθερές). Εδώ ο λογάριθμος μετατρέπει «τα
          δύο τέρατα» σε <InlineMath>{'\\sqrt{n\\log n}'}</InlineMath> vs{' '}
          <InlineMath>{'\\log^3 n'}</InlineMath> — η πρώτη περιέχει πολυωνυμικό
          παράγοντα <InlineMath>{'\\sqrt n'}</InlineMath>, νικάει αυτόματα.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th2-a',
    title: 'Παλαιό Θέμα #5 · Θέμα 2Α — Κατάταξη της 2^√(log n)',
    topic: 'asymptotics',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 2Α',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <p>
        Η συνάρτηση <InlineMath>{'g(n) = 2^{\\sqrt{\\log n}}'}</InlineMath> είναι{' '}
        <InlineMath>{'\\Theta(n)'}</InlineMath>,{' '}
        <InlineMath>{'o(n)'}</InlineMath> ή{' '}
        <InlineMath>{'\\omega(n)'}</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Το κόλπο — ίδια βάση.</strong> Για να συγκρίνουμε την{' '}
          <InlineMath>{'g(n)'}</InlineMath> με το{' '}
          <InlineMath>{'n'}</InlineMath>, γράφουμε και τα δύο ως δυνάμεις του{' '}
          <InlineMath>{'2'}</InlineMath>:
        </p>
        <BlockMath>{'g(n) = 2^{\\sqrt{\\log n}}, \\qquad n = 2^{\\log n}'}</BlockMath>
        <p>
          Τώρα η σύγκριση ανάγεται στους <strong>εκθέτες</strong>:{' '}
          <InlineMath>{'\\sqrt{\\log n}'}</InlineMath> έναντι{' '}
          <InlineMath>{'\\log n'}</InlineMath>.
        </p>
        <p>
          Θέσε <InlineMath>{'x = \\log n'}</InlineMath>. Συγκρίνουμε{' '}
          <InlineMath>{'\\sqrt{x}'}</InlineMath> με <InlineMath>{'x'}</InlineMath>:
          για μεγάλα <InlineMath>{'x'}</InlineMath>, το{' '}
          <InlineMath>{'\\sqrt{x}'}</InlineMath> είναι πολύ μικρότερο. Άρα ο
          λόγος:
        </p>
        <BlockMath>{'\\frac{g(n)}{n} = 2^{\\sqrt{\\log n} - \\log n} \\xrightarrow[n\\to\\infty]{} 2^{-\\infty} = 0'}</BlockMath>
        <p>
          αφού ο εκθέτης <InlineMath>{'\\sqrt{\\log n} - \\log n \\to -\\infty'}</InlineMath>.
        </p>
        <p>
          <strong>Συγκεκριμένο παράδειγμα.</strong> Πάρε{' '}
          <InlineMath>{'n = 2^{100}'}</InlineMath>: τότε{' '}
          <InlineMath>{'\\log n = 100'}</InlineMath>,{' '}
          <InlineMath>{'\\sqrt{\\log n} = 10'}</InlineMath>, οπότε{' '}
          <InlineMath>{'g(n) = 2^{10} = 1024'}</InlineMath> ενώ{' '}
          <InlineMath>{'n = 2^{100}'}</InlineMath> — αστρονομικά μεγαλύτερο.
        </p>
        <p>
          Αφού ο λόγος <InlineMath>{'g(n)/n \\to 0'}</InlineMath>, η{' '}
          <InlineMath>{'g(n)'}</InlineMath> είναι{' '}
          <strong><InlineMath>{'o(n)'}</InlineMath></strong> — μεγαλώνει
          γνήσια πιο αργά από το <InlineMath>{'n'}</InlineMath>.
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th2-a" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «ίδια βάση → σύγκριση εκθετών».</strong> Όταν
          συγκρίνεις <InlineMath>{'a^{u(n)}'}</InlineMath> και{' '}
          <InlineMath>{'a^{v(n)}'}</InlineMath>, αρκεί να συγκρίνεις τα{' '}
          <InlineMath>{'u(n)'}</InlineMath> και <InlineMath>{'v(n)'}</InlineMath>{' '}
          — η εκθετική είναι γνησίως αύξουσα. Εδώ:{' '}
          <InlineMath>{'n = 2^{\\log n}'}</InlineMath>, οπότε{' '}
          <InlineMath>{'g/n = 2^{\\sqrt{\\log n} - \\log n}'}</InlineMath>, και ο
          εκθέτης φεύγει στο <InlineMath>{'-\\infty'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th2-b',
    title: 'Παλαιό Θέμα #5 · Θέμα 2Β — Δύο αλγόριθμοι D&C με Master Theorem',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 2Β',
    weight: 10,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Ένα πρόβλημα <InlineMath>{'\\Pi'}</InlineMath> επιλύεται με τους
          παρακάτω δύο αναδρομικούς αλγορίθμους για στιγμιότυπα μεγέθους{' '}
          <InlineMath>{'n'}</InlineMath>:
        </p>
        <ul>
          <li>
            Ο <InlineMath>{'A_1'}</InlineMath> διασπά το πρόβλημα σε{' '}
            <strong>9</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/3'}</InlineMath> και συνθέτει τις λύσεις σε χρόνο{' '}
            <InlineMath>{'n'}</InlineMath>.
          </li>
          <li>
            Ο <InlineMath>{'A_2'}</InlineMath> διασπά το πρόβλημα σε{' '}
            <strong>2</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/2'}</InlineMath> και συνθέτει τις λύσεις σε χρόνο{' '}
            <InlineMath>{'cn'}</InlineMath> για κάποια σταθερά{' '}
            <InlineMath>{'c'}</InlineMath>.
          </li>
        </ul>
        <p>
          Γράψε τις αναδρομικές εξισώσεις χρόνου εκτέλεσης των{' '}
          <InlineMath>{'A_1, A_2'}</InlineMath> και λύσε τες με το Θεώρημα
          Κυριαρχίας.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Κάθε αλγόριθμος D&amp;C δίνει αναδρομή{' '}
          <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath>. Master Theorem
          συγκρίνει το <InlineMath>{'f(n)'}</InlineMath> με το{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath>· περίπτωση 1 αν f μικρότερο
          (φύλλα κυριαρχούν), περίπτωση 2 αν ίσα (κάθε επίπεδο το ίδιο),
          περίπτωση 3 αν f μεγαλύτερο (ρίζα κυριαρχεί).
        </p>
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_1'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_1(n) = 9\\,T_1(n/3) + n'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 9,\\ b = 3'}</InlineMath>:{' '}
          <InlineMath>{'\\log_3 9 = 2'}</InlineMath>, άρα κατώφλι{' '}
          <InlineMath>{'n^2'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = n'}</InlineMath> είναι πολυωνυμικά μικρότερο →{' '}
          <strong>περίπτωση 1</strong> → <InlineMath>{'\\Theta(n^2)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="pt5-th2-b-A1" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_2'}</InlineMath>:</strong>{' '}
          <InlineMath>{'T_2(n) = 2\\,T_2(n/2) + cn'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 2,\\ b = 2'}</InlineMath>:{' '}
          <InlineMath>{'\\log_2 2 = 1'}</InlineMath>, κατώφλι{' '}
          <InlineMath>{'n'}</InlineMath>. Το{' '}
          <InlineMath>{'f(n) = cn = \\Theta(n)'}</InlineMath> ταιριάζει — η{' '}
          αναδρομή της mergesort, <strong>περίπτωση 2</strong> →{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="pt5-th2-b-A2" />
        <p>
          Σύγκριση:{' '}
          <InlineMath>{'\\Theta(n\\log n) \\prec \\Theta(n^2)'}</InlineMath> — ο{' '}
          <InlineMath>{'A_2'}</InlineMath> νικάει με μεγάλη διαφορά.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — δύο σχήματα D&amp;C σε αντιπαράθεση.</strong>{' '}
          Όταν σου δίνουν περιγραφή τύπου «διασπά σε a κομμάτια μεγέθους n/b,
          συνδέει σε χρόνο f», γράψε αμέσως την αναδρομή{' '}
          <InlineMath>{'aT(n/b)+f'}</InlineMath> και εφάρμοσε Master Theorem. Η
          μόνη σύγκριση που πρέπει να κάνεις είναι d (εκθέτης του f) vs{' '}
          <InlineMath>{'\\log_b a'}</InlineMath>: μικρότερο→περίπτωση 1, ίσο→2,
          μεγαλύτερο→3.
        </Callout>
      </>
    ),
  },
  {
    id: 'pt5-th3-a',
    title: 'Παλαιό Θέμα #5 · Θέμα 3Α — Το Hamiltonian Path ανήκει στο NP',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 3Α',
    weight: 5,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>Hamiltonian Path (Η):</strong> δίνεται γράφος{' '}
          <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
          κόμβους και δύο κόμβοι <InlineMath>{'s'}</InlineMath> και{' '}
          <InlineMath>{'t'}</InlineMath>. Υπάρχει μονοπάτι από τον{' '}
          <InlineMath>{'s'}</InlineMath> στον <InlineMath>{'t'}</InlineMath> που
          περνά από κάθε κόμβο του <InlineMath>{'G'}</InlineMath> ακριβώς μία
          φορά;
        </p>
        <p>Δείξε ότι το πρόβλημα <InlineMath>{'H'}</InlineMath> ανήκει στην κλάση NP.</p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Τι σημαίνει «ανήκει στο NP».</strong> Η κλάση{' '}
          <strong>NP</strong> είναι τα προβλήματα απόφασης για τα οποία, αν η
          απάντηση είναι «ναι», υπάρχει ένα <em>πιστοποιητικό</em> (ένα στοιχείο
          απόδειξης) που μπορεί να <strong>επαληθευτεί σε πολυωνυμικό
          χρόνο</strong>. Δεν χρειάζεται να <em>βρούμε</em> γρήγορα την
          απάντηση — αρκεί να μπορούμε γρήγορα να <em>ελέγξουμε</em> μια
          προτεινόμενη λύση.
        </p>
        <p>
          <strong>Το πιστοποιητικό.</strong> Για το Hamiltonian Path, το
          πιστοποιητικό είναι μια προτεινόμενη ακολουθία κορυφών{' '}
          <InlineMath>{'v_1, v_2, \\ldots, v_n'}</InlineMath> — δηλαδή ένα
          υποψήφιο μονοπάτι.
        </p>
        <p>
          <strong>Ο επαληθευτής</strong> ελέγχει τρία πράγματα:
        </p>
        <ul>
          <li>
            <InlineMath>{'v_1 = s'}</InlineMath> και{' '}
            <InlineMath>{'v_n = t'}</InlineMath> (σωστά άκρα) —{' '}
            <InlineMath>{'O(1)'}</InlineMath>.
          </li>
          <li>
            η ακολουθία περιέχει <em>κάθε</em> κορυφή{' '}
            <strong>ακριβώς μία φορά</strong> (χωρίς επαναλήψεις, χωρίς
            παραλείψεις) — <InlineMath>{'O(n)'}</InlineMath> με ένα βοηθητικό
            σύνολο.
          </li>
          <li>
            κάθε διαδοχικό ζεύγος{' '}
            <InlineMath>{'(v_i, v_{i+1})'}</InlineMath> είναι πραγματική ακμή
            του <InlineMath>{'G'}</InlineMath> — <InlineMath>{'O(n)'}</InlineMath>{' '}
            έλεγχοι.
          </li>
        </ul>
        <p>
          Και οι τρεις έλεγχοι γίνονται σε <strong>πολυωνυμικό χρόνο</strong>.
          Αν υπάρχει Hamiltonian μονοπάτι, υπάρχει πιστοποιητικό που τους
          περνά· αν δεν υπάρχει, κανένα πιστοποιητικό δεν τους περνά. Άρα{' '}
          <InlineMath>{'H \\in \\text{NP}'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'pt5-th3-b',
    title: 'Παλαιό Θέμα #5 · Θέμα 3Β — Το πρόβλημα απόφασης MST σε NP και σε P',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 3Β',
    weight: 15,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>
          <strong>Minimum Spanning Tree (MST):</strong> δίνεται γράφος{' '}
          <InlineMath>{'G = (V, E, W)'}</InlineMath> με{' '}
          <InlineMath>{'n'}</InlineMath> κόμβους και μη αρνητικά βάρη στις ακμές
          μέσω της <InlineMath>{'W'}</InlineMath>. Να βρεθεί ένα συνδετικό
          δέντρο (spanning tree) ελαχίστου βάρους.
        </p>
        <p>
          <strong>i.</strong> Γράψε το αντίστοιχο πρόβλημα απόφασης{' '}
          <InlineMath>{'\\text{MST}_D'}</InlineMath>.{' '}
          <strong>ii.</strong> Δείξε ότι{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.{' '}
          <strong>iii.</strong> Δείξε ότι{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>i. Από πρόβλημα βελτιστοποίησης σε πρόβλημα απόφασης.</strong>{' '}
          Ένα πρόβλημα τύπου «βρες το ελάχιστο» μετατρέπεται σε «ναι/όχι»
          ερώτημα προσθέτοντας ένα <em>κατώφλι</em>{' '}
          <InlineMath>{'k'}</InlineMath>:
        </p>
        <p>
          <InlineMath>{'\\text{MST}_D'}</InlineMath>: «Δίνεται γράφος{' '}
          <InlineMath>{'G = (V,E,W)'}</InlineMath> και αριθμός{' '}
          <InlineMath>{'k'}</InlineMath>. Υπάρχει συνδετικό δέντρο του{' '}
          <InlineMath>{'G'}</InlineMath> με συνολικό βάρος{' '}
          <InlineMath>{'\\le k'}</InlineMath>;»
        </p>
        <p>
          <strong>ii. <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.</strong>{' '}
          Πιστοποιητικό: ένα προτεινόμενο σύνολο ακμών{' '}
          <InlineMath>{'T'}</InlineMath>. Ο επαληθευτής ελέγχει σε πολυωνυμικό
          χρόνο:
        </p>
        <ul>
          <li>
            ότι το <InlineMath>{'T'}</InlineMath> έχει ακριβώς{' '}
            <InlineMath>{'n - 1'}</InlineMath> ακμές·
          </li>
          <li>
            ότι σχηματίζει <em>δέντρο που καλύπτει όλες τις κορυφές</em>{' '}
            (συνεκτικό και χωρίς κύκλους — ελέγχεται με BFS/DFS ή Union-Find σε{' '}
            <InlineMath>{'O(|V|+|E|)'}</InlineMath>)·
          </li>
          <li>
            ότι το συνολικό βάρος είναι{' '}
            <InlineMath>{'\\le k'}</InlineMath> (μια άθροιση).
          </li>
        </ul>
        <p>
          Όλα πολυωνυμικά → <InlineMath>{'\\text{MST}_D \\in \\text{NP}'}</InlineMath>.
        </p>
        <p>
          <strong>iii. <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.</strong>{' '}
          Η κλάση <strong>P</strong> είναι τα προβλήματα που{' '}
          <em>λύνονται</em> (όχι απλώς επαληθεύονται) σε πολυωνυμικό χρόνο. Και
          για το MST <em>έχουμε</em> τέτοιον αλγόριθμο: ο{' '}
          <strong>Kruskal</strong> ή ο <strong>Prim</strong> υπολογίζει το
          ελάχιστο συνδετικό δέντρο σε <InlineMath>{'O(|E|\\log |V|)'}</InlineMath>.
          Άρα: τρέξε τον Kruskal, βρες το βάρος{' '}
          <InlineMath>{'W^*'}</InlineMath> του MST, και απάντησε «ναι» αν και
          μόνο αν <InlineMath>{'W^* \\le k'}</InlineMath>. Πολυωνυμικό →{' '}
          <InlineMath>{'\\text{MST}_D \\in \\text{P}'}</InlineMath>.
        </p>
        <p>
          (Παρατήρηση: ισχύει πάντα <InlineMath>{'\\text{P} \\subseteq \\text{NP}'}</InlineMath>,
          οπότε το (iii) ουσιαστικά συνεπάγεται το (ii) — όμως η άσκηση ζητά να
          δειχθούν ρητά και τα δύο.)
        </p>
      </>
    ),
  },
  {
    id: 'pt5-th4',
    title: 'Παλαιό Θέμα #5 · Θέμα 4 — Κολώνες φωτισμού (μέγιστο ανεξάρτητο σύνολο σε μονοπάτι)',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #5',
    problemNumber: 'Θέμα 4',
    weight: 40,
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>
          Ο δήμος θέλει να εγκαταστήσει κολώνες φωτισμού σε{' '}
          <InlineMath>{'n'}</InlineMath> πιθανές θέσεις κατά μήκος ενός δρόμου.
          Για εξοικονόμηση κόστους <strong>δεν</strong> τοποθετεί κολώνες σε δύο
          διαδοχικές θέσεις. Κάθε θέση <InlineMath>{'x_i'}</InlineMath> έχει
          φωτεινότητα <InlineMath>{'\\varphi_i'}</InlineMath>· στόχος είναι ένα{' '}
          υποσύνολο μη-διαδοχικών θέσεων με τη <strong>μέγιστη συνολική
          φωτεινότητα</strong> («μέγιστο ανεξάρτητο υποσύνολο»).
        </p>
        <p>
          Παράδειγμα 7 θέσεων με φωτεινότητες{' '}
          <InlineMath>{'[\\,8,\\ 40,\\ 20,\\ 16,\\ 32,\\ 36,\\ 24\\,]'}</InlineMath>{' '}
          (για <InlineMath>{'x_1, \\ldots, x_7'}</InlineMath>). Π.χ. τα ανεξάρτητα{' '}
          <InlineMath>{'\\{x_1,x_3,x_5,x_7\\}, \\{x_2,x_4,x_6\\}, \\{x_2,x_5,x_7\\}, \\{x_1,x_4,x_7\\}'}</InlineMath>{' '}
          έχουν φωτεινότητες <InlineMath>{'84, 92, 96, 48'}</InlineMath>.
        </p>
        <p>
          <strong>1.</strong> Ο εξής άπληστος αλγόριθμος επιλέγει το καλύτερο
          ανάμεσα στο σύνολο των κορυφών με <em>περιττούς</em> δείκτες και σε
          αυτό με <em>άρτιους</em> δείκτες. Είναι βέλτιστος; Αν όχι, δώσε
          αντιπαράδειγμα. <strong>2.</strong> Σχεδίασε αλγόριθμο δυναμικού
          προγραμματισμού που βρίσκει τη μέγιστη συνολική φωτεινότητα (δώσε την
          αναδρομική σχέση). <strong>3.</strong> Δώσε τον χρόνο εκτέλεσης —
          πρέπει να είναι πολυωνυμικός ως προς το <InlineMath>{'n'}</InlineMath>{' '}
          και ανεξάρτητος των τιμών φωτεινότητας. <strong>4.</strong> Εκτέλεσε
          τον αλγόριθμο στο παραπάνω παράδειγμα.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα είναι το κλασικό <strong>«μέγιστο ανεξάρτητο σύνολο σε
          μονοπάτι»</strong>: διαλέγουμε κορυφές πάνω σε μια γραμμή, χωρίς δύο
          γειτονικές, με μέγιστο άθροισμα βαρών.
        </p>
        <p>
          <strong>1. Είναι ο άπληστος βέλτιστος; ΟΧΙ.</strong>{' '}
          Αντιπαράδειγμα είναι το <em>ίδιο</em> το στιγμιότυπο της εκφώνησης.
          Περιττοί δείκτες <InlineMath>{'\\{x_1,x_3,x_5,x_7\\}'}</InlineMath>:{' '}
          <InlineMath>{'8+20+32+24 = 84'}</InlineMath>. Άρτιοι{' '}
          <InlineMath>{'\\{x_2,x_4,x_6\\}'}</InlineMath>:{' '}
          <InlineMath>{'40+16+36 = 92'}</InlineMath>. Ο άπληστος επιστρέφει{' '}
          <InlineMath>{'\\max(84, 92) = 92'}</InlineMath>. Όμως το ανεξάρτητο{' '}
          <InlineMath>{'\\{x_2,x_5,x_7\\}'}</InlineMath> δίνει{' '}
          <InlineMath>{'40+32+24 = 96 > 92'}</InlineMath>. Άρα ο άπληστος{' '}
          <strong>χάνει το βέλτιστο</strong> — η σωστή λύση δεν είναι ανάγκη να
          είναι «όλα τα μονά» ή «όλα τα ζυγά».
        </p>
        <p>
          <strong>2. Δυναμικός προγραμματισμός.</strong> Ορίζουμε{' '}
          <InlineMath>{'\\text{OPT}(i)'}</InlineMath> = η μέγιστη φωτεινότητα
          χρησιμοποιώντας μόνο τις θέσεις{' '}
          <InlineMath>{'x_1, \\ldots, x_i'}</InlineMath>. Για τη θέση{' '}
          <InlineMath>{'x_i'}</InlineMath> έχουμε δύο επιλογές:
        </p>
        <ul>
          <li>
            <strong>Δεν</strong> βάζουμε κολώνα στο{' '}
            <InlineMath>{'x_i'}</InlineMath> → η λύση είναι{' '}
            <InlineMath>{'\\text{OPT}(i-1)'}</InlineMath>.
          </li>
          <li>
            <strong>Βάζουμε</strong> κολώνα στο{' '}
            <InlineMath>{'x_i'}</InlineMath> → τότε το{' '}
            <InlineMath>{'x_{i-1}'}</InlineMath> απαγορεύεται, οπότε κερδίζουμε{' '}
            <InlineMath>{'\\varphi_i + \\text{OPT}(i-2)'}</InlineMath>.
          </li>
        </ul>
        <BlockMath>{'\\text{OPT}(i) = \\begin{cases} 0 & i = 0 \\\\ \\varphi_1 & i = 1 \\\\ \\max\\{\\, \\text{OPT}(i-1),\\ \\ \\varphi_i + \\text{OPT}(i-2) \\,\\} & i \\ge 2 \\end{cases}'}</BlockMath>
        <p>
          Η ζητούμενη απάντηση είναι <InlineMath>{'\\text{OPT}(n)'}</InlineMath>.
        </p>
        <p>
          <strong>3. Χρόνος εκτέλεσης.</strong> Ο πίνακας έχει{' '}
          <InlineMath>{'n + 1'}</InlineMath> κελιά και κάθε κελί υπολογίζεται σε{' '}
          <InlineMath>{'O(1)'}</InlineMath> (ένα <InlineMath>{'\\max'}</InlineMath>{' '}
          δύο ήδη γνωστών τιμών) → συνολικά{' '}
          <strong><InlineMath>{'\\Theta(n)'}</InlineMath></strong>. Είναι
          πολυωνυμικός ως προς το <InlineMath>{'n'}</InlineMath> και{' '}
          <em>ανεξάρτητος</em> των τιμών φωτεινότητας (δεν εξαρτάται από το πόσο
          μεγάλα είναι τα <InlineMath>{'\\varphi_i'}</InlineMath>).
        </p>
        <p>
          <strong>4. Εκτέλεση στο παράδειγμα</strong>{' '}
          <InlineMath>{'[\\,8,40,20,16,32,36,24\\,]'}</InlineMath>:
        </p>
        <BlockMath>{'\\begin{aligned} \\text{OPT}(0) &= 0 \\\\ \\text{OPT}(1) &= 8 \\\\ \\text{OPT}(2) &= \\max(8,\\ 40+0) = 40 \\\\ \\text{OPT}(3) &= \\max(40,\\ 20+8) = 40 \\\\ \\text{OPT}(4) &= \\max(40,\\ 16+40) = 56 \\\\ \\text{OPT}(5) &= \\max(56,\\ 32+40) = 72 \\\\ \\text{OPT}(6) &= \\max(72,\\ 36+56) = 92 \\\\ \\text{OPT}(7) &= \\max(92,\\ 24+72) = 96 \\end{aligned}'}</BlockMath>
        <p>
          Πίνακας:{' '}
          <InlineMath>{'[\\,0,\\ 8,\\ 40,\\ 40,\\ 56,\\ 72,\\ 92,\\ 96\\,]'}</InlineMath>.
          Η μέγιστη φωτεινότητα είναι{' '}
          <strong><InlineMath>{'\\text{OPT}(7) = 96'}</InlineMath></strong>,
          που επιτυγχάνεται από το ανεξάρτητο σύνολο{' '}
          <InlineMath>{'\\{x_2, x_5, x_7\\}'}</InlineMath> — ακριβώς όσο
          προέβλεπε η εκφώνηση.
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
        <AsymptoticVerdictExplorer preset="front-set-1-ask0" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «ψευδο-εκθετικοί» όροι.</strong> Όροι σαν{' '}
          <InlineMath>{'2^{\\log n}'}</InlineMath>,{' '}
          <InlineMath>{'3^{\\log_3 n}'}</InlineMath>,{' '}
          <InlineMath>{'c^{\\log_c n}'}</InlineMath> ΦΑΙΝΟΝΤΑΙ εκθετικοί αλλά
          είναι απλώς <InlineMath>{'n'}</InlineMath> μεταμφιεσμένο. Πιο γενικά:{' '}
          <InlineMath>{'a^{\\log_a x} = x'}</InlineMath>. Πάντα πρώτα απλοποίηση,
          μετά «κράτα τον κυρίαρχο», μετά εφαρμογή ιεραρχίας.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-1-ask1',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 1 — Διάταξη συναρτήσεων ανά ομάδα',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #1',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Διάταξε τις ακόλουθες συναρτήσεις ως προς την πολυπλοκότητα χρόνου,{' '}
          <strong>ανά ομάδα</strong> (από τη μικρότερη στη μεγαλύτερη τάξη):
        </p>
        <p>
          <strong>Ομάδα Α:</strong>{' '}
          <InlineMath>{'a_1 = \\log(\\log(500n))'}</InlineMath> ·{' '}
          <InlineMath>{'a_2 = 0{,}5\\log(n^{10}) - 5\\log n'}</InlineMath> ·{' '}
          <InlineMath>{'a_3 = (\\log n)^n'}</InlineMath> ·{' '}
          <InlineMath>{'a_4 = \\log(n^n) + 10n^{0{,}5}'}</InlineMath> ·{' '}
          <InlineMath>{'a_5 = \\underbrace{\\log n + \\cdots + \\log n}_{500\\ \\text{φορές}}'}</InlineMath>
        </p>
        <p>
          <strong>Ομάδα Β:</strong>{' '}
          <InlineMath>{'b_1 = \\binom{n}{n-4}'}</InlineMath> ·{' '}
          <InlineMath>{'b_2 = (4n)!'}</InlineMath> ·{' '}
          <InlineMath>{'b_3 = n^{n + n/2}'}</InlineMath> ·{' '}
          <InlineMath>{'b_4 = \\binom{n}{n/4}'}</InlineMath> ·{' '}
          <InlineMath>{'b_5 = n^{48}'}</InlineMath>
        </p>
        <p>
          <strong>Ομάδα Γ:</strong>{' '}
          <InlineMath>{'c_1 = 3^{n^2}'}</InlineMath> ·{' '}
          <InlineMath>{'c_2 = 13n^2'}</InlineMath> ·{' '}
          <InlineMath>{'c_3 = n^{13 + 1/n}'}</InlineMath> ·{' '}
          <InlineMath>{'c_4 = n^{n^n} + n!'}</InlineMath> ·{' '}
          <InlineMath>{'c_5 = 8^{3n\\log n}'}</InlineMath>
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Ομάδα Α — απλοποίηση κάθε όρου.</strong>
        </p>
        <ul>
          <li>
            <InlineMath>{'a_1 = \\log(\\log(500n)) = \\log(\\log 500 + \\log n) = \\Theta(\\log\\log n)'}</InlineMath>{' '}
            (η σταθερά <InlineMath>{'\\log 500'}</InlineMath> πνίγεται).
          </li>
          <li>
            <InlineMath>{'a_2 = 0{,}5\\cdot 10\\log n - 5\\log n = 5\\log n - 5\\log n = \\Theta(1)'}</InlineMath>{' '}
            — οι δύο όροι αλληλοαναιρούνται!
          </li>
          <li>
            <InlineMath>{'a_3 = (\\log n)^n = \\Theta((\\log n)^n)'}</InlineMath>{' '}
            — υπερ-εκθετική.
          </li>
          <li>
            <InlineMath>{'a_4 = \\log(n^n) + 10n^{0{,}5} = n\\log n + 10\\sqrt n = \\Theta(n\\log n)'}</InlineMath>{' '}
            (το <InlineMath>{'n\\log n'}</InlineMath> κυριαρχεί).
          </li>
          <li>
            <InlineMath>{'a_5 = 500\\log n = \\Theta(\\log n)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Διάταξη Α:{' '}
          <InlineMath>{'a_2\\,(\\Theta(1)) < a_1\\,(\\Theta(\\log\\log n)) < a_5\\,(\\Theta(\\log n)) < a_4\\,(\\Theta(n\\log n)) < a_3\\,(\\Theta((\\log n)^n))'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα Β — δουλεύουμε με τάξεις μεγέθους.</strong>
        </p>
        <ul>
          <li>
            <InlineMath>{'b_1 = \\binom{n}{n-4} = \\binom{n}{4} = \\frac{n(n-1)(n-2)(n-3)}{24} = \\Theta(n^4)'}</InlineMath>{' '}
            — πολυωνυμική.
          </li>
          <li>
            <InlineMath>{'b_5 = n^{48} = \\Theta(n^{48})'}</InlineMath> —
            πολυωνυμική, μεγαλύτερου βαθμού.
          </li>
          <li>
            <InlineMath>{'b_4 = \\binom{n}{n/4}'}</InlineMath> — με προσέγγιση
            Stirling βγαίνει <strong>εκθετική</strong>, της μορφής{' '}
            <InlineMath>{'\\Theta(d^n\\cdot n^{-1/2})'}</InlineMath> για μια
            σταθερά <InlineMath>{'d \\approx 1{,}75 > 1'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'b_3 = n^{3n/2} = \\Theta(n^{3n/2})'}</InlineMath> —{' '}
            της μορφής <InlineMath>{'n^{\\Theta(n)}'}</InlineMath>, πολύ
            μεγαλύτερη από κάθε <InlineMath>{'d^n'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'b_2 = (4n)!'}</InlineMath> — παραγοντική, η μεγαλύτερη
            όλων (Stirling: <InlineMath>{'\\Theta(n^{4n+1/2}(4/e)^{4n})'}</InlineMath>).
          </li>
        </ul>
        <p>
          Η κλιμάκωση είναι: πολυώνυμο{' '}
          <InlineMath>{'<'}</InlineMath> εκθετικό{' '}
          <InlineMath>{'<'}</InlineMath>{' '}
          <InlineMath>{'n^{\\Theta(n)}'}</InlineMath>{' '}
          <InlineMath>{'<'}</InlineMath> παραγοντικό. Διάταξη Β:{' '}
          <InlineMath>{'b_1 < b_5 < b_4 < b_3 < b_2'}</InlineMath>.
        </p>
        <p>
          <strong>Ομάδα Γ — το κόλπο του λογαρίθμου.</strong> Όταν οι
          συναρτήσεις είναι «εκθετικού τύπου», τις συγκρίνουμε μέσω των{' '}
          <InlineMath>{'\\log c_i'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'\\log c_1 = \\log(3^{n^2}) = n^2\\log 3 = \\Theta(n^2)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_2 = \\log(13n^2) = \\Theta(\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_3 = (13 + 1/n)\\log n = \\Theta(\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_4 = \\log(n^{n^n} + n!) = \\Theta(n^n\\log n)'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\log c_5 = 3n\\log n\\cdot\\log 8 = \\Theta(n\\log n)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Τα <InlineMath>{'\\log c_2'}</InlineMath> και{' '}
          <InlineMath>{'\\log c_3'}</InlineMath> πέφτουν στην <em>ίδια</em>{' '}
          κλάση <InlineMath>{'\\Theta(\\log n)'}</InlineMath> — μόνο τότε
          συγκρίνουμε απευθείας τα <InlineMath>{'c_2, c_3'}</InlineMath>:{' '}
          αφού <InlineMath>{'2 < 13 + 1/n'}</InlineMath>, είναι{' '}
          <InlineMath>{'13n^2 < n^{13+1/n}'}</InlineMath>, άρα{' '}
          <InlineMath>{'c_2 < c_3'}</InlineMath>. Διάταξη Γ:{' '}
          <InlineMath>{'c_2 < c_3 < c_5 < c_1 < c_4'}</InlineMath>.
        </p>
        <p>
          Δες τις τρεις ομάδες να ταξινομούνται live καθώς αυξάνεται το{' '}
          <InlineMath>{'n'}</InlineMath> — οι μπάρες ξεκινούν μπερδεμένες και
          σταθεροποιούνται στην κανονική διάταξη:
        </p>
        <FunctionOrderingRace preset="fs1-ask1-A" />
        <FunctionOrderingRace preset="fs1-ask1-B" />
        <FunctionOrderingRace preset="fs1-ask1-C" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «πρώτα απλοποίησε σε Θ-class, μετά διάταξε».</strong>{' '}
          Σπάνια συγκρίνεις τις πραγματικές εκφράσεις — σχεδόν πάντα υπάρχει
          αλγεβρική απλοποίηση που τις φέρνει σε γνωστή τάξη (Θ(1), Θ(log n),
          Θ(n^k), Θ(2^n), Θ(n!)). Δύο εξωτικές περιπτώσεις: (α) δύο όροι
          αλληλοαναιρούνται → σταθερά· (β) δύο εκφράσεις πέφτουν στην ΙΔΙΑ
          Θ-class — μόνο τότε χρειάζεσαι λεπτότερη σύγκριση συντελεστών.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-1-ask3',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 3 — Πολυπλοκότητα με επαναλαμβανόμενο λογάριθμο',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #1',
    problemNumber: 'Άσκηση 3',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>Υπολόγισε την πολυπλοκότητα χρόνου του αλγορίθμου:</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`begin algorithm
  arg ← -1
  for i ← 1 to n with step 1 do
    m ← i
    while m > 0 do
      m ← log(m)
    end while
    for j ← 1 to m with step 1 do
      arg ← i · i · j
    end for
  end algorithm`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Ο εξωτερικός βρόχος <InlineMath>{'i'}</InlineMath> τρέχει{' '}
          <InlineMath>{'n'}</InlineMath> φορές → <InlineMath>{'O(n)'}</InlineMath>.
          Μένει να βρούμε το κόστος του «σώματος» (η{' '}
          <InlineMath>{'\\text{while}'}</InlineMath> και ο δεύτερος{' '}
          <InlineMath>{'\\text{for}'}</InlineMath>).
        </p>
        <p>
          <strong>Ο βρόχος <InlineMath>{'\\text{while}'}</InlineMath>.</strong>{' '}
          Ξεκινά με <InlineMath>{'m = i'}</InlineMath> και κάθε φορά κάνει{' '}
          <InlineMath>{'m \\leftarrow \\log m'}</InlineMath> — εφαρμόζει
          λογάριθμο ξανά και ξανά. Πόσες φορές μπορείς να πάρεις λογάριθμο σε
          έναν αριθμό πριν αυτός πέσει στο <InlineMath>{'\\le 1'}</InlineMath>;{' '}
          Ακριβώς <InlineMath>{'\\log^*(n)'}</InlineMath> φορές — ο{' '}
          <strong>επαναλαμβανόμενος λογάριθμος</strong> (log star), μια
          συνάρτηση που μεγαλώνει απίστευτα αργά. Μετά απαιτείται το πολύ ένα
          ακόμα βήμα για να γίνει <InlineMath>{'m \\le 0'}</InlineMath> και να
          σταματήσει. Άρα η <InlineMath>{'\\text{while}'}</InlineMath> κάνει{' '}
          <InlineMath>{'O(\\log^* n)'}</InlineMath> επαναλήψεις.
        </p>
        <p>
          <strong>Ο δεύτερος <InlineMath>{'\\text{for}'}</InlineMath> — η
          παγίδα.</strong> Τρέχει <InlineMath>{'j'}</InlineMath> από{' '}
          <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'m'}</InlineMath>.
          Όμως μόλις τελείωσε η <InlineMath>{'\\text{while}'}</InlineMath>, το{' '}
          <InlineMath>{'m'}</InlineMath> είναι <InlineMath>{'\\le 0'}</InlineMath>!{' '}
          Άρα ο βρόχος <InlineMath>{'j \\leftarrow 1 \\ldots m'}</InlineMath>{' '}
          δεν εκτελείται <em>ποτέ</em> → <InlineMath>{'O(1)'}</InlineMath>.
        </p>
        <p>
          <strong>Σύνθεση.</strong> Η <InlineMath>{'\\text{while}'}</InlineMath>{' '}
          και ο δεύτερος <InlineMath>{'\\text{for}'}</InlineMath> είναι{' '}
          <em>διαδοχικοί</em> (όχι ένας μέσα στον άλλον), άρα το κόστος του
          σώματος είναι <InlineMath>{'\\max\\{O(\\log^* n),\\ O(1)\\} = O(\\log^* n)'}</InlineMath>.
          Αυτό το σώμα είναι εμφωλευμένο στον εξωτερικό βρόχο, άρα:
        </p>
        <BlockMath>{'T(n) = O(n) \\cdot O(\\log^* n) = O(n\\log^* n)'}</BlockMath>
        <p>
          Δες το trace ζωντανά — η εσωτερική <code>for j ← 1 to m</code>{' '}
          εμφανίζεται με σήμα «trap» γιατί ΔΕΝ τρέχει ΠΟΤΕ (το{' '}
          <InlineMath>{'m'}</InlineMath> είναι ήδη <InlineMath>{'\\le 0'}</InlineMath>):
        </p>
        <LoopComplexityTrace preset="front-set-1-ask3" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «διάβασε το state ΠΡΙΝ από κάθε βρόχο».</strong>{' '}
          Η πιο συχνή παγίδα σε ανάλυση εμφωλευμένων: ο εσωτερικός βρόχος
          ΦΑΙΝΕΤΑΙ να τρέχει αλλά ΔΕΝ τρέχει επειδή το όριό του είναι ≤ 0 (ή
          δεν αλλάζει). Έλεγξε τις τιμές των μεταβλητών στο σημείο που μπαίνεις
          στον βρόχο. Δεύτερη παγίδα: <InlineMath>{'\\log^* n'}</InlineMath>{' '}
          (επαναλαμβανόμενος λογάριθμος) είναι σχεδόν σταθερά — γρήγορη
          εκτίμηση: για κάθε ρεαλιστικό <InlineMath>{'n'}</InlineMath>{' '}
          (ως 2^65536), <InlineMath>{'\\log^* n \\le 5'}</InlineMath>.
        </Callout>
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
        <p>
          Δες τα δύο πιο διδακτικά υπο-ερωτήματα ζωντανά — η αρμονική σειρά
          συμπεριφέρεται σαν λογάριθμος, και ο λογάριθμος του παραγοντικού
          συμπεριφέρεται σαν <InlineMath>{'n\\log n'}</InlineMath>:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask2-a" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask2-b" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: αναγνώρισε τα τέσσερα «αναπόφευκτα» αθροίσματα.</strong>{' '}
          (α) <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath> (αρμονικό
          → λογάριθμος μέσω ολοκληρώματος του <InlineMath>{'1/x'}</InlineMath>).
          (β) <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath> (Stirling
          — ή απευθείας: οι μισοί όροι είναι <InlineMath>{'\\ge \\log(n/2)'}</InlineMath>).
          (γ) <InlineMath>{'\\sum \\binom{n}{k} = 2^n'}</InlineMath> ακριβώς (διωνυμικό
          θεώρημα). (δ) Ανακλαστικότητα — αν το αριστερό = δεξιό, η σχέση είναι
          τετριμμένα Θ.
        </Callout>
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
        <p>
          Δες τους δύο διαγωνισμούς live. Πρόσεξε ιδιαίτερα στην ομάδα b: το{' '}
          <InlineMath>{'b_4 = 4002^{4002}'}</InlineMath> είναι τεράστια
          σταθερά — στο γράφημα φαίνεται γιγάντιο, αλλά οριακά πέφτει κάτω από
          τα παραμετρικά σε <InlineMath>{'n'}</InlineMath> μόλις αυτά πιάσουν
          την (τεράστια!) τιμή της σταθεράς.
        </p>
        <FunctionOrderingRace preset="fs2-ask0-b" />
        <FunctionOrderingRace preset="fs2-ask0-f" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «log και των δύο» για εκθετικούς πύργους.</strong>{' '}
          Όταν συγκρίνεις <InlineMath>{'a^{u(n)}'}</InlineMath> με{' '}
          <InlineMath>{'b^{v(n)}'}</InlineMath>, παίρνεις log:{' '}
          <InlineMath>{'u(n)\\log a'}</InlineMath> vs{' '}
          <InlineMath>{'v(n)\\log b'}</InlineMath>. Συνήθως αρκεί. Πρόσεξε
          σταθερές που μεταμφιέζονται σε «τέρατα» (<InlineMath>{'4002^{4002}'}</InlineMath>{' '}
          είναι σταθερά — όχι συνάρτηση του n!) και ζευγάρια που πέφτουν στην
          ίδια κλάση — εκεί χρειάζεσαι σύγκριση συντελεστών.
        </Callout>
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
        <p>
          Δες την συνεισφορά κάθε ζώνης ξεχωριστά — η ροζ ζώνη (οι δύο
          τελευταίες θέσεις με <InlineMath>{'p = 1/8'}</InlineMath> η καθεμία)
          από μόνη της φορτώνει <InlineMath>{'\\ge n/4'}</InlineMath> στον λογαριασμό:
        </p>
        <ExpectedTimeBreakdown />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «ψάξε για ζώνη που από μόνη της δίνει Ω(τάξης)».</strong>{' '}
          Για να αποδείξεις ασυμπτωτικά κάτω φράγμα σε αναμενόμενο χρόνο, αρκεί
          να βρεις ΜΙΑ ομάδα εκβάσεων με «αρκετή» πιθανότητα και «αρκετό»
          κόστος. Για άνω φράγμα, χρησιμοποίησε ότι κάθε κόστος είναι το πολύ
          το maximum (συνήθως <InlineMath>{'n+1'}</InlineMath>) και ότι οι
          πιθανότητες αθροίζουν σε 1. Συνήθως τα δύο φράγματα πέφτουν στην ίδια
          τάξη — άρα Θ.
        </Callout>
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
        <p>
          <strong>Για το (α) — δες τι σπάει.</strong> Πάρε{' '}
          <InlineMath>{'f = kn,\\ g = n'}</InlineMath>. Σταθερός λόγος{' '}
          <InlineMath>{'f/g = k'}</InlineMath> → <InlineMath>{'f = O(g)'}</InlineMath>.
          Αλλά μετά την εκθετικοποίηση, ο λόγος γίνεται{' '}
          <InlineMath>{'2^{(k-1)n}'}</InlineMath> και φεύγει στο ∞:
        </p>
        <ExponentiationBreaksO />
        <p>
          <strong>Για το (β) — η κλασική σφήνα.</strong> Κάθε όρος{' '}
          <InlineMath>{'k^{1/k}'}</InlineMath> είναι «σφηνωμένος» μεταξύ 1 και 2:
        </p>
        <SandwichTheoremViz preset="front-set-2-ask3-b" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: O ΔΕΝ διατηρείται κάτω από εκθετικοποίηση.</strong>{' '}
          Σταθερός παράγοντας στον εκθέτη γίνεται εκθετικός παράγοντας έξω:{' '}
          <InlineMath>{'2^{kn} = (2^n)^k'}</InlineMath>. Παρόμοιες παγίδες: το O
          ΔΕΝ διατηρείται και κάτω από <strong>τετράγωνο</strong>
          (<InlineMath>{'f = O(g) \\not\\Rightarrow f^2 = O(g)'}</InlineMath>, π.χ.{' '}
          <InlineMath>{'n = O(n)'}</InlineMath> αλλά <InlineMath>{'n^2 \\notin O(n)'}</InlineMath>) —
          αλλά διατηρείται κάτω από <strong>σταθερές δυνάμεις</strong> από κοινού (αν{' '}
          <InlineMath>{'f = O(g)'}</InlineMath> τότε <InlineMath>{'f^k = O(g^k)'}</InlineMath>).
        </Callout>
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
        <p>
          <strong>(α) ζωντανά</strong> — το ίδιο preset με την πρόταση{' '}
          <InlineMath>{'pt5\\text{-}th2\\text{-}a'}</InlineMath>, αφού το (α) είναι
          ίδια εκφώνηση:
        </p>
        <AsymptoticVerdictExplorer preset="pt5-th2-a" />
        <p>
          <strong>(β) ζωντανά</strong> — η εκθετική κατάρρευση της{' '}
          <InlineMath>{'(2/5)^n'}</InlineMath> κερδίζει εύκολα το{' '}
          <InlineMath>{'n^2'}</InlineMath>· ο λόγος f/1 πάει στο 0:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask5-b" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «βάση εκθετικού».</strong> Όταν δεις{' '}
          <InlineMath>{'a^n'}</InlineMath>: αν <InlineMath>{'a > 1'}</InlineMath>{' '}
          η συνάρτηση εκρήγνυται· αν <InlineMath>{'a < 1'}</InlineMath> καταρρέει
          εκθετικά· αν <InlineMath>{'a = 1'}</InlineMath> είναι σταθερά. Η εκθετική
          κατάρρευση είναι αρκετά γρήγορη ώστε να νικά κάθε πολυωνυμικό μπροστά
          της. Άρα <InlineMath>{'n^k \\cdot a^n \\to 0'}</InlineMath> για κάθε{' '}
          <InlineMath>{'k'}</InlineMath> και <InlineMath>{'a < 1'}</InlineMath>.
        </Callout>
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
        <LoopComplexityTrace preset="front-set-2-ask6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: από μέσα προς τα έξω, πολλαπλασίασε τάξεις.</strong>{' '}
          Για εμφωλευμένους βρόχους:
          (1) Ξεκίνα από την πιο εσωτερική διαδικασία (εδώ CALC) — μέτρα τις
          επαναλήψεις της ως συνάρτηση του ορίσματος.
          (2) Πολλαπλασίασε με τις επαναλήψεις του επόμενου επιπέδου.
          (3) Συνέχισε προς τα έξω.
          Πρόσεξε: βήμα μη-μοναδιαίο (π.χ. 0.1) είναι σταθερά — δεν αλλάζει την
          τάξη. Όριο βρόχου που εξαρτάται από το <InlineMath>{'i'}</InlineMath>{' '}
          (όπως <InlineMath>{'i'}</InlineMath> ως <InlineMath>{'i^2'}</InlineMath>) απαιτεί άθροισμα,
          όχι απλό πολλαπλασιασμό.
        </Callout>
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
        <p>
          Έξι ζευγάρια, έξι σύντομα verdict-explorers. Δες πώς κάθε
          γραμμή του πίνακα αντιστοιχεί σε διαφορετική «λογική»:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-1" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-2" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-3" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-4" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-5" />
        <AsymptoticVerdictExplorer preset="front-set-2-ask7-6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: αναγνώρισε ποια από τις «6 αρχέτυπες» μάχες είσαι σε.</strong>{' '}
          Σχεδόν κάθε σύγκριση ασυμπτωτικού πέφτει σε μία από αυτές:
          (1) πολυλογάριθμος vs πολυώνυμο,
          (2) πολυώνυμο vs εκθετικό,
          (3) ταλάντωση → ασύγκριτες,
          (4) ίδια βάση, διαφορετικός εκθέτης → τετράγωνο/κύβος,
          (5) η ταυτότητα <InlineMath>{'n^{\\log c} = c^{\\log n}'}</InlineMath>{' '}
          (κρυφή ισότητα),
          (6) log(n!) = Θ(log(n^n)) (Stirling).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-2-ask4',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 4 — Ασυμπτωτική τάξη και διάταξη συναρτήσεων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #2',
    problemNumber: 'Άσκηση 4',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Βρες την ασυμπτωτική συμπεριφορά των παρακάτω συναρτήσεων,
          προσδιορίζοντας για κάθε μία αν είναι{' '}
          <InlineMath>{'\\Theta(n^m \\log^k n)'}</InlineMath> ή{' '}
          <InlineMath>{'\\Theta(m^{n^k})'}</InlineMath> για κατάλληλες
          μη-αρνητικές ακέραιες τιμές των <InlineMath>{'k, m'}</InlineMath>:
        </p>
        <p>
          1. &nbsp;(α΄) <InlineMath>{'\\log\\!\\left(n^{\\log n} + 2^n\\right)'}</InlineMath>
          &nbsp;·&nbsp; (β΄) <InlineMath>{'\\sum_{k=1}^{n} k\\sqrt[k]{k}'}</InlineMath>
          &nbsp;·&nbsp; (γ΄) <InlineMath>{'5^{H_n},\\ \\ H_n = \\sum_{k=1}^{n}\\frac{1}{k}'}</InlineMath>
          &nbsp;·&nbsp; (δ΄) <InlineMath>{'\\log(n!)\\cdot\\sum_{i=1}^{n}\\frac{1}{2}'}</InlineMath>
        </p>
        <p>
          2. &nbsp;Να τις διατάξεις σε αύξουσα τάξη μεγέθους καθώς το{' '}
          <InlineMath>{'n'}</InlineMath> τείνει στο άπειρο.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το κόλπο σε όλα τα ερωτήματα — «θεώρημα της σφήνας».</strong>{' '}
          Όταν μια συνάρτηση είναι δύσκολο να την υπολογίσεις απευθείας, βρίσκεις
          μια <em>μικρότερη</em> και μια <em>μεγαλύτερη</em> που την «κλείνουν»
          ανάμεσά τους. Αν και οι δύο φράχτες έχουν την <strong>ίδια τάξη</strong>,
          τότε ό,τι βρίσκεται ανάμεσά τους έχει αναγκαστικά κι αυτό την ίδια τάξη.
        </p>
        <p>
          <strong>(α΄) <InlineMath>{'\\log(n^{\\log n} + 2^n)'}</InlineMath>.</strong>{' '}
          Πρώτα ξεμπλέκουμε τον περίεργο όρο <InlineMath>{'n^{\\log n}'}</InlineMath>.
          Γράφουμε <InlineMath>{'n = 2^{\\log n}'}</InlineMath>, οπότε{' '}
          <InlineMath>{'n^{\\log n} = \\left(2^{\\log n}\\right)^{\\log n} = 2^{\\log^2 n}'}</InlineMath>.
          Αφού <InlineMath>{'\\log^2 n < n'}</InlineMath> τελικά, είναι{' '}
          <InlineMath>{'n^{\\log n} = 2^{\\log^2 n} \\le 2^n'}</InlineMath>. Άρα το
          άθροισμα μέσα στον λογάριθμο κλείνεται:
        </p>
        <BlockMath>{'2^n \\;\\le\\; n^{\\log n} + 2^n \\;\\le\\; 2\\cdot 2^n'}</BlockMath>
        <p>
          Παίρνοντας λογάριθμο και στα τρία:{' '}
          <InlineMath>{'n\\log 2 \\le \\log(n^{\\log n}+2^n) \\le \\log 2 + n\\log 2'}</InlineMath>.
          Και οι δύο φράχτες είναι <InlineMath>{'\\Theta(n)'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\log(n^{\\log n}+2^n) = \\Theta(n) = \\Theta(n^1\\log^0 n)'}</InlineMath>
          &nbsp;— δηλαδή <InlineMath>{'m=1,\\ k=0'}</InlineMath>.
        </p>
        <p>
          <strong>(β΄) <InlineMath>{'\\sum_{k=1}^{n} k\\sqrt[k]{k}'}</InlineMath>.</strong>{' '}
          Ο όρος <InlineMath>{'\\sqrt[k]{k} = k^{1/k}'}</InlineMath> είναι ένας
          αριθμός πολύ κοντά στο <InlineMath>{'1'}</InlineMath>. Φράζουμε:
        </p>
        <ul>
          <li>
            <strong>Κάτω:</strong> <InlineMath>{'k^{1/k} \\ge 1'}</InlineMath> για{' '}
            <InlineMath>{'k\\ge 1'}</InlineMath>, άρα{' '}
            <InlineMath>{'k\\sqrt[k]{k} \\ge k'}</InlineMath> και{' '}
            <InlineMath>{'\\sum_{k=1}^{n} k = \\tfrac{n(n+1)}{2} = \\Theta(n^2)'}</InlineMath>.
          </li>
          <li>
            <strong>Πάνω:</strong> <InlineMath>{'k^{1/k} = 2^{(\\log k)/k} \\le 2^1 = 2'}</InlineMath>{' '}
            (γιατί <InlineMath>{'(\\log k)/k \\le 1'}</InlineMath>), άρα{' '}
            <InlineMath>{'k\\sqrt[k]{k} \\le 2k'}</InlineMath> και{' '}
            <InlineMath>{'\\sum_{k=1}^{n} 2k = n(n+1) = \\Theta(n^2)'}</InlineMath>.
          </li>
        </ul>
        <p>
          Σφήνα: <InlineMath>{'\\Theta(n^2) \\le \\sum k\\sqrt[k]{k} \\le \\Theta(n^2)'}</InlineMath>,
          άρα το άθροισμα είναι <InlineMath>{'\\Theta(n^2) = \\Theta(n^2\\log^0 n)'}</InlineMath>
          &nbsp;— <InlineMath>{'m=2,\\ k=0'}</InlineMath>.
        </p>
        <p>
          <strong>(γ΄) <InlineMath>{'5^{H_n}'}</InlineMath>.</strong> Ο αρμονικός
          αριθμός μεγαλώνει σαν λογάριθμος:{' '}
          <InlineMath>{'H_n = \\sum_{k=1}^{n}\\tfrac1k \\approx \\ln n + \\gamma'}</InlineMath>{' '}
          (όπου <InlineMath>{'\\gamma\\approx 0{,}577'}</InlineMath> η σταθερά
          Euler). Άρα:
        </p>
        <BlockMath>{'5^{H_n} \\approx 5^{\\ln n + \\gamma} = 5^{\\ln n}\\cdot 5^{\\gamma} = n^{\\ln 5}\\cdot 5^{\\gamma}'}</BlockMath>
        <p>
          Επειδή <InlineMath>{'\\ln 5 \\approx 1{,}6'}</InlineMath>, βγαίνει{' '}
          <InlineMath>{'5^{H_n} = \\Theta(n^{\\ln 5}) \\approx \\Theta(n^{1{,}6})'}</InlineMath>.
          <strong> Προσοχή στην παγίδα:</strong> αυτό <em>δεν</em> γράφεται σε
          καμία από τις δύο ζητούμενες μορφές με ακέραιους εκθέτες — ο εκθέτης{' '}
          <InlineMath>{'1{,}6'}</InlineMath> πέφτει αυστηρά ανάμεσα:{' '}
          <InlineMath>{'n^1 < n^{1{,}6} < n^2'}</InlineMath>. (Αυστηρά: από{' '}
          <InlineMath>{'\\ln(n+1) \\le H_n \\le \\ln n + 1'}</InlineMath> παίρνεις{' '}
          <InlineMath>{'(n+1)^{\\ln 5} \\le 5^{H_n} \\le 5\\,n^{\\ln 5}'}</InlineMath>,
          και οι δύο φράχτες <InlineMath>{'\\Theta(n^{\\ln 5})'}</InlineMath>.)
        </p>
        <p>
          <strong>(δ΄) <InlineMath>{'\\log(n!)\\cdot\\sum_{i=1}^{n}\\tfrac12'}</InlineMath>.</strong>{' '}
          Δύο γνωστά κομμάτια πολλαπλασιασμένα. Από τον τύπο Stirling,{' '}
          <InlineMath>{'\\log(n!) = \\Theta(n\\log n)'}</InlineMath>. Το άθροισμα{' '}
          <InlineMath>{'\\sum_{i=1}^{n}\\tfrac12'}</InlineMath> είναι απλώς το{' '}
          <InlineMath>{'\\tfrac12'}</InlineMath> προστιθέμενο{' '}
          <InlineMath>{'n'}</InlineMath> φορές, δηλαδή{' '}
          <InlineMath>{'\\tfrac n2 = \\Theta(n)'}</InlineMath>. Γινόμενο:{' '}
          <InlineMath>{'\\Theta(n\\log n)\\cdot\\Theta(n) = \\Theta(n^2\\log n)'}</InlineMath>
          &nbsp;— <InlineMath>{'m=2,\\ k=1'}</InlineMath>.
        </p>
        <p>
          <strong>2. Διάταξη.</strong> Βάζουμε τις τέσσερις τάξεις από τη
          μικρότερη στη μεγαλύτερη:
        </p>
        <BlockMath>{'\\underbrace{\\Theta(n)}_{(\\alpha\')} \\;<\\; \\underbrace{\\Theta(n^{1{,}6})}_{(\\gamma\')} \\;<\\; \\underbrace{\\Theta(n^2)}_{(\\beta\')} \\;<\\; \\underbrace{\\Theta(n^2\\log n)}_{(\\delta\')}'}</BlockMath>
        <p>
          Δες τη «παγίδα» του (γ΄) ζωντανά — η <InlineMath>{'5^{H_n}'}</InlineMath>{' '}
          φαίνεται εκθετική, αλλά ο αρμονικός αριθμός στον εκθέτη την μετατρέπει σε
          πολυώνυμο <InlineMath>{'n^{\\ln 5} \\approx n^{1.6}'}</InlineMath>:
        </p>
        <AsymptoticVerdictExplorer preset="front-set-2-ask4-c" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: «σφήνωσε από κάτω και από πάνω».</strong> Όταν
          δεν μπορείς να υπολογίσεις απευθείας μια συνάρτηση, βρες μια μικρότερη
          και μια μεγαλύτερη με την ΙΔΙΑ ασυμπτωτική τάξη. Εδώ:{' '}
          <InlineMath>{'\\Theta(n^2) \\le \\sum k\\sqrt[k]{k} \\le \\Theta(n^2)'}</InlineMath>{' '}
          → πιάστηκε η μέση σε <InlineMath>{'\\Theta(n^2)'}</InlineMath>. Πρόσεξε
          επίσης το ψεύδο-εκθετικό <InlineMath>{'a^{H_n}'}</InlineMath>: ο{' '}
          <InlineMath>{'H_n \\approx \\ln n'}</InlineMath> μετατρέπει την σε{' '}
          <InlineMath>{'n^{\\ln a}'}</InlineMath> — πολυώνυμο με μη-ακέραιο εκθέτη.
        </Callout>
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
          Master Theorem δεν εφαρμόζεται — το πρόβλημα μικραίνει{' '}
          <em>κατά 1</em>, όχι με διαίρεση. Πάμε σε{' '}
          <strong>τηλεσκόπηση</strong>: γράφουμε τη σχέση για διαδοχικά{' '}
          <InlineMath>{'n'}</InlineMath> και προσθέτουμε κατά μέλη — οι
          ενδιάμεσοι όροι αλληλοαναιρούνται. Πάτα «+ Επόμενη γραμμή» για να
          δεις τη συσσώρευση:
        </p>
        <RecurrenceTelescope preset="front-set-3-ask4" />
        <p>
          Συγκεντρωτικά: όλοι οι όροι <InlineMath>{'T(1), T(2), \\dots, T(n-1)'}</InlineMath>{' '}
          εμφανίζονται μία φορά θετικοί και μία αρνητικοί — διαγράφονται. Μένει
          μόνο
        </p>
        <BlockMath>{'T(n) - T(0) = \\sum_{i=1}^{n} 2^i = 2^{n+1} - 2.'}</BlockMath>
        <p>Με <InlineMath>{'T(0) = 5'}</InlineMath>:</p>
        <BlockMath>{'T(n) = 2^{n+1} + 3 = \\Theta(2^n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «μικραίνει κατά 1 ⇒ τηλεσκόπηση».</strong>{' '}
          Για αναδρομές <InlineMath>{'T(n) = T(n-1) + g(n)'}</InlineMath>:
          γράψε τη σχέση για 1, 2, …, n, πρόσθεσε κατά μέλη, αναγνώρισε το{' '}
          άθροισμα <InlineMath>{'\\sum g(i)'}</InlineMath>. Η ασυμπτωτική του{' '}
          <InlineMath>{'T(n)'}</InlineMath> ταυτίζεται με αυτή του αθροίσματος:{' '}
          g=c → Θ(n), g=i → Θ(n²), g=2ⁱ → Θ(2ⁿ) (η σειρά κυριαρχείται από τον
          τελευταίο όρο).
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask1',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 1 — Κλειστός τύπος των αριθμών Fibonacci',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δίνεται η ακολουθία των αριθμών Fibonacci:
        </p>
        <BlockMath>{'F(n) = \\begin{cases} 0, & n = 0 \\\\ 1, & n = 1 \\\\ F(n-1) + F(n-2), & n \\ge 2 \\end{cases}'}</BlockMath>
        <p>
          Λύσε την αναδρομική σχέση (βρες κλειστό τύπο για το{' '}
          <InlineMath>{'F(n)'}</InlineMath>) και προσδιόρισε την ασυμπτωτική της
          τάξη.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η <InlineMath>{'F(n) = F(n-1) + F(n-2)'}</InlineMath> είναι{' '}
          <strong>ομογενής γραμμική αναδρομή</strong> — κάθε όρος είναι
          σταθερός γραμμικός συνδυασμός προηγούμενων, χωρίς εξωτερικό
          προσθετέο. Η μέθοδος-εργαλείο για αυτές είναι η{' '}
          <strong>χαρακτηριστική εξίσωση</strong>: μάντεψε λύση{' '}
          <InlineMath>{'F(n) = x^n'}</InlineMath>, αντικατάστησε, βρες ρίζες,
          γράψε γενική λύση, βρες σταθερές από τις αρχικές συνθήκες. Δες κάθε
          βήμα ζωντανά (επιλεγμένη η καρτέλα Fibonacci):
        </p>
        <CharEquationLab initialMode="fib" />
        <p>
          <strong>Σύνοψη.</strong> Η χαρακτηριστική <InlineMath>{'x^2-x-1=0'}</InlineMath>{' '}
          δίνει δύο διαφορετικές ρίζες <InlineMath>{'\\varphi, \\psi'}</InlineMath>.
          Από τις <InlineMath>{'F_0=0, F_1=1'}</InlineMath> προκύπτει ο τύπος
          του Binet:
        </p>
        <BlockMath>{'F_n = \\frac{1}{\\sqrt5}\\,\\varphi^n - \\frac{1}{\\sqrt5}\\,\\psi^n'}</BlockMath>
        <p>
          Επειδή <InlineMath>{'|\\psi| < 1'}</InlineMath>, ο δεύτερος όρος
          φθίνει στο μηδέν. Κυριαρχεί ο πρώτος:
        </p>
        <BlockMath>{'F_n = \\Theta(\\varphi^n) \\approx \\Theta(1{,}618^n) - \\text{εκθετική.}'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «ομογενής γραμμική ⇒ χαρακτηριστική εξίσωση».</strong>{' '}
          Όποτε δεις <InlineMath>{'T(n) = c_1 T(n-1) + c_2 T(n-2) + \\cdots'}</InlineMath>{' '}
          χωρίς εξωτερικό όρο, ακολούθησε τη συνταγή σε 3 βήματα: (1) γράψε τη
          χαρακτηριστική πολυωνυμική εξίσωση, (2) βρες ρίζες — αν διαφορετικές,
          γενική λύση = γραμμικός συνδυασμός των <InlineMath>{'r_i^n'}</InlineMath>,
          αν διπλή πολλαπλασίαζε με n (δες front-set-3-ask2), (3) λύσε για τις
          σταθερές από τις αρχικές συνθήκες. Η ασυμπτωτική κυριαρχείται από τη{' '}
          ρίζα με μεγαλύτερο μέτρο.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask2',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 2 — Αναδρομή με διπλή ρίζα',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>Λύσε την αναδρομική σχέση:</p>
        <BlockMath>{'T(n) = \\begin{cases} 3, & n = 0 \\\\ 8, & n = 1 \\\\ 4\\,T(n-1) - 4\\,T(n-2), & n \\ge 2 \\end{cases}'}</BlockMath>
      </>
    ),
    solution: (
      <>
        <p>
          Πάλι ομογενής γραμμική → χαρακτηριστική εξίσωση. Η{' '}
          <strong>παγίδα εδώ</strong>: η εξίσωση{' '}
          <InlineMath>{'x^2 - 4x + 4 = 0'}</InlineMath> έχει{' '}
          <strong>διπλή ρίζα</strong> <InlineMath>{'x = 2'}</InlineMath>. Δύο
          πανομοιότυποι όροι <InlineMath>{'\\lambda_1 2^n + \\lambda_2 2^n'}</InlineMath>{' '}
          συνθλίβονται σε έναν — χάνουμε ένα βαθμό ελευθερίας και δεν μπορούμε
          να ικανοποιήσουμε δύο αρχικές συνθήκες. <strong>Το ×n κόλπο</strong>{' '}
          λύνει το πρόβλημα: ο δεύτερος όρος γίνεται{' '}
          <InlineMath>{'\\lambda_2 \\cdot n \\cdot 2^n'}</InlineMath>.
        </p>
        <CharEquationLab initialMode="double" />
        <p>
          <strong>Σύνοψη.</strong> Με <InlineMath>{'\\lambda_1 = 3, \\lambda_2 = 1'}</InlineMath>:
        </p>
        <BlockMath>{'T_n = 3\\cdot 2^n + n\\cdot 2^n = (n+3)\\,2^n = \\Theta(n\\,2^n).'}</BlockMath>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «πολλαπλότητα m ⇒ πολλαπλασίαζε με n^k».</strong>{' '}
          Όταν μια ρίζα <InlineMath>{'r'}</InlineMath> έχει πολλαπλότητα{' '}
          <InlineMath>{'m'}</InlineMath>, η συνεισφορά της στη γενική λύση είναι{' '}
          <InlineMath>{'\\lambda_0 r^n + \\lambda_1 n r^n + \\cdots + \\lambda_{m-1} n^{m-1} r^n'}</InlineMath>.
          Το γενικό κόλπο για χαμένα γραμμικά συστήματα. (Συνηθισμένη εξεταστική
          παγίδα: φοιτητής γράφει «<InlineMath>{'\\lambda_1 r^n + \\lambda_2 r^n'}</InlineMath>»{' '}
          και τα δύο λ συγχωνεύονται σε ένα — οι δύο αρχικές συνθήκες δίνουν
          αντιφατικό σύστημα.)
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask7',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 7 — Σύγκριση τριών αλγορίθμων D&C',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Μια ομάδα προγραμματιστών εργάζεται για την επίλυση ενός υπολογιστικού
          προβλήματος <InlineMath>{'P'}</InlineMath> και έχει δημιουργήσει 3
          διαφορετικούς αλγορίθμους «διαίρει και βασίλευε»:
        </p>
        <ul>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_1'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>4</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/4'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'12n'}</InlineMath>.
          </li>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_2'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>3</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/9'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'n^{7/6}'}</InlineMath>.
          </li>
          <li>
            Τον αλγόριθμο <InlineMath>{'A_4'}</InlineMath> που διασπά το αρχικό
            πρόβλημα μεγέθους <InlineMath>{'n'}</InlineMath> σε{' '}
            <strong>27</strong> υποπροβλήματα μεγέθους{' '}
            <InlineMath>{'n/9'}</InlineMath>, τα επιλύει και στη συνέχεια
            συνθέτει τις λύσεις τους σε χρόνο{' '}
            <InlineMath>{'n^{11/12}'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>(Α)</strong> Γράψε τις αναδρομικές εξισώσεις που δίνουν τον
          χρόνο εκτέλεσης των <InlineMath>{'A_1, A_2, A_4'}</InlineMath> και
          λύσε τες με το Θεώρημα της Κυριαρχίας (Master Theorem).
        </p>
        <p>
          <strong>(Β)</strong> Ποιος είναι ο ασυμπτωτικά αποδοτικότερος
          αλγόριθμος για το πρόβλημα <InlineMath>{'P'}</InlineMath>; Δικαιολόγησε
          την απάντηση.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Κάθε αλγόριθμος δίνει αναδρομή{' '}
          <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath>. Εφαρμόζουμε
          Master Theorem σε καθέναν και βλέπουμε ποια περίπτωση «παίζει»:
        </p>
        <p>
          <strong>(Α) Αλγόριθμος <InlineMath>{'A_1'}</InlineMath>:</strong>{' '}
          <InlineMath>{'4T(n/4) + 12n'}</InlineMath>.{' '}
          <InlineMath>{'\\log_4 4 = 1'}</InlineMath>, και{' '}
          <InlineMath>{'f = \\Theta(n)'}</InlineMath> ταιριάζει — Περίπτωση 2 →{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A1" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_2'}</InlineMath>:</strong>{' '}
          <InlineMath>{'3T(n/9) + n^{7/6}'}</InlineMath>.{' '}
          <InlineMath>{'\\log_9 3 = 1/2'}</InlineMath>. Το{' '}
          <InlineMath>{'f = n^{7/6}'}</InlineMath> είναι πολυωνυμικά μεγαλύτερο
          από <InlineMath>{'n^{1/2}'}</InlineMath> (διαφορά εκθέτη{' '}
          <InlineMath>{'2/3'}</InlineMath>) — <strong>Περίπτωση 3</strong> →{' '}
          <InlineMath>{'\\Theta(n^{7/6})'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A2" />
        <p>
          <strong>Αλγόριθμος <InlineMath>{'A_4'}</InlineMath>:</strong>{' '}
          <InlineMath>{'27T(n/9) + n^{11/12}'}</InlineMath>.{' '}
          <InlineMath>{'\\log_9 27 = 3/2'}</InlineMath>. Το{' '}
          <InlineMath>{'f = n^{11/12}'}</InlineMath> είναι πολυωνυμικά μικρότερο
          από <InlineMath>{'n^{3/2}'}</InlineMath> (διαφορά{' '}
          <InlineMath>{'7/12'}</InlineMath>) — <strong>Περίπτωση 1</strong>,
          φύλλα κυριαρχούν →{' '}
          <InlineMath>{'\\Theta(n^{3/2})'}</InlineMath>:
        </p>
        <RecurrenceClassifier preset="front-set-3-ask7-A4" />
        <p>
          <strong>(Β) Σύγκριση.</strong>{' '}
          <InlineMath>{'n\\log n \\prec n^{7/6} \\prec n^{3/2}'}</InlineMath>{' '}
          (η <InlineMath>{'\\log n'}</InlineMath> χάνει από κάθε θετική δύναμη
          του <InlineMath>{'n'}</InlineMath> — L'Hôpital στο όριο{' '}
          <InlineMath>{'\\log n / n^{1/6} \\to 0'}</InlineMath>). Νικητής: ο{' '}
          <InlineMath>{'A_1'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «τρεις αλγόριθμοι, τρεις περιπτώσεις».</strong>{' '}
          Όταν συγκρίνεις πολλούς D&amp;C, μην προσπαθήσεις να μαντέψεις
          εμπειρικά — εφάρμοσε Master Theorem σε καθένα και διάταξε τις τελικές
          πολυπλοκότητες. Συχνή παγίδα: <InlineMath>{'n\\log n'}</InlineMath>{' '}
          νικάει κάθε <InlineMath>{'n^{1+\\varepsilon}'}</InlineMath>, παρότι
          εμφανίζεται «πιο τρομακτικό» λόγω log.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask8',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 8 — Απόδειξη T(n) = n log n με επαγωγή',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δείξε με τη βοήθεια της μαθηματικής επαγωγής ότι, όταν το{' '}
          <InlineMath>{'n'}</InlineMath> είναι ακριβής δύναμη του{' '}
          <InlineMath>{'2'}</InlineMath>, η λύση της αναδρομής
        </p>
        <BlockMath>{'T(n) = \\begin{cases} 2, & n = 2 \\\\ 2\\,T(n/2) + n, & n = 2^k,\\ k > 1 \\end{cases}'}</BlockMath>
        <p>
          είναι <InlineMath>{'T(n) = n\\log n'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Επειδή <InlineMath>{'n = 2^k'}</InlineMath>, κάνουμε{' '}
          <strong>επαγωγή στο <InlineMath>{'k'}</InlineMath></strong>: στόχος
          είναι <InlineMath>{'T(2^k) = k \\cdot 2^k'}</InlineMath> (το ίδιο με{' '}
          <InlineMath>{'n\\log n'}</InlineMath>). Δες γραμμή προς γραμμή τι
          κάνει κάθε βήμα — η αναγνώριση των τριών moves («ορισμός», «εφαρμογή
          IH», «log a + log b = log ab») είναι το ζητούμενο:
        </p>
        <InductionStepper preset="front-set-3-ask8" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης — επαγωγή σε αναδρομές πάντα ίδια συνταγή.</strong>{' '}
          (1) Βάση: επαλήθευσε στο μικρότερο n. (2) ΙΗ: «έστω ότι ισχύει για k».
          (3) Επαγωγικό βήμα: ξεκίνα από τον ορισμό της αναδρομής για k+1,
          εφάρμοσε την ΙΗ στις αναδρομικές κλήσεις (που είναι ≤ k), και χρησιμοποίησε
          αλγεβρικές ταυτότητες (log a+log b=log ab, n−1+1=n, …) για να καταλήξεις
          στον τύπο που υπόσχεσαι.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask9',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 9 — Master Theorem με λογαριθμικό όρο',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση{' '}
        <InlineMath>{'T(n) = 2\\,T(n/2) + n\\log n'}</InlineMath> με το Θεώρημα
        της Κυριαρχίας (Master Theorem).
      </p>
    ),
    solution: (
      <>
        <p>
          Πρώτη ένδειξη παγίδας: <InlineMath>{'f(n) = n\\log n'}</InlineMath>{' '}
          είναι μεγαλύτερο από <InlineMath>{'n^{\\log_2 2} = n'}</InlineMath>, αλλά{' '}
          <em>όχι πολυωνυμικά μεγαλύτερο</em> — η διαφορά είναι μόνο ένα log.
          Καμία από τις τρεις κλασικές περιπτώσεις δεν εφαρμόζεται. Δες γιατί:
        </p>
        <MasterTheoremExtended preset="front-set-3-ask9" />
        <p>
          <strong>Σύνοψη.</strong> Επεκτεταμένη περίπτωση: αν{' '}
          <InlineMath>{'f(n) = \\Theta(n^{\\log_b a}\\log^k n)'}</InlineMath>{' '}
          τότε <InlineMath>{'T(n) = \\Theta(n^{\\log_b a}\\log^{k+1} n)'}</InlineMath>{' '}
          — μία log δύναμη παραπάνω. Εδώ k=1, άρα:
        </p>
        <BlockMath>{'T(n) = \\Theta(n\\log^2 n).'}</BlockMath>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «log χωρίς πολυωνυμική απόσταση = +1 log».</strong>{' '}
          Όταν η f έχει την «καρδιά» του κατωφλιού{' '}
          <InlineMath>{'n^{\\log_b a}'}</InlineMath> και επιπλέον{' '}
          <InlineMath>{'\\log^k n'}</InlineMath> για κάποιο{' '}
          <InlineMath>{'k \\ge 0'}</InlineMath>, η απάντηση είναι το ίδιο
          κατώφλι επί <InlineMath>{'\\log^{k+1} n'}</InlineMath> — μία log
          δύναμη παραπάνω. Συμβουλή: γράψε πάντα το <InlineMath>{'k'}</InlineMath>{' '}
          ρητά, για να μη μετρήσεις λάθος.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-3-ask10',
    title: 'Φροντιστηριακό Σετ #3 · Άσκηση 10 — Αναδρομή T(n) = T(√n) + 1',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #3',
    problemNumber: 'Άσκηση 10',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση{' '}
        <InlineMath>{'T(n) = T(\\sqrt{n}) + 1'}</InlineMath> με αρχική συνθήκη{' '}
        <InlineMath>{'T(1) = O(1)'}</InlineMath>, και δώσε την ασυμπτωτική τάξη
        της <InlineMath>{'T(n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα δεν <em>διαιρείται</em> — μικραίνει με{' '}
          <strong>τετραγωνική ρίζα</strong>. Master Theorem δεν εφαρμόζεται
          κατευθείαν, χρειάζεται αλλαγή μεταβλητής. Δες τη συνταγή:
        </p>
        <RecurrenceSubstitution preset="front-set-3-ask10" />
        <p>
          <strong>Σύνοψη.</strong> Θέτω <InlineMath>{'n = 2^m'}</InlineMath>· η{' '}
          <InlineMath>{'\\sqrt{n} = 2^{m/2}'}</InlineMath>, ορίζω{' '}
          <InlineMath>{'S(m) = T(2^m)'}</InlineMath> και η αναδρομή γίνεται{' '}
          <InlineMath>{'S(m) = S(m/2) + 1'}</InlineMath>. Master Theorem
          (περίπτωση 2): <InlineMath>{'S(m) = \\Theta(\\log m)'}</InlineMath>.
          Επιστροφή <InlineMath>{'m = \\log n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = \\Theta(\\log\\log n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — η «n = 2ᵐ» αντικατάσταση.</strong> Όποτε
          εμφανίζεται <InlineMath>{'\\sqrt{n}'}</InlineMath> ή{' '}
          <InlineMath>{'\\sqrt[k]{n}'}</InlineMath> στο όρισμα της αναδρομής,
          αυτή είναι η μόνη ασφαλής συνταγή. Το διπλό log στην απάντηση είναι
          το χαρακτηριστικό «αποτύπωμα» — όπως ακριβώς και στο pt1-th1-q4.
        </Callout>
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
          Δύο δυσκολίες ταυτόχρονα: ρίζα στο όρισμα <em>και</em> συντελεστής{' '}
          <InlineMath>{'\\sqrt{n}'}</InlineMath> μπροστά. Το κλειδί είναι ένα
          έξυπνο κόλπο: <strong>διαιρούμε και τις δύο πλευρές με n</strong> —
          ο συντελεστής εξαφανίζεται και αποκαλύπτεται μια ήδη γνωστή
          αναδρομή. Δες τα 5 στάδια:
        </p>
        <DivideByNTrick />
        <p>
          <strong>Σύνοψη.</strong> Με <InlineMath>{'S(n) = T(n)/n'}</InlineMath>{' '}
          η σχέση γίνεται <InlineMath>{'S(n) = S(\\sqrt{n}) + 1'}</InlineMath>{' '}
          (που λύνεται όπως το pt1-th1-q4 με{' '}
          <InlineMath>{'n = 2^m'}</InlineMath>), δίνοντας{' '}
          <InlineMath>{'S(n) = \\Theta(\\log\\log n)'}</InlineMath>. Πολλαπλασιάζουμε
          με <InlineMath>{'n'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = n \\cdot S(n) = \\Theta(n\\log\\log n).'}</BlockMath>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «διαίρεσε με n για να ξεθαμπώσεις τη μορφή».</strong>{' '}
          Όποτε η αναδρομή έχει συντελεστή <InlineMath>{'\\sqrt{n}'}</InlineMath>{' '}
          ή <InlineMath>{'n^c'}</InlineMath> μπροστά από{' '}
          <InlineMath>{'T(\\cdot)'}</InlineMath>, διαίρεσε και τις δύο πλευρές με{' '}
          το <InlineMath>{'f(n)'}</InlineMath> (συνήθως n) και όρισε{' '}
          <InlineMath>{'S(n) = T(n)/f(n)'}</InlineMath>. Συχνά αυτό απλοποιεί
          την αναδρομή σε γνωστή. Είναι το ίδιο κόλπο που χρησιμοποιείται και
          στην απόδειξη #1 της mergesort στο L03.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask2',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 2 — Ακριβής λύση με τη μέθοδο αντικατάστασης',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Βρες την <strong>ακριβή λύση</strong> της αναδρομής με τη μέθοδο της
          αντικατάστασης:
        </p>
        <BlockMath>{'T(n) = \\begin{cases} 1, & n = 1 \\\\ 2\\,T(n/2) + n, & n > 1 \\end{cases}'}</BlockMath>
      </>
    ),
    solution: (
      <>
        <p>
          Η <strong>μέθοδος αντικατάστασης</strong> δουλεύει σε δύο φάσεις:{' '}
          (1) <em>μαντεύεις</em> τη μορφή της λύσης, (2) την{' '}
          <em>αποδεικνύεις με επαγωγή</em>. Εδώ η εικασία{' '}
          <InlineMath>{'T(n) = n\\log n + n'}</InlineMath> προκύπτει από το ότι
          η <InlineMath>{'2T(n/2)+n'}</InlineMath> είναι η αναδρομή της
          mergesort — Θ(n log n) — αλλά θέλουμε ακριβή σταθερά. Δες κάθε γραμμή
          του επαγωγικού βήματος:
        </p>
        <InductionStepper preset="front-set-4-ask2" />
        <p>
          <strong>Πετυχημένο.</strong>{' '}
          <InlineMath>{'T(n) = n\\log n + n = \\Theta(n\\log n)'}</InlineMath>.
        </p>
        <Callout type="intuition">
          <strong>Πρότυπο σκέψης — «εικασία + απόδειξη με επαγωγή».</strong>{' '}
          Όταν το Master Theorem δεν είναι αρκετό (π.χ. χρειάζεσαι ακριβή
          σταθερά), η μέθοδος αντικατάστασης σε καλύπτει:
          <ul>
            <li>Μάντεψε την εικασία από οπτική αναγνώριση (mergesort = Θ(n log n)).</li>
            <li>Επαλήθευσε στη βάση.</li>
            <li>Στο επαγωγικό βήμα: αντικατάστησε την ΙΗ στις αναδρομικές κλήσεις και απλοποίησε με τις ταυτότητες του log.</li>
          </ul>
          Αν η επαγωγή σπάει με ένα «επιπλέον» όρο, ίσως χρειάζεσαι ενίσχυση
          της εικασίας — δες front-set-4-ask3.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask3',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 3 — Άνω φράγμα και το «κόλπο» της ενίσχυσης',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 3',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες ένα άνω φράγμα (<InlineMath>{'O'}</InlineMath>) για την αναδρομή{' '}
        <InlineMath>{'T(n) = 8\\,T(n/2) + \\Theta(n^2)'}</InlineMath> με τη
        μέθοδο της αντικατάστασης.
      </p>
    ),
    solution: (
      <>
        <p>
          Με <InlineMath>{'a = 8,\\ b = 2'}</InlineMath> ξέρουμε ότι το{' '}
          <InlineMath>{'n^{\\log_2 8} = n^3'}</InlineMath> κυριαρχεί — Master
          Theorem περίπτωση 1 θα έδινε <InlineMath>{'\\Theta(n^3)'}</InlineMath>{' '}
          αν το <InlineMath>{'cn^2'}</InlineMath> ήταν πολυωνυμικά μικρότερο
          (που είναι). Αλλά αν θέλουμε να το <em>αποδείξουμε</em> με τη μέθοδο
          αντικατάστασης, πέφτουμε σε μια κλασική παγίδα: η «προφανής» εικασία{' '}
          <InlineMath>{'T \\le dn^3'}</InlineMath> δεν κλείνει την επαγωγή.
        </p>
        <StrengthenedGuess />
        <p>
          <strong>Σύνοψη.</strong> Η «πιο σφιχτή» εικασία{' '}
          <InlineMath>{"T(n) \\le dn^3 - d'n^2"}</InlineMath> κλείνει την επαγωγή
          για κάθε <InlineMath>{"d' \\ge c"}</InlineMath>. Άρα{' '}
          <InlineMath>{'T(n) = O(n^3)'}</InlineMath>.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «αν σπάει η επαγωγή, ΕΝΙΣΧΥΣΕ την εικασία».</strong>{' '}
          Είναι αντι-διαισθητικό αλλά συμβαίνει συνεχώς: μια σφιχτότερη υπόθεση{' '}
          αφήνει στην επαγωγή έναν επιπλέον αρνητικό όρο που μπορεί να
          απορροφήσει τον «παράδικο» θετικό όρο της σχέσης. Συνταγή: αν η
          εικασία <InlineMath>{'cn^k'}</InlineMath> αφήνει υπόλειμμα τάξης{' '}
          <InlineMath>{'n^{k-1}'}</InlineMath>, δοκίμασε{' '}
          <InlineMath>{"cn^k - c'n^{k-1}"}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask4',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 4 — Άνω φράγμα για άνιση αναδρομή',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Βρες ένα άνω φράγμα για την αναδρομή{' '}
        <InlineMath>{'T(n) = T(n/2) + T(n/4) + T(n/8) + n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Master Theorem δεν εφαρμόζεται — τα υποπροβλήματα έχουν{' '}
          <em>διαφορετικό μέγεθος</em>. Η σωτηρία είναι μια απλή παρατήρηση:{' '}
          <InlineMath>{'1/2 + 1/4 + 1/8 = 7/8 < 1'}</InlineMath>. Κάθε επίπεδο
          συνολικά είναι μόνο 7/8 του προηγουμένου — γεωμετρική σειρά που
          συγκλίνει. Δες το ζωντανά και σύγκρινε με τις «οριακές» περιπτώσεις:
        </p>
        <UnequalSplitGeometric />
        <p>
          <strong>Επιβεβαίωση με αντικατάσταση.</strong> Εικασία{' '}
          <InlineMath>{'T(n) \\le cn'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) \\le \\tfrac{cn}{2} + \\tfrac{cn}{4} + \\tfrac{cn}{8} + n = \\tfrac{7cn}{8} + n.'}</BlockMath>
        <p>
          Θέλουμε <InlineMath>{'\\tfrac{7c}{8} + 1 \\le c'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'c \\ge 8'}</InlineMath>. Διαλέγουμε{' '}
          <InlineMath>{'c = 8'}</InlineMath>, η επαγωγή κλείνει →{' '}
          <InlineMath>{'T(n) = O(n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — άθροισμα κλασμάτων &lt;/=/&gt; 1.</strong>{' '}
          Για αναδρομές <InlineMath>{'\\sum T(c_i n) + n^d'}</InlineMath> με{' '}
          γραμμικό f, το κρίσιμο νούμερο είναι <InlineMath>{'r = \\sum c_i'}</InlineMath>:
          <ul>
            <li>r &lt; 1: γεωμετρικά φθίνουσα → η ρίζα κυριαρχεί → Θ(n).</li>
            <li>r = 1: όλα τα επίπεδα ίσα → +log n παράγοντας → Θ(n log n).</li>
            <li>r &gt; 1: τα φύλλα κυριαρχούν → Θ(n^{`{log_? r}`}).</li>
          </ul>
          Για άνισες αναδρομές, αυτό είναι ο πρώτος έλεγχος που πρέπει να
          κάνεις.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask5',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 5 — Ύποπτη κάρτα (πλειοψηφικό στοιχείο) με D&C',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 5',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Υποθέστε ότι είστε σύμβουλοι σε μία τράπεζα που την ενδιαφέρει ο
          εντοπισμός οικονομικών εγκλημάτων. Έχουν μία συλλογή από{' '}
          <InlineMath>{'n'}</InlineMath> τραπεζικές κάρτες που έχουν κατάσχει,
          επειδή υποπτεύονται ότι χρησιμοποιούνται σε απάτες. Κάθε κάρτα
          αντιστοιχεί σε ένα μοναδικό τραπεζικό λογαριασμό, ένας λογαριασμός
          μπορεί να έχει πολλές κάρτες, και δύο κάρτες λέγονται{' '}
          <strong>ισοδύναμες</strong> αν αντιστοιχούν στον ίδιο λογαριασμό.
        </p>
        <p>
          Ο λογαριασμός δεν διαβάζεται άμεσα από την κάρτα, όμως η τράπεζα
          διαθέτει μία «συσκευή ελέγχου ισοδυναμίας» που δέχεται δύο κάρτες και
          σε χρόνο <InlineMath>{'O(1)'}</InlineMath> επιστρέφει{' '}
          <strong>TRUE</strong> αν είναι ισοδύναμες, αλλιώς{' '}
          <strong>FALSE</strong>. Είναι η μόνη επιτρεπτή λειτουργία.
        </p>
        <p>
          <strong>Ερώτημα:</strong> σε ένα σύνολο{' '}
          <InlineMath>{'S'}</InlineMath> από <InlineMath>{'n'}</InlineMath>{' '}
          κάρτες, υπάρχει ένα σύνολο με <em>περισσότερες από{' '}
          <InlineMath>{'n/2'}</InlineMath></em> κάρτες ισοδύναμες μεταξύ τους
          (άρα ύποπτες); Ο απλοϊκός αλγόριθμος που συγκρίνει κάθε κάρτα με όλες
          τις υπόλοιπες κοστίζει <InlineMath>{'O(n^2)'}</InlineMath> και δεν
          γίνεται δεκτός. Σχεδιάστε σε φυσική γλώσσα έναν{' '}
          <strong>πιο αποδοτικό αλγόριθμο «διαίρει και βασίλευε»</strong> που
          επιστρέφει μία ύποπτη κάρτα αν υπάρχει τέτοιο σύνολο, ή{' '}
          <strong>NIL</strong> αλλιώς.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Αυτό είναι το κλασικό πρόβλημα του{' '}
          <strong>πλειοψηφικού στοιχείου</strong>: υπάρχει «τιμή» (εδώ:
          λογαριασμός) που εμφανίζεται σε πάνω από τις μισές κάρτες;
        </p>
        <p>
          <strong>Το κλειδί — ένα παρατηρητικό λήμμα.</strong> Αν στο σύνολο{' '}
          <InlineMath>{'S'}</InlineMath> υπάρχει πλειοψηφική κλάση (πάνω από{' '}
          <InlineMath>{'n/2'}</InlineMath> ισοδύναμες κάρτες), τότε αν κόψουμε το{' '}
          <InlineMath>{'S'}</InlineMath> σε δύο μισά, <strong>αυτή η κλάση
          είναι πλειοψηφική σε τουλάχιστον ένα από τα δύο μισά</strong>. Γιατί;
          Αν δεν ήταν πλειοψηφική σε κανένα μισό, θα είχε{' '}
          <InlineMath>{'\\le n/4'}</InlineMath> κάρτες σε καθένα, σύνολο{' '}
          <InlineMath>{'\\le n/2'}</InlineMath> — αντίφαση (αρχή
          περιστερώνα). Άρα ο μόνος υποψήφιος είναι ο πλειοψηφικός του
          αριστερού <em>ή</em> του δεξιού μισού.
        </p>
        <p>
          <strong>Ο αλγόριθμος <InlineMath>{'\\text{DC\\_CHECK}(T, n)'}</InlineMath>:</strong>
        </p>
        <ul>
          <li>
            <strong>Βάση.</strong> <InlineMath>{'n = 1'}</InlineMath>: επίστρεψε
            τη μοναδική κάρτα. <InlineMath>{'n = 2'}</InlineMath>: αν οι δύο
            κάρτες είναι ισοδύναμες επίστρεψε τη μία, αλλιώς NIL.
          </li>
          <li>
            <strong>Διαίρεση & αναδρομή.</strong> Σπάσε το{' '}
            <InlineMath>{'T'}</InlineMath> σε δύο μισά και βρες αναδρομικά τον
            υποψήφιο του αριστερού μισού.
          </li>
          <li>
            <strong>Επαλήθευση.</strong> Αν ο υποψήφιος δεν είναι NIL,{' '}
            <em>μέτρησε</em> με πόσες κάρτες όλου του{' '}
            <InlineMath>{'T'}</InlineMath> είναι ισοδύναμος (μία σάρωση,{' '}
            <InlineMath>{'\\Theta(n)'}</InlineMath> κλήσεις της συσκευής). Αν ο
            μετρητής ξεπερνά το <InlineMath>{'n/2'}</InlineMath>, επίστρεψέ τον.
          </li>
          <li>
            Αλλιώς, επανάλαβε επαλήθευση με τον υποψήφιο του{' '}
            <strong>δεξιού</strong> μισού. Αν ούτε αυτός περνά, επίστρεψε NIL.
          </li>
        </ul>
        <p>
          <strong>Πολυπλοκότητα.</strong> Δύο αναδρομικές κλήσεις στα μισά συν
          μία γραμμική επαλήθευση:
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + \\Theta(n)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 2,\\ b = 2'}</InlineMath> και{' '}
          <InlineMath>{'f(n) = \\Theta(n) = \\Theta(n^{\\log_2 2})'}</InlineMath>{' '}
          → περίπτωση 2 του Master Theorem →{' '}
          <strong><InlineMath>{'T(n) = O(n\\log n)'}</InlineMath></strong>,
          σαφώς καλύτερο από το <InlineMath>{'O(n^2)'}</InlineMath> του αφελούς.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-4-ask6',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 6 — Ταξινόμηση 3 χρωμάτων (σημαία της Ολλανδίας)',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 6',
    difficulty: 'medium',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Δίνονται ένα ρομπότ και ένα καλάθι με χρωματιστές σφαίρες. Κάθε σφαίρα
          έχει ένα από τα χρώματα: κόκκινο{' '}
          <InlineMath>{'(0)'}</InlineMath>, μπλε{' '}
          <InlineMath>{'(1)'}</InlineMath>, πράσινο{' '}
          <InlineMath>{'(2)'}</InlineMath>. Θέλουμε το ρομπότ να τις ταξινομήσει
          χρωματικά, βάζοντας πρώτα τις κόκκινες, μετά τις μπλε και τέλος τις
          πράσινες.
        </p>
        <p>
          (α) Σχεδιάστε <strong>γραμμικό, επιτόπιο</strong> αλγόριθμο για το
          πρόβλημα. (β) Εξηγήστε πώς μια λύση αυτού του προβλήματος μπορεί να
          χρησιμοποιηθεί στον αλγόριθμο <strong>quicksort</strong>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το πρόβλημα λέγεται <em>«σημαία της Ολλανδίας»</em>. Έχουμε μόνο 3
          διαφορετικές τιμές, άρα δεν χρειάζεται πλήρης ταξινόμηση{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath> — φτάνει μία σάρωση.
        </p>
        <p>
          <strong>(α) Ο αλγόριθμος με 3 δείκτες.</strong> Χρησιμοποιούμε τρεις
          δείκτες στον ίδιο πίνακα (γι' αυτό «επιτόπιος» — μηδέν επιπλέον μνήμη):
        </p>
        <ul>
          <li>
            <InlineMath>{'\\text{low}'}</InlineMath> — αριστερό σύνορο: ό,τι
            είναι αριστερά του είναι ήδη <InlineMath>{'0'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\text{high}'}</InlineMath> — δεξί σύνορο: ό,τι είναι
            δεξιά του είναι ήδη <InlineMath>{'2'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\text{mid}'}</InlineMath> — διατρέχει τον πίνακα, μία
            θέση τη φορά, και εξετάζει το τρέχον στοιχείο.
          </li>
        </ul>
        <p>
          Σε κάθε θέση του <InlineMath>{'\\text{mid}'}</InlineMath>:
        </p>
        <ul>
          <li>
            <strong>Στοιχείο <InlineMath>{'0'}</InlineMath>:</strong> αντάλλαξε{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath> με{' '}
            <InlineMath>{'\\text{low}'}</InlineMath>· αύξησε και τους δύο.
          </li>
          <li>
            <strong>Στοιχείο <InlineMath>{'1'}</InlineMath>:</strong> άφησέ το
            στη θέση του· αύξησε μόνο το{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath>.
          </li>
          <li>
            <strong>Στοιχείο <InlineMath>{'2'}</InlineMath>:</strong> αντάλλαξε{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath> με{' '}
            <InlineMath>{'\\text{high}'}</InlineMath>· μείωσε το{' '}
            <InlineMath>{'\\text{high}'}</InlineMath>. Το{' '}
            <InlineMath>{'\\text{mid}'}</InlineMath> <em>δεν</em> προχωρά — το
            στοιχείο που μόλις ήρθε από δεξιά δεν το έχουμε ακόμα εξετάσει.
          </li>
        </ul>
        <p>
          Σταματάμε όταν το <InlineMath>{'\\text{mid}'}</InlineMath> περάσει το{' '}
          <InlineMath>{'\\text{high}'}</InlineMath>. Κάθε στοιχείο εξετάζεται
          ουσιαστικά μία φορά → χρόνος{' '}
          <strong><InlineMath>{'O(n)'}</InlineMath></strong>, χωρίς βοηθητικό
          πίνακα.
        </p>
        <p>
          <strong>(β) Σχέση με την quicksort.</strong> Η κλασική quicksort
          χωρίζει τον πίνακα σε <strong>2</strong> μέρη (μικρότερα / μεγαλύτερα
          του pivot). Αν ο πίνακας έχει πολλές <em>επαναλαμβανόμενες</em> τιμές
          ίσες με το pivot, αυτές «σκορπίζονται» και ξανα-ταξινομούνται άσκοπα.
          Με την ιδέα της σημαίας της Ολλανδίας κάνουμε{' '}
          <strong>χώρισμα σε 3 μέρη</strong>: μικρότερα του pivot, ίσα με το
          pivot, μεγαλύτερα του pivot. Το μεσαίο μέρος (τα ίσα) είναι ήδη στη
          σωστή θέση και <em>δεν</em> μπαίνει σε αναδρομή — η quicksort γίνεται
          πολύ πιο γρήγορη σε πίνακες με διπλότυπα.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-4-ask7',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 7 — Ο χαμένος όρος αριθμητικής προόδου',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Δίνεται πίνακας <InlineMath>{'A[1, \\ldots, n]'}</InlineMath>. Τα
        στοιχεία του αντιστοιχούν σε όρους αριθμητικής προόδου, διατεταγμένα
        κατά αύξουσα σειρά. Ένας όρος <strong>απουσιάζει</strong>. Δώσε έναν
        αποδοτικό αλγόριθμο για την εύρεση του «χαμένου» όρου.
      </p>
    ),
    solution: (
      <>
        <p>
          Σε αριθμητική πρόοδο: <InlineMath>{'a_i = a_0 + i \\cdot d'}</InlineMath>.
          Τη διαφορά <InlineMath>{'d'}</InlineMath> τη βρίσκουμε από τα πρώτα
          στοιχεία. Επειδή λείπει ακριβώς ένας όρος, ο πίνακας «σπάει» στο κενό:
          <strong>πριν</strong> το κενό κάθε <InlineMath>{'A[i]'}</InlineMath>{' '}
          ισούται με τον αναμενόμενο <InlineMath>{'a_0 + i d'}</InlineMath>·{' '}
          <strong>μετά</strong> το κενό είναι όλα μετατοπισμένα κατά d. Η
          μονοτονία αυτή ακριβώς ξεκλειδώνει τη δυαδική αναζήτηση.
        </p>
        <p>
          <strong>Ο αλγόριθμος.</strong> Σε κάθε βήμα, σύγκρινε{' '}
          <InlineMath>{'A[\\text{mid}]'}</InlineMath> με τον αναμενόμενο{' '}
          <InlineMath>{'a_0 + \\text{mid} \\cdot d'}</InlineMath>:
        </p>
        <ul>
          <li>Ταιριάζει → το κενό είναι δεξιά· συνέχισε εκεί.</li>
          <li>Δεν ταιριάζει → το κενό είναι αριστερά (ή ακριβώς εδώ)· συνέχισε αριστερά.</li>
        </ul>
        <p>
          Δοκίμασέ το — οι σλάιντερ ρυθμίζουν n, d και θέση κενού:
        </p>
        <MissingTermBinarySearch />
        <p>
          Κάθε βήμα υποδιπλασιάζει τον πίνακα →{' '}
          <InlineMath>{'O(\\log n)'}</InlineMath>.
        </p>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «μετατόπιση κατά μία θέση = μονότονη συνθήκη»</strong>.
          Η εξάλειψη ενός στοιχείου από ταξινομημένο/υπολογίσιμο πίνακα δημιουργεί
          ένα <strong>σύνορο</strong> ίδιας μορφής με το{' '}
          <InlineMath>{'1^m 0^n'}</InlineMath> του pt4-th3. Αν μπορείς να ορίσεις{' '}
          «αναμενόμενη τιμή» στη θέση i και να δεις πότε αρχίζει η διαφορά,
          η δυαδική αναζήτηση παίζει — <InlineMath>{'O(\\log n)'}</InlineMath>{' '}
          αντί για <InlineMath>{'O(n)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-ask8',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 8 — Διάμεσος δύο ταξινομημένων πινάκων',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 8',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <p>
        Έστω δύο πίνακες <InlineMath>{'X[1,\\ldots,n]'}</InlineMath> και{' '}
        <InlineMath>{'Y[1,\\ldots,n]'}</InlineMath>, με καθέναν να έχει{' '}
        <InlineMath>{'n'}</InlineMath> ταξινομημένους αριθμούς. Δώσε αλγόριθμο
        «διαίρει και βασίλευε» με χρόνο{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> για την εύρεση της{' '}
        <strong>διάμεσης τιμής</strong> των δύο πινάκων μαζί.
      </p>
    ),
    solution: (
      <>
        <p>
          Η διάμεσος είναι η «μεσαία» τιμή. Θα την βρούμε{' '}
          <em>χωρίς</em> να ενώσουμε τους πίνακες (που θα κόστιζε{' '}
          <InlineMath>{'O(n)'}</InlineMath>), πετώντας κάθε φορά τα μισά
          στοιχεία.
        </p>
        <p>
          <strong>Η ιδέα.</strong> Σύγκρινε τη διάμεσο του{' '}
          <InlineMath>{'X'}</InlineMath> με τη διάμεσο του{' '}
          <InlineMath>{'Y'}</InlineMath>:
        </p>
        <ul>
          <li>
            Από τον πίνακα με τη <strong>μικρότερη</strong> διάμεσο, η συνολική
            διάμεσος δεν μπορεί να βρίσκεται στο αριστερό μισό του → πέταξέ το.
          </li>
          <li>
            Από τον πίνακα με τη <strong>μεγαλύτερη</strong> διάμεσο, η συνολική
            διάμεσος δεν μπορεί να βρίσκεται στο δεξί μισό του → πέταξέ το.
          </li>
        </ul>
        <p>
          Πετάμε ίσα κομμάτια κι από τους δύο, οπότε η διάμεσος των υπολοίπων
          παραμένει η ίδια. Επαναλαμβάνουμε ώσπου να μείνουν πίνακες με 2 θέσεις
          το πολύ.
        </p>
        <p>
          <strong>Παράδειγμα.</strong>{' '}
          <InlineMath>{'X = [1,2,3,4,5,27,28,29,30]'}</InlineMath>,{' '}
          <InlineMath>{'Y = [-5,-4,-3,-2,-1,17,18,19,20]'}</InlineMath>.
          Διάμεσοι <InlineMath>{'5'}</InlineMath> και{' '}
          <InlineMath>{'-1'}</InlineMath>:{' '}
          <InlineMath>{'5 > -1'}</InlineMath> → το{' '}
          <InlineMath>{'X'}</InlineMath> χάνει το δεξί μισό, το{' '}
          <InlineMath>{'Y'}</InlineMath> το αριστερό →{' '}
          <InlineMath>{'X=[1,2,3,4,5],\\ Y=[-1,17,18,19,20]'}</InlineMath>.
          Συνεχίζοντας φτάνουμε σε{' '}
          <InlineMath>{'X=[4,5],\\ Y=[-1,17]'}</InlineMath>, και η διάμεσος
          είναι <InlineMath>{'(4+5)/2 = 4{,}5'}</InlineMath>.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε βήμα κόβει στα μισά με σταθερή
          δουλειά:
        </p>
        <BlockMath>{'T(n) = T(n/2) + O(1)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 1,\\ b = 2'}</InlineMath>:{' '}
          <InlineMath>{'n^{\\log_b a} = n^{\\log_2 1} = n^0 = 1'}</InlineMath>{' '}
          και <InlineMath>{'f(n) = O(1) = \\Theta(1)'}</InlineMath> → περίπτωση 2
          → <strong><InlineMath>{'T(n) = O(\\log n)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-4-ask9',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 9 — Τομές ευθύγραμμων τμημάτων = αντιστροφές',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 9',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Έχουμε 2 σύνολα <InlineMath>{'n'}</InlineMath> σημείων: ένα σύνολο{' '}
          <InlineMath>{'\\{p_1, \\ldots, p_n\\}'}</InlineMath> στη γραμμή{' '}
          <InlineMath>{'y = 0'}</InlineMath> και ένα άλλο{' '}
          <InlineMath>{'\\{q_1, \\ldots, q_n\\}'}</InlineMath> στη γραμμή{' '}
          <InlineMath>{'y = 1'}</InlineMath>. Δημιουργούνται{' '}
          <InlineMath>{'n'}</InlineMath> ευθύγραμμα τμήματα, καθένα ενώνοντας το{' '}
          <InlineMath>{'p_i'}</InlineMath> με το{' '}
          <InlineMath>{'q_i'}</InlineMath>.
        </p>
        <p>
          Περίγραψε έναν αλγόριθμο «διαίρει και βασίλευε» που υπολογίζει{' '}
          <strong>πόσα ζεύγη τμημάτων τέμνονται</strong>, σε χρόνο{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath>. (Οι τιμές{' '}
          <InlineMath>{'p_i'}</InlineMath> και{' '}
          <InlineMath>{'q_i'}</InlineMath> είναι διακριτές.)
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Το πρόβλημα είναι μεταμφιεσμένο.</strong> Διάταξε τα τμήματα
          κατά το κάτω άκρο τους, ώστε το <InlineMath>{'i'}</InlineMath>-οστό
          τμήμα να έχει το <InlineMath>{'i'}</InlineMath>-οστό μικρότερο{' '}
          <InlineMath>{'p'}</InlineMath>. Τότε δύο τμήματα{' '}
          <InlineMath>{'i < j'}</InlineMath> (με{' '}
          <InlineMath>{'p_i < p_j'}</InlineMath>) <strong>τέμνονται αν και
          μόνο αν</strong> <InlineMath>{'q_i > q_j'}</InlineMath> — το ένα ξεκινά
          αριστερά κάτω αλλά καταλήγει δεξιά πάνω. Δηλαδή κάθε τομή είναι μια{' '}
          <strong>αντιστροφή</strong> στον πίνακα των{' '}
          <InlineMath>{'q'}</InlineMath>!
        </p>
        <p>
          Έτσι το ζητούμενο γίνεται: «<em>μέτρησε τις αντιστροφές στον πίνακα{' '}
          <InlineMath>{'Q'}</InlineMath></em>» — ακριβώς το πρόβλημα του L04.
        </p>
        <p>
          <strong>Ο αλγόριθμος (επέκταση της mergesort).</strong>
        </p>
        <ul>
          <li>
            <strong>Διαίρεση:</strong> χώρισε τον <InlineMath>{'Q'}</InlineMath>{' '}
            σε αριστερό και δεξί μισό.
          </li>
          <li>
            <strong>Αναδρομή:</strong> μέτρησε τις αντιστροφές{' '}
            <em>μέσα</em> σε κάθε μισό και ταυτόχρονα ταξινόμησέ το.
          </li>
          <li>
            <strong>Συνδυασμός:</strong> κατά τη συγχώνευση των δύο
            ταξινομημένων μισών, κάθε φορά που ένα στοιχείο του δεξιού μισού
            «προσπερνά» στοιχεία του αριστερού, μετράς τόσες αντιστροφές —{' '}
            <InlineMath>{'O(n)'}</InlineMath> δουλειά.
          </li>
        </ul>
        <p>
          Συνολικός αριθμός τομών = (αντιστροφές αριστερά) + (αντιστροφές δεξιά)
          + (αντιστροφές μεταξύ των δύο μισών).
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong>
        </p>
        <BlockMath>{'T(n) = 2\\,T(n/2) + O(n)'}</BlockMath>
        <p>
          Με <InlineMath>{'a = 2,\\ b = 2'}</InlineMath> και{' '}
          <InlineMath>{'f(n) = O(n) = \\Theta(n^{\\log_2 2})'}</InlineMath> →
          περίπτωση 2 →{' '}
          <strong><InlineMath>{'T(n) = O(n\\log n)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-4-ask10',
    title: 'Φροντιστηριακό Σετ #4 · Άσκηση 10 — Master Theorem με λογαριθμικό όρο',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση 10',
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <p>
        Λύσε την αναδρομική εξίσωση, προσδιορίζοντας την τάξη της{' '}
        (<InlineMath>{'\\Theta'}</InlineMath>), με{' '}
        <InlineMath>{'T(1) = 1'}</InlineMath>:{' '}
        <InlineMath>{'T(n) = 27\\,T(n/9) + (\\sqrt{n})^3 \\lg n'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Βήμα 1 — απλοποίησε το <InlineMath>{'f'}</InlineMath>:</strong>{' '}
          <InlineMath>{'(\\sqrt{n})^3 = n^{3/2}'}</InlineMath>, άρα{' '}
          <InlineMath>{'f(n) = n^{3/2}\\lg n'}</InlineMath>. Με{' '}
          <InlineMath>{'a = 27,\\ b = 9'}</InlineMath>:{' '}
          <InlineMath>{'\\log_9 27 = 3/2'}</InlineMath>, κατώφλι{' '}
          <InlineMath>{'n^{3/2}'}</InlineMath>. Η f είναι «ακριβώς πάνω στο
          κατώφλι» επί <InlineMath>{'\\log n'}</InlineMath> — η επεκτεταμένη
          περίπτωση. Δες τη συνταγή:
        </p>
        <MasterTheoremExtended preset="front-set-4-ask10" />
        <p>
          <strong>Αποτέλεσμα.</strong>
        </p>
        <BlockMath>{'T(n) = \\Theta(n^{3/2}\\log^2 n).'}</BlockMath>
        <Callout type="key">
          <strong>Πρότυπο σκέψης — «log πάνω στο κατώφλι ⇒ +1 log».</strong>{' '}
          Όποτε δεις <InlineMath>{'f = n^{\\log_b a} \\cdot \\log^k n'}</InlineMath>,
          η απάντηση είναι το ίδιο κατώφλι επί <InlineMath>{'\\log^{k+1} n'}</InlineMath>.
          Συνηθισμένα παραδείγματα στις εξετάσεις: <InlineMath>{'k = 1'}</InlineMath>{' '}
          (συνηθέστατο), <InlineMath>{'k = 0'}</InlineMath> (αυτό είναι ακριβώς
          η Περίπτωση 2). Συμβουλή: γράψε ρητά το{' '}
          <InlineMath>{'\\log^k'}</InlineMath> ξεχωριστά από το κατώφλι για να
          μη ξεχάσεις το +1.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-e0-ask6',
    title: 'Φροντιστηριακό Σετ #4 · Επανάληψη E0 — Πολυπλοκότητα εμφωλευμένων βρόχων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Άσκηση επανάληψης (E0)',
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Υπολόγισε την πολυπλοκότητα χρόνου του παρακάτω αλγορίθμου:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`begin algorithm
  arg ← -1
  for i ← 1 to 2n with step 1 do
    for j ← i to i² with step 1 do
      arg ← CALC(j)
  end algorithm

procedure CALC(w)
  res ← 0
  for i ← 1 to w^0.5 with step 0.1 do
    res ← res + log(i)
  return res`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          Έχουμε <strong>τρεις εμφωλευμένους βρόχους</strong> (δύο στον κύριο
          αλγόριθμο, ένας μέσα στη <InlineMath>{'CALC'}</InlineMath>). Η συνολική
          πολυπλοκότητα είναι το <em>γινόμενο</em> των επαναλήψεων κάθε
          επιπέδου. Μετράμε ένα-ένα.
        </p>
        <p>
          <strong>1ος βρόχος</strong> (<InlineMath>{'i'}</InlineMath> από{' '}
          <InlineMath>{'1'}</InlineMath> έως <InlineMath>{'2n'}</InlineMath>):{' '}
          <InlineMath>{'2n'}</InlineMath> επαναλήψεις →{' '}
          <InlineMath>{'O(n)'}</InlineMath>.
        </p>
        <p>
          <strong>2ος βρόχος</strong> (<InlineMath>{'j'}</InlineMath> από{' '}
          <InlineMath>{'i'}</InlineMath> έως <InlineMath>{'i^2'}</InlineMath>):{' '}
          <InlineMath>{'i^2 - i + 1'}</InlineMath> επαναλήψεις. Στη χειρότερη
          περίπτωση <InlineMath>{'i = 2n'}</InlineMath>, άρα{' '}
          <InlineMath>{'(2n)^2 - 2n + 1 = 4n^2 - 2n + 1'}</InlineMath> →{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          <strong>Η <InlineMath>{'CALC(w)'}</InlineMath>.</strong> Ο βρόχος{' '}
          τρέχει από <InlineMath>{'1'}</InlineMath> έως{' '}
          <InlineMath>{'w^{0{,}5}'}</InlineMath> με <em>βήμα{' '}
          <InlineMath>{'0{,}1'}</InlineMath></em> — δηλαδή{' '}
          <InlineMath>{'10'}</InlineMath> επαναλήψεις ανά μονάδα, σύνολο{' '}
          <InlineMath>{'10\\cdot w^{0{,}5}'}</InlineMath>. Εδώ το{' '}
          <InlineMath>{'w = j \\le i^2 \\le 4n^2'}</InlineMath>, άρα{' '}
          <InlineMath>{'w^{0{,}5} \\le 2n'}</InlineMath> και η{' '}
          <InlineMath>{'CALC'}</InlineMath> κάνει{' '}
          <InlineMath>{'\\le 10\\cdot 2n = 20n'}</InlineMath> βήματα →{' '}
          <InlineMath>{'O(n)'}</InlineMath> (ο υπολογισμός του{' '}
          <InlineMath>{'res'}</InlineMath> είναι <InlineMath>{'O(1)'}</InlineMath>).
        </p>
        <p>
          <strong>Συνολικά:</strong> αφού οι διαδικασίες είναι εμφωλευμένες,
          πολλαπλασιάζουμε:
        </p>
        <BlockMath>{'O(n)\\cdot O(n^2)\\cdot O(n) = O(n^4)'}</BlockMath>
        <p>
          (Με ακριβή υπολογισμό αθροισμάτων προκύπτει η ίδια τάξη,{' '}
          <InlineMath>{'\\Theta(n^4)'}</InlineMath>.)
        </p>
        <LoopComplexityTrace preset="front-set-4-e0-ask6" />
        <Callout type="key">
          <strong>Πρότυπο σκέψης: τρεις εμφωλευμένοι → πολλαπλασιασμός τριών τάξεων.</strong>{' '}
          Όταν όλοι οι βρόχοι έχουν ανεξάρτητα όρια στο <InlineMath>{'n'}</InlineMath>{' '}
          (ή σε φραγμένη συνάρτηση του εξωτερικού δείκτη), αρκεί πολλαπλασιασμός.
          Όταν όμως το όριο εξαρτάται από εξωτερικό δείκτη (π.χ.{' '}
          <InlineMath>{'j'}</InlineMath> από <InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'i^2'}</InlineMath>), προτίμα <em>άθροισμα</em>: η χονδρική
          εκτίμηση παίρνει το χειρότερο όριο, και κατά κανόνα ταυτίζεται με το
          πραγματικό άθροισμα μέχρι σταθερά.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-4-thema4',
    title: 'Φροντιστηριακό Σετ #4 · Θέμα 4 — Πολυπλοκότητα δύο αλγορίθμων',
    topic: 'asymptotics',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #4',
    problemNumber: 'Θέμα 4',
    weight: 15,
    difficulty: 'hard',
    prerequisites: ['lectures/L02-asymptotic-analysis'],
    statement: (
      <>
        <p>
          Βρες την πολυπλοκότητα των παρακάτω αλγορίθμων. Δώσε σύντομη
          αιτιολόγηση.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Algorithm 1
  arg ← 1
  for i ← 1 to n with step 1 do
    for j ← 1 to i with step 1 do
      arg ← CALC(j)

procedure CALC(m)
  i ← 1;  s ← 1
  while s ≤ m do
    i ← i + 1
    s ← s + i
  return s`}</pre>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Algorithm 2
  arg ← 0
  for i ← 1 to n with step 1 do
    for j ← 1 to n with step (2·j) do
      arg ← CALC(j)

procedure CALC(m)
  s ← m
  while s ≤ (2·m) do
    s ← s + 1
  return s`}</pre>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Algorithm 1.</strong> Πρώτα η <InlineMath>{'CALC(m)'}</InlineMath>:
          σε κάθε επανάληψη το <InlineMath>{'i'}</InlineMath> αυξάνεται και το{' '}
          <InlineMath>{'s'}</InlineMath> γίνεται{' '}
          <InlineMath>{'1+2+3+\\cdots+i = \\tfrac{i(i+1)}{2}'}</InlineMath>. Ο
          βρόχος σταματά όταν <InlineMath>{'s > m'}</InlineMath>, δηλαδή όταν{' '}
          <InlineMath>{'\\tfrac{i(i+1)}{2} > m'}</InlineMath> — αυτό συμβαίνει για{' '}
          <InlineMath>{'i \\approx \\sqrt{2m}'}</InlineMath>. Άρα{' '}
          <InlineMath>{'CALC(m) = O(\\sqrt{m})'}</InlineMath>.
        </p>
        <p>
          Οι δύο εξωτερικοί βρόχοι (<InlineMath>{'i'}</InlineMath> έως{' '}
          <InlineMath>{'n'}</InlineMath>, <InlineMath>{'j'}</InlineMath> έως{' '}
          <InlineMath>{'i'}</InlineMath>) με κλήση{' '}
          <InlineMath>{'CALC(j)'}</InlineMath> δίνουν:
        </p>
        <BlockMath>{'\\sum_{i=1}^{n}\\sum_{j=1}^{i} O(\\sqrt{j}) = \\sum_{i=1}^{n} O(i^{3/2}) = O(n^{5/2})'}</BlockMath>
        <p>
          Άρα ο <strong>Algorithm 1</strong> είναι{' '}
          <InlineMath>{'\\Theta(n^{2{,}5})'}</InlineMath>.
        </p>
        <p>
          <strong>Algorithm 2.</strong> Η <InlineMath>{'CALC(m)'}</InlineMath>{' '}
          εδώ είναι απλή: το <InlineMath>{'s'}</InlineMath> ξεκινά από{' '}
          <InlineMath>{'m'}</InlineMath> και αυξάνεται κατά{' '}
          <InlineMath>{'1'}</InlineMath> ώσπου να φτάσει το{' '}
          <InlineMath>{'2m'}</InlineMath> → <InlineMath>{'m + 1'}</InlineMath>{' '}
          επαναλήψεις, δηλαδή <InlineMath>{'CALC(m) = O(m)'}</InlineMath>.
        </p>
        <p>
          <strong>Η παγίδα στον εσωτερικό βρόχο.</strong> Το βήμα είναι{' '}
          <InlineMath>{'(2\\cdot j)'}</InlineMath>: σε κάθε επανάληψη{' '}
          <InlineMath>{'j \\leftarrow j + 2j = 3j'}</InlineMath>. Άρα το{' '}
          <InlineMath>{'j'}</InlineMath> παίρνει τιμές{' '}
          <InlineMath>{'1, 3, 9, 27, \\ldots'}</InlineMath> — μόνο{' '}
          <InlineMath>{'O(\\log_3 n)'}</InlineMath> επαναλήψεις. Το άθροισμα του
          κόστους <InlineMath>{'CALC(j)'}</InlineMath> πάνω σε αυτές τις τιμές
          είναι γεωμετρική σειρά:
        </p>
        <BlockMath>{'\\sum_{j \\in \\{1,3,9,\\ldots,n\\}} O(j) = O(1 + 3 + 9 + \\cdots + n) = O(n)'}</BlockMath>
        <p>
          Ο εσωτερικός βρόχος (μαζί με τις κλήσεις) κοστίζει{' '}
          <InlineMath>{'O(n)'}</InlineMath>, και ο εξωτερικός{' '}
          <InlineMath>{'i'}</InlineMath> τον εκτελεί <InlineMath>{'n'}</InlineMath>{' '}
          φορές. Άρα ο <strong>Algorithm 2</strong> είναι{' '}
          <InlineMath>{'O(n^2)'}</InlineMath>.
        </p>
        <p>
          Δες και τους δύο αλγορίθμους ζωντανά. Πρόσεξε στο Algo 1 ότι η CALC
          κρύβει αθροιστή <InlineMath>{'1+2+\\cdots+i'}</InlineMath> — σταματάει
          στο <InlineMath>{'i \\approx \\sqrt{2m}'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\sqrt{m}'}</InlineMath> κόστος. Στο Algo 2 η παγίδα είναι
          το βήμα <InlineMath>{'(2 \\cdot j)'}</InlineMath>: σημαίνει{' '}
          <InlineMath>{'j \\leftarrow 3j'}</InlineMath> — γεωμετρικό, οπότε{' '}
          <InlineMath>{'\\log_3 n'}</InlineMath> επαναλήψεις:
        </p>
        <LoopComplexityTrace preset="front-set-4-thema4-a" />
        <LoopComplexityTrace preset="front-set-4-thema4-b" />
        <Callout type="warning">
          <strong>Πρότυπο σκέψης: «τι βήμα έχει ο βρόχος;»</strong>{' '}
          (1) <strong>Σταθερό βήμα +1</strong> → γραμμικός σε όριο.
          (2) <strong>Σταθερός πολλαπλασιαστής (×2, ×3, ...)</strong> →{' '}
          <em>λογαριθμικός</em> σε όριο. Η ψευδο-έκφραση «<code>step (2·j)</code>»
          είναι ύπουλη — δεν είναι σταθερό βήμα, είναι{' '}
          <InlineMath>{'j \\leftarrow j + 2j = 3j'}</InlineMath>.
          (3) <strong>Συνάρτηση του ορίσματος</strong> (CALC με while που χτίζει
          άθροισμα) → δες το αναλυτικά ποια ισότητα ικανοποιεί η συνθήκη τερματισμού.
        </Callout>
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
  {
    id: 'front-set-5-ask1',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 1 — Stooge Sort: ορθότητα & πολυπλοκότητα',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L03-divide-and-conquer-i'],
    statement: (
      <>
        <p>
          Δίνεται ο αναδρομικός αλγόριθμος ταξινόμησης{' '}
          <strong>Stooge Sort</strong> <InlineMath>{'(A, l, r)'}</InlineMath>{' '}
          (ταξινομεί τον πίνακα <InlineMath>{'A'}</InlineMath> από τον δείκτη{' '}
          <InlineMath>{'l'}</InlineMath> έως τον <InlineMath>{'r'}</InlineMath>):
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`Stooge Sort(A, l, r):
  if A[l] > A[r] then Swap(A[l], A[r])
  if l + 1 > r then return
  k := ⌊(r - l + 1) / 3⌋
  Stooge Sort(A, l,     r - k)   // πρώτα 2/3
  Stooge Sort(A, l + k, r    )   // τελευταία 2/3
  Stooge Sort(A, l,     r - k)   // ξανά τα πρώτα 2/3`}</pre>
        <p>
          (α) Απόδειξε ότι η κλήση{' '}
          <InlineMath>{'\\text{Stooge Sort}(A, 1, n)'}</InlineMath> ταξινομεί
          σωστά έναν πίνακα μήκους <InlineMath>{'n'}</InlineMath>. (β) Γράψε την
          αναδρομική εξίσωση του χειρότερου χρόνου και την ακριβή τάξη{' '}
          (<InlineMath>{'\\Theta'}</InlineMath>).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>(α) Ορθότητα — επαγωγή στο μήκος n.</strong> Βάση: για n=1
          τετριμμένο, για n=2 η αρχική συγκριτική γραμμή κάνει τη δουλειά.
          Επαγωγική υπόθεση: σωστή ταξινόμηση για κάθε k &lt; n· κάθε
          αναδρομική κλήση γίνεται σε <InlineMath>{'2n/3 < n'}</InlineMath>,
          άρα είναι σωστή.
        </p>
        <p>
          Το «καρδιά» του επιχειρήματος για n μήκος: σκέψου τον πίνακα σε τρία
          ίσα τρίτα. Δες τις 3 κλήσεις και τι κάνει η καθεμία στα τρίτα:
        </p>
        <StoogeSortViz />
        <ul>
          <li>
            <strong>1η κλήση</strong>: ταξινομεί τα πρώτα 2/3 → τα{' '}
            <InlineMath>{'k'}</InlineMath> μεγαλύτερα αυτών μετακινούνται στο
            μεσαίο τρίτο.
          </li>
          <li>
            <strong>2η κλήση</strong>: ταξινομεί τα τελευταία 2/3 (μεσαίο +
            τελευταίο) → τα{' '}
            <InlineMath>{'k'}</InlineMath> μεγαλύτερα όλου του πίνακα
            καταλήγουν, ταξινομημένα, στο τελευταίο τρίτο.
          </li>
          <li>
            <strong>3η κλήση</strong>: ξαναταξινομεί τα πρώτα 2/3, που πλέον
            περιέχουν τα <InlineMath>{'2n/3'}</InlineMath> μικρότερα στοιχεία.
          </li>
        </ul>
        <p>
          <strong>(β) Πολυπλοκότητα.</strong> Κάθε κλήση: σταθερή δουλειά +
          τρεις αναδρομικές σε μέγεθος <InlineMath>{'2n/3'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = 3\\,T(2n/3) + O(1).'}</BlockMath>
        <p>
          Master Theorem με <InlineMath>{'a=3, b=3/2'}</InlineMath>:{' '}
          <InlineMath>{'n^{\\log_{3/2} 3} \\approx n^{2{,}71}'}</InlineMath>. Το{' '}
          <InlineMath>{'f = O(1)'}</InlineMath> είναι πολυωνυμικά μικρότερο →
          Περίπτωση 1:
        </p>
        <BlockMath>{'T(n) = \\Theta(n^{\\log_{3/2} 3}) \\approx \\Theta(n^{2{,}71}).'}</BlockMath>
        <p>
          Δηλαδή η Stooge Sort είναι <em>χειρότερη</em> και από την bubble{' '}
          <InlineMath>{'\\Theta(n^2)'}</InlineMath> — εξ ου και το όνομα.
        </p>
        <Callout type="warning">
          <strong>Πρότυπο σκέψης — «D&amp;C δεν εγγυάται ταχύτητα».</strong> Όταν
          βλέπεις «a αναδρομικές κλήσεις σε μέγεθος n/b», η πολυπλοκότητα
          εξαρτάται κρίσιμα από τη σχέση{' '}
          <InlineMath>{'a'}</InlineMath> vs <InlineMath>{'b'}</InlineMath>:
          <ul>
            <li>2T(n/2): n φύλλα → Θ(n log n) — γρήγορο.</li>
            <li>3T(2n/3): n^{`{log_{3/2} 3}`} ≈ n^{`{2.71}`} φύλλα — αργό.</li>
            <li>2T(n−1): 2ⁿ φύλλα — εκθετικό.</li>
          </ul>
          Όπως είδαμε στον Hanoi στο L03 — D&amp;C χωρίς «καλή» αναδρομή =
          βλακεία. Το λόγο εκθέτη δίνει το{' '}
          <InlineMath>{'\\log_{n_{old}/n_{new}}(a)'}</InlineMath>.
        </Callout>
      </>
    ),
  },
  {
    id: 'front-set-5-ask2',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 2 — Ταίριασμα βιδών με παξιμάδια',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 2',
    difficulty: 'hard',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Δίνονται <InlineMath>{'n'}</InlineMath> βίδες και{' '}
          <InlineMath>{'n'}</InlineMath> αντίστοιχα παξιμάδια, διαφορετικού
          διαμετρήματος. Μπορεί να ελεγχθεί αν ένα επιλεγμένο ζεύγος βίδας και
          παξιμαδιού ταιριάζει, με <strong>μία δοκιμή ταιριάσματος</strong>{' '}
          (που λέει «ταιριάζει» / «η βίδα είναι μικρότερη» / «μεγαλύτερη»). Δεν
          επιτρέπεται απευθείας σύγκριση δύο βιδών ή δύο παξιμαδιών.
        </p>
        <p>
          Σχεδίασε αλγόριθμο που ταιριάζει όλες τις βίδες με τα παξιμάδια, με
          αποδοτικότητα μέσης περίπτωσης{' '}
          <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Αφελής λύση.</strong> Σύγκρινε κάθε βίδα με όλα τα παξιμάδια
          ώσπου να βρεις το ταίρι της: <InlineMath>{'n'}</InlineMath> βίδες ×{' '}
          <InlineMath>{'n'}</InlineMath> παξιμάδια ={' '}
          <InlineMath>{'O(n^2)'}</InlineMath> δοκιμές. Θέλουμε καλύτερα.
        </p>
        <p>
          <strong>Λύση «διαίρει και βασίλευε» — σαν randomized quicksort.</strong>{' '}
          Ο περιορισμός (βίδα μόνο με παξιμάδι) είναι ακριβώς το «κλειδί»: ένα
          παξιμάδι μπορεί να παίξει τον ρόλο του <em>pivot</em> για τις βίδες,
          και αντίστροφα.
        </p>
        <ul>
          <li>
            Διάλεξε <strong>τυχαία</strong> ένα παξιμάδι{' '}
            <InlineMath>{'P'}</InlineMath>. Δοκίμασέ το με κάθε βίδα: αυτό
            χωρίζει τις βίδες σε τρεις ομάδες — μικρότερες από το{' '}
            <InlineMath>{'P'}</InlineMath>, την <em>μία</em> βίδα που ταιριάζει,
            και μεγαλύτερες. (<InlineMath>{'\\Theta(n)'}</InlineMath> δοκιμές.)
          </li>
          <li>
            Η βίδα που ταίριαξε γίνεται τώρα pivot για τα παξιμάδια: δοκίμασέ
            την με κάθε παξιμάδι → χωρίζει και τα παξιμάδια σε «μικρότερα» και
            «μεγαλύτερα». (<InlineMath>{'\\Theta(n)'}</InlineMath> ακόμα.)
          </li>
          <li>
            Τώρα ξέρουμε: οι «μικρές» βίδες ταιριάζουν με τα «μικρά» παξιμάδια,
            οι «μεγάλες» με τα «μεγάλα». <strong>Αναδρομή</strong> στα δύο
            ζεύγη υπο-συνόλων.
          </li>
        </ul>
        <p>
          <strong>Πολυπλοκότητα.</strong> Κάθε επίπεδο κάνει{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath> δοκιμές και η τυχαία επιλογή
          pivot σπάει το πρόβλημα σε δύο τυχαίου μεγέθους κομμάτια — ακριβώς η
          συμπεριφορά της <strong>randomized quicksort</strong>. Άρα ο
          αναμενόμενος χρόνος είναι{' '}
          <strong><InlineMath>{'\\Theta(n\\log n)'}</InlineMath></strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask3',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 3 — Προστασία της Quicksort από σαμποτάζ',
    topic: 'divide-conquer',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L04-divide-and-conquer-ii'],
    statement: (
      <>
        <p>
          Ένα σύστημα χρησιμοποιεί την <strong>Quicksort</strong> για να
          επεξεργαστεί δεδομένα που λαμβάνει από ένα δίκτυο. Θέλουμε να το
          προστατεύσουμε από «σαμποτάζ»: ένας κακόβουλος μπορεί να στείλει
          δεδομένα ειδικά διαμορφωμένα ώστε η Quicksort να εμφανίσει τη χειρότερη
          επίδοσή της.
        </p>
        <p>
          <strong>1.</strong> Αν η Quicksort διαλέγει πάντα το πρώτο στοιχείο ως
          pivot, τι δεδομένα θα έστελνε ο κακόβουλος; <strong>2.</strong>{' '}
          Πρότεινε μια απλή στρατηγική <em>γραμμικού χρόνου</em> που εγγυάται{' '}
          <InlineMath>{'O(n\\log n)'}</InlineMath> ανεξάρτητα από τα δεδομένα —{' '}
          χωρίς να αλλάξεις τον τρόπο επιλογής pivot.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>1. Η επίθεση.</strong> Με pivot το πρώτο στοιχείο, η{' '}
          <em>χειρότερη</em> περίπτωση είναι <strong>ήδη ταξινομημένη</strong>{' '}
          (ή αντίστροφα ταξινομημένη) είσοδος. Τότε το pivot είναι πάντα το
          ελάχιστο: το χώρισμα δίνει ένα κενό κομμάτι και ένα μεγέθους{' '}
          <InlineMath>{'n-1'}</InlineMath>:
        </p>
        <BlockMath>{'T(n) = T(n-1) + \\Theta(n) = \\Theta(n^2)'}</BlockMath>
        <p>
          Άρα ο κακόβουλος στέλνει απλώς <strong>ταξινομημένα</strong> δεδομένα.
        </p>
        <p>
          <strong>2. Η άμυνα — τυχαία ανακάτεψε την είσοδο πρώτα.</strong>{' '}
          Αφού δεν επιτρέπεται να αλλάξουμε την επιλογή pivot, αλλάζουμε την{' '}
          <em>είσοδο</em>: πριν καλέσουμε την Quicksort, εφαρμόζουμε μια{' '}
          <strong>τυχαία αναδιάταξη</strong> του πίνακα με τον αλγόριθμο{' '}
          <strong>Fisher–Yates</strong> σε χρόνο{' '}
          <InlineMath>{'O(n)'}</InlineMath>:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`for i from 0 to n-2:
    j = τυχαίος ακέραιος στο [i, n-1]
    swap(array[i], array[j])`}</pre>
        <p>
          Μετά την ανακάτεψη, η σειρά των στοιχείων είναι{' '}
          <strong>ομοιόμορφα τυχαία</strong> — ό,τι κι αν έστειλε ο επιτιθέμενος.
          Έτσι η Quicksort (αν και διαλέγει το πρώτο στοιχείο) συμπεριφέρεται
          σαν <em>randomized</em> Quicksort, με αναμενόμενο χρόνο{' '}
          <strong><InlineMath>{'O(n\\log n)'}</InlineMath></strong>. Ο
          επιτιθέμενος δεν μπορεί να προβλέψει την τυχαία αναδιάταξη, οπότε δεν
          μπορεί να «στήσει» τη χειρότερη περίπτωση.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask5',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 5 — Συνεκτικές συνιστώσες από λίστες γειτνίασης',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Να βρεθούν οι συνεκτικές συνιστώσες ενός γράφου που παριστάνεται με
          λίστα γειτνίασης μέσω δύο γραμμικών πινάκων{' '}
          <InlineMath>{'\\text{Head}'}</InlineMath> και{' '}
          <InlineMath>{'\\text{Succ}'}</InlineMath>. Ποια είναι η πολυπλοκότητα
          του αλγορίθμου εύρεσης των συνεκτικών συνιστωσών;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Μια <strong>συνεκτική συνιστώσα</strong> είναι ένα «νησί» κόμβων όπου
          ο καθένας φτάνει στον καθένα. Αν ξεκινήσουμε διάσχιση από έναν κόμβο,
          θα βρούμε ακριβώς όλο το νησί του.
        </p>
        <p>
          <strong>Ο αλγόριθμος (BFT — Breadth-First Traversal).</strong>
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`BFT(G):
  mark[v] ← false  για κάθε κορυφή v
  for i ← 1 to n:
    if mark[v_i] == false:
      BFS(v_i)        // νέα συνεκτική συνιστώσα`}</pre>
        <p>
          Κάθε φορά που βρίσκουμε κόμβο ασημάδευτο, ξεκινάμε ένα{' '}
          <InlineMath>{'\\text{BFS}'}</InlineMath> που σημαδεύει όλους τους
          προσβάσιμους — αυτοί αποτελούν μία συνιστώσα. Π.χ. το{' '}
          <InlineMath>{'\\text{BFS}'}</InlineMath> από το{' '}
          <InlineMath>{'a'}</InlineMath> ανακαλύπτει τα{' '}
          <InlineMath>{'b, c, d'}</InlineMath> (συνιστώσα 1)· από το{' '}
          <InlineMath>{'e'}</InlineMath> ανακαλύπτει το{' '}
          <InlineMath>{'f'}</InlineMath> (συνιστώσα 2)· από το{' '}
          <InlineMath>{'g'}</InlineMath> το <InlineMath>{'h'}</InlineMath>{' '}
          (συνιστώσα 3).
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Ο εξωτερικός βρόχος κοστίζει{' '}
          <InlineMath>{'\\Theta(n)'}</InlineMath>, και τα BFS μαζί επισκέπτονται
          κάθε κόμβο και κάθε ακμή ακριβώς μία φορά (η αναπαράσταση με λίστες
          γειτνίασης το επιτρέπει):
        </p>
        <BlockMath>{'\\Theta(n) + \\sum_{i=1}^{k}\\Theta(n_i + m_i) = \\Theta(n) + \\Theta(n + m) \\approx \\Theta(n + m)'}</BlockMath>
        <p>
          όπου <InlineMath>{'k'}</InlineMath> το πλήθος των συνιστωσών και{' '}
          <InlineMath>{'n_i, m_i'}</InlineMath> οι κόμβοι και ακμές της{' '}
          <InlineMath>{'i'}</InlineMath>-οστής. Είναι βέλτιστο.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask6',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 6 — Μονοπάτι μέγιστης αξιοπιστίας',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 6',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Μια αποστολή πρέπει να δρομολογηθεί από μια πόλη{' '}
          <InlineMath>{'s'}</InlineMath> σε μια πόλη{' '}
          <InlineMath>{'t'}</InlineMath>. Το οδικό δίκτυο είναι γράφος{' '}
          <InlineMath>{'G = (X, A, P)'}</InlineMath>· για κάθε δρόμο{' '}
          <InlineMath>{'(i,j)'}</InlineMath>, η τιμή{' '}
          <InlineMath>{'P(i,j)'}</InlineMath> είναι η πιθανότητα να διασχιστεί
          χωρίς επιπτώσεις. Ζητάμε δρομολόγιο που <strong>μεγιστοποιεί την
          πιθανότητα</strong> να φτάσει η αποστολή στον{' '}
          <InlineMath>{'t'}</InlineMath> — δηλαδή μονοπάτι μέγιστης αξιοπιστίας.
        </p>
        <p>
          <strong>1.</strong> Επίλεξε τον κατάλληλο αλγόριθμο.{' '}
          <strong>2.</strong> Εφάρμοσέ τον στον γράφο με{' '}
          <InlineMath>{'X = \\{s, v_1, v_2, t\\}'}</InlineMath>,{' '}
          <InlineMath>{'A = \\{(s,v_1),(s,v_2),(v_1,v_2),(v_1,t),(v_2,t)\\}'}</InlineMath>,{' '}
          <InlineMath>{'P(s,v_1)=1,\\ P(s,v_2)=\\tfrac18,\\ P(v_1,v_2)=P(v_2,t)=\\tfrac12,\\ P(v_1,t)=\\tfrac1{16}'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>1. Το πρόβλημα και το κόλπο.</strong> Η αξιοπιστία ενός
          μονοπατιού είναι το <em>γινόμενο</em> των πιθανοτήτων των ακμών του.
          Θέλουμε να <strong>μεγιστοποιήσουμε γινόμενο</strong> — αλλά ο{' '}
          Dijkstra ελαχιστοποιεί <em>άθροισμα</em>. Τα γεφυρώνουμε με λογάριθμο:
        </p>
        <BlockMath>{'\\max \\prod P \\;\\Longleftrightarrow\\; \\max \\sum \\log P \\;\\Longleftrightarrow\\; \\min \\sum (-\\log P)'}</BlockMath>
        <p>
          Θέτουμε νέο βάρος <InlineMath>{'w(i,j) = -\\log P(i,j)'}</InlineMath>.
          Αφού <InlineMath>{'P \\le 1'}</InlineMath>, είναι{' '}
          <InlineMath>{'w \\ge 0'}</InlineMath> — μη αρνητικά βάρη, οπότε ο{' '}
          <strong>Dijkstra</strong> εφαρμόζεται. Το συντομότερο μονοπάτι στον
          μετασχηματισμένο γράφο = μονοπάτι μέγιστης αξιοπιστίας.
        </p>
        <p>
          <strong>2. Εφαρμογή.</strong> Μετασχηματισμένα βάρη (με{' '}
          <InlineMath>{'-\\log_2'}</InlineMath>):{' '}
          <InlineMath>{'w(s,v_1)=0'}</InlineMath>,{' '}
          <InlineMath>{'w(s,v_2)=3'}</InlineMath>,{' '}
          <InlineMath>{'w(v_1,v_2)=1'}</InlineMath>,{' '}
          <InlineMath>{'w(v_2,t)=1'}</InlineMath>,{' '}
          <InlineMath>{'w(v_1,t)=4'}</InlineMath>.
        </p>
        <p>
          Dijkstra από το <InlineMath>{'s'}</InlineMath>. Τα τρία υποψήφια
          μονοπάτια προς <InlineMath>{'t'}</InlineMath>:
        </p>
        <ul>
          <li>
            <InlineMath>{'s \\to v_1 \\to t'}</InlineMath>:{' '}
            <InlineMath>{'0 + 4 = 4'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'s \\to v_2 \\to t'}</InlineMath>:{' '}
            <InlineMath>{'3 + 1 = 4'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'s \\to v_1 \\to v_2 \\to t'}</InlineMath>:{' '}
            <InlineMath>{'0 + 1 + 1 = 2'}</InlineMath> ← ελάχιστο.
          </li>
        </ul>
        <p>
          Το συντομότερο μονοπάτι έχει βάρος <InlineMath>{'2'}</InlineMath>, άρα
          το μονοπάτι μέγιστης αξιοπιστίας είναι{' '}
          <InlineMath>{'s \\to v_1 \\to v_2 \\to t'}</InlineMath> με αξιοπιστία{' '}
          <InlineMath>{'2^{-2} = 1/4'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask7',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 7 — Μονοπάτι μέσα από διατεταγμένα υποσύνολα',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 7',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <p>
        Έστω <InlineMath>{'G = (V, E, W)'}</InlineMath> συνεκτικός, μη
        κατευθυνόμενος, πλήρης γράφος με{' '}
        <InlineMath>{'W: E \\to \\mathbb{R}'}</InlineMath>. Δίνονται ξένα ανά
        δύο υποσύνολα <InlineMath>{'C_1, C_2, \\ldots, C_k \\subseteq V'}</InlineMath>{' '}
        (<InlineMath>{'C_i \\cap C_j = \\emptyset'}</InlineMath>). Σχεδίασε
        πολυωνυμικό αλγόριθμο (με την πολυπλοκότητά του) που βρίσκει μονοπάτι
        ελαχίστου μήκους <InlineMath>{'k'}</InlineMath> κορυφών της μορφής{' '}
        <InlineMath>{'c_1 \\to c_2 \\to \\cdots \\to c_k'}</InlineMath>, με{' '}
        <InlineMath>{'c_i \\in C_i'}</InlineMath> για κάθε{' '}
        <InlineMath>{'i'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Η ιδέα — φτιάχνουμε έναν «στρωματικό» DAG.</strong> Η
          απαίτηση «η <InlineMath>{'i'}</InlineMath>-οστή κορυφή από το{' '}
          <InlineMath>{'C_i'}</InlineMath>» σημαίνει ότι το μονοπάτι περνά
          διαδοχικά από τα υποσύνολα με μια <em>σταθερή σειρά</em>. Αυτό μας
          δίνει φυσική τοπολογική διάταξη.
        </p>
        <ul>
          <li>
            Κράτησε ως κορυφές μόνο τα στοιχεία των{' '}
            <InlineMath>{'C_1, \\ldots, C_k'}</InlineMath>, σε{' '}
            <InlineMath>{'k'}</InlineMath> «στρώματα».
          </li>
          <li>
            Βάλε κατευθυνόμενες ακμές <em>μόνο</em> από κάθε κορυφή του{' '}
            <InlineMath>{'C_i'}</InlineMath> προς κάθε κορυφή του{' '}
            <InlineMath>{'C_{i+1}'}</InlineMath>, με το αρχικό τους βάρος.
          </li>
          <li>
            Πρόσθεσε πηγή <InlineMath>{'s'}</InlineMath> με ακμές βάρους{' '}
            <InlineMath>{'0'}</InlineMath> προς όλο το{' '}
            <InlineMath>{'C_1'}</InlineMath>, και προορισμό{' '}
            <InlineMath>{'t'}</InlineMath> με ακμές βάρους{' '}
            <InlineMath>{'0'}</InlineMath> από όλο το{' '}
            <InlineMath>{'C_k'}</InlineMath>.
          </li>
        </ul>
        <p>
          Το αποτέλεσμα είναι ένας <strong>ακυκλικός κατευθυνόμενος γράφος
          (DAG)</strong> με σαφή τοπολογική διάταξη{' '}
          <InlineMath>{'s, C_1, \\ldots, C_k, t'}</InlineMath>. Τρέξε{' '}
          <strong>συντομότερο μονοπάτι σε DAG</strong> (τοπολογική ταξινόμηση +
          χαλάρωση ακμών). Το ελάχιστο <InlineMath>{'s \\to t'}</InlineMath>{' '}
          μονοπάτι, αφαιρώντας τα <InlineMath>{'s, t'}</InlineMath>, δίνει το
          ζητούμενο (χρειάζεται <InlineMath>{'k \\ge 2'}</InlineMath>).
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Το συντομότερο μονοπάτι σε DAG με
          τοπολογική ταξινόμηση κοστίζει{' '}
          <InlineMath>{'O(|V| + |E|)'}</InlineMath>. Αφού ο αρχικός γράφος είναι
          πλήρης, <InlineMath>{'|E| = O(|V|^2)'}</InlineMath>, άρα ο αλγόριθμος
          είναι <InlineMath>{'O(|V|^2)'}</InlineMath> — πολυωνυμικός.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask8',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 8 — Πιο αναξιόπιστο μονοπάτι σε DAG',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 8',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Δίνεται κατευθυνόμενος <strong>ακυκλικός</strong> γράφος{' '}
          <InlineMath>{'G = (V, E)'}</InlineMath>· κάθε ακμή{' '}
          <InlineMath>{'(u,v)'}</InlineMath> έχει βάρος{' '}
          <InlineMath>{'r(u,v) \\in [0, 1]'}</InlineMath> που συμβολίζει την{' '}
          αξιοπιστία του διαύλου επικοινωνίας (πιθανότητα να μην αποτύχει η
          μετάδοση), με τις πιθανότητες ανεξάρτητες.
        </p>
        <p>
          Προσδιόρισε <strong>δύο</strong> αποδοτικούς αλγορίθμους για την
          εύρεση του <em>πιο αναξιόπιστου</em> μονοπατιού από δεδομένη κορυφή{' '}
          <InlineMath>{'s'}</InlineMath>: ο ένας να το αντιμετωπίζει ως πρόβλημα
          μονοπατιού <strong>μέγιστου</strong> κόστους, ο άλλος ως{' '}
          <strong>ελάχιστου</strong> κόστους, με κατάλληλους μετασχηματισμούς.
          Ποια η πολυπλοκότητα καθενός;
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Η αξιοπιστία ενός μονοπατιού είναι το <em>γινόμενο</em>{' '}
          <InlineMath>{'\\prod r'}</InlineMath> των ακμών του. «Πιο
          αναξιόπιστο» = <strong>ελάχιστο γινόμενο</strong>. Παίρνουμε
          λογάριθμο: <InlineMath>{'\\log\\prod r = \\sum \\log r'}</InlineMath>,
          και επειδή <InlineMath>{'r \\le 1'}</InlineMath> κάθε{' '}
          <InlineMath>{'\\log r \\le 0'}</InlineMath>.
        </p>
        <p>
          <strong>Αλγόριθμος 1 — ως μονοπάτι μέγιστου κόστους.</strong> Θέσε
          βάρος <InlineMath>{'w = -\\log r \\ge 0'}</InlineMath>. Τότε{' '}
          ελαχιστοποίηση του <InlineMath>{'\\prod r'}</InlineMath> ⟺{' '}
          μεγιστοποίηση του <InlineMath>{'\\sum(-\\log r)'}</InlineMath>. Άρα{' '}
          ψάχνουμε το <strong>μονοπάτι μέγιστου κόστους</strong>. Αφού ο γράφος
          είναι DAG, αυτό λύνεται με <strong>τοπολογική ταξινόμηση</strong> και
          χαλάρωση κρατώντας το <em>μέγιστο</em> σε κάθε κορυφή.
        </p>
        <p>
          <strong>Αλγόριθμος 2 — ως μονοπάτι ελάχιστου κόστους.</strong> Θέσε
          βάρος <InlineMath>{'w = \\log r \\le 0'}</InlineMath>.{' '}
          Ελαχιστοποίηση του <InlineMath>{'\\prod r'}</InlineMath> ⟺{' '}
          ελαχιστοποίηση του <InlineMath>{'\\sum \\log r'}</InlineMath>. Τα βάρη
          είναι αρνητικά, οπότε ο Dijkstra <em>δεν</em> ισχύει — αλλά αφού ο
          γράφος είναι DAG, η τοπολογική ταξινόμηση + χαλάρωση δουλεύει ακόμη και
          με αρνητικά βάρη.
        </p>
        <p>
          <strong>Πολυπλοκότητα.</strong> Και οι δύο μέθοδοι (τοπολογική
          ταξινόμηση + ένα πέρασμα χαλάρωσης) κοστίζουν{' '}
          <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>.
        </p>
        <p>
          <strong>Εφαρμογή — μέγιστο κόστος από την κορυφή{' '}
          <InlineMath>{'A'}</InlineMath>.</strong> Διατρέχοντας τις κορυφές σε
          τοπολογική σειρά και χαλαρώνοντας, ο τελικός πίνακας{' '}
          <InlineMath>{'\\text{dist}'}</InlineMath> (μέγιστο κόστος από το{' '}
          <InlineMath>{'A'}</InlineMath>) είναι:
        </p>
        <BlockMath>{'A{:}\\,0,\\ B{:}\\,0{,}17,\\ C{:}\\,2{,}40,\\ D{:}\\,4{,}0,\\ E{:}\\,0{,}81,\\ F{:}\\,10{,}64,\\ G{:}\\,1{,}93,\\ H{:}\\,7{,}63'}</BlockMath>
        <p>
          Η μέγιστη τιμή είναι <InlineMath>{'10{,}64'}</InlineMath> και
          προκύπτει από το μονοπάτι{' '}
          <strong><InlineMath>{'A \\to C \\to D \\to F'}</InlineMath></strong>{' '}
          (το πιο αναξιόπιστο).
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask9',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 9 — Συντομότερο μονοπάτι & μετασχηματισμοί βαρών',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>
          Σ/Λ; Σε έναν γράφο με βάρη, το συντομότερο μονοπάτι μεταξύ δύο κορυφών{' '}
          <strong>δεν μεταβάλλεται</strong> αν όλα τα βάρη:
        </p>
        <p>
          <strong>Α.</strong> πολλαπλασιαστούν με τον ίδιο θετικό αριθμό.{' '}
          <strong>Β.</strong> αυξηθούν κατά τον ίδιο θετικό αριθμό (πρόσθεση).
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Α. ΣΩΣΤΟ.</strong> Έστω το συντομότερο μονοπάτι έχει άθροισμα
          βαρών <InlineMath>{'\\sum_i w_i'}</InlineMath> και κάθε άλλο μονοπάτι{' '}
          <InlineMath>{'\\sum_j w_j'}</InlineMath>, με{' '}
          <InlineMath>{'\\sum_i w_i < \\sum_j w_j'}</InlineMath>. Αν
          πολλαπλασιάσουμε κάθε ακμή με <InlineMath>{'a > 0'}</InlineMath>:
        </p>
        <BlockMath>{'a\\sum_i w_i = \\sum_i a\\,w_i \\;<\\; \\sum_j a\\,w_j = a\\sum_j w_j'}</BlockMath>
        <p>
          Η ανισότητα <strong>διατηρείται</strong> (πολλαπλασιασμός με θετικό
          αριθμό), άρα το ίδιο μονοπάτι παραμένει το συντομότερο.
        </p>
        <p>
          <strong>Β. ΛΑΘΟΣ.</strong> Η πρόσθεση μιας σταθεράς{' '}
          <InlineMath>{'\\alpha'}</InlineMath> σε <em>κάθε ακμή</em> τιμωρεί τα
          μονοπάτια με <strong>περισσότερες ακμές</strong>: ένα μονοπάτι με{' '}
          <InlineMath>{'\\ell'}</InlineMath> ακμές χρεώνεται επιπλέον{' '}
          <InlineMath>{'\\ell\\cdot\\alpha'}</InlineMath>. Έτσι, ένα μονοπάτι με
          λίγες «βαριές» ακμές μπορεί να προσπεράσει ένα με πολλές «ελαφριές».
        </p>
        <p>
          <strong>Αντιπαράδειγμα.</strong> Δύο κορυφές συνδέονται με δύο
          μονοπάτια: το πάνω με <strong>3 ακμές</strong> βάρους{' '}
          <InlineMath>{'1'}</InlineMath> (σύνολο{' '}
          <InlineMath>{'3'}</InlineMath>), το κάτω με{' '}
          <strong>2 ακμές</strong> βάρους <InlineMath>{'2'}</InlineMath>{' '}
          (σύνολο <InlineMath>{'4'}</InlineMath>). Αρχικά συντομότερο = το πάνω
          (<InlineMath>{'3 < 4'}</InlineMath>). Προσθέτουμε{' '}
          <InlineMath>{'\\alpha = 10'}</InlineMath> σε κάθε ακμή:
        </p>
        <BlockMath>{'\\text{πάνω}: 3\\times 11 = 33, \\qquad \\text{κάτω}: 2\\times 12 = 24'}</BlockMath>
        <p>
          Τώρα συντομότερο είναι το <em>κάτω</em>{' '}
          (<InlineMath>{'24 < 33'}</InlineMath>) — το συντομότερο μονοπάτι{' '}
          <strong>άλλαξε</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'front-set-5-ask11',
    title: 'Φροντιστηριακό Σετ #5 · Άσκηση 11 — Ζεύγη με δοσμένο άθροισμα σε O(n)',
    topic: 'data-structures',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #5',
    problemNumber: 'Άσκηση 11',
    difficulty: 'medium',
    prerequisites: ['lectures/L10-data-structures'],
    statement: (
      <p>
        Σχεδίασε αλγόριθμο που, δοθέντος ενός πίνακα{' '}
        <InlineMath>{'A'}</InlineMath> με <InlineMath>{'n'}</InlineMath>{' '}
        διαφορετικούς ακεραίους στο εύρος{' '}
        <InlineMath>{'\\{1, \\ldots, n^4\\}'}</InlineMath> και τιμή στόχο{' '}
        <InlineMath>{'x'}</InlineMath>, εκτυπώνει όλα τα ζεύγη{' '}
        <InlineMath>{'(i, j)'}</InlineMath> με{' '}
        <InlineMath>{'A[i] + A[j] = x'}</InlineMath>. Ο αναμενόμενος χρόνος
        πρέπει να είναι <InlineMath>{'O(n)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Γιατί όχι απλός πίνακας;</strong> Οι τιμές φτάνουν το{' '}
          <InlineMath>{'n^4'}</InlineMath> — ένας πίνακας άμεσης διευθυνσιοδότησης
          μεγέθους <InlineMath>{'n^4'}</InlineMath> θα ήταν τεράστια σπατάλη
          μνήμης. Χρησιμοποιούμε <strong>πίνακα κατακερματισμού</strong> (hash
          table): αποθηκεύει <InlineMath>{'n'}</InlineMath> στοιχεία και δίνει
          εισαγωγή / αναζήτηση <InlineMath>{'O(1)'}</InlineMath> κατά μέσο όρο,
          ανεξάρτητα από το πόσο μεγάλες είναι οι τιμές.
        </p>
        <p>
          <strong>Ο αλγόριθμος — σε δύο περάσματα.</strong>
        </p>
        <ul>
          <li>
            <strong>Φάση 1.</strong> Πέρασε όλον τον πίνακα και τοποθέτησε κάθε
            τιμή <InlineMath>{'A[i]'}</InlineMath> (μαζί με τον δείκτη της) σε
            έναν πίνακα κατακερματισμού. Κόστος{' '}
            <InlineMath>{'O(n)'}</InlineMath> αναμενόμενο.
          </li>
          <li>
            <strong>Φάση 2.</strong> Για κάθε <InlineMath>{'A[i]'}</InlineMath>,
            υπολόγισε το «συμπλήρωμα»{' '}
            <InlineMath>{'b = x - A[i]'}</InlineMath> και ψάξε το στον πίνακα
            κατακερματισμού. Αν βρεθεί, τότε το{' '}
            <InlineMath>{'(A[i], b)'}</InlineMath> είναι ζεύγος με άθροισμα{' '}
            <InlineMath>{'x'}</InlineMath> — εκτύπωσέ το. Κάθε αναζήτηση{' '}
            <InlineMath>{'O(1)'}</InlineMath> αναμενόμενα.
          </li>
        </ul>
        <p>
          <strong>Πολυπλοκότητα.</strong>{' '}
          <InlineMath>{'O(n) + O(n) = O(n)'}</InlineMath> αναμενόμενος χρόνος.
          Ο πίνακας κατακερματισμού είναι το κλειδί: μετατρέπει το «υπάρχει το
          συμπλήρωμα;» από γραμμικό ψάξιμο σε σταθερό χρόνο.
        </p>
      </>
    ),
  },

  // ── Παλαιό Θέμα #6 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt6-th1',
    title: 'Παλαιό Θέμα #6 · Θέμα 1 — BFS/DFS & εύρεση γειτόνων N(v)',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #6',
    problemNumber: 'Θέμα 1',
    weight: 15,
    difficulty: 'easy',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>
          Δίνεται ένας μη κατευθυνόμενος γράφος <InlineMath>{'G = (V, E, W)'}</InlineMath> με <InlineMath>{'|V|'}</InlineMath> κόμβους, <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath> ακμές, και <InlineMath>{'\\Delta(v)'}</InlineMath> ο βαθμός του κόμβου <InlineMath>{'v'}</InlineMath>.
        </p>
        <p><strong>i.</strong> Να δοθεί η πολυπλοκότητα των <InlineMath>{'\\text{BFS}()'}</InlineMath>, <InlineMath>{'\\text{DFS}()'}</InlineMath> στον <InlineMath>{'G'}</InlineMath>.</p>
        <p><strong>ii.</strong> Να δοθεί αλγόριθμος σε φυσική γλώσσα που βρίσκει τους γείτονες <InlineMath>{'N(v)'}</InlineMath> ενός κόμβου <InlineMath>{'v'}</InlineMath> του <InlineMath>{'G'}</InlineMath> και να υπολογιστεί η πολυπλοκότητά του όταν: (α) η αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι με λίστες γειτνίασης· (β) η αναπαράσταση του <InlineMath>{'G'}</InlineMath> είναι με πίνακα γειτνίασης.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. Πολυπλοκότητα BFS/DFS.</strong> Και οι δύο διασχίσεις «αγγίζουν» κάθε κόμβο μία φορά και κάθε ακμή σταθερό αριθμό φορών, άρα τρέχουν σε <InlineMath>{'O(|V| + |E|)'}</InlineMath>. Εδώ μας δίνεται ότι <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath> — ο γράφος είναι «αραιός», οι ακμές είναι ανάλογες των κόμβων. Άρα:</p>
        <BlockMath>{'O(|V| + |E|) = O(|V| + \\Theta(|V|)) = O(|V|)'}</BlockMath>
        <p>Δηλαδή γραμμικός χρόνος ως προς το πλήθος των κόμβων.</p>
        <p><strong>ii. Εύρεση των γειτόνων <InlineMath>{'N(v)'}</InlineMath>.</strong> «Γείτονας» του <InlineMath>{'v'}</InlineMath> είναι κάθε κόμβος που συνδέεται με μια ακμή με τον <InlineMath>{'v'}</InlineMath>. Πόσο γρήγορα τους βρίσκουμε εξαρτάται αποκλειστικά από το πώς είναι αποθηκευμένος ο γράφος.</p>
        <p><strong>(α) Λίστες γειτνίασης.</strong> Εδώ ο γράφος κρατά, για κάθε κόμβο, μια λίστα με ακριβώς τους γείτονές του. Αλγόριθμος: «πήγαινε στη λίστα του <InlineMath>{'v'}</InlineMath> και διάβασέ την μέχρι το τέλος». Η λίστα του <InlineMath>{'v'}</InlineMath> έχει ακριβώς <InlineMath>{'\\Delta(v)'}</InlineMath> στοιχεία, άρα ο χρόνος είναι <InlineMath>{'O(\\Delta(v))'}</InlineMath> — πληρώνεις μόνο όσους γείτονες πραγματικά υπάρχουν.</p>
        <p><strong>(β) Πίνακας γειτνίασης.</strong> Εδώ ο γράφος κρατά έναν πίνακα <InlineMath>{'|V| \\times |V|'}</InlineMath>, όπου το κελί <InlineMath>{'[v][u]'}</InlineMath> λέει αν υπάρχει ακμή <InlineMath>{'v\\!-\\!u'}</InlineMath>. Αλγόριθμος: «σάρωσε ολόκληρη τη γραμμή <InlineMath>{'v'}</InlineMath> του πίνακα και κράτα όσα κελιά είναι <InlineMath>{'1'}</InlineMath>». Η γραμμή έχει <InlineMath>{'|V|'}</InlineMath> κελιά — τα ελέγχεις όλα, ακόμη κι αν ο <InlineMath>{'v'}</InlineMath> έχει μόνο 2 γείτονες. Άρα ο χρόνος είναι <InlineMath>{'O(|V|)'}</InlineMath>.</p>
        <p><strong>Το συμπέρασμα.</strong> Για αραιούς γράφους οι λίστες γειτνίασης είναι σαφώς καλύτερες: <InlineMath>{'O(\\Delta(v))'}</InlineMath> αντί για <InlineMath>{'O(|V|)'}</InlineMath>. Γι’ αυτό όλοι οι αλγόριθμοι γραφημάτων (BFS/DFS/Dijkstra) προϋποθέτουν λίστες γειτνίασης.</p>
      </>
    ),
  },
  {
    id: 'pt6-th2',
    title: 'Παλαιό Θέμα #6 · Θέμα 2 — Χρονοπρογραμματισμός με βάρη (πλατφόρμα δόνησης)',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #6',
    problemNumber: 'Θέμα 2',
    weight: 35,
    difficulty: 'hard',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Το γυμναστήριο της γειτονιάς σας απέκτησε πρόσφατα μια υπερσύγχρονη πλατφόρμα δόνησης, ένα πολύ ακριβό όργανο που υπόσχεται μυϊκή ενδυνάμωση. Πολλοί αθλούμενοι θέλουν να τη χρησιμοποιήσουν: κάθε αίτημα <InlineMath>{'i'}</InlineMath> χαρακτηρίζεται από έναν χρόνο έναρξης <InlineMath>{'s_i'}</InlineMath>, έναν χρόνο λήξης <InlineMath>{'e_i'}</InlineMath> και μια συνδρομή <InlineMath>{'p_i'}</InlineMath> που είναι διατεθειμένος να πληρώσει. Υπάρχει μόνο μία πλατφόρμα, οπότε δεν μπορούν να εξυπηρετηθούν δύο αιτήματα που επικαλύπτονται χρονικά. Το γυμναστήριο θέλει να επιλέξει ένα υποσύνολο <InlineMath>{'S \\subseteq \\{1, 2, \\dots, n\\}'}</InlineMath> μη επικαλυπτόμενων αιτημάτων ώστε να μεγιστοποιηθεί το συνολικό άθροισμα των συνδρομών.</p>
        <p><strong>(Α)</strong> Θεωρήστε τον εξής άπληστο αλγόριθμο: ταξινόμησε τα αιτήματα κατά φθίνουσα συνδρομή, διάλεξε το πρώτο, και κατόπιν, σαρώνοντας τη λίστα, διάλεξε κάθε επόμενο αίτημα που είναι συμβατό (δεν επικαλύπτεται) με όσα έχεις ήδη επιλέξει. Επιλύει ο αλγόριθμος αυτός το παραπάνω πρόβλημα; Αν όχι, δώστε αντιπαράδειγμα.</p>
        <p><strong>(Β)</strong> Βρείτε την τιμή <InlineMath>{'P[n]'}</InlineMath> (συνολικό άθροισμα των συνδρομών) της βέλτιστης λύσης.</p>
        <p className="text-sm text-fg-subtle"><em>Σημείωση μεταγραφής: το πρωτότυπο είναι αχνό σκαναρισμένο φύλλο με <InlineMath>{'n = 7'}</InlineMath> αιτήματα. Παρακάτω διδάσκουμε πλήρως τη μέθοδο και τη δουλεύουμε σε ένα καθαρό, αντιπροσωπευτικό στιγμιότυπο.</em></p>
      </>
    ),
    solution: (
      <>
        <p><strong>(Α) Ο άπληστος «κατά συνδρομή» ΔΕΝ είναι βέλτιστος.</strong> Διαλέγοντας πάντα το ακριβότερο αίτημα μπορεί να «μπλοκάρεις» δύο φθηνότερα που μαζί αξίζουν περισσότερο.</p>
        <p><strong>Αντιπαράδειγμα.</strong> Τρία αιτήματα: <InlineMath>{'A = [0, 10]'}</InlineMath> με <InlineMath>{'p_A = 100'}</InlineMath>· <InlineMath>{'B = [0, 5]'}</InlineMath> με <InlineMath>{'p_B = 60'}</InlineMath>· <InlineMath>{'C = [6, 10]'}</InlineMath> με <InlineMath>{'p_C = 60'}</InlineMath>. Ο άπληστος διαλέγει πρώτα το <InlineMath>{'A'}</InlineMath> (ακριβότερο, <InlineMath>{'100'}</InlineMath>)· τότε <InlineMath>{'B'}</InlineMath> και <InlineMath>{'C'}</InlineMath> επικαλύπτονται με το <InlineMath>{'A'}</InlineMath> και απορρίπτονται → σύνολο <InlineMath>{'100'}</InlineMath>. Η βέλτιστη λύση όμως είναι <InlineMath>{'\\{B, C\\}'}</InlineMath> (δεν επικαλύπτονται) → σύνολο <InlineMath>{'120'}</InlineMath>. Άρα ο άπληστος αποτυγχάνει.</p>
        <p><strong>(Β) Η σωστή λύση: δυναμικός προγραμματισμός (χρονοπρογραμματισμός με βάρη).</strong> Αυτό είναι το κλασικό <em>weighted interval scheduling</em>.</p>
        <p><strong>Βήμα 1 — ταξινόμηση.</strong> Ταξινόμησε τα <InlineMath>{'n'}</InlineMath> αιτήματα κατά αύξοντα χρόνο λήξης <InlineMath>{'e_1 \\le e_2 \\le \\dots \\le e_n'}</InlineMath>.</p>
        <p><strong>Βήμα 2 — προκάτοχος.</strong> Για κάθε αίτημα <InlineMath>{'j'}</InlineMath> όρισε <InlineMath>{'p(j)'}</InlineMath> = ο μεγαλύτερος δείκτης <InlineMath>{'i < j'}</InlineMath> τέτοιος ώστε το αίτημα <InlineMath>{'i'}</InlineMath> να λήγει πριν αρχίσει το <InlineMath>{'j'}</InlineMath> (<InlineMath>{'e_i \\le s_j'}</InlineMath>) — δηλαδή το «τελευταίο συμβατό αίτημα πριν το <InlineMath>{'j'}</InlineMath>». Βρίσκεται με δυαδική αναζήτηση.</p>
        <p><strong>Βήμα 3 — αναδρομική σχέση.</strong> Έστω <InlineMath>{'P[j]'}</InlineMath> = το μέγιστο άθροισμα συνδρομών χρησιμοποιώντας μόνο τα πρώτα <InlineMath>{'j'}</InlineMath> αιτήματα. Για το αίτημα <InlineMath>{'j'}</InlineMath> έχουμε δύο επιλογές — το παίρνουμε ή όχι:</p>
        <BlockMath>{'P[j] = \\max\\bigl(\\,P[j-1],\\;\\; p_j + P[p(j)]\\,\\bigr), \\qquad P[0] = 0'}</BlockMath>
        <p>Αν δεν πάρουμε το <InlineMath>{'j'}</InlineMath>, η λύση είναι ό,τι καλύτερο γινόταν με τα <InlineMath>{'j-1'}</InlineMath>. Αν το πάρουμε, κερδίζουμε <InlineMath>{'p_j'}</InlineMath> και επιτρέπεται να συνδυαστεί μόνο με τη βέλτιστη λύση των αιτημάτων ως τον προκάτοχο <InlineMath>{'p(j)'}</InlineMath>.</p>
        <p><strong>Βήμα 4.</strong> Η ζητούμενη τιμή είναι <InlineMath>{'P[n]'}</InlineMath>. Με οπισθοδρόμηση στον πίνακα <InlineMath>{'P'}</InlineMath> βρίσκουμε και το ίδιο το υποσύνολο των αιτημάτων.</p>
        <p><strong>Παράδειγμα (το αντιπαράδειγμα από πάνω).</strong> Ταξινομημένα κατά λήξη: <InlineMath>{'B=[0,5]'}</InlineMath>, <InlineMath>{'A=[0,10]'}</InlineMath>, <InlineMath>{'C=[6,10]'}</InlineMath>. Προκάτοχοι: <InlineMath>{'p(B)=0'}</InlineMath>, <InlineMath>{'p(A)=0'}</InlineMath>, <InlineMath>{'p(C)=1'}</InlineMath> (το <InlineMath>{'B'}</InlineMath> λήγει στο 5, το <InlineMath>{'C'}</InlineMath> αρχίζει στο 6). Τότε <InlineMath>{'P[1]=60'}</InlineMath>, <InlineMath>{'P[2]=\\max(60,\\,100+0)=100'}</InlineMath>, <InlineMath>{'P[3]=\\max(100,\\,60+P[1])=\\max(100,120)=120'}</InlineMath>. Άρα <InlineMath>{'P[n]=120'}</InlineMath> με επιλογή <InlineMath>{'\\{B,C\\}'}</InlineMath> — όσο ακριβώς προβλέψαμε.</p>
        <p><strong>Πολυπλοκότητα.</strong> Ταξινόμηση <InlineMath>{'O(n \\log n)'}</InlineMath>· κάθε <InlineMath>{'p(j)'}</InlineMath> με δυαδική αναζήτηση <InlineMath>{'O(\\log n)'}</InlineMath>· γέμισμα του πίνακα <InlineMath>{'O(n)'}</InlineMath>. Σύνολο <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'pt6-th3',
    title: 'Παλαιό Θέμα #6 · Θέμα 3 — Master Theorem & επιδιόρθωση σωρού',
    topic: 'data-structures',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #6',
    problemNumber: 'Θέμα 3',
    weight: 25,
    difficulty: 'medium',
    prerequisites: ['lectures/L03-divide-and-conquer-i', 'lectures/L10-data-structures'],
    statement: (
      <>
        <p><strong>(Α)</strong> Να επιλυθεί η αναδρομική εξίσωση <InlineMath>{'T(n) = 3\\,T(2n/3) + c'}</InlineMath>, όπου <InlineMath>{'T(1) = \\Theta(1)'}</InlineMath> και <InlineMath>{'c'}</InlineMath> μια σταθερά θετική, με χρήση του Θεωρήματος Κυριαρχίας (Master Theorem).</p>
        <p><strong>(Β)</strong> Η ακολουθία <InlineMath>{'t_1, t_2, \\dots, t_n'}</InlineMath> είναι αποθηκευμένη στον μονοδιάστατο πίνακα <InlineMath>{'H'}</InlineMath> υπό δομή σωρού (max-heap). Κάποιος όρος <InlineMath>{'t_s'}</InlineMath> αλλάζει και παίρνει μικρότερη τιμή. Ο νέος πίνακας <InlineMath>{'H'}</InlineMath> ενδέχεται να μην είναι πλέον σωρός.</p>
        <p><strong>i.</strong> Να δοθεί σύντομα ένας αναδρομικός αλγόριθμος <InlineMath>{'RA(H, i)'}</InlineMath> που διατηρεί στον <InlineMath>{'H'}</InlineMath> τη δομή σωρού. <strong>ii.</strong> Να δοθεί η αναδρομική σχέση <InlineMath>{'S(n)'}</InlineMath> που περιγράφει την πολυπλοκότητα του αλγορίθμου στη χείριστη περίπτωση. <strong>iii.</strong> Να επιλυθεί η <InlineMath>{'S(n)'}</InlineMath>, με <InlineMath>{'S(1) = \\Theta(1)'}</InlineMath>. <strong>iv.</strong> Εφαρμόστε τον αλγόριθμο για έναν εσωτερικό κόμβο που κρατούσε την τιμή <InlineMath>{'14'}</InlineMath>, όταν αυτή αλλάζει σε <InlineMath>{'13'}</InlineMath> και όταν αλλάζει σε <InlineMath>{'6'}</InlineMath> (τα παιδιά του κόμβου κρατούν τις τιμές <InlineMath>{'8'}</InlineMath> και <InlineMath>{'10'}</InlineMath>).</p>
      </>
    ),
    solution: (
      <>
        <p><strong>(Α) Master Theorem.</strong> Έχουμε <InlineMath>{'T(n) = a\\,T(n/b) + f(n)'}</InlineMath> με <InlineMath>{'a = 3'}</InlineMath>, <InlineMath>{'b = 3/2'}</InlineMath> (αφού <InlineMath>{'2n/3 = n / (3/2)'}</InlineMath>) και <InlineMath>{'f(n) = c = \\Theta(1)'}</InlineMath>.</p>
        <p>Συγκρίνουμε το <InlineMath>{'f(n)'}</InlineMath> με το <InlineMath>{'n^{\\log_b a} = n^{\\log_{3/2} 3}'}</InlineMath>. Επειδή <InlineMath>{'\\log_{3/2} 3 \\approx 2{,}71 > 0'}</InlineMath>, η συνάρτηση <InlineMath>{'n^{\\log_b a}'}</InlineMath> μεγαλώνει πολυωνυμικά, ενώ το <InlineMath>{'f(n) = \\Theta(1)'}</InlineMath> είναι σταθερό — άρα <em>πολυωνυμικά μικρότερο</em>. Αυτή είναι η <strong>περίπτωση 1</strong> του θεωρήματος:</p>
        <BlockMath>{'T(n) = \\Theta\\!\\left(n^{\\log_{3/2} 3}\\right) \\approx \\Theta(n^{2{,}71})'}</BlockMath>
        <p>Διαισθητικά: η δουλειά συγκεντρώνεται στα φύλλα της αναδρομής. Σε κάθε επίπεδο ο αριθμός των κλήσεων τριπλασιάζεται ενώ το μέγεθος μειώνεται με ρυθμό <InlineMath>{'2/3'}</InlineMath>, οπότε το πλήθος των φύλλων κυριαρχεί.</p>
        <p><strong>(Β) i. Ο αλγόριθμος <InlineMath>{'RA(H, i)'}</InlineMath> — «βύθιση» (sift-down).</strong> Σε έναν max-heap κάθε γονιός είναι <InlineMath>{'\\ge'}</InlineMath> από τα παιδιά του. Όταν ένας όρος <em>μικραίνει</em>, το μόνο που μπορεί να χαλάσει είναι: ο κόμβος να γίνει μικρότερος από κάποιο παιδί του (προς τα πάνω είναι εντάξει — ο γονιός του ήταν ήδη μεγαλύτερος). Άρα:</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`RA(H, i):
  μέγιστο := i
  αν αριστερό παιδί υπάρχει και H[left] > H[μέγιστο]: μέγιστο := left
  αν δεξί παιδί υπάρχει και H[right] > H[μέγιστο]:    μέγιστο := right
  αν μέγιστο ≠ i:
      αντάλλαξε H[i] με H[μέγιστο]
      RA(H, μέγιστο)        // αναδρομή στο παιδί που πήρε τον κόμβο`}</pre>
        <p>Δηλαδή: σύγκρινε τον κόμβο με τα δύο παιδιά του· αν κάποιο είναι μεγαλύτερο, αντάλλαξέ τον με το <em>μεγαλύτερο</em> παιδί και επανάλαβε από εκεί. Σταματά όταν ο κόμβος είναι <InlineMath>{'\\ge'}</InlineMath> και από τα δύο παιδιά, ή φτάσει σε φύλλο.</p>
        <p><strong>ii. Αναδρομική σχέση.</strong> Σε κάθε κλήση γίνεται σταθερή δουλειά (δύο συγκρίσεις, μία αντιμετάθεση) και το πολύ μία αναδρομική κλήση σε ένα υποδέντρο. Στη χείριστη περίπτωση το υποδέντρο ενός παιδιού έχει μέγεθος έως <InlineMath>{'2n/3'}</InlineMath> των κόμβων:</p>
        <BlockMath>{'S(n) = S(2n/3) + \\Theta(1)'}</BlockMath>
        <p><strong>iii. Επίλυση.</strong> Master Theorem με <InlineMath>{'a = 1'}</InlineMath>, <InlineMath>{'b = 3/2'}</InlineMath>, <InlineMath>{'f(n) = \\Theta(1)'}</InlineMath>: <InlineMath>{'n^{\\log_b a} = n^0 = 1'}</InlineMath>, ίσο τάξης με το <InlineMath>{'f(n)'}</InlineMath> → <strong>περίπτωση 2</strong>:</p>
        <BlockMath>{'S(n) = \\Theta(\\log n)'}</BlockMath>
        <p>Λογικό: η βύθιση διασχίζει το πολύ ένα μονοπάτι από τη ρίζα ως φύλλο, και το ύψος ενός σωρού <InlineMath>{'n'}</InlineMath> στοιχείων είναι <InlineMath>{'\\Theta(\\log n)'}</InlineMath>.</p>
        <p><strong>iv. Εφαρμογή.</strong> Ο κόμβος που άλλαξε έχει παιδιά με τιμές <InlineMath>{'8'}</InlineMath> και <InlineMath>{'10'}</InlineMath>.</p>
        <ul>
          <li><strong><InlineMath>{'14 \\to 13'}</InlineMath>:</strong> ελέγχουμε <InlineMath>{'13'}</InlineMath> με τα παιδιά <InlineMath>{'8, 10'}</InlineMath>. Είναι <InlineMath>{'13 \\ge 8'}</InlineMath> και <InlineMath>{'13 \\ge 10'}</InlineMath> → η ιδιότητα σωρού ισχύει ήδη, ο <InlineMath>{'RA'}</InlineMath> δεν κάνει <em>καμία</em> αντιμετάθεση.</li>
          <li><strong><InlineMath>{'14 \\to 6'}</InlineMath>:</strong> τώρα <InlineMath>{'6 < 10'}</InlineMath> (το μεγαλύτερο παιδί) → αντάλλαξε: το <InlineMath>{'10'}</InlineMath> ανεβαίνει, το <InlineMath>{'6'}</InlineMath> κατεβαίνει στη θέση του πρώην <InlineMath>{'10'}</InlineMath>. Η αναδρομή συνεχίζει: συγκρίνουμε ξανά το <InlineMath>{'6'}</InlineMath> με τα νέα του παιδιά· όσο υπάρχει μεγαλύτερο παιδί, ξανα-βυθίζεται, αλλιώς σταματά. Το <InlineMath>{'6'}</InlineMath> κατεβαίνει κατά μήκος ενός μονοπατιού μέχρι να βρει τη σωστή του θέση.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'pt6-th4',
    title: 'Παλαιό Θέμα #6 · Θέμα 4 — Υπόδεντρο ελάχιστου βάρους & κλάσεις P/NP',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #6',
    problemNumber: 'Θέμα 4',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε ένα γράφο <InlineMath>{'G = (V, E, W)'}</InlineMath> με <InlineMath>{'|V| = n'}</InlineMath>, <InlineMath>{'|E| = m'}</InlineMath> και <InlineMath>{'W'}</InlineMath> μια συνάρτηση που ορίζει θετικά ακέραια βάρη στις πλευρές. Έστω <InlineMath>{'S \\subseteq V'}</InlineMath>. Θέλουμε να βρούμε ένα δέντρο <InlineMath>{'T = (V\', E\')'}</InlineMath> υπογράφο του <InlineMath>{'G'}</InlineMath> ελάχιστου βάρους που περιέχει το <InlineMath>{'S'}</InlineMath>. Θεωρήστε το πρόβλημα <InlineMath>{'\\Pi'}</InlineMath> όπου <InlineMath>{'|S| = n'}</InlineMath>.</p>
        <p><strong>(i)</strong> Να γραφεί το πρόβλημα απόφασης <InlineMath>{'\\Pi_A'}</InlineMath> του <InlineMath>{'\\Pi'}</InlineMath>. <strong>(ii)</strong> Να δειχθεί ότι <InlineMath>{'\\Pi_A'}</InlineMath> ανήκει στην κλάση <InlineMath>{'NP'}</InlineMath>. <strong>(iii)</strong> Να δειχθεί ότι <InlineMath>{'\\Pi_A'}</InlineMath> ανήκει στην κλάση <InlineMath>{'P'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η κρίσιμη παρατήρηση.</strong> Όταν <InlineMath>{'|S| = n = |V|'}</InlineMath>, το <InlineMath>{'S'}</InlineMath> περιέχει <em>όλους</em> τους κόμβους. Ένα δέντρο που περιέχει όλους τους κόμβους και είναι υπογράφος του <InlineMath>{'G'}</InlineMath> είναι ακριβώς ένα <strong>δέντρο επικάλυψης</strong> (spanning tree). Άρα το <InlineMath>{'\\Pi'}</InlineMath> εκφυλίζεται στο γνωστό πρόβλημα του <strong>ελάχιστου δέντρου επικάλυψης (MST)</strong>!</p>
        <p><strong>(i) Πρόβλημα απόφασης <InlineMath>{'\\Pi_A'}</InlineMath>.</strong> Ένα πρόβλημα βελτιστοποίησης το μετατρέπουμε σε πρόβλημα απόφασης βάζοντας ένα κατώφλι: <em>«Δοθέντος γράφου <InlineMath>{'G'}</InlineMath> και ακεραίου <InlineMath>{'k'}</InlineMath>, υπάρχει δέντρο επικάλυψης του <InlineMath>{'G'}</InlineMath> με συνολικό βάρος <InlineMath>{'\\le k'}</InlineMath>;»</em> (η απάντηση είναι ΝΑΙ/ΟΧΙ).</p>
        <p><strong>(ii) <InlineMath>{'\\Pi_A \\in NP'}</InlineMath>.</strong> Ένα πρόβλημα είναι στο <InlineMath>{'NP'}</InlineMath> αν, όταν η απάντηση είναι ΝΑΙ, υπάρχει «πιστοποιητικό» που επαληθεύεται σε πολυωνυμικό χρόνο. Εδώ το πιστοποιητικό είναι το ίδιο το δέντρο <InlineMath>{'T'}</InlineMath>. Επαλήθευση: ελέγχουμε ότι το <InlineMath>{'T'}</InlineMath> έχει ακριβώς <InlineMath>{'n-1'}</InlineMath> ακμές, είναι συνεκτικό και περιέχει όλους τους κόμβους (με ένα BFS/DFS, <InlineMath>{'O(n + m)'}</InlineMath>), και ότι το άθροισμα των βαρών του είναι <InlineMath>{'\\le k'}</InlineMath> (<InlineMath>{'O(n)'}</InlineMath>). Όλα πολυωνυμικά → <InlineMath>{'\\Pi_A \\in NP'}</InlineMath>.</p>
        <p><strong>(iii) <InlineMath>{'\\Pi_A \\in P'}</InlineMath>.</strong> Ένα πρόβλημα είναι στο <InlineMath>{'P'}</InlineMath> αν λύνεται σε πολυωνυμικό χρόνο. Το MST λύνεται από τους αλγορίθμους <strong>Kruskal</strong> ή <strong>Prim</strong> σε χρόνο <InlineMath>{'O(m \\log n)'}</InlineMath> — πολυωνυμικό. Αφού μπορούμε να βρούμε το <em>ελάχιστο</em> βάρος, απλώς το συγκρίνουμε με το <InlineMath>{'k'}</InlineMath> για να απαντήσουμε στο <InlineMath>{'\\Pi_A'}</InlineMath>. Άρα <InlineMath>{'\\Pi_A \\in P'}</InlineMath>.</p>
        <p>(Σημείωση: αφού <InlineMath>{'P \\subseteq NP'}</InlineMath>, το ερώτημα (ii) προκύπτει και ως άμεση συνέπεια του (iii) — αλλά είναι διδακτικό να δοθεί και το πιστοποιητικό ξεχωριστά.)</p>
      </>
    ),
  },
  // ── Παλαιό Θέμα #7 — μεταγραμμένο & χωρισμένο ανά διάλεξη ──────────────
  {
    id: 'pt7-th1',
    title: 'Παλαιό Θέμα #7 · Θέμα 1 — Ανεξάρτητο σύνολο: NP και P για σταθερό k',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #7',
    problemNumber: 'Θέμα 1',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε το πρόβλημα του ανεξάρτητου συνόλου:</p>
        <p><strong>INDEP:</strong> Δοθέντος ενός μη κατευθυνόμενου γράφου <InlineMath>{'G'}</InlineMath> με <InlineMath>{'n'}</InlineMath> κόμβους και ενός μη αρνητικού ακεραίου <InlineMath>{'k \\le n'}</InlineMath>, περιέχει ο <InlineMath>{'G'}</InlineMath> <InlineMath>{'k'}</InlineMath>-ανεξάρτητο σύνολο; (Ένα <InlineMath>{'k'}</InlineMath>-ανεξάρτητο σύνολο είναι <InlineMath>{'k'}</InlineMath> κόμβοι που ανά 2 δεν συνδέονται με ακμή.)</p>
        <p><strong>i.</strong> Αποδείξτε ότι το πρόβλημα INDEP ανήκει στην κλάση <InlineMath>{'NP'}</InlineMath>.</p>
        <p><strong>ii.</strong> Αποδείξτε ότι όταν το <InlineMath>{'k'}</InlineMath> έχει σταθερή τιμή, π.χ. <InlineMath>{'k = 1000'}</InlineMath>, τότε το πρόβλημα INDEP ανήκει στην κλάση <InlineMath>{'P'}</InlineMath>. (Να περιγραφεί σύντομα σε φυσική γλώσσα ο αλγόριθμος και να δοθεί η πολυπλοκότητα.)</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. INDEP <InlineMath>{'\\in NP'}</InlineMath>.</strong> Πρέπει να δείξουμε ότι, όταν η απάντηση είναι ΝΑΙ, υπάρχει πιστοποιητικό που επαληθεύεται σε πολυωνυμικό χρόνο.</p>
        <p>Πιστοποιητικό: ένα σύνολο <InlineMath>{'U'}</InlineMath> από <InlineMath>{'k'}</InlineMath> κόμβους. Επαλήθευση: για κάθε ζεύγος κόμβων του <InlineMath>{'U'}</InlineMath> ελέγχουμε ότι ΔΕΝ υπάρχει ακμή ανάμεσά τους. Τα ζεύγη είναι <InlineMath>{'\\binom{k}{2} = O(k^2)'}</InlineMath> και κάθε έλεγχος ακμής είναι <InlineMath>{'O(1)'}</InlineMath> (με πίνακα γειτνίασης). Συνολικά <InlineMath>{'O(k^2) = O(n^2)'}</InlineMath> — πολυωνυμικό. Άρα <InlineMath>{'\\text{INDEP} \\in NP'}</InlineMath>.</p>
        <p><strong>ii. Σταθερό <InlineMath>{'k'}</InlineMath> → INDEP <InlineMath>{'\\in P'}</InlineMath>.</strong></p>
        <p><strong>Ο αλγόριθμος (ωμή βία):</strong> εξέτασε όλα τα δυνατά υποσύνολα <InlineMath>{'k'}</InlineMath> κόμβων του γράφου. Για καθένα, έλεγξε αν είναι ανεξάρτητο (κανένα ζεύγος να μη συνδέεται). Αν βρεθεί έστω ένα, απάντησε ΝΑΙ· αλλιώς ΟΧΙ.</p>
        <p><strong>Πολυπλοκότητα.</strong> Τα υποσύνολα μεγέθους <InlineMath>{'k'}</InlineMath> είναι <InlineMath>{'\\binom{n}{k} \\le n^k'}</InlineMath>. Ο έλεγχος καθενός κοστίζει <InlineMath>{'O(k^2)'}</InlineMath>. Συνολικά:</p>
        <BlockMath>{'O\\!\\left(n^k \\cdot k^2\\right)'}</BlockMath>
        <p><strong>Γιατί αυτό είναι πολυωνυμικό;</strong> Εδώ είναι το κλειδί: το <InlineMath>{'k'}</InlineMath> είναι <em>σταθερά</em> — δεν είναι μέρος της εισόδου, δεν μεγαλώνει. Για <InlineMath>{'k = 1000'}</InlineMath> ο χρόνος είναι <InlineMath>{'O(n^{1000})'}</InlineMath>. Μπορεί να φαίνεται τερατώδες, αλλά είναι πολυώνυμο σταθερού βαθμού ως προς το <InlineMath>{'n'}</InlineMath> — άρα εξ ορισμού πολυωνυμικό, άρα <InlineMath>{'\\text{INDEP} \\in P'}</InlineMath>.</p>
        <p>Η αντίθεση με τη γενική περίπτωση: όταν το <InlineMath>{'k'}</InlineMath> είναι μέρος της εισόδου (μπορεί να φτάσει το <InlineMath>{'n/2'}</InlineMath>), το <InlineMath>{'n^k'}</InlineMath> γίνεται εκθετικό — και τότε το INDEP είναι NP-πλήρες. «Σταθερό <InlineMath>{'k'}</InlineMath>» αλλάζει εντελώς την εικόνα.</p>
      </>
    ),
  },
  {
    id: 'pt7-th2',
    title: 'Παλαιό Θέμα #7 · Θέμα 2 — Αναδρομή vs δυναμικός προγραμματισμός',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #7',
    problemNumber: 'Θέμα 2',
    weight: 35,
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Θέλουμε να υπολογιστεί η ακολουθία <InlineMath>{'b_1, b_2, b_3, \\dots, b_n'}</InlineMath> που προκύπτει από τον αναδρομικό τύπο</p>
        <BlockMath>{'b_n = 2 \\max\\{b_{n-1},\\, b_{n-2}\\} + b_{n-3}'}</BlockMath>
        <p>με τους 3 αρχικούς όρους <InlineMath>{'b_1 = b_2 = b_3 = 1'}</InlineMath>. Έστω <InlineMath>{'RB(n)'}</InlineMath> ο αλγόριθμος που στηρίζεται απευθείας στην αναδρομική σχέση. (Δίνεται ότι <InlineMath>{'3^{1/3} = 1{,}44'}</InlineMath>.)</p>
        <p><strong>i.</strong> Γράψτε σε φυσική γλώσσα τον αλγόριθμο <InlineMath>{'RB(n)'}</InlineMath>. <strong>ii.</strong> Δείξτε ότι ο <InlineMath>{'RB(n)'}</InlineMath> είναι εκθετικός, με πολυπλοκότητα <InlineMath>{'\\Omega(1{,}44^{\\,n})'}</InlineMath>. <strong>iii.</strong> Αν χρησιμοποιήσουμε δυναμικό προγραμματισμό (αλγόριθμος <InlineMath>{'DB(n)'}</InlineMath>), πόσα υποπροβλήματα θα οριστούν; <strong>iv.</strong> Δικαιολογήστε ότι η πολυπλοκότητα του <InlineMath>{'DB(n)'}</InlineMath> είναι γραμμική. <strong>v.</strong> Ποιος αλγόριθμος είναι ταχύτερος;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. Ο αναδρομικός <InlineMath>{'RB(n)'}</InlineMath>.</strong> «Αν <InlineMath>{'n \\le 3'}</InlineMath> επίστρεψε <InlineMath>{'1'}</InlineMath>. Αλλιώς, κάλεσε αναδρομικά τον εαυτό σου για να βρεις τα <InlineMath>{'RB(n-1)'}</InlineMath>, <InlineMath>{'RB(n-2)'}</InlineMath>, <InlineMath>{'RB(n-3)'}</InlineMath> και επίστρεψε <InlineMath>{'2 \\max\\{RB(n-1), RB(n-2)\\} + RB(n-3)'}</InlineMath>.»</p>
        <p><strong>ii. Γιατί είναι εκθετικός.</strong> Ο <InlineMath>{'RB(n)'}</InlineMath> δεν θυμάται τίποτα: κάθε κλήση ξανα-υπολογίζει από την αρχή τους ίδιους όρους. Ο αριθμός των κλήσεων <InlineMath>{'T(n)'}</InlineMath> ικανοποιεί:</p>
        <BlockMath>{'T(n) = T(n-1) + T(n-2) + T(n-3) + O(1)'}</BlockMath>
        <p>Για ένα κάτω φράγμα, παρατηρούμε ότι κάθε κλήση παράγει 3 κλήσεις, και η «αβαθέστερη» απ’ αυτές μειώνει το <InlineMath>{'n'}</InlineMath> κατά το πολύ 3. Άρα το δέντρο αναδρομής έχει βάθος τουλάχιστον <InlineMath>{'n/3'}</InlineMath> και διακλάδωση 3:</p>
        <BlockMath>{'T(n) \\ge 3 \\cdot T(n-3) \\;\\Rightarrow\\; T(n) \\ge 3^{\\,n/3} = \\left(3^{1/3}\\right)^{n} = 1{,}44^{\\,n}'}</BlockMath>
        <p>Άρα <InlineMath>{'T(n) = \\Omega(1{,}44^{\\,n})'}</InlineMath> — εκθετικός.</p>
        <p><strong>iii. Υποπροβλήματα του <InlineMath>{'DB(n)'}</InlineMath>.</strong> Τα διαφορετικά υποπροβλήματα είναι ακριβώς οι όροι που θέλουμε: <InlineMath>{'b_1, b_2, \\dots, b_n'}</InlineMath>. Είναι <InlineMath>{'n'}</InlineMath> στο πλήθος, δηλαδή <InlineMath>{'\\Theta(n)'}</InlineMath> υποπροβλήματα.</p>
        <p><strong>iv. Γιατί ο <InlineMath>{'DB(n)'}</InlineMath> είναι γραμμικός.</strong> Ο δυναμικός προγραμματισμός υπολογίζει τους όρους «από κάτω προς τα πάνω» και τους αποθηκεύει σε έναν πίνακα. Αρχικοποιεί <InlineMath>{'b_1 = b_2 = b_3 = 1'}</InlineMath>, και για <InlineMath>{'i = 4, \\dots, n'}</InlineMath> υπολογίζει <InlineMath>{'b_i = 2\\max\\{b_{i-1}, b_{i-2}\\} + b_{i-3}'}</InlineMath> διαβάζοντας τρεις ήδη αποθηκευμένες τιμές — κόστος <InlineMath>{'O(1)'}</InlineMath> ανά όρο. Συνολικά <InlineMath>{'n'}</InlineMath> όροι <InlineMath>{'\\times\\, O(1) = \\Theta(n)'}</InlineMath> — γραμμικός.</p>
        <p><strong>v. Ποιος είναι ταχύτερος.</strong> Ο <InlineMath>{'DB(n)'}</InlineMath> με <InlineMath>{'\\Theta(n)'}</InlineMath> είναι ασύγκριτα ταχύτερος από τον εκθετικό <InlineMath>{'RB(n)'}</InlineMath>. Η μόνη διαφορά τους είναι ότι ο <InlineMath>{'DB'}</InlineMath> <em>θυμάται</em> τα αποτελέσματα αντί να τα ξαναϋπολογίζει — και αυτό μετατρέπει το <InlineMath>{'1{,}44^{\\,n}'}</InlineMath> σε <InlineMath>{'n'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'pt7-th3',
    title: 'Παλαιό Θέμα #7 · Θέμα 3 — 0/1 σακίδιο: άπληστος vs δυναμικός',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #7',
    problemNumber: 'Θέμα 3',
    weight: 35,
    difficulty: 'hard',
    prerequisites: ['lectures/L15-dp-ii'],
    statement: (
      <>
        <p>Θεωρήστε το <strong>0-1 πρόβλημα του σακιδίου</strong>: μεγιστοποίησε <InlineMath>{'\\sum_{i=1}^{n} c_i x_i'}</InlineMath> υπό τον περιορισμό <InlineMath>{'\\sum_{i=1}^{n} a_i x_i \\le b'}</InlineMath>, με <InlineMath>{'x_i \\in \\{0, 1\\}'}</InlineMath>, όπου τα <InlineMath>{'c_i, a_i, b'}</InlineMath> είναι ακέραιοι.</p>
        <p><strong>i.</strong> Περιγράψτε σε φυσική γλώσσα έναν άπληστο αλγόριθμο <InlineMath>{'KNAPSACK(n, c_i, a_i, b)'}</InlineMath> που επιστρέφει μια εφικτή λύση. <strong>ii.</strong> Υπολογίστε την πολυπλοκότητά του. <strong>iii.</strong> Για το στιγμιότυπο <InlineMath>{'c = (16, 9, 7, 15, 10, 1)'}</InlineMath>, <InlineMath>{'a = (8, 5, 4, 9, 6, 1)'}</InlineMath>, <InlineMath>{'b = 12'}</InlineMath>, εφαρμόστε τον αλγόριθμο. <strong>iv.</strong> Μπορεί ο αλγόριθμος να επιστρέφει πάντα τη βέλτιστη λύση και να είναι πολυωνυμικός; <strong>v.</strong> Με δυναμικό προγραμματισμό, πόσα υποπροβλήματα χρειάζονται; Δώστε την αναδρομική σχέση.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. Ο άπληστος αλγόριθμος.</strong> Για κάθε αντικείμενο υπολόγισε τον <em>λόγο αξίας ανά βάρος</em> <InlineMath>{'r_i = c_i / a_i'}</InlineMath>. Ταξινόμησε τα αντικείμενα κατά φθίνον <InlineMath>{'r_i'}</InlineMath>. Σάρωσέ τα με αυτή τη σειρά και βάλε στο σακίδιο κάθε αντικείμενο που χωράει ακόμη (το βάρος που μένει το επιτρέπει).</p>
        <p><strong>ii. Πολυπλοκότητα.</strong> Ο υπολογισμός των λόγων είναι <InlineMath>{'O(n)'}</InlineMath>, η ταξινόμηση <InlineMath>{'O(n \\log n)'}</InlineMath>, η σάρωση <InlineMath>{'O(n)'}</InlineMath>. Σύνολο <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
        <p><strong>iii. Εφαρμογή.</strong> Οι λόγοι: αντικ. 1: <InlineMath>{'16/8 = 2'}</InlineMath>· αντικ. 2: <InlineMath>{'9/5 = 1{,}8'}</InlineMath>· αντικ. 3: <InlineMath>{'7/4 = 1{,}75'}</InlineMath>· αντικ. 4: <InlineMath>{'15/9 \\approx 1{,}67'}</InlineMath>· αντικ. 5: <InlineMath>{'10/6 \\approx 1{,}67'}</InlineMath>· αντικ. 6: <InlineMath>{'1/1 = 1'}</InlineMath>. Φθίνουσα σειρά: <InlineMath>{'1, 2, 3, 4, 5, 6'}</InlineMath>. Με <InlineMath>{'b = 12'}</InlineMath>:</p>
        <ul>
          <li>Αντικ. 1 (<InlineMath>{'a = 8'}</InlineMath>): χωράει → μπαίνει. Μένει χώρος <InlineMath>{'12 - 8 = 4'}</InlineMath>, αξία <InlineMath>{'16'}</InlineMath>.</li>
          <li>Αντικ. 2 (<InlineMath>{'a = 5 > 4'}</InlineMath>): δεν χωράει → προσπερνιέται.</li>
          <li>Αντικ. 3 (<InlineMath>{'a = 4 \\le 4'}</InlineMath>): χωράει → μπαίνει. Μένει χώρος <InlineMath>{'0'}</InlineMath>, αξία <InlineMath>{'16 + 7 = 23'}</InlineMath>.</li>
          <li>Αντικ. 4, 5, 6: δεν χωράει τίποτα πια.</li>
        </ul>
        <p>Ο άπληστος επιστρέφει τα αντικείμενα <InlineMath>{'\\{1, 3\\}'}</InlineMath>, με βάρος <InlineMath>{'12'}</InlineMath> και συνολική αξία <strong><InlineMath>{'23'}</InlineMath></strong> (που τυχαίνει εδώ να είναι και η βέλτιστη — έλεγξε π.χ. ότι <InlineMath>{'\\{2,5,6\\}'}</InlineMath> δίνει μόλις <InlineMath>{'20'}</InlineMath>).</p>
        <p><strong>iv. Όχι.</strong> Δεν μπορεί ένας πολυωνυμικός αλγόριθμος να δίνει <em>πάντα</em> τη βέλτιστη λύση: το 0-1 σακίδιο είναι <strong>NP-δύσκολο</strong>, και πολυωνυμικός βέλτιστος αλγόριθμος θα σήμαινε <InlineMath>{'P = NP'}</InlineMath>. Ο άπληστος «λόγος αξίας/βάρους» είναι βέλτιστος για το <em>κλασματικό</em> σακίδιο (όπου μπορείς να κόψεις αντικείμενα), αλλά όχι για το 0-1: εκεί ένα αντικείμενο με τέλειο λόγο μπορεί να «κλέψει» χώρο που θα αξιοποιούνταν καλύτερα από συνδυασμό άλλων.</p>
        <p><strong>v. Δυναμικός προγραμματισμός.</strong> Ορίζουμε <InlineMath>{'K(i, w)'}</InlineMath> = η μέγιστη αξία χρησιμοποιώντας μόνο τα πρώτα <InlineMath>{'i'}</InlineMath> αντικείμενα με διαθέσιμη χωρητικότητα <InlineMath>{'w'}</InlineMath>. Οι δείκτες κινούνται <InlineMath>{'i \\in \\{0, \\dots, n\\}'}</InlineMath> και <InlineMath>{'w \\in \\{0, \\dots, b\\}'}</InlineMath>, άρα τα υποπροβλήματα είναι <InlineMath>{'(n+1)(b+1) = O(n \\cdot b)'}</InlineMath>. Αναδρομική σχέση:</p>
        <BlockMath>{'K(i, w) = \\begin{cases} K(i-1, w), & a_i > w \\\\[4pt] \\max\\bigl(K(i-1, w),\\; c_i + K(i-1, w - a_i)\\bigr), & a_i \\le w \\end{cases}'}</BlockMath>
        <p>με <InlineMath>{'K(0, w) = 0'}</InlineMath>. Είτε αφήνουμε το αντικείμενο <InlineMath>{'i'}</InlineMath> έξω, είτε (αν χωράει) το βάζουμε και κερδίζουμε <InlineMath>{'c_i'}</InlineMath>. Σημείωση: το <InlineMath>{'O(n \\cdot b)'}</InlineMath> είναι <em>ψευδο-πολυωνυμικό</em> — εξαρτάται από την τιμή <InlineMath>{'b'}</InlineMath>, όχι από το πλήθος των bits της.</p>
      </>
    ),
  },
  {
    id: 'pt7-th4',
    title: 'Παλαιό Θέμα #7 · Θέμα 4 — Προβλήματα απόφασης MST & TSP',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #7',
    problemNumber: 'Θέμα 4',
    weight: 20,
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Θεωρήστε τα προβλήματα: ελαχιστοποίηση κόστους ενός δέντρου επικάλυψης (mst) σε ένα γράφο, και ελαχιστοποίηση του κόστους ενός Χαμιλτονιανού κύκλου (TSP) σε έναν πλήρη γράφο.</p>
        <p><strong>i.</strong> Να δοθούν τα αντίστοιχα προβλήματα απόφασης <InlineMath>{'D(ST)'}</InlineMath> και <InlineMath>{'D(TSP)'}</InlineMath>.</p>
        <p><strong>ii.</strong> Με την υπόθεση ότι <InlineMath>{'P \\ne NP'}</InlineMath>: το <InlineMath>{'D(ST)'}</InlineMath> ανήκει στην <InlineMath>{'P'}</InlineMath>; στην <InlineMath>{'NP'}</InlineMath>; είναι <InlineMath>{'NP'}</InlineMath>-complete; Και αντίστοιχα για το <InlineMath>{'D(TSP)'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>i. Τα προβλήματα απόφασης.</strong> Κάθε πρόβλημα βελτιστοποίησης γίνεται πρόβλημα απόφασης με ένα κατώφλι <InlineMath>{'k'}</InlineMath>:</p>
        <ul>
          <li><InlineMath>{'D(ST)'}</InlineMath>: «Δοθέντος γράφου <InlineMath>{'G'}</InlineMath> με βάρη και ακεραίου <InlineMath>{'k'}</InlineMath>, υπάρχει δέντρο επικάλυψης του <InlineMath>{'G'}</InlineMath> με συνολικό βάρος <InlineMath>{'\\le k'}</InlineMath>;»</li>
          <li><InlineMath>{'D(TSP)'}</InlineMath>: «Δοθέντος πλήρους γράφου <InlineMath>{'G'}</InlineMath> με βάρη και ακεραίου <InlineMath>{'k'}</InlineMath>, υπάρχει Χαμιλτονιανός κύκλος (κύκλος που περνά από κάθε κόμβο ακριβώς μία φορά) με συνολικό βάρος <InlineMath>{'\\le k'}</InlineMath>;»</li>
        </ul>
        <p><strong>ii. Κατάταξη (με <InlineMath>{'P \\ne NP'}</InlineMath>).</strong></p>
        <p><strong><InlineMath>{'D(ST)'}</InlineMath>:</strong> ανήκει στην <InlineMath>{'P'}</InlineMath> — το MST βρίσκεται σε πολυωνυμικό χρόνο με Kruskal/Prim, και απλώς συγκρίνουμε το ελάχιστο βάρος με το <InlineMath>{'k'}</InlineMath>. Αφού <InlineMath>{'P \\subseteq NP'}</InlineMath>, ανήκει και στην <InlineMath>{'NP'}</InlineMath>. <em>Δεν</em> είναι <InlineMath>{'NP'}</InlineMath>-complete: αν ένα πρόβλημα της <InlineMath>{'P'}</InlineMath> ήταν <InlineMath>{'NP'}</InlineMath>-complete, τότε <em>κάθε</em> πρόβλημα του <InlineMath>{'NP'}</InlineMath> θα λυνόταν πολυωνυμικά και θα είχαμε <InlineMath>{'P = NP'}</InlineMath> — αντίφαση με την υπόθεση.</p>
        <p><strong><InlineMath>{'D(TSP)'}</InlineMath>:</strong> ανήκει στην <InlineMath>{'NP'}</InlineMath> — πιστοποιητικό είναι ο ίδιος ο κύκλος· επαληθεύουμε σε πολυωνυμικό χρόνο ότι περνά από κάθε κόμβο ακριβώς μία φορά και ότι το βάρος του είναι <InlineMath>{'\\le k'}</InlineMath>. Είναι <strong><InlineMath>{'NP'}</InlineMath>-complete</strong> (κλασικό αποτέλεσμα — το TSP απόφασης είναι από τα «δυσκολότερα» του <InlineMath>{'NP'}</InlineMath>). Άρα, με <InlineMath>{'P \\ne NP'}</InlineMath>, <em>δεν</em> ανήκει στην <InlineMath>{'P'}</InlineMath>.</p>
        <p><strong>Το ηθικό δίδαγμα.</strong> Δύο προβλήματα που μοιάζουν επιφανειακά («βρες φθηνό υπογράφημα που τα συνδέει όλα») έχουν δραματικά διαφορετική δυσκολία: το «δέντρο» λύνεται εύκολα, ο «κύκλος» είναι από τα δυσκολότερα που ξέρουμε.</p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #6 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-6-ask1',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 1 — Σχεδιασμός ποδηλατικής εκδρομής',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 1',
    difficulty: 'hard',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>Είναι διαθέσιμος χάρτης με <InlineMath>{'n'}</InlineMath> πόλεις που συνδέονται με ποδηλατικές διαδρομές. Μία διαδρομή που συνδέει δύο πόλεις <InlineMath>{'u, v'}</InlineMath> έχει απόσταση <InlineMath>{'d(v, u)'}</InlineMath>. Επιπλέον, το κόστος διανυκτέρευσης στην πόλη <InlineMath>{'v'}</InlineMath> είναι <InlineMath>{'c(v)'}</InlineMath>.</p>
        <p>Καλείστε να σχεδιάσετε μία εκδρομή που διαρκεί ακριβώς <InlineMath>{'m'}</InlineMath> ημέρες, ξεκινώντας από την πόλη <InlineMath>{'s'}</InlineMath> και έχοντας ως προορισμό την πόλη <InlineMath>{'t'}</InlineMath>, χωρίς διαμονή στην ίδια πόλη περισσότερες από μία συνεχόμενες ημέρες, και με μέγιστη διανυόμενη απόσταση την ημέρα <InlineMath>{'k'}</InlineMath> ίση με <InlineMath>{'u(k)'}</InlineMath>. Επιπλέον, θέλουμε να ελαχιστοποιηθεί το συνολικό κόστος διαμονής.</p>
        <p>Προσδιορίστε έναν αλγόριθμο με πολυπλοκότητα <InlineMath>{'O(n^2(n + m))'}</InlineMath> για τον σχεδιασμό εκδρομής σε <InlineMath>{'m'}</InlineMath> πόλεις <InlineMath>{'(s = v_0, v_1, \\dots, t = v_m)'}</InlineMath> με ελάχιστο κόστος <InlineMath>{'\\sum c(v_i)'}</InlineMath>, έτσι ώστε <InlineMath>{'d(v_{i-1}, v_i) \\le u(i)'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η ιδέα: φτιάχνουμε έναν νέο, «στρωματωμένο» γράφο όπου το συντομότερο μονοπάτι δίνει την απάντηση.</strong></p>
        <p><strong>Βήμα 1 — αποστάσεις πόλεων.</strong> Πρώτα υπολογίζουμε όλες τις αποστάσεις <InlineMath>{'d(i, j)'}</InlineMath> μεταξύ ζευγών πόλεων: τρέχουμε τον αλγόριθμο του Dijkstra μία φορά από κάθε πόλη. Κόστος: <InlineMath>{'n'}</InlineMath> εκτελέσεις, η καθεμία <InlineMath>{'O(n^2)'}</InlineMath> → συνολικά <InlineMath>{'O(n^3)'}</InlineMath>.</p>
        <p><strong>Βήμα 2 — στρωματωμένος (ακυκλικός) γράφος.</strong> Επειδή απαγορεύεται να μείνεις δύο συνεχόμενες ημέρες στην ίδια πόλη, δημιουργούμε έναν κόμβο <InlineMath>{'v_{i,p}'}</InlineMath> για κάθε πόλη <InlineMath>{'i'}</InlineMath> και κάθε ημέρα <InlineMath>{'p \\in \\{0, 1, \\dots, m\\}'}</InlineMath> — δηλαδή <InlineMath>{'n(m+1)'}</InlineMath> κόμβους. Βάζουμε ακμή από τον <InlineMath>{'v_{i,p-1}'}</InlineMath> στον <InlineMath>{'v_{j,p}'}</InlineMath> μόνο όταν <InlineMath>{'i \\ne j'}</InlineMath> (αλλάζεις πόλη) και <InlineMath>{'d(i, j) \\le u(p)'}</InlineMath> (η μετακίνηση χωράει στο όριο της ημέρας). Σε αυτήν την ακμή δίνουμε βάρος <InlineMath>{'c(j)'}</InlineMath> — το κόστος της νέας διανυκτέρευσης. Οι ακμές είναι <InlineMath>{'O(n^2 m)'}</InlineMath>.</p>
        <p><strong>Βήμα 3 — συντομότερο μονοπάτι.</strong> Ο γράφος είναι ακυκλικός (κάθε ακμή προχωρά κατά μία ημέρα), άρα βρίσκουμε το ελάχιστου κόστους μονοπάτι από τον <InlineMath>{'v_{s,0}'}</InlineMath> στον <InlineMath>{'v_{t,m}'}</InlineMath> με μία απλή σάρωση κατά τοπολογική σειρά (ανά ημέρα), σε χρόνο ανάλογο των ακμών, <InlineMath>{'O(n^2 m)'}</InlineMath>. Αν δεν υπάρχει τέτοιο μονοπάτι, η εκδρομή είναι αδύνατη.</p>
        <p><strong>Συνολική πολυπλοκότητα.</strong> <InlineMath>{'O(n^3) + O(n^2 m) = O(n^2(n + m))'}</InlineMath> — όπως ζητείται. Το «κόλπο» είναι ότι ο περιορισμός «ακριβώς <InlineMath>{'m'}</InlineMath> ημέρες» γίνεται απλώς «διαδρομή <InlineMath>{'m'}</InlineMath> ακμών» αφού στρωματώσουμε τον γράφο κατά ημέρα.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask2',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 2 — 2η/3η ελαφρύτερη ακμή στο MST',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Έστω <InlineMath>{'G = (V, E)'}</InlineMath> ένας απλός συνεκτικός γράφος, του οποίου κάθε ακμή έχει διαφορετικό βάρος. Αποδείξτε αν τα ακόλουθα είναι σωστά ή λαθεμένα:</p>
        <p><strong>Α.</strong> Η ακμή με το <em>δεύτερο</em> μικρότερο βάρος ανήκει στο ελάχιστο δέντρο επικάλυψης (MST) του <InlineMath>{'G'}</InlineMath>.</p>
        <p><strong>Β.</strong> Η ακμή με το <em>τρίτο</em> μικρότερο βάρος ανήκει στο ελάχιστο δέντρο επικάλυψης (MST) του <InlineMath>{'G'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Α. ΣΩΣΤΟ.</strong> Σκέψου τι κάνει ο αλγόριθμος Kruskal: εξετάζει τις ακμές κατά αύξον βάρος και κρατά μια ακμή εκτός αν αυτή σχηματίζει κύκλο με όσες έχει ήδη κρατήσει. Η <strong>1η</strong> (ελαφρύτερη) ακμή μπαίνει πάντα — δεν υπάρχει τίποτα να κάνει κύκλο. Φτάνοντας στη <strong>2η</strong> ακμή, έχει κρατηθεί μόνο μία ακμή. Σε έναν απλό γράφο, ένας κύκλος χρειάζεται τουλάχιστον 3 ακμές — άρα με μία μόνο τοποθετημένη ακμή είναι αδύνατο να σχηματιστεί κύκλος. Άρα η 2η ακμή μπαίνει πάντα στο MST.</p>
        <p><strong>Β. ΛΑΘΟΣ.</strong> Όταν φτάνουμε στην 3η ακμή έχουν ήδη μπει δύο ακμές — και τώρα <em>μπορεί</em> να σχηματιστεί κύκλος.</p>
        <p><strong>Αντιπαράδειγμα.</strong> Τρίγωνο με κορυφές <InlineMath>{'v_1, v_2, v_3'}</InlineMath> και ακμές βάρους <InlineMath>{'1, 2, 3'}</InlineMath>: <InlineMath>{'(v_1, v_2) = 1'}</InlineMath>, <InlineMath>{'(v_2, v_3) = 2'}</InlineMath>, <InlineMath>{'(v_1, v_3) = 3'}</InlineMath>. Ο Kruskal παίρνει τις ακμές βάρους <InlineMath>{'1'}</InlineMath> και <InlineMath>{'2'}</InlineMath> — έχει ήδη συνδέσει και τις 3 κορυφές. Η 3η ακμή (βάρους <InlineMath>{'3'}</InlineMath>) θα έκλεινε κύκλο, οπότε <em>απορρίπτεται</em>. Άρα η ακμή με το τρίτο μικρότερο βάρος δεν ανήκει στο MST — η πρόταση είναι λαθεμένη.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask3',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 3 — Μέγιστη εναλλασσόμενη υπακολουθία σε O(n)',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Δίνεται ένας πίνακας <InlineMath>{'A'}</InlineMath> με <InlineMath>{'n'}</InlineMath> αριθμούς και ζητείται να βρεθεί, σε χρόνο <InlineMath>{'O(n)'}</InlineMath>, η υπακολουθία μέγιστου μήκους με την ιδιότητα:</p>
        <BlockMath>{'A[i_1] > A[i_2],\\;\\; A[i_2] < A[i_3],\\;\\; A[i_3] > A[i_4],\\;\\; A[i_4] < A[i_5],\\;\\; \\dots'}</BlockMath>
        <p>(εναλλάξ «πάνω-κάτω»). Η υπακολουθία δε χρειάζεται να βρίσκεται σε συνεχόμενες θέσεις.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Διαίσθηση: «κορυφές και κοιλάδες».</strong> Φαντάσου τον πίνακα σαν τοπίο. Μια εναλλασσόμενη υπακολουθία ανεβοκατεβαίνει· τα στοιχεία που μας συμφέρουν είναι ακριβώς οι <em>κορυφές</em> (τοπικά μέγιστα) και οι <em>κοιλάδες</em> (τοπικά ελάχιστα).</p>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Διάσπασε τον πίνακα σε μέγιστες <em>μονότονες</em> διαδρομές — εναλλάξ αύξουσες και φθίνουσες. Από κάθε διαδρομή κράτα μόνο το <strong>τελευταίο</strong> στοιχείο της (το σημείο όπου η μονοτονία αλλάζει φορά). Αυτά τα «σημεία καμπής» είναι η ζητούμενη υπακολουθία.</p>
        <p><strong>Παράδειγμα.</strong> <InlineMath>{'A = [4, 10, 12, 9, 3, 1, 0, 6, 5, 4, 3, 8, 10, 15]'}</InlineMath>. Οι μονότονες διαδρομές: αύξουσα <InlineMath>{'(4, 10, 12)'}</InlineMath>, φθίνουσα <InlineMath>{'(12, 9, 3, 1, 0)'}</InlineMath>, αύξουσα <InlineMath>{'(0, 6)'}</InlineMath>, φθίνουσα <InlineMath>{'(6, 5, 4, 3)'}</InlineMath>, αύξουσα <InlineMath>{'(3, 8, 10, 15)'}</InlineMath>. Παίρνοντας το τελευταίο στοιχείο καθεμιάς: <InlineMath>{'12,\\, 0,\\, 6,\\, 3,\\, 15'}</InlineMath>. Έλεγχος: <InlineMath>{'12 > 0 < 6 > 3 < 15'}</InlineMath> ✓ — εναλλασσόμενη, μήκους 5.</p>
        <p><strong>Γιατί είναι βέλτιστη.</strong> Από κάθε μονότονη διαδρομή μπορεί να συμμετέχει στη λύση το πολύ ένα στοιχείο πάνω και ένα κάτω· αν επέλεγες 3 στοιχεία από την ίδια μονότονη διαδρομή, δύο απ’ αυτά θα ήταν στη «λάθος» φορά. Παίρνοντας το άκρο κάθε διαδρομής εξασφαλίζεις τη μεγαλύτερη δυνατή εναλλαγή.</p>
        <p><strong>Πολυπλοκότητα.</strong> Μία μόνο σάρωση του πίνακα — σε κάθε θέση ελέγχεις απλώς αν άλλαξε η φορά. Άρα <InlineMath>{'O(n)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask4',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 4 — Χρονοπρογραμματισμός πλυντηρίου (καθαριστήριο)',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L12-greedy-ii'],
    statement: (
      <>
        <p>Ο Γιώργος δουλεύει σε ένα καθαριστήριο ρούχων. Κάθε πρωί πρέπει να ελέγξει τα ρούχα για λεκέδες (για να τα επεξεργαστεί κατάλληλα) και στη συνέχεια να τα τοποθετήσει στο πλυντήριο και στο στεγνωτήριο. Ο Γιώργος μπορεί να επεξεργάζεται <em>ένα ρούχο κάθε φορά</em> για τον έλεγχο των λεκέδων, και κάθε ρούχο απαιτεί διαφορετικό χρόνο ελέγχου. Ωστόσο, τα ρούχα μπορούν να πλένονται και να στεγνώνουν <em>ταυτόχρονα</em>. Ο Γιώργος θέλει να τελειώσει όλη τη δουλειά όσο το δυνατόν γρηγορότερα, οπότε ψάχνει την καλύτερη σειρά ελέγχου των ρούχων.</p>
        <p>Ζητείται αποδοτικός αλγόριθμος που δίνει χρονοδιάγραμμα με τον μικρότερο δυνατό χρόνο ολοκλήρωσης.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Το μοντέλο.</strong> Για κάθε ρούχο <InlineMath>{'i'}</InlineMath>: <InlineMath>{'s_i'}</InlineMath> = χρόνος ελέγχου (γίνεται <em>σειριακά</em> — ένα μηχάνημα, ο Γιώργος)· <InlineMath>{'r_i + b_i'}</InlineMath> = χρόνος πλύσης + στεγνώματος (γίνεται <em>παράλληλα</em> — πολλά πλυντήρια). Μετά τον έλεγχο ενός ρούχου, ξεκινά αμέσως η πλύση/στέγνωμά του, ενώ ο Γιώργος προχωρά στον έλεγχο του επόμενου. Ο συνολικός χρόνος (makespan) τελειώνει όταν ολοκληρωθεί και η τελευταία πλύση/στέγνωμα.</p>
        <p><strong>Ο άπληστος κανόνας.</strong> Ταξινόμησε τα ρούχα κατά <em>φθίνον</em> <InlineMath>{'r_i + b_i'}</InlineMath> και έλεγξέ τα με αυτή τη σειρά.</p>
        <p><strong>Διαίσθηση.</strong> Ο έλεγχος είναι η «στενωπός»: γίνεται ένα-ένα. Η πλύση/στέγνωμα τρέχει στο παρασκήνιο. Θέλουμε λοιπόν να ξεκινήσει <em>όσο πιο νωρίς γίνεται</em> η πλύση που διαρκεί περισσότερο — γιατί αυτή είναι που κινδυνεύει να «κρέμεται» στο τέλος. Άρα: το ρούχο με τη μεγαλύτερη ουρά παράλληλης εργασίας πρώτο.</p>
        <p><strong>Απόδειξη ορθότητας (επιχείρημα ανταλλαγής).</strong> Έστω βέλτιστο χρονοδιάγραμμα που <em>δεν</em> ακολουθεί αυτή τη σειρά. Τότε υπάρχουν δύο διαδοχικά ρούχα <InlineMath>{'i, j'}</InlineMath> με το <InlineMath>{'i'}</InlineMath> πριν το <InlineMath>{'j'}</InlineMath> αλλά <InlineMath>{'r_i + b_i < r_j + b_j'}</InlineMath>. Αν τα <em>ανταλλάξουμε</em>, ο χρόνος ελέγχου τους (<InlineMath>{'s_i + s_j'}</InlineMath> συνολικά) δεν αλλάζει· το <InlineMath>{'j'}</InlineMath> τελειώνει τώρα νωρίτερα, και ο χρόνος λήξης του ζεύγους καθορίζεται από το <InlineMath>{'\\max'}</InlineMath> των δύο παράλληλων ουρών. Επειδή και τα δύο ξεκινούν τώρα νωρίτερα (ή το ίδιο), ο νέος χρόνος λήξης δεν είναι μεγαλύτερος. Συνεχίζοντας τέτοιες ανταλλαγές μετατρέπουμε το βέλτιστο στη φθίνουσα σειρά χωρίς ποτέ να χειροτερέψουμε — άρα η άπληστη σειρά είναι κι αυτή βέλτιστη.</p>
        <p><strong>Πολυπλοκότητα.</strong> Κυριαρχεί η ταξινόμηση των <InlineMath>{'n'}</InlineMath> ρούχων κατά <InlineMath>{'r_i + b_i'}</InlineMath>: <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask5',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 5 — Ρέστα με τον ελάχιστο αριθμό νομισμάτων',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Θέλουμε να δώσουμε ρέστα <InlineMath>{'n'}</InlineMath> cents χρησιμοποιώντας τον ελάχιστο αριθμό νομισμάτων, από νομίσματα αξίας <InlineMath>{'1, 5, 10, 25'}</InlineMath> cents. Υπάρχει άπληστος αλγόριθμος που οδηγεί σε βέλτιστη λύση;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Σε κάθε βήμα δώσε το νόμισμα με τη <em>μεγαλύτερη</em> αξία που δεν ξεπερνά το ποσό που απομένει. Επανάλαβε ώσπου το ποσό να μηδενιστεί.</p>
        <p><strong>Για το σύστημα <InlineMath>{'\\{1, 5, 10, 25\\}'}</InlineMath> ο άπληστος ΕΙΝΑΙ βέλτιστος.</strong> Απόδειξη: σε <em>κάθε</em> βέλτιστη λύση πρέπει να υπάρχουν το πολύ 4 νομίσματα του <InlineMath>{'1'}</InlineMath> (αλλιώς 5 απ’ αυτά αντικαθίστανται από ένα του <InlineMath>{'5'}</InlineMath>), το πολύ 1 νόμισμα του <InlineMath>{'5'}</InlineMath> (2 → ένα του <InlineMath>{'10'}</InlineMath>), και το πολύ 2 νομίσματα του <InlineMath>{'10'}</InlineMath> (3 → ένα του <InlineMath>{'25'}</InlineMath> και ένα του <InlineMath>{'5'}</InlineMath>).</p>
        <p>Έστω ότι η άπληστη λύση <InlineMath>{'G'}</InlineMath> διαφέρει από κάποια βέλτιστη <InlineMath>{'O'}</InlineMath>, και η πρώτη διαφορά (με τα νομίσματα ταξινομημένα φθίνοντα) είναι στη θέση <InlineMath>{'i'}</InlineMath>. Τότε <InlineMath>{'g_i > o_i'}</InlineMath>, αφού ο άπληστος επιλέγει πάντα το μεγαλύτερο δυνατό νόμισμα. Εξετάζουμε τι νόμισμα έβαλε ο άπληστος:</p>
        <ul>
          <li><InlineMath>{'g_i = 25'}</InlineMath>: τα υπόλοιπα νομίσματα της <InlineMath>{'O'}</InlineMath> πρέπει να αθροίζουν <InlineMath>{'\\ge 25'}</InlineMath> μόνο με μικρότερα — αλλά το μέγιστο δυνατό με <InlineMath>{'\\le 2'}</InlineMath> δεκάρικα, <InlineMath>{'\\le 1'}</InlineMath> πεντάρικο, <InlineMath>{'\\le 4'}</InlineMath> μονά είναι αρκετό για <InlineMath>{'25'}</InlineMath> μόνο ως <InlineMath>{'10+10+5'}</InlineMath> — που όμως αντικαθίσταται από ένα <InlineMath>{'25'}</InlineMath>, άρα η <InlineMath>{'O'}</InlineMath> δεν θα ήταν βέλτιστη. Άτοπο.</li>
          <li><InlineMath>{'g_i = 10'}</InlineMath>: τα υπόλοιπα της <InlineMath>{'O'}</InlineMath> μπορούν να φτάσουν το πολύ <InlineMath>{'5 + 4 \\cdot 1 = 9 < 10'}</InlineMath>. Άτοπο.</li>
          <li><InlineMath>{'g_i = 5'}</InlineMath>: τα υπόλοιπα της <InlineMath>{'O'}</InlineMath> φτάνουν το πολύ <InlineMath>{'4 \\cdot 1 = 4 < 5'}</InlineMath>. Άτοπο.</li>
        </ul>
        <p>Σε κάθε περίπτωση αντίφαση — άρα οι δύο λύσεις δεν διαφέρουν: ο άπληστος είναι βέλτιστος.</p>
        <p><strong>Προσοχή — δεν ισχύει για κάθε σύστημα νομισμάτων.</strong> Με νομίσματα <InlineMath>{'\\{1, 10, 15\\}'}</InlineMath> και ρέστα <InlineMath>{'20'}</InlineMath>, ο άπληστος δίνει <InlineMath>{'15 + 1 + 1 + 1 + 1 + 1'}</InlineMath> (6 νομίσματα), ενώ η βέλτιστη είναι <InlineMath>{'10 + 10'}</InlineMath> (2 νομίσματα). Η ορθότητα του άπληστου εξαρτάται από το ίδιο το σύστημα.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask6',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 6 — Ελάχιστες στάσεις για ανεφοδιασμό',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 6',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Ο καθηγητής Μίδας οδηγεί με αυτοκίνητο από μια αφετηρία προς έναν προορισμό. Η δεξαμενή καυσίμων του αυτοκινήτου, όταν είναι γεμάτη, έχει αρκετά καύσιμα ώστε να οδηγεί για <InlineMath>{'n'}</InlineMath> χιλιόμετρα, και ο χάρτης του δείχνει τις αποστάσεις μεταξύ των σταθμών καυσίμων στον δρόμο του. Ο καθηγητής θέλει να κάνει όσες λιγότερες στάσεις γίνεται. Δώστε έναν αποδοτικό (άπληστο) αλγόριθμο με τον οποίο ο καθηγητής Μίδας θα προσδιορίζει σε ποιούς σταθμούς πρέπει να κάνει στάση, και αποδείξτε ότι ο αλγόριθμός σας δίνει βέλτιστη λύση.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Ξεκινώντας με γεμάτη δεξαμενή, οδήγησε μέχρι τον <em>πιο μακρινό</em> σταθμό που βρίσκεται μέσα στα επόμενα <InlineMath>{'n'}</InlineMath> χιλιόμετρα. Κάνε στάση εκεί, γέμισε, και επανάλαβε. Με άλλα λόγια: σε κάθε σταθμό, μη σταματήσεις αν μπορείς να φτάσεις τον επόμενο· σταμάτα μόνο όταν αλλιώς θα μείνεις από καύσιμα.</p>
        <p><strong>Πολυπλοκότητα.</strong> Μία σάρωση των <InlineMath>{'m'}</InlineMath> σταθμών → <InlineMath>{'O(m)'}</InlineMath>.</p>
        <p><strong>Απόδειξη ορθότητας («ο άπληστος μένει μπροστά»).</strong> Έστω <InlineMath>{'g_1 < g_2 < \\dots'}</InlineMath> οι σταθμοί όπου σταματά ο άπληστος, και <InlineMath>{'o_1 < o_2 < \\dots'}</InlineMath> οι σταθμοί κάποιας βέλτιστης λύσης. Με επαγωγή δείχνουμε ότι <InlineMath>{'g_k \\ge o_k'}</InlineMath> για κάθε <InlineMath>{'k'}</InlineMath> — η <InlineMath>{'k'}</InlineMath>-οστή στάση του άπληστου είναι τουλάχιστον τόσο μακριά όσο η <InlineMath>{'k'}</InlineMath>-οστή στάση οποιασδήποτε άλλης λύσης.</p>
        <p><em>Βάση:</em> ο άπληστος επιλέγει για <InlineMath>{'g_1'}</InlineMath> τον πιο μακρινό προσβάσιμο σταθμό, άρα <InlineMath>{'g_1 \\ge o_1'}</InlineMath>. <em>Βήμα:</em> αν <InlineMath>{'g_{k} \\ge o_{k}'}</InlineMath>, τότε από το <InlineMath>{'g_k'}</InlineMath> ο άπληστος φτάνει τουλάχιστον όσο μακριά φτάνει η βέλτιστη από το <InlineMath>{'o_k'}</InlineMath> — και διαλέγει τον πιο μακρινό προσβάσιμο, άρα <InlineMath>{'g_{k+1} \\ge o_{k+1}'}</InlineMath>. Αφού ο άπληστος «μένει πάντα μπροστά», φτάνει στον προορισμό με όχι περισσότερες στάσεις από τη βέλτιστη — άρα είναι βέλτιστος.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask7',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 7 — Κωδικοποίηση Huffman',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p>Δίνονται οι χαρακτήρες με τις συχνότητές τους: <InlineMath>{'A(0{,}31)'}</InlineMath>, <InlineMath>{'N(0{,}24)'}</InlineMath>, <InlineMath>{'T(0{,}20)'}</InlineMath>, <InlineMath>{'K(0{,}15)'}</InlineMath>, <InlineMath>{'\\Sigma(0{,}10)'}</InlineMath>.</p>
        <p><strong>α)</strong> Δείξτε τα διαδοχικά βήματα κατασκευής του δένδρου Huffman. <strong>β)</strong> Δώστε τον πίνακα κωδικοποίησης των χαρακτήρων. <strong>γ)</strong> Κωδικοποιήστε το «κείμενο» ΚΑΣΤΑΝΑΣ. <strong>δ)</strong> Αποκωδικοποιήστε το «μήνυμα» <InlineMath>{'0100100101101'}</InlineMath> (αγνοώντας τυχόν υπόλοιπο).</p>
      </>
    ),
    solution: (
      <>
        <p><strong>α) Κατασκευή του δένδρου.</strong> Ο Huffman είναι άπληστος: σε κάθε βήμα <em>συγχωνεύει τους δύο κόμβους με τη μικρότερη συχνότητα</em> σε έναν νέο, με συχνότητα το άθροισμά τους.</p>
        <ul>
          <li>Αρχικά: <InlineMath>{'\\Sigma\\,0{,}10'}</InlineMath>, <InlineMath>{'K\\,0{,}15'}</InlineMath>, <InlineMath>{'T\\,0{,}20'}</InlineMath>, <InlineMath>{'N\\,0{,}24'}</InlineMath>, <InlineMath>{'A\\,0{,}31'}</InlineMath>.</li>
          <li>Συγχώνευση <InlineMath>{'\\Sigma + K = 0{,}25'}</InlineMath>. Μένουν: <InlineMath>{'T\\,0{,}20'}</InlineMath>, <InlineMath>{'N\\,0{,}24'}</InlineMath>, <InlineMath>{'0{,}25'}</InlineMath>, <InlineMath>{'A\\,0{,}31'}</InlineMath>.</li>
          <li>Συγχώνευση <InlineMath>{'T + N = 0{,}44'}</InlineMath>. Μένουν: <InlineMath>{'0{,}25'}</InlineMath>, <InlineMath>{'A\\,0{,}31'}</InlineMath>, <InlineMath>{'0{,}44'}</InlineMath>.</li>
          <li>Συγχώνευση <InlineMath>{'0{,}25 + A = 0{,}56'}</InlineMath>. Μένουν: <InlineMath>{'0{,}44'}</InlineMath>, <InlineMath>{'0{,}56'}</InlineMath>.</li>
          <li>Συγχώνευση <InlineMath>{'0{,}44 + 0{,}56 = 1{,}00'}</InlineMath> — η ρίζα.</li>
        </ul>
        <p><strong>β) Πίνακας κωδικοποίησης.</strong> Δίνουμε <InlineMath>{'0'}</InlineMath> στο αριστερό και <InlineMath>{'1'}</InlineMath> στο δεξί παιδί, και διαβάζουμε το μονοπάτι ρίζα → φύλλο:</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`A = 11      N = 01      T = 00
K = 101     Σ = 100`}</pre>
        <p>Παρατήρησε ότι καμία κωδικοποίηση δεν είναι πρόθεμα κάποιας άλλης — αυτό κάνει την αποκωδικοποίηση μονοσήμαντη (κώδικας προθέματος).</p>
        <p><strong>γ) Κωδικοποίηση «ΚΑΣΤΑΝΑΣ».</strong> <InlineMath>{'K\\,A\\,\\Sigma\\,T\\,A\\,N\\,A\\,\\Sigma'}</InlineMath> = <InlineMath>{'101\\;11\\;100\\;00\\;11\\;01\\;11\\;100'}</InlineMath> → η ακολουθία <InlineMath>{'1011110000110111100'}</InlineMath>.</p>
        <p><strong>δ) Αποκωδικοποίηση <InlineMath>{'0100100101101'}</InlineMath>.</strong> Διαβάζουμε bit-bit και «κατεβαίνουμε» στο δένδρο μέχρι να φτάσουμε φύλλο: <InlineMath>{'01'}</InlineMath> → <InlineMath>{'N'}</InlineMath>· <InlineMath>{'00'}</InlineMath> → <InlineMath>{'T'}</InlineMath>· <InlineMath>{'100'}</InlineMath> → <InlineMath>{'\\Sigma'}</InlineMath>· <InlineMath>{'101'}</InlineMath> → <InlineMath>{'K'}</InlineMath>· <InlineMath>{'101'}</InlineMath> → <InlineMath>{'K'}</InlineMath>. Το μήνυμα είναι <strong>ΝΤΣΚΚ</strong>.</p>
      </>
    ),
  },
  {
    id: 'front-set-6-ask8',
    title: 'Φροντιστηριακό Σετ #6 · Άσκηση 8 — Άπληστος χρωματισμός & ελάχιστα ταξί',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #6',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Δώστε έναν άπληστο αλγόριθμο χρωματισμού των κορυφών ενός γράφου με τον ελάχιστο δυνατό αριθμό χρωμάτων, ώστε γειτονικές κορυφές να μην έχουν το ίδιο χρώμα. Στη συνέχεια, δοθέντος ενός συνόλου ραντεβού (καθένα με χρόνο έναρξης και λήξης), βρείτε τον μικρότερο αριθμό ταξί που χρειάζονται ώστε να εξυπηρετηθούν όλα — κάθε ταξί δεν μπορεί να εξυπηρετεί επικαλυπτόμενα ραντεβού.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Άπληστος χρωματισμός.</strong> Διάταξε τις κορυφές σε κάποια σειρά. Για κάθε κορυφή με τη σειρά, δώσε της το <em>μικρότερο</em> χρώμα που δεν χρησιμοποιείται ήδη από κάποιον ήδη χρωματισμένο γείτονά της.</p>
        <p><strong>Προσοχή:</strong> ο άπληστος χρωματισμός <em>δεν</em> δίνει πάντα τον ελάχιστο αριθμό χρωμάτων — το αποτέλεσμα εξαρτάται από τη σειρά. Με «κακή» σειρά μπορεί να χρειαστούν 4 χρώματα εκεί που μια «καλή» σειρά αρκείται σε 3. (Το γενικό πρόβλημα ελάχιστου χρωματισμού είναι NP-δύσκολο.)</p>
        <p><strong>Το πρόβλημα των ταξί = διαμέριση διαστημάτων (interval partitioning).</strong> Κάθε ραντεβού είναι ένα χρονικό διάστημα· δύο ραντεβού «συγκρούονται» αν επικαλύπτονται· κάθε ταξί εξυπηρετεί μη-συγκρουόμενα ραντεβού. Θέλουμε τα λιγότερα ταξί.</p>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Ταξινόμησε τα ραντεβού κατά αύξοντα χρόνο έναρξης. Σάρωσέ τα με αυτή τη σειρά: σε κάθε ραντεβού ανάθεσε ένα ταξί που είναι ελεύθερο εκείνη τη στιγμή· αν δεν υπάρχει ελεύθερο, πρόσθεσε ένα νέο ταξί. Όταν ένα ραντεβού τελειώνει, το ταξί του ξαναγίνεται ελεύθερο.</p>
        <p><strong>Γιατί είναι βέλτιστος.</strong> Ο αριθμός των ταξί που θα χρησιμοποιήσει ισούται με το «βάθος» <InlineMath>{'d'}</InlineMath> — το μέγιστο πλήθος ραντεβού που είναι ταυτόχρονα ενεργά σε κάποια χρονική στιγμή. Αλλά σε εκείνη τη στιγμή τα <InlineMath>{'d'}</InlineMath> ραντεβού επικαλύπτονται ανά δύο, οπότε <em>κάθε</em> λύση χρειάζεται τουλάχιστον <InlineMath>{'d'}</InlineMath> ταξί. Ο άπληστος πετυχαίνει ακριβώς <InlineMath>{'d'}</InlineMath> → βέλτιστος.</p>
        <p><strong>Η σύνδεση με τον χρωματισμό.</strong> Φτιάξε γράφο με κόμβο ανά ραντεβού και ακμή ανάμεσα σε όσα επικαλύπτονται· τότε «ελάχιστα ταξί» = «ελάχιστος χρωματισμός» αυτού του γράφου. Εδώ όμως ο γράφος είναι ειδικής μορφής (γράφος διαστημάτων), και γι’ αυτό η άπληστη σάρωση κατά χρόνο έναρξης δίνει το βέλτιστο. <strong>Πολυπλοκότητα:</strong> <InlineMath>{'O(n \\log n)'}</InlineMath> από την ταξινόμηση.</p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #7 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-7-ask1',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 1 — Ένωση n ράβδων χρυσού με ελάχιστο κόστος',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p>Δίνονται <InlineMath>{'n'}</InlineMath> ράβδοι χρυσού διαφορετικού βάρους. Θέλουμε να τις ενώσουμε σε μία. Το κόστος της ένωσης 2 ράβδων είναι ίσο με το άθροισμα των βαρών τους. Δώστε έναν αποδοτικό άπληστο αλγόριθμο που ελαχιστοποιεί το συνολικό κόστος. (Δεν ζητείται απόδειξη ορθότητας.) Να υπολογιστεί η πολυπλοκότητα.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος κανόνας: ένωσε κάθε φορά τις δύο ελαφρύτερες ράβδους.</strong> Αυτό είναι ακριβώς το πρόβλημα του Huffman με άλλο ρούχο: κάθε ράβδος είναι ένα «φύλλο», κάθε ένωση ένας «εσωτερικός κόμβος» με βάρος το άθροισμα — και θέλουμε το ελάχιστο συνολικό κόστος ενώσεων.</p>
        <p><strong>Διαίσθηση.</strong> Όταν ενώνεις δύο ράβδους, το άθροισμά τους θα ξανα-μετρηθεί σε κάθε επόμενη ένωση που τις περιλαμβάνει. Άρα οι ράβδοι που ενώνονται <em>νωρίς</em> πληρώνονται <em>πολλές</em> φορές. Συμφέρει λοιπόν να ενώνουμε νωρίς τις ελαφρύτερες.</p>
        <p><strong>Υλοποίηση με min-heap.</strong> Βάλε όλα τα βάρη σε έναν σωρό ελαχίστου (min-heap):</p>
        <ul>
          <li>Κατασκευή του σωρού: <InlineMath>{'O(n)'}</InlineMath>.</li>
          <li>Επανάλαβε <InlineMath>{'n - 1'}</InlineMath> φορές: εξήγαγε τις 2 μικρότερες τιμές (δύο <InlineMath>{'\\text{extract-min}'}</InlineMath>, <InlineMath>{'O(\\log n)'}</InlineMath>), πρόσθεσέ τες, και εισήγαγε το άθροισμα πίσω στον σωρό (<InlineMath>{'O(\\log n)'}</InlineMath>). Πρόσθεσε το άθροισμα στο συνολικό κόστος.</li>
        </ul>
        <p><strong>Πολυπλοκότητα.</strong> <InlineMath>{'O(n)'}</InlineMath> για την κατασκευή, και <InlineMath>{'n-1'}</InlineMath> βήματα από <InlineMath>{'O(\\log n)'}</InlineMath> το καθένα → συνολικά <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask2',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 2 — Λύκος, κατσίκα, λάχανο (αναζήτηση σε γράφο)',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>Ένας βαρκάρης βρίσκεται στην όχθη ενός ποταμού με ένα λάχανο, μια κατσίκα κι έναν λύκο, και θέλει να τα μεταφέρει στην απέναντι όχθη με τη βάρκα του. Περιορισμοί:</p>
        <ul>
          <li>Για να κινηθεί η βάρκα πρέπει οπωσδήποτε να είναι μέσα ο βαρκάρης.</li>
          <li>Όταν είναι ο βαρκάρης μέσα στη βάρκα, υπάρχει χώρος μόνο για ένα ακόμα αντικείμενο.</li>
          <li>Αν ο λύκος μείνει μόνος με την κατσίκα, θα τη φάει· ομοίως η κατσίκα θα φάει το λάχανο αν μείνουν μόνα.</li>
        </ul>
        <p>Πώς μπορεί να γίνει η μεταφορά;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Μοντελοποίηση ως γράφος καταστάσεων.</strong> Δεν χρειάζεται «έξυπνη» ιδέα — αρκεί να μετατρέψουμε το γρίφο σε γράφο και να ψάξουμε μονοπάτι.</p>
        <p>Συμβολίζουμε με <InlineMath>{'B'}</InlineMath> τον βαρκάρη, <InlineMath>{'C'}</InlineMath> το λάχανο, <InlineMath>{'G'}</InlineMath> την κατσίκα, <InlineMath>{'W'}</InlineMath> τον λύκο. <strong>Κατάσταση</strong> = το σύνολο όσων βρίσκονται στην <em>απέναντι</em> όχθη. Υπάρχουν <InlineMath>{'2^4 = 16'}</InlineMath> δυνητικές καταστάσεις.</p>
        <p><strong>Κόμβοι:</strong> κάθε <em>επιτρεπτή</em> κατάσταση (αποκλείουμε όσες αφήνουν λύκο+κατσίκα ή κατσίκα+λάχανο χωρίς τον βαρκάρη σε κάποια όχθη). <strong>Ακμές:</strong> ανάμεσα σε δύο καταστάσεις αν περνάμε από τη μία στην άλλη με ένα νόμιμο πέρασμα της βάρκας (ο βαρκάρης ± ένα αντικείμενο αλλάζουν όχθη).</p>
        <p><strong>Λύση = μονοπάτι.</strong> Το πρόβλημα γίνεται: βρες μονοπάτι από την αρχική κατάσταση <InlineMath>{'\\varnothing'}</InlineMath> (όλα στην αρχική όχθη) στην τελική <InlineMath>{'\\{B, C, G, W\\}'}</InlineMath> (όλα απέναντι). Το βρίσκουμε με <strong>BFS</strong> ή <strong>DFS</strong> — και το BFS μάλιστα δίνει και τη <em>συντομότερη</em> λύση.</p>
        <p>Υπάρχουν δύο λύσεις 7 περασμάτων· η μία:</p>
        <BlockMath>{'\\varnothing \\to BG \\to G \\to BCG \\to C \\to BCW \\to CW \\to BCGW'}</BlockMath>
        <p>Σε λόγια: πέρνα την κατσίκα απέναντι· γύρνα μόνος· πέρνα το λάχανο· φέρε πίσω την κατσίκα· πέρνα τον λύκο· γύρνα μόνος· πέρνα ξανά την κατσίκα. Σε κάθε ενδιάμεση στιγμή ο λύκος δεν μένει ποτέ μόνος με την κατσίκα, ούτε η κατσίκα με το λάχανο.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask3',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 3 — Άπληστη προσέγγιση του TSP μέσω MST',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Δίνεται ένας πλήρης γράφος <InlineMath>{'K_5 = (V, E, W)'}</InlineMath> με <InlineMath>{'|V| = 5'}</InlineMath> κόμβους, <InlineMath>{'|E| = m'}</InlineMath> ακμές και <InlineMath>{'W : E \\to \\mathbb{N}'}</InlineMath> συνάρτηση βαρών. Δώστε έναν άπληστο αλγόριθμο σε ψευδογλώσσα που βρίσκει μια <em>εφικτή</em> λύση του προβλήματος του πλανόδιου πωλητή (TSP). Υπολογίστε την πολυπλοκότητά του όταν ο γράφος είναι τάξης <InlineMath>{'n'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η ιδέα.</strong> Το TSP ζητά κύκλο Hamilton (περνά μία φορά από κάθε κόμβο) ελάχιστου κόστους — δύσκολο. Όμως μια <em>εφικτή</em> (όχι κατ’ ανάγκη βέλτιστη) λύση παίρνεται εύκολα από ένα MST.</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`GREEDY-TSP(G, W):
  1. διάλεξε μια κορυφή r ως "ρίζα"
  2. υπολόγισε ένα MST T του G με ρίζα r (αλγόριθμος Prim)
  3. L := λίστα κορυφών κατά preorder διάσχιση του T
  4. επίστρεψε τον κύκλο Hamilton που επισκέπτεται τις
     κορυφές με τη σειρά L`}</pre>
        <p><strong>Γιατί δουλεύει.</strong> Η preorder διάσχιση του MST επισκέπτεται κάθε κόμβο ακριβώς μία φορά· διαβάζοντας τους κόμβους με αυτή τη σειρά και κλείνοντας πίσω στον <InlineMath>{'r'}</InlineMath> παίρνουμε έναν έγκυρο κύκλο Hamilton. Αφού ο γράφος είναι πλήρης, όλες οι απαιτούμενες ακμές υπάρχουν, άρα ο κύκλος είναι πάντα εφικτός.</p>
        <p><strong>Πολυπλοκότητα.</strong> Σε πλήρη γράφο <InlineMath>{'n'}</InlineMath> κορυφών το MST με Prim (υλοποίηση με πίνακα) κοστίζει <InlineMath>{'O(n^2)'}</InlineMath>· η preorder διάσχιση κοστίζει <InlineMath>{'O(n)'}</InlineMath>. Συνολικά <InlineMath>{'O(n^2)'}</InlineMath>.</p>
        <p>(Όταν τα βάρη ικανοποιούν την τριγωνική ανισότητα, αποδεικνύεται μάλιστα ότι αυτός ο κύκλος έχει κόστος το πολύ <InlineMath>{'2\\times'}</InlineMath> το βέλτιστο — είναι ένας αλγόριθμος <em>2-προσέγγισης</em>.)</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask4',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 4 — Μηνιαίο vs ετήσιο πακέτο ίντερνετ',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Θέλουμε να επιλέξουμε τον τρόπο παροχής ίντερνετ στο σπίτι, με μηνιαίο πακέτο (χωρίς δέσμευση, μεταβλητή τιμή <InlineMath>{'p_i'}</InlineMath> τον μήνα <InlineMath>{'i'}</InlineMath>), ετήσιο συμβόλαιο (δέσμευση 12 μηνών, σταθερή τιμή <InlineMath>{'C'}</InlineMath>), ή κάποιον συνδυασμό τους σε ορίζοντα <InlineMath>{'n'}</InlineMath> μηνών. Ποιος είναι ένας άπληστος αλγόριθμος για αυτό το πρόβλημα;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Προχωράμε μήνα-μήνα. Στον μήνα <InlineMath>{'i'}</InlineMath>: αν δεν χωρούν άλλοι 12 μήνες ως το τέλος, ή αν το ετήσιο κόστος είναι ακριβότερο από τους επόμενους 12 μηνιαίους (<InlineMath>{'C > \\sum_{k=i}^{i+11} p_k'}</InlineMath>), αγόρασε <em>μηνιαίο</em> πακέτο για τον μήνα <InlineMath>{'i'}</InlineMath> (κόστος <InlineMath>{'p_i'}</InlineMath>, προχώρα στον <InlineMath>{'i+1'}</InlineMath>). Αλλιώς αγόρασε <em>ετήσιο</em> συμβόλαιο (κόστος <InlineMath>{'C'}</InlineMath>, προχώρα στον <InlineMath>{'i+12'}</InlineMath>).</p>
        <p><strong>Ο άπληστος ΔΕΝ είναι βέλτιστος.</strong> Το πρόβλημα έχει «μνήμη»: η απόφαση τώρα δεσμεύει 12 μήνες, και η τοπική σύγκριση δεν βλέπει αρκετά μακριά.</p>
        <p><strong>Αντιπαράδειγμα.</strong> <InlineMath>{'n = 13'}</InlineMath>, <InlineMath>{'C = 12'}</InlineMath>, μηνιαίες τιμές <InlineMath>{'p = (1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1000)'}</InlineMath> (δώδεκα μονάδες και μετά <InlineMath>{'1000'}</InlineMath>). Στον μήνα 1 ο άπληστος βλέπει ότι οι επόμενοι 12 μήνες (1–12) κοστίζουν <InlineMath>{'12'}</InlineMath>· αφού <InlineMath>{'C > 12'}</InlineMath> δεν ισχύει, αγοράζει <em>ετήσιο</em> (κόστος <InlineMath>{'12'}</InlineMath>) και πηδά στον μήνα 13. Εκεί μένει μόνο 1 μήνας, οπότε αγοράζει μηνιαίο <InlineMath>{'p_{13} = 1000'}</InlineMath>. Συνολικό κόστος <InlineMath>{'12 + 1000 = 1012'}</InlineMath>.</p>
        <p>Η βέλτιστη λύση όμως: αγόρασε <em>μηνιαίο</em> για τον μήνα 1 (κόστος <InlineMath>{'1'}</InlineMath>) και μετά <em>ετήσιο</em> για τους μήνες 2–13 (κόστος <InlineMath>{'12'}</InlineMath>) → συνολικό κόστος <InlineMath>{'13 \\ll 1012'}</InlineMath>. Ο άπληστος αποτυγχάνει· το πρόβλημα θέλει δυναμικό προγραμματισμό.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask5',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 5 — Παιχνίδι διαδρομής σε πίνακα: αποτυγχάνει ο άπληστος',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 5',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Έστω ένας πίνακας ακεραίων <InlineMath>{'A'}</InlineMath> με <InlineMath>{'m'}</InlineMath> γραμμές και <InlineMath>{'n'}</InlineMath> στήλες. Παιχνίδι: ξεκινώντας από οποιοδήποτε κελί της κάτω γραμμής, προσπαθούμε να φτάσουμε σε κάποιο κελί της πάνω γραμμής, περνώντας από κελιά ελαχίστου συνολικού κόστους. Κόστος ενός κελιού <InlineMath>{'(i, j)'}</InlineMath> = ο αριθμός που αναγράφεται σε αυτό. Από ένα κελί κινούμαστε είτε ακριβώς επάνω, είτε διαγωνίως επάνω-αριστερά, είτε διαγωνίως επάνω-δεξιά.</p>
        <p>Θεωρήστε τον εξής άπληστο αλγόριθμο: επίλεξε στην κάτω γραμμή το κελί ελαχίστου κόστους, και σε κάθε βήμα επίλεξε το κελί ελαχίστου κόστους της αμέσως πιο πάνω γραμμής στο οποίο έχεις δικαίωμα να μεταβείς. Είναι ο αλγόριθμος βέλτιστος; Αν όχι, δώστε αντιπαράδειγμα.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος ΔΕΝ είναι βέλτιστος.</strong> Διαλέγοντας πάντα το φθηνότερο επόμενο κελί, ο αλγόριθμος μπορεί να «παγιδευτεί»: ένα φθηνό κελί τώρα μπορεί να σε αναγκάσει να περάσεις από ακριβά κελιά μετά.</p>
        <p><strong>Αντιπαράδειγμα.</strong> Θεωρήστε τον πίνακα (η γραμμή 1 είναι η κάτω):</p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-soft p-3 text-[13px] leading-relaxed">{`γρ.4:  3   9   9   6   9
γρ.3:  5   6   7   3   4
γρ.2:  6   8   7   7   2
γρ.1:  4   3   6   5   9   ← εκκίνηση`}</pre>
        <p>Ο άπληστος ξεκινά από το κελί ελαχίστου κόστους της κάτω γραμμής: το <InlineMath>{'3'}</InlineMath> (στήλη 2). Από εκεί διαλέγει διαδοχικά το φθηνότερο επιτρεπτό κελί προς τα πάνω και καταλήγει σε διαδρομή συνολικού κόστους <InlineMath>{'17'}</InlineMath>. Όμως υπάρχει διαδρομή που, ξεκινώντας από <em>άλλο</em> κελί της κάτω γραμμής, αξιοποιεί τα φθηνά κελιά <InlineMath>{'2'}</InlineMath> και <InlineMath>{'3'}</InlineMath> των πάνω γραμμών και πετυχαίνει συνολικό κόστος μόλις <InlineMath>{'16'}</InlineMath> (διακεκομμένη διαδρομή <InlineMath>{'5 \\to 2 \\to 3 \\to 6'}</InlineMath>). Άρα ο άπληστος δίνει <InlineMath>{'17 > 16'}</InlineMath> — δεν είναι βέλτιστος.</p>
        <p><strong>Η σωστή προσέγγιση.</strong> Το πρόβλημα θέλει δυναμικό προγραμματισμό: <InlineMath>{'D(i, j)'}</InlineMath> = ελάχιστο κόστος για να φτάσεις το κελί <InlineMath>{'(i, j)'}</InlineMath> από την κάτω γραμμή, με <InlineMath>{'D(i, j) = A[i][j] + \\min'}</InlineMath> των τριών κελιών της προηγούμενης γραμμής απ’ όπου επιτρέπεται η μετάβαση. Έτσι λαμβάνεται υπόψη <em>ολόκληρη</em> η διαδρομή, όχι μόνο το επόμενο βήμα.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask6',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 6 — Αναβάθμιση τηλεφωνικού δικτύου (MST)',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 6',
    difficulty: 'easy',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Το τηλεφωνικό δίκτυο μιας χώρας πρέπει να αναβαθμιστεί για ταχύτερη μεταφορά δεδομένων. Το κόστος αναβάθμισης μιας γραμμής ανάμεσα σε δύο κόμβους είναι ανάλογο του μήκους της.</p>
        <p><strong>i.</strong> Διατυπώστε άπληστο αλγόριθμο που ελαχιστοποιεί το κόστος αναβάθμισης, έτσι ώστε για κάθε δύο κόμβους να υπάρχει ακριβώς μία αναβαθμισμένη διαδρομή σύνδεσης και το συνολικό κόστος να είναι το ελάχιστο δυνατό. <strong>ii.</strong> Δώστε την πολυπλοκότητα χρόνου.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Αναγνώριση του προβλήματος.</strong> Δύο φράσεις-κλειδιά: «για κάθε δύο κόμβους <em>ακριβώς μία</em> διαδρομή» σημαίνει ότι το αναβαθμισμένο υποδίκτυο είναι <strong>δέντρο</strong> (ένα συνεκτικό γράφημα χωρίς κύκλους έχει μοναδικό μονοπάτι μεταξύ κάθε ζεύγους). Και «<em>ελάχιστο</em> συνολικό κόστος». Άρα ζητάμε ακριβώς ένα <strong>ελάχιστο δέντρο επικάλυψης (MST)</strong> του γραφήματος με βάρη <InlineMath>{'G = (V, E)'}</InlineMath>, όπου κόμβοι = τηλεφωνικοί κόμβοι και βάρη ακμών = κόστος αναβάθμισης.</p>
        <p><strong>i. Ο αλγόριθμος.</strong> Χρησιμοποιούμε έναν γνωστό άπληστο αλγόριθμο MST:</p>
        <ul>
          <li><strong>Kruskal:</strong> σάρωσε τις ακμές κατά αύξον βάρος· κράτα μια ακμή αν δεν σχηματίζει κύκλο με τις ήδη επιλεγμένες (έλεγχος με δομή Union-Find).</li>
          <li><strong>Prim:</strong> ξεκίνα από έναν κόμβο και επέκτεινε το δέντρο προσθέτοντας κάθε φορά την ελαφρύτερη ακμή που το συνδέει με νέο κόμβο.</li>
        </ul>
        <p><strong>ii. Πολυπλοκότητα.</strong> Και οι δύο τρέχουν σε <InlineMath>{'O(E \\log V)'}</InlineMath> — ο Kruskal λόγω της ταξινόμησης των ακμών, ο Prim με υλοποίηση μέσω ουράς προτεραιότητας.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask7',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 7 — Ελάχιστα μοναδιαία διαστήματα που καλύπτουν σημεία',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 7',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Περιγράψτε έναν αποδοτικό αλγόριθμο ο οποίος, δεδομένου ενός συνόλου σημείων <InlineMath>{'\\{x_1, x_2, \\dots, x_n\\}'}</InlineMath> στον άξονα των πραγματικών αριθμών, καθορίζει το <em>μικρότερο</em> σύνολο κλειστών διαστημάτων μοναδιαίου μήκους που εμπεριέχει όλα τα δοθέντα σημεία.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Ταξινόμησε τα σημεία αύξοντα: <InlineMath>{'y_1 \\le y_2 \\le \\dots \\le y_n'}</InlineMath>. Το πρώτο διάστημα είναι το <InlineMath>{'[y_1,\\, y_1 + 1]'}</InlineMath>. Αγνόησε όλα τα σημεία που αυτό καλύπτει. Πάρε το <em>αριστερότερο ακάλυπτο</em> σημείο <InlineMath>{'y_i'}</InlineMath> και βάλε νέο διάστημα <InlineMath>{'[y_i,\\, y_i + 1]'}</InlineMath>. Επανάλαβε ώσπου να καλυφθούν όλα.</p>
        <p><strong>Διαίσθηση & ορθότητα.</strong> Κάποιο διάστημα <em>πρέπει</em> να καλύψει το αριστερότερο ακάλυπτο σημείο <InlineMath>{'y_i'}</InlineMath>. Από όλα τα μοναδιαίου μήκους διαστήματα που το καλύπτουν, αυτό με αριστερό άκρο ακριβώς στο <InlineMath>{'y_i'}</InlineMath> «απλώνεται» όσο πιο δεξιά γίνεται — άρα καλύπτει τα <em>περισσότερα</em> δυνατά επόμενα σημεία. Καμία άλλη επιλογή δεν καλύπτει αυστηρά περισσότερα, οπότε η άπληστη επιλογή δεν χάνει ποτέ — με επιχείρημα ανταλλαγής, η άπληστη λύση χρησιμοποιεί όσα διαστήματα και κάθε βέλτιστη.</p>
        <p><strong>Πολυπλοκότητα.</strong> Κυριαρχεί η ταξινόμηση: <InlineMath>{'O(n \\log n)'}</InlineMath>. Η μετέπειτα σάρωση είναι <InlineMath>{'O(n)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask8',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 8 — Κατανομή μαθημάτων σε αίθουσες',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 8',
    difficulty: 'medium',
    prerequisites: ['lectures/L11-greedy-i'],
    statement: (
      <>
        <p>Το Τμήμα Πληροφορικής ενός Πανεπιστημίου θέλει να κατανείμει ένα σύνολο <InlineMath>{'m'}</InlineMath> μαθημάτων στις διαθέσιμες αίθουσες (που είναι <InlineMath>{'n'}</InlineMath> το πλήθος, με το <InlineMath>{'n'}</InlineMath> αρκετά μεγάλο). Οποιοδήποτε μάθημα μπορεί να γίνει σε οποιαδήποτε αίθουσα, αρκεί να μην υπάρχουν χρονικές επικαλύψεις μεταξύ μαθημάτων της ίδιας αίθουσας. Θέλουμε να προγραμματίσουμε όλα τα μαθήματα χρησιμοποιώντας όσο το δυνατόν λιγότερες αίθουσες. Δώστε αποδοτικό άπληστο αλγόριθμο που αποφασίζει ποια αίθουσα θα φιλοξενήσει ποιο μάθημα. Δίνει ο αλγόριθμός σας βέλτιστο αποτέλεσμα;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Ο άπληστος αλγόριθμος.</strong> Κράτα δύο σύνολα αιθουσών: <InlineMath>{'F'}</InlineMath> = ελεύθερες (χρησιμοποιήθηκαν στο παρελθόν και αποδεσμεύτηκαν) και <InlineMath>{'B'}</InlineMath> = κατειλημμένες. Ταξινόμησε τα μαθήματα κατά αύξοντα χρόνο έναρξης και σάρωσέ τα:</p>
        <ul>
          <li>Όταν αρχίζει ένα μάθημα: αν το <InlineMath>{'F'}</InlineMath> έχει αίθουσα, πάρ’ την, βάλε εκεί το μάθημα και μετέφερέ την στο <InlineMath>{'B'}</InlineMath>. Αν το <InlineMath>{'F'}</InlineMath> είναι κενό, χρησιμοποίησε μια νέα, αχρησιμοποίητη αίθουσα.</li>
          <li>Όταν τελειώνει ένα μάθημα: η αίθουσά του φεύγει από το <InlineMath>{'B'}</InlineMath> και επιστρέφει στο <InlineMath>{'F'}</InlineMath>.</li>
        </ul>
        <p><strong>Ναι, δίνει βέλτιστο αποτέλεσμα.</strong> Ο αλγόριθμος ανοίγει νέα αίθουσα μόνο όταν είναι απολύτως απαραίτητο — δηλαδή όταν εκείνη τη στιγμή όλες οι αίθουσες που έχει «ξοδέψει» είναι κατειλημμένες. Έστω ότι ανοίγει την αίθουσα νούμερο <InlineMath>{'d'}</InlineMath>: εκείνη τη στιγμή υπάρχουν <InlineMath>{'d'}</InlineMath> μαθήματα ταυτόχρονα ενεργά, που ανά δύο επικαλύπτονται. Άρα <em>κάθε</em> έγκυρο πρόγραμμα χρειάζεται τουλάχιστον <InlineMath>{'d'}</InlineMath> αίθουσες. Ο άπληστος χρησιμοποιεί ακριβώς <InlineMath>{'d'}</InlineMath> (στη χειρότερη περίπτωση, όπου όλα τα μαθήματα συμπίπτουν, χρησιμοποιεί <InlineMath>{'m'}</InlineMath>) — άρα είναι βέλτιστος.</p>
        <p><strong>Πολυπλοκότητα.</strong> <InlineMath>{'O(m \\log m)'}</InlineMath> από την ταξινόμηση των χρόνων έναρξης/λήξης.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask9',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 9 — Το πάρτι της Alice (φιλτράρισμα γράφου)',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 9',
    difficulty: 'medium',
    prerequisites: ['lectures/L06-graphs-i'],
    statement: (
      <>
        <p>Η Alice θέλει να διοργανώσει ένα πάρτι. Έχει <InlineMath>{'n'}</InlineMath> υποψήφια άτομα και μια λίστα με τα ζεύγη ατόμων που ο ένας γνωρίζει τον άλλον. Θέλει να διαλέξει όσο το δυνατόν περισσότερα άτομα, με δύο περιορισμούς: <strong>(α)</strong> στο πάρτι, κάθε άτομο πρέπει να γνωρίζει τουλάχιστον άλλα 5 άτομα, και <strong>(β)</strong> κάθε άτομο πρέπει να έχει τουλάχιστον 5 άλλα άτομα που δε γνωρίζει. Δώστε αποδοτικό αλγόριθμο που δέχεται τη λίστα των <InlineMath>{'n'}</InlineMath> υποψηφίων και τα ζεύγη γνωριμιών, και παράγει την καλύτερη επιλογή. Δώστε τον χρόνο εκτέλεσης συναρτήσει του <InlineMath>{'n'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Μοντελοποίηση.</strong> Φτιάχνουμε γράφο <InlineMath>{'G'}</InlineMath>: κόμβος ανά υποψήφιο, ακμή ανάμεσα σε δύο που γνωρίζονται. Σε ένα τρέχον σύνολο καλεσμένων με <InlineMath>{'|V|'}</InlineMath> άτομα, ένας κόμβος <InlineMath>{'v'}</InlineMath> είναι «προβληματικός» αν: γνωρίζει λιγότερους από 5 (βαθμός <InlineMath>{'< 5'}</InlineMath>) ή γνωρίζει σχεδόν όλους, αφήνοντας λιγότερους από 5 αγνώστους (βαθμός <InlineMath>{'> |V| - 6'}</InlineMath>).</p>
        <p><strong>Ο άπληστος αλγόριθμος (επαναληπτικό φιλτράρισμα).</strong> Όσο υπάρχει προβληματικός κόμβος, αφαίρεσέ τον από το σύνολο (και ενημέρωσε τους βαθμούς των γειτόνων του). Επανάλαβε μέχρι να μην υπάρχει κανείς προβληματικός. Το σύνολο που μένει είναι η ζητούμενη καλύτερη επιλογή.</p>
        <p><strong>Γιατί είναι ασφαλές (και βέλτιστο).</strong> Όταν ένας κόμβος <InlineMath>{'v'}</InlineMath> παραβιάζει ένα κριτήριο, <em>καμία</em> έγκυρη λύση δεν μπορεί να τον περιέχει: αν γνωρίζει λιγότερους από 5 τώρα, θα γνωρίζει ακόμη λιγότερους σε οποιοδήποτε υποσύνολο — άρα η αφαίρεσή του δεν «κόβει» καμία έγκυρη λύση. Επιπλέον, η αφαίρεση κόμβων μόνο μειώνει βαθμούς, οπότε δεν χαλάει κάποιον που ικανοποιούσε το κριτήριο (α) — και μόνο μειώνει το <InlineMath>{'|V|'}</InlineMath>, που βοηθά το κριτήριο (β). Άρα στο τέλος μένει το <em>μεγαλύτερο</em> έγκυρο σύνολο.</p>
        <p><strong>Πολυπλοκότητα.</strong> Κάθε «πέρασμα» της λίστας κοστίζει <InlineMath>{'O(n^2)'}</InlineMath> (υπολογισμός βαθμών) και αφαιρεί τουλάχιστον έναν κόμβο, άρα γίνονται το πολύ <InlineMath>{'n'}</InlineMath> περάσματα → <InlineMath>{'O(n^3)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask10',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 10 — Συντομότερο μονοπάτι με αρνητικά βάρη;',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 10',
    difficulty: 'medium',
    prerequisites: ['lectures/L08-graphs-iii'],
    statement: (
      <>
        <p>Ο καθηγητής Εξυπνούλης προτείνει τον ακόλουθο αλγόριθμο για την εύρεση της συντομότερης διαδρομής από τον κόμβο <InlineMath>{'s'}</InlineMath> στον κόμβο <InlineMath>{'t'}</InlineMath> σε έναν γράφο με ακμές αρνητικού βάρους: πρόσθεση μιας σταθεράς σε κάθε βάρος ακμής ώστε όλα τα βάρη να γίνουν θετικά, και κατόπιν εκτέλεση του αλγορίθμου του Dijkstra. Λειτουργεί τώρα σωστά ο αλγόριθμος;</p>
      </>
    ),
    solution: (
      <>
        <p><strong>ΟΧΙ, ο αλγόριθμος είναι λανθασμένος.</strong></p>
        <p><strong>Το σφάλμα.</strong> Αν προσθέσουμε σταθερά <InlineMath>{'c'}</InlineMath> σε <em>κάθε</em> ακμή, τότε ένα μονοπάτι με <InlineMath>{'\\ell'}</InlineMath> ακμές βλέπει το κόστος του να αυξάνεται κατά <InlineMath>{'c \\cdot \\ell'}</InlineMath>. Η αύξηση δεν είναι ίδια για όλα τα μονοπάτια — εξαρτάται από το <em>πλήθος ακμών</em>. Έτσι ο μετασχηματισμός «τιμωρεί» τα μονοπάτια με πολλές ακμές και μπορεί να αλλάξει ποιο μονοπάτι είναι το συντομότερο.</p>
        <p><strong>Αντιπαράδειγμα.</strong> Κόμβοι <InlineMath>{'u, v, w'}</InlineMath> με ακμές <InlineMath>{'u \\to v'}</InlineMath> βάρους <InlineMath>{'-1'}</InlineMath>, <InlineMath>{'v \\to w'}</InlineMath> βάρους <InlineMath>{'-3'}</InlineMath>, και <InlineMath>{'u \\to w'}</InlineMath> βάρους <InlineMath>{'-3'}</InlineMath>. Το πραγματικό συντομότερο <InlineMath>{'u \\to w'}</InlineMath> είναι το <InlineMath>{'u \\to v \\to w'}</InlineMath> με κόστος <InlineMath>{'-4'}</InlineMath> (έναντι <InlineMath>{'-3'}</InlineMath> της απευθείας ακμής).</p>
        <p>Προσθέτουμε <InlineMath>{'c = 4'}</InlineMath> σε όλα: <InlineMath>{'u \\to v = 3'}</InlineMath>, <InlineMath>{'v \\to w = 1'}</InlineMath>, <InlineMath>{'u \\to w = 1'}</InlineMath>. Τώρα η διαδρομή <InlineMath>{'u \\to v \\to w'}</InlineMath> κοστίζει <InlineMath>{'3 + 1 = 4'}</InlineMath>, ενώ η απευθείας <InlineMath>{'u \\to w'}</InlineMath> κοστίζει <InlineMath>{'1'}</InlineMath>. Ο Dijkstra επιστρέφει την απευθείας ακμή — λάθος απάντηση.</p>
        <p><strong>Η σωστή λύση.</strong> Για γράφους με αρνητικά βάρη (χωρίς αρνητικούς κύκλους) χρησιμοποιούμε τον αλγόριθμο <strong>Bellman-Ford</strong>, που χειρίζεται σωστά τα αρνητικά βάρη με χρόνο <InlineMath>{'O(V \\cdot E)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask11',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 11 — Σωστό/Λάθος για MST και Dijkstra',
    topic: 'graphs',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 11',
    difficulty: 'medium',
    prerequisites: ['lectures/L09-graphs-iv'],
    statement: (
      <>
        <p>Να αποδείξετε αν είναι σωστές ή λάθος οι παρακάτω εκφράσεις:</p>
        <p><strong>(i)</strong> Αν ο γράφος <InlineMath>{'G'}</InlineMath> έχει περισσότερες από <InlineMath>{'|V| - 1'}</InlineMath> ακμές και υπάρχει μια μοναδική ακμή μέγιστου βάρους, τότε αυτή η ακμή δεν μπορεί να είναι τμήμα ενός ΔΕΕΚ (δέντρου επικάλυψης ελάχιστου κόστους).</p>
        <p><strong>(ii)</strong> Το δέντρο διαδρομών μικρότερου βάρους που υπολογίζεται από τον αλγόριθμο του Dijkstra είναι υποχρεωτικά ένα ΔΕΕΚ.</p>
        <p><strong>(iii)</strong> Έστω γράφος <InlineMath>{'G'}</InlineMath> με διαφορετικά βάρη σε κάθε ακμή. Τότε ο <InlineMath>{'G'}</InlineMath> έχει μοναδικό ΔΕΕΚ.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>(i) ΛΑΘΟΣ.</strong> Η ιδιότητα κύκλου λέει ότι η μέγιστη ακμή <em>ενός κύκλου</em> δεν χρειάζεται να μπει στο MST. Όμως η μοναδική μέγιστη ακμή ολόκληρου του γράφου μπορεί να είναι <strong>γέφυρα</strong> — η μόνη ακμή που συνδέει ένα κομμάτι του γράφου. Τότε <em>πρέπει</em> να μπει στο MST. Αντιπαράδειγμα: τρίγωνο <InlineMath>{'u\\!-\\!v(1),\\, v\\!-\\!w(1),\\, u\\!-\\!w(2)'}</InlineMath> και επιπλέον ακμή <InlineMath>{'u\\!-\\!x(10)'}</InlineMath>. Ο γράφος έχει <InlineMath>{'4'}</InlineMath> ακμές <InlineMath>{'> |V| - 1 = 3'}</InlineMath>, και η <InlineMath>{'u\\!-\\!x'}</InlineMath> βάρους <InlineMath>{'10'}</InlineMath> είναι η μοναδική μέγιστη — αλλά είναι η μόνη σύνδεση του <InlineMath>{'x'}</InlineMath>, άρα ανήκει υποχρεωτικά στο MST.</p>
        <p><strong>(ii) ΛΑΘΟΣ.</strong> Το δέντρο συντομότερων διαδρομών του Dijkstra βελτιστοποιεί <em>αποστάσεις από τη ρίζα</em>, ενώ το MST βελτιστοποιεί το <em>συνολικό βάρος</em> — διαφορετικοί στόχοι. Αντιπαράδειγμα: τρίγωνο <InlineMath>{'u\\!-\\!v(1),\\, v\\!-\\!w(1),\\, u\\!-\\!w(2)'}</InlineMath> με ρίζα το <InlineMath>{'u'}</InlineMath>. Το δέντρο Dijkstra παίρνει τις ακμές <InlineMath>{'(u,v)'}</InlineMath> και <InlineMath>{'(u,w)'}</InlineMath> (απευθείας αποστάσεις <InlineMath>{'1'}</InlineMath> και <InlineMath>{'2'}</InlineMath>), συνολικό βάρος <InlineMath>{'3'}</InlineMath>. Το MST όμως είναι <InlineMath>{'\\{(u,v), (v,w)\\}'}</InlineMath>, συνολικό βάρος <InlineMath>{'2'}</InlineMath>. Διαφορετικά δέντρα.</p>
        <p><strong>(iii) ΣΩΣΤΟ.</strong> Όταν όλα τα βάρη είναι διαφορετικά, το MST είναι μοναδικό. Διαίσθηση μέσω της ιδιότητας τομής: για κάθε διαμέριση των κορυφών σε δύο σύνολα, η <em>μοναδική</em> ελαφρύτερη ακμή που τα συνδέει ανήκει υποχρεωτικά σε κάθε MST. Αν υπήρχαν δύο διαφορετικά MST, θα παίρναμε την ελαφρύτερη ακμή στη συμμετρική τους διαφορά και θα οδηγούμασταν σε αντίφαση. Άρα το MST είναι αναγκαστικά ένα και μοναδικό.</p>
      </>
    ),
  },
  {
    id: 'front-set-7-ask12',
    title: 'Φροντιστηριακό Σετ #7 · Άσκηση 12 — Σακίδιο: κλασματικό (άπληστο) vs 0-1',
    topic: 'greedy',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #7',
    problemNumber: 'Άσκηση 12',
    difficulty: 'medium',
    prerequisites: ['lectures/L13-greedy-iii'],
    statement: (
      <>
        <p><strong>Το 0-1 σακίδιο:</strong> έχουμε <InlineMath>{'n'}</InlineMath> αντικείμενα, το <InlineMath>{'i'}</InlineMath>-οστό με βάρος <InlineMath>{'w[i]'}</InlineMath> και αξία <InlineMath>{'v[i]'}</InlineMath>, και μια τσάντα που σηκώνει βάρος <InlineMath>{'W'}</InlineMath>. Ποια αντικείμενα τοποθετούμε για να μεγιστοποιήσουμε την αξία;</p>
        <p><strong>Το κλασματικό σακίδιο:</strong> παραλλαγή όπου μπορούμε να πάρουμε ένα <em>κλάσμα</em> ενός αντικειμένου. Λύστε το με άπληστο αλγόριθμο, αποδείξτε την ορθότητά του, και συζητήστε αν υπάρχει άπληστος αλγόριθμος για το 0-1 σακίδιο.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Κλασματικό σακίδιο — άπληστος αλγόριθμος.</strong> Υπολόγισε για κάθε αντικείμενο τον λόγο <em>αξίας ανά βάρος</em> <InlineMath>{'a[i] = v[i] / w[i]'}</InlineMath>. Ταξινόμησε τα αντικείμενα κατά φθίνον <InlineMath>{'a[i]'}</InlineMath>. Γέμιζε την τσάντα με αυτή τη σειρά· όταν φτάσεις σε αντικείμενο που δεν χωράει ολόκληρο, βάλε ακριβώς το κλάσμα του που χωράει και σταμάτα. Χρόνος <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
        <p><strong>Απόδειξη ορθότητας (επιχείρημα ανταλλαγής).</strong> Έστω βέλτιστη λύση που δεν ακολουθεί τη σειρά. Τότε περιέχει λίγο από ένα αντικείμενο χαμηλού λόγου ενώ αφήνει χώρο για αντικείμενο υψηλότερου λόγου. Αντικαθιστώντας ίσο βάρος του «φθηνού» με «ακριβό» η αξία <em>αυξάνεται</em> — αντίφαση με τη βελτιστότητα. Άρα η άπληστη λύση είναι βέλτιστη.</p>
        <p><strong>Για το 0-1 σακίδιο ο άπληστος ΔΕΝ δουλεύει.</strong> Εκεί ένα αντικείμενο μπαίνει ή δεν μπαίνει — δεν κόβεται. Αντιπαράδειγμα: <InlineMath>{'w = (10, 20, 30)'}</InlineMath>, <InlineMath>{'v = (60, 80, 90)'}</InlineMath>, <InlineMath>{'W = 50'}</InlineMath>. Λόγοι: <InlineMath>{'6,\\, 4,\\, 3'}</InlineMath>. Ο άπληστος παίρνει τα δύο πρώτα (βάρος <InlineMath>{'30'}</InlineMath>, αξία <InlineMath>{'140'}</InlineMath>) και μετά τίποτα δεν χωράει. Η βέλτιστη λύση όμως παίρνει το 2ο και το 3ο (βάρος <InlineMath>{'50'}</InlineMath>, αξία <InlineMath>{'170'}</InlineMath>). Το 0-1 σακίδιο είναι NP-δύσκολο και λύνεται με δυναμικό προγραμματισμό — όχι με άπληστο.</p>
      </>
    ),
  },
  // ── Φροντιστηριακό Σετ #8 — μεταγραμμένο & χωρισμένο ανά διάλεξη ───────
  {
    id: 'front-set-8-ask1',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 1 — Μέσο κόστος όλων των μονοπατιών σε DAG',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #8',
    problemNumber: 'Άσκηση 1',
    difficulty: 'medium',
    prerequisites: ['lectures/L17-dp-iv'],
    statement: (
      <>
        <p>Εύρεση του μέσου κόστους όλων των μονοπατιών, σε έναν κατευθυνόμενο ακυκλικό γράφο με βάρη <InlineMath>{'G = (V, E)'}</InlineMath>, από μία κορυφή έναρξης <InlineMath>{'s'}</InlineMath> προς μία κορυφή <InlineMath>{'t'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η ιδέα.</strong> «Μέσο κόστος» = (άθροισμα κοστών όλων των μονοπατιών) / (πλήθος μονοπατιών). Θα υπολογίσουμε <em>και τα δύο</em> με δυναμικό προγραμματισμό πάνω στον DAG.</p>
        <p><strong>Ορισμοί.</strong> Για κάθε κορυφή <InlineMath>{'x'}</InlineMath>: <InlineMath>{'count[x]'}</InlineMath> = πλήθος διακριτών μονοπατιών από το <InlineMath>{'x'}</InlineMath> ως το <InlineMath>{'t'}</InlineMath>· <InlineMath>{'sum[x]'}</InlineMath> = άθροισμα των κοστών αυτών των μονοπατιών.</p>
        <p><strong>Αναδρομικές σχέσεις.</strong> Κάθε μονοπάτι από το <InlineMath>{'x'}</InlineMath> ξεκινά με μία ακμή <InlineMath>{'(x, y)'}</InlineMath> και συνεχίζει με ένα μονοπάτι από το <InlineMath>{'y'}</InlineMath>:</p>
        <BlockMath>{'count[x] = \\sum_{y:\\,(x,y)\\in E} count[y], \\qquad count[t] = 1'}</BlockMath>
        <BlockMath>{'sum[x] = \\sum_{y:\\,(x,y)\\in E} \\bigl(count[y]\\cdot w(x,y) + sum[y]\\bigr), \\qquad sum[t] = 0'}</BlockMath>
        <p>Στο <InlineMath>{'sum[x]'}</InlineMath>: η ακμή <InlineMath>{'(x,y)'}</InlineMath> με βάρος <InlineMath>{'w(x,y)'}</InlineMath> προστίθεται σε καθένα από τα <InlineMath>{'count[y]'}</InlineMath> μονοπάτια που περνούν από εκεί, και επιπλέον αθροίζονται τα ήδη υπάρχοντα κόστη <InlineMath>{'sum[y]'}</InlineMath>.</p>
        <p><strong>Σειρά υπολογισμού.</strong> Αφού ο γράφος είναι ακυκλικός, κάνουμε <strong>τοπολογική ταξινόμηση</strong> και επεξεργαζόμαστε τις κορυφές με αντίστροφη σειρά — ξεκινώντας από το <InlineMath>{'t'}</InlineMath> και προχωρώντας προς το <InlineMath>{'s'}</InlineMath> — ώστε όταν φτάνουμε σε μια κορυφή, οι διάδοχοί της να έχουν ήδη υπολογιστεί.</p>
        <p><strong>Απάντηση & πολυπλοκότητα.</strong> Το ζητούμενο μέσο κόστος είναι ο λόγος <InlineMath>{'sum[s] / count[s]'}</InlineMath>. Κάθε κορυφή και κάθε ακμή εξετάζεται σταθερό αριθμό φορών → <InlineMath>{'\\Theta(V + E)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-8-ask2',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 2 — Βέλτιστη ευθυγράμμιση αλληλουχιών DNA',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #8',
    problemNumber: 'Άσκηση 2',
    difficulty: 'medium',
    prerequisites: ['lectures/L16-dp-iii'],
    statement: (
      <>
        <p>Έχουμε 2 αλληλουχίες DNA και θέλουμε να τις ευθυγραμμίσουμε με τον καλύτερο δυνατό τρόπο, βάσει των τιμών: ταύτιση (ίδια βάση) <InlineMath>{'+1'}</InlineMath>· μη-ταύτιση (διαφορετική βάση) <InlineMath>{'-1'}</InlineMath>· κενό <InlineMath>{'-2'}</InlineMath>. Δίνονται <InlineMath>{'x = \\text{ATGGCA}'}</InlineMath> και <InlineMath>{'y = \\text{TCTATGG}'}</InlineMath>.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η ιδέα.</strong> Είναι παραλλαγή του προβλήματος <em>edit distance / longest common subsequence</em>: χτίζουμε έναν δισδιάστατο πίνακα <InlineMath>{'M'}</InlineMath> όπου το <InlineMath>{'M[i][j]'}</InlineMath> κρατά τη βέλτιστη βαθμολογία ευθυγράμμισης του προθέματος <InlineMath>{'y[1..i]'}</InlineMath> με το πρόθεμα <InlineMath>{'x[1..j]'}</InlineMath>.</p>
        <p><strong>Αρχικοποίηση.</strong> <InlineMath>{'M[0][0] = 0'}</InlineMath>. Η πρώτη γραμμή/στήλη αντιστοιχεί σε «όλα κενά»: <InlineMath>{'M[0][j] = -2j'}</InlineMath> και <InlineMath>{'M[i][0] = -2i'}</InlineMath>.</p>
        <p><strong>Αναδρομική σχέση.</strong> Για κάθε θέση <InlineMath>{'(i, j)'}</InlineMath> έχουμε τρεις κινήσεις και κρατάμε την καλύτερη:</p>
        <BlockMath>{'M[i][j] = \\max\\begin{cases} M[i-1][j-1] + \\sigma(y_i, x_j) & \\text{(ταύτιση/μη-ταύτιση)} \\\\ M[i-1][j] - 2 & \\text{(κενό στο } x) \\\\ M[i][j-1] - 2 & \\text{(κενό στο } y) \\end{cases}'}</BlockMath>
        <p>όπου <InlineMath>{'\\sigma = +1'}</InlineMath> αν <InlineMath>{'y_i = x_j'}</InlineMath>, αλλιώς <InlineMath>{'-1'}</InlineMath>. Διασχίζουμε τον πίνακα από πάνω-αριστερά προς κάτω-δεξιά και σε κάθε κελί κρατάμε «βελάκι» προς το κελί που έδωσε το μέγιστο, για την οπισθοδρόμηση.</p>
        <p><strong>Αποτέλεσμα.</strong> Η βέλτιστη βαθμολογία βρίσκεται στο κάτω-δεξιά κελί <InlineMath>{'M[7][6]'}</InlineMath>· για τις δοθείσες αλληλουχίες ισούται με <InlineMath>{'-6'}</InlineMath>. Ακολουθώντας τα βελάκια ανάποδα ως το <InlineMath>{'(0,0)'}</InlineMath> ανακτούμε την (ή τις) βέλτιστη ευθυγράμμιση — μία απ’ αυτές βάζει κενά ώστε να ευθυγραμμιστεί το κοινό κομμάτι <InlineMath>{'\\text{TGG}'}</InlineMath>.</p>
        <p><strong>Πολυπλοκότητα.</strong> Ο πίνακας έχει <InlineMath>{'(|y|+1)(|x|+1)'}</InlineMath> κελιά και κάθε κελί υπολογίζεται σε <InlineMath>{'O(1)'}</InlineMath> → <InlineMath>{'O(|x|\\cdot|y|)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-8-ask3',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 3 — Τεμαχισμός ράβδου (rod cutting)',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #8',
    problemNumber: 'Άσκηση 3',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Το πρόβλημα τεμαχισμού μιας ράβδου: δίνεται μια ράβδος <InlineMath>{'n'}</InlineMath> cm και το κέρδος πώλησης για κάθε δυνατό μήκος τμήματος. Να δοθεί αλγόριθμος που βρίσκει τον πιο επικερδή τρόπο τεμαχισμού της ράβδου.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η αρχή της βέλτιστης υποδομής.</strong> Αν κόψουμε από μια ράβδο μήκους <InlineMath>{'i'}</InlineMath> ένα πρώτο κομμάτι μήκους <InlineMath>{'k'}</InlineMath>, το υπόλοιπο μήκους <InlineMath>{'i - k'}</InlineMath> πρέπει κι αυτό να τεμαχιστεί <em>βέλτιστα</em>. Άρα η βέλτιστη λύση εμπεριέχει βέλτιστες λύσεις υποπροβλημάτων.</p>
        <p><strong>Αναδρομική σχέση.</strong> Έστω <InlineMath>{'C(i)'}</InlineMath> = το μέγιστο κέρδος από ράβδο μήκους <InlineMath>{'i'}</InlineMath>, και <InlineMath>{'V_k'}</InlineMath> = η τιμή πώλησης ενός τμήματος μήκους <InlineMath>{'k'}</InlineMath>. Δοκιμάζουμε όλα τα δυνατά «πρώτα κομμάτια»:</p>
        <BlockMath>{'C(i) = \\max_{1 \\le k \\le i}\\bigl(V_k + C(i-k)\\bigr), \\qquad C(0) = 0'}</BlockMath>
        <p><strong>Παράδειγμα.</strong> Τιμές ανά μήκος <InlineMath>{'1..8'}</InlineMath>: <InlineMath>{'V = (1, 5, 8, 9, 10, 17, 17, 20)'}</InlineMath>. Γεμίζοντας τον πίνακα «από κάτω προς τα πάνω» προκύπτει <InlineMath>{'C = (1, 5, 8, 10, 13, 17, 18, 22)'}</InlineMath>. Για ράβδο <InlineMath>{'8'}</InlineMath> cm το μέγιστο κέρδος είναι <InlineMath>{'C(8) = 22'}</InlineMath>, που επιτυγχάνεται με <InlineMath>{'k = 6'}</InlineMath>: <InlineMath>{'V_6 + C(2) = 17 + 5 = 22'}</InlineMath> — δηλαδή κόβουμε τη ράβδο σε ένα κομμάτι <InlineMath>{'6'}</InlineMath> cm και ένα <InlineMath>{'2'}</InlineMath> cm.</p>
        <p><strong>Πολυπλοκότητα.</strong> Για κάθε μήκος <InlineMath>{'i'}</InlineMath> δοκιμάζουμε <InlineMath>{'i'}</InlineMath> τιμές του <InlineMath>{'k'}</InlineMath>, καθεμία σε <InlineMath>{'O(1)'}</InlineMath> → συνολικά <InlineMath>{'O(n^2)'}</InlineMath>.</p>
      </>
    ),
  },
  {
    id: 'front-set-8-ask4',
    title: 'Φροντιστηριακό Σετ #8 · Άσκηση 4 — Άνοιγμα εστιατορίων κατά μήκος δρόμου',
    topic: 'dp',
    origin: 'frontistirio',
    paperLabel: 'Φροντιστηριακό Σετ #8',
    problemNumber: 'Άσκηση 4',
    difficulty: 'medium',
    prerequisites: ['lectures/L14-dp-i'],
    statement: (
      <>
        <p>Σκέφτεστε να ανοίξετε μια σειρά εστιατορίων κατά μήκος ενός αυτοκινητόδρομου. Οι <InlineMath>{'n'}</InlineMath> πιθανές τοποθεσίες σχηματίζουν ευθεία γραμμή, με αποστάσεις από την αρχή (σε χιλιόμετρα, κατά αύξουσα σειρά) <InlineMath>{'m_1, m_2, \\dots, m_n'}</InlineMath>. Σε κάθε τοποθεσία μπορείτε να ανοίξετε το πολύ ένα εστιατόριο· το προσδοκώμενο κέρδος από το άνοιγμα στην τοποθεσία <InlineMath>{'i'}</InlineMath> είναι <InlineMath>{'p_i > 0'}</InlineMath>. Δύο οποιαδήποτε εστιατόρια πρέπει να απέχουν τουλάχιστον <InlineMath>{'k'}</InlineMath> μίλια. Δώστε αποδοτικό αλγόριθμο για τον υπολογισμό του μέγιστου συνολικού κέρδους.</p>
      </>
    ),
    solution: (
      <>
        <p><strong>Η ιδέα.</strong> Για κάθε τοποθεσία υπάρχουν δύο επιλογές — ανοίγουμε ή όχι εστιατόριο — και η απόφαση εξαρτάται από προηγούμενες αποφάσεις (ο περιορισμός απόστασης). Κλασικός δυναμικός προγραμματισμός.</p>
        <p><strong>Αναδρομική σχέση.</strong> Έστω <InlineMath>{'D(i)'}</InlineMath> = το μέγιστο κέρδος λαμβάνοντας υπόψη μόνο τις τοποθεσίες <InlineMath>{'1, \\dots, i'}</InlineMath>. Για την τοποθεσία <InlineMath>{'i'}</InlineMath>:</p>
        <ul>
          <li>Δεν ανοίγουμε εκεί → το κέρδος είναι <InlineMath>{'D(i-1)'}</InlineMath>.</li>
          <li>Ανοίγουμε εκεί → κερδίζουμε <InlineMath>{'p_i'}</InlineMath>, αλλά το προηγούμενο εστιατόριο πρέπει να είναι σε τοποθεσία <InlineMath>{'j'}</InlineMath> με <InlineMath>{'m_i - m_j \\ge k'}</InlineMath>. Παίρνουμε το μεγαλύτερο τέτοιο <InlineMath>{'j'}</InlineMath> και προσθέτουμε <InlineMath>{'D(j)'}</InlineMath>.</li>
        </ul>
        <BlockMath>{'D(i) = \\max\\bigl(D(i-1),\\; p_i + D(j)\\bigr)'}</BlockMath>
        <p>όπου <InlineMath>{'j'}</InlineMath> είναι η κοντινότερη προς το <InlineMath>{'i'}</InlineMath> τοποθεσία με απόσταση <InlineMath>{'\\ge k'}</InlineMath>. Αφού οι αποστάσεις <InlineMath>{'m_1 < m_2 < \\dots'}</InlineMath> είναι ταξινομημένες, το <InlineMath>{'j'}</InlineMath> βρίσκεται με <strong>δυαδική αναζήτηση</strong>.</p>
        <p><strong>Παράδειγμα.</strong> <InlineMath>{'m = (5, 10, 20, 25, 40, 50)'}</InlineMath>, <InlineMath>{'p = (10, 30, 20, 50, 60, 40)'}</InlineMath>, <InlineMath>{'k = 15'}</InlineMath>. Υπολογίζοντας: <InlineMath>{'D(1)=10'}</InlineMath>, <InlineMath>{'D(2)=30'}</InlineMath>, <InlineMath>{'D(3)=30'}</InlineMath>, <InlineMath>{'D(4)=80'}</InlineMath>, <InlineMath>{'D(5)=140'}</InlineMath>, <InlineMath>{'D(6)=140'}</InlineMath>. Το μέγιστο κέρδος είναι <InlineMath>{'140'}</InlineMath>, με εστιατόρια στις τοποθεσίες <InlineMath>{'2, 4, 5'}</InlineMath>.</p>
        <p><strong>Πολυπλοκότητα.</strong> <InlineMath>{'O(n)'}</InlineMath> υποπροβλήματα, καθένα με μία δυαδική αναζήτηση <InlineMath>{'O(\\log n)'}</InlineMath> → συνολικά <InlineMath>{'O(n \\log n)'}</InlineMath>.</p>
      </>
    ),
  },
  // ═══════════════════════════════════════════════════════════════════════
  // Παλαιά θέματα — υπό μεταγραφή (ανωνυμοποιημένα)
  // Τα Παλαιά Θέματα #1–#7 έχουν μεταγραφεί ανά διάλεξη· τα παρακάτω εκκρεμούν.
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'exam-sept-2022',
    title: 'Παλαιό Θέμα #8 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #8',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2021',
    title: 'Παλαιό Θέμα #9 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #9',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2020',
    title: 'Παλαιό Θέμα #10 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #10',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-distance-2020',
    title: 'Παλαιό Θέμα #11 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #11',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2019',
    title: 'Παλαιό Θέμα #12 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #12',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2018',
    title: 'Παλαιό Θέμα #13 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #13',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2017',
    title: 'Παλαιό Θέμα #14 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #14',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2017',
    title: 'Παλαιό Θέμα #15 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #15',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2016',
    title: 'Παλαιό Θέμα #16 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #16',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-feb-2016',
    title: 'Παλαιό Θέμα #17 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #17',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2015',
    title: 'Παλαιό Θέμα #18 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #18',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2012',
    title: 'Παλαιό Θέμα #19 — υπό μεταγραφή',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #19',
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
    statement: null,
    solution: null,
  },
  {
    id: 'exam-sept-2011',
    title: 'Παλαιό Θέμα #20 — υπό μεταγραφή',
    topic: 'dp',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #20',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2011',
    title: 'Παλαιό Θέμα #21 — υπό μεταγραφή',
    topic: 'graphs',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #21',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-june-2010',
    title: 'Παλαιό Θέμα #22 — υπό μεταγραφή',
    topic: 'greedy',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #22',
    difficulty: 'hard',
    prerequisites: ALL_LECTURES,
    statement: null,
    solution: null,
  },
  {
    id: 'exam-midterm-2008',
    title: 'Παλαιό Θέμα #23 — υπό μεταγραφή',
    topic: 'divide-conquer',
    origin: 'past-exam',
    paperLabel: 'Παλαιό Θέμα #23',
    difficulty: 'medium',
    prerequisites: [
      'lectures/L01-eisagogika',
      'lectures/L02-asymptotic-analysis',
      'lectures/L03-divide-and-conquer-i',
      'lectures/L04-divide-and-conquer-ii',
      'lectures/L05-divide-and-conquer-iii',
      'lectures/L06-graphs-i',
    ],
    statement: null,
    solution: null,
  },
]
