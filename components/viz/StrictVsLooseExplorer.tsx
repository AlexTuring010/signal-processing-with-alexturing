'use client'

/**
 * StrictVsLooseExplorer — the «κάποιο c» vs «κάθε c» quantifier flip.
 *
 * The lecture's Callout draws the line: O needs some c that works; o
 * needs every c to work. A struggling student nods, then immediately
 * mixes them up. The viz makes the difference operational:
 *
 *   • Two tabs over the same g(n) = n:
 *       (i)  vs f(n) = 2n — same asymptotic order.
 *       (ii) vs f(n) = n² — f strictly faster.
 *
 *   • A c-slider drives a chart of g and c·f.
 *
 *   • A 21-cell «c-scan» strip below the chart colours each c green
 *     (the bound holds for all sufficiently large n) or red (it fails
 *     forever). The visual punchline:
 *       Tab (i): cells flip green↔red at c = 0.5 — there exists a c
 *         that works, but small c's fail. So g ∈ O(f) ✓, g ∉ o(f) ✗.
 *       Tab (ii): every cell green — every c works, including absurdly
 *         small ones, you just need a bigger n₀. So g ∈ O(f) AND g ∈ o(f).
 *
 * Built for L02.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type CaseId = 'same' | 'strict'

type CaseDef = {
  id: CaseId
  tab: string
  gLabel: string
  fLabel: string
  g: (n: number) => number
  f: (n: number) => number
  cMin: number
  cMax: number
  cStep: number
  cDefault: number
  cThreshold: number
  nMax: number
  scanCs: number[]
}

const CASES: CaseDef[] = [
  {
    id: 'same',
    tab: 'g = n vs f = 2n   (ίδια τάξη)',
    gLabel: 'n',
    fLabel: '2n',
    g: (n) => n,
    f: (n) => 2 * n,
    cMin: 0.1,
    cMax: 2,
    cStep: 0.05,
    cDefault: 0.5,
    cThreshold: 0.5,
    nMax: 200,
    scanCs: [0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 1.8, 2.0],
  },
  {
    id: 'strict',
    tab: 'g = n vs f = n²   (η f αυστηρά πιο γρήγορη)',
    gLabel: 'n',
    fLabel: 'n²',
    g: (n) => n,
    f: (n) => n * n,
    cMin: 0.001,
    cMax: 2,
    cStep: 0.001,
    cDefault: 0.05,
    cThreshold: 0,
    nMax: 5000,
    scanCs: [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
  },
]

const PLOT = { x0: 56, x1: 740, yTop: 28, yBot: 240 }

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('el-GR')
  if (Math.abs(v) >= 10) return Math.round(v).toString()
  if (Math.abs(v) >= 1) return v.toFixed(2).replace(/\.?0+$/, '')
  return v.toFixed(3).replace(/\.?0+$/, '')
}

// Smallest n₀ such that g(n) ≤ c·f(n) for all n in [n₀, nMax]. Returns
// nMax+1 if no such n₀ exists within range (treated as "fails forever").
function firstValidN(def: CaseDef, c: number): number {
  let lastFail = 0
  for (let n = 1; n <= def.nMax; n++) {
    if (def.g(n) > c * def.f(n)) lastFail = n
  }
  return lastFail + 1
}

export function StrictVsLooseExplorer() {
  const [caseId, setCaseId] = useState<CaseId>('same')
  const [cByCase, setCByCase] = useState<Record<CaseId, number>>({
    same: 0.5,
    strict: 0.05,
  })
  const def = CASES.find((d) => d.id === caseId)!
  const c = cByCase[caseId]
  const setC = (v: number) => setCByCase((s) => ({ ...s, [caseId]: v }))

  const n0 = firstValidN(def, c)
  const holds = n0 <= def.nMax

  // Chart: sample on a log scale so we can see both small and huge n.
  const xs = useMemo(() => {
    const out: number[] = []
    const lo = Math.log(1)
    const hi = Math.log(def.nMax)
    for (let i = 0; i < 220; i++) {
      out.push(Math.exp(lo + (hi - lo) * (i / 219)))
    }
    return out
  }, [def])

  const gVals = xs.map((n) => def.g(n))
  const cfVals = xs.map((n) => c * def.f(n))

  const yMax = Math.max(...gVals, ...cfVals)
  const yMin = 0
  const xMinLog = Math.log10(1)
  const xMaxLog = Math.log10(def.nMax)

  const xFor = (n: number) =>
    PLOT.x0 +
    ((Math.log10(Math.max(n, 1)) - xMinLog) / (xMaxLog - xMinLog)) * (PLOT.x1 - PLOT.x0)
  const yFor = (v: number) =>
    PLOT.yBot - ((v - yMin) / Math.max(yMax - yMin, 1)) * (PLOT.yBot - PLOT.yTop)

  const gLine = xs.map((n, i) => `${xFor(n).toFixed(1)},${yFor(gVals[i]).toFixed(1)}`).join(' ')
  const cfLine = xs
    .map((n, i) => `${xFor(n).toFixed(1)},${yFor(cfVals[i]).toFixed(1)}`)
    .join(' ')

  const xTicks: number[] = []
  for (let e = 0; e <= Math.floor(xMaxLog); e++) xTicks.push(10 ** e)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          O vs o — μετράμε «κάποιο c» ή «κάθε c»;
        </div>
      </div>

      {/* tabs */}
      <div className="mb-3 flex flex-wrap gap-1">
        {CASES.map((cd) => (
          <button
            key={cd.id}
            type="button"
            onClick={() => setCaseId(cd.id)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              cd.id === caseId
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft hover:text-fg',
            )}
          >
            {cd.tab}
          </button>
        ))}
      </div>

      {/* chart */}
      <svg
        viewBox="0 0 780 290"
        className="w-full"
        role="img"
        aria-label="Σύγκριση g(n) και c·f(n)"
      >
        <style>{`
          .sl-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .sl-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .sl-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .sl-axislabel { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
        `}</style>

        {/* shaded "valid" band */}
        {holds ? (
          <g>
            <rect
              x={xFor(n0)}
              y={PLOT.yTop}
              width={PLOT.x1 - xFor(n0)}
              height={PLOT.yBot - PLOT.yTop}
              fill="rgb(34 197 94 / 0.10)"
            />
            <line
              x1={xFor(n0)}
              x2={xFor(n0)}
              y1={PLOT.yTop}
              y2={PLOT.yBot}
              stroke="rgb(34 197 94)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={xFor(n0) + 6}
              y={PLOT.yTop + 14}
              className="sl-tick"
              fill="rgb(34 197 94)"
              fontWeight={700}
            >
              n₀ = {n0}
            </text>
          </g>
        ) : null}

        {/* x grid (decades) */}
        {xTicks.map((n) => (
          <g key={`x-${n}`}>
            <line x1={xFor(n)} x2={xFor(n)} y1={PLOT.yTop} y2={PLOT.yBot} className="sl-grid" />
            <text x={xFor(n)} y={PLOT.yBot + 14} textAnchor="middle" className="sl-tick">
              {n >= 1000 ? `10^${Math.log10(n)}` : n}
            </text>
          </g>
        ))}

        {/* axes */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="sl-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="sl-axis" />
        <text
          x={(PLOT.x0 + PLOT.x1) / 2}
          y={PLOT.yBot + 28}
          textAnchor="middle"
          className="sl-axislabel"
        >
          n (λογ. κλίμακα)
        </text>

        {/* curves */}
        <polyline
          points={cfLine}
          fill="none"
          stroke="rgb(234 88 12)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <polyline points={gLine} fill="none" stroke="rgb(37 99 235)" strokeWidth={2.5} />

        {/* legend */}
        <g transform={`translate(${PLOT.x0 + 8}, ${PLOT.yBot + 50})`}>
          <line x1={0} x2={26} y1={0} y2={0} stroke="rgb(37 99 235)" strokeWidth={2.5} />
          <text x={32} y={4} className="sl-axislabel" fill="rgb(var(--fg))">
            g(n) = {def.gLabel}
          </text>
          <line
            x1={140}
            x2={166}
            y1={0}
            y2={0}
            stroke="rgb(234 88 12)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <text x={172} y={4} className="sl-axislabel" fill="rgb(var(--fg))">
            c · {def.fLabel} = {fmt(c)} · {def.fLabel}
          </text>
        </g>
      </svg>

      {/* c slider */}
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="sl-c"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Σταθερά c
        </label>
        <input
          id="sl-c"
          type="range"
          min={def.cMin}
          max={def.cMax}
          step={def.cStep}
          value={c}
          onChange={(e) => setC(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <div className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
          c = {fmt(c)}
        </div>
      </div>

      {/* verdict for the current c */}
      <div
        aria-live="polite"
        className={cn(
          'mt-2 rounded-lg border px-3 py-2 text-sm leading-relaxed',
          holds
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
            : 'border-red-500/50 bg-red-500/10 text-red-950 dark:text-red-100',
        )}
      >
        {holds ? (
          <>
            <strong>✓ Με c = {fmt(c)}:</strong> g(n) ≤ c·f(n) από n₀ ={' '}
            <span className="font-mono font-bold">{n0}</span> και μετά.
          </>
        ) : (
          <>
            <strong>✗ Με c = {fmt(c)}:</strong> g(n) {'>'} c·f(n) για άπειρα n — δεν
            υπάρχει n₀.
          </>
        )}
      </div>

      {/* the c-scan — the heart of the viz */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 p-3">
        <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-fg-subtle">
          Δοκίμασε όλα τα c — ποια κάνουν την ανισότητα να ισχύει;
        </div>
        <div className="flex flex-wrap gap-1">
          {def.scanCs.map((cTest) => {
            const ok = firstValidN(def, cTest) <= def.nMax
            const isCurrent = Math.abs(cTest - c) < def.cStep * 1.5
            return (
              <button
                key={cTest}
                type="button"
                onClick={() => setC(cTest)}
                className={cn(
                  'flex w-16 flex-col items-center rounded-md border px-1 py-1 transition-colors',
                  ok
                    ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20',
                  isCurrent && 'ring-2 ring-accent ring-offset-1 ring-offset-bg-elevated',
                )}
                title={ok ? 'η ανισότητα ισχύει' : 'η ανισότητα αποτυγχάνει'}
              >
                <span className="font-mono text-[11px] font-bold tabular-nums text-fg">
                  c = {fmt(cTest)}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-bold',
                    ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300',
                  )}
                >
                  {ok ? '✓' : '✗'}
                </span>
              </button>
            )
          })}
        </div>

        {/* summary — the punchline of the case */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-bg-elevated px-2.5 py-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              g ∈ O(f);
            </div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ — υπάρχει τουλάχιστον ένα πράσινο c.
            </div>
          </div>
          <div className="rounded-md border border-border bg-bg-elevated px-2.5 py-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              g ∈ o(f);
            </div>
            <div
              className={cn(
                'text-sm font-semibold',
                caseId === 'strict'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-red-700 dark:text-red-300',
              )}
            >
              {caseId === 'strict'
                ? '✓ — ΟΛΑ τα c είναι πράσινα (όσο μικρά κι αν είναι).'
                : `✗ — κάτω από c ≈ ${def.cThreshold} όλα κοκκινίζουν.`}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
