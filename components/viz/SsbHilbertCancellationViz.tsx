'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * SSB Hilbert cancellation — the algebra that makes SSB work, in the frequency
 * domain. Three stacked panels share an x-axis (f) so the reader can see
 * term-by-term how m(t)·cos ∓ m̂(t)·sin cancels one sideband and doubles the
 * other.
 *
 * Panel A:  ½M(f−f_c) + ½M(f+f_c)            ← spectrum of m(t)·cos(2π f_c t)
 *           DSB-SC: both halves at every ±f_c, positive, blue.
 *
 * Panel B:  −½ sgn(f−f_c) M(f−f_c) + ½ sgn(f+f_c) M(f+f_c)
 *           ← spectrum of m̂(t)·sin(2π f_c t), using m̂ = -j sgn(f) m.
 *           Anti-symmetric around each ±f_c: positive on the inner halves
 *           (between ±f_c), negative on the outer halves.
 *
 * Panel C (toggle USB / LSB):
 *   USB (−):  A − B  → outer halves double (+1), inner halves cancel (0).
 *   LSB (+):  A + B  → inner halves double (+1), outer halves cancel (0).
 *   Surviving spectrum drawn solid green; cancelled-DSB sidebands drawn as
 *   dashed grey "ghost" outlines so the reader sees what was killed.
 *
 * Why this viz: the page already states the identity m·cos ∓ m̂·sin. The
 * student needs to see WHY one sideband cancels — not as algebra but as
 * point-by-point spectral addition. This viz makes the "+/−" choice visceral:
 * it literally is the choice of which half survives.
 */

type Sign = 'minus' | 'plus' // 'minus' = USB (−), 'plus' = LSB (+)

const FC = 4 // visual carrier position
const W = 1.2 // message half-bandwidth (visual units)
const F_MAX = FC + W + 1.1

const COLOR_BASE = 'rgb(29, 78, 216)' // blue — m·cos
const FILL_BASE = 'rgba(29, 78, 216, 0.30)'
const COLOR_POS = 'rgb(217, 119, 6)' // amber — Hilbert, positive lobe
const FILL_POS = 'rgba(217, 119, 6, 0.30)'
const COLOR_NEG = 'rgb(220, 38, 38)' // red — Hilbert, negative lobe
const FILL_NEG = 'rgba(220, 38, 38, 0.30)'
const COLOR_OK = 'rgb(22, 163, 74)' // green — surviving
const FILL_OK = 'rgba(22, 163, 74, 0.45)'
const COLOR_GHOST = 'rgb(148, 163, 184)' // slate — cancelled (ghost)
const FILL_GHOST = 'rgba(148, 163, 184, 0.10)'

const PAD_X = 36
const PAD_Y = 12
const PANEL_GAP = 6

