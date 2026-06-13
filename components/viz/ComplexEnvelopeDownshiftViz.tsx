'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Complex envelope as a down-shift. The pre-envelope X_p(f) is one-sided and
 * lives around +f_c. Multiplying x_p(t) by e^{−j2πf_c t} shifts the spectrum
 * left by f_c, so G(f) = X_p(f + f_c): the lump that sat at +f_c slides down
 * to baseband (centred at 0). The student drags the shift δ from 0 to f_c and
 * watches the lump arrive at 0.
 *
 * The lump is drawn ASYMMETRIC on purpose: once it sits at baseband, |G(f)|
 * is visibly not symmetric about 0 — which is exactly why g(t) is, in general,
 * complex-valued (the §6 I/Q story). Distinct from BasebandToRfShiftPlayground,
 * which moves a two-sided baseband shape UP to ±f_c.
 */

const FC = 3.0
const WIDTH = 560
const HEIGHT = 215
const PAD_X = 42
const PAD_Y = 22
const BASE_Y = 170
const APEX_Y = PAD_Y + 22
const F_MIN = -1.5
const F_MAX = 4.6
const ACCENT = 'rgb(29,78,216)'
const AMBER = 'rgb(217,119,6)'

// Asymmetric one-sided lump centred at `c` (translation-invariant shape).
function lump(f: number, c: number): number {
  const a = Math.exp(-((f - (c - 0.18)) ** 2) / (2 * 0.3 * 0.3))
  const b = 0.55 * Math.exp(-((f - (c + 0.5)) ** 2) / (2 * 0.22 * 0.22))
  return a + b
}

// Peak of the shape (constant under translation) for normalisation.
let PEAK = 0
for (let f = -1.5; f <= 1.5; f += 0.01) PEAK = Math.max(PEAK, lump(f, 0))

const xOf = (f: number) => PAD_X + ((f - F_MIN) / (F_MAX - F_MIN)) * (WIDTH - 2 * PAD_X)
const yOf = (v: number) => BASE_Y - (Math.max(0, v) / PEAK) * (BASE_Y - APEX_Y)

function lumpPath(c: number): string {
  const STEPS = 260
  let d = ''
  for (let i = 0; i <= STEPS; i++) {
    const f = F_MIN + (i / STEPS) * (F_MAX - F_MIN)
    const px = xOf(f).toFixed(2)
    const py = yOf(lump(f, c)).toFixed(2)
    d += `${i === 0 ? 'M' : 'L'} ${px} ${py} `
  }
  return d
}

function lumpFill(c: number): string {
  return `${lumpPath(c)} L ${xOf(F_MAX).toFixed(2)} ${BASE_Y} L ${xOf(F_MIN).toFixed(2)} ${BASE_Y} Z`
}

