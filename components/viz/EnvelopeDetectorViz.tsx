'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Envelope detector — diode + RC lowpass response to AM input.
 *
 * AM input → diode (half-wave rectify) → RC follows the peaks. The RC time
 * constant sits in a sweet spot:
 *
 *     1/f_c  ≪  RC  ≪  1/W
 *
 * Three regimes (sweep the slider to feel them):
 *   - RC ≈ 1/f_c  (too small) — capacitor discharges between carrier cycles
 *     → output ripples at f_c, no clean envelope.
 *   - RC ≈ 1/W    (too big)  — capacitor can't follow fast envelope dips
 *     → diagonal clipping; output "skates" past the message valleys.
 *   - RC ≈ √((1/f_c)·(1/W))  (sweet) — averages out carrier, follows envelope.
 *
 * Enrichments over earlier version:
 *   1. Explicit 1/f_c and 1/W tick markers on the time-axis baseline so the
 *      student can SEE the constraint physically (one carrier period vs one
 *      message period).
 *   2. Log-axis "RC scale" strip beneath the main canvas, with red zones for
 *      RC < 1/f_c and RC > 1/W and a green sweet-spot band in between. Live
 *      marker shows the current RC.
 *   3. Quantitative readouts: f_c·RC (should be ≫ 1) and W·RC (should be ≪ 1).
 */

const FC = 8 // carrier "frequency" in normalized units (cycles per t-unit)
const FM = 0.5 // message frequency (W ≈ FM for the visual)
const MU = 0.7
const T_C = 1 / FC // carrier period
const T_W = 1 / FM // 1/W

const RC_MIN = 0.01
const RC_MAX = 3.16 // 10^0.5
const RC_MIN_LOG = Math.log10(RC_MIN) // −2
const RC_MAX_LOG = Math.log10(RC_MAX) // +0.5

const SIG_C = 'rgb(29, 78, 216)'
const RECT_C = 'rgba(100, 116, 139, 0.45)'
const OUT_C = 'rgb(217, 119, 6)'
const ENV_C = 'rgb(168, 85, 247)'
const MARKER_C = 'rgb(220, 38, 38)' // red — boundary markers (1/f_c, 1/W)
const SWEET_C = 'rgb(22, 163, 74)' // green — sweet RC

