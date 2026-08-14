/**
 * Shared types for practice exercises and quiz questions.
 *
 * These are the canonical taxonomies used by the topic filter and the
 * "go read this section" cross-links.
 */

import type { ReactNode } from 'react'

export type Topic =
  | 'foundations'
  | 'modulation'
  | 'am'
  | 'fm'
  | 'random'
  | 'noise'

export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Where an exercise comes from. Past-exam problems are the most valuable —
 * the UI prioritises them. AI-generated variations are clearly marked so
 * students don't mistake them for real exam material.
 */
export type Origin = 'past-exam' | 'lecture' | 'ai-generated'

/**
 * Year/source tag for past-exam-derived problems. `undefined` means
 * the exercise is from the lecture deck, not from a past exam.
 */
export type ExamSource =
  | 'sept-2025'
  | 'jan-2026'
  | 'june-2025'
  | 'proodos-a-2025'
  | 'proodos-b-2025'
  | 'proodos-april-2026'
  | 'june-2026'

export const TOPIC_LABELS: Record<Topic, string> = {
  foundations: 'Foundations',
  modulation: 'Modulation (bridge)',
  am: 'AM',
  fm: 'FM / PM',
  random: 'Random processes',
  noise: 'Noise',
}

export const TOPIC_COLORS: Record<Topic, string> = {
  foundations: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  modulation: 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  am: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  fm: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  random: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  noise: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Εύκολο',
  medium: 'Μέτριο',
  hard: 'Δύσκολο',
}

export const SOURCE_LABELS: Record<ExamSource, string> = {
  'sept-2025': 'Σεπτέμβριος 2025',
  'jan-2026': 'Ιανουάριος 2026 (Επί Πτυχίω)',
  'june-2025': 'Ιούνιος 2025',
  'proodos-a-2025': 'Πρόοδος A · Μάιος 2025',
  'proodos-b-2025': 'Πρόοδος B · Μάιος 2025',
  'proodos-april-2026': 'Πρόοδος · Απρίλιος 2026',
  'june-2026': 'Ιούνιος 2026',
}

/**
 * How recent each exam session is — higher is newer.
 *
 * SINGLE SOURCE OF TRUTH. This used to be duplicated in `ExamRadar`,
 * `formula-cited-by` and (as a hand-ordered array) in `ExerciseLibrary`, so
 * adding an exam meant remembering four places and the array wasn't
 * type-checked. Add the new session here and everything downstream follows.
 */
export const SOURCE_RECENCY: Record<ExamSource, number> = {
  'june-2026': 7,
  'proodos-april-2026': 6,
  'jan-2026': 5,
  'sept-2025': 4,
  'june-2025': 3,
  'proodos-b-2025': 2,
  'proodos-a-2025': 1,
}

/** Every exam session, newest first. Derived — never hand-order this. */
export const SOURCES_BY_RECENCY: ExamSource[] = (
  Object.keys(SOURCE_RECENCY) as ExamSource[]
).sort((a, b) => SOURCE_RECENCY[b] - SOURCE_RECENCY[a])

/**
 * The actual scanned paper behind each exam source.
 *
 * This is what makes a source chip clickable: «Ιούνιος 2026» opens
 * `/exams/june-2026` in a new tab so the reader can check a transcribed
 * exercise against the original scan instead of trusting it.
 *
 * `files` are served from `public/exams/` and are generated from the
 * originals in `past_exams/` by `scripts/build-exam-assets.mjs` (which
 * downscales the 12 MP phone photos). Page order matters — index 0 is page 1.
 *
 * Only fields actually printed on the paper are filled in; `duration` and
 * `totalPoints` are omitted where the scan doesn't state them.
 */
export type ExamPaper = {
  kind: 'images' | 'pdf'
  /** Filenames under `/exams/`, in page order. */
  files: string[]
  /** Period + academic year line, as printed on the paper. */
  period: string
  duration?: string
  totalPoints?: number
  /** Set when the scan itself is damaged, so the viewer can say so up front. */
  scanWarning?: string
}