export function ComplexEnvelopeDownshiftViz() {
  const [delta, setDelta] = useState(0)
  const center = FC - delta
  const arrived = delta >= FC - 0.05

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Complex envelope: κατέβασε το λούτσο από το +f_c στο baseband
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <span className="font-mono">X_p(f)</span> είναι one-sided και ζει γύρω
        από το <span className="font-mono">+f_c</span> (το αχνό λούτσο). Σύρε την
        ολίσθηση <span className="font-mono">δ</span>: ο πολλαπλασιασμός με{' '}
        <span className="font-mono">e^(−j2πδt)</span> μετατοπίζει το φάσμα κατά{' '}
        <span className="font-mono">−δ</span>. Στο <span className="font-mono">δ = f_c</span>{' '}
        το λούτσο φτάνει στο <span className="font-mono">0</span> — αυτό είναι το{' '}
        <span className="font-mono">G(f) = X_p(f + f_c)</span>.
      </p>

      <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block w-full text-fg"
          role="img"
          aria-label="Το λούτσο του X_p στο +f_c ολισθαίνει στο baseband και γίνεται το complex envelope G(f)"
        >
          {/* f-axis */}
          <line x1={PAD_X - 8} y1={BASE_Y} x2={WIDTH - PAD_X + 12} y2={BASE_Y} stroke="currentColor" strokeOpacity="0.45" />
          <polygon
            points={`${WIDTH - PAD_X + 18},${BASE_Y} ${WIDTH - PAD_X + 8},${BASE_Y - 4} ${WIDTH - PAD_X + 8},${BASE_Y + 4}`}
            fill="currentColor"
            fillOpacity="0.5"
          />
          <text x={WIDTH - PAD_X + 22} y={BASE_Y + 4} fontSize="11" fill="currentColor" fillOpacity="0.7" fontStyle="italic">
            f
          </text>

          {/* |·| axis at f = 0 (baseband target) */}
          <line x1={xOf(0)} y1={BASE_Y + 4} x2={xOf(0)} y2={PAD_Y - 6} stroke="currentColor" strokeOpacity="0.4" />
          <polygon
            points={`${xOf(0)},${PAD_Y - 12} ${xOf(0) - 4},${PAD_Y - 2} ${xOf(0) + 4},${PAD_Y - 2}`}
            fill="currentColor"
            fillOpacity="0.5"
          />

          {/* +f_c marker */}
          <line x1={xOf(FC)} y1={BASE_Y} x2={xOf(FC)} y2={APEX_Y - 6} stroke={AMBER} strokeOpacity="0.55" strokeDasharray="3 3" />
          <text x={xOf(FC)} y={PAD_Y - 1} textAnchor="middle" fontSize="11" fill={AMBER}>
            +f_c
          </text>

          {/* ghost: X_p at +f_c (reference, faint) */}
          <path d={lumpFill(FC)} fill="currentColor" fillOpacity="0.07" />
          <path d={lumpPath(FC)} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />

          {/* shift arrow from +f_c to current centre */}
          {delta > 0.08 && (
            <g>
              <line x1={xOf(FC)} y1={PAD_Y + 6} x2={xOf(center) + 6} y2={PAD_Y + 6} stroke={ACCENT} strokeWidth="1.3" />
              <polygon
                points={`${xOf(center)},${PAD_Y + 6} ${xOf(center) + 7},${PAD_Y + 2} ${xOf(center) + 7},${PAD_Y + 10}`}
                fill={ACCENT}
              />
              <text x={(xOf(FC) + xOf(center)) / 2} y={PAD_Y + 1} textAnchor="middle" fontSize="10" fill={ACCENT}>
                −δ
              </text>
            </g>
          )}

          {/* solid: current G (shifted lump) */}
          <path d={lumpFill(center)} fill={ACCENT} fillOpacity="0.2" />
          <path d={lumpPath(center)} fill="none" stroke={ACCENT} strokeWidth="1.8" />

          {/* label on the moving lump */}
          <text x={xOf(center)} y={APEX_Y - 4} textAnchor="middle" fontSize="11" fill={ACCENT}>
            {arrived ? '|G(f)|' : '|X_p(f)|'}
          </text>

          {/* ticks */}
          <text x={xOf(0)} y={BASE_Y + 16} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.85">
            0
          </text>
          {arrived && (
            <text x={xOf(0)} y={BASE_Y + 28} textAnchor="middle" fontSize="9" fill={ACCENT}>
              baseband
            </text>
          )}
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="flex-1 text-xs text-fg-muted">
          Ολίσθηση δ ={' '}
          <span className="font-mono tabular-nums text-fg">{delta.toFixed(2)}</span>{' '}
          · κέντρο λούτσου ={' '}
          <span className="font-mono tabular-nums text-fg">{center.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={FC}
            step={0.05}
            value={delta}
            onChange={(e) => setDelta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Ολίσθηση δ"
          />
        </label>
        <button
          type="button"
          onClick={() => setDelta(FC)}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors',
            arrived
              ? 'border-accent/50 bg-accent-soft/40 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg',
          )}
        >
          δ = f_c
        </button>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {arrived ? (
          <>
            Έφτασε στο baseband: το λούτσο κάθεται στο <span className="font-mono">0</span>. Αυτό είναι το{' '}
            <span className="font-mono">G(f) = X_p(f + f_c)</span> — το ίδιο σχήμα, απλώς κατεβασμένο.
            Πρόσεξε ότι <strong>δεν είναι συμμετρικό γύρω από το 0</strong>: γι' αυτό το{' '}
            <span className="font-mono">g(t)</span> είναι εν γένει <strong>complex-valued</strong> (το ξεδιπλώνουμε σε{' '}
            <span className="font-mono">x_I + j·x_Q</span> στη §6).
          </>
        ) : (
          <>
            Καθώς αυξάνεις το <span className="font-mono">δ</span>, το ίδιο λούτσο μετατοπίζεται προς τα αριστερά
            κατά <span className="font-mono">−δ</span> — το σχήμα δεν αλλάζει, μόνο η θέση. Φέρ' το ώσπου το κέντρο
            να πέσει στο <span className="font-mono">0</span> (<span className="font-mono">δ = f_c</span>) για να δεις το complex envelope.
          </>
        )}
      </div>
    </figure>
  )
}
