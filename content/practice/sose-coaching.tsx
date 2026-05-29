/**
 * «Σώσε το εξάμηνο» — per-exercise coaching content.
 *
 * Each entry attaches two pieces of meta-commentary to an exercise:
 *
 *   - `takeaway` — «Τι κρατάς από αυτή την άσκηση»: the durable pattern,
 *     not the solution. What can the student carry to the next problem?
 *   - `examRadar` — «Πώς θα το αναγνωρίσεις στην εξέταση»: surface signals
 *     in a problem statement that should trigger «αυτό είναι από εκείνα».
 *
 * Authoring rules (must be followed for new entries):
 *
 *   1. NEVER invent theory. The takeaway distills what the existing
 *      solution already shows. The radar names patterns visible in the
 *      problem statement.
 *   2. 2–3 sentences each. Tight. The student is on a deadline.
 *   3. Greek voice, English technical terms (matches site convention).
 *   4. Be specific to THIS problem. Generic advice is noise.
 *
 * Authored entries: see SOSE_COACHING below. Un-authored exercises just
 * skip the takeaway/radar sections — the auto-derived «Παρόμοιες» list
 * still renders, so every problem in crunch mode has at least one extra.
 */

import { InlineMath } from '@/components/math'
import type { ExerciseCoaching } from './types'

