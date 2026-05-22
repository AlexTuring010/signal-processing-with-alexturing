'use client'

/**
 * HanoiAnimator — D&C with exponential cost.
 *
 * The L03 page shows the initial state of the pegs as a static SVG and
 * derives T(n) = 2T(n−1) + 1 = 2ⁿ − 1 in prose. That's enough to follow,
 * not enough to *feel* why the same D&C scheme that gives O(n log n) for
 * mergesort gives 2ⁿ − 1 here.
 *
 * Two tabs share an n-slider:
 *
 *   • «Δες τις κινήσεις»  — three pegs, animated. The student presses ▶
 *     and watches the moves stream past while a counter ticks up. The
 *     payoff: at n = 7 the counter hits 127. The number is no longer
 *     abstract.
 *
 *   • «Δες την έκρηξη»    — the recursion tree of hanoi(n,…) drawn level
 *     by level, every internal node split into two children, and a per-
 *     level tally that doubles: 1, 2, 4, 8, … This is exactly the
 *     mirror image of the mergesort tree (per-level constant) and lands
 *     the comparison.
 *
 * Built for L03.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'moves' | 'tree'
type Peg = 0 | 1 | 2 // 0 = A, 1 = B, 2 = C
type Move = { from: Peg; to: Peg; disk: number }

const PEG_LABEL = ['A', 'B', 'C'] as const

/** Generate the full move sequence of hanoi(n, from→to, via). */
function hanoiMoves(n: number, from: Peg = 0, to: Peg = 2, via: Peg = 1): Move[] {
  if (n <= 0) return []
  const moves: Move[] = []
  // emit the moves of hanoi(n-1, from→via, to)
  moves.push(...hanoiMoves(n - 1, from, via, to))
  moves.push({ from, to, disk: n })
  moves.push(...hanoiMoves(n - 1, via, to, from))
  return moves
}

/** Apply moves[0..step] to a fresh initial state with n disks on peg 0. */
function applyMoves(n: number, moves: Move[], step: number): number[][] {
  const pegs: number[][] = [[], [], []]
  for (let d = n; d >= 1; d--) pegs[0].push(d)
  for (let i = 0; i < step; i++) {
    const m = moves[i]
    const top = pegs[m.from].pop()!
    pegs[m.to].push(top)
  }
  return pegs
}

