/**
 * Tiny canvas helpers shared by the visualization components.
 *
 * Browser-only — guarded with `typeof window` so SSR doesn't blow up.
 */

export type ThemeColors = {
  fg: string
  fgMuted: string
  fgSubtle: string
  accent: string
  accentSoft: string
  border: string
  bg: string
  success: string
  warn: string
  danger: string
}

export function getThemeColors(): ThemeColors | null {
  if (typeof window === 'undefined') return null
  const root = getComputedStyle(document.documentElement)
  const v = (name: string, fallback: string) =>
    `rgb(${root.getPropertyValue(name).trim() || fallback})`
  return {
    fg: v('--fg', '15 23 42'),
    fgMuted: v('--fg-muted', '71 85 105'),
    fgSubtle: v('--fg-subtle', '100 116 139'),
    accent: v('--accent', '29 78 216'),
    accentSoft: v('--accent-soft', '219 234 254'),
    border: v('--border', '226 232 240'),
    bg: v('--bg', '255 255 255'),
    success: v('--success', '22 163 74'),
    warn: v('--warn', '202 138 4'),
    danger: v('--danger', '220 38 38'),
  }
}

/**
 * Resize the canvas to its CSS box * devicePixelRatio, scale the context, and
 * return the 2D context plus logical (CSS-pixel) width/height.
 *
 * Must be called every render — DPR or layout can change.
 */
export function setupCanvas(canvas: HTMLCanvasElement): {
  ctx: CanvasRenderingContext2D
  w: number
  h: number
} {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.floor(rect.width * dpr))
  canvas.height = Math.max(1, Math.floor(rect.height * dpr))
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w: rect.width, h: rect.height }
}

/**
 * Linear remap from [a0, a1] to [b0, b1].
 */
export function lerp(value: number, a0: number, a1: number, b0: number, b1: number) {
  if (a1 === a0) return b0
  return b0 + ((value - a0) * (b1 - b0)) / (a1 - a0)
}
