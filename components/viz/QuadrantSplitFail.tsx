'use client'

/**
 * QuadrantSplitFail — why static 4-quadrant splits break the recursion.
 *
 * Four named scenarios share the same n = 24 points. On the left panel
 * the 4 quadrant counts swing wildly (worst: 24/0/0/0); on the right
 * panel the median-line split stays 12 + 12 no matter what. The
 * adaptive-vs-static point becomes physical — and the «all top-right»
 * preset shows the recursive call that inherits the entire input.
 *
 * Built for L05.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Pt = { x: number; y: number }

type Scenario = {
  id: string
  label: string
  counts: [number, number, number, number] // [TL, TR, BL, BR]
  caption: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'unif',
    label: 'Ομοιόμορφα',
    counts: [6, 6, 6, 6],
    caption:
      'Ιδανική περίπτωση: το κάθε τεταρτημόριο έχει περίπου n/4. Εδώ η αναδρομή θα τερμάτιζε — αλλά δεν μας το εγγυάται κανείς.',
  },
  {
    id: 'tilt',
    label: 'Ελαφρώς ασύμμετρα',
    counts: [4, 9, 6, 5],
    caption:
      'Μικρή κλίση δεξιά — ένα τεταρτημόριο έχει ήδη πάνω από διπλάσιο φορτίο από άλλο. Η αναδρομή στο TR αναβάλλει μόλις τα 9/24 της δουλειάς.',
  },
  {
    id: 'crowd',
    label: 'Στριμωγμένα',
    counts: [2, 15, 4, 3],
    caption:
      'Περισσότερα σημεία στριμώχνονται πάνω-δεξιά. Η κλήση στο TR ξεκινά με 15/24 = 62% των σημείων — η αναδρομή σχεδόν δεν προχωράει.',
  },
  {
    id: 'all',
    label: 'Όλα πάνω-δεξιά',
    counts: [0, 24, 0, 0],
    caption:
      'Καταστροφή: όλα τα σημεία πέφτουν στο ίδιο τεταρτημόριο. Η αναδρομική κλήση δέχεται ξανά n σημεία — το υποπρόβλημα δεν μικραίνει, η αναδρομή δεν τερματίζει.',
  },
]

function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 24 points in the unit square, distributed by the scenario's quadrant counts. */
function genPoints(scenarioIdx: number): Pt[] {
  const counts = SCENARIOS[scenarioIdx].counts
  const out: Pt[] = []
  const rng = mulberry32(73 + scenarioIdx * 19)
  // [xLo, yLo, xHi, yHi] for TL, TR, BL, BR
  const boxes: Array<[number, number, number, number]> = [
    [0.06, 0.55, 0.46, 0.94],
    [0.54, 0.55, 0.94, 0.94],
    [0.06, 0.06, 0.46, 0.45],
    [0.54, 0.06, 0.94, 0.45],
  ]
  for (let q = 0; q < 4; q++) {
    const [xLo, yLo, xHi, yHi] = boxes[q]
    for (let i = 0; i < counts[q]; i++) {
      out.push({
        x: xLo + rng() * (xHi - xLo),
        y: yLo + rng() * (yHi - yLo),
      })
    }
  }
  return out
}

function xMedian(pts: Pt[]): number {
  const xs = pts.map((p) => p.x).sort((a, b) => a - b)
  const n = xs.length
  return n % 2 === 0
    ? (xs[n / 2 - 1] + xs[n / 2]) / 2
    : xs[(n - 1) / 2]
}

const W = 320
const H = 320
const PAD = 16
const mapX = (v: number) => PAD + v * (W - 2 * PAD)
const mapY = (v: number) => H - PAD - v * (H - 2 * PAD) // flip y

