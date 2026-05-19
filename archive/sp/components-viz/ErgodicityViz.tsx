'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, normal } from '@/lib/random'

/**
 * Ergodicity demo: for an ergodic process, the *time-average* over one
 * long realization equals the *ensemble-average* across many
 * realizations.
 *
 * We compute both side-by-side as a function of integration length T:
 *   - Time-avg of one realization: (1/T) ∫_0^T x(t) dt
 *   - Ensemble-avg at fixed time:  (1/N) Σ_i x_i(t_fixed)
 *
 * Three preset processes:
 *   - Gaussian white noise: ergodic in mean
 *   - Random-phase cosine: ergodic in mean (both = 0)
 *   - Random-DC offset:   NOT ergodic (each realization is its own DC,
 *                         time-avg gives that DC, but ensemble mean
 *                         could be 0 if DC's are zero-mean)
 */

const PRESETS = [
  { id: 'white', label: 'Λευκός θόρυβος (ergodic)', ergodic: true },
  { id: 'rand-phase', label: 'cos(ωt + Θ) (ergodic)', ergodic: true },
  { id: 'rand-dc', label: 'X(t) = A, A ~ N(0,1) (μη ergodic)', ergodic: false },
] as const

type PresetId = (typeof PRESETS)[number]['id']

const N_SAMPLES = 800
const T_TOTAL = 10
const N_ENSEMBLE = 60

export function ErgodicityViz() {
  const [preset, setPreset] = useState<PresetId>('white')
  const [seed, setSeed] = useState(13)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, preset, seed)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, preset, seed)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [preset, seed])

  const meta = PRESETS.find((p) => p.id === preset)!

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ergodicity — time-average vs ensemble-average
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              preset === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ergodicity comparison"
      />
      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {meta.ergodic ? (
          <>
            ✓ <strong>Ergodic στον μέσο</strong> — ο time-average (μπλε) και
            ο ensemble-average (μωβ) τείνουν στην ίδια τιμή. Άρα μπορούμε να
            εκτιμήσουμε τον μέσο του process από <strong>μία</strong> αρκετά
            μακροχρόνια καταγραφή.
          </>
        ) : (
          <>
            ⚠️ <strong>Μη ergodic</strong> — ο time-average συγκλίνει στην
            τιμή της <em>συγκεκριμένης realization</em>, όχι στον ensemble
            mean. Διαφορετική realization → διαφορετικό time-average.
          </>
        )}
      </div>
    </figure>
  )
}

const TIME_C = 'rgb(29, 78, 216)'
const ENS_C = 'rgb(168, 85, 247)'
const SIG_C = 'rgba(29, 78, 216, 0.35)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: PresetId,
  seed: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 60
  const PAD_TOP = 30
  const PAD_BOTTOM = 26
  const yLim = 1.8
  const xt = (t: number) => lerp(t, 0, T_TOTAL, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_TOP + 4, h - PAD_BOTTOM)
  const yZero = yv(0)

  // Background signal: one realization
  const realization = generateRealization(preset, seed, 0, N_SAMPLES)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < realization.length; i++) {
    const t = (i / (realization.length - 1)) * T_TOTAL
    const x = xt(t)
    const y = yv(realization[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Time-running average of the single realization
  ctx.strokeStyle = TIME_C
  ctx.lineWidth = 2.2
  ctx.beginPath()
  let runSum = 0
  for (let i = 0; i < realization.length; i++) {
    runSum += realization[i]
    const avg = runSum / (i + 1)
    const t = (i / (realization.length - 1)) * T_TOTAL
    const x = xt(t)
    const y = yv(avg)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Ensemble average computed at each time t (over N_ENSEMBLE realizations)
  const ensembleSeries: number[] = []
  for (let i = 0; i < N_SAMPLES; i++) ensembleSeries.push(0)
  for (let r = 0; r < N_ENSEMBLE; r++) {
    const real = generateRealization(preset, seed, r + 1, N_SAMPLES)
    for (let i = 0; i < N_SAMPLES; i++) ensembleSeries[i] += real[i]
  }
  for (let i = 0; i < N_SAMPLES; i++) ensembleSeries[i] /= N_ENSEMBLE

  ctx.strokeStyle = ENS_C
  ctx.lineWidth = 2
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  for (let i = 0; i < ensembleSeries.length; i++) {
    const t = (i / (ensembleSeries.length - 1)) * T_TOTAL
    const x = xt(t)
    const y = yv(ensembleSeries[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = SIG_C
  ctx.textAlign = 'left'
  ctx.fillText('— μία realization', PAD_X, 14)
  ctx.fillStyle = TIME_C
  ctx.fillText('— time-average (μία realization, αυξανόμενο T)', PAD_X + 110, 14)
  ctx.fillStyle = ENS_C
  ctx.fillText(`-- ensemble-average (${N_ENSEMBLE} realizations, σε κάθε t)`, PAD_X + 380, 14)

  // Y-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', PAD_X - 4, yv(1) + 3)
  ctx.fillText('0', PAD_X - 4, yZero + 3)
  ctx.fillText('-1', PAD_X - 4, yv(-1) + 3)

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_TOTAL; t += 2) {
    ctx.fillText(`${t}s`, xt(t), h - 6)
  }
}

function generateRealization(
  preset: PresetId,
  seed: number,
  realIdx: number,
  N: number,
): number[] {
  const rng = mulberry32(seed * 1009 + realIdx * 37 + 1)
  const out = new Array<number>(N)
  switch (preset) {
    case 'white': {
      const sigma = 0.7
      for (let n = 0; n < N; n++) out[n] = normal(rng, 0, sigma)
      return out
    }
    case 'rand-phase': {
      const theta = rng() * 2 * Math.PI
      for (let n = 0; n < N; n++) {
        const t = (n / (N - 1)) * T_TOTAL
        out[n] = Math.cos(2 * Math.PI * 1.0 * t + theta)
      }
      return out
    }
    case 'rand-dc': {
      const A = normal(rng, 0, 1)
      for (let n = 0; n < N; n++) out[n] = A
      return out
    }
  }
}
