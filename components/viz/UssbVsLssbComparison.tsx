'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * USB vs LSB side-by-side — same message, same carrier, opposite sign of the
 * Hilbert component. Reader sees that the two variants are mirror images of
 * each other through every ±f_c boundary, and that they occupy *exactly the
 * same bandwidth W* in non-overlapping bands.
 *
 * Two presets:
 *   - 'tone'   : single-tone message m(t) = A_m cos(2π f_m t). USB → impulse
 *                pair at ±(f_c+f_m). LSB → impulse pair at ±(f_c−f_m).
 *                f_m is a slider — slide it and watch the impulses move.
 *   - 'shape'  : general bandlimited message with a triangle |M(f)|.
 *                USB → bumps in the *outer* halves (|f| > f_c).
 *                LSB → bumps in the *inner* halves (|f| < f_c).
 *
 * Distinct from SSBSpectrumViz: that one toggles between DSB / USB / LSB in a
 * single pane. This one shows USB and LSB *simultaneously stacked* with a
 * shared frequency axis so the reader can compare positions, bandwidths and
 * relative orientations side-by-side. The reader leaves understanding that
 * the two variants carry identical information in geometrically dual bands.
 */

type Preset = 'tone' | 'shape'

const FC = 4 // visual carrier position
const W = 1.2 // message bandwidth (visual half-width for the 'shape' preset)
const F_MAX = FC + W + 1.1

const COLOR_USB = 'rgb(29, 78, 216)' // blue
const FILL_USB = 'rgba(29, 78, 216, 0.32)'
const COLOR_LSB = 'rgb(168, 85, 247)' // violet
const FILL_LSB = 'rgba(168, 85, 247, 0.32)'
const COLOR_GHOST = 'rgb(148, 163, 184)' // slate

const PAD_X = 40
const PAD_Y = 12
const PANEL_GAP = 4

