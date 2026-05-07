'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowLeft, Heart, Play, RotateCcw, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePetStore } from '@/lib/pet/store'
import { playPetSound } from '@/lib/pet/audio'
import { useOrchardStore } from '@/lib/orchard/store'
import { PetSprite } from './PetSprite'

/* -------------------------------------------------------------------------- */
/*  Apple Catcher — survival arcade minigame embedded in the pet panel.       */
/*                                                                            */
/*  Lives, not time. You start with 5 ❤. Missing a normal apple or catching  */
/*  a rotten one costs a life. Game ends when lives reach 0. Difficulty       */
/*  ramps continuously, so a skilled run can theoretically last forever —     */
/*  the score ceiling is your skill, not the RNG of a 30-second window.       */
/*                                                                            */
/*  All hot game state lives in a `ref`; the React tree only re-renders on    */
/*  the rAF tick (via a counter) and on phase transitions. This keeps the     */
/*  60-fps update path lean even on lower-spec devices.                       */
/* -------------------------------------------------------------------------- */

const PLAY_W = 248
const PLAY_H = 280
const PET_W = 60
const PET_H = 56
const APPLE_R = 13
const PET_SPEED = 240 // px/s
const STARTING_LIVES = 5
const COMBO_THRESHOLD = 5

/** Spawn interval (ms) as a function of elapsed seconds. Linear ramp with a floor. */
function spawnIntervalFor(elapsedS: number) {
  return Math.max(220, 1100 - elapsedS * 22)
}
/** Apple base fall speed (px/s) as a function of elapsed seconds. Linear ramp with a cap. */
function fallSpeedFor(elapsedS: number) {
  return Math.min(340, 110 + elapsedS * 4)
}
/** Probability of a *second* apple spawning at the same instant (kicks in late game). */
function doubleSpawnProbFor(elapsedS: number) {
  if (elapsedS < 45) return 0
  return Math.min(0.3, (elapsedS - 45) / 60)
}

type AppleType = 'normal' | 'golden' | 'rotten'
type Phase = 'intro' | 'playing' | 'result'

type Apple = {
  id: number
  x: number
  y: number
  vy: number
  rot: number
  vrot: number
  type: AppleType
}

type Pop = {
  id: number
  x: number
  y: number
  text: string
  tone: 'good' | 'great' | 'bad'
  bornAt: number
}

type GameRef = {
  petX: number
  petVxInput: -1 | 0 | 1 // current movement input
  apples: Apple[]
  pops: Pop[]
  score: number
  caught: number
  /** Caught counts split by type — feed the orchard reward hook. */
  caughtNormal: number
  caughtGolden: number
  combo: number
  bestCombo: number
  lives: number
  startedAt: number
  lastFrameAt: number
  lastSpawnAt: number
  pausedAt: number | null // timestamp when tab hidden, null otherwise
  pauseDebt: number       // total ms spent paused
  finalSurvivedMs: number // captured at game-end so the result screen can show it
  appleSeq: number
  popSeq: number
}

type Props = {
  onExit: () => void
}

