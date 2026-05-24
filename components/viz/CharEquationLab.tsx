'use client'

/**
 * CharEquationLab — characteristic equation, walked through.
 *
 * For Fibonacci-style homogeneous linear recurrences. The student
 * needs to see (a) the «τι κάνουμε γενικά» recipe — guess x^n, plug
 * in, get a polynomial — and (b) the two flavors: distinct roots
 * (Fibonacci → Binet) vs double root (multiplicity-2 → ×n trick).
 *
 * Two tabs:
 *  • Fib — Fibonacci: x² − x − 1 = 0, distinct roots φ, ψ; live plot
 *    of F(n) vs the dominant φⁿ term as n grows.
 *  • Double — T(n) = 4T(n-1) − 4T(n-2): (x−2)² = 0, single root 2 of
 *    multiplicity 2; general form λ₁·2ⁿ + λ₂·n·2ⁿ; the «×n trick»
 *    badge is highlighted.
 *
 * Each tab walks through (1) plug in x^n, (2) characteristic polynomial,
 * (3) roots, (4) general solution, (5) constants from initial conditions,
 * (6) closed form + asymptotic class.
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

type Mode = 'fib' | 'double'

const PHI = (1 + Math.sqrt(5)) / 2
const PSI = (1 - Math.sqrt(5)) / 2

function fib(n: number): number {
  if (n < 2) return n
  let a = 0
  let b = 1
  for (let i = 2; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}

function double(n: number): number {
  // T(0)=3, T(1)=8, T(n) = 4T(n-1) − 4T(n-2). Closed form: (n+3)·2ⁿ.
  if (n === 0) return 3
  if (n === 1) return 8
  return (n + 3) * 2 ** n
}

type Props = {
  /** Optional default tab. */
  initialMode?: Mode
}

