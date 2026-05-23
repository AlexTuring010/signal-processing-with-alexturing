/**
 * Curated structure of the Recommended Exam Cheatsheet.
 *
 * Pure view-layer metadata over the SAME `FORMULA_SHEET` data — every
 * `formulaId` here must resolve via `FORMULA_BY_ID`. The cheatsheet is
 * intentionally a *thin* projection: the actual math lives in
 * `content/practice/formulas.tsx`, and this file decides the grouping,
 * ordering, and the few stress-lookup hints (radar phrases + decision
 * aids) that turn a list into a usable exam tool.
 *
 * Design contract (locked 2026-05-23 — see `plans/you-re-picking-up-sleepy-sketch.md`):
 *   - **Two A4 pages, problem-pattern grouping** (not chapter order).
 *   - Page 1 = must-memorize formulas in the order a stressed student
 *     reaches for them: AM family → coherent demod → FM → noise → random.
 *   - Page 2 = clean τυπολόγιο mirror (Fourier + trig + integrals + Bessel).
 *   - Each group has a Greek "radar" line: phrases you might see in the
 *     exam wording that should make you stop and turn to this block.
 *   - Optional per-formula `note` is a 1-line decision aid, not prose.
 */

import type { ReactNode } from 'react'
import { InlineMath } from '@/components/math'
import type { Topic } from './types'

export type CheatsheetFormulaSlot = {
  id: string
  /** 1-line decision aid printed under the formula. Optional. */
  note?: ReactNode
  /** Override the displayed title. Optional — defaults to FormulaEntry.title. */
  shortTitle?: string
}

export type CheatsheetGroup = {
  id: string
  title: string
  topic: Topic
  /** "Όταν δεις... ψάχνεις εδώ" trigger phrases. */
  radar: ReactNode
  /** Formula slots in print-order. */
  slots: CheatsheetFormulaSlot[]
  /** Group-level footnote (a one-line "don't forget" reminder). */
  footnote?: ReactNode
}

export type CheatsheetPage = {
  id: string
  label: string
  kicker: string
  groups: CheatsheetGroup[]
}

/** Compact "Πρώτο πράγμα που σκέφτομαι" decision tree at the top of page 1. */
export type DecisionRow = {
  trigger: ReactNode
  goTo: ReactNode
  target: string
}

export const CHEATSHEET_DECISION_TREE: DecisionRow[] = [
  {
    trigger: <>AM signal — ψάχνεις <InlineMath>{'P, \\eta, \\mu'}</InlineMath></>,
    goTo: <>AM Conventional · <InlineMath>{'\\eta \\le 1/3'}</InlineMath> για tone, <InlineMath>{'\\mu = 1'}</InlineMath></>,
    target: 'g-am-conventional',
  },
  {
    trigger: <>Coherent demod με phase error <InlineMath>{'\\phi'}</InlineMath></>,
    goTo: <>output × <InlineMath>{'\\cos\\phi / 2'}</InlineMath> — μηδέν στα ±90°</>,
    target: 'g-coherent',
  },
  {
    trigger: <>Φάσμα modulated σήματος — multiplication by cosine</>,
    goTo: <>Modulation theorem · <InlineMath>{'\\tfrac{1}{2}[X(f \\mp f_c)]'}</InlineMath></>,
    target: 'g-fourier-props',
  },
  {
    trigger: <>FM, ψάχνεις bandwidth</>,
    goTo: <>Carson · <InlineMath>{'2(\\beta + 1)W'}</InlineMath></>,
    target: 'g-carson',
  },
  {
    trigger: <>FM single-tone, ψάχνεις πλάτη πλευρικών</>,
    goTo: <>Bessel · πίνακας <InlineMath>{'J_n(\\beta)'}</InlineMath></>,
    target: 'g-bessel',
  },
  {
    trigger: <>Θόρυβος μέσα από LTI</>,
    goTo: <><InlineMath>{'S_Y(f) = |H(f)|^2 S_X(f)'}</InlineMath></>,
    target: 'g-noise',
  },
  {
    trigger: <>WSS process, ψάχνεις PSD ή ισχύ</>,
    goTo: <>Wiener-Khinchin · <InlineMath>{'S = \\mathcal{F}\\{R\\}'}</InlineMath></>,
    target: 'g-random',
  },
]

/** "ΔΕΝ ΞΕΧΝΑΩ" — the most common stupid mistakes. */
export type Pitfall = ReactNode