export function MiniGame({ onExit }: Props) {
  const startGame = usePetStore((s) => s.startGame)
  const endGame = usePetStore((s) => s.endGame)
  const canPlayGame = usePetStore((s) => s.canPlayGame)
  const getHighScore = usePetStore((s) => s.getHighScore)

  const [phase, setPhase] = useState<Phase>('intro')
  const [, force] = useReducer((n: number) => n + 1, 0)
  const [highScore, setHighScore] = useState(0)
  const [result, setResult] = useState<
    | {
        score: number
        reward: number
        high: number
        newBest: boolean
        /** Set when the orchard is in play and absorbed the round. */
        bonus?: { apples: number; stars: number }
      }
    | null
  >(null)

  const ref = useRef<GameRef>(makeInitialRef())
  const rafRef = useRef<number | null>(null)
  const playRef = useRef<HTMLDivElement>(null)
  // Held-input tracking (so left+right both held = 0)
  const heldRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false })

  useEffect(() => {
    setHighScore(getHighScore())
  }, [getHighScore])

  // ---- Round lifecycle --------------------------------------------------------

  function tryStart() {
    const status = canPlayGame()
    if (!status.ok) return
    const ok = startGame()
    if (!ok) return
    ref.current = makeInitialRef()
    ref.current.startedAt = performance.now()
    ref.current.lastFrameAt = ref.current.startedAt
    setPhase('playing')
  }

  function finishRound() {
    const g = ref.current
    g.finalSurvivedMs = performance.now() - g.startedAt - g.pauseDebt
    const score = Math.max(0, g.score)
    const r = endGame(score)
    // If the orchard is in play, deposit the run's caught apples into the
    // barn AND convert score to ⭐ (capped per-run + per-day). The pet
    // happiness reward `r` still fires regardless — the two payouts
    // complement each other rather than replace.
    const orchard = useOrchardStore.getState()
    let bonus = { apples: 0, stars: 0 }
    if (orchard.hydrated) {
      bonus = orchard.applyMinigameReward(g.caughtNormal, g.caughtGolden, score)
    }
    setResult({ score, ...r, bonus })
    setHighScore(r.high)
    if (r.newBest && score > 0) playPetSound('newbest')
    else playPetSound('victory')
    setPhase('result')
  }

  // ---- rAF loop ---------------------------------------------------------------

  useEffect(() => {
    if (phase !== 'playing') return

    function frame(t: number) {
      const g = ref.current
      // Handle paused-mid-round (tab hidden) — skip elapsed time.
      if (g.pausedAt !== null) {
        rafRef.current = requestAnimationFrame(frame)
        return
      }
      const dt = Math.min(0.05, (t - g.lastFrameAt) / 1000) // clamp dt during stutters
      g.lastFrameAt = t

      const elapsed = t - g.startedAt - g.pauseDebt
      const elapsedS = elapsed / 1000
      if (g.lives <= 0) {
        rafRef.current = null
        finishRound()
        return
      }

      // ---- Pet movement ----
      g.petX += g.petVxInput * PET_SPEED * dt
      if (g.petX < 0) g.petX = 0
      if (g.petX > PLAY_W - PET_W) g.petX = PLAY_W - PET_W

      // ---- Spawn apples ----
      const spawnInterval = spawnIntervalFor(elapsedS)
      const baseFall = fallSpeedFor(elapsedS)
      if (t - g.lastSpawnAt >= spawnInterval) {
        g.lastSpawnAt = t
        g.apples.push(spawnApple(g, baseFall))
        // Late-game double-spawn for an extra bit of chaos.
        if (Math.random() < doubleSpawnProbFor(elapsedS)) {
          g.apples.push(spawnApple(g, baseFall))
        }
      }

      // ---- Apple physics + collision ----
      const newApples: Apple[] = []
      for (const a of g.apples) {
        a.y += a.vy * dt
        a.rot += a.vrot * dt
        const petTopY = PLAY_H - PET_H + 4 // small forgiveness so collisions feel right
        if (a.y + APPLE_R >= petTopY) {
          // Either caught or hit the floor.
          const cx = g.petX + PET_W / 2
          const halfHit = PET_W * 0.45 + APPLE_R * 0.6
          const overlap = Math.abs(a.x - cx) <= halfHit
          if (overlap) {
            handleCatch(g, a, t)
          } else if (a.y >= PLAY_H - APPLE_R) {
            handleMiss(g, a, t)
          } else {
            // still in play, ground not reached and not overlapping — keep
            newApples.push(a)
            continue
          }
          continue // dropped from active list
        }
        newApples.push(a)
      }
      g.apples = newApples

      // ---- Prune expired pops ----
      g.pops = g.pops.filter((p) => t - p.bornAt < 800)

      force()
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // intentionally only re-binds when phase flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ---- Visibility pause -------------------------------------------------------
  useEffect(() => {
    function onVis() {
      const g = ref.current
      if (document.hidden) {
        if (g.pausedAt === null) g.pausedAt = performance.now()
      } else if (g.pausedAt !== null) {
        const now = performance.now()
        g.pauseDebt += now - g.pausedAt
        g.pausedAt = null
        g.lastFrameAt = now
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // ---- Keyboard input ---------------------------------------------------------
  useEffect(() => {
    if (phase !== 'playing') return
    function applyHeld() {
      const { left, right } = heldRef.current
      ref.current.petVxInput = left && !right ? -1 : right && !left ? 1 : 0
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (!heldRef.current.left) {
          heldRef.current.left = true
          applyHeld()
        }
        e.preventDefault()
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (!heldRef.current.right) {
          heldRef.current.right = true
          applyHeld()
        }
        e.preventDefault()
      } else if (e.key === 'Escape') {
        // Quick exit mid-round → end with current score.
        finishRound()
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        heldRef.current.left = false
        applyHeld()
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        heldRef.current.right = false
        applyHeld()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      heldRef.current = { left: false, right: false }
      ref.current.petVxInput = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ---- Pointer (touch + mouse) ------------------------------------------------
  function pointerHandler(side: 'left' | 'right', down: boolean) {
    return (e: React.PointerEvent) => {
      e.preventDefault()
      heldRef.current[side] = down
      const { left, right } = heldRef.current
      ref.current.petVxInput = left && !right ? -1 : right && !left ? 1 : 0
      if (down && e.currentTarget instanceof HTMLElement) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          /* some browsers throw on pointerCapture for synthetic events */
        }
      }
    }
  }

  // ---- Render -----------------------------------------------------------------

  const g = ref.current
  const inCombo = g.combo >= COMBO_THRESHOLD
  const livesLow = phase === 'playing' && g.lives === 1

  return (
    <div className="flex flex-col">
      {/* HUD */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-[11px]">
        <button
          type="button"
          onClick={() => {
            if (phase === 'playing') {
              ref.current.lives = 0 // ends the round at next frame
            } else {
              onExit()
            }
          }}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-fg-muted hover:bg-bg-soft hover:text-fg"
          aria-label="Πίσω"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Πίσω
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
            🍎 {g.score}
          </span>
          <Lives
            current={phase === 'result' ? 0 : g.lives}
            max={STARTING_LIVES}
            pulsing={livesLow}
          />
          <span className="inline-flex items-center gap-1 text-fg-subtle">
            <Trophy className="h-3 w-3" /> {phase === 'result' && result ? result.high : highScore}
          </span>
        </div>
      </div>

      {/* Play area */}
      <div
        ref={playRef}
        className="relative mx-3 mt-3 overflow-hidden rounded-xl border border-border"
        style={{
          width: PLAY_W,
          height: PLAY_H,
          background:
            'linear-gradient(180deg, rgb(var(--accent-soft) / 0.45) 0%, rgb(var(--bg-soft)) 70%, rgb(var(--bg-soft)) 100%)',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* Soft cloud-y horizon */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-3 mx-auto h-8 w-24 rounded-full opacity-50"
          style={{ background: 'rgb(var(--bg-elevated))', filter: 'blur(8px)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-3 bottom-3 h-0.5 rounded-full bg-border"
        />

        {/* Apples (only during playing — no apples on intro/result) */}
        {phase === 'playing' &&
          g.apples.map((a) => (
            <AppleSprite
              key={a.id}
              x={a.x}
              y={a.y}
              rot={a.rot}
              type={a.type}
            />
          ))}

        {/* Pet */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: 0,
            bottom: 4,
            width: PET_W,
            height: PET_H,
            transform: `translateX(${g.petX}px)`,
            willChange: 'transform',
          }}
        >
          <PetSprite stage="baby" mood="happy" size={PET_W} still />
        </div>

        {/* Score popups */}
        {g.pops.map((p) => (
          <span
            key={p.id}
            className={cn(
              'pet-pop pointer-events-none absolute text-xs font-bold',
              p.tone === 'good' && 'text-success',
              p.tone === 'great' && 'text-warn',
              p.tone === 'bad' && 'text-danger',
            )}
            style={{ left: p.x, top: p.y }}
          >
            {p.text}
          </span>
        ))}

        {/* Combo banner */}
        {phase === 'playing' && inCombo && (
          <div className="pet-combo pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-warn/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn">
            🔥 Combo ×2
          </div>
        )}

        {/* Tap zones (overlay during playing) */}
        {phase === 'playing' && (
          <>
            <button
              type="button"
              aria-label="Αριστερά"
              onPointerDown={pointerHandler('left', true)}
              onPointerUp={pointerHandler('left', false)}
              onPointerCancel={pointerHandler('left', false)}
              onPointerLeave={pointerHandler('left', false)}
              className="absolute bottom-0 left-0 top-0 w-1/2 cursor-pointer bg-transparent active:bg-fg/5"
            />
            <button
              type="button"
              aria-label="Δεξιά"
              onPointerDown={pointerHandler('right', true)}
              onPointerUp={pointerHandler('right', false)}
              onPointerCancel={pointerHandler('right', false)}
              onPointerLeave={pointerHandler('right', false)}
              className="absolute bottom-0 right-0 top-0 w-1/2 cursor-pointer bg-transparent active:bg-fg/5"
            />
          </>
        )}

        {/* Intro overlay */}
        {phase === 'intro' && (
          <IntroOverlay
            onStart={tryStart}
            disabledReason={canPlayGame().ok ? undefined : canPlayGame().reason}
            highScore={highScore}
          />
        )}

        {/* Result overlay */}
        {phase === 'result' && result && (
          <ResultOverlay
            result={result}
            survivedMs={ref.current.finalSurvivedMs}
            onRetry={() => {
              setResult(null)
              setPhase('intro')
            }}
            onExit={onExit}
          />
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 pb-2 pt-2 text-center text-[10px] text-fg-subtle">
        {phase === 'playing'
          ? '← → ή πάτα αριστερά/δεξιά στην οθόνη'
          : phase === 'intro'
            ? 'Στοίχημα ενέργειας: −15. Έπαθλο: χαρά ανάλογα με το σκορ.'
            : 'Ξανά για να σπάσεις το ρεκόρ.'}
      </div>
    </div>
  )
}

function Lives({ current, max, pulsing }: { current: number; max: number; pulsing: boolean }) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', pulsing && 'pet-time-pulse')}
      aria-label={`Ζωές: ${current} από ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < current
        return (
          <Heart
            key={i}
            className={cn(
              'h-3 w-3 transition-colors',
              filled ? 'fill-danger text-danger' : 'text-fg-subtle/40',
            )}
            aria-hidden="true"
          />
        )
      })}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function IntroOverlay({
  onStart,
  disabledReason,
  highScore,
}: {
  onStart: () => void
  disabledReason?: string
  highScore: number
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-elevated/85 px-6 text-center backdrop-blur-sm">
      <div className="text-2xl">🍎🎯</div>
      <h3 className="text-sm font-semibold">Apple Catcher</h3>
      <p className="text-[11px] leading-relaxed text-fg-muted">
        Πιάσε όσα μήλα μπορείς. Έχεις <strong>5 ζωές</strong>.
        <br />
        Χάνεις ζωή αν χάσεις κόκκινο μήλο ή πιάσεις σάπιο.
        <br />
        🍎 +1 · ✨ χρυσό +3 · 5 σερί = combo ×2.
      </p>
      {highScore > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-2 py-0.5 text-[10px] text-fg-subtle">
          <Trophy className="h-3 w-3" /> Best: {highScore}
        </span>
      )}
      <button
        type="button"
        onClick={onStart}
        disabled={!!disabledReason}
        title={disabledReason}
        className={cn(
          'mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-transform',
          disabledReason
            ? 'cursor-not-allowed bg-bg-soft text-fg-subtle'
            : 'bg-accent text-accent-fg hover:scale-105 active:scale-95',
        )}
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        Ξεκίνα
      </button>
      <span className="inline-flex items-center gap-1 text-[10px] text-fg-subtle">
        <Zap className="h-3 w-3" /> −15 ενέργεια
      </span>
    </div>
  )
}

function ResultOverlay({
  result,
  survivedMs,
  onRetry,
  onExit,
}: {
  result: {
    score: number
    reward: number
    high: number
    newBest: boolean
    bonus?: { apples: number; stars: number }
  }
  survivedMs: number
  onRetry: () => void
  onExit: () => void
}) {
  const hasBonus =
    result.bonus && (result.bonus.apples > 0 || result.bonus.stars > 0)
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-elevated/90 px-6 text-center backdrop-blur-sm">
      {result.newBest && result.score > 0 && (
        <div className="pet-newbest inline-flex items-center gap-1 rounded-full bg-warn/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn">
          🏆 Νέο ρεκόρ!
        </div>
      )}
      <div className="text-3xl">🍎</div>
      <p className="text-sm">
        Σκορ <span className="text-base font-bold tabular-nums">{result.score}</span>
      </p>
      <p className="text-[11px] text-fg-muted">
        Επιβίωσες {formatSurvived(survivedMs)} · +{result.reward} χαρά · Best:{' '}
        {result.high}
      </p>
      {hasBonus && (
        <p className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
          🌳 Στο μποστάνι
          {result.bonus!.apples > 0 && <> · +{result.bonus!.apples} 🍎</>}
          {result.bonus!.stars > 0 && <> · +{result.bonus!.stars} ⭐</>}
        </p>
      )}
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-fg-muted hover:text-fg"
        >
          Πίσω
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-3 w-3" />
          Ξανά
        </button>
      </div>
    </div>
  )
}

function AppleSprite({
  x,
  y,
  rot,
  type,
}: {
  x: number
  y: number
  rot: number
  type: AppleType
}) {
  const radius = APPLE_R
  return (
    <div
      aria-hidden="true"
      className={cn('absolute', type === 'golden' && 'pet-apple-glow')}
      style={{
        width: radius * 2,
        height: radius * 2,
        left: x - radius,
        top: y - radius,
        transform: `rotate(${rot}rad)`,
        willChange: 'transform, top',
      }}
    >
      <svg viewBox="0 0 26 30" width={radius * 2} height={radius * 2.3}>
        <defs>
          <radialGradient id={`apple-${type}`} cx="35%" cy="35%" r="70%">
            {type === 'normal' && (
              <>
                <stop offset="0%" stopColor="#ff8a8a" />
                <stop offset="100%" stopColor="#dc2626" />
              </>
            )}
            {type === 'golden' && (
              <>
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </>
            )}
            {type === 'rotten' && (
              <>
                <stop offset="0%" stopColor="#7c5e3c" />
                <stop offset="100%" stopColor="#3f2d1c" />
              </>
            )}
          </radialGradient>
        </defs>
        {/* stem */}
        <rect x="12" y="3" width="2" height="5" rx="1" fill="#5a3825" />
        {/* leaf */}
        <ellipse cx="17" cy="5" rx="4" ry="2" fill="#22c55e" transform="rotate(25 17 5)" />
        {/* body */}
        <ellipse cx="13" cy="18" rx="11" ry="11.5" fill={`url(#apple-${type})`} />
        {/* highlight */}
        <ellipse cx="9" cy="14" rx="3" ry="4" fill="white" opacity="0.35" />
        {type === 'rotten' && (
          <>
            <circle cx="10" cy="20" r="1.5" fill="#1a0d05" opacity="0.6" />
            <circle cx="16" cy="22" r="1.2" fill="#1a0d05" opacity="0.6" />
            <circle cx="14" cy="15" r="1" fill="#1a0d05" opacity="0.6" />
          </>
        )}
      </svg>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function makeInitialRef(): GameRef {
  return {
    petX: PLAY_W / 2 - PET_W / 2,
    petVxInput: 0,
    apples: [],
    pops: [],
    score: 0,
    caught: 0,
    caughtNormal: 0,
    caughtGolden: 0,
    combo: 0,
    bestCombo: 0,
    lives: STARTING_LIVES,
    startedAt: 0,
    lastFrameAt: 0,
    lastSpawnAt: 0,
    pausedAt: null,
    pauseDebt: 0,
    finalSurvivedMs: 0,
    appleSeq: 0,
    popSeq: 0,
  }
}

function spawnApple(g: GameRef, baseFall: number): Apple {
  const vy = baseFall * (0.85 + Math.random() * 0.35)
  const r = Math.random()
  const type: AppleType = r < 0.1 ? 'golden' : r < 0.2 ? 'rotten' : 'normal'
  const margin = APPLE_R + 4
  const x = margin + Math.random() * (PLAY_W - margin * 2)
  return {
    id: ++g.appleSeq,
    x,
    y: -APPLE_R,
    vy,
    rot: 0,
    vrot: (Math.random() - 0.5) * 1.4,
    type,
  }
}

function handleCatch(g: GameRef, a: Apple, t: number) {
  if (a.type === 'rotten') {
    // Rotten = pure life-loss hazard. Score is unchanged so the leaderboard
    // can never go negative, but combo breaks and you lose a heart.
    g.combo = 0
    g.lives = Math.max(0, g.lives - 1)
    playPetSound('rotten')
    g.pops.push({
      id: ++g.popSeq,
      x: a.x,
      y: PLAY_H - PET_H - 4,
      text: '−♥',
      tone: 'bad',
      bornAt: t,
    })
    return
  }

  const base = a.type === 'golden' ? 3 : 1
  g.combo += 1
  if (g.combo > g.bestCombo) g.bestCombo = g.combo
  const mult = g.combo >= COMBO_THRESHOLD ? 2 : 1
  const pts = base * mult
  g.score += pts
  g.caught += 1
  if (a.type === 'golden') g.caughtGolden += 1
  else g.caughtNormal += 1

  if (a.type === 'golden') {
    playPetSound('goldcatch')
  } else {
    playPetSound('catch')
  }

  g.pops.push({
    id: ++g.popSeq,
    x: a.x,
    y: PLAY_H - PET_H - 4,
    text: `+${pts}`,
    tone: a.type === 'golden' ? 'great' : 'good',
    bornAt: t,
  })
}

function handleMiss(g: GameRef, a: Apple, t: number) {
  if (a.type === 'normal') {
    g.combo = 0
    g.lives = Math.max(0, g.lives - 1)
    playPetSound('miss')
    g.pops.push({
      id: ++g.popSeq,
      x: a.x,
      y: PLAY_H - 14,
      text: '−♥',
      tone: 'bad',
      bornAt: t,
    })
  }
  // Missing a rotten: silent — you avoided it (good).
  // Missing a golden: silent — lost bonus but no penalty.
}

function formatSurvived(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  if (total < 60) return `${total}s`
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
