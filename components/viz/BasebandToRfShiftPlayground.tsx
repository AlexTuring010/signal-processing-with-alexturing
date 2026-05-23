'use client'

/**
 * Baseband → RF shift playground.
 *
 * One unified spectrum, one f_c slider, four variant toggles. The student
 * starts with a baseband shape sitting around f = 0, then slides f_c out
 * and watches the spectrum migrate to ±f_c. The variant chips restructure
 * what survives: full carrier + both sidebands (Conventional AM), only the
 * sidebands (DSB-SC), only the upper sideband (SSB-USB), or the asymmetric
 * VSB profile.
 *
 * The goal is to make two things visceral at the same time:
 *   1. The modulation theorem MOVES the spectrum without deforming the shape.
 *   2. Each AM variant is a DIFFERENT CHOICE about what parts of the moved
 *      spectrum to keep.
 *
 * Distinct from ModulationTheoremViz (which is 3-stripe time + 2-stripe
 * frequency, focused on the formal derivation) and AMFamilySpectra (which
 * is 4 static panels). This one is "one spectrum, dynamic morphing".
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type ShapeId = 'triangle' | 'rect' | 'lowpass'

type VariantId = 'baseband' | 'am' | 'dsb-sc' | 'ssb-usb' | 'vsb'

type Shape = {
  id: ShapeId
  label: string
  description: string
  /** Baseband |X(f)| in arbitrary units. Centred at f = 0. */
  X: (f: number) => number
  /** Half-bandwidth W (where the shape is essentially zero beyond ±W). */
  W: number
}

const SHAPES: Shape[] = [
  {
    id: 'triangle',
    label: 'Τρίγωνο',
    description: 'sinc² profile — όλο θετικό, καθαρή «καμπύλη».',
    X: (f) => {
      const W = 1
      const x = f * W
      const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
      return Math.abs(W * sinc * sinc)
    },
    W: 1.0,
  },
  {
    id: 'rect',
    label: 'Ορθογώνιο',
    description: 'sinc — έχει αρνητικά lobes, σου δείχνει ότι η μετατόπιση δεν τα «καθαρίζει».',
    X: (f) => {
      const W = 1
      const x = f * W
      const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
      return Math.abs(W * sinc)
    },
    W: 1.0,
  },
  {
    id: 'lowpass',
    label: 'Toy "speech"',
    description: 'Δύο peaks γύρω από 0.4 και 0.7 Hz — μοιάζει με baseband φωνή.',
    X: (f) => {
      const peak = (f0: number, h: number) => {
        const sigma = 0.06
        return h * Math.exp(-((f - f0) ** 2) / (2 * sigma * sigma))
      }
      return (
        peak(0.4, 0.85) +
        peak(-0.4, 0.85) +
        peak(0.7, 0.55) +
        peak(-0.7, 0.55)
      )
    },
    W: 0.85,
  },
]

const VARIANTS: { id: VariantId; label: string; hint: string; bwTimesW: number | null }[] = [
  { id: 'baseband', label: 'Baseband', hint: 'το αρχικό m(t), στις χαμηλές συχνότητες', bwTimesW: 2 },
  { id: 'am', label: 'AM', hint: 'carrier + δύο πλήρεις πλευρικές', bwTimesW: 2 },
  { id: 'dsb-sc', label: 'DSB-SC', hint: 'δύο πλευρικές, χωρίς carrier', bwTimesW: 2 },
  { id: 'ssb-usb', label: 'SSB (USB)', hint: 'μόνο η upper sideband — μισό bandwidth', bwTimesW: 1 },
  { id: 'vsb', label: 'VSB', hint: 'πλήρης μία + κατάλοιπο άλλης + reduced carrier', bwTimesW: 1.3 },
]

const FC_MIN = 0
const FC_MAX = 4
const F_VIEW = 5.2 // ±f_view range shown on screen