export const EXAM_PAPERS: Record<ExamSource, ExamPaper> = {
  'sept-2025': {
    kind: 'images',
    files: ['sept-2025-p1.jpg'],
    period: 'Εξεταστική Σεπτεμβρίου 2025 · ακ. έτος 2024–2025',
    duration: '2 ώρες',
    totalPoints: 100,
  },
  'jan-2026': {
    kind: 'images',
    files: ['jan-2026-p1.jpg', 'jan-2026-p2.jpg'],
    period: 'Επί πτυχίω εξέταση Ιανουαρίου 2026 · ακ. έτος 2025–2026',
  },
  'june-2025': {
    kind: 'pdf',
    files: ['june-2025-p1.pdf'],
    period: 'Εξεταστική Ιουνίου 2025 · ακ. έτος 2024–2025 · ομάδα Α',
    duration: '2 ώρες',
    totalPoints: 100,
  },
  'proodos-a-2025': {
    kind: 'images',
    files: ['proodos-a-2025-p1.jpg', 'proodos-a-2025-p2.jpg'],
    period: 'Πρόοδος Μαΐου 2025 · ακ. έτος 2024–2025 · ομάδα Α',
    duration: '1 ώρα',
    scanWarning:
      'Το αρχείο της σάρωσης είναι κατεστραμμένο: λείπει το κάτω μέρος και των δύο σελίδων — το ΘΕΜΑ 2 (ερώτημα 3) στη σελίδα 1 και ολόκληρο το ΘΕΜΑ 4 στη σελίδα 2 δεν φαίνονται.',
  },
  'proodos-b-2025': {
    kind: 'images',
    files: ['proodos-b-2025-p1.jpg', 'proodos-b-2025-p2.jpg'],
    period: 'Πρόοδος Μαΐου 2025 · ακ. έτος 2024–2025 · ομάδα Β',
    duration: '1 ώρα',
  },
  'proodos-april-2026': {
    kind: 'images',
    files: ['proodos-april-2026-p1.jpg'],
    period: 'Πρόοδος Απριλίου 2026 · ακ. έτος 2025–2026',
    duration: '1 ώρα',
    totalPoints: 100,
  },
  'june-2026': {
    kind: 'images',
    files: ['june-2026-p1.jpg', 'june-2026-p2.jpg'],
    period: 'Εξεταστική Ιουνίου 2026 · ακ. έτος 2025–2026',
    duration: '2 ώρες',
    totalPoints: 100,
  },
}

/** Public URL of one page of an exam scan. */
export function examPageHref(source: ExamSource, page = 1): string {
  const paper = EXAM_PAPERS[source]
  const file = paper.files[Math.min(Math.max(page, 1), paper.files.length) - 1]
  return `/exams/${file}`
}

export const ORIGIN_LABELS: Record<Origin, string> = {
  'past-exam': 'Παλαιό θέμα',
  lecture: 'Από διαλέξεις',
  'ai-generated': 'AI-generated παραλλαγή',
}

export const ORIGIN_COLORS: Record<Origin, string> = {
  'past-exam': 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  lecture: 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'ai-generated': 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
}

/**
 * A worked exercise — statement + step-by-step solution.
 * Statement is shown by default; Solution appears behind a toggle.
 *
 * NOTE: `statement` and `solution` are ReactNode (already-rendered JSX),
 * not function components — so they can be serialized across the
 * Server-Component boundary and passed into the client `<ExerciseCard>`.
 */
export type Exercise = {
  id: string
  title: string
  topic: Topic
  /** Where this problem comes from. Past-exam problems are surfaced first. */
  origin: Origin
  source?: ExamSource
  /** Problem label, e.g. "ΘΕΜΑ 1.5", "ΘΕΜΑ 4.2". */
  problemNumber?: string
  /**
   * Which page of the scanned paper this problem sits on (1-indexed). Lets the
   * source chip deep-link straight to the right page of `/exams/<source>`
   * instead of dropping the reader at page 1. Defaults to 1 when absent.
   */
  paperPage?: number
  /**
   * Exercises sharing a `repeatGroup` are the same question recurring across
   * exams (sometimes lightly reworded). The card shows an "Επαναλαμβανόμενο
   * θέμα" marker pointing to the other occurrences, so students know the
   * duplication is intentional. Set only on genuine repeats.
   */
  repeatGroup?: string
  /** Weight on the exam, e.g. 10 for "10%". */
  weight?: number
  difficulty: Difficulty
  /** Section slugs the reader needs to know (renders as chips with deep links). */
  prerequisites: string[]
  /**
   * IDs of the formula-sheet entries that are needed to solve this. Used
   * by the assist toggle to highlight relevant formulas in the slide-out
   * formula panel.
   */
  formulaIds?: string[]
  /**
   * When the assist toggle is on and the problem needs something that's
   * NOT in the formula sheet, this note is shown to nudge the student to
   * memorize it.
   */
  memorizationNote?: ReactNode
  statement: ReactNode
  solution: ReactNode
  /**
   * «Σώσε το εξάμηνο» coaching content. These live in `sose-coaching.tsx`
   * and are merged in by `lib/sose.ts` — keeping the canonical exercise
   * definitions free of crunch-mode-specific prose.
   */
}

