'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Rectangular pulse train ↔ sinc envelope spectrum — now adjustable.
 *
 * Top panel:    the periodic pulse (height A, duration τ = d·T₀), and the
 *               partial-sum reconstruction with N harmonics overlaid.
 * Bottom panel: the discrete |a_k| spectrum, with the sinc envelope
 *               drawn underneath as a faint dashed curve.
 *
 * General closed form: a_k = (Aτ/T₀)·sinc(k f₀ τ) = A·d·sinc(k·d), where
 * d = τ/T₀ is the duty cycle and sinc(x) = sin(πx)/(πx). The default
 * d = 0.5, A = 1 is the worked example a_k = ½·sinc(k/2). Dragging d
 * makes the key idea visible: narrower pulse (small d) ⇒ wider sinc
 * (nulls move out) ⇒ more harmonics matter; a_0 = A·d is the average.
 */

const T0 = 1.0
const F0 = 1 / T0
const OMEGA0 = 2 * Math.PI * F0
const K_MAX_DRAW = 21 // how many harmonics to draw in the spectrum

function sinc(x: number) {
  return Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
}

/** a_k = A·d·sinc(k·d), with exact zeros at non-zero integer k·d. */
function ak(k: number, A: number, d: number) {
  if (k === 0) return A * d
  const x = k * d
  if (Math.abs(x - Math.round(x)) < 1e-9) return 0
  return A * d * sinc(x)
}

