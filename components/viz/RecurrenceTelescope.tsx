'use client'

/**
 * RecurrenceTelescope — see the cancellation happen.
 *
 * Telescoping is a manipulation that students FIRST need to see, then
 * trust. For T(n) = T(n-1) + g(n), we stack n equations:
 *   T(1) - T(0) = g(1)
 *   T(2) - T(1) = g(2)
 *   …
 *   T(n) - T(n-1) = g(n)
 * Adding rowwise, the left column telescopes to T(n) - T(0); the right
 * column is Σg(i). The viz stacks these rows and highlights the
 * cancellations as the student presses ▶.
 *
 * Presets:
 *  - front-set-3-ask4: g(n)=2^n, T(0)=5 → T(n) = 2^{n+1}+3 = Θ(2^n)
 *  - "linear": g(n)=n, T(0)=0 → T(n) = n(n+1)/2 = Θ(n²)  [bonus illustration]
 *  - "constant": g(n)=1, T(0)=0 → T(n) = n  [the simplest case]
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath, BlockMath } from '@/components/math'

type Preset = {
  id: string
  title: string
  /** Generator g(i) — the additive term. */
  g: (i: number) => number
  /** Formatted g(i) as LaTeX (used to render the row). */
  gLatex: (i: string | number) => string
  /** T(0). */
  t0: number
  /** Closed form for Σ_{i=1}^{n} g(i) as a LaTeX expression. */
  sumLatex: string
  /** Final closed form T(n). */
  closedLatex: string
  /** Asymptotic Θ(...). */
  thetaLatex: string
  /** Sliders bounds for n. */
  nMin: number
  nMax: number
  nInit: number
}

const PRESETS: Record<string, Preset> = {
  'front-set-3-ask4': {
    id: 'front-set-3-ask4',
    title: 'front-set-3-ask4 — T(n) = T(n−1) + 2ⁿ, T(0)=5',
    g: (i) => 2 ** i,
    gLatex: (i) => `2^{${i}}`,
    t0: 5,
    sumLatex: '\\sum_{i=1}^{n} 2^i = 2^{n+1} - 2',
    closedLatex: 'T(n) = 2^{n+1} - 2 + 5 = 2^{n+1} + 3',
    thetaLatex: '\\Theta(2^n)',
    nMin: 3,
    nMax: 8,
    nInit: 5,
  },
  linear: {
    id: 'linear',
    title: 'T(n) = T(n−1) + n, T(0)=0 (παράδειγμα)',
    g: (i) => i,
    gLatex: (i) => `${i}`,
    t0: 0,
    sumLatex: '\\sum_{i=1}^{n} i = \\tfrac{n(n+1)}{2}',
    closedLatex: 'T(n) = \\tfrac{n(n+1)}{2}',
    thetaLatex: '\\Theta(n^2)',
    nMin: 4,
    nMax: 10,
    nInit: 6,
  },
}

const FALLBACK_PRESET: Preset = Object.values(PRESETS)[0]

type Props = {
  preset: string
}

export function RecurrenceTelescope({ preset: presetId }: Props) {
  const preset = PRESETS[presetId] ?? FALLBACK_PRESET
  const [n, setN] = useState(preset.nInit)
  const [revealed, setRevealed] = useState(1)

  // Rebuild rows when preset switches via prop change
  useEffect(() => {
    setN(preset.nInit)
    setRevealed(1)
  }, [preset.id, preset.nInit])

  // Reset reveal on n change
  useEffect(() => setRevealed(1), [n])

  const rows = useMemo(() => {
    const out: { i: number; left: string; right: number }[] = []
    for (let i = 1; i <= n; i++) {
      out.push({ i, left: `T(${i}) - T(${i - 1})`, right: preset.g(i) })
    }
    return out
  }, [n, preset])

  const allShown = revealed >= n
  const total = rows.reduce((s, r) => s + r.right, 0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τηλεσκόπηση — ξετυλίγουμε & προσθέτουμε
        </div>
        <div className="text-xs text-fg-subtle">{preset.title}</div>
      </div>

      <label className="mb-3 block rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
        <div className="mb-1 flex justify-between">
          <span>n</span>
          <span className="font-mono text-sm text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={preset.nMin}
          max={preset.nMax}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
      </label>

      {/* Stacked equations */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3 font-mono text-sm">
        {rows.map((r, idx) => {
          const shown = idx < revealed
          const cancels = shown && idx > 0 && idx < revealed
          return (
            <div
              key={r.i}
              className={cn(
                'flex items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors',
                shown ? 'opacity-100' : 'opacity-20',
                cancels ? 'bg-amber-500/10' : '',
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-fg-subtle">[{r.i}]</span>
                <span className={cn(idx > 0 && idx < revealed ? 'line-through decoration-amber-500/80' : '')}>
                  T({r.i})
                </span>
                <span className="text-fg-subtle">−</span>
                <span className={cn(idx < revealed - 1 ? 'line-through decoration-amber-500/80' : '')}>
                  T({r.i - 1})
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-fg-subtle">=</span>
                <span className="text-fg">
                  <InlineMath>{preset.gLatex(r.i)}</InlineMath>
                </span>
                <span className="text-xs text-fg-subtle">= {r.right}</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Sum after adding */}
      {allShown && (
        <div className="mb-3 space-y-2 rounded-lg border border-accent/40 bg-accent/5 px-3 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            Άθροισμα κατά μέλη — τα ενδιάμεσα <InlineMath>{'T(i)'}</InlineMath> αλληλοαναιρούνται
          </div>
          <BlockMath>{`T(n) - T(0) = ${preset.sumLatex} = ${total}`}</BlockMath>
          <BlockMath>{preset.closedLatex}</BlockMath>
          <div className="text-sm text-fg">
            Ασυμπτωτική τάξη: <InlineMath>{preset.thetaLatex}</InlineMath>.
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRevealed(1)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          γραμμές {revealed} / {n}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(r + 1, n))}
          disabled={allShown}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          + Επόμενη γραμμή
        </button>
      </div>
    </section>
  )
}
