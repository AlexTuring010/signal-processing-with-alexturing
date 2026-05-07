'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_VOLUME = 'cs-music-volume'
const BAR_REST_HEIGHTS = ['35%', '75%', '55%'] // ascending-ish silhouette when paused

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_VOLUME)
    if (stored !== null) {
      const v = Number(stored)
      if (!Number.isNaN(v) && v >= 0 && v <= 1) setVolume(v)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    if (hydrated) localStorage.setItem(STORAGE_VOLUME, String(volume))
  }, [volume, hydrated])

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated p-1 sm:pr-3"
      role="group"
      aria-label="Lofi μουσική"
    >
      <audio ref={audioRef} src="/audio/lofimp3.mp3" loop preload="none" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Παύση μουσικής' : 'Αναπαραγωγή lofi μουσικής'}
        title={playing ? 'Παύση' : 'Αναπαραγωγή lofi'}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Music className="h-3.5 w-3.5" />
        )}
      </button>

      <span
        className="hidden h-4 items-end gap-[3px] sm:flex"
        aria-hidden="true"
      >
        {BAR_REST_HEIGHTS.map((rest, i) => (
          <span
            key={i}
            className={cn(
              'block w-[3px] rounded-full bg-accent transition-[height,opacity] duration-200',
              playing && 'music-bar',
            )}
            style={{
              animationDelay: `${i * 130}ms`,
              height: playing ? '100%' : rest,
              opacity: playing ? 1 : 0.55,
            }}
          />
        ))}
      </span>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Ένταση μουσικής"
        className="music-slider hidden sm:block"
        style={{ '--vol': `${Math.round(volume * 100)}%` } as CSSProperties}
      />
    </div>
  )
}
