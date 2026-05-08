'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAINROT_EVENT, getBrainrot, setBrainrot } from '@/lib/storage'

/**
 * Hosted on Cloudflare R2 (public dev URL). Kept off-repo because the
 * source clip is ~180 MB and that's well past GitHub's per-file ceiling.
 * Swap to a custom domain when traffic grows past the R2.dev rate limit.
 */
const VIDEO_SRC =
  'https://pub-b657ba953f0e4b93a2dac346e16219ea.r2.dev/subway_surfers.mp4'

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
        {/* Toggle button — mirrors the pet button's aesthetic so the two
            corner widgets feel like a pair. Active state uses an accent
            ring (same as the pet button when expanded), not a fill swap. */}
        <button
          type="button"
          onClick={() => setBrainrot(!enabled)}
          aria-pressed={enabled}
          aria-label={
            enabled ? 'Κλείσε brainrot mode' : 'Άνοιξε brainrot mode'
          }
          title={enabled ? 'Brainrot: ON' : 'Brainrot: OFF'}
          className={cn(
            'group relative flex h-14 w-14 items-center justify-center overflow-visible rounded-full border border-border bg-bg-elevated shadow-lg transition-transform hover:scale-105 active:scale-95',
            enabled && 'ring-2 ring-accent/60',
          )}
        >
          {/* Soft inner background — matches PetButton */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 25%, rgb(var(--accent-soft) / 0.7), rgb(var(--bg-soft)) 70%)',
            }}
          />
          <span aria-hidden="true" className="relative text-2xl leading-none">
            🧠
          </span>
        </button>

        {/* Video panel — only when enabled.
         *
         * Single <video> sized by width; height is whatever the source's
         * natural aspect ratio dictates (no forced container aspect, no
         * black letterbox bars). Container shrinks to fit the video. */}
        {enabled && (
          <div className="brainrot-in relative overflow-hidden rounded-2xl border border-border shadow-xl">
            <video
              src={VIDEO_SRC}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="block h-auto w-[380px] sm:w-[460px]"
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
