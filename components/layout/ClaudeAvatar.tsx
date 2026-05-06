type Size = 'xs' | 'sm'

const SIZE_CLASS: Record<Size, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
}

/**
 * Avatar shown next to AI-authored replies. Uses the static `/claude.png`
 * brand mark so Claude replies are visually distinct from human ones.
 */
export function ClaudeAvatar({ size = 'sm' }: { size?: Size } = {}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/claude.png"
      alt=""
      className={`${SIZE_CLASS[size]} shrink-0 rounded-full object-cover`}
      aria-hidden
    />
  )
}