export function EnvelopeDetectorViz() {
  const [logRC, setLogRC] = useState(-0.7) // RC ~ 0.2 (sweet spot)
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scaleRef = useRef<HTMLCanvasElement | null>(null)

  const RC = Math.pow(10, logRC)
  const fcRC = FC * RC
  const wRC = FM * RC
  const tooSmall = RC < T_C * 3 // less than ~3 carrier periods
  const tooBig = RC > T_W * 0.5 // more than ~half a message period

  // Animation
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, RC, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, RC])

  // Scale strip — redraws when RC changes
  useEffect(() => {
    const canvas = scaleRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScale(canvas, colors, RC)
  }, [RC])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Envelope detector — RC ανάμεσα στις δύο κλίμακες
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Παίξε'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        AM input (μπλε) → δίοδος (γκρι rectified) → RC LPF (πορτοκαλί) → ανακτημένη
        envelope. Στον άξονα χρόνου φαίνονται οι δύο κλίμακες κλειδιά:{' '}
        <span style={{ color: MARKER_C, fontWeight: 600 }}>1/f_c</span>{' '}
        (μια carrier περίοδος, μικρή κόκκινη γραμμή) και{' '}
        <span style={{ color: MARKER_C, fontWeight: 600 }}>1/W</span> (μια
        περίοδος message, μεγάλη). Το RC πρέπει να ζει{' '}
        <strong>ανάμεσά τους</strong>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 220 }}
        className="block h-[220px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Envelope detector signal flow"
      />

      {/* Scale strip — where RC sits relative to 1/f_c and 1/W */}
      <div className="mt-3">
        <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
          RC κλίμακα (log)
        </div>
        <canvas
          ref={scaleRef}
          style={{ height: 56 }}
          className="block h-[56px] w-full rounded-md border border-border bg-bg-soft/30"
          aria-label="Log scale of RC against carrier and message scales"
        />
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          <span className="font-mono">RC</span> ={' '}
          <span className="font-mono tabular-nums text-fg">{RC.toFixed(3)}</span>
          {' · '}
          <span className="font-mono">f_c·RC</span> ={' '}
          <span
            className={cn(
              'font-mono tabular-nums',
              fcRC < 3
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-700 dark:text-green-400',
            )}
          >
            {fcRC.toFixed(1)}
          </span>{' '}
          (πρέπει ≫ 1)
          {' · '}
          <span className="font-mono">W·RC</span> ={' '}
          <span
            className={cn(
              'font-mono tabular-nums',
              wRC > 0.5
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-700 dark:text-green-400',
            )}
          >
            {wRC.toFixed(2)}
          </span>{' '}
          (πρέπει ≪ 1)
        </label>
        <input
          type="range"
          min={RC_MIN_LOG}
          max={RC_MAX_LOG}
          step={0.025}
          value={logRC}
          onChange={(e) => setLogRC(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="RC time constant (log scale)"
        />
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          tooSmall || tooBig
            ? 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200'
            : 'border-green-500/40 bg-green-500/10 text-green-800 dark:text-green-200',
        )}
      >
        {tooSmall ? (
          <>
            <strong>Πολύ μικρό RC.</strong> Ο πυκνωτής εκφορτίζεται γρήγορα
            ανάμεσα στους carrier κύκλους — η έξοδος έχει{' '}
            <strong>ripple</strong> στη συχνότητα <span className="font-mono">f_c</span>.
            Πρακτικός κανόνας: <span className="font-mono">f_c·RC ≥ 10</span>.
          </>
        ) : tooBig ? (
          <>
            <strong>Πολύ μεγάλο RC.</strong> Ο πυκνωτής δεν προλαβαίνει να
            ακολουθήσει τις πτώσεις του message — <strong>diagonal clipping</strong>.
            Πρακτικός κανόνας: <span className="font-mono">W·RC ≤ 0.1</span>.
          </>
        ) : (
          <>
            <strong>Σωστή ζώνη.</strong> Το RC καλύπτει πολλούς carrier
            κύκλους ({fcRC.toFixed(0)}× η περίοδος{' '}
            <span className="font-mono">1/f_c</span>) χωρίς να χάνει το
            envelope. Πρακτικά για AM ραδιόφωνο{' '}
            <span className="font-mono">f_c = 1 MHz</span>,{' '}
            <span className="font-mono">W = 4 kHz</span>:{' '}
            <span className="font-mono">RC ≈ 50 μs</span>.
          </>
        )}
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  RC: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 16
  const PAD_Y = 16
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.4

  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.5, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // True envelope (target)
  ctx.strokeStyle = ENV_C
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(env)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // AM input (faint)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const v = env * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // Rectified signal (half-wave)
  ctx.strokeStyle = RECT_C
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const v = Math.max(0, env * Math.cos(2 * Math.PI * FC * t))
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // RC envelope detector simulation
  let vCap = 1 + MU
  ctx.strokeStyle = OUT_C
  ctx.lineWidth = 2
  ctx.beginPath()
  let firstPoint = true
  const SIM_STEPS = 4000
  for (let i = 0; i <= SIM_STEPS; i++) {
    const t = lerp(i, 0, SIM_STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const vIn = Math.max(0, env * Math.cos(2 * Math.PI * FC * t))
    const dt = (tEnd - tStart) / SIM_STEPS
    if (vIn > vCap) {
      vCap += (vIn - vCap) * (dt / Math.max(RC * 0.01, 0.0001))
      if (vCap > vIn) vCap = vIn
    } else {
      vCap += -vCap * (dt / RC)
      if (vCap < 0) vCap = 0
    }
    if (i % 4 === 0) {
      const px = xt(t)
      const py = yv(vCap)
      if (firstPoint) {
        ctx.moveTo(px, py)
        firstPoint = false
      } else {
        ctx.lineTo(px, py)
      }
    }
  }
  ctx.stroke()

  // 1/f_c marker — small red bracket on the time axis (carrier period)
  const tMark0 = tStart + tWindow * 0.05 // anchor near left
  drawScaleBracket(ctx, xt(tMark0), xt(tMark0 + T_C), yZero, '1/f_c')
  // 1/W marker — wider bracket (one message period scale)
  const tMark1 = tStart + tWindow * 0.55
  drawScaleBracket(ctx, xt(tMark1), xt(tMark1 + T_W), yZero, '1/W')

  // Playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), PAD_Y)
  ctx.lineTo(xt(tNow), h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = SIG_C
  ctx.fillText('— AM input (faint)', PAD_X + 4, PAD_Y + 10)
  ctx.fillStyle = ENV_C
  ctx.fillText('— true envelope', PAD_X + 4, PAD_Y + 22)
  ctx.fillStyle = OUT_C
  ctx.fillText('— RC output', PAD_X + 4, PAD_Y + 34)
}

function drawScaleBracket(
  ctx: CanvasRenderingContext2D,
  xL: number,
  xR: number,
  yBase: number,
  label: string,
) {
  ctx.strokeStyle = MARKER_C
  ctx.fillStyle = MARKER_C
  ctx.lineWidth = 1.4
  const yBracket = yBase + 8
  const tick = 4
  ctx.beginPath()
  ctx.moveTo(xL, yBracket - tick)
  ctx.lineTo(xL, yBracket + tick)
  ctx.moveTo(xR, yBracket - tick)
  ctx.lineTo(xR, yBracket + tick)
  ctx.moveTo(xL, yBracket)
  ctx.lineTo(xR, yBracket)
  ctx.stroke()
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, (xL + xR) / 2, yBracket + 16)
}

