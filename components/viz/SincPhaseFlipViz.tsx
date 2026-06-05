'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Slide 21's phase-flip story, on its own — focused on ONE question:
 * γιατί η φάση του sinc πηδάει κατά π σε κάθε μηδενισμό.
 *
 * The real spectrum X(f) = AT·sinc(fT) is real (rect is real-and-even) but dips
 * negative on alternating lobes. Splitting into |X| and ∠X, every negative lobe
 * shows up as phase = ±π. So θ(f) is a square wave that snaps 0 ↔ ±π at each
 * zero crossing of the sinc.
 *
 * Interaction: a single frequency cursor. Drag it across a zero and watch the
 * phase dot jump — the "snap" is the whole point. Sign convention matches the
 * page's piecewise definition and ScalingDualityViz:
 *     X(f) > 0           → θ = 0
 *     X(f) < 0, f > 0    → θ = −π
 *     X(f) < 0, f < 0    → θ = +π
 * which makes θ(f) odd (θ(−f) = −θ(f)), as conjugate symmetry requires.
 *
 * T is fixed here (the cursor is the variable) so the viz stays laser-focused on
 * the phase jump. Scaling across pulse widths lives in ScalingDualityViz.
 */

const T_FIXED = 1
const A_FIXED = 1
const F_MAX = 3.5
const EPS = 0.02 // |sinc| below this counts as "on a zero" → phase undefined

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

/** Real spectrum value at f (T, A fixed). Even ⇒ purely real. */
function specAt(f: number) {
  return A_FIXED * T_FIXED * sinc(f * T_FIXED)
}

/** Phase θ(f) ∈ {0, ±π} or null on a zero crossing. */
function phaseAt(f: number): number | null {
  const v = specAt(f)
  if (Math.abs(v) < EPS) return null
  if (v > 0) return 0
  return f > 0 ? -Math.PI : Math.PI
}

