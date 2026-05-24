'use client'

/**
 * AsymptoticVerdictExplorer — the «κύκλωσε ποια ισχύουν» answer machine.
 *
 * Used in every L02 problem that asks the student to circle which of
 * O / o / Ω / ω / Θ hold for a given (f, g) pair. The viz turns the
 * tabular "verdict" into something the student can SEE happen:
 *
 *  - A log-log plot overlays f and g across the preset's n range.
 *  - A ratio panel shows f/g over the same range — the very thing
 *    that decides every symbol.
 *  - Five verdict chips light up green ✓ / red ✗. Each carries the
 *    one-line criterion as a tooltip-style WHY below, so the student
 *    learns the RULE, not just the answer.
 *  - A simplification banner explains any algebraic reduction the
 *    problem hides (e.g. 2^{log n} = n, log_n n = 1, g(n) = log(√log n)
 *    = Θ(log log n) ...).
 *
 * The preset bank is the spine: each L02 problem points at one preset
 * by id. A `param-slider` mode handles parametric pairs (n^{1+tan φ}
 * vs n²) by recomputing verdicts as the slider moves — the student
 * literally watches the verdicts FLIP as the exponent crosses 2.
 *
 * Built for L02 Phase D.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type ChipKey = 'O' | 'o' | 'Omega' | 'omega' | 'Theta'

type Verdict = {
  /** Whether the relation holds. */
  holds: boolean
  /** Short one-line reason (the criterion or why it fails). */
  reason: string
}

type Verdicts = Record<ChipKey, Verdict>

type PlotMode = 'log-log' | 'log-of-log'

type StandardPreset = {
  id: string
  mode: 'standard'
  fLabel: string
  gLabel: string
  f: (n: number) => number
  g: (n: number) => number
  nMin: number
  nMax: number
  plotMode?: PlotMode
  limitDescription: string
  simplification?: string
  verdicts: Verdicts
  takeaway: string
}

type ParamPreset = {
  id: string
  mode: 'param-slider'
  fLabel: string
  gLabel: string
  paramLabel: string
  paramMin: number
  paramMax: number
  paramStep: number
  paramInit: number
  f: (n: number, p: number) => number
  g: (n: number, p: number) => number
  /** Pretty-print the parameter value (e.g. show φ=π/2). */
  paramDisplay?: (p: number) => string
  /** Compute verdicts and a description from the current parameter. */
  resolve: (p: number) => {
    verdicts: Verdicts
    limitDescription: string
    note?: string
  }
  nMin: number
  nMax: number
  plotMode?: PlotMode
  simplification?: string
  takeaway: string
}

export type AsymptoticPreset = StandardPreset | ParamPreset

/**
 * Curated preset bank — one entry per L02 problem (or sub-question) that
 * uses this viz. The id is referenced from `content/practice/exercises.tsx`.
 */
