'use client'

/**
 * InversionTypeExplorer — make the «τρία είδη αντιστροφών» decomposition
 * tangible by walking every pair of an actual 8-element array.
 *
 * The static SVG it replaces shows two halves and three arcs labelled
 * «A₁», «A₂», «μικτές» — fine as a glyph, useless as a teaching aid. The
 * student is supposed to internalise that EVERY pair (i, j) lands in
 * exactly ONE of three buckets. So we hand them the array and step
 * through all C(8, 2) = 28 pairs: each pair lights two cells, draws an
 * arc above (red / blue / accent), and updates three counters. After 28
 * clicks the identity
 *
 *     total = (mέσa stο A₁) + (mέσa stο A₂) + (mιkté̱s)
 *
 * is no longer a claim — they watched it happen. Built for L04.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const N = 8
const HALF = 4

type Kind = 'left' | 'right' | 'mixed'

/** All C(8,2)=28 pairs in lexicographic (i, j) order — i,j are 0-indexed. */
const PAIRS: Array<{ i: number; j: number; kind: Kind }> = (() => {
  const out: Array<{ i: number; j: number; kind: Kind }> = []
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      let kind: Kind
      if (j < HALF) kind = 'left'
      else if (i >= HALF) kind = 'right'
      else kind = 'mixed'
      out.push({ i, j, kind })
    }
  }
  return out
})()

/** A starting array with 4 inversions in each bucket — feels balanced. */
const DEFAULT_ARRAY = [4, 2, 7, 1, 8, 3, 6, 5]

function shuffled(): number[] {
  // Reject arrays whose inversions land entirely in one bucket — bad teaching.
  for (let attempt = 0; attempt < 50; attempt++) {
    const pool = [1, 2, 3, 4, 5, 6, 7, 8]
    for (let i = pool.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[k]] = [pool[k], pool[i]]
    }
    const counts = { left: 0, right: 0, mixed: 0 }
    for (const p of PAIRS) {
      if (pool[p.i] > pool[p.j]) counts[p.kind]++
    }
    if (counts.left >= 1 && counts.right >= 1 && counts.mixed >= 3) return pool
  }
  return [...DEFAULT_ARRAY]
}

type Tally = { pairs: number; inversions: number }

function tallyUpTo(arr: number[], upto: number): Record<Kind, Tally> {
  const t: Record<Kind, Tally> = {
    left: { pairs: 0, inversions: 0 },
    right: { pairs: 0, inversions: 0 },
    mixed: { pairs: 0, inversions: 0 },
  }
  for (let k = 0; k <= upto && k < PAIRS.length; k++) {
    const p = PAIRS[k]
    t[p.kind].pairs++
    if (arr[p.i] > arr[p.j]) t[p.kind].inversions++
  }
  return t
}

const KIND_COLOR: Record<Kind, string> = {
  left: '#f43f5e',
  right: '#38bdf8',
  mixed: 'rgb(var(--accent))',
}

const KIND_LABEL: Record<Kind, string> = {
  left: 'και τα δύο στο A₁',
  right: 'και τα δύο στο A₂',
  mixed: 'μικτή — ένα σε κάθε μισό',
}

// SVG layout
const VIEW_W = 640
const CELL_W = 56
const CELL_H = 44
const CELL_GAP = 8
const GAP_BETWEEN_HALVES = 24
const ROW_Y = 188
const VIEW_H = 280

function cellX(idx: number): number {
  const baseX = (VIEW_W - (N * CELL_W + (N - 1) * CELL_GAP + GAP_BETWEEN_HALVES)) / 2
  let x = baseX + idx * (CELL_W + CELL_GAP)
  if (idx >= HALF) x += GAP_BETWEEN_HALVES
  return x
}

function cellCenter(idx: number): { x: number; y: number } {
  return { x: cellX(idx) + CELL_W / 2, y: ROW_Y + CELL_H / 2 }
}

