'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * sin(2π f₀ t) ↔ (j/2)[δ(f + f₀) − δ(f − f₀)] — drag f₀, watch both domains.
 *
 * Compared to cosine:
 *   - Same magnitude pattern (½ each at ±f₀)
 *   - Spectrum is **purely imaginary** + antisymmetric (j/2 at −f₀, −j/2 at
 *     +f₀). Matches real-and-odd time signal ↔ imaginary-and-odd spectrum.
 *
 * The figure plots Im{X(f)} (a signed real number) so the antisymmetry is
 * visible directly — upward arrow at −f₀ for +j/2, downward arrow at +f₀
 * for −j/2.
 */

const F0_MIN = 0.3
const F0_MAX = 3.5

export function SineFrequencyPairViz() {
  const [f0, setF0] = useState(1.2)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, f0)
    if (freqRef.current) drawSpectrum(freqRef.current, colors, f0)
  }, [f0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        sin(2π f₀ t) ↔ (j/2)[δ(f + f₀) − δ(f − f₀)] — αντισυμμετρικό imaginary
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε τη <span className="font-mono">f₀</span>. Στο φάσμα παρακάτω
        σχεδιάζεται το <span className="font-mono">Im&lbrace;X(f)&rbrace;</span>{' '}
        (το <span className="font-mono">Re&lbrace;X(f)&rbrace; = 0</span>). Δύο
        ίδιες κρούσεις σε μέτρο, αλλά αντίθετο πρόσημο — αντισυμμετρικές γύρω
        από το <span className="font-mono">f = 0</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="x(t) = sin(2π f₀ t)">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Sine in time"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="Im{X(f)} — imaginary, odd">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Two opposite-signed impulses at plus/minus f0"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Συχνότητα f₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{f0.toFixed(2)}</span> Hz
          {' · '}
          Δύο imaginary impulses: <span className="font-mono">+j/2</span> στη{' '}
          <span className="font-mono">−f₀</span>,{' '}
          <span className="font-mono">−j/2</span> στη{' '}
          <span className="font-mono">+f₀</span>
        </label>
        <input
          type="range"
          min={F0_MIN}
          max={F0_MAX}
          step={0.05}
          value={f0}
          onChange={(e) => setF0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Frequency f0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Real-and-odd ↔ imaginary-and-odd.</strong> Το sine είναι περιττό
        και πραγματικό· το φάσμα του είναι περιττό και{' '}
        <em>καθαρά imaginary</em>. Συγκρίνεται με το cosine, που είναι
        real-and-even και έχει real-and-even φάσμα. Διαφέρουν μόνο σε{' '}
        <strong>φάση</strong>: ένα cosine βάζει «ίσα + ίσα», ένα sine βάζει «−j +
        j» — η ίδια ενέργεια, μόνο με γωνία 90°.
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

const PAD_X = 38
const PAD_Y = 18

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  f0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 3
  const tMin = -tMax
  const yLim = 1.3

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
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

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = Math.sin(2 * Math.PI * f0 * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${tMax}`, xt(tMin), h - 2)
  ctx.fillText(`+${tMax}`, xt(tMax), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
  ctx.fillText('−1', PAD_X - 3, yv(-1) + 3)

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
  f0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = F0_MAX + 0.5
  const fMin = -fMax
  const yMax = 0.65
  const yMin = -0.65

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
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

  // upward impulse +j/2 at -f0
  drawImpulse(ctx, xt(-f0), yZero, yv(0.5), colors.accent, '+j/2', 'up')
  // downward impulse -j/2 at +f0
  drawImpulse(ctx, xt(f0), yZero, yv(-0.5), colors.accent, '−j/2', 'down')

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`+f₀`, xt(f0), h - 2)
  ctx.fillText(`−f₀`, xt(-f0), h - 2)
  ctx.fillText('0', xt(0), h - 2)

  // y-axis ticks at ±½ (showing magnitude reference; imag axis)
  ctx.textAlign = 'right'
  ctx.fillText('+½', PAD_X - 3, yv(0.5) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
  ctx.fillText('−½', PAD_X - 3, yv(-0.5) + 3)

  // axis labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im{X(f)}', xt(0) + 4, PAD_Y + 4)
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  px: number,
  yZero: number,
  yPx: number,
  color: string,
  label: string,
  direction: 'up' | 'down',
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(px, yZero)
  ctx.lineTo(px, yPx)
  ctx.stroke()

  // arrowhead pointing in the right direction
  const tipOffset = direction === 'up' ? 7 : -7
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(px, yPx)
  ctx.lineTo(px - 5, yPx + tipOffset)
  ctx.lineTo(px + 5, yPx + tipOffset)
  ctx.closePath()
  ctx.fill()

  // label
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = color
  ctx.fillText(label, px + 7, yPx + (direction === 'up' ? 2 : 4))
}
