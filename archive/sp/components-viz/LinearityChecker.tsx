'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

const T_END = 2
const A1 = 1
const A2 = 1
/** Tolerance below which we consider two waveforms equal. */
const EQUAL_TOL = 1e-3

type SystemDef = {
  id: string
  expr: string
  fn: (x: number, t: number) => number
  expectedLinear: boolean
  blurb: string
}

const SYSTEMS: SystemDef[] = [
  {
    id: 'gain',
    expr: 'y = 5x',
    fn: (x) => 5 * x,
    expectedLinear: true,
    blurb: 'Καθαρός κέρδους (gain). Είναι γραμμικό.',
  },
  {
    id: 'affine',
    expr: 'y = 5x + 3',
    fn: (x) => 5 * x + 3,
    expectedLinear: false,
    blurb:
      'Προσοχή! Φαίνεται γραμμικό αλλά **δεν είναι**: το +3 σπάει την υπέρθεση. Στο 0 πρέπει να βγάλει 0 — εδώ βγάζει 3.',
  },
  {
    id: 'square',
    expr: 'y = 3x²',
    fn: (x) => 3 * x * x,
    expectedLinear: false,
    blurb: 'Το τετράγωνο σπάει τη γραμμικότητα. (a₁x₁+a₂x₂)² ≠ a₁x₁²+a₂x₂².',
  },
  {
    id: 'cos',
    expr: 'y = cos(x)',
    fn: (x) => Math.cos(x),
    expectedLinear: false,
    blurb: 'Μη γραμμική συνάρτηση. cos(x₁+x₂) ≠ cos(x₁) + cos(x₂).',
  },
  {
    id: 'shift',
    expr: 'y(t) = x(t-0.3) + x(t+0.3)',
    fn: () => 0,
    expectedLinear: true,
    blurb:
      'Άθροισμα ολισθήσεων του εισόδου — γραμμικό. Στην πράξη το ελέγχουμε δειγματοληπτικά.',
  },
]

function x1Sample(t: number) {
  return Math.cos(2 * Math.PI * 1 * t)
}
function x2Sample(t: number) {
  return t >= 0 && t <= 1 ? 0.6 : 0
}

const N = 512

function applySystem(sys: SystemDef, samples: Float32Array): Float32Array {
  const out = new Float32Array(samples.length)
  if (sys.id === 'shift') {
    // y(t) = x(t-0.3) + x(t+0.3) — apply via index shift in the sample array.
    const dt = T_END / (samples.length - 1)
    const shift = Math.round(0.3 / dt)
    for (let i = 0; i < samples.length; i++) {
      const a = i - shift
      const b = i + shift
      const va = a >= 0 && a < samples.length ? samples[a] : 0
      const vb = b >= 0 && b < samples.length ? samples[b] : 0
      out[i] = va + vb
    }
    return out
  }
  for (let i = 0; i < samples.length; i++) {
    const t = i * (T_END / (samples.length - 1))
    out[i] = sys.fn(samples[i], t)
  }
  return out
}

export function LinearityChecker() {
  const [sysId, setSysId] = useState<string>('gain')
  const sys = SYSTEMS.find((s) => s.id === sysId)!

  const data = useMemo(() => {
    const x1 = new Float32Array(N)
    const x2 = new Float32Array(N)
    const combined = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const t = (i / (N - 1)) * T_END
      x1[i] = x1Sample(t)
      x2[i] = x2Sample(t)
      combined[i] = A1 * x1[i] + A2 * x2[i]
    }
    const yCombined = applySystem(sys, combined)
    const y1 = applySystem(sys, x1)
    const y2 = applySystem(sys, x2)
    const ySeparate = new Float32Array(N)
    for (let i = 0; i < N; i++) ySeparate[i] = A1 * y1[i] + A2 * y2[i]

    let maxDiff = 0
    for (let i = 0; i < N; i++) {
      const d = Math.abs(yCombined[i] - ySeparate[i])
      if (d > maxDiff) maxDiff = d
    }

    return { x1, x2, combined, yCombined, ySeparate, maxDiff }
  }, [sys])

  const isLinear = data.maxDiff < EQUAL_TOL

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Έλεγχος γραμμικότητας — superposition
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Συγκρίνουμε δύο εκδοχές: αριστερά «βάζω <code className="font-mono">a₁x₁ + a₂x₂</code> στο σύστημα», δεξιά «βάζω καθένα ξεχωριστά και προσθέτω τις εξόδους». Για γραμμικά συστήματα οι δύο πρέπει να συμπίπτουν ακριβώς.
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
          title="S{a₁x₁ + a₂x₂}"
          subtitle="Συνδυασμός μπαίνει, μετά εφαρμόζεται το σύστημα"
          samples={data.yCombined}
        />
        <Plot
          title="a₁ S{x₁} + a₂ S{x₂}"
          subtitle="Καθένα μπαίνει χωριστά, μετά αθροίζονται οι έξοδοι"
          samples={data.ySeparate}
        />
      </div>

      <div
        role="status"
        className={
          'mt-3 rounded-md border px-3 py-2 text-sm ' +
          (isLinear
            ? 'border-success/40 bg-success/10 text-success'
            : 'border-warn/50 bg-warn/10 text-warn')
        }
      >
        <span className="inline-flex items-center gap-1.5">
          {isLinear ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4" aria-hidden="true" />
          )}
          {isLinear
            ? 'Οι δύο έξοδοι ταυτίζονται · γραμμικό σύστημα ✓'
            : `Οι δύο έξοδοι διαφέρουν · μη γραμμικό σύστημα ✗  (max |Δ| = ${data.maxDiff.toFixed(3)})`}
        </span>
      </div>

      <p className="mt-2 text-xs text-fg-muted">{sys.blurb}</p>
    </figure>
  )
}

function Plot({
  title,
  subtitle,
  samples,
}: {
  title: string
  subtitle: string
  samples: Float32Array
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawSamples(canvas, colors, samples)
  }, [samples])
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5">
        <div className="text-[11px] font-semibold tracking-tight">{title}</div>
        <div className="text-[10px] text-fg-muted">{subtitle}</div>
      </div>
      <canvas ref={ref} style={{ height: 130 }} className="block h-[130px] w-full" aria-label={title} />
    </div>
  )
}

function drawSamples(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  samples: Float32Array,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 14
  const padY = 12
  let yMin = Infinity
  let yMax = -Infinity
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]
    if (v < yMin) yMin = v
    if (v > yMax) yMax = v
  }
  const range = Math.max(1, yMax - yMin)
  yMin -= range * 0.1
  yMax += range * 0.1

  const px = (i: number) => lerp(i, 0, samples.length - 1, padX, w - padX)
  const py = (y: number) => lerp(y, yMax, yMin, padY, h - padY)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  if (yMin <= 0 && yMax >= 0) {
    ctx.beginPath()
    ctx.moveTo(padX, py(0))
    ctx.lineTo(w - padX, py(0))
    ctx.stroke()
  }
  ctx.strokeStyle = colors.accent
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
