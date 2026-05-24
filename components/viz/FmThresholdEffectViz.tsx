'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM threshold effect — SNR_out vs SNR_in με knee στο ~10 dB.
 *
 * Πάνω από threshold: SNR_out ≈ 3β² · SNR_in (γραμμικό, slope 1 σε dB).
 * Κάτω από threshold: ο discriminator παράγει «clicks» (false zero
 * crossings) και το SNR_out καταρρέει με slope ≫ 1 σε dB.
 *
 * Two panels:
 *   1. SNR_out_dB vs SNR_in_dB με γραμμικό extrapolation, η actual καμπύλη
 *      (knee), και η οριζόντια threshold γραμμή (configurable με β).
 *   2. Clicks/sec meter: μηδέν πάνω από threshold, εκθετική αύξηση
 *      μέχρι chaos κάτω από αυτό.
 *
 * Slider: SNR_in dB και β.
 *
 * Honest disclosure (B4 meta-pattern): το ακριβές threshold εξαρτάται
 * από τον δέκτη — οι textbooks δίνουν «~10 dB» αλλά είναι loose
 * qualitative. Η viz χρησιμοποιεί τη proxy SNR_in_threshold ≈ 10 dB
 * + 2·log10(β+1) για να αποτυπώσει τη γνωστή σχέση «μεγαλύτερο β =
 * μεγαλύτερο threshold» (περισσότερο BW → περισσότερος θόρυβος
 * εισέρχεται).
 */

export function FmThresholdEffectViz() {
  const [snrInDb, setSnrInDb] = useState(15)
  const [beta, setBeta] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Threshold heuristic: ~10 dB at β=1, climbs slowly with β
  const thresholdDb = useMemo(() => 10 + 4 * Math.log10(beta + 1), [beta])

  const stats = useMemo(() => {
    const linearOut = 10 * Math.log10(3 * beta * beta) + snrInDb // 3β² gain in dB
    let actualOut: number
    let clicksPerSec: number
    if (snrInDb >= thresholdDb) {
      actualOut = linearOut
      clicksPerSec = 0
    } else {
      const drop = thresholdDb - snrInDb
      // Below threshold, SNR_out collapses with steeper slope (~3 in dB)
      actualOut = linearOut - 3 * drop
      // clicks/sec roughly exp(drop)
      clicksPerSec = Math.min(1000, Math.exp(drop * 0.6))
    }
    return { linearOut, actualOut, clicksPerSec, isAbove: snrInDb >= thresholdDb }
  }, [snrInDb, beta, thresholdDb])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !canvasRef.current) return
    draw(canvasRef.current, colors, snrInDb, beta, thresholdDb)
    const onResize = () => {
      const c = getThemeColors()
      if (c && canvasRef.current) draw(canvasRef.current, c, snrInDb, beta, thresholdDb)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [snrInDb, beta, thresholdDb])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          FM threshold effect — η ξαφνική κατάρρευση κάτω από ~10 dB
        </h4>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            stats.isAbove
              ? 'border-emerald-500 bg-emerald-100/70 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'border-red-500 bg-red-100/70 text-red-800 dark:border-red-400 dark:bg-red-900/40 dark:text-red-200'
          }`}
        >
          {stats.isAbove ? 'Πάνω από threshold (linear regime)' : 'Κάτω από threshold (clicks + chaos)'}
        </span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-fg-muted">
        Πάνω από SNR_in ≈ {thresholdDb.toFixed(1)} dB ο τύπος SNR_out = 3β²·SNR_in ισχύει — slope 1 σε dB κλίμακα. Κάτω από αυτό ο discriminator αρχίζει να παράγει <strong>clicks</strong> (false zero crossings στις φάσεις όπου η ακτίνα του resultant phasor κοντοζυγώνει το μηδέν), και το SNR_out πέφτει με slope &gt;&gt; 1 — μερικά dB πτώση στο input κοστίζουν 10ple dB στο output. Παρατήρησε: αυξάνεις το β → ο gain ανεβαίνει (γραμμή πιο ψηλά) ΑΛΛΑ και το threshold ανεβαίνει (γιατί περισσότερο BW μπαίνει στον δέκτη και μαζί του περισσότερος θόρυβος).
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM threshold effect visualization"
      />

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            SNR_in ={' '}
            <span className="font-mono text-fg tabular-nums">{snrInDb.toFixed(0)} dB</span>
          </label>
          <input
            type="range"
            min={-5}
            max={40}
            step={0.5}
            value={snrInDb}
            onChange={(e) => setSnrInDb(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            β ={' '}
            <span className="font-mono text-fg tabular-nums">{beta.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={12}
            step={0.1}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">Threshold</div>
          <div className="font-mono text-amber-700 dark:text-amber-300 tabular-nums">
            {thresholdDb.toFixed(1)} dB
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">SNR_out (linear)</div>
          <div className="font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
            {stats.linearOut.toFixed(1)} dB
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">SNR_out (πραγματικό)</div>
          <div className={`font-mono tabular-nums ${stats.isAbove ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
            {stats.actualOut.toFixed(1)} dB
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">Clicks / sec</div>
          <div className={`font-mono tabular-nums ${stats.clicksPerSec < 1 ? 'text-fg-subtle' : 'text-red-700 dark:text-red-300'}`}>
            {stats.clicksPerSec < 1 ? '0' : stats.clicksPerSec > 500 ? '500+' : stats.clicksPerSec.toFixed(0)}
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        <strong>Πρακτική σημασία:</strong> στο εμπορικό FM ραδιόφωνο, ο receiver λειτουργεί πάνω από threshold για την κανονική εμβέλεια του σταθμού. Όσο απομακρύνεσαι, το SNR_in πέφτει — και μόλις περάσεις το threshold, ξαφνικά ακούς clicks. Αντίθετα στο AM, η ποιότητα μειώνεται σταδιακά (graceful degradation). Αυτή είναι η βασική διαφορά «FM είτε ακούγεται καθαρά είτε χάνεται».
      </p>
    </figure>
  )
}

