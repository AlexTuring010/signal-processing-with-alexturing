'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.3 — "number of cycles sets the magnitude, position sets the phase".
 *
 * An N-cycle cosine packet, slid in time by t₀. Three panels:
 *   - time:      the packet, centred at t₀.
 *   - |X(f)|:    magnitude — taller/narrower with N, and DEAD STILL under t₀.
 *   - ∠X(f):     phase — a LINEAR RAMP −2πf·t₀ whose slope steepens with t₀; this
 *                is the real signature of a time-shift (X·e^{−j2πft₀}). Drawn only
 *                where the magnitude is non-negligible (phase is meaningless in
 *                the gaps), over a faint guide showing the full −2πf·t₀ ramp.
 *
 * Units: f₀ = 1, T₀ = 1. Centered-packet transform is real:
 *   X_N(f) = (N/2)[sinc(N(f−1)) + sinc(N(f+1))];  the slid packet is X_N·e^{−j2πft₀}.
 */

const N_MIN = 1
const N_MAX = 8

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function XNreal(f: number, N: number) {
  return (N / 2) * (sinc(N * (f - 1)) + sinc(N * (f + 1)))
}
function magX(f: number, N: number) {
  return Math.abs(XNreal(f, N))
}
function wrap(a: number) {
  return ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI
}

export function BurstPositionPhase() {
  const [N, setN] = useState(4)
  const [t0, setT0] = useState(0)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, N, t0)
    if (magRef.current) drawMag(magRef.current, colors, N)
    if (phaseRef.current) drawPhase(phaseRef.current, colors, t0)
  }, [N, t0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Θέση = φάση, αριθμός κύκλων = μέτρο
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ένα πακέτο <span className="font-mono">N</span> κύκλων cosine. Σύρε το{' '}
        <span className="font-mono">N</span>: το <strong>μέτρο</strong>{' '}
        <span className="font-mono">|X(f)|</span> ψηλώνει και στενεύει (→ κρούση). Σύρε τη{' '}
        <strong>θέση</strong> <span className="font-mono">t₀</span>: το μέτρο{' '}
        <strong>δεν κουνιέται καθόλου</strong> — αλλάζει μόνο η <strong>φάση</strong>{' '}
        <span className="font-mono">∠X(f)</span>, που γίνεται μια <strong>γραμμική ράμπα</strong>{' '}
        <span className="font-mono">−2πf·t₀</span> με όλο και μεγαλύτερη κλίση.
      </p>

      <div className="space-y-3">
        <Panel title="Στον χρόνο" subtitle="πακέτο N κύκλων, μετατοπισμένο κατά t₀">
          <canvas ref={timeRef} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="An N-cycle cosine packet shifted in time" />
        </Panel>
        <div className="grid gap-3 lg:grid-cols-2">
          <Panel title="Μέτρο |X(f)|" subtitle="σταθερό — δεν κουνιέται με το t₀">
            <canvas ref={magRef} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="Magnitude spectrum, fixed under shift" />
          </Panel>
          <Panel title="Φάση ∠X(f)" subtitle="γραμμική φάση −2πf·t₀, τυλιγμένη στο [−π, π]">
            <canvas ref={phaseRef} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="Phase spectrum: a linear ramp that steepens with the shift" />
          </Panel>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            N = <span className="font-mono text-fg tabular-nums">{N}</span> κύκλοι{' '}
            <span className="text-fg-subtle">(ελέγχει το μέτρο)</span>
          </label>
          <input type="range" min={N_MIN} max={N_MAX} step={1} value={N} onChange={(e) => setN(parseInt(e.target.value, 10))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Number of cycles N" />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            θέση t₀ = <span className="font-mono text-fg tabular-nums">{t0.toFixed(2)}</span>{' '}
            <span className="text-fg-subtle">(ελέγχει τη φάση)</span>
          </label>
          <input type="range" min={-2} max={2} step={0.05} value={t0} onChange={(e) => setT0(parseFloat(e.target.value))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Position t0" />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Μια μετατόπιση στον χρόνο πολλαπλασιάζει τον FT με{' '}
        <span className="font-mono">e^(−j2πf·t₀)</span> (ιδιότητα time-shift, §5d): το{' '}
        <strong>μέτρο</strong> μένει ίδιο, ενώ η <strong>φάση</strong> αποκτά τον γραμμικό όρο{' '}
        <span className="font-mono">−2πf·t₀</span> — γι' αυτό το γράφημα φάσης είναι μια ράμπα που
        γέρνει όλο και πιο πολύ με το <span className="font-mono">t₀</span> (τυλιγμένη στο{' '}
        <span className="font-mono">[−π, π]</span>, γι' αυτό «σπάει» σε δόντια). Άρα ο{' '}
        <strong>αριθμός των κύκλων</strong>{' '}
        ορίζει το «καμπανάκι → κρούση βάρους <span className="font-mono">|aₖ|</span>», και η{' '}
        <strong>θέση</strong> ορίζει μόνο τη φάση του <span className="font-mono">aₖ</span>.
      </div>
    </figure>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 30
const PAD_Y = 16
const F_DOM = 2.3

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, N: number, t0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 4.5
  const yLim = 1.3
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  const half = N / 2
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 700
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -tDom, tDom)
    if (Math.abs(t - t0) > half) {
      started = false
      continue
    }
    const x = xt(t)
    const y = yv(Math.cos(2 * Math.PI * (t - t0)))
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // centre marker at t₀
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 2])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(t0), PAD_Y)
  ctx.lineTo(xt(t0), h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('t₀', xt(t0), h - 3)
}

function drawMag(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const yMax = N_MAX / 2 + 0.4
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.25, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 720
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(magX(f, N))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f₀', xt(1), yZero + 12)
  ctx.fillText('−f₀', xt(-1), yZero + 12)
}

function drawPhase(canvas: HTMLCanvasElement, colors: ThemeColors, t0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, Math.PI * 1.15, -Math.PI * 1.15, PAD_Y, h - PAD_Y)
  const STEPS = 900

  // gridlines at +π, 0, −π
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  for (const v of [Math.PI, 0, -Math.PI]) {
    ctx.beginPath()
    ctx.moveTo(PAD_X - 4, yv(v))
    ctx.lineTo(w - PAD_X + 4, yv(v))
    ctx.stroke()
  }
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('π', PAD_X - 6, yv(Math.PI) + 3)
  ctx.fillText('0', PAD_X - 6, yv(0) + 3)
  ctx.fillText('−π', PAD_X - 6, yv(-Math.PI) + 3)

  // faint markers at ±f₀ (where the magnitude lobes sit)
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.4
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  for (const c of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(xt(c), yv(Math.PI * 1.15))
    ctx.lineTo(xt(c), yv(-Math.PI * 1.15))
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // ∠X(f) = −2πf·t₀ : the linear phase the shift imposes, wrapped to (−π, π].
  // One continuous sawtooth — a real function of f — stroked tooth-by-tooth so the
  // ±π wraps don't draw vertical connectors. (Independent of N: only t₀ tilts it.)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  let started = false
  let prev = 0
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const ph = wrap(-2 * Math.PI * f * t0)
    if (started && Math.abs(ph - prev) > Math.PI) {
      ctx.stroke()
      started = false
    }
    if (!started) {
      ctx.beginPath()
      ctx.moveTo(xt(f), yv(ph))
      started = true
    } else {
      ctx.lineTo(xt(f), yv(ph))
    }
    prev = ph
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f₀', xt(1), yv(0) + 12)
  ctx.fillText('−f₀', xt(-1), yv(0) + 12)
}
