'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * "Δύο τρόποι να γράψεις το ίδιο X(f)" — one figure per Section-4 protagonist.
 *
 * Τρόπος Α (left): the spectrum drawn on a SINGLE real plot, with sign — i.e.
 *   Re{X(f)} for real spectra (rect, triangle, gauss, δ, cos) or Im{X(f)} for
 *   the purely-imaginary one (sin). Negatives dip below the axis; imaginary
 *   parts go up/down. This only works because every protagonist here is purely
 *   real OR purely imaginary.
 * Τρόπος Β (right): the GENERAL encoding — magnitude |X(f)| (always ≥ 0) on top
 *   and phase ∠X(f) below. This is what you fall back to the moment X(f) is
 *   genuinely complex.
 *
 * The whole point of putting them side by side: for real & non-negative spectra
 * the two encodings are visually identical and the phase is a flat 0; the
 * instant the spectrum goes negative (rect) the phase becomes a 0/±π square
 * wave; and the instant it goes imaginary (sin) Τρόπος Α and |X| visibly
 * diverge and the phase is ±π/2. Seeing that progression is the lesson.
 *
 * Phase sign convention matches the page (slide 18) and the other vizzes:
 *   real > 0            → 0
 *   real < 0, f > 0/<0  → −π / +π        (keeps θ(f) odd)
 *   imag > 0/<0         → +π/2 / −π/2
 */

type Cx = { re: number; im: number }
const mag = (z: Cx) => Math.hypot(z.re, z.im)

/** Phase with the page's odd convention; null where the value is ~0 (undefined). */
function phaseConv(z: Cx, f: number): number | null {
  const realish = Math.abs(z.im) < 1e-9
  const imagish = Math.abs(z.re) < 1e-9
  if (realish && imagish) return null
  if (realish) {
    if (z.re > 0) return 0
    return f > 0 ? -Math.PI : Math.PI
  }
  if (imagish) return z.im > 0 ? Math.PI / 2 : -Math.PI / 2
  return Math.atan2(z.im, z.re)
}

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

type Param = { label: string; min: number; max: number; step: number; def: number; unit: string }

type Spec = {
  title: string
  blurb: string
  /** which component the single-plot Τρόπος Α shows */
  part: 'real' | 'imag'
  /** does the signed plot need room below the axis? */
  hasNegative: boolean
  fMax: number
  param: Param | null
  takeaway: string
  /** annotation drawn on the flat phase panel, e.g. "θ(f) = 0 για κάθε f" */
  phaseNote?: string
} & (
  | { kind: 'continuous'; X: (f: number, p: number) => Cx }
  | { kind: 'impulses'; impulses: (p: number) => { f: number; w: Cx }[] }
)