export const ASYMPTOTIC_PRESETS: Record<string, AsymptoticPreset> = {
  /* L02 — pt1-th1-q1: log_n n = 1 vs g = 4 (two positive constants) */
  'pt1-th1-q1': {
    id: 'pt1-th1-q1',
    mode: 'standard',
    fLabel: 'log_n n',
    gLabel: '4',
    f: () => 1,
    g: () => 4,
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim f/g = 1/4 (πεπερασμένη θετική σταθερά)',
    simplification: 'log_n n = 1 για κάθε n>1 — η f είναι σταθερή. Δύο σταθερές → ίδια τάξη.',
    verdicts: {
      O: { holds: true, reason: '1 ≤ 1·4 για κάθε n>1 — c=1 δουλεύει' },
      Omega: { holds: true, reason: '1 ≥ ¼·4 για κάθε n>1 — c=¼ δουλεύει' },
      Theta: { holds: true, reason: 'και O και Ω → ίδια τάξη μεγέθους' },
      o: { holds: false, reason: 'το αυστηρά «κάθε c» αποτυγχάνει: για c=⅛ ισχύει 1 ≥ ⅛·4 = ½' },
      omega: { holds: false, reason: 'συμμετρικά: ο λόγος δεν φεύγει στο ∞, μένει 1/4' },
    },
    takeaway: 'Δύο θετικές σταθερές: O, Ω, Θ ισχύουν· o, ω αποκλείονται.',
  },

  /* L02 — pt1-th1-q2: f = n vs g = n^{log n} (poly vs super-poly) */
  'pt1-th1-q2': {
    id: 'pt1-th1-q2',
    mode: 'standard',
    fLabel: 'n',
    gLabel: 'n^{log₂ n}',
    f: (n) => n,
    g: (n) => Math.pow(n, Math.log2(n)),
    nMin: 2,
    nMax: 64,
    limitDescription: 'lim f/g = lim n / n^{log n} → 0',
    simplification: '2^{log₂ n} = n (πολυωνυμικό). n^{log₂ n} = υπερ-πολυωνυμικό — ο εκθέτης μεγαλώνει.',
    verdicts: {
      O: { holds: true, reason: 'f φράσσεται από κάτω από g — άρα c=1 δουλεύει' },
      o: { holds: true, reason: 'ο λόγος f/g → 0 («αυστηρά μικρότερη»)' },
      Omega: { holds: false, reason: 'η g τρέχει πιο γρήγορα — κανένα σταθερό c·g δεν φράσσει την f από κάτω τελικά' },
      omega: { holds: false, reason: 'για ω χρειάζεσαι λόγο f/g → ∞ — εδώ ισχύει το αντίθετο' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: 'Πρώτα απλοποιείς (2^{log n}=n)· μετά εφαρμόζεις την ιεραρχία.',
  },

  /* L02 — pt1-th1-q3: parametric — f = n^{1 + tan φ} vs g = n² */
  'pt1-th1-q3': {
    id: 'pt1-th1-q3',
    mode: 'param-slider',
    fLabel: 'n^{1 + tan φ}',
    gLabel: 'n²',
    paramLabel: 'φ (rad)',
    paramMin: 0,
    paramMax: 2 * Math.PI,
    paramStep: Math.PI / 24,
    paramInit: Math.PI / 8,
    f: (n, p) => Math.pow(n, 1 + Math.tan(p)),
    g: (n) => n * n,
    paramDisplay: (p) => `${(p / Math.PI).toFixed(2)}π  (εκθέτης ≈ ${(1 + Math.tan(p)).toFixed(2)})`,
    resolve: (p) => {
      const exp = 1 + Math.tan(p)
      // Clamp pathological tan(π/2±ε) to ±100 for stability of the resolve.
      const e = Math.max(-100, Math.min(100, exp))
      const EPS = 0.02
      if (e < 2 - EPS) {
        return {
          verdicts: {
            O: { holds: true, reason: `f = n^${e.toFixed(2)}, εκθέτης < 2 → f ≤ g τελικά` },
            o: { holds: true, reason: 'αυστηρά μικρότερος εκθέτης → λόγος → 0' },
            Omega: { holds: false, reason: 'ο εκθέτης είναι αυστηρά μικρότερος του 2' },
            omega: { holds: false, reason: 'συμμετρικά' },
            Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
          },
          limitDescription: `lim f/g = lim n^{${(e - 2).toFixed(2)}} → 0`,
          note: `Για αυτή τη φ, ο εκθέτης ${e.toFixed(2)} < 2: η f είναι αυστηρά αργότερη.`,
        }
      }
      if (e > 2 + EPS) {
        return {
          verdicts: {
            O: { holds: false, reason: `εκθέτης ${e.toFixed(2)} > 2: f μεγαλώνει πιο γρήγορα` },
            o: { holds: false, reason: 'συμμετρικά' },
            Omega: { holds: true, reason: 'f ≥ g τελικά' },
            omega: { holds: true, reason: 'λόγος f/g → ∞' },
            Theta: { holds: false, reason: 'το ω αποκλείει το Θ' },
          },
          limitDescription: `lim f/g = lim n^{${(e - 2).toFixed(2)}} → ∞`,
          note: `Για αυτή τη φ, ο εκθέτης ${e.toFixed(2)} > 2: η f είναι αυστηρά γρηγορότερη.`,
        }
      }
      return {
        verdicts: {
          O: { holds: true, reason: `f ≈ n² → c=1 δουλεύει` },
          o: { holds: false, reason: 'ο λόγος μένει σε σταθερά, δεν πέφτει στο 0' },
          Omega: { holds: true, reason: 'συμμετρικά για το κάτω φράγμα' },
          omega: { holds: false, reason: 'ο λόγος δεν φεύγει στο ∞' },
          Theta: { holds: true, reason: 'O και Ω → ίδια τάξη' },
        },
        limitDescription: `lim f/g ≈ 1 (εκθέτης ${e.toFixed(2)} ≈ 2)`,
        note: 'Στο οριακό σημείο f ≈ g — αλλά η εκφώνηση δεν εγγυάται αυτή τη φ!',
      }
    },
    nMin: 2,
    nMax: 200,
    simplification: 'Ο εκθέτης 1 + tan φ διατρέχει όλο το ℝ καθώς το φ διατρέχει το [0, 2π]. Σύρε τον και δες τα verdicts να αλλάζουν.',
    takeaway: 'Άγνωστος εκθέτης → καμία σχέση δεν ισχύει σίγουρα. Σωστή απάντηση: μη-συγκρίσιμες.',
  },

  /* L02 — pt2-th1-q1: f = Σi² = Θ(n³) vs g = n² log n */
  'pt2-th1-q1': {
    id: 'pt2-th1-q1',
    mode: 'standard',
    fLabel: 'Σ_{i=1}^n i²  (= n(n+1)(2n+1)/6)',
    gLabel: 'n² log₂ n',
    f: (n) => (n * (n + 1) * (2 * n + 1)) / 6,
    g: (n) => n * n * Math.log2(Math.max(2, n)),
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim f/g = lim n / log n → ∞',
    simplification: 'Το άθροισμα κλείνει σε n(n+1)(2n+1)/6 = Θ(n³). Συγκρίνεις n³ με n² log n → n/log n → ∞.',
    verdicts: {
      O: { holds: false, reason: 'η f τρέχει αυστηρά πιο γρήγορα από την g' },
      o: { holds: false, reason: 'συμμετρικά' },
      Omega: { holds: true, reason: 'για c=1, n³ ≥ n² log n από n=2 και μετά' },
      omega: { holds: true, reason: 'ο λόγος f/g → ∞' },
      Theta: { holds: false, reason: 'το ω αποκλείει το Θ' },
    },
    takeaway: 'Κλείσε το άθροισμα πρώτα (Θ(n³))· μετά συγκρίνεις τάξεις.',
  },

  /* L02 — pt2-th1-q2: f = H_n = Θ(log n) vs g = log(√log n) = Θ(log log n) */
  'pt2-th1-q2': {
    id: 'pt2-th1-q2',
    mode: 'standard',
    fLabel: 'H_n = Σ_{k=1}^n 1/k',
    gLabel: 'log₂(√(log₂ n)) = ½ log₂ log₂ n',
    f: (n) => {
      let s = 0
      for (let k = 1; k <= n; k++) s += 1 / k
      return s
    },
    g: (n) => 0.5 * Math.log2(Math.max(1.0001, Math.log2(Math.max(2, n)))),
    nMin: 4,
    nMax: 4000,
    limitDescription: 'lim f/g = lim (log n) / (log log n) → ∞',
    simplification: 'H_n = Θ(log n) (αρμονικός). log(√log n) = ½ log log n. Σύγκριση: log n vs log log n.',
    verdicts: {
      O: { holds: false, reason: 'η f μεγαλώνει αυστηρά πιο γρήγορα' },
      o: { holds: false, reason: 'συμμετρικά' },
      Omega: { holds: true, reason: 'log n ≥ log log n από n μεγάλο' },
      omega: { holds: true, reason: 'λόγος (log n)/(log log n) → ∞' },
      Theta: { holds: false, reason: 'το ω αποκλείει το Θ' },
    },
    takeaway: 'Ξεδιπλώνεις τα τρομακτικά (H_n, √log) ΠΡΩΤΑ· η σύγκριση γίνεται απλή.',
  },

  /* L02 — pt5-th1b: f = c^{√(n log n)} (poly-in-n in the exponent) vs
     g = (n log n)^{log² n} (polylog in the exponent). LOG-COMPARE mode. */
  'pt5-th1b': {
    id: 'pt5-th1b',
    mode: 'standard',
    fLabel: 'log f = √(n log n) · log c',
    gLabel: 'log g = log²(n) · log(n log n)  ≈  log³ n',
    // Use c = e for the plot so log c = 1.
    f: (n) => Math.sqrt(n * Math.log2(Math.max(2, n))),
    g: (n) => Math.pow(Math.log2(Math.max(2, n)), 2) * (Math.log2(Math.max(2, n)) + Math.log2(Math.log2(Math.max(2, n)))),
    nMin: 16,
    nMax: 1e6,
    plotMode: 'log-log',
    limitDescription: 'log f / log g = √(n log n) / log³ n → ∞ (πολυωνυμικό > πολυλογάριθμος)',
    simplification: 'Παίρνουμε ΛΟΓΑΡΙΘΜΟ και στις δύο πλευρές. log f = √(n log n) · log c — εμπεριέχει n^{½} (πολυωνυμικό). log g = log³ n (πολυλογάριθμος). Πολυωνυμικό > πολυλογάριθμος.',
    verdicts: {
      O: { holds: false, reason: 'log f → ∞ πιο γρήγορα από log g → άρα και f → ∞ πιο γρήγορα από g' },
      o: { holds: false, reason: 'συμμετρικά' },
      Omega: { holds: true, reason: 'log f ≥ log g τελικά → f ≥ g τελικά' },
      omega: { holds: true, reason: 'log f / log g → ∞' },
      Theta: { holds: false, reason: 'το ω αποκλείει το Θ' },
    },
    takeaway: 'Όταν δύο εκφράσεις είναι τεράστιες, πάρε log και στις δύο — η σειρά διατηρείται, η μάχη απλοποιείται.',
  },

  /* L02 — pt5-th2-a: g(n) = 2^{√log n} vs n. Same-base exponent compare. */
  'pt5-th2-a': {
    id: 'pt5-th2-a',
    mode: 'standard',
    fLabel: '2^{√(log₂ n)}',
    gLabel: 'n = 2^{log₂ n}',
    f: (n) => Math.pow(2, Math.sqrt(Math.log2(Math.max(2, n)))),
    g: (n) => n,
    nMin: 4,
    nMax: 1e6,
    limitDescription: 'lim f/g = 2^{√log n − log n} → 2^{−∞} = 0',
    simplification: 'Γράψε και τα δύο ως δυνάμεις του 2. Σύγκρινε εκθέτες: √log n vs log n.',
    verdicts: {
      O: { holds: true, reason: 'f ≤ g τελικά' },
      o: { holds: true, reason: 'ο λόγος → 0' },
      Omega: { holds: false, reason: 'g μεγαλώνει αυστηρά πιο γρήγορα' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: '«Ίδια βάση» κόλπο: γράψε και τα δύο ως 2^…, μετά σύγκρινε εκθέτες.',
  },

  /* L02 — front-set-1-ask0: f = n log n + 4n³ + 2^{log n} vs g = 2^n */
  'front-set-1-ask0': {
    id: 'front-set-1-ask0',
    mode: 'standard',
    fLabel: 'n log n + 4n³ + 2^{log₂ n}',
    gLabel: '2^n',
    f: (n) => n * Math.log2(Math.max(2, n)) + 4 * n * n * n + n,
    g: (n) => Math.pow(2, n),
    nMin: 2,
    nMax: 30,
    limitDescription: 'lim f/g = lim n³ / 2^n → 0 (πολυώνυμο < εκθετικό)',
    simplification: '2^{log₂ n} = n. Η f απλοποιείται σε n log n + 4n³ + n = Θ(n³). Συγκρίνεις n³ με 2^n.',
    verdicts: {
      O: { holds: true, reason: 'κάθε πολυώνυμο είναι O κάθε εκθετικής' },
      o: { holds: true, reason: 'ο λόγος → 0' },
      Omega: { holds: false, reason: '2^n μεγαλώνει αυστηρά πιο γρήγορα' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: 'Αναγνώρισε ψεύδο-εκθετικούς όρους (2^{log n}=n)· κράτα τον κυρίαρχο· εφάρμοσε ιεραρχία.',
  },

  /* L02 — front-set-2-ask2 (a): H_n vs log n */
  'front-set-2-ask2-a': {
    id: 'front-set-2-ask2-a',
    mode: 'standard',
    fLabel: 'H_n = Σ 1/k',
    gLabel: 'log₂ n',
    f: (n) => {
      let s = 0
      for (let k = 1; k <= n; k++) s += 1 / k
      return s
    },
    g: (n) => Math.log2(Math.max(2, n)),
    nMin: 4,
    nMax: 10000,
    limitDescription: 'lim H_n / log n = 1/ln 2 ≈ 1.443 (σταθερά)',
    simplification: 'H_n ≈ ln n + γ — η σταθερά γ ≈ 0.577 και η αλλαγή βάσης δίνουν λόγο που σταθεροποιείται.',
    verdicts: {
      O: { holds: true, reason: 'H_n ≤ c · log n για κατάλληλο c' },
      Omega: { holds: true, reason: 'H_n ≥ c · log n για κατάλληλο c' },
      Theta: { holds: true, reason: 'O και Ω → ίδια τάξη' },
      o: { holds: false, reason: 'ο λόγος δεν πέφτει στο 0, σταθεροποιείται' },
      omega: { holds: false, reason: 'συμμετρικά' },
    },
    takeaway: 'Ο αρμονικός αριθμός είναι ένας λογάριθμος μεταμφιεσμένος.',
  },

  /* L02 — front-set-2-ask2 (b): log(n!) vs n log n (Stirling) */
  'front-set-2-ask2-b': {
    id: 'front-set-2-ask2-b',
    mode: 'standard',
    fLabel: 'log₂(n!)',
    gLabel: 'n log₂ n',
    f: (n) => {
      let s = 0
      for (let k = 1; k <= n; k++) s += Math.log2(k)
      return s
    },
    g: (n) => n * Math.log2(Math.max(2, n)),
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim log(n!) / (n log n) = 1/ln 2 (Stirling)',
    simplification: 'Stirling: log(n!) = n log n − n log e + O(log n). Άρα Θ(n log n).',
    verdicts: {
      O: { holds: true, reason: 'log(n!) ≤ n · log n (κάθε από τους n όρους ≤ log n)' },
      Omega: { holds: true, reason: 'οι μισοί όροι είναι ≥ log(n/2) → άθροισμα ≥ ½ n log(n/2)' },
      Theta: { holds: true, reason: 'O και Ω → ίδια τάξη' },
      o: { holds: false, reason: 'ο λόγος σταθεροποιείται, δεν πέφτει στο 0' },
      omega: { holds: false, reason: 'συμμετρικά' },
    },
    takeaway: 'log(n!) = Σ log k = Θ(n log n) — γρήγορη διαίσθηση πριν τη Stirling.',
  },

  /* L02 — front-set-2-ask5 (b): f = n² · (2/5)^n vs 1 */
  'front-set-2-ask5-b': {
    id: 'front-set-2-ask5-b',
    mode: 'standard',
    fLabel: 'n² · (2/5)^n',
    gLabel: '1',
    f: (n) => n * n * Math.pow(2 / 5, n),
    g: () => 1,
    nMin: 1,
    nMax: 30,
    limitDescription: 'lim f / 1 = lim n² · (0.4)^n → 0',
    simplification: '(2/5)^n έχει βάση < 1 — εκθετική κατάρρευση. Νικάει εύκολα το n².',
    verdicts: {
      O: { holds: true, reason: 'η f φθίνει — άρα φράσσεται από σταθερά' },
      o: { holds: true, reason: 'ο λόγος f/1 → 0' },
      Omega: { holds: false, reason: 'καμία θετική σταθερά c δεν φράσσει την f από κάτω τελικά' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: 'Βάση < 1 στο εκθετικό → κατάρρευση. Πολυώνυμο μπροστά δεν σώζει.',
  },

  /* L02 — front-set-2-ask7 (1): log^k n vs n^e */
  'front-set-2-ask7-1': {
    id: 'front-set-2-ask7-1',
    mode: 'standard',
    fLabel: 'log^k n  (k=2)',
    gLabel: 'n^e  (e=1)',
    f: (n) => Math.pow(Math.log2(Math.max(2, n)), 2),
    g: (n) => n,
    nMin: 4,
    nMax: 1e6,
    limitDescription: 'lim log^k n / n^e → 0 (πολυώνυμο > πολυλογάριθμος)',
    simplification: 'Θεώρημα: κάθε θετική δύναμη του n νικάει κάθε δύναμη του log n.',
    verdicts: {
      O: { holds: true, reason: 'log^k n ≤ c·n^e τελικά' },
      o: { holds: true, reason: 'ο λόγος → 0' },
      Omega: { holds: false, reason: 'n^e μεγαλώνει αυστηρά πιο γρήγορα' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: 'Πολυώνυμο > πολυλογάριθμος, πάντα.',
  },

  /* L02 — front-set-2-ask7 (2): n^k vs c^n (c>1) */
  'front-set-2-ask7-2': {
    id: 'front-set-2-ask7-2',
    mode: 'standard',
    fLabel: 'n^k  (k=4)',
    gLabel: 'c^n  (c=2)',
    f: (n) => Math.pow(n, 4),
    g: (n) => Math.pow(2, n),
    nMin: 2,
    nMax: 40,
    limitDescription: 'lim n^k / c^n → 0 (εκθετικό > πολυωνυμικό)',
    simplification: 'Θεώρημα: κάθε εκθετική (c>1) νικάει κάθε πολυώνυμο.',
    verdicts: {
      O: { holds: true, reason: 'n^k ≤ c·2^n τελικά' },
      o: { holds: true, reason: 'ο λόγος → 0' },
      Omega: { holds: false, reason: '2^n μεγαλώνει αυστηρά πιο γρήγορα' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'το o αποκλείει το Θ' },
    },
    takeaway: 'Εκθετικό > πολυώνυμο, πάντα.',
  },

  /* L02 — front-set-2-ask7 (3): √n vs n^{sin n} — incomparable (oscillation) */
  'front-set-2-ask7-3': {
    id: 'front-set-2-ask7-3',
    mode: 'standard',
    fLabel: '√n',
    gLabel: 'n^{sin n}',
    f: (n) => Math.sqrt(n),
    g: (n) => Math.pow(n, Math.sin(n)),
    nMin: 4,
    nMax: 100,
    limitDescription: 'το όριο ΔΕΝ υπάρχει — η n^{sin n} ταλαντώνεται μεταξύ ~1/n και ~n',
    simplification: 'Ο εκθέτης sin n διατρέχει [−1, 1] συνεχώς. Άλλοτε √n νικάει, άλλοτε χάνει.',
    verdicts: {
      O: { holds: false, reason: 'όταν sin n = 1, η g ≈ n > √n — δεν φράσσεται από κάτω' },
      o: { holds: false, reason: 'το όριο δεν υπάρχει' },
      Omega: { holds: false, reason: 'όταν sin n = −1, η g ≈ 1/n < √n — δεν φράσσεται από κάτω' },
      omega: { holds: false, reason: 'συμμετρικά' },
      Theta: { holds: false, reason: 'κανένα από τα O, Ω δεν ισχύει' },
    },
    takeaway: 'Όταν ο εκθέτης ταλαντώνεται, οι συναρτήσεις είναι μη-συγκρίσιμες — κανένα σύμβολο δεν ισχύει.',
  },

  /* L02 — front-set-2-ask7 (4): 2^n vs 2^{n/2} */
  'front-set-2-ask7-4': {
    id: 'front-set-2-ask7-4',
    mode: 'standard',
    fLabel: '2^n',
    gLabel: '2^{n/2}',
    f: (n) => Math.pow(2, n),
    g: (n) => Math.pow(2, n / 2),
    nMin: 2,
    nMax: 30,
    limitDescription: 'lim f/g = 2^{n/2} → ∞',
    simplification: '2^n = (2^{n/2})² — το f είναι το τετράγωνο του g. Αυστηρά μεγαλύτερο.',
    verdicts: {
      O: { holds: false, reason: 'f μεγαλώνει αυστηρά πιο γρήγορα' },
      o: { holds: false, reason: 'συμμετρικά' },
      Omega: { holds: true, reason: 'f ≥ g τελικά (στην πραγματικότητα f ≥ g² τελικά)' },
      omega: { holds: true, reason: 'λόγος f/g = 2^{n/2} → ∞' },
      Theta: { holds: false, reason: 'το ω αποκλείει το Θ' },
    },
    takeaway: '«Διπλάσιος εκθέτης» = τετράγωνο της συνάρτησης — όχι σταθερά επί.',
  },

  /* L02 — front-set-2-ask7 (5): n^{log c} vs c^{log n} — equal! */
  'front-set-2-ask7-5': {
    id: 'front-set-2-ask7-5',
    mode: 'standard',
    fLabel: 'n^{log₂ c}  (c=3)',
    gLabel: 'c^{log₂ n}  (c=3)',
    f: (n) => Math.pow(n, Math.log2(3)),
    g: (n) => Math.pow(3, Math.log2(Math.max(2, n))),
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim f/g = 1 (είναι ίσες!)',
    simplification: 'log(n^{log c}) = log c · log n. log(c^{log n}) = log n · log c. Ίδιος λογάριθμος → ίσες.',
    verdicts: {
      O: { holds: true, reason: 'f = g, άρα f ≤ 1·g' },
      Omega: { holds: true, reason: 'συμμετρικά: f ≥ 1·g' },
      Theta: { holds: true, reason: 'είναι ίσες' },
      o: { holds: false, reason: 'ο λόγος είναι ακριβώς 1, όχι 0' },
      omega: { holds: false, reason: 'συμμετρικά' },
    },
    takeaway: 'Η ταυτότητα n^{log c} = c^{log n} είναι κρυφή — απόδειξη: λογάριθμος και στις δύο.',
  },

  /* L02 — front-set-2-ask7 (6): log(n!) vs log(n^n) */
  'front-set-2-ask7-6': {
    id: 'front-set-2-ask7-6',
    mode: 'standard',
    fLabel: 'log₂(n!)',
    gLabel: 'log₂(n^n) = n log₂ n',
    f: (n) => {
      let s = 0
      for (let k = 1; k <= n; k++) s += Math.log2(k)
      return s
    },
    g: (n) => n * Math.log2(Math.max(2, n)),
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim log(n!) / (n log n) = 1/ln 2 — σταθερά',
    simplification: 'Stirling δίνει log(n!) = Θ(n log n) = Θ(log(n^n)).',
    verdicts: {
      O: { holds: true, reason: 'log(n!) = Σ log k ≤ n · log n' },
      Omega: { holds: true, reason: 'log(n!) ≥ ½ n log(n/2)' },
      Theta: { holds: true, reason: 'ίδια τάξη μεγέθους' },
      o: { holds: false, reason: 'ο λόγος σταθεροποιείται' },
      omega: { holds: false, reason: 'συμμετρικά' },
    },
    takeaway: 'log(n!) ≈ log(n^n) ≈ n log n — όλα στην ίδια τάξη.',
  },

  /* L02 — front-set-2-ask4 (γ): 5^{H_n} ≈ n^{ln 5} */
  'front-set-2-ask4-c': {
    id: 'front-set-2-ask4-c',
    mode: 'standard',
    fLabel: '5^{H_n}',
    gLabel: 'n^{ln 5}  (≈ n^{1.6})',
    f: (n) => {
      let h = 0
      for (let k = 1; k <= n; k++) h += 1 / k
      return Math.pow(5, h)
    },
    g: (n) => Math.pow(n, Math.log(5)),
    nMin: 2,
    nMax: 1000,
    limitDescription: 'lim f/g = 5^γ ≈ 1.78 (σταθερά)',
    simplification: 'H_n ≈ ln n + γ → 5^{H_n} ≈ 5^{ln n}·5^γ = n^{ln 5}·5^γ.',
    verdicts: {
      O: { holds: true, reason: 'σταθερός λόγος → άνω φράγμα από c·g' },
      Omega: { holds: true, reason: 'σταθερός λόγος → κάτω φράγμα από c·g' },
      Theta: { holds: true, reason: 'O και Ω → ίδια τάξη' },
      o: { holds: false, reason: 'ο λόγος δεν πέφτει στο 0' },
      omega: { holds: false, reason: 'συμμετρικά' },
    },
    takeaway: 'a^{H_n} = Θ(n^{ln a}) — βγάζεις τον λογάριθμο από τον εκθέτη.',
  },
}

const PLOT = { x0: 60, x1: 700, yTop: 26, yBot: 220 }
const RATIO_PLOT = { x0: 60, x1: 700, yTop: 250, yBot: 360 }
const SAMPLES = 200

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (Math.abs(v) >= 1e6) return v.toExponential(2)
  if (Math.abs(v) >= 100) return Math.round(v).toString()
  if (Math.abs(v) >= 1) return v.toFixed(2).replace(/\.?0+$/, '')
  if (Math.abs(v) >= 0.001) return v.toFixed(3)
  return v.toExponential(2)
}

type Props = {
  /** Reference into the curated preset bank. */
  preset: string
}

// Stable fallback so hooks always see a non-null preset even when the
// requested id is missing — the actual "missing" notice is rendered below
// once all hooks have run.
const FALLBACK_PRESET = Object.values(ASYMPTOTIC_PRESETS)[0]

export function AsymptoticVerdictExplorer({ preset: presetId }: Props) {
  const lookup = ASYMPTOTIC_PRESETS[presetId]
  const preset = lookup ?? FALLBACK_PRESET

  const isParam = preset.mode === 'param-slider'
  const [param, setParam] = useState(isParam ? (preset as ParamPreset).paramInit : 0)

  const fFn = useMemo(
    () => (isParam ? (n: number) => (preset as ParamPreset).f(n, param) : (preset as StandardPreset).f),
    [preset, isParam, param],
  )
  const gFn = useMemo(
    () =>
      isParam
        ? (n: number) => (preset as ParamPreset).g(n, param)
        : (preset as StandardPreset).g,
    [preset, isParam, param],
  )

  const resolved = useMemo(() => {
    if (isParam) {
      return (preset as ParamPreset).resolve(param)
    }
    const p = preset as StandardPreset
    return { verdicts: p.verdicts, limitDescription: p.limitDescription }
  }, [preset, isParam, param])

  const verdicts = resolved.verdicts
  const limitDescription = resolved.limitDescription
  const paramNote = (resolved as { note?: string }).note

  // Sample log-spaced n across the preset's range.
  const samples = useMemo(() => {
    const out: { n: number; fv: number; gv: number; ratio: number }[] = []
    const lo = Math.log(preset.nMin)
    const hi = Math.log(preset.nMax)
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1)
      const n = Math.exp(lo + (hi - lo) * t)
      const fv = fFn(n)
      const gv = gFn(n)
      if (!Number.isFinite(fv) || !Number.isFinite(gv) || fv <= 0 || gv <= 0) continue
      out.push({ n, fv, gv, ratio: fv / gv })
    }
    return out
  }, [preset.nMin, preset.nMax, fFn, gFn])

  // Compute log-log axes.
  const xMinLog = Math.log10(preset.nMin)
  const xMaxLog = Math.log10(preset.nMax)
  const fMin = Math.min(...samples.map((s) => s.fv))
  const fMax = Math.max(...samples.map((s) => s.fv))
  const gMin = Math.min(...samples.map((s) => s.gv))
  const gMax = Math.max(...samples.map((s) => s.gv))
  const yMin = Math.max(Math.min(fMin, gMin) * 0.5, 1e-12)
  const yMax = Math.max(fMax, gMax) * 2
  const yMinLog = Math.log10(yMin)
  const yMaxLog = Math.log10(yMax)

  const xFor = (n: number) =>
    PLOT.x0 + ((Math.log10(n) - xMinLog) / (xMaxLog - xMinLog)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) =>
    PLOT.yBot - ((Math.log10(v) - yMinLog) / (yMaxLog - yMinLog)) * (PLOT.yBot - PLOT.yTop)

  const fLine = samples
    .map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.fv).toFixed(1)}`)
    .join(' ')
  const gLine = samples
    .map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.gv).toFixed(1)}`)
    .join(' ')

  // Ratio panel.
  const rMin = Math.min(...samples.map((s) => s.ratio))
  const rMax = Math.max(...samples.map((s) => s.ratio))
  // Pad
  const ryMinLog = Math.log10(Math.max(rMin * 0.5, 1e-12))
  const ryMaxLog = Math.log10(Math.max(rMax * 2, ryMinLog + 1))
  const rYFor = (v: number) =>
    RATIO_PLOT.yBot - ((Math.log10(v) - ryMinLog) / (ryMaxLog - ryMinLog)) * (RATIO_PLOT.yBot - RATIO_PLOT.yTop)
  const ratioLine = samples
    .map((s) => `${xFor(s.n).toFixed(1)},${rYFor(s.ratio).toFixed(1)}`)
    .join(' ')

  // Tail readout.
  const tail = samples[samples.length - 1]

  // Decade gridlines.
  const xTicks: number[] = []
  for (let e = Math.ceil(xMinLog); e <= Math.floor(xMaxLog); e++) xTicks.push(e)

  const chips: { key: ChipKey; label: string; subscript: string }[] = [
    { key: 'O', label: 'O', subscript: '«όχι χειρότερα από»' },
    { key: 'o', label: 'o', subscript: '«αυστηρά μικρότερα»' },
    { key: 'Omega', label: 'Ω', subscript: '«όχι καλύτερα από»' },
    { key: 'omega', label: 'ω', subscript: '«αυστηρά μεγαλύτερα»' },
    { key: 'Theta', label: 'Θ', subscript: '«ίδιας τάξης»' },
  ]

  const formatParam = isParam
    ? (preset as ParamPreset).paramDisplay ?? ((p: number) => p.toFixed(2))
    : null

  if (!lookup) {
    return (
      <div className="my-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
        AsymptoticVerdictExplorer: άγνωστο preset «{presetId}».
      </div>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* Header */}
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Verdict explorer:{' '}
          <span className="font-mono text-fg">{preset.fLabel}</span>{' '}
          <span className="text-fg-subtle">vs</span>{' '}
          <span className="font-mono text-fg">{preset.gLabel}</span>
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">log-log κλίμακα</span>
      </div>

      {preset.simplification && (
        <p className="mb-3 rounded-md border border-sky-300/50 bg-sky-50/70 px-3 py-1.5 text-[13px] leading-relaxed text-sky-900 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-100">
          <span className="font-semibold">Πρώτη κίνηση: </span>
          {preset.simplification}
        </p>
      )}

      {isParam && formatParam && (
        <div className="mb-3 flex items-center gap-3">
          <label className="text-xs font-medium text-fg-muted">
            {(preset as ParamPreset).paramLabel}
          </label>
          <input
            type="range"
            min={(preset as ParamPreset).paramMin}
            max={(preset as ParamPreset).paramMax}
            step={(preset as ParamPreset).paramStep}
            value={param}
            onChange={(e) => setParam(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-accent"
          />
          <span className="w-44 text-right font-mono text-xs text-fg">{formatParam(param)}</span>
        </div>
      )}

      {/* Plot */}
      <svg viewBox="0 0 720 380" className="w-full" role="img" aria-label="f, g και λόγος">
        <style>{`
          .av-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .av-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .av-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .av-lab { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
        `}</style>

        {/* x grid */}
        {xTicks.map((e) => (
          <g key={`x-${e}`}>
            <line x1={xFor(Math.pow(10, e))} x2={xFor(Math.pow(10, e))} y1={PLOT.yTop} y2={PLOT.yBot} className="av-grid" />
            <text x={xFor(Math.pow(10, e))} y={PLOT.yBot + 12} textAnchor="middle" className="av-tick">
              10^{e}
            </text>
          </g>
        ))}

        {/* axes (top plot) */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="av-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="av-axis" />

        {/* f and g lines */}
        <polyline points={fLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2} />
        <polyline points={gLine} fill="none" stroke="rgb(217 70 239)" strokeWidth={2} strokeDasharray="4 3" />

        {/* legend */}
        <g transform={`translate(${PLOT.x0 + 6}, ${PLOT.yTop + 2})`}>
          <rect x={0} y={0} width={150} height={32} fill="rgb(var(--bg-elevated))" opacity={0.92} rx={4} />
          <line x1={6} x2={22} y1={10} y2={10} stroke="rgb(37 99 235)" strokeWidth={2} />
          <text x={26} y={13} className="av-lab">f(n)</text>
          <line x1={6} x2={22} y1={24} y2={24} stroke="rgb(217 70 239)" strokeWidth={2} strokeDasharray="4 3" />
          <text x={26} y={27} className="av-lab">g(n)</text>
        </g>

        {/* ratio plot */}
        <line x1={RATIO_PLOT.x0} x2={RATIO_PLOT.x1} y1={RATIO_PLOT.yBot} y2={RATIO_PLOT.yBot} className="av-axis" />
        <line x1={RATIO_PLOT.x0} x2={RATIO_PLOT.x0} y1={RATIO_PLOT.yTop} y2={RATIO_PLOT.yBot} className="av-axis" />
        {/* ratio=1 reference */}
        {0 >= ryMinLog && 0 <= ryMaxLog && (
          <line
            x1={RATIO_PLOT.x0}
            x2={RATIO_PLOT.x1}
            y1={rYFor(1)}
            y2={rYFor(1)}
            stroke="rgb(var(--border-strong))"
            strokeWidth={0.75}
            strokeDasharray="1 2"
          />
        )}
        <polyline points={ratioLine} fill="none" stroke="rgb(16 185 129)" strokeWidth={2} />
        <text x={RATIO_PLOT.x1 - 4} y={RATIO_PLOT.yTop + 12} textAnchor="end" className="av-lab" fill="rgb(16 185 129)">
          λόγος f(n)/g(n)
        </text>
      </svg>

      {/* Limit description */}
      <div className="mt-3 rounded-md border border-border bg-bg-soft/40 px-3 py-2 font-mono text-[12px] text-fg">
        <span className="text-fg-subtle">όριο: </span>
        {limitDescription}
        <span className="ml-3 text-fg-subtle">— στο n ≈ {fmt(tail.n)} ο λόγος είναι {fmt(tail.ratio)}</span>
      </div>

      {paramNote && (
        <p className="mt-2 text-[12.5px] italic leading-relaxed text-fg-muted">{paramNote}</p>
      )}

      {/* Verdict chips */}
      <div className="mt-3 grid gap-1.5 sm:grid-cols-5">
        {chips.map((c) => {
          const v = verdicts[c.key]
          return (
            <div
              key={c.key}
              className={cn(
                'rounded-lg border-2 px-2.5 py-2 text-center transition-colors',
                v.holds
                  ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-500/15'
                  : 'border-rose-300/50 bg-rose-50/50 dark:bg-rose-500/10',
              )}
            >
              <div className="flex items-center justify-center gap-1 font-mono text-base font-bold">
                <span className={v.holds ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                  {v.holds ? '✓' : '✗'}
                </span>
                <span className="text-fg">{c.label}</span>
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                {c.subscript}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-fg-muted">{v.reason}</div>
            </div>
          )
        })}
      </div>

      {/* Takeaway */}
      <div className="mt-3 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        {preset.takeaway}
      </div>
    </section>
  )
}
