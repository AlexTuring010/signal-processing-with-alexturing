'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * Slide 18 of the prof's deck — 4-panel m(t) / x_AM(t) / x_PM(t) / x_FM(t)
 * comparison with the SAME single-tone message.
 *
 * Pedagogical role: prove visually that for a single message m(t), the three
 * modulation schemes produce visibly distinct signals — and that PM and FM
 * are NOT the same even though they share the «angle» family. The prof's slide
 * uses m(t) = cos(2π · 0.5 · t), f_c = 8 Hz, A_c = 2 to keep all four panels
 * legible in one view. We follow exactly the same parametrisation.
 *
 * Key features:
 *   • Shared sliders for α (message amplitude), K_p (PM phase sensitivity),
 *     K_f (FM frequency sensitivity), and f_m (message frequency).
 *   • Live highlight: where in time is each modulated signal at its FASTEST
 *     vs SLOWEST instantaneous frequency? Hover markers track those points
 *     across all panels so the student SEES that PM's max-freq lines up with
 *     |dm/dt| max (zero crossings of m for a cosine) while FM's max-freq
 *     lines up with m max (peaks of m).
 *   • A live readout of β_p = K_p · α and β_f = K_f · α / f_m so the student
 *     watches the modulation index update as parameters change.
 */

const FC = 8 // carrier cycles per unit time (matches slide 18)
const T_RANGE = 4 // window in seconds shown
const DT = 0.002 // sample step for the time waveforms

