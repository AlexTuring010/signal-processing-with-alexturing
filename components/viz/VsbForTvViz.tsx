'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Why VSB was invented — the concrete NTSC analog-TV channel.
 *
 * NTSC packs the following inside a 6 MHz channel:
 *   - Picture (video) carrier  at +1.25 MHz from the channel low edge
 *   - Vestigial LSB             ~0.75 MHz below picture carrier (full down to 0)
 *   - Full USB of luminance     up to +4.2 MHz above picture carrier
 *   - Chroma subcarrier         at +3.58 MHz above picture carrier
 *   - Audio (FM) carrier        at +4.5 MHz above picture carrier
 *
 * The student picks one of three hypothetical encodings to see whether it
 * "fits" the 6 MHz channel:
 *   - 'vsb'  : VSB (the actual NTSC choice). Total occupied ≈ 5.45 MHz.
 *   - 'am'   : conventional AM/DSB. Full 2W = 8.4 MHz of luminance → doesn't fit.
 *   - 'ssb'  : ideal SSB. 4.2 MHz of luminance but the abrupt low-f cutoff is
 *              unrealizable for video that has DC content → won't recover m(t).
 *
 * For each variant, the panel draws:
 *   - The channel boundary (6 MHz wide)
 *   - The picture-carrier spike, vestige, USB shapes (or hypothetical shapes
 *     for AM/SSB)
 *   - The chroma subcarrier and audio carrier (always at NTSC-standard offsets)
 *   - A "fits in 6 MHz channel" badge
 *
 * This is the practical-motivation viz: it converts the abstract bandwidth
 * arithmetic into a recognizable picture of why VSB exists.
 */

type TVMode = 'vsb' | 'am' | 'ssb'

const CHANNEL_MHZ = 6.0
const CARRIER_OFFSET = 1.25 // picture carrier offset from channel low edge
const W_VIDEO = 4.2 // luminance bandwidth (USB extends this far above carrier)
const VESTIGE = 0.75 // vestige width below carrier
const CHROMA_OFFSET = 3.58 // color subcarrier offset from picture carrier
const AUDIO_OFFSET = 4.5 // audio carrier offset from picture carrier

const X_MIN = -2 // leave a little margin to show stuff outside the channel
const X_MAX = 10

const COLOR_USB = 'rgb(29, 78, 216)' // blue
const FILL_USB = 'rgba(29, 78, 216, 0.32)'
const COLOR_VESTIGE = 'rgb(217, 119, 6)' // amber
const FILL_VESTIGE = 'rgba(217, 119, 6, 0.32)'
const COLOR_CHROMA = 'rgb(168, 85, 247)' // violet
const COLOR_AUDIO = 'rgb(22, 163, 74)' // green
const COLOR_CARRIER = 'rgb(15, 23, 42)' // near-black
const COLOR_BREAK = 'rgb(220, 38, 38)' // red (for "doesn't fit")

const PAD_X = 30
const PAD_Y = 18

export function VsbForTvViz() {
  const [mode, setMode] = useState<TVMode>('vsb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mode)
  }, [mode])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mode)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mode])

  const verdict = getVerdict(mode)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Γιατί υπάρχει το VSB — το αναλογικό TV κανάλι NTSC των 6 MHz
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το NTSC είχε <strong>6 MHz</strong> ανά τηλεοπτικό κανάλι και έπρεπε να
        χωρέσει: video (luminance ~4.2 MHz), color subcarrier στα 3.58 MHz πάνω
        από τον picture carrier, audio (FM) στα 4.5 MHz πάνω από αυτόν. Επίλεξε
        το σχήμα διαμόρφωσης και δες αν χωράει.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="TV modulation scheme"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            [
              { id: 'vsb' as TVMode, label: 'VSB (πραγματικό NTSC)' },
              { id: 'am' as TVMode, label: 'Συμβατικό AM/DSB' },
              { id: 'ssb' as TVMode, label: 'SSB' },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={mode === opt.id}
              onClick={() => setMode(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                mode === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="NTSC 6 MHz channel layout"
      />

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          verdict.ok
            ? 'border-green-500/40 bg-green-500/10 text-green-900 dark:text-green-100'
            : 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
        )}
      >
        <strong>{verdict.title}</strong> {verdict.body}
      </div>
    </figure>
  )
}

