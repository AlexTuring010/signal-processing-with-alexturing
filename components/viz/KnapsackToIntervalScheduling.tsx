'use client'

/**
 * KnapsackToIntervalScheduling — the (ε) bridge of pt4-th4.
 *
 * Same 5 ads, two formulations:
 *   (A) Σακίδιο: ad i has duration tᵢ + profit pᵢ, no fixed slot.
 *       Pick any subset with Σ tᵢ ≤ T, maximize Σ pᵢ.
 *   (B) Σταθμισμένος χρονοπρογραμματισμός: ad i has FIXED slot [sᵢ, sᵢ+tᵢ).
 *       Pick non-overlapping subset, maximize Σ pᵢ.
 *
 * On the carefully chosen instance, the two optima are GENUINELY DIFFERENT —
 * knapsack picks {1,2,3,5} (p=25), interval scheduling picks {1,4,5} (p=19).
 * Two ads (2, 3) overlap so badly that the scheduler can't have both, but
 * knapsack can — so the slot constraint genuinely changes the problem.
 *
 * Two tabs, same ad list, two pictures and two answers.
 *
 * Built for L15 problem pt4-th4.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Ad = { i: number; t: number; p: number; s: number }

const ADS: readonly Ad[] = [
  { i: 1, t: 4, p: 10, s: 0 },
  { i: 2, t: 3, p: 8, s: 3 },
  { i: 3, t: 2, p: 5, s: 5 },
  { i: 4, t: 3, p: 7, s: 6 },
  { i: 5, t: 1, p: 2, s: 9 },
]
const T = 10

const KNAPSACK_OPT = [1, 2, 3, 5] // Σtᵢ = 10, Σpᵢ = 25
const KNAPSACK_VALUE = 25
const INTERVAL_OPT = [1, 4, 5] // non-overlap, Σpᵢ = 19
const INTERVAL_VALUE = 19

const HUES: Record<number, { fill: string; stroke: string; text: string }> = {
  1: { fill: 'rgb(59 130 246 / 0.22)', stroke: 'rgb(59 130 246)', text: 'rgb(29 78 216)' },
  2: { fill: 'rgb(244 63 94 / 0.22)', stroke: 'rgb(244 63 94)', text: 'rgb(190 18 60)' },
  3: { fill: 'rgb(245 158 11 / 0.22)', stroke: 'rgb(245 158 11)', text: 'rgb(180 83 9)' },
  4: { fill: 'rgb(168 85 247 / 0.22)', stroke: 'rgb(168 85 247)', text: 'rgb(126 34 206)' },
  5: { fill: 'rgb(20 184 166 / 0.22)', stroke: 'rgb(20 184 166)', text: 'rgb(15 118 110)' },
}

export function KnapsackToIntervalScheduling() {
  const [tab, setTab] = useState<'knapsack' | 'interval'>('knapsack')
  const [revealed, setRevealed] = useState<{ knapsack: boolean; interval: boolean }>({
    knapsack: false,
    interval: false,
  })

  const chosen = tab === 'knapsack' ? KNAPSACK_OPT : INTERVAL_OPT
  const value = tab === 'knapsack' ? KNAPSACK_VALUE : INTERVAL_VALUE
  const show = revealed[tab]
  const chosenSet = new Set(show ? chosen : [])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πέντε διαφημίσεις, δύο διατυπώσεις — διαφορετική βέλτιστη επιλογή
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          T = {T}
        </span>
      </div>

      {/* tab switch */}
      <div className="mb-3 flex rounded-md border border-border bg-bg-soft/30 p-0.5">
        <button
          type="button"
          onClick={() => setTab('knapsack')}
          className={cn(
            'flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'knapsack'
              ? 'bg-accent text-accent-fg'
              : 'text-fg-muted hover:bg-bg-soft',
          )}
        >
          (α-δ) Σακίδιο · ευέλικτη τοποθέτηση
        </button>
        <button
          type="button"
          onClick={() => setTab('interval')}
          className={cn(
            'flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors',
            tab === 'interval'
              ? 'bg-accent text-accent-fg'
              : 'text-fg-muted hover:bg-bg-soft',
          )}
        >
          (ε) Σταθμ. χρονοπρογραμματισμός · σταθερές θυρίδες
        </button>
      </div>

      {/* shared ad cards */}
      <div className="mb-3 grid grid-cols-5 gap-2">
        {ADS.map((ad) => {
          const inBag = chosenSet.has(ad.i)
          const h = HUES[ad.i]
          return (
            <div
              key={ad.i}
              className={cn(
                'rounded-lg border p-2 text-center text-xs transition-opacity',
                inBag ? 'border-2' : 'border opacity-60',
              )}
              style={{
                borderColor: h.stroke,
                backgroundColor: inBag ? h.fill : 'transparent',
              }}
            >
              <div className="text-sm font-bold" style={{ color: h.text }}>
                Διαφ. {ad.i}
              </div>
              <div className="font-mono text-fg-muted">
                t={ad.t} · p={ad.p}
                {tab === 'interval' && (
                  <>
                    <br />
                    [{ad.s}, {ad.s + ad.t})
                  </>
                )}
              </div>
              {inBag && (
                <div className="mt-0.5 text-[10px] font-bold uppercase text-success">
                  ✓ επιλέχθηκε
                </div>
              )}
            </div>
          )
        })}
      </div>

      {tab === 'knapsack' ? (
        <KnapsackView chosenSet={chosenSet} show={show} value={value} />
      ) : (
        <IntervalView chosenSet={chosenSet} show={show} value={value} />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            setRevealed((r) => ({ ...r, [tab]: !r[tab] }))
          }
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          {show ? 'Κρύψε το βέλτιστο' : 'Δείξε το βέλτιστο'}
        </button>
        {show && (
          <span className="rounded-md border border-success/40 bg-success/10 px-2 py-1 text-xs font-mono text-fg">
            OPT = <strong>{value}</strong> · διαφημίσεις {chosen.join(', ')}
          </span>
        )}
      </div>

      {/* bridge verdict */}
      <div className="mt-3 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2 text-sm leading-relaxed text-fg">
        <strong>Διαφορετική βέλτιστη επιλογή!</strong> Στο Σακίδιο,
        παίρνουμε {KNAPSACK_OPT.join(', ')} με κέρδος{' '}
        <strong>{KNAPSACK_VALUE}</strong>. Στον Σταθμισμένο
        Χρονοπρογραμματισμό, με σταθερές θυρίδες, οι διαφημίσεις{' '}
        {INTERVAL_OPT.join(', ')} με κέρδος <strong>{INTERVAL_VALUE}</strong>{' '}
        είναι ό,τι καλύτερο μπορούμε χωρίς επικάλυψη. Δύο επιπλέον διαφημίσεις
        («2», «3») που χωρούσαν χρονικά στο σακίδιο, εδώ συγκρούονται με τους
        γείτονές τους.
      </div>
    </section>
  )
}

