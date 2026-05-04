'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Flagship phase ↔ time-shift viz for /foundations/signals §4a.5.
 *
 * Two cosines on the same time axis with shared frequency f and independent
 * phases φ₁, φ₂. The right-side phasor inset shows their initial phasors at
 * t = 0. A live readout reports both phases in rad and deg, the phase
 * difference Δφ = φ₂ − φ₁, and the equivalent time shift
 *
 *     Δt = (φ₂ − φ₁) / (2π f)
 *
 * with the convention "Δt = how much earlier cos₂'s peak is than cos₁'s
 * peak" (positive Δt → cos₂'s peak lies to the LEFT of cos₁'s peak in time).
 *
 * Goal of the viz: make the equivalence "phase = same-frequency time shift"
 * inescapable. Move the φ₂ slider, watch the orange cosine slide horizontally,
 * watch Δt change in lockstep — and notice that for a different f the same
 * Δφ produces a different Δt.
 */

const T_END = 2

type PresetId = 'same' | 'quad' | 'opposite' | 'custom'

const PRESETS: { id: PresetId; label: string; phi1: number; phi2: number }[] = [
  { id: 'same', label: 'Ίδια φάση', phi1: 0, phi2: 0 },
  { id: 'quad', label: 'Quadrature (π/2)', phi1: 0, phi2: Math.PI / 2 },
  { id: 'opposite', label: 'Αντίθετη (π)', phi1: 0, phi2: Math.PI },
]

function fmtRad(phi: number) {
  // Display in fractions of π when close to a clean multiple, otherwise decimal.
  const overPi = phi / Math.PI
  const rounded = Math.round(overPi * 12) / 12
  if (Math.abs(overPi - rounded) < 5e-3) {
    if (rounded === 0) return '0'
    if (Math.abs(rounded) === 1) return rounded < 0 ? '−π' : 'π'
    // Pretty fractions.
    const cleanFractions: Record<string, string> = {
      '0.5': 'π/2',
      '-0.5': '−π/2',
      '0.25': 'π/4',
      '-0.25': '−π/4',
      '0.75': '3π/4',
      '-0.75': '−3π/4',
      '0.3333333333333333': 'π/3',
      '-0.3333333333333333': '−π/3',
      '0.6666666666666666': '2π/3',
      '-0.6666666666666666': '−2π/3',
    }
    const key = String(rounded)
    if (cleanFractions[key]) return cleanFractions[key]
  }
  return `${phi.toFixed(2)} rad`
}

function fmtDeg(phi: number) {
  return `${((phi * 180) / Math.PI).toFixed(0)}°`
}

