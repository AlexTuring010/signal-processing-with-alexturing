'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const T_END = 1.0
const F = 3 // 3 Hz cosine

type Quadrant = {
  id: string
  title: string
  desc: string
  /** Time axis behavior. */
  time: 'continuous' | 'discrete'
  /** Amplitude axis behavior. */
  amp: 'analog' | 'digital'
}

const QUADRANTS: Quadrant[] = [
  {
    id: 'cc',
    title: 'Συνεχής χρόνος · Analog',
    desc: 'Ο φυσικός κόσμος. Π.χ. φωνή πριν μπει σε καλώδιο.',
    time: 'continuous',
    amp: 'analog',
  },
  {
    id: 'cd',
    title: 'Συνεχής χρόνος · Ψηφιακό πλάτος',
    desc: 'Συνεχής στον χρόνο, αλλά πάλλεται μόνο μεταξύ διακριτών επιπέδων (π.χ. 0/5 V).',
    time: 'continuous',
    amp: 'digital',
  },
  {
    id: 'dc',
    title: 'Διακριτός χρόνος · Analog',
    desc: 'Δείγματα με άπειρη ακρίβεια. Θεωρητικό — εμφανίζεται στις αναλύσεις.',
    time: 'discrete',
    amp: 'analog',
  },
  {
    id: 'dd',
    title: 'Διακριτός χρόνος · Ψηφιακό πλάτος',
    desc: 'Αυτό που αποθηκεύει ο υπολογιστής σου: sampled + quantized.',
    time: 'discrete',
    amp: 'digital',
  },
]

function quantize(v: number, levels: number) {
  // Maps v in [-1, 1] to one of L levels uniformly.
  const L = Math.max(2, levels)
  const step = 2 / (L - 1)
  const k = Math.round((v + 1) / step)
  return -1 + k * step
}

export function FourQuadrantSignalDemo() {
  const [fs, setFs] = useState(20)
  const [levels, setLevels] = useState(5)
  const refs = [
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
  ]

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    QUADRANTS.forEach((q, i) => {
      const c = refs[i].current
      if (c) drawQuadrant(c, colors, q, fs, levels)
    })
    // refs is stable across renders; we depend on the live values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs, levels])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Τέσσερα τεταρτημόρια — ίδιο σήμα, διαφορετικοί τρόποι
        </h4>
        <p className="mt-1 text-xs text-fg-muted">
          Ο <em>χρόνος</em> και το <em>πλάτος</em> είναι δύο ανεξάρτητοι άξονες
          που μπορεί να είναι συνεχείς ή διακριτοί. Αυτό μας δίνει 4 συνδυασμούς
          για το ίδιο cosine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUADRANTS.map((q, i) => (
          <div
            key={q.id}
            className="overflow-hidden rounded-md border border-border bg-bg-soft/40"
          >
            <div className="border-b border-border bg-bg-soft px-2.5 py-1.5">
              <div className="text-[11px] font-semibold tracking-tight text-fg">
                {q.title}
              </div>
              <div className="text-[10px] text-fg-muted">{q.desc}</div>
            </div>
            <canvas
              ref={refs[i]}
              style={{ height: 110 }}
              className="block h-[110px] w-full"
              aria-label={q.title}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Sample rate · fs ={' '}
            <span className="font-mono text-fg tabular-nums">{fs} Hz</span>
          </label>
          <input
            type="range"
            min={5}
            max={80}
            step={1}
            value={fs}
            onChange={(e) => setFs(parseInt(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Sample rate"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Επίπεδα κβαντισμού ={' '}
            <span className="font-mono text-fg tabular-nums">{levels}</span>
          </label>
          <input
            type="range"
            min={2}
            max={32}
            step={1}
            value={levels}
            onChange={(e) => setLevels(parseInt(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Quantization levels"
          />
        </div>
      </div>
    </figure>
  )
}

function drawQuadrant(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  q: Quadrant,
  fs: number,
  levels: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 14
  const padY = 10

  // Center axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h / 2)
  ctx.lineTo(w - padX, h / 2)
  ctx.stroke()

  const xt = (t: number) => lerp(t, 0, T_END, padX, w - padX)
  const yv = (v: number) => lerp(v, 1, -1, padY, h - padY)

  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = 1.6

  if (q.time === 'continuous' && q.amp === 'analog') {
    ctx.beginPath()
    const steps = w
    for (let i = 0; i <= steps; i++) {
      const t = lerp(i, 0, steps, 0, T_END)
      const v = Math.cos(2 * Math.PI * F * t)
      const x = xt(t)
      const y = yv(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  } else if (q.time === 'continuous' && q.amp === 'digital') {
    // Step waveform: amplitude continuous in t but only quantized levels.
    ctx.beginPath()
    const steps = w
    let prevQ = NaN
    for (let i = 0; i <= steps; i++) {
      const t = lerp(i, 0, steps, 0, T_END)
      const v = Math.cos(2 * Math.PI * F * t)
      const qv = quantize(v, levels)
      const x = xt(t)
      const y = yv(qv)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else if (qv !== prevQ) {
        // Draw the vertical step at the boundary.
        ctx.lineTo(x, yv(prevQ))
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      prevQ = qv
    }
    ctx.stroke()
  } else if (q.time === 'discrete' && q.amp === 'analog') {
    drawStems(ctx, fs, xt, yv, h, colors)
  } else {
    // discrete time, digital amplitude: sample then quantize.
    drawStems(ctx, fs, xt, yv, h, colors, (v) => quantize(v, levels))
  }

  // Quantization grid hint, when amp is digital.
  if (q.amp === 'digital') {
    ctx.save()
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 3])
    const L = Math.max(2, levels)
    for (let k = 0; k < L; k++) {
      const v = -1 + (2 * k) / (L - 1)
      ctx.beginPath()
      ctx.moveTo(padX, yv(v))
      ctx.lineTo(w - padX, yv(v))
      ctx.stroke()
    }
    ctx.restore()
  }
}

function drawStems(
  ctx: CanvasRenderingContext2D,
  fs: number,
  xt: (t: number) => number,
  yv: (v: number) => number,
  h: number,
  colors: ReturnType<typeof getThemeColors>,
  transform?: (v: number) => number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  const dt = 1 / fs
  const N = Math.floor(T_END / dt) + 1
  for (let n = 0; n < N; n++) {
    const t = n * dt
    if (t > T_END) break
    let v = Math.cos(2 * Math.PI * F * t)
    if (transform) v = transform(v)
    const x = xt(t)
    const yZero = h / 2
    const y = yv(v)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
}
