/**
 * Cheat sheet — the canonical reference for algorithms exam day.
 *
 * Unlike the SP «τυπολόγιο» (a formula sheet given during the exam), the
 * algorithms exam is closed-book — this is a *study* cheat sheet, not an
 * in-exam handout. It lives at /formulas and is mirrored as a slide-out
 * on /practice via FormulaSheetPanel.
 *
 * Entries have stable IDs (kebab-case, topic-prefixed). Exercises
 * reference them via `formulaIds: ['master-theorem', 'big-o-defn']`.
 *
 * Status: skeleton sections. Populate per-lecture as we move through
 * the syllabus.
 */

import { BlockMath, InlineMath } from '@/components/math'
import type { ReactNode } from 'react'
import type { Topic } from './types'

export type FormulaEntry = {
  id: string
  title: string
  topic: Topic
  /** The math content, rendered. Can also include short prose. */
  content: ReactNode
  /** Section slug where this formula is derived/explained. */
  derivedIn?: string
}

export type FormulaSection = {
  topic: Topic
  label: string
  entries: FormulaEntry[]
}

export const FORMULA_SHEET: FormulaSection[] = [
  {
    topic: 'asymptotics',
    label: 'Ασυμπτωτική ανάλυση',
    entries: [
      {
        id: 'big-o-defn',
        title: 'Ορισμός O, Θ, Ω',
        topic: 'asymptotics',
        derivedIn: 'lectures/L02-asymptotic-analysis',
        content: (
          <>
            <BlockMath>{'f(n) = O(g(n)) \\iff \\exists c,n_0 > 0: f(n) \\le c\\,g(n) \\ \\forall n \\ge n_0'}</BlockMath>
            <BlockMath>{'f(n) = \\Omega(g(n)) \\iff \\exists c,n_0 > 0: f(n) \\ge c\\,g(n) \\ \\forall n \\ge n_0'}</BlockMath>
            <BlockMath>{'f(n) = \\Theta(g(n)) \\iff f = O(g) \\land f = \\Omega(g)'}</BlockMath>
          </>
        ),
      },
      {
        id: 'growth-hierarchy',
        title: 'Ιεραρχία ρυθμού αύξησης',
        topic: 'asymptotics',
        derivedIn: 'lectures/L02-asymptotic-analysis',
        content: (
          <BlockMath>{'1 \\prec \\log\\log n \\prec \\log n \\prec n^\\epsilon \\prec n \\prec n\\log n \\prec n^2 \\prec n^3 \\prec 2^n \\prec n! \\prec n^n'}</BlockMath>
        ),
      },
    ],
  },
  {
    topic: 'divide-conquer',
    label: 'Διαίρει και κυρίευε',
    entries: [
      {
        id: 'master-theorem',
        title: 'Master Theorem',
        topic: 'divide-conquer',
        derivedIn: 'lectures/L03-divide-and-conquer-i',
        content: (
          <>
            <p>
              Για <InlineMath>{'T(n) = aT(n/b) + f(n)'}</InlineMath> με{' '}
              <InlineMath>{'a \\ge 1, b > 1'}</InlineMath>:
            </p>
            <BlockMath>{'\\text{Case 1: } f(n) = O(n^{\\log_b a - \\epsilon}) \\implies T(n) = \\Theta(n^{\\log_b a})'}</BlockMath>
            <BlockMath>{'\\text{Case 2: } f(n) = \\Theta(n^{\\log_b a}) \\implies T(n) = \\Theta(n^{\\log_b a} \\log n)'}</BlockMath>
            <BlockMath>{'\\text{Case 3: } f(n) = \\Omega(n^{\\log_b a + \\epsilon}) \\text{ + regularity} \\implies T(n) = \\Theta(f(n))'}</BlockMath>
          </>
        ),
      },
    ],
  },
  {
    topic: 'graphs',
    label: 'Γραφήματα',
    entries: [
      {
        id: 'dijkstra',
        title: 'Dijkstra — συντομότερες διαδρομές',
        topic: 'graphs',
        derivedIn: 'lectures/L09-graphs-iv',
        content: (
          <>
            <p>
              Άπληστος: επέκτεινε το εξερευνημένο σύνολο <InlineMath>{'S'}</InlineMath> κατά
              την κορυφή με το ελάχιστο{' '}
              <InlineMath>{'\\pi(v) = \\min_{u \\in S}\\{ d(u) + \\ell_{uv} \\}'}</InlineMath>.
            </p>
            <p>
              Με δυαδικό σωρό: <InlineMath>{'O(m \\log n)'}</InlineMath>.{' '}
              <strong>Μόνο για θετικά βάρη.</strong>
            </p>
          </>
        ),
      },
      {
        id: 'mst-cut-property',
        title: 'Ιδιότητα αποκοπής (ΕΕΔ)',
        topic: 'graphs',
        derivedIn: 'lectures/L09-graphs-iv',
        content: (
          <p>
            Για κάθε αποκοπή <InlineMath>{'S \\subset V'}</InlineMath>, η ακμή{' '}
            <strong>ελάχιστου</strong> κόστους στο σύνολο ακμών αποκοπής ανήκει στο ΕΕΔ.
          </p>
        ),
      },
      {
        id: 'mst-cycle-property',
        title: 'Ιδιότητα κύκλου (ΕΕΔ)',
        topic: 'graphs',
        derivedIn: 'lectures/L09-graphs-iv',
        content: (
          <p>
            Για κάθε κύκλο <InlineMath>{'C'}</InlineMath>, η ακμή <strong>μέγιστου</strong>{' '}
            κόστους στον <InlineMath>{'C'}</InlineMath> δεν ανήκει στο ΕΕΔ.
          </p>
        ),
      },
      {
        id: 'prim-kruskal',
        title: 'Prim & Kruskal (ΕΕΔ)',
        topic: 'graphs',
        derivedIn: 'lectures/L09-graphs-iv',
        content: (
          <>
            <p>
              <strong>Prim:</strong> μεγάλωσε ένα δέντρο από μία κορυφή, πρόσθεσε τη
              φθηνότερη ακμή αποκοπής.
            </p>
            <p>
              <strong>Kruskal:</strong> ακμές σε αύξουσα σειρά κόστους, πρόσθεσε αν δεν
              κλείνει κύκλο (με union-find).
            </p>
            <p>
              Και οι δύο: <InlineMath>{'O(m \\log n)'}</InlineMath>.
            </p>
          </>
        ),
      },
    ],
  },
  {
    topic: 'data-structures',
    label: 'Δομές δεδομένων',
    entries: [
      {
        id: 'heap-indices',
        title: 'Δυαδικός σωρός — δείκτες πίνακα',
        topic: 'data-structures',
        derivedIn: 'lectures/L10-data-structures',
        content: (
          <>
            <BlockMath>{'\\text{parent}(i) = \\lfloor i/2 \\rfloor, \\quad \\text{left}(i) = 2i, \\quad \\text{right}(i) = 2i + 1'}</BlockMath>
            <p>
              Ιδιότητα διάταξης:{' '}
              <InlineMath>{'\\text{key}(\\text{parent}) \\le \\text{key}(\\text{child})'}</InlineMath>{' '}
              — η ρίζα είναι το ελάχιστο.
            </p>
          </>
        ),
      },
      {
        id: 'heap-ops',
        title: 'Ουρά προτεραιότητας — πολυπλοκότητες',
        topic: 'data-structures',
        derivedIn: 'lectures/L10-data-structures',
        content: (
          <p>
            <InlineMath>{'\\text{FindMin}'}</InlineMath>: <InlineMath>{'O(1)'}</InlineMath>.{' '}
            <InlineMath>{'\\text{Insert}'}</InlineMath>,{' '}
            <InlineMath>{'\\text{ExtractMin}'}</InlineMath>,{' '}
            <InlineMath>{'\\text{decreaseKey}'}</InlineMath>:{' '}
            <InlineMath>{'O(\\log n)'}</InlineMath> (heapify-up / heapify-down). Heapsort:{' '}
            <InlineMath>{'O(n \\log n)'}</InlineMath>.
          </p>
        ),
      },
      {
        id: 'union-find',
        title: 'Union-Find (ξένα σύνολα)',
        topic: 'data-structures',
        derivedIn: 'lectures/L10-data-structures',
        content: (
          <>
            <p>
              Κάθε σύνολο = κατευθυνόμενο δέντρο με ρίζα = αντιπρόσωπο.{' '}
              <strong>Union by size:</strong> βάθος{' '}
              <InlineMath>{'\\le \\log n'}</InlineMath>.
            </p>
            <p>
              Με <strong>path compression</strong>:{' '}
              <InlineMath>{'O(\\alpha(n))'}</InlineMath> ανά πράξη — πρακτικά σταθερό.
            </p>
          </>
        ),
      },
    ],
  },
  {
    topic: 'greedy',
    label: 'Άπληστοι αλγόριθμοι',
    entries: [
      {
        id: 'interval-scheduling',
        title: 'Χρονοπρογραμματισμός διαστημάτων',
        topic: 'greedy',
        derivedIn: 'lectures/L11-greedy-i',
        content: (
          <p>
            Μέγιστο πλήθος συμβατών εργασιών — κριτήριο:{' '}
            <strong>μικρότερος χρόνος λήξης</strong>. <InlineMath>{'O(n \\log n)'}</InlineMath>.
            Απόδειξη: «ο άπληστος προηγείται».
          </p>
        ),
      },
      {
        id: 'interval-partitioning',
        title: 'Διαμέριση διαστημάτων',
        topic: 'greedy',
        derivedIn: 'lectures/L11-greedy-i',
        content: (
          <p>
            Ελάχιστο πλήθος μηχανών = <strong>βάθος</strong> (μέγιστα ταυτόχρονα
            διαστήματα). Κριτήριο: μικρότερος χρόνος έναρξης.
          </p>
        ),
      },
      {
        id: 'min-lateness',
        title: 'Ελάχιστη μέγιστη καθυστέρηση',
        topic: 'greedy',
        derivedIn: 'lectures/L12-greedy-ii',
        content: (
          <>
            <p>
              Καθυστέρηση{' '}
              <InlineMath>{'\\ell_j = \\max\\{ 0,\\ f_j - d_j \\}'}</InlineMath>. Κριτήριο:{' '}
              <strong>Earliest Deadline First</strong> (αύξουσα προθεσμία).
            </p>
            <p>Απόδειξη: exchange argument — αντιμετάθεση αντιστροφών.</p>
          </>
        ),
      },
      {
        id: 'topological-order',
        title: 'Τοπολογική διάταξη',
        topic: 'greedy',
        derivedIn: 'lectures/L12-greedy-ii',
        content: (
          <p>
            Υπάρχει <strong>αν και μόνο αν</strong> το γράφημα είναι DAG. Αλγόριθμος:
            βγάζε επανειλημμένα κορυφή χωρίς εισερχόμενες ακμές —{' '}
            <InlineMath>{'O(m + n)'}</InlineMath>.
          </p>
        ),
      },
      {
        id: 'huffman',
        title: 'Κωδικοποίηση Huffman',
        topic: 'greedy',
        derivedIn: 'lectures/L13-greedy-iii',
        content: (
          <>
            <p>
              Απροθεματικός κώδικας ελάχιστου κόστους{' '}
              <InlineMath>{'\\text{cost}(c) = \\sum_x f_x \\cdot |c(x)|'}</InlineMath>.
            </p>
            <p>
              Συγχώνευσε επανειλημμένα τους δύο σπανιότερους χαρακτήρες.{' '}
              <InlineMath>{'O(n \\log n)'}</InlineMath>.
            </p>
          </>
        ),
      },
    ],
  },
  {
    topic: 'dp',
    label: 'Δυναμικός προγραμματισμός',
    entries: [
      {
        id: 'dp-recipe',
        title: 'Συνταγή δυναμικού προγραμματισμού',
        topic: 'dp',
        derivedIn: 'lectures/L14-dp-i',
        content: (
          <p>
            <strong>1)</strong> Χαρακτήρισε τη δομή (όρισε υποπρόβλημα).{' '}
            <strong>2)</strong> Αναδρομικός ορισμός της βέλτιστης τιμής.{' '}
            <strong>3)</strong> Υπολόγισε την τιμή (memoization / bottom-up).{' '}
            <strong>4)</strong> Κατασκεύασε τη λύση.
          </p>
        ),
      },
      {
        id: 'weighted-interval-scheduling',
        title: 'Σταθμισμένος χρονοπρογραμματισμός',
        topic: 'dp',
        derivedIn: 'lectures/L14-dp-i',
        content: (
          <>
            <p>
              <InlineMath>{'p(j)'}</InlineMath> = τελευταίο συμβατό προηγούμενο αίτημα.
            </p>
            <BlockMath>{'\\text{OPT}(j) = \\max\\{\\, v_j + \\text{OPT}(p(j)),\\ \\ \\text{OPT}(j-1) \\,\\}'}</BlockMath>
            <p>
              <InlineMath>{'O(n \\log n)'}</InlineMath> με ταξινόμηση κατά χρόνο λήξης.
            </p>
          </>
        ),
      },
      {
        id: 'knapsack',
        title: 'Σακίδιο (0/1 knapsack)',
        topic: 'dp',
        derivedIn: 'lectures/L15-dp-ii',
        content: (
          <>
            <BlockMath>{'\\text{OPT}(i,w) = \\max\\{\\, \\text{OPT}(i-1,w),\\ \\ v_i + \\text{OPT}(i-1,\\,w - w_i) \\,\\}'}</BlockMath>
            <p>
              <InlineMath>{'\\Theta(nW)'}</InlineMath> — ψευδοπολυωνυμικό. Το πρόβλημα
              απόφασης είναι NP-πλήρες.
            </p>
          </>
        ),
      },
      {
        id: 'lcs',
        title: 'Μέγιστη κοινή υπακολουθία (LCS)',
        topic: 'dp',
        derivedIn: 'lectures/L15-dp-ii',
        content: (
          <>
            <BlockMath>{'\\text{OPT}(i,j) = \\begin{cases} 1 + \\text{OPT}(i-1,j-1) & x_i = y_j \\\\ \\max\\{ \\text{OPT}(i-1,j),\\, \\text{OPT}(i,j-1) \\} & x_i \\ne y_j \\end{cases}'}</BlockMath>
            <p>
              Χρόνος <InlineMath>{'\\Theta(mn)'}</InlineMath>.
            </p>
          </>
        ),
      },
      {
        id: 'edit-distance',
        title: 'Απόσταση επεξεργασίας / ευθυγράμμιση',
        topic: 'dp',
        derivedIn: 'lectures/L16-dp-iii',
        content: (
          <>
            <BlockMath>{'\\text{OPT}(i,j) = \\min\\begin{cases} \\alpha_{x_i y_j} + \\text{OPT}(i-1,j-1) \\\\ \\delta + \\text{OPT}(i-1,j) \\\\ \\delta + \\text{OPT}(i,j-1) \\end{cases}'}</BlockMath>
            <p>
              <InlineMath>{'\\Theta(mn)'}</InlineMath> χρόνος· Hirschberg →{' '}
              <InlineMath>{'O(m + n)'}</InlineMath> χώρος.
            </p>
          </>
        ),
      },
      {
        id: 'bellman-ford',
        title: 'Bellman-Ford (αρνητικά βάρη)',
        topic: 'dp',
        derivedIn: 'lectures/L17-dp-iv',
        content: (
          <>
            <p>
              <InlineMath>{'\\text{OPT}(i,v)'}</InlineMath> = συντομότερο{' '}
              <InlineMath>{'v \\to t'}</InlineMath> μονοπάτι με{' '}
              <InlineMath>{'\\le i'}</InlineMath> ακμές.
            </p>
            <BlockMath>{'\\text{OPT}(i,v) = \\min\\{\\, \\text{OPT}(i-1,v),\\ \\ \\min_{(v,w) \\in A}(\\ell_{vw} + \\text{OPT}(i-1,w)) \\,\\}'}</BlockMath>
            <p>
              <InlineMath>{'\\Theta(mn)'}</InlineMath>. Αρνητικός κύκλος ⇒ δεν υπάρχει λύση.
            </p>
          </>
        ),
      },
    ],
  },
]
