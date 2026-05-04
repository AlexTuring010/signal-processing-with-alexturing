'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

const T_END = 4

type SysId = 'rc' | 'integrator' | 'delay'

const SYSTEMS: { id: SysId; label: string; description: string; h: (t: number) => number }[] = [
  {
    id: 'rc',
    label: 'RC LP filter',
    description: 'h(t) = (1/τ) e^(−t/τ) · u(t),  τ = 0.5 s',
    h: (t) => (t < 0 ? 0 : (1 / 0.5) * Math.exp(-t / 0.5)),
  },
  {
    id: 'integrator',
    label: 'Ολοκληρωτής (1 s window)',
    description: 'h(t) = 1 για 0 ≤ t ≤ 1, αλλιώς 0  ⇒  y(t) = ∫_{t−1}^{t} x',
    h: (t) => (t >= 0 && t <= 1 ? 1 : 0),
  },
  {
    id: 'delay',
    label: 'Καθυστέρηση 1 s',
    description: 'h(t) = δ(t − 1)  ⇒  y(t) = x(t − 1)',
    h: (t) => (Math.abs(t - 1) < 0.05 ? 1 / 0.05 : 0),
  },
]

export function ImpulseResponseDemo() {
  const [sysId, setSysId] = useState<SysId>('rc')
  const sys = SYSTEMS.find((s) => s.id === sysId)!

  const inputRef = useRef<HTMLCanvasElement | null>(null)
  const outputRef = useRef<HTMLCanvasElement | null>(null)

  const data = useMemo(() => {
    const N = 600
    const dt = T_END / (N - 1)
    const ys = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const t = i * dt
      ys[i] = sys.h(t)
    }
    return { ys, dt }
  }, [sys])

  useEffect(() => {
    const inp = inputRef.current
    const out = outputRef.current
    if (!inp || !out) return
    const colors = getThemeColors()
    if (!colors) return
    drawImpulse(inp, colors)
    drawHt(out, colors, data.ys, sys.id === 'delay')
  }, [data, sys.id])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δ(t) μέσα → h(t) έξω
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διαλέγουμε ένα σύστημα. Δίνουμε στην είσοδο μια κρουστική δ(t). Η έξοδος
        που παίρνουμε είναι, εξ ορισμού, η <strong>κρουστική απόκριση</strong> h(t).
      </p>

      <div
        role="radiogroup"
        aria-label="Επιλογή συστήματος"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={sysId === s.id}
            onClick={() => setSysId(s.id)}
            className={cn(
              'rounded-full px-2 py-0.5 transition-colors',
              sysId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-3 md:grid-cols-[1fr_60px_1fr]">
        <Panel title="Είσοδος · δ(t)">
          <canvas ref={inputRef} style={{ height: 130 }} className="block h-[130px] w-full" aria-label="Unit impulse input" />
        </Panel>
        <div className="flex items-center justify-center text-fg-muted">
          <span className="text-3xl">⟶</span>
        </div>
        <Panel title="Έξοδος · h(t)">
          <canvas ref={outputRef} style={{ height: 130 }} className="block h-[130px] w-full" aria-label="System impulse response" />
        </Panel>
      </div>

      <p className="mt-2 text-xs text-fg-muted">
        <span className="font-mono">{sys.description}</span>
      </p>
    </figure>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function drawImpulse(canvas: HTMLCanvasElement, colors: ReturnType<typeof getThemeColors>) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 16
  const padY = 12
  // baseline
  const xZero = padX + 10
  const yBase = h - padY
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, yBase)
  ctx.lineTo(w - padX, yBase)
  ctx.stroke()

  // Spike
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 3
  const yTop = padY + 8
  ctx.beginPath()
  ctx.moveTo(xZero, yBase)
  ctx.lineTo(xZero, yTop)
  ctx.stroke()
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.moveTo(xZero, yTop - 6)
  ctx.lineTo(xZero - 5, yTop + 2)
  ctx.lineTo(xZero + 5, yTop + 2)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('δ(t)', xZero + 8, yTop + 6)
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', xZero, yBase + 13)
}

function drawHt(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  samples: Float32Array,
  asImpulse: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 16
  const padY = 12

  let yMax = 0
  for (let i = 0; i < samples.length; i++) {
    if (samples[i] > yMax) yMax = samples[i]
  }
  if (yMax < 1e-6) yMax = 1
  const yMin = -0.1 * yMax

  const px = (i: number) => lerp(i, 0, samples.length - 1, padX, w - padX)
  const py = (y: number) => lerp(y, yMax * 1.1, yMin, padY, h - padY)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, py(0))
  ctx.lineTo(w - padX, py(0))
  ctx.stroke()

  if (asImpulse) {
    // For the delay system, draw an arrow at t=1.
    const idx = Math.floor(samples.length * (1 / T_END))
    const x = px(idx)
    const yBase = py(0)
    const yTop = py(yMax)
    ctx.strokeStyle = colors.success
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, yBase)
    ctx.lineTo(x, yTop)
    ctx.stroke()
    ctx.fillStyle = colors.success
    ctx.beginPath()
    ctx.moveTo(x, yTop - 6)
    ctx.lineTo(x - 5, yTop + 2)
    ctx.lineTo(x + 5, yTop + 2)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = colors.fgMuted
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('δ(t − 1)', x, yTop - 12)
    ctx.fillText('t = 1', x, yBase + 13)
  } else {
    ctx.strokeStyle = colors.success
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < samples.length; i++) {
      const x = px(i)
      const y = py(samples[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 2)
  ctx.fillText(`${T_END}s`, w - padX, h - 2)
}