export function SsbHilbertCancellationViz() {
  const [sign, setSign] = useState<Sign>('minus')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, sign)
  }, [sign])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, sign)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sign])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Hilbert cancellation — γιατί η μία πλευρά εξαφανίζεται στο φάσμα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Η ταυτότητα <span className="font-mono">x_SSB = m·cos ∓ m̂·sin</span>{' '}
        δεν είναι μαγική — είναι <strong>αριθμητική στο φάσμα</strong>.{' '}
        <span className="text-fg">Πάνω</span>: το φάσμα από{' '}
        <span className="font-mono">m·cos</span> (DSB-SC, και τα δύο sidebands
        παρόντα, μπλε). <span className="text-fg">Μέση</span>: το φάσμα από{' '}
        <span className="font-mono">m̂·sin</span> — αντι-συμμετρικό γύρω από
        κάθε <span className="font-mono">±f_c</span> εξαιτίας του{' '}
        <span className="font-mono">−j sgn(f)</span> του Hilbert (πορτοκαλί =
        θετικό, κόκκινο = αρνητικό). <span className="text-fg">Κάτω</span>:
        αφαίρεση (USB) ή πρόσθεση (LSB). Η μία πλευρά διπλασιάζεται,{' '}
        <strong>η άλλη ακριβώς μηδενίζεται</strong>.
      </p>

      <div
        role="radiogroup"
        aria-label="SSB sign convention"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        <button
          type="button"
          role="radio"
          aria-checked={sign === 'minus'}
          onClick={() => setSign('minus')}
          className={cn(
            'rounded-full px-3 py-0.5 transition-colors',
            sign === 'minus' ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
          )}
        >
          m·cos <strong>−</strong> m̂·sin  =  USB
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={sign === 'plus'}
          onClick={() => setSign('plus')}
          className={cn(
            'rounded-full px-3 py-0.5 transition-colors',
            sign === 'plus' ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
          )}
        >
          m·cos <strong>+</strong> m̂·sin  =  LSB
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="SSB Hilbert cancellation: spectrum of m·cos, m̂·sin, and their signed sum across three stacked panels"
      />

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-emerald-400/40 bg-emerald-50/40 px-3 py-2 dark:bg-emerald-400/10">
          <strong>USB (−):</strong> οι «εξωτερικές» πλευρές (έξω από{' '}
          <span className="font-mono">±f_c</span>) διπλασιάζονται, οι
          «εσωτερικές» μηδενίζονται. Το φάσμα ζει στο{' '}
          <span className="font-mono">|f| &gt; f_c</span> — Upper Sideband.
        </div>
        <div className="rounded-md border border-violet-400/40 bg-violet-50/40 px-3 py-2 dark:bg-violet-400/10">
          <strong>LSB (+):</strong> οι «εσωτερικές» πλευρές (μέσα από{' '}
          <span className="font-mono">±f_c</span>, κοντά στο 0) διπλασιάζονται,
          οι «εξωτερικές» μηδενίζονται. Το φάσμα ζει στο{' '}
          <span className="font-mono">|f| &lt; f_c</span> — Lower Sideband.
        </div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  sign: Sign,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const panelH = (h - PAD_Y * 2 - PANEL_GAP * 2) / 3

  const labels: Array<{ y0: number; title: string; sub: string }> = [
    {
      y0: PAD_Y,
      title: 'A.  m(t)·cos(2π f_c t)',
      sub: '½M(f−f_c) + ½M(f+f_c) — όλα τα μισά παρόντα',
    },
    {
      y0: PAD_Y + panelH + PANEL_GAP,
      title: 'B.  m̂(t)·sin(2π f_c t)',
      sub: '−½ sgn(f−f_c) M(f−f_c) + ½ sgn(f+f_c) M(f+f_c)',
    },
    {
      y0: PAD_Y + (panelH + PANEL_GAP) * 2,
      title:
        sign === 'minus'
          ? 'C.  A − B  =  USB  (διπλασιάζεται έξω, μηδενίζεται μέσα)'
          : 'C.  A + B  =  LSB  (διπλασιάζεται μέσα, μηδενίζεται έξω)',
      sub:
        sign === 'minus'
          ? 'υπολειπόμενο φάσμα: |f| > f_c'
          : 'υπολειπόμενο φάσμα: |f| < f_c',
    },
  ]

  drawPanelA(ctx, colors, w, labels[0].y0, panelH, labels[0].title, labels[0].sub)
  drawPanelB(ctx, colors, w, labels[1].y0, panelH, labels[1].title, labels[1].sub)
  drawPanelC(ctx, colors, w, labels[2].y0, panelH, labels[2].title, labels[2].sub, sign)
}

function bgMaskColor(colors: ReturnType<typeof getThemeColors>, alpha = 0.92): string {
  if (!colors) return `rgba(255, 255, 255, ${alpha})`
  const m = colors.bg.match(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)/)
  if (!m) return `rgba(255, 255, 255, ${alpha})`
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.1, -1.1, y0 + 4, y0 + ph - 12)
  const yZero = yv(0)

  // Panel background (soft)
  ctx.fillStyle = 'rgba(148, 163, 184, 0.04)'
  ctx.fillRect(PAD_X - 6, y0, w - 2 * PAD_X + 12, ph)

  // Zero (frequency) line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Axis arrow
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(w - PAD_X + 6, yZero)
  ctx.lineTo(w - PAD_X - 3, yZero - 4)
  ctx.lineTo(w - PAD_X - 3, yZero + 4)
  ctx.closePath()
  ctx.fill()

  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'left'
  ctx.fillText('f', w - PAD_X + 12, yZero + 4)

  // Tick labels at ±f_c and 0
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)
}

