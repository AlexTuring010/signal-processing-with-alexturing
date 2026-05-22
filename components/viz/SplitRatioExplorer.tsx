'use client'

/**
 * SplitRatioExplorer — why mergesort splits in the middle.
 *
 * The L03 page asks: «τι θα γινόταν αν διαιρούσαμε σε n−2 και 2;» and answers
 * in prose that the recurrence becomes T(n) = T(n−2) + Θ(n) = Θ(n²).  For a
 * struggling student that's a calculation, not a picture.
 *
 * The viz shows two facts visually:
 *
 *   1) **Αναλογικός διαχωρισμός** (proportional / "ίδιο κλάσμα κάθε φορά") —
 *      slider for the ratio α from 0.50 (balanced) up to 0.90 (very skewed).
 *      The recursion tree stays *logarithmic* in depth and total work
 *      stays O(n log n) — only the constant in front grows mildly.
 *
 *   2) **Σταθερός διαχωρισμός** (constant-chunk, like «n−2 and 2») — the
 *      recursion tree becomes a caterpillar of depth ≈ n/c, and total
 *      work blows up to Θ(n²).
 *
 * Switching between the two modes makes the **shape of the tree** carry
 * the argument — the math sits underneath in a small live formula.
 *
 * Built for L03.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Mode = 'proportional' | 'constant'

const N = 32 // friendly size for showing 5–6 levels

export function SplitRatioExplorer() {
  const [mode, setMode] = useState<Mode>('proportional')
  // proportional: bigger half is α·n, 0.50 ≤ α ≤ 0.90
  const [alpha, setAlpha] = useState(0.5)
  // constant: bigger piece is (n − c), 1 ≤ c ≤ 8
  const [c, setC] = useState(2)

  const tree = useMemo(() => buildTree(N, mode, alpha, c), [mode, alpha, c])

  const depth = tree.depth
  const workPerLevel = N // each level still touches every element
  const totalWork = depth * workPerLevel

  // Reference numbers for the verdict.
  const idealLogDepth = Math.log2(N)
  const verdictClass = mode === 'constant' ? 'warn' : depth <= idealLogDepth * 1.6 ? 'success' : 'warn'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σχήμα δέντρου αναδρομής vs τρόπος διαχωρισμού — με n = {N}
        </div>
      </div>

      {/* mode tabs */}
      <div className="mb-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => setMode('proportional')}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            mode === 'proportional'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border text-fg-muted hover:text-fg',
          )}
        >
          Αναλογικός διαχωρισμός (α·n / (1−α)·n)
        </button>
        <button
          type="button"
          onClick={() => setMode('constant')}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            mode === 'constant'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border text-fg-muted hover:text-fg',
          )}
        >
          Σταθερός διαχωρισμός (n − c / c)
        </button>
      </div>

      {/* slider */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
        {mode === 'proportional' ? (
          <>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="text-fg-muted">
                κλάσμα μεγάλου κομματιού <span className="font-mono">α</span>
              </span>
              <span className="font-mono text-sm font-bold text-fg">
                {(alpha * 100).toFixed(0)} / {((1 - alpha) * 100).toFixed(0)}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={0.9}
              step={0.05}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              aria-label="κλάσμα μεγάλου κομματιού"
              className="h-1.5 w-full cursor-pointer accent-accent"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-subtle">
              <span>50/50 (ιδανικό)</span>
              <span>90/10 (πολύ άνισο)</span>
            </div>
          </>
        ) : (
          <>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="text-fg-muted">
                σταθερό μικρό κομμάτι <span className="font-mono">c</span>
              </span>
              <span className="font-mono text-sm font-bold text-fg">
                {N - c} / {c}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
              aria-label="σταθερό μικρό κομμάτι"
              className="h-1.5 w-full cursor-pointer accent-accent"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-subtle">
              <span>c = 1 (n−1 / 1)</span>
              <span>c = 8 (n−8 / 8)</span>
            </div>
          </>
        )}
      </div>

      {/* the tree */}
      <div className="rounded-lg border border-border bg-bg-soft/40 p-2">
        <TreeView nodes={tree.nodes} />
        {tree.truncated && (
          <div className="mt-1 text-center text-[11px] italic text-fg-subtle">
            (τα τελευταία επίπεδα κρύφτηκαν για να χωρέσει στην οθόνη)
          </div>
        )}
      </div>

      {/* verdict */}
      <div
        className={cn(
          'mt-3 grid gap-2 sm:grid-cols-3',
        )}
      >
        <Stat label="βάθος δέντρου" value={depth.toString()} hint={mode === 'constant' ? `≈ n/c = ${Math.ceil(N / c)}` : `≈ log₁/(1−α) n ≈ ${idealLogDepth.toFixed(1)}…${(Math.log(N) / Math.log(1 / (1 - alpha))).toFixed(1)}`} />
        <Stat label="δουλειά ανά επίπεδο" value={`≈ ${workPerLevel}`} hint="τα κομμάτια καλύπτουν όλη την είσοδο" />
        <Stat
          label="συνολική δουλειά"
          value={
            mode === 'constant'
              ? `≈ ${totalWork} ≈ Θ(n²)`
              : `≈ ${totalWork} ≈ Θ(n log n)`
          }
          hint={mode === 'constant' ? `βάθος × n = γραμμικό × n` : `βάθος × n = λογαριθμικό × n`}
          tone={verdictClass}
        />
      </div>

      {/* explanation */}
      <div
        className={cn(
          'mt-3 rounded-lg border px-3 py-2.5 text-sm leading-relaxed text-fg',
          mode === 'constant'
            ? 'border-warn/40 bg-warn/5'
            : 'border-accent/30 bg-accent/5',
        )}
      >
        {mode === 'constant' ? (
          <>
            <b>Το βάθος είναι γραμμικό.</b> Όταν αφαιρείς {c} στοιχεία σε κάθε αναδρομή, χρειάζονται{' '}
            <b className="font-mono">{Math.ceil(N / c)}</b> επίπεδα για να φτάσεις στο 1 (αντί για{' '}
            <b className="font-mono">log₂ {N} = {idealLogDepth.toFixed(0)}</b>). Πολλαπλασίασέ τα με την{' '}
            <b>n</b> δουλειά ανά επίπεδο → <b>Θ(n²)</b>. Χάθηκε όλο το όφελος του D&C.
          </>
        ) : (
          <>
            <b>Αρκεί να μην εξαρτάται το κομμάτι από το n.</b> Με α = {(alpha * 100).toFixed(0)}%, το βαθύτερο
            μονοπάτι ακολουθεί διαρκώς το μεγάλο κομμάτι — αλλά κάθε φορά μικραίνει κατά παράγοντα{' '}
            <b className="font-mono">1/α</b>, οπότε φτάνει στο 1 σε{' '}
            <b className="font-mono">≈ log₁/α n</b> βήματα — <b>λογαριθμικό</b>. Πολλαπλασίασε με την{' '}
            <b>n</b> δουλειά ανά επίπεδο → <b>O(n log n)</b>. Ο διαχωρισμός 50/50 είναι ο γρηγορότερος,
            αλλά κάθε σταθερό κλάσμα δίνει την ίδια τάξη.
          </>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────  tree building  ─────────────────────────── */

type TreeNode = { id: string; size: number; level: number; x: number; col: number; parentCol: number | null }

const MAX_LEVELS_RENDER = 7
const MIN_LEAF = 1

function buildTree(n: number, mode: Mode, alpha: number, c: number): { nodes: TreeNode[]; depth: number; truncated: boolean } {
  // Compute the ACTUAL depth (without truncation) by following the heavy path.
  let actualDepth = 0
  let cur = n
  while (cur > MIN_LEAF && actualDepth < 1000) {
    if (mode === 'proportional') {
      cur = Math.max(1, Math.ceil(cur * alpha))
    } else {
      if (cur - c <= c) {
        cur = c
        actualDepth++
        break
      }
      cur = cur - c
    }
    actualDepth++
  }

  // Render up to MAX_LEVELS_RENDER levels for visibility.
  const rendered = Math.min(actualDepth + 1, MAX_LEVELS_RENDER)
  const nodes: TreeNode[] = []
  let col = 0
  type Q = { size: number; level: number; parentCol: number | null }
  const queue: Q[] = [{ size: n, level: 0, parentCol: null }]
  while (queue.length) {
    const node = queue.shift()!
    if (node.level >= rendered) continue
    const id = `l${node.level}c${col}`
    nodes.push({ id, size: node.size, level: node.level, x: col, col, parentCol: node.parentCol })
    const thisCol = col
    col++
    if (node.size <= MIN_LEAF) continue
    if (node.level + 1 >= rendered) continue
    let left: number
    let right: number
    if (mode === 'proportional') {
      left = Math.max(1, Math.ceil(node.size * alpha))
      right = node.size - left
    } else {
      if (node.size - c < c) {
        // size shrinks to the single big-piece; treat as terminal-ish
        left = Math.max(1, node.size - c)
        right = Math.min(c, node.size - left)
      } else {
        left = node.size - c
        right = c
      }
    }
    if (left <= 0 || right <= 0) continue
    queue.push({ size: left, level: node.level + 1, parentCol: thisCol })
    queue.push({ size: right, level: node.level + 1, parentCol: thisCol })
  }

  return { nodes, depth: actualDepth, truncated: actualDepth + 1 > MAX_LEVELS_RENDER }
}

/* ─────────────────────────────  rendering  ─────────────────────────────── */

function TreeView({ nodes }: { nodes: TreeNode[] }) {
  if (nodes.length === 0) return null
  const maxLevel = Math.max(...nodes.map((n) => n.level))
  const levels: TreeNode[][] = []
  for (let i = 0; i <= maxLevel; i++) levels.push([])
  nodes.forEach((n) => levels[n.level].push(n))

  // Compute horizontal centre per node by recursing through children.
  // Build children map.
  const children = new Map<string, TreeNode[]>()
  nodes.forEach((n) => {
    if (n.parentCol === null) return
    const parent = nodes.find((p) => p.level === n.level - 1 && p.col === n.parentCol)
    if (!parent) return
    const arr = children.get(parent.id) ?? []
    arr.push(n)
    children.set(parent.id, arr)
  })

  // Assign x positions: leaves get sequential slots; internals get midpoint.
  const widthPerLeaf = 28
  const leafXs = new Map<string, number>()
  let leafCursor = 0
  function dfsLeaves(node: TreeNode) {
    const kids = children.get(node.id) ?? []
    if (kids.length === 0) {
      leafXs.set(node.id, leafCursor * widthPerLeaf)
      leafCursor++
      return
    }
    kids.forEach(dfsLeaves)
  }
  const root = nodes.find((n) => n.level === 0)
  if (!root) return null
  dfsLeaves(root)

  const xs = new Map<string, number>()
  function dfsX(node: TreeNode): number {
    const kids = children.get(node.id) ?? []
    if (kids.length === 0) {
      const x = leafXs.get(node.id)!
      xs.set(node.id, x)
      return x
    }
    const childXs = kids.map(dfsX)
    const mid = (Math.min(...childXs) + Math.max(...childXs)) / 2
    xs.set(node.id, mid)
    return mid
  }
  dfsX(root)

  const totalWidth = Math.max(80, leafCursor * widthPerLeaf)
  const levelHeight = 38
  const totalHeight = (maxLevel + 1) * levelHeight + 20
  const maxSize = Math.max(...nodes.map((n) => n.size))

  return (
    <svg viewBox={`-12 -8 ${totalWidth + 24} ${totalHeight + 16}`} className="w-full" preserveAspectRatio="xMidYMin meet">
      {/* edges */}
      {nodes.map((n) => {
        if (n.parentCol === null) return null
        const parent = nodes.find((p) => p.level === n.level - 1 && p.col === n.parentCol)
        if (!parent) return null
        const x1 = xs.get(parent.id)!
        const y1 = parent.level * levelHeight + 16
        const x2 = xs.get(n.id)!
        const y2 = n.level * levelHeight
        return (
          <line
            key={`e-${n.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgb(var(--border-strong))"
            strokeWidth="1"
          />
        )
      })}
      {/* nodes — width scales with size */}
      {nodes.map((n) => {
        const x = xs.get(n.id)!
        const y = n.level * levelHeight
        const w = Math.max(14, Math.min(40, 8 + (n.size / maxSize) * 30))
        return (
          <g key={n.id}>
            <rect
              x={x - w / 2}
              y={y}
              width={w}
              height={16}
              rx={3}
              fill="rgb(var(--bg-elevated))"
              stroke="rgb(var(--accent))"
              strokeWidth="1"
            />
            <text
              x={x}
              y={y + 12}
              textAnchor="middle"
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              fontWeight={600}
              fill="rgb(var(--fg))"
            >
              {n.size}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Stat({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'success' | 'warn' }) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        tone === 'warn'
          ? 'border-warn/40 bg-warn/5'
          : tone === 'success'
            ? 'border-success/40 bg-success/5'
            : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold text-fg">{value}</div>
      {hint && <div className="mt-0.5 font-mono text-[10px] text-fg-subtle">{hint}</div>}
    </div>
  )
}