export function PhaseTimeShiftDemo() {
  const [f, setF] = useState(1)
  const [phi1, setPhi1] = useState(0)
  const [phi2, setPhi2] = useState(Math.PI / 2)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const phasorRef = useRef<HTMLCanvasElement | null>(null)

  const dPhi = phi2 - phi1
  const dt = dPhi / (2 * Math.PI * f) // see header docstring for sign convention

  const activePreset: PresetId = useMemo(() => {
    for (const p of PRESETS) {
      if (Math.abs(p.phi1 - phi1) < 1e-3 && Math.abs(p.phi2 - phi2) < 1e-3) return p.id
    }
    return 'custom'
  }, [phi1, phi2])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, f, phi1, phi2)
    if (phasorRef.current) drawPhasors(phasorRef.current, colors, phi1, phi2)
  }, [f, phi1, phi2])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Φάση ↔ χρονική ολίσθηση — μια εικόνα
        </h4>
        <div
          role="radiogroup"
          aria-label="Presets"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={activePreset === p.id}
              onClick={() => {
                setPhi1(p.phi1)
                setPhi2(p.phi2)
              }}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                activePreset === p.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
          <div className="border-b border-border bg-bg-soft px-3 py-1.5">
            <div className="text-[11px] font-semibold tracking-tight">
              Στον χρόνο · cos<sub>1</sub>(t) και cos<sub>2</sub>(t)
            </div>
          </div>
          <canvas
            ref={timeRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Two cosines with phases phi1 and phi2 plotted over time"
          />
        </div>
        <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
          <div className="border-b border-border bg-bg-soft px-3 py-1.5">
            <div className="text-[11px] font-semibold tracking-tight">Phasors στο t = 0</div>
          </div>
          <canvas
            ref={phasorRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Phasors at t = 0 showing initial angles phi1 and phi2"
          />
        </div>
      </div>

      {/* Readout panel */}
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 md:grid-cols-4">
        <Readout
          label="φ₁"
          colorKey="accent"
          primary={fmtRad(phi1)}
          secondary={fmtDeg(phi1)}
        />
        <Readout
          label="φ₂"
          colorKey="warn"
          primary={fmtRad(phi2)}
          secondary={fmtDeg(phi2)}
        />
        <Readout
          label="Δφ = φ₂ − φ₁"
          colorKey="muted"
          primary={fmtRad(dPhi)}
          secondary={fmtDeg(dPhi)}
        />
        <Readout
          label="Δt = Δφ / (2π f)"
          colorKey="success"
          primary={`${dt >= 0 ? '+' : ''}${dt.toFixed(3)} s`}
          secondary={
            Math.abs(dt) < 1e-9
              ? 'cos₂ ταυτίζεται με cos₁'
              : dt > 0
                ? 'cos₂ ξεκινά νωρίτερα'
                : 'cos₂ ξεκινά αργότερα'
          }
        />
      </div>

      {/* Sliders */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Slider
          label="f (Hz)"
          value={f}
          min={0.5}
          max={3}
          step={0.05}
          onChange={setF}
          format={(v) => `${v.toFixed(2)} Hz`}
        />
        <Slider
          label="φ₁"
          value={phi1}
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 24}
          onChange={setPhi1}
          format={(v) => `${fmtRad(v)} (${fmtDeg(v)})`}
        />
        <Slider
          label="φ₂"
          value={phi2}
          min={-Math.PI}
          max={Math.PI}
          step={Math.PI / 24}
          onChange={setPhi2}
          format={(v) => `${fmtRad(v)} (${fmtDeg(v)})`}
        />
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        <strong>Κράτησε στο μυαλό σου:</strong> ίδια συχνότητα, ίδιο πλάτος —
        αυτό που αλλάζει είναι <em>πότε</em> ξεκινάει ο κύκλος του καθένα. Σε
        διαφορετικό f, το ίδιο Δφ δίνει διαφορετικό Δt — γι' αυτό η φάση
        είναι «εξαρτώμενη από τη συχνότητα».
      </p>
    </figure>
  )
}

/* ---------------- sub-components ---------------- */

function Readout({
  label,
  primary,
  secondary,
  colorKey,
}: {
  label: string
  primary: string
  secondary: string
  colorKey: 'accent' | 'warn' | 'success' | 'muted'
}) {
  const tone =
    colorKey === 'accent'
      ? 'border-accent/40 bg-accent-soft/30 text-accent'
      : colorKey === 'warn'
        ? 'border-amber-400/50 bg-amber-50/40 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200'
        : colorKey === 'success'
          ? 'border-emerald-400/50 bg-emerald-50/40 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200'
          : 'border-border bg-bg-soft text-fg'
  return (
    <div className={cn('rounded-md border px-2.5 py-1.5', tone)}>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="font-mono text-sm font-semibold tabular-nums">{primary}</div>
      <div className="text-[10px] opacity-75">{secondary}</div>
    </div>
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
        <span className="font-mono text-xs tabular-nums text-fg">{format(value)}</span>
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

/* ---------------- drawing ---------------- */

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  f: number,
  phi1: number,
  phi2: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 24
  const padY = 14

  // Mid-line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h / 2)
  ctx.lineTo(w - padX, h / 2)
  ctx.stroke()

  const xt = (t: number) => lerp(t, 0, T_END, padX, w - padX)
  const yv = (v: number) => lerp(v, 1.4, -1.4, padY, h - padY)

  // ±1 dashed reference lines
  ctx.save()
  ctx.setLineDash([2, 3])
  ctx.strokeStyle = colors.border
  for (const v of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(padX, yv(v))
    ctx.lineTo(w - padX, yv(v))
    ctx.stroke()
  }
  ctx.restore()

  // Y labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', padX - 2, yv(1) + 3)
  ctx.fillText('−1', padX - 2, yv(-1) + 3)
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 2)
  ctx.fillText(`${T_END}s`, w - padX, h - 2)

  // The two curves
  drawCosine(ctx, f, phi1, xt, yv, w, padX, colors.accent, 2.2)
  drawCosine(ctx, f, phi2, xt, yv, w, padX, 'rgb(217 119 6)', 2.2)

  // Mark each curve's peak in [0, T_END] if visible
  const colorWarn = 'rgb(217 119 6)'
  markPeak(ctx, f, phi1, xt, yv, colors.accent)
  markPeak(ctx, f, phi2, xt, yv, colorWarn)

  // Draw an arrow connecting the two peaks if both are in-window
  const peak1 = peakInWindow(f, phi1, T_END)
  const peak2 = peakInWindow(f, phi2, T_END)
  if (peak1 !== null && peak2 !== null && Math.abs(peak1 - peak2) > 1e-3) {
    const yArrow = padY + 24
    const x1 = xt(peak1)
    const x2 = xt(peak2)
    ctx.strokeStyle = colors.fgMuted
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1, yArrow)
    ctx.lineTo(x2, yArrow)
    ctx.stroke()
    // arrowheads
    const dir = x2 > x1 ? 1 : -1
    ctx.beginPath()
    ctx.moveTo(x2, yArrow)
    ctx.lineTo(x2 - 6 * dir, yArrow - 4)
    ctx.lineTo(x2 - 6 * dir, yArrow + 4)
    ctx.closePath()
    ctx.fillStyle = colors.fgMuted
    ctx.fill()
    // label
    ctx.fillStyle = colors.fgMuted
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Δt', (x1 + x2) / 2, yArrow - 6)
  }

  // Legend
  ctx.fillStyle = colors.accent
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('— cos₁(t)', padX + 4, padY + 11)
  ctx.fillStyle = 'rgb(217 119 6)'
  ctx.fillText('— cos₂(t)', padX + 4 + 70, padY + 11)
}

