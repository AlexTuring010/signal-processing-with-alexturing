'use client'

/**
 * DeltaHalfBoxes — the box proof, in two click-through steps.
 *
 * Tab 1 «Κανένα κουτί δεν χωράει 2 σημεία»: a single δ/2 × δ/2 cell.
 * Press the button and two points appear at opposite corners; their
 * diagonal is δ/√2 ≈ 0.71 · δ, painted red against the threshold δ.
 * The student sees in one glance why two points in the same cell would
 * contradict δ being the per-side minimum.
 *
 * Tab 2 «3 σειρές απέχουν ≥ δ»: five vertically stacked δ/2-rows.
 * A slider sets the row gap k of two extreme points (top edge of row 0,
 * bottom edge of row k). The y-distance bracket compares against the
 * δ marker; the verdict flips green at k = 3.
 *
 * Together they bridge to the closing claim — 3 rows × 4 cols × 1 point =
 * ≤ 12 points, so |i − j| ≥ 12 ⇒ d(s_i, s_j) ≥ δ. Built for L05.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'box' | 'rows'

const DELTA = 96 // δ in px (single-cell tab)

export function DeltaHalfBoxes() {
  const [tab, setTab] = useState<Tab>('box')
  const [show2nd, setShow2nd] = useState(false)
  const [k, setK] = useState(2)

  const yDistDelta = (k - 1) * 0.5 // in units of δ, limit ε → 0
  const aboveDelta = yDistDelta >= 1

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το επιχείρημα των κουτιών — δύο βήματα, ένα συμπέρασμα
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-md border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('box')}
            className={cn(
              'px-2.5 py-1 transition-colors',
              tab === 'box' ? 'bg-accent text-accent-fg' : 'text-fg hover:bg-bg-soft',
            )}
          >
            1 · ένα κουτί
          </button>
          <button
            type="button"
            onClick={() => setTab('rows')}
            className={cn(
              'border-l border-border px-2.5 py-1 transition-colors',
              tab === 'rows' ? 'bg-accent text-accent-fg' : 'text-fg hover:bg-bg-soft',
            )}
          >
            2 · σειρές
          </button>
        </div>
      </div>

      {tab === 'box' ? (
        <>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 320 220"
              className="mx-auto w-full max-w-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>{`
                .db-box { fill: rgb(56 189 248 / 0.08); stroke: rgb(var(--border-strong)); stroke-width: 2; }
                .db-violate { fill: rgb(244 63 94 / 0.14); stroke: rgb(244 63 94); stroke-width: 2; }
                .db-pt { fill: rgb(244 63 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
                .db-diag { stroke: rgb(244 63 94); stroke-width: 2.5; stroke-dasharray: 4 2; }
                .db-side { stroke: rgb(var(--fg-muted)); stroke-width: 1.5; }
                .db-lbl { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
                .db-result { font: 700 13px ui-sans-serif, system-ui; text-anchor: start; }
              `}</style>
              <rect
                x={70}
                y={50}
                width={DELTA}
                height={DELTA}
                className={show2nd ? 'db-violate' : 'db-box'}
              />
              {/* δ/2 width bracket */}
              <line x1={70} y1={38} x2={70 + DELTA} y2={38} className="db-side" />
              <line x1={70} y1={34} x2={70} y2={42} className="db-side" />
              <line x1={70 + DELTA} y1={34} x2={70 + DELTA} y2={42} className="db-side" />
              <text x={70 + DELTA / 2} y={32} className="db-lbl">
                δ/2
              </text>
              {/* δ/2 height bracket */}
              <line x1={58} y1={50} x2={58} y2={50 + DELTA} className="db-side" />
              <line x1={54} y1={50} x2={62} y2={50} className="db-side" />
              <line x1={54} y1={50 + DELTA} x2={62} y2={50 + DELTA} className="db-side" />
              <text x={48} y={50 + DELTA / 2 + 4} className="db-lbl" textAnchor="end">
                δ/2
              </text>
              {show2nd && (
                <>
                  <line
                    x1={70 + 10}
                    y1={50 + 14}
                    x2={70 + DELTA - 8}
                    y2={50 + DELTA - 10}
                    className="db-diag"
                  />
                  <circle cx={70 + 10} cy={50 + 14} r={6.5} className="db-pt" />
                  <circle cx={70 + DELTA - 8} cy={50 + DELTA - 10} r={6.5} className="db-pt" />
                  <text x={70 + DELTA + 14} y={50 + DELTA / 2 - 6} className="db-result" fill="rgb(244 63 94)">
                    διαγώνιος
                  </text>
                  <text x={70 + DELTA + 14} y={50 + DELTA / 2 + 12} className="db-result" fill="rgb(244 63 94)">
                    = δ/√2 ≈ 0.71·δ
                  </text>
                  <text x={70 + DELTA + 14} y={50 + DELTA / 2 + 30} className="db-result" fill="rgb(244 63 94)">
                    &lt; δ — αντιφάσκει ✗
                  </text>
                </>
              )}
            </svg>
          </div>
          <div
            aria-live="polite"
            className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
          >
            {show2nd ? (
              <>
                Δύο σημεία μέσα στο ίδιο δ/2 × δ/2 κουτί απέχουν το πολύ τη διαγώνιό του,
                {' '}<span className="font-mono">√((δ/2)² + (δ/2)²) = δ/√2 ≈ 0.71·δ</span> — αυστηρά μικρότερο
                από δ. Αν τα δύο σημεία ήταν στην ίδια πλευρά της L, η αναδρομή θα είχε ήδη βρει αυτή την απόσταση,
                άρα το δ θα ήταν ≤ 0.71·δ — αντίφαση με τον ορισμό του. <strong>Άρα κάθε κουτί έχει το πολύ 1 σημείο.</strong>
              </>
            ) : (
              <>Ένα κουτί δ/2 × δ/2. Πάτα «Βάλε 2 σημεία» — η διαγώνιος θα μας πει γιατί δεν χωράνε.</>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShow2nd(true)}
              disabled={show2nd}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Βάλε 2 σημεία
            </button>
            <button
              type="button"
              onClick={() => setShow2nd(false)}
              disabled={!show2nd}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              Καθάρισε
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="graph-canvas overflow-x-auto">
            <svg
              viewBox="0 0 380 340"
              className="mx-auto w-full max-w-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>{`
                .dr-box { fill: rgb(56 189 248 / 0.05); stroke: rgb(var(--border-strong)); stroke-width: 1.5; }
                .dr-active { fill: rgb(56 189 248 / 0.16); stroke: rgb(56 189 248); stroke-width: 2; }
                .dr-pt1 { fill: rgb(244 63 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
                .dr-pt2 { fill: rgb(34 197 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
                .dr-row { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: end; }
                .dr-lbl { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
                .dr-id { font: 700 12px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
                .dr-side { stroke: rgb(var(--fg-muted)); stroke-width: 1.5; }
                .dr-thresh { stroke: rgb(202 138 4); stroke-width: 1.5; stroke-dasharray: 5 3; }
                .dr-ydist { stroke: rgb(34 197 94); stroke-width: 2.5; }
                .dr-ydist-fail { stroke: rgb(244 63 94); stroke-width: 2.5; }
              `}</style>
              {/* 5 stacked boxes */}
              {Array.from({ length: 5 }, (_, r) => {
                const y = 30 + r * 50
                const isActive = r === 0 || r === k
                return (
                  <g key={r}>
                    <rect
                      x={90}
                      y={y}
                      width={150}
                      height={50}
                      className={isActive ? 'dr-active' : 'dr-box'}
                    />
                    <text x={86} y={y + 30} className="dr-row">
                      σειρά {r}
                    </text>
                    <text x={250} y={y + 30} className="dr-lbl">
                      {' '}δ/2
                    </text>
                  </g>
                )
              })}
              {/* δ/2 height bracket on first row */}
              <line x1={78} y1={30} x2={78} y2={80} className="dr-side" />
              <line x1={74} y1={30} x2={82} y2={30} className="dr-side" />
              <line x1={74} y1={80} x2={82} y2={80} className="dr-side" />

              {/* p1 at top edge of row 0 (y = 80 - 4 = 76) */}
              <circle cx={130} cy={76} r={7} className="dr-pt1" />
              <text x={130} y={64} className="dr-id">
                p₁
              </text>
              {/* p2 at bottom edge of row k (y = 30 + k*50 + 4) */}
              <circle cx={200} cy={30 + k * 50 + 4} r={7} className="dr-pt2" />
              <text x={200} y={30 + k * 50 + 22} className="dr-id">
                p₂
              </text>

              {/* y-distance line */}
              <line
                x1={290}
                y1={76}
                x2={290}
                y2={30 + k * 50 + 4}
                className={aboveDelta ? 'dr-ydist' : 'dr-ydist-fail'}
              />
              <line x1={286} y1={76} x2={294} y2={76} className="dr-side" />
              <line
                x1={286}
                y1={30 + k * 50 + 4}
                x2={294}
                y2={30 + k * 50 + 4}
                className="dr-side"
              />
              <text
                x={306}
                y={(76 + 30 + k * 50 + 4) / 2 + 4}
                style={{
                  font: '700 12px ui-sans-serif, system-ui',
                  fill: aboveDelta ? 'rgb(34 197 94)' : 'rgb(244 63 94)',
                }}
              >
                {yDistDelta.toFixed(1)}·δ
              </text>

              {/* threshold δ marker on the left */}
              <line x1={60} y1={76} x2={60} y2={76 + 100} className="dr-thresh" />
              <line x1={56} y1={76} x2={64} y2={76} className="dr-thresh" />
              <line x1={56} y1={76 + 100} x2={64} y2={76 + 100} className="dr-thresh" />
              <text
                x={50}
                y={76 + 50 + 4}
                style={{
                  font: '700 12px ui-sans-serif, system-ui',
                  fill: 'rgb(202 138 4)',
                  textAnchor: 'end',
                }}
              >
                δ
              </text>
            </svg>
          </div>

          {/* slider */}
          <div className="mt-3 flex items-center gap-3">
            <span className="shrink-0 text-xs font-medium text-fg-subtle">
              Απόσταση σειρών k:
            </span>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="flex-1 accent-accent"
              aria-label="απόσταση σειρών"
            />
            <span className="w-6 shrink-0 text-right font-mono text-sm font-bold text-fg tabular-nums">
              {k}
            </span>
          </div>

          <div
            aria-live="polite"
            className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
          >
            <RowsAnnotation k={k} aboveDelta={aboveDelta} yDistDelta={yDistDelta} />
          </div>
        </>
      )}

      {/* footer tying it together */}
      <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
        <strong>Συνδυάζοντας τα δύο βήματα:</strong> σε <span className="font-mono">3</span> διαδοχικές σειρές × <span className="font-mono">4</span> στήλες κουτιών χωράνε{' '}
        <span className="font-mono">12</span> κουτιά × <span className="font-mono">1</span> σημείο = το πολύ{' '}
        <span className="font-mono font-bold">12</span> σημεία. Άρα αν δύο σημεία απέχουν{' '}
        <span className="font-mono">≥ 12</span> θέσεις στην ταξινόμηση κατά y, βρίσκονται σίγουρα σε διαφορετικές «τριάδες σειρών» — άρα απέχουν{' '}
        <span className="font-mono font-bold">≥ δ</span>.
      </div>
    </section>
  )
}

function RowsAnnotation({
  k,
  aboveDelta,
  yDistDelta,
}: {
  k: number
  aboveDelta: boolean
  yDistDelta: number
}) {
  if (k === 1) {
    return (
      <>
        Σε γειτονικές σειρές, τα δύο σημεία μπορούν να ακουμπούν το ένα στο όριο της σειράς τους — η κατακόρυφη απόστασή τους μπορεί να είναι σχεδόν <strong>0</strong>. Δεν έχουμε καμία εγγύηση ≥ δ.
      </>
    )
  }
  if (k === 2) {
    return (
      <>
        Με 2 σειρές απόσταση, η κατακόρυφη απόσταση τους είναι ≥ {yDistDelta.toFixed(1)}·δ = <strong>δ/2</strong>. Ακόμα κάτω από το δ — μπορεί να σχηματίσουν ζευγάρι κοντινότερο από δ.
      </>
    )
  }
  if (k === 3) {
    return (
      <>
        Με 3 σειρές απόσταση, η κατακόρυφη απόσταση είναι ≥ {yDistDelta.toFixed(1)}·δ = <strong>δ</strong>. Άρα η Ευκλείδεια απόσταση είναι αυτόματα <strong>≥ δ</strong> — κανένα από αυτά τα δύο σημεία δεν φτιάχνει πιο κοντινό ζευγάρι.
      </>
    )
  }
  return (
    <>
      Με {k} σειρές απόσταση, η κατακόρυφη απόσταση είναι ≥ {yDistDelta.toFixed(1)}·δ — πολύ πάνω από δ. {aboveDelta ? 'Εντελώς ασφαλές.' : ''}
    </>
  )
}
