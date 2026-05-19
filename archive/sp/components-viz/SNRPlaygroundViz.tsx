'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, normal } from '@/lib/random'

/**
 * Interactive SNR feel: show signal + noise + sum, with a slider for
 * SNR in dB. As the user lowers SNR, the sinusoid disappears under the
 * noise. Shows the dB scale viscerally.
 */

export function SNRPlaygroundViz() {
  const [snrDb, setSnrDb] = useState(10)
  const [seed, setSeed] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, snrDb, seed)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, snrDb, seed)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [snrDb, seed])

  const visibility =
    snrDb > 15
      ? 'καθαρό σήμα'
      : snrDb > 5
        ? 'ορατό σήμα με θόρυβο'
        : snrDb > -5
          ? 'οριακή ανίχνευση'
          : 'σχεδόν αόρατο'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          SNR — πώς αισθάνεται κάθε επίπεδο
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: το σήμα <span className="font-mono">cos(2π f₀ t)</span>. Μέσο:
        ο θόρυβος. Κάτω: το άθροισμα — αυτό φτάνει στον δέκτη. Σύρε το SNR
        και δες πότε χάνεις το σήμα.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="SNR playground"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            SNR ={' '}
            <span className="font-mono text-fg tabular-nums">
              {snrDb.toFixed(0)} dB
            </span>{' '}
            ({Math.pow(10, snrDb / 10).toFixed(2)} γραμμικά)
          </label>
          <input
            type="range"
            min={-15}
            max={30}
            step={1}
            value={snrDb}
            onChange={(e) => setSnrDb(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Κατάσταση
          </div>
          <div className="text-fg">{visibility}</div>
        </div>
      </div>
    </figure>
  )
}

const SIG_C = 'rgb(29, 78, 216)'
const NOISE_C = 'rgb(220, 38, 38)'
const SUM_C = 'rgb(168, 85, 247)'

const N_SAMPLES = 600
const T_SPAN = 4
const F0 = 1.5

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  snrDb: number,
  seed: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Generate signal and noise
  const A = 1.0 // signal amplitude → P_s = A²/2 = 0.5
  const Ps = A * A / 2
  const snrLin = Math.pow(10, snrDb / 10)
  const Pn = Ps / snrLin
  const sigma = Math.sqrt(Pn)

  const rng = mulberry32(seed * 977 + 13)
  const signal = new Array<number>(N_SAMPLES)
  const noise = new Array<number>(N_SAMPLES)
  const sum = new Array<number>(N_SAMPLES)
  for (let i = 0; i < N_SAMPLES; i++) {
    const t = (i / (N_SAMPLES - 1)) * T_SPAN
    signal[i] = A * Math.cos(2 * Math.PI * F0 * t)
    noise[i] = normal(rng, 0, sigma)
    sum[i] = signal[i] + noise[i]
  }

  const rowH = h / 3
  drawTrace(ctx, colors, 0, 0, w, rowH, signal, SIG_C, 'σήμα x(t) = A cos(2π f₀ t)', 2.5)
  drawTrace(ctx, colors, 0, rowH, w, rowH, noise, NOISE_C, 'θόρυβος n(t)', 2.5)
  drawTrace(ctx, colors, 0, 2 * rowH, w, rowH, sum, SUM_C, 'received y(t) = x + n', 2.5)
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  data: number[],
  color: string,
  label: string,
  yLim: number,
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 14
  const PAD_BOTTOM = 16
  const xt = (i: number) => lerp(i, 0, data.length - 1, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_TOP, y0 + ph - PAD_BOTTOM)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.strokeStyle = color
  ctx.lineWidth = 1.2
  ctx.beginPath()
  for (let i = 0; i < data.length; i++) {
    const x = xt(i)
    const y = yv(data[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}
