'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * R_X(τ) for several canonical processes — purely from the closed-form
 * answer (we don't sample). The point is to *see* what autocorrelation
 * "looks like" for each process and connect that shape to the PSD.
 *
 * Two stacked plots:
 *   1. R_X(τ) for the chosen process
 *   2. (Optional) S_X(f), the PSD = FT{R_X}, for the same process
 *
 * Toggling between processes lets the student compare:
 *   - White noise: R = (N₀/2) δ(τ) → flat PSD
 *   - Cosine: R = (A²/2) cos(2π f₀ τ) → impulses at ±f₀
 *   - Lowpass: R = sinc shape → rect PSD
 *   - Bandpass: R = sinc · cos → rect PSD shifted
 */

const PRESETS = [
  {
    id: 'white',
    label: 'Λευκός θόρυβος',
    eq: 'R_X(τ) = (N₀/2)·δ(τ)',
    psd: 'S_X(f) = N₀/2 (επίπεδη)',
  },
  {
    id: 'cosine',
    label: 'cos(2π f₀ t + Θ)',
    eq: 'R_X(τ) = (A²/2)·cos(2π f₀ τ)',
    psd: 'S_X(f) = (A²/4)·[δ(f-f₀) + δ(f+f₀)]',
  },
  {
    id: 'lowpass',
    label: 'Lowpass-bandlimited',
    eq: 'R_X(τ) = N₀·B·sinc(2Bτ)',
    psd: 'S_X(f) = N₀/2 για |f| ≤ B',
  },
  {
    id: 'bandpass',
    label: 'Bandpass θόρυβος',
    eq: 'R_X(τ) = 2N₀·B·sinc(2Bτ)·cos(2π f_c τ)',
    psd: 'S_X(f) = N₀/2 για |f − f_c| ≤ B',
  },
] as const

type PresetId = (typeof PRESETS)[number]['id']

export function AutocorrelationViz({
  initialPreset = 'cosine',
}: {
  initialPreset?: PresetId
} = {}) {
  const [preset, setPreset] = useState<PresetId>(initialPreset)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, preset)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, preset)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [preset])

  const meta = PRESETS.find((p) => p.id === preset)!

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Αυτοσυσχέτιση R<sub>X</sub>(τ) και PSD S<sub>X</sub>(f) — Wiener-Khinchin
      </h4>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              preset === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Autocorrelation and PSD pair"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Autocorrelation
          </div>
          <div className="font-mono text-fg">{meta.eq}</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            PSD (Wiener-Khinchin)
          </div>
          <div className="font-mono text-fg">{meta.psd}</div>
        </div>
      </div>
    </figure>
  )
}

const R_C = 'rgb(29, 78, 216)'
const S_C = 'rgb(168, 85, 247)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: PresetId,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const halfH = h / 2 - 4
  drawAutocorr(ctx, colors, 0, 0, w, halfH, preset)
  drawPSD(ctx, colors, 0, halfH + 8, w, halfH, preset)
}