/**
 * Per-exercise coaching that powers the «Σώσε το εξάμηνο» (crunch) flow.
 * Stored separately from the exercise itself so the canonical definition
 * stays focused on the problem + solution.
 *
 * - `takeaway`: the durable pattern the student should walk away with.
 *   2–3 sentences. NOT a restatement of the solution — the lesson behind it.
 * - `examRadar`: recognition cues. 2–3 sentences. «Αν δεις X στην εκφώνηση,
 *   το πρώτο πράγμα που σκέφτεσαι είναι Y.»
 * - `relatedIds`: optional override of the auto-derived "παρόμοιες" list.
 *   When absent, `findRelated()` derives it from topic + prereq overlap.
 */
export type ExerciseCoaching = {
  takeaway?: ReactNode
  examRadar?: ReactNode
  relatedIds?: string[]
}

/**
 * A T/F or MCQ question for the quiz modes.
 * `correctAnswer` is `boolean` for true-false and `number` (index into
 * `choices`) for multiple-choice.
 */
export type QuizQuestion =
  | {
      id: string
      type: 'true-false'
      topic: Topic
      difficulty: Difficulty
      source?: ExamSource
      prerequisites: string[]
      question: ReactNode
      correctAnswer: boolean
      explanation: ReactNode
    }
  | {
      id: string
      type: 'multiple-choice'
      topic: Topic
      difficulty: Difficulty
      source?: ExamSource
      prerequisites: string[]
      question: ReactNode
      choices: ReactNode[]
      correctAnswer: number
      explanation: ReactNode
    }

/**
 * Section slug → human-readable title + URL. Used by the prerequisite
 * chips so we render "Conventional AM" instead of "am/conventional".
 */
export const SECTION_TITLES: Record<string, string> = {
  intro: 'Εισαγωγή στις επικοινωνίες',
  'foundations/signals': 'Σήματα',
  'foundations/systems': 'Συστήματα & convolution',
  'foundations/fourier-series': 'Fourier series',
  'foundations/fourier-transform': 'Fourier transform',
  'foundations/filters': 'Φίλτρα',
  'modulation/bridge': 'Bandpass & I/Q canonical form',
  'am/overview': 'AM Overview',
  'am/conventional': 'Conventional AM',
  'am/dsb-sc': 'DSB-SC',
  'am/ssb': 'SSB',
  'am/vsb': 'VSB',
  'am/modulator-demodulator': 'AM Modulator/Demodulator',
  'am/multiplexing': 'FDM Multiplexing',
  'fm/idea': 'FM idea + β',
  'fm/pm': 'PM + duality',
  'fm/bessel': 'Bessel sidebands',
  'fm/carson': "Carson's rule",
  'fm/in-noise': 'FM in noise',
  'randomness/why': 'Why randomness',
  'randomness/random-variables': 'Random variables',
  'randomness/random-processes': 'Random processes',
  'randomness/stationarity': 'Stationarity & ergodicity',
  'randomness/psd': 'PSD',
  'noise/sources': 'Noise sources',
  'noise/white-noise': 'White noise',
  'noise/through-filters': 'Noise through filters',
  'noise/snr': 'SNR',
  'reference/complex-numbers': 'Μιγαδικοί αριθμοί',
  'reference/spectrum-conventions': 'Συμβάσεις φάσματος',
  'reference/fourier-pairs': 'Fourier pairs',
  'reference/trig-identities': 'Τριγωνομετρικές ταυτότητες',
  'reference/integrals': 'Βασικά ολοκληρώματα',
  formulas: 'Τυπολόγιο',
  cheatsheet: 'Συνιστώμενη πινακίδα',
}