export function InversionTypeExplorer() {
  const [arr, setArr] = useState<number[]>(DEFAULT_ARRAY)
  const [step, setStep] = useState(0) // index into PAIRS (0..27)
  const [showAll, setShowAll] = useState(false)

  const pair = PAIRS[step]
  const tallies = useMemo(() => tallyUpTo(arr, step), [arr, step])
  const total = tallies.left.inversions + tallies.right.inversions + tallies.mixed.inversions
  const isInv = arr[pair.i] > arr[pair.j]
  const finished = step === PAIRS.length - 1

  return (
    <div className="my-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          Διερευνητής
        </span>
        <span className="text-sm font-semibold">Τρία είδη αντιστροφών — βήμα-βήμα</span>
        <span className="ml-auto text-xs text-fg-muted">
          Βήμα {step + 1} / {PAIRS.length}
        </span>
      </div>

      {/* svg */}
      <div className="rounded-xl border border-border bg-bg/40 p-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .ite-half-l { fill: rgb(244 63 94 / 0.10); stroke: rgb(244 63 94 / 0.45); stroke-width: 1.5; }
            .ite-half-r { fill: rgb(56 189 248 / 0.10); stroke: rgb(56 189 248 / 0.45); stroke-width: 1.5; }
            .ite-half-lbl-l { font: 700 11px ui-sans-serif, system-ui; fill: rgb(244 63 94); }
            .ite-half-lbl-r { font: 700 11px ui-sans-serif, system-ui; fill: rgb(56 189 248); }
            .ite-cell { fill: rgb(var(--bg-elevated)); stroke: rgb(var(--border-strong)); stroke-width: 1.5; rx: 6; }
            .ite-cell-active { stroke-width: 2.5; }
            .ite-cell-l { stroke: rgb(244 63 94); }
            .ite-cell-r { stroke: rgb(56 189 248); }
            .ite-val { font: 700 17px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
            .ite-idx { font: 600 10px ui-monospace, monospace; fill: rgb(var(--fg-muted)); text-anchor: middle; }
            .ite-arc { fill: none; stroke-width: 2.2; }
            .ite-arc-faded { fill: none; stroke-width: 1; opacity: 0.18; }
            .ite-tag { font: 700 11px ui-sans-serif, system-ui; text-anchor: middle; }
          `}</style>

          {/* half backgrounds */}
          <rect
            x={cellX(0) - 8}
            y={ROW_Y - 8}
            width={HALF * CELL_W + (HALF - 1) * CELL_GAP + 16}
            height={CELL_H + 16}
            className="ite-half-l"
            rx={10}
          />
          <rect
            x={cellX(HALF) - 8}
            y={ROW_Y - 8}
            width={HALF * CELL_W + (HALF - 1) * CELL_GAP + 16}
            height={CELL_H + 16}
            className="ite-half-r"
            rx={10}
          />
          <text x={cellX(0) + 8} y={ROW_Y - 14} className="ite-half-lbl-l">
            A₁ (αριστερό μισό)
          </text>
          <text x={cellX(HALF) + 8} y={ROW_Y - 14} className="ite-half-lbl-r">
            A₂ (δεξιό μισό)
          </text>

          {/* faded arcs for all pairs already classified (when showAll on, all pairs) */}
          {(showAll ? PAIRS : PAIRS.slice(0, step)).map((p, idx) => {
            if (!showAll && idx === step) return null
            const a = cellCenter(p.i)
            const b = cellCenter(p.j)
            const dx = b.x - a.x
            const lift = Math.min(70, 18 + dx * 0.35)
            const ay = a.y - 28
            const by = b.y - 28
            const cy = a.y - lift
            const inv = arr[p.i] > arr[p.j]
            return (
              <path
                key={`${p.i}-${p.j}`}
                d={`M ${a.x} ${ay} Q ${(a.x + b.x) / 2} ${cy}, ${b.x} ${by}`}
                className="ite-arc-faded"
                stroke={KIND_COLOR[p.kind]}
                strokeDasharray={inv ? '' : '3 3'}
              />
            )
          })}

          {/* current pair arc on top */}
          {!finished || showAll ? null : null}
          {(() => {
            const a = cellCenter(pair.i)
            const b = cellCenter(pair.j)
            const lift = Math.min(90, 30 + (b.x - a.x) * 0.4)
            const ay = a.y - 28
            const by = b.y - 28
            const cy = a.y - lift
            return (
              <g>
                <path
                  d={`M ${a.x} ${ay} Q ${(a.x + b.x) / 2} ${cy}, ${b.x} ${by}`}
                  className="ite-arc"
                  stroke={KIND_COLOR[pair.kind]}
                  strokeDasharray={isInv ? '' : '5 4'}
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={cy + 12}
                  className="ite-tag"
                  fill={KIND_COLOR[pair.kind]}
                >
                  {pair.kind === 'left' ? '①' : pair.kind === 'right' ? '②' : '③'}
                </text>
              </g>
            )
          })()}

          {/* cells */}
          {arr.map((v, idx) => {
            const isOnPair = idx === pair.i || idx === pair.j
            const side = idx < HALF ? 'l' : 'r'
            return (
              <g key={idx}>
                <rect
                  x={cellX(idx)}
                  y={ROW_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={6}
                  className={cn(
                    'ite-cell',
                    isOnPair && 'ite-cell-active',
                    isOnPair && side === 'l' && 'ite-cell-l',
                    isOnPair && side === 'r' && 'ite-cell-r',
                  )}
                  fill={
                    isOnPair
                      ? side === 'l'
                        ? 'rgb(244 63 94 / 0.22)'
                        : 'rgb(56 189 248 / 0.22)'
                      : undefined
                  }
                />
                <text x={cellX(idx) + CELL_W / 2} y={ROW_Y + CELL_H / 2 + 6} className="ite-val">
                  {v}
                </text>
                <text x={cellX(idx) + CELL_W / 2} y={ROW_Y + CELL_H + 14} className="ite-idx">
                  θέση {idx + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* current-pair commentary */}
      <div className="mt-3 rounded-xl border border-border bg-bg/40 p-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-fg-muted">
            (i, j) = ({pair.i + 1}, {pair.j + 1})
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: `${KIND_COLOR[pair.kind]}22`,
              color: KIND_COLOR[pair.kind],
            }}
          >
            {KIND_LABEL[pair.kind]}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
              isInv
                ? 'bg-rose-500/20 text-rose-500'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
            )}
          >
            {isInv ? '✗ αντιστροφή' : '✓ σωστή σειρά'}
          </span>
        </div>
        <div className="mt-1.5 text-xs text-fg-muted">
          A[{pair.i + 1}] = <span className="font-mono text-fg">{arr[pair.i]}</span>
          {' '}
          {isInv ? '>' : '≤'}{' '}
          A[{pair.j + 1}] = <span className="font-mono text-fg">{arr[pair.j]}</span>
          {' — '}
          {isInv
            ? 'μεγαλύτερο μπροστά, μικρότερο πίσω → είναι αντιστροφή.'
            : 'μικρότερο μπροστά, μεγαλύτερο πίσω → σωστή σειρά, καμία αντιστροφή.'}
        </div>
      </div>

      {/* tallies dashboard */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(['left', 'right', 'mixed'] as Kind[]).map((k) => (
          <div
            key={k}
            className="rounded-xl border p-3 text-xs"
            style={{
              borderColor: `${KIND_COLOR[k]}55`,
              backgroundColor: `${KIND_COLOR[k]}0d`,
            }}
          >
            <div className="font-semibold" style={{ color: KIND_COLOR[k] }}>
              {k === 'left' ? '① μέσα στο A₁' : k === 'right' ? '② μέσα στο A₂' : '③ μικτές'}
            </div>
            <div className="mt-1 text-fg-muted">
              Εξέτασα {tallies[k].pairs} / {k === 'mixed' ? HALF * HALF : (HALF * (HALF - 1)) / 2}{' '}
              ζευγάρια
            </div>
            <div className="mt-1.5 text-lg font-bold" style={{ color: KIND_COLOR[k] }}>
              {tallies[k].inversions} <span className="text-xs font-medium">αντιστροφές</span>
            </div>
          </div>
        ))}
      </div>

      {/* total identity */}
      <div className="mt-3 rounded-xl border border-border bg-bg/40 p-3 text-center font-mono text-sm">
        σύνολο μέχρι τώρα ={' '}
        <span className="font-bold" style={{ color: KIND_COLOR.left }}>
          {tallies.left.inversions}
        </span>{' '}
        +{' '}
        <span className="font-bold" style={{ color: KIND_COLOR.right }}>
          {tallies.right.inversions}
        </span>{' '}
        +{' '}
        <span className="font-bold" style={{ color: KIND_COLOR.mixed }}>
          {tallies.mixed.inversions}
        </span>{' '}
        = <span className="text-base font-bold text-accent">{total}</span>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg disabled:opacity-50"
          onClick={() => {
            setStep(0)
            setShowAll(false)
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Από την αρχή
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
          onClick={() => {
            setArr(shuffled())
            setStep(0)
            setShowAll(false)
          }}
        >
          <Shuffle className="h-3.5 w-3.5" />
          Νέος πίνακας
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg disabled:opacity-50"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Πίσω
        </button>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/25 disabled:opacity-50"
          onClick={() => setStep((s) => Math.min(PAIRS.length - 1, s + 1))}
          disabled={finished}
        >
          Επόμενο
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
          onClick={() => {
            setStep(PAIRS.length - 1)
            setShowAll(true)
          }}
        >
          <Play className="h-3.5 w-3.5" />
          Δες όλα μαζί
        </button>
      </div>

      {finished && (
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <div className="font-semibold text-accent">Όλα τα 28 ζευγάρια κατατάχθηκαν.</div>
          <div className="mt-1 text-fg-muted">
            Κάθε ζευγάρι μπήκε σε <em>ακριβώς ένα</em> από τα τρία είδη — γι' αυτό ισχύει με
            ισότητα:{' '}
            <span className="font-mono">
              σύνολο = {tallies.left.inversions} + {tallies.right.inversions} +{' '}
              {tallies.mixed.inversions} = {total}
            </span>
            . Τα δύο πρώτα τα παίρνει «δωρεάν» η αναδρομή· μένει να μετρήσουμε γρήγορα τις{' '}
            <span style={{ color: KIND_COLOR.mixed }} className="font-semibold">
              μικτές
            </span>
            .
          </div>
        </div>
      )}
    </div>
  )
}