const EXAMPLES: Record<string, Spec> = {
  rect: {
    kind: 'continuous',
    title: 'rect → sinc',
    blurb: 'X(f) = AT·sinc(fT) είναι πραγματικό αλλά αλλάζει πρόσημο στους λοβούς.',
    part: 'real',
    hasNegative: true,
    fMax: 4.5,
    param: { label: 'πλάτος παλμού T', min: 0.4, max: 2.5, step: 0.05, def: 1, unit: 's' },
    X: (f, T) => ({ re: T * sinc(f * T), im: 0 }),
    takeaway:
      'Πραγματικό αλλά με αρνητικούς λοβούς: το |X(f)| διπλώνει τους λοβούς προς τα πάνω, και η φάση κρατάει την πληροφορία του προσήμου ως άλμα 0 ↔ ±π.',
  },
  triangle: {
    kind: 'continuous',
    title: 'triangle → sinc²',
    blurb: 'X(f) = T·sinc²(fT) — πραγματικό και ποτέ αρνητικό (το τετράγωνο).',
    part: 'real',
    hasNegative: false,
    fMax: 4.5,
    param: { label: 'πλάτος παλμού T', min: 0.4, max: 2.5, step: 0.05, def: 1, unit: 's' },
    X: (f, T) => ({ re: T * sinc(f * T) * sinc(f * T), im: 0 }),
    takeaway:
      'Επειδή το sinc² δεν γίνεται ποτέ αρνητικό, ο Τρόπος Α και το |X(f)| είναι ίδια εικόνα και η φάση είναι επίπεδη στο 0. Η απλούστερη περίπτωση.',
    phaseNote: 'θ(f) = 0 για κάθε f',
  },
  gauss: {
    kind: 'continuous',
    title: 'gauss → gauss',
    blurb: 'x(t) = e^(−π(t/T)²) ↔ X(f) = T·e^(−π(fT)²) — η ίδια καμπάνα στους δύο τομείς.',
    part: 'real',
    hasNegative: false,
    fMax: 3,
    param: { label: 'πλάτος T', min: 0.5, max: 2.5, step: 0.05, def: 1, unit: 's' },
    X: (f, T) => ({ re: T * Math.exp(-Math.PI * (f * T) * (f * T)), im: 0 }),
    takeaway:
      'Πραγματική, θετική, ομαλή — όπως το τρίγωνο, Τρόπος Α = |X(f)| και φάση 0. Μοναδική στο ότι έχει ακριβώς το ίδιο σχήμα στον χρόνο και στη συχνότητα (self-dual).',
    phaseNote: 'θ(f) = 0 για κάθε f',
  },
  impulse: {
    kind: 'continuous',
    title: 'δ(t) → 1',
    blurb: 'X(f) = 1 για κάθε f — σταθερό, πραγματικό, θετικό φάσμα.',
    part: 'real',
    hasNegative: false,
    fMax: 4,
    param: null,
    X: () => ({ re: 1, im: 0 }),
    takeaway:
      'Σταθερό πραγματικό θετικό: |X(f)| = 1 παντού και φάση 0 παντού. Όλες οι συχνότητες παρούσες, όλες «σε φάση».',
    phaseNote: 'θ(f) = 0 για κάθε f',
  },
  constant: {
    kind: 'impulses',
    title: '1 → δ(f)',
    blurb: 'Όλη η ενέργεια σε μία κρούση στο f = 0 (DC), με πραγματικό θετικό βάρος.',
    part: 'real',
    hasNegative: false,
    fMax: 4,
    param: null,
    impulses: () => [{ f: 0, w: { re: 1, im: 0 } }],
    takeaway:
      'Μία πραγματική θετική κρούση: |X(f)| η ίδια κρούση, φάση 0 εκεί που υπάρχει. Καθρέφτης της δ(t) → 1.',
    phaseNote: 'θ = 0 (όπου ορίζεται)',
  },
  cosine: {
    kind: 'impulses',
    title: 'cos(2πf₀t) → δύο πραγματικές κρούσεις',
    blurb: 'X(f) = ½δ(f−f₀) + ½δ(f+f₀) — δύο πραγματικές θετικές κρούσεις στις ±f₀.',
    part: 'real',
    hasNegative: false,
    fMax: 4,
    param: { label: 'συχνότητα f₀', min: 0.6, max: 3, step: 0.1, def: 1.6, unit: 'Hz' },
    impulses: (f0) => [
      { f: -f0, w: { re: 0.5, im: 0 } },
      { f: f0, w: { re: 0.5, im: 0 } },
    ],
    takeaway:
      'Πραγματικές θετικές κρούσεις: Τρόπος Α και |X(f)| ταυτίζονται, φάση 0. Κράτησέ το δίπλα στο sin παρακάτω — εκεί αλλάζουν όλα.',
    phaseNote: 'θ = 0 στις ±f₀',
  },
  sine: {
    kind: 'impulses',
    title: 'sin(2πf₀t) → δύο φανταστικές κρούσεις',
    blurb: 'X(f) = −(j/2)δ(f−f₀) + (j/2)δ(f+f₀) — καθαρά φανταστικά βάρη.',
    part: 'imag',
    hasNegative: true,
    fMax: 4,
    param: { label: 'συχνότητα f₀', min: 0.6, max: 3, step: 0.1, def: 1.6, unit: 'Hz' },
    impulses: (f0) => [
      { f: -f0, w: { re: 0, im: 0.5 } },
      { f: f0, w: { re: 0, im: -0.5 } },
    ],
    takeaway:
      'Καθαρά φανταστικό: ο Τρόπος Α δείχνει το Im{X} (μία πάνω, μία κάτω) — δεν είναι το ίδιο με το |X(f)|, που έχει δύο ίσες θετικές κρούσεις. Η φάση πια ΔΕΝ είναι 0 αλλά ±π/2. Να γιατί χρειάζεσαι μέτρο + φάση.',
    phaseNote: 'θ = ∓π/2 στις ±f₀',
  },
}

