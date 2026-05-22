'use client'

/**
 * ComplexityCasesExplorer — feel βέλτιστη / χείριστη / μέση περίπτωση.
 *
 * The page lists three formulas — min, max, weighted sum — over the set D_n
 * of all instances of dimension n. For a struggling student those are just
 * symbols. The viz makes the set REAL:
 *
 *   • Pick algorithm (linear search ⇄ dot product) and dimension n.
 *   • For linear search, the n scenarios «x στη θέση k» appear as bars whose
 *     heights ARE the cost. Click «βέλτιστη» → min bar glows; «χείριστη» →
 *     max bar; «μέση» → weighted-average line, with the formula spelled out
 *     and evaluated.
 *   • For dot product, every scenario has cost = n: all bars are equal. The
 *     three buttons all light up everything. That's the lecture's
 *     «παρατήρηση» — when the work is input-independent, the three cases
 *     collapse — made visible.
 *
 * Built for L01.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Algo = 'linear' | 'dot'
type Case = 'best' | 'worst' | 'avg' | null

const N_MIN = 3
const N_MAX = 8

// Three fixed dot-product example pairs — sliced to n at render time.
const DOT_SAMPLES = [
  {
    label: 'παράδειγμα Α',
    a: [2, 7, 1, 8, 3, 9, 4, 5],
    b: [4, 1, 5, 9, 2, 6, 5, 3],
  },
  {
    label: 'παράδειγμα Β',
    a: [0, 5, 0, 5, 0, 5, 0, 5],
    b: [3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    label: 'παράδειγμα Γ',
    a: [9, 1, 2, 3, 4, 5, 6, 7],
    b: [8, 7, 6, 5, 4, 3, 2, 1],
  },
]

type Scenario = {
  key: string
  desc: React.ReactNode
  cost: number
  // probability under the convention used in the lecture (1/n for linear,
  // doesn't matter for dot since all equal)
  p: number
}

function linearScenarios(n: number): Scenario[] {
  return Array.from({ length: n }, (_, k) => ({
    key: `pos${k + 1}`,
    desc: (
      <>
        x στη θέση <span className="font-mono font-semibold text-fg">{k + 1}</span>
      </>
    ),
    cost: k + 1,
    p: 1 / n,
  }))
}

function dotScenarios(n: number): Scenario[] {
  return DOT_SAMPLES.map((ex, i) => ({
    key: `dot-${i}`,
    desc: (
      <span className="font-mono text-[11px] text-fg-muted">
        a = [{ex.a.slice(0, n).join(',')}]&nbsp;·&nbsp;b = [
        {ex.b.slice(0, n).join(',')}]
      </span>
    ),
    cost: n,
    p: 1 / DOT_SAMPLES.length,
  }))
}

export function ComplexityCasesExplorer() {
  const [algo, setAlgo] = useState<Algo>('linear')
  const [n, setN] = useState(5)
  const [sel, setSel] = useState<Case>(null)

  const scenarios = algo === 'linear' ? linearScenarios(n) : dotScenarios(n)
  const minCost = Math.min(...scenarios.map((s) => s.cost))
  const maxCost = Math.max(...scenarios.map((s) => s.cost))
  const avg =
    algo === 'linear' ? (n + 1) / 2 : n // by construction; matches the page's derivation
  const barMax = Math.max(maxCost, 1)

  const selected = (cost: number): 'on' | 'avg' | 'off' => {
    if (sel === null) return 'off'
    if (sel === 'avg') return 'avg'
    if (sel === 'best' && cost === minCost) return 'on'
    if (sel === 'worst' && cost === maxCost) return 'on'
    return 'off'
  }

  // verdict
  let verdictTone: 'best' | 'worst' | 'avg' | 'idle' = 'idle'
  let verdictTitle = ''
  let verdictMath: React.ReactNode = null
  let verdictGloss = ''
  if (sel === 'best') {
    verdictTone = 'best'
    verdictTitle = 'Βέλτιστη περίπτωση'
    if (algo === 'linear') {
      verdictMath = (
        <>
          C<sub>βπ</sub>(n) = min{' '}
          <span className="text-fg-subtle">{'{ '}</span>
          1, 2, …, {n}
          <span className="text-fg-subtle">{' }'}</span> ={' '}
          <strong className="text-fg">1</strong>
        </>
      )
      verdictGloss =
        'Το «πιο εύκολο» στιγμιότυπο διάστασης n: το x είναι αμέσως στη θέση 1, και ο αλγόριθμος σταματάει μετά την πρώτη σύγκριση.'
    } else {
      verdictMath = (
        <>
          C<sub>βπ</sub>(n) = min{' '}
          <span className="text-fg-subtle">{'{ '}</span>
          {n}, {n}, {n}
          <span className="text-fg-subtle">{' }'}</span> ={' '}
          <strong className="text-fg">{n}</strong>
        </>
      )
      verdictGloss =
        'Όλα τα στιγμιότυπα έχουν το ίδιο κόστος — δεν υπάρχει «πιο εύκολο».'
    }
  } else if (sel === 'worst') {
    verdictTone = 'worst'
    verdictTitle = 'Χείριστη περίπτωση'
    if (algo === 'linear') {
      verdictMath = (
        <>
          C<sub>χπ</sub>(n) = max{' '}
          <span className="text-fg-subtle">{'{ '}</span>
          1, 2, …, {n}
          <span className="text-fg-subtle">{' }'}</span> ={' '}
          <strong className="text-fg">{n}</strong>
        </>
      )
      verdictGloss =
        'Το «πιο δύσκολο» στιγμιότυπο: το x είναι στη θέση n (ή απουσιάζει εντελώς) και ο αλγόριθμος αναγκάζεται να ελέγξει όλο τον πίνακα.'
    } else {
      verdictMath = (
        <>
          C<sub>χπ</sub>(n) = max{' '}
          <span className="text-fg-subtle">{'{ '}</span>
          {n}, {n}, {n}
          <span className="text-fg-subtle">{' }'}</span> ={' '}
          <strong className="text-fg">{n}</strong>
        </>
      )
      verdictGloss =
        'Πάλι n — δεν υπάρχει «πιο δύσκολο»: ο βρόχος τρέχει πάντα ακριβώς n φορές, ό,τι κι αν δώσεις.'
    }
  } else if (sel === 'avg') {
    verdictTone = 'avg'
    verdictTitle = 'Μέση περίπτωση'
    if (algo === 'linear') {
      verdictMath = (
        <>
          C<sub>μπ</sub>(n) ={' '}
          <span className="text-fg-subtle">(1 + 2 + … + {n}) /</span> {n} ={' '}
          <strong className="text-fg">
            (n+1)/2 = {(n + 1) / 2}
          </strong>
        </>
      )
      verdictGloss = `Σταθμισμένος μέσος των ${n} σεναρίων (ομοιόμορφη κατανομή): καθένα συμβαίνει με πιθανότητα 1/${n}.`
    } else {
      verdictMath = (
        <>
          C<sub>μπ</sub>(n) ={' '}
          <span className="text-fg-subtle">
            (1/3)·{n} + (1/3)·{n} + (1/3)·{n}
          </span>{' '}
          = <strong className="text-fg">{n}</strong>
        </>
      )
      verdictGloss =
        'Όταν όλα τα κόστη συμπίπτουν, ό,τι κατανομή κι αν δώσεις, ο μέσος βγαίνει η ίδια τιμή.'
    }
  } else {
    verdictGloss =
      algo === 'linear'
        ? `Διάλεξε «βέλτιστη», «χείριστη» ή «μέση» — οι μπάρες δείχνουν το κόστος κάθε στιγμιοτύπου του συνόλου D_${n}.`
        : `Πρόσεξε: όλες οι μπάρες έχουν το ίδιο ύψος (=${n}). Δοκίμασε και τις τρεις περιπτώσεις.`
  }

  // collapse banner — only shows for dot product when all three coincide
  const showCollapseBanner = algo === 'dot'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + algorithm tabs */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Οι τρεις περιπτώσεις — σε δράση
        </div>
        <div className="flex gap-1">
          {(['linear', 'dot'] as Algo[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAlgo(a)
                setSel(null)
              }}
              className={cn(
                'rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
                a === algo
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-fg-muted hover:text-fg',
              )}
            >
              {a === 'linear' ? 'Γραμμική αναζήτηση' : 'Αριθμητικό γινόμενο'}
            </button>
          ))}
        </div>
      </div>

      {/* n slider */}
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="cases-n"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Διάσταση
        </label>
        <input
          id="cases-n"
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={n}
          onChange={(e) => {
            setN(Number(e.target.value))
            setSel(null)
          }}
          className="flex-1 accent-accent"
        />
        <div className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
          n = {n}
        </div>
      </div>

      {/* scenarios list */}
      <div>
        <div className="mb-1 flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Σύνολο στιγμιοτύπων D<sub>{n}</sub> · κόστος κάθε στιγμιοτύπου</span>
          <span className="font-mono">{scenarios.length} σενάρια</span>
        </div>
        <div className="space-y-1.5">
          {scenarios.map((s) => {
            const st = selected(s.cost)
            const width = (s.cost / barMax) * 100
            return (
              <div
                key={s.key}
                className={cn(
                  'flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors',
                  st === 'on' && sel === 'best' && 'border-emerald-500/60 bg-emerald-500/10',
                  st === 'on' && sel === 'worst' && 'border-red-500/60 bg-red-500/10',
                  st === 'avg' && 'border-sky-500/60 bg-sky-500/10',
                  st === 'off' && 'border-border bg-bg-soft/30',
                )}
              >
                <div className="w-32 shrink-0 text-xs sm:w-44">{s.desc}</div>
                <div className="relative flex-1 overflow-hidden rounded bg-bg-soft">
                  <div
                    className={cn(
                      'h-3.5 rounded transition-all',
                      st === 'on' && sel === 'best' && 'bg-emerald-500/80',
                      st === 'on' && sel === 'worst' && 'bg-red-500/80',
                      st === 'avg' && 'bg-sky-500/50',
                      st === 'off' && 'bg-accent/40',
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-fg">
                  cost = {s.cost}
                </span>
              </div>
            )
          })}

          {/* the average line — drawn over the bars when avg is selected */}
          {sel === 'avg' ? (
            <div className="relative pt-1">
              <div className="absolute inset-x-0 top-0 flex items-center gap-2 text-[0.65rem] text-sky-700 dark:text-sky-300">
                <span className="ml-32 inline-block sm:ml-44">
                  μέσος όρος ≈ {avg.toFixed(2)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* case buttons */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <CaseButton active={sel === 'best'} tone="best" onClick={() => setSel('best')}>
          Βέλτιστη <span className="font-mono">(min)</span>
        </CaseButton>
        <CaseButton active={sel === 'worst'} tone="worst" onClick={() => setSel('worst')}>
          Χείριστη <span className="font-mono">(max)</span>
        </CaseButton>
        <CaseButton active={sel === 'avg'} tone="avg" onClick={() => setSel('avg')}>
          Μέση <span className="font-mono">(Σ p·κ)</span>
        </CaseButton>
        <button
          type="button"
          onClick={() => setSel(null)}
          className="ml-auto rounded-md border border-border px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-bg-soft"
        >
          καθαρό
        </button>
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[4.5rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          verdictTone === 'best' &&
            'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
          verdictTone === 'worst' &&
            'border-red-500/50 bg-red-500/10 text-red-950 dark:text-red-100',
          verdictTone === 'avg' &&
            'border-sky-500/50 bg-sky-500/10 text-sky-950 dark:text-sky-100',
          verdictTone === 'idle' && 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {verdictTitle ? (
          <>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">
                {verdictTitle}
              </span>
              <span className="font-mono text-[13px]">{verdictMath}</span>
            </div>
            <div className="text-fg-muted">{verdictGloss}</div>
          </>
        ) : (
          verdictGloss
        )}
      </div>

      {showCollapseBanner ? (
        <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
          <strong>Παρατήρηση.</strong> Στο αριθμητικό γινόμενο ο αλγόριθμος κάνει
          την ίδια δουλειά για ΟΛΑ τα στιγμιότυπα ίδιας διάστασης — άρα{' '}
          <span className="font-mono">min = max = Σ p·κ</span>. Οι τρεις τύποι
          πολυπλοκότητας <strong>συμπίπτουν</strong>.
        </div>
      ) : null}
    </section>
  )
}

function CaseButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean
  tone: 'best' | 'worst' | 'avg'
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors',
        !active && 'border-border text-fg-muted hover:bg-bg-soft hover:text-fg',
        active &&
          tone === 'best' &&
          'border-emerald-500/70 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100',
        active &&
          tone === 'worst' &&
          'border-red-500/70 bg-red-500/15 text-red-900 dark:text-red-100',
        active &&
          tone === 'avg' &&
          'border-sky-500/70 bg-sky-500/15 text-sky-900 dark:text-sky-100',
      )}
    >
      {children}
    </button>
  )
}
