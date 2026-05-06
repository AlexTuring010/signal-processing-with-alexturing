'use client'

import { MessageSquarePlus } from 'lucide-react'
import { useCommentTarget } from './comment-target-store'

type Props = {
  /** Visible section title that will be attached to the comment. */
  sectionTitle: string
  /**
   * Anchor / id of the section heading. Click scrolls to comments and the
   * comment is saved with this anchor so reviewers can follow the link
   * back to the exact spot.
   */
  sectionAnchor: string
}

/**
 * Small "Comment on this section" button that lives next to a heading on
 * theory pages. Clicking it sets a target in the comment-target store
 * (so the form at the bottom shows "Σχολιάζεις: [section title]") and
 * scrolls to the Comments component.
 */
export function SectionCommentButton({ sectionTitle, sectionAnchor }: Props) {
  const setTarget = useCommentTarget((s) => s.setTarget)

  const handleClick = () => {
    setTarget({ sectionTitle, sectionAnchor })
    // Scroll to comments
    if (typeof window !== 'undefined') {
      const el = document.getElementById('comments-form')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const ta = el.querySelector('textarea')
        if (ta) (ta as HTMLTextAreaElement).focus()
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-semibold text-fg-subtle transition hover:border-accent/40 hover:text-accent"
      title="Άσε σχόλιο για αυτή τη ενότητα"
    >
      <MessageSquarePlus className="h-3 w-3" aria-hidden />
      Σχόλιο
    </button>
  )
}
