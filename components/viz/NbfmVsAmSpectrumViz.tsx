'use client'

import { useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { useEffect, useRef } from 'react'

/**
 * NBFM ≈ Conventional AM — same magnitude spectrum, opposite-sign LSB.
 *
 * The prof's slide 33-34 makes this case explicit. Starting from the NBFM
 * approximation:
 *
 *   x_NBFM(t) ≃ A_c cos(2π f_c t) − A_c β_f sin(2π f_m t) sin(2π f_c t)
 *             = A_c cos(2π f_c t)
 *               + (A_c β_f / 2) cos[2π (f_c + f_m) t]
 *               − (A_c β_f / 2) cos[2π (f_c − f_m) t]
 *
 * compare to Conventional AM:
 *
 *   x_AM(t) = A_c cos(2π f_c t)
 *             + (A_c μ / 2) cos[2π (f_c + f_m) t]
 *             + (A_c μ / 2) cos[2π (f_c − f_m) t]
 *
 * Same algebraic skeleton — carrier + 2 sidebands at f_c ± f_m, all with
 * amplitude A_c·(modulation index)/2. The ONLY difference is the sign on the
 * lower sideband: «+» for AM, «−» for NBFM.
 *
 * That sign flip is invisible in a magnitude spectrum but it's THE canonical
 * NBFM vs AM trap on exams. This viz makes it visible by drawing the spectral
 * arrows with their actual sign: AM sidebands point UP, NBFM lower-sideband
 * points DOWN.
 *
 * Visual layout (matches the prof's slide 34 exactly):
 *
 *   ┌────────────────────────────────────────┐
 *   │ m(t)  cosine            │  |M(f)|      │
 *   ├────────────────────────────────────────┤
 *   │ x_NBFM(t)               │  X_NBFM(f)   │
 *   │   (constant envelope)   │   ↑ ↓ ↑      │  ← LSB down
 *   ├────────────────────────────────────────┤
 *   │ x_AM(t)                 │  X_AM(f)     │
 *   │   (modulated envelope)  │   ↑ ↑ ↑      │  ← LSB up
 *   └────────────────────────────────────────┘
 *
 * Controls:
 *   – β_f / μ slider (shared, drives both modulation indices simultaneously)
 *   – «Highlight LSB» toggle: flash the lower sideband on both spectra to
 *     drive the «-» vs «+» comparison home.
 */

const FC = 5
const FM = 0.5

export function NbfmVsAmSpectrumViz() {
  const [beta, setBeta] = useState(0.3)
  const [highlightLsb, setHighlightLsb] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, beta, highlightLsb)
  }, [beta, highlightLsb])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold tracking-tight">
          NBFM vs Συμβατικό AM — ίδιο μέτρο, αντίθετο πρόσημο στο LSB
        </h4>
        <p className="mt-1 text-xs text-fg-muted">
          Slide 33-34 του καθηγητή. Για <span className="font-mono">β_f ≪ 1</span>,
          το NBFM γράφεται{' '}
          <span className="font-mono">
            A_c cos(2π f_c t) + (A_c β_f / 2) cos[2π(f_c+f_m)t] <strong>−</strong>{' '}
            (A_c β_f / 2) cos[2π(f_c−f_m)t]
          </span>{' '}
          — ίδια αλγεβρική δομή με AM, αλλά <strong>μείον</strong> στο LSB
          αντί για <strong>συν</strong>. Στο φάσμα φαίνεται με αντίθετα βέλη.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="NBFM vs AM 4-panel comparison"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β_f (NBFM) = μ (AM) ={' '}
          <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          {' · '}
          {beta < 0.3 ? (
            <span className="text-emerald-700 dark:text-emerald-400">
              «καθαρά» NBFM (β ≪ 1, η γραμμικοποίηση ισχύει)
            </span>
          ) : beta < 0.7 ? (
            <span className="text-amber-600 dark:text-amber-400">
              οριακό NBFM — η προσέγγιση sin(φ)≈φ αρχίζει να σφάλλει
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">
              πέρα από NBFM — εμφανίζονται sideband |n|≥2 που η γραμμικοποίηση
              αγνοεί
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.05}
          max={1.0}
          step={0.01}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Shared modulation index β_f and μ"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setHighlightLsb((v) => !v)}
          className={`rounded-md border px-3 py-1 text-xs ${
            highlightLsb
              ? 'border-red-400 bg-red-50 text-red-700 dark:bg-red-400/20 dark:text-red-300'
              : 'border-border bg-bg-soft hover:border-accent/50'
          }`}
        >
          {highlightLsb ? '🔴 LSB highlight ON' : 'LSB highlight OFF'}
        </button>
        <span className="text-xs text-fg-subtle">
          (φωτίζει την κάτω sideband και στα δύο φάσματα — δες πώς δείχνουν
          προς αντίθετες κατευθύνσεις)
        </span>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs leading-relaxed">
        <strong>Η παγίδα στις εξετάσεις:</strong> ένα Σ/Λ ερώτημα της μορφής
        «NBFM και AM έχουν ταυτόσημο φάσμα» είναι <strong>ΛΑΘΟΣ</strong> —
        έχουν ίδιο <em>μέτρο</em> αλλά αντίθετο πρόσημο στο LSB, που σημαίνει
        αντίθετη <em>φάση</em> των sideband. Το AM έχει envelope =
        |A_c + m·cos|, το NBFM έχει envelope σταθερό. Στο χρόνο φαίνεται αμέσως
        — στην αριστερή στήλη συγκρίνεις πλάτη.
      </div>
    </figure>
  )
}