export function HanoiAnimator() {
  const [tab, setTab] = useState<Tab>('moves')
  const [n, setN] = useState(3)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const lastTickRef = useRef(0)

  const moves = useMemo(() => hanoiMoves(n), [n])
  const totalMoves = moves.length // = 2^n - 1

  // Reset step when n changes.
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [n])

  // Animation loop.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    function tick(now: number) {
      const delay = Math.max(180, 700 - n * 60) // faster with bigger n so it doesn't drag
      if (now - lastTickRef.current > delay) {
        lastTickRef.current = now
        setStep((s) => {
          if (s >= totalMoves) {
            setPlaying(false)
            return totalMoves
          }
          return s + 1
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, totalMoves, n])

  const pegs = useMemo(() => applyMoves(n, moves, step), [n, moves, step])
  const reset = () => {
    setStep(0)
    setPlaying(false)
  }
  const lastMove = step > 0 ? moves[step - 1] : null

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πύργος του Hanoi — γιατί το D&C μπορεί και να εκραγεί
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('moves')}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              tab === 'moves'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            Δες τις κινήσεις
          </button>
          <button
            type="button"
            onClick={() => setTab('tree')}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              tab === 'tree'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            Δες την έκρηξη
          </button>
        </div>
      </div>

      {/* n slider */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
          <span className="text-fg-muted">
            πλήθος δίσκων <span className="font-mono">n</span>
          </span>
          <span className="font-mono text-sm font-bold text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label="πλήθος δίσκων"
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-subtle">
          <span>1 (1 κίνηση)</span>
          <span>7 (127 κινήσεις)</span>
        </div>
      </div>

      {tab === 'moves' ? (
        <MovesView pegs={pegs} n={n} lastMove={lastMove} />
      ) : (
        <TreeView n={n} />
      )}

      {/* shared counters */}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label="κινήσεις ως τώρα" value={step.toString()} />
        <Stat label="σύνολο 2ⁿ − 1" value={totalMoves.toString()} tone={n >= 6 ? 'warn' : undefined} />
        <Stat
          label="vs mergesort (n·log n)"
          value={`${Math.round(n * Math.max(1, Math.log2(n)))}`}
          hint="συγχωνεύσεις σε ταξινόμηση n στοιχείων"
        />
      </div>

      {/* controls — only relevant in moves tab */}
      {tab === 'moves' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={step >= totalMoves}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Παύση' : 'Παίξε'}
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(s + 1, totalMoves))}
            disabled={playing || step >= totalMoves}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
            Επόμενη
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
          >
            <RotateCcw className="h-4 w-4" />
            Από την αρχή
          </button>
          {lastMove && (
            <span className="ml-auto rounded-md border border-border bg-bg-soft/50 px-2 py-1 font-mono text-xs text-fg-muted">
              {PEG_LABEL[lastMove.from]} → {PEG_LABEL[lastMove.to]} (δίσκος {lastMove.disk})
            </span>
          )}
        </div>
      )}

      {/* takeaway when finished */}
      {tab === 'moves' && step >= totalMoves && step > 0 && (
        <div className="mt-3 rounded-lg border border-warn/40 bg-warn/5 px-3 py-2.5 text-sm leading-relaxed text-fg">
          <span className="font-semibold">Συνολικές κινήσεις: {totalMoves}.</span> Για n = 7 αυτό
          είναι 127· για n = 30 ξεπερνά το ένα δισεκατομμύριο. Το D&C δεν εγγυάται γρήγορο
          αλγόριθμο — εδώ η συνολική δουλειά <b>διπλασιάζεται</b> σε κάθε επίπεδο αναδρομής (2 κλήσεις, η
          ίδια δουλειά κατά κλήση), αντί να <b>μένει σταθερή</b> όπως στη mergesort.
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────  pegs view  ────────────────────────────── */

function MovesView({ pegs, n, lastMove }: { pegs: number[][]; n: number; lastMove: Move | null }) {
  const W = 360
  const H = 130
  const pegX = [60, 180, 300]
  const baseY = H - 14
  const diskHeight = Math.min(14, 90 / n)
  const minW = 18
  const maxW = 60
  const widthForDisk = (d: number) => minW + ((d - 1) / Math.max(1, n - 1)) * (maxW - minW)

  // Track the disk being moved this step for a pop highlight.
  const moveDisk = lastMove?.disk

  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-2.5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md">
        {/* base */}
        <rect x={20} y={baseY} width={W - 40} height={6} rx={2} fill="rgb(var(--border-strong))" />
        {/* poles + labels */}
        {pegX.map((x, i) => (
          <g key={i}>
            <line
              x1={x}
              y1={baseY - 80}
              x2={x}
              y2={baseY}
              stroke="rgb(var(--border-strong))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x={x} y={baseY + 22} textAnchor="middle" fontSize="11" fontWeight={700} fill="rgb(var(--fg))">
              {PEG_LABEL[i]}
            </text>
          </g>
        ))}
        {/* disks */}
        {pegs.map((stack, pegIdx) =>
          stack.map((disk, j) => {
            const w = widthForDisk(disk)
            const x = pegX[pegIdx] - w / 2
            const y = baseY - (j + 1) * diskHeight + 1
            const isMoved = disk === moveDisk && j === stack.length - 1
            return (
              <rect
                key={`p${pegIdx}-${j}`}
                x={x}
                y={y}
                width={w}
                height={diskHeight - 1}
                rx={3}
                fill={diskColor(disk, n)}
                stroke={isMoved ? 'rgb(var(--accent))' : 'rgba(0,0,0,0.25)'}
                strokeWidth={isMoved ? 2 : 1}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}

function diskColor(disk: number, n: number): string {
  // gradient from cool (small) to warm (large)
  const t = (disk - 1) / Math.max(1, n - 1)
  const hue = 200 - t * 200 // 200 (cyan) → 0 (red)
  return `hsl(${hue}, 65%, 55%)`
}

/* ─────────────────────────────  tree view  ────────────────────────────── */

function TreeView({ n }: { n: number }) {
  // For visualisation, cap at n = 5 (tree size 2^5−1 = 31 nodes) so it fits.
  // For larger n, render up to depth 5 and stop with an ellipsis.
  const maxRenderLevels = Math.min(n, 5)
  const totalLevels = n

  type N = { id: string; level: number; size: number; x: number; parent: string | null }
  const nodes: N[] = []
  const widthPerLeaf = 22

  // Use a recursive build that assigns left-to-right x positions.
  let leafCursor = 0
  function build(level: number, size: number, parent: string | null): string {
    const id = `n${nodes.length}`
    if (level >= maxRenderLevels || size <= 1) {
      const x = leafCursor * widthPerLeaf
      leafCursor++
      nodes.push({ id, level, size, x, parent })
      return id
    }
    const leftId = build(level + 1, size - 1, id)
    const rightId = build(level + 1, size - 1, id)
    const leftN = nodes.find((n) => n.id === leftId)!
    const rightN = nodes.find((n) => n.id === rightId)!
    const x = (leftN.x + rightN.x) / 2
    nodes.push({ id, level, size, x, parent })
    return id
  }
  build(0, n, null)

  const totalWidth = Math.max(80, leafCursor * widthPerLeaf)
  const levelHeight = 30
  const totalHeight = (maxRenderLevels + 1) * levelHeight + 6
  const truncated = totalLevels > maxRenderLevels

  // Per-level work tally (true even when render is truncated).
  const levelCounts = Array.from({ length: totalLevels }, (_, i) => 2 ** i)
  const cumulative = levelCounts.reduce((a, b) => a + b, 0)

  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 p-2.5">
      <svg viewBox={`-12 -6 ${totalWidth + 24} ${totalHeight + 16}`} className="w-full" preserveAspectRatio="xMidYMin meet">
        {/* edges */}
        {nodes.map((node) => {
          if (!node.parent) return null
          const parent = nodes.find((p) => p.id === node.parent)!
          return (
            <line
              key={`e-${node.id}`}
              x1={parent.x + widthPerLeaf / 2}
              y1={parent.level * levelHeight + 16}
              x2={node.x + widthPerLeaf / 2}
              y2={node.level * levelHeight}
              stroke="rgb(var(--border-strong))"
              strokeWidth="1"
            />
          )
        })}
        {/* nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.level * levelHeight}
              width={widthPerLeaf}
              height={16}
              rx={3}
              fill="rgb(var(--bg-elevated))"
              stroke="rgb(var(--accent))"
              strokeWidth="1"
            />
            <text
              x={node.x + widthPerLeaf / 2}
              y={node.level * levelHeight + 12}
              textAnchor="middle"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              fontWeight={600}
              fill="rgb(var(--fg))"
            >
              {node.size}
            </text>
          </g>
        ))}
      </svg>
      {truncated && (
        <div className="mt-1 text-center text-[11px] italic text-fg-subtle">
          (το δέντρο φτάνει σε βάθος n = {totalLevels} — εδώ δείχνουμε τα πρώτα {maxRenderLevels})
        </div>
      )}

      {/* per-level tally */}
      <div className="mt-2 rounded-md border border-border bg-bg-elevated/60 px-2.5 py-2">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          Κλήσεις ανά επίπεδο — διπλασιάζονται
        </div>
        <div className="flex flex-wrap items-end gap-1.5">
          {levelCounts.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="rounded-sm bg-accent/70"
                style={{ width: 12, height: Math.max(3, Math.min(40, Math.log2(c + 1) * 8)) }}
              />
              <span className="mt-0.5 font-mono text-[9px] text-fg-subtle">{c}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 text-center font-mono text-[11px] text-fg-muted">
          1 + 2 + 4 + … + 2<sup>{totalLevels - 1}</sup> = 2<sup>{totalLevels}</sup> − 1 = {cumulative}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────  shared bits  ──────────────────────────── */

function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'warn' }) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        tone === 'warn' ? 'border-warn/40 bg-warn/5' : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold text-fg">{value}</div>
      {hint && <div className="mt-0.5 font-mono text-[10px] text-fg-subtle">{hint}</div>}
    </div>
  )
}
