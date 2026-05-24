# Phase E — Past-Exam Integration, Cross-Problem Patterns & Algorithm Description Audit

> **Read this file first in any new session.** It is a resumable plan: do ONE
> task per turn, stop and show, wait for review before the next. The standard
> is unchanged — see [[lecture-rework-standard]] in `~/.claude/projects/.../memory/`.
> No cutting corners. Cost is not a consideration.

---

## 0. How to resume Phase E (after `/clear` or `/reset`)

The user pastes this exact prompt to start any session:

```
Continue Phase E. Before anything else, read plans/PHASE_E_PLAN.md
end-to-end and read the memory files lecture-rework-standard,
pseudocode-philosophy, and site-wide-rollout — treat all of them as
binding. Find the next unchecked task in the Progress tracker at the
top of the plan. Do ONE task only — then stop and show me. Same
standard as Phases A through D: deep, maximum-effort, no cutting
corners. Update the Progress tracker checkbox AND the relevant memory
file when you finish.
```

**Self-orienting protocol on receipt of that prompt:**
1. Read this file end-to-end.
2. Read the three binding memory files (above).
3. Look at the Progress tracker (§ 1) — the first unchecked `☐` is the next
   task. If multiple sub-tasks are stacked under a phase (e.g. E.1 has 17
   per-lecture sub-tasks), pick the first unchecked sub-task in order.
4. Cross-check with `git log feat/site-wide-rollout --oneline -25` — the
   commit titles map to the plan's task labels (`feat(L09-inline-citations)`,
   `feat(L09-pairs)`, etc.). If a commit exists for a task that's not
   ticked, tick it before starting.
5. Execute ONE task. Run typecheck + lint + build. Commit. Push to `fork`.
6. **Update the Progress tracker checkbox and a memory file**, then stop
   and show the user.

---

## 1. Progress tracker

Tick (`☑`) each item as it's committed. Newest tasks go at the bottom of
a sub-list. Update this section in the same commit that finishes the task.

- ☑ **Pre-flight audit** → `plans/E_PREFLIGHT.md` (done 2026-05-24 — branch + bank state captured, 3 user-decision questions surfaced, E.1 sequencing recommended; see [[phase-e-preflight]])
  - ☑ Per-card takedown notice removed (out-of-band on 2026-05-24, commit forthcoming). Future executor: skip this sub-step.
  - ☑ Q1 — commit the 4 `material/past_exams/` PDFs (done 2026-05-24, commit `f516ec3`).
  - ☑ Q2 — de-anonymize the bank: real dates everywhere. Migration in E.0.
  - ☑ Q3 — un-gitignore `private_material/`; raw older-archive PDFs to be uploaded by user and tracked.