function drawPanelLabels(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  y0: number,
  title: string,
  sub: string,
) {
  if (!colors) return

  ctx.textAlign = 'left'

  // Measure both lines so we can mask the union
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  const titleW = ctx.measureText(title).width
  ctx.font = '9.5px ui-sans-serif, system-ui, sans-serif'
  const subW = ctx.measureText(sub).width
  const maxW = Math.max(titleW, subW)

  // Translucent background mask so graph elements behind don't bleed into the text
  ctx.fillStyle = bgMaskColor(colors)
  ctx.fillRect(PAD_X - 9, y0, maxW + 8, 30)

  // Title + subtitle (top-left of panel) — drawn AFTER the spectrum so they
  // sit on top of any overlapping triangles or annotation labels.
  ctx.fillStyle = colors.fg
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(title, PAD_X - 6, y0 + 12)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9.5px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(sub, PAD_X - 6, y0 + 24)
}

function fillTriangle(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  base1: number,
  apex: number,
  base2: number,
  height: number,
  fill: string,
  stroke: string,
  lw = 1.3,
  dashed = false,
) {
  const yZero = yv(0)
  ctx.beginPath()
  ctx.moveTo(xt(base1), yZero)
  ctx.lineTo(xt(apex), yv(height))
  ctx.lineTo(xt(base2), yZero)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = lw
  if (dashed) ctx.setLineDash([3, 3])
  ctx.stroke()
  if (dashed) ctx.setLineDash([])
}

function drawPanelA(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
  title: string,
  sub: string,
) {
  if (!colors) return
  drawAxis(ctx, colors, w, y0, ph)
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.1, -1.1, y0 + 4, y0 + ph - 12)

  // Two triangles, full bumps, height ½, at ±f_c
  fillTriangle(ctx, xt, yv, FC - W, FC, FC + W, 0.5, FILL_BASE, COLOR_BASE)
  fillTriangle(ctx, xt, yv, -FC - W, -FC, -FC + W, 0.5, FILL_BASE, COLOR_BASE)

  // Label peaks with "½"
  ctx.fillStyle = COLOR_BASE
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('½', xt(FC), yv(0.5) - 3)
  ctx.fillText('½', xt(-FC), yv(0.5) - 3)

  drawPanelLabels(ctx, colors, y0, title, sub)
}

function drawPanelB(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
  title: string,
  sub: string,
) {
  if (!colors) return
  drawAxis(ctx, colors, w, y0, ph)
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.1, -1.1, y0 + 4, y0 + ph - 12)

  // Around +f_c:
  //   inner (left of +f_c, f < f_c, closer to 0): POSITIVE, half-triangle height +½
  //   outer (right of +f_c): NEGATIVE, half-triangle height −½ (drawn pointing down)
  fillTriangle(ctx, xt, yv, FC - W, FC, FC, 0.5, FILL_POS, COLOR_POS)
  fillTriangle(ctx, xt, yv, FC, FC, FC + W, -0.5, FILL_NEG, COLOR_NEG)

  // Around −f_c:
  //   inner (right of −f_c, f > −f_c, closer to 0): POSITIVE, +½
  //   outer (left of −f_c, more negative): NEGATIVE, −½
  fillTriangle(ctx, xt, yv, -FC, -FC, -FC + W, 0.5, FILL_POS, COLOR_POS)
  fillTriangle(ctx, xt, yv, -FC - W, -FC, -FC, -0.5, FILL_NEG, COLOR_NEG)

  // Labels: small annotations on the inner peaks
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = COLOR_POS
  ctx.fillText('+½', xt(FC) - 12, yv(0.5) - 1)
  ctx.fillText('+½', xt(-FC) + 12, yv(0.5) - 1)
  ctx.fillStyle = COLOR_NEG
  ctx.fillText('−½', xt(FC) + 12, yv(-0.5) + 11)
  ctx.fillText('−½', xt(-FC) - 12, yv(-0.5) + 11)

  drawPanelLabels(ctx, colors, y0, title, sub)
}

