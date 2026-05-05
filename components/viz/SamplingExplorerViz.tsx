'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Sample a continuous signal at chosen rate, show:
 *   1. Original signal x(t)
 *   2. Samples x[n] = x(nT_s) as stems
 *   3. Reconstruction via ideal sinc interpolation
 *      x_r(t) = Σ x[n] sinc((t - nT_s)/T_s)
 *
 * Slider: f_s (sample rate). When f_s ≥ 2 f_max → reconstruction matches.
 * When f_s < 2 f_max → reconstruction is wrong (aliased).
 *
 * Signal preset: 1 Hz cosine (for clarity), or sum of 1 Hz + 2 Hz.
 */

const PRESETS = [
  { id: 'cos1', label: '1 Hz cosine', fMax: 1 },
  { id: 'cos15', label: '1.5 Hz cosine', fMax: 1.5 },
  { id: 'sum', label: '1 Hz + 2 Hz', fMax: 2 },
] as const

type PresetId = (typeof PRESETS)[number]['id']

function originalSignal(preset: PresetId, t: number): number {
  switch (preset) {
    case 'cos1':
      return Math.cos(2 * Math.PI * 1 * t)
    case 'cos15':
      return Math.cos(2 * Math.PI * 1.5 * t)
    case 'sum':
      return 0.7 * Math.cos(2 * Math.PI * 1 * t) + 0.5 * Math.cos(2 * Math.PI * 2 * t)
  }
}

const T_SPAN = 4 // seconds shown
const ORIG_RES = 600 // continuous-curve samples for plotting
const RECON_RES = 600

export function SamplingExplorerViz() {
  const [preset, setPreset] = useState<PresetId>('cos1')
  const [fs, setFs] = useState(3) // Hz
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, preset, fs)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, preset, fs)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [preset, fs])

  const meta = PRESETS.find((p) => p.id === preset)!
  const nyquist = 2 * meta.fMax
  const isAliased = fs < nyquist

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Sampling explorer — αρχικό σήμα, samples, ανακατασκευή
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                preset === p.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πορτοκαλί καμπύλη: το αρχικό σήμα. Μπλε stems: τα samples. Μωβ
        διακεκομμένη: η ανακατασκευή με ιδανικό sinc interpolation. Όταν
        <strong> f_s ≥ 2 f_max</strong> ταυτίζονται. Όταν <strong>f_s &lt;
        2 f_max</strong>, η μωβ ανακατασκευή είναι το αλιασμένο σήμα.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Sampling visualization"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f_s = <span className="font-mono text-fg tabular-nums">{fs.toFixed(2)}</span> Hz
          {' · '}
          <span className="font-mono text-fg-subtle">
            f_Nyquist = {nyquist.toFixed(2)} Hz
          </span>
          {' · '}
          {isAliased ? (
            <span className="font-medium text-red-600 dark:text-red-400">
              ⚠️ Undersampled (aliasing)
            </span>
          ) : (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Adequate (f_s ≥ 2 f_max)
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.05}
          value={fs}
          onChange={(e) => setFs(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>
    </figure>
  )
}

const ORIG_C = 'rgb(217, 119, 6)'
const SAMPLE_C = 'rgb(29, 78, 216)'
const RECON_C = 'rgb(168, 85, 247)'

function sincReconstruct(
  preset: PresetId,
  t: number,
  fs: number,
  Ts: number,
  nMin: number,
  nMax: number,
): number {
  let v = 0
  for (let n = nMin; n <= nMax; n++) {
    const tn = n * Ts
    const sample = originalSignal(preset, tn)
    const arg = (t - tn) / Ts
    const sinc = Math.abs(arg) < 1e-9 ? 1 : Math.sin(Math.PI * arg) / (Math.PI * arg)
    v += sample * sinc
  }
  return v
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: PresetId,
  fs: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 50
  const PAD_TOP = 20
  const PAD_BOTTOM = 24
  const yLim = 1.6
  const xt = (t: number) => lerp(t, 0, T_SPAN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_TOP, h - PAD_BOTTOM)
  const yZero = yv(0)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Original signal
  ctx.strokeStyle = ORIG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= ORIG_RES; i++) {
    const t = (i / ORIG_RES) * T_SPAN
    const v = originalSignal(preset, t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Samples — stem plot
  const Ts = 1 / fs
  const nMin = 0
  const nMax = Math.floor(T_SPAN / Ts)
  ctx.strokeStyle = SAMPLE_C
  ctx.fillStyle = SAMPLE_C
  ctx.lineWidth = 1.4
  for (let n = nMin; n <= nMax; n++) {
    const t = n * Ts
    if (t > T_SPAN) break
    const v = originalSignal(preset, t)
    const x = xt(t)
    const y = yv(v)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Reconstruction
  ctx.strokeStyle = RECON_C
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 1.6
  ctx.beginPath()
  // Use a wider sample window than [0, T_SPAN] to reduce edge effects
  const wideMin = -10
  const wideMax = nMax + 10
  for (let i = 0; i <= RECON_RES; i++) {
    const t = (i / RECON_RES) * T_SPAN
    const v = sincReconstruct(preset, t, fs, Ts, wideMin, wideMax)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  let lx = PAD_X
  ctx.fillStyle = ORIG_C
  ctx.fillRect(lx, 6, 14, 2)
  ctx.fillText('αρχικό', lx + 18, 14)
  lx += 70
  ctx.fillStyle = SAMPLE_C
  ctx.beginPath()
  ctx.arc(lx + 4, 7, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillText('samples', lx + 12, 14)
  lx += 70
  ctx.fillStyle = RECON_C
  ctx.fillRect(lx, 6, 4, 2)
  ctx.fillRect(lx + 8, 6, 4, 2)
  ctx.fillText('reconstruction', lx + 16, 14)

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) {
    ctx.fillText(`${t}s`, xt(t), h - 6)
  }

  // Y-axis ±1
  ctx.textAlign = 'right'
  ctx.fillText('+1', PAD_X - 4, yv(1) + 3)
  ctx.fillText('0', PAD_X - 4, yZero + 3)
  ctx.fillText('-1', PAD_X - 4, yv(-1) + 3)
}
