'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Slide 16-17: η απόκριση ενός ΓΧΑ συστήματος σε μιγαδικό εκθετικό σήμα.
 *
 *   Είσοδος:  x(t) = A · e^{j(2π f₀ t + φ)}                (rotating phasor)
 *   Έξοδος:   y(t) = H(f₀) · x(t)
 *           = |H(f₀)| · A · e^{j(2π f₀ t + φ + ∠H(f₀))}
 *
 * Το H(f₀) είναι ένας ΜΙΓΑΔΙΚΟΣ αριθμός που εξαρτάται μόνο από το
 * σύστημα και τη συχνότητα — όχι από τον χρόνο, όχι από το A, όχι από
 * το φ. Πολλαπλασιάζει ομοιόμορφα ολόκληρο το rotating phasor: το
 * μέτρο σκάλει την ακτίνα, η φάση περιστρέφει την αρχική θέση.
 *
 * Σε φάσμα γλώσσα: μία και μοναδική φασματική γραμμή στο +f₀ ύψους A
 * (όχι συμμετρικό ζεύγος — αυτό προκύπτει αργότερα όταν συνθέτεις
 * πραγματικά σήματα), στην έξοδο γίνεται A|H(f₀)| με τοπική
 * περιστροφή φάσης κατά ∠H(f₀). Καμία νέα συχνότητα — αυτό είναι το
 * eigenfunction property.
 *
 * Why a bespoke viz when EigenfunctionDemo exists: that viz takes a
 * real cosine input and shows real cosine output (the result that
 * matters for engineers), with a symmetric ±f₀ spectral pair. Slide 16
 * starts at a more primitive level — a single complex exponential with
 * a single spectral line — and is the natural derivation entry point.
 * Seeing the rotating phasor get scaled by H(f₀) without "spectral
 * symmetry" gymnastics makes the eigenfunction property visceral
 * before we specialise to cosines.
 */

type SysId = 'identity' | 'delay' | 'lpf' | 'hpf' | 'attenuator' | 'inverter' | 'custom'

type SysDef = {
  id: SysId
  label: string
  description: string
  H: (f: number) => { mag: number; phase: number }
}

const RC = 0.18 // for LPF / HPF presets
const DELAY = 0.15 // seconds

const SYSTEMS: SysDef[] = [
  {
    id: 'identity',
    label: 'Ταυτότητα',
    description: 'h(t) = δ(t) ⇒ H(f) = 1 ⇒ έξοδος ταυτίζεται με είσοδο.',
    H: () => ({ mag: 1, phase: 0 }),
  },
  {
    id: 'delay',
    label: 'Καθυστέρηση',
    description: `h(t) = δ(t − ${DELAY}) ⇒ H(f) = e^{−j2πf·${DELAY}} ⇒ |H|=1, ∠H = −2πf·${DELAY}.`,
    H: (f) => ({ mag: 1, phase: -2 * Math.PI * f * DELAY }),
  },
  {
    id: 'lpf',
    label: 'LPF (RC)',
    description: 'h(t) = (1/RC)·e^{−t/RC}·u(t) ⇒ |H| πέφτει με f, ∠H = −arctan(2πfRC).',
    H: (f) => {
      const omegaRC = 2 * Math.PI * f * RC
      return {
        mag: 1 / Math.sqrt(1 + omegaRC * omegaRC),
        phase: -Math.atan(omegaRC),
      }
    },
  },
  {
    id: 'hpf',
    label: 'HPF',
    description: '|H| ανεβαίνει με f, ∠H ≈ +arctan(1/(2πfRC)).',
    H: (f) => {
      const omegaRC = 2 * Math.PI * f * RC
      return {
        mag: omegaRC / Math.sqrt(1 + omegaRC * omegaRC),
        phase: Math.atan(1 / Math.max(0.001, omegaRC)),
      }
    },
  },
  {
    id: 'attenuator',
    label: '0.5×',
    description: 'h(t) = 0.5·δ(t) ⇒ H(f) = 0.5 ⇒ απλό υποδιπλασιαστή με μηδέν φάση.',
    H: () => ({ mag: 0.5, phase: 0 }),
  },
  {
    id: 'inverter',
    label: 'Αναστροφέας',
    description: 'h(t) = −δ(t) ⇒ H(f) = −1 = e^{jπ} ⇒ |H|=1, ∠H = π (αλλάζει πρόσημο).',
    H: () => ({ mag: 1, phase: Math.PI }),
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Σύρε τα sliders |H(f₀)| και ∠H(f₀) απευθείας.',
    H: () => ({ mag: 1, phase: 0 }), // overridden when 'custom' is selected
  },
]

