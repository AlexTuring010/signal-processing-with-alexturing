'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FS → FT bridge: time-domain pulse train + frequency-domain line spectrum,
 * driven by a single T₀ slider.
 *
 * Left panel: periodic rectangular pulse train. Pulse shape (width τ = 1) is
 * fixed; only the period T₀ changes — pulses get pushed apart as T₀ grows.
 *
 * Right panel: discrete line spectrum on a *fixed* sinc envelope (the FT of
 * one rectangle). Lines sit at f = k/T₀, with height equal to the envelope
 * value at that frequency. As T₀ grows the lines bunch closer together; the
 * envelope itself does not change shape — that's the whole pedagogical point.
 *
 * In the limit T₀ → ∞: line spacing 1/T₀ → 0, the discrete lines fill the
 * envelope continuously, and we have the Fourier transform of the single
 * non-periodic pulse.
 */

const T_MIN = 1.5
const T_MAX = 12
const TAU = 1 // fixed pulse width

export function PeriodToInfinity() {
  const [T0, setT0] = useState(3)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, T0)
    if (freqRef.current) drawFreq(freqRef.current, colors, T0)
  }, [T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        T₀ → ∞: από Fourier series σε Fourier transform
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά ο periodic παλμός — σταθερό σχήμα <span className="font-mono">τ = 1</span>,
        μεταβλητή περίοδος <span className="font-mono">T₀</span>. Δεξιά το διακριτό
        φάσμα του πάνω σε μια <strong>σταθερή</strong> sinc περιβάλλουσα — τον FT του
        ενός παλμού. Σύρε το <span className="font-mono">T₀</span> και παρακολούθησε
        πώς αλλάζει η πυκνότητα των γραμμών χωρίς να αλλάζει η περιβάλλουσα.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="periodic παλμός, σταθερό σχήμα">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Periodic rectangular pulse train"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="γραμμές στις k/T₀ πάνω σε sinc envelope">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Discrete spectrum lines on a fixed sinc envelope"
          />
        </Panel>
      </div>

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
        Παρατήρησε ότι η περιβάλλουσα στο φάσμα <strong>δεν αλλάζει σχήμα</strong>{' '}
        — εξαρτάται μόνο από το σχήμα του ενός παλμού. Αυτό που αλλάζει με το{' '}
        <span className="font-mono">T₀</span> είναι <strong>πόσο πυκνά</strong>{' '}
        δειγματοληπτούμε αυτή την περιβάλλουσα. Στο όριο{' '}
        <span className="font-mono">T₀ → ∞</span>, το «δειγματοληψία» γίνεται
        «συνεχές» — αυτή είναι η μετάβαση από <strong>Fourier series</strong> σε{' '}
        <strong>Fourier transform</strong>.
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 14

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Fixed time window so the visual contrast (dense at small T₀, sparse at
  // large T₀) is preserved.
  const tMax = 12
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // X axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // Y axis at t = 0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Pulses centred at k·T₀, each width τ = 1.
  const accentRgb = getRGB(colors.accent)
  ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5

  const kMaxAbs = Math.ceil((tMax + TAU) / T0)
  for (let k = -kMaxAbs; k <= kMaxAbs; k++) {
    const c = k * T0
    const a = c - TAU / 2
    const b = c + TAU / 2
    if (b < tMin || a > tMax) continue
    const aC = Math.max(a, tMin)
    const bC = Math.min(b, tMax)
    const xL = xt(aC)
    const xR = xt(bC)
    const yT = yv(1)
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }

  // Tick labels — 0, ±T₀, ±2T₀ where they fit
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 1)
  if (T0 <= tMax) {
    ctx.fillText('+T₀', xt(T0), h - 1)
    ctx.fillText('−T₀', xt(-T0), h - 1)
  }
  if (2 * T0 <= tMax) {
    ctx.fillText('+2T₀', xt(2 * T0), h - 1)
    ctx.fillText('−2T₀', xt(-2 * T0), h - 1)
  }

  // Y ticks
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    `τ = 1 (σταθερό), T₀ = ${T0.toFixed(1)}`,
    PAD_X + 6,
    PAD_Y + 12,
  )
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 6
  const fMin = -fMax
  const yMax = 1.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // X axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // Y axis at f = 0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Continuous envelope sinc(f) — the FT of a single τ = 1 rectangle.
  // This curve is independent of T₀ — that's the whole point.
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

  // Discrete lines at f = k/T₀ with height = envelope(k/T₀) = sinc(k/T₀).
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
    ctx.fillText(`${fk}`, xt(fk), h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('· · ·  σταθερή sinc(f) envelope', PAD_X + 6, PAD_Y + 12)
  ctx.fillStyle = lineColor
  ctx.fillText('| · γραμμές στις k/T₀', PAD_X + 6, PAD_Y + 26)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
