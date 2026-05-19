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
      // Populate from L06-L09 plans.
    ],
  },
  {
    topic: 'data-structures',
    label: 'Δομές δεδομένων',
    entries: [
      // Populate from L10 plan.
    ],
  },
  {
    topic: 'greedy',
    label: 'Άπληστοι αλγόριθμοι',
    entries: [
      // Populate from L11-L13 plans.
    ],
  },
  {
    topic: 'dp',
    label: 'Δυναμικός προγραμματισμός',
    entries: [
      // Populate from L14-L17 plans.
    ],
  },
]
