'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * The canonical FDM exam problem made visual.
 *
 *   m(t) = sinc(2Wt)   →   M(f) is a RECT of width 2W centered at 0
 *   k(t) = Π(4Wt)       →   K(f) is a SINC of effective bandwidth ~4W (first null)
 *
 * Two carriers f_1, f_2. Toggle DSB-SC vs USSB. Slider for the spacing
 * f_2 - f_1 in units of W. The viz draws four stacked panels showing the
 * step-by-step solution structure:
 *
 *   (1) Baseband M(f) (rect) at f_1's "color band"
 *   (2) Baseband K(f) (sinc) at f_2's "color band"
 *   (3) After modulation: the two spectra placed at ±f_1 and ±f_2
 *   (4) Combined G(f) — with overlap detection (red highlight if collision)
 *
 * Verdict footer states the min spacing condition the student would write
 * on their exam: USSB needs f_2 - f_1 ≥ W (for the m channel) + W_k (for k),
 * but since k is broader, the bottleneck for USSB is "f_2 ≥ f_1 + W"
 * which means f_2 - f_1 ≥ W when f_2 > f_1. For DSB-SC: f_2 - f_1 ≥ W + W_k.
 *
 * Pedagogical claim: this is the single highest-frequency exam problem in
 * the K21 corpus (Πρόοδος A Θ3 / Πρόοδος B Θ3 / Jan'26 Θ3 / June'25 Θ2 /
 * Πρόοδος April'26 Θ3). Walking through this viz step-by-step IS the exam
 * solution.
 *
 * ── PARAMETERIZATION (DRAW phase, §5.B/§5.C of plans/DRAW_PROBLEM_AUDIT.md) ──
 * The whole FDM/DSB-SC exam cluster (pa25-th3-mux, jan26-th3-mux, proodos26-11,
 * proodos26-13, pb25-th3-mux, jun25-th2, jan26-th2-8) is the SAME 4-panel answer
 * with different baseband shapes / bandwidths / per-channel modulation. The
 * optional props below let each later (A) wire render its exact draw-answer.
 *
 *   mBW         m-channel baseband half-BW, in units of W            (default 1.0)
 *   kBW         k-channel baseband half-BW, in units of W            (default 2.0)
 *   kShape      k-channel baseband shape: 'sinc'|'triangle'|'rect'   (default 'sinc')
 *   kMod        k-channel modulation override: 'same'|'am-conventional' (default 'same')
 *   numChannels 1 ⇒ m-channel only (hide K panel, label final X(f)); 2 (default)
 *   initialMod  starting toggle position 'ssb'|'dsb'                  (default 'ssb')
 *
 * LOAD-BEARING INVARIANT: omitting ALL props reproduces the original render
 * byte-for-byte (the live am/multiplexing theory page mounts this prop-less).
 * Every default is chosen so the prop-less path calls the same draw routines
 * with the same numbers as before this extension.
 */

type ModType = 'dsb' | 'ssb'
type KShape = 'sinc' | 'triangle' | 'rect'
type KMod = 'same' | 'am-conventional'

const F1 = 3.0 // anchored carrier-1 position (in units of W)

export interface FdmCanonicalProblemVizProps {
  /** m-channel baseband half-bandwidth, in units of W. Default 1.0 (m = sinc(2Wt) → rect ±W). */
  mBW?: number
  /** k-channel baseband half-bandwidth, in units of W. Default 2.0 (k = Π(4Wt) → sinc, first null 4W). */
  kBW?: number
  /** k-channel baseband shape. Default 'sinc'. */
  kShape?: KShape
  /** k-channel modulation override. 'am-conventional' adds a carrier impulse at ±f₂. Default 'same'. */
  kMod?: KMod
  /** Number of FDM channels. 1 ⇒ render the m-channel only (single DSB-SC/USSB answer). Default 2. */
  numChannels?: 1 | 2
  /** Initial DSB/USSB toggle position. Default 'ssb' (preserves original start). */
  initialMod?: ModType
}

export function FdmCanonicalProblemViz({
  mBW = 1.0,
  kBW = 2.0,
  kShape = 'sinc',
  kMod = 'same',
  numChannels = 2,
  initialMod = 'ssb',
}: FdmCanonicalProblemVizProps) {
  const [spacing, setSpacing] = useState(5.0) // f_2 - f_1 in units of W
  const [modType, setModType] = useState<ModType>(initialMod)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const mHalfBW = mBW
  const kHalfBW = kBW

  // True only for the prop-less canonical mount (the live theory page). Gates the
  // signal-specific chrome strings so the default render stays byte-for-byte while
  // wired mounts get generic, correct labels.
  const isCanonicalDefault =
    mBW === 1.0 && kBW === 2.0 && kShape === 'sinc' && kMod === 'same' && numChannels === 2

  // Minimum non-overlap spacing depends on mode AND on which channel is which.
  // For USSB (upper sideband only on the +f side):
  //   channel 1 occupies [f_1, f_1 + W_m]
  //   channel 2 occupies [f_2, f_2 + W_k]   (only when k is single-sideband)
  //   condition: f_2 ≥ f_1 + W_m (independent of W_k because channel 2 starts at f_2)
  // For DSB-SC (or conventional AM on k, which is inherently double-sideband):
  //   channel 1 occupies [f_1 - W_m, f_1 + W_m]
  //   channel 2 occupies [f_2 - W_k, f_2 + W_k]
  //   condition: f_2 - W_k ≥ f_1 + W_m → f_2 - f_1 ≥ W_m + W_k
  const kSingleSided = modType === 'ssb' && kMod === 'same'
  const minSpacing = kSingleSided ? mHalfBW : mHalfBW + kHalfBW
  const overlapping = numChannels === 2 && spacing < minSpacing

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors)
      drawScene(canvas, colors, { spacing, modType, mHalfBW, kHalfBW, kShape, kMod, numChannels })
  }, [spacing, modType, mHalfBW, kHalfBW, kShape, kMod, numChannels])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors)
        drawScene(canvas, colors, { spacing, modType, mHalfBW, kHalfBW, kShape, kMod, numChannels })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [spacing, modType, mHalfBW, kHalfBW, kShape, kMod, numChannels])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      {isCanonicalDefault ? (
        <>
          <h4 className="mb-1 text-sm font-semibold tracking-tight">
            Η canonical εξεταστική άσκηση — m(t) = sinc(2Wt), k(t) = Π(4Wt) σε δύο φέροντα
          </h4>
          <p className="mb-3 text-xs text-fg-muted">
            Δύο μηνύματα διαφορετικού σχήματος, διαφορετικής bandwidth — το{' '}
            <span className="font-mono">m</span> γίνεται <strong>rect</strong> στο πεδίο
            συχνότητας, το <span className="font-mono">k</span> γίνεται <strong>sinc</strong>{' '}
            (πιο πλατύ). Σύρε την απόσταση των δύο φερόντων και δες σε ποια συνθήκη τα δύο
            κανάλια <em>μόλις</em> πάψουν να συγκρούονται.
          </p>
        </>
      ) : numChannels === 1 ? (
        <>
          <h4 className="mb-1 text-sm font-semibold tracking-tight">
            Φάσμα ενός καναλιού — το baseband M(f) ανεβαίνει στο φέρον
          </h4>
          <p className="mb-3 text-xs text-fg-muted">
            Το baseband <span className="font-mono">M(f)</span> ανεβαίνει στο φέρον{' '}
            <span className="font-mono">f_c</span>. Δες το διαμορφωμένο φάσμα{' '}
            <span className="font-mono">X(f)</span> — δύο μετατοπισμένα αντίγραφα στα{' '}
            <span className="font-mono">±f_c</span>.
          </p>
        </>
      ) : (
        <>
          <h4 className="mb-1 text-sm font-semibold tracking-tight">
            Πολυπλεξία FDM — η draw-απάντηση σχηματικά
          </h4>
          <p className="mb-3 text-xs text-fg-muted">
            Δύο baseband μηνύματα ανεβαίνουν σε δύο φέροντα{' '}
            <span className="font-mono">f₁, f₂</span>. Σύρε την απόστασή τους και δες πότε τα
            δύο κανάλια <em>μόλις</em> πάψουν να επικαλύπτονται στο{' '}
            <span className="font-mono">G(f)</span>.
          </p>
        </>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Modulation scheme"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            numChannels === 1
              ? [
                  { id: 'ssb' as ModType, label: 'USSB' },
                  { id: 'dsb' as ModType, label: 'DSB-SC' },
                ]
              : [
                  { id: 'ssb' as ModType, label: 'USSB (κάθε κανάλι ~W ή W_k)' },
                  { id: 'dsb' as ModType, label: 'DSB-SC (κάθε κανάλι 2W ή 2W_k)' },
                ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={modType === opt.id}
              onClick={() => setModType(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                modType === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Step-by-step FDM canonical problem: baseband, modulated, combined spectrum"
      />

      {numChannels === 2 && (
        <div className="mt-3">
          <label className="block text-xs text-fg-muted">
            Απόσταση φερόντων Δf = f₂ − f₁ ={' '}
            <span className="font-mono text-fg tabular-nums">{spacing.toFixed(2)} W</span>
            {' · '}
            ελάχιστο για μη-σύγκρουση:{' '}
            <span className="font-mono">
              {isCanonicalDefault
                ? modType === 'ssb'
                  ? 'W'
                  : `W + W_k = ${(mHalfBW + kHalfBW).toFixed(0)}W`
                : kSingleSided
                  ? fmtWcoef(minSpacing)
                  : `W_m + W_k = ${fmtWcoef(minSpacing)}`}
            </span>
            {' · '}
            {overlapping ? (
              <span className="font-semibold text-red-600 dark:text-red-400">
                ⚠ Επικάλυψη (κόκκινη ζώνη στο G(f))
              </span>
            ) : (
              <span className="text-green-700 dark:text-green-400">Καθαρός διαχωρισμός</span>
            )}
          </label>
          <input
            type="range"
            min={0.5}
            max={6}
            step={0.05}
            value={spacing}
            onChange={(e) => setSpacing(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Δf carrier spacing in units of W"
          />
        </div>
      )}

      {numChannels === 2 && (
        <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
          <strong>Το exam template σε 4 βήματα:</strong>{' '}
          (1) Σχεδίασε <span className="font-mono">M(f)</span> (rect) και{' '}
          <span className="font-mono">K(f)</span> (sinc) στο baseband.{' '}
          (2) Modulation theorem → <em>shift</em> κάθε baseband στο ±f<sub>c</sub>.{' '}
          (3) Απαίτησε την μικρότερη <span className="font-mono">Δf</span> ώστε οι δύο
          υποστηρίξεις (supports) να μην τέμνονται.{' '}
          (4) Σχεδίασε το <span className="font-mono">G(f) = X_m(f) + X_k(f)</span>.{' '}
          Η μόνη διαφορά μεταξύ DSB και USSB είναι ότι το DSB έχει διπλάσιο εύρος ανά
          κανάλι (κάτι sideband + πάνω sideband, αντί για μόνο πάνω).
        </div>
      )}
    </figure>
  )
}

/** Formats a multiple of W, dropping a coefficient of 1: 1→"W", 0.5→"0.5W", 4→"4W". */
function fmtWcoef(x: number): string {
  const v = +x.toFixed(2)
  return v === 1 ? 'W' : `${v}W`
}

const COLOR_M = 'rgb(29, 78, 216)' // blue
const FILL_M = 'rgba(29, 78, 216, 0.30)'
const COLOR_K = 'rgb(217, 119, 6)' // amber
const FILL_K = 'rgba(217, 119, 6, 0.30)'
const COLOR_OVERLAP = 'rgba(220, 38, 38, 0.55)'

type DrawOpts = {
  spacing: number
  modType: ModType
  mHalfBW: number
  kHalfBW: number
  kShape: KShape
  kMod: KMod
  numChannels: 1 | 2
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  opts: DrawOpts,
) {
  if (!colors) return
  const { spacing, modType, mHalfBW, kHalfBW, kShape, kMod, numChannels } = opts
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 32
  const PAD_TOP = 14
  const PAD_BOT = 14

  // 2-channel: 4 stacked panels (M baseband, K baseband, modulated, combined G(f)).
  // 1-channel: 3 stacked panels (M baseband, modulated, X(f)) — the K baseband is hidden.
  const nPanels = numChannels === 1 ? 3 : 4
  const panelGap = 6
  const panelH = (h - PAD_TOP - PAD_BOT - (nPanels - 1) * panelGap) / nPanels
  const panelTops = Array.from(
    { length: nPanels },
    (_, i) => PAD_TOP + i * (panelH + panelGap),
  )

  const f2 = F1 + spacing
  // Frequency axis range: include both sides for the modulated/combined panels.
  // CRITICAL (§5.B item 1): scale off the kBW PROP, not a hardcoded constant — with
  // kBW=4 a hardcoded W_K=2 would clip k's outer sinc lobes (canvas would only reach
  // f2+3 instead of f2+5). With 1 unit of margin past k's outer edge it stays unclipped.
  const fMaxModulated = numChannels === 1 ? F1 + mHalfBW + 1 : f2 + kHalfBW + 1
  // Use the same x-mapping for ALL panels so spectra align visually
  const fMin = -fMaxModulated
  const fMax = fMaxModulated
  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)

  // k is "double-sided" (bands centered on ±f2) for DSB-SC and for conventional AM
  // (which is inherently double-sideband). USSB draws only the upper sideband band.
  const kDoubleSided = modType === 'dsb' || kMod === 'am-conventional'

  // ── shared channel painters ─────────────────────────────────────────────
  const drawMChannel = (yTop: number) => {
    if (modType === 'ssb') {
      // USSB: only the upper sideband; on + side that's [f, f+W_m]; mirror on - side
      drawRect(ctx, xt, yTop, panelH, F1, F1 + mHalfBW, 0.95, COLOR_M, FILL_M)
      drawRect(ctx, xt, yTop, panelH, -F1 - mHalfBW, -F1, 0.95, COLOR_M, FILL_M)
    } else {
      // DSB-SC: full ±W_m around the carrier
      drawRect(ctx, xt, yTop, panelH, F1 - mHalfBW, F1 + mHalfBW, 0.9, COLOR_M, FILL_M)
      drawRect(ctx, xt, yTop, panelH, -F1 - mHalfBW, -F1 + mHalfBW, 0.9, COLOR_M, FILL_M)
    }
  }

  const drawKChannel = (yTop: number) => {
    if (!kDoubleSided) {
      // USSB single sideband, peak at the carrier-adjacent edge
      if (kShape === 'sinc') {
        drawSincBand(ctx, xt, yTop, panelH, f2, f2 + kHalfBW, 0.95, COLOR_K, FILL_K)
        drawSincBand(ctx, xt, yTop, panelH, -f2 - kHalfBW, -f2, 0.95, COLOR_K, FILL_K)
      } else if (kShape === 'triangle') {
        drawTriangleBand(ctx, xt, yTop, panelH, f2, f2 + kHalfBW, 0.95, COLOR_K, FILL_K)
        drawTriangleBand(ctx, xt, yTop, panelH, -f2, -f2 - kHalfBW, 0.95, COLOR_K, FILL_K)
      } else {
        drawRect(ctx, xt, yTop, panelH, f2, f2 + kHalfBW, 0.95, COLOR_K, FILL_K)
        drawRect(ctx, xt, yTop, panelH, -f2 - kHalfBW, -f2, 0.95, COLOR_K, FILL_K)
      }
    } else {
      // double sideband: centered bands at ±f2
      if (kShape === 'sinc') {
        drawSinc(ctx, xt, yTop, panelH, f2, kHalfBW, 0.9, COLOR_K, FILL_K)
        drawSinc(ctx, xt, yTop, panelH, -f2, kHalfBW, 0.9, COLOR_K, FILL_K)
      } else if (kShape === 'triangle') {
        drawTriangle(ctx, xt, yTop, panelH, f2, kHalfBW, 0.9, COLOR_K, FILL_K)
        drawTriangle(ctx, xt, yTop, panelH, -f2, kHalfBW, 0.9, COLOR_K, FILL_K)
      } else {
        drawRect(ctx, xt, yTop, panelH, f2 - kHalfBW, f2 + kHalfBW, 0.9, COLOR_K, FILL_K)
        drawRect(ctx, xt, yTop, panelH, -f2 - kHalfBW, -f2 + kHalfBW, 0.9, COLOR_K, FILL_K)
      }
      // conventional AM: add the carrier impulse (delta) at ±f2
      if (kMod === 'am-conventional') {
        drawImpulse(ctx, xt, yTop, panelH, f2, COLOR_K)
        drawImpulse(ctx, xt, yTop, panelH, -f2, COLOR_K)
      }
    }
  }

  const drawCarrierTicks = (yTop: number, withK: boolean) => {
    const yLab = yTop + panelH - 4
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = COLOR_M
    if (numChannels === 1) {
      ctx.fillText('f_c', xt(F1), yLab)
      ctx.fillText('-f_c', xt(-F1), yLab)
    } else {
      ctx.fillText('f₁', xt(F1), yLab)
      ctx.fillText('-f₁', xt(-F1), yLab)
    }
    if (withK) {
      ctx.fillStyle = COLOR_K
      ctx.fillText('f₂', xt(f2), yLab)
      ctx.fillText('-f₂', xt(-f2), yLab)
    }
  }

  const drawOverlapBands = (yTop: number) => {
    const mUpper = F1 + mHalfBW
    const kLower = kSingleSidedDraw(modType, kMod) ? f2 : f2 - kHalfBW
    if (mUpper > kLower) {
      drawOverlap(ctx, xt, yTop, panelH, kLower, mUpper)
      drawOverlap(ctx, xt, yTop, panelH, -mUpper, -kLower)
    }
  }

  // ── panel titles (default strings preserved byte-for-byte) ──────────────
  const mTitle =
    mHalfBW === 1.0
      ? 'Baseband: M(f) = rect (από m(t) = sinc(2Wt))'
      : `Baseband: M(f) = rect (μισό-εύρος ${fmtWcoef(mHalfBW)})`

  const kTitle =
    kShape === 'sinc' && kHalfBW === 2.0
      ? 'Baseband: K(f) = sinc (από k(t) = Π(4Wt))'
      : kShape === 'sinc'
        ? 'Baseband: K(f) = sinc'
        : kShape === 'triangle'
          ? 'Baseband: K(f) = τρίγωνο (από sinc²)'
          : 'Baseband: K(f) = rect'

  const kBracketLabel =
    kShape === 'sinc'
      ? `2W_k = ${fmtWcoef(2 * kHalfBW)} (πρώτο null)`
      : kShape === 'triangle'
        ? `βάση 2W_k = ${fmtWcoef(2 * kHalfBW)}`
        : `εύρος 2W_k = ${fmtWcoef(2 * kHalfBW)}`

  const modTitle =
    modType === 'ssb'
      ? numChannels === 1
        ? 'Modulated USSB: το m στα ±f_c'
        : 'Modulated USSB: το m στα ±f₁, το k στα ±f₂'
      : numChannels === 1
        ? 'Modulated DSB-SC: m γύρω από ±f_c'
        : 'Modulated DSB-SC: m γύρω από ±f₁, k γύρω από ±f₂'

  if (numChannels === 1) {
    // Panel 0: M(f) baseband — rect from -W_m to W_m
    drawPanel(ctx, colors, panelTops[0], panelH, w, mTitle, () => {
      drawRect(ctx, xt, panelTops[0], panelH, -mHalfBW, mHalfBW, 1.0, COLOR_M, FILL_M)
      labelBracket(
        ctx, colors, xt(-mHalfBW), xt(mHalfBW), panelTops[0] + panelH - 14,
        fmtWcoef(2 * mHalfBW), COLOR_M,
      )
    }, xt, fMin, fMax)

    // Panel 1: modulated single channel
    drawPanel(ctx, colors, panelTops[1], panelH, w, modTitle, () => {
      drawMChannel(panelTops[1])
      drawCarrierTicks(panelTops[1], false)
    }, xt, fMin, fMax)

    // Panel 2: X(f) — the final single-channel answer (same spectrum, labeled)
    drawPanel(ctx, colors, panelTops[2], panelH, w, 'X(f) = το διαμορφωμένο φάσμα', () => {
      drawMChannel(panelTops[2])
    }, xt, fMin, fMax)
    return
  }

  // ── 2-channel layout (default) ──────────────────────────────────────────

  // Panel 1: M(f) at baseband — rect from -W to W
  drawPanel(ctx, colors, panelTops[0], panelH, w, mTitle, () => {
    drawRect(ctx, xt, panelTops[0], panelH, -mHalfBW, mHalfBW, 1.0, COLOR_M, FILL_M)
    labelBracket(
      ctx, colors, xt(-mHalfBW), xt(mHalfBW), panelTops[0] + panelH - 14,
      mHalfBW === 1.0 ? '2W' : fmtWcoef(2 * mHalfBW), COLOR_M,
    )
  }, xt, fMin, fMax)

  // Panel 2: K(f) at baseband — shape per kShape
  drawPanel(ctx, colors, panelTops[1], panelH, w, kTitle, () => {
    if (kShape === 'sinc') {
      drawSinc(ctx, xt, panelTops[1], panelH, 0, kHalfBW, 1.0, COLOR_K, FILL_K)
    } else if (kShape === 'triangle') {
      drawTriangle(ctx, xt, panelTops[1], panelH, 0, kHalfBW, 1.0, COLOR_K, FILL_K)
    } else {
      drawRect(ctx, xt, panelTops[1], panelH, -kHalfBW, kHalfBW, 1.0, COLOR_K, FILL_K)
    }
    labelBracket(
      ctx, colors, xt(-kHalfBW), xt(kHalfBW), panelTops[1] + panelH - 14, kBracketLabel, COLOR_K,
    )
  }, xt, fMin, fMax)

  // Panel 3: After modulation — each baseband shifted to ±f_c
  drawPanel(ctx, colors, panelTops[2], panelH, w, modTitle, () => {
    drawMChannel(panelTops[2])
    drawKChannel(panelTops[2])
    drawCarrierTicks(panelTops[2], true)
  }, xt, fMin, fMax)

  // Panel 4: Combined G(f) — with overlap detection
  drawPanel(ctx, colors, panelTops[3], panelH, w, 'Πολυπλεγμένο: G(f) = X_m(f) + X_k(f)', () => {
    drawMChannel(panelTops[3])
    drawKChannel(panelTops[3])
    drawOverlapBands(panelTops[3])
  }, xt, fMin, fMax)
}

/** Whether k occupies only its upper sideband (USSB and not forced double-sided by AM). */
function kSingleSidedDraw(modType: ModType, kMod: KMod): boolean {
  return modType === 'ssb' && kMod === 'same'
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  title: string,
  body: () => void,
  xt: (f: number) => number,
  fMin: number,
  fMax: number,
) {
  if (!colors) return
  // Panel background
  ctx.fillStyle = 'rgba(100, 116, 139, 0.05)'
  ctx.fillRect(18, yTop, w - 36, panelH)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(18, yTop, w - 36, panelH)

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, 24, yTop + 11)

  // X axis at panel bottom + arrow
  const yAxis = yTop + panelH - 22
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yAxis)
  ctx.lineTo(xt(fMax), yAxis)
  ctx.stroke()
  // f=0 vertical guide line
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xt(0), yTop + 16)
  ctx.lineTo(xt(0), yAxis)
  ctx.stroke()

  body()
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fLeft: number,
  fRight: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yPeak = yTop + 18 + (1 - height) * (yAxis - yTop - 18)
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  ctx.lineTo(xt(fLeft), yPeak)
  ctx.lineTo(xt(fRight), yPeak)
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/** Draws a centered sinc bump at f0 with width parameter W_eff (first-null half-width). */
function drawSinc(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  f0: number,
  Weff: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const STEPS = 200
  const fLeft = f0 - Weff
  const fRight = f0 + Weff
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fLeft, fRight)
    const x = (f - f0) / Weff
    let v: number
    if (Math.abs(x) < 1e-6) {
      v = 1
    } else {
      v = Math.sin(Math.PI * x) / (Math.PI * x)
    }
    // Take absolute value as magnitude spectrum (sketch); clip negatives so
    // the visual stays clean and the rectified shape matches the typical
    // exam-board drawing.
    v = Math.abs(v)
    const y = yTopUsable + (1 - v * height) * (yAxis - yTopUsable)
    ctx.lineTo(xt(f), y)
  }
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/** Draws the +carrier side of an SSB-shifted sinc: only positive half of the lobe. */
function drawSincBand(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fLeft: number,
  fRight: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const STEPS = 150
  const width = fRight - fLeft
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fLeft, fRight)
    // Use a half-sinc shape: peak at fLeft, descending to 0 at fRight, with
    // sinc-style lobe oscillation in the middle. Sketch-grade — emphasizes
    // "starts at peak, narrows to null".
    const t = (f - fLeft) / width
    const x = t * 2.0 // first null at t=0.5 ⇒ x=1
    const v = Math.abs(t < 1e-6 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x))
    const y = yTopUsable + (1 - v * height) * (yAxis - yTopUsable)
    ctx.lineTo(xt(f), y)
  }
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/**
 * Draws a centered symmetric triangle (tent) at f0 with half-base Weff — the
 * sinc² → tri(f/W) magnitude shape. Peak `height` at f0, linear down to 0 at f0±Weff.
 */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  f0: number,
  Weff: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const yPeak = yTopUsable + (1 - height) * (yAxis - yTopUsable)
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(f0 - Weff), yAxis)
  ctx.lineTo(xt(f0), yPeak)
  ctx.lineTo(xt(f0 + Weff), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/**
 * Draws a right-triangle band: the USSB half of a tent baseband. Vertical edge at
 * `fPeak` (the carrier-adjacent edge, peak `height`), hypotenuse down to 0 at `fZero`.
 */
function drawTriangleBand(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fPeak: number,
  fZero: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const yPeak = yTopUsable + (1 - height) * (yAxis - yTopUsable)
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fPeak), yAxis)
  ctx.lineTo(xt(fPeak), yPeak)
  ctx.lineTo(xt(fZero), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/**
 * Draws a carrier impulse (delta) as a vertical arrow at f0 — the discrete carrier
 * line of conventional AM, drawn taller than the message sidebands to read as a δ.
 */
function drawImpulse(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  f0: number,
  color: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const x = xt(f0)
  const yTip = yTopUsable + 2
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(x, yAxis)
  ctx.lineTo(x, yTip)
  ctx.stroke()
  // arrowhead
  ctx.beginPath()
  ctx.moveTo(x, yTip - 4)
  ctx.lineTo(x - 3, yTip + 2)
  ctx.lineTo(x + 3, yTip + 2)
  ctx.closePath()
  ctx.fill()
}

function drawOverlap(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fStart: number,
  fEnd: number,
) {
  const yAxis = yTop + panelH - 22
  const yPeak = yTop + 12
  ctx.fillStyle = COLOR_OVERLAP
  ctx.fillRect(xt(fStart), yPeak, xt(fEnd) - xt(fStart), yAxis - yPeak)
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 1
  ctx.strokeRect(xt(fStart), yPeak, xt(fEnd) - xt(fStart), yAxis - yPeak)
}

function labelBracket(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x1: number,
  x2: number,
  y: number,
  label: string,
  color: string,
) {
  if (!colors) return
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x1, y - 3)
  ctx.lineTo(x1, y + 3)
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.moveTo(x2, y - 3)
  ctx.lineTo(x2, y + 3)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, (x1 + x2) / 2, y - 5)
}
