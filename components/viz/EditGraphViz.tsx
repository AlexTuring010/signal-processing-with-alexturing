'use client'

/**
 * EditGraphViz — the edit-distance DP grid, redrawn as the graph it secretly
 * is, with the optimal alignment walked out as a shortest path.
 *
 * The first «deep idea» of L16: the table the student just filled is a
 * directed graph. Every cell (i,j) is a vertex; every cell holds OPT(i,j),
 * which is EXACTLY the shortest distance from the corner (0,0). The three
 * recurrence cases are the three edge types:
 *
 *   · κάτω    (i−1,j) → (i,j)   cost δ — leave xᵢ unmatched
 *   · δεξιά   (i,j−1) → (i,j)   cost δ — leave yⱼ unmatched
 *   · διαγώνια (i−1,j−1) → (i,j) cost α — pair xᵢ with yⱼ
 *
 * The student steps along the shortest path (0,0) → (m,n); each edge is one
 * column of the alignment, read off live. Built for L16 on the shared
 * GCTA / CTAG instance.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EDIT_X,
  EDIT_Y,
  buildEditTable,
  optimalSteps,
  type AlignStep,
} from './alignment-instance'

const X = EDIT_X
const Y = EDIT_Y
const M = X.length
const N = Y.length
const TABLE = buildEditTable(X, Y)
const PATH = optimalSteps(X, Y)
const LAST = PATH.length

// SVG geometry
const MX = 80
const MY = 72
const DX = 92
const DY = 72
const R = 18
const node = (i: number, j: number) => ({ x: MX + j * DX, y: MY + i * DY })

const EDGE_TONE: Record<AlignStep['kind'], string> = {
  match: 'rgb(16 185 129)',
  gapX: 'rgb(56 189 248)',
  gapY: 'rgb(167 139 250)',
}

/** path-edge endpoint, pulled back so the arrowhead sits outside the node */
function shorten(i0: number, j0: number, i1: number, j1: number) {
  const a = node(i0, j0)
  const b = node(i1, j1)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  return {
    x1: a.x + (dx / len) * R,
    y1: a.y + (dy / len) * R,
    x2: b.x - (dx / len) * (R + 4),
    y2: b.y - (dy / len) * (R + 4),
  }
}

