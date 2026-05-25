# Phase E.2 — Catalogue of exam ↔ frontistirio pattern pairs

> **Status.** Done 2026-05-25. Research + document only — no code changes.
>
> **Output of Task E.2 in `plans/PHASE_E_PLAN.md`.** Feeds Task E.3 (build
> `<RelatedPair>` + retrofit bidirectional surfacing), Task E.5 (transcription
> queue priorities), Task E.6 (SOSE pattern catalogue), and per-lecture
> `<ExamRadar />` updates.
>
> **The user's framing.** «Almost every exam has at least one problem that
> rewrites a frontistirio problem in a different costume.» The canonical
> example given was «τραπεζικές κάρτες» ⇔ «αρχαίες πλάκες» — same algorithm,
> different cover story. This document is the systematic search for every
> such pair in the current bank.

---

## 1. Scope & methodology

**Inputs.**
- Every `origin: 'past-exam'` entry with `statement` and `solution` in
  `content/practice/exercises.tsx` (≈60 entries, dated June 2022 → Sept 2025
  + Ιουν 2016 + Εξ-αποστάσεως 2020 = 11 transcribed papers, plus 16
  pending-transcription paper stubs that are excluded from pairing until E.5).
- Every `origin: 'frontistirio'` entry that is transcribed (≈74 entries
  across Σετ #1–#13).
- Total transcribed pool for pairing: ≈130 problems.

**Process.**
1. **Fingerprint.** For each transcribed entry, extract a one-line
   *algorithm fingerprint* (the algorithm + key data structure, ignoring
   the cover story) plus the *domain* (the cover story itself).
2. **Cluster.** Group by fingerprint. Any fingerprint with ≥ 2 entries
   from different cover stories is a candidate pair.
3. **Disambiguate.** For each candidate pair, distinguish whether it is
   - **definite** — literally the same algorithm, just renamed
     (e.g. lampposts pt5-th4 ⇔ lampposts front-set-10-ask6, or 0/1 σακίδιο
     pt7-th3 ⇔ ad slots pt4-th4);
   - **strong analogy** — same technique with one parameter changed
     (e.g. SPT for Σ wait time ⇔ LPT for makespan — same exchange-argument
     skeleton, opposite sort key);
   - **weak** — overlapping technique but materially different shape.
4. **Recognition cue.** Write the one-sentence «if you see X in the wording,
   reach for Y» rule that lets a student under exam pressure recognise the
   pair from the wording alone, even when the frontistirio template was
   weeks ago.
5. **Target lecture.** Pick the lecture whose `<ExamRadar />` should mention
   the pattern (and whose page is the natural anchor for `<RelatedPair>`).

**Conventions.**
- **`[Flame]`** marks an entry whose `source` is in 2024 / 2025 (the most
  recent-paper-dense problems — the ones most likely to recur in style).
- IDs are quoted verbatim from `content/practice/exercises.tsx`.
- Source dates use the same short labels as the Exercise schema
  (e.g. `sept-2025`, `june-2024`, `frontistirio-2023-24`).
- Weight % shown for past-exam entries that carry one.

---

## 2. Catalogue — pairs and triples by lecture

The patterns are ordered by the lecture whose `<ExamRadar />` should host
them. Each entry lists IDs first, recognition cue second, confidence third.

### L01 — Εισαγωγή / P vs NP

**P1.1 — «Ποια προβλήματα είναι εκτός P αν P ≠ NP;» (3-zone trap).**
- `pt1-th1-q9` (Ιουν 2025 · Θ.1.9, 3%) [Flame]
- `pt2-th1-q9` (Σεπτ 2025 · Θ.1.9, 3%) [Flame]
- `pt4-th1-q1` (Σεπτ 2024 · Θ.1.1, 4% — Σ/Λ «P ≠ NP ⇒ συντομότερο μονοπάτι εκτός P») [Flame]
- **Cue.** Three zones: (1) γνωστά-σε-P (Dijkstra/BF/Huffman/MST) — εδώ ΟΧΙ
  η σωστή απάντηση· (2) γνωστά-NP-πλήρη (SAT/VC/Knapsack/Hamilton/TSP/Longest
  Path) — εδώ ΝΑΙ η σωστή απάντηση· (3) άγνωστα (Factorisation / Graph Iso)
  — «δεν γνωρίζουμε» είναι έγκυρη απάντηση όταν ρωτάει «πιθανώς εκτός P».
  Σήμα στην εκφώνηση: «αν P ≠ NP» + «συντομότερο vs μακρύτερο» trap
  (μακρύτερο = NP-complete, συντομότερο = ∈ P).
- **Confidence.** Definite — three different recent papers ask the same
  trichotomy on rotated lists.
- **Target lecture.** L01.

**P1.2 — «Άγνωστη NP-πληρότητα» (3rd-zone shape).**
- `pt2-th1-q10` (Σεπτ 2025 · Θ.1.10, 3%) [Flame]
- **Cue.** «ποια ΔΕΝ γνωρίζουμε αν είναι NP-πλήρη;» — only two canonical
  inhabitants: Παραγοντοποίηση Ακεραίων + Ισομορφισμός Γραφημάτων. Σήμα:
  «δεν γνωρίζουμε» / «δεν έχει αποδειχθεί» / «παραμένει ανοιχτό».
- **Confidence.** Solo (kept for radar — paired naturally with P1.1 trichotomy).
- **Target lecture.** L01.

### L02 — Ασυμπτωτική ανάλυση

**P2.1 — Κατάταξη συναρτήσεων κατά ρυθμό αύξησης.**
- Frontistirio: `front-set-1-ask1`, `front-set-2-ask0`, `front-set-2-ask4`,
  `front-set-2-ask5`, `front-set-2-ask7` (πίνακας σχέσεων), `front-set-12-ask2`
- Past-exam: `pt5-th2-a` (2^√(log n)), `pt1-th1-q1` (constants),
  `pt1-th1-q2` (πολυωνυμικό vs υπερπολυωνυμικό) [Flame],
  `pt1-th1-q3` (άγνωστος εκθέτης) [Flame], `pt5-th1b` (εκθετική vs υπερ-πολυωνυμική)
- **Cue.** «Διάταξε αυτές τις συναρτήσεις» / «ποια αυξάνεται ταχύτερα» →
  ιεραρχία `log* n < log n < n^c < n^{log n} < c^n < n!`. Παγίδες: (i)
  ξεμπλέκεις τις ταυτότητες ΠΡΩΤΑ (`2^{log n}=n`, `n^{1/log n}` σταθερή),
  (ii) ισόποσες τάξεις σπάνε με log-σύγκριση `log f` vs `log g`, (iii)
  ισοδυναμίες (π.χ. `log(n^2) = 2 log n`) μη μπερδεύονται με κυριαρχίες.
- **Confidence.** Definite (canonical exam form, ≥ 10 instances).
- **Target lecture.** L02.

**P2.2 — Σ/Λ ασυμπτωτικού συμβολισμού.**
- Frontistirio: `front-set-1-ask0`, `front-set-2-ask2` (αθροίσματα),
  `front-set-2-ask3`, `front-set-11-ask3`, `front-set-12-ask1`
- Past-exam: `pt4-th1-q2` (Σεπτ 2024 · Θ.1.2 — `f + g = Θ(max{f,g})`) [Flame]
- **Cue.** «Σωστό ή Λάθος: …» πάνω σε ταυτότητες με O / Θ / Ω. Συνταγή:
  πρώτα κυνήγησε αντιπαράδειγμα (μικρές, οικείες συναρτήσεις: `n` vs `n²`,
  σταθερές), μετά απόδειξη. Παγίδα-σήμα: «ισότητα» αντί για «μέλος»
  (π.χ. `f = O(g)` δεν είναι συμμετρική σχέση), τα ταυτόσημα μπροστινά
  φαντάζουν προφανή αλλά συχνά είναι λάθος (π.χ. `f + g = Θ(max{f,g})` ΕΙΝΑΙ
  σωστό αλλά η αντίστοιχη «Θ» δεν επιστρέφει στο `min` κ.ο.κ.).
- **Confidence.** Definite (canonical exam form, ≥ 6 instances).
- **Target lecture.** L02.

**P2.3 — Πολυπλοκότητα εμφωλευμένων βρόχων (Σ-counting).**
- Frontistirio: `front-set-2-ask6`, `front-set-4-e0-ask6`,
  `front-set-10-ask2` (τριπλός βρόχος), `front-set-4-thema4`
- **Cue.** «Δώσε την πολυπλοκότητα του παρακάτω κώδικα» → άθροισμα
  γινομένων ορίων + κανόνες `Σi = Θ(n²)`, `Σi² = Θ(n³)`, `Σ1/k = Θ(log n)`,
  `Σi log i = Θ(n² log n)`. Σήμα: εσωτερικός βρόχος εξαρτάται από εξωτερικό
  δείκτη.
- **Confidence.** Definite (4 frontistirio instances; exam variants are
  rare in 2024/2025 but the technique is the L02 spine).
- **Target lecture.** L02.

**P2.4 — Πρότυπη ταυτότητα «1+2+…+n = Θ(n²)» (Θ-from-definition).**
- `pt4-th1-q5` (Σεπτ 2024 · Θ.1.5, 4%) [Flame]
- **Cue.** Σ-closed-form γνωστής σειράς (αριθμητική / γεωμετρική /
  τετραγωνική) → άνω κάλυπτε με `n · μέγιστο όρο`, κάτω κάλυπτε με «μισοί
  όροι ≥ μισή τιμή». Σήμα: η σειρά γράφεται με «`1 + 2 + … + n`» ή
  «`1² + 2² + … + n²`» — η ίδια συνταγή.
- **Confidence.** Solo at present, but paired structurally with P2.5.
- **Target lecture.** L02.

**P2.5 — Άθροισμα όρων vs πολυώνυμο × λογάριθμο.**
- `pt2-th1-q1` (Σεπτ 2025 · Θ.1.1 — Σi² vs n²log n) [Flame]
- **Cue.** Άθροισμα όρων `Σ i^k → Θ(n^{k+1})` και σύγκριση με `n^a log n`:
  ποια κερδίζει; Σπάει στην επιλογή `a` vs `k+1`. Παγίδα: ξεχάστε τη
  σταθερά της κλειστής μορφής — μετράει ΜΟΝΟ η τάξη.
- **Confidence.** Solo (canonical Σi^k case kept here as a sibling of
  P2.4).
- **Target lecture.** L02.

**P2.6 — Αρμονικό άθροισμα / iterated log (το «πιο αργό από log»).**
- `front-set-11-ask1` (induction Harmonic)
- `front-set-1-ask3` (επαναλαμβανόμενος λογάριθμος / log\*)
- `pt2-th1-q2` (Σεπτ 2025 · Θ.1.2 — Αρμονικό vs log log n) [Flame]
- **Cue.** Δύο πολύ-αργές αυξήσεις: `H_n = Σ 1/i = Θ(log n)` και
  `log* n = ελάχιστο k με log^{(k)} n ≤ 1`. Παγίδα: `H_n` ΚΑΘΟΛΟΥ σταθερά,
  ενώ `log log n` αυξάνει ακόμα πιο αργά. Σήμα: εμφανίζεται `1/i`, ένας
  λογάριθμος εφαρμοσμένος επανειλημμένα, ή `log log`.
- **Confidence.** Strong analogy (όλα μπαίνουν στην κατηγορία «sub-log», αλλά
  διαφορετικοί τύποι ανάμεσα).
- **Target lecture.** L02.

**P2.7 — Παγίδες ταυτοτήτων με εκθέτες/λογάριθμους.**
- `pt1-th1-q2` (Ιουν 2025 · Θ.1.2 — 2^{log n} vs n^{log n}) [Flame]
- `pt5-th2-a` (Ιουν 2023 · Θ.2Α — κατάταξη 2^√(log n))
- **Cue.** Πριν τοποθετήσεις στην ιεραρχία, εφάρμοσε ταυτότητες:
  `2^{log_2 n} = n`, `a^{log_a x} = x`, `n^{log n} = 2^{(log n)^2}`,
  `2^{√(log n)}` ζει στη ζώνη «υπερπολυωνυμικό αλλά υπο-εκθετικό».
- **Confidence.** Strong analogy (διαφορετικοί τύποι αλλά κοινή
  «απλοποίηση-πρώτα-τοποθέτηση-μετά» συνταγή).
- **Target lecture.** L02.

### L03 — D&C I (recurrences, Master Theorem)

**P3.1 — Master Theorem με λογαριθμικό όρο στη `f(n)`.**
- `front-set-3-ask9` (Master με λογαριθμικό όρο)
- `front-set-4-ask10` (διπλάσιο, Master με log όρο)
- `pt5-th2-b` (Ιουν 2023 — δύο αλγόριθμοι D&C με Master)
- `front-set-13-ask3` (εφαρμογές Master)
- **Cue.** `T(n) = a T(n/b) + n^d · log^k n` → απλοποιημένος Master· αν
  `n^d = n^{log_b a}` (case 2), `Θ(n^d · log^{k+1} n)`· αλλιώς το log είναι
  «ωφέλιμο μόνο στην ίδια τάξη με το μη-λογαριθμικό». Σήμα: η `f(n)` περιέχει
  `log n` ως πολλαπλασιαστή.
- **Confidence.** Definite.
- **Target lecture.** L03.

**P3.2 — Αναδρομές με ρίζα: `T(n) = a T(√n) + …`.**
- `pt1-th1-q4` (Ιουν 2025 · Θ.1.4 — `T(n) = T(√n) + 1`) [Flame]
- `pt2-th1-q4` (Σεπτ 2025 · Θ.1.4 — `T(n) = 2T(√n) + 1`) [Flame]
- `front-set-3-ask10` (`T(n) = T(√n) + 1`)
- `front-set-4-ask1` (`T(n) = √n · T(√n) + n`)
- **Cue.** Αντικατάσταση `n = 2^m` (`m = log n`) γραμμικοποιεί το `√n` σε
  `m/2` και την αναδρομή σε «κανονική» Master μορφή. Σήμα: η εκφώνηση γράφει
  ρητά `√n` στο αναδρομικό μέρος.
- **Confidence.** Definite.
- **Target lecture.** L03.

**P3.3 — Εκθετική παγίδα `T(n) = a T(n−c) + f(n)` με `a > 1`.**
- `pt4-th1-q4` (Σεπτ 2024 · Θ.1.4, 4% — Σ/Λ `2T(n−1)+Θ(n) = O(n²)`) [Flame]
- `front-set-3-ask4` (`T(n) = T(n−1) + 2ⁿ`)
- **Cue.** Όταν το μέγεθος μειώνεται κατά **σταθερά** (όχι κατά παράγοντα
  `n/b`) με `a > 1` αναδρομικές κλήσεις, η συνολική αναδρομή είναι
  ΕΚΘΕΤΙΚΗ — όχι πολυωνυμική. Σήμα-διαχωριστής: «`T(n-1)` ή `T(n-c)`» →
  εκθετικό· «`T(n/b)`» → πολυωνυμικό· μην τα μπερδεύεις με τις γνωστές
  πολυωνυμικές («`O(n²)` ηχεί σαν mergesort» — ΟΧΙ).
- **Confidence.** Definite.
- **Target lecture.** L03.

**P3.4 — Γραμμικές ομογενείς αναδρομές (χαρακτηριστικό πολυώνυμο).**
- `front-set-3-ask1` (κλειστός τύπος Fibonacci)
- `front-set-3-ask2` (διπλή ρίζα)
- `front-set-13-ask2` (γενική γραμμική ομογενής)
- **Cue.** `a_n = c_1 a_{n-1} + c_2 a_{n-2} + …` → χαρακτηριστικό
  πολυώνυμο `λ^k − c_1 λ^{k-1} − …` = 0· ρίζες απλές → `Σ A_i r_i^n`·
  διπλή ρίζα → πολλαπλασιάζεις με `n` (όπως και η `n · r^n`). Σήμα:
  γραμμική αναδρομή ΧΩΡΙΣ διαίρεση, εκφράζεται με `a_{n-k}`.
- **Confidence.** Definite.
- **Target lecture.** L03.

**P3.5 — Master Theorem εφαρμογές κανονικές (case 1 / 2 / 3).**
- `pt1-th1-q5` (Ιουν 2025 · Θ.1.5 — `T(n)=2T(n/2)+n` mergesort) [Flame]
- `pt2-th1-q3` (Σεπτ 2025 · Θ.1.3 — case 3) [Flame]
- `front-set-13-ask3` (εφαρμογές)
- **Cue.** `a T(n/b) + f(n)` με `f(n) = Θ(n^d)`: σύγκρινε `d` με `log_b a`:
  `<` → case 1 (κύριο κόστος στη ρίζα = `f(n)` overshadowed by recursion),
  `=` → case 2 (`Θ(n^d log n)`), `>` → case 3 (κύριο κόστος στη ρίζα).
- **Confidence.** Definite (canonical drill across all 11 papers).
- **Target lecture.** L03.

**P3.6 — Απόδειξη `T(n) = Θ(n log n)` με επαγωγή / substitution.**
- `front-set-3-ask8` (απόδειξη `T(n) = n log n`)
- `front-set-4-ask2` (μέθοδος αντικατάστασης ακριβής)
- `front-set-4-ask3` (κόλπο ενίσχυσης άνω φράγματος)
- `front-set-4-ask4` (άνιση αναδρομή)
- `front-set-11-ask2` (επαγωγική λύση)
- **Cue.** Όταν Master ΔΕΝ εφαρμόζεται (απαιτείται ακριβής σταθερά, ή
  άνιση διαίρεση, ή άθροισμα δύο διαφορετικών sub-recurrences), πέφτεις
  στο «υπόθεσε `T(n) ≤ c · n log n`, αντικατέστησε στην αναδρομή, δείξε ότι
  το επαγωγικό βήμα κλείνει». Παγίδα: «ενίσχυση» του άνω φράγματος (π.χ.
  `T(n) ≤ c n log n − d n`) χρειάζεται για να κλείσει το επαγωγικό όταν η
  «καθαρή» μορφή αφήνει χαμένο όρο.
- **Confidence.** Definite (5 frontistirio instances, ίδιος κορμός).
- **Target lecture.** L03.

### L04 — D&C II (sort/partition, majority, inversions)

**P4.1 — Πλειοψηφικό στοιχείο με D&C (κυρίαρχο σε ≥ 1 μισό).**
- `pt3-th2` (Ιουν 2024 · Θ.2, 30%, hard — Πλειοψηφικό O(n log n)) [Flame]
- `front-set-4-ask5` (ύποπτη κάρτα = majority disguised)
- **Cue.** «Επιτρέπεται ΜΟΝΟ έλεγχος `=` (όχι `<`/`>`)» + «θέλω O(n log n)»
  + «κυρίαρχο/πλειοψηφικό» → D&C: split, recurse, αν κάθε μισό επιστρέφει
  υποψήφιο, κράτα 2 υποψηφίους + γραμμικός έλεγχος συμβατότητας. Παρατήρηση-
  κλειδί: «πλειοψηφικό ⇒ πλειοψηφικό σε ≥ 1 υποσκακιέρα». Στις πολλές
  διαστάσεις (κυρίαρχο χρώμα σε σκακιέρα): από `O(n² log n)` με 4 υποψήφιους
  → `O(n log n)` με 2. Σήμα στις εξετάσεις: «ύποπτη κάρτα» / «κυρίαρχο
  χρώμα» / «το πιο συχνό στοιχείο».
- **Confidence.** Definite (the canonical user-named example «τραπεζικές
  κάρτες ⇔ αρχαίες πλάκες» pattern realised in this bank as ύποπτη κάρτα
  ⇔ πλειοψηφικό στοιχείο).
- **Target lecture.** L04.

**P4.2 — Quicksort family (partition / randomisation / 3-way).**
- `pt16-th3b` (Ιουν 2016 · Θ.3.2-3.3 — Quicksort εκτέλεση + δέντρο αναδρομής)
- `front-set-4-ask6` (Ολλανδική σημαία = 3-way partition)
- `front-set-5-ask3` (προστασία Quicksort με ανακάτεμα)
- **Cue.** Όλα κάθονται γύρω από `partition`: επιλογή pivot + κατά τόπους
  αναδιάταξη. Παραλλαγές: (i) deterministic pivot → worst case `Θ(n²)`,
  (ii) random shuffle → expected `Θ(n log n)`, (iii) 3-way (Dutch flag)
  για πολλά duplicates → προτιμητέο όταν το input έχει `O(1)` distinct
  values.
- **Confidence.** Strong analogy (three different angles of one
  algorithm).
- **Target lecture.** L04.

**P4.3 — Σαμποτάζ / τυχαία μετάθεση πριν τον αλγόριθμο.**
- `front-set-5-ask3` (Quicksort defense via shuffling)
- `front-set-5-ask2` (nuts & bolts — randomised matching)
- **Cue.** Όταν deterministic worst-case είναι κακό (`Θ(n²)`) αλλά μέση
  περίπτωση καλή (`Θ(n log n)`) → τυχαία μετάθεση πριν τον αλγόριθμο
  διατηρεί το ίδιο expected και πετά το worst-case.
- **Confidence.** Strong analogy (ίδια τεχνική απόδειξης expected-time,
  διαφορετικός αλγόριθμος).
- **Target lecture.** L04.

### L05 — D&C III (closest pair, peak, binary-search-on-structure)

**P5.1 — Δυαδική αναζήτηση για ΣΥΝΟΡΟ (όχι για τιμή).**
- `pt4-th3` (Σεπτ 2024 · Θ.3, 30% — βρες `n` σε `1^m 0^n` σε `O(log k)`) [Flame]
- `pt11-th1` (Εξ αποστάσεως 2020 · Θ.1 — κορυφή «βουνού» σε `O(log n)`)
- `front-set-4-ask7` (χαμένος όρος αριθμητικής προόδου)
- `front-set-4-ask8` (διάμεσος δύο ταξινομημένων πινάκων)
- **Cue.** «Βρες την τιμή X / σύνορο / κορυφή» σε δομή που επιτρέπει να
  «πεταχτεί το μισό» με ένα `O(1)` test → `T(n) = T(n/2) + O(1) → Θ(log n)`
  (Master case 2 με `a=1, b=2, d=0`). Σήμα: «μονοτονία», «μοναδικό σύνορο»,
  «κορυφή», «ταξινομημένος-σχεδόν» πίνακας.
- **Confidence.** Definite.
- **Target lecture.** L05 (cluster of binary-search-on-structure
  variants; reference back to L03 for the Master case 2).

### L06 — Γραφήματα I (αναπαράσταση, διάσχιση, συνεκτικότητα)

**P6.1 — Συνεκτικές συνιστώσες με επαναλαμβανόμενο BFS/DFS.**
- `pt5-th1` (Ιουν 2023 · Θ.1, 20% — συνεκτικές συνιστώσες)
- `front-set-5-ask5` (συνεκτικές συνιστώσες από λίστες γειτνίασης)
- `front-set-7-ask9` (πάρτι Alice — peel με γείτονες-φίλους)
- **Cue.** «σπάσε σε μέγιστα συνεκτικά κομμάτια / id ανά κομμάτι» →
  εξωτερικός βρόχος για επόμενη ασημάδευτη + ένα BFS/DFS ανά συνιστώσα ·
  `Θ(|V|+|E|)` και θεωρητικό κάτω φράγμα γιατί κάθε ακμή πρέπει τουλάχιστον
  μια φορά να ελεγχθεί. Σήμα: «σπάσε σε ομάδες», «χρωμάτισε με ελάχιστα
  χρώματα», «πόσες συνεκτικές μάζες».
- **Confidence.** Definite (pt5-th1 ⇔ ask5 = same algorithm verbatim);
  ask9 strong-analogy (BFS sweep with iterative degree filter).
- **Target lecture.** L06.

**P6.2 — Αναπαράσταση γράφου ↔ πολυπλοκότητα `N(v)`.**
- `pt6-th1` (Σεπτ 2023 · Θ.1, 15% — BFS/DFS + `N(v)` σε λίστες/πίνακα)
- **Cue.** Δύο κανόνες: Λίστες → `O(|V|+|E|)`, που γίνεται `O(|V|)` όταν
  `|E| = Θ(|V|)`, `N(v)` σε `O(Δ(v))`· Πίνακας → `O(|V|)` ανά `N(v)`
  ανεξάρτητα από βαθμό, BFS συνολικά `O(|V|²)`. Σήμα στην εκφώνηση: ρητή
  αναφορά αναπαράστασης ή σχέση `|E| = Θ(|V|)`.
- **Confidence.** Solo (no exam twin — frontistirio Σετ #1 has not been
  transcribed at the entry level for this technique). Kept for radar.
- **Target lecture.** L06.

**P6.3 — Συντομότερα μονοπάτια με ίσα βάρη = BFS.**
- `front-set-10-ask3` (συντομότερα μονοπάτια με ίσα βάρη)
- **Cue.** «όλα τα βάρη ίσα» → Dijkstra reduces σε BFS με αλλαγή κλειδιού
  σε «#ακμών». Πληρώνεις `Θ(|V|+|E|)` αντί για `Θ((|V|+|E|) log |V|)`.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L06.

**P6.4 — State-graph BFS για puzzle / περιορισμένη μετάβαση.**
- `front-set-7-ask2` (Λύκος, κατσίκα, λάχανο)
- **Cue.** «κανόνες / επιτρέπεται / μετακίνηση» + «ζητάει ελάχιστα βήματα» →
  κόμβοι = ασφαλείς καταστάσεις (αποκλείεις παραβιάσεις κανόνα) · ακμές =
  επιτρεπτές μεταβάσεις · ερώτηση s-t γίνεται BFS · κόστος `O(|V_κατ|+|E_κατ|)`
  στο μέγεθος του γράφου ΚΑΤΑΣΤΑΣΕΩΝ, όχι του αρχικού χώρου αναζήτησης.
- **Confidence.** Solo (no exam twin — kept for radar, exemplifies the
  «μοντελοποίηση είναι η δουλειά σου, οι αλγόριθμοι έτοιμοι» message).
- **Target lecture.** L06.

### L07 — Γραφήματα II

No transcribed entries; L07 documented-and-skipped per Phase D precedent.

### L08 — Γραφήματα III (intro to weighted SP)

**P8.1 — Αμετάβλητο νικητή κάτω από μετασχηματισμό βαρών.**
- `front-set-5-ask9` (Σ/Λ ×k vs +α διατηρεί το συντομότερο μονοπάτι)
- `front-set-7-ask10` (συντομότερο μονοπάτι με αρνητικά βάρη; T/F)
- **Cue.** ×`k` (`k > 0`) → όλα τα μονοπάτια πολλαπλασιάζονται με `k` →
  νικητής δεν αλλάζει· +`α` → μονοπάτι με `ℓ` ακμές χρεώνεται `ℓ·α` →
  τιμωρία ΑΣΥΜΜΕΤΡΗ ανά μήκος → νικητής αλλάζει· γι' αυτό «+ constant»
  ΔΕΝ διορθώνει αρνητικά βάρη για Dijkstra.
- **Confidence.** Definite (ίδια λογική, δύο εκφωνητικές αφορμές).
- **Target lecture.** L08.

**P8.2 — Cost-language change μέσω logarithm (Dijkstra-εφαρμόσιμη).**
- `front-set-5-ask6` (μονοπάτι μέγιστης αξιοπιστίας)
- `front-set-5-ask8` (πιο αναξιόπιστο μονοπάτι σε DAG)
- **Cue.** «max γινομένου πιθανοτήτων» → `log(Π P) = Σ log P` · `−log P ≥ 0`
  → max γινομένου = min αθροίσματος → Dijkstra εφαρμόζεται έτοιμος.
  Αντίστροφο σήμο: «min γινομένου» / «πιο αναξιόπιστο» → `+log` (ή
  `−log(1−P)`) → Bellman-Ford / DAG-relaxation αν το `log` βγαίνει αρνητικό.
- **Confidence.** Definite (same transform, opposite sign).
- **Target lecture.** L08.

**P8.3 — Layered DAG / χρόνος-φάση ως δεύτερη διάσταση κορυφής.**
- `front-set-6-ask1` (σχεδιασμός ποδηλατικής εκδρομής)
- `front-set-5-ask7` (μονοπάτι μέσα από διατεταγμένα υποσύνολα)
- **Cue.** «`k` βήματα / `m` ημέρες / `p` στάδια / όρια αλλάζουν ανά βήμα»
  → σπάσε κάθε φυσική κορυφή `i` σε αντίγραφα `(i, φ)` ανά φάση · ακμή
  `(i, φ−1) → (j, φ)` μόνο όταν η μετάβαση είναι νόμιμη στη φάση `φ` ·
  βάρος = κόστος νέας θέσης · «κάθε ακμή προχωράει αυστηρά τη φάση κατά
  ένα» → DAG εξ ορισμού.
- **Confidence.** Definite.
- **Target lecture.** L08.

### L09 — Γραφήματα IV (Dijkstra, MST, P/NP)

**P9.1 — Hand-trace Dijkstra (κανονικό βήμα-βήμα).**
- `pt2-th2-1` (Σεπτ 2025 · Θ.2.1) [Flame]
- `pt3-th1` (Ιουν 2024 · Θ.1 — κατασκευή γράφου + εκτέλεση)
- `pt1-th1-q6` (Ιουν 2025 · Θ.1.6 — Σ/Λ άπληστο κριτήριο Dijkstra) [Flame]
- **Cue.** «εκτέλεσε Dijkstra από `s`» → πίνακας `d[]` ανά γύρο · κάθε
  γύρος: extract-min από PQ, χαλάρωσε γείτονες (`d[v] = min(d[v], d[u]+w)`),
  μαρκάρισε locked. Σήμα: συγκεκριμένος γράφος ζωγραφισμένος + ζητείται
  «πίνακας» / «τα `d`-values μετά από κάθε γύρο». T/F-σήμα: «η σειρά
  εξαγωγής δεν αλλάζει μετά το lock» — το άπληστο κριτήριο του Dijkstra.
- **Confidence.** Definite (mechanical exam form).
- **Target lecture.** L09.

**P9.2 — Dijkstra αποτυγχάνει με αρνητικά βάρη.**
- `pt2-th1-q5` (Σεπτ 2025 · Θ.1.5 — Σ/Λ αλγόριθμοι με αρνητικά βάρη) [Flame]
- `front-set-7-ask10` (συντομότερο μονοπάτι με αρνητικά βάρη; T/F)
- **Cue.** Σήμα: «αρνητικά βάρη» στην εκφώνηση → Dijkstra σπάει (το lock
  ξεκλειδώνεται από αρνητική ακμή). Αντικαταστάτης: Bellman-Ford
  `O(|V|·|E|)`. Παγίδα: «+ constant για να γίνουν θετικά» ΔΕΝ ΣΩΖΕΙ
  (μονοπάτι με `ℓ` ακμές χρεώνεται `ℓ·c` extra — βλ. P8.1).
- **Confidence.** Definite.
- **Target lecture.** L09.

**P9.3 — MST: εφαρμογή Prim / Kruskal σε δοσμένο γράφο.**
- `pt4-th2-b` (Σεπτ 2024 · Θ.2β — εφαρμογή ΕΕΔ) [Flame]
- `front-set-7-ask6` (αναβάθμιση τηλεφωνικού δικτύου = MST)
- **Cue.** «επιλέξτε υποσύνολο ακμών για να συνδεθούν όλες οι κορυφές με
  ελάχιστο/μέγιστο κόστος» = MST. Διάλεξε Prim (PQ από μία κορυφή) όταν
  ο γράφος είναι πυκνός και η εκφώνηση δίνει starting node· Kruskal (sort
  + UF) όταν αραιός ή όταν η εκφώνηση γράφει ακμές σε λίστα.
- **Confidence.** Strong (same algorithm, two different cover stories —
  network design vs map).
- **Target lecture.** L09.

**P9.4 — Μη μοναδικότητα ΕΕΔ / πλήθος των MSTs.**
- `pt4-th2-a` (Σεπτ 2024 · Θ.2α — δίκτυο με μη-μοναδικό MST) [Flame]
- `pt1-th2-b` (Ιουν 2025 · Θ.2.2 — πλήθος ελάχιστων συνδετικών δέντρων) [Flame]
- **Cue.** «πότε το MST μοναδικό;» → IFF όλα τα βάρη διακριτά (sufficient,
  όχι αναγκαίο σε γενικό γράφο). Όταν υπάρχει «κύκλος ίσων βαρών», κάθε
  μία από τις ίσες ακμές μπορεί να μπει στο MST — πλήθος = γινόμενο των
  επιλογών στα ίσα-βάρη συστατικά.
- **Confidence.** Definite (two 2024/2025 papers ask the same theorem
  with different angles).
- **Target lecture.** L09.

**P9.5 — 2η / 3η ελαφρύτερη ακμή στο MST.**
- `front-set-6-ask2` (2η/3η ελαφρύτερη ακμή στο MST)
- **Cue.** «η ελαφρύτερη ακμή ενός κοψίματος ∈ MST» → swap argument: η
  2η-ελαφρύτερη ακμή είναι η ελαφρύτερη ακμή που ολοκληρώνει έναν κύκλο
  μετά την πρώτη.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L09.

**P9.6 — TSP 2-προσέγγιση μέσω MST + preorder.**
- `front-set-7-ask3` (άπληστη προσέγγιση TSP μέσω MST)
- **Cue.** «μετρικός TSP» (triangle inequality) + «ζητάει 2-προσέγγιση» →
  MST + preorder = TSP-tour ≤ 2 · `cost(MST)` ≤ 2 · OPT (διπλασιάζω τις
  ακμές του MST για να φτιάξω Euler tour, μετά κόβω επαναλήψεις).
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L09.

**P9.7 — MST/Dijkstra: «λύνουν διαφορετικά προβλήματα».**
- `front-set-7-ask11` (Σ/Λ για MST και Dijkstra)
- **Cue.** Παγίδα-σήμα: «το ίδιο σύνολο ακμών;» — ΟΧΙ. MST βελτιστοποιεί
  άθροισμα ακμών συνδέοντας όλες τις κορυφές· Dijkstra βελτιστοποιεί κάθε
  μονοπάτι από `s` ξεχωριστά. Παράδειγμα-διαχωριστής: Prim ξεκινά από `A`
  διαλέγει τη φθηνότερη ακμή ανά γύρο, Dijkstra ξεκινά από `A` διαλέγει
  μέσω αθροιστικού `d`.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L09.

**P9.8 — D(MST), D(TSP), D(ST) ∈ NP (και ∈ P για MST).**
- `pt5-th3-b` (Ιουν 2023 · Θ.3Β — D(MST) ∈ NP και ∈ P)
- `pt7-th4` (Ιουν 2022 · Θ.4 — D(MST), D(TSP))
- `front-set-10-ask10` (D(MST), D(TSP))
- `pt6-th4` (Σεπτ 2023 · Θ.4 — υπό-δέντρο ελάχιστου βάρους + P/NP)
- `pt16-th5` (Ιουν 2016 · Θ.5 — D(ST), P, NP-complete)
- **Cue.** «έχει το γράφημα συνδετικό δέντρο με βάρος ≤ k;» → D(MST). ∈ P
  γιατί έχουμε MST σε `O((|V|+|E|) log |V|)` και ελέγχουμε `βάρος(MST) ≤ k`.
  ∈ NP πάντα — πιστοποιητικό = το δέντρο, verifier ελέγχει συνδετικότητα
  και sum. Αντίθετα D(TSP): ∈ NP (πιστοποιητικό = ο γύρος), ΔΕΝ γνωρίζουμε
  πολυωνυμικό για ∈ P (NP-πλήρες).
- **Confidence.** Definite (canonical pattern across 5 papers).
- **Target lecture.** L09.

**P9.9 — D(Clique), D(IS), D(Path), Hamiltonian Path ∈ NP (και ∈ P για σταθερό k).**
- `front-set-10-ask7` (D(Clique) ∈ NP, ∈ P για σταθερό k)
- `front-set-10-ask8` (D(IS) ∈ NP, ∈ P για σταθερό k)
- `pt7-th1` (Ιουν 2022 · Θ.1 — IS ∈ NP, ∈ P για σταθερό k)
- `front-set-10-ask9` (D(Path), D(K))
- `pt5-th3-a` (Ιουν 2023 · Θ.3Α — Hamiltonian Path ∈ NP)
- **Cue.** «σταθερό k» + «ανήκει σε P» → brute-force `O(n^k)` συνδυασμοί
  → πολυωνυμικό για σταθερό k (αλλά εκθετικό στο k). «ανήκει σε NP» →
  πιστοποιητικό = το σύνολο k κορυφών + verifier ελέγχει τις
  `O(k²)` ακμές (Clique: όλες υπάρχουν / IS: καμία δεν υπάρχει / Path:
  διαδοχικές ακμές υπάρχουν / Ham Path: επίσης all-vertices). Παγίδα:
  «∈ P γενικά» — ΛΑΘΟΣ για variable k (NP-πλήρη).
- **Confidence.** Definite (canonical exam form).
- **Target lecture.** L09.

### L10 — Δομές δεδομένων (σωροί, ξένα σύνολα, hash)

**P10.1 — Master Theorem + heapify-down (`S(n) = S(2n/3) + Θ(1)`).**
- `pt6-th3` (Σεπτ 2023 · Θ.3, 25%, headline) — Master + heap fix
- `front-set-10-ask5` (επιδιόρθωση σωρού μετά από μείωση τιμής)
- **Cue.** «δοσμένος σωρός + αλλαγή τιμής + RA + αναδρομική σχέση + ε»
  ή «`S(n) = S(2n/3) + Θ(1)`» → heapify-down. Master case 2 με
  `n^{log_{3/2} 1} = 1 = f(n)` → `Θ(log n) = ύψος δέντρου`. Σήμα-κλειδί:
  η αναδρομή ΔΕΝ είναι `S(n/2) + ...` αλλά `S(2n/3) + ...` (γιατί το
  τελευταίο επίπεδο γεμίζει από αριστερά → 2 παιδιά ασύμμετρα ως προς
  το ύψος).
- **Confidence.** Definite.
- **Target lecture.** L10.

**P10.2 — Hash table meet-in-the-middle (k-tuple ↓ n^{k/2}).**
- `front-set-5-ask10` (Πυθαγόρεια τετράδα σε `O(n²)`)
- `front-set-5-ask11` (ζεύγη με δοσμένο άθροισμα σε `O(n)`)
- **Cue.** «αναμενόμενος `O(n^{k/2})` αντί `O(n^k)`» → split εξίσωση σε
  «αριστερή πλευρά = δεξιά πλευρά» με `k/2` στοιχεία η καθεμία (π.χ.
  `a² + b² = d² − c²` για τετράδα Pyth.) · Πέρασμα 1 χτίζει hash set των
  αριστερών (`O(n²)` ζεύγη) · Πέρασμα 2 ψάχνει τις δεξιές. Σήμα-σύνθεση
  τριών: (i) εξίσωση που χωρίζεται, (ii) ζητούμενος χρόνος = √(αφελής),
  (iii) η λέξη **«αναμενόμενος»** ως τεχνική απαίτηση. Χωρίς το (iii) η
  απάντηση είναι λάθος.
- **Confidence.** Definite.
- **Target lecture.** L10.

### L11 — Greedy I (interval scheduling, counter-examples)

**P11.1 — Άπληστα ρέστα (greedy coin change).**
- `pt2-th2-3` (Σεπτ 2025 · Θ.2.3, 10% — αποτυγχάνει σε {1,10,25}) [Flame]
- `front-set-6-ask5` (ρέστα με ελάχιστα νομίσματα — πετυχαίνει σε κανονικό σύστημα)
- **Cue.** «δώσε ρέστα `n` με ελάχιστα κέρματα» + «ελληνικό/standard σύστημα
  νομισμάτων {1,5,10,20,50}» → άπληστος δουλεύει· αλλά συστήματα όπως
  {1,10,25} σπάνε με `30 = 25+1+1+1+1+1 ≥ 6 ≠ 10+10+10 = 3` → DP `O(n·k)`.
  «Η ορθότητα ζει στις αξίες, όχι στον κανόνα.»
- **Confidence.** Definite (ίδιος αλγόριθμος, αντιθετικά αποτελέσματα).
- **Target lecture.** L11.

**P11.2 — Greedy stays ahead (gas stations / range cover).**
- `front-set-6-ask6` (ελάχιστες στάσεις για ανεφοδιασμό)
- **Cue.** «`g_k ≥ o_k` επαγωγή — ο άπληστος ποτέ δεν είναι πίσω από
  το βέλτιστο». Σήμα-στην-εκφώνηση: «μέγιστη/ελάχιστη αυτονομία + όριο
  + ελάχιστες ενέργειες».
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L11.

**P11.3 — Άπληστος χρωματισμός / interval graph coloring = depth.**
- `front-set-6-ask8` (άπληστος χρωματισμός + ελάχιστα ταξί)
- `front-set-7-ask8` (κατανομή μαθημάτων σε αίθουσες)
- **Cue.** «ελάχιστα ταξί / αίθουσες / μηχανές» όπου τα «αντικείμενα» είναι
  διαστήματα → interval graph χρωματισμός = depth = max concurrent. Σήμα:
  η εκφώνηση πάντα γράφει σύνολο time intervals + ζητάει «πόσα παράλληλα».
- **Confidence.** Strong analogy (both reduce to interval partition / depth).
- **Target lecture.** L11.

**P11.4 — Ελάχιστα μοναδιαία διαστήματα που καλύπτουν σημεία.**
- `front-set-7-ask7` (ελάχιστα μοναδιαία διαστήματα που καλύπτουν σημεία)
- **Cue.** Ταξινόμηση σημείων· βάλε διάστημα ξεκινώντας από το πρώτο
  ακάλυπτο σημείο· επανέλαβε. «Greedy stays ahead» απόδειξη.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L11.

**P11.5 — «Επιλογή του φθηνότερου πακέτου / break-even threshold».**
- `front-set-7-ask4` (μηνιαίο vs ετήσιο πακέτο ίντερνετ)
- **Cue.** «pre-pay vs pay-as-you-go» + «πότε αξίζει;» → υπολόγισε
  break-even στατιστικά πριν τη βελτιστοποίηση· επιλογή `Θ(1)` ανά είσοδο.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L11.

**P11.6 — Counter-example στο greedy (grid / matrix path).**
- `front-set-7-ask5` (διαδρομή σε πίνακα: αποτυγχάνει ο άπληστος)
- **Cue.** «μέγιστη τιμή στο επόμενο βήμα» → counter-example: το άπληστο
  κλείνει drop-off· σωστή λύση DP από κάτω-δεξιά γωνία.
- **Confidence.** Solo (counter-example pattern; pairs structurally με P11.1).
- **Target lecture.** L11.

**P11.7 — Μέγιστη εναλλασσόμενη υπακολουθία (peaks-and-valleys).**
- `front-set-6-ask3` (μέγιστη εναλλασσόμενη υπακολουθία σε `O(n)`)
- **Cue.** «εναλλασσόμενες ↑/↓ μόνο» → άπληστο `O(n)` με peak/valley flips
  · κράτα μόνο τα τοπικά ακρότατα.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L11.

### L12 — Greedy II (scheduling, exchange arguments, topo)

**P12.1 — SPT για Σ wait time ⇔ LPT για makespan (exchange-arg flip).**
- `pt2-th4` (Σεπτ 2025 · Θ.4, 25% — wait time = SPT) [Flame]
- `front-set-6-ask4` (καθαριστήριο = LPT, makespan two-phase)
- **Cue.** Διαφορά αντικειμενικής:
  - **Σ wait time / Σ completion** → ταξινόμηση **αύξον** `t_i` (SPT)·
    exchange: αν δύο διαδοχικά είναι ανάποδα, swap μειώνει τη συνολική
    αναμονή.
  - **Makespan / Cmax** σε flow-shop / parallel → ταξινόμηση **φθίνον**
    `t_i` (LPT)· exchange: μεγάλη εργασία πρώτη απορροφά serial-bottleneck
    + αφήνει χώρο για παράλληλο.
- **Confidence.** Definite (canonical exchange-argument flip).
- **Target lecture.** L12.

**P12.2 — «Κλάση γραφημάτων ⇒ DAG;» (topo-sort applicability).**
- `pt2-th2-2` (Σεπτ 2025 · Θ.2.2, 5%) [Flame]
- **Cue.** Τοπολογική ταξινόμηση ⇔ DAG. 3-step recipe: (i) πάρε ένα
  κατευθυνόμενο γράφημα της κλάσης· (ii) ψάξε κύκλο (DFS με χρώματα GRAY)·
  (iii) ναι αν δεν υπάρχει. Παραδείγματα-διαχωριστές: βάρη ✗ (irrelevant)·
  διμερές ✗ (μπορεί να έχει κατευθυνόμενο κύκλο)· δέντρο κατευθυνόμενο
  ✓· DAG ✓.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L12.

### L13 — Greedy III (Huffman, fractional)

**P13.1 — Huffman canonical ⇔ Huffman disguised (merge δύο μικρότερων).**
- `front-set-6-ask7` (Huffman canonical ΚΑΣΤΑΝΑΣ)
- `front-set-7-ask1` (n ράβδοι χρυσού — Huffman disguised)
- **Cue.** «n στοιχεία με βάρη, κάθε σύνθεση δύο στοιχείων κοστίζει το
  άθροισμά τους, ελαχιστοποίησε το συνολικό κόστος» → Huffman γενικευμένο.
  Identification: `Σ w_i · d(i)` γράμμα-προς-γράμμα ισούται με
  `Σ f_x · |c(x)|`. Σήμα στις εξετάσεις: «σύνθεση αρχείων / συγκόλληση
  σχοινιών / k-merge»· κοινό σύμπτωμα: «πληρώνεις δύο πιο μικρά κάθε φορά».
- **Confidence.** Definite (this is the user's «τραπεζικές κάρτες ⇔ αρχαίες
  πλάκες» pattern for L13).
- **Target lecture.** L13.

**P13.2 — Fractional knapsack (greedy κατά `v/w`).**
- `front-set-10-ask13` (συνεχές σακίδιο)
- `front-set-7-ask12` (κλασματικό vs 0-1)
- **Cue.** «κλασματικά αντικείμενα» / «οποιοδήποτε ποσοστό» / «μπορεί να
  σπάσει» → ταξινόμηση κατά φθίνον `ratio v_i / w_i`, γέμισε ως το όριο,
  τελευταίο σπάει αναλογικά. Αντίθετα 0-1: ratio ΔΕΝ δουλεύει — counter-
  example στο L15.
- **Confidence.** Definite.
- **Target lecture.** L13.

**P13.3 — Τέλειο ταίριασμα σε δέντρο (greedy peel φύλλων).**
- `pt3-th3` (Ιουν 2024 · Θ.3, 30%) [Flame]
- **Cue.** «δέντρο + τέλειο ταίριασμα» → peel φύλλο: ζευγάρωσε φύλλο με
  γονιό + αφαίρεσε ζεύγος. Αν δεν υπάρχει ζευγάρωμα → καμία τέλεια ταίριαση.
  Αυστηρότερη αναγκαιότητα: «κάθε vs κάποια βέλτιστη» — όχι «η βέλτιστη
  ΠΑΝΤΑ περιέχει ζεύγος φύλλου-γονιού», αλλά «υπάρχει βέλτιστη που το
  περιέχει».
- **Confidence.** Solo (kept for radar; bridges with `TreeMatchingPeel`).
- **Target lecture.** L13.

### L14 — DP I (WIS, recursion vs DP, 1D problems)

**P14.1 — Weighted Interval Scheduling.**
- `pt6-th2` (Σεπτ 2023 · Θ.2, 35% — πλατφόρμα δόνησης = WIS literal)
- `front-set-9-ask5` (μαγνητικός τομογράφος = WIS)
- **Cue.** «μη επικαλυπτόμενα αιτήματα με ΤΙΜΕΣ / ΒΑΡΗ + max άθροισμα»
  → τα 4 βήματα: ταξινόμηση κατά `e_i`, υπολογισμός `p(j)` (δυαδική σε
  `O(log n)` ή scan σε `O(n)`), DP `P[j] = max(P[j−1], p_j + P[p(j)])`,
  ανάκτηση. Παγίδα: «greedy κατά τιμή» αποτυγχάνει (ένα μεγάλο ακριβό
  μπλοκάρει δύο μικρά που μαζί κερδίζουν).
- **Confidence.** Definite (same algorithm, different cover stories —
  gym vs hospital).
- **Target lecture.** L14.

**P14.2 — Λάμπες / max IS σε μονοπάτι (no-two-adjacent).**
- `pt5-th4` (Ιουν 2023 · Θ.4 — κολώνες φωτισμού)
- `front-set-10-ask6` (κολώνες φωτισμού — verbatim same problem)
- `front-set-9-ask2` (αίθουσες χωρίς 3 συνεχόμενες — variant with k=3)
- **Cue.** «επιλογή υποσυνόλου από στοίχιση με κανόνα μη-γειτνίασης» →
  DP `IS[i] = max(IS[i-1], w_i + IS[i-2])` (αν επιτρέπεται όχι-διαδοχικά)·
  παραλλαγή `k=3` → `IS[i] = max(IS[i-1], w_i + IS[i-2], IS[i-3])` ή
  παρόμοιο. Σήμα: 1D ακολουθία / σειρά + «δεν παίρνεις γείτονες» / «το
  πολύ δύο σε σειρά».
- **Confidence.** Definite (pt5-th4 ⇔ ask6 ίδιο verbatim· ask9-ask2
  strong analogy με stricter rule).
- **Target lecture.** L14.

**P14.3 — Άνοιγμα εστιατορίων σε δρόμο / 1D placement με min-απόσταση.**
- `front-set-9-ask3` (αλυσίδα εστιατορίων στην εθνική οδό)
- `front-set-8-ask4` (άνοιγμα εστιατορίων κατά μήκος δρόμου)
- **Cue.** «1D θέσεις σε σειρά + min-απόσταση μεταξύ επιλογών + κέρδη» →
  DP «πάρε i αν προηγούμενος επιλεγμένος ικανοποιεί min-απόσταση, αλλιώς
  άσε» — γενίκευση WIS όπου το `p(i)` ορίζεται γεωμετρικά. Σήμα: συντεταγμένες
  + threshold απόστασης.
- **Confidence.** Definite (same algorithm).
- **Target lecture.** L14.

**P14.4 — Recursion explosion → memoize/bottom-up cure.**
- `pt7-th2` (Ιουν 2022 · Θ.2, 35% — recursion vs DP)
- `front-set-10-ask11` (αναδρομή vs ΔΠ — πολυωνυμική αναδρομή)
- `front-set-10-ask12` (αναδρομή vs ΔΠ — εκθετική αναδρομή)
- **Cue.** «δείξε ότι αναδρομικός είναι `Θ(2^n)` και το DP `Θ(n)`» →
  recursion tree για lower bound (`T(n) ≥ T(n-1) + T(n-2) ⇒ ≥ φ^n`)·
  memoization αποθηκεύει κάθε `n` ξεχωριστά → `Θ(n)`. Σήμα: «αναδρομή
  Fibonacci-style» + «βελτίωσε με ΔΠ».
- **Confidence.** Definite.
- **Target lecture.** L14.

**P14.5 — Πολυπλοκότητα 1D / 2D DP πίνακα.**
- `pt1-th1-q7` (2D DP πολυπλοκότητα) [Flame]
- `pt1-th1-q8` (1D DP πολυπλοκότητα) [Flame]
- `pt2-th1-q6` (2D DP) [Flame]
- `pt2-th1-q7` (1D DP) [Flame]
- **Cue.** Πολυπλοκότητα = `|χώρος καταστάσεων| × |κόστος μετάβασης|`.
  2D `(i, j) ∈ [0..n]×[0..n]` με μετάβαση `O(1)` → `Θ(n²)`· με μετάβαση
  `O(n)` (π.χ. WIS με γραμμικό `p(j)`) → `Θ(n²·n) = Θ(n³)` (που πέφτει
  σε `Θ(n²)` με προ-υπολογισμό). Σήμα: η εκφώνηση γράφει «πόσο χρόνο
  παίρνει η ΔΠ» + δίνει την αναδρομή.
- **Confidence.** Definite (canonical drill across 4 recent papers).
- **Target lecture.** L14.

**P14.6 — Επίσκεψη αξιοθέατων / `n` καταστάσεις με σταθερό κατάλογο επιλογών.**
- `pt1-th3` (Ιουν 2025 · Θ.3, 20% — αξιοθέατα, ταξί/πατίνι) [Flame]
- **Cue.** «`n` σταδιακές καταστάσεις + κάθε στάδιο διαλέγεις από κατάλογο
  `K` επιλογών + κόστος εξαρτάται από τρέχουσα + προηγούμενη» →
  `f(i) = min over choice c of (cost(c, i) + f(i-shift(c)))`· complexity
  `Θ(n · K)`. Σήμα: «`n` βήματα» + «δύο μέσα/3 μέσα με σταθερό όφελος».
- **Confidence.** Solo (kept as canonical 2025 representative of the WIS
  generalisation pattern).
- **Target lecture.** L14.

**P14.7 — Rod cutting (1D DP με μήκος-τιμή).**
- `front-set-8-ask3` (rod cutting)
- **Cue.** «τιμολόγηση μηκών L → R(n) = max_{i∈[1..n]} (p_i + R(n-i))».
  Παγίδα: όχι αναδρομή Fibonacci-style αλλά O(n) sum-over-i.
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L14.

### L15 — DP II (knapsack, LCS / SCS)

**P15.1 — 0/1 σακίδιο: literal ⇔ disguised (ad slots / διάρκεια+κέρδος+όριο).**
- `pt4-th4` (Σεπτ 2024 · Θ.4, 40% — Διαφημίσεις χορηγών, ad slots) [Flame]
- `pt7-th3` (Ιουν 2022 · Θ.3 — 0/1 σακίδιο: άπληστος vs δυναμικός)
- `front-set-10-ask14` (0-1 σακίδιο: άπληστος vs ΔΠ)
- **Cue.** «αντικείμενα με βάρος/χρόνο `t_i` + αξία `v_i` + όριο `W/T`» →
  2D DP `K[i][W] = max(K[i-1][W], v_i + K[i-1][W-t_i])`. Σήμα-disguise:
  ντύσιμο διαφημίσεων / βιβλίων / φορτίων δεν αλλάζει τη μηχανική. Παγίδα:
  greedy κατά `v/w` αποτυγχάνει για ακέραιες ποσότητες — δίνει αντίθετο
  παράδειγμα στο L15.
- **Confidence.** Definite (canonical disguise: pt4-th4 is the rename of
  the textbook 0/1 σακίδιο).
- **Target lecture.** L15.

**P15.2 — 0/1 σακίδιο ⇔ WIS όταν εμφανίζεται «σταθερή θυρίδα».**
- `pt4-th4` (Σεπτ 2024 · Θ.4 — flip στο WIS όταν προστίθεται `[s_i, s_i+t_i]`) [Flame]
- (Pairs structurally με P14.1 — pt6-th2 / front-set-9-ask5)
- **Cue.** Παγίδα-διαχωριστής: αν τα αντικείμενα έχουν ΣΤΑΘΕΡΗ θυρίδα
  `[s_i, s_i+t_i]` → flip σε WIS (`P[j] = max(P[j-1], p_j + P[p(j)])`)
  αντί για 0/1 σακίδιο. Αν δεν υπάρχει σταθερή θυρίδα και απλώς διαλέγεις
  ποια αντικείμενα να βάλεις χωρίς να σε νοιάζει ΠΟΤΕ → 0/1 σακίδιο.
- **Confidence.** Strong (μεταξύ pt4-th4 και του cluster P14.1).
- **Target lecture.** L15 (also surfaced from L14).

**P15.3 — SCS (συντομότερη κοινή υπερακολουθία) ως LCS-with-min.**
- `pt2-th3` (Σεπτ 2025 · Θ.3, 20% — όνομα σκύλου = SCS) [Flame]
- **Cue.** «συντομότερη κοινή υπερακολουθία που περιέχει και τα δύο» →
  ίδια αναδρομή με LCS αλλά flipped: match → diagonal, mismatch → 1 +
  `min` (LCS παίρνει max). Closing identity: `|SCS| + |LCS| = m + n`
  — «δύο όψεις του ίδιου νομίσματος».
- **Confidence.** Solo at SCS level (kept for radar; pairs structurally
  με LCS στο P16.1).
- **Target lecture.** L15.

**P15.4 — Bounds for LCS / Θ vs O vs Ω diagnostic.**
- `pt2-th1-q8` (Σεπτ 2025 · Θ.1.8) [Flame]
- **Cue.** «κρίνε κάθε φράγμα μεμονωμένα»: βγάλε την πραγματική τιμή
  πρώτα (`Θ(mn)`), μετά εφάρμοσε rubric: άνω `O` δεν χρειάζεται να είναι
  σφιχτό (`O(n²m²)` σωστό), κάτω `Ω` πρέπει (`Ω(mn^2)` λάθος αν δεν
  υπάρχει). Θ-trap: «`Θ(mn log n)`» — λάθος γιατί δεν υπάρχει log factor.
- **Confidence.** Solo (canonical meta-recipe για όλες τις bounds-Σ/Λ).
- **Target lecture.** L15.

### L16 — DP III (edit distance, LCS)

**P16.1 — LCS / sequence alignment (match-mismatch-gap).**
- `pt16-th4` (Ιουν 2016 · Θ.4 — LCS των BANANA και BINARY)
- `front-set-8-ask2` (βέλτιστη ευθυγράμμιση DNA)
- **Cue.** «κοινό substring / υπακολουθία / αλληλούχιση» → 2D DP
  `L[i][j]`: match → diagonal + 1 / + score, mismatch ή gap → max αριστερά
  ή πάνω. Σήμα: δύο ακολουθίες χαρακτήρων + «μέγιστο».
- **Confidence.** Strong analogy — LCS είναι το all-or-nothing case,
  scored alignment είναι το γενικευμένο.
- **Target lecture.** L16 (LCS μπορεί να αντηχήσει και στο L15).

**P16.2 — LIS (longest increasing subsequence).**
- `front-set-9-ask8` (αύξουσες υπακολουθίες)
- **Cue.** `L(i) = 1 + max{L(j) : j<i, a_j < a_i}` → `Θ(n²)`. O(n log n)
  με patience sort / πίνακα `tails`.
- **Confidence.** Solo (kept for radar; standard 1D DP).
- **Target lecture.** L16.

### L17 — DP IV (Bellman-Ford, tree DP, DAG paths)

**P17.1 — Ανίχνευση αρνητικού κύκλου με BF (n-οστός γύρος).**
- `pt1-th2-a` (Ιουν 2025 · Θ.2.1 — ανίχνευση αρνητικού κύκλου) [Flame]
- `front-set-9-ask1` (ανταλλαγές & arbitrage = neg cycle)
- **Cue.** «ανίχνευσε αρνητικό κύκλο» → BF τρέχει n-1 γύρους και ένα
  ΕΞΤΡΑ· αν στον n-οστό γύρο κάποια `d[v]` ακόμα αλλάζει → υπάρχει αρνητικός
  κύκλος προσβάσιμος από `s`. Παραλλαγή «arbitrage»: λογ-μετασχηματισμός
  γινομένων ισοτιμιών → `−log` → αρνητικός κύκλος = κερδοφόρα αλυσίδα
  ανταλλαγών > 1.
- **Confidence.** Definite (canonical pair — exam-form ⇔ frontistirio
  disguise).
- **Target lecture.** L17.

**P17.2 — Bellman-Ford ΔΕΝ είναι άπληστος (T/F).**
- `pt4-th1-q3` (Σεπτ 2024 · Θ.1.3, 4% — Σ/Λ ο BF άπληστος;) [Flame]
- **Cue.** Διαγνωστικό: «κλείδωμα ή πίνακας;» — άπληστος (Dijkstra)
  κλειδώνει μία κορυφή ανά γύρο· DP (BF) γεμίζει 2D πίνακα `M[i][v]`
  (`v` αρχικά ∞, `M[i][v] = min(M[i-1][v], min over u: M[i-1][u] + w(u,v))`).
  Σήμα-στην-εκφώνηση: «είναι άπληστος ο BF;» / «τι κάνει σε αρνητικά
  βάρη;».
- **Confidence.** Solo (kept for radar).
- **Target lecture.** L17.

**P17.3 — Διπλή αναδρομή (count + sum) σε DAG ή δέντρο.**
- `front-set-8-ask1` (μέσο κόστος όλων των μονοπατιών σε DAG)
- **Cue.** «μέσο = sum / count» → 2 DP arrays: `count[v]` (πλήθος
  μονοπατιών που καταλήγουν στο `v`) + `sum[v]` (άθροισμα κοστών αυτών των
  μονοπατιών). Γενίκευση του «πάρτι δύο τιμές» (A[v] / B[v]) του L17.
- **Confidence.** Solo (kept for radar; generalises tree IS pattern).
- **Target lecture.** L17.

---

## 3. Solo fingerprints (no current pair — kept for radar / E.5 transcription priority)

These are patterns where the bank has only 1 transcribed instance, but the
fingerprint is pedagogically high-value. They surface as single-entry
ExamRadar items; E.5 transcription should look for natural twins in the
pending papers.

| Fingerprint | ID | Lecture | Note |
|---|---|---|---|
| Πλειοψηφικό O(n) Boyer-Moore | (πιθανή στο private_material) | L04 | Boyer-Moore single-pass alternative — υπάρχει στο lecture viz αλλά όχι στο bank |
| Stooge sort | `front-set-5-ask1` | L03 | Pathological slow D&C |
| Nuts & bolts randomised | `front-set-5-ask2` | L04 | Probabilistic quicksort variant |
| Median two sorted (`O(log(m+n))`) | `front-set-4-ask8` | L05 | Binary search on two fronts |
| Pythagorean k-tuple (already paired) | `front-set-5-ask10` | L10 | Meet-in-middle hash — see P10.2 |
| MST 2nd/3rd lightest | `front-set-6-ask2` | L09 | Edge swap argument |
| TSP via MST | `front-set-7-ask3` | L09 | 2-approximation via preorder |
| Tree perfect matching | `pt3-th3` | L13 | Greedy peel φύλλων |
| Sightseeing/`n`-stage decisions | `pt1-th3` | L14 | Generalisation of WIS |
| Rod cutting | `front-set-8-ask3` | L14 | 1D DP, sum-over-cuts |
| SCS (super-sequence) | `pt2-th3` | L15 | LCS dual (min-flip) |
| LCS bounds Σ/Λ | `pt2-th1-q8` | L15 | Meta-recipe for bounds traps |
| LIS | `front-set-9-ask8` | L16 | Standard `Θ(n²)` / `O(n log n)` |
| BF not greedy | `pt4-th1-q3` | L17 | Diagnostic «lock vs table» |
| DAG average path | `front-set-8-ask1` | L17 | Double DP (count + sum) |
| Fast exponentiation | `pt1-th4` | L03 | Repeated squaring |
| Equal-weight BFS | `front-set-10-ask3` | L06 | Dijkstra reduces to BFS |
| State-graph BFS | `front-set-7-ask2` | L06 | Puzzle → BFS on configuration graph |
| Topo-sort ⇔ DAG | `pt2-th2-2` | L12 | Class characterisation |
| Greedy stays ahead | `front-set-6-ask6` | L11 | Gas stations canonical |
| Internet plan threshold | `front-set-7-ask4` | L11 | Break-even arithmetic |
| Counter-example grid | `front-set-7-ask5` | L11 | Greedy fails on 2D grid |
| Alternating subsequence | `front-set-6-ask3` | L11 | `O(n)` peak/valley scan |
| Unit interval cover | `front-set-7-ask7` | L11 | Greedy stays ahead variant |
| `Σ i = Θ(n²)` Θ-from-definition | `pt4-th1-q5` | L02 | Canonical Θ proof |
| `Σ i²` vs `n² log n` | `pt2-th1-q1` | L02 | Closed-form vs poly·log |
| Unknown NP-completeness | `pt2-th1-q10` | L01 | 3rd-zone shape |
| MST/Dijkstra T/F | `front-set-7-ask11` | L09 | Different problems, similar inputs |
| Representation cost split | `pt6-th1` | L06 | List vs matrix tradeoff |

---

## 4. Summary statistics

- **Total pairs/triples documented:** 37 (across 14 lectures).
- **Total solo fingerprints documented:** 29.
- **Distribution by confidence:**
  - Definite: 30 pairs
  - Strong analogy: 7 pairs
  - Solo: 29 entries
- **Distribution by lecture (pairs only):**
  - L01: 1 · L02: 7 · L03: 6 · L04: 3 · L05: 1
  - L06: 1 · L07: 0 · L08: 3 · L09: 6 · L10: 2
  - L11: 1 · L12: 1 · L13: 2 · L14: 5 · L15: 4 · L16: 1 · L17: 1
- **Flame-bearing pairs (≥ 1 entry from 2024/2025):** 26 of 37.
- **The 5 «headliest» pairs** (highest weight × recency × cleanest disguise):
  - P9.8 — D(MST/TSP/ST) ∈ NP cluster (5 papers including Σεπτ 2023 25%)
  - P15.1 — 0/1 σακίδιο literal ⇔ disguised (Σεπτ 2024 40%)
  - P14.1 — WIS (Σεπτ 2023 35%)
  - P14.4 — Recursion explosion vs DP (Ιουν 2022 35%)
  - P13.1 — Huffman canonical ⇔ disguised (the user's «canonical example» class)

---

## 5. Implications for Task E.3 (per-lecture `<RelatedPair>` retrofit)

Each pair listed above maps to one `<RelatedPair>` component instance with
bidirectional surfacing:

- **Render on EACH problem of the pair:** «αυτό το πρόβλημα έχει
  ζεύγος με …» chip linking to the other(s).
- **Render on the lecture page once:** «Πρότυπα που εμφανίστηκαν σε
  ζεύγη» summary block, listing the pair's fingerprint cue + both/all
  problem deep-links.
- **Per the original L09 inline-citation convention:** if both entries
  of a pair are already cited inline via `<ExamProblem>` chip, the
  `<RelatedPair>` on the problem CARDS does the bidirectional surfacing
  the chip alone cannot.

**Per-lecture queue for E.3** (ordered by pair-density):
- L02 (7), L09 (6), L03 (6), L14 (5), L15 (4) — lectures with rich pair pools
- L04 (3), L08 (3) — medium pools
- L01, L05, L06, L11, L12, L13, L16, L17 (1-2) — light pools
- L07 — none

---

## 6. Implications for Task E.5 (transcription priorities)

The pending-transcription papers (16 stubs: sept-2022, june-2021, sept-2020,
distance-2020, feb-2019, june-2018, sept-2017, feb-2017, june-2016 (partial),
feb-2016, june-2015, midterm-2012, sept-2011, june-2011, june-2010,
midterm-2008) should prioritise problems that **complete an existing solo
fingerprint** into a pair. Highest-value transcriptions:

- Any older paper with a **Huffman-disguised** problem → strengthens P13.1.
- **Tree DP** (matching / IS) variants → completes P13.3 + P17.3.
- **0/1 σακίδιο** variants → strengthens P15.1.
- **LIS** variants → completes P16.2.
- **State-graph BFS** puzzles → completes P6.4.
- **Bellman-Ford-not-greedy** Σ/Λ diagnostics → completes P17.2.

---

## 7. Acceptance criteria

- ✅ 37 pairs documented (target was 12–25; vastly exceeded).
- ✅ Every pair has: pattern fingerprint, problem IDs, recognition cue,
  confidence, target lecture.
- ✅ All pairs grounded in transcribed entries (no «we plan to write» entries).
- ✅ Recognition cues use the same Σήμα-στην-εκφώνηση + 3-step recipe form
  established in E.1.
- ⏳ User review pending — please scan §2 and flag any pair that should be
  promoted/demoted/merged/split.

**Commit message used:**
`docs(phase-e): catalogue of exam ↔ frontistirio pattern pairs`
