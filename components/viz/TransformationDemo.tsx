'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * One-knob transformation visualizer for /foundations/signals §4.5.
 * Modes:
 *   - "scale":      A · x(t)        slider on A
 *   - "shift":      x(t − t₀)       slider on t₀
 *   - "flip":       x(−t)           toggle (no slider)
 *   - "time-scale": x(a · t)        slider on a — uses a cosine instead of
 *                                   the asymmetric base so frequency change reads
 *
 * Base signal (for scale / shift / flip): right-leaning triangle of height 1,
 * peak at t = 1, base [0, 2] — asymmetric so flips/shifts are obvious.
 */

type Mode = 'scale' | 'shift' | 'flip' | 'time-scale'
type Props = { mode: Mode }

const X_MIN = -3
const X_MAX = 5
const Y_MIN = -1.4
const Y_MAX = 1.4

/** Triangle of height 1, base [0, 2], peak at t=1. */
const tri = (t: number) => Math.max(0, 1 - Math.abs(t - 1))
/** Gated 1-Hz cosine for the time-scale demo. */
const cosBase = (t: number) => (t >= -2 && t <= 2 ? Math.cos(2 * Math.PI * t) : 0)

export function TransformationDemo({ mode }: Props) {
  const [A, setA] = useState(1)
  const [t0, setT0] = useState(0)
  const [flipped, setFlipped] = useState(true)
  const [a, setLetterA] = useState(1)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Pick original/transformed based on mode + current state.
  const ui = useMemo(() => {
    switch (mode) {
      case 'scale':
        return {
          title: 'A · x(t) — amplitude scaling',
          readout: `A = ${A.toFixed(2)}`,
          helper:
            'A > 1 ψηλαίνει, 0 < A < 1 χαμηλώνει, A < 0 αναποδογυρίζει γύρω από τον x-άξονα.',
          original: tri,
          transformed: (t: number) => A * tri(t),
        }
      case 'shift':
        return {
          title: 'x(t − t₀) — time shift',
          readout: `t₀ = ${t0 >= 0 ? '+' : ''}${t0.toFixed(2)}`,
          helper:
            't₀ > 0 → ολίσθηση δεξιά (καθυστέρηση). t₀ < 0 → αριστερά. Μνημονικό: το σήμα κάθεται εκεί όπου το όρισμα γίνεται 0.',
          original: tri,
          transformed: (t: number) => tri(t - t0),
        }
      case 'flip':
        return {
          title: 'x(−t) — time reversal',
          readout: flipped ? 'flipped — x(−t)' : 'original — x(t)',
          helper:
            'Καθρεφτίζεται γύρω από τον y-άξονα. Άρτια σήματα (cosine) μένουν ίδια· περιττά (sine) αλλάζουν πρόσημο.',
          original: tri,
          transformed: (t: number) => (flipped ? tri(-t) : tri(t)),
        }
      case 'time-scale':
        return {
          title: 'x(a · t) — time scaling',
          readout: `a = ${a.toFixed(2)}`,
          helper:
            '|a| > 1 → συμπίεση στον χρόνο (αύξηση συχνότητας). |a| < 1 → επέκταση. a < 0 προσθέτει flip.',
          original: cosBase,
          transformed: (t: number) => cosBase(a * t),
        }
    }
  }, [mode, A, t0, flipped, a])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, ui)
  }, [ui])

  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h5 className="text-sm font-semibold tracking-tight">{ui.title}</h5>
        <span className="font-mono text-xs text-fg-muted tabular-nums">{ui.readout}</span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ height: 160 }}
        className="block h-[160px] w-full rounded-sm border border-border bg-bg-soft/40"
        aria-label={ui.title}
      />

      {mode === 'flip' ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              flipped
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:text-fg',
            )}
            aria-pressed={flipped}
          >
            {flipped ? 'Flipped — x(−t)' : 'Original — x(t)'}
          </button>
          <span className="text-xs text-fg-muted">{ui.helper}</span>
        </div>
      ) : (
        <div className="mt-2">
          {mode === 'scale' && (
            <input
              type="range"
              min={-2}
              max={2}
              step={0.05}
              value={A}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
              aria-label="A"
            />
          )}
          {mode === 'shift' && (
            <input
              type="range"
              min={-2}
              max={3}
              step={0.05}
              value={t0}
              onChange={(e) => setT0(parseFloat(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
              aria-label="t₀"
            />
          )}
          {mode === 'time-scale' && (
            <input
              type="range"
              min={-3}
              max={3}
              step={0.05}
              value={a}
              onChange={(e) => setLetterA(parseFloat(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
              aria-label="a"
            />
          )}
          <p className="mt-1 text-xs text-fg-muted">{ui.helper}</p>
        </div>
      )}
    </figure>
  )
}

/* --------------------------- drawing --------------------------- */

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ui: {
    original: (t: number) => number
    transformed: (t: number) => number
  },
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padX = 18
  const padY = 12
  const xOf = (t: number) => lerp(t, X_MIN, X_MAX, padX, w - padX)
  const yOf = (v: number) => lerp(v, Y_MAX, Y_MIN, padY, h - padY)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  const yZero = yOf(0)
  ctx.beginPath()
  ctx.moveTo(padX, yZero)
  ctx.lineTo(w - padX, yZero)
  ctx.stroke()
  const xZero = xOf(0)
  ctx.beginPath()
  ctx.moveTo(xZero, padY)
  ctx.lineTo(xZero, h - padY)
  ctx.stroke()

  // X tick labels at integers
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = Math.ceil(X_MIN); t <= Math.floor(X_MAX); t++) {
    if (t === 0) continue
    ctx.fillText(String(t), xOf(t), yZero + 12)
  }
  ctx.fillText('0', xOf(0) + 5, yZero + 12)

  // Y reference lines at ±1
  ctx.save()
  ctx.setLineDash([2, 3])
  ctx.strokeStyle = colors.border
  for (const v of [1, -1]) {
    const y = yOf(v)
    ctx.beginPath()
    ctx.moveTo(padX, y)
    ctx.lineTo(w - padX, y)
    ctx.stroke()
  }
  ctx.restore()

  // Original (faint dashed)
  drawCurve(ctx, ui.original, xOf, yOf, w, padX, colors.fgMuted, 1.5, true)
  // Transformed (solid accent)
  drawCurve(ctx, ui.transformed, xOf, yOf, w, padX, colors.accent, 2.2, false)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('— x(t) (αρχικό)', padX + 4, padY + 9)
  ctx.fillStyle = colors.accent
  ctx.fillText('— μετασχηματισμένο', padX + 4, padY + 22)
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  fn: (t: number) => number,
  xOf: (t: number) => number,
  yOf: (v: number) => number,
  w: number,
  padX: number,
  color: string,
  width: number,
  dashed: boolean,
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  if (dashed) ctx.setLineDash([4, 3])
  ctx.beginPath()
  const N = (w - 2 * padX) * 2
  let prevY = NaN
  let pen = false
  for (let i = 0; i <= N; i++) {
    const t = lerp(i, 0, N, X_MIN, X_MAX)
    const v = fn(t)
    if (!Number.isFinite(v)) {
      pen = false
      continue
    }
    const x = xOf(t)
    const y = yOf(Math.max(Y_MIN, Math.min(Y_MAX, v)))
    if (!pen) {
      ctx.moveTo(x, y)
      pen = true
    } else if (Number.isFinite(prevY) && Math.abs(y - prevY) > 200) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    prevY = y
  }
  ctx.stroke()
  ctx.restore()
}
