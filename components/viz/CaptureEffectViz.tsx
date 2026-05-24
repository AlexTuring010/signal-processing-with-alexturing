'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM capture effect — μοναδικό στοιχείο της FM.
 *
 * Δύο FM σήματα φτάνουν στον δέκτη στην ΙΔΙΑ συχνότητα φέροντος f_c
 * αλλά με διαφορετική ισχύ. Ο limiter + discriminator κλειδώνει στο
 * ΙΣΧΥΡΟΤΕΡΟ· το ασθενέστερο γίνεται «θόρυβος».
 *
 * Γιατί δουλεύει: στο μιγαδικό επίπεδο, αν έχεις δύο phasors A_1 (ισχυρό)
 * και A_2 (ασθενέστερο) στην ίδια συχνότητα αλλά διαφορετική γωνία, το
 * resultant phasor κάνει «πετάγματα» γύρω από το A_1 (μικρή γωνιακή
 * διακύμανση όταν A_1 ≫ A_2). Ο limiter κρατά τη φάση μόνο — και η
 * φάση είναι πρακτικά η φάση του A_1.
 *
 * Two panels:
 *   1. Phasor view: A_1 (αριστερά, ισχυρό), A_2 περιστρέφεται γύρω του.
 *      Resultant phasor + locus.
 *   2. Demodulated output: percentage of A_1 vs A_2 που «βγαίνει».
 *      Threshold typically στο 3-6 dB advantage.
 *
 * Sliders: ratio A_1/A_2 σε dB (0..20), Δf (φάση διαφορά rate)
 */

