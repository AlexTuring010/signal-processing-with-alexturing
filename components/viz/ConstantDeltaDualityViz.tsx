'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Constant ↔ δ duality — using the rect → constant limit.
 *
 * x(t) = rect(t / (2T)), height 1, width 2T → 1 (constant) as T → ∞.
 * X(f) = 2T · sinc(2fT) → δ(f) as T → ∞.
 *
 * Slider drives T from "narrow" to "wide". The student sees the rect spread
 * out to fill the time window while the sinc compresses to a single tall
 * peak at f=0 — making "1 ↔ δ(f)" tangible.
 *
 * The dual pair δ(t) ↔ 1 is the SAME pair with the two domains swapped
 * (duality theorem) — addressed in the footer prose; not duplicated here.
 */

const T_MIN = 0.3
const T_MAX = 8.0

export function ConstantDeltaDualityViz() {
  const [T, setT] = useState(1.0)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, T)
    if (freqRef.current) drawSpectrum(freqRef.current, colors, T)
  }, [T])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Σταθερά ↔ δ(f) — και το dual ζευγάρι δ(t) ↔ 1
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <span className="font-mono">T</span> προς τα δεξιά: ο
        ορθογώνιος παλμός απλώνει σε όλο το χρονικό παράθυρο (πλησιάζει
        την <span className="font-mono">x(t) = 1</span>) και το{' '}
        <span className="font-mono">sinc</span> στη συχνότητα στενεύει
        γύρω από το <span className="font-mono">f = 0</span>, πλησιάζοντας
        την κρούση <span className="font-mono">δ(f)</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="x(t) = rect(t/(2T)), ύψος 1">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Rectangular pulse approaching constant"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X(f) = 2T · sinc(2fT)">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Sinc spectrum compressing to delta"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Πλάτος rect 2T ={' '}
          <span className="font-mono text-fg tabular-nums">{(2 * T).toFixed(2)}</span> s
          {' · '}
          Κορυφή sinc στο{' '}
          <span className="font-mono text-fg tabular-nums">f = 0</span>:{' '}
          <span className="font-mono text-fg tabular-nums">{(2 * T).toFixed(2)}</span>
          {' · '}
          1ος μηδενισμός στο{' '}
          <span className="font-mono text-fg tabular-nums">±{(1 / (2 * T)).toFixed(2)}</span> Hz
        </label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step={0.05}
          value={T}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Rectangle half-width T"
        />
        <div className="mt-1 flex justify-between text-[10px] text-fg-subtle">
          <span>στενός παλμός</span>
          <span>πλατύς (~σταθερά)</span>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Δυϊκότητα.</strong> Το ζευγάρι{' '}
        <span className="font-mono">1 ↔ δ(f)</span> και το{' '}
        <span className="font-mono">δ(t) ↔ 1</span> είναι το <em>ίδιο</em>{' '}
        ζευγάρι, με τα δύο πεδία να αλλάζουν ρόλο. Πάρε ένα ζευγάρι{' '}
        <span className="font-mono">x(t) ↔ X(f)</span>· τότε η{' '}
        <em>duality property</em> του Fourier transform δίνει επίσης{' '}
        <span className="font-mono">X(t) ↔ x(−f)</span>. Εδώ:{' '}
        <span className="font-mono">1 ↔ δ(f)</span> ⇒ δίνει{' '}
        <span className="font-mono">δ(t) ↔ 1</span> δωρεάν. Αυτή είναι και η πιο
        ακραία εκδοχή του time-frequency duality: όσο πιο localized στο ένα
        πεδίο, τόσο πιο spread στο άλλο.
      </div>
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 36
const PAD_Y = 18

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 5
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline + y axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // shaded rect: width 2T, height 1
  const xL = xt(Math.max(tMin, -T))
  const xR = xt(Math.min(tMax, T))
  const yTop = yv(1)
  ctx.fillStyle = `rgba(${getAccentRGB(colors)}, 0.2)`
  ctx.fillRect(xL, yTop, xR - xL, yZero - yTop)

  // outline
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  if (T < tMax) {
    // left tail
    ctx.moveTo(PAD_X, yZero)
    ctx.lineTo(xL, yZero)
    ctx.lineTo(xL, yTop)
    ctx.lineTo(xR, yTop)
    ctx.lineTo(xR, yZero)
    ctx.lineTo(w - PAD_X, yZero)
  } else {
    // rect fills entire visible window — straight line at height 1
    ctx.moveTo(PAD_X, yTop)
    ctx.lineTo(w - PAD_X, yTop)
  }
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${tMax}`, xt(tMin), h - 2)
  ctx.fillText(`+${tMax}`, xt(tMax), h - 2)
  if (T < tMax) {
    ctx.fillText(`−T`, xt(-T), h - 2)
    ctx.fillText(`+T`, xt(T), h - 2)
  }
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('1', PAD_X - 3, yTop + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // axis labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('x(t)', xt(0) + 4, PAD_Y + 4)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 5
  const fMin = -fMax
  const X0 = 2 * T
  // clamp the visual y range so the central spike doesn't explode the canvas
  const yMax = Math.max(2, Math.min(X0 * 1.15, 14))
  const yMin = -yMax * 0.18

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // sinc curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = 2 * f * T
    const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
    const v = Math.max(yMin * 0.95, Math.min(yMax * 0.97, X0 * sinc))
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // peak dot
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(xt(0), yv(Math.min(yMax * 0.97, X0)), 3.5, 0, Math.PI * 2)
  ctx.fill()

  // first-zero guide dashed at f = ±1/(2T)
  const firstZero = 1 / (2 * T)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  if (firstZero <= fMax) {
    for (const f0 of [-firstZero, firstZero]) {
      ctx.beginPath()
      ctx.moveTo(xt(f0), PAD_Y)
      ctx.lineTo(xt(f0), h - PAD_Y)
      ctx.stroke()
    }
  }
  ctx.setLineDash([])

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${fMax}`, xt(fMin), h - 2)
  ctx.fillText(`+${fMax}`, xt(fMax), h - 2)
  if (firstZero <= fMax && firstZero > 0.15) {
    ctx.fillText(`±1/(2T)`, xt(firstZero), h - 2)
  }
  ctx.textAlign = 'right'
  const labelMaxY = yv(Math.min(yMax * 0.97, X0)) + 3
  ctx.fillText('2T', PAD_X - 3, labelMaxY)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // axis labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('X(f)', xt(0) + 4, PAD_Y + 4)
}

function getAccentRGB(colors: ReturnType<typeof getThemeColors>): string {
  if (!colors) return '29, 78, 216'
  const m = colors.accent.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