export function AngleModulationTimeDomainViz() {
  const [alpha, setAlpha] = useState(1.0)
  const [kp, setKp] = useState(2.0) // rad/V
  const [kf, setKf] = useState(2.0) // Hz/V (visualization-scale)
  const [fm, setFm] = useState(0.5) // Hz
  const [running, setRunning] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current = (tRef.current + dt * 0.4) % T_RANGE
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) {
        draw(canvas, colors, alpha, kp, kf, fm, tRef.current, showMarkers)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, alpha, kp, kf, fm, showMarkers])

  const beta_p = kp * alpha
  const beta_f = (kf * alpha) / fm

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Slide 18 — το ίδιο m(t), τρεις διαμορφώσεις: AM, PM, FM
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
        Το panel <strong>m(t)</strong> δείχνει το single-tone message. <strong>x<sub>AM</sub></strong>{' '}
        — το envelope κουνιέται με το m. <strong>x<sub>PM</sub></strong> — η συχνότητα τρέχει
        ταχύτερα όπου το <em>dm/dt</em> είναι μέγιστο (στα μηδενίσματα του m). <strong>x<sub>FM</sub></strong>{' '}
        — η συχνότητα τρέχει ταχύτερα όπου το <em>m</em> είναι μέγιστο (στις κορυφές του m).
        Το envelope μένει σταθερό σε PM και FM — και διαφορετικό σε κάθε σχήμα.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 460 }}
        className="block h-[460px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="4-panel comparison of m(t), AM, PM, FM in time domain"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            α (πλάτος message) ={' '}
            <span className="font-mono tabular-nums text-fg">{alpha.toFixed(2)}</span> V
          </span>
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.05}
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            f<sub>m</sub> (message freq) ={' '}
            <span className="font-mono tabular-nums text-fg">{fm.toFixed(2)}</span> Hz
          </span>
          <input
            type="range"
            min={0.3}
            max={1.2}
            step={0.05}
            value={fm}
            onChange={(e) => setFm(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            K<sub>p</sub> (PM, rad/V) ={' '}
            <span className="font-mono tabular-nums text-fg">{kp.toFixed(2)}</span>
            {' · '}β<sub>p</sub> = K<sub>p</sub>·α ={' '}
            <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {beta_p.toFixed(2)}
            </span>
          </span>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={kp}
            onChange={(e) => setKp(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            K<sub>f</sub> (FM, Hz/V) ={' '}
            <span className="font-mono tabular-nums text-fg">{kf.toFixed(2)}</span>
            {' · '}β<sub>f</sub> = K<sub>f</sub>·α/f<sub>m</sub> ={' '}
            <span className="font-mono tabular-nums text-blue-700 dark:text-blue-400">
              {beta_f.toFixed(2)}
            </span>
          </span>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={kf}
            onChange={(e) => setKf(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
            className="h-3.5 w-3.5 accent-amber-500"
          />
          <span>
            Highlight where each scheme is at <strong>max instantaneous frequency</strong>
          </span>
        </label>
        <span className="rounded-full bg-emerald-100/70 px-2 py-0.5 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
          PM max-f = όπου το dm/dt μέγιστο (μηδενίσματα του m)
        </span>
        <span className="rounded-full bg-blue-100/70 px-2 py-0.5 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300">
          FM max-f = όπου το m μέγιστο (κορυφές του m)
        </span>
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  alpha: number,
  kp: number,
  kf: number,
  fm: number,
  t_cursor: number,
  showMarkers: boolean,
) {
  if (!colors) return
  const { ctx, w: width, h: height } = setupCanvas(canvas)

  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)

  // 4 stacked panels
  const padL = 18
  const padR = 14
  const padT = 12
  const padB = 12
  const gap = 6
  const panelH = (height - padT - padB - 3 * gap) / 4
  const plotW = width - padL - padR

  // Time axis covers [0, T_RANGE]
  const xOfT = (t: number) => padL + (t / T_RANGE) * plotW

  const N = Math.floor(T_RANGE / DT)

  // Compute waveforms
  const m: number[] = new Array(N)
  const am: number[] = new Array(N)
  const pm: number[] = new Array(N)
  const fmSignal: number[] = new Array(N)
  const Ac = 1
  const muVis = Math.min(alpha, 1) // for AM panel scale
  let phaseInt = 0 // running integral for FM
  for (let i = 0; i < N; i++) {
    const t = i * DT
    const mt = alpha * Math.cos(2 * Math.PI * fm * t)
    m[i] = mt
    am[i] = (Ac + muVis * Math.cos(2 * Math.PI * fm * t)) * Math.cos(2 * Math.PI * FC * t)
    pm[i] = Ac * Math.cos(2 * Math.PI * FC * t + kp * mt)
    phaseInt += 2 * Math.PI * kf * mt * DT
    fmSignal[i] = Ac * Math.cos(2 * Math.PI * FC * t + phaseInt)
  }

  // Panel descriptors
  const panels: Array<{
    label: string
    color: string
    data: number[]
    range: [number, number]
    accent?: string
  }> = [
    {
      label: `m(t) = ${alpha.toFixed(2)} cos(2π · ${fm.toFixed(2)} t)`,
      color: colors.fg,
      data: m,
      range: [-alpha * 1.15 - 0.05, alpha * 1.15 + 0.05],
    },
    {
      label: `x_AM(t) = [A_c + μ·cos(2π f_m t)] cos(2π f_c t)`,
      color: '#a855f7', // violet (AM)
      data: am,
      range: [-(Ac + muVis) * 1.05, (Ac + muVis) * 1.05],
    },
    {
      label: `x_PM(t) = A_c cos(2π f_c t + K_p m(t))   ·  β_p = ${(kp * alpha).toFixed(2)}`,
      color: '#10b981', // emerald (PM)
      data: pm,
      range: [-Ac * 1.15, Ac * 1.15],
      accent: '#fbbf24',
    },
    {
      label: `x_FM(t) = A_c cos(2π f_c t + 2π K_f ∫m dτ)   ·  β_f = ${((kf * alpha) / fm).toFixed(2)}`,
      color: '#3b82f6', // blue (FM)
      data: fmSignal,
      range: [-Ac * 1.15, Ac * 1.15],
      accent: '#fbbf24',
    },
  ]

  for (let p = 0; p < panels.length; p++) {
    const panel = panels[p]
    const y0 = padT + p * (panelH + gap)
    const ymin = panel.range[0]
    const ymax = panel.range[1]
    const yOfV = (v: number) =>
      y0 + panelH - ((v - ymin) / (ymax - ymin)) * panelH

    // Background and zero line
    ctx.fillStyle = colors.accentSoft
    ctx.fillRect(padL, y0, plotW, panelH)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.strokeRect(padL, y0, plotW, panelH)
    ctx.strokeStyle = colors.fgSubtle
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(padL, yOfV(0))
    ctx.lineTo(padL + plotW, yOfV(0))
    ctx.stroke()
    ctx.setLineDash([])

    // Waveform
    ctx.strokeStyle = panel.color
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 0; i < N; i++) {
      const t = i * DT
      const x = xOfT(t)
      const y = yOfV(panel.data[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Max-frequency markers (only for PM and FM panels)
    if (showMarkers && p >= 2) {
      // PM max-freq → |dm/dt| max → m=0 (cosine), so t = (k+1/2)/(2fm) for k=0,1,...
      // FM max-freq → |m| max → t = k/fm for k=0,1,... (and the +m peaks)
      const period = 1 / fm
      const xs: number[] = []
      if (p === 2) {
        // PM: zero crossings of m where dm/dt is at extremum
        for (let k = 0; ; k++) {
          const t = (2 * k + 1) / (4 * fm) // m = cos has zeros at (2k+1)/(4fm)
          if (t > T_RANGE) break
          xs.push(t)
        }
      } else {
        // FM: peaks of +m
        for (let k = 0; ; k++) {
          const t = k * period
          if (t > T_RANGE) break
          xs.push(t)
        }
      }
      ctx.fillStyle = panel.accent ?? '#fbbf24'
      ctx.strokeStyle = panel.accent ?? '#fbbf24'
      ctx.lineWidth = 1
      for (const t of xs) {
        const x = xOfT(t)
        // dashed vertical line
        ctx.setLineDash([2, 2])
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(x, y0)
        ctx.lineTo(x, y0 + panelH)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.setLineDash([])
        // marker dot at top
        ctx.beginPath()
        ctx.arc(x, y0 + 5, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Live cursor
    ctx.strokeStyle = colors.accent ?? '#ef4444'
    ctx.globalAlpha = 0.85
    ctx.lineWidth = 1
    ctx.beginPath()
    const xc = xOfT(t_cursor)
    ctx.moveTo(xc, y0)
    ctx.lineTo(xc, y0 + panelH)
    ctx.stroke()
    ctx.globalAlpha = 1

    // Label
    ctx.fillStyle = colors.fg
    ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
    ctx.textBaseline = 'top'
    ctx.fillText(panel.label, padL + 6, y0 + 4)
  }
}
