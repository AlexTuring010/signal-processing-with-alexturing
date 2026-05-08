'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Mood, Stage } from '@/lib/pet/types'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { getWearable } from '@/lib/collectibles/registry'
import {
  MIN_ACCESSORY_RENDER_SIZE,
  MIN_BODY_RENDER_SIZE,
} from '@/lib/collectibles/anchors'
import type {
  EquippedSlots,
  ItemRenderProps,
} from '@/lib/collectibles/types'

type Props = {
  stage: Stage
  mood: Mood
  /** Pixel width; sprite scales with viewBox. */
  size?: number
  /** When true, suppress the constant idle bob (used inside the small collapsed button). */
  still?: boolean
  className?: string
  /**
   * Override what's equipped on this sprite. When provided, the
   * sprite ignores the player's actual equipment — useful for
   * preview cards in /collection that show different items per card.
   */
  equippedOverride?: Partial<EquippedSlots>
}

/**
 * The pet sprite. SVG with smooth shapes, theme-aware via currentColor on the
 * accent body and a few CSS-variable fills. Adult is a slightly larger /
 * differentiated baby; the egg is its own shape.
 *
 * Phase 1 of `plans/99c-collectibles.md` adds layered cosmetic items on top
 * of the existing body. Items are read from `useCollectiblesStore` here so
 * call sites don't have to pass an `equipped` prop — every PetSprite in the
 * app picks them up automatically.
 */
export function PetSprite({
  stage,
  mood,
  size = 96,
  still = false,
  className,
  equippedOverride,
}: Props) {
  // Lazy-hydrate the collectibles store on first sprite mount. Cheap and
  // idempotent — the store guards against double hydration internally.
  const hydrate = useCollectiblesStore((s) => s.hydrate)
  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (stage === 'egg') {
    return <EggSvg size={size} className={cn('pet-egg-wobble', className)} />
  }
  return (
    <BodySvg
      size={size}
      mood={mood}
      adult={stage === 'adult'}
      className={cn(!still && 'pet-idle-bob', className)}
      equippedOverride={equippedOverride}
    />
  )
}

function EggSvg({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={(size * 120) / 100}
      role="img"
      aria-label="Αυγουλάκι"
      className={className}
    >
      <defs>
        <radialGradient id="egg-fill" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="rgb(var(--accent-soft))" />
          <stop offset="100%" stopColor="rgb(var(--accent))" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="68" rx="34" ry="44" fill="url(#egg-fill)" />
      {/* Speckles */}
      <circle cx="38" cy="55" r="3" fill="rgb(var(--bg-elevated))" opacity="0.85" />
      <circle cx="62" cy="48" r="2.2" fill="rgb(var(--bg-elevated))" opacity="0.75" />
      <circle cx="55" cy="78" r="2.6" fill="rgb(var(--bg-elevated))" opacity="0.8" />
      <circle cx="40" cy="88" r="1.8" fill="rgb(var(--bg-elevated))" opacity="0.7" />
      <circle cx="68" cy="82" r="2" fill="rgb(var(--bg-elevated))" opacity="0.75" />
      {/* highlight */}
      <ellipse cx="40" cy="42" rx="8" ry="10" fill="white" opacity="0.35" />
    </svg>
  )
}

