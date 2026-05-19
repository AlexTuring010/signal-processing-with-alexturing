'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const T_END = 1.0 // 1 second
const F = 4 // 4 Hz cosine for the demo

export function ContinuousVsDiscreteDemo() {
  const [fs, setFs] = useState(20) // sample rate in Hz
  const continuousRef = useRef<HTMLCanvasElement | null>(null)
  const discreteRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const cont = continuousRef.current
    const disc = discreteRef.current
    if (!cont || !disc) return
    const colors = getThemeColors()
    if (!colors) return

    drawContinuous(cont, colors)
    drawDiscrete(disc, colors, fs)
  }, [fs])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ίδιο σήμα, δύο διαφορετικοί τρόποι να το κρατήσουμε
        </h4>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: ένα cosine 4 Hz όπως υπάρχει στον φυσικό κόσμο — συνεχούς χρόνου,
        γράφεται <code className="font-mono">x(t)</code>. Κάτω: ο ίδιος cosine
        αλλά μόνο σε ισαπέχουσες χρονικές στιγμές — διακριτού χρόνου, γράφεται{' '}
        <code className="font-mono">x[n]</code>. Πειραμάτισου με τη συχνότητα
        δειγματοληψίας <em>fs</em> και κοίτα πώς πυκνώνουν τα δείγματα.
      </p>

      <div className="space-y-2">
        <PlotPanel title="Συνεχούς χρόνου · x(t)">
          <canvas
            ref={continuousRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="Continuous-time cosine"
          />
        </PlotPanel>
        <PlotPanel title={`Διακριτού χρόνου · x[n], fs = ${fs} Hz`}>
          <canvas
            ref={discreteRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="Discrete-time samples of the cosine"
          />
        </PlotPanel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Συχνότητα δειγματοληψίας: <span className="font-mono text-fg">{fs} Hz</span>
        </label>
        <input
          type="range"
          min={5}
          max={120}
          step={1}
          value={fs}
          onChange={(e) => setFs(parseInt(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Σαμπλάρισμα"
        />
        <div className="flex justify-between text-[10px] text-fg-subtle">
          <span>5 Hz</span>
          <span>120 Hz</span>
        </div>
      </div>
    </figure>
  )
}

function PlotPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight text-fg">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  h: number,
  padX: number,
  padY: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  // Mid-line (y=0).
  ctx.beginPath()
  ctx.moveTo(padX, h / 2)
  ctx.lineTo(w - padX, h / 2)
  ctx.stroke()
  // Faint baseline at top/bottom.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('+1', padX - 16, padY + 8)
  ctx.fillText('−1', padX - 16, h - padY)
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', padX, h - 4)
  ctx.fillText('1 s', w - padX, h - 4)
}

function drawContinuous(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 26
  const padY = 12

  drawAxes(ctx, colors, w, h, padX, padY)

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = w * 2
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T_END)
    const v = Math.cos(2 * Math.PI * F * t)
    const x = lerp(t, 0, T_END, padX, w - padX)
    const y = lerp(v, 1, -1, padY, h - padY)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawDiscrete(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fs: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 26
  const padY = 12

  drawAxes(ctx, colors, w, h, padX, padY)

  // Faint underlying continuous trace (so users can see the relationship).
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const steps = w
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T_END)
    const v = Math.cos(2 * Math.PI * F * t)
    const x = lerp(t, 0, T_END, padX, w - padX)
    const y = lerp(v, 1, -1, padY, h - padY)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Stems + dots.
  const dt = 1 / fs
  const nSamples = Math.floor(T_END / dt) + 1
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = 1.5
  for (let n = 0; n < nSamples; n++) {
    const t = n * dt
    if (t > T_END) break
    const v = Math.cos(2 * Math.PI * F * t)
    const x = lerp(t, 0, T_END, padX, w - padX)
    const yZero = h / 2
    const y = lerp(v, 1, -1, padY, h - padY)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