function getVerdict(mode: TVMode): { ok: boolean; title: string; body: string } {
  if (mode === 'vsb') {
    return {
      ok: true,
      title: 'VSB ✓ χωράει στο 6 MHz κανάλι.',
      body:
        'Συνολικό εύρος ~5.45 MHz (vestige 0.75 + carrier σπίκα + USB 4.2 MHz) συν audio στα +4.5 MHz, όλα μέσα στο κανάλι. Το vestige επιτρέπει στο video με DC content να επιβιώσει και ο envelope detector λειτουργεί επειδή το shaping filter είναι Nyquist-συμμετρικό. Αυτή ήταν η χρυσή τομή που έσωσε το αναλογικό TV.',
    }
  }
  if (mode === 'am') {
    return {
      ok: false,
      title: 'AM/DSB ✗ ξεχειλίζει.',
      body:
        'Πλήρες 2W = 8.4 MHz luminance + audio + οριζόντια προστασία > 9 MHz συνολικά. Δεν χωράει σε ένα 6 MHz κανάλι — και το να αυξήσουμε το spacing των καναλιών θα είχε κόψει στα μισά τον αριθμό των διαθέσιμων TV channels.',
    }
  }
  return {
    ok: false,
    title: 'SSB ✗ θεωρητικά χωράει, πρακτικά αδύνατο.',
    body:
      'Μόνο 4.2 MHz luminance — μέσα στο κανάλι. ΑΛΛΑ: το video έχει σημαντικό DC και πολύ χαμηλές συχνότητες. Ο sideband filter που χρειάζεται το SSB θα έπρεπε να κάνει στιγμιαία μετάβαση στα 0 Hz — αδύνατο με αναλογικό φίλτρο. Η ανάκτηση θα έχανε όλη τη DC πληροφορία (φωτεινότητα). Άρα SSB ποτέ δεν χρησιμοποιήθηκε σε analog TV.',
  }
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mode: TVMode,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const xt = (mhz: number) => lerp(mhz, X_MIN, X_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.0, -0.15, PAD_Y + 4, h - PAD_Y - 20)
  const yZero = yv(0)

  // Draw channel band (6 MHz)
  ctx.fillStyle = 'rgba(100, 116, 139, 0.08)'
  ctx.fillRect(xt(0), PAD_Y + 4, xt(CHANNEL_MHZ) - xt(0), h - PAD_Y - 20 - PAD_Y - 4)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(xt(0), PAD_Y + 4, xt(CHANNEL_MHZ) - xt(0), h - PAD_Y - 20 - PAD_Y - 4)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('6 MHz NTSC channel', (xt(0) + xt(CHANNEL_MHZ)) / 2, PAD_Y - 2)

  // Horizontal axis
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Tick marks on axis
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let mhz = 0; mhz <= 6; mhz++) {
    ctx.strokeStyle = colors.fgSubtle
    ctx.beginPath()
    ctx.moveTo(xt(mhz), yZero)
    ctx.lineTo(xt(mhz), yZero + 4)
    ctx.stroke()
    ctx.fillText(`${mhz}`, xt(mhz), yZero + 14)
  }
  ctx.fillText('f (MHz)', w - PAD_X, yZero + 14)

  // Channel-boundary verticals (solid red dotted)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y + 4)
  ctx.lineTo(xt(0), yZero)
  ctx.moveTo(xt(CHANNEL_MHZ), PAD_Y + 4)
  ctx.lineTo(xt(CHANNEL_MHZ), yZero)
  ctx.stroke()
  ctx.setLineDash([])

  const picCarrierMhz = CARRIER_OFFSET // 1.25
  const chromaMhz = picCarrierMhz + CHROMA_OFFSET // 4.83
  const audioMhz = picCarrierMhz + AUDIO_OFFSET // 5.75

  if (mode === 'vsb') {
    drawVsbLayout(ctx, colors, xt, yv, yZero, picCarrierMhz)
  } else if (mode === 'am') {
    drawAmLayout(ctx, colors, xt, yv, yZero, picCarrierMhz)
  } else {
    drawSsbLayout(ctx, colors, xt, yv, yZero, picCarrierMhz)
  }

  // Chroma subcarrier and audio (always)
  if (mode !== 'am') {
    drawCarrierSpike(ctx, colors, xt(chromaMhz), yv(0.6), yZero, COLOR_CHROMA,
      'color', chromaMhz)
    drawCarrierSpike(ctx, colors, xt(audioMhz), yv(0.85), yZero, COLOR_AUDIO,
      'audio', audioMhz)
  }
}

