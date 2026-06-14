'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Sideband overlap viz for /am/conventional §4a ("γιατί χρειαζόμαστε f_c >> W").
 *
 * Goal sentence: let the student DRAG f_c (relative to the message bandwidth W)
 * and watch the two shifted copies of M(f) — one around +f_c, one around −f_c —
 * collide and overlap as f_c drops toward W and below, corrupting the spectrum.
 *
 * The AM spectrum (single-tone-agnostic, drawn with a continuous triangular
 * M(f)) is:
 *   X(f) = (A_c/2)[δ(f∓f_c)]  +  ½[M(f−f_c) + M(f+f_c)]
 * The two ½M copies span [f_c−W, f_c+W] and [−f_c−W, −f_c+W]. They touch when
 * f_c = W and overlap when f_c < W. In the overlap region the real |X(f)| is the
 * SUM of the two copies (they pile up) — that pile-up is unrecoverable.
 */

const W = 1 // message bandwidth (fixed reference)
const F_VIEW = 4.4 // ± frequency shown
const FC_MIN = 0.3
const FC_MAX = 3.2

/** Triangular baseband |M(f)|: peak 1 at f=0, zero beyond ±W. */
function M(f: number): number {
  const a = Math.abs(f)
  return a >= W ? 0 : 1 - a / W
}

export function SidebandOverlapViz() {
  const [fc, setFc] = useState(1.8)

  const overlapping = fc < W - 1e-6
  const borderline = Math.abs(fc - W) <= 1e-6 + 0.04
  const status = borderline
    ? { label: 'Οριακά: f_c = W (οι πλευρές μόλις ακουμπούν)', tone: 'amber' as const }
    : overlapping
      ? { label: '⚠ Αλληλεπικάλυψη — η ανάκτηση χαλάει', tone: 'red' as const }
      : { label: 'Καθαρός διαχωρισμός — ανακτήσιμο', tone: 'green' as const }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Αλληλεπικάλυψη πλευρικών: σύρε το f_c
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <span className="font-mono">|X(f)|</span> έχει δύο αντίγραφα του{' '}
        <span className="font-mono">M(f)</span> — ένα γύρω από το{' '}
        <span className="font-mono">+f_c</span>, ένα γύρω από το{' '}
        <span className="font-mono">−f_c</span>. Κατέβασε το{' '}
        <span className="font-mono">f_c</span> κάτω από το <span className="font-mono">W</span>{' '}
        και δες τα δύο αντίγραφα να **μπαίνουν το ένα μέσα στο άλλο**.
      </p>

      <OverlapPanel fc={fc} />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Carrier <span className="font-mono">f_c</span> ={' '}
          <span className="font-mono tabular-nums text-fg">{fc.toFixed(2)}</span> · Message
          bandwidth <span className="font-mono">W</span> ={' '}
          <span className="font-mono tabular-nums text-fg">{W.toFixed(2)}</span> · λόγος{' '}
          <span className="font-mono tabular-nums text-fg">f_c/W = {(fc / W).toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={FC_MIN}
          max={FC_MAX}
          step={0.02}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency f_c relative to message bandwidth W"
        />
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          status.tone === 'green' &&
            'border-emerald-400/50 bg-emerald-50/60 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
          status.tone === 'amber' &&
            'border-amber-400/50 bg-amber-50/60 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100',
          status.tone === 'red' &&
            'border-red-400/50 bg-red-50/60 text-red-900 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100',
        )}
      >
        <strong>{status.label}.</strong>{' '}
        {overlapping ? (
          <>
            Στη ζώνη γύρω από το <span className="font-mono">f = 0</span> τα δύο αντίγραφα
            προστίθενται (κόκκινη περιοχή) και «πατάνε» το ένα πάνω στο άλλο — δεν μπορείς
            πια να τα ξεχωρίσεις με φιλτράρισμα. Η συνθήκη που χρειάζεται είναι{' '}
            <span className="font-mono">f_c &gt; W</span> (στην πράξη{' '}
            <span className="font-mono">f_c ≫ W</span>).
          </>
        ) : (
          <>
            Τα δύο αντίγραφα είναι τελείως χωριστά: το θετικό ζει στο{' '}
            <span className="font-mono">[f_c−W, f_c+W]</span>, το αρνητικό στο{' '}
            <span className="font-mono">[−f_c−W, −f_c+W]</span>. Όσο{' '}
            <span className="font-mono">f_c &gt; W</span>, δεν ακουμπάνε.
          </>
        )}
      </div>
    </figure>
  )
}