- ☑ **E.0 — Bank de-anonymization migration** (done 2026-05-24 — 141 entries migrated `paperLabel` → dated `source`; titles rewritten; `paperLabel` field removed from `Exercise` type; `ExerciseCard`/`SoseProblemCard` Flame chip fires for #1–#7; `ExerciseLibrary` sort switched to `source`; see [[phase-e0-bank-dedeanonymization]])
- ☐ **E.1 — Inline `<ExamProblem>` citations**:
  - ☑ **E.1.0 — `<ExamProblem>` component extension** (done 2026-05-24 — dual-mode dispatcher: chip mode when `relatedExerciseId` is set (server component, rose-tinted citation with date · problem number · title, Flame chip for 2024/2025, weight chip, optional `pattern` ReactNode cue, deep-link to `/practice#exercise:<id>` via Next.js `Link`); legacy `year+children` card mode kept for back-compat via delegated `ExamProblemCard` client component. EXERCISES lookup with graceful dev-only warn fallback for bad ids. typecheck+lint+build all pass. See [[phase-e1-component-extension]])
  - 17 per-lecture sub-tasks (rich-pool first per pre-flight recommendation):
    - ☑ **L09** (done 2026-05-24 — 3 inline citations at the natural pattern moments: `pt2-th2-1` (Σεπτέμβριος 2025 Θ.2.1 — εκτέλεση Dijkstra) right after `DijkstraAnimator`, `pt2-th1-q5` (Σεπτέμβριος 2025 Θ.1.5 — αλγόριθμοι με αρνητικά βάρη) right after `DijkstraInvariantBreak` before the Bellman-Ford forward-ref, `pt4-th2-b` (Σεπτέμβριος 2024 Θ.2β — εφαρμογή ΕΕΔ) right after the «Prim ή Kruskal;» comparison table. Pattern cue authored as a one-sentence recognition signal per chip with inline KaTeX where it tightens the cue. Component bug fixed in the same commit: `ExamProblemChip` now strips the redundant `'<Date> · Θέμα X — '` prefix from `ex.title` (the chip header already renders that prefix from `source` + `problemNumber`). Server component, zero client JS shipped — L09 bundle size unchanged at 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L09-citations]])
    - ☑ **L14** (done 2026-05-24 — 3 inline citations at the three natural pattern moments of DP I: `pt7-th2` (Ιούνιος 2022 Θ.2 — αναδρομή vs DP, 35%) right after the linear-Fibonacci pseudocode at the «$O(2^n) \to O(n)$» punchline; `pt6-th2` (Σεπτέμβριος 2023 Θ.2 — «πλατφόρμα δόνησης», 35%, literal WIS with greedy-by-price counterexample) right after the WIS Algorithm block + memoization variant + complexity Callout, before the deep-dive «Υπολογισμός των $p(j)$ σε $O(n)$»; `pt1-th3` (Ιούνιος 2025 Θ.3 — «επίσκεψη αξιοθέατων», ταξί/πατίνι, 20%) right after the «το πιο δύσκολο βήμα είναι το 1ο» intuition Callout, before the RecallCard — exemplifies the 4-step recipe on a brand-new 2025 problem. Pattern cues authored as one-sentence recognition signals: «$b_n = f(b_{n-1}, \dots)$ + RB algorithm» → geometric exponential lower bound + memoization; «μη επικαλυπτόμενα αιτήματα με τιμές» → ταξινόμηση κατά λήξη + $p(j)$ + δυαδική «μέσα/έξω» + αντιπαράδειγμα κατά τιμή; «ακολουθία $n$ καταστάσεων με σταθερό κατάλογο επιλογών στο τελευταίο βήμα» → recipe + recurrence min/max over $K$ choices + $\Theta(n \cdot K)$. Server component, zero client JS shipped — L14 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L14-citations]])
    - ☑ **L02** (done 2026-05-24 — 3 inline citations at the three natural Ασυμπτωτική Ανάλυση pattern moments: `pt4-th1-q5` (Σεπτέμβριος 2024 Θ.1.5 — «$1+2+\cdots+n = \Theta(n^2)$», 4%) right after the «Οι τρεις περιπτώσεις, αλγεβρικά» Example — same Θ-from-definition proof technique as the 3n²−100n+6 example above; `pt2-th1-q1` (Σεπτέμβριος 2025 Θ.1.1 — Άθροισμα τετραγώνων vs $n^2\log n$, 3%) right after the «βρες το «καλύτερο» O» ThinkingPattern — applies the 3-step recipe (απλοποίησε άθροισμα → πέτα σταθερές → σύγκρινε) end-to-end on a 2025 problem; `pt1-th1-q2` (Ιούνιος 2025 Θ.1.2 — $2^{\log_2 n}$ vs $n^{\log_2 n}$, 3%) right after the «Συνδυάζοντας τα δύο αποτελέσματα» Callout — tests the just-derived dominance hierarchy on a problem where the «πρώτα ξεμπλέκεις τις ταυτότητες» step (2^{log₂ n} = n) is the headline. Pattern cues authored as one-sentence recognition signals with inline KaTeX: «συγκεκριμένη συνάρτηση + δείξε ότι ανήκει στο Θ(g)» → φράξε άνω και κάτω από c·g + κλειστός τύπος για αθροίσεις + φράγμα από τους μισούς όρους· «$\sum f(i)$ vs πολυώνυμο × λογάριθμο» → 3 τύποι-κλειδιά ($\sum i, \sum i^2, \sum 1/k$) + ιεραρχία· «$a^{\log_a n}$ ή $n^{\log n}$ ή $\log(\sqrt{x})$» → απλοποίηση ταυτοτήτων πρώτα, μετά τοποθέτηση στην ιεραρχία (υπερπολυωνυμικό κάθεται ανάμεσα σε $n^c$ και $a^n$). Three distinct recent papers cited (Σεπτ 2024, Σεπτ 2025, Ιουν 2025 — all Flame-eligible) at three distinct moments of the lecture's arc. Server component, zero client JS shipped — L02 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L02-citations]])
    - ☑ **L03** (done 2026-05-24 — 3 inline citations at the three natural D&C / Master Theorem pattern moments: `pt1-th1-q5` (Ιούνιος 2025 Θ.1.5 — «κύκλωσε ποια ισχύουν για $T(n) = 2T(n/2) + n$», 3%) right after the Απόδειξη #4 closing Callout, before the «Γιατί στη μέση;» section — citing the exact mergesort recurrence just proved 4 ways, with a recipe for «κύκλωσε»-style answers (ναι στα φράγματα που περιέχουν τη σωστή τάξη, όχι στα στενότερα); `pt4-th1-q4` (Σεπτέμβριος 2024 Θ.1.4 — Σ/Λ: «$T(n) = 2T(n-1) + \Theta(n) \Rightarrow O(n^2)$», 4%) right after the Hanoi-vs-mergesort comparison Callout, before the Mergesort RecallCard — the «$aT(n-c)$ for $a > 1$ → εκθετικό, όχι πολυωνυμικό» trap, with the explicit «μικραίνει κατά $c$ → εκθετικό· μικραίνει στο $n/c$ → πολυωνυμικό» μοτίβο-διαχωριστής and the «$O(n^2)$ ηχεί σαν mergesort αλλά η mergesort έχει $2T(n/2)$, όχι $2T(n-1)$» disambiguation; `pt4-th3` (Σεπτέμβριος 2024 Θ.3 — βρες $n$ σε $1^m 0^n$ σε $O(\log k)$, 30%) right after the Master Theorem ThinkingPattern, before the «Πότε ΔΕΝ εφαρμόζεται» section — exemplifies the application table's «Δυαδική αναζήτηση» row applied to «αναζήτηση για σύνορο, όχι για τιμή», with the explicit Master Theorem case-2 derivation ($a=1, b=2, d=0$ → $\Theta(\log k)$) and a callback to [[pseudocode-philosophy]] («αρκεί φυσική γλώσσα — χωρίς ψευδοκώδικα γραμμή-γραμμή»). Three distinct pattern flavors at three distinct lecture arcs (post-mergesort-proofs → post-Hanoi-comparison → post-Master-Theorem-application). Coverage: 1 Ιουν 2025 + 2 Σεπτ 2024 — both Flame-eligible; chosen for teaching value at the canonical moment of each chip (the 2024 Θ.1.4 + Θ.3 pair are the strongest L03 Flame citations the bank has). All bottom surfaces unchanged: 25-entry `<LectureExercises />` index + 8-item `<ExamRadar />` (which already lists all three chip targets — chip + radar are complementary surfaces per the L02 precedent). Server component, zero client JS shipped — L03 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L03-citations]])
    - ☑ **L15** (done 2026-05-24 — 3 inline citations at the three natural DP II / Σακίδιο+LCS pattern moments: `pt4-th4` (Σεπτέμβριος 2024 Θ.4 — «Διαφημίσεις χορηγών», 40%, the biggest L15 Flame chip in the bank) right after `<KnapsackTable />`, before the «Πολυπλοκότητα — μια λεπτή παγίδα» section — exemplifies «αναγνώρισε το σακίδιο κάτω από το ντύσιμο» with the explicit «διάρκεια $t_i$ ↔ βάρος $w_i$ / κέρδος $p_i$ ↔ αξία $v_i$ / διαθέσιμος χρόνος $T$ ↔ χωρητικότητα $W$» μετονομασία table, the $\Theta(nT)$ + $O(n)$-recovery summary that previews the very next section, AND the (ε) παγίδα that flips to **Σταθμισμένος Χρονοπρογραμματισμός** (L14) the moment a σταθερή θυρίδα $[s_i, s_i+t_i]$ enters the picture — γνήσια vs ψευδοπολυωνυμικό dichotomy made operational; `pt2-th3` (Σεπτέμβριος 2025 Θ.3 — «Όνομα σκύλου / συντομότερη κοινή υπερακολουθία», 20%) right after the LCS dependency-SVG diagram, before «### Ο αλγόριθμος» — the canonical max ↔ min generalization of the just-shown LCS recurrence: «$x_i = y_j$ → διαγώνια» stays, but the «$x_i \ne y_j$» branch flips to «$1 + \min$» for SCS («ελάχιστο μήκος που τα χωράει και τα δύο») vs «$\max$» for LCS («μέγιστο όμοιο μήκος»), with the closing identity $|\text{SCS}| + |\text{LCS}| = m + n$ as the «δύο όψεις του ίδιου νομίσματος» punchline; `pt2-th1-q8` (Σεπτέμβριος 2025 Θ.1.8 — «Φράγματα πολυπλοκότητας της LCS», 3%) right after the «Ο πίνακας έχει $(m+1)(n+1)$ κελιά… → $\Theta(mn)$» closing paragraph, before the LCS `<RecallCard>` — exemplifies the meta-skill «πρώτα βγάλε την πραγματική τιμή, μετά κρίνε κάθε φράγμα μεμονωμένα» with the explicit $O / \Omega / \Theta$ rubric AND a Θ-trap diagnostic that points two ways: $\Theta(mn \log n)$ is **λάθος** (LCS doesn't have a log factor, so the kάτω fails), while $O(n^2 m^2)$ is **σωστό** because άνω φράγμα doesn't need to be σφικτό — a one-cue distillation of the whole bounds-Σ/Λ technique. All three chips Flame-eligible (Σεπτ 2024 + Σεπτ 2025 × 2 — the most recent-paper-dense L15 chip set possible given the bank). Three distinct pattern flavors: (a) renamed-knapsack recognition with knapsack ↔ WIS dichotomy, (b) max ↔ min generalization of LCS recurrence, (c) bounds-Σ/Λ meta-recipe. All bottom surfaces unchanged: the existing 9-item `<ExamRadar />` and end-of-page `<LectureExercises />` index still render. Server component, zero client JS shipped — L15 bundle stays 159 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L15-citations]])
    - ☑ **L01** (done 2026-05-24 — 3 inline citations clustered after `<ComplexityZooLab />` — the only natural anchor since all 5 L01-tagged bank entries are P/NP «complexity zoo» problems. Three different recent papers, three different question shapes, three different recognition cues, escalating through the lecture's three zones: `pt4-th1-q1` (Σεπτέμβριος 2024 Θ.1.1 — Σ/Λ «αν $P \neq NP$ τότε το συντομότερο μονοπάτι δεν είναι σε P», 4%, easy) — the «εικασία P ≠ NP + γνωστό-σε-P πρόβλημα → πρόταση Λ» trap, with the explicit pre-answer check «έχω πολυωνυμικό αλγόριθμο για αυτό;» (Dijkstra $O(m \log n)$ / Bellman-Ford $O(mn)$ / BFS $O(n+m)$ all-but-flag the falsity); `pt1-th1-q9` (Ιούνιος 2025 Θ.1.9 — «ποια δεν ανήκουν στο P αν $P \neq NP$;», 3%) — multiple-choice over (Huffman, συντομότερο, μακρύτερο, SAT), with the 3-step recipe «(1) έχω πολυωνυμικό; → στο P (2) κλασικό NP-πλήρες (SAT/VC/Knapsack/Hamilton/TSP/Longest Path); → εκτός P (3) αλλιώς ίσως άγνωστο (Graph Iso, Integer Factor)» AND the «συντομότερο vs μακρύτερο μονοπάτι» παγίδα-σήμα the lecture prose already names; `pt2-th1-q10` (Σεπτέμβριος 2025 Θ.1.10 — «ποια δεν γνωρίζουμε αν είναι NP-πλήρη;», 3%) — the third-zone shape, with the explicit listing of the only 2 names that live there (Παραγοντοποίηση Ακεραίων, Ισομορφισμός Γραφημάτων) and the «**δεν** γνωρίζουμε / **δεν** έχει αποδειχθεί / παραμένει ανοιχτό» Σήμα-στην-εκφώνηση cue. Two minimal interstitial sentences bridge the chips («Όταν η ίδια λογική γίνεται πολλαπλής επιλογής, ο φακός μένει ο ίδιος…», «Η τρίτη ζώνη — τα ακόμη άγνωστα — έχει το δικό της σχήμα ερώτησης…») to frame the trio as three exam-shapes of the same concept rather than three stacked citations. The bottom `<ExamRadar />` already lists all 5 L01 ids under «Σε ποια κλάση ανήκει κάθε γνωστό πρόβλημα» (chip + radar are complementary surfaces per the L09/L02/L03/L14/L15 precedent); the `<LectureExercises />` block still indexes all 5 entries as full cards. Server component, zero client JS shipped — L01 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L01-citations]])
    - ☑ **L04** (done 2026-05-24 — 3 inline citations at the three natural D&C II pattern moments, one per problem of the lecture: `front-set-4-ask9` (Φροντιστηριακό #4 Άσκ. 9 — Τομές ευθύγραμμων τμημάτων = αντιστροφές) right after the Μέτρηση Αντιστροφών complexity Callout (Θ(n²)→O(n log n) «δωρεάν» punchline), before the inversions RecallCard — the cleanest pattern-pair-in-disguise in the bank: geometric segment-crossing count IS literal inversions on Q after sorting by lower endpoint, runs same `sort-and-count` verbatim, the recognition cue authored as «αν η εκφώνηση κρύβει το ζεύγη ανάποδα ως προς κάποια διάταξη, είναι αντιστροφές»; `pt3-th2` (Ιούνιος 2024 Θ.2 — Πλειοψηφικό στοιχείο σε O(n log n), 30%, **the only L04 Flame chip in the bank**, hard) right after the «Μπορεί και καλύτερα;» intuition Callout that already names «ένα μοτίβο που η εξέταση αγαπά να ζητάει σε νέα προβλήματα», before the «---» separator — the lecture's own setup hands off to the chip; the «κυρίαρχο χρώμα → 1D» dimensional reduction made operational (Παρατήρηση-κλειδί stays identical: «πλειοψηφικό ⇒ πλειοψηφικό σε ≥ 1 μισό»; «μόνο 2 υποψήφιοι αντί 4 σε 2D» reduces T(n)=2T(n/2)+O(n)→O(n log n) vs O(n² log n); the «επιτρέπεται μόνο ='?» σήμα-στην-εκφώνηση that kills ταξινόμηση + hash spelled out); `front-set-4-ask8` (Φροντιστηριακό #4 Άσκ. 8 — Διάμεσος δύο ταξινομημένων πινάκων σε O(log n), hard) right after the Karatsuba RecallCard, before «### Τι ακολούθησε τον Karatsuba» — the Karatsuba lesson («λιγότερες αναδρομικές κλήσεις αλλάζει τον εκθέτη») pushed to its limit: 1 (not 2) recursive call → T(n)=T(n/2)+O(1)→Θ(log n), Master Theorem a=1/b=2/d=0 case-2 derivation spelled out + the σύγκρινε-διαμέσους-πέτα-ίσα-πλήθη συνταγή + the «ίσα **πλήθη** όχι ίσα ποσοστά» trap (so the μικρότερος πίνακας doesn't drain first and break the αναλλοίωτη). One Flame (out of 1 available — the entire pool of recent-paper L04 entries is just pt3-th2) + two Frontistirio chosen for being canonical pattern-pair instances of the lecture's first and third problems. Coverage: each chip lands the L04 lecture's own (problem 1: inversions, problem 2: dominant colour / majority, problem 3: Karatsuba / fewer recursive calls); the bank's L04 pool has no Karatsuba chip so the third anchor uses the closest pedagogical match (binary-search-on-two-fronts as the «1 recursive call» extreme of Karatsuba's «3-not-4» insight). All bottom surfaces unchanged: the existing 8-item `<ExamRadar />` already lists all three chip targets under «Μέτρηση αντιστροφών ή παραλλαγή», «Διάμεσος / k-οστό σε δύο ταξινομημένους πίνακες», and (pt3-th2) «Σχεδίαση D&C / Εφαρμογή Master Theorem / Πλειοψηφικό-τύπου με παρατήρηση» — chip + radar are complementary surfaces per the L02/L03 precedent. Server component, zero client JS shipped — L04 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L04-citations]])
    - ☑ **L06** (done 2026-05-24 — 3 inline citations at the three natural Graphs-I pattern moments, walking the lecture's three-pillar body arc «μοντελοποίηση / αναπαράσταση / διάσχιση»: `front-set-7-ask2` (Φροντιστηριακό #7 Άσκ. 2 — «Λύκος, κατσίκα, λάχανο» state-graph BFS, medium) right after the `<MetroModelingViz />` + the «το πιο σημαντικό μάθημα του L06 για τις εξετάσεις» key-Callout, before «## Πώς αποθηκεύουμε ένα γράφημα» — the lecture's own setup explicitly tells the student «η μετάφραση είναι η δουλειά σου, οι αλγόριθμοι των L07–L09 το λύνουν έτοιμοι»; the chip lands the cleanest «state ⇒ graph» problem in the bank (16 dynamic states → 10 ασφαλείς after rule-pruning, BFS gives shortest 7-crossing solution). Pattern cue authored: «κόμβοι = ασφαλείς καταστάσεις (αποκλείεις όσες παραβιάζουν κανόνα) · ακμές = επιτρεπτές μεταβάσεις · ερώτηση s-t γίνεται BFS · πληρώνεις O(|V_κατ|+|E_κατ|) στο μέγεθος του γράφου καταστάσεων, όχι του αρχικού χώρου αναζήτησης». Σήμα στην εκφώνηση: «κανόνες», «επιτρέπεται», «μετακίνηση»; `pt6-th1` (Σεπτέμβριος 2023 Θ.1 — BFS/DFS πολυπλοκότητα + εύρεση γειτόνων N(v) λίστα-vs-πίνακας, 15%, easy) right after the «Αναπαράσταση γραφήματος» RecallCard, before «## Διαδρομές και συνεκτικότητα» — the chip is the exam problem that LITERALLY tests the just-read «κανόνας πυκνού/αραιού» Callout. Pattern cue authored as a two-branch reading recipe: Λίστες → O(|V|+|E|), που γίνεται O(|V|) όταν |E|=Θ(|V|), εύρεση N(v) σε O(Δ(v)); Πίνακας → O(|V|) ανά N(v) ανεξάρτητα από βαθμό, BFS συνολικά O(|V|²). «Σήμα στην εκφώνηση: όποτε αναφέρεται η αναπαράσταση ρητά ή υπάρχει σχέση |E|=Θ(|V|), η εξέταση τεστάρει τον κανόνα του πυκνού/αραιού»; `pt5-th1` (Ιούνιος 2023 Θ.1 — Συνεκτικές συνιστώσες σε λίστες γειτνίασης, 20%, medium — **the strongest L06 chip in the bank**) right after `<ConnectivityExplorer />`, before «### Κύκλος» — the chip is the algorithm form of the «κύμα ανά νησί» picture the viz just established. Pattern cue authored: «εξωτερικός βρόχος για επόμενη ασημάδευτη + ένα BFS ανά συνιστώσα με κοινό id c · Θ(|V|+|E|), το οποίο είναι και το θεωρητικό κάτω φράγμα», closing with the «σπάσε γράφο σε μέγιστα συνεκτικά κομμάτια» πρότυπο σκέψης that generalises to χρωματισμό με ελάχιστα χρώματα / ομαδοποίηση δικτύου. **No Flame chips on L06** — the bank has zero 2024/2025 L06 entries (the documented L04 precedent confirms this is a legitimate outcome of a sparse recent-paper pool; the lecture's 5% exam-weight matches). Three distinct pattern flavors at three distinct lecture-arc anchors: (a) state-graph modeling, (b) representation cost split, (c) repeated-BFS components. All bottom surfaces unchanged: the existing 6-item `<ExamRadar />` already lists all three chip targets under «Μοντελοποίηση μιας περιγραφής ως γράφημα» (front-set-7-ask2), «Σύγκριση αναπαραστάσεων (πίνακας vs λίστα)» (pt6-th1), and «Συνεκτικές συνιστώσες με επαναλαμβανόμενο BFS/DFS» (pt5-th1, front-set-5-ask5) — chip + radar are complementary surfaces per the L02/L03/L09/L14/L15/L01/L04 precedent. Server component, zero client JS shipped — L06 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L06-citations]])
    - ☑ **L08** (done 2026-05-24 — 3 inline citations clustered in the «Εισαγωγή στη συντομότερη διαδρομή με βάρη» section, the only section of L08 whose pattern is covered by the bank's 6 L08-prereq entries (all frontistirio, zero 2024/2025 → **no Flame chips**, legitimate sparse-pool outcome per L06 precedent): `front-set-5-ask9` (Φροντιστηριακό #5 Άσκ. 9 — Σ/Λ «×k vs +α διατηρεί το συντομότερο μονοπάτι;», medium) right after the static 7-vertex weighted-graph SVG, before «### Γιατί το BFS δεν αρκεί πια» — the foundational invariance question that primes the student to think about weight-transformations BEFORE meeting the «BFS doesn't suffice» problem; pattern cue authored as the asymmetric dichotomy «×$k$ → όλα τα μονοπάτια παίρνουν συντελεστή $a$ → ο νικητής δεν αλλάζει» vs «+$\alpha$ → μονοπάτι με $\ell$ ακμές χρεώνεται $\ell \cdot \alpha$ → τιμωρία ασύμμετρη ανά μήκος → νικητής αλλάζει», closing with the forward-ref «η ίδια λογική επιστρέφει αμέσως μετά για να εξηγήσει γιατί δεν φτιάχνεις τα αρνητικά με +σταθερά + Dijkstra»; `front-set-5-ask6` (Φροντιστηριακό #5 Άσκ. 6 — Μονοπάτι μέγιστης αξιοπιστίας, hard) right after `<WhyBFSFailsWeighted />`, before the L09 forward-ref Callout — the positive counterpart to ask9's invariance question: «η ίδια λογική του μετασχηματισμού έχει και θετική όψη» bridge introduces «$\log(\prod P) = \sum \log P$» + «$-\log P \ge 0$ → max γινομένου γίνεται min αθροίσματος → Dijkstra εφαρμόζεται έτοιμος» with the concrete numerical fact ότι οι δύο «προφανείς» 2-ακμές διαδρομές της εκφώνησης έχουν ταυτόσημη αξιοπιστία $\tfrac{1}{16}$ αλλά η 3-ακμές κερδίζει με $\tfrac{1}{4}$, AND the πρόσημο-διαλέγει-αλγόριθμο cue («θετικό $-\log$ → Dijkstra· αρνητικό $\log$ → Bellman-Ford / DAG-χαλάρωση»); `front-set-6-ask1` (Φροντιστηριακό #6 Άσκ. 1 — Σχεδιασμός ποδηλατικής εκδρομής με χρόνο-φάση, hard) right after the ask6 chip, before the L09 forward-ref Callout — an orthogonal strategy: «αλλάζεις τη δομή του ίδιου του γράφου αντί για τα βάρη», με την κατασκευή στρωματικού DAG operationalised: «σπάσε κάθε φυσική κορυφή $i$ σε αντίγραφα $(i, \phi)$ ανά φάση · ακμή $(i, \phi-1) \to (j, \phi)$ μόνο όταν η μετάβαση είναι νόμιμη στη φάση $\phi$ · βάρος = κόστος νέας θέσης», με την DAG-εξ-ορισμού παρατήρηση («κάθε ακμή προχωράει αυστηρά τη φάση κατά ένα → "ακριβώς $m$ φάσεις" = "μονοπάτι $m$ ακμών" χωρίς εξτρά λογική») και την «$k$ βήματα / $m$ ημέρες / $p$ στάδια / όρια που αλλάζουν ανά βήμα» Σήμα-στην-εκφώνηση. Three distinct pattern flavors: (a) invariance under weight transform, (b) cost-language change via log, (c) graph-structure change via layered DAG. Two minimal Greek interstitial sentences bridge the chips («Πριν φτάσουμε στους αλγορίθμους, η εξέταση αγαπά μια προαπαιτούμενη ερώτηση…», «Η ίδια λογική του μετασχηματισμού έχει και θετική όψη…», «Και μια εντελώς διαφορετική στρατηγική για τα πολυφασικά προβλήματα…»). All bottom surfaces unchanged: the existing 9-item `<ExamRadar />` already lists all three chip targets under «Μετασχηματισμός βαρών (log/scale/shift)» (ask6, ask9), «Συντομότερο/μακρύτερο μονοπάτι σε DAG» (ask7, ask8, ask1), and «Στρωματικός γράφος για πολυφασικά προβλήματα» (ask7, ask1) — chip + radar are complementary surfaces per the L02/L03/L09/L14/L15/L01/L04/L06 precedent. Server component, zero client JS shipped — L08 bundle stays 158 B + 662 kB. typecheck+lint+build all pass. See [[phase-e1-L08-citations]])
    - ⏸ **L10, L11, L12, L13, L17 — PAUSED 2026-05-24** per user direction («quality-audit tasks are of more importance, so they should be earlier»). Resume via «E.1 (resumed)» below, after E.4.5 + E.4.6 close.
    - ☐ L05 ☐ L07 ☐ L16 — documented-and-skipped per Phase D precedent (sparse/empty pool)
- ☐ **E.4.5 — «Νιώσε»-visual audit & retrofit across the problem bank** (PROMOTED 2026-05-24 — takes precedence over remaining E.1 and everything below): one audit pass → produces chunked checklist → one chunk per turn:
  - ☑ **E.4.5.0 — audit pass** (done 2026-05-24 — walked all 120 transcribed entries; ~90 abstract/formal & out-of-scope, ~26 transcribed-scenarios that already open with the appropriate viz (the algorithmic viz IS the scenario picture — e.g. `CoinChangeLab`, `DutchFlagPartition`, `LamppostsMISViz`, `GasStationsGreedy`, `RestaurantSpacingDP`, `GridGreedyVsOpt`), **4 definite gaps + 2 borderlines** identified and queued in `plans/E_VISUAL_AUDIT.md`. The 4 definite gaps go into a single Chunk A (one turn): `pt1-th3` (αξιοθέατα + ταξί/πατίνι — interactive), `pt4-th2-a` (5 πόλεις + 8 δρόμοι + χειμώνας — static SVG), `pt4-th4` (φεστιβάλ + ad slots — static SVG, interactive defensible), `front-set-6-ask1` (ποδηλατική εκδρομή σε χάρτη + ημέρες — interactive). The 2 borderlines (`front-set-6-ask4` καθαριστήριο, `front-set-7-ask9` πάρτι Alice) go into an optional Chunk B where the existing Gantt/graph viz already covers most of the scenario; the chunk executor decides per-entry on second read. See [[phase-e45-visual-audit]].)
  - ☐ E.4.5.A — Chunk A: 4 definite-gap visuals (`pt1-th3`, `pt4-th2-a`, `pt4-th4`, `front-set-6-ask1`) — one turn
  - ☐ E.4.5.B — Chunk B re-audit (optional; only if executor confirms either of the 2 borderlines is a real gap)
- ☐ **E.4.6 — Generic edge-routing utility across all graph vizzes** (PROMOTED 2026-05-24 — takes precedence over remaining E.1 and everything below): utility + per-viz retrofit; one chunk per turn:
  - ☐ E.4.6.0 — implement `components/viz/edge-routing.ts` with collision-aware `routeEdge(a, b, nodes)` API; swap the temporary point-fix in `RiverCrossingStateGraph.tsx` (commit `e75b4cb`); produce the per-viz retrofit chunked queue (single turn)
  - chunks (groups of 3–5 vizzes sharing layout shape) filled in by E.4.6.0; one chunk per turn thereafter
- ☐ **E.1 (resumed) — L10, L11, L12, L13, L17 per-lecture inline citations** (un-pause after E.4.6 closes; same one-lecture-per-turn cadence as the completed L09…L08 chips)
- ☐ **E.2 — Pattern-pair catalogue** → `plans/E_PATTERN_PAIRS.md`
- ☐ **E.3 — `<RelatedPair>` + bidirectional surfacing** (per-lecture, depends on E.2):
  - filled in by E.2's output
- ☐ **E.4 — Algorithm prose + `keywords` + `nutshell` audit** (17 per-lecture sub-tasks):
  - ☐ L01 ☐ L02 ☐ L03 ☐ L04 ☐ L05 ☐ L06 ☐ L07 ☐ L08 ☐ L09
  - ☐ L10 ☐ L11 ☐ L12 ☐ L13 ☐ L14 ☐ L15 ☐ L16 ☐ L17
- ☐ **E.5 — Transcription completion** (~21 entries; per-paper turns):
  - filled in by pre-flight's enumeration
- ☐ **E.6 — Wire the SOSE flow** (2024/2025 priority, pattern pairs, keyword strips, «πρότυπα σκέψης» tab)
- ☐ **E.7 — Final integration sweep + PR description update**

---

## 2. The big picture

After [[site-wide-rollout]] (theory) and [[phase-d-problem-rework]] (problems)
closed, the K17 site teaches every lecture's concepts and every transcribed
problem to the standard. **What it still does not do well:**

1. **Surface specific past-exam problems INSIDE the lecture pages** — the
   `<ExamProblem>` MDX component is registered but never used inline. Students
   reading the L09 page should see «Αυτό ακριβώς εμφανίστηκε στο Ιούνιος 2024
   Θέμα 3» right next to the concept that explains it.
2. **Make exam ↔ frontistirio recognition reflexive.** The K17 exams almost
   always re-phrase a frontistirio problem in different domain language (the
   user's example: «τραπεζικές κάρτες» in a frontistirio → «αρχαίες πλάκες» in
   the exam, identical algorithm). Students who recognise the pair pass; those
   who don't, panic. The site must teach the pairing explicitly.
3. **Surface natural-language description and keyword-vocabulary as the
   primary deliverable per algorithm.** The course rewards a correct *description*
   of the algorithm — pseudocode is secondary and even discouraged by some
   examiners ("πιο safe να γράψεις σε φυσική γλώσσα"). The `<Algorithm>` and
   `<Pseudocode>` components are already designed this way, but **we need to
   audit every existing lecture page** and make sure the prose description is
   present, complete, and uses the keywords the student would write under
   exam pressure.
4. **Make sure the 2024/2025 papers are reachable from everywhere** — every
   lecture they touch, the SOSE flow, the practice hub. These are the highest-
   signal problems for the exam to recur in style.

The user's framing of the pseudocode/natural-language split (verbatim from
chat 2026-05-22):

> «Νομίζω τα φροντιστήρια είναι αυστηρά σε ψευδοκώδικα για να είναι πολύ
> ακριβές ο αλγόριθμος και πολλοί λανθασμένα νομίζουν ότι πρέπει να τα λύνουν
> έτσι και μετά με μικρά λάθη χάνουν βαθμό.
>
> Εγώ στο site θα έβαζα δύο εκδοχές, μια μόνο ψευδοκώδικα και μια φυσική
> γλώσσα. Φυσική γλώσσα θα το είχα ως το σημαντικότερο: να γνωρίζω πως να
> περιγράψω τον αλγόριθμο. Ψευδοκώδικα ως δευτερεύον και ευέλικτο.
>
> Επίσης είναι πολύ δύσκολο να μάθεις απέξω ακόμα και σε φυσική γλώσσα.
> Συνήθως αρκεί να μάθεις λέξεις-κλειδιά και να έχεις ξεκαθαρίσει κάποια
> βήματα στο μυαλό σου, ίσως το site μπορεί να βοηθάει και σε αυτό.
>
> Και υπάρχουν patterns στον τρόπο σκέψης που επίσης μπορεί κάποιος να μάθει,
> πέρα από την λύση του συγκεκριμένου προβλήματος αξίζει να αναφέρει το site
> και τέτοια πράγματα.»

This is binding. Apply it everywhere on the site.

---

## 3. Binding constraints

- **Read `~/.claude/projects/C--Users-alexg-algorithms-with-steliosrotas/memory/lecture-rework-standard.md` at the start of every session** — same standard, same expectations.
- **One task per turn, stop and show.** Same cadence as Phases A/B/C/D.
- **Don't invent exam problems.** Every cited problem must be a real entry in
  `content/practice/exercises.tsx`, or transcribed first as part of this
  phase under the rules of `plans/EXAM_TRANSCRIPTION.md`.
- **Anonymisation rule from `EXAM_TRANSCRIPTION.md` still applies** — use
  `paperLabel: 'Παλαιό Θέμα #N'`, never display the real exam date in the
  exercise-bank-driven UI. **But** for the lecture-page inline citations
  via `<ExamProblem year="…">`, dated exam papers are the established
  precedent — confirm with the user before scope changes.
- **No `npm run build` while `npm run dev` is running** (see [[local-build-env]]).
- **Push to `fork` remote, not origin** — see [[pr-workflow]]. The open PR
  #3 into `steliosrotas/algorithms-with-steliosrotas` tracks the branch.
- **Memory must be updated** after each task — extend `phase-e-*` memory
  files as the project artifact, and update `site-wide-rollout` with the
  status.

---

## 4. Pre-flight (mandatory before E.1 is executed)

**Do not start E.1 until this is done.** This is a single-turn task by itself.

### Pre-flight checklist

1. **Pull origin/main and inspect.** Has Stelios added any new exam content
   since 2026-05-22 (the PR #2 merge)? Specifically check:
   - `material/past_exams/` — new PDFs added?
   - `content/practice/exercises.tsx` — new transcribed entries beyond what's
     on `feat/site-wide-rollout`?
   - Any new MDX components for exam citation?

   ```
   git fetch origin main
   git log origin/main --oneline -20
   git diff origin/main..HEAD -- content/practice/exercises.tsx material/ | head -200
   ```

2. **Audit `<ExamProblem>` usage.** Grep for inline `<ExamProblem>` in every
   lecture MDX. Confirm the count is zero — and document, lecture-by-lecture,
   the natural places where it SHOULD appear.

3. **Audit the prose-vs-pseudocode balance.** For every existing `<Algorithm>`
   block on a lecture page, check whether the children include a real
   natural-language description before the `<Pseudocode>`, or whether
   pseudocode is doing all the work alone. Produce a per-lecture verdict
   (✓/✗) and the names of the algorithm blocks that need rewriting.

4. **Audit the SOSE flow.** Read `app/practice/sose-to-eksamino/page.tsx`,
   `lib/sose.ts`, `components/sose/SoseClient.tsx`. Document:
   - How is `SOSE_PATH` constructed? Difficulty ordering?
   - Are 2024/2025 problems prioritised in the path? Tagged in the UI?
   - Does the per-problem coaching (`SOSE_COACHING`) currently surface
     pattern-pairs?

5. **Confirm what's transcribed.** `content/practice/exercises.tsx` has 141
   entries, ~21 with `statement: null`. Generate a list of the 21
   untranscribed entries (id + paperLabel + the lecture(s) they target).
   This is the queue for E.5 (transcription completion).

**Output**: `plans/E_PREFLIGHT.md` — a written audit covering all 5 items.

### Pre-flight code change: ~~remove the per-card takedown notice~~ — DONE

The per-card render of `<ExamTranscriptionNotice />` was removed from
`ExerciseCard.tsx` on 2026-05-24 (out-of-band, ahead of pre-flight). The
component file in `components/content/ExamTranscriptionNotice.tsx` is left
in place for a possible future single-banner mount on `/practice`; nothing
renders it currently. The pre-flight audit only needs to **confirm** this
state and decide whether to (a) leave it as-is, (b) mount a single discreet
notice on the practice hub, or (c) delete the component file entirely.

**Commit message for pre-flight**: `docs(phase-e): preflight audit`.

---

## 4.5 Task E.0 — Bank de-anonymization migration

> **Lands before E.1.0** (the `<ExamProblem>` component extension). Surfaced
> by the pre-flight audit: the user authorised dropping the anonymization
> rule («no need to keep anything private from students», 2026-05-24).
> Single self-contained turn.

### Goal

Make `content/practice/exercises.tsx` (and every component that renders it)
display the real exam date for every transcribed problem. Drop the
`paperLabel: 'Παλαιό Θέμα #N'` pattern. Wire the existing
`RECENT_SOURCES`-based 2024/2025 «Θέμα Εξετάσεων» Flame chip — currently
dead code in production — to actually fire.

### Inputs

- The 141-entry transcribed bank in `content/practice/exercises.tsx`.
- The paperLabel-to-date mapping table in `plans/EXAM_TRANSCRIPTION.md`
  (lines 23-44 of the updated convention block):
  Παλαιό Θέμα #1 → `'june-2025'`, #2 → `'sept-2025'`, …, #23 → `'midterm-2008'`.
- The `ExamSource` enum in `content/practice/types.ts` — every needed
  source value is already defined.

### What to change

1. **`content/practice/exercises.tsx`** (141 entries; ~10 416 lines):
   - Replace `paperLabel: 'Παλαιό Θέμα #N'` with `source: '<dated source>'`
     per the mapping table.
   - Replace `paperLabel: 'Φροντιστηριακό Σετ #N'` with
     `source: 'frontistirio-2023-24'` (sets #1–#10) or
     `source: 'frontistirio-misc'` (sets #11–#13).
   - Update the section comment at line 217 («2024 / 2025 ΕΞΕΤΑΣΤΙΚΕΣ»)
     to remove the anonymized framing.
   - Update the title strings: `'Παλαιό Θέμα #N · Θέμα X — <τίτλος>'`
     becomes `'<Date> · Θέμα X — <τίτλος>'` (e.g.
     `'Ιούνιος 2024 · Θέμα 1.1 — Σύγκριση σταθερών συναρτήσεων'`).
     Use `SOURCE_LABELS[source]` from `types.ts` as the date prefix —
     authored values are «Ιούνιος 2024», «Σεπτέμβριος 2025», etc.
   - For the 21 still-untranscribed entries (`statement: null`): same
     migration. The title goes from `'Παλαιό Θέμα #N — υπό μεταγραφή'`
     to `'<Date> — υπό μεταγραφή'`.

2. **`content/practice/types.ts`**:
   - Mark `paperLabel?: string` on `Exercise` as deprecated (kept for back-
     compat but documented as «do not use»). OR drop it entirely — the
     E.0 turn confirms by checking that no component still reads it after
     the migration.
   - Audit `SOURCE_LABELS` for completeness — every value referenced by
     the new bank must have a label.

3. **`components/practice/ExerciseCard.tsx`**:
   - Currently renders `paperLabel` chip OR `source` chip (lines 82–91)
     — collapse to just the `source` chip + the existing `RECENT_SOURCES`
     Flame chip (lines 92–101), which now fires for #1–#7 entries
     automatically.

4. **`components/sose/SoseProblemCard.tsx`**:
   - Add the `RECENT_SOURCES`-based Flame chip (does not exist there yet
     — see pre-flight § 4). Will surface 2024/2025 problems with the
     same prominence the practice library has.

5. **`components/content/LectureExercises.tsx`**:
   - `RECENT_SOURCES.has(ex.source)` branch (line 31) is no longer dead
     code post-migration. No code change needed — the sort just starts
     working.
   - Optionally update the sub-header «Οι πρόσφατες εξεταστικές (2024/2025)
     φέρουν badge προτεραιότητας» to confirm it's accurate (it now is).

6. **`plans/EXAM_TRANSCRIPTION.md`**:
   - Already updated by the pre-flight commit (anonymization policy
     marked DROPPED, dated-source convention recorded). The per-paper
     checklist still uses the «Παλαιό Θέμα #N» labels for tracking —
     keep them as the checklist's internal numbering, but new
     transcriptions per the new convention.

### Acceptance

- `Grep('paperLabel:', content/practice/)` returns 0 hits.
- Every `Exercise` entry has a non-undefined `source`.
- The practice library shows the Flame «Θέμα Εξετάσεων 2024/2025» chip
  on entries #1–#7.
- `npm run typecheck` + `lint` + `build` all pass.
- `npm run dev` renders the practice library and SOSE without regressions
  (visual check on one rich-pool lecture's `LectureExercises` block).

### Commit message

`refactor(bank): drop anonymization; surface real exam dates everywhere`.

---

## 5. Tasks

Each task is a single session. After each, stop and show the user.

### Task E.1 — Build the `<ExamProblem>` inline citation pattern

**Goal.** Make every lecture page surface its associated past-exam problems
inline, at the exact moment the page first teaches the pattern that the
problem uses. This is the single most-asked-for-by-students surface and it
is currently empty.

**Inputs.**
- The 141-entry transcribed bank in `content/practice/exercises.tsx`.
- The 4 publicly-available 2024/2025 papers in `material/past_exams/`.
- The lecture pages in `app/(content)/lectures/L*/page.mdx`.
- The pre-flight audit (`plans/E_PREFLIGHT.md`).

**What to build.**
1. **Decide the inline-citation pattern.** Probably:
   - Extend `<ExamProblem>` (currently registered but unused) to render
     compact: «Θέμα Εξετάσεων Ιουνίου 2024 — Θ.3 [Δες την άσκηση →]» with
     deep-link to `/practice#exercise:<id>`. The full statement + solution
     stays in the practice bank; the lecture-page citation is a chip + a
     one-sentence «τι ρωτάει».
   - Add a `relatedExerciseId` prop so the citation is grounded in a real
     bank entry (not invented).
   - Add a `pattern` prop describing the recognition cue
     («αν δεις: ευθυγράμμιση συμβολοσειρών με σκορ +1/-1/-2 → ίδια DP, max
     αντί min»).
2. **Per lecture, decide WHERE the inline citations go.** Use the audit
   from E.1 of E_PREFLIGHT.md. For each lecture, identify 1–3 inline
   citations — placed at the natural «αυτό ακριβώς ζητείται» moment in
   the prose, not lumped at the bottom.
3. **Don't duplicate the end-of-page `<LectureExercises>` block.** That
   bottom block stays (it's the complete index). Inline citations are
   SELECTIVE — they highlight the canonical pattern instance.

**Per-lecture cadence.** L01 → L17, one lecture per turn. Same rhythm as
Phases A/B/C/D.

**Acceptance.** Each lecture page has at least one inline `<ExamProblem>`
citation in its natural body, deep-linking to a real bank entry, AND the
component renders cleanly in both light + dark mode + on mobile.

**Estimated work.** 17 turns (one per lecture). 1 component extension
(`<ExamProblem>` properly built). ~40 inline citations total (~2.5 per
lecture average).

**Commit message template**: `feat(L{NN}-inline-citations): inline ExamProblem citations at the natural pattern moments`.

---

### Task E.2 — Pattern discovery: exam ↔ frontistirio pairs

**Goal.** Systematically identify pairs «same algorithm, different phrasing»
between transcribed past-exam problems and transcribed frontistiria. The user
gave the canonical example: «τραπεζικές κάρτες» frontistirio ⇔ «αρχαίες
πλάκες» exam — identical algorithm under different domain costume. Find every
such pair in the bank, name the underlying pattern, and surface both ways.

**Inputs.**
- Every `'past-exam'` entry in `content/practice/exercises.tsx`.
- Every `'frontistirio'` entry in `content/practice/exercises.tsx`.

**Process.**
1. **Catalogue.** For each transcribed problem, write one line: «id ·
   algorithm-fingerprint · domain». Algorithm fingerprint = «greedy interval
   scheduling by EF», «WIS», «D&C majority element», «BF neg-cycle detect»,
   «hash-table meet-in-the-middle», etc. Domain = the cover story (bank
   cards, ancient tablets, taxi rides, ad slots, lampposts, etc.).
2. **Group by fingerprint.** Anything with ≥ 2 problems on the same
   fingerprint where the cover stories differ is a candidate pair.
3. **For each pair, write the «recognition cue»** — what feature of the
   wording maps the exam problem to the frontistirio template. E.g.
   «σταθερή διάρκεια αντικειμένου + προθεσμία = WIS, ανεξάρτητα από το
   όνομα του αντικειμένου».
4. **Score confidence.** «definite» (truly the same algorithm, just renamed)
   vs «strong analogy» (same algorithm with one parameter changed) vs
   «weak» (overlapping technique, different shape).

**Output.** `plans/E_PATTERN_PAIRS.md` — a written catalogue of pairs with:
- pattern fingerprint name
- list of problem IDs in the pair
- recognition cue
- confidence
- which lecture's ExamRadar should mention this pattern

**No code changes in this task.** It is research + a document.

**Acceptance.** A document the user can scan and either accept or correct.
Realistic estimate: 12–25 pairs (the bank has ~120 transcribed problems
across 17 lectures; the user said "almost every exam has at least one
such pair", so per-exam ≥ 4 papers × 1+ pairs = 8–10 minimum).

**Commit message**: `docs(phase-e): catalogue of exam ↔ frontistirio pattern pairs`.

---

### Task E.3 — Build the `<RelatedPair>` component + retrofit every pair from E.2

**Goal.** Surface every pair from E.2 in BOTH directions, inside the
solution of both problems.

**What to build.**
1. **`<RelatedPair>` component.** Renders an emphasized block:
   - «Ίδια άσκηση, άλλο όνομα» banner
   - one-sentence pattern name
   - the paired problem's title + deep-link
   - the recognition cue («αν δεις X στην εκφώνηση, σκέψου Y»)
   - styled distinctly from a regular Callout so the student notices it
2. **Embed in every problem of every pair.** Both ways — the exam solution
   says «αυτό είναι ισόμορφο με {frontistirio-id}», AND the frontistirio
   solution says «εμφανίστηκε σε εξέταση ως {exam-id}».
3. **Extend per-lecture `<ExamRadar>`** with a new item for each recurring
   pattern surfaced this way (high-likelihood note).

**Per-lecture cadence.** Same. L01 → L17, one lecture per turn — but only
the lectures that have at least one pair. The plan file from E.2 enumerates
which lectures qualify.

**Acceptance.** Every pair is bidirectionally surfaced; ExamRadar items
exist for the recurring patterns; deep links work; production build is
green.

**Commit message template**: `feat(L{NN}-pairs): surface exam ↔ frontistirio pattern pairs in both directions`.

---

### Task E.4 — Audit & enrich the Algorithm natural-language descriptions

**Goal.** Make sure every `<Algorithm>` block on every lecture page has:
1. A complete natural-language description as its primary content (children
   before `<Pseudocode>`), written so a student under exam pressure can
   reconstruct the algorithm in their own words.
2. A `keywords` strip — the «λέξεις-κλειδιά» the user said are the load-
   bearing thing. Currently `RecallCard` has a `keywords` field; we need a
   parallel «exam-vocabulary chip strip» on the Algorithm block itself.
3. A «short version» — 3 sentences max — that the student can memorize.

**What to build.**
1. **Extend `<Algorithm>`** to take an optional `keywords?: string[]` prop
   (already on RecallCard) and an optional `nutshell?: ReactNode` prop
   (the 3-sentence memorizable version). Render both prominently.
2. **Audit every existing Algorithm block site-wide.** For each:
   - If the prose description is thin → rewrite it.
   - If the keywords are missing → author them.
   - If a nutshell is missing → write one.
3. **Pseudocode stays collapsed-by-default** (already the case). No regression.

**Cadence.** L01 → L17, one lecture per turn. The pre-flight audit
already produced the per-lecture verdict; use it.

**Acceptance per lecture.** Every Algorithm block on the page renders with
prose-first, keywords-strip, nutshell, and (collapsed) pseudocode. Reading
just the prose + keywords + nutshell should be enough to reconstruct the
algorithm in natural language.

**Commit message template**: `feat(L{NN}-algo-prose): keywords + nutshell + natural-language description audit`.

---

### Task E.4.5 — «Νιώσε»-visual audit & retrofit across the problem bank

**Why this task exists.** Comment `422258f8` (2026-05-24, on
`front-set-7-ask2`) caught a systemic gap: a problem describing a
concrete physical scenario (the river-crossing puzzle with wolf / goat /
cabbage) jumped straight from prose to abstract state-graph modeling
without first establishing the «Νιώσε» picture per
[[lecture-rework-standard]]. The fix on `front-set-7-ask2` (commit
`fb91716`) was a one-off; this task ensures every analogous entry in
the bank gets the same treatment, and that we **never repeat the
mistake** — corner-cutting on the «Νιώσε» surface is a regression of
the quality bar.

**The binding standard going forward.** Every transcribed problem
whose statement describes a **concrete scenario** — a physical setup, a
real-world process, a labeled graph with a narrative, a multi-character
puzzle, a geographic or spatial arrangement — must open its solution
with a **good-quality illustrative anchor** that depicts the scenario
**as described**, before any abstract modeling. This is the «Νιώσε»
stage of the 5-stage learning loop, applied to problem solutions. The
visual:

- Is **good quality, not minimum-viable**. The polish bar is the same
  as the lecture pages per [[lecture-rework-standard]]: «cost is not a
  consideration; the goal is the concept clicking in a struggling
  student's brain, not just having the image on the page». No shortcuts.
- **Static SVG when** the scenario is fully captured in one snapshot —
  e.g. a starting configuration the student needs to visualise once
  (the `front-set-7-ask2` river-crossing initial state is this kind).
- **Interactive when** the scenario itself carries motion, state
  changes, or invites exploration — a steppable transition, a slider
  over a parameter, a configurable variable that the reader operates
  to feel the concept. The static-vs-interactive choice is made
  **per-problem** during retrofit; default-static is **wrong** when the
  concept clicks better in motion. Build a fresh interactive component
  in `components/viz/` when needed; don't downgrade to a static SVG
  just because it's smaller. Cutting an interactive into a static
  snapshot when motion is the teaching surface is the exact corner-cut
  this task exists to prevent.
- Sits at the **top of the solution fragment**, preceded by a one-line
  Greek bridge (e.g. «Πριν τη μοντελοποίηση, δες την εικόνα του γρίφου …»).
- Uses **semantic color tokens** (`rgb(var(--fg))`, `rgb(var(--bg-elevated))`,
  etc.) so dark mode is safe by construction.
- Carries a caption that ties the picture back to the conflict rules /
  context cues the prose will then formalise.
- For **static SVGs**, reuses the `front-set-7-ask2` precedent (commit
  `fb91716`) as the reference shape. For **interactives**, follows the
  bespoke-viz precedents in `components/viz/` (`RiverCrossingStateGraph`,
  `WeightedIntervalDP`, `BipartiteChecker`, etc.) — single-purpose
  component, step/slider controls where the algorithm has phases or
  parameters, accessible affordances (`<button>` not `<div onClick>`),
  dark-mode-safe by construction via semantic tokens, mobile-tested.

Applies to new transcriptions (E.5) and any future problem-bank work.

**E.4.5.0 — Audit pass (one turn).** Walk every `Exercise` entry in
`content/practice/exercises.tsx`. For each, ask:

1. Does the **statement** describe a concrete scenario (physical
   setup, real-world process, labeled narrative graph, multi-character
   puzzle, geographic/spatial arrangement)?
2. If yes-to-1: does the **solution** open with a visual that depicts
   the scenario **as described**, before abstract modeling?
3. If yes-to-1 and no-to-2 → the entry is a **gap**.

**Don't flag:** abstract / formal problems (e.g. «δείξε ότι
$T(n) = 2T(n/2) + n$ είναι $O(n \log n)$»), problems whose existing
viz already depicts the scenario before the abstraction, or problems
whose statement is already self-illustrative because it provides
its own diagram.

**Output**: `plans/E_VISUAL_AUDIT.md` — one row per gap:
- `id`
- one-line scenario type (e.g. «state-graph puzzle», «weighted graph
  with named cities», «layered DAG with phases»)
- suggested visual sketch (e.g. «two banks + 4 characters + boat», «5
  cities with edges + weights», «3 phases × 4 cities layered»)
- chunk assignment

**Chunk design.** Group gaps into **chunks of 3–5 entries** that share
context — same lecture, similar visual shape (e.g. all state-graph
puzzles together, all weighted-narrative-graphs together). Each chunk
= one turn. Realistic estimate: the bank has 141 transcribed entries;
expect 8–20 gaps total, i.e. 2–5 chunks.

Commit message for the audit: `docs(phase-e): Νιώσε-visual audit across the problem bank`.

**E.4.5.N — Per-chunk retrofit (one turn each).** For each chunk:

- Read each entry's statement carefully and verify the gap (the audit
  identifies candidates, but the executor confirms).
- **Decide static vs interactive per-problem** (per the binding
  standard above). Ask: «does this scenario click better as one
  snapshot, or in motion/state?» — and *answer honestly*. If the
  scenario is dynamic, build the interactive; do not justify a static
  SVG by «it's faster». The audit's «suggested visual» field is a
  starting hint, not a binding decision — the chunk executor can
  upgrade a suggested static to an interactive when the concept
  warrants it.
- **Author the visual at the lecture-page quality bar.**
  - **Static SVG path** (when one snapshot suffices): follow the
    `front-set-7-ask2` precedent (commit `fb91716`) — inline SVG inside
    a `<div className="not-prose my-4 flex justify-center">` wrapper,
    with `viewBox`, `max-w-xl rounded-lg border border-border
    bg-bg-elevated`, fills via `rgb(var(--token))`, ARIA-labeled.
    Polish: clear labels, conflict-rule caption, spatial composition
    that *teaches* (not just decorates).
  - **Interactive viz path** (when the scenario carries motion / state
    / exploration): build a fresh single-purpose component in
    `components/viz/`, following the existing bespoke-viz precedents
    (e.g. `RiverCrossingStateGraph`, `WeightedIntervalDP`,
    `BipartiteChecker`). Step/slider controls where the algorithm has
    phases or parameters; accessible affordances (`<button>` not
    `<div onClick>`); dark-mode-safe by construction via semantic
    tokens; mobile-tested. Register in `mdx-components.tsx` (or import
    directly into `exercises.tsx` if scoped to one entry) and mount
    via JSX in the solution. Adopt `routeEdge()` from E.4.6 the moment
    it lands.
- Place at the **top of the solution fragment**, preceded by a one-line
  Greek bridge.
- Keep the rest of the solution unchanged unless the visual makes a
  prose paragraph redundant (in which case trim, don't expand).
- `npm run typecheck` + `lint` + `build` per chunk; spot-test the new
  viz in light + dark + mobile widths.

**Cadence.** Same stop-and-show rhythm as Phases A/B/C/D. One audit
turn + N chunk-fix turns.

**Acceptance.** Every flagged entry has its «Νιώσε» visual landed.
After the last chunk, re-run the audit method on a random sample of 5
entries to confirm zero false negatives. Update [[lecture-rework-standard]]
or write a dedicated memory file recording the standard as part of the
final chunk's commit.

**Commit message template (per chunk)**:
`feat(visuals-{chunk-label}): Νιώσε-visual retrofit for {N} bank entries`.

---

### Task E.4.6 — Generic edge-routing utility across all graph vizzes

**Why this task exists.** Commit `e75b4cb` fixed a real visual bug in
`RiverCrossingStateGraph`: the long horizontal edge `{C} ↔ {B,C,G}` ran
through the middle of the `{B,G}` rectangle (and the mirrored case
`{W} ↔ {B,G,W}` through `{C,W}`); because nodes render after edges,
the rect occluded the middle of the line and the visual read as «two
edges meeting at `{B,G}`», misleading the reader into seeing an edge
that doesn't exist in the actual state graph. The fix was a hand-
targeted point-fix for those two specific edges — a **hack**. The
codebase has 20+ graph-drawing vizzes in `components/viz/`; the same
class of bug can exist in any of them, in subtly different shapes
(near-horizontal edges, diagonals that graze a node, edges that span
many columns). Per the «never repeat the same mistake» quality bar,
ship a structural fix that removes the entire class of bug across the
whole site — and retire the `RCSG` point-fix in the same step.

**The standard going forward.** Every graph viz that renders edges
between rectangular nodes uses a shared `routeEdge()` utility that
runs a collision test against non-endpoint nodes and returns a curved
Bezier when an edge would otherwise pass through (or graze) an
unrelated node. The «edge passes through unrelated node» bug becomes
**structurally impossible** — the check runs by construction on every
edge of every viz. New vizzes adopt the utility from the start.

**Honest limits.** The utility addresses the *geometric* edge-through-
node case only. It does NOT catch overlapping edges, ambiguous
arrowheads, label collisions, or other visual ambiguities. For
defence-in-depth against arbitrary visual regressions, the longer-term
follow-up is Playwright snapshot tests of every viz — out of scope for
Phase E, but recorded here as a future consideration once `routeEdge`
is in place and the cost of snapshot infrastructure becomes justified
by a second class of visual bug surfacing.

**E.4.6.0 — Build the utility + retire the point-fix + scope the
retrofit (one turn).**

Implement `components/viz/edge-routing.ts` exposing:

```ts
type NodeRect = { x: number; y: number; w: number; h: number; id: string | number }
type EdgeGeom =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { kind: 'curve'; d: string }

function routeEdge(
  a: NodeRect,
  b: NodeRect,
  allNodes: ReadonlyArray<NodeRect>,
  options?: { padding?: number; minBulge?: number },
): EdgeGeom
```

Algorithm:
1. Compute the straight segment between the endpoints (centre-to-centre,
   or boundary-to-boundary if the endpoints are circles — option flag).
2. For each `n ∈ allNodes` with `n.id !== a.id && n.id !== b.id`, run a
   standard segment-vs-AABB test with `padding` margin (default 4 px).
3. If no node intersects, return `{ kind: 'line', ... }`.
4. If at least one node intersects, compute the quadratic-Bezier control
   point that curves the path away from the *nearest* colliding rect.
   Direction: perpendicular to the segment, on the opposite side of the
   colliding centre from the segment midpoint. Offset magnitude: enough
   to clear the colliding rect's bounding circle plus padding (typically
   `r + 24` px), or `options.minBulge` if larger.
5. Verify post-curve that the Bezier does not itself collide; if it
   does (extreme cases), increase the bulge magnitude and retry. Hard
   cap retries at 3 to avoid runaway in degenerate inputs.
6. Return `{ kind: 'curve', d: 'M ax ay Q cx cy bx by' }`.

Swap the temporary point-fix in `RiverCrossingStateGraph.tsx` (commit
`e75b4cb`) for a call to `routeEdge`. Add at least two co-located
sanity tests in `components/viz/edge-routing.test.ts` — one straight,
one collision — driven by `vitest` or the existing test harness (check
which is configured; add it if neither is). Run `typecheck` + `lint`
+ `build`. The point-fix block in `RCSG.tsx` is **gone** at the end
of this turn — not refactored, deleted.

Produce a per-viz audit table in this commit's message body (or in a
fresh `plans/E_EDGE_ROUTING_AUDIT.md` if longer than ~20 lines):
which vizzes draw edges between rect-or-circle nodes, what edge
primitive each uses today (`<line>`, `<path>`, custom), and which
retrofit chunk each belongs to.

Commit message: `feat(viz/edge-routing): collision-aware edge routing utility; retire RCSG point-fix`.

**E.4.6.N — Per-chunk viz retrofit (one turn each).**

Group the audited vizzes into chunks of 3–5 that share layout shape —
e.g. all MST-graph-based vizzes (`PrimAnimator`, `KruskalAnimator`,
`ReverseDeleteAnimator`, `CycleCutLemmaViz`, etc.) in one chunk; all
BFS/DFS-tree-based in another; standalone custom layouts in their own
chunks. Each chunk = one turn.

For each chunk:
- For each viz, replace the hand-rolled edge `<line>` / `<path>`
  rendering with a call to `routeEdge()`. Adopt the `NodeRect` shape
  locally if the viz has a different internal type.
- Run the viz in light + dark + mobile; confirm that the «curve only
  when collision» rule means most existing layouts produce **unchanged**
  rendering. Any straight line that becomes a curve is either fixing a
  latent bug (good) or a false positive (rare — file a follow-up).
- `typecheck` + `lint` + `build` per chunk.

**Cadence.** Same stop-and-show rhythm as Phases A/B/C/D. E.4.6.0 +
N chunk-fix turns.

**Acceptance.** Every graph viz uses `routeEdge()`. The two formerly
hand-curved edges in `RiverCrossingStateGraph` still render as
visibly bent arcs, but now produced by the same generic utility that
also covers every other viz. Spot-check 3 random vizzes by adding a
synthetic «edge through an unrelated node» case in a local test
fixture and confirming the utility curves it.

**Commit message template (per chunk)**:
`refactor(viz-{chunk-label}): adopt routeEdge() in {N} graph vizzes`.

---

### Task E.5 — Finish the transcription queue

**Goal.** Bring the 21 untranscribed (`statement: null`) entries up to the
Phase D bar. Without this, parts of the bank are dead-link entries that
just route to the source PDF.

**Inputs.**
- The 21-entry list from `E_PREFLIGHT.md`.
- `private_material/oldtests/` and `private_material/inclass/` (the raw
  source PDFs/images — git-ignored, must be present locally).
- The transcription protocol in `plans/EXAM_TRANSCRIPTION.md`.

**Per-paper cadence.** One paper per turn (a paper may transcribe to
multiple `Exercise` entries). Apply Phase D's full bar to each new entry
as it's transcribed: visuals, thinking-pattern callout, SOSE coaching,
ExamRadar link.

**Acceptance.** Every `statement: null` entry has been replaced with a
real transcribed JSX statement + solution + visualization (Phase D
treatment) OR explicitly documented-and-skipped (per the L05/L07 empty
precedent — only if the entry's content genuinely lives elsewhere).

**Commit message template**: `feat(transcribe-{paperLabel-slug}): transcription + Phase D treatment`.

---

### Task E.6 — Wire the SOSE flow to surface 2024/2025 + pattern pairs

**Goal.** «Σώσε το εξάμηνο» should aggressively prioritise:
1. **2024/2025 papers** — these are the most recent, most likely to recur
   in style.
2. **Pattern-pair signals.** When the user is on a problem that has a
   pair from E.2, the SOSE coaching panel surfaces «αυτό εμφανίστηκε σε
   εξέταση ως X» live.
3. **Keyword vocabulary.** When stuck on a problem, the keywords strip
   from the relevant Algorithm becomes available as a hint.

**What to build / audit.**
1. **Re-check `lib/sose.ts` path-construction logic** — does it already
   surface 2024/2025? If not, weight them.
2. **Extend the SOSE coaching panel** to render `<RelatedPair>` and the
   Algorithm `keywords` strip when the current problem qualifies.
3. **Add a «πρότυπα σκέψης» tab** to the SOSE flow that catalogues every
   pattern from E.2 — the student can browse «what 12 recurring patterns
   should I know cold for the exam».

**Acceptance.** Walking through SOSE for one session, the student
encounters:
- 2024/2025-tagged problems early.
- Pattern-pair hints when relevant.
- Keyword strips on demand.
- A pattern catalogue accessible from the page.

**Commit message**: `feat(sose): surface 2024/2025 + pattern pairs + keyword strips`.

---

### Task E.7 — Final integration pass & release notes

**Goal.** One sweep that verifies the cross-surface integration is coherent.

**Checklist.**
- Every inline `<ExamProblem>` deep-links to a real bank entry.
- Every `<RelatedPair>` links both ways.
- Every Algorithm block has prose + keywords + nutshell.
- The 21 transcription gaps are closed.
- The SOSE flow exposes 2024/2025 + patterns + keywords.
- `npm run typecheck`, `npm run lint`, `npm run build` all pass.
- The open PR #3 description is updated (or PR #4 is opened) to summarise
  Phase E.

**Output**: a commit `feat(phase-e): integration pass + memory update` +
the PR description rewrite. Update both `[[site-wide-rollout]]` and
`[[phase-d-problem-rework]]` memory files; create `[[phase-e-exam-integration]]`
if the work warrants its own memory record.

---

## 6. Components likely to be built or extended

In rough order of when they're needed:

| Component | Status | Phase E work |
|---|---|---|
| `<ExamProblem>` | Registered, never used | Extend with `relatedExerciseId`, `pattern`, deep-link; build per-lecture inline use |
| `<RelatedPair>` | NEW | Build in E.3 |
| `<Algorithm>` | Built, in use | Extend with `keywords?`, `nutshell?`; per-lecture audit in E.4 |
| `<Pseudocode>` | Built, in use | No change — collapsed-by-default already matches the philosophy |
| `SOSE_COACHING` entries | Populated for ~100 problems | Per-pair entries added in E.3; pattern-name field added |
| `lib/sose.ts` | Built | Reweight 2024/2025; add pattern-catalogue; expose keywords |

---

## 7. Common per-task mechanics

Same as Phase D:
1. Pre-flight: read [[lecture-rework-standard]] from memory; read this file.
2. For lecture passes: `pdftotext`/`pdfinfo` on a temp ASCII copy of the PDF
   if any prose is being rewritten; cite real material only.
3. `npm run typecheck` + `lint` + `build` before commit.
4. Commit per task. Push to `fork` remote. The open PR #3 auto-updates.
5. Stop and show the user.
6. Update the memory file.

---

## 8. Acceptance criteria for "Phase E complete"

- Every lecture page has at least one inline `<ExamProblem>` citation at a
  natural body location, NOT lumped at the end.
- Every documented pair from E.2 surfaces bidirectionally on both problems.
- Every Algorithm block has prose-first, keywords, nutshell, and collapsed
  pseudocode.
- Zero `statement: null` entries remain (or each is explicitly
  documented-and-skipped per the L05/L07 precedent).
- The SOSE flow exposes 2024/2025, pattern pairs, and keyword strips.
- The integration commit lands cleanly; build is green; PR description
  is up to date.

---

## 9. Things NOT in scope

- No new lecture material. The 17 lecture pages are closed; Phase E only
  ADDS inline citations and `keywords`/`nutshell` props, never rewrites the
  pedagogical body.
- No new visualizations of algorithms. Phase E surfaces and connects;
  vizzes belong to phases A–D and Phase D for problems.
- No infrastructure refactor (auth, supabase, comments). Leave alone.
- Reference page redesign (`/formulas`) — the SP_HANDOFF discussion flagged
  it as «looked into more», but that's an SP-side question. For K17, the
  current `/formulas` skeleton stays unless the user requests otherwise
  during E.7.
