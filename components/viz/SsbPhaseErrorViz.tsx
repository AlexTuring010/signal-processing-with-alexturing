'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Phase-error sweep for SSB coherent demodulation. The reader watches how the
 * recovered y(t) morphs from m(t) (at φ=0) to ∓m̂(t) (at φ=90°), and
 * everything in between is a smooth linear blend:
 *
 *   USB:  y(t) = m(t)·cosφ − m̂(t)·sinφ
 *   LSB:  y(t) = m(t)·cosφ + m̂(t)·sinφ
 *
 * Two stacked panels:
 *   - Top: the reference signals m(t) (solid amber) and m̂(t) (dashed
 *          lavender). The Hilbert of a multi-tone message is visually
 *          distinct — quarter-period-shifted — so the contrast at φ=90° is
 *          unmistakable.
 *   - Bottom: the recovered y(t) (solid green), morphing as φ slides.
 *
 * The point of contrast with DSB-SC (see CoherentDemodulationViz on
 * /am/dsb-sc): in DSB-SC, φ=90° produces a quadrature **null** (the recovered
 * signal collapses to zero). In SSB it produces a **different signal** — the
 * Hilbert — not zero. For voice this sounds like a "scrambled" version of the
 * original; the energy is fully preserved, only the spectral shape is wrong.
 * That distinction is the whole reason SSB receivers tolerate small phase
 * drifts where DSB-SC receivers fall over.
 */

type Sideband = 'usb' | 'lsb'

const F1 = 0.7
const F2 = 1.3
const A1 = 1
const A2 = 0.7

const T_MIN = 0
const T_MAX = 3 // a few periods of the slower tone
const Y_LIM = 2.1

const COLOR_M = 'rgb(217, 119, 6)' // amber — true m
const COLOR_MHAT = 'rgb(168, 85, 247)' // violet — Hilbert m̂
const COLOR_Y = 'rgb(22, 163, 74)' // green — recovered
const COLOR_M_FAINT = 'rgba(217, 119, 6, 0.35)'

const PAD_X = 44
const PAD_Y = 12
const PANEL_GAP = 6

function m(t: number) {
  return A1 * Math.cos(2 * Math.PI * F1 * t) + A2 * Math.cos(2 * Math.PI * F2 * t)
}

function mhat(t: number) {
  return A1 * Math.sin(2 * Math.PI * F1 * t) + A2 * Math.sin(2 * Math.PI * F2 * t)
}

