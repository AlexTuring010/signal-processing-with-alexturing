/**
 * Exercise bank — past-exam problems (priority) + lecture worked examples.
 *
 * Past-exam problems are transcribed verbatim from the original papers:
 *   - June 2026 (11 of 17 problems — the 6 draw problems land separately)
 *   - Πρόοδος · April 2026 (13 problems)
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
import { DistributionExplorerViz } from '@/components/viz/DistributionExplorerViz'
import type { Exercise } from './types'

export const EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // ΙΟΥΝΙΟΣ 2026 (17 ερωτήματα · 100% · 2 ώρες)
  //
  // 11 από τα 17 είναι εδώ. Τα 2, 4, 5, 9, 11, 17 είναι draw problems και
  // απαντιούνται με διαδραστικό σχήμα, όχι με κείμενο — έρχονται ξεχωριστά.
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'jun26-th1-1',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 1.1',
    paperPage: 1,
    weight: 5,
    title: 'Διαφορά αναλογικής AM και FM',
    topic: 'modulation',
    difficulty: 'easy',
    repeatGroup: 'am-vs-fm-comparison',
    prerequisites: ['am/conventional', 'fm/idea', 'fm/carson', 'fm/in-noise'],
    formulaIds: ['am-signal', 'am-bandwidth', 'am-eta', 'am-output-snr', 'fm-signal', 'fm-instantaneous-freq', 'carson', 'fm-power', 'fm-snr-ref', 'fm-snr-out', 'fm-gain-am'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — κανένα από αυτά δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Το τυπολόγιο δεν περιέχει καμία εξίσωση διαμόρφωσης: ούτε την{' '}
        <InlineMath>{'x_{AM}(t)=[A_c+m(t)]\\cos(2\\pi f_c t)'}</InlineMath>, ούτε την{' '}
        <InlineMath>{'x_{FM}(t)=A_c\\cos[2\\pi f_c t+2\\pi K_f\\int_{-\\infty}^{t}m(\\tau)\\,d\\tau]'}</InlineMath>,
        ούτε τη στιγμιαία συχνότητα <InlineMath>{'f_i(t)=f_c+K_f\\,m(t)'}</InlineMath>, ούτε το{' '}
        <InlineMath>{'B_{AM}=2W'}</InlineMath>, ούτε τον κανόνα Carson{' '}
        <InlineMath>{'B\\cong 2(\\beta+1)W'}</InlineMath>, ούτε την απόδοση{' '}
        <InlineMath>{'\\eta=\\mu^2/(2+\\mu^2)\\le 1/3'}</InlineMath>, ούτε τα αποτελέσματα{' '}
        <InlineMath>{'\\text{SNR}_{out}'}</InlineMath> και{' '}
        <InlineMath>{'G_{FM/AM}=9\\beta^2'}</InlineMath>. Είναι ερώτημα καθαρής μνήμης — και
        γι' αυτό από τα πιο κερδοφόρα, αφού δεν κινδυνεύεις να κολλήσεις σε πράξη. Τα ίδια
        εργαλεία τα έχεις ήδη χρειαστεί ένα-ένα σε προηγούμενα θέματα: την εξίσωση FM και το{' '}
        <InlineMath>{'\\beta'}</InlineMath> στο{' '}
        <Link
          href="/practice#exercise:sept25-th2-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 2.6
        </Link>, τον κανόνα Carson στο{' '}
        <Link
          href="/practice#exercise:jun25-th3-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 3
        </Link>, το bandwidth και την απόδοση της AM στο{' '}
        <Link
          href="/practice#exercise:sept25-th1-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.3
        </Link>. Τα output-SNR αποτελέσματα{' '}
        (<InlineMath>{'\\eta\\,\\text{SNR}_{ref}'}</InlineMath>,{' '}
        <InlineMath>{'3\\beta^2\\,\\text{SNR}_{ref}'}</InlineMath>,{' '}
        <InlineMath>{'9\\beta^2'}</InlineMath>) δεν τα ζητάει ρητά καμία άλλη άσκηση της
        τράπεζας — είναι από τα λίγα που πρέπει να τα κουβαλάς έτοιμα στο μυαλό σου.
      </>
    ),
    statement: (
      <p>
        Να εξηγηθεί η διαφορά μεταξύ αναλογικής AM και FM διαμόρφωσης.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Και οι δύο τεχνικές στέλνουν στον αέρα το ίδιο αντικείμενο: ένα ημιτονοειδές κύμα
            υψηλής συχνότητας, το <strong>carrier</strong>. Ένα τέτοιο κύμα{' '}
            <InlineMath>{'A\\cos(2\\pi f t + \\varphi)'}</InlineMath> έχει μόνο{' '}
            <strong>τρία</strong> «κουμπιά» που μπορείς να γυρίσεις: το πλάτος{' '}
            <InlineMath>A</InlineMath>, τη συχνότητα <InlineMath>f</InlineMath> και τη φάση{' '}
            <InlineMath>{'\\varphi'}</InlineMath>. Η <strong>AM</strong> γράφει το μήνυμα στο
            πρώτο κουμπί, η <strong>FM</strong> στο δεύτερο. Όλες οι υπόλοιπες διαφορές —
            bandwidth, ισχύς, θόρυβος, δέκτης — <em>δεν είναι ξεχωριστά γεγονότα προς
            αποστήθιση</em>· είναι συνέπειες αυτής της μίας επιλογής. Παρακάτω τις βγάζουμε
            μία-μία από αυτήν, και αυτή ακριβώς είναι η δομή που πρέπει να γράψεις.
          </span>
        </div>

        <p>
          Μια διευκρίνιση που αξίζει να τη γράψεις κι εσύ στην κόλλα σου: «αναλογική AM» εδώ
          σημαίνει τη <strong>συμβατική AM</strong> — αυτήν που εκπέμπει και τη φέρουσα,{' '}
          <InlineMath>{'x_{AM}(t)=[A_c+m(t)]\\cos(2\\pi f_c t)'}</InlineMath>. Είναι η
          παραλλαγή που εννοείται όταν λέμε σκέτο «AM», και η μόνη με το κόστος της φέρουσας
          που θα συγκρίνουμε παρακάτω. Οι υπόλοιπες παραλλαγές (DSB-SC, SSB, VSB) αλλάζουν
          τους αριθμούς της ισχύος και του bandwidth, όχι όμως τη ρίζα της διαφοράς: «πλάτος
          vs συχνότητα».
        </p>

        <p className="mt-4 font-medium text-fg">1. Τι μεταβάλλεται — οι δύο εξισώσεις</p>
        <p>
          Στην <strong>AM</strong> το μήνυμα <InlineMath>{'m(t)'}</InlineMath> προστίθεται στο
          πλάτος και η γωνία μένει ανέγγιχτη:
        </p>
        <BlockMath>{'x_{AM}(t) = [A_c + m(t)]\\,\\cos(2\\pi f_c t)'}</BlockMath>
        <p>
          Τι λέει αυτό στα απλά: το κύμα ταλαντώνεται πάντα με τον <em>ίδιο</em> ρυθμό{' '}
          <InlineMath>{'f_c'}</InlineMath>, και αυτό που ανεβοκατεβαίνει είναι το{' '}
          <strong>ύψος</strong> του — η <strong>envelope</strong>{' '}
          <InlineMath>{'A_c + m(t)'}</InlineMath>. Η πληροφορία ζει στο πλάτος.
        </p>
        <p>
          Στην <strong>FM</strong> το πλάτος παγώνει στο <InlineMath>{'A_c'}</InlineMath> και
          το μήνυμα μπαίνει <em>μέσα</em> στη γωνία:
        </p>
        <BlockMath>{'x_{FM}(t) = A_c\\cos\\!\\left[2\\pi f_c t + 2\\pi K_f\\int_{-\\infty}^{t} m(\\tau)\\,d\\tau\\right]'}</BlockMath>
        <p>
          Γιατί ολοκλήρωμα και όχι σκέτο <InlineMath>{'m(t)'}</InlineMath> μέσα στο cosine; Το
          ολοκλήρωμα δεν είναι αυθαίρετο — είναι το τίμημα για να ελέγχει το μήνυμα τη{' '}
          <strong>στιγμιαία συχνότητα</strong>, δηλαδή τον ρυθμό με τον οποίο τρέχει η γωνία.
          Παραγωγίζοντας τη συνολική γωνία <InlineMath>{'\\theta(t)'}</InlineMath> παίρνουμε
          ακριβώς αυτό που ζητήσαμε:
        </p>
        <BlockMath>{'f_i(t) = \\frac{1}{2\\pi}\\frac{d\\theta(t)}{dt} = f_c + K_f\\, m(t)'}</BlockMath>
        <p>
          Στα απλά: όταν το μήνυμα ανεβαίνει, οι κορυφές του κύματος{' '}
          <strong>πυκνώνουν</strong>· όταν κατεβαίνει, <strong>αραιώνουν</strong>. Το ύψος δεν
          κουνιέται ποτέ. Η πληροφορία ζει στη συχνότητα.
        </p>

        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Γραμμική vs μη γραμμική διαμόρφωση — η καρδιά του θέματος.
          </strong>{' '}
          <span className="text-fg-muted">
            Στην AM το <InlineMath>{'m(t)'}</InlineMath> είναι <em>έξω</em> από το cosine, απλός
            πολλαπλασιαστής· άρα το φάσμα του μηνύματος περνάει <strong>αυτούσιο</strong>,
            μετατοπισμένο στο <InlineMath>{'\\pm f_c'}</InlineMath>. Στην FM το{' '}
            <InlineMath>{'m(t)'}</InlineMath> είναι <em>μέσα</em> στο cosine, και το cosine
            είναι μη γραμμική συνάρτηση. Ο πιο γρήγορος έλεγχος: πάρε έναν σκέτο τόνο{' '}
            <InlineMath>{'m(t)=A_m\\cos(2\\pi f_m t)'}</InlineMath> και{' '}
            <strong>διπλασίασε το <InlineMath>{'A_m'}</InlineMath></strong>. Στην AM
            διπλασιάζονται τα πλάτη των δύο πλευρικών γραμμών και τίποτε άλλο — τρεις
            φασματικές γραμμές στις θετικές συχνότητες πριν (φέρουσα + δύο πλευρικές), τρεις
            και μετά. Στην FM διπλασιάζεται η απόκλιση{' '}
            <InlineMath>{'\\Delta f = K_f A_m'}</InlineMath>, άρα και ο δείκτης{' '}
            <InlineMath>{'\\beta = \\Delta f/f_m'}</InlineMath>: εμφανίζονται{' '}
            <strong>καινούριες</strong> πλευρικές γραμμές, όλη η ισχύς ανακατανέμεται ανάμεσά
            τους, και η φέρουσα μπορεί ακόμη και να <strong>μηδενιστεί</strong> — συμβαίνει
            γύρω στο <InlineMath>{'\\beta \\approx 2.4'}</InlineMath>, και φαίνεται στον πίνακα
            Bessel που είναι τυπωμένος πάνω σε αυτό το ίδιο θέμα (γραμμή{' '}
            <InlineMath>{'\\beta = 2.41'}</InlineMath>, στήλη «Carrier»: μηδέν). Γι' αυτό η FM
            δεν είναι απλή μετατόπιση φάσματος όπως η AM.
          </span>
        </div>

        <p className="mt-4 font-medium text-fg">2. Συνέπεια — εύρος ζώνης</p>
        <p>
          Αφού το φάσμα της AM είναι το φάσμα του μηνύματος μετατοπισμένο, το bandwidth
          βγαίνει αμέσως: αν το <InlineMath>{'m(t)'}</InlineMath> φτάνει μέχρι{' '}
          <InlineMath>W</InlineMath>, τότε
        </p>
        <BlockMath>{'B_{AM} = 2W'}</BlockMath>
        <p>
          και είναι <strong>σταθερό</strong>: δεν εξαρτάται από το πόσο δυνατά μιλάς. Στην FM
          οι πλευρικές γραμμές είναι θεωρητικά <strong>άπειρες</strong>, οπότε πρακτικά
          κρατάμε όσες κουβαλούν σχεδόν όλη την ισχύ. Αυτό ακριβώς μετράει ο{' '}
          <strong>κανόνας του Carson</strong>:
        </p>
        <BlockMath>{'B_{FM} \\cong 2(\\beta + 1)W = 2(\\Delta f + W)'}</BlockMath>
        <p>
          Δύο πράγματα να κρατήσεις: (α) είναι πάντα <strong>μεγαλύτερο</strong> από{' '}
          <InlineMath>{'2W'}</InlineMath>, και (β) το ρυθμίζεις εσύ μέσω του{' '}
          <InlineMath>{'\\beta'}</InlineMath> — ελευθερία που η AM δεν σου δίνει καθόλου. Αυτή
          η ελευθερία είναι το νόμισμα με το οποίο η FM θα «αγοράσει» ποιότητα στο επόμενο
          βήμα. Οριακή περίπτωση που δείχνει ότι ο τύπος είναι συνεπής: για{' '}
          <InlineMath>{'\\beta \\ll 1'}</InlineMath> (NBFM) ο Carson δίνει{' '}
          <InlineMath>{'B \\approx 2W'}</InlineMath> — ίδιο με την AM.
        </p>

        <p className="mt-4 font-medium text-fg">3. Συνέπεια — ισχύς και απόδοση</p>
        <p>
          Στην AM η envelope περιέχει τον σταθερό όρο <InlineMath>{'A_c'}</InlineMath>, ο
          οποίος εμφανίζεται στο φάσμα ως μια <strong>γραμμή-φέρουσα</strong>. Αυτή η γραμμή
          δεν κουβαλάει καμία πληροφορία· είναι εκεί μόνο για να μπορεί ο δέκτης να διαβάσει
          την envelope. Άρα ένα κομμάτι της εκπεμπόμενης ισχύος πάει χαμένο, και η απόδοση
          είναι
        </p>
        <BlockMath>{'\\eta = \\frac{P_m}{A_c^2 + P_m} \\;\\stackrel{\\text{single-tone}}{=}\\; \\frac{\\mu^2}{2+\\mu^2} \\;\\le\\; \\frac{1}{3}'}</BlockMath>
        <p>
          Το <InlineMath>{'1/3'}</InlineMath> είναι <em>απόλυτο μέγιστο</em> και το πιάνεις
          μόνο στο <InlineMath>{'\\mu = 1'}</InlineMath>: ακόμη και στην καλύτερη περίπτωση,
          τα δύο τρίτα της ισχύος καίγονται στη φέρουσα. Στην FM, αντίθετα, το πλάτος είναι
          σταθερό, οπότε η μέση ισχύς είναι απλώς
        </p>
        <BlockMath>{'P_{FM} = \\frac{A_c^2}{2} \\qquad \\text{για κάθε } \\beta \\text{ και κάθε } m(t)'}</BlockMath>
        <p>
          Δεν υπάρχει σταθερό «τέλος» που να πληρώνεις στη φέρουσα: όσο μεγαλώνει το{' '}
          <InlineMath>{'\\beta'}</InlineMath>, η ίδια συνολική ισχύς{' '}
          <strong>ανακατανέμεται</strong> από τη φέρουσα προς τις πλευρικές ζώνες — γι' αυτό
          και μπορεί η φέρουσα να εξαφανιστεί εντελώς. Αυτό εννοούμε όταν λέμε «η FM δεν
          σπαταλά ισχύ σε φέρουσα». Πρακτικό μπόνους του σταθερού πλάτους: ο ενισχυτής του
          πομπού μπορεί να δουλεύει σε κορεσμό, που είναι φθηνότερο και αποδοτικότερο.
        </p>

        <p className="mt-4 font-medium text-fg">4. Συνέπεια — συμπεριφορά στον θόρυβο</p>
        <p>
          Ο θόρυβος του καναλιού χτυπάει κυρίως το <strong>πλάτος</strong> του λαμβανόμενου
          κύματος. Εδώ η διαφορά γίνεται δραματική, και βγαίνει κατευθείαν από το βήμα 1:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            Στην <strong>AM</strong> η πληροφορία <em>είναι</em> το πλάτος. Ό,τι προσθέσει ο
            θόρυβος στην envelope, ο δέκτης το διαβάζει ως μήνυμα — δεν έχει κανέναν τρόπο να
            τα ξεχωρίσει.
          </li>
          <li>
            Στην <strong>FM</strong> το πλάτος δεν κουβαλάει τίποτα. Ο δέκτης βάζει πρώτα έναν{' '}
            <strong>limiter</strong> που ισοπεδώνει το κύμα ξανά σε σταθερό ύψος, σβήνοντας τον
            θόρυβο πλάτους, και μόνο μετά μετράει τον ρυθμό. Το να πετάξεις το πλάτος είναι
            νόμιμο ακριβώς επειδή δεν έβαλες ποτέ πληροφορία εκεί.
          </li>
        </ul>
        <p>
          Ποσοτικά, η σύγκριση έχει νόημα μόνο αν τα δύο συστήματα εκπέμπουν την{' '}
          <strong>ίδια συνολική ισχύ</strong> <InlineMath>{'P_T'}</InlineMath> — αυτό είναι
          που πληρώνεις στον πομπό σου. Κοινή βάση λοιπόν είναι το{' '}
          <InlineMath>{'\\text{SNR}_{ref} = P_T/(N_0 W)'}</InlineMath>, δηλαδή το SNR που θα
          είχες αν ολόκληρη η εκπεμπόμενη ισχύς έφτανε σε baseband εύρους{' '}
          <InlineMath>W</InlineMath>. Πρόσεξε ότι το <InlineMath>{'P_T'}</InlineMath> γράφεται
          αλλιώς σε κάθε σύστημα: στη FM είναι <InlineMath>{'P_T = A_c^2/2'}</InlineMath>, ενώ
          στη συμβατική AM είναι <InlineMath>{'P_T = (A_c^2 + P_m)/2'}</InlineMath> — μαζί με
          τη φέρουσα, που στο <InlineMath>{'\\mu = 1'}</InlineMath> κάνει{' '}
          <InlineMath>{'\\tfrac{3}{4}A_c^2'}</InlineMath>. Δηλαδή «ίδιο{' '}
          <InlineMath>{'P_T'}</InlineMath>» <em>δεν</em> σημαίνει ίδιο πλάτος φέροντος. Αν
          προσπεράσεις αυτό το βήμα και βάλεις το ίδιο{' '}
          <InlineMath>{'A_c'}</InlineMath> και στα δύο, το κέρδος σου βγαίνει λάθος κατά έναν
          παράγοντα <InlineMath>{'3/2'}</InlineMath> — καταλήγεις σε{' '}
          <InlineMath>{'6\\beta^2'}</InlineMath> αντί για{' '}
          <InlineMath>{'9\\beta^2'}</InlineMath>, και είναι η κλασική παγίδα αυτής της
          σύγκρισης. Με τη σωστή βάση:
        </p>
        <BlockMath>{'\\text{SNR}_{out,AM} = \\eta\\,\\text{SNR}_{ref} \\le \\tfrac{1}{3}\\,\\text{SNR}_{ref}, \\qquad \\text{SNR}_{out,FM} = 3\\beta^2\\,\\text{SNR}_{ref}'}</BlockMath>
        <BlockMath>{'\\Rightarrow\\quad G_{FM/AM} = \\frac{3\\beta^2}{1/3} = 9\\beta^2'}</BlockMath>
        <p>
          Πρόσεξε τη δομή του αποτελέσματος: το κέρδος πάει με{' '}
          <InlineMath>{'\\beta^2'}</InlineMath>, ενώ το bandwidth του Carson πάει με{' '}
          <InlineMath>{'\\beta'}</InlineMath>. Δηλαδή η FM δίνει <em>τετραγωνική</em> βελτίωση
          ποιότητας για <em>γραμμικό</em> κόστος φάσματος — αυτό είναι όλο το επιχείρημα υπέρ
          της.
        </p>
        <p>
          <strong>Το νούμερο θέλει κομπιουτεράκι</strong> (επιτρέπεται στην εξέταση). Για το
          εμπορικό FM ραδιόφωνο με <InlineMath>{'\\beta = 5'}</InlineMath>:{' '}
          <InlineMath>{'9\\cdot 5^2 = 225'}</InlineMath> φορές, δηλαδή{' '}
          <InlineMath>{'10\\log_{10}225 \\approx 23.5'}</InlineMath> dB. Αν δεν θέλεις να
          εμπιστευτείς το πλήκτρο, σπάσε το: <InlineMath>{'225 = 9\\cdot 25'}</InlineMath>,{' '}
          <InlineMath>{'10\\log_{10}9 \\approx 9.5'}</InlineMath> dB και{' '}
          <InlineMath>{'10\\log_{10}25 \\approx 14.0'}</InlineMath> dB, άθροισμα{' '}
          <InlineMath>{'23.5'}</InlineMath> dB.
        </p>

        <p className="mt-4 font-medium text-fg">5. Συνέπεια — δέκτης και τα ψιλά γράμματα</p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>AM:</strong> με <InlineMath>{'\\mu \\le 1'}</InlineMath> αρκεί ένας{' '}
            <strong>envelope detector</strong> — δίοδος και ένα RC. Δεν χρειάζεται καμία
            αναφορά φάσης. Αυτός ακριβώς είναι ο λόγος που η συμβατική AM δέχτηκε εξαρχής να
            σπαταλήσει ισχύ στη φέρουσα: αγόρασε φθηνούς δέκτες.
          </li>
          <li>
            <strong>FM:</strong> <strong>limiter + discriminator</strong> (ή PLL). Ούτε εδώ
            χρειάζεται αναφορά φάσης — μετράς ρυθμό, όχι θέση — αλλά είναι σαφώς περισσότερα
            κυκλώματα.
          </li>
          <li>
            <strong>Πώς χαλάει:</strong> το <InlineMath>{'9\\beta^2'}</InlineMath> ισχύει μόνο
            πάνω από ένα <strong>κατώφλι</strong> εισερχόμενου SNR (τάξης 10 dB). Κάτω από
            αυτό η FM καταρρέει <em>απότομα</em>, ενώ η AM χειροτερεύει ομαλά. Σε πολύ
            θορυβώδη ζεύξη λοιπόν το πλεονέκτημα της FM εξαφανίζεται.
          </li>
          <li>
            <strong>Capture effect:</strong> αν δύο πομποί εκπέμπουν στην ίδια συχνότητα, ο
            FM δέκτης «κλειδώνει» στον ισχυρότερο και ο ασθενέστερος σβήνει τελείως. Στην AM
            τα δύο σήματα απλώς προστίθενται και τα ακούς και τα δύο.
          </li>
        </ul>

        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left">Άξονας</th>
              <th className="py-2 text-left">AM (συμβατική)</th>
              <th className="py-2 text-left">FM</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>Τι κουβαλάει το μήνυμα</td><td>Το πλάτος (envelope)</td><td>Η στιγμιαία συχνότητα</td></tr>
            <tr><td>Τι μένει σταθερό</td><td>Η συχνότητα <InlineMath>{'f_c'}</InlineMath></td><td>Το πλάτος <InlineMath>{'A_c'}</InlineMath></td></tr>
            <tr><td>Γραμμικότητα</td><td>Γραμμική — φάσμα μηνύματος μετατοπισμένο</td><td>Μη γραμμική — άπειρες πλευρικές (Bessel)</td></tr>
            <tr><td>Bandwidth</td><td><InlineMath>{'2W'}</InlineMath>, σταθερό</td><td><InlineMath>{'2(\\beta+1)W'}</InlineMath>, μεγαλώνει με το β</td></tr>
            <tr><td>Ισχύς / απόδοση</td><td><InlineMath>{'\\tfrac{A_c^2}{2}+\\tfrac{P_m}{2}'}</InlineMath>, <InlineMath>{'\\eta \\le 1/3'}</InlineMath></td><td><InlineMath>{'\\tfrac{A_c^2}{2}'}</InlineMath>, χωρίς πάγιο κόστος φέρουσας</td></tr>
            <tr><td>Θόρυβος</td><td>Πέφτει κατευθείαν πάνω στο μήνυμα</td><td>Limiter τον κόβει· <InlineMath>{'G = 9\\beta^2'}</InlineMath></td></tr>
            <tr><td>Δέκτης</td><td>Envelope detector (φθηνός)</td><td>Limiter + discriminator</td></tr>
            <tr><td>Υποβάθμιση</td><td>Ομαλή</td><td>Απότομη κάτω από το threshold</td></tr>
          </tbody>
        </table>

        <p>
          <strong>Η μία πρόταση που τα συνοψίζει όλα:</strong> η AM βάζει την πληροφορία στο
          πλάτος και πληρώνει με ισχύ και ευπάθεια στον θόρυβο· η FM τη βάζει στη συχνότητα
          και πληρώνει με εύρος ζώνης και πολυπλοκότητα — <em>η FM αγοράζει SNR με
          bandwidth</em>.
        </p>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— σε ερώτημα 5% έχεις περίπου πέντε λεπτά, οπότε μη γράψεις παράγραφο. Γράψε:
            (1) τις δύο εξισώσεις, (2) μία πρόταση «στην AM η πληροφορία είναι στο πλάτος, στη
            FM στη συχνότητα», (3) πίνακα με τέσσερις γραμμές — bandwidth, ισχύς, θόρυβος,
            δέκτης — και (4) την τελική πρόταση του trade-off. Τον ίδιο σκελετό τον
            ξαναχρησιμοποιείς αυτούσιο σε κάθε «σύγκρινε τη διαμόρφωση X με την Y»: αλλάζεις
            μόνο την πρώτη γραμμή, «τι μεταβάλλεται», και οι υπόλοιπες ξαναβγαίνουν μόνες τους.
          </span>
        </div>
      </>
    ),
  },
  {
    id: 'jun26-th1-3',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 1.3',
    paperPage: 1,
    weight: 7,
    title: 'Κατανομή των δειγμάτων του λευκού θορύβου',
    topic: 'random',
    difficulty: 'medium',
    prerequisites: ['noise/white-noise', 'noise/sources', 'randomness/random-variables'],
    formulaIds: ['white-noise-psd', 'wiener-khinchin', 'wss-rx-properties', 'random-autocorr', 'bandlimited-noise-power', 'thermal-noise'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong> κανένα από
        τα τρία εργαλεία αυτού του ερωτήματος δεν υπάρχει στο επίσημο τυπολόγιο.{' '}
        <strong>(1)</strong> Η Gaussian ΣΠΠ (συνάρτηση πυκνότητας πιθανότητας){' '}
        <InlineMath>{'f_{N(t_i)}(x)=\\tfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-x^2/(2\\sigma^2)}'}</InlineMath>{' '}
        — το ίδιο εργαλείο χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:pb25-th1-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Β 2025 ΘΕΜΑ 1.3
        </Link>{' '}
        και στο{' '}
        <Link
          href="/practice#exercise:jan26-th1-3"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 1.3
        </Link>
        . <strong>(2)</strong> Η PSD του λευκού θορύβου{' '}
        <InlineMath>{'S_N(f)=N_0/2'}</InlineMath> μαζί με τη ΣΑΣ της{' '}
        <InlineMath>{'R_N(\\tau)=(N_0/2)\\delta(\\tau)'}</InlineMath> — όπως στο{' '}
        <Link
          href="/practice#exercise:sept25-th3-10"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 3.10
        </Link>
        . <strong>(3)</strong> Η ισχύς σε πεπερασμένη ζώνη{' '}
        <InlineMath>{'P_N=N_0W'}</InlineMath> — όπως στο{' '}
        <Link
          href="/practice#exercise:proodos26-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ. 2026 ΘΕΜΑ 6
        </Link>
        . Και το <strong>θεώρημα κεντρικού ορίου</strong> (Central Limit Theorem,
        CLT) το γράφεις κι αυτό απέξω: δεν είναι τύπος, είναι η{' '}
        <em>αιτιολόγηση</em> — και χωρίς αυτήν η απάντηση «Gaussian» μένει
        ατεκμηρίωτη.
      </>
    ),
    statement: (
      <>
        <p>
          Το προηγούμενο ερώτημα του ίδιου θέματος ζητούσε τη{' '}
          <strong>ΦΠΙ</strong> (φασματική πυκνότητα ισχύος — PSD) της τυχαίας
          διαδικασίας του <strong>λευκού θορύβου</strong>{' '}
          <InlineMath>{'N(t)'}</InlineMath>, δηλαδή το επίπεδο φάσμα{' '}
          <InlineMath>{'S_N(f) = N_0/2'}</InlineMath> για κάθε{' '}
          <InlineMath>f</InlineMath>.
        </p>
        <p>
          Στο ίδιο παράδειγμα του λευκού θορύβου:{' '}
          <strong>
            τι κατανομή ακολουθεί η συνάρτηση πυκνότητας πιθανότητας
          </strong>{' '}
          (ΣΠΠ — probability density function, pdf){' '}
          <strong>
            των τυχαίων μεταβλητών που αποτελούν τα δείγματα του θορύβου;
          </strong>
        </p>
      </>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — τι ακριβώς είναι ένα «δείγμα του θορύβου».
          </strong>{' '}
          <span className="text-fg-muted">
            Πάγωσε το ρολόι σε μια στιγμή <InlineMath>{'t_i'}</InlineMath> και μέτρα
            την τάση του θορύβου. Δεν παίρνεις έναν αριθμό που μπορούσες να
            προβλέψεις — παίρνεις έναν <strong>τυχαίο</strong> αριθμό. Άρα το{' '}
            <InlineMath>{'N(t_i)'}</InlineMath> δεν είναι σήμα· είναι μια{' '}
            <strong>τυχαία μεταβλητή</strong>. Και «τι κατανομή ακολουθεί» σημαίνει
            πρακτικά: <em>αν επαναλάμβανες αυτή τη μέτρηση εκατομμύρια φορές κι
            έφτιαχνες ιστόγραμμα των τιμών, τι σχήμα θα έβγαινε — καμπάνα, κουτί,
            κάτι άλλο;</em>{' '}
            <strong className="text-fg">Πρόσεξε τι ζητάει και τι όχι:</strong> ζητάει
            το σχήμα του ιστογράμματος των <em>τιμών</em>. Καμία σχέση με συχνότητες.
          </span>
        </div>

        <p>
          <strong>
            Βήμα 1 — γιατί η ΦΠΙ του προηγούμενου ερωτήματος δεν απαντάει.
          </strong>{' '}
          Το πρώτο ένστικτο είναι να γυρίσεις πίσω στη{' '}
          <InlineMath>{'S_N(f) = N_0/2'}</InlineMath> και να βγάλεις από εκεί την
          απάντηση. Δεν γίνεται, και αξίζει να δεις γιατί: η ΦΠΙ λέει{' '}
          <strong>πού κάθεται η ισχύς πάνω στη συχνότητα</strong> — μετριέται σε Watt
          ανά Hz, δεν είναι καν κατανομή πιθανότητας. Η ΣΠΠ λέει{' '}
          <strong>πώς μοιράζονται οι τιμές</strong> του θορύβου. Δύο διαφορετικά
          γραφήματα, δύο διαφορετικοί άξονες.
        </p>

        <p>
          Το κλείνει ένα αντιπαράδειγμα: πάρε ασυσχέτιστες τιμές ομοιόμορφα
          κατανεμημένες στο <InlineMath>{'[-1, +1]'}</InlineMath>. Η ΦΠΙ βγαίνει{' '}
          <em>κι αυτή</em> επίπεδη — άρα εξίσου «λευκός» θόρυβος — αλλά το ιστόγραμμά
          της είναι <strong>κουτί</strong>, όχι καμπάνα. Άρα η λέξη «λευκός»{' '}
          <em>δεν</em> καθορίζει την κατανομή· χρειάζεται μια δεύτερη, εντελώς
          ανεξάρτητη πληροφορία. Αυτό είναι το πραγματικό βήμα του ερωτήματος: να
          καταλάβεις ότι η απάντηση <strong>δεν κρύβεται στα δοσμένα</strong> και να
          ξέρεις πού αλλού να την ψάξεις.
        </p>

        <p>
          <strong>Βήμα 2 — από πού έρχεται τελικά: από τη φυσική της πηγής.</strong>{' '}
          Η τάση θορύβου στα άκρα ενός αγωγού είναι το <strong>άθροισμα</strong>{' '}
          τεράστιου πλήθους μικροσκοπικών και μεταξύ τους ανεξάρτητων συνεισφορών —
          της τυχαίας θερμικής κίνησης του κάθε ηλεκτρονίου. Το{' '}
          <strong>θεώρημα κεντρικού ορίου</strong> (Central Limit Theorem, CLT) λέει
          ακριβώς αυτό: όταν αθροίζεις πάρα πολλές ανεξάρτητες τυχαίες συνεισφορές, το
          άθροισμα τείνει σε <strong>Gaussian</strong> κατανομή —{' '}
          <em>ό,τι κι αν είναι η κατανομή της καθεμιάς ξεχωριστά</em>. Δεν χρειάζεται
          να ξέρεις τίποτα για το «σπρώξιμο» ενός μεμονωμένου ηλεκτρονίου· το πλήθος
          τους κάνει τη δουλειά. Παρατήρησε ότι το επιχείρημα{' '}
          <strong>δεν περνάει καθόλου</strong> από τη ΦΠΙ.
        </p>

        <p>
          <strong>Βήμα 3 — η απάντηση.</strong> Τα δείγματα του θορύβου ακολουθούν{' '}
          <strong>Gaussian (κανονική) κατανομή με μηδενική μέση τιμή</strong>:
        </p>

        <BlockMath>{'f_{N(t_i)}(x) \\;=\\; \\frac{1}{\\sigma\\sqrt{2\\pi}}\\, e^{-\\frac{x^2}{2\\sigma^2}}\\,, \\qquad \\forall\\, t_i'}</BlockMath>

        <p>
          <strong>Τι λέει η γραμμή αυτή στα απλά:</strong> το ιστόγραμμα των τιμών
          είναι μια <strong>καμπάνα κεντραρισμένη στο μηδέν</strong>, και το πόσο
          φαρδιά είναι το ρυθμίζει μία και μόνο παράμετρος, το{' '}
          <InlineMath>{'\\sigma'}</InlineMath>. Το{' '}
          <InlineMath>{'\\forall\\, t_i'}</InlineMath> στο τέλος δεν είναι
          διακοσμητικό: λέει ότι είναι <strong>η ίδια ακριβώς καμπάνα σε κάθε στιγμή</strong>{' '}
          <InlineMath>{'t_i'}</InlineMath> που θα διαλέξεις — η κατανομή δεν
          «μετακινείται» με τον χρόνο.
        </p>

        <p>
          <strong>Γιατί μηδενική μέση τιμή — δύο ανεξάρτητοι λόγοι.</strong>{' '}
          <em>(i) Φυσικά:</em> τα ηλεκτρόνια δεν έχουν προτιμώμενη κατεύθυνση, οπότε
          οι θετικές και οι αρνητικές συνεισφορές αλληλοαναιρούνται κατά μέσο όρο.{' '}
          <em>(ii) Από την ίδια τη ΦΠΙ:</em> μια σταθερή (DC) συνιστώσα{' '}
          <InlineMath>{'m_N \\ne 0'}</InlineMath> θα εμφανιζόταν υποχρεωτικά ως
          κρουστική <InlineMath>{'m_N^2\\,\\delta(f)'}</InlineMath> πάνω στη ΦΠΙ, στο{' '}
          <InlineMath>{'f = 0'}</InlineMath>. Η ΦΠΙ που δόθηκε είναι{' '}
          <strong>καθαρά επίπεδη</strong>, χωρίς καμία κρουστική — άρα{' '}
          <InlineMath>{'m_N = 0'}</InlineMath>. Ωραίο σημείο: εδώ η ΦΠΙ{' '}
          <em>όντως</em> λέει κάτι για την κατανομή — μόνο που λέει πού είναι{' '}
          <strong>κεντραρισμένη</strong>, όχι τι <strong>σχήμα</strong> έχει.
        </p>

        <figure className="my-4">
          <DistributionExplorerViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Στο διαδραστικό «Κύριες κατανομές — PDF, μέσος, διασπορά» παραπάνω: μείνε
            στην καρτέλα <strong>Gaussian</strong>, άφησε το{' '}
            <strong>μ (mean)</strong> στο <InlineMath>0</InlineMath> — αυτή είναι η
            μέση τιμή που μόλις δικαιολογήσαμε — και σύρε το{' '}
            <strong>σ (std dev)</strong>. Το <em>σχήμα</em> δεν αλλάζει ποτέ· αλλάζει
            μόνο το <em>πλάτος</em> της καμπάνας. Κράτα αυτή τη διάκριση
            σχήματος-και-πλάτους — παρακάτω θα δούμε ότι το σχήμα το ξέρουμε με
            βεβαιότητα, ενώ το πλάτος μένει απροσδιόριστο μέχρι να μπει στη μέση ένα
            εύρος ζώνης. Μετά πάτησε <strong>Uniform</strong>: αυτό είναι το
            αντιπαράδειγμα του Βήματος 1 — ένας θόρυβος που μπορεί να έχει{' '}
            <em>ίδια</em> επίπεδη ΦΠΙ και να μην είναι καθόλου Gaussian.
          </figcaption>
        </figure>

        <p>
          <strong>
            Βήμα 4 — τι προσθέτει τελικά το «λευκός»: όχι το σχήμα της καμπάνας, αλλά
            τη σχέση των δειγμάτων μεταξύ τους.
          </strong>{' '}
          Ξεκίνα από τη ΣΑΣ (συνάρτηση αυτοσυσχέτισης), που βγαίνει από τη ΦΠΙ με
          αντίστροφο μετασχηματισμό Fourier (σχέση Wiener–Khinchin):
        </p>

        <BlockMath>{'R_N(\\tau) \\;=\\; \\mathcal{F}^{-1}\\{S_N(f)\\} \\;=\\; \\mathcal{F}^{-1}\\left\\{\\frac{N_0}{2}\\right\\} \\;=\\; \\frac{N_0}{2}\\,\\delta(\\tau)'}</BlockMath>

        <p>
          Πάρε τώρα δύο <em>διαφορετικές</em> στιγμές{' '}
          <InlineMath>{'t_i \\ne t_j'}</InlineMath>, δηλαδή απόσταση{' '}
          <InlineMath>{'\\tau = t_j - t_i \\ne 0'}</InlineMath>. Εκεί η δέλτα είναι
          μηδέν, οπότε από τον ορισμό{' '}
          <InlineMath>{'R_N(\\tau) = E[N(t_i)N(t_j)]'}</InlineMath> και επειδή{' '}
          <InlineMath>{'m_N = 0'}</InlineMath>:
        </p>

        <BlockMath>{'\\mathrm{Cov}\\big(N(t_i),\\, N(t_j)\\big) \\;=\\; R_N(\\tau) - m_N^2 \\;=\\; 0 \\qquad \\text{για κάθε } \\tau \\ne 0'}</BlockMath>

        <p>
          Δηλαδή δύο δείγματα σε διαφορετικές στιγμές είναι{' '}
          <strong>ασυσχέτιστα</strong> — όσο κοντά κι αν τα πάρεις. Αυτό είναι όλο το
          νόημα του «λευκού»: <strong>μηδενική μνήμη</strong>.
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Το μπόνους που το δίνει μόνο η Gaussian — «ασυσχέτιστα ⇒ ανεξάρτητα».
          </strong>{' '}
          <span className="text-fg-muted">
            «Ασυσχέτιστα» είναι <em>αδύναμη</em> δήλωση: λέει μόνο ότι δεν υπάρχει{' '}
            <em>γραμμική</em> σχέση. Σε γενικές τυχαίες μεταβλητές «ασυσχέτιστα»{' '}
            <strong>δεν</strong> σημαίνει «ανεξάρτητα» — αντιπαράδειγμα:{' '}
            <InlineMath>{'X \\sim U[-1,1]'}</InlineMath> και{' '}
            <InlineMath>{'Y = X^2'}</InlineMath>. Το <InlineMath>Y</InlineMath>{' '}
            καθορίζεται <em>πλήρως</em> από το <InlineMath>X</InlineMath> (πιο
            εξαρτημένα δεν γίνεται), κι όμως{' '}
            <InlineMath>{'\\mathrm{Cov}(X,Y) = 0'}</InlineMath>. Υπάρχει{' '}
            <strong>μία</strong> οικογένεια όπου η συνεπαγωγή ισχύει: οι{' '}
            <strong>από κοινού (jointly) Gaussian</strong> μεταβλητές — προσοχή, όχι
            «η καθεμιά χωριστά Gaussian», αλλά η <em>από κοινού</em> κατανομή τους
            Gaussian. Και αυτό ακριβώς είναι ο λευκός Gaussian θόρυβος: κάθε
            πεπερασμένη ομάδα δειγμάτων του είναι από κοινού Gaussian. Άρα εδώ —{' '}
            <em>και μόνο επειδή η απάντηση βγήκε «Gaussian»</em> — τα ασυσχέτιστα
            δείγματα αναβαθμίζονται σε <strong>ανεξάρτητα</strong>: τα δείγματα του
            λευκού Gaussian θορύβου είναι <strong>iid</strong>{' '}
            <InlineMath>{'\\mathcal{N}(0, \\sigma^2)'}</InlineMath> (independent and
            identically distributed — ανεξάρτητα και ισόνομα). Το «ξέρω το{' '}
            <InlineMath>{'N(t_i)'}</InlineMath>» δεν σου δίνει <em>καμία</em>{' '}
            πληροφορία για το <InlineMath>{'N(t_j)'}</InlineMath>.
          </span>
        </div>

        <p>
          <strong>
            Βήμα 5 — η λεπτομέρεια που χωρίζει το «σχήμα» από το «πλάτος» της
            καμπάνας.
          </strong>{' '}
          Το σχήμα το ξέρουμε πλέον. Πόσο φαρδιά όμως είναι; Για ΤΔ μηδενικής μέσης
          τιμής η διακύμανση είναι η ΣΑΣ στο μηδέν:
        </p>

        <BlockMath>{'\\sigma^2 \\;=\\; E[N^2(t)] \\;=\\; R_N(0) \\;=\\; \\frac{N_0}{2}\\,\\delta(0) \\;=\\; \\infty'}</BlockMath>

        <p>
          Για τον <strong>ιδανικό</strong> λευκό θόρυβο η καμπάνα βγαίνει απείρως
          φαρδιά — που είναι απλώς μια δεύτερη όψη του γνωστού παραδόξου ότι ο λευκός
          θόρυβος έχει άπειρη ισχύ. Δεν είναι λάθος στον υπολογισμό· είναι υπενθύμιση
          ότι ο τελείως επίπεδος θόρυβος είναι <strong>μαθηματικό μοντέλο</strong>,
          όχι φυσικό αντικείμενο. Το σχήμα (Gaussian) στέκει· το πλάτος γίνεται
          πεπερασμένο μόλις μπει στη μέση ένα πραγματικό εύρος ζώνης — και κάθε δέκτης
          βάζει ένα. Μέσα από ιδανικό φίλτρο που περνάει{' '}
          <InlineMath>{'|f| \\le W'}</InlineMath>:
        </p>

        <BlockMath>{'\\sigma^2 \\;=\\; P_N \\;=\\; \\int_{-W}^{W}\\frac{N_0}{2}\\,df \\;=\\; N_0 W'}</BlockMath>

        <p>
          <strong>Προσοχή σε μια σύμβαση που κρύβεται εδώ.</strong> Η γραμμή{' '}
          <InlineMath>{'\\sigma^2 = N_0 W'}</InlineMath> γράφτηκε στην{' '}
          <em>κανονικοποιημένη</em> γραφή — αυτή που χρησιμοποιούμε παντού: μετράμε
          ισχύ σαν το σήμα να πέφτει πάνω σε αντίσταση{' '}
          <InlineMath>{'1\\,\\Omega'}</InlineMath>, οπότε «ισχύς» και{' '}
          <InlineMath>{'E[N^2(t)]'}</InlineMath> βγάζουν τον ίδιο αριθμό. Αν αντίθετα
          κρατήσεις τα Volt, τότε το <InlineMath>{'\\sigma^2'}</InlineMath> που
          μπαίνει μέσα στη ΣΠΠ είναι η διακύμανση της <em>τάσης</em> στα άκρα
          αντίστασης <InlineMath>R</InlineMath>,{' '}
          <InlineMath>{'\\sigma^2 = E[N^2(t)] = 4kTRW'}</InlineMath> Volts², και η
          ισχύς είναι <strong>άλλο μέγεθος</strong> — αυτή που παραδίδεται σε
          προσαρμοσμένο (matched) φορτίο:{' '}
          <InlineMath>{'P_N = E[N^2(t)]/(4R) = kTW = N_0 W'}</InlineMath> Watt, αφού{' '}
          <InlineMath>{'N_0 \\triangleq kT'}</InlineMath>. Το{' '}
          <InlineMath>{'4R'}</InlineMath> <em>δεν</em> είναι μετατροπή μονάδων· είναι
          ο διαιρέτης του matched load. Όποια γραφή κι αν διαλέξεις, το συμπέρασμα
          που μας ενδιαφέρει εδώ είναι το ίδιο: η καμπάνα αποκτά{' '}
          <em>πεπερασμένο</em> πλάτος μόλις μπει στη μέση ένα εύρος ζώνης.
        </p>

        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">✍️ Τι γράφεις στο γραπτό (7%)</strong>
          <ol className="ml-5 mt-1.5 list-decimal space-y-1 text-fg-muted">
            <li>
              <strong>Gaussian (κανονική) κατανομή, μηδενικής μέσης τιμής.</strong>{' '}
              Αυτή είναι η απάντηση που ζητάει κυριολεκτικά το ερώτημα.
            </li>
            <li>
              Ο τύπος:{' '}
              <InlineMath>{'f_{N(t_i)}(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-x^2/(2\\sigma^2)}'}</InlineMath>{' '}
              για κάθε <InlineMath>{'t_i'}</InlineMath> — <em>ίδια</em> κατανομή σε
              κάθε χρονική στιγμή.
            </li>
            <li>
              Η αιτιολόγηση σε μία γραμμή: <strong>θεώρημα κεντρικού ορίου</strong>{' '}
              (Central Limit Theorem, CLT) πάνω σε πλήθος ανεξάρτητων συνεισφορών
              ηλεκτρονίων — <em>όχι</em> από τη ΦΠΙ (φασματική πυκνότητα ισχύος).
            </li>
            <li>
              Μία γραμμή μπόνους που δείχνει ότι κατάλαβες τι κάνει το «λευκός»:{' '}
              <InlineMath>{'R_N(\\tau) = (N_0/2)\\delta(\\tau)'}</InlineMath> ⇒ τα
              δείγματα σε διαφορετικές στιγμές είναι ασυσχέτιστα, και επειδή είναι από
              κοινού Gaussian, <strong>ανεξάρτητα</strong>.
            </li>
          </ol>
          <p className="mt-1.5 text-fg-muted">
            Κομπιουτεράκι δεν χρειάζεται πουθενά εδώ — το ερώτημα είναι εξ ολοκλήρου
            εννοιολογικό, δεν βγαίνει κανένας αριθμός.
          </p>
        </div>

        <p className="text-sm text-fg-muted">
          <strong className="text-fg">Μην το μπερδέψεις με την αδελφή Σ/Λ παγίδα.</strong>{' '}
          Εδώ η απάντηση <em>είναι</em> «Gaussian» — αλλά επειδή το φυσικό μοντέλο του
          θερμικού θορύβου το επιβάλλει, όχι επειδή ο θόρυβος είναι λευκός. Όταν η
          εκφώνηση αντιστρέψει τη ροή και ισχυριστεί ότι «η ΦΠΙ ακολουθεί την κατανομή
          Gauss», η απάντηση είναι <strong>ΛΑΘΟΣ</strong> — δες{' '}
          <Link
            href="/practice#exercise:jan26-th1-3"
            className="text-accent underline-offset-2 hover:underline"
          >
            Ιαν. 2026 ΘΕΜΑ 1.3
          </Link>
          ,{' '}
          <Link
            href="/practice#exercise:pa25-th1-3"
            className="text-accent underline-offset-2 hover:underline"
          >
            Πρόοδος Α 2025 ΘΕΜΑ 1.3
          </Link>{' '}
          και{' '}
          <Link
            href="/practice#exercise:pb25-th1-3"
            className="text-accent underline-offset-2 hover:underline"
          >
            Πρόοδος Β 2025 ΘΕΜΑ 1.3
          </Link>
          . Οι δύο ορθογώνιοι άξονες αναλύονται στο{' '}
          <Link
            href="/noise/white-noise"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/white-noise §6–§7
          </Link>
          , η φυσική του CLT και ο ίδιος αυτός τύπος της ΣΠΠ στο{' '}
          <Link
            href="/noise/sources"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/sources §2–§3
          </Link>
          , και το «ασυσχέτιστα ⇒ ανεξάρτητα μόνο για jointly Gaussian» στο{' '}
          <Link
            href="/randomness/random-variables"
            className="text-accent underline-offset-2 hover:underline"
          >
            /randomness/random-variables §5β και §6δ
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th1-6',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 1.6',
    paperPage: 1,
    weight: 7,
    title: 'ΣΑΣ λευκού θορύβου μέσα από ιδανικό ζωνοπερατό φίλτρο',
    topic: 'noise',
    difficulty: 'medium',
    prerequisites: ['noise/white-noise', 'noise/through-filters', 'randomness/psd', 'foundations/filters'],
    formulaIds: ['white-noise-psd', 'lti-output-psd', 'wiener-khinchin', 'fourier-pair-rect', 'fourier-modulation-theorem', 'bandpass-noise-r', 'bandlimited-noise-autocorr'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο.</strong>{' '}
        Το επίσημο τυπολόγιο δεν έχει <em>καμία</em> γραμμή θορύβου. Απέξω
        γράφεις: την PSD του λευκού θορύβου{' '}
        <InlineMath>{'S_X(f) = N_0/2'}</InlineMath> (εδώ σου τη δίνει η
        εκφώνηση — αλλού όχι), τον νόμο εξόδου LTI{' '}
        <InlineMath>{'S_Y(f) = |H(f)|^2 S_X(f)'}</InlineMath>, το ότι η ΣΑΣ
        (Συνάρτηση Αυτοσυσχέτισης) βγαίνει ως αντίστροφος Fourier της PSD{' '}
        <InlineMath>{'R_Y(\\tau) = \\mathcal{F}^{-1}\\{S_Y(f)\\}'}</InlineMath>{' '}
        (Wiener–Khinchin ανάποδα), και το τελικό{' '}
        <InlineMath>{'R_Y(\\tau) = N_0 W\\,\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c \\tau)'}</InlineMath>.
        Την ίδια συνταγή δύο βημάτων («PSD μέσα από{' '}
        <InlineMath>{'|H|^2'}</InlineMath>, μετά αντίστροφος Fourier ή
        ολοκλήρωμα») τη χρειάστηκες ήδη στο{' '}
        <Link
          href="/practice#exercise:proodos26-6"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδος Απρ.2026 ΘΕΜΑ 6
        </Link>{' '}
        και στο{' '}
        <Link
          href="/practice#exercise:sept25-th3-11"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ.2025 ΘΕΜΑ 3.11
        </Link>{' '}
        — και τα δύο όμως σταματούν στην <em>ισχύ</em> ενός{' '}
        <em>χαμηλοπερατού</em>. Το{' '}
        <Link
          href="/practice#exercise:jun25-th1-10"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν.2025 ΘΕΜΑ 1.10
        </Link>{' '}
        είναι το μόνο άλλο που ζητά ΣΑΣ, πάλι χαμηλοπερατού, οπότε εκεί βγαίνει
        σκέτο sinc <em>χωρίς</em> συνημίτονο — η διαφορά δουλεύεται αναλυτικά
        στη λύση.{' '}
        <strong>Καλά νέα:</strong> τα δύο εργαλεία που κάνουν την πραγματική
        δουλειά <em>είναι</em> στο τυπολόγιο — το ζεύγος{' '}
        <InlineMath>{'\\Pi(t/T) \\leftrightarrow T\\,\\mathrm{sinc}(fT)'}</InlineMath>{' '}
        και το θεώρημα διαμόρφωσης{' '}
        <InlineMath>{'x(t)\\cos(2\\pi f_c t) \\leftrightarrow \\tfrac{1}{2}[X(f-f_c)+X(f+f_c)]'}</InlineMath>.
        Μάθε να τα διαβάζεις <em>ανάποδα</em>, από τη συχνότητα προς τον χρόνο,
        και γλιτώνεις όλο το ολοκλήρωμα.
      </>
    ),
    statement: (
      <p>
        Έστω <InlineMath>{'X(t)'}</InlineMath> μια λευκή Gaussian διαδικασία με
        ΦΠΙ (Φασματική Πυκνότητα Ισχύος — PSD){' '}
        <InlineMath>{'S_X(f) = N_0/2'}</InlineMath>. Να βρεθεί η ΣΑΣ (Συνάρτηση
        Αυτοσυσχέτισης — autocorrelation function) της εξόδου ενός ιδανικού
        ζωνοπερατού φίλτρου με εύρος ζώνης <InlineMath>W</InlineMath>, το οποίο
        έχει σαν είσοδο τη <InlineMath>{'X(t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm">
          <p>
            <strong className="text-fg">
              Πρώτα η παραδοχή — η εκφώνηση αφήνει δύο τρύπες.
            </strong>{' '}
            <span className="text-fg-muted">
              (α) Δεν δίνει κεντρική συχνότητα· θα τη λέμε{' '}
              <InlineMath>{'f_c'}</InlineMath> και θα μείνει σύμβολο στην
              απάντηση. (β) Το «εύρος ζώνης <InlineMath>W</InlineMath>» ενός
              ζωνοπερατού φίλτρου σηκώνει δύο αναγνώσεις: <em>συνολικό</em>{' '}
              πλάτος της ζώνης διέλευσης, ή πλάτος <InlineMath>W</InlineMath>{' '}
              <em>εκατέρωθεν</em> του <InlineMath>{'f_c'}</InlineMath>. Κρατάμε
              την πρώτη, και τη δηλώνουμε με <em>όρια</em>, όχι με λέξεις — γιατί
              οι λέξεις είναι ακριβώς εκεί που γίνεται η ζημιά: το{' '}
              <InlineMath>W</InlineMath> είναι το πλάτος της{' '}
              <strong>κάθε μιας</strong> από τις δύο ζώνες διέλευσης (μία γύρω από
              το <InlineMath>{'+f_c'}</InlineMath>, η κατοπτρική της γύρω από το{' '}
              <InlineMath>{'-f_c'}</InlineMath>), άρα συνολικό φάσμα{' '}
              <InlineMath>{'2W'}</InlineMath> — η ίδια σύμβαση με την οποία
              δουλεύεται το πρόβλημα και στα φίλτρα θορύβου:
            </span>
          </p>
          <BlockMath>{'H(f) = \\begin{cases} 1, & f_c - \\frac{W}{2} \\le |f| \\le f_c + \\frac{W}{2} \\\\ 0, & \\text{αλλού} \\end{cases}'}</BlockMath>
          <p className="text-fg-muted">
            Γράψε αυτή τη γραμμή <strong className="text-fg">πρώτη</strong> στο
            γραπτό σου: χωρίς αυτήν, ένας παράγοντας 2 στην απάντηση δεν μπορεί
            να κριθεί σωστός ή λάθος. Η άλλη ανάγνωση δουλεύεται στο τέλος,
            ώστε να έχεις και τις δύο απαντήσεις.
          </p>
        </div>

        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα.</strong>{' '}
          <span className="text-fg-muted">
            Ο λευκός θόρυβος είναι ένα ατελείωτο, επίπεδο πάτωμα ισχύος ύψους{' '}
            <InlineMath>{'N_0/2'}</InlineMath> σε <em>κάθε</em> συχνότητα. Το
            ιδανικό φίλτρο δεν αλλάζει το ύψος του πατώματος — απλώς αποφασίζει{' '}
            <em>ποιο κομμάτι</em> του άξονα επιβιώνει. Ένα χαμηλοπερατό κρατάει{' '}
            <strong>μία</strong> λωρίδα γύρω από το μηδέν. Ένα ζωνοπερατό
            κρατάει <strong>δύο</strong>: μία γύρω από το{' '}
            <InlineMath>{'+f_c'}</InlineMath> και την κατοπτρική της γύρω από
            το <InlineMath>{'-f_c'}</InlineMath> (το φάσμα μιας πραγματικής
            διαδικασίας είναι πάντα συμμετρικό). Αυτή η{' '}
            <strong>μετατόπιση</strong> είναι όλο το καινούργιο στοιχείο του
            προβλήματος: μετατοπισμένο φάσμα σημαίνει σήμα που{' '}
            <em>ταλαντώνεται</em> στον χρόνο. Περιμένουμε λοιπόν την ίδια
            «καμπάνα» sinc που δίνει και το χαμηλοπερατό, αλλά γεμισμένη με ένα
            συνημίτονο στα <InlineMath>{'f_c'}</InlineMath>.
          </span>
        </div>

        <p>
          <strong>Βήμα 1 — η PSD της εξόδου.</strong> Όταν μια WSS τυχαία
          διαδικασία περνά από γραμμικό χρονικά-αμετάβλητο (LTI) φίλτρο, κάθε
          συχνότητα πολλαπλασιάζεται σε <em>πλάτος</em> με{' '}
          <InlineMath>{'H(f)'}</InlineMath>, άρα σε <em>ισχύ</em> με{' '}
          <InlineMath>{'|H(f)|^2'}</InlineMath>:
        </p>
        <BlockMath>{'S_Y(f) = |H(f)|^2\\,S_X(f)'}</BlockMath>
        <p>
          Για ιδανικό φίλτρο το <InlineMath>{'|H(f)|^2'}</InlineMath> είναι
          μόνο <InlineMath>0</InlineMath> ή <InlineMath>1</InlineMath>, οπότε η
          έξοδος είναι το ίδιο επίπεδο <InlineMath>{'N_0/2'}</InlineMath>{' '}
          κομμένο στις δύο ζώνες διέλευσης:
        </p>
        <BlockMath>{'S_Y(f) = \\begin{cases} \\dfrac{N_0}{2}, & f_c - \\frac{W}{2} \\le |f| \\le f_c + \\frac{W}{2} \\\\ 0, & \\text{αλλού} \\end{cases}'}</BlockMath>

        <figure className="my-4">
          <NoiseFilterShapingViz />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Διάλεξε <strong>«Ιδανικό BPF»</strong>: αριστερά το επίπεδο{' '}
            <InlineMath>{'S_X = N_0/2'}</InlineMath>, στη μέση η μάσκα{' '}
            <InlineMath>{'|H|^2'}</InlineMath> με τις <em>δύο</em> ζώνες, δεξιά
            η σκιασμένη έξοδος. Ένα σύμβολο θέλει προσοχή: το σχήμα γράφει
            «ΔΒ = 0,15» και αυτό είναι το <em>μισό</em> πλάτος της κάθε ζώνης,
            οπότε το <InlineMath>W</InlineMath> της άσκησης αντιστοιχεί εδώ σε
            0,30. Καθώς μετακινείς το <InlineMath>{'f_c'}</InlineMath> στο μεσαίο
            κομμάτι της διαδρομής, η ένδειξη <InlineMath>{'P_Y'}</InlineMath>{' '}
            <strong>δεν αλλάζει</strong> — ακριβώς επειδή το συνολικό πλάτος που
            περνάει μένει το ίδιο. Στα δύο άκρα του slider πέφτει, αλλά όχι για
            φυσικό λόγο: εκεί η ζώνη είτε βγαίνει έξω από τον σχεδιασμένο άξονα
            είτε διπλώνει πάνω στο μηδέν. Αυτό είναι το πρώτο
            βήμα μόνο — το σχήμα της ΣΑΣ που ζητά η άσκηση βγαίνει από εδώ με
            αντίστροφο Fourier, στο επόμενο βήμα. Η πλήρης αναλυτική απαγωγή
            ζει στο{' '}
            <Link
              href="/noise/through-filters"
              className="text-accent underline-offset-2 hover:underline"
            >
              /noise/through-filters §8
            </Link>
            .
          </figcaption>
        </figure>

        <p>
          <strong>Βήμα 2 — γιατί επιτρέπεται να γυρίσουμε από την PSD στη ΣΑΣ.</strong>{' '}
          Η έξοδος ενός LTI φίλτρου με WSS είσοδο είναι κι αυτή WSS — άρα
          ορίζεται <InlineMath>{'R_Y(\\tau)'}</InlineMath> και ισχύει το
          θεώρημα Wiener–Khinchin: PSD και ΣΑΣ είναι ζεύγος Fourier. Το
          διαβάζουμε ανάποδα:
        </p>
        <BlockMath>{'R_Y(\\tau) = \\mathcal{F}^{-1}\\{S_Y(f)\\} = \\int_{-\\infty}^{\\infty} S_Y(f)\\,e^{j 2\\pi f \\tau}\\,df'}</BlockMath>
        <p>
          Με απλά λόγια: η ΣΑΣ δεν είναι κάτι καινούργιο που πρέπει να
          υπολογιστεί από την αρχή — είναι η <em>ίδια πληροφορία</em> με την
          PSD, γραμμένη στον άξονα του χρόνου αντί για τον άξονα της
          συχνότητας.
        </p>

        <p>
          <strong>
            Βήμα 3 — ο σύντομος δρόμος: δύο γραμμές του τυπολογίου, μηδέν
            ολοκληρώματα.
          </strong>{' '}
          Γράψε την <InlineMath>{'S_Y'}</InlineMath> ως ένα{' '}
          <em>baseband</em> ορθογώνιο πλάτους <InlineMath>W</InlineMath> που
          έχει αντιγραφεί στο <InlineMath>{'+f_c'}</InlineMath> και στο{' '}
          <InlineMath>{'-f_c'}</InlineMath>:
        </p>
        <BlockMath>{'S_Y(f) = \\frac{N_0}{2}\\left[\\Pi\\!\\left(\\frac{f-f_c}{W}\\right) + \\Pi\\!\\left(\\frac{f+f_c}{W}\\right)\\right]'}</BlockMath>
        <p>
          Ονόμασε <InlineMath>{'G(f) = \\frac{N_0}{2}\\,\\Pi\\!\\left(\\frac{f}{W}\\right)'}</InlineMath>{' '}
          το ένα ορθογώνιο <em>πριν</em> τη μετατόπιση. Το ζεύγος
          rect ↔ sinc του τυπολογίου, διαβασμένο από τη συχνότητα προς τον
          χρόνο (ορθογώνιο πλάτους <InlineMath>W</InlineMath> στο{' '}
          <InlineMath>f</InlineMath> ⟶ sinc στο{' '}
          <InlineMath>{'\\tau'}</InlineMath>), δίνει:
        </p>
        <BlockMath>{'G(f) = \\frac{N_0}{2}\\,\\Pi\\!\\left(\\frac{f}{W}\\right) \\;\\longleftrightarrow\\; g(\\tau) = \\frac{N_0 W}{2}\\,\\mathrm{sinc}(W\\tau)'}</BlockMath>
        <p>
          (Σύμβαση της σελίδας — και του τυπολογίου:{' '}
          <InlineMath>{'\\mathrm{sinc}(x) = \\dfrac{\\sin(\\pi x)}{\\pi x}'}</InlineMath>,
          δηλαδή μηδενίζεται στους ακέραιους. Αν χρησιμοποιήσεις την άλλη
          σύμβαση <InlineMath>{'\\sin(x)/x'}</InlineMath>, τα μηδενικά σου
          πέφτουν αλλού.)
        </p>
        <p>
          Τώρα το θεώρημα διαμόρφωσης — πάλι ανάποδα. Το τυπολόγιο το γράφει{' '}
          <InlineMath>{'x(t)\\cos(2\\pi f_c t) \\leftrightarrow \\tfrac{1}{2}[X(f-f_c)+X(f+f_c)]'}</InlineMath>.
          Δηλαδή: <strong>δύο αντίγραφα ενός φάσματος στα{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath> είναι το ίδιο πράγμα με «η αρχική
          χρονική συνάρτηση επί ένα συνημίτονο στα{' '}
          <InlineMath>{'f_c'}</InlineMath>»</strong>. Η δική μας{' '}
          <InlineMath>{'S_Y'}</InlineMath> είναι ακριβώς{' '}
          <InlineMath>{'G(f-f_c)+G(f+f_c)'}</InlineMath>, δηλαδή{' '}
          <em>διπλάσια</em> από τη δεξιά μεριά του τύπου:
        </p>
        <BlockMath>{'R_Y(\\tau) = 2\\,g(\\tau)\\,\\cos(2\\pi f_c \\tau) = 2\\cdot\\frac{N_0 W}{2}\\,\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c \\tau)'}</BlockMath>
        <BlockMath>{'\\boxed{\\;R_Y(\\tau) = N_0 W\\,\\mathrm{sinc}(W\\tau)\\,\\cos(2\\pi f_c \\tau)\\;}'}</BlockMath>
        <p>
          <strong>Τι λέει πραγματικά αυτή η γραμμή:</strong> ο θόρυβος στην
          έξοδο «θυμάται» τον εαυτό του για περίπου{' '}
          <InlineMath>{'1/W'}</InlineMath> δευτερόλεπτα — αυτό είναι το εύρος
          της περιβάλλουσας sinc — και μέσα σε αυτό το παράθυρο μνήμης
          ταλαντώνεται με τον ρυθμό του φέροντος{' '}
          <InlineMath>{'f_c'}</InlineMath>. Όσο πιο στενό το φίλτρο, τόσο πιο
          «αργός» και πιο προβλέψιμος ο θόρυβος.
        </p>

        <figure className="my-4">
          <svg
            viewBox="0 0 580 215"
            className="w-full"
            role="img"
            aria-label="Η ΣΑΣ ζωνοπερατού λευκού θορύβου: περιβάλλουσα sinc με συνημιτονοειδή ταλάντωση στο f_c"
          >
            <line x1="25" y1="105" x2="556" y2="105" stroke="currentColor" strokeOpacity="0.35" />
            <polygon points="564,105 554,101 554,109" fill="currentColor" fillOpacity="0.45" />
            <text x="552" y="96" fontSize="11" fill="currentColor" fillOpacity="0.7" fontStyle="italic">τ</text>
            <text x="30" y="46" fontSize="10.5" fill="rgb(217,119,6)">περιβάλλουσα ± N₀W·sinc(Wτ)</text>
            <polyline
              fill="none"
              stroke="rgb(217,119,6)"
              strokeOpacity="0.85"
              strokeWidth="1.4"
              strokeDasharray="5 4"
              points="40,105 50,108.1 60,111.3 70,114.3 80,117 90,119.2 100,120.7 110,121.3 120,120.9 130,119.4 140,116.7 150,112.8 160,107.9 170,101.9 180,95 190,87.5 200,79.5 210,71.2 220,63.1 230,55.4 240,48.2 250,42 260,36.9 270,33.1 280,30.8 290,30 300,30.8 310,33.1 320,36.9 330,42 340,48.2 350,55.4 360,63.1 370,71.2 380,79.5 390,87.5 400,95 410,101.9 420,107.9 430,112.8 440,116.7 450,119.4 460,120.9 470,121.3 480,120.7 490,119.2 500,117 510,114.3 520,111.3 530,108.1 540,105"
            />
            <polyline
              fill="none"
              stroke="rgb(217,119,6)"
              strokeOpacity="0.85"
              strokeWidth="1.4"
              strokeDasharray="5 4"
              transform="matrix(1 0 0 -1 0 210)"
              points="40,105 50,108.1 60,111.3 70,114.3 80,117 90,119.2 100,120.7 110,121.3 120,120.9 130,119.4 140,116.7 150,112.8 160,107.9 170,101.9 180,95 190,87.5 200,79.5 210,71.2 220,63.1 230,55.4 240,48.2 250,42 260,36.9 270,33.1 280,30.8 290,30 300,30.8 310,33.1 320,36.9 330,42 340,48.2 350,55.4 360,63.1 370,71.2 380,79.5 390,87.5 400,95 410,101.9 420,107.9 430,112.8 440,116.7 450,119.4 460,120.9 470,121.3 480,120.7 490,119.2 500,117 510,114.3 520,111.3 530,108.1 540,105"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.9"
              strokeWidth="1.6"
              d="M 40 105 L 50.4 105 Q 60.8 92 71.3 105 Q 81.7 129.8 92.1 105 Q 102.5 73.2 112.9 105 Q 123.3 136 133.8 105 Q 144.2 84.5 154.6 105 Q 165 105 175.4 105 Q 185.8 133.6 196.3 105 Q 206.7 43 217.1 105 Q 227.5 200.5 237.9 105 Q 248.3 -19 258.8 105 Q 269.2 248.2 279.6 105 Q 290 -45 300.4 105 Q 310.8 248.2 321.3 105 Q 331.7 -19 342.1 105 Q 352.5 200.5 362.9 105 Q 373.3 43 383.8 105 Q 394.2 133.6 404.6 105 Q 415 105 425.4 105 Q 435.8 84.5 446.3 105 Q 456.7 136 467.1 105 Q 477.5 73.2 487.9 105 Q 498.3 129.8 508.8 105 Q 519.2 92 529.6 105 L 540 105"
            />
            <circle cx="290" cy="30" r="3.2" fill="rgb(217,119,6)" />
            <text x="298" y="27" fontSize="11" fill="currentColor" fillOpacity="0.85">R_Y(0) = N₀W</text>
            <line x1="165" y1="105" x2="165" y2="190" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" />
            <line x1="415" y1="105" x2="415" y2="190" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" />
            <text x="165" y="204" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.7">−1/W</text>
            <text x="415" y="204" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.7">+1/W</text>
            <text x="40" y="204" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.55">−2/W</text>
            <text x="540" y="204" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.55">+2/W</text>
          </svg>
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η απάντηση σε σχήμα: η διακεκομμένη καμπάνα είναι η περιβάλλουσα{' '}
            <InlineMath>{'\\pm N_0 W\\,\\mathrm{sinc}(W\\tau)'}</InlineMath> — μηδενίζεται
            στα <InlineMath>{'\\tau = \\pm 1/W,\\, \\pm 2/W,\\ldots'}</InlineMath> —
            και η συνεχής γραμμή είναι η ΣΑΣ, δηλαδή η περιβάλλουσα{' '}
            <em>γεμισμένη</em> με το{' '}
            <InlineMath>{'\\cos(2\\pi f_c \\tau)'}</InlineMath>. Το ύψος στο{' '}
            <InlineMath>{'\\tau = 0'}</InlineMath> είναι η ισχύς,{' '}
            <InlineMath>{'N_0 W'}</InlineMath>. Το σχήμα είναι σχεδιασμένο με{' '}
            <InlineMath>{'f_c = 3W'}</InlineMath> για να ξεχωρίζουν οι
            ταλαντώσεις· σε πραγματικό δέκτη{' '}
            <InlineMath>{'f_c \\gg W'}</InlineMath> και οι ταλαντώσεις είναι
            πολύ πυκνότερες μέσα στην ίδια ακριβώς περιβάλλουσα.
          </figcaption>
        </figure>

        <p>
          <strong>Βήμα 4 — ο έλεγχος με το ολοκλήρωμα</strong> (αν στην εξέταση
          δεν θυμάσαι το θεώρημα διαμόρφωσης, αυτός είναι ο μακρύς αλλά σίγουρος
          δρόμος). Η <InlineMath>{'S_Y'}</InlineMath> είναι πραγματική και
          άρτια, άρα οι συνεισφορές των δύο ζωνών είναι συζυγείς μιγαδικοί: το
          άθροισμά τους ισούται με το διπλάσιο του πραγματικού μέρους, δηλαδή
          αντικαθιστάς το <InlineMath>{'e^{j2\\pi f\\tau}'}</InlineMath> με{' '}
          <InlineMath>{'\\cos(2\\pi f \\tau)'}</InlineMath> και ολοκληρώνεις
          μόνο στη θετική ζώνη, επί 2:
        </p>
        <BlockMath>{'R_Y(\\tau) = 2\\int_{f_c - W/2}^{f_c + W/2} \\frac{N_0}{2}\\cos(2\\pi f \\tau)\\,df = \\frac{N_0}{2\\pi\\tau}\\Big[\\sin\\big(2\\pi(f_c + \\tfrac{W}{2})\\tau\\big) - \\sin\\big(2\\pi(f_c - \\tfrac{W}{2})\\tau\\big)\\Big]'}</BlockMath>
        <p>
          Η αγκύλη είναι διαφορά ημιτόνων, και η ταυτότητα{' '}
          <InlineMath>{'\\sin A - \\sin B = 2\\cos\\frac{A+B}{2}\\sin\\frac{A-B}{2}'}</InlineMath>{' '}
          είναι ακριβώς αυτή που ξεχωρίζει το «κέντρο» από το «πλάτος»: εδώ{' '}
          <InlineMath>{'\\frac{A+B}{2} = 2\\pi f_c \\tau'}</InlineMath> (το
          κέντρο της ζώνης) και{' '}
          <InlineMath>{'\\frac{A-B}{2} = \\pi W \\tau'}</InlineMath> (το μισό
          του πλάτους της):
        </p>
        <BlockMath>{'R_Y(\\tau) = \\frac{N_0}{2\\pi\\tau}\\cdot 2\\cos(2\\pi f_c \\tau)\\sin(\\pi W \\tau) = N_0\\,\\cos(2\\pi f_c\\tau)\\,\\frac{\\sin(\\pi W \\tau)}{\\pi \\tau}'}</BlockMath>
        <p>
          Πολλαπλασιάζοντας και διαιρώντας με <InlineMath>W</InlineMath>{' '}
          εμφανίζεται το κανονικοποιημένο sinc,{' '}
          <InlineMath>{'\\frac{\\sin(\\pi W\\tau)}{\\pi\\tau} = W\\,\\mathrm{sinc}(W\\tau)'}</InlineMath>,
          και βγαίνει το ίδιο αποτέλεσμα με το Βήμα 3. Το ότι η «γρήγορη» και η
          «αργή» διαδρομή συμφωνούν είναι ο έλεγχός σου.
        </p>

        <p>
          <strong>Βήμα 5 — τι άλλο μπορείς να πεις δωρεάν.</strong> Θέτοντας{' '}
          <InlineMath>{'\\tau = 0'}</InlineMath> στη ΣΑΣ παίρνεις την ισχύ
          (γιατί <InlineMath>{'R_Y(0) = E[Y^2(t)]'}</InlineMath>):
        </p>
        <BlockMath>{'P_Y = R_Y(0) = N_0 W\\,\\mathrm{sinc}(0)\\cos(0) = N_0 W'}</BlockMath>
        <p>
          Έλεγχος με το «εμβαδόν»: ύψος <InlineMath>{'N_0/2'}</InlineMath> επί
          το <em>συνολικό</em> φάσμα που περνάει — δύο ζώνες πλάτους{' '}
          <InlineMath>W</InlineMath> η καθεμία, δηλαδή{' '}
          <InlineMath>{'2W'}</InlineMath> — δίνει{' '}
          <InlineMath>{'\\frac{N_0}{2}\\cdot 2W = N_0 W'}</InlineMath>. Ταιριάζει.
          Πρόσεξε ότι το <InlineMath>{'f_c'}</InlineMath> <em>δεν</em> εμφανίζεται
          στην ισχύ: η μεταφορά μιας ζώνης πάνω-κάτω στον άξονα δεν αλλάζει
          εμβαδόν. Τέλος, επειδή η είσοδος είναι Gaussian και το φίλτρο
          γραμμικό, η έξοδος παραμένει Gaussian — άρα{' '}
          <InlineMath>{'Y(t)'}</InlineMath> είναι WSS Gaussian διαδικασία με
          μηδενική μέση τιμή και διασπορά{' '}
          <InlineMath>{'\\sigma_Y^2 = N_0 W'}</InlineMath>. Αυτή η πρόταση
          αξίζει μονάδες και κοστίζει μία γραμμή.
        </p>

        <p>
          <strong>Πού ακριβώς διαφέρει από το χαμηλοπερατό.</strong> Η αιτία
          είναι ένα και μόνο βήμα: το <em>σχήμα</em> της{' '}
          <InlineMath>{'S_Y'}</InlineMath> που μπαίνει στον αντίστροφο Fourier.
          Στο χαμηλοπερατό με συχνότητα αποκοπής <InlineMath>W</InlineMath> η{' '}
          <InlineMath>{'S_Y'}</InlineMath> είναι <em>ένα</em> συνεχόμενο
          ορθογώνιο πλάτους <InlineMath>{'2W'}</InlineMath> κεντραρισμένο στο
          μηδέν, οπότε ο αντίστροφος Fourier δίνει{' '}
          <InlineMath>{'N_0 W\\,\\mathrm{sinc}(2W\\tau)'}</InlineMath>: το
          όρισμα του sinc είναι το πλάτος του κομματιού, και δεν υπάρχει
          μετατόπιση, άρα δεν υπάρχει συνημίτονο. Άλλαξε μόνο αυτό — σπάσε το
          ίδιο συνολικό φάσμα σε <em>δύο</em> κομμάτια πλάτους{' '}
          <InlineMath>W</InlineMath> και μετάφερέ τα στα{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath> — και προκύπτουν δύο αλλαγές:
          το όρισμα του sinc γίνεται <InlineMath>{'W\\tau'}</InlineMath> αντί{' '}
          <InlineMath>{'2W\\tau'}</InlineMath> (κάθε κομμάτι είναι πια το μισό
          σε πλάτος, άρα η περιβάλλουσα διπλάσια σε διάρκεια), και η μετατόπιση
          προσθέτει τον παράγοντα{' '}
          <InlineMath>{'\\cos(2\\pi f_c \\tau)'}</InlineMath>.
        </p>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left">Ιδανικό φίλτρο</th>
              <th className="py-2 text-left">ΣΑΣ εξόδου</th>
              <th className="py-2 text-left">1ο μηδενικό περιβάλλουσας</th>
              <th className="py-2 text-left">Ισχύς</th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr>
              <td>Χαμηλοπερατό, αποκοπή <InlineMath>W</InlineMath></td>
              <td><InlineMath>{'N_0 W\\,\\mathrm{sinc}(2W\\tau)'}</InlineMath></td>
              <td><InlineMath>{'1/(2W)'}</InlineMath></td>
              <td><InlineMath>{'N_0 W'}</InlineMath></td>
            </tr>
            <tr>
              <td>Ζωνοπερατό, εύρος <InlineMath>W</InlineMath> στο <InlineMath>{'\\pm f_c'}</InlineMath></td>
              <td><InlineMath>{'N_0 W\\,\\mathrm{sinc}(W\\tau)\\cos(2\\pi f_c\\tau)'}</InlineMath></td>
              <td><InlineMath>{'1/W'}</InlineMath></td>
              <td><InlineMath>{'N_0 W'}</InlineMath></td>
            </tr>
          </tbody>
        </table>
        <p>
          Δηλαδή <strong>ίδια ισχύς, διαφορετική μνήμη</strong>: ίδιο συνολικό
          φάσμα σημαίνει ίδιο εμβαδόν, αλλά ο ζωνοπερατός θόρυβος
          αποσυσχετίζεται δύο φορές πιο αργά και ταλαντώνεται. Η επόμενη σελίδα
          που πατάει ακριβώς πάνω σε αυτό είναι η{' '}
          <Link
            href="/noise/bandpass"
            className="text-accent underline-offset-2 hover:underline"
          >
            /noise/bandpass
          </Link>
          , όπου το ίδιο <InlineMath>{'R_Y'}</InlineMath> παραγοντοποιείται σε
          I/Q μορφή και δείχνει ότι ο ζωνοπερατός θόρυβος «είναι» δύο baseband
          θόρυβοι πάνω σε φέρον.
        </p>

        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Η άλλη ανάγνωση του «εύρος ζώνης <InlineMath>W</InlineMath>».
          </strong>{' '}
          <span className="text-fg-muted">
            Αν εννοείται <InlineMath>W</InlineMath> <em>εκατέρωθεν</em> του{' '}
            <InlineMath>{'f_c'}</InlineMath>, δηλαδή ζώνη διέλευσης{' '}
            <InlineMath>{'f_c - W \\le |f| \\le f_c + W'}</InlineMath>, τότε κάθε
            κομμάτι έχει πλάτος <InlineMath>{'2W'}</InlineMath>. Δεν
            ξαναϋπολογίζεις τίποτα: παντού όπου είχες{' '}
            <InlineMath>W</InlineMath> βάζεις{' '}
            <InlineMath>{'2W'}</InlineMath>, οπότε{' '}
            <InlineMath>{'R_Y(\\tau) = 2N_0 W\\,\\mathrm{sinc}(2W\\tau)\\cos(2\\pi f_c\\tau)'}</InlineMath>{' '}
            και <InlineMath>{'P_Y = 2 N_0 W'}</InlineMath>. Η δομή της απάντησης
            (sinc επί συνημίτονο) είναι πανομοιότυπη — αλλάζει μόνο η κλίμακα.
            Γι' αυτό η μία γραμμή παραδοχής στην αρχή αξίζει όσο και το
            υπόλοιπο βήμα: με αυτήν, όποια σύμβαση κι αν είχε στο μυαλό του ο
            διορθωτής, η λύση σου διαβάζεται σωστή.
          </span>
        </div>

        <p>
          <strong>Κομπιουτεράκι:</strong> δεν χρειάζεται πουθενά — η άσκηση
          είναι εντελώς συμβολική, δεν δίνεται ούτε{' '}
          <InlineMath>{'N_0'}</InlineMath>, ούτε{' '}
          <InlineMath>{'f_c'}</InlineMath>, ούτε αριθμητικό{' '}
          <InlineMath>W</InlineMath>. Αν σε μια παραλλαγή σου δώσουν νούμερα, το
          μόνο που θέλει υπολογιστή είναι η τιμή του{' '}
          <InlineMath>{'\\mathrm{sinc}'}</InlineMath> σε κάποιο συγκεκριμένο{' '}
          <InlineMath>{'\\tau'}</InlineMath> — και τότε θυμήσου να βάλεις το
          κομπιουτεράκι σε <strong>radians</strong>, γιατί το όρισμα{' '}
          <InlineMath>{'\\pi W \\tau'}</InlineMath> είναι σε ακτίνια.
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th1-7',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 1.7',
    paperPage: 1,
    weight: 7,
    title: 'Ισχύς αρμονικού αθροίσματος Σ κAcos(2πκft)',
    topic: 'foundations',
    difficulty: 'medium',
    repeatGroup: 'power-sum-sinusoids',
    prerequisites: ['foundations/signals', 'foundations/fourier-series'],
    formulaIds: ['signal-power', 'cos-power-half', 'parseval-power', 'trig-prod-cos-cos', 'trig-double-cos'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        (α) η ισχύς ενός τόνου, <InlineMath>{'P = A^2/2'}</InlineMath>, και η γενίκευσή της για
        άθροισμα τόνων σε διαφορετικές συχνότητες,{' '}
        <InlineMath>{'P_x = \\sum_{\\kappa} A_\\kappa^2/2'}</InlineMath> (Parseval για Fourier
        series) — το τυπολόγιο δεν έχει ούτε ορισμό ισχύος ούτε Parseval· (β) το άθροισμα
        τετραγώνων{' '}
        <InlineMath>{'\\sum_{\\kappa=1}^{n}\\kappa^2 = \\frac{n(n+1)(2n+1)}{6}'}</InlineMath>,
        που είναι καθαρή άλγεβρα και λείπει κι αυτό.{' '}
        <strong>Αυτό που όντως βρίσκεις στο τυπολόγιο</strong> είναι οι δύο ταυτότητες{' '}
        <InlineMath>{'\\cos(x)\\cos(y) = \\tfrac{1}{2}[\\cos(x-y)+\\cos(x+y)]'}</InlineMath> και{' '}
        <InlineMath>{'\\cos^2(x) = \\tfrac{1}{2}[1+\\cos(2x)]'}</InlineMath> — δηλαδή τα εργαλεία
        της απόδειξης, όχι το συμπέρασμα. Το ίδιο εργαλείο χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:jan26-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 2.9
        </Link>{' '}
        και στο{' '}
        <Link
          href="/practice#exercise:pa25-th2-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Α 2025 ΘΕΜΑ 2.4
        </Link>.
      </>
    ),
    statement: (
      <p>
        Έστω το σήμα{' '}
        <InlineMath>{'x(t) = \\sum_{\\kappa=1}^{\\kappa=6} \\kappa A \\cos(2\\pi \\kappa f t)'}</InlineMath>.
        Να υπολογιστεί η ισχύς του <InlineMath>{'x(t)'}</InlineMath>.
      </p>
    ),
    solution: (
      <>
        <p>
          Πριν από οποιονδήποτε υπολογισμό, ας δούμε τι είναι στ&apos; αλήθεια αυτό το
          άθροισμα. Γράφοντας τους έξι όρους έναν-έναν:
        </p>
        <BlockMath>{'x(t) = A\\cos(2\\pi f t) + 2A\\cos(2\\pi\\,2f\\,t) + 3A\\cos(2\\pi\\,3f\\,t) + \\cdots + 6A\\cos(2\\pi\\,6f\\,t)'}</BlockMath>
        <p>
          Δηλαδή έξι καθαροί τόνοι. Ο <InlineMath>{'\\kappa'}</InlineMath>-οστός έχει συχνότητα{' '}
          <InlineMath>{'\\kappa f'}</InlineMath> και πλάτος{' '}
          <InlineMath>{'A_\\kappa = \\kappa A'}</InlineMath> — όσο ανεβαίνουμε σε αρμονική, τόσο
          δυναμώνει το πλάτος. Και οι έξι συχνότητες είναι ακέραια πολλαπλάσια της ίδιας
          θεμελιώδους <InlineMath>f</InlineMath>, άρα το <InlineMath>{'x(t)'}</InlineMath> είναι{' '}
          <strong>περιοδικό</strong> με περίοδο <InlineMath>{'T_0 = 1/f'}</InlineMath>: μέσα σε
          αυτό το διάστημα η πρώτη αρμονική κάνει έναν κύκλο, η δεύτερη δύο, …, η έκτη έξι.
        </p>
        <p>
          Επειδή είναι περιοδικό και δεν σβήνει ποτέ, η <em>ενέργειά</em> του είναι άπειρη — το
          μέγεθος που έχει νόημα εδώ είναι η <strong>ισχύς</strong>, δηλαδή η μέση τιμή του{' '}
          <InlineMath>{'x^2(t)'}</InlineMath> μέσα σε μία περίοδο:
        </p>
        <BlockMath>{'P_x = \\frac{1}{T_0}\\int_{0}^{T_0} x^2(t)\\, dt'}</BlockMath>
        <p>
          Το επόμενο βήμα είναι το μόνο που έχει πραγματικό περιεχόμενο: υψώνουμε στο τετράγωνο.
          Ένα άθροισμα έξι όρων στο τετράγωνο δίνει{' '}
          <InlineMath>{'6\\times 6 = 36'}</InlineMath> γινόμενα — 6 «διαγώνια»
          (<InlineMath>{'\\kappa = \\lambda'}</InlineMath>) και 30 «σταυρωτά»
          (<InlineMath>{'\\kappa \\neq \\lambda'}</InlineMath>):
        </p>
        <BlockMath>{'x^2(t) = \\sum_{\\kappa=1}^{6}\\sum_{\\lambda=1}^{6} (\\kappa A)(\\lambda A)\\,\\cos(2\\pi \\kappa f t)\\cos(2\\pi \\lambda f t)'}</BlockMath>
        <p>
          <strong>Γιατί πεθαίνουν τα 30 σταυρωτά.</strong> Αυτό δεν το δεχόμαστε επειδή «έτσι
          γίνεται» — το δείχνουμε. Για <InlineMath>{'\\kappa \\neq \\lambda'}</InlineMath>{' '}
          χρησιμοποιούμε την ταυτότητα γινομένου-σε-άθροισμα, που{' '}
          <strong>υπάρχει στο τυπολόγιο</strong>:
        </p>
        <BlockMath>{'\\cos(x)\\cos(y) = \\tfrac{1}{2}\\big[\\cos(x-y) + \\cos(x+y)\\big]'}</BlockMath>
        <p>
          Με <InlineMath>{'x = 2\\pi\\kappa f t'}</InlineMath> και{' '}
          <InlineMath>{'y = 2\\pi\\lambda f t'}</InlineMath> το γινόμενο γίνεται
        </p>
        <BlockMath>{'\\tfrac{1}{2}\\cos\\!\\big(2\\pi(\\kappa-\\lambda) f t\\big) \\;+\\; \\tfrac{1}{2}\\cos\\!\\big(2\\pi(\\kappa+\\lambda) f t\\big)'}</BlockMath>
        <p>
          Και τα δύο είναι πάλι cosines, σε συχνότητες που είναι <em>μη-μηδενικά</em> ακέραια
          πολλαπλάσια του <InlineMath>f</InlineMath> (αφού{' '}
          <InlineMath>{'\\kappa \\neq \\lambda'}</InlineMath>, το{' '}
          <InlineMath>{'\\kappa - \\lambda'}</InlineMath> δεν μηδενίζεται). Ένα τέτοιο cosine
          συμπληρώνει ακέραιο αριθμό ολόκληρων κύκλων μέσα στο{' '}
          <InlineMath>{'T_0'}</InlineMath>: όση επιφάνεια μαζεύει πάνω από το μηδέν, άλλη τόση
          χάνει από κάτω, οπότε το ολοκλήρωμά του σε μία περίοδο βγαίνει{' '}
          <strong>ακριβώς μηδέν</strong> — όχι «περίπου». Άρα και τα 30 σταυρωτά γινόμενα
          σβήνουν εντελώς.
        </p>
        <p>
          Αυτό ακριβώς εννοούμε λέγοντας ότι <strong>τόνοι σε διαφορετικές συχνότητες είναι
          ορθογώνιοι</strong>: δεν ανακατεύονται ενεργειακά, ο καθένας κουβαλάει τη δική του
          ισχύ και οι επιμέρους ισχύες προστίθενται. Στο frequency domain είναι το θεώρημα
          Parseval για Fourier series: το φάσμα έχει έξι ζευγάρια γραμμών, καμία δεν πέφτει πάνω
          σε άλλη, και η συνολική ισχύς είναι το άθροισμα της ισχύος κάθε γραμμής.
        </p>
        <p>
          <strong>Τα 6 διαγώνια.</strong> Για <InlineMath>{'\\kappa = \\lambda'}</InlineMath>{' '}
          μένει <InlineMath>{'(\\kappa A)^2\\cos^2(2\\pi\\kappa f t)'}</InlineMath>. Με την
          ταυτότητα <InlineMath>{'\\cos^2(x) = \\tfrac{1}{2}[1+\\cos(2x)]'}</InlineMath> (επίσης
          στο τυπολόγιο) το <InlineMath>{'\\cos^2'}</InlineMath> σπάει σε ένα σταθερό{' '}
          <InlineMath>{'1/2'}</InlineMath> συν έναν όρο{' '}
          <InlineMath>{'\\cos(2x)'}</InlineMath> που μηδενίζεται με το ίδιο ακριβώς επιχείρημα.
          Μένει λοιπόν μέση τιμή <InlineMath>{'1/2'}</InlineMath>, δηλαδή κάθε τόνος πλάτους{' '}
          <InlineMath>{'A_\\kappa'}</InlineMath> συνεισφέρει{' '}
          <InlineMath>{'A_\\kappa^2/2'}</InlineMath>:
        </p>
        <BlockMath>{'P_x = \\sum_{\\kappa=1}^{6} \\frac{(\\kappa A)^2}{2} = \\frac{A^2}{2}\\sum_{\\kappa=1}^{6}\\kappa^2'}</BlockMath>
        <p>
          <strong>Το άθροισμα των τετραγώνων.</strong> Μπορείς να το κάνεις και με το χέρι —{' '}
          <InlineMath>{'1+4+9+16+25+36 = 91'}</InlineMath> — αλλά στην εξέταση αξίζει ο κλειστός
          τύπος: είναι πιο γρήγορος, δεν σε αφήνει να χάσεις όρο, και δουλεύει για οποιοδήποτε{' '}
          <InlineMath>n</InlineMath> σου βάλουν:
        </p>
        <BlockMath>{'\\sum_{\\kappa=1}^{n}\\kappa^2 = \\frac{n(n+1)(2n+1)}{6} \\quad\\Longrightarrow\\quad \\sum_{\\kappa=1}^{6}\\kappa^2 = \\frac{6\\cdot 7\\cdot 13}{6} = 91'}</BlockMath>
        <p>
          <strong>⚠️ Η κλασική παγίδα:</strong> το{' '}
          <InlineMath>{'\\sum_{\\kappa=1}^{6}\\kappa^2 = 91'}</InlineMath> δεν έχει καμία σχέση
          με το{' '}
          <InlineMath>{'\\left(\\sum_{\\kappa=1}^{6}\\kappa\\right)^2 = 21^2 = 441'}</InlineMath>.
          Πρώτα υψώνεις κάθε πλάτος στο τετράγωνο, μετά αθροίζεις — ποτέ ανάποδα.
        </p>
        <p>Οπότε η ισχύς είναι:</p>
        <BlockMath>{'\\boxed{\\,P_x = \\frac{91\\,A^2}{2} = 45.5\\,A^2\\,}'}</BlockMath>
        <p>
          Δύο πράγματα αξίζει να προσέξεις στο αποτέλεσμα. Πρώτον, το{' '}
          <InlineMath>f</InlineMath> <strong>δεν εμφανίζεται πουθενά</strong>: όσο οι τόνοι
          κάθονται σε <em>διαφορετικές</em> συχνότητες — εδώ στις{' '}
          <InlineMath>{'f, 2f, \\ldots, 6f'}</InlineMath>, που είναι όντως έξι διαφορετικές
          για οποιοδήποτε <InlineMath>{'f \\neq 0'}</InlineMath> — η ισχύς εξαρτάται μόνο από
          τα πλάτη, όχι από το πού ακριβώς πέφτει η καθεμία στον άξονα συχνοτήτων. Αυτός
          είναι και ο λόγος που η εκφώνηση δεν σου δίνει τιμή για το{' '}
          <InlineMath>f</InlineMath> — δεν τη χρειάζεσαι, και δεν λείπει δεδομένο.
        </p>
        <p>
          Δεύτερον, επειδή τα πλάτη μεγαλώνουν με το <InlineMath>{'\\kappa'}</InlineMath>, η ισχύς
          είναι στοιβαγμένη στις ψηλές αρμονικές: μόνο η έκτη δίνει{' '}
          <InlineMath>{'(6A)^2/2 = 18A^2'}</InlineMath>, δηλαδή περισσότερα από τις τέσσερις
          πρώτες μαζί (<InlineMath>{'(1+4+9+16)A^2/2 = 15A^2'}</InlineMath>).
        </p>
        <p>
          <strong>Αριθμητικά:</strong> εδώ δεν χρειάζεσαι κομπιουτεράκι — το{' '}
          <InlineMath>{'6\\cdot 7\\cdot 13/6 = 91'}</InlineMath> και το{' '}
          <InlineMath>{'91/2 = 45.5'}</InlineMath> γίνονται με το μυαλό (το{' '}
          <InlineMath>{'7\\cdot 13 = 91'}</InlineMath> είναι η μόνη σταθερά που ξεκλειδώνει τον
          υπολογισμό). Αν το <InlineMath>A</InlineMath> δίνεται σε Volt, το{' '}
          <InlineMath>{'P_x = 45.5\\,A^2'}</InlineMath> είναι σε{' '}
          <InlineMath>{'\\mathrm{V}^2'}</InlineMath>, δηλαδή Watt πάνω σε αντίσταση{' '}
          <InlineMath>{'1\\,\\Omega'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th1-8',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 1.8',
    paperPage: 1,
    weight: 5,
    title: 'NBFM ή WBFM από K_f και πλάτος message',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea', 'fm/carson'],
    formulaIds: ['fm-instantaneous-freq', 'fm-beta', 'fm-single-tone', 'carson'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — κανένα από αυτά δεν είναι στο τυπολόγιο.</strong>{' '}
        Η στιγμιαία συχνότητα <InlineMath>{'f_i(t) = f_c + K_f\\,m(t)'}</InlineMath>{' '}
        (από εκεί βγαίνει το <InlineMath>{'\\Delta f = K_f\\max|m|'}</InlineMath>), ο ορισμός{' '}
        <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath>, ο κανόνας Carson{' '}
        <InlineMath>{'B \\cong 2(\\beta+1)W'}</InlineMath>, και το ίδιο το κριτήριο{' '}
        <InlineMath>{'\\beta \\ll 1 \\Rightarrow'}</InlineMath> NBFM — όλα γράφονται απέξω.
        Το βήμα «πλάτος <InlineMath>{'\\rightarrow \\Delta f'}</InlineMath>» χρειάστηκε
        ολόιδιο και στο{' '}
        <Link
          href="/practice#exercise:jun25-th3-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν.2025 ΘΕΜΑ 3
        </Link>{' '}
        (εκεί <InlineMath>{'m(t)=2\\cos(2\\pi\\cdot 2000\\,t)'}</InlineMath> με{' '}
        <InlineMath>{'K_f = 1'}</InlineMath> kHz/V), και την ίδια ετυμηγορία NBFM/WBFM
        ζητάει το{' '}
        <Link
          href="/practice#exercise:jan26-th1-5"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν.2026 ΘΕΜΑ 1.5
        </Link>{' '}
        — εκεί όμως σου δίνεται έτοιμο το <InlineMath>{'\\beta'}</InlineMath>, ενώ εδώ
        πρέπει να το χτίσεις.
      </>
    ),
    statement: (
      <p>
        Έστω το σήμα πληροφορίας{' '}
        <InlineMath>{'m(t) = 2\\cos(2\\pi\\cdot 100\\,t)'}</InlineMath> Volt που
        διαμορφώνεται κατά FM με ευαισθησία συχνότητας{' '}
        <InlineMath>{'K_f = 5'}</InlineMath> Hz/Volt. Πρόκειται για διαμόρφωση NBFM ή
        WBFM και γιατί;
      </p>
    ),
    solution: (
      <>
        <p>
          Το NBFM (narrowband FM) και το WBFM (wideband FM) δεν είναι ιδιότητες του
          διαμορφωτή — είναι ετυμηγορία πάνω σε έναν και μόνο αριθμό, τον δείκτη
          διαμόρφωσης <InlineMath>{'\\beta_f'}</InlineMath>. Άρα όλη η άσκηση είναι:
          χτίσε το <InlineMath>{'\\beta_f'}</InlineMath> από τα δεδομένα, σύγκρινέ το με
          τη μονάδα, και μετά πες τι σημαίνει αυτό. Πρόσεξε ότι η{' '}
          <InlineMath>{'f_c'}</InlineMath> δεν δίνεται — και δεν χρειάζεται: το{' '}
          <InlineMath>{'\\beta_f'}</InlineMath> δεν εξαρτάται από το πού κάθεται το φέρον.
        </p>

        <p>
          <strong>Βήμα 1 — τι κρύβει η εκφώνηση.</strong> Το{' '}
          <InlineMath>{'m(t) = 2\\cos(2\\pi\\cdot 100\\,t)'}</InlineMath> κουβαλάει δύο
          τελείως διαφορετικά νούμερα: το <em>πλάτος</em>{' '}
          <InlineMath>{'A_m = 2'}</InlineMath> Volt και τη <em>συχνότητα</em>{' '}
          <InlineMath>{'f_m = 100'}</InlineMath> Hz. Το καθένα παίζει άλλο ρόλο μέσα στη
          FM. Εδώ ακριβώς κρίνεται η άσκηση.
        </p>

        <p>
          <strong>Βήμα 2 — το πλάτος δίνει την απόκλιση συχνότητας.</strong> Στη FM η
          στιγμιαία συχνότητα του σήματος είναι
        </p>
        <BlockMath>{'f_i(t) = f_c + K_f\\, m(t)'}</BlockMath>
        <p>
          δηλαδή το message «σπρώχνει» τη συχνότητα πάνω-κάτω γύρω από το φέρον. Ο{' '}
          <InlineMath>{'K_f'}</InlineMath> μετριέται σε Hz/Volt και λέει ακριβώς αυτό:
          κάθε Volt του <InlineMath>{'m(t)'}</InlineMath> μετατοπίζει τη στιγμιαία
          συχνότητα κατά 5 Hz. Το message φτάνει το πολύ στα 2 Volt, άρα η μέγιστη
          απόκλιση συχνότητας είναι
        </p>
        <BlockMath>{'\\Delta f = K_f\\,\\max|m(t)| = 5\\,\\tfrac{\\text{Hz}}{\\text{V}} \\times 2\\,\\text{V} = 10\\ \\text{Hz}'}</BlockMath>
        <p>
          Με απλά λόγια: η συχνότητα του πομπού ταξιδεύει το πολύ ±10 Hz γύρω από το{' '}
          <InlineMath>{'f_c'}</InlineMath>, και τίποτα παραπάνω.
        </p>

        <p>
          <strong>Βήμα 3 — η συχνότητα δίνει το bandwidth του message.</strong> Το
          bandwidth ενός σήματος που είναι ένας μόνο τόνος είναι η ίδια του η συχνότητα,
          άρα <InlineMath>{'W = f_m = 100'}</InlineMath> Hz. Πρόσεξε τι <em>δεν</em> λέει
          αυτό το 100 Hz: δεν λέει πόσο <em>μακριά</em> φεύγει η συχνότητα του πομπού —
          λέει πόσο <em>γρήγορα</em> πηγαινοέρχεται.
        </p>

        <p>
          <strong>Βήμα 4 — ο λόγος τους είναι το β.</strong>
        </p>
        <BlockMath>{'\\beta_f = \\frac{\\Delta f}{W} = \\frac{K_f\\,\\max|m|}{f_m} = \\frac{10\\ \\text{Hz}}{100\\ \\text{Hz}} = 0.1'}</BlockMath>
        <p>
          Το <InlineMath>{'\\beta_f'}</InlineMath> βγαίνει καθαρός αριθμός (Hz προς Hz)
          και μετράει «πόσα message-bandwidths φαρδιά είναι η διαδρομή που κάνει η
          συχνότητα». Όλη η αριθμητική εδώ γίνεται με το μυαλό —{' '}
          <InlineMath>{'5\\cdot 2 = 10'}</InlineMath> και{' '}
          <InlineMath>{'10/100 = 0.1'}</InlineMath> — δεν χρειάζεται το κομπιουτεράκι.
        </p>

        <p>
          <strong>Απάντηση: NBFM.</strong> Το κριτήριο είναι{' '}
          <InlineMath>{'\\beta \\ll 1 \\Rightarrow'}</InlineMath> NBFM,{' '}
          <InlineMath>{'\\beta \\gg 1 \\Rightarrow'}</InlineMath> WBFM, και το{' '}
          <InlineMath>{'\\beta_f = 0.1'}</InlineMath> είναι δέκα φορές μικρότερο από τη
          μονάδα. (Κάποια εγχειρίδια κυκλοφορούν και μια πρακτική τιμή{' '}
          <InlineMath>{'\\beta < 0.3'}</InlineMath>· εδώ δεν χρειάζεται να διαλέξεις,
          γιατί το 0.1 περνάει άνετα και τα δύο κριτήρια.)
        </p>

        <p>
          <strong>Το «γιατί» που ζητάει ρητά η εκφώνηση.</strong> Το{' '}
          <InlineMath>{'\\beta_f \\ll 1'}</InlineMath> δεν είναι απλώς μια ταμπέλα — έχει
          δύο συγκεκριμένες, μετρήσιμες συνέπειες, και αυτές είναι η αιτιολόγηση.
        </p>

        <p>
          <strong>(α) Το εύρος ζώνης καταρρέει σε αυτό μιας AM.</strong> Ο κανόνας Carson
          δίνει
        </p>
        <BlockMath>{'B \\cong 2(\\beta_f + 1)\\,W = 2\\,(0.1 + 1)\\cdot 100 = 220\\ \\text{Hz}'}</BlockMath>
        <p>
          που απέχει μόλις 10% από το όριο <InlineMath>{'2W = 200'}</InlineMath> Hz —
          δηλαδή από το bandwidth που θα έπιανε μια AM με το ίδιο ακριβώς message. Αυτή η
          FM δεν «πληρώνει» φάσμα: χωράει εκεί που θα χωρούσε και μια AM. Αν αντίθετα το{' '}
          <InlineMath>{'\\beta'}</InlineMath> ήταν μεγάλο, το{' '}
          <InlineMath>{'2\\Delta f'}</InlineMath> θα κυριαρχούσε στον Carson και το
          bandwidth θα εκτοξευόταν — αυτό είναι το WBFM.
        </p>

        <p>
          <strong>(β) Το φάσμα έχει φέρον συν ένα μόνο ζεύγος sidebands.</strong> Για
          single-tone message η φάση είναι{' '}
          <InlineMath>{'\\phi(t) = \\beta_f\\sin(2\\pi f_m t)'}</InlineMath>. Όταν αυτή
          είναι πολύ μικρή (εδώ το πολύ 0.1 rad), ισχύουν οι γραμμικές προσεγγίσεις{' '}
          <InlineMath>{'\\cos\\phi \\cong 1'}</InlineMath> και{' '}
          <InlineMath>{'\\sin\\phi \\cong \\phi'}</InlineMath>, οπότε το σήμα γράφεται
        </p>
        <BlockMath>{'x(t) \\cong A_c\\cos(2\\pi f_c t) + \\tfrac{A_c\\beta_f}{2}\\cos[2\\pi(f_c+f_m)t] - \\tfrac{A_c\\beta_f}{2}\\cos[2\\pi(f_c-f_m)t]'}</BlockMath>
        <p>
          Τρεις γραμμές μόνο: φέρον στο <InlineMath>{'f_c'}</InlineMath> και δύο sidebands
          στα <InlineMath>{'f_c \\pm 100'}</InlineMath> Hz, με πλάτος{' '}
          <InlineMath>{'A_c\\beta_f/2 = 0.05\\,A_c'}</InlineMath>, δηλαδή 5% του φέροντος.
          Γι&apos; αυτό λέμε ότι το NBFM «μοιάζει με AM».
        </p>
        <p>
          <strong>Μοιάζει, δεν ταυτίζεται.</strong> Στο NBFM ο όρος των sidebands κάθεται
          πάνω στο <InlineMath>{'\\sin(2\\pi f_c t)'}</InlineMath> — σε quadrature (90°) με
          το φέρον, και γι&apos; αυτό το κάτω sideband βγαίνει με <em>μείον</em>. Στην AM
          και τα δύο sidebands κάθονται πάνω στο ίδιο{' '}
          <InlineMath>{'\\cos(2\\pi f_c t)'}</InlineMath> με το φέρον. Ίδιο μέτρο φάσματος,
          διαφορετική γεωμετρία — αν σε ρωτήσουν «είναι το NBFM ίδιο με το AM;», αυτή είναι
          η σωστή απάντηση.
        </p>

        <p>
          <strong>Η παγίδα της άσκησης.</strong> Ο συνηθισμένος λάθος δρόμος είναι να
          πολλαπλασιάσεις τον <InlineMath>{'K_f'}</InlineMath> με τη συχνότητα:{' '}
          <InlineMath>{'5 \\times 100 = 500'}</InlineMath> Hz, οπότε{' '}
          <InlineMath>{'\\beta = 5'}</InlineMath> και η απάντηση γίνεται «WBFM» — τελείως
          λάθος. Ο έλεγχος μονάδων το κόβει σε δύο δευτερόλεπτα: ο{' '}
          <InlineMath>{'K_f'}</InlineMath> είναι <strong>Hz ανά Volt</strong>, άρα μπορεί
          να πολλαπλασιάσει μόνο Volt. Η <InlineMath>{'f_m'}</InlineMath> είναι ήδη σε Hz —
          δεν έχει καμία δουλειά μέσα σε εκείνο το γινόμενο· ο ρόλος της είναι ο{' '}
          <em>παρονομαστής</em> του <InlineMath>{'\\beta'}</InlineMath>.
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th2-10',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 2.10',
    paperPage: 1,
    weight: 6,
    title: 'Μικτό FDM: το n της μη-επικάλυψης (DSB-SC + USSB)',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/multiplexing', 'am/dsb-sc', 'am/ssb', 'foundations/fourier-transform'],
    formulaIds: ['dsb-sc-signal', 'ssb-signal', 'fdm-spacing', 'fourier-pair-rect', 'fourier-pair-tri'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong> ο τύπος DSB-SC{' '}
        <InlineMath>{'x_{DSB\\text{-}SC}(t) = A_c\\,m(t)\\cos(2\\pi f_1 t)'}</InlineMath>, ο τύπος USSB{' '}
        <InlineMath>{'x_{USB}(t) = A_c k(t)\\cos(2\\pi f_2 t) - A_c\\hat{k}(t)\\sin(2\\pi f_2 t)'}</InlineMath>{' '}
        και η συνθήκη μη-επικάλυψης FDM (<InlineMath>{'\\Delta f \\ge 2W'}</InlineMath> για AM/DSB-SC,{' '}
        <InlineMath>{'\\Delta f \\ge W'}</InlineMath> για SSB). Πρόσεξε όμως ότι αυτές οι δύο έτοιμες
        μορφές ισχύουν <em>μόνο</em> για δύο κανάλια ίδιου τύπου και ίδιου εύρους — εδώ δεν ισχύει
        τίποτα από τα δύο, οπότε χτίζεις τη συνθήκη από τις άκρες των φασμάτων.{' '}
        <strong>Δίνονται</strong> στο τυπολόγιο τα ζεύγη Fourier{' '}
        <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\Pi'}</InlineMath> και{' '}
        <InlineMath>{'\\mathrm{sinc}^2\\leftrightarrow\\Lambda'}</InlineMath>, από τα οποία βγαίνουν τα
        δύο εύρη. Το ίδιο εργαλείο χρειάστηκε και στον{' '}
        <Link
          href="/practice#exercise:jun25-th2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 2
        </Link>{' '}
        (σχεδόν ίδια εκφώνηση με <InlineMath>{'f_2 = n f_1'}</InlineMath>, αλλά με{' '}
        <InlineMath>{'k = \\mathrm{sinc}(6Wt)'}</InlineMath> σε συμβατικό AM στο πάνω κανάλι) και στην{' '}
        <Link
          href="/practice#exercise:proodos26-12"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Απρ. 2026 ΘΕΜΑ 12
        </Link>{' '}
        (δύο USSB κανάλια με ελεύθερα φέροντα).
      </>
    ),
    statement: (
      <p>
        Έστω τα δυο βασικά σήματα πληροφορίας{' '}
        <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
        <InlineMath>{'k(t) = \\mathrm{sinc}^2(6Wt)'}</InlineMath>. Το{' '}
        <InlineMath>{'m(t)'}</InlineMath> διαμορφώνεται κατά <strong>AM-DSB-SC</strong> με φέρον{' '}
        <InlineMath>{'f_1'}</InlineMath> και το <InlineMath>{'k(t)'}</InlineMath> διαμορφώνεται κατά{' '}
        <strong>AM-USSB</strong> με φέρον <InlineMath>{'f_2 = n f_1'}</InlineMath> αντίστοιχα. Τα δυο
        σήματα πολυπλέκονται (προστίθενται) σ&rsquo; έναν πολυπλέκτη. Πόσο πρέπει να είναι το{' '}
        <InlineMath>{'n'}</InlineMath> για να μην συμπέσουν φασματικά;
      </p>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — «να μην συμπέσουν φασματικά» σημαίνει «να μην πατάει η μία λωρίδα πάνω
            στην άλλη».
          </strong>{' '}
          <span className="text-fg-muted">
            Ο πολυπλέκτης δεν κάνει τίποτα έξυπνο: απλώς <em>προσθέτει</em> τα δύο διαμορφωμένα
            σήματα. Στη συχνότητα η πρόσθεση δεν ανακατεύει τίποτα — κάθε κανάλι κάθεται στη δική του
            λωρίδα συχνοτήτων, και όσο οι δύο λωρίδες δεν έχουν κοινό σημείο, ο δέκτης κόβει με ένα
            bandpass φίλτρο όποια θέλει και την αποδιαμορφώνει σαν να μην υπήρξε ποτέ η άλλη. Άρα όλο
            το ερώτημα ανάγεται σε γεωμετρία:{' '}
            <em>πού αρχίζει και πού τελειώνει η λωρίδα του καθενός</em>. Πρόσεξε ότι το πλάτος{' '}
            <InlineMath>{'A_c'}</InlineMath> δεν μπαίνει πουθενά στον λογαριασμό — η επικάλυψη αφορά
            το <em>πού</em>, όχι το <em>πόσο ψηλά</em>.
          </span>
        </div>

        <p>
          <strong>(1) Τα δύο baseband φάσματα — και το πραγματικό τους μισό-εύρος.</strong> Πριν
          αγγίξουμε φέροντα, βρίσκουμε πόσο πλατύ είναι το κάθε μήνυμα στη συχνότητα· αυτό και μόνο
          καθορίζει το πλάτος της λωρίδας του.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath>
            </strong>{' '}
            — ένα sinc στον χρόνο έχει για μετασχηματισμό ένα καθαρό rect στη συχνότητα (το ζεύγος{' '}
            <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\Pi'}</InlineMath> του τυπολογίου):
            <BlockMath>{'M(f) = \\tfrac{1}{W}\\,\\Pi\\!\\left(\\tfrac{f}{W}\\right),\\qquad |f| \\le \\tfrac{W}{2}'}</BlockMath>
            Δηλαδή το bandwidth του <InlineMath>{'m'}</InlineMath> είναι{' '}
            <strong>
              <InlineMath>{'B_m = W/2'}</InlineMath>
            </strong>{' '}
            — <em>όχι</em> <InlineMath>{'W'}</InlineMath>. Το <InlineMath>{'W'}</InlineMath> μέσα στο{' '}
            <InlineMath>{'\\mathrm{sinc}(Wt)'}</InlineMath> είναι το <em>συνολικό</em> πλάτος του rect
            (από <InlineMath>{'-W/2'}</InlineMath> ως <InlineMath>{'+W/2'}</InlineMath>), άρα το
            μισό-εύρος είναι το μισό του. Είναι η πιο συχνή απροσεξία σε αυτό το θέμα.
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\mathrm{sinc}^2(6Wt)'}</InlineMath>
            </strong>{' '}
            — εδώ έχουμε <em>τετράγωνο</em> στον χρόνο, και πολλαπλασιασμός στον χρόνο σημαίνει{' '}
            <strong>συνέλιξη στη συχνότητα</strong>· rect συνελιγμένο με τον εαυτό του δίνει τρίγωνο
            (το ζεύγος <InlineMath>{'\\mathrm{sinc}^2\\leftrightarrow\\Lambda'}</InlineMath> του
            τυπολογίου):
            <BlockMath>{'K(f) = \\tfrac{1}{6W}\\,\\Lambda\\!\\left(\\tfrac{f}{6W}\\right),\\qquad |f| \\le 6W'}</BlockMath>
            Δηλαδή{' '}
            <strong>
              <InlineMath>{'B_k = 6W'}</InlineMath>
            </strong>
            . Η συνέλιξη <em>διπλασιάζει</em> το εύρος: το σκέτο{' '}
            <InlineMath>{'\\mathrm{sinc}(6Wt)'}</InlineMath> θα είχε μισό-εύρος{' '}
            <InlineMath>{'3W'}</InlineMath>, το τετράγωνό του έχει <InlineMath>{'6W'}</InlineMath>. Το{' '}
            <InlineMath>{'k'}</InlineMath> είναι λοιπόν <strong>12 φορές</strong> πλατύτερο από το{' '}
            <InlineMath>{'m'}</InlineMath> — μια πολύ άνιση ζευγαρωσιά, και εκεί ακριβώς σπάνε οι
            αποστηθισμένοι κανόνες.
          </li>
        </ul>

        <p>
          <strong>
            (2) Πού κάθεται η λωρίδα του καθενός — εδώ κρύβεται η ασυμμετρία του θέματος.
          </strong>{' '}
          Τα δύο κανάλια <em>δεν</em> στέλνονται με τον ίδιο τρόπο, και αυτό αλλάζει τη γεωμετρία.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>Κανάλι 1 — DSB-SC, δίπλευρο.</strong> Από τη{' '}
            <InlineMath>{'x_1(t) = A_c\\,m(t)\\cos(2\\pi f_1 t)'}</InlineMath> παίρνουμε{' '}
            <InlineMath>{'X_1(f) = \\tfrac{A_c}{2}\\left[M(f-f_1) + M(f+f_1)\\right]'}</InlineMath>: το{' '}
            <InlineMath>{'M'}</InlineMath> αντιγράφεται <em>ολόκληρο</em> γύρω από το φέρον, και προς
            τα πάνω και προς τα κάτω. Στις θετικές συχνότητες πιάνει
            <BlockMath>{'\\left[\\,f_1 - \\tfrac{W}{2},\\;\\; f_1 + \\tfrac{W}{2}\\,\\right]'}</BlockMath>
            συνολικό εύρος <InlineMath>{'2B_m = W'}</InlineMath>, με το φέρον ακριβώς στη{' '}
            <em>μέση</em>: προεξέχει <InlineMath>{'W/2'}</InlineMath> δεξιά και{' '}
            <InlineMath>{'W/2'}</InlineMath> αριστερά του.
          </li>
          <li>
            <strong>Κανάλι 2 — USSB, μονόπλευρο.</strong> Από τη{' '}
            <InlineMath>{'x_2(t) = A_c k(t)\\cos(2\\pi f_2 t) - A_c\\hat{k}(t)\\sin(2\\pi f_2 t)'}</InlineMath>{' '}
            επιβιώνει <strong>μόνο η πάνω πλευρική</strong>: στις θετικές συχνότητες{' '}
            <InlineMath>{'X_2(f) = A_c K(f - f_2)'}</InlineMath> για{' '}
            <InlineMath>{'f \\ge f_2'}</InlineMath>, και <strong>ακριβώς μηδέν</strong> για{' '}
            <InlineMath>{'f < f_2'}</InlineMath> (αυτό κάνει ο όρος με τον Hilbert: ακυρώνει την κάτω
            πλευρική). Άρα πιάνει
            <BlockMath>{'\\left[\\,f_2,\\;\\; f_2 + 6W\\,\\right]'}</BlockMath>
            Η λωρίδα <em>ξεκινά πάνω στο φέρον</em> και απλώνεται μόνο προς τα πάνω· η κορυφή του
            τριγώνου κάθεται κολλητά στο <InlineMath>{'f_2'}</InlineMath> και το φάσμα κατεβαίνει
            γραμμικά στο μηδέν στα <InlineMath>{'f_2 + 6W'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Γιατί αυτό είναι όλο το κλειδί:</strong> το κάτω κανάλι «ξοδεύει» χώρο{' '}
          <em>δεξιά</em> από το φέρον του — ακριβώς <InlineMath>{'W/2'}</InlineMath>. Το πάνω κανάλι{' '}
          <strong>δεν ξοδεύει καθόλου χώρο αριστερά</strong> από το δικό του — μηδέν. Το κενό που
          πρέπει να αφήσουμε ανάμεσα στα δύο φέροντα είναι το άθροισμα αυτών των δύο, και ο δεύτερος
          όρος εξαφανίζεται.
        </p>

        <p>
          <strong>(3) Η συνθήκη μη-επικάλυψης, χτισμένη από τις άκρες.</strong> Παίρνουμε{' '}
          <InlineMath>{'f_1 < f_2'}</InlineMath>, δηλαδή το στενό DSB-SC κανάλι από κάτω — αυτό εννοεί
          η εκφώνηση όταν γράφει <InlineMath>{'f_2 = n f_1'}</InlineMath> (την άλλη ανάγνωση τη
          βλέπουμε στο τέλος). Η <em>δεξιά ακμή του κάτω</em> δεν πρέπει να περάσει την{' '}
          <em>αριστερή ακμή του πάνω</em>:
        </p>
        <BlockMath>{'f_1 + \\tfrac{W}{2} \\;\\le\\; f_2 = n f_1 \\quad\\Longrightarrow\\quad (n-1)\\,f_1 \\;\\ge\\; \\tfrac{W}{2} \\quad\\Longrightarrow\\quad \\boxed{\\,n \\;\\ge\\; 1 + \\dfrac{W}{2 f_1}\\,}'}</BlockMath>
        <p>
          <strong>Τι λέει αυτό στα απλά:</strong> αρκεί το δεύτερο φέρον να είναι ψηλότερα από το
          πρώτο κατά τουλάχιστον <InlineMath>{'W/2'}</InlineMath> — δηλαδή όσο ακριβώς προεξέχει η
          DSB-SC λωρίδα δεξιά από το <InlineMath>{'f_1'}</InlineMath>. Ισοδύναμα{' '}
          <InlineMath>{'\\Delta f = f_2 - f_1 \\ge W/2'}</InlineMath>. Πρόσεξε ότι το{' '}
          <InlineMath>{'6W'}</InlineMath> του δεύτερου καναλιού <em>δεν εμφανίζεται πουθενά</em>: αφού
          η λωρίδα του απλώνεται προς τα πάνω, δεν ενοχλεί κανέναν από τους από κάτω. Θα μετρούσε μόνο
          αν στοιβάζαμε κι ένα τρίτο κανάλι πάνω του.
        </p>

        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            ⚠️ Μην γράψεις μηχανικά «<InlineMath>{'\\Delta f \\ge 2W'}</InlineMath>» ή «
            <InlineMath>{'\\Delta f \\ge W'}</InlineMath>».
          </strong>{' '}
          <span className="text-fg-muted">
            Οι έτοιμες μορφές που κουβαλάς για FDM (<InlineMath>{'\\Delta f \\ge 2W'}</InlineMath> για
            AM/DSB-SC, <InlineMath>{'\\Delta f \\ge W'}</InlineMath> για SSB) υποθέτουν{' '}
            <em>δύο κανάλια ίδιου τύπου και ίδιου εύρους</em>. Εδώ δεν ισχύει ούτε το ένα ούτε το
            άλλο: το ένα κανάλι είναι δίπλευρο και το άλλο μονόπλευρο, και τα εύρη διαφέρουν κατά
            12×. Ο γενικός κανόνας που δουλεύει πάντα είναι:{' '}
            <em>
              ελάχιστο κενό φερόντων = (όσο προεξέχει το κάτω κανάλι δεξιά από το φέρον του) + (όσο
              προεξέχει το πάνω κανάλι αριστερά από το δικό του)
            </em>
            . Για δύο DSB κανάλια με μηνύματα ίδιου bandwidth{' '}
            <InlineMath>B</InlineMath> δίνει <InlineMath>{'B + B = 2B'}</InlineMath> — να από πού
            βγαίνει ο σχολικός <InlineMath>{'\\Delta f \\ge 2W'}</InlineMath> (τα συνηθισμένα θέματα
            γράφουν <InlineMath>{'B = W'}</InlineMath>). Εδώ όμως{' '}
            <InlineMath>{'B_m = W/2'}</InlineMath> και το πάνω κανάλι δεν προεξέχει καθόλου
            αριστερά, οπότε δίνει{' '}
            <InlineMath>{'\\tfrac{W}{2} + 0 = \\tfrac{W}{2}'}</InlineMath>. Χτίσ&rsquo; το πάντα έτσι
            και έχεις δίκιο για οποιονδήποτε συνδυασμό σημάτων και σχημάτων.
          </span>
        </div>

        <p>
          <strong>(4) Η δεύτερη συνθήκη — να μη διπλώσει κανένα κανάλι στο DC.</strong> Κάθε
          πραγματικό σήμα έχει και κατοπτρικό φάσμα στις αρνητικές συχνότητες. Το DSB-SC κανάλι έχει
          το κάτοπτρό του στο <InlineMath>{'[-f_1 - W/2,\\; -f_1 + W/2]'}</InlineMath>· αν το{' '}
          <InlineMath>{'f_1'}</InlineMath> είναι πολύ χαμηλό, το κάτοπτρο περνάει το μηδέν και μπαίνει
          στις θετικές συχνότητες, πάνω στο ίδιο του το αντίγραφο — και τότε το σήμα καταστρέφεται
          ακόμη και χωρίς δεύτερο κανάλι. Για να μη συμβεί:
        </p>
        <BlockMath>{'f_1 - \\tfrac{W}{2} \\;\\ge\\; 0 \\quad\\Longleftrightarrow\\quad f_1 \\;\\ge\\; \\tfrac{W}{2}'}</BlockMath>
        <p>
          Το USSB κανάλι <em>δεν</em> χρειάζεται αντίστοιχη συνθήκη: η λωρίδα του ξεκινά στο{' '}
          <InlineMath>{'f_2'}</InlineMath> και ανεβαίνει, οπότε το κάτοπτρό της ζει ολόκληρο στο{' '}
          <InlineMath>{'[-f_2 - 6W,\\; -f_2]'}</InlineMath> και δεν πλησιάζει ποτέ το μηδέν, για
          οποιοδήποτε <InlineMath>{'f_2 > 0'}</InlineMath>. Είναι το ίδιο πλεονέκτημα που κάνει το SSB
          αγαπημένο της πολυπλεξίας.
        </p>

        <p>
          <strong>(5) Το ωραίο σημείο — οι δύο συνθήκες κουμπώνουν μεταξύ τους.</strong> Βάλε τη{' '}
          <InlineMath>{'f_1 \\ge W/2'}</InlineMath> μέσα στην απάντηση του βήματος (3). Αφού{' '}
          <InlineMath>{'2f_1 \\ge W'}</InlineMath>, το κλάσμα <InlineMath>{'W/(2f_1)'}</InlineMath>{' '}
          είναι το πολύ 1, άρα
        </p>
        <BlockMath>{'1 + \\dfrac{W}{2 f_1} \\;\\le\\; 1 + 1 \\;=\\; 2'}</BlockMath>
        <p>
          Με άλλα λόγια:{' '}
          <strong>
            αν το πρώτο κανάλι είναι καν καλοσχηματισμένο, το <InlineMath>{'n = 2'}</InlineMath>{' '}
            αρκεί πάντα
          </strong>
          . Και η ισότητα πιάνεται ακριβώς στην οριακή περίπτωση{' '}
          <InlineMath>{'f_1 = W/2'}</InlineMath>, όπου η απαίτηση γίνεται{' '}
          <InlineMath>{'n \\ge 2'}</InlineMath> — ούτε ψιλό παραπάνω. Δεν είναι σύμπτωση, και αξίζει
          να το δεις γεωμετρικά: <InlineMath>{'f_1 = W/2'}</InlineMath> σημαίνει ότι η DSB-SC λωρίδα
          πιάνει ακριβώς το <InlineMath>{'[0,\\, W]'}</InlineMath>, οπότε το επόμενο φέρον πρέπει να
          είναι τουλάχιστον στο <InlineMath>{'W'}</InlineMath>, που είναι ακριβώς{' '}
          <InlineMath>{'2f_1'}</InlineMath>.
        </p>
        <p>
          Αν λοιπόν το <InlineMath>{'n'}</InlineMath> διαβαστεί ως <strong>ακέραιος</strong> (έτσι
          γράφεται συνήθως ένα <InlineMath>{'f_2 = n f_1'}</InlineMath>), η απάντηση είναι{' '}
          <strong>
            <InlineMath>{'n \\ge 2'}</InlineMath>
          </strong>
          , με το <InlineMath>{'n = 2'}</InlineMath> να είναι η μικρότερη επιτρεπτή τιμή. Το{' '}
          <InlineMath>{'n = 1'}</InlineMath> είναι αδύνατο: δίνει{' '}
          <InlineMath>{'f_2 = f_1'}</InlineMath>, δηλαδή η USSB λωρίδα ξεκινά <em>μέσα</em> στη DSB-SC
          λωρίδα (που φτάνει ως το <InlineMath>{'f_1 + W/2'}</InlineMath>) — καθαρή επικάλυψη σε ένα
          διάστημα πλάτους <InlineMath>{'W/2'}</InlineMath>. Και <InlineMath>{'n \\le 0'}</InlineMath>{' '}
          δεν δίνει καν θετικό φέρον. Αν πάλι το <InlineMath>{'n'}</InlineMath> επιτρέπεται
          πραγματικός, η ακριβής απάντηση παραμένει η <InlineMath>{'n \\ge 1 + W/(2f_1)'}</InlineMath>:
          όσο ψηλότερο το <InlineMath>{'f_1'}</InlineMath> σε σχέση με το{' '}
          <InlineMath>{'W'}</InlineMath>, τόσο πιο κοντά στο 1 μπορεί να πέσει το{' '}
          <InlineMath>{'n'}</InlineMath>.
        </p>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Έλεγχος αλλάζοντας μία μόνο παράμετρο — τι θα γινόταν αν το πάνω κανάλι ήταν DSB;
          </strong>{' '}
          <span className="text-fg-muted">
            Κράτα τα ίδια δύο μηνύματα και άλλαξε <em>μόνο</em> το σχήμα διαμόρφωσης του δεύτερου
            καναλιού, από USSB σε DSB. Τότε ένα ακριβώς βήμα της λύσης αλλάζει — το (2): η λωρίδα του{' '}
            <InlineMath>{'k'}</InlineMath> δεν ξεκινά πια στο <InlineMath>{'f_2'}</InlineMath>, αλλά{' '}
            <InlineMath>{'6W'}</InlineMath> <em>κάτω</em> από αυτό, δηλαδή στο{' '}
            <InlineMath>{'f_2 - 6W'}</InlineMath>. Η ίδια ανισότητα ξαναγράφεται{' '}
            <InlineMath>{'f_1 + \\tfrac{W}{2} \\le n f_1 - 6W'}</InlineMath> και δίνει{' '}
            <InlineMath>{'n \\ge 1 + \\tfrac{13W}{2 f_1}'}</InlineMath>· στο οριακό{' '}
            <InlineMath>{'f_1 = W/2'}</InlineMath> αυτό απαιτεί <InlineMath>{'n \\ge 14'}</InlineMath>{' '}
            αντί για <InlineMath>{'n \\ge 2'}</InlineMath>. Η μονή πλευρική δεν είναι λοιπόν
            διακοσμητική λεπτομέρεια: <em>εξαφανίζει</em> ολόκληρη την κάτω πλευρική από το κενό που
            χρειάζεσαι. Το ίδιο ερώτημα, με συμβατικό AM στο πάνω κανάλι και{' '}
            <InlineMath>{'k = \\mathrm{sinc}(6Wt)'}</InlineMath> (μισό-εύρος{' '}
            <InlineMath>{'3W'}</InlineMath>), έπεσε στον{' '}
            <Link
              href="/practice#exercise:jun25-th2"
              className="text-accent underline-offset-2 hover:underline"
            >
              Ιούνιο 2025 (ΘΕΜΑ 2)
            </Link>{' '}
            και έδωσε <InlineMath>{'n \\ge 1 + \\tfrac{7W}{2 f_1}'}</InlineMath> — ίδια μηχανική,
            διαφορετικό κενό.
          </span>
        </div>

        <p>
          <strong>Και η άλλη ανάγνωση, για πληρότητα.</strong> Αν κάποιος έπαιρνε{' '}
          <InlineMath>{'n < 1'}</InlineMath>, το USSB κανάλι θα έμπαινε <em>κάτω</em> από το DSB-SC.
          Τότε η συνθήκη θα ήταν <InlineMath>{'n f_1 + 6W \\le f_1 - \\tfrac{W}{2}'}</InlineMath>,
          δηλαδή <InlineMath>{'n \\le 1 - \\tfrac{13W}{2 f_1}'}</InlineMath> — που απαιτεί{' '}
          <InlineMath>{'f_1 > 13W/2'}</InlineMath> για να βγει καν θετικό{' '}
          <InlineMath>{'n'}</InlineMath>. Είναι τεχνικά έγκυρο, αλλά δεν είναι το ζητούμενο: το{' '}
          <InlineMath>{'f_2 = n f_1'}</InlineMath> γράφεται για να τοποθετήσει το δεύτερο κανάλι{' '}
          <em>πάνω</em> από το πρώτο.
        </p>

        <p>
          <strong>Στην πράξη.</strong> Όλα τα παραπάνω υποθέτουν ιδανικά brick-wall φίλτρα στον δέκτη.
          Με πραγματικά φίλτρα προσθέτεις ένα guard band ~10–20% πάνω από το θεωρητικό ελάχιστο,
          αλλιώς οι ουρές του transition band του BPF μαζεύουν ενέργεια από το γειτονικό κανάλι
          (crosstalk) — δες{' '}
          <Link href="/am/multiplexing" className="text-accent underline-offset-2 hover:underline">
            /am/multiplexing §3, §5
          </Link>
          .
        </p>

        <p>
          <strong>Απάντηση:</strong> χρειάζεται <InlineMath>{'f_1 \\ge W/2'}</InlineMath> και{' '}
          <InlineMath>{'n \\ge 1 + \\dfrac{W}{2 f_1}'}</InlineMath>, ισοδύναμα{' '}
          <InlineMath>{'f_2 - f_1 \\ge W/2'}</InlineMath>. Επειδή{' '}
          <InlineMath>{'1 + W/(2f_1) \\le 2'}</InlineMath> για κάθε επιτρεπτό{' '}
          <InlineMath>{'f_1'}</InlineMath>, η μικρότερη ακέραια τιμή που δουλεύει πάντα είναι{' '}
          <strong>
            <InlineMath>{'n = 2'}</InlineMath>
          </strong>
          · το <InlineMath>{'n = 1'}</InlineMath> αποκλείεται.
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th2-12',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 2.12',
    paperPage: 1,
    weight: 8,
    title: 'Συνολική ενέργεια πολυπλεγμένου DSB-SC + USSB',
    topic: 'am',
    difficulty: 'hard',
    prerequisites: ['am/multiplexing', 'am/dsb-sc', 'am/ssb', 'foundations/fourier-transform'],
    formulaIds: ['signal-energy', 'parseval', 'fourier-pair-rect', 'fourier-pair-tri', 'dsb-sc-signal', 'ssb-signal', 'hilbert'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο ορισμός της ενέργειας{' '}
        <InlineMath>{'\\mathcal{E}_x = \\int_{-\\infty}^{\\infty}|x(t)|^2\\,dt'}</InlineMath>,
        η <strong>Parseval</strong>{' '}
        <InlineMath>{'\\int |x(t)|^2\\,dt = \\int |X(f)|^2\\,df'}</InlineMath>{' '}
        (το τυπολόγιο τυπώνει μόνο την ισότητα ενέργειας του Hilbert, όχι τη γενική μορφή
        χρόνου↔συχνότητας), ο τύπος DSB-SC{' '}
        <InlineMath>{'x_{DSB}(t) = A_c\\,m(t)\\cos(2\\pi f_c t)'}</InlineMath>{' '}
        και ο τύπος USSB{' '}
        <InlineMath>{'x_{USB}(t) = A_c m(t)\\cos(2\\pi f_c t) - A_c\\hat{m}(t)\\sin(2\\pi f_c t)'}</InlineMath>.{' '}
        <strong>✓ Δίνονται στο τυπολόγιο</strong> τα τρία εργαλεία που κάνουν τη δουλειά: τα
        ζεύγη <InlineMath>{'\\Pi \\leftrightarrow \\mathrm{sinc}'}</InlineMath> και{' '}
        <InlineMath>{'\\Lambda \\leftrightarrow \\mathrm{sinc}^2'}</InlineMath>, και η σχέση
        Hilbert{' '}
        <InlineMath>{'\\mathcal{F}\\{\\hat m\\} = -j\\,\\mathrm{sgn}(f)\\,M(f)'}</InlineMath>.
        Από αυτά, τα δύο ολοκληρώματα ενέργειας{' '}
        <InlineMath>{'\\int \\mathrm{sinc}^2(at)\\,dt = 1/a'}</InlineMath> και{' '}
        <InlineMath>{'\\int \\mathrm{sinc}^4(at)\\,dt = 2/(3a)'}</InlineMath> βγαίνουν σε δύο
        γραμμές — δεν τα αποστηθίζεις· η παραγωγή τους είναι στο{' '}
        <Link
          href="/foundations/fourier-transform"
          className="text-accent underline-offset-2 hover:underline"
        >
          Fourier transform §9.2
        </Link>.{' '}
        Το ίδιο εργαλείο χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:jun25-th2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 2
        </Link>{' '}
        (ίδιο setup και ίδια ερώτηση ενέργειας — αλλά με συμβατικό AM στο δεύτερο κανάλι,
        οπότε εκεί η φέρουσα απειρίζει το αποτέλεσμα), στο{' '}
        <Link
          href="/practice#exercise:proodos26-12"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Απρ. 2026 ΘΕΜΑ 12
        </Link>{' '}
        (ίδια πλήρης μορφή USSB) και στο{' '}
        <Link
          href="/practice#exercise:pb25-th4-nonlinear"
          className="text-accent underline-offset-2 hover:underline"
        >
          Πρόοδ. Β 2025 ΘΕΜΑ 4
        </Link>{' '}
        (ενέργεια παλμού για κανονικοποίηση).
      </>
    ),
    statement: (
      <>
        <p>
          <strong>ΘΕΜΑ 2 — κοινή εκφώνηση:</strong> Έστω τα δυο βασικά σήματα πληροφορίας{' '}
          <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
          <InlineMath>{'k(t) = \\mathrm{sinc}^2(6Wt)'}</InlineMath>. Το{' '}
          <InlineMath>{'m(t)'}</InlineMath> διαμορφώνεται κατά <strong>AM-DSB-SC</strong> με
          φέρον <InlineMath>{'f_1'}</InlineMath> και το <InlineMath>{'k(t)'}</InlineMath>{' '}
          διαμορφώνεται κατά <strong>AM-USSB</strong> με φέρον{' '}
          <InlineMath>{'f_2 = n f_1'}</InlineMath> αντίστοιχα. Τα δυο σήματα πολυπλέκονται
          (προστίθενται) σ' έναν πολυπλέκτη.
        </p>
        <p>
          <strong>Ερώτημα 12 (8%):</strong> Υπολογίστε τη συνολική ενέργεια του πολυπλεγμένου
          σήματος.
        </p>
        <p className="text-sm text-fg-muted">
          (Το θέμα δεν δίνει πουθενά πλάτος φέροντος. Κρατάμε λοιπόν το{' '}
          <InlineMath>{'A_c'}</InlineMath> συμβολικά και για τα δύο κανάλια· αν προτιμάς{' '}
          <InlineMath>{'A_c = 1'}</InlineMath>, απλώς εξαφανίζεται από το τελικό κλάσμα.)
        </p>
      </>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-900 dark:text-amber-100">
          <strong>Πρώτη γραμμή της λύσης — δήλωσε τις δύο συμβάσεις, πριν γράψεις αριθμό.</strong>{' '}
          <span>
            <strong>(i)</strong> Το θέμα δεν δίνει πλάτος φέροντος, οπότε γράφουμε{' '}
            <InlineMath>{'A_c'}</InlineMath> και στα δύο κανάλια και το κουβαλάμε συμβολικά ως
            το τέλος. <strong>(ii)</strong> Για την USSB χρησιμοποιούμε την{' '}
            <strong>πλήρη μορφή</strong>{' '}
            <InlineMath>{'x_2(t) = A_c\\big[k(t)\\cos(2\\pi f_2 t) - \\hat{k}(t)\\sin(2\\pi f_2 t)\\big]'}</InlineMath>{' '}
            — η ίδια σύμβαση με την οποία η σελίδα{' '}
            <Link
              href="/am/ssb"
              className="text-accent underline-offset-2 hover:underline"
            >
              SSB
            </Link>{' '}
            βγάζει <InlineMath>{'P_x = A_c^2 P_m'}</InlineMath>. Γιατί έχει σημασία: η «μισή»
            (I/Q) γραφή <InlineMath>{'\\tfrac{A_c}{2}\\big[k\\cos - \\hat{k}\\sin\\big]'}</InlineMath>{' '}
            διαφέρει κατά παράγοντα 2 στο πλάτος, άρα <strong>4 στην ενέργεια</strong>, και
            δίνει διαφορετικό τελικό νούμερο. Καμία από τις δύο δεν είναι λάθος· λάθος είναι να
            μην πεις ποια χρησιμοποιείς.
          </span>
        </div>

        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — γιατί το ερώτημα λέει «ενέργεια» και όχι «ισχύς».
          </strong>{' '}
          <span className="text-fg-muted">
            Το <InlineMath>{'\\mathrm{sinc}'}</InlineMath> και το{' '}
            <InlineMath>{'\\mathrm{sinc}^2'}</InlineMath> σβήνουν καθώς ο χρόνος μεγαλώνει: ο
            παλμός περνάει, και μετά δεν υπάρχει τίποτα. Ένα τέτοιο σήμα κουβαλάει{' '}
            <em>πεπερασμένο συνολικό απόθεμα</em> — αυτό είναι η ενέργειά του — αλλά{' '}
            <strong>μηδενική μέση ισχύ</strong>, γιατί μοιράζεις αυτό το πεπερασμένο απόθεμα σε
            άπειρο χρόνο. Γι' αυτό κάθε τύπος ισχύος που ξέρεις για AM (
            <InlineMath>{'P = A_c^2 P_m / 2'}</InlineMath> κ.ο.κ.) εδώ επιστρέφει{' '}
            <InlineMath>0</InlineMath>: σωστός τύπος, λάθος κατηγορία σήματος. Χρειάζεσαι το{' '}
            <em>ενεργειακό αντίστοιχο</em>, που χτίζεται με ακριβώς την ίδια κίνηση. Και επειδή
            τα δύο κανάλια κάθονται σε διαφορετικά κομμάτια του φάσματος, όλο το 8% καταλήγει
            σε τρία πράγματα: δύο ενέργειες baseband, τι κάνει σε καθεμιά η διαμόρφωσή της, και
            μία πρόσθεση.
          </span>
        </div>

        <p>
          <strong>Βήμα 1 — οι ενέργειες των δύο μηνυμάτων. Δουλεύουμε στη συχνότητα.</strong> Ο
          ορισμός είναι <InlineMath>{'\\mathcal{E}_x = \\int |x(t)|^2\\,dt'}</InlineMath>, αλλά
          το <InlineMath>{'\\int \\mathrm{sinc}^2(Wt)\\,dt'}</InlineMath> δεν έχει στοιχειώδη
          αντιπαράγωγο — δεν υπάρχει τεχνική ολοκλήρωσης που να το βγάλει στον χρόνο. Η{' '}
          <strong>Parseval</strong> λέει ότι το ίδιο ακριβώς νούμερο μπορείς να το μετρήσεις στη
          συχνότητα:
        </p>
        <BlockMath>{'\\mathcal{E}_x = \\int_{-\\infty}^{\\infty}|x(t)|^2\\,dt = \\int_{-\\infty}^{\\infty}|X(f)|^2\\,df'}</BlockMath>
        <p>
          Εκεί τα δύο φάσματα είναι ένα <strong>ορθογώνιο</strong> και ένα{' '}
          <strong>τρίγωνο</strong> — δηλαδή εμβαδά. Τα δύο ζεύγη του τυπολογίου, διαβασμένα από
          την ανάποδη μεριά, δίνουν:
        </p>
        <BlockMath>{'\\mathrm{sinc}(at) \\;\\leftrightarrow\\; \\tfrac{1}{a}\\,\\Pi\\!\\left(\\tfrac{f}{a}\\right), \\qquad \\mathrm{sinc}^2(at) \\;\\leftrightarrow\\; \\tfrac{1}{a}\\,\\Lambda\\!\\left(\\tfrac{f}{a}\\right)'}</BlockMath>
        <p>
          <strong>Για το <InlineMath>{'m'}</InlineMath></strong> (<InlineMath>{'a = W'}</InlineMath>):
          ορθογώνιο ύψους <InlineMath>{'1/W'}</InlineMath> που ζει στο{' '}
          <InlineMath>{'|f| \\le W/2'}</InlineMath>, άρα <em>πλάτους</em>{' '}
          <InlineMath>{'W'}</InlineMath>. Επειδή το <InlineMath>{'\\Pi'}</InlineMath> παίρνει
          μόνο τις τιμές 0 και 1, ισχύει <InlineMath>{'\\Pi^2 = \\Pi'}</InlineMath> — το
          τετράγωνο δεν αλλάζει τίποτα — οπότε το ολοκλήρωμα είναι σκέτο «(ύψος)² × πλάτος»:
        </p>
        <BlockMath>{'E_m = \\int \\mathrm{sinc}^2(Wt)\\,dt = \\left(\\tfrac{1}{W}\\right)^{2}\\cdot W = \\tfrac{1}{W}'}</BlockMath>
        <p>
          <strong>Για το <InlineMath>{'k'}</InlineMath></strong> (<InlineMath>{'a = 6W'}</InlineMath>):
          τρίγωνο με κορυφή <InlineMath>{'1/(6W)'}</InlineMath> στο{' '}
          <InlineMath>{'f = 0'}</InlineMath>, που πέφτει γραμμικά στο μηδέν στα{' '}
          <InlineMath>{'\\pm 6W'}</InlineMath>. Με αλλαγή μεταβλητής{' '}
          <InlineMath>{'u = f/(6W)'}</InlineMath> (άρα{' '}
          <InlineMath>{'df = 6W\\,du'}</InlineMath>):
        </p>
        <BlockMath>{'E_k = \\int \\mathrm{sinc}^4(6Wt)\\,dt = \\left(\\tfrac{1}{6W}\\right)^{2}\\cdot 6W \\int_{-1}^{1}\\Lambda^2(u)\\,du = \\tfrac{1}{6W}\\cdot\\tfrac{2}{3} = \\tfrac{1}{9W}'}</BlockMath>
        <p>
          Το <InlineMath>{'\\int_{-1}^{1}\\Lambda^2'}</InlineMath> είναι μία γραμμή αριθμητικής:
          το τρίγωνο είναι <InlineMath>{'\\Lambda(u) = 1 - |u|'}</InlineMath> και μηδενίζεται
          έξω από το <InlineMath>{'[-1,1]'}</InlineMath>, ενώ η αρτιότητά του σε αφήνει να
          δουλέψεις μόνο στο μισό:
        </p>
        <BlockMath>{'\\int_{-1}^{1}(1-|u|)^2\\,du = 2\\int_{0}^{1}(1-u)^2\\,du = 2\\cdot\\tfrac{1}{3} = \\tfrac{2}{3}'}</BlockMath>
        <p className="text-sm text-fg-muted">
          Όλα κλάσματα — δεν χρειάζεται κομπιουτεράκι πουθενά σε αυτό το ερώτημα. Η πλήρης
          παραγωγή των δύο κανόνων{' '}
          <InlineMath>{'\\int \\mathrm{sinc}^2(at)dt = 1/a'}</InlineMath> και{' '}
          <InlineMath>{'\\int \\mathrm{sinc}^4(at)dt = 2/(3a)'}</InlineMath> είναι στα{' '}
          <Link
            href="/foundations/fourier-transform#92-δύο-ολοκληρώματα-ενέργειας-που-θα-ξαναδείς-sinc-και-sinc"
            className="text-accent underline-offset-2 hover:underline"
          >
            ολοκληρώματα ενέργειας sinc
          </Link>.
        </p>

        <p>
          <strong>Βήμα 2 — τα δύο bandwidths, γιατί θα τα χρειαστούμε αμέσως.</strong> Το{' '}
          <InlineMath>{'M(f)'}</InlineMath> ζει στο <InlineMath>{'|f| \\le W/2'}</InlineMath>,
          άρα <InlineMath>{'B_m = W/2'}</InlineMath> — <strong>όχι</strong>{' '}
          <InlineMath>{'W'}</InlineMath>· αυτή είναι η πιο συχνή απροσεξία σε όλο το ΘΕΜΑ 2. Το{' '}
          <InlineMath>{'K(f)'}</InlineMath> ζει στο <InlineMath>{'|f| \\le 6W'}</InlineMath>,
          άρα <InlineMath>{'B_k = 6W'}</InlineMath> — δώδεκα φορές πλατύτερο από το{' '}
          <InlineMath>{'m'}</InlineMath>. (Το τετράγωνο στον χρόνο είναι συνέλιξη στη συχνότητα,
          γι' αυτό το <InlineMath>{'\\mathrm{sinc}^2'}</InlineMath> απλώνει.)
        </p>

        <p>
          <strong>Βήμα 3 — το κανάλι DSB-SC.</strong> Με{' '}
          <InlineMath>{'x_1(t) = A_c\\,m(t)\\cos(2\\pi f_1 t)'}</InlineMath> και{' '}
          <InlineMath>{'\\cos^2 = \\tfrac{1}{2} + \\tfrac{1}{2}\\cos(4\\pi f_1 t)'}</InlineMath>:
        </p>
        <BlockMath>{'E_1 = A_c^2\\!\\int m^2(t)\\cos^2(2\\pi f_1 t)\\,dt = \\tfrac{A_c^2}{2}E_m \\;+\\; \\tfrac{A_c^2}{2}\\!\\int m^2(t)\\cos(4\\pi f_1 t)\\,dt'}</BlockMath>
        <p>
          Ο δεύτερος όρος <strong>μηδενίζεται ακριβώς</strong> — όχι «κατά προσέγγιση», και
          αξίζει να δεις γιατί. Το <InlineMath>{'m^2(t)'}</InlineMath> έχει φάσμα{' '}
          <InlineMath>{'M * M'}</InlineMath>, που ζει το πολύ ως το{' '}
          <InlineMath>{'2B_m = W'}</InlineMath>. Το ολοκλήρωμα{' '}
          <InlineMath>{'\\int m^2\\cos(4\\pi f_1 t)\\,dt'}</InlineMath> είναι κυριολεκτικά αυτό
          το φάσμα <em>διαβασμένο στη θέση</em> <InlineMath>{'\\pm 2f_1'}</InlineMath>. Αρκεί
          λοιπόν <InlineMath>{'2f_1 > W'}</InlineMath>, δηλαδή{' '}
          <InlineMath>{'f_1 > B_m'}</InlineMath> — κάτι που η συνθήκη μη-επικάλυψης του
          προηγούμενου ερωτήματος ήδη σου εξασφαλίζει (αλλιώς το κάτοπτρο του καναλιού στο{' '}
          <InlineMath>{'-f_1'}</InlineMath> θα έμπαινε στις θετικές συχνότητες). Άρα:
        </p>
        <BlockMath>{'E_1 = \\tfrac{A_c^2}{2}\\,E_m = \\tfrac{A_c^2}{2}\\cdot\\tfrac{1}{W} = \\tfrac{A_c^2}{2W}'}</BlockMath>

        <p>
          <strong>Βήμα 4 — το κανάλι USSB.</strong> Υψώνοντας στο τετράγωνο την πλήρη μορφή (και
          με <InlineMath>{'2\\sin\\theta\\cos\\theta = \\sin 2\\theta'}</InlineMath> για τον
          σταυρωτό όρο):
        </p>
        <BlockMath>{'\\big[k\\cos(2\\pi f_2 t) - \\hat{k}\\sin(2\\pi f_2 t)\\big]^2 = k^2\\cos^2(2\\pi f_2 t) + \\hat{k}^2\\sin^2(2\\pi f_2 t) - k\\,\\hat{k}\\,\\sin(4\\pi f_2 t)'}</BlockMath>
        <p>
          Γράψε <InlineMath>{'\\cos^2 = \\tfrac{1}{2} + \\tfrac{1}{2}\\cos(4\\pi f_2 t)'}</InlineMath>{' '}
          και <InlineMath>{'\\sin^2 = \\tfrac{1}{2} - \\tfrac{1}{2}\\cos(4\\pi f_2 t)'}</InlineMath>.{' '}
          <em>Κάθε</em> κομμάτι που ταλαντώνεται στο <InlineMath>{'2f_2'}</InlineMath> φεύγει με
          το ίδιο ακριβώς επιχείρημα του Βήματος 3: τα φάσματα των{' '}
          <InlineMath>{'k^2'}</InlineMath>, <InlineMath>{'\\hat{k}^2'}</InlineMath> και{' '}
          <InlineMath>{'k\\hat{k}'}</InlineMath> ζουν όλα μέσα στο{' '}
          <InlineMath>{'|f| \\le 2B_k'}</InlineMath>, και το ολοκλήρωμα τα διαβάζει στο{' '}
          <InlineMath>{'\\pm 2f_2'}</InlineMath> — άρα μηδέν{' '}
          <strong>εφόσον <InlineMath>{'f_2 > B_k = 6W'}</InlineMath></strong>.{' '}
          <strong>Τίμια:</strong> αυτή είναι <em>ξεχωριστή</em> παραδοχή, όχι δώρο του
          ερωτήματος 10 — εκείνο δίνει μόνο{' '}
          <InlineMath>{'f_2 \\ge f_1 + W/2 \\ge W'}</InlineMath>, που δεν αρκεί. Κάθε
          ρεαλιστικό φέρον την ικανοποιεί με άνεση, αλλά γράψ&rsquo; την. Μένουν δύο μισά:
        </p>
        <BlockMath>{'E_2 = A_c^2\\left(\\tfrac{1}{2}E_k + \\tfrac{1}{2}E_{\\hat k}\\right)'}</BlockMath>
        <p>
          Και εδώ μπαίνει η ιδιότητα που κάνει τη διαφορά: ο{' '}
          <strong>Hilbert διατηρεί την ενέργεια</strong>. Από τη σχέση του τυπολογίου{' '}
          <InlineMath>{'\\mathcal{F}\\{\\hat k\\} = -j\\,\\mathrm{sgn}(f)\\,K(f)'}</InlineMath>,
          το <InlineMath>{'-j\\,\\mathrm{sgn}(f)'}</InlineMath> έχει μέτρο 1 παντού εκτός από το
          μεμονωμένο σημείο <InlineMath>{'f = 0'}</InlineMath>. Άρα{' '}
          <InlineMath>{'|\\hat K(f)| = |K(f)|'}</InlineMath> σχεδόν παντού, και ένα μοναδικό
          σημείο έχει μηδενικό «πλάτος» — δεν συνεισφέρει στο ολοκλήρωμα. Οπότε{' '}
          <InlineMath>{'E_{\\hat k} = E_k'}</InlineMath> και τα δύο μισά ξαναγίνονται ένα
          ολόκληρο:
        </p>
        <BlockMath>{'E_2 = A_c^2\\,E_k = A_c^2\\cdot\\tfrac{1}{9W} = \\tfrac{A_c^2}{9W}'}</BlockMath>
        <p>
          <strong>Σε απλά λόγια:</strong> η SSB πετάει τη μισή ζώνη, αλλά στην πλήρη μορφή η
          πλευρική που επιβιώνει βγαίνει με ύψος <InlineMath>{'A_c'}</InlineMath> αντί για{' '}
          <InlineMath>{'A_c/2'}</InlineMath> — διπλό ύψος στο μισό πλάτος. Στην ενέργεια το ύψος
          μπαίνει στο τετράγωνο ενώ το πλάτος γραμμικά, οπότε το καθαρό αποτέλεσμα είναι{' '}
          <em>διπλάσια</em> ενέργεια ανά μονάδα <InlineMath>{'A_c'}</InlineMath> σε σχέση με τη
          DSB-SC. Είναι η ίδια ασυμμετρία που είδες στις ισχύες:{' '}
          <InlineMath>{'P_{SSB} = A_c^2 P_m'}</InlineMath> έναντι{' '}
          <InlineMath>{'P_{DSB} = A_c^2 P_m/2'}</InlineMath>.
        </p>

        <p>
          <strong>Βήμα 5 — γιατί οι δύο ενέργειες απλώς προστίθενται.</strong> Το πολυπλεγμένο
          σήμα είναι <InlineMath>{'g(t) = x_1(t) + x_2(t)'}</InlineMath>, οπότε:
        </p>
        <BlockMath>{'E_g = \\int \\big(x_1 + x_2\\big)^2\\,dt = E_1 + E_2 + 2\\!\\int x_1(t)\\,x_2(t)\\,dt'}</BlockMath>
        <p>
          Ο σταυρωτός όρος είναι, από Parseval,{' '}
          <InlineMath>{'2\\!\\int X_1(f)\\,X_2^{*}(f)\\,df'}</InlineMath>. Τα δύο φάσματα όμως{' '}
          <strong>δεν επικαλύπτονται</strong> — αυτό ακριβώς εξασφάλισε η συνθήκη για το{' '}
          <InlineMath>{'n'}</InlineMath> στο προηγούμενο ερώτημα. Όπου το ένα είναι μη μηδενικό,
          το άλλο είναι μηδέν, άρα το γινόμενό τους είναι <em>ταυτοτικά</em> μηδέν και ο
          σταυρωτός όρος σβήνει:
        </p>
        <BlockMath>{'E_g = E_1 + E_2'}</BlockMath>
        <p>
          <strong>Σε απλά λόγια:</strong> δύο κανάλια που δεν πατάνε το ένα πάνω στο άλλο στη
          συχνότητα είναι <strong>ορθογώνια</strong>, και οι ενέργειες ορθογώνιων σημάτων
          αθροίζονται σκέτα. Αν <em>επικαλύπτονταν</em>, ο σταυρωτός όρος δεν θα ήταν μηδέν και
          η σκέτη πρόσθεση θα ήταν λάθος — γι' αυτό αξίζει να το γράψεις ρητά ως δικαιολόγηση,
          όχι να το θεωρήσεις δεδομένο.
        </p>

        <p>
          <strong>Βήμα 6 — το άθροισμα.</strong> Με κοινό παρονομαστή{' '}
          <InlineMath>{'18W'}</InlineMath>:
        </p>
        <BlockMath>{'E_g = \\tfrac{A_c^2}{2W} + \\tfrac{A_c^2}{9W} = \\tfrac{9A_c^2}{18W} + \\tfrac{2A_c^2}{18W} = \\boxed{\\;\\tfrac{11\\,A_c^{2}}{18\\,W}\\;}'}</BlockMath>
        <p>
          <strong>Έλεγχος λογικής (κάν' τον πάντα):</strong> το{' '}
          <InlineMath>{'k'}</InlineMath> έχει <strong>9 φορές μικρότερη</strong> ενέργεια από το{' '}
          <InlineMath>{'m'}</InlineMath>, αλλά ο κανόνας της SSB είναι{' '}
          <strong>2 φορές πιο γενναιόδωρος</strong> από της DSB-SC. Καθαρό αποτέλεσμα: το δεύτερο
          κανάλι συνεισφέρει <InlineMath>{'2/9'}</InlineMath> του πρώτου — και πράγματι{' '}
          <InlineMath>{'9 + 2 = 11'}</InlineMath> στους δέκατους όγδοους. Αν βάλεις{' '}
          <InlineMath>{'A_c = 1'}</InlineMath>, η απάντηση είναι σκέτο{' '}
          <InlineMath>{'11/(18W)'}</InlineMath>. (Το κομπιουτεράκι σού δίνει{' '}
          <InlineMath>{'\\approx 0.61/W'}</InlineMath> σε δύο δευτερόλεπτα, αλλά μην το
          μετατρέψεις: το κλάσμα <em>είναι</em> η απάντηση και είναι πιο ακριβές.)
        </p>

        <p>
          <strong>Και ο δρόμος που δεν χρειάζεται καθόλου την παραδοχή.</strong> Στη συχνότητα
          η πλήρης USSB μορφή δίνει ακριβώς{' '}
          <InlineMath>{'X_2(f) = A_c K(f-f_2)'}</InlineMath> για{' '}
          <InlineMath>{'f > f_2'}</InlineMath>, <InlineMath>{'A_c K(f+f_2)'}</InlineMath> για{' '}
          <InlineMath>{'f < -f_2'}</InlineMath>, και μηδέν ενδιάμεσα (ο όρος με τον Hilbert
          ακυρώνει την κάτω πλευρική). Οπότε{' '}
          <InlineMath>{'\\int |X_2|^2\\,df = A_c^2\\!\\int |K|^2\\,df = A_c^2 E_k'}</InlineMath>{' '}
          για <em>κάθε</em> <InlineMath>{'f_2 > 0'}</InlineMath>. Ίδιο νούμερο, χωρίς καμία
          υπόθεση για το πόσο ψηλά κάθεται το φέρον — και μια καλή απόδειξη ότι δεν έχεις
          κάνει λάθος στους τριγωνομετρικούς όρους.
        </p>

        <div className="my-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-900 dark:text-amber-100">
          <strong>Η άλλη σύμβαση — τι αλλάζει και τι όχι.</strong> Αν γράψεις τη μισή (I/Q)
          μορφή <InlineMath>{'\\tfrac{A_c}{2}\\big[k\\cos - \\hat{k}\\sin\\big]'}</InlineMath> —
          αυτή που παίρνεις <em>κυριολεκτικά</em> φιλτράροντας τη μία πλευρική ενός DSB-SC — τότε{' '}
          <InlineMath>{'E_2 = A_c^2 E_k / 4 = A_c^2/(36W)'}</InlineMath> και το άθροισμα γίνεται{' '}
          <InlineMath>{'\\tfrac{A_c^2}{2W} + \\tfrac{A_c^2}{36W} = \\tfrac{19A_c^2}{36W}'}</InlineMath>.
          Το <InlineMath>{'E_1'}</InlineMath> δεν αλλάζει καθόλου — μόνο το USSB κανάλι
          επηρεάζεται. Δήλωσε τη μορφή στην αρχή και το νούμερό σου είναι υπερασπίσιμο ό,τι κι
          αν περίμενε το θέμα. Η πλήρης μηχανή (και οι δύο εκδοχές) είναι στην{' '}
          <Link
            href="/am/multiplexing"
            className="text-accent underline-offset-2 hover:underline"
          >
            ενέργεια του πολυπλεγμένου σήματος
          </Link>.
        </div>
      </>
    ),
  },
  {
    id: 'jun26-th2-13',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 2.13',
    paperPage: 2,
    weight: 5,
    title: 'Ανιχνευτής περιβάλλουσας + BPF σε DSB-SC και USSB',
    topic: 'am',
    difficulty: 'medium',
    prerequisites: ['am/modulator-demodulator', 'am/dsb-sc', 'am/ssb', 'am/conventional'],
    formulaIds: ['dsb-sc-signal', 'ssb-signal', 'iq-decomposition', 'hilbert', 'am-signal', 'am-mu', 'envelope-detector-rc'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνονται στο τυπολόγιο:</strong>{' '}
        οι δύο μορφές που συγκρίνει το ερώτημα,{' '}
        <InlineMath>{'x_{DSB-SC}(t) = A_c\\,m(t)\\cos(2\\pi f_1 t)'}</InlineMath> και{' '}
        <InlineMath>{'x_{USSB}(t) = A_c\\,k(t)\\cos(2\\pi f_2 t) - A_c\\,\\hat{k}(t)\\sin(2\\pi f_2 t)'}</InlineMath>,{' '}
        η μορφή του συμβατικού AM{' '}
        <InlineMath>{'x_{AM}(t) = [A_c + m(t)]\\cos(2\\pi f_c t)'}</InlineMath> με{' '}
        <InlineMath>{'\\mu = |m|_{\\max}/A_c \\le 1'}</InlineMath> (τη χρειάζεσαι για την
        αντιπαραβολή), και πάνω απ&apos; όλα ο κανόνας της περιβάλλουσας{' '}
        <InlineMath>{'V(t) = \\sqrt{x_I^2(t) + x_Q^2(t)}'}</InlineMath> — αυτός μόνος του
        απαντά και στα δύο κανάλια. Εκτός τυπολογίου είναι και το παράθυρο του RC,{' '}
        <InlineMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{W}'}</InlineMath>.{' '}
        <strong>✓ Στο τυπολόγιο</strong> θα βρεις μόνο τη σχέση Hilbert{' '}
        <InlineMath>{'\\mathcal{F}\\{\\hat{k}(t)\\} = -j\\,\\mathrm{sgn}(f)\\,K(f)'}</InlineMath>,
        που εδώ κάνει όλη τη δουλειά: δίνει αμέσως{' '}
        <InlineMath>{'|\\hat{K}(f)| = |K(f)|'}</InlineMath>, άρα το{' '}
        <InlineMath>{'\\hat{k}'}</InlineMath> δεν γίνεται να είναι μηδέν. Το ίδιο εργαλείο
        χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:jun25-th2"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 2
        </Link>{' '}
        (σχεδόν ίδια εκφώνηση, αλλά εκεί το δεύτερο κανάλι είναι συμβατικό AM — και η
        απάντηση βγαίνει <em>αντίστροφη</em>) και στο{' '}
        <Link
          href="/practice#exercise:sept25-th1-4"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 1.4
        </Link>{' '}
        (οι συνθήκες λειτουργίας του ανιχνευτή περιβάλλουσας, γυμνές).
      </>
    ),
    statement: (
      <>
        <p>
          <strong>Κοινή εκφώνηση (ερωτήματα 9–13).</strong> Έστω τα δυο βασικά σήματα
          πληροφορίας <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath> και{' '}
          <InlineMath>{'k(t) = \\mathrm{sinc}^2(6Wt)'}</InlineMath>. Το{' '}
          <InlineMath>{'m(t)'}</InlineMath> διαμορφώνεται κατά <strong>AM-DSB-SC</strong> με
          φέρον <InlineMath>{'f_1'}</InlineMath> και το <InlineMath>{'k(t)'}</InlineMath>{' '}
          διαμορφώνεται κατά <strong>AM-USSB</strong> με φέρον{' '}
          <InlineMath>{'f_2 = n f_1'}</InlineMath> αντίστοιχα. Τα δυο σήματα πολυπλέκονται
          (προστίθενται) σ&rsquo; έναν πολυπλέκτη.
        </p>
        <p>
          Για την αποδιαμόρφωση, διατίθεται μόνο ένας ανιχνευτής περιβάλλουσας και ένα
          ζωνοπερατό φίλτρο. Είναι δυνατόν να ανιχνεύσουμε κάποιο από τα δύο σήματα;
          Αιτιολογήστε γιατί.
        </p>
      </>
    ),
    solution: (
      <>
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Διαίσθηση πρώτα — ο ανιχνευτής περιβάλλουσας είναι ένα «υψόμετρο», όχι δέκτης.
          </strong>{' '}
          <span className="text-fg-muted">
            Ένα διαμορφωμένο σήμα είναι μια <em>γρήγορη</em> ταλάντωση (το φέρον) της οποίας
            το <em>ύψος</em> κουνιέται αργά. Ο ανιχνευτής περιβάλλουσας — μια δίοδος κι ένα
            RC — μετράει <strong>μόνο αυτό το ύψος</strong>: δεν βλέπει καθόλου τη φάση της
            ταλάντωσης και δεν μπορεί να βγάλει αρνητικό αριθμό, γιατί ένα ύψος είναι εξ
            ορισμού μη αρνητικό. Άρα το πραγματικό ερώτημα δεν είναι «πόσο καλός είναι ο
            δέκτης» αλλά{' '}
            <strong>
              «φρόντισε ο πομπός ώστε το ύψος του σήματος να <em>είναι</em> το μήνυμα;»
            </strong>{' '}
            Θα το ελέγξουμε κανάλι-κανάλι. Και τα δύο κόβονται — αλλά, και αυτό είναι το
            ενδιαφέρον, για <em>διαφορετικό λόγο</em> το καθένα.
          </span>
        </div>

        <p>
          <strong>
            (1) Το εργαλείο: γράψε κάθε κανάλι σε μορφή I/Q και διάβασε τι μετράει ο
            ανιχνευτής.
          </strong>{' '}
          Κάθε bandpass σήμα με φέρον <InlineMath>{'f_c'}</InlineMath> γράφεται με έναν και
          μοναδικό τρόπο ως άθροισμα μιας συνιστώσας «σε φάση» και μιας «σε τετραγωνισμό»:
        </p>
        <BlockMath>{'x(t) = x_I(t)\\cos(2\\pi f_c t) - x_Q(t)\\sin(2\\pi f_c t) = V(t)\\cos\\big(2\\pi f_c t + \\theta(t)\\big)'}</BlockMath>
        <p>
          και το ύψος αυτής της ταλάντωσης είναι{' '}
          <InlineMath>{'V(t) = \\sqrt{x_I^2(t) + x_Q^2(t)}'}</InlineMath>.{' '}
          <strong>Τι λέει στα απλά:</strong> ό,τι κι αν έστειλε ο πομπός, ο ανιχνευτής
          περιβάλλουσας γυρίζει πίσω αυτή τη ρίζα — τίποτε άλλο. Οπότε ο ανιχνευτής σου δίνει
          το <InlineMath>{'x_I(t)'}</InlineMath> (δηλαδή, ελπίζουμε, το μήνυμα) μόνο αν
          περάσουν <em>δύο</em> έλεγχοι, ο ένας μετά τον άλλο:
        </p>
        <BlockMath>{'V = \\sqrt{x_I^2 + x_Q^2} \\;\\xrightarrow{\\;\\text{(A)}\\; x_Q \\equiv 0\\;}\\; |x_I| \\;\\xrightarrow{\\;\\text{(B)}\\; x_I \\ge 0\\;}\\; x_I'}</BlockMath>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>(A) Καμία συνιστώσα σε τετραγωνισμό</strong> —{' '}
            <InlineMath>{'x_Q(t) \\equiv 0'}</InlineMath>. Αλλιώς η ρίζα ανακατεύει δύο
            διαφορετικές κυματομορφές και το αποτέλεσμα δεν είναι καμία από τις δύο.
          </li>
          <li>
            <strong>(B) Το <InlineMath>{'x_I'}</InlineMath> να μην πηγαίνει ποτέ αρνητικό</strong> —{' '}
            <InlineMath>{'x_I(t) \\ge 0'}</InlineMath> για κάθε{' '}
            <InlineMath>t</InlineMath>. Αλλιώς η απόλυτη τιμή αναδιπλώνει τα αρνητικά κομμάτια
            προς τα πάνω και το πρόσημο χάνεται.
          </li>
        </ul>
        <p>
          Αυτή η λίστα των δύο σημείων είναι όλη η άσκηση. Τη διατρέχουμε δύο φορές.
        </p>

        <p>
          <strong>(2) Πρώτα το εύκολο μέρος: το ζωνοπερατό φίλτρο κάνει τη δουλειά του.</strong>{' '}
          Από τα προηγούμενα ερωτήματα του ίδιου ΘΕΜΑτος, τα δύο κανάλια κάθονται σε{' '}
          <em>ξένες</em> ζώνες συχνοτήτων: το <InlineMath>{'m'}</InlineMath> έχει{' '}
          <InlineMath>{'M(f) = \\tfrac{1}{W}\\Pi(f/W)'}</InlineMath> (μη μηδενικό για{' '}
          <InlineMath>{'|f| \\le W/2'}</InlineMath>), οπότε το DSB-SC κανάλι πιάνει το{' '}
          <InlineMath>{'[f_1 - \\tfrac{W}{2},\\, f_1 + \\tfrac{W}{2}]'}</InlineMath> — εύρος{' '}
          <InlineMath>W</InlineMath>· το <InlineMath>{'k'}</InlineMath> έχει{' '}
          <InlineMath>{'K(f) = \\tfrac{1}{6W}\\Lambda(f/6W)'}</InlineMath> (μη μηδενικό για{' '}
          <InlineMath>{'|f| \\le 6W'}</InlineMath>), οπότε η <em>άνω</em> πλευρική του πιάνει
          το <InlineMath>{'[f_2,\\, f_2 + 6W]'}</InlineMath> — εύρος{' '}
          <InlineMath>{'6W'}</InlineMath>. Η συνθήκη μη-επικάλυψης που βρήκαμε στο ερώτημα 10
          εγγυάται ακριβώς ότι αυτά τα δύο διαστήματα δεν τέμνονται. Άρα με{' '}
          <em>ένα</em> ζωνοπερατό φίλτρο μπορούμε να παραδώσουμε στον ανιχνευτή{' '}
          <strong>καθαρά ένα κανάλι, όποιο θέλουμε</strong>.
        </p>
        <p>
          <strong>Κράτα το:</strong> ο περιορισμός του θέματος{' '}
          <em>δεν</em> είναι ο διαχωρισμός των καναλιών — αυτός λύνεται. Ο περιορισμός είναι
          τι κάνει ο ανιχνευτής <em>αφού</em> του δώσεις το κανάλι. Αν στην εξέταση απαντήσεις
          «δεν γίνεται γιατί μπερδεύονται τα δύο σήματα», απαντάς σε άλλη ερώτηση.
        </p>

        <p>
          <strong>(3) Κανάλι 1 — DSB-SC: περνάει τον έλεγχο (A), κόβεται στον (B).</strong>{' '}
          Το DSB-SC είναι σκέτος πολλαπλασιασμός με συνημίτονο:{' '}
          <InlineMath>{'x_m(t) = A_c\\,m(t)\\cos(2\\pi f_1 t)'}</InlineMath>. Συγκρίνοντας με
          τη μορφή I/Q διαβάζουμε κατευθείαν{' '}
          <InlineMath>{'x_I = A_c\\,m(t)'}</InlineMath> και{' '}
          <InlineMath>{'x_Q = 0'}</InlineMath> — δεν υπάρχει όρος με ημίτονο. Ο έλεγχος (A)
          περνάει, οπότε
        </p>
        <BlockMath>{'V_m(t) = \\sqrt{(A_c m)^2 + 0^2} = A_c\\,|m(t)|'}</BlockMath>
        <p>
          Τώρα ο έλεγχος (B): <em>αλλάζει ποτέ πρόσημο το</em>{' '}
          <InlineMath>{'\\mathrm{sinc}(Wt)'}</InlineMath>; Ναι, και το βλέπουμε χωρίς πίνακα
          τιμών. Με τη σύμβαση του μαθήματος{' '}
          <InlineMath>{'\\mathrm{sinc}(Wt) = \\dfrac{\\sin(\\pi W t)}{\\pi W t}'}</InlineMath>,
          ο παρονομαστής είναι θετικός για{' '}
          <InlineMath>{'t > 0'}</InlineMath>, ενώ ο αριθμητής{' '}
          <InlineMath>{'\\sin(\\pi W t)'}</InlineMath> γίνεται <strong>αρνητικός</strong> σε
          όλο το διάστημα <InlineMath>{'1 < Wt < 2'}</InlineMath> (εκεί το όρισμα{' '}
          <InlineMath>{'\\pi W t'}</InlineMath> βρίσκεται μεταξύ{' '}
          <InlineMath>{'\\pi'}</InlineMath> και <InlineMath>{'2\\pi'}</InlineMath>). Άρα ο
          πρώτος πλευρικός λοβός του <InlineMath>{'m'}</InlineMath> είναι κάτω από τον άξονα —
          και το ίδιο κάθε δεύτερος λοβός μετά από αυτόν. Ο έλεγχος (B) αποτυγχάνει.
        </p>
        <figure className="my-4">
          <svg
            viewBox="0 0 480 146"
            className="block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
            role="img"
            aria-label="Το m(t)=sinc(Wt) περνά κάτω από τον άξονα στους πλευρικούς λοβούς, ενώ η έξοδος του ανιχνευτή περιβάλλουσας είναι το |m(t)| με τους αρνητικούς λοβούς αναδιπλωμένους προς τα πάνω"
          >
            <line x1="20" y1="100" x2="452" y2="100" stroke="currentColor" strokeOpacity="0.45" />
            <polygon points="458,100 448,96 448,104" fill="currentColor" fillOpacity="0.5" />
            <line x1="240" y1="100" x2="240" y2="36" stroke="currentColor" strokeOpacity="0.25" />
            <line x1="60" y1="97" x2="60" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="120" y1="97" x2="120" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="180" y1="97" x2="180" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="300" y1="97" x2="300" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="360" y1="97" x2="360" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="420" y1="97" x2="420" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <text x="60" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−3</text>
            <text x="120" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−2</text>
            <text x="180" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−1</text>
            <text x="240" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">0</text>
            <text x="300" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">1</text>
            <text x="360" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">2</text>
            <text x="420" y="122" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">3</text>
            <polyline
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              points="30,105.5 36,105.3 42,104.7 48,103.5 54,101.9 60,100 66,98 72,96 78,94.3 84,93 90,92.4 96,92.4 102,93.3 108,94.9 114,97.2 120,100 126,103.1 132,106.2 138,109.1 144,111.4 150,112.7 156,113 162,111.9 168,109.4 174,105.4 180,100 186,93.4 192,86 198,77.9 204,69.7 210,61.8 216,54.6 222,48.5 228,43.9 234,41 240,40 246,41 252,43.9 258,48.5 264,54.6 270,61.8 276,69.7 282,77.9 288,86 294,93.4 300,100 306,105.4 312,109.4 318,111.9 324,113 330,112.7 336,111.4 342,109.1 348,106.2 354,103.1 360,100 366,97.2 372,94.9 378,93.3 384,92.4 390,92.4 396,93 402,94.3 408,96 414,98 420,100 426,101.9 432,103.5 438,104.7 444,105.3 450,105.5"
            />
            <polyline
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeDasharray="4 3"
              points="30,94.5 36,94.7 42,95.3 48,96.5 54,98.1 60,100 66,98 72,96 78,94.3 84,93 90,92.4 96,92.4 102,93.3 108,94.9 114,97.2 120,100 126,96.9 132,93.8 138,90.9 144,88.6 150,87.3 156,87 162,88.1 168,90.6 174,94.6 180,100 186,93.4 192,86 198,77.9 204,69.7 210,61.8 216,54.6 222,48.5 228,43.9 234,41 240,40 246,41 252,43.9 258,48.5 264,54.6 270,61.8 276,69.7 282,77.9 288,86 294,93.4 300,100 306,94.6 312,90.6 318,88.1 324,87 330,87.3 336,88.6 342,90.9 348,93.8 354,96.9 360,100 366,97.2 372,94.9 378,93.3 384,92.4 390,92.4 396,93 402,94.3 408,96 414,98 420,100 426,98.1 432,96.5 438,95.3 444,94.7 450,94.5"
            />
            <line x1="24" y1="20" x2="38" y2="20" stroke="rgb(59, 130, 246)" strokeWidth="1.8" />
            <text x="43" y="23" fontSize="9" fill="currentColor" fillOpacity="0.85">m(t) = sinc(Wt) — το μήνυμα</text>
            <line x1="24" y1="34" x2="38" y2="34" stroke="rgb(239, 68, 68)" strokeWidth="1.8" strokeDasharray="4 3" />
            <text x="43" y="37" fontSize="9" fill="currentColor" fillOpacity="0.85">έξοδος ανιχνευτή = |m(t)|</text>
            <text x="240" y="138" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6" fontStyle="italic">χρόνος t, σε μονάδες 1/W</text>
          </svg>
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Οι δύο καμπύλες ταυτίζονται μόνο στον κεντρικό λοβό (
            <InlineMath>{'|Wt| < 1'}</InlineMath>), εκεί που το{' '}
            <InlineMath>{'m'}</InlineMath> είναι ήδη θετικό. Παντού αλλού ο ανιχνευτής
            επιστρέφει τον <strong>καθρέφτη</strong> του λοβού: οι λοβοί που ανήκουν κάτω από
            τον άξονα εμφανίζονται πάνω. Ο πρώτος τέτοιος λοβός φτάνει περίπου το{' '}
            <InlineMath>{'-0.217'}</InlineMath> γύρω στο{' '}
            <InlineMath>{'Wt \\approx 1.43'}</InlineMath> (νούμερο για την εικόνα — για την
            απάντηση αρκεί ότι είναι αρνητικός).
          </figcaption>
        </figure>
        <p>
          <strong>Γιατί αυτό δεν επιδιορθώνεται μετά.</strong> Η αναδίπλωση{' '}
          <InlineMath>{'m \\to |m|'}</InlineMath> <em>πετάει</em> μια πληροφορία: το πρόσημο
          κάθε λοβού. Αυτή η πληροφορία δεν υπάρχει πια στην έξοδο, οπότε{' '}
          <strong>καμία γραμμική επεξεργασία μετά τον ανιχνευτή δεν τη φέρνει πίσω</strong> —
          δεν είναι θέμα «καλύτερου φίλτρου». Σε επίπεδο σήματος, κάθε μηδενισμός του{' '}
          <InlineMath>{'m'}</InlineMath> είναι μια αναστροφή φάσης{' '}
          <InlineMath>{'180^\\circ'}</InlineMath> του φέροντος, και ο ανιχνευτής
          περιβάλλουσας είναι ακριβώς τυφλός στη φάση. (Το ότι το{' '}
          <InlineMath>{'|m|'}</InlineMath> έχει και γωνίες, άρα φάσμα πλατύτερο από{' '}
          <InlineMath>{'W/2'}</InlineMath>, είναι το ίδιο πρόβλημα από τη μεριά της
          συχνότητας.)
        </p>

        <p>
          <strong>
            (4) Κανάλι 2 — USSB: εδώ η παγίδα. Περνάει τον έλεγχο (B), κόβεται στον (A).
          </strong>{' '}
          Η πρώτη σκέψη είναι σχεδόν αναπόφευκτη: «το{' '}
          <InlineMath>{'k(t) = \\mathrm{sinc}^2(6Wt)'}</InlineMath> είναι{' '}
          <em>τετράγωνο</em>, άρα ποτέ αρνητικό, άρα δεν έχω πρόσημο να χάσω, άρα ο ανιχνευτής
          δουλεύει». Το πρώτο μισό είναι σωστό — το <InlineMath>{'k'}</InlineMath>{' '}
          πράγματι δεν κατεβαίνει ποτέ κάτω από το μηδέν, δηλαδή ο έλεγχος (B) περνάει. Το
          συμπέρασμα όμως είναι λάθος, γιατί το SSB <strong>κόβεται νωρίτερα, στον (A)</strong>:
        </p>
        <BlockMath>{'x_k(t) = A_c\\,k(t)\\cos(2\\pi f_2 t) - A_c\\,\\hat{k}(t)\\sin(2\\pi f_2 t) \\;\\Longrightarrow\\; x_I = A_c k,\\quad x_Q = A_c \\hat{k}'}</BlockMath>
        <p>
          Το SSB φτιάχνεται σβήνοντας τη μία πλευρική· ο μόνος τρόπος να σβήσεις μια πλευρική
          είναι να προσθέσεις έναν <em>δεύτερο</em> όρο σε τετραγωνισμό, τον{' '}
          <InlineMath>{'\\hat{k}'}</InlineMath> (τον Hilbert του{' '}
          <InlineMath>{'k'}</InlineMath>), που ακυρώνει τη μία πλευρά και αφήνει την άλλη. Αυτό
          σημαίνει ότι το <InlineMath>{'x_Q'}</InlineMath> <em>δεν</em> είναι μηδέν, οπότε
        </p>
        <BlockMath>{'V_k(t) = A_c\\sqrt{k^2(t) + \\hat{k}^2(t)} \\;\\ne\\; A_c\\,k(t)'}</BlockMath>
        <p>
          <strong>Και γιατί δεν μπορεί ποτέ να τύχει να είναι ίσο;</strong> Θα ήταν ίσο μόνο αν{' '}
          <InlineMath>{'\\hat{k} \\equiv 0'}</InlineMath>. Πάρε τη σχέση Hilbert του
          τυπολογίου, <InlineMath>{'\\hat{K}(f) = -j\\,\\mathrm{sgn}(f)\\,K(f)'}</InlineMath>:
          αφού <InlineMath>{'|-j\\,\\mathrm{sgn}(f)| = 1'}</InlineMath>, έχουμε{' '}
          <InlineMath>{'|\\hat{K}(f)| = |K(f)|'}</InlineMath> για κάθε{' '}
          <InlineMath>{'f \\ne 0'}</InlineMath>. Με απλά λόγια: ο Hilbert{' '}
          <em>δεν αφαιρεί τίποτα</em> από το σήμα, μόνο του στρίβει τη φάση. Άρα{' '}
          <InlineMath>{'\\hat{k} \\equiv 0'}</InlineMath> θα σήμαινε{' '}
          <InlineMath>{'K \\equiv 0'}</InlineMath>, δηλαδή ότι δεν στέλνουμε τίποτα.{' '}
          <strong>
            Για οποιοδήποτε πραγματικό μήνυμα, το SSB έχει πάντα συνιστώσα σε τετραγωνισμό, και
            η περιβάλλουσά του είναι πάντα διαφορετική κυματομορφή από το μήνυμα.
          </strong>{' '}
          Και επειδή <InlineMath>{'\\sqrt{k^2 + \\hat{k}^2} \\ge |k|'}</InlineMath>, η έξοδος
          του ανιχνευτή κάθεται <em>πάνω</em> από το μήνυμα σχεδόν παντού.
        </p>
        <figure className="my-4">
          <svg
            viewBox="0 0 480 132"
            className="block w-full rounded border border-border bg-bg-subtle p-2 text-fg"
            role="img"
            aria-label="Το k(t)=sinc²(6Wt) και η περιβάλλουσα του USSB σήματος, ρίζα του k τετράγωνο συν k-καπέλο τετράγωνο: η περιβάλλουσα είναι πολύ πλατύτερη και δεν μηδενίζεται εκεί που μηδενίζεται το k"
          >
            <line x1="20" y1="100" x2="452" y2="100" stroke="currentColor" strokeOpacity="0.45" />
            <polygon points="458,100 448,96 448,104" fill="currentColor" fillOpacity="0.5" />
            <line x1="240" y1="100" x2="240" y2="36" stroke="currentColor" strokeOpacity="0.25" />
            <line x1="60" y1="97" x2="60" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="120" y1="97" x2="120" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="180" y1="97" x2="180" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="360" y1="97" x2="360" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <line x1="420" y1="97" x2="420" y2="103" stroke="currentColor" strokeOpacity="0.5" />
            <text x="60" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−3</text>
            <text x="120" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−2</text>
            <text x="180" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">−1</text>
            <text x="240" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">0</text>
            <text x="300" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">1</text>
            <text x="360" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">2</text>
            <text x="420" y="114" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.75">3</text>
            <polyline
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              points="30,99.5 36,99.5 42,99.6 48,99.8 54,99.9 60,100 66,99.9 72,99.7 78,99.5 84,99.2 90,99 96,99 102,99.2 108,99.6 114,99.9 120,100 126,99.8 132,99.4 138,98.6 144,97.9 150,97.3 156,97.2 162,97.6 168,98.5 174,99.5 180,100 186,99.3 192,96.7 198,91.9 204,84.7 210,75.7 216,65.6 222,55.8 228,47.5 234,41.9 240,40 246,41.9 252,47.5 258,55.8 264,65.6 270,75.7 276,84.7 282,91.9 288,96.7 294,99.3 300,100 306,99.5 312,98.5 318,97.6 324,97.2 330,97.3 336,97.9 342,98.6 348,99.4 354,99.8 360,100 366,99.9 372,99.6 378,99.2 384,99 390,99 396,99.2 402,99.5 408,99.7 414,99.9 420,100 426,99.9 432,99.8 438,99.6 444,99.5 450,99.5"
            />
            <polyline
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeDasharray="4 3"
              points="30,94.5 36,94.5 42,94.5 48,94.3 54,94 60,93.6 66,93.2 72,92.8 78,92.5 84,92.3 90,92.3 96,92.3 102,92.2 108,91.9 114,91.3 120,90.5 126,89.5 132,88.5 138,87.7 144,87.2 150,87 156,87 162,86.8 168,86 174,84.1 180,80.9 186,76.6 192,71.4 198,65.8 204,60.2 210,54.7 216,49.8 222,45.7 228,42.6 234,40.7 240,40 246,40.7 252,42.6 258,45.7 264,49.8 270,54.7 276,60.2 282,65.8 288,71.4 294,76.6 300,80.9 306,84.1 312,86 318,86.8 324,87 330,87 336,87.2 342,87.7 348,88.5 354,89.5 360,90.5 366,91.3 372,91.9 378,92.2 384,92.3 390,92.3 396,92.3 402,92.5 408,92.8 414,93.2 420,93.6 426,94 432,94.3 438,94.5 444,94.5 450,94.5"
            />
            <line x1="300" y1="100" x2="300" y2="80.9" stroke="rgb(239, 68, 68)" strokeOpacity="0.8" strokeDasharray="2 2" />
            <circle cx="300" cy="100" r="2.4" fill="rgb(59, 130, 246)" />
            <circle cx="300" cy="80.9" r="2.4" fill="rgb(239, 68, 68)" />
            <text x="307" y="78" fontSize="9" fill="currentColor" fillOpacity="0.85">εδώ k = 0, αλλά V = A_c/π</text>
            <line x1="24" y1="20" x2="38" y2="20" stroke="rgb(59, 130, 246)" strokeWidth="1.8" />
            <text x="43" y="23" fontSize="9" fill="currentColor" fillOpacity="0.85">k(t) = sinc²(6Wt) — το μήνυμα</text>
            <line x1="24" y1="34" x2="38" y2="34" stroke="rgb(239, 68, 68)" strokeWidth="1.8" strokeDasharray="4 3" />
            <text x="43" y="37" fontSize="9" fill="currentColor" fillOpacity="0.85">έξοδος ανιχνευτή = √(k² + k̂²)</text>
            <text x="240" y="126" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6" fontStyle="italic">χρόνος t, σε μονάδες 1/(6W)</text>
          </svg>
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Και οι δύο καμπύλες είναι μη αρνητικές — δηλαδή ο «έλεγχος προσήμου» δεν πιάνει
            τίποτα εδώ — κι όμως είναι φανερά <strong>άλλη κυματομορφή</strong>. Το πιο καθαρό
            σημάδι: στο <InlineMath>{'t = 1/(6W)'}</InlineMath> το μήνυμα{' '}
            <InlineMath>{'k'}</InlineMath> μηδενίζεται, ενώ ο ανιχνευτής εκεί βγάζει{' '}
            <InlineMath>{'A_c/\\pi \\approx 0.32\\,A_c'}</InlineMath>. Ο όρος Hilbert
            «γεμίζει» τα μηδενικά του μηνύματος. (Ο κλειστός τύπος του{' '}
            <InlineMath>{'\\hat{k}'}</InlineMath> είναι εκτός ύλης και χρησιμεύει μόνο για να
            σχεδιαστεί η εικόνα — στην εξέταση αρκεί το επιχείρημα ότι το{' '}
            <InlineMath>{'\\hat{k}'}</InlineMath> δεν μπορεί να είναι μηδέν.)
          </figcaption>
        </figure>

        <p>
          <strong>(5) Η απάντηση.</strong>{' '}
          <strong>Όχι — κανένα από τα δύο σήματα δεν ανιχνεύεται</strong> με ζωνοπερατό φίλτρο
          και ανιχνευτή περιβάλλουσας. Το φίλτρο απομονώνει καθαρά όποιο κανάλι θέλουμε, αλλά:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>DSB-SC:</strong> ο ανιχνευτής βγάζει{' '}
            <InlineMath>{'A_c|m(t)|'}</InlineMath> αντί για{' '}
            <InlineMath>{'m(t)'}</InlineMath> — χαμένο πρόσημο, αναδιπλωμένοι λοβοί,
            μη αναστρέψιμη παραμόρφωση.
          </li>
          <li>
            <strong>USSB:</strong> ο ανιχνευτής βγάζει{' '}
            <InlineMath>{'A_c\\sqrt{k^2(t) + \\hat{k}^2(t)}'}</InlineMath> αντί για{' '}
            <InlineMath>{'k(t)'}</InlineMath> — ο όρος Hilbert μολύνει την έξοδο,
            ανεξάρτητα από το ότι το <InlineMath>{'k'}</InlineMath> είναι μη αρνητικό.
          </li>
        </ul>
        <p>
          <strong>Τι θα χρειαζόταν στ&apos; αλήθεια:</strong> <em>σύμφωνη</em> (coherent)
          αποδιαμόρφωση και για τα δύο — τοπικός ταλαντωτής κλειδωμένος στη συχνότητα{' '}
          <em>και</em> στη φάση του φέροντος, πολλαπλασιασμός, και μετά βαθυπερατό φίλτρο. Για
          το DSB-SC:{' '}
          <InlineMath>{'x_m \\cdot 2\\cos(2\\pi f_1 t) = A_c m + A_c m\\cos(4\\pi f_1 t)'}</InlineMath>,
          και το LPF (αποκοπή <InlineMath>{'W/2'}</InlineMath>) κρατά το{' '}
          <InlineMath>{'A_c m(t)'}</InlineMath>. Για το USSB, ο ίδιος πολλαπλασιασμός με{' '}
          <InlineMath>{'2\\cos(2\\pi f_2 t)'}</InlineMath> δίνει{' '}
          <InlineMath>{'A_c k'}</InlineMath> συν όρους γύρω από το{' '}
          <InlineMath>{'2f_2'}</InlineMath>, που το LPF (αποκοπή{' '}
          <InlineMath>{'6W'}</InlineMath>) πετάει. Το SSB είναι μάλιστα το πιο απαιτητικό:
          σφάλμα φάσης <InlineMath>{'\\varphi'}</InlineMath> στον τοπικό ταλαντωτή δίνει{' '}
          <InlineMath>{'A_c[k\\cos\\varphi + \\hat{k}\\sin\\varphi]'}</InlineMath> — όχι απλή
          εξασθένηση, αλλά ανάμειξη με τον Hilbert.
        </p>
        <p>
          Για πληρότητα, αν <em>είχαμε</em> κάτι ανιχνεύσιμο, ο ανιχνευτής θα χρειαζόταν και
          σωστό RC: <InlineMath>{'\\tfrac{1}{f_c} \\ll RC \\ll \\tfrac{1}{B}'}</InlineMath>{' '}
          με <InlineMath>B</InlineMath> το εύρος του μηνύματος. Δεν φτάνουμε ποτέ σε αυτό το
          βήμα εδώ — η αποτυχία είναι δομική, όχι θέμα ρύθμισης.
        </p>

        <div className="my-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">
            Η αντιπαραβολή που αξίζει τα περισσότερα: γιατί σε ένα σχεδόν ίδιο θέμα η απάντηση
            είναι «ναι».
          </strong>{' '}
          <span className="text-fg-muted">
            Στο{' '}
            <Link
              href="/practice#exercise:jun25-th2"
              className="text-accent underline-offset-2 hover:underline"
            >
              Ιούν. 2025 ΘΕΜΑ 2
            </Link>{' '}
            η εκφώνηση είναι σχεδόν λέξη προς λέξη η ίδια, αλλά το δεύτερο κανάλι είναι{' '}
            <strong>συμβατικό AM</strong>, δηλαδή{' '}
            <InlineMath>{'x_k = [A_c + k(t)]\\cos(2\\pi f_2 t)'}</InlineMath>. Ξανακάνε την
            ίδια λίστα των δύο ελέγχων για αυτή τη μορφή: δεν υπάρχει όρος με ημίτονο, άρα{' '}
            <InlineMath>{'x_Q = 0'}</InlineMath> — ο έλεγχος <strong>(A)</strong> περνάει,
            ακριβώς όπως και στο DSB-SC εδώ. Και επειδή ο πομπός{' '}
            <em>ξοδεύει ισχύ για να μεταδώσει φέρον</em>, το{' '}
            <InlineMath>{'x_I = A_c + k(t)'}</InlineMath> έχει ένα «βάθρο»{' '}
            <InlineMath>{'A_c'}</InlineMath>· αν αυτό είναι αρκετά μεγάλο, δηλαδή{' '}
            <InlineMath>{'A_c \\ge |k|_{\\max}'}</InlineMath> (ισοδύναμα{' '}
            <InlineMath>{'\\mu \\le 1'}</InlineMath>), τότε{' '}
            <InlineMath>{'x_I \\ge 0'}</InlineMath> παντού — περνάει και ο έλεγχος{' '}
            <strong>(B)</strong>. Ο ανιχνευτής βγάζει{' '}
            <InlineMath>{'A_c + k(t)'}</InlineMath> και ένας πυκνωτής σε σειρά κόβει το DC.{' '}
            <strong>Το ένα βήμα που αλλάζει είναι ακριβώς αυτό:</strong> εκεί ο πομπός πλήρωσε
            ένα μεταδιδόμενο φέρον αρκετά μεγάλο ώστε{' '}
            <InlineMath>{'A_c + k \\ge 0'}</InlineMath>· εδώ δεν πληρώνει κανένα από τα δύο
            κανάλια — το DSB-SC χάνει το βάθρο (κόβεται στον B), το USSB χάνει και το βάθρο{' '}
            <em>και</em> τη μηδενική συνιστώσα σε τετραγωνισμό (κόβεται στον A). Με άλλα λόγια,
            η φέρουσα του συμβατικού AM δεν είναι σπατάλη: είναι <em>ακριβώς</em> το εισιτήριο
            για φτηνό δέκτη — και τα ερωτήματα 9–13 του Ιουνίου 2026 δεν το αγόρασαν.
          </span>
        </div>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τίμια σημείωση — τι θα άλλαζε την απάντηση.</strong> Το
          θέμα γράφει «AM-USSB» χωρίς να αναφέρει φέρον, και το SSB στο μάθημα είναι
          κατεσταλμένου φέροντος. Αν το κανάλι έστελνε <em>και</em> φέρον πλάτους{' '}
          <InlineMath>{'A_0'}</InlineMath> (SSB + carrier), η περιβάλλουσα θα ήταν{' '}
          <InlineMath>{'\\sqrt{(A_0 + A_c k)^2 + (A_c\\hat{k})^2}'}</InlineMath>, που{' '}
          <em>προσεγγίζει</em> το <InlineMath>{'A_0 + A_c k'}</InlineMath> μόνο όταν το{' '}
          <InlineMath>{'A_0'}</InlineMath> είναι πολύ μεγαλύτερο και από το{' '}
          <InlineMath>{'A_c|k|'}</InlineMath> και από το{' '}
          <InlineMath>{'A_c|\\hat{k}|'}</InlineMath> — δηλαδή <em>κατά προσέγγιση</em>, ποτέ
          ακριβώς, σε αντίθεση με το συμβατικό AM όπου η ανάκτηση είναι ακριβής. Επίσης, το{' '}
          <InlineMath>{'A_c'}</InlineMath> εδώ ακολουθεί την πλήρη μορφή SSB{' '}
          <InlineMath>{'A_c[k\\cos - \\hat{k}\\sin]'}</InlineMath>· η επιλογή σταθεράς δεν
          παίζει κανέναν ρόλο στην απάντηση αυτού του ερωτήματος, γιατί μια θετική σταθερά δεν
          αλλάζει ούτε το πρόσημο ούτε το αν υπάρχει συνιστώσα σε τετραγωνισμό.
        </div>
      </>
    ),
  },
  {
    id: 'jun26-th3-14',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 3.14',
    paperPage: 2,
    weight: 5,
    title: 'Δείκτης β από Δf και f_m',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea'],
    formulaIds: ['fm-single-tone', 'fm-instantaneous-freq', 'fm-beta'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο ορισμός του δείκτη διαμόρφωσης{' '}
        <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath>{' '}
        και η single-tone εκδοχή του{' '}
        <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath>. Ούτε ο ορισμός της
        στιγμιαίας συχνότητας{' '}
        <InlineMath>{'f_i(t) = \\frac{1}{2\\pi}\\,\\frac{d\\theta(t)}{dt}'}</InlineMath>{' '}
        υπάρχει στο φυλλάδιο — κι όμως αυτός είναι που δικαιολογεί το{' '}
        <InlineMath>{'\\Delta f = \\beta f_m'}</InlineMath>. Πρόσεξε την παγίδα: ο
        πίνακας <InlineMath>{'J_n(\\beta)'}</InlineMath> σού <em>δίνεται</em> — υπάρχει
        στο επίσημο τυπολόγιο, και εδώ είναι επιπλέον τυπωμένος πάνω στο ίδιο το θέμα —
        αλλά ο τύπος που σε <em>φέρνει</em> στο{' '}
        <InlineMath>{'\\beta'}</InlineMath> δεν είναι πουθενά. Το ίδιο εργαλείο
        χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:sept25-th2-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 2.8
        </Link>{' '}
        (ίδια ακριβώς δομή — δίνονται <InlineMath>{'\\Delta f'}</InlineMath> και{' '}
        <InlineMath>{'f_m'}</InlineMath>) και στο{' '}
        <Link
          href="/practice#exercise:jan26-th4-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 4
        </Link>{' '}
        (εκεί το <InlineMath>{'\\beta = 3'}</InlineMath> διαβάζεται κατευθείαν από τη
        μορφή του σήματος, χωρίς να δοθεί <InlineMath>{'\\Delta f'}</InlineMath>).
      </>
    ),
    statement: (
      <>
        <p>
          <strong>ΘΕΜΑ 3 — κοινή εκφώνηση (ερωτήματα 14–17).</strong> Σε πομπό FM
          δίνεται το σήμα
        </p>
        <BlockMath>{'s(t) = A_c\\cos\\!\\left(2\\pi f_c t + \\beta\\sin(2\\pi f_m t)\\right)'}</BlockMath>
        <p>
          με <InlineMath>{'A_c = 10'}</InlineMath> V,{' '}
          <InlineMath>{'f_m = 5'}</InlineMath> kHz και απόκλιση συχνότητας{' '}
          <InlineMath>{'\\Delta f = 15'}</InlineMath> kHz.
        </p>
        <p>
          <strong>Ερώτημα 14:</strong> Να υπολογιστεί ο δείκτης διαμόρφωσης{' '}
          <InlineMath>{'\\beta'}</InlineMath>.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          Το <InlineMath>{'\\beta'}</InlineMath> είναι ήδη γραμμένο μέσα στην
          εκφώνηση: κάθεται ως συντελεστής του{' '}
          <InlineMath>{'\\sin(2\\pi f_m t)'}</InlineMath> μέσα στη φάση. Το πρόβλημα
          είναι ότι δεν μας δίνεται η <strong>τιμή</strong> του — μας δίνεται η{' '}
          <InlineMath>{'\\Delta f'}</InlineMath>. Χρειαζόμαστε λοιπόν τη γέφυρα
          ανάμεσα σε «πόσο κουνιέται η φάση» και «πόσο κουνιέται η συχνότητα». Αυτή η
          γέφυρα είναι η <strong>στιγμιαία συχνότητα</strong>.
        </p>

        <p>
          <strong>Βήμα 1 — ο ορισμός που κάνει τη δουλειά.</strong> Ονομάζουμε{' '}
          <InlineMath>{'\\theta(t)'}</InlineMath> ολόκληρη τη γωνία μέσα στο συνημίτονο
          και γράφουμε τον ορισμό της στιγμιαίας συχνότητας:
        </p>
        <BlockMath>{'\\theta(t) = 2\\pi f_c t + \\beta\\sin(2\\pi f_m t), \\qquad f_i(t) \\triangleq \\frac{1}{2\\pi}\\frac{d\\theta(t)}{dt}'}</BlockMath>
        <p>
          Σε απλά λόγια: «σε ποια συχνότητα τρέχει το ημίτονο αυτή τη στιγμή». Ο
          ορισμός είναι λογικός γιατί σε ένα καθαρό{' '}
          <InlineMath>{'\\cos(2\\pi f_0 t)'}</InlineMath> η γωνία είναι{' '}
          <InlineMath>{'2\\pi f_0 t'}</InlineMath>, η παράγωγος{' '}
          <InlineMath>{'2\\pi f_0'}</InlineMath>, και διαιρώντας με{' '}
          <InlineMath>{'2\\pi'}</InlineMath> παίρνεις πίσω το{' '}
          <InlineMath>{'f_0'}</InlineMath> — όπως οφείλει.
        </p>

        <p>
          <strong>Βήμα 2 — παραγωγίζουμε τη δοσμένη φάση.</strong> Η παράγωγος του{' '}
          <InlineMath>{'\\beta\\sin(2\\pi f_m t)'}</InlineMath> είναι{' '}
          <InlineMath>{'\\beta\\cdot 2\\pi f_m\\cos(2\\pi f_m t)'}</InlineMath>:
        </p>
        <BlockMath>{'f_i(t) = \\frac{1}{2\\pi}\\left[2\\pi f_c + \\beta\\, 2\\pi f_m\\cos(2\\pi f_m t)\\right] = f_c + \\beta f_m\\cos(2\\pi f_m t)'}</BlockMath>
        <p>
          Αυτή η γραμμή είναι όλο το νόημα του FM: η συχνότητα του πομπού{' '}
          <strong>δεν</strong> είναι σταθερή, ταλαντώνεται γύρω από το{' '}
          <InlineMath>{'f_c'}</InlineMath> με πλάτος{' '}
          <InlineMath>{'\\beta f_m'}</InlineMath>. Το συνημίτονο φτάνει το{' '}
          <InlineMath>1</InlineMath>, άρα η <strong>μέγιστη απόκλιση</strong> από το
          φέρον είναι ακριβώς
        </p>
        <BlockMath>{'\\Delta f = \\max\\left|f_i(t) - f_c\\right| = \\beta f_m'}</BlockMath>

        <p>
          <strong>Βήμα 3 — λύνουμε ως προς β.</strong> Τώρα και τα δύο μεγέθη της
          σχέσης είναι γνωστά:
        </p>
        <BlockMath>{'\\beta = \\frac{\\Delta f}{f_m} = \\frac{15\\ \\text{kHz}}{5\\ \\text{kHz}} = 3'}</BlockMath>
        <p>
          Οι μονάδες απλοποιούνται (kHz προς kHz), οπότε το{' '}
          <InlineMath>{'\\beta'}</InlineMath> είναι{' '}
          <strong>αδιάστατος αριθμός</strong> — αν σου βγει με μονάδες, κάτι έχει
          ξεφύγει. Κομπιουτεράκι δεν χρειάζεται εδώ, είναι μία διαίρεση.
        </p>

        <p>
          <strong>Τι σημαίνει το «3»</strong> — δύο διαβάσματα, και τα δύο σου
          χρειάζονται στα επόμενα ερωτήματα:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            <strong>Στη φάση:</strong> το{' '}
            <InlineMath>{'\\phi(t) = \\beta\\sin(2\\pi f_m t)'}</InlineMath> παίρνει
            τιμές μέχρι <InlineMath>{'\\pm\\beta = \\pm 3'}</InlineMath> rad. Δηλαδή η
            φάση του φέροντος τραβιέται μπρος-πίσω έως 3 ακτίνια, περίπου{' '}
            <InlineMath>{'\\pm 172^\\circ'}</InlineMath> — σχεδόν μισός κύκλος. (Η
            μετατροπή θέλει κομπιουτεράκι με το{' '}
            <InlineMath>{'1\\ \\text{rad} \\approx 57.3^\\circ'}</InlineMath>· το
            ερώτημα δεν τη ζητάει, την κάνουμε μόνο για να νιώσεις το μέγεθος.)
          </li>
          <li>
            <strong>Στη συχνότητα:</strong> η <InlineMath>{'f_i'}</InlineMath> σαρώνει
            το διάστημα{' '}
            <InlineMath>{'[\\,f_c - 15\\ \\text{kHz},\\; f_c + 15\\ \\text{kHz}\\,]'}</InlineMath>
            , δηλαδή <strong>3 βήματα των 5 kHz</strong> προς κάθε πλευρά. Το «σε πόσα
            βήματα <InlineMath>{'f_m'}</InlineMath>» είναι η μονάδα μέτρησης που
            μετράει παρακάτω, γιατί οι πλευρικές ζώνες του FM κάθονται ακριβώς ανά{' '}
            <InlineMath>{'f_m'}</InlineMath>.
          </li>
        </ul>

        <p>
          <strong>Πρόσεξε τι δεν χρησιμοποιήσαμε:</strong> το{' '}
          <InlineMath>{'A_c = 10'}</InlineMath> V δεν μπήκε πουθενά. Το{' '}
          <InlineMath>{'\\beta'}</InlineMath> ζει αποκλειστικά μέσα στη γωνία, και το
          πλάτος του φέροντος δεν αγγίζει τη γωνία. Το{' '}
          <InlineMath>{'A_c'}</InlineMath> θα χρειαστεί αργότερα, στα πλάτη{' '}
          <InlineMath>{'A_c J_n(\\beta)'}</InlineMath> των συνιστωσών του φάσματος.
        </p>

        <p>
          <strong>Η λεπτομέρεια που κόβει μονάδες.</strong> Ο γενικός ορισμός είναι{' '}
          <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath>, όπου{' '}
          <InlineMath>W</InlineMath> είναι το <strong>bandwidth του σήματος
          πληροφορίας</strong>, όχι «μια συχνότητα». Εδώ το message είναι ένας μόνο
          τόνος στα 5 kHz — και το βλέπεις από τη μορφή της φάσης: η φάση είναι{' '}
          <InlineMath>{'\\phi = 2\\pi K_f\\int m'}</InlineMath>, και το ολοκλήρωμα ενός
          συνημιτόνου δίνει ημίτονο, ακριβώς το{' '}
          <InlineMath>{'\\sin(2\\pi f_m t)'}</InlineMath> που βλέπουμε. Άρα{' '}
          <InlineMath>{'W = f_m = 5'}</InlineMath> kHz και ο τύπος καταρρέει στο{' '}
          <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath>. Αν το message είχε
          ολόκληρο φάσμα μέχρι <InlineMath>W</InlineMath>, δεν θα υπήρχε καν{' '}
          <InlineMath>{'f_m'}</InlineMath> να βάλεις στον παρονομαστή — εκεί γράφεις{' '}
          <InlineMath>{'\\Delta f / W'}</InlineMath>.
        </p>

        <p>
          <strong>Χαρακτηρισμός.</strong> Το{' '}
          <InlineMath>{'\\beta = 3'}</InlineMath> δεν είναι καθόλου{' '}
          <InlineMath>{'\\ll 1'}</InlineMath>, άρα πρόκειται για{' '}
          <strong>WBFM</strong> (διαμόρφωση ευρείας ζώνης). Είναι το πρώτο σημάδι ότι
          το φάσμα δεν θα έχει ένα μόνο ζεύγος πλευρικών, αλλά αρκετά.
        </p>

        <p>
          <strong>Έλεγχος πριν προχωρήσεις.</strong> Ο πιο γρήγορος έλεγχος είναι να
          πας ανάποδα: <InlineMath>{'\\beta f_m = 3\\cdot 5 = 15'}</InlineMath> kHz,
          δηλαδή ξαναβρίσκεις τη <InlineMath>{'\\Delta f'}</InlineMath> που σου
          έδωσαν — άρα η διαίρεση στάθηκε. Το{' '}
          <InlineMath>{'\\beta = 3'}</InlineMath> είναι η είσοδος και για τον Carson
          και για τον πίνακα <InlineMath>{'J_n(\\beta)'}</InlineMath> στα επόμενα
          ερωτήματα, οπότε αξίζει να το σιγουρέψεις εδώ.{' '}
          <strong>
            Μην περιμένεις όμως το <InlineMath>{'\\beta'}</InlineMath> σου να πέφτει
            πάντα πάνω σε τυπωμένη γραμμή του πίνακα.
          </strong>{' '}
          Ο πίνακας έχει αραιές γραμμές (0.00, 0.25, 0.5, 1.0, 1.5, 2.0, 2.41, 2.5,
          3.0, 4.0, 5.0, 5.53, …) και ένα άλλο ερώτημα FM αυτού του ίδιου φυλλαδίου
          βγάζει <InlineMath>{'\\beta = 0.1'}</InlineMath>, που δεν αντιστοιχεί σε
          καμία γραμμή — και είναι σωστό. Όταν το{' '}
          <InlineMath>{'\\beta'}</InlineMath> πέσει ανάμεσα σε δύο γραμμές, διαβάζεις
          την πλησιέστερη ή παρεμβάλλεις· δεν είναι ένδειξη λάθους.
        </p>
      </>
    ),
  },
  {
    id: 'jun26-th3-15',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 3.15',
    paperPage: 2,
    weight: 5,
    title: 'Carson — ενεργό εύρος ζώνης του FM πομπού',
    topic: 'fm',
    difficulty: 'easy',
    prerequisites: ['fm/idea', 'fm/carson'],
    formulaIds: ['fm-single-tone', 'fm-beta', 'carson', 'bessel-table', 'fm-bessel-property'],
    memorizationNote: (
      <>
        <strong>⚠️ Πρέπει να θυμάσαι — δεν δίνεται στο τυπολόγιο:</strong>{' '}
        ο κανόνας Carson{' '}
        <InlineMath>{'B \\cong 2(\\Delta f + W) = 2W(\\beta + 1)'}</InlineMath>{' '}
        και ο ορισμός του δείκτη διαμόρφωσης{' '}
        <InlineMath>{'\\beta_f = \\Delta f / W'}</InlineMath>. Κανένας από τους δύο
        δεν υπάρχει στο επίσημο τυπολόγιο — τους γράφεις απέξω. Ο πίνακας{' '}
        <InlineMath>{'J_n(\\beta)'}</InlineMath> <em>δίνεται</em> (και σε αυτό το θέμα
        είναι τυπωμένος πάνω στο ίδιο το φυλλάδιο), αλλά δεν σε βοηθά καθόλου να
        θυμηθείς τον Carson — είναι δύο ανεξάρτητα πράγματα. Το ίδιο ζευγάρι τύπων
        χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:sept25-th2-8"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 2.8
        </Link>{' '}
        (ίδια ακριβώς κίνηση, με{' '}
        <InlineMath>{'\\Delta f = 50'}</InlineMath> kHz) και στο{' '}
        <Link
          href="/practice#exercise:jun25-th3-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 3
        </Link>{' '}
        — εκεί ανάποδα: δίνεται το <InlineMath>B</InlineMath> και ζητείται το{' '}
        <InlineMath>{'\\beta'}</InlineMath>.
      </>
    ),
    statement: (
      <>
        <p>
          <strong>ΘΕΜΑ 3 — κοινή εκφώνηση (ερωτήματα 14–17).</strong> Σε πομπό FM
          δίνεται το σήμα
        </p>
        <BlockMath>{'s(t) = A_c\\cos\\!\\left(2\\pi f_c t + \\beta\\sin(2\\pi f_m t)\\right)'}</BlockMath>
        <p>
          με <InlineMath>{'A_c = 10'}</InlineMath> V,{' '}
          <InlineMath>{'f_m = 5'}</InlineMath> kHz και απόκλιση συχνότητας{' '}
          <InlineMath>{'\\Delta f = 15'}</InlineMath> kHz.
        </p>
        <p>
          <strong>Ερώτημα 15:</strong> Να υπολογιστεί το εύρος ζώνης με τον κανόνα
          Carson.
        </p>
      </>
    ),
    solution: (
      <>
        <p>
          <strong>Τι ρωτάει στην πραγματικότητα.</strong> Το φάσμα ενός FM σήματος δεν
          σταματάει πουθενά: γύρω από το φέρον κάθονται sidebands στα{' '}
          <InlineMath>{'f_c \\pm n f_m'}</InlineMath> για κάθε ακέραιο{' '}
          <InlineMath>n</InlineMath>. Άρα «το εύρος ζώνης» ως ακριβής αριθμός δεν
          υπάρχει — αυτό που υπάρχει είναι το <strong>ενεργό</strong> εύρος ζώνης: το
          παράθυρο γύρω από το <InlineMath>{'f_c'}</InlineMath> που κρατάει σχεδόν όλη
          την ισχύ. Ο κανόνας Carson είναι ακριβώς αυτό το παράθυρο γραμμένο ως τύπος —
          γι&apos; αυτό και γράφεται με <InlineMath>{'\\cong'}</InlineMath>, όχι με
          ίσον.
        </p>

        <p>
          <strong>Βήμα 1 — ποια δεδομένα μπαίνουν στον τύπο.</strong> Ο Carson θέλει δύο
          μεγέθη: την απόκλιση συχνότητας <InlineMath>{'\\Delta f'}</InlineMath> και το
          εύρος ζώνης <InlineMath>W</InlineMath> του σήματος πληροφορίας. Το{' '}
          <InlineMath>{'A_c = 10'}</InlineMath> V δεν μπαίνει πουθενά: το bandwidth του
          FM δεν εξαρτάται από το πλάτος του φέροντος (το{' '}
          <InlineMath>{'A_c'}</InlineMath> το χρειάζεσαι στο επόμενο ερώτημα, για τα
          πλάτη των φασματικών γραμμών). Ούτε το <InlineMath>{'f_c'}</InlineMath>{' '}
          μπαίνει: ο Carson δίνει <strong>πλάτος</strong> ζώνης, όχι{' '}
          <strong>θέση</strong> της.
        </p>

        <p>
          <strong>
            Βήμα 2 — εδώ <InlineMath>{'W = f_m'}</InlineMath>.
          </strong>{' '}
          Το σήμα πληροφορίας είναι ένας μόνο τόνος στα{' '}
          <InlineMath>{'f_m = 5'}</InlineMath> kHz, και ένας τόνος καταλαμβάνει
          φασματικά μόνο τη δική του συχνότητα· άρα{' '}
          <InlineMath>{'W = f_m = 5'}</InlineMath> kHz. Το βήμα μοιάζει περιττό εδώ,
          αλλά είναι ακριβώς αυτό που ξεχνιέται όταν το message <em>δεν</em> είναι
          single tone (π.χ. ένα <InlineMath>{'\\mathrm{sinc}'}</InlineMath>): τότε το{' '}
          <InlineMath>W</InlineMath> το βγάζεις από το φάσμα του{' '}
          <InlineMath>{'m(t)'}</InlineMath> — δεν είναι «η συχνότητα που βλέπω
          γραμμένη».
        </p>

        <p>
          <strong>
            Βήμα 3 — γιατί <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath>.
          </strong>{' '}
          Η φάση του σήματος είναι{' '}
          <InlineMath>{'\\theta(t) = 2\\pi f_c t + \\beta\\sin(2\\pi f_m t)'}</InlineMath>.
          Η στιγμιαία συχνότητα είναι η παράγωγος της φάσης διαιρεμένη με{' '}
          <InlineMath>{'2\\pi'}</InlineMath>:
        </p>
        <BlockMath>{'f_i(t) = \\frac{1}{2\\pi}\\frac{d\\theta(t)}{dt} = f_c + \\beta f_m\\cos(2\\pi f_m t)'}</BlockMath>
        <p>
          Η συχνότητα του πομπού δηλαδή ταλαντώνεται γύρω από το{' '}
          <InlineMath>{'f_c'}</InlineMath> με πλάτος{' '}
          <InlineMath>{'\\beta f_m'}</InlineMath>. Αυτό ακριβώς το πλάτος λέγεται
          απόκλιση συχνότητας, οπότε{' '}
          <InlineMath>{'\\Delta f = \\beta f_m'}</InlineMath> και:
        </p>
        <BlockMath>{'\\beta = \\frac{\\Delta f}{f_m} = \\frac{15\\ \\text{kHz}}{5\\ \\text{kHz}} = 3'}</BlockMath>
        <p>
          Το <InlineMath>{'\\beta'}</InlineMath> βγαίνει καθαρός αριθμός (kHz προς kHz):
          λέει πόσες φορές μεγαλύτερη είναι η ταλάντωση της συχνότητας από τη συχνότητα
          του ίδιου του message.
        </p>

        <p>
          <strong>Βήμα 4 — ο Carson, και στις δύο του μορφές.</strong>
        </p>
        <BlockMath>{'B \\cong 2(\\Delta f + W) = 2(15 + 5)\\ \\text{kHz} = 40\\ \\text{kHz}'}</BlockMath>
        <BlockMath>{'B \\cong 2W(\\beta + 1) = 2\\cdot 5\\cdot (3 + 1)\\ \\text{kHz} = 40\\ \\text{kHz}'}</BlockMath>
        <p>
          Οι δύο γραμμές δεν είναι δύο κανόνες αλλά ένας: βάζοντας{' '}
          <InlineMath>{'\\Delta f = \\beta W'}</InlineMath> στην πρώτη παίρνεις{' '}
          <InlineMath>{'2(\\beta W + W) = 2W(\\beta + 1)'}</InlineMath>, που είναι η
          δεύτερη. Ποια θα γράψεις εξαρτάται μόνο από το τι σου δίνει η εκφώνηση: εδώ
          σου δίνει κατευθείαν <InlineMath>{'\\Delta f'}</InlineMath> και{' '}
          <InlineMath>{'f_m'}</InlineMath>, οπότε η πρώτη μορφή δίνει την απάντηση χωρίς
          να χρειαστεί καν να υπολογίσεις το <InlineMath>{'\\beta'}</InlineMath>· αν
          αντίθετα σου δώσουν το <InlineMath>{'\\beta'}</InlineMath> διαβασμένο από τη
          μορφή του σήματος, η δεύτερη είναι πιο γρήγορη. Και οι δύο πράξεις γίνονται με
          το μυαλό — το κομπιουτεράκι δεν χρειάζεται σε αυτό το ερώτημα.
        </p>
        <p>
          <strong>
            Απάντηση: <InlineMath>{'B \\cong 40'}</InlineMath> kHz
          </strong>{' '}
          — δηλαδή η ζώνη{' '}
          <InlineMath>{'[f_c - 20\\ \\text{kHz},\\ f_c + 20\\ \\text{kHz}]'}</InlineMath>.
        </p>

        <p>
          <strong>Τι σημαίνει το 40 kHz.</strong> Οι γραμμές του φάσματος απέχουν{' '}
          <InlineMath>{'f_m = 5'}</InlineMath> kHz η μία από την άλλη, οπότε μέσα στο
          παράθυρο <InlineMath>{'\\pm 20'}</InlineMath> kHz χωράνε οι αρμονικές με{' '}
          <InlineMath>{'|n| \\le 20/5 = 4'}</InlineMath>: το φέρον συν 4 ζεύγη
          sidebands, 9 γραμμές συνολικά. Γενικά ο κανόνας γράφεται{' '}
          <InlineMath>{'|n| \\le \\lfloor\\beta\\rfloor + 1'}</InlineMath> — εδώ το{' '}
          <InlineMath>{'\\beta'}</InlineMath> είναι ακέραιο, οπότε το πάτωμα δεν αλλάζει
          τίποτα και βγαίνει 4· αν όμως είχες <InlineMath>{'\\beta = 2.5'}</InlineMath>, η
          σωστή κοπή είναι <InlineMath>{'|n| \\le 3'}</InlineMath> και όχι 3.5, γιατί το{' '}
          <InlineMath>n</InlineMath> μετράει γραμμές και είναι ακέραιο. Εκεί ακριβώς κρύβεται και το «γιατί»
          του τύπου: οι συντελεστές <InlineMath>{'J_n(\\beta)'}</InlineMath> σβήνουν
          πρακτικά για <InlineMath>{'n > \\beta'}</InlineMath>, και ο Carson κρατάει ένα
          sideband ασφαλείας πάνω από το <InlineMath>{'\\beta'}</InlineMath>. Το πλήρες
          επιχείρημα (και από τη μεριά Taylor και από τη μεριά Bessel) είναι στο{' '}
          <Link
            href="/fm/carson"
            className="text-accent underline-offset-2 hover:underline"
          >
            Carson&apos;s rule — ενεργό εύρος ζώνης
          </Link>
          .
        </p>

        <p>
          <strong>Έλεγχος με τον πίνακα Bessel (προαιρετικός, θέλει κομπιουτεράκι).</strong>{' '}
          Η ολική ισχύς του FM αντιστοιχεί σε{' '}
          <InlineMath>{'\\sum_n J_n^2(\\beta) = 1'}</InlineMath>, οπότε το ποσοστό της
          ισχύος που μένει μέσα στη ζώνη Carson είναι το άθροισμα των τετραγώνων μέχρι{' '}
          <InlineMath>{'n = 4'}</InlineMath>. Με τις τιμές που τυπώνει το ίδιο το θέμα
          για <InlineMath>{'\\beta = 3'}</InlineMath> (
          <InlineMath>{'J_0 = -0.26,\\ J_1 = 0.34,\\ J_2 = 0.49,\\ J_3 = 0.31,\\ J_4 = 0.13'}</InlineMath>
          ):
        </p>
        <BlockMath>{'J_0^2 + 2\\left(J_1^2 + J_2^2 + J_3^2 + J_4^2\\right) = 0.0676 + 2\\cdot 0.4687 = 1.005'}</BlockMath>
        <p>
          Το 1.005 είναι πάνω από 1, που είναι αδύνατο — η υπέρβαση είναι καθαρά σφάλμα
          στρογγυλοποίησης του πίνακα (δύο δεκαδικά). Με ακριβείς τιμές{' '}
          <InlineMath>{'J_n(3)'}</InlineMath> το άθροισμα βγαίνει{' '}
          <InlineMath>{'0.996'}</InlineMath>. Δηλαδή η ζώνη των 40 kHz κρατάει{' '}
          <InlineMath>{'\\approx 99.6\\%'}</InlineMath> της ισχύος: ο Carson εδώ είναι
          μάλλον γενναιόδωρος παρά τσιγκούνης, και ο αριθμός που βρήκαμε στέκει.
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Δύο παγίδες.</strong> <strong>(1)</strong> Το{' '}
          <InlineMath>{'\\beta = 3'}</InlineMath> <em>δεν</em> είναι{' '}
          <InlineMath>{'\\gg 1'}</InlineMath>, οπότε η WBFM συντόμευση{' '}
          <InlineMath>{'B \\approx 2\\Delta f = 30'}</InlineMath> kHz πέφτει 25% χαμηλά,
          και η NBFM συντόμευση <InlineMath>{'B \\approx 2W = 10'}</InlineMath> kHz είναι
          εντελώς εκτός. Οι δύο συντομεύσεις ισχύουν μόνο στα άκρα — ο πλήρης Carson
          ισχύει παντού, οπότε δεν έχεις κανένα λόγο να ρισκάρεις.{' '}
          <strong>(2)</strong> Ο παράγοντας <InlineMath>2</InlineMath> μπροστά υπάρχει
          επειδή η ζώνη απλώνεται <strong>και προς τα πάνω και προς τα κάτω</strong> από
          το φέρον· αν τον ξεχάσεις γράφεις 20 kHz αντί για 40 kHz.
        </div>
      </>
    ),
  },
  {
    id: 'jun26-th3-16',
    origin: 'past-exam',
    source: 'june-2026',
    problemNumber: 'ΘΕΜΑ 3.16',
    paperPage: 2,
    weight: 5,
    title: 'FM Bessel — πλάτη γραμμών για β=3',
    topic: 'fm',
    difficulty: 'medium',
    prerequisites: ['fm/idea', 'fm/bessel', 'fm/carson'],
    formulaIds: ['fm-single-tone', 'fm-beta', 'fm-bessel-expansion', 'fm-bessel-sidebands', 'bessel-table', 'carson', 'fm-significant-harmonics', 'fm-bessel-property', 'fm-power'],
    memorizationNote: (
      <>
        <strong>Καλά νέα:</strong> ο πίνακας{' '}
        <InlineMath>{'J_n(\\beta)'}</InlineMath> σού δίνεται{' '}
        <em>δύο φορές</em> — υπάρχει στο τυπολόγιο και επιπλέον είναι τυπωμένος
        πάνω στο ίδιο το θέμα. Δεν αποστηθίζεις ούτε έναν αριθμό· αρκεί να
        διαβάζεις σωστά τη γραμμή.{' '}
        <strong>
          ⚠️ Αυτό που δεν δίνεται πουθενά είναι το τι κάνεις με τους αριθμούς.
        </strong>{' '}
        Γράφεις απέξω: (α) τη μορφή Bessel{' '}
        <InlineMath>{'s(t)=A_c\\sum_n J_n(\\beta)\\cos[2\\pi(f_c+nf_m)t]'}</InlineMath>,
        που είναι αυτή που λέει ότι το πλάτος της n-οστής γραμμής είναι{' '}
        <InlineMath>{'A_c|J_n(\\beta)|'}</InlineMath>· (β) τον ορισμό{' '}
        <InlineMath>{'\\beta = \\Delta f / f_m'}</InlineMath>, γιατί ο πίνακας
        είναι ευρετηριασμένος στο <InlineMath>{'\\beta'}</InlineMath> και όχι στο{' '}
        <InlineMath>{'\\Delta f'}</InlineMath>· (γ) τον κανόνα Carson{' '}
        <InlineMath>{'B \\cong 2(\\beta+1)f_m'}</InlineMath> με το πόρισμά του{' '}
        <InlineMath>{'N = 2\\lfloor\\beta\\rfloor+3'}</InlineMath>, που ορίζει τι
        σημαίνει «ενεργό φάσμα»· (δ) τα{' '}
        <InlineMath>{'J_{-n}=(-1)^n J_n'}</InlineMath>,{' '}
        <InlineMath>{'\\sum_n J_n^2=1'}</InlineMath> και{' '}
        <InlineMath>{'P_{FM}=A_c^2/2'}</InlineMath> για τον έλεγχο ισχύος. Το ίδιο
        εργαλείο χρειάστηκε και στο{' '}
        <Link
          href="/practice#exercise:sept25-th2-9"
          className="text-accent underline-offset-2 hover:underline"
        >
          Σεπτ. 2025 ΘΕΜΑ 2.9
        </Link>{' '}
        (ίδια ανάγνωση πίνακα, <InlineMath>{'\\beta = 2.5'}</InlineMath>) και στο{' '}
        <Link
          href="/practice#exercise:jan26-th4-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιαν. 2026 ΘΕΜΑ 4.13–16
        </Link>{' '}
        (ίδιο <InlineMath>{'\\beta = 3'}</InlineMath>, ίδιο{' '}
        <InlineMath>{'A_c = 10'}</InlineMath> V — άρα ίδια ακριβώς πλάτη). Στο{' '}
        <Link
          href="/practice#exercise:jun25-th3-fm"
          className="text-accent underline-offset-2 hover:underline"
        >
          Ιούν. 2025 ΘΕΜΑ 3
        </Link>{' '}
        το ίδιο εργαλείο δουλεύει αντίστροφα: εκεί σου δίνουν το bandwidth και
        ψάχνεις πόσες γραμμές χωράνε.
      </>
    ),
    statement: (
      <>
        <p>
          <strong>ΘΕΜΑ 3 — κοινή εκφώνηση (ερωτήματα 14–17).</strong> Σε πομπό FM
          δίνεται το σήμα
        </p>
        <BlockMath>{'s(t) = A_c\\cos\\!\\left(2\\pi f_c t + \\beta\\sin(2\\pi f_m t)\\right)'}</BlockMath>
        <p>
          με <InlineMath>{'A_c = 10'}</InlineMath> V,{' '}
          <InlineMath>{'f_m = 5'}</InlineMath> kHz και απόκλιση συχνότητας{' '}
          <InlineMath>{'\\Delta f = 15'}</InlineMath> kHz.
        </p>
        <p>
          <strong>Ερώτημα 16:</strong> Με χρήση πίνακα Bessel να υπολογιστούν τα πλάτη
          του φέροντος και των πλευρικών ζωνών <strong>εντός του ενεργού
          φάσματος</strong>.
        </p>
        <p className="text-sm text-fg-muted">
          Ο πίνακας <InlineMath>{'J_n(\\beta)'}</InlineMath> είναι τυπωμένος πάνω στο
          θέμα. Παρατίθεται εδώ ένα κομμάτι του — μέρος της δουλειάς σου είναι να
          διαλέξεις τη σωστή γραμμή:
        </p>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left"><InlineMath>{'\\beta'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_0'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_1'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_2'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_3'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_4'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_5'}</InlineMath></th>
              <th className="py-2 text-left"><InlineMath>{'J_6'}</InlineMath></th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>2.0</td><td>0.22</td><td>0.58</td><td>0.35</td><td>0.13</td><td>0.03</td><td>—</td><td>—</td></tr>
            <tr><td>2.5</td><td>−0.05</td><td>0.50</td><td>0.45</td><td>0.22</td><td>0.07</td><td>0.02</td><td>0.01</td></tr>
            <tr><td>3.0</td><td>−0.26</td><td>0.34</td><td>0.49</td><td>0.31</td><td>0.13</td><td>0.04</td><td>0.01</td></tr>
            <tr><td>4.0</td><td>−0.40</td><td>−0.07</td><td>0.36</td><td>0.43</td><td>0.28</td><td>0.13</td><td>0.05</td></tr>
          </tbody>
        </table>
      </>
    ),
    solution: (
      <>
        <p>
          Τα ερωτήματα{' '}
          <Link
            href="/practice#exercise:jun26-th3-14"
            className="text-accent underline-offset-2 hover:underline"
          >
            14
          </Link>{' '}
          και{' '}
          <Link
            href="/practice#exercise:jun26-th3-15"
            className="text-accent underline-offset-2 hover:underline"
          >
            15
          </Link>{' '}
          του ίδιου θέματος βγάζουν πρώτα τον δείκτη{' '}
          <InlineMath>{'\\beta'}</InlineMath> και το εύρος ζώνης Carson. Εδώ τα
          ξαναβγάζουμε από την αρχή, ώστε η λύση να στέκει μόνη της.
        </p>

        <p>
          <strong>Γιατί χρειάζεται καν πίνακας.</strong> Στο FM η πληροφορία κάθεται{' '}
          <em>μέσα</em> στο όρισμα του συνημιτόνου, όχι πολλαπλασιαστικά μπροστά του.
          Δεν μπορείς λοιπόν να «μεταφέρεις» το φάσμα του message γύρω από το{' '}
          <InlineMath>{'f_c'}</InlineMath> όπως κάνεις στην AM — το FM δεν είναι
          γραμμικό ως προς το <InlineMath>{'m(t)'}</InlineMath>. Για τη
          συγκεκριμένη περίπτωση single-tone όμως υπάρχει ακριβής απάντηση: ο
          παράγοντας <InlineMath>{'e^{j\\beta\\sin(2\\pi f_m t)}'}</InlineMath> είναι
          περιοδικός με περίοδο <InlineMath>{'1/f_m'}</InlineMath>, άρα αναπτύσσεται
          σε σειρά Fourier — και οι συντελεστές του έχουν όνομα, είναι οι{' '}
          <InlineMath>{'J_n(\\beta)'}</InlineMath>:
        </p>
        <BlockMath>{'e^{j\\beta\\sin\\theta} = \\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\,e^{jn\\theta}'}</BlockMath>
        <p>
          Παίρνοντας το πραγματικό μέρος του{' '}
          <InlineMath>{'A_c\\,e^{j2\\pi f_c t}\\,e^{j\\beta\\sin(2\\pi f_m t)}'}</InlineMath>{' '}
          προκύπτει η μορφή που θα δουλέψουμε:
        </p>
        <BlockMath>{'s(t) = A_c\\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\,\\cos\\big[2\\pi (f_c + n f_m)\\,t\\big]'}</BlockMath>
        <p>
          Σε απλά λόγια: το FM σήμα είναι ένα άθροισμα από καθαρά συνημίτονα,
          τοποθετημένα ανά <InlineMath>{'f_m'}</InlineMath> δεξιά κι αριστερά του{' '}
          <InlineMath>{'f_c'}</InlineMath>, και το{' '}
          <strong>
            πλάτος της <InlineMath>{'n'}</InlineMath>-οστής γραμμής είναι{' '}
            <InlineMath>{'A_c\\,|J_n(\\beta)|'}</InlineMath>
          </strong>. Ο πίνακας Bessel δεν κάνει τίποτα άλλο από το να σου δίνει
          αυτούς τους καθαρούς αριθμούς <InlineMath>{'J_n(\\beta)'}</InlineMath>· το{' '}
          <InlineMath>{'A_c'}</InlineMath> τους δίνει μονάδες (Volt).
        </p>

        <p>
          <strong>Βήμα 1 — ποια γραμμή του πίνακα.</strong> Ο πίνακας είναι
          ευρετηριασμένος στο <InlineMath>{'\\beta'}</InlineMath>, όχι στο{' '}
          <InlineMath>{'\\Delta f'}</InlineMath>. Για να περάσουμε από το ένα στο
          άλλο δεν χρειάζεται να θυμηθούμε κάτι: παραγωγίζουμε τη φάση. Η στιγμιαία
          συχνότητα ορίζεται ως{' '}
          <InlineMath>{'f_i(t) = \\frac{1}{2\\pi}\\,d\\theta/dt'}</InlineMath>, και με{' '}
          <InlineMath>{'\\theta(t) = 2\\pi f_c t + \\beta\\sin(2\\pi f_m t)'}</InlineMath>{' '}
          δίνει
        </p>
        <BlockMath>{'f_i(t) = f_c + \\beta f_m\\cos(2\\pi f_m t) \\;\\Longrightarrow\\; \\Delta f = \\max|f_i - f_c| = \\beta f_m'}</BlockMath>
        <p>
          Δηλαδή η <InlineMath>{'\\Delta f'}</InlineMath> που μας δίνεται είναι το
          πλάτος της ταλάντωσης της συχνότητας. Ο γενικός ορισμός του δείκτη είναι{' '}
          <InlineMath>{'\\beta = \\Delta f / W'}</InlineMath>, όπου{' '}
          <InlineMath>W</InlineMath> το bandwidth του σήματος πληροφορίας· εδώ το
          message είναι ένας μόνο τόνος, άρα{' '}
          <InlineMath>{'W = f_m = 5'}</InlineMath> kHz και:
        </p>
        <BlockMath>{'\\beta = \\frac{\\Delta f}{f_m} = \\frac{15\\ \\text{kHz}}{5\\ \\text{kHz}} = 3'}</BlockMath>
        <p>
          Τι λέει αυτό: η στιγμιαία συχνότητα του πομπού ταλαντώνεται{' '}
          <InlineMath>{'\\pm 15'}</InlineMath> kHz γύρω από το{' '}
          <InlineMath>{'f_c'}</InlineMath>, δηλαδή κατά{' '}
          <strong>τρία βήματα των <InlineMath>{'f_m'}</InlineMath></strong>. Το{' '}
          <InlineMath>{'\\beta'}</InlineMath> είναι ακριβώς αυτό: πόσα{' '}
          <InlineMath>{'f_m'}</InlineMath> «πλατιά» είναι η εκτροπή. Πάμε λοιπόν στη
          γραμμή <InlineMath>{'\\beta = 3.0'}</InlineMath>.
        </p>

        <p>
          <strong>Βήμα 2 — μέχρι ποιο <InlineMath>{'n'}</InlineMath> μετράμε.</strong>{' '}
          Η σειρά Bessel είναι άπειρη: αυστηρά, το FM έχει{' '}
          <em>άπειρες</em> πλευρικές. Η φράση «εντός του ενεργού φάσματος» είναι
          εκείνη που κόβει το άθροισμα, και ενεργό φάσμα εδώ σημαίνει η ζώνη Carson:
        </p>
        <BlockMath>{'B \\cong 2(\\beta + 1)f_m = 2(\\Delta f + f_m) = 2(15 + 5) = 40\\ \\text{kHz}'}</BlockMath>
        <p>
          Αυτή η ζώνη είναι κεντραρισμένη στο <InlineMath>{'f_c'}</InlineMath> και
          απλώνεται <InlineMath>{'\\pm B/2 = \\pm 20'}</InlineMath> kHz. Επειδή οι
          γραμμές κάθονται ανά <InlineMath>{'f_m = 5'}</InlineMath> kHz, χωράνε όσες
          έχουν
        </p>
        <BlockMath>{'|n| \\le \\frac{B/2}{f_m} = \\frac{20}{5} = 4'}</BlockMath>
        <p>
          Ίδιο αποτέλεσμα και από την άλλη πλευρά: ο κανόνας για τον αριθμό
          σημαντικών αρμονικών δίνει{' '}
          <InlineMath>{'N = 2\\lfloor\\beta\\rfloor + 3 = 2\\cdot 3 + 3 = 9'}</InlineMath>{' '}
          γραμμές, δηλαδή ο carrier συν <strong>τέσσερα ζεύγη</strong> πλευρικών.
          Οι δύο αναγνώσεις συμφωνούν, και δεν είναι σύμπτωση — το{' '}
          <InlineMath>{'N'}</InlineMath> είναι απλώς ο ίδιος κανόνας Carson
          γραμμένος ως μέτρημα γραμμών αντί για εύρος σε Hz.
        </p>

        <p>
          <strong>Βήμα 3 — διάβασε τη γραμμή και πολλαπλασίασε επί{' '}
          <InlineMath>{'A_c = 10'}</InlineMath> V.</strong> Χρήσιμο εδώ το{' '}
          <InlineMath>{'J_{-n}(\\beta) = (-1)^n J_n(\\beta)'}</InlineMath>: το
          πρόσημο μπορεί να αλλάζει, το <em>μέτρο</em> όχι — άρα οι δύο γραμμές
          ενός ζεύγους <InlineMath>{'\\pm n'}</InlineMath> έχουν πάντα το ίδιο
          πλάτος και τις γράφουμε σε μία σειρά.
        </p>
        <table className="my-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left"><InlineMath>{'n'}</InlineMath></th>
              <th className="py-2 text-left">Συχνότητα</th>
              <th className="py-2 text-left"><InlineMath>{'J_n(3)'}</InlineMath></th>
              <th className="py-2 text-left">Πλάτος <InlineMath>{'A_c|J_n|'}</InlineMath></th>
            </tr>
          </thead>
          <tbody className="text-fg-muted">
            <tr><td>0 (carrier)</td><td><InlineMath>{'f_c'}</InlineMath></td><td>−0.26</td><td><strong>2.6 V</strong></td></tr>
            <tr><td>±1</td><td><InlineMath>{'f_c \\pm 5'}</InlineMath> kHz</td><td>0.34</td><td><strong>3.4 V</strong></td></tr>
            <tr><td>±2</td><td><InlineMath>{'f_c \\pm 10'}</InlineMath> kHz</td><td>0.49</td><td><strong>4.9 V</strong> — η ισχυρότερη</td></tr>
            <tr><td>±3</td><td><InlineMath>{'f_c \\pm 15'}</InlineMath> kHz</td><td>0.31</td><td><strong>3.1 V</strong></td></tr>
            <tr><td>±4</td><td><InlineMath>{'f_c \\pm 20'}</InlineMath> kHz</td><td>0.13</td><td><strong>1.3 V</strong> — ακριβώς στην άκρη της ζώνης</td></tr>
          </tbody>
        </table>
        <p>
          Το <InlineMath>{'f_c'}</InlineMath> δεν δίνεται αριθμητικά στο θέμα, οπότε
          η σωστή απάντηση είναι <em>σχετικά</em> ως προς αυτό — αυτό είναι πλήρες,
          όχι ελλιπές.
        </p>

        <p>
          <strong>Η παγίδα με το πρόσημο.</strong> Ο πίνακας δίνει{' '}
          <InlineMath>{'J_0(3) = -0.26'}</InlineMath>. Δεν γράφεις ποτέ «πλάτος{' '}
          <InlineMath>{'-2.6'}</InlineMath> V» — πλάτος αρνητικό δεν υπάρχει. Το
          μείον είναι <strong>φάση</strong>:
        </p>
        <BlockMath>{'-0.26\\,A_c\\cos(2\\pi f_c t) = 0.26\\,A_c\\cos(2\\pi f_c t + \\pi)'}</BlockMath>
        <p>
          δηλαδή η γραμμή του carrier έχει πλάτος 2.6 V και είναι γυρισμένη κατά{' '}
          <InlineMath>{'180^\\circ'}</InlineMath>. Στο φάσμα πλάτους αυτό δεν
          φαίνεται καθόλου· φαίνεται μόνο αν σου ζητήσουν φάση.
        </p>

        <p>
          <strong>Το ενδιαφέρον συμπέρασμα.</strong> Η ψηλότερη γραμμή δεν είναι ο
          carrier — είναι το ζεύγος <InlineMath>{'\\pm 2'}</InlineMath> στα 4.9 V,
          σχεδόν διπλάσιο από τον carrier. Αυτό δεν είναι ιδιοτροπία του πίνακα: στο
          FM, όσο μεγαλώνει το <InlineMath>{'\\beta'}</InlineMath>, ο carrier
          «ξοδεύει» την ισχύ του στις πλευρικές, και για{' '}
          <InlineMath>{'\\beta = 3'}</InlineMath> έχει ήδη δώσει τη μερίδα του
          λέοντος. Ποσοτικά, το ποσοστό ισχύος στον carrier είναι{' '}
          <InlineMath>{'J_0^2(3) = 0.0676'}</InlineMath>, δηλαδή μόλις 6.8%.
        </p>

        <p>
          <strong>Έλεγχος (αξίζει τα 30 δευτερόλεπτα).</strong> Η ταυτότητα{' '}
          <InlineMath>{'\\sum_n J_n^2(\\beta) = 1'}</InlineMath> λέει ότι, όσο και να
          μοιραστεί η ισχύς στις γραμμές, το σύνολο μένει σταθερό:
        </p>
        <BlockMath>{'P_{FM} = \\frac{A_c^2}{2} = \\frac{10^2}{2} = 50\\ \\text{W}\\quad\\text{(ανεξάρτητο του }\\beta)'}</BlockMath>
        <p>
          Με τις τιμές του πίνακα:{' '}
          <InlineMath>{'J_0^2 + 2(J_1^2 + J_2^2 + J_3^2 + J_4^2) = 0.0676 + 2(0.4687) = 1.005'}</InlineMath>.
          Άρα σχεδόν όλη η ισχύς είναι όντως μέσα στη ζώνη. Δύο σημειώσεις εδώ:
        </p>
        <ul className="ml-5 list-disc text-fg-muted">
          <li>
            Το ότι βγαίνει 1.005 και όχι ακριβώς 1 είναι{' '}
            <strong>στρογγυλοποίηση</strong> του πίνακα στα δύο δεκαδικά, όχι λάθος
            σου. Αν βάλεις και τα <InlineMath>{'n = \\pm 5, \\pm 6'}</InlineMath> το
            άθροισμα φτάνει 1.008. Μην κυνηγήσεις τη διαφορά.
          </li>
          <li>
            Οι γραμμές που μένουν <em>έξω</em> από τη ζώνη υπάρχουν αλλά είναι
            ψίχουλα: <InlineMath>{'n = \\pm 5'}</InlineMath> δίνει 0.4 V,{' '}
            <InlineMath>{'n = \\pm 6'}</InlineMath> δίνει 0.1 V, και μαζί κουβαλάνε{' '}
            <InlineMath>{'2(0.04^2 + 0.01^2) = 0.0034'}</InlineMath>, δηλαδή 0.34%
            της ισχύος. Η ζώνη Carson κρατά{' '}
            <InlineMath>{'\\approx 99.6\\%'}</InlineMath> — ακόμα πιο σφιχτά από το
            ~98% που υπόσχεται γενικά ο κανόνας.
          </li>
        </ul>

        <p>
          <strong>Αν στη συνέχεια σου ζητήσουν να σχεδιάσεις το φάσμα:</strong> πρόσεξε
          τη μονάδα. Τα 2.6 / 3.4 / 4.9 / 3.1 / 1.3 V είναι πλάτη{' '}
          <em>συνημιτόνων στο χρόνο</em>. Αν σχεδιάσεις το αμφίπλευρο{' '}
          <InlineMath>{'X(f)'}</InlineMath> με κρουστικές, κάθε κρουστική έχει βάρος{' '}
          <InlineMath>{'\\tfrac{A_c}{2}|J_n|'}</InlineMath> — δηλαδή τα μισά ύψη,
          μοιρασμένα στις θετικές και τις αρνητικές συχνότητες.
        </p>

        <p className="text-sm text-fg-muted">
          Σημείωση για το κομπιουτεράκι: τα πλάτη δεν το χρειάζονται καθόλου — ο
          πολλαπλασιασμός επί <InlineMath>{'A_c = 10'}</InlineMath> είναι απλή
          μετακίνηση της υποδιαστολής. Το κομπιουτεράκι (επιτρέπεται στην εξέταση)
          το θέλεις μόνο αν κάνεις τον έλεγχο ισχύος, για τα τετράγωνα των{' '}
          <InlineMath>{'J_n'}</InlineMath>.
        </p>
      </>
    ),
  },
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
        <div className="my-3 rounded-md border border-sky-500/30 bg-sky-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">Διαίσθηση πρώτα — τι κάνει στ' αλήθεια η USSB.</strong>{' '}
          <span className="text-fg-muted">
            Το φάσμα ενός πραγματικού σήματος είναι <em>συμμετρικό</em>: η πάνω και η κάτω
            πλευρική κουβαλούν <strong>την ίδια</strong> πληροφορία. Το DSB-SC τις στέλνει και
            τις δύο· η USSB πετάει τη μισή και κρατά <strong>μόνο την πάνω</strong> — μισό
            bandwidth, ίδια πληροφορία. Το κλειδί όλου του θέματος:{' '}
            <em>
              το σχήμα του baseband καθορίζει το σχήμα της διαμορφωμένης λοβής — η διαμόρφωση
              απλώς «σηκώνει» το θετικό μισό του φάσματος πάνω στο φέρον
            </em>
            . Άρα η μέθοδος είναι δύο βήματα: πρώτα βρίσκουμε τα δύο baseband φάσματα, μετά
            κρατάμε το πάνω μισό του καθενός γύρω από το φέρον του (
            <Link href="/am/ssb" className="text-accent underline-offset-2 hover:underline">
              /am/ssb §2c, §3
            </Link>
            ).
          </span>
        </div>

        <p>
          <strong>(1) Τα φάσματα βασικής ζώνης — και γιατί το ένα είναι rect και το άλλο τρίγωνο.</strong>{' '}
          Τα δύο σήματα μοιάζουν στον χρόνο, αλλά το <InlineMath>{'k'}</InlineMath> είναι το{' '}
          <em>τετράγωνο</em> του <InlineMath>{'m'}</InlineMath> — κι αυτό αλλάζει εντελώς το σχήμα
          στη συχνότητα.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              <InlineMath>{'m(t) = \\mathrm{sinc}(Wt)'}</InlineMath>
            </strong>{' '}
            — ένα sinc στον χρόνο έχει για μετασχηματισμό ένα <strong>καθαρό rect</strong> στη
            συχνότητα (το ζεύγος{' '}
            <InlineMath>{'\\mathrm{sinc}\\leftrightarrow\\mathrm{rect}'}</InlineMath> του
            τυπολογίου):
            <BlockMath>{'M(f) = \\tfrac{1}{W}\\,\\mathrm{rect}\\!\\left(\\tfrac{f}{W}\\right),\\qquad |f| < \\tfrac{W}{2}'}</BlockMath>
            επίπεδο ύψος <InlineMath>{'1/W'}</InlineMath>, <strong>μισό-εύρος{' '}
            <InlineMath>{'W/2'}</InlineMath></strong>.
          </li>
          <li>
            <strong>
              <InlineMath>{'k(t) = \\mathrm{sinc}^2(Wt)'}</InlineMath>
            </strong>{' '}
            — εδώ είναι το <em>τετράγωνο</em>. Και πολλαπλασιασμός στον χρόνο σημαίνει{' '}
            <strong>συνέλιξη στη συχνότητα</strong>: αφού{' '}
            <InlineMath>{'\\mathrm{sinc}^2 = \\mathrm{sinc}\\cdot\\mathrm{sinc}'}</InlineMath>, το{' '}
            <InlineMath>{'K(f) = M(f) * M(f) = \\mathrm{rect} * \\mathrm{rect}'}</InlineMath> — και
            η συνέλιξη δύο rect δίνει <strong>τρίγωνο</strong>:
            <BlockMath>{'K(f) = \\tfrac{1}{W}\\,\\mathrm{tri}\\!\\left(\\tfrac{f}{W}\\right),\\qquad |f| < W'}</BlockMath>
            κορυφή <InlineMath>{'1/W'}</InlineMath> στο <InlineMath>{'f=0'}</InlineMath>, γραμμικά
            στο 0 στα <InlineMath>{'|f| = W'}</InlineMath> — <strong>μισό-εύρος{' '}
            <InlineMath>{'W'}</InlineMath></strong>.
          </li>
        </ul>
        <p>
          <strong>Με απλά λόγια — το τετράγωνο διπλασιάζει το εύρος.</strong> Συνελίσσοντας δύο
          rect μισού-εύρους <InlineMath>{'W/2'}</InlineMath>, το αποτέλεσμα απλώνεται ως το{' '}
          <InlineMath>{'\\tfrac{W}{2} + \\tfrac{W}{2} = W'}</InlineMath>: το{' '}
          <InlineMath>{'k'}</InlineMath> έχει <strong>διπλάσιο</strong> φασματικό εύρος από το{' '}
          <InlineMath>{'m'}</InlineMath> (
          <Link
            href="/practice#exercise:proodos26-8"
            className="text-accent underline-offset-2 hover:underline"
          >
            βλ. ΘΕΜΑ 8
          </Link>
          ). Το μεταφερόμενο: <em>τετράγωνο στον χρόνο ⇒ αυτοσυνέλιξη στη συχνότητα ⇒ πιο πλατύ,
          πιο ομαλό φάσμα</em>. Και τα δύο φάσματα είναι εδώ <strong>αυστηρά bandlimited</strong>{' '}
          (rect και τρίγωνο έχουν πεπερασμένη υποστήριξη) — άρα το σχέδιο είναι <em>ακριβές</em>,
          δεν έχουμε ουρές να κόψουμε.
        </p>

        <p>
          <strong>(2) Τα διαμορφωμένα φάσματα — η USSB κρατά μόνο την πάνω πλευρική.</strong> Το
          DSB-SC θα έβαζε <em>και τις δύο</em> πλευρικές γύρω από κάθε{' '}
          <InlineMath>{'\\pm f_c'}</InlineMath>. Η USSB κρατά <strong>μόνο την πάνω</strong>: η
          λοβή ξεκινά <em>πάνω στο φέρον</em> και απλώνεται προς τα πάνω κατά ακριβώς το bandwidth
          του μηνύματος, με σχήμα <strong>το θετικό μισό του baseband</strong>.
        </p>
        <ul className="ml-5 list-disc space-y-1 text-fg-muted">
          <li>
            <strong>
              Το <InlineMath>{'m'}</InlineMath> στο <InlineMath>{'f_1'}</InlineMath>:
            </strong>{' '}
            το θετικό μισό του <InlineMath>{'M(f)'}</InlineMath> (επίπεδο στο{' '}
            <InlineMath>{'[0,\\, W/2]'}</InlineMath>) σηκώνεται στο φέρον ⇒ <strong>rect</strong>{' '}
            από <InlineMath>{'f_1'}</InlineMath> έως <InlineMath>{'f_1 + W/2'}</InlineMath> (πλάτος
            ζώνης <InlineMath>{'W/2'}</InlineMath>), και κατοπτρικά{' '}
            <InlineMath>{'[-f_1 - W/2,\\, -f_1]'}</InlineMath>.
          </li>
          <li>
            <strong>
              Το <InlineMath>{'k'}</InlineMath> στο <InlineMath>{'f_2'}</InlineMath>:
            </strong>{' '}
            το θετικό μισό του <InlineMath>{'K(f)'}</InlineMath> είναι η <em>κατηφόρα</em> του
            τριγώνου (κορυφή στο <InlineMath>{'f=0'}</InlineMath>, μηδέν στο{' '}
            <InlineMath>{'f=W'}</InlineMath>). Σηκωμένο στο φέρον γίνεται{' '}
            <strong>ορθογώνιο τρίγωνο</strong> με <em>κορυφή πάνω στο{' '}
            <InlineMath>{'f_2'}</InlineMath></em>, πέφτοντας γραμμικά στο 0 στο{' '}
            <InlineMath>{'f_2 + W'}</InlineMath> (πλάτος ζώνης <InlineMath>{'W'}</InlineMath>), και
            κατοπτρικά γύρω από <InlineMath>{'-f_2'}</InlineMath>.
          </li>
        </ul>
        <p>
          <strong>Πρόσεξε πού πάει η κορυφή.</strong> Η κορυφή του τριγώνου είναι στο{' '}
          <InlineMath>{'f=0'}</InlineMath> του baseband — και το{' '}
          <InlineMath>{'f=0'}</InlineMath> αντιστοιχεί <em>ακριβώς στο φέρον</em>. Γι' αυτό η USSB
          λοβή του <InlineMath>{'k'}</InlineMath> έχει την κορυφή της <strong>κολλητά στο{' '}
          <InlineMath>{'f_2'}</InlineMath></strong> και πέφτει προς τα έξω — όχι ανάποδα. Το{' '}
          <strong>σχήμα διατηρείται</strong>· απλώς επιζεί <strong>μία</strong> πλευρική αντί για
          δύο. Αυτό είναι το μεταφερόμενο κλειδί: ξέροντάς το, σχεδιάζεις την USSB{' '}
          <em>οποιουδήποτε</em> baseband, όχι μόνο αυτών των δύο.
        </p>
        <p className="text-sm text-fg-muted">
          (Το ύψος κάθε διαμορφωμένης λοβής κλιμακώνεται με τη σταθερά διαμόρφωσης{' '}
          <InlineMath>{'A_c'}</InlineMath>· στο «σχηματικά» μετράει το <strong>σχήμα</strong>, το{' '}
          <strong>εύρος</strong> και η <strong>θέση</strong>, όχι η ακριβής τιμή του ύψους. Οι δύο
          κορυφές βγαίνουν ίσες, όπως και τα δύο baseband — και τα δύο έχουν κορυφή{' '}
          <InlineMath>{'1/W'}</InlineMath>.)
        </p>

        <div className="my-3 rounded-md border border-border bg-bg-subtle px-3 py-2 text-xs text-fg-muted">
          <strong className="text-fg">Τι ζητάει — και τι όχι — αυτό το θέμα.</strong> Το ΘΕΜΑ 11
          ζητά <em>μόνο</em> τα τέσσερα φάσματα (δύο baseband + δύο διαμορφωμένα). Η{' '}
          <em>συνθήκη</em> για τα <InlineMath>{'f_1, f_2'}</InlineMath> ώστε να μην επικαλύπτονται
          είναι το{' '}
          <Link
            href="/practice#exercise:proodos26-12"
            className="text-accent underline-offset-2 hover:underline"
          >
            ΘΕΜΑ 12
          </Link>
          , και το <em>πολυπλεγμένο</em> <InlineMath>{'G(f)'}</InlineMath> το{' '}
          <Link
            href="/practice#exercise:proodos26-13"
            className="text-accent underline-offset-2 hover:underline"
          >
            ΘΕΜΑ 13
          </Link>
          . Το σχέδιο είναι <strong>σχηματικό</strong>: τα <InlineMath>{'f_1, f_2'}</InlineMath>{' '}
          είναι αυθαίρετα φέροντα και οι άξονες μετριούνται σε σχετικές μονάδες του{' '}
          <InlineMath>{'W'}</InlineMath>.
        </div>

        <figure className="my-4">
          <FdmCanonicalProblemViz mBW={0.5} kBW={1} kShape="triangle" />
          <figcaption className="mt-2 text-xs text-fg-subtle">
            Η draw-απάντηση ζωντανή, σε σχετικές μονάδες του <InlineMath>{'W'}</InlineMath>. Τα δύο
            πάνω panels = τα baseband: <InlineMath>{'M(f)'}</InlineMath> = το rect μπλοκ στο{' '}
            <InlineMath>{'[-W/2,\\, W/2]'}</InlineMath> (το bracket «<InlineMath>{'W'}</InlineMath>»
            είναι το συνολικό πλάτος)· <InlineMath>{'K(f)'}</InlineMath> = το τρίγωνο στο{' '}
            <InlineMath>{'[-W,\\, W]'}</InlineMath> (το bracket «<InlineMath>{'2W'}</InlineMath>»
            είναι η βάση — διπλάσιο εύρος). Το panel «Modulated USSB»{' '}
            <strong>είναι η απάντηση του ΘΕΜΑΤΟΣ 11</strong>: το <InlineMath>{'m'}</InlineMath>{' '}
            γίνεται rect στο <InlineMath>{'[f_1,\\, f_1 + W/2]'}</InlineMath>, το{' '}
            <InlineMath>{'k'}</InlineMath> γίνεται τρίγωνο με κορυφή στο{' '}
            <InlineMath>{'f_2'}</InlineMath> και βάση ως το <InlineMath>{'f_2 + W'}</InlineMath> (+
            κάτοπτρα στις αρνητικές). Το κάτω panel <InlineMath>{'G(f)'}</InlineMath> και ο
            ολισθητής απόστασης <em>προεπισκοπούν</em> τα ΘΕΜΑΤΑ 12–13. Γύρισε τον διακόπτη σε{' '}
            <strong>DSB-SC</strong> και δες κάθε λοβή να διπλασιάζεται (το τρίγωνο
            ξανα-κεντράρεται στο <InlineMath>{'f_2'}</InlineMath>) — το κόστος που γλιτώνει η USSB.
          </figcaption>
        </figure>

        <div className="my-3 rounded-md border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🧭 Μοτίβο αναγνώρισης</strong>
          <span className="text-fg-muted">
            {' '}— μόλις δεις «σχεδίασε το φάσμα ενός SSB σήματος», τρέξε τρία βήματα, ό,τι κι αν
            είναι το μήνυμα: (1) <strong>βρες το baseband φάσμα</strong> — πρόσεξε το σχήμα: sinc
            στον χρόνο → rect, <InlineMath>{'\\mathrm{sinc}^2'}</InlineMath> → τρίγωνο,
            rect-στον-χρόνο → sinc (<em>πολλαπλασιασμός στον χρόνο = συνέλιξη στη συχνότητα</em>);
            (2) <strong>USSB ⇒ κράτα μόνο την πάνω πλευρική</strong> ⇒ η λοβή ξεκινά στο φέρον και
            απλώνεται <em>προς τα πάνω</em> κατά το bandwidth, με σχήμα το θετικό μισό του baseband
            (η κορυφή του baseband πάει κολλητά στο φέρον); (3) <strong>σχεδίασε πάντα και το
            κάτοπτρο</strong> στις αρνητικές. Για <strong>LSSB</strong> αλλάζει μόνο το βήμα (2):
            κρατάς την κάτω πλευρική ⇒ η λοβή απλώνεται <em>προς τα κάτω</em> από το φέρον. Αυτά τα
            τρία σε βγάζουν σε <em>οποιοδήποτε</em> σχήμα × USSB/LSSB χωρίς να θυμάσαι αυτό το
            συγκεκριμένο σχέδιο.
          </span>
        </div>

        <div className="my-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm">
          <strong className="text-fg">🎯 Παραλλαγές για εξάσκηση</strong>
          <span className="text-fg-muted"> — ίδιος σκελετός, αλλαγμένη μία επιλογή:</span>
          <ul className="ml-5 mt-1.5 list-disc space-y-1 text-fg-muted">
            <li>
              <strong>LSSB αντί USSB.</strong> Κράτα την <em>κάτω</em> πλευρική: το{' '}
              <InlineMath>{'m'}</InlineMath> γίνεται rect στο{' '}
              <InlineMath>{'[f_1 - W/2,\\, f_1]'}</InlineMath>, το <InlineMath>{'k'}</InlineMath>{' '}
              τρίγωνο με κορυφή πάλι στο <InlineMath>{'f_2'}</InlineMath> αλλά πέφτοντας{' '}
              <em>προς τα κάτω</em> ως το <InlineMath>{'f_2 - W'}</InlineMath>. Ίδια σχήματα,
              καθρεφτισμένη επιλογή πλευρικής. (Δες{' '}
              <Link
                href="/practice#exercise:pb25-th2-3"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 2.3
              </Link>
              , LSSB με sinc μήνυμα.)
            </li>
            <li>
              <strong>DSB-SC αντί USSB.</strong> Κάθε κανάλι γίνεται διπλής πλευρικής ⇒ το{' '}
              <InlineMath>{'m'}</InlineMath> πιάνει <InlineMath>{'W'}</InlineMath> (
              <InlineMath>{'[f_1 - W/2,\\, f_1 + W/2]'}</InlineMath>), το{' '}
              <InlineMath>{'k'}</InlineMath> πιάνει <InlineMath>{'2W'}</InlineMath> (πλήρες τρίγωνο
              κεντραρισμένο στο <InlineMath>{'f_2'}</InlineMath>). Γύρισε τον διακόπτη του viz σε
              DSB-SC και επιβεβαίωσέ το — η ελάχιστη απόσταση πηδά από{' '}
              <InlineMath>{'W/2'}</InlineMath> στο{' '}
              <InlineMath>{'\\tfrac{W}{2} + W = \\tfrac{3W}{2}'}</InlineMath> (άθροισμα των δύο
              μισών-ευρών). (Η DSB-SC FDM με άνισα εύρη είναι ακριβώς το{' '}
              <Link
                href="/practice#exercise:pb25-th3-mux"
                className="text-accent underline-offset-2 hover:underline"
              >
                Πρόοδ. Β 2025 ΘΕΜΑ 3
              </Link>
              .)
            </li>
            <li>
              <strong>Αντίστρεψε τα σχήματα.</strong> Αν ήταν{' '}
              <InlineMath>{'m(t) = \\mathrm{sinc}^2(Wt)'}</InlineMath> (τρίγωνο, εύρος{' '}
              <InlineMath>{'W'}</InlineMath>) και{' '}
              <InlineMath>{'k(t) = \\mathrm{sinc}(Wt)'}</InlineMath> (rect, εύρος{' '}
              <InlineMath>{'W/2'}</InlineMath>), οι δύο USSB λοβές απλώς <em>ανταλλάσσουν</em>{' '}
              σχήμα — ξαναϋπολόγισε μόνο το βήμα (1). Καλό τεστ ότι κατάλαβες πως το σχήμα της
              λοβής το ορίζει το baseband, όχι το φέρον.
            </li>
          </ul>
        </div>
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
    repeatGroup: 'am-vs-fm-comparison',
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
        έκαστο — ζητούνται ρητά μόνο εδώ και στην ίδια ερώτηση όπως
        ξαναδόθηκε τον Ιούνιο 2026):{' '}
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
            πιο ζεστός, τόσο πιο έντονα. Αυτό το ατελείωτο, τυχαίο
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
          από τη θερμική διέγερση των ηλεκτρονίων μέσα στον αγωγό:
          δισεκατομμύρια ανεξάρτητα, αστραπιαία τινάγματα φορτίου. Επειδή είναι
          ασυσχέτιστα και πολύ ταχύτερα από οποιαδήποτε συχνότητα μάς ενδιαφέρει,
          η ισχύς μοιράζεται ομοιόμορφα σε όλο το φάσμα — η PSD είναι επίπεδη
          («λευκή»), σταθερή στο ύψος <InlineMath>{'kT/2'}</InlineMath>:
        </p>
        <BlockMath>{'S_N(f) = \\frac{N_0}{2} = \\frac{kT}{2}\\;\\text{W/Hz},\\qquad N_0 \\triangleq kT,\\quad |f| \\le 10^{12}\\,\\text{Hz}'}</BlockMath>
        <p>
          Από εδώ και πέρα βαφτίζουμε αυτό το ύψος{' '}
          <InlineMath>{'N_0/2'}</InlineMath>, με <InlineMath>{'N_0 \\triangleq kT'}</InlineMath>.
          Δύο πράγματα να κρατήσεις: (i) το ύψος εξαρτάται από τη θερμοκρασία{' '}
          <InlineMath>T</InlineMath>, αλλά (ii) <em>δεν</em> εξαρτάται ούτε από τη
          συχνότητα ούτε από το εύρος ζώνης — είναι το ίδιο παντού. Το «επίπεδο
          μέχρι <InlineMath>{'\\sim 10^{12}'}</InlineMath> Hz» καλύπτει
          κυριολεκτικά όλο το χρήσιμο φάσμα· πιο ψηλά η κβαντική φυσική κάμπτει το
          πάτωμα, αλλά καμία εξέταση K21 δεν πάει εκεί.
        </p>

        <p>
          <strong>Βήμα 2 — ισχύς σε ζώνη <InlineMath>B</InlineMath>: ολοκλήρωσε
          το πάτωμα.</strong> Η μόνη ποσότητα που νιώθει το εύρος ζώνης είναι η
          συνολική ισχύς — το εμβαδόν κάτω από το πάτωμα μέσα στη ζώνη. Ένας
          δέκτης εύρους <InlineMath>B</InlineMath> «βλέπει» τις συχνότητες από{' '}
          <InlineMath>{'-B'}</InlineMath> έως <InlineMath>{'+B'}</InlineMath>{' '}
          (πλάτος <InlineMath>{'2B'}</InlineMath> στη δίψας-όψεως εικόνα), οπότε:
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
          Boltzmann <InlineMath>{'k = 1.38\\times 10^{-23}'}</InlineMath> J/K:
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
          <InlineMath>{'S_X(f) = N_0/2'}</InlineMath>. Άρα η έξοδος
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
            <InlineMath>{'kT/2'}</InlineMath>, σταθερό μέχρι τα{' '}
            <InlineMath>{'\\sim 10^{12}'}</InlineMath> Hz (πιο ψηλά η κβαντική
            φυσική το κάμπτει, αλλά καμία εξέταση K21 δεν πάει τόσο μακριά).{' '}
            <strong>
              Και γιατί <InlineMath>{'/2'}</InlineMath>;
            </strong>{' '}
            Το πάτωμα το ζωγραφίζουμε σε <strong>όλον</strong> τον άξονα — θετικές{' '}
            <em>και</em> αρνητικές συχνότητες (η μαθηματική, δίψας-όψεως εικόνα).
            Μοιράζοντας την ίδια ισχύ σε δύο πλευρές, το ύψος κάθε πλευράς είναι
            το μισό: <InlineMath>{'N_0/2'}</InlineMath>, με{' '}
            <InlineMath>{'N_0 \\triangleq kT'}</InlineMath>. Αν
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
