'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Thermometer, Waves, MousePointer2 } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type Mode = 'temperature' | 'wave' | 'mouse'

const N = 300

function temperatureSamples(): { ys: Float32Array; xLabels: string[] } {
  // 24-hour curve: cool morning, warm afternoon, cooler evening.
  const ys = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const h = (i / (N - 1)) * 24
    // Smooth diurnal curve: peak ~16:00, trough ~05:00.
    const t = ((h - 5) / 24) * 2 * Math.PI
    ys[i] = 19 + 7 * Math.sin(t) + 0.6 * Math.sin(2.7 * t + 0.4)
  }
  return {
    ys,
    xLabels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
  }
}

function waveSamples(): { ys: Float32Array; xLabels: string[] } {
  const ys = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * 6 * Math.PI
    ys[i] = 1.0 * Math.sin(t) + 0.18 * Math.sin(3.1 * t + 0.6) + 0.05 * Math.sin(7 * t)
  }
  return { ys, xLabels: ['0 s', '5 s', '10 s', '15 s', '20 s'] }
}

function mouseSamples(): { ys: Float32Array; xLabels: string[] } {
  // Pseudo-random "mouse Y over time" — jittery, with some drift, no negative trend.
  const ys = new Float32Array(N)
  let v = 0
  // Seeded LCG for stable visual.
  let seed = 1234567
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let i = 0; i < N; i++) {
    v += (rand() - 0.5) * 0.18
    v *= 0.985 // gentle pull toward 0
    ys[i] = v + 0.4 * Math.sin(i / 22) + (rand() - 0.5) * 0.04
  }
  return { ys, xLabels: ['t = 0', '', '', '', 'τώρα'] }
}

const MODES: {
  id: Mode
  label: string
  Icon: typeof Thermometer
  blurb: string
  yLabel: string
  yUnit: string
}[] = [
  {
    id: 'temperature',
    label: 'Θερμοκρασία',
    Icon: Thermometer,
    blurb:
      'Η θερμοκρασία στο δωμάτιό σου σε όλη τη μέρα — αλλάζει αργά, ομαλά. Σήμα του χρόνου.',
    yLabel: 'θερμοκρασία',
    yUnit: '°C',
  },
  {
    id: 'wave',
    label: 'Κύμα στη θάλασσα',
    Icon: Waves,
    blurb:
      'Το ύψος ενός κύματος. Επαναλαμβάνεται με κάποια περίοδο — αυτό λέγεται περιοδικό σήμα.',
    yLabel: 'ύψος',
    yUnit: 'm',
  },
  {
    id: 'mouse',
    label: 'Ποντίκι (y)',
    Icon: MousePointer2,
    blurb:
      'Η y-θέση του ποντικιού όσο το κουνάς. Μη προβλέψιμη, "θορυβώδης" — αλλά πάλι σήμα του χρόνου.',
    yLabel: 'y',
    yUnit: 'px',
  },
]

export function EverydaySignals() {
  const [mode, setMode] = useState<Mode>('temperature')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const data = useMemo(() => {
    if (mode === 'temperature') return temperatureSamples()
    if (mode === 'wave') return waveSamples()
    return mouseSamples()
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    const { ctx, w, h } = setupCanvas(canvas)
    ctx.clearRect(0, 0, w, h)

    const padX = 24
    const padTop = 8
    const padBottom = 22

    let yMin = Infinity
    let yMax = -Infinity
    for (let i = 0; i < data.ys.length; i++) {
      const v = data.ys[i]
      if (v < yMin) yMin = v
      if (v > yMax) yMax = v
    }
    const range = yMax - yMin || 1
    yMin -= range * 0.1
    yMax += range * 0.1

    const px = (i: number) => lerp(i, 0, data.ys.length - 1, padX, w - padX)
    const py = (y: number) => lerp(y, yMin, yMax, h - padBottom, padTop)

    // Soft baseline.
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padX, h - padBottom)
    ctx.lineTo(w - padX, h - padBottom)
    ctx.stroke()

    // X labels.
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < data.xLabels.length; i++) {
      const x = lerp(i, 0, data.xLabels.length - 1, padX, w - padX)
      ctx.fillText(data.xLabels[i], x, h - padBottom + 14)
    }

    // The curve.
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < data.ys.length; i++) {
      const x = px(i)
      const y = py(data.ys[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }, [data])

  const current = MODES.find((m) => m.id === mode)!

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Σήματα γύρω σου, χωρίς να το κατάλαβες
        </h4>
        <div
          role="radiogroup"
          aria-label="Διάλεξε ένα σήμα"
          className="inline-flex items-center rounded-full border border-border bg-bg-soft p-0.5 text-xs"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors',
                mode === m.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              <m.Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label={`${current.label} σήμα γραφήματος`}
      />

      <p className="mt-2 text-xs text-fg-muted">{current.blurb}</p>
    </figure>
  )
}
