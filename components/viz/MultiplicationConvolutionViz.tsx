'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Multiplication in time ↔ convolution in frequency (property 5c), made
 * concrete through the "beat frequencies" picture.
 *
 * Two pure cosines cos(2π f₁ t) and cos(2π f₂ t) are multiplied. From the
 * product-to-sum identity
 *     cos a · cos b = ½cos(a−b) + ½cos(a+b),
 * the product contains ONLY two new frequencies: the difference |f₁−f₂| and
 * the sum f₁+f₂. Every other frequency cancels.
 *
 * In the frequency domain each cosine is a pair of impulses (±f₁, ±f₂). Their
 * convolution X₁ ∗ X₂ drops a scaled copy of one pair at every spike of the
 * other → impulses at ±(f₁+f₂) and ±(f₁−f₂), each of height ¼ (when f₁ = f₂
 * the two difference impulses merge at f = 0 into a single DC spike of height
 * ½ — exactly the cos² = ½ + ½cos(2·) case behind coherent detection).
 *
 * Teaching goal: SEE that multiplying in time does not "blur" frequencies at
 * random — it produces precisely the sum-and-difference set, which is what the
 * convolution integral bookkeeps. This is the engine of the modulation theorem
 * (§7) and of sampling.
 */

const F_MIN = 1
const F_MAX = 7

const COLOR_F1 = '#3b82f6' // blue — input tone 1
const COLOR_F2 = '#f59e0b' // amber — input tone 2
const COLOR_DIFF = '#10b981' // green — difference frequency
const COLOR_SUM = '#8b5cf6' // violet — sum frequency

type Delta = { f: number; h: number; kind: 'sum' | 'diff' }

/** The impulses of X₁ ∗ X₂, merged where they coincide (f₁ = f₂ ⇒ DC spike). */
function productDeltas(f1: number, f2: number): Delta[] {
  const sum = f1 + f2
  const diff = f1 - f2
  const raw: Delta[] = [
    { f: sum, h: 0.25, kind: 'sum' },
    { f: -sum, h: 0.25, kind: 'sum' },
    { f: diff, h: 0.25, kind: 'diff' },
    { f: -diff, h: 0.25, kind: 'diff' },
  ]
  const merged = new Map<number, Delta>()
  for (const d of raw) {
    const key = Math.round(d.f)
    const ex = merged.get(key)
    if (ex) ex.h += d.h
    else merged.set(key, { f: key, h: d.h, kind: d.kind })
  }
  return [...merged.values()].sort((a, b) => a.f - b.f)
}