export function SpectrumDualViewViz({ example }: { example: keyof typeof EXAMPLES }) {
  const spec = EXAMPLES[example]
  const [p, setP] = useState(spec.param?.def ?? 0)

  const signedRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (signedRef.current) drawSigned(signedRef.current, colors, spec, p)
    if (magRef.current) drawMag(magRef.current, colors, spec, p)
    if (phaseRef.current) drawPhase(phaseRef.current, colors, spec, p)
  }, [spec, p])

  const signedLabel = spec.part === 'real' ? 'Re{X(f)}' : 'Im{X(f)}'
  const signedSub =
    spec.part === 'real'
      ? '= X(f), αφού το φάσμα είναι πραγματικό'
      : 'X(f) = j·Im{X(f)}, καθαρά φανταστικό'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δύο τρόποι να γράψεις το ίδιο X(f): {spec.title}
      </h4>
      <p className="mb-3 text-xs text-fg-muted">{spec.blurb}</p>

      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        {/* Τρόπος Α */}
        <div className="rounded-md border border-accent/40 bg-bg p-2">
          <div className="mb-1 px-1">
            <div className="text-[11px] font-semibold tracking-tight text-accent">
              Τρόπος Α — μία γραφή με πρόσημο
            </div>
            <div className="font-mono text-[10px] text-fg-subtle">
              {signedLabel} <span className="text-fg-subtle">({signedSub})</span>
            </div>
          </div>
          <canvas
            ref={signedRef}
            style={{ height: 220 }}
            className="block h-[220px] w-full"
            aria-label={`Signed spectrum for ${spec.title}`}
          />
        </div>

        {/* Τρόπος Β */}
        <div className="rounded-md border border-border bg-bg p-2">
          <div className="mb-1 px-1 text-[11px] font-semibold tracking-tight">
            Τρόπος Β — μέτρο + φάση (η γενική γραφή)
          </div>
          <div className="mb-1 px-1 font-mono text-[10px] text-fg-subtle">|X(f)|</div>
          <canvas
            ref={magRef}
            style={{ height: 104 }}
            className="block h-[104px] w-full"
            aria-label={`Magnitude spectrum for ${spec.title}`}
          />
          <div className="mb-1 mt-1 px-1 font-mono text-[10px] text-fg-subtle">∠X(f)</div>
          <canvas
            ref={phaseRef}
            style={{ height: 104 }}
            className="block h-[104px] w-full"
            aria-label={`Phase spectrum for ${spec.title}`}
          />
        </div>
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

      <figcaption className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg-muted">
        <strong>Το νόημα:</strong> {spec.takeaway} Οι δύο γραφές κωδικοποιούν{' '}
        <strong>ακριβώς την ίδια πληροφορία</strong> — απλώς ο Τρόπος Α «κρύβει» τη φάση μέσα στο
        πρόσημο (κάτι που δουλεύει μόνο για καθαρά πραγματικά ή καθαρά φανταστικά φάσματα).
      </figcaption>
    </figure>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Drawing
// ─────────────────────────────────────────────────────────────────────────────

const PAD_X = 32
const PAD_Y = 14
const STEPS = 480

function freqMap(spec: Spec, w: number) {
  return (f: number) => lerp(f, -spec.fMax, spec.fMax, PAD_X, w - PAD_X)
}

/** Peak |value| of a continuous spectrum, for axis scaling. */
function continuousPeak(spec: Extract<Spec, { kind: 'continuous' }>, p: number) {
  let m = 0
  for (let i = 0; i <= 60; i++) {
    const f = lerp(i, 0, 60, -spec.fMax, spec.fMax)
    m = Math.max(m, mag(spec.X(f, p)))
  }
  return Math.max(m, 0.2)
}

function drawFreqAxis(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  h: number,
  yZero: number,
  xt: (f: number) => number,
  axisLabel: string,
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
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2 - 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText(axisLabel, xt(0) + 4, PAD_Y / 2 + 8)
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
  // arrowhead — wings flare from the apex (tip) back toward the base
  const dir = yTip < yBase ? 1 : -1
  ctx.beginPath()
  ctx.moveTo(x, yTip)
  ctx.lineTo(x - 4, yTip + dir * 7)
  ctx.lineTo(x + 4, yTip + dir * 7)
  ctx.closePath()
  ctx.fill()
}

