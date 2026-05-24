'use client'

/**
 * HierarchyRace — watch the complexity hierarchy lock in as n grows.
 *
 * The static SVG on the page just CLAIMS «1 ≺ log n ≺ n ≺ n·log n ≺ n² ≺
 * 2ⁿ ≺ n!». A struggling student copies that into their notes and moves
 * on. They have not seen WHY it's true, and they have not seen that for
 * *small* n the claim doesn't even hold (at n = 3, n² > 2ⁿ > n! is the
 * actual order).
 *
 * The viz lets the student crank n with a slider (or hit «παίξε» to
 * animate it) and watch:
 *
 *   • Rows render in the static asymptotic order. Each row's bar width
 *     is log₂(value+1) normalised against the biggest current value —
 *     so the bars stay legible across 20 orders of magnitude.
 *
 *   • The «τρέχουσα ταξινόμηση» strip shows what the order ACTUALLY is
 *     right now, by value. At n = 3 it shows n² > 2ⁿ > n·log n > n! >
 *     n > log n > 1 — wrong vs the asymptotic order. Crossovers light
 *     up as the slider passes them: 2ⁿ takes n² at n = 5; n! takes 2ⁿ
 *     at n = 4 already.
 *
 *   • The verdict pane reports the asymptotic claim + whether it
 *     currently holds for this n.
 *
 * Built for L02.
 */

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Klass = {
  id: string
  label: string
  formula: string
  family: 'const' | 'log' | 'poly' | 'exp' | 'fact'
  f: (n: number) => number
}

const KLASSES: Klass[] = [
  { id: 'one', label: '1', formula: 'σταθερή', family: 'const', f: () => 1 },
  { id: 'log', label: 'log n', formula: 'log₂ n', family: 'log', f: (n) => Math.log2(n) },
  { id: 'n', label: 'n', formula: 'γραμμική', family: 'poly', f: (n) => n },
  { id: 'nlogn', label: 'n·log n', formula: 'n · log₂ n', family: 'poly', f: (n) => n * Math.log2(n) },
  { id: 'n2', label: 'n²', formula: 'τετραγωνική', family: 'poly', f: (n) => n * n },
  { id: 'exp', label: '2ⁿ', formula: 'εκθετική', family: 'exp', f: (n) => 2 ** n },
  { id: 'fact', label: 'n!', formula: 'παραγοντική', family: 'fact', f: factorial },
]

function factorial(n: number): number {
  let p = 1
  for (let k = 2; k <= n; k++) p *= k
  return p
}

