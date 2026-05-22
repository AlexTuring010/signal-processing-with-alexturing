'use client'

/**
 * PjExplorer — make p(j) concrete by clicking it.
 *
 * p(j) — «ο μεγαλύτερος δείκτης i < j με fᵢ ≤ sⱼ» — is the most abstract new
 * symbol in L14, and prose alone leaves it an intimidating phrase. Here the
 * student clicks any request j on the timeline and immediately sees:
 *
 *  - a dashed threshold at sⱼ and a shaded «compatible zone» to its left;
 *  - every earlier request marked ✓ / ✗ by whether it finishes inside it;
 *  - p(j) itself — the LAST ✓ — lit in blue;
 *  - the overlapping block p(j)+1 … j−1 lit in red: exactly the requests the
 *    recurrence throws away when it takes j.
 *
 * It runs on the lecture's own eight-request instance, so the marquee values
 * p(8)=5, p(7)=3, p(2)=0 are one click away. Built for L14.
 */

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REQS, N, T_MAX, P } from './interval-instance'

const VIEW_W = 600
const PAD_L = 46
const PLOT_W = VIEW_W - PAD_L - 22
const ROW_H = 30
const TOP = 26
const AXIS_H = 30
const VIEW_H = TOP + N * ROW_H + AXIS_H

type RowKind = 'self' | 'plast' | 'compat' | 'conflict' | 'later'

function rowKind(id: number, j: number, p: number): RowKind {
  if (id === j) return 'self'
  if (id > j) return 'later'
  if (p > 0 && id === p) return 'plast'
  if (id < p) return 'compat'
  return 'conflict'
}

const FILL: Record<RowKind, string> = {
  self: '#fde68a',
  plast: '#7dd3fc',
  compat: '#e0f2fe',
  conflict: '#fecaca',
  later: '#f4efe9',
}
const STROKE: Record<RowKind, string> = {
  self: '#d97706',
  plast: '#0284c7',
  compat: '#bae6fd',
  conflict: '#dc2626',
  later: '#d8cccd',
}

/** "a, a+1, …, b" — or "—" when the range is empty. */
function rangeText(a: number, b: number): string {
  if (a > b) return '—'
  const out: number[] = []
  for (let k = a; k <= b; k++) out.push(k)
  return out.join(', ')
}