function KnapsackView({
  chosenSet,
  show,
  value,
}: {
  chosenSet: Set<number>
  show: boolean
  value: number
}) {
  const usedT = ADS.filter((a) => chosenSet.has(a.i)).reduce((s, a) => s + a.t, 0)
  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
      <div className="mb-2 text-xs font-semibold text-fg-muted">
        Μπάρα διαθέσιμου χρόνου T = {T}
      </div>
      <div className="relative h-12 overflow-hidden rounded-md border border-border bg-bg-elevated">
        {/* fill bar */}
        <div className="flex h-full">
          {show
            ? ADS.filter((a) => chosenSet.has(a.i)).map((ad) => {
                const h = HUES[ad.i]
                return (
                  <div
                    key={ad.i}
                    className="flex h-full items-center justify-center border-r border-bg-elevated text-xs font-bold"
                    style={{
                      width: `${(ad.t / T) * 100}%`,
                      backgroundColor: h.fill,
                      color: h.text,
                    }}
                  >
                    Διαφ. {ad.i} (t={ad.t}, p={ad.p})
                  </div>
                )
              })
            : (
              <div className="flex h-full w-full items-center justify-center text-xs text-fg-subtle">
                (πάτα «Δείξε το βέλτιστο»)
              </div>
            )}
          {show && usedT < T && (
            <div
              className="flex h-full items-center justify-center text-xs text-fg-subtle"
              style={{ width: `${((T - usedT) / T) * 100}%` }}
            >
              κενό {T - usedT}
            </div>
          )}
        </div>
        {/* tick marks */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-1 text-[10px] text-fg-subtle">
          {Array.from({ length: T + 1 }, (_, k) => (
            <span key={k}>{k}</span>
          ))}
        </div>
      </div>
      {show && (
        <div className="mt-2 text-xs font-mono text-fg">
          Σ tᵢ = {usedT} ≤ T · Σ pᵢ = <strong className="text-accent">{value}</strong>
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-fg-muted">
        <strong>Αναδρομή:</strong> OPT(i, t) = max{`{`}OPT(i−1, t), pᵢ + OPT(i−1,
        t−tᵢ){`}`}. Πίνακας n × T → Θ(nT) ψευδοπολυωνυμικός.
      </p>
    </div>
  )
}

function IntervalView({
  chosenSet,
  show,
  value,
}: {
  chosenSet: Set<number>
  show: boolean
  value: number
}) {
  // SVG timeline of fixed slots
  const W = 480
  const H = 130
  const padX = 24
  const trackY = 60
  const trackH = 30
  const usable = W - 2 * padX
  const xOf = (t: number) => padX + (t / T) * usable

  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
      <div className="mb-2 text-xs font-semibold text-fg-muted">
        Χρονογραμμή με σταθερά παράθυρα [sᵢ, sᵢ+tᵢ)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        {/* ruler */}
        {Array.from({ length: T + 1 }, (_, k) => (
          <g key={k}>
            <line
              x1={xOf(k)}
              y1={trackY + trackH + 4}
              x2={xOf(k)}
              y2={trackY + trackH + 10}
              stroke="rgb(var(--fg-subtle))"
              strokeWidth={1}
            />
            <text
              x={xOf(k)}
              y={trackY + trackH + 22}
              textAnchor="middle"
              fontSize={10}
              fill="rgb(var(--fg-subtle))"
            >
              {k}
            </text>
          </g>
        ))}
        {/* track line */}
        <line
          x1={padX}
          y1={trackY + trackH / 2}
          x2={W - padX}
          y2={trackY + trackH / 2}
          stroke="rgb(var(--border))"
          strokeWidth={1.5}
          strokeDasharray="3 4"
        />
        {/* ads, stacked vertically by index to make overlaps visible */}
        {ADS.map((ad, idx) => {
          const h = HUES[ad.i]
          const inBag = chosenSet.has(ad.i)
          // stagger y-positions for non-chosen so overlaps are visible
          const yLane = trackY + (idx % 3) * 9 - 9
          const x1 = xOf(ad.s)
          const w = xOf(ad.s + ad.t) - x1
          return (
            <g key={ad.i}>
              <rect
                x={x1}
                y={inBag ? trackY : yLane}
                width={w}
                height={inBag ? trackH : 12}
                rx={4}
                fill={inBag ? h.fill : 'rgb(var(--bg-soft))'}
                stroke={h.stroke}
                strokeWidth={inBag ? 2.2 : 1.4}
                strokeDasharray={!show && !inBag ? '0' : !inBag ? '4 3' : '0'}
                opacity={show && !inBag ? 0.5 : 1}
              />
              <text
                x={x1 + w / 2}
                y={(inBag ? trackY : yLane) + (inBag ? trackH / 2 + 4 : 9)}
                textAnchor="middle"
                fontSize={inBag ? 11 : 9}
                fontWeight={inBag ? 700 : 500}
                fill={h.text}
              >
                {ad.i}{inBag ? ` (p=${ad.p})` : ''}
              </text>
            </g>
          )
        })}
      </svg>
      {show && (
        <div className="mt-2 text-xs font-mono text-fg">
          Επιλογή χωρίς επικάλυψη · Σ pᵢ ={' '}
          <strong className="text-accent">{value}</strong>
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-fg-muted">
        <strong>Αναδρομή:</strong> OPT(j) = max{`{`}OPT(j−1), pⱼ + OPT(p(j)){`}`},
        όπου p(j) = δείκτης τελευταίας συμβατής διαφήμισης. Θ(n log n) μετά την
        ταξινόμηση.
      </p>
    </div>
  )
}