export function CaptureEffectViz() {
  const [ratioDb, setRatioDb] = useState(6)
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const stats = useMemo(() => {
    const r = Math.pow(10, ratioDb / 20) // amplitude ratio A_1/A_2
    // empirical capture rule: above ~3 dB, dominance grows quickly; above ~6 dB, total capture
    const a1Share = 1 / (1 + Math.pow(r, -2)) // power-weighted dominance
    const a1ShareCaptured =
      ratioDb <= 0 ? 0.5 : ratioDb >= 6 ? 1 : 0.5 + ((ratioDb / 6) ** 1.5) * 0.5
    return { r, a1Share, a1ShareCaptured, isCaptured: ratioDb >= 6 }
  }, [ratioDb])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const colors = getThemeColors()
      if (colors && canvasRef.current) draw(canvasRef.current, colors, ratioDb, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ratioDb, running])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Capture effect — ο ισχυρότερος FM σταθμός παίρνει τα πάντα
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-fg-muted">
        Δύο FM σταθμοί S₁ και S₂ φτάνουν στον δέκτη στην ίδια συχνότητα f_c. Σύρε τον λόγο A₁/A₂ — όταν το S₁ είναι περίπου ίσο με το S₂ (0–3 dB) ο δέκτης μπερδεύεται και ακούς και τους δύο «παραμορφωμένα». Μόλις περάσεις τα 6 dB πλεονέκτημα, ο S₁ <strong>κερδίζει ολοκληρωτικά</strong> — ο S₂ εξαφανίζεται από την έξοδο, όχι απλά μειώνεται. Αυτό είναι το capture effect, μοναδικό στην FM (στο AM τα δύο σήματα αναμιγνύονται γραμμικά πάντα).
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM capture effect visualization"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          A₁/A₂ ratio ={' '}
          <span className="font-mono text-fg tabular-nums">{ratioDb.toFixed(1)} dB</span>
          {' · '}
          <span className={stats.isCaptured ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}>
            {stats.isCaptured
              ? 'Total capture — μόνο το S₁ ακούγεται'
              : ratioDb < 3
                ? 'Mixing region — και οι δύο, παραμορφωμένα'
                : 'Partial capture — το S₁ ξεχωρίζει, αλλά υπολείμματα του S₂'}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={15}
          step={0.5}
          value={ratioDb}
          onChange={(e) => setRatioDb(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">A₁/A₂ (linear)</div>
          <div className="font-mono text-fg tabular-nums">{stats.r.toFixed(2)}×</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">Share στην έξοδο (S₁)</div>
          <div className="font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
            {(stats.a1ShareCaptured * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">Share στην έξοδο (S₂)</div>
          <div className="font-mono text-red-700 dark:text-red-300 tabular-nums">
            {((1 - stats.a1ShareCaptured) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        <strong>Πρακτικές συνέπειες:</strong> (1) στο FM ραδιόφωνο, αν φύγεις από την εμβέλεια του σταθμού σου, ξαφνικά «πιάνεις» τον επόμενο ισχυρότερο στην ίδια συχνότητα — δεν υπάρχει zone αναμίξης. (2) Στη στρατιωτική επικοινωνία, ένας ισχυρός jammer μπορεί να καλύψει εντελώς εχθρικές εκπομπές. (3) Σε δίκτυα συγχρονισμένων FM transmitters (single-frequency networks), η ζώνη όπου δύο εκπομπείς δίνουν ίδια ισχύ είναι «τυφλή» — γι' αυτό σχεδιάζονται ώστε να υπάρχει πάντα ένας ισχυρός σε κάθε σημείο.
      </p>
    </figure>
  )
}

// ── drawing ──────────────────────────────────────────────────────────────

const S1_C = 'rgb(16, 185, 129)'
const S2_C = 'rgb(220, 38, 38)'
const RESULT_C = 'rgb(168, 85, 247)'
const AXIS_C = 'rgba(120, 120, 120, 0.5)'

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ratioDb: number,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const halfW = w / 2
  drawPhasorPanel(ctx, colors, 0, 0, halfW, h, ratioDb, t)
  drawDemodulatedPanel(ctx, colors, halfW, 0, halfW, h, ratioDb)
}

function drawPhasorPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  ratioDb: number,
  t: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Phasor view — S₁ + S₂ στην ίδια f_c', x0 + 6, y0 + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x0 + 2, y0 + 18, pw - 4, ph - 22)

  const cx = x0 + pw / 2
  const cy = y0 + 18 + (ph - 22) / 2
  const radius = Math.min(pw, ph) * 0.32

  // axes
  ctx.strokeStyle = AXIS_C
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x0 + 12, cy)
  ctx.lineTo(x0 + pw - 12, cy)
  ctx.moveTo(cx, y0 + 22)
  ctx.lineTo(cx, y0 + ph - 8)
  ctx.stroke()

  // S1 amplitude (always fixed direction for clarity — at angle ωt slow)
  const r = Math.pow(10, ratioDb / 20)
  const a1 = radius * 0.85
  const a2 = a1 / r
  // S2 rotates relative to S1
  const phi = t * 1.5
  const ang1 = 0
  const ang2 = phi

  // S1 phasor
  ctx.strokeStyle = S1_C
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + a1 * Math.cos(ang1), cy - a1 * Math.sin(ang1))
  ctx.stroke()
  drawArrowHead(ctx, cx, cy, cx + a1 * Math.cos(ang1), cy - a1 * Math.sin(ang1), S1_C, 7)
  ctx.fillStyle = S1_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('S₁ (strong)', cx + a1 + 4, cy + 4)

  // S2 phasor — attached to tip of S1
  const s1Tip = { x: cx + a1, y: cy }
  ctx.strokeStyle = S2_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(s1Tip.x, s1Tip.y)
  const s2Tip = {
    x: s1Tip.x + a2 * Math.cos(ang2),
    y: s1Tip.y - a2 * Math.sin(ang2),
  }
  ctx.lineTo(s2Tip.x, s2Tip.y)
  ctx.stroke()
  drawArrowHead(ctx, s1Tip.x, s1Tip.y, s2Tip.x, s2Tip.y, S2_C, 5)
  ctx.fillStyle = S2_C
  ctx.fillText('S₂', s2Tip.x + 4, s2Tip.y)

  // Resultant — from origin to s2Tip
  ctx.strokeStyle = RESULT_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(s2Tip.x, s2Tip.y)
  ctx.stroke()
  ctx.setLineDash([])

  // Locus circle (where the resultant tip can be)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(s1Tip.x, s1Tip.y, a2, 0, Math.PI * 2)
  ctx.stroke()

  // current resultant angle (proxy for what the discriminator sees)
  const resAngle = Math.atan2(-(s2Tip.y - cy), s2Tip.x - cx)
  ctx.fillStyle = RESULT_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`∠resultant = ${(resAngle * 180 / Math.PI).toFixed(1)}°`, cx, y0 + ph - 8)
}

function drawDemodulatedPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  ratioDb: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Share στην έξοδο vs A₁/A₂ ratio', x0 + 6, y0 + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x0 + 2, y0 + 18, pw - 4, ph - 22)

  const PAD = { l: 40, r: 16, t: 24, b: 30 }
  const inner = { x: x0 + PAD.l, y: y0 + PAD.t, w: pw - PAD.l - PAD.r, h: ph - PAD.t - PAD.b }

  // x: ratio dB 0..15, y: share 0..100%
  const xMin = 0
  const xMax = 15
  const yMin = 0
  const yMax = 100

  const xf = (db: number) => lerp(db, xMin, xMax, inner.x, inner.x + inner.w)
  const yf = (p: number) => lerp(p, yMin, yMax, inner.y + inner.h, inner.y)

  // grid
  ctx.strokeStyle = AXIS_C
  ctx.lineWidth = 0.5
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  for (let v = 0; v <= 15; v += 3) {
    ctx.beginPath()
    ctx.moveTo(xf(v), inner.y)
    ctx.lineTo(xf(v), inner.y + inner.h)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillText(`${v}`, xf(v), inner.y + inner.h + 12)
  }
  for (let v = 0; v <= 100; v += 25) {
    ctx.beginPath()
    ctx.moveTo(inner.x, yf(v))
    ctx.lineTo(inner.x + inner.w, yf(v))
    ctx.stroke()
    ctx.textAlign = 'right'
    ctx.fillText(`${v}%`, inner.x - 4, yf(v) + 3)
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('A₁/A₂ (dB)', inner.x + inner.w / 2, inner.y + inner.h + 24)

  // S1 share curve (green)
  ctx.strokeStyle = S1_C
  ctx.lineWidth = 2
  ctx.beginPath()
  const N = 80
  for (let i = 0; i <= N; i++) {
    const db = lerp(i, 0, N, xMin, xMax)
    const share =
      db <= 0 ? 50 : db >= 6 ? 100 : 50 + ((db / 6) ** 1.5) * 50
    const px = xf(db)
    const py = yf(share)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = S1_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('S₁ output share', inner.x + inner.w - 4, yf(95))

  // S2 share curve (red)
  ctx.strokeStyle = S2_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= N; i++) {
    const db = lerp(i, 0, N, xMin, xMax)
    const share =
      db <= 0 ? 50 : db >= 6 ? 0 : 50 - ((db / 6) ** 1.5) * 50
    const px = xf(db)
    const py = yf(share)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = S2_C
  ctx.textAlign = 'right'
  ctx.fillText('S₂ output share', inner.x + inner.w - 4, yf(5) + 10)

  // 6 dB capture threshold
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)'
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(xf(6), inner.y)
  ctx.lineTo(xf(6), inner.y + inner.h)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(217, 119, 6)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('6 dB → total capture', xf(6) + 4, inner.y + 12)

  // current ratio marker
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.beginPath()
  ctx.arc(xf(ratioDb), inner.y + 3, 4, 0, Math.PI * 2)
  ctx.fill()
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  size: number,
) {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}
