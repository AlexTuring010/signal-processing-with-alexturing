'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — samples-only overlay: the two coefficient grids on one axis.
 *
 * One rectangle → samples at k/T₀ (rings). Two copies → samples at k/2T₀ (a
 * FINER grid): the even ones (k/2T₀ = m/T₀) land inside the rings — equal — and
 * the odd ones (between the harmonics) are ZERO (extra empty slots, the two
 * copies cancel there). Ignore the zeros and the two grids are identical, riding
 * the same coefficient envelope X₀/T₀.
 *
 * Coefficient-scaled (the envelope tower is not shown); magnitudes |X|. τ=1, T₀=2.
 */

const TAU = 1
const T0 = 2
const C2 = '#7c3aed'

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function X0(f: number) {
  return Math.abs(TAU * sinc(f * TAU))
}
function X2(f: number) {
  return Math.abs(2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * T0))
}

export function TwoPulsesSamplesOverlay() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const draw = () => {
      const colors = getThemeColors()
      if (!colors || !ref.current) return
      drawSamples(ref.current, colors)
    }
    draw()
    const obs = new MutationObserver(draw)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] })
    window.addEventListener('resize', draw)
    return () => {
      obs.disconnect()
      window.removeEventListener('resize', draw)
    }
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Μόνο τα δείγματα: ίδιο πλέγμα, με έξτρα μηδενικά
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τα δείγματα και των δύο, στον ίδιο άξονα. Ο ένας παλμός δίνει{' '}
        <span style={{ color: 'rgb(var(--accent))' }}>κύκλους</span> ανά{' '}
        <span className="font-mono">1/T₀</span>· τα δύο αντίγραφα δίνουν διπλάσια{' '}
        <span style={{ color: C2 }} className="font-semibold">μωβ</span> δείγματα ανά{' '}
        <span className="font-mono">1/2T₀</span>. Τα μισά μωβ πέφτουν <strong>μέσα</strong> στους κύκλους
        (ίδια)· τα άλλα μισά είναι <strong>μηδέν</strong> — έξτρα κενές θέσεις του πιο πυκνού πλέγματος.
      </p>

      <Panel title="Τα δύο πλέγματα δειγμάτων μαζί" subtitle="μωβ μέσα στους κύκλους = ίσα · ενδιάμεσα μωβ = 0 (άξονας: |X|)">
        <canvas ref={ref} style={{ height: 210 }} className="block h-[210px] w-full" aria-label="Both coefficient grids overlaid; the two-copy grid is finer with interleaved zeros" />
      </Panel>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Αγνόησε τα μηδενικά</strong> και τα δύο πλέγματα είναι ταυτόσημα — ίδια δείγματα, πάνω
        στην ίδια περιβάλλουσα <span className="font-mono">X₀/T₀</span>. Το πιο πυκνό πλέγμα δεν προσθέτει
        καμία νέα πληροφορία· απλώς παρεμβάλλει μηδενικά εκεί που το σήμα δεν έχει τίποτα.
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

const PAD_X = 34
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawSamples(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 3
  const yMax = (1 / T0) * 1.34 // coefficient scale; a₀ = 1/T₀
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.16 * yMax, PAD_Y + 22, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // coefficient envelope X₀/T₀ (faint dashed) — what the nonzero samples ride
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 1.2
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(X0(f) / T0)
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // two-copy samples at k/2T₀
  const k2 = Math.ceil(fDom * 2 * T0) + 1
  for (let k = -k2; k <= k2; k++) {
    const f = k / (2 * T0)
    if (Math.abs(f) > fDom) continue
    const x = xt(f)
    if (k % 2 !== 0) {
      // odd k: extra slot, value 0 → small hollow purple ring on the axis
      ctx.strokeStyle = C2
      ctx.lineWidth = 1.3
      ctx.beginPath()
      ctx.arc(x, yZero, 2.6, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      // even k: coincides with a one-copy harmonic (equal) → filled purple dot
      const v = X2(f) / (2 * T0)
      ctx.strokeStyle = C2
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(x, yZero)
      ctx.lineTo(x, yv(v))
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = C2
      ctx.beginPath()
      ctx.arc(x, yv(v), 2.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // one-copy samples at k/T₀ → accent rings (on top)
  const k1 = Math.ceil(fDom * T0) + 1
  for (let k = -k1; k <= k1; k++) {
    const f = k / T0
    if (Math.abs(f) > fDom) continue
    const v = X0(f) / T0
    const x = xt(f)
    ctx.strokeStyle = colors.accent
    ctx.globalAlpha = 0.45
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(v))
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.arc(x, yv(v), 4.6, 0, Math.PI * 2)
    ctx.stroke()
  }

  // legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.arc(PAD_X + 6, PAD_Y + 4, 4.2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('ένας παλμός (k/T₀)', PAD_X + 16, PAD_Y + 7)
  ctx.fillStyle = C2
  ctx.beginPath()
  ctx.arc(PAD_X + 6, PAD_Y + 17, 2.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillText('δύο, ίδιο', PAD_X + 16, PAD_Y + 20)
  ctx.strokeStyle = C2
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.arc(PAD_X + 92, PAD_Y + 17, 2.6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('δύο, έξτρα = 0', PAD_X + 100, PAD_Y + 20)

  // axis labels
  ctx.save()
  ctx.translate(PAD_X - 22, (PAD_Y + 22 + yZero) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('|X| / περίοδο', 0, 0)
  ctx.restore()
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
