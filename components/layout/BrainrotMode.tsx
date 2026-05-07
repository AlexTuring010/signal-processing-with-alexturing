'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { BRAINROT_EVENT, getBrainrot, setBrainrot } from '@/lib/storage'

/**
 * The joke "second screen" companion. When enabled, a small Subway Surfers
 * loop sticks to the bottom-right corner — opposite the pet button so the
 * two corners stay visually separate. Muted + playsInline, so autoplay
 * works on every browser and it never grabs audio focus.
 *
 * Toggled from the pet panel footer (🧠 button). Off by default; the flag
 * lives in localStorage and broadcasts an in-tab custom event so the panel
 * appears/disappears without a reload.
 */
export function BrainrotMode() {
  const [enabled, setEnabled] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setEnabled(getBrainrot())
    setHydrated(true)
  }, [])

  useEffect(() => {
    function refresh() {
      setEnabled(getBrainrot())
    }
    function onStorage(e: StorageEvent) {
      if (e.key === 'spwa:brainrot') refresh()
    }
    window.addEventListener(BRAINROT_EVENT, refresh)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(BRAINROT_EVENT, refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  if (!hydrated || !enabled) return null

  function close() {
    setBrainrot(false)
  }

  return (
    <div className="brainrot-in fixed bottom-4 right-4 z-[60] print:hidden">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-xl">
        <video
          src="/subway_surfers.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          // Conservative width — small enough to feel like a "second screen"
          // sticker, not big enough to compete with study content.
          className="block w-[180px] sm:w-[220px]"
        />
        {/* Watermark label — pure flavour. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
        >
          🧠 brainrot
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Κλείσε brainrot mode"
          title="Κλείσε"
          className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/85"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