// ── drawing ──────────────────────────────────────────────────────────────

const LINEAR_C = 'rgba(16, 185, 129, 0.45)'
const ACTUAL_C = 'rgb(16, 185, 129)'
const THRESH_C = 'rgb(217, 119, 6)'
const AXIS_C = 'rgba(120, 120, 120, 0.5)'

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  snrInDb: number,
  beta: number,
  thresholdDb: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const PAD = { l: 50, r: 16, t: 22, b: 30 }
  const inner = { x: PAD.l, y: PAD.t, w: w - PAD.l - PAD.r, h: h - PAD.t - PAD.b }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('SNR_out vs SNR_in — με knee + clicks κάτω από threshold', 6, 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(2, 18, w - 4, h - 22)

  // x: SNR_in -5..40 dB
  // y: SNR_out -10..70 dB
  const xMin = -5
  const xMax = 40
  const yMin = -10
  const yMax = 70

  const xf = (db: number) => lerp(db, xMin, xMax, inner.x, inner.x + inner.w)
  const yf = (db: number) => lerp(db, yMin, yMax, inner.y + inner.h, inner.y)

  // grid + ticks
  ctx.strokeStyle = AXIS_C
  ctx.lineWidth = 0.5
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  for (let v = xMin; v <= xMax; v += 5) {
    if (v % 10 !== 0 && v !== xMin) continue
    ctx.beginPath()
    ctx.moveTo(xf(v), inner.y)
    ctx.lineTo(xf(v), inner.y + inner.h)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillText(`${v}`, xf(v), inner.y + inner.h + 12)
  }
  for (let v = yMin; v <= yMax; v += 10) {
    ctx.beginPath()
    ctx.moveTo(inner.x, yf(v))
    ctx.lineTo(inner.x + inner.w, yf(v))
    ctx.stroke()
    ctx.textAlign = 'right'
    ctx.fillText(`${v}`, inner.x - 4, yf(v) + 3)
  }
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('SNR_in (dB)', inner.x + inner.w / 2, inner.y + inner.h + 24)
  ctx.save()
  ctx.translate(14, inner.y + inner.h / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('SNR_out (dB)', 0, 0)
  ctx.restore()

  // Vertical threshold line
  ctx.strokeStyle = THRESH_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(xf(thresholdDb), inner.y)
  ctx.lineTo(xf(thresholdDb), inner.y + inner.h)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = THRESH_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`threshold ≈ ${thresholdDb.toFixed(1)} dB`, xf(thresholdDb) + 4, inner.y + 14)

  // Dashed linear extrapolation (3β² gain everywhere)
  const offsetDb = 10 * Math.log10(3 * beta * beta)
  ctx.strokeStyle = LINEAR_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(xf(xMin), yf(Math.max(yMin, Math.min(yMax, xMin + offsetDb))))
  ctx.lineTo(xf(xMax), yf(Math.max(yMin, Math.min(yMax, xMax + offsetDb))))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = LINEAR_C
  ctx.fillText('γραμμική επέκταση (3β² παντού)', xf(25), yf(Math.max(yMin, Math.min(yMax, 25 + offsetDb))) - 4)

  // Actual curve: linear above threshold, collapse below
  ctx.strokeStyle = ACTUAL_C
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const N = 200
  for (let i = 0; i <= N; i++) {
    const sIn = lerp(i, 0, N, xMin, xMax)
    let sOut: number
    if (sIn >= thresholdDb) {
      sOut = sIn + offsetDb
    } else {
      const drop = thresholdDb - sIn
      sOut = thresholdDb + offsetDb - 3 * drop
    }
    sOut = Math.max(yMin, Math.min(yMax, sOut))
    const px = xf(sIn)
    const py = yf(sOut)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = ACTUAL_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('actual FM (collapse < threshold)', xf(xMin + 1), yf(Math.max(yMin, Math.min(yMax, xMin + 1 + offsetDb - 3 * Math.max(0, thresholdDb - (xMin + 1))))) - 6)

  // Mark current SNR_in
  const sOutCur =
    snrInDb >= thresholdDb
      ? snrInDb + offsetDb
      : thresholdDb + offsetDb - 3 * (thresholdDb - snrInDb)
  const sOutCurClamped = Math.max(yMin, Math.min(yMax, sOutCur))
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.beginPath()
  ctx.arc(xf(snrInDb), yf(sOutCurClamped), 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(xf(snrInDb), yf(sOutCurClamped))
  ctx.lineTo(xf(snrInDb), inner.y + inner.h)
  ctx.moveTo(xf(snrInDb), yf(sOutCurClamped))
  ctx.lineTo(inner.x, yf(sOutCurClamped))
  ctx.stroke()
  ctx.setLineDash([])
}
