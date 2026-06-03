'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

const T_END = 1.0 // 1 second window
const F = 2 // 2 Hz cosine — chunky enough to see the steps, well above Nyquist for our fs range

type Layers = {
  showOriginal: boolean
  showSamples: boolean
  showStaircase: boolean
}

export function StaircaseHoldDemo() {
  const [fs, setFs] = useState(8) // sample/hold rate in Hz
  const [layers, setLayers] = useState<Layers>({
    showOriginal: true,
    showSamples: true,
    showStaircase: true,
  })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    draw(canvas, colors, fs, layers)
  }, [fs, layers])

  const nSamples = Math.floor(T_END * fs) + 1
  const stepMs = Math.round(1000 / fs)

  let takeaway: string
  if (fs <= 8) {
    takeaway =
      'Χοντρά σκαλοπάτια — το σήμα μοιάζει «τετραγωνισμένο» και απέχει αισθητά από τη λεία καμπύλη.'
  } else if (fs <= 20) {
    takeaway = 'Τα σκαλοπάτια λεπταίνουν και αρχίζουν να ακολουθούν την καμπύλη.'
  } else {
    takeaway =
      'Πολύ λεπτά σκαλοπάτια — σχεδόν ταυτίζονται με το αρχικό x(t)· ένα ήπιο LPF σβήνει εύκολα τα «σκαλάκια».'
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Πώς φτιάχνεται ένα σήμα «συνεχών βημάτων» (zero-order hold)
        </h4>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Πάρε τα <strong>δείγματα</strong> (τις διακριτές μετρήσεις) και «κράτησε»
        την κάθε τιμή <strong>σταθερή μέχρι το επόμενο δείγμα</strong>. Αυτό που
        προκύπτει είναι σκαλοπάτια: ένα σήμα <em>συνεχούς χρόνου</em> (ορίζεται
        για κάθε <code className="font-mono">t</code>) που όμως παίρνει μόνο τις
        τιμές των δειγμάτων. Αυτό ακριβώς βγάζει ένας DAC. Παίξε με τον ρυθμό
        δειγμάτων <em>fs</em> και δες τι παθαίνουν τα σκαλοπάτια.
      </p>

      <PlotPanel title={`Staircase (ZOH) · fs = ${fs} Hz`}>
        <canvas
          ref={canvasRef}
          style={{ height: 180 }}
          className="block h-[180px] w-full"
          aria-label="Staircase / zero-order-hold reconstruction of a sampled cosine"
        />
      </PlotPanel>

      {/* Layer toggles — let the reader build the picture up or strip it down. */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <LayerToggle
          label="Αρχικό x(t)"
          swatch="dashed"
          checked={layers.showOriginal}
          onChange={(v) => setLayers((s) => ({ ...s, showOriginal: v }))}
        />
        <LayerToggle
          label="Δείγματα x[n]"
          swatch="dots"
          checked={layers.showSamples}
          onChange={(v) => setLayers((s) => ({ ...s, showSamples: v }))}
        />
        <LayerToggle
          label="Σκαλοπάτια (ZOH)"
          swatch="steps"
          checked={layers.showStaircase}
          onChange={(v) => setLayers((s) => ({ ...s, showStaircase: v }))}
        />
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Ρυθμός δειγμάτων:{' '}
          <span className="font-mono text-fg">{fs} Hz</span> ·{' '}
          <span className="font-mono text-fg">{nSamples}</span> δείγματα · κάθε
          σκαλοπάτι κρατάει <span className="font-mono text-fg">{stepMs} ms</span>
        </label>
        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={fs}
          onChange={(e) => setFs(parseInt(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Ρυθμός δειγμάτων fs"
        />
        <div className="flex justify-between text-[10px] text-fg-subtle">
          <span>5 Hz</span>
          <span>40 Hz</span>
        </div>
      </div>

      <p className="mt-2 text-xs text-fg-muted">{takeaway}</p>

      <p className="mt-2 text-[11px] text-fg-subtle">
        «Zero-order» = κρατάμε σταθερή τιμή ανάμεσα στα δείγματα (πολυώνυμο 0ου
        βαθμού). Γι' αυτό βγαίνουν επίπεδα σκαλοπάτια κι όχι γραμμές που κλίνουν.
      </p>
    </figure>
  )
}

function LayerToggle({
  label,
  swatch,
  checked,
  onChange,
}: {
  label: string
  swatch: 'dashed' | 'dots' | 'steps'
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-fg">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[rgb(var(--accent))]"
      />
      <Swatch kind={swatch} />
      {label}
    </label>
  )
}

function Swatch({ kind }: { kind: 'dashed' | 'dots' | 'steps' }) {
  if (kind === 'dashed') {
    return (
      <svg width="18" height="10" aria-hidden="true" className="shrink-0">
        <line
          x1="1"
          y1="5"
          x2="17"
          y2="5"
          stroke="rgb(var(--fg-subtle))"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
      </svg>
    )
  }
  if (kind === 'dots') {
    return (
      <svg width="18" height="10" aria-hidden="true" className="shrink-0">
        <circle cx="5" cy="5" r="2.5" fill="rgb(var(--warn))" />
        <circle cx="13" cy="5" r="2.5" fill="rgb(var(--warn))" />
      </svg>
    )
  }
  return (
    <svg width="18" height="10" aria-hidden="true" className="shrink-0">
      <path
        d="M1 8 H7 V3 H13 V6 H17"
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth="2"
      />
    </svg>
  )
}

function PlotPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight text-fg">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 26
const PAD_Y = 16

function draw(
  canvas: HTMLCanvasElement,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  fs: number,
  layers: Layers,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const X = (t: number) => lerp(t, 0, T_END, PAD_X, w - PAD_X)
  const Y = (v: number) => lerp(v, 1, -1, PAD_Y, h - PAD_Y)
  const yZero = Y(0)

  drawAxes(ctx, colors, w, h)

  // Sample instants and held values.
  const dt = 1 / fs
  const samples: { t: number; v: number }[] = []
  for (let n = 0; n * dt <= T_END + 1e-9; n++) {
    const t = Math.min(n * dt, T_END)
    samples.push({ t, v: Math.cos(2 * Math.PI * F * t) })
  }

  // Faint dashed original — the analog signal we sampled.
  if (layers.showOriginal) {
    ctx.strokeStyle = colors.fgSubtle
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    const steps = w
    for (let i = 0; i <= steps; i++) {
      const t = lerp(i, 0, steps, 0, T_END)
      const x = X(t)
      const y = Y(Math.cos(2 * Math.PI * F * t))
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Highlight one representative "held" interval so the hold is unmistakable.
  // Only when steps are wide enough to fit a label without crowding. Pick the
  // tread (among the first few, away from the edges) with the largest |value|
  // so the shaded block is clearly off the mid-line — never a zero-crossing.
  if (layers.showStaircase && fs <= 14 && samples.length > 2) {
    let idx = 1
    const limit = Math.min(4, samples.length - 2)
    for (let i = 1; i <= limit; i++) {
      if (Math.abs(samples[i].v) > Math.abs(samples[idx].v)) idx = i
    }
    const s = samples[idx]
    const next = samples[idx + 1]
    const xa = X(s.t)
    const xb = X(next.t)
    const yStep = Y(s.v)
    ctx.fillStyle = colors.accentSoft
    ctx.globalAlpha = 0.5
    ctx.fillRect(xa, Math.min(yStep, yZero), xb - xa, Math.abs(yZero - yStep))
    ctx.globalAlpha = 1
    // "hold" label, nudged off the step line toward the mid-line.
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const labelY = s.v >= 0 ? yStep + 13 : yStep - 7
    ctx.fillText('κράτημα', (xa + xb) / 2, labelY)
  }

  // The staircase itself — the star of the plot.
  if (layers.showStaircase) {
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'miter'
    ctx.beginPath()
    for (let i = 0; i < samples.length; i++) {
      const xn = X(samples[i].t)
      const xNext = i + 1 < samples.length ? X(samples[i + 1].t) : X(T_END)
      const y = Y(samples[i].v)
      if (i === 0) ctx.moveTo(xn, y)
      else ctx.lineTo(xn, y) // vertical riser from the previous step's value
      ctx.lineTo(xNext, y) // flat hold until the next sample
    }
    ctx.stroke()
  }

  // Sample lollipops — the discrete numbers we actually store (x[n]).
  if (layers.showSamples) {
    for (const s of samples) {
      const x = X(s.t)
      const y = Y(s.v)
      ctx.strokeStyle = colors.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, yZero)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.fillStyle = colors.warn
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  w: number,
  h: number,
) {
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, h / 2)
  ctx.lineTo(w - PAD_X, h / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('+1', PAD_X - 16, PAD_Y + 8)
  ctx.fillText('−1', PAD_X - 16, h - PAD_Y)
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', PAD_X, h - 3)
  ctx.fillText('1 s', w - PAD_X, h - 3)
}
