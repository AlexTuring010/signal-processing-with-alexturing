'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'

/**
 * Slide 25's «αλλαγή κλίμακας» visual + slide 21's phase-flip plot, in one viz.
 *
 * Three rect widths shown simultaneously — narrow, medium, wide — with the
 * corresponding sinc magnitudes side-by-side and the ±π phase plot for the
 * currently-selected width. Drives home the scaling theorem
 *     x(αt) ↔ (1/|α|) X(f/α)
 * by letting the student see all three duals at once instead of in a slider
 * sweep.
 *
 * The phase plot is what RectToSincViz omits: real sinc with negative lobes
 * shows up as θ(f) ∈ {0, ±π}, with sign flips at every zero crossing of the
 * sinc. Slide 21 plots exactly this.
 */

const T_NARROW = 0.5
const T_MEDIUM = 1.0
const T_WIDE = 2.0

const A_AMP = 1.0

const T_DOMAIN = 4.5
const F_DOMAIN = 6.0

const COLOR_NARROW = '#ec4899' // pink
const COLOR_MEDIUM = '#3b82f6' // blue
const COLOR_WIDE = '#10b981' // green

type Width = 'narrow' | 'medium' | 'wide'

const PRESETS: { id: Width; T: number; label: string; color: string }[] = [
  { id: 'narrow', T: T_NARROW, label: 'στενός παλμός (T = 0.5)', color: COLOR_NARROW },
  { id: 'medium', T: T_MEDIUM, label: 'μέτριος παλμός (T = 1.0)', color: COLOR_MEDIUM },
  { id: 'wide', T: T_WIDE, label: 'πλατύς παλμός (T = 2.0)', color: COLOR_WIDE },
]

