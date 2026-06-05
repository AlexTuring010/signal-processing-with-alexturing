'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Side-by-side: the SAME rectangular signal's spectrum as a Fourier SERIES
 * (discrete, previous chapter) vs a Fourier TRANSFORM (continuous, this page),
 * so the reader compares ½·sinc(k/2) against T·sinc(fT) without leaving the
 * page (FT §4a).
 *
 * Canonical 50%-duty case: pulse width T = 1, period T₀ = 2, harmonics at
 * f = k/T₀ = k/2. SHARED x (f) and y scale, so it reads directly: same sinc
 * shape, same zeros (f = ±1, ±2, …); the FS is that curve SAMPLED at the
 * harmonics and scaled by 1/T₀ (hence half as tall, T₀ = 2), with the even
 * harmonics landing on the zeros → vanishing (red rings).
 */

const T = 1 // single-pulse width
const T0 = 2 // period → 50% duty cycle
const F_DOM = 3.4

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

export function FsFtCompareViz() {
  const fsRef = useRef<HTMLCanvasElement | null>(null)
  const ftRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (fsRef.current) drawFs(fsRef.current, colors)
    if (ftRef.current) drawFt(ftRef.current, colors)
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δίπλα-δίπλα: ίδιο σχήμα sinc — σειρά (διακριτό) vs μετασχηματισμός (συνεχές)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το ίδιο τετραγωνικό σήμα, δύο εργαλεία. <strong>Αριστερά</strong>: ο periodic (50% duty) μέσω{' '}
        <strong>σειράς Fourier</strong> — διακριτές γραμμές{' '}
        <span className="font-mono">aₖ = ½·sinc(k/2)</span>. <strong>Δεξιά</strong>: ένας μόνο παλμός
        μέσω <strong>μετασχηματισμού</strong> — η συνεχής{' '}
        <span className="font-mono">X₀(f) = T·sinc(fT)</span>. Ίδια κλίμακα και στους δύο άξονες.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Σειρά Fourier — periodic (προηγ. κεφάλαιο)" subtitle="aₖ = ½·sinc(k/2) — διακριτό">
          <canvas
            ref={fsRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Discrete Fourier-series spectrum of the periodic square wave"
          />
        </Panel>
        <Panel title="Μετασχηματισμός — ένας παλμός (εδώ)" subtitle="X₀(f) = T·sinc(fT) — συνεχές">
          <canvas
            ref={ftRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Continuous Fourier-transform sinc of a single pulse"
          />
        </Panel>
      </div>

      <figcaption className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg-muted">
        <strong>Ίδια καμπύλη, ίδια μηδενικά</strong> (στα{' '}
        <span className="font-mono">f = ±1/T, ±2/T, …</span>). Η μόνη διαφορά: ο periodic δίνει{' '}
        <strong>γραμμές μόνο στις αρμονικές</strong> <span className="font-mono">f = k/T₀</span>, ενώ ο
        ένας παλμός δίνει <strong>συνεχές</strong> φάσμα. Οι τιμές δένουν με{' '}
        <span className="font-mono">aₖ = X₀(k/T₀)/T₀</span> — γι' αυτό το αριστερό είναι{' '}
        <span className="font-mono">T₀ = 2</span>× πιο κοντό. Και οι{' '}
        <span style={{ color: 'rgb(var(--danger))' }}>ζυγές αρμονικές</span> πέφτουν στα μηδενικά →
        χάνονται.
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 16
const Y_MAX = 1.15
const Y_MIN = -0.32
const FONT = '10px ui-sans-serif, system-ui, sans-serif'

type XY = { xt: (f: number) => number; yv: (v: number) => number }

function mapXY(w: number, h: number): XY {
  return {
    xt: (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X),
    yv: (v: number) => lerp(v, Y_MAX, Y_MIN, PAD_Y, h - PAD_Y),
  }
}

function drawAxesAndZeros(ctx: CanvasRenderingContext2D, colors: ThemeColors, w: number, h: number, xy: XY) {
  const { xt, yv } = xy
  const yZero = yv(0)
  // shared sinc zeros at f = ±1, ±2, ±3
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.3
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  for (const z of [-3, -2, -1, 1, 2, 3]) {
    ctx.beginPath()
    ctx.moveTo(xt(z), PAD_Y)
    ctx.lineTo(xt(z), h - PAD_Y)
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()
  // f ticks (labeled in units of 1/T)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = FONT
  ctx.textAlign = 'center'
  for (const z of [-3, -2, -1, 1, 2, 3]) ctx.fillText(`${z}`, xt(z), yZero + 12)
  ctx.textAlign = 'left'
  ctx.fillText('f', w - PAD_X + 4, yZero - 4)
}

function drawFt(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xy = mapXY(w, h)
  const { xt, yv } = xy
  drawAxesAndZeros(ctx, colors, w, h, xy)

  // continuous X₀(f) = T·sinc(fT)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.2
  ctx.beginPath()
  const N = 520
  for (let i = 0; i <= N; i++) {
    const f = lerp(i, 0, N, -F_DOM, F_DOM)
    const v = T * sinc(f * T)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // peak label
  ctx.fillStyle = colors.fg
  ctx.font = FONT
  ctx.textAlign = 'left'
  ctx.fillText('X₀(0) = T', xt(0) + 5, yv(1) + 1)
}

function drawFs(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xy = mapXY(w, h)
  const { xt, yv } = xy
  drawAxesAndZeros(ctx, colors, w, h, xy)
  const yZero = yv(0)

  // faint continuous envelope = X₀(f)/T₀ = ½·sinc(f) — the curve the lines sample
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.55
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const N = 520
  for (let i = 0; i <= N; i++) {
    const f = lerp(i, 0, N, -F_DOM, F_DOM)
    const v = (T * sinc(f * T)) / T0
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // discrete stems at f = k/T₀, height aₖ = X₀(k/T₀)/T₀ = ½·sinc(k/2)
  const kMax = Math.floor(F_DOM * T0)
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    const ak = (T * sinc(f * T)) / T0
    const px = xt(f)
    if (Math.abs(ak) < 0.01 && k !== 0) {
      // even harmonic on a sinc zero → coefficient 0
      ctx.strokeStyle = colors.danger
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.arc(px, yZero, 4, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.strokeStyle = '#7c3aed'
      ctx.fillStyle = '#7c3aed'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px, yZero)
      ctx.lineTo(px, yv(ak))
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px, yv(ak), 3.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // labels
  ctx.fillStyle = colors.fg
  ctx.font = FONT
  ctx.textAlign = 'left'
  ctx.fillText('a₀ = ½', xt(0) + 5, yv(0.5) + 1)
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('envelope = X₀(f)/T₀', xt(-F_DOM) + 2, yv(Y_MAX) + 8)
}
