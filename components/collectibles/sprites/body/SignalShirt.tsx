import type { ItemRenderProps } from '@/lib/collectibles/types'
import { BODY_CENTER } from '@/lib/collectibles/anchors'

/**
 * Φανέλα Σήματος — a soft pastel t-shirt that hugs the lower half of
 * the pet's body silhouette, topped by a clean neckline. The shirt's
 * outline traces the body's own ellipse so it reads as fabric over
 * the body instead of an oval pasted on top.
 *
 * Body-slot, so it tilts with the pet during the sick-mood wobble
 * (rendered inside the tilt group). Eye + mouth + cheek features
 * draw on top so the face stays readable.
 */
export function SignalShirt({ adult }: ItemRenderProps) {
  const { x, y } = BODY_CENTER
  // These MUST match the body ellipse dimensions in PetSprite.tsx.
  // baby:  bodyW=70, bodyH=68 → rx=35, ry=34
  // adult: bodyW=78, bodyH=76 → rx=39, ry=38
  const rx = adult ? 39 : 35
  const ry = adult ? 38 : 34
  // Chest line (relative y where the neckline sits). Below the cheeks
  // (y_rel ≈ -2) and a little above the mouth (y_rel ≈ 12-18).
  const chestRel = 10
  // x where the body ellipse meets the chest line — used as both the
  // start point of the neckline chord and the arc endpoint.
  const xAtChest = rx * Math.sqrt(Math.max(0, 1 - (chestRel / ry) ** 2))

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Shirt body: lower portion of the body ellipse capped by a
          horizontal neckline. The arc follows the body silhouette
          exactly (same rx/ry) so the shirt reads as wrapping the body. */}
      <path
        d={`M ${-xAtChest} ${chestRel}
             A ${rx} ${ry} 0 0 1 ${xAtChest} ${chestRel}
             Z`}
        fill="rgb(var(--accent-soft))"
      />
      {/* Crisp neckline edge — accents the chord. */}
      <path
        d={`M ${-xAtChest + 1} ${chestRel} L ${xAtChest - 1} ${chestRel}`}
        stroke="rgb(var(--accent))"
        strokeWidth="1"
        opacity="0.55"
        strokeLinecap="round"
      />
      {/* Soft highlight curve along the upper-left of the shirt. */}
      <path
        d={`M ${-xAtChest * 0.85} ${chestRel + 5}
             Q ${-xAtChest * 0.55} ${chestRel + 12} ${-xAtChest * 0.25} ${chestRel + 18}`}
        stroke="white"
        strokeWidth="1.4"
        fill="none"
        opacity="0.32"
        strokeLinecap="round"
      />
      {/* Sine wave print — single visible cycle across the chest. */}
      <path
        d={`M ${-xAtChest * 0.7} ${chestRel + 9}
             Q ${-xAtChest * 0.35} ${chestRel + 5} 0 ${chestRel + 9}
             Q ${xAtChest * 0.35} ${chestRel + 13} ${xAtChest * 0.7} ${chestRel + 9}`}
        stroke="rgb(var(--accent))"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}
