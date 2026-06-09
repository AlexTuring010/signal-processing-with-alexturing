'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getThemeColors, type ThemeColors } from '@/lib/canvas'

/**
 * Autocorrelation of the time-limited sine — the on-page graph for §10f
 * (Άσκηση 6, slide 45): x(t) = sin(2πt) on [0,2], zero elsewhere.
 *
 * The slide only shows the result as a plot; this renders that plot ON the
 * page so the student never has to go look at the slide. Two stacked panels,
 * driven by one τ slider:
 *
 *   Top    — x(t) (blue) and the sliding copy x(t−τ) (amber), with the overlap
 *            region shaded. As τ grows the overlap shrinks linearly: that is
 *            literally where the triangular envelope comes from.
 *   Bottom — R_x(τ) over [−2,2], the exact closed form
 *              R_x(τ) = (2−|τ|)/2 · cos(2πτ) + 1/(4π) · sin(2π|τ|),
 *            drawn inside its dashed triangular envelope ±(2−|τ|)/2, with a
 *            marker at the current τ, the peak R_x(0)=E_x=1 and the zeros at
 *            τ=±2 labelled.
 *
 * The whole point: the marker stays pinned inside the triangle as it traces a
 * cosine — envelope × oscillation, exactly the shape exams ask you to draw.
 */

const T_MIN = -2.3
const T_MAX = 4.3
const TAU_LIM = 2 // support half-width: signal lives on [0,2]
const TAU_VIEW = 2.3 // x-extent of the R_x panel

const COL = {
  x: '#3b82f6', // x(t)
  shift: '#f59e0b', // x(t−τ)
  curve: '#7c3aed', // R_x(τ)
  marker: '#ef4444', // current τ
  env: '#10b981', // triangular envelope
}

const xSig = (t: number) => (t >= 0 && t <= 2 ? Math.sin(2 * Math.PI * t) : 0)

// exact autocorrelation, closed form (see §10f derivation)
function rx(tau: number): number {
  const a = Math.abs(tau)
  if (a > TAU_LIM) return 0
  return ((2 - a) / 2) * Math.cos(2 * Math.PI * tau) + (1 / (4 * Math.PI)) * Math.sin(2 * Math.PI * a)
}
const envOf = (tau: number) => (Math.abs(tau) > TAU_LIM ? 0 : (2 - Math.abs(tau)) / 2)

export function LimitedSinAutocorrelationViz() {
  const [tau, setTau] = useState(0.5)
  const signalsRef = useRef<HTMLCanvasElement | null>(null)
  const corrRef = useRef<HTMLCanvasElement | null>(null)

  const paint = useCallback(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (signalsRef.current) drawSignals(signalsRef.current, colors, tau)
    if (corrRef.current) drawCorr(corrRef.current, colors, tau)
  }, [tau])

  useEffect(() => {
    paint()
  }, [paint])

  useEffect(() => {
    const onResize = () => paint()
    window.addEventListener('resize', onResize)
    const obs = new MutationObserver(() => paint())
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })
    return () => {
      window.removeEventListener('resize', onResize)
      obs.disconnect()
    }
  }, [paint])

  const overlap = Math.max(0, 2 - Math.abs(tau))

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        R<sub>x</sub>(τ) του περιορισμένου sin — η απάντηση, ζωντανά
      </h4>
      <p className="mb-3 text-xs leading-relaxed text-fg-muted">
        Σύρε το <span className="font-mono">τ</span>. <span style={{ color: COL.x }}>Πάνω</span>: τα
        δύο αντίγραφα <span className="font-mono">x(t)</span> και{' '}
        <span className="font-mono">x(t−τ)</span> — η σκιασμένη <strong>επικάλυψη</strong> μικραίνει
        γραμμικά καθώς απομακρύνεσαι από το μηδέν. Κάτω: η{' '}
        <span style={{ color: COL.curve }} className="font-semibold">
          R<sub>x</sub>(τ)
        </span>{' '}
        χτίζεται μέσα στον <span style={{ color: COL.env }}>τριγωνικό φάκελο</span> που φτιάχνει
        ακριβώς αυτή η επικάλυψη.
      </p>

      <div className="mb-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          Ολίσθηση τ ={' '}
          <span className="font-mono tabular-nums text-fg">{tau.toFixed(2)}</span>
          <span className="ml-3">
            επικάλυψη ={' '}
            <span className="font-mono tabular-nums text-fg">{overlap.toFixed(2)}</span>
          </span>
          <span className="ml-3">
            R<sub>x</sub>(τ) ={' '}
            <span className="font-mono tabular-nums" style={{ color: COL.curve }}>
              {rx(tau).toFixed(3)}
            </span>
          </span>
        </label>
        <input
          type="range"
          min={-TAU_LIM}
          max={TAU_LIM}
          step={0.02}
          value={tau}
          onChange={(e) => setTau(Number(e.target.value))}
          className="mt-2 w-full"
          style={{ accentColor: COL.marker }}
          aria-label="Ολίσθηση τ"
        />
      </div>

      <div className="rounded-md border border-border bg-bg p-2">
        <div className="mb-1 px-1 text-[11px] font-semibold tracking-tight">
          <span style={{ color: COL.x }}>x(t)</span> και το ολισθημένο{' '}
          <span style={{ color: COL.shift }}>x(t−τ)</span>
        </div>
        <canvas
          ref={signalsRef}
          style={{ height: 120, touchAction: 'none' }}
          className="block h-[120px] w-full"
          aria-label="x(t) and shifted copy with overlap"
        />
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-2">
        <div className="mb-1 px-1 text-[11px] font-semibold tracking-tight">
          R<sub>x</sub>(τ){' '}
          <span className="font-normal text-fg-subtle">
            = ταλάντωση cos(2πτ) μέσα σε τριγωνικό φάκελο (2−|τ|)/2
          </span>
        </div>
        <canvas
          ref={corrRef}
          style={{ height: 170, touchAction: 'none' }}
          className="block h-[170px] w-full"
          aria-label="R_x(tau) curve with triangular envelope"
        />
      </div>
    </figure>
  )
}

