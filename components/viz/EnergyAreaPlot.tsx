'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Shows a signal x(t) together with the SHADED area under |x(t)|² — which is
 * exactly its energy. The point is visual: when the signal dies out (or has
 * finite duration) the shaded region is a bounded patch, so the energy is a
 * finite number. Used inside the energy worked example on /foundations/signals.
 */

type Kind = 'exp' | 'rect' | 'cos' | 'ramp'

type Config = {
  /** The signal x(t). */
  x: (t: number) => number
  xRange: [number, number]
  yRange: [number, number]
  xMarks: { x: number; label: string }[]
  /** Where to print the energy value, in math coords, inside the shaded area. */
  energyAt: { x: number; y: number }
  energyText: string
  /** When true, the |x|² area keeps growing → the energy diverges. */
  diverges?: boolean
  caption: string
  ariaLabel: string
}

const CONFIGS: Record<Kind, Config> = {
  exp: {
    x: (t) => (t >= 0 ? Math.exp(-t) : 0),
    xRange: [-1, 5],
    yRange: [-0.12, 1.12],
    xMarks: [
      { x: 0, label: '0' },
      { x: 1, label: '1' },
      { x: 2, label: '2' },
      { x: 3, label: '3' },
      { x: 4, label: '4' },
    ],
    energyAt: { x: 0.62, y: 0.15 },
    energyText: 'E = ½',
    caption:
      'x(t) = e⁻ᵗ u(t): η ουρά σβήνει στο 0, οπότε το πράσινο εμβαδόν (το ∫|x|²) σταματάει να μεγαλώνει — η ενέργεια είναι πεπερασμένη.',
    ariaLabel: 'Decaying exponential with the shaded finite energy area under |x|²',
  },
  rect: {
    x: (t) => (Math.abs(t) <= 1 ? 1 : 0),
    xRange: [-3, 3],
    yRange: [-0.12, 1.12],
    xMarks: [
      { x: -1, label: '−1' },
      { x: 0, label: '0' },
      { x: 1, label: '1' },
    ],
    energyAt: { x: 0, y: 0.45 },
    energyText: 'E = 2',
    caption:
      'Π(t/2): ύψος 1 σε πλάτος 2. Εδώ x = |x|² (τιμές 0 ή 1), άρα το εμβαδόν είναι απλώς 1 × 2 = 2. Πεπερασμένο.',
    ariaLabel: 'Rectangular pulse with the shaded finite energy area',
  },
  cos: {
    x: (t) => Math.cos(2 * Math.PI * t),
    xRange: [0, 4],
    yRange: [-1.12, 1.12],
    xMarks: [
      { x: 0, label: '0' },
      { x: 1, label: '1' },
      { x: 2, label: '2' },
      { x: 3, label: '3' },
      { x: 4, label: '4' },
    ],
    energyAt: { x: 2, y: 0.62 },
    energyText: 'E → ∞',
    diverges: true,
    caption:
      'cos(2πt): δεν σβήνει ποτέ. Κάθε περίοδος προσθέτει άλλο ½ στο πράσινο εμβαδόν, οπότε αυτό μεγαλώνει χωρίς όριο → E = ∞ (δεν είναι σήμα ενέργειας).',
    ariaLabel: 'Cosine whose |x|² area grows without bound, so its energy is infinite',
  },
  ramp: {
    x: (t) => (t >= 0 ? t : 0),
    xRange: [-0.4, 2.6],
    yRange: [-0.3, 7],
    xMarks: [
      { x: 0, label: '0' },
      { x: 1, label: '1' },
      { x: 2, label: '2' },
    ],
    energyAt: { x: 2.0, y: 2.3 },
    energyText: 'E, P → ∞',
    diverges: true,
    caption:
      'Ράμπα t·u(t): το |x|² = t² μεγαλώνει ολοένα και πιο γρήγορα. Δεν αποκλίνει μόνο η ενέργεια — αποκλίνει και ο μέσος όρος (η ισχύς). Γι’ αυτό η ράμπα είναι «ούτε-ούτε».',
    ariaLabel: 'Ramp whose squared area diverges — neither an energy nor a power signal',
  },
}

