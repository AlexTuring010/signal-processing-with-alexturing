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
}
