'use client'

/**
 * DominantColourProof — the «αν c είναι κυρίαρχο στη μεγάλη ⇒ είναι
 * κυρίαρχο σε ≥ 1 υποσκακιέρα» argument made physical.
 *
 * The proof is by contradiction:
 *
 *   suppose c is dominant in the n×n board  ⇒  count(c) > n²/2
 *   suppose c is dominant in NO subboard    ⇒  count_i(c) ≤ ½·(n/2)²
 *   sum across 4 subboards: count(c) ≤ 4 · ½ · (n/2)² = n²/2
 *   ⇒  count(c) ≤ n²/2  AND  count(c) > n²/2  — contradiction.
 *
 * Reading that on the page, students nod and forget. The viz hands
 * them four sliders — one per subboard — each capped at the
 * not-dominant ceiling. They scrub the sliders to maximum and the
 * total bar visibly slams into a ceiling at exactly n²/2; the «> n²/2»
 * line sits one pixel above, unreachable. The contradiction stops
 * being a sentence and becomes a wall. Built for L04.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Size = 4 | 8

const SIZES: ReadonlyArray<{ value: Size; label: string }> = [
  { value: 4, label: 'n = 4 (σκακιέρα 4×4)' },
  { value: 8, label: 'n = 8 (σκακιέρα 8×8)' },
]

function dimsFor(n: Size) {
  const halfTiles = (n / 2) * (n / 2) // tiles per subboard
  const notDomCap = Math.floor(halfTiles / 2) // ≤ ½·(n/2)²
  const totalTiles = n * n
  const threshold = totalTiles / 2 // dominant ⇔ > threshold
  // subboard grid as a square; n=4 → 2×2, n=8 → 4×4
  const gridSide = n / 2
  return { halfTiles, notDomCap, totalTiles, threshold, gridSide }
}

const QUAD_LABELS = ['Q₁ (πάνω-αριστερά)', 'Q₂ (πάνω-δεξιά)', 'Q₃ (κάτω-αριστερά)', 'Q₄ (κάτω-δεξιά)']

export function DominantColourProof() {
  const [n, setN] = useState<Size>(4)
  const [restrict, setRestrict] = useState(true) // "no dominant anywhere" cap on
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0])

  const { halfTiles, notDomCap, totalTiles, threshold, gridSide } = useMemo(() => dimsFor(n), [n])

  // When switching n or mode, clamp values into the current valid range.
  function setCount(idx: number, raw: number) {
    const cap = restrict ? notDomCap : halfTiles
    const v = Math.max(0, Math.min(cap, Math.round(raw)))
    const next = [...counts]
    next[idx] = v
    setCounts(next)
  }

  function reset() {
    setCounts([0, 0, 0, 0])
  }

  function pushToMax() {
    const cap = restrict ? notDomCap : halfTiles
    setCounts([cap, cap, cap, cap])
  }

  function pickSize(v: Size) {
    setN(v)
    // re-clamp
    const cap = restrict ? Math.floor(((v / 2) * (v / 2)) / 2) : (v / 2) * (v / 2)
    setCounts(counts.map((c) => Math.min(c, cap)))
  }

  const total = counts.reduce((a, b) => a + b, 0)
  const exceedsThreshold = total > threshold
  const hitsCeiling = total === threshold && restrict

  // For the total bar
  const barMaxValue = totalTiles
  const totalPct = (total / barMaxValue) * 100
  const thresholdPct = (threshold / barMaxValue) * 100

  return (
    <div className="my-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          Απόδειξη
        </span>
        <span className="text-sm font-semibold">
          Γιατί η σφαιρική απάντηση κρύβεται σε ένα τεταρτημόριο
        </span>
      </div>

      <p className="mb-3 text-sm text-fg-muted">
        Υπόθεσε ότι το <span className="font-semibold text-fg">κόκκινο</span> κυριαρχεί στη
        μεγάλη σκακιέρα. Αν δεν κυριαρχεί σε <em>κανένα</em> τεταρτημόριο, τότε σε καθένα
        εμφανίζεται το πολύ{' '}
        <span className="font-mono">{notDomCap}</span> φορές
        {' '}(= ½ · (n/2)²){'. '}
        Σπρώξε τους τέσσερις slider στο μέγιστο και κοίτα τι κάνει το σύνολο.
      </p>

      {/* size + mode controls */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {SIZES.map((s) => (
          <button
            key={s.value}
            onClick={() => pickSize(s.value)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
              n === s.value
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border bg-bg-elevated hover:bg-bg',
            )}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => {
            const next = !restrict
            setRestrict(next)
            const cap = next ? notDomCap : halfTiles
            setCounts(counts.map((c) => Math.min(c, cap)))
          }}
          className={cn(
            'ml-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
            restrict
              ? 'border-rose-500/60 bg-rose-500/10 text-rose-600 dark:text-rose-400'
              : 'border-border bg-bg-elevated hover:bg-bg',
          )}
        >
          Όριο «όχι κυρίαρχο σε κανένα»: {restrict ? 'ΟΝ' : 'OFF'} (cap = {restrict ? notDomCap : halfTiles})
        </button>
      </div>

      {/* the 4 subboards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((q) => {
          const cap = restrict ? notDomCap : halfTiles
          return (
            <div key={q} className="rounded-xl border border-border bg-bg/40 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold">{QUAD_LABELS[q]}</span>
                <span className="font-mono text-fg-muted">
                  {counts[q]} / {halfTiles}
                </span>
              </div>
              {/* mini grid */}
              <div
                className="grid gap-0.5"
                style={{ gridTemplateColumns: `repeat(${gridSide}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: halfTiles }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'aspect-square rounded',
                      i < counts[q] ? 'bg-rose-500' : 'bg-slate-400/30',
                    )}
                  />
                ))}
              </div>
              {/* slider */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={cap}
                  value={Math.min(counts[q], cap)}
                  onChange={(e) => setCount(q, Number(e.target.value))}
                  className="w-full accent-rose-500"
                  aria-label={QUAD_LABELS[q]}
                />
                <span className="font-mono text-[11px] text-fg-muted">
                  cap {cap}
                </span>
              </div>
              {restrict && counts[q] === notDomCap && (
                <div className="mt-1 text-[10.5px] text-rose-500">
                  Φτάσαμε στο όριο — αν το αυξήσουμε, αυτό το τεταρτημόριο γίνεται κυρίαρχο σε
                  κόκκινο.
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* total bar */}
      <div className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
          <span className="font-semibold">
            Σύνολο κόκκινων σε όλη τη σκακιέρα ={' '}
            <span className="font-mono text-base text-fg">{total}</span> / {totalTiles}
          </span>
          <span className="font-mono text-fg-muted">
            κατώφλι κυριαρχίας: &gt; <span className="text-fg">{threshold}</span> (= n²/2)
          </span>
        </div>
        {/* bar */}
        <div className="relative mt-2 h-7 rounded-md border border-border bg-bg-elevated/70">
          <div
            className={cn(
              'absolute inset-y-0 left-0 rounded-md transition-all',
              exceedsThreshold ? 'bg-emerald-500/70' : 'bg-rose-500/60',
            )}
            style={{ width: `${totalPct}%` }}
          />
          {/* threshold tick */}
          <div
            className="absolute inset-y-0 w-[2px] bg-fg/70"
            style={{ left: `${thresholdPct}%` }}
            aria-hidden
          />
          <div
            className="absolute -top-3.5 text-[10px] font-semibold text-fg-muted"
            style={{ left: `calc(${thresholdPct}% - 28px)` }}
            aria-hidden
          >
            n²/2 = {threshold}
          </div>
        </div>

        {/* verdict */}
        <div className="mt-3 text-sm">
          {restrict ? (
            total >= notDomCap * 4 ? (
              <div className="rounded border border-rose-500/40 bg-rose-500/10 p-2 text-xs">
                <div className="font-semibold text-rose-700 dark:text-rose-400">
                  Φράγμα: 4 · {notDomCap} = <span className="font-mono">{notDomCap * 4}</span> ={' '}
                  <span className="font-mono">n²/2</span>.
                </div>
                <div className="mt-1 text-fg">
                  Έσπρωξα ΟΛΟΥΣ τους slider στο μέγιστο και το σύνολο{' '}
                  <span className="font-semibold">δεν ξεπερνά</span> το{' '}
                  <span className="font-mono">{threshold}</span>. Άρα αν το κόκκινο δεν κυριαρχεί
                  σε <em>κανένα</em> τεταρτημόριο, <span className="font-semibold">δεν μπορεί</span>{' '}
                  να κυριαρχεί ούτε σε ολόκληρη τη σκακιέρα.{' '}
                  <strong>Αντίφαση με την υπόθεση.</strong>
                </div>
              </div>
            ) : (
              <div className="text-xs text-fg-muted">
                Σπρώξε όλους τους slider στο όριο — τότε φαίνεται καθαρά το φράγμα{' '}
                <span className="font-mono">4 · {notDomCap} = {threshold}</span>.
              </div>
            )
          ) : exceedsThreshold ? (
            <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-2 text-xs">
              <div className="font-semibold text-emerald-700 dark:text-emerald-400">
                Το κόκκινο κυριαρχεί στη μεγάλη σκακιέρα ({total} &gt; {threshold}).
              </div>
              <div className="mt-1 text-fg">
                Πρόσεξε ότι σε <em>τουλάχιστον ένα</em> τεταρτημόριο ο slider είναι πάνω από{' '}
                <span className="font-mono">{notDomCap}</span> — δηλαδή το κόκκινο κυριαρχεί ΕΚΕΙ
                επίσης. Αυτό ακριβώς λέει η παρατήρηση.
              </div>
            </div>
          ) : (
            <div className="text-xs text-fg-muted">
              Με μη-περιορισμένους slider μπορείς να δοκιμάσεις οποιαδήποτε διανομή. Δες πότε
              ξεπερνάς το κατώφλι — και ποιος slider σε «τραβάει» πάνω από{' '}
              <span className="font-mono">{notDomCap}</span>.
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Από την αρχή
        </button>
        <button
          onClick={pushToMax}
          className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/25"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Σπρώξε όλους στο όριο
        </button>
        {hitsCeiling && (
          <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Σύνολο = n²/2 ακριβώς — κάθε άλλη αύξηση χρειάζεται κυρίαρχο σε ≥ 1 υποσκακιέρα.
          </span>
        )}
      </div>
    </div>
  )
}