export function UssbVsLssbComparison() {
  const [preset, setPreset] = useState<Preset>('tone')
  const [fm, setFm] = useState(0.6) // single-tone message frequency (visual units)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, preset, fm)
  }, [preset, fm])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, preset, fm)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [preset, fm])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        USB και LSB σε ίδιο message — δύο επιλογές, ίδια πληροφορία, ίδιο BW
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο <span className="font-mono">m(t)</span>, ίδιο{' '}
        <span className="font-mono">f_c</span>, διαφορετική επιλογή προσήμου
        στο <span className="font-mono">m·cos ∓ m̂·sin</span>. Πάνω: <strong className="text-blue-700 dark:text-blue-300">USB</strong>{' '}
        — μένουν τα <em>έξω</em> μισά. Κάτω: <strong className="text-violet-700 dark:text-violet-300">LSB</strong>{' '}
        — μένουν τα <em>μέσα</em> μισά. Και τα δύο πιάνουν εύρος{' '}
        <span className="font-mono">W</span> — μισό από το DSB-SC{' '}
        <span className="font-mono">2W</span>.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Preset"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            [
              { id: 'tone' as Preset, label: 'Single-tone (cosine)' },
              { id: 'shape' as Preset, label: 'Bandlimited M(f) — γενικό' },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={preset === opt.id}
              onClick={() => setPreset(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                preset === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {preset === 'tone' && (
          <label className="inline-flex items-center gap-2 text-xs text-fg-muted">
            <span className="font-mono">f_m</span>
            <input
              type="range"
              min={0.2}
              max={1.1}
              step={0.05}
              value={fm}
              onChange={(e) => setFm(parseFloat(e.target.value))}
              className="h-1 w-32 cursor-pointer accent-accent"
              aria-label="Message frequency"
            />
            <span className="font-mono">{fm.toFixed(2)}·W</span>
          </label>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="USB and LSB spectra stacked for visual comparison"
      />

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-blue-400/40 bg-blue-50/50 px-3 py-2 dark:border-blue-400/40 dark:bg-blue-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">USB · m·cos − m̂·sin</div>
          <div className="mt-1">
            {preset === 'tone' ? (
              <>
                Φάσμα: ζεύγος impulses στις{' '}
                <span className="font-mono">±(f_c + f_m)</span>, πλάτος{' '}
                <span className="font-mono">A_m/2</span>. Στο time-domain:{' '}
                <span className="font-mono">x_USB = A_m cos(2π(f_c+f_m)t)</span>.
              </>
            ) : (
              <>
                Φάσμα: τρίγωνα στα <span className="font-mono">f &gt; f_c</span>{' '}
                και <span className="font-mono">f &lt; −f_c</span>. Bandwidth{' '}
                <span className="font-mono">= W</span>.
              </>
            )}
          </div>
        </div>
        <div className="rounded-md border border-violet-400/40 bg-violet-50/50 px-3 py-2 dark:border-violet-400/40 dark:bg-violet-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">LSB · m·cos + m̂·sin</div>
          <div className="mt-1">
            {preset === 'tone' ? (
              <>
                Φάσμα: ζεύγος impulses στις{' '}
                <span className="font-mono">±(f_c − f_m)</span>, πλάτος{' '}
                <span className="font-mono">A_m/2</span>. Στο time-domain:{' '}
                <span className="font-mono">x_LSB = A_m cos(2π(f_c−f_m)t)</span>.
              </>
            ) : (
              <>
                Φάσμα: τρίγωνα στα <span className="font-mono">0 &lt; |f| &lt; f_c</span>{' '}
                (μέσα στον carrier). Bandwidth <span className="font-mono">= W</span>.
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Παρατήρηση: η USB και η LSB <strong>δεν επικαλύπτονται</strong> — οι
        ζώνες τους είναι ξένες. Άρα ο ίδιος carrier{' '}
        <span className="font-mono">f_c</span> μπορεί να εξυπηρετήσει{' '}
        <strong>δύο ανεξάρτητα κανάλια</strong>: ένα στην USB, ένα στην LSB. Αυτό
        το trick (Independent Sideband, ISB) χρησιμοποιείται σε HF point-to-point
        για να διπλασιάσει τη χωρητικότητα ενός shortwave link.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: Preset,
  fm: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const panelH = (h - PAD_Y * 2 - PANEL_GAP) / 2

  drawPanel(
    ctx,
    colors,
    w,
    PAD_Y,
    panelH,
    'USB',
    'm·cos − m̂·sin → |f| > f_c (έξω)',
    'usb',
    preset,
    fm,
  )
  drawPanel(
    ctx,
    colors,
    w,
    PAD_Y + panelH + PANEL_GAP,
    panelH,
    'LSB',
    'm·cos + m̂·sin → |f| < f_c (μέσα)',
    'lsb',
    preset,
    fm,
  )
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  y0: number,
  ph: number,
  title: string,
  subtitle: string,
  variant: 'usb' | 'lsb',
  preset: Preset,
  fm: number,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.2, -0.15, y0 + 4, y0 + ph - 14)
  const yZero = yv(0)

  // Background tint per panel
  ctx.fillStyle =
    variant === 'usb' ? 'rgba(29, 78, 216, 0.04)' : 'rgba(168, 85, 247, 0.04)'
  ctx.fillRect(PAD_X - 6, y0, w - 2 * PAD_X + 12, ph)

  // Frequency axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Arrow + 'f' label
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(w - PAD_X + 6, yZero)
  ctx.lineTo(w - PAD_X - 3, yZero - 4)
  ctx.lineTo(w - PAD_X - 3, yZero + 4)
  ctx.closePath()
  ctx.fill()
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('f', w - PAD_X + 12, yZero + 4)

  // ± f_c carrier reference (subtle dashed verticals)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  for (const fc of [FC, -FC]) {
    ctx.beginPath()
    ctx.moveTo(xt(fc), y0 + 28)
    ctx.lineTo(xt(fc), y0 + ph - 14)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)

  // Draw the spectrum content
  const fill = variant === 'usb' ? FILL_USB : FILL_LSB
  const stroke = variant === 'usb' ? COLOR_USB : COLOR_LSB

  if (preset === 'tone') {
    drawTonePreset(ctx, xt, yv, variant, fm, fill, stroke, colors)
  } else {
    drawShapePreset(ctx, xt, yv, variant, fill, stroke, colors)
  }

  // Title & subtitle — drawn AFTER the spectrum so they sit on top of any
  // overlapping arrows / bandwidth brackets / impulse labels, with a
  // translucent background mask to keep them legible against the graph.
  ctx.textAlign = 'left'
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  const titleW = ctx.measureText(title).width
  ctx.font = '9.5px ui-sans-serif, system-ui, sans-serif'
  const subW = ctx.measureText(subtitle).width
  const maskW = Math.max(PAD_X + 30 + subW, PAD_X - 6 + titleW) - (PAD_X - 9)
  ctx.fillStyle = bgMaskColor(colors)
  ctx.fillRect(PAD_X - 9, y0 + 2, maskW + 6, 18)

  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = variant === 'usb' ? COLOR_USB : COLOR_LSB
  ctx.fillText(title, PAD_X - 6, y0 + 14)
  ctx.font = '9.5px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText(subtitle, PAD_X + 30, y0 + 14)
}

function bgMaskColor(colors: ReturnType<typeof getThemeColors>, alpha = 0.92): string {
  if (!colors) return `rgba(255, 255, 255, ${alpha})`
  const m = colors.bg.match(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)/)
  if (!m) return `rgba(255, 255, 255, ${alpha})`
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  f: number,
  height: number,
  color: string,
) {
  const yZero = yv(0)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xt(f), yZero)
  ctx.lineTo(xt(f), yv(height))
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(xt(f), yv(height) - 6)
  ctx.lineTo(xt(f) - 4, yv(height) + 2)
  ctx.lineTo(xt(f) + 4, yv(height) + 2)
  ctx.closePath()
  ctx.fill()
}

function drawTonePreset(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  variant: 'usb' | 'lsb',
  fm: number,
  _fill: string,
  stroke: string,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const FREQ = variant === 'usb' ? FC + fm : FC - fm
  drawImpulse(ctx, xt, yv, FREQ, 0.8, stroke)
  drawImpulse(ctx, xt, yv, -FREQ, 0.8, stroke)

  // Annotate impulse frequency
  ctx.fillStyle = stroke
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    variant === 'usb' ? '+(f_c+f_m)' : '+(f_c−f_m)',
    xt(FREQ),
    yv(0.8) - 10,
  )
  ctx.fillText(
    variant === 'usb' ? '−(f_c+f_m)' : '−(f_c−f_m)',
    xt(-FREQ),
    yv(0.8) - 10,
  )
}

