'use client'

import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getCollectible } from '@/lib/collectibles/registry'
import type { CollectibleId, ItemRenderProps } from '@/lib/collectibles/types'

const AUTO_DISMISS_MS = 5000

/**
 * Slide-down banner anchored to the top of the viewport. Renders the
 * head-of-queue pending banner; on dismiss (auto-timer or click) the
 * next one slides in. Mount this once at the root layout — it's a
 * page-spanning UI element, not a component panel.
 */
export function FindBanner() {
  const banners = useCollectiblesStore((s) => s.banners)
  const dismiss = useCollectiblesStore((s) => s.dismissBanner)

  const head = banners[0]

  if (!head) return null
  return <SingleBanner key={head.seq} seq={head.seq} id={head.id} onDismiss={() => dismiss(head.seq)} />
}

function SingleBanner({
  seq,
  id,
  onDismiss,
}: {
  seq: number
  id: CollectibleId
  onDismiss: () => void
}) {
  const item = getCollectible(id)
  const [leaving, setLeaving] = useState(false)

  // Schedule auto-dismiss. Leaving state plays the slide-up animation;
  // the actual store dismissal fires after the animation duration.
  useEffect(() => {
    const t = window.setTimeout(() => setLeaving(true), AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [seq])

  useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(onDismiss, 220)
    return () => window.clearTimeout(t)
  }, [leaving, onDismiss])

  if (!item) {
    onDismiss()
    return null
  }

  // We render the item's sprite at small scale by inlining the SVG
  // viewBox and translating the item's anchor down toward the visible
  // window. Phase 5's real sprites will be readable at this size.
  const itemProps: ItemRenderProps = { stage: 'baby', mood: 'neutral', adult: false }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-3',
      )}
    >
      <button
        type="button"
        onClick={() => setLeaving(true)}
        className={cn(
          'pointer-events-auto inline-flex max-w-md items-center gap-3 rounded-full border border-success/30 bg-success/95 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-sm hover:scale-[1.02]',
          leaving ? 'find-banner-out' : 'find-banner-in',
        )}
      >
        {/* Item sprite preview — rendered at 36 px in a tiny SVG. The
            sprite's anchored coordinates land it in the viewBox center
            after a small translation. */}
        <svg
          viewBox="40 18 40 50"
          width="36"
          height="36"
          aria-hidden="true"
          className="shrink-0 rounded-full bg-white/15 p-0.5"
        >
          <item.Sprite {...itemProps} />
        </svg>
        <span className="flex flex-1 flex-col text-left leading-tight">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider opacity-80">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Νέο συλλεκτικό
          </span>
          <span className="text-sm font-semibold">{item.name}</span>
        </span>
        <X className="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />
      </button>
    </div>
  )
}