export const CHEATSHEET_PITFALLS: Pitfall[] = [
  <>
    <strong>AM efficiency cap</strong> — <InlineMath>{'\\eta \\le 1/3'}</InlineMath> για tone με{' '}
    <InlineMath>{'\\mu = 1'}</InlineMath>. Ποτέ δεν φτάνει 100%.
  </>,
  <>
    <strong>FM ισχύς = <InlineMath>{'A_c^2/2'}</InlineMath></strong> — ΑΝΕΞΑΡΤΗΤΗ του{' '}
    <InlineMath>\beta</InlineMath>. Το <InlineMath>\beta</InlineMath> αναδιανέμει, δεν προσθέτει.
  </>,
  <>
    <strong>Modulation theorem</strong> δίνει <InlineMath>{'\\tfrac{1}{2}'}</InlineMath>{' '}
    σε ΚΑΘΕ αντίγραφο — μην ξεχάσεις το <InlineMath>{'\\tfrac{1}{2}'}</InlineMath>!
  </>,
  <>
    <strong>FM threshold ~10 dB</strong> — κάτω από αυτό, <InlineMath>{'9\\beta^2'}</InlineMath>{' '}
    gain πάει χαμένο.
  </>,
  <>
    <strong>SSB</strong> = μισό bandwidth ΑΛΛΑ απαιτεί Hilbert + synchronous demod.
  </>,
  <>
    <strong>Coherent demod</strong> πάντα δίνει factor <InlineMath>{'\\tfrac{1}{2}'}</InlineMath>{' '}
    (από <InlineMath>{'\\cos^2'}</InlineMath>). Πολλαπλασίασε με 2 αν το πρόβλημα θέλει το{' '}
    <InlineMath>{'m(t)'}</InlineMath> καθαρό.
  </>,
  <>
    <strong>Bessel</strong>: αναδιανέμει ισχύ· carrier μπορεί να μηδενιστεί στα Bessel zeros{' '}
    (<InlineMath>{'\\beta \\approx 2.405, 5.52, \\ldots'}</InlineMath>).
  </>,
  <>
    <strong>White noise PSD</strong> two-sided = <InlineMath>{'N_0/2'}</InlineMath>, one-sided
    = <InlineMath>{'N_0'}</InlineMath>. Πρόσεξε ποια σύμβαση χρησιμοποιεί η εκφώνηση.
  </>,
]

