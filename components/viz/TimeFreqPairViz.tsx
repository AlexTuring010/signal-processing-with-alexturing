'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Time ↔ frequency pair for the Section-4 protagonists (4b–4g), in the same
 * spirit as RectToSincViz: SEE the signal in the time domain (left) next to its
 * spectrum (right) — so you don't have to picture the triangle / gaussian /
 * sine in your head. A slider appears where there's a natural parameter (pulse
 * width T, or frequency f₀).
 *
 * Both panels handle continuous curves AND impulses, since some pairs flip
 * which domain is which (δ(t)↔1 is impulse↔continuous; 1↔δ(f) is the reverse;
 * cos/sin are continuous↔impulses).
 */

const FONT = '10px ui-sans-serif, system-ui, sans-serif'
const PAD_X = 28
const PAD_Y = 16
const IMPULSE_COLOR = '#7c3aed'

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

type Param = { label: string; min: number; max: number; step: number; def: number; unit: string }
type Domain =
  | { kind: 'continuous'; fn: (x: number, p: number) => number }
  | { kind: 'impulses'; at: (p: number) => { x: number; val: number; label: string; tick: string }[] }

type Spec = {
  title: string
  blurb: string
  note: string
  param: Param | null
  tWin: number
  fWin: number
  timeLabel: string
  freqLabel: string
  time: Domain
  freq: Domain
}

const EXAMPLES: Record<string, Spec> = {
  triangle: {
    title: 'Triangular pulse ↔ sinc²',
    blurb: 'Το τρίγωνο Λ(t/T) (βάση 2T, κορυφή 1) και το φάσμα του T·sinc²(fT).',
    note: 'Στενότερο τρίγωνο στον χρόνο → πλατύτερο φάσμα. Το sinc² δεν γίνεται ποτέ αρνητικό (είναι τετράγωνο).',
    param: { label: 'πλάτος T', min: 0.4, max: 2, step: 0.05, def: 1, unit: 's' },
    tWin: 3,
    fWin: 4,
    timeLabel: 'x(t) = Λ(t/T)',
    freqLabel: 'X(f) = T·sinc²(fT)',
    time: { kind: 'continuous', fn: (t, T) => Math.max(0, 1 - Math.abs(t) / T) },
    freq: { kind: 'continuous', fn: (f, T) => T * sinc(f * T) * sinc(f * T) },
  },
  gauss: {
    title: 'Gaussian ↔ Gaussian',
    blurb: 'Η καμπάνα e^(−π(t/T)²) και το φάσμα της T·e^(−π(fT)²) — ίδιο σχήμα.',
    note: 'Self-dual: το μόνο σχήμα που μένει ίδιο και στους δύο τομείς. Στενή καμπάνα → πλατιά, και αντίστροφα.',
    param: { label: 'πλάτος T', min: 0.5, max: 2, step: 0.05, def: 1, unit: 's' },
    tWin: 3,
    fWin: 3,
    timeLabel: 'x(t) = e^(−π(t/T)²)',
    freqLabel: 'X(f) = T·e^(−π(fT)²)',
    time: { kind: 'continuous', fn: (t, T) => Math.exp(-Math.PI * (t / T) * (t / T)) },
    freq: { kind: 'continuous', fn: (f, T) => T * Math.exp(-Math.PI * (f * T) * (f * T)) },
  },
  impulse: {
    title: 'δ(t) ↔ 1',
    blurb: 'Μια κρούση στον χρόνο και το επίπεδο φάσμα της — όλες οι συχνότητες.',
    note: 'Μια στιγμιαία κρούση περιέχει όλες τις συχνότητες με ίσο πλάτος → επίπεδο φάσμα ίσο με 1.',
    param: null,
    tWin: 3,
    fWin: 4,
    timeLabel: 'x(t) = δ(t)',
    freqLabel: 'X(f) = 1',
    time: { kind: 'impulses', at: () => [{ x: 0, val: 1, label: '(1)', tick: '0' }] },
    freq: { kind: 'continuous', fn: () => 1 },
  },
  constant: {
    title: '1 ↔ δ(f)',
    blurb: 'Σταθερό σήμα στον χρόνο και η μοναδική κρούση στο f = 0 (DC).',
    note: 'Σταθερό σήμα = μόνο DC → όλη η ενέργεια συμπυκνωμένη στη μηδενική συχνότητα. Καθρέφτης της δ(t)↔1.',
    param: null,
    tWin: 3,
    fWin: 4,
    timeLabel: 'x(t) = 1',
    freqLabel: 'X(f) = δ(f)',
    time: { kind: 'continuous', fn: () => 1 },
    freq: { kind: 'impulses', at: () => [{ x: 0, val: 1, label: '(1)', tick: '0' }] },
  },
  cosine: {
    title: 'cos(2πf₀t) ↔ δύο κρούσεις',
    blurb: 'Το cosine στον χρόνο και οι δύο πραγματικές κρούσεις του στις ±f₀.',
    note: 'Καθαρό cosine ζει σε μία συχνότητα → δύο πραγματικές κρούσεις πλάτους ½ στις ±f₀.',
    param: { label: 'συχνότητα f₀', min: 0.5, max: 2.5, step: 0.1, def: 1, unit: 'Hz' },
    tWin: 2,
    fWin: 3,
    timeLabel: 'x(t) = cos(2πf₀t)',
    freqLabel: 'X(f) = ½[δ(f−f₀)+δ(f+f₀)]',
    time: { kind: 'continuous', fn: (t, f0) => Math.cos(2 * Math.PI * f0 * t) },
    freq: {
      kind: 'impulses',
      at: (f0) => [
        { x: -f0, val: 0.5, label: '½', tick: '−f₀' },
        { x: f0, val: 0.5, label: '½', tick: '+f₀' },
      ],
    },
  },
  sine: {
    title: 'sin(2πf₀t) ↔ δύο φανταστικές κρούσεις',
    blurb: 'Το sine στον χρόνο και οι δύο φανταστικές κρούσεις του (το Im μέρος: ±½).',
    note: 'Ίδια συχνότητα με το cosine, αλλά καθαρά φανταστικό φάσμα (βάρη ∓j/2): η μία κρούση πάει πάνω και η άλλη κάτω. Πλήρης συζήτηση στη §3.5 και 4g.',
    param: { label: 'συχνότητα f₀', min: 0.5, max: 2.5, step: 0.1, def: 1, unit: 'Hz' },
    tWin: 2,
    fWin: 3,
    timeLabel: 'x(t) = sin(2πf₀t)',
    freqLabel: 'Im{X(f)} — φάσμα (1/2j)[δ(f−f₀)−δ(f+f₀)]',
    time: { kind: 'continuous', fn: (t, f0) => Math.sin(2 * Math.PI * f0 * t) },
    freq: {
      kind: 'impulses',
      at: (f0) => [
        { x: -f0, val: 0.5, label: '+½', tick: '−f₀' },
        { x: f0, val: -0.5, label: '−½', tick: '+f₀' },
      ],
    },
  },
}

