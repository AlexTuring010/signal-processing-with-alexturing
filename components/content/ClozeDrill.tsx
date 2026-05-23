'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Type, Check, X, RotateCcw } from 'lucide-react'
import { readJSON, writeJSON } from '@/lib/storage'
import { cn } from '@/lib/utils'

export type ClozeBlank = {
  /** Stable identifier for this blank within the drill. */
  blank: string
  /** Acceptable answers (matched after lowercase + whitespace-strip). */
  accept: string[]
  /** Placeholder/aria-label hint for the input. */
  hint?: string
  /** Override the auto-sized input width. */
  size?: number
}

type Part = ReactNode | ClozeBlank

type Props = {
  /** Stable per-page identifier. */
  id: string
  prompt: ReactNode
  /** Mix of ReactNode tokens and `ClozeBlank` blank-specs; renders inline. */
  parts: Part[]
  /** Optional full solution shown when "Δες λύση" is clicked. */
  solution?: ReactNode
  title?: string
}

const STORAGE_PREFIX = 'spwa:cloze'

function isBlank(p: Part): p is ClozeBlank {
  if (!p || typeof p !== 'object') return false
  if (Array.isArray(p)) return false
  // React elements expose a $$typeof symbol — exclude them.
  if ('$$typeof' in (p as object)) return false
  const candidate = p as Partial<ClozeBlank>
  return typeof candidate.blank === 'string' && Array.isArray(candidate.accept)
}

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '')
}

type Saved = { values?: Record<string, string>; passed?: boolean }

/**
 * Ανακάλεσε — fill-in-the-blank drill. KaTeX-friendly: pass `<InlineMath>`
 * tokens between blank-specs and the result reads as one inline formula
 * with editable holes.
 */
export function ClozeDrill({
  id,
  prompt,
  parts,
  solution,
  title = 'Συμπλήρωσε τα κενά',
}: Props) {
  const pathname = usePathname() ?? ''
  const slug = pathname.replace(/^\//, '')
  const storageKey = `${STORAGE_PREFIX}:${slug}:${id}`

  const blanks = parts.filter(isBlank)

  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, boolean> | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = readJSON<Saved | null>(storageKey, null)
    if (saved?.values) setValues(saved.values)
    if (saved?.passed) {
      const all: Record<string, boolean> = {}
      for (const b of blanks) all[b.blank] = true
      setChecked(all)
    }
    setHydrated(true)
    // blanks is derived from props on each render; storageKey is the meaningful dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  function setValue(blank: string, v: string) {
    const next = { ...values, [blank]: v }
    setValues(next)
    setChecked(null)
    writeJSON<Saved>(storageKey, { values: next, passed: false })
  }

  function check() {
    const result: Record<string, boolean> = {}
    let allPass = blanks.length > 0
    for (const b of blanks) {
      const v = norm(values[b.blank] ?? '')
      const ok = v.length > 0 && b.accept.some((a) => norm(a) === v)
      result[b.blank] = ok
      if (!ok) allPass = false
    }
    setChecked(result)
    writeJSON<Saved>(storageKey, { values, passed: allPass })
  }

  function reset() {
    setValues({})
    setChecked(null)
    setRevealed(false)
    writeJSON<Saved>(storageKey, { values: {}, passed: false })
  }

  const passed =
    hydrated &&
    checked !== null &&
    blanks.length > 0 &&
    Object.values(checked).every(Boolean)

  return (
    <section
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border bg-accent-soft/15',
        passed ? 'border-success/50' : 'border-accent/40',
      )}
    >
      <div className="flex items-center gap-2 border-b border-accent/30 px-4 py-2.5">
        <Type className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">{title}</span>
        {passed && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
            <Check className="h-3 w-3" aria-hidden="true" />
            Σωστά
          </span>
        )}
      </div>

      <div className="px-4 pt-3 text-[0.95rem] leading-relaxed">{prompt}</div>

      <div className="px-4 pt-3">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2 text-[0.98rem] leading-relaxed">
          {parts.map((p, i) => {
            if (!isBlank(p)) {
              return <span key={i}>{p}</span>
            }
            const ok = checked?.[p.blank]
            const inputSize = p.size ?? Math.max(3, p.accept[0]?.length ?? 4)
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={values[p.blank] ?? ''}
                  onChange={(e) => setValue(p.blank, e.target.value)}
                  size={inputSize}
                  placeholder={p.hint ?? '?'}
                  aria-label={p.hint ?? `Κενό ${i + 1}`}
                  className={cn(
                    'rounded border bg-bg px-1.5 py-0.5 text-center font-mono text-[0.95em] outline-none transition',
                    ok === true
                      ? 'border-success/60 bg-success/10 text-success'
                      : ok === false
                        ? 'border-rose-400/60 bg-rose-400/10'
                        : 'border-border focus:border-accent',
                  )}
                  autoComplete="off"
                  spellCheck={false}
                />
                {ok === true && (
                  <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                )}
                {ok === false && (
                  <X className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                )}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={check}
          disabled={blanks.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent-soft/40 px-3 py-1.5 text-sm font-medium transition hover:bg-accent-soft/60 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Έλεγξε
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg-muted transition hover:border-fg-muted/40 hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Άδειασε
        </button>
        {solution && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg-muted transition hover:border-fg-muted/40 hover:text-fg"
            aria-expanded={revealed}
          >
            {revealed ? 'Κρύψε λύση' : 'Δες λύση'}
          </button>
        )}
      </div>

      {revealed && solution && (
        <div className="border-t border-border bg-bg px-4 py-3 text-[0.95rem] leading-relaxed">
          {solution}
        </div>
      )}
    </section>
  )
}