export function EnergyAreaPlot({ kind }: { kind: Kind }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cfg = CONFIGS[kind]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    draw(canvas, colors, cfg)
  }, [cfg])

  return (
    <figure className="my-3 rounded-md border border-border bg-bg-elevated p-2">
      <canvas
        ref={canvasRef}
        style={{ height: 150 }}
        className="block h-[150px] w-full"
        aria-label={cfg.ariaLabel}
      />
      <figcaption className="mt-1 text-center text-xs text-fg-muted">{cfg.caption}</figcaption>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  cfg: Config,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padX = 24
  const padTop = 16
  const padBot = 20
  const [x0r, x1r] = cfg.xRange
  const [yLo, yHi] = cfg.yRange
  const px = (x: number) => lerp(x, x0r, x1r, padX, w - padX)
  const py = (y: number) => lerp(y, yLo, yHi, h - padBot, padTop)
  const yZero = py(0)
  const sq = (t: number) => {
    const v = cfg.x(t)
    return v * v
  }

  // Axes: t-axis and (if in range) the vertical t=0 line.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, yZero)
  ctx.lineTo(w - padX, yZero)
  ctx.stroke()
  if (x0r <= 0 && x1r >= 0) {
    const xz = px(0)
    ctx.beginPath()
    ctx.moveTo(xz, padTop)
    ctx.lineTo(xz, h - padBot)
    ctx.stroke()
  }

  const N = Math.max(300, Math.floor(w * 2))

  // Shaded area under |x|² — the energy.
  ctx.fillStyle = colors.success
  ctx.globalAlpha = 0.22
  ctx.beginPath()
  ctx.moveTo(px(x0r), yZero)
  for (let i = 0; i <= N; i++) {
    const t = lerp(i, 0, N, x0r, x1r)
    ctx.lineTo(px(t), py(sq(t)))
  }
  ctx.lineTo(px(x1r), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1

  // |x|² boundary curve (green).
  drawCurve(ctx, sq, N, x0r, x1r, px, py, h, colors.success, 1.5)

  // x(t) on top (accent) — the signal itself.
  drawCurve(ctx, cfg.x, N, x0r, x1r, px, py, h, colors.accent, 2)

  // x-axis ticks + labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const m of cfg.xMarks) {
    const x = px(m.x)
    ctx.strokeStyle = colors.fgSubtle
    ctx.beginPath()
    ctx.moveTo(x, yZero - 3)
    ctx.lineTo(x, yZero + 3)
    ctx.stroke()
    ctx.fillText(m.label, x, yZero + 13)
  }

  // For a diverging signal, a "keeps going" cue at the right edge (placed at the
  // vertical middle of the plot so it works regardless of the y-scale).
  if (cfg.diverges) {
    ctx.fillStyle = colors.success
    ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('···→', w - padX, (padTop + (h - padBot)) / 2)
  }

  // Energy value inside the shaded region.
  ctx.fillStyle = colors.success
  ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(cfg.energyText, px(cfg.energyAt.x), py(cfg.energyAt.y))

  // Legend (top-right) on a faint background so it reads over any curve.
  const lgX = w - padX - 66
  ctx.fillStyle = colors.bg
  ctx.globalAlpha = 0.72
  ctx.fillRect(lgX - 5, padTop - 4, 70, 30)
  ctx.globalAlpha = 1
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  legendRow(ctx, lgX, padTop + 6, colors.accent, 'x(t)', colors.fg)
  legendRow(ctx, lgX, padTop + 20, colors.success, '|x(t)|²', colors.fg)
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  fn: (t: number) => number,
  N: number,
  x0r: number,
  x1r: number,
  px: (x: number) => number,
  py: (y: number) => number,
  h: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  let pen = false
  let lastY = NaN
  for (let i = 0; i <= N; i++) {
    const t = lerp(i, 0, N, x0r, x1r)
    const y = py(fn(t))
    const x = px(t)
    // Lift the pen across step discontinuities so we don't draw the riser.
    if (pen && Number.isFinite(lastY) && Math.abs(y - lastY) > h * 0.6) {
      ctx.moveTo(x, y)
    } else if (!pen) {
      ctx.moveTo(x, y)
      pen = true
    } else {
      ctx.lineTo(x, y)
    }
    lastY = y
  }
  ctx.stroke()
}

function legendRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  swatch: string,
  label: string,
  textColor: string,
) {
  ctx.strokeStyle = swatch
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + 16, y)
  ctx.stroke()
  ctx.fillStyle = textColor
  ctx.fillText(label, x + 21, y + 3)
}
