'use client'

import Link from 'next/link'
import { BookOpen, ArrowUpRight } from 'lucide-react'
import { SECTION_TITLES } from '@/content/practice/types'

type Props = {
  prerequisites: string[]
  /** Position in the path. Passed as `?n=N` so the destination page can
   *  show the "Επιστροφή στην άσκηση N" banner. */
  position: number
}

/**
 * The prominent «Δεν τα ξέρεις; Διάβασε πρώτα:» panel shown above each
 * problem in crunch mode. Bigger and louder than the tiny `<PrereqChips>`
 * row used in the regular practice library, because in crunch mode this
 * IS the just-in-time learning loop — students need it to be unmissable.
 */
export function SosePrereqLinks({ prerequisites, position }: Props) {
  const isFallback = prerequisites.length === 0
  const effectivePrereqs = isFallback ? ['intro'] : prerequisites
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
      <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
        <BookOpen className="h-4 w-4" aria-hidden />
        {isFallback
          ? 'Δεν είσαι σίγουρος από πού να ξεκινήσεις; Ξεκίνα από:'
          : 'Δεν τα ξέρεις; Διάβασε πρώτα:'}
      </p>
      <div className="flex flex-wrap gap-2">
        {effectivePrereqs.map((slug) => (
          <Link
            key={slug}
            href={`/${slug}?from=sose&n=${position}`}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-bg-elevated px-3 py-1.5 text-sm font-medium text-fg transition hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
          >
            {SECTION_TITLES[slug] ?? slug}
            <ArrowUpRight
              className="h-3.5 w-3.5 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-600 dark:group-hover:text-amber-400"
              aria-hidden
            />
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-fg-muted">
        Ανοίγει τη θεωρία με ένα κουμπί «← Επιστροφή στην άσκηση {position}»
        στην κορυφή — δεν θα χαθείς.
      </p>
    </div>
  )
}
