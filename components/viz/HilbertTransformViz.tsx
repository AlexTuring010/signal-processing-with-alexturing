'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Hilbert transform — phase shift by −π/2 for positive frequencies, +π/2
 * for negative frequencies. Magnitude unchanged.
 *
 * 2×2 grid:
 *   Top-left:     input x(t) (time domain)
 *   Top-right:    output x̂(t) = H{x(t)} (time domain)
 *   Bottom-left:  magnitude spectrum |X(f)| — IDENTICAL for input & output
 *   Bottom-right: phase spectrum ∠X(f) (blue, input) vs ∠X̂(f) (amber, output)
 *                 with arrows showing the −π/2 (f>0) / +π/2 (f<0) jump.
 *
 * The two frequency-domain panels together make the whole point visceral:
 * the magnitude is untouched, ALL the action is in the phase.
 *
 * Three presets pinned to the canonical examples that build intuition:
 *   - cos(2π f₀ t) → sin(2π f₀ t)            (phase 0 → ∓π/2)
 *   - sin(2π f₀ t) → −cos(2π f₀ t)           (phase ∓π/2 → ∓π, the H² = −1 step)
 *   - sum of two cosines — same rule applies frequency-by-frequency
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
  /** Phase ∠X(f) of the input at each POSITIVE frequency in `freqs` (rad).
   *  Negative-frequency phase follows by odd symmetry: ∠X(−f) = −∠X(f). */
  inputPhasePos: number[]
}

const F0 = 1
const F1 = 1.7
const HALF_PI = Math.PI / 2

const PRESETS: Preset[] = [
  {
    id: 'cos',
    label: 'cos → sin',
    description:
      'Το πιο καθαρό παράδειγμα: cos μετατοπίζεται κατά −π/2 → γίνεται sin. Στο φάσμα, το peak στο +f₀ πολλαπλασιάστηκε με −j (φάση −π/2), στο −f₀ με +j. Δες στο κάτω-δεξιά panel τη φάση να πέφτει από 0 σε −π/2.',
    x: (t) => Math.cos(2 * Math.PI * F0 * t),
    xhat: (t) => Math.sin(2 * Math.PI * F0 * t),
    inputLabel: 'cos(2π f₀ t)',
    outputLabel: 'sin(2π f₀ t)',
    freqs: [F0],
    inputPhasePos: [0],
  },
  {
    id: 'sin',
    label: 'sin → −cos',
    description:
      'Εφαρμόζοντας Hilbert ξανά στο sin παίρνουμε −cos. Δύο εφαρμογές → φάση −π → πρόσημο −. Στο panel της φάσης βλέπεις το +f₀ να φεύγει από −π/2 και να φτάνει στο −π (= +π): αυτό είναι το ορατό H{H{x}} = −x.',
    x: (t) => Math.sin(2 * Math.PI * F0 * t),
    xhat: (t) => -Math.cos(2 * Math.PI * F0 * t),
    inputLabel: 'sin(2π f₀ t)',
    outputLabel: '−cos(2π f₀ t)',
    freqs: [F0],
    inputPhasePos: [-HALF_PI],
  },
  {
    id: 'two-cos',
    label: 'cos(f₀) + cos(f₁) → sin(f₀) + sin(f₁)',
    description:
      'Άθροισμα δύο cosines σε διαφορετικές συχνότητες. Ο Hilbert δουλεύει ανεξάρτητα σε κάθε συχνοτική συνιστώσα — και οι δύο φάσεις πέφτουν κατά −π/2 (στις θετικές συχνότητες), ανεξάρτητα από το πλάτος τους.',
    x: (t) => Math.cos(2 * Math.PI * F0 * t) + 0.7 * Math.cos(2 * Math.PI * F1 * t),
    xhat: (t) => Math.sin(2 * Math.PI * F0 * t) + 0.7 * Math.sin(2 * Math.PI * F1 * t),
    inputLabel: 'cos(2π f₀ t) + 0.7 cos(2π f₁ t)',
    outputLabel: 'sin(2π f₀ t) + 0.7 sin(2π f₁ t)',
    freqs: [F0, F1],
    inputPhasePos: [0, 0],
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
        Πάνω σειρά (time domain): input <span className="font-mono">x(t)</span> και ο
        Hilbert του <span className="font-mono">x̂(t) = ℋ{`{x(t)}`}</span>. Κάτω σειρά
        (frequency domain): αριστερά το <strong>μέτρο</strong>{' '}
        <span className="font-mono">|X(f)|</span> — <strong>ίδιο</strong> για input και
        output· δεξιά η <strong>φάση</strong> <span className="font-mono">∠X(f)</span>{' '}
        (μπλε, πριν) έναντι <span className="font-mono">∠X̂(f)</span> (πορτοκαλί, μετά).
        Όλη η αλλαγή ζει στο panel της φάσης.
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
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Hilbert transform: top row input vs output time signals; bottom row identical magnitude spectrum and the phase spectrum before vs after, showing the ∓π/2 phase shift"
      />

      <p className="mt-2 text-[11px] text-fg-subtle">{preset.description}</p>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Σύγκρινε τα δύο κάτω panels: το <strong>μέτρο</strong> είναι πανομοιότυπο
        (οι κρούσεις στις ±f δεν κουνιούνται), ενώ η <strong>φάση</strong> πέφτει
        κατά −π/2 σε όλες τις θετικές συχνότητες και ανεβαίνει κατά +π/2 σε όλες
        τις αρνητικές. Στη γλώσσα του πολλαπλασιαστή: ακριβώς το{' '}
        <span className="font-mono">−j·sgn(f)</span> — μοναδιαίο μέτρο, καθαρή
        στροφή φάσης, όλες οι συχνότητες ταυτόχρονα.
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

  // 2×2 grid: time row on top, frequency row on bottom.
  const midX = w / 2
  const midY = h / 2

  drawTime(ctx, colors, 0, 0, midX, midY, preset.x, preset.inputLabel, PLUS_C)
  drawTime(ctx, colors, midX, 0, w - midX, midY, preset.xhat, preset.outputLabel, MINUS_C)
  drawSpectrum(ctx, colors, 0, midY, midX, h - midY, preset)
  drawPhase(ctx, colors, midX, midY, w - midX, h - midY, preset)

  // light separators
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(midX, 8)
  ctx.lineTo(midX, h - 8)
  ctx.moveTo(8, midY)
  ctx.lineTo(w - 8, midY)
  ctx.stroke()
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
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD + 8, y0 + ph - PAD)
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

function freqLabel(f: number): string {
  return f === F0 ? '₀' : '₁'
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
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.35, y0 + PAD + 10, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)|  — ίδιο για input & output', x0 + PAD, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 10)
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

  // Frequency tick labels for ±f₀ (and ±f₁)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const f of preset.freqs) {
    ctx.fillText(`+f${freqLabel(f)}`, xt(f), yZero + 12)
    ctx.fillText(`−f${freqLabel(f)}`, xt(-f), yZero + 12)
  }
}

