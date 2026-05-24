'use client'

/**
 * FastExponentiation — m^n with squaring D&C.
 *
 * The «πολλαπλασιάζω n φορές» αλγόριθμος is the natural one a student
 * writes — Θ(n). The squaring trick collapses it to Θ(log n) by
 * computing m^{n/2} once and squaring. The student needs to SEE both
 * the savings and the recursion structure, side-by-side.
 *
 * Two columns:
 *  • Naive — a horizontal strip of n−1 multiplications, ticking one by
 *    one as the student presses ▶.
 *  • Squaring — a vertical recursion tree, each level halving n, with
 *    intermediate m^{n/2^k} values rendered as numbers.
 *
 * Counters at the top compare the multiplication counts; for n=1024 the
 * ratio is 1023 vs 10. For pt1-th4.
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Props = {
  /** Optional initial values (defaults: m=3, n=8). */
  initialM?: number
  initialN?: number
}

function squareSteps(m: number, n: number): { k: number; exp: number; value: number }[] {
  if (n <= 0) return []
  const out: { k: number; exp: number; value: number }[] = []
  // depth = log2(n) — collect the exponent at each level
  let exp = 1
  while (exp <= n) {
    out.push({ k: out.length, exp, value: Math.pow(m, exp) })
    exp *= 2
  }
  // Drop the final overflow (we want up to exp = n)
  return out.filter((s) => s.exp <= n)
}

export function FastExponentiation({ initialM = 3, initialN = 8 }: Props = {}) {
  const [m, setM] = useState(initialM)
  const [nLog, setNLog] = useState(Math.log2(initialN))
  const [tick, setTick] = useState(0)
  const [playing, setPlaying] = useState(false)

  const n = Math.max(1, Math.round(2 ** nLog))
  const naiveCount = Math.max(0, n - 1)
  const squareCount = Math.max(0, Math.ceil(Math.log2(Math.max(n, 1))))

  // Squaring trace
  const trace = useMemo(() => squareSteps(m, n), [m, n])

  // Reset tick when sliders move
  useEffect(() => setTick(0), [m, n])

  // Animation
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setTick((t) => {
        const max = Math.max(naiveCount, trace.length)
        if (t >= max) {
          setPlaying(false)
          return t
        }
        return t + 1
      })
    }, 220)
    return () => window.clearInterval(id)
  }, [playing, naiveCount, trace.length])

  const result = Math.pow(m, n)
  // Cap visible result for very large n to avoid running off the page
  const resultText = result > 1e15 ? `≈ ${result.toExponential(3)}` : result.toLocaleString('el-GR')

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          <InlineMath>{`m^{n}`}</InlineMath> — αφελής (Θ(n)) vs τετραγωνισμός D&amp;C (Θ(log n))
        </div>
        <div className="text-xs text-fg-subtle">
          n = <span className="font-mono text-fg">{n}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>m</span>
            <span className="font-mono text-sm text-fg">{m}</span>
          </div>
          <input
            type="range"
            min={2}
            max={9}
            step={1}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>
              n = 2<sup>k</sup>, k =
            </span>
            <span className="font-mono text-sm text-fg">
              {Math.round(nLog)} (n = {n})
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={Math.round(nLog)}
            onChange={(e) => setNLog(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
      </div>

      {/* Compare counters */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
            Αφελής — n−1 πολλαπλασιασμοί
          </div>
          <div className="font-mono text-lg font-semibold text-fg">{naiveCount}</div>
        </div>
        <div className="rounded-lg border border-success/50 bg-success/5 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-success">
            Τετραγωνισμός — ⌈log₂ n⌉
          </div>
          <div className="font-mono text-lg font-semibold text-fg">{squareCount}</div>
        </div>
      </div>

      {/* Naive strip */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Αφελής — m · m · m · … {naiveCount}× (μέχρι το βήμα {Math.min(tick, naiveCount)})
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: Math.min(naiveCount, 40) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded text-[10px] font-semibold transition-colors',
                i < tick ? 'border border-rose-500 bg-rose-500/20 text-rose-500' : 'border border-border bg-bg-elevated text-fg-subtle',
              )}
              aria-label={`πολλαπλασιασμός ${i + 1}`}
            >
              ×
            </span>
          ))}
          {naiveCount > 40 && (
            <span className="self-center text-xs text-fg-subtle">… +{naiveCount - 40}</span>
          )}
        </div>
      </div>

      {/* Squaring tree */}
      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Τετραγωνισμός — m → m² → m⁴ → … (το «μία κλήση, ένα τετράγωνο»)
        </div>
        <div className="space-y-1">
          {trace.map((s, i) => {
            const reached = i < tick
            const expLabel = s.exp === 1 ? 'm' : `m^{${s.exp}}`
            return (
              <div
                key={s.k}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md border px-3 py-1 text-sm transition-colors',
                  reached
                    ? 'border-success/50 bg-success/10'
                    : 'border-border bg-bg-elevated',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-fg-subtle">[επίπεδο {i}]</span>
                  <span className="font-mono">
                    <InlineMath>{expLabel}</InlineMath>
                  </span>
                </span>
                <span className="font-mono text-xs text-fg-muted">
                  = {s.value > 1e9 ? s.value.toExponential(2) : s.value.toLocaleString('el-GR')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
        <strong>Αποτέλεσμα:</strong>{' '}
        <InlineMath>{`${m}^{${n}} =`}</InlineMath>{' '}
        <span className="font-mono">{resultText}</span>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setTick(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          Βήμα {tick} / {Math.max(naiveCount, trace.length)}
        </span>
        <button
          type="button"
          onClick={() => {
            if (tick >= Math.max(naiveCount, trace.length)) setTick(0)
            setPlaying((p) => !p)
          }}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20"
        >
          {playing ? '⏸ Παύση' : '▶ Παίξε'}
        </button>
      </div>
    </section>
  )
}
