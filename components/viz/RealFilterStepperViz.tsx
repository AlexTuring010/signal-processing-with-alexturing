'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Real LP filter — 5-stage progressive buildup matching slides 42-46 of
 * SE_session7&8_theory_2025.pdf.
 *
 * Stage 1/5 (slide 42): passband ripple — passband only, ±δ_p tolerance.
 * Stage 2/5 (slide 43): + transition band ζώνη μετάβασης from f_p to f_s.
 * Stage 3/5 (slide 44): + stopband ζώνη αποκοπής with ±δ_s ripple.
 * Stage 4/5 (slide 45): + the three labelled zones (passband, transition,
 *                       stopband) annotated under the f-axis.
 * Stage 5/5 (slide 46): + dB-gain toggle — 20·log₁₀|H(f)|.
 *
 * The shape itself is the same at all 5 stages (a cosine-rolloff with
 * pass/stop ripple); what evolves is what's REVEALED on the plot:
 * which bands are shaded, which labels are visible, and whether the
 * y-axis is linear or in dB.
 */

const FP = 1.0
const FS = 1.6
const DP = 0.06
const DS = 0.05
const F_MIN = -2.5
const F_MAX = 2.5

const REAL_C = 'rgb(217, 119, 6)' // amber
const IDEAL_C = 'rgb(29, 78, 216)' // accent blue
const RIPPLE_C = 'rgb(168, 85, 247)' // violet
const TRANS_C = 'rgb(14, 165, 233)' // sky
const STOP_C = 'rgb(220, 38, 38)' // red

const STAGES = [
  {
    id: 1,
    title: 'Stage 1/5 — ζώνη διέλευσης (slide 42)',
    caption:
      'Στην πράξη το |H(f)| δεν είναι σταθερό 1 — ταλαντώνεται ανάμεσα σε 1−δ_p και 1+δ_p μέσα στη ζώνη διέλευσης. Αυτή είναι η passband ripple δ_p.',
  },
  {
    id: 2,
    title: 'Stage 2/5 — + ζώνη μετάβασης (slide 43)',
    caption:
      'Από f_p μέχρι f_s υπάρχει η ζώνη μετάβασης (transition band) — εκεί η απόκριση πέφτει από κοντά στο 1 σε κοντά στο 0. Δεν δίνουμε spec εκεί.',
  },
  {
    id: 3,
    title: 'Stage 3/5 — + ζώνη αποκοπής (slide 44)',
    caption:
      'Πέρα από f_s η απόκριση είναι σχεδόν 0 αλλά ποτέ ακριβώς 0 — ταλαντώνεται κάτω από δ_s. Αυτή είναι η stopband ripple δ_s.',
  },
  {
    id: 4,
    title: 'Stage 4/5 — τα τρία τμήματα μαζί (slide 45)',
    caption:
      'Τα δ_p και δ_s καθορίζουν την κυμάτωση (ripple). Τα τρία τμήματα — διέλευση, μετάβαση, αποκοπή — είναι η πλήρης περιγραφή του ρεαλιστικού LP.',
  },
  {
    id: 5,
    title: 'Stage 5/5 — κέρδος σε dB (slide 46)',
    caption:
      'Στις προδιαγραφές βλέπεις συχνά το κέρδος σε dB: 20·log₁₀|H(f)|. Η passband γίνεται ~0 dB· η stopband attenuation εκφράζεται ως −X dB (π.χ. «60 dB stopband»). Ενεργοποίησε το toggle.',
  },
]

const PAD = 24

function realLpResponse(f: number): number {
  const a = Math.abs(f)
  if (a <= FP) {
    return 1 + DP * Math.cos(2 * Math.PI * 3 * a)
  }
  if (a >= FS) {
    return Math.max(0, DS * Math.cos(2 * Math.PI * 2.4 * a))
  }
  // transition: smooth cosine roll-off
  const u = (a - FP) / (FS - FP)
  return 0.5 * (1 + Math.cos(Math.PI * u))
}

