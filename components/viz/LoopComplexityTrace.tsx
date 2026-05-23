'use client'

/**
 * LoopComplexityTrace — δες πραγματικά πόσες φορές τρέχει κάθε βρόχος.
 *
 * For the L02 «βρες την πολυπλοκότητα του αλγορίθμου» exercises. Static
 * analysis is what they're asked to do on the exam — but the student
 * first needs to SEE what's happening: which loops run, how often, and
 * (crucially) which loops *don't* run because the bound is ≤ 0 / a
 * geometric step / etc.
 *
 * Per-preset, the viz runs the algorithm at a chosen n, ticking a
 * per-loop counter, and surfaces the total operation count. A side
 * panel shows the asymptotic argument: "outer is n; for each i the
 * inner does i² work; sum gives n³".
 *
 * Presets:
 *  - front-set-1-ask3 (#12)     — `while m←log m` then inner `for`
 *                                 skips because m≤0. The TRAP exercise.
 *  - front-set-2-ask6 (#18)     — nested with CALC(j) = √j → Θ(n⁴)
 *  - front-set-4-e0-ask6 (#21)  — same as #18, slightly different wording
 *  - front-set-4-thema4-a (#22A) — CALC(m) is √m → Θ(n^{5/2})
 *  - front-set-4-thema4-b (#22B) — j *= 3 → log iterations → Θ(n²)
 *
 * Built for L02 Phase D.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type LoopRow = {
  /** Which conceptual block this line belongs to. */
  loop: string
  /** Display text — pseudocode. */
  text: string
  /** Indent level (for visual nesting). */
  indent: number
  /** When true, the line is the bottom of an empty-body trap. */
  trap?: boolean
}

type Counter = {
  /** Display name shown in the ledger. */
  name: string
  /** Color swatch for the bar. */
  color: string
  /** Compute the count given the user's n. */
  count: (n: number) => number
  /** Asymptotic description (e.g. "Θ(n)"). */
  asymptotic: string
  /** Short explanation of why this count. */
  why: string
}

type Preset = {
  id: string
  title: string
  /** Pseudocode lines for the display. */
  code: LoopRow[]
  /** n range for the slider. */
  nMin: number
  nMax: number
  nInit: number
  /** Per-block counters (in execution order). */
  counters: Counter[]
  /** The "naive" wrong analysis to contrast with. */
  trapAnswer?: string
  /** The correct asymptotic answer (renders prominently). */
  correctAnswer: string
  /** One-line takeaway. */
  takeaway: string
}

const COLORS = {
  blue: 'bg-sky-500 text-sky-50',
  emerald: 'bg-emerald-500 text-emerald-50',
  amber: 'bg-amber-500 text-amber-50',
  rose: 'bg-rose-500 text-rose-50',
  violet: 'bg-violet-500 text-violet-50',
  slate: 'bg-slate-400 text-slate-50',
} as const

/** Iterated log: how many times to apply log₂ before m ≤ 1. */
function logStar(n: number): number {
  let count = 0
  let x = n
  while (x > 1) {
    x = Math.log2(x)
    count++
    if (count > 100) break
  }
  return count
}