function drawShapePreset(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  variant: 'usb' | 'lsb',
  fill: string,
  stroke: string,
  colors: ReturnType<typeof getThemeColors>,
) {
  if (!colors) return
  const HEIGHT = 0.8

  // Determine which halves are kept
  // USB: outer halves (|f| > f_c)
  // LSB: inner halves (|f| < f_c)
  const kept = variant === 'usb'
    ? ([
        { base1: FC, apex: FC, base2: FC + W }, // +f_c outer
        { base1: -FC - W, apex: -FC, base2: -FC }, // -f_c outer
      ] as const)
    : ([
        { base1: FC - W, apex: FC, base2: FC }, // +f_c inner
        { base1: -FC, apex: -FC, base2: -FC + W }, // -f_c inner
      ] as const)

  const ghost = variant === 'usb'
    ? ([
        { base1: FC - W, apex: FC, base2: FC },
        { base1: -FC, apex: -FC, base2: -FC + W },
      ] as const)
    : ([
        { base1: FC, apex: FC, base2: FC + W },
        { base1: -FC - W, apex: -FC, base2: -FC },
      ] as const)

  // Draw ghost (cancelled) first, behind
  for (const k of ghost) {
    ctx.beginPath()
    ctx.moveTo(xt(k.base1), yv(0))
    ctx.lineTo(xt(k.apex), yv(HEIGHT))
    ctx.lineTo(xt(k.base2), yv(0))
    ctx.closePath()
    ctx.fillStyle = 'rgba(148, 163, 184, 0.08)'
    ctx.fill()
    ctx.strokeStyle = COLOR_GHOST
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Draw kept (surviving) over the ghost
  for (const k of kept) {
    ctx.beginPath()
    ctx.moveTo(xt(k.base1), yv(0))
    ctx.lineTo(xt(k.apex), yv(HEIGHT))
    ctx.lineTo(xt(k.base2), yv(0))
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.6
    ctx.stroke()
  }

  // Bandwidth annotation: bracket showing W on the +f_c bump
  const bwY = yv(HEIGHT) - 14
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1
  const bwLeft = variant === 'usb' ? FC : FC - W
  const bwRight = variant === 'usb' ? FC + W : FC
  ctx.beginPath()
  ctx.moveTo(xt(bwLeft), bwY)
  ctx.lineTo(xt(bwRight), bwY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(bwLeft), bwY - 3)
  ctx.lineTo(xt(bwLeft), bwY + 3)
  ctx.moveTo(xt(bwRight), bwY - 3)
  ctx.lineTo(xt(bwRight), bwY + 3)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('BW = W', xt((bwLeft + bwRight) / 2), bwY - 4)
}
