'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * Carrier vs sideband power split — the donut comparison.
 *
 * Distinct teaching purpose vs the page's existing power vizzes:
 *   - AMPowerCalculator shows the four numeric quantities (P_c, P_sb, P_total, η).
 *   - EfficiencyVsMuCurveViz makes the η(μ) wall visceral via a curve.
 *   - THIS viz makes the *real-world cost* visceral: for the same delivered
 *     message-power, AM at μ=1 needs ~3× the antenna power of DSB-SC and ~6×
 *     of SSB. The wasted ring is the carrier you're shipping over the air.
 *
 * Three donuts side-by-side, each sized to deliver the same useful sideband
 * power as the current Conventional AM configuration:
 *   - AM (left): outer ring = wasted carrier, inner ring = USB + LSB.
 *   - DSB-SC (middle): no carrier — the whole disk is sidebands.
 *   - SSB (right): half the DSB-SC disk (single sideband suffices).
 *
 * The student drags the μ slider and watches the AM donut **shrink at μ=0**
 * (you need infinite antenna power to deliver any message via pure carrier!)
 * and approach the DSB/SSB sizes as μ → 1.
 */

const COLOR_CARRIER = 'rgb(100, 116, 139)' // slate
const COLOR_USB = 'rgb(29, 78, 216)' // accent blue
const COLOR_LSB = 'rgb(99, 102, 241)' // indigo

