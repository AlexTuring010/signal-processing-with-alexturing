import { FileText, Download } from 'lucide-react'
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
  return PDF_BASE + encodeURIComponent(pdf)
}

export function SourceDoc({ sources, note }: Props) {
  const list = Array.isArray(sources) ? sources : sources ? [sources] : []

  return (
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
              <a
                href={pdfHref(s.pdf)}
                download={s.pdf}
                className={cn(
                  'inline-flex items-center gap-1.5 font-mono text-[0.85rem]',
                  'text-accent underline decoration-accent/30 underline-offset-2',
                  'hover:decoration-accent transition-colors',
                )}
              >
                <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {s.pdf}
              </a>
              {s.slides && (
                <span className="text-fg-muted">
                  <span className="text-fg-subtle">σλάιντ </span>
                  <span className="font-medium text-fg">{s.slides}</span>
                </span>
              )}
              {s.label && (
                <span className="text-xs text-fg-subtle">· {s.label}</span>
              )}
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
  )
}