/** Page 1 — must-memorize. Roughly 70%+ of exam weight by topic. */
const PAGE_ONE: CheatsheetPage = {
  id: 'page-1',
  label: 'Σελίδα 1 — Πρέπει να θυμάσαι',
  kicker:
    'AM · FM · θόρυβος — δεν είναι στο επίσημο τυπολόγιο, οπότε ζουν εδώ.',
  groups: [
    {
      id: 'g-am-conventional',
      title: 'Conventional AM',
      topic: 'am',
      radar: (
        <>
          «Συμβατικό AM», «πλάτος», «μ», «envelope detector», «efficiency η»,{' '}
          «P_AM», «overmodulation».
        </>
      ),
      slots: [
        {
          id: 'am-signal',
          note: <>Με <InlineMath>{'\\mu \\le 1'}</InlineMath> το envelope = <InlineMath>{'A_c[1+\\mu m_n]'}</InlineMath>.</>,
        },
        { id: 'am-mu' },
        { id: 'am-spectrum' },
        {
          id: 'am-power',
          note: <>Πρώτο carrier (<InlineMath>{'A_c^2/2'}</InlineMath>), μετά sidebands (<InlineMath>{'P_m/2'}</InlineMath>).</>,
        },
        {
          id: 'am-eta',
          note: <>Single tone, <InlineMath>{'\\mu=1'}</InlineMath> ⇒ <InlineMath>{'\\eta_{\\max} = 1/3'}</InlineMath>.</>,
        },
        {
          id: 'envelope-detector-rc',
          note: <>Πολύ μικρό RC ⇒ ripple· πολύ μεγάλο ⇒ diagonal clipping.</>,
        },
      ],
    },
    {
      id: 'g-dsb-ssb',
      title: 'DSB-SC · SSB · VSB',
      topic: 'am',
      radar: <>«DSB», «suppressed carrier», «SSB», «μονόπλευρη», «VSB», «Hilbert».</>,
      slots: [
        { id: 'dsb-sc-signal' },
        {
          id: 'dsb-sc-power',
          note: <>Όλη η ισχύς στα sidebands· <InlineMath>{'\\eta = 100\\%'}</InlineMath>· χρειάζεται sync demod.</>,
        },
        {
          id: 'ssb-signal',
          note: <>USB: <InlineMath>-</InlineMath> στο πρόσημο· LSB: <InlineMath>+</InlineMath>.</>,
        },
        {
          id: 'am-bandwidth',
          note: <>AM/DSB-SC: <InlineMath>{'2W'}</InlineMath>· SSB: <InlineMath>W</InlineMath>· VSB: ≳W.</>,
        },
      ],
    },
    {
      id: 'g-coherent',
      title: 'Coherent demodulation — recipe',
      topic: 'modulation',
      radar: <>«Σύγχρονη ανίχνευση», «coherent», «phase error φ», «LPF», «receiver».</>,
      slots: [
        {
          id: 'trig-prod-cos-cos',
          shortTitle: 'cos·cos → product-to-sum',
          note: <>Πολλαπλασίασε σήμα με <InlineMath>{'2\\cos(2\\pi f_c t)'}</InlineMath>, LPF ⇒ message.</>,
        },
        {
          id: 'trig-double-cos',
          shortTitle: 'cos² = ½ + ½ cos(2x)',
          note: <>Από εδώ προκύπτει το factor <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> κάθε coherent demod.</>,
        },
        {
          id: 'hilbert',
          shortTitle: 'Hilbert (SSB demod)',
          note: <>Quadrature companion· <InlineMath>{'\\hat m = m * 1/(\\pi t)'}</InlineMath>.</>,
        },
      ],
      footnote: (
        <>
          Phase error <InlineMath>{'\\phi'}</InlineMath>:{' '}
          <InlineMath>{'y(t) = \\tfrac{1}{2}\\cos(\\phi)\\, m(t)'}</InlineMath> ⇒
          μηδέν στα ±90° (quadrature null).
        </>
      ),
    },
    {
      id: 'g-fm-signal',
      title: 'FM · PM · Bessel',
      topic: 'fm',
      radar: <>«FM», «PM», «modulation index β», «στιγμιαία συχνότητα», «sidebands», «J_n».</>,
      slots: [
        { id: 'fm-signal' },
        {
          id: 'fm-single-tone',
          note: <><InlineMath>{'\\beta = \\Delta f / f_m = K_f A_m / f_m'}</InlineMath>.</>,
        },
        { id: 'pm-signal' },
        {
          id: 'fm-instantaneous-freq',
          note: <>Discriminator recovers <InlineMath>{'f(t)'}</InlineMath>.</>,
        },
        { id: 'fm-beta' },
        {
          id: 'fm-bessel-sidebands',
          note: <>Πλευρική στο <InlineMath>{'f_c + n f_m'}</InlineMath> με πλάτος <InlineMath>{'A_c J_n(\\beta)'}</InlineMath>.</>,
        },
        {
          id: 'fm-bessel-property',
          note: <>Negative orders εναλλάσσουν πρόσημο· συνολική ενέργεια διατηρείται.</>,
        },
        {
          id: 'fm-power',
          note: <>Constant envelope ⇒ <InlineMath>{'P_{FM} = A_c^2/2'}</InlineMath>, ανεξάρτητο του <InlineMath>\beta</InlineMath>.</>,
        },
      ],
    },
    {
      id: 'g-carson',
      title: "Carson · FM in noise",
      topic: 'fm',
      radar: <>«Bandwidth FM», «Carson», «NBFM vs WBFM», «SNR FM», «FM gain», «threshold».</>,
      slots: [
        {
          id: 'carson',
          note: <>NBFM (<InlineMath>{'\\beta \\ll 1'}</InlineMath>) ≈ <InlineMath>{'2W'}</InlineMath>· WBFM ≈ <InlineMath>{'2\\Delta f'}</InlineMath>.</>,
        },
        {
          id: 'fm-snr-out',
          note: <>Πάνω από threshold (~10 dB input SNR).</>,
        },
        {
          id: 'fm-gain-am',
          note: <>Broadcast FM (<InlineMath>{'\\beta=5'}</InlineMath>) ⇒ ~23 dB πάνω από AM(<InlineMath>{'\\mu=1'}</InlineMath>).</>,
        },
      ],
    },
    {
      id: 'g-random',
      title: 'Random processes',
      topic: 'random',
      radar: <>«Στατιστικά», «WSS», «autocorrelation», «PSD», «Wiener-Khinchin», «random phase».</>,
      slots: [
        { id: 'random-mean' },
        { id: 'random-autocorr' },
        { id: 'wss' },
        {
          id: 'wiener-khinchin',
          note: <>Συνολική ισχύς <InlineMath>{'= R(0) = \\int S(f)\\,df'}</InlineMath>.</>,
        },
        {
          id: 'random-phase-cosine',
          note: <>Το textbook WSS παράδειγμα· εμφανίζεται σε κάθε «random phase» πρόβλημα.</>,
        },
      ],
    },
    {
      id: 'g-noise',
      title: 'Θόρυβος',
      topic: 'noise',
      radar: <>«Θερμικός», «λευκός», «μέσω φίλτρου», «SNR», «noise figure», «equivalent T_e».</>,
      slots: [
        {
          id: 'thermal-noise',
          note: <>Στα <InlineMath>{'T_0 = 290\\,K'}</InlineMath>: −174 dBm/Hz.</>,
        },
        {
          id: 'white-noise-psd',
          note: <>Two-sided <InlineMath>{'N_0/2'}</InlineMath>· one-sided <InlineMath>{'N_0'}</InlineMath>.</>,
        },
        { id: 'lti-output-psd' },
        {
          id: 'bandpass-noise-r',
          note: <>Bandpass white noise μετά από φίλτρο εύρους <InlineMath>W</InlineMath> γύρω από <InlineMath>{'f_c'}</InlineMath>.</>,
        },
        { id: 'snr' },
        {
          id: 'noise-figure',
          note: <><InlineMath>{'F=2'}</InlineMath> ⇒ 3 dB υποβάθμιση.</>,
        },
      ],
    },
  ],
}