function drawScale(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  RC: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padX = 20
  const yMid = h / 2 + 6

  const xLog = (rc: number) =>
    lerp(Math.log10(rc), RC_MIN_LOG, RC_MAX_LOG, padX, w - padX)

  // Background bands
  const xFc = xLog(T_C) // 1/f_c position
  const xW = xLog(T_W) // 1/W position
  // Red zone left of 1/f_c (too small ripple)
  ctx.fillStyle = 'rgba(220, 38, 38, 0.12)'
  ctx.fillRect(padX, yMid - 8, xFc - padX, 16)
  // Green sweet band
  ctx.fillStyle = 'rgba(22, 163, 74, 0.12)'
  ctx.fillRect(xFc, yMid - 8, xW - xFc, 16)
  // Red zone right of 1/W (too big lag)
  ctx.fillStyle = 'rgba(220, 38, 38, 0.12)'
  ctx.fillRect(xW, yMid - 8, w - padX - xW, 16)

  // Main scale axis
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(padX, yMid)
  ctx.lineTo(w - padX, yMid)
  ctx.stroke()

  // Major decade ticks
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let p = Math.ceil(RC_MIN_LOG); p <= Math.floor(RC_MAX_LOG); p++) {
    const v = Math.pow(10, p)
    const x = xLog(v)
    ctx.beginPath()
    ctx.moveTo(x, yMid - 5)
    ctx.lineTo(x, yMid + 5)
    ctx.stroke()
    ctx.fillText(`10^${p}`, x, yMid + 16)
  }

  // 1/f_c marker
  ctx.strokeStyle = MARKER_C
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xFc, yMid - 12)
  ctx.lineTo(xFc, yMid + 12)
  ctx.stroke()
  ctx.fillStyle = MARKER_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('1/f_c', xFc - 3, yMid - 14)

  // 1/W marker
  ctx.beginPath()
  ctx.moveTo(xW, yMid - 12)
  ctx.lineTo(xW, yMid + 12)
  ctx.stroke()
  ctx.textAlign = 'left'
  ctx.fillText('1/W', xW + 3, yMid - 14)

  // "sweet" label
  ctx.fillStyle = SWEET_C
  ctx.textAlign = 'center'
  ctx.fillText('σωστή ζώνη', (xFc + xW) / 2, yMid + 16)

  // Current RC dot
  const xRC = xLog(Math.max(RC_MIN, Math.min(RC_MAX, RC)))
  const inSweet = RC >= T_C * 3 && RC <= T_W * 0.5
  ctx.fillStyle = inSweet ? SWEET_C : MARKER_C
  ctx.beginPath()
  ctx.arc(xRC, yMid, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('RC', xRC, yMid - 10)
}
