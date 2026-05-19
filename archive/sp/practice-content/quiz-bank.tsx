/**
 * Quiz bank — True/False + Multiple Choice questions for the quiz modes.
 *
 * Each question carries:
 *   - topic (for filtering)
 *   - difficulty
 *   - prerequisites (so the user can see what to read if they got it wrong)
 *   - explanation (always shown after the user answers, right or wrong)
 *
 * Strategy: cover every chapter group with at least 3 questions, mix
 * difficulty, and spotlight the recurring exam traps (e.g. "white noise
 * is Gaussian" → false).
 */

import { InlineMath } from '@/components/math'
import type { QuizQuestion } from './types'

export const QUIZ_BANK: QuizQuestion[] = [
  // ─────────── Foundations T/F ───────────
  {
    id: 'tf-found-1',
    type: 'true-false',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/signals'],
    question: (
      <>
        Η συνάρτηση <InlineMath>{'x(t) = \\cos(2\\pi t)'}</InlineMath> είναι σήμα ενέργειας.
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Είναι σήμα <em>ισχύος</em>: η ενέργειά του{' '}
        <InlineMath>{'\\int |x|^2 dt = \\infty'}</InlineMath>, αλλά η μέση ισχύς{' '}
        <InlineMath>{'P = 1/2'}</InlineMath> είναι πεπερασμένη. Κάθε περιοδικό σήμα
        (μη μηδενικό) είναι σήμα ισχύος, όχι ενέργειας.
      </>
    ),
  },
  {
    id: 'tf-found-2',
    type: 'true-false',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/fourier-transform'],
    question: <>Η Fourier transform είναι γραμμικός μετασχηματισμός.</>,
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> <InlineMath>{'\\mathcal{F}\\{a\\, x_1 + b\\, x_2\\} = a X_1(f) + b X_2(f)'}</InlineMath>{' '}
        — προκύπτει άμεσα από τη γραμμικότητα του ολοκληρώματος.
      </>
    ),
  },
  {
    id: 'tf-found-3',
    type: 'true-false',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    question: (
      <>
        Convolution στον χρόνο γίνεται πολλαπλασιασμός στη συχνότητα και αντίστροφα.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Είναι το θεώρημα convolution:{' '}
        <InlineMath>{'\\mathcal{F}\\{x * h\\} = X(f) H(f)'}</InlineMath> και{' '}
        <InlineMath>{'\\mathcal{F}\\{x \\cdot y\\} = X(f) * Y(f)'}</InlineMath>{' '}
        (η δεύτερη είναι το modulation theorem).
      </>
    ),
  },
  {
    id: 'tf-found-4',
    type: 'true-false',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    question: (
      <>
        Για ένα πραγματικό σήμα <InlineMath>x(t)</InlineMath>, ισχύει{' '}
        <InlineMath>{'X(-f) = X^*(f)'}</InlineMath>.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Conjugate symmetry: για πραγματικά σήματα, η FT έχει
        ζυγό μέτρο και περιττή φάση. Άμεση συνέπεια: αρκεί να γνωρίζουμε το θετικό
        μισό του φάσματος.
      </>
    ),
  },

  // ─────────── AM T/F ───────────
  {
    id: 'tf-am-1',
    type: 'true-false',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    question: (
      <>
        Στο conventional AM με <InlineMath>{'\\mu > 1'}</InlineMath>, ο envelope
        detector ανακτά πιστά το <InlineMath>m(t)</InlineMath>.
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Όταν <InlineMath>{'\\mu > 1'}</InlineMath>{' '}
        (overmodulation), το envelope <InlineMath>{'|A_c + m(t)|'}</InlineMath>{' '}
        παραμορφώνεται από την απόλυτη τιμή — ο detector βλέπει «αναποδογυρισμένα» τα
        αρνητικά μέρη. Χρειάζεται <InlineMath>{'\\mu \\leq 1'}</InlineMath> για σωστή
        ανίχνευση.
      </>
    ),
  },
  {
    id: 'tf-am-2',
    type: 'true-false',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/dsb-sc'],
    question: (
      <>
        Το DSB-SC έχει efficiency <InlineMath>{'\\eta = 100\\%'}</InlineMath>.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Όλη η εκπεμπόμενη ισχύς είναι στις sidebands — δεν
        υπάρχει carrier στην έξοδο. Σε αντάλλαγμα χάνουμε τη δυνατότητα envelope
        detection — απαιτείται coherent demodulation.
      </>
    ),
  },
  {
    id: 'tf-am-3',
    type: 'true-false',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/ssb', 'modulation/bridge'],
    question: <>Το SSB-AM χρειάζεται Hilbert transform για να παραχθεί.</>,
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Στη μέθοδο phase-shift, το{' '}
        <InlineMath>{'\\hat m(t) = \\mathcal{H}\\{m(t)\\}'}</InlineMath> δίνει το
        quadrature κομμάτι:{' '}
        <InlineMath>{'x_{SSB}(t) = A_c m\\cos(2\\pi f_c t) \\mp A_c \\hat m \\sin(2\\pi f_c t)'}</InlineMath>.
        (Η εναλλακτική filter-method δεν χρειάζεται Hilbert αλλά απαιτεί απότομα φίλτρα.)
      </>
    ),
  },
  {
    id: 'tf-am-4',
    type: 'true-false',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional'],
    question: (
      <>
        Το bandwidth ενός conventional AM σήματος είναι ίσο με αυτό του message{' '}
        <InlineMath>m(t)</InlineMath>.
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Είναι <strong>διπλάσιο</strong>:{' '}
        <InlineMath>{'B_{AM} = 2W'}</InlineMath>. Η AM παράγει δύο sidebands
        (USB + LSB) γύρω από <InlineMath>{'f_c'}</InlineMath>, καθεμιά πλάτους W.
      </>
    ),
  },

  // ─────────── FM T/F ───────────
  {
    id: 'tf-fm-1',
    type: 'true-false',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea'],
    question: (
      <>
        Το envelope ενός FM σήματος είναι σταθερό <InlineMath>{'V(t) = A_c'}</InlineMath>.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Όλη η πληροφορία ζει στη φάση,{' '}
        <InlineMath>{'\\sqrt{x_I^2 + x_Q^2} = A_c\\sqrt{\\cos^2\\phi + \\sin^2\\phi} = A_c'}</InlineMath>.
        Αυτό είναι το θεμέλιο της ανθεκτικότητας στον amplitude θόρυβο.
      </>
    ),
  },
  {
    id: 'tf-fm-2',
    type: 'true-false',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/bessel'],
    question: (
      <>
        Στο FM single-tone, ο carrier εξαφανίζεται για{' '}
        <InlineMath>{'\\beta = \\pi'}</InlineMath>.
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Ο carrier (<InlineMath>{'J_0(\\beta) = 0'}</InlineMath>) εξαφανίζεται στις{' '}
        <strong>ρίζες της Bessel J₀</strong>: β ≈ 2.405, 5.520, 8.654, ...{' '}
        — όχι σε ακριβές πολλαπλάσιο του <InlineMath>π</InlineMath>.
      </>
    ),
  },
  {
    id: 'tf-fm-3',
    type: 'true-false',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/in-noise', 'am/modulator-demodulator'],
    question: (
      <>
        Για το ίδιο επίπεδο εκπεμπόμενης ισχύος, η FM δίνει καλύτερο{' '}
        <InlineMath>{'SNR_{out}'}</InlineMath> από την AM.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> FM gain over AM (μ=1):{' '}
        <InlineMath>{'G = 9\\beta^2'}</InlineMath>. Για β = 5 (εμπορικό FM ραδιόφωνο){' '}
        <InlineMath>{'G = 225 \\to 23.5'}</InlineMath> dB. Το trade-off είναι το
        bandwidth (FM χρειάζεται πολύ μεγαλύτερο spectrum).
      </>
    ),
  },
  {
    id: 'tf-fm-4',
    type: 'true-false',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/pm', 'fm/idea'],
    question: (
      <>
        Αν στον είσοδο ενός PM modulator βάλεις το ολοκλήρωμα του message{' '}
        <InlineMath>{'\\int m\\, d\\tau'}</InlineMath>, η έξοδος είναι FM-modulated.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Είναι η <em>δυϊκότητα PM/FM</em>: integrator πριν τον
        PM modulator δίνει FM. Διαφορετικά πρέπει differentiator πριν τον FM modulator
        για PM. Με <InlineMath>{'K_p = 2\\pi K_f'}</InlineMath> τα δύο σήματα είναι
        πανομοιότυπα.
      </>
    ),
  },

  // ─────────── Random + Noise T/F ───────────
  {
    id: 'tf-noise-1',
    type: 'true-false',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/white-noise'],
    question: <>Ο λευκός θόρυβος είναι πάντα Gaussian.</>,
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος — κλασική παγίδα εξετάσεων.</strong> «Λευκός» αναφέρεται στο{' '}
        <em>σχήμα της PSD</em> (επίπεδη), «Gaussian» στην <em>κατανομή πλάτους</em>.
        Είναι ξεχωριστές ιδιότητες. Π.χ. uniform-amplitude white noise είναι λευκός
        αλλά όχι Gaussian. Στην πράξη ο θερμικός θόρυβος είναι και τα δύο, αλλά
        τυπικά αυτό αναφέρεται ξεχωριστά (AWGN).
      </>
    ),
  },
  {
    id: 'tf-noise-2',
    type: 'true-false',
    topic: 'noise',
    difficulty: 'easy',
    prerequisites: ['noise/sources'],
    question: (
      <>
        Η ισχύς θερμικού θορύβου σε αντιστάτη R, θερμοκρασία T, bandwidth B είναι{' '}
        <InlineMath>{'P = kTB'}</InlineMath>.
      </>
    ),
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Η εξίσωση Johnson-Nyquist. Σε{' '}
        <InlineMath>{'T_0 = 290'}</InlineMath> K, <InlineMath>{'N_0 = kT_0 \\approx -174'}</InlineMath>{' '}
        dBm/Hz.
      </>
    ),
  },
  {
    id: 'tf-noise-3',
    type: 'true-false',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/through-filters', 'randomness/psd'],
    question: (
      <>
        Αν WSS process <InlineMath>X(t)</InlineMath> με PSD <InlineMath>{'S_X(f)'}</InlineMath>{' '}
        περάσει από LTI φίλτρο <InlineMath>H(f)</InlineMath>, η output PSD είναι{' '}
        <InlineMath>{'S_Y(f) = H(f) S_X(f)'}</InlineMath>.
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Είναι <InlineMath>{'S_Y(f) = |H(f)|^2 S_X(f)'}</InlineMath>{' '}
        — με το <em>squared magnitude</em>. Η φάση του φίλτρου δεν εμφανίζεται γιατί
        η PSD είναι μη αρνητική και πραγματική.
      </>
    ),
  },
  {
    id: 'tf-random-1',
    type: 'true-false',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/stationarity'],
    question: <>Κάθε ergodic process είναι WSS.</>,
    correctAnswer: true,
    explanation: (
      <>
        <strong>Σωστό.</strong> Ergodicity απαιτεί ο time-average να ισούται με
        ensemble-average — αν το ensemble-average άλλαζε με τον χρόνο, αυτό δεν θα
        ήταν δυνατό. Άρα ergodic ⇒ WSS. Το αντίστροφο όμως <em>δεν</em> ισχύει
        (random-DC process είναι WSS αλλά όχι ergodic).
      </>
    ),
  },
  {
    id: 'tf-random-2',
    type: 'true-false',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/random-processes'],
    question: (
      <>
        Δύο ασυσχέτιστα (uncorrelated) random processes είναι πάντα ορθογώνια
        (orthogonal).
      </>
    ),
    correctAnswer: false,
    explanation: (
      <>
        <strong>Λάθος.</strong> Orthogonal ⇔ <InlineMath>{'R_{XY} = 0'}</InlineMath>.
        Uncorrelated ⇔ <InlineMath>{'C_{XY} = R_{XY} - \\mu_X \\mu_Y = 0'}</InlineMath>.
        Συμπίπτουν μόνο όταν τουλάχιστον ένα από τα δύο έχει zero mean.
      </>
    ),
  },

  // ─────────── Multiple Choice ───────────
  {
    id: 'mcq-fm-bessel-zero',
    type: 'multiple-choice',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/bessel'],
    question: <>Ποια είναι η πρώτη ρίζα της Bessel J₀ (πρώτη τιμή του β όπου ο carrier εξαφανίζεται);</>,
    choices: [
      <>≈ 1.84</>,
      <>≈ 2.405</>,
      <>≈ 3.14</>,
      <>≈ 5.52</>,
    ],
    correctAnswer: 1,
    explanation: (
      <>
        Η πρώτη ρίζα είναι <strong>β ≈ 2.405</strong>. Επόμενες: 5.520, 8.654, ... .
        Συχνή ερώτηση εξετάσεων.
      </>
    ),
  },
  {
    id: 'mcq-fm-carson',
    type: 'multiple-choice',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/carson'],
    question: (
      <>
        FM σήμα με <InlineMath>{'\\Delta f = 75'}</InlineMath> kHz και{' '}
        <InlineMath>{'W = 15'}</InlineMath> kHz. Carson bandwidth;
      </>
    ),
    choices: [
      <>90 kHz</>,
      <>150 kHz</>,
      <>180 kHz</>,
      <>200 kHz</>,
    ],
    correctAnswer: 2,
    explanation: (
      <>
        <InlineMath>{'B = 2(\\Delta f + W) = 2(75 + 15) = 180'}</InlineMath> kHz.
        (Εμπορικό FM ραδιόφωνο: spacing 200 kHz με guard band ~20 kHz.)
      </>
    ),
  },
  {
    id: 'mcq-am-eta',
    type: 'multiple-choice',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional'],
    question: (
      <>
        Conventional AM, single-tone message, <InlineMath>{'\\mu = 1'}</InlineMath>.
        Μέγιστη ενεργειακή απόδοση η;
      </>
    ),
    choices: [
      <>≈ 16.7%</>,
      <>≈ 25%</>,
      <>≈ 33.3%</>,
      <>≈ 50%</>,
    ],
    correctAnswer: 2,
    explanation: (
      <>
        <InlineMath>{'\\eta = \\mu^2/(2 + \\mu^2) = 1/3 \\approx 33.3\\%'}</InlineMath>.
        Αυτή είναι η <em>θεωρητική μέγιστη</em> για conventional AM — γι' αυτό η AM
        είναι «σπάταλη» σε ισχύ.
      </>
    ),
  },
  {
    id: 'mcq-filter-class',
    type: 'multiple-choice',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/filters'],
    question: (
      <>
        Φίλτρο με <InlineMath>{'|H(f)| = 1'}</InlineMath> για{' '}
        <InlineMath>{'f_1 \\leq |f| \\leq f_2'}</InlineMath> και 0 αλλιώς. Τι τύπος
        φίλτρου είναι;
      </>
    ),
    choices: [
      <>Lowpass (LP)</>,
      <>Highpass (HP)</>,
      <>Bandpass (BP)</>,
      <>Bandstop (BS)</>,
    ],
    correctAnswer: 2,
    explanation: (
      <>
        <strong>Bandpass (ζωνοπερατό).</strong> Επιτρέπει συχνότητες σε μια ζώνη
        γύρω από κάποιο <InlineMath>{'f_c = (f_1 + f_2)/2'}</InlineMath>, κόβει τα
        υπόλοιπα. Χρησιμοποιείται στο front-end κάθε ραδιοφωνικού δέκτη.
      </>
    ),
  },
  {
    id: 'mcq-noise-floor',
    type: 'multiple-choice',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/sources'],
    question: <>Noise floor σε room temperature (T = 290 K) ανά Hz bandwidth;</>,
    choices: [
      <>−114 dBm/Hz</>,
      <>−134 dBm/Hz</>,
      <>−154 dBm/Hz</>,
      <>−174 dBm/Hz</>,
    ],
    correctAnswer: 3,
    explanation: (
      <>
        <strong>−174 dBm/Hz.</strong>{' '}
        <InlineMath>{'kT_0 = 1.38\\times 10^{-23}\\cdot 290 \\approx 4\\times 10^{-21}'}</InlineMath>{' '}
        W/Hz = -174 dBm/Hz. Αυτό το νούμερο πρέπει να το ξέρεις απέξω.
      </>
    ),
  },
  {
    id: 'mcq-fm-snr-gain',
    type: 'multiple-choice',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/in-noise'],
    question: (
      <>
        FM σήμα με <InlineMath>{'\\beta = 5'}</InlineMath>. FM SNR gain over AM (με{' '}
        <InlineMath>{'\\mu = 1'}</InlineMath>);
      </>
    ),
    choices: [
      <>15 dB</>,
      <>23.5 dB</>,
      <>30 dB</>,
      <>45 dB</>,
    ],
    correctAnswer: 1,
    explanation: (
      <>
        <InlineMath>{'G = 9\\beta^2 = 9\\cdot 25 = 225 \\to 10\\log(225) \\approx 23.5'}</InlineMath> dB.
        Αυτό είναι το «trade-off bandwidth vs SNR» που κάνει την FM ελκυστική για
        high-fidelity audio.
      </>
    ),
  },
  {
    id: 'mcq-pm-vs-fm-dual',
    type: 'multiple-choice',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/pm'],
    question: <>Αν θέλεις να φτιάξεις FM-modulated σήμα χρησιμοποιώντας PM modulator, τι πρέπει να βάλεις στην είσοδο;</>,
    choices: [
      <>Το ίδιο το <InlineMath>m(t)</InlineMath></>,
      <>Το παράγωγο <InlineMath>{'dm/dt'}</InlineMath></>,
      <>Το ολοκλήρωμα <InlineMath>{'\\int m\\, d\\tau'}</InlineMath></>,
      <>Το <InlineMath>{'m(t)\\cos(2\\pi f_c t)'}</InlineMath></>,
    ],
    correctAnswer: 2,
    explanation: (
      <>
        <strong>Ολοκλήρωμα.</strong> PM/FM duality: integrator πριν τον PM modulator
        παράγει FM. Αντίστροφα, differentiator πριν τον FM modulator παράγει PM.
      </>
    ),
  },
  {
    id: 'mcq-am-coherent-phase',
    type: 'multiple-choice',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/dsb-sc'],
    question: (
      <>
        Coherent demodulation ενός DSB-SC σήματος με phase error <InlineMath>{'\\Delta\\phi = 90°'}</InlineMath>.
        Έξοδος;
      </>
    ),
    choices: [
      <><InlineMath>{'m(t)/2'}</InlineMath></>,
      <><InlineMath>{'m(t)'}</InlineMath></>,
      <>0</>,
      <><InlineMath>{'-m(t)'}</InlineMath></>,
    ],
    correctAnswer: 2,
    explanation: (
      <>
        <strong>Μηδέν!</strong> Έξοδος ∝ <InlineMath>{'\\cos(\\Delta\\phi)'}</InlineMath>{' '}
        και <InlineMath>{'\\cos(90°) = 0'}</InlineMath>. Αυτό είναι το <em>quadrature null</em>{' '}
        — γι' αυτό η DSB-SC χρειάζεται αυστηρό συγχρονισμό φάσης (PLL).
      </>
    ),
  },
]
