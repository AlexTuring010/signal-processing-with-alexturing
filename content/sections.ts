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
      { slug: 'intro/big-picture', title: 'Η μεγάλη εικόνα', available: false },
      { slug: 'intro/how-to-use', title: 'Πώς να χρησιμοποιήσεις τον οδηγό', available: false },
    ],
  },
  {
    id: 'foundations',
    title: '2. Foundations',
    blurb: 'SP1 από την αρχή, σωστά',
    sections: [
      { slug: 'foundations/signals', title: 'Σήματα', available: true },
      { slug: 'foundations/frequency', title: 'Συχνότητα', available: false },
      { slug: 'foundations/fourier-series', title: 'Fourier series', available: false },
      { slug: 'foundations/fourier-transform', title: 'Fourier transform', available: false },
      { slug: 'foundations/convolution', title: 'Convolution', available: false },
      { slug: 'foundations/lti-systems', title: 'LTI συστήματα & filters', available: false },
      { slug: 'foundations/sampling-light', title: 'Sampling — εισαγωγή', available: false },
    ],
  },
  {
    id: 'randomness',
    title: '3. Randomness',
    blurb: 'Πιθανότητα στα σήματα',
    sections: [
      { slug: 'randomness/why', title: 'Γιατί χρειαζόμαστε πιθανότητα', available: false },
      { slug: 'randomness/random-variables', title: 'Random variables', available: false },
      { slug: 'randomness/random-processes', title: 'Random processes', available: false },
      { slug: 'randomness/stationarity', title: 'Stationarity & autocorrelation', available: false },
      { slug: 'randomness/psd', title: 'Power spectral density', available: false },
    ],
  },
  {
    id: 'noise',
    title: '4. Noise',
    blurb: 'Από πού έρχεται ο θόρυβος',
    sections: [
      { slug: 'noise/sources', title: 'Πηγές θορύβου', available: false },
      { slug: 'noise/white-noise', title: 'White noise', available: false },
      { slug: 'noise/through-filters', title: 'Θόρυβος μέσα από φίλτρα', available: false },
      { slug: 'noise/snr', title: 'SNR', available: false },
    ],
  },
  {
    id: 'modulation',
    title: '5. Modulation — Why',
    blurb: 'Γιατί διαμορφώνουμε καθόλου',
    sections: [
      { slug: 'modulation/why', title: 'Γιατί modulation', available: false },
      { slug: 'modulation/players', title: 'Carrier, message, modulated signal', available: false },
    ],
  },
  {
    id: 'am',
    title: '6. AM',
    blurb: 'Amplitude modulation',
    sections: [
      { slug: 'am/conventional', title: 'Conventional AM', available: false, examWeight: 15 },
      { slug: 'am/modulation-index', title: 'Modulation index μ', available: false, examWeight: 5 },
      { slug: 'am/power', title: 'Ισχύς & efficiency', available: false, examWeight: 5 },
      { slug: 'am/dsb-sc', title: 'DSB-SC', available: false, examWeight: 5 },
      { slug: 'am/ssb', title: 'SSB', available: false, examWeight: 5 },
      { slug: 'am/demodulation', title: 'Envelope & coherent detection', available: false, examWeight: 5 },
    ],
  },
  {
    id: 'fm',
    title: '7. FM',
    blurb: 'Frequency modulation',
    sections: [
      { slug: 'fm/idea', title: 'Η ιδέα του FM', available: false, examWeight: 5 },
      { slug: 'fm/modulation-index', title: 'Modulation index β', available: false, examWeight: 5 },
      { slug: 'fm/bessel', title: 'Bessel expansion', available: false, examWeight: 5 },
      { slug: 'fm/nbfm-vs-wbfm', title: 'NBFM vs WBFM', available: false, examWeight: 3 },
      { slug: 'fm/carson', title: "Carson's rule", available: false, examWeight: 5 },
      { slug: 'fm/vs-am', title: 'FM vs AM trade-offs', available: false, examWeight: 2 },
    ],
  },
  {
    id: 'sampling',
    title: '8. Sampling & ADC',
    blurb: 'Από συνεχές σε διακριτό',
    sections: [
      { slug: 'sampling/theorem', title: 'Sampling theorem', available: false },
      { slug: 'sampling/aliasing', title: 'Aliasing', available: false },
      { slug: 'sampling/quantization', title: 'Quantization', available: false },
      { slug: 'sampling/dac', title: 'DAC reconstruction', available: false },
    ],
  },
  {
    id: 'digital',
    title: '9. Digital transmission',
    blurb: 'Light coverage',
    sections: [{ slug: 'digital/intro', title: 'Εισαγωγή', available: false }],
  },
  {
    id: 'exam',
    title: '10. Exam prep',
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
