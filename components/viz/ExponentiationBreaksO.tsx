'use client'

/**
 * ExponentiationBreaksO — γιατί f = O(g) ΔΕΝ συνεπάγεται 2^f = O(2^g).
 *
 * For L02 Phase D problem front-set-2-ask3 (α). The student knows
 * f = 2n and g = n are «του ίδιου μεγέθους» (Θ-related). The trap is
 * thinking that the implication carries to the exponentials.
 *
 * Two panels side by side:
 *   1. Linear scale: f = 2n and g = n grow at the same rate. Ratio
 *      stays at 2 — bounded.
 *   2. Log scale of 2^f and 2^g: explosive divergence. 2^f / 2^g
 *      = 2^{f−g} = 2^n → ∞.
 *
 * A small slider on the multiplier (f = k·n) lets the student see that
 * any k > 1 breaks the implication.
 *
 * Built for L02 Phase D.
 */

import { useMemo, useState } from 'react'

const N_MAX = 20

export function ExponentiationBreaksO() {
  const [k, setK] = useState(2)

  const samples = useMemo(() => {
    const out: { n: number; f: number; g: number; ef: number; eg: number; logef: number; logeg: number }[] = []
    for (let n = 1; n <= N_MAX; n++) {
      const f = k * n
      const g = n
      out.push({
        n,
        f,
        g,
        ef: Math.pow(2, f),
        eg: Math.pow(2, g),
        logef: f, // log₂(2^f) = f
        logeg: g,
      })
    }
    return out
  }, [k])

  const ratioF_G = k
  const ratioExp = Math.pow(2, k * N_MAX - N_MAX)

  const PLOT = { w: 320, h: 180, pad: 30 }

  const fyMax = Math.max(...samples.map((s) => s.f)) * 1.1
  const linYFor = (v: number) => PLOT.h - PLOT.pad - (v / fyMax) * (PLOT.h - 2 * PLOT.pad)

  const logYMax = Math.max(...samples.map((s) => s.logef)) * 1.05
  const logYFor = (v: number) => PLOT.h - PLOT.pad - (v / logYMax) * (PLOT.h - 2 * PLOT.pad)

  const xFor = (n: number) => PLOT.pad + ((n - 1) / (N_MAX - 1)) * (PLOT.w - 2 * PLOT.pad)

  const fLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${linYFor(s.f).toFixed(1)}`).join(' ')
  const gLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${linYFor(s.g).toFixed(1)}`).join(' ')

  const efLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${logYFor(s.logef).toFixed(1)}`).join(' ')
  const egLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${logYFor(s.logeg).toFixed(1)}`).join(' ')

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          f = O(g) <span className="text-rose-500">⇏</span> 2^f = O(2^g)
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">πάρε f = k·n, g = n</span>
      </div>

      <label className="mb-3 flex items-center gap-2 text-xs">
        <span className="font-mono text-fg-muted">k</span>
        <input
          type="range"
          min={1.1}
          max={3}
          step={0.1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <span className="w-16 text-right font-mono">{k.toFixed(1)}</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Linear panel */}
        <div className="rounded-lg border border-border bg-bg-soft p-2">
          <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
            f = {k.toFixed(1)}n  vs  g = n  (γραμμική)
          </div>
          <svg viewBox={`0 0 ${PLOT.w} ${PLOT.h}`} className="w-full">
            <line x1={PLOT.pad} x2={PLOT.w - PLOT.pad} y1={PLOT.h - PLOT.pad} y2={PLOT.h - PLOT.pad} stroke="rgb(var(--border-strong))" />
            <line x1={PLOT.pad} x2={PLOT.pad} y1={PLOT.pad} y2={PLOT.h - PLOT.pad} stroke="rgb(var(--border-strong))" />
            <polyline points={fLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2} />
            <polyline points={gLine} fill="none" stroke="rgb(217 70 239)" strokeWidth={2} strokeDasharray="4 3" />
            <text x={PLOT.w - PLOT.pad} y={linYFor(samples[samples.length - 1].f) - 4} textAnchor="end" fontSize={10} fill="rgb(37 99 235)" fontFamily="ui-monospace, monospace">f</text>
            <text x={PLOT.w - PLOT.pad} y={linYFor(samples[samples.length - 1].g) + 12} textAnchor="end" fontSize={10} fill="rgb(217 70 239)" fontFamily="ui-monospace, monospace">g</text>
          </svg>
          <div className="rounded border border-emerald-300/50 bg-emerald-50 px-2 py-1 text-center text-[11.5px] dark:bg-emerald-500/15">
            <span className="font-mono">f / g = {ratioF_G.toFixed(1)}</span> — σταθερό, άρα <span className="font-mono">f = O(g)</span>
          </div>
        </div>

        {/* Log panel (after exponentiation) */}
        <div className="rounded-lg border border-border bg-bg-soft p-2">
          <div className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
            log₂(2^f) = f  vs  log₂(2^g) = g  (μετά την εκθετικοποίηση)
          </div>
          <svg viewBox={`0 0 ${PLOT.w} ${PLOT.h}`} className="w-full">
            <line x1={PLOT.pad} x2={PLOT.w - PLOT.pad} y1={PLOT.h - PLOT.pad} y2={PLOT.h - PLOT.pad} stroke="rgb(var(--border-strong))" />
            <line x1={PLOT.pad} x2={PLOT.pad} y1={PLOT.pad} y2={PLOT.h - PLOT.pad} stroke="rgb(var(--border-strong))" />
            <polyline points={efLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2} />
            <polyline points={egLine} fill="none" stroke="rgb(217 70 239)" strokeWidth={2} strokeDasharray="4 3" />
            <text x={PLOT.w - PLOT.pad} y={logYFor(samples[samples.length - 1].logef) - 4} textAnchor="end" fontSize={10} fill="rgb(37 99 235)" fontFamily="ui-monospace, monospace">2^f</text>
            <text x={PLOT.w - PLOT.pad} y={logYFor(samples[samples.length - 1].logeg) + 12} textAnchor="end" fontSize={10} fill="rgb(217 70 239)" fontFamily="ui-monospace, monospace">2^g</text>
          </svg>
          <div className="rounded border border-rose-300/50 bg-rose-50 px-2 py-1 text-center text-[11.5px] dark:bg-rose-500/15">
            <span className="font-mono">2^f / 2^g = 2^{`{(k−1)n}`}</span> → ∞ —{' '}
            <span className="font-mono font-bold text-rose-700 dark:text-rose-300">όχι O</span>
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        Σταθερός παράγοντας μέσα στον εκθέτη γίνεται εκθετικός παράγοντας έξω: 2^{`{k·n}`} = (2^n)^k.
        Δηλαδή «×k στον εκθέτη» = «^k στο αποτέλεσμα» — που σπάει την O-σχέση.
        Στο n ≈ {N_MAX} ο λόγος 2^f / 2^g = {Math.round(Math.log10(ratioExp))} τάξεις του 10.
      </div>
    </section>
  )
}
