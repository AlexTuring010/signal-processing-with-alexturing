'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Triangular pulse in time ↔ sinc² spectrum in frequency.
 *
 * Λ(t/T) is the unit-height triangle on [-T, T]. Its FT is T·sinc²(fT).
 *
 * Teaching goals:
 *   - drag T, watch the sinc² envelope narrow inversely.
 *   - the spectrum is **non-negative everywhere** (sinc squared) — unlike the
 *     rect↔sinc pair whose sinc oscillates through zero.
 *   - the first zero is still at f = ±1/T.
 *   - X(0) = T (area under the triangle).
 *   - the triangle is rect * rect (auto-convolution of a unit-height,
 *     unit-width rect scaled to width T) — so its spectrum is the SQUARE of
 *     the corresponding sinc, which is why every sidelobe is positive.
 */

const T_MIN = 0.3
const T_MAX = 4.0

export function TriToSincSquaredViz() {
  const [T, setT] = useState(1.0)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, T)
    if (freqRef.current) drawSpectrum(freqRef.current, colors, T)
  }, [T])

  const firstZero = 1 / T
  const X0 = T

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Τρίγωνο ↔ sinc² — γιατί η sinc τετράγωνη
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <span className="font-mono">T</span> και παρακολούθησε. Όλες οι
        πλευρικές του sinc² είναι <strong>θετικές</strong> (αντίθετα με το
        rect↔sinc) — γιατί το τρίγωνο είναι η <em>αυτοσυνέλιξη</em> ενός rect,
        οπότε στο φάσμα παίρνει το ίδιο sinc στο{' '}
        <span className="font-mono">τετράγωνο</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="x(t) = Λ(t/T)">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Triangular pulse in time"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X(f) = T·sinc²(fT)">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Sinc-squared spectrum"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Πλάτος τριγώνου T ={' '}
          <span className="font-mono text-fg tabular-nums">{T.toFixed(2)}</span> s
          {' · '}
          1ος μηδενισμός sinc² στο{' '}
          <span className="font-mono text-fg tabular-nums">±{firstZero.toFixed(2)}</span> Hz
          {' · '}
          X(0) ={' '}
          <span className="font-mono text-fg tabular-nums">{X0.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step={0.05}
          value={T}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Triangle half-width T"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί sinc²;</strong> Το τρίγωνο γράφεται{' '}
        <span className="font-mono">Λ(t/T) = (1/T)·[rect(t/T) * rect(t/T)]</span>.
        Από το convolution theorem, συνέλιξη στον χρόνο → πολλαπλασιασμός στη
        συχνότητα. Δύο rect → δύο sinc, οπότε <strong>sinc · sinc = sinc²</strong> —
        και αυτό εξηγεί γιατί όλες οι πλευρικές είναι τώρα θετικές: το τετράγωνο
        ενός πραγματικού αριθμού δεν αλλάζει πρόσημο.
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

const PAD_X = 32
const PAD_Y = 16

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = T_MAX * 0.8
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // y-axis at t=0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // shaded triangle
  const xL = xt(-T)
  const xR = xt(T)
  const xPeak = xt(0)
  const yTop = yv(1)
  ctx.fillStyle = `rgba(${getAccentRGB(colors)}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xL, yZero)
  ctx.lineTo(xPeak, yTop)
  ctx.lineTo(xR, yZero)
  ctx.closePath()
  ctx.fill()

  // outline
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(xL, yZero)
  ctx.lineTo(xPeak, yTop)
  ctx.lineTo(xR, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−T`, xt(-T), h - 2)
  ctx.fillText(`+T`, xt(T), h - 2)
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

  const fMax = 6
  const fMin = -fMax
  const X0 = T
  const yMax = Math.max(1.2, X0 * 1.15)
  const yMin = -yMax * 0.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline + axis
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

  // sinc² curve (fill under for positivity emphasis)
  ctx.fillStyle = `rgba(${getAccentRGB(colors)}, 0.10)`
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = f * T
    const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
    const v = X0 * sinc * sinc
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()

  // outline
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = f * T
    const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
    const v = X0 * sinc * sinc
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // peak dot
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(xt(0), yv(X0), 3.5, 0, Math.PI * 2)
  ctx.fill()

  // dotted lines at f = ±1/T
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  for (const f0 of [-1 / T, 1 / T]) {
    if (f0 < fMin || f0 > fMax) continue
    ctx.beginPath()
    ctx.moveTo(xt(f0), PAD_Y)
    ctx.lineTo(xt(f0), h - PAD_Y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (1 / T <= fMax) {
    ctx.fillText(`+1/T`, xt(1 / T), h - 2)
    ctx.fillText(`−1/T`, xt(-1 / T), h - 2)
  }
  ctx.fillText('0', xt(0), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText(`T`, PAD_X - 3, yv(X0) + 3)
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