export function EditGraphViz() {
  const [step, setStep] = useState(0)
  const done = step === LAST
  const shown = PATH.slice(0, step)
  const current = step >= 1 ? PATH[step - 1] : null

  // every cell touched by a revealed edge
  const onPath = new Set<string>(['0,0'])
  for (const s of shown) onPath.add(`${s.i1},${s.j1}`)

  const cost = shown.reduce((a, s) => a + s.cost, 0)

  let note: string
  if (step === 0) {
    note =
      'Κάθε κελί είναι μια κορυφή· ο αριθμός μέσα του είναι το OPT(i, j) — και αυτό ισούται ακριβώς με το μήκος του συντομότερου μονοπατιού από την κορυφή (0, 0). Πάτα «Επόμενο» για να περπατήσεις το βέλτιστο μονοπάτι.'
  } else if (current) {
    const kind =
      current.kind === 'match'
        ? `διαγώνια ακμή — ζευγάρωσε «${current.xi}» με «${current.yj}», κόστος ${current.cost}${current.cost === 0 ? ' (ίδιοι)' : ' (σύγκρουση α)'}`
        : current.kind === 'gapX'
          ? `ακμή προς τα κάτω — άσε το «${current.xi}» της X αταίριαστο, κόστος δ`
          : `ακμή προς τα δεξιά — άσε το «${current.yj}» της Y αταίριαστο, κόστος δ`
    note = `Βήμα ${step}: ${kind}. Κόστος μονοπατιού ως εδώ: ${cost} = OPT(${current.i1}, ${current.j1}).`
    if (done)
      note +=
        ' Φτάσαμε στο (m, n): το συντομότερο μονοπάτι είναι η απόσταση επεξεργασίας.'
  } else {
    note = ''
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το πλέγμα ως γράφημα — η ευθυγράμμιση είναι συντομότερο μονοπάτι
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            done ? 'bg-success/15 text-success' : 'bg-accent/10 text-accent',
          )}
        >
          {done ? `Απόσταση = ${cost}` : `Κόστος: ${cost}`}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Το ίδιο πλέγμα που γέμισες — αλλά τώρα κάθε κελί είναι κορυφή και κάθε
        επιλογή της αναδρομής είναι μια ακμή με κόστος.
      </p>

      {/* the graph */}
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 540 410"
          className="mx-auto w-full max-w-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {(['match', 'gapX', 'gapY'] as const).map((k) => (
              <marker
                key={k}
                id={`eg-${k}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_TONE[k]} />
              </marker>
            ))}
          </defs>

          {/* faint edges — establishes the graph structure */}
          {Array.from({ length: M + 1 }).flatMap((_, i) =>
            Array.from({ length: N + 1 }).flatMap((_, j) => {
              const a = node(i, j)
              const segs: React.ReactNode[] = []
              if (j < N) {
                const b = node(i, j + 1)
                segs.push(
                  <line
                    key={`r${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="rgb(var(--fg-subtle))"
                    strokeWidth={1}
                    opacity={0.28}
                  />,
                )
              }
              if (i < M) {
                const b = node(i + 1, j)
                segs.push(
                  <line
                    key={`d${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="rgb(var(--fg-subtle))"
                    strokeWidth={1}
                    opacity={0.28}
                  />,
                )
              }
              if (i < M && j < N) {
                const b = node(i + 1, j + 1)
                segs.push(
                  <line
                    key={`g${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="rgb(var(--fg-subtle))"
                    strokeWidth={1}
                    opacity={0.16}
                  />,
                )
              }
              return segs
            }),
          )}

          {/* the revealed shortest-path edges */}
          {shown.map((s, idx) => {
            const { x1, y1, x2, y2 } = shorten(s.i0, s.j0, s.i1, s.j1)
            return (
              <line
                key={`p${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={EDGE_TONE[s.kind]}
                strokeWidth={3.5}
                markerEnd={`url(#eg-${s.kind})`}
              />
            )
          })}

          {/* column headers (Y) */}
          {Y.split('').map((ch, j) => (
            <text
              key={`yh${j}`}
              x={node(0, j + 1).x}
              y={MY - 38}
              textAnchor="middle"
              fill="rgb(var(--fg))"
              className="font-mono text-[13px] font-bold"
            >
              {ch}
            </text>
          ))}
          {/* row headers (X) */}
          {X.split('').map((ch, i) => (
            <text
              key={`xh${i}`}
              x={MX - 40}
              y={node(i + 1, 0).y + 5}
              textAnchor="middle"
              fill="rgb(var(--fg))"
              className="font-mono text-[13px] font-bold"
            >
              {ch}
            </text>
          ))}

          {/* nodes */}
          {Array.from({ length: M + 1 }).flatMap((_, i) =>
            Array.from({ length: N + 1 }).map((_, j) => {
              const { x, y } = node(i, j)
              const here = onPath.has(`${i},${j}`)
              const isCur = current && current.i1 === i && current.j1 === j
              return (
                <g key={`n${i}-${j}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={R}
                    fill={here ? 'rgb(var(--accent))' : 'rgb(var(--bg-soft))'}
                    fillOpacity={here ? 0.18 : 1}
                    stroke={here ? 'rgb(var(--accent))' : 'rgb(var(--fg-subtle))'}
                    strokeWidth={isCur ? 3 : here ? 2.2 : 1.4}
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill={here ? 'rgb(var(--fg))' : 'rgb(var(--fg-muted))'}
                    className="font-mono text-[13px] font-bold"
                  >
                    {TABLE[i][j]}
                  </text>
                </g>
              )
            }),
          )}
        </svg>
      </div>

      {/* legend */}
      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-fg-muted">
        {[
          { tone: EDGE_TONE.gapX, label: 'κάτω = κενό στο X (xᵢ αταίριαστο), δ' },
          { tone: EDGE_TONE.gapY, label: 'δεξιά = κενό στο Y (yⱼ αταίριαστο), δ' },
          { tone: EDGE_TONE.match, label: 'διαγώνια = ταίριασμα xᵢ–yⱼ, α' },
        ].map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-1 w-5 rounded-full"
              style={{ background: l.tone }}
            />
            {l.label}
          </span>
        ))}
      </div>

      {/* alignment read-off */}
      {step > 0 && (
        <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 p-3">
          <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Η ευθυγράμμιση, διαβασμένη από το μονοπάτι
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shown.map((s, idx) => {
              const isMatch = s.kind === 'match'
              const isEqual = isMatch && s.cost === 0
              return (
                <div
                  key={idx}
                  className={cn(
                    'flex w-8 flex-col overflow-hidden rounded border font-mono',
                    isEqual
                      ? 'border-emerald-500/60 bg-emerald-500/15'
                      : isMatch
                        ? 'border-amber-500/60 bg-amber-500/15'
                        : s.kind === 'gapX'
                          ? 'border-sky-400/60 bg-sky-400/10'
                          : 'border-violet-400/60 bg-violet-400/10',
                  )}
                >
                  <div className="flex h-7 items-center justify-center border-b border-border/50 text-sm font-bold text-fg">
                    {s.xi ?? '–'}
                  </div>
                  <div className="flex h-7 items-center justify-center text-sm font-bold text-fg">
                    {s.yj ?? '–'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
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
          onClick={() => setStep((s) => Math.min(LAST, s + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
          Βήμα {step} / {LAST}
        </span>
      </div>
    </section>
  )
}