export const SOSE_COACHING: Record<string, ExerciseCoaching> = {
  // ─── Πρόοδος Απρίλιος 2026 ───────────────────────────────────────────

  'proodos26-1': {
    takeaway: (
      <p>
        Ο modulation index είναι πάντα{' '}
        <InlineMath>{'m = A_m / A_c'}</InlineMath> για single-tone message —
        ένας από τους τρεις πιο συχνούς υπολογισμούς της εξέτασης. Αν το
        αποτέλεσμα είναι <InlineMath>{'m \\le 1'}</InlineMath>, ο envelope
        detector θα δουλέψει· αν είναι <InlineMath>{'m > 1'}</InlineMath>,
        έχεις overmodulation και πρέπει να το επισημάνεις.
      </p>
    ),
    examRadar: (
      <p>
        Όταν δίνεται «πλάτος φέροντος» και «πλάτος σήματος πληροφορίας», η
        πρώτη γραμμή που γράφεις είναι σχεδόν πάντα{' '}
        <InlineMath>{'m = A_m/A_c'}</InlineMath>. Αν δεν σε ρωτάει
        ξεκάθαρα τι να βρεις, το <InlineMath>m</InlineMath> είναι το πιο
        πιθανό· και το πιο πιθανό vervolg-question είναι «βρες την ισχύ» ή
        «θα δουλέψει ο envelope detector;»
      </p>
    ),
  },

  'proodos26-2': {
    takeaway: (
      <p>
        Για conventional AM με single-tone message ισχύει{' '}
        <InlineMath>{'P_{AM} = P_c(1 + m^2/2)'}</InlineMath>. Στο{' '}
        <InlineMath>{'m=1'}</InlineMath> γίνεται{' '}
        <InlineMath>{'1.5\\,P_c'}</InlineMath> — ο carrier κουβαλάει 2/3
        της ισχύος, οι sidebands το υπόλοιπο 1/3. Αυτό είναι το όριο της
        AM efficiency και επιστρέφει σε όλες τις ασκήσεις ισχύος.
      </p>
    ),
    examRadar: (
      <p>
        «Συνολική ισχύς» + «<InlineMath>{'P_c'}</InlineMath> δοσμένο» +
        «<InlineMath>m</InlineMath> δοσμένο» → χρησιμοποιείς απευθείας τον
        τύπο. Αν δεν σου δίνει <InlineMath>{'P_c'}</InlineMath> αλλά σου
        δίνει <InlineMath>{'A_c'}</InlineMath>, υπολόγισέ το πρώτα ως{' '}
        <InlineMath>{'A_c^2/2'}</InlineMath>.
      </p>
    ),
  },

  'proodos26-3': {
    takeaway: (
      <p>
        <InlineMath>{'m=1'}</InlineMath> είναι το «sweet spot» της
        conventional AM: η περιβάλλουσα ακουμπά στο μηδέν στις κοιλάδες
        αλλά δεν αλλάζει πρόσημο, οπότε ο envelope detector ακόμα δουλεύει
        και η efficiency μεγιστοποιείται στο 33%. Πάνω από{' '}
        <InlineMath>{'m=1'}</InlineMath> έχεις phase reversals και
        παραμόρφωση.
      </p>
    ),
    examRadar: (
      <p>
        Αν η ερώτηση είναι «τι σημαίνει <InlineMath>{'m=1'}</InlineMath>»
        ή «πότε έχουμε overmodulation», η σωστή απάντηση πάντα έχει τρία
        μέρη: (i) ορισμός του full modulation, (ii) αναφορά στο 33%
        efficiency, (iii) τι παθαίνει ο envelope detector για{' '}
        <InlineMath>{'m>1'}</InlineMath>.
      </p>
    ),
  },

  'proodos26-4': {
    takeaway: (
      <p>
        Η AM efficiency είναι{' '}
        <InlineMath>{'\\eta = (m^2/2)/(1 + m^2/2)'}</InlineMath>, αύξουσα
        στο <InlineMath>m</InlineMath>, με μέγιστο{' '}
        <InlineMath>{'1/3 \\approx 33.3\\%'}</InlineMath> στο{' '}
        <InlineMath>{'m=1'}</InlineMath>. Αυτός ο αριθμός είναι ο
        κεντρικός λόγος που υπάρχουν DSB-SC και SSB.
      </p>
    ),
    examRadar: (
      <p>
        «Μέγιστο ποσοστό ισχύος στις sidebands» = «μέγιστη AM efficiency»
        = 33%. Είναι από τα πιο αναμενόμενα True/False / σύντομα ερωτήματα
        — ξέρε το νούμερο και ξέρε ότι επιτυγχάνεται στο{' '}
        <InlineMath>{'m=1'}</InlineMath>.
      </p>
    ),
  },

  'proodos26-5': {
    takeaway: (
      <p>
        Ο square-law modulator δουλεύει επειδή το{' '}
        <InlineMath>{'(c+m)^2'}</InlineMath> παράγει cross-term{' '}
        <InlineMath>{'2 c\\cdot m'}</InlineMath> στη συχνότητα{' '}
        <InlineMath>{'f_c'}</InlineMath>. Όλοι οι άλλοι όροι (DC,{' '}
        <InlineMath>{'m'}</InlineMath>, <InlineMath>{'m^2'}</InlineMath>,{' '}
        <InlineMath>{'2f_c'}</InlineMath> harmonic) πετιούνται από το BPF.
        Χωρίς μη-γραμμικότητα δεν παίρνεις πολλαπλασιαστικό όρο, μόνο
        άθροισμα — γι' αυτό η δίοδος είναι κρίσιμη.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε / περιγράψτε modulator με δίοδο» → πρέπει να δείξεις (i)
        αθροιστή <InlineMath>{'c+m'}</InlineMath>, (ii) μη-γραμμικό
        στοιχείο (δίοδος), (iii) BPF γύρω από{' '}
        <InlineMath>{'f_c'}</InlineMath>, και να εξηγήσεις γιατί το BPF
        κρατάει μόνο το AM σήμα. Διαγράμματα μπλοκ φέρνουν εύκολους
        βαθμούς.
      </p>
    ),
  },

  'proodos26-6': {
    takeaway: (
      <p>
        <strong>
          Θόρυβος μέσα από οποιοδήποτε LTI — μία συνταγή δύο βημάτων:
        </strong>{' '}
        πρώτα <InlineMath>{'S_y(f) = |H(f)|^2 S_n(f)'}</InlineMath>, μετά
        ολοκλήρωσε για την ισχύ, <InlineMath>{'P = \\int S_y(f)\\,df'}</InlineMath>.
        Για <em>ιδανικό</em> φίλτρο το <InlineMath>{'|H|^2'}</InlineMath> είναι 0
        ή 1, οπότε το ολοκλήρωμα εκφυλίζεται σε καθαρό{' '}
        <strong>εμβαδόν εντός ζώνης</strong> = ύψος × συνολικό πλάτος. Με ύψος{' '}
        <InlineMath>{'N_0/2'}</InlineMath> και ιδανικό LPF cutoff{' '}
        <InlineMath>W</InlineMath> (συνολικό πλάτος <InlineMath>{'2W'}</InlineMath>)
        βγαίνει <InlineMath>{'P = N_0 W'}</InlineMath>. Όταν δεις «επίπεδος
        θόρυβος μέσα από ιδανικό φίλτρο», μην ολοκληρώνεις τυφλά — η απάντηση
        είναι ύψος × πλάτος· και αυτό το <InlineMath>{'N_0 W'}</InlineMath> θα το
        ξαναδείς ως τον παρονομαστή κάθε SNR.
      </p>
    ),
    examRadar: (
      <>
        <p>
          «Λευκός θόρυβος» + «ιδανικό φίλτρο» + «ισχύς εξόδου» → απάντηση μιας
          γραμμής: <InlineMath>{'P = (N_0/2)\\int |H(f)|^2\\,df'}</InlineMath> =
          ύψος × συνολικό πλάτος ζώνης. Ιδανικό LPF cutoff <InlineMath>W</InlineMath>{' '}
          → πλάτος <InlineMath>{'2W'}</InlineMath> →{' '}
          <InlineMath>{'P = N_0 W'}</InlineMath>. Χρόνος-στόχος:{' '}
          <strong>~2 λεπτά</strong> — σχεδόν δωρεάν μονάδες, μην ξοδέψεις
          παραπάνω.
        </p>
        <div className="my-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Η παγίδα — one-sided vs two-sided (παράγοντας 2).</strong>{' '}
          Με την δίψας όψεως (two-sided) σύμβαση{' '}
          <InlineMath>{'S_n = N_0/2'}</InlineMath> ολοκληρώνεις σε <em>όλη</em> τη
          ζώνη <InlineMath>{'[-W, W]'}</InlineMath> (πλάτος{' '}
          <InlineMath>{'2W'}</InlineMath>): το{' '}
          <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> και το <InlineMath>2</InlineMath>{' '}
          ακυρώνονται → <InlineMath>{'N_0 W'}</InlineMath>. Σφάλμα παράγοντα 2 αν{' '}
          <em>μπερδέψεις</em> τα ζευγάρια: το{' '}
          <InlineMath>{'(N_0/2)\\times W'}</InlineMath> (ξεχνάς τις αρνητικές
          συχνότητες) δίνει <InlineMath>{'N_0 W/2'}</InlineMath>, ενώ το{' '}
          <InlineMath>{'N_0 \\times 2W'}</InlineMath> (μονόπλευρο επί διπλό
          πλάτος) δίνει <InlineMath>{'2 N_0 W'}</InlineMath>. Κράτα ένα ζευγάρι
          σταθερό: two-sided <InlineMath>{'N_0/2'}</InlineMath> με πλάτος{' '}
          <InlineMath>{'2W'}</InlineMath>, ή one-sided <InlineMath>{'N_0'}</InlineMath>{' '}
          με πλάτος <InlineMath>W</InlineMath>. Και προσοχή: το «<InlineMath>{'N_0 \\times'}</InlineMath>{' '}
          εύρος» ισχύει μόνο για <em>ιδανικά</em> φίλτρα — σε RC LPF το ολοκλήρωμα
          δίνει <InlineMath>{'\\pi N_0 f_c/2'}</InlineMath>, όχι{' '}
          <InlineMath>{'N_0 f_c'}</InlineMath>.
        </div>
      </>
    ),
  },

  'proodos26-7': {
    takeaway: (
      <p>
        Σφάλμα φάσης <InlineMath>{'\\varphi'}</InlineMath> στον σύμφωνο
        αποδιαμορφωτή πολλαπλασιάζει την έξοδο με{' '}
        <InlineMath>{'\\cos\\varphi'}</InlineMath>. Στο{' '}
        <InlineMath>{'\\varphi = \\pi/2'}</InlineMath> έχεις πλήρες{' '}
        <em>quadrature null</em> — μηδέν σήμα. Αυτός είναι ο λόγος που
        χρειάζεσαι PLL ή carrier recovery για coherent demod.
      </p>
    ),
    examRadar: (
      <p>
        «Σφάλμα φάσης / phase error στον σύμφωνο αποδιαμορφωτή» →
        η απάντηση είναι σχεδόν πάντα ο τύπος{' '}
        <InlineMath>{'y(t) = \\tfrac{1}{2}m(t)\\cos\\varphi'}</InlineMath>{' '}
        και τα τρία σημεία (0, π/4, π/2). Αν αντί για phase σου πει
        <em>frequency error</em>, η απάντηση γίνεται{' '}
        <InlineMath>{'\\cos(2\\pi\\Delta f\\,t)'}</InlineMath> και το σήμα
        «πάλλει» — διαφορετικό φαινόμενο, μην τα μπερδέψεις.
      </p>
    ),
  },

  'proodos26-8': {
    takeaway: (
      <p>
        Πολλαπλασιασμός στον χρόνο = συνέλιξη στη συχνότητα, και η
        συνέλιξη δύο φασμάτων εύρους <InlineMath>W</InlineMath> δίνει
        στήριγμα <InlineMath>{'2W'}</InlineMath>. Άρα{' '}
        <InlineMath>{'m^2(t)'}</InlineMath> έχει διπλάσιο εύρος από το{' '}
        <InlineMath>{'m(t)'}</InlineMath> — γενικός κανόνας για κάθε
        nonlinearity.
      </p>
    ),
    examRadar: (
      <p>
        Όποτε δεις να εμφανίζεται <InlineMath>{'m^2'}</InlineMath>,{' '}
        <InlineMath>{'m^3'}</InlineMath>, ή γινόμενο δύο σημάτων στο
        χρόνο, σκέψου «convolution στη συχνότητα» και άθροισε τα εύρη.
        Αυτό εξηγεί και γιατί ο square-law modulator χρειάζεται BPF.
      </p>
    ),
  },

  'proodos26-9': {
    takeaway: (
      <p>
        Για να σχεδιάσεις AM tone modulation, ανάλυσε το γινόμενο σε
        άθροισμα cosines/sines: <InlineMath>{'A_c\\cos\\omega_c t'}</InlineMath>{' '}
        για το carrier, και product-to-sum για κάθε sideband. Το φάσμα
        γίνεται impulses στις <InlineMath>{'\\pm f_c'}</InlineMath> και{' '}
        <InlineMath>{'\\pm f_c \\pm f_m'}</InlineMath>. Αν{' '}
        <InlineMath>{'m>1'}</InlineMath> πρέπει να σημειώσεις
        overmodulation — δεν είναι σωστή AM.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε στον χρόνο και στη συχνότητα» → δύο plots, με labels.
        Στη συχνότητα: ύψος impulse <InlineMath>{'A_c/2'}</InlineMath> για
        carrier, <InlineMath>{'A_m/4'}</InlineMath> ανά sideband (για
        single-tone). Πάντα έλεγξε αν{' '}
        <InlineMath>{'A_m \\le A_c'}</InlineMath> — αν όχι, μάρκαρε
        overmodulation, μην το αγνοήσεις.
      </p>
    ),
  },

  'proodos26-10': {
    takeaway: (
      <p>
        Ένα signal που είναι άθροισμα <em>periodic + finite-energy</em>{' '}
        έχει ισχύ ίση μόνο με του periodic όρου (τα finite-energy έχουν
        μηδενική μέση ισχύ σε άπειρο χρόνο). Για το φάσμα, ο{' '}
        <InlineMath>{'\\sin'}</InlineMath> δίνει impulses, η{' '}
        <InlineMath>{'\\mathrm{sinc}(Wt)'}</InlineMath> δίνει rect στη
        συχνότητα ύψους <InlineMath>{'1/W'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        «Φάσμα + ισχύς» για άθροισμα όρων: σπάσε σε κομμάτια, υπολόγισε
        ξεχωριστά. Sinusoids δίνουν impulses · sinc/rect/triangle έχουν
        πεπερασμένα φάσματα από Fourier pairs (στο τυπολόγιο). Για ισχύ:
        Parseval ή κατευθείαν ορισμός — συχνά η εύκολη διαδρομή είναι
        περιοδικά → <InlineMath>{'A^2/2'}</InlineMath>, finite-energy → 0.
      </p>
    ),
  },

  'proodos26-11': {
    takeaway: (
      <p>
        USSB διατηρεί <em>μόνο</em> την upper sideband — το φάσμα του
        baseband «ανυψώνεται» γύρω από <InlineMath>{'f_c'}</InlineMath>{' '}
        χωρίς να αντικατοπτρίζεται. Σχήμα: αν το baseband είναι rect
        εύρους <InlineMath>{'W/2'}</InlineMath>, η USSB είναι rect από{' '}
        <InlineMath>{'f_c'}</InlineMath> έως{' '}
        <InlineMath>{'f_c+W/2'}</InlineMath>· αν είναι sinc² (τρίγωνο στη
        συχνότητα), η USSB είναι τρίγωνο που πέφτει από{' '}
        <InlineMath>{'f_c'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        Όποτε σου ζητούν να σχεδιάσεις SSB, σκέψου «παίρνω το baseband
        spectrum, το ανεβάζω γύρω από <InlineMath>{'\\pm f_c'}</InlineMath>,
        και μετά κόβω είτε την upper είτε την lower». Πάντα να σχεδιάζεις
        και τις αρνητικές συχνότητες — το φάσμα είναι συμμετρικό.
      </p>
    ),
  },

  'proodos26-12': {
    takeaway: (
      <p>
        Για USSB FDM χωρίς overlap χρειάζεσαι (i) τα φέροντα να απέχουν
        τουλάχιστον όσο το άθροισμα των μισών ευρών, και (ii) κάθε φέρον
        να είναι αρκετά ψηλά ώστε το mirror στις αρνητικές συχνότητες να
        μην εισβάλλει στις θετικές. Στην πράξη βάζεις και guard band για
        ασφάλεια από μη-ιδανικά BPF.
      </p>
    ),
    examRadar: (
      <p>
        «Πόσο πρέπει να είναι τα φέροντα» = συνθήκη μη-επικάλυψης. Δύο
        περιορισμοί πάντα: (1) <InlineMath>{'f_2 \\ge f_1 + W_1/2'}</InlineMath>{' '}
        (διαχωρισμός μεταξύ τους), και (2)
        <InlineMath>{'f_i \\ge W_i/2'}</InlineMath> (διαχωρισμός από το 0).
      </p>
    ),
  },

  'proodos26-13': {
    takeaway: (
      <p>
        Το φάσμα ενός FDM σήματος είναι το άθροισμα των διαμορφωμένων
        φασμάτων — απλή πρόσθεση επειδή τα κανάλια δεν επικαλύπτονται.
        Στον δέκτη χρησιμοποιείς BPF για να απομονώσεις κάθε channel και
        coherent demod με το αντίστοιχο carrier. Όλα στηρίζονται στη
        συνθήκη μη-επικάλυψης (ΘΕΜΑ 12).
      </p>
    ),
    examRadar: (
      <p>
        Αν σου ζητούν «σχεδιάστε G(f) πολυπλεγμένου» → απλά κολλάς όλα τα
        διαμορφωμένα φάσματα στο ίδιο διάγραμμα (θετικές + mirrors στις
        αρνητικές). Συχνά συνεχίζει με «πώς αποπολυπλέκεται» → BPF +
        coherent demod ανά κανάλι.
      </p>
    ),
  },

  // ─── Σεπτέμβριος 2025 ────────────────────────────────────────────────

  'sept25-th1-1': {
    takeaway: (
      <p>
        Η AM εξίσωση <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos\\omega_c t'}</InlineMath>{' '}
        παράγει στο φάσμα τρία πράγματα: τον carrier στις{' '}
        <InlineMath>{'\\pm f_c'}</InlineMath>, και δύο sidebands{' '}
        <InlineMath>{'\\tfrac{1}{2}M(f \\mp f_c)'}</InlineMath>. Total
        bandwidth = <InlineMath>{'2W'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        «Εξηγήστε / περιγράψτε αρχή AM» → πάντα γράψε την εξίσωση πρώτα,
        μετά το modulation theorem, μετά εντόπισε carrier + USB + LSB στο
        διάγραμμα. Αν σου ζητούν bandwidth, η απάντηση είναι{' '}
        <InlineMath>{'2W'}</InlineMath> για conventional AM/DSB-SC,{' '}
        <InlineMath>{'W'}</InlineMath> για SSB.
      </p>
    ),
  },

  'sept25-th1-2': {
    takeaway: (
      <p>
        Τρεις υπολογισμοί που πάνε πάντα μαζί: <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>,{' '}
        <InlineMath>{'P_c = A_c^2/2'}</InlineMath>,{' '}
        <InlineMath>{'P_{AM} = P_c(1 + \\mu^2/2)'}</InlineMath>. Για{' '}
        <InlineMath>{'\\mu = 0.5'}</InlineMath> η AM προσθέτει μόλις 12.5%
        ισχύ πάνω από τον carrier — γι' αυτό η efficiency στο 0.5 είναι
        σχεδόν 11%.
      </p>
    ),
    examRadar: (
      <p>
        Όταν σου δίνουν <InlineMath>{'A_c, A_m'}</InlineMath> και ρωτάει
        «μ, ισχύς carrier, ισχύς συνολική», βγαίνει με τρεις γραμμές
        αλγεβρικά. Είναι 8–10 βαθμοί σχεδόν δωρεάν αν θυμάσαι τους
        τύπους.
      </p>
    ),
  },

  'sept25-th1-3': {
    takeaway: (
      <p>
        Πίνακας που πρέπει να ξέρεις απέξω: AM = 2W bandwidth, carrier
        υπάρχει, η ≤ 33%. DSB-SC = 2W, χωρίς carrier, η = 100%, αλλά
        χρειάζεται coherent demod. SSB = W, χωρίς carrier, η = 100%,
        coherent demod. Trade-off: η AM σπαταλά ισχύ αλλά κερδίζει σε
        απλότητα δέκτη (envelope detector).
      </p>
    ),
    examRadar: (
      <p>
        «Συγκρίνετε AM/DSB-SC/SSB» → πίνακας με τρεις γραμμές × τρεις
        στήλες (BW, carrier, η/πολυπλοκότητα δέκτη). Αν ζητάει «ποια
        είναι καλύτερη και γιατί», η απάντηση δεν είναι μία — εξαρτάται
        από το αν προτεραιότητα είναι ισχύς, BW ή απλότητα.
      </p>
    ),
  },

  'sept25-th1-4': {
    takeaway: (
      <p>
        Ο envelope detector έχει τρεις προϋποθέσεις: (1)
        <InlineMath>{'\\mu \\le 1'}</InlineMath> (αλλιώς το envelope
        αλλάζει πρόσημο), (2) RC τέτοιο ώστε{' '}
        <InlineMath>{'1/f_c \\ll RC \\ll 1/W'}</InlineMath>, (3) DC-block
        capacitor στην έξοδο για να αφαιρεθεί το <InlineMath>A_c</InlineMath>.
        Όλες κρίσιμες· αν λείπει μία, ο detector χαλάει.
      </p>
    ),
    examRadar: (
      <p>
        «Περιγράψτε envelope detector / προϋποθέσεις λειτουργίας» → ζητάει
        τρία πράγματα: σχέδιο κυκλώματος (δίοδος + RC), βήματα λειτουργίας
        (ανόρθωση → φόρτιση → εκφόρτιση), και τις τρεις συνθήκες. Δύο
        ξεχωριστά bullets για τις δύο ανισότητες της RC είναι safe.
      </p>
    ),
  },

  'sept25-th1-5': {
    takeaway: (
      <p>
        Για multi-tone message, κάθε τόνος γεννά το δικό του ζευγάρι
        sidebands στις <InlineMath>{'f_c \\pm f_i'}</InlineMath> με ύψη
        ανάλογα του πλάτους του τόνου. Το φάσμα είναι απλά η υπέρθεση όλων
        των sideband ζευγαριών — κάθε τόνος ανεξάρτητα.
      </p>
    ),
    examRadar: (
      <p>
        «AM φάσμα δύο-τόνου / multi-tone» → υπολογίζεις πρώτα τα ύψη του{' '}
        <InlineMath>{'M(f)'}</InlineMath> (impulses πλάτους{' '}
        <InlineMath>{'A_i/2'}</InlineMath>), και μετά κατεβάζεις τα μισά
        γύρω από κάθε <InlineMath>{'\\pm f_c'}</InlineMath>. Bandwidth =
        2 × (μέγιστη <InlineMath>{'f_m'}</InlineMath>).
      </p>
    ),
  },

  'sept25-th2-6': {
    takeaway: (
      <p>
        Στην FM η πληροφορία ζει στη <em>στιγμιαία συχνότητα</em>{' '}
        <InlineMath>{'f(t) = f_c + K_f m(t)'}</InlineMath>, και η φάση
        είναι το ολοκλήρωμα αυτής. Το envelope μένει σταθερό{' '}
        <InlineMath>{'V = A_c'}</InlineMath> — αυτό είναι ο λόγος που η FM
        ανέχεται τον amplitude θόρυβο.
      </p>
    ),
    examRadar: (
      <p>
        «Αρχή λειτουργίας FM + ορισμός β» → χρειάζεται να γράψεις τρία
        πράγματα: τον τύπο της στιγμιαίας συχνότητας, τη γενική εξίσωση{' '}
        <InlineMath>{'x_{FM}'}</InlineMath> με ολοκλήρωμα, και τον ορισμό{' '}
        <InlineMath>{'\\beta = \\Delta f / W'}</InlineMath>. Συχνά έρχεται
        σε δίδυμο με «γιατί η FM είναι ανθεκτική στον θόρυβο» — η απάντηση
        είναι «σταθερό envelope + limiter».
      </p>
    ),
  },

  'sept25-th2-7': {
    takeaway: (
      <p>
        FM gain πάνω από AM ≈ <InlineMath>{'9\\beta^2'}</InlineMath>{' '}
        (για εμπορικό FM <InlineMath>{'\\beta=5'}</InlineMath> →{' '}
        225× ή 23.5 dB). Trade-off: η FM «αγοράζει» SNR με bandwidth (Carson
        2(β+1)W vs AM 2W). Όλη η ισχύς της FM είναι ωφέλιμη — δεν υπάρχει
        carrier σπατάλη.
      </p>
    ),
    examRadar: (
      <p>
        «Σύγκριση FM vs AM» → πίνακας με 5 παραμέτρους: θόρυβος, output SNR,
        bandwidth, ισχύς, πολυπλοκότητα. Το βασικό στοιχείο που πρέπει να
        αναφέρεις πάντα: <em>«FM ανταλλάσσει bandwidth για SNR»</em>.
      </p>
    ),
  },

  'sept25-th2-8': {
    takeaway: (
      <p>
        Δύο γραμμές αρκούν:{' '}
        <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath> και Carson{' '}
        <InlineMath>{'B = 2(\\beta + 1) f_m'}</InlineMath>. Αν{' '}
        <InlineMath>{'\\beta \\ge 1'}</InlineMath> έχεις WBFM· αν{' '}
        <InlineMath>{'\\beta \\ll 1'}</InlineMath>, NBFM. Ο τύπος του
        Carson είναι στο τυπολόγιο, αλλά πρέπει να ξέρεις πότε εφαρμόζεται.
      </p>
    ),
    examRadar: (
      <p>
        «Δίνεται <InlineMath>{'\\Delta f, f_m'}</InlineMath>, βρες β + Carson»
        → 4-γραμμη απάντηση. Πρόσεξε τις μονάδες: αν δίνει το BW του
        message ως <InlineMath>W</InlineMath> (όχι ένας τόνος), στο Carson
        βάζεις <InlineMath>W</InlineMath> αντί για <InlineMath>{'f_m'}</InlineMath>.
      </p>
    ),
  },

  'sept25-th2-9': {
    takeaway: (
      <p>
        Για single-tone FM, η Bessel ανάπτυξη είναι{' '}
        <InlineMath>{'A_c\\sum_n J_n(\\beta)\\cos[2\\pi(f_c + n f_m)t]'}</InlineMath>{' '}
        — άπειρες sidebands στις <InlineMath>{'\\pm n f_m'}</InlineMath>{' '}
        γύρω από <InlineMath>{'f_c'}</InlineMath>. Πλάτη{' '}
        <InlineMath>{'A_c |J_n(\\beta)|'}</InlineMath> από τον πίνακα
        Bessel του τυπολογίου. Σε ρίζες όπως{' '}
        <InlineMath>{'\\beta = 2.405'}</InlineMath>, ο carrier σχεδόν
        εξαφανίζεται.
      </p>
    ),
    examRadar: (
      <p>
        Όποτε δεις «Bessel» ή «sidebands FM με συγκεκριμένο β», η συνταγή
        είναι: (1) γράψε τη Bessel σειρά, (2) διάβασε{' '}
        <InlineMath>{'J_0, J_1, J_2, J_3'}</InlineMath> από τον πίνακα,
        (3) Carson για bandwidth. Αν το β είναι κοντά σε ρίζα του{' '}
        <InlineMath>{'J_0'}</InlineMath> (2.405, 5.520, 8.654), αναμένεται
        ερώτηση «πότε εξαφανίζεται ο carrier».
      </p>
    ),
  },

  'sept25-th3-10': {
    takeaway: (
      <p>
        Ο θερμικός θόρυβος είναι <strong>λευκός</strong>: η PSD του είναι ένα{' '}
        <strong>επίπεδο πάτωμα</strong> στο{' '}
        <InlineMath>{'N_0/2 = kT/2'}</InlineMath> (δίψας όψεως· μονόπλευρα{' '}
        <InlineMath>{'N_0 = kT'}</InlineMath>) — εξαρτάται από τη θερμοκρασία{' '}
        <InlineMath>T</InlineMath> αλλά <em>όχι</em> από το εύρος ζώνης. Αυτό που
        εξαρτάται από τη ζώνη είναι η <strong>ισχύς</strong>: ολοκλήρωσε το πάτωμα
        σε ζώνη <InlineMath>B</InlineMath> και παίρνεις{' '}
        <InlineMath>{'P_N = kTB = N_0 B'}</InlineMath> (ύψος{' '}
        <InlineMath>{'N_0/2'}</InlineMath> × συνολικό πλάτος{' '}
        <InlineMath>{'2B'}</InlineMath> → το <InlineMath>{'\\tfrac{1}{2}'}</InlineMath>{' '}
        και το <InlineMath>2</InlineMath> ακυρώνονται). Αναγνώριση: «PSD θερμικού»
        → <InlineMath>{'kT/2'}</InlineMath>· «ισχύς σε ζώνη B» →{' '}
        <InlineMath>{'kTB'}</InlineMath>. Κράτα στη μνήμη το room-temp πάτωμα{' '}
        <strong>−174 dBm/Hz</strong> (= μονόπλευρο <InlineMath>{'kT'}</InlineMath>)
        και τον κανόνα <InlineMath>{'P_N[\\text{dBm}] = -174 + 10\\log_{10} B'}</InlineMath>:
        κάθε διπλασιασμός του <InlineMath>B</InlineMath> →{' '}
        <InlineMath>{'+3'}</InlineMath> dB. Το ίδιο <InlineMath>{'kTB'}</InlineMath>{' '}
        είναι ο παρονομαστής κάθε SNR.
      </p>
    ),
    examRadar: (
      <>
        <p>
          «PSD θερμικού θορύβου» / «πώς εξαρτάται από <InlineMath>B</InlineMath>{' '}
          και <InlineMath>T</InlineMath>» → απάντηση δύο γραμμών: PSD ={' '}
          <InlineMath>{'N_0/2 = kT/2'}</InlineMath> (επίπεδη, ανεξάρτητη του{' '}
          <InlineMath>B</InlineMath>)· ισχύς σε ζώνη <InlineMath>B</InlineMath> ={' '}
          <InlineMath>{'kTB = N_0 B'}</InlineMath>. Αν δίνεται{' '}
          <InlineMath>T</InlineMath>, βάλε{' '}
          <InlineMath>{'k = 1.38\\times 10^{-23}'}</InlineMath> J/K και{' '}
          <InlineMath>{'T_0 = 290'}</InlineMath> K. Χρόνος-στόχος:{' '}
          <strong>~2 λεπτά</strong> — σχεδόν δωρεάν μονάδες.
        </p>
        <div className="my-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Η παγίδα — one-sided vs two-sided (παράγοντας 2).</strong>{' '}
          Τρία πράγματα που μπερδεύονται εδώ:
          <ul className="ml-4 mt-1 list-disc space-y-1">
            <li>
              Η <strong>PSD</strong> είναι ανεξάρτητη του{' '}
              <InlineMath>B</InlineMath>, αλλά η <strong>ισχύς</strong> είναι
              ανάλογη του <InlineMath>B</InlineMath> (<InlineMath>{'P_N = kTB'}</InlineMath>).
              Μην πεις «η ισχύς δεν αλλάζει με τη ζώνη» — αλλάζει{' '}
              <em>γραμμικά</em>.
            </li>
            <li>
              Δίψας όψεως ύψος <InlineMath>{'N_0/2 = kT/2'}</InlineMath> με πλάτος{' '}
              <InlineMath>{'2B'}</InlineMath>, <em>ή</em> μονόπλευρο{' '}
              <InlineMath>{'N_0 = kT'}</InlineMath> με πλάτος{' '}
              <InlineMath>B</InlineMath> — και τα δύο δίνουν{' '}
              <InlineMath>{'kTB'}</InlineMath>. Μην ανακατεύεις τα ζευγάρια:{' '}
              <InlineMath>{'(N_0/2)\\cdot B'}</InlineMath> δίνει λάθος{' '}
              <InlineMath>{'N_0 B/2'}</InlineMath>·{' '}
              <InlineMath>{'N_0 \\cdot 2B'}</InlineMath> δίνει λάθος{' '}
              <InlineMath>{'2N_0 B'}</InlineMath>.
            </li>
            <li>
              Το <InlineMath>{'-174'}</InlineMath> dBm/Hz είναι το{' '}
              <strong>μονόπλευρο</strong> <InlineMath>{'kT'}</InlineMath> (={' '}
              <InlineMath>{'4\\times 10^{-21}'}</InlineMath> W/Hz). Το
              δίψας-όψεως <InlineMath>{'kT/2'}</InlineMath> δίνει{' '}
              <InlineMath>{'-177'}</InlineMath> dBm/Hz —{' '}
              <InlineMath>{'3'}</InlineMath> dB πιο κάτω. Για τον noise floor
              χρησιμοποίησε <InlineMath>{'-174 \\,(+\\,10\\log_{10} B + F)'}</InlineMath>.
            </li>
          </ul>
        </div>
      </>
    ),
  },

  'sept25-th3-11': {
    takeaway: (
      <p>
        <strong>
          Θόρυβος μέσα από οποιοδήποτε LTI — μία συνταγή δύο βημάτων:
        </strong>{' '}
        πρώτα <InlineMath>{'S_Y(f) = |H(f)|^2 S_X(f)'}</InlineMath>, μετά
        ολοκλήρωσε, <InlineMath>{'P_Y = \\int S_Y(f)\\,df'}</InlineMath>. Για{' '}
        <em>ιδανικό</em> φίλτρο το <InlineMath>{'|H|^2'}</InlineMath> είναι 0 ή
        1, οπότε το ολοκλήρωμα εκφυλίζεται σε καθαρό{' '}
        <strong>εμβαδόν εντός ζώνης</strong> = ύψος × συνολικό πλάτος. Με ύψος{' '}
        <InlineMath>{'N_0/2'}</InlineMath> και ιδανικό LPF εύρους{' '}
        <InlineMath>B</InlineMath> (η ζώνη <InlineMath>{'[-B, B]'}</InlineMath>{' '}
        έχει πλάτος <InlineMath>{'2B'}</InlineMath>) βγαίνει{' '}
        <InlineMath>{'P_Y = N_0 B'}</InlineMath>. Όταν δεις «επίπεδος θόρυβος
        μέσα από ιδανικό φίλτρο», μην ολοκληρώνεις τυφλά — μέτρα{' '}
        <strong>όλο</strong> το πλάτος που περνάει (θετικές <em>και</em>{' '}
        αρνητικές συχνότητες) και πολλαπλασίασε με{' '}
        <InlineMath>{'N_0/2'}</InlineMath>. Το ίδιο{' '}
        <InlineMath>{'N_0 B'}</InlineMath> θα το ξαναδείς ως τον παρονομαστή
        κάθε SNR.
      </p>
    ),
    examRadar: (
      <>
        <p>
          «Λευκός θόρυβος» + «ιδανικό φίλτρο» + «ισχύς εξόδου» → απάντηση μιας
          γραμμής: <InlineMath>{'P_Y = (N_0/2)\\int |H(f)|^2\\,df'}</InlineMath>{' '}
          = ύψος × συνολικό πλάτος ζώνης. Ιδανικό LPF εύρους{' '}
          <InlineMath>B</InlineMath> → ζώνη <InlineMath>{'[-B, B]'}</InlineMath>{' '}
          πλάτους <InlineMath>{'2B'}</InlineMath> →{' '}
          <InlineMath>{'P_Y = N_0 B'}</InlineMath>. Χρόνος-στόχος:{' '}
          <strong>~2 λεπτά</strong> — σχεδόν δωρεάν μονάδες, μην ξοδέψεις
          παραπάνω.
        </p>
        <div className="my-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <strong>⚠️ Η παγίδα — one-sided vs two-sided (παράγοντας 2).</strong>{' '}
          Με τη δίψας όψεως (two-sided) σύμβαση{' '}
          <InlineMath>{'S_X = N_0/2'}</InlineMath> ολοκληρώνεις σε <em>όλη</em> τη
          ζώνη <InlineMath>{'[-B, B]'}</InlineMath> (πλάτος{' '}
          <InlineMath>{'2B'}</InlineMath>): το{' '}
          <InlineMath>{'\\tfrac{1}{2}'}</InlineMath> και το{' '}
          <InlineMath>2</InlineMath> ακυρώνονται →{' '}
          <InlineMath>{'N_0 B'}</InlineMath>. Τα δύο κλασικά λάθη παράγοντα 2:{' '}
          <InlineMath>{'(N_0/2)\\times B'}</InlineMath> (ξεχνάς τις αρνητικές
          συχνότητες) δίνει λανθασμένα <InlineMath>{'N_0 B/2'}</InlineMath>, ενώ{' '}
          <InlineMath>{'N_0 \\times 2B'}</InlineMath> (μονόπλευρο ύψος επί διπλό
          πλάτος) δίνει <InlineMath>{'2 N_0 B'}</InlineMath>. Κράτα{' '}
          <strong>ένα</strong> ζευγάρι σταθερό: two-sided{' '}
          <InlineMath>{'N_0/2'}</InlineMath> με πλάτος{' '}
          <InlineMath>{'2B'}</InlineMath>, <em>ή</em> one-sided{' '}
          <InlineMath>{'N_0'}</InlineMath> με πλάτος <InlineMath>B</InlineMath>.
          Και προσοχή: το «<InlineMath>{'N_0 \\times'}</InlineMath> εύρος» ισχύει
          μόνο για <em>ιδανικά</em> φίλτρα — σε RC LPF το ολοκλήρωμα δίνει{' '}
          <InlineMath>{'\\pi N_0 f_c/2'}</InlineMath>. Και αν το φίλτρο είναι HPF
          χωρίς πάνω cutoff, η ισχύς <em>αποκλίνει</em> (άπειρο) — μη φυσικό,
          ανάφερέ το.
        </div>
      </>
    ),
  },

  // ─── Ιανουάριος 2026 (Επί Πτυχίω) ────────────────────────────────────

  'jan26-th1-1': {
    takeaway: (
      <p>
        Η μορφή <InlineMath>{'[A_c\\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        είναι DSB-SC (carrier πολλαπλασιάζεται με το message).
        Conventional AM είναι{' '}
        <InlineMath>{'[A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath> —
        carrier προστίθεται. Η διαφορά «πολλαπλασιάζεται vs προστίθεται»
        είναι ολόκληρο σχήμα διαμόρφωσης.
      </p>
    ),
    examRadar: (
      <p>
        Σ/Λ που σου δείχνει εξίσωση AM → πρώτα ταυτοποίησε τι είναι:
        παρένθεση <em>μέσα</em> στο cos = συμβατικό AM· γινόμενο σκέτο =
        DSB-SC· διαφορά cos·cos − sin·sin = SSB. Μην πέσεις στην παγίδα.
      </p>
    ),
  },

  'jan26-th1-2': {
    takeaway: (
      <p>
        Κάθε μη-μηδενικό περιοδικό σήμα έχει άπειρη ενέργεια αλλά
        πεπερασμένη μέση ισχύ — άρα είναι σήμα ισχύος. Για cosine πλάτους{' '}
        <InlineMath>A</InlineMath>, η ισχύς είναι πάντα{' '}
        <InlineMath>{'A^2/2'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        «X είναι σήμα ισχύος / ενέργειας;» → energy signals έχουν
        πεπερασμένη <InlineMath>{'\\int |x|^2 dt'}</InlineMath> (σήματα
        που σβήνουν). Power signals έχουν πεπερασμένη μέση ισχύ
        (περιοδικά, σταθερά). Cos/sin/περιοδικό = πάντα power signal.
      </p>
    ),
  },

  'jan26-th1-3': {
    takeaway: (
      <p>
        «Λευκός» = επίπεδη PSD (σχήμα στη συχνότητα). «Gaussian» = κατανομή
        πλάτους στο χρόνο. Είναι ξεχωριστές ιδιότητες — ένα σήμα μπορεί να
        είναι λευκό χωρίς να είναι Gaussian και αντίστροφα. Ο AWGN είναι
        και τα δύο μαζί.
      </p>
    ),
    examRadar: (
      <p>
        Από τις πιο κλασικές εξεταστικές παγίδες σε Σ/Λ. Αν δεις
        «λευκός θόρυβος = Gaussian», η απάντηση είναι ΛΑΘΟΣ — εξήγησε
        ότι το ένα αναφέρεται στη φασματική, το άλλο στη στατιστική
        κατανομή.
      </p>
    ),
  },

  'jan26-th1-4': {
    takeaway: (
      <p>
        Αντίστροφη σχέση χρόνος ↔ συχνότητα: στενότερος παλμός →
        πλατύτερο φάσμα. Για περιοδικό Π-παλμό, η περιβάλλουσα του
        φάσματος είναι sinc με πρώτη ρίζα στο{' '}
        <InlineMath>{'1/\\tau'}</InlineMath>. Διπλασίασε το{' '}
        <InlineMath>{'\\tau'}</InlineMath> → υποδιπλασιάζεις την πρώτη ρίζα.
      </p>
    ),
    examRadar: (
      <p>
        «Στενός vs πλατύς παλμός» → πάντα να σκέφτεσαι την αντίστροφη
        σχέση. Αν στην εκφώνηση συγκρίνει δύο διάρκειες παλμών, η σωστή
        απάντηση εμπεριέχει «sinc envelope, ρίζα στο{' '}
        <InlineMath>{'1/\\tau'}</InlineMath>».
      </p>
    ),
  },

  'jan26-th1-5': {
    takeaway: (
      <p>
        Όρια για NBFM/WBFM: <InlineMath>{'\\beta < 0.3'}</InlineMath>{' '}
        (NBFM, σχεδόν AM-like, BW = 2W), <InlineMath>{'\\beta \\gg 1'}</InlineMath>{' '}
        (WBFM, πολλές sidebands, BW μεγαλύτερο). Στο boundary{' '}
        <InlineMath>{'\\beta \\sim 1'}</InlineMath> δεν είναι αυστηρό.
      </p>
    ),
    examRadar: (
      <p>
        Σ/Λ για το αν συγκεκριμένο β είναι NBFM ή WBFM → απλός κανόνας:{' '}
        <InlineMath>{'\\beta < 0.3'}</InlineMath> NBFM, αλλιώς WBFM. Στις
        παγίδες δίνουν β = 0.3, 0.5, ή 1 και ζητάνε ταξινόμηση.
      </p>
    ),
  },

  'jan26-th2-6': {
    takeaway: (
      <p>
        Πέντε λόγοι για διαμόρφωση: μέγεθος κεραίας (λ/4 πρακτικό μόνο
        στα MHz/GHz), multiplexing, αποδοτική χρήση φάσματος, ανοσία
        θορύβου, και νομοθετικά πλαίσια. Αν αναφέρεις τους τρεις πρώτους
        έχεις ικανοποιητική απάντηση.
      </p>
    ),
    examRadar: (
      <p>
        «Γιατί διαμορφώνουμε» → πάντα bullets. Το πιο «βαρύ» επιχείρημα
        είναι το μέγεθος της κεραίας (<InlineMath>{'\\lambda/4'}</InlineMath>{' '}
        σε baseband = km, σε MHz = εκατοστά). Multiplexing είναι ο
        δεύτερος βαρύς λόγος.
      </p>
    ),
  },

  'jan26-th2-7': {
    takeaway: (
      <p>
        Όταν <InlineMath>{'\\mu > 1'}</InlineMath> έχεις overmodulation
        και το envelope αλλάζει πρόσημο — πάντα σχεδίασε με phase reversal
        στις στιγμές που η περιβάλλουσα γίνεται αρνητική. Στο φάσμα η AM
        παραμένει «κανονική» (carrier + 2 sidebands), η παραμόρφωση είναι
        μόνο στον envelope detector.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε x(t) και X(f) AM» με <InlineMath>{'A_m > A_c'}</InlineMath>{' '}
        → πρέπει να υπογραμμίσεις overmodulation. Στην πράξη η εξέταση
        συχνά διαλέγει νούμερα όπου <InlineMath>{'\\mu = 2'}</InlineMath>{' '}
        ή <InlineMath>{'\\mu = 0.5'}</InlineMath> για να ελέγξει αν
        αναγνωρίζεις τη διαφορά.
      </p>
    ),
  },

  'jan26-th2-8': {
    takeaway: (
      <p>
        DSB-SC είναι απλά το modulation theorem χωρίς carrier:{' '}
        <InlineMath>{'X(f) = \\tfrac{1}{2}[M(f-f_c) + M(f+f_c)]'}</InlineMath>.
        Αν το <InlineMath>{'M(f)'}</InlineMath> είναι rect, παίρνεις δύο
        rects στις <InlineMath>{'\\pm f_c'}</InlineMath> με το μισό ύψος.
        Δεν υπάρχει impulse στον carrier — αυτό είναι το «suppressed».
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε φάσμα DSB-SC» → δύο μόνο πράγματα: (1) τι είναι το{' '}
        <InlineMath>{'M(f)'}</InlineMath>, (2) ανέβασέ το γύρω από{' '}
        <InlineMath>{'\\pm f_c'}</InlineMath> με ύψος μισό. Αν δεν δεις
        impulse στον carrier σου, καλά πας — είναι DSB-SC.
      </p>
    ),
  },

  'jan26-th2-9': {
    takeaway: (
      <p>
        Άθροισμα sinusoids με <em>διαφορετικές</em> συχνότητες:
        η ισχύς είναι το άθροισμα των επιμέρους ισχύων (no cross-terms).
        Κάθε όρος συνεισφέρει <InlineMath>{'\\text{amp}^2/2'}</InlineMath>.
        Αυτό είναι Parseval σε εφαρμογή.
      </p>
    ),
    examRadar: (
      <p>
        «Ισχύς αθροίσματος sinusoids» → αμέσως{' '}
        <InlineMath>{'\\sum A_i^2/2'}</InlineMath> εφόσον οι συχνότητες
        διαφέρουν. Αν δύο όροι έχουν ίδια συχνότητα, εκεί χρειάζεσαι
        cross-term — γράψε τους ως ένα cosine με συνολικό amplitude.
      </p>
    ),
  },

  'jan26-th2-10': {
    takeaway: (
      <p>
        Για κάθε <InlineMath>{'A\\cos(2\\pi f_0 t + \\phi)'}</InlineMath>:
        impulses ύψους <InlineMath>{'A/2'}</InlineMath> στις{' '}
        <InlineMath>{'\\pm f_0'}</InlineMath>. Για sin το ίδιο αλλά με
        φάσεις <InlineMath>{'\\mp \\pi/2'}</InlineMath> — το φάσμα{' '}
        <em>πλάτους</em> έχει το ίδιο ύψος, οι φάσεις διαφέρουν.
      </p>
    ),
    examRadar: (
      <p>
        Όταν σου ζητούν «φάσμα πλάτους», παίρνεις μέτρο και αγνοείς
        φάσεις. Αν ζητάει «φάσμα», συχνά χρειάζεται και τα δύο — ξεχώρισέ
        τα ρητά. Για cos: φάσεις <InlineMath>{'\\pm\\phi'}</InlineMath>·
        για sin: φάσεις <InlineMath>{'\\pm(\\phi - \\pi/2)'}</InlineMath>.
      </p>
    ),
  },

  'jan26-th3-mux': {
    takeaway: (
      <p>
        USSB FDM δύο σημάτων: (1) υπολόγισε το BW κάθε baseband (sinc έχει
        BW στη ρίζα του sinc, sinc² διπλάσιο), (2) τοποθέτησε κάθε USSB
        γύρω από το αντίστοιχο carrier, (3) ελέγξε non-overlap. Στον
        receiver, BPF + coherent demod ανά κανάλι.
      </p>
    ),
    examRadar: (
      <p>
        Σύνθετο πρόβλημα FDM (πολλά σημεία, μεγάλο βάρος ~20%) →
        διαχώρισέ το σε στάδια: bandwidth analysis → modulation per
        channel → multiplex spectrum → demod chain. Σχέδια στο φάσμα
        φέρνουν εύκολους βαθμούς — μην παραλείψεις τα mirrors στις
        αρνητικές συχνότητες.
      </p>
    ),
  },

  'jan26-th4-fm': {
    takeaway: (
      <p>
        Πλήρες FM problem: συγκρίνεις με{' '}
        <InlineMath>{'A_c\\cos[2\\pi f_c t + \\beta\\sin(2\\pi f_m t)]'}</InlineMath>{' '}
        για να διαβάσεις απευθείας <InlineMath>{'A_c, f_c, f_m, \\beta'}</InlineMath>.
        Carson <InlineMath>{'B = 2(\\beta+1)f_m'}</InlineMath>. Bessel
        sidebands από πίνακα. Ισχύς carrier ={' '}
        <InlineMath>{'A_c^2 J_0^2(\\beta)/2'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        Ολόκληρο τέταρτο θέμα στην εξέταση (~30%) → ο τύπος FM single-tone
        + Carson + Bessel + power είναι η συνταγή. Ξέρε τις τιμές
        Bessel για β=1, 2, 3, 5 από τον πίνακα. Το «ποσοστό ισχύος στον
        carrier» = <InlineMath>{'J_0^2(\\beta)'}</InlineMath> πάντα.
      </p>
    ),
  },

  // ─── Ιούνιος 2025 ─────────────────────────────────────────────────────

  'jun25-th1-1': {
    takeaway: (
      <p>
        Σειρά συχνοτήτων: AM ραδιόφωνο (~MHz) → FM ραδιόφωνο (~100 MHz)
        → TV (VHF/UHF, 50–800 MHz) → δορυφορικά (GHz). Λόγος: low freq =
        μεγάλη εμβέλεια αλλά λίγο BW· high freq = στενές κεραίες, μεγάλο
        BW, αλλά line-of-sight.
      </p>
    ),
    examRadar: (
      <p>
        Διαισθητική ερώτηση χωρίς αλγεβρική λύση. Αρκούν τάξεις μεγέθους
        + μία πρόταση «γιατί» (trade-off range vs bandwidth). Συχνά πέφτει
        σαν εισαγωγική ερώτηση μικρού βάρους.
      </p>
    ),
  },

  'jun25-th1-2': {
    takeaway: (
      <p>
        Το κανάλι επηρεάζει: πλάτος (απόσβεση), φάση (group delay),
        spectrum (filtering), θόρυβο (AWGN), και fading (wireless).
        Αν αναφέρεις τα 3 πρώτα + AWGN έχεις πλήρη απάντηση.
      </p>
    ),
    examRadar: (
      <p>
        Θεωρητική ερώτηση εισαγωγής. Bullets με 4–5 χαρακτηριστικά,
        μία γραμμή ανά bullet. Δεν χρειάζεται αλγεβρική λύση — απλά
        να αναφέρεις τα κύρια συμπτώματα του καναλιού.
      </p>
    ),
  },

  'jun25-th1-3': {
    takeaway: (
      <p>
        Η <InlineMath>{'\\delta(t-T_1)'}</InlineMath> έχει επίπεδο φάσμα
        πλάτους <InlineMath>{'|G(f)| = 1'}</InlineMath> — άπειρες
        συνιστώσες με ίδιο πλάτος. Το time shift{' '}
        <InlineMath>{'T_1'}</InlineMath> εμφανίζεται μόνο ως φάση{' '}
        <InlineMath>{'-2\\pi f T_1'}</InlineMath>, όχι ως πλάτος.
      </p>
    ),
    examRadar: (
      <p>
        «Πόσες φασματικές συνιστώσες έχει η δ(t)» → απάντηση «άπειρες,
        όλες με ίδιο πλάτος». Αν είναι μετατοπισμένη{' '}
        <InlineMath>{'\\delta(t-T)'}</InlineMath>, το πλάτος μένει 1, η
        φάση γίνεται γραμμική <InlineMath>{'-2\\pi f T'}</InlineMath>.
      </p>
    ),
  },

  'jun25-th1-4': {
    takeaway: (
      <p>
        Για <InlineMath>{'A\\cos(2\\pi f_0 t + \\phi)'}</InlineMath>: φάσμα
        πλάτους = δύο impulses ύψους <InlineMath>{'A/2'}</InlineMath> στις{' '}
        <InlineMath>{'\\pm f_0'}</InlineMath>· φάσμα φάσης ={' '}
        <InlineMath>{'+\\phi'}</InlineMath> στο <InlineMath>{'+f_0'}</InlineMath>,{' '}
        <InlineMath>{'-\\phi'}</InlineMath> στο <InlineMath>{'-f_0'}</InlineMath>.
        Η φάση είναι περιττή για κάθε πραγματικό σήμα.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε φάσμα πλάτους και φάσης ενός cosine» → δύο διαγράμματα.
        Στο δεύτερο μην ξεχάσεις την αντίθετη φάση στις αρνητικές
        συχνότητες (περιττή συμμετρία). Αν είναι sin αντί για cos, η
        φάση είναι <InlineMath>{'\\pm(\\phi - \\pi/2)'}</InlineMath>.
      </p>
    ),
  },

  'jun25-th1-5': {
    takeaway: (
      <p>
        Περιοδικός Π-παλμός με περίοδο <InlineMath>T</InlineMath> και
        διάρκεια <InlineMath>{'\\tau'}</InlineMath>: φάσμα discrete
        impulses στις <InlineMath>{'k/T'}</InlineMath>, με συντελεστές{' '}
        <InlineMath>{'a_k = (\\tau/T)\\,\\mathrm{sinc}(k\\tau/T)'}</InlineMath>.
        Η περιβάλλουσα είναι sinc με πρώτη ρίζα στα{' '}
        <InlineMath>{'1/\\tau'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε χρόνο + φάσμα περιοδικού παλμού» → δύο plots. Στο
        χρόνο: παλμοί ύψους 1, διάρκειας τ, κάθε T. Στη συχνότητα: lines
        στις <InlineMath>{'k/T'}</InlineMath> με ύψη του sinc envelope.
        DC = duty cycle <InlineMath>{'\\tau/T'}</InlineMath>.
      </p>
    ),
  },

  'jun25-th1-6': {
    takeaway: (
      <p>
        Όταν αυξάνεις το <InlineMath>{'\\tau'}</InlineMath> κρατώντας το{' '}
        <InlineMath>T</InlineMath> σταθερό: (1) DC αυξάνεται γραμμικά
        με το duty cycle, (2) η πρώτη ρίζα του sinc envelope μειώνεται
        στα <InlineMath>{'1/\\tau'}</InlineMath> — το spectrum «στενεύει».
        Αντίστροφη σχέση χρόνος ↔ συχνότητα.
      </p>
    ),
    examRadar: (
      <p>
        Follow-up ερωτήσεις τύπου «τι αλλάζει αν διπλασιαστεί το τ» →
        αναμένεται απάντηση με δύο ποιοτικές αλλαγές: αύξηση DC, στένεμα
        envelope. Δεν χρειάζεται πλήρης επανυπολογισμός — αρκεί
        μετατόπιση ριζών.
      </p>
    ),
  },

  'jun25-th1-7': {
    takeaway: (
      <p>
        Άθροισμα cosines αρμονικά συναρμολογημένο →{' '}
        <em>discrete</em> Fourier series. Κάθε όρος{' '}
        <InlineMath>{'A_k\\cos(2\\pi k f_c t + \\phi_k)'}</InlineMath>{' '}
        γίνεται impulses ύψους <InlineMath>{'A_k/2'}</InlineMath> στις{' '}
        <InlineMath>{'\\pm k f_c'}</InlineMath>, με φάσεις{' '}
        <InlineMath>{'\\pm\\phi_k'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        «Σχεδιάστε φάσματα πλάτους + φάσης sum of harmonics» → δύο stem
        plots. Πάντα και τα δύο διαγράμματα — άμα ξεχάσεις τη φάση χάνεις
        τη μισή ερώτηση.
      </p>
    ),
  },

  'jun25-th1-8': {
    takeaway: (
      <p>
        Για να αναπαριστά ένα Fourier series περιοδικό Π-παλμό, οι
        συντελεστές πρέπει να είναι <InlineMath>{'A_k \\propto \\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>.
        Αυτό είναι το «σχήμα» που πρέπει να αναγνωρίζεις σε FS — sinc
        envelope = πίσω από αυτό κρύβεται Π-παλμός.
      </p>
    ),
    examRadar: (
      <p>
        «Πώς πρέπει να ισούνται οι συντελεστές για να βγαίνει Π-παλμός»
        → η απάντηση είναι πάντα <InlineMath>{'\\mathrm{sinc}(k f_0 \\tau)'}</InlineMath>.
        Σαν εφαρμογή του Fourier pair{' '}
        <InlineMath>{'\\Pi \\leftrightarrow \\mathrm{sinc}'}</InlineMath>.
      </p>
    ),
  },

  'jun25-th1-9': {
    takeaway: (
      <p>
        Θερμικός θόρυβος: <InlineMath>{'S_N(f) = N_0/2 = kT/2'}</InlineMath>{' '}
        W/Hz, σταθερή PSD (διπλής όψεως). Είναι από τους τύπους που πρέπει
        να ξέρεις απέξω — είναι μονόλεκτη απάντηση όταν την ζητάει.
      </p>
    ),
    examRadar: (
      <p>
        Σύντομη ερώτηση γνώσης. Απάντηση μία γραμμή — ο τύπος. Αν θέλει
        αριθμό σε room temp: −174 dBm/Hz. Δεν εξαρτάται από το BW —
        αυτή η ερώτηση πρέπει να απαντηθεί σε λιγότερο από 30 δευτερόλεπτα.
      </p>
    ),
  },

  'jun25-th1-10': {
    takeaway: (
      <p>
        Για κάθε φίλτρο: PSD εξόδου ={' '}
        <InlineMath>{'|H(f)|^2 \\cdot N_0/2'}</InlineMath>, ισχύς =
        ολοκλήρωμα. LPF δίνει σχήμα sinc στην autocorrelation. HPF χωρίς
        upper cutoff δίνει άπειρη ισχύ — αναγνώρισέ το ως μη-φυσικό.
      </p>
    ),
    examRadar: (
      <p>
        «Λευκός θόρυβος μέσω LPF + HPF» → δύο σκέλη. LPF ισχύς ={' '}
        <InlineMath>{'N_0 W'}</InlineMath>, autocorrelation ={' '}
        <InlineMath>{'N_0 W \\mathrm{sinc}(2W\\tau)'}</InlineMath>. HPF:
        αναφέρε ότι η ισχύς δεν είναι πεπερασμένη χωρίς upper bound.
      </p>
    ),
  },

  'jun25-th2': {
    takeaway: (
      <p>
        DSB-SC + DSB συμβατικό σε FDM: το πρώτο χρειάζεται coherent demod,
        το δεύτερο μπορεί να αποδιαμορφωθεί με envelope detector + BPF
        (αρκεί <InlineMath>{'\\mu \\le 1'}</InlineMath>). Ο ολοκληρωμένος
        δέκτης: BPF γύρω από το συγκεκριμένο carrier → envelope detector
        → DC blocker.
      </p>
    ),
    examRadar: (
      <p>
        Μεγάλο πρόβλημα 25% με 6 σκέλη → απάντησέ τα ένα-ένα. Το «ποιο
        μπορεί να αποδιαμορφωθεί χωρίς coherent» είναι σχεδόν πάντα μέρος
        της εκφώνησης σε mixed DSB-SC + AM problems — η απάντηση «μόνο το
        AM με carrier» είναι κρίσιμη.
      </p>
    ),
  },

  'jun25-th3-fm': {
    takeaway: (
      <p>
        Πλήρες FM problem με αλλαγή BW: από{' '}
        <InlineMath>{'\\beta = K_f A_m / f_m'}</InlineMath>, αν το{' '}
        <InlineMath>{'K_f, f_m'}</InlineMath> μένουν σταθερά, η μόνη
        διαθέσιμη μεταβλητή είναι το <InlineMath>{'A_m'}</InlineMath>.
        Μειώνεις το πλάτος → μειώνεις το β → μειώνεις το BW. Το ποσοστό
        ισχύος που περνάει από στενό BPF προκύπτει από{' '}
        <InlineMath>{'\\sum J_n^2(\\beta)'}</InlineMath> πάνω στις
        αρμονικές που χωράνε.
      </p>
    ),
    examRadar: (
      <p>
        Μεγάλο πρόβλημα FM με πολλά σκέλη: ξεκίνα από{' '}
        <InlineMath>{'\\Delta f, \\beta, \\text{Carson}'}</InlineMath>.
        Αν ζητάει «πόσες αρμονικές περνούν από BPF εύρους B» → αρμονικές
        με <InlineMath>{'|n| \\le B/(2 f_m)'}</InlineMath>. «Ποσοστό
        ισχύος» = <InlineMath>{'\\sum_{|n|\\le N} J_n^2(\\beta)'}</InlineMath>.
      </p>
    ),
  },

  // ─── Πρόοδος A · Μάιος 2025 ──────────────────────────────────────────

  'pa25-th1-1': {
    takeaway: (
      <p>
        Παγίδα Σ/Λ που ξανά-εμφανίζεται: η μορφή{' '}
        <InlineMath>{'[A_c\\cos(2\\pi t)]\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        είναι DSB-SC, όχι conventional AM. Στο conventional AM ο carrier{' '}
        <strong>προστίθεται</strong>· στο DSB-SC{' '}
        <strong>πολλαπλασιάζεται</strong>.
      </p>
    ),
    examRadar: (
      <p>
        Σχεδόν αυτούσιο με jan26-th1-1 — Σ/Λ με υποτιθέμενη μορφή
        AM. Πρώτα ταυτοποίησε τι σχήμα είναι από τη δομή του τύπου,
        μετά απάντησε.
      </p>
    ),
  },

  'pa25-th1-2': {
    takeaway: (
      <p>
        Cosine = σήμα ισχύος <InlineMath>{'(P = A^2/2)'}</InlineMath>.
        Άπειρη ενέργεια, πεπερασμένη μέση ισχύς. Ο διαχωρισμός
        ενέργεια-vs-ισχύς είναι 3-βαθμικό True/False που πέφτει σχεδόν
        σε κάθε εξέταση.
      </p>
    ),
    examRadar: (
      <p>
        Όποια κι αν είναι η μορφή του cos/sin, η απάντηση είναι «σήμα
        ισχύος, P = A²/2». Αν σου δίνει σταθερά (π.χ.{' '}
        <InlineMath>{'x(t)=5'}</InlineMath>), επίσης σήμα ισχύος (P =
        25). Αν σου δίνει sinc/decay/Π-παλμό, σήμα ενέργειας.
      </p>
    ),
  },

  'pa25-th1-3': {
    takeaway: (
      <p>
        Επανάληψη: «λευκός» = σχήμα PSD, «Gaussian» = κατανομή πλάτους.
        Είναι ξεχωριστά concepts. Ο AWGN είναι και τα δύο μαζί, αλλά
        το ένα δεν συνεπάγεται το άλλο.
      </p>
    ),
    examRadar: (
      <p>
        Όταν δεις σύζευξη «λευκός — Gaussian» ή «Gaussian — επίπεδη
        PSD», είναι παγίδα Σ/Λ → πάντα ΛΑΘΟΣ. Διευκρίνισε ότι
        αναφέρονται σε διαφορετικές διαστάσεις του θορύβου.
      </p>
    ),
  },

  'pa25-th1-4': {
    takeaway: (
      <p>
        Η γραφή <InlineMath>{'M^3(f)'}</InlineMath> είναι αμφίσημη: είτε
        pointwise κυβισμός (BW = W, ίδιο στήριγμα) είτε φάσμα του{' '}
        <InlineMath>{'m^3(t)'}</InlineMath> (BW = 3W από τριπλή συνέλιξη
        στη συχνότητα). Σε καμία περίπτωση{' '}
        <InlineMath>{'W^3'}</InlineMath>. Η σύγχυση «πολλαπλασιασμός vs
        συνέλιξη» είναι ο πιο συχνός λόγος για λάθη εδώ.
      </p>
    ),
    examRadar: (
      <p>
        Αν η εκφώνηση γράφει <InlineMath>{'M^k(f)'}</InlineMath>{' '}
        ή ζητά bandwidth του <InlineMath>{'m^k(t)'}</InlineMath>, σκέψου
        «k-fold convolution στη συχνότητα» → BW γίνεται{' '}
        <InlineMath>{'kW'}</InlineMath>. Ποτέ <InlineMath>{'W^k'}</InlineMath>{' '}
        — αυτό είναι μαθηματικά λάθος.
      </p>
    ),
  },

  'pa25-th1-5': {
    takeaway: (
      <p>
        Fourier pair για τρίγωνο:{' '}
        <InlineMath>{'\\Lambda(t/T) \\leftrightarrow T\\,\\mathrm{sinc}^2(fT)'}</InlineMath>.
        Η περιβάλλουσα είναι sinc² — όχι ημιτονοειδής, όχι sinc απλό.
        Αυτό προκύπτει από το ότι τρίγωνο = συνέλιξη δύο rect.
      </p>
    ),
    examRadar: (
      <p>
        Σ/Λ με «sinusoidal envelope» για τρίγωνο/Π → πάντα ΛΑΘΟΣ. Η
        envelope είναι sinc (Π-παλμός) ή sinc² (τρίγωνο). Πρόσεξε ότι το
        τυπολόγιο έχει αυτές τις pairs — μη τις βρεις στο τυφλό.
      </p>
    ),
  },

  'pa25-th2-1': {
    takeaway: (
      <p>
        Ίδιοι 5 λόγοι με jan26-th2-6: μέγεθος κεραίας, multiplexing,
        αποδοτική χρήση φάσματος, ανοσία θορύβου, νομοθετικά πλαίσια.
        Αρκούν τρεις για ικανοποιητική απάντηση, αλλά οι πρώτοι δύο
        είναι οι πιο βαριοί.
      </p>
    ),
    examRadar: (
      <p>
        Θεωρητική πληκτρολογητέα ερώτηση. Γρήγορη απάντηση με bullets,
        όχι ολόκληρες παράγραφοι. Αν αναφέρεις «κεραία λ/4» κερδίζεις
        αμέσως νοητικό βάρος.
      </p>
    ),
  },

  'pa25-th2-2': {
    takeaway: (
      <p>
        <InlineMath>{'\\mu = A_m/A_c'}</InlineMath> είναι λόγος{' '}
        <em>πλατών</em>, όχι πλάτους-προς-συχνότητα. Σε πολλές κυκλοφορούσες
        λύσεις γίνεται το λάθος{' '}
        <InlineMath>{'\\mu = A_m/f_c'}</InlineMath> — διαστατικά αδύνατο
        (πλάτος / συχνότητα). Έλεγξε με sanity check: αν η περιβάλλουσα
        στο plot πέφτει αρνητική, σίγουρα <InlineMath>{'\\mu > 1'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        Όταν σου δίνει AM σήμα και το <InlineMath>{'A_m > A_c'}</InlineMath>,
        αναμένεται «overmodulation» στην απάντηση + σχεδίαση με phase
        reversals. Αν στη λύση προκύπτει <InlineMath>{'\\mu < 1'}</InlineMath>{' '}
        ενώ τα νούμερα δείχνουν αλλιώς, ξανακοίτα τη διαίρεση —
        πιθανώς διαστατικό λάθος.
      </p>
    ),
  },

  'pa25-th2-4': {
    takeaway: (
      <p>
        Όταν όλες οι συχνότητες διαφέρουν, τα cross-terms εξαφανίζονται
        και η ισχύς γίνεται απλό άθροισμα{' '}
        <InlineMath>{'\\sum A_i^2/2'}</InlineMath>. Δεν παίζει ρόλο αν
        είναι sin ή cos — μόνο τα πλάτη.
      </p>
    ),
    examRadar: (
      <p>
        «Ισχύς αθροίσματος sin/cos διαφορετικών συχνοτήτων» → απευθείας
        Parseval. Αν σου ζητήσει RMS, είναι <InlineMath>{'\\sqrt{P}'}</InlineMath>.
      </p>
    ),
  },

  'pa25-th2-5': {
    takeaway: (
      <p>
        Για AM ενός πολυτονικού message με <InlineMath>N</InlineMath>{' '}
        αρμονικές: στο φάσμα του διαμορφωμένου εμφανίζονται 1 carrier +
        N USB + N LSB γύρω από κάθε <InlineMath>{'\\pm f_c'}</InlineMath>.
        Συνολικά <InlineMath>{'2N+1'}</InlineMath> αρμονικές ανά πλευρά.
      </p>
    ),
    examRadar: (
      <p>
        «Πόσες αρμονικές έχει το AM φάσμα» → αρίθμησε: carrier + 2×N
        sidebands. Για <InlineMath>{'N=8'}</InlineMath> → 17 ανά πλευρά.
        Πρόσεξε: αν η εκφώνηση ζητά «μόνο θετικές συχνότητες» κρατάς το
        μισό.
      </p>
    ),
  },

  'pa25-th3-mux': {
    takeaway: (
      <p>
        USSB FDM δύο σημάτων: το BW του USSB είναι ίσο με το BW του
        baseband (όχι 2W όπως στο DSB). Συνθήκη non-overlap:{' '}
        <InlineMath>{'f_2 \\ge f_1 + W_1'}</InlineMath> + ασφάλεια από το
        zero με <InlineMath>{'f_1 \\ge W_1/2'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        FDM σύνθετο πρόβλημα ~25%: σπάσε σε στάδια — bandwidth ανάλυση,
        modulation per channel, multiplex spectrum, non-overlap conditions.
        Διαγράμματα φάσματος είναι σχεδόν πάντα μέρος της απάντησης.
      </p>
    ),
  },

  // ─── Πρόοδος B · Μάιος 2025 ──────────────────────────────────────────

  'pb25-th1-1': {
    takeaway: (
      <p>
        Σωστή μορφή conventional AM: carrier{' '}
        <strong>προστιθέμενος</strong> στο message, μετά πολλαπλασιασμός
        με carrier oscillation. Αυτή είναι η canonical εξίσωση που πρέπει
        να αναγνωρίζεις αμέσως.
      </p>
    ),
    examRadar: (
      <p>
        Σπάνια Σ/Λ που είναι ΣΩΣΤΟ. Ο εξεταστής συνήθως δίνει DSB-SC και
        το ταυτίζει με AM — εδώ έδωσε όντως σωστό AM. Πρόσεξε τη μορφή
        πριν απαντήσεις.
      </p>
    ),
  },

  'pb25-th1-2': {
    takeaway: (
      <p>
        Cosine είναι σήμα ισχύος, <strong>όχι ενέργειας</strong> — έχει
        άπειρη ενέργεια αλλά πεπερασμένη μέση ισχύ. Αυτή η Σ/Λ συνήθως
        έρχεται με ανεστραμμένη φόρα (αν η αρχική ήταν «είναι ισχύος»,
        η αντίστροφη «είναι ενέργειας» είναι ΛΑΘΟΣ).
      </p>
    ),
    examRadar: (
      <p>
        «X είναι σήμα ενέργειας;» για περιοδικό σήμα → πάντα ΛΑΘΟΣ.
        Energy signals σβήνουν με τον χρόνο.
      </p>
    ),
  },

  'pb25-th1-3': {
    takeaway: (
      <p>
        Επανάληψη της παγίδας: η PSD του θερμικού θορύβου είναι{' '}
        <em>επίπεδη</em> (λευκή). Η <em>κατανομή πλάτους</em> είναι
        Gaussian — αλλά αυτές είναι δύο διαφορετικές ιδιότητες του ίδιου
        σήματος.
      </p>
    ),
    examRadar: (
      <p>
        Παρόμοιο με jan26-th1-3 και pa25-th1-3 — η ίδια παγίδα σε τρεις
        εξετάσεις. «PSD ακολουθεί Gauss» = ΛΑΘΟΣ, η PSD είναι επίπεδη.
      </p>
    ),
  },

  'pb25-th1-4': {
    takeaway: (
      <p>
        Παρόμοιο με pa25-th1-4: <InlineMath>{'M^3(f)'}</InlineMath> είναι
        αμφίσημο, ποτέ <InlineMath>{'W^3'}</InlineMath>. Είτε pointwise
        κυβισμός (BW = W) είτε φάσμα του <InlineMath>{'m^3(t)'}</InlineMath>{' '}
        (BW = 3W). Η παγίδα ζει στη σύγχυση «time vs frequency
        convolution».
      </p>
    ),
    examRadar: (
      <p>
        Επανάληψη παγίδας — «κυβισμός φάσματος δίνει W³» → πάντα ΛΑΘΟΣ.
        Δείξε και τις δύο πιθανές αναγνώσεις στην απάντηση για πλήρες
        score.
      </p>
    ),
  },

  'pb25-th1-5': {
    takeaway: (
      <p>
        Ίδια παγίδα με pa25-th1-5: η περιβάλλουσα του τριγωνικού παλμού
        στο φάσμα είναι <InlineMath>{'\\mathrm{sinc}^2'}</InlineMath>, όχι
        ημιτονοειδής/συνημιτονοειδής. Είναι από τα standard Fourier
        pairs που πρέπει να ξέρεις απ' έξω.
      </p>
    ),
    examRadar: (
      <p>
        Τρίγωνο ↔ sinc². Παλμός ↔ sinc. Δέλτα ↔ 1. Cosine ↔ impulses.
        Αυτές οι 4 pairs είναι το βασικό σύνολο για όλα τα Σ/Λ
        ταυτοποίησης φάσματος.
      </p>
    ),
  },

  'pb25-th2-1': {
    takeaway: (
      <p>
        Λόγοι DSB-SC: 100% efficiency (όλη η ισχύς στις sidebands), ίδιο
        BW με AM (2W) αλλά καλύτερη χρήση ισχύος. Trade-off: χρειάζεται
        coherent demod αντί για envelope detector. Real-world: stereo FM
        L−R, NTSC chrominance.
      </p>
    ),
    examRadar: (
      <p>
        «Γιατί DSB-SC αντί για AM» → power efficiency είναι το #1
        επιχείρημα. Bullets με 3-4 σημεία αρκούν. Real-world examples
        φέρνουν bonus.
      </p>
    ),
  },

  'pb25-th2-2': {
    takeaway: (
      <p>
        Ίδιο πρόβλημα με pa25-th2-2:{' '}
        <InlineMath>{'\\mu = A_m/A_c = 2 > 1'}</InlineMath>, overmodulation,
        phase reversals ορατά. Η ίδια παγίδα{' '}
        <InlineMath>{'\\mu = A_m/f_c'}</InlineMath> εμφανίζεται.
      </p>
    ),
    examRadar: (
      <p>
        Σχεδόν αυτούσιο πρόβλημα με pa25-th2-2 — αν λύνεις το ένα,
        ξέρεις και το άλλο. Πάντα έλεγξε <InlineMath>{'A_m'}</InlineMath>{' '}
        vs <InlineMath>{'A_c'}</InlineMath> πριν υπολογίσεις μ.
      </p>
    ),
  },

  'pb25-th2-3': {
    takeaway: (
      <p>
        LSSB κρατά μόνο τη <strong>κάτω</strong> sideband. Αν το
        baseband είναι rect εύρους <InlineMath>W</InlineMath>, η LSSB
        είναι rect από <InlineMath>{'f_c - W'}</InlineMath> έως{' '}
        <InlineMath>{'f_c'}</InlineMath> (συμμετρικά αρνητικά). Bandwidth
        διαμορφωμένου = W (μισό από DSB-SC).
      </p>
    ),
    examRadar: (
      <p>
        USSB vs LSSB: μόνη διαφορά είναι ποια πλευρά κρατάς. Σχεδίασέ τες
        και τις δύο σαν «μισά» του DSB-SC spectrum. BW πάντα = W.
      </p>
    ),
  },

  'pb25-th2-4': {
    takeaway: (
      <p>
        Ίδια συνταγή με pa25-th2-4 και jan26-th2-9: άθροισμα
        sin/cos διαφορετικών συχνοτήτων → ισχύς ={' '}
        <InlineMath>{'\\sum A_i^2/2'}</InlineMath>. Δεν εξαρτάται από
        sin/cos.
      </p>
    ),
    examRadar: (
      <p>
        Repeating pattern σε όλες τις εξετάσεις. Μία γραμμή απάντηση
        — αν δεις άθροισμα 2-3 sinusoids διαφορετικών συχνοτήτων, η
        απάντηση είναι σχεδόν αυτόματη.
      </p>
    ),
  },

  'pb25-th2-5': {
    takeaway: (
      <p>
        Ίδιος κανόνας με pa25-th2-5: AM N-αρμονικού message → 1 carrier
        + N USB + N LSB ανά πλευρά =
        <InlineMath>{'2N+1'}</InlineMath> αρμονικές. Για{' '}
        <InlineMath>{'N=6'}</InlineMath> → 13 ανά πλευρά. Τα ύψη
        υπολογίζονται από <InlineMath>{'(10-n)/2'}</InlineMath>.
      </p>
    ),
    examRadar: (
      <p>
        Όποτε σου δίνει σήμα <InlineMath>{'\\sum A_n \\cos(2\\pi n t)'}</InlineMath>,
        μέτρα τους όρους → AM δίνει <InlineMath>{'2N+1'}</InlineMath>{' '}
        αρμονικές ανά πλευρά. Ύψη ανάλογα του <InlineMath>{'A_n/2'}</InlineMath>.
      </p>
    ),
  },

  'pb25-th3-mux': {
    takeaway: (
      <p>
        DSB-SC FDM: κάθε κανάλι έχει BW = 2W₍baseband₎. Συνθήκη
        non-overlap:{' '}
        <InlineMath>{'f_2 \\ge f_1 + (W_1 + W_2)'}</InlineMath>{' '}
        (συν guard band). Διαφορά από USSB FDM: τα BW εδώ είναι διπλά,
        οπότε χρειάζεσαι μεγαλύτερη απόσταση μεταξύ φερόντων.
      </p>
    ),
    examRadar: (
      <p>
        DSB-SC vs USSB στο ίδιο FDM: η DSB-SC χρειάζεται 2× το spacing
        γιατί κάθε κανάλι έχει 2× BW. Συχνά πέφτει για να δεις αν
        ξεχωρίζεις τα δύο σχήματα. Πάντα σχεδίασε και το mirror στις
        αρνητικές συχνότητες.
      </p>
    ),
  },

  'pb25-th4-nonlinear': {
    takeaway: (
      <p>
        Square-law modulator παράγει τέσσερα φασματικά μπλοκ:{' '}
        <InlineMath>{'m^2'}</InlineMath> (baseband, BW 2W),{' '}
        <InlineMath>{'2m\\cos\\omega_c t'}</InlineMath> (DSB-SC γύρω από{' '}
        <InlineMath>{'\\pm f_c'}</InlineMath>), DC, και{' '}
        <InlineMath>{'\\cos(2\\omega_c t)'}</InlineMath>. Το BPF γύρω από{' '}
        <InlineMath>{'f_c'}</InlineMath> με BW 2W κρατά μόνο το
        DSB-SC κομμάτι, με gain 1/2 για να καθαρίσει και τον συντελεστή.
      </p>
    ),
    examRadar: (
      <p>
        Πλήρες πρόβλημα μη-γραμμικού AM (~25%) → ανάλυση{' '}
        <InlineMath>{'(c+m)^2'}</InlineMath>, ταυτοποίηση 4 φασματικών
        όρων, σχεδιασμός BPF. Πρόσεξε ότι η ενέργεια του message είναι
        νορμαλισμένη — ο συντελεστής α βγαίνει από τη συνθήκη ενέργειας.
      </p>
    ),
  },

  // ─── Lecture exercises ──────────────────────────────────────────────

  'lec-am-1': {
    takeaway: (
      <p>
        Sweep του <InlineMath>{'A_c'}</InlineMath> με σταθερό{' '}
        <InlineMath>{'A_m = 0.5'}</InlineMath>: όσο μικραίνει το{' '}
        <InlineMath>{'A_c'}</InlineMath>, μεγαλώνει το{' '}
        <InlineMath>{'\\mu = A_m/A_c'}</InlineMath>. Όριο{' '}
        <InlineMath>{'A_c = A_m = 0.5'}</InlineMath> → μ=1 (όριο πριν
        overmodulation). Κάτω από αυτό, overmodulation.
      </p>
    ),
    examRadar: (
      <p>
        Πίνακας τιμών μ για διάφορα <InlineMath>{'A_c'}</InlineMath>{' '}
        → εκπαιδευτική επανάληψη του τύπου. Το βρεις αν σου ζητήσει
        «πότε γίνεται overmodulation» — απαντάς «όταν{' '}
        <InlineMath>{'A_c < A_m'}</InlineMath>».
      </p>
    ),
  },

  'lec-fm-1': {
    takeaway: (
      <p>
        Διαφορά PM vs FM για cosine message: το PM παίρνει το message
        απευθείας στη φάση (cos μέσα στο cos), ενώ το FM παίρνει το
        ολοκλήρωμα (sin μέσα στο cos, μετατοπισμένο 90°). Για την ίδια
        στιγμιαία φάση, υπάρχει ισοδυναμία PM-FM μέσω
        διαφόρισης/ολοκλήρωσης του message.
      </p>
    ),
    examRadar: (
      <p>
        «PM vs FM για ένα tone» → η μόνη διαφορά είναι sin/cos της
        modulating συχνότητας μέσα στο cosine. Αν σου ζητήσει «είναι
        ίσα» → ναι αν αλλάξεις το message από cos σε sin (90° shift).
      </p>
    ),
  },

  'lec-fm-3': {
    takeaway: (
      <p>
        FM με μεγάλο β (10) μέσω στενού BPF: μόνο 9 αρμονικές
        (<InlineMath>{'|n| \\le 4'}</InlineMath>) χωράνε στο 64 Hz BPF.
        Ποσοστό ισχύος = <InlineMath>{'\\sum_{|n|\\le 4} J_n^2(10)'}</InlineMath>{' '}
        — μικρό κομμάτι (~35%) επειδή το β=10 διασπείρει την ισχύ σε
        πολλές sidebands.
      </p>
    ),
    examRadar: (
      <p>
        Όταν ο BPF είναι πολύ στενότερος από Carson, χάνεις σημαντικό
        μέρος της ισχύος του FM σήματος. Υπολόγισε αρμονικές που χωράνε,
        και άθροισε τα <InlineMath>{'J_n^2'}</InlineMath> από τον πίνακα.
      </p>
    ),
  },

  'lec-rp-1': {
    takeaway: (
      <p>
        Joint statistics δύο τυχαίων διαδικασιών με ανεξάρτητες
        παραμέτρους: <InlineMath>{'R_{XY} = m_X m_Y'}</InlineMath> και{' '}
        <InlineMath>{'C_{XY} = 0'}</InlineMath> (uncorrelated). Πρόσεξε
        τη διαφορά: uncorrelated δεν σημαίνει orthogonal —{' '}
        <InlineMath>{'R_{XY}'}</InlineMath> μπορεί να είναι μη-μηδενικό.
      </p>
    ),
    examRadar: (
      <p>
        «Uncorrelated vs orthogonal» → η πιο συχνή σύγχυση. Uncorrelated:{' '}
        <InlineMath>{'C_{XY} = 0'}</InlineMath>. Orthogonal:{' '}
        <InlineMath>{'R_{XY} = 0'}</InlineMath>. Το πρώτο επιτρέπει
        non-zero means, το δεύτερο όχι.
      </p>
    ),
  },

  'lec-rp-2': {
    takeaway: (
      <p>
        Random-phase cosine{' '}
        <InlineMath>{'Z(t) = A\\cos(2\\pi f t + \\theta)'}</InlineMath>{' '}
        με <InlineMath>{'\\theta \\sim U[0, 2\\pi]'}</InlineMath> είναι
        WSS και ergodic: <InlineMath>{'m_Z = 0'}</InlineMath>,{' '}
        <InlineMath>{'R_Z(\\tau) = (A^2/2)\\cos(2\\pi f \\tau)'}</InlineMath>.
        Time averages = ensemble averages.
      </p>
    ),
    examRadar: (
      <p>
        Standard «δείξε ότι είναι WSS» problem: υπολόγισε mean
        (πρέπει να είναι σταθερό), υπολόγισε{' '}
        <InlineMath>{'R(t_1, t_2)'}</InlineMath> (πρέπει να εξαρτάται
        μόνο από τη διαφορά). Για ergodicity: time averages → ensemble.
      </p>
    ),
  },
}
