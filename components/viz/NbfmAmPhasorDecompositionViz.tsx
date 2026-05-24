'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * NBFM vs AM phasor decomposition — slide 30-31 of the prof's deck.
 *
 * The prof's slide-31 statement: «οι πλευρικές φασματικές ζώνες Φ(f − f_c) και
 * Φ(f + f_c) έχουν διαφορά φάσης π/2 σε σχέση με τη συνιστώσα του φέροντος.
 * Το Φ(f − f_c) προηγείται κατά π/2, ενώ το Φ(f + f_c) έπεται.» This viz makes
 * that explicit in two complementary ways.
 *
 * Panel A — complex-envelope trajectory (the «what does the signal LOOK like»
 * view). Both NBFM and AM use the SAME single-tone message and the SAME
 * modulation index magnitude. We draw both complex envelopes side by side:
 *
 *   • AM:    g(t) = A_c + μ A_c cos(2π f_m t)         → real-axis segment
 *            (envelope amplitude changes; phase = 0)
 *
 *   • NBFM:  g(t) = A_c [1 + j β_f sin(2π f_m t)]     → vertical arc at A_c
 *            (envelope amplitude essentially constant; phase wobbles a little)
 *
 * SAME slider → completely different geometry. The student SEES that AM lives
 * on the real axis (info in magnitude) while NBFM lives on a near-vertical
 * arc (info in phase).
 *
 * Panel B — phasor sum (the «why does the magnitude spectrum look the same»
 * view). We draw three rotating arrows that ADD vectorially to the complex
 * envelope, with the rotation in the (f - f_c) reference frame so the carrier
 * is stationary:
 *
 *   • Carrier:   A_c · 1                        (stationary, points → real)
 *   • USB:       (A_c · k/2) · e^{+j 2π f_m t}  (rotates counter-clockwise)
 *   • LSB:       (A_c · k/2) · e^{−j 2π f_m t}  (rotates clockwise)
 *                where k = μ for AM, k = β_f for NBFM.
 *
 * For AM: USB and LSB are BOTH POSITIVE REAL when t=0, so their sum is along
 * the real axis. They rotate in opposite directions so the imaginary parts
 * cancel: the sum always lies on the real axis. Envelope grows/shrinks.
 *
 * For NBFM: USB is +(A_c β_f / 2) e^{+jθ} (the «+» from slide 33), LSB is
 * −(A_c β_f / 2) e^{−jθ}. At t=0, the two sideband phasors point in OPPOSITE
 * directions on the real axis and cancel; as θ grows, the real parts continue
 * to cancel while the imaginary parts ADD — giving a pure-imaginary correction
 * that swings the phasor up and down vertically. Envelope stays constant
 * (to first order); phase wobbles.
 *
 * That is the «hidden in phase» geometry that magnitude-only spectra miss.
 */

type Scheme = 'both' | 'nbfm' | 'am'

const F_M = 0.3 // visualisation rate (rev/sec of sideband phasors in the f - f_c frame)

