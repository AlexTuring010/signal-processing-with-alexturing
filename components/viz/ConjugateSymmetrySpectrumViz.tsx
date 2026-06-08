'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'

/**
 * Conjugate symmetry of a real signal's spectrum, and why it lets us draw a
 * one-sided spectrum.
 *
 * For real x(t):  X(-f) = X*(f)  ⟹  |X(f)| is EVEN (mirror about f=0) and
 * ∠X(f) is ODD (negative-mirror). So the negative-frequency half carries no new
 * information — it's a forced copy. The "one-sided" convention simply stops
 * drawing it.
 *
 * The viz shows a representative real signal's magnitude (even, two bumps at
 * ±f_c) and phase (odd) spectra, and a toggle that drops the f<0 half. Toggling
 * makes the point viscerally: the positive half stays put, the redundant mirror
 * just disappears.
 *
 * Any (even magnitude, odd phase) pair corresponds to some real signal — that
 * IS the theorem — so we don't tie it to one specific x(t).
 */

const F_DOMAIN = 3.5
const F_C = 1.6 // magnitude bumps sit at ±F_C
const SIGMA = 0.55 // bump width
const PHASE_AMP = 2.4 // rad — peak of the odd phase curve

function magnitude(f: number) {
  const a = Math.exp(-(((f - F_C) / SIGMA) ** 2))
  const b = Math.exp(-(((f + F_C) / SIGMA) ** 2))
  return a + b
}

function phase(f: number) {
  return PHASE_AMP * Math.tanh(f / 0.9)
}

