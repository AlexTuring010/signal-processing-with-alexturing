'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Coherent receiver chain — multiply → LPF → recover, with optional noise
 * and a phase-error knob.
 *
 * Setup (Conventional AM):
 *   x(t)  = [A_c + m(t)] cos(ω_c t)         signal
 *   r(t)  = x(t) + n(t)                     received (n optional)
 *   y(t)  = 2 r(t) cos(ω_c t + φ)           after multiplier with LO at ω_c with phase error φ
 *         = [A_c + m(t)] (cos φ + cos(2 ω_c t + φ)) + 2 n(t) cos(ω_c t + φ)
 *
 *   After LPF (cutoff ≈ W):     y_lpf(t) = [A_c + m(t)] cos φ + n_low(t)
 *   After DC removal:           m̂(t)     = m(t) cos φ + n_low(t)
 *
 * Three stacked panels:
 *   1. r(t)            — input AM (+ noise overlay if on)
 *   2. y(t)            — after multiplier: baseband sits at cos φ scale,
 *                        with a 2 ω_c ripple riding on top (gets killed by LPF).
 *   3. m̂(t) vs m(t)    — recovered (after LPF + DC) vs target message.
 *                        cos φ scaling is the whole story:
 *                          φ = 0°  → full recovery
 *                          φ = 90° → ZERO (quadrature null, same as DSB-SC)
 *                          φ = 180° → inverted m(t)
 *
 * Controls: phase-error slider (0–180°), noise on/off, play/pause.
 */

const FC = 8 // visual carrier cycles
const FM = 0.5
const A_C = 1
const A_M = 0.5 // μ = 0.5

const COLOR_INPUT = 'rgb(29, 78, 216)' // blue
const COLOR_MULT = 'rgb(217, 119, 6)' // amber
const COLOR_REC = 'rgb(22, 163, 74)' // green
const COLOR_TARGET = 'rgba(168, 85, 247, 0.65)' // violet dashed