function drawAutocorr(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: PresetId,
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22
  const tauMax = 4
  const xt = (tau: number) => lerp(tau, -tauMax, tauMax, x0 + PAD_X, x0 + pw - PAD_X)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('R_X(τ)', x0 + PAD_X, y0 + 12)

  const yLim = 1.6
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.3, y0 + PAD_TOP + 4, y0 + ph - PAD_BOTTOM)
  const yZero = yv(0)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let tau = -tauMax; tau <= tauMax; tau++) {
    if (tau === 0) {
      ctx.fillStyle = colors.fg
      ctx.fillText('0', xt(tau), yZero + 14)
      ctx.fillStyle = colors.fgSubtle
    } else if (tau % 2 === 0) {
      ctx.fillText(`${tau}`, xt(tau), yZero + 14)
    }
  }
  // Axis-variable letter sits in the right margin, past the last tick,
  // so it never collides with the "4" tick centred at the axis end.
  ctx.textAlign = 'left'
  ctx.fillText('τ', x0 + pw - PAD_X + 10, yZero + 14)

  // Plot R_X(τ)
  ctx.strokeStyle = R_C
  ctx.lineWidth = 1.6
  if (preset === 'white') {
    // Spike at τ=0 (impulse), zero elsewhere
    const x0Tau = xt(0)
    ctx.beginPath()
    ctx.moveTo(x0Tau, yZero)
    ctx.lineTo(x0Tau, yv(1.4))
    ctx.stroke()
    // Arrow
    ctx.fillStyle = R_C
    ctx.beginPath()
    ctx.moveTo(x0Tau - 4, yv(1.4) + 5)
    ctx.lineTo(x0Tau, yv(1.4))
    ctx.lineTo(x0Tau + 4, yv(1.4) + 5)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = R_C
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('(N₀/2)·δ(τ)', x0Tau + 6, yv(0.9))
  } else {
    ctx.beginPath()
    const STEPS = 400
    for (let i = 0; i <= STEPS; i++) {
      const tau = lerp(i, 0, STEPS, -tauMax, tauMax)
      const v = evalR(preset, tau)
      const px = xt(tau)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
}

function drawPSD(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: PresetId,
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22
  const fMax = 4
  const xf = (f: number) => lerp(f, -fMax, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yLim = 1.6
  const yv = (v: number) => lerp(v, yLim, 0, y0 + PAD_TOP + 4, y0 + ph - PAD_BOTTOM)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('S_X(f)', x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let f = -fMax; f <= fMax; f++) {
    if (f === 0) {
      ctx.fillStyle = colors.fg
      ctx.fillText('0', xf(f), yZero + 14)
      ctx.fillStyle = colors.fgSubtle
    } else if (f % 2 === 0) {
      ctx.fillText(`${f}`, xf(f), yZero + 14)
    }
  }
  // Axis-variable letter in the right margin (see drawAutocorr note).
  ctx.textAlign = 'left'
  ctx.fillText('f', x0 + pw - PAD_X + 10, yZero + 14)

  ctx.strokeStyle = S_C
  ctx.fillStyle = 'rgba(168, 85, 247, 0.18)'
  ctx.lineWidth = 1.6

  if (preset === 'white') {
    const left = xf(-fMax)
    const right = xf(fMax)
    const yTop = yv(0.9)
    ctx.fillRect(left, yTop, right - left, yZero - yTop)
    ctx.beginPath()
    ctx.moveTo(left, yZero)
    ctx.lineTo(left, yTop)
    ctx.lineTo(right, yTop)
    ctx.lineTo(right, yZero)
    ctx.stroke()
    ctx.fillStyle = S_C
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('N₀/2', xf(0) + 5, yv(0.9) - 4)
  } else if (preset === 'cosine') {
    // Two impulses at ±f₀
    for (const f0 of [-1, 1]) {
      const x = xf(f0)
      ctx.strokeStyle = S_C
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, yZero)
      ctx.lineTo(x, yv(1.2))
      ctx.stroke()
      ctx.fillStyle = S_C
      ctx.beginPath()
      ctx.moveTo(x - 4, yv(1.2) + 5)
      ctx.lineTo(x, yv(1.2))
      ctx.lineTo(x + 4, yv(1.2) + 5)
      ctx.closePath()
      ctx.fill()
    }
    ctx.fillStyle = S_C
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('(A²/4)δ(f-f₀)', xf(1), yv(1.25) - 4)
    ctx.fillText('(A²/4)δ(f+f₀)', xf(-1), yv(1.25) - 4)
  } else if (preset === 'lowpass') {
    const B = 1.5
    const top = 0.9
    ctx.fillStyle = 'rgba(168, 85, 247, 0.18)'
    ctx.fillRect(xf(-B), yv(top), xf(B) - xf(-B), yZero - yv(top))
    ctx.strokeStyle = S_C
    ctx.beginPath()
    ctx.moveTo(xf(-B - 0.4), yZero)
    ctx.lineTo(xf(-B), yZero)
    ctx.lineTo(xf(-B), yv(top))
    ctx.lineTo(xf(B), yv(top))
    ctx.lineTo(xf(B), yZero)
    ctx.lineTo(xf(B + 0.4), yZero)
    ctx.stroke()
    ctx.fillStyle = S_C
    ctx.textAlign = 'center'
    ctx.fillText('-B', xf(-B), yv(top) - 4)
    ctx.fillText('+B', xf(B), yv(top) - 4)
    ctx.fillText('N₀/2', xf(0), yv(top) - 4)
  } else if (preset === 'bandpass') {
    const B = 0.6
    const fc = 2
    const top = 0.9
    for (const c of [-fc, fc]) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)'
      ctx.fillRect(xf(c - B), yv(top), xf(c + B) - xf(c - B), yZero - yv(top))
      ctx.strokeStyle = S_C
      ctx.beginPath()
      ctx.moveTo(xf(c - B - 0.3), yZero)
      ctx.lineTo(xf(c - B), yZero)
      ctx.lineTo(xf(c - B), yv(top))
      ctx.lineTo(xf(c + B), yv(top))
      ctx.lineTo(xf(c + B), yZero)
      ctx.lineTo(xf(c + B + 0.3), yZero)
      ctx.stroke()
    }
    ctx.fillStyle = S_C
    ctx.textAlign = 'center'
    ctx.fillText('-f_c', xf(-fc), yv(top) - 4)
    ctx.fillText('+f_c', xf(fc), yv(top) - 4)
  }
}

function evalR(preset: PresetId, tau: number): number {
  switch (preset) {
    case 'cosine':
      return Math.cos(2 * Math.PI * 1.0 * tau)
    case 'lowpass': {
      const B = 1.5
      const arg = 2 * B * tau
      if (Math.abs(arg) < 1e-9) return 1
      return Math.sin(Math.PI * arg) / (Math.PI * arg)
    }
    case 'bandpass': {
      const B = 0.6
      const fc = 2
      const arg = 2 * B * tau
      const sinc = Math.abs(arg) < 1e-9 ? 1 : Math.sin(Math.PI * arg) / (Math.PI * arg)
      return sinc * Math.cos(2 * Math.PI * fc * tau)
    }
    default:
      return 0
  }
}