export function RectangularPulseFourier() {
  const [N, setN] = useState(7)
  const [duty, setDuty] = useState(0.5) // d = τ / T₀
  const [amp, setAmp] = useState(1) // A
  const topRef = useRef<HTMLCanvasElement | null>(null)
  const bottomRef = useRef<HTMLCanvasElement | null>(null)

  const partial = useMemo(() => {
    const ks: number[] = [0]
    for (let k = 1; k <= N; k++) {
      ks.push(k, -k)
    }
    return ks
  }, [N])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (topRef.current) drawPulseAndPartial(topRef.current, colors, partial, amp, duty)
    if (bottomRef.current) drawSpectrum(bottomRef.current, colors, N, amp, duty)
  }, [N, duty, amp, partial])

  const a0 = amp * duty

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Παλμοσειρά → sinc: άλλαξε διάρκεια, πλάτος, αρμονικές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Οι συντελεστές είναι{' '}
        <span className="font-mono">aₖ = (Aτ/T₀)·sinc(k·τ/T₀)</span>. Σύρε τη{' '}
        <strong>duty cycle</strong> <span className="font-mono">τ/T₀</span>: όσο πιο{' '}
        <strong>στενός</strong> ο παλμός, τόσο πιο <strong>πλατύ</strong> το sinc — τα
        μηδενικά απομακρύνονται και χρειάζονται <strong>περισσότερες</strong> αρμονικές.
      </p>

      {/* Live readout: the knobs ↔ the formula */}
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 font-mono tabular-nums">
          a₀ = Aτ/T₀ = <span className="text-accent">{a0.toFixed(2)}</span>
        </span>
        <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 font-mono tabular-nums">
          1ο μηδέν sinc στο f = 1/τ = <span className="text-accent">{(1 / duty).toFixed(1)}</span>·f₀
        </span>
      </div>

      <Panel title="Στον χρόνο" subtitle="πραγματικό σήμα + μερικό άθροισμα">
        <canvas
          ref={topRef}
          style={{ height: 180 }}
          className="block h-[180px] w-full"
          aria-label="Pulse train and partial sum"
        />
      </Panel>

      <div className="mt-3" />

      <Panel title="|aₖ| με την περιβάλλουσα sinc" subtitle="ενεργές αρμονικές χρωματίζονται">
        <canvas
          ref={bottomRef}
          style={{ height: 160 }}
          className="block h-[160px] w-full"
          aria-label="Discrete spectrum with sinc envelope"
        />
      </Panel>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs text-fg-muted">
            duty cycle τ/T₀ ={' '}
            <span className="font-mono text-fg tabular-nums">{duty.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={duty}
            onChange={(e) => setDuty(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Duty cycle τ/T₀"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            πλάτος A ={' '}
            <span className="font-mono text-fg tabular-nums">{amp.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.25}
            value={amp}
            onChange={(e) => setAmp(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Πλάτος A"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            αρμονικές N ={' '}
            <span className="font-mono text-fg tabular-nums">{N}</span>
            <span className="ml-1 text-fg-subtle">(±k)</span>
          </label>
          <input
            type="range"
            min={0}
            max={K_MAX_DRAW}
            step={1}
            value={N}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Number of harmonics N"
          />
        </div>
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

const PAD_X = 28
const PAD_Y = 14

function pulseValue(t: number, A: number, d: number) {
  // Pulse of height A, width τ = d·T₀, centred at multiples of T₀.
  const tw = (((t + T0 / 2) % T0) + T0) % T0 - T0 / 2 // wrap to (-T0/2, T0/2]
  return Math.abs(tw) < (d * T0) / 2 ? A : 0
}

function drawPulseAndPartial(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ks: number[],
  A: number,
  d: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tStart = -1.5 * T0
  const tEnd = 1.5 * T0
  const yLim = Math.max(A * 1.3, 0.6)

  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.3 * yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // pulse train (true signal) drawn as a step curve.
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.5
  ctx.beginPath()
  let lastY = yv(pulseValue(tStart, A, d))
  ctx.moveTo(PAD_X, lastY)
  const steps = 600
  for (let i = 1; i <= steps; i++) {
    const t = lerp(i, 0, steps, tStart, tEnd)
    const v = pulseValue(t, A, d)
    const x = xt(t)
    const y = yv(v)
    if (Math.abs(y - lastY) > 0.5) {
      ctx.lineTo(x, lastY)
    }
    ctx.lineTo(x, y)
    lastY = y
  }
  ctx.stroke()

  // partial sum.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, tStart, tEnd)
    let s = 0
    for (const k of ks) {
      s += ak(k, A, d) * Math.cos(k * OMEGA0 * t) // a_k real & even ⇒ synthesis = Σ a_k cos(...)
    }
    const x = xt(t)
    const y = yv(s)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(A.toFixed(1), PAD_X - 3, yv(A) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
  ctx.textAlign = 'center'
  ctx.fillText('−T₀', xt(-T0), h - 1)
  ctx.fillText('0', xt(0), h - 1)
  ctx.fillText('+T₀', xt(T0), h - 1)

  // legend
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('— πραγματικό σήμα', PAD_X + 6, PAD_Y + 12)
  ctx.fillStyle = colors.accent
  ctx.fillText('— μερικό άθροισμα', PAD_X + 6, PAD_Y + 26)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  N: number,
  A: number,
  d: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = (K_MAX_DRAW + 1) * F0
  const fMin = -fMax
  const a0 = A * d
  const yMax = Math.max(a0 * 1.15, 0.12)

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.08 * yMax, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
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

  // sinc envelope (continuous): |A·d·sinc((f/f₀)·d)|.
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 400
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const env = Math.abs(a0 * sinc((f / F0) * d))
    const xPx = xt(f)
    const yPx = yv(env)
    if (i === 0) ctx.moveTo(xPx, yPx)
    else ctx.lineTo(xPx, yPx)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // discrete lines
  for (let k = -K_MAX_DRAW; k <= K_MAX_DRAW; k++) {
    const a = Math.abs(ak(k, A, d))
    if (a < 1e-9) continue
    const f = k * F0
    const x = xt(f)
    const y = yv(a)
    const active = Math.abs(k) <= N
    ctx.strokeStyle = active ? colors.accent : colors.border
    ctx.lineWidth = active ? 2 : 1.5
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fillStyle = active ? colors.accent : colors.fgMuted
    ctx.beginPath()
    ctx.arc(x, y, active ? 3 : 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const kf of [-6, -4, -2, 0, 2, 4, 6]) {
    const x = xt(kf * F0)
    ctx.fillText(`${kf}f₀`, x, h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText(a0.toFixed(2), PAD_X - 3, yv(a0) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // legend
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('· · ·  περιβάλλουσα (Aτ/T₀)|sinc(fτ)|', PAD_X + 6, PAD_Y + 12)
}
