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
  | 'sampling'

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

export const TOPIC_LABELS: Record<Topic, string> = {
  foundations: 'Foundations',
  modulation: 'Modulation (bridge)',
  am: 'AM',
  fm: 'FM / PM',
  random: 'Random processes',
  noise: 'Noise',
  sampling: 'Sampling',
}

export const TOPIC_COLORS: Record<Topic, string> = {
  foundations: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  modulation: 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  am: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  fm: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  random: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  noise: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  sampling: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300',
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
  'foundations/signals': 'Σήματα',
  'foundations/systems': 'Συστήματα & convolution',
  'foundations/fourier-series': 'Fourier series',
  'foundations/fourier-transform': 'Fourier transform',
  'foundations/filters': 'Φίλτρα',
  'foundations/sampling-theorem': 'Sampling theorem',
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
}
