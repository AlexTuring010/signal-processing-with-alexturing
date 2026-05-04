'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const F_MIN = 0.5
const F_MAX = 8
const T_END = 2.0

export function CosineExplorer() {
  const [A, setA] = useState(1)
  const [f, setF] = useState(2)
  const [phi, setPhi] = useState(0)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    const t = timeRef.current
    const fr = freqRef.current
    if (t) drawTime(t, colors, A, f, phi)
    if (fr) drawFreq(fr, colors, A, f)
  }, [A, f, phi])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        x(t) = A · cos(2π f · t + φ)
      </h4>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
          <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight">
            Στον χρόνο
          </div>
          <canvas
            ref={timeRef}
            style={{ height: 160 }}
            className="block h-[160px] w-full"
            aria-label="Cosine in time domain"
          />
        </div>
        <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
          <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight">
            Στη συχνότητα · |X(f)|
          </div>
          <canvas
            ref={freqRef}
            style={{ height: 160 }}
            className="block h-[160px] w-full"
            aria-label="Cosine spectrum (two impulses at ±f)"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Slider
          label="A — πλάτος"
          value={A}
          min={0}
          max={2}
          step={0.05}
          onChange={setA}
          format={(v) => v.toFixed(2)}
        />
        <Slider
          label="f — συχνότητα (Hz)"
          value={f}
          min={F_MIN}
          max={F_MAX}
          step={0.1}
          onChange={setF}
          format={(v) => `${v.toFixed(1)} Hz`}
        />
        <Slider
          label="φ — φάση (rad)"
          value={phi}
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 24}
          onChange={setPhi}
          format={(v) => `${(v / Math.PI).toFixed(2)} π`}
        />
      </div>

      <div className="mt-2 rounded-md border border-emerald-400/40 bg-emerald-50/40 px-3 py-1.5 text-xs text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
        <span className="font-medium">Ισοδύναμη χρονική ολίσθηση:</span>{' '}
        <span className="font-mono tabular-nums">
          Δt = −φ / (2π f) = {(-phi / (2 * Math.PI * f)).toFixed(3)} s
        </span>
        <span className="ml-2 text-emerald-600/80 dark:text-emerald-300/70">
          (το ίδιο cosine αλλά μετατοπισμένο σε χρόνο — δες §4a.5 παρακάτω)
        </span>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Πρόσεξε ότι η <em>συχνότητα</em> και η <em>φάση</em> δεν αλλάζουν την
        εικόνα στη συχνότητα τόσο εμφανώς όσο στον χρόνο: το{' '}
        <code className="font-mono">|X(f)|</code> δείχνει μόνο{' '}
        <strong>ένα ζευγάρι από καρφιά</strong> στα ±f, ύψους A/2. Η φάση
        κρύβεται στο μιγαδικό μέρος του spectrum — αυτό θα το δούμε όταν
        φτάσουμε στο Fourier transform.
      </p>
    </figure>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-[rgb(var(--accent))]"
      />
    </label>
  )
}

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  A: number,
  f: number,
  phi: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 22
  const padY = 12

  // Axes.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h / 2)
  ctx.lineTo(w - padX, h / 2)
  ctx.stroke()

  // Plot range: y in [-2, 2] so the slider's 0..2 doesn't cause scale jitter.
  const yMax = 2
  const xt = (t: number) => lerp(t, 0, T_END, padX, w - padX)
  const yv = (v: number) => lerp(v, yMax, -yMax, padY, h - padY)

  // Reference labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', padX - 2, yv(1) + 3)
  ctx.fillText('−1', padX - 2, yv(-1) + 3)
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 2)
  ctx.fillText(`${T_END}s`, w - padX, h - 2)

  // Curve.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = w * 2
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T_END)
    const v = A * Math.cos(2 * Math.PI * f * t + phi)
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
  A: number,
  f: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 26
  const padY = 14

  // X-axis spans -F_MAX-1 .. F_MAX+1 so spikes never touch edges.
  const xMin = -(F_MAX + 1)
  const xMax = F_MAX + 1

  // Axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h - padY)
  ctx.lineTo(w - padX, h - padY)
  ctx.stroke()

  // X labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fx of [-8, -4, 0, 4, 8]) {
    const x = lerp(fx, xMin, xMax, padX, w - padX)
    ctx.fillText(`${fx}`, x, h - 2)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(x, padY)
    ctx.lineTo(x, h - padY)
    ctx.stroke()
  }

  // Two impulses at ±f, height A/2.
  const yBase = h - padY
  const yPeak = padY
  const heightFraction = Math.min(1, A / 2)
  const drawSpike = (fx: number) => {
    const x = lerp(fx, xMin, xMax, padX, w - padX)
    const y = lerp(heightFraction, 0, 1, yBase, yPeak)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, yBase)
    ctx.lineTo(x, y)
    ctx.stroke()
    // Arrow tip.
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.lineTo(x - 4, y + 1)
    ctx.lineTo(x + 4, y + 1)
    ctx.closePath()
    ctx.fill()
    // Label.
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('A/2', x, y - 8)
  }
  drawSpike(f)
  drawSpike(-f)

  // Hz axis label.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f (Hz)', w - padX, padY + 2)
}