const FAMILY_TONE: Record<Klass['family'], { bar: string; chip: string; text: string }> = {
  const: { bar: 'bg-emerald-500/70', chip: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300', text: 'πολυωνυμικό' },
  log: { bar: 'bg-emerald-500/70', chip: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300', text: 'πολυωνυμικό' },
  poly: { bar: 'bg-sky-500/75', chip: 'border-sky-500/40 text-sky-700 dark:text-sky-300', text: 'πολυωνυμικό' },
  exp: { bar: 'bg-orange-500/75', chip: 'border-orange-500/40 text-orange-700 dark:text-orange-300', text: 'εκθετικό' },
  fact: { bar: 'bg-red-500/75', chip: 'border-red-500/40 text-red-700 dark:text-red-300', text: 'παραγοντικό' },
}

const N_MIN = 2
const N_MAX = 22

function fmt(v: number): string {
  if (v >= 1e9) return v.toExponential(2)
  if (v >= 1000) return Math.round(v).toLocaleString('el-GR')
  if (v >= 10) return v.toFixed(1).replace(/\.0$/, '')
  return v.toFixed(2).replace(/\.?0+$/, '')
}

export function HierarchyRace() {
  const [n, setN] = useState(8)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)

  // Auto-play loop: bumps n by 1 every ~250ms.
  useEffect(() => {
    if (!playing) return
    let active = true
    function tick(t: number) {
      if (!active) return
      if (t - lastTickRef.current > 260) {
        lastTickRef.current = t
        setN((prev) => {
          if (prev >= N_MAX) {
            setPlaying(false)
            return prev
          }
          return prev + 1
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      active = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing])

  const values = KLASSES.map((k) => ({ k, v: k.f(n) }))
  const maxLog = Math.max(...values.map(({ v }) => Math.log2(v + 1)), 1)

  // Current ranking by value (descending).
  const byValueDesc = [...values].sort((a, b) => b.v - a.v)
  // The asymptotic ordering ≺ holds iff every consecutive pair in KLASSES
  // order has value(higher) > value(lower) — strictly. Ties (e.g. n² = 2ⁿ
  // at n = 4) count as "not yet locked in".
  const ordersMatch = values.every((vk, i) => i === 0 || values[i - 1].v < vk.v)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Η ιεραρχία πολυπλοκοτήτων — εν δράσει
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
          n = {n}
        </span>
      </div>

      {/* n slider + play button */}
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="hr-n"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          μέγεθος n
        </label>
        <input
          id="hr-n"
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={n}
          onChange={(e) => {
            setN(Number(e.target.value))
            setPlaying(false)
          }}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <button
          type="button"
          onClick={() => {
            if (n >= N_MAX) setN(N_MIN)
            setPlaying((p) => !p)
          }}
          className={cn(
            'shrink-0 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
            playing
              ? 'border-accent bg-accent text-accent-fg'
              : 'border-border text-fg-muted hover:bg-bg-soft hover:text-fg',
          )}
        >
          {playing ? '⏸ παύση' : '▶ παίξε'}
        </button>
      </div>

      {/* rows */}
      <div className="space-y-1">
        {values.map(({ k, v }) => {
          const tone = FAMILY_TONE[k.family]
          const bar = (Math.log2(v + 1) / maxLog) * 100
          const rankByValue = byValueDesc.findIndex(({ k: kk }) => kk.id === k.id) + 1
          return (
            <div
              key={k.id}
              className="flex items-center gap-2 rounded-md border border-border bg-bg-soft/30 px-2 py-1.5"
            >
              <span
                className={cn(
                  'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-bg-elevated text-[10px] font-bold',
                  tone.chip,
                )}
                title="τρέχουσα κατάταξη (1 = μεγαλύτερο)"
              >
                {rankByValue}
              </span>
              <div className="w-28 shrink-0 sm:w-36">
                <div className="font-mono text-sm font-semibold text-fg">{k.label}</div>
                <div className="text-[10px] text-fg-subtle">{k.formula}</div>
              </div>
              <div className="relative flex-1 overflow-hidden rounded bg-bg-soft">
                <div
                  className={cn('h-3.5 rounded transition-all duration-200', tone.bar)}
                  style={{ width: `${Math.max(bar, 0.5)}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-xs font-bold tabular-nums text-fg">
                {fmt(v)}
              </span>
            </div>
          )
        })}
      </div>

      {/* ordering verdict */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 rounded-lg border px-3 py-2 text-sm leading-relaxed',
          ordersMatch
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
            : 'border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100',
        )}
      >
        <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider opacity-80">
          {ordersMatch
            ? `✓ Στο n = ${n}, η σειρά τιμών συμπίπτει με την ασυμπτωτική σειρά`
            : `⚠ Στο n = ${n}, η σειρά τιμών ΔΕΝ συμπίπτει ακόμα με την ασυμπτωτική`}
        </div>
        <div className="font-mono text-[12px] leading-relaxed">
          {byValueDesc
            .slice()
            .reverse()
            .map(({ k }, i, arr) => (
              <span key={k.id}>
                {k.label}
                {i < arr.length - 1 ? <span className="mx-1 text-fg-subtle">≺</span> : null}
              </span>
            ))}
        </div>
        <div className="mt-1 text-xs text-fg-muted">
          {ordersMatch ? (
            <>
              Η ιεραρχία έχει «κλειδώσει». Από εδώ και πέρα τα χάσματα{' '}
              <em>μεγαλώνουν</em> εκθετικά — δες τη μπάρα του <span className="font-mono">n!</span>{' '}
              να ρουφάει όλο τον χώρο.
            </>
          ) : (
            <>
              Σε τόσο μικρό n, τα εκθετικά/παραγοντικά μεγέθη δεν έχουν προλάβει να
              «εκραγούν». Η ασυμπτωτική σειρά «1 ≺ log n ≺ n ≺ n log n ≺ n² ≺ 2ⁿ ≺ n!»
              ισχύει από <span className="font-mono">n ≈ 5</span> και πέρα — δοκίμασε να
              σύρεις το slider πιο δεξιά.
            </>
          )}
        </div>
      </div>
    </section>
  )
}