export function RealFilterStepperViz() {
  const [stage, setStage] = useState(1)
  const [dbMode, setDbMode] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, stage, dbMode && stage === 5)
  }, [stage, dbMode])

  const currentStage = STAGES[stage - 1]

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πραγματικό LP — κτίσιμο 5 βημάτων κατά τη διάλεξη (slides 42-46)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Οι διαφάνειες χτίζουν το πραγματικό LP σταδιακά. Κάθε στάδιο αποκαλύπτει μία
        ακόμα προδιαγραφή. Πάτα τα κουμπιά για να δεις πώς εμφανίζονται με τη σειρά.
      </p>

      <div
        role="radiogroup"
        aria-label="Stage selector"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={stage === s.id}
            onClick={() => setStage(s.id)}
            className={cn(
              'rounded px-2.5 py-0.5 transition-colors',
              stage === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {s.id}/5
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Real LP filter response, progressive buildup"
      />

      {stage === 5 && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-bg-soft px-3 py-1.5 text-xs">
          <label className="font-medium text-fg">Άξονας Y:</label>
          <button
            type="button"
            onClick={() => setDbMode(false)}
            className={cn(
              'rounded px-2 py-0.5 transition',
              !dbMode ? 'bg-accent text-accent-fg' : 'text-fg-muted',
            )}
          >
            Linear |H(f)|
          </button>
          <button
            type="button"
            onClick={() => setDbMode(true)}
            className={cn(
              'rounded px-2 py-0.5 transition',
              dbMode ? 'bg-accent text-accent-fg' : 'text-fg-muted',
            )}
          >
            dB: 20·log₁₀|H(f)|
          </button>
        </div>
      )}

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs leading-relaxed">
        <div className="font-semibold text-fg">{currentStage.title}</div>
        <div className="mt-1 text-fg-muted">{currentStage.caption}</div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  stage: number,
  dbMode: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Y-axis bounds depend on mode
  const yMin = dbMode ? -65 : -0.2
  const yMax = dbMode ? 8 : 1.45

  const xt = (f: number) => lerp(f, F_MIN, F_MAX, PAD, w - PAD)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD + 16, h - PAD - 28)
  const yZero = yv(dbMode ? 0 : 0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yZero)
  ctx.lineTo(w - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD + 16)
  ctx.lineTo(xt(0), h - PAD - 28)
  ctx.stroke()

  // dB mode: dashed grid lines at -20/-40/-60, plus a 0 dB label on the
  // reference line. Labels are left-aligned just inside the left edge and sit
  // just above each line, so the leading minus sign is never clipped. (They
  // used to be right-aligned at PAD-3, where "-60 dB" overflowed past the left
  // canvas edge and hid the minus sign off-screen.)
  if (dbMode) {
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 4])
    ctx.lineWidth = 1
    for (const db of [-20, -40, -60]) {
      ctx.beginPath()
      ctx.moveTo(PAD, yv(db))
      ctx.lineTo(w - PAD, yv(db))
      ctx.stroke()
    }
    ctx.setLineDash([])
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    // negative attenuation gridlines — subtle grey
    ctx.fillStyle = colors.fgSubtle
    for (const db of [-20, -40, -60]) {
      ctx.fillText(`${db} dB`, PAD + 3, yv(db) - 3)
    }
    // 0 dB reference — bold and coloured like the dashed reference line it sits
    // on, so it reads clearly as THE 0 dB level (where the passband sits), not
    // just another gridline tick
    ctx.fillStyle = IDEAL_C
    ctx.font = 'bold 9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('0 dB', PAD + 3, yv(0) - 3)
  } else {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('1', PAD - 3, yv(1) + 3)
    ctx.fillText('0', PAD - 3, yv(0) + 3)
  }

  // Stage-dependent band shading (under the curve)
  // Stage 1+: passband ripple band
  if (stage >= 1 && !dbMode) {
    ctx.fillStyle = `rgba(${getRGB(RIPPLE_C)}, 0.20)`
    ctx.fillRect(xt(-FP), yv(1 + DP), xt(FP) - xt(-FP), yv(1 - DP) - yv(1 + DP))
    ctx.fillStyle = colors.fgMuted
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('1+δ_p', PAD + 4, yv(1 + DP) - 2)
    ctx.fillText('1−δ_p', PAD + 4, yv(1 - DP) + 10)
  }

  // Stage 2+: transition band shading (vertical strip f_p..f_s)
  if (stage >= 2) {
    ctx.fillStyle = `rgba(${getRGB(TRANS_C)}, 0.10)`
    ctx.fillRect(xt(FP), PAD + 16, xt(FS) - xt(FP), h - PAD - 28 - (PAD + 16))
    ctx.fillRect(xt(-FS), PAD + 16, xt(-FP) - xt(-FS), h - PAD - 28 - (PAD + 16))
  }

  // Stage 3+: stopband ripple band
  if (stage >= 3 && !dbMode) {
    ctx.fillStyle = `rgba(${getRGB(STOP_C)}, 0.20)`
    ctx.fillRect(xt(FS), yv(DS), xt(F_MAX) - xt(FS), yv(0) - yv(DS))
    ctx.fillRect(xt(-F_MAX), yv(DS), xt(-FS) - xt(-F_MAX), yv(0) - yv(DS))
    ctx.fillStyle = colors.fgMuted
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('δ_s', xt(F_MAX) - 4, yv(DS) - 2)
  }

  // The curve itself — sampled
  const STEPS = 800
  ctx.strokeStyle = REAL_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, F_MIN, F_MAX)
    let v = realLpResponse(f)
    if (dbMode) {
      v = v < 1e-4 ? -80 : 20 * Math.log10(v)
    }
    const py = yv(v)
    if (i === 0) ctx.moveTo(xt(f), py)
    else ctx.lineTo(xt(f), py)
  }
  ctx.stroke()

  // Dashed line at 1 (or 0 dB) as reference
  ctx.strokeStyle = IDEAL_C
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yv(dbMode ? 0 : 1))
  ctx.lineTo(w - PAD, yv(dbMode ? 0 : 1))
  ctx.stroke()
  ctx.setLineDash([])

  // f_p / f_s vertical guide lines (visible from stage 2 onward)
  if (stage >= 2) {
    ctx.strokeStyle = colors.fgMuted
    ctx.setLineDash([4, 3])
    ctx.lineWidth = 1
    for (const f of [FP, -FP, FS, -FS]) {
      ctx.beginPath()
      ctx.moveTo(xt(f), PAD + 16)
      ctx.lineTo(xt(f), h - PAD - 28)
      ctx.stroke()
    }
    ctx.setLineDash([])

    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('+f_p', xt(FP), h - PAD - 16)
    ctx.fillText('+f_s', xt(FS), h - PAD - 16)
    ctx.fillText('−f_p', xt(-FP), h - PAD - 16)
    ctx.fillText('−f_s', xt(-FS), h - PAD - 16)
  }

  // Stage 4+: three-zone labels under the axis
  if (stage >= 4) {
    ctx.fillStyle = colors.fg
    ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('διέλευση', (xt(-FP) + xt(FP)) / 2, h - PAD - 4)
    ctx.fillText('μετάβ.', (xt(FP) + xt(FS)) / 2, h - PAD - 4)
    ctx.fillText('αποκοπή', (xt(FS) + xt(F_MAX)) / 2, h - PAD - 4)
    ctx.fillText('μετάβ.', (xt(-FS) + xt(-FP)) / 2, h - PAD - 4)
    ctx.fillText('αποκοπή', (xt(-F_MAX) + xt(-FS)) / 2, h - PAD - 4)
  }
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