export function CharEquationLab({ initialMode = 'fib' }: Props = {}) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [step, setStep] = useState(0)
  const [n, setN] = useState(10)

  // Reset step when switching mode
  useEffect(() => setStep(0), [mode])

  const STEPS_FIB = useMemo(
    () => [
      {
        title: '① Δοκιμαστική λύση xⁿ',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              Η <InlineMath>{'F(n) = F(n-1) + F(n-2)'}</InlineMath> είναι{' '}
              <strong>ομογενής γραμμική</strong>. Δοκιμάζουμε{' '}
              <InlineMath>{'F(n) = x^n'}</InlineMath>:
            </p>
            <BlockMath>{'x^n = x^{n-1} + x^{n-2}'}</BlockMath>
          </>
        ),
      },
      {
        title: '② Χαρακτηριστική εξίσωση',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              Διαιρούμε με <InlineMath>{'x^{n-2}'}</InlineMath> (μη μηδέν) και μένει
              η <strong>χαρακτηριστική εξίσωση</strong>:
            </p>
            <BlockMath>{'x^2 - x - 1 = 0'}</BlockMath>
          </>
        ),
      },
      {
        title: '③ Ρίζες',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              Διακρίνουσα <InlineMath>{'\\Delta = 5'}</InlineMath> →{' '}
              <strong>δύο διαφορετικές</strong> ρίζες:
            </p>
            <BlockMath>{`x_1 = \\frac{1+\\sqrt5}{2} \\approx ${PHI.toFixed(4)} \\quad (\\text{χρυσή τομή } \\varphi), \\qquad x_2 = \\frac{1-\\sqrt5}{2} \\approx ${PSI.toFixed(4)}`}</BlockMath>
          </>
        ),
      },
      {
        title: '④ Γενική λύση',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              Δύο διαφορετικές ρίζες ⇒ γενική λύση{' '}
              <InlineMath>{'F_n = \\lambda_1 x_1^n + \\lambda_2 x_2^n'}</InlineMath>:
            </p>
            <BlockMath>{'F_n = \\lambda_1 \\varphi^n + \\lambda_2 \\psi^n'}</BlockMath>
          </>
        ),
      },
      {
        title: '⑤ Σταθερές από F₀=0, F₁=1',
        body: (
          <>
            <BlockMath>{'F_0 = 0 \\Rightarrow \\lambda_1 + \\lambda_2 = 0'}</BlockMath>
            <BlockMath>{'F_1 = 1 \\Rightarrow \\lambda_1\\varphi + \\lambda_2\\psi = 1'}</BlockMath>
            <BlockMath>{'\\lambda_1 = \\tfrac{1}{\\sqrt5},\\ \\lambda_2 = -\\tfrac{1}{\\sqrt5}'}</BlockMath>
          </>
        ),
      },
      {
        title: '⑥ Τύπος του Binet + ασυμπτωτική',
        body: (
          <>
            <BlockMath>{'F_n = \\frac{1}{\\sqrt5}\\,\\varphi^n - \\frac{1}{\\sqrt5}\\,\\psi^n'}</BlockMath>
            <p className="text-sm text-fg-muted">
              Επειδή <InlineMath>{'|\\psi| < 1'}</InlineMath>, ο δεύτερος όρος
              τείνει στο μηδέν — κυριαρχεί ο πρώτος:
            </p>
            <BlockMath>{'F_n = \\Theta(\\varphi^n) \\quad (\\text{εκθετική αύξηση})'}</BlockMath>
          </>
        ),
      },
    ],
    [],
  )

  const STEPS_DOUBLE = useMemo(
    () => [
      {
        title: '① Δοκιμαστική λύση xⁿ',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              <InlineMath>{'T(n) = 4T(n-1) - 4T(n-2)'}</InlineMath> — ομογενής
              γραμμική, δοκιμάζουμε <InlineMath>{'T(n) = x^n'}</InlineMath>:
            </p>
            <BlockMath>{'x^n - 4x^{n-1} + 4x^{n-2} = 0'}</BlockMath>
          </>
        ),
      },
      {
        title: '② Χαρακτηριστική εξίσωση',
        body: (
          <>
            <BlockMath>{'x^2 - 4x + 4 = 0 \\;\\Leftrightarrow\\; (x-2)^2 = 0'}</BlockMath>
          </>
        ),
      },
      {
        title: '③ Διπλή ρίζα — η παγίδα',
        body: (
          <>
            <p className="text-sm text-fg-muted">
              <strong>Μία ρίζα με πολλαπλότητα 2:</strong>{' '}
              <InlineMath>{'x_1 = x_2 = 2'}</InlineMath>. Δεν αρκούν δύο
              πανομοιότυποι όροι — πολλαπλασιάζουμε τον δεύτερο επί{' '}
              <InlineMath>{'n'}</InlineMath>:
            </p>
            <div className="rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-sm text-fg">
              <strong>Το ×n κόλπο:</strong> για ρίζα <InlineMath>{'r'}</InlineMath>{' '}
              πολλαπλότητας 2, η γενική λύση είναι{' '}
              <InlineMath>{'\\lambda_1 r^n + \\lambda_2 n\\,r^n'}</InlineMath>{' '}
              — όχι <InlineMath>{'\\lambda_1 r^n + \\lambda_2 r^n'}</InlineMath>,
              που θα ήταν ένας μόνο όρος.
            </div>
          </>
        ),
      },
      {
        title: '④ Γενική λύση',
        body: <BlockMath>{'T_n = \\lambda_1\\,2^n + \\lambda_2\\,n\\,2^n'}</BlockMath>,
      },
      {
        title: '⑤ Σταθερές από T₀=3, T₁=8',
        body: (
          <>
            <BlockMath>{'T_0 = 3: \\;\\; \\lambda_1 \\cdot 1 + \\lambda_2 \\cdot 0 = \\lambda_1 = 3'}</BlockMath>
            <BlockMath>{'T_1 = 8: \\;\\; 3 \\cdot 2 + \\lambda_2 \\cdot 1 \\cdot 2 = 6 + 2\\lambda_2 = 8 \\Rightarrow \\lambda_2 = 1'}</BlockMath>
          </>
        ),
      },
      {
        title: '⑥ Κλειστός τύπος + ασυμπτωτική',
        body: (
          <>
            <BlockMath>{'T_n = 3\\cdot 2^n + n\\cdot 2^n = (n+3)\\,2^n'}</BlockMath>
            <p className="text-sm text-fg-muted">
              Άρα <InlineMath>{'T_n = \\Theta(n\\,2^n)'}</InlineMath> — εκθετική με
              έναν επιπλέον γραμμικό παράγοντα από το ×n κόλπο.
            </p>
          </>
        ),
      },
    ],
    [],
  )

  const steps = mode === 'fib' ? STEPS_FIB : STEPS_DOUBLE
  const totalSteps = steps.length

  // Build small table of values F(n) (or T(n)) for the panel
  const sample = useMemo(() => {
    const out: { n: number; value: number; dominant: number }[] = []
    for (let i = 0; i <= n; i++) {
      const value = mode === 'fib' ? fib(i) : double(i)
      const dominant = mode === 'fib' ? PHI ** i / Math.sqrt(5) : (i + 3) * 2 ** i
      out.push({ n: i, value, dominant })
    }
    return out
  }, [n, mode])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χαρακτηριστική εξίσωση — δύο τρόποι, δύο ρίζες
        </div>
      </div>

      <div className="mb-3 inline-flex rounded-md border border-border bg-bg-soft/40 p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setMode('fib')}
          className={cn(
            'rounded px-3 py-1 font-semibold transition-colors',
            mode === 'fib' ? 'bg-accent text-accent-foreground' : 'text-fg-muted',
          )}
        >
          Fibonacci — διαφορετικές ρίζες
        </button>
        <button
          type="button"
          onClick={() => setMode('double')}
          className={cn(
            'rounded px-3 py-1 font-semibold transition-colors',
            mode === 'double' ? 'bg-accent text-accent-foreground' : 'text-fg-muted',
          )}
        >
          4T(n−1)−4T(n−2) — διπλή ρίζα
        </button>
      </div>

      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className={cn('space-y-1', i > 0 ? 'mt-4 border-t border-border pt-3' : '')}>
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {s.title}
            </div>
            {s.body}
          </div>
        ))}
      </div>

      {/* Values + slider */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 px-3 py-2">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Πραγματικές τιμές</span>
          <span>n = {n}</span>
        </div>
        <input
          type="range"
          min={3}
          max={mode === 'fib' ? 30 : 12}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mb-2 h-1.5 w-full cursor-pointer accent-accent"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {sample.slice(-12).map((row) => (
            <div
              key={row.n}
              className="rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono text-xs"
            >
              <div className="text-fg-subtle">
                {mode === 'fib' ? 'F' : 'T'}({row.n})
              </div>
              <div className="text-fg">
                {row.value > 1e9 ? row.value.toExponential(2) : row.value.toLocaleString('el-GR')}
              </div>
              <div className="text-[10px] text-fg-subtle">
                κυρ. όρος ≈{' '}
                {row.dominant > 1e9 ? row.dominant.toExponential(2) : row.dominant.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg disabled:opacity-40"
        >
          ← Προηγούμενο
        </button>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {totalSteps}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
          disabled={step === totalSteps - 1}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο →
        </button>
      </div>
    </section>
  )
}
