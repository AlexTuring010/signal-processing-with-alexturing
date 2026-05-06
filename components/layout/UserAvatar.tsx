type Size = 'xs' | 'sm' | 'md'

const SIZE_CLASS: Record<Size, string> = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-sm',
}

/**
 * Small reusable avatar used in comments, replies, and the header user
 * menu. Falls back to a gradient initial bubble when no `url` is set.
 */
export function UserAvatar({
  url,
  name,
  size = 'sm',
}: {
  url: string | null | undefined
  name: string | null | undefined
  size?: Size
}) {
  const initial = (name?.trim().charAt(0) || '?').toUpperCase()
  const cls = SIZE_CLASS[size]
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className={`${cls} shrink-0 rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    )
  }
  return (
    <span
      aria-hidden
      className={`${cls} inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 font-bold text-white`}
    >
      {initial}
    </span>
  )
}