function drawCosine(
  ctx: CanvasRenderingContext2D,
  f: number,
  phi: number,
  xt: (t: number) => number,
  yv: (v: number) => number,
  w: number,
  padX: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  const N = (w - 2 * padX) * 2
  for (let i = 0; i <= N; i++) {
    const t = lerp(i, 0, N, 0, T_END)
    const v = Math.cos(2 * Math.PI * f * t + phi)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function peakInWindow(f: number, phi: number, tEnd: number): number | null {
  // Peaks of cos(2π f t + φ) occur where 2π f t + φ = 2π k, i.e. t = (2π k − φ)/(2π f) = (k − φ/(2π))/f
  const base = -phi / (2 * Math.PI * f)
  const period = 1 / f
  // Find smallest t >= 0 that is a peak.
  let t = base
  while (t < 0) t += period
  while (t > tEnd) t -= period
  if (t < 0 || t > tEnd) return null
  return t
}

function markPeak(
  ctx: CanvasRenderingContext2D,
  f: number,
  phi: number,
  xt: (t: number) => number,
  yv: (v: number) => number,
  color: string,
) {
  const t = peakInWindow(f, phi, T_END)
  if (t === null) return
  const x = xt(t)
  const y = yv(1)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawPhasors(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phi1: number,
  phi2: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) / 2 - 18

  // Bounding axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - r - 6, cy)
  ctx.lineTo(cx + r + 6, cy)
  ctx.moveTo(cx, cy - r - 6)
  ctx.lineTo(cx, cy + r + 6)
  ctx.stroke()

  // Unit circle
  ctx.save()
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.fgMuted
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Phasor 1
  drawArrow(ctx, cx, cy, r, phi1, colors.accent, 2.2)
  // Phasor 2
  drawArrow(ctx, cx, cy, r, phi2, 'rgb(217 119 6)', 2.2)

  // Axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', cx + r + 6, cy - 3)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 4, cy - r - 4)

  // Legend
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.accent
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('φ₁', 6, 12)
  ctx.fillStyle = 'rgb(217 119 6)'
  ctx.fillText('φ₂', 30, 12)
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  phi: number,
  color: string,
  width: number,
) {
  const px = cx + r * Math.cos(phi)
  const py = cy - r * Math.sin(phi) // canvas y is inverted
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()
  // arrowhead
  const headLen = 8
  const headAng = 0.5
  const angle = Math.atan2(-(py - cy), px - cx) // back to math angle
  const ax1 = px - headLen * Math.cos(angle - headAng)
  const ay1 = py + headLen * Math.sin(angle - headAng)
  const ax2 = px - headLen * Math.cos(angle + headAng)
  const ay2 = py + headLen * Math.sin(angle + headAng)
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(ax1, ay1)
  ctx.lineTo(ax2, ay2)
  ctx.closePath()
  ctx.fill()
}