const COL_NBFM = 'rgb(29, 78, 216)' // blue
const COL_AM = 'rgb(217, 119, 6)' // amber
const COL_MSG = 'rgb(168, 85, 247)' // violet
const COL_LSB_HIGHLIGHT = 'rgb(220, 38, 38)' // red

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  highlightLsb: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  const colSplit = Math.round(w * 0.55)

  // Row 1: message m(t)  and |M(f)|
  drawMessageTime(ctx, colors, 0, 0, colSplit, rowH)
  drawMessageSpectrum(ctx, colors, colSplit, 0, w - colSplit, rowH)
  // Row 2: x_NBFM(t)  and X_NBFM(f)
  drawNbfmTime(ctx, colors, 0, rowH, colSplit, rowH, beta)
  drawNbfmSpectrum(ctx, colors, colSplit, rowH, w - colSplit, rowH, beta, highlightLsb)
  // Row 3: x_AM(t)  and X_AM(f)
  drawAmTime(ctx, colors, 0, 2 * rowH, colSplit, rowH, beta)
  drawAmSpectrum(ctx, colors, colSplit, 2 * rowH, w - colSplit, rowH, beta, highlightLsb)

  // separators between rows
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  for (let r = 1; r < 3; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * rowH)
    ctx.lineTo(w, r * rowH)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(colSplit, 0)
  ctx.lineTo(colSplit, h)
  ctx.stroke()
}

function panelHeader(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  text: string,
  color = '',
) {
  if (!colors) return
  ctx.fillStyle = color || colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(text, x + 10, y + 14)
}

function drawMessageTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  panelHeader(ctx, colors, x0, y0, 'm(t) = cos(2π f_m t)', COL_MSG)
  const pad = 12
  const top = y0 + pad + 10
  const bot = y0 + ph - pad
  const left = x0 + pad + 18
  const right = x0 + pw - pad
  const yZero = (top + bot) / 2

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, yZero)
  ctx.lineTo(right, yZero)
  ctx.stroke()

  ctx.strokeStyle = COL_MSG
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const N = 200
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 4
    const v = Math.cos(2 * Math.PI * FM * t)
    const px = left + (i / N) * (right - left)
    const py = yZero - v * (bot - top) * 0.4
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawMessageSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  panelHeader(ctx, colors, x0, y0, '|M(f)| — 2 κρούσεις στα ±f_m', COL_MSG)
  const pad = 12
  const top = y0 + pad + 10
  const bot = y0 + ph - pad
  const left = x0 + pad + 12
  const right = x0 + pw - pad
  const yZero = bot - 4
  const xMid = (left + right) / 2

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, yZero)
  ctx.lineTo(right, yZero)
  ctx.stroke()

  // f axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xMid, yZero + 12)
  ctx.fillText('+f_m', xMid + 40, yZero + 12)
  ctx.fillText('−f_m', xMid - 40, yZero + 12)

  // 2 impulses at ±f_m
  ctx.strokeStyle = COL_MSG
  ctx.lineWidth = 2
  drawImpulse(ctx, xMid - 40, yZero, top + (bot - top) * 0.45, +1, COL_MSG)
  drawImpulse(ctx, xMid + 40, yZero, top + (bot - top) * 0.45, +1, COL_MSG)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('A_m/2', xMid - 38, top + (bot - top) * 0.45 - 2)
  ctx.fillText('A_m/2', xMid + 42, top + (bot - top) * 0.45 - 2)
}

function drawNbfmTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
) {
  if (!colors) return
  panelHeader(
    ctx,
    colors,
    x0,
    y0,
    'x_NBFM(t) — σταθερό envelope = A_c',
    COL_NBFM,
  )
  const pad = 12
  const top = y0 + pad + 10
  const bot = y0 + ph - pad
  const left = x0 + pad + 18
  const right = x0 + pw - pad
  const yZero = (top + bot) / 2
  const A = (bot - top) * 0.42

  // envelope hint (constant)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, yZero - A)
  ctx.lineTo(right, yZero - A)
  ctx.moveTo(left, yZero + A)
  ctx.lineTo(right, yZero + A)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.strokeStyle = COL_NBFM
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const N = 1500
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 4
    const phi = beta * Math.sin(2 * Math.PI * FM * t)
    const v = Math.cos(2 * Math.PI * FC * t + phi)
    const px = left + (i / N) * (right - left)
    const py = yZero - v * A
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+A_c', left - 3, yZero - A + 3)
  ctx.fillText('−A_c', left - 3, yZero + A + 3)
}

function drawAmTime(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
) {
  if (!colors) return
  panelHeader(
    ctx,
    colors,
    x0,
    y0,
    'x_AM(t) — envelope = A_c[1 + μ cos(2π f_m t)]',
    COL_AM,
  )
  const pad = 12
  const top = y0 + pad + 10
  const bot = y0 + ph - pad
  const left = x0 + pad + 18
  const right = x0 + pw - pad
  const yZero = (top + bot) / 2
  const A = (bot - top) * 0.42

  // envelope traces (vary)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  const M = 240
  for (const s of [+1, -1]) {
    for (let i = 0; i <= M; i++) {
      const t = (i / M) * 4
      const env = (1 + mu * Math.cos(2 * Math.PI * FM * t)) / (1 + mu)
      const px = left + (i / M) * (right - left)
      const py = yZero - s * env * A
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
  ctx.setLineDash([])

  ctx.strokeStyle = COL_AM
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const N = 1500
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 4
    const env = (1 + mu * Math.cos(2 * Math.PI * FM * t)) / (1 + mu)
    const v = env * Math.cos(2 * Math.PI * FC * t)
    const px = left + (i / N) * (right - left)
    const py = yZero - v * A
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+A_c', left - 3, yZero - A + 3)
  ctx.fillText('−A_c', left - 3, yZero + A + 3)
}

function drawNbfmSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
  highlight: boolean,
) {
  if (!colors) return
  panelHeader(ctx, colors, x0, y0, 'X_NBFM(f) — LSB πάει ΚΑΤΩ (−)', COL_NBFM)
  drawAmFamilySpectrum(
    ctx,
    colors,
    x0,
    y0,
    pw,
    ph,
    beta,
    /*lsbSign=*/ -1,
    COL_NBFM,
    highlight,
    'β_f',
  )
}

function drawAmSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  highlight: boolean,
) {
  if (!colors) return
  panelHeader(ctx, colors, x0, y0, 'X_AM(f) — LSB πάει ΠΑΝΩ (+)', COL_AM)
  drawAmFamilySpectrum(
    ctx,
    colors,
    x0,
    y0,
    pw,
    ph,
    mu,
    /*lsbSign=*/ +1,
    COL_AM,
    highlight,
    'μ',
  )
}

function drawAmFamilySpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  modIdx: number,
  lsbSign: 1 | -1,
  color: string,
  highlight: boolean,
  indexLabel: string,
) {
  if (!colors) return
  const pad = 12
  const top = y0 + pad + 16
  const bot = y0 + ph - pad
  const left = x0 + pad + 12
  const right = x0 + pw - pad
  const yZero = (top + bot) * 0.55
  const xMid = (left + right) / 2

  // f axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, yZero)
  ctx.lineTo(right, yZero)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xMid, yZero + 12)
  ctx.fillText('f_c−f_m', xMid - 50, yZero + 12)
  ctx.fillText('f_c+f_m', xMid + 50, yZero + 12)

  // carrier impulse (always positive, height A_c — normalized to 0.9)
  const aCarrier = 0.9
  drawImpulse(
    ctx,
    xMid,
    yZero,
    yZero - aCarrier * (yZero - top),
    +1,
    color,
  )

  // USB impulse (always +)
  const sbHeight = modIdx * 0.45
  const ySbTop = yZero - sbHeight * (yZero - top)
  drawImpulse(ctx, xMid + 50, yZero, ySbTop, +1, color)

  // LSB impulse (sign depends on modulation type)
  const lsbColor = highlight ? COL_LSB_HIGHLIGHT : color
  const lsbWidth = highlight ? 3 : 2
  if (lsbSign > 0) {
    // up — same as USB
    drawImpulse(ctx, xMid - 50, yZero, ySbTop, +1, lsbColor, lsbWidth)
  } else {
    // down — reflected across the axis
    const yBelow = yZero + sbHeight * (bot - yZero) * 0.6
    drawImpulse(ctx, xMid - 50, yZero, yBelow, -1, lsbColor, lsbWidth)
  }

  // amplitude labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('A_c', xMid + 4, yZero - aCarrier * (yZero - top) + 3)
  ctx.fillText(
    `+A_c·${indexLabel}/2`,
    xMid + 54,
    ySbTop + 3,
  )
  if (lsbSign > 0) {
    ctx.textAlign = 'right'
    ctx.fillText(`+A_c·${indexLabel}/2`, xMid - 54, ySbTop + 3)
  } else {
    ctx.textAlign = 'right'
    ctx.fillStyle = highlight ? COL_LSB_HIGHLIGHT : colors.fgSubtle
    ctx.fillText(
      `−A_c·${indexLabel}/2`,
      xMid - 54,
      yZero + sbHeight * (bot - yZero) * 0.6 + 3,
    )
  }
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTip: number,
  sign: 1 | -1,
  color: string,
  width = 2,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTip)
  ctx.stroke()
  // arrowhead
  const head = 5
  ctx.beginPath()
  if (sign > 0) {
    ctx.moveTo(x, yTip)
    ctx.lineTo(x - head, yTip + head)
    ctx.lineTo(x + head, yTip + head)
  } else {
    ctx.moveTo(x, yTip)
    ctx.lineTo(x - head, yTip - head)
    ctx.lineTo(x + head, yTip - head)
  }
  ctx.closePath()
  ctx.fill()
}
