'use client'

import { readJSON, writeJSON, STORAGE_KEYS } from '../storage'
import type { ActionKind } from './types'

/**
 * Tiny chiptune-style sound effects synthesized with WebAudio. No asset
 * bundling — every beep is built from square/triangle oscillators with
 * short attack/decay envelopes, so it has the classic 90s Tamagotchi feel.
 *
 * Design rules:
 *  - All sounds are < 600 ms.
 *  - Master volume is conservative (0.12) so they're noticeable but not
 *    competing with the lofi music player.
 *  - The AudioContext is lazy-created on first play so we don't trip
 *    Chrome's "no audio without user gesture" warning.
 *  - Mute state persists in localStorage. Default: ON (the iconic Tamagotchi
 *    chirps are the whole point of asking for sound), with an obvious toggle.
 */

const MASTER = 0.12

let ctx: AudioContext | null = null
let enabled: boolean | null = null // lazy-loaded from localStorage

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

export function getSoundEnabled(): boolean {
  if (!isBrowser()) return false
  if (enabled === null) {
    enabled = readJSON<boolean>(STORAGE_KEYS.petSound, true)
  }
  return enabled
}

export function setSoundEnabled(next: boolean): void {
  enabled = next
  writeJSON(STORAGE_KEYS.petSound, next)
}

type Note = {
  freq: number
  /** Duration in seconds. */
  dur: number
  /** Optional delay (s) from the start of the sequence. */
  at?: number
  type?: OscillatorType
  /** Per-note volume multiplier (relative to master). */
  vol?: number
}

function playNotes(notes: Note[]) {
  if (!isBrowser() || !getSoundEnabled()) return
  const c = ensureCtx()
  if (!c) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
  }

  const t0 = c.currentTime + 0.005

  for (const n of notes) {
    const start = t0 + (n.at ?? 0)
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = n.type ?? 'square'
    osc.frequency.setValueAtTime(n.freq, start)
    const peak = MASTER * (n.vol ?? 1)
    // Short AD envelope. Avoids clicks at note boundaries.
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.012, n.dur * 0.3))
    gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start(start)
    osc.stop(start + n.dur + 0.02)
  }
}

/** Play the SFX for a given action. Silently no-ops when muted. */
export function playPetSound(kind: ActionKind | 'study' | 'click' | 'evolve'): void {
  switch (kind) {
    case 'feed':
      playNotes([
        { freq: 440, dur: 0.08, at: 0 },
        { freq: 660, dur: 0.1, at: 0.08 },
      ])
      break
    case 'play':
      playNotes([
        { freq: 523, dur: 0.06, at: 0 },
        { freq: 659, dur: 0.06, at: 0.06 },
        { freq: 784, dur: 0.1, at: 0.12 },
      ])
      break
    case 'sleep':
      // descending yawn
      playNotes([
        { freq: 392, dur: 0.12, at: 0, type: 'triangle' },
        { freq: 262, dur: 0.18, at: 0.12, type: 'triangle' },
      ])
      break
    case 'pet':
      playNotes([{ freq: 880, dur: 0.12, type: 'triangle', vol: 0.7 }])
      break
    case 'heal':
      playNotes([
        { freq: 784, dur: 0.07, at: 0, type: 'triangle' },
        { freq: 988, dur: 0.07, at: 0.07, type: 'triangle' },
        { freq: 1175, dur: 0.12, at: 0.14, type: 'triangle' },
      ])
      break
    case 'hatch':
      // rumble + cheep
      playNotes([
        { freq: 110, dur: 0.18, at: 0, type: 'sawtooth', vol: 0.5 },
        { freq: 880, dur: 0.06, at: 0.22 },
        { freq: 1175, dur: 0.06, at: 0.3 },
        { freq: 1568, dur: 0.12, at: 0.38 },
      ])
      break
    case 'study':
      // small sparkle, quieter
      playNotes([
        { freq: 988, dur: 0.05, at: 0, type: 'triangle', vol: 0.6 },
        { freq: 1318, dur: 0.08, at: 0.06, type: 'triangle', vol: 0.6 },
      ])
      break
    case 'click':
      playNotes([{ freq: 660, dur: 0.04, type: 'square', vol: 0.5 }])
      break
    case 'evolve':
      playNotes([
        { freq: 523, dur: 0.06, at: 0 },
        { freq: 659, dur: 0.06, at: 0.07 },
        { freq: 784, dur: 0.06, at: 0.14 },
        { freq: 1047, dur: 0.16, at: 0.21 },
      ])
      break
  }
}
