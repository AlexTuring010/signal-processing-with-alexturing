/**
 * «Σώσε το εξάμηνο» — per-exercise coaching content.
 *
 * Each entry attaches:
 *   - `takeaway` — «Τι κρατάς από αυτή την άσκηση»: the durable pattern.
 *   - `examRadar` — «Πώς θα το αναγνωρίσεις στην εξέταση».
 *
 * Authoring rules:
 *   1. NEVER invent theory. The takeaway distills what the existing
 *      solution already shows; the radar names patterns visible in the
 *      problem statement.
 *   2. 2–3 sentences each. Tight. The student is on a deadline.
 *   3. Greek voice, English technical terms.
 *   4. Be specific to THIS problem.
 *
 * Status: populated lecture-by-lecture in Phase D. The crunch flow works
 * even without coaching — missing ids skip the takeaway/radar blocks.
 */

import type { ExerciseCoaching } from './types'
import { InlineMath } from '@/components/math'

export const SOSE_COACHING: Record<string, ExerciseCoaching> = {
  /* ─────────────────────────────────────────────────────────────────────
   * L01 — Εισαγωγικά (P vs NP recognition)
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th1-q9': {
    takeaway: (
      <>
        Το «αν <InlineMath>{'P \\neq NP'}</InlineMath>, τι μένει εκτός P;»
        διακρίνει NP-πλήρη (μένουν εκτός) από τα γνωστά-σε-P. Παγίδα-κλειδί:{' '}
        <strong>συντομότερο</strong> μονοπάτι είναι στο P, αλλά{' '}
        <strong>μακρύτερο</strong> μονοπάτι είναι NP-πλήρες — δύο λέξεις
        διαφορά, δύο διαφορετικές ζώνες.
      </>
    ),
    examRadar: (
      <>
        Αν δεις λίστα ονομάτων προβλημάτων με την υπόθεση{' '}
        <InlineMath>{'P \\neq NP'}</InlineMath>, ταξινόμησε κάθε όνομα σε «έχω
        πολυωνυμικό αλγόριθμο» (P) ή «κλασικό NP-πλήρες». Συχνά κάποιο από τα
        ονόματα είναι το «παγιδευτικό ζευγάρι» μιας γνωστής P-έκδοσης.
      </>
    ),
  },
  'pt1-th1-q10': {
    takeaway: (
      <>
        «Γνωρίζουμε ότι είναι NP-πλήρες» απαιτεί απόδειξη — δεν αρκεί που είναι
        «δύσκολο» ή «στο NP». Ισομορφισμός Γραφημάτων και Παραγοντοποίηση
        Ακεραίων ζουν στη <strong>μεσαία ζώνη</strong>: στο NP, αλλά δεν
        γνωρίζουμε αν είναι σε P ή NPC. Αυτές είναι σταθερές παγίδες.
      </>
    ),
    examRadar: (
      <>
        Όταν το ερώτημα είναι «ποια είναι NP-πλήρη», ψάξε για τα δύο «άγνωστα»:
        αν εμφανίζεται Graph Isomorphism ή Integer Factorization, αυτά
        αποκλείονται από την απάντηση παρότι μοιάζουν δύσκολα.
      </>
    ),
  },
  'pt2-th1-q9': {
    takeaway: (
      <>
        Ειδικές περιπτώσεις προβλημάτων NP-πλήρων μπορεί να πέφτουν στο P.{' '}
        <strong>2-SAT</strong> (SAT με 2 μεταβλητές/όρο) είναι πολυωνυμικό, ενώ
        το γενικό SAT είναι NP-πλήρες. Επίσης{' '}
        <strong>μέγιστο</strong> συνδετικό δέντρο = MST με αντιστροφή βαρών,
        άρα στο P.
      </>
    ),
    examRadar: (
      <>
        Όταν δεις περιορισμένη παραλλαγή (π.χ. «δύο», «μέγιστο/ελάχιστο
        συνδετικό», «σε δένδρο», «επίπεδο γράφημα»), σκέψου πρώτα αν η ειδική
        περίπτωση λύνεται γρήγορα — πολλές φορές ναι.
      </>
    ),
  },
  'pt2-th1-q10': {
    takeaway: (
      <>
        «Δεν γνωρίζουμε αν είναι NP-πλήρες» είναι ξεχωριστή κατηγορία απαντήσεων.
        Στο μάθημα συναντάς μόνο δύο τέτοια: Παραγοντοποίηση Ακεραίων και
        Ισομορφισμός Γραφημάτων. Όλα τα άλλα ονόματα έχουν ήδη ταξινομηθεί σε P
        ή NPC.
      </>
    ),
    examRadar: (
      <>
        Αν η εκφώνηση ρωτά «ποια <em>δεν γνωρίζουμε</em>», περιόρισε αμέσως την
        αναζήτηση στα δύο γνωστά «άγνωστα». Όλα τα κλασικά NP-πλήρη (SAT,
        Hamilton, Vertex Cover, Knapsack) είναι ξεκάθαρα ταξινομημένα.
      </>
    ),
  },
  'pt4-th1-q1': {
    takeaway: (
      <>
        Η εικασία <InlineMath>{'P \\neq NP'}</InlineMath> κλειδώνει εκτός P
        μόνο τα NP-πλήρη — όχι όσα ήδη ξέρουμε σε P. Το συντομότερο μονοπάτι
        λύνεται με Dijkstra/Bellman-Ford πολυωνυμικά, ανεξάρτητα από το αν{' '}
        <InlineMath>{'P = NP'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όταν Σ/Λ δήλωση χρησιμοποιεί την <InlineMath>{'P \\neq NP'}</InlineMath>{' '}
        για να «αποδείξει» ότι κάτι ΔΕΝ είναι σε P, ρώτα πρώτα{' '}
        <em>«το ξέρουμε ήδη ως P;»</em>. Αν ναι (BFS, Dijkstra, Prim, Kruskal,
        Huffman), η δήλωση είναι Λάθος.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L02 — Ασυμπτωτική ανάλυση
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th1-q1': {
    takeaway: (
      <>
        Όταν και οι δύο συναρτήσεις είναι θετικές σταθερές, ισχύουν αυτόματα{' '}
        <strong>O, Ω, Θ</strong> και αυτόματα όχι <strong>o, ω</strong>. Το{' '}
        «δόλωμα» εδώ είναι το <InlineMath>{'\\log_n n = 1'}</InlineMath> — το
        αναγνωρίζεις από τη βάση που ισούται με το όρισμα.
      </>
    ),
    examRadar: (
      <>
        Αν δεις <InlineMath>{'\\log_n n'}</InlineMath>,{' '}
        <InlineMath>{'\\log_a a'}</InlineMath>, ή{' '}
        <InlineMath>{'a^{\\log_a x}/x'}</InlineMath>, σταμάτησε: η μία από τις
        δύο συναρτήσεις είναι σταθερά. Σχεδόν πάντα ζητάει «κύκλωσε όλες τις
        σχέσεις που ισχύουν» — απάντησε <strong>O, Ω, Θ</strong>.
      </>
    ),
  },
  'pt1-th1-q2': {
    takeaway: (
      <>
        Όροι όπως <InlineMath>{'2^{\\log_2 n}'}</InlineMath> ή{' '}
        <InlineMath>{'n^{\\log n}'}</InlineMath> ΦΑΙΝΟΝΤΑΙ εκθετικοί αλλά
        ανήκουν σε εντελώς διαφορετικές τάξεις. Πάντα πρώτα απλοποίηση{' '}
        (<InlineMath>{'2^{\\log_2 n} = n'}</InlineMath>), μετά σύγκριση.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση έχει «εκθέτη που εξαρτάται από <InlineMath>{'n'}</InlineMath>»{' '}
        (π.χ. <InlineMath>{'n^{\\log n}'}</InlineMath>,{' '}
        <InlineMath>{'2^{\\sqrt n}'}</InlineMath>), σκέψου «υπερ-πολυωνυμικό» —
        ξεπερνά κάθε σταθερή δύναμη του <InlineMath>{'n'}</InlineMath>. Δεν είναι
        ίδιο με <InlineMath>{'n^k'}</InlineMath>.
      </>
    ),
  },
  'pt1-th1-q3': {
    takeaway: (
      <>
        Όταν εμφανίζεται παράμετρος που παίρνει «κάθε τιμή» (όπως η{' '}
        <InlineMath>{'\\tan\\varphi'}</InlineMath> που σαρώνει το{' '}
        <InlineMath>{'\\mathbb{R}'}</InlineMath>), καμία ασυμπτωτική σχέση δεν
        ισχύει σίγουρα. Η σωστή απάντηση είναι «μη-συγκρίσιμες», όχι «δεν
        ξέρω».
      </>
    ),
    examRadar: (
      <>
        Σήματα παγίδας: <InlineMath>{'\\tan'}</InlineMath>, ακαθόριστος εκθέτης,
        «για κάθε <InlineMath>{'k > 0'}</InlineMath>». Αν δεν δίνεται
        συγκεκριμένη τιμή που να περιορίζει τον εκθέτη, η σύγκριση είναι
        αδύνατη — επίλεξε «μη-συγκρίσιμες».
      </>
    ),
  },
  'pt2-th1-q1': {
    takeaway: (
      <>
        Κλείσε το άθροισμα πρώτα — οι τρεις «αναπόφευκτοι» τύποι είναι{' '}
        <InlineMath>{'\\sum i = \\Theta(n^2)'}</InlineMath>,{' '}
        <InlineMath>{'\\sum i^2 = \\Theta(n^3)'}</InlineMath>, και{' '}
        <InlineMath>{'\\sum 1/k = \\Theta(\\log n)'}</InlineMath>. Μετά η
        σύγκριση γίνεται απλή.
      </>
    ),
    examRadar: (
      <>
        Όταν η <InlineMath>{'f'}</InlineMath> είναι άθροισμα, ψάξε για κλειστό
        τύπο πρώτα. Αν δεν θυμάσαι, φράξε με «n φορές το maximum» από πάνω και
        «μισοί όροι ≥ μισό» από κάτω — συνήθως οι δύο φράχτες πέφτουν στην ίδια
        τάξη.
      </>
    ),
  },
  'pt2-th1-q2': {
    takeaway: (
      <>
        Δύο «τρομακτικές» εκφράσεις απλοποιούνται και οι δύο. Αναγνώρισε τον
        αρμονικό αριθμό (<InlineMath>{'\\Theta(\\log n)'}</InlineMath>) και τη
        ταυτότητα <InlineMath>{'\\log\\sqrt x = \\tfrac12 \\log x'}</InlineMath>,
        και η σύγκριση καταρρέει σε «log n vs log log n».
      </>
    ),
    examRadar: (
      <>
        Αν δεις <InlineMath>{'\\sum 1/k'}</InlineMath>, σκέψου αμέσως{' '}
        <InlineMath>{'\\Theta(\\log n)'}</InlineMath>. Αν δεις λογάριθμο ρίζας,
        γράψε <InlineMath>{'\\sqrt x = x^{1/2}'}</InlineMath> και κατέβασε τον
        εκθέτη. Σχεδόν κάθε «εξωτικός» όρος του L02 ανάγεται σε γνωστή τάξη.
      </>
    ),
  },
  'pt4-th1-q2': {
    takeaway: (
      <>
        <InlineMath>{'f + g = \\Theta(\\max\\{f, g\\})'}</InlineMath> πάντα,
        για θετικές <InlineMath>{'f, g'}</InlineMath>. Η σφήνα{' '}
        <InlineMath>{'M \\le f+g \\le 2M'}</InlineMath> είναι ο ορισμός του Θ.
        Η υπόθεση «<InlineMath>{'f \\ne g'}</InlineMath>» είναι δόλωμα — άσχετη.
      </>
    ),
    examRadar: (
      <>
        Όταν Σ/Λ δίνει αθροίσματα ή <InlineMath>{'\\max'}</InlineMath>, ψάξε για
        «σφήνα από δύο σταθερά πολλαπλάσια». Αν τη βρεις, Θ ισχύει.
      </>
    ),
  },
  'pt4-th1-q5': {
    takeaway: (
      <>
        <InlineMath>{'1 + 2 + \\cdots + n = n(n+1)/2 = \\Theta(n^2)'}</InlineMath>.
        Ο πιο συχνός κλειστός τύπος του μαθήματος — εμφανίζεται κάθε φορά που
        έχεις διπλό βρόχο <InlineMath>{'i = 1..n, j = 1..i'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Αν βλέπεις στοιχειώδεις τύπους Gauss, σκέψου «τριγωνική δομή». Δύο
        εμφωλευμένοι βρόχοι, εσωτερικός εξαρτώμενος από εξωτερικό →{' '}
        <InlineMath>{'\\Theta(n^2)'}</InlineMath> ή{' '}
        <InlineMath>{'\\Theta(n^3)'}</InlineMath> ανάλογα με τον βαθμό.
      </>
    ),
  },
  'pt5-th1b': {
    takeaway: (
      <>
        Όταν δύο εκφράσεις είναι τεράστιες (πύργοι εκθετικού), πάρε{' '}
        <strong>λογάριθμο και στις δύο</strong>. Η σύγκριση διατηρείται και
        μεταφέρεται σε αναγνωρίσιμες τάξεις. Εδώ: πολυωνυμικός όρος{' '}
        (<InlineMath>{'\\sqrt n'}</InlineMath>) μέσα στον εκθέτη της{' '}
        <InlineMath>{'f'}</InlineMath> νικάει πολυλογάριθμο{' '}
        (<InlineMath>{'\\log^3 n'}</InlineMath>) στον εκθέτη της{' '}
        <InlineMath>{'g'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Πύργοι του τύπου <InlineMath>{'c^{u(n)}'}</InlineMath> ή{' '}
        <InlineMath>{'a^{b^n}'}</InlineMath> → πάρε λογάριθμο πρώτα. Μετά,
        ιεραρχία: σταθερά &lt; log &lt; πολυώνυμο &lt; εκθετικό.
      </>
    ),
  },
  'pt5-th2-a': {
    takeaway: (
      <>
        Όταν συγκρίνεις δύο δυνάμεις της ίδιας βάσης (συνήθως <InlineMath>{'2'}</InlineMath>),
        αρκεί να συγκρίνεις τους εκθέτες. Εδώ:{' '}
        <InlineMath>{'\\sqrt{\\log n}'}</InlineMath> vs{' '}
        <InlineMath>{'\\log n'}</InlineMath> — η ρίζα χάνει εύκολα από τον
        αριθμό.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση έχει εκθετική με «παράξενο» εκθέτη (<InlineMath>{'2^{\\sqrt{\\log n}}'}</InlineMath>,{' '}
        <InlineMath>{'3^{\\log\\log n}'}</InlineMath>), γράψε το{' '}
        <InlineMath>{'n'}</InlineMath> ως <InlineMath>{'2^{\\log n}'}</InlineMath>{' '}
        και σύγκρινε εκθέτες.
      </>
    ),
  },
  'front-set-1-ask0': {
    takeaway: (
      <>
        Όροι όπως <InlineMath>{'2^{\\log n}'}</InlineMath>,{' '}
        <InlineMath>{'3^{\\log_3 n}'}</InlineMath>,{' '}
        <InlineMath>{'c^{\\log_c x}'}</InlineMath> είναι «ψευδο-εκθετικοί» — απλώς{' '}
        <InlineMath>{'n'}</InlineMath> ή <InlineMath>{'x'}</InlineMath>{' '}
        μεταμφιεσμένα. Απλοποιείς πρώτα, μετά κρατάς τον κυρίαρχο, μετά εφαρμόζεις
        ιεραρχία.
      </>
    ),
    examRadar: (
      <>
        Αν δεις <InlineMath>{'a^{\\log_a \\bullet}'}</InlineMath>, η εκθετική
        αλληλοαναιρείται με τον λογάριθμο. Πρόσεξε: αυτό δεν ισχύει για{' '}
        <InlineMath>{'a^{\\log_b \\bullet}'}</InlineMath> με{' '}
        <InlineMath>{'a \\ne b'}</InlineMath> — εκεί χρειάζεσαι αλλαγή βάσης.
      </>
    ),
  },
  'front-set-1-ask1': {
    takeaway: (
      <>
        Σπάνια συγκρίνεις τις πραγματικές εκφράσεις. Πρώτα απλοποιείς κάθε μία
        σε γνωστή Θ-class (Θ(1), Θ(log), Θ(n^k), Θ(c^n), Θ(n!)), μετά διατάσσεις.
        Πρόσεξε δύο εξωτικές περιπτώσεις: όροι που αλληλοαναιρούνται σε σταθερά,
        και ζευγάρια που πέφτουν στην ίδια Θ — εκεί χρειάζεσαι σύγκριση
        συντελεστών.
      </>
    ),
    examRadar: (
      <>
        Όταν σου ζητάνε «διάταξε 5 συναρτήσεις», ξεκίνα γράφοντας δίπλα σε κάθε
        μια το <em>Θ-class</em>. Σχεδόν πάντα η διάταξη είναι προφανής αφού το
        κάνεις αυτό. Παγίδες: σταθερές που μοιάζουν μεγάλες
        (<InlineMath>{'4002^{4002}'}</InlineMath>) και logarithmic
        αλληλοαναιρέσεις.
      </>
    ),
  },
  'front-set-1-ask3': {
    takeaway: (
      <>
        Διάβασε το <em>state</em> του προγράμματος ΠΡΙΝ από κάθε βρόχο. Εδώ ο
        εσωτερικός <code>for j ← 1 to m</code> δεν τρέχει ποτέ γιατί ο{' '}
        <InlineMath>{'m'}</InlineMath> έχει γίνει ήδη <InlineMath>{'\\le 0'}</InlineMath>.
        Το πραγματικό κόστος είναι <InlineMath>{'O(n \\log^* n)'}</InlineMath> —{' '}
        όχι <InlineMath>{'O(n^2)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όταν δεις «<code>while m ← log m</code>» ή <code>while m ← √m</code>,
        αναγνώρισε τον <strong>επαναλαμβανόμενο λογάριθμο</strong> (log*) —
        σχεδόν σταθερά για όλα τα ρεαλιστικά <InlineMath>{'n'}</InlineMath>. Και
        έλεγχε αν επόμενοι βρόχοι χρησιμοποιούν τιμή που τελικά έγινε &le; 0.
      </>
    ),
  },
  'front-set-2-ask2': {
    takeaway: (
      <>
        Τέσσερα «αναπόφευκτα» αθροίσματα του μαθήματος:{' '}
        <InlineMath>{'H_n = \\Theta(\\log n)'}</InlineMath>,{' '}
        <InlineMath>{'\\log(n!) = \\Theta(n \\log n)'}</InlineMath>,{' '}
        <InlineMath>{'\\sum \\binom{n}{k} = 2^n'}</InlineMath>, και κάθε
        συνάρτηση είναι <InlineMath>{'\\Theta'}</InlineMath> του εαυτού της.
      </>
    ),
    examRadar: (
      <>
        Τα γνώριμα αθροίσματα-σταθερές πρόκειται για «αυτόματο σωστό» — μάθε τα.
        Αν εμφανίζεται αρμονικός, παραγοντικός, διωνυμικός, ή αναγνώριση
        εαυτού, η απάντηση είναι σχεδόν πάντα «ΣΩΣΤΟ».
      </>
    ),
  },
  'front-set-2-ask0': {
    takeaway: (
      <>
        Για πύργους του τύπου <InlineMath>{'a^{u(n)}'}</InlineMath>, πάρε log:
        η σύγκριση γίνεται <InlineMath>{'u(n)\\log a'}</InlineMath> vs{' '}
        <InlineMath>{'v(n)\\log b'}</InlineMath>. Πρόσεξε σταθερές που
        μεταμφιέζονται σε «τέρατα» (<InlineMath>{'4002^{4002}'}</InlineMath> ΕΙΝΑΙ
        σταθερά, όχι συνάρτηση) και ζευγάρια ίδιας Θ-class.
      </>
    ),
    examRadar: (
      <>
        Όταν βλέπεις «4002», «1000» ή άλλες ασυνήθιστες σταθερές, αναρωτήσου
        αμέσως αν είναι σταθερή ή συνάρτηση του <InlineMath>{'n'}</InlineMath>.
        Αν δεν εμφανίζεται <InlineMath>{'n'}</InlineMath> πουθενά, είναι{' '}
        <InlineMath>{'\\Theta(1)'}</InlineMath>.
      </>
    ),
  },
  'front-set-2-ask1': {
    takeaway: (
      <>
        Για κάτω φράγμα σε αναμενόμενο χρόνο, αρκεί ΜΙΑ ζώνη με αρκετή
        πιθανότητα × αρκετό κόστος. Για άνω, κάθε κόστος ≤ max και πιθανότητες
        αθροίζουν σε 1. Συνήθως τα δύο πέφτουν στην ίδια τάξη.
      </>
    ),
    examRadar: (
      <>
        «Αναμενόμενος χρόνος» = <InlineMath>{'\\sum p_i \\cdot \\text{cost}_i'}</InlineMath>.
        Όταν η εκφώνηση έχει ξεχωριστή κατανομή πιθανοτήτων, ψάξε για ζώνη με{' '}
        <InlineMath>{'p \\ge 1/c'}</InlineMath> και κόστος{' '}
        <InlineMath>{'\\ge n/c'}</InlineMath> — αυτή κλειδώνει το{' '}
        <InlineMath>{'\\Omega(n)'}</InlineMath>.
      </>
    ),
  },
  'front-set-2-ask3': {
    takeaway: (
      <>
        Το <InlineMath>{'O'}</InlineMath> ΔΕΝ διατηρείται κάτω από
        εκθετικοποίηση: σταθερός παράγοντας στον εκθέτη γίνεται εκθετικός
        παράγοντας έξω. Συμμετρικό κόλπο για σφήνες: κάθε όρος αθροίσματος
        φραγμένος μεταξύ σταθερών → άθροισμα <InlineMath>{'\\Theta(n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σ/Λ με «αν <InlineMath>{'f = O(g)'}</InlineMath> τότε{' '}
        <InlineMath>{'h(f) = O(h(g))'}</InlineMath>» → ψάξε αντιπαράδειγμα όταν
        η <InlineMath>{'h'}</InlineMath> είναι μη-γραμμική. Σχεδόν πάντα η
        δήλωση είναι ΛΑΘΟΣ — η εκθετική το σπάει.
      </>
    ),
  },
  'front-set-2-ask5': {
    takeaway: (
      <>
        Δύο κλασικά κόλπα: (α) «ίδια βάση» για σύγκριση εκθετών· (β) εκθετική
        με βάση <InlineMath>{'< 1'}</InlineMath> καταρρέει και νικά κάθε
        πολυωνυμικό μπροστά της.
      </>
    ),
    examRadar: (
      <>
        Όταν εμφανίζεται κλάσμα <InlineMath>{'a^n / b^n = (a/b)^n'}</InlineMath>{' '}
        με <InlineMath>{'a < b'}</InlineMath>, αμέσως «εκθετική κατάρρευση
        → o(1)». Πολυωνυμικά πριν δεν σώζουν τίποτα.
      </>
    ),
  },
  'front-set-2-ask6': {
    takeaway: (
      <>
        Για εμφωλευμένους βρόχους + CALC: από μέσα προς τα έξω, πολλαπλασίαζε
        τάξεις. Βήμα μη-μοναδιαίο (π.χ. 0.1) είναι σταθερά. Όριο εξαρτώμενο από
        εξωτερικό δείκτη απαιτεί άθροισμα, όχι απλό πολλαπλασιασμό.
      </>
    ),
    examRadar: (
      <>
        Τρεις εμφωλευμένοι βρόχοι ανεξάρτητοι σε <InlineMath>{'n'}</InlineMath>{' '}
        → <InlineMath>{'\\Theta(n^3)'}</InlineMath> ή υψηλότερα. CALC με{' '}
        <InlineMath>{'\\sqrt{w}'}</InlineMath>: γρήγορη επιπλέον δύναμη του{' '}
        <InlineMath>{'n^{1/2}'}</InlineMath>.
      </>
    ),
  },
  'front-set-2-ask7': {
    takeaway: (
      <>
        Έξι «αρχέτυπες μάχες» καλύπτουν σχεδόν κάθε ζευγάρι: (1) polylog vs
        polynomial· (2) poly vs exp· (3) oscillating exponent → ασύγκριτες· (4)
        ίδια βάση, διαφορετικός εκθέτης· (5) η ταυτότητα{' '}
        <InlineMath>{'n^{\\log c} = c^{\\log n}'}</InlineMath>· (6) log(n!) ≈
        log(n^n) ≈ n log n.
      </>
    ),
    examRadar: (
      <>
        Πίνακας 6-ζευγαριών × 5-συμβόλων είναι κλασικό format. Λύσε κάθε γραμμή
        αναγνωρίζοντας σε ποια από τις 6 «μάχες» πέφτει — μετά γέμισε τα 5 chips
        με τις γνωστές κανόνες.
      </>
    ),
  },
  'front-set-2-ask4': {
    takeaway: (
      <>
        Όταν δεν μπορείς να υπολογίσεις απευθείας μια συνάρτηση, βρες
        μικρότερη/μεγαλύτερη με ίδια Θ-class και σφηνώσου. Παρομοίως, για{' '}
        <InlineMath>{'a^{H_n}'}</InlineMath>: ο αρμονικός{' '}
        <InlineMath>{'H_n \\approx \\ln n'}</InlineMath> το μετατρέπει σε{' '}
        <InlineMath>{'n^{\\ln a}'}</InlineMath> — πολυώνυμο με μη-ακέραιο εκθέτη.
      </>
    ),
    examRadar: (
      <>
        Όταν διατάσσεις 4 συναρτήσεις με μη-ακέραιους εκθέτες, σκέψου ότι ο{' '}
        <InlineMath>{'n^{1.6}'}</InlineMath> κάθεται ανάμεσα στο{' '}
        <InlineMath>{'n'}</InlineMath> και στο <InlineMath>{'n^2'}</InlineMath>.
        Αν εμφανίζεται <InlineMath>{'a^{H_n}'}</InlineMath>, σκέψου{' '}
        <InlineMath>{'n^{\\ln a}'}</InlineMath>.
      </>
    ),
  },
  'front-set-4-e0-ask6': {
    takeaway: (
      <>
        Τρεις εμφωλευμένοι βρόχοι ανεξάρτητοι σε <InlineMath>{'n'}</InlineMath>{' '}
        → πολλαπλασιάζεις: <InlineMath>{'O(n) \\cdot O(n^2) \\cdot O(n) = O(n^4)'}</InlineMath>.
        Βήμα <InlineMath>{'0.1'}</InlineMath> είναι σταθερά — δεν αλλάζει την
        τάξη.
      </>
    ),
    examRadar: (
      <>
        Όταν ο εσωτερικός βρόχος έχει «<code>step 0.1</code>» ή άλλο
        μη-μοναδιαίο βήμα, μέτρα <InlineMath>{'\\text{όριο} / \\text{βήμα}'}</InlineMath> —
        όχι μόνο το όριο. Σταθερό βήμα παραμένει σταθερά στην τάξη.
      </>
    ),
  },
  'front-set-4-thema4': {
    takeaway: (
      <>
        Δύο διαφορετικά «εσωτερικά» μαθήματα: (a) CALC που χτίζει αθροιστή{' '}
        <InlineMath>{'1+2+\\cdots+i'}</InlineMath> τερματίζει στο{' '}
        <InlineMath>{'i \\approx \\sqrt{2m}'}</InlineMath> — δηλαδή{' '}
        <InlineMath>{'O(\\sqrt m)'}</InlineMath>. (b) «<code>step (2j)</code>»
        σημαίνει <InlineMath>{'j \\leftarrow 3j'}</InlineMath> — γεωμετρικό,{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα γεωμετρικού βρόχου: το βήμα είναι <em>συνάρτηση του δείκτη</em>{' '}
        (όχι σταθερά). Αυτό δίνει logarithmic επαναλήψεις. Σήμα{' '}
        <InlineMath>{'\\sqrt m'}</InlineMath> κόστους: while που χτίζει
        τετραγωνικό αθροιστή.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L03 — Διαίρει και κυρίευε I (mergesort, Master Theorem,
   *       αναδρομές με ρίζες/τηλεσκόπηση/χαρακτηριστικές εξισώσεις)
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th1-q4': {
    takeaway: (
      <>
        Όποτε δεις <InlineMath>{'\\sqrt{n}'}</InlineMath> στο όρισμα μιας
        αναδρομής, η μόνη ασφαλής συνταγή είναι{' '}
        <strong>θέσε <InlineMath>{'n = 2^m'}</InlineMath></strong>. Η ρίζα
        γίνεται υποδιπλασιασμός, Master Theorem εφαρμόζεται, και στο τέλος
        επιστρέφεις <InlineMath>{'m = \\log n'}</InlineMath>. Το «αποτύπωμα»
        στην απάντηση είναι ένα <strong>διπλό log</strong> (
        <InlineMath>{'\\Theta(\\log\\log n)'}</InlineMath>).
      </>
    ),
    examRadar: (
      <>
        Σήματα: <InlineMath>{'T(\\sqrt n)'}</InlineMath>,{' '}
        <InlineMath>{'T(\\sqrt[k]{n})'}</InlineMath>. Άμεσα γράψε «θέτω n=2ᵐ».
        Αν a=1 (μία κλήση): απάντηση Θ(log log n). Αν a≥2: μετατρέπεται σε
        Master Theorem περίπτωση 1 → πολυώνυμο του m → log n (όχι log log n).
      </>
    ),
  },
  'pt1-th1-q5': {
    takeaway: (
      <>
        Η <InlineMath>{'2T(n/2)+n'}</InlineMath> είναι η ίδια αναδρομή της
        mergesort: Master Theorem περίπτωση 2 →{' '}
        <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>. Η πιο κοινή
        αναδρομή του μαθήματος — αναγνώρισέ τη χωρίς υπολογισμούς.
      </>
    ),
    examRadar: (
      <>
        <InlineMath>{'2T(n/2)+n'}</InlineMath>,{' '}
        <InlineMath>{'2T(n/2)+\\Theta(n)'}</InlineMath>, ή κάθε{' '}
        <InlineMath>{'aT(n/b)+f'}</InlineMath> όπου ισχύει{' '}
        <InlineMath>{'\\log_b a = d'}</InlineMath> ⇒ <strong>πάντα</strong>{' '}
        <InlineMath>{'\\Theta(n^d \\log n)'}</InlineMath>.
      </>
    ),
  },
  'pt1-th4': {
    takeaway: (
      <>
        Η ύψωση σε δύναμη με <em>τετραγωνισμό</em> μετατρέπει το{' '}
        <InlineMath>{'O(n)'}</InlineMath> σε{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> με μία ταυτότητα:{' '}
        <InlineMath>{'m^n = (m^{n/2})^2'}</InlineMath>. Δομικό μοτίβο D&amp;C —
        αναγνώρισέ το όποτε το «πρόβλημα» μειώνεται με μία πράξη που εφαρμόζεται
        στον εαυτό του.
      </>
    ),
    examRadar: (
      <>
        Όποτε ζητείται «αποδοτικός υπολογισμός δύναμης» (αριθμού, πίνακα, modular),
        η απάντηση είναι <InlineMath>{'O(\\log n)'}</InlineMath> με τετραγωνισμό.
        Παγίδα: γράψε <InlineMath>{'(\\text{Power}(m, n/2))^2'}</InlineMath>, όχι{' '}
        <InlineMath>{'\\text{Power}(m, n/2) \\cdot \\text{Power}(m, n/2)'}</InlineMath>{' '}
        (που θα γινόταν δύο κλήσεις, εκθετικό).
      </>
    ),
  },
  'pt2-th1-q3': {
    takeaway: (
      <>
        Master Theorem περίπτωση 3 («ρίζα κυριαρχεί»): όταν το{' '}
        <InlineMath>{'f(n)'}</InlineMath> είναι πολυωνυμικά μεγαλύτερο από το
        κατώφλι <InlineMath>{'n^{\\log_b a}'}</InlineMath>, η απάντηση είναι{' '}
        <strong>απλώς <InlineMath>{'\\Theta(f(n))'}</InlineMath></strong>. Καμία
        έκπληξη, κανένα log.
      </>
    ),
    examRadar: (
      <>
        <InlineMath>{'2T(n/2)+n^3'}</InlineMath>,{' '}
        <InlineMath>{'4T(n/4)+n^2 \\cdot something'}</InlineMath>: αν f είναι
        πολυωνυμικά μεγαλύτερο από <InlineMath>{'n^{\\log_b a}'}</InlineMath>,
        αναγνώρισέ το αμέσως και γράψε{' '}
        <InlineMath>{'\\Theta(f)'}</InlineMath>. Αν διαφέρει μόνο κατά log,
        χρησιμοποίησε την επεκτεταμένη περίπτωση (όχι την 3).
      </>
    ),
  },
  'pt2-th1-q4': {
    takeaway: (
      <>
        Η <InlineMath>{'2T(\\sqrt n)+1'}</InlineMath> δίνει{' '}
        <InlineMath>{'\\Theta(\\log n)'}</InlineMath>, ΟΧΙ{' '}
        <InlineMath>{'\\Theta(\\log\\log n)'}</InlineMath> — η διαφορά είναι ο
        συντελεστής 2 μπροστά: μετά την αντικατάσταση{' '}
        <InlineMath>{'n=2^m'}</InlineMath>, η{' '}
        <InlineMath>{'S(m)=2S(m/2)+1'}</InlineMath> είναι Master Theorem
        περίπτωση 1 (φύλλα), όχι 2 (ισορροπία).
      </>
    ),
    examRadar: (
      <>
        Παγίδα-κλειδί στις αναδρομές με ρίζα: <strong>μέτρα τον συντελεστή
        μπροστά!</strong> a=1 → log log n, a=2 → log n, a=k → polynomial του m
        = poly-log του n. Γράψε πάντα την S(m) ρητά για να αποφύγεις λάθος.
      </>
    ),
  },
  'pt4-th1-q4': {
    takeaway: (
      <>
        «Δύο αναδρομικές κλήσεις στο n−1» δεν είναι D&amp;C — είναι Fibonacci.
        Σε κάθε επίπεδο διπλασιάζονται οι κλήσεις και χρειάζονται{' '}
        <InlineMath>{'n'}</InlineMath> (όχι <InlineMath>{'\\log n'}</InlineMath>)
        επίπεδα → <InlineMath>{'2^n'}</InlineMath> φύλλα = εκθετικό. Για
        πολυωνυμικό, χρειάζεσαι αναδρομή σε <InlineMath>{'n/2'}</InlineMath>
        (όχι σε <InlineMath>{'n-1'}</InlineMath>).
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις <InlineMath>{'aT(n-c)'}</InlineMath> με{' '}
        <InlineMath>{'a > 1'}</InlineMath>, αναμένει εκθετικό. Σ/Λ προτάσεις
        που υπόσχονται πολυωνυμικό φράγμα γι' αυτά τα σχήματα είναι σχεδόν
        πάντα Λάθος.
      </>
    ),
  },
  'pt4-th3': {
    takeaway: (
      <>
        Όταν η είσοδος έχει «μοναδικό σύνορο» (1ᵐ0ⁿ, sorted array, monotone
        condition), η δυαδική αναζήτηση δίνει{' '}
        <InlineMath>{'O(\\log k)'}</InlineMath>. Η αναδρομή είναι πάντα{' '}
        <InlineMath>{'T(k) = T(k/2) + O(1)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «ζητείται <InlineMath>{'O(\\log k)'}</InlineMath>» + «η είσοδος
        έχει monotone δομή» = δυαδική αναζήτηση. Άκουσε τι ρωτάει η εκφώνηση:
        αν δίνει υπόδειξη «τι αναδρομική σχέση πρέπει να ισχύει», ο εξεταστής
        θέλει <InlineMath>{'T(k/2)+O(1)'}</InlineMath>.
      </>
    ),
  },
  'pt5-th2-b': {
    takeaway: (
      <>
        Σύγκριση δύο D&amp;C αλγορίθμων: γράψε αναδρομή για καθέναν, εφάρμοσε
        Master Theorem, διάταξε. <InlineMath>{'9T(n/3)+n'}</InlineMath> → Θ(n²)·{' '}
        <InlineMath>{'2T(n/2)+cn'}</InlineMath> → Θ(n log n). Ο A₂ κερδίζει
        ξεκάθαρα.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις «ποιος αλγόριθμος είναι ασυμπτωτικά καλύτερος» με αναδρομές,
        υπολόγισε κάθε <InlineMath>{'\\log_b a'}</InlineMath> και σύγκρινε με
        το αντίστοιχο d. Δύο αλγόριθμοι με ίδιο{' '}
        <InlineMath>{'\\log_b a'}</InlineMath> πέφτουν στην ίδια περίπτωση και
        έχουν την ίδια τάξη ασυμπτωτικά.
      </>
    ),
  },
  'front-set-3-ask4': {
    takeaway: (
      <>
        Όποτε <InlineMath>{'T(n) = T(n-1) + g(n)'}</InlineMath>, χρησιμοποίησε{' '}
        <strong>τηλεσκόπηση</strong>: άθροισε{' '}
        <InlineMath>{'T(i) - T(i-1) = g(i)'}</InlineMath> για i=1..n, οι
        ενδιάμεσοι όροι διαγράφονται, μένει{' '}
        <InlineMath>{'T(n) = T(0) + \\sum g(i)'}</InlineMath>. Η τάξη του{' '}
        <InlineMath>{'T'}</InlineMath> ταυτίζεται με αυτή του αθροίσματος.
      </>
    ),
    examRadar: (
      <>
        Σήματα τηλεσκόπησης: μη-D&amp;C αναδρομές με{' '}
        <InlineMath>{'T(n-1)'}</InlineMath>. Για{' '}
        <InlineMath>{'g(n) = 2^n'}</InlineMath> → Θ(2ⁿ), για{' '}
        <InlineMath>{'g(n) = n'}</InlineMath> → Θ(n²), για{' '}
        <InlineMath>{'g(n) = c'}</InlineMath> → Θ(n).
      </>
    ),
  },
  'front-set-3-ask1': {
    takeaway: (
      <>
        Ομογενείς γραμμικές αναδρομές (Fibonacci, παρόμοιες) λύνονται με{' '}
        <strong>χαρακτηριστική εξίσωση</strong>: δοκίμασε{' '}
        <InlineMath>{'F(n) = x^n'}</InlineMath>, βρες τις ρίζες του
        πολυωνύμου, η ασυμπτωτική κυριαρχείται από τη ρίζα με το μεγαλύτερο
        μέτρο. Για Fibonacci → <InlineMath>{'\\Theta(\\varphi^n)'}</InlineMath>{' '}
        (χρυσή τομή).
      </>
    ),
    examRadar: (
      <>
        <InlineMath>{'F(n) = c_1 F(n-1) + c_2 F(n-2)'}</InlineMath> χωρίς
        εξωτερικό προσθετέο = ομογενής γραμμική. Συνταγή: χαρακτηριστική
        εξίσωση → ρίζες → γενική λύση → σταθερές από F(0), F(1).
      </>
    ),
  },
  'front-set-3-ask2': {
    takeaway: (
      <>
        Όταν η χαρακτηριστική εξίσωση έχει <strong>διπλή ρίζα</strong>{' '}
        <InlineMath>{'r'}</InlineMath>, η γενική λύση είναι{' '}
        <InlineMath>{'\\lambda_1 r^n + \\lambda_2 n r^n'}</InlineMath> — όχι{' '}
        <InlineMath>{'\\lambda_1 r^n + \\lambda_2 r^n'}</InlineMath> (που θα
        συγχωνευόταν σε έναν όρο). Για πολλαπλότητα m: επιπλέον{' '}
        <InlineMath>{'n^k r^n'}</InlineMath> όροι, k = 0..m−1.
      </>
    ),
    examRadar: (
      <>
        Όταν λύνεις χαρακτηριστική και βρίσκεις διακρίνουσα Δ = 0, σήμα διπλής
        ρίζας. Άμεσα γράψε το ×n κόλπο. Παγίδα: αν αμελήσεις το n, οι αρχικές
        συνθήκες δίνουν αντιφατικό σύστημα.
      </>
    ),
  },
  'front-set-3-ask7': {
    takeaway: (
      <>
        Σύγκριση πολλών D&amp;C: εφάρμοσε Master Theorem σε καθέναν, βρες τάξη,
        διάταξε. <InlineMath>{'n\\log n \\prec n^{7/6} \\prec n^{3/2}'}</InlineMath>{' '}
        (το <InlineMath>{'\\log n'}</InlineMath> χάνει από κάθε θετική δύναμη
        του <InlineMath>{'n'}</InlineMath>).
      </>
    ),
    examRadar: (
      <>
        Όταν συγκρίνεις πολλούς αλγόριθμους D&amp;C, εφάρμοσε MT σε καθένα.
        Συχνή παγίδα: <InlineMath>{'n\\log n'}</InlineMath> νικάει κάθε{' '}
        <InlineMath>{'n^{1+\\varepsilon}'}</InlineMath>, παρότι «μοιάζει πιο
        αργό» λόγω log.
      </>
    ),
  },
  'front-set-3-ask8': {
    takeaway: (
      <>
        Επαγωγή σε αναδρομή: (1) βάση, (2) ΙΗ, (3) επαγωγικό βήμα ξεκινώντας
        από τον ορισμό για n+1, εφαρμογή ΙΗ στις αναδρομικές κλήσεις (μέγεθος
        ≤ n), απλοποίηση με αλγεβρικές ταυτότητες (log a + log b = log ab).
        Καταλήγεις στον τύπο που υπόσχεσαι.
      </>
    ),
    examRadar: (
      <>
        Όποτε ζητείται «απόδειξε με επαγωγή ότι T(n) = …», η συνταγή είναι ίδια
        πάντα. Συχνότερη χρήση: για n = 2ᵏ ή για όλους τους ακεραίους με ισχυρή
        επαγωγή. Πρόσεξε την ταυτότητα <InlineMath>{'\\log 2^k = k'}</InlineMath>{' '}
        — εμφανίζεται σε σχεδόν κάθε τέτοια άσκηση.
      </>
    ),
  },
  'front-set-3-ask9': {
    takeaway: (
      <>
        Επεκτεταμένη Master Theorem: όταν{' '}
        <InlineMath>{'f = \\Theta(n^{\\log_b a} \\log^k n)'}</InlineMath>, τότε{' '}
        <InlineMath>{'T = \\Theta(n^{\\log_b a} \\log^{k+1} n)'}</InlineMath> —{' '}
        <strong>μία log δύναμη παραπάνω</strong>. Δεν είναι καμία από τις 3
        κλασικές περιπτώσεις.
      </>
    ),
    examRadar: (
      <>
        Σήμα: <InlineMath>{'f'}</InlineMath> διαφέρει από το{' '}
        <InlineMath>{'n^{\\log_b a}'}</InlineMath> κατά μόνο{' '}
        <InlineMath>{'\\log^k n'}</InlineMath> (όχι πολυωνυμικά). Καμία κλασική
        περίπτωση δεν εφαρμόζεται — η απάντηση είναι «κατώφλι ×{' '}
        <InlineMath>{'\\log^{k+1} n'}</InlineMath>».
      </>
    ),
  },
  'front-set-3-ask10': {
    takeaway: (
      <>
        Ίδια ιστορία με pt1-th1-q4: η <InlineMath>{'T(\\sqrt n) + 1'}</InlineMath>{' '}
        λύνεται με <InlineMath>{'n = 2^m'}</InlineMath>· δίνει{' '}
        <InlineMath>{'\\Theta(\\log\\log n)'}</InlineMath> (διπλό log). Το
        αποτύπωμα του «τετραγωνική ρίζα συν σταθερά».
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις <InlineMath>{'T(\\sqrt n) + c'}</InlineMath> με σταθερό c, η
        απάντηση είναι Θ(log log n). Αν είχε συντελεστή 2 μπροστά, θα ήταν Θ(log
        n). Πρόσεξε αυτή τη μικρή διαφορά.
      </>
    ),
  },
  'front-set-4-ask1': {
    takeaway: (
      <>
        Όποτε η αναδρομή έχει συντελεστή <InlineMath>{'\\sqrt n'}</InlineMath>{' '}
        ή <InlineMath>{'n^c'}</InlineMath> μπροστά από το{' '}
        <InlineMath>{'T'}</InlineMath>, διαίρεσε και τις δύο πλευρές με το{' '}
        αντίστοιχο <InlineMath>{'f(n)'}</InlineMath>. Συχνά εμφανίζεται μια
        πολύ απλούστερη αναδρομή στη νέα συνάρτηση{' '}
        <InlineMath>{'S = T/f'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: <InlineMath>{'g(n) \\cdot T(\\cdot) + f(n)'}</InlineMath>. Διαίρεσε
        με f. Είναι το ίδιο κόλπο που χρησιμοποιείται και στην απόδειξη #1 της
        mergesort (L03).
      </>
    ),
  },
  'front-set-4-ask2': {
    takeaway: (
      <>
        Μέθοδος αντικατάστασης = εικασία + απόδειξη με επαγωγή. Όταν θέλεις{' '}
        <em>ακριβή</em> τύπο (όχι μόνο Θ), αυτή είναι η μόνη επιλογή. Συνταγή:
        μάντεψε <InlineMath>{'T(n) = n \\log n + n'}</InlineMath> (από
        αναγνώριση mergesort), επαλήθευσε στη βάση, αντικατέστησε στο επαγωγικό
        βήμα.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση ζητάει «ακριβή λύση» ή «λύσε με τη μέθοδο
        αντικατάστασης», γράψε τα δύο στάδια ρητά: (1) εικασία, (2) επαγωγή. Αν
        η επαγωγή σπάει με έναν επιπλέον όρο, ίσως χρειάζεσαι{' '}
        <em>ενίσχυση</em> εικασίας (δες ask3).
      </>
    ),
  },
  'front-set-4-ask3': {
    takeaway: (
      <>
        Όταν η «προφανής» εικασία{' '}
        <InlineMath>{'T \\le dn^k'}</InlineMath> δεν κλείνει την επαγωγή λόγω
        υπόλοιπου, <strong>ενίσχυσε</strong> την σε{' '}
        <InlineMath>{"T \\le dn^k - d'n^{k-1}"}</InlineMath>. Παράδοξα, η πιο
        σφιχτή εικασία είναι ευκολότερο να αποδειχθεί.
      </>
    ),
    examRadar: (
      <>
        Σήμα: εφαρμόζοντας μια εικασία <InlineMath>{'cn^k'}</InlineMath>,
        καταλήγεις σε <InlineMath>{'cn^k + (\\text{επιπλέον})'}</InlineMath>{' '}
        που δεν είναι ≤ <InlineMath>{'cn^k'}</InlineMath>. Άμεσα αφαίρεσε
        έναν όρο τάξης <InlineMath>{'n^{k-1}'}</InlineMath>.
      </>
    ),
  },
  'front-set-4-ask4': {
    takeaway: (
      <>
        Για άνισες αναδρομές <InlineMath>{'\\sum T(c_i n) + n'}</InlineMath>:
        ο κρίσιμος αριθμός είναι <InlineMath>{'r = \\sum c_i'}</InlineMath>.
        r &lt; 1: ρίζα κυριαρχεί → Θ(n). r = 1: όλα ίσα → Θ(n log n). r &gt; 1:
        φύλλα κυριαρχούν → υπερ-γραμμικό.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις άνιση αναδρομή (πολλά διαφορετικά n/k), πρόσθεσε τα
        κλάσματα. Αν συγκλίνει (r &lt; 1), εικασία cn και απόδειξη με
        αντικατάσταση — κλειδώνει.
      </>
    ),
  },
  'front-set-4-ask7': {
    takeaway: (
      <>
        Η εξάλειψη ενός στοιχείου από ακολουθία με γνωστή δομή («αναμενόμενη
        τιμή ανά θέση») δημιουργεί <strong>σύνορο</strong> ίδιας μορφής με το{' '}
        <InlineMath>{'1^m 0^n'}</InlineMath>. Δυαδική αναζήτηση παίζει →{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «λείπει ένας όρος από αριθμητική πρόοδο / γεωμετρική / κάθε
        γνωστή ακολουθία». Άμεσα δυαδική αναζήτηση. Υπολόγισε την αναμενόμενη
        τιμή στη θέση mid και σύγκρινε.
      </>
    ),
  },
  'front-set-4-ask10': {
    takeaway: (
      <>
        Επεκτεταμένη Master Theorem ξανά: όταν{' '}
        <InlineMath>{'f = n^{\\log_b a} \\cdot \\log n'}</InlineMath>, η
        απάντηση είναι <InlineMath>{'n^{\\log_b a} \\cdot \\log^2 n'}</InlineMath>{' '}
        (+1 log). Παγίδα: μη σπεύσεις σε Περίπτωση 3 — η <InlineMath>{'\\log n'}</InlineMath>{' '}
        διαφορά δεν είναι πολυωνυμική.
      </>
    ),
    examRadar: (
      <>
        Όποτε το <InlineMath>{'f'}</InlineMath> έχει την «καρδιά»{' '}
        <InlineMath>{'n^{\\log_b a}'}</InlineMath> και ένα{' '}
        <InlineMath>{'\\log^k n'}</InlineMath>, γράψε «επεκτεταμένη περίπτωση»
        και την απάντηση{' '}
        <InlineMath>{'n^{\\log_b a} \\log^{k+1} n'}</InlineMath>. Συμβουλή: γράψε
        ρητά το k.
      </>
    ),
  },
  'front-set-5-ask1': {
    takeaway: (
      <>
        Stooge Sort: <InlineMath>{'T(n) = 3T(2n/3) + O(1)'}</InlineMath> →{' '}
        <InlineMath>{'\\Theta(n^{\\log_{3/2} 3}) \\approx \\Theta(n^{2{,}71})'}</InlineMath>{' '}
        — χειρότερο και από bubble. Το σχήμα D&amp;C δεν εγγυάται ταχύτητα: μετράει
        ο λόγος <InlineMath>{'a / b^d'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις αναδρομή <InlineMath>{'kT(n \\cdot c) + O(1)'}</InlineMath>{' '}
        με <InlineMath>{'c > 1/k'}</InlineMath>, αναμένει υπερ-γραμμικό
        αποτέλεσμα. Για ορθότητα παρόμοιων αναδρομών (3 κλήσεις σε 2/3): δείξε
        ότι μετά την 1η + 2η κλήση τα μεγαλύτερα στοιχεία κάθονται στο
        τελευταίο τρίτο.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L04 — Διαίρει και κυρίευε ΙΙ (αντιστροφές, κυρίαρχο χρώμα, Karatsuba —
   *       και τα προβλήματα-«εφαρμογές» τους: πλειοψηφικό O(n log n),
   *       σημαία Ολλανδίας, διάμεσος δύο πινάκων, τομές τμημάτων,
   *       βίδες ↔ παξιμάδια, σαμποτάζ quicksort.)
   * ─────────────────────────────────────────────────────────────────── */
  'pt3-th2': {
    takeaway: (
      <>
        Όταν τα στοιχεία δεν συγκρίνονται (μόνο «ίδιο;»), ξέχνα ταξινόμηση και
        hash. Σπάσε στη μέση, ζήτα έναν υποψήφιο πλειοψηφικό από κάθε μισό,
        επαλήθευσε με μία γραμμική σάρωση. Η ίδια αναδρομή με τη mergesort,{' '}
        <InlineMath>{'T(n) = 2T(n/2) + O(n) = O(n\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μόνο έλεγχος ισότητας», «μη συγκρίσιμα στοιχεία», «πλειοψηφία &gt;
        n/2». Άμεσα D&amp;C με 2 υποψήφιους από κάθε μισό. Παγίδα: αν δεν
        επαληθεύσεις με γραμμικό μέτρημα, ένας ψευδώς-θετικός υποψήφιος ταξιδεύει
        ως τη ρίζα.
      </>
    ),
  },
  'front-set-4-ask5': {
    takeaway: (
      <>
        Boyer–Moore-style πλειοψηφικό με D&amp;C: ο μόνος επιτρεπτός τελεστής
        (συσκευή ισοδυναμίας) αρκεί. Σπάσε στη μέση, πάρε τον υποψήφιο του
        αριστερού· επαλήθευσε με σάρωση· αν αποτύχει, δοκίμασε τον υποψήφιο
        του δεξιού. <InlineMath>{'T(n) = 2T(n/2) + \\Theta(n) = O(n\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση περιορίζει την πρόσβαση σε μία O(1) πράξη (ισοδυναμία,
        σύγκριση, query), σκέψου D&amp;C με «επαλήθευση γραμμικής σάρωσης» — όχι
        ταξινόμηση. Το ίδιο σχήμα με το «κυρίαρχο χρώμα» της διάλεξης, αλλά σε
        γραμμικό combine αντί για τετραγωνικό.
      </>
    ),
  },
  'front-set-4-ask6': {
    takeaway: (
      <>
        Όταν οι διαφορετικές τιμές είναι σταθερό πλήθος (2/3/k), φτάνει
        γραμμική σάρωση με δείκτες-σύνορα — όχι ταξινόμηση{' '}
        <InlineMath>{'O(n\\log n)'}</InlineMath>. Η σημαία της Ολλανδίας: τρεις
        δείκτες low/mid/high, τρεις περιπτώσεις A[mid]∈{`{0,1,2}`}, ο mid ΔΕΝ
        προχωρά μετά από swap με high.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «λίγες τιμές», «τοποθέτησε όλα τα Χ αριστερά», «in-place», «μηδέν
        βοηθητική μνήμη». Άμεσα 3-pointer partition. Παγίδα ορθότητας: η σωστή
        διαχείριση του «2» απαιτεί mid να μη κουνηθεί — αλλιώς χάνεις το νέο
        στοιχείο που ήρθε από δεξιά.
      </>
    ),
  },
  'front-set-4-ask8': {
    takeaway: (
      <>
        Διάμεσος δύο ταξινομημένων πινάκων με D&amp;C σε{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath>: σύγκρινε τις δύο τοπικές
        διαμέσους και πέτα <em>ίσα</em> πλήθη από κάθε πλευρά (αριστερό μισό
        του μικρότερου, δεξί μισό του μεγαλύτερου). Η συνολική διάμεσος δεν
        αλλάζει.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «δύο ταξινομημένοι πίνακες», «διάμεσος / k-οστό», «O(log n)».
        Συνταγή: σύγκρινε διαμέσους, πέτα ίσα. Η αναδρομή είναι πάντα{' '}
        <InlineMath>{'T(n) = T(n/2) + O(1)'}</InlineMath>. Λεπτό σημείο: αν τα
        μεγέθη διαφέρουν, πετάς ίσο <em>αριθμό</em> στοιχείων όχι ίσο ποσοστό.
      </>
    ),
  },
  'front-set-4-ask9': {
    takeaway: (
      <>
        Γεωμετρική ερώτηση «πόσες τομές» ⇔ μέτρηση αντιστροφών στον πίνακα{' '}
        <InlineMath>{'Q'}</InlineMath> μετά την ταξινόμηση κατά{' '}
        <InlineMath>{'p'}</InlineMath>. Δύο τμήματα <InlineMath>{'i<j'}</InlineMath>{' '}
        τέμνονται ⇔ <InlineMath>{'q_i > q_j'}</InlineMath>. Λύση: sort-and-count
        της mergesort → <InlineMath>{'O(n\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όποτε πρόβλημα ρωτά «πόσα ζεύγη ικανοποιούν ανισότητα μεταξύ θέσης και
        τιμής» (τομές, αντιστροφές, σημαντικές αντιστροφές{' '}
        <InlineMath>{'A[i] > 2A[j]'}</InlineMath>), ψάξε για αντιστοίχηση σε
        αντιστροφές μετά από μία ταξινόμηση. Το L04 σχήμα δίνει αμέσως{' '}
        <InlineMath>{'O(n\\log n)'}</InlineMath>.
      </>
    ),
  },
  'front-set-5-ask2': {
    takeaway: (
      <>
        Cross-pivot randomized quicksort: όταν δεν επιτρέπεται σύγκριση μέσα
        στην ίδια ομάδα, το pivot πρέπει να είναι από την «άλλη». Pick τυχαίο
        παξιμάδι → partition βιδών → βρες το ταίρι → partition παξιμαδιών →
        αναδρομή. Διπλάσιο combine ανά επίπεδο, αλλά αναμενόμενο{' '}
        <InlineMath>{'\\Theta(n\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «επιτρέπεται μόνο σύγκριση Α↔Β, όχι Α↔Α». Άμεσα cross-pivot με
        randomized επιλογή. Παγίδα: μη ξεχάσεις τη <em>δεύτερη</em> σάρωση —
        αφού βρεις το ταίρι, πρέπει να διαμερίσεις και την άλλη ομάδα για να
        γεννηθούν δύο σωστά υπο-ζεύγη.
      </>
    ),
  },
  'front-set-5-ask3': {
    takeaway: (
      <>
        Quicksort με pivot = πρώτο στοιχείο έχει χείριστη{' '}
        <InlineMath>{'\\Theta(n^2)'}</InlineMath> ακριβώς σε <em>ταξινομημένη</em>{' '}
        είσοδο. Άμυνα: Fisher–Yates ανακατεύει σε <InlineMath>{'O(n)'}</InlineMath>
        ομοιόμορφα, οπότε ο ντετερμινιστικός κώδικας τρέχει σε «τυχαία» είσοδο →
        αναμενόμενος <InlineMath>{'O(n\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «κακόβουλη είσοδος» σε ντετερμινιστικό αλγόριθμο. Λύση: τυχαιοποίησε
        την είσοδο (Fisher–Yates) πριν την είσοδο στον αλγόριθμο. Παγίδα:
        η γεννήτρια τυχαίων αριθμών πρέπει να είναι μη-προβλέψιμη από τον
        επιτιθέμενο, αλλιώς η άμυνα καταρρέει.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L06 — Γραφήματα Ι (βασικές έννοιες, BFS/DFS εφαρμογές)
   * ─────────────────────────────────────────────────────────────────── */
  'pt5-th1': {
    takeaway: (
      <>
        Συνεκτικές συνιστώσες = επαναλαμβανόμενο BFS οδηγούμενο από εξωτερικό
        βρόχο που ψάχνει την επόμενη ασημάδευτη κορυφή. Σε λίστες γειτνίασης
        κάθε κορυφή και ακμή «πιάνονται» σταθερές φορές → συνολικά{' '}
        <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>, που είναι και το κάτω
        φράγμα — άρα βέλτιστος.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «να βρεθούν συνεκτικές συνιστώσες» ή κάποιο πρόβλημα-«νησιά»
        (clusters, ομαδοποίηση, χρωματισμός με ελάχιστα χρώματα σε ξένα
        υπογραφήματα). Γράψε <code>for v: if unmarked: BFS(v); c++</code> και
        δείξε αμέσως την πολυπλοκότητα <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>.
        Πόντοι για «είναι βέλτιστο γιατί <InlineMath>{'\\Omega(|V| + |E|)'}</InlineMath>».
      </>
    ),
  },
  'front-set-5-ask5': {
    takeaway: (
      <>
        Με αναπαράσταση <InlineMath>{'\\text{Head}/\\text{Succ}'}</InlineMath>{' '}
        (επίπεδες λίστες γειτνίασης), η εύρεση γειτόνων του{' '}
        <InlineMath>{'v'}</InlineMath> κοστίζει{' '}
        <InlineMath>{'\\Theta(\\deg(v))'}</InlineMath> — όχι{' '}
        <InlineMath>{'\\Theta(|V|)'}</InlineMath>. Αυτό κάνει το BFT (BFS από
        κάθε ασημάδευτη) να τρέχει σε <InlineMath>{'\\Theta(n + m)'}</InlineMath>{' '}
        αντί για <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: ρητή αναφορά σε «<InlineMath>{'\\text{Head}'}</InlineMath>»,
        «<InlineMath>{'\\text{Succ}'}</InlineMath>», «επίπεδες λίστες». Συνήθως
        ο εξεταστής θέλει να γράψεις τον αλγόριθμο BFT και να αναλύσεις την
        πολυπλοκότητα ξεκάθαρα ως <InlineMath>{'\\Theta(n) + \\sum \\Theta(n_i + m_i) = \\Theta(n + m)'}</InlineMath>.
      </>
    ),
  },
  'pt6-th1': {
    takeaway: (
      <>
        Η αναπαράσταση καθορίζει την πολυπλοκότητα: λίστες δίνουν{' '}
        <InlineMath>{'O(\\Delta(v))'}</InlineMath> για το{' '}
        <InlineMath>{'N(v)'}</InlineMath>, πίνακας δίνει σταθερά{' '}
        <InlineMath>{'O(|V|)'}</InlineMath>. Σε αραιό γράφο{' '}
        <InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath>, BFS/DFS βγαίνουν{' '}
        γραμμικοί στο <InlineMath>{'|V|'}</InlineMath> μόνο επειδή χρησιμοποιούμε
        λίστες.
      </>
    ),
    examRadar: (
      <>
        Σήμα: εκφώνηση που λέει ρητά «<InlineMath>{'|E| = \\Theta(|V|)'}</InlineMath>»
        ή «αραιός» και ζητά πολυπλοκότητα BFS/DFS. Πάντα αναφέρεις πρώτα{' '}
        <InlineMath>{'O(|V| + |E|)'}</InlineMath>, μετά υποκαθιστάς το{' '}
        <InlineMath>{'|E|'}</InlineMath>. Η σύγκριση λίστα vs πίνακας πέφτει
        σχεδόν πάντα στο β-ερώτημα.
      </>
    ),
  },
  'front-set-7-ask2': {
    takeaway: (
      <>
        Γρίφος με «καταστάσεις + κανόνες μετάβασης» = γράφος καταστάσεων.
        Κόμβοι = ασφαλείς διαμορφώσεις (10 από τις 16 πιθανές εδώ), ακμές =
        νόμιμα περάσματα της βάρκας. Συντομότερη λύση = BFS από{' '}
        <InlineMath>{'\\varnothing'}</InlineMath> ως{' '}
        <InlineMath>{'\\{B,C,G,W\\}'}</InlineMath> → 7 βήματα.
      </>
    ),
    examRadar: (
      <>
        Σήμα: γρίφος μεταφοράς, παζλ σε ταμπλό, σύστημα με «κανόνες αλλαγής
        κατάστασης». Πάντα: ορίσε <strong>τι είναι κατάσταση</strong>,{' '}
        <strong>πότε είναι έγκυρη</strong>, <strong>πότε υπάρχει ακμή</strong>,
        και πέρνα BFS. Πόντοι για «BFS δίνει και βραχύτερη λύση».
      </>
    ),
  },
  'front-set-7-ask9': {
    takeaway: (
      <>
        Πρόβλημα με κανόνες που <em>μονοτονικά</em> «δυσκολεύουν» όταν αφαιρείς
        κόμβο (π.χ. ο βαθμός μειώνεται μόνο) λύνεται με <em>επαναληπτικό
        peeling</em>: όσο υπάρχει παραβάτης, αφαίρεσέ τον. Το ίδιο σχήμα δίνει
        τον <em>k-core</em> ενός γραφήματος. Πολυπλοκότητα{' '}
        <InlineMath>{'O(n^3)'}</InlineMath> με αφελή υλοποίηση,{' '}
        <InlineMath>{'O(n + m)'}</InlineMath> με queue-based peeling.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μέγιστο υποσύνολο που ικανοποιεί τοπικό κανόνα» όπου ο κανόνας
        ελέγχει τον βαθμό κάθε κορυφής μέσα στο υποσύνολο. Πάντα ξεκίνα από
        «αν παραβιάζει τώρα, δεν μπορεί να ανήκει σε καμία έγκυρη λύση» —
        αυτή η μονοτονία είναι το κλειδί της ορθότητας του peeling.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L08 — Γραφήματα ΙΙΙ + προετοιμασία για βάρη
   * Όλες οι ασκήσεις αυτής της διάλεξης γυρίζουν γύρω από τους
   * μετασχηματισμούς βαρών (log, scale, shift) και τη χρήση
   * DAG-τοπολογικής σάρωσης ως «πιο ισχυρός» Dijkstra.
   * ─────────────────────────────────────────────────────────────────── */
  'front-set-5-ask6': {
    takeaway: (
      <>
        Μεγιστοποίηση γινομένου πιθανοτήτων{' '}
        <InlineMath>{'\\prod P'}</InlineMath> γίνεται ελαχιστοποίηση
        αθροίσματος <InlineMath>{'\\sum (-\\log P)'}</InlineMath> με{' '}
        <InlineMath>{'w \\ge 0'}</InlineMath> — γέφυρα ίδιας σειράς, ίδιος
        νικητής. Από εκεί, Dijkstra. Αξιοπιστία του βέλτιστου μονοπατιού =
        <InlineMath>{'2^{-\\text{(min weight)}}'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μέγιστη αξιοπιστία/πιθανότητα/ποιότητα» πάνω σε μονοπάτι, με
        ανεξάρτητες ακμές. Πρώτη κίνηση: μετατροπή γινομένου σε άθροισμα μέσω
        λογάριθμου, και έλεγχος προσήμου ώστε να ταιριάξεις τον σωστό
        αλγόριθμο (Dijkstra για <InlineMath>{'-\\log r'}</InlineMath>,
        Bellman-Ford / DAG-relax για <InlineMath>{'\\log r'}</InlineMath>).
      </>
    ),
  },
  'front-set-5-ask7': {
    takeaway: (
      <>
        Όταν η εκφώνηση επιβάλλει σε ένα μονοπάτι να περάσει διαδοχικά από
        ξένα υποσύνολα <InlineMath>{'C_1, \\ldots, C_k'}</InlineMath>, χτίζεις
        στρωματικό DAG: κορυφές = τα στοιχεία των{' '}
        <InlineMath>{'C_i'}</InlineMath>, ακμές μόνο μεταξύ διαδοχικών
        στρωμάτων, εικονικά <InlineMath>{'s, t'}</InlineMath> με{' '}
        <InlineMath>{'0'}</InlineMath>-βάρους. Συντομότερο μονοπάτι σε DAG ⇒{' '}
        <InlineMath>{'O(|V| + |E|) = O(|V|^2)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μονοπάτι που περνά διαδοχικά από φάσεις/χρώματα/υποσύνολα» με
        μία και μόνη σειρά. Η σειρά ΕΙΝΑΙ η τοπολογική σου διάταξη — δεν
        χρειάζεται να την υπολογίσεις. Πρόσθεσε εικονικά{' '}
        <InlineMath>{'s, t'}</InlineMath> για να αποφύγεις «n εκκινήσεις».
      </>
    ),
  },
  'front-set-5-ask8': {
    takeaway: (
      <>
        Σε DAG, το πρόσημο των βαρών δεν είναι εμπόδιο: η τοπολογική σάρωση
        χαλαρώνει σωστά ακόμα και με αρνητικά. Μπορείς να διαλέξεις μεταξύ{' '}
        <strong>max με <InlineMath>{'-\\log r \\ge 0'}</InlineMath></strong>{' '}
        ή <strong>min με <InlineMath>{'\\log r \\le 0'}</InlineMath></strong> —{' '}
        ισοδύναμα, και τα δύο σε <InlineMath>{'\\Theta(|V| + |E|)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «πιο αναξιόπιστο / longest path / min-product» σε ακυκλικό γράφο.
        Πρώτος έλεγχος: είναι DAG; Αν ναι, ξεχάσεις Dijkstra/BF — τοπολογική
        χαλάρωση. Επόμενος έλεγχος: ποιο πρόσημο των βαρών κάνει την αναδρομή
        πιο φυσική (max ή min)· και τα δύο σωστά, διαλέγεις για ευκολία.
      </>
    ),
  },
  'front-set-5-ask9': {
    takeaway: (
      <>
        <strong>×k</strong> (θετική σταθερά) διατηρεί όλη τη σχετική σειρά
        μονοπατιών — το συντομότερο μένει συντομότερο. <strong>+α</strong>{' '}
        όμως όχι: τιμωρεί μονοπάτια ανάλογα με το πλήθος ακμών τους, οπότε
        μπορεί να αλλάξει νικητής. Το κατευθείαν παράδειγμα: 3 ακμές βάρους 1
        (σύνολο 3) vs 2 ακμές βάρους 2 (σύνολο 4) — μετά +10 ανά ακμή: 33 vs
        24.
      </>
    ),
    examRadar: (
      <>
        Κλασικό Σ/Λ — σε εξετάσεις εμφανίζεται μαζί με την παγίδα «πρόσθεσε
        c και τρέξε Dijkstra». Η σωστή αντίδραση: «×k συντηρεί, +α σπάει
        όταν τα μονοπάτια διαφέρουν σε πλήθος ακμών». Έχε έτοιμο το 3-vs-2
        αντιπαράδειγμα — λύνει και άλλες παραλλαγές («πρόσθεσε στο
        ελάχιστο/μέγιστο βάρος…»).
      </>
    ),
  },
  'front-set-6-ask1': {
    takeaway: (
      <>
        Πολυφασικό πρόβλημα (m ημέρες, διαφορετικοί περιορισμοί ανά ημέρα,
        κόστος ανά διανυκτέρευση) λύνεται με ένα στρωματωμένο DAG{' '}
        <InlineMath>{'v_{i,p}'}</InlineMath> για κάθε ζεύγος (πόλη, ημέρα).
        Ακμές προχωρούν την ημέρα κατά ένα, σεβόμενες όλους τους περιορισμούς.
        Όλα-τα-ζεύγη Dijkstra: <InlineMath>{'O(n^3)'}</InlineMath>· DAG SP:{' '}
        <InlineMath>{'O(n^2 m)'}</InlineMath>· σύνολο{' '}
        <InlineMath>{'O(n^2(n + m))'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «k βήματα», «t ημέρες», «p στάδια», «καμία επανάληψη ίδιας
        κατάστασης διαδοχικά». Πρόσθεσε φάση ως δεύτερη διάσταση στις
        κορυφές — και το πρόβλημα γίνεται καθαρό shortest path σε DAG. Η
        ακριβής μορφή του περιορισμού μπαίνει στη συνθήκη της ακμής, όχι σε
        ξεχωριστή λογική.
      </>
    ),
  },
  'front-set-7-ask10': {
    takeaway: (
      <>
        Η «προφανής διόρθωση» («πρόσθεσε c για να μην έχω αρνητικά + Dijkstra»)
        είναι λάθος. Ο μετασχηματισμός χρεώνει{' '}
        <InlineMath>{'\\ell \\cdot c'}</InlineMath> σε μονοπάτι με{' '}
        <InlineMath>{'\\ell'}</InlineMath> ακμές, οπότε διαφορετικού μήκους
        διαδρομές πληρώνουν διαφορετικά — η σειρά τους μπορεί να ανατραπεί.
        Σωστή επιλογή για αρνητικά βάρη: <strong>Bellman-Ford</strong>{' '}
        <InlineMath>{'O(|V| \\cdot |E|)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «πρότεινε διόρθωση για αρνητικά βάρη» ή «πρόσθεσε c». Σχεδόν
        πάντα ζητείται να αναγνωρίσεις γιατί η ιδέα είναι λανθασμένη και να
        δώσεις 3-κόμβο αντιπαράδειγμα (1-ακμή vs 2-ακμές). Στόχος του
        ερωτήματος: να δείξει ότι κατάλαβες πως ο Dijkstra δεν διορθώνεται με
        cosmetic μετασχηματισμό.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L09 — Γραφήματα IV (Dijkstra, ΕΕΔ — Prim/Kruskal, ιδιότητες αποκοπής
   *       και κύκλου, μη-μοναδικότητα ΕΕΔ, P/NP για γραφικά προβλήματα,
   *       2-προσέγγιση TSP μέσω MST.)
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th1-q6': {
    takeaway: (
      <>
        Ο Dijkstra επιλέγει την κορυφή με τη <strong>μικρότερη τρέχουσα{' '}
        <InlineMath>{'d[v]'}</InlineMath></strong> από την αφετηρία — όχι
        «τοπικά συντομότερο γείτονα», όχι «ακμή τομής», όχι «λιγότερες ακμές».
        Τα κριτήρια Prim, BFS, και «μυωπικού γείτονα» μοιάζουν επικίνδυνα.
      </>
    ),
    examRadar: (
      <>
        Όταν Σ/Λ ή MC ρωτά για κριτήριο σε γράφημα με βάρη, γράψε δίπλα σε κάθε
        όνομα το κλειδί της ουράς: Dijkstra ↔ συνολική απόσταση, Prim ↔ μία
        ακμή, BFS ↔ ακμές αγνοώντας βάρη, Kruskal ↔ ταξινομημένη λίστα ακμών.
        Η σωστή απάντηση πέφτει μόνη της.
      </>
    ),
  },
  'pt1-th2-b': {
    takeaway: (
      <>
        Η μη-μοναδικότητα ΕΕΔ έρχεται από <em>ισοβαθμίες σε σημείο πραγματικής
        επιλογής</em>. Συνταγή: τρέξε Kruskal, βρες τις υποχρεωτικές (μοναδικά
        ελαφρύτερες, γέφυρες), δες τις «νησίδες» που μένουν, και μέτρα μόνο τα
        έγκυρα ζευγάρια ακμών ίδιου βάρους που τις ενώνουν.
      </>
    ),
    examRadar: (
      <>
        «Πόσα διαφορετικά ΕΕΔ;» είναι συνδυαστικό πρόβλημα — όχι «τρέξε άπληστο».
        Πάντα πρώτα ξεχωρίζεις υποχρεωτικές vs ελεύθερες, μετά μετράς. Παγίδα:
        ένα ζεύγος ισόβαθμων ακμών που ενώνουν τις ίδιες δύο νησίδες είναι
        ΑΚΥΡΟ — η μέτρηση πρέπει να το αποκλείσει.
      </>
    ),
  },
  'pt2-th1-q5': {
    takeaway: (
      <>
        Από τους τέσσερις αλγορίθμους, ο μόνος που <em>σπάει</em> σε αρνητικά
        βάρη είναι ο Dijkstra — γιατί «κλειδώνει» κορυφές πρόωρα. Prim
        (ιδιότητα αποκοπής), Bellman-Ford (επαναπροσπαθεί κάθε γύρο), BFS
        (αγνοεί τα βάρη) παραμένουν σωστοί.
      </>
    ),
    examRadar: (
      <>
        Σ/Λ ή MC «ποιος αλγόριθμος χαλάει σε αρνητικά βάρη» = Dijkstra. Αν η
        εκφώνηση επιπλέον σου ζητά αντιπαράδειγμα, η ελάχιστη απαίτηση είναι
        γράφος 4 κορυφών με 1 αρνητική ακμή — υπάρχει στο DijkstraInvariantBreak
        και είναι ο κανονικός K-T αντιπαράδειγμα.
      </>
    ),
  },
  'pt2-th2-1': {
    takeaway: (
      <>
        Η «έξοδος» του Dijkstra σε εξετάσεις είναι ο <em>πίνακας ανά βήμα</em>:
        στήλες = κορυφές, γραμμές = εξαγωγές. Σε κάθε γραμμή αλλάζουν ΜΟΝΟ τα
        κελιά γειτονικών κορυφών — και μόνο αν η νέα τιμή είναι μικρότερη.
        Σειρά οριστικοποίησης συνήθως ΔΕΝ είναι αλφαβητική.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «εφάρμοσε Dijkstra στο γράφημα, δώσε τον πίνακα ανά βήμα». Πάντα
        ζωγράφισε στήλες-κορυφές, γραμμές-εξαγωγές, οριστικές τιμές{' '}
        <strong>έντονα</strong>. Παγίδα: ισοβαθμίες στις τρέχουσες d ⇒ δικαίωμα
        επιλογής σειράς, αλλά οι τελικές αποστάσεις είναι ίδιες.
      </>
    ),
  },
  'pt3-th1': {
    takeaway: (
      <>
        «Μη-αρνητικός κύκλος» ΔΕΝ είναι αρνητική ακμή. Ο Dijkstra απαιτεί κάθε
        ακμή <InlineMath>{'\\ge 0'}</InlineMath>, όχι κάθε κύκλο — και ένας
        μη-αρνητικός κύκλος με όλες τις ακμές <InlineMath>{'\\ge 0'}</InlineMath>{' '}
        δεν επηρεάζει καθόλου τα shortest paths.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση συνδυάζει «κατασκεύασε γράφο όπου ο Dijkstra δουλεύει»{' '}
        με «μη-αρνητικός κύκλος», η συνταγή είναι: 5 κόμβοι, ο κύκλος με 3
        ακμές που αθροίζουν <InlineMath>{'\\ge 0'}</InlineMath>, η{' '}
        <InlineMath>{'s'}</InlineMath> εκτός κύκλου με indeg = 0. Από εκεί ο
        πίνακας Dijkstra είναι ρουτίνα.
      </>
    ),
  },
  'pt4-th2-a': {
    takeaway: (
      <>
        Μη-μοναδικότητα ΕΕΔ ⇔ ισοβαθμία ακμών σε σημείο επιλογής. Ευκολότερο
        σημείο: <strong>κύκλος ίδιων βαρών</strong>. Σε τρίγωνο ίδιων βαρών
        παράγονται 3 διαφορετικά ΕΕΔ — όλα με ίδιο συνολικό κόστος.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «δώσε βάρη που να ΜΗΝ έχουν μοναδικό ΕΕΔ». Συνταγή: τρίγωνο ίδιων
        βαρών στο μικρότερο κύκλο του γράφου· υπόλοιπες ακμές διακριτά βάρη για
        να μην προκύπτουν «παράπλευρες» ισοβαθμίες που θα μπερδέψουν την
        αιτιολόγηση.
      </>
    ),
  },
  'pt4-th2-b': {
    takeaway: (
      <>
        Στον Kruskal, η σειρά εξέτασης ισόβαθμων ακμών είναι μηχανισμός
        επιλογής — διαφορετικές σειρές παράγουν διαφορετικά (αλλά ισοδύναμα)
        ΕΕΔ. Στις εξετάσεις, η σωστή παρουσίαση είναι «εδώ έχω επιλογή· επιλέγω
        αυτήν, αλλά κάθε άλλη θα ήταν εξίσου βέλτιστη».
      </>
    ),
    examRadar: (
      <>
        «Τρέξε Kruskal/Prim και αιτιολόγησε» με ισόβαθμες ακμές: γράψε ρητά
        ποιες ισοβαθμίες σου άφησαν περιθώριο επιλογής. Παγίδα: όλοι οι
        αλγόριθμοι ΕΕΔ είναι εξίσου σωστοί — αλλά δίνουν διαφορετικά δέντρα όταν
        η σειρά ισοβαθμιών αλλάζει.
      </>
    ),
  },
  'pt5-th3-a': {
    takeaway: (
      <>
        Η ένταξη σε NP είναι ίδια συνταγή: <strong>πιστοποιητικό + verifier</strong>.
        Για Hamilton Path: πιστοποιητικό = η ακολουθία κορυφών·{' '}
        verifier ελέγχει «κάθε κορυφή μία φορά» + «κάθε διαδοχικό ζεύγος είναι
        ακμή» + «σωστά άκρα». Όλα <InlineMath>{'O(n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        «Δείξε ότι Χ ∈ NP» = όρισε πιστοποιητικό και verifier σε πολυωνυμικό
        χρόνο. Δεν μιλάς για αλγόριθμο εύρεσης — μόνο για επαλήθευση μιας
        υποψήφιας λύσης. Η σωστή λύση είναι σχεδόν πάντα 3-4 γραμμές περιγραφής.
      </>
    ),
  },
  'pt5-th3-b': {
    takeaway: (
      <>
        «Βελτιστοποίηση + κατώφλι = απόφαση» μετατρέπει min/max σε ναι/όχι. Για
        MST_D: πιστοποιητικό = προτεινόμενο δέντρο T (έλεγχοι: |T|=n−1, ακυκλικό,
        συνδετικό, άθροισμα ≤ k). Στο P επειδή το MST λύνεται από Kruskal/Prim
        σε <InlineMath>{'O(m \\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όποτε η εκφώνηση ζητά «δώσε πρόβλημα απόφασης + δείξε NP + δείξε P»,
        υπάρχει σχεδόν πάντα γνωστός πολυωνυμικός αλγόριθμος για την έκδοση
        βελτιστοποίησης. Τρέξ' τον, σύγκρινε με <InlineMath>{'k'}</InlineMath>.
        Από εκεί P, και P ⊆ NP.
      </>
    ),
  },
  'pt6-th4': {
    takeaway: (
      <>
        Το γενικό πρόβλημα «δέντρο που περιέχει σύνολο S» (Steiner Tree) είναι
        NP-πλήρες· αλλά η ειδική περίπτωση <InlineMath>{'|S| = n'}</InlineMath>{' '}
        εκφυλίζεται σε MST — στο P. Πάντα διάβασε ποια εκδοχή σου ζητείται πριν
        ταξινομήσεις.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «πρόβλημα Π σε γράφημα με βάρη + κάποιος περιορισμός σε υποσύνολο
        S». Πρώτη κίνηση: τι γίνεται όταν S περιέχει όλο το V; Αν το πρόβλημα
        εκφυλίζεται σε MST (ή shortest path, ή BFS), τότε P. Αν όχι, πιθανότατα
        NP-πλήρες — απόδειξη με αναγωγή από γνωστό.
      </>
    ),
  },
  'pt7-th1': {
    takeaway: (
      <>
        Με <em>σταθερό</em> <InlineMath>{'k'}</InlineMath>, το{' '}
        <InlineMath>{'O(n^k)'}</InlineMath> είναι πολυώνυμο σταθερού βαθμού —
        άρα πολυωνυμικό. INDEP γενικά NP-πλήρες, αλλά για σταθερό k σε P. Δεν
        έχει σχέση η πρακτική ταχύτητα — μόνο η ταξινόμηση σε P/NP.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις «σταθερό k», ξέχνα κάθε ένστασή σου για «πρακτικά αργό» — η
        ταξινόμηση είναι αλγοριθμική, όχι πρακτική. <InlineMath>{'n^{1000}'}</InlineMath>{' '}
        είναι πολυωνυμικό, <InlineMath>{'2^n'}</InlineMath> δεν είναι. Παγίδα:
        μην μπερδέψεις <InlineMath>{'n^k'}</InlineMath> (σταθερό k) με{' '}
        <InlineMath>{'k^n'}</InlineMath>.
      </>
    ),
  },
  'pt7-th4': {
    takeaway: (
      <>
        Δύο «παρόμοια» γραφικά προβλήματα μπορεί να ζουν σε διαφορετικές ζώνες:
        spanning <em>tree</em> = MST στο P, spanning <em>cycle</em> = TSP στο
        NPC. Η αλλαγή μιας λέξης («tree» ⇄ «cycle») σε εξεταστική δήλωση
        μπορεί να σε στείλει από εύκολο σε NP-πλήρες.
      </>
    ),
    examRadar: (
      <>
        Σ/Λ ή ταξινόμηση δύο προβλημάτων σε P/NP/NPC: ψάξε αν είναι «tree»
        (πιθανόν P) ή «cycle/path» (πιθανόν NPC). Παρόμοιο για «shortest» vs
        «longest». Σχεδόν πάντα ένα από τα δύο είναι NP-πλήρες· το άλλο, όχι.
      </>
    ),
  },
  'front-set-6-ask2': {
    takeaway: (
      <>
        Η <InlineMath>{'i'}</InlineMath>-στη ελαφρύτερη ακμή ανήκει πάντα στο
        ΕΕΔ ⇔ <InlineMath>{'i \\le 2'}</InlineMath>. Η μαγική γραμμή είναι το{' '}
        <InlineMath>{'i = 3'}</InlineMath>: αρκεί K₃ με βάρη 1, 2, 3 ως
        αντιπαράδειγμα στη γενίκευση «πάντα μπαίνει».
      </>
    ),
    examRadar: (
      <>
        Σ/Λ για ακμές ΕΕΔ: μέτρα πόσες έχουν τοποθετηθεί <em>πριν</em> από την
        ακμή που εξετάζεις. Αν είναι ≥ 2, μπορεί να σχηματιστεί τρίγωνο και να
        απορριφθεί — οπότε ο ισχυρισμός «πάντα μπαίνει» σπάει με ένα τρίγωνο.
      </>
    ),
  },
  'front-set-7-ask3': {
    takeaway: (
      <>
        Δάνεισε το MST για να φτιάξεις εφικτή TSP λύση: <em>preorder traversal
        του MST + κλείσιμο στον r</em>. Πάντα παράγει έγκυρο κύκλο Hamilton σε
        πλήρη γράφο, <InlineMath>{'O(n^2)'}</InlineMath>. Με τριγωνική ανισότητα
        είναι 2-προσέγγιση.
      </>
    ),
    examRadar: (
      <>
        «Δώσε εφικτή λύση σε NP-πλήρες πρόβλημα» = ψάξε εύκολο συγγενή. Για TSP
        ο συγγενής είναι MST· για 0-1 σακίδιο είναι κλασματικό σακίδιο· για
        ανεξάρτητο σύνολο είναι άπληστο μέγιστου βαθμού. Σχεδόν πάντα η
        εκφώνηση δίνει σήμα ποιο εργαλείο να δανειστείς.
      </>
    ),
  },
  'front-set-7-ask6': {
    takeaway: (
      <>
        «Μοναδικό μονοπάτι ανά ζεύγος» = δέντρο. «Ελάχιστο συνολικό κόστος» =
        ΕΕΔ. Άρα κάθε πρόβλημα τύπου «αναβάθμισε δίκτυο για να συνδέονται όλοι
        οικονομικά» είναι MST — εφάρμοσε Kruskal ή Prim σε{' '}
        <InlineMath>{'O(E \\log V)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «οικονομικότερη αναβάθμιση», «καλωδίωση χωρίς πλεονασμό», «δίκτυο
        χωρίς βρόχους», «μοναδική διαδρομή σύνδεσης». Όλα αυτά είναι λεκτικές
        υπογραφές του ΕΕΔ. Από εκεί η απάντηση είναι ρουτίνα: Kruskal ή Prim.
      </>
    ),
  },
  'front-set-7-ask11': {
    takeaway: (
      <>
        Τρία κλασικά Σ/Λ μαζί: (i) «μέγιστη ακμή ποτέ στο ΕΕΔ» ΛΑΘΟΣ — γέφυρες
        υποχρεωτικές· (ii) «Dijkstra-tree = ΕΕΔ» ΛΑΘΟΣ — διαφορετικοί στόχοι,
        τρίγωνο 1-1-2 ως αντιπαράδειγμα· (iii) «διακριτά βάρη ⇒ μοναδικό ΕΕΔ»
        ΣΩΣΤΟ — απόδειξη με ανταλλαγή στη συμμετρική διαφορά.
      </>
    ),
    examRadar: (
      <>
        Όταν Σ/Λ ρωτά για ΕΕΔ, διπλό test ανά πρόταση: (α) η ακμή ανήκει σε
        κάποιον κύκλο; Αν όχι = γέφυρα = υποχρεωτική· (β) είναι η μέγιστη
        ΚΑΠΟΙΟΥ κύκλου; Μόνο τότε η ιδιότητα κύκλου την αποκλείει. Παρόμοια
        διάκριση: Dijkstra-tree ↔ απόσταση ρίζας, ΕΕΔ ↔ συνολικό βάρος.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L10 — Δομές δεδομένων (σωροί, hash, union-find)
   * ─────────────────────────────────────────────────────────────────── */
  'front-set-5-ask10': {
    takeaway: (
      <>
        Όταν μία εξίσωση{' '}
        <InlineMath>{'F(a_1, \\ldots, a_k) = 0'}</InlineMath> χωρίζεται σε
        «αριστερή πλευρά» και «δεξιά πλευρά» με ίδιο πλήθος μεταβλητών,{' '}
        <strong>meet in the middle</strong>: χτίσε όλες τις τιμές της μίας
        πλευράς σε hash σε <InlineMath>{'O(n^{k/2})'}</InlineMath>, μετά ρώτα
        κάθε τιμή της άλλης σε <InlineMath>{'O(n^{k/2})'}</InlineMath>. Από{' '}
        <InlineMath>{'O(n^k)'}</InlineMath> πέφτεις στο{' '}
        <InlineMath>{'O(n^{k/2})'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «βρες αν υπάρχουν <InlineMath>{'k'}</InlineMath> στοιχεία που
        ικανοποιούν μία αλγεβρική σχέση», με <InlineMath>{'k = 3, 4'}</InlineMath>{' '}
        και ζητούμενο{' '}
        <InlineMath>{'O(n^{k/2})'}</InlineMath>. Άμεση κίνηση: ψάξε αν η σχέση
        αναδιατάσσεται σε «δύο μισά αθροιστή/γινόμενα», βάλε το ένα μισό σε
        hash, ρώτα το άλλο.
      </>
    ),
  },
  'front-set-5-ask11': {
    takeaway: (
      <>
        Όταν το εύρος τιμών είναι τεράστιο (π.χ.{' '}
        <InlineMath>{'\\{1, \\ldots, n^4\\}'}</InlineMath>) αλλά τα{' '}
        <em>στοιχεία</em> είναι λίγα, το hash είναι η μόνη λύση — όχι ο άμεσος
        πίνακας. <strong>n εγγραφές, O(1) αναμενόμενη αναζήτηση</strong>,
        ανεξάρτητα από το μέγεθος των τιμών.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «τιμές στο{' '}
        <InlineMath>{'\\{1, \\ldots, U\\}'}</InlineMath> με{' '}
        <InlineMath>{'U \\gg n'}</InlineMath>», «εύρος τιμών{' '}
        <InlineMath>{'n^c'}</InlineMath>», «αναζήτηση συμπληρώματος». Άμεσα
        hash. Πάντα γράψε «αναμενόμενος χρόνος» — σε χείριστη υλοποίηση το hash
        πέφτει σε <InlineMath>{'O(n^2)'}</InlineMath>.
      </>
    ),
  },
  'pt6-th3': {
    takeaway: (
      <>
        Δύο αναδρομές με ίδια διαίρεση{' '}
        <InlineMath>{'2n/3'}</InlineMath> αλλά διαφορετικό{' '}
        <InlineMath>{'a'}</InlineMath> δίνουν εντελώς διαφορετικές απαντήσεις:{' '}
        <InlineMath>{'a = 3'}</InlineMath> → φύλλα κυριαρχούν →{' '}
        <InlineMath>{'\\Theta(n^{\\log_{3/2} 3}) \\approx \\Theta(n^{2{,}71})'}</InlineMath>·{' '}
        <InlineMath>{'a = 1'}</InlineMath> → ένα μονοπάτι →{' '}
        <InlineMath>{'\\Theta(\\log n)'}</InlineMath>. Επίσης: όλες οι σωρο-πράξεις
        ζουν στο μονοπάτι, άρα <InlineMath>{'O(\\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις αναδρομή με <InlineMath>{'b'}</InlineMath> κλασματικό
        (π.χ. <InlineMath>{'3/2, 4/3'}</InlineMath>), μη μπερδευτείς —
        Master Theorem παίζει κανονικά, αρκεί να γράψεις{' '}
        <InlineMath>{'n^{\\log_b a}'}</InlineMath> και να το συγκρίνεις με το{' '}
        <InlineMath>{'f(n)'}</InlineMath>. Για σωρό μετά από αλλαγή κλειδιού:
        η μείωση τιμής σε max-heap → βύθιση (sift-down) με ανταλλαγή προς το{' '}
        <strong>μεγαλύτερο</strong> παιδί (όχι όποιο τύχει).
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L11 — Άπληστοι αλγόριθμοι I (interval scheduling, partition, greedy
   * tests/counterexamples, coin change)
   * ─────────────────────────────────────────────────────────────────── */
  'pt2-th2-3': {
    takeaway: (
      <>
        Η ορθότητα ενός άπληστου κανόνα <em>εξαρτάται από τις τιμές</em>, όχι
        από τη λογική του. «Πάντα το μεγαλύτερο κέρμα» αποτυγχάνει στο σύστημα{' '}
        <InlineMath>{'\\{1, 10, 25\\}'}</InlineMath> για ρέστα{' '}
        <InlineMath>{'30'}</InlineMath> (6 vs 3 κέρματα). Ένα μικρό
        αντιπαράδειγμα αρκεί — δεν χρειάζεται να αποδείξεις τίποτα παραπάνω.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση ρωτά «πετυχαίνει ο άπληστος;» σε μη-κανονικό σύστημα
        κερμάτων (που λείπει κάποια αξία ή έχει «κενό» — π.χ.{' '}
        <InlineMath>{'\\{1, 10, 25\\}, \\{1, 10, 15\\}, \\{1, 3, 4\\}'}</InlineMath>
        ), πρώτη κίνηση: ψάξε υπόλοιπο για το οποίο το μεγαλύτερο κέρμα σε
        αναγκάζει σε πολλά μικρότερα. Συχνά είναι το{' '}
        <InlineMath>{'\\text{megaCoin} + (\\text{megaCoin} - 1)'}</InlineMath>.
      </>
    ),
  },
  'front-set-6-ask3': {
    takeaway: (
      <>
        Η μέγιστη εναλλασσόμενη υπακολουθία είναι ακριβώς οι{' '}
        <em>κορυφές</em> και οι <em>κοιλάδες</em> του πίνακα. Σε μία σάρωση{' '}
        <InlineMath>{'O(n)'}</InlineMath>, κάθε αλλαγή φοράς δίνει ένα στοιχείο
        της απάντησης· τα ενδιάμεσα μονότονα δεν προσφέρουν τίποτε.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «μέγιστη υπακολουθία με σχέση εναλλαγής/μονοτονίας μεταξύ
        διαδοχικών», «πάνω-κάτω», «zigzag». Σκέψου το σήμα-είσοδο και ψάξε
        σημεία αλλαγής φοράς — όχι σύγκριση όλων των ζευγών. Συχνά η λύση είναι
        γραμμική σάρωση με δείκτη φοράς.
      </>
    ),
  },
  'front-set-6-ask5': {
    takeaway: (
      <>
        Για το σύστημα <InlineMath>{'\\{1, 5, 10, 25\\}'}</InlineMath> ο άπληστος
        είναι βέλτιστος — και η απόδειξη ξεκινά από <em>όρια στις ποσότητες</em>{' '}
        κάθε κέρματος σε μια βέλτιστη λύση (το πολύ 4 του 1, το πολύ 1 του 5,
        το πολύ 2 του 10). Αν ο άπληστος και η βέλτιστη διαφέρουν στην πρώτη
        ταξινομημένη φθίνουσα θέση, αυτά τα όρια οδηγούν σε αντίφαση.
      </>
    ),
    examRadar: (
      <>
        Όταν η εκφώνηση είναι «δείξε ότι ο άπληστος είναι βέλτιστος» σε
        στρωμένο σύστημα κερμάτων (αξίες όπου κάθε διπλότυπο μικρότερου
        αντικαθίσταται από μεγαλύτερο), η συνταγή είναι: όρια ποσοτήτων →
        πρώτη διαφορά → αντίφαση. Επίσης: αν δεις σύστημα <em>χωρίς</em> 5άρι
        ή με κενό, σκέψου ότι ο ίδιος κανόνας ίσως ΔΕΝ είναι βέλτιστος (δες{' '}
        <InlineMath>{'\\{1, 10, 25\\}'}</InlineMath>).
      </>
    ),
  },
  'front-set-6-ask6': {
    takeaway: (
      <>
        Για το πρόβλημα ελάχιστων στάσεων ανεφοδιασμού, ο άπληστος{' '}
        «προχώρα στον <em>μακρινότερο</em> προσβάσιμο σταθμό» είναι βέλτιστος.
        Η απόδειξη είναι «greedy stays ahead» με επαγωγή:{' '}
        <InlineMath>{'g_k \\ge o_k'}</InlineMath> για κάθε{' '}
        <InlineMath>{'k'}</InlineMath>, οπότε ο άπληστος δεν χρειάζεται
        περισσότερες στάσεις από καμία άλλη λύση.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «ελάχιστες στάσεις/μεταβάσεις σε γραμμικό ορίζοντα με όριο
        πόρου ανά βήμα» (καύσιμο, χρέωση μπαταρίας, βεληνεκές, εύρος ραντάρ).
        Άπληστος «πήγαινε όσο πιο μακριά μπορείς» + απόδειξη «μένει μπροστά».
        Πρόσεξε ότι η απόδειξη δεν είναι «μένει πιο μπροστά» (αυστηρή), αλλά
        «τουλάχιστον τόσο μπροστά» (≥).
      </>
    ),
  },
  'front-set-6-ask8': {
    takeaway: (
      <>
        Δύο μαθήματα σε ένα: (α) ο άπληστος χρωματισμός γραφημάτων{' '}
        <em>δεν</em> δίνει πάντα τον ελάχιστο αριθμό χρωμάτων — η σειρά
        καθορίζει το αποτέλεσμα (NP-δύσκολο γενικά)· (β) τα ραντεβού-ταξί είναι
        διαμέριση διαστημάτων, που ο άπληστος «πρώτη έναρξη + ελεύθερο ταξί»
        λύνει βέλτιστα με <InlineMath>{'d'}</InlineMath> = βάθος ταξί.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «ελάχιστος χρωματισμός γραφήματος» → πες ευθέως ότι ο άπληστος
        εξαρτάται από τη σειρά (NP). «Ελάχιστα μηχανήματα/αίθουσες/ταξί για
        ταυτόχρονες εργασίες με χρόνο έναρξης-λήξης» → διαμέριση διαστημάτων,
        απάντηση = βάθος, απόδειξη με «η <InlineMath>{'d'}</InlineMath>-οστή
        ανοίγει επειδή <InlineMath>{'d'}</InlineMath> τρέχουν μαζί».
      </>
    ),
  },
  'front-set-7-ask4': {
    takeaway: (
      <>
        Όταν μια απόφαση <em>δεσμεύει</em> μεγάλο μέλλον (συμβόλαιο 12 μηνών), η
        τοπική σύγκριση του άπληστου δεν αρκεί. Το αντιπαράδειγμα{' '}
        <InlineMath>{'(1, \\dots, 1, 1000)'}</InlineMath> με{' '}
        <InlineMath>{'C = 12'}</InlineMath>: ο άπληστος πληρώνει{' '}
        <InlineMath>{'1012'}</InlineMath>, η βέλτιστη μόλις{' '}
        <InlineMath>{'13'}</InlineMath>. Το πρόβλημα θέλει DP.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «πακέτο/συμβόλαιο με δέσμευση χρονικού πλάτους», «ξενοδοχείο
        για X βράδια vs ημερήσιο», «αποθήκευση για block W vs ανά μονάδα».
        Πρώτη κίνηση: ψάξε αντιπαράδειγμα όπου η πρώτη απόφαση κλειδώνει μια
        ακριβή θέση στο μέλλον. Μετά γράψε DP{' '}
        <InlineMath>{'D[i] = \\min(p_i + D[i+1], C + D[i+W])'}</InlineMath>.
      </>
    ),
  },
  'front-set-7-ask5': {
    takeaway: (
      <>
        Σε πρόβλημα συντομότερου μονοπατιού σε πλέγμα, «πάντα το φθηνότερο
        επόμενο» αποτυγχάνει: ένα φθηνό κελί τώρα μπορεί να σε καθηλώσει σε
        ακριβά κελιά μετά. Η σωστή λύση είναι DP{' '}
        <InlineMath>{'D(i,j) = A[i][j] + \\min'}</InlineMath> τριών γειτονικών
        κελιών της προηγούμενης γραμμής.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «ελάχιστο κόστος μονοπατιού σε πλέγμα/πίνακα», «τρεις
        επιτρεπτές κινήσεις ανά βήμα». Άπληστος = παγίδα: ψάξε αντιπαράδειγμα
        όπου η <em>δεύτερη</em> πιο φθηνή εκκίνηση ξεκλειδώνει φθηνότερη
        συνέχεια. Λύση: DP <InlineMath>{'O(mn)'}</InlineMath> κάτω → πάνω.
      </>
    ),
  },
  'front-set-7-ask7': {
    takeaway: (
      <>
        Για κάλυψη σημείων με μοναδιαία διαστήματα, ο άπληστος «αριστερότερο
        ακάλυπτο → διάστημα <InlineMath>{'[y_i, y_i + 1]'}</InlineMath>» είναι
        βέλτιστος. Το αριστερότερο σημείο{' '}
        <em>πρέπει</em> να καλυφθεί· από όλα τα μοναδιαία διαστήματα που το
        περιλαμβάνουν, αυτό που ξεκινά εκεί πιάνει τα περισσότερα επόμενα.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «κάλυψη ταξινομημένων σημείων με <em>σταθερό μήκος</em>
        διαστήματα», «ελάχιστα παράθυρα», «sensor placement σε γραμμή».
        Συνταγή: ταξινόμηση + «αριστερότερο ακάλυπτο» + ανταλλαγή. Πρόσεξε:
        δουλεύει για <em>μοναδιαίο</em> μήκος γιατί όλα τα διαστήματα έχουν
        ίσο μήκος — με διαφορετικά μήκη ή 2D αλλάζει το πρόβλημα.
      </>
    ),
  },
  'front-set-7-ask8': {
    takeaway: (
      <>
        Το πρόβλημα κατανομής μαθημάτων σε αίθουσες είναι η διαμέριση
        διαστημάτων. Ο άπληστος «πρώτη έναρξη + ελεύθερη αίθουσα» χρησιμοποιεί
        ακριβώς <InlineMath>{'d'}</InlineMath> = βάθος αίθουσες, που είναι κάτω
        φράγμα για κάθε λύση — άρα βέλτιστος. Σε{' '}
        <InlineMath>{'O(m \\log m)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «ελάχιστος αριθμός X για ταυτόχρονες εργασίες με χρόνους έναρξης
        και λήξης». Η μετάφραση είναι αυτόματη: διαμέριση διαστημάτων →
        απάντηση = βάθος. Απόδειξη πάντα η ίδια: «η{' '}
        <InlineMath>{'d'}</InlineMath>-οστή αίθουσα ανοίγει επειδή{' '}
        <InlineMath>{'d'}</InlineMath> μαθήματα τρέχουν μαζί τη στιγμή{' '}
        <InlineMath>{'s_j'}</InlineMath>».
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L12 — Άπληστοι αλγόριθμοι II (EDF / exchange argument, τοπολογική
   * διάταξη, χρόνοι αναμονής, two-stage flow shop)
   * ─────────────────────────────────────────────────────────────────── */
  'pt2-th2-2': {
    takeaway: (
      <>
        Η τοπολογική ταξινόμηση παράγει σωστό αποτέλεσμα{' '}
        <em>για κάθε</em> γράφημα μιας κλάσης{' '}
        <strong>αν και μόνο αν</strong> η κλάση εγγυάται «κατευθυνόμενο +
        χωρίς κύκλους». Από τις τέσσερις: σωστές οι (ii) DAG και (iii)
        κατευθυνόμενα δέντρα. Τα θετικά βάρη και η διμέρεια δεν εγγυώνται
        ακυκλικότητα — ένα αντιπαράδειγμα (κύκλος <InlineMath>{'A \\to B \\to C \\to A'}</InlineMath>{' '}
        με θετικά βάρη / 4-κύκλος σε διμερές) αρκεί για «όχι πάντα».
      </>
    ),
    examRadar: (
      <>
        Σήματα: «σε ποιες κλάσεις γραφημάτων δουλεύει σωστά ο αλγόριθμος Χ»,
        «επιλέξτε όλες τις σωστές». Συνταγή: γράψε τι απαιτεί ο αλγόριθμος
        (εδώ: DAG)· για κάθε κλάση ρώτα «εγγυάται η ιδιότητα την προϋπόθεση;».
        Αν όχι, βρες αντιπαράδειγμα — μη χάνεις χρόνο σε «απόδειξη». Συχνά οι
        παγίδες είναι ιδιότητες που αφορούν <em>άλλη</em> πλευρά του γραφήματος
        (βάρη, χρωματικότητα, βαθμοί) και δεν εμπλέκονται με τη δομή που σου
        χρειάζεται.
      </>
    ),
  },
  'pt2-th4': {
    takeaway: (
      <>
        Για ελαχιστοποίηση συνολικού/μέσου χρόνου ολοκλήρωσης σε μία μηχανή, η
        σωστή σειρά είναι <strong>SPT</strong> (Shortest Processing Time —
        αύξον <InlineMath>{'t_i'}</InlineMath>). Διαίσθηση: το αίτημα στη θέση{' '}
        <InlineMath>{'k'}</InlineMath> πληρώνεται{' '}
        <InlineMath>{'(n-k+1)'}</InlineMath> φορές — οι αρχικές θέσεις ζυγίζουν
        περισσότερο, άρα βάζεις πρώτα τα μικρά. Η απόδειξη ορθότητας με
        ανταλλαγή διαδοχικών «εκτός σειράς» δείχνει ότι κάθε swap μειώνει το
        άθροισμα κατά <InlineMath>{'t_i - t_j > 0'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «ένας server / μία μηχανή / μία CPU», «συνολική / μέση
        αναμονή», «χρόνος ολοκλήρωσης ανά πελάτη». Συνταγή: ταξινόμηση κατά
        αύξον <InlineMath>{'t_i'}</InlineMath> + επιχείρημα ανταλλαγής δύο
        γραμμών. Πρόσεξε δύο παραλλαγές που <em>αναστρέφουν</em> την απάντηση:
        (α) προθεσμίες αντί για χρόνους — γίνεται EDF (αύξον{' '}
        <InlineMath>{'d_i'}</InlineMath>, μέγιστη καθυστέρηση), (β) παράλληλη
        φάση μετά τη σειριακή — γίνεται LPT (φθίνον{' '}
        <InlineMath>{'p_i'}</InlineMath>, makespan). Το ίδιο «πρότυπο
        ανταλλαγής», διαφορετική αντικειμενική συνάρτηση, διαφορετικό κλειδί.
      </>
    ),
  },
  'front-set-6-ask4': {
    takeaway: (
      <>
        Σε flow shop δύο φάσεων (σειριακή + παράλληλη, μία ανά εργασία) η
        σωστή σειρά της <em>στενωπού</em> είναι <strong>φθίνον{' '}
        <InlineMath>{'p_i'}</InlineMath></strong> (longest parallel processing
        time first) — όχι κατά τη στενωπό! Διαίσθηση: η σειρά καθορίζει ΜΟΝΟ
        πότε ξεκινάει η παράλληλη πλύση κάθε ρούχου· αν αφήσεις τη μεγαλύτερη
        πλύση για το τέλος, εκείνη θα κρέμεται μόνη της αφού έχει τελειώσει η
        στενωπός και θα πυροδοτήσει τη μέγιστη χρονική στιγμή λήξης.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «δύο φάσεις — μία σειριακή + μία παράλληλη ανά εργασία»,
        «μηχανική αναμονή + αυτόνομη επεξεργασία», «έλεγχος + αυτοματισμός»,
        «pre-processing + ασύγχρονη ουρά». Συνταγή: ταξινόμηση κατά{' '}
        <em>φθίνον</em> χρόνο της <em>παράλληλης</em> φάσης + επιχείρημα
        ανταλλαγής στο makespan. Πρόσεξε ότι αυτό αναστρέφει τη «λογική του
        SPT» — εδώ έχεις κίνητρο να ξεκινήσεις γρήγορα το ΜΕΓΑΛΟ, όχι το μικρό.
        Με αυστηρά διαδοχικές φάσεις (όλες οι εργασίες περνούν από ΔΥΟ
        σειριακές μηχανές, όχι παράλληλες) ισχύει αντί αυτού το{' '}
        <em>θεώρημα Johnson</em>, διαφορετική συνταγή.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L13 — Άπληστοι αλγόριθμοι III (Huffman, αναγκαστικές κινήσεις,
   * fractional vs 0-1 knapsack)
   * ─────────────────────────────────────────────────────────────────── */
  'pt3-th3': {
    takeaway: (
      <>
        Σε ένα δέντρο, ένα <strong>φύλλο</strong> δεν έχει εναλλακτική: η
        μοναδική του ακμή πρέπει να μπει σε κάθε τέλειο ταίριασμα. Η ίδια
        αρχή «αναγκαστική κίνηση ⇒ δωρεάν για τον άπληστο» τρέχει σαν κλωστή
        και στον Huffman (οι δύο σπανιότεροι ως αδέρφια). Όταν εμφανιστεί
        απομονωμένη κορυφή κατά την αφαίρεση, το δέντρο{' '}
        <em>δεν</em> έχει τέλειο ταίριασμα — η ίδια διαδικασία{' '}
        <strong>αποφασίζει</strong> και την ύπαρξη.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «δέντρο» + «ταίριασμα» / «κάλυψη» / «τοποθέτηση κουκίδων στις
        ακμές». Σχεδόν πάντα το επιχείρημα είναι «φύλλο ⇒ μία επιλογή»· δες αν
        η εκφώνηση ζητάει ύπαρξη ή απαρίθμηση. Πρόσεξε: ο ίδιος τύπος
        επιχειρήματος (αναγκαστική κίνηση) θα σου ζητηθεί και ως μέρος της
        απόδειξης Huffman σε άλλες ασκήσεις — μη γράψεις «πάρε τα δύο
        ελαφρύτερα» χωρίς δικαιολόγηση.
      </>
    ),
  },
  'front-set-6-ask7': {
    takeaway: (
      <>
        Η μηχανική του Huffman είναι μία και απαράλλακτη:{' '}
        <strong>ταξινόμησε κατά συχνότητα ↗, ένωσε τα δύο μικρότερα,
        πρόσθεσέ τους ξανά</strong>. Το δένδρο που προκύπτει βάφει τα φύλλα
        ώστε οι σπάνιοι χαρακτήρες να πέφτουν βαθιά (μακρύς κώδικας) και οι
        συχνοί να μένουν κοντά στη ρίζα. Η κωδικοποίηση/αποκωδικοποίηση είναι
        μηχανική περιπλάνηση στο δένδρο: ρίζα→φύλλο για encode, μία λέξη ανά
        leaf-hit για decode.
      </>
    ),
    examRadar: (
      <>
        Σήματα: λίστα χαρακτήρων με συχνότητες/πιθανότητες, ζήτημα «κατασκευή
        δένδρου» + «πίνακας κωδικών» + «encode/decode». Καρτέλα-checklist:{' '}
        <em>(1)</em> κατασκευή με min-heap, <em>(2)</em> κώδικες ρίζα→φύλλο,{' '}
        <em>(3)</em> έλεγχος απροθεματικότητας, <em>(4)</em> encode/decode.
        Αν η εκφώνηση μιλάει για συμπίεση και δίνεις «σταθερό μήκος» — λάθος·
        πάντα ζητείται ο μεταβλητός. Αναμενόμενο μήκος ανά χαρακτήρα ={' '}
        <InlineMath>{'\\sum f_x \\cdot |c(x)|'}</InlineMath>.
      </>
    ),
  },
  'front-set-7-ask1': {
    takeaway: (
      <>
        «Ένωση χρυσού» = Huffman με άλλο ρούχο. Το συνολικό κόστος είναι{' '}
        <InlineMath>{'\\sum w_i \\cdot d(i)'}</InlineMath> όπου{' '}
        <InlineMath>{'d(i)'}</InlineMath> είναι το βάθος του{' '}
        <em>i</em>-στού φύλλου-ράβδου στο δένδρο ενώσεων. Άρα οι ελαφρές
        ράβδοι ενώνονται πρώτες (πέφτουν βαθιά — επιτρέπεται), οι βαριές
        περιμένουν (μένουν ψηλά). Min-heap σου δίνει{' '}
        <InlineMath>{'O(n \\log n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήματα: «έχω <em>n</em> στοιχεία με βάρη, κάθε σύνθεση/ένωση κοστίζει
        το άθροισμα, ελαχιστοποίηση συνολικού κόστους». Δίνε αμέσως «δύο
        ελαφρύτερες με min-heap, <InlineMath>{'O(n \\log n)'}</InlineMath>».
        Αναγνώρισε το ίδιο μοτίβο σε: σύνθεση αρχείων με κόστος ανά γραμμή,
        συγκόλληση σχοινιών, k-merge. Αν η εκφώνηση ζητάει «απόδειξη
        ορθότητας» χωρίς να σου δίνει συγκεκριμένο instance, αναπαρέξε
        ολόκληρη την αλυσίδα Huffman (Λήμμα 1 + Λήμμα 2 + επαγωγή) —
        αλλιώς αναφορά «είναι παραλλαγή Huffman» αρκεί.
      </>
    ),
  },
  'front-set-7-ask12': {
    takeaway: (
      <>
        Το κλασματικό σακίδιο λύνεται άπληστα (φθίνον λόγο{' '}
        <InlineMath>{'v_i/w_i'}</InlineMath>) γιατί το <em>κόψιμο</em> σου
        επιτρέπει να εκμεταλλευτείς ΑΚΡΙΒΩΣ τον χώρο που μένει. Το 0-1
        σακίδιο{' '}
        <strong>δεν</strong> λύνεται άπληστα: ο ίδιος κανόνας λόγου αφήνει
        «τυφλά» κενά που δεν γεμίζονται από κανένα ολόκληρο αντικείμενο
        — και είναι NP-δύσκολο, λύνεται με DP (πίνακας{' '}
        <InlineMath>{'M[i][w]'}</InlineMath> σε{' '}
        <InlineMath>{'O(nW)'}</InlineMath>).
      </>
    ),
    examRadar: (
      <>
        Σήμα: όποτε δίνονται «αντικείμενα με αξία/βάρος + χωρητικότητα», ρώτα
        αμέσως «κόβονται;». Αν ναι — άπληστο με ταξινόμηση λόγων, ανταλλαγή
        για ορθότητα, <InlineMath>{'O(n \\log n)'}</InlineMath>. Αν όχι —
        χρησιμοποίησε το{' '}
        <strong>
          <InlineMath>{'w = (10, 20, 30)'}</InlineMath>,{' '}
          <InlineMath>{'v = (60, 80, 90)'}</InlineMath>,{' '}
          <InlineMath>{'W = 50'}</InlineMath>
        </strong>{' '}
        ως counterexample (greedy=140 vs OPT=170), και απάντησε «NP-δύσκολο,
        λύνεται με DP». Αν σε ρωτήσουν αν υπάρχει άπληστος για 0-1: όχι, και
        εξήγησε γιατί — το κόψιμο είναι μηχανισμός βελτιστότητας, χωρίς αυτό
        η άπληστη επιλογή κάνει αναστρέψιμη δέσμευση.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L14 — Δυναμικός Προγραμματισμός I (memoization & WIS)
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th1-q7': {
    takeaway: (
      <>
        Όταν ένας DP πίνακας έχει <InlineMath>{'n \\times m'}</InlineMath>{' '}
        κελιά, η πολυπλοκότητα είναι <strong>τουλάχιστον</strong>{' '}
        <InlineMath>{'\\Omega(n \\cdot m)'}</InlineMath> — γιατί ΟΛΑ τα κελιά
        πρέπει να γεμίσουν. Οποιαδήποτε υποψήφια κλάση πέφτει ασυμπτωτικά κάτω
        από αυτό το κατώφλι (εδώ: το <InlineMath>{'O(n)'}</InlineMath>{' '}
        για <InlineMath>{'m > 1'}</InlineMath>) <strong>αποκλείεται με
        βεβαιότητα</strong>, χωρίς να ξέρεις την αναδρομή.
      </>
    ),
    examRadar: (
      <>
        Αν δεις «ποια από τις παρακάτω ΔΕΝ μπορεί να είναι η πολυπλοκότητα ενός
        DP <InlineMath>{'n \\times m'}</InlineMath>;», η απάντηση είναι σχεδόν
        πάντα η εκφραστική κάτω από <InlineMath>{'nm'}</InlineMath>. Έλεγξε
        αμέσως τις «μικρές» (μικρότερες ή ίσες από{' '}
        <InlineMath>{'n'}</InlineMath> ή <InlineMath>{'m'}</InlineMath>{' '}
        ξεχωριστά). Όλες οι <InlineMath>{'o(\\cdot)'}</InlineMath>{' '}
        εκφραστικές κρύβουν παγίδα: ρώτα μόνο «μπορεί η κλάση να περιέχει κάτι
        ≥ <InlineMath>{'nm'}</InlineMath>;» — όχι «είναι η κλάση{' '}
        <InlineMath>{'nm'}</InlineMath>;».
      </>
    ),
  },
  'pt1-th1-q8': {
    takeaway: (
      <>
        Σε ένα 1D DP πίνακα <InlineMath>{'n'}</InlineMath> κελιών η
        πολυπλοκότητα είναι σίγουρα{' '}
        <InlineMath>{'\\Omega(n)'}</InlineMath>. Άρα{' '}
        <InlineMath>{'O(1)'}</InlineMath> και{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> είναι κλασικές «αδύνατες
        απαντήσεις» — κανείς DP δεν χωράει σε λιγότερα από{' '}
        <InlineMath>{'n'}</InlineMath> βήματα όταν πρέπει να γεμίσει
        όλα τα κελιά.
      </>
    ),
    examRadar: (
      <>
        Στις πολλαπλής επιλογής για 1D DP, χτύπα πρώτα το{' '}
        <InlineMath>{'O(1)'}</InlineMath> και το{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> ως αυτόματα αποκλεισμένα. Τα{' '}
        <InlineMath>{'O(n)'}</InlineMath>, <InlineMath>{'O(n^2)'}</InlineMath>,{' '}
        <InlineMath>{'O(n^3)'}</InlineMath> κ.λπ. είναι όλα συμβατά με τον{' '}
        DP — η εκφώνηση δεν δίνει την αναδρομή, οπότε δεν έχεις τρόπο να
        αποκλείσεις «μεγάλα» άνω φράγματα.
      </>
    ),
  },
  'pt1-th3': {
    takeaway: (
      <>
        Όταν η <em>τελευταία απόφαση</em> είναι μία μικρή σταθερή λίστα (εδώ:
        ταξί ή πατίνι), η αναδρομή γράφεται «μηχανικά»:{' '}
        <InlineMath>{'\\text{OPT}(i) = \\min/\\max \\bigl\\{ \\text{τοπικό κόστος επιλογής}_k + \\text{OPT}(\\text{πριν την επιλογή}_k) \\bigr\\}'}</InlineMath>.
        Στην πλατφόρμα δόνησης κάθε επιλογή «καταναλώνει» διαφορετικό αριθμό
        θέσεων — η ίδια η <strong>δομή του προβλήματος γίνεται δείκτης πίνακα</strong>{' '}
        (<InlineMath>{'i-1'}</InlineMath> για ταξί,{' '}
        <InlineMath>{'i-4'}</InlineMath> για πατίνι).
      </>
    ),
    examRadar: (
      <>
        Σήμα: «ελάχιστο/μέγιστο κόστος για να φτάσουμε στο{' '}
        <InlineMath>{'n'}</InlineMath>, με 2–3 πιθανές κινήσεις στο τελευταίο
        βήμα». Γράψε αναδρομή{' '}
        <InlineMath>{'\\text{OPT}(i) = \\min_k(\\text{cost}_k + \\text{OPT}(i - \\Delta_k))'}</InlineMath>{' '}
        με τα <InlineMath>{'\\Delta_k'}</InlineMath> = «πόσο πίσω σε γυρίζει
        αυτή η επιλογή». Μην ξεχάσεις <InlineMath>{'\\max(0, i-\\Delta_k)'}</InlineMath>{' '}
        για τα πρώτα κελιά.
      </>
    ),
  },
  'pt2-th1-q6': {
    takeaway: (
      <>
        Δύο εκφραστικές κάτω από το κατώφλι{' '}
        <InlineMath>{'\\Omega(nm)'}</InlineMath> αυτή τη φορά:{' '}
        <InlineMath>{'O(m)'}</InlineMath> και{' '}
        <InlineMath>{'O(n)'}</InlineMath>. Δοκίμασέ τες με τη «δοκιμή του
        ασύμμετρου»: όταν η μία διάσταση μεγαλώνει ενώ η άλλη μένει σταθερή,
        το <InlineMath>{'nm'}</InlineMath> ξεπερνά την υποψήφια εκφραστική —
        άρα ασυμπτωτικά μικρότερη.
      </>
    ),
    examRadar: (
      <>
        Όταν δύο υποψήφιες απαντήσεις είναι «μονοδιάστατες»{' '}
        (<InlineMath>{'O(n)'}</InlineMath>, <InlineMath>{'O(m)'}</InlineMath>{' '}
        ή <InlineMath>{'O(n^c)'}</InlineMath> χωρίς{' '}
        <InlineMath>{'m'}</InlineMath>), σχεδόν πάντα είναι οι σωστές
        απαντήσεις «ΔΕΝ είναι». Κάθε εκφραστική με{' '}
        <em>και τα δύο</em> <InlineMath>{'n'}</InlineMath> και{' '}
        <InlineMath>{'m'}</InlineMath> (ή με μία διάσταση σε δύναμη ≥ 2) είναι
        πιθανή.
      </>
    ),
  },
  'pt2-th1-q7': {
    takeaway: (
      <>
        Πανομοιότυπη απάντηση με το <strong>pt1-th1-q8</strong>: σε ένα 1D DP
        πίνακα <InlineMath>{'n'}</InlineMath> κελιών,{' '}
        <InlineMath>{'O(1)'}</InlineMath> και{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> είναι ασυμπτωτικά κάτω από{' '}
        <InlineMath>{'n'}</InlineMath> και αποκλείονται. Το «δίδυμο»
        ερώτημα στα διαφορετικά Παλαιά Θέματα είναι δείκτης ότι αυτή είναι μια
        σταθερή ερώτηση εξετάσεων.
      </>
    ),
    examRadar: (
      <>
        Είναι η αυτή ερώτηση σε δεύτερο πανομοιότυπο τύπο. Χτύπα ξανά τα{' '}
        <InlineMath>{'O(1)'}</InlineMath>,{' '}
        <InlineMath>{'O(\\log n)'}</InlineMath> και κάθε{' '}
        <InlineMath>{'O(\\log^c n)'}</InlineMath> για οποιοδήποτε{' '}
        <InlineMath>{'c'}</InlineMath>. Πιθανά μένουν{' '}
        <InlineMath>{'O(n^c)'}</InlineMath> για κάθε{' '}
        <InlineMath>{'c \\ge 1'}</InlineMath>.
      </>
    ),
  },
  'pt5-th4': {
    takeaway: (
      <>
        Το «μέγιστο ανεξάρτητο σύνολο σε μονοπάτι» είναι ο πιο καθαρός DP της
        εξεταστικής: <em>μέσα ή έξω</em> για κάθε{' '}
        <InlineMath>{'x_i'}</InlineMath>, με αναδρομή{' '}
        <InlineMath>{'\\text{OPT}(i) = \\max(\\text{OPT}(i-1),\\, \\varphi_i + \\text{OPT}(i-2))'}</InlineMath>.
        Ο άπληστος «μόνο μονούς ή μόνο ζυγούς» <strong>χάνει</strong>: το
        βέλτιστο είναι μικτό (στο στιγμιότυπο,{' '}
        <InlineMath>{'\\{x_2, x_5, x_7\\} = 96 > 92'}</InlineMath>).
      </>
    ),
    examRadar: (
      <>
        Σήμα: «επιλογή υποσυνόλου από γραμμή με απαγόρευση γειτονικών» (κολώνες,
        εστιατόρια, εργαζόμενοι, σπίτια ληστείας). Στρώσε{' '}
        <InlineMath>{'\\text{OPT}(i) = \\max(\\text{OPT}(i-1),\\, v_i + \\text{OPT}(i-2))'}</InlineMath>
        — γραμμικός χρόνος{' '}
        <InlineMath>{'\\Theta(n)'}</InlineMath>, ανεξάρτητος των τιμών{' '}
        <InlineMath>{'v_i'}</InlineMath>. Αν κάποιος άπληστος «όλα μονά / όλα
        ζυγά» μοιάζει πιθανός, βάλε το στιγμιότυπο{' '}
        <InlineMath>{'(8, 40, 20, 16, 32, 36, 24)'}</InlineMath> ως αντιπαράδειγμα
        (μονοί=84, ζυγοί=92, μικτό=96).
      </>
    ),
  },
  'pt6-th2': {
    takeaway: (
      <>
        Η <strong>πλατφόρμα δόνησης</strong> είναι αυτούσιο weighted interval
        scheduling — με 4 βήματα: ταξινόμηση κατά λήξη,{' '}
        <InlineMath>{'p(j)'}</InlineMath>, αναδρομή{' '}
        <InlineMath>{'P[j] = \\max(P[j-1],\\, p_j + P[p(j)])'}</InlineMath>,
        ανάκτηση. Ο άπληστος «κατά συνδρομή» <strong>αποτυγχάνει</strong>: μια
        ακριβή εργασία μπορεί να μπλοκάρει δύο φθηνές που μαζί την ξεπερνούν
        (counterexample: A=100 μπλοκάρει B+C=120).
      </>
    ),
    examRadar: (
      <>
        Όποτε δίνεται «<em>μη επικαλυπτόμενα</em> + βάρη/συνδρομές/τιμές + max
        άθροισμα», ΜΗΝ ψάχνεις απλό κριτήριο ταξινόμησης — είναι WIS. Γράψε τα
        4 βήματα, σχεδίασε ένα 3-interval counterexample (A=[0,10] vs
        B=[0,5]+C=[6,10] με βάρη 100/60/60) για να δείξεις γιατί ο άπληστος
        χάνει, και κλείσε με{' '}
        <InlineMath>{'O(n \\log n)'}</InlineMath>.
      </>
    ),
  },
  'pt7-th2': {
    takeaway: (
      <>
        Όταν μια αναδρομή{' '}
        <InlineMath>{'T(n) = T(n-d_1) + \\dots + T(n-d_k) + O(1)'}</InlineMath>{' '}
        γίνεται «αφελής» (χωρίς memoization), το δέντρο έχει{' '}
        <InlineMath>{'k'}</InlineMath> παιδιά ανά κόμβο και βάθος{' '}
        <InlineMath>{'\\ge n / \\max d_i'}</InlineMath> — δηλαδή τουλάχιστον{' '}
        <InlineMath>{'k^{n / \\max d_i}'}</InlineMath> κόμβους. Memoization
        στραγγίζει το δέντρο σε <InlineMath>{'n'}</InlineMath>{' '}
        υπολογισμούς, μεταφέροντας τη συνολική δουλειά από εκθετική σε
        γραμμική.
      </>
    ),
    examRadar: (
      <>
        Σήμα του «δείξε ότι ο αφελής είναι εκθετικός»: μέτρα <em>πόσα παιδιά</em>{' '}
        έχει κάθε κλήση (το <InlineMath>{'k'}</InlineMath>) και <em>πόσο μειώνεται</em>{' '}
        το όρισμα στη μικρότερη μείωση (το{' '}
        <InlineMath>{'\\max d_i'}</InlineMath>). Δώσε το κάτω φράγμα{' '}
        <InlineMath>{'\\Omega(k^{n / \\max d_i})'}</InlineMath>. Για 3-branch
        με max βήμα 3 (όπως εδώ) είναι{' '}
        <InlineMath>{'\\Omega(3^{n/3}) = \\Omega(1{,}44^n)'}</InlineMath>.
      </>
    ),
  },
  'front-set-8-ask3': {
    takeaway: (
      <>
        Ο <strong>τεμαχισμός ράβδου</strong> είναι το πρωτότυπο
        «δοκίμασε όλες τις πρώτες κοπές»:{' '}
        <InlineMath>{'C(i) = \\max_{1 \\le k \\le i} V_k + C(i-k)'}</InlineMath>.
        Διαφέρει από το weighted interval scheduling γιατί δεν έχει
        «μη επικάλυψη» — απλώς κόβει σε δύο ανεξάρτητα κομμάτια. Κάθε{' '}
        <InlineMath>{'C(i)'}</InlineMath> κάνει{' '}
        <InlineMath>{'i'}</InlineMath> δουλειά → συνολικά{' '}
        <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Όποτε σου ζητούν να βελτιστοποιήσεις «πώς να σπάσεις ένα ομογενές
        αντικείμενο σε κομμάτια» με αθροιστικό κέρδος (ράβδος, σχοινί, ταινία,
        αρχείο), η αναδρομή είναι{' '}
        <InlineMath>{'C(i) = \\max_k (V_k + C(i-k))'}</InlineMath>. Αν το{' '}
        <InlineMath>{'V'}</InlineMath> είναι ταξινομημένο φθίνον <em>και</em>{' '}
        υπό-προσθετικό, ίσως δουλέψει greedy — αλλά γενικά είναι DP{' '}
        <InlineMath>{'\\Theta(n^2)'}</InlineMath>.
      </>
    ),
  },
  'front-set-8-ask4': {
    takeaway: (
      <>
        Η DP για εστιατόρια είναι η ίδια με το «μέγιστο ανεξάρτητο σύνολο σε
        μονοπάτι» — απλώς η απαγόρευση γίνεται γεωμετρική (≥{' '}
        <InlineMath>{'k'}</InlineMath> km αντί για «όχι γείτονας»). Αναδρομή:{' '}
        <InlineMath>{'D(i) = \\max(D(i-1),\\, p_i + D(j^*))'}</InlineMath>, με{' '}
        <InlineMath>{'j^*'}</InlineMath> = μεγαλύτερος{' '}
        <InlineMath>{'j < i'}</InlineMath> με{' '}
        <InlineMath>{'m_i - m_j \\ge k'}</InlineMath>. Δυαδική αναζήτηση για{' '}
        <InlineMath>{'j^*'}</InlineMath> →{' '}
        <InlineMath>{'O(n \\log n)'}</InlineMath>, ή δύο δείκτες →{' '}
        <InlineMath>{'O(n)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «επιλογή υποσυνόλου από διατεταγμένη ακολουθία με ελάχιστη
        απόσταση/χρόνο/χωρητικότητα μεταξύ επιλεγμένων». Ο{' '}
        <InlineMath>{'j^*'}</InlineMath> είναι η γενίκευση του{' '}
        <InlineMath>{'p(j)'}</InlineMath> από το WIS και του{' '}
        <InlineMath>{'i-2'}</InlineMath> από το{' '}
        <a href="#exercise:pt5-th4" className="underline">pt5-th4</a>. Στην
        ταξινομημένη είσοδο, δυαδική αναζήτηση. Στην πραγματικότητα του
        εξεταστικού: σάρωση δύο δεικτών για{' '}
        <InlineMath>{'O(n)'}</InlineMath>.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L15 — Δυναμικός Προγραμματισμός II (Σακίδιο & LCS)
   * ─────────────────────────────────────────────────────────────────── */
  'pt2-th1-q8': {
    takeaway: (
      <>
        Όταν ο αλγόριθμος έχει <em>ακριβή</em> πολυπλοκότητα{' '}
        <InlineMath>{'\\Theta(mn)'}</InlineMath> (LCS), η ερώτηση «ποια
        φράγματα ορθά;» γίνεται μηχανική: <InlineMath>{'O(f)'}</InlineMath>{' '}
        σωστό αν <InlineMath>{'mn = O(f)'}</InlineMath>·{' '}
        <InlineMath>{'\\Theta(f)'}</InlineMath> σωστό μόνο αν είναι{' '}
        <em>ακριβώς</em> ίδιας τάξης. Παγίδα-κλειδί: το{' '}
        <InlineMath>{'\\Theta(mn \\log n)'}</InlineMath> είναι «σχεδόν σωστό»
        αλλά πέφτει — το <InlineMath>{'\\Theta'}</InlineMath> έχει διπλή
        πόρτα, και ο αλγόριθμος δεν παίρνει λογαριθμικό παράγοντα.
      </>
    ),
    examRadar: (
      <>
        Αν η εκφώνηση ζητάει «ποια ορθά φράγματα», βγάλε πρώτα την{' '}
        <em>πραγματική</em> πολυπλοκότητα του αλγορίθμου (συνήθως{' '}
        <InlineMath>{'\\Theta(mn)'}</InlineMath> ή{' '}
        <InlineMath>{'\\Theta(n)'}</InlineMath>). Μετά πέρασε τα φράγματα ένα-ένα
        — με ιδιαίτερη προσοχή στα{' '}
        <InlineMath>{'\\Theta'}</InlineMath>: ένα{' '}
        <InlineMath>{'\\Theta(\\text{σχεδόν σωστό})'}</InlineMath> είναι σταθερή
        παγίδα.
      </>
    ),
  },
  'pt2-th3': {
    takeaway: (
      <>
        Η <strong>συντομότερη κοινή υπερακολουθία</strong> είναι η{' '}
        «δυϊκή» της LCS: ίδιος πίνακας <InlineMath>{'(i, j)'}</InlineMath>{' '}
        πάνω σε προθέματα, αλλά <InlineMath>{'\\min + 1'}</InlineMath> αντί
        για <InlineMath>{'\\max'}</InlineMath>· κάθε ταίριασμα ξοδεύει ΕΝΑ
        γράμμα αντί για κανένα. Ισχύει η ταυτότητα{' '}
        <InlineMath>{'|SCS| + |LCS| = m + n'}</InlineMath> — όσα γράμματα
        μοιράζονται οι δύο σειρές, τόσα γλιτώνεις από το αφελές κόλλημα.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μικρότερη συμβολοσειρά που περιέχει και τις δύο ως
        υπακολουθίες» (όνομα σκύλου, merge συνεκδοχών, common supersequence).
        Στρώσε αναδρομή{' '}
        <InlineMath>{'\\text{OPT}(i,j) = 1 + \\min\\{\\text{OPT}(i-1,j), \\text{OPT}(i,j-1)\\}'}</InlineMath>{' '}
        για διαφορετικά γράμματα και{' '}
        <InlineMath>{'1 + \\text{OPT}(i-1,j-1)'}</InlineMath> για ίδια. Δείξε
        τον πίνακα <InlineMath>{'\\Theta(mn)'}</InlineMath> και ανέκτησε την
        υπερακολουθία με πέρασμα προς τα πίσω που <em>εκπέμπει</em>{' '}
        χαρακτήρες σε κάθε βήμα.
      </>
    ),
  },
  'pt4-th4': {
    takeaway: (
      <>
        Το «διαφημίσεις χορηγών με συνολικό χρόνο{' '}
        <InlineMath>{'T'}</InlineMath>» είναι αυτούσιο 0-1 Σακίδιο. Με
        σταθερές <em>θυρίδες</em> γίνεται weighted interval scheduling — δύο
        διαφορετικές πολυπλοκότητες: <InlineMath>{'\\Theta(nT)'}</InlineMath>{' '}
        ψευδοπολυωνυμικό vs <InlineMath>{'O(n \\log n)'}</InlineMath> γνήσια
        πολυωνυμικό. Ο διακόπτης που τα ξεχωρίζει: αν υπάρχει{' '}
        <em>σταθερή στιγμή έναρξης</em> για κάθε διαφήμιση, είσαι στο WIS·
        αν είναι μόνο διάρκεια, στο Σακίδιο.
      </>
    ),
    examRadar: (
      <>
        Όποτε δεις «επίλεξε υποσύνολο από {`{`}αντικείμενα/projects/διαφημίσεις
        {`}`} με {`{`}βάρος/διάρκεια/χώρο{`}`} και {`{`}αξία/κέρδος{`}`}», ψάξε
        αν υπάρχει χρονικός περιορισμός θέσης. Δεν υπάρχει → Σακίδιο{' '}
        <InlineMath>{'\\Theta(nT)'}</InlineMath>. Υπάρχει → WIS{' '}
        <InlineMath>{'O(n \\log n)'}</InlineMath>. Στο πρώτο, μην ξεχνάς να
        ανακτάς ποια αντικείμενα με ένα backward pass{' '}
        <InlineMath>{'O(n)'}</InlineMath>.
      </>
    ),
  },
  'pt7-th3': {
    takeaway: (
      <>
        Σε αυτό το στιγμιότυπο, ο άπληστος «λόγος αξίας/βάρους» τυχαίνει να
        βρει τη βέλτιστη λύση (23) — αλλά αυτό{' '}
        <strong>δεν είναι απόδειξη ορθότητας</strong>. Το 0-1 σακίδιο είναι
        NP-δύσκολο· γενικά ο άπληστος αποτυγχάνει (δες{' '}
        <strong>KnapsackGreedyFail</strong> με 4 αντικείμενα: άπληστος 7,
        βέλτιστο 10). Στο <em>κλασματικό</em> σακίδιο ο ίδιος άπληστος είναι
        αποδεδειγμένα βέλτιστος — η διαφορά είναι αν επιτρέπεται «κόψιμο»
        αντικειμένων.
      </>
    ),
    examRadar: (
      <>
        Αν σε ρωτούν «τρέξε άπληστο + DP» πάνω σε ένα στιγμιότυπο, η σύμπτωση
        στις τιμές <em>δεν</em> αρκεί για να ισχυριστείς ότι ο άπληστος είναι
        γενικά βέλτιστος. Η απάντηση «μπορεί ο άπληστος να είναι πάντα
        βέλτιστος και πολυωνυμικός;» είναι σταθερά <strong>όχι</strong> —
        αναφέρσου σε <InlineMath>{'P \\ne NP'}</InlineMath> και δώσε ένα
        αντιπαράδειγμα (όχι το πρόσφατο στιγμιότυπο).
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L17 — Δυναμικός Προγραμματισμός IV (DP σε δέντρα & Bellman-Ford)
   * ─────────────────────────────────────────────────────────────────── */
  'pt1-th2-a': {
    takeaway: (
      <>
        Για ανίχνευση αρνητικού κύκλου, τρέχουμε{' '}
        <strong>Bellman-Ford</strong> με <InlineMath>{'n'}</InlineMath> (όχι{' '}
        <InlineMath>{'n - 1'}</InlineMath>) γύρους. Χωρίς αρνητικό κύκλο, η
        γραμμή <InlineMath>{'M[n - 1, \\cdot]'}</InlineMath> έχει ήδη συγκλίνει,
        οπότε η <InlineMath>{'M[n, \\cdot]'}</InlineMath> είναι πανομοιότυπη. Αν
        στη γραμμή <InlineMath>{'M[n, \\cdot]'}</InlineMath> κάτι αλλάξει, μια
        κορυφή «γλιστράει» μέσα σε κύκλο που μειώνει κόστος — αρνητικός κύκλος.
        Πολυπλοκότητα <InlineMath>{'\\Theta(mn)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «αποφάσισε αν υπάρχει αρνητικός κύκλος», «βρες μονοπάτι όταν τα
        βάρη μπορεί να είναι αρνητικά» — αντανακλαστικά Bellman-Ford. Παγίδα να
        αποφύγεις: η ερώτηση «ποιον αλγόριθμο;» θέλει 2-3 γραμμές γιατί ο
        Dijkstra ΔΕΝ δουλεύει (χρειάζεται θετικά βάρη, κλειδώνει κορυφές
        αμετάκλητα — δες <a href="#exercise:pt4-th1-q3" className="underline">pt4-th1-q3</a>).
        Συστηματική δομή απάντησης: «Bellman-Ford + έξτρα γύρος + ελέγχω αν κάτι
        άλλαξε».
      </>
    ),
  },
  'pt4-th1-q3': {
    takeaway: (
      <>
        Ο Bellman-Ford είναι <strong>DP</strong>, όχι άπληστος. Διαγνωστικό σε
        μία λέξη: <em>κλείδωμα</em>. Άπληστος = «μία αμετάκλητη απόφαση το
        βήμα» (Dijkstra εξάγει + κλειδώνει). DP = «μία γραμμή πίνακα τη φορά,
        διαβάζοντας ξανά την προηγούμενη» (Bellman-Ford σαρώνει όλες τις
        κορυφές κάθε γύρο, χωρίς δεσμεύσεις). Αυτή η διαφορά είναι που του
        επιτρέπει να δουλεύει με αρνητικά βάρη — και να ανιχνεύει αρνητικούς
        κύκλους.
      </>
    ),
    examRadar: (
      <>
        Σήμα: Σ/Λ «είναι X άπληστος;». Πριν απαντήσεις, ρώτησε: «κλειδώνει
        αμετάκλητα μια οντότητα κάθε βήμα, ή ξαναγράφει πίνακα από προηγούμενη
        γραμμή/υποπρόβλημα;» Άπληστοι: Dijkstra, Kruskal, Prim, Huffman,
        interval scheduling. DP: Bellman-Ford, knapsack, LCS, weighted interval
        scheduling, ανεξάρτητο σύνολο σε δέντρο. Δευτερευόντως μετράς και
        πολυπλοκότητα — <InlineMath>{'\\Theta(mn)'}</InlineMath> για τον BF
        είναι «μέγεθος πίνακα», άρα DP.
      </>
    ),
  },
  'front-set-8-ask1': {
    takeaway: (
      <>
        Όταν θες <strong>μέσο όρο</strong> πάνω σε όλα τα μονοπάτια (ή όλες τις
        λύσεις) ενός DAG, υπολόγισε <em>άθροισμα</em> και <em>πλήθος</em>{' '}
        ΤΑΥΤΟΧΡΟΝΑ με δύο παράλληλες αναδρομές που γεμίζουν σε λοκ-στεπ:{' '}
        <InlineMath>{'count[x] = \\sum count[y]'}</InlineMath>,{' '}
        <InlineMath>{'sum[x] = \\sum (count[y]\\cdot w(x,y) + sum[y])'}</InlineMath>,
        βάσεις <InlineMath>{'count[t]=1, sum[t]=0'}</InlineMath>. Σειρά:
        αντίστροφη τοπολογική. Απάντηση:{' '}
        <InlineMath>{'sum[s] / count[s]'}</InlineMath>. Συνολικά{' '}
        <InlineMath>{'\\Theta(V + E)'}</InlineMath>.
      </>
    ),
    examRadar: (
      <>
        Σήμα: «μέσο κόστος όλων των {`{`}μονοπατιών/υπακολουθιών/λύσεων{`}`}»,
        ή «πλήθος βέλτιστων λύσεων» ή «αναμενόμενη τιμή τυχαίας πορείας σε
        DAG». Συνταγή: εντόπισε την «μονή» αναδρομή (συνήθως άθροισμα ή
        πλήθος), και χτίσε τη δεύτερη που «τρέχει δίπλα» της. Παγίδα: το{' '}
        <InlineMath>{'sum[x]'}</InlineMath> πρέπει να πολλαπλασιάζει το βάρος{' '}
        <InlineMath>{'w(x,y)'}</InlineMath> με το <InlineMath>{'count[y]'}</InlineMath>{' '}
        (όχι 1!) — γιατί η ίδια ακμή πληρώνεται μία φορά για κάθε μονοπάτι που
        περνά από εκεί.
      </>
    ),
  },

  /* ─────────────────────────────────────────────────────────────────────
   * L16 — Δυναμικός Προγραμματισμός III (Ευθυγράμμιση συμβολοσειρών)
   * ─────────────────────────────────────────────────────────────────── */
  'front-set-8-ask2': {
    takeaway: (
      <>
        Ευθυγράμμιση συμβολοσειρών με σκορ <InlineMath>{'+1/-1/-2'}</InlineMath>{' '}
        είναι η <strong>ίδια</strong> DP με τη διάλεξη, αλλά με δύο
        αναποδογυρίσματα ταυτόχρονα: <InlineMath>{'\\min \\to \\max'}</InlineMath>{' '}
        και τα κόστη <em>θετικά</em> γίνονται σκορ <em>αρνητικά</em> για
        ποινές, <em>θετικά</em> για επιβραβεύσεις. Ο σκελετός (τρεις
        υποψήφιοι, βάση γραμμή 0 = πολλαπλάσιο του gap) είναι ίδιος. Στο
        στιγμιότυπο <InlineMath>{'x = \\text{ATGGCA}, y = \\text{TCTATGG}'}</InlineMath>{' '}
        η βέλτιστη τιμή είναι <InlineMath>{'M[7][6] = -6'}</InlineMath>, με
        ταιριάσματα να «κουμπώνουν» στο κοινό κομμάτι ATGG — που τυχαίνει να
        είναι και η μέγιστη κοινή υπακολουθία (LCS).
      </>
    ),
    examRadar: (
      <>
        Σήμα: «ευθυγραμμίστε δύο συμβολοσειρές / DNA / κειμένων / λέξεις με
        σκορ X για ταύτιση, Y για διαφορά, Z για κενό» όπου τα{' '}
        <InlineMath>{'Y, Z'}</InlineMath> είναι αρνητικά. Αυτόματη
        μετάφραση: αναδρομή{' '}
        <InlineMath>{'M[i,j] = \\max\\{\\sigma + M[i-1,j-1], \\text{gap} + M[i-1,j], \\text{gap} + M[i,j-1]\\}'}</InlineMath>·
        βάση <InlineMath>{'M[i,0] = i\\cdot\\text{gap}'}</InlineMath>· βελάκια
        στον γείτονα που <em>μεγιστοποίησε</em>. Παγίδα: μην αντιγράψεις τυφλά
        την min-εκδοχή — άλλαξε ταυτόχρονα τελεστή και πρόσημα. Έλεγξε
        ποιοτικά: αν το optimum βγαίνει αρνητικό αλλά οι συμβολοσειρές
        ταιριάζουν στο μισό, μάλλον έβαλες κάπου μείον αντί συν.
      </>
    ),
  },
}
