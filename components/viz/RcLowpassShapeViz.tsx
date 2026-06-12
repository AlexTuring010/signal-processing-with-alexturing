'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * RC first-order lowpass in BOTH domains — left: impulse response
 * h(t) = (1/RC)·e^(−t/RC)·u(t) (causal decaying exponential, time constant τ=RC);
 * right: |H(f)|² = 1/(1+(f/f_c)²) (monotonic, ripple-free) against an ideal brick
 * wall of the same f_c.
 *
 * Two teaching points: (1) the response is a smooth exponential ↔ a monotonic
 * Lorentzian — NOT the rippled truncated-sinc real filter of §5/§7; (2) the
 * time–frequency reciprocity: small RC = fast decay = wide bandwidth.
 *
 * Slider = f_c (= 1/(2πRC)); both panels update together.
 */

const F_MAX = 4
const STEPS = 360
const T_NEG = -0.35
const T_POS = 1.9
const PAD = 24

const IDEAL_C = 'rgb(29, 78, 216)' // accent blue — ideal brick wall
const RC_C = 'rgb(16, 185, 129)' // emerald — the RC curves
const HALF_C = 'rgb(217, 119, 6)' // amber — τ and the −3 dB / half-power markers

function getRGB(c: string): string {
  const m = c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  return m ? `${m[1]}, ${m[2]}, ${m[3]}` : '16, 185, 129'
}

export function RcLowpassShapeViz() {
  const [fc, setFc] = useState(1.0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, fc)
  }, [fc])

  const rc = 1 / (2 * Math.PI * fc)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Το RC σε δύο όψεις — h(t) στον χρόνο, |H(f)|² στη συχνότητα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά η κρουστική απόκριση{' '}
        <span className="font-mono">h(t) = (1/RC)·e^(−t/RC)·u(t)</span>: φθίνον εκθετικό
        που ξεκινά στο <span className="font-mono">t = 0</span> (αιτιατό) και σβήνει με
        σταθερά χρόνου <span className="font-mono">τ = RC</span>. Δεξιά το{' '}
        <span className="font-mono">|H(f)|²</span> — μονότονο, χωρίς ripple, με το{' '}
        <span style={{ color: HALF_C }} className="font-medium">
          −3 dB
        </span>{' '}
        στο <span className="font-mono">f_c</span>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 210 }}
        className="block h-[210px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="RC impulse response h(t) on the left and |H(f)|^2 on the right"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f_c = <span className="font-mono text-fg tabular-nums">{fc.toFixed(2)}</span>
          <span className="ml-2 text-fg-subtle">
            (τ = RC = 1/(2π f_c) = {rc.toFixed(3)})
          </span>
        </label>
        <input
          type="range"
          min={0.5}
          max={1.6}
          step={0.02}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Cutoff frequency f_c"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Αμοιβαιότητα χρόνου–συχνότητας: μικρό <span className="font-mono">RC</span> =
        γρήγορο σβήσιμο = ευρύ <span className="font-mono">|H|²</span>. Το σχήμα είναι
        πραγματικού φίλτρου — αλλά <strong>μονότονο</strong>, όχι το rippled
        truncated-sinc των §5/§7.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fc: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const split = w / 2
  drawTime(ctx, colors, 0, 0, split, h, fc)
  drawFreq(ctx, colors, split, 0, w - split, h, fc)
}

function drawTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fc: number,
) {
  if (!colors) return
  const RC = 1 / (2 * Math.PI * fc)
  const yLim = 1.15
  const xt = (t: number) => lerp(t, T_NEG, T_POS, x0 + PAD + 8, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -0.04, y0 + PAD + 14, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('h(t) — αιτιατό εκθετικό', x0 + PAD + 8, y0 + 13)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD + 8, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 8)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // fill under the exponential
  ctx.fillStyle = `rgba(${getRGB(RC_C)}, 0.15)`
  ctx.beginPath()
  ctx.moveTo(xt(0), yZero)
  ctx.lineTo(xt(0), yv(1))
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, 0, T_POS)
    ctx.lineTo(xt(t), yv(Math.exp(-t / RC)))
  }
  ctx.lineTo(xt(T_POS), yZero)
  ctx.closePath()
  ctx.fill()

  // curve: flat 0 for t<0, jump at t=0, exponential after
  ctx.strokeStyle = RC_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xt(T_NEG), yZero)
  ctx.lineTo(xt(0), yZero)
  ctx.lineTo(xt(0), yv(1))
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, 0, T_POS)
    ctx.lineTo(xt(t), yv(Math.exp(-t / RC)))
  }
  ctx.stroke()

  // τ = RC marker (curve at 1/e of its peak)
  const ytau = yv(Math.exp(-1))
  ctx.strokeStyle = HALF_C
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(RC), yZero)
  ctx.lineTo(xt(RC), ytau)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = HALF_C
  ctx.beginPath()
  ctx.arc(xt(RC), ytau, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('τ=RC', xt(RC), ytau - 5)

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('h(0⁺)=1/RC', xt(0) - 4, yv(1) + 3)
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 11)
}

function drawFreq(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fc: number,
) {
  if (!colors) return
  const yLim = 1.18
  const xf = (f: number) => lerp(f, -F_MAX, F_MAX, x0 + PAD + 4, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -0.04, y0 + PAD + 14, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|H(f)|² — μονότονο', x0 + PAD + 4, y0 + 13)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD + 4, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xf(0), y0 + PAD + 8)
  ctx.lineTo(xf(0), y0 + ph - PAD)
  ctx.stroke()

  // half-power line
  ctx.strokeStyle = HALF_C
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD + 4, yv(0.5))
  ctx.lineTo(x0 + pw - PAD, yv(0.5))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = HALF_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('½', x0 + PAD + 6, yv(0.5) - 3)

  // ideal brick wall (same f_c) dashed
  ctx.strokeStyle = IDEAL_C
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(xf(-F_MAX), yZero)
  ctx.lineTo(xf(-fc), yZero)
  ctx.lineTo(xf(-fc), yv(1))
  ctx.lineTo(xf(fc), yv(1))
  ctx.lineTo(xf(fc), yZero)
  ctx.lineTo(xf(F_MAX), yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // RC |H|²
  const hsq = (f: number) => 1 / (1 + (f / fc) ** 2)
  ctx.fillStyle = `rgba(${getRGB(RC_C)}, 0.16)`
  ctx.beginPath()
  ctx.moveTo(xf(-F_MAX), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    ctx.lineTo(xf(f), yv(hsq(f)))
  }
  ctx.lineTo(xf(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = RC_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const py = yv(hsq(f))
    if (i === 0) ctx.moveTo(xf(f), py)
    else ctx.lineTo(xf(f), py)
  }
  ctx.stroke()

  // ±f_c markers (half-power crossings)
  for (const sign of [1, -1]) {
    const fx = xf(sign * fc)
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 2])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(fx, yv(0.5))
    ctx.lineTo(fx, yZero)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = HALF_C
    ctx.beginPath()
    ctx.arc(fx, yv(0.5), 3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xf(fc), yZero + 11)
  ctx.fillText('−f_c', xf(-fc), yZero + 11)
}
