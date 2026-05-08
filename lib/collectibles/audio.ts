'use client'

import { readJSON, STORAGE_KEYS } from '../storage'

/**
 * Collectibles SFX. Same chiptune approach as `lib/pet/audio.ts` and
 * `lib/orchard/audio.ts`: short oscillator envelopes, no audio assets,
 * conservative master volume. Reuses the existing pet sound toggle so
 * one switch covers the whole site.
 */

const MASTER = 0.11

let ctx: AudioContext | null = null
let cached: boolean | null = null

function isBrowser() {
  return typeof window !== 'undefined'
}

function ensureCtx(): AudioContext | null {
  if (!isBrowser()) return null
  if (ctx) return ctx
  type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext }
  const w = window as WindowWithWebkit
  const Ctor = window.AudioContext ?? w.webkitAudioContext
  if (!Ctor) return null
  try {
    ctx = new Ctor()
    return ctx
  } catch {
    return null
  }
}

function isEnabled(): boolean {
  if (!isBrowser()) return false
  if (cached === null) cached = readJSON<boolean>(STORAGE_KEYS.petSound, true)
  return cached
}

/** Re-read the toggle value. Called when the user flips the sound switch. */
export function refreshCollectibleSoundFlag() {
  cached = null
}

type Note = {
  freq: number
  dur: number
  at?: number
  type?: OscillatorType
  vol?: number
}

function playNotes(notes: Note[]) {
  if (!isBrowser() || !isEnabled()) return
  const c = ensureCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})

  const t0 = c.currentTime + 0.005
  for (const n of notes) {
    const start = t0 + (n.at ?? 0)
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = n.type ?? 'square'
    osc.frequency.setValueAtTime(n.freq, start)
    const peak = MASTER * (n.vol ?? 1)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(
      peak,
      start + Math.min(0.012, n.dur * 0.3),
    )
    gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(start)
    osc.stop(start + n.dur + 0.02)
  }
}

export type CollectibleSoundKind = 'discover' | 'place' | 'equip'

export function playCollectibleSound(kind: CollectibleSoundKind) {
  switch (kind) {
    case 'discover':
      // Sparkle chime — five-note rising arpeggio, soft triangle waves
      playNotes([
        { freq: 784, dur: 0.05, at: 0, type: 'triangle', vol: 0.7 },
        { freq: 988, dur: 0.05, at: 0.06, type: 'triangle', vol: 0.7 },
        { freq: 1319, dur: 0.06, at: 0.12, type: 'triangle', vol: 0.7 },
        { freq: 1568, dur: 0.06, at: 0.19, type: 'triangle', vol: 0.6 },
        { freq: 2093, dur: 0.14, at: 0.26, type: 'triangle', vol: 0.55 },
      ])
      break
    case 'place':
      // Quiet thunk — short low tone
      playNotes([
        { freq: 196, dur: 0.06, at: 0, type: 'sawtooth', vol: 0.5 },
        { freq: 147, dur: 0.08, at: 0.06, type: 'sawtooth', vol: 0.4 },
      ])
      break
    case 'equip':
      // Fabric swoosh — two-note descent
      playNotes([
        { freq: 1175, dur: 0.05, at: 0, type: 'triangle', vol: 0.55 },
        { freq: 880, dur: 0.08, at: 0.05, type: 'triangle', vol: 0.5 },
      ])
      break
  }
}
