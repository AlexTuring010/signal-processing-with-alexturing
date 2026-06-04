/**
 * Exercise bank — past-exam problems (priority) + lecture worked examples.
 *
 * Past-exam problems are transcribed verbatim from the original papers:
 *   - Πρόοδος · April 2026 (13 problems — most recent midterm)
 *   - Sept 2025 (11 problems)
 *   - Jan 2026 Επί Πτυχίω (16 problems)
 *   - June 2025 Α (16 problems)
 *   - Πρόοδος A · May 2025 (~10 problems — first half of syllabus)
 *   - Πρόοδος B · May 2025 (~12 problems — second half + nonlinear AM)
 *
 * Each problem carries:
 *   - origin: 'past-exam' | 'lecture' | 'ai-generated'
 *   - source + problemNumber + weight (% of exam)
 *   - prerequisites (links into theory sections)
 *   - formulaIds (lights up relevant entries when assist mode is on)
 *
 * AI-generated variations DO NOT GO HERE — they live in `ai-variants.tsx`
 * so students never confuse them with real exam material.
 */

import Link from 'next/link'
import { BlockMath, InlineMath } from '@/components/math'
import { NoiseFilterShapingViz } from '@/components/viz/NoiseFilterShapingViz'
import { ReorderDrill } from '@/components/viz/ReorderDrill'
import { NonlinearModulatorSpectrumViz } from '@/components/viz/NonlinearModulatorSpectrumViz'
import { AMSignalViz } from '@/components/viz/AMSignalViz'
import { AMSpectrumViz } from '@/components/viz/AMSpectrumViz'
import { OvermodulationPhaseReversalViz } from '@/components/viz/OvermodulationPhaseReversalViz'
import { FdmCanonicalProblemViz } from '@/components/viz/FdmCanonicalProblemViz'
import type { Exercise } from './types'

export const EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // ΠΡΟΟΔΟΣ · ΑΠΡΙΛΙΟΣ 2026 (13 problems · 100% · 1 ώρα)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'proodos26-1',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 1',
    weight: 6,
    title: 'Δείκτης διαμόρφωσης από A_c και A_m',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-mu', 'am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και ο
        δείκτης διαμόρφωσης{' '}
        <InlineMath>{'m = A_m / A_c'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>8</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-7"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.7
        </Link>.
      </>
    ),
    statement: (
      <p>
        Αν το πλάτος του φέροντος σήματος είναι 10V και το πλάτος του σήματος
        πληροφορίας είναι 5V, ποιος είναι ο δείκτης διαμόρφωσης{' '}
        <InlineMath>m</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>Από τον ορισμό για ημιτονικό message:</p>
        <BlockMath>{'m = \\frac{A_m}{A_c} = \\frac{5}{10} = 0.5'}</BlockMath>
        <p>
          Δηλαδή 50% modulation, μέσα στα όρια <InlineMath>{'m \\le 1'}</InlineMath>{' '}
          ώστε ο envelope detector να δουλεύει σωστά.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-2',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 2',
    weight: 6,
    title: 'Συνολική ισχύς AM για P_c=100W, m=1',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-power', 'am-mu', 'am-eta'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        η ισχύς{' '}
        <InlineMath>{'P_{AM} = P_c(1 + m^2/2)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>4</strong> παλιά θέματα), ο δείκτης{' '}
        <InlineMath>{'m = A_m / A_c'}</InlineMath>{' '}
        (σε <strong>8</strong>) και η απόδοση{' '}
        <InlineMath>{'\\eta = m^2/(2+m^2) \\le 1/3'}</InlineMath>{' '}
        (σε <strong>3</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 4
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Ποια είναι η συνολική ισχύς <InlineMath>P</InlineMath> ενός σήματος AM
        αν η ισχύς του φέροντος είναι <InlineMath>{'P_c = 100'}</InlineMath> W
        και ο δείκτης διαμόρφωσης <InlineMath>{'m = 1'}</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>Για single-tone modulation:</p>
        <BlockMath>{'P_{AM} = P_c\\left(1 + \\frac{m^2}{2}\\right)'}</BlockMath>
        <p>
          Αντικαθιστώντας <InlineMath>{'P_c = 100'}</InlineMath> W,{' '}
          <InlineMath>{'m = 1'}</InlineMath>:
        </p>
        <BlockMath>{'P_{AM} = 100\\left(1 + \\tfrac{1}{2}\\right) = 150\\text{ W}'}</BlockMath>
        <p>
          Η carrier κουβαλάει 100 W, οι δύο sidebands μαζί άλλα 50 W (25 W η
          κάθε μία). Αυτό είναι και το μέγιστο: παραπάνω από <InlineMath>m=1</InlineMath>{' '}
          δεν μπορούμε να πάμε χωρίς overmodulation.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-3',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 3',
    weight: 6,
    title: 'Τι σημαίνει m=1',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional', 'am/modulator-demodulator'],
    formulaIds: ['am-mu', 'am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και ο
        δείκτης διαμόρφωσης{' '}
        <InlineMath>{'m = A_m / A_c'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>8</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Τι συμβαίνει όταν ο δείκτης διαμόρφωσης{' '}
        <InlineMath>{'m = 1'}</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>
          Το <InlineMath>{'m=1'}</InlineMath> είναι το <strong>όριο πλήρους
          διαμόρφωσης</strong>: το πλάτος του message ισούται με το πλάτος του
          carrier (<InlineMath>{'A_m = A_c'}</InlineMath>), οπότε η περιβάλλουσα{' '}
          <InlineMath>{'A_c + m(t)'}</InlineMath> ακουμπάει στο μηδέν στις
          κοιλάδες και φτάνει στο <InlineMath>{'2A_c'}</InlineMath> στις κορυφές.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Ο envelope detector δουλεύει ακόμα σωστά (το envelope δεν αλλάζει
            πρόσημο).
          </li>
          <li>
            Είναι το <strong>βέλτιστο σημείο</strong> για conventional AM: η
            ισχύς στα sidebands μεγιστοποιείται (η αποδοτικότητα φτάνει το
            33%).
          </li>
          <li>
            Για <InlineMath>{'m > 1'}</InlineMath> έχουμε{' '}
            <strong>overmodulation</strong>: η περιβάλλουσα αλλάζει πρόσημο,
            phase reversals, και ο envelope detector παράγει παραμορφωμένη
            έξοδο.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'proodos26-4',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 4',
    weight: 6,
    title: 'Μέγιστο ποσοστό ισχύος στα sidebands',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-power', 'am-eta'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        η ισχύς{' '}
        <InlineMath>{'P_{AM} = P_c(1 + m^2/2)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>4</strong> παλιά θέματα) και η απόδοση{' '}
        <InlineMath>{'\\eta = m^2/(2+m^2) \\le 1/3'}</InlineMath>{' '}
        (σε <strong>3</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 2
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Ποιο είναι το μέγιστο ποσοστό της συνολικής ισχύος που μπορεί να
        περιέχεται στις πλευρικές ζώνες στην κανονική AM χωρίς υπερδιαμόρφωση;
      </p>
    ),
    solution: (
      <>
        <p>Για single-tone modulation:</p>
        <BlockMath>{'\\eta = \\frac{P_{sb}}{P_{AM}} = \\frac{m^2/2}{1 + m^2/2}'}</BlockMath>
        <p>
          Η <InlineMath>\eta</InlineMath> είναι αύξουσα στο{' '}
          <InlineMath>m</InlineMath>, οπότε μεγιστοποιείται όταν{' '}
          <InlineMath>{'m=1'}</InlineMath> (όριο πριν την υπερδιαμόρφωση):
        </p>
        <BlockMath>{'\\eta_{max} = \\frac{1/2}{3/2} = \\frac{1}{3} \\approx 33.3\\%'}</BlockMath>
        <p>
          Δύο τρίτα της ισχύος (66.7%) πάνε στον carrier και «χάνονται» — δεν
          κουβαλάει πληροφορία. Γι' αυτό η DSB-SC και η SSB είναι ενεργειακά
          πολύ πιο αποδοτικές.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-5',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 5',
    weight: 7,
    title: 'AM modulator με δίοδο (square-law)',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/modulator-demodulator', 'am/conventional'],
    formulaIds: ['am-signal', 'nonlinear-modulator-fc'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και η
        συνθήκη μη-γραμμικού modulator{' '}
        <InlineMath>{'f_c > 3W'}</InlineMath>{' '}
        (σε <strong>2</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pb25-th4-nonlinear"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Β 2025 ΘΕΜΑ 4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σχεδιάστε το κύκλωμα που χρησιμοποιείται συνήθως για τη διαμόρφωση ενός
        σήματος AM με τη χρήση διόδου και εξηγήστε πώς δουλεύει.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Square-law (μη-γραμμικός) AM modulator</strong>: αθροιστής
          για <InlineMath>{'c(t) + m(t)'}</InlineMath>, μια δίοδος σε μη-γραμμική
          περιοχή λειτουργίας, και ένα <strong>bandpass φίλτρο</strong> γύρω
          από <InlineMath>f_c</InlineMath>:
        </p>
        <svg
          viewBox="0 0 600 160"
          className="my-3 block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
          role="img"
          aria-label="Square-law AM modulator: αθροιστής m(t)+c(t), δίοδος, αντίσταση R με γείωση, BPF γύρω από f_c, έξοδος x_AM(t)"
        >
          {/* m(t) input */}
          <text x="10" y="50" fontSize="11" fill="currentColor" fillOpacity="0.85" fontStyle="italic">m(t)</text>
          <line x1="42" y1="46" x2="80" y2="46" stroke="currentColor" strokeOpacity="0.6" />
          <line x1="80" y1="46" x2="80" y2="68" stroke="currentColor" strokeOpacity="0.6" />
          <line x1="80" y1="68" x2="96" y2="68" stroke="currentColor" strokeOpacity="0.6" />
          {/* c(t) input */}
          <text x="10" y="118" fontSize="11" fill="currentColor" fillOpacity="0.85" fontStyle="italic">c(t)</text>
          <line x1="42" y1="114" x2="80" y2="114" stroke="currentColor" strokeOpacity="0.6" />
          <line x1="80" y1="114" x2="80" y2="92" stroke="currentColor" strokeOpacity="0.6" />
          <line x1="80" y1="92" x2="96" y2="92" stroke="currentColor" strokeOpacity="0.6" />
          {/* adder */}
          <circle cx="110" cy="80" r="14" fill="none" stroke="currentColor" strokeOpacity="0.7" />
          <text x="110" y="85" textAnchor="middle" fontSize="14" fill="currentColor" fillOpacity="0.85">+</text>
          {/* adder → diode */}
          <line x1="124" y1="80" x2="160" y2="80" stroke="currentColor" strokeOpacity="0.6" />
          <text x="142" y="100" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">v(t)</text>
          {/* diode block */}
          <rect x="160" y="64" width="56" height="32" rx="3" fill="rgba(29, 78, 216, 0.10)" stroke="rgb(29, 78, 216)" strokeOpacity="0.7" />
          <text x="188" y="84" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.9">diode</text>
          {/* diode → R */}
          <line x1="216" y1="80" x2="240" y2="80" stroke="currentColor" strokeOpacity="0.6" />
          {/* R block */}
          <rect x="240" y="64" width="36" height="32" rx="3" fill="rgba(29, 78, 216, 0.10)" stroke="rgb(29, 78, 216)" strokeOpacity="0.7" />
          <text x="258" y="84" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.9">R</text>
          {/* R → junction → BPF */}
          <line x1="276" y1="80" x2="340" y2="80" stroke="currentColor" strokeOpacity="0.6" />
          <circle cx="316" cy="80" r="2.5" fill="currentColor" fillOpacity="0.85" />
          {/* BPF block */}
          <rect x="340" y="64" width="160" height="32" rx="3" fill="rgba(29, 78, 216, 0.10)" stroke="rgb(29, 78, 216)" strokeOpacity="0.7" />
          <text x="420" y="84" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.9">BPF (f_c, 2W)</text>
          {/* BPF → output */}
          <line x1="500" y1="80" x2="540" y2="80" stroke="currentColor" strokeOpacity="0.6" />
          <polygon points="546,80 536,75 536,85" fill="currentColor" fillOpacity="0.7" />
          <text x="552" y="84" fontSize="11" fill="currentColor" fillOpacity="0.85" fontStyle="italic">x_AM(t)</text>
          {/* junction → GND */}
          <line x1="316" y1="80" x2="316" y2="124" stroke="currentColor" strokeOpacity="0.6" />
          <line x1="304" y1="124" x2="328" y2="124" stroke="currentColor" strokeOpacity="0.85" strokeWidth="2" />
          <line x1="308" y1="130" x2="324" y2="130" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
          <line x1="312" y1="136" x2="320" y2="136" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
          <text x="334" y="130" fontSize="9" fill="currentColor" fillOpacity="0.65">GND</text>
        </svg>
        <p>
          Στην εκθετική/τετραγωνική περιοχή της διόδου το ρεύμα έχει την μορφή{' '}
          <InlineMath>{'i(t) \\approx a_1 v(t) + a_2 v^2(t)'}</InlineMath>.
          Με <InlineMath>{'v(t) = c(t) + m(t)'}</InlineMath>:
        </p>
        <BlockMath>{'i(t) \\approx a_1[A_c\\cos\\omega_c t + m(t)] + a_2[A_c\\cos\\omega_c t + m(t)]^2'}</BlockMath>
        <p>
          Το τετράγωνο παράγει cross-term <InlineMath>{'2a_2 A_c m(t)\\cos\\omega_c t'}</InlineMath>.
          Μετά το BPF γύρω από <InlineMath>f_c</InlineMath> (που σβήνει DC,
          <InlineMath>{'m(t)'}</InlineMath>, <InlineMath>{'m^2(t)'}</InlineMath>{' '}
          και τον <InlineMath>{'2f_c'}</InlineMath> harmonic) μένει:
        </p>
        <BlockMath>{'y(t) = a_1 A_c \\cos\\omega_c t + 2a_2 A_c m(t)\\cos\\omega_c t = A_c\\big[a_1 + 2a_2 m(t)\\big]\\cos\\omega_c t'}</BlockMath>
        <p>
          Αυτό είναι ακριβώς <strong>conventional AM</strong> με effective
          modulation index <InlineMath>{'(2a_2/a_1)\\,m(t)'}</InlineMath>. Ο
          ρόλος της διόδου είναι να δώσει τη μη-γραμμικότητα· χωρίς αυτή το{' '}
          <InlineMath>{'c(t) + m(t)'}</InlineMath> δεν θα παρήγαγε ποτέ
          πολλαπλασιαστικό όρο.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-6',
    repeatGroup: 'white-noise-lpf',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 6',
    weight: 7,
    title: 'Λευκός θόρυβος μέσα από ιδανικό LPF',
    topic: 'noise',
    difficulty: 'easy',
    prerequisites: ['noise/white-noise', 'noise/through-filters', 'foundations/filters'],
    formulaIds: ['white-noise-psd', 'lti-output-psd', 'bandlimited-noise-power', 'wiener-khinchin'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Και οι δύο τύποι του προβλήματος είναι εκτός επίσημου τυπολογίου: η PSD
        λευκού θορύβου <InlineMath>{'S_n(f) = N_0/2'}</InlineMath>{' '}
        (βάρος <strong>5</strong> — ανώτατο στο Noise: εμφανίστηκε σε{' '}
        <Link href="/practice#exercise:sept25-th3-10">Σεπτ.2025 ΘΕΜΑ 3.10</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-9">Ιούν.2025 ΘΕΜΑ 1.9</Link>{' '}
        κ.ά.) και ο νόμος εξόδου LTI{' '}
        <InlineMath>{'S_y(f) = |H(f)|^2 S_n(f)'}</InlineMath>{' '}
        (βάρος <strong>3</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>{' '}
        κ.ά.). Το τυπολόγιο δεν περιέχει κανέναν τύπο θορύβου — άρα και το αποτέλεσμα{' '}
        <InlineMath>{'P_N = N_0 B'}</InlineMath>{' '}
        (βάρος <strong>5</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>{' '}
        κ.ά.) πρέπει να το ξέρεις απέξω.{' '}
        Τέλος, ο υπολογισμός{' '}
        <InlineMath>{'P_y = \\int S_y(f)\\,df = R_y(0)'}</InlineMath>{' '}
        είναι εφαρμογή του θεωρήματος Wiener-Khinchin (power corollary — εκτός τυπολογίου, βάρος{' '}
        <strong>3</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>
        κ.ά.).
      </>
    ),
    statement: (
      <p>
        Λευκός θόρυβος με PSD <InlineMath>{'S_n(f) = N_0/2'}</InlineMath>{' '}
        διέρχεται από ιδανικό χαμηλοπερατό φίλτρο με εύρος ζώνης{' '}
        <InlineMath>W</InlineMath>. Ποια είναι η συνολική ισχύς του στην έξοδο
        του φίλτρου;
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Ο λευκός θόρυβος είναι «επίπεδος»: έχει την ίδια πυκνότητα ισχύος{' '}
            <InlineMath>{'N_0/2'}</InlineMath> σε <em>κάθε</em> συχνότητα, από{' '}
            <InlineMath>{'-\\infty'}</InlineMath> έως{' '}
            <InlineMath>{'+\\infty'}</InlineMath>. Αν δοκιμάσεις να αθροίσεις όλη
            αυτή την ισχύ, βγαίνει <strong>άπειρο</strong> — το εμβαδόν κάτω από
            μια σταθερά σε όλον τον άξονα. Το ιδανικό LPF όμως κρατάει μόνο{' '}
            <strong>μία λωρίδα</strong> αυτού του επίπεδου πατώματος (τη ζώνη{' '}
            <InlineMath>{'|f| < W'}</InlineMath>) και πετάει τα υπόλοιπα. Μένει
            ένα ορθογώνιο ύψους <InlineMath>{'N_0/2'}</InlineMath> και πλάτους{' '}
            <InlineMath>{'2W'}</InlineMath>· η ισχύς εξόδου είναι απλώς το{' '}
            <strong>εμβαδόν</strong> του.
          </span>
        </div>

        <figure className="my-4">
          <NoiseFilterShapingViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Διάλεξε «Ιδανικό LPF» και σύρε το slider του cutoff (το{' '}
            <InlineMath>B</InlineMath> του viz είναι το <InlineMath>W</InlineMath>{' '}
            εδώ): αριστερά το επίπεδο <InlineMath>{'S_n = N_0/2'}</InlineMath>, στη
            μέση η μάσκα <InlineMath>{'|H|^2'}</InlineMath>, δεξιά η σκιασμένη
            λωρίδα εξόδου. Η ένδειξη <InlineMath>{'P_Y'}</InlineMath> μεγαλώνει{' '}
            <strong>γραμμικά</strong> με το cutoff — αυτό ακριβώς είναι το{' '}
            <InlineMath>{'P = N_0 W'}</InlineMath>. Η αναλυτική απαγωγή ζει στο{' '}
            <Link
              href="/noise/through-filters"
              className="text-accent underline-offset-2 hover:underline"
            >
              /noise/through-filters §4–5
            </Link>
            .
          </figcaption>
        </figure>

        <p>
          <strong>Βήμα 1 — ο νόμος του θορύβου μέσα από LTI.</strong> Όταν μια
          WSS τυχαία διεργασία περνά από γραμμικό χρονικά-αμετάβλητο φίλτρο{' '}
          <InlineMath>{'H(f)'}</InlineMath>, η PSD εξόδου είναι η PSD εισόδου επί{' '}
          <InlineMath>{'|H(f)|^2'}</InlineMath>:
        </p>
        <BlockMath>{'S_y(f) = |H(f)|^2\\, S_n(f)'}</BlockMath>
        <p>
          <strong>Βήμα 2 — βάλε μέσα το ιδανικό LPF.</strong> Για ιδανικό
          χαμηλοπερατό, <InlineMath>{'|H(f)|^2 = 1'}</InlineMath> στη ζώνη{' '}
          <InlineMath>{'|f| < W'}</InlineMath> και <InlineMath>0</InlineMath> έξω.
          Άρα η έξοδος είναι το ίδιο επίπεδο <InlineMath>{'N_0/2'}</InlineMath>,
          αλλά μόνο στο διάστημα <InlineMath>{'[-W, W]'}</InlineMath>:
        </p>
        <BlockMath>{'S_y(f) = \\begin{cases} N_0/2, & |f| < W \\\\ 0, & |f| > W \\end{cases}'}</BlockMath>
        <p>
          <strong>Βήμα 3 — ολοκλήρωσε για την ισχύ.</strong> Η συνολική ισχύς
          είναι το ολοκλήρωμα της PSD σε όλες τις συχνότητες — δηλαδή το εμβαδόν
          της λωρίδας:
        </p>
        <BlockMath>{'P_y = \\int_{-\\infty}^{\\infty} S_y(f)\\,df = \\int_{-W}^{W} \\frac{N_0}{2}\\,df = \\frac{N_0}{2}\\cdot 2W = N_0 W'}</BlockMath>
        <p>
          Πρόσεξε <em>γιατί</em> βγαίνει <InlineMath>{'N_0 W'}</InlineMath> και
          όχι <InlineMath>{'N_0 W/2'}</InlineMath>: το ύψος είναι{' '}
          <InlineMath>{'N_0/2'}</InlineMath> (δίψας όψεως — two-sided), αλλά το
          πλάτος της ζώνης <InlineMath>{'[-W, W]'}</InlineMath> είναι{' '}
          <InlineMath>{'2W'}</InlineMath>. Το μισό και το διπλάσιο
          αλληλοεξουδετερώνονται — κράτα το στο μυαλό σου, είναι η πηγή της
          κλασικής παγίδας (δες το radar εξέτασης).
        </p>

        <p>
          <strong>Με απλά λόγια:</strong> το ιδανικό LPF μετατρέπει τον λευκό
          (άπειρης ισχύος) θόρυβο σε <strong>bandlimited</strong> θόρυβο με
          πεπερασμένη ισχύ <InlineMath>{'N_0 W'}</InlineMath>. Η «άπειρη» ισχύς
          ζούσε στην ατελείωτη ουρά του φάσματος· ο δέκτης, με το πεπερασμένο
          bandwidth του, ποτέ δεν τη βλέπει. Έτσι το{' '}
          <InlineMath>{'P = N_0 W'}</InlineMath> ξαναγυρίζει ως ο{' '}
          <em>παρονομαστής</em> σε κάθε υπολογισμό SNR (δες{' '}
          <Link
            href="/noise/snr"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/snr
          </Link>
          ).
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδιο μοτίβο (<InlineMath>{'S_y = |H|^2 S_n'}</InlineMath>, μετά
            ολοκλήρωση), άλλο φίλτρο. Δοκίμασέ τες αλλάζοντας φίλτρο στο viz
            παραπάνω:
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Ιδανικό BPF</strong> εύρους <InlineMath>B</InlineMath> ανά
              πλευρά, γύρω από <InlineMath>{'\\pm f_c'}</InlineMath>: τώρα η
              λωρίδα είναι <em>δύο</em> rects (μία ανά πλευρά), συνολικού πλάτους{' '}
              <InlineMath>{'2B'}</InlineMath>, άρα <InlineMath>{'P = N_0 B'}</InlineMath>.
            </li>
            <li>
              <strong>Μη ιδανικό RC LPF</strong> πρώτης τάξης (όχι rect, αλλά{' '}
              <InlineMath>{'|H|^2 = 1/(1+(f/f_c)^2)'}</InlineMath>): το ολοκλήρωμα
              γίνεται Lorentzian και δίνει <InlineMath>{'P = \\pi N_0 f_c/2'}</InlineMath>{' '}
              — μεγαλύτερο κατά <InlineMath>{'\\pi/2'}</InlineMath> από ιδανικό
              ίδιου cutoff (πλήρης απαγωγή στο{' '}
              <Link
                href="/noise/through-filters"
                className="text-accent underline-offset-2 hover:underline"
              >
                /noise/through-filters §6
              </Link>
              ).
            </li>
            <li>
              <strong>Κι αν η είσοδος δεν είναι λευκή;</strong> Αν το{' '}
              <InlineMath>{'S_n(f)'}</InlineMath> δεν είναι επίπεδο, δεν βγαίνει
              έξω από το ολοκλήρωμα — πρέπει να υπολογίσεις πραγματικά το{' '}
              <InlineMath>{'\\int |H(f)|^2 S_n(f)\\,df'}</InlineMath>· το «ύψος ×
              πλάτος» ίσχυε μόνο χάρη στο επίπεδο πάτωμα.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'proodos26-7',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 7',
    weight: 9,
    title: 'DSB-SC: σφάλμα φάσης φ στον σύμφωνο αποδιαμορφωτή',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/dsb-sc', 'am/modulator-demodulator'],
    formulaIds: ['dsb-sc-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{DSB}(t) = A_c m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>5</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:jan26-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.8
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σε έναν σύμφωνο αποδιαμορφωτή AM-DSB-SC, αν υπάρξει σφάλμα φάσης{' '}
        <InlineMath>\varphi</InlineMath> στο τοπικό φέρον, πώς επηρεάζεται το
        πλάτος του σήματος εξόδου;
      </p>
    ),
    solution: (
      <>
        <p>
          Έστω <InlineMath>{'s(t) = m(t)\\cos(2\\pi f_c t)'}</InlineMath> το
          DSB-SC σήμα και <InlineMath>{'\\cos(2\\pi f_c t + \\varphi)'}</InlineMath>{' '}
          το τοπικό φέρον με σφάλμα φάσης. Πολλαπλασιάζουμε:
        </p>
        <BlockMath>{'s(t)\\cos(2\\pi f_c t + \\varphi) = m(t)\\cos(\\omega_c t)\\cos(\\omega_c t + \\varphi)'}</BlockMath>
        <BlockMath>{'= \\tfrac{m(t)}{2}\\big[\\cos\\varphi + \\cos(2\\omega_c t + \\varphi)\\big]'}</BlockMath>
        <p>Μετά το LPF (κόβει τον όρο στο <InlineMath>{'2f_c'}</InlineMath>):</p>
        <BlockMath>{'y(t) = \\tfrac{1}{2}\\,m(t)\\cos\\varphi'}</BlockMath>
        <p>
          Δηλαδή το πλάτος εξόδου <strong>πολλαπλασιάζεται με{' '}
          <InlineMath>\cos\varphi</InlineMath></strong>:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <InlineMath>{'\\varphi = 0'}</InlineMath>: πλήρης ανάκτηση.
          </li>
          <li>
            <InlineMath>{'\\varphi = \\pi/4'}</InlineMath>: εξασθένηση κατά{' '}
            <InlineMath>{'\\sqrt{2}/2 \\approx 70\\%'}</InlineMath>.
          </li>
          <li>
            <InlineMath>{'\\varphi = \\pi/2'}</InlineMath>: μηδενική έξοδος{' '}
            (<em>quadrature null</em>) — εντελώς χαμένο σήμα.
          </li>
        </ul>
        <p>
          Για αυτό το λόγο η σύμφωνη αποδιαμόρφωση χρειάζεται phase-locked
          loop ή carrier recovery — αλλιώς ένα slow drift της φάσης κάνει το
          σήμα να ξεθωριάζει.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-8',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 8',
    weight: 7,
    title: 'Εύρος του φάσματος του m²(t)',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-convolution', 'fourier-modulation-theorem'],
    statement: (
      <p>
        Αν <InlineMath>W</InlineMath> είναι το εύρος του σήματος βασικής ζώνης{' '}
        <InlineMath>m(t)</InlineMath>, πόσο είναι το εύρος του φάσματος του
        σήματος <InlineMath>{'m^2(t)'}</InlineMath>;
      </p>
    ),
    solution: (
      <>
        <p>
          Πολλαπλασιασμός στον χρόνο ⇔ συνέλιξη στη συχνότητα (modulation /
          convolution theorem):
        </p>
        <BlockMath>{'m^2(t) = m(t)\\cdot m(t) \\;\\xleftrightarrow{\\mathcal{F}}\\; M(f) * M(f)'}</BlockMath>
        <p>
          Αν <InlineMath>{'M(f)'}</InlineMath> έχει στήριγμα{' '}
          <InlineMath>{'[-W, W]'}</InlineMath>, η συνέλιξη{' '}
          <InlineMath>{'M(f)*M(f)'}</InlineMath> έχει στήριγμα το άθροισμα των
          δύο διαστημάτων:
        </p>
        <BlockMath>{'\\text{supp}(M*M) = [-W, W] + [-W, W] = [-2W,\\, 2W]'}</BlockMath>
        <p>
          Άρα το εύρος (one-sided) διπλασιάζεται: <strong>2W</strong>. Γενική
          αρχή: κάθε φορά που υψώνεις ένα σήμα στο τετράγωνο, το spectrum του
          απλώνεται διπλάσια. Γι' αυτό δεν μπορούμε να αγνοήσουμε τον όρο{' '}
          <InlineMath>{'m^2(t)'}</InlineMath> στον square-law modulator —
          βγαίνει από τη ζώνη του <InlineMath>m(t)</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-9',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 9',
    weight: 10,
    title: 'AM σήμα στο χρόνο και στη συχνότητα: tone modulation',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional', 'foundations/fourier-transform'],
    formulaIds: ['am-signal', 'am-spectrum', 'fourier-pair-cos', 'fourier-pair-sin'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα) και το φάσμα AM{' '}
        <InlineMath>{'X_{AM}(f) = \\tfrac{A_c}{2}\\delta(f\\mp f_c) + \\tfrac{1}{2}M(f\\mp f_c)'}</InlineMath>{' '}
        (σε <strong>4</strong>). Τα ζεύγη Fourier{' '}
        (<InlineMath>{'\\cos'}</InlineMath>,{' '}
        <InlineMath>{'\\sin'}</InlineMath>) βρίσκονται στο τυπολόγιο — δεν
        χρειάζεται να τα θυμάσαι. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:sept25-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-7"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.7
        </Link>.
      </>
    ),
    statement: (
      <p>
        Να σχεδιάσετε το διαμορφωμένο κατά AM σήμα στον χρόνο και στο φάσμα
        πλάτους όταν το φέρον είναι{' '}
        <InlineMath>{'c(t) = \\cos(1000\\pi t)'}</InlineMath> και το σήμα
        πληροφορίας είναι <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Το AM σήμα είναι ένα φέρον του οποίου το «ύψος» ακολουθεί την{' '}
            <strong>περιβάλλουσα</strong> <InlineMath>{'A_c + m(t)'}</InlineMath>. Εδώ ο
            δείκτης διαμόρφωσης βγαίνει <InlineMath>{'m = A_m/A_c = 2 > 1'}</InlineMath>,
            άρα η περιβάλλουσα <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath>{' '}
            <strong>πέφτει κάτω από το μηδέν</strong> σε κάποια διαστήματα. Μια φυσική
            περιβάλλουσα όμως δεν γίνεται αρνητική — οπότε αυτό που στ' αλήθεια συμβαίνει
            είναι ότι ο carrier <strong>αναστρέφει τη φάση του κατά{' '}
            <InlineMath>{'180^\\circ'}</InlineMath></strong> σε κάθε σημείο όπου η
            περιβάλλουσα μηδενίζεται: αυτές είναι οι <em>phase reversals</em>. Ένας
            envelope detector τότε ανακτά το <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath>,{' '}
            <strong>όχι</strong> το message — η κλασική παγίδα της υπερδιαμόρφωσης. Και το
            κλειδί για το δεύτερο σχέδιο: αφού το message είναι <em>ένας τόνος</em>, το
            φάσμα μένει <strong>carrier + ΕΝΑ ζεύγος πλευρικών</strong> ό,τι κι αν είναι το{' '}
            <InlineMath>{'m'}</InlineMath> — η υπερδιαμόρφωση φαίνεται στον <em>χρόνο</em> και
            στον detector, ΟΧΙ σαν επιπλέον φασματικές γραμμές. (Το «γιατί» ζει στο{' '}
            <Link
              href="/am/conventional"
              className="text-accent underline-offset-2 hover:underline"
            >
              /am/conventional §3 Υπερδιαμόρφωση
            </Link>
            .)
          </span>
        </div>

        <p>
          Διαβάζουμε τις παραμέτρους από τα δεδομένα. Φέρον{' '}
          <InlineMath>{'c(t) = \\cos(1000\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_c = 1'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_c = 1000\\pi \\Rightarrow f_c = 500'}</InlineMath> Hz.
          Σήμα πληροφορίας <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_m = 2'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_m = 2\\pi \\Rightarrow f_m = 1'}</InlineMath> Hz. Το
          συνολικό σήμα κατά Conventional AM:
        </p>
        <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = [1 + 2\\sin(2\\pi t)]\\cos(1000\\pi t)'}</BlockMath>

        <p>
          <strong>(1) Ο δείκτης διαμόρφωσης — και ο έλεγχος που δεν παραλείπουμε ποτέ.</strong>{' '}
          <InlineMath>{'m = A_m/A_c = 2/1 = 2'}</InlineMath>. Επειδή{' '}
          <InlineMath>{'m > 1'}</InlineMath>, έχουμε <strong>υπερδιαμόρφωση</strong>.
        </p>
        <p>
          <strong>Με απλά λόγια:</strong> πρώτη κίνηση σε κάθε «σχεδιάστε AM» — σύγκρινε το{' '}
          <InlineMath>{'A_m'}</InlineMath> με το <InlineMath>{'A_c'}</InlineMath>. Εδώ το
          message είναι διπλάσιο του φέροντος· το σχεδιάζουμε όπως ζητείται, αλλά με ρητή
          σημείωση ότι αυτό είναι μη-έγκυρη AM (ο φτηνός envelope detector θα σπάσει).
        </p>

        <p>
          <strong>(2) Στον χρόνο — η κυματομορφή με τις αναστροφές.</strong> Είναι ένα
          carrier 500 Hz «γεμισμένο» από την περιβάλλουσα{' '}
          <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath>. Οι αναστροφές φάσης συμβαίνουν
          ακριβώς εκεί που η περιβάλλουσα μηδενίζεται:
        </p>
        <BlockMath>{'1 + 2\\sin(2\\pi t) = 0 \\;\\Rightarrow\\; \\sin(2\\pi t) = -\\tfrac{1}{2}'}</BlockMath>
        <p>
          Σε κάθε περίοδο <InlineMath>{'T_m = 1/f_m = 1'}</InlineMath> s αυτό δίνει{' '}
          <InlineMath>{'t = 7/12'}</InlineMath> s και{' '}
          <InlineMath>{'t = 11/12'}</InlineMath> s — και ανάμεσά τους η περιβάλλουσα είναι
          αρνητική (φτάνει το <InlineMath>{'1 - 2 = -1'}</InlineMath> στο{' '}
          <InlineMath>{'t = 3/4'}</InlineMath> s). <strong>Με απλά λόγια:</strong> σε εκείνο
          το διάστημα ο carrier «αναποδογυρίζει» — στον oscilloscope το cosine ξαφνικά
          γυρίζει ανάποδα. Στο σχέδιό σου: ζωγράφισε το carrier με πλάτος{' '}
          <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath>, και βάλε ένα{' '}
          <InlineMath>{'180^\\circ'}</InlineMath> flip στα δύο αυτά σημεία.
        </p>

        <figure className="my-4">
          <AMSignalViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η πάνω καμπύλη είναι το message + η περιβάλλουσα· η κάτω είναι το ίδιο το AM
            σήμα. Ο δρομέας είναι ο δείκτης διαμόρφωσης (εδώ γραμμένος{' '}
            <InlineMath>{'\\mu'}</InlineMath> — ίδιο με το δικό μας{' '}
            <InlineMath>{'m'}</InlineMath>). <strong>Σύρε τον πάνω από το{' '}
            <InlineMath>{'1'}</InlineMath></strong> (φτάνει μέχρι{' '}
            <InlineMath>{'1.6'}</InlineMath> εδώ· το δικό μας πρόβλημα κάθεται ακόμη πιο
            βαθιά, στο <InlineMath>{'m = 2'}</InlineMath>): οι <span className="text-red-600 dark:text-red-400">κόκκινες ζώνες</span>{' '}
            δείχνουν πού η περιβάλλουσα πέφτει αρνητική και ο carrier αναστρέφεται — ακριβώς
            το δικό μας σχέδιο (1). Το viz χρησιμοποιεί <em>cosine</em> message ενώ το δικό
            μας είναι <em>sine</em>· η δομή (αναστροφές όπου{' '}
            <InlineMath>{'A_c + m(t) < 0'}</InlineMath>) είναι πανομοιότυπη — αλλάζει μόνο{' '}
            <em>πού</em> πάνω στον άξονα του χρόνου πέφτουν οι αναστροφές.
          </figcaption>
        </figure>

        <p>
          <strong>(3) Στη συχνότητα — το φάσμα πλάτους.</strong> Αναπτύσσουμε τον όρο του
          message με ταυτότητα γινομένου-σε-άθροισμα{' '}
          (<InlineMath>{'2\\sin a\\cos b = \\sin(a{+}b) + \\sin(a{-}b)'}</InlineMath>):
        </p>
        <BlockMath>{'2\\sin(2\\pi t)\\cos(1000\\pi t) = \\sin(1002\\pi t) - \\sin(998\\pi t)'}</BlockMath>
        <BlockMath>{'x_{AM}(t) = \\underbrace{\\cos(1000\\pi t)}_{\\text{carrier}} + \\underbrace{\\sin(1002\\pi t)}_{\\text{USB}} - \\underbrace{\\sin(998\\pi t)}_{\\text{LSB}}'}</BlockMath>
        <p>
          Τρεις καθαροί τόνοι ⇒ <strong>τρία ζεύγη impulses</strong> στο φάσμα πλάτους:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Carrier στα <InlineMath>{'\\pm 500'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'A_c/2 = 1/2'}</InlineMath>.
          </li>
          <li>
            USB στα <InlineMath>{'\\pm 501'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'A_m/4 = 1/2'}</InlineMath> (από το{' '}
            <InlineMath>{'\\sin(1002\\pi t)'}</InlineMath>).
          </li>
          <li>
            LSB στα <InlineMath>{'\\pm 499'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'A_m/4 = 1/2'}</InlineMath> (από το{' '}
            <InlineMath>{'-\\sin(998\\pi t)'}</InlineMath>).
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> «φάσμα <em>πλάτους</em>» σημαίνει{' '}
          <em>μέτρα</em> — και τα τρία impulses ανά πλευρά έχουν ίδιο ύψος{' '}
          <InlineMath>{'1/2'}</InlineMath> (επειδή τυχαίνει{' '}
          <InlineMath>{'A_c/2 = A_m/4'}</InlineMath> για{' '}
          <InlineMath>{'A_c=1, A_m=2'}</InlineMath>). Το πρόσημο{' '}
          <InlineMath>{'-'}</InlineMath> της LSB (από το{' '}
          <InlineMath>{'-\\sin(998\\pi t)'}</InlineMath>) είναι λεπτομέρεια{' '}
          <strong>φάσης</strong>, αόρατη στο φάσμα πλάτους — μην τη σχεδιάσεις πιο κοντή. Το
          bandwidth είναι <InlineMath>{'2 f_m = 2'}</InlineMath> Hz (από 499 ώς 501 Hz στη
          θετική πλευρά). Πρόσεξε: η <strong>υπερδιαμόρφωση δεν πρόσθεσε καμία γραμμή</strong> —
          single tone σημαίνει πάντα carrier + ένα ζεύγος πλευρικών{' '}
          (<Link
            href="/am/conventional"
            className="text-accent underline-offset-2 hover:underline"
          >
            /am/conventional §4 Φάσμα
          </Link>
          ).
        </p>

        <figure className="my-4">
          <AMSpectrumViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η δομή του φάσματος μας: carrier (πορτοκαλί) στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> με ύψος{' '}
            <InlineMath>{'A_c/2'}</InlineMath>, και δύο πλευρικές (μπλε) στα{' '}
            <InlineMath>{'\\pm f_c \\pm f_m'}</InlineMath> με ύψος{' '}
            <InlineMath>{'\\mu A_c/4'}</InlineMath>. Για το δικό μας{' '}
            <InlineMath>{'m = 2'}</InlineMath> κάθε πλευρική φτάνει{' '}
            <InlineMath>{'2\\cdot 1/4 = 1/2'}</InlineMath> — <strong>ίσο με το
            carrier</strong>, άρα και οι τρεις γραμμές ισοϋψείς στο{' '}
            <InlineMath>{'1/2'}</InlineMath>. Ο δρομέας εδώ φτάνει ώς{' '}
            <InlineMath>{'\\mu = 1'}</InlineMath> (πλευρικές στο{' '}
            <InlineMath>{'1/4'}</InlineMath>, μισό του carrier)· νοερά σπρώξ' τον στο{' '}
            <InlineMath>{'2'}</InlineMath> και δες τις πλευρικές ν' ανεβαίνουν στο ύψος του
            carrier. Οι <em>θέσεις</em> (carrier + ΕΝΑ ζεύγος) και το{' '}
            <InlineMath>{'BW = 2f_m'}</InlineMath> είναι ακριβώς το σχέδιό μας (2). Το viz
            σχεδιάζει μέτρα, οπότε το πρόσημο της LSB δεν φαίνεται — όπως και στο δικό σου
            φάσμα πλάτους.
          </figcaption>
        </figure>

        <p>
          <strong>Γιατί η υπερδιαμόρφωση είναι «κακή» — δες τι βγάζει ο detector.</strong>{' '}
          Το σχέδιο (1) δείχνει τις αναστροφές· αλλά το πραγματικό κόστος φαίνεται όταν
          προσπαθήσεις να ανακτήσεις το message με envelope detector. Αυτός βγάζει το{' '}
          <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath> — και στα διαστήματα όπου το{' '}
          <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath> ήταν αρνητικό, το{' '}
          <InlineMath>{'|\\cdot|'}</InlineMath> το «αναποδογυρίζει» προς τα πάνω. Το
          αποτέλεσμα <strong>δεν</strong> είναι το <InlineMath>{'2\\sin(2\\pi t)'}</InlineMath>:
          αποκτά αιχμές και αρμονικές που <strong>δεν φεύγουν με LPF</strong>.
        </p>

        <figure className="my-4">
          <OvermodulationPhaseReversalViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Ο δρομέας εδώ φτάνει <strong>ακριβώς στο{' '}
            <InlineMath>{'\\mu = 2'}</InlineMath></strong> — το δικό μας πρόβλημα (το chip{' '}
            <InlineMath>{'\\mu = 1.5'}</InlineMath> είναι κοντά· σύρε ώς το{' '}
            <InlineMath>{'2'}</InlineMath>). Πάνω: το <InlineMath>{'x(t)'}</InlineMath> με
            τους κόκκινους <span className="text-red-600 dark:text-red-400">↺</span> δείκτες
            στις αναστροφές. Μέση: το <InlineMath>{'|A_c + m(t)|'}</InlineMath> που
            αναδιπλώνεται.
            Κάτω: η ανακτημένη <InlineMath>{'\\hat{m}(t)'}</InlineMath> (μπλε) διαφέρει από
            το αληθινό <InlineMath>{'m(t)'}</InlineMath> (πορτοκαλί) — η{' '}
            <span className="text-red-600 dark:text-red-400">κόκκινη ζώνη</span> είναι η
            παραμόρφωση. Στα δεξιά ένα RMS-error readout κουμπώνει στο «πόσο σπάει». Γι' αυτό
            κρατάμε πάντα <InlineMath>{'m \\le 1'}</InlineMath>.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— όταν δεις «<em>σχεδιάστε το AM σήμα στον χρόνο και στο φάσμα</em>» με
            single-tone message: <strong>(α)</strong> διάβασε{' '}
            <InlineMath>{'A_c, f_c'}</InlineMath> από το φέρον και{' '}
            <InlineMath>{'A_m, f_m'}</InlineMath> από το message· <strong>(β)</strong>{' '}
            υπολόγισε <InlineMath>{'m = A_m/A_c'}</InlineMath> και{' '}
            <strong>έλεγξε <InlineMath>{'m'}</InlineMath> ως προς το{' '}
            <InlineMath>{'1'}</InlineMath></strong> (σημαία υπερδιαμόρφωσης)·{' '}
            <strong>(γ)</strong> στον χρόνο: carrier «γεμισμένο» από την περιβάλλουσα{' '}
            <InlineMath>{'A_c + m(t)'}</InlineMath>, με phase reversals <em>μόνο αν</em>{' '}
            <InlineMath>{'m > 1'}</InlineMath>· <strong>(δ)</strong> στο φάσμα: carrier στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> (ύψος <InlineMath>{'A_c/2'}</InlineMath>) +
            ΕΝΑ ζεύγος πλευρικών στα <InlineMath>{'\\pm(f_c \\pm f_m)'}</InlineMath> (ύψος{' '}
            <InlineMath>{'A_m/4'}</InlineMath>). Η μνεία-κλειδί:{' '}
            <strong>η υπερδιαμόρφωση είναι ιστορία του χρόνου — ποτέ δεν προσθέτει
            φασματικές γραμμές.</strong>
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδιο σκελετό, αλλαγμένη μία παράμετρος (δοκίμασέ τες σύροντας τους δρομείς
            παραπάνω):
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Οριακή <InlineMath>{'m = 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 1 = A_c'}</InlineMath>): η περιβάλλουσα{' '}
              <em>μόλις αγγίζει</em> το μηδέν, καμία αναστροφή ακόμη — το όριο. Σύρε τον{' '}
              <InlineMath>{'\\mu'}</InlineMath> στο <InlineMath>{'1.0'}</InlineMath> και δες
              τις κόκκινες ζώνες να εξαφανίζονται.
            </li>
            <li>
              <strong>Κανονική <InlineMath>{'m < 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 0.5'}</InlineMath>): η περιβάλλουσα μένει θετική, και ένας
              envelope detector ανακτά <em>καθαρά</em> το message. Στο τρίτο viz η{' '}
              <InlineMath>{'\\hat{m}'}</InlineMath> πέφτει πάνω στο{' '}
              <InlineMath>{'m'}</InlineMath> (RMS error <InlineMath>{'\\to 0'}</InlineMath>).
            </li>
            <li>
              <strong>Message δύο τόνων</strong> (π.χ.{' '}
              <InlineMath>{'m(t) = 2\\sin(2\\pi t) + \\cos(6\\pi t)'}</InlineMath>): το φάσμα
              αποκτά <em>δεύτερο</em> ζεύγος πλευρικών στα{' '}
              <InlineMath>{'\\pm(f_c \\pm 3)'}</InlineMath> Hz — η σκάλα προς το
              πολυαρμονικό AM. Η μέθοδος (γινόμενο-σε-άθροισμα ανά τόνο) δεν αλλάζει.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'proodos26-10',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 10',
    weight: 10,
    title: 'Φάσμα πλάτους και ισχύς για sin + sinc',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform', 'foundations/signals'],
    formulaIds: ['fourier-pair-rect', 'fourier-pair-sin', 'parseval-power'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος ισχύος από Parseval FS{' '}
        <InlineMath>{'P = A_0^2 + \\sum_k A_k^2/2'}</InlineMath>{' '}
        (parseval-power, βάρος <strong>4</strong>) — χρησιμοποιείται εδώ για να αθροίσεις
        ισχύ sin-term (<InlineMath>{'P = 1/2'}</InlineMath>, cos-power-half) + ισχύ sinc-term
        (<InlineMath>{'P = 0'}</InlineMath>, energy signal). Και ο τύπος{' '}
        <InlineMath>{'P = A^2/2'}</InlineMath>{' '}
        ανά τόνο (cos-power-half, βάρος 6) επίσης λείπει. Εμφανίστηκε σε{' '}
        <strong>4</strong> παλιά θέματα. Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 2.4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Έστω σήμα βασικής ζώνης{' '}
        <InlineMath>{'m(t) = \\sin(10\\pi t) + \\mathrm{sinc}(10t)'}</InlineMath>.
        Να υπολογιστεί και να σχεδιαστεί το φάσμα πλάτους του και να
        υπολογιστεί η ισχύς του.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Όρος 1:</strong>{' '}
          <InlineMath>{'\\sin(10\\pi t) = \\sin(2\\pi\\cdot 5\\cdot t)'}</InlineMath>{' '}
          → δύο impulses:
        </p>
        <BlockMath>{'\\mathcal{F}\\{\\sin(2\\pi 5 t)\\} = \\tfrac{1}{2j}[\\delta(f-5) - \\delta(f+5)]'}</BlockMath>
        <p>
          <strong>Όρος 2:</strong> με normalized sinc{' '}
          <InlineMath>{'\\mathrm{sinc}(x) = \\sin(\\pi x)/(\\pi x)'}</InlineMath>:
        </p>
        <BlockMath>{'\\mathrm{sinc}(10 t) \\;\\xleftrightarrow{\\mathcal{F}}\\; \\tfrac{1}{10}\\,\\mathrm{rect}(f/10)'}</BlockMath>
        <p>
          (rect από <InlineMath>{'-5'}</InlineMath> έως <InlineMath>5</InlineMath>{' '}
          Hz, ύψος <InlineMath>{'1/10'}</InlineMath>.)
        </p>
        <p>
          <strong>Συνολικό |M(f)|:</strong> ορθογώνιο πλάτος{' '}
          <InlineMath>{'1/10'}</InlineMath> για{' '}
          <InlineMath>{'|f| < 5'}</InlineMath> Hz, συν impulses ύψους{' '}
          <InlineMath>{'1/2'}</InlineMath> ακριβώς στις άκρες{' '}
          <InlineMath>{'f = \\pm 5'}</InlineMath> Hz.
        </p>
        <svg
          viewBox="0 0 380 170"
          className="my-3 block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
          role="img"
          aria-label="|M(f)|: ορθογώνιο ύψους 1/10 από −5 έως 5 Hz, και δύο impulses ύψους 1/2 στα ±5 Hz"
        >
          {/* x-axis */}
          <line x1="36" y1="130" x2="358" y2="130" stroke="currentColor" strokeOpacity="0.45" />
          <polygon points="364,130 354,126 354,134" fill="currentColor" fillOpacity="0.5" />
          <text x="368" y="134" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">f</text>
          {/* y-axis at f=0 */}
          <line x1="190" y1="130" x2="190" y2="20" stroke="currentColor" strokeOpacity="0.3" />
          <polygon points="190,14 186,22 194,22" fill="currentColor" fillOpacity="0.5" />
          {/* rect (sinc): 1/10 from f=-5 to f=+5 */}
          <rect x="80" y="116" width="220" height="14" fill="rgba(29, 78, 216, 0.20)" stroke="rgb(29, 78, 216)" strokeOpacity="0.85" />
          {/* impulses (sin): height 1/2 at f = ±5 */}
          <line x1="80" y1="130" x2="80" y2="60" stroke="rgb(217, 119, 6)" strokeWidth="2" />
          <polygon points="80,54 76,62 84,62" fill="rgb(217, 119, 6)" />
          <line x1="300" y1="130" x2="300" y2="60" stroke="rgb(217, 119, 6)" strokeWidth="2" />
          <polygon points="300,54 296,62 304,62" fill="rgb(217, 119, 6)" />
          {/* tick marks */}
          <line x1="80" y1="127" x2="80" y2="133" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="190" y1="127" x2="190" y2="133" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="300" y1="127" x2="300" y2="133" stroke="currentColor" strokeOpacity="0.5" />
          {/* tick labels */}
          <text x="80" y="146" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">−5 Hz</text>
          <text x="190" y="146" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">0</text>
          <text x="300" y="146" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">+5 Hz</text>
          {/* y-axis amplitude labels */}
          <text x="74" y="120" textAnchor="end" fontSize="10" fill="rgb(29, 78, 216)" fillOpacity="0.95">1/10</text>
          <text x="306" y="64" fontSize="10" fill="rgb(217, 119, 6)" fillOpacity="0.95">1/2</text>
          {/* spectrum label */}
          <text x="196" y="28" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">|M(f)|</text>
        </svg>
        <p>
          <strong>Ισχύς:</strong> ο όρος{' '}
          <InlineMath>{'\\sin(10\\pi t)'}</InlineMath> είναι περιοδικό
          power-signal με <InlineMath>{'P_1 = 1/2'}</InlineMath> W. Ο όρος{' '}
          <InlineMath>{'\\mathrm{sinc}(10t)'}</InlineMath> είναι{' '}
          <strong>finite-energy</strong> (πεπερασμένη ενέργεια{' '}
          <InlineMath>{'E = 1/10'}</InlineMath> J), οπότε{' '}
          <InlineMath>{'P_2 = 0'}</InlineMath> (μέση ισχύς σε άπειρο χρόνο
          είναι μηδέν για finite-energy signals). Άρα:
        </p>
        <BlockMath>{'P_m = P_1 + P_2 = \\tfrac{1}{2} + 0 = \\tfrac{1}{2}\\text{ W}'}</BlockMath>
      </>
    ),
  },
  {
    id: 'proodos26-11',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 11',
    weight: 9,
    title: 'USSB δύο σημάτων: φάσματα baseband και διαμορφωμένων',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/ssb', 'am/multiplexing'],
    formulaIds: ['ssb-signal', 'fourier-pair-rect', 'fourier-pair-tri'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος USSB σήματος{' '}
        <InlineMath>{'x_{USB}(t)=A_c m(t)\\cos(2\\pi f_c t)-A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα). Οι ζεύγοι Fourier rect
        και tri δίνονται στο τυπολόγιο. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:pb25-th2-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 2.3
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: (
      <p>
        Έστω τα δύο βασικά σήματα πληροφορίας{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
        <InlineMath>{'k(t) = \\mathrm{sinc}^2(Wt)'}</InlineMath>. Το κάθε σήμα
        διαμορφώνεται κατά AM-USSB με φέροντα <InlineMath>{'f_1'}</InlineMath>{' '}
        και <InlineMath>{'f_2'}</InlineMath> αντίστοιχα. Αποτυπώστε σχηματικά
        το φάσμα πλάτους των δύο σημάτων βασικής ζώνης και των δύο
        διαμορφωμένων σημάτων.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Baseband φάσματα:</strong>
        </p>
        <BlockMath>{'M(f) = \\tfrac{1}{W}\\,\\mathrm{rect}(f/W) \\quad\\Rightarrow\\quad |M(f)|\\text{ = ορθογώνιο πλάτος }1/W,\\; |f| < W/2'}</BlockMath>
        <BlockMath>{'K(f) = \\tfrac{1}{W}\\,\\mathrm{tri}(f/W) \\quad\\Rightarrow\\quad |K(f)|\\text{ = τρίγωνο κορυφή }1/W,\\; |f| < W'}</BlockMath>
        <p>
          (Σημείωση: το <InlineMath>{'\\mathrm{sinc}^2(Wt)'}</InlineMath> έχει
          <strong> διπλάσιο</strong> εύρος από το{' '}
          <InlineMath>{'\\mathrm{sinc}(Wt)'}</InlineMath> — βλ. ΘΕΜΑ 8.)
        </p>
        <p>
          <strong>USSB διαμόρφωση:</strong> κρατάμε <em>μόνο</em> την upper
          sideband γύρω από κάθε φέρον. Για το{' '}
          <InlineMath>{'m(t)'}</InlineMath> με carrier{' '}
          <InlineMath>{'f_1'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Στα θετικά <InlineMath>f</InlineMath>: rect από{' '}
            <InlineMath>{'f_1'}</InlineMath> έως{' '}
            <InlineMath>{'f_1 + W/2'}</InlineMath>, ύψος{' '}
            <InlineMath>{'1/(2W)'}</InlineMath>.
          </li>
          <li>
            Mirror στα αρνητικά: rect από{' '}
            <InlineMath>{'-f_1 - W/2'}</InlineMath> έως{' '}
            <InlineMath>{'-f_1'}</InlineMath>, ίδιο ύψος.
          </li>
        </ul>
        <p>
          Για το <InlineMath>{'k(t)'}</InlineMath> με carrier{' '}
          <InlineMath>{'f_2'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Στα θετικά: <em>τρίγωνο</em> από <InlineMath>{'f_2'}</InlineMath>{' '}
            (κορυφή ύψους <InlineMath>{'1/(2W)'}</InlineMath>) πέφτοντας
            γραμμικά στο 0 στο <InlineMath>{'f_2 + W'}</InlineMath>.
          </li>
          <li>
            Mirror στα αρνητικά γύρω από <InlineMath>{'-f_2'}</InlineMath>.
          </li>
        </ul>
        <svg
          viewBox="0 0 480 140"
          className="my-3 block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
          role="img"
          aria-label="USSB φάσματα: rect στο [f_1, f_1+W/2] για το m(t) και τρίγωνο με κορυφή στο f_2 και βάση στο f_2+W για το k(t)"
        >
          {/* x-axis */}
          <line x1="20" y1="100" x2="438" y2="100" stroke="currentColor" strokeOpacity="0.45" />
          <polygon points="444,100 434,96 434,104" fill="currentColor" fillOpacity="0.5" />
          <text x="448" y="104" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">f</text>
          {/* origin tick */}
          <line x1="40" y1="97" x2="40" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <text x="40" y="116" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.75">0</text>
          {/* USSB(m) — rect [f_1, f_1+W/2], height 1/(2W) */}
          <rect x="120" y="70" width="60" height="30" fill="rgba(29, 78, 216, 0.20)" stroke="rgb(29, 78, 216)" strokeOpacity="0.9" />
          <text x="150" y="62" textAnchor="middle" fontSize="10" fill="rgb(29, 78, 216)" fillOpacity="0.95">USSB(m)</text>
          {/* USSB(k) — right triangle: peak at f_2, drops to 0 at f_2+W */}
          <path d="M 260 70 L 260 100 L 400 100 Z" fill="rgba(220, 38, 38, 0.18)" stroke="rgb(220, 38, 38)" strokeOpacity="0.9" />
          <text x="296" y="62" fontSize="10" fill="rgb(220, 38, 38)" fillOpacity="0.95">USSB(k)</text>
          {/* tick marks */}
          <line x1="120" y1="97" x2="120" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="180" y1="97" x2="180" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="260" y1="97" x2="260" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="400" y1="97" x2="400" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          {/* tick labels */}
          <text x="120" y="116" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">f_1</text>
          <text x="180" y="116" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">f_1+W/2</text>
          <text x="260" y="116" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">f_2</text>
          <text x="400" y="116" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">f_2+W</text>
          {/* note */}
          <text x="240" y="132" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6" fontStyle="italic">(+ καθρέφτης στις αρνητικές f γύρω από −f_1 και −f_2)</text>
        </svg>
      </>
    ),
  },
  {
    id: 'proodos26-12',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 12',
    weight: 9,
    title: 'Συνθήκη μη-επικάλυψης για USSB FDM',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/ssb', 'am/multiplexing'],
    formulaIds: ['ssb-signal', 'fdm-spacing'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος USSB σήματος{' '}
        <InlineMath>{'x_{USB}(t)=A_c m(t)\\cos(2\\pi f_c t)-A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα) και η συνθήκη
        μη-επικάλυψης FDM-SSB{' '}
        <InlineMath>{'(\\Delta f \\ge W,\\; f_1 \\ge W/2)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>4</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:pb25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 3
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: (
      <p>
        Πόσο πρέπει να είναι τα φέροντα <InlineMath>{'f_1'}</InlineMath> και{' '}
        <InlineMath>{'f_2'}</InlineMath> σε σχέση με το <InlineMath>W</InlineMath>{' '}
        για να μπορούμε να αποπολυπλέξουμε τα δύο σήματα χωρίς να
        επικαλύπτονται;
      </p>
    ),
    solution: (
      <>
        <p>
          Από το ΘΕΜΑ 11, η USSB του <InlineMath>{'m(t)'}</InlineMath> πιάνει{' '}
          <InlineMath>{'[f_1,\\, f_1 + W/2]'}</InlineMath> (με mirror στα
          αρνητικά) και η USSB του <InlineMath>{'k(t)'}</InlineMath> πιάνει{' '}
          <InlineMath>{'[f_2,\\, f_2 + W]'}</InlineMath>. Υποθέτουμε χωρίς
          βλάβη της γενικότητας <InlineMath>{'f_1 < f_2'}</InlineMath>.
        </p>
        <p>
          <strong>Συνθήκη 1 — να μην επικαλύπτονται μεταξύ τους:</strong> η
          άκρη της USSB(m) πρέπει να βρίσκεται κάτω από την αρχή της USSB(k):
        </p>
        <BlockMath>{'f_1 + \\tfrac{W}{2} \\le f_2 \\quad\\Longleftrightarrow\\quad f_2 \\ge f_1 + \\tfrac{W}{2}'}</BlockMath>
        <p>
          <strong>Συνθήκη 2 — κάθε USSB να μη «φτάνει» στο 0</strong> (ώστε
          το mirror στα αρνητικά να μη μπει στα θετικά):
        </p>
        <BlockMath>{'f_1 \\ge \\tfrac{W}{2}, \\qquad f_2 \\ge W'}</BlockMath>
        <p>
          (Αν <InlineMath>{'f_1 < W/2'}</InlineMath>, το mirror της USSB(m)
          θα έσπαγε στο positive axis· αν <InlineMath>{'f_2 < W'}</InlineMath>,
          το ίδιο για την USSB(k).)
        </p>
        <p>
          <strong>Συνολικά:</strong> πρέπει{' '}
          <InlineMath>{'f_1 \\ge W/2'}</InlineMath>, και{' '}
          <InlineMath>{'f_2 \\ge \\max(W,\\; f_1 + W/2)'}</InlineMath>. Στην
          πράξη παίρνουμε guard band μεταξύ των δύο για ασφάλεια από real
          (όχι ιδανικά) BPF.
        </p>
      </>
    ),
  },
  {
    id: 'proodos26-13',
    origin: 'past-exam',
    source: 'proodos-april-2026',
    problemNumber: 'ΘΕΜΑ 13',
    weight: 8,
    title: 'Φάσμα πολυπλεγμένου σήματος G(f)',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/ssb', 'am/multiplexing'],
    formulaIds: ['ssb-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος USSB σήματος{' '}
        <InlineMath>{'x_{USB}(t)=A_c m(t)\\cos(2\\pi f_c t)-A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα). Το πολυπλεγμένο
        φάσμα G(f) εξάγεται από τα φάσματα του ΘΕΜΑ 11 και τη συνθήκη
        μη-επικάλυψης του ΘΕΜΑ 12. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:pb25-th2-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 2.3
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: (
      <p>
        Αποτυπώστε σχηματικά το φάσμα του πολυπλεγμένου σήματος{' '}
        <InlineMath>G(f)</InlineMath> των δύο διαμορφωμένων σημάτων με βάση
        την επιλογή των <InlineMath>{'f_1'}</InlineMath> και{' '}
        <InlineMath>{'f_2'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Το πολυπλεγμένο σήμα είναι το άθροισμα των δύο USSB:
        </p>
        <BlockMath>{'g(t) = x_{USSB,m}(t) + x_{USSB,k}(t) \\quad\\Rightarrow\\quad G(f) = X_{USSB,m}(f) + X_{USSB,k}(f)'}</BlockMath>
        <p>
          Διαλέγοντας <InlineMath>{'f_1, f_2'}</InlineMath> από το ΘΕΜΑ 12
          (π.χ. <InlineMath>{'f_1 = W/2,\\; f_2 = f_1 + W/2 = W'}</InlineMath>{' '}
          για το οριακά compact packing), το <InlineMath>G(f)</InlineMath>{' '}
          είναι η ένωση τεσσάρων «μπλοκ»:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>Θετικές:</strong> rect στο{' '}
            <InlineMath>{'[f_1,\\, f_1 + W/2]'}</InlineMath> + τρίγωνο στο{' '}
            <InlineMath>{'[f_2,\\, f_2 + W]'}</InlineMath>.
          </li>
          <li>
            <strong>Αρνητικές</strong> (mirror): rect στο{' '}
            <InlineMath>{'[-f_1 - W/2,\\, -f_1]'}</InlineMath> + τρίγωνο στο{' '}
            <InlineMath>{'[-f_2 - W,\\, -f_2]'}</InlineMath>.
          </li>
        </ul>
        <svg
          viewBox="0 0 480 150"
          className="my-3 block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
          role="img"
          aria-label="|G(f)|: USSB(m) ορθογώνιο γύρω από ±f_1 και USSB(k) τρίγωνο γύρω από ±f_2, με όλους τους κατόπτρους στις αρνητικές συχνότητες"
        >
          {/* x-axis */}
          <line x1="20" y1="100" x2="438" y2="100" stroke="currentColor" strokeOpacity="0.45" />
          <polygon points="444,100 434,96 434,104" fill="currentColor" fillOpacity="0.5" />
          <text x="448" y="104" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">f</text>
          {/* y-axis at f=0 */}
          <line x1="240" y1="100" x2="240" y2="22" stroke="currentColor" strokeOpacity="0.3" />
          <polygon points="240,16 236,24 244,24" fill="currentColor" fillOpacity="0.5" />
          {/* + side: USSB(m) rect [f_1, f_1+W/2] (compact: f_1+W/2 = f_2) */}
          <rect x="280" y="70" width="40" height="30" fill="rgba(29, 78, 216, 0.20)" stroke="rgb(29, 78, 216)" strokeOpacity="0.9" />
          {/* + side: USSB(k) triangle [f_2, f_2+W], peak at f_2 */}
          <path d="M 320 70 L 320 100 L 400 100 Z" fill="rgba(220, 38, 38, 0.18)" stroke="rgb(220, 38, 38)" strokeOpacity="0.9" />
          {/* − side mirror rect [-f_1-W/2, -f_1] */}
          <rect x="160" y="70" width="40" height="30" fill="rgba(29, 78, 216, 0.20)" stroke="rgb(29, 78, 216)" strokeOpacity="0.9" />
          {/* − side mirror triangle [-f_2-W, -f_2], peak at -f_2 */}
          <path d="M 160 70 L 160 100 L 80 100 Z" fill="rgba(220, 38, 38, 0.18)" stroke="rgb(220, 38, 38)" strokeOpacity="0.9" />
          {/* height label 1/(2W) on the rect */}
          <text x="216" y="68" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.65" fontStyle="italic">1/(2W)</text>
          {/* tick marks */}
          <line x1="80" y1="97" x2="80" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="160" y1="97" x2="160" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="200" y1="97" x2="200" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="240" y1="97" x2="240" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="280" y1="97" x2="280" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="320" y1="97" x2="320" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          <line x1="400" y1="97" x2="400" y2="103" stroke="currentColor" strokeOpacity="0.5" />
          {/* tick labels — for compact packing f_2 = f_1+W/2 */}
          <text x="80" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">−f_2−W</text>
          <text x="160" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">−f_2</text>
          <text x="200" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">−f_1</text>
          <text x="240" y="114" textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.8">0</text>
          <text x="280" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">f_1</text>
          <text x="320" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">f_2</text>
          <text x="400" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.8">f_2+W</text>
          {/* spectrum label */}
          <text x="246" y="30" fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">|G(f)|</text>
          {/* legend */}
          <rect x="20" y="20" width="10" height="8" fill="rgba(29, 78, 216, 0.20)" stroke="rgb(29, 78, 216)" strokeOpacity="0.9" />
          <text x="34" y="28" fontSize="9" fill="currentColor" fillOpacity="0.85">USSB(m)</text>
          <rect x="20" y="34" width="10" height="8" fill="rgba(220, 38, 38, 0.18)" stroke="rgb(220, 38, 38)" strokeOpacity="0.9" />
          <text x="34" y="42" fontSize="9" fill="currentColor" fillOpacity="0.85">USSB(k)</text>
          {/* compact-packing note */}
          <text x="240" y="138" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6" fontStyle="italic">οριακά compact: f_2 = f_1 + W/2</text>
        </svg>
        <p>
          Στον δέκτη: για το <InlineMath>{'m(t)'}</InlineMath> χρησιμοποιούμε
          BPF γύρω από <InlineMath>{'[f_1,\\, f_1 + W/2]'}</InlineMath> και
          μετά coherent demod με <InlineMath>{'\\cos(2\\pi f_1 t)'}</InlineMath>·
          για το <InlineMath>{'k(t)'}</InlineMath> BPF γύρω από{' '}
          <InlineMath>{'[f_2,\\, f_2 + W]'}</InlineMath> με demod στο{' '}
          <InlineMath>{'f_2'}</InlineMath>. Η μη-επικάλυψη που εξασφαλίσαμε
          στο ΘΕΜΑ 12 κάνει αυτή τη διαδικασία δυνατή.
        </p>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ΕΞΕΤΑΣΗ ΣΕΠΤΕΜΒΡΙΟΥ 2025 (11 problems · 100%)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'sept25-th1-1',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 1.1',
    weight: 10,
    title: 'Αρχή λειτουργίας AM — εξίσωση, sidebands',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional', 'am/overview'],
    formulaIds: ['am-signal', 'am-spectrum', 'am-bandwidth'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική), το
        φάσμα AM{' '}
        <InlineMath>{'X_{AM}(f) = \\tfrac{A_c}{2}\\delta(f\\mp f_c) + \\tfrac{1}{2}M(f\\mp f_c)'}</InlineMath>{' '}
        (σε <strong>4</strong>) και το εύρος ζώνης{' '}
        <InlineMath>{'B_{AM} = 2W'}</InlineMath>{' '}
        (σε <strong>3</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 9
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-7"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.7
        </Link>.
      </>
    ),
    statement: (
      <p>
        Εξηγήστε την αρχή λειτουργίας της διαμόρφωσης πλάτους (AM). Γράψτε
        την μαθηματική εξίσωση του AM σήματος και αναλύστε το φάσμα του,
        δείχνοντας τις πλευρικές ζώνες (sidebands).
      </p>
    ),
    solution: (
      <>
        <p>
          Η AM «ανυψώνει» ένα baseband σήμα <InlineMath>m(t)</InlineMath>{' '}
          γύρω από συχνότητα <InlineMath>f_c</InlineMath> προσθέτοντας
          σταθερή συνιστώσα <InlineMath>A_c</InlineMath> (carrier) και
          πολλαπλασιάζοντας με <InlineMath>{'\\cos(2\\pi f_c t)'}</InlineMath>:
        </p>
        <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</BlockMath>
        <p>Από modulation theorem:</p>
        <BlockMath>{'X_{AM}(f) = \\tfrac{A_c}{2}[\\delta(f-f_c) + \\delta(f+f_c)] + \\tfrac{1}{2}[M(f-f_c) + M(f+f_c)]'}</BlockMath>
        <p>
          Στις θετικές συχνότητες: ένα impulse στον carrier{' '}
          <InlineMath>{'f_c'}</InlineMath>, μια <strong>upper sideband</strong>{' '}
          (USB, <InlineMath>{'f > f_c'}</InlineMath>) και μια{' '}
          <strong>lower sideband</strong> (LSB,{' '}
          <InlineMath>{'f < f_c'}</InlineMath>). Συμμετρικά στα αρνητικά.
          Bandwidth = <InlineMath>{'2W'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'sept25-th1-2',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 1.2',
    weight: 10,
    title: 'Conventional AM — μ, ισχύς carrier, ισχύς συνολική',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal', 'am-mu', 'am-power'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        η ισχύς{' '}
        <InlineMath>{'P_{AM} = P_c(1 + \\mu^2/2)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>4</strong> παλιά θέματα) και ο δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m / A_c'}</InlineMath>{' '}
        (σε <strong>8</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 4
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:proodos26-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Δίνεται φέρον κύμα με πλάτος <InlineMath>{'A_c = 10'}</InlineMath> V και
        σήμα πληροφορίας <InlineMath>{'m(t) = \\cos(2\\pi f_m t)'}</InlineMath>{' '}
        με πλάτος <InlineMath>{'A_m = 5'}</InlineMath> V. Υπολογίστε τον
        συντελεστή διαμόρφωσης, την ισχύ του φέροντος, και τη συνολική ισχύ
        του σήματος AM.
      </p>
    ),
    solution: (
      <>
        <BlockMath>{'\\mu = \\frac{A_m}{A_c} = \\frac{5}{10} = 0.5'}</BlockMath>
        <p>Ισχύς carrier (RMS²/2):</p>
        <BlockMath>{'P_c = \\frac{A_c^2}{2} = \\frac{100}{2} = 50\\text{ W}'}</BlockMath>
        <p>
          Ισχύς message: <InlineMath>{'P_m = A_m^2/2 = 12.5'}</InlineMath> W.
          Συνολική ισχύς:
        </p>
        <BlockMath>{'P_{AM} = \\frac{A_c^2}{2} + \\frac{A_m^2}{4} = 50 + 6.25 = 56.25\\text{ W}'}</BlockMath>
        <p>
          (Ή ισοδύναμα <InlineMath>{'P_c(1 + \\mu^2/2) = 50\\cdot 1.125 = 56.25'}</InlineMath> W
          για normalized single-tone message.)
        </p>
      </>
    ),
  },
  {
    id: 'sept25-th1-3',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 1.3',
    weight: 6,
    title: 'AM vs DSB-SC vs SSB — bandwidth & ισχύς',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/overview', 'am/conventional', 'am/dsb-sc', 'am/ssb'],
    formulaIds: ['am-bandwidth', 'am-power', 'dsb-sc-power', 'am-eta'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        η ισχύς{' '}
        <InlineMath>{'P_{AM} = P_c(1 + \\mu^2/2)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>4</strong> παλιά θέματα), η απόδοση{' '}
        <InlineMath>{'\\eta = \\mu^2/(2+\\mu^2) \\le 1/3'}</InlineMath>{' '}
        (σε <strong>3</strong>), το εύρος ζώνης{' '}
        <InlineMath>{'B_{AM} = 2W'}</InlineMath>{' '}
        (σε <strong>3</strong>) και η ισχύς DSB-SC{' '}
        <InlineMath>{'P_{DSB} = A_c^2 P_m / 2'}</InlineMath>{' '}
        (σε <strong>1</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 4
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:proodos26-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Να περιγράψετε τις διαφορές μεταξύ AM, DSB-SC (διπλής πλευρικής ζώνης
        με καταστολή φέροντος) και SSB (απλής πλευρικής ζώνης). Συγκρίνετε ως
        προς τις απαιτήσεις σε εύρος ζώνης και ισχύ.
      </p>
    ),
    solution: (
      <>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left">Σχήμα</th>
              <th className="py-2 text-left">Bandwidth</th>
              <th className="py-2 text-left">Carrier</th>
              <th className="py-2 text-left">η</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>Conventional AM</td><td>2W</td><td>ναι, μεγάλο</td><td>≤ 33%</td></tr>
            <tr><td>DSB-SC</td><td>2W</td><td>όχι</td><td>100%</td></tr>
            <tr><td>SSB</td><td>W</td><td>όχι</td><td>100%</td></tr>
          </tbody>
        </table>
        <p>
          AM σπαταλά ισχύ στον carrier (που δεν φέρει πληροφορία) αλλά
          επιτρέπει απλό envelope detector. DSB-SC και SSB απαιτούν coherent
          demod. SSB έχει το <em>μισό</em> bandwidth — βέλτιστη για στενά
          κανάλια.
        </p>
      </>
    ),
  },
  {
    id: 'sept25-th1-4',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 1.4',
    weight: 8,
    title: 'Envelope detector — λειτουργία & συνθήκες',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/modulator-demodulator'],
    formulaIds: ['envelope-detector-rc', 'am-mu'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>{' '}
        (συνθήκη <InlineMath>{'\\mu \\le 1'}</InlineMath> για ορθή λειτουργία —
        εμφανίστηκε σε <strong>8</strong> παλιά θέματα) και η σταθερά χρόνου{' '}
        <InlineMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{W}'}</InlineMath>{' '}
        (σε <strong>1</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:proodos26-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: (
      <p>
        Περιγράψτε τη λειτουργία ενός envelope detector (ανιχνευτή
        περιβάλλουσας). Ποιες είναι οι βασικές προϋποθέσεις για την ορθή
        λειτουργία του;
      </p>
    ),
    solution: (
      <>
        <p>
          Δίοδος + RC σε παράλληλη σύνδεση. Η δίοδος ανορθώνει (κρατάει μόνο
          θετικά μισόπεριόδια), ο πυκνωτής φορτίζεται στην peak τιμή και
          εκφορτίζεται αργά μέσω της <InlineMath>R</InlineMath>, ακολουθώντας
          την περιβάλλουσα <InlineMath>{'V(t) = |A_c + m(t)|'}</InlineMath>.
        </p>
        <p>Συνθήκες ορθής λειτουργίας:</p>
        <ol className="ml-5 list-decimal space-y-1 text-fg-muted">
          <li>
            <strong>μ ≤ 1</strong> — αλλιώς overmodulation, το envelope δεν
            ταυτίζεται με το <InlineMath>{'A_c + m(t)'}</InlineMath>.
          </li>
          <li>
            <strong>RC time constant</strong>:{' '}
            <InlineMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{W}'}</InlineMath>{' '}
            — μικρότερο από <InlineMath>{'1/W'}</InlineMath> για να
            ακολουθεί το envelope, μεγαλύτερο από{' '}
            <InlineMath>{'1/f_c'}</InlineMath> για να εξομαλύνει τον carrier.
          </li>
          <li>
            <strong>Capacitor</strong> στην έξοδο για αφαίρεση του DC{' '}
            <InlineMath>{'A_c'}</InlineMath> και απομόνωση του{' '}
            <InlineMath>m(t)</InlineMath>.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'sept25-th1-5',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 1.5',
    weight: 10,
    title: 'AM φάσμα δύο-τόνου message',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/conventional', 'foundations/fourier-transform'],
    formulaIds: ['am-signal', 'fourier-pair-cos', 'fourier-modulation-theorem', 'am-spectrum'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα) και το φάσμα AM{' '}
        <InlineMath>{'X_{AM}(f) = \\tfrac{A_c}{2}\\delta(f\\mp f_c) + \\tfrac{1}{2}M(f\\mp f_c)'}</InlineMath>{' '}
        (σε <strong>4</strong>). Το ζεύγος Fourier (
        <InlineMath>{'\\cos'}</InlineMath>) και το θεώρημα διαμόρφωσης βρίσκονται
        στο τυπολόγιο — δεν χρειάζεται να τα θυμάσαι. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 9
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.1
        </Link>.
      </>
    ),
    statement: (
      <p>
        Ένα σήμα πληροφορίας{' '}
        <InlineMath>{'m(t) = \\cos(2\\pi\\cdot 1\\,\\text{kHz}\\cdot t) + 0.5\\cos(2\\pi\\cdot 2\\,\\text{kHz}\\cdot t)'}</InlineMath>{' '}
        διαμορφώνεται κατά AM σε φέρον συχνότητας 100 kHz. Σχεδιάστε το φάσμα
        του διαμορφωμένου σήματος.
      </p>
    ),
    solution: (
      <>
        <p>
          <InlineMath>{'M(f)'}</InlineMath> έχει impulses πλάτους 1/2 στις{' '}
          <InlineMath>{'\\pm 1'}</InlineMath> kHz και πλάτους 1/4 στις{' '}
          <InlineMath>{'\\pm 2'}</InlineMath> kHz.
        </p>
        <p>
          Στο AM φάσμα <InlineMath>{'X_{AM}(f)'}</InlineMath> εμφανίζονται:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>Carrier:</strong> impulses{' '}
            <InlineMath>{'A_c/2'}</InlineMath> στις{' '}
            <InlineMath>{'\\pm 100'}</InlineMath> kHz.
          </li>
          <li>
            <strong>USB:</strong> 1/4 στις 101 kHz (από{' '}
            <InlineMath>{'f_c + 1'}</InlineMath>) και 1/8 στις 102 kHz (από{' '}
            <InlineMath>{'f_c + 2'}</InlineMath>). Συμμετρικά LSB στις 99
            kHz (1/4) και 98 kHz (1/8).
          </li>
          <li>
            Ομοίως στα <InlineMath>{'-100'}</InlineMath> kHz: USB στις{' '}
            <InlineMath>{'-99, -98'}</InlineMath>· LSB στις{' '}
            <InlineMath>{'-101, -102'}</InlineMath>.
          </li>
        </ul>
        <p>Bandwidth συνολικά = 4 kHz (από 98 έως 102).</p>
      </>
    ),
  },
  {
    id: 'sept25-th2-6',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 2.6',
    weight: 8,
    title: 'FM αρχή λειτουργίας + δείκτης β',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea'],
    formulaIds: ['fm-signal', 'fm-instantaneous-freq', 'fm-beta'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Ο ορισμός{' '}
        <InlineMath>{'\\beta_f = \\Delta f_{max}/W = K_f\\,\\max|m(t)|/W'}</InlineMath>{' '}
        απαιτείται να τον ξέρεις απέξω (βάρος 6 — ανώτατο στο FM κεφάλαιο). Εμφανίστηκε
        και στα τρία τελικά/επί πτυχίω:{' '}
        <Link href="/practice#exercise:sept25-th2-8">Σεπτ.2025 ΘΕΜΑ 2.8</Link>
        {' · '}
        <Link href="/practice#exercise:jan26-th4-fm">Ιαν.2026 ΘΕΜΑ 4</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th3-fm">Ιούν.2025 ΘΕΜΑ 3</Link>.{' '}
        <strong>
          ⚠️ Γενική εξίσωση FM{' '}
          <InlineMath>{'x_{FM} = A_c\\cos[2\\pi f_c t + 2\\pi K_f\\int_{-\\infty}^{t}m(\\tau)\\,d\\tau]'}</InlineMath>{' '}
          — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 1 — ρητή ερώτηση «δώστε τη μαθηματική έκφραση του FM σήματος» στο παρόν θέμα).{' '}
        <strong>
          ⚠️ Στιγμιαία συχνότητα{' '}
          <InlineMath>{'f_i(t) = f_c + K_f\\,m(t)'}</InlineMath>{' '}
          — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — 2 παλιά θέματα: εδώ ρητά + Ιούν.2025 ως ενδιάμεσο βήμα στον υπολογισμό β = K_f·A_m/f_m).
      </>
    ),
    statement: (
      <p>
        Εξηγήστε την αρχή λειτουργίας της διαμόρφωσης συχνότητας (FM). Δώστε
        τη μαθηματική έκφραση του σήματος FM και ορίστε τον δείκτη
        διαμόρφωσης β.
      </p>
    ),
    solution: (
      <>
        <p>
          Στην FM η <strong>στιγμιαία συχνότητα</strong> κουνιέται γύρω από
          τον carrier ανάλογα με το <InlineMath>m(t)</InlineMath>:
        </p>
        <BlockMath>{'f(t) = f_c + K_f\\, m(t)'}</BlockMath>
        <p>Φάση = ολοκλήρωμα στιγμιαίας συχνότητας:</p>
        <BlockMath>{'x_{FM}(t) = A_c\\cos\\!\\left[2\\pi f_c t + 2\\pi K_f \\int_{-\\infty}^{t} m(\\tau)\\,d\\tau\\right]'}</BlockMath>
        <p>
          <strong>Δείκτης διαμόρφωσης</strong> για bandwidth W του message:
        </p>
        <BlockMath>{'\\beta_f = \\frac{\\Delta f}{W} = \\frac{K_f \\max|m(t)|}{W}'}</BlockMath>
        <p>
          Πληροφορία ζει στη φάση, envelope μένει σταθερό{' '}
          <InlineMath>{'V = A_c'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'sept25-th2-7',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 2.7',
    weight: 8,
    title: 'Σύγκριση FM vs AM',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/in-noise', 'am/modulator-demodulator'],
    formulaIds: ['fm-snr-out', 'fm-gain-am', 'carson', 'am-bandwidth', 'am-output-snr'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Ο κανόνας Carson{' '}
        <InlineMath>{'B \\cong 2W(\\beta+1)'}</InlineMath>{' '}
        απαιτείται να τον ξέρεις απέξω (βάρος 6 — ανώτατο στο FM κεφάλαιο). Εμφανίστηκε
        και στα τρία τελικά/επί πτυχίω:{' '}
        <Link href="/practice#exercise:sept25-th2-8">Σεπτ.2025 ΘΕΜΑ 2.8</Link>
        {' · '}
        <Link href="/practice#exercise:jan26-th4-fm">Ιαν.2026 ΘΕΜΑ 4</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th3-fm">Ιούν.2025 ΘΕΜΑ 3</Link>.{' '}
        Επίσης off-sheet τα output-SNR αποτελέσματα αυτού του θέματος (βάρος 1
        έκαστο — αυτό το θέμα είναι το μοναδικό στην τράπεζα που τα ζητάει
        ρητά):{' '}
        <InlineMath>{'\\text{SNR}_{out,AM} = \\eta\\,\\text{SNR}_{ref}'}</InlineMath>{' '}
        (id <code>am-output-snr</code>),{' '}
        <InlineMath>{'\\text{SNR}_{out,FM} = 3\\beta^2\\,\\text{SNR}_{ref}'}</InlineMath>{' '}
        (id <code>fm-snr-out</code>), και{' '}
        <InlineMath>{'G_{FM/AM} = 9\\beta^2'}</InlineMath>{' '}
        (id <code>fm-gain-am</code>) — δεν δίνεται κανένας τους στο τυπολόγιο.
      </>
    ),
    statement: (
      <p>
        Συγκρίνετε τα συστήματα FM και AM ως προς: ευαισθησία στον θόρυβο,
        απαιτήσεις σε εύρος ζώνης, απόδοση ισχύος, πολυπλοκότητα δέκτη.
      </p>
    ),
    solution: (
      <>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left">Παράγοντας</th>
              <th className="py-2 text-left">AM</th>
              <th className="py-2 text-left">FM</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>Θόρυβος</td><td>Άμεσα στο envelope (κακή ανοσία)</td><td>Σταθερό envelope → limiter αφαιρεί amplitude θόρυβο</td></tr>
            <tr><td>Output SNR gain</td><td>~ <InlineMath>{'\\mu^2'}</InlineMath></td><td>~ <InlineMath>{'3\\beta^2'}</InlineMath> (FM gain over AM = <InlineMath>{'9\\beta^2'}</InlineMath>)</td></tr>
            <tr><td>Bandwidth</td><td>2W</td><td>2(β+1)W (μεγαλύτερο)</td></tr>
            <tr><td>Ισχύς</td><td>Σπαταλά στον carrier (η ≤ 33%)</td><td>Πάντα <InlineMath>{'A_c^2/2'}</InlineMath>, όλη ωφέλιμη</td></tr>
            <tr><td>Πολυπλοκότητα</td><td>Χαμηλή (envelope detector)</td><td>Μέτρια (limiter + discriminator)</td></tr>
          </tbody>
        </table>
        <p>
          Trade-off: FM «αγοράζει» SNR με bandwidth. Για εμπορικό FM
          ραδιόφωνο (β=5), gain = 9·25 = 225 → 23.5 dB.
        </p>
      </>
    ),
  },
  {
    id: 'sept25-th2-8',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 2.8',
    weight: 12,
    title: 'FM — β και Carson για εμπορικό σήμα',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/idea', 'fm/carson'],
    formulaIds: ['fm-beta', 'carson'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνονται στο τυπολόγιο.</strong>{' '}
        Και ο ορισμός <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath> (βάρος 6) και
        ο κανόνας Carson <InlineMath>{'B = 2(\\beta+1)f_m'}</InlineMath> (βάρος 6)
        απαιτούνται να τους ξέρεις απέξω — εμφανίζονται μαζί σε κάθε εξεταστική που
        περιλαμβάνει FM. Αυτή η άσκηση είναι ο κανονικός τύπος: δίνεται{' '}
        <InlineMath>{'\\Delta f'}</InlineMath> και <InlineMath>{'f_m'}</InlineMath>,
        βρες β και μετά B.
      </>
    ),
    statement: (
      <p>
        Σήμα <InlineMath>{'m(t) = A_m\\cos(2\\pi f_m t)'}</InlineMath> με
        μέγιστη συχνότητα <InlineMath>{'f_m = 5'}</InlineMath> kHz
        διαμορφώνει FM φέρον στα 100 MHz με απόκλιση συχνότητας{' '}
        <InlineMath>{'\\Delta f = 50'}</InlineMath> kHz. Υπολογίστε (1) τον
        δείκτη διαμόρφωσης, (2) το απαιτούμενο εύρος ζώνης κατά Carson.
      </p>
    ),
    solution: (
      <>
        <BlockMath>{'\\beta = \\frac{\\Delta f}{f_m} = \\frac{50}{5} = 10 \\quad \\text{(WBFM)}'}</BlockMath>
        <BlockMath>{'B = 2(\\beta + 1) f_m = 2\\cdot 11\\cdot 5\\,\\text{kHz} = 110\\,\\text{kHz}'}</BlockMath>
      </>
    ),
  },
  {
    id: 'sept25-th2-9',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 2.9',
    weight: 12,
    title: 'FM Bessel — sidebands για β=2.5',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/bessel'],
    formulaIds: ['fm-bessel-sidebands', 'fm-bessel-property', 'carson', 'fm-beta'],
    memorizationNote: (
      <>
        Οι τιμές των <InlineMath>{'J_n(\\beta)'}</InlineMath> δίνονται στο
        τυπολόγιο σε πίνακα — δεν χρειάζεται να τις αποστηθίσεις, αλλά πρέπει
        να ξέρεις πώς να τον διαβάσεις γρήγορα.{' '}
        <strong>
          ⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:{' '}
          <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath> (βάρος 6 —
          εμφανίστηκε σε 6 παλιά θέματα)
        </strong>{' '}
        — εδώ <InlineMath>{'\\beta = 2.5'}</InlineMath> δίνεται άμεσα, αλλά
        στα υπόλοιπα FM θέματα υπολογίζεις πρώτα{' '}
        <InlineMath>{'\\beta_f'}</InlineMath> από τα δεδομένα.{' '}
        <strong>
          ⚠️ Ο κανόνας Carson{' '}
          <InlineMath>{'B \\cong 2(\\beta+1)f_m'}</InlineMath> δεν δίνεται στο
          τυπολόγιο
        </strong>{' '}
        (βάρος 6 — ανώτατο στο FM κεφάλαιο) — τον γράφεις απέξω.{' '}
        <strong>
          ⚠️ Η μορφή Bessel{' '}
          <InlineMath>{'x_{FM} = A_c\\sum_n J_n(\\beta)\\cos[2\\pi(f_c+nf_m)t]'}</InlineMath>{' '}
          δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — εμφανίστηκε σε 3 παλιά θέματα) — ο πίνακας τιμών{' '}
        <InlineMath>{'J_n(\\beta)'}</InlineMath> δίνεται, η ΜΟΡΦΗ όχι.{' '}
        <strong>
          ⚠️ Συμμετρία{' '}
          <InlineMath>{'J_{-n} = (-1)^n J_n'}</InlineMath>{' '}
          + energy identity{' '}
          <InlineMath>{'\\sum_n J_n^2 = 1'}</InlineMath>{' '}
          δεν δίνονται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — ίδια 3 παλιά θέματα) — τις γράφεις απέξω.
      </>
    ),
    statement: (
      <p>
        Για μονοτονικό σήμα πληροφορίας <InlineMath>{'m(t) = \\cos(2\\pi f_m t)'}</InlineMath>{' '}
        και δείκτη διαμόρφωσης <InlineMath>{'\\beta = 2.5'}</InlineMath>:{' '}
        (Α) Γράψτε τη σειρά Bessel που περιγράφει το φάσμα του FM σήματος.
        (Β) Προσδιορίστε τις σχετικές εντάσεις για τα πρώτα τρία ζεύγη
        πλευρικών ζωνών. (Γ) Εκτιμήστε το πρακτικό εύρος ζώνης με τον κανόνα
        του Carson.
      </p>
    ),
    solution: (
      <>
        <p>(Α) Bessel form:</p>
        <BlockMath>{'x_{FM}(t) = A_c\\sum_{n=-\\infty}^{\\infty} J_n(2.5)\\cos[2\\pi(f_c + n f_m)t]'}</BlockMath>
        <p>
          (Β) Από τον πίνακα Bessel για <InlineMath>{'\\beta = 2.5'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li><InlineMath>{'J_0(2.5) \\approx -0.05'}</InlineMath> (carrier σχεδόν εξαφανίζεται — κοντά στη ρίζα 2.405)</li>
          <li><InlineMath>{'J_1(2.5) \\approx 0.50'}</InlineMath></li>
          <li><InlineMath>{'J_2(2.5) \\approx 0.45'}</InlineMath></li>
          <li><InlineMath>{'J_3(2.5) \\approx 0.22'}</InlineMath></li>
        </ul>
        <p>
          Σχετικές εντάσεις (πλάτη <InlineMath>{'A_c |J_n|'}</InlineMath>):
          το <InlineMath>{'\\pm 1'}</InlineMath> sideband είναι το ισχυρότερο,
          ακολουθεί <InlineMath>{'\\pm 2'}</InlineMath>, μετά{' '}
          <InlineMath>{'\\pm 3'}</InlineMath>. Carrier σχεδόν μηδέν.
        </p>
        <p>(Γ) Carson:</p>
        <BlockMath>{'B = 2(\\beta + 1) f_m = 2\\cdot 3.5\\cdot f_m = 7 f_m'}</BlockMath>
      </>
    ),
  },
  {
    id: 'sept25-th3-10',
    repeatGroup: 'thermal-noise-psd',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 3.10',
    weight: 10,
    title: 'PSD θερμικού θορύβου',
    topic: 'noise',
    difficulty: 'easy',
    prerequisites: ['noise/sources', 'noise/white-noise'],
    formulaIds: ['thermal-noise', 'white-noise-psd', 'bandlimited-noise-power'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Όλοι οι τύποι αυτής της άσκησης λείπουν από το επίσημο τυπολόγιο: η PSD
        του θερμικού θορύβου <InlineMath>{'S_N(f) = N_0/2 = kT/2'}</InlineMath>{' '}
        (βάρος <strong>5</strong> — ανώτατο στο Noise: εμφανίστηκε σε{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-9">Ιούν.2025 ΘΕΜΑ 1.9</Link>{' '}
        κ.ά.), η ισχύς σε ζώνη <InlineMath>{'P_N = kTB = N_0 B'}</InlineMath>{' '}
        (βάρος <strong>5</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>{' '}
        κ.ά.), ακόμα και το νούμερο{' '}
        <InlineMath>{'N_0 = kT_0 \\approx 4\\times 10^{-21}'}</InlineMath>{' '}
        W/Hz <InlineMath>{'= -174'}</InlineMath> dBm/Hz (αυτό να θυμάσαι
        απέξω). Το τυπολόγιο δεν περιέχει{' '}
        <em>κανέναν</em> τύπο θορύβου — όλη η ενότητα «Noise» είναι μνήμη. Άρα
        ούτε το τελικό <InlineMath>{'kTB'}</InlineMath> θα σου δοθεί· πρέπει να το
        ξέρεις απέξω ή να το φτάσεις μόνος σου από το επίπεδο πάτωμα.{' '}
        Ειδικά ο θερμικός τύπος (formulaId <code>thermal-noise</code>, βάρος{' '}
        <strong>2</strong> — ζητήθηκε σε ακριβώς 2 θέματα: εδώ και{' '}
        <Link href="/practice#exercise:jun25-th1-9">Ιούν.2025 ΘΕΜΑ 1.9</Link>){' '}
        είναι standard εξεταστικό pattern — «PSD θερμικού θορύβου» →{' '}
        κατευθείαν <InlineMath>{'kT/2'}</InlineMath>.
      </>
    ),
    statement: (
      <p>
        Ποια είναι η φασματική πυκνότητα ισχύος του θερμικού θορύβου και πώς
        εξαρτάται από το εύρος ζώνης και τη θερμοκρασία;
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Μέσα σε κάθε αντιστάτη τα ηλεκτρόνια «τρέμουν» από τη θερμότητα — όσο
            πιο ζεστός, τόσο πιο έντονα (slide 42). Αυτό το ατελείωτο, τυχαίο
            σπρώξιμο φορτίων παράγει μια μικρή τυχαία τάση στα άκρα του ακόμα κι
            όταν δεν περνά κανένα σήμα· είναι το «σσσσ» που ακούς σ' έναν
            ενισχυτή ή ένα ξεκούρδιστο ραδιόφωνο. Επειδή τα τινάγματα είναι
            αστραπιαία και ασυσχέτιστα μεταξύ τους, κουβαλούν <em>ίση</em> ισχύ
            σε <strong>όλες</strong> τις συχνότητες — όπως το λευκό φως που τα
            έχει όλα τα χρώματα μαζί. Γι' αυτό ο θερμικός θόρυβος λέγεται{' '}
            <strong>λευκός</strong>, και η πυκνότητα ισχύος του είναι ένα{' '}
            <strong>επίπεδο πάτωμα</strong> στο ύψος <InlineMath>{'kT/2'}</InlineMath>{' '}
            — δεν έχει σημασία <em>πού</em> στο φάσμα κοιτάς, το ύψος είναι παντού
            το ίδιο. Άρα η PSD <strong>δεν εξαρτάται από το εύρος ζώνης</strong>·
            εξαρτάται μόνο από τη θερμοκρασία (ζεστότερος → ψηλότερο πάτωμα).
            Αυτό που νιώθει τη ζώνη είναι το <em>πόσο</em> μαζεύεις: όσο πιο φαρδύ
            παράθυρο <InlineMath>B</InlineMath> ανοίγει ο δέκτης σου, τόσο
            μεγαλύτερη φέτα του πατώματος μπαίνει μέσα — γι' αυτό ένας δέκτης με
            φαρδιά ζώνη ακούει <em>περισσότερο</em> θόρυβο. Η συνολική ισχύς είναι
            απλώς το <strong>εμβαδόν</strong> = ύψος × πλάτος ζώνης ={' '}
            <InlineMath>{'kTB'}</InlineMath>.
          </span>
        </div>

        <figure className="my-4">
          <NoiseFilterShapingViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Διάλεξε «Ιδανικό LPF» και σύρε το slider του cutoff — το{' '}
            <InlineMath>B</InlineMath> του viz είναι ακριβώς το εύρος ζώνης{' '}
            <InlineMath>B</InlineMath> στο οποίο μετράς τον θόρυβο. Αριστερά
            βλέπεις το επίπεδο πάτωμα <InlineMath>{'S_N = N_0/2 = kT/2'}</InlineMath>{' '}
            (ίδιο ύψος παντού, ανεξάρτητο από το <InlineMath>B</InlineMath>), δεξιά
            τη σκιασμένη λωρίδα που «βλέπει» ο δέκτης. Πρόσεξε ότι η ένδειξη{' '}
            <InlineMath>{'P_Y'}</InlineMath> ανεβαίνει <strong>γραμμικά</strong>{' '}
            καθώς ανοίγεις το cutoff — αυτό ακριβώς λέει το{' '}
            <InlineMath>{'P_N = N_0 B = kTB'}</InlineMath>: διπλάσιο{' '}
            <InlineMath>B</InlineMath>, διπλάσια ισχύς. Το «μετράω θόρυβο σε ζώνη{' '}
            <InlineMath>B</InlineMath>» είναι το <em>ίδιο πράγμα</em> με το
            «περνάω τον λευκό θόρυβο μέσα από ιδανικό φίλτρο εύρους{' '}
            <InlineMath>B</InlineMath>» — ίδιο ολοκλήρωμα, ίδια εικόνα με τις
            ασκήσεις λευκού-θορύβου-μέσα-από-LPF (Πρόοδος 2026 ΘΕΜΑ 6, Σεπτ. 2025
            ΘΕΜΑ 3.11). Η αναλυτική απαγωγή ζει στο{' '}
            <Link
              href="/noise/through-filters"
              className="text-accent underline-offset-2 hover:underline"
            >
              /noise/through-filters §4–5
            </Link>
            .
          </figcaption>
        </figure>

        <p>
          <strong>Βήμα 1 — γιατί η PSD είναι επίπεδη στο{' '}
          <InlineMath>{'kT/2'}</InlineMath>.</strong> Ο θερμικός θόρυβος γεννιέται
          από τη θερμική διέγερση των ηλεκτρονίων μέσα στον αγωγό (slide 42):
          δισεκατομμύρια ανεξάρτητα, αστραπιαία τινάγματα φορτίου. Επειδή είναι
          ασυσχέτιστα και πολύ ταχύτερα από οποιαδήποτε συχνότητα μάς ενδιαφέρει,
          η ισχύς μοιράζεται ομοιόμορφα σε όλο το φάσμα — η PSD είναι επίπεδη
          («λευκή»), σταθερή στο ύψος <InlineMath>{'kT/2'}</InlineMath> (slide 45):
        </p>
        <BlockMath>{'S_N(f) = \\frac{N_0}{2} = \\frac{kT}{2}\\;\\text{W/Hz},\\qquad N_0 \\triangleq kT,\\quad |f| \\le 10^{12}\\,\\text{Hz}'}</BlockMath>
        <p>
          Από τη slide 47 και μετά απλώς βαφτίζουμε αυτό το ύψος{' '}
          <InlineMath>{'N_0/2'}</InlineMath>, με <InlineMath>{'N_0 \\triangleq kT'}</InlineMath>.
          Δύο πράγματα να κρατήσεις: (i) το ύψος εξαρτάται από τη θερμοκρασία{' '}
          <InlineMath>T</InlineMath>, αλλά (ii) <em>δεν</em> εξαρτάται ούτε από τη
          συχνότητα ούτε από το εύρος ζώνης — είναι το ίδιο παντού. Το «επίπεδο
          μέχρι <InlineMath>{'\\sim 10^{12}'}</InlineMath> Hz» (slide 45) καλύπτει
          κυριολεκτικά όλο το χρήσιμο φάσμα· πιο ψηλά η κβαντική φυσική κάμπτει το
          πάτωμα, αλλά καμία εξέταση K21 δεν πάει εκεί.
        </p>

        <p>
          <strong>Βήμα 2 — ισχύς σε ζώνη <InlineMath>B</InlineMath>: ολοκλήρωσε
          το πάτωμα.</strong> Η μόνη ποσότητα που νιώθει το εύρος ζώνης είναι η
          συνολική ισχύς — το εμβαδόν κάτω από το πάτωμα μέσα στη ζώνη. Ένας
          δέκτης εύρους <InlineMath>B</InlineMath> «βλέπει» τις συχνότητες από{' '}
          <InlineMath>{'-B'}</InlineMath> έως <InlineMath>{'+B'}</InlineMath>{' '}
          (πλάτος <InlineMath>{'2B'}</InlineMath> στη δίψας-όψεως εικόνα), οπότε
          (slide 45):
        </p>
        <BlockMath>{'P_N = \\int_{-B}^{B} S_N(f)\\,df = \\int_{-B}^{B} \\frac{N_0}{2}\\,df = \\frac{N_0}{2}\\cdot 2B = N_0 B = kTB'}</BlockMath>
        <p>
          Άμεσα ανάλογη <em>και</em> του <InlineMath>T</InlineMath> (μέσω{' '}
          <InlineMath>{'N_0 = kT'}</InlineMath>) <em>και</em> του{' '}
          <InlineMath>B</InlineMath>. Πρόσεξε <em>γιατί</em> βγαίνει{' '}
          <InlineMath>{'kTB'}</InlineMath> και όχι <InlineMath>{'kTB/2'}</InlineMath>{' '}
          — είναι ακριβώς το ίδιο κόλπο με τις ασκήσεις
          λευκού-θορύβου-μέσα-από-LPF (
          <Link
            href="/noise/through-filters"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/through-filters §5
          </Link>
          ): το ύψος είναι <InlineMath>{'N_0/2'}</InlineMath> (η δίψας-όψεως
          σύμβαση μοιράζει την ισχύ σε θετικές <em>και</em> αρνητικές συχνότητες),
          αλλά η ζώνη <InlineMath>{'[-B, B]'}</InlineMath> έχει πλάτος{' '}
          <InlineMath>{'2B'}</InlineMath>, όχι <InlineMath>B</InlineMath>. Το μισό
          του ύψους και το διπλάσιο του πλάτους{' '}
          <strong>αλληλοεξουδετερώνονται</strong> — το{' '}
          <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> εξαφανίζεται και μένει καθαρό{' '}
          <InlineMath>{'N_0 B = kTB'}</InlineMath>. Κράτα ένα ζευγάρι σταθερό:
          δίψας όψεως <InlineMath>{'N_0/2'}</InlineMath> με πλάτος{' '}
          <InlineMath>{'2B'}</InlineMath> (δες το radar εξέτασης για την παγίδα).
        </p>

        <p>
          <strong>Βήμα 3 — το νούμερο που πρέπει να κουβαλάς:{' '}
          <InlineMath>{'-174'}</InlineMath> dBm/Hz.</strong> Βάλε αριθμούς σε room
          temperature <InlineMath>{'T_0 = 290'}</InlineMath> K, με τη σταθερά
          Boltzmann <InlineMath>{'k = 1.38\\times 10^{-23}'}</InlineMath> J/K
          (slide 43):
        </p>
        <BlockMath>{'N_0 = kT_0 = (1.38\\times 10^{-23})(290) \\approx 4.0\\times 10^{-21}\\;\\text{W/Hz}'}</BlockMath>
        <p>
          Σε dBm/Hz (ισχύς σε dB σε σχέση με <InlineMath>{'1'}</InlineMath> mW, ανά
          Hz):
        </p>
        <BlockMath>{'N_0[\\text{dBm/Hz}] = 10\\log_{10}\\!\\left(\\frac{4\\times 10^{-21}}{10^{-3}}\\right) = 10\\log_{10}(4\\times 10^{-18}) \\approx -174\\;\\text{dBm/Hz}'}</BlockMath>
        <p>
          Από εκεί, η ισχύς θορύβου σε <em>οποιαδήποτε</em> ζώνη{' '}
          <InlineMath>B</InlineMath> βγαίνει με μια απλή πρόσθεση — η operational
          rule (
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §8
          </Link>
          {' '}+{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §9
          </Link>
          ):
        </p>
        <BlockMath>{'P_N[\\text{dBm}] = -174 + 10\\log_{10} B[\\text{Hz}]'}</BlockMath>
        <p>
          π.χ. κανάλι <InlineMath>{'B = 1'}</InlineMath> MHz →{' '}
          <InlineMath>{'-174 + 60 = -114'}</InlineMath> dBm.
        </p>

        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Το λεπτό σημείο — το <InlineMath>{'-174'}</InlineMath> είναι
          το <em>μονόπλευρο</em> <InlineMath>{'kT'}</InlineMath>.</strong> Το ίδιο
          πάτωμα έχει δύο «ονόματα»: δίψας όψεως{' '}
          <InlineMath>{'kT/2 = N_0/2 \\approx 2\\times 10^{-21}'}</InlineMath> W/Hz
          (το ύψος που ολοκληρώνεις σε <em>όλο</em> το{' '}
          <InlineMath>{'[-B, B]'}</InlineMath>) και μονόπλευρο{' '}
          <InlineMath>{'kT = N_0 \\approx 4\\times 10^{-21}'}</InlineMath> W/Hz
          (αυτό που θα διάβαζε ένα power meter ανά Hz, μόνο στις θετικές
          συχνότητες). Το <InlineMath>{'-174'}</InlineMath> dBm/Hz είναι το{' '}
          <strong>μονόπλευρο</strong> <InlineMath>{'N_0 = kT'}</InlineMath>. Αν
          κατά λάθος έβαζες το δίψας-όψεως{' '}
          <InlineMath>{'kT/2'}</InlineMath> στον τύπο dBm θα έβγαζες{' '}
          <InlineMath>{'-177'}</InlineMath> — λάθος κατά{' '}
          <InlineMath>{'3'}</InlineMath> dB (παράγοντας <InlineMath>{'2'}</InlineMath>).
          Και τα δύο ζευγάρια δίνουν την <em>ίδια</em> μετρήσιμη ισχύ{' '}
          <InlineMath>{'kTB'}</InlineMath> σε ζώνη <InlineMath>B</InlineMath>· απλώς
          μην ανακατεύεις τα ύψη με τα πλάτη.
        </div>

        <p>
          <strong>Με απλά λόγια:</strong> το πάτωμα του θερμικού θορύβου είναι ένα
          φυσικό κατώφλι που δεν ξεπερνιέται — υπάρχει σε κάθε αντιστάτη, σε κάθε
          δέκτη, ακόμα κι όταν δεν εκπέμπει κανείς. Δεν το χαμηλώνεις κάνοντας το
          κύκλωμα «καλύτερο»· το χαμηλώνεις μόνο (i) ψύχοντας (μικρότερο{' '}
          <InlineMath>T</InlineMath>) ή (ii) στενεύοντας τη ζώνη. Κάθε
          διπλασιασμός του <InlineMath>B</InlineMath> προσθέτει{' '}
          <InlineMath>{'+3'}</InlineMath> dB θορύβου — το «bandwidth tax» (
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §9
          </Link>
          ). Αυτό το ίδιο <InlineMath>{'kTB'}</InlineMath> θα το ξαναδείς ως τον{' '}
          <em>παρονομαστή</em> σε κάθε υπολογισμό{' '}
          <Link
            href="/noise/snr"
            className="text-accent underline-offset-2 hover:underline"
          >
            SNR
          </Link>
          : ο θόρυβος που μετράς ορίζει το πάτωμα κάτω από το οποίο χάνεται το
          σήμα.
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδια μηχανή (επίπεδο πάτωμα → εμβαδόν), αλλάζουν μόνο οι
            αριθμοί:
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Κρύος δέκτης (cooled LNA).</strong> Ψύξε από{' '}
              <InlineMath>{'290'}</InlineMath> K σε <InlineMath>{'29'}</InlineMath>{' '}
              K (<InlineMath>{'\\times 10'}</InlineMath> κάτω): το{' '}
              <InlineMath>{'N_0 = kT'}</InlineMath> πέφτει{' '}
              <InlineMath>{'\\times 10'}</InlineMath>, άρα το πάτωμα πέφτει κατά{' '}
              <InlineMath>{'-10'}</InlineMath> dB → <InlineMath>{'-184'}</InlineMath>{' '}
              dBm/Hz. Γι' αυτό οι δέκτες ραδιοαστρονομίας και deep-space ψύχονται
              κρυογονικά: λιγότερο <InlineMath>T</InlineMath>, λιγότερος θόρυβος,
              πιο αδύναμα σήματα γίνονται ανιχνεύσιμα. (Δοκίμασε{' '}
              <InlineMath>{'T = 77'}</InlineMath> K, υγρό άζωτο — πόσα dB κερδίζεις
              από τους <InlineMath>{'290'}</InlineMath> K;)
            </li>
            <li>
              <strong>Μονόπλευρη σύμβαση.</strong> Ξαναγράψε με μονόπλευρο{' '}
              <InlineMath>{'N_0 = kT'}</InlineMath> για{' '}
              <InlineMath>{'f \\ge 0'}</InlineMath> (ύψος{' '}
              <InlineMath>{'N_0'}</InlineMath>, πλάτος <InlineMath>B</InlineMath>):{' '}
              <InlineMath>{'\\int_0^B N_0\\,df = N_0 B = kTB'}</InlineMath> — ίδιο
              αποτέλεσμα. Όποια σύμβαση κι αν διαλέξεις, κράτησέ τη σταθερή σε όλη
              την άσκηση (δες <Link
                href="/noise/white-noise"
                className="text-accent underline-offset-2 hover:underline"
              >
                /noise/white-noise §10
              </Link>).
            </li>
            <li>
              <strong>Συγκεκριμένος noise floor.</strong> Εμπορικό FM κανάλι{' '}
              <InlineMath>{'B = 200'}</InlineMath> kHz σε room temp:{' '}
              <InlineMath>{'-174 + 10\\log_{10}(2\\times 10^{5}) = -174 + 53 = -121'}</InlineMath>{' '}
              dBm. Κανάλι 4G/LTE <InlineMath>{'B = 20'}</InlineMath> MHz:{' '}
              <InlineMath>{'-174 + 73 = -101'}</InlineMath> dBm. Πιο φαρδύ κανάλι →
              ψηλότερο πάτωμα θορύβου, ακριβώς το bandwidth tax.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'sept25-th3-11',
    repeatGroup: 'white-noise-lpf',
    origin: 'past-exam',
    source: 'sept-2025',
    problemNumber: 'ΘΕΜΑ 3.11',
    weight: 10,
    title: 'Λευκός θόρυβος μέσα από LPF',
    topic: 'noise',
    difficulty: 'easy',
    prerequisites: ['noise/white-noise', 'noise/through-filters', 'foundations/filters'],
    formulaIds: ['white-noise-psd', 'lti-output-psd', 'bandlimited-noise-power', 'wiener-khinchin'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Και οι δύο τύποι που χρειάζεται η άσκηση λείπουν από το επίσημο
        τυπολόγιο: η PSD λευκού θορύβου{' '}
        <InlineMath>{'S_X(f) = N_0/2'}</InlineMath>{' '}
        (βάρος <strong>5</strong> — ανώτατο στο Noise: εμφανίστηκε σε{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-9">Ιούν.2025 ΘΕΜΑ 1.9</Link>{' '}
        κ.ά.) και ο νόμος εξόδου LTI{' '}
        <InlineMath>{'S_Y(f) = |H(f)|^2 S_X(f)'}</InlineMath>{' '}
        (βάρος <strong>3</strong>:{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>{' '}
        κ.ά.). Το τυπολόγιο δεν
        περιέχει <em>κανέναν</em> τύπο θορύβου — άρα ούτε το τελικό{' '}
        <InlineMath>{'P_Y = N_0 B'}</InlineMath>{' '}
        (βάρος <strong>5</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-10">Σεπτ.2025 ΘΕΜΑ 3.10</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>{' '}
        κ.ά.) θα σου δοθεί· πρέπει να το φτάσεις μόνος σου ή να το ξέρεις
        απέξω.{' '}
        Τέλος, ο υπολογισμός{' '}
        <InlineMath>{'P_Y = \\int S_Y(f)\\,df = R_Y(0)'}</InlineMath>{' '}
        είναι εφαρμογή του θεωρήματος Wiener-Khinchin (power corollary — εκτός τυπολογίου, βάρος{' '}
        <strong>3</strong>:{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:jun25-th1-10">Ιούν.2025 ΘΕΜΑ 1.10</Link>
        κ.ά.).
      </>
    ),
    statement: (
      <p>
        Έστω λευκός θόρυβος με φασματική πυκνότητα{' '}
        <InlineMath>{'N_0/2'}</InlineMath>. Διέρχεται μέσα από ιδανικό
        χαμηλοπερατό φίλτρο εύρους ζώνης B. Υπολογίστε την ισχύ θορύβου στην
        έξοδο.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Φαντάσου την ισχύ του λευκού θορύβου απλωμένη σε <em>όλες</em> τις
            συχνότητες με σταθερό ύψος <InlineMath>{'N_0/2'}</InlineMath> — ένα
            ατελείωτο, επίπεδο πάτωμα από <InlineMath>{'-\\infty'}</InlineMath>{' '}
            έως <InlineMath>{'+\\infty'}</InlineMath>. Συνολική ισχύς;{' '}
            <strong>άπειρη</strong>, αφού σταθερό ύψος επί άπειρο πλάτος δίνει
            άπειρο εμβαδόν. Το ιδανικό LPF δουλεύει σαν ψαλίδι: κρατάει μόνο τη{' '}
            <strong>φέτα</strong> <InlineMath>{'|f| < B'}</InlineMath> και πετάει
            όλη την υπόλοιπη ουρά. Ό,τι μένει είναι ένα ορθογώνιο — ύψος{' '}
            <InlineMath>{'N_0/2'}</InlineMath>, πλάτος <InlineMath>{'2B'}</InlineMath>{' '}
            (από <InlineMath>{'-B'}</InlineMath> έως <InlineMath>{'+B'}</InlineMath>)
            — και η ισχύς εξόδου είναι απλώς το <strong>εμβαδόν</strong> του.
          </span>
        </div>

        <figure className="my-4">
          <NoiseFilterShapingViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Διάλεξε «Ιδανικό LPF» και σύρε το slider του cutoff — το{' '}
            <InlineMath>B</InlineMath> του viz είναι ακριβώς το{' '}
            <InlineMath>B</InlineMath> της άσκησης. Αριστερά βλέπεις το επίπεδο{' '}
            <InlineMath>{'S_X = N_0/2'}</InlineMath>, στη μέση τη μάσκα{' '}
            <InlineMath>{'|H|^2'}</InlineMath> του ιδανικού φίλτρου, δεξιά τη
            σκιασμένη λωρίδα εξόδου. Πρόσεξε ότι η ένδειξη{' '}
            <InlineMath>{'P_Y'}</InlineMath> ανεβαίνει <strong>γραμμικά</strong>{' '}
            καθώς ανοίγεις το cutoff — αυτό ακριβώς λέει το{' '}
            <InlineMath>{'P_Y = N_0 B'}</InlineMath>: διπλάσιο{' '}
            <InlineMath>B</InlineMath>, διπλάσια ισχύς. Η αναλυτική απαγωγή ζει
            στο{' '}
            <Link
              href="/noise/through-filters"
              className="text-accent underline-offset-2 hover:underline"
            >
              /noise/through-filters §4–5
            </Link>
            .
          </figcaption>
        </figure>

        <p>
          <strong>Βήμα 1 — ο νόμος του θορύβου μέσα από LTI.</strong> Όταν μια
          WSS τυχαία διεργασία περνά από γραμμικό, χρονικά αμετάβλητο φίλτρο{' '}
          <InlineMath>{'H(f)'}</InlineMath>, η PSD εξόδου είναι η PSD εισόδου
          πολλαπλασιασμένη με <InlineMath>{'|H(f)|^2'}</InlineMath> (slides
          38–40):
        </p>
        <BlockMath>{'S_Y(f) = |H(f)|^2\\, S_X(f)'}</BlockMath>
        <p>
          <strong>Βήμα 2 — βάλε μέσα το ιδανικό LPF.</strong> Για το ιδανικό
          χαμηλοπερατό ισχύει <InlineMath>{'|H(f)|^2 = 1'}</InlineMath> μέσα στη
          ζώνη <InlineMath>{'|f| < B'}</InlineMath> και <InlineMath>0</InlineMath>{' '}
          έξω, ενώ η είσοδος είναι το επίπεδο{' '}
          <InlineMath>{'S_X(f) = N_0/2'}</InlineMath> (slide 47). Άρα η έξοδος
          είναι το ίδιο πάτωμα, αποκομμένο στο{' '}
          <InlineMath>{'[-B, B]'}</InlineMath>:
        </p>
        <BlockMath>{'S_Y(f) = \\begin{cases} N_0/2, & |f| < B \\\\ 0, & |f| > B \\end{cases}'}</BlockMath>
        <p>
          <strong>Βήμα 3 — ολοκλήρωσε για την ισχύ.</strong> Η συνολική ισχύς
          είναι το εμβαδόν κάτω από την <InlineMath>{'S_Y'}</InlineMath> — δηλαδή
          το εμβαδόν της λωρίδας:
        </p>
        <BlockMath>{'P_Y = \\int_{-\\infty}^{\\infty} S_Y(f)\\,df = \\int_{-B}^{B} \\frac{N_0}{2}\\,df = \\frac{N_0}{2}\\cdot 2B = N_0 B'}</BlockMath>
        <p>
          Πρόσεξε <em>γιατί</em> βγαίνει <InlineMath>{'N_0 B'}</InlineMath> και
          όχι <InlineMath>{'N_0 B/2'}</InlineMath>: το ύψος είναι{' '}
          <InlineMath>{'N_0/2'}</InlineMath> (η σύμβαση δίψας όψεως — two-sided —
          μοιράζει την ισχύ σε θετικές <em>και</em> αρνητικές συχνότητες), αλλά η
          ζώνη <InlineMath>{'[-B, B]'}</InlineMath> έχει πλάτος{' '}
          <InlineMath>{'2B'}</InlineMath>, όχι <InlineMath>B</InlineMath>. Το
          μισό του ύψους και το διπλάσιο του πλάτους{' '}
          <strong>αλληλοεξουδετερώνονται</strong>· γι' αυτό το{' '}
          <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> εξαφανίζεται και μένει
          καθαρό <InlineMath>{'N_0 B'}</InlineMath>. Είναι η νούμερο-ένα πηγή
          λάθους εδώ (δες το radar εξέτασης).
        </p>

        <p>
          <strong>Με απλά λόγια:</strong> το ιδανικό LPF παίρνει τον λευκό
          θόρυβο (άπειρης ισχύος, αφού το πάτωμα δεν τελειώνει ποτέ) και τον
          κάνει <strong>bandlimited</strong> με πεπερασμένη ισχύ{' '}
          <InlineMath>{'N_0 B'}</InlineMath>. Η «άπειρη» ισχύς ζούσε στην
          ατέρμονη ουρά του φάσματος· ένας πραγματικός δέκτης, με το πεπερασμένο
          bandwidth του, ποτέ δεν τη βλέπει — βλέπει μόνο τη φέτα{' '}
          <InlineMath>{'N_0 B'}</InlineMath>. Αυτό το ίδιο νούμερο ξαναγυρίζει ως
          ο <em>παρονομαστής</em> (η ισχύς θορύβου) σε κάθε υπολογισμό{' '}
          <Link
            href="/noise/snr"
            className="text-accent underline-offset-2 hover:underline"
          >
            SNR
          </Link>
          .
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδια συνταγή (<InlineMath>{'S_Y = |H|^2 S_X'}</InlineMath> και
            μετά ολοκλήρωση), αλλάζει μόνο το <InlineMath>{'|H|^2'}</InlineMath>.
            Άλλαξε φίλτρο στο viz παραπάνω και επιβεβαίωσε:
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Ιδανικό BPF</strong> με λωρίδα εύρους{' '}
              <InlineMath>B</InlineMath> γύρω από κάθε{' '}
              <InlineMath>{'\\pm f_c'}</InlineMath>: τώρα περνάνε <em>δύο</em>{' '}
              rects (μία στις θετικές, μία στις αρνητικές συχνότητες), συνολικού
              πλάτους <InlineMath>{'2B'}</InlineMath> — ίδιο με το LPF, άρα πάλι{' '}
              <InlineMath>{'P_Y = N_0 B'}</InlineMath>. Το <em>πού</em> κάθεται η
              ζώνη δεν αλλάζει την ισχύ· μόνο το <em>πόσο</em> συνολικό πλάτος
              περνάει μετράει.
            </li>
            <li>
              <strong>Μη ιδανικό RC LPF</strong> πρώτης τάξης (όχι rect, αλλά{' '}
              <InlineMath>{'|H|^2 = 1/(1+(f/f_c)^2)'}</InlineMath>): το
              ολοκλήρωμα γίνεται Lorentzian και δίνει{' '}
              <InlineMath>{'P_Y = \\pi N_0 f_c/2'}</InlineMath> — μεγαλύτερο κατά{' '}
              <InlineMath>{'\\pi/2'}</InlineMath> από ιδανικό LPF ίδιου cutoff,
              γιατί το RC αφήνει να περάσει και λίγη ουρά πάνω από το{' '}
              <InlineMath>{'f_c'}</InlineMath> (πλήρης απαγωγή στο{' '}
              <Link
                href="/noise/through-filters"
                className="text-accent underline-offset-2 hover:underline"
              >
                /noise/through-filters §6
              </Link>
              ).
            </li>
            <li>
              <strong>Κι αν η είσοδος δεν είναι λευκή;</strong> Αν το{' '}
              <InlineMath>{'S_X(f)'}</InlineMath> δεν είναι επίπεδο, δεν βγαίνει
              σταθερά έξω από το ολοκλήρωμα — πρέπει να υπολογίσεις πραγματικά το{' '}
              <InlineMath>{'\\int_{-B}^{B} S_X(f)\\,df'}</InlineMath>. Το κόλπο
              «ύψος × πλάτος» δούλεψε <em>μόνο</em> χάρη στο επίπεδο πάτωμα του
              λευκού θορύβου.
            </li>
          </ul>
        </div>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ΕΞΕΤΑΣΗ ΕΠΙ ΠΤΥΧΙΩ ΙΑΝΟΥΑΡΙΟΥ 2026 (16 problems · 100%)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'jan26-th1-1',
    repeatGroup: 'tf-am-form',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 1.1',
    weight: 3,
    title: 'Σ/Λ — μορφή AM σήματος',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional', 'am/dsb-sc'],
    formulaIds: ['am-signal', 'dsb-sc-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος AM{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και ο τύπος
        DSB-SC{' '}
        <InlineMath>{'x_{DSB}(t) = A_c\\,m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (σε <strong>5</strong> — εδώ εμφανίζεται ως η «λάθος» μορφή στην εκφώνηση). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.8
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Το συμβατικά διαμορφωμένο κατά AM σήμα <InlineMath>x(t)</InlineMath>{' '}
        του σήματος βασικής ζώνης{' '}
        <InlineMath>{'m(t) = \\cos(2\\pi t)'}</InlineMath> έχει τη μορφή{' '}
        <InlineMath>{'x(t) = [A_c\\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Αυτή η μορφή είναι <em>DSB-SC</em>{' '}
          (διπλής πλευρικής με καταστολή φέροντος). Η συμβατική AM είναι:
        </p>
        <BlockMath>{'x(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = [A_c + \\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</BlockMath>
        <p>
          Ο carrier <InlineMath>{'A_c'}</InlineMath> προστίθεται στο message
          (όχι πολλαπλασιάζεται μαζί του).
        </p>
      </>
    ),
  },
  {
    id: 'jan26-th1-2',
    repeatGroup: 'tf-cos-power',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 1.2',
    weight: 3,
    title: 'Σ/Λ — cos είναι σήμα ισχύος',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/signals'],
    formulaIds: ['cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> για κάθε cosine/sine
        πλάτους <InlineMath>{'A'}</InlineMath> — εδώ <InlineMath>{'A=1'}</InlineMath>,
        άρα <InlineMath>{'P = 1/2'}</InlineMath>. Εμφανίστηκε σε{' '}
        <strong>6</strong> παλιά θέματα (3 εξεταστικές — Σ/Λ «ισχύς vs ενέργεια» και υπολογισμοί ισχύος αθροισμάτων). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Το σήμα <InlineMath>{'m(t) = \\cos(2\\pi t)'}</InlineMath> είναι
        σήμα ισχύος.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΣΩΣΤΟ.</strong> Έχει άπειρη ενέργεια{' '}
          (<InlineMath>{'\\int |m|^2 dt = \\infty'}</InlineMath>) αλλά
          πεπερασμένη μέση ισχύ:
        </p>
        <BlockMath>{'P = \\lim_{T\\to\\infty}\\frac{1}{2T}\\int_{-T}^{T} \\cos^2(2\\pi t)\\,dt = \\frac{1}{2}'}</BlockMath>
        <p>Άρα σήμα ισχύος. Κάθε μη-μηδενικό περιοδικό είναι σήμα ισχύος.</p>
      </>
    ),
  },
  {
    id: 'jan26-th1-3',
    repeatGroup: 'tf-white-noise-gaussian',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 1.3',
    weight: 4,
    title: 'Σ/Λ — λευκός θόρυβος ⇔ Gaussian',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/white-noise'],
    statement: (
      <p>
        Σ/Λ: Ο λευκός θόρυβος είναι ο θόρυβος του οποίου η φασματική πυκνότητα
        ισχύος ακολουθεί την κατανομή Gauss.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — ένας θόρυβος έχει δύο ανεξάρτητα «αποτυπώματα».
          </strong>{' '}
          <span className="text-fg-muted">
            (1) <strong>Πού</strong> κάθεται η ισχύς του στις συχνότητες — το
            σχήμα της PSD. «<strong>Λευκός</strong>» απαντά εδώ: η ισχύς
            απλώνεται <em>ίσα</em> σε όλες τις συχνότητες, όπως το λευκό φως
            κουβαλά ίσα όλα τα χρώματα, οπότε η PSD είναι ένα{' '}
            <strong>επίπεδο πάτωμα</strong> (
            <Link
              href="/noise/white-noise"
              className="text-accent underline-offset-2 hover:underline"
            >
              /noise/white-noise §2
            </Link>
            ). (2) <strong>Πώς</strong> κατανέμονται οι <em>τιμές</em> του στο
            χρόνο — αν κατέγραφες την τάση του θορύβου για ώρα κι έφτιαχνες{' '}
            <strong>ιστόγραμμα</strong> των τιμών, τι σχήμα θα έβγαινε;{' '}
            «<strong>Gaussian</strong>» απαντά εδώ: καμπάνα.{' '}
            <strong className="text-fg">Το κρίσιμο:</strong> δύο ηχογραφήσεις
            «σσσσ» μπορεί να έχουν <em>πανομοιότυπη</em> επίπεδη PSD (ίδιο
            «χρώμα» θορύβου) κι όμως τελείως διαφορετικό ιστόγραμμα πλάτους — η
            μία καμπάνα (Gaussian), η άλλη επίπεδο κουτί (uniform). Η PSD δεν
            «βλέπει» τη διαφορά: ξέρει μόνο πού κάθεται η ισχύς στις συχνότητες,
            όχι πώς μοιράζονται οι τιμές. Άρα «λευκός» και «Gaussian» μετρούν δύο
            εντελώς διαφορετικά πράγματα — το ένα δεν συνεπάγεται το άλλο.
          </span>
        </div>

        <p>
          <strong>ΛΑΘΟΣ — η κλασική παγίδα της Noise group.</strong> Η εκφώνηση
          βάζει την PSD να «ακολουθεί την κατανομή Gauss», και κάνει{' '}
          <strong>διπλό</strong> λάθος. <em>(i) Σύγχυση αξόνων:</em> «λευκός»
          περιγράφει το <strong>σχήμα της PSD</strong> (frequency domain), ενώ
          «Gaussian» περιγράφει την <strong>κατανομή πλάτους</strong> (amplitude
          domain) — δύο <strong>ορθογώνιες</strong> ιδιότητες, η μία δεν
          συνεπάγεται την άλλη. <em>(ii) Κατηγορηματικό λάθος:</em> η PSD δεν
          είναι καν κατανομή πιθανότητας — είναι <strong>ισχύς ανά Hz</strong>{' '}
          πάνω στη συχνότητα (
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §6
          </Link>
          ), και για λευκό θόρυβο το σχήμα της είναι <strong>επίπεδο</strong>{' '}
          (<InlineMath>{'S_N(f) = N_0/2'}</InlineMath>, σταθερό σε κάθε{' '}
          <InlineMath>{'f'}</InlineMath>) — το ακριβώς αντίθετο μιας καμπάνας. Η
          καμπάνα Gauss ζει σε <em>άλλο</em> γράφημα: το ιστόγραμμα των τιμών
          του θορύβου, όχι η PSD.
        </p>

        <p>
          Οι δύο άξονες είναι ανεξάρτητοι — και οι <strong>τέσσερις</strong>{' '}
          συνδυασμοί υπάρχουν στ' αλήθεια:
        </p>

        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-3 text-left font-normal text-fg-subtle">
                PSD ↓ · Πλάτος →
              </th>
              <th className="py-2 pr-3 text-left">Gaussian (καμπάνα)</th>
              <th className="py-2 text-left">μη-Gaussian</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr>
              <th
                scope="row"
                className="py-2 pr-3 text-left align-top font-semibold text-fg"
              >
                Λευκός
                <br />
                (επίπεδη PSD)
              </th>
              <td className="py-2 pr-3 align-top">
                <strong className="text-fg">AWGN</strong> — ο θερμικός θόρυβος·
                το μοντέλο <em>κάθε</em> άσκησης θορύβου.
              </td>
              <td className="py-2 align-top">
                <strong className="text-fg">Uniform-λευκός</strong> —
                ασυσχέτιστες τιμές <InlineMath>{'U[-1,+1]'}</InlineMath>:
                επίπεδη PSD ✓, καμπάνα ✗.
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="py-2 pr-3 text-left align-top font-semibold text-fg"
              >
                Έγχρωμος
                <br />
                (μη-επίπεδη PSD)
              </th>
              <td className="py-2 pr-3 align-top">
                <strong className="text-fg">Colored Gaussian</strong> — AWGN
                μέσα από LPF: η καμπάνα μένει, η PSD γίνεται Lorentzian.
              </td>
              <td className="py-2 align-top">
                <strong className="text-fg">
                  Φιλτραρισμένο <InlineMath>{'\\pm 1'}</InlineMath>
                </strong>{' '}
                — ούτε επίπεδη PSD ούτε καμπάνα.
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          Η εκφώνηση δείχνει το πάνω-αριστερά κελί (AWGN) και το βαφτίζει{' '}
          <em>ορισμό</em> του «λευκού» — αγνοώντας ότι υπάρχει λευκός θόρυβος{' '}
          <em>χωρίς</em> καμπάνα (πάνω-δεξιά). <strong>Και το ανάποδο
          εξετάζεται:</strong> «κάθε Gaussian θόρυβος είναι λευκός» είναι{' '}
          <em>επίσης</em> ΛΑΘΟΣ — φιλτράρισε AWGN κι έχεις{' '}
          <strong>colored Gaussian</strong> (κάτω-αριστερά): η καμπάνα μένει (το
          γραμμικό φίλτρο διατηρεί τη Gaussianity), η επίπεδη PSD χάνεται.
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Δοκίμασέ το — ρώτησε τον εαυτό σου</strong>
          <span className="text-fg-muted">
            {' '}(κάθε ερώτηση είναι μια θέση στο πλέγμα 2×2):
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Είναι ο θερμικός θόρυβος λευκός ΚΑΙ Gaussian;</strong>{' '}
              Ναι, και τα δύο — γι' αυτό λέγεται AWGN (πάνω-αριστερά). Το
              «Gaussian» έρχεται «δωρεάν» από το CLT, το «λευκό» από το επίπεδο
              φάσμα.
            </li>
            <li>
              <strong>Είναι ένα Gaussian σήμα πάντα λευκό;</strong> Όχι —
              φιλτράρισέ το (π.χ. RC LPF) και γίνεται colored Gaussian: καμπάνα
              ναι, επίπεδη PSD όχι. (Το ανάποδο της παγίδας.)
            </li>
            <li>
              <strong>
                «Ο θερμικός θόρυβος έχει PSD που ακολουθεί κατανομή Gauss»
              </strong>{' '}
              (η διατύπωση της Προόδου Β 2025). Ίδια παγίδα, ίδιο ΛΑΘΟΣ: ο
              θερμικός <em>είναι</em> AWGN, αλλά το «Gaussian» αφορά τα πλάτη του
              — η PSD του είναι επίπεδη, όχι καμπάνα.
            </li>
            <li>
              <strong>Ονόμασε μια διαδικασία λευκή-αλλά-όχι-Gaussian.</strong>{' '}
              Uniform-amplitude white: ασυσχέτιστες τιμές{' '}
              <InlineMath>{'U[-1,+1]'}</InlineMath> — επίπεδη PSD (λευκός), αλλά
              ιστόγραμμα κουτί (όχι καμπάνα).
            </li>
          </ul>
        </div>

        <p className="text-sm text-fg-muted">
          Ο πλήρης πίνακας 2×2 με τα αντιπαραδείγματα ζει στο{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §6
          </Link>
          · η φυσική «γιατί ο θερμικός είναι Gaussian» (CLT) στο{' '}
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §2
          </Link>
          , και το «colored Gaussian μετά από LPF» στο{' '}
          <Link
            href="/noise/through-filters"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/through-filters §6
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'jan26-th1-4',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 1.4',
    weight: 5,
    title: 'Σ/Λ — Envelope FS τετραγωνικού παλμού',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-series-rect-pulse'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος FS συντελεστών περιοδικού παλμού{' '}
        <InlineMath>{'a_k = (A\\tau/T_0)\\,\\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>{' '}
        (fourier-series-rect-pulse, βάρος <strong>4</strong>). Το ζεύγος FT{' '}
        <InlineMath>{'\\Pi(t/\\tau) \\leftrightarrow \\tau\\,\\mathrm{sinc}(f\\tau)'}</InlineMath>{' '}
        δίνεται στο τυπολόγιο — αλλά αυτοί οι FS συντελεστές ΔΕΝ δίνονται.
        Εμφανίστηκε σε <strong>4</strong> παλιά θέματα. Βλ.{' '}
        <Link
          href="/practice#exercise:jun25-th1-5"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.5
        </Link>,{' '}
        <Link
          href="/practice#exercise:jun25-th1-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.6
        </Link>,{' '}
        <Link
          href="/practice#exercise:jun25-th1-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.8
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Η περιβάλλουσα του φάσματος πλάτους του Μ/Σ Fourier ενός
        περιοδικού τετραγωνικού παλμού με πλάτος T=1sec έχει στενότερο εύρος
        από έναν περιοδικό τετραγωνικό παλμό με πλάτος T=0.1sec.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Η περιβάλλουσα είναι <strong>sinc</strong>{' '}
          με πρώτη ρίζα στο <InlineMath>{'1/\\tau'}</InlineMath>, όπου{' '}
          <InlineMath>{'\\tau'}</InlineMath> είναι το πλάτος του παλμού.
        </p>
        <p>
          Παλμός πλάτους <InlineMath>{'\\tau = 1'}</InlineMath>s →
          sinc(f·1), πρώτη ρίζα στο 1 Hz. Παλμός πλάτους{' '}
          <InlineMath>{'\\tau = 0.1'}</InlineMath>s → sinc(f·0.1), πρώτη
          ρίζα στα 10 Hz. Άρα <strong>στενότερος παλμός = πλατύτερο
          φάσμα</strong> (αντίστροφη σχέση χρόνος ↔ συχνότητα).
        </p>
      </>
    ),
  },
  {
    id: 'jan26-th1-5',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 1.5',
    weight: 5,
    title: 'Σ/Λ — β=0.3 είναι WBFM',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea', 'fm/pm', 'fm/carson'],
    formulaIds: ['fm-beta', 'carson'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνονται στο τυπολόγιο.</strong>{' '}
        Το κριτήριο NBFM/WBFM πηγάζει από τον ορισμό{' '}
        <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath> (βάρος 6) και τον
        κανόνα Carson <InlineMath>{'B = 2(\\beta+1)W'}</InlineMath> (βάρος 6):
        στο όριο <InlineMath>{'\\beta \\to 0'}</InlineMath> το Carson δίνει{' '}
        <InlineMath>{'B \\to 2W'}</InlineMath> (ίδιο με AM), επομένως{' '}
        <InlineMath>{'\\beta = 0.3 < 1'}</InlineMath> → NBFM, όχι WBFM. Και οι
        δύο τύποι λείπουν από το τυπολόγιο — τους γράφεις απέξω.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Δίνεται FM σήμα με δείκτη διαμόρφωσης β=0.3. Το σήμα είναι WBFM.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Με <InlineMath>{'\\beta = 0.3'}</InlineMath>{' '}
          (<InlineMath>{'\\beta < 1'}</InlineMath>, μάλιστα{' '}
          <InlineMath>{'\\ll 1'}</InlineMath>) έχουμε <strong>NBFM</strong>{' '}
          (Narrowband FM). WBFM απαιτεί <InlineMath>{'\\beta \\gg 1'}</InlineMath>.
          Στο NBFM ισχύει η γραμμικοποίηση{' '}
          <InlineMath>{'\\cos\\phi \\approx 1, \\sin\\phi \\approx \\phi'}</InlineMath>{' '}
          και το bandwidth γίνεται 2W (όπως AM).
        </p>
      </>
    ),
  },
  {
    id: 'jan26-th2-6',
    repeatGroup: 'why-modulate',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 2.6',
    weight: 4,
    title: 'Λόγοι διαμόρφωσης',
    topic: 'modulation',
    difficulty: 'easy',
    prerequisites: ['am/overview'],
    statement: (
      <p>
        Αναφέρετε τους βασικούς λόγους για τους οποίους επιτελούμε
        διαμόρφωση στα προς μετάδοση τηλεπικοινωνιακά συστήματα.
      </p>
    ),
    solution: (
      <ol className="ml-5 list-decimal space-y-1 text-fg-muted">
        <li>
          <strong>Αντενα μέγεθος</strong>: για αποδοτική εκπομπή χρειάζεται
          <InlineMath>{'\\lambda/4 = c/(4f)'}</InlineMath> — σε baseband
          (kHz) θα ήταν km. Στα MHz/GHz μετράται σε εκατοστά.
        </li>
        <li>
          <strong>Multiplexing</strong>: πολλά κανάλια μοιράζονται το ίδιο
          μέσο, τοποθετώντας κάθε ένα σε διαφορετική συχνότητα (FDM).
        </li>
        <li>
          <strong>Αποδοτική χρήση φάσματος</strong>: επιλέγουμε ζώνες με
          λιγότερο θόρυβο, λιγότερη απόσβεση.
        </li>
        <li>
          <strong>Ανοσία θορύβου</strong>: συγκεκριμένες διαμορφώσεις (FM)
          είναι πιο ανθεκτικές.
        </li>
        <li>
          <strong>Νομοθετικά πλαίσια</strong>: συχνές περιοχές
          εκχωρημένες σε συγκεκριμένες χρήσεις.
        </li>
      </ol>
    ),
  },
  {
    id: 'jan26-th2-7',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 2.7',
    weight: 4,
    title: 'AM σχεδίαση χρόνου + φάσματος',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal', 'am-spectrum', 'fourier-pair-sin', 'am-mu'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα), το φάσμα AM{' '}
        <InlineMath>{'X_{AM}(f) = \\tfrac{A_c}{2}[\\delta(f-f_c)+\\delta(f+f_c)] + \\tfrac{1}{2}[M(f-f_c)+M(f+f_c)]'}</InlineMath>{' '}
        (σε <strong>4</strong>) και ο δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>{' '}
        (σε <strong>8</strong>). Το ζεύγος Fourier (
        <InlineMath>{'\\sin'}</InlineMath>) βρίσκεται στο τυπολόγιο — δεν χρειάζεται να το θυμάσαι. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 9
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Να σχεδιαστεί το διαμορφωμένο κατά AM σήμα στο χρόνο και στο φάσμα
        όταν το φέρον είναι{' '}
        <InlineMath>{'c(t) = \\cos(20\\pi t)'}</InlineMath> και το σήμα
        πληροφορίας είναι{' '}
        <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Το AM σήμα είναι ένα φέρον του οποίου το «ύψος» — η{' '}
            <strong>περιβάλλουσα</strong> — ακολουθεί το{' '}
            <InlineMath>{'A_c + m(t)'}</InlineMath>: η σταθερά{' '}
            <InlineMath>{'A_c'}</InlineMath> είναι μια «βάση» και πάνω της κάθεται η
            ταλάντωση του message. Ένα μόνο νούμερο αποφασίζει το <em>σχήμα</em> και των
            δύο σχεδίων — ο δείκτης <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>, που συγκρίνει{' '}
            <em>πόσο βαθιά ρίχνει</em> το message (<InlineMath>{'A_m'}</InlineMath>) με τη
            βάση (<InlineMath>{'A_c'}</InlineMath>). Αν το message ρίχνει πιο βαθιά από όσο
            σηκώνει η βάση (<InlineMath>{'\\mu > 1'}</InlineMath>), η περιβάλλουσα{' '}
            <strong>περνά κάτω από το μηδέν</strong>. Μια πραγματική περιβάλλουσα (ένα ύψος)
            όμως δεν γίνεται αρνητική· αυτό που πραγματικά συμβαίνει μαθηματικά είναι ότι το{' '}
            <InlineMath>{'\\cos'}</InlineMath> πολλαπλασιάζεται επί αρνητικό αριθμό — δηλαδή
            ο carrier <strong>αναστρέφει τη φάση του κατά{' '}
            <InlineMath>{'180^\\circ'}</InlineMath></strong> (δεν «κόβεται»/clipping —
            γυρίζει ανάποδα). Εδώ <InlineMath>{'\\mu = 2'}</InlineMath>, άρα περιμένουμε{' '}
            <em>phase reversals</em> στον χρόνο και έναν envelope detector που{' '}
            <strong>αποτυγχάνει</strong>. Για το δεύτερο σχέδιο κράτα ότι το message είναι{' '}
            <em>ένας τόνος</em>: το φάσμα μένει <strong>carrier + ΕΝΑ ζεύγος πλευρικών (μία
            USB + μία LSB)</strong> ό,τι κι αν είναι το{' '}
            <InlineMath>{'\\mu'}</InlineMath> — η υπερδιαμόρφωση φαίνεται στον{' '}
            <em>χρόνο</em>, ποτέ ως επιπλέον φασματικές γραμμές. (Το «γιατί» ζει στο{' '}
            <Link
              href="/am/conventional"
              className="text-accent underline-offset-2 hover:underline"
            >
              /am/conventional §3 Υπερδιαμόρφωση
            </Link>
            .)
          </span>
        </div>

        <p>
          Διαβάζουμε τις παραμέτρους από τα δεδομένα. Φέρον{' '}
          <InlineMath>{'c(t) = \\cos(20\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_c = 1'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_c = 20\\pi \\Rightarrow f_c = 10'}</InlineMath> Hz. Σήμα
          πληροφορίας <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_m = 2'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_m = 2\\pi \\Rightarrow f_m = 1'}</InlineMath> Hz. Το
          συνολικό σήμα κατά Conventional AM:
        </p>
        <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = [1 + 2\\sin(2\\pi t)]\\cos(20\\pi t)'}</BlockMath>

        <p>
          <strong>(1) Στον χρόνο — πρώτα ο έλεγχος{' '}
          <InlineMath>{'\\mu'}</InlineMath>, μετά η κυματομορφή.</strong> Η πρώτη κίνηση σε{' '}
          <em>κάθε</em> «σχεδιάστε AM» δεν είναι να ζωγραφίσεις — είναι να βρεις το{' '}
          <InlineMath>{'\\mu'}</InlineMath>, γιατί αυτό αποφασίζει αν η περιβάλλουσα μένει
          θετική (καθαρό AM) ή αναστρέφεται:
        </p>
        <BlockMath>{'\\mu = \\frac{A_m}{A_c} = \\frac{2}{1} = 2 > 1 \\;\\Rightarrow\\; \\text{overmodulation}'}</BlockMath>
        <p>
          <strong>Με απλά λόγια:</strong> το message ρίχνει διπλάσια απόσταση από όσο
          σηκώνει η βάση, άρα η περιβάλλουσα <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath>{' '}
          σίγουρα περνά κάτω από το μηδέν. Το <strong>μεταφέρσιμο</strong>:{' '}
          <InlineMath>{'\\mu \\le 1'}</InlineMath> → καθαρή θετική περιβάλλουσα, καμία
          αναστροφή· <InlineMath>{'\\mu > 1'}</InlineMath> → αναστροφές φάσης. Βρίσκουμε{' '}
          <em>πού</em> αναστρέφεται λύνοντας πού μηδενίζεται η περιβάλλουσα:
        </p>
        <BlockMath>{'1 + 2\\sin(2\\pi t) = 0 \\;\\Rightarrow\\; \\sin(2\\pi t) = -\\tfrac{1}{2}'}</BlockMath>
        <p>
          Σε κάθε περίοδο <InlineMath>{'T_m = 1/f_m = 1'}</InlineMath> s αυτό δίνει{' '}
          <InlineMath>{'t = 7/12'}</InlineMath> s και{' '}
          <InlineMath>{'t = 11/12'}</InlineMath> s, και ανάμεσά τους η περιβάλλουσα είναι
          αρνητική (φτάνει το <InlineMath>{'1 - 2 = -1'}</InlineMath> στο{' '}
          <InlineMath>{'t = 3/4'}</InlineMath> s· το μέγιστο{' '}
          <InlineMath>{'1 + 2 = 3'}</InlineMath> είναι στο{' '}
          <InlineMath>{'t = 1/4'}</InlineMath> s). Επειδή{' '}
          <InlineMath>{'f_c/f_m = 10'}</InlineMath>, χωράνε{' '}
          <strong>10 κύκλοι carrier</strong> σε κάθε περίοδο του message.{' '}
          <strong>Στο σχέδιό σου:</strong> ζωγράφισε το carrier με πλάτος{' '}
          <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath>, και βάλε ένα{' '}
          <InlineMath>{'180^\\circ'}</InlineMath> flip στα δύο σημεία μηδενισμού — εκεί το
          cosine «αναποδογυρίζει» στον oscilloscope.
        </p>

        <figure className="my-4">
          <OvermodulationPhaseReversalViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Ο δρομέας εδώ φτάνει <strong>ακριβώς στο{' '}
            <InlineMath>{'\\mu = 2'}</InlineMath></strong> — το δικό μας πρόβλημα (σύρε τον
            ώς το <InlineMath>{'2'}</InlineMath>· το chip{' '}
            <InlineMath>{'\\mu = 1.5'}</InlineMath> είναι κοντά). <strong>Πάνω:</strong> το{' '}
            <InlineMath>{'x(t)'}</InlineMath> με τους κόκκινους{' '}
            <span className="text-red-600 dark:text-red-400">↺</span> δείκτες ακριβώς στις
            αναστροφές (στο πρόβλημά μας <InlineMath>{'t = 7/12, 11/12'}</InlineMath> s).{' '}
            <strong>Μέση:</strong> η περιβάλλουσα <InlineMath>{'A_c + m(t)'}</InlineMath> που
            πέφτει αρνητική (βιολετί) και το <InlineMath>{'|A_c + m(t)|'}</InlineMath> που
            αναδιπλώνεται (μπλε). <strong>Κάτω:</strong> η ανακτημένη{' '}
            <InlineMath>{'\\hat{m}(t)'}</InlineMath> από envelope detector (μπλε) διαφέρει από
            το αληθινό <InlineMath>{'m(t)'}</InlineMath> (πορτοκαλί) — η{' '}
            <span className="text-red-600 dark:text-red-400">κόκκινη ζώνη</span> είναι η
            παραμόρφωση, με RMS-error readout δεξιά. Το viz χρησιμοποιεί{' '}
            <em>cosine</em> message με ενδεικτικούς κύκλους, ενώ το δικό μας είναι{' '}
            <em>sine</em> με <InlineMath>{'f_c = 10'}</InlineMath>,{' '}
            <InlineMath>{'f_m = 1'}</InlineMath> Hz: το φαινόμενο (αναστροφές όπου{' '}
            <InlineMath>{'A_c + m(t) < 0'}</InlineMath> + αποτυχία του detector) είναι
            πανομοιότυπο· αλλάζει μόνο <em>πού</em> πάνω στον άξονα του χρόνου πέφτουν οι
            αναστροφές.
          </figcaption>
        </figure>

        <p>
          <strong>(2) Στη συχνότητα — το φάσμα πλάτους.</strong> Στον χρόνο το{' '}
          <InlineMath>{'x_{AM}'}</InlineMath> είναι ένα <em>γινόμενο</em>· και ο
          πολλαπλασιασμός στον χρόνο είναι <strong>μίξη</strong> στη συχνότητα — δεν
          «βλέπεις» τις γραμμές όσο μένει γινόμενο. Για να τις δεις, ξαναγράφεις το γινόμενο
          ως <em>άθροισμα καθαρών τόνων</em> (κάθε καθαρός τόνος = ένα ζεύγος impulses). Με
          την ταυτότητα γινομένου-σε-άθροισμα{' '}
          (<InlineMath>{'2\\sin a\\cos b = \\sin(a{+}b) + \\sin(a{-}b)'}</InlineMath>):
        </p>
        <BlockMath>{'2\\sin(2\\pi t)\\cos(20\\pi t) = \\sin(22\\pi t) - \\sin(18\\pi t)'}</BlockMath>
        <BlockMath>{'x_{AM}(t) = \\underbrace{\\cos(20\\pi t)}_{\\text{carrier}} + \\underbrace{\\sin(22\\pi t)}_{\\text{USB}} - \\underbrace{\\sin(18\\pi t)}_{\\text{LSB}}'}</BlockMath>
        <p>
          Τρεις καθαροί τόνοι ⇒ <strong>τρία ζεύγη impulses</strong> στο φάσμα πλάτους
          (carrier, USB, LSB):
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Carrier στα <InlineMath>{'\\pm 10'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'A_c/2 = 1/2'}</InlineMath>.
          </li>
          <li>
            USB στα <InlineMath>{'\\pm 11'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'1/2'}</InlineMath> (από το{' '}
            <InlineMath>{'\\sin(22\\pi t)'}</InlineMath>).
          </li>
          <li>
            LSB στα <InlineMath>{'\\pm 9'}</InlineMath> Hz, μέτρο{' '}
            <InlineMath>{'1/2'}</InlineMath> (από το{' '}
            <InlineMath>{'-\\sin(18\\pi t)'}</InlineMath>).
          </li>
        </ul>
        <p>
          <strong>Γιατί ίσα ύψη — και το μεταφέρσιμο.</strong> Γενικά το ύψος κάθε
          πλευρικής είναι <InlineMath>{'\\mu A_c/4'}</InlineMath> και του carrier{' '}
          <InlineMath>{'A_c/2'}</InlineMath>, άρα ο <strong>λόγος πλευρικής/carrier είναι{' '}
          <InlineMath>{'\\mu/2'}</InlineMath></strong>. Στο{' '}
          <InlineMath>{'\\mu = 0.5'}</InlineMath> οι πλευρικές είναι το{' '}
          <InlineMath>{'1/4'}</InlineMath> του carrier· στο{' '}
          <InlineMath>{'\\mu = 1'}</InlineMath> το μισό· εδώ{' '}
          <InlineMath>{'\\mu = 2'}</InlineMath> δίνει λόγο{' '}
          <InlineMath>{'1'}</InlineMath> — οι πλευρικές{' '}
          <strong>ίσες με τον carrier</strong>, και οι τρεις γραμμές ισοϋψείς στο{' '}
          <InlineMath>{'1/2'}</InlineMath>. Το πρόσημο <InlineMath>{'-'}</InlineMath> της LSB
          είναι λεπτομέρεια <strong>φάσης</strong>, αόρατη στο φάσμα <em>πλάτους</em> — μην
          τη σχεδιάσεις πιο κοντή. Το bandwidth είναι{' '}
          <InlineMath>{'2 f_m = 2'}</InlineMath> Hz (από 9 ώς 11 Hz στη θετική πλευρά). Και
          πάλι: η <strong>υπερδιαμόρφωση δεν πρόσθεσε καμία γραμμή</strong> — single tone
          σημαίνει πάντα carrier + ένα ζεύγος πλευρικών{' '}
          (<Link
            href="/am/conventional"
            className="text-accent underline-offset-2 hover:underline"
          >
            /am/conventional §4 Φάσμα
          </Link>
          ).
        </p>

        <figure className="my-4">
          <AMSpectrumViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η δομή του φάσματός μας: carrier (πορτοκαλί) στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> με ύψος{' '}
            <InlineMath>{'A_c/2'}</InlineMath>, και δύο πλευρικές (μπλε) στα{' '}
            <InlineMath>{'\\pm f_c \\pm f_m'}</InlineMath> με ύψος{' '}
            <InlineMath>{'\\mu A_c/4'}</InlineMath> — δηλαδή στα{' '}
            <InlineMath>{'\\pm 9, \\pm 10, \\pm 11'}</InlineMath> Hz για το πρόβλημά μας. Ο
            δρομέας εδώ φτάνει <strong>μόνο ώς{' '}
            <InlineMath>{'\\mu = 1'}</InlineMath></strong> (πλευρικές στο{' '}
            <InlineMath>{'1/4'}</InlineMath>, μισό του carrier)· νοερά σπρώξε τον στο{' '}
            <InlineMath>{'2'}</InlineMath> και δες κάθε πλευρική ν' ανεβαίνει στο{' '}
            <InlineMath>{'1/2'}</InlineMath> — <strong>ίσο με τον carrier</strong> (λόγος{' '}
            <InlineMath>{'\\mu/2 = 1'}</InlineMath>). Οι <em>θέσεις</em> (carrier + μία USB +
            μία LSB) και το <InlineMath>{'BW = 2 f_m'}</InlineMath> είναι ακριβώς το σχέδιό
            μας (2). Το viz σχεδιάζει μέτρα, οπότε το πρόσημο της LSB δεν φαίνεται — όπως και
            στο δικό σου φάσμα πλάτους.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— «<em>σχεδιάστε το AM στον χρόνο και στο φάσμα</em>» με single-tone
            message: <strong>(α)</strong> διάβασε <InlineMath>{'A_c, f_c'}</InlineMath> από
            το φέρον και <InlineMath>{'A_m, f_m'}</InlineMath> από το message·{' '}
            <strong>(β)</strong> υπολόγισε <InlineMath>{'\\mu = A_m/A_c'}</InlineMath> και{' '}
            <strong>έλεγξέ το ως προς το <InlineMath>{'1'}</InlineMath></strong> (σημαία
            υπερδιαμόρφωσης)· <strong>(γ)</strong> χρόνος: carrier «γεμισμένο» από την
            περιβάλλουσα <InlineMath>{'A_c + m(t)'}</InlineMath>, με phase reversals{' '}
            <em>μόνο αν</em> <InlineMath>{'\\mu > 1'}</InlineMath> (λύσε{' '}
            <InlineMath>{'A_c + m(t) = 0'}</InlineMath> για τις στιγμές)·{' '}
            <strong>(δ)</strong> φάσμα: carrier στα <InlineMath>{'\\pm f_c'}</InlineMath>{' '}
            (ύψος <InlineMath>{'A_c/2'}</InlineMath>) + ΕΝΑ ζεύγος πλευρικών (μία USB + μία
            LSB) στα <InlineMath>{'\\pm(f_c \\pm f_m)'}</InlineMath> (ύψος{' '}
            <InlineMath>{'\\mu A_c/4'}</InlineMath>, λόγος{' '}
            <InlineMath>{'\\mu/2'}</InlineMath> προς τον carrier). Η μνεία-κλειδί:{' '}
            <strong>η υπερδιαμόρφωση είναι ιστορία του χρόνου — ποτέ δεν προσθέτει
            φασματικές γραμμές.</strong>
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδιος σκελετός, αλλαγμένη μία παράμετρος (δοκίμασέ τες σύροντας τους
            δρομείς παραπάνω):
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Οριακή <InlineMath>{'\\mu = 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 1 = A_c'}</InlineMath>): η περιβάλλουσα{' '}
              <em>μόλις αγγίζει</em> το μηδέν — καμία αναστροφή ακόμη, το ακριβές όριο της
              έγκυρης AM. Σύρε τον <InlineMath>{'\\mu'}</InlineMath> στο{' '}
              <InlineMath>{'1.0'}</InlineMath> στο πρώτο viz (οι κόκκινες ζώνες
              εξαφανίζονται)· στο φάσμα ο λόγος <InlineMath>{'\\mu/2 = 1/2'}</InlineMath>, άρα
              οι πλευρικές πέφτουν στο μισό του carrier.
            </li>
            <li>
              <strong>Κανονική <InlineMath>{'\\mu < 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 0.5'}</InlineMath>): η περιβάλλουσα μένει θετική παντού,
              και ένας απλός envelope detector ανακτά <em>καθαρά</em> το message. Στο πρώτο
              viz η <InlineMath>{'\\hat{m}'}</InlineMath> πέφτει πάνω στο{' '}
              <InlineMath>{'m'}</InlineMath> (RMS error <InlineMath>{'\\to 0'}</InlineMath>) —
              γι' αυτό η πρακτική AM κρατά πάντα <InlineMath>{'\\mu \\le 1'}</InlineMath>.
            </li>
            <li>
              <strong>Τι βγάζει ο envelope detector στο{' '}
              <InlineMath>{'\\mu = 2'}</InlineMath>;</strong> Άσε τον δρομέα στο{' '}
              <InlineMath>{'2'}</InlineMath> και κοίτα το κάτω panel: ο detector δίνει{' '}
              <InlineMath>{'|1 + 2\\sin(2\\pi t)| - 1'}</InlineMath>, που αποκτά αιχμές
              (cusps) και αρμονικές εκεί που το message ήταν αρνητικό — παραμόρφωση που{' '}
              <strong>δεν φεύγει με LPF</strong>. Γι' αυτό η υπερδιαμορφωμένη AM απαιτεί{' '}
              <em>σύμφωνη</em> (coherent) αποδιαμόρφωση, όχι envelope detector.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'jan26-th2-8',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 2.8',
    weight: 6,
    title: 'DSB-SC με sinc message',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/dsb-sc', 'foundations/fourier-transform'],
    formulaIds: ['dsb-sc-signal', 'fourier-pair-rect', 'fourier-modulation-theorem'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος DSB-SC{' '}
        <InlineMath>{'x_{DSB}(t) = A_c\\,m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>5</strong> παλιά θέματα — δεν υπάρχει carrier impulse στο φάσμα). Οι ζεύγοι Fourier (rect↔sinc, modulation theorem) βρίσκονται στο τυπολόγιο. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:pb25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 3
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jun25-th2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Να σχεδιαστεί το φάσμα του διαμορφωμένου κατά AM-DSB-SC σήματος όταν
        το φέρον είναι <InlineMath>{'c(t) = \\cos(2\\pi f_c t)'}</InlineMath> και
        το σήμα πληροφορίας είναι{' '}
        <InlineMath>{'m(t) = 2\\,\\mathrm{sinc}(2Wt)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — «σχεδιάζω φάσμα DSB-SC» σημαίνει: πάρε το φάσμα του
            μηνύματος, κάν' το δύο αντίγραφα, σύρε τα στο φέρον.
          </strong>{' '}
          <span className="text-fg-muted">
            Το DSB-SC είναι ένας <strong>καθαρός πολλαπλασιασμός</strong>,{' '}
            <InlineMath>{'m(t)\\times\\cos(2\\pi f_c t)'}</InlineMath> — τίποτα δεν{' '}
            <em>προστίθεται</em>. Κι ο πολλαπλασιασμός με <InlineMath>{'\\cos'}</InlineMath>{' '}
            στον χρόνο κάνει ένα μόνο πράγμα στη συχνότητα:{' '}
            <strong>μετατοπίζει</strong> (αντιγράφει) το φάσμα του μηνύματος πάνω στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath>, με μισό ύψος. Άρα όλο το «σχέδιο» είναι
            τρία βήματα: <strong>(1)</strong> βρες το <InlineMath>{'M(f)'}</InlineMath>,{' '}
            <strong>(2)</strong> δύο αντίγραφα στα <InlineMath>{'\\pm f_c'}</InlineMath>,{' '}
            <strong>(3)</strong> κόψε το ύψος στο μισό. Το <em>μόνο</em> σημείο που μπερδεύει:{' '}
            <strong>υπάρχει ακίδα πάνω στο φέρον;</strong> Όχι — γιατί{' '}
            <em>μόνο πολλαπλασιάσαμε</em>, δεν προσθέσαμε καμία σταθερά. Η φέρουσα είναι
            «κατεσταλμένη» (suppressed) — αυτό ακριβώς λέει το <strong>SC</strong>.
          </span>
        </div>

        <p>
          <strong>(0) Το φάσμα του μηνύματος — sinc στον χρόνο, rect στη συχνότητα.</strong>{' '}
          Από το ζεύγος <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath>{' '}
          του <strong>τυπολογίου</strong>, μια sinc στον χρόνο γίνεται καθαρό{' '}
          <strong>rect</strong> (τούβλο) στη συχνότητα:
        </p>
        <BlockMath>{'m(t) = 2\\,\\mathrm{sinc}(2Wt) \\;\\longleftrightarrow\\; M(f) = \\frac{2}{2W}\\,\\Pi\\!\\left(\\frac{f}{2W}\\right) = \\frac{1}{W}\\,\\Pi\\!\\left(\\frac{f}{2W}\\right)'}</BlockMath>
        <p className="-mt-1 text-sm text-fg-muted">
          Δηλαδή ένα rect <strong>ύψους <InlineMath>{'1/W'}</InlineMath></strong> πάνω στο{' '}
          <InlineMath>{'|f| \\le W'}</InlineMath> — <strong>μισό-εύρος{' '}
          <InlineMath>{'W'}</InlineMath></strong> (πλήρες πλάτος{' '}
          <InlineMath>{'2W'}</InlineMath>).
        </p>
        <p>
          <strong>Πρόσεξε τι κάνει το καθένα:</strong> το <InlineMath>{'2Wt'}</InlineMath>{' '}
          <em>μέσα</em> στη sinc ορίζει το <strong>εύρος</strong> (μισό-εύρος{' '}
          <InlineMath>{'W'}</InlineMath>)· το <strong>μπροστινό <InlineMath>{'2'}</InlineMath></strong>{' '}
          είναι <em>μόνο πλάτος</em> — ανεβάζει το ύψος στο <InlineMath>{'1/W'}</InlineMath>, δεν{' '}
          αλλάζει καθόλου το πλάτος ζώνης. <strong>Κλασική παγίδα:</strong> μην «πλαταίνεις»
          τη ζώνη επειδή είδες το <InlineMath>{'2'}</InlineMath>.
        </p>

        <p>
          <strong>(1) Διαμόρφωση — δύο αντίγραφα, μισό ύψος.</strong> Το DSB-SC είναι σκέτος
          πολλαπλασιασμός, και το <strong>θεώρημα διαμόρφωσης</strong> (τυπολόγιο) λέει τι
          κάνει αυτό στη συχνότητα:
        </p>
        <BlockMath>{'x(t) = m(t)\\cos(2\\pi f_c t) \\;\\longleftrightarrow\\; X(f) = \\tfrac{1}{2}\\big[\\,M(f - f_c) + M(f + f_c)\\,\\big]'}</BlockMath>
        <p className="-mt-1 text-sm text-fg-muted">
          (πολλαπλασιασμός με <InlineMath>{'\\cos(2\\pi f_c t)'}</InlineMath> ⇒{' '}
          <em>μισό</em> αντίγραφο του <InlineMath>{'M'}</InlineMath> στο{' '}
          <InlineMath>{'+f_c'}</InlineMath> κι ένα μισό στο <InlineMath>{'-f_c'}</InlineMath>).
        </p>
        <p>
          Πάρε λοιπόν το rect του <InlineMath>{'M(f)'}</InlineMath>, φτιάξε δύο αντίγραφα, σύρε
          το ένα στο <InlineMath>{'+f_c'}</InlineMath> και το άλλο στο{' '}
          <InlineMath>{'-f_c'}</InlineMath>, και κόψε το ύψος στο μισό:
        </p>
        <BlockMath>{'X(f) = \\frac{1}{2W}\\,\\Pi\\!\\left(\\frac{f - f_c}{2W}\\right) + \\frac{1}{2W}\\,\\Pi\\!\\left(\\frac{f + f_c}{2W}\\right)'}</BlockMath>
        <p className="-mt-1 text-sm text-fg-muted">
          δηλ. <strong>δύο rect ύψους <InlineMath>{'1/(2W)'}</InlineMath></strong>, καθένα στο{' '}
          <InlineMath>{'[f_c - W,\\, f_c + W]'}</InlineMath> (και το κατοπτρικό στο{' '}
          <InlineMath>{'-f_c'}</InlineMath>), <strong>χωρίς καμία ακίδα στο φέρον</strong>.
        </p>
        <p>
          <strong>Το εκπεμπόμενο εύρος ζώνης είναι <InlineMath>{'2W'}</InlineMath></strong> (η
          ζώνη πιάνει από <InlineMath>{'f_c - W'}</InlineMath> ως{' '}
          <InlineMath>{'f_c + W'}</InlineMath>) — <em>διπλάσιο</em> από το εύρος{' '}
          <InlineMath>{'W'}</InlineMath> του ίδιου του μηνύματος. Κράτα τη διάκριση:{' '}
          <strong>εύρος μηνύματος <InlineMath>{'W'}</InlineMath>, εκπεμπόμενο{' '}
          <InlineMath>{'2W'}</InlineMath></strong> — το DSB-SC δεν γλιτώνει εύρος (το SSB το
          γλιτώνει, βλ. Παραλλαγές).
        </p>

        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Γιατί το DSB-SC δεν έχει γραμμή-φέρουσα — η καρδιά του θέματος.
          </strong>{' '}
          <span className="text-fg-muted">
            Μια <strong>γραμμή (ακίδα) στο φάσμα</strong> πάνω στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> είναι μια{' '}
            <InlineMath>{'\\delta'}</InlineMath>, και μια <InlineMath>{'\\delta'}</InlineMath>{' '}
            βγαίνει <em>μόνο</em> από έναν <strong>καθαρό τόνο</strong> — δηλαδή από μια
            σταθερά που πολλαπλασιάζει τη φέρουσα:
          </span>
          <div className="mt-2">
            <BlockMath>{'A_c\\cos(2\\pi f_c t) \\;\\longleftrightarrow\\; \\tfrac{A_c}{2}\\big[\\,\\delta(f - f_c) + \\delta(f + f_c)\\,\\big]'}</BlockMath>
          </div>
          <span className="text-fg-muted">
            Στο <strong>συμβατικό AM</strong>, <InlineMath>{'[A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>,{' '}
            ο όρος <InlineMath>{'A_c\\cos(2\\pi f_c t)'}</InlineMath> είναι ακριβώς τέτοιος
            καθαρός τόνος ⇒ <strong>γραμμή-φέρουσα</strong> στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath>. Στο <strong>DSB-SC</strong>,{' '}
            <InlineMath>{'m(t)\\cos(2\\pi f_c t)'}</InlineMath>, <em>δεν υπάρχει</em> τέτοια
            σταθερά: πολλαπλασιάζεις με <InlineMath>{'m(t)'}</InlineMath> και <strong>μόνο</strong> —{' '}
            καμία DC, κανένας τόνος, <strong>καμία γραμμή</strong>. Μόνο τα δύο μετατοπισμένα
            αντίγραφα του μηνύματος (οι πλευρικές).{' '}
            <strong>Ο μεταφέρσιμος κανόνας</strong> (κράτα αυτόν, όχι το νούμερο):{' '}
            <strong>(α)</strong> ο πολλαπλασιασμός με τη φέρουσα <em>μετατοπίζει</em> το baseband
            φάσμα στα <InlineMath>{'\\pm f_c'}</InlineMath>· <strong>(β)</strong> το{' '}
            <em>σχήμα</em> της ζώνης δεν αλλάζει (rect → rect, sinc → sinc, τόνος → ακίδες)·{' '}
            <strong>(γ)</strong> γραμμή-φέρουσα εμφανίζεται <em>αν και μόνο αν</em> προστέθηκε
            σταθερά/DC <em>πριν</em> τον πολλαπλασιασμό. Δες γραμμή ⇒ συμβατικό AM· μόνο
            πλευρικές ⇒ DSB-SC. (Ίδια ιδέα με το κανάλι-<InlineMath>{'k'}</InlineMath> στο{' '}
            <Link
              href="/practice#exercise:jun25-th2"
              className="text-accent underline-offset-2 hover:underline"
            >
              Ιούν. 2025 ΘΕΜΑ 2
            </Link>
            , όπου το ένα κανάλι έχει γραμμή και το άλλο όχι.)
          </span>
        </div>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — ιδανικεύσεις.</strong> Επειδή το{' '}
          <InlineMath>{'M(f)'}</InlineMath> είναι <em>γνήσιο</em> rect, το μήνυμα είναι{' '}
          <strong>αυστηρά bandlimited</strong> — οι ακμές στο σχέδιο είναι ακριβείς, δεν
          υπάρχει ουρά που αποκόπτεται. Το σχέδιο είναι <strong>σχηματικό</strong>: το{' '}
          <InlineMath>{'f_c'}</InlineMath> αυθαίρετο (σε σχετικές μονάδες του{' '}
          <InlineMath>{'W'}</InlineMath>, με <InlineMath>{'f_c \\gg W'}</InlineMath> ώστε τα δύο
          αντίγραφα στα <InlineMath>{'\\pm f_c'}</InlineMath> να μην ακουμπούν κοντά στο DC), και
          τα ύψη σχεδιάζονται κανονικοποιημένα — οι πραγματικές τιμές{' '}
          <InlineMath>{'1/W \\to 1/(2W)'}</InlineMath> είναι στο κείμενο.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz numChannels={1} initialMod="dsb" mBW={1} />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>.{' '}
            <strong>Πάνω πάνελ:</strong> το baseband <InlineMath>{'M(f)'}</InlineMath> = το rect
            του <InlineMath>{'m(t) = 2\\,\\mathrm{sinc}(2Wt)'}</InlineMath> στο{' '}
            <InlineMath>{'[-W, W]'}</InlineMath> (το bracket «<InlineMath>{'2W'}</InlineMath>» =
            πλήρες πλάτος). <strong>Δύο κάτω πάνελ:</strong> το διαμορφωμένο{' '}
            <InlineMath>{'X(f)'}</InlineMath> = το <em>ίδιο</em> rect σε <strong>δύο
            αντίγραφα</strong> γύρω από τα <InlineMath>{'\\pm f_c'}</InlineMath>, καθένα πλήρους
            πλάτους <InlineMath>{'2W'}</InlineMath> (στο{' '}
            <InlineMath>{'[f_c - W,\\, f_c + W]'}</InlineMath>) — και <strong>καμία ακίδα στο
            φέρον</strong>: αυτή ακριβώς η <em>απουσία</em> γραμμής είναι η οπτική απάντηση. Ο
            διακόπτης ξεκινά στο <strong>DSB-SC</strong>· γύρισέ τον στο <strong>USSB</strong>{' '}
            και βλέπεις την παραλλαγή ενός-πλευρικού (μισό εύρος, <InlineMath>{'W'}</InlineMath>{' '}
            αντί <InlineMath>{'2W'}</InlineMath>) — πάλι χωρίς γραμμή. Τα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> και τα ύψη είναι σχηματικά, όχι σε κλίμακα.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «σχεδίασε φάσμα DSB-SC», τρέξε τα ίδια τρία σήματα-κλειδιά:{' '}
            <strong>(α)</strong> βρες το <InlineMath>{'M(f)'}</InlineMath> (το σχήμα στο
            baseband — εδώ rect από τη sinc)· <strong>(β)</strong> δύο αντίγραφα στα{' '}
            <InlineMath>{'\\pm f_c'}</InlineMath> με μισό ύψος (το <em>σχήμα</em> μένει ίδιο, μόνο
            μετατοπίζεται)· <strong>(γ)</strong> <strong>καμία γραμμή</strong> στο φέρον — αφού
            καθαρός πολλαπλασιασμός. Το μεταφέρσιμο κλειδί: <em>γραμμή ⇔ προστέθηκε σταθερά</em>.
            Δες γραμμή ⇒ συμβατικό AM (υπάρχει <InlineMath>{'+A_c'}</InlineMath>)· μόνο πλευρικές
            ⇒ DSB-SC. Και μην μπερδεύεις το <em>εύρος μηνύματος</em>{' '}
            <InlineMath>{'W'}</InlineMath> με το <em>εκπεμπόμενο</em>{' '}
            <InlineMath>{'2W'}</InlineMath>. Με αυτά μπορείς να σχεδιάσεις DSB-SC για{' '}
            <em>οποιοδήποτε</em> μήνυμα ή φέρον, όχι μόνο για τούτο.
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Συμβατικό AM αντί για DSB-SC</strong> (ίδιο μήνυμα,{' '}
              <InlineMath>{'x(t) = [A_c + 2\\,\\mathrm{sinc}(2Wt)]\\cos(2\\pi f_c t)'}</InlineMath>):
              πρόσθεσε μια <strong>δ-ακίδα στα <InlineMath>{'\\pm f_c'}</InlineMath></strong>{' '}
              βάρους <InlineMath>{'A_c/2'}</InlineMath> πάνω στις <em>ίδιες ακριβώς</em> δύο rect
              ζώνες. Η μόνη διαφορά στο σχέδιο είναι αυτή η γραμμή — ακριβώς το «κόστος» του{' '}
              <InlineMath>{'+A_c'}</InlineMath>. (Δες το κανάλι-<InlineMath>{'k'}</InlineMath> στο{' '}
              <Link
                href="/practice#exercise:jun25-th2"
                className="text-accent underline-offset-2 hover:underline"
              >
                Ιούν. 2025 ΘΕΜΑ 2
              </Link>
              .)
            </li>
            <li>
              <strong>Άλλο σχήμα μηνύματος.</strong> Αν{' '}
              <InlineMath>{'m(t) = \\cos(2\\pi f_m t)'}</InlineMath> (καθαρός τόνος), τότε{' '}
              <InlineMath>{'M(f)'}</InlineMath> = δύο <em>ακίδες</em> στα{' '}
              <InlineMath>{'\\pm f_m'}</InlineMath> ⇒ το DSB-SC δίνει <strong>ακίδες στα{' '}
              <InlineMath>{'f_c \\pm f_m'}</InlineMath></strong> (το «τετράγραμμο» DSB-SC, πάλι
              χωρίς κεντρική γραμμή). Αν <InlineMath>{'m(t) = \\Pi(t/T)'}</InlineMath> (rect στον
              χρόνο), τότε <InlineMath>{'M(f)'}</InlineMath> = sinc ⇒ δύο <strong>sinc λοβοί</strong>{' '}
              στα <InlineMath>{'\\pm f_c'}</InlineMath>. Ίδιο «shift + μισό ύψος», διαφορετικό{' '}
              <em>σχήμα</em>.
            </li>
            <li>
              <strong>SSB αντί για DSB-SC.</strong> Κράτα μόνο τη μία πλευρά (USSB:{' '}
              <InlineMath>{'[f_c,\\, f_c + W]'}</InlineMath>): το εύρος <em>υποδιπλασιάζεται</em>{' '}
              (<InlineMath>{'W'}</InlineMath> αντί <InlineMath>{'2W'}</InlineMath>), πάλι{' '}
              <strong>καμία γραμμή</strong>. Αυτό ακριβώς ζητά το αδελφό{' '}
              <Link
                href="/practice#exercise:pb25-th2-3"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 2.3
              </Link>{' '}
              (LSSB με ίδιο <InlineMath>{'\\mathrm{sinc}'}</InlineMath>-μήνυμα).
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'jan26-th2-9',
    repeatGroup: 'power-sum-sinusoids',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 2.9',
    weight: 8,
    title: 'Ισχύς αθροίσματος cosines + sines',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['parseval-power', 'cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> ανά τόνο — χρησιμοποιείται
        εδώ για κάθε από τους 3 τόνους (<InlineMath>{'A^2/2 + B^2/2 + C^2/2'}</InlineMath>).
        Εμφανίστηκε σε <strong>6</strong> παλιά θέματα (3 εξεταστικές — Σ/Λ «ισχύς vs ενέργεια» και υπολογισμοί αθροισμάτων). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.2
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 1.2
        </Link>.{' '}
        Επίσης: ο τύπος{' '}
        <InlineMath>{'P = \\sum_k A_k^2/2'}</InlineMath>{' '}
        (Parseval FS, parseval-power, βάρος <strong>4</strong>) επίσης λείπει — είναι το
        θεώρημα που δικαιολογεί αυτήν ακριβώς την πρόσθεση ισχύων ανά τόνο.
      </>
    ),
    statement: (
      <p>
        Έστω το σήμα{' '}
        <InlineMath>{'x(t) = A\\cos(2\\pi f_1 t) + B\\sin(2\\pi f_2 t) + C\\sin(2\\pi f_3 t)'}</InlineMath>{' '}
        με <InlineMath>{'f_1 \\neq f_2 \\neq f_3'}</InlineMath>. Υπολογίστε
        την ισχύ του.
      </p>
    ),
    solution: (
      <>
        <p>
          Όλες οι συχνότητες διαφορετικές → ορθογώνια στοιχεία → χωρίς
          cross-terms. Καθεμία συνεισφέρει <InlineMath>{'\\text{amp}^2/2'}</InlineMath>:
        </p>
        <BlockMath>{'P_x = \\frac{A^2}{2} + \\frac{B^2}{2} + \\frac{C^2}{2}'}</BlockMath>
      </>
    ),
  },
  {
    id: 'jan26-th2-10',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 2.10',
    weight: 8,
    title: 'Φάσμα πλάτους του sum-of-cosines+sines',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-pair-cos', 'fourier-pair-sin'],
    statement: (
      <p>
        Στο προηγούμενο σήμα{' '}
        <InlineMath>{'x(t) = A\\cos(2\\pi f_1 t) + B\\sin(2\\pi f_2 t) + C\\sin(2\\pi f_3 t)'}</InlineMath>,
        σχεδιάστε το φάσμα πλάτους του.
      </p>
    ),
    solution: (
      <>
        <p>FT impulses:</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>cos: ύψος <InlineMath>{'A/2'}</InlineMath> στις <InlineMath>{'\\pm f_1'}</InlineMath></li>
          <li>sin: ύψος <InlineMath>{'B/2'}</InlineMath> στις <InlineMath>{'\\pm f_2'}</InlineMath> (φανταστικό, αλλά μέτρο = B/2)</li>
          <li>sin: ύψος <InlineMath>{'C/2'}</InlineMath> στις <InlineMath>{'\\pm f_3'}</InlineMath></li>
        </ul>
        <p>
          Έξι impulses συνολικά. Για <strong>φάσμα πλάτους</strong>{' '}
          παίρνουμε μέτρο, όλα τα ύψη θετικά.
        </p>
      </>
    ),
  },
  {
    id: 'jan26-th3-mux',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 3.11–12',
    weight: 20,
    title: 'AM-USSB Multiplexing — sinc + Π σε δύο φέροντα',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/multiplexing', 'am/ssb', 'foundations/fourier-transform'],
    formulaIds: ['ssb-signal', 'hilbert', 'fourier-pair-rect'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος USSB σήματος{' '}
        <InlineMath>{'x_{USB}(t)=A_c m(t)\\cos(2\\pi f_c t)-A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα) και η συνθήκη
        μη-επικάλυψης FDM-SSB{' '}
        <InlineMath>{'\\Delta f \\ge W'}</InlineMath>{' '}
        (σε <strong>4</strong>). <strong>Δίνονται</strong> στο τυπολόγιο: το
        ζεύγος Fourier{' '}
        <InlineMath>{'\\mathrm{rect}\\leftrightarrow\\mathrm{sinc}'}</InlineMath>{' '}
        και ο μετασχηματισμός Hilbert{' '}
        <InlineMath>{'\\hat{m}'}</InlineMath>. Βλ. και τον δίδυμο{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>{' '}
        (ίδιο ζεύγος σημάτων, με ρητή συνθήκη μη-επικάλυψης).
      </>
    ),
    statement: (
      <p>
        Έστω τα δύο βασικά σήματα πληροφορίας{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)'}</InlineMath> και{' '}
        <InlineMath>{'k(t) = \\Pi(4Wt)'}</InlineMath>. Το κάθε σήμα
        διαμορφώνεται κατά AM-USSB με φέροντα{' '}
        <InlineMath>{'f_1 = 100'}</InlineMath> kHz και{' '}
        <InlineMath>{'f_2 = 1'}</InlineMath> MHz αντίστοιχα.{' '}
        <strong>(11)</strong> Αποτυπώστε σχηματικά το φάσμα πλάτους των δύο
        σημάτων βασικής ζώνης και των διαμορφωμένων σημάτων.{' '}
        <strong>(12)</strong> Αποτυπώστε σχηματικά το φάσμα πλάτους του
        πολυπλεγμένου σήματος <InlineMath>{'G(f)'}</InlineMath> των δύο
        διαμορφωμένων σημάτων.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα — γιατί FDM, και γιατί USSB.</strong>{' '}
          <span className="text-fg-muted">
            Δύο μηνύματα, ένα καλώδιο. Το FDM τα <strong>στοιβάζει</strong> σε{' '}
            <em>διαφορετικές</em> περιοχές συχνοτήτων — όπως δύο ραδιοσταθμοί που δεν
            μπερδεύονται επειδή εκπέμπουν σε διαφορετικά κανάλια· στον δέκτη ένα bandpass
            φίλτρο ξεχωρίζει το καθένα. Όλο το παιχνίδι: να μην «πατάει» το ένα κανάλι πάνω
            στο άλλο.{' '}
            <strong className="text-fg">Και γιατί USSB;</strong> Το φάσμα ενός πραγματικού
            μηνύματος είναι συμμετρικό — οι δύο πλευρικές ζώνες κουβαλούν <em>την ίδια</em>{' '}
            πληροφορία. Το DSB τις στέλνει και τις δύο ⇒ κάθε κανάλι πιάνει διπλάσιο εύρος·
            το USSB πετάει την περιττή ⇒ κάθε κανάλι πιάνει{' '}
            <strong>μόνο το δικό του bandwidth</strong> ⇒ χωράνε <strong>διπλάσια</strong>{' '}
            κανάλια στο ίδιο φάσμα (
            <Link href="/am/ssb" className="text-accent underline-offset-2 hover:underline">
              /am/ssb §1
            </Link>
            ). Αυτός είναι όλος ο λόγος που η πολυπλεξία αγαπά το USSB. Ο μπούσουλας που θα
            χρησιμοποιήσουμε ξανά και ξανά:{' '}
            <em>
              η ζώνη που πιάνει ένα USSB κανάλι = το bandwidth του μηνύματος, ανεβασμένο στο
              φέρον
            </em>
            .
          </span>
        </div>

        <p>
          <strong>Ερώτημα 11 — τα φάσματα βασικής ζώνης, και η παγίδα του σχήματος.</strong>{' '}
          Πριν αγγίξουμε τα φέροντα, βρίσκουμε <em>πρώτα</em> το σχήμα κάθε φάσματος βασικής
          ζώνης — αυτό καθορίζει το εύρος κάθε καναλιού. Τα δύο σήματα μοιάζουν στη γραφή,
          αλλά μετασχηματίζονται <em>ανάποδα</em> το ένα από το άλλο.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)'}</InlineMath>
            </strong>{' '}
            — ένα <em>sinc στον χρόνο</em> έχει για μετασχηματισμό ένα{' '}
            <strong>καθαρό rect</strong> (τούβλο) στη συχνότητα· είναι το ζεύγος{' '}
            <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath> του
            τυπολογίου, διαβασμένο προς τη μία κατεύθυνση:
            <BlockMath>{'M(f) = \\tfrac{1}{2W}\\,\\Pi\\!\\left(\\tfrac{f}{2W}\\right),\\qquad |f|\\le W'}</BlockMath>
            Bandwidth του <InlineMath>{'m'}</InlineMath>: <InlineMath>{'W'}</InlineMath>.
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\Pi(4Wt)'}</InlineMath>
            </strong>{' '}
            — εδώ το rect είναι στον <em>χρόνο</em>: μια <strong>στενή</strong> πύλη, πλάτους
            μόλις <InlineMath>{'1/(4W)'}</InlineMath>. Το <em>ίδιο</em> ζεύγος, διαβασμένο
            ανάποδα, δίνει <strong>sinc στη συχνότητα</strong>:
            <BlockMath>{'K(f) = \\tfrac{1}{4W}\\,\\mathrm{sinc}\\!\\left(\\tfrac{f}{4W}\\right)'}</BlockMath>
            με <strong>πρώτη ρίζα στα <InlineMath>{'|f| = 4W'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Η μεταφερόμενη αρχή (μην τη χάσεις):</strong> όσο πιο <em>στενό</em> ένα
          σήμα στον χρόνο, τόσο πιο <em>πλατύ</em> στη συχνότητα — και αντίστροφα. Γι&rsquo;
          αυτό η «στενή» πύλη <InlineMath>{'\\Pi(4Wt)'}</InlineMath> δίνει το{' '}
          <em>πλατύτερο</em> φάσμα (εύρος <InlineMath>{'4W'}</InlineMath>), ενώ το απλωμένο{' '}
          <InlineMath>{'\\mathrm{sinc}(2Wt)'}</InlineMath> δίνει το <em>στενό</em> rect (εύρος{' '}
          <InlineMath>{'W'}</InlineMath>). Μην μπεις στον πειρασμό «
          <InlineMath>{'\\mathrm{sinc}(2Wt)\\to W'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\Pi(4Wt)\\to 2W'}</InlineMath>»: τα δύο πάνε <em>αντίθετες</em>{' '}
          κατευθύνσεις. Για <InlineMath>{'\\Pi(at)'}</InlineMath> η πρώτη ρίζα του sinc είναι{' '}
          <strong>στο <InlineMath>{'a'}</InlineMath></strong> (εδώ <InlineMath>{'4W'}</InlineMath>),
          όχι στο <InlineMath>{'a/2'}</InlineMath>. Το <InlineMath>{'k'}</InlineMath> είναι{' '}
          <strong>τέσσερις φορές</strong> πιο πλατύ από το <InlineMath>{'m'}</InlineMath>.
        </p>

        <p>
          <strong>Ερώτημα 11 (συνέχεια) — τα διαμορφωμένα φάσματα.</strong> Τώρα εφαρμόζουμε
          USSB. <em>Γιατί αλλάζει το σχήμα;</em> Το DSB-SC θα έβαζε <em>και τις δύο</em>{' '}
          πλευρικές γύρω από κάθε <InlineMath>{'\\pm f_c'}</InlineMath>· το USSB κρατά{' '}
          <strong>μόνο την πάνω</strong> ⇒ κάθε κανάλι δεν κάθεται «γύρω» από το φέρον, αλλά{' '}
          <strong>ξεκινά στο φέρον και απλώνεται προς τα πάνω</strong>, κατά ακριβώς το
          bandwidth του μηνύματος:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            το <InlineMath>{'m'}</InlineMath> στο <InlineMath>{'f_1 = 100'}</InlineMath> kHz
            πιάνει <InlineMath>{'[f_1,\\, f_1 + W]'}</InlineMath> (και κατοπτρικά{' '}
            <InlineMath>{'[-f_1 - W,\\, -f_1]'}</InlineMath>) — πλάτος ζώνης{' '}
            <InlineMath>{'W'}</InlineMath>·
          </li>
          <li>
            το <InlineMath>{'k'}</InlineMath> στο <InlineMath>{'f_2 = 1'}</InlineMath> MHz
            πιάνει <InlineMath>{'[f_2,\\, f_2 + 4W]'}</InlineMath> (και κατοπτρικά) — πλάτος
            ζώνης <InlineMath>{'4W'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> η ζώνη ενός USSB καναλιού φτάνει από το φέρον ως το
          φέρον <em>συν</em> το bandwidth του μηνύματος — το πλάτος της <em>είναι</em> το
          bandwidth, <em>όχι</em> το διπλάσιο. Μην τα ζωγραφίσεις συμμετρικά γύρω από το
          φέρον — αυτό θα ήταν DSB. Και μην ξεχάσεις τα κατοπτρικά αντίγραφα στις{' '}
          <em>αρνητικές</em> συχνότητες· το φάσμα πλάτους ενός πραγματικού σήματος είναι πάντα
          συμμετρικό ως προς το <InlineMath>{'f = 0'}</InlineMath>.
        </p>

        <p>
          <strong>
            Ερώτημα 12 — το πολυπλεγμένο <InlineMath>{'G(f)'}</InlineMath>, και γιατί τα δύο
            κανάλια δεν συγκρούονται.
          </strong>{' '}
          Το πολυπλεγμένο είναι απλώς το άθροισμα{' '}
          <InlineMath>{'G(f) = X_m(f) + X_k(f)'}</InlineMath> — οι δύο USSB ζώνες
          τοποθετημένες στις θέσεις τους. Για να ξεμπλέξει ο δέκτης το καθένα με ένα bandpass
          φίλτρο, οι δύο ζώνες <em>δεν</em> πρέπει να αγγίζονται. Ας το <em>επαληθεύσουμε</em>{' '}
          με τους πραγματικούς αριθμούς αντί να το υποθέσουμε: στον θετικό άξονα, το κάτω
          κανάλι (<InlineMath>{'m'}</InlineMath>, στο φέρον <InlineMath>{'f_1'}</InlineMath>)
          τελειώνει στο <InlineMath>{'f_1 + W'}</InlineMath> (δηλ. 100 kHz +{' '}
          <InlineMath>{'W'}</InlineMath>)· το πάνω κανάλι (<InlineMath>{'k'}</InlineMath>)
          ξεκινά στο <InlineMath>{'f_2'}</InlineMath> (1 MHz). Μη-επικάλυψη σημαίνει:
        </p>
        <BlockMath>{'f_2 \\ge f_1 + W \\;\\Longleftrightarrow\\; \\Delta f = f_2 - f_1 \\ge W.'}</BlockMath>
        <p>
          Με αριθμούς: <InlineMath>{'\\Delta f = 1000 - 100 = 900'}</InlineMath> kHz. Αφού το
          bandwidth ενός μηνύματος φωνής/ήχου είναι το πολύ μερικά kHz, το{' '}
          <InlineMath>{'900'}</InlineMath> kHz κενό είναι <strong>τεράστιο</strong> μπροστά
          στο <InlineMath>{'W'}</InlineMath> ⇒ καθαρός διαχωρισμός, με άνεση. Το{' '}
          <InlineMath>{'G(f)'}</InlineMath> έχει δύο ξεχωριστούς λοβούς — ένα στενό rect-USSB
          γύρω στα <InlineMath>{'100'}</InlineMath> kHz κι έναν πλατύτερο sinc-USSB γύρω στα{' '}
          <InlineMath>{'1'}</InlineMath> MHz — με μεγάλο κενό ανάμεσά τους (κι από τις δύο
          μεριές του άξονα).
        </p>
        <p>
          <strong>Το λεπτό, μεταφερόμενο σημείο</strong> (εδώ κρύβεται το λάθος που ψαρεύει η
          εξέταση): η ελάχιστη απόσταση που χρειάζεσαι ισούται με το bandwidth του{' '}
          <em>κάτω</em> καναλιού — εδώ το <InlineMath>{'W'}</InlineMath> του{' '}
          <InlineMath>{'m'}</InlineMath>, <strong>όχι</strong> το{' '}
          <InlineMath>{'4W'}</InlineMath> του <InlineMath>{'k'}</InlineMath>, και{' '}
          <strong>όχι</strong> το άθροισμα <InlineMath>{'5W'}</InlineMath>. Αφού κάθε USSB
          κανάλι απλώνεται προς τα <em>πάνω</em>, το πλατύ <InlineMath>{'4W'}</InlineMath> του{' '}
          <InlineMath>{'k'}</InlineMath> εκτείνεται σε <em>άδειο</em> φάσμα πάνω από το{' '}
          <InlineMath>{'f_2'}</InlineMath> — μόνο η πάνω ακμή του <em>κάτω</em> καναλιού
          ανταγωνίζεται το επόμενο φέρον. <strong>Γενικός κανόνας:</strong> επόμενο φέρον{' '}
          <InlineMath>{'\\ge'}</InlineMath> προηγούμενο φέρον + πλάτος του{' '}
          <em>προηγούμενου</em> καναλιού.
        </p>
        <p>
          <strong>
            Και πρόσεξε — εδώ <em>δεν</em> χρειάζεται <InlineMath>{'f_1 \\ge W'}</InlineMath>.
          </strong>{' '}
          Ο κανόνας «<InlineMath>{'f_c \\ge W'}</InlineMath>» είναι του{' '}
          <strong>DSB / συμβατικού AM</strong>, όπου η ζώνη είναι{' '}
          <InlineMath>{'[f_c - W,\\, f_c + W]'}</InlineMath> και πρέπει να μην πέσει στο DC.
          Στο USSB η ζώνη ξεκινά <em>στο</em> <InlineMath>{'f_1'}</InlineMath> και πάει προς τα
          πάνω — δεν αγγίζει ποτέ το <InlineMath>{'f = 0'}</InlineMath>· με{' '}
          <InlineMath>{'f_1 = 100'}</InlineMath> kHz <InlineMath>{'\\gg W'}</InlineMath> αυτό
          είναι ούτως ή άλλως άνετο (
          <Link
            href="/am/multiplexing"
            className="text-accent underline-offset-2 hover:underline"
          >
            /am/multiplexing §3
          </Link>
          ).
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — γιατί το σχέδιο είναι σχηματικό.</strong>{' '}
          Τα πραγματικά φέροντα έχουν λόγο{' '}
          <InlineMath>{'f_2/f_1 = 1000/100 = 10'}</InlineMath> — <strong>δεκαπλάσια</strong>{' '}
          απόσταση· αν τα σχεδίαζες σε πραγματική κλίμακα, το κάτω κανάλι θα ήταν μια αόρατη
          γραμμή κοντά στην αρχή. Γι&rsquo; αυτό κάθε σχέδιο (και το interactive πιο κάτω) είναι{' '}
          <strong>σχηματικό</strong>: ο άξονας μετριέται σε{' '}
          <em>σχετικές μονάδες του <InlineMath>{'W'}</InlineMath></em>, με τα{' '}
          <InlineMath>{'f_1, f_2'}</InlineMath> πλασματικά κοντά για να φαίνονται και τα δύο
          κανάλια. Επίσης το <InlineMath>{'K(f)'}</InlineMath> είναι sinc, με{' '}
          <strong>ουρές που δεν τελειώνουν ποτέ</strong>: αυστηρά το{' '}
          <InlineMath>{'k'}</InlineMath> δεν είναι bandlimited, οπότε παίρνουμε την{' '}
          <strong>πρώτη ρίζα (<InlineMath>{'4W'}</InlineMath>)</strong> ως το ενεργό bandwidth,
          όπως κάνει και η εξέταση.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz kBW={4} />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε <strong>σχετικές μονάδες του{' '}
            <InlineMath>{'W'}</InlineMath></strong> (τα πραγματικά{' '}
            <InlineMath>{'f_1 = 100'}</InlineMath> kHz και <InlineMath>{'f_2 = 1'}</InlineMath>{' '}
            MHz έχουν λόγο 10× — δεν ζωγραφίζονται σε κλίμακα). Πάνω:{' '}
            <InlineMath>{'M(f)'}</InlineMath> = το rect μπλοκ στο{' '}
            <InlineMath>{'[-W, W]'}</InlineMath> (μισό-εύρος <InlineMath>{'W'}</InlineMath>)· από
            κάτω <InlineMath>{'K(f)'}</InlineMath> = ο sinc λοβός (το bracket «
            <InlineMath>{'2W_k = 8W'}</InlineMath> (πρώτο null)» σημαίνει πρώτες ρίζες στα{' '}
            <InlineMath>{'\\pm 4W'}</InlineMath> — ενεργό εύρος <InlineMath>{'4W'}</InlineMath>,
            τέσσερις φορές το <InlineMath>{'m'}</InlineMath>). Στο διαμορφωμένο, το USSB κρατά{' '}
            <strong>μόνο την πάνω πλευρική</strong>: το <InlineMath>{'m'}</InlineMath> στο{' '}
            <InlineMath>{'[f_1, f_1 + W]'}</InlineMath>, το <InlineMath>{'k'}</InlineMath> στο{' '}
            <InlineMath>{'[f_2, f_2 + 4W]'}</InlineMath>. Σύρε την απόσταση{' '}
            <InlineMath>{'\\Delta f'}</InlineMath>: η ένδειξη «ελάχιστο» δείχνει{' '}
            <InlineMath>{'W'}</InlineMath> (το πλάτος του <em>κάτω</em> καναλιού) — κάτω από
            αυτό η ζώνη στο <InlineMath>{'G(f)'}</InlineMath> γίνεται κόκκινη (crosstalk),
            ακριβώς η συνθήκη του Ερωτήματος 12. Γύρισε τον διακόπτη σε <strong>DSB-SC</strong>{' '}
            και δες τις ζώνες να διπλασιάζονται και το «ελάχιστο» να πηδά στο{' '}
            <InlineMath>{'W + 4W = 5W'}</InlineMath> — ακριβώς το κόστος που γλιτώνει το USSB.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «δύο (ή <InlineMath>{'N'}</InlineMath>) σήματα, διαφορετικά
            φέροντα, αποτύπωσε τα φάσματα / το <InlineMath>{'G(f)'}</InlineMath>», τρέξε τα{' '}
            <strong>ίδια τέσσερα βήματα</strong>, ό,τι κι αν είναι τα σχήματα: (1) βρες το
            φάσμα <em>βασικής ζώνης</em> κάθε καναλιού — πρόσεξε ποιος είναι sinc και ποιος
            rect (μετασχηματίζονται ανάποδα: στενό στον χρόνο ⇒ πλατύ στη συχνότητα)· (2)
            εφάρμοσε τη διαμόρφωση —{' '}
            <em>
              USSB ⇒ κράτα μόνο την πάνω πλευρική ⇒ ζώνη που ξεκινά στο φέρον, πλάτους =
              bandwidth μηνύματος
            </em>
            · (3) στοίβαξε στα φέροντα (με τα κατοπτρικά στις αρνητικές)· (4) απαίτησε{' '}
            <strong>
              επόμενο φέρον ≥ προηγούμενο φέρον + πλάτος του προηγούμενου καναλιού
            </strong>
            . Αυτή η τελευταία γραμμή είναι η συνθήκη μη-επικάλυψης σε <em>κάθε</em> FDM
            άσκηση.
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>DSB-SC αντί USSB.</strong> Κάθε κανάλι γίνεται διπλής πλευρικής ⇒ το{' '}
              <InlineMath>{'m'}</InlineMath> πιάνει <InlineMath>{'2W'}</InlineMath>, το{' '}
              <InlineMath>{'k'}</InlineMath> πιάνει <InlineMath>{'8W'}</InlineMath>· η ελάχιστη
              απόσταση γίνεται <InlineMath>{'W + 4W = 5W'}</InlineMath> (άθροισμα των δύο
              μισών-ευρών) αντί <InlineMath>{'W'}</InlineMath>. Γύρισε τον διακόπτη του
              interactive σε DSB-SC και επιβεβαίωσε το «ελάχιστο = 5W». (Δες{' '}
              <Link
                href="/practice#exercise:pb25-th3-mux"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 3
              </Link>
              , DSB-SC FDM.)
            </li>
            <li>
              <strong>Αντίστρεψε ποιο σήμα μπαίνει χαμηλά.</strong> Βάλε το{' '}
              <InlineMath>{'k'}</InlineMath> (εύρος <InlineMath>{'4W'}</InlineMath>) στο{' '}
              <em>κάτω</em> φέρον <InlineMath>{'f_1'}</InlineMath>· τώρα η ελάχιστη απόσταση
              πηδά στα <InlineMath>{'4W'}</InlineMath> — γιατί τη συνθήκη την ορίζει πάντα το{' '}
              <em>κάτω</em> κανάλι. Καλό τεστ ότι κατάλαβες το κλειδί, όχι ότι το αποστήθισες.
            </li>
            <li>
              <strong>Η οριακή περίπτωση.</strong> Κάνε{' '}
              <InlineMath>{'\\Delta f = W'}</InlineMath> ακριβώς: οι δύο ζώνες <em>μόλις</em>{' '}
              ακουμπούν — κρίσιμη μη-επικάλυψη. Λίγο πιο κάτω ⇒ crosstalk. Στην πράξη αφήνεις
              ~10–20% guard band για τα μη-ιδανικά φίλτρα του δέκτη.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'jan26-th4-fm',
    origin: 'past-exam',
    source: 'jan-2026',
    problemNumber: 'ΘΕΜΑ 4.13–16',
    weight: 30,
    title: 'FM — f_c, β, Bessel sidebands, ποσοστό ισχύος',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/idea', 'fm/bessel', 'fm/carson'],
    formulaIds: ['fm-single-tone', 'fm-beta', 'carson', 'fm-bessel-sidebands', 'fm-bessel-property', 'fm-power'],
    memorizationNote: (
      <>
        Στο τυπολόγιο υπάρχει πίνακας <InlineMath>{'J_n(\\beta)'}</InlineMath>.
        Πρέπει να ξέρεις πώς να πάρεις τιμές γρήγορα — π.χ. για{' '}
        <InlineMath>{'\\beta = 3'}</InlineMath>:{' '}
        <InlineMath>{'J_0 \\approx -0.26, J_1 \\approx 0.34, J_2 \\approx 0.49, J_3 \\approx 0.31'}</InlineMath>.{' '}
        <strong>⚠️ Ο ορισμός β (βάρος 6) και ο κανόνας Carson (βάρος 6) δεν
        δίνονται στο τυπολόγιο</strong> — τους γράφεις απέξω. Στο θέμα 14:{' '}
        β=3 διαβάζεται από τη μορφή του σήματος, μετά{' '}
        <InlineMath>{'B = 2(\\beta+1)f_m = 2\\cdot 4\\cdot 1 = 8'}</InlineMath>{' '}
        kHz.{' '}
        <strong>
          ⚠️ Η μορφή Bessel{' '}
          <InlineMath>{'x_{FM} = A_c\\sum_n J_n(\\beta)\\cos[2\\pi(f_c+nf_m)t]'}</InlineMath>{' '}
          δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — 3 παλιά θέματα Bessel) — ο πίνακας τιμών δίνεται, η ΜΟΡΦΗ
        όχι.{' '}
        <strong>
          ⚠️ Συμμετρία{' '}
          <InlineMath>{'J_{-n} = (-1)^n J_n'}</InlineMath>{' '}
          + energy identity{' '}
          <InlineMath>{'\\sum_n J_n^2 = 1'}</InlineMath>{' '}
          δεν δίνονται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — χρησιμοποιούνται στο θέμα 16 για το ποσοστό ισχύος).{' '}
        <strong>
          ⚠️ Ισχύς FM{' '}
          <InlineMath>{'P_{FM} = A_c^2/2'}</InlineMath>{' '}
          ανεξάρτητη του β — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — θέμα 16:{' '}
        <InlineMath>{'P_{FM} = 50\\,\\text{W}'}</InlineMath>).{' '}
        <strong>
          ⚠️ Single-tone εξίσωση FM{' '}
          <InlineMath>{'x_{FM} = A_c\\cos[2\\pi f_c t + \\beta_f\\sin(2\\pi f_m t)]'}</InlineMath>{' '}
          — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — 2 παλιά θέματα: αναγνωρίζεις A_c, f_c, β, f_m από τη μορφή· βλ. και{' '}
        <Link href="/practice#exercise:jun25-th3-fm">Ιούν.2025 ΘΕΜΑ 3</Link>).
      </>
    ),
    statement: (
      <p>
        Δίνεται FM σήμα{' '}
        <InlineMath>{'s(t) = 10\\cos(2\\pi\\cdot 100000\\,t + 3\\sin(2\\pi\\cdot 1000\\,t))'}</InlineMath>.
        (13, 4%) Συχνότητα φέροντος <InlineMath>{'f_c'}</InlineMath> και
        συχνότητα σήματος πληροφορίας <InlineMath>{'f_m'}</InlineMath>.
        (14, 6%) Δείκτης διαμόρφωσης β και εύρος ζώνης Carson. (15, 10%)
        Ανάπτυξη σε φασματικές συνιστώσες με Bessel και προσδιορισμός των 3
        ισχυρότερων sidebands. (16, 10%) Ποσοστό ισχύος που μεταφέρεται από
        τον carrier.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>(13)</strong> Σύγκριση με{' '}
          <InlineMath>{'A_c\\cos[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)]'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li><InlineMath>{'A_c = 10'}</InlineMath> V</li>
          <li><InlineMath>{'f_c = 100\\,000'}</InlineMath> Hz = 100 kHz</li>
          <li><InlineMath>{'f_m = 1000'}</InlineMath> Hz = 1 kHz</li>
          <li><InlineMath>{'\\beta = 3'}</InlineMath></li>
        </ul>
        <p><strong>(14)</strong> Carson:</p>
        <BlockMath>{'B = 2(\\beta + 1)f_m = 2\\cdot 4\\cdot 1000 = 8\\,\\text{kHz}'}</BlockMath>
        <p>
          <strong>(15)</strong> Bessel form:{' '}
          <InlineMath>{'s(t) = 10\\sum_n J_n(3)\\cos[2\\pi(100 + n)\\,\\text{kHz}\\,t]'}</InlineMath>.
          Για <InlineMath>{'\\beta = 3'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li><InlineMath>{'J_0(3) \\approx -0.26'}</InlineMath> → carrier 2.6 V</li>
          <li><InlineMath>{'J_1(3) \\approx 0.34'}</InlineMath> → ±1 sb 3.4 V</li>
          <li><InlineMath>{'J_2(3) \\approx 0.49'}</InlineMath> → ±2 sb 4.9 V <strong>(ισχυρότερο!)</strong></li>
          <li><InlineMath>{'J_3(3) \\approx 0.31'}</InlineMath> → ±3 sb 3.1 V</li>
          <li><InlineMath>{'J_4(3) \\approx 0.13'}</InlineMath> → ±4 sb 1.3 V</li>
        </ul>
        <p>
          Τα <strong>3 ισχυρότερα ζεύγη</strong>:{' '}
          <InlineMath>{'\\pm 2'}</InlineMath> (4.9 V),{' '}
          <InlineMath>{'\\pm 1'}</InlineMath> (3.4 V),{' '}
          <InlineMath>{'\\pm 3'}</InlineMath> (3.1 V).
        </p>
        <p>
          <strong>(16)</strong> Ολική ισχύς FM:{' '}
          <InlineMath>{'P_{FM} = A_c^2/2 = 50'}</InlineMath> W. Ισχύς στον
          carrier: <InlineMath>{'A_c^2 J_0^2(3)/2 = 50\\cdot 0.0676 = 3.38'}</InlineMath> W.
        </p>
        <BlockMath>{'\\text{Ποσοστό carrier} = \\frac{3.38}{50} = 6.76\\%'}</BlockMath>
        <p>
          Αντίστοιχα <strong>93.24% της ισχύος έχει μεταφερθεί στις
          sidebands</strong> (μακριά από <InlineMath>{'f_c'}</InlineMath>).
        </p>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ΕΞΕΤΑΣΗ ΙΟΥΝΙΟΥ 2025 (ΘΕΜΑ Α — 16 problems · 100%)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'jun25-th1-1',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.1',
    weight: 3,
    title: 'Σειρά συχνοτήτων: δορυφορικά, ραδιοφωνικά, τηλεοπτικά',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: [],
    statement: (
      <>
        <p>
          Τοποθετήστε με σειρά αύξουσας συχνότητας τα δορυφορικά σήματα, τα
          ραδιοφωνικά σήματα και τα τηλεοπτικά σήματα. Εξηγήστε γιατί.
        </p>
        <ReorderDrill
          prompt="Δοκίμασέ το πρώτος: βάλε τα σε σειρά αύξουσας συχνότητας (χαμηλή → υψηλή) σύροντας ή με τα βελάκια, μετά πάτα «Έλεγχος». Η αιτιολόγηση είναι στη λύση."
          items={[
            {
              id: 'radio',
              label: 'Ραδιοφωνικά σήματα',
              detail: 'AM 535 kHz–1.7 MHz · FM 88–108 MHz',
            },
            {
              id: 'tv',
              label: 'Τηλεοπτικά σήματα',
              detail: 'VHF 54–216 MHz · UHF 470–806 MHz',
            },
            {
              id: 'sat',
              label: 'Δορυφορικά σήματα',
              detail: '4–30 GHz (C, Ku, Ka bands)',
            },
          ]}
        />
      </>
    ),
    solution: (
      <>
        <p>
          Σειρά (αύξουσα): <strong>Ραδιοφωνικά → Τηλεοπτικά → Δορυφορικά</strong>.
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>AM ραδιόφωνο: 535 kHz – 1.7 MHz · FM ραδιόφωνο: 88-108 MHz</li>
          <li>Αναλογική TV: VHF (54-216 MHz) και UHF (470-806 MHz)</li>
          <li>Δορυφορικά: 4-30 GHz (C, Ku, Ka bands)</li>
        </ul>
        <p>
          Λόγος: σταθμοί χαμηλών συχνοτήτων ταξιδεύουν μεγαλύτερες
          αποστάσεις (κάμψη γύρω από εμπόδια), ενώ υψηλές συχνότητες
          απαιτούνται για μεγάλο bandwidth (TV/data). Δορυφόροι χρειάζονται
          line-of-sight και υψηλές συχνότητες για compact κεραίες.
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-2',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.2',
    weight: 3,
    title: 'Ρόλος καναλιού στο τηλεπικοινωνιακό σύστημα',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: [],
    statement: (
      <p>
        Περιγράψτε τον ρόλο του καναλιού σ' ένα τηλεπικοινωνιακό σύστημα.
        Ποια κύρια χαρακτηριστικά του σήματος επηρεάζει και γιατί;
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Μην αποστηθίζεις λίστα όρων. Σκέψου το κανάλι σαν έναν{' '}
            <em>ατελή σωλήνα</em> ανάμεσα στον πομπό και τον δέκτη — αέρας,
            χαλκός, οπτική ίνα. Ιδανικά θα έβγαζε το σήμα απείραχτο· στην
            πραγματικότητα το «ταλαιπωρεί» στον δρόμο. Για να βρεις{' '}
            <em>τι ακριβώς</em> ταλαιπωρεί, ρώτα: από τι αποτελείται ένα σήμα;
            Έχει ένα <strong>μέγεθος</strong> (πλάτος / ισχύ), ένα{' '}
            <strong>σχήμα στη συχνότητα</strong> (το φάσμα του) και έναν{' '}
            <strong>χρονισμό</strong> (φάση / καθυστέρηση). Το κανάλι μπορεί να
            πειράξει καθεμία από αυτές τις «λαβές» — και από πάνω να{' '}
            <strong>προσθέσει</strong> κάτι που δεν ήταν ποτέ εκεί: θόρυβο. Αν
            το θυμάσαι έτσι, ξαναχτίζεις όλη την απάντηση μόνος σου.
          </span>
        </div>

        <p>
          <strong>Ο ρόλος του:</strong> το κανάλι είναι το φυσικό μέσο που
          μεταφέρει το διαμορφωμένο σήμα <InlineMath>{'s(t)'}</InlineMath> από
          τον πομπό στον δέκτη. Δεν είναι ποτέ τέλειο — ό,τι φτάνει,{' '}
          <InlineMath>{'r(t)'}</InlineMath>, είναι μια παραμορφωμένη και
          θορυβώδης εκδοχή αυτού που στάλθηκε. Γι&apos; αυτό η εκτίμηση στον
          δέκτη γράφεται με «καπελάκι», <InlineMath>{'\\hat{m}(t)'}</InlineMath>:
          δεν είναι ποτέ ακριβώς το αρχικό μήνυμα.
        </p>

        <p>
          <strong>Τι επηρεάζει — και γιατί</strong> (το «γιατί» θυμάσαι, όχι τον
          όρο):
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>Το μέγεθος του σήματος</strong> — το κανάλι το{' '}
            <em>εξασθενεί</em> (attenuation). Όσο μακρύτερη η διαδρομή και όσο
            ψηλότερη η συχνότητα, τόσο λιγότερη ισχύς φτάνει — γι&apos; αυτό
            χειροτερεύει το SNR και «πέφτει» το σήμα στις μεγάλες αποστάσεις.
          </li>
          <li>
            <strong>Το σχήμα του στη συχνότητα</strong> — το κανάλι δρα σαν{' '}
            <em>φίλτρο</em>: δεν εξασθενεί όλες τις συχνότητες το ίδιο, οπότε
            αλλάζει τη μορφή του φάσματος (distortion) και περιορίζει το
            διαθέσιμο bandwidth.
          </li>
          <li>
            <strong>Τον χρονισμό του</strong> — διαφορετικές συχνότητες
            ταξιδεύουν με διαφορετική καθυστέρηση, άρα μετατοπίζεται η{' '}
            <em>φάση</em> και «μουτζουρώνεται» η κυματομορφή στον χρόνο (group
            delay distortion).
          </li>
          <li>
            <strong>Προσθέτει θόρυβο</strong> — ό,τι κι αν στείλεις, το κανάλι
            βάζει από πάνω AWGN (θερμικός θόρυβος) και παρεμβολές. Αυτό{' '}
            <em>δεν</em> ήταν στο σήμα· είναι καινούριο, και είναι ο βασικός
            εχθρός του δέκτη.
          </li>
        </ul>

        <p className="text-fg-muted">
          <strong>Στις ασύρματες ζεύξεις</strong> μπαίνει κι ένα ακόμη:{' '}
          <em>fading</em> — το κανάλι αλλάζει με τον χρόνο (κίνηση, εμπόδια,
          πολυδιαδρομική διάδοση), οπότε η εξασθένηση δεν είναι καν σταθερή.
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm text-fg-muted">
          <strong className="text-fg">Στην εξέταση:</strong> δεν χρειάζεται να
          αναπαράγεις τους όρους κατά λέξη. Αν γράψεις «το κανάλι εξασθενεί το
          σήμα, του αλλάζει το φάσμα, του χαλάει τον χρονισμό και του προσθέτει
          θόρυβο» — με δικά σου λόγια — τα έχεις πει όλα. Οι αγγλικοί όροι
          (attenuation, distortion, fading, SNR) είναι απλώς οι ετικέτες.
        </div>
      </>
    ),
  },
  {
    id: 'jun25-th1-3',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.3',
    weight: 3,
    title: 'Φασματικές συνιστώσες δ(t-T₁)',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-shift'],
    statement: (
      <p>
        Από πόσες φασματικές συνιστώσες αποτελείται το φάσμα της κρουστικής
        συνάρτησης <InlineMath>{'g(t) = \\delta(t - T_1)'}</InlineMath>;
        Εξηγήστε γιατί.
      </p>
    ),
    solution: (
      <>
        <p>
          Από <strong>άπειρες</strong> — η κρουστική περιέχει ομοιόμορφα όλες
          τις συχνότητες.
        </p>
        <BlockMath>{'\\mathcal{F}\\{\\delta(t - T_1)\\} = e^{-j 2\\pi f T_1}'}</BlockMath>
        <p>
          <InlineMath>{'|G(f)| = 1'}</InlineMath> για όλα{' '}
          <InlineMath>f</InlineMath>. Δηλαδή ομοιόμορφο φάσμα πλάτους — όλες
          οι συχνότητες με ίδιο πλάτος. Η μετατόπιση{' '}
          <InlineMath>{'T_1'}</InlineMath> εμφανίζεται μόνο ως φάση{' '}
          <InlineMath>{'-2\\pi f T_1'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-4',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.4',
    weight: 4,
    title: 'Φάσμα πλάτους + φάσης 2cos(1000πt+π/4)',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-pair-cos'],
    statement: (
      <p>
        Σχεδιάστε το φάσμα πλάτους και φάσης της συνάρτησης{' '}
        <InlineMath>{'x(t) = 2\\cos(1000\\pi t + \\pi/4)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <InlineMath>{'f_0 = 500'}</InlineMath> Hz, <InlineMath>{'A = 2'}</InlineMath>,
          φάση <InlineMath>{'\\pi/4'}</InlineMath>. Με{' '}
          <InlineMath>{'2\\cos\\theta = e^{j\\theta} + e^{-j\\theta}'}</InlineMath>:
        </p>
        <BlockMath>{'X(f) = e^{j\\pi/4}\\delta(f-500) + e^{-j\\pi/4}\\delta(f+500)'}</BlockMath>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>Φάσμα πλάτους:</strong> δύο impulses ύψους 1 στις{' '}
            <InlineMath>{'\\pm 500'}</InlineMath> Hz.
          </li>
          <li>
            <strong>Φάσμα φάσης:</strong>{' '}
            <InlineMath>{'+\\pi/4'}</InlineMath> στα 500 Hz,{' '}
            <InlineMath>{'-\\pi/4'}</InlineMath> στα -500 Hz (περιττή φάση
            για πραγματικό σήμα).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'jun25-th1-5',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.5',
    weight: 6,
    title: 'Περιοδικός τετραγωνικός παλμός — χρόνος + φάσμα',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-series-rect-pulse'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος FS συντελεστών περιοδικού παλμού{' '}
        <InlineMath>{'a_k = (A\\tau/T_0)\\,\\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>{' '}
        (fourier-series-rect-pulse, βάρος <strong>4</strong>). Το ζεύγος FT{' '}
        <InlineMath>{'\\Pi(t/\\tau) \\leftrightarrow \\tau\\,\\mathrm{sinc}(f\\tau)'}</InlineMath>{' '}
        δίνεται στο τυπολόγιο — αλλά αυτοί οι FS συντελεστές ΔΕΝ δίνονται.
        Εμφανίστηκε σε <strong>4</strong> παλιά θέματα. Βλ.{' '}
        <Link
          href="/practice#exercise:jun25-th1-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.6
        </Link>,{' '}
        <Link
          href="/practice#exercise:jun25-th1-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.8
        </Link>,{' '}
        <Link
          href="/practice#exercise:jan26-th1-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σχεδιάστε (1) το σήμα στον χρόνο και (2) το φάσμα πλάτους ενός
        περιοδικού σήματος τετραγωνικών παλμών μοναδιαίου πλάτους με περίοδο{' '}
        <InlineMath>{'T = 10'}</InlineMath> sec και πλάτος παλμού{' '}
        <InlineMath>{'\\tau = 1'}</InlineMath> sec.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>Χρόνος:</strong> Π-παλμοί ύψους 1, διάρκειας 1s, κάθε 10s.
          Duty cycle <InlineMath>{'\\tau/T = 0.1'}</InlineMath>.
        </p>
        <p>
          <strong>Φάσμα Fourier (περιοδικό):</strong> impulses στις{' '}
          <InlineMath>{'k f_0 = k/T = k/10'}</InlineMath> Hz, με συντελεστές:
        </p>
        <BlockMath>{'a_k = \\frac{\\tau}{T}\\,\\mathrm{sinc}(k\\tau/T) = 0.1\\cdot \\mathrm{sinc}(k/10)'}</BlockMath>
        <p>
          DC: <InlineMath>{'a_0 = 0.1'}</InlineMath>. Πρώτη ρίζα του sinc στα{' '}
          <InlineMath>{'k = 10'}</InlineMath> (δηλαδή στο{' '}
          <InlineMath>{'1/\\tau = 1'}</InlineMath> Hz).
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-6',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.6',
    weight: 5,
    title: 'Αν τ μεγαλώσει σε 4sec, τι αλλάζει στο φάσμα',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-series-rect-pulse'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος FS συντελεστών περιοδικού παλμού{' '}
        <InlineMath>{'a_k = (A\\tau/T_0)\\,\\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>{' '}
        (fourier-series-rect-pulse, βάρος <strong>4</strong>). Το ζεύγος FT{' '}
        <InlineMath>{'\\Pi(t/\\tau) \\leftrightarrow \\tau\\,\\mathrm{sinc}(f\\tau)'}</InlineMath>{' '}
        δίνεται στο τυπολόγιο — αλλά αυτοί οι FS συντελεστές ΔΕΝ δίνονται.
        Εμφανίστηκε σε <strong>4</strong> παλιά θέματα. Βλ.{' '}
        <Link
          href="/practice#exercise:jun25-th1-5"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.5
        </Link>,{' '}
        <Link
          href="/practice#exercise:jun25-th1-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.8
        </Link>,{' '}
        <Link
          href="/practice#exercise:jan26-th1-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Στο προηγούμενο παράδειγμα, τι θα συμβεί στο φάσμα αν το χρονικό
        πλάτος των παλμών γίνει <InlineMath>{'\\tau = 4'}</InlineMath> sec
        (ίδια <InlineMath>{'T = 10'}</InlineMath> sec);
      </p>
    ),
    solution: (
      <>
        <p>Νέοι συντελεστές:</p>
        <BlockMath>{'a_k = \\frac{4}{10}\\mathrm{sinc}(4k/10) = 0.4\\,\\mathrm{sinc}(0.4k)'}</BlockMath>
        <p>Αλλαγές:</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            DC αυξάνεται από 0.1 σε 0.4 (μεγαλύτερο duty cycle).
          </li>
          <li>
            Πρώτη ρίζα της <InlineMath>{'\\mathrm{sinc}'}</InlineMath>{' '}
            μετατοπίζεται από <InlineMath>{'k = 10'}</InlineMath> (1 Hz) στο{' '}
            <InlineMath>{'k = 2.5'}</InlineMath> (0.25 Hz). Πρακτικά οι
            ρίζες πέφτουν στα <InlineMath>{'k = 2.5, 5, 7.5,...'}</InlineMath>{' '}
            (όχι ακέραια — ο 5ος harmonic έχει <InlineMath>{'a_5 = 0'}</InlineMath>{' '}
            αν επεκτείνεις το sinc).
          </li>
          <li>
            Το envelope <strong>στενεύει</strong> (αντίστροφη σχέση{' '}
            <InlineMath>{'\\tau \\leftrightarrow B'}</InlineMath>).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'jun25-th1-7',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.7',
    weight: 4,
    title: 'Φάσμα πλάτους & φάσης Σ A_k cos(2πk f_c t + φ_k)',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    statement: (
      <p>
        Έστω σήμα βασικής ζώνης{' '}
        <InlineMath>{'x(t) = \\sum_{k=1}^{6} A_k \\cos(2\\pi k f_c t + \\phi_k)'}</InlineMath>{' '}
        με <InlineMath>{'A_k = k^2'}</InlineMath>,{' '}
        <InlineMath>{'\\phi_k = k\\pi/4'}</InlineMath>. Σχεδιάστε φάσμα
        πλάτους και φάσης.
      </p>
    ),
    solution: (
      <>
        <p>
          6 αρμονικές στις <InlineMath>{'\\pm k f_c'}</InlineMath> για{' '}
          <InlineMath>{'k = 1\\ldots 6'}</InlineMath>.
        </p>
        <p><strong>Φάσμα πλάτους</strong> (impulses ύψους <InlineMath>{'A_k/2 = k^2/2'}</InlineMath>):</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li><InlineMath>{'k = 1: 0.5'}</InlineMath></li>
          <li><InlineMath>{'k = 2: 2'}</InlineMath></li>
          <li><InlineMath>{'k = 3: 4.5'}</InlineMath></li>
          <li><InlineMath>{'k = 4: 8'}</InlineMath></li>
          <li><InlineMath>{'k = 5: 12.5'}</InlineMath></li>
          <li><InlineMath>{'k = 6: 18'}</InlineMath></li>
        </ul>
        <p>
          <strong>Φάσμα φάσης:</strong>{' '}
          <InlineMath>{'\\phi_k = k\\pi/4'}</InlineMath> στα{' '}
          <InlineMath>{'+k f_c'}</InlineMath>,{' '}
          <InlineMath>{'-k\\pi/4'}</InlineMath> στα{' '}
          <InlineMath>{'-k f_c'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-8',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.8',
    weight: 5,
    title: 'A_k για περιοδικούς τετραγωνικούς παλμούς',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-series-rect-pulse'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος FS συντελεστών περιοδικού παλμού{' '}
        <InlineMath>{'a_k = (A\\tau/T_0)\\,\\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>{' '}
        (fourier-series-rect-pulse, βάρος <strong>4</strong>). Το ζεύγος FT{' '}
        <InlineMath>{'\\Pi(t/\\tau) \\leftrightarrow \\tau\\,\\mathrm{sinc}(f\\tau)'}</InlineMath>{' '}
        δίνεται στο τυπολόγιο — αλλά αυτοί οι FS συντελεστές ΔΕΝ δίνονται.
        Εμφανίστηκε σε <strong>4</strong> παλιά θέματα. Βλ.{' '}
        <Link
          href="/practice#exercise:jun25-th1-5"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.5
        </Link>,{' '}
        <Link
          href="/practice#exercise:jun25-th1-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Εξ. Ιουν. 2025 ΘΕΜΑ 1.6
        </Link>,{' '}
        <Link
          href="/practice#exercise:jan26-th1-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Στο προηγούμενο, πόσο πρέπει να ισούνται οι συντελεστές{' '}
        <InlineMath>{'A_k'}</InlineMath> ώστε το{' '}
        <InlineMath>x(t)</InlineMath> να περιγράφει μια συνάρτηση
        περιοδικών τετραγωνικών παλμών (θεωρήστε{' '}
        <InlineMath>{'\\phi_k = 0'}</InlineMath>);
      </p>
    ),
    solution: (
      <>
        <p>
          Για περιοδικό Π-παλμό (πλάτους A, διάρκειας τ, περιόδου T) με{' '}
          <InlineMath>{'f_0 = 1/T'}</InlineMath> και χρησιμοποιώντας single-sided FS:
        </p>
        <BlockMath>{'A_k = \\frac{2A\\tau}{T}\\,\\mathrm{sinc}(k f_0 \\tau)'}</BlockMath>
        <p>
          Για να αναπαριστά τετραγωνικό παλμό{' '}
          <InlineMath>{'A_k \\propto \\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>.
          Τα μεγάλα <InlineMath>k</InlineMath> έχουν φθίνουσες τιμές, με
          ρίζες στα <InlineMath>{'k = 1/(f_0 \\tau) = T/\\tau'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-9',
    repeatGroup: 'thermal-noise-psd',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.9',
    weight: 4,
    title: 'Φασματική πυκνότητα ισχύος θερμικού θορύβου',
    topic: 'noise',
    difficulty: 'easy',
    prerequisites: ['noise/sources', 'noise/white-noise'],
    formulaIds: ['white-noise-psd', 'thermal-noise', 'bandlimited-noise-power'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Η μόνη ποσότητα που ζητάει η άσκηση — η PSD του θερμικού θορύβου{' '}
        <InlineMath>{'S_N(f) = N_0/2 = kT/2'}</InlineMath>{' '}
        (βάρος <strong>5</strong> — ανώτατο στο Noise: εμφανίστηκε σε{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:sept25-th3-10">Σεπτ.2025 ΘΕΜΑ 3.10</Link>{' '}
        κ.ά.) — λείπει από το επίσημο τυπολόγιο, όπως και ο ορισμός{' '}
        <InlineMath>{'N_0 \\triangleq kT'}</InlineMath>. Αν η εκφώνηση ζητήσει
        και ισχύ σε ζώνη, το <InlineMath>{'P_N = N_0 B'}</InlineMath>{' '}
        (βάρος <strong>5</strong>) επίσης λείπει. Το τυπολόγιο δεν
        περιέχει <em>κανέναν</em> τύπο θορύβου — ολόκληρη η ενότητα «Noise»
        είναι μνήμη. Άρα αυτή τη μία γραμμή πρέπει να την έχεις μέσα σου· δεν θα
        σου δοθεί φύλλο να την ψάξεις.{' '}
        Ειδικά ο θερμικός τύπος (formulaId <code>thermal-noise</code>, βάρος{' '}
        <strong>2</strong> — ζητήθηκε στο αδελφό θέμα{' '}
        <Link href="/practice#exercise:sept25-th3-10">Σεπτ.2025 ΘΕΜΑ 3.10</Link>{' '}
        κι εδώ) είναι στάνταρ pattern — «PSD θερμικού;» →{' '}
        <InlineMath>{'kT/2'}</InlineMath> απ' έξω.
      </>
    ),
    statement: (
      <p>
        Έστω ΤΔ <InlineMath>N(t)</InlineMath> θερμικού θορύβου. Πόση είναι η
        φασματική πυκνότητα ισχύος του;
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — γιατί η απάντηση είναι ένας σταθερός αριθμός.
          </strong>{' '}
          <span className="text-fg-muted">
            Μέσα σε κάθε αγωγό τα ηλεκτρόνια «τρέμουν» από τη θερμότητα (slide
            42): δισεκατομμύρια ανεξάρτητα, αστραπιαία τινάγματα φορτίου. Επειδή
            κάθε τίναγμα είναι απειροελάχιστο, ασυσχέτιστο με τα υπόλοιπα και
            πολύ <em>ταχύτερο</em> από οποιαδήποτε συχνότητα μάς απασχολεί, καμία
            συχνότητα δεν προτιμάται έναντι κάποιας άλλης — η ισχύς μοιράζεται{' '}
            <strong>ομοιόμορφα παντού</strong>, όπως το λευκό φως κουβαλά ίσα όλα
            τα χρώματα. Γι' αυτό λέγεται <strong>λευκός</strong> θόρυβος, και η
            PSD του δεν είναι καμπύλη αλλά ένα <strong>επίπεδο πάτωμα</strong>:
            ίδιο ύψος σε κάθε <InlineMath>f</InlineMath>. Έτσι το «πόση είναι η
            PSD;» έχει <em>μονόλεκτη</em> απάντηση — το ύψος του πατώματος,{' '}
            <InlineMath>{'kT/2'}</InlineMath> (slide 45), σταθερό μέχρι τα{' '}
            <InlineMath>{'\\sim 10^{12}'}</InlineMath> Hz (πιο ψηλά η κβαντική
            φυσική το κάμπτει, αλλά καμία εξέταση K21 δεν πάει τόσο μακριά).{' '}
            <strong>
              Και γιατί <InlineMath>{'/2'}</InlineMath>;
            </strong>{' '}
            Το πάτωμα το ζωγραφίζουμε σε <strong>όλον</strong> τον άξονα — θετικές{' '}
            <em>και</em> αρνητικές συχνότητες (η μαθηματική, δίψας-όψεως εικόνα).
            Μοιράζοντας την ίδια ισχύ σε δύο πλευρές, το ύψος κάθε πλευράς είναι
            το μισό: <InlineMath>{'N_0/2'}</InlineMath>, με{' '}
            <InlineMath>{'N_0 \\triangleq kT'}</InlineMath> (slide 47). Αν
            μετρούσες μόνο τις φυσικές (θετικές) συχνότητες — μονόπλευρα — το
            ύψος θα ήταν ολόκληρο το <InlineMath>{'N_0 = kT'}</InlineMath>:{' '}
            <strong>ίδια συνολική ισχύς, απλώς άλλο λογιστικό σύστημα.</strong>
          </span>
        </div>

        <p className="font-medium text-fg">Η απάντηση — μία γραμμή:</p>
        <BlockMath>{'S_N(f) = \\frac{N_0}{2} = \\frac{kT}{2}\\;\\text{W/Hz}\\quad(\\text{δίψας όψεως, επίπεδη}),\\qquad N_0 \\triangleq kT'}</BlockMath>

        <p>
          Πρόσεξε τι <em>δεν</em> υπάρχει στην απάντηση: ούτε{' '}
          <InlineMath>f</InlineMath>, ούτε εύρος ζώνης <InlineMath>B</InlineMath>.
          Η PSD εξαρτάται <strong>μόνο</strong> από τη θερμοκρασία{' '}
          <InlineMath>T</InlineMath> (ζεστότερος αγωγός → ψηλότερο πάτωμα). Το
          εύρος ζώνης το «νιώθει» μόνο η <em>συνολική ισχύς</em> — το εμβαδόν
          κάτω από το πάτωμα — όχι η ίδια η PSD, κι αυτό είναι ξεχωριστή ερώτηση.
          Εδώ ζητείται σκέτη η PSD: γράψε τη μία γραμμή και προχώρα.
        </p>

        <p className="text-sm text-fg-muted">
          Αν η εκφώνηση συνεχίσει σε «ισχύ σε ζώνη <InlineMath>B</InlineMath>»
          (<InlineMath>{'P_N = kTB = N_0 B'}</InlineMath>) ή ζητήσει το room-temp
          νούμερο <InlineMath>{'-174'}</InlineMath> dBm/Hz, η πλήρης απαγωγή —
          γιατί βγαίνει <InlineMath>{'kTB'}</InlineMath> κι όχι{' '}
          <InlineMath>{'kTB/2'}</InlineMath>, και η παγίδα one-sided/two-sided
          πίσω από το <InlineMath>{'-174'}</InlineMath> — ζει στο αδελφό θέμα{' '}
          <strong>Σεπτ. 2025 ΘΕΜΑ 3.10</strong>· δεν την επαναλαμβάνουμε εδώ. Η
          θεωρία ζει στο{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §2
          </Link>{' '}
          (η PSD) και στο{' '}
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources
          </Link>{' '}
          (θερμική προέλευση §2, <InlineMath>{'kT/2'}</InlineMath> &{' '}
          <InlineMath>{'kTB'}</InlineMath> §5, το{' '}
          <InlineMath>{'-174'}</InlineMath> dBm/Hz §8).
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th1-10',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 1.10',
    weight: 13,
    title: 'Λευκός θόρυβος μέσα από LPF + HPF',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/through-filters'],
    formulaIds: ['white-noise-psd', 'lti-output-psd', 'bandlimited-noise-power', 'bandlimited-noise-autocorr', 'wiener-khinchin'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Κανέναν από τους τύπους της άσκησης δεν θα βρεις στο επίσημο
        τυπολόγιο:{' '}
        <InlineMath>{'S_N(f) = N_0/2'}</InlineMath>{' '}
        (βάρος <strong>5</strong> — ανώτατο στο Noise: εμφανίστηκε σε{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:sept25-th3-10">Σεπτ.2025 ΘΕΜΑ 3.10</Link>{' '}
        κ.ά.),{' '}
        <InlineMath>{'S_Y(f) = |H(f)|^2 S_N(f)'}</InlineMath>{' '}
        (βάρος <strong>3</strong>:{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>{' '}
        κ.ά.),{' '}
        <InlineMath>{'P_N = N_0 B'}</InlineMath>{' '}
        (βάρος <strong>5</strong>:{' '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        {' · '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>{' '}
        κ.ά.) και{' '}
        <InlineMath>{'R_N(\\tau) = N_0 B\\,\\mathrm{sinc}(2B\\tau)'}</InlineMath>{' '}
        (βάρος <strong>1</strong> — μόνο αυτό το θέμα στην παρούσα τράπεζα). Το
        ζεύγος rect↔sinc βρίσκεται στο τυπολόγιο, αλλά η εφαρμογή στον θόρυβο
        δεν — τη γράφεις απέξω.{' '}
        Επίσης, το βήμα{' '}
        <InlineMath>{'R_Y(\\tau) = \\mathcal{F}^{-1}\\{S_Y(f)\\}'}</InlineMath>{' '}
        (αντίστροφη Wiener-Khinchin — εκτός τυπολογίου, βάρος{' '}
        <strong>3</strong>:{' '}
        <Link href="/practice#exercise:proodos26-6">Πρόοδος Απρ.2026 ΘΕΜΑ 6</Link>
        {' · '}
        <Link href="/practice#exercise:sept25-th3-11">Σεπτ.2025 ΘΕΜΑ 3.11</Link>
        κ.ά.).
      </>
    ),
    statement: (
      <p>
        Για τον προηγούμενο θερμικό θόρυβο, θεωρήστε ότι εισέρχεται σε ένα
        βαθυπερατό φίλτρο με συχνότητα αποκοπής <InlineMath>{'f_c = W'}</InlineMath>{' '}
        και ένα υψιπερατό φίλτρο με συχνότητα αποκοπής{' '}
        <InlineMath>{'f_c = 10W'}</InlineMath>. Σχεδιάστε (1) το φάσμα εξόδου
        στα δύο φίλτρα και (2) τη χρονική απόκριση του θορύβου στην έξοδο
        των φίλτρων.
      </p>
    ),
    solution: (
      <>
        <p>(1) Φάσμα εξόδου:</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>LPF:</strong> rect στις{' '}
            <InlineMath>{'|f| \\leq W'}</InlineMath> με ύψος{' '}
            <InlineMath>{'N_0/2'}</InlineMath>. Τα υπόλοιπα 0.
          </li>
          <li>
            <strong>HPF:</strong> δύο rects στις{' '}
            <InlineMath>{'|f| \\geq 10W'}</InlineMath> με ύψος{' '}
            <InlineMath>{'N_0/2'}</InlineMath> (μέχρι το άπειρο — μη
            φυσικό· πρακτικά μέχρι το BW του δέκτη).
          </li>
        </ul>
        <p>(2) Autocorrelation:</p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>LPF:</strong>{' '}
            <InlineMath>{'R_Y(\\tau) = N_0 W \\mathrm{sinc}(2W\\tau)'}</InlineMath>{' '}
            — sinc, πρώτη ρίζα στο <InlineMath>{'1/(2W)'}</InlineMath>.
          </li>
          <li>
            <strong>HPF:</strong> Δ-spike μείον bandlimited (πρακτικά
            <InlineMath>{'\\delta(\\tau)'}</InlineMath> μείον slow sinc) —
            <em>«γρήγορος» θόρυβος</em>, μικρή μνήμη.
          </li>
        </ul>
        <p>
          Output ισχύς: <InlineMath>{'P_Y^{LPF} = N_0 W'}</InlineMath>·{' '}
          <InlineMath>{'P_Y^{HPF}'}</InlineMath> εξαρτάται από το άνω cutoff
          του HPF (θεωρητικά άπειρη — προφανώς μη φυσικό για ιδανικό HPF).
        </p>
      </>
    ),
  },
  {
    id: 'jun25-th2',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 2',
    weight: 25,
    title: 'AM Multiplexing — sinc(Wt) DSB-SC + sinc(6Wt) συμβατικό AM (μικτό FDM)',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/multiplexing', 'am/dsb-sc', 'am/conventional', 'am/modulator-demodulator'],
    formulaIds: ['dsb-sc-signal', 'am-signal', 'fourier-pair-rect', 'fdm-spacing', 'signal-energy', 'parseval'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος AM{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική),
        ο τύπος DSB-SC{' '}
        <InlineMath>{'x_{DSB}(t) = A_c\\,m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (σε <strong>5</strong>), και η συνθήκη μη-επικάλυψης FDM{' '}
        <InlineMath>{'\\Delta f \\ge 2W'}</InlineMath> για DSB-SC /{' '}
        <InlineMath>{'\\Delta f \\ge W'}</InlineMath> για SSB{' '}
        (σε <strong>4</strong>). Το ζεύγος Fourier (rect↔sinc) βρίσκεται στο τυπολόγιο — δεν χρειάζεται να το θυμάσαι. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:pb25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 3
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.{' '}
        Επίσης: ο τύπος ενέργειας{' '}
        <InlineMath>{'\\mathcal{E}_x = \\int_{-\\infty}^{\\infty} |x(t)|^2\\,dt'}</InlineMath>{' '}
        (βάρος 2, δεν δίνεται στο τυπολόγιο) — χρησιμοποιείται στο sub-q (4) για τη συνολική
        ενέργεια του πολυπλεγμένου σήματος (ορθογώνιοι φέροντες → αθροίζεις ενέργειες). Βλ. επίσης{' '}
        <Link
          href="/practice#exercise:pb25-th4-nonlinear"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 4
        </Link>.{' '}
        Τέλος: ο τύπος Parseval{' '}
        <InlineMath>{'\\int |x|^2\\,dt = \\int |X|^2\\,df'}</InlineMath>{' '}
        (parseval, βάρος <strong>1</strong>, δεν δίνεται στο τυπολόγιο — το τυπολόγιο
        έχει μόνο Hilbert energy equality) — χρησιμοποιείται στο sub-q (4) για τον
        υπολογισμό ενέργειας του{' '}
        <InlineMath>{'\\mathrm{sinc}(Wt)'}</InlineMath>{' '}
        μέσω του rect spectrum.
      </>
    ),
    statement: (
      <p>
        Έστω τα δυο βασικά σήματα πληροφορίας{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
        <InlineMath>{'k(t) = \\mathrm{sinc}(6Wt)'}</InlineMath>. Το{' '}
        <InlineMath>{'m(t)'}</InlineMath> διαμορφώνεται κατά{' '}
        <strong>AM-DSB-SC</strong> με φέρον <InlineMath>{'f_1'}</InlineMath> και το{' '}
        <InlineMath>{'k(t)'}</InlineMath> διαμορφώνεται κατά <strong>AM-DSB</strong> με φέρον{' '}
        <InlineMath>{'f_2 = n f_1'}</InlineMath> αντίστοιχα.{' '}
        <strong>(1)</strong> Διατυπώστε τη μαθηματική περιγραφή κάθε διαμορφωμένου σήματος
        και <strong>αποτυπώστε σχηματικά</strong> το φάσμα πλάτους των διαμορφωμένων σημάτων.{' '}
        <strong>(2)</strong> Τα δυο σήματα πολυπλέκονται (προστίθενται) σ' έναν πολυπλέκτη.
        Πόσο πρέπει να είναι το <InlineMath>{'n'}</InlineMath> για να μην συμπέσουν φασματικά;{' '}
        <strong>(3)</strong> <strong>Αποτυπώστε σχηματικά</strong> τη φασματική απόκριση του
        πολυπλεγμένου σήματος. <strong>(4)</strong> Υπολογίστε τη συνολική ενέργεια του
        πολυπλεγμένου σήματος. <strong>(5)</strong> Για την αποδιαμόρφωση, διατίθεται μόνο
        ένας ανιχνευτής περιβάλλουσας και ένα ζωνοπερατό φίλτρο. Είναι δυνατόν να
        ανιχνεύσουμε κάποιο από τα δύο σήματα; Αιτιολογήστε. <strong>(6)</strong>{' '}
        <strong>Σχεδιάστε</strong> το σχετικό κύκλωμα στον δέκτη και περιγράψτε τα
        χαρακτηριστικά του ζωνοπερατού φίλτρου.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — δύο μηνύματα, ένας δίαυλος, αλλά σταλμένα επίτηδες με δύο
            διαφορετικούς τρόπους.
          </strong>{' '}
          <span className="text-fg-muted">
            Το <InlineMath>{'m'}</InlineMath> πάει <strong>DSB-SC</strong> (κατεσταλμένο φέρον):
            ξοδεύει <em>κάθε βατ σε πληροφορία</em>, αλλά απαιτεί έξυπνο («σύμφωνο») δέκτη. Το{' '}
            <InlineMath>{'k'}</InlineMath> πάει <strong>συμβατικό AM</strong> (το «AM-DSB» χωρίς
            το «SC» = <em>με</em> φέρουσα): κρατάει μια καθαρή φέρουσα-τόνο που{' '}
            <em>δεν κουβαλά καμία πληροφορία</em> — σπατάλη ισχύος — αλλά σε αντάλλαγμα τον
            διαβάζει <em>οποιοσδήποτε φτηνός ανιχνευτής περιβάλλουσας</em>. Αυτή η{' '}
            <strong>γραμμή-φέρουσα</strong> στο φάσμα (μια ψηλή ακίδα στο{' '}
            <InlineMath>{'f_2'}</InlineMath>) είναι το <em>ορατό δακτυλικό αποτύπωμα</em> αυτής
            της ανταλλαγής: καθαρό κόστος, καθαρή ευκολία. Όλο το θέμα είναι να{' '}
            <strong>διαβάσεις αυτό το αποτύπωμα στο φάσμα</strong>, να στοιβάξεις τα δύο κανάλια
            ώστε να μην τέμνονται, και να παρατηρήσεις ότι <em>μόνο</em> το κανάλι με τη φέρουσα
            επιβιώνει σε έναν «χαζό» δέκτη.
          </span>
        </div>

        <p>
          <strong>(0) Τα δύο βασικά φάσματα — sinc στον χρόνο, rect στη συχνότητα.</strong> Και
          τα δύο μηνύματα είναι <InlineMath>{'\\mathrm{sinc}'}</InlineMath> στον χρόνο, οπότε από
          το ζεύγος <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath> του
          τυπολογίου ο μετασχηματισμός τους είναι <strong>καθαρό rect</strong> (τούβλο):
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath>
            </strong>{' '}
            →{' '}
            <InlineMath>{'M(f) = \\tfrac{1}{W}\\,\\Pi\\!\\left(\\tfrac{f}{W}\\right)'}</InlineMath>,
            δηλ. rect στο <InlineMath>{'|f| \\le W/2'}</InlineMath> —{' '}
            <strong>μισό-εύρος <InlineMath>{'W/2'}</InlineMath></strong>.
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\mathrm{sinc}(6Wt)'}</InlineMath>
            </strong>{' '}
            →{' '}
            <InlineMath>{'K(f) = \\tfrac{1}{6W}\\,\\Pi\\!\\left(\\tfrac{f}{6W}\\right)'}</InlineMath>,
            δηλ. rect στο <InlineMath>{'|f| \\le 3W'}</InlineMath> —{' '}
            <strong>μισό-εύρος <InlineMath>{'3W'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> το <InlineMath>{'k'}</InlineMath> είναι 6× πιο{' '}
          <em>συμπιεσμένο στον χρόνο</em> (το <InlineMath>{'6Wt'}</InlineMath>), άρα 6× πιο{' '}
          <em>πλατύ στη συχνότητα</em> — μισό-εύρος <InlineMath>{'3W'}</InlineMath> έναντι{' '}
          <InlineMath>{'W/2'}</InlineMath>. Κράτα αυτή την <strong>ανισότητα των ευρών</strong>:
          θα κρίνει τη συνθήκη μη-επικάλυψης στο (2). Πρόσεξε επίσης ότι, επειδή και τα δύο
          είναι <em>γνήσια rect</em>, είναι <strong>αυστηρά bandlimited</strong> (καμία ουρά που
          απλώνεται — οι ακμές στο σχέδιο είναι ακριβείς, όχι αποκοπή).
        </p>

        <p>
          <strong>(1) Μαθηματική περιγραφή + φάσμα πλάτους — και η γραμμή-φέρουσα.</strong> Το
          «AM-DSB-SC» και το «AM-DSB» διαφέρουν σε μία μόνο λέξη — το <em>SC</em> (suppressed
          carrier) — και αυτή η λέξη είναι όλη η ουσία:
        </p>
        <BlockMath>{'x_m(t) = m(t)\\cos(2\\pi f_1 t)'}</BlockMath>
        <p className="-mt-2 text-sm text-fg-muted">
          DSB-SC: <em>κατεσταλμένη</em> φέρουσα — απλός πολλαπλασιασμός με{' '}
          <InlineMath>{'\\cos'}</InlineMath>, χωρίς προστιθέμενη σταθερά.
        </p>
        <BlockMath>{'x_k(t) = [A_c + k(t)]\\cos(2\\pi f_2 t)'}</BlockMath>
        <p className="-mt-2 text-sm text-fg-muted">
          Συμβατικό AM: το <InlineMath>{'+A_c'}</InlineMath> είναι ένα{' '}
          <strong>σταθερό «βάθρο» (pedestal)</strong> πάνω στο μήνυμα — αυτό είναι όλη η διαφορά.
        </p>
        <p>
          Με το θεώρημα διαμόρφωσης (πολλαπλασιασμός με{' '}
          <InlineMath>{'\\cos(2\\pi f_c t)'}</InlineMath> ⇒ <em>αντίγραφο</em> του φάσματος στα{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath> με μισό ύψος):
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'X_m(f)'}</InlineMath>:
            </strong>{' '}
            δύο rect στα <InlineMath>{'\\pm f_1'}</InlineMath>, μισό-εύρος{' '}
            <InlineMath>{'W/2'}</InlineMath> (πλήρες πλάτος ζώνης{' '}
            <InlineMath>{'W'}</InlineMath>), <strong>καμία γραμμή φέροντος</strong>.
          </li>
          <li>
            <strong>
              <InlineMath>{'X_k(f)'}</InlineMath>:
            </strong>{' '}
            δύο rect στα <InlineMath>{'\\pm f_2'}</InlineMath>, μισό-εύρος{' '}
            <InlineMath>{'3W'}</InlineMath> (πλήρες πλάτος ζώνης{' '}
            <InlineMath>{'6W'}</InlineMath>), <strong>συν μια κρουστική γραμμή (δ-ακίδα)</strong>{' '}
            στα <InlineMath>{'\\pm f_2'}</InlineMath> βάρους <InlineMath>{'A_c/2'}</InlineMath>.
          </li>
        </ul>
        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Γιατί το συμβατικό AM δείχνει γραμμή-φέρουσα και το DSB-SC όχι — η καρδιά του θέματος.
          </strong>{' '}
          <span className="text-fg-muted">
            Η σταθερά <InlineMath>{'A_c'}</InlineMath> «καβαλάει» τη φέρουσα:{' '}
            <InlineMath>{'A_c\\cos(2\\pi f_2 t)'}</InlineMath> είναι ένας <em>καθαρός τόνος</em>,
            και ο μετασχηματισμός ενός τόνου είναι μια <strong>δ-ακίδα στα{' '}
            <InlineMath>{'\\pm f_2'}</InlineMath></strong>. Το DSB-SC δεν έχει τέτοια σταθερά
            (κατεσταλμένη) ⇒ <strong>καμία γραμμή</strong>. <strong>Πού πάει η ισχύς της
            φέρουσας;</strong> Όλη σε αυτή τη γραμμή — μια φασματική ακίδα με{' '}
            <em>μηδέν πληροφορία</em>. <strong>Τι κοστίζει;</strong> Στο συμβατικό AM η φέρουσα
            τραβά συχνά το <em>μεγαλύτερο μέρος</em> της ισχύος (υπάρχει μόνο για να φτηναίνει τον
            δέκτη). Το DSB-SC αρνείται να την πληρώσει — γι' αυτό είναι αποδοτικότερο, με κόστος
            έναν πιο σύνθετο δέκτη. Όταν λοιπόν δεις <strong>ψηλή ακίδα στο φέρον</strong> ⇒
            «συμβατικό AM, αποδιαμορφώνεται με περιβάλλουσα»· όταν δεις <strong>μόνο πλευρικές</strong>{' '}
            ⇒ «DSB-SC, θέλει σύμφωνη αποδιαμόρφωση».
          </span>
        </div>

        <p>
          <strong>(2) Πόσο πρέπει να είναι το <InlineMath>{'n'}</InlineMath> — χτισμένο από τα
          πραγματικά bands, όχι αποστηθισμένο.</strong> Πάρε{' '}
          <InlineMath>{'f_1 < f_2'}</InlineMath> (το στενό <InlineMath>{'m'}</InlineMath> από
          κάτω). Το κανάλι 1 πιάνει <InlineMath>{'[f_1 - \\tfrac{W}{2},\\, f_1 + \\tfrac{W}{2}]'}</InlineMath>·
          το κανάλι 2 πιάνει <InlineMath>{'[f_2 - 3W,\\, f_2 + 3W] = [n f_1 - 3W,\\, n f_1 + 3W]'}</InlineMath>.{' '}
          Η <strong>γραμμή-φέρουσα κάθεται ΑΚΡΙΒΩΣ στο <InlineMath>{'f_2'}</InlineMath></strong> —{' '}
          <em>μέσα</em> στη ζώνη του <InlineMath>{'k'}</InlineMath>, οπότε <strong>δεν την
          πλαταίνει</strong> (ένα σημείο μέσα στο rect). Μη-επικάλυψη = η{' '}
          <em>δεξιά ακμή του κάτω</em> να μην περάσει την <em>αριστερή ακμή του πάνω</em>:
        </p>
        <BlockMath>{'f_1 + \\tfrac{W}{2} \\;\\le\\; n f_1 - 3W \\quad\\Longrightarrow\\quad (n-1)\\,f_1 \\ge \\tfrac{7W}{2} \\quad\\Longrightarrow\\quad \\boxed{\\,n \\ge 1 + \\dfrac{7W}{2 f_1}\\,}'}</BlockMath>
        <p>
          <strong>Γιατί <InlineMath>{'\\tfrac{7W}{2}'}</InlineMath> και όχι ένα έτοιμο{' '}
          <InlineMath>{'2W'}</InlineMath>.</strong> Ο γενικός κανόνας είναι πάντα ο ίδιος:{' '}
          <em>ελάχιστο κενό φερόντων = (μισό-εύρος κάτω) + (μισό-εύρος πάνω)</em>. Εδώ{' '}
          <InlineMath>{'\\tfrac{W}{2} + 3W = \\tfrac{7W}{2}'}</InlineMath> — δηλαδή{' '}
          <InlineMath>{'\\Delta f = f_2 - f_1 \\ge \\tfrac{7W}{2}'}</InlineMath>. Ο σχολικός{' '}
          <InlineMath>{'2W'}</InlineMath> είναι <em>μόνο</em> η ισο-εύρη ειδική περίπτωση
          (<InlineMath>{'W + W'}</InlineMath>)· εδώ τα εύρη είναι πολύ <em>άνισα</em> (το{' '}
          <InlineMath>{'k'}</InlineMath> 6× πλατύτερο), άρα <InlineMath>{'\\tfrac{7W}{2}'}</InlineMath>.{' '}
          <strong>Μην γράψεις μηχανικά <InlineMath>{'2W'}</InlineMath></strong> — χτίσε το από τα
          δύο μισά-εύρη και θα έχεις δίκιο για οποιαδήποτε σήματα. Επειδή{' '}
          <InlineMath>{'f_2 = n f_1'}</InlineMath>, η απάντηση είναι συνθήκη στο{' '}
          <InlineMath>{'n'}</InlineMath> και <em>εξαρτάται από το <InlineMath>{'f_1/W'}</InlineMath></em>:
          όσο μεγαλύτερο το <InlineMath>{'f_1'}</InlineMath> ως προς <InlineMath>{'W'}</InlineMath>,
          τόσο πιο κοντά στο 1 αρκεί να είναι το <InlineMath>{'n'}</InlineMath>.
        </p>
        <p>
          <strong>Και κάθε φέρον να μη διπλώσει στο DC.</strong> Το αντίγραφο στο{' '}
          <InlineMath>{'+f_1'}</InlineMath> και το κατοπτρικό στο{' '}
          <InlineMath>{'-f_1'}</InlineMath> δεν πρέπει να ακουμπήσουν στο μηδέν: χρειάζεται{' '}
          <InlineMath>{'f_1 \\ge \\tfrac{W}{2}'}</InlineMath>. Για το{' '}
          <InlineMath>{'k'}</InlineMath> αντίστοιχα <InlineMath>{'f_2 \\ge 3W'}</InlineMath>, που
          ικανοποιείται <em>αυτόματα</em> (αν <InlineMath>{'f_1 \\ge \\tfrac{W}{2}'}</InlineMath>{' '}
          τότε <InlineMath>{'f_2 \\ge f_1 + \\tfrac{7W}{2} \\ge 4W'}</InlineMath>). Άρα η{' '}
          <em>δεσμευτική</em> απάντηση: <InlineMath>{'f_1 \\ge \\tfrac{W}{2}'}</InlineMath> και{' '}
          <InlineMath>{'n \\ge 1 + \\tfrac{7W}{2 f_1}'}</InlineMath> (συν ~10–20% guard band για
          τα μη-ιδανικά φίλτρα).
        </p>

        <p>
          <strong>(3) Η φασματική απόκριση του πολυπλεγμένου{' '}
          <InlineMath>{'G(f)'}</InlineMath>.</strong> Απλό άθροισμα{' '}
          <InlineMath>{'G(f) = X_m(f) + X_k(f)'}</InlineMath>: το{' '}
          <em>στενό rect-ζευγάρι</em> του <InlineMath>{'m'}</InlineMath> γύρω από{' '}
          <InlineMath>{'\\pm f_1'}</InlineMath> (καμία γραμμή) και το{' '}
          <em>πλατύ rect-ζευγάρι</em> του <InlineMath>{'k'}</InlineMath> γύρω από{' '}
          <InlineMath>{'\\pm f_2'}</InlineMath> <strong>με τις δύο γραμμές-φέρουσες</strong> στα{' '}
          <InlineMath>{'\\pm f_2'}</InlineMath>, δίπλα-δίπλα. Με{' '}
          <InlineMath>{'\\Delta f \\ge \\tfrac{7W}{2}'}</InlineMath> δεν αγγίζονται ⇒ καθαρή
          αποπολυπλεξία· κάτω από αυτό ⇒ επικάλυψη ⇒ crosstalk.
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — ιδανικεύσεις.</strong> Εδώ{' '}
          <em>και τα δύο</em> φάσματα είναι γνήσια rect, άρα <strong>αυστηρά bandlimited</strong>{' '}
          (σε αντίθεση με μηνύματα τύπου <InlineMath>{'\\Pi'}</InlineMath>-στον-χρόνο, που δίνουν
          sinc με ατέλειωτες ουρές) — οι ακμές στο σχέδιο είναι <em>ακριβείς</em>. Η{' '}
          <strong>γραμμή-φέρουσα σχεδιάζεται ως ψηλό βέλος</strong>, αλλά παριστάνει μια{' '}
          <InlineMath>{'\\delta'}</InlineMath> (κρουστική: μηδενικό πλάτος, πεπερασμένο εμβαδόν{' '}
          <InlineMath>{'A_c/2'}</InlineMath>) — διάβασέ την ως <em>γραμμή</em>, όχι ως μπλοκ. Το
          ότι η διαμόρφωση «μισεύει» καθαρά την ενέργεια ισχύει για{' '}
          <InlineMath>{'f_1, f_2 \\gg W'}</InlineMath> (οι όροι διπλής συχνότητας σβήνουν) — το
          ίδιο καθεστώς που ήδη υποθέτει το (2). Το σχέδιο είναι <strong>σχηματικό</strong>: τα{' '}
          <InlineMath>{'f_1, f_2'}</InlineMath> αυθαίρετα, άξονες σε σχετικές μονάδες του{' '}
          <InlineMath>{'W'}</InlineMath>, με <InlineMath>{'f_2 = n f_1'}</InlineMath>.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz
            mBW={0.5}
            kBW={3}
            kShape="rect"
            kMod="am-conventional"
            initialMod="dsb"
          />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>. Πάνω:{' '}
            <InlineMath>{'M(f)'}</InlineMath> = το <strong>στενό</strong> rect στο{' '}
            <InlineMath>{'[-W/2, W/2]'}</InlineMath> (bracket «<InlineMath>{'W'}</InlineMath>» = πλήρες
            πλάτος)· από κάτω <InlineMath>{'K(f)'}</InlineMath> = το <strong>πλατύ</strong> rect στο{' '}
            <InlineMath>{'[-3W, 3W]'}</InlineMath> (bracket «<InlineMath>{'6W'}</InlineMath>»). Στο
            διαμορφωμένο, το <InlineMath>{'m'}</InlineMath> (DSB-SC) δίνει{' '}
            <strong>δύο πλευρικές χωρίς γραμμή</strong> στα <InlineMath>{'\\pm f_1'}</InlineMath>, ενώ
            το <InlineMath>{'k'}</InlineMath> (συμβατικό AM) δίνει δύο πλευρικές{' '}
            <strong>συν μια ψηλή ακίδα-φέρουσα</strong> στα <InlineMath>{'\\pm f_2'}</InlineMath> — αυτό
            ακριβώς το βέλος είναι η <InlineMath>{'\\delta'}</InlineMath> της φέρουσας, η οπτική
            απάντηση του (1). Σύρε την απόσταση <InlineMath>{'\\Delta f'}</InlineMath>: η ένδειξη
            «ελάχιστο» δείχνει <InlineMath>{'W_m + W_k = 3.5W'}</InlineMath> (δηλαδή{' '}
            <InlineMath>{'\\tfrac{W}{2} + 3W = \\tfrac{7W}{2}'}</InlineMath>) — ακριβώς η συνθήκη{' '}
            <InlineMath>{'\\Delta f = f_2 - f_1 \\ge \\tfrac{7W}{2}'}</InlineMath> του (2)· κάτω από
            αυτό η ζώνη στο <InlineMath>{'G(f)'}</InlineMath> γίνεται κόκκινη (crosstalk). Σημείωση: το
            κανάλι <InlineMath>{'k'}</InlineMath> κρατά τη γραμμή-φέρουσα{' '}
            <em>ό,τι κι αν δείχνει ο διακόπτης</em> (το συμβατικό AM είναι εγγενώς φέρουσα + δύο
            πλευρικές)· ο διακόπτης εναλλάσσει μόνο το <InlineMath>{'m'}</InlineMath> μεταξύ DSB-SC
            και μιας υποθετικής USSB μορφής.
          </figcaption>
        </figure>

        <p>
          <strong>(4) Συνολική ενέργεια — και γιατί η φέρουσα την τινάζει στο άπειρο.</strong> Με
          Parseval, ενέργεια = το εμβαδόν του <InlineMath>{'|G(f)|^2'}</InlineMath>. Οι{' '}
          <em>τρεις</em> φασματικές περιοχές — τα rect του <InlineMath>{'m'}</InlineMath> γύρω από{' '}
          <InlineMath>{'\\pm f_1'}</InlineMath>, τα rect του <InlineMath>{'k'}</InlineMath> γύρω από{' '}
          <InlineMath>{'\\pm f_2'}</InlineMath>, και η δ-φέρουσα στα{' '}
          <InlineMath>{'\\pm f_2'}</InlineMath> — είναι <strong>ξένες</strong>, οπότε οι ενέργειες{' '}
          <em>προστίθενται</em> (με μοναδιαία πλάτη φερόντων):
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            κανάλι <InlineMath>{'m'}</InlineMath> (DSB-SC):{' '}
            <InlineMath>{'\\mathcal{E}_m = \\tfrac{1}{2}\\!\\int \\mathrm{sinc}^2(Wt)\\,dt = \\tfrac{1}{2}\\cdot\\tfrac{1}{W} = \\tfrac{1}{2W}'}</InlineMath>{' '}
            — πεπερασμένη, 100% πληροφορία.
          </li>
          <li>
            πλευρικές του <InlineMath>{'k'}</InlineMath>:{' '}
            <InlineMath>{'\\tfrac{1}{2}\\!\\int \\mathrm{sinc}^2(6Wt)\\,dt = \\tfrac{1}{2}\\cdot\\tfrac{1}{6W} = \\tfrac{1}{12W}'}</InlineMath>{' '}
            — πεπερασμένη.
          </li>
          <li>
            φέρουσα του <InlineMath>{'k'}</InlineMath>: μια δ στο φάσμα ⇒{' '}
            <InlineMath>{'\\int|\\cdot|^2'}</InlineMath> <strong>αποκλίνει</strong>· ισοδύναμα ο
            τόνος <InlineMath>{'A_c\\cos(2\\pi f_2 t)'}</InlineMath> είναι αιώνιος ⇒{' '}
            <strong>άπειρη ενέργεια</strong>.
          </li>
        </ul>
        <BlockMath>{'\\mathcal{E} = \\underbrace{\\tfrac{1}{2W} + \\tfrac{1}{12W}}_{=\\,7/12W} \\;+\\; \\underbrace{\\infty}_{\\text{carrier}} \\;=\\; \\infty'}</BlockMath>
        <p>
          <strong>Με απλά λόγια — και αυτό είναι το ποσοτικό πρόσωπο του «τι κοστίζει η
          φέρουσα».</strong> Η συνολική ενέργεια είναι <em>τυπικά άπειρη</em>, και η μοναδική αιτία
          είναι η φέρουσα: ένας τόνος που δεν σβήνει ποτέ. Η{' '}
          <em>πληροφοριακή</em> ενέργεια είναι πεπερασμένη —{' '}
          <InlineMath>{'\\tfrac{7}{12W}'}</InlineMath> — αλλά η αιώνια φέρουσα τινάζει το{' '}
          κυριολεκτικό σύνολο στο άπειρο. Το DSB-SC κρατά την ενέργειά του πεπερασμένη και όλη
          πληροφορία· το συμβατικό AM ξοδεύει απεριόριστη ενέργεια σε έναν τόνο, μόνο και μόνο για
          να δουλεύει ένας φτηνός δέκτης (βλ. (5)). <strong>Τίμια:</strong> αν το θέμα περιμένει
          έναν πεπερασμένο αριθμό, εννοεί την πληροφοριακή{' '}
          <InlineMath>{'\\tfrac{7}{12W}'}</InlineMath>· η κυριολεκτική «συνολική ενέργεια» ενός
          σήματος με φέρουσα είναι μη-φραγμένη — <em>ονόμασε τη φέρουσα ως την αιτία</em> αντί να
          την κρύψεις.
        </p>

        <p>
          <strong>(5) Με μόνο έναν ανιχνευτή περιβάλλουσας + BPF — ποιο σώζεται;</strong> Μόνο το{' '}
          <InlineMath>{'x_k'}</InlineMath> (συμβατικό AM). Ο ανιχνευτής περιβάλλουσας βγάζει τη{' '}
          <em>(θετική) περιβάλλουσα</em>· για το <InlineMath>{'x_k'}</InlineMath> αυτή είναι{' '}
          <InlineMath>{'A_c + k(t)'}</InlineMath>, και <strong>εφόσον{' '}
          <InlineMath>{'A_c \\ge \\max|k(t)|'}</InlineMath></strong> (δηλ.{' '}
          <InlineMath>{'\\mu \\le 1'}</InlineMath>) μένει <InlineMath>{'\\ge 0'}</InlineMath> — οπότε
          η περιβάλλουσα ταυτίζεται με το <InlineMath>{'A_c + k(t)'}</InlineMath> και ένα DC-block
          αφαιρεί το <InlineMath>{'A_c'}</InlineMath> ⇒ ανακτάς το{' '}
          <InlineMath>{'k(t)'}</InlineMath>.
        </p>
        <p>
          Το <InlineMath>{'x_m'}</InlineMath> (DSB-SC) <strong>δεν</strong> ανιχνεύεται έτσι: χωρίς
          φέρουσα-«πιλότο», η περιβάλλουσά του είναι <InlineMath>{'|m(t)|'}</InlineMath> — ο
          ανορθωτής <em>διπλώνει</em> το αρνητικό μισό και <strong>χάνει το πρόσημο</strong> του{' '}
          <InlineMath>{'m'}</InlineMath> ⇒ ανεπανόρθωτη παραμόρφωση. Χρειάζεται{' '}
          <em>σύμφωνη (synchronous) αποδιαμόρφωση</em> (×<InlineMath>{'\\cos(2\\pi f_1 t)'}</InlineMath>{' '}
          + LPF), που εδώ δεν διατίθεται. <strong>Αυτός ακριβώς είναι ο λόγος που θα πλήρωνες ποτέ
          το κόστος της φέρουσας</strong> (1)/(4): η φέρουσα είναι ο πιλότος που «καβαλάει» ο
          ανιχνευτής περιβάλλουσας. Άρα: ανακτάς το <strong><InlineMath>{'k'}</InlineMath></strong>,{' '}
          <em>όχι</em> το <InlineMath>{'m'}</InlineMath>.
        </p>

        <p>
          <strong>(6) Το κύκλωμα του δέκτη + το BPF.</strong> Αφού μόνο το{' '}
          <InlineMath>{'k'}</InlineMath> σώζεται, ο δέκτης απομονώνει τη ζώνη του{' '}
          <InlineMath>{'f_2'}</InlineMath> και βγάζει την περιβάλλουσα:
        </p>
        <div className="my-3 flex flex-wrap items-center gap-2 rounded-md border border-border bg-bg-soft/40 px-3 py-3 text-xs font-medium">
          <span className="rounded border border-border bg-bg-elevated px-2 py-1">📡 Κεραία</span>
          <span className="text-fg-subtle">→</span>
          <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1">
            BPF: κέντρο <InlineMath>{'f_2'}</InlineMath>, BW <InlineMath>{'6W'}</InlineMath>
          </span>
          <span className="text-fg-subtle">→</span>
          <span className="rounded border border-border bg-bg-elevated px-2 py-1">
            Ανιχνευτής περιβάλλουσας (δίοδος + RC)
          </span>
          <span className="text-fg-subtle">→</span>
          <span className="rounded border border-border bg-bg-elevated px-2 py-1">Αποκοπή DC</span>
          <span className="text-fg-subtle">→</span>
          <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1">
            <InlineMath>{'\\hat{k}(t)'}</InlineMath>
          </span>
        </div>
        <p>
          <strong>Χαρακτηριστικά του BPF:</strong> κεντρική συχνότητα{' '}
          <InlineMath>{'f_2'}</InlineMath>, εύρος ζώνης <InlineMath>{'6W'}</InlineMath> — όσο{' '}
          <em>όλη</em> η διπλή-πλευρική ζώνη του <InlineMath>{'k'}</InlineMath>{' '}
          (<InlineMath>{'[f_2 - 3W,\\, f_2 + 3W]'}</InlineMath>), ώστε να περάσει και τις δύο
          πλευρικές <em>και</em> τη φέρουσα. <strong>Όχι Carson</strong> — αυτό αφορά FM· εδώ το{' '}
          <InlineMath>{'6W'}</InlineMath> είναι απλώς <InlineMath>{'2\\times 3W'}</InlineMath>, το
          πλάτος του διπλού-πλευρικού AM. Πρέπει επίσης να <strong>απορρίπτει εντελώς το{' '}
          <InlineMath>{'x_m'}</InlineMath></strong> — εφικτό ακριβώς επειδή το (2) εξασφαλίζει
          καθαρό κενό. Η σταθερά χρόνου RC: αρκετά γρήγορη για να σβήνει τον κυματισμό της φέρουσας
          αλλά αρκετά αργή για να ακολουθεί την περιβάλλουσα,{' '}
          <InlineMath>{'\\tfrac{1}{f_2} \\ll RC \\ll \\tfrac{1}{3W}'}</InlineMath>.
        </p>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «μικτό FDM: ένα κανάλι DSB-SC, ένα συμβατικό AM», τρέξε τα ίδια
            σήματα-κλειδιά: <strong>(α)</strong> DSB-SC = δύο πλευρικές, <em>καμία</em> γραμμή·
            συμβατικό AM = δύο πλευρικές <em>συν</em> γραμμή-φέρουσα στο{' '}
            <InlineMath>{'f_c'}</InlineMath>. <strong>(β)</strong> Δες γραμμή ⇒ αυτό το κανάλι
            αποδιαμορφώνεται με <em>περιβάλλουσα</em>· χωρίς γραμμή ⇒ θέλει{' '}
            <em>σύμφωνη</em>. <strong>(γ)</strong> Μη-επικάλυψη = <em>πάντα</em> (μισό-εύρος κάτω) +
            (μισό-εύρος πάνω), χτισμένη από τα πραγματικά bands — η γραμμή-φέρουσα κάθεται{' '}
            <em>μέσα</em> στη ζώνη της και <em>δεν</em> την πλαταίνει. <strong>(δ)</strong> Γραμμή
            στο φάσμα ⇒ άπειρη ενέργεια / κυρίαρχη ισχύς — αναγνώρισέ το όταν σου ζητούν
            ενέργεια/ισχύ. Το μεταφέρσιμο κλειδί: η <strong>γραμμή-φέρουσα</strong> απαντά
            ταυτόχρονα στο «ποιο διαβάζει ένας χαζός δέκτης», «πού πάει η ισχύς» και «γιατί δεν είναι
            πεπερασμένη η ενέργεια».
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Και τα δύο DSB-SC</strong> (κατάστειλε και τη φέρουσα του{' '}
              <InlineMath>{'k'}</InlineMath>): η γραμμή εξαφανίζεται, η συνολική ενέργεια γίνεται{' '}
              <em>πεπερασμένη</em> (<InlineMath>{'\\tfrac{7}{12W}'}</InlineMath> εδώ), αλλά{' '}
              <em>κανένα</em> κανάλι δεν αποδιαμορφώνεται με περιβάλλουσα — θέλεις σύμφωνη και για τα
              δύο. Αυτό ακριβώς είναι το αδελφό{' '}
              <Link
                href="/practice#exercise:pb25-th3-mux"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 3
              </Link>{' '}
              (και τα δύο DSB-SC).
            </li>
            <li>
              <strong>Και τα δύο συμβατικό AM:</strong> δύο γραμμές-φέρουσες, <em>και τα δύο</em>{' '}
              αποδιαμορφώνονται με περιβάλλουσα — αλλά «πληρώνεις δύο φορές» τη φέρουσα. Καλό τεστ ότι
              κατάλαβες την ανταλλαγή ισχύος ↔ απλότητας δέκτη.
            </li>
            <li>
              <strong>Άλλαξε ποιο είναι πλατύτερο / το <InlineMath>{'n'}</InlineMath>:</strong> π.χ.{' '}
              <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)'}</InlineMath> (μισό-εύρος{' '}
              <InlineMath>{'W'}</InlineMath>) στο φέρον <InlineMath>{'f_1'}</InlineMath> και{' '}
              <InlineMath>{'k(t) = \\mathrm{sinc}(Wt)'}</InlineMath> (μισό-εύρος{' '}
              <InlineMath>{'W/2'}</InlineMath>) στο <InlineMath>{'f_2'}</InlineMath> — ξαναχτίσε τη
              μη-επικάλυψη από τα <em>νέα</em> μισά-εύρη: <InlineMath>{'W + \\tfrac{W}{2} = \\tfrac{3W}{2}'}</InlineMath>.
              Ίδιος κανόνας, διαφορετικό νούμερο.
            </li>
            <li>
              <strong><InlineMath>{'\\mu > 1'}</InlineMath> στο AM κανάλι</strong> (overmodulation):
              η περιβάλλουσα <InlineMath>{'A_c + k(t)'}</InlineMath> περνά στα αρνητικά, ο ανιχνευτής
              τη διπλώνει ⇒ ο ανιχνευτής περιβάλλουσας <em>αποτυγχάνει ακόμη και στο{' '}
              <InlineMath>{'k'}</InlineMath></em>. Συνδέεται με τα προβλήματα overmodulation (π.χ.{' '}
              <Link
                href="/practice#exercise:jan26-th2-7"
                className="text-accent underline-offset-2 hover:underline"
              >
                Ιαν. 2026 ΘΕΜΑ 2.7
              </Link>
              ).
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'jun25-th3-fm',
    origin: 'past-exam',
    source: 'june-2025',
    problemNumber: 'ΘΕΜΑ 3',
    weight: 25,
    title: 'FM στα 90 MHz με αλλαγή bandwidth + RF φιλτράρισμα',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/idea', 'fm/bessel', 'fm/carson'],
    formulaIds: ['fm-instantaneous-freq', 'fm-single-tone', 'fm-beta', 'carson', 'fm-bessel-sidebands', 'fm-bessel-property', 'fm-power'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνονται στο τυπολόγιο.</strong>{' '}
        Ο ορισμός{' '}
        <InlineMath>{'\\beta_f = K_f\\,\\max|m|/f_m = K_f A_m/f_m'}</InlineMath>{' '}
        (βάρος 6) και ο κανόνας Carson{' '}
        <InlineMath>{'B \\cong 2(\\beta+1)f_m'}</InlineMath> (βάρος 6) —
        αμφότεροι γράφονται απέξω. Το θέμα δείχνει και την{' '}
        <strong>αντίστροφη χρήση Carson</strong>: δίνεται{' '}
        <InlineMath>{'B_2 = 8'}</InlineMath> kHz, βρες νέο β ={' '}
        <InlineMath>{'B/(2f_m) - 1'}</InlineMath>. Το τυπολόγιο δίνει πίνακα{' '}
        <InlineMath>{'J_n(\\beta)'}</InlineMath> — χρειάζεσαι τιμές για{' '}
        <InlineMath>{'\\beta = 1'}</InlineMath>.{' '}
        <strong>
          ⚠️ Η μορφή Bessel{' '}
          <InlineMath>{'x_{FM} = A_c\\sum_n J_n(\\beta)\\cos[2\\pi(f_c+nf_m)t]'}</InlineMath>{' '}
          δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — 3 παλιά θέματα Bessel).{' '}
        <strong>
          ⚠️ Συμμετρία{' '}
          <InlineMath>{'J_{-n} = (-1)^n J_n'}</InlineMath>{' '}
          + energy identity{' '}
          <InlineMath>{'\\sum_n J_n^2 = 1'}</InlineMath>{' '}
          δεν δίνονται στο τυπολόγιο
        </strong>{' '}
        (βάρος 3 — χρησιμοποιούνται στο θέμα 3.6 για ποσοστό ισχύος).{' '}
        <strong>
          ⚠️ Ισχύς FM{' '}
          <InlineMath>{'P_{FM} = A_c^2/2'}</InlineMath>{' '}
          ανεξάρτητη του β — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — θέμα 3.3 ζητά ρητά{' '}
        <InlineMath>{'P_{FM}'}</InlineMath>).{' '}
        <strong>
          ⚠️ Single-tone εξίσωση FM{' '}
          <InlineMath>{'x_{FM} = A_c\\cos[2\\pi f_c t + \\beta_f\\sin(2\\pi f_m t)]'}</InlineMath>{' '}
          — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — 2 παλιά θέματα: αναγνωρίζεις β, A_c, f_c, f_m από τη μορφή· βλ. και{' '}
        <Link href="/practice#exercise:jan26-th4-fm">Ιαν.2026 ΘΕΜΑ 4.13</Link>).{' '}
        <strong>
          ⚠️ Στιγμιαία συχνότητα{' '}
          <InlineMath>{'f_i(t) = f_c + K_f\\,m(t)'}</InlineMath>{' '}
          — δεν δίνεται στο τυπολόγιο
        </strong>{' '}
        (βάρος 2 — 2 παλιά θέματα: εδώ ενδιάμεσο βήμα στον υπολογισμό β = K_f·A_m/f_m + Σεπτ.2025 ρητά).
      </>
    ),
    statement: (
      <p>
        FM modulator με{' '}
        <InlineMath>{'m(t) = 2\\cos(2\\pi\\cdot 2000\\,t)'}</InlineMath> Volt,{' '}
        <InlineMath>{'K_f = 1'}</InlineMath> kHz/V. Φέρον στα 90 MHz, ενεργό
        bandwidth <InlineMath>{'B_1 = 16'}</InlineMath> kHz. (1) Πόσες
        αρμονικές στο ενεργό εύρος ζώνης. (2) Δείκτης β₁. (3) Ισχύς FM σήματος.
        (4) Για να μπει σε <InlineMath>{'B_2 = 8'}</InlineMath> kHz χωρίς να
        αλλάξει η <InlineMath>{'f_m'}</InlineMath> και <InlineMath>{'K_f'}</InlineMath>,
        τι πρέπει να συμβεί στο πλάτος του message; (5) RF φίλτρο{' '}
        <InlineMath>{'f_{RF} = 90'}</InlineMath> MHz,{' '}
        <InlineMath>{'B_{RF} = 4'}</InlineMath> kHz: πόσες αρμονικές περνούν αν{' '}
        <InlineMath>{'B_2 = 8'}</InlineMath> kHz; (6) Ποσοστό ισχύος εξόδου.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>(1)</strong> <InlineMath>{'\\Delta f = K_f \\max|m| = 1\\cdot 2 = 2'}</InlineMath>{' '}
          kHz, <InlineMath>{'f_m = 2'}</InlineMath> kHz, β₁ = 1. Carson:{' '}
          <InlineMath>{'B_{Carson} = 2(\\beta+1)f_m = 2\\cdot 2\\cdot 2 = 8'}</InlineMath>{' '}
          kHz. Αλλά δίνεται <InlineMath>{'B_1 = 16'}</InlineMath> kHz · συνεπώς
          αρμονικές n από{' '}
          <InlineMath>{'-B_1/(2 f_m) = -4'}</InlineMath> έως{' '}
          <InlineMath>{'+4'}</InlineMath>: <strong>9 αρμονικές</strong>{' '}
          (carrier + 4 ζεύγη sidebands).
        </p>
        <p>
          <strong>(2) β₁ = 1</strong> (όπως υπολογίστηκε).
        </p>
        <p>
          <strong>(3)</strong>{' '}
          <InlineMath>{'P_{FM} = A_c^2/2'}</InlineMath> — δεν δίνεται{' '}
          <InlineMath>{'A_c'}</InlineMath>, οπότε γενική απάντηση. Αν π.χ.{' '}
          <InlineMath>{'A_c = 1'}</InlineMath> → <InlineMath>{'P = 0.5'}</InlineMath> W.
        </p>
        <p>
          <strong>(4) Για B₂ = 8 kHz</strong> (μισό από B₁), χρειάζεται
          μικρότερο β. Από Carson: <InlineMath>{'B = 2(\\beta+1)f_m'}</InlineMath>,
          με σταθερό <InlineMath>{'f_m = 2'}</InlineMath> kHz, νέο β:{' '}
          <InlineMath>{'8 = 2(\\beta+1)\\cdot 2 \\Rightarrow \\beta = 1'}</InlineMath>.
          Παρόμοιο! Αλλά το πραγματικό σήμα είχε β=1 και χρειαζόταν 16 kHz
          να συμπεριλάβει τα ±4 sidebands. Για να χωρέσει σε 8 kHz μόνο τα
          ±2 sidebands → χρειάζεται μικρότερο β. Από{' '}
          <InlineMath>{'\\beta = K_f A_m / f_m'}</InlineMath> με σταθερά{' '}
          <InlineMath>{'K_f, f_m'}</InlineMath>: <strong>μείωση
          πλάτους message</strong> (π.χ. στο μισό → β=0.5).
        </p>
        <p>
          <strong>(5)</strong> <InlineMath>{'B_{RF} = 4'}</InlineMath> kHz
          γύρω από 90 MHz → αφήνει sidebands με{' '}
          <InlineMath>{'|n| \\leq B_{RF}/(2 f_m) = 1'}</InlineMath>. Δηλαδή
          <strong>3 αρμονικές</strong>: carrier + ±1 sb.
        </p>
        <p>
          <strong>(6)</strong> Ποσοστό ισχύος = ποσοστό ολικής που
          εμφανίζεται σε αυτές τις 3 αρμονικές. Για β=1:
        </p>
        <BlockMath>{'\\frac{J_0^2(1) + 2J_1^2(1)}{1} = 0.7656^2 + 2\\cdot 0.4401^2 = 0.586 + 0.387 = 97.4\\%'}</BlockMath>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ΠΡΟΟΔΟΣ A · ΜΑΪΟΣ 2025 (foundations + AM, ~10 problems)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'pa25-th1-1',
    repeatGroup: 'tf-am-form',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 1.1',
    weight: 3,
    title: 'Σ/Λ — μορφή AM σήματος (DSB-SC vs conventional)',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.1
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Το συμβατικά διαμορφωμένο κατά AM σήμα{' '}
        <InlineMath>{'x(t) = [A_c\\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        έχει αυτή την μορφή.
      </p>
    ),
    solution: (
      <p>
        <strong>ΛΑΘΟΣ.</strong> Είναι DSB-SC. Συμβατικό AM:{' '}
        <InlineMath>{'x = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>.
      </p>
    ),
  },
  {
    id: 'pa25-th1-2',
    repeatGroup: 'tf-cos-power',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 1.2',
    weight: 3,
    title: 'Σ/Λ — cos είναι σήμα ισχύος',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/signals'],
    formulaIds: ['cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> για κάθε cosine/sine
        πλάτους <InlineMath>{'A'}</InlineMath> — εδώ <InlineMath>{'A=1'}</InlineMath>,
        άρα <InlineMath>{'P = 1/2'}</InlineMath>. Εμφανίστηκε σε{' '}
        <strong>6</strong> παλιά θέματα (3 εξεταστικές — Σ/Λ «ισχύς vs ενέργεια» και υπολογισμοί ισχύος αθροισμάτων). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σ/Λ: Το <InlineMath>{'m(t) = \\cos(2\\pi t)'}</InlineMath> είναι σήμα
        ισχύος.
      </p>
    ),
    solution: <p><strong>ΣΩΣΤΟ.</strong> P=1/2, ενέργεια άπειρη.</p>,
  },
  {
    id: 'pa25-th1-3',
    repeatGroup: 'tf-white-noise-gaussian',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 1.3',
    weight: 4,
    title: 'Σ/Λ — λευκός θόρυβος ⇔ Gaussian',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/white-noise'],
    statement: (
      <p>
        Σ/Λ: Ο λευκός θόρυβος είναι ο θόρυβος του οποίου η φασματική πυκνότητα
        ισχύος ακολουθεί την κατανομή Gauss.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση — «λευκός» και «Gaussian» μετρούν δύο ανεξάρτητα πράγματα.
          </strong>{' '}
          <span className="text-fg-muted">
            «<strong>Λευκός</strong>» = το <strong>σχήμα της PSD</strong>: πού
            κάθεται η ισχύς στις συχνότητες. Λευκός σημαίνει{' '}
            <strong>επίπεδη</strong> PSD — ίση ισχύς σε κάθε{' '}
            <InlineMath>{'f'}</InlineMath>, όπως το λευκό φως κουβαλά ίσα όλα τα
            χρώματα (frequency domain). «<strong>Gaussian</strong>» = η{' '}
            <strong>κατανομή πλάτους</strong>: αν κατέγραφες τις τιμές του
            θορύβου στον χρόνο κι έφτιαχνες ιστόγραμμα, θα έβγαινε{' '}
            <strong>καμπάνα</strong> (amplitude domain).{' '}
            <strong className="text-fg">Το κρίσιμο:</strong> δύο ηχογραφήσεις
            «σσσσ» μπορεί να έχουν <em>πανομοιότυπη</em> επίπεδη PSD κι όμως
            τελείως διαφορετικό ιστόγραμμα πλάτους — η PSD δεν «βλέπει» πώς
            μοιράζονται οι τιμές, μόνο πού κάθεται η ισχύς. Άρα οι δύο άξονες
            είναι <strong>ορθογώνιοι</strong>: ο ένας δεν συνεπάγεται τον άλλον.
          </span>
        </div>

        <p>
          <strong>ΛΑΘΟΣ.</strong> Η εκφώνηση ταυτίζει το{' '}
          <strong>σχήμα της PSD στη συχνότητα</strong> με τη{' '}
          <strong>στατιστική των πλατών</strong> — δύο ορθογώνιες ιδιότητες. Κι
          επιπλέον η PSD του λευκού θορύβου είναι <strong>επίπεδη</strong> (
          <InlineMath>{'S_N(f) = N_0/2'}</InlineMath>, σταθερή σε κάθε{' '}
          <InlineMath>{'f'}</InlineMath>) — το ακριβώς αντίθετο μιας καμπάνας· η
          καμπάνα Gauss ζει σε άλλο γράφημα, στο ιστόγραμμα των τιμών, όχι στην
          PSD. <strong>Αντιπαράδειγμα που το κλείνει:</strong> ασυσχέτιστες τιμές
          uniform <InlineMath>{'U[-1,+1]'}</InlineMath> δίνουν <em>ίδια</em>{' '}
          επίπεδη PSD (άρα λευκός θόρυβος), αλλά ιστόγραμμα <em>κουτί</em> — όχι
          καμπάνα. Λευκός χωρίς Gaussian· άρα «λευκός» δεν συνεπάγεται «Gaussian».
        </p>

        <p className="text-sm text-fg-muted">
          Ίδια ακριβώς παγίδα με την αδελφή Σ/Λ{' '}
          <Link
            href="/practice#exercise:jan26-th1-3"
            className="text-accent underline-offset-2 hover:underline"
          >
            Ιαν. 2026 ΘΕΜΑ 1.3
          </Link>{' '}
          — εκεί ζει η πλήρης ανάλυση: ο πίνακας 2×2 (λευκός/έγχρωμος ×
          Gaussian/μη-Gaussian) με αντιπαράδειγμα σε κάθε κελί, και το{' '}
          <strong>ανάποδο</strong> της παγίδας («κάθε Gaussian θόρυβος είναι
          λευκός» — επίσης ΛΑΘΟΣ: φιλτράρισε AWGN κι έχεις colored Gaussian). Η
          θεωρία στο{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §6
          </Link>{' '}
          (η κορυφαία παγίδα της Noise group), και το «γιατί ο θερμικός είναι
          Gaussian» (CLT) στο{' '}
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §2
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'pa25-th1-4',
    repeatGroup: 'tf-m3-bandwidth',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 1.4',
    weight: 5,
    title: 'Σ/Λ — Bandwidth του M³(f)',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-convolution'],
    statement: (
      <p>
        Σ/Λ: Αν W είναι το φάσμα του βασικού σήματος <InlineMath>M(f)</InlineMath>,
        το φάσμα του σήματος <InlineMath>{'G(f) = M^3(f)'}</InlineMath> είναι{' '}
        <InlineMath>{'W^3'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Ο γραφή{' '}
          <InlineMath>{'M^3(f)'}</InlineMath> έχει δύο εύλογες αναγνώσεις, και
          <em>καμία</em> από τις δύο δεν δίνει <InlineMath>{'W^3'}</InlineMath>:
        </p>
        <ol className="ml-5 list-decimal text-fg-muted">
          <li>
            <strong>Pointwise κυβισμός του φάσματος</strong> (αυτό που γράφει
            κυριολεκτικά ο τύπος): <InlineMath>{'G(f) = [M(f)]^3'}</InlineMath>.
            Το <em>στήριγμα</em> δεν αλλάζει — όπου <InlineMath>M = 0</InlineMath>{' '}
            έχουμε <InlineMath>{'M^3 = 0'}</InlineMath>. Bandwidth παραμένει{' '}
            <strong>W</strong>.
          </li>
          <li>
            <strong>Φάσμα του{' '}
            <InlineMath>{'m^3(t)'}</InlineMath></strong> (η συνηθέστερη πρόθεση
            σε exam questions). Πολλαπλασιασμός στον χρόνο = συνέλιξη στη
            συχνότητα:{' '}
            <InlineMath>{'\\mathcal{F}\\{m^3\\} = M * M * M'}</InlineMath>. Η
            συνέλιξη <em>προσθέτει</em> τα στηρίγματα:{' '}
            <InlineMath>{'W + W + W = 3W'}</InlineMath>.
          </li>
        </ol>
        <p>
          Σε καμία περίπτωση δεν προκύπτει <InlineMath>{'W^3'}</InlineMath>.
          (Παγίδα: <em>convolution στον χρόνο</em> δίνει
          <em> πολλαπλασιασμό στη συχνότητα</em> με ίδιο BW· η{' '}
          <strong>convolution στη συχνότητα</strong> είναι αυτή που προσθέτει
          BWs.)
        </p>
      </>
    ),
  },
  {
    id: 'pa25-th1-5',
    repeatGroup: 'tf-tri-envelope',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 1.5',
    weight: 5,
    title: 'Σ/Λ — Envelope FS τριγωνικού παλμού',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-pair-tri'],
    statement: <p>Σ/Λ: Η περιβάλλουσα του φάσματος πλάτους του Μ/Σ Fourier ενός τριγωνικού παλμού είναι ημιτονοειδής.</p>,
    solution: (
      <p>
        <strong>ΛΑΘΟΣ.</strong> Είναι <strong>sinc²</strong> (από{' '}
        <InlineMath>{'\\Lambda(t/T) \\leftrightarrow T\\,\\mathrm{sinc}^2(fT)'}</InlineMath>).
        Δεν είναι ημιτονοειδής.
      </p>
    ),
  },
  {
    id: 'pa25-th2-1',
    repeatGroup: 'why-modulate',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 2.1',
    weight: 5,
    title: 'Λόγοι διαμόρφωσης — βασικοί',
    topic: 'modulation',
    difficulty: 'easy',
    prerequisites: ['am/overview'],
    statement: <p>Αναφέρετε τους βασικούς λόγους για τους οποίους επιτελούμε διαμόρφωση στα προς μετάδοση τηλεπικοινωνιακά συστήματα.</p>,
    solution: (
      <ol className="ml-5 list-decimal text-fg-muted">
        <li>Αντενα μέγεθος (λ/4)</li>
        <li>FDM multiplexing</li>
        <li>Αποδοτική χρήση φάσματος</li>
        <li>Ανοσία θορύβου</li>
        <li>Κανονιστικά πλαίσια</li>
      </ol>
    ),
  },
  {
    id: 'pa25-th2-2',
    repeatGroup: 'am-draw-cos8pi',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 2.2',
    weight: 5,
    title: 'Σχεδίαση AM σήματος cos(8πt) με 2sin(2πt)',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal', 'am-mu'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και ο
        δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m / A_c'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>8</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: <p>Να σχεδιαστεί το διαμορφωμένο κατά AM σήμα όταν το φέρον είναι <InlineMath>{'c(t) = \\cos(8\\pi t)'}</InlineMath> και το σήμα πληροφορίας είναι <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>.</p>,
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Το AM σήμα είναι ένα φέρον του οποίου το «ύψος» ακολουθεί την{' '}
            <strong>περιβάλλουσα</strong> <InlineMath>{'A_c + m(t)'}</InlineMath>. Όταν ο
            δείκτης διαμόρφωσης <InlineMath>{'\\mu = A_m/A_c'}</InlineMath> ξεπερνά το{' '}
            <InlineMath>{'1'}</InlineMath>, το message «κουνάει» το ύψος πιο δυνατά απ' ό,τι
            αντέχει το φέρον: η περιβάλλουσα <strong>πέφτει κάτω από το μηδέν</strong>. Μια
            φυσική περιβάλλουσα όμως δεν γίνεται αρνητική — άρα αυτό που πραγματικά συμβαίνει
            είναι ότι ο carrier <strong>αναστρέφει τη φάση του κατά{' '}
            <InlineMath>{'180^\\circ'}</InlineMath></strong> σε κάθε σημείο όπου η περιβάλλουσα
            μηδενίζεται: αυτές είναι οι <em>phase reversals</em>. Ένας envelope detector τότε
            ανακτά το <InlineMath>{'|A_c + m(t)|'}</InlineMath>, <strong>όχι</strong> το message
            — η κλασική αποτυχία της υπερδιαμόρφωσης. Γι' αυτό η εκφώνηση δίνει{' '}
            <InlineMath>{'A_m > A_c'}</InlineMath>: θέλει να δει αν θα προσέξεις τις αναστροφές.
            (Το «γιατί» ζει στο{' '}
            <Link
              href="/am/conventional"
              className="text-accent underline-offset-2 hover:underline"
            >
              /am/conventional §3 Υπερδιαμόρφωση
            </Link>
            .)
          </span>
        </div>

        <p>
          Διαβάζουμε τις παραμέτρους από τα δεδομένα. Φέρον{' '}
          <InlineMath>{'c(t) = \\cos(8\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_c = 1'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_c = 8\\pi \\Rightarrow f_c = 4'}</InlineMath> Hz. Σήμα
          πληροφορίας <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>:{' '}
          <InlineMath>{'A_m = 2'}</InlineMath> και{' '}
          <InlineMath>{'2\\pi f_m = 2\\pi \\Rightarrow f_m = 1'}</InlineMath> Hz. Το συνολικό
          σήμα κατά Conventional AM:
        </p>
        <BlockMath>{'x(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = [1 + 2\\sin(2\\pi t)]\\cos(8\\pi t)'}</BlockMath>

        <p>
          <strong>(1) Ο δείκτης διαμόρφωσης — ο έλεγχος που δεν παραλείπουμε ποτέ.</strong>{' '}
          <InlineMath>{'\\mu = A_m/A_c = 2/1 = 2'}</InlineMath>. Επειδή{' '}
          <InlineMath>{'\\mu > 1'}</InlineMath>, έχουμε <strong>υπερδιαμόρφωση</strong>.{' '}
          <strong>Με απλά λόγια:</strong> πρώτη κίνηση σε κάθε «σχεδιάστε AM» — σύγκρινε το
          πλάτος του message <InlineMath>{'A_m'}</InlineMath> με το πλάτος του φέροντος{' '}
          <InlineMath>{'A_c'}</InlineMath>. Εδώ το message είναι διπλάσιο του φέροντος· το
          σχεδιάζουμε όπως ζητείται, αλλά με ρητή σημείωση ότι αυτό είναι μη-έγκυρη AM (ο
          φτηνός envelope detector θα σπάσει).
        </p>
        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Παγίδα:</strong> ο modulation index είναι λόγος <em>πλατών</em>{' '}
          (<InlineMath>{'A_m/A_c'}</InlineMath>), όχι <InlineMath>{'A_m/f_c'}</InlineMath>. Σε
          κυκλοφορούσες λύσεις εμφανίζεται «<InlineMath>{'\\mu = 2/4 = 1/2'}</InlineMath>» —
          διαστατικά λάθος (διαιρεί πλάτος με συχνότητα). Το σωστό είναι{' '}
          <InlineMath>{'\\mu = 2'}</InlineMath>, και το ότι η περιβάλλουσα στο σχέδιο όντως
          πέφτει αρνητική το επιβεβαιώνει.
        </div>

        <p>
          <strong>(2) Στον χρόνο — η κυματομορφή με τις αναστροφές.</strong> Είναι ένα carrier{' '}
          <InlineMath>{'f_c = 4'}</InlineMath> Hz «γεμισμένο» από την περιβάλλουσα{' '}
          <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath>, που κυμαίνεται από{' '}
          <InlineMath>{'1 - 2 = -1'}</InlineMath> (στο <InlineMath>{'t = 3/4'}</InlineMath> s,
          όπου <InlineMath>{'\\sin(2\\pi t) = -1'}</InlineMath>) έως{' '}
          <InlineMath>{'1 + 2 = 3'}</InlineMath> (στο <InlineMath>{'t = 1/4'}</InlineMath> s). Οι
          αναστροφές φάσης συμβαίνουν ακριβώς εκεί που η περιβάλλουσα μηδενίζεται:
        </p>
        <BlockMath>{'1 + 2\\sin(2\\pi t) = 0 \\;\\Rightarrow\\; \\sin(2\\pi t) = -\\tfrac{1}{2}'}</BlockMath>
        <p>
          Σε κάθε περίοδο <InlineMath>{'T_m = 1/f_m = 1'}</InlineMath> s αυτό δίνει{' '}
          <InlineMath>{'t = 7/12'}</InlineMath> s και <InlineMath>{'t = 11/12'}</InlineMath> s —
          και ανάμεσά τους η περιβάλλουσα είναι αρνητική (το ελάχιστο{' '}
          <InlineMath>{'-1'}</InlineMath> στο <InlineMath>{'t = 3/4'}</InlineMath> s).{' '}
          <strong>Με απλά λόγια:</strong> σε εκείνο το διάστημα ο carrier «αναποδογυρίζει» —
          στον παλμογράφο το συνημίτονο ξαφνικά γυρίζει ανάποδα. Στο σχέδιό σου: ζωγράφισε το
          φέρον με πλάτος <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath> και βάλε ένα{' '}
          <InlineMath>{'180^\\circ'}</InlineMath> flip στα δύο αυτά σημεία. Με{' '}
          <InlineMath>{'f_c/f_m = 4'}</InlineMath> μετράς μόλις 4 κύκλους φέροντος σε κάθε
          περίοδο του message — λίγοι, οπότε σχεδίασέ τους με προσοχή ώστε να φαίνεται καθαρά η
          αναστροφή.
        </p>

        <figure className="my-4">
          <OvermodulationPhaseReversalViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Ο δρομέας <InlineMath>{'\\mu'}</InlineMath> φτάνει <strong>ακριβώς στο{' '}
            <InlineMath>{'2'}</InlineMath></strong> — το δικό μας πρόβλημα (το chip{' '}
            <InlineMath>{'\\mu = 1.5'}</InlineMath> είναι κοντά· σύρε ώς το{' '}
            <InlineMath>{'2'}</InlineMath>). Πάνω: το <InlineMath>{'x(t)'}</InlineMath> με τους
            κόκκινους <span className="text-red-600 dark:text-red-400">↺</span> δείκτες στις
            αναστροφές. Μέση: το <InlineMath>{'|A_c + m(t)|'}</InlineMath> που αναδιπλώνεται όταν
            η περιβάλλουσα περάσει κάτω από το μηδέν. Κάτω: η ανακτημένη{' '}
            <InlineMath>{'\\hat{m}(t)'}</InlineMath> (μπλε) ξεκολλά από το αληθινό{' '}
            <InlineMath>{'m(t)'}</InlineMath> (πορτοκαλί) — η{' '}
            <span className="text-red-600 dark:text-red-400">κόκκινη ζώνη</span> είναι η
            παραμόρφωση, με RMS-error readout στα δεξιά. Το viz χρησιμοποιεί{' '}
            <em>cosine</em> message και ενδεικτικό αριθμό κύκλων· το δικό μας είναι{' '}
            <em>sine</em> με <InlineMath>{'f_c = 4'}</InlineMath> Hz,{' '}
            <InlineMath>{'f_m = 1'}</InlineMath> Hz — η δομή (αναστροφές όπου{' '}
            <InlineMath>{'A_c + m(t) < 0'}</InlineMath>) είναι πανομοιότυπη· αλλάζει μόνο{' '}
            <em>πού</em> πάνω στον άξονα του χρόνου πέφτουν οι αναστροφές.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— όταν δεις «<em>σχεδιάστε το διαμορφωμένο κατά AM σήμα</em>» με single-tone
            message: <strong>(α)</strong> διάβασε <InlineMath>{'A_c, f_c'}</InlineMath> από το
            φέρον και <InlineMath>{'A_m, f_m'}</InlineMath> από το message·{' '}
            <strong>(β)</strong> υπολόγισε <InlineMath>{'\\mu = A_m/A_c'}</InlineMath> και{' '}
            <strong>έλεγξέ το ως προς το <InlineMath>{'1'}</InlineMath></strong> (σημαία
            υπερδιαμόρφωσης)· <strong>(γ)</strong> ζωγράφισε φέρον με πλάτος{' '}
            <InlineMath>{'|A_c + m(t)|'}</InlineMath>, βάζοντας phase reversals <em>μόνο αν</em>{' '}
            <InlineMath>{'\\mu > 1'}</InlineMath>. Η μνεία-κλειδί:{' '}
            <strong>η υπερδιαμόρφωση είναι ιστορία του χρόνου — φαίνεται σαν αναστροφές φάσης
            και σαν αποτυχία του envelope detector, ποτέ σαν επιπλέον φασματικές γραμμές.</strong>
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδιος σκελετός, αλλαγμένη μία παράμετρος (δοκίμασέ τες σύροντας τον δρομέα{' '}
            <InlineMath>{'\\mu'}</InlineMath> παραπάνω):
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Οριακή <InlineMath>{'\\mu = 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 1 = A_c'}</InlineMath>): η περιβάλλουσα <em>μόλις αγγίζει</em>{' '}
              το μηδέν, καμία αναστροφή ακόμη — το όριο της έγκυρης AM. Σύρε τον δρομέα στο{' '}
              <InlineMath>{'1.0'}</InlineMath> και δες τις κόκκινες ζώνες να εξαφανίζονται.
            </li>
            <li>
              <strong>Κανονική <InlineMath>{'\\mu < 1'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'A_m = 0.5'}</InlineMath>): η περιβάλλουσα μένει θετική και ένας
              envelope detector ανακτά <em>καθαρά</em> το message — στο κάτω panel η{' '}
              <InlineMath>{'\\hat{m}'}</InlineMath> πέφτει πάνω στο{' '}
              <InlineMath>{'m'}</InlineMath> (RMS error <InlineMath>{'\\to 0'}</InlineMath>).
            </li>
            <li>
              <strong>Τι βγάζει ο envelope detector εδώ{' '}
              (<InlineMath>{'\\mu = 2'}</InlineMath>):</strong> το{' '}
              <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath> — αναδιπλωμένο, με αιχμές που{' '}
              <strong>δεν φεύγουν με LPF</strong>. Σύρε στο <InlineMath>{'2'}</InlineMath> και
              διάβασε το ποσοστό παραμόρφωσης· γι' αυτό η σωστή AM κρατά πάντα{' '}
              <InlineMath>{'\\mu \\le 1'}</InlineMath>.
            </li>
          </ul>
        </div>

        <p className="mt-3 text-xs text-fg-subtle">
          Δίδυμο πρόβλημα:{' '}
          <Link
            href="/practice#exercise:pb25-th2-2"
            className="text-accent underline-offset-2 hover:underline"
          >
            Πρόοδ. Β 2025 ΘΕΜΑ 2.2
          </Link>{' '}
          — ίδια εκφώνηση και ίδιες παράμετροι (repeatGroup{' '}
          <span className="font-mono">am-draw-cos8pi</span>).
        </p>
      </>
    ),
  },
  {
    id: 'pa25-th2-4',
    repeatGroup: 'power-sum-sinusoids',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 2.4',
    weight: 6,
    title: 'Ισχύς Asin(2πf₁t) + Bcos(2πf₂t) + Ccos(2πf₃t)',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['parseval-power', 'cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> ανά τόνο — χρησιμοποιείται
        εδώ για κάθε από τους 3 τόνους (<InlineMath>{'A^2/2 + B^2/2 + C^2/2'}</InlineMath>).
        Εμφανίστηκε σε <strong>6</strong> παλιά θέματα (3 εξεταστικές). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.2
        </Link>,{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 1.2
        </Link>.{' '}
        Επίσης: ο τύπος{' '}
        <InlineMath>{'P = \\sum_k A_k^2/2'}</InlineMath>{' '}
        (Parseval FS, parseval-power, βάρος <strong>4</strong>) επίσης λείπει — είναι το
        θεώρημα που δικαιολογεί αυτήν ακριβώς την πρόσθεση ισχύων ανά τόνο.
      </>
    ),
    statement: <p>Έστω σήμα <InlineMath>{'x(t) = A\\sin(2\\pi f_1 t) + B\\cos(2\\pi f_2 t) + C\\cos(2\\pi f_3 t)'}</InlineMath> με <InlineMath>{'f_1 \\neq f_2 \\neq f_3'}</InlineMath>. Ισχύς;</p>,
    solution: <BlockMath>{'P = \\frac{A^2}{2} + \\frac{B^2}{2} + \\frac{C^2}{2}'}</BlockMath>,
  },
  {
    id: 'pa25-th2-5',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 2.5',
    weight: 8,
    title: 'AM ενός Σ ncos(2πnt), n=1..8 — αρμονικές',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/conventional', 'foundations/fourier-series'],
    formulaIds: ['am-signal', 'am-spectrum'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και το
        φάσμα AM{' '}
        <InlineMath>{'X_{AM}(f) = \\tfrac{A_c}{2}\\delta(f\\mp f_c) + \\tfrac{1}{2}M(f\\mp f_c)'}</InlineMath>{' '}
        (σε <strong>4</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 9
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th2-7"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.7
        </Link>.
      </>
    ),
    statement: <p>Έστω σήμα βασικής ζώνης <InlineMath>{'x(t) = \\sum_{n=1}^{8} n\\cos(2\\pi n t)'}</InlineMath>. Σχεδιάστε το φάσμα πλάτους βασικής ζώνης και υπολογίστε πόσες αρμονικές έχει το φάσμα πλάτους του διαμορφωμένου κατά συμβατικό AM του <InlineMath>x(t)</InlineMath>.</p>,
    solution: (
      <>
        <p>
          <strong>Baseband:</strong> 8 αρμονικές στις 1, 2, ..., 8 Hz, με
          πλάτη <InlineMath>{'n/2'}</InlineMath> καθεμία (impulses στις
          <InlineMath>{'\\pm n'}</InlineMath>).
        </p>
        <p>
          <strong>AM</strong>:{' '}
          <InlineMath>{'[A_c + x(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
          → στις θετικές συχνότητες έχει: 1 carrier στο{' '}
          <InlineMath>{'f_c'}</InlineMath> + 8 USB στις{' '}
          <InlineMath>{'f_c + 1, ..., f_c + 8'}</InlineMath> + 8 LSB στις{' '}
          <InlineMath>{'f_c - 1, ..., f_c - 8'}</InlineMath>. Σύνολο{' '}
          <strong>17 αρμονικές</strong> στις θετικές συχνότητες (συμμετρικά
          άλλες 17 στις αρνητικές).
        </p>
      </>
    ),
  },
  {
    id: 'pa25-th3-mux',
    origin: 'past-exam',
    source: 'proodos-a-2025',
    problemNumber: 'ΘΕΜΑ 3',
    weight: 25,
    title: 'AM-USSB Multiplexing — sinc(2Wt) + Π(4Wt)',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/multiplexing', 'am/ssb'],
    formulaIds: ['ssb-signal', 'fourier-pair-rect', 'fdm-spacing'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος USSB σήματος{' '}
        <InlineMath>{'x_{USB}(t)=A_c m(t)\\cos(2\\pi f_c t)-A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα) και η συνθήκη
        μη-επικάλυψης FDM-SSB{' '}
        <InlineMath>{'\\Delta f \\ge W'}</InlineMath>{' '}
        (σε <strong>4</strong>). Ο ζεύγος Fourier rect βρίσκεται στο τυπολόγιο. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-12"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 12
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 3.11-12
        </Link>.
      </>
    ),
    statement: <p>Έστω <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)'}</InlineMath> και <InlineMath>{'k(t) = \\Pi(4Wt)'}</InlineMath>. Διαμορφώνονται κατά AM-USSB με φέροντα <InlineMath>{'f_1, f_2'}</InlineMath> αντίστοιχα. (1) Αποτύπωσε σχηματικά τα φάσματα πλάτους — <strong>βασικής ζώνης και διαμορφωμένων</strong>. (2) Πόσο πρέπει να είναι τα <InlineMath>{'f_1, f_2'}</InlineMath> σε σχέση με το <InlineMath>{'W'}</InlineMath> για αποπολυπλεξία χωρίς επικάλυψη; (3) Σχεδίασε το πολυπλεγμένο <InlineMath>{'G(f)'}</InlineMath>.</p>,
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα — γιατί FDM, και γιατί USSB.</strong>{' '}
          <span className="text-fg-muted">
            Δύο μηνύματα, ένας δίαυλος. Το FDM τα <strong>στοιβάζει</strong> σε{' '}
            <em>διαφορετικές</em> περιοχές συχνοτήτων — όπως δύο ραδιοσταθμοί που δεν
            μπερδεύονται επειδή εκπέμπουν σε διαφορετικά κανάλια· στον δέκτη ένα bandpass
            φίλτρο ξεχωρίζει το καθένα. Όλο το παιχνίδι είναι να μην «πατάει» το ένα κανάλι
            πάνω στο άλλο.{' '}
            <strong className="text-fg">Και γιατί USSB;</strong> Το φάσμα ενός πραγματικού
            μηνύματος είναι συμμετρικό — οι δύο πλευρικές ζώνες κουβαλούν <em>την ίδια</em>{' '}
            πληροφορία. Το DSB τις στέλνει και τις δύο ⇒ κάθε κανάλι πιάνει{' '}
            <InlineMath>{'2W'}</InlineMath>· το USSB πετάει την περιττή ⇒ κάθε κανάλι πιάνει{' '}
            <strong>μόνο το δικό του bandwidth</strong> ⇒ χωράς <strong>διπλάσια</strong>{' '}
            κανάλια στο ίδιο φάσμα (
            <Link href="/am/ssb" className="text-accent underline-offset-2 hover:underline">
              /am/ssb §1
            </Link>
            ). Αυτός είναι όλος ο λόγος που το mux αγαπά το USSB. Ο μπούσουλας:{' '}
            <em>
              η ζώνη που πιάνει ένα κανάλι = το bandwidth του μηνύματος, ανεβασμένο στο φέρον
            </em>
            .
          </span>
        </div>

        <p>
          <strong>(1) Πρώτα τα φάσματα βασικής ζώνης — και η παγίδα του σχήματος.</strong>{' '}
          Τα δύο σήματα μοιάζουν, αλλά μεταμορφώνονται <em>ανάποδα</em> το ένα από το άλλο.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(2Wt)'}</InlineMath>
            </strong>{' '}
            — ένα sinc στον <em>χρόνο</em> έχει για μετασχηματισμό ένα{' '}
            <strong>καθαρό rect</strong> (τούβλο) στη συχνότητα· είναι το ζεύγος{' '}
            <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath> του
            τυπολογίου:
            <BlockMath>{'M(f) = \\tfrac{1}{2W}\\,\\Pi\\!\\left(\\tfrac{f}{2W}\\right),\\qquad |f|\\le W'}</BlockMath>
            Bandwidth του <InlineMath>{'m'}</InlineMath>: <InlineMath>{'W'}</InlineMath>.
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\Pi(4Wt)'}</InlineMath>
            </strong>{' '}
            — εδώ το rect είναι στον <em>χρόνο</em> (μια απότομη «πύλη»). Απότομη ακμή στον
            χρόνο ⇒ κυματισμοί στη συχνότητα ⇒ ο μετασχηματισμός είναι{' '}
            <strong>sinc, όχι rect</strong> — το ίδιο ζεύγος διαβασμένο ανάποδα:
            <BlockMath>{'K(f) = \\tfrac{1}{4W}\\,\\mathrm{sinc}\\!\\left(\\tfrac{f}{4W}\\right)'}</BlockMath>
            με <strong>πρώτη ρίζα στα <InlineMath>{'|f| = 4W'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Πρόσεξε — η παγίδα του εύρους.</strong> Μη μπεις στον πειρασμό «
          <InlineMath>{'\\mathrm{sinc}(2Wt)\\to W'}</InlineMath>, άρα{' '}
          <InlineMath>{'\\Pi(4Wt)\\to 2W'}</InlineMath>»: τα δύο σήματα πάνε{' '}
          <em>αντίθετες</em> κατευθύνσεις. Για rect στον χρόνο{' '}
          <InlineMath>{'\\Pi(at)'}</InlineMath>, το sinc στη συχνότητα έχει πρώτη ρίζα{' '}
          <strong>στο <InlineMath>{'a'}</InlineMath></strong> (εδώ{' '}
          <InlineMath>{'a = 4W'}</InlineMath>), όχι στο <InlineMath>{'a/2'}</InlineMath>. Άρα
          το ενεργό εύρος του <InlineMath>{'k'}</InlineMath> είναι{' '}
          <InlineMath>{'4W'}</InlineMath> — <strong>τέσσερις</strong> φορές το{' '}
          <InlineMath>{'W'}</InlineMath>, όχι δύο.
        </p>

        <p>
          <strong>(1, συνέχεια) Τα διαμορφωμένα φάσματα — USSB κρατά μόνο την πάνω πλευρική.</strong>{' '}
          Το DSB-SC θα έβαζε <em>και τις δύο</em> πλευρικές γύρω από κάθε{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath>. Το USSB κρατά <strong>μόνο την πάνω</strong> ⇒
          κάθε κανάλι απλώνεται προς τα <em>πάνω</em> από το φέρον του, κατά ακριβώς το
          bandwidth του μηνύματος:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            το <InlineMath>{'m'}</InlineMath> στο <InlineMath>{'f_1'}</InlineMath> πιάνει{' '}
            <InlineMath>{'[f_1,\\, f_1 + W]'}</InlineMath> (και κατοπτρικά{' '}
            <InlineMath>{'[-f_1 - W,\\, -f_1]'}</InlineMath>) — πλάτος ζώνης{' '}
            <InlineMath>{'W'}</InlineMath>·
          </li>
          <li>
            το <InlineMath>{'k'}</InlineMath> στο <InlineMath>{'f_2'}</InlineMath> πιάνει{' '}
            <InlineMath>{'[f_2,\\, f_2 + 4W]'}</InlineMath> (και κατοπτρικά) — πλάτος ζώνης{' '}
            <InlineMath>{'4W'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> η ζώνη ενός USSB καναλιού φτάνει από το φέρον ως το
          φέρον <em>συν</em> το bandwidth του μηνύματος — το πλάτος της είναι το bandwidth,{' '}
          <em>όχι</em> το διπλάσιο. Αυτό είναι το μεταφερόμενο κλειδί όλου του προβλήματος.
        </p>

        <p>
          <strong>(2) Η συνθήκη μη-επικάλυψης — το 12% του θέματος.</strong> Για να ξεμπλέξει
          ο δέκτης τα δύο κανάλια, το BPF του πρέπει να πιάσει το ένα <em>χωρίς</em> ίχνος του
          άλλου — άρα οι δύο ζώνες δεν πρέπει να αγγίζονται. Με{' '}
          <InlineMath>{'f_1 < f_2'}</InlineMath> (το <InlineMath>{'m'}</InlineMath> από κάτω):
          στον θετικό άξονα το <InlineMath>{'m'}</InlineMath> τελειώνει στο{' '}
          <InlineMath>{'f_1 + W'}</InlineMath>, το <InlineMath>{'k'}</InlineMath> ξεκινά στο{' '}
          <InlineMath>{'f_2'}</InlineMath>:
        </p>
        <BlockMath>{'f_2 \\ge f_1 + W \\quad\\Longleftrightarrow\\quad \\boxed{\\,\\Delta f = f_2 - f_1 \\ge W\\,}'}</BlockMath>
        <p>
          <strong>Το λεπτό σημείο (μεταφερόμενο):</strong> η ελάχιστη απόσταση ισούται με το
          bandwidth του <em>κάτω</em> καναλιού — εδώ το <InlineMath>{'W'}</InlineMath> του{' '}
          <InlineMath>{'m'}</InlineMath>, <strong>όχι</strong> το{' '}
          <InlineMath>{'4W'}</InlineMath> του <InlineMath>{'k'}</InlineMath>. Αφού κάθε USSB
          κανάλι απλώνεται προς τα πάνω, μόνο η <em>πάνω ακμή του κάτω καναλιού</em>{' '}
          ανταγωνίζεται το επόμενο φέρον· το <InlineMath>{'4W'}</InlineMath> του{' '}
          <InlineMath>{'k'}</InlineMath> μετράει μόνο για ό,τι μπει <em>πάνω</em> από το{' '}
          <InlineMath>{'k'}</InlineMath>.
        </p>
        <p>
          <strong>
            Πρόσεξε — εδώ <em>δεν</em> χρειάζεται <InlineMath>{'f_1 \\ge W'}</InlineMath>.
          </strong>{' '}
          Ο κανόνας «<InlineMath>{'f_c \\ge W'}</InlineMath>» είναι του{' '}
          <strong>DSB / συμβατικού AM</strong>: εκεί η ζώνη είναι{' '}
          <InlineMath>{'[f_c - W,\\, f_c + W]'}</InlineMath>, οπότε το{' '}
          <InlineMath>{'f_c'}</InlineMath> πρέπει να ξεπερνά το <InlineMath>{'W'}</InlineMath>{' '}
          ώστε η κάτω πλευρική να μην πέσει στο μηδέν (και να μη συγκρουστεί με το κατοπτρικό
          της). Στο <strong>USSB</strong> η ζώνη ξεκινά <em>στο</em>{' '}
          <InlineMath>{'f_1'}</InlineMath> και πάει προς τα πάνω — δεν φτάνει ποτέ στο DC, άρα
          αρκεί <em>οποιοδήποτε</em> θετικό <InlineMath>{'f_1'}</InlineMath> (στην πράξη{' '}
          <InlineMath>{'f_1 \\gg W'}</InlineMath> για πραγματικό φέρον, αλλά αυτό είναι θέμα
          hardware, όχι επικάλυψης φάσματος). Η <em>μόνη</em> ανισότητα που γράφεις είναι{' '}
          <InlineMath>{'\\Delta f \\ge W'}</InlineMath> (
          <Link
            href="/am/multiplexing"
            className="text-accent underline-offset-2 hover:underline"
          >
            /am/multiplexing §3
          </Link>{' '}
          — ο πίνακας ανά σχήμα δίνει για SSB:{' '}
          <InlineMath>{'\\Delta f \\ge W'}</InlineMath> ανά κανάλι). Πρακτικά προσθέτεις
          ~10–20% guard band για τα μη-ιδανικά φίλτρα του δέκτη.
        </p>

        <p>
          <strong>
            (3) Το πολυπλεγμένο <InlineMath>{'G(f)'}</InlineMath>.
          </strong>{' '}
          Απλώς το άθροισμα <InlineMath>{'G(f) = X_m(f) + X_k(f)'}</InlineMath> — οι δύο USSB
          ζώνες δίπλα-δίπλα. Με <InlineMath>{'\\Delta f \\ge W'}</InlineMath> δεν αγγίζονται ⇒
          καθαρή αποπολυπλεξία· κάτω από <InlineMath>{'W'}</InlineMath> ⇒ επικάλυψη ⇒ crosstalk.
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — ιδανικεύσεις.</strong> Το{' '}
          <InlineMath>{'K(f)'}</InlineMath> είναι sinc, που έχει <strong>ουρές που δεν
          τελειώνουν ποτέ</strong>: αυστηρά το <InlineMath>{'k'}</InlineMath> <em>δεν</em>{' '}
          είναι bandlimited, οπότε το USSB του προϋποθέτει ένα φίλτρο που το κόβει. Όπως κάθε
          εξεταστική, παίρνουμε την <strong>πρώτη ρίζα (<InlineMath>{'4W'}</InlineMath>)</strong>{' '}
          ως το ενεργό bandwidth για το σχέδιο. Επίσης το σχέδιο είναι{' '}
          <strong>σχηματικό</strong>: τα <InlineMath>{'f_1, f_2'}</InlineMath> είναι αυθαίρετα
          φέροντα και οι άξονες μετριούνται σε σχετικές μονάδες του{' '}
          <InlineMath>{'W'}</InlineMath>.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz kBW={4} />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>.
            Πάνω: <InlineMath>{'M(f)'}</InlineMath> = το rect μπλοκ στο{' '}
            <InlineMath>{'[-W, W]'}</InlineMath>· από κάτω <InlineMath>{'K(f)'}</InlineMath> = ο
            sinc λοβός (το bracket «<InlineMath>{'2W_k = 8W'}</InlineMath> (πρώτο null)»
            σημαίνει πρώτες ρίζες στα <InlineMath>{'\\pm 4W'}</InlineMath> — δηλ. ενεργό εύρος{' '}
            <InlineMath>{'4W'}</InlineMath>). Στο διαμορφωμένο, το USSB κρατά{' '}
            <strong>μόνο την πάνω πλευρική</strong>: το <InlineMath>{'m'}</InlineMath> στο{' '}
            <InlineMath>{'[f_1, f_1 + W]'}</InlineMath>, το <InlineMath>{'k'}</InlineMath> στο{' '}
            <InlineMath>{'[f_2, f_2 + 4W]'}</InlineMath>. Σύρε την απόσταση{' '}
            <InlineMath>{'\\Delta f'}</InlineMath>: η ένδειξη «ελάχιστο» δείχνει{' '}
            <InlineMath>{'W'}</InlineMath> — κάτω από αυτό η ζώνη στο{' '}
            <InlineMath>{'G(f)'}</InlineMath> γίνεται κόκκινη (crosstalk), ακριβώς το
            υποερώτημα (2). Γύρισε τον διακόπτη σε <strong>DSB-SC</strong> και δες τις ζώνες να
            διπλασιάζονται και το «ελάχιστο» να πηδά στο{' '}
            <InlineMath>{'W + 4W = 5W'}</InlineMath>. (<InlineMath>{'f_1, f_2'}</InlineMath>{' '}
            αυθαίρετα φέροντα — σχηματικό.)
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «δύο σήματα, δύο φέροντα, σχεδίασε / συνθήκη μη-επικάλυψης»,
            τρέξε τα <strong>ίδια τέσσερα βήματα</strong>, ό,τι κι αν είναι τα σχήματα: (1)
            βρες το φάσμα <em>βασικής ζώνης</em> κάθε καναλιού (πρόσεξε ποιος είναι sinc και
            ποιος rect — μεταμορφώνονται ανάποδα)· (2) εφάρμοσε τη διαμόρφωση —{' '}
            <em>USSB ⇒ κράτα μόνο την πάνω πλευρική ⇒ πλάτος = bandwidth μηνύματος</em>· (3)
            στοίβαξε στα φέροντα· (4) απαίτησε{' '}
            <strong>
              επόμενο φέρον ≥ προηγούμενο φέρον + πλάτος του προηγούμενου καναλιού
            </strong>
            . Αυτή η τελευταία γραμμή είναι η συνθήκη μη-επικάλυψης σε <em>κάθε</em> FDM
            άσκηση.
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>DSB-SC αντί USSB.</strong> Κάθε κανάλι γίνεται διπλής πλευρικής ⇒ το{' '}
              <InlineMath>{'m'}</InlineMath> πιάνει <InlineMath>{'2W'}</InlineMath>, το{' '}
              <InlineMath>{'k'}</InlineMath> πιάνει <InlineMath>{'8W'}</InlineMath>· η ελάχιστη
              απόσταση γίνεται <InlineMath>{'W + 4W = 5W'}</InlineMath> (άθροισμα των δύο
              μισών-ευρών) αντί <InlineMath>{'W'}</InlineMath> — <strong>πενταπλάσια</strong>{' '}
              εδώ. Γύρισε τον διακόπτη του viz σε DSB-SC και επιβεβαίωσε το «ελάχιστο = 5W».
              Αυτό ακριβώς το κόστος γλιτώνει το USSB. (Δες{' '}
              <Link
                href="/practice#exercise:pb25-th3-mux"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 3
              </Link>
              , DSB-SC FDM.)
            </li>
            <li>
              <strong>Αντίστρεψε ποιο σήμα μπαίνει χαμηλά.</strong> Βάλε το{' '}
              <InlineMath>{'k'}</InlineMath> (εύρος <InlineMath>{'4W'}</InlineMath>) στο{' '}
              <em>κάτω</em> φέρον· τώρα η ελάχιστη απόσταση πηδά στα{' '}
              <InlineMath>{'4W'}</InlineMath> — γιατί τη συνθήκη την ορίζει πάντα το{' '}
              <em>κάτω</em> κανάλι. Καλό τεστ ότι κατάλαβες το κλειδί.
            </li>
            <li>
              <strong>
                Άλλαξε το σχήμα του <InlineMath>{'k'}</InlineMath>.
              </strong>{' '}
              Αν ήταν <InlineMath>{'k(t) = \\mathrm{sinc}^2(Wt)'}</InlineMath> (τρίγωνο στη
              συχνότητα, εύρος <InlineMath>{'W'}</InlineMath>) ή άλλος ρυθμός rect,
              ξαναϋπολόγισε μόνο το εύρος — τα τέσσερα βήματα μένουν ίδια. (Δες{' '}
              <Link
                href="/practice#exercise:proodos26-11"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Απρ. 2026 ΘΕΜΑ 11
              </Link>
              .)
            </li>
          </ul>
        </div>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ΠΡΟΟΔΟΣ B · ΜΑΪΟΣ 2025 (full + nonlinear AM, ~12 problems)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'pb25-th1-1',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 1.1',
    weight: 3,
    title: 'Σ/Λ — μορφή AM (σωστή)',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.1
        </Link>.
      </>
    ),
    statement: <p>Σ/Λ: Το συμβατικά διαμορφωμένο κατά AM σήμα <InlineMath>{'x(t) = [A_c + \\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</InlineMath> έχει αυτή τη μορφή.</p>,
    solution: <p><strong>ΣΩΣΤΟ.</strong> Carrier <InlineMath>{'A_c'}</InlineMath> προστιθέμενος στο message <InlineMath>{'\\cos(2\\pi t)'}</InlineMath>, μετά πολλαπλασιασμός με carrier oscillation. Καθαρή conventional AM.</p>,
  },
  {
    id: 'pb25-th1-2',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 1.2',
    weight: 3,
    title: 'Σ/Λ — cos είναι σήμα ενέργειας',
    topic: 'foundations',
    difficulty: 'easy',
    prerequisites: ['foundations/signals'],
    formulaIds: ['cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> για κάθε cosine/sine
        πλάτους <InlineMath>{'A'}</InlineMath> — εδώ <InlineMath>{'A=1'}</InlineMath>,
        άρα <InlineMath>{'P = 1/2'}</InlineMath> (πεπερασμένη → σήμα ισχύος, ΟΧΙ ενέργειας).
        Εμφανίστηκε σε{' '}
        <strong>6</strong> παλιά θέματα (3 εξεταστικές — Σ/Λ «ισχύς vs ενέργεια» και υπολογισμοί ισχύος αθροισμάτων). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:jan26-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: <p>Σ/Λ: Το <InlineMath>{'m(t) = \\cos(2\\pi t)'}</InlineMath> είναι σήμα ενέργειας.</p>,
    solution: <p><strong>ΛΑΘΟΣ.</strong> Σήμα ισχύος. Ενέργεια άπειρη επειδή είναι περιοδικό μη-μηδενικό.</p>,
  },
  {
    id: 'pb25-th1-3',
    repeatGroup: 'tf-white-noise-gaussian',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 1.3',
    weight: 4,
    title: 'Σ/Λ — θερμικός θόρυβος ⇔ Gaussian',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/sources', 'noise/white-noise'],
    statement: <p>Σ/Λ: Ο θερμικός θόρυβος είναι ο θόρυβος του οποίου η φασματική πυκνότητα ισχύος ακολουθεί την κατανομή Gauss.</p>,
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση — ο θερμικός θόρυβος έχει δύο ξεχωριστά «πρόσωπα», σε δύο
            διαφορετικά γραφήματα.
          </strong>{' '}
          <span className="text-fg-muted">
            (1) Η <strong>κατανομή πλάτους</strong> του: αν κατέγραφες τις τιμές
            της τάσης στον χρόνο κι έφτιαχνες ιστόγραμμα, θα έβγαινε{' '}
            <strong>καμπάνα</strong> — Gaussian (amplitude domain). (2) Το{' '}
            <strong>σχήμα της PSD</strong> του: πού κάθεται η ισχύς στις
            συχνότητες — <strong>επίπεδο πάτωμα</strong>,{' '}
            <InlineMath>{'S_N(f) = N_0/2'}</InlineMath>, ίσο σε κάθε{' '}
            <InlineMath>{'f'}</InlineMath> (λευκός, frequency domain).{' '}
            <strong className="text-fg">Το κρίσιμο:</strong> η καμπάνα ζει στο
            ιστόγραμμα των τιμών, <em>όχι</em> στην PSD — η PSD δεν είναι καν
            κατανομή πιθανότητας, είναι ισχύς ανά Hz πάνω στη συχνότητα. Δύο{' '}
            <strong>ορθογώνιοι άξονες</strong>: ο ένας δεν συνεπάγεται τον άλλον.
          </span>
        </div>

        <p>
          <strong>
            ΛΑΘΟΣ — κι είναι μια «μισή αλήθεια», γι&rsquo; αυτό μπερδεύει.
          </strong>{' '}
          Το «Gaussian» <em>ισχύει</em> για τον θερμικό θόρυβο — αλλά αφορά την{' '}
          <strong>κατανομή πλάτους</strong> του: πάρα πολλά ανεξάρτητα ηλεκτρόνια
          αθροίζονται, οπότε από το CLT η τάση είναι Gaussian (
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §2
          </Link>
          ). Η εκφώνηση παίρνει αυτό το <em>αληθινό</em> γεγονός και το κολλάει
          σε <strong>λάθος άξονα</strong>: ισχυρίζεται ότι η{' '}
          <strong>PSD</strong> «ακολουθεί κατανομή Gauss». Όμως η PSD του
          θερμικού είναι <strong>επίπεδη</strong> (
          <InlineMath>{'S_N(f) = N_0/2'}</InlineMath>, σταθερή σε κάθε{' '}
          <InlineMath>{'f'}</InlineMath>) — το ακριβώς αντίθετο μιας καμπάνας. Η
          καμπάνα Gauss ζει στο ιστόγραμμα των <em>τιμών</em>, όχι στην PSD. Άρα:{' '}
          <strong>σωστό γεγονός</strong> (ο θερμικός είναι Gaussian στα{' '}
          <em>πλάτη</em>), <strong>λάθος ισχυρισμός</strong> (η PSD του «ακολουθεί
          Gauss»). Ο θερμικός είναι ακριβώς <strong>AWGN</strong> = λευκός{' '}
          <em>και</em> Gaussian ταυτόχρονα — αλλά οι δύο ιδιότητες ζουν σε
          διαφορετικά γραφήματα.
        </p>

        <p className="text-sm text-fg-muted">
          Ίδια παγίδα, σε θερμική διατύπωση, με την αδελφή Σ/Λ{' '}
          <Link
            href="/practice#exercise:jan26-th1-3"
            className="text-accent underline-offset-2 hover:underline"
          >
            Ιαν. 2026 ΘΕΜΑ 1.3
          </Link>{' '}
          — εκεί ζει η πλήρης ανάλυση: ο πίνακας 2×2 (λευκός/έγχρωμος ×
          Gaussian/μη-Gaussian) με αντιπαράδειγμα σε κάθε κελί, και το{' '}
          <strong>ανάποδο</strong> της παγίδας («κάθε Gaussian θόρυβος είναι
          λευκός» — επίσης ΛΑΘΟΣ: φιλτράρισε AWGN κι έχεις colored Gaussian). Η
          κορυφαία αυτή παγίδα της Noise group αναλύεται στο{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §6
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'pb25-th1-4',
    repeatGroup: 'tf-m3-bandwidth',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 1.4',
    weight: 5,
    title: 'Σ/Λ — M³(f) bandwidth',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-transform'],
    formulaIds: ['fourier-convolution'],
    statement: <p>Σ/Λ: Αν W είναι το φάσμα του M(f), το φάσμα του G(f)=M³(f) είναι W³.</p>,
    solution: (
      <>
        <p>
          <strong>ΛΑΘΟΣ.</strong> Δύο εύλογες αναγνώσεις του{' '}
          <InlineMath>{'M^3(f)'}</InlineMath>, καμία δεν δίνει{' '}
          <InlineMath>{'W^3'}</InlineMath>:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>Pointwise κυβισμός:</strong>{' '}
            <InlineMath>{'[M(f)]^3'}</InlineMath> — ίδιο στήριγμα με το{' '}
            <InlineMath>M(f)</InlineMath>, BW = <strong>W</strong>.
          </li>
          <li>
            <strong>Φάσμα του{' '}
            <InlineMath>{'m^3(t)'}</InlineMath>:</strong>{' '}
            <InlineMath>{'M * M * M'}</InlineMath> (συνέλιξη <em>στη συχνότητα</em>{' '}
            από πολλαπλασιασμό στον χρόνο), BW = <strong>3W</strong>.
          </li>
        </ul>
        <p>
          Παγίδα: convolution <em>στον χρόνο</em> δίνει πολλαπλασιασμό στη
          συχνότητα <em>με ίδιο BW</em>. Η συχνοτική συνέλιξη (από πολ/μο στον
          χρόνο) είναι αυτή που προσθέτει BWs.
        </p>
      </>
    ),
  },
  {
    id: 'pb25-th1-5',
    repeatGroup: 'tf-tri-envelope',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 1.5',
    weight: 5,
    title: 'Σ/Λ — Envelope FS τριγωνικού = συνημιτονοειδής',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['fourier-pair-tri'],
    statement: <p>Σ/Λ: Η περιβάλλουσα του φάσματος πλάτους του Μ/Σ Fourier ενός τριγωνικού παλμού είναι συνημιτονοειδής.</p>,
    solution: <p><strong>ΛΑΘΟΣ.</strong> Είναι <InlineMath>{'\\mathrm{sinc}^2'}</InlineMath>, όχι ημιτονο/συνημιτονοειδής.</p>,
  },
  {
    id: 'pb25-th2-1',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 2.1',
    weight: 5,
    title: 'Λόγοι DSB-SC διαμόρφωσης',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/dsb-sc'],
    statement: <p>Αναφέρετε τους βασικούς λόγους για τους οποίους επιτελούμε AM-DSB-SC διαμόρφωση στα προς μετάδοση τηλεπικοινωνιακά συστήματα.</p>,
    solution: (
      <ol className="ml-5 list-decimal text-fg-muted">
        <li><strong>Power efficiency</strong>: η = 100% (όλη η ισχύς στις sidebands, καθόλου spent στον carrier).</li>
        <li><strong>Ίδιο bandwidth</strong> με AM (2W) αλλά καλύτερη ενεργειακή απόδοση.</li>
        <li>Στρατιωτικές/ασφαλείς εφαρμογές όπου η εξοικονόμηση ισχύος είναι κρίσιμη.</li>
        <li>Stereo FM L−R sub-carrier είναι DSB-SC.</li>
        <li>NTSC chrominance ήταν DSB-SC.</li>
      </ol>
    ),
  },
  {
    id: 'pb25-th2-2',
    repeatGroup: 'am-draw-cos8pi',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 2.2',
    weight: 5,
    title: 'AM σχεδίαση cos(8πt) με 2sin(2πt)',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-signal', 'am-mu'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και ο
        δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m / A_c'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>8</strong> παλιά θέματα). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: <p>Να σχεδιαστεί το διαμορφωμένο κατά AM σήμα όταν το φέρον είναι <InlineMath>{'c(t) = \\cos(8\\pi t)'}</InlineMath> και το σήμα πληροφορίας είναι <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath>.</p>,
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Σκέψου το AM σαν ένα φέρον του οποίου το πλάτος «ανεβοκατεβαίνει» μαζί με την{' '}
            <strong>περιβάλλουσα</strong> <InlineMath>{'A_c + m(t)'}</InlineMath>. Όσο το
            message παραμένει μικρότερο από το φέρον (<InlineMath>{'\\mu = A_m/A_c \\le 1'}</InlineMath>),
            η περιβάλλουσα μένει θετική και όλα είναι ομαλά. Μόλις{' '}
            <InlineMath>{'\\mu > 1'}</InlineMath>, το message «τραβάει» την περιβάλλουσα{' '}
            <strong>κάτω από το μηδέν</strong> — κάτι αδύνατο για ένα φυσικό «ύψος». Αυτό που
            πραγματικά γίνεται: ο carrier <strong>αναστρέφει τη φάση του{' '}
            <InlineMath>{'180^\\circ'}</InlineMath></strong> σε κάθε μηδενισμό της περιβάλλουσας
            (οι <em>phase reversals</em>), και ένας envelope detector ανακτά πλέον το{' '}
            <InlineMath>{'|A_c + m(t)|'}</InlineMath> αντί για το message — η υπερδιαμόρφωση
            «σπάει» την ανάκτηση. Η εκφώνηση επίτηδες βάζει{' '}
            <InlineMath>{'A_m > A_c'}</InlineMath> για να δει αν θα το πιάσεις. (Το «γιατί» στο{' '}
            <Link
              href="/am/conventional"
              className="text-accent underline-offset-2 hover:underline"
            >
              /am/conventional §3 Υπερδιαμόρφωση
            </Link>
            .)
          </span>
        </div>

        <p>
          Από τα δεδομένα βγάζουμε τις παραμέτρους. Φέρον{' '}
          <InlineMath>{'c(t) = \\cos(8\\pi t)'}</InlineMath> →{' '}
          <InlineMath>{'A_c = 1'}</InlineMath>,{' '}
          <InlineMath>{'2\\pi f_c = 8\\pi \\Rightarrow f_c = 4'}</InlineMath> Hz. Message{' '}
          <InlineMath>{'m(t) = 2\\sin(2\\pi t)'}</InlineMath> →{' '}
          <InlineMath>{'A_m = 2'}</InlineMath>,{' '}
          <InlineMath>{'2\\pi f_m = 2\\pi \\Rightarrow f_m = 1'}</InlineMath> Hz. Συνθέτουμε το
          Conventional AM σήμα:
        </p>
        <BlockMath>{'x(t) = [A_c + m(t)]\\cos(2\\pi f_c t) = [1 + 2\\sin(2\\pi t)]\\cos(8\\pi t)'}</BlockMath>

        <p>
          <strong>(1) Δείκτης διαμόρφωσης — η πρώτη κίνηση.</strong>{' '}
          <InlineMath>{'\\mu = A_m/A_c = 2/1 = 2'}</InlineMath>, και αφού{' '}
          <InlineMath>{'\\mu > 1'}</InlineMath> έχουμε <strong>υπερδιαμόρφωση</strong>.{' '}
          <strong>Με απλά λόγια:</strong> πριν σχεδιάσεις οτιδήποτε, σύγκρινε πλάτος message{' '}
          <InlineMath>{'A_m'}</InlineMath> με πλάτος φέροντος <InlineMath>{'A_c'}</InlineMath>.
          Εδώ <InlineMath>{'A_m = 2A_c'}</InlineMath>, οπότε το σχέδιο πρέπει να δείξει
          αναστροφές — δεν είναι έγκυρη AM για envelope detection.
        </p>
        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Παγίδα:</strong> το <InlineMath>{'\\mu'}</InlineMath> είναι λόγος{' '}
          <em>πλατών</em> (<InlineMath>{'A_m/A_c'}</InlineMath>), όχι{' '}
          <InlineMath>{'A_m/f_c'}</InlineMath>. Κυκλοφορούσες λύσεις γράφουν λάθος{' '}
          «<InlineMath>{'\\mu = 2/4 = 1/2'}</InlineMath>» (πλάτος διά συχνότητα — διαστατικά
          αδύνατο). Το σωστό είναι <InlineMath>{'\\mu = 2'}</InlineMath>· το ότι η περιβάλλουσα
          πέφτει αρνητική είναι η ανεξάρτητη επιβεβαίωση.
        </div>

        <p>
          <strong>(2) Η κυματομορφή στον χρόνο.</strong> Φέρον{' '}
          <InlineMath>{'f_c = 4'}</InlineMath> Hz μέσα σε περιβάλλουσα{' '}
          <InlineMath>{'1 + 2\\sin(2\\pi t)'}</InlineMath>, που κυμαίνεται από{' '}
          <InlineMath>{'1 - 2 = -1'}</InlineMath> (στο <InlineMath>{'t = 3/4'}</InlineMath> s)
          έως <InlineMath>{'1 + 2 = 3'}</InlineMath> (στο <InlineMath>{'t = 1/4'}</InlineMath> s).
          Οι αναστροφές φάσης πέφτουν στους μηδενισμούς:
        </p>
        <BlockMath>{'1 + 2\\sin(2\\pi t) = 0 \\;\\Rightarrow\\; \\sin(2\\pi t) = -\\tfrac{1}{2}'}</BlockMath>
        <p>
          Μέσα σε μία περίοδο <InlineMath>{'T_m = 1/f_m = 1'}</InlineMath> s οι λύσεις είναι{' '}
          <InlineMath>{'t = 7/12'}</InlineMath> s και <InlineMath>{'t = 11/12'}</InlineMath> s,
          και στο ενδιάμεσο διάστημα η περιβάλλουσα είναι αρνητική (ελάχιστο{' '}
          <InlineMath>{'-1'}</InlineMath> στο <InlineMath>{'t = 3/4'}</InlineMath> s).{' '}
          <strong>Με απλά λόγια:</strong> εκεί ο carrier γυρίζει ανάποδα. Σχεδίασε το φέρον με
          πλάτος <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath> και πρόσθεσε μια αναστροφή{' '}
          <InlineMath>{'180^\\circ'}</InlineMath> σε καθένα από τα δύο σημεία. Πρόσεξε ότι{' '}
          <InlineMath>{'f_c/f_m = 4'}</InlineMath>: μόνο 4 κύκλοι φέροντος ανά περίοδο message,
          οπότε το σχέδιο θέλει προσοχή για να ξεχωρίζει η αναστροφή.
        </p>

        <figure className="my-4">
          <OvermodulationPhaseReversalViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Ο δρομέας <InlineMath>{'\\mu'}</InlineMath> φτάνει <strong>ακριβώς στο{' '}
            <InlineMath>{'2'}</InlineMath></strong> — τη δική μας τιμή (πάτα το chip{' '}
            <InlineMath>{'\\mu = 1.5'}</InlineMath> και μετά σύρε ώς το{' '}
            <InlineMath>{'2'}</InlineMath>). Πάνω panel: το <InlineMath>{'x(t)'}</InlineMath> με
            κόκκινους <span className="text-red-600 dark:text-red-400">↺</span> δείκτες στις
            αναστροφές. Μεσαίο: το <InlineMath>{'|A_c + m(t)|'}</InlineMath> να αναδιπλώνεται
            μόλις η περιβάλλουσα περάσει κάτω από το μηδέν. Κάτω: η ανακτημένη{' '}
            <InlineMath>{'\\hat{m}(t)'}</InlineMath> (μπλε) αποκλίνει από το αληθινό{' '}
            <InlineMath>{'m(t)'}</InlineMath> (πορτοκαλί) — η{' '}
            <span className="text-red-600 dark:text-red-400">κόκκινη ζώνη</span> είναι η
            παραμόρφωση και δεξιά δείχνει το RMS error. Το viz παίζει με{' '}
            <em>cosine</em> message και ενδεικτικό πλήθος κύκλων· εμείς έχουμε{' '}
            <em>sine</em> με <InlineMath>{'f_c = 4'}</InlineMath> Hz,{' '}
            <InlineMath>{'f_m = 1'}</InlineMath> Hz — το φαινόμενο (αναστροφές όπου{' '}
            <InlineMath>{'A_c + m(t) < 0'}</InlineMath>) είναι το ίδιο, αλλάζει μόνο η θέση τους
            στον χρόνο.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— «<em>σχεδιάστε το διαμορφωμένο κατά AM σήμα</em>» με έναν τόνο message:{' '}
            <strong>(α)</strong> βγάλε <InlineMath>{'A_c, f_c'}</InlineMath> από το φέρον,{' '}
            <InlineMath>{'A_m, f_m'}</InlineMath> από το message· <strong>(β)</strong>{' '}
            <InlineMath>{'\\mu = A_m/A_c'}</InlineMath> και <strong>σύγκρισή του με το{' '}
            <InlineMath>{'1'}</InlineMath></strong>· <strong>(γ)</strong> κυματομορφή = φέρον με
            πλάτος <InlineMath>{'|A_c + m(t)|'}</InlineMath>, με αναστροφές φάσης{' '}
            <em>μόνο όταν</em> <InlineMath>{'\\mu > 1'}</InlineMath>. Κράτα:{' '}
            <strong>η υπερδιαμόρφωση φαίνεται στον χρόνο (αναστροφές) και στον envelope
            detector (παραμόρφωση), όχι σαν νέες γραμμές στο φάσμα.</strong>
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— κράτα τον σκελετό, άλλαξε μία παράμετρο (σύρε τον δρομέα{' '}
            <InlineMath>{'\\mu'}</InlineMath> στο viz):
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Οριακή <InlineMath>{'\\mu = 1'}</InlineMath></strong>{' '}
              (<InlineMath>{'A_m = A_c = 1'}</InlineMath>): η περιβάλλουσα αγγίζει το μηδέν χωρίς
              να το περάσει — το ακριβές όριο, καμία αναστροφή. Στο <InlineMath>{'1.0'}</InlineMath>{' '}
              οι κόκκινες ζώνες μόλις χάνονται.
            </li>
            <li>
              <strong>Κανονική <InlineMath>{'\\mu < 1'}</InlineMath></strong>{' '}
              (<InlineMath>{'A_m = 0.5'}</InlineMath>): θετική περιβάλλουσα παντού, καθαρή
              ανάκτηση από envelope detector — η <InlineMath>{'\\hat{m}'}</InlineMath> ταυτίζεται
              με το <InlineMath>{'m'}</InlineMath> (RMS error <InlineMath>{'\\to 0'}</InlineMath>).
            </li>
            <li>
              <strong>Έξοδος envelope detector στο{' '}
              <InlineMath>{'\\mu = 2'}</InlineMath>:</strong> το{' '}
              <InlineMath>{'|1 + 2\\sin(2\\pi t)|'}</InlineMath>, με αιχμές που{' '}
              <strong>δεν διορθώνονται με LPF</strong>. Σύρε στο <InlineMath>{'2'}</InlineMath>{' '}
              και δες το ποσοστό παραμόρφωσης — γι' αυτό η έγκυρη AM θέλει{' '}
              <InlineMath>{'\\mu \\le 1'}</InlineMath>.
            </li>
          </ul>
        </div>

        <p className="mt-3 text-xs text-fg-subtle">
          Δίδυμο πρόβλημα:{' '}
          <Link
            href="/practice#exercise:pa25-th2-2"
            className="text-accent underline-offset-2 hover:underline"
          >
            Πρόοδ. Α 2025 ΘΕΜΑ 2.2
          </Link>{' '}
          — πανομοιότυπη εκφώνηση και παράμετροι (repeatGroup{' '}
          <span className="font-mono">am-draw-cos8pi</span>).
        </p>
      </>
    ),
  },
  {
    id: 'pb25-th2-3',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 2.3',
    weight: 6,
    title: 'AM-LSSB φάσμα με sinc message',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/ssb'],
    formulaIds: ['ssb-signal', 'fourier-pair-rect'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος LSSB σήματος{' '}
        <InlineMath>{'x_{LSB}(t)=A_c m(t)\\cos(2\\pi f_c t)+A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>6</strong> παλιά θέματα). Ο ζεύγος Fourier
        rect δίνεται στο τυπολόγιο. Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-11"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Απρ. 2026 ΘΕΜΑ 11
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: <p>Σχεδιάστε το φάσμα του διαμορφωμένου κατά AM-LSSB σήματος όταν <InlineMath>{'c(t) = \\cos(2\\pi f_c t)'}</InlineMath> και <InlineMath>{'m(t) = 2\\,\\mathrm{sinc}(2Wt)'}</InlineMath>.</p>,
    solution: (
      <>
        <p>
          <InlineMath>{'M(f) = (1/W)\\Pi(f/(2W))'}</InlineMath> — rect στις{' '}
          <InlineMath>{'|f| \\leq W'}</InlineMath>.
        </p>
        <p>
          DSB-SC θα είχε rect γύρω από <InlineMath>{'\\pm f_c'}</InlineMath>{' '}
          (πλάτους <InlineMath>{'\\pm W'}</InlineMath>). LSSB κρατά μόνο το{' '}
          <strong>κάτω</strong> sideband:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>Στις θετικές συχνότητες: rect από <InlineMath>{'f_c - W'}</InlineMath> έως <InlineMath>{'f_c'}</InlineMath>.</li>
          <li>Στις αρνητικές: rect από <InlineMath>{'-f_c'}</InlineMath> έως <InlineMath>{'-f_c + W'}</InlineMath>.</li>
        </ul>
        <p>Bandwidth του διαμορφωμένου = W (μισό του DSB-SC).</p>
      </>
    ),
  },
  {
    id: 'pb25-th2-4',
    repeatGroup: 'power-sum-sinusoids',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 2.4',
    weight: 6,
    title: 'Ισχύς Asin + Bcos + Ccos διαφορετικών συχνοτήτων',
    topic: 'foundations',
    difficulty: 'medium',
    prerequisites: ['foundations/fourier-series'],
    formulaIds: ['parseval-power', 'cos-power-half'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος <InlineMath>{'P = A^2/2'}</InlineMath> ανά τόνο — χρησιμοποιείται
        εδώ για κάθε από τους 3 τόνους (<InlineMath>{'(A^2 + B^2 + C^2)/2'}</InlineMath>).
        Εμφανίστηκε σε <strong>6</strong> παλιά θέματα (3 εξεταστικές). Βλ.{' '}
        <Link
          href="/practice#exercise:jan26-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.2
        </Link>,{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>,{' '}
        <Link
          href="/practice#exercise:pb25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 1.2
        </Link>.{' '}
        Επίσης: ο τύπος{' '}
        <InlineMath>{'P = \\sum_k A_k^2/2'}</InlineMath>{' '}
        (Parseval FS, parseval-power, βάρος <strong>4</strong>) επίσης λείπει — είναι το
        θεώρημα που δικαιολογεί αυτήν ακριβώς την πρόσθεση ισχύων ανά τόνο.
      </>
    ),
    statement: <p>Έστω <InlineMath>{'x(t) = A\\sin(2\\pi f_1 t) + B\\cos(2\\pi f_2 t) + C\\cos(2\\pi f_3 t)'}</InlineMath> με όλες τις f διαφορετικές. Ισχύς;</p>,
    solution: <BlockMath>{'P = \\frac{A^2 + B^2 + C^2}{2}'}</BlockMath>,
  },
  {
    id: 'pb25-th2-5',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 2.5',
    weight: 8,
    title: 'AM φάσμα Σ(10-n)cos(2πnt), n=1..6',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/conventional', 'foundations/fourier-series'],
    formulaIds: ['am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:jan26-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.1
        </Link>.
      </>
    ),
    statement: <p>Έστω <InlineMath>{'x(t) = \\sum_{n=1}^{6} (10-n)\\cos(2\\pi n t)'}</InlineMath>. Σχεδιάστε φάσμα βασικής ζώνης και υπολογίστε αρμονικές AM.</p>,
    solution: (
      <>
        <p>
          <strong>Baseband:</strong> impulses στις 1...6 Hz με ύψη{' '}
          <InlineMath>{'(10-n)/2 = 4.5, 4, 3.5, 3, 2.5, 2'}</InlineMath>.
        </p>
        <p>
          <strong>AM:</strong> 1 carrier + 6 USB + 6 LSB γύρω από{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath> = <strong>13 αρμονικές
          ανά πλευρά</strong> (26 συνολικά συμπεριλαμβανομένων αρνητικών).
        </p>
      </>
    ),
  },
  {
    id: 'pb25-th3-mux',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 3',
    weight: 25,
    title: 'AM-DSB-SC Multiplexing — sinc(Wt) + Π(Wt)',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/multiplexing', 'am/dsb-sc'],
    formulaIds: ['dsb-sc-signal', 'fdm-spacing'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος DSB-SC{' '}
        <InlineMath>{'x_{DSB}(t) = A_c m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>5</strong> παλιά θέματα) και η συνθήκη
        μη-επικάλυψης FDM-DSB-SC{' '}
        <InlineMath>{'\\Delta f \\ge 2W'}</InlineMath>{' '}
        (σε <strong>4</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:jan26-th1-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:pa25-th3-mux"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 3
        </Link>.
      </>
    ),
    statement: (
      <p>
        Έστω τα δύο σήματα βασικής ζώνης{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
        <InlineMath>{'k(t) = \\Pi(Wt)'}</InlineMath>. Το κάθε σήμα διαμορφώνεται κατά{' '}
        <strong>AM-DSB-SC</strong> με φέροντα <InlineMath>{'f_1'}</InlineMath> και{' '}
        <InlineMath>{'f_2'}</InlineMath> αντίστοιχα. <strong>(1)</strong> Αποτυπώστε σχηματικά
        το φάσμα πλάτους των δύο σημάτων <strong>βασικής ζώνης</strong> και των{' '}
        <strong>διαμορφωμένων</strong> σημάτων. <strong>(2)</strong> Πόσο πρέπει να είναι τα
        φέροντα <InlineMath>{'f_1, f_2'}</InlineMath> σε σχέση με το{' '}
        <InlineMath>{'W'}</InlineMath> ώστε να μπορούμε να αποπολυμπλέξουμε τα δύο σήματα χωρίς
        να επικαλύπτονται; <strong>(3)</strong> Αποτυπώστε σχηματικά το φάσμα του
        πολυπλεγμένου σήματος <InlineMath>{'G(f)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — η μη-επικάλυψη είναι γεωμετρία, όχι έτοιμος τύπος.
          </strong>{' '}
          <span className="text-fg-muted">
            Δύο μηνύματα, ένας δίαυλος. Το FDM τα <strong>στοιβάζει</strong> σε{' '}
            <em>διαφορετικές</em> περιοχές συχνότητας — όπως δύο ραδιοσταθμοί που δεν
            μπερδεύονται επειδή εκπέμπουν σε διαφορετικά κανάλια· στον δέκτη ένα bandpass
            φίλτρο ξεχωρίζει το καθένα. Όλο το παιχνίδι είναι οι δύο ζώνες{' '}
            <strong>να μην πατάει η μία πάνω στην άλλη</strong>.{' '}
            <strong className="text-fg">Το κλειδί αυτού του θέματος:</strong> τα δύο μηνύματα
            έχουν <em>διαφορετικό</em> bandwidth, οπότε η απάντηση{' '}
            <strong>δεν</strong> είναι ο έτοιμος κανόνας «
            <InlineMath>{'\\Delta f \\ge 2W'}</InlineMath>» — θα τη{' '}
            <em>χτίσουμε</em> από τη ζώνη που πιάνει πραγματικά κάθε κανάλι. Ο μπούσουλας:{' '}
            <em>
              η ζώνη ενός DSB-SC καναλιού = ολόκληρο το φάσμα του μηνύματος (και οι δύο
              πλευρικές) ανεβασμένο στο φέρον — δηλαδή πλάτος ίσο με{' '}
              <strong>2× το μισό-εύρος</strong> του μηνύματος
            </em>
            . Μη-επικάλυψη = η <em>δεξιά ακμή του κάτω καναλιού</em> δεν περνά την{' '}
            <em>αριστερή ακμή του πάνω</em>.
          </span>
        </div>

        <p>
          <strong>(1α) Τα φάσματα βασικής ζώνης — και η παγίδα του σχήματος.</strong> Τα δύο
          σήματα μοιάζουν στα σύμβολα, αλλά μεταμορφώνονται <em>ανάποδα</em> το ένα από το
          άλλο.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath>
            </strong>{' '}
            — ένα sinc στον <em>χρόνο</em> έχει για μετασχηματισμό ένα{' '}
            <strong>καθαρό rect</strong> (τούβλο) στη συχνότητα· είναι το ζεύγος{' '}
            <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath> του
            τυπολογίου:
            <BlockMath>{'M(f) = \\tfrac{1}{W}\\,\\Pi\\!\\left(\\tfrac{f}{W}\\right),\\qquad |f| \\le \\tfrac{W}{2}'}</BlockMath>
            Μισό-εύρος του <InlineMath>{'m'}</InlineMath>: <InlineMath>{'W/2'}</InlineMath> (το
            rect απλώνεται από <InlineMath>{'-W/2'}</InlineMath> ως{' '}
            <InlineMath>{'+W/2'}</InlineMath>).
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\Pi(Wt)'}</InlineMath>
            </strong>{' '}
            — εδώ το rect είναι στον <em>χρόνο</em> (μια απότομη «πύλη»). Απότομη ακμή στον
            χρόνο ⇒ κυματισμοί στη συχνότητα ⇒ ο μετασχηματισμός είναι{' '}
            <strong>sinc, όχι rect</strong> — το ίδιο ζεύγος διαβασμένο ανάποδα:
            <BlockMath>{'K(f) = \\tfrac{1}{W}\\,\\mathrm{sinc}\\!\\left(\\tfrac{f}{W}\\right)'}</BlockMath>
            με <strong>πρώτη ρίζα στα <InlineMath>{'|f| = W'}</InlineMath></strong>. Ενεργό
            μισό-εύρος του <InlineMath>{'k'}</InlineMath>: <InlineMath>{'W'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> το <InlineMath>{'k'}</InlineMath> είναι{' '}
          <strong>διπλάσια πλατύ</strong> από το <InlineMath>{'m'}</InlineMath> στη συχνότητα
          (μισό-εύρος <InlineMath>{'W'}</InlineMath> έναντι <InlineMath>{'W/2'}</InlineMath>) —
          και αυτή ακριβώς η <em>ανισότητα των ευρών</em> είναι που θα κάνει την απάντηση να
          μην βγει ο σχολικός κανόνας <InlineMath>{'2W'}</InlineMath>. Κράτα την.
        </p>

        <p>
          <strong>
            (1β) Τα διαμορφωμένα φάσματα — DSB-SC = «και οι δύο πλευρικές, καμία γραμμή
            φέροντος».
          </strong>{' '}
          Η DSB-SC πολλαπλασιάζει το μήνυμα με <InlineMath>{'\\cos(2\\pi f_c t)'}</InlineMath>,
          οπότε από το{' '}
          <Link href="/am/dsb-sc" className="text-accent underline-offset-2 hover:underline">
            θεώρημα διαμόρφωσης
          </Link>{' '}
          το φάσμα <em>αντιγράφεται ακέραιο</em> στα <InlineMath>{'\\pm f_c'}</InlineMath> (με
          μισό ύψος), <strong>χωρίς</strong> κρούση φέροντος (suppressed carrier — δεν
          σπαταλάς ισχύ σε γραμμή που δεν κουβαλά πληροφορία):
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            το <InlineMath>{'m'}</InlineMath> στο <InlineMath>{'f_1'}</InlineMath> πιάνει{' '}
            <InlineMath>{'[f_1 - \\tfrac{W}{2},\\, f_1 + \\tfrac{W}{2}]'}</InlineMath> (και
            κατοπτρικά <InlineMath>{'[-f_1 - \\tfrac{W}{2},\\, -f_1 + \\tfrac{W}{2}]'}</InlineMath>)
            — <strong>πλάτος ζώνης <InlineMath>{'W'}</InlineMath></strong> (= 2× το μισό-εύρος{' '}
            <InlineMath>{'W/2'}</InlineMath>)·
          </li>
          <li>
            το <InlineMath>{'k'}</InlineMath> στο <InlineMath>{'f_2'}</InlineMath> πιάνει{' '}
            <InlineMath>{'[f_2 - W,\\, f_2 + W]'}</InlineMath> (και κατοπτρικά) —{' '}
            <strong>πλάτος ζώνης <InlineMath>{'2W'}</InlineMath></strong> (= 2× το μισό-εύρος{' '}
            <InlineMath>{'W'}</InlineMath>).
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια:</strong> το πλάτος μιας DSB-SC ζώνης είναι{' '}
          <em>διπλάσιο</em> το μισό-εύρος του μηνύματος — εδώ <InlineMath>{'W'}</InlineMath> για
          το <InlineMath>{'m'}</InlineMath>, <InlineMath>{'2W'}</InlineMath> για το{' '}
          <InlineMath>{'k'}</InlineMath>. Δύο <em>διαφορετικά</em> πλάτη — αυτό είναι το όλο
          ζουμί του θέματος.
        </p>

        <p>
          <strong>(2) Η συνθήκη μη-επικάλυψης — το 12%, και το όλο νόημα του θέματος.</strong>{' '}
          Πάρε <InlineMath>{'f_1 < f_2'}</InlineMath> (το στενό <InlineMath>{'m'}</InlineMath>{' '}
          από κάτω). Για να ξεμπλέξει ο δέκτης τα δύο κανάλια με ένα BPF, οι δύο ζώνες δεν
          πρέπει να αγγίζονται — δηλαδή η <strong>δεξιά ακμή του κάτω καναλιού</strong>{' '}
          (<InlineMath>{'f_1 + W/2'}</InlineMath>) να μην περάσει την{' '}
          <strong>αριστερή ακμή του πάνω</strong> (<InlineMath>{'f_2 - W'}</InlineMath>):
        </p>
        <BlockMath>{'f_1 + \\tfrac{W}{2} \\;\\le\\; f_2 - W \\quad\\Longrightarrow\\quad \\boxed{\\,f_2 - f_1 \\ge \\tfrac{3W}{2}\\,}'}</BlockMath>
        <p>
          <strong>Γιατί <InlineMath>{'\\tfrac{3W}{2}'}</InlineMath> και όχι{' '}
          <InlineMath>{'2W'}</InlineMath> — η ανισότητα των ευρών, ρητά.</strong> Ο γενικός
          κανόνας είναι πάντα ο ίδιος:{' '}
          <em>
            ελάχιστη απόσταση = (μισό-εύρος κάτω καναλιού) + (μισό-εύρος πάνω καναλιού)
          </em>
          . Στη σχολική, <strong>ισο-εύρη</strong> περίπτωση και τα δύο μηνύματα έχουν
          μισό-εύρος <InlineMath>{'W'}</InlineMath>, οπότε{' '}
          <InlineMath>{'\\Delta f \\ge W + W = 2W'}</InlineMath> — αυτός είναι ο κανόνας
          μνήμης. Εδώ όμως το <InlineMath>{'m'}</InlineMath> είναι <em>στενότερο</em>{' '}
          (<InlineMath>{'W/2'}</InlineMath>), άρα{' '}
          <InlineMath>{'\\Delta f \\ge \\tfrac{W}{2} + W = \\tfrac{3W}{2}'}</InlineMath> —
          λιγότερο από <InlineMath>{'2W'}</InlineMath>, ακριβώς επειδή το κάτω κανάλι πιάνει
          λιγότερο χώρο. <strong>Μην γράψεις μηχανικά <InlineMath>{'2W'}</InlineMath>:</strong>{' '}
          το <InlineMath>{'2W'}</InlineMath> είναι μόνο η ειδική περίπτωση «ίσα εύρη». Χτίσε το
          νούμερο από τα δύο μισά-εύρη και θα έχεις δίκιο για <em>οποιαδήποτε</em> σήματα.
        </p>
        <p>
          <strong>Και κάτι ακόμη — κάθε φέρον ξεχωριστά, να μη διπλώσει στο DC.</strong> Η ίδια
          αρχή («ζώνες που δεν τέμνονται») ισχύει και για το <em>καθένα</em> κανάλι με το
          κατοπτρικό του στα αρνητικά: το αντίγραφο του <InlineMath>{'m'}</InlineMath> στο{' '}
          <InlineMath>{'+f_1'}</InlineMath> πιάνει{' '}
          <InlineMath>{'[f_1 - \\tfrac{W}{2}, f_1 + \\tfrac{W}{2}]'}</InlineMath>, το κατοπτρικό
          στο <InlineMath>{'-f_1'}</InlineMath> φτάνει ως{' '}
          <InlineMath>{'-f_1 + \\tfrac{W}{2}'}</InlineMath>· για να μην ακουμπήσουν στο μηδέν
          χρειάζεται <InlineMath>{'f_1 \\ge \\tfrac{W}{2}'}</InlineMath> — ο γνωστός όρος «το
          φέρον ξεπερνά το μισό-εύρος» της DSB-SC (
          <Link href="/am/dsb-sc" className="text-accent underline-offset-2 hover:underline">
            /am/dsb-sc
          </Link>
          ). Για το <InlineMath>{'k'}</InlineMath> αντίστοιχα{' '}
          <InlineMath>{'f_2 \\ge W'}</InlineMath>, αλλά αυτό ικανοποιείται{' '}
          <em>αυτόματα</em>: η απόσταση ήδη απαιτεί{' '}
          <InlineMath>{'f_2 \\ge f_1 + \\tfrac{3W}{2} \\ge 2W'}</InlineMath>. Άρα η{' '}
          <em>δεσμευτική</em> απάντηση είναι:{' '}
          <InlineMath>{'f_1 \\ge \\tfrac{W}{2}'}</InlineMath> και{' '}
          <InlineMath>{'f_2 - f_1 \\ge \\tfrac{3W}{2}'}</InlineMath> (συν ~10–20% guard band
          για τα μη-ιδανικά φίλτρα).
        </p>

        <p>
          <strong>
            (3) Το πολυπλεγμένο <InlineMath>{'G(f)'}</InlineMath>.
          </strong>{' '}
          Απλώς το άθροισμα <InlineMath>{'G(f) = X_m(f) + X_k(f)'}</InlineMath> — η{' '}
          <em>rect-DSB</em> ζώνη του <InlineMath>{'m'}</InlineMath> γύρω από{' '}
          <InlineMath>{'\\pm f_1'}</InlineMath> και η <em>sinc-DSB</em> ζώνη του{' '}
          <InlineMath>{'k'}</InlineMath> γύρω από <InlineMath>{'\\pm f_2'}</InlineMath>,
          δίπλα-δίπλα (καμία γραμμή φέροντος σε καμία). Με{' '}
          <InlineMath>{'\\Delta f \\ge \\tfrac{3W}{2}'}</InlineMath> δεν αγγίζονται ⇒ καθαρή
          αποπολυπλεξία· κάτω από αυτό ⇒ επικάλυψη ⇒ crosstalk.
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — ιδανικεύσεις.</strong> Το{' '}
          <InlineMath>{'K(f)'}</InlineMath> είναι sinc, που έχει{' '}
          <strong>ουρές που δεν τελειώνουν ποτέ</strong>: αυστηρά το{' '}
          <InlineMath>{'k'}</InlineMath> <em>δεν</em> είναι bandlimited, οπότε η DSB-SC του
          απλώνεται (ολοένα φθίνοντας) πέρα από το <InlineMath>{'f_2 + W'}</InlineMath>. Όπως
          κάθε εξεταστική, παίρνουμε την <strong>πρώτη ρίζα (<InlineMath>{'W'}</InlineMath>)</strong>{' '}
          ως το ενεργό εύρος του <InlineMath>{'k'}</InlineMath> για το σχέδιο και τη συνθήκη.
          Επίσης το σχέδιο είναι <strong>σχηματικό</strong>: τα{' '}
          <InlineMath>{'f_1, f_2'}</InlineMath> είναι αυθαίρετα φέροντα και οι άξονες
          μετριούνται σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz mBW={0.5} kBW={1} initialMod="dsb" />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>.
            Πάνω: <InlineMath>{'M(f)'}</InlineMath> = το rect μπλοκ στο{' '}
            <InlineMath>{'[-W/2, W/2]'}</InlineMath> (το bracket «<InlineMath>{'W'}</InlineMath>»
            είναι το συνολικό πλάτος)· από κάτω <InlineMath>{'K(f)'}</InlineMath> = ο sinc
            λοβός (το bracket «<InlineMath>{'2W_k = 2W'}</InlineMath> (πρώτο null)» σημαίνει
            πρώτες ρίζες στα <InlineMath>{'\\pm W'}</InlineMath> — δηλ. ενεργό μισό-εύρος{' '}
            <InlineMath>{'W'}</InlineMath>). Στο διαμορφωμένο, η <strong>DSB-SC</strong> κρατά{' '}
            <strong>και τις δύο πλευρικές χωρίς γραμμή φέροντος</strong>: το{' '}
            <InlineMath>{'m'}</InlineMath> στο{' '}
            <InlineMath>{'[f_1 - W/2, f_1 + W/2]'}</InlineMath>, το{' '}
            <InlineMath>{'k'}</InlineMath> στο <InlineMath>{'[f_2 - W, f_2 + W]'}</InlineMath>.
            Σύρε την απόσταση <InlineMath>{'\\Delta f'}</InlineMath>: η ένδειξη «ελάχιστο»
            δείχνει <InlineMath>{'W_m + W_k = 1.5W'}</InlineMath> (δηλαδή{' '}
            <InlineMath>{'\\tfrac{3W}{2}'}</InlineMath>) — κάτω από αυτό η ζώνη στο{' '}
            <InlineMath>{'G(f)'}</InlineMath> γίνεται κόκκινη (crosstalk), ακριβώς το
            υποερώτημα (2). Γύρισε τον διακόπτη σε <strong>USSB</strong> και δες τις ζώνες να{' '}
            <em>μισεύονται</em> και το «ελάχιστο» να πέφτει — αυτό ακριβώς γλιτώνει το SSB
            (πβ.{' '}
            <Link
              href="/practice#exercise:pa25-th3-mux"
              className="text-accent underline-offset-2 hover:underline"
            >
              Πρόοδ. Α 2025 ΘΕΜΑ 3
            </Link>
            , ένα ανάλογο USSB FDM πρόβλημα).
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «δύο σήματα, δύο φέροντα, σχεδίασε / συνθήκη μη-επικάλυψης», τρέξε
            τα <strong>ίδια τέσσερα βήματα</strong>, ό,τι κι αν είναι τα σχήματα: (1) βρες το
            φάσμα <em>βασικής ζώνης</em> κάθε καναλιού (πρόσεξε ποιος είναι sinc και ποιος rect
            — μεταμορφώνονται ανάποδα)· (2) εφάρμοσε τη διαμόρφωση —{' '}
            <em>DSB-SC ⇒ κράτα και τις δύο πλευρικές, καμία γραμμή φέροντος ⇒ πλάτος ζώνης = 2×
            μισό-εύρος</em>· (3) στοίβαξε στα φέροντα· (4) απαίτησε{' '}
            <strong>
              επόμενο φέρον ≥ προηγούμενο φέρον + (μισό-εύρος προηγ.) + (μισό-εύρος επόμ.)
            </strong>
            . Αυτή η τελευταία γραμμή είναι η συνθήκη μη-επικάλυψης σε <em>κάθε</em> FDM άσκηση
            — <strong>χτισμένη από τα εύρη</strong>, ποτέ ένα αποστηθισμένο{' '}
            <InlineMath>{'2W'}</InlineMath>.
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Ίσα εύρη ⇒ επιστρέφει το <InlineMath>{'2W'}</InlineMath>.</strong> Αν και
              τα δύο μηνύματα είχαν μισό-εύρος <InlineMath>{'W'}</InlineMath> (π.χ. και τα δύο
              rect στη συχνότητα), η συνθήκη γίνεται{' '}
              <InlineMath>{'\\Delta f \\ge W + W = 2W'}</InlineMath>. Δηλαδή ο «σχολικός»
              κανόνας <InlineMath>{'2W'}</InlineMath> είναι απλώς η ισο-εύρη ειδική περίπτωση
              της γενικής <InlineMath>{'(W_1 + W_2)'}</InlineMath> — καλό τεστ ότι κατάλαβες
              από πού βγαίνει.
            </li>
            <li>
              <strong>USSB αντί DSB-SC.</strong> Κάθε κανάλι κρατά <em>μία</em> πλευρική ⇒ το
              πλάτος του <strong>μισεύεται</strong> (το <InlineMath>{'m'}</InlineMath> πιάνει{' '}
              <InlineMath>{'W/2'}</InlineMath>, το <InlineMath>{'k'}</InlineMath> πιάνει{' '}
              <InlineMath>{'W'}</InlineMath>) ⇒ μικρότερη απαιτούμενη απόσταση. Γύρισε τον
              διακόπτη του διαγράμματος σε USSB και δες το «ελάχιστο» να πέφτει. Αυτό ακριβώς το
              κέρδος χωρητικότητας δίνει το SSB (
              <Link
                href="/practice#exercise:pa25-th3-mux"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Α 2025 ΘΕΜΑ 3
              </Link>
              , ανάλογο USSB FDM με πλατύτερα σήματα —{' '}
              <InlineMath>{'m{:}\\,\\mathrm{sinc}(2Wt)'}</InlineMath> (BW{' '}
              <InlineMath>{'W'}</InlineMath>),{' '}
              <InlineMath>{'k{:}\\,\\Pi(4Wt)'}</InlineMath> (πρώτη ρίζα{' '}
              <InlineMath>{'4W'}</InlineMath>) — ίδια μέθοδος μη-επικάλυψης, διαφορετικό spacing).
            </li>
            <li>
              <strong>Τρίτο κανάλι.</strong> Πρόσθεσε ένα <InlineMath>{'g(t)'}</InlineMath> στο
              φέρον <InlineMath>{'f_3 > f_2'}</InlineMath>. Η ίδια αρχή αλυσιδωτά:{' '}
              <InlineMath>{'f_3 - f_2 \\ge W_k + W_g'}</InlineMath> (το άθροισμα των μισών-ευρών
              του ζεύγους γειτόνων). Κανένα νέο τρικ — μόνο η ίδια γραμμή, εφαρμοσμένη στο
              επόμενο ζευγάρι.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 'pb25-th4-nonlinear',
    origin: 'past-exam',
    source: 'proodos-b-2025',
    problemNumber: 'ΘΕΜΑ 4',
    weight: 25,
    title: 'Μη γραμμικός AM transmitter — α, φάσμα, BPF',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/modulator-demodulator', 'foundations/filters'],
    formulaIds: ['am-signal', 'fourier-pair-rect', 'fourier-modulation-theorem', 'nonlinear-modulator-fc', 'signal-energy'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>17</strong> παλιά θέματα — σε κάθε εξεταστική) και η
        συνθήκη μη-γραμμικού modulator{' '}
        <InlineMath>{'f_c > 3W'}</InlineMath>{' '}
        (σε <strong>2</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-5"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 5
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.{' '}
        Επίσης: ο τύπος ενέργειας{' '}
        <InlineMath>{'\\mathcal{E}_x = \\int_{-\\infty}^{\\infty} |x(t)|^2\\,dt'}</InlineMath>{' '}
        (βάρος 2, δεν δίνεται στο τυπολόγιο) — χρησιμοποιείται στο sub-q (1) για να βρεθεί
        το <InlineMath>{'\\alpha = \\sqrt{2W}'}</InlineMath>. Βλ. επίσης{' '}
        <Link
          href="/practice#exercise:jun25-th2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 2
        </Link>.
      </>
    ),
    statement: (
      <p>
        Σήμα <InlineMath>{'m(t) = \\alpha\\,\\Pi(2Wt)'}</InlineMath>{' '}
        διαμορφώνεται με μη γραμμικό στοιχείο{' '}
        <InlineMath>{'y(t) = x^2(t)'}</InlineMath>, κεντρική συχνότητα{' '}
        <InlineMath>{'f_c \\gg W'}</InlineMath>,{' '}
        <InlineMath>{'c(t) = \\cos(2\\pi f_c t)'}</InlineMath>. (1) Βρες α
        ώστε ενέργεια του message = 1. (2) Φάσμα y(t). (3) Απόκριση
        ζωνοπερατού φίλτρου ώστε <InlineMath>{'z(t) = m(t)\\cos(2\\pi f_c t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Το μόνο «εργαλείο» εδώ είναι ένα τετράγωνο:{' '}
            <InlineMath>{'y = x^2'}</InlineMath> με{' '}
            <InlineMath>{'x = m + \\cos(2\\pi f_c t)'}</InlineMath>. Πολλαπλασιασμός
            στον χρόνο σημαίνει <strong>ανάμειξη συχνοτήτων</strong>, και το τετράγωνο
            πολλαπλασιάζει κάθε όρο με κάθε όρο. Βγαίνουν τρία ζευγάρια:{' '}
            <InlineMath>{'m\\times m'}</InlineMath> (βασική ζώνη × βασική ζώνη → μένει
            στο baseband αλλά <em>απλώνεται</em>),{' '}
            <InlineMath>{'m\\times\\cos'}</InlineMath> (βασική ζώνη × φέρον →{' '}
            <em>ανεβαίνει</em> γύρω από <InlineMath>{'\\pm f_c'}</InlineMath> — αυτό
            είναι DSB-SC), και <InlineMath>{'\\cos\\times\\cos'}</InlineMath> (φέρον ×
            φέρον → <em>άθροισμα</em> στα <InlineMath>{'2 f_c'}</InlineMath> και{' '}
            <em>διαφορά</em> στο DC). Το ζητούμενο{' '}
            <InlineMath>{'m\\cos'}</InlineMath> είναι ακριβώς το μεσαίο ζευγάρι — γι'
            αυτό ένα bandpass γύρω από <InlineMath>{'f_c'}</InlineMath> το βγάζει
            καθαρό.
          </span>
        </div>

        <p>
          <strong>(1) Η σταθερά α από την ενέργεια.</strong> Το{' '}
          <InlineMath>{'m(t) = \\alpha\\,\\Pi(2Wt)'}</InlineMath> είναι ένας ορθογώνιος
          παλμός ύψους <InlineMath>{'\\alpha'}</InlineMath> και διάρκειας{' '}
          <InlineMath>{'1/(2W)'}</InlineMath> (αφού{' '}
          <InlineMath>{'\\Pi(2Wt)=1'}</InlineMath> για{' '}
          <InlineMath>{'|t|<1/(4W)'}</InlineMath>). Η ενέργεια ενός παλμού είναι (ύψος)²
          × (διάρκεια):
        </p>
        <BlockMath>{'\\mathcal{E} = \\int_{-\\infty}^{\\infty}\\!\\alpha^2\\,\\Pi^2(2Wt)\\,dt = \\alpha^2\\cdot\\frac{1}{2W} = 1 \\;\\Rightarrow\\; \\boxed{\\,\\alpha = \\sqrt{2W}\\,}'}</BlockMath>
        <p>
          <strong>Με απλά λόγια:</strong> κανονικοποιούμε το πλάτος ώστε ο παλμός να
          «κουβαλά» ακριβώς μία μονάδα ενέργειας — μια καθαρή αφετηρία για τα νούμερα
          που ακολουθούν.
        </p>

        <p>
          <strong>(2) Το φάσμα της εξόδου.</strong> Η είσοδος του μη γραμμικού στοιχείου
          είναι <InlineMath>{'x(t) = m(t) + \\cos(2\\pi f_c t)'}</InlineMath>· υψώνουμε
          στο τετράγωνο και αναπτύσσουμε το{' '}
          <InlineMath>{'\\cos^2'}</InlineMath>:
        </p>
        <BlockMath>{'y = x^2 = m^2 + 2m\\cos(2\\pi f_c t) + \\cos^2(2\\pi f_c t)'}</BlockMath>
        <BlockMath>{'\\cos^2(2\\pi f_c t) = \\tfrac{1}{2} + \\tfrac{1}{2}\\cos(4\\pi f_c t)'}</BlockMath>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Λεπτομέρεια.</strong> Αυστηρά, ένα rect στον χρόνο
          έχει φάσμα <InlineMath>{'\\mathrm{sinc}'}</InlineMath> (με ουρές πέρα από το{' '}
          <InlineMath>{'W'}</InlineMath>). Για το φάσμα δουλεύουμε με το <em>nominal</em>{' '}
          bandwidth <InlineMath>{'W'}</InlineMath> του message — το ίδιο{' '}
          <InlineMath>{'W'}</InlineMath> που εννοεί το{' '}
          <InlineMath>{'f_c\\gg W'}</InlineMath> — και το θεωρούμε περιορισμένο στο{' '}
          <InlineMath>{'[-W,W]'}</InlineMath> (η σύμβαση του κεφαλαίου που δίνει την
          καθαρή συνθήκη <InlineMath>{'f_c>3W'}</InlineMath>). Το{' '}
          <InlineMath>{'\\Pi(2Wt)'}</InlineMath> μάς χρειάστηκε κυρίως για να κλειδώσει
          την ενέργεια στο (1).
        </div>

        <p>Άρα στο φάσμα ζουν <strong>τέσσερα</strong> κομμάτια:</p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong><InlineMath>{'m^2'}</InlineMath></strong> — βασική ζώνη. Με{' '}
            <InlineMath>{'m'}</InlineMath> στο <InlineMath>{'[-W,W]'}</InlineMath>, το{' '}
            <InlineMath>{'m^2'}</InlineMath> έχει εύρος <InlineMath>{'2W'}</InlineMath> (η
            συνέλιξη <InlineMath>{'M*M'}</InlineMath> διπλασιάζει το στήριγμα — δες{' '}
            <Link
              href="/practice#exercise:proodos26-8"
              className="text-accent underline-offset-2 hover:underline"
            >
              Πρόοδ. Απρ. 2026 ΘΕΜΑ 8
            </Link>
            ).
          </li>
          <li>
            <strong><InlineMath>{'2m\\cos(2\\pi f_c t)'}</InlineMath></strong> — DSB-SC
            ζώνη στο <InlineMath>{'[f_c-W,\\,f_c+W]'}</InlineMath> (και κατοπτρικά στο{' '}
            <InlineMath>{'-f_c'}</InlineMath>). Εδώ ζει το σήμα που θέλουμε.
          </li>
          <li>
            <strong>DC</strong> — το <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> από το{' '}
            <InlineMath>{'\\cos^2'}</InlineMath>: μια κρούση στο{' '}
            <InlineMath>{'f=0'}</InlineMath>.
          </li>
          <li>
            <strong><InlineMath>{'\\pm 2f_c'}</InlineMath> harmonic</strong> — το{' '}
            <InlineMath>{'\\tfrac{1}{2}\\cos(4\\pi f_c t)'}</InlineMath>: κρούσεις στα{' '}
            <InlineMath>{'\\pm 2f_c'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Πρόσεξε τι ΔΕΝ υπάρχει:</strong> επειδή είναι <em>καθαρό</em> τετράγωνο
          (<InlineMath>{'y=x^2'}</InlineMath>, χωρίς γραμμικό όρο{' '}
          <InlineMath>{'d_1 x'}</InlineMath>), <strong>δεν υπάρχει γραμμή carrier στα{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath></strong> — ο carrier θα εμφανιζόταν μόνο
          από έναν όρο <InlineMath>{'d_1\\cos(2\\pi f_c t)'}</InlineMath>, που εδώ λείπει.
        </p>

        <figure className="my-4">
          <NonlinearModulatorSpectrumViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Το viz σχεδιάζει τη <em>γενική</em> μη γραμμικότητα{' '}
            <InlineMath>{'d_1 v + d_2 v^2'}</InlineMath>. Για το δικό μας{' '}
            <em>καθαρό</em> τετράγωνο βάλε νοερά{' '}
            <InlineMath>{'d_1=0'}</InlineMath>: εξαφανίζονται <strong>και η μπλε{' '}
            <InlineMath>{'d_1 m'}</InlineMath> baseband ζώνη και η βιολετί γραμμή carrier
            στα <InlineMath>{'\\pm f_c'}</InlineMath></strong>. Μένουν ακριβώς τα δικά
            μας: κόκκινο <InlineMath>{'m^2'}</InlineMath> (εύρος{' '}
            <InlineMath>{'2W'}</InlineMath>), πράσινη DSB-SC ζώνη, DC + οι κρούσεις στα{' '}
            <InlineMath>{'\\pm 2f_c'}</InlineMath>, και το αμπερ παράθυρο του BPF. Σύρε το{' '}
            <InlineMath>{'f_c/W'}</InlineMath>: πάνω από το <InlineMath>{'3'}</InlineMath>{' '}
            η ένδειξη είναι πράσινη (καθαρή απομόνωση)· κάτω από το{' '}
            <InlineMath>{'3'}</InlineMath> η κόκκινη <InlineMath>{'m^2'}</InlineMath> ζώνη
            ξεχειλίζει μέσα στο BPF — αυτή ακριβώς είναι η συνθήκη του (3).
          </figcaption>
        </figure>

        <p>
          <strong>(3) Το ζωνοπερατό φίλτρο.</strong> Θέλουμε στην έξοδο{' '}
          <InlineMath>{'z(t) = m(t)\\cos(2\\pi f_c t)'}</InlineMath>. Στο{' '}
          <InlineMath>{'y'}</InlineMath> έχουμε τον όρο{' '}
          <InlineMath>{'2m\\cos(2\\pi f_c t)'}</InlineMath> — <em>διπλάσιο</em> του
          ζητούμενου. Άρα το BPF πρέπει (α) να κρατήσει μόνο τη ζώνη γύρω από{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath> (πετώντας{' '}
          <InlineMath>{'m^2'}</InlineMath>, DC και <InlineMath>{'\\pm 2f_c'}</InlineMath>)
          και (β) να έχει gain <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> ώστε να φύγει ο
          συντελεστής 2:
        </p>
        <BlockMath>{'H(f) = \\tfrac{1}{2}\\,\\Pi\\!\\left(\\frac{f - f_c}{2W}\\right) + \\tfrac{1}{2}\\,\\Pi\\!\\left(\\frac{f + f_c}{2W}\\right)'}</BlockMath>
        <p>
          Δηλαδή ιδανικό BPF εύρους <InlineMath>{'2W'}</InlineMath> κεντραρισμένο στο{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath>, με κέρδος{' '}
          <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> στο passband. Για να{' '}
          <em>χωράει</em> καθαρά — να μην μπει το <InlineMath>{'m^2'}</InlineMath> (εύρος{' '}
          <InlineMath>{'2W'}</InlineMath>) μέσα στο αριστερό άκρο{' '}
          <InlineMath>{'f_c-W'}</InlineMath> του BPF:
        </p>
        <BlockMath>{'f_c - W > 2W \\;\\Rightarrow\\; \\boxed{\\,f_c > 3W\\,}'}</BlockMath>
        <p>
          Είναι <strong>αυστηρότερη</strong> από το γενικό{' '}
          <InlineMath>{'f_c\\gg W'}</InlineMath> — μια κλασική εξεταστική παγίδα (η
          γεωμετρία ζει στο{' '}
          <Link
            href="/am/modulator-demodulator"
            className="text-accent underline-offset-2 hover:underline"
          >
            /am/modulator-demodulator §1b
          </Link>
          · σύρε και το viz παραπάνω).
        </p>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— όταν δεις <em>μη γραμμικό στοιχείο</em> με{' '}
            <InlineMath>{'m + \\cos'}</InlineMath> στην είσοδο:{' '}
            <strong>ανάπτυξε το τετράγωνο</strong>. Ο cross-term{' '}
            <InlineMath>{'2m\\cos'}</InlineMath> <strong>ΕΙΝΑΙ</strong> το DSB-SC σήμα·
            το <InlineMath>{'m^2'}</InlineMath> είναι ο «μπελάς» στη βασική ζώνη και το{' '}
            <InlineMath>{'\\cos^2'}</InlineMath> δίνει DC +{' '}
            <InlineMath>{'2f_c'}</InlineMath>. Ένα BPF (gain{' '}
            <InlineMath>{'\\tfrac{1}{2}'}</InlineMath>) απομονώνει το DSB-SC, και η μόνη
            συνθήκη που πρέπει να γράψεις είναι <InlineMath>{'f_c>3W'}</InlineMath>{' '}
            (γιατί το <InlineMath>{'m^2'}</InlineMath> έχει εύρος{' '}
            <InlineMath>{'2W'}</InlineMath>).
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted">
            {' '}— ίδιος σκελετός, αλλαγμένη μία παράμετρος:
          </span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>Διαφορετικό message.</strong> Άλλαξε το{' '}
              <InlineMath>{'\\Pi(2Wt)'}</InlineMath> σε τριγωνικό ή{' '}
              <InlineMath>{'\\mathrm{sinc}'}</InlineMath>: το (1) αλλάζει (άλλο
              ολοκλήρωμα ενέργειας → άλλο <InlineMath>{'\\alpha'}</InlineMath>), αλλά το
              φάσμα του (2) έχει <em>ακριβώς</em> την ίδια δομή (<InlineMath>{'m^2'}</InlineMath>{' '}
              baseband, DSB-SC, DC, <InlineMath>{'2f_c'}</InlineMath>).
            </li>
            <li>
              <strong><InlineMath>{'f_c < 3W'}</InlineMath></strong> (π.χ.{' '}
              <InlineMath>{'f_c=2W'}</InlineMath>): το <InlineMath>{'m^2'}</InlineMath>{' '}
              (άκρο στο <InlineMath>{'2W'}</InlineMath>) μπαίνει στο BPF (αριστερό άκρο{' '}
              <InlineMath>{'f_c-W=W'}</InlineMath>) → το <InlineMath>{'z(t)'}</InlineMath>{' '}
              βγαίνει <em>παραμορφωμένο</em>. Σύρε το viz κάτω από το{' '}
              <InlineMath>{'3'}</InlineMath> και δες την ένδειξη να γίνεται κόκκινη.
            </li>
            <li>
              <strong>Με κυβικό όρο</strong> <InlineMath>{'d_3 v^3'}</InlineMath>:
              εμφανίζονται επιπλέον όροι στα <InlineMath>{'\\pm 3f_c'}</InlineMath> και το
              baseband απλώνεται σε <InlineMath>{'3W'}</InlineMath> — η συνθήκη
              non-overlap γίνεται ακόμη αυστηρότερη. Καλή «τι αλλάζει;» ερώτηση.
            </li>
          </ul>
        </div>
      </>
    ),
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LECTURE EXERCISES (sessions 14, 15) — secondary priority
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'lec-am-1',
    origin: 'lecture',
    problemNumber: 'Session 14 — Άσκηση 1',
    title: 'μ για διάφορα A_c (lecture)',
    topic: 'am',
    difficulty: 'easy',
    prerequisites: ['am/conventional'],
    formulaIds: ['am-mu', 'am-signal'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο δείκτης διαμόρφωσης{' '}
        <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>{' '}
        (εμφανίστηκε σε <strong>8</strong> παλιά θέματα) και ο τύπος{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        (σε <strong>17</strong>). Βλ. π.χ.{' '}
        <Link
          href="/practice#exercise:proodos26-1"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 1
        </Link>{' '}
        και{' '}
        <Link
          href="/practice#exercise:sept25-th1-2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.2
        </Link>.
      </>
    ),
    statement: <p>m(t) = a sin(πt/4) με a=0.5, f_c=2 Hz. Βρες μ για A_c ∈ {'{2, 1, 0.75, 0.5, 0.33, 0.25}'}.</p>,
    solution: (
      <>
        <p>μ = 0.5/A_c. Τιμές: 0.25, 0.5, 0.66, 1.0, 1.51, 2.0. Overmodulation για A_c &lt; 0.5.</p>
      </>
    ),
  },
  {
    id: 'lec-fm-1',
    origin: 'lecture',
    problemNumber: 'Session 15 — Άσκηση 1',
    title: 'PM/FM για m=αcos(2πf_m t) (lecture)',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea', 'fm/pm'],
    formulaIds: ['fm-single-tone', 'pm-signal'],
    statement: <p>m(t) = α cos(2π f_m t). Βρες τα διαμορφωμένα PM και FM σήματα.</p>,
    solution: (
      <>
        <BlockMath>{'x_{PM} = A_c\\cos[2\\pi f_c t + \\beta_p\\cos(2\\pi f_m t)]'}</BlockMath>
        <BlockMath>{'x_{FM} = A_c\\cos[2\\pi f_c t + \\beta_f\\sin(2\\pi f_m t)]'}</BlockMath>
        <p>Διαφορά: cos vs sin (90° μετατόπιση από ολοκλήρωμα).</p>
      </>
    ),
  },
  {
    id: 'lec-fm-3',
    origin: 'lecture',
    problemNumber: 'Session 15 — Άσκηση 3',
    title: 'FM Bessel σε στενό BPF (lecture)',
    topic: 'fm',
    difficulty: 'hard',
    prerequisites: ['fm/bessel', 'fm/carson'],
    formulaIds: ['fm-bessel-sidebands', 'fm-bessel-property', 'fm-power'],
    statement: <p>m(t)=8cos(16πt), K_f=10 Hz/V, A_c=8, f_c=2 kHz. BPF f_c=2 kHz, BW=64 Hz. Ισχύς εξόδου & ποσοστό.</p>,
    solution: (
      <>
        <p>β=10. BPF αφήνει |n|≤4. P_u ≈ 11.1 W. P_x = 32 W. Ποσοστό ~34.7%.</p>
      </>
    ),
  },
  {
    id: 'lec-rp-1',
    origin: 'lecture',
    problemNumber: 'Session 10 — Άσκηση 1',
    title: 'Joint statistics δύο τυχαίων διαδικασιών (lecture)',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/random-processes', 'randomness/stationarity'],
    formulaIds: ['random-mean', 'random-autocorr', 'random-cross'],
    statement: <p>X(t)=Acos(2πf₁t+φ), φ~U[0,π]; Y(t)=αcos(2πf₂t), α~U[0,2]. φ,α ανεξάρτητα. Βρες m_X, m_Y, R_X, R_XY, C_XY.</p>,
    solution: (
      <>
        <BlockMath>{'m_X = -\\frac{2A}{\\pi}\\sin(2\\pi f_1 t),\\; m_Y = \\cos(2\\pi f_2 t)'}</BlockMath>
        <BlockMath>{'R_X = \\frac{A^2}{2}\\cos(2\\pi f_1(t_1-t_2))'}</BlockMath>
        <BlockMath>{'R_{XY} = m_X m_Y,\\quad C_{XY} = 0'}</BlockMath>
        <p>Uncorrelated αλλά όχι orthogonal (R_XY ≠ 0).</p>
      </>
    ),
  },
  {
    id: 'lec-rp-2',
    origin: 'lecture',
    problemNumber: 'Session 10 — Άσκηση 5',
    title: 'Ergodicity random-phase cosine (lecture)',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['randomness/stationarity'],
    formulaIds: ['random-phase-cosine', 'wss'],
    statement: <p>Z(t)=Acos(2πft+θ), θ~U[0,2π]. Δείξε ότι είναι WSS και ergodic στον μέσο και την αυτοσυσχέτιση.</p>,
    solution: (
      <>
        <p>m_Z=0, R_Z(τ)=(A²/2)cos(2πfτ) → WSS.</p>
        <p>Time-avg → 0 = m_Z (sin φραγμένος, T→∞). Time-avg autocorr → R_Z. Ergodic ✓</p>
      </>
    ),
  },
]
