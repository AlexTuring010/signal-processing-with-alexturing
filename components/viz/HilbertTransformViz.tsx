'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Hilbert transform — phase shift by −π/2 for positive frequencies, +π/2
 * for negative frequencies. Magnitude unchanged.
 *
 * Three small panels:
 *   Left:    input x(t) (time domain)
 *   Middle:  output x̂(t) = H{x(t)} (time domain)
 *   Right:   spectrum |X(f)| with the phase-shift annotation showing
 *            "+f → ×(−j)", "−f → ×(+j)"
 *
 * Three presets pinned to the canonical examples that build intuition:
 *   - cos(2π f₀ t) → sin(2π f₀ t)
 *   - sin(2π f₀ t) → −cos(2π f₀ t)
 *   - sum of two cosines (different frequencies) — same rule applies frequency-by-frequency
 */

type PresetId = 'cos' | 'sin' | 'two-cos'

type Preset = {
  id: PresetId
  label: string
  description: string
  /** input signal */
  x: (t: number) => number
  /** Hilbert-transformed signal (closed-form for the preset) */
  xhat: (t: number) => number
  /** Names for the input/output to label the panels */
  inputLabel: string
  outputLabel: string
  /** Frequencies present in the spectrum (Hz) */
  freqs: number[]
}

const F0 = 1
const F1 = 1.7

const PRESETS: Preset[] = [
  {
    id: 'cos',
    label: 'cos → sin',
    description:
      'Το πιο καθαρό παράδειγμα: cos μετατοπίζεται κατά −π/2 → γίνεται sin. Στο φάσμα, το peak στο +f₀ πολλαπλασιάστηκε με −j (φάση −π/2), στο −f₀ με +j.',
    x: (t) => Math.cos(2 * Math.PI * F0 * t),
    xhat: (t) => Math.sin(2 * Math.PI * F0 * t),
    inputLabel: 'cos(2π f₀ t)',
    outputLabel: 'sin(2π f₀ t)',
    freqs: [F0],
  },
  {
    id: 'sin',
    label: 'sin → −cos',
    description:
      'Εφαρμόζοντας Hilbert ξανά στο sin παίρνουμε −cos. Δύο εφαρμογές → φάση −π → πρόσημο −. Επιβεβαιώνει την ιδιότητα H{H{x}} = −x.',
    x: (t) => Math.sin(2 * Math.PI * F0 * t),
    xhat: (t) => -Math.cos(2 * Math.PI * F0 * t),
    inputLabel: 'sin(2π f₀ t)',
    outputLabel: '−cos(2π f₀ t)',
    freqs: [F0],
  },
  {
    id: 'two-cos',
    label: 'cos(f₀) + cos(f₁) → sin(f₀) + sin(f₁)',
    description:
      'Άθροισμα δύο cosines σε διαφορετικές συχνότητες. Ο Hilbert δουλεύει ανεξάρτητα σε κάθε συχνοτική συνιστώσα — και οι δύο γίνονται sines.',
    x: (t) => Math.cos(2 * Math.PI * F0 * t) + 0.7 * Math.cos(2 * Math.PI * F1 * t),
    xhat: (t) => Math.sin(2 * Math.PI * F0 * t) + 0.7 * Math.sin(2 * Math.PI * F1 * t),
    inputLabel: 'cos(2π f₀ t) + 0.7 cos(2π f₁ t)',
    outputLabel: 'sin(2π f₀ t) + 0.7 sin(2π f₁ t)',
    freqs: [F0, F1],
  },
]

export function HilbertTransformViz() {
  const [presetId, setPresetId] = useState<PresetId>('cos')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const preset = PRESETS.find((p) => p.id === presetId)!

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, preset)
  }, [preset])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Hilbert transform σε action — phase shift κατά π/2 ανά συχνότητα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Στα αριστερά: input <span className="font-mono">x(t)</span>. Στο κέντρο:
        ο Hilbert του <span className="font-mono">x̂(t) = ℋ{`{x(t)}`}</span>.
        Δεξιά: το (κοινό) μέτρο φάσματος, με την ετικέτα του πολλαπλασιαστή φάσης
        σε κάθε πλευρά.
      </p>

      <div
        role="radiogroup"
        aria-label="Hilbert preset"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presetId === p.id}
            onClick={() => setPresetId(p.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              presetId === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Hilbert transform: input vs output time signals and the spectrum phase-shift annotation"
      />

      <p className="mt-2 text-[11px] text-fg-subtle">{preset.description}</p>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Το μέτρο φάσματος δεν αλλάζει. Αλλάζει μόνο η <strong>φάση</strong>:
        −π/2 σε όλες τις θετικές συχνότητες, +π/2 σε όλες τις αρνητικές. Στη
        γλώσσα του πολλαπλασιαστή: <span className="font-mono">−j·sgn(f)</span>
        — όλες οι συχνότητες ταυτόχρονα.
      </div>
    </figure>
  )
}

const PLUS_C = 'rgb(29, 78, 216)' // input
const MINUS_C = 'rgb(217, 119, 6)' // output

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: Preset,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Three panels horizontally
  const split1 = w / 3
  const split2 = (2 * w) / 3
  drawTime(ctx, colors, 0, 0, split1, h, preset.x, preset.inputLabel, PLUS_C)
  drawTime(ctx, colors, split1, 0, split2 - split1, h, preset.xhat, preset.outputLabel, MINUS_C)
  drawSpectrum(ctx, colors, split2, 0, w - split2, h, preset)
}

function drawTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fn: (t: number) => number,
  label: string,
  color: string,
) {
  if (!colors) return
  const PAD = 14
  const tMin = -2.5
  const tMax = 2.5
  const yLim = 2.0

  const xt = (t: number) => lerp(t, tMin, tMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD + 6, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x0 + PAD, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()

  ctx.strokeStyle = color
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = fn(t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
) {
  if (!colors) return
  const PAD = 14
  const fMax = 3
  const fMin = -fMax
  const yMax = 1.0

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.35, y0 + PAD + 6, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)|  (μέτρο: ίδιο)', x0 + PAD, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 6)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // Impulse pairs at ±f for each frequency in preset.freqs, height ½
  const drawImpulse = (f: number) => {
    const x = xt(f)
    const y = yv(0.5)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.lineTo(x - 4, y + 2)
    ctx.lineTo(x + 4, y + 2)
    ctx.closePath()
    ctx.fill()
  }

  for (const f of preset.freqs) {
    drawImpulse(f)
    drawImpulse(-f)
  }

  // Annotation labels for the multipliers
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  // Negative side label
  ctx.fillStyle = MINUS_C
  ctx.fillText('×(+j)', xt(-fMax * 0.55), y0 + ph - PAD + 2)
  ctx.fillText('φάση +π/2', xt(-fMax * 0.55), y0 + ph - PAD + 12)
  // Positive side label
  ctx.fillStyle = MINUS_C
  ctx.fillText('×(−j)', xt(fMax * 0.55), y0 + ph - PAD + 2)
  ctx.fillText('φάση −π/2', xt(fMax * 0.55), y0 + ph - PAD + 12)

  // Frequency tick labels for ±f₀
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  for (const f of preset.freqs) {
    ctx.fillText(`+f${f === F0 ? '₀' : '₁'}`, xt(f), yZero + 12)
    ctx.fillText(`−f${f === F0 ? '₀' : '₁'}`, xt(-f), yZero + 12)
  }
}