export const LOOP_PRESETS: Record<string, Preset> = {
  /* #12 — front-set-1-ask3: the log* trap */
  'front-set-1-ask3': {
    id: 'front-set-1-ask3',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 3 — log* και η παγίδα',
    code: [
      { loop: 'init', text: 'arg ← −1', indent: 0 },
      { loop: 'outer', text: 'for i ← 1 to n do', indent: 0 },
      { loop: 'outer', text: 'm ← i', indent: 1 },
      { loop: 'while', text: 'while m > 0 do', indent: 1 },
      { loop: 'while', text: 'm ← log(m)', indent: 2 },
      { loop: 'innerfor', text: 'for j ← 1 to m do  ← m ≤ 0 εδώ!', indent: 1, trap: true },
      { loop: 'innerfor', text: 'arg ← i · i · j', indent: 2, trap: true },
    ],
    nMin: 4,
    nMax: 65536,
    nInit: 1024,
    counters: [
      {
        name: 'εξωτερικό for (i: 1..n)',
        color: 'blue',
        count: (n) => n,
        asymptotic: 'Θ(n)',
        why: 'Πάει από 1 ως n.',
      },
      {
        name: 'while m←log m  (ανά i)',
        color: 'emerald',
        count: (n) => Math.max(1, logStar(n)),
        asymptotic: 'Θ(log* n)',
        why: 'Επαναλαμβανόμενος λογάριθμος — πεσμένο στο ≤1 σε log* βήματα.',
      },
      {
        name: 'εσωτερικό for (j: 1..m)',
        color: 'rose',
        count: () => 0,
        asymptotic: 'Θ(1) — δεν τρέχει!',
        why: 'Όταν φτάνει εδώ, m ≤ 0. Το «1 έως m» είναι κενό διάστημα → 0 επαναλήψεις.',
      },
    ],
    trapAnswer: 'Πρόχειρη ανάλυση: «for i, μέσα for j → O(n²)» — ΛΑΘΟΣ.',
    correctAnswer: 'O(n · log* n)',
    takeaway:
      'Διάβασε το state του προγράμματος ΠΡΙΝ από κάθε βρόχο. Εδώ, μετά τη while ο m είναι ≤ 0, οπότε το «for j ← 1 to m» είναι κενό. Σχεδόν όλο το πραγματικό κόστος είναι ο εξωτερικός βρόχος.',
  },

  /* #18 / #21 — front-set-2-ask6 / front-set-4-e0-ask6: nested + CALC=√j */
  'front-set-2-ask6': {
    id: 'front-set-2-ask6',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 6 — εμφωλευμένοι βρόχοι',
    code: [
      { loop: 'init', text: 'arg ← −1', indent: 0 },
      { loop: 'outer', text: 'for i ← 1 to 2n do', indent: 0 },
      { loop: 'inner', text: 'for j ← i to i² do', indent: 1 },
      { loop: 'inner', text: 'arg ← CALC(j)', indent: 2 },
      { loop: 'calc', text: 'procedure CALC(w):', indent: 0 },
      { loop: 'calc', text: 'res ← 0', indent: 1 },
      { loop: 'calc', text: 'for i ← 1 to √w with step 0.1 do', indent: 1 },
      { loop: 'calc', text: 'res ← res + log(i)', indent: 2 },
      { loop: 'calc', text: 'return res', indent: 1 },
    ],
    nMin: 2,
    nMax: 100,
    nInit: 8,
    counters: [
      {
        name: 'εξωτερικό for (i: 1..2n)',
        color: 'blue',
        count: (n) => 2 * n,
        asymptotic: 'Θ(n)',
        why: 'Πάει 1 ως 2n.',
      },
      {
        name: 'εσωτερικό for (j: i..i²)  σύνολο επαναλήψεων',
        color: 'emerald',
        count: (n) => {
          let s = 0
          for (let i = 1; i <= 2 * n; i++) s += Math.max(0, i * i - i + 1)
          return s
        },
        asymptotic: 'Θ(n³)',
        why: 'Ανά i: ≈ i² επαναλήψεις. Σύνολο: Σ_{i=1}^{2n} i² = Θ(n³).',
      },
      {
        name: 'CALC(j)  σύνολο κλήσεων × κόστος',
        color: 'rose',
        count: (n) => {
          // Total work = sum over outer iterations of (inner iterations × CALC(j))
          // ≈ Σ_i Σ_{j=i}^{i²} 10·√j ≈ Σ_i 10·i² · √(i²/2)
          // Easier: simulate for small n. For display we estimate Θ(n^4).
          let total = 0
          for (let i = 1; i <= Math.min(2 * n, 40); i++) {
            for (let j = i; j <= i * i; j++) {
              total += 10 * Math.sqrt(j)
            }
          }
          return Math.round(total)
        },
        asymptotic: 'Θ(n⁴)',
        why: 'CALC(w) ≈ 10√w. Ανά εσωτερική κλήση με j ≤ i², κόστος ≤ 10·i. Σύνολο: Σi³ = Θ(n⁴).',
      },
    ],
    correctAnswer: 'Θ(n⁴)',
    takeaway:
      'Από μέσα προς τα έξω: CALC=√w, εσωτερικό for=i² επαναλήψεις × i κόστος=i³, εξωτερικό αθροίζει σε n⁴. Πολλαπλασιάζουμε τάξεις, δεν προσθέτουμε.',
  },

  'front-set-4-e0-ask6': {
    id: 'front-set-4-e0-ask6',
    title: 'Φροντιστηριακό Σετ #4 · Επανάληψη E0 — τρεις εμφωλευμένοι',
    code: [
      { loop: 'init', text: 'arg ← −1', indent: 0 },
      { loop: 'outer', text: 'for i ← 1 to 2n do', indent: 0 },
      { loop: 'inner', text: 'for j ← i to i² do', indent: 1 },
      { loop: 'inner', text: 'arg ← CALC(j)', indent: 2 },
      { loop: 'calc', text: 'procedure CALC(w):', indent: 0 },
      { loop: 'calc', text: 'for i ← 1 to w^0.5 with step 0.1 do', indent: 1 },
      { loop: 'calc', text: 'res ← res + log(i)', indent: 2 },
    ],
    nMin: 2,
    nMax: 100,
    nInit: 8,
    counters: [
      {
        name: 'εξωτερικό for (i: 1..2n)',
        color: 'blue',
        count: (n) => 2 * n,
        asymptotic: 'O(n)',
        why: 'Πάει 1 ως 2n.',
      },
      {
        name: 'εσωτερικό for (j: i..i²)',
        color: 'emerald',
        count: (n) => {
          let s = 0
          for (let i = 1; i <= 2 * n; i++) s += Math.max(0, i * i - i + 1)
          return s
        },
        asymptotic: 'O(n²) ανά i (χειρότερη)',
        why: 'Στο χειρότερο i = 2n: 4n² − 2n + 1 επαναλήψεις.',
      },
      {
        name: 'CALC(j) ανά κλήση',
        color: 'amber',
        count: (n) => Math.round(10 * Math.sqrt(4 * n * n)),
        asymptotic: 'O(n) (χειρότερη)',
        why: 'w = j ≤ i² ≤ 4n²; √w ≤ 2n· βήμα 0.1 → 10·2n = 20n.',
      },
    ],
    correctAnswer: 'O(n)·O(n²)·O(n) = O(n⁴)',
    takeaway:
      'Εμφωλευμένοι ⇒ πολλαπλασιάζεις. Τρεις βρόχοι: n × n² × n = n⁴. Το βήμα 0.1 στο CALC είναι σταθερά — δεν αλλάζει την τάξη.',
  },

  /* #22 Algo 1 — front-set-4-thema4-a: CALC √m + nested */
  'front-set-4-thema4-a': {
    id: 'front-set-4-thema4-a',
    title: 'Φροντιστηριακό Σετ #4 · Θέμα 4, Algorithm 1',
    code: [
      { loop: 'init', text: 'arg ← 1', indent: 0 },
      { loop: 'outer', text: 'for i ← 1 to n do', indent: 0 },
      { loop: 'inner', text: 'for j ← 1 to i do', indent: 1 },
      { loop: 'inner', text: 'arg ← CALC(j)', indent: 2 },
      { loop: 'calc', text: 'procedure CALC(m):', indent: 0 },
      { loop: 'calc', text: 'i ← 1; s ← 1', indent: 1 },
      { loop: 'calc', text: 'while s ≤ m do', indent: 1 },
      { loop: 'calc', text: 'i ← i + 1', indent: 2 },
      { loop: 'calc', text: 's ← s + i', indent: 2 },
      { loop: 'calc', text: 'return s', indent: 1 },
    ],
    nMin: 4,
    nMax: 200,
    nInit: 20,
    counters: [
      {
        name: 'εξωτερικό for (i: 1..n)',
        color: 'blue',
        count: (n) => n,
        asymptotic: 'Θ(n)',
        why: 'Πάει 1 ως n.',
      },
      {
        name: 'εσωτερικό for (j: 1..i)',
        color: 'emerald',
        count: (n) => (n * (n + 1)) / 2,
        asymptotic: 'Θ(n²)',
        why: 'Σ_{i=1}^n i = n(n+1)/2.',
      },
      {
        name: 'CALC(j) ≈ √j — άθροισμα κλήσεων',
        color: 'amber',
        count: (n) => {
          let total = 0
          for (let i = 1; i <= n; i++) for (let j = 1; j <= i; j++) total += Math.sqrt(2 * j)
          return Math.round(total)
        },
        asymptotic: 'Θ(n^{5/2})',
        why: 'CALC(m) σταματάει όταν s = i(i+1)/2 > m ⇒ i ≈ √(2m). Σ_i Σ_{j=1}^i √j = Σ_i i^{3/2} = Θ(n^{5/2}).',
      },
    ],
    correctAnswer: 'Θ(n^{5/2})',
    takeaway:
      'CALC κρύβει αθροιστή 1+2+...+i — σταματά στο i ≈ √(2m), δηλαδή κόστος O(√m). Σύνθεση με τους εξωτερικούς δίνει n^{5/2}.',
  },

  /* #22 Algo 2 — front-set-4-thema4-b: j *= 3 inner */
  'front-set-4-thema4-b': {
    id: 'front-set-4-thema4-b',
    title: 'Φροντιστηριακό Σετ #4 · Θέμα 4, Algorithm 2',
    code: [
      { loop: 'init', text: 'arg ← 0', indent: 0 },
      { loop: 'outer', text: 'for i ← 1 to n do', indent: 0 },
      { loop: 'inner', text: 'for j ← 1 to n with step (2·j) do', indent: 1 },
      { loop: 'inner', text: 'arg ← CALC(j)', indent: 2 },
      { loop: 'calc', text: 'procedure CALC(m):', indent: 0 },
      { loop: 'calc', text: 's ← m', indent: 1 },
      { loop: 'calc', text: 'while s ≤ 2·m do', indent: 1 },
      { loop: 'calc', text: 's ← s + 1', indent: 2 },
      { loop: 'calc', text: 'return s', indent: 1 },
    ],
    nMin: 4,
    nMax: 500,
    nInit: 50,
    counters: [
      {
        name: 'εξωτερικό for (i: 1..n)',
        color: 'blue',
        count: (n) => n,
        asymptotic: 'Θ(n)',
        why: 'Πάει 1 ως n.',
      },
      {
        name: 'εσωτερικό for (j: 1, 3, 9, 27, …) ανά i',
        color: 'emerald',
        count: (n) => {
          let c = 0
          let j = 1
          while (j <= n) {
            c++
            j *= 3
          }
          return c
        },
        asymptotic: 'Θ(log₃ n)',
        why: 'j ← j + 2j = 3j. Παίρνει τιμές 1, 3, 9, 27, …',
      },
      {
        name: 'CALC(j) = m+1 — άθροισμα κλήσεων ανά i',
        color: 'amber',
        count: (n) => {
          let s = 0
          let j = 1
          while (j <= n) {
            s += j + 1
            j *= 3
          }
          return s
        },
        asymptotic: 'Θ(n) (γεωμετρική σειρά)',
        why: 'CALC(m) = m+1. Σ_{j∈{1,3,9,…,n}} j = (3·n − 1)/2 = Θ(n).',
      },
    ],
    correctAnswer: 'O(n²) — δηλαδή n · O(n)',
    takeaway:
      'Πολλαπλασιαστικό βήμα (j *= 3) → logarithmic επαναλήψεις. Γεωμετρική σειρά κόστους αθροίζει στον μεγαλύτερο όρο, που είναι ο τελευταίος.',
  },
}