export function MultiplicationConvolutionViz() {
  const [f1, setF1] = useState(3)
  const [f2, setF2] = useState(4)
  const [showInputs, setShowInputs] = useState(true)

  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, f1, f2)
    if (freqRef.current) drawFreq(freqRef.current, colors, f1, f2, showInputs)
  }, [f1, f2, showInputs])

  const diff = Math.abs(f1 - f2)
  const sum = f1 + f2

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πολλαπλασιασμός στον χρόνο ↔ συνέλιξη στη συχνότητα — οι frequencies «άθροισμα & διαφορά»
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πολλαπλασιάζουμε δύο καθαρά cosines{' '}
        <span className="font-mono" style={{ color: COLOR_F1 }}>
          cos(2π f₁ t)
        </span>{' '}
        και{' '}
        <span className="font-mono" style={{ color: COLOR_F2 }}>
          cos(2π f₂ t)
        </span>
        . Στον χρόνο βλέπεις «beating». Στη συχνότητα το γινόμενο κρατά{' '}
        <strong>μόνο δύο</strong> νέες frequencies: τη{' '}
        <span style={{ color: COLOR_DIFF }}>διαφορά |f₁−f₂|</span> και το{' '}
        <span style={{ color: COLOR_SUM }}>άθροισμα f₁+f₂</span>. Αυτό ακριβώς «μετράει» η
        συνέλιξη <span className="font-mono">X₁ ∗ X₂</span>.
      </p>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <Slider
          label="f₁"
          color={COLOR_F1}
          value={f1}
          onChange={setF1}
        />
        <Slider
          label="f₂"
          color={COLOR_F2}
          value={f2}
          onChange={setF2}
        />
      </div>

      <div className="grid gap-3">
        <Panel
          title="Στον χρόνο"
          subtitle="γινόμενο = cos(2π f₁ t) · cos(2π f₂ t)"
        >
          <canvas
            ref={timeRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Two cosines and their product over time"
          />
        </Panel>
        <Panel
          title="Στη συχνότητα"
          subtitle="X₁ ∗ X₂ — κρούσεις στο ±(f₁−f₂) και ±(f₁+f₂)"
        >
          <canvas
            ref={freqRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Spectrum of the product: impulses at sum and difference frequencies"
          />
        </Panel>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Readout label="διαφορά |f₁−f₂|" color={COLOR_DIFF} value={`${diff} Hz`} />
        <Readout label="άθροισμα f₁+f₂" color={COLOR_SUM} value={`${sum} Hz`} />
        <label className="ml-auto flex items-center gap-1.5 text-xs text-fg-muted">
          <input
            type="checkbox"
            checked={showInputs}
            onChange={(e) => setShowInputs(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          δείξε πού ήταν οι αρχικές ±f₁, ±f₂
        </label>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί συνέλιξη;</strong> Το φάσμα κάθε cosine είναι δύο καρφιά. Όταν συνελίσσεις δύο
        ζευγάρια καρφιών, αφήνεις ένα αντίγραφο του ενός ζεύγους πάνω σε <em>κάθε</em> καρφί του
        άλλου — και τα μόνα σημεία που προκύπτουν είναι το άθροισμα και η διαφορά. Αν κάνεις{' '}
        <span className="font-mono">f₁ = f₂</span>, η διαφορά πέφτει στο{' '}
        <span className="font-mono">f = 0</span> (όρος DC, ύψος ½): αυτό είναι το{' '}
        <span className="font-mono">cos² = ½ + ½cos(2·)</span> που θα ξαναδείς στην coherent
        αποδιαμόρφωση. Με ένα cosine «carrier» αντί για σκέτο τόνο, αυτό γίνεται το{' '}
        <strong>modulation theorem</strong> της Section 7.
      </div>
    </figure>
  )
}

function Slider({
  label,
  color,
  value,
  onChange,
}: {
  label: string
  color: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold" style={{ color }}>
          {label}
        </span>
        <span className="font-mono text-xs tabular-nums text-fg">{value} Hz</span>
      </div>
      <input
        type="range"
        min={F_MIN}
        max={F_MAX}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-1 w-full"
        style={{ accentColor: color }}
        aria-label={`Frequency ${label}`}
      />
    </label>
  )
}

function Readout({
  label,
  color,
  value,
}: {
  label: string
  color: string
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      <span className="text-fg-muted">{label}:</span>
      <span className="font-mono font-semibold tabular-nums text-fg">{value}</span>
    </div>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] font-mono text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 30
const PAD_Y = 16

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  f1: number,
  f2: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 1
  const yLim = 1.25
  const xt = (t: number) => lerp(t, 0, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.moveTo(PAD_X, PAD_Y)
  ctx.lineTo(PAD_X, h - PAD_Y)
  ctx.stroke()

  // faint input cosines
  drawWave(ctx, (t) => Math.cos(2 * Math.PI * f1 * t), xt, yv, tMax, COLOR_F1, 1, 0.4)
  drawWave(ctx, (t) => Math.cos(2 * Math.PI * f2 * t), xt, yv, tMax, COLOR_F2, 1, 0.4)

  // bold product = the pointwise multiply of the two faint cosines above
  drawWave(
    ctx,
    (t) => Math.cos(2 * Math.PI * f1 * t) * Math.cos(2 * Math.PI * f2 * t),
    xt,
    yv,
    tMax,
    colors.fg,
    2.2,
    1,
  )

  // axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText('1 s', xt(tMax), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText('+1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('−1', PAD_X - 3, yv(-1) + 3)

  // legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = COLOR_F1
  ctx.fillText('cos f₁', PAD_X + 6, PAD_Y + 2)
  ctx.fillStyle = COLOR_F2
  ctx.fillText('cos f₂', PAD_X + 46, PAD_Y + 2)
  ctx.fillStyle = colors.fg
  ctx.fillText('γινόμενο', PAD_X + 86, PAD_Y + 2)
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  fn: (t: number) => number,
  xt: (t: number) => number,
  yv: (v: number) => number,
  tMax: number,
  color: string,
  width: number,
  alpha: number,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, 0, tMax)
    const px = xt(t)
    const py = yv(fn(t))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.restore()
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  f1: number,
  f2: number,
  showInputs: boolean,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 2 * F_MAX + 1
  const yMax = 0.62
  const yMin = -0.22
  const xt = (f: number) => lerp(f, -fMax, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // faint "ghost" markers of where the original input frequencies sat
  if (showInputs) {
    for (const [f, color] of [
      [f1, COLOR_F1],
      [f2, COLOR_F2],
    ] as const) {
      for (const s of [1, -1]) {
        const px = xt(s * f)
        ctx.save()
        ctx.globalAlpha = 0.55
        ctx.strokeStyle = color
        ctx.lineWidth = 1.2
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.moveTo(px, yZero)
        ctx.lineTo(px, yv(0.25))
        ctx.stroke()
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.arc(px, yv(0.25), 2.5, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.restore()
      }
    }
  }

  // the product spectrum: merged impulses
  const deltas = productDeltas(f1, f2)
  for (const d of deltas) {
    const color = d.kind === 'sum' ? COLOR_SUM : COLOR_DIFF
    const label = d.h >= 0.49 ? '½' : '¼'
    drawImpulse(ctx, xt(d.f), yZero, yv(d.h), color, label)
    // frequency tick below axis
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${d.f}`, xt(d.f), h - 3)
  }

  // center + axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 3)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f (Hz)', w - PAD_X / 2, yZero - 4)

  // legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = COLOR_DIFF
  ctx.fillText('● διαφορά', PAD_X + 4, PAD_Y + 2)
  ctx.fillStyle = COLOR_SUM
  ctx.fillText('● άθροισμα', PAD_X + 64, PAD_Y + 2)
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  px: number,
  yZero: number,
  yPx: number,
  color: string,
  label: string,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(px, yZero)
  ctx.lineTo(px, yPx)
  ctx.stroke()

  // arrowhead
  ctx.beginPath()
  ctx.moveTo(px, yPx)
  ctx.lineTo(px - 5, yPx + 7)
  ctx.lineTo(px + 5, yPx + 7)
  ctx.closePath()
  ctx.fill()

  // height label
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, px + 7, yPx + 4)
}