/** Page 2 — clean mirror of the official τυπολόγιο. */
const PAGE_TWO: CheatsheetPage = {
  id: 'page-2',
  label: 'Σελίδα 2 — Στο επίσημο τυπολόγιο',
  kicker:
    'Καθρέφτης του επίσημου PDF — σου δίνεται στην εξέταση, αλλά καλό να τα έχεις στο ίδιο χαρτί.',
  groups: [
    {
      id: 'g-fourier-pairs',
      title: 'Fourier pairs',
      topic: 'foundations',
      radar: <>«Βρες τον FT του», «δείξε το pair», «δυϊκότητα», «sinc».</>,
      slots: [
        { id: 'fourier-pair-rect' },
        { id: 'fourier-pair-tri' },
        { id: 'fourier-pair-cos' },
        { id: 'fourier-pair-sin' },
        { id: 'fourier-pair-sgn' },
        { id: 'fourier-pair-const-delta' },
      ],
    },
    {
      id: 'g-fourier-props',
      title: 'Fourier properties',
      topic: 'foundations',
      radar: <>«Modulation theorem», «time-shift», «differentiation», «scaling», «convolution».</>,
      slots: [
        { id: 'fourier-duality' },
        { id: 'fourier-scaling' },
        { id: 'fourier-shift' },
        {
          id: 'fourier-modulation-theorem',
          note: <>Καρδιά κάθε AM/DSB/SSB derivation.</>,
        },
        { id: 'fourier-freq-shift' },
        { id: 'fourier-convolution' },
        { id: 'fourier-differentiation' },
        { id: 'fourier-integration' },
      ],
    },
    {
      id: 'g-hilbert',
      title: 'Hilbert transform',
      topic: 'modulation',
      radar: <>«SSB», «μονόπλευρο φάσμα», «analytical signal», «Hilbert».</>,
      slots: [
        {
          id: 'hilbert',
          shortTitle: 'F{x̂(t)} = −j sgn(f) X(f)',
          note: <>Time domain: <InlineMath>{'\\hat x = x * 1/(\\pi t)'}</InlineMath>. Energy preserved.</>,
        },
      ],
    },
    {
      id: 'g-trig',
      title: 'Τριγωνομετρικές ταυτότητες',
      topic: 'foundations',
      radar: <>«Product-to-sum», «double angle», «sin/cos μέσω εκθετικών».</>,
      slots: [
        { id: 'trig-cos-sum-diff' },
        { id: 'trig-sin-sum-diff' },
        { id: 'trig-cos-complex-exp' },
        { id: 'trig-sin-complex-exp' },
        { id: 'trig-prod-cos-cos' },
        { id: 'trig-prod-sin-sin' },
        { id: 'trig-prod-sin-cos' },
        { id: 'trig-double-cos' },
        { id: 'trig-double-sin' },
      ],
    },
    {
      id: 'g-integrals',
      title: 'Βασικά ολοκληρώματα',
      topic: 'foundations',
      radar: <>«Υπολόγισε ολοκλήρωμα», «μέση ισχύς», «Fourier coefficient».</>,
      slots: [
        { id: 'int-cos' },
        { id: 'int-sin' },
        { id: 'int-power' },
        { id: 'int-exp' },
        { id: 'int-ln' },
        { id: 'int-one-over-x' },
        { id: 'int-sec-squared' },
        { id: 'int-csc-squared' },
      ],
    },
    {
      id: 'g-bessel',
      title: 'Πίνακας Bessel',
      topic: 'fm',
      radar: <>«FM single-tone», «πλάτη sidebands», «J_n», «carrier null».</>,
      slots: [
        {
          id: 'bessel-table',
          note: <>Στον επίσημο PDF — πίνακας J_n(β) για n = 0..16.</>,
        },
      ],
      footnote: (
        <>
          Carrier μηδενίζεται στα <InlineMath>{'\\beta \\approx 2.405,\\, 5.520,\\, 8.654,\\, 11.79\\ldots'}</InlineMath>{' '}
          (zeros του <InlineMath>{'J_0'}</InlineMath>).
        </>
      ),
    },
  ],
}

export const CHEATSHEET_PAGES: CheatsheetPage[] = [PAGE_ONE, PAGE_TWO]
