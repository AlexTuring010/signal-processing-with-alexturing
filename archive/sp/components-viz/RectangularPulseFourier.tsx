'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Rectangular pulse train ↔ sinc envelope spectrum.
 *
 * Top panel:    the periodic pulse (50% duty), and the partial-sum
 *               reconstruction with N harmonics overlaid.
 * Bottom panel: the discrete |a_k| spectrum, with the sinc envelope
 *               drawn underneath as a faint dashed curve. As the user
 *               increases N, the spectrum lines that contribute to
 *               the partial sum highlight.
 *
 * Closed form: a_k = ½·sinc(k/2), where sinc(x) = sin(πx)/(πx).
 * (For k=0, sinc(0)=1, so a_0 = 1/2.)
 */

const T0 = 1.0
const F0 = 1 / T0
const OMEGA0 = 2 * Math.PI * F0
const K_MAX_DRAW = 21 // how many harmonics to draw in the spectrum

function ak(k: number) {
  if (k === 0) return 0.5
  const x = k / 2
  if (Math.abs(x - Math.round(x)) < 1e-9 && Math.round(x) !== 0) return 0
  return 0.5 * (Math.sin(Math.PI * x) / (Math.PI * x))
}

export function RectangularPulseFourier() {
  const [N, setN] = useState(7)
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
    if (topRef.current) drawPulseAndPartial(topRef.current, colors, partial)
    if (bottomRef.current) drawSpectrum(bottomRef.current, colors, N)
  }, [N, partial])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Τετραγωνικός παλμός 50% — οι συντελεστές γίνονται sinc
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <span className="font-mono">|aₖ| = ½·|sinc(k/2)|</span>: μηδενίζεται
        στους άρτιους <em>k ≠ 0</em>, και φθίνει σαν 1/k στους περιττούς.
        Σύρε το <em>N</em> για να δεις πόσες αρμονικές χρειάζονται για να
        χτιστεί το ορθογώνιο.
      </p>

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

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Αρμονικές N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          <span className="ml-2 text-fg-subtle">(±k μέχρι N)</span>
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

function pulseValue(t: number) {
  // x(t) = 1 for |t mod T0 - T0/2| > T0/4 ... ugh let's keep the
  // centred version: pulse is 1 for |t| < T0/4, 0 for T0/4 < |t| < T0/2.
  // Periodically extend.
  const tw = ((t + T0 / 2) % T0 + T0) % T0 - T0 / 2 // wrap to (-T0/2, T0/2]
  return Math.abs(tw) < T0 / 4 ? 1 : 0
}

function drawPulseAndPartial(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ks: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tStart = -1.5 * T0
  const tEnd = 1.5 * T0
  const yLim = 1.4

  // axes
  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.3, PAD_Y, h - PAD_Y)
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
  let lastY = yv(pulseValue(tStart))
  ctx.moveTo(PAD_X, lastY)
  const steps = 600
  for (let i = 1; i <= steps; i++) {
    const t = lerp(i, 0, steps, tStart, tEnd)
    const v = pulseValue(t)
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
      const a = ak(k)
      s += a * Math.cos(k * OMEGA0 * t) // a_k is real (and a_{-k} = a_k), so synthesis = Σ a_k cos(...)
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
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
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
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = (K_MAX_DRAW + 1) * F0
  const fMin = -fMax
  const yMax = 0.6

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.05, PAD_Y, h - PAD_Y)
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

  // sinc envelope (continuous), drawn as |½·sinc(f / (2 f₀))|.
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 400
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = f / (2 * F0)
    const env = Math.abs(0.5 * (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)))
    const xPx = xt(f)
    const yPx = yv(env)
    if (i === 0) ctx.moveTo(xPx, yPx)
    else ctx.lineTo(xPx, yPx)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // discrete lines
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let k = -K_MAX_DRAW; k <= K_MAX_DRAW; k++) {
    const a = Math.abs(ak(k))
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
  ctx.textAlign = 'center'
  for (const kf of [-6, -4, -2, 0, 2, 4, 6]) {
    const x = xt(kf * F0)
    ctx.fillText(`${kf}f₀`, x, h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText('0.5', PAD_X - 3, yv(0.5) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // legend
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('· · ·  περιβάλλουσα ½|sinc(f/2f₀)|', PAD_X + 6, PAD_Y + 12)
}
