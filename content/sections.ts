/**
 * Single source of truth for site navigation.
 *
 * Each `Chapter` is a top-level group in the sidebar (Foundations, Randomness, etc.).
 * Each `Section` is one MDX page. `slug` here matches the route segment
 * (e.g. "foundations/signals" → /foundations/signals).
 *
 * Add new sections here when you create their MDX page.
 */

export type Section = {
  slug: string
  title: string
  /** When false, the link still renders but as a "coming soon" / disabled item. */
  available: boolean
  examWeight?: number
  prerequisites?: string[]
  /**
   * Subgroup within a chapter. `undefined` (default) = main flow content.
   * `'reference'` = quick-reference / lookup pages, rendered separately in
   * the sidebar so the linear flow stays clean.
   */
  group?: 'reference'
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
    blurb: 'Why we study communications',
    sections: [
      { slug: 'intro', title: 'Τι είναι ένα σύστημα επικοινωνιών', available: true },
    ],
  },
  {
    id: 'foundations',
    title: '2. Foundations',
    blurb: 'SP1 από την αρχή, σωστά',
    sections: [
      { slug: 'foundations/signals', title: 'Σήματα', available: true },
      { slug: 'foundations/systems', title: 'Συστήματα & convolution', available: true },
      { slug: 'foundations/fourier-series', title: 'Fourier series', available: true },
      { slug: 'foundations/fourier-transform', title: 'Fourier transform', available: true, examWeight: 18 },
      { slug: 'foundations/filters', title: 'Φίλτρα', available: true, examWeight: 5 },
      { slug: 'foundations/sampling-theorem', title: 'Sampling theorem', available: true, examWeight: 1 },
      {
        slug: 'foundations/signal-transformations',
        title: 'Μετασχηματισμοί σήματος',
        available: true,
        group: 'reference',
      },
      {
        slug: 'reference/complex-numbers',
        title: 'Μιγαδικοί αριθμοί',
        available: true,
        group: 'reference',
      },
      {
        slug: 'reference/spectrum-conventions',
        title: 'Συμβάσεις φάσματος',
        available: true,
        group: 'reference',
      },
    ],
  },
  {
    id: 'randomness',
    title: '3. Randomness',
    blurb: 'Πιθανότητα στα σήματα',
    sections: [
      { slug: 'randomness/why', title: 'Γιατί χρειαζόμαστε πιθανότητα', available: true, examWeight: 1 },
      { slug: 'randomness/random-variables', title: 'Random variables', available: true, examWeight: 1 },
      { slug: 'randomness/random-processes', title: 'Random processes', available: true, examWeight: 2 },
      { slug: 'randomness/stationarity', title: 'Stationarity & ergodicity', available: true, examWeight: 2 },
      { slug: 'randomness/psd', title: 'Power spectral density', available: true, examWeight: 3 },
    ],
  },
  {
    id: 'noise',
    title: '4. Noise',
    blurb: 'Από πού έρχεται ο θόρυβος',
    sections: [
      { slug: 'noise/sources', title: 'Πηγές θορύβου', available: true, examWeight: 3 },
      { slug: 'noise/white-noise', title: 'White noise', available: true, examWeight: 4 },
      { slug: 'noise/through-filters', title: 'Θόρυβος μέσα από φίλτρα', available: true, examWeight: 4 },
      { slug: 'noise/snr', title: 'SNR', available: true, examWeight: 3 },
    ],
  },
  {
    id: 'modulation',
    title: '5. Modulation',
    blurb: 'Η γέφυρα από Foundations στη διαμόρφωση',
    sections: [
      { slug: 'modulation/bridge', title: 'Bandpass & I/Q canonical form', available: true, examWeight: 5 },
    ],
  },
  {
    id: 'am',
    title: '6. AM',
    blurb: 'Amplitude modulation',
    sections: [
      { slug: 'am/overview', title: 'AM Overview', available: true, examWeight: 5 },
      { slug: 'am/conventional', title: 'Conventional AM', available: true, examWeight: 15 },
      { slug: 'am/dsb-sc', title: 'DSB-SC', available: true, examWeight: 5 },
      { slug: 'am/ssb', title: 'SSB', available: true, examWeight: 5 },
      { slug: 'am/vsb', title: 'VSB', available: true, examWeight: 2 },
      { slug: 'am/modulator-demodulator', title: 'Modulator & Demodulator + AM in noise', available: true, examWeight: 8 },
      { slug: 'am/multiplexing', title: 'Multiplexing (FDM)', available: true, examWeight: 5 },
    ],
  },
  {
    id: 'fm',
    title: '7. FM',
    blurb: 'Frequency modulation',
    sections: [
      { slug: 'fm/idea', title: 'Η ιδέα του FM + modulation index β', available: true, examWeight: 8 },
      { slug: 'fm/pm', title: 'PM + δυϊκότητα με FM', available: true, examWeight: 2 },
      { slug: 'fm/bessel', title: 'Bessel expansion + sidebands', available: true, examWeight: 10 },
      { slug: 'fm/carson', title: "Carson's rule + NBFM vs WBFM", available: true, examWeight: 5 },
      { slug: 'fm/in-noise', title: 'FM στον θόρυβο + vs AM', available: true, examWeight: 5 },
    ],
  },
  {
    id: 'digital',
    title: '8. Digital transmission',
    blurb: 'Light coverage',
    sections: [{ slug: 'digital/intro', title: 'Εισαγωγή', available: false }],
  },
  {
    id: 'exam',
    title: '9. Exam prep',
    blurb: 'Παλιά θέματα & tips',
    sections: [
      { slug: 'practice', title: 'Practice hub', available: true },
      { slug: 'formulas', title: 'Formula sheet', available: true },
    ],
  },
]

export const ALL_SECTIONS: Section[] = CHAPTERS.flatMap((c) => c.sections)

export function findSection(slug: string): Section | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug)
}

/** Total count of sections that are actually available (have a real page). */
export const AVAILABLE_COUNT = ALL_SECTIONS.filter((s) => s.available).length
