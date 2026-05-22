'use client'

/**
 * Pseudocode — a collapsed-by-default, line-numbered code panel.
 *
 * Natural language stays the primary, always-visible explanation; the
 * pseudocode is one deliberate click away (the click itself is a small
 * retrieval prompt — "can I recall it before I open it?"). Used inside
 * `Algorithm`, but works standalone too.
 *
 * We render the code with plain <div> rows rather than <pre>/<code> so the
 * global `.prose-content pre/code` rules don't fight our styling. There is
 * no syntax highlighter — the course "pseudocode" is Greek algorithmic
 * prose, which no language grammar fits.
 */

import { useState, type ReactNode } from 'react'
import { ChevronDown, Code2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** The pseudocode, authored as a template literal so newlines survive. */
  code: string
  title?: string
  defaultOpen?: boolean
  /** Optional note shown under the code (e.g. what the variables mean). */
  caption?: ReactNode
}

export function Pseudocode({
  code,
  title = 'Ψευδοκώδικας',
  defaultOpen = false,
  caption,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)
  const lines = code.replace(/\s+$/, '').split('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-border bg-bg-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-bg-elevated/70"
      >
        <Code2 className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight text-fg">{title}</span>
        <span className="hidden shrink-0 rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle sm:inline">
          δευτερεύον
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-fg-muted transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-border">
          <div className="relative">
            <button
              type="button"
              onClick={copy}
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
              aria-label="Αντιγραφή ψευδοκώδικα"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied ? 'Αντιγράφηκε' : 'Αντιγραφή'}
            </button>
            <div className="overflow-x-auto py-3 pl-3 pr-3 font-mono text-[0.86rem] leading-relaxed">
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[1.75rem_1fr] gap-2">
                  <span className="select-none text-right text-fg-subtle/70" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre text-fg">{line || ' '}</span>
                </div>
              ))}
            </div>
          </div>
          {caption && (
            <div className="border-t border-border px-3 py-2 text-xs leading-relaxed text-fg-muted">
              {caption}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