export function TimeFreqPairViz({ example }: { example: keyof typeof EXAMPLES }) {
  const spec = EXAMPLES[example]
  const [p, setP] = useState(spec.param?.def ?? 0)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawDomain(timeRef.current, colors, spec.time, p, spec.tWin, 't')
    if (freqRef.current) drawDomain(freqRef.current, colors, spec.freq, p, spec.fWin, 'f')
  }, [spec, p])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">{spec.title} — time-frequency</h4>
      <p className="mb-3 text-xs text-fg-muted">{spec.blurb}</p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle={spec.timeLabel}>
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label={`${spec.title} — time domain`}
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle={spec.freqLabel}>
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label={`${spec.title} — frequency domain`}
          />
        </Panel>
      </div>

      {spec.param && (
        <div className="mt-3">
          <label className="block text-xs text-fg-muted">
            {spec.param.label} ={' '}
            <span className="font-mono text-fg tabular-nums">{p.toFixed(2)}</span> {spec.param.unit}
          </label>
          <input
            type="range"
            min={spec.param.min}
            max={spec.param.max}
            step={spec.param.step}
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label={spec.param.label}
          />
        </div>
      )}

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs text-fg-muted">
        {spec.note}
      </div>
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

/** y-mapping from a value range, with a margin. */
function vRange(vMax: number, vMin: number, h: number) {
  const top = Math.max(vMax, 0.1)
  const bot = Math.min(vMin, 0)
  const span = top - bot || 1
  const yTop = top + 0.22 * span
  const yBot = bot - 0.22 * span
  const yv = (v: number) => lerp(v, yTop, yBot, PAD_Y, h - PAD_Y)
  return { yv, yZero: yv(0) }
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTip: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTip)
  ctx.stroke()
  const dir = yTip < yBase ? 1 : -1 // wings flare from the tip back toward the base
  ctx.beginPath()
  ctx.moveTo(x, yTip)
  ctx.lineTo(x - 4, yTip + dir * 7)
  ctx.lineTo(x + 4, yTip + dir * 7)
  ctx.closePath()
  ctx.fill()
}

function drawDomain(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  domain: Domain,
  p: number,
  win: number,
  axisName: string,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = (x: number) => lerp(x, -win, win, PAD_X, w - PAD_X)

  if (domain.kind === 'continuous') {
    const fn = domain.fn
    let vMax = -Infinity
    let vMin = Infinity
    for (let i = 0; i <= 160; i++) {
      const x = lerp(i, 0, 160, -win, win)
      const v = fn(x, p)
      vMax = Math.max(vMax, v)
      vMin = Math.min(vMin, v)
    }
    const { yv, yZero } = vRange(vMax, vMin, h)
    drawAxis(ctx, colors, w, h, xt, yZero, axisName)

    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    const N = 420
    for (let i = 0; i <= N; i++) {
      const x = lerp(i, 0, N, -win, win)
      const px = xt(x)
      const py = yv(fn(x, p))
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    return
  }

  // impulses
  const imps = domain.at(p)
  const vals = imps.map((d) => d.val)
  const peak = Math.max(...vals.map(Math.abs), 0.5)
  const hasNeg = vals.some((v) => v < 0)
  const { yv, yZero } = vRange(peak, hasNeg ? -peak : 0, h)
  drawAxis(ctx, colors, w, h, xt, yZero, axisName)

  for (const d of imps) {
    const px = xt(d.x)
    drawStem(ctx, px, yZero, yv(d.val), IMPULSE_COLOR)
    ctx.fillStyle = colors.fg
    ctx.font = FONT
    ctx.textAlign = 'center'
    ctx.fillText(d.label, px, yv(d.val) + (d.val >= 0 ? -8 : 16))
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText(d.tick, px, yZero + (d.val >= 0 ? 14 : -8))
  }
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  h: number,
  xt: (x: number) => number,
  yZero: number,
  axisName: string,
) {
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X / 2, yZero)
  ctx.moveTo(xt(0), PAD_Y / 2)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.textAlign = 'right'
  ctx.fillText(axisName, w - PAD_X / 2 - 2, yZero - 4)
}