function drawSigned(canvas: HTMLCanvasElement, colors: ThemeColors, spec: Spec, p: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = freqMap(spec, w)
  const part = spec.part

  if (spec.kind === 'continuous') {
    const peak = continuousPeak(spec, p)
    const yMax = peak * 1.2
    const yMin = spec.hasNegative ? -peak * 0.55 : -peak * 0.12
    const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
    const yZero = yv(0)
    drawFreqAxis(ctx, colors, w, h, yZero, xt, part === 'real' ? 'Re' : 'Im')

    // sign-shaded fill
    for (let i = 0; i < STEPS; i++) {
      const f0 = lerp(i, 0, STEPS, -spec.fMax, spec.fMax)
      const f1 = lerp(i + 1, 0, STEPS, -spec.fMax, spec.fMax)
      const v0 = part === 'real' ? spec.X(f0, p).re : spec.X(f0, p).im
      const v1 = part === 'real' ? spec.X(f1, p).re : spec.X(f1, p).im
      ctx.fillStyle = v0 + v1 >= 0 ? colors.success : colors.danger
      ctx.globalAlpha = 0.14
      ctx.beginPath()
      ctx.moveTo(xt(f0), yZero)
      ctx.lineTo(xt(f0), yv(v0))
      ctx.lineTo(xt(f1) + 0.6, yv(v1))
      ctx.lineTo(xt(f1) + 0.6, yZero)
      ctx.closePath()
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // curve
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, -spec.fMax, spec.fMax)
      const v = part === 'real' ? spec.X(f, p).re : spec.X(f, p).im
      const px = xt(f)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    return
  }

  // impulses
  const imps = spec.impulses(p)
  const maxW = Math.max(...imps.map((d) => Math.abs(part === 'real' ? d.w.re : d.w.im)), 0.5)
  const yMax = 1.0
  const yMin = spec.hasNegative ? -1.0 : -0.18
  const stemFull = 0.8 // fraction of half-height a full-weight stem reaches
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  drawFreqAxis(ctx, colors, w, h, yZero, xt, part === 'real' ? 'Re' : 'Im')

  for (const d of imps) {
    const v = part === 'real' ? d.w.re : d.w.im
    const frac = (v / maxW) * stemFull
    const tipV = (spec.hasNegative ? 1.0 : yMax) * frac
    drawStem(ctx, xt(d.f), yZero, yv(tipV), colors.accent)
    // weight label
    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const lbl = part === 'real' ? `${v > 0 ? '+' : ''}${v}` : `${v > 0 ? '+' : ''}${v}j`
    ctx.fillText(lbl, xt(d.f), yv(tipV) + (tipV >= 0 ? -10 : 16))
    // freq tick
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText(d.f === 0 ? '0' : d.f > 0 ? '+f₀' : '−f₀', xt(d.f), yZero + (d.f === 0 ? 14 : 14))
  }
}

function drawMag(canvas: HTMLCanvasElement, colors: ThemeColors, spec: Spec, p: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = freqMap(spec, w)

  if (spec.kind === 'continuous') {
    const peak = continuousPeak(spec, p)
    const yMax = peak * 1.2
    const yv = (v: number) => lerp(v, yMax, -peak * 0.08, PAD_Y, h - PAD_Y)
    const yZero = yv(0)
    drawFreqAxis(ctx, colors, w, h, yZero, xt, '|·|')
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, -spec.fMax, spec.fMax)
      const v = mag(spec.X(f, p))
      const px = xt(f)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    return
  }

  const imps = spec.impulses(p)
  const maxW = Math.max(...imps.map((d) => mag(d.w)), 0.5)
  const yv = (v: number) => lerp(v, 1.0, -0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  drawFreqAxis(ctx, colors, w, h, yZero, xt, '|·|')
  for (const d of imps) {
    const v = mag(d.w)
    const tipV = (v / maxW) * 0.8
    drawStem(ctx, xt(d.f), yZero, yv(tipV), colors.accent)
    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${v}`, xt(d.f), yv(tipV) - 5)
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText(d.f === 0 ? '0' : d.f > 0 ? '+f₀' : '−f₀', xt(d.f), yZero + 13)
  }
}

function drawPhase(canvas: HTMLCanvasElement, colors: ThemeColors, spec: Spec, p: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = freqMap(spec, w)
  const yMid = h / 2
  const piH = (h / 2 - PAD_Y) * 0.8
  const yth = (t: number) => yMid - (t / Math.PI) * piH

  // ±π and ±π/2 guide lines
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  for (const t of [Math.PI, Math.PI / 2, -Math.PI / 2, -Math.PI]) {
    ctx.beginPath()
    ctx.moveTo(PAD_X, yth(t))
    ctx.lineTo(w - PAD_X, yth(t))
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+π', PAD_X - 3, yth(Math.PI) + 3)
  ctx.fillText('+π/2', PAD_X - 3, yth(Math.PI / 2) + 3)
  ctx.fillText('−π/2', PAD_X - 3, yth(-Math.PI / 2) + 3)
  ctx.fillText('−π', PAD_X - 3, yth(-Math.PI) + 3)

  drawFreqAxis(ctx, colors, w, h, yMid, xt, 'θ')

  if (spec.kind === 'continuous') {
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2.4
    let prevPx = -1
    let prevPy = -1
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, -spec.fMax, spec.fMax)
      const t = phaseConv(spec.X(f, p), f)
      if (t === null) continue
      const px = xt(f)
      const py = yth(t)
      if (prevPx >= 0) {
        ctx.beginPath()
        ctx.moveTo(prevPx, prevPy)
        ctx.lineTo(px, py)
        ctx.stroke()
      }
      prevPx = px
      prevPy = py
    }
  } else {
    const imps = spec.impulses(p)
    for (const d of imps) {
      const t = phaseConv(d.w, d.f)
      if (t === null) continue
      const px = xt(d.f)
      const py = yth(t)
      // faint stem from axis to the phase marker
      ctx.strokeStyle = colors.accent
      ctx.globalAlpha = 0.4
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px, yMid)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (spec.phaseNote) {
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(spec.phaseNote, w / 2, h - 3)
  }
}