const F_MIN = 0.4
const F_MAX = 4.0
const TIME_SPEED = 0.8 // visual rotation playback speed (period scale)

export function ComplexExpThroughLtiViz() {
  const [sysId, setSysId] = useState<SysId>('lpf')
  const [A, setA] = useState(1.0)
  const [f0, setF0] = useState(1.6)
  const [phi, setPhi] = useState(0)
  const [customMag, setCustomMag] = useState(0.7)
  const [customPhase, setCustomPhase] = useState(-Math.PI / 4)
  const [playing, setPlaying] = useState(true)
  const [t, setT] = useState(0)

  const sys = SYSTEMS.find((s) => s.id === sysId)!
  const H = useMemo(() => {
    if (sysId === 'custom') {
      return { mag: customMag, phase: customPhase }
    }
    return sys.H(f0)
  }, [sysId, sys, f0, customMag, customPhase])

  const inputCanvas = useRef<HTMLCanvasElement | null>(null)
  const outputCanvas = useRef<HTMLCanvasElement | null>(null)
  const spectrumCanvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setT((cur) => cur + dt * TIME_SPEED)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (inputCanvas.current) {
      drawPhasor(inputCanvas.current, colors, A, f0, phi, t, 'in', H)
    }
    if (outputCanvas.current) {
      drawPhasor(outputCanvas.current, colors, A, f0, phi, t, 'out', H)
    }
    if (spectrumCanvas.current) {
      drawSpectrum(spectrumCanvas.current, colors, A, f0, phi, H)
    }
  }, [A, f0, phi, t, H])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            ΓΧΑ × complex exponential · slide 16-17
          </h4>
          <p className="text-xs text-fg-muted">
            <InlineMath>{'x(t) = A\\,e^{j(2\\pi f_0 t + \\varphi)}'}</InlineMath> μπαίνει,{' '}
            <InlineMath>{'y(t) = H(f_0)\\,x(t)'}</InlineMath> βγαίνει.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

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
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-[11px] text-fg-muted">{sys.description}</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Panel
          title="Είσοδος"
          subtitle={`x(t) = A·e^{j(2πf₀t+φ)} · |x| = ${A.toFixed(2)}, ∠x(0) = ${phi.toFixed(2)}`}
        >
          <canvas
            ref={inputCanvas}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Input phasor"
          />
        </Panel>
        <Panel
          title="Έξοδος"
          subtitle={`y(t) = H(f₀)·x(t) · |y| = ${(A * H.mag).toFixed(2)}, ∠y(0) = ${(phi + H.phase).toFixed(2)}`}
        >
          <canvas
            ref={outputCanvas}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Output phasor"
          />
        </Panel>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-border/60 bg-bg-soft/40 p-3">
          <div className="mb-2 text-[11px] font-medium text-fg">H(f₀) — μιγαδικός αριθμός</div>
          <div className="space-y-1 text-[11px] tabular-nums text-fg-muted">
            <div>
              <span className="text-fg">|H(f₀)|</span> = {H.mag.toFixed(3)} (μέτρο — scaling)
            </div>
            <div>
              <span className="text-fg">∠H(f₀)</span> = {H.phase.toFixed(3)} rad = {((H.phase * 180) / Math.PI).toFixed(1)}° (φάση — rotation)
            </div>
            <div>
              <span className="text-fg">Re(H)</span> = {(H.mag * Math.cos(H.phase)).toFixed(3)},{' '}
              <span className="text-fg">Im(H)</span> = {(H.mag * Math.sin(H.phase)).toFixed(3)}
            </div>
          </div>
          {sysId === 'custom' && (
            <div className="mt-3 space-y-2 text-[11px]">
              <label className="flex flex-col gap-1">
                <span className="flex justify-between"><span>|H(f₀)|</span><span className="tabular-nums">{customMag.toFixed(2)}</span></span>
                <input
                  type="range"
                  min={0.1}
                  max={2.0}
                  step={0.05}
                  value={customMag}
                  onChange={(e) => setCustomMag(parseFloat(e.target.value))}
                  className="accent-accent"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="flex justify-between"><span>∠H(f₀) (rad)</span><span className="tabular-nums">{customPhase.toFixed(2)}</span></span>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step={Math.PI / 32}
                  value={customPhase}
                  onChange={(e) => setCustomPhase(parseFloat(e.target.value))}
                  className="accent-accent"
                />
              </label>
            </div>
          )}
        </div>
        <Panel title="Φασματικές γραμμές" subtitle="Μία γραμμή στο +f₀ — όχι συμμετρικό ζεύγος">
          <canvas
            ref={spectrumCanvas}
            style={{ height: 110 }}
            className="block h-[110px] w-full"
            aria-label="Spectral lines"
          />
        </Panel>
      </div>

      <div className="mt-4 space-y-2 text-[11px]">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between"><span>A (πλάτος)</span><span className="tabular-nums">{A.toFixed(2)}</span></span>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.05}
            value={A}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="accent-accent"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between"><span>f₀ (συχνότητα)</span><span className="tabular-nums">{f0.toFixed(2)} Hz</span></span>
          <input
            type="range"
            min={F_MIN}
            max={F_MAX}
            step={0.05}
            value={f0}
            onChange={(e) => setF0(parseFloat(e.target.value))}
            className="accent-accent"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between"><span>φ (αρχική φάση)</span><span className="tabular-nums">{phi.toFixed(2)} rad</span></span>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={Math.PI / 24}
            value={phi}
            onChange={(e) => setPhi(parseFloat(e.target.value))}
            className="accent-accent"
          />
        </label>
      </div>

      <figcaption className="mt-3 text-[11px] text-fg-subtle">
        Πρόσεξε ότι όση ώρα κινούνται τα phasors, το «κίτρινο» phasor δεξιά είναι πάντα το αριστερό
        × <InlineMath>H(f_0)</InlineMath> — δηλαδή έχει διαφορετική ακτίνα ({A.toFixed(2)} → {(A * H.mag).toFixed(2)})
        και έχει «πεταχτεί» μπροστά/πίσω κατά <InlineMath>∠H(f_0)</InlineMath>. Καμία αλλαγή στη
        συχνότητα περιστροφής. <strong>Αυτό είναι το eigenfunction property: συχνότητα μέσα = ίδια
        συχνότητα έξω, μόνο πλάτος + φάση αλλάζουν.</strong>
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
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded border border-border/60 bg-bg-soft/40 p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-[11px] font-medium tracking-tight text-fg">{title}</span>
        {subtitle && <span className="text-[10px] text-fg-muted">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

const PAD = 16
const TRACE_LEN = 64

function drawPhasor(
  canvas: HTMLCanvasElement,
  colors: Colors,
  A: number,
  f0: number,
  phi: number,
  t: number,
  which: 'in' | 'out',
  H: { mag: number; phase: number },
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)

  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) / 2 - PAD - 4

  // Unit / scale circle for reference
  const Aeff = which === 'in' ? A : A * H.mag
  const phiEff = which === 'in' ? phi : phi + H.phase
  const phaseColor = which === 'in' ? colors.accent : '#f59e0b' // amber for output

  // Reference unit circle (radius = scaled A)
  ctx.strokeStyle = colors.fgSubtle + '55'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, radius * Math.min(2.0, Math.max(0.1, Aeff)) / 2.0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Axes
  ctx.strokeStyle = colors.fgSubtle + '88'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, cy)
  ctx.lineTo(width - PAD, cy)
  ctx.moveTo(cx, PAD)
  ctx.lineTo(cx, height - PAD)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.fillText('Re', width - PAD - 2, cy - 2)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 4, PAD + 8)

  // Phasor angle
  const angle = 2 * Math.PI * f0 * t + phiEff
  const rad = (radius * Math.min(2.0, Math.max(0.1, Aeff))) / 2.0

  // Trace (recent positions)
  ctx.strokeStyle = phaseColor + '44'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  for (let i = 0; i < TRACE_LEN; i++) {
    const ti = t - (i / TRACE_LEN) * 0.5
    const a = 2 * Math.PI * f0 * ti + phiEff
    const px = cx + rad * Math.cos(a)
    const py = cy - rad * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Vector
  const tipX = cx + rad * Math.cos(angle)
  const tipY = cy - rad * Math.sin(angle)
  ctx.strokeStyle = phaseColor
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()

  // Arrow head
  const ah = 7
  const aAngle = angle + Math.PI
  ctx.fillStyle = phaseColor
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(
    tipX + ah * Math.cos(aAngle - 0.35),
    tipY - ah * Math.sin(aAngle - 0.35),
  )
  ctx.lineTo(
    tipX + ah * Math.cos(aAngle + 0.35),
    tipY - ah * Math.sin(aAngle + 0.35),
  )
  ctx.closePath()
  ctx.fill()

  // Projections (faint)
  ctx.strokeStyle = phaseColor + '55'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(tipX, cy)
  ctx.lineTo(tipX, tipY)
  ctx.moveTo(cx, tipY)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()
  ctx.setLineDash([])

  // Tip dot
  ctx.fillStyle = phaseColor
  ctx.beginPath()
  ctx.arc(tipX, tipY, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: Colors,
  A: number,
  f0: number,
  _phi: number,
  H: { mag: number; phase: number },
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)

  const padX = 28
  const padY = 14
  const x0 = padX
  const x1px = width - padX
  const y0 = height - padY - 4

  const fMax = 5
  const xAtF = (f: number) => x0 + (f / fMax) * (x1px - x0)

  // Baseline
  ctx.strokeStyle = colors.fgSubtle + '88'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1px, y0)
  ctx.stroke()

  // Ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let k = 0; k <= 5; k++) {
    const px = xAtF(k)
    ctx.beginPath()
    ctx.moveTo(px, y0 - 2)
    ctx.lineTo(px, y0 + 2)
    ctx.stroke()
    if (k > 0) ctx.fillText(`${k}`, px, y0 + 4)
  }
  ctx.fillText('f (Hz)', x1px - 4, y0 + 4)

  const usableH = y0 - padY
  const maxA = 2.0

  const drawStem = (f: number, mag: number, color: string, label: string) => {
    const px = xAtF(f)
    const heightPx = (Math.min(maxA, mag) / maxA) * usableH
    const py = y0 - heightPx
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(px, y0)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(label, px + 5, py - 2)
  }

  // Input stem
  drawStem(f0, A, colors.accent, `A = ${A.toFixed(2)}`)
  // Output stem (offset slightly so they don't fully overlap visually)
  const offset = 0.04 * fMax
  drawStem(f0 + offset, A * H.mag, '#f59e0b', `A|H| = ${(A * H.mag).toFixed(2)}`)

  // Annotation arrow between them
  if (A > 0.01 && H.mag > 0.01) {
    const px1 = xAtF(f0)
    const px2 = xAtF(f0 + offset)
    const y = padY + 6
    ctx.strokeStyle = colors.fgMuted + 'aa'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(px1 + 4, y)
    ctx.lineTo(px2 - 4, y)
    ctx.stroke()
    ctx.fillStyle = colors.fgMuted
    ctx.font = '9px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(`× H(f₀)`, (px1 + px2) / 2, y - 3)
  }

  // Label f₀
  ctx.fillStyle = colors.accent
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText(`f₀ = ${f0.toFixed(2)}`, xAtF(f0), y0 + 14)
}
