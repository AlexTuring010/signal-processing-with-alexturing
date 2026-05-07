'use client'

import type { Tree } from '@/lib/orchard/types'

/**
 * Top-down-ish tree SVG. Stage drives canopy size and detail. The trunk
 * stays at the base so the silhouette grows upward as the tree matures.
 *
 * Phase 1 ships stages 0..2 visually; 3 and 4 reuse the stage-2 sprite with
 * a small accent (we'll redo them properly in later phases).
 */
export function TreeSprite({
  tree,
  size = 64,
  full,
}: {
  tree: Tree
  size?: number
  /** When the tree's storage is at cap, glow the canopy slightly. */
  full?: boolean
}) {
  const stage = tree.growthStage
  const w = size
  const h = size

  // Per-stage canopy radius and trunk height.
  const canopy =
    stage === 0
      ? { r: w * 0.12, cy: h * 0.62 }
      : stage === 1
        ? { r: w * 0.22, cy: h * 0.5 }
        : { r: w * 0.3, cy: h * 0.42 }
  const trunk =
    stage === 0
      ? { width: w * 0.05, height: h * 0.18, y: h * 0.72 }
      : stage === 1
        ? { width: w * 0.07, height: h * 0.3, y: h * 0.6 }
        : { width: w * 0.09, height: h * 0.42, y: h * 0.5 }

  const trunkX = w / 2 - trunk.width / 2

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`canopy-${tree.speciesId}`} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
        {full && (
          <filter id={`glow-${tree.speciesId}`}>
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        )}
      </defs>

      {/* Soft ground shadow */}
      <ellipse
        cx={w / 2}
        cy={h * 0.94}
        rx={w * 0.32}
        ry={h * 0.05}
        fill="#000"
        opacity="0.08"
      />

      {/* Trunk */}
      <rect
        x={trunkX}
        y={trunk.y}
        width={trunk.width}
        height={trunk.height}
        rx={trunk.width / 3}
        fill="#7c5e3c"
      />

      {/* Canopy: a couple stacked circles for a soft cluster */}
      {stage === 0 ? (
        // Sapling: a single small bud
        <circle
          cx={w / 2}
          cy={canopy.cy}
          r={canopy.r}
          fill={`url(#canopy-${tree.speciesId})`}
        />
      ) : (
        <g filter={full ? `url(#glow-${tree.speciesId})` : undefined}>
          <circle
            cx={w / 2 - canopy.r * 0.5}
            cy={canopy.cy + canopy.r * 0.2}
            r={canopy.r * 0.85}
            fill={`url(#canopy-${tree.speciesId})`}
          />
          <circle
            cx={w / 2 + canopy.r * 0.5}
            cy={canopy.cy + canopy.r * 0.2}
            r={canopy.r * 0.85}
            fill={`url(#canopy-${tree.speciesId})`}
          />
          <circle
            cx={w / 2}
            cy={canopy.cy - canopy.r * 0.1}
            r={canopy.r}
            fill={`url(#canopy-${tree.speciesId})`}
          />
        </g>
      )}

      {/* Fruit dots when mature and storedApples > 0 */}
      {stage === 2 && tree.storedApples > 0 && (
        <>
          {fruitPositions(tree.storedApples).map((p, i) => (
            <circle
              key={i}
              cx={w / 2 + p.dx * canopy.r}
              cy={canopy.cy + p.dy * canopy.r}
              r={Math.max(1.6, w * 0.035)}
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="0.5"
            />
          ))}
        </>
      )}
    </svg>
  )
}

/** Pseudo-random but deterministic-looking fruit positions inside the canopy. */
function fruitPositions(count: number): Array<{ dx: number; dy: number }> {
  const presets: Array<{ dx: number; dy: number }> = [
    { dx: -0.55, dy: 0.1 },
    { dx: 0.45, dy: 0.0 },
    { dx: -0.1, dy: -0.45 },
    { dx: 0.2, dy: 0.4 },
    { dx: -0.35, dy: 0.4 },
    { dx: 0.55, dy: 0.35 },
    { dx: -0.55, dy: -0.25 },
    { dx: 0.4, dy: -0.4 },
  ]
  return presets.slice(0, Math.min(presets.length, Math.max(0, Math.floor(count))))
}