export function CarrierVsSidebandPowerSplitViz() {
  const [mu, setMu] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mu)
  }, [mu])

  // Reference message-sideband power, normalised so DSB-SC area = 1.0
  // Sideband total in AM at this μ: 2 · μ²/8 = μ²/4 (with A_c=1).
  // Carrier in AM: 1/2.
  // P_total_AM = 1/2 + μ²/4 (normalised).
  //
  // For *equal delivered message power* P_msg, the radius scales as √(P_msg).
  // We choose P_msg ≡ μ²/4 (the AM sideband power). Then:
  //   AM antenna power     = 1/2 + μ²/4   = P_msg + 0.5
  //   DSB-SC antenna power = μ²/4         = P_msg
  //   SSB antenna power    = μ²/8         = P_msg / 2  (only one sideband — half the energy)
  //
  // Areas of the three donuts ∝ those antenna powers, so the visual ring
  // scales reflect literal Watts at the transmitter.

  const PmsgAm = (mu * mu) / 4
  const totalAm = 0.5 + PmsgAm
  const eta = mu < 1e-3 ? 0 : (mu * mu) / 2 / (1 + (mu * mu) / 2)
  const amWatts = mu < 1e-3 ? Infinity : totalAm / PmsgAm
  const dsbWatts = mu < 1e-3 ? Infinity : 1
  const ssbWatts = mu < 1e-3 ? Infinity : 0.5

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πόσα Watts ζητάει η κεραία για 1 W μηνύματος — AM vs DSB-SC vs SSB
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τρεις δίσκοι. Κάθε δίσκος έχει επιφάνεια <em>ίση</em> με την ισχύ που
        ζητάει η κεραία ενός σχήματος για να παραδώσει την{' '}
        <strong>ίδια</strong> ισχύ μηνύματος. Ο γκρι δακτύλιος της AM = ισχύς
        που πάει στον carrier και δεν φέρει πληροφορία. Σύρε το{' '}
        <span className="font-mono">μ</span> και δες πώς ο AM-δίσκος κάνει τα
        άλλα δύο να φαίνονται μικρά.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Three donut charts comparing AM, DSB-SC, and SSB antenna power for equal message power"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-border bg-bg-soft/40 p-3">
          <label className="block text-xs text-fg-muted">
            μ = <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
            {' · '}η ={' '}
            <span className="font-mono text-fg tabular-nums">{(eta * 100).toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index mu"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {[0.3, 0.5, 0.7, 1.0].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMu(m)}
                className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] font-medium text-fg-muted hover:border-accent/50 hover:text-fg"
              >
                μ = {m.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border bg-bg-soft/40 p-3 text-xs">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Watt στην κεραία για 1 W μηνύματος
          </div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-0.5">
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-slate-400 align-middle" />
                  Conventional AM
                </td>
                <td className="py-0.5 text-right font-mono tabular-nums">
                  {isFinite(amWatts) ? amWatts.toFixed(2) : '∞'} W
                </td>
              </tr>
              <tr>
                <td className="py-0.5">
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-blue-600 align-middle" />
                  DSB-SC
                </td>
                <td className="py-0.5 text-right font-mono tabular-nums">
                  {dsbWatts.toFixed(2)} W
                </td>
              </tr>
              <tr>
                <td className="py-0.5">
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500 align-middle" />
                  SSB (USB ή LSB μόνο)
                </td>
                <td className="py-0.5 text-right font-mono tabular-nums">
                  {ssbWatts.toFixed(2)} W
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-1 text-[11px] text-fg-muted">
            Στο{' '}
            <span className="font-mono">μ = 1</span> (καλύτερη περίπτωση AM): AM
            ≈ <strong>3 W</strong>, DSB-SC = 1 W, SSB = 0.5 W. Δηλαδή το AM
            χρειάζεται{' '}
            <strong>3× την κεραιακή ισχύ</strong> για το ίδιο μήνυμα.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί:</strong> ο carrier της AM είναι «ξοδεμένη ισχύς» — δεν
        κουβαλάει πληροφορία, μόνο δίνει στον envelope detector ένα DC level να
        ακολουθήσει. DSB-SC πετάει αυτή τη σπατάλη ολόκληρη (αλλά απαιτεί
        coherent demod). SSB πετάει επιπλέον τη μία διπλή πλευρά (αλλά απαιτεί
        Hilbert/φίλτρο). <strong>Δες</strong>: όσο πιο μικρό το{' '}
        <span className="font-mono">μ</span>, τόσο μεγαλύτερος ο γκρι δακτύλιος
        — γι' αυτό «τραβάς» το <span className="font-mono">μ</span> κοντά στο 1.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Compute normalised powers as in the component
  const PmsgAm = (mu * mu) / 4
  const totalAm = 0.5 + PmsgAm
  const totalDsb = PmsgAm
  const totalSsb = PmsgAm / 2

  // Reference: at μ=1 the AM total normalised = 3/4. Scale so AM area at μ=1
  // fits comfortably. Visual area ∝ antenna power; r ∝ √(antenna power).
  // Pick a constant K such that visual radius of AM at μ=1 ≈ 64 px.
  const r_at_mu1 = 64
  const area_at_mu1 = 0.75 // totalAm at μ=1
  const K = (r_at_mu1 * r_at_mu1) / area_at_mu1 // so r² = K·power

  const rAm = mu < 1e-3 ? 0 : Math.sqrt(K * totalAm)
  const rDsb = mu < 1e-3 ? 0 : Math.sqrt(K * totalDsb)
  const rSsb = mu < 1e-3 ? 0 : Math.sqrt(K * totalSsb)

  // For AM, draw two-band donut: outer = carrier (gray), inner = sidebands (blue/indigo).
  // The area of the inner disk = totalDsb = PmsgAm; the annulus area = totalAm − totalDsb = 0.5 (carrier).
  const rAmInner = mu < 1e-3 ? 0 : Math.sqrt(K * PmsgAm)
  // For DSB-SC: split into USB + LSB halves visually (top/bottom semicircles).
  // For SSB: single disk (single sideband only) — color = indigo.

  const cellW = w / 3
  const cy = h / 2 - 6
  const r0Am = cellW * 0.5
  const r0Dsb = cellW * 1.5
  const r0Ssb = cellW * 2.5

  drawAMDonut(ctx, colors, r0Am, cy, rAm, rAmInner)
  drawDSBDisk(ctx, colors, r0Dsb, cy, rDsb)
  drawSSBDisk(ctx, colors, r0Ssb, cy, rSsb)

  // Labels under each donut
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`Conventional AM`, r0Am, h - 18)
  ctx.fillText(`DSB-SC`, r0Dsb, h - 18)
  ctx.fillText(`SSB`, r0Ssb, h - 18)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(`P = ${totalAm.toFixed(2)}`, r0Am, h - 4)
  ctx.fillText(`P = ${totalDsb.toFixed(2)}`, r0Dsb, h - 4)
  ctx.fillText(`P = ${totalSsb.toFixed(2)}`, r0Ssb, h - 4)

  // Ghost outline of AM extent over the DSB and SSB disks, so the size
  // disparity is visually undeniable.
  if (rAm > 0) {
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.40)'
    ctx.setLineDash([4, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(r0Dsb, cy, rAm, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(r0Ssb, cy, rAm, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = 'rgba(220, 38, 38, 0.6)'
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('AM size', r0Dsb, cy - rAm - 4)
    ctx.fillText('AM size', r0Ssb, cy - rAm - 4)
  }
}

function drawAMDonut(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
) {
  if (!colors) return
  if (rOuter <= 0) {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('μ → 0: άπειρη κεραία', cx, cy)
    return
  }

  // Outer disk = total power = carrier (gray) seen as a ring
  ctx.fillStyle = COLOR_CARRIER
  ctx.beginPath()
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2)
  ctx.fill()

  // Inner disk = sidebands. Split into USB (top half) + LSB (bottom half).
  if (rInner > 0) {
    ctx.fillStyle = COLOR_USB
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, rInner, Math.PI, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = COLOR_LSB
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, rInner, 0, Math.PI, false)
    ctx.closePath()
    ctx.fill()
  }

  // Outline
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2)
  ctx.stroke()
  if (rInner > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Carrier label (in the annulus, top)
  ctx.fillStyle = colors.bg
  ctx.font = 'bold 9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const ringMidY = cy - (rOuter + rInner) / 2
  if (rOuter - rInner > 16) {
    ctx.fillText('Carrier', cx, ringMidY + 3)
  }
}

function drawDSBDisk(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  cx: number,
  cy: number,
  r: number,
) {
  if (!colors) return
  if (r <= 0) {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('—', cx, cy)
    return
  }
  ctx.fillStyle = COLOR_USB
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, false)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = COLOR_LSB
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r, 0, Math.PI, false)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
}

function drawSSBDisk(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  cx: number,
  cy: number,
  r: number,
) {
  if (!colors) return
  if (r <= 0) {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('—', cx, cy)
    return
  }
  ctx.fillStyle = COLOR_LSB
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
}
