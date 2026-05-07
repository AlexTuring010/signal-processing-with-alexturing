'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_VOLUME = 'cs-music-volume'

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

  const muted = volume === 0
  const VolumeIcon = muted ? VolumeX : Volume2

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated p-0.5 pr-2"
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
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
          playing
            ? 'bg-accent text-accent-fg'
            : 'text-fg-muted hover:text-fg hover:bg-bg-soft',
        )}
      >
        {playing ? <PlayingBars /> : <Music className="h-3.5 w-3.5" />}
      </button>

      <div className="hidden items-center gap-1 sm:flex">
        <VolumeIcon
          className="h-3.5 w-3.5 text-fg-subtle"
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Ένταση μουσικής"
          className="music-volume h-1 w-16 cursor-pointer"
          style={{ accentColor: 'rgb(var(--accent))' }}
        />
      </div>
    </div>
  )
}

function PlayingBars() {
  return (
    <span
      className="flex h-3.5 w-3.5 items-end justify-between gap-[2px]"
      aria-hidden="true"
    >
      <span className="music-bar h-full w-[2px] rounded-sm bg-current" style={{ animationDelay: '0ms' }} />
      <span className="music-bar h-full w-[2px] rounded-sm bg-current" style={{ animationDelay: '150ms' }} />
      <span className="music-bar h-full w-[2px] rounded-sm bg-current" style={{ animationDelay: '300ms' }} />
    </span>
  )
}
