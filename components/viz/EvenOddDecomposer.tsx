'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

const X_RANGE: [number, number] = [-3, 3]

type SignalKey = 'cos' | 'sin' | 'expU' | 'sawU' | 'shifted'

const SIGNALS: { id: SignalKey; label: string; fn: (t: number) => number; note: string }[] =
  [
    {
      id: 'cos',
      label: 'cos(t)',
      fn: (t) => Math.cos(t),
      note: 'Καθαρά άρτιο: cos(−t) = cos(t).',
    },
    {
      id: 'sin',
      label: 'sin(t)',
      fn: (t) => Math.sin(t),
      note: 'Καθαρά περιττό: sin(−t) = −sin(t).',
    },
    {
      id: 'expU',
      label: 'e^(−t)·u(t)',
      fn: (t) => (t >= 0 ? Math.exp(-t) : 0),
      note: 'Ένα αιτιατό σήμα. Σπάει σε άρτιο + περιττό κομμάτι σχεδόν ισόποσα.',
    },
    {
      id: 'sawU',
      label: 't·u(t)',
      fn: (t) => (t >= 0 ? t : 0),
      note: 'Ράμπα από το 0 και μετά. Άρτιο μέρος = |t|/2, περιττό = t/2.',
    },
    {
      id: 'shifted',
      label: 'cos(t − 1)',
      fn: (t) => Math.cos(t - 1),
      note: 'Μετατοπισμένο cosine — ούτε άρτιο ούτε περιττό σκέτο.',
    },
  ]

export function EvenOddDecomposer() {
  const [key, setKey] = useState<SignalKey>('expU')
  const xRef = useRef<HTMLCanvasElement | null>(null)
  const eRef = useRef<HTMLCanvasElement | null>(null)
  const oRef = useRef<HTMLCanvasElement | null>(null)
  const sig = SIGNALS.find((s) => s.id === key)!

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (xRef.current) drawCurve(xRef.current, colors, sig.fn, 'x(t)', colors.accent)
    if (eRef.current)
      drawCurve(
        eRef.current,
        colors,
        (t) => 0.5 * (sig.fn(t) + sig.fn(-t)),
        'xₑ(t) = (x(t) + x(−t)) / 2',
        colors.success,
      )
    if (oRef.current)
      drawCurve(
        oRef.current,
        colors,
        (t) => 0.5 * (sig.fn(t) - sig.fn(-t)),
        'xₒ(t) = (x(t) − x(−t)) / 2',
        colors.warn,
      )
  }, [sig])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Κάθε σήμα σπάει σε άρτιο + περιττό
        </h4>
        <div
          role="radiogroup"
          aria-label="Επιλογή σήματος"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {SIGNALS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={key === s.id}
              onClick={() => setKey(s.id)}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                key === s.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Panel title="x(t)" canvasRef={xRef} ariaLabel="Original signal" />
        <Panel title="Άρτιο μέρος" canvasRef={eRef} ariaLabel="Even part" />
        <Panel title="Περιττό μέρος" canvasRef={oRef} ariaLabel="Odd part" />
      </div>

      <p className="mt-3 text-xs text-fg-muted">{sig.note}</p>
    </figure>
  )
}

function Panel({
  title,
  canvasRef,
  ariaLabel,
}: {
  title: string
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  ariaLabel: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight">
        {title}
      </div>
      <canvas
        ref={canvasRef}
        style={{ height: 130 }}
        className="block h-[130px] w-full"
        aria-label={ariaLabel}
      />
    </div>
  )
}

function drawCurve(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fn: (t: number) => number,
  label: string,
  color: string,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 14
  const padY = 12

  // Sample.
  const N = w * 2
  const ys = new Float64Array(N)
  let yMin = Infinity
  let yMax = -Infinity
  for (let i = 0; i < N; i++) {
    const t = lerp(i, 0, N - 1, X_RANGE[0], X_RANGE[1])
    const v = fn(t)
    ys[i] = v
    if (Number.isFinite(v)) {
      if (v < yMin) yMin = v
      if (v > yMax) yMax = v
    }
  }
  if (!Number.isFinite(yMin)) yMin = -1
  if (!Number.isFinite(yMax)) yMax = 1
  const range = Math.max(0.5, yMax - yMin)
  const yLo = yMin - range * 0.15
  const yHi = yMax + range * 0.15

  const px = (x: number) => lerp(x, X_RANGE[0], X_RANGE[1], padX, w - padX)
  const py = (y: number) => lerp(y, yHi, yLo, padY, h - padY)

  // Axes.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  if (yLo <= 0 && yHi >= 0) {
    const y0 = py(0)
    ctx.beginPath()
    ctx.moveTo(padX, y0)
    ctx.lineTo(w - padX, y0)
    ctx.stroke()
  }
  const x0 = px(0)
  ctx.beginPath()
  ctx.moveTo(x0, padY)
  ctx.lineTo(x0, h - padY)
  ctx.stroke()

  // Curve.
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false
  let prevY = NaN
  for (let i = 0; i < N; i++) {
    const t = lerp(i, 0, N - 1, X_RANGE[0], X_RANGE[1])
    const v = ys[i]
    if (!Number.isFinite(v)) {
      started = false
      continue
    }
    const x = px(t)
    const y = py(v)
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else if (Number.isFinite(prevY) && Math.abs(y - prevY) > h * 0.6) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    prevY = y
  }
  ctx.stroke()

  // Equation label.
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, padX, padY + 9)
}
