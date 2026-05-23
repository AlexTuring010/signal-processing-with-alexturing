'use client'

/**
 * ComplexityTightVsLoose — η σφιχτή ανάλυση κερδίζει μια τάξη μεγέθους (L07).
 *
 * The lecture's complexity proof finishes with «κάθε κορυφή σαρώνει deg(u)
 * γείτονες, όχι n — άρα συνολικά n + 2m, όχι n + n²». For dense graphs the
 * difference is negligible; for sparse graphs (which is the normal case) it
 * is the difference between O(n²) and linear. The viz makes the two bounds
 * race each other:
 *
 *   - Pick n ∈ {8, 16, 32, 64}.
 *   - Slide a «πυκνότητα» control from m_min = n − 1 (a tree) up to m_max =
 *     n(n−1)/2 (the complete graph K_n).
 *   - Two horizontal bars side by side:
 *       Αφελής:  n + n²  (constant in m)
 *       Σφιχτός: n + 2m  (linear in m, starting tiny)
 *   - A ratio chip in the corner: «Αφελής / Σφιχτός = …x». At the sparse end
 *     of the slider the chip blinks red — that's the «τάξη μεγέθους» the
 *     callout warns about.
 *   - Per-vertex bar chart on the right: under the naïve count each vertex
 *     contributes (1 + n) to the sum; under the tight count it contributes
 *     (1 + deg(u)). For a random graph realised with the chosen m, the
 *     tight bars are SHORT for most vertices. The naïve view treats every
 *     adjacency-list scan as if it were the entire vertex set — and that's
 *     where the slack comes from.
 *
 * Built for L07.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const N_OPTIONS = [8, 16, 32, 64] as const

/** Deterministic degree sequence summing to 2m with n vertices, mildly
 *  skewed (so the bars are visibly heterogeneous, not uniform). */
function syntheticDegrees(n: number, m: number): number[] {
  const target = 2 * m
  const d = new Array<number>(n).fill(0)
  // Round-robin "spread" — start at vertex 0, distribute units cyclically
  // with a slight preference for early vertices to keep the picture readable.
  let i = 0
  let remaining = target
  while (remaining > 0) {
    if (d[i] < n - 1) {
      d[i] += 1
      remaining -= 1
    }
    i = (i + 1) % n
    // safety
    if (d.every((x) => x === n - 1)) break
  }
  return d
}