/** Wrap a phase to (−π, π]. */
function wrapPi(a: number): number {
  let x = a
  while (x > Math.PI + 1e-9) x -= 2 * Math.PI
  while (x < -Math.PI - 1e-9) x += 2 * Math.PI
  return x
}

function drawPhase(
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

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const top = y0 + PAD + 12
  const bot = y0 + ph - PAD
  const yp = (phase: number) => lerp(phase, Math.PI, -Math.PI, top, bot)
  const yZero = yp(0)

  // Title + tiny legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('∠X(f) → ∠X̂(f)  — η φάση αλλάζει', x0 + PAD, y0 + 12)

  // Horizontal gridlines at +π/2, 0, −π/2 (dashed, faint), labelled at left.
  ctx.textAlign = 'left'
  ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
  const guides: [number, string][] = [
    [HALF_PI, '+π/2'],
    [0, '0'],
    [-HALF_PI, '−π/2'],
  ]
  for (const [val, lab] of guides) {
    const y = yp(val)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.setLineDash(val === 0 ? [] : [3, 3])
    ctx.beginPath()
    ctx.moveTo(x0 + PAD, y)
    ctx.lineTo(x0 + pw - PAD, y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText(lab, x0 + 2, y - 2)
  }

  // Vertical axis at f = 0
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), top - 4)
  ctx.lineTo(xt(0), bot)
  ctx.stroke()

  const marker = (x: number, y: number, color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 3.2, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Arrow from input phase to output phase (shows the ∓π/2 jump).
  const arrow = (x: number, yFrom: number, yTo: number) => {
    ctx.strokeStyle = MINUS_C
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x, yFrom)
    ctx.lineTo(x, yTo)
    ctx.stroke()
    const dir = yTo >= yFrom ? 1 : -1
    ctx.fillStyle = MINUS_C
    ctx.beginPath()
    ctx.moveTo(x, yTo)
    ctx.lineTo(x - 3, yTo - dir * 5)
    ctx.lineTo(x + 3, yTo - dir * 5)
    ctx.closePath()
    ctx.fill()
  }

  preset.freqs.forEach((f, i) => {
    const phiIn = preset.inputPhasePos[i]
    // positive frequency: phase shifts by −π/2
    const phiOut = wrapPi(phiIn - HALF_PI)
    arrow(xt(f), yp(phiIn), yp(phiOut))
    marker(xt(f), yp(phiIn), PLUS_C)
    marker(xt(f), yp(phiOut), MINUS_C)
    // negative frequency: odd symmetry on input, +π/2 shift on output
    const phiInNeg = -phiIn
    const phiOutNeg = wrapPi(phiInNeg + HALF_PI)
    arrow(xt(-f), yp(phiInNeg), yp(phiOutNeg))
    marker(xt(-f), yp(phiInNeg), PLUS_C)
    marker(xt(-f), yp(phiOutNeg), MINUS_C)
  })

  // Frequency tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const f of preset.freqs) {
    ctx.fillText(`+f${freqLabel(f)}`, xt(f), bot + 10)
    ctx.fillText(`−f${freqLabel(f)}`, xt(-f), bot + 10)
  }

  // Legend dots (πριν / μετά)
  ctx.textAlign = 'left'
  ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
  const lx = x0 + pw - PAD - 64
  marker(lx, y0 + 10, PLUS_C)
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('πριν', lx + 6, y0 + 13)
  marker(lx + 32, y0 + 10, MINUS_C)
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('μετά', lx + 38, y0 + 13)
}
