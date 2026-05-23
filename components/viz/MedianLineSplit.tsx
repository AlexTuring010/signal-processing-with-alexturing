'use client'

/**
 * MedianLineSplit — the full D&C setup, made interactive.
 *
 * Replaces the static "split + strip" SVG. The story is stepped:
 *   0 — just the n = 12 points
 *   1 — drop the median line L → guaranteed n/2 + n/2 split
 *   2 — recurse to get δ₁ on the left and δ₂ on the right
 *   3 — form δ = min(δ₁, δ₂) and the 2δ strip around L
 *
 * «Νέο στιγμιότυπο» regenerates the points; the line, the per-side
 * closest pairs and the strip all readjust live, so the lesson is:
 * the construction works for any input.
 *
 * Built for L05.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

const W = 360
const H = 360
const PAD = 22
const SCALE = W - 2 * PAD

type Pt = { id: string; x: number; y: number }

function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function genPoints(seed: number): Pt[] {
  const rng = mulberry32(seed * 17 + 3)
  const N = 12
  const out: Pt[] = []
  for (let i = 0; i < N; i++) {
    out.push({
      id: '',
      x: 0.06 + rng() * 0.88,
      y: 0.06 + rng() * 0.88,
    })
  }
  out.sort((a, b) => a.x - b.x)
  // enforce x-uniqueness (the problem assumes it)
  for (let i = 1; i < N; i++) {
    if (out[i].x - out[i - 1].x < 0.025) {
      out[i].x = Math.min(0.97, out[i - 1].x + 0.025)
    }
  }
  out.forEach((p, i) => (p.id = String.fromCharCode(65 + i)))
  return out
}

function xMedian(pts: Pt[]): number {
  const xs = pts.map((p) => p.x).sort((a, b) => a - b)
  const n = xs.length
  return n % 2 === 0
    ? (xs[n / 2 - 1] + xs[n / 2]) / 2
    : xs[(n - 1) / 2]
}

function closestPair(pts: Pt[]): { a: number; b: number; d: number } | null {
  if (pts.length < 2) return null
  let best = { a: 0, b: 1, d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
      if (d < best.d) best = { a: i, b: j, d }
    }
  }
  return best
}

const mapX = (v: number) => PAD + v * SCALE
const mapY = (v: number) => H - PAD - v * SCALE
const fmt = (x: number) => x.toFixed(2)

export function MedianLineSplit() {
  const [seed, setSeed] = useState(7)
  const [step, setStep] = useState(0)

  const pts = useMemo(() => genPoints(seed), [seed])
  const xm = useMemo(() => xMedian(pts), [pts])
  const leftPts = useMemo(() => pts.filter((p) => p.x < xm), [pts, xm])
  const rightPts = useMemo(() => pts.filter((p) => p.x >= xm), [pts, xm])
  const leftCP = useMemo(() => closestPair(leftPts), [leftPts])
  const rightCP = useMemo(() => closestPair(rightPts), [rightPts])
  const delta = Math.min(leftCP?.d ?? Infinity, rightCP?.d ?? Infinity)

  const last = 3
  const showL = step >= 1
  const showCPs = step >= 2
  const showStrip = step >= 3

  let note: string
  if (step === 0) {
    note =
      'n = 12 σημεία στο επίπεδο. Πάτα «Επόμενο» — η D&C λύση θα ξεδιπλωθεί σε τρία βήματα: διαίρει, κυρίευσε, συνδύασε.'
  } else if (step === 1) {
    note = `Βήμα 1 — Διαίρει. Φέρνουμε κάθετη γραμμή L στην κατά x διάμεσο. Αποτέλεσμα: |P_L| = ${leftPts.length}, |P_R| = ${rightPts.length}. Ισόρροπο σπάσιμο, ό,τι κι αν είναι τα σημεία.`
  } else if (step === 2) {
    note = `Βήμα 2 — Κυρίευσε. Δύο αναδρομικές κλήσεις βρίσκουν τα κοντινότερα ζευγάρια μέσα σε κάθε πλευρά: δ₁ = ${fmt(leftCP?.d ?? 0)} (αριστερά), δ₂ = ${fmt(rightCP?.d ?? 0)} (δεξιά). Αυτό που λείπει: τα μικτά ζευγάρια αριστερά-δεξιά — η αναδρομή δεν τα έχει δει.`
  } else {
    note = `Βήμα 3 — Συνδύασε. δ = min(δ₁, δ₂) = ${fmt(delta)}. Ένα μικτό ζευγάρι μπορεί να είναι ακόμα κοντινότερο, αλλά μόνο αν και τα δύο σημεία του βρίσκονται μέσα στη κίτρινη ζώνη πλάτους 2δ γύρω από τη L. Αυτή είναι η μόνη περιοχή που μένει να ψάξουμε.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Η D&amp;C λύση ξεδιπλώνεται — γραμμή στη διάμεσο, αναδρομή, ζώνη 2δ
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === 0
            ? 'Σημεία'
            : step === 1
              ? 'Διαίρει'
              : step === 2
                ? 'Κυρίευσε'
                : 'Συνδύασε'}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .mls-frame { fill: rgb(var(--bg)); stroke: rgb(var(--border)); stroke-width: 1; }
            .mls-strip { fill: rgb(234 179 8 / 0.18); stroke: rgb(234 179 8 / 0.55); stroke-dasharray: 4 3; }
            .mls-L { stroke: rgb(var(--fg)); stroke-width: 2; stroke-dasharray: 6 4; }
            .mls-pt-l { fill: rgb(244 63 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
            .mls-pt-r { fill: rgb(56 189 248); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
            .mls-pt-plain { fill: rgb(var(--accent)); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
            .mls-id { font: 600 10px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
            .mls-Llbl { font: 700 12px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
          `}</style>
          <rect x={PAD} y={PAD} width={SCALE} height={SCALE} className="mls-frame" />

          {/* strip (2δ around L) */}
          {showStrip && (() => {
            const sx = Math.max(PAD, mapX(xm - delta))
            const ex = Math.min(W - PAD, mapX(xm + delta))
            return (
              <rect
                x={sx}
                y={PAD}
                width={ex - sx}
                height={SCALE}
                className="mls-strip"
              />
            )
          })()}

          {/* L */}
          {showL && (
            <line
              x1={mapX(xm)}
              y1={PAD - 4}
              x2={mapX(xm)}
              y2={H - PAD + 4}
              className="mls-L"
            />
          )}
          {showL && (
            <text x={mapX(xm)} y={PAD - 8} className="mls-Llbl">
              L
            </text>
          )}

          {/* side counts */}
          {showL && (
            <>
              <text
                x={(PAD + mapX(xm)) / 2}
                y={H - PAD + 18}
                style={{ font: '600 11px ui-sans-serif, system-ui', textAnchor: 'middle', fill: 'rgb(244 63 94)' }}
              >
                |P_L| = {leftPts.length}
              </text>
              <text
                x={(mapX(xm) + W - PAD) / 2}
                y={H - PAD + 18}
                style={{ font: '600 11px ui-sans-serif, system-ui', textAnchor: 'middle', fill: 'rgb(56 189 248)' }}
              >
                |P_R| = {rightPts.length}
              </text>
            </>
          )}

          {/* per-side closest-pair lines */}
          {showCPs && leftCP && (
            <>
              <line
                x1={mapX(leftPts[leftCP.a].x)}
                y1={mapY(leftPts[leftCP.a].y)}
                x2={mapX(leftPts[leftCP.b].x)}
                y2={mapY(leftPts[leftCP.b].y)}
                stroke="rgb(244 63 94)"
                strokeWidth={2.5}
              />
              <text
                x={(mapX(leftPts[leftCP.a].x) + mapX(leftPts[leftCP.b].x)) / 2}
                y={(mapY(leftPts[leftCP.a].y) + mapY(leftPts[leftCP.b].y)) / 2 - 7}
                style={{ font: '700 11px ui-sans-serif, system-ui', textAnchor: 'middle', fill: 'rgb(244 63 94)' }}
              >
                δ₁ = {fmt(leftCP.d)}
              </text>
            </>
          )}
          {showCPs && rightCP && (
            <>
              <line
                x1={mapX(rightPts[rightCP.a].x)}
                y1={mapY(rightPts[rightCP.a].y)}
                x2={mapX(rightPts[rightCP.b].x)}
                y2={mapY(rightPts[rightCP.b].y)}
                stroke="rgb(56 189 248)"
                strokeWidth={2.5}
              />
              <text
                x={(mapX(rightPts[rightCP.a].x) + mapX(rightPts[rightCP.b].x)) / 2}
                y={(mapY(rightPts[rightCP.a].y) + mapY(rightPts[rightCP.b].y)) / 2 - 7}
                style={{ font: '700 11px ui-sans-serif, system-ui', textAnchor: 'middle', fill: 'rgb(2 132 199)' }}
              >
                δ₂ = {fmt(rightCP.d)}
              </text>
            </>
          )}

          {/* points */}
          {pts.map((p) => (
            <g key={p.id}>
              <circle
                cx={mapX(p.x)}
                cy={mapY(p.y)}
                r={6}
                className={
                  showL
                    ? p.x < xm
                      ? 'mls-pt-l'
                      : 'mls-pt-r'
                    : 'mls-pt-plain'
                }
              />
              <text x={mapX(p.x)} y={mapY(p.y) - 10} className="mls-id">
                {p.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* δ display */}
      {showStrip && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded-md bg-yellow-500/15 px-2.5 py-1 font-mono font-bold text-yellow-700 dark:text-yellow-300">
            δ = min(δ₁, δ₂) = {fmt(delta)}
          </span>
          <span className="rounded-md bg-yellow-500/10 px-2.5 py-1 text-yellow-700 dark:text-yellow-300">
            ζώνη πλάτους 2δ = {fmt(2 * delta)}
          </span>
        </div>
      )}

      <div
        aria-live="polite"
        className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={step === last}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setSeed((s) => s + 1)
            setStep(0)
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Νέο στιγμιότυπο
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