export function QuadrantSplitFail() {
  const [scen, setScen] = useState(0)
  const pts = useMemo(() => genPoints(scen), [scen])
  const [TL, TR, BL, BR] = SCENARIOS[scen].counts
  const maxCount = Math.max(TL, TR, BL, BR)
  const xm = useMemo(() => xMedian(pts), [pts])
  const leftCount = pts.filter((p) => p.x < xm).length
  const rightCount = pts.length - leftCount

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 text-sm font-semibold tracking-tight text-fg">
        Πώς να σπάσεις το επίπεδο — δύο τρόποι, μία διαφορά
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Ίδια n = 24 σημεία και στα δύο πάνελ· αλλάζει μόνο το πώς τα χωρίζουμε.
      </p>

      {/* scenario tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScen(i)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              i === scen
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft text-fg hover:bg-bg-soft/70',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* dual panels */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Quadrant panel */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Στατικά τεταρτημόρια
            </span>
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
              max = {maxCount}
            </span>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              .qsf-frame { fill: rgb(244 63 94 / 0.04); stroke: rgb(244 63 94 / 0.35); }
              .qsf-line { stroke: rgb(244 63 94); stroke-width: 2; stroke-dasharray: 6 4; }
              .qsf-pt { fill: rgb(var(--accent)); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
              .qsf-count { font: 700 17px ui-sans-serif, system-ui; fill: rgb(244 63 94); text-anchor: middle; opacity: 0.85; }
              .qsf-zero { font: 700 17px ui-sans-serif, system-ui; fill: rgb(244 63 94 / 0.5); text-anchor: middle; }
            `}</style>
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} className="qsf-frame" />
            <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} className="qsf-line" />
            <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} className="qsf-line" />
            {/* counts in the four corners (centers of quadrants) */}
            <text x={PAD + (W - 2 * PAD) / 4} y={PAD + (H - 2 * PAD) / 4 + 6} className={TL === 0 ? 'qsf-zero' : 'qsf-count'}>{TL}</text>
            <text x={W - PAD - (W - 2 * PAD) / 4} y={PAD + (H - 2 * PAD) / 4 + 6} className={TR === 0 ? 'qsf-zero' : 'qsf-count'}>{TR}</text>
            <text x={PAD + (W - 2 * PAD) / 4} y={H - PAD - (H - 2 * PAD) / 4 + 6} className={BL === 0 ? 'qsf-zero' : 'qsf-count'}>{BL}</text>
            <text x={W - PAD - (W - 2 * PAD) / 4} y={H - PAD - (H - 2 * PAD) / 4 + 6} className={BR === 0 ? 'qsf-zero' : 'qsf-count'}>{BR}</text>
            {pts.map((p, i) => (
              <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r={4.5} className="qsf-pt" />
            ))}
          </svg>
          <div className="mt-2 rounded-md bg-bg-elevated px-2 py-1.5 text-center text-xs text-fg-muted">
            Αναδρομικές κλήσεις: {' '}
            <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
              {TL}, {TR}, {BL}, {BR}
            </span>
          </div>
        </div>

        {/* Median panel */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Κάθετη γραμμή στη x-διάμεσο
            </span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              n/2 + n/2
            </span>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              .qmed-frame { fill: rgb(34 197 94 / 0.04); stroke: rgb(34 197 94 / 0.35); }
              .qmed-line { stroke: rgb(34 197 94); stroke-width: 2.5; stroke-dasharray: 6 4; }
              .qmed-pt-l { fill: rgb(244 63 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
              .qmed-pt-r { fill: rgb(56 189 248); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
              .qmed-count { font: 700 17px ui-sans-serif, system-ui; fill: rgb(34 197 94); text-anchor: middle; }
              .qmed-lab { font: 600 11px ui-sans-serif, system-ui; fill: rgb(34 197 94); text-anchor: middle; }
            `}</style>
            <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} className="qmed-frame" />
            <line x1={mapX(xm)} y1={PAD} x2={mapX(xm)} y2={H - PAD} className="qmed-line" />
            {/* counts in the two halves */}
            <text x={(PAD + mapX(xm)) / 2} y={H / 2 + 6} className="qmed-count">{leftCount}</text>
            <text x={(mapX(xm) + W - PAD) / 2} y={H / 2 + 6} className="qmed-count">{rightCount}</text>
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={mapX(p.x)}
                cy={mapY(p.y)}
                r={4.5}
                className={p.x < xm ? 'qmed-pt-l' : 'qmed-pt-r'}
              />
            ))}
            <text x={mapX(xm)} y={PAD - 4} className="qmed-lab">L</text>
          </svg>
          <div className="mt-2 rounded-md bg-bg-elevated px-2 py-1.5 text-center text-xs text-fg-muted">
            Αναδρομικές κλήσεις: {' '}
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {leftCount} + {rightCount}
            </span>
          </div>
        </div>
      </div>

      {/* caption */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        {SCENARIOS[scen].caption}
      </div>
    </section>
  )
}
