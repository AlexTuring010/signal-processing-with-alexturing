'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Combo viz for the «Συνδυασμοί — η σειρά παίζει ρόλο» section of
 * /foundations/signals §4.5 and /foundations/signal-transformations.
 *
 * Lets the student edit A, a, b for the composite transformation
 *
 *   y(t) = A · x(a·t + b)
 *
 * applied to the canonical right-leaning triangle x(t) (peak at t=1,
 * base [0,2]), and see the 3-step CORRECT pipeline drawn out:
 *
 *   x(t)  →  x(at)          (scale-and-flip)
 *         →  x(at + b)      (shift by -b/a — note: b/a, not b)
 *         →  A · x(at + b)  (amplitude scale)
 *
 * The «naive path» toggle adds a second row showing what you get if
 * you apply «shift by b first, then scale by a» literally — same final
 * answer, but the INTERMEDIATE has the peak at (1-b) instead of 1/a,
 * which is the place students go wrong if they shift by b in the
 * extracted form (it should be b/a after extracting the coefficient).
 *
 * Peak position is annotated on every panel so the «1/a vs 1-b vs
 * (1-b)/a» distinction reads directly off the diagram.
 *
 * Why a bespoke viz when TransformationDemo + TransformationWorkedExample
 * exist: TransformationDemo is single-knob per mode (scale only, OR
 * shift only, OR flip only). TransformationWorkedExample is a fully
 * static 3-panel SVG for one specific case (x(-t+3)). Neither lets the
 * student see the COMBO pipeline live and inspect what shifting by
 * b vs b/a does. This viz fills exactly that gap (commented in
 * /foundations/signals review queue).
 */

const tri = (t: number) => Math.max(0, 1 - Math.abs(t - 1))

const PRESETS = [
  {
    id: 'classic',
    label: 'x(2t − 4)',
    description: 'Παράδειγμα 1 — peak μετατοπίζεται από t=1 στο t=(1+4)/2 = 2.5.',
    A: 1,
    a: 2,
    b: -4,
  },
  {
    id: 'flip-shift',
    label: 'x(−t + 3)',
    description: 'Worked example — flip + shift right 3, peak στο t=2.',
    A: 1,
    a: -1,
    b: 3,
  },
  {
    id: 'amp-flip',
    label: '2 · x(−2t + 1)',
    description: 'Amplitude × flip × συμπίεση × shift — όλα μαζί.',
    A: 2,
    a: -2,
    b: 1,
  },
  {
    id: 'gentle',
    label: '0.5 · x(t/2)',
    description: 'Μόνο επέκταση + amplitude — εύκολο για warmup.',
    A: 0.5,
    a: 0.5,
    b: 0,
  },
]