function drawSignals(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number) {
  const { ctx, w, h } = ready(canvas)
  const padL = 30
  const padR = 14
  const mid = h / 2
  const xOf = (t: number) => padL + ((t - T_MIN) / (T_MAX - T_MIN)) * (w - padL - padR)
  const yScale = (h / 2 - 12) / 1.15

  // overlap band [max(0,τ), min(2, 2+τ)]
  const oL = Math.max(0, tau)
  const oR = Math.min(2, 2 + tau)
  if (oR > oL) {
    ctx.fillStyle = withAlpha(colors.fg, 0.07)
    ctx.fillRect(xOf(oL), 8, xOf(oR) - xOf(oL), h - 16)
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    const lbl = `επικάλυψη = ${(oR - oL).toFixed(2)}`
    ctx.fillText(lbl, (xOf(oL) + xOf(oR)) / 2 - ctx.measureText(lbl).width / 2, 16)
  }

  // baseline + t=0 tick
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, mid)
  ctx.lineTo(w - padR, mid)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  for (const tk of [0, 2]) {
    ctx.fillText(`${tk}`, xOf(tk) - 2, mid + 12)
  }
  ctx.fillText('t', w - padR - 6, mid - 4)

  // x(t)
  plot(ctx, xOf, mid, yScale, COL.x, (t) => xSig(t))
  // x(t−τ)
  plot(ctx, xOf, mid, yScale, COL.shift, (t) => xSig(t - tau))
}

function drawCorr(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number) {
  const { ctx, w, h } = ready(canvas)
  const padL = 30
  const padR = 14
  const padT = 14
  const padB = 18
  const xOf = (t: number) => padL + ((t + TAU_VIEW) / (2 * TAU_VIEW)) * (w - padL - padR)
  const zeroY = padT + (h - padT - padB) * (1 / 2.1) // R=0 line; R∈[−1.05,1.05] mapped
  const yScale = (h - padT - padB) / 2.1

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, zeroY)
  ctx.lineTo(w - padR, zeroY)
  ctx.moveTo(xOf(0), padT)
  ctx.lineTo(xOf(0), h - padB)
  ctx.stroke()

  // τ ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  for (const tk of [-2, -1, 1, 2]) {
    ctx.fillText(`${tk}`, xOf(tk) - 3, zeroY + 13)
  }
  ctx.fillText('τ', w - padR - 6, zeroY - 4)

  // dashed triangular envelope ±(2−|τ|)/2
  ctx.strokeStyle = COL.env
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.3
  for (const sign of [1, -1]) {
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= 240; i++) {
      const t = -TAU_VIEW + (2 * TAU_VIEW * i) / 240
      const e = envOf(t)
      const px = xOf(t)
      const py = zeroY - sign * e * yScale
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = COL.env
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('φάκελος (2−|τ|)/2', xOf(-TAU_VIEW) + 4, zeroY - 0.95 * yScale)

  // R_x(τ) curve
  ctx.strokeStyle = COL.curve
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= 400; i++) {
    const t = -TAU_VIEW + (2 * TAU_VIEW * i) / 400
    const px = xOf(t)
    const py = zeroY - rx(t) * yScale
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // peak (0,1) and zeros (±2,0)
  dot(ctx, xOf(0), zeroY - 1 * yScale, COL.curve)
  ctx.fillStyle = colors.fg
  ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('R_x(0) = E_x = 1', xOf(0) + 6, zeroY - 1 * yScale - 4)
  for (const z of [-2, 2]) {
    dot(ctx, xOf(z), zeroY, colors.fgSubtle)
  }

  // current-τ marker
  const px = xOf(tau)
  const py = zeroY - rx(tau) * yScale
  ctx.strokeStyle = COL.marker
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(px, padT)
  ctx.lineTo(px, h - padB)
  ctx.stroke()
  ctx.setLineDash([])
  dot(ctx, px, py, COL.marker, 4.5)
}

// ── small helpers ──
function plot(
  ctx: CanvasRenderingContext2D,
  xOf: (t: number) => number,
  mid: number,
  yScale: number,
  color: string,
  fn: (t: number) => number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const N = 600
  for (let i = 0; i <= N; i++) {
    const t = T_MIN + ((T_MAX - T_MIN) * i) / N
    const px = xOf(t)
    const py = mid - fn(t) * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 3.5) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
}

function withAlpha(rgbFn: string, alpha: number) {
  // colors come back as "rgb(r g b)"; splice in an alpha
  const inner = rgbFn.replace(/^rgb\(/, '').replace(/\)$/, '').trim()
  return `rgba(${inner.split(/\s+/).join(', ')}, ${alpha})`
}

function ready(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.floor(rect.width * dpr))
  canvas.height = Math.max(1, Math.floor(rect.height * dpr))
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, rect.width, rect.height)
  return { ctx, w: rect.width, h: rect.height }
}
