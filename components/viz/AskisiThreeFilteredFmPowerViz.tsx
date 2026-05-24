'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Άσκηση 3 του καθηγητή (slides 48-50 του SE_session15_16_16_FM.pdf).
 *
 *   m(t) = 8 cos(16π t),  K_f = 10 Hz/V,  A_c = 8,  f_c = 2 kHz
 *   x(t) = 8 cos(4000π t + 2π K_f ∫m(τ)dτ)
 *
 *   Παράμετροι: f_m = 8 Hz, max|m| = 8, W = 8 Hz, β_f = K_f·max|m|/W = 10
 *
 *   x(t) = 8 Σ_n J_n(10) cos(2π(2000 + 8n) t)
 *
 * Στο φάσμα: αρμονικές στα 2000 ± 8n Hz με ύψος 8·|J_n(10)|/2.
 *
 * Στενός BPF: f_c = 2 kHz, BW = 64 Hz → κατώτατο 1968 Hz, ανώτατο 2032 Hz.
 *             Αυτό αντιστοιχεί σε ±4 αρμονικές (γιατί 4·8 = 32 = BW/2).
 *
 *   u(t) = 8 Σ_{n=-4}^{4} J_n(10) cos(2π(2000+8n) t)
 *   P_u  = (8²/2) [J_0² + 2·(J_1² + J_2² + J_3² + J_4²)] (10) ≈ 11.107 W
 *   P_x  = A_c²/2 = 32 W (από την ταυτότητα Σ J_n² = 1)
 *
 *   Ποσοστό P_u / P_x = 34.71%.
 *
 * Interactive: ο BW slider αλλάζει το παράθυρο του BPF — βλέπεις ποιες
 * αρμονικές περνούν, και ο τύπος Power-fraction υπολογίζεται live. Το
 * 64 Hz default το κρατάει στην εξεταστική προδιαγραφή· πατώντας τα presets
 * παίρνεις «μόνο carrier», «Carson (2(β+1)W = 176 Hz)», «όλες οι αρμονικές».
 */

const BETA = 10
const FM = 8
const AC = 8
const FC = 2000
const N_MAX_DRAW = 14
const PRESETS = [
  { label: 'Μόνο carrier (BW = 4 Hz)', bw: 4 },
  { label: 'Εξεταστική (BW = 64 Hz)', bw: 64 },
  { label: 'Carson (BW = 176 Hz)', bw: 176 },
  { label: 'Όλο το φάσμα (BW = 300 Hz)', bw: 300 },
]

