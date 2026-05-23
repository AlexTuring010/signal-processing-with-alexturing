'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Balanced modulator — three-panel time-domain cancellation.
 *
 * Two identical nonlinear branches with opposite-sign message:
 *
 *   y_+ = d_1(m + cos) + d_2(m + cos)²
 *       = [d_1 m + d_2 m²] + d_1 cos + 2 d_2 m·cos + d_2 cos²
 *   y_- = d_1(-m + cos) + d_2(-m + cos)²
 *       = [-d_1 m + d_2 m²] + d_1 cos - 2 d_2 m·cos + d_2 cos²
 *
 * Subtract:
 *   y_+ − y_- = 2 d_1 m + 4 d_2 m·cos
 *
 * Five components in each branch, but THREE of them (d_1 cos, d_2 m², d_2 cos²)
 * are *identical* in the two branches — they cancel under subtraction. Only the
 * antisymmetric parts (d_1 m and 2 d_2 m·cos) survive, doubled. After BPF the
 * baseband 2 d_1 m drops out and you're left with pure DSB-SC: 4 d_2 m·cos.
 *
 * Three stacked panels:
 *   Top:    y_+(t)
 *   Middle: y_-(t)
 *   Bottom: y_+ − y_-  (solid green = survived) + the cancelled common part
 *           shown ghosted (gray) so the student sees what disappeared.
 *
 * Toggle: highlight the "cancelled" common components inside the top/middle
 * panels so the visual story is one click away.
 */

const FC = 6 // visual carrier cycles per t-window
const FM = 0.5 // message frequency
const A_M = 0.8
const D1 = 0.5
const D2 = 0.4

const COLOR_YPLUS = 'rgb(29, 78, 216)' // blue
const COLOR_YMINUS = 'rgb(217, 119, 6)' // amber
const COLOR_DIFF = 'rgb(22, 163, 74)' // green — surviving DSB-SC
const COLOR_CANCELLED = 'rgba(148, 163, 184, 0.6)' // gray — cancelled
const COLOR_ENVELOPE = 'rgba(168, 85, 247, 0.55)' // violet dashed — message envelope

export function BalancedModulatorCancellationViz() {
  const [showCancelled, setShowCancelled] = useState(true)
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
      if (canvas && colors) draw(canvas, colors, tRef.current, showCancelled)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, showCancelled])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Balanced modulator — γιατί ο carrier ακυρώνεται
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
        Δύο πανομοιότυπες μη γραμμικές διόδοι, ένα {' '}
        <span style={{ color: COLOR_YPLUS, fontWeight: 600 }}>y_+(t)</span> από{' '}
        <span className="font-mono">+m(t) + cos</span>, ένα{' '}
        <span style={{ color: COLOR_YMINUS, fontWeight: 600 }}>y_−(t)</span> από{' '}
        <span className="font-mono">−m(t) + cos</span>. Στη διαφορά τους{' '}
        <span style={{ color: COLOR_DIFF, fontWeight: 600 }}>y_+ − y_−</span>{' '}
        επιβιώνουν <strong>μόνο</strong> οι όροι που εμπεριέχουν{' '}
        <span className="font-mono">m</span> (αντισυμμετρικοί). Ο carrier και{' '}
        ο <span className="font-mono">m²</span> και ο{' '}
        <span className="font-mono">cos²</span> ακυρώνονται γιατί είναι{' '}
        <strong>ίδιοι</strong> στις δύο πλευρές.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Balanced modulator three-panel cancellation"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowCancelled((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition',
            showCancelled
              ? 'border-accent/60 bg-accent-soft/40 text-fg'
              : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/40',
          )}
          aria-pressed={showCancelled}
        >
          {showCancelled ? 'Απόκρυψη' : 'Δείξε'} κοινών όρων{' '}
          (<span className="font-mono">d₁cos + d₂m² + d₂cos²</span>)
        </button>
      </div>

      <div className="mt-3 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs text-green-800 dark:text-green-200">
        <strong>Αποτέλεσμα.</strong>{' '}
        <span className="font-mono">y_+ − y_− = 2 d₁ m(t) + 4 d₂ m(t)·cos(ω_c t)</span>.
        Μετά από BPF γύρω από <span className="font-mono">f_c</span> μένει
        καθαρό DSB-SC: <span className="font-mono">4 d₂ m(t)·cos(ω_c t)</span>.
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tNow: number,
  showCancelled: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  const padX = 22

  drawPanel(ctx, colors, 0, 0, w, rowH, padX, tNow, 'plus', showCancelled)
  drawPanel(ctx, colors, 0, rowH, w, rowH, padX, tNow, 'minus', showCancelled)
  drawPanel(ctx, colors, 0, 2 * rowH, w, rowH, padX, tNow, 'diff', showCancelled)
}

