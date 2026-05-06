/**
 * Worked exercise bank — statement + step-by-step solution for each.
 *
 * Sources are a mix of:
 *  - Lecture worked examples (sessions 14, 15, 10) → no `source` tag
 *  - Past-exam problems → `source` tag with the year
 *
 * Add new exercises to the `EXERCISES` array; the `/practice` page renders
 * everything filterable.
 */

import { BlockMath, InlineMath } from '@/components/math'
import type { Exercise } from './types'

export const EXERCISES: Exercise[] = [
  // ─────────────────────────── AM exercises ───────────────────────────
  {
    id: 'am-1',
    title: 'Modulation index μ για διάφορα A_c',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    statement: (
      <p>
        Δίνεται <InlineMath>{'m(t) = a\\sin(\\pi t / 4)'}</InlineMath> με{' '}
        <InlineMath>{'a = 0.5'}</InlineMath>, <InlineMath>{'f_c = 2'}</InlineMath> Hz.
        Να βρεθεί το διαμορφωμένο AM σήμα και ο modulation index{' '}
        <InlineMath>μ</InlineMath> για κάθε{' '}
        <InlineMath>{'A_c \\in \\{2, 1, 0.75, 0.5, 0.33, 0.25\\}'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>Το AM σήμα είναι:</p>
        <BlockMath>
          {'x(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = \\left[A_c + 0.5\\sin\\!\\left(\\tfrac{\\pi}{4}t\\right)\\right]\\cos(4\\pi t)'}
        </BlockMath>
        <p>
          Σε κανονικοποιημένη μορφή{' '}
          <InlineMath>{'x = A_c[1 + (0.5/A_c)\\sin(\\pi t/4)]\\cos(4\\pi t)'}</InlineMath>,
          άρα <InlineMath>{'\\mu = 0.5/A_c'}</InlineMath>.
        </p>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left"><InlineMath>{'A_c'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'\\mu = 0.5/A_c'}</InlineMath></th>
              <th className="py-2 text-left">Καθεστώς</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>2</td><td>0.25</td><td>Ασθενής διαμόρφωση</td></tr>
            <tr><td>1</td><td>0.50</td><td>Μέτρια</td></tr>
            <tr><td>0.75</td><td>0.66</td><td>Έντονη αλλά εντός ορίου</td></tr>
            <tr><td>0.5</td><td>1.00</td><td>Όριο μ = 1</td></tr>
            <tr className="text-rose-600 dark:text-rose-400"><td>0.33</td><td>1.51</td><td>⚠️ Overmodulation</td></tr>
            <tr className="text-rose-600 dark:text-rose-400"><td>0.25</td><td>2.00</td><td>⚠️ Ισχυρή overmodulation</td></tr>
          </tbody>
        </table>
        <p>
          Όταν <InlineMath>{'A_c < 0.5'}</InlineMath> έχουμε overmodulation —
          ο envelope detector δεν θα μπορεί να ανακτήσει σωστά το{' '}
          <InlineMath>m(t)</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'am-2',
    title: 'm(t) και ενέργεια από φάσμα-τρίγωνο',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional', 'foundations/fourier-transform'],
    statement: (
      <p>
        Το φάσμα <InlineMath>X(f)</InlineMath> ενός AM σήματος έχει δύο τρίγωνα ύψους{' '}
        <InlineMath>{'A/2 = 10^{-4}'}</InlineMath> στις <InlineMath>{'\\pm 100'}</InlineMath> kHz
        με βάση 10 kHz. Δίνεται <InlineMath>{'f_c = 100'}</InlineMath> kHz,{' '}
        <InlineMath>{'A_c = 1'}</InlineMath>. Βρες <InlineMath>m(t)</InlineMath> και
        την ενέργεια αν αφαιρεθεί ο carrier.
      </p>
    ),
    solution: (
      <>
        <p>
          Το AM φάσμα είναι{' '}
          <InlineMath>{'X(f) = \\tfrac{1}{2}[M(f-f_c) + M(f+f_c)] + \\tfrac{A_c}{2}[\\delta(f-f_c)+\\delta(f+f_c)]'}</InlineMath>.
          Από το σχήμα,{' '}
          <InlineMath>{'M(f) = 2\\cdot 10^{-4}\\,\\Lambda(f/(5\\cdot 10^3))'}</InlineMath>{' '}
          (τρίγωνο πλάτους 5 kHz).
        </p>
        <p>Από τον FT pair <InlineMath>{'\\Lambda(t/T) \\leftrightarrow T\\,\\mathrm{sinc}^2(fT)'}</InlineMath>:</p>
        <BlockMath>{'m(t) = \\mathrm{sinc}^2(5000\\, t)'}</BlockMath>
        <p>
          Ενέργεια χωρίς carrier (Parseval):{' '}
          <InlineMath>{'\\mathcal{E} \\approx 66.67\\,\\mu J'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'am-3',
    title: 'Μη γραμμικός AM modulator (squarer + BPF)',
    topic: 'am',
    difficulty: 'hard',
    source: 'proodos-b',
    prerequisites: ['am/modulator-demodulator', 'foundations/filters'],
    statement: (
      <p>
        AM modulator με μη γραμμικό στοιχείο{' '}
        <InlineMath>{'y = \\tfrac{1}{2}x^2'}</InlineMath>. Δίνεται{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)\\cos(2\\pi W t)'}</InlineMath>,{' '}
        <InlineMath>{'f_c = 10W'}</InlineMath>. Σχεδίασε τον modulator και
        υπολόγισε τον συντελεστή <InlineMath>A</InlineMath> ώστε{' '}
        <InlineMath>{'\\mu = 0.5'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Είσοδος: <InlineMath>{'u(t) = m(t) + A\\cos(2\\pi f_c t)'}</InlineMath>.
          Squarer δίνει:{' '}
          <InlineMath>{'y = \\tfrac{1}{2}(m^2 + 2Am\\cos(2\\pi f_c t) + A^2\\cos^2(2\\pi f_c t))'}</InlineMath>.
        </p>
        <p>
          Διασπασμένο: (i) <InlineMath>{'\\tfrac{1}{2}m^2'}</InlineMath> στο baseband + στις{' '}
          <InlineMath>{'\\pm 2W'}</InlineMath>, (ii){' '}
          <InlineMath>{'A m\\cos(2\\pi f_c t)'}</InlineMath> = το AM σήμα γύρω από{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath>, (iii){' '}
          <InlineMath>{'\\tfrac{A^2}{4}[1 + \\cos(4\\pi f_c t)]'}</InlineMath> = DC + όροι στις{' '}
          <InlineMath>{'\\pm 2 f_c'}</InlineMath>.
        </p>
        <p>
          BPF γύρω από <InlineMath>{'f_c'}</InlineMath> με bandwidth ~2W κρατάει μόνο τον AM όρο{' '}
          <InlineMath>{'z(t) = A m(t)\\cos(2\\pi f_c t)'}</InlineMath> (DSB-SC, χωρίς carrier).
          Για conventional AM χρειάζεται και ο σκέτος carrier (διαφορετική διάταξη).
        </p>
        <p>
          Για <InlineMath>{'\\mu = A\\cdot \\max|m| / A_c = 0.5'}</InlineMath> με{' '}
          <InlineMath>{'A_c = 1, \\max|m| = 1'}</InlineMath> → <InlineMath>{'A = 0.5'}</InlineMath>.
        </p>
      </>
    ),
  },

  // ─────────────────────────── FM exercises ───────────────────────────
  {
    id: 'fm-1',
    title: 'PM και FM στον χρόνο για single-tone message',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea', 'fm/pm'],
    statement: (
      <p>
        <InlineMath>{'m(t) = \\alpha\\cos(2\\pi f_m t)'}</InlineMath>. Να βρεθούν τα
        διαμορφωμένα PM και FM σήματα για carrier της επιλογής σου.
      </p>
    ),
    solution: (
      <>
        <p><strong>PM</strong> με <InlineMath>{'\\phi(t) = K_p m(t)'}</InlineMath>:</p>
        <BlockMath>{'x_{PM}(t) = A_c\\cos[2\\pi f_c t + \\beta_p\\cos(2\\pi f_m t)], \\quad \\beta_p = K_p\\alpha'}</BlockMath>
        <p><strong>FM</strong> με <InlineMath>{'\\phi(t) = 2\\pi K_f \\int^t \\alpha\\cos(2\\pi f_m\\tau)d\\tau'}</InlineMath>:</p>
        <BlockMath>{'x_{FM}(t) = A_c\\cos[2\\pi f_c t + \\beta_f\\sin(2\\pi f_m t)], \\quad \\beta_f = K_f\\alpha/f_m'}</BlockMath>
        <p>
          Διαφορά: <InlineMath>cos</InlineMath> vs <InlineMath>sin</InlineMath> μέσα στη φάση
          (90° μετατόπιση από το ολοκλήρωμα του cosine).
        </p>
      </>
    ),
  },
  {
    id: 'fm-2',
    title: "Carson bandwidth για sinc message",
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/idea', 'fm/carson'],
    statement: (
      <p>
        <InlineMath>{'m(t) = 10\\,\\mathrm{sinc}(10^4 t)'}</InlineMath>. Υπολόγισε το
        Carson bandwidth ενός FM σήματος με <InlineMath>{'K_f = 4'}</InlineMath> kHz/V.
      </p>
    ),
    solution: (
      <>
        <p>
          <InlineMath>{'M(f) = 10^{-3}\\,\\Pi(f/10^4)'}</InlineMath> →{' '}
          <InlineMath>{'W = 5'}</InlineMath> kHz, <InlineMath>{'\\max|m| = 10'}</InlineMath>.
        </p>
        <BlockMath>{'\\beta_f = \\frac{K_f \\max|m|}{W} = \\frac{4000\\cdot 10}{5000} = 8'}</BlockMath>
        <BlockMath>{'B = 2W(\\beta_f + 1) = 2\\cdot 5000\\cdot 9 = 90\\text{ kHz}'}</BlockMath>
      </>
    ),
  },
  {
    id: 'fm-3',
    title: 'Ισχύς FM σήματος μετά από στενό BPF',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/bessel', 'fm/carson'],
    statement: (
      <p>
        <InlineMath>{'m(t) = 8\\cos(16\\pi t)'}</InlineMath>,{' '}
        <InlineMath>{'K_f = 10'}</InlineMath> Hz/V,{' '}
        <InlineMath>{'A_c = 8, f_c = 2'}</InlineMath> kHz. Το FM σήμα περνάει από BPF με{' '}
        <InlineMath>{'f_c = 2'}</InlineMath> kHz και bandwidth 64 Hz. Βρες την ισχύ
        στην έξοδο και το ποσοστό σε σχέση με την είσοδο.
      </p>
    ),
    solution: (
      <>
        <p>
          <InlineMath>{'f_m = 8'}</InlineMath> Hz, <InlineMath>{'W = 8'}</InlineMath> Hz,{' '}
          <InlineMath>{'\\beta_f = K_f\\cdot 8/8 = 10'}</InlineMath>. Το FM φάσμα έχει
          γραμμές στις <InlineMath>{'2000 + 8n'}</InlineMath> Hz.
        </p>
        <p>
          BPF bandwidth 64 Hz → αφήνει <InlineMath>{'|n f_m| \\leq 32'}</InlineMath>{' '}
          → <InlineMath>{'|n| \\leq 4'}</InlineMath>.
        </p>
        <BlockMath>
          {'P_u = \\frac{8^2}{2}\\!\\left[J_0^2(10) + 2\\sum_{n=1}^{4} J_n^2(10)\\right] \\approx 11.1\\text{ W}'}
        </BlockMath>
        <p>
          Συνολική: <InlineMath>{'P_x = A_c^2/2 = 32'}</InlineMath> W. Ποσοστό:{' '}
          <strong>~34.7%</strong>. Το BPF είναι «πολύ στενό» για{' '}
          <InlineMath>{'\\beta = 10'}</InlineMath>{' '}
          (Carson προβλέπει 176 Hz vs τα 64 Hz μας).
        </p>
      </>
    ),
  },

  // ─────────────────────── Random process exercises ───────────────────────
  {
    id: 'rp-1',
    title: 'Joint statistics δύο τυχαίων διαδικασιών',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/random-processes', 'randomness/stationarity'],
    statement: (
      <p>
        <InlineMath>{'X(t) = A\\cos(2\\pi f_1 t + \\phi)'}</InlineMath> με{' '}
        <InlineMath>{'\\phi \\sim U[0, \\pi]'}</InlineMath>· {' '}
        <InlineMath>{'Y(t) = \\alpha\\cos(2\\pi f_2 t)'}</InlineMath> με{' '}
        <InlineMath>{'\\alpha \\sim U[0, 2]'}</InlineMath>. Τα{' '}
        <InlineMath>{'\\phi, \\alpha'}</InlineMath>{' '}
        ανεξάρτητα. Βρες <InlineMath>{'m_X(t), m_Y(t), R_X(t_1, t_2), R_{XY}(t_1, t_2), C_{XY}(t_1, t_2)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>m_X(t)</strong>: ολοκλήρωμα <InlineMath>cos</InlineMath> πάνω σε{' '}
          <InlineMath>{'[0, \\pi]'}</InlineMath> (όχι ολόκληρη περίοδο):
        </p>
        <BlockMath>{'m_X(t) = \\frac{A}{\\pi}[\\sin(2\\pi f_1 t + \\pi) - \\sin(2\\pi f_1 t)] = -\\frac{2A}{\\pi}\\sin(2\\pi f_1 t)'}</BlockMath>
        <p>Όχι σταθερός → <strong>X(t) ΔΕΝ είναι WSS</strong>.</p>
        <p>
          <strong>m_Y(t)</strong>:{' '}
          <InlineMath>{'= \\cos(2\\pi f_2 t)\\int_0^2 (\\alpha/2) d\\alpha = \\cos(2\\pi f_2 t)'}</InlineMath>.
          Επίσης όχι WSS.
        </p>
        <p>
          <strong>R_X(t₁,t₂)</strong>: product-to-sum, ο όρος με{' '}
          <InlineMath>{'2\\phi'}</InlineMath> εξαφανίζεται (ολόκληρη περίοδος):
        </p>
        <BlockMath>{'R_X(t_1, t_2) = \\frac{A^2}{2}\\cos(2\\pi f_1 (t_1 - t_2))'}</BlockMath>
        <p>
          <strong>R_XY(t₁,t₂)</strong>: από ανεξαρτησία,{' '}
          <InlineMath>{'E[XY] = E[X]E[Y]'}</InlineMath>:
        </p>
        <BlockMath>{'R_{XY}(t_1, t_2) = m_X(t_1)\\, m_Y(t_2) = -\\frac{2A}{\\pi}\\sin(2\\pi f_1 t_1)\\cos(2\\pi f_2 t_2)'}</BlockMath>
        <p><strong>C_XY(t₁,t₂)</strong>:</p>
        <BlockMath>{'C_{XY} = R_{XY} - m_X m_Y = 0'}</BlockMath>
        <p>
          Τα <InlineMath>X, Y</InlineMath> είναι <strong>uncorrelated</strong> (αφού{' '}
          <InlineMath>{'\\phi, \\alpha'}</InlineMath> ανεξάρτητα), αλλά{' '}
          <strong>όχι orthogonal</strong> (<InlineMath>{'R_{XY} \\neq 0'}</InlineMath>).
        </p>
      </>
    ),
  },
  {
    id: 'rp-2',
    title: 'Ergodicity του random-phase cosine',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/stationarity'],
    statement: (
      <p>
        <InlineMath>{'Z(t) = A\\cos(2\\pi f t + \\theta)'}</InlineMath> με{' '}
        <InlineMath>{'A, f'}</InlineMath> σταθερά και{' '}
        <InlineMath>{'\\theta \\sim U[0, 2\\pi]'}</InlineMath>. Δείξε ότι είναι WSS και
        ergodic στον μέσο και την αυτοσυσχέτιση.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>WSS</strong>: <InlineMath>{'m_Z(t) = 0'}</InlineMath> (ολοκλήρωμα cos σε ολόκληρη περίοδο),{' '}
          <InlineMath>{'R_Z(\\tau) = (A^2/2)\\cos(2\\pi f \\tau)'}</InlineMath> εξαρτάται μόνο από{' '}
          <InlineMath>{'\\tau'}</InlineMath>. ✓
        </p>
        <p>
          <strong>Ergodic στον μέσο</strong>: time-average{' '}
          <InlineMath>{'(1/T)\\int_{-T/2}^{T/2} A\\cos(2\\pi f t + \\theta_i)\\, dt = (A/2\\pi f T)[\\sin(\\ldots)]_{-T/2}^{T/2}'}</InlineMath>
          → 0 καθώς <InlineMath>{'T \\to \\infty'}</InlineMath> (αριθμητής φραγμένος, παρονομαστής →∞). ✓
        </p>
        <p>
          <strong>Ergodic στην αυτοσυσχέτιση</strong>: product-to-sum δίνει{' '}
          <InlineMath>{'(A^2/2)\\cos(2\\pi f\\tau) + \\text{όρος που σβήνει με 1/T}'}</InlineMath>{' '}
          → ταυτίζεται με <InlineMath>{'R_Z(\\tau)'}</InlineMath>. ✓
        </p>
        <p>
          Ισχύει για <strong>όλες</strong> τις realizations{' '}
          <InlineMath>{'\\theta_i'}</InlineMath>{' '}
          → ergodic. Άρα μία μακροχρόνια καταγραφή αρκεί για όλη τη στατιστική.
        </p>
      </>
    ),
  },

  // ────────────────────── Past exam problems ──────────────────────
  {
    id: 'past-am-mux-jan26',
    title: 'AM Multiplexing — m=sinc, k=Π σε δύο κανάλια',
    topic: 'am',
    difficulty: 'hard',
    source: 'jan-2026',
    prerequisites: ['am/multiplexing', 'am/dsb-sc', 'foundations/fourier-transform'],
    statement: (
      <p>
        Δύο μηνύματα <InlineMath>{'m_1(t) = \\mathrm{sinc}(2Wt)'}</InlineMath> και{' '}
        <InlineMath>{'m_2(t) = \\Pi(4Wt)'}</InlineMath> διαμορφώνονται κατά DSB-SC σε
        carrier συχνότητες <InlineMath>{'f_1 = 5W'}</InlineMath> και{' '}
        <InlineMath>{'f_2 = ?'}</InlineMath>. Ζητείται το ελάχιστο{' '}
        <InlineMath>{'f_2'}</InlineMath> ώστε να μην επικαλύπτονται τα φάσματα, και να
        σχεδιαστεί το συνολικό φάσμα <InlineMath>G(f)</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Bandwidth: <InlineMath>{'M_1 = (1/(2W))\\Pi(f/(2W))'}</InlineMath> έχει υποστήριξη{' '}
          <InlineMath>{'|f| \\leq W'}</InlineMath>.{' '}
          <InlineMath>{'M_2'}</InlineMath> είναι sinc χωρίς αυστηρή υποστήριξη — practically{' '}
          <InlineMath>{'|f| \\leq 2W'}</InlineMath>.
        </p>
        <p>
          DSB-SC κάθε καναλιού καταλαμβάνει <InlineMath>{'2W'}</InlineMath> και{' '}
          <InlineMath>{'4W'}</InlineMath>{' '}
          γύρω από τα carriers αντίστοιχα. Για non-overlap:
        </p>
        <BlockMath>{'f_2 - 2W \\geq f_1 + W \\Rightarrow f_2 \\geq f_1 + 3W = 8W'}</BlockMath>
        <p>
          Ελάχιστο <InlineMath>{'f_2 = 8W'}</InlineMath>. Το συνολικό φάσμα{' '}
          <InlineMath>G(f)</InlineMath> έχει triangular replicas στις{' '}
          <InlineMath>{'\\pm 5W'}</InlineMath> (από{' '}
          <InlineMath>{'m_1'}</InlineMath>) και rect replicas στις{' '}
          <InlineMath>{'\\pm 8W'}</InlineMath> (από <InlineMath>{'m_2'}</InlineMath>).
        </p>
      </>
    ),
  },
  {
    id: 'past-am-power-sept25',
    title: 'AM modulation index + power calculation',
    topic: 'am',
    difficulty: 'easy',
    source: 'sept-2025',
    prerequisites: ['am/conventional'],
    statement: (
      <p>
        AM σήμα με <InlineMath>{'A_c = 100'}</InlineMath> V,{' '}
        <InlineMath>{'\\mu = 0.6'}</InlineMath>, message ισχύος{' '}
        <InlineMath>{'P_m = 0.5'}</InlineMath> W (κανονικοποιημένο). Υπολόγισε{' '}
        <InlineMath>{'P_T'}</InlineMath>, <InlineMath>{'P_{sb}'}</InlineMath>{' '}
        (ισχύς sidebands), και <InlineMath>η</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <BlockMath>{'P_T = \\frac{A_c^2}{2}(1 + \\mu^2 P_m) = \\frac{10000}{2}(1 + 0.36\\cdot 0.5) = 5000\\cdot 1.18 = 5900\\text{ W}'}</BlockMath>
        <BlockMath>{'P_{sb} = \\frac{A_c^2 \\mu^2 P_m}{2} = 5000\\cdot 0.18 = 900\\text{ W}'}</BlockMath>
        <BlockMath>{'\\eta = \\frac{P_{sb}}{P_T} = \\frac{900}{5900} \\approx 15.3\\%'}</BlockMath>
        <p>
          Πάντα <InlineMath>{'\\eta \\leq 1/3 \\approx 33\\%'}</InlineMath> για conventional AM
          (μέγιστο στο <InlineMath>{'\\mu = 1, P_m = 1'}</InlineMath>).
        </p>
      </>
    ),
  },
  {
    id: 'past-fm-bessel-june25',
    title: 'FM single-tone — β, Carson, πρώτες 3 sidebands',
    topic: 'fm',
    difficulty: 'medium',
    source: 'june-2025',
    prerequisites: ['fm/idea', 'fm/bessel', 'fm/carson'],
    statement: (
      <p>
        <InlineMath>{'s(t) = 10\\cos[2\\pi(100\\,000)t + 2.5\\sin(2\\pi(2000)t)]'}</InlineMath> V.
        Βρες <InlineMath>{'A_c, f_c, f_m, \\beta_f'}</InlineMath>, το Carson bandwidth, και τα
        πλάτη των πρώτων 3 ζευγών sidebands. Δίνεται{' '}
        <InlineMath>{'J_0(2.5)=-0.048, J_1=0.497, J_2=0.446, J_3=0.217'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Σύγκριση με <InlineMath>{'A_c\\cos[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)]'}</InlineMath>:{' '}
          <InlineMath>{'A_c = 10'}</InlineMath> V, <InlineMath>{'f_c = 100'}</InlineMath> kHz,{' '}
          <InlineMath>{'f_m = 2'}</InlineMath> kHz,{' '}
          <InlineMath>{'\\beta_f = 2.5'}</InlineMath>.
        </p>
        <BlockMath>{'B = 2(\\beta + 1) f_m = 2\\cdot 3.5\\cdot 2000 = 14\\text{ kHz}'}</BlockMath>
        <p>Πλάτη <InlineMath>{'A_c |J_n(\\beta)|'}</InlineMath>:</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li><InlineMath>{'n = 0'}</InlineMath>: 0.48 V (carrier — σχεδόν εξαφανίζεται, β ≈ 2.405 ρίζα)</li>
          <li><InlineMath>{'n = \\pm 1'}</InlineMath>: 4.97 V</li>
          <li><InlineMath>{'n = \\pm 2'}</InlineMath>: 4.46 V</li>
          <li><InlineMath>{'n = \\pm 3'}</InlineMath>: 2.17 V</li>
        </ul>
      </>
    ),
  },
  {
    id: 'past-envelope-rc-jan26',
    title: 'Envelope detector — επιλογή RC time constant',
    topic: 'am',
    difficulty: 'medium',
    source: 'jan-2026',
    prerequisites: ['am/modulator-demodulator'],
    statement: (
      <p>
        AM δέκτης: <InlineMath>{'f_c = 1'}</InlineMath> MHz, audio bandwidth{' '}
        <InlineMath>{'W = 5'}</InlineMath> kHz. Πρότεινε εύλογο{' '}
        <InlineMath>RC</InlineMath> για τον envelope detector και αιτιολόγησε τα όρια.
      </p>
    ),
    solution: (
      <>
        <p>Συνθήκη valid envelope detection:</p>
        <BlockMath>{'\\frac{1}{f_c} \\ll RC \\ll \\frac{1}{W}'}</BlockMath>
        <p>
          Εδώ <InlineMath>{'1/f_c = 1\\,\\mu s'}</InlineMath> και{' '}
          <InlineMath>{'1/W = 200\\,\\mu s'}</InlineMath>. Επιλέγουμε{' '}
          <InlineMath>{'RC \\approx 20\\,\\mu s'}</InlineMath> (γεωμετρικός μέσος).
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>Αν RC πολύ μικρό (~1μs): πυκνωτής εκφορτίζεται γρήγορα → ripple στην έξοδο.</li>
          <li>Αν RC πολύ μεγάλο (~200μs): πυκνωτής δεν προλαβαίνει να ακολουθήσει το envelope → clipping.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'past-power-sum-cosines',
    title: 'Ισχύς αθροίσματος cosines σε διαφορετικές συχνότητες',
    topic: 'foundations',
    difficulty: 'easy',
    source: 'proodos-a',
    prerequisites: ['foundations/fourier-series'],
    statement: (
      <p>
        <InlineMath>{'x(t) = 3\\cos(2\\pi\\cdot 100\\, t) + 4\\cos(2\\pi\\cdot 250\\, t) + 2\\cos(2\\pi\\cdot 400\\, t)'}</InlineMath>.
        Βρες την ισχύ του.
      </p>
    ),
    solution: (
      <>
        <p>
          Cosines σε <strong>διαφορετικές συχνότητες</strong> είναι ορθογώνιες, οπότε ισχύει
          Parseval-style άθροισμα:
        </p>
        <BlockMath>{'P_x = \\sum_i \\frac{A_i^2}{2} = \\frac{9}{2} + \\frac{16}{2} + \\frac{4}{2} = 4.5 + 8 + 2 = 14.5\\text{ W}'}</BlockMath>
        <p>
          Δεν υπάρχουν cross-terms γιατί{' '}
          <InlineMath>{'\\int_0^T \\cos(\\omega_i t)\\cos(\\omega_j t) dt = 0'}</InlineMath>{' '}
          για <InlineMath>{'i \\neq j'}</InlineMath>.
        </p>
      </>
    ),
  },
]