export function SincPhaseFlipViz() {
  const [cursorF, setCursorF] = useState(1.3) // starts in the first negative lobe
  const realRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (realRef.current) drawReal(realRef.current, colors, cursorF)
    if (phaseRef.current) drawPhase(phaseRef.current, colors, cursorF)
  }, [cursorF])

  const v = specAt(cursorF)
  const theta = phaseAt(cursorF)
  const onZero = theta === null
  const negative = !onZero && v < 0
  const thetaLabel = onZero ? '—' : theta === 0 ? '0' : cursorF > 0 ? '−π' : '+π'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η φάση του sinc — άλμα κατά π σε κάθε μηδενισμό
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <strong>πραγματικό</strong> φάσμα <span className="font-mono">X(f) = AT·sinc(fT)</span>{' '}
        πέφτει αρνητικό στους εναλλασσόμενους λοβούς. Σύρε τον δρομέα συχνότητας και δες τη{' '}
        <strong>φάση</strong> από κάτω να «κουμπώνει» από{' '}
        <span className="font-mono">0</span> σε <span className="font-mono">±π</span> ακριβώς τη
        στιγμή που το sinc περνά μηδέν — εκεί που ο λοβός γίνεται αρνητικός.
      </p>

      <Panel title="Πραγματικό φάσμα" subtitle="X(f) = AT·sinc(fT) — δες το πρόσημο του λοβού">
        <canvas
          ref={realRef}
          style={{ height: 170 }}
          className="block h-[170px] w-full"
          aria-label="Real sinc spectrum with signed lobes"
        />
      </Panel>

      <div className="mt-2">
        <Panel title="Φάση" subtitle="θ(f) = arg X(f) ∈ {0, ±π}">
          <canvas
            ref={phaseRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="Phase spectrum snapping between 0 and plus or minus pi"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Δρομέας συχνότητας f ={' '}
          <span className="font-mono text-fg tabular-nums">{cursorF.toFixed(2)}</span>
          {' Hz '}
          <span className="text-fg-subtle">(= {cursorF.toFixed(2)}/T)</span>
        </label>
        <input
          type="range"
          min={-F_MAX}
          max={F_MAX}
          step={0.01}
          value={cursorF}
          onChange={(e) => setCursorF(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Frequency cursor"
        />
      </div>

      <div
        className={`mt-3 rounded-md border px-3 py-2 text-xs ${
          onZero
            ? 'border-warn/40 bg-warn/10'
            : negative
              ? 'border-danger/40 bg-danger/10'
              : 'border-success/40 bg-success/10'
        }`}
      >
        {onZero ? (
          <>
            <strong>Πάνω σε μηδενισμό.</strong> Εδώ <span className="font-mono">X(f) = 0</span> — η
            φάση <strong>δεν ορίζεται</strong>: ένα διάνυσμα μήκους μηδέν δεν δείχνει πουθενά. Ακριβώς
            εδώ γίνεται το άλμα.
          </>
        ) : negative ? (
          <>
            <strong>Αρνητικός λοβός.</strong> <span className="font-mono">X(f) ≈ {v.toFixed(2)} &lt; 0</span>{' '}
            → η φάση είναι <span className="font-mono">θ = {thetaLabel}</span>. Ένας αρνητικός
            πραγματικός αριθμός είναι «αναποδογυρισμένος» κατά π:{' '}
            <span className="font-mono">−1 = e^(±jπ)</span>.
          </>
        ) : (
          <>
            <strong>Θετικός λοβός.</strong> <span className="font-mono">X(f) ≈ {v.toFixed(2)} &gt; 0</span>{' '}
            → η φάση είναι <span className="font-mono">θ = 0</span> (καθαρά πραγματικός θετικός, καμία
            στροφή).
          </>
        )}
      </div>

      <figcaption className="mt-3 text-xs text-fg-muted">
        Η φάση είναι <strong>περιττή</strong>: <span className="font-mono">θ(−f) = −θ(f)</span>, γι'
        αυτό ο ίδιος αρνητικός λοβός δίνει <span className="font-mono">−π</span> στη θετική πλευρά και{' '}
        <span className="font-mono">+π</span> στην αρνητική (conjugate symmetry — Section 8). Γι' αυτό
        η συμβατική σύμβαση είναι να σχεδιάζουμε το <strong>X(f) με πρόσημο</strong> αντί για ξεχωριστό
        φάσμα μέτρου + φάσης.
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 34
const PAD_Y = 16
const STEPS = 520
const ZEROS = [-3, -2, -1, 1, 2, 3] // f = ±k/T (T = 1)

function drawReal(canvas: HTMLCanvasElement, colors: ThemeColors, cursorF: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const X0 = A_FIXED * T_FIXED
  const yMax = X0 * 1.25
  const yMin = -X0 * 0.5

  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (val: number) => lerp(val, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // sign-shaded fill under the curve, strip by strip
  for (let i = 0; i < STEPS; i++) {
    const f0 = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const f1 = lerp(i + 1, 0, STEPS, -F_MAX, F_MAX)
    const v0 = specAt(f0)
    const v1 = specAt(f1)
    const positive = v0 + v1 > 0
    ctx.fillStyle = positive ? colors.success : colors.danger
    ctx.globalAlpha = 0.15
    ctx.beginPath()
    ctx.moveTo(xt(f0), yZero)
    ctx.lineTo(xt(f0), yv(v0))
    ctx.lineTo(xt(f1) + 0.6, yv(v1))
    ctx.lineTo(xt(f1) + 0.6, yZero)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // zero guide lines (shared with the phase panel below)
  drawZeroGuides(ctx, colors, xt, PAD_Y, h - PAD_Y)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // the sinc curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const px = xt(f)
    const py = yv(specAt(f))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // cursor + dot
  const v = specAt(cursorF)
  drawCursorLine(ctx, colors, xt(cursorF), PAD_Y, h - PAD_Y)
  ctx.fillStyle = Math.abs(v) < EPS ? colors.warn : v < 0 ? colors.danger : colors.success
  ctx.beginPath()
  ctx.arc(xt(cursorF), yv(v), 4, 0, Math.PI * 2)
  ctx.fill()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 3)
  for (const z of [-1, 1]) ctx.fillText(`${z > 0 ? '+' : '−'}1/T`, xt(z), h - 3)
  ctx.textAlign = 'right'
  ctx.fillText('AT', PAD_X - 4, yv(X0) + 3)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'left'
  ctx.fillText('X(f)', xt(0) + 4, PAD_Y + 4)
}

function drawPhase(canvas: HTMLCanvasElement, colors: ThemeColors, cursorF: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yMid = h / 2
  const piH = (h / 2 - PAD_Y) * 0.85
  const yTheta = (t: number) => yMid - (t / Math.PI) * piH

  // ±π gridlines
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  for (const t of [Math.PI, -Math.PI]) {
    ctx.beginPath()
    ctx.moveTo(PAD_X, yTheta(t))
    ctx.lineTo(w - PAD_X, yTheta(t))
    ctx.stroke()
  }
  ctx.setLineDash([])

  // zero guides aligned with the panel above
  drawZeroGuides(ctx, colors, xt, PAD_Y, h - PAD_Y)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yMid)
  ctx.lineTo(w - PAD_X, yMid)
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // θ(f) is a square wave 0 ↔ ±π. Connect consecutive valid samples — including
  // across each zero — so every jump renders as a vertical side on both halves
  // of the axis (the −π for f>0 / +π for f<0 convention keeps θ(f) odd).
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.4
  let prevPx = -1
  let prevPy = -1
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const t = phaseAt(f)
    if (t === null) continue // undefined right at the zero — keep prev so the jump connects across
    const px = xt(f)
    const py = yTheta(t)
    if (prevPx >= 0) {
      ctx.beginPath()
      ctx.moveTo(prevPx, prevPy)
      ctx.lineTo(px, py)
      ctx.stroke()
    }
    prevPx = px
    prevPy = py
  }

  // cursor + dot
  const t = phaseAt(cursorF)
  drawCursorLine(ctx, colors, xt(cursorF), PAD_Y, h - PAD_Y)
  ctx.fillStyle = t === null ? colors.warn : t === 0 ? colors.success : colors.danger
  ctx.beginPath()
  ctx.arc(xt(cursorF), yTheta(t ?? 0), 4, 0, Math.PI * 2)
  ctx.fill()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+π', PAD_X - 4, yTheta(Math.PI) + 3)
  ctx.fillText('0', PAD_X - 4, yMid + 3)
  ctx.fillText('−π', PAD_X - 4, yTheta(-Math.PI) + 3)
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('Άλμα ±π στους μηδενισμούς (slide 21)', w / 2, h - 3)
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('θ(f)', xt(0) + 4, PAD_Y + 4)
}

function drawZeroGuides(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  xt: (f: number) => number,
  yTop: number,
  yBot: number,
) {
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.35
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  for (const z of ZEROS) {
    if (z < -F_MAX || z > F_MAX) continue
    ctx.beginPath()
    ctx.moveTo(xt(z), yTop)
    ctx.lineTo(xt(z), yBot)
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}

function drawCursorLine(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  px: number,
  yTop: number,
  yBot: number,
) {
  ctx.strokeStyle = colors.fg
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(px, yTop)
  ctx.lineTo(px, yBot)
  ctx.stroke()
  ctx.globalAlpha = 1
}