function BodySvg({
  size,
  mood,
  adult,
  className,
  equippedOverride,
}: {
  size: number
  mood: Mood
  adult: boolean
  className?: string
  equippedOverride?: Partial<EquippedSlots>
}) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const eyeY = mood === 'asleep' ? 53 : 50
  const eyeOpen = mood !== 'asleep'
  const tilt = mood === 'sick' ? -6 : 0

  // Resolve currently equipped items. Suppression rules:
  //   - body layer hidden below MIN_BODY_RENDER_SIZE (reads as noise)
  //   - accessory layer hidden below MIN_ACCESSORY_RENDER_SIZE
  // Eyes-slot items render through every mood including asleep —
  // glasses-on-a-sleeping-pet is a tasteful read, not a glitch.
  // The `egg` stage short-circuits before we get here.
  const storeEquipped = useCollectiblesStore((s) => s.state.equipped)
  const equipped: EquippedSlots = {
    head: equippedOverride?.head ?? storeEquipped.head,
    eyes: equippedOverride?.eyes ?? storeEquipped.eyes,
    body: equippedOverride?.body ?? storeEquipped.body,
    accessory: equippedOverride?.accessory ?? storeEquipped.accessory,
  }
  const stage: ItemRenderProps['stage'] = adult ? 'adult' : 'baby'
  const itemProps: ItemRenderProps = { stage, mood, adult }

  const headItem = getWearable(equipped.head)
  const eyesItem = getWearable(equipped.eyes)
  const bodyItem =
    size >= MIN_BODY_RENDER_SIZE ? getWearable(equipped.body) : undefined
  const accessoryItem =
    size >= MIN_ACCESSORY_RENDER_SIZE ? getWearable(equipped.accessory) : undefined

  return (
    <svg
      viewBox="0 0 120 110"
      width={size}
      height={(size * 110) / 120}
      role="img"
      aria-label={`Σιγμάκι, διάθεση ${moodLabel(mood)}`}
      className={className}
    >
      <defs>
        <radialGradient id="body-fill" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="rgb(var(--accent-soft))" />
          <stop offset="100%" stopColor="rgb(var(--accent))" />
        </radialGradient>
        <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--danger))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgb(var(--danger))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sick-tilt group: body geometry + body-slot clothing tilt together. */}
      <g transform={`translate(60 60) rotate(${tilt}) translate(-60 -60)`}>
        {/* feet (small nubs) */}
        <ellipse cx={60 - bodyW * 0.28} cy={60 + bodyH * 0.46} rx="6" ry="3.5" fill="rgb(var(--accent))" />
        <ellipse cx={60 + bodyW * 0.28} cy={60 + bodyH * 0.46} rx="6" ry="3.5" fill="rgb(var(--accent))" />

        {/* body */}
        <ellipse cx="60" cy="60" rx={bodyW / 2} ry={bodyH / 2} fill="url(#body-fill)" />

        {/* belly highlight */}
        <ellipse cx="50" cy="48" rx="14" ry="18" fill="white" opacity="0.18" />

        {/* Body-slot item (shirts, jackets, scarves) — drawn before the
            arms so the arm nubs poke out on top of the fabric, like
            short sleeves. Sits below the face/antenna so the face
            stays readable. */}
        {bodyItem && <bodyItem.Sprite {...itemProps} />}

        {/* arms */}
        <ellipse cx={60 - bodyW * 0.5 + 2} cy="62" rx="5" ry="7" fill="rgb(var(--accent))" />
        <ellipse cx={60 + bodyW * 0.5 - 2} cy="62" rx="5" ry="7" fill="rgb(var(--accent))" />

        {/* adult antenna tuft */}
        {adult && (
          <g>
            <line
              x1="60"
              y1={60 - bodyH / 2}
              x2="60"
              y2={60 - bodyH / 2 - 8}
              stroke="rgb(var(--accent))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="60" cy={60 - bodyH / 2 - 10} r="3" fill="rgb(var(--accent))" />
          </g>
        )}

        {/* cheeks (only when happy or neutral) */}
        {(mood === 'happy' || mood === 'neutral') && (
          <>
            <circle cx="44" cy="58" r="6" fill="url(#cheek)" />
            <circle cx="76" cy="58" r="6" fill="url(#cheek)" />
          </>
        )}

        {/* eyes */}
        {eyeOpen ? (
          <>
            <Eye cx={50} cy={eyeY} mood={mood} />
            <Eye cx={70} cy={eyeY} mood={mood} />
          </>
        ) : (
          <>
            <path
              d="M45 53 Q50 57 55 53"
              stroke="rgb(var(--fg))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M65 53 Q70 57 75 53"
              stroke="rgb(var(--fg))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {/* mouth */}
        <Mouth mood={mood} />

        {/* sick thermometer */}
        {mood === 'sick' && (
          <g transform="translate(82 36)">
            <rect x="-2" y="-10" width="4" height="14" rx="2" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--fg))" strokeWidth="1" />
            <circle cx="0" cy="6" r="3.5" fill="rgb(var(--danger))" stroke="rgb(var(--fg))" strokeWidth="1" />
            <line x1="0" y1="-7" x2="0" y2="3" stroke="rgb(var(--danger))" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* OUTSIDE the tilt group — head/eyes/accessory items stay upright
          when the pet wobbles sick. Body-slot items already rendered above.
          Per plans/99c-collectibles.md: hats hover on top, glasses don't
          tilt with a slumped head, held items stay level. */}
      {eyesItem && <eyesItem.Sprite {...itemProps} />}
      {headItem && <headItem.Sprite {...itemProps} />}
      {accessoryItem && <accessoryItem.Sprite {...itemProps} />}
    </svg>
  )
}

function Eye({ cx, cy, mood }: { cx: number; cy: number; mood: Mood }) {
  // Slightly downturned for sad/sick.
  const ry = mood === 'sad' || mood === 'sick' ? 4.2 : 5
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="4" ry={ry} fill="rgb(var(--fg))" />
      <circle cx={cx + 1.2} cy={cy - 1.4} r="1.4" fill="white" />
    </g>
  )
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'happy':
      return (
        <path
          d="M53 72 Q60 78 67 72"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )
    case 'neutral':
      return (
        <line
          x1="55"
          y1="73"
          x2="65"
          y2="73"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )
    case 'sad':
    case 'sick':
      return (
        <path
          d="M53 76 Q60 70 67 76"
          stroke="rgb(var(--fg))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )
    case 'asleep':
      return (
        <ellipse cx="60" cy="74" rx="3" ry="2" fill="rgb(var(--fg))" opacity="0.7" />
      )
    default:
      return null
  }
}

function moodLabel(mood: Mood): string {
  switch (mood) {
    case 'happy':
      return 'χαρούμενο'
    case 'neutral':
      return 'καλά'
    case 'sad':
      return 'στενοχωρημένο'
    case 'sick':
      return 'άρρωστο'
    case 'asleep':
      return 'κοιμάται'
  }
}