export function ComplexityTightVsLoose() {
  const [n, setN] = useState<number>(16)
  const m_min = n - 1
  const m_max = (n * (n - 1)) / 2
  const [m, setM] = useState<number>(() => Math.max(m_min, 2 * 16 - 1))

  // when n changes, re-clamp m
  function changeN(newN: number) {
    setN(newN)
    const newMmin = newN - 1
    const newMmax = (newN * (newN - 1)) / 2
    setM((cur) => Math.min(newMmax, Math.max(newMmin, cur)))
  }

  const naive = n + n * n
  const tight = n + 2 * m
  const ratio = naive / tight
  const maxBar = naive // both bars normalized to the larger one

  const degs = useMemo(() => syntheticDegrees(n, m), [n, m])

  const sparseColor = ratio >= 5 ? 'rose' : ratio >= 2 ? 'amber' : 'emerald'
  const ratioStyle =
    sparseColor === 'rose'
      ? 'border-rose-400 bg-rose-50 text-rose-900'
      : sparseColor === 'amber'
        ? 'border-amber-400 bg-amber-50 text-amber-900'
        : 'border-emerald-400 bg-emerald-50 text-emerald-900'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Αφελής O(n²) ή σφιχτός O(n + m); — δες την απόσταση
        </div>
        <span className="text-xs text-fg-subtle">
          n κορυφές, m ακμές, n + n² vs n + 2m
        </span>
      </div>

      {/* selectors */}
      <div className="mb-3 grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-fg-subtle">n =</span>
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            {N_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => changeN(opt)}
                className={cn(
                  'px-2.5 py-1 font-mono transition-colors',
                  n === opt
                    ? 'bg-accent text-accent-fg'
                    : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-fg-subtle">m =</span>
          <input
            type="range"
            min={m_min}
            max={m_max}
            step={1}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="w-full"
            aria-label="Αριθμός ακμών m"
          />
          <span className="ml-1 inline-flex min-w-[3.5rem] justify-end font-mono font-bold text-fg">
            {m}
          </span>
          <span className="text-fg-subtle">/ {m_max}</span>
        </div>

        <div
          className={cn(
            'rounded-md border px-2.5 py-1.5 text-center text-xs font-semibold transition-colors',
            ratioStyle,
          )}
        >
          <div className="uppercase tracking-wider opacity-70">Αφελής / Σφιχτός</div>
          <div className="font-mono text-base">
            {ratio < 1.05 ? '≈ 1.0×' : `${ratio.toFixed(1)}×`}
          </div>
        </div>
      </div>

      {/* bars */}
      <div className="space-y-2">
        {/* naive bar */}
        <div>
          <div className="mb-0.5 flex items-baseline justify-between text-xs">
            <span className="text-fg-subtle">
              Αφελής: <span className="font-mono text-fg">n + n² = {n} + {n * n} = </span>
              <span className="font-mono font-bold text-fg">{naive}</span>
            </span>
            <span className="text-fg-subtle">
              ανεξάρτητο από m
            </span>
          </div>
          <div className="h-7 w-full overflow-hidden rounded-md border border-border bg-bg-soft/40">
            <div
              className="flex h-full items-center justify-end pr-2 text-[11px] font-semibold text-amber-900"
              style={{
                width: `${(naive / maxBar) * 100}%`,
                background:
                  'repeating-linear-gradient(45deg, #fde68a, #fde68a 6px, #fcd34d 6px, #fcd34d 12px)',
              }}
            >
              {naive}
            </div>
          </div>
        </div>

        {/* tight bar */}
        <div>
          <div className="mb-0.5 flex items-baseline justify-between text-xs">
            <span className="text-fg-subtle">
              Σφιχτός: <span className="font-mono text-fg">n + 2m = {n} + {2 * m} = </span>
              <span className="font-mono font-bold text-fg">{tight}</span>
            </span>
            <span className="text-fg-subtle">
              αυξάνεται γραμμικά με m
            </span>
          </div>
          <div className="h-7 w-full overflow-hidden rounded-md border border-border bg-bg-soft/40">
            <div
              className="flex h-full items-center justify-end pr-2 text-[11px] font-semibold text-emerald-900 transition-all duration-200"
              style={{
                width: `${(tight / maxBar) * 100}%`,
                background:
                  'linear-gradient(90deg, #6ee7b7, #34d399)',
              }}
            >
              {tight}
            </div>
          </div>
        </div>
      </div>

      {/* per-vertex breakdown */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-bg-soft/30 p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Σύμφωνα με την αφελή ανάλυση: «1 + n» ανά κορυφή
          </div>
          <DegreeBarRow
            heights={Array<number>(n).fill(n + 1)}
            cap={n + 1}
            colour="#fcd34d"
          />
          <div className="mt-1 text-[11px] text-fg-subtle">
            Σύνολο = Σ(1 + n) = n + n² = <span className="font-mono">{naive}</span>
            {' '}— το ίδιο «μπλοκ» n+1 παντού, ανεξάρτητα από το πραγματικό deg(u).
          </div>
        </div>

        <div className="rounded-lg border border-border bg-bg-soft/30 p-3">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Σφιχτή ανάλυση: «1 + deg(u)» ανά κορυφή
          </div>
          <DegreeBarRow
            heights={degs.map((d) => d + 1)}
            cap={n + 1}
            colour="#34d399"
          />
          <div className="mt-1 text-[11px] text-fg-subtle">
            Σύνολο = n + Σ deg(u) = n + 2m ={' '}
            <span className="font-mono">{tight}</span>{' '}
            (handshaking λήμμα).
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-sm leading-relaxed text-fg-muted">
        {ratio >= 5 && (
          <>
            <strong>Αραιό γράφημα.</strong> Η σφιχτή ανάλυση είναι{' '}
            <span className="font-mono font-bold text-rose-700">{ratio.toFixed(1)}×</span>{' '}
            καλύτερη — αυτό είναι ολόκληρη τάξη μεγέθους. Πραγματικά αποδίδει.
          </>
        )}
        {ratio >= 2 && ratio < 5 && (
          <>
            <strong>Μέτρια πυκνότητα.</strong> Η σφιχτή ανάλυση δίνει{' '}
            <span className="font-mono font-bold">{ratio.toFixed(1)}×</span> καλύτερο
            φραγμό — αξίζει τον κόπο.
          </>
        )}
        {ratio < 2 && (
          <>
            <strong>Πυκνό γράφημα.</strong> Όταν m πλησιάζει το n²/2, και οι δύο
            φραγμοί λένε σχεδόν το ίδιο — εδώ το O(n²) δεν είναι κρίμα. Το{' '}
            «n + 2m = O(n+m)» απλώς γίνεται «O(n²)» πιο σωστά.
          </>
        )}
      </div>

      {/* preset shortcuts */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-fg-subtle">Γρήγορα προεπιλογές m:</span>
        <button
          type="button"
          onClick={() => setM(m_min)}
          className="rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono hover:bg-bg-soft"
        >
          δέντρο (m = n − 1)
        </button>
        <button
          type="button"
          onClick={() => setM(Math.min(m_max, 2 * n))}
          className="rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono hover:bg-bg-soft"
        >
          αραιό (m ≈ 2n)
        </button>
        <button
          type="button"
          onClick={() => setM(Math.min(m_max, Math.round(m_max / 4)))}
          className="rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono hover:bg-bg-soft"
        >
          μέτριο (m ≈ n²/8)
        </button>
        <button
          type="button"
          onClick={() => setM(m_max)}
          className="rounded-md border border-border bg-bg-elevated px-2 py-1 font-mono hover:bg-bg-soft"
        >
          πλήρες K_n (m = n(n−1)/2)
        </button>
      </div>
    </section>
  )
}

function DegreeBarRow({
  heights,
  cap,
  colour,
}: {
  heights: number[]
  cap: number
  colour: string
}) {
  const n = heights.length
  const W = 280
  const H = 60
  const bw = W / n
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="h-auto w-full" role="img">
      {heights.map((h, i) => {
        const bh = (h / cap) * H
        return (
          <g key={i}>
            <rect
              x={i * bw + 1}
              y={H - bh}
              width={bw - 2}
              height={bh}
              fill={colour}
              stroke="#0006"
              strokeWidth={0.5}
            />
            <text
              x={i * bw + bw / 2}
              y={H + 12}
              fontSize={9}
              fontFamily="ui-monospace, monospace"
              fill="#444"
              textAnchor="middle"
            >
              {h}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
