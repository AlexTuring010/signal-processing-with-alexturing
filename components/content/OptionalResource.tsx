import type { ReactNode } from 'react'
import { BookOpen, Download, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** Path to the file, served from /public (e.g. "/probabilities_book.pdf"). */
  href: string
  /** Box heading. */
  title: string
  /** Filename suggested when downloading. Falls back to the browser default. */
  downloadName?: string
  /** Optional short label for the affordances (defaults to a PDF). */
  openLabel?: string
  downloadLabel?: string
  /** Framing prose — explains what it is and that it is optional. */
  children?: ReactNode
}

/**
 * A calm, clearly-optional "bonus reading" card for a downloadable/viewable
 * resource (e.g. a supplementary PDF). Deliberately distinct from <SourceDoc>,
 * which is for the mandatory course slides. No client state — just styled links.
 */
export function OptionalResource({
  href,
  title,
  downloadName,
  openLabel = 'Άνοιγμα σε νέα καρτέλα',
  downloadLabel = 'Κατέβασμα PDF',
  children,
}: Props) {
  const buttonClass = cn(
    'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium',
    'border-indigo-400/40 bg-bg/70 text-fg shadow-sm transition-colors',
    'hover:border-accent/60 hover:bg-bg',
  )

  return (
    <aside
      className={cn(
        'my-5 rounded-lg border px-4 py-3.5 shadow-sm',
        'border-indigo-300/60 bg-indigo-50/70 text-indigo-950',
        'dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-100',
      )}
    >
      <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>

      {children && (
        <div className="text-[0.95rem] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {openLabel}
        </a>
        <a href={href} download={downloadName} className={buttonClass}>
          <Download className="h-4 w-4" aria-hidden="true" />
          {downloadLabel}
        </a>
      </div>
    </aside>
  )
}