function OverlapPanel({ fc }: { fc: number }) {
  const width = 560
  const height = 200
  const padX = 36
  const padY = 24
  const baseY = height - padY

  const xOf = (f: number) => padX + ((f + F_VIEW) / (2 * F_VIEW)) * (width - 2 * padX)
  // yMax fixed so the overlap "pile-up" visibly grows past the separated peak (0.5).
  const yMax = 1.1
  const yOf = (v: number) => baseY - (Math.max(0, v) / yMax) * (baseY - padY - 18)

  const half = (f: number) => 0.5 * M(f - fc) + 0.5 * M(f + fc)

  const STEPS = 600
  const fStep = (2 * F_VIEW) / STEPS

  // Summed |X(f)| path (the real spectrum)
  const pts: [number, number][] = []
  for (let i = 0; i <= STEPS; i++) {
    const f = -F_VIEW + i * fStep
    pts.push([xOf(f), yOf(half(f))])
  }
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
  const fillPath = `${linePath} L ${xOf(F_VIEW).toFixed(2)} ${baseY} L ${xOf(-F_VIEW).toFixed(2)} ${baseY} Z`

  // Overlap region in f: [fc−W, W−fc], non-empty when fc < W
  const overlapping = fc < W
  const oL = fc - W
  const oR = W - fc

  // Overlap-region fill (clipped sum), drawn red on top
  let overlapFill: string | null = null
  if (overlapping) {
    const op: [number, number][] = []
    const oSteps = 200
    for (let i = 0; i <= oSteps; i++) {
      const f = oL + ((oR - oL) * i) / oSteps
      op.push([xOf(f), yOf(half(f))])
    }
    overlapFill =
      op.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ') +
      ` L ${xOf(oR).toFixed(2)} ${baseY} L ${xOf(oL).toFixed(2)} ${baseY} Z`
  }

  const carrierTop = yOf(yMax * 0.82)

  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">|X(f)| — το φάσμα του AM</span>
        <span className="text-[10px] text-fg-muted">
          {overlapping ? 'οι δύο πλευρές μπλέκονται' : 'δύο χωριστά αντίγραφα του M(f)'}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full text-fg"
        role="img"
        aria-label="Φάσμα AM με δύο αντίγραφα του M(f) στις ±f_c και ένδειξη αλληλεπικάλυψης"
      >
        {/* axis */}
        <line x1={padX} y1={baseY} x2={width - padX} y2={baseY} stroke="currentColor" strokeOpacity="0.4" />
        <polygon
          points={`${width - padX + 6},${baseY} ${width - padX - 4},${baseY - 4} ${width - padX - 4},${baseY + 4}`}
          fill="currentColor"
          fillOpacity="0.5"
        />
        <text x={width - padX + 10} y={baseY + 4} fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">
          f
        </text>
        <line x1={xOf(0)} y1={padY} x2={xOf(0)} y2={baseY + 4} stroke="currentColor" strokeOpacity="0.25" />

        {/* overlap region shading (behind the curve) */}
        {overlapFill && <path d={overlapFill} fill="rgba(220,38,38,0.28)" />}

        {/* summed spectrum */}
        <path d={fillPath} fill="rgba(29,78,216,0.18)" />
        <path d={linePath} fill="none" stroke="rgb(29,78,216)" strokeWidth="1.6" />

        {/* carrier impulses at ±f_c */}
        {[fc, -fc].map((f0) => (
          <g key={`car-${f0}`}>
            <line x1={xOf(f0)} y1={baseY} x2={xOf(f0)} y2={carrierTop} stroke="rgb(217,119,6)" strokeWidth="2.2" />
            <polygon
              points={`${xOf(f0)},${carrierTop - 6} ${xOf(f0) - 4},${carrierTop + 2} ${xOf(f0) + 4},${carrierTop + 2}`}
              fill="rgb(217,119,6)"
            />
          </g>
        ))}

        {/* ±f_c labels */}
        {[
          [fc, '+f_c'],
          [-fc, '−f_c'],
        ].map(([f0, label]) => (
          <text key={`lab-${label}`} x={xOf(f0 as number)} y={padY - 4} textAnchor="middle" fontSize="10" fill="rgb(217,119,6)">
            {label as string}
          </text>
        ))}

        {/* overlap label */}
        {overlapping && oR - oL > 0.15 && (
          <text x={xOf(0)} y={yOf(0.5 * (M(0 - fc) + M(0 + fc))) - 6} textAnchor="middle" fontSize="10" fill="rgb(220,38,38)" fontWeight="600">
            αλληλεπικάλυψη
          </text>
        )}

        {/* axis ticks in units of W */}
        <g fill="currentColor" fillOpacity="0.7" fontSize="9">
          {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
            <text key={k} x={xOf(k)} y={baseY + 13} textAnchor="middle">
              {k === 0 ? '0' : `${k}W`}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