function drawVsbLayout(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (m: number) => number,
  yv: (v: number) => number,
  yZero: number,
  pc: number, // picture carrier MHz
) {
  if (!colors) return
  // Vestige: from (pc - VESTIGE) to pc, shaped from 0 rising to 1 at pc
  const vestigeStart = pc - VESTIGE
  const STEPS = 100
  ctx.fillStyle = FILL_VESTIGE
  ctx.strokeStyle = COLOR_VESTIGE
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(vestigeStart), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, vestigeStart, pc)
    const x = (f - vestigeStart) / VESTIGE
    const v = 0.5 * (1 - Math.cos(Math.PI * x))
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(pc), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // USB: from pc to pc + W_VIDEO, full height, gentle roll-off near edge
  ctx.fillStyle = FILL_USB
  ctx.strokeStyle = COLOR_USB
  ctx.beginPath()
  ctx.moveTo(xt(pc), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, pc, pc + W_VIDEO)
    // Smooth shape: stays at ~1 most of the way, gradually rolls down near end
    const t = (f - pc) / W_VIDEO
    const v = t < 0.85 ? 1 : Math.cos((Math.PI * (t - 0.85)) / 0.3)
    ctx.lineTo(xt(f), yv(Math.max(0, v)))
  }
  ctx.lineTo(xt(pc + W_VIDEO), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Carrier spike
  drawCarrierSpike(ctx, colors, xt(pc), yv(0.95), yZero, COLOR_CARRIER,
    'picture', pc)

  // Annotation label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('vestige (~0.75 MHz)', xt(vestigeStart + VESTIGE / 2), yv(0.25))
  ctx.fillText('full USB (~4.2 MHz)', xt(pc + W_VIDEO / 2), yv(0.55))
}

function drawAmLayout(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (m: number) => number,
  yv: (v: number) => number,
  yZero: number,
  pc: number,
) {
  if (!colors) return
  // LSB: full triangle from pc - W_VIDEO to pc
  // USB: full triangle from pc to pc + W_VIDEO
  const STEPS = 60
  ctx.fillStyle = FILL_USB
  ctx.strokeStyle = COLOR_USB
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(pc - W_VIDEO), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, pc - W_VIDEO, pc)
    ctx.lineTo(xt(f), yv((f - (pc - W_VIDEO)) / W_VIDEO))
  }
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, pc, pc + W_VIDEO)
    ctx.lineTo(xt(f), yv(1 - (f - pc) / W_VIDEO))
  }
  ctx.lineTo(xt(pc + W_VIDEO), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Carrier spike
  drawCarrierSpike(ctx, colors, xt(pc), yv(0.95), yZero, COLOR_CARRIER,
    'picture', pc)

  // "Doesn't fit" overlay: red hatched region outside the channel
  ctx.fillStyle = 'rgba(220, 38, 38, 0.15)'
  ctx.fillRect(xt(pc + W_VIDEO - 1.45), PAD_Y + 4, xt(pc + W_VIDEO + 1) - xt(pc + W_VIDEO - 1.45),
    yZero - (PAD_Y + 4))
  ctx.fillStyle = COLOR_BREAK
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ξεπερνά το κανάλι →', xt(pc + W_VIDEO - 0.3), yv(0.45))

  // Annotation
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('full LSB', xt(pc - W_VIDEO / 2), yv(0.35))
  ctx.fillText('full USB', xt(pc + W_VIDEO / 2), yv(0.35))
}

function drawSsbLayout(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (m: number) => number,
  yv: (v: number) => number,
  yZero: number,
  pc: number,
) {
  if (!colors) return
  // Only USB, abrupt cutoff at pc — but show the impossible-cutoff issue
  const STEPS = 80
  ctx.fillStyle = FILL_USB
  ctx.strokeStyle = COLOR_USB
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(pc), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, pc, pc + W_VIDEO)
    const t = (f - pc) / W_VIDEO
    const v = t < 0.85 ? 1 : Math.cos((Math.PI * (t - 0.85)) / 0.3)
    ctx.lineTo(xt(f), yv(Math.max(0, v)))
  }
  ctx.lineTo(xt(pc + W_VIDEO), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Red "impossible cutoff" annotation at the brick-wall position
  ctx.strokeStyle = COLOR_BREAK
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(xt(pc), yv(1))
  ctx.lineTo(xt(pc), yv(-0.05))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = COLOR_BREAK
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('αδύνατο brick-wall cutoff στο 0 Hz baseband ↑', xt(pc) - 4, yv(0.5))

  // Carrier spike
  drawCarrierSpike(ctx, colors, xt(pc), yv(0.95), yZero, COLOR_CARRIER,
    'picture', pc)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('μόνο USB (~4.2 MHz)', xt(pc + W_VIDEO / 2), yv(0.55))
}

function drawCarrierSpike(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  px: number,
  pyTop: number,
  yZero: number,
  color: string,
  label: string,
  mhz: number,
) {
  if (!colors) return
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(px, pyTop)
  ctx.lineTo(px, yZero)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(px, pyTop, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${label} (${mhz.toFixed(2)})`, px, pyTop - 4)
}