export function PjExplorer() {
  const [j, setJ] = useState(8)

  const p = P[j]
  const reqJ = REQS[j - 1]
  const sj = reqJ.s

  const X = (t: number) => PAD_L + (t / T_MAX) * PLOT_W

  let note: string
  if (j === 1) {
    note =
      'Το αίτημα 1 είναι το πρώτο που τελειώνει — δεν υπάρχει κανένα προηγούμενο αίτημα. Άρα p(1) = 0.'
  } else if (p === 0) {
    note = `Διάλεξες το αίτημα ${j}. Ξεκινά τη στιγμή s = ${sj}. Κανένα από τα προηγούμενα αιτήματα ${rangeText(
      1,
      j - 1,
    )} δεν προλαβαίνει να τελειώσει ώς τότε — όλα λήγουν αργότερα. Άρα p(${j}) = 0: αν πάρεις το ${j}, δεν συνδυάζεται με κανένα προηγούμενο.`
  } else {
    note = `Διάλεξες το αίτημα ${j}. Ξεκινά τη στιγμή s = ${sj}. Τα αιτήματα ${rangeText(
      1,
      p,
    )} τελειώνουν ώς τότε — είναι συμβατά μαζί του, και το τελευταίο τους είναι το p(${j}) = ${p}. Τα αιτήματα ${rangeText(
      p + 1,
      j - 1,
    )} τελειώνουν μετά το ${sj} → ασύμβατα: αν πάρεις το ${j}, αυτά αποκλείονται.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τι είναι το p(j) — διάλεξε ένα αίτημα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          p({j}) = {p}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Πάτησε σε ένα αίτημα. <span className="font-semibold text-fg">Κίτρινο</span>{' '}
        = το j · <span className="font-semibold text-fg">μπλε</span> = το p(j) ·{' '}
        <span className="font-semibold text-fg">κόκκινο</span> = ασύμβατα που
        αποκλείονται.
      </p>

      {/* timeline */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .pj-lbl { font: 700 11px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .pj-mark { font: 800 13px ui-sans-serif, system-ui; text-anchor: middle; dominant-baseline: central; }
            .pj-tick { font: 600 10px ui-sans-serif, system-ui; fill: #9b8a8d; text-anchor: middle; }
            .pj-sj { font: 700 11px ui-sans-serif, system-ui; fill: #b45309; text-anchor: middle; }
          `}</style>

          {/* compatible zone — anything finishing in here is compatible with j */}
          <rect
            x={X(0)}
            y={TOP - 8}
            width={X(sj) - X(0)}
            height={N * ROW_H + 6}
            fill="#7dd3fc"
            opacity={0.13}
          />

          {/* threshold at s_j */}
          <line
            x1={X(sj)}
            y1={TOP - 14}
            x2={X(sj)}
            y2={TOP + N * ROW_H}
            stroke="#d97706"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <text x={X(sj)} y={TOP - 19} className="pj-sj">
            s = {sj}
          </text>

          {/* interval rows */}
          {REQS.map((r, idx) => {
            const id = idx + 1
            const y = TOP + idx * ROW_H
            const kind = rowKind(id, j, p)
            const earlier = id < j
            const compatible = r.f <= sj
            const textFill = kind === 'later' ? '#9b8a8d' : '#1c1214'
            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`Αίτημα ${id}, ξεκινά ${r.s}, λήγει ${r.f}, αξία ${r.v}`}
                onClick={() => setJ(id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    setJ(id)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* ✓ / ✗ for earlier requests */}
                {earlier && (
                  <text
                    x={PAD_L - 30}
                    y={y + 11}
                    className="pj-mark"
                    fill={compatible ? '#16a34a' : '#dc2626'}
                  >
                    {compatible ? '✓' : '✗'}
                  </text>
                )}
                <rect
                  x={X(r.s)}
                  y={y}
                  width={Math.max(X(r.f) - X(r.s), 3)}
                  height={22}
                  rx={4}
                  fill={FILL[kind]}
                  stroke={STROKE[kind]}
                  strokeWidth={kind === 'self' || kind === 'plast' ? 2.8 : 2}
                />
                <text
                  x={(X(r.s) + X(r.f)) / 2}
                  y={y + 11}
                  className="pj-lbl"
                  fill={textFill}
                >
                  {id} · v={r.v}
                </text>
              </g>
            )
          })}

          {/* time axis */}
          <line
            x1={X(0)}
            y1={VIEW_H - AXIS_H + 8}
            x2={X(T_MAX)}
            y2={VIEW_H - AXIS_H + 8}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />
          {Array.from({ length: T_MAX / 2 + 1 }, (_, k) => k * 2).map((t) => (
            <text key={t} x={X(t)} y={VIEW_H - AXIS_H + 22} className="pj-tick">
              {t}
            </text>
          ))}
        </svg>
      </div>

      {/* p(j) readout */}
      <div className="mt-3 rounded-lg border border-sky-400/50 bg-sky-400/10 px-3 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold text-fg">
            p({j}) = {p}
          </span>
          <span className="text-sm text-fg-muted">
            {p > 0
              ? `το αίτημα ${p} λήγει στο ${REQS[p - 1].f} ≤ ${sj} = s(${j})`
              : `κανένα προηγούμενο αίτημα δεν λήγει ώς το s(${j}) = ${sj}`}
          </span>
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* all p(j) row + reset */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-fg-subtle">Όλα τα p(j):</span>
        {REQS.map((_, idx) => {
          const id = idx + 1
          return (
            <button
              key={id}
              type="button"
              onClick={() => setJ(id)}
              className={cn(
                'rounded-md border px-2 py-0.5 font-mono text-xs font-medium transition-colors',
                id === j
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border text-fg-muted hover:bg-bg-soft',
              )}
            >
              p({id})={P[id]}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setJ(8)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Επαναφορά
        </button>
      </div>
    </section>
  )
}