function drawPanelC(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
  title: string,
  sub: string,
  sign: Sign,
) {
  if (!colors) return
  drawAxis(ctx, colors, w, y0, ph)
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.1, -1.1, y0 + 4, y0 + ph - 12)

  // Compute the four half-triangle outcomes
  // For each of the 4 half-bumps (inner/outer × ±f_c), the value is panelA ± panelB
  // sign 'minus' (USB) → subtract panelB → outer halves: ½ − (−½) = 1; inner: ½ − (+½) = 0
  // sign 'plus'  (LSB) → add panelB     → outer halves: ½ + (−½) = 0; inner: ½ + (+½) = 1
  const outerKept = sign === 'minus'
  const innerKept = sign === 'plus'

  // Helper: draw a half-triangle ghost (cancelled) at given side
  const drawHalfGhost = (
    apex: number,
    edge: number, // the far edge of the half-triangle (apex ± W)
  ) => {
    const base1 = apex
    const base2 = edge
    fillTriangle(ctx, xt, yv, base1, apex, base2, 0.5, FILL_GHOST, COLOR_GHOST, 1, true)
  }

  // Helper: draw a half-triangle solid surviving (height 1) at given side
  const drawHalfKept = (apex: number, edge: number) => {
    fillTriangle(ctx, xt, yv, apex, apex, edge, 1.0, FILL_OK, COLOR_OK, 1.6)
  }

  // Around +f_c
  // inner half = left of f_c → apex=f_c, edge=f_c-W
  // outer half = right of f_c → apex=f_c, edge=f_c+W
  if (innerKept) drawHalfKept(FC, FC - W)
  else drawHalfGhost(FC, FC - W)
  if (outerKept) drawHalfKept(FC, FC + W)
  else drawHalfGhost(FC, FC + W)

  // Around −f_c
  // inner half = right of −f_c (closer to 0) → apex=−f_c, edge=−f_c+W
  // outer half = left of −f_c (more negative) → apex=−f_c, edge=−f_c-W
  if (innerKept) drawHalfKept(-FC, -FC + W)
  else drawHalfGhost(-FC, -FC + W)
  if (outerKept) drawHalfKept(-FC, -FC - W)
  else drawHalfGhost(-FC, -FC - W)

  // Annotate surviving with "1" and cancelled with "0"
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = COLOR_OK
  if (outerKept) {
    ctx.fillText('1', xt(FC + W * 0.5), yv(0.5) - 3)
    ctx.fillText('1', xt(-FC - W * 0.5), yv(0.5) - 3)
  }
  if (innerKept) {
    ctx.fillText('1', xt(FC - W * 0.5), yv(0.5) - 3)
    ctx.fillText('1', xt(-FC + W * 0.5), yv(0.5) - 3)
  }
  ctx.fillStyle = COLOR_GHOST
  ctx.font = '8.5px ui-sans-serif, system-ui, sans-serif'
  if (!outerKept) {
    ctx.fillText('0 (cancelled)', xt(FC + W * 0.5), yv(0.25))
    ctx.fillText('0 (cancelled)', xt(-FC - W * 0.5), yv(0.25))
  }
  if (!innerKept) {
    ctx.fillText('0 (cancelled)', xt(FC - W * 0.5), yv(0.25))
    ctx.fillText('0 (cancelled)', xt(-FC + W * 0.5), yv(0.25))
  }

  drawPanelLabels(ctx, colors, y0, title, sub)
}
