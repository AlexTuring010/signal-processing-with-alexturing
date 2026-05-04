'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Periodic spectrum getting denser as the period grows.
 *
 * We take a fixed shape (a rectangular pulse of width 1 centred at 0) and
 * pretend we are extending it periodically with period T₀. The Fourier
 * series coefficients are then a_k = (1/T₀) · sinc(k/T₀) (because the pulse
 * has fixed width 1, so width/T₀ ratio shrinks as T₀ grows).
 *
 * We plot the discrete spectrum lines superimposed on the underlying
 * continuous envelope X(f) = sinc(f). As T₀ → ∞:
 *   - line spacing 1/T₀ → 0, so lines crowd into the envelope
 *   - line height (1/T₀) → 0, but multiplied by 1/(spacing) the envelope
 *     stays put
 *   - the discrete spectrum visibly *becomes* the continuous Fourier
 *     transform of the single pulse.
 */

const T_MIN = 1.5
const T_MAX = 12

export function PeriodToInfinity() {
  const [T0, setT0] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawScene(canvas, colors, T0)
  }, [T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        T₀ → ∞: το διακριτό φάσμα γίνεται συνεχές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το ίδιο σχήμα παλμού (πλάτους 1) επεκτείνεται περιοδικά με περίοδο T₀.
        Σύρε το T₀ προς τα πάνω και δες πώς οι αρμονικές πυκνώνουν, ώσπου
        να γίνουν μια <strong>συνεχής</strong> καμπύλη — η περιβάλλουσα,
        που είναι ο Fourier transform του ενός παλμού.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="Spectrum lines crowding into a sinc envelope as T₀ grows"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          {' · '}
          απόσταση γραμμών 1/T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">
            {(1 / T0).toFixed(3)} Hz
          </span>
        </label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step={0.1}
          value={T0}
          onChange={(e) => setT0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Period T0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο όριο T₀ → ∞ το άθροισμα γίνεται ολοκλήρωμα, και η διακριτή
        ακολουθία <em>aₖ</em> γίνεται μια συνεχής συνάρτηση συχνότητας — ο
        <strong> μετασχηματισμός Fourier</strong> του ενός μη-περιοδικού παλμού.
      </div>
    </figure>
  )
}

const PAD_X = 28
const PAD_Y = 14

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 6
  const fMin = -fMax
  // Envelope is sinc(f) (because the pulse has unit width centred at 0,
  // X(f) = sinc(f)). The discrete a_k = (W/T₀)·sinc(k·W/T₀) ≈ (1/T₀)·envelope(k/T₀).
  // We rescale so the envelope reaches 1 at f=0.
  const yMax = 1.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // Y-axis at f=0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Continuous envelope sinc(f).
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 400
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const env = f === 0 ? 1 : Math.sin(Math.PI * f) / (Math.PI * f)
    const x = xt(f)
    const y = yv(env)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Discrete lines at k/T₀ with height (W/T₀)·sinc(k·W/T₀), normalized so
  // that the largest line (k=0) reaches the envelope's peak (1).
  // Effectively, height = sinc(k·W/T₀); its area-ratio to the envelope is W/T₀,
  // but since we visualize "where the lines land on the envelope", we plot
  // sinc(f_k) directly — that's the envelope value at the discrete frequency.
  const kMax = Math.ceil(fMax * T0) + 1
  const lineColor = colors.accent
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (f < fMin || f > fMax) continue
    const env = f === 0 ? 1 : Math.sin(Math.PI * f) / (Math.PI * f)
    const x = xt(f)
    const y = yv(env)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = T0 > 8 ? 1 : 1.5
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(x, y, T0 > 8 ? 1.5 : 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [-4, -2, 0, 2, 4]) {
    const x = xt(fk)
    ctx.fillText(`${fk}`, x, h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('· · ·  X(f) = sinc(f)  (όριο όταν T₀ → ∞)', PAD_X + 6, PAD_Y + 12)
  ctx.fillStyle = lineColor
  ctx.fillText(`| · διακριτό aₖ στις f = k/T₀ (T₀ = ${T0.toFixed(1)})`, PAD_X + 6, PAD_Y + 26)
}
