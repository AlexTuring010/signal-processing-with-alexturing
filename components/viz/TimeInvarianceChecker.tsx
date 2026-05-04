'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type SysId = 'gain' | 'tx' | 'rc'

const SYSTEMS: { id: SysId; expr: string; expected: 'TI' | 'non-TI'; blurb: string }[] = [
  {
    id: 'gain',
    expr: 'y(t) = 2 x(t)',
    expected: 'TI',
    blurb: 'Σταθερό κέρδος. Η σχέση input→output δεν εξαρτάται από τον χρόνο.',
  },
  {
    id: 'tx',
    expr: 'y(t) = t · x(t)',
    expected: 'non-TI',
    blurb:
      'Ο συντελεστής εξαρτάται από τον χρόνο. Όσο αργότερα δίνεις το ίδιο σήμα, τόσο πιο «θορυβημένο» βγαίνει.',
  },
  {
    id: 'rc',
    expr: 'RC LP filter (h(t) = e^(-t/0.2)/0.2)',
    expected: 'TI',
    blurb: 'Φίλτρο διαμορφωμένο μόνο μέσω convolution με σταθερή h(t) — TI.',
  },
]

const T_END = 4
const N = 800
const RC_TAU = 0.2

function pulse(t: number) {
  // Triangular pulse around 1, width 0.6.
  const center = 1.0
  const half = 0.3
  const d = Math.abs(t - center)
  if (d > half) return 0
  return 1 - d / half
}

function applySystem(id: SysId, samples: Float32Array, dt: number): Float32Array {
  const out = new Float32Array(samples.length)
  if (id === 'gain') {
    for (let i = 0; i < samples.length; i++) out[i] = 2 * samples[i]
    return out
  }
  if (id === 'tx') {
    for (let i = 0; i < samples.length; i++) {
      const t = i * dt
      out[i] = t * samples[i]
    }
    return out
  }
  // RC LP filter — discrete convolution with h[k] = (1/τ) e^(-k·dt/τ) for k≥0
  const hLen = Math.min(samples.length, Math.ceil(8 * RC_TAU / dt))
  const h = new Float32Array(hLen)
  for (let k = 0; k < hLen; k++) {
    h[k] = (1 / RC_TAU) * Math.exp((-k * dt) / RC_TAU)
  }
  for (let i = 0; i < samples.length; i++) {
    let s = 0
    for (let k = 0; k < Math.min(hLen, i + 1); k++) {
      s += samples[i - k] * h[k]
    }
    out[i] = s * dt
  }
  return out
}

export function TimeInvarianceChecker() {
  const [sysId, setSysId] = useState<SysId>('tx')
  const [delay, setDelay] = useState(1.0) // seconds

  const sys = SYSTEMS.find((s) => s.id === sysId)!
  const dt = T_END / (N - 1)

  const data = useMemo(() => {
    const x = new Float32Array(N)
    const xShifted = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const t = i * dt
      x[i] = pulse(t)
      xShifted[i] = pulse(t - delay)
    }
    const y = applySystem(sysId, x, dt)
    const yShifted = applySystem(sysId, xShifted, dt)
    // Reference: y(t-delay) — what we'd expect if TI.
    const yExpected = new Float32Array(N)
    const shiftSamples = Math.round(delay / dt)
    for (let i = 0; i < N; i++) {
      const j = i - shiftSamples
      yExpected[i] = j >= 0 && j < N ? y[j] : 0
    }
    let maxDiff = 0
    for (let i = 0; i < N; i++) {
      const d = Math.abs(yShifted[i] - yExpected[i])
      if (d > maxDiff) maxDiff = d
    }
    return { x, xShifted, y, yShifted, yExpected, maxDiff }
  }, [sysId, delay, dt])

  const isTI = data.maxDiff < 1e-2

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Έλεγχος χρονικής αμεταβλητότητας
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Δίνουμε ένα σήμα στο σύστημα, μετά το ίδιο σήμα <em>καθυστερημένο</em>.
        Συγκρίνουμε «πραγματική έξοδος» vs «αναμενόμενη αν ήταν TI» (= η αρχική
        έξοδος καθυστερημένη κατά το ίδιο).
      </p>

      <div
        role="radiogroup"
        aria-label="Επιλογή συστήματος"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={sysId === s.id}
            onClick={() => setSysId(s.id)}
            className={cn(
              'rounded-full px-2 py-0.5 transition-colors',
              sysId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {s.expr}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Plot
          title="Πραγματική έξοδος για το καθυστερημένο σήμα"
          samples={data.yShifted}
          accent
        />
        <Plot
          title="Αναμενόμενη έξοδος αν TI · y(t − τ₀)"
          samples={data.yExpected}
        />
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Καθυστέρηση τ₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{delay.toFixed(2)} s</span>
        </label>
        <input
          type="range"
          min={0}
          max={1.8}
          step={0.05}
          value={delay}
          onChange={(e) => setDelay(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Delay tau-0"
        />
      </div>

      <div
        role="status"
        className={
          'mt-3 rounded-md border px-3 py-2 text-sm ' +
          (isTI
            ? 'border-success/40 bg-success/10 text-success'
            : 'border-warn/50 bg-warn/10 text-warn')
        }
      >
        <span className="inline-flex items-center gap-1.5">
          {isTI ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {isTI
            ? 'Οι δύο καμπύλες ταυτίζονται · TI σύστημα ✓'
            : `Διαφέρουν · NON-TI ✗ (max |Δ| = ${data.maxDiff.toFixed(2)})`}
        </span>
      </div>

      <p className="mt-2 text-xs text-fg-muted">{sys.blurb}</p>
    </figure>
  )
}

function Plot({
  title,
  samples,
  accent,
}: {
  title: string
  samples: Float32Array
  accent?: boolean
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawSamples(canvas, colors, samples, accent ? 'accent' : 'success')
  }, [samples, accent])
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5 text-[11px] font-semibold tracking-tight">
        {title}
      </div>
      <canvas ref={ref} style={{ height: 130 }} className="block h-[130px] w-full" aria-label={title} />
    </div>
  )
}

function drawSamples(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  samples: Float32Array,
  color: 'accent' | 'success',
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 14
  const padY = 12
  let yMin = 0
  let yMax = 0
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]
    if (v < yMin) yMin = v
    if (v > yMax) yMax = v
  }
  const range = Math.max(0.5, yMax - yMin)
  const yLo = yMin - range * 0.1
  const yHi = yMax + range * 0.15

  const px = (i: number) => lerp(i, 0, samples.length - 1, padX, w - padX)
  const py = (y: number) => lerp(y, yHi, yLo, padY, h - padY)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, py(0))
  ctx.lineTo(w - padX, py(0))
  ctx.stroke()

  ctx.strokeStyle = color === 'accent' ? colors.accent : colors.success
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < samples.length; i++) {
    const x = px(i)
    const y = py(samples[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}
