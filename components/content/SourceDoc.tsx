'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, Eye, X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type SourceDocSource = {
  pdf: string
  slides?: string
  label?: string
}

type Props = {
  sources?: SourceDocSource | SourceDocSource[]
  note?: string
}

const PDF_BASE = '/slides/'

function pdfHref(pdf: string) {
  // Encode each path segment separately so subdirectory separators survive.
  return PDF_BASE + pdf.split('/').map(encodeURIComponent).join('/')
}

export function SourceDoc({ sources, note }: Props) {
  const list = Array.isArray(sources) ? sources : sources ? [sources] : []
  const [viewing, setViewing] = useState<SourceDocSource | null>(null)

  return (
    <>
      <aside
        className={cn(
          'my-4 rounded-lg border bg-bg-elevated/60 px-4 py-3 text-sm',
          'border-border/80 backdrop-blur-sm',
        )}
        aria-label="Πηγαίο υλικό μαθήματος"
      >
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-fg-subtle">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Πηγή — Διαφάνειες μαθήματος</span>
        </div>

        {list.length > 0 && (
          <ul className="space-y-2">
            {list.map((s) => (
              <li key={s.pdf + (s.slides ?? '')} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.85rem] text-fg">
                  {s.pdf}
                </span>
                {s.slides && (
                  <span className="text-fg-muted">
                    <span className="text-fg-subtle">σλάιντ </span>
                    <span className="font-medium text-fg">{s.slides}</span>
                  </span>
                )}
                {s.label && (
                  <span className="text-xs text-fg-subtle">· {s.label}</span>
                )}
                <span className="ml-auto inline-flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewing(s)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5',
                      'text-fg-muted transition-colors hover:border-accent/50 hover:text-fg',
                    )}
                    aria-label={`Άνοιγμα ${s.pdf}`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Άνοιγμα
                  </button>
                  <a
                    href={pdfHref(s.pdf)}
                    download={s.pdf}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5',
                      'text-fg-muted transition-colors hover:border-accent/50 hover:text-fg',
                    )}
                    aria-label={`Κατέβασμα ${s.pdf}`}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Κατέβασμα
                  </a>
                </span>
              </li>
            ))}
          </ul>
        )}

        {note && (
          <p className={cn('text-fg-muted', list.length > 0 ? 'mt-2 text-xs' : 'text-[0.85rem]')}>
            {note}
          </p>
        )}
      </aside>

      {viewing && <PdfViewerModal source={viewing} onClose={() => setViewing(null)} />}
    </>
  )
}

function PdfViewerModal({
  source,
  onClose,
}: {
  source: SourceDocSource
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

  const href = pdfHref(source.pdf)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${source.pdf}`}
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
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="truncate font-mono text-sm text-fg">{source.pdf}</span>
            {source.slides && (
              <span className="text-xs text-fg-muted">
                <span className="text-fg-subtle">σλάιντ </span>
                <span className="font-medium text-fg">{source.slides}</span>
              </span>
            )}
          </div>
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
            download={source.pdf}
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
          title={source.pdf}
          className="h-full w-full flex-1 rounded-b-lg border border-border bg-bg"
        />
      </div>
    </div>
  )
}