export function ScalingDualityViz() {
  const [selected, setSelected] = useState<Width>('medium')
  const [showAllPhases, setShowAllPhases] = useState(false)

  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTimeStack(timeRef.current, colors, selected)
    if (magRef.current) drawMagnitudeStack(magRef.current, colors, selected)
    if (phaseRef.current) drawPhase(phaseRef.current, colors, selected, showAllPhases)
  }, [selected, showAllPhases])

  const currentT = PRESETS.find((p) => p.id === selected)?.T ?? T_MEDIUM
  const firstZero = 1 / currentT

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Κλιμάκωση στον χρόνο ↔ αντίστροφη κλιμάκωση στη συχνότητα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τρεις παλμοί διαφορετικού πλάτους <span className="font-mono">T</span> ταυτόχρονα. Παρατήρησε
        ότι ο <span style={{ color: COLOR_NARROW }}>στενός</span> παλμός παράγει την πιο{' '}
        <span style={{ color: COLOR_NARROW }}>πλατιά</span> sinc, ενώ ο{' '}
        <span style={{ color: COLOR_WIDE }}>πλατύς</span> παράγει την πιο{' '}
        <span style={{ color: COLOR_WIDE }}>στενή</span>. Αυτή είναι η scaling property
        <span className="ml-1 font-mono">x(αt) ↔ (1/|α|) X(f/α)</span> δουλεύοντας. Στο κάτω panel η
        φάση των επιλεγμένων sincs — πηδάει από <span className="font-mono">0</span> σε{' '}
        <span className="font-mono">±π</span> κάθε φορά που η sinc περνά μηδέν (αρνητικός λοβός).
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const isActive = selected === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                isActive
                  ? 'border-transparent text-white'
                  : 'border-border bg-bg text-fg-muted hover:bg-bg-elevated'
              }`}
              style={isActive ? { background: p.color } : undefined}
            >
              {p.label}
            </button>
          )
        })}
        <label className="ml-auto flex items-center gap-1.5 text-xs text-fg-muted">
          <input
            type="checkbox"
            checked={showAllPhases}
            onChange={(e) => setShowAllPhases(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          δείξε όλες τις φάσεις
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Χρόνος" subtitle="x(t) = rect(t/T)">
          <canvas
            ref={timeRef}
            style={{ height: 220 }}
            className="block h-[220px] w-full"
            aria-label="Three rectangular pulses of different widths"
          />
        </Panel>
        <Panel title="Συχνότητα — μέτρο" subtitle="|X(f)| = T · |sinc(fT)|">
          <canvas
            ref={magRef}
            style={{ height: 220 }}
            className="block h-[220px] w-full"
            aria-label="Sinc magnitude spectra"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <Panel
          title="Συχνότητα — φάση"
          subtitle="θ(f) = arg X(f) ∈ {0, ±π} (real sinc με αρνητικούς λοβούς)"
        >
          <canvas
            ref={phaseRef}
            style={{ height: 160 }}
            className="block h-[160px] w-full"
            aria-label="Phase spectrum"
          />
        </Panel>
      </div>

      <div className="mt-3 grid gap-2 rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg-muted sm:grid-cols-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Επιλεγμένο T</div>
          <div className="font-mono text-fg tabular-nums">{currentT.toFixed(2)} s</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            1ος μηδενισμός sinc
          </div>
          <div className="font-mono text-fg tabular-nums">
            ±{firstZero.toFixed(2)} Hz <span className="text-fg-subtle">(= ±1/T)</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">DC value X(0)</div>
          <div className="font-mono text-fg tabular-nums">
            {(A_AMP * currentT).toFixed(2)} <span className="text-fg-subtle">(= AT)</span>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-fg-muted">
        Slide 25 του deck δείχνει αυτή την τριπλέτα στατικά· εδώ μπορείς να εστιάσεις σε μία κάθε
        φορά. Η φάση των sinc είναι 0 όπου ο λοβός είναι θετικός, ±π όπου είναι αρνητικός — γι' αυτό
        η συμβατική σύμβαση είναι να σχεδιάζεις μόνο το <strong>|X(f)|</strong> με αρνητικές περιοχές
        για να μην χρειάζεσαι ξεχωριστό φάσμα φάσης.
      </figcaption>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

function drawTimeStack(canvas: HTMLCanvasElement, colors: ThemeColors, selected: Width) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 24

  // axes
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('t', w - pad / 2 - 8, h / 2 - 4)
  ctx.fillText('x(t)', w / 2 + 6, pad / 2 + 8)

  // baseline (zero) tick on t-axis
  for (let tick = -3; tick <= 3; tick++) {
    if (tick === 0) continue
    const x = w / 2 + (tick / T_DOMAIN) * (w / 2 - pad)
    ctx.beginPath()
    ctx.moveTo(x, h / 2 - 3)
    ctx.lineTo(x, h / 2 + 3)
    ctx.stroke()
  }

  // ampLevel — we'll stack the three rects vertically so they don't overlap.
  // Narrow → mapped to top stripe, medium → middle stripe, wide → bottom stripe.
  // Y mapping: each "stripe" gets ~ (h - 2*pad) / 3 vertical room.
  const stripe = (h - 2 * pad) / 3
  const yCenters = [pad + stripe / 2 + 4, pad + stripe * 1.5 + 4, pad + stripe * 2.5 + 4]

  PRESETS.forEach((p, i) => {
    const yc = yCenters[i]
    const isActive = selected === p.id
    const ampHeight = stripe * 0.4
    const x0 = w / 2 - (p.T / 2 / T_DOMAIN) * (w / 2 - pad)
    const x1 = w / 2 + (p.T / 2 / T_DOMAIN) * (w / 2 - pad)
    ctx.fillStyle = isActive ? p.color : p.color + '40'
    ctx.strokeStyle = p.color
    ctx.lineWidth = isActive ? 2 : 1
    ctx.beginPath()
    ctx.moveTo(pad, yc)
    ctx.lineTo(x0, yc)
    ctx.lineTo(x0, yc - ampHeight)
    ctx.lineTo(x1, yc - ampHeight)
    ctx.lineTo(x1, yc)
    ctx.lineTo(w - pad / 2, yc)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x0, yc)
    ctx.lineTo(x0, yc - ampHeight)
    ctx.lineTo(x1, yc - ampHeight)
    ctx.lineTo(x1, yc)
    ctx.fill()

    ctx.fillStyle = p.color
    ctx.font = isActive
      ? 'bold 10px ui-sans-serif, system-ui, sans-serif'
      : '10px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(`T = ${p.T.toFixed(1)}`, w - pad / 2 - 38, yc - ampHeight - 2)
  })
}

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

function drawMagnitudeStack(canvas: HTMLCanvasElement, colors: ThemeColors, selected: Width) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 24

  // baseline axis
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h - pad)
  ctx.lineTo(w - pad / 2, h - pad)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('f', w - pad / 2 - 8, h - pad - 4)
  ctx.fillText('|X(f)|', w / 2 + 6, pad / 2 + 8)

  // x-axis tick labels
  for (let tick = -5; tick <= 5; tick++) {
    if (tick === 0) continue
    const x = w / 2 + (tick / F_DOMAIN) * (w / 2 - pad)
    ctx.beginPath()
    ctx.moveTo(x, h - pad - 3)
    ctx.lineTo(x, h - pad + 3)
    ctx.stroke()
  }

  // determine y-axis scale: max |X(0)| over all three = A * max(T) = wide
  const maxAmp = A_AMP * T_WIDE
  const yScale = (h - 2 * pad) / maxAmp

  // sample range
  const samples = 700

  PRESETS.forEach((p) => {
    const isActive = selected === p.id
    ctx.strokeStyle = isActive ? p.color : p.color + '60'
    ctx.lineWidth = isActive ? 2.2 : 1.4
    ctx.beginPath()
    for (let i = 0; i < samples; i++) {
      const f = -F_DOMAIN + (2 * F_DOMAIN * i) / (samples - 1)
      const X = A_AMP * p.T * sinc(f * p.T)
      const Y = Math.abs(X)
      const px = w / 2 + (f / F_DOMAIN) * (w / 2 - pad)
      const py = h - pad - Y * yScale
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // mark first zero
    if (isActive) {
      const fz = 1 / p.T
      const fzPx = w / 2 + (fz / F_DOMAIN) * (w / 2 - pad)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(fzPx, h - pad, 3, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(w / 2 - (fz / F_DOMAIN) * (w / 2 - pad), h - pad, 3, 0, 2 * Math.PI)
      ctx.fill()
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('±1/T', fzPx + 6, h - pad - 6)
    }
  })
}

function drawPhase(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  selected: Width,
  showAll: boolean,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 24

  // axes
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('f', w - pad / 2 - 8, h / 2 - 4)
  ctx.fillText('θ(f)', w / 2 + 6, pad / 2 + 8)

  // π and -π gridlines
  const piHeight = (h - pad) * 0.4
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(pad, h / 2 - piHeight)
  ctx.lineTo(w - pad / 2, h / 2 - piHeight)
  ctx.moveTo(pad, h / 2 + piHeight)
  ctx.lineTo(w - pad / 2, h / 2 + piHeight)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('+π', pad - 12, h / 2 - piHeight + 4)
  ctx.fillText('−π', pad - 12, h / 2 + piHeight + 4)

  const toDraw = showAll ? PRESETS : PRESETS.filter((p) => p.id === selected)

  toDraw.forEach((p) => {
    ctx.strokeStyle = p.color
    ctx.lineWidth = 2.0
    ctx.fillStyle = p.color
    // For real symmetric x(t) = A·rect(t/T), X(f) is real-valued sinc.
    // Phase is 0 on positive lobes, ±π on negative lobes — a square wave that
    // jumps by π at every zero. Connect consecutive valid samples (including
    // across each zero) so the jump renders as a vertical side on BOTH halves
    // of the axis; the −π for f>0 / +π for f<0 convention keeps θ(f) odd.
    const samples = 1200
    let prevPx = -1
    let prevPy = -1

    for (let i = 0; i < samples; i++) {
      const f = -F_DOMAIN + (2 * F_DOMAIN * i) / (samples - 1)
      const X = A_AMP * p.T * sinc(f * p.T)
      let theta = 0
      if (X > 1e-6) theta = 0
      else if (X < -1e-6) theta = f > 0 ? -Math.PI : Math.PI
      else continue // undefined exactly at a zero — keep prev so the jump connects across

      const px = w / 2 + (f / F_DOMAIN) * (w / 2 - pad)
      const py = h / 2 - (theta / Math.PI) * piHeight

      if (prevPx >= 0) {
        ctx.beginPath()
        ctx.moveTo(prevPx, prevPy)
        ctx.lineTo(px, py)
        ctx.stroke()
      }
      prevPx = px
      prevPy = py
    }
  })

  // annotation about the discontinuity
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(
    'Άλματα ±π στα μηδενικά του sinc (slide 21)',
    pad + 6,
    h - pad / 2 - 4,
  )
}
