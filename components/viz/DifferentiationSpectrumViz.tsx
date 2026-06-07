'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'

/**
 * The differentiation property made visible:
 *
 *     dᵏ/dtᵏ x(t)  ↔  (j 2π f)ᵏ X(f)
 *
 * The derivative does ONE thing to a spectrum — it multiplies it, pointwise, by
 * the ramp (j 2π f)ᵏ. This viz shows that multiplier, what it does to a concrete
 * spectrum (a bump centred on DC), and the phase it injects (the j → 90°
 * rotation). Together they make "the derivative kills DC, amplifies the high
 * frequencies, and rotates each wave by a quarter turn" something you can see.
 *
 * Every curve is normalised to its own peak: the message is the SHAPE change,
 * not the (arbitrary) absolute height.
 */

const F_DOMAIN = 5 // Hz — plotted range is ±F_DOMAIN
const SIGMA = 1.1 // width of the base bump |X(f)| = exp(−f²/2σ²)

type Order = 1 | 2 | 3

const ORDERS: { id: Order; label: string }[] = [
  { id: 1, label: '1η παράγωγος (k = 1)' },
  { id: 2, label: '2η παράγωγος (k = 2)' },
  { id: 3, label: '3η παράγωγος (k = 3)' },
]

// A smooth even bump centred on DC — lots of low-frequency content to be killed.
function baseSpectrum(f: number) {
  return Math.exp(-(f * f) / (2 * SIGMA * SIGMA))
}

// |multiplier| = (2π|f|)ᵏ
function rampMag(f: number, k: number) {
  return Math.pow(2 * Math.PI * Math.abs(f), k)
}

// arg of (j 2π f)ᵏ, computed straight from the complex value so it is correct
// for any k (no hand-rolled case analysis).
function multiplierPhase(f: number, k: number) {
  // jᵏ as one of {1, j, −1, −j}
  const m = ((k % 4) + 4) % 4
  const jRe = m === 0 ? 1 : m === 2 ? -1 : 0
  const jIm = m === 1 ? 1 : m === 3 ? -1 : 0
  // (2π f)ᵏ is real; its sign is negative only when f < 0 and k is odd
  const mag = Math.pow(2 * Math.PI * Math.abs(f), k)
  const ramp = f < 0 && k % 2 === 1 ? -mag : mag
  return Math.atan2(jIm * ramp, jRe * ramp)
}

