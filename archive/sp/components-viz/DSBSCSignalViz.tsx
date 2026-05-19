'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * DSB-SC time-domain visualization showing why envelope detection fails.
 *
 * Three traces stacked:
 *   - message m(t) (amber)
 *   - DSB-SC signal x(t) = m(t) cos(2π f_c t) (blue) — note the carrier
 *     "fills" the message but flips polarity at every zero-crossing of m(t)
 *   - rectified envelope |x(t)| (violet dashed) — what an envelope detector
 *     would output. Annotated as "= |m(t)|, NOT m(t)" — clear distortion
 *     wherever m(t) < 0
 *
 * Three preset messages so the student sees that:
 *   - sinusoidal m: rectified envelope is half-wave-rectified sinusoid
 *   - square m: phase flips are dramatic; envelope is constant
 *   - voice-like sum: the most realistic case
 */

type PresetId = 'sin' | 'square' | 'sum'

type Preset = {
  id: PresetId
  label: string
  m: (t: number) => number
  description: string
}

const FC = 8 // visual carrier cycles per unit time
const FM = 0.5 // base message frequency

const PRESETS: Preset[] = [
  {
    id: 'sin',
    label: 'Sinusoidal',
    m: (t) => Math.cos(2 * Math.PI * FM * t),
    description:
      'Single-tone message. Όταν το m(t) γίνει αρνητικό, το AM σήμα «αναποδογυρίζει» αλλά ο envelope detector βγάζει την απόλυτη τιμή — half-wave rectified message.',
  },
  {
    id: 'square',
    label: 'Square',
    m: (t) => (Math.cos(2 * Math.PI * FM * t) > 0 ? 0.8 : -0.8),
    description:
      'Square message. Φαίνονται δραματικά τα phase flips κάθε φορά που το m(t) αλλάζει πρόσημο — ο carrier πραγματικά «αντιστρέφεται» κατά π στο time-domain.',
  },
  {
    id: 'sum',
    label: 'Sum of two tones',
    m: (t) => 0.6 * Math.cos(2 * Math.PI * FM * t) + 0.4 * Math.cos(2 * Math.PI * 1.3 * FM * t),
    description:
      'Πιο ρεαλιστικό σύνθετο message. Πολλαπλά zero-crossings — πολλαπλά phase flips. Ο envelope detector θα έβγαζε ένα τελείως διαφορετικό σήμα.',
  },
]

export function DSBSCSignalViz() {
  const [presetId, setPresetId] = useState<PresetId>('sin')
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const preset = PRESETS.find((p) => p.id === presetId)!

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, preset, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, preset])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          DSB-SC στον χρόνο — γιατί ο envelope detector αποτυγχάνει
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

      <div
        role="radiogroup"
        aria-label="Message preset"
        className="mb-2 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presetId === p.id}
            onClick={() => setPresetId(p.id)}
            className={`rounded-full px-2.5 py-0.5 transition-colors ${
              presetId === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-[11px] text-fg-subtle">{preset.description}</p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="DSB-SC signal in time domain with rectified envelope"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στη DSB-SC, το envelope detector θα ανακτούσε <span className="font-mono">|m(t)|</span>{' '}
        — όχι το <span className="font-mono">m(t)</span>. Παρατήρησε στο πορτοκαλί
        message vs τη βιολετί διακεκομμένη: όπου το m(t) είναι αρνητικό, η
        διακεκομμένη πάει στην αντίθετη πλευρά (αναποδογύρισμα). Γι' αυτό η
        DSB-SC χρειάζεται <strong>coherent demodulation</strong> — όχι envelope
        detection.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber
const SIG_C = 'rgb(29, 78, 216)' // accent blue
const ENV_C = 'rgb(168, 85, 247)' // violet

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const topH = h * 0.4
  const botH = h - topH
  drawMessageAndEnv(ctx, colors, 0, 0, w, topH, preset, tNow)
  drawDSBSC(ctx, colors, 0, topH, w, botH, preset, tNow)
}

function drawMessageAndEnv(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 14
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    'm(t) (amber, true message) και |m(t)| (violet dashed, what envelope detector outputs)',
    x0 + PAD_X,
    y0 + 12,
  )

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD_Y + 8)
  ctx.lineTo(xt(tNow), y0 + ph - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // m(t)
  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 360
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = preset.m(t)
    const px = xt(t)
    const py = yv(m)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // |m(t)| — what envelope detector would output
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.6
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = Math.abs(preset.m(t))
    const px = xt(t)
    const py = yv(env)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])
}

function drawDSBSC(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 14
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    'x(t) = m(t) · cos(2π f_c t) — DSB-SC σήμα. Phase flip στα zero-crossings του m(t).',
    x0 + PAD_X,
    y0 + 12,
  )

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // |m(t)| envelope (faint dashed) on this plot too
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1
  ctx.setLineDash([3, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    const ESTEPS = 360
    for (let i = 0; i <= ESTEPS; i++) {
      const t = lerp(i, 0, ESTEPS, tStart, tEnd)
      const env = sign * Math.abs(preset.m(t))
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Mark zero-crossings of m(t) as vertical hint lines
  ctx.strokeStyle = `rgba(${getRGB(MSG_C)}, 0.35)`
  ctx.lineWidth = 1
  const STEPS_ZERO = 600
  let prev = preset.m(tStart)
  for (let i = 1; i <= STEPS_ZERO; i++) {
    const t = lerp(i, 0, STEPS_ZERO, tStart, tEnd)
    const cur = preset.m(t)
    if ((prev < 0 && cur > 0) || (prev > 0 && cur < 0) || (Math.abs(prev) > 0.5 && cur !== prev && Math.sign(cur) !== Math.sign(prev))) {
      ctx.setLineDash([2, 4])
      ctx.beginPath()
      ctx.moveTo(xt(t), y0 + PAD_Y + 8)
      ctx.lineTo(xt(t), y0 + ph - PAD_Y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    prev = cur
  }

  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD_Y + 8)
  ctx.lineTo(xt(tNow), y0 + ph - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // DSB-SC signal x(t) = m(t) cos(2π f_c t)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 1200
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const v = preset.m(t) * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '217, 119, 6'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
