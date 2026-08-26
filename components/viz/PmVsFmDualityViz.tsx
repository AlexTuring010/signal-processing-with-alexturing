'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * PM ↔ FM duality — slides 12-13.
 *
 * The prof's slides give the exact constants that link the two modulators:
 *
 *   • An FM signal can be produced by a PM modulator IF you pre-integrate the
 *     message: feed ∫m(τ)dτ into a PM modulator with K_p = 2π K_f.
 *
 *   • Conversely, a PM signal can be produced by an FM modulator IF you
 *     pre-differentiate the message: feed dm/dt into an FM modulator with
 *     K_f = K_p / (2π).
 *
 * This viz shows BOTH directions as block diagrams plus the time-domain
 * output, with a single shared message m(t) and a shape selector. The
 * student watches the output of «PM modulator on ∫m» line up identically
 * with «direct FM on m», and similarly for the reverse direction. The K
 * conversion is highlighted on the connecting arrow.
 *
 * Layout (block-diagram style, two rows):
 *
 *   Top row — «Πώς φτιάχνω FM χρησιμοποιώντας PM»
 *     m(t) ──▶ [ ∫ dt ] ──▶ [ PM mod, K_p = 2π K_f ] ──▶ x_FM(t)
 *                                                          ║
 *                                                          ▼  (overlay with «direct FM»)
 *     m(t) ─────────────────▶ [ FM mod, K_f ] ──────▶ x_FM(t)
 *
 *   Bottom row — «Πώς φτιάχνω PM χρησιμοποιώντας FM»
 *     m(t) ──▶ [ d/dt ] ──▶ [ FM mod, K_f = K_p/(2π) ] ──▶ x_PM(t)
 *                                                            ║
 *                                                            ▼  (overlay with «direct PM»)
 *     m(t) ─────────────────▶ [ PM mod, K_p ] ──────▶ x_PM(t)
 */

type Shape = 'cos' | 'tri' | 'ramp'
const SHAPES: { id: Shape; label: string }[] = [
  { id: 'cos', label: 'cos(2π f_m t)' },
  { id: 'tri', label: 'τρίγωνο' },
  { id: 'ramp', label: 'ράμπα + αναπήδηση' },
]

const FC = 6
const FM_BASE = 0.4

