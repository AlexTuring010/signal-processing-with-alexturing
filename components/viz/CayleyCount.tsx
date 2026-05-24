'use client'

/**
 * CayleyCount — n^(n-2) spanning trees, seen exploding (L09).
 *
 * "K₁₀ has 10⁸ spanning trees" is the one-liner that justifies the whole
 * MST half of the lecture: brute-force enumeration is not an option. Here
 * the student moves a slider, watches Kₙ redraw, and sees three numbers
 * grow at different speeds — n, the edge count C(n,2), and the spanning-
 * tree count n^(n-2). A 1-nanosecond/tree wall-clock turns the explosion
 * into something visceral: at n=10 it's a tenth of a second, at n=15 it's
 * weeks. The point isn't the formula — it's the realisation that "try
 * them all" is dead before the lecture even starts. Built for L09.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

const MIN_N = 2
const MAX_N = 15

function comb2(n: number): number {
  return (n * (n - 1)) / 2
}

function spanningTrees(n: number): number {
  if (n <= 1) return n
  if (n === 2) return 1
  return Math.pow(n, n - 2)
}

function fmtBig(x: number): string {
  if (x < 10000) return Math.round(x).toLocaleString('el-GR')
  const exp = Math.floor(Math.log10(x))
  const mantissa = x / Math.pow(10, exp)
  return `${mantissa.toFixed(2)} × 10^${exp}`
}

function fmtDuration(ns: number): string {
  if (ns < 1e3) return `${ns.toFixed(0)} ns`
  if (ns < 1e6) return `${(ns / 1e3).toFixed(2)} μs`
  if (ns < 1e9) return `${(ns / 1e6).toFixed(2)} ms`
  if (ns < 60e9) return `${(ns / 1e9).toFixed(2)} δευτ.`
  if (ns < 3600e9) return `${(ns / 60e9).toFixed(1)} λεπτά`
  if (ns < 86400e9) return `${(ns / 3600e9).toFixed(1)} ώρες`
  if (ns < 365.25 * 86400e9) return `${(ns / 86400e9).toFixed(1)} ημέρες`
  return `${(ns / (365.25 * 86400e9)).toFixed(2)} χρόνια`
}

const SUBS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
function toSub(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUBS[parseInt(d, 10)] ?? d)
    .join('')
}

const MAX_LOG = Math.log10(spanningTrees(MAX_N)) + 0.5

function BarRow({
  label,
  text,
  log,
  color,
  emphasise = false,
}: {
  label: string
  text: string
  log: number
  color: string
  emphasise?: boolean
}) {
  const pct = Math.max(2, Math.min(100, (log / MAX_LOG) * 100))
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 shrink-0 font-mono text-fg-subtle">{label}</span>
      <div className="relative h-5 flex-1 overflow-hidden rounded border border-border bg-bg-soft">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            opacity: emphasise ? 0.9 : 0.7,
          }}
        />
      </div>
      <span
        className={cn(
          'w-40 shrink-0 text-right font-mono',
          emphasise ? 'font-bold text-fg' : 'text-fg-muted',
        )}
      >
        {text}
      </span>
    </div>
  )
}

export function CayleyCount() {
  const [n, setN] = useState(6)
  const m = comb2(n)
  const trees = spanningTrees(n)
  const timeNs = trees

  const logN = Math.log10(Math.max(n, 1))
  const logM = Math.log10(Math.max(m, 1))
  const logT = Math.log10(Math.max(trees, 1))

  /* draw K_n on a circle */
  const RADIUS = 78
  const CX = 110
  const CY = 96
  const vertices: { x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    vertices.push({
      x: CX + RADIUS * Math.cos(angle),
      y: CY + RADIUS * Math.sin(angle),
    })
  }
  const vRadius = n <= 6 ? 9 : n <= 10 ? 6.5 : 5

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Θεώρημα Cayley — γιατί δεν μπορούμε να δοκιμάσουμε όλα τα δέντρα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          K{toSub(n)}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Το πλήρες γράφημα K{toSub(n)} έχει n<sup>n−2</sup> διαφορετικά
        συνδετικά δέντρα. Μετακίνησε το n για να δεις πόσο γρήγορα εκτοξεύεται.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[220px,1fr]">
        {/* K_n drawing */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 220 210"
            className="mx-auto block w-full max-w-[220px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {vertices.map((v, i) =>
              vertices.slice(i + 1).map((u, j) => (
                <line
                  key={`e-${i}-${i + 1 + j}`}
                  x1={v.x}
                  y1={v.y}
                  x2={u.x}
                  y2={u.y}
                  stroke="#cdbfc0"
                  strokeWidth={n <= 6 ? 1.2 : 0.7}
                  strokeOpacity={n <= 8 ? 0.9 : 0.55}
                />
              )),
            )}
            {vertices.map((v, i) => (
              <circle
                key={`v-${i}`}
                cx={v.x}
                cy={v.y}
                r={vRadius}
                fill="#7dd3fc"
                stroke="#0284c7"
                strokeWidth={1.5}
              />
            ))}
            <text
              x="110"
              y="200"
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#5a4a4d"
            >
              K{toSub(n)} — όλα-όλα-όλα τα ζευγάρια συνδεδεμένα
            </text>
          </svg>
        </div>

        {/* number panel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-md bg-bg-soft px-3 py-2">
            <span className="text-sm text-fg-muted">κορυφές</span>
            <span className="font-mono text-base font-bold text-fg">
              n = {n}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-bg-soft px-3 py-2">
            <span className="text-sm text-fg-muted">
              ακμές στο K{toSub(n)}
            </span>
            <span className="font-mono text-base font-bold text-fg">
              C({n}, 2) = {m}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-amber-400 bg-amber-50 px-3 py-2">
            <span className="text-sm text-amber-900">συνδετικά δέντρα</span>
            <span className="font-mono text-base font-bold text-amber-900">
              {n}
              <sup>{n - 2}</sup> = {fmtBig(trees)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-bg-soft px-3 py-2">
            <span className="text-sm text-fg-muted">
              στο 1 ns/δέντρο τελειώνεις σε
            </span>
            <span className="font-mono text-sm font-semibold text-fg">
              {fmtDuration(timeNs)}
            </span>
          </div>
        </div>
      </div>

      {/* log-scale bars */}
      <div className="mt-3 space-y-1.5">
        <BarRow label="n" text={String(n)} log={logN} color="#0284c7" />
        <BarRow
          label="C(n,2)"
          text={String(m)}
          log={logM}
          color="#d97706"
        />
        <BarRow
          label={`n^(n−2)`}
          text={fmtBig(trees)}
          log={logT}
          color="#dc2626"
          emphasise
        />
        <div className="pl-16 text-[10px] text-fg-subtle">
          κλίμακα: λογαριθμική — κάθε γραμμή μετράει «πόσα μηδενικά»
        </div>
      </div>

      {/* slider + presets */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setN((v) => Math.max(MIN_N, v - 1))}
          disabled={n === MIN_N}
          className="rounded-md border border-border px-2 py-1 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          aria-label="μείωσε n"
        >
          −
        </button>
        <input
          type="range"
          min={MIN_N}
          max={MAX_N}
          step={1}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="flex-1 accent-accent"
        />
        <button
          type="button"
          onClick={() => setN((v) => Math.min(MAX_N, v + 1))}
          disabled={n === MAX_N}
          className="rounded-md border border-border px-2 py-1 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
          aria-label="αύξησε n"
        >
          +
        </button>
        <span className="w-10 text-right font-mono text-sm font-bold text-fg">
          n = {n}
        </span>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Σημεία
        </span>
        {[3, 6, 10, 12, 15].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setN(preset)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              n === preset
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft',
            )}
          >
            n = {preset}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        {n <= 4 ? (
          <>
            Με {n} κορυφές υπάρχουν μόλις {fmtBig(trees)} συνδετικά δέντρα —
            λίγα ακόμα ώστε να τα γράψεις σ' ένα χαρτί.
          </>
        ) : n <= 7 ? (
          <>
            Στο K{toSub(n)} έχουμε ήδη {fmtBig(trees)} συνδετικά δέντρα — η
            απαρίθμηση γίνεται κουραστική.
          </>
        ) : n === 10 ? (
          <>
            <strong className="text-fg">
              Στο K₁₀: εκατό εκατομμύρια διαφορετικά συνδετικά δέντρα.
            </strong>{' '}
            Αυτό είναι το παράδειγμα που αναφέρεται στη διάλεξη — η εξαντλητική
            δοκιμή είναι αδύνατη ακόμα και για 10 κορυφές.
          </>
        ) : (
          <>
            Στο K{toSub(n)} υπάρχουν περίπου <strong>{fmtBig(trees)}</strong>{' '}
            συνδετικά δέντρα. Ακόμα κι αν δοκιμάζαμε ένα κάθε νανοδευτερόλεπτο,
            θα μας έπαιρνε <strong>{fmtDuration(timeNs)}</strong>. Η εξαντλητική
            δοκιμή πέθανε· χρειάζεται αλγόριθμος.
          </>
        )}
      </div>
    </section>
  )
}