export function ConjugateSymmetrySpectrumViz() {
  const [oneSided, setOneSided] = useState(false)

  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const draw = () => {
      const colors = getThemeColors()
      if (!colors) return
      if (magRef.current) drawMagnitude(magRef.current, colors, oneSided)
      if (phaseRef.current) drawPhase(phaseRef.current, colors, oneSided)
    }
    draw()
    const ro = new ResizeObserver(draw)
    if (magRef.current) ro.observe(magRef.current)
    if (phaseRef.current) ro.observe(phaseRef.current)
    return () => ro.disconnect()
  }, [oneSided])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Φάσμα real σήματος: μέτρο άρτιο, φάση περιττή → one-sided
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Για κάθε <strong>real</strong> σήμα, το <strong>μέτρο</strong>{' '}
        <span className="font-mono">|X(f)|</span> είναι <strong>άρτιο</strong> (καθρέφτης γύρω από το{' '}
        <span className="font-mono">f = 0</span>) και η <strong>φάση</strong>{' '}
        <span className="font-mono">∠X(f)</span> είναι <strong>περιττή</strong> (αρνητικός
        καθρέφτης). Άρα το αρνητικό μισό δεν λέει τίποτα καινούριο — είναι αναγκαστικό αντίγραφο.
        Πάτα «one-sided» και δες το να φεύγει, ενώ το θετικό μισό μένει ακριβώς ίδιο.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOneSided(false)}
          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
            !oneSided
              ? 'border-transparent bg-accent text-accent-fg'
              : 'border-border bg-bg text-fg-muted hover:bg-bg-elevated'
          }`}
        >
          Two-sided (όλος ο άξονας)
        </button>
        <button
          type="button"
          onClick={() => setOneSided(true)}
          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
            oneSided
              ? 'border-transparent bg-accent text-accent-fg'
              : 'border-border bg-bg text-fg-muted hover:bg-bg-elevated'
          }`}
        >
          One-sided (μόνο f ≥ 0)
        </button>
      </div>

      <div className="grid gap-3">
        <Panel title="Μέτρο" subtitle="|X(f)| — άρτιο: |X(−f)| = |X(f)|">
          <canvas
            ref={magRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Magnitude spectrum, even"
          />
        </Panel>
        <Panel title="Φάση" subtitle="∠X(f) — περιττή: ∠X(−f) = −∠X(f)">
          <canvas
            ref={phaseRef}
            style={{ height: 150 }}
            className="block h-[150px] w-full"
            aria-label="Phase spectrum, odd"
          />
        </Panel>
      </div>

      <figcaption className="mt-3 text-xs text-fg-muted">
        Στο two-sided το αρνητικό μισό (διακεκομμένο) είναι απλώς ο καθρέφτης του θετικού — ίδιο
        μέτρο, ανεστραμμένη φάση. Το one-sided δεν πετάει πληροφορία· σταματά απλώς να σχεδιάζει το
        περιττό αντίγραφο. (Στην <em>amplitude</em> εκδοχή, που θα δούμε αμέσως μετά, τα μη-DC ύψη
        διπλασιάζονται ώστε να δίνουν κατευθείαν το πλάτος του πραγματικού cosine.)
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
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

const FONT = '10px ui-sans-serif, system-ui, sans-serif'

function fToPx(f: number, w: number, pad: number) {
  return w / 2 + (f / F_DOMAIN) * (w / 2 - pad)
}

function drawMagnitude(canvas: HTMLCanvasElement, colors: ThemeColors, oneSided: boolean) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 26

  // axes: baseline at bottom (magnitude ≥ 0), vertical at f = 0
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h - pad)
  ctx.lineTo(w - pad / 2, h - pad)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.fillText('f', w - pad / 2 - 8, h - pad - 4)
  ctx.textAlign = 'center'
  ctx.fillText('0', w / 2, h - pad + 12)
  ctx.fillText('+f_c', fToPx(F_C, w, pad), h - pad + 12)
  if (!oneSided) ctx.fillText('−f_c', fToPx(-F_C, w, pad), h - pad + 12)
  ctx.textAlign = 'left'

  const yScale = (h - 2 * pad) / 1.1

  const plotHalf = (negative: boolean) => {
    ctx.beginPath()
    const samples = 260
    let started = false
    for (let i = 0; i <= samples; i++) {
      const f = (negative ? -F_DOMAIN : 0) + ((negative ? F_DOMAIN : F_DOMAIN) * i) / samples
      const px = fToPx(f, w, pad)
      const py = h - pad - magnitude(f) * yScale
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // positive half: solid accent
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.4
  ctx.setLineDash([])
  plotHalf(false)

  // negative half: dashed faded mirror (only in two-sided)
  if (!oneSided) {
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.6
    ctx.globalAlpha = 0.5
    ctx.setLineDash([4, 3])
    plotHalf(true)
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    // mirror annotation
    ctx.fillStyle = colors.fgSubtle
    ctx.font = FONT
    ctx.textAlign = 'center'
    ctx.fillText('καθρέφτης', fToPx(-F_C, w, pad), pad + 4)
    ctx.textAlign = 'left'
  }
}

function drawPhase(canvas: HTMLCanvasElement, colors: ThemeColors, oneSided: boolean) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 24

  // axes centred (phase is signed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h / 2)
  ctx.lineTo(w - pad / 2, h / 2)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.fillText('f', w - pad / 2 - 8, h / 2 - 4)

  const piHeight = (h / 2 - pad / 2) * 0.85
  // ±π/2 reference gridlines
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.border
  for (const lvl of [0.5, -0.5]) {
    const y = h / 2 - lvl * piHeight
    ctx.beginPath()
    ctx.moveTo(pad, y)
    ctx.lineTo(w - pad / 2, y)
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('+π/2', 2, h / 2 - 0.5 * piHeight + 4)
  ctx.fillText('−π/2', 2, h / 2 + 0.5 * piHeight + 4)

  const plotHalf = (negative: boolean) => {
    ctx.beginPath()
    const samples = 260
    let started = false
    for (let i = 0; i <= samples; i++) {
      const f = (negative ? -F_DOMAIN : 0) + (F_DOMAIN * i) / samples
      const px = fToPx(f, w, pad)
      const py = h / 2 - (phase(f) / Math.PI) * piHeight
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // positive half: solid
  ctx.strokeStyle = colors.warn
  ctx.lineWidth = 2.4
  ctx.setLineDash([])
  plotHalf(false)

  // negative half: dashed faded mirror (only in two-sided)
  if (!oneSided) {
    ctx.strokeStyle = colors.warn
    ctx.lineWidth = 1.6
    ctx.globalAlpha = 0.5
    ctx.setLineDash([4, 3])
    plotHalf(true)
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    ctx.fillStyle = colors.fgSubtle
    ctx.font = FONT
    ctx.textAlign = 'center'
    ctx.fillText('αρνητικός καθρέφτης', fToPx(-F_C, w, pad), h - pad / 2 - 2)
    ctx.textAlign = 'left'
  }
}
