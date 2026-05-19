/**
 * Single source of truth for site navigation.
 *
 * Each `Chapter` is a top-level group in the sidebar (Asymptotic Analysis,
 * Divide & Conquer, Graphs, etc.). Each `Section` is one MDX page.
 * `slug` here matches the route segment (e.g. "lectures/L03-divide-and-conquer-i"
 * → /lectures/L03-divide-and-conquer-i).
 *
 * Lecture slugs follow the convention `lectures/LNN-english-topic`. The
 * `LNN-` prefix encodes the source PDF in `material/Notes2026/`.
 */

export type Section = {
  slug: string
  title: string
  /** When false, the link still renders but as a "coming soon" / disabled item. */
  available: boolean
  /** Rough exam weight, used for the home-page priority chips. */
  examWeight?: number
  prerequisites?: string[]
  /**
   * Subgroup within a chapter. `undefined` (default) = main flow content.
   * `'reference'` = quick-reference / lookup pages, rendered separately in
   * the sidebar so the linear flow stays clean.
   */
  group?: 'reference'
  /** Filename in /public/material/Notes2026 — used by the lecture's SourceDoc. */
  pdf?: string
}

export type Chapter = {
  id: string
  title: string
  /** Short Greek-friendly tagline shown under the chapter title in the sidebar. */
  blurb?: string
  sections: Section[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: '1. Intro',
    blurb: 'Τι είναι αλγόριθμος, πώς τον αναλύουμε',
    sections: [
      {
        slug: 'lectures/L01-eisagogika',
        title: 'L01 · Εισαγωγικά',
        available: true,
        examWeight: 2,
        pdf: 'L01 - Εισαγωγικά.pdf',
      },
    ],
  },
  {
    id: 'asymptotics',
    title: '2. Asymptotic analysis',
    blurb: 'O, Θ, Ω — η γλώσσα της πολυπλοκότητας',
    sections: [
      {
        slug: 'lectures/L02-asymptotic-analysis',
        title: 'L02 · Ασυμπτωτική Ανάλυση',
        available: true,
        examWeight: 8,
        prerequisites: ['lectures/L01-eisagogika'],
        pdf: 'L02 - Ασυμπτωτική Ανάλυση.pdf',
      },
    ],
  },
  {
    id: 'divide-conquer',
    title: '3. Divide & Conquer',
    blurb: 'Διαίρει και κυρίευε — από mergesort μέχρι closest pair',
    sections: [
      {
        slug: 'lectures/L03-divide-and-conquer-i',
        title: 'L03 · D&C I — Mergesort, master theorem',
        available: true,
        examWeight: 6,
        prerequisites: ['lectures/L02-asymptotic-analysis'],
        pdf: 'L03 - Διαίρει και Κυρίευε Ι (Συγχωνευτική Ταξινόμηση, Αναδρομικές Σχέσεις και Master Theorem).pdf',
      },
      {
        slug: 'lectures/L04-divide-and-conquer-ii',
        title: 'L04 · D&C II — Inversions, dominant colour, multiplication',
        available: true,
        examWeight: 5,
        prerequisites: ['lectures/L03-divide-and-conquer-i'],
        pdf: 'L04 - Διαίρει και Κυρίευε ΙΙ (Μέτρηση Αντιστροφών, Κυρίαρχο Χρώμα και Πολλαπλασιασμός).pdf',
      },
      {
        slug: 'lectures/L05-divide-and-conquer-iii',
        title: 'L05 · D&C III — Closest pair of points',
        available: true,
        examWeight: 4,
        prerequisites: ['lectures/L04-divide-and-conquer-ii'],
        pdf: 'L05 - Διαίρει και Κυρίευε ΙΙΙ (Πλησιέστερο Ζεύγος Σημείων).pdf',
      },
    ],
  },
  {
    id: 'graphs',
    title: '4. Graphs',
    blurb: 'BFS, DFS, SCC, topo, shortest paths, MST',
    sections: [
      {
        slug: 'lectures/L06-graphs-i',
        title: 'L06 · Γραφήματα I — αναπαράσταση, BFS',
        available: true,
        examWeight: 8,
        prerequisites: ['lectures/L02-asymptotic-analysis'],
        pdf: 'L06 - Αλγόριθμοι σε Γραφήματα Ι.pdf',
      },
      {
        slug: 'lectures/L07-graphs-ii',
        title: 'L07 · Γραφήματα II — DFS, τοπολογική, SCC',
        available: true,
        examWeight: 10,
        prerequisites: ['lectures/L06-graphs-i'],
        pdf: 'L07 - Αλγόριθμοι σε Γραφήματα ΙΙ.pdf',
      },
      {
        slug: 'lectures/L08-graphs-iii',
        title: 'L08 · Γραφήματα III — shortest paths (Dijkstra, Bellman-Ford)',
        available: true,
        examWeight: 10,
        prerequisites: ['lectures/L07-graphs-ii'],
        pdf: 'L08 - Αλγόριθμοι σε Γραφήματα ΙIΙ.pdf',
      },
      {
        slug: 'lectures/L09-graphs-iv',
        title: 'L09 · Γραφήματα IV — MST (Prim, Kruskal)',
        available: true,
        examWeight: 8,
        prerequisites: ['lectures/L08-graphs-iii'],
        pdf: 'L09 - Αλγόριθμοι σε Γραφήματα ΙV.pdf',
      },
    ],
  },
  {
    id: 'data-structures',
    title: '5. Data structures',
    blurb: 'Heaps, BSTs, union-find — τα εργαλεία πίσω από όλα',
    sections: [
      {
        slug: 'lectures/L10-data-structures',
        title: 'L10 · Δομές Δεδομένων',
        available: true,
        examWeight: 5,
        prerequisites: ['lectures/L02-asymptotic-analysis'],
        pdf: 'L10 - Δομές Δεδομένων.pdf',
      },
    ],
  },
  {
    id: 'greedy',
    title: '6. Greedy',
    blurb: 'Άπληστοι αλγόριθμοι — exchange argument',
    sections: [
      {
        slug: 'lectures/L11-greedy-i',
        title: 'L11 · Άπληστοι I — interval scheduling, exchange argument',
        available: true,
        examWeight: 7,
        prerequisites: ['lectures/L02-asymptotic-analysis'],
        pdf: 'L11 - Άπληστοι Αλγόριθμοι.pdf',
      },
      {
        slug: 'lectures/L12-greedy-ii',
        title: 'L12 · Άπληστοι II — Huffman, κωδικοποίηση',
        available: true,
        examWeight: 5,
        prerequisites: ['lectures/L11-greedy-i'],
        pdf: 'L12 - Άπληστοι Αλγόριθμοι II.pdf',
      },
      {
        slug: 'lectures/L13-greedy-iii',
        title: 'L13 · Άπληστοι III',
        available: true,
        examWeight: 4,
        prerequisites: ['lectures/L12-greedy-ii'],
        pdf: 'L13 - Άπληστοι Αλγόριθμοι III.pdf',
      },
    ],
  },
  {
    id: 'dp',
    title: '7. Dynamic programming',
    blurb: 'Δυναμικός προγραμματισμός — από memoization σε bottom-up',
    sections: [
      {
        slug: 'lectures/L14-dp-i',
        title: 'L14 · DP I — η ιδέα + 1D προβλήματα',
        available: true,
        examWeight: 8,
        prerequisites: ['lectures/L02-asymptotic-analysis'],
        pdf: 'L14 - Δυναμικός Προγραμματισμός Ι.pdf',
      },
      {
        slug: 'lectures/L15-dp-ii',
        title: 'L15 · DP II — knapsack family',
        available: true,
        examWeight: 7,
        prerequisites: ['lectures/L14-dp-i'],
        pdf: 'L15 - Δυναμικός Προγραμματισμός ΙI.pdf',
      },
      {
        slug: 'lectures/L16-dp-iii',
        title: 'L16 · DP III — LCS, edit distance',
        available: true,
        examWeight: 7,
        prerequisites: ['lectures/L15-dp-ii'],
        pdf: 'L16 - Δυναμικός Προγραμματισμός ΙII.pdf',
      },
      {
        slug: 'lectures/L17-dp-iv',
        title: 'L17 · DP IV — DP σε γραφήματα',
        available: true,
        examWeight: 6,
        prerequisites: ['lectures/L16-dp-iii', 'lectures/L09-graphs-iv'],
        pdf: 'L17 - Δυναμικός Προγραμματισμός ΙV.pdf',
      },
    ],
  },
  {
    id: 'exam',
    title: '8. Exam prep',
    blurb: 'Παλιά θέματα & σωσε-το-εξάμηνο',
    sections: [
      {
        slug: 'practice/sose-to-eksamino',
        title: '🔥 Σώσε το εξάμηνο',
        available: true,
      },
      { slug: 'practice', title: 'Practice hub', available: true },
      { slug: 'formulas', title: 'Cheat sheet (O/Θ/Ω, master theorem)', available: true },
    ],
  },
]

export const ALL_SECTIONS: Section[] = CHAPTERS.flatMap((c) => c.sections)

export function findSection(slug: string): Section | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug)
}

/** Total count of sections that are actually available (have a real page). */
export const AVAILABLE_COUNT = ALL_SECTIONS.filter((s) => s.available).length

/** Convenience: just the lecture sections, in order. */
export const LECTURES: Section[] = CHAPTERS.filter(
  (c) => !['exam'].includes(c.id),
).flatMap((c) => c.sections)