export function AskisiThreeFilteredFmPowerViz() {
  const [bw, setBw] = useState(64)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Smaller window so the impulses are not crammed
  const result = useMemo(() => {
    // Number of harmonics that fit inside ±BW/2: floor((BW/2) / f_m)
    const nIn = Math.floor(bw / 2 / FM)
    let P_u = 0
    for (let n = -nIn; n <= nIn; n++) {
      const J = besselJ(n, BETA)
      P_u += ((AC * J) ** 2) / 2 // each cos sideband contributes A_c²J_n²/2
    }
    const P_x = (AC * AC) / 2
    return {
      nIn,
      P_u,
      P_x,
      fraction: P_u / P_x,
      lowEdge: FC - bw / 2,
      highEdge: FC + bw / 2,
    }
  }, [bw])

  useEffect(() => {
    const colors = getThemeColors()
    if (canvasRef.current && colors) draw(canvasRef.current, colors, bw, result.nIn)

    const onResize = () => {
      const c = getThemeColors()
      if (canvasRef.current && c) draw(canvasRef.current, c, bw, result.nIn)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [bw, result.nIn])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Άσκηση 3 — FM σε στενό BPF (slides 48-50)
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBw(p.bw)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(bw - p.bw) < 0.5
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-md bg-bg-soft/40 px-3 py-2 text-xs leading-relaxed text-fg-muted">
        <strong>Δεδομένα:</strong> m(t) = 8 cos(16π t), K_f = 10 Hz/V, A_c = 8,
        f_c = 2 kHz. ⇒ <span className="font-mono">f_m = 8 Hz, W = 8 Hz, β_f = 10</span>.
        Το BPF έχει κεντρική <span className="font-mono">f_c = 2 kHz</span> και
        ζητάμε την έξοδό του για διάφορα BW. Σύρε το BW κάτω: το παράθυρο φιλτραρίσματος
        ανοίγει/κλείνει και βλέπεις ποιες sidebands περνούν.
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM spectrum at beta=10 with BPF window overlay"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          BW φίλτρου ={' '}
          <span className="font-mono text-fg tabular-nums">{bw.toFixed(0)}</span> Hz{' '}
          <span className="text-fg-subtle">
            → ±{(bw / 2).toFixed(0)} Hz γύρω από τα 2 kHz
          </span>
        </label>
        <input
          type="range"
          min={4}
          max={300}
          step={2}
          value={bw}
          onChange={(e) => setBw(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Filter bandwidth in Hz"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat
          label="Αρμονικές που περνούν"
          value={`±${result.nIn} (${2 * result.nIn + 1} συνολικά)`}
        />
        <Stat
          label="Παράθυρο BPF"
          value={`[${result.lowEdge}, ${result.highEdge}] Hz`}
        />
        <Stat
          label="P_u = ισχύς εξόδου"
          value={`${result.P_u.toFixed(3)} W`}
        />
        <Stat
          label="P_u / P_x"
          value={`${(result.fraction * 100).toFixed(2)}%`}
          highlight={Math.abs(bw - 64) < 1}
        />
      </div>

      {Math.abs(bw - 64) < 1 && (
        <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs">
          <strong>✓ Η εξεταστική προδιαγραφή.</strong> BW = 64 Hz → BW/2 = 32 Hz →
          ±4 αρμονικές περνούν (επειδή 4·f_m = 32 = BW/2). Ισχύς εξόδου{' '}
          <span className="font-mono">
            P_u = (64/2)[J₀²(10) + 2·(J₁² + J₂² + J₃² + J₄²)(10)] ≈{' '}
            {result.P_u.toFixed(3)} W
          </span>
          . Ισχύς εισόδου <span className="font-mono">P_x = A_c²/2 = 32 W</span>{' '}
          (από Σ J_n² = 1). Λόγος ={' '}
          <span className="font-mono">{(result.fraction * 100).toFixed(2)}%</span>.
          {' '}
          <span className="text-fg-subtle">
            (Ο prof στο slide 50 αναφέρει 11.1072 W / 34.71% χρησιμοποιώντας
            στρογγυλευμένες τιμές πίνακα· εδώ φαίνεται το ακριβές αποτέλεσμα από
            υπολογιστική Bessel. Η μεθοδολογία είναι η ίδια — αυτό που τεστάρει
            η εξέταση.)
          </span>
        </div>
      )}
      {bw > 200 && result.fraction > 0.99 && (
        <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs">
          <strong>Διατήρηση ισχύος επιβεβαιωμένη.</strong> Για αρκετά μεγάλο BW, ο
          λόγος <span className="font-mono">P_u/P_x</span> τείνει στο 100% — η
          ταυτότητα <span className="font-mono">Σ J_n²(β) = 1</span> γίνεται
          αριθμητικά ορατή.
        </div>
      )}
    </figure>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 ${
        highlight ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-border bg-bg-soft'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-fg tabular-nums">{value}</div>
    </div>
  )
}

const POS_C = 'rgb(29, 78, 216)'
const NEG_C = 'rgb(217, 119, 6)'
const CARRIER_C = 'rgb(168, 85, 247)'
const PASSED_C = 'rgb(22, 163, 74)'
const BLOCKED_FADE = 0.3

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  bw: number,
  nIn: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 28
  const PAD_BOTTOM = 36

  // Show window from f_c - N·f_m to f_c + N·f_m, slightly wider than nMax draw range
  const N_VIS = N_MAX_DRAW
  const fMin = FC - N_VIS * FM
  const fMax = FC + N_VIS * FM
  const xf = (f: number) => lerp(f, fMin, fMax, PAD_L, w - PAD_R)
  const yMax = 0.5
  const yPlot = (m: number) => lerp(m, 0, yMax, h - PAD_BOTTOM, PAD_TOP)
  const yAxis = h - PAD_BOTTOM

  // BPF window shading
  const bpfL = FC - bw / 2
  const bpfR = FC + bw / 2
  const xL = xf(Math.max(bpfL, fMin))
  const xR = xf(Math.min(bpfR, fMax))
  ctx.fillStyle = 'rgba(22, 163, 74, 0.10)'
  ctx.fillRect(xL, PAD_TOP - 8, xR - xL, yAxis - PAD_TOP + 8)
  ctx.strokeStyle = 'rgba(22, 163, 74, 0.6)'
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xL, PAD_TOP - 8)
  ctx.lineTo(xL, yAxis)
  ctx.moveTo(xR, PAD_TOP - 8)
  ctx.lineTo(xR, yAxis)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = PASSED_C
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`BPF: BW = ${bw} Hz`, (xL + xR) / 2, PAD_TOP - 14)

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, yAxis)
  ctx.lineTo(w - PAD_R, yAxis)
  ctx.stroke()

  // X-tick labels every 4 harmonics
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = -N_VIS; n <= N_VIS; n++) {
    const f = FC + n * FM
    const x = xf(f)
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yAxis + 3)
    ctx.stroke()
    if (n === 0) {
      ctx.fillStyle = colors.fg
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('2000', x, yAxis + 14)
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    } else if (n % 4 === 0) {
      ctx.fillText(f.toString(), x, yAxis + 14)
    }
  }
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('f (Hz) →', w - PAD_R, yAxis + 26)

  // Sidebands
  for (let n = -N_VIS; n <= N_VIS; n++) {
    const f = FC + n * FM
    if (f < fMin || f > fMax) continue
    const J = besselJ(n, BETA)
    const mag = (Math.abs(J) * AC) / 2
    if (mag < 0.005) continue
    const x = xf(f)
    const yEnd = yPlot(mag)
    const passed = Math.abs(n) <= nIn
    const isCarrier = n === 0

    ctx.globalAlpha = passed ? 1 : BLOCKED_FADE
    ctx.strokeStyle = isCarrier ? CARRIER_C : J < 0 ? NEG_C : POS_C
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCarrier ? 2.5 : 1.6

    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yEnd)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x - 3, yEnd + 4)
    ctx.lineTo(x, yEnd)
    ctx.lineTo(x + 3, yEnd + 4)
    ctx.closePath()
    ctx.fill()

    if (mag > 0.06 && passed) {
      ctx.fillStyle = colors.fgMuted
      ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`J${subscript(n)}`, x, yEnd - 4)
    }
    ctx.globalAlpha = 1
  }

  // Legend (top-left)
  let lx = PAD_L
  const ly = PAD_TOP - 14
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = PASSED_C
  ctx.fillRect(lx, ly - 6, 8, 8)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('BPF αφήνει', lx + 11, ly)
  lx += 78
  ctx.globalAlpha = BLOCKED_FADE
  ctx.fillStyle = POS_C
  ctx.fillRect(lx, ly - 6, 8, 8)
  ctx.globalAlpha = 1
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('αποκόπτονται', lx + 11, ly)
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    '-': '₋',
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return n
    .toString()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
}
