/**
 * Formula sheet — the canonical equations of K21 organized by topic, each
 * with a stable ID so individual exercises can request specific entries to
 * be highlighted by the assist mode.
 *
 * IDs are stable identifiers (kebab-case, topic-prefixed). Exercises
 * reference them via `formulaIds: ['am-signal', 'am-power']`.
 *
 * `inTypology` flags whether an entry appears in the official τυπολόγιο
 * (`slides/formulas.pdf`, 3 pp.) handed to students during the exam:
 *   - `true`  → "✓ Στο τυπολόγιο" — look up, no memorization needed.
 *   - `false` → "⚠️ Πρέπει να θυμάσαι" — must be memorized for the exam.
 * See `plans/SP_FORMULA_IDS_BASELINE.md` for the integrity baseline.
 */

import { BlockMath, InlineMath } from '@/components/math'
import type { ReactNode } from 'react'
import type { Topic } from './types'

export type FormulaEntry = {
  id: string
  title: string
  topic: Topic
  /**
   * Is this entry in the official exam τυπολόγιο (`slides/formulas.pdf`)?
   * `true` = students can look it up during the exam (Fourier pairs,
   * Hilbert relation, trig identities, basic integrals, Bessel table).
   * `false` = students must memorize it (AM/FM/random/noise signal
   * formulas, modulation indices, Carson's rule, SNR, etc.).
   */
  inTypology: boolean
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
  // ─────────── Foundations ───────────
  {
    topic: 'foundations',
    label: 'Foundations',
    entries: [
      {
        id: 'fourier-pair-rect',
        title: 'Rect ↔ sinc',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\Pi(t/T) \\;\\leftrightarrow\\; T\\,\\mathrm{sinc}(fT)'}</BlockMath>,
      },
      {
        id: 'fourier-pair-tri',
        title: 'Triangle ↔ sinc²',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\Lambda(t/T) \\;\\leftrightarrow\\; T\\,\\mathrm{sinc}^2(fT)'}</BlockMath>,
      },
      {
        id: 'fourier-pair-cos',
        title: 'Cosine ↔ impulses',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'\\cos(2\\pi f_0 t) \\;\\leftrightarrow\\; \\tfrac{1}{2}[\\delta(f-f_0) + \\delta(f+f_0)]'}</BlockMath>
        ),
      },
      {
        id: 'fourier-pair-sin',
        title: 'Sine ↔ impulses (imaginary)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'\\sin(2\\pi f_0 t) \\;\\leftrightarrow\\; \\tfrac{1}{2j}[\\delta(f-f_0) - \\delta(f+f_0)]'}</BlockMath>
        ),
      },
      {
        id: 'fourier-pair-sgn',
        title: 'sgn(t) ↔ 1/(jπf)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'modulation/bridge',
        content: (
          <BlockMath>{'\\mathrm{sgn}(t) \\;\\leftrightarrow\\; \\frac{1}{j\\pi f} \\quad\\Longleftrightarrow\\quad \\frac{1}{\\pi t} \\;\\leftrightarrow\\; -j\\,\\mathrm{sgn}(f)'}</BlockMath>
        ),
      },
      {
        id: 'fourier-pair-const-delta',
        title: 'Σταθερά ↔ δ(f) (και η δυϊκότητα δ(t) ↔ 1)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'1 \\;\\leftrightarrow\\; \\delta(f) \\quad,\\quad \\delta(t) \\;\\leftrightarrow\\; 1'}</BlockMath>
        ),
      },
      {
        id: 'fourier-duality',
        title: 'Δυϊκότητα (symmetry)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'x(t) \\,\\leftrightarrow\\, X(f) \\;\\;\\Longrightarrow\\;\\; X(t) \\,\\leftrightarrow\\, x(-f)'}</BlockMath>
        ),
      },
      {
        id: 'fourier-scaling',
        title: 'Scaling',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'x(\\alpha t) \\;\\leftrightarrow\\; \\frac{1}{|\\alpha|} X\\!\\left(\\frac{f}{\\alpha}\\right)'}</BlockMath>,
      },
      {
        id: 'fourier-shift',
        title: 'Time shift',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'x(t - t_0) \\;\\leftrightarrow\\; X(f)\\, e^{-j 2\\pi f t_0}'}</BlockMath>,
      },
      {
        id: 'fourier-convolution',
        title: 'Convolution ↔ multiplication',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'x(t) * h(t) \\;\\leftrightarrow\\; X(f)\\, H(f) \\quad,\\quad x(t)\\,y(t) \\;\\leftrightarrow\\; X(f) * Y(f)'}</BlockMath>
        ),
      },
      {
        id: 'fourier-modulation-theorem',
        title: 'Modulation theorem',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'x(t)\\cos(2\\pi f_c t) \\;\\leftrightarrow\\; \\tfrac{1}{2}[X(f-f_c) + X(f+f_c)]'}</BlockMath>
        ),
      },
      {
        id: 'fourier-freq-shift',
        title: 'Frequency shift (μιγαδικός φέρων)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'x(t)\\, e^{j 2\\pi f_0 t} \\;\\leftrightarrow\\; X(f - f_0)'}</BlockMath>,
      },
      {
        id: 'fourier-differentiation',
        title: 'Παράγωγος στο time domain',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\frac{d\\,x(t)}{dt} \\;\\leftrightarrow\\; j 2\\pi f \\, X(f)'}</BlockMath>,
      },
      {
        id: 'fourier-integration',
        title: 'Ολοκλήρωση στο time domain',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'\\int_{-\\infty}^{t} x(\\tau)\\, d\\tau \\;\\leftrightarrow\\; \\frac{X(f)}{j 2\\pi f} + \\frac{X(0)}{2}\\,\\delta(f)'}</BlockMath>
        ),
      },
      {
        id: 'parseval',
        title: 'Parseval',
        topic: 'foundations',
        inTypology: false,
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\int |x(t)|^2\\, dt \\;=\\; \\int |X(f)|^2\\, df'}</BlockMath>,
      },
      {
        id: 'parseval-power',
        title: 'Power signal Parseval (cosines)',
        topic: 'foundations',
        inTypology: false,
        derivedIn: 'foundations/fourier-series',
        content: (
          <>
            <BlockMath>{'P_x = \\sum_i \\frac{A_i^2}{2} \\quad \\text{(για cosines σε διαφορετικές } f\\text{)}'}</BlockMath>
          </>
        ),
      },

      // ── Τριγωνομετρικές ταυτότητες (τυπολόγιο) ──
      {
        id: 'trig-cos-sum-diff',
        title: 'cos(x ± y)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\cos(x \\pm y) = \\cos(x)\\cos(y) \\mp \\sin(x)\\sin(y)'}</BlockMath>,
      },
      {
        id: 'trig-sin-sum-diff',
        title: 'sin(x ± y)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\sin(x \\pm y) = \\sin(x)\\cos(y) \\pm \\cos(x)\\sin(y)'}</BlockMath>,
      },
      {
        id: 'trig-cos-complex-exp',
        title: 'cos(x) μέσω εκθετικών',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\cos(x) = \\tfrac{1}{2}\\!\\left(e^{jx} + e^{-jx}\\right)'}</BlockMath>,
      },
      {
        id: 'trig-sin-complex-exp',
        title: 'sin(x) μέσω εκθετικών',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\sin(x) = \\tfrac{1}{2j}\\!\\left(e^{jx} - e^{-jx}\\right)'}</BlockMath>,
      },
      {
        id: 'trig-prod-cos-cos',
        title: 'cos(x)·cos(y) → product-to-sum',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\cos(x)\\cos(y) = \\tfrac{1}{2}\\,[\\cos(x - y) + \\cos(x + y)]'}</BlockMath>,
      },
      {
        id: 'trig-prod-sin-sin',
        title: 'sin(x)·sin(y) → product-to-sum',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\sin(x)\\sin(y) = \\tfrac{1}{2}\\,[\\cos(x - y) - \\cos(x + y)]'}</BlockMath>,
      },
      {
        id: 'trig-prod-sin-cos',
        title: 'sin(x)·cos(y) → product-to-sum',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\sin(x)\\cos(y) = \\tfrac{1}{2}\\,[\\sin(x - y) + \\sin(x + y)]'}</BlockMath>,
      },
      {
        id: 'trig-double-cos',
        title: 'cos²(x) (διπλάσιο τόξο)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\cos^2(x) = \\tfrac{1}{2}\\,[1 + \\cos(2x)]'}</BlockMath>,
      },
      {
        id: 'trig-double-sin',
        title: 'sin²(x) (διπλάσιο τόξο)',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/trig-identities',
        content: <BlockMath>{'\\sin^2(x) = \\tfrac{1}{2}\\,[1 - \\cos(2x)]'}</BlockMath>,
      },

      // ── Βασικά ολοκληρώματα (τυπολόγιο) ──
      {
        id: 'int-cos',
        title: '∫ cos(x) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\cos(x)\\, dx = \\sin(x) + C'}</BlockMath>,
      },
      {
        id: 'int-sin',
        title: '∫ sin(x) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\sin(x)\\, dx = -\\cos(x) + C'}</BlockMath>,
      },
      {
        id: 'int-power',
        title: '∫ (a + bx)ⁿ dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: (
          <BlockMath>{'\\int (a + bx)^{n}\\, dx = \\frac{(a + bx)^{n+1}}{b\\,(n + 1)} + C \\quad (n \\neq -1)'}</BlockMath>
        ),
      },
      {
        id: 'int-exp',
        title: '∫ eˣ dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int e^{x}\\, dx = e^{x} + C'}</BlockMath>,
      },
      {
        id: 'int-ln',
        title: '∫ ln(x) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\ln(x)\\, dx = x\\,\\ln(x) - x + C'}</BlockMath>,
      },
      {
        id: 'int-one-over-x',
        title: '∫ (1/x) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\frac{1}{x}\\, dx = \\ln|x| + C'}</BlockMath>,
      },
      {
        id: 'int-sec-squared',
        title: '∫ (1/cos²(x)) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\frac{1}{\\cos^2(x)}\\, dx = \\tan(x) + C'}</BlockMath>,
      },
      {
        id: 'int-csc-squared',
        title: '∫ (1/sin²(x)) dx',
        topic: 'foundations',
        inTypology: true,
        derivedIn: 'reference/integrals',
        content: <BlockMath>{'\\int \\frac{1}{\\sin^2(x)}\\, dx = -\\cot(x) + C'}</BlockMath>,
      },
    ],
  },

  // ─────────── AM ───────────
  {
    topic: 'am',
    label: 'AM',
    entries: [
      {
        id: 'am-signal',
        title: 'AM σήμα',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/conventional',
        content: <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</BlockMath>,
      },
      {
        id: 'am-mu',
        title: 'Modulation index μ',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/conventional',
        content: <BlockMath>{'\\mu = \\frac{|m|_{\\max}}{A_c}, \\quad \\mu \\leq 1 \\text{ για να μην υπάρχει overmodulation}'}</BlockMath>,
      },
      {
        id: 'am-spectrum',
        title: 'AM φάσμα',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/conventional',
        content: (
          <BlockMath>{'X_{AM}(f) = \\tfrac{A_c}{2}[\\delta(f-f_c)+\\delta(f+f_c)] + \\tfrac{1}{2}[M(f-f_c)+M(f+f_c)]'}</BlockMath>
        ),
      },
      {
        id: 'am-power',
        title: 'AM ισχύς',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/conventional',
        content: <BlockMath>{'P_{AM} = \\frac{A_c^2}{2} + \\frac{P_m}{2} \\quad,\\quad P_m = \\overline{m^2}'}</BlockMath>,
      },
      {
        id: 'am-eta',
        title: 'AM efficiency η',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/conventional',
        content: (
          <BlockMath>{'\\eta = \\frac{P_m}{A_c^2 + P_m} \\;\\stackrel{\\text{single-tone}}{=}\\; \\frac{\\mu^2}{2 + \\mu^2} \\;\\leq\\; \\tfrac{1}{3}'}</BlockMath>
        ),
      },
      {
        id: 'dsb-sc-signal',
        title: 'DSB-SC σήμα',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/dsb-sc',
        content: <BlockMath>{'x_{DSB-SC}(t) = A_c\\, m(t)\\cos(2\\pi f_c t)'}</BlockMath>,
      },
      {
        id: 'dsb-sc-power',
        title: 'DSB-SC ισχύς',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/dsb-sc',
        content: <BlockMath>{'P_{DSB-SC} = \\frac{A_c^2 P_m}{2}, \\quad \\eta = 100\\%'}</BlockMath>,
      },
      {
        id: 'ssb-signal',
        title: 'SSB σήμα',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/ssb',
        content: (
          <BlockMath>{'x_{SSB}(t) = A_c\\, m(t)\\cos(2\\pi f_c t) \\mp A_c\\,\\hat m(t)\\sin(2\\pi f_c t)'}</BlockMath>
        ),
      },
      {
        id: 'hilbert',
        title: 'Hilbert transform',
        topic: 'am',
        inTypology: true,
        derivedIn: 'modulation/bridge',
        content: <BlockMath>{'\\mathcal{F}\\{\\hat m(t)\\} = -j\\,\\mathrm{sgn}(f)\\, M(f)'}</BlockMath>,
      },
      {
        id: 'am-bandwidth',
        title: 'AM bandwidth',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/overview',
        content: <BlockMath>{'B_{AM} = B_{DSB-SC} = 2W \\quad,\\quad B_{SSB} = W'}</BlockMath>,
      },
      {
        id: 'vsb-signal',
        title: 'VSB σήμα',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/vsb',
        content: (
          <BlockMath>{'x_{VSB}(t) = [A_c + m(t)]\\cos(2\\pi f_c t) \\;\\xrightarrow{H_{VSB}(f)}\\; \\text{full USB (ή LSB) + vestige}'}</BlockMath>
        ),
      },
      {
        id: 'vsb-nyquist-symmetry',
        title: 'VSB Nyquist symmetry',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/vsb',
        content: (
          <BlockMath>{'H_{VSB}(f_c + \\Delta) + H_{VSB}(f_c - \\Delta) = \\text{const} \\quad \\text{για } |\\Delta| < W'}</BlockMath>
        ),
      },
      {
        id: 'vsb-bandwidth',
        title: 'VSB bandwidth',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/vsb',
        content: (
          <BlockMath>{'B_{VSB} = W + W_{\\text{vestige}}, \\quad W < B_{VSB} < 2W'}</BlockMath>
        ),
      },
      {
        id: 'envelope-detector-rc',
        title: 'Envelope detector RC range',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/modulator-demodulator',
        content: <BlockMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{W}'}</BlockMath>,
      },
      {
        id: 'am-output-snr',
        title: 'AM output SNR (single-tone, high SNR)',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/modulator-demodulator',
        content: (
          <BlockMath>{'(\\mathrm{SNR})_\\text{out, AM} = \\frac{\\mu^2/2}{1 + \\mu^2/2}\\cdot(\\mathrm{SNR})_\\text{in} = \\eta\\cdot(\\mathrm{SNR})_\\text{in}'}</BlockMath>
        ),
      },
      {
        id: 'nonlinear-modulator-fc',
        title: 'Συνθήκη μη γραμμικού modulator',
        topic: 'am',
        inTypology: false,
        derivedIn: 'am/modulator-demodulator',
        content: <BlockMath>{'f_c > 3W'}</BlockMath>,
      },
    ],
  },

  // ─────────── FM / PM ───────────
  {
    topic: 'fm',
    label: 'FM / PM',
    entries: [
      {
        id: 'fm-signal',
        title: 'FM σήμα (general)',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/idea',
        content: (
          <BlockMath>{'x_{FM}(t) = A_c\\cos\\!\\left[2\\pi f_c t + 2\\pi K_f \\int_{-\\infty}^{t} m(\\tau)\\,d\\tau\\right]'}</BlockMath>
        ),
      },
      {
        id: 'fm-single-tone',
        title: 'FM single-tone',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/idea',
        content: <BlockMath>{'x_{FM}(t) = A_c\\cos[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)]'}</BlockMath>,
      },
      {
        id: 'pm-signal',
        title: 'PM σήμα',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/pm',
        content: <BlockMath>{'x_{PM}(t) = A_c\\cos[2\\pi f_c t + K_p\\, m(t)]'}</BlockMath>,
      },
      {
        id: 'fm-instantaneous-freq',
        title: 'Στιγμιαία συχνότητα',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/idea',
        content: <BlockMath>{'f(t) = \\frac{1}{2\\pi}\\frac{d\\theta(t)}{dt} = f_c + K_f\\, m(t)'}</BlockMath>,
      },
      {
        id: 'fm-beta',
        title: 'Modulation index β (FM/PM)',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/idea',
        content: (
          <BlockMath>{'\\beta_f = \\frac{\\Delta f}{W} = \\frac{K_f \\max|m|}{W}, \\quad \\beta_p = K_p \\max|m|'}</BlockMath>
        ),
      },
      {
        id: 'fm-bessel-expansion',
        title: 'Bessel expansion (Jacobi-Anger)',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/bessel',
        content: <BlockMath>{'e^{j\\beta\\sin\\theta} = \\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\, e^{jn\\theta}'}</BlockMath>,
      },
      {
        id: 'fm-bessel-sidebands',
        title: 'FM Bessel form',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/bessel',
        content: (
          <BlockMath>{'x_{FM}(t) = A_c \\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\cos[2\\pi(f_c + n f_m)t]'}</BlockMath>
        ),
      },
      {
        id: 'fm-bessel-property',
        title: 'Bessel symmetry + power',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/bessel',
        content: (
          <>
            <BlockMath>{'J_{-n}(\\beta) = (-1)^n J_n(\\beta) \\quad,\\quad \\sum_{n=-\\infty}^{\\infty} J_n^2(\\beta) = 1'}</BlockMath>
          </>
        ),
      },
      {
        id: 'carson',
        title: "Carson's rule",
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/carson',
        content: <BlockMath>{'B_{FM} = 2(\\Delta f + W) = 2(\\beta + 1)W'}</BlockMath>,
      },
      {
        id: 'fm-power',
        title: 'FM ισχύς',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/bessel',
        content: <BlockMath>{'P_{FM} = \\frac{A_c^2}{2} \\quad \\text{(ανεξάρτητο του } \\beta\\text{)}'}</BlockMath>,
      },
      {
        id: 'fm-snr-out',
        title: 'FM output SNR',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/in-noise',
        content: <BlockMath>{'\\text{SNR}_{out,FM} = 3\\beta^2\\, \\text{SNR}_{ref} = 3\\beta^2 \\cdot \\tfrac{A_c^2}{2 N_0 W}'}</BlockMath>,
      },
      {
        id: 'fm-gain-am',
        title: 'FM gain over AM (μ=1)',
        topic: 'fm',
        inTypology: false,
        derivedIn: 'fm/in-noise',
        content: <BlockMath>{'G_{FM/AM} = 9\\beta^2'}</BlockMath>,
      },
      {
        id: 'bessel-table',
        title: 'Bessel table Jₙ(β)',
        topic: 'fm',
        inTypology: true,
        derivedIn: 'fm/bessel',
        content: (
          <>
            <BlockMath>{'J_n(\\beta), \\quad n = 0\\,(\\text{carrier}),\\, 1,\\, 2,\\, \\dots,\\, 16'}</BlockMath>
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Πίνακας τιμών για συνηθισμένα <InlineMath>{'\\beta'}</InlineMath> — δίνει
              το πλάτος <InlineMath>{'A_c\\, J_n(\\beta)'}</InlineMath> της{' '}
              <InlineMath>{'n'}</InlineMath>-οστής πλευρικής στο FM single-tone.
            </p>
          </>
        ),
      },
    ],
  },

  // ─────────── Random + Noise ───────────
  {
    topic: 'random',
    label: 'Random Processes',
    entries: [
      {
        id: 'random-mean',
        title: 'Mean function',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/random-processes',
        content: <BlockMath>{'\\mu_X(t) = E[X(t)]'}</BlockMath>,
      },
      {
        id: 'random-autocorr',
        title: 'Autocorrelation',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/random-processes',
        content: <BlockMath>{'R_X(t_1, t_2) = E[X(t_1)\\, X(t_2)]'}</BlockMath>,
      },
      {
        id: 'random-cross',
        title: 'Cross-correlation / cross-covariance',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/random-processes',
        content: (
          <BlockMath>{'R_{XY}(t_1, t_2) = E[X(t_1)Y(t_2)],\\;\\; C_{XY} = R_{XY} - \\mu_X\\mu_Y'}</BlockMath>
        ),
      },
      {
        id: 'wss',
        title: 'WSS conditions',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/stationarity',
        content: <BlockMath>{'\\mu_X(t) = \\mu_X = \\text{const} \\quad,\\quad R_X(t_1,t_2) = R_X(\\tau)'}</BlockMath>,
      },
      {
        id: 'wiener-khinchin',
        title: 'Wiener-Khinchin (PSD)',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/psd',
        content: <BlockMath>{'S_X(f) = \\mathcal{F}\\{R_X(\\tau)\\} \\quad,\\quad P_X = R_X(0) = \\int S_X(f)\\, df'}</BlockMath>,
      },
      {
        id: 'random-phase-cosine',
        title: 'Random-phase cosine',
        topic: 'random',
        inTypology: false,
        derivedIn: 'randomness/random-processes',
        content: (
          <BlockMath>{'X = A\\cos(2\\pi f_0 t + \\Theta), \\Theta \\sim U[0,2\\pi] \\Rightarrow \\mu_X = 0,\\; R_X(\\tau) = \\tfrac{A^2}{2}\\cos(2\\pi f_0 \\tau)'}</BlockMath>
        ),
      },
    ],
  },

  // ─────────── Noise ───────────
  {
    topic: 'noise',
    label: 'Noise',
    entries: [
      {
        id: 'thermal-noise',
        title: 'Thermal noise (Johnson-Nyquist)',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/sources',
        content: <BlockMath>{'P_N = kTB \\quad,\\quad k = 1.38\\times 10^{-23}\\,\\text{J/K}, \\;T_0 = 290\\,\\text{K}'}</BlockMath>,
      },
      {
        id: 'white-noise-psd',
        title: 'White noise PSD',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/white-noise',
        content: <BlockMath>{'S_N(f) = \\frac{N_0}{2}, \\quad R_N(\\tau) = \\frac{N_0}{2}\\delta(\\tau), \\quad N_0 = kT'}</BlockMath>,
      },
      {
        id: 'lti-output-psd',
        title: 'PSD μέσα από LTI',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/through-filters',
        content: <BlockMath>{'S_Y(f) = |H(f)|^2\\, S_X(f) \\quad,\\quad P_Y = \\int |H(f)|^2 S_X(f)\\, df'}</BlockMath>,
      },
      {
        id: 'bandpass-noise-r',
        title: 'Bandpass white noise R(τ)',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/through-filters',
        content: <BlockMath>{'R_Y(\\tau) = N_0 W\\,\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c \\tau)'}</BlockMath>,
      },
      {
        id: 'snr',
        title: 'SNR (linear and dB)',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/snr',
        content: <BlockMath>{'\\text{SNR} = \\frac{P_s}{P_n} \\quad,\\quad \\text{SNR}_{dB} = 10\\log_{10}(\\text{SNR})'}</BlockMath>,
      },
      {
        id: 'noise-figure',
        title: 'Noise figure / equivalent T_e',
        topic: 'noise',
        inTypology: false,
        derivedIn: 'noise/sources',
        content: <BlockMath>{'F = \\frac{\\text{SNR}_{in}}{\\text{SNR}_{out}}, \\;\\; T_e = (F-1)T_0'}</BlockMath>,
      },
    ],
  },
]

/** Lookup helper: id → entry. */
export const FORMULA_BY_ID: Record<string, FormulaEntry> = (() => {
  const out: Record<string, FormulaEntry> = {}
  for (const sec of FORMULA_SHEET) for (const e of sec.entries) out[e.id] = e
  return out
})()
