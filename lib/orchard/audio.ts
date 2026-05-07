'use client'

import { readJSON, STORAGE_KEYS } from '../storage'

/**
 * Orchard SFX. Same chiptune approach as `lib/pet/audio.ts`: short
 * square/triangle envelopes, no audio assets bundled, master volume kept
 * conservative so the SFX layer doesn't fight the music player.
 *
 * Reuses the existing pet sound toggle (`STORAGE_KEYS.petSound`) so flipping
 * the volume in the pet panel footer also mutes the orchard.
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
export function refreshOrchardSoundFlag() {
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

export type OrchardSoundKind =
  | 'plant'
  | 'harvest'
  | 'harvest-all'
  | 'sell'
  | 'autosell'
  | 'build'
  | 'upgrade'
  | 'collect'
  | 'research-start'
  | 'research-done'
  | 'click'
  | 'error'

/** Play a one-shot SFX. No-op when muted or in SSR. */
export function playOrchardSound(kind: OrchardSoundKind) {
  switch (kind) {
    case 'plant':
      // Rising "dig + sprout" — low rumble + bright chirp
      playNotes([
        { freq: 220, dur: 0.08, at: 0, type: 'sawtooth', vol: 0.4 },
        { freq: 660, dur: 0.05, at: 0.08, type: 'triangle' },
        { freq: 880, dur: 0.08, at: 0.13, type: 'triangle' },
      ])
      break
    case 'harvest':
      // Soft "plonk" — short pluck
      playNotes([
        { freq: 740, dur: 0.05, type: 'triangle', vol: 0.7 },
        { freq: 990, dur: 0.06, at: 0.05, type: 'triangle', vol: 0.6 },
      ])
      break
    case 'harvest-all':
      // Bigger "shower of fruit" — three quick descending pops
      playNotes([
        { freq: 1175, dur: 0.04, at: 0, type: 'triangle' },
        { freq: 988, dur: 0.04, at: 0.04, type: 'triangle' },
        { freq: 880, dur: 0.06, at: 0.08, type: 'triangle' },
        { freq: 740, dur: 0.08, at: 0.13, type: 'triangle' },
      ])
      break
    case 'sell':
      // Classic two-note "ka-ching"
      playNotes([
        { freq: 988, dur: 0.06, at: 0, type: 'square', vol: 0.7 },
        { freq: 1318, dur: 0.12, at: 0.06, type: 'triangle', vol: 0.7 },
      ])
      break
    case 'autosell':
      // Quieter ka-ching — for the unattended auto-sale
      playNotes([
        { freq: 988, dur: 0.05, at: 0, type: 'square', vol: 0.45 },
        { freq: 1318, dur: 0.08, at: 0.05, type: 'triangle', vol: 0.45 },
      ])
      break
    case 'build':
      // Hammer thud + bright finish
      playNotes([
        { freq: 165, dur: 0.06, at: 0, type: 'sawtooth', vol: 0.6 },
        { freq: 220, dur: 0.06, at: 0.06, type: 'sawtooth', vol: 0.6 },
        { freq: 1047, dur: 0.18, at: 0.14, type: 'triangle' },
      ])
      break
    case 'upgrade':
      // Rising 4-note flourish
      playNotes([
        { freq: 523, dur: 0.05, at: 0, type: 'square' },
        { freq: 659, dur: 0.05, at: 0.05, type: 'square' },
        { freq: 784, dur: 0.05, at: 0.1, type: 'square' },
        { freq: 1047, dur: 0.14, at: 0.15, type: 'triangle' },
      ])
      break
    case 'collect':
      // Three quick sparkle taps
      playNotes([
        { freq: 1175, dur: 0.04, at: 0, type: 'triangle', vol: 0.6 },
        { freq: 1568, dur: 0.04, at: 0.05, type: 'triangle', vol: 0.6 },
        { freq: 1976, dur: 0.08, at: 0.1, type: 'triangle', vol: 0.5 },
      ])
      break
    case 'research-start':
      // Two-note "powering up"
      playNotes([
        { freq: 392, dur: 0.06, at: 0, type: 'triangle' },
        { freq: 587, dur: 0.12, at: 0.07, type: 'triangle' },
      ])
      break
    case 'research-done':
      // Triumphant 5-note arpeggio
      playNotes([
        { freq: 523, dur: 0.07, at: 0 },
        { freq: 659, dur: 0.07, at: 0.08 },
        { freq: 784, dur: 0.07, at: 0.16 },
        { freq: 1047, dur: 0.07, at: 0.24 },
        { freq: 1319, dur: 0.18, at: 0.32, type: 'triangle' },
      ])
      break
    case 'click':
      // Tiny click for tab/menu changes
      playNotes([{ freq: 880, dur: 0.03, type: 'square', vol: 0.35 }])
      break
    case 'error':
      // Soft "nope"
      playNotes([
        { freq: 220, dur: 0.06, type: 'square', vol: 0.45 },
        { freq: 165, dur: 0.1, at: 0.05, type: 'square', vol: 0.45 },
      ])
      break
  }
}
