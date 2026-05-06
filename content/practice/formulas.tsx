/**
 * Formula sheet — the canonical equations of K21 organized by topic, each
 * with a stable ID so individual exercises can request specific entries to
 * be highlighted by the assist mode.
 *
 * IDs are stable identifiers (kebab-case, topic-prefixed). Exercises
 * reference them via `formulaIds: ['am-signal', 'am-power']`.
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
  // ─────────── Foundations ───────────
  {
    topic: 'foundations',
    label: 'Foundations',
    entries: [
      {
        id: 'fourier-pair-rect',
        title: 'Rect ↔ sinc',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\Pi(t/T) \\;\\leftrightarrow\\; T\\,\\mathrm{sinc}(fT)'}</BlockMath>,
      },
      {
        id: 'fourier-pair-tri',
        title: 'Triangle ↔ sinc²',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\Lambda(t/T) \\;\\leftrightarrow\\; T\\,\\mathrm{sinc}^2(fT)'}</BlockMath>,
      },
      {
        id: 'fourier-pair-cos',
        title: 'Cosine ↔ impulses',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'\\cos(2\\pi f_0 t) \\;\\leftrightarrow\\; \\tfrac{1}{2}[\\delta(f-f_0) + \\delta(f+f_0)]'}</BlockMath>
        ),
      },
      {
        id: 'fourier-pair-sin',
        title: 'Sine ↔ impulses (imaginary)',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'\\sin(2\\pi f_0 t) \\;\\leftrightarrow\\; \\tfrac{1}{2j}[\\delta(f-f_0) - \\delta(f+f_0)]'}</BlockMath>
        ),
      },
      {
        id: 'fourier-scaling',
        title: 'Scaling',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'x(\\alpha t) \\;\\leftrightarrow\\; \\frac{1}{|\\alpha|} X\\!\\left(\\frac{f}{\\alpha}\\right)'}</BlockMath>,
      },
      {
        id: 'fourier-shift',
        title: 'Time shift',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'x(t - t_0) \\;\\leftrightarrow\\; X(f)\\, e^{-j 2\\pi f t_0}'}</BlockMath>,
      },
      {
        id: 'fourier-convolution',
        title: 'Convolution ↔ multiplication',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'x(t) * h(t) \\;\\leftrightarrow\\; X(f)\\, H(f) \\quad,\\quad x(t)\\,y(t) \\;\\leftrightarrow\\; X(f) * Y(f)'}</BlockMath>
        ),
      },
      {
        id: 'fourier-modulation-theorem',
        title: 'Modulation theorem',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: (
          <BlockMath>{'x(t)\\cos(2\\pi f_c t) \\;\\leftrightarrow\\; \\tfrac{1}{2}[X(f-f_c) + X(f+f_c)]'}</BlockMath>
        ),
      },
      {
        id: 'parseval',
        title: 'Parseval',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-transform',
        content: <BlockMath>{'\\int |x(t)|^2\\, dt \\;=\\; \\int |X(f)|^2\\, df'}</BlockMath>,
      },
      {
        id: 'parseval-power',
        title: 'Power signal Parseval (cosines)',
        topic: 'foundations',
        derivedIn: 'foundations/fourier-series',
        content: (
          <>
            <BlockMath>{'P_x = \\sum_i \\frac{A_i^2}{2} \\quad \\text{(για cosines σε διαφορετικές } f\\text{)}'}</BlockMath>
          </>
        ),
      },
      {
        id: 'sampling-nyquist',
        title: 'Nyquist criterion',
        topic: 'sampling',
        derivedIn: 'foundations/sampling-theorem',
        content: <BlockMath>{'f_s \\geq 2W \\;\\Rightarrow\\; \\text{ανακατασκευή τέλεια}'}</BlockMath>,
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
        derivedIn: 'am/conventional',
        content: <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</BlockMath>,
      },
      {
        id: 'am-mu',
        title: 'Modulation index μ',
        topic: 'am',
        derivedIn: 'am/conventional',
        content: <BlockMath>{'\\mu = \\frac{|m|_{\\max}}{A_c}, \\quad \\mu \\leq 1 \\text{ για να μην υπάρχει overmodulation}'}</BlockMath>,
      },
      {
        id: 'am-spectrum',
        title: 'AM φάσμα',
        topic: 'am',
        derivedIn: 'am/conventional',
        content: (
          <BlockMath>{'X_{AM}(f) = \\tfrac{A_c}{2}[\\delta(f-f_c)+\\delta(f+f_c)] + \\tfrac{1}{2}[M(f-f_c)+M(f+f_c)]'}</BlockMath>
        ),
      },
      {
        id: 'am-power',
        title: 'AM ισχύς',
        topic: 'am',
        derivedIn: 'am/conventional',
        content: <BlockMath>{'P_{AM} = \\frac{A_c^2}{2} + \\frac{P_m}{2} \\quad,\\quad P_m = \\overline{m^2}'}</BlockMath>,
      },
      {
        id: 'am-eta',
        title: 'AM efficiency η',
        topic: 'am',
        derivedIn: 'am/conventional',
        content: (
          <BlockMath>{'\\eta = \\frac{P_m}{A_c^2 + P_m} = \\frac{\\mu^2 P_m}{2 + \\mu^2 P_m} \\;\\leq\\; \\tfrac{1}{3}'}</BlockMath>
        ),
      },
      {
        id: 'dsb-sc-signal',
        title: 'DSB-SC σήμα',
        topic: 'am',
        derivedIn: 'am/dsb-sc',
        content: <BlockMath>{'x_{DSB-SC}(t) = A_c\\, m(t)\\cos(2\\pi f_c t)'}</BlockMath>,
      },
      {
        id: 'dsb-sc-power',
        title: 'DSB-SC ισχύς',
        topic: 'am',
        derivedIn: 'am/dsb-sc',
        content: <BlockMath>{'P_{DSB-SC} = \\frac{A_c^2 P_m}{2}, \\quad \\eta = 100\\%'}</BlockMath>,
      },
      {
        id: 'ssb-signal',
        title: 'SSB σήμα',
        topic: 'am',
        derivedIn: 'am/ssb',
        content: (
          <BlockMath>{'x_{SSB}(t) = A_c\\, m(t)\\cos(2\\pi f_c t) \\mp A_c\\,\\hat m(t)\\sin(2\\pi f_c t)'}</BlockMath>
        ),
      },
      {
        id: 'hilbert',
        title: 'Hilbert transform',
        topic: 'am',
        derivedIn: 'modulation/bridge',
        content: <BlockMath>{'\\mathcal{F}\\{\\hat m(t)\\} = -j\\,\\mathrm{sgn}(f)\\, M(f)'}</BlockMath>,
      },
      {
        id: 'am-bandwidth',
        title: 'AM bandwidth',
        topic: 'am',
        derivedIn: 'am/overview',
        content: <BlockMath>{'B_{AM} = B_{DSB-SC} = 2W \\quad,\\quad B_{SSB} = W'}</BlockMath>,
      },
      {
        id: 'envelope-detector-rc',
        title: 'Envelope detector RC range',
        topic: 'am',
        derivedIn: 'am/modulator-demodulator',
        content: <BlockMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{W}'}</BlockMath>,
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
        derivedIn: 'fm/idea',
        content: (
          <BlockMath>{'x_{FM}(t) = A_c\\cos\\!\\left[2\\pi f_c t + 2\\pi K_f \\int_{-\\infty}^{t} m(\\tau)\\,d\\tau\\right]'}</BlockMath>
        ),
      },
      {
        id: 'fm-single-tone',
        title: 'FM single-tone',
        topic: 'fm',
        derivedIn: 'fm/idea',
        content: <BlockMath>{'x_{FM}(t) = A_c\\cos[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)]'}</BlockMath>,
      },
      {
        id: 'pm-signal',
        title: 'PM σήμα',
        topic: 'fm',
        derivedIn: 'fm/pm',
        content: <BlockMath>{'x_{PM}(t) = A_c\\cos[2\\pi f_c t + K_p\\, m(t)]'}</BlockMath>,
      },
      {
        id: 'fm-instantaneous-freq',
        title: 'Στιγμιαία συχνότητα',
        topic: 'fm',
        derivedIn: 'fm/idea',
        content: <BlockMath>{'f(t) = \\frac{1}{2\\pi}\\frac{d\\theta(t)}{dt} = f_c + K_f\\, m(t)'}</BlockMath>,
      },
      {
        id: 'fm-beta',
        title: 'Modulation index β (FM/PM)',
        topic: 'fm',
        derivedIn: 'fm/idea',
        content: (
          <BlockMath>{'\\beta_f = \\frac{\\Delta f}{W} = \\frac{K_f \\max|m|}{W}, \\quad \\beta_p = K_p \\max|m|'}</BlockMath>
        ),
      },
      {
        id: 'fm-bessel-expansion',
        title: 'Bessel expansion (Jacobi-Anger)',
        topic: 'fm',
        derivedIn: 'fm/bessel',
        content: <BlockMath>{'e^{j\\beta\\sin\\theta} = \\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\, e^{jn\\theta}'}</BlockMath>,
      },
      {
        id: 'fm-bessel-sidebands',
        title: 'FM Bessel form',
        topic: 'fm',
        derivedIn: 'fm/bessel',
        content: (
          <BlockMath>{'x_{FM}(t) = A_c \\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\cos[2\\pi(f_c + n f_m)t]'}</BlockMath>
        ),
      },
      {
        id: 'fm-bessel-property',
        title: 'Bessel symmetry + power',
        topic: 'fm',
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
        derivedIn: 'fm/carson',
        content: <BlockMath>{'B_{FM} = 2(\\Delta f + W) = 2(\\beta + 1)W'}</BlockMath>,
      },
      {
        id: 'fm-power',
        title: 'FM ισχύς',
        topic: 'fm',
        derivedIn: 'fm/bessel',
        content: <BlockMath>{'P_{FM} = \\frac{A_c^2}{2} \\quad \\text{(ανεξάρτητο του } \\beta\\text{)}'}</BlockMath>,
      },
      {
        id: 'fm-snr-out',
        title: 'FM output SNR',
        topic: 'fm',
        derivedIn: 'fm/in-noise',
        content: <BlockMath>{'\\text{SNR}_{out,FM} = 3\\beta^2\\, \\text{SNR}_{ref} = 3\\beta^2 \\cdot \\tfrac{A_c^2}{2 N_0 W}'}</BlockMath>,
      },
      {
        id: 'fm-gain-am',
        title: 'FM gain over AM (μ=1)',
        topic: 'fm',
        derivedIn: 'fm/in-noise',
        content: <BlockMath>{'G_{FM/AM} = 9\\beta^2'}</BlockMath>,
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
        derivedIn: 'randomness/random-processes',
        content: <BlockMath>{'\\mu_X(t) = E[X(t)]'}</BlockMath>,
      },
      {
        id: 'random-autocorr',
        title: 'Autocorrelation',
        topic: 'random',
        derivedIn: 'randomness/random-processes',
        content: <BlockMath>{'R_X(t_1, t_2) = E[X(t_1)\\, X(t_2)]'}</BlockMath>,
      },
      {
        id: 'random-cross',
        title: 'Cross-correlation / cross-covariance',
        topic: 'random',
        derivedIn: 'randomness/random-processes',
        content: (
          <BlockMath>{'R_{XY}(t_1, t_2) = E[X(t_1)Y(t_2)],\\;\\; C_{XY} = R_{XY} - \\mu_X\\mu_Y'}</BlockMath>
        ),
      },
      {
        id: 'wss',
        title: 'WSS conditions',
        topic: 'random',
        derivedIn: 'randomness/stationarity',
        content: <BlockMath>{'\\mu_X(t) = \\mu_X = \\text{const} \\quad,\\quad R_X(t_1,t_2) = R_X(\\tau)'}</BlockMath>,
      },
      {
        id: 'wiener-khinchin',
        title: 'Wiener-Khinchin (PSD)',
        topic: 'random',
        derivedIn: 'randomness/psd',
        content: <BlockMath>{'S_X(f) = \\mathcal{F}\\{R_X(\\tau)\\} \\quad,\\quad P_X = R_X(0) = \\int S_X(f)\\, df'}</BlockMath>,
      },
      {
        id: 'random-phase-cosine',
        title: 'Random-phase cosine',
        topic: 'random',
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
        derivedIn: 'noise/sources',
        content: <BlockMath>{'P_N = kTB \\quad,\\quad k = 1.38\\times 10^{-23}\\,\\text{J/K}, \\;T_0 = 290\\,\\text{K}'}</BlockMath>,
      },
      {
        id: 'white-noise-psd',
        title: 'White noise PSD',
        topic: 'noise',
        derivedIn: 'noise/white-noise',
        content: <BlockMath>{'S_N(f) = \\frac{N_0}{2}, \\quad R_N(\\tau) = \\frac{N_0}{2}\\delta(\\tau), \\quad N_0 = kT'}</BlockMath>,
      },
      {
        id: 'lti-output-psd',
        title: 'PSD μέσα από LTI',
        topic: 'noise',
        derivedIn: 'noise/through-filters',
        content: <BlockMath>{'S_Y(f) = |H(f)|^2\\, S_X(f) \\quad,\\quad P_Y = \\int |H(f)|^2 S_X(f)\\, df'}</BlockMath>,
      },
      {
        id: 'bandpass-noise-r',
        title: 'Bandpass white noise R(τ)',
        topic: 'noise',
        derivedIn: 'noise/through-filters',
        content: <BlockMath>{'R_Y(\\tau) = N_0 W\\,\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c \\tau)'}</BlockMath>,
      },
      {
        id: 'snr',
        title: 'SNR (linear and dB)',
        topic: 'noise',
        derivedIn: 'noise/snr',
        content: <BlockMath>{'\\text{SNR} = \\frac{P_s}{P_n} \\quad,\\quad \\text{SNR}_{dB} = 10\\log_{10}(\\text{SNR})'}</BlockMath>,
      },
      {
        id: 'noise-figure',
        title: 'Noise figure / equivalent T_e',
        topic: 'noise',
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
