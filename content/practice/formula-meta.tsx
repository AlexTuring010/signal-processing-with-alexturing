/**
 * Per-entry intuition + derivation sketch for /formulas accordion
 * expansion. Kept separate from `formulas.tsx` so the data shape there
 * stays clean (the τυπολόγιο mirror) — this file is purely the UI-layer
 * teaching prose that fills in the expansion.
 *
 * Contract:
 *   - `intuition`: 2-3 short sentences. The "what this is really saying"
 *     in plain Greek + English technical terms.
 *   - `derivation`: 1-2 line sketch — enough to remember the route, not
 *     the full derivation (that's in `derivedIn`).
 *
 * Both fields are optional; missing entries just don't render that
 * portion of the expansion.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import { InlineMath } from '@/components/math'

export type FormulaMeta = {
  intuition?: ReactNode
  derivation?: ReactNode
}

export const FORMULA_META: Record<string, FormulaMeta> = {
  // ── Foundations · Signal definitions + properties ────────────
  'signal-energy': {
    intuition: (
      <>
        Φαντάσου το σήμα σαν τάση πάνω σε αντίσταση 1 Ω: στιγμιαία ισχύς είναι <InlineMath>{'|x(t)|^2'}</InlineMath>,
        και η <strong>συνολική ενέργεια</strong> είναι το ολοκλήρωμά της σε όλο τον χρόνο. Όταν αυτή είναι
        πεπερασμένη και θετική, το σήμα ονομάζεται <em>energy signal</em> (π.χ. ορθογώνιος παλμός,
        φθίνον εκθετικό). Cosine, sin, σταθερά — όλα έχουν άπειρη ενέργεια.
      </>
    ),
    derivation: <>Άμεσος ορισμός από τη φυσική (Joules), πρωτότυπο στο slide 21 του deck.</>,
  },
  'signal-power': {
    intuition: (
      <>
        Όταν η ενέργεια αποκλίνει (cosine, σταθερά, οτιδήποτε δεν φθίνει), ρωτάμε «πόση ενέργεια ανά
        δευτερόλεπτο κατά μέσο όρο;» Αυτή η μέση ισχύς είναι πεπερασμένη όταν το σήμα είναι περιοδικό ή
        στατιστικά «σταθερής έντασης». Power signal αν <InlineMath>{'0 < \\mathcal{P}_x < \\infty'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        Πρόσεξε τη σύμβαση των διαφανειών: <InlineMath>{'\\frac{1}{2T}\\int_{-T}^{T}'}</InlineMath> (συμμετρικό
        ±T) — όχι <InlineMath>{'\\frac{1}{T}\\int_{0}^{T}'}</InlineMath>. Αποτέλεσμα το ίδιο για κάθε
        σταθερό σήμα, αλλά οι τύποι «κουμπώνουν» μόνο με τη συμμετρική.
      </>
    ),
  },
  'cos-power-half': {
    intuition: (
      <>
        Το πιο εξεταζόμενο fact για περιοδικά σήματα ισχύος. Επειδή{' '}
        <InlineMath>{'\\cos^2\\theta = \\tfrac{1+\\cos(2\\theta)}{2}'}</InlineMath>, ο δεύτερος όρος
        έχει μέσο 0 και μένει το <InlineMath>{'A^2/2'}</InlineMath>. Ισχύει ανεξάρτητα από φάση{' '}
        <InlineMath>{'\\phi'}</InlineMath>. Στις εξετάσεις εμφανίζεται απλώς ως «το cosine έχει P = A²/2».
      </>
    ),
    derivation: (
      <>
        Δες την παραγωγή στο{' '}
        <a href="/foundations/signals#energy-power" className="text-accent hover:underline">
          /foundations/signals · §Ενέργεια και Ισχύς
        </a>
        .
      </>
    ),
  },
  'iq-decomposition': {
    intuition: (
      <>
        Η «canonical form» κάθε real bandpass σήματος. Από την τριγωνομετρική{' '}
        <InlineMath>{'\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta'}</InlineMath>{' '}
        το <InlineMath>{'A(t)\\cos(2\\pi f_c t + \\theta(t))'}</InlineMath> γράφεται σαν προβολή
        in-phase / quadrature. Όλα τα modulation schemes (AM, DSB, SSB, FM, PM) είναι απλά
        διαφορετική επιλογή των <InlineMath>{'x_I, x_Q'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        Slide 16 του deck. Παραγωγή στο{' '}
        <a href="/foundations/signals#iq" className="text-accent hover:underline">
          /foundations/signals · §I/Q
        </a>
        .
      </>
    ),
  },
  'even-odd-decomposition': {
    intuition: (
      <>
        Κάθε σήμα σπάει μοναδικά σε ένα άρτιο και ένα περιττό μέρος. Δεν είναι μαθηματικό κόλπο —
        στους Fourier συντελεστές το άρτιο μέρος δίνει cosines (πραγματικό spectrum) και το περιττό
        δίνει sines (φανταστικό), οπότε η διάσπαση απλοποιεί δεκάδες ολοκληρώματα.
      </>
    ),
    derivation: <>Slide 18 του deck. Άμεσος έλεγχος: αντικατάσταση t → −t.</>,
  },
  'delta-sifting': {
    intuition: (
      <>
        Η δ «σαρώνει» το x(t) και επιστρέφει την τιμή του στο σημείο όπου είναι μη μηδενική η δ. Αυτή
        η μία ιδιότητα είναι η ραχοκοκαλιά της <strong>convolution</strong> και της{' '}
        <strong>impulse response</strong> των LTI συστημάτων — γι' αυτό η δ αξίζει χρόνο τώρα.
      </>
    ),
    derivation: <>Slide 34 του deck.</>,
  },
  'delta-properties': {
    intuition: (
      <>
        Η δ είναι <strong>άρτια</strong> (συμμετρική γύρω από το t=0) και «κλιμακώνεται» με το{' '}
        <InlineMath>{'1/|a|'}</InlineMath>: συμπίεση χρόνου διπλασιάζει το «ύψος» της — λογικό
        αφού το εμβαδό πρέπει να μένει 1.
      </>
    ),
    derivation: <>Slide 33-34. Συνέπεια του ορίσματος ως όριο rect(t/ε)/ε.</>,
  },
  'discrete-periodic-condition': {
    intuition: (
      <>
        Στο διακριτό χρόνο το <InlineMath>{'\\cos(\\omega n)'}</InlineMath> κλείνει κύκλο όχι κάθε{' '}
        <InlineMath>{'2\\pi/\\omega'}</InlineMath> «χρόνου» αλλά κάθε{' '}
        <strong>ακέραιο</strong> πλήθος δειγμάτων N. Άρα <InlineMath>{'2\\pi/\\omega'}</InlineMath>{' '}
        πρέπει να γράφεται σαν N/m, αλλιώς δεν υπάρχει N. Η παγίδα: cos(n/4) ΔΕΝ είναι περιοδικό.
      </>
    ),
    derivation: <>Slide 11-12. Συνθήκη ωN = 2π m.</>,
  },
  'continuous-periodic-condition': {
    intuition: (
      <>
        Για να επανέλθουν δύο cosines ταυτόχρονα στην αρχική τους τιμή, χρειάζονται ακέραιες πολλαπλά
        των περιόδων τους που να συμπίπτουν. Αυτό συμβαίνει μόνο αν ο λόγος T₁/T₂ γράφεται σαν p/q.
        Άρρητος λόγος → ποτέ δεν αλληλο-καλύπτονται ακριβώς.
      </>
    ),
    derivation: <>Slide 10. k₁T₁ = k₂T₂ = T ⇒ T₁/T₂ = k₂/k₁ ∈ ℚ.</>,
  },
  'dc-rms': {
    intuition: (
      <>
        Το <strong>DC</strong> είναι ο μέσος όρος του σήματος (η «σταθερή συνιστώσα»). Το{' '}
        <strong>RMS</strong> είναι το ισοδύναμο DC επίπεδο που θα έδινε την ίδια ισχύ — δηλαδή
        <InlineMath>{'\\sqrt{\\mathcal{P}_x}'}</InlineMath>. Για cosine: DC = 0, RMS = A/√2.
      </>
    ),
    derivation: <>Slide 26.</>,
  },

  // ── Foundations · Systems / LTI / convolution / eigenfunction ──
  'convolution-definition': {
    intuition: (
      <>
        Ένα ΓΧΑ σύστημα δουλεύει σε <strong>κάθε σήμα</strong> με μία και μόνο πράξη: τη συνέλιξη
        της εισόδου με την κρουστική απόκριση. Η συνέλιξη προκύπτει αναγκαστικά από τρεις
        ιδιότητες: (1) sifting της <InlineMath>{'\\delta'}</InlineMath>, (2) χρονική
        αμεταβλητότητα, (3) γραμμικότητα. Δύο εναλλακτικές μορφές, ισοδύναμες λόγω αντιμεταθετικής.
      </>
    ),
    derivation: <>Slide 4. Παραγωγή στο /foundations/systems §3.</>,
  },
  'convolution-properties': {
    intuition: (
      <>
        Οι τρεις βασικές αλγεβρικές ιδιότητες της συνέλιξης αντιστοιχούν σε φυσικές
        διατάξεις: <strong>cascade</strong> = δύο LTI σε σειρά, <strong>parallel</strong> = δύο LTI
        παράλληλα (με άθροιση), <strong>ταυτοτική</strong> = το <InlineMath>{'\\delta'}</InlineMath>{' '}
        είναι το «ουδέτερο» στοιχείο (καθαρή καθυστέρηση μέσω <InlineMath>{'\\delta(t-t_0)'}</InlineMath>).
      </>
    ),
    derivation: <>Slides 6-8.</>,
  },
  'lti-eigenfunction': {
    intuition: (
      <>
        Το <strong>πιο σημαντικό αποτέλεσμα</strong> για ΓΧΑ συστήματα: τα complex
        exponentials είναι «eigenfunctions» — περνούν αναλλοίωτα, μόνο πολλαπλασιάζονται με
        έναν μιγαδικό αριθμό <InlineMath>{'H(f_0)'}</InlineMath>. Καμία αλλαγή σχήματος,
        καμία νέα συχνότητα. Όλη η Fourier θεωρία στηρίζεται σε αυτό.
      </>
    ),
    derivation: (
      <>
        Slide 16. Βγάλε το <InlineMath>{'A\\,e^{j(2\\pi f_0 t + \\varphi)}'}</InlineMath> έξω από
        το ολοκλήρωμα της συνέλιξης — αυτό που μένει είναι ακριβώς το{' '}
        <InlineMath>{'H(f_0)'}</InlineMath>.
      </>
    ),
  },
  'lti-frequency-response': {
    intuition: (
      <>
        Το <InlineMath>{'H(f)'}</InlineMath> είναι ο μετασχηματισμός Fourier της κρουστικής
        απόκρισης (αυτό αποδεικνύεται φόρμαλ στο FT chapter). Πακετάρει τα{' '}
        <strong>δύο νούμερα ανά συχνότητα</strong> που χρειάζεσαι: το μέτρο (πόσο scaling) και
        τη φάση (πόση χρονική ολίσθηση).
      </>
    ),
    derivation: <>Slide 16, ορίζεται μέσα στην παραγωγή του eigenfunction property.</>,
  },
  'lti-cosine-response': {
    intuition: (
      <>
        Το πρακτικό αποτέλεσμα για κάθε real cosine είσοδο — corollary του slide-16 μέσω Euler.
        <strong> Cosine ίδιας συχνότητας έξω</strong>, με πλάτος{' '}
        <InlineMath>{'A|H(f_0)|'}</InlineMath> και φάση{' '}
        <InlineMath>{'\\varphi + \\angle H(f_0)'}</InlineMath>. Καμία συνέλιξη χρειάζεται όταν
        η είσοδος είναι sinusoid — μόνο τα δύο νούμερα <InlineMath>{'|H|, \\angle H'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        Euler split: cos = ζεύγος <InlineMath>{'e^{\\pm j 2\\pi f_0 t}'}</InlineMath>. Εφαρμογή
        slide-16 σε κάθε όρο + conjugate symmetry <InlineMath>{'H(-f_0) = H^*(f_0)'}</InlineMath>{' '}
        για real h ⇒ real cosine έξω.
      </>
    ),
  },
  'bibo-stability': {
    intuition: (
      <>
        Ένα LTI είναι ευσταθές «BIBO» (Bounded Input → Bounded Output) ακριβώς όταν η
        κρουστική απόκριση είναι <strong>απολύτως ολοκληρώσιμη</strong>. Διαισθητικά: αν η
        «μάζα» της <InlineMath>{'h(t)'}</InlineMath> δεν συγκλίνει, ένα φραγμένο σήμα μπορεί να
        συνελιχθεί και να δώσει άπειρη απόκριση. Όλα τα φυσικά συστήματα που μας ενδιαφέρουν
        είναι BIBO-σταθερά.
      </>
    ),
    derivation: <>Άμεση συνέπεια της τριγωνικής ανισότητας στο ολοκλήρωμα της συνέλιξης.</>,
  },

  // ── Foundations · Σειρές Fourier ─────────────────────────────
  'fourier-series-synthesis': {
    intuition: (
      <>
        Η <strong>εξίσωση σύνθεσης</strong>: ένα periodic σήμα είναι, εξ ορισμού, ένας
        γραμμικός συνδυασμός <strong>αρμονικά συσχετισμένων</strong> εκθετικών — ένα
        για κάθε ακέραιο <InlineMath>k</InlineMath>. Οι μιγαδικοί συντελεστές{' '}
        <InlineMath>a_k</InlineMath> κουβαλάνε «πόσο» και «σε ποια φάση» μπαίνει κάθε
        αρμονική. Είναι η συνεχής εκδοχή του «<em>κάθε διάνυσμα = γραμμικός συνδυασμός
        unit vectors</em>».
      </>
    ),
    derivation: (
      <>
        Προκύπτει σαν συνέπεια του ότι το σύνολο{' '}
        <InlineMath>{'\\{e^{j2\\pi k f_0 t}\\}_{k\\in\\mathbb{Z}}'}</InlineMath> είναι{' '}
        <em>πλήρες</em> για periodic συναρτήσεις περιόδου <InlineMath>T_0</InlineMath>{' '}
        (Dirichlet, slide 28 του deck).
      </>
    ),
  },
  'fourier-series-analysis': {
    intuition: (
      <>
        Η <strong>εξίσωση ανάλυσης</strong>: μας δίνει τον τρόπο να{' '}
        <em>εξάγουμε</em> κάθε <InlineMath>a_k</InlineMath> από το σήμα μέσω ενός
        ολοκληρώματος — ακριβώς όπως το εσωτερικό γινόμενο{' '}
        <InlineMath>{'\\vec v\\cdot\\hat i'}</InlineMath> εξάγει την x-συντεταγμένη
        ενός διανύσματος. Το «κλειδί» που κάνει το ολοκλήρωμα να δουλεύει είναι η{' '}
        ορθογωνιότητα των αρμονικών (όλοι οι άλλοι όροι μηδενίζονται).
      </>
    ),
    derivation: (
      <>
        Πολλαπλασιάζεις τη σύνθεση με <InlineMath>{'e^{-j2\\pi m f_0 t}'}</InlineMath>{' '}
        και ολοκληρώνεις σε μία περίοδο — όλοι οι όροι εκτός από{' '}
        <InlineMath>k = m</InlineMath> εξαφανίζονται λόγω ορθογωνιότητας, μένει{' '}
        <InlineMath>a_m\cdot T_0</InlineMath>. Slides 29-30 του deck.
      </>
    ),
  },
  'fourier-series-dual-form': {
    intuition: (
      <>
        Η <strong>πραγματική</strong> ή <em>cosine</em> μορφή της σειράς. Για κάθε
        real σήμα η συζυγής συμμετρία{' '}
        <InlineMath>{'a_{-k} = a_k^{*}'}</InlineMath> ζευγαρώνει το{' '}
        <InlineMath>+k</InlineMath> με το <InlineMath>-k</InlineMath> σε ένα μόνο
        cosine αρμονικής <InlineMath>k</InlineMath>. Πιο ανθρώπινη γραφή για
        υπολογισμούς ισχύος και για να «βλέπεις» το σήμα — αλλά τα ολοκληρώματα της
        ανάλυσης είναι πιο καθαρά στη μιγαδική μορφή.
      </>
    ),
    derivation: (
      <>
        Από Euler:{' '}
        <InlineMath>{'a_k e^{j\\theta} + a_{-k} e^{-j\\theta} = 2|a_k|\\cos(\\theta + \\angle a_k)'}</InlineMath>{' '}
        όταν <InlineMath>{'a_{-k} = a_k^*'}</InlineMath>. Άρα{' '}
        <InlineMath>{'A_k = 2|a_k|'}</InlineMath>, <InlineMath>{'\\varphi_k = \\angle a_k'}</InlineMath>.
      </>
    ),
  },
  'fourier-orthogonality': {
    intuition: (
      <>
        Ο λόγος που η σειρά Fourier «δουλεύει». Όπως{' '}
        <InlineMath>{'\\hat i \\cdot \\hat j = 0'}</InlineMath> στο 3D, έτσι και δύο
        διαφορετικές αρμονικές <strong>μηδενίζουν</strong> το ολοκλήρωμα του
        γινομένου τους σε μία περίοδο. Αυτό μας επιτρέπει να «πιάνουμε» έναν
        συντελεστή τη φορά, χωρίς αλληλεπίδραση με τους υπόλοιπους.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\int_0^{T_0} e^{j(k-m)\\omega_0 t}\\, dt'}</InlineMath>: όταν{' '}
        <InlineMath>k=m</InlineMath> ο integrand είναι 1, ολοκλήρωμα <InlineMath>T_0</InlineMath>;{' '}
        αλλιώς <InlineMath>|k-m|</InlineMath> ακέραιοι κύκλοι, ολοκλήρωμα <InlineMath>0</InlineMath>.
        Slides 25-27.
      </>
    ),
  },
  'fourier-series-conjugate-symmetry': {
    intuition: (
      <>
        Δεν είναι «νέα ιδιότητα» — προκύπτει ευθεία από το ότι το σήμα είναι real
        (παίρνεις τον συζυγή και των δύο πλευρών της ανάλυσης). Η συνέπεια είναι
        πρακτική: το φάσμα στο <InlineMath>-f</InlineMath> δεν κουβαλάει νέα
        πληροφορία, οπότε σχεδιάζουμε <strong>μόνο το θετικό μισό</strong> χωρίς
        απώλεια.
      </>
    ),
    derivation: (
      <>
        Στην ανάλυση{' '}
        <InlineMath>{'a_{-k} = \\frac{1}{T_0}\\int x(t) e^{j2\\pi k f_0 t}\\, dt = \\left[\\frac{1}{T_0}\\int x(t) e^{-j2\\pi k f_0 t}\\, dt\\right]^{*} = a_k^{*}'}</InlineMath>{' '}
        όταν το <InlineMath>x</InlineMath> είναι real (slide 4 του session 5&amp;6).
      </>
    ),
  },
  'fourier-series-rect-pulse': {
    intuition: (
      <>
        Το πιο εξεταζόμενο worked example για σειρά Fourier. Δείχνει τρία πράγματα
        μαζί: (α) η DC συνιστώσα είναι ο μέσος όρος, (β) η half-wave συμμετρία του
        50%-duty παλμού σβήνει όλες τις άρτιες αρμονικές, (γ) η περιβάλλουσα είναι
        sinc και οι αρμονικές φθίνουν σαν <InlineMath>1/k</InlineMath> — η «σιγά
        σιγά» σύγκλιση που αργότερα γεννά το <em>Gibbs</em>.
      </>
    ),
    derivation: (
      <>
        Το integrand εξαφανίζεται έξω από <InlineMath>{'|t| < T_0/4'}</InlineMath>; η
        περιττή <InlineMath>\sin</InlineMath>-συνεισφορά μηδενίζεται από συμμετρία; μένει{' '}
        <InlineMath>{'\\sin(k\\pi/2)/(k\\pi) = \\tfrac{1}{2}\\,\\mathrm{sinc}(k/2)'}</InlineMath>.
        Slide 9 του session 5&amp;6 («Παράδειγμα 1, 2.10 του βιβλίου»).
      </>
    ),
  },
  'lti-output-fourier-series': {
    intuition: (
      <>
        Όλη η μεταφορά της eigenfunction property σε <em>periodic</em> σήματα. Αντί
        για συνέλιξη με <InlineMath>h(t)</InlineMath> στον χρόνο, δουλεύεις στη
        συχνότητα: κάθε <InlineMath>a_k</InlineMath> πολλαπλασιάζεται ξεχωριστά με{' '}
        <InlineMath>H(k f_0)</InlineMath>. Στρώση-στρώση — αυτό είναι το πραγματικό
        νόημα του «βλέπω το σήμα στο πεδίο της συχνότητας».
      </>
    ),
    derivation: (
      <>
        Συνέπεια του LTI eigenfunction (<InlineMath>{'e^{j2\\pi f_0 t}\\to H(f_0)\\,e^{j2\\pi f_0 t}'}</InlineMath>){' '}
        + γραμμικότητας. Slide 5 του session 5&amp;6 (recap), αναπτύσσεται στο{' '}
        <Link href="/foundations/fourier-series">/foundations/fourier-series</Link> §11.
      </>
    ),
  },

  // ── Foundations · Fourier pairs ──────────────────────────────
  'fourier-pair-rect': {
    intuition: (
      <>
        Ένας ορθογώνιος παλμός είναι το πιο απλό «σήμα συγκεντρωμένο στον χρόνο». Το
        spectrum του απλώνεται ομαλά σαν sinc — όσο πιο στενός ο παλμός (μικρό{' '}
        <InlineMath>T</InlineMath>), τόσο πιο φαρδύ το spectrum. Είναι το πρώτο
        παράδειγμα της δυϊκότητας time ↔ frequency: localized in time ⇒ spread in
        frequency.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\int_{-T/2}^{T/2} e^{-j2\\pi ft}\\,dt = \\frac{\\sin(\\pi fT)}{\\pi f} = T\\,\\mathrm{sinc}(fT)'}</InlineMath>.
      </>
    ),
  },
  'fourier-pair-tri': {
    intuition: (
      <>
        Το τρίγωνο είναι rect convolved με τον εαυτό του. Από convolution theorem,
        convolution in time ⇒ product in frequency ⇒{' '}
        <InlineMath>{'\\mathrm{sinc} \\cdot \\mathrm{sinc} = \\mathrm{sinc}^2'}</InlineMath>.
        Το ότι το τρίγωνο είναι πιο «smooth» από τον rect φαίνεται και στο spectrum:
        sidelobes πέφτουν σαν <InlineMath>{'1/f^2'}</InlineMath> αντί για{' '}
        <InlineMath>{'1/f'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\Lambda(t/T) = \\tfrac{1}{T}\\,\\mathrm{rect}(t/T) * \\mathrm{rect}(t/T)'}</InlineMath>{' '}
        ⇒ FT = <InlineMath>{'\\tfrac{1}{T}(T\\,\\mathrm{sinc})^2 = T\\,\\mathrm{sinc}^2(fT)'}</InlineMath>.
      </>
    ),
  },
  'fourier-pair-cos': {
    intuition: (
      <>
        Ένα καθαρό cosine έχει όλη του την ενέργεια σε μία συχνότητα — αλλά ο Fourier
        το «βλέπει» σαν δύο contra-rotating phasors στις <InlineMath>{'\\pm f_0'}</InlineMath>{' '}
        με βάρος ½ το καθένα. Γι' αυτό κάθε cosine στο spectrum ζει σαν συμμετρικό
        ζευγάρι impulses.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\cos = \\tfrac{1}{2}(e^{j2\\pi f_0 t} + e^{-j2\\pi f_0 t})'}</InlineMath>{' '}
        ⇒ κάθε εκθετικό γίνεται <InlineMath>{'\\delta(f \\mp f_0)'}</InlineMath> με βάρος ½.
      </>
    ),
  },
  'fourier-pair-sin': {
    intuition: (
      <>
        Το sine είναι cosine με 90° καθυστέρηση — ίδιοι δύο phasors στις{' '}
        <InlineMath>{'\\pm f_0'}</InlineMath>, αλλά με αντίθετα imaginary signs, άρα οι
        impulses αφαιρούνται. Το αποτέλεσμα είναι πλήρως imaginary (sin είναι odd, οπότε
        και η FT του).
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\sin = \\tfrac{1}{2j}(e^{j2\\pi f_0 t} - e^{-j2\\pi f_0 t})'}</InlineMath>{' '}
        ⇒ δύο impulses με βάρη <InlineMath>{'\\pm 1/(2j)'}</InlineMath>.
      </>
    ),
  },
  'fourier-pair-const-delta': {
    intuition: (
      <>
        Το πιο ακραίο time-frequency tradeoff: ένα τέλεια localized σήμα στο ένα πεδίο
        γίνεται τέλεια flat στο άλλο. Από την duality property: αν{' '}
        <InlineMath>{'x(t) \\leftrightarrow X(f)'}</InlineMath>, τότε{' '}
        <InlineMath>{'X(t) \\leftrightarrow x(-f)'}</InlineMath> — γι' αυτό τα δύο
        ζευγάρια <InlineMath>{'1 \\leftrightarrow \\delta(f)'}</InlineMath> και{' '}
        <InlineMath>{'\\delta(t) \\leftrightarrow 1'}</InlineMath> είναι το ίδιο.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\mathcal{F}\\{\\delta(t)\\} = \\int \\delta(t) e^{-j2\\pi ft}\\,dt = 1'}</InlineMath>{' '}
        (sifting property). Duality ⇒ <InlineMath>{'\\mathcal{F}\\{1\\} = \\delta(f)'}</InlineMath>.
      </>
    ),
  },
  'fourier-pair-sgn': {
    intuition: (
      <>
        Το <InlineMath>{'\\mathrm{sgn}(t)'}</InlineMath> κάνει «άλμα 2» στο μηδέν, και
        δεν είναι integrable — η FT υπάρχει μόνο σαν distribution. Το spectrum του{' '}
        <InlineMath>{'1/(j\\pi f)'}</InlineMath> πέφτει αργά (η ασυνέχεια έχει
        ενέργεια σε όλες τις συχνότητες) και είναι ο πυρήνας του Hilbert transform.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\mathrm{sgn}(t) = 2u(t) - 1'}</InlineMath>; συνδυάζοντας
        FT{'{u(t)}'} = <InlineMath>{'\\tfrac{1}{2}\\delta(f) + 1/(j2\\pi f)'}</InlineMath>{' '}
        με <InlineMath>{'\\mathcal{F}\\{1\\} = \\delta(f)'}</InlineMath> ⇒{' '}
        <InlineMath>{'1/(j\\pi f)'}</InlineMath>.
      </>
    ),
  },
  'fourier-duality': {
    intuition: (
      <>
        Η δομή του Fourier είναι σχεδόν συμμετρική: αν αλλάξεις ρόλους χρόνου/συχνότητας
        παίρνεις ξανά FT pair, με ένα <InlineMath>{'f \\to -f'}</InlineMath>. Από εδώ
        παίρνεις δωρεάν ένα νέο pair για κάθε γνωστό — π.χ. ξέρεις{' '}
        <InlineMath>{'\\mathrm{rect} \\leftrightarrow \\mathrm{sinc}'}</InlineMath>, άρα{' '}
        <InlineMath>{'\\mathrm{sinc} \\leftrightarrow \\mathrm{rect}'}</InlineMath>. Είναι
        ο λόγος που <InlineMath>{'\\delta(t) \\leftrightarrow 1'}</InlineMath> και{' '}
        <InlineMath>{'1 \\leftrightarrow \\delta(f)'}</InlineMath> συνυπάρχουν.
      </>
    ),
    derivation: (
      <>
        Αλλάζεις τα <InlineMath>{'t \\leftrightarrow f'}</InlineMath> στον ορισμό{' '}
        <InlineMath>{'X(f) = \\int x(t) e^{-j2\\pi ft}\\,dt'}</InlineMath> ⇒ ο IFT γίνεται FT
        με reversed sign στον εκθέτη, οπότε εμφανίζεται το{' '}
        <InlineMath>{'x(-f)'}</InlineMath>.
      </>
    ),
  },
  'fourier-scaling': {
    intuition: (
      <>
        Συμπίεση στον χρόνο (<InlineMath>{'|\\alpha| > 1'}</InlineMath>) ⇒ άπλωμα στη
        συχνότητα, και αντίστροφα. Ο παράγοντας <InlineMath>{'1/|\\alpha|'}</InlineMath>{' '}
        διατηρεί την ενέργεια. Αυτή είναι η δομική αιτία που σύντομοι παλμοί χρειάζονται
        μεγάλο bandwidth.
      </>
    ),
    derivation: (
      <>
        Αλλαγή μεταβλητής <InlineMath>{'u = \\alpha t'}</InlineMath>:{' '}
        <InlineMath>{'\\int x(\\alpha t) e^{-j2\\pi ft}\\,dt = \\tfrac{1}{|\\alpha|}\\int x(u) e^{-j2\\pi (f/\\alpha) u}\\,du'}</InlineMath>.
      </>
    ),
  },
  'fourier-shift': {
    intuition: (
      <>
        Μετακινώντας ένα σήμα στον χρόνο, οι συχνότητες που περιέχει μένουν ίδιες —
        αλλάζει μόνο η φάση τους. Κάθε συνιστώσα παίρνει frequency-dependent phase
        rotation <InlineMath>{'e^{-j2\\pi f t_0}'}</InlineMath> που αντιστοιχεί σε
        time delay.
      </>
    ),
    derivation: (
      <>
        Αλλαγή μεταβλητής <InlineMath>{'u = t - t_0'}</InlineMath>:{' '}
        <InlineMath>{'\\int x(t-t_0) e^{-j2\\pi ft}\\,dt = e^{-j2\\pi f t_0} X(f)'}</InlineMath>.
      </>
    ),
  },
  'fourier-convolution': {
    intuition: (
      <>
        Το «κλειδί» όλου του Fourier: convolution ⇄ multiplication. Filtering ενός σήματος
        από LTI σύστημα στον χρόνο = πολλαπλασιασμός φασμάτων. Mixing δύο σημάτων
        (modulation) στον χρόνο = convolution φασμάτων. Όλη η AM/FM ζει σε αυτή την
        ταυτότητα.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(x*h)(t) = \\int x(\\tau) h(t-\\tau)\\,d\\tau'}</InlineMath>; παίρνεις FT,
        αλλάζεις σειρά ολοκλήρωσης, βγάζεις το <InlineMath>{'e^{-j2\\pi f\\tau}'}</InlineMath> ⇒{' '}
        <InlineMath>{'X(f) H(f)'}</InlineMath>.
      </>
    ),
  },
  'fourier-modulation-theorem': {
    intuition: (
      <>
        Πολλαπλασιάζοντας ένα baseband σήμα με carrier cosine, το spectrum μετατοπίζεται
        ΚΑΙ στις <InlineMath>{'+f_c'}</InlineMath> ΚΑΙ στις <InlineMath>{'-f_c'}</InlineMath>{' '}
        με βάρος ½. Αυτό είναι η καρδιά κάθε AM/DSB-SC/SSB modulator — και η αιτία που
        modulated σήματα έχουν διπλό bandwidth από το message.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\cos = \\tfrac{1}{2}(e^{j2\\pi f_c t} + e^{-j2\\pi f_c t})'}</InlineMath>{' '}
        + frequency-shift property ⇒ δύο μετατοπισμένα αντίγραφα του{' '}
        <InlineMath>{'X(f)'}</InlineMath>, καθένα με βάρος ½.
      </>
    ),
  },
  'fourier-freq-shift': {
    intuition: (
      <>
        Πολλαπλασιάζοντας με μιγαδικό carrier <InlineMath>{'e^{j2\\pi f_0 t}'}</InlineMath>,
        το spectrum μετατοπίζεται ΟΛΟ σε μία μόνο πλευρά (καμία αρνητική συχνότητα). Αυτή
        είναι η μαθηματική βάση του complex baseband και του analytical signal — και της
        SSB μέσω Hilbert.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\int x(t) e^{j2\\pi f_0 t} e^{-j2\\pi ft}\\,dt = \\int x(t) e^{-j2\\pi(f-f_0)t}\\,dt = X(f-f_0)'}</InlineMath>.
      </>
    ),
  },
  'fourier-differentiation': {
    intuition: (
      <>
        Η παραγώγιση ενισχύει υψηλές συχνότητες — πολλαπλασιασμός με{' '}
        <InlineMath>{'j2\\pi f'}</InlineMath> ανεβάζει το spectrum γραμμικά με{' '}
        <InlineMath>f</InlineMath>. Γι' αυτό η παραγώγιση noisy δεδομένων μεγεθύνει το
        θόρυβο. Το <InlineMath>j</InlineMath> δίνει 90° phase shift.
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'x(t) = \\int X(f) e^{j2\\pi ft}\\,df'}</InlineMath>, παραγωγίζω{' '}
        υπό το ολοκλήρωμα ⇒ κάθε exponential πολλαπλασιάζεται με{' '}
        <InlineMath>{'j2\\pi f'}</InlineMath>.
      </>
    ),
  },
  'fourier-integration': {
    intuition: (
      <>
        Η ολοκλήρωση καταπνίγει τις υψηλές συχνότητες — αντίστροφο της παραγώγισης. Ο
        όρος <InlineMath>{'(X(0)/2)\\delta(f)'}</InlineMath> εμφανίζεται γιατί ολοκληρώνοντας
        σήμα με μη-μηδενική μέση τιμή, ο DC συσσωρεύεται γραμμικά στον χρόνο.
      </>
    ),
    derivation: (
      <>
        Αντίστροφο της <InlineMath>{'\\frac{d}{dt} \\leftrightarrow j2\\pi f'}</InlineMath>:
        διαιρείς με <InlineMath>{'j2\\pi f'}</InlineMath>· ο όρος{' '}
        <InlineMath>{'X(0)/2'}</InlineMath> διορθώνει τη singularity στο{' '}
        <InlineMath>f=0</InlineMath>.
      </>
    ),
  },
  parseval: {
    intuition: (
      <>
        Η ενέργεια στον χρόνο = ενέργεια στη συχνότητα. Ο Fourier είναι unitary change
        of basis: τίποτα δεν χάνεται όταν αλλάζεις «σύστημα συντεταγμένων». Αυτό είναι
        το «no information lost» θεμελιώδες εργαλείο.
      </>
    ),
    derivation: (
      <>
        Εισάγεις <InlineMath>{'x^*(t) = \\int X^*(f) e^{-j2\\pi ft}\\,df'}</InlineMath>,
        αλλάζεις σειρά, αναγνωρίζεις <InlineMath>{'\\int e^{-j2\\pi(f-g)t}\\,dt = \\delta(f-g)'}</InlineMath>.
      </>
    ),
  },
  'parseval-power': {
    intuition: (
      <>
        Για περιοδικά σήματα, η συνολική ισχύς = άθροισμα ισχύος κάθε cosine (όταν οι
        συχνότητες είναι διαφορετικές). Cross-terms μηδενίζονται γιατί cosines σε
        διαφορετικές συχνότητες είναι ορθογώνια σε μία περίοδο.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'P = \\langle x^2 \\rangle = \\langle (\\sum A_i \\cos(\\cdot))^2 \\rangle'}</InlineMath>:
        διαγώνιοι όροι <InlineMath>{'A_i^2 \\langle \\cos^2 \\rangle = A_i^2/2'}</InlineMath>;
        off-diagonal = 0 (orthogonality).
      </>
    ),
  },
  'ft-unit-step': {
    intuition: (
      <>
        Το <InlineMath>u(t)</InlineMath> δεν είναι ούτε άρτιο ούτε φθίνει — οπότε ο FT του
        έχει δύο κομμάτια. Το <InlineMath>{'\\delta(f)/2'}</InlineMath> κωδικοποιεί τον DC
        «μέσο όρο 1/2» (το <InlineMath>u(t)</InlineMath> είναι 1 για <InlineMath>t&gt;0</InlineMath>{' '}
        και 0 για <InlineMath>t&lt;0</InlineMath>, άρα μέση τιμή 1/2). Το{' '}
        <InlineMath>{'1/(j 2\\pi f)'}</InlineMath> είναι ο μη-DC ανταποκριτής, που δίνει το
        «βήμα» στη συχνότητα.
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'u(t) = \\tfrac{1}{2}[1 + \\mathrm{sgn}(t)]'}</InlineMath>, γραμμικότητα και
        τα έτοιμα pairs <InlineMath>{'1 \\leftrightarrow \\delta(f)'}</InlineMath> +{' '}
        <InlineMath>{'\\mathrm{sgn}(t) \\leftrightarrow 1/(j\\pi f)'}</InlineMath>.
      </>
    ),
  },
  'ft-periodic-from-pulse': {
    intuition: (
      <>
        Οι FS συντελεστές δεν είναι «κάτι νέο» — είναι samples του FT του ενός μόνο παλμού,
        παρμένα σε ισαπέχουσες θέσεις <InlineMath>{'k/T_0'}</InlineMath>. Αυτό συνδέει FS και
        FT σε **μία** σχέση και κάνει τη rect-pulse-train ανάλυση από τη Σειρά Fourier
        ξανά διαθέσιμη με ένα μόνο envelope plot.
      </>
    ),
    derivation: (
      <>
        Αν <InlineMath>{'x(t) = \\sum_k x_0(t - kT_0)'}</InlineMath> με{' '}
        <InlineMath>{'\\mathcal{F}\\{x_0\\} = X(f)'}</InlineMath>, τότε ο τύπος των FS
        συντελεστών συμπτύσσεται σε <InlineMath>{'x_k = X(k/T_0)/T_0'}</InlineMath> με αλλαγή
        μεταβλητής (δες <Link href="/foundations/fourier-transform#61-η-αντίστροφη-γέφυρα--οι-fs-συντελεστές-είναι-το-ft-envelope-δειγματισμένο-στο-1t-">Section 6.1</Link>).
      </>
    ),
  },
  'cross-correlation': {
    intuition: (
      <>
        Η συσχέτιση δύο σημάτων μετράει την <strong>ομοιότητά τους όταν ολισθηθούν κατά τ</strong>.
        Σαν inner product, αλλά παραμετρικός στην ολίσθηση. Το{' '}
        <InlineMath>{'R_{xy}(0)'}</InlineMath> δίνει την ορθογωνιότητα· οι μέγιστες τιμές του{' '}
        <InlineMath>{'|R_{xy}(\\tau)|'}</InlineMath> δείχνουν τη βέλτιστη χρονική ευθυγράμμιση.
        Βασικό εργαλείο σε ραντάρ, σύμφωνη/ασύμφωνη αποδιαμόρφωση, και φίλτρα ταιριάσματος.
      </>
    ),
    derivation: (
      <>
        Άμεσος ορισμός από slide 38. Η γέφυρα στο FT προκύπτει με αλλαγή μεταβλητής:{' '}
        <InlineMath>{'R_{xy}(\\tau) = x(\\tau) * y^*(-\\tau)'}</InlineMath>, οπότε{' '}
        <InlineMath>{'\\mathcal{F}\\{R_{xy}\\} = X(f)\\,Y^*(f)'}</InlineMath> από την 5b.
      </>
    ),
  },
  autocorrelation: {
    intuition: (
      <>
        Πόσο μοιάζει ένα σήμα με τον <strong>εαυτό</strong> του ολισθημένο κατά τ. Στο
        μηδέν δίνει την ενέργεια (ή την ισχύ). Όσο το σήμα «ξεχνάει» τον εαυτό του, η{' '}
        <InlineMath>{'R_x(\\tau)'}</InlineMath> φθίνει — και το πόσο γρήγορα φθίνει σχετίζεται με
        το πόσο πλατύ είναι το φάσμα του (Wiener–Khinchin).
      </>
    ),
    derivation: (
      <>
        Ειδική περίπτωση cross-correlation με <InlineMath>{'y = x'}</InlineMath>. Η συζυγή
        συμμετρία <InlineMath>{'R_x(-\\tau) = R_x^*(\\tau)'}</InlineMath> προκύπτει με αλλαγή
        μεταβλητής στον ορισμό.
      </>
    ),
  },
  'wiener-khinchin-ft': {
    intuition: (
      <>
        Η σχέση που <strong>ενώνει</strong> τη συσχέτιση με το φάσμα: ο FT της autocorrelation
        είναι το <InlineMath>{'|X(f)|^2'}</InlineMath> (για σήμα ενέργειας — ESD) ή το PSD (για
        σήμα ισχύος). Όταν φτάσουμε στα τυχαία σήματα, αυτή θα είναι η <em>μοναδική γέφυρα</em>{' '}
        στη φασματική ανάλυση — γιατί δεν θα έχουμε «το <InlineMath>{'X(f)'}</InlineMath> του
        θορύβου».
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'R_x(\\tau) = x(\\tau) * x^*(-\\tau)'}</InlineMath> και την 5b:{' '}
        <InlineMath>{'\\mathcal{F}\\{R_x\\} = X(f)\\,X^*(f) = |X(f)|^2'}</InlineMath>.
        Μία γραμμή — αλλά κουβαλάει όλη την υπόλοιπη ύλη.
      </>
    ),
  },

  // ── Foundations · Trig identities ────────────────────────────
  'trig-cos-sum-diff': {
    intuition: (
      <>
        Αυτό είναι το «master identity» — ξεκλειδώνει κάθε product-to-sum και
        double-angle στις διαμορφώσεις. Όταν βλέπεις γινόμενο δύο τριγωνομετρικών,
        αυτό είναι το πρώτο εργαλείο που πιάνεις.
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'e^{j(x+y)} = e^{jx} \\cdot e^{jy}'}</InlineMath> · ισούτε
        πραγματικά μέρη με Euler ⇒{' '}
        <InlineMath>{'\\cos(x+y) = \\cos x \\cos y - \\sin x \\sin y'}</InlineMath>.
      </>
    ),
  },
  'trig-sin-sum-diff': {
    intuition: (
      <>
        Το άλλο μισό του master pair — imaginary part του ίδιου Euler product.
        Χρησιμοποιείται όπου εμφανίζεται sin σε derivation διαμόρφωσης (quadrature, SSB).
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'e^{j(x+y)} = e^{jx} \\cdot e^{jy}'}</InlineMath> · ισούτε
        imaginary parts ⇒{' '}
        <InlineMath>{'\\sin(x+y) = \\sin x \\cos y + \\cos x \\sin y'}</InlineMath>.
      </>
    ),
  },
  'trig-cos-complex-exp': {
    intuition: (
      <>
        Αυτή είναι η γέφυρα — κάθε real cosine είναι δύο contra-rotating complex
        phasors. Κάθε spectrum που θα σχεδιάσεις ζει σε αυτή τη μορφή. Όλη η εικόνα
        «phasor pair» βγαίνει από εδώ.
      </>
    ),
    derivation: (
      <>
        Πραγματικό μέρος του <InlineMath>{'e^{jx} = \\cos x + j \\sin x'}</InlineMath> ⇒{' '}
        <InlineMath>{'\\cos x = \\tfrac{1}{2}(e^{jx} + e^{-jx})'}</InlineMath>.
      </>
    ),
  },
  'trig-sin-complex-exp': {
    intuition: (
      <>
        Η μορφή phasor του sin — ίδιοι δύο phasors, αλλά αφαιρούμενοι. Κάθε φορά που
        βλέπεις sin σε modulation derivation, αυτή η ταυτότητα το μετατρέπει σε{' '}
        <InlineMath>{'\\pm j'}</InlineMath>·exponential pair.
      </>
    ),
    derivation: (
      <>
        Φανταστικό μέρος του <InlineMath>{'e^{jx}'}</InlineMath> ⇒{' '}
        <InlineMath>{'\\sin x = \\tfrac{1}{2j}(e^{jx} - e^{-jx})'}</InlineMath>.
      </>
    ),
  },
  'trig-prod-cos-cos': {
    intuition: (
      <>
        Η ΤΑΥΤΟΤΗΤΑ της coherent demodulation. <InlineMath>{'x = 2\\pi f_c t'}</InlineMath>,{' '}
        <InlineMath>{'y = 2\\pi f_c t'}</InlineMath> (LO) ⇒ γινόμενο = sum (υψηλή
        συχνότητα, την κόβει το LPF) + difference (baseband, το message). Όταν{' '}
        <InlineMath>{'x = y'}</InlineMath>: <InlineMath>{'\\cos^2(x) = \\tfrac{1}{2}[1 + \\cos(2x)]'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\cos(x+y) + \\cos(x-y) = 2\\cos x \\cos y'}</InlineMath> (αναπτύσσοντας με
        sum-diff identity και αθροίζοντας).
      </>
    ),
  },
  'trig-prod-sin-sin': {
    intuition: (
      <>
        Το quadrature-quadrature γινόμενο — δίνει την διαφορά ΧΩΡΙΣ DC, και ΑΦΑΙΡΕΙ
        το άθροισμα. Εμφανίζεται σε I/Q demodulation όταν και τα δύο branches είναι
        ενεργά.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\cos(x-y) - \\cos(x+y) = 2 \\sin x \\sin y'}</InlineMath>.
      </>
    ),
  },
  'trig-prod-sin-cos': {
    intuition: (
      <>
        Το ασύμμετρο γινόμενο — βγάζει sin sum + sin difference (όχι cosine). Εμφανίζεται
        σε SSB derivations και στο quadrature branch κάθε synchronous demodulator με phase
        offset.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\sin(x+y) + \\sin(x-y) = 2 \\sin x \\cos y'}</InlineMath>.
      </>
    ),
  },
  'trig-double-cos': {
    intuition: (
      <>
        Το τετράγωνο cosine δίνει DC (½) + 2× cosine. Το DC είναι αυτό που εξάγει ο
        coherent demodulator· το <InlineMath>2x</InlineMath> τερματίζεται από LPF. Αυτή η μία
        ταυτότητα εξηγεί ΓΙΑΤΙ δουλεύει η coherent demodulation.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\cos^2 x = \\cos x \\cos x'}</InlineMath> · product-to-sum με{' '}
        <InlineMath>{'x = y'}</InlineMath> ⇒ <InlineMath>{'\\tfrac{1}{2}[\\cos 0 + \\cos 2x] = \\tfrac{1}{2}[1 + \\cos 2x]'}</InlineMath>.
      </>
    ),
  },
  'trig-double-sin': {
    intuition: (
      <>
        Το ίδιο κόλπο — squaring sin βγάζει επίσης DC + 2× όρο, αλλά με αντίθετο sign
        στο cosine. Ζευγαρώνει με <InlineMath>{'\\cos^2'}</InlineMath> σε κάθε υπολογισμό
        μέσης ισχύος (<InlineMath>{'P = A^2/2'}</InlineMath> βγαίνει κατευθείαν).
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\sin^2 x = \\sin x \\sin x'}</InlineMath> · product-to-sum ⇒{' '}
        <InlineMath>{'\\tfrac{1}{2}[\\cos 0 - \\cos 2x] = \\tfrac{1}{2}[1 - \\cos 2x]'}</InlineMath>.
      </>
    ),
  },

  // ── Foundations · Βασικά ολοκληρώματα ─────────────────────────
  'int-cos': {
    intuition: (
      <>
        Το αντίστροφο της <InlineMath>{'\\sin\\prime = \\cos'}</InlineMath>. Εμφανίζεται
        παντού όπου ολοκληρώνεις τριγωνομετρικά — από power calculations μέχρι Fourier
        coefficients.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(\\sin x)\\prime = \\cos x'}</InlineMath>.
      </>
    ),
  },
  'int-sin': {
    intuition: (
      <>
        Καθρέφτης του <InlineMath>{'\\int \\cos'}</InlineMath>, με αρνητικό πρόσημο που
        εύκολα ξεχνιέται. Συνηθισμένο σε derivations FM/PM (όπου ολοκληρώνεις το message
        για να βρεις τη φάση).
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(\\cos x)\\prime = -\\sin x'}</InlineMath>.
      </>
    ),
  },
  'int-power': {
    intuition: (
      <>
        Γενικευμένος power rule όταν το argument είναι affine (<InlineMath>{'a + bx'}</InlineMath>).
        Παρατήρησε το <InlineMath>{'1/b'}</InlineMath> — chain rule κατά την παραγώγιση
        παράγει <InlineMath>{'b'}</InlineMath>, οπότε το ολοκλήρωμα το διαιρεί.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'((a+bx)^{n+1})\\prime = b(n+1)(a+bx)^n'}</InlineMath> ⇒ διαίρεσε με{' '}
        <InlineMath>{'b(n+1)'}</InlineMath>.
      </>
    ),
  },
  'int-exp': {
    intuition: (
      <>
        Η εκθετική είναι το eigenfunction της ολοκλήρωσης — μένει ως έχει. Εμφανίζεται
        όπου έχουμε complex exponentials (= phasors), δηλαδή σχεδόν παντού στο Fourier.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(e^x)\\prime = e^x'}</InlineMath>.
      </>
    ),
  },
  'int-ln': {
    intuition: (
      <>
        Σπάνια εμφανίζεται στο σύλλαβο SP, αλλά είναι στο τυπολόγιο για να μην αναγκαστείς
        να το θυμηθείς. Βγαίνει με integration by parts (<InlineMath>{'u = \\ln x'}</InlineMath>,{' '}
        <InlineMath>{'dv = dx'}</InlineMath>).
      </>
    ),
    derivation: (
      <>
        Integration by parts: <InlineMath>{'\\int \\ln x \\,dx = x \\ln x - \\int x \\cdot \\tfrac{1}{x}\\,dx = x\\ln x - x'}</InlineMath>.
      </>
    ),
  },
  'int-one-over-x': {
    intuition: (
      <>
        Το αρχέγονο της <InlineMath>{'\\ln'}</InlineMath>. Σπάνιο στο SP exam, αλλά
        χρειάζεται όταν εμφανίζονται 1/f-θόρυβοι ή SNR σε dB.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(\\ln |x|)\\prime = 1/x'}</InlineMath>.
      </>
    ),
  },
  'int-sec-squared': {
    intuition: (
      <>
        Παράγωγος της <InlineMath>{'\\tan'}</InlineMath>. Σχεδόν ποτέ δεν εμφανίζεται στο SP
        — αλλά αν εμφανιστεί, είναι στο τυπολόγιο.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(\\tan x)\\prime = 1/\\cos^2 x = \\sec^2 x'}</InlineMath>.
      </>
    ),
  },
  'int-csc-squared': {
    intuition: (
      <>
        Παράγωγος της <InlineMath>{'-\\cot'}</InlineMath>. Όπως και η{' '}
        <InlineMath>{'\\sec^2'}</InlineMath>, υπάρχει στο τυπολόγιο για ασφάλεια.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'(\\cot x)\\prime = -1/\\sin^2 x = -\\csc^2 x'}</InlineMath>.
      </>
    ),
  },

  // ── Filters ───────────────────────────────────────────────────
  'ideal-filter-shapes': {
    intuition: (
      <>
        Τα τέσσερα ιδανικά φίλτρα είναι απλώς διαφορετικά brick-wall σχήματα του{' '}
        <InlineMath>{'|H(f)|'}</InlineMath>: όπου είναι 1, η συχνότητα{' '}
        περνάει αναλλοίωτη· όπου είναι 0, εξαφανίζεται. Όλα έχουν even συμμετρία στη συχνότητα,
        οπότε η κρουστική <InlineMath>{'h(t)'}</InlineMath> είναι real και even (μηδενική phase).
      </>
    ),
    derivation: (
      <>
        Οι τέσσερις ορισμοί προέρχονται από το slide 36-40 του deck — απλώς ο
        σχεδιαστής διαλέγει σε ποιες περιοχές βάζει 1 και ποιες 0. Το BS προκύπτει
        ως complement του BP: <InlineMath>{'H_{BS}(f) = 1 - H_{BP}(f)'}</InlineMath>.
      </>
    ),
  },
  'ideal-lp-impulse-response': {
    intuition: (
      <>
        Το ιδανικό LP είναι rect στη συχνότητα, οπότε από τη βασική Fourier pair{' '}
        <InlineMath>{'\\mathrm{rect} \\leftrightarrow \\mathrm{sinc}'}</InlineMath>{' '}
        η κρουστική του είναι <strong>sinc</strong>. Αυτό όμως εκτείνεται μέχρι το{' '}
        <InlineMath>{'\\pm\\infty'}</InlineMath> — άρα το φίλτρο είναι{' '}
        <strong>μη-αιτιατό</strong>, αδύνατο να υλοποιηθεί σε real-time. Από εκεί
        έρχεται όλη η συμβιβαστική λογική των ρεαλιστικών φίλτρων.
      </>
    ),
    derivation: (
      <>
        Από <InlineMath>{'\\mathrm{rect}(t/T) \\leftrightarrow T\\,\\mathrm{sinc}(fT)'}</InlineMath>{' '}
        με duality (αντί <InlineMath>{'t \\leftrightarrow f'}</InlineMath>) και{' '}
        <InlineMath>{'T = 2f_c'}</InlineMath>. Για ιδανικό BP, εφαρμόζουμε modulation
        theorem στο LP <InlineMath>{'(\\text{LP}_{2W} \\cdot \\cos(2\\pi f_0 t))'}</InlineMath>.
      </>
    ),
  },
  'real-filter-specs': {
    intuition: (
      <>
        Οι τέσσερις προδιαγραφές <InlineMath>{'f_p, f_s, \\delta_p, \\delta_s'}</InlineMath>{' '}
        είναι το πεπερασμένο vocabulary για να μιλήσουμε για ένα φίλτρο που <em>δεν είναι</em>{' '}
        ιδανικό: πόσο επιτρέπεις την passband να ταλαντώνεται γύρω από το 1, πόσο επιτρέπεις
        την stopband να μην είναι ακριβώς 0, και πόσο πλατύ είναι το «δεν κάνω promise» κομμάτι
        ανάμεσα.
      </>
    ),
    derivation: (
      <>
        Δεν προέρχονται από αλγεβρική παραγωγή — είναι ο συμβατικός τρόπος που η
        κοινότητα μηχανικών περιγράφει ρεαλιστικά φίλτρα (slides 42-46). Φυσική αιτία:
        truncation του ιδανικού sinc στο <InlineMath>{'\\pm T'}</InlineMath> δημιουργεί
        ripple και transition band — δες το SincTruncationToRealFilterViz.
      </>
    ),
  },
  'filter-gain-db': {
    intuition: (
      <>
        Επειδή το <InlineMath>{'|H(f)|'}</InlineMath> καλύπτει εύρος από κοντά στο 1
        (passband) έως πολύ κοντά στο 0 (stopband), η γραμμική κλίμακα είναι άχρηστη
        για να δεις πόσο καλά μπλοκάρει η stopband. Σε dB, ένας παράγοντας 10 σε amplitude
        γίνεται 20 dB — και ένας παράγοντας 10 σε ισχύ γίνεται 10 dB. Έτσι μιλάμε για
        «60 dB attenuation» (= διαίρεση με 1000 σε amplitude, με <InlineMath>{'10^6'}</InlineMath>{' '}
        σε ισχύ).
      </>
    ),
    derivation: (
      <>
        Slide 46 ορίζει: <InlineMath>{'\\text{gain (dB)} = 20\\log_{10}|H(f)|'}</InlineMath>.
        Αντιστροφή: <InlineMath>{'|H| = 10^{\\text{dB}/20}'}</InlineMath>, οπότε «−60 dB»
        αντιστοιχεί σε <InlineMath>{'|H| = 10^{-3}'}</InlineMath>.
      </>
    ),
  },

  // ── AM ───────────────────────────────────────────────────────
  'am-signal': {
    intuition: (
      <>
        Το πλάτος του carrier «βυθίζεται» στο message. Το σταθερό{' '}
        <InlineMath>A_c</InlineMath> σηκώνει το envelope πάνω από το μηδέν ώστε το
        κυματιστό σχήμα να μη μηδενίζεται — αυτό επιτρέπει envelope detection. Αν{' '}
        <InlineMath>{'\\mu \\le 1'}</InlineMath>, το envelope ΕΙΝΑΙ το message σε scale.
      </>
    ),
    derivation: (
      <>
        Παίρνεις DSB-SC (<InlineMath>{'m(t)\\cos(2\\pi f_c t)'}</InlineMath>) και προσθέτεις
        το unmodulated carrier <InlineMath>{'A_c \\cos(2\\pi f_c t)'}</InlineMath>, factor το{' '}
        <InlineMath>{'\\cos'}</InlineMath>.
      </>
    ),
  },
  'am-mu': {
    intuition: (
      <>
        Πόσο «βαθιά» πάει η διαμόρφωση — μέγιστο πλάτος swing σε σχέση με τον carrier.{' '}
        <InlineMath>{'\\mu = 1'}</InlineMath>: το envelope ακριβώς αγγίζει το μηδέν.{' '}
        <InlineMath>{'\\mu > 1'}</InlineMath>: το διαπερνά, με αποτέλεσμα phase reversal και
        distortion στο envelope detection.
      </>
    ),
    derivation: (
      <>
        Άμεσος ορισμός. Με normalised <InlineMath>{'m_n(t) = m(t)/|m|_{\\max}'}</InlineMath>:
        envelope = <InlineMath>{'A_c[1 + \\mu \\, m_n(t)]'}</InlineMath>.
      </>
    ),
  },
  'am-spectrum': {
    intuition: (
      <>
        Ο carrier εμφανίζεται σαν δύο impulse spikes στις <InlineMath>{'\\pm f_c'}</InlineMath>{' '}
        (καμία πληροφορία) ΣΥΝ δύο μετατοπισμένα-και-υποδιπλασιασμένα αντίγραφα του{' '}
        <InlineMath>{'M(f)'}</InlineMath>. Οπτικά: ψηλό κεντρικό spike + φτερά
        message δεξιά κι αριστερά.
      </>
    ),
    derivation: (
      <>
        FT του <InlineMath>{'(A_c + m(t))\\cos'}</InlineMath>: linearity + modulation theorem
        ⇒ carrier impulses από <InlineMath>{'A_c \\cos'}</InlineMath>, sidebands από{' '}
        <InlineMath>{'m \\cos'}</InlineMath>.
      </>
    ),
  },
  'am-power': {
    intuition: (
      <>
        Η συνολική ισχύς χωρίζεται σε carrier power (<InlineMath>{'A_c^2/2'}</InlineMath> —
        χαμένη, καμία πληροφορία) και sideband power (<InlineMath>{'P_m/2'}</InlineMath> —
        η πραγματική). Ο carrier κυριαρχεί εκτός αν το <InlineMath>{'\\mu'}</InlineMath>{' '}
        είναι μεγάλο.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\langle x_{AM}^2 \\rangle'}</InlineMath>: cross-terms μεταξύ{' '}
        <InlineMath>{'A_c \\cos'}</InlineMath> και <InlineMath>{'m \\cos'}</InlineMath>{' '}
        έχουν μέση τιμή 0· <InlineMath>{'\\langle \\cos^2 \\rangle = 1/2'}</InlineMath>.
      </>
    ),
  },
  'am-eta': {
    intuition: (
      <>
        Efficiency = κλάσμα ισχύος που πραγματικά κουβαλάει πληροφορία. Ακόμα και με{' '}
        <InlineMath>{'\\mu = 1'}</InlineMath> και tone message, μόνο{' '}
        <InlineMath>{'1/3'}</InlineMath> της εκπεμπόμενης ισχύος είναι message. Τα 2/3 είναι
        ο carrier — αυτό είναι το τίμημα για envelope detection.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\eta = \\text{sideband}/\\text{total}'}</InlineMath>. Με{' '}
        <InlineMath>{'\\mu=1'}</InlineMath> single-tone: <InlineMath>{'P_m = A_c^2/2'}</InlineMath> ⇒{' '}
        <InlineMath>{'\\eta = (A_c^2/2)/(A_c^2 + A_c^2/2) = 1/3'}</InlineMath>.
      </>
    ),
  },
  'dsb-sc-signal': {
    intuition: (
      <>
        AM χωρίς carrier — πολλαπλασιάζεις απευθείας message επί carrier. Το envelope
        παρακολουθεί <InlineMath>{'|m(t)|'}</InlineMath>, όχι{' '}
        <InlineMath>{'[A_c + m(t)]'}</InlineMath>, οπότε ΔΕΝ ανακτάται με envelope detector.
        Κερδίζεις 2/3 ισχύος αλλά χρειάζεσαι synchronous demod.
      </>
    ),
    derivation: (
      <>
        Θέσε <InlineMath>{'A_c \\to 0'}</InlineMath> στο AM ⇒ μόνο τα sidebands μένουν.
      </>
    ),
  },
  'dsb-sc-power': {
    intuition: (
      <>
        Κανένας χαμένος carrier — κάθε watt που εκπέμπεται κουβαλάει πληροφορία. Τίμημα:
        ο receiver χρειάζεται local oscillator κλειδωμένο στο{' '}
        <InlineMath>{'f_c'}</InlineMath> (PLL ή Costas loop), που είναι πιο πολύπλοκο από
        έναν diode envelope detector.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\langle (A_c m(t) \\cos)^2 \\rangle = A_c^2 \\langle m^2 \\rangle \\langle \\cos^2 \\rangle = A_c^2 P_m / 2'}</InlineMath>.
      </>
    ),
  },
  'ssb-signal': {
    intuition: (
      <>
        Ακυρώνεις ένα sideband ⇒ μισό bandwidth. Το <InlineMath>{'\\hat m(t)'}</InlineMath>{' '}
        (Hilbert) είναι η μαγεία — quadrature copy του message που, μαζί με τον{' '}
        <InlineMath>{'\\sin'}</InlineMath> carrier, ακυρώνει το ένα sideband με
        destructive interference.
      </>
    ),
    derivation: (
      <>
        Από DSB-SC, στη συχνότητα πολλαπλασιάζεις με <InlineMath>{'(1 \\mp j\\,\\mathrm{sgn}(f))/2'}</InlineMath>{' '}
        (το SSB φίλτρο) — στον χρόνο = <InlineMath>{'A_c m \\cos \\mp A_c \\hat m \\sin'}</InlineMath>.
      </>
    ),
  },
  'ssb-power': {
    intuition: (
      <>
        Παρόλο που στο φάσμα «πέταξες» τη μία πλευρά, ο δεύτερος όρος{' '}
        <InlineMath>{'A_c \\hat m \\sin'}</InlineMath> ξαναβάζει ακριβώς την
        ίδια ισχύ — γι' αυτό το <InlineMath>{'P_x'}</InlineMath> είναι{' '}
        <InlineMath>{'A_c^2 P_m'}</InlineMath> και όχι{' '}
        <InlineMath>{'A_c^2 P_m / 2'}</InlineMath>. Η Hilbert energy
        preservation <InlineMath>{'P_{\\hat m} = P_m'}</InlineMath> είναι ο
        λόγος.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'V = A_c\\sqrt{m^2 + \\hat m^2}'}</InlineMath> ⇒{' '}
        <InlineMath>{'\\langle V^2 \\rangle = A_c^2(P_m + P_{\\hat m}) = 2 A_c^2 P_m'}</InlineMath>
        · και <InlineMath>{'P_x = \\tfrac{1}{2}\\langle V^2 \\rangle = A_c^2 P_m'}</InlineMath>.
        (Hilbert: <InlineMath>{'|{-j\\,\\mathrm{sgn}(f)}| = 1'}</InlineMath> ⇒
        Parseval ⇒ <InlineMath>{'P_{\\hat m} = P_m'}</InlineMath>.)
      </>
    ),
  },
  hilbert: {
    intuition: (
      <>
        Ο Hilbert μετατοπίζει κάθε frequency component κατά -90°. Θετικές συχνότητες{' '}
        παίρνουν <InlineMath>{'-j'}</InlineMath>, αρνητικές <InlineMath>{'+j'}</InlineMath>.
        Είναι ο «quadrature companion» κάθε πραγματικού σήματος — βάση για SSB, instantaneous
        amplitude, analytical signal.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\hat m = m * \\tfrac{1}{\\pi t}'}</InlineMath>· FT του{' '}
        <InlineMath>{'1/(\\pi t)'}</InlineMath> είναι <InlineMath>{'-j\\,\\mathrm{sgn}(f)'}</InlineMath>;
        convolution in time ⇒ product in frequency.
      </>
    ),
  },
  'am-bandwidth': {
    intuition: (
      <>
        AM και DSB-SC έχουν δύο sidebands ⇒ bandwidth <InlineMath>{'= 2W'}</InlineMath>. SSB
        πετάει το ένα ⇒ απλά <InlineMath>{'W'}</InlineMath>. VSB στο μεταξύ. Η επιλογή
        παραλλαγής AM είναι, κυρίως, ζύγισμα bandwidth efficiency vs ισχύς ή πολυπλοκότητα
        receiver.
      </>
    ),
    derivation: (
      <>
        Modulation theorem δημιουργεί αντίγραφα στις <InlineMath>{'\\pm f_c'}</InlineMath>,
        καθένα πλάτους <InlineMath>{'2W'}</InlineMath> (lower + upper sideband).
      </>
    ),
  },
  'vsb-signal': {
    intuition: (
      <>
        Παίρνεις το (συμβατικό AM ή DSB-SC) σήμα και το περνάς από ένα{' '}
        <em>shaping filter</em> <InlineMath>{'H_{VSB}(f)'}</InlineMath> που
        κρατάει ολόκληρη τη μία sideband και αφήνει μόνο ένα μικρό{' '}
        <em>vestige</em> (κατάλοιπο) της άλλης γύρω από τον carrier. Σπάει την
        DSB συμμετρία ελεγχόμενα — αρκετά για να μειώσει το BW κάτω από{' '}
        <InlineMath>{'2W'}</InlineMath>, αλλά όχι τόσο ώστε να καταστραφεί η
        envelope-detection συμβατότητα.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'X_{VSB}(f) = X_{AM}(f)\\cdot H_{VSB}(f)'}</InlineMath> ·
        το <InlineMath>{'|H_{VSB}|'}</InlineMath> κάνει ομαλή μετάβαση γύρω από
        το <InlineMath>{'f_c'}</InlineMath> (0.5 ακριβώς στο{' '}
        <InlineMath>{'f_c'}</InlineMath>) με Nyquist-συμμετρικό roll-off.
      </>
    ),
  },
  'vsb-nyquist-symmetry': {
    intuition: (
      <>
        Η μαθηματική προϋπόθεση που κάνει το VSB envelope-detectable. Το{' '}
        <em>summed-pairs</em> condition λέει: για κάθε baseband συχνότητα{' '}
        <InlineMath>{'\\Delta'}</InlineMath>, η ποσότητα{' '}
        <InlineMath>{'H_{VSB}(f_c+\\Delta) + H_{VSB}(f_c-\\Delta)'}</InlineMath>{' '}
        πρέπει να είναι σταθερή. Έτσι, όταν ο coherent demod (ή το envelope με
        reduced carrier) «διπλώνει» τις δύο πλευρές του spectrum στο baseband,
        το άθροισμα δίνει το <InlineMath>{'M(f)'}</InlineMath> πολλαπλασιασμένο
        με σταθερά — όχι γραμμική παραμόρφωση.
      </>
    ),
    derivation: (
      <>
        Coherent demod: <InlineMath>{'\\tilde M(f) = \\tfrac{1}{2}M(f)[H(f_c+f)+H(f_c-f)]'}</InlineMath>{' '}
        ⇒ bracket πρέπει να είναι σταθερά για να μην έχουμε frequency-dependent
        gain στο baseband.
      </>
    ),
  },
  'vsb-bandwidth': {
    intuition: (
      <>
        Το VSB κάθεται ανάμεσα σε <InlineMath>{'W'}</InlineMath> (SSB ιδανικό)
        και <InlineMath>{'2W'}</InlineMath> (DSB πλήρες). Το vestige προσθέτει{' '}
        <InlineMath>{'W_{\\text{vestige}}'}</InlineMath> στο μισό από τα{' '}
        <InlineMath>{'2W'}</InlineMath> — άρα BW ολίγον πάνω από{' '}
        <InlineMath>{'W'}</InlineMath>. Στο NTSC ~5.45 MHz με{' '}
        <InlineMath>{'W = 4.2'}</InlineMath> MHz και{' '}
        <InlineMath>{'W_{\\text{vestige}} = 1.25'}</InlineMath> MHz.
      </>
    ),
    derivation: (
      <>
        Πλήρης USB <InlineMath>{'W'}</InlineMath> + vestige LSB{' '}
        <InlineMath>{'W_{\\text{vestige}}'}</InlineMath> =
        <InlineMath>{'W + W_{\\text{vestige}}'}</InlineMath>.
      </>
    ),
  },
  'envelope-detector-rc': {
    intuition: (
      <>
        Ο πυκνωτής πρέπει να κρατάει την τάση μεταξύ carrier peaks{' '}
        (<InlineMath>{'RC \\gg 1/f_c'}</InlineMath>) ΑΛΛΑ να εκφορτίζει αρκετά γρήγορα ώστε
        να ακολουθεί το envelope (<InlineMath>{'RC \\ll 1/W'}</InlineMath>). Λάθος RC ⇒ είτε
        ripple (μικρό), είτε «diagonal clipping» distortion (μεγάλο).
      </>
    ),
    derivation: (
      <>
        Σε κάθε carrier peak ο C φορτίζει στην τιμή του envelope. Discharge constant{' '}
        <InlineMath>{'RC'}</InlineMath> ορίζει πόσο γρήγορα μπορεί να πέσει — πρέπει να
        χωράει μεταξύ <InlineMath>{'1/f_c'}</InlineMath> και <InlineMath>{'1/W'}</InlineMath>.
      </>
    ),
  },
  'am-output-snr': {
    intuition: (
      <>
        Στην Conventional AM ο carrier καταναλώνει ισχύ χωρίς να μεταφέρει πληροφορία. Στο
        high-SNR regime, αυτή η σπατάλη μεταφράζεται σε γραμμική απώλεια output SNR κατά
        τον παράγοντα <InlineMath>{'\\eta'}</InlineMath>. Γενικός τύπος (όπως στις
        ασκήσεις του μαθήματος, Άσκηση 4.1):{' '}
        <InlineMath>{'\\eta = P_m / (A_c^2 + P_m)'}</InlineMath>. Για{' '}
        <InlineMath>{'\\mu = 1'}</InlineMath> single-tone αυτό δίνει{' '}
        <InlineMath>{'\\eta = 1/3'}</InlineMath> ή <strong>−4.8 dB</strong> κάτω από DSB-SC.
      </>
    ),
    derivation: (
      <>
        Useful (sideband) power <InlineMath>{'= P_m/2'}</InlineMath>, total transmitted
        power <InlineMath>{'= (A_c^2 + P_m)/2'}</InlineMath>· λόγος{' '}
        <InlineMath>{'\\eta = P_m/(A_c^2 + P_m)'}</InlineMath>. Για single-tone{' '}
        <InlineMath>{'P_m = A_m^2/2 = \\mu^2 A_c^2/2'}</InlineMath> δίνει{' '}
        <InlineMath>{'\\eta = (\\mu^2/2)/(1 + \\mu^2/2)'}</InlineMath>.
      </>
    ),
  },
  'nonlinear-modulator-fc': {
    intuition: (
      <>
        Όταν ο modulator είναι μη γραμμικός με <InlineMath>{'d_2 v^2'}</InlineMath> όρο,
        παράγει επίσης <InlineMath>{'d_2 m^2(t)'}</InlineMath> στο baseband. Από convolution
        theorem, <InlineMath>{'m^2'}</InlineMath> έχει <strong>διπλάσιο</strong> bandwidth
        (<InlineMath>{'2W'}</InlineMath>) από το αρχικό <InlineMath>{'m'}</InlineMath>. Για
        να μη μπει στο BPF γύρω από <InlineMath>{'f_c'}</InlineMath>, χρειάζεται κενό:{' '}
        <InlineMath>{'f_c - W > 2W'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        Convolution theorem:{' '}
        <InlineMath>{'\\mathcal{F}\\{m^2\\} = M(f) * M(f)'}</InlineMath>· αν{' '}
        <InlineMath>{'M(f)'}</InlineMath> έχει support <InlineMath>{'[-W, W]'}</InlineMath>,
        η συνέλιξη έχει support <InlineMath>{'[-2W, 2W]'}</InlineMath>. BPF{' '}
        <InlineMath>{'[f_c - W, f_c + W]'}</InlineMath> καθαρό ⇔{' '}
        <InlineMath>{'f_c > 3W'}</InlineMath>.
      </>
    ),
  },
  'fdm-spacing': {
    intuition: (
      <>
        Στο FDM δύο κανάλια συνυπάρχουν στο ίδιο φάσμα γύρω από{' '}
        <InlineMath>{'f_1'}</InlineMath> και <InlineMath>{'f_2'}</InlineMath>. Για να
        ξεχωρίσει ο δέκτης το ένα από το άλλο με ένα BPF, τα δύο spectral supports δεν
        πρέπει να τέμνονται. Το <strong>SSB</strong> κερδίζει διπλάσια χωρητικότητα γιατί
        κάθε κανάλι έχει εύρος ζώνης <InlineMath>{'W'}</InlineMath> αντί για{' '}
        <InlineMath>{'2W'}</InlineMath>.
      </>
    ),
    derivation: (
      <>
        DSB-SC / Συμβατικό AM: κάθε κανάλι από <InlineMath>{'f_c - W'}</InlineMath> έως{' '}
        <InlineMath>{'f_c + W'}</InlineMath> ⇒ ελάχιστη μη-επικάλυψη όταν{' '}
        <InlineMath>{'f_2 - W \\geq f_1 + W \\Leftrightarrow \\Delta f \\geq 2W'}</InlineMath>.
        SSB: κάθε κανάλι έχει μόνο μία πλευρική ζώνη (πλάτους W) ⇒{' '}
        <InlineMath>{'\\Delta f \\geq W'}</InlineMath>. VSB: μία πλευρική + vestige ⇒{' '}
        <InlineMath>{'\\Delta f \\geq W + W_{\\text{vestige}}'}</InlineMath>. Στην πράξη
        προστίθεται guard band για μη-ιδανικά φίλτρα.
      </>
    ),
  },

  // ── FM / PM ──────────────────────────────────────────────────
  'fm-signal': {
    intuition: (
      <>
        Στο FM, το message αλλάζει την στιγμιαία συχνότητα του carrier. Άρα η φάση είναι
        το ολοκλήρωμα του <InlineMath>{'m(t)'}</InlineMath>: σταθερό m ⇒ σταθερή μετατόπιση
        συχνότητας, ανερχόμενο m ⇒ επιταχυνόμενη φάση. Το πλάτος μένει σταθερό (constant
        envelope).
      </>
    ),
    derivation: (
      <>
        Στιγμιαία συχνότητα <InlineMath>{'f(t) = f_c + K_f m(t)'}</InlineMath>· φάση{' '}
        <InlineMath>{'\\theta(t) = 2\\pi \\int f\\,d\\tau = 2\\pi f_c t + 2\\pi K_f \\int m\\,d\\tau'}</InlineMath>.
      </>
    ),
  },
  'fm-single-tone': {
    intuition: (
      <>
        Όταν το message είναι ένα τόνος, η φάση κάνει ταλάντωση ημιτονοειδή. Το πλάτος
        αυτής της ταλάντωσης <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath> είναι ο FM
        index — ορίζει πόσο δραματικά αλλάζει η συχνότητα. Μεγάλο{' '}
        <InlineMath>\beta</InlineMath> ⇒ πολλά Bessel sidebands· μικρό{' '}
        <InlineMath>\beta</InlineMath> ⇒ μόνο carrier + <InlineMath>{'\\pm f_m'}</InlineMath>{' '}
        (narrowband FM).
      </>
    ),
    derivation: (
      <>
        Με <InlineMath>{'m = A_m \\cos(2\\pi f_m t)'}</InlineMath>:{' '}
        <InlineMath>{'\\int m = (A_m / 2\\pi f_m) \\sin(2\\pi f_m t)'}</InlineMath> ⇒{' '}
        <InlineMath>{'\\beta = K_f A_m / f_m = \\Delta f / f_m'}</InlineMath>.
      </>
    ),
  },
  'pm-signal': {
    intuition: (
      <>
        Το PM διαμορφώνει απευθείας τη φάση (χωρίς ολοκλήρωμα), οπότε είναι ο{' '}
        differentiated «ξάδερφος» του FM. Πρακτικά:{' '}
        <InlineMath>{'\\text{PM}(m(t)) \\equiv \\text{FM}(dm/dt)'}</InlineMath>.
        Ίδιο hardware, ίδια μαθηματικά — απλά μία παράγωγος ενδιάμεσα.
      </>
    ),
    derivation: (
      <>
        Εξ ορισμού, phase deviation <InlineMath>{'\\phi(t) = K_p m(t)'}</InlineMath>· εισάγεις
        στο <InlineMath>{'A_c \\cos(2\\pi f_c t + \\phi)'}</InlineMath>.
      </>
    ),
  },
  'fm-instantaneous-freq': {
    intuition: (
      <>
        Η «συχνότητα» ενός FM σήματος σε κάθε στιγμή είναι η παράγωγος της συνολικής
        φάσης. Στο FM, αυτή η παράγωγος ΕΙΝΑΙ το message (μέχρι το{' '}
        <InlineMath>{'K_f'}</InlineMath>) — έτσι ανακτάει το{' '}
        <InlineMath>{'m(t)'}</InlineMath> ο frequency discriminator.
      </>
    ),
    derivation: (
      <>
        Παραγωγίζοντας <InlineMath>{'\\theta_{FM}(t) = 2\\pi f_c t + 2\\pi K_f \\int m'}</InlineMath>{' '}
        και διαιρώντας με <InlineMath>{'2\\pi'}</InlineMath> ⇒{' '}
        <InlineMath>{'f(t) = f_c + K_f m(t)'}</InlineMath>.
      </>
    ),
  },
  'fm-beta': {
    intuition: (
      <>
        Το <InlineMath>{'\\beta'}</InlineMath> σου λέει «narrowband ή wideband FM;».{' '}
        <InlineMath>{'\\beta < 0.3'}</InlineMath> ⇒ narrowband (μοιάζει με DSB-SC,{' '}
        2 sidebands). <InlineMath>{'\\beta > 1'}</InlineMath> ⇒ wideband (πολλά Bessel
        sidebands, μεγάλο SNR gain). Είναι η κεντρική παράμετρος όλης της FM ανάλυσης.
      </>
    ),
    derivation: (
      <>
        FM: <InlineMath>{'\\Delta f = K_f \\max|m|'}</InlineMath>· διαιρείς με το{' '}
        message bandwidth <InlineMath>W</InlineMath>. PM: phase deviation κατευθείαν{' '}
        <InlineMath>{'K_p \\max|m|'}</InlineMath>.
      </>
    ),
  },
  'fm-bessel-expansion': {
    intuition: (
      <>
        Jacobi-Anger — μια complex exponential με ημιτονοειδή φάση «εκρήγνυται» σε ΟΛΟΥΣ
        τους ακέραιους harmonics, καθένας με βάρος Bessel <InlineMath>{'J_n(\\beta)'}</InlineMath>.
        Συνολική ενέργεια διατηρείται: <InlineMath>{'\\sum J_n^2 = 1'}</InlineMath>. Αυτός είναι
        ο λόγος που FM έχει θεωρητικά άπειρα sidebands.
      </>
    ),
    derivation: (
      <>
        Οι <InlineMath>{'J_n(\\beta)'}</InlineMath> ορίζονται ακριβώς από αυτή τη generating-
        function σχέση — δεν αποδεικνύεται, είναι ο ορισμός.
      </>
    ),
  },
  'fm-bessel-sidebands': {
    intuition: (
      <>
        Single-tone FM έχει spectral lines σε ΚΑΘΕ <InlineMath>{'f_c + n f_m'}</InlineMath>{' '}
        (θετικά ΚΑΙ αρνητικά <InlineMath>n</InlineMath>), με πλάτη{' '}
        <InlineMath>{'A_c J_n(\\beta)'}</InlineMath>. Πρακτικά: ~98% της ενέργειας στα{' '}
        <InlineMath>{'|n| \\le \\beta + 1'}</InlineMath> ⇒ αυτό δίνει τον Carson's rule.
      </>
    ),
    derivation: (
      <>
        Εφαρμογή Jacobi-Anger στο <InlineMath>{'e^{j\\beta \\sin(2\\pi f_m t)}'}</InlineMath>{' '}
        ⇒ πραγματικό μέρος ⇒ <InlineMath>{'\\sum J_n(\\beta) \\cos[2\\pi(f_c + n f_m)t]'}</InlineMath>.
      </>
    ),
  },
  'fm-bessel-property': {
    intuition: (
      <>
        Negative-order Bessels καθορίζονται από positive ones, εναλλαγή πρόσημου. Sum
        of squares = 1 σημαίνει ότι η ενέργεια ΑΝΑΔΙΑΝΕΜΕΤΑΙ μεταξύ sidebands καθώς
        αλλάζει <InlineMath>{'\\beta'}</InlineMath>· ο carrier (<InlineMath>{'J_0'}</InlineMath>)
        μπορεί ακόμα και να μηδενιστεί σε ορισμένα <InlineMath>{'\\beta'}</InlineMath>{' '}
        (≈ 2.405, 5.52, ...).
      </>
    ),
    derivation: (
      <>
        Από τον integral ορισμό <InlineMath>{'J_n(\\beta) = \\tfrac{1}{\\pi}\\int_0^{\\pi} \\cos(n\\theta - \\beta \\sin\\theta)\\,d\\theta'}</InlineMath>{' '}
        + Parseval στο <InlineMath>{'e^{j\\beta \\sin\\theta}'}</InlineMath>.
      </>
    ),
  },
  carson: {
    intuition: (
      <>
        Carson's rule — ο εμπειρικός κανόνας για FM bandwidth που πιάνει ~98% της
        ενέργειας. Narrowband (<InlineMath>{'\\beta'}</InlineMath> μικρό):{' '}
        <InlineMath>{'B \\approx 2W'}</InlineMath> (όπως DSB-SC). Wideband:{' '}
        <InlineMath>{'B \\approx 2\\Delta f'}</InlineMath>. Όσο μεγαλώνει το{' '}
        <InlineMath>{'\\beta'}</InlineMath>, ξοδεύεις περισσότερο bandwidth για να
        κερδίσεις SNR.
      </>
    ),
    derivation: (
      <>
        Σημαντικά Bessel sidebands: <InlineMath>{'|n| \\le \\beta + 1'}</InlineMath> ⇒{' '}
        <InlineMath>{'B = 2(\\beta+1) f_m = 2(\\Delta f + f_m)'}</InlineMath>· γενικευμένα με{' '}
        <InlineMath>{'W'}</InlineMath> αντί για <InlineMath>{'f_m'}</InlineMath>.
      </>
    ),
  },
  'fm-power': {
    intuition: (
      <>
        Επειδή το FM έχει constant envelope, η συνολική ισχύς είναι απλά{' '}
        <InlineMath>{'A_c^2/2'}</InlineMath> ΑΝΕΞΑΡΤΗΤΑ από το{' '}
        <InlineMath>{'\\beta'}</InlineMath>. Το <InlineMath>{'\\beta'}</InlineMath>{' '}
        ΑΝΑΔΙΑΝΕΜΕΙ την ισχύ μεταξύ sidebands αλλά δεν αλλάζει το σύνολο. Σε αντίθεση με
        το AM όπου το <InlineMath>{'\\mu'}</InlineMath> αλλάζει το σύνολο.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\langle (A_c \\cos\\theta(t))^2 \\rangle = A_c^2 \\langle \\cos^2 \\rangle = A_c^2/2'}</InlineMath>{' '}
        για κάθε <InlineMath>{'\\theta(t)'}</InlineMath>.
      </>
    ),
  },
  'fm-snr-ref': {
    intuition: (
      <>
        Η universal «αναφορά» κάτω από την οποία συγκρίνουμε AM και FM στο ίδιο{' '}
        <InlineMath>{'P_T'}</InlineMath> και ίδιο message bandwidth{' '}
        <InlineMath>W</InlineMath>. Δεν είναι κανένα φυσικό SNR του δέκτη — είναι το
        SNR που θα είχες <em>αν</em> ολόκληρη η ισχύς <InlineMath>{'A_c^2/2'}</InlineMath>{' '}
        έφτανε σε baseband εύρους <InlineMath>W</InlineMath> χωρίς bandpass overhead.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\text{SNR}_{ref} \\triangleq P_{signal} / (N_0 W) = (A_c^2/2)/(N_0 W)'}</InlineMath>.
        Όλοι οι «output SNR» τύποι AM/FM γράφονται σαν πολλαπλάσιο του
        <InlineMath>{'\\text{SNR}_{ref}'}</InlineMath>.
      </>
    ),
  },
  'fm-noise-output-psd': {
    intuition: (
      <>
        Ο discriminator διαφορίζει τη φάση. Στο φάσμα, διαφόριση =
        πολλαπλασιασμός με <InlineMath>{'j2\\pi f'}</InlineMath> ⇒ η PSD γίνεται
        <InlineMath>{'\\propto f^2'}</InlineMath>. Από επίπεδος θόρυβος μέσα στο
        message band γίνεται <strong>παραβολικός</strong> — γνωστό ως
        «triangular noise spectrum».
      </>
    ),
    derivation: (
      <>
        Phase noise <InlineMath>{'\\theta_n \\approx n_Q/A_c'}</InlineMath> (small-noise){' '}
        ⇒ <InlineMath>{'S_\\theta = N_0/A_c^2'}</InlineMath>· διαφόριση ⇒{' '}
        <InlineMath>{'S_{v_n}(f) = f^2 \\cdot S_\\theta(f) = N_0 f^2/A_c^2'}</InlineMath>.
      </>
    ),
  },
  'fm-snr-out': {
    intuition: (
      <>
        Wideband FM ανταλλάζει bandwidth με SNR. Διπλασιάζεις{' '}
        <InlineMath>{'\\beta'}</InlineMath> ⇒ 4× output SNR — quadratic gain. Αυτός είναι Ο
        λόγος που υπάρχει wideband FM (broadcast με <InlineMath>{'\\beta \\approx 5'}</InlineMath>{' '}
        κάθεται ~20× καλύτερα από AM σε ίδιο input SNR).
      </>
    ),
    derivation: (
      <>
        Output noise PSD μετά τον discriminator πέφτει σαν{' '}
        <InlineMath>{'f^2 N_0 / A_c^2'}</InlineMath>· ολοκληρώνεις σε{' '}
        <InlineMath>{'[-W, W]'}</InlineMath> για να πάρεις{' '}
        <InlineMath>{'P_n = 2 N_0 W^3 / (3 A_c^2)'}</InlineMath>· σχήμα ισχύος σήματος{' '}
        <InlineMath>{'P_s = (\\Delta f)^2 / 2'}</InlineMath> για single-tone ⇒ ratio{' '}
        <InlineMath>{'3\\beta^2 \\cdot \\text{SNR}_{ref}'}</InlineMath>.
      </>
    ),
  },
  'fm-threshold': {
    intuition: (
      <>
        Πάνω από <InlineMath>{'\\sim 10'}</InlineMath> dB SNR_in, ο γραμμικός τύπος
        ισχύει. Κάτω από αυτό, το resultant phasor (carrier + noise) <em>κοντοζυγώνει
        το μηδέν</em> και ο discriminator κάνει <strong>«clicks»</strong> — false
        zero crossings που εμφανίζονται ως κρότοι στην έξοδο. Το SNR_out πέφτει
        πολύ πιο γρήγορα από ότι προβλέπει ο γραμμικός τύπος.
      </>
    ),
    derivation: (
      <>
        «<InlineMath>{'\\sim 10'}</InlineMath> dB» είναι loose qualifier
        — το ακριβές threshold εξαρτάται από τον δέκτη και αυξάνεται με{' '}
        <InlineMath>{'\\beta'}</InlineMath> (περισσότερο BW = περισσότερος θόρυβος που μπαίνει).
      </>
    ),
  },
  'fm-pre-emphasis': {
    intuition: (
      <>
        Triangular noise σημαίνει ότι οι υψηλές συχνότητες του message πληρώνουν
        περισσότερο. Στο μουσικό σήμα όμως οι υψηλές έχουν ήδη μικρότερη ισχύ —
        άρα διπλή ζημιά. <strong>Pre-emphasis</strong> στον πομπό ενισχύει τις
        υψηλές πριν τη μετάδοση· <strong>de-emphasis</strong> στον δέκτη τις
        ξανακόβει. Ο θόρυβος που μπήκε <em>μετά</em> το pre-emphasis κόβεται μαζί
        με τη de-emphasis πτώση.
      </>
    ),
    derivation: (
      <>
        High-shelf με σταθερά χρόνου <InlineMath>{'\\tau = 50\\,\\mu s'}</InlineMath>{' '}
        (Europe) ή <InlineMath>{'75\\,\\mu s'}</InlineMath> (US/Japan). SNR
        βελτίωση ~12-13 dB στο εμπορικό FM ραδιόφωνο.
      </>
    ),
  },
  'fm-gain-am': {
    intuition: (
      <>
        Άμεση σύγκριση: FM με <InlineMath>{'\\beta'}</InlineMath> κερδίζει AM (<InlineMath>{'\\mu=1'}</InlineMath>){' '}
        με factor <InlineMath>{'9\\beta^2'}</InlineMath>. Για broadcast FM (<InlineMath>{'\\beta = 5'}</InlineMath>):
        ~23dB. Παγίδα: μόνο πάνω από το FM threshold (~10dB input SNR)· κάτω από αυτό, το
        FM «καταρρέει».
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'\\text{SNR}_{FM} = 3\\beta^2 \\cdot \\text{SNR}_{ref}'}</InlineMath>;{' '}
        <InlineMath>{'\\text{SNR}_{AM(\\mu=1)} = (1/3) \\cdot \\text{SNR}_{ref}'}</InlineMath>{' '}
        ⇒ ratio = <InlineMath>{'9\\beta^2'}</InlineMath>.
      </>
    ),
  },
  'bessel-table': {
    intuition: (
      <>
        Ο standard πίνακας για να ψάχνεις πλάτη FM sideband γνωρίζοντας το{' '}
        <InlineMath>{'\\beta'}</InlineMath>. Δίνεται στο τυπολόγιο. Χρήσεις: εύρεση Bessel
        zeros (όπου <InlineMath>{'J_0'}</InlineMath> μηδενίζεται — carrier disappears),
        μέτρηση «σημαντικών» sidebands, υπολογισμός ισχύος ανά πλευρική.
      </>
    ),
    derivation: (
      <>
        Tabulated τιμές από τον integral ορισμό{' '}
        <InlineMath>{'J_n(\\beta) = \\tfrac{1}{\\pi}\\int_0^{\\pi} \\cos(n\\theta - \\beta\\sin\\theta)\\,d\\theta'}</InlineMath>.
      </>
    ),
  },
  'fm-significant-harmonics': {
    intuition: (
      <>
        Το slide 46 δίνει τον ΑΚΡΙΒΗ αριθμό σημαντικών αρμονικών:{' '}
        <InlineMath>{'N = 2\\lfloor\\beta\\rfloor + 3'}</InlineMath>. Παράδειγμα{' '}
        <InlineMath>{'\\beta = 10'}</InlineMath> ⇒{' '}
        <InlineMath>{'N = 23'}</InlineMath> συνιστώσες (carrier + 11 ζεύγη sidebands).
        Συνδέεται στενά με το Carson{' '}
        <InlineMath>{'B = 2(\\beta+1)W'}</InlineMath>: αν χωρίσεις το{' '}
        <InlineMath>B</InlineMath> σε διαστήματα{' '}
        <InlineMath>{'f_m = W'}</InlineMath>, παίρνεις περίπου{' '}
        <InlineMath>{'2(\\beta+1)+1 = 2\\beta+3'}</InlineMath> γραμμές, που είναι το ίδιο
        με το <InlineMath>{'2\\lfloor\\beta\\rfloor+3'}</InlineMath> για ακέραιο β.
      </>
    ),
    derivation: (
      <>
        Bessel αμελητέο για <InlineMath>{'|n| > \\beta'}</InlineMath>. Εμπειρικά,
        κρατάς <InlineMath>{'|n| \\le \\lfloor\\beta\\rfloor + 1'}</InlineMath>, οπότε
        αριθμός θετικά+αρνητικά+carrier = <InlineMath>{'2(\\lfloor\\beta\\rfloor+1)+1 = 2\\lfloor\\beta\\rfloor+3'}</InlineMath>.
      </>
    ),
  },

  // ── Random ───────────────────────────────────────────────────
  'random-mean': {
    intuition: (
      <>
        Σε κάθε στιγμή <InlineMath>t</InlineMath>, το <InlineMath>{'X(t)'}</InlineMath>{' '}
        είναι τυχαία μεταβλητή — average across the ensemble. Το αποτέλεσμα είναι
        deterministic function of <InlineMath>t</InlineMath>. Για stationary processes
        είναι σταθερό.
      </>
    ),
  },
  'random-autocorr': {
    intuition: (
      <>
        Πόσο «correlated» είναι το process μεταξύ δύο χρονικών στιγμών. Για WSS εξαρτάται
        ΜΟΝΟ από το lag <InlineMath>{'\\tau = t_2 - t_1'}</InlineMath>{' '}
        ⇒ <InlineMath>{'R_X(\\tau)'}</InlineMath>. Όλη η spectral δομή του process είναι
        κωδικοποιημένη εδώ.
      </>
    ),
  },
  'random-cross': {
    intuition: (
      <>
        Correlation μεταξύ δύο διαφορετικών processes — χρήσιμη για σύνδεση input/output, ή
        modulator/demodulator branches. Covariance = το ίδιο μείον{' '}
        <InlineMath>{'\\mu_X \\mu_Y'}</InlineMath> (zero-mean εκδοχή).
      </>
    ),
  },
  wss: {
    intuition: (
      <>
        Wide-sense stationary — οι δύο βασικές στατιστικές δεν εξαρτώνται από απόλυτο χρόνο.
        Αρκεί για Wiener-Khinchin, ορισμό PSD, ανάλυση του σήματος ως «αντικείμενο στη
        συχνότητα». Τα περισσότερα πρακτικά σήματα (θόρυβος, modulated με random phase)
        είναι WSS.
      </>
    ),
    derivation: (
      <>
        Strict stationarity είναι πιο ισχυρή (όλες οι joint distributions invariant)· WSS
        είναι η πρακτική, «πρώτων-δύο-ροπών» εκδοχή.
      </>
    ),
  },
  'wiener-khinchin': {
    intuition: (
      <>
        Για WSS processes, η PSD ΕΙΝΑΙ ο Fourier της autocorrelation. Το{' '}
        <InlineMath>{'R_X(0)'}</InlineMath> είναι η συνολική ισχύς. Είναι η γέφυρα από
        «πώς φαίνεται το σήμα στον χρόνο» σε «ποιες συχνότητες πιάνει». Κάθε ανάλυση
        θορύβου περνά από εδώ.
      </>
    ),
    derivation: (
      <>
        Ορισμός μέσω <InlineMath>{'\\mathcal{F}\\{R_X(\\tau)\\}'}</InlineMath>, ή ισοδύναμα μέσω
        του ορίου <InlineMath>{'E[|X_T(f)|^2]/T'}</InlineMath> για truncated realization.
      </>
    ),
  },
  'random-phase-cosine': {
    intuition: (
      <>
        Ένα cosine με ομοιόμορφα τυχαία φάση είναι το πρωτότυπο WSS σήμα. Η τυχαία φάση
        «ξεπλένει» την εξάρτηση από τον απόλυτο χρόνο στη μέση τιμή· η autocorrelation
        εξαρτάται μόνο από lag. Το textbook παράδειγμα γιατί δίνει closed-form ανάλυση.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'E[\\cos(2\\pi f_0 t + \\Theta)] = 0'}</InlineMath> (ολοκλήρωμα{' '}
        <InlineMath>{'\\cos'}</InlineMath> σε πλήρη κύκλο). Για{' '}
        <InlineMath>{'R(\\tau)'}</InlineMath>: product-to-sum ⇒ το{' '}
        <InlineMath>{'\\cos(\\text{sum})'}</InlineMath> με τυχαία 2Θ μηδενίζεται· μένει το{' '}
        <InlineMath>{'\\tfrac{A^2}{2}\\cos(2\\pi f_0 \\tau)'}</InlineMath>.
      </>
    ),
  },

  // ── Noise ────────────────────────────────────────────────────
  'thermal-noise': {
    intuition: (
      <>
        Κάθε αντίσταση σε θερμοκρασία <InlineMath>T</InlineMath> εκπέμπει ισχύ θορύβου{' '}
        ανάλογη του <InlineMath>T</InlineMath> και του παρατηρούμενου bandwidth{' '}
        <InlineMath>B</InlineMath>. Σε <InlineMath>{'T_0 = 290'}</InlineMath> K, ανά Hz:{' '}
        -174 dBm — το θεμελιώδες πάτωμα κάθε receiver. Η σταθερά Boltzmann ορίζει την
        αναλογία θερμοκρασίας ↔ ισχύος.
      </>
    ),
    derivation: (
      <>
        Από statistical mechanics — equipartition. Κάθε mode έχει μέση ενέργεια{' '}
        <InlineMath>{'kT'}</InlineMath>· σε bandwidth <InlineMath>B</InlineMath>,
        διαθέσιμη ισχύς <InlineMath>{'kTB'}</InlineMath>.
      </>
    ),
  },
  'white-noise-psd': {
    intuition: (
      <>
        Ο λευκός θόρυβος έχει επίπεδη PSD — ίδια ισχύς ανά Hz σε κάθε συχνότητα
        (μαθηματική ιδανικότητα). Η autocorrelation είναι <InlineMath>{'\\delta(\\tau)'}</InlineMath>{' '}
        — δείγματα σε διαφορετικές στιγμές τέλεια ασυσχέτιστα.
      </>
    ),
    derivation: (
      <>
        Ορισμός + Wiener-Khinchin: <InlineMath>{'\\mathcal{F}\\{\\delta\\} = \\text{const}'}</InlineMath>{' '}
        ⇒ flat PSD. Two-sided convention τοποθετεί <InlineMath>{'N_0/2'}</InlineMath> σε κάθε
        πλευρά.
      </>
    ),
  },
  'lti-output-psd': {
    intuition: (
      <>
        Ένα LTI φίλτρο σχηματίζει το spectrum του θορύβου πολλαπλασιάζοντας με{' '}
        <InlineMath>{'|H(f)|^2'}</InlineMath>. Λευκός θόρυβος μέσα από LPF γίνεται
        coloured θόρυβος συγκεντρωμένος στις χαμηλές. Αυτή είναι Η εξίσωση για «πώς
        φαίνεται ο θόρυβος μετά το φίλτρο».
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'Y = X * h'}</InlineMath> ⇒ <InlineMath>{'R_Y = R_X * (h \\star h)'}</InlineMath>;
        FT και των δύο πλευρών ⇒ <InlineMath>{'S_Y = S_X |H|^2'}</InlineMath>.
      </>
    ),
  },
  'bandpass-noise-r': {
    intuition: (
      <>
        Λευκός θόρυβος μέσα από ιδανικό bandpass γύρω από <InlineMath>{'f_c'}</InlineMath>{' '}
        με bandwidth <InlineMath>W</InlineMath>. Το αποτέλεσμα έχει sinc envelope (από το
        bandwidth) που διαμορφώνεται από cosine στη <InlineMath>{'f_c'}</InlineMath>. Δείχνει
        πώς filter shape και centre frequency ελέγχουν χωριστά τη στατιστική.
      </>
    ),
    derivation: (
      <>
        <InlineMath>{'|H(f)|^2'}</InlineMath> = δύο rectangles στις{' '}
        <InlineMath>{'\\pm f_c'}</InlineMath>, καθένα width <InlineMath>W</InlineMath> ⇒
        inverse FT ⇒ <InlineMath>{'\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c \\tau)'}</InlineMath>.
      </>
    ),
  },
  snr: {
    intuition: (
      <>
        Signal-to-noise ratio — η θεμελιώδης μετρική «είναι αυτό το σήμα ανακτήσιμο;».
        Η dB κλίμακα μετατρέπει multiplicative gains σε additive — κάθε 3dB διπλασιάζει,
        κάθε 10dB δεκαπλασιάζει.
      </>
    ),
    derivation: (
      <>
        Ορισμός. Log scaling επειδή ανθρώπινη αντίληψη και engineering thresholds είναι
        λογαριθμικά.
      </>
    ),
  },
  'noise-figure': {
    intuition: (
      <>
        Το <InlineMath>F</InlineMath> ποσοτικοποιεί πόσο ο ενισχυτής υποβαθμίζει το SNR —{' '}
        <InlineMath>F=1</InlineMath> σημαίνει τέλεια αθόρυβος (αδύνατο)·{' '}
        <InlineMath>F=2</InlineMath> = 3dB υποβάθμιση. Equivalent noise temperature{' '}
        <InlineMath>{'T_e'}</InlineMath> μετατρέπει τον θόρυβο του ενισχυτή σε «εικονική
        κεραία που βλέπει ζεστό σώμα».
      </>
    ),
    derivation: (
      <>
        Standard ορισμοί. <InlineMath>{'T_e = (F-1) T_0'}</InlineMath> από επίλυση της
        εξίσωσης noise factor.
      </>
    ),
  },
}
