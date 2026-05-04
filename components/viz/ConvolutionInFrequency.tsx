'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Convolution in time = multiplication in frequency.
 *
 * Input x(t) chosen from a small preset (rect, triangle).
 * Filter h(t) chosen from a small preset (rect, gaussian).
 *
 * We display:
 *   - Top row:    x(t),       h(t),         y(t) = x*h(t)
 *   - Bottom row: X(f),       H(f),         Y(f) = X(f)·H(f)
 *
 * All transforms in closed form (rect↔sinc, tri↔sinc², gauss↔gauss). The
 * convolution y(t) is also computed in closed form per pair, falling back to
 * a numeric trapezoid when needed.
 */

type SignalId = 'rect' | 'tri' | 'gauss'

type Signal = {
  id: SignalId
  label: string
  x: (t: number) => number
  X: (f: number) => number
  W: number
}

const SIGNALS: Signal[] = [
  {
    id: 'rect',
    label: 'rect',
    x: (t) => (Math.abs(t) <= 0.5 ? 1 : 0),
    X: (f) => {
      if (f === 0) return 1
      return Math.sin(Math.PI * f) / (Math.PI * f)
    },
    W: 1,
  },
  {
    id: 'tri',
    label: 'triangle',
    x: (t) => Math.max(0, 1 - Math.abs(t)),
    X: (f) => {
      if (f === 0) return 1
      const s = Math.sin(Math.PI * f) / (Math.PI * f)
      return s * s
    },
    W: 1,
  },
  {
    id: 'gauss',
    label: 'gauss',
    x: (t) => Math.exp(-Math.PI * t * t),
    X: (f) => Math.exp(-Math.PI * f * f),
    W: 1,
  },
]

function convolve(
  x: (t: number) => number,
  h: (t: number) => number,
  t: number,
): number {
  // Numeric trapezoid on a fixed window — sufficient for these tame signals
  const tau0 = -3
  const tau1 = 3
  const N = 200
  const dt = (tau1 - tau0) / N
  let sum = 0
  for (let i = 0; i <= N; i++) {
    const tau = tau0 + i * dt
    const f = x(tau) * h(t - tau)
    sum += i === 0 || i === N ? 0.5 * f : f
  }
  return sum * dt
}

export function ConvolutionInFrequency() {
  const [xId, setXId] = useState<SignalId>('rect')
  const [hId, setHId] = useState<SignalId>('rect')

  const sx = SIGNALS.find((s) => s.id === xId)!
  const sh = SIGNALS.find((s) => s.id === hId)!

  const refX = useRef<HTMLCanvasElement | null>(null)
  const refH = useRef<HTMLCanvasElement | null>(null)
  const refY = useRef<HTMLCanvasElement | null>(null)
  const refXf = useRef<HTMLCanvasElement | null>(null)
  const refHf = useRef<HTMLCanvasElement | null>(null)
  const refYf = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (refX.current) drawTime(refX.current, colors, sx.x, '#accent')
    if (refH.current) drawTime(refH.current, colors, sh.x, '#warn')
    if (refY.current)
      drawTime(refY.current, colors, (t) => convolve(sx.x, sh.x, t), '#success', true)
    if (refXf.current) drawFreq(refXf.current, colors, sx.X, '#accent')
    if (refHf.current) drawFreq(refHf.current, colors, sh.X, '#warn')
    if (refYf.current) drawFreq(refYf.current, colors, (f) => sx.X(f) * sh.X(f), '#success')
  }, [sx, sh])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Convolution στον χρόνο = πολλαπλασιασμός στη συχνότητα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Άνω σειρά: <span className="font-mono">x(t)</span>,{' '}
        <span className="font-mono">h(t)</span>, και η συνέλιξή τους{' '}
        <span className="font-mono">y(t) = x*h(t)</span>. Κάτω σειρά: τα φάσματά τους —
        και πραγματικά, <span className="font-mono">Y(f) = X(f)·H(f)</span>. Καμία
        ολοκλήρωση συνέλιξης δεν χρειάστηκε στη συχνότητα.
      </p>

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <SelectorRow
          label="x(t):"
          activeId={xId}
          onChange={(v) => setXId(v)}
          color="accent"
        />
        <SelectorRow
          label="h(t):"
          activeId={hId}
          onChange={(v) => setHId(v)}
          color="warn"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Panel title="x(t)" subtitle="">
          <canvas ref={refX} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
        <Panel title="h(t)" subtitle="">
          <canvas ref={refH} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
        <Panel title="y(t) = x ∗ h" subtitle="συνέλιξη στον χρόνο">
          <canvas ref={refY} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
        <Panel title="X(f)" subtitle="">
          <canvas ref={refXf} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
        <Panel title="H(f)" subtitle="">
          <canvas ref={refHf} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
        <Panel title="Y(f) = X·H" subtitle="απλό γινόμενο">
          <canvas ref={refYf} style={{ height: 90 }} className="block h-[90px] w-full" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί αυτό αλλάζει τα πάντα:</strong> για ένα LTI σύστημα η έξοδος είναι{' '}
        <span className="font-mono">y(t) = x(t) ∗ h(t)</span>. Στη συχνότητα γίνεται απλό
        γινόμενο <span className="font-mono">Y(f) = X(f)·H(f)</span> — και το{' '}
        <span className="font-mono">H(f)</span> είναι ο Fourier transform της κρουστικής
        απόκρισης.
      </div>
    </figure>
  )
}

function SelectorRow({
  label,
  activeId,
  onChange,
  color,
}: {
  label: string
  activeId: SignalId
  onChange: (v: SignalId) => void
  color: 'accent' | 'warn'
}) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="font-mono text-fg-muted">{label}</span>
      <div
        role="radiogroup"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5"
      >
        {SIGNALS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={activeId === s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              activeId === s.id
                ? color === 'warn'
                  ? 'bg-amber-500 text-white'
                  : 'bg-accent text-accent-fg'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-2 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[9px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD = 16

function pickColor(
  colors: ReturnType<typeof getThemeColors>,
  tag: string,
): string {
  if (!colors) return 'rgb(29 78 216)'
  if (tag === '#accent') return colors.accent
  if (tag === '#warn') return colors.warn
  if (tag === '#success') return colors.success
  return colors.fg
}

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fn: (t: number) => number,
  colorTag: string,
  isOutput?: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tMin = -3
  const tMax = 3
  const yLim = isOutput ? 2 : 1.4
  const xt = (t: number) => lerp(t, tMin, tMax, PAD, w - PAD)
  const yv = (v: number) => lerp(v, yLim, -0.5, PAD, h - PAD)
  const yZero = yv(0)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yZero)
  ctx.lineTo(w - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD)
  ctx.lineTo(xt(0), h - PAD)
  ctx.stroke()

  ctx.strokeStyle = pickColor(colors, colorTag)
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = fn(t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fn: (f: number) => number,
  colorTag: string,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fMin = -4
  const fMax = 4
  const yLim = 1.4
  const xt = (f: number) => lerp(f, fMin, fMax, PAD, w - PAD)
  const yv = (v: number) => lerp(v, yLim, -0.5, PAD, h - PAD)
  const yZero = yv(0)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yZero)
  ctx.lineTo(w - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD)
  ctx.lineTo(xt(0), h - PAD)
  ctx.stroke()

  ctx.strokeStyle = pickColor(colors, colorTag)
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 300
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = fn(f)
    const x = xt(f)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}