type Mode = 'plus' | 'minus' | 'diff'

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  padX: number,
  tNow: number,
  mode: Mode,
  showCancelled: boolean,
) {
  if (!colors) return
  const padY = 10
  const tWindow = 4
  const tStart = tNow - tWindow * 0.75
  const tEnd = tNow + tWindow * 0.25
  const yLim = 2.6

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + padX, x0 + pw - padX)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + padY + 6, y0 + ph - padY)
  const yZero = yv(0)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padX, yZero)
  ctx.lineTo(x0 + pw - padX, yZero)
  ctx.stroke()

  // panel label (left side)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  let title = ''
  let color = colors.fg
  if (mode === 'plus') {
    title = 'y₊(t)  = d₁(m + cos) + d₂(m + cos)²'
    color = COLOR_YPLUS
  } else if (mode === 'minus') {
    title = 'y₋(t)  = d₁(−m + cos) + d₂(−m + cos)²'
    color = COLOR_YMINUS
  } else {
    title = 'y₊ − y₋  = 2 d₁ m(t) + 4 d₂ m(t)·cos(ω_c t)'
    color = COLOR_DIFF
  }
  ctx.fillStyle = color
  ctx.fillText(title, x0 + padX, y0 + 12)

  const STEPS = 1100
  // Sample everything sample-wise so we can compute and draw multiple
  // overlays cheaply.
  if (mode === 'plus' || mode === 'minus') {
    const sign = mode === 'plus' ? +1 : -1
    // Total
    ctx.strokeStyle = mode === 'plus' ? COLOR_YPLUS : COLOR_YMINUS
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const m = sign * A_M * Math.cos(2 * Math.PI * FM * t)
      const c = Math.cos(2 * Math.PI * FC * t)
      const v = D1 * (m + c) + D2 * (m + c) * (m + c)
      const px = xt(t)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    // Show the "common cancelled" components (d_1 cos + d_2 m² + d_2 cos²)
    if (showCancelled) {
      ctx.strokeStyle = COLOR_CANCELLED
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 1.4
      ctx.beginPath()
      for (let i = 0; i <= STEPS; i++) {
        const t = lerp(i, 0, STEPS, tStart, tEnd)
        const m = sign * A_M * Math.cos(2 * Math.PI * FM * t)
        const c = Math.cos(2 * Math.PI * FC * t)
        const v = D1 * c + D2 * m * m + D2 * c * c
        const px = xt(t)
        const py = yv(v)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.setLineDash([])
      // label
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(
        'κοινό (θα ακυρωθεί)',
        x0 + pw - padX - 4,
        y0 + ph - padY - 2,
      )
    }
  } else {
    // mode === 'diff'
    // Surviving difference
    ctx.strokeStyle = COLOR_DIFF
    ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const m = A_M * Math.cos(2 * Math.PI * FM * t)
      const c = Math.cos(2 * Math.PI * FC * t)
      const v = 2 * D1 * m + 4 * D2 * m * c
      const px = xt(t)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    // Envelope ±2 d_1 m + 4 d_2 m: it's the slow message envelope of the DSB-SC term
    ctx.strokeStyle = COLOR_ENVELOPE
    ctx.setLineDash([4, 4])
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const m = A_M * Math.cos(2 * Math.PI * FM * t)
      const env = 4 * D2 * m // the DSB-SC envelope (slow)
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const m = A_M * Math.cos(2 * Math.PI * FM * t)
      const env = -4 * D2 * m
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Note label
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('envelope = 4 d₂ m(t)', x0 + pw - padX - 4, y0 + ph - padY - 2)
  }
}