export function BasebandToRfShiftPlayground() {
  const [shapeId, setShapeId] = useState<ShapeId>('triangle')
  const [variantId, setVariantId] = useState<VariantId>('am')
  const [fc, setFc] = useState(2.5)

  const shape = useMemo(() => SHAPES.find((s) => s.id === shapeId)!, [shapeId])
  const variant = useMemo(() => VARIANTS.find((v) => v.id === variantId)!, [variantId])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Baseband → RF: σύρε το f_c, διάλεξε παραλλαγή
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ξεκίνα με ένα baseband <span className="font-mono">m(t)</span> γύρω από
        το <span className="font-mono">f = 0</span>. Σύρε το{' '}
        <span className="font-mono">f_c</span> και δες το φάσμα να μετατοπίζεται
        στις <span className="font-mono">±f_c</span> — <strong>το σχήμα μένει
        ίδιο</strong>. Άλλαξε παραλλαγή για να δεις τι κρατάει η καθεμία.
      </p>

      <div className="mb-2 flex flex-wrap gap-2">
        <div
          role="radiogroup"
          aria-label="Baseband shape"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {SHAPES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={shapeId === s.id}
              onClick={() => setShapeId(s.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                shapeId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={variantId === v.id}
            onClick={() => setVariantId(v.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-medium transition',
              variantId === v.id
                ? 'border-amber-400/70 bg-amber-100/70 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100'
                : 'border-border bg-bg-elevated text-fg-muted hover:border-amber-400/40 hover:text-fg',
            )}
            title={v.hint}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="-mt-1 mb-2 text-[11px] text-fg-subtle">
        {shape.description}
      </p>

      <SpectrumPanel shape={shape} variant={variantId} fc={fc} />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Carrier f_c ={' '}
          <span className="font-mono tabular-nums text-fg">{fc.toFixed(2)}</span> Hz ·
          Baseband bandwidth W ~
          <span className="font-mono tabular-nums text-fg">{shape.W.toFixed(2)}</span> Hz ·
          {' '}Διαμορφωμένο bandwidth ~
          <span className="font-mono tabular-nums text-fg">
            {variant.bwTimesW === null
              ? '—'
              : (variant.bwTimesW * shape.W).toFixed(2)}
          </span>{' '}
          Hz
        </label>
        <input
          type="range"
          min={FC_MIN}
          max={FC_MAX}
          step={0.05}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency f_c"
        />
      </div>

      <div
        key={variantId}
        className="mt-3 rounded-md border border-amber-400/40 bg-amber-50/50 px-3 py-2 text-xs dark:border-amber-400/30 dark:bg-amber-400/10"
      >
        <strong>{variant.label}.</strong> {variant.hint}
        {variantId === 'baseband' && (
          <>
            {' '}— ακόμα δεν διαμορφώσαμε. Το φάσμα ζει στο{' '}
            <span className="font-mono">±W</span>.
          </>
        )}
        {variantId === 'am' && (
          <>
            {' '}— οι δύο πορτοκαλί κάθετες είναι τα <span className="font-mono">δ(f ∓ f_c)</span>{' '}
            από τον σταθερό όρο A_c. Bandwidth ={' '}
            <span className="font-mono">2W</span>.
          </>
        )}
        {variantId === 'dsb-sc' && (
          <>
            {' '}— ίδιες πλευρικές, μηδέν στον carrier. Bandwidth ={' '}
            <span className="font-mono">2W</span>, αλλά 100% της ισχύος πάει σε
            «χρήσιμο».
          </>
        )}
        {variantId === 'ssb-usb' && (
          <>
            {' '}— κρατάμε μόνο την USB (πάνω από κάθε <span className="font-mono">f_c</span>),
            πετάμε τη LSB. Bandwidth = <span className="font-mono">W</span> —
            το μισό!
          </>
        )}
        {variantId === 'vsb' && (
          <>
            {' '}— πλήρης USB + κατάλοιπο LSB (διακεκομμένο). Επιτρέπει envelope
            detector με μικρή παραμόρφωση. Bandwidth ~{' '}
            <span className="font-mono">1.25W</span>.
          </>
        )}
      </div>
    </figure>
  )
}

function SpectrumPanel({
  shape,
  variant,
  fc,
}: {
  shape: Shape
  variant: VariantId
  fc: number
}) {
  const width = 560
  const height = 200
  const padX = 36
  const padY = 24
  const baseY = height - padY

  const xOf = (f: number) => padX + ((f + F_VIEW) / (2 * F_VIEW)) * (width - 2 * padX)

  // Find peak baseband |X(f)| for normalisation
  const peak = Math.max(0.001, Math.max(shape.X(0), ...sample(shape.X, -shape.W * 1.5, shape.W * 1.5, 60)))
  const yMax = peak * 1.15
  const yOf = (v: number) => {
    const clamped = Math.max(0, v)
    return baseY - (clamped / yMax) * (baseY - padY - 18)
  }

  // Generate the visible spectrum path
  const STEPS = 600
  const fMin = -F_VIEW
  const fStep = (2 * F_VIEW) / STEPS

  const showCarrier = variant === 'am' || variant === 'vsb'
  const carrierScale = variant === 'vsb' ? 0.55 : 1.0
  const lsbScale = variant === 'vsb' ? 0.0 : 1.0 // VSB rendered separately
  const isBaseband = variant === 'baseband'

  // Build paths
  const pathPoints: [number, number][] = []
  for (let i = 0; i <= STEPS; i++) {
    const f = fMin + i * fStep
    let v = 0
    if (isBaseband) {
      v = shape.X(f)
    } else {
      // Each sideband contributes 0.5 * shape.X(f ∓ fc), per modulation theorem.
      // For SSB-USB: drop the negative-frequency lower copy and the positive-frequency lower copy.
      // For VSB: render LSB separately with a different style; here just USB.
      if (variant === 'ssb-usb') {
        // Keep USB on the positive side (frequencies > +fc) and the conjugate-symmetric
        // copy on the negative side (frequencies < -fc).
        if (f > fc) v += 0.5 * shape.X(f - fc)
        if (f < -fc) v += 0.5 * shape.X(f + fc)
      } else if (variant === 'vsb') {
        // USB on positive: f > fc (full); on negative side: f < -fc (full upper-sideband copy)
        if (f > fc) v += 0.5 * shape.X(f - fc)
        if (f < -fc) v += 0.5 * shape.X(f + fc)
      } else {
        // AM / DSB-SC: both sidebands
        v += 0.5 * shape.X(f - fc)
        v += 0.5 * shape.X(f + fc) * lsbScale
        // showLower is implicit (full)
      }
    }
    pathPoints.push([xOf(f), yOf(v)])
  }

  const spectrumPath = pathPoints
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ')
  const fillPath =
    spectrumPath +
    ` L ${xOf(F_VIEW).toFixed(2)} ${baseY} L ${xOf(-F_VIEW).toFixed(2)} ${baseY} Z`

  // VSB: separate vestige path for the LSB partial
  let vsbVestigePath: string | null = null
  if (variant === 'vsb') {
    const vest: [number, number][] = []
    for (let i = 0; i <= STEPS; i++) {
      const f = fMin + i * fStep
      let v = 0
      // Add a tapered LSB: a half-width LSB at ±f_c, fading off
      const taperPos = (f - fc + 0) // distance from +fc, negative side = LSB
      if (taperPos < 0 && taperPos > -shape.W * 0.5) {
        const taper = 1 - Math.abs(taperPos) / (shape.W * 0.5)
        v += 0.5 * shape.X(f - fc) * taper
      }
      const taperNeg = f + fc
      if (taperNeg > 0 && taperNeg < shape.W * 0.5) {
        const taper = 1 - Math.abs(taperNeg) / (shape.W * 0.5)
        v += 0.5 * shape.X(f + fc) * taper
      }
      vest.push([xOf(f), yOf(v)])
    }
    vsbVestigePath = vest
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(' ')
  }

  // Compose
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">
          |X(f)| — ενιαία προβολή
        </span>
        <span className="text-[10px] text-fg-muted">
          {isBaseband ? 'πριν τη διαμόρφωση' : 'μετά τη διαμόρφωση'}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full text-fg"
        role="img"
        aria-label={`Spectrum for ${variant}`}
      >
        {/* axes */}
        <line x1={padX} y1={baseY} x2={width - padX} y2={baseY} stroke="currentColor" strokeOpacity="0.4" />
        <polygon
          points={`${width - padX + 6},${baseY} ${width - padX - 4},${baseY - 4} ${width - padX - 4},${baseY + 4}`}
          fill="currentColor"
          fillOpacity="0.5"
        />
        <text x={width - padX + 10} y={baseY + 4} fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">
          f
        </text>
        <line x1={xOf(0)} y1={padY} x2={xOf(0)} y2={baseY + 4} stroke="currentColor" strokeOpacity="0.3" />

        {/* ±f_c dotted markers (when non-baseband) */}
        {!isBaseband && fc > 0 && (
          <g>
            <line x1={xOf(fc)} y1={padY} x2={xOf(fc)} y2={baseY} stroke="rgb(217,119,6)" strokeOpacity="0.5" strokeDasharray="3 3" />
            <line x1={xOf(-fc)} y1={padY} x2={xOf(-fc)} y2={baseY} stroke="rgb(217,119,6)" strokeOpacity="0.5" strokeDasharray="3 3" />
            <text x={xOf(fc)} y={padY - 4} textAnchor="middle" fontSize="10" fill="rgb(217,119,6)">
              +f_c
            </text>
            <text x={xOf(-fc)} y={padY - 4} textAnchor="middle" fontSize="10" fill="rgb(217,119,6)">
              −f_c
            </text>
          </g>
        )}

        {/* spectrum shape (filled + outlined) */}
        <path d={fillPath} fill="rgba(29,78,216,0.20)" />
        <path d={spectrumPath} fill="none" stroke="rgb(29,78,216)" strokeWidth="1.6" />

        {/* VSB vestige (dashed outline + lighter fill) */}
        {vsbVestigePath && (
          <path
            d={vsbVestigePath + ` L ${xOf(F_VIEW).toFixed(2)} ${baseY} L ${xOf(-F_VIEW).toFixed(2)} ${baseY} Z`}
            fill="rgba(29,78,216,0.10)"
            stroke="rgb(29,78,216)"
            strokeOpacity="0.6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* carrier impulses */}
        {showCarrier && fc > 0 && (
          <g>
            {[fc, -fc].map((f0) => {
              const x = xOf(f0)
              const top = yOf(yMax * 0.85 * carrierScale)
              return (
                <g key={`carrier-${f0}`}>
                  <line x1={x} y1={baseY} x2={x} y2={top} stroke="rgb(217,119,6)" strokeWidth="2.5" />
                  <polygon
                    points={`${x},${top - 6} ${x - 4},${top + 2} ${x + 4},${top + 2}`}
                    fill="rgb(217,119,6)"
                  />
                </g>
              )
            })}
          </g>
        )}

        {/* axis ticks */}
        <g fill="currentColor" fillOpacity="0.7" fontSize="10">
          {[-4, -2, 0, 2, 4].map((fk) => (
            <text key={fk} x={xOf(fk)} y={baseY + 14} textAnchor="middle">
              {fk}
            </text>
          ))}
        </g>

        {/* y-axis label */}
        <text
          x={xOf(0) + 6}
          y={padY + 2}
          fontSize="10"
          fill="currentColor"
          fillOpacity="0.7"
          fontStyle="italic"
        >
          |X(f)|
        </text>

        {/* shape-preservation annotation when fc > 0 */}
        {!isBaseband && fc > 0.5 && (
          <text
            x={xOf(fc) + 6}
            y={padY + 14}
            fontSize="10"
            fill="rgb(29,78,216)"
            fillOpacity="0.9"
          >
            ίδιο σχήμα με το baseband
          </text>
        )}
      </svg>
    </div>
  )
}

function sample(fn: (x: number) => number, a: number, b: number, n: number) {
  const out: number[] = []
  for (let i = 0; i <= n; i++) {
    const t = a + ((b - a) * i) / n
    out.push(fn(t))
  }
  return out
}