export function NbfmAmPhasorDecompositionViz() {
  const [k, setK] = useState(0.4) // shared β_f and μ
  const [running, setRunning] = useState(true)
  const [scheme, setScheme] = useState<Scheme>('both')
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) draw(canvas, colors, k, scheme, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, k, scheme])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          NBFM vs AM phasor sum — γιατί το ίδιο μέτρο φάσματος κρύβει αντίθετη γεωμετρία
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
        Slide 30-31 του καθηγητή. Και τα δύο σχήματα γράφονται ως{' '}
        <strong>carrier + 2 sideband phasors</strong> που περιστρέφονται σε αντίθετες
        κατευθύνσεις. Στο AM το LSB και το USB είναι <strong>συμφασικά</strong> —
        αθροίζονται κατά μήκος του πραγματικού άξονα, οπότε το envelope κουνιέται.
        Στο NBFM το LSB έχει <strong>αντίθετο πρόσημο</strong> (slide 33) — το
        άθροισμα ζει στον φανταστικό άξονα, οπότε η φάση κουνιέται και το envelope
        μένει (σχεδόν) σταθερό.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-fg-subtle">Δείξε:</span>
        {(
          [
            { id: 'both', label: 'NBFM + AM' },
            { id: 'nbfm', label: 'μόνο NBFM' },
            { id: 'am', label: 'μόνο AM' },
          ] as Array<{ id: Scheme; label: string }>
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setScheme(opt.id)}
            className={
              'rounded-full border px-3 py-1 text-xs transition-colors ' +
              (scheme === opt.id
                ? 'border-accent bg-accent/15 text-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50')
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Phasor decomposition of NBFM vs AM complex envelope"
      />

      <div className="mt-3 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            β<sub>f</sub> (NBFM) = μ (AM) ={' '}
            <span className="font-mono tabular-nums text-fg">{k.toFixed(2)}</span>
            {' · '}
            {k < 0.3 ? (
              <span className="text-emerald-700 dark:text-emerald-400">
                «καθαρά» NBFM regime, γεωμετρία τόξου ευδιάκριτη
              </span>
            ) : k < 0.7 ? (
              <span className="text-amber-600 dark:text-amber-400">
                η NBFM προσέγγιση αρχίζει να σπάει — βλέπεις την καμπύλωση
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                έξω από NBFM (β &gt; 0.7) — οι «κρυφοί» 2οι όροι Bessel φαίνονται
              </span>
            )}
          </span>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.02}
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        <strong>Πώς να το δεις:</strong> κοίτα τα δύο τόξα στα τέλη των carriers
        (γκρι, πάνω-κάτω, μήκους A_c k / 2). Στο AM το «κόκκινο» τόξο USB και το
        «μωβ» τόξο LSB δείχνουν στην <strong>ίδια κατεύθυνση</strong> όταν t=0, οπότε
        το άθροισμά τους ζει στον πραγματικό άξονα. Στο NBFM δείχνουν σε{' '}
        <strong>αντίθετες κατευθύνσεις</strong> όταν t=0, οπότε το άθροισμά τους ζει
        στον <strong>φανταστικό άξονα</strong> — γι' αυτό η συνολική phasor (κίτρινη)
        ταλαντώνεται κάθετα κρατώντας το μέτρο σταθερό.
      </p>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  k: number,
  scheme: Scheme,
  t: number,
) {
  if (!colors) return
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)

  const showNbfm = scheme !== 'am'
  const showAm = scheme !== 'nbfm'

  // Two side-by-side complex-plane panels
  const padTop = 30
  const padBot = 10
  const padX = 14
  const innerW = (width - 3 * padX) / 2
  const innerH = height - padTop - padBot

  const Ac = 1
  const r = Math.min(innerW, innerH) * 0.36 // radius for the carrier vector
  const sbLen = r * k // sideband phasor length

  const theta = 2 * Math.PI * F_M * t

  // ─── NBFM panel (left if both, otherwise center) ───
  const xLeft0 = padX + (scheme === 'am' ? width / 2 - innerW / 2 - padX / 2 : 0)
  const yMid = padTop + innerH / 2

  if (showNbfm) {
    const cx = xLeft0 + (scheme === 'nbfm' ? width / 2 : padX + innerW / 2)
    drawPanel(
      ctx,
      colors,
      cx,
      yMid,
      r,
      'NBFM',
      '#10b981',
      Ac,
      sbLen,
      theta,
      /* lsbSign = */ -1, // slide-33 minus sign
    )
  }

  if (showAm) {
    const cx =
      scheme === 'am'
        ? width / 2
        : 2 * padX + innerW + padX + innerW / 2
    drawPanel(
      ctx,
      colors,
      cx,
      yMid,
      r,
      'AM',
      '#a855f7',
      Ac,
      sbLen,
      theta,
      /* lsbSign = */ +1, // slide-33 plus sign
    )
  }

  // Title bar
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText(
    'complex envelope g(t) = carrier + USB + LSB  (reference frame: rotating with f_c)',
    width / 2,
    8,
  )
  ctx.textAlign = 'start'
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  cx: number,
  cy: number,
  r: number,
  title: string,
  accentColor: string,
  Ac: number,
  sbLen: number,
  theta: number,
  lsbSign: number,
) {
  if (!colors) return

  // Plot box and axes
  const boxR = r * 1.7
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(cx - boxR, cy - boxR, 2 * boxR, 2 * boxR)

  // Axes
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - boxR, cy)
  ctx.lineTo(cx + boxR, cy)
  ctx.moveTo(cx, cy - boxR)
  ctx.lineTo(cx, cy + boxR)
  ctx.stroke()

  // Title
  ctx.fillStyle = accentColor
  ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
  ctx.textBaseline = 'bottom'
  ctx.textAlign = 'center'
  ctx.fillText(title, cx, cy - boxR - 4)
  ctx.textAlign = 'start'

  // Carrier phasor (stationary, →)
  const carrierX = cx + Ac * r
  const carrierY = cy
  drawArrow(ctx, cx, cy, carrierX, carrierY, colors.fg, 2, 'A_c')

  // USB phasor at angle +theta from carrier tip
  const usbDX = sbLen * Math.cos(theta)
  const usbDY = -sbLen * Math.sin(theta) // canvas y inverted
  const usbX = carrierX + usbDX
  const usbY = carrierY + usbDY
  drawArrow(ctx, carrierX, carrierY, usbX, usbY, '#ef4444', 1.5, 'USB')

  // LSB phasor at angle -theta from USB tip (so the sum builds head-to-tail)
  const lsbDX = lsbSign * sbLen * Math.cos(theta)
  const lsbDY = -(-lsbSign * sbLen * Math.sin(theta))
  // ↑ careful: LSB rotates at angle -theta. With sign-flip for NBFM: total = -e^{-jθ} sbLen.
  // In Cartesian: real = -sbLen cos(-θ) = -sbLen cos θ ; imag = -sbLen sin(-θ) = +sbLen sin θ
  // For AM (lsbSign=+1): real = sbLen cos θ ; imag = -sbLen sin θ
  const lsbX = usbX + lsbDX
  const lsbY = usbY + lsbDY
  drawArrow(ctx, usbX, usbY, lsbX, lsbY, '#9333ea', 1.5, 'LSB')

  // Resultant (yellow, from carrier base to final point)
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 2.5
  ctx.setLineDash([5, 3])
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(lsbX, lsbY)
  ctx.stroke()
  ctx.setLineDash([])

  // Highlight the resultant tip
  ctx.fillStyle = '#facc15'
  ctx.beginPath()
  ctx.arc(lsbX, lsbY, 4, 0, Math.PI * 2)
  ctx.fill()

  // Trace ring/segment showing the resultant's locus
  // For AM: it's a real-axis segment of width 2 sbLen
  // For NBFM: it's approximately a vertical segment of height 2 sbLen at x = Ac r
  ctx.strokeStyle = accentColor
  ctx.globalAlpha = 0.4
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  if (lsbSign === +1) {
    // AM: real-axis segment from (Ac r - 2 sbLen, 0) to (Ac r + 2 sbLen, 0)
    ctx.moveTo(carrierX - 2 * sbLen, cy)
    ctx.lineTo(carrierX + 2 * sbLen, cy)
  } else {
    // NBFM: vertical segment at x = carrierX, from y = cy - 2 sbLen to cy + 2 sbLen
    ctx.moveTo(carrierX, cy - 2 * sbLen)
    ctx.lineTo(carrierX, cy + 2 * sbLen)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // Sign annotation
  ctx.fillStyle = colors.fg
  ctx.font = '11px ui-monospace, monospace'
  ctx.textBaseline = 'top'
  const signText = lsbSign === +1 ? '+(A_c·k/2)·e^{-jθ}' : '−(A_c·k/2)·e^{-jθ}'
  ctx.fillText(`LSB = ${signText}`, cx - boxR + 4, cy + boxR + 4)
  ctx.fillText(`USB = +(A_c·k/2)·e^{+jθ}`, cx - boxR + 4, cy + boxR + 18)

  // Envelope readout
  const envelope = Math.hypot(lsbX - cx, lsbY - cy) / r // normalized to A_c
  const phaseDeg =
    (Math.atan2(-(lsbY - cy), lsbX - cx) * 180) / Math.PI
  ctx.fillStyle = colors.fgMuted
  ctx.fillText(`|g|/A_c = ${envelope.toFixed(3)}`, cx - boxR + 4, cy - boxR + 4)
  ctx.fillText(`∠g = ${phaseDeg.toFixed(1)}°`, cx - boxR + 4, cy - boxR + 18)
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  lw: number,
  label?: string,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()

  const ang = Math.atan2(y1 - y0, x1 - x0)
  const ah = 6
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - ah * Math.cos(ang - Math.PI / 7), y1 - ah * Math.sin(ang - Math.PI / 7))
  ctx.lineTo(x1 - ah * Math.cos(ang + Math.PI / 7), y1 - ah * Math.sin(ang + Math.PI / 7))
  ctx.closePath()
  ctx.fill()

  if (label) {
    ctx.font = '10px ui-monospace, monospace'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(label, x1 + 6, y1)
  }
}