export function CombinedTransformationsViz() {
  const [A, setA] = useState(1)
  const [a, setAa] = useState(2)
  const [b, setB] = useState(-4)
  const [showWrong, setShowWrong] = useState(false)

  // Refs for the 4 «correct» panels and 3 «wrong» panels.
  const origRef = useRef<HTMLCanvasElement | null>(null)
  const scaleRef = useRef<HTMLCanvasElement | null>(null)
  const shiftRef = useRef<HTMLCanvasElement | null>(null)
  const finalRef = useRef<HTMLCanvasElement | null>(null)
  const wShiftRef = useRef<HTMLCanvasElement | null>(null)
  const wScaleRef = useRef<HTMLCanvasElement | null>(null)
  const wFinalRef = useRef<HTMLCanvasElement | null>(null)

  // Avoid a=0 (singular case).
  const aSafe = Math.abs(a) < 0.05 ? (a >= 0 ? 0.05 : -0.05) : a

  // CORRECT path peaks (where x(at + b) = 1 ⇒ at + b = 1 ⇒ t = (1-b)/a)
  const peakOrig = 1
  const peakScale = 1 / aSafe // after step 1: x(at) peaks at 1/a
  const peakShift = (1 - b) / aSafe // after step 2: x(at+b) peaks at (1-b)/a
  const peakFinal = peakShift

  // WRONG path: shift first by -b literally (t → t+b on original), then scale by a
  const peakWrongShift = 1 - b // after «shift first»: x(t+b) peaks at 1-b
  const peakWrongScale = (1 - b) / aSafe // after «scale a»: x(at+b) — same final

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (origRef.current) drawSignal(origRef.current, colors, tri, 1, peakOrig, 'orig')
    if (scaleRef.current)
      drawSignal(scaleRef.current, colors, (t) => tri(aSafe * t), 1, peakScale, 'correct')
    if (shiftRef.current)
      drawSignal(shiftRef.current, colors, (t) => tri(aSafe * t + b), 1, peakShift, 'correct')
    if (finalRef.current)
      drawSignal(finalRef.current, colors, (t) => A * tri(aSafe * t + b), A, peakFinal, 'final')

    if (showWrong) {
      if (wShiftRef.current)
        drawSignal(wShiftRef.current, colors, (t) => tri(t + b), 1, peakWrongShift, 'wrong')
      if (wScaleRef.current)
        drawSignal(
          wScaleRef.current,
          colors,
          (t) => tri(aSafe * t + b),
          1,
          peakWrongScale,
          'wrong',
        )
      if (wFinalRef.current)
        drawSignal(
          wFinalRef.current,
          colors,
          (t) => A * tri(aSafe * t + b),
          A,
          peakWrongScale,
          'final',
        )
    }
  }, [A, aSafe, b, showWrong, peakScale, peakShift, peakFinal, peakWrongShift, peakWrongScale])

  function loadPreset(idx: number) {
    const p = PRESETS[idx]
    setA(p.A)
    setAa(p.a)
    setB(p.b)
  }

  // Display b/a annotation, formatted
  const bOverA = Math.abs(aSafe) < 0.05 ? '∞' : (b / aSafe).toFixed(2)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πιλότοι μετασχηματισμών — δες τη σειρά να δουλεύει
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Στόχος: <InlineMath>{'y(t) = A \\cdot x(a\\,t + b)'}</InlineMath> πάνω στο
        τρίγωνο <InlineMath>x(t)</InlineMath> με κορυφή στο <InlineMath>t = 1</InlineMath>{' '}
        και βάση <InlineMath>{'[0, 2]'}</InlineMath>. Σύρε τα <InlineMath>A, a, b</InlineMath>{' '}
        και δες κάθε βήμα.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-fg-subtle">Προεπιλογές:</span>
        {PRESETS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(i)}
            className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-fg-muted hover:bg-accent-soft/40 hover:text-fg"
            title={p.description}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-3">
        <SliderField
          label="A — amplitude"
          value={A}
          onChange={setA}
          min={-2}
          max={2}
          step={0.25}
          decimals={2}
        />
        <SliderField
          label="a — time scale (+/− = flip)"
          value={a}
          onChange={setAa}
          min={-3}
          max={3}
          step={0.25}
          decimals={2}
        />
        <SliderField
          label="b — offset"
          value={b}
          onChange={setB}
          min={-4}
          max={4}
          step={0.5}
          decimals={1}
        />
      </div>

      {/* CORRECT pipeline — 4 panels */}
      <div className="grid gap-2 sm:grid-cols-4">
        <Panel
          tone="orig"
          title="x(t)"
          subtitle={`peak στο t = ${peakOrig.toFixed(2)}`}
          stepLabel="αρχικό"
        >
          <canvas ref={origRef} style={{ height: 110 }} className="block h-[110px] w-full" />
        </Panel>
        <Panel
          tone="correct"
          title="x(a·t)"
          subtitle={`peak στο t = 1/a = ${peakScale.toFixed(2)}`}
          stepLabel="βήμα 1 — scale/flip"
        >
          <canvas ref={scaleRef} style={{ height: 110 }} className="block h-[110px] w-full" />
        </Panel>
        <Panel
          tone="correct"
          title="x(a·t + b) = x(a(t + b/a))"
          subtitle={`shift κατά −b/a = ${(-Number(bOverA)).toFixed(2)} → peak στο (1−b)/a = ${peakShift.toFixed(2)}`}
          stepLabel="βήμα 2 — shift κατά −b/a (όχι −b!)"
        >
          <canvas ref={shiftRef} style={{ height: 110 }} className="block h-[110px] w-full" />
        </Panel>
        <Panel
          tone="final"
          title="A · x(a·t + b)"
          subtitle={`ύψος ${A.toFixed(2)}, peak στο t = ${peakFinal.toFixed(2)}`}
          stepLabel="βήμα 3 — amplitude"
        >
          <canvas ref={finalRef} style={{ height: 110 }} className="block h-[110px] w-full" />
        </Panel>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[11px] text-fg-muted">
          <input
            type="checkbox"
            checked={showWrong}
            onChange={(e) => setShowWrong(e.target.checked)}
            className="accent-[rgb(var(--accent))]"
          />
          Δείξε το «naive: shift πρώτα, scale μετά» μονοπάτι
        </label>
      </div>

      {/* WRONG path — 3 panels (skip original) when toggled */}
      {showWrong && (
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          <div className="hidden sm:flex items-center justify-center text-[11px] text-fg-subtle">
            ↘ naive path
          </div>
          <Panel
            tone="wrong"
            title="x(t + b)"
            subtitle={`shift μόνο κατά b: peak στο 1 − b = ${peakWrongShift.toFixed(2)}`}
            stepLabel="βήμα 1' — shift πρώτα"
          >
            <canvas ref={wShiftRef} style={{ height: 110 }} className="block h-[110px] w-full" />
          </Panel>
          <Panel
            tone="wrong"
            title="x(a·t + b)"
            subtitle={`τώρα scale: ίδιο final, αλλά intermediate τελείως διαφορετικό`}
            stepLabel="βήμα 2' — scale μετά"
          >
            <canvas ref={wScaleRef} style={{ height: 110 }} className="block h-[110px] w-full" />
          </Panel>
          <Panel
            tone="final"
            title="A · x(a·t + b)"
            subtitle="ίδιο τελικό αποτέλεσμα — αλλά πέρασες από αλλιώτικα intermediates"
            stepLabel="βήμα 3' — amplitude"
          >
            <canvas ref={wFinalRef} style={{ height: 110 }} className="block h-[110px] w-full" />
          </Panel>
        </div>
      )}

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Η παγίδα.</strong> Και τα δύο μονοπάτια καταλήγουν στο{' '}
        <InlineMath>{'A \\cdot x(at+b)'}</InlineMath> αν εφαρμόσεις σωστά κάθε βήμα.
        Αλλά στο naive μονοπάτι σε στιγμή πρέπει να σκεφτείς «shift κατά <InlineMath>b</InlineMath>{' '}
        ή κατά <InlineMath>-b</InlineMath>;» — και η σύγχυση κάνει το λάθος. Στο
        canonical μονοπάτι (έβγαλε τον <InlineMath>a</InlineMath> έξω) η σειρά
        είναι πάντα ίδια: <strong>scale πρώτα, shift κατά{' '}
        <InlineMath>-b/a</InlineMath> μετά</strong>. Παρατήρησε πώς το peak του
        intermediate διαφέρει — <InlineMath>1/a</InlineMath> στο canonical βήμα 1,{' '}
        <InlineMath>{'1-b'}</InlineMath> στο naive βήμα 1' — εκεί αρχίζει το λάθος.
      </div>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  stepLabel,
  tone,
  children,
}: {
  title: string
  subtitle: string
  stepLabel: string
  tone: 'orig' | 'correct' | 'wrong' | 'final'
  children: React.ReactNode
}) {
  const toneCls = {
    orig: 'border-border bg-bg-soft',
    correct: 'border-accent/40 bg-accent-soft/20',
    final: 'border-emerald-400/50 bg-emerald-50/40 dark:bg-emerald-400/10',
    wrong: 'border-rose-400/50 bg-rose-50/40 dark:bg-rose-400/10',
  }[tone]
  const labelCls = {
    orig: 'text-fg-subtle',
    correct: 'text-accent',
    final: 'text-emerald-700 dark:text-emerald-400',
    wrong: 'text-rose-700 dark:text-rose-400',
  }[tone]
  return (
    <div className={cn('rounded-md border px-2 py-1.5', toneCls)}>
      <div className={cn('mb-0.5 text-[9px] font-semibold uppercase tracking-wider', labelCls)}>
        {stepLabel}
      </div>
      <div className="mb-1 text-[11px] font-semibold tracking-tight">{title}</div>
      {children}
      <div className="mt-1 text-[10px] text-fg-subtle">{subtitle}</div>
    </div>
  )
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  decimals,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  decimals: number
}) {
  return (
    <label className="rounded border border-border bg-bg-soft px-2 py-1.5 text-[11px]">
      <div className="mb-0.5 flex items-baseline justify-between">
        <span className="text-fg-subtle">{label}</span>
        <span className="font-mono text-fg">{value.toFixed(decimals)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[rgb(var(--accent))]"
      />
    </label>
  )
}

// ─── Drawing ───────────────────────────────────────────────────────

function drawSignal(
  canvas: HTMLCanvasElement,
  colors: Colors,
  signal: (t: number) => number,
  amplitude: number,
  peakT: number,
  tone: 'orig' | 'correct' | 'wrong' | 'final',
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 22
  const padR = 8
  const padT = 6
  const padB = 16
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  // Visible range: t from -5 to +5, y from -2.2 to +2.2
  const tMin = -5
  const tMax = 5
  const yMin = -2.2
  const yMax = 2.2
  const xOf = (t: number) => padL + ((t - tMin) / (tMax - tMin)) * innerW
  const yOf = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, yOf(0))
  ctx.lineTo(W - padR, yOf(0))
  ctx.moveTo(xOf(0), padT)
  ctx.lineTo(xOf(0), H - padB)
  ctx.stroke()

  // Tick marks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '8.5px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  for (let t = -4; t <= 4; t += 2) {
    if (t === 0) continue
    const x = xOf(t)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(x, yOf(0) - 2)
    ctx.lineTo(x, yOf(0) + 2)
    ctx.stroke()
    ctx.fillText(String(t), x, H - padB + 11)
  }
  ctx.fillText('0', xOf(0), H - padB + 11)

  // Signal — sample 400 points
  const N = 400
  const traceColor = {
    orig: colors.fgMuted,
    correct: colors.accent,
    wrong: '#e11d48',
    final: '#059669',
  }[tone]
  ctx.strokeStyle = traceColor
  ctx.lineWidth = 1.8
  ctx.beginPath()
  let drawn = false
  for (let i = 0; i < N; i++) {
    const t = tMin + (i / (N - 1)) * (tMax - tMin)
    const v = signal(t)
    const x = xOf(t)
    const y = yOf(v)
    if (!drawn) {
      ctx.moveTo(x, y)
      drawn = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Peak marker (only when peak is in visible range AND in signal's support)
  if (peakT >= tMin && peakT <= tMax && isFinite(peakT)) {
    const peakY = signal(peakT)
    if (Math.abs(peakY) > 0.05) {
      const x = xOf(peakT)
      const y = yOf(peakY)
      ctx.fillStyle = traceColor
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
      // dashed guide down to t-axis
      ctx.strokeStyle = traceColor + '88'
      ctx.lineWidth = 1
      ctx.setLineDash([2, 3])
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, yOf(0))
      ctx.stroke()
      ctx.setLineDash([])
      // label below x-axis
      ctx.fillStyle = traceColor
      ctx.font = 'bold 8.5px ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`t=${peakT.toFixed(1)}`, x, H - padB - 1)
    }
  }

  // y-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '8.5px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.fillText('1', padL - 3, yOf(1) + 3)
  ctx.fillText('−1', padL - 3, yOf(-1) + 3)

  // Suppress amplitude-2 line for compactness; the panel subtitle says A=...
}