export function CoherentReceiverChainViz() {
  const [phiDeg, setPhiDeg] = useState(0)
  const [noiseOn, setNoiseOn] = useState(false)
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) draw(canvas, colors, tRef.current, phiDeg, noiseOn)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, phiDeg, noiseOn])

  const phi = (phiDeg * Math.PI) / 180
  const cosPhi = Math.cos(phi)
  const isNull = Math.abs(cosPhi) < 0.05

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Coherent receiver — multiply → LPF → ανάκτηση
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Παίξε'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: <span style={{ color: COLOR_INPUT, fontWeight: 600 }}>r(t)</span>{' '}
        (AM + θόρυβος αν είναι ON). Μέσο:{' '}
        <span style={{ color: COLOR_MULT, fontWeight: 600 }}>y(t)</span> μετά
        από <span className="font-mono">×2cos(ω_c t + φ)</span> — έχει αργή
        baseband + γρήγορο ripple στο{' '}
        <span className="font-mono">2f_c</span> που το LPF θα κόψει. Κάτω:{' '}
        <span style={{ color: COLOR_REC, fontWeight: 600 }}>m̂(t)</span>{' '}
        ανακτημένο σήμα (μετά LPF + DC removal) vs{' '}
        <span style={{ color: COLOR_TARGET, fontWeight: 600 }}>m(t)</span>{' '}
        στόχος (violet διάστικτη). Στο{' '}
        <span className="font-mono">φ = 0</span> ταυτίζονται· στο{' '}
        <span className="font-mono">φ = 90°</span> η ανάκτηση{' '}
        <strong>μηδενίζεται</strong> — quadrature null.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Coherent receiver chain visualization"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Σφάλμα φάσης{' '}
            <span className="font-mono">φ</span> ={' '}
            <span className="font-mono tabular-nums text-fg">
              {phiDeg.toFixed(0)}°
            </span>
            {' · '}
            <span className="font-mono">cos φ</span> ={' '}
            <span className="font-mono tabular-nums text-fg">
              {cosPhi.toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={phiDeg}
            onChange={(e) => setPhiDeg(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="LO phase error"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setNoiseOn((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition',
              noiseOn
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/40',
            )}
            aria-pressed={noiseOn}
          >
            Θόρυβος: {noiseOn ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          isNull
            ? 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200'
            : 'border-green-500/40 bg-green-500/10 text-green-800 dark:text-green-200',
        )}
      >
        {isNull ? (
          <>
            <strong>Quadrature null.</strong> Στο{' '}
            <span className="font-mono">φ = 90°</span>,{' '}
            <span className="font-mono">cos φ = 0</span>: ανάκτηση μηδενική.
            Ίδια συμπεριφορά με DSB-SC — γι' αυτό το coherent demod χρειάζεται
            PLL / pilot tone για συγχρονισμό.
          </>
        ) : (
          <>
            <strong>Γραμμική παραμόρφωση.</strong> Ανακτημένο σήμα ={' '}
            <span className="font-mono">m(t)·cos φ</span> — ίδιο σχήμα, scaled
            κατά{' '}
            <span className="font-mono tabular-nums">{cosPhi.toFixed(2)}</span>.
            Το LPF έκοψε το <span className="font-mono">2f_c</span> ripple
            καθαρά. Καμία ευαισθησία threshold ακόμα και με θόρυβο.
          </>
        )}
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tNow: number,
  phiDeg: number,
  noiseOn: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  const phi = (phiDeg * Math.PI) / 180

  drawInputPanel(ctx, colors, 0, 0, w, rowH, tNow, noiseOn)
  drawMultiplierPanel(ctx, colors, 0, rowH, w, rowH, tNow, phi, noiseOn)
  drawRecoveredPanel(ctx, colors, 0, 2 * rowH, w, rowH, tNow, phi, noiseOn)
}

function drawInputPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  noiseOn: boolean,
) {
  if (!colors) return
  const padX = 20,
    padY = 10
  const tWindow = 4
  const tStart = tNow - tWindow * 0.75
  const tEnd = tNow + tWindow * 0.25
  const yLim = 2

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + padX, x0 + pw - padX)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + padY + 6, y0 + ph - padY)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padX, yZero)
  ctx.lineTo(x0 + pw - padX, yZero)
  ctx.stroke()

  ctx.fillStyle = COLOR_INPUT
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('1.  r(t) = [A_c + m(t)] cos(ω_c t)' + (noiseOn ? '  + n(t)' : ''), x0 + padX, y0 + 12)

  const STEPS = 900
  // signal trace
  ctx.strokeStyle = COLOR_INPUT
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = A_C + A_M * Math.cos(2 * Math.PI * FM * t)
    const sig = env * Math.cos(2 * Math.PI * FC * t)
    const n = noiseOn ? noiseAt(t, i) * 0.4 : 0
    const px = xt(t)
    const py = yv(sig + n)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawMultiplierPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  phi: number,
  noiseOn: boolean,
) {
  if (!colors) return
  const padX = 20,
    padY = 10
  const tWindow = 4
  const tStart = tNow - tWindow * 0.75
  const tEnd = tNow + tWindow * 0.25
  const yLim = 3.2

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + padX, x0 + pw - padX)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + padY + 6, y0 + ph - padY)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padX, yZero)
  ctx.lineTo(x0 + pw - padX, yZero)
  ctx.stroke()

  ctx.fillStyle = COLOR_MULT
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('2.  y(t) = 2 r(t) cos(ω_c t + φ)', x0 + padX, y0 + 12)

  const STEPS = 1500
  // y(t)
  ctx.strokeStyle = COLOR_MULT
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = A_C + A_M * Math.cos(2 * Math.PI * FM * t)
    const r = env * Math.cos(2 * Math.PI * FC * t) + (noiseOn ? noiseAt(t, i) * 0.4 : 0)
    const v = 2 * r * Math.cos(2 * Math.PI * FC * t + phi)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Overlay: baseband target = (A_c + m) cos φ (where the LPF will land)
  ctx.strokeStyle = COLOR_TARGET
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i <= 500; i++) {
    const t = lerp(i, 0, 500, tStart, tEnd)
    const env = A_C + A_M * Math.cos(2 * Math.PI * FM * t)
    const v = env * Math.cos(phi)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('violet διάστικτη = baseband που μένει μετά το LPF', x0 + pw - padX - 4, y0 + 12)
}

function drawRecoveredPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  phi: number,
  noiseOn: boolean,
) {
  if (!colors) return
  const padX = 20,
    padY = 10
  const tWindow = 4
  const tStart = tNow - tWindow * 0.75
  const tEnd = tNow + tWindow * 0.25
  const yLim = 1
  const cosPhi = Math.cos(phi)

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + padX, x0 + pw - padX)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + padY + 6, y0 + ph - padY)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padX, yZero)
  ctx.lineTo(x0 + pw - padX, yZero)
  ctx.stroke()

  ctx.fillStyle = COLOR_REC
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('3.  m̂(t) = m(t) cos φ  (μετά LPF + DC removal)', x0 + padX, y0 + 12)

  // Target m(t) — violet dashed
  ctx.strokeStyle = COLOR_TARGET
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 500
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = A_M * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(m)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Recovered m̂(t) — green solid
  ctx.strokeStyle = COLOR_REC
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = A_M * Math.cos(2 * Math.PI * FM * t)
    const noise = noiseOn ? lowfreqNoise(t, i) * 0.15 : 0
    const v = m * cosPhi + noise
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Add scale label
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(
    `gain = cos φ = ${cosPhi.toFixed(2)}${noiseOn ? '  + n_low(t)' : ''}`,
    x0 + pw - padX - 4,
    y0 + 12,
  )
}

// Deterministic-ish bandpass noise approximant for the input
function noiseAt(t: number, i: number): number {
  return (
    Math.sin(2 * Math.PI * FC * t + 5 * Math.sin(t * 1.3 + i * 0.07)) *
    Math.sin(t * 2.1 + i * 0.03)
  )
}

// Low-frequency noise approximant
function lowfreqNoise(t: number, i: number): number {
  return Math.sin(t * 3.7 + i * 0.05) * Math.cos(t * 5.1 + i * 0.02)
}
