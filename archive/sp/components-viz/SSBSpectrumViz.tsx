'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * SSB spectrum: starts from DSB-SC (both sidebands), then highlights which
 * sideband survives in USB vs LSB. The "killed" sideband is shown faded so
 * the student sees what was sacrificed for half the bandwidth.
 *
 * Schematic message |M(f)| as a triangular bump from −W to +W. After
 * modulation, the spectrum has triangular bumps on both sides of ±f_c.
 * USB keeps the outer-pointing bumps (above +f_c, below −f_c). LSB keeps
 * the inner-pointing bumps.
 *
 * Bandwidth annotation: shows W (half of 2W = the DSB bandwidth).
 */

type Variant = 'dsb' | 'usb' | 'lsb'

const FC = 4
const W_MSG = 1.2 // message bandwidth W (visual units)

export function SSBSpectrumViz() {
  const [variant, setVariant] = useState<Variant>('usb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, variant)
  }, [variant])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        SSB φάσμα — διάλεξε ποια sideband κρατάς
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ξεκινάμε από DSB-SC (δύο sidebands στις <span className="font-mono">±f_c</span>).
        Στη SSB κρατάμε <strong>μόνο μία</strong> από τις δύο. Η σβησμένη
        ζώνη δείχνει τι θυσιάζουμε. Το bandwidth μειώνεται από{' '}
        <span className="font-mono">2W</span> σε <span className="font-mono">W</span>{' '}
        — μισό φάσμα.
      </p>

      <div
        role="radiogroup"
        aria-label="SSB variant"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {(
          [
            { id: 'dsb' as Variant, label: 'DSB-SC (αναφορά)' },
            { id: 'usb' as Variant, label: 'USB (Upper Sideband)' },
            { id: 'lsb' as Variant, label: 'LSB (Lower Sideband)' },
          ]
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={variant === opt.id}
            onClick={() => setVariant(opt.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              variant === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="SSB spectrum showing surviving and removed sidebands"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Πρακτική σημασία:</strong> Για ίδια χρήσιμη ισχύ και ίδιο message,
        η SSB χρησιμοποιεί <strong>μισό φάσμα</strong> από DSB-SC (W αντί 2W). Και
        χωρίζει σε δύο εκδοχές — <strong>USB</strong> και <strong>LSB</strong> —
        που μπορεί να πάνε σε διαφορετικά κανάλια χωρίς να αλληλοκαλύπτονται. Γι'
        αυτό η SSB είναι το αγαπημένο σχήμα στις HF (shortwave) και τις
        ραδιοερασιτεχνικές επικοινωνίες όπου το φάσμα είναι πολύτιμο.
      </div>
    </figure>
  )
}

const KEPT_C = 'rgb(29, 78, 216)' // accent blue
const REMOVED_C = 'rgb(220, 38, 38)' // red, faded
const FILL_KEPT = 'rgba(29, 78, 216, 0.30)'
const FILL_REMOVED = 'rgba(220, 38, 38, 0.10)'

const PAD_X = 28
const PAD_Y = 18

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  variant: Variant,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = FC + W_MSG + 1
  const fMin = -fMax
  const yMax = 1.2

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // arrow
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(w - PAD_X + 6, yZero)
  ctx.lineTo(w - PAD_X - 4, yZero - 4)
  ctx.lineTo(w - PAD_X - 4, yZero + 4)
  ctx.closePath()
  ctx.fill()
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('f', w - PAD_X + 12, yZero + 4)

  // Determine which side is kept / removed at +f_c
  // For USB: keep the upper sideband (f > +f_c), remove lower (f < +f_c)
  // For LSB: keep the lower sideband (f < +f_c), remove upper
  // For DSB: both kept
  // The negative carrier mirrors

  const drawSideband = (
    centerF: number,
    side: 'lower' | 'upper',
    isKept: boolean,
  ) => {
    // Triangular bump from |f - centerF| = 0 to W
    const top = yv(1)
    const lower = centerF - W_MSG
    const upper = centerF + W_MSG
    const cFx = xt(centerF)

    let path: string
    if (side === 'upper') {
      path = `M ${cFx} ${yZero} L ${cFx} ${top} L ${xt(upper)} ${yZero} Z`
    } else {
      path = `M ${cFx} ${yZero} L ${cFx} ${top} L ${xt(lower)} ${yZero} Z`
    }

    const path2D = new Path2D(path)
    ctx.fillStyle = isKept ? FILL_KEPT : FILL_REMOVED
    ctx.fill(path2D)
    ctx.strokeStyle = isKept ? KEPT_C : REMOVED_C
    ctx.lineWidth = isKept ? 1.6 : 1
    if (!isKept) ctx.setLineDash([3, 3])
    ctx.stroke(path2D)
    ctx.setLineDash([])
  }

  // Helper to determine kept/removed for a given side at +f_c (then mirror at -f_c)
  const lowerKeptAtPositive = variant === 'dsb' || variant === 'lsb'
  const upperKeptAtPositive = variant === 'dsb' || variant === 'usb'

  // At +f_c
  drawSideband(FC, 'lower', lowerKeptAtPositive)
  drawSideband(FC, 'upper', upperKeptAtPositive)
  // At -f_c (mirror) — by conjugate symmetry, the spectrum is mirrored
  // For USB at +f_c (upper kept), the mirror at -f_c keeps the lower side
  // (because the "outer" of -f_c is at more-negative f, which is the lower side from origin's perspective).
  // For consistency we just mirror what's at +f_c reflected through 0.
  drawSideband(-FC, 'lower', upperKeptAtPositive)
  drawSideband(-FC, 'upper', lowerKeptAtPositive)

  // tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 14)
  ctx.fillText('−f_c', xt(-FC), yZero + 14)
  ctx.fillText('0', xt(0), yZero + 14)
  ctx.fillText('+f_c+W', xt(FC + W_MSG), yZero + 24)
  ctx.fillText('+f_c−W', xt(FC - W_MSG), yZero + 24)

  // Bandwidth annotation: show the bandwidth of the surviving spectrum at +f_c
  const bwY = PAD_Y + 18
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  let bwLeft = FC - W_MSG
  let bwRight = FC + W_MSG
  let bwLabel = 'BW = 2W'
  if (variant === 'usb') {
    bwLeft = FC
    bwRight = FC + W_MSG
    bwLabel = 'BW = W'
  } else if (variant === 'lsb') {
    bwLeft = FC - W_MSG
    bwRight = FC
    bwLabel = 'BW = W'
  }
  ctx.beginPath()
  ctx.moveTo(xt(bwLeft), bwY)
  ctx.lineTo(xt(bwRight), bwY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(xt(bwLeft), bwY - 4)
  ctx.lineTo(xt(bwLeft), bwY + 4)
  ctx.moveTo(xt(bwRight), bwY - 4)
  ctx.lineTo(xt(bwRight), bwY + 4)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(bwLabel, xt((bwLeft + bwRight) / 2), bwY - 6)
}
