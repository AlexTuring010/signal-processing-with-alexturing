'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * sgn(t) ↔ 1/(jπf) — and a smoothed family that limits to the pair.
 *
 * Use the family g_τ(t) = (2/π) arctan(t/τ):
 *   - g_τ → sgn(t) as τ → 0 (sharper transition).
 *   - g_τ is the integral of a Lorentzian τ/(t²+τ²) → Lorentzian Fourier
 *     pair π e^{−2π|f|τ}.
 *   - From the differentiation property (j2πf · G_τ(f) = FT{g_τ'}):
 *       G_τ(f) = e^{−2π|f|τ} / (jπf)
 *
 * So |G_τ(f)| = e^{−2π|f|τ} / (π|f|).  At τ → 0 this becomes 1/(π|f|) (the
 * sgn pair). At larger τ the spectrum decays MUCH faster — drives home the
 * "sharp discontinuity ⇒ slow 1/f decay" rule.
 *
 * The reference dashed curve 1/(π|f|) stays fixed so the student can see the
 * smoothed spectrum pull *under* it as τ grows.
 */

const TAU_MIN = 0.02
const TAU_MAX = 1.5

export function SgnToInversePiFViz() {
  const [tau, setTau] = useState(0.08)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, tau)
    if (freqRef.current) drawSpectrum(freqRef.current, colors, tau)
  }, [tau])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        sgn(t) ↔ 1/(jπf) — απότομη ασυνέχεια ⇒ αργή 1/f απόσβεση
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <span className="font-mono">τ</span>: μικρό{' '}
        <span className="font-mono">τ</span> = πιο απότομη μετάβαση από{' '}
        <span className="font-mono">−1</span> σε{' '}
        <span className="font-mono">+1</span> (πλησιάζει το{' '}
        <span className="font-mono">sgn(t)</span>). Στη συχνότητα παρακολούθησε
        την «ουρά» του φάσματος. Όσο πιο απότομη η μετάβαση, τόσο πιο{' '}
        <strong>αργά</strong> πέφτει η ουρά — γι' αυτό το{' '}
        <span className="font-mono">sgn</span> έχει{' '}
        <strong>1/|f|</strong> απόσβεση.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="g_τ(t) = (2/π)·arctan(t/τ)">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Smoothed sgn function"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="|G_τ(f)| = e^{−2π|f|τ}/(π|f|)">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Magnitude spectrum of smoothed sgn"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Πλάτος μετάβασης τ ={' '}
          <span className="font-mono text-fg tabular-nums">{tau.toFixed(3)}</span>
          {' s · '}
          <span className="text-fg-subtle">
            τ → 0 ⇒ sgn(t) ↔ 1/(jπf) (κόκκινη διακεκομμένη)
          </span>
        </label>
        <input
          type="range"
          min={TAU_MIN}
          max={TAU_MAX}
          step={0.005}
          value={tau}
          onChange={(e) => setTau(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Smoothing width tau"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί 1/|f|;</strong> Η αναλογία{' '}
        «<em>όσο πιο απότομη η μετάβαση, τόσο πιο πλατύ το φάσμα</em>» δείχνει
        ότι μια <em>ιδανική</em> ασυνέχεια (jump) γεμίζει με ενέργεια όλες τις
        συχνότητες. Το <span className="font-mono">sgn</span> ειδικά κάθεται
        ακριβώς στο σύνορο ολοκληρωσιμότητας: το φάσμα του αποσβένει πολύ αργά —
        σαν <span className="font-mono">1/|f|</span>. Αυτό δείχνει επίσης γιατί
        το <span className="font-mono">sgn</span> είναι σχεδόν παντού στις
        αναλύσεις: το <em>dual</em> ζευγάρι{' '}
        <span className="font-mono">1/(πt) ↔ −j sgn(f)</span> είναι ο πυρήνας
        του Hilbert transform.
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

const PAD_X = 36
const PAD_Y = 18

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tau: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 3
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline + y axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // reference sgn(t) (dashed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(tMin), yv(-1))
  ctx.lineTo(xt(-0.01), yv(-1))
  ctx.moveTo(xt(0.01), yv(1))
  ctx.lineTo(xt(tMax), yv(1))
  ctx.stroke()
  ctx.setLineDash([])

  // smoothed g_τ(t)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = (2 / Math.PI) * Math.atan(t / tau)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${tMax}`, xt(tMin), h - 2)
  ctx.fillText(`+${tMax}`, xt(tMax), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText('+1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
  ctx.fillText('−1', PAD_X - 3, yv(-1) + 3)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('g_τ(t)', xt(0) + 4, PAD_Y + 4)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tau: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 4
  const fMin = -fMax
  const yMax = 1.4
  const yMin = -0.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline + y axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // reference |1/(πf)| (the τ=0 limit) — dashed
  const ref = (f: number) => 1 / (Math.PI * Math.abs(f))
  const yCeil = yMax * 0.95
  ctx.strokeStyle = colors.danger
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  const REF_STEPS = 400
  let startedNeg = false
  let startedPos = false
  for (let i = 0; i <= REF_STEPS; i++) {
    const f = lerp(i, 0, REF_STEPS, fMin, -0.05)
    const v = Math.min(yCeil, ref(f))
    const px = xt(f)
    const py = yv(v)
    if (!startedNeg) {
      ctx.moveTo(px, py)
      startedNeg = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
  ctx.beginPath()
  for (let i = 0; i <= REF_STEPS; i++) {
    const f = lerp(i, 0, REF_STEPS, 0.05, fMax)
    const v = Math.min(yCeil, ref(f))
    const px = xt(f)
    const py = yv(v)
    if (!startedPos) {
      ctx.moveTo(px, py)
      startedPos = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
  ctx.setLineDash([])

  // |G_τ(f)|
  const env = (f: number) =>
    Math.min(yCeil, Math.exp(-2 * Math.PI * Math.abs(f) * tau) / (Math.PI * Math.abs(f)))

  // shade under
  ctx.fillStyle = `rgba(${getAccentRGB(colors)}, 0.12)`
  const fillSteps = 500
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= fillSteps; i++) {
    const f = lerp(i, 0, fillSteps, fMin, -0.05)
    const v = env(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(-0.05), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(xt(0.05), yZero)
  for (let i = 0; i <= fillSteps; i++) {
    const f = lerp(i, 0, fillSteps, 0.05, fMax)
    const v = env(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()

  // outline
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  const STEPS = 600
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, -0.05)
    const v = env(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, 0.05, fMax)
    const v = env(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${fMax}`, xt(fMin), h - 2)
  ctx.fillText(`+${fMax}`, xt(fMax), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // legend
  ctx.fillStyle = colors.danger
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('1/(π|f|)', w - PAD_X - 4, PAD_Y + 8)
  ctx.fillStyle = colors.accent
  ctx.fillText('|G_τ(f)|', w - PAD_X - 4, PAD_Y + 21)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)|', xt(0) + 4, PAD_Y + 4)
}

function getAccentRGB(colors: ReturnType<typeof getThemeColors>): string {
  if (!colors) return '29, 78, 216'
  const m = colors.accent.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
