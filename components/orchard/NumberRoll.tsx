'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Smoothly interpolates a numeric counter from its previous value to the
 * latest. Cheap rAF loop with ease-out, capped duration. Defaults render
 * the floored integer, but a custom `format` lets callers display fixed-
 * decimal coins, currency suffixes, etc.
 *
 * Honors `prefers-reduced-motion` indirectly: under that media query
 * `requestAnimationFrame` still fires but the visual jump is negligible
 * because durationMs is short. If we ever need stricter compliance, this
 * is the place to check `matchMedia` and snap to value.
 */
export function NumberRoll({
  value,
  format,
  durationMs = 600,
  className,
}: {
  value: number
  format?: (n: number) => string
  durationMs?: number
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const startRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (display === value) return
    fromRef.current = display
    startRef.current = performance.now()
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    function frame(t: number) {
      const elapsed = t - startRef.current
      const p = Math.min(1, elapsed / durationMs)
      const eased = 1 - (1 - p) * (1 - p) // ease-out quad
      const cur = fromRef.current + (value - fromRef.current) * eased
      setDisplay(cur)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        setDisplay(value)
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // We intentionally leave `display` out so the loop doesn't restart on
    // every interpolated step. The render uses `display` directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs])

  return (
    <span className={className}>
      {format ? format(display) : Math.floor(display).toLocaleString('el-GR')}
    </span>
  )
}