export function SsbPhaseErrorViz() {
  const [phiDeg, setPhiDeg] = useState(30)
  const [sideband, setSideband] = useState<Sideband>('usb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, phiDeg, sideband)
  }, [phiDeg, sideband])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, phiDeg, sideband)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phiDeg, sideband])

  const phi = (phiDeg * Math.PI) / 180
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const sgn = sideband === 'usb' ? -1 : +1
  const mFrac = cosPhi
  const mhatFrac = sgn * sinPhi // coefficient on m̂(t)
  const distortion = Math.round((1 - cosPhi) * 100)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        SSB phase error — όχι quadrature null, αλλά Hilbert παραμόρφωση
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε τη <strong>φ</strong> από 0° μέχρι 90°. Στο{' '}
        <span className="font-mono">0°</span> ο coherent demod ανακτά το{' '}
        <span className="font-mono">m(t)</span>· στα <span className="font-mono">90°</span>{' '}
        ανακτά το <span className="font-mono">∓m̂(t)</span> — τον Hilbert του
        message, ένα <strong>διαφορετικό σήμα</strong> (όχι μηδέν, όπως στο
        DSB-SC). Όλα τα ενδιάμεσα είναι γραμμικά μείγματα{' '}
        <span className="font-mono">m·cosφ ∓ m̂·sinφ</span>.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Sideband"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            [
              { id: 'usb' as Sideband, label: 'USB (−)' },
              { id: 'lsb' as Sideband, label: 'LSB (+)' },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={sideband === opt.id}
              onClick={() => setSideband(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                sideband === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-fg-muted">
          <span className="font-mono">φ</span>
          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={phiDeg}
            onChange={(e) => setPhiDeg(parseFloat(e.target.value))}
            className="h-1 w-44 cursor-pointer accent-accent"
            aria-label="Phase error in degrees"
          />
          <span className="font-mono">{phiDeg}°</span>
        </label>

        <div className="ml-auto inline-flex gap-2 text-[11px]">
          {[0, 30, 60, 90, 120, 180].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPhiDeg(p)}
              className={cn(
                'rounded border border-border bg-bg-soft px-1.5 py-0.5 text-fg-muted hover:text-fg',
                phiDeg === p && 'border-accent text-fg',
              )}
            >
              {p}°
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="SSB phase error: reference m(t) and m-hat(t) above, recovered y(t) below as phase sweeps"
      />

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-emerald-400/40 bg-emerald-50/50 px-3 py-2 dark:bg-emerald-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Τρέχουσα μορφή y(t)</div>
          <div className="mt-1 font-mono text-[12px]">
            y(t) = {mFrac.toFixed(2)}·m(t){' '}
            {mhatFrac >= 0 ? '+' : '−'} {Math.abs(mhatFrac).toFixed(2)}·m̂(t)
          </div>
          <div className="mt-1 text-fg-muted">
            «Καθαρό m»: <strong>{Math.round(cosPhi * 100)}%</strong> · «Hilbert
            ανάμιξη»: <strong>{Math.round(Math.abs(sinPhi) * 100)}%</strong>
          </div>
        </div>
        <div className="rounded-md border border-amber-400/40 bg-amber-50/60 px-3 py-2 dark:bg-amber-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Διαφορά από DSB-SC</div>
          <div className="mt-1 text-fg-muted">
            Σε <span className="font-mono">DSB-SC</span> στις{' '}
            <strong>φ=90°</strong> η έξοδος είναι <strong>μηδέν</strong>{' '}
            (quadrature null). Σε <span className="font-mono">SSB</span> στις{' '}
            <strong>φ=90°</strong> η έξοδος είναι το{' '}
            <strong>{sideband === 'usb' ? '−m̂(t)' : '+m̂(t)'}</strong> — ένα
            διαφορετικό σήμα ίσης ενέργειας. Παραμόρφωση πλάτους:{' '}
            <strong>{distortion}%</strong>.
          </div>
        </div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phiDeg: number,
  sideband: Sideband,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const phi = (phiDeg * Math.PI) / 180
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const sgn = sideband === 'usb' ? -1 : +1

  const panelH = (h - PAD_Y * 2 - PANEL_GAP) / 2

  // Top panel: reference m(t) and m̂(t)
  drawTimePanel(
    ctx,
    colors,
    w,
    PAD_Y,
    panelH,
    'Αναφορά:  m(t) (αμπερ), m̂(t) (μωβ διακεκομμένο)',
    (t) => m(t),
    (t) => mhat(t),
    COLOR_M,
    COLOR_MHAT,
    true,
  )

  // Bottom panel: recovered y(t)
  drawTimePanel(
    ctx,
    colors,
    w,
    PAD_Y + panelH + PANEL_GAP,
    panelH,
    `Ανακτημένο:  y(t) = cosφ·m(t) ${sgn === -1 ? '−' : '+'} sinφ·m̂(t)`,
    (t) => cosPhi * m(t) + sgn * sinPhi * mhat(t),
    null,
    COLOR_Y,
    null,
    false,
    // Ghost: the true m(t) underneath (for visual reference of how much y(t) drifted from m(t))
    (t) => m(t),
  )
}

function drawTimePanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
  title: string,
  fn1: (t: number) => number,
  fn2: ((t: number) => number) | null,
  color1: string,
  color2: string | null,
  dashed2: boolean,
  ghost?: (t: number) => number,
) {
  if (!colors) return
  const xt = (t: number) => lerp(t, T_MIN, T_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, Y_LIM, -Y_LIM, y0 + 4, y0 + ph - 12)
  const yZero = yv(0)

  // Background tint
  ctx.fillStyle = 'rgba(148, 163, 184, 0.04)'
  ctx.fillRect(PAD_X - 6, y0, w - 2 * PAD_X + 12, ph)

  // Zero / time axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Y-axis
  ctx.beginPath()
  ctx.moveTo(PAD_X, y0 + 4)
  ctx.lineTo(PAD_X, y0 + ph - 12)
  ctx.stroke()

  // Y-axis labels at ±1
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '8.5px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', PAD_X - 4, yv(1) + 3)
  ctx.fillText('0', PAD_X - 4, yZero + 3)
  ctx.fillText('−1', PAD_X - 4, yv(-1) + 3)

  // Title (top-left)
  ctx.textAlign = 'left'
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fg
  ctx.fillText(title, PAD_X + 4, y0 + 12)

  // Ghost line (e.g. true m(t) under y(t) for reference)
  if (ghost) {
    ctx.strokeStyle = COLOR_M_FAINT
    ctx.lineWidth = 1.2
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    const STEPS_G = 320
    for (let i = 0; i <= STEPS_G; i++) {
      const t = lerp(i, 0, STEPS_G, T_MIN, T_MAX)
      const v = ghost(t)
      const px = xt(t)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Primary signal
  ctx.strokeStyle = color1
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 480
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, T_MIN, T_MAX)
    const v = fn1(t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Secondary signal (optional)
  if (fn2 && color2) {
    ctx.strokeStyle = color2
    ctx.lineWidth = 1.4
    if (dashed2) ctx.setLineDash([4, 3])
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, T_MIN, T_MAX)
      const v = fn2(t)
      const px = xt(t)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }
}
