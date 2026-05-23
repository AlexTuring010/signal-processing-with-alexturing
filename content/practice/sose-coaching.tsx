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
}