type Props = {
  preset: string
}

const LOOP_FALLBACK = Object.values(LOOP_PRESETS)[0]

export function LoopComplexityTrace({ preset: presetId }: Props) {
  const lookup = LOOP_PRESETS[presetId]
  const preset = lookup ?? LOOP_FALLBACK

  const [n, setN] = useState(preset.nInit)

  const counts = useMemo(
    () => preset.counters.map((c) => ({ ...c, n: c.count(n) })),
    [preset.counters, n],
  )

  const maxCount = Math.max(...counts.map((c) => c.n), 1)

  if (!lookup) {
    return (
      <div className="my-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
        LoopComplexityTrace: άγνωστο preset «{presetId}».
      </div>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{preset.title}</div>
        <span className="font-mono text-[11px] text-fg-subtle">τρέξε στο n που θες</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Code panel */}
        <div className="rounded-lg border border-border bg-bg-soft p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
            Ψευδοκώδικας
          </div>
          <pre className="overflow-x-auto font-mono text-[12px] leading-[1.55]">
            {preset.code.map((row, i) => (
              <div
                key={i}
                className={cn(
                  'whitespace-pre',
                  row.trap && 'rounded bg-rose-100/70 px-1 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100',
                )}
                style={{ paddingLeft: `${row.indent * 14}px` }}
              >
                {row.text}
                {row.trap && (
                  <span className="ml-2 text-[10px] uppercase tracking-wider opacity-70">trap</span>
                )}
              </div>
            ))}
          </pre>
        </div>

        {/* Counter panel */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="font-mono text-fg-muted">n</span>
            <input
              type="range"
              min={preset.nMin}
              max={preset.nMax}
              step={1}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-accent"
            />
            <span className="w-16 text-right font-mono">{n}</span>
          </label>

          <div className="space-y-1.5">
            {counts.map((c, i) => {
              const widthPct = (c.n / maxCount) * 100
              return (
                <div key={i} className="rounded border border-border bg-bg-soft p-2">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-[11.5px]">
                    <span className="font-medium text-fg">{c.name}</span>
                    <span className="font-mono text-fg-subtle">{c.asymptotic}</span>
                  </div>
                  <div className="relative h-5 rounded bg-bg-elevated">
                    <div
                      className={cn(
                        'absolute inset-y-0 left-0 flex items-center justify-end pr-2 text-[10.5px] font-bold font-mono transition-all duration-200 ease-out',
                        COLORS[c.color as keyof typeof COLORS],
                        widthPct < 12 && 'justify-start pl-2',
                      )}
                      style={{ width: `${Math.max(2, widthPct)}%`, borderRadius: 'inherit' }}
                    >
                      {c.n.toLocaleString('el-GR')}
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] italic leading-snug text-fg-muted">{c.why}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Answer block */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {preset.trapAnswer && (
          <div className="rounded-md border border-rose-300/50 bg-rose-50/70 px-3 py-2 text-[12.5px] leading-relaxed text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">παγίδα  </span>
            {preset.trapAnswer}
          </div>
        )}
        <div
          className={cn(
            'rounded-md border-2 border-emerald-500/60 bg-emerald-50 px-3 py-2 text-[13px] leading-relaxed text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100',
            !preset.trapAnswer && 'sm:col-span-2',
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">σωστή τάξη  </span>
          <span className="font-mono font-bold">{preset.correctAnswer}</span>
        </div>
      </div>

      <div className="mt-2 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        {preset.takeaway}
      </div>
    </section>
  )
}