export function DifferentiationSpectrumViz() {
  const [order, setOrder] = useState<Order>(1)

  const rampRef = useRef<HTMLCanvasElement | null>(null)
  const specRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const draw = () => {
      const colors = getThemeColors()
      if (!colors) return
      if (rampRef.current) drawRamp(rampRef.current, colors, order)
      if (specRef.current) drawSpectra(specRef.current, colors, order)
      if (phaseRef.current) drawPhase(phaseRef.current, colors, order)
    }
    draw()
    const ro = new ResizeObserver(draw)
    if (rampRef.current) ro.observe(rampRef.current)
    if (specRef.current) ro.observe(specRef.current)
    if (phaseRef.current) ro.observe(phaseRef.current)
    return () => ro.disconnect()
  }, [order])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η παράγωγος = πολλαπλασιασμός του φάσματος με j2πf
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Η παράγωγος κάνει <strong>ένα</strong> πράγμα στο φάσμα: το πολλαπλασιάζει σημείο-προς-σημείο
        με τον «πολλαπλασιαστή» <span className="font-mono">(j2πf)ᵏ</span>. Παρατήρησε ότι αυτός
        ο πολλαπλασιαστής <strong>μηδενίζει το DC</strong> (στο <span className="font-mono">f = 0</span>{' '}
        είναι μηδέν) και <strong>ενισχύει τις υψηλές frequencies</strong> (μεγαλώνει με το{' '}
        <span className="font-mono">f</span>). Τα ύψη είναι κανονικοποιημένα — μετράει το{' '}
        <em>σχήμα</em>, όχι η απόλυτη τιμή.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {ORDERS.map((o) => {
          const isActive = order === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setOrder(o.id)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                isActive
                  ? 'border-transparent bg-accent text-accent-fg'
                  : 'border-border bg-bg text-fg-muted hover:bg-bg-elevated'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Ο πολλαπλασιαστής (μέτρο)" subtitle="|H(f)| = (2π|f|)ᵏ">
          <canvas
            ref={rampRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Multiplier magnitude ramp"
          />
        </Panel>
        <Panel title="Φάσμα: πριν → μετά" subtitle="|X(f)| → (2π|f|)ᵏ · |X(f)|">
          <canvas
            ref={specRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Spectrum before and after differentiation"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel title="Η φάση που προσθέτει το j" subtitle="arg (j2πf)ᵏ">
          <canvas
            ref={phaseRef}
            style={{ height: 150 }}
            className="block h-[150px] w-full"
            aria-label="Phase added by the multiplier"
          />
        </Panel>
      </div>

      <figcaption className="mt-3 text-xs text-fg-muted">
        Το <strong>μέτρο</strong> του πολλαπλασιαστή είναι μια ράμπα: μηδέν στο DC, όλο και μεγαλύτερη
        όσο ανεβαίνει η frequency — γι&apos; αυτό η παράγωγος «βγάζει» ακμές και θόρυβο (που είναι
        υψηλο-συχνοτικά) και σβήνει τη σταθερή στάθμη. Η <strong>φάση</strong> προσθέτει στροφή κατά
        πολλαπλάσιο των 90° (το <span className="font-mono">j</span>): για την 1η παράγωγο, +90° στις
        θετικές και −90° στις αρνητικές frequencies — γι&apos; αυτό η παράγωγος του{' '}
        <span className="font-mono">cos</span> είναι <span className="font-mono">−sin</span> (το ίδιο
        κύμα, στραμμένο κατά τέταρτο περιόδου).
      </figcaption>
    </figure>
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
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

const FONT = '10px ui-sans-serif, system-ui, sans-serif'

function fToPx(f: number, w: number, pad: number) {
  return w / 2 + (f / F_DOMAIN) * (w / 2 - pad)
}

function drawRamp(canvas: HTMLCanvasElement, colors: ThemeColors, k: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 26

  // axes: f horizontal (baseline at bottom), value vertical at f = 0
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h - pad)
  ctx.lineTo(w - pad / 2, h - pad)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.fillText('f', w - pad / 2 - 8, h - pad - 4)

  // f-axis ticks
  for (let tick = -4; tick <= 4; tick++) {
    if (tick === 0) continue
    const x = fToPx(tick, w, pad)
    ctx.beginPath()
    ctx.moveTo(x, h - pad - 3)
    ctx.lineTo(x, h - pad + 3)
    ctx.stroke()
  }

  // normalise the ramp to its peak (at the edges, |f| = F_DOMAIN)
  const maxV = rampMag(F_DOMAIN, k) || 1
  const yScale = (h - 2 * pad) / maxV

  ctx.strokeStyle = colors.warn
  ctx.lineWidth = 2.2
  ctx.beginPath()
  const samples = 400
  for (let i = 0; i < samples; i++) {
    const f = -F_DOMAIN + (2 * F_DOMAIN * i) / (samples - 1)
    const v = rampMag(f, k)
    const px = fToPx(f, w, pad)
    const py = h - pad - v * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // DC point: multiplier is exactly zero there
  ctx.fillStyle = colors.warn
  ctx.beginPath()
  ctx.arc(w / 2, h - pad, 3.5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('μηδέν στο DC', w / 2 + 6, h - pad - 6)

  // growth annotation near the right peak
  ctx.fillStyle = colors.warn
  ctx.fillText('μεγαλώνει ∝ |f|ᵏ', w - pad - 84, pad + 4)
}

function drawSpectra(canvas: HTMLCanvasElement, colors: ThemeColors, k: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 26

  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h - pad)
  ctx.lineTo(w - pad / 2, h - pad)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.fillText('f', w - pad / 2 - 8, h - pad - 4)

  for (let tick = -4; tick <= 4; tick++) {
    if (tick === 0) continue
    const x = fToPx(tick, w, pad)
    ctx.beginPath()
    ctx.moveTo(x, h - pad - 3)
    ctx.lineTo(x, h - pad + 3)
    ctx.stroke()
  }

  const samples = 500
  const pts: { f: number; before: number; after: number }[] = []
  let maxBefore = 0
  let maxAfter = 0
  for (let i = 0; i < samples; i++) {
    const f = -F_DOMAIN + (2 * F_DOMAIN * i) / (samples - 1)
    const before = baseSpectrum(f)
    const after = rampMag(f, k) * before
    if (before > maxBefore) maxBefore = before
    if (after > maxAfter) maxAfter = after
    pts.push({ f, before, after })
  }
  const yArea = h - 2 * pad

  // before: faint, with a soft fill
  ctx.beginPath()
  pts.forEach((p, i) => {
    const px = fToPx(p.f, w, pad)
    const py = h - pad - (p.before / (maxBefore || 1)) * yArea
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.lineTo(fToPx(F_DOMAIN, w, pad), h - pad)
  ctx.lineTo(fToPx(-F_DOMAIN, w, pad), h - pad)
  ctx.closePath()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = colors.fgSubtle
  ctx.fill()
  ctx.globalAlpha = 1

  // after: bold accent
  ctx.beginPath()
  pts.forEach((p, i) => {
    const px = fToPx(p.f, w, pad)
    const py = h - pad - (p.after / (maxAfter || 1)) * yArea
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.4
  ctx.stroke()

  // DC of the result is pinned to zero
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(w / 2, h - pad, 3.5, 0, 2 * Math.PI)
  ctx.fill()

  // legend
  ctx.font = FONT
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('|X(f)|  (πριν)', pad + 2, pad - 2)
  ctx.fillStyle = colors.accent
  ctx.fillText('μετά την παράγωγο', pad + 2, pad + 12)
}

function drawPhase(canvas: HTMLCanvasElement, colors: ThemeColors, k: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 24

  // axes centred vertically (phase is signed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.fillText('f', w - pad / 2 - 8, h / 2 - 4)

  const piHeight = (h / 2 - pad / 2) * 0.92

  // gridlines + labels at ±π and ±π/2
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.border
  for (const lvl of [1, 0.5, -0.5, -1]) {
    const y = h / 2 - lvl * piHeight
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(w - pad / 2, y)
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('+π', 2, h / 2 - piHeight + 4)
  ctx.fillText('+π/2', 2, h / 2 - 0.5 * piHeight + 4)
  ctx.fillText('−π/2', 2, h / 2 + 0.5 * piHeight + 4)
  ctx.fillText('−π', 2, h / 2 + piHeight + 4)

  // phase curve (skip a sliver around f = 0 where the multiplier vanishes, so
  // the jump across DC renders as a clean vertical step)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.2
  const samples = 600
  let prevPx = -1
  let prevPy = -1
  for (let i = 0; i < samples; i++) {
    const f = -F_DOMAIN + (2 * F_DOMAIN * i) / (samples - 1)
    if (Math.abs(f) < 0.04) continue
    const theta = multiplierPhase(f, k)
    const px = fToPx(f, w, pad)
    const py = h / 2 - (theta / Math.PI) * piHeight
    if (prevPx >= 0) {
      ctx.beginPath()
      ctx.moveTo(prevPx, prevPy)
      ctx.lineTo(px, py)
      ctx.stroke()
    }
    prevPx = px
    prevPy = py
  }
}
