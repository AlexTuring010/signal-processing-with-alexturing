'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAINROT_EVENT, getBrainrot, setBrainrot } from '@/lib/storage'

/**
 * Joke "second screen" companion: a small Subway Surfers loop that sticks
 * to the bottom-right corner — opposite the pet button so the two corners
 * stay visually separate. Off by default; flag persists in localStorage.
 *
 * The toggle button lives at the bottom of this corner stack and is always
 * visible. When the user enables brainrot mode, the video panel slides in
 * above the button. The video is muted + playsInline so autoplay works on
 * every browser and it never grabs audio focus.
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

  // Avoid SSR/CSR mismatch — only render after we've checked the flag.
  if (!hydrated) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] print:hidden">
      <div className="flex flex-col-reverse items-end gap-2">
        {/* Toggle button — always visible. */}
        <button
          type="button"
          onClick={() => setBrainrot(!enabled)}
          aria-pressed={enabled}
          aria-label={
            enabled ? 'Κλείσε brainrot mode' : 'Άνοιξε brainrot mode'
          }
          title={enabled ? 'Brainrot: ON' : 'Brainrot: OFF'}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full border border-border shadow-lg transition-transform hover:scale-105 active:scale-95',
            enabled
              ? 'bg-accent text-accent-fg'
              : 'bg-bg-elevated text-fg-muted hover:text-fg',
          )}
        >
          <span aria-hidden="true" className="text-lg leading-none">
            🧠
          </span>
        </button>

        {/* Video panel — only when enabled. */}
        {enabled && (
          <div className="brainrot-in relative overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-xl">
            <video
              src="/subway_surfers.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="block w-[180px] sm:w-[220px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            >
              🧠 brainrot
            </div>
            <button
              type="button"
              onClick={() => setBrainrot(false)}
              aria-label="Κλείσε brainrot mode"
              title="Κλείσε"
              className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/85"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
