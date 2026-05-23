'use client'

/**
 * BranchingContrast — «μικραίνω κατά 1» vs «μικραίνω στο μισό».
 *
 * For pt4-th1-q4. The student sees the claim «if T(n) = 2T(n-1) +
 * Θ(n) then T(n) = O(n²)» and asks: that's *two* recursive calls,
 * each on smaller input, and Θ(n) work per call — like mergesort.
 * Why isn't it polynomial?
 *
 * The viz puts the two recursion trees side by side. Left: 2T(n−1)
 * — depth n, fanout 2 → 2ⁿ leaves. Right: 2T(n/2) — depth log n,
 * fanout 2 → n leaves. The visual gap at small n (n=6) is already
 * 64 vs 6.
 */

import { useState } from 'react'
import { InlineMath } from '@/components/math'

export function BranchingContrast({ initialN = 5 }: { initialN?: number } = {}) {
  const [n, setN] = useState(initialN)

  // Left: 2T(n-1) — depth n
  const leftLeaves = 2 ** n
  // Right: 2T(n/2) — depth log2(n) — for clean tree only powers of 2
  const rightDepth = Math.ceil(Math.log2(Math.max(n, 1)))
  const rightLeaves = 2 ** rightDepth

  // Build levels for display, capping at depth 7 to fit on screen
  const leftDepth = Math.min(n, 7)
  const leftLevels = Array.from({ length: leftDepth + 1 }, (_, k) => 2 ** k)
  const rightLevelsRaw = Array.from({ length: rightDepth + 1 }, (_, k) => 2 ** k)
  const rightLevels = rightLevelsRaw.slice(0, 8)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Μικραίνω κατά 1 vs μικραίνω στο μισό — δύο πανομοιότυπες σε όψη αναδρομές
        </div>
        <div className="text-xs text-fg-subtle">n = {n}</div>
      </div>

      <label className="mb-3 block rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
        <div className="mb-1 flex justify-between">
          <span>n</span>
          <span className="font-mono text-sm text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={2}
          max={7}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Left: 2T(n-1) */}
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              T(n) = 2T(n−1) + Θ(n)
            </span>
            <span className="font-mono text-xs text-rose-500">βάθος = n</span>
          </div>
          <div className="space-y-1">
            {leftLevels.map((count, k) => (
              <div key={k} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-right font-mono text-fg-subtle">[{k}]</span>
                <div className="flex flex-1 flex-wrap gap-0.5">
                  {Array.from({ length: Math.min(count, 64) }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2 rounded-sm bg-rose-500/60"
                    />
                  ))}
                  {count > 64 && (
                    <span className="ml-2 text-rose-500">… +{count - 64}</span>
                  )}
                </div>
                <span className="w-16 text-right font-mono text-fg">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-xs text-fg">
            Φύλλα ≈ <span className="font-mono">2ⁿ</span> = {leftLeaves} → <strong>Θ(2ⁿ)</strong>
          </div>
        </div>

        {/* Right: 2T(n/2) */}
        <div className="rounded-lg border border-success/50 bg-success/5 px-3 py-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-success">
              T(n) = 2T(n/2) + Θ(n)
            </span>
            <span className="font-mono text-xs text-success">βάθος = log n</span>
          </div>
          <div className="space-y-1">
            {rightLevels.map((count, k) => (
              <div key={k} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-right font-mono text-fg-subtle">[{k}]</span>
                <div className="flex flex-1 flex-wrap gap-0.5">
                  {Array.from({ length: Math.min(count, 64) }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2 rounded-sm bg-emerald-500/70"
                    />
                  ))}
                  {count > 64 && (
                    <span className="ml-2 text-emerald-500">… +{count - 64}</span>
                  )}
                </div>
                <span className="w-16 text-right font-mono text-fg">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded border border-success/50 bg-success/10 px-2 py-1 text-xs text-fg">
            Φύλλα ≈ <span className="font-mono">n</span> = {rightLeaves} → <strong>Θ(n log n)</strong>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
        <strong>Η ουσία.</strong> Δύο αναδρομικές κλήσεις είναι το ίδιο σε{' '}
        <em>πλήθος</em>· αυτό που αλλάζει είναι το <em>βάθος</em>. Στο{' '}
        <InlineMath>{'T(n-1)'}</InlineMath> το πρόβλημα μικραίνει κατά 1, οπότε
        χρειάζονται <InlineMath>{'n'}</InlineMath> επίπεδα → <InlineMath>{'2^n'}</InlineMath>{' '}
        φύλλα. Στο <InlineMath>{'T(n/2)'}</InlineMath> μικραίνει με{' '}
        <em>σταθερό κλάσμα</em>, οπότε χρειάζονται μόνο{' '}
        <InlineMath>{'\\log n'}</InlineMath> επίπεδα → <InlineMath>{'n'}</InlineMath> φύλλα.
      </div>
    </section>
  )
}
