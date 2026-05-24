'use client'

/**
 * OscillatorComparison — «ασύγκριτα» made concrete.
 *
 * The PDF's counterexample (g(n) = n^{1+sin n}) is presented as a sentence:
 * «ο εκθέτης ταλαντώνεται μεταξύ 0 και 2». A student reads that, shrugs,
 * and moves on. The viz plots g and f = n on the same log-y chart, with
 * a cursor the student drags across n; the panel reports who's currently
 * bigger and by how much. The visual shows g overshooting and undershooting
 * f forever — exactly what "ασύγκριτα" looks like.
 *
 * Built for L02.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const N_MIN = 1
const N_MAX = 60
const PLOT = { x0: 56, x1: 720, yTop: 28, yBot: 220 }

const f = (n: number) => n
const g = (n: number) => n ** (1 + Math.sin(n))

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (Math.abs(v) >= 1e6) return v.toExponential(2)
  if (Math.abs(v) >= 100) return Math.round(v).toString()
  if (Math.abs(v) >= 1) return v.toFixed(2).replace(/\.?0+$/, '')
  return v.toFixed(3)
}

export function OscillatorComparison() {
  const [n, setN] = useState(20)

  const samples = useMemo(() => {
    const out: { n: number; f: number; g: number }[] = []
    for (let i = 0; i < 600; i++) {
      const x = N_MIN + ((N_MAX - N_MIN) * i) / 599
      const fv = f(x)
      const gv = g(x)
      out.push({ n: x, f: fv, g: gv })
    }
    return out
  }, [])

  const allVals = samples.flatMap((s) => [s.f, s.g]).filter((v) => v > 0)
  const yMinLog = Math.log10(Math.min(...allVals)) - 0.2
  const yMaxLog = Math.log10(Math.max(...allVals)) + 0.2

  const xFor = (x: number) => PLOT.x0 + ((x - N_MIN) / (N_MAX - N_MIN)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) => {
    const t = (Math.log10(Math.max(v, 1e-6)) - yMinLog) / (yMaxLog - yMinLog)
    return PLOT.yBot - Math.max(0, Math.min(1, t)) * (PLOT.yBot - PLOT.yTop)
  }

  const fLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.f).toFixed(1)}`).join(' ')
  const gLine = samples.map((s) => `${xFor(s.n).toFixed(1)},${yFor(s.g).toFixed(1)}`).join(' ')

  const cursorN = n
  const cursorF = f(cursorN)
  const cursorG = g(cursorN)
  const cursorRatio = cursorG / cursorF
  const cursorBigger = cursorG > cursorF

  const yTicks: number[] = []
  for (let e = Math.ceil(yMinLog); e <= Math.floor(yMaxLog); e++) yTicks.push(e)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δύο ασύγκριτες συναρτήσεις — δες την g να πετάει πάνω και κάτω από την f
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">log-y</span>
      </div>

      {/* chart */}
      <svg
        viewBox="0 0 760 270"
        className="w-full"
        role="img"
        aria-label="Σύγκριση n και n^(1+sin n)"
      >
        <style>{`
          .os-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .os-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .os-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .os-axislabel { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
        `}</style>

        {/* y grid (decades) */}
        {yTicks.map((e) => (
          <g key={`y-${e}`}>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={yFor(10 ** e)} y2={yFor(10 ** e)} className="os-grid" />
            <text x={PLOT.x0 - 6} y={yFor(10 ** e) + 3} textAnchor="end" className="os-tick">
              10^{e}
            </text>
          </g>
        ))}

        {/* x ticks */}
        {[1, 10, 20, 30, 40, 50, 60].map((x) => (
          <g key={`x-${x}`}>
            <line x1={xFor(x)} x2={xFor(x)} y1={PLOT.yTop} y2={PLOT.yBot} className="os-grid" />
            <text x={xFor(x)} y={PLOT.yBot + 14} textAnchor="middle" className="os-tick">
              {x}
            </text>
          </g>
        ))}

        {/* axes */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="os-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="os-axis" />
        <text x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.yBot + 28} textAnchor="middle" className="os-axislabel">
          n
        </text>

        {/* curves */}
        <polyline points={fLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2.5} />
        <polyline points={gLine} fill="none" stroke="rgb(234 88 12)" strokeWidth={2} />

        {/* cursor */}
        <g>
          <line
            x1={xFor(cursorN)}
            x2={xFor(cursorN)}
            y1={PLOT.yTop}
            y2={PLOT.yBot}
            stroke="rgb(var(--accent))"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <circle cx={xFor(cursorN)} cy={yFor(cursorF)} r={3.5} fill="rgb(37 99 235)" />
          <circle cx={xFor(cursorN)} cy={yFor(cursorG)} r={3.5} fill="rgb(234 88 12)" />
        </g>

        {/* legend */}
        <g transform={`translate(${PLOT.x0 + 6}, 246)`}>
          <line x1={0} x2={26} y1={0} y2={0} stroke="rgb(37 99 235)" strokeWidth={2.5} />
          <text x={32} y={4} className="os-axislabel" fill="rgb(var(--fg))">
            f(n) = n
          </text>
          <line x1={120} x2={146} y1={0} y2={0} stroke="rgb(234 88 12)" strokeWidth={2} />
          <text x={152} y={4} className="os-axislabel" fill="rgb(var(--fg))">
            g(n) = n^(1 + sin n)
          </text>
        </g>
      </svg>

      {/* cursor slider */}
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="os-n"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          δείκτης n
        </label>
        <input
          id="os-n"
          type="range"
          min={1}
          max={N_MAX}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <div className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
          n = {n}
        </div>
      </div>

      {/* readout */}
      <div
        aria-live="polite"
        className={cn(
          'mt-2 rounded-lg border px-3 py-2 text-sm leading-relaxed',
          cursorBigger
            ? 'border-orange-500/50 bg-orange-500/10 text-orange-950 dark:text-orange-100'
            : 'border-sky-500/50 bg-sky-500/10 text-sky-950 dark:text-sky-100',
        )}
      >
        Στο <strong className="font-mono">n = {n}</strong>: f = {fmt(cursorF)}, g ={' '}
        {fmt(cursorG)}, λόγος g/f ={' '}
        <strong className="font-mono">{fmt(cursorRatio)}</strong>.{' '}
        {cursorBigger ? (
          <>
            η g είναι <strong>μεγαλύτερη</strong> από την f (sin n ≈{' '}
            <span className="font-mono">{Math.sin(n).toFixed(2)}</span> &gt; 0, άρα ο εκθέτης
            της g είναι {'>'} 1).
          </>
        ) : (
          <>
            η g είναι <strong>μικρότερη</strong> από την f (sin n ≈{' '}
            <span className="font-mono">{Math.sin(n).toFixed(2)}</span> ≤ 0, άρα ο εκθέτης
            της g είναι ≤ 1).
          </>
        )}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        Σύρε το δείκτη και πρόσεξε: η g <em>πάντα</em> ξανα-ανεβαίνει πάνω από την f και
        ξανα-σκάβει κάτω της. Καμία σταθερά c δεν μπορεί να φράξει τη μία από την άλλη
        «τελικά» — αυτό σημαίνει <strong>ασύγκριτες</strong>: ούτε f ∈ O(g), ούτε g ∈
        O(f).
      </p>
    </section>
  )
}
