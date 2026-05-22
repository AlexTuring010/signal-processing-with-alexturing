'use client'

/**
 * FloodFillGrid — flood fill IS a BFS on the pixel grid (L08).
 *
 * The paint-bucket tool is not "a graphics algorithm" — it is a breadth-first
 * traversal where vertices are pixels and an edge joins two adjacent pixels
 * of the same colour. This viz makes that literal: click any green pixel and
 * watch the BFS wave spread ring by ring, recolouring the whole connected
 * region, bending around grey (non-green) pixels and never crossing them.
 *
 * The grid hides two separate green regions — the outer area and a pocket
 * sealed inside a grey rectangle. Filling one leaves the other untouched:
 * the region is exactly the connected component of the clicked pixel.
 * Built for L08.
 */

import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

const COLS = 10
const ROWS = 8
const CELL = 36
const GAP = 2
const MARGIN = 8

/** A closed grey rectangle (rows 2–5, cols 2–7, border only) seals an
 *  inner 2×4 green pocket off from the outer green region. */
function isWall(r: number, c: number): boolean {
  const insideBox = r >= 2 && r <= 5 && c >= 2 && c <= 7
  if (!insideBox) return false
  return r === 2 || r === 5 || c === 2 || c === 7
}

type Cell = { r: number; c: number }
const cellKey = (r: number, c: number) => `${r},${c}`

/** BFS layers (distance rings) from the seed, over green 4-neighbours. */
function bfsLayers(seed: Cell): Cell[][] {
  const seen = new Set([cellKey(seed.r, seed.c)])
  const layers: Cell[][] = [[seed]]
  let frontier: Cell[] = [seed]
  const STEPS: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  while (frontier.length) {
    const next: Cell[] = []
    for (const { r, c } of frontier) {
      for (const [dr, dc] of STEPS) {
        const nr = r + dr
        const nc = c + dc
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue
        if (isWall(nr, nc)) continue
        if (seen.has(cellKey(nr, nc))) continue
        seen.add(cellKey(nr, nc))
        next.push({ r: nr, c: nc })
      }
    }
    if (next.length) layers.push(next)
    frontier = next
  }
  return layers
}

const cellX = (c: number) => MARGIN + c * (CELL + GAP)
const cellY = (r: number) => MARGIN + r * (CELL + GAP)
const W = MARGIN * 2 + COLS * (CELL + GAP) - GAP
const H = MARGIN * 2 + ROWS * (CELL + GAP) - GAP

export function FloodFillGrid() {
  const [seed, setSeed] = useState<Cell>({ r: 0, c: 0 })
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const layers = useMemo(() => bfsLayers(seed), [seed])
  const last = layers.length

  /** pixel → BFS distance from the seed (undefined = different region) */
  const distOf = useMemo(() => {
    const m = new Map<string, number>()
    layers.forEach((lyr, i) =>
      lyr.forEach(({ r, c }) => m.set(cellKey(r, c), i)),
    )
    return m
  }, [layers])

  useEffect(() => {
    if (!playing) return
    if (step >= last) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), 440)
    return () => clearTimeout(t)
  }, [playing, step, last])

  function pick(r: number, c: number) {
    if (isWall(r, c)) return
    setSeed({ r, c })
    setStep(0)
    setPlaying(false)
  }

  const filled = Array.from(distOf.values()).filter((d) => d <= step - 1).length
  const total = distOf.size
  const frontierSize = step > 0 ? (layers[step - 1]?.length ?? 0) : 0

  let note: string
  if (step === 0) {
    note =
      'Διάλεξε ένα πράσινο pixel — κάνε κλικ σε όποιο θες, ή πάτα ▶. Το flood fill είναι ένα BFS που ξεκινά από εκεί.'
  } else if (step < last) {
    note = `Κύμα BFS #${step}: γέμισε ${frontierSize} pixels σε απόσταση ${step - 1} από την αφετηρία. Το κύμα προχωρά μόνο σε γειτονικά ΠΡΑΣΙΝΑ pixels — τα γκρι το σταματούν.`
  } else {
    note = `Τέλος. Γεμίσαμε ${filled} pixels — ολόκληρη τη συνεκτική πράσινη περιοχή της αφετηρίας. Η άλλη πράσινη περιοχή έμεινε ανέγγιχτη: κανένα πράσινο μονοπάτι δεν περνά μέσα από τα γκρι. Κάνε κλικ μέσα της για να τη γεμίσεις ξεχωριστά.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Flood fill — το «κουβαδάκι» είναι ένα BFS
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {step === last ? 'Ολοκληρώθηκε' : `Κύμα ${step}/${last}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Γεμισμένα: {filled}/{total} pixels της περιοχής
        {step > 0 && step < last ? ` · μέτωπο: ${frontierSize}` : ''}
      </p>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto block w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: ROWS * COLS }, (_, idx) => {
            const r = Math.floor(idx / COLS)
            const c = idx % COLS
            const wall = isWall(r, c)
            const d = distOf.get(cellKey(r, c))
            const isSeed = r === seed.r && c === seed.c
            let fill = '#86efac' // green pixel, not yet filled
            let stroke = '#22c55e'
            if (wall) {
              fill = '#a99a9c'
              stroke = '#8b7d7f'
            } else if (d !== undefined && d <= step - 1) {
              if (d === step - 1) {
                fill = '#3b82f6' // frontier — the live wave
                stroke = '#1d4ed8'
              } else {
                fill = '#bfdbfe' // already filled
                stroke = '#60a5fa'
              }
            }
            return (
              <g
                key={cellKey(r, c)}
                onClick={() => pick(r, c)}
                style={{ cursor: wall ? 'default' : 'pointer' }}
              >
                <rect
                  x={cellX(c)}
                  y={cellY(r)}
                  width={CELL}
                  height={CELL}
                  rx={4}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
                {isSeed && !wall && (
                  <circle
                    cx={cellX(c) + CELL / 2}
                    cy={cellY(r) + CELL / 2}
                    r={6}
                    fill="none"
                    stroke="#7e1031"
                    strokeWidth={2.5}
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= last}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {playing ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {playing ? 'Παύση' : 'Αναπαραγωγή'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setStep((s) => Math.max(0, s - 1))
          }}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setStep((s) => Math.min(last, s + 1))
          }}
          disabled={step >= last}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setStep(0)
          }}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}
