'use client'

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  SkipForward,
} from 'lucide-react'

type Props = {
  position: number
  total: number
  solved: boolean
  onPrev: () => void
  onNext: () => void
  onMarkSolved: () => void
}

/**
 * Bottom-of-page navigation: prev / mark-solved / skip / next.
 * Once solved, "Επόμενη" gets emphasized so the student feels rewarded
 * for finishing and is pulled forward into the next problem.
 */
export function SoseNav({
  position,
  total,
  solved,
  onPrev,
  onNext,
  onMarkSolved,
}: Props) {
  const atStart = position <= 1
  const atEnd = position >= total

  return (
    <nav
      className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-bg-elevated p-3 shadow-sm"
      aria-label="Πλοήγηση ασκήσεων"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={atStart}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-3 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Προηγούμενη</span>
      </button>

      <button
        type="button"
        onClick={onMarkSolved}
        aria-pressed={solved}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition ${
          solved
            ? 'border-success/50 bg-success/10 text-success hover:bg-success/15'
            : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg'
        }`}
        title="Συντόμευση: S"
      >
        {solved ? (
          <>
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Λυμένη</span>
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Σήμανε ως λυμένη</span>
            <span className="sm:hidden">Λύθηκε</span>
          </>
        )}
      </button>

      <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-fg-subtle">
        <span className="hidden font-mono tabular-nums sm:inline">
          {position} / {total}
        </span>
      </span>

      {!solved && !atEnd && (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-3 py-2 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg"
          title="Παρέλειψε χωρίς να σημανθεί"
        >
          <SkipForward className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Παράλειψε</span>
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        className={`inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
          solved
            ? 'border-rose-500 bg-rose-500 text-white shadow-sm hover:bg-rose-600'
            : 'border-accent/50 bg-accent/10 text-accent hover:bg-accent/20'
        }`}
        title="Συντόμευση: →"
      >
        <span className="hidden sm:inline">
          {solved ? 'Επόμενη →' : 'Επόμενη'}
        </span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  )
}
