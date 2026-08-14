import {
  EXAM_PAPERS,
  SOURCE_LABELS,
  type ExamSource,
} from '@/content/practice/types'

/**
 * The «Ιούνιος 2026»-style provenance chip.
 *
 * By default it is a link that opens the original scanned paper in a new tab,
 * so a reader can check a transcribed exercise against the real thing.
 *
 * IMPORTANT: an `<a>` may not contain another `<a>`. Any host that renders this
 * inside a `next/link` row must either restructure so the chip is a sibling of
 * that link, or pass `asLink={false}` to fall back to a plain label.
 *
 * No hooks here, so no `'use client'` needed — it inherits the boundary of
 * whichever component imports it and works from a server component too.
 */

const SIZES = {
  sm: 'px-2 py-0.5 text-[11px]',
  xs: 'px-2 py-0.5 text-[10px]',
  tiny: 'px-1.5 py-px text-[9px]',
} as const

const BASE =
  'rounded-full border border-purple-500/40 bg-purple-500/10 font-semibold text-purple-700 dark:text-purple-300'

type Props = {
  source: ExamSource
  /** Page of the scan to jump to (1-indexed). Falls back to page 1. */
  page?: number
  size?: keyof typeof SIZES
  /** Set false where an anchor would be nested inside another anchor/button. */
  asLink?: boolean
  className?: string
}

export function ExamSourceChip({
  source,
  page,
  size = 'sm',
  asLink = true,
  className = '',
}: Props) {
  const label = SOURCE_LABELS[source]
  const cls = `${BASE} ${SIZES[size]} ${className}`

  if (!asLink || !EXAM_PAPERS[source]) {
    return <span className={cls}>{label}</span>
  }

  const pages = EXAM_PAPERS[source].files.length
  const target =
    page && page > 1 && page <= pages
      ? `/exams/${source}#p${page}`
      : `/exams/${source}`

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      title={`Άνοιγμα του θέματος «${label}» σε νέα καρτέλα`}
      className={`${cls} inline-block transition-colors hover:border-purple-500/70 hover:bg-purple-500/20 hover:underline`}
    >
      {label}
    </a>
  )
}
