'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { BookOpen, Download, ExternalLink, Eye, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** Path to the file, served from /public (e.g. "/probabilities_book.pdf"). */
  href: string
  /** Box heading. */
  title: string
  /** Filename suggested when downloading. Falls back to the browser default. */
  downloadName?: string
  /** Labels for the two affordances. */
  openLabel?: string
  downloadLabel?: string
  /** Framing prose — explains what it is and that it is optional. */
  children?: ReactNode
}

/**
 * A calm, clearly-optional "bonus reading" card for a downloadable/viewable
 * resource (e.g. a supplementary PDF). Deliberately distinct from <SourceDoc>,
 * which is for the mandatory course slides — but it reuses the same in-page PDF
 * overlay so "Άνοιγμα" opens on top of the page (not a new tab).
 */
export function OptionalResource({
  href,
  title,
  downloadName,
  openLabel = 'Άνοιγμα',
  downloadLabel = 'Κατέβασμα PDF',
  children,
}: Props) {
  const [viewing, setViewing] = useState(false)

  const buttonClass = cn(
    'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium',
    'border-indigo-400/40 bg-bg/70 text-fg shadow-sm transition-colors',
    'hover:border-accent/60 hover:bg-bg',
  )

  return (
    <>
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
          <button type="button" onClick={() => setViewing(true)} className={buttonClass}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            {openLabel}
          </button>
          <a href={href} download={downloadName} className={buttonClass}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloadLabel}
          </a>
        </div>
      </aside>

      {viewing && (
        <PdfOverlay
          href={href}
          title={title}
          downloadName={downloadName}
          onClose={() => setViewing(false)}
        />
      )}
    </>
  )
}

function PdfOverlay({
  href,
  title,
  downloadName,
  onClose,
}: {
  href: string
  title: string
  downloadName?: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${title}`}
    >
      <button
        type="button"
        aria-label="Κλείσιμο"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col p-2 sm:p-4">
        <header className="flex shrink-0 items-center gap-2 rounded-t-lg border border-b-0 border-border bg-bg px-3 py-2 sm:px-4">
          <FileText className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-fg">{title}</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            aria-label="Άνοιγμα σε νέα καρτέλα"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Νέα καρτέλα</span>
          </a>
          <a
            href={href}
            download={downloadName}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            aria-label="Κατέβασμα PDF"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Κατέβασμα</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="rounded-md p-1 text-fg-muted transition-colors hover:bg-bg-soft hover:text-fg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>
        <iframe
          src={href}
          title={title}
          className="h-full w-full flex-1 rounded-b-lg border border-border bg-bg"
        />
      </div>
    </div>
  )
}
