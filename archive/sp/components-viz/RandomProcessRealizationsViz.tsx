'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, normal } from '@/lib/random'

/**
 * Generic random-process realizations — students pick which family of
 * processes to draw and how many ensemble members to display. The
 * pedagogical point: a "random process" isn't one signal — it's a
 * *family* of signals, one per "outcome" of the underlying experiment.
 *
 * Three preset processes:
 *   - Gaussian white noise (each sample iid N(0, σ²))
 *   - Random-amplitude cosine: A cos(2π f₀ t), A ~ N(0, 1)
 *   - Random-frequency cosine: cos(2π F t), F ~ U[0.5, 1.5] (NOT WSS)
 *
 * The "random-frequency" example is shown specifically to give students
 * an example of a non-stationary process so they appreciate the WSS
 * conditions when we get to them.
 */

const PRESETS = [
  { id: 'white', label: 'Λευκός θόρυβος (N(0, σ²))', wss: true },
  { id: 'rand-amp', label: 'A cos(2π f₀ t), A ~ N(0,1)', wss: false },
  { id: 'rand-phase', label: 'cos(2π f₀ t + Θ), Θ ~ U[0,2π)', wss: true },
  { id: 'rand-freq', label: 'cos(2π F t), F ~ U[0.5,1.5] (όχι WSS)', wss: false },
] as const

const NUM_REALIZATIONS = 6
const SAMPLES_PER_REAL = 280
const T_SPAN = 4
const F0 = 1.0

type PresetId = (typeof PRESETS)[number]['id']

export function RandomProcessRealizationsViz() {
  const [preset, setPreset] = useState<PresetId>('white')
  const [seed, setSeed] = useState(11)
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
          Realizations ενός random process
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
        aria-label="Random process realizations"
      />
      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {meta.wss ? (
          <>
            ✓ Αυτό το process είναι <strong>stationary</strong>: η ensemble
            statistics δεν αλλάζουν με τον χρόνο. Μπορείς να μιλάς για
            «μέσο» και «αυτοσυσχέτιση» χωρίς να ορίζεις χρόνο.
          </>
        ) : (
          <>
            ⚠️ Αυτό το process <strong>δεν</strong> είναι WSS — η statistics
            του (variance ή autocorrelation pattern) αλλάζουν με τον χρόνο.
            Δες π.χ. πώς οι «ζώνες» των realizations συμπιέζονται και
            ξανα-απλώνουν για το random-frequency cosine.
          </>
        )}
      </div>
    </figure>
  )
}

const REAL_C = 'rgb(29, 78, 216)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: PresetId,
  seed: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 50
  const PAD_TOP = 14
  const PAD_BOTTOM = 22
  const yScale = 1.6

  const xt = (t: number) => lerp(t, 0, T_SPAN, PAD_X, w - PAD_X)
  const stripH = (h - PAD_TOP - PAD_BOTTOM) / NUM_REALIZATIONS
  const yForReal = (i: number, v: number) => {
    const stripCenter = PAD_TOP + (i + 0.5) * stripH
    return stripCenter - (v / yScale) * (stripH * 0.4)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) {
    ctx.fillText(`${t}s`, xt(t), h - 5)
  }

  for (let i = 0; i < NUM_REALIZATIONS; i++) {
    const realization = generateRealization(preset, seed, i, SAMPLES_PER_REAL)
    // Strip baseline
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(PAD_X, yForReal(i, 0))
    ctx.lineTo(w - PAD_X, yForReal(i, 0))
    ctx.stroke()

    ctx.strokeStyle = REAL_C
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let s = 0; s < realization.length; s++) {
      const t = (s / (realization.length - 1)) * T_SPAN
      const x = xt(t)
      const y = yForReal(i, realization[s])
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`X${subscript(i + 1)}`, PAD_X - 4, yForReal(i, 0) + 3)
  }
}

function generateRealization(
  preset: PresetId,
  seed: number,
  realizationIdx: number,
  N: number,
): number[] {
  // Each realization gets a deterministic but distinct sub-seed
  const subSeed = seed * 1009 + realizationIdx * 17 + 1
  const rng = mulberry32(subSeed)
  const out = new Array<number>(N)

  switch (preset) {
    case 'white': {
      const sigma = 0.7
      for (let n = 0; n < N; n++) out[n] = normal(rng, 0, sigma)
      return out
    }
    case 'rand-amp': {
      const A = normal(rng, 0, 1) // amplitude is the random thing
      for (let n = 0; n < N; n++) {
        const t = (n / (N - 1)) * T_SPAN
        out[n] = A * Math.cos(2 * Math.PI * F0 * t)
      }
      return out
    }
    case 'rand-phase': {
      const theta = rng() * 2 * Math.PI
      for (let n = 0; n < N; n++) {
        const t = (n / (N - 1)) * T_SPAN
        out[n] = Math.cos(2 * Math.PI * F0 * t + theta)
      }
      return out
    }
    case 'rand-freq': {
      const F = 0.5 + rng() // U[0.5, 1.5]
      for (let n = 0; n < N; n++) {
        const t = (n / (N - 1)) * T_SPAN
        out[n] = Math.cos(2 * Math.PI * F * t)
      }
      return out
    }
  }
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return n
    .toString()
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
}