export function PmVsFmDualityViz() {
  const [shape, setShape] = useState<Shape>('cos')
  const [direction, setDirection] = useState<'pm-to-fm' | 'fm-to-pm'>('pm-to-fm')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, shape, direction)
  }, [shape, direction])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold tracking-tight">
          PM ↔ FM δυϊκότητα — η μετατροπή με συγκεκριμένη σταθερά
        </h4>
        <p className="mt-1 text-xs text-fg-muted">
          Ένας PM διαμορφωτής που τρέφεται με{' '}
          <span className="font-mono">∫m(τ)dτ</span> παράγει FM όταν{' '}
          <strong>K_p = 2π K_f</strong>. Ένας FM διαμορφωτής που τρέφεται με{' '}
          <span className="font-mono">dm/dt</span> παράγει PM όταν{' '}
          <strong>K_f = K_p/(2π)</strong>. Παρακολούθησε ότι η έξοδος ταυτίζεται
          με την «direct» έκδοση.
        </p>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-subtle">Κατεύθυνση:</span>
        <button
          type="button"
          onClick={() => setDirection('pm-to-fm')}
          className={`rounded-md border px-2.5 py-1 text-xs ${
            direction === 'pm-to-fm'
              ? 'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300'
              : 'border-border bg-bg-soft hover:border-accent/50'
          }`}
        >
          PM ⤳ FM (πρόσθεσε ∫)
        </button>
        <button
          type="button"
          onClick={() => setDirection('fm-to-pm')}
          className={`rounded-md border px-2.5 py-1 text-xs ${
            direction === 'fm-to-pm'
              ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300'
              : 'border-border bg-bg-soft hover:border-accent/50'
          }`}
        >
          FM ⤳ PM (πρόσθεσε d/dt)
        </button>
        <span className="ml-3 text-xs text-fg-subtle">Σχήμα m(t):</span>
        {SHAPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShape(s.id)}
            className={`rounded-md border px-2 py-0.5 text-xs ${
              shape === s.id
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border bg-bg-soft hover:border-accent/50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 430 }}
        className="block h-[430px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="PM/FM duality block diagram"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs leading-relaxed">
        <strong>Γιατί δουλεύει:</strong> ένας PM διαμορφωτής βάζει φάση{' '}
        <span className="font-mono">φ(t) = K_p · u(t)</span> όπου το{' '}
        <span className="font-mono">u(t)</span> είναι η είσοδος. Αν{' '}
        <span className="font-mono">u(t) = ∫m(τ)dτ</span>, τότε{' '}
        <span className="font-mono">φ(t) = K_p ∫m</span>. Σύγκρινε με την
        γνήσια FM φάση <span className="font-mono">φ(t) = 2π K_f ∫m</span> —
        ταυτίζονται όταν <span className="font-mono">K_p = 2π K_f</span>.
        Πρακτικά, μπορείς να φτιάξεις FM modulator έχοντας μόνο PM hardware +
        έναν integrator — και το αντίστροφο.
      </div>
    </figure>
  )
}

function m_of(t: number, shape: Shape): number {
  switch (shape) {
    case 'cos':
      return Math.cos(2 * Math.PI * FM_BASE * t)
    case 'tri': {
      const period = 1 / FM_BASE
      const tt = ((t % period) + period) % period
      const f = tt / period
      return f < 0.5 ? 4 * f - 1 : 3 - 4 * f
    }
    case 'ramp': {
      const period = 1.5 / FM_BASE
      const tt = ((t % period) + period) % period
      const f = tt / period
      // ramp up to 1 then snap back to -0.3
      return f < 0.7 ? -0.3 + (f / 0.7) * 1.3 : 1 - ((f - 0.7) / 0.3) * 1.3
    }
  }
}

function integrate_m(t: number, shape: Shape, k = 1): number {
  // Numerical integral from 0 to t with small step, k scales output to [-1,1]ish
  const dt = 0.01
  let s = 0
  for (let u = 0; u < t; u += dt) s += m_of(u, shape) * dt
  return s * k
}

const COL_BLOCK = 'rgb(29, 78, 216)' // blue
const COL_BLOCK2 = 'rgb(217, 119, 6)' // amber
const COL_OUT_DUAL = 'rgb(29, 78, 216)' // blue for duality output
const COL_OUT_DIRECT = 'rgb(217, 119, 6)' // amber for direct (overlay)

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  shape: Shape,
  direction: 'pm-to-fm' | 'fm-to-pm',
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Two rows: top = block diagram, bottom = time-domain overlay
  const splitY = h * 0.55
  drawDiagram(ctx, colors, 0, 0, w, splitY, direction)
  drawTimeOverlay(ctx, colors, 0, splitY, w, h - splitY, shape, direction)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, splitY)
  ctx.lineTo(w, splitY)
  ctx.stroke()
}

function drawDiagram(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  direction: 'pm-to-fm' | 'fm-to-pm',
) {
  if (!colors) return
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    direction === 'pm-to-fm'
      ? 'Φτιάχνω FM χρησιμοποιώντας PM modulator'
      : 'Φτιάχνω PM χρησιμοποιώντας FM modulator',
    x0 + 10,
    y0 + 16,
  )

  const yTop = y0 + 50
  const yBot = y0 + ph - 32

  // top chain — duality
  if (direction === 'pm-to-fm') {
    drawChain(
      ctx,
      colors,
      x0 + 10,
      yTop,
      pw - 20,
      [
        { kind: 'pin', label: 'm(t)' },
        { kind: 'block', label: '∫ dt', color: COL_BLOCK2 },
        { kind: 'block', label: 'PM mod', sub: 'K_p = 2π K_f', color: COL_BLOCK },
        { kind: 'pin', label: 'x_FM(t)' },
      ],
    )
    drawChain(
      ctx,
      colors,
      x0 + 10,
      yBot,
      pw - 20,
      [
        { kind: 'pin', label: 'm(t)' },
        { kind: 'spacer' },
        { kind: 'block', label: 'FM mod', sub: 'K_f', color: COL_BLOCK },
        { kind: 'pin', label: 'x_FM(t)' },
      ],
    )
  } else {
    drawChain(
      ctx,
      colors,
      x0 + 10,
      yTop,
      pw - 20,
      [
        { kind: 'pin', label: 'm(t)' },
        { kind: 'block', label: 'd/dt', color: COL_BLOCK2 },
        { kind: 'block', label: 'FM mod', sub: 'K_f = K_p / (2π)', color: COL_BLOCK },
        { kind: 'pin', label: 'x_PM(t)' },
      ],
    )
    drawChain(
      ctx,
      colors,
      x0 + 10,
      yBot,
      pw - 20,
      [
        { kind: 'pin', label: 'm(t)' },
        { kind: 'spacer' },
        { kind: 'block', label: 'PM mod', sub: 'K_p', color: COL_BLOCK },
        { kind: 'pin', label: 'x_PM(t)' },
      ],
    )
  }

  // «equals» between the two chains
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('=', x0 + pw - 30, (yTop + yBot) / 2 + 6)
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('ίδια έξοδος', x0 + pw - 30, (yTop + yBot) / 2 + 22)
}

type ChainItem =
  | { kind: 'pin'; label: string }
  | { kind: 'block'; label: string; sub?: string; color: string }
  | { kind: 'spacer' }

function drawChain(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y: number,
  width: number,
  items: ChainItem[],
) {
  if (!colors) return
  // slot widths: pins narrow, blocks wide, spacers wide
  const slots = items.map((it) =>
    it.kind === 'pin' ? 70 : it.kind === 'spacer' ? 110 : 110,
  )
  const totalSlot = slots.reduce((a, b) => a + b, 0)
  const gap = (width - totalSlot) / (items.length - 1 || 1)

  // draw arrows + items
  let x = x0
  const centers: number[] = []
  for (let i = 0; i < items.length; i++) {
    const sw = slots[i]
    centers.push(x + sw / 2)
    x += sw + gap
  }

  // arrows between centers
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  for (let i = 0; i < items.length - 1; i++) {
    const xa = centers[i] + (items[i].kind === 'pin' ? 28 : slots[i] / 2)
    const xb = centers[i + 1] - (items[i + 1].kind === 'pin' ? 28 : slots[i + 1] / 2)
    if (items[i].kind === 'spacer') continue
    ctx.beginPath()
    ctx.moveTo(xa, y)
    ctx.lineTo(xb, y)
    ctx.stroke()
    // arrow head
    ctx.beginPath()
    ctx.moveTo(xb, y)
    ctx.lineTo(xb - 6, y - 4)
    ctx.lineTo(xb - 6, y + 4)
    ctx.closePath()
    ctx.fillStyle = colors.fgMuted
    ctx.fill()
  }

  // items
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const cx = centers[i]
    if (it.kind === 'pin') {
      ctx.fillStyle = colors.fg
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(it.label, cx, y + 4)
    } else if (it.kind === 'block') {
      const w = slots[i] - 12
      const hBlock = 36
      ctx.fillStyle = colors.bg
      ctx.strokeStyle = it.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(cx - w / 2, y - hBlock / 2, w, hBlock)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = it.color
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(it.label, cx, y + 2)
      if (it.sub) {
        ctx.fillStyle = colors.fgSubtle
        ctx.font = '9px ui-monospace, ui-sans-serif, system-ui, sans-serif'
        ctx.fillText(it.sub, cx, y + 14)
      }
    }
  }
}

function drawTimeOverlay(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  shape: Shape,
  direction: 'pm-to-fm' | 'fm-to-pm',
) {
  if (!colors) return

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    'Χρονική σύγκριση εξόδων — δες ότι τα δύο μονοπάτια ταυτίζονται',
    x0 + 10,
    y0 + 14,
  )

  const pad = 16
  const top = y0 + pad + 14
  const bot = y0 + ph - pad
  const left = x0 + pad
  const right = x0 + pw - pad
  const yZero = (top + bot) / 2
  const A = (bot - top) * 0.42

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, yZero)
  ctx.lineTo(right, yZero)
  ctx.stroke()

  // Choose K such that both paths produce comparable scaled outputs.
  // For pm-to-fm: φ_dual(t) = K_p · ∫m(τ)dτ with K_p = 2π K_f. We pick
  // K_f = 0.6 so the deviation is visible but stays inside the panel.
  const K_f = 0.6
  const K_p = 2 * Math.PI * K_f

  const N = 1600
  for (const trace of ['dual', 'direct'] as const) {
    ctx.beginPath()
    ctx.strokeStyle = trace === 'dual' ? COL_OUT_DUAL : COL_OUT_DIRECT
    ctx.lineWidth = trace === 'dual' ? 1.6 : 1.0
    ctx.setLineDash(trace === 'direct' ? [3, 3] : [])
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 4
      let phase: number
      if (direction === 'pm-to-fm') {
        // both produce FM: φ = 2π K_f ∫m
        if (trace === 'dual') {
          // PM modulator on ∫m: φ = K_p · ∫m = 2π K_f ∫m
          phase = K_p * integrate_m(t, shape)
        } else {
          // direct FM: φ = 2π K_f ∫m
          phase = 2 * Math.PI * K_f * integrate_m(t, shape)
        }
      } else {
        // both produce PM: φ = K_p · m
        // dual path: FM modulator on dm/dt with K_f' = K_p/(2π)
        //           → φ = 2π K_f' · ∫(dm/dτ)dτ = K_p · m(t)
        // direct PM: φ = K_p · m(t)
        // both reduce to the same expression — the equality is literal.
        phase = K_p * m_of(t, shape)
      }
      const v = Math.cos(2 * Math.PI * FC * t + phase)
      const px = left + (i / N) * (right - left)
      const py = yZero - v * A
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  const lgY = top - 2
  ctx.fillStyle = COL_OUT_DUAL
  ctx.fillRect(left + 100, lgY - 6, 14, 2)
  ctx.fillText(' duality path (συμπαγής)', left + 116, lgY)
  ctx.fillStyle = COL_OUT_DIRECT
  ctx.fillRect(left + 270, lgY - 6, 14, 2)
  ctx.fillText(' direct path (διακεκομμένη)', left + 286, lgY)
}
