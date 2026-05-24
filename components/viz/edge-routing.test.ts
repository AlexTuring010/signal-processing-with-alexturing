import { describe, expect, it } from 'vitest'
import {
  curveClearsAll,
  perpDistance,
  routeEdge,
  segmentIntersectsRect,
  type NodeRect,
} from './edge-routing'

// Two 64×28 rectangles at column-2 (x=200) and column-3 (x=340), centred
// rows. Mirrors the RiverCrossingStateGraph layout shape so the regression
// case below is faithful.
function rect(id: string | number, cx: number, cy: number, w = 64, h = 28): NodeRect {
  return { id, x: cx - w / 2, y: cy - h / 2, w, h }
}

describe('routeEdge — straight case', () => {
  it('returns a line when no other node sits on the path', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 400, 100)
    const c = rect('c', 250, 250) // far below the line
    const out = routeEdge(a, b, [a, b, c])
    expect(out.kind).toBe('line')
    if (out.kind === 'line') {
      expect(out.x1).toBeCloseTo(100)
      expect(out.y1).toBeCloseTo(100)
      expect(out.x2).toBeCloseTo(400)
      expect(out.y2).toBeCloseTo(100)
    }
  })

  it('ignores nodes that share an endpoint id', () => {
    // A node with id 'a' that is geometrically distinct from rect a (matches
    // the case where the data accidentally re-uses an endpoint id). It still
    // gets excluded from collision testing — that is the contract.
    const a = rect('a', 100, 100)
    const b = rect('b', 400, 100)
    const sneaky: NodeRect = { id: 'a', x: 220, y: 88, w: 60, h: 24 }
    const out = routeEdge(a, b, [a, b, sneaky])
    expect(out.kind).toBe('line')
  })

  it('handles coincident endpoints without throwing', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 100, 100)
    const out = routeEdge(a, b, [a, b])
    expect(out.kind).toBe('line')
  })
})

describe('routeEdge — collision case', () => {
  it('curves around a node sitting on the straight line', () => {
    const a = rect('a', 100, 100)
    const b = rect('b', 500, 100)
    const blocker = rect('mid', 300, 100) // dead centre on the line
    const out = routeEdge(a, b, [a, b, blocker])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(out.d).toMatch(/^M [\d.]+ [\d.]+ Q [\d.]+ [\d.]+ [\d.]+ [\d.]+$/)
      // Curve control point must sit off the segment line.
      expect(perpDistance(100, 100, 500, 100, out.cx, out.cy)).toBeGreaterThan(20)
      // And the resulting curve must actually clear the blocker.
      expect(
        curveClearsAll(100, 100, out.cx, out.cy, 500, 100, [blocker], 4),
      ).toBe(true)
    }
  })

  it('regression: RCSG long-horizontal edge curves around the col-2 box', () => {
    // Faithful reconstruction of the {C}↔{B,C,G} edge from
    // RiverCrossingStateGraph: col-1 node {C} at (200, 130), col-3 node
    // {B,C,G} at (480, 130), with {B,G} sitting in col-2 at (340, 130).
    // The straight edge runs through the {B,G} rect; routeEdge must bend it.
    const c = rect('C', 200, 130)
    const bcg = rect('BCG', 480, 130)
    const bg = rect('BG', 340, 130)
    const allNodes: NodeRect[] = [c, bcg, bg]
    const out = routeEdge(c, bcg, allNodes)
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(
        curveClearsAll(200, 130, out.cx, out.cy, 480, 130, [bg], 4),
      ).toBe(true)
    }
  })

  it('breaks ties by curving away from the centroid of other nodes', () => {
    // Cluster below the segment line; expect the curve to go UP (cy < 100).
    const a = rect('a', 100, 100)
    const b = rect('b', 500, 100)
    const blocker = rect('blocker', 300, 100) // on the line — sigma=0 tie
    const cluster = [
      rect('c1', 200, 220),
      rect('c2', 300, 220),
      rect('c3', 400, 220),
    ]
    const out = routeEdge(a, b, [a, b, blocker, ...cluster])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(out.cy).toBeLessThan(100)
    }
  })

  it('curves away from multiple in-the-way nodes on the same side', () => {
    const a = rect('a', 60, 100)
    const b = rect('b', 540, 100)
    const m1 = rect('m1', 220, 100)
    const m2 = rect('m2', 380, 100)
    const out = routeEdge(a, b, [a, b, m1, m2])
    expect(out.kind).toBe('curve')
    if (out.kind === 'curve') {
      expect(
        curveClearsAll(60, 100, out.cx, out.cy, 540, 100, [m1, m2], 4),
      ).toBe(true)
    }
  })
})

describe('segmentIntersectsRect', () => {
  it('detects a horizontal segment passing through a rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(0, 100, 400, 100, r, 0)).toBe(true)
  })

  it('returns false when the segment runs clear of the rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(0, 200, 400, 200, r, 0)).toBe(false)
  })

  it('respects the padding parameter (near-miss becomes hit)', () => {
    const r = rect('r', 200, 100) // y-extent: 86..114
    // y=120 is 6 px below the rect's bottom edge.
    expect(segmentIntersectsRect(0, 120, 400, 120, r, 0)).toBe(false)
    expect(segmentIntersectsRect(0, 120, 400, 120, r, 8)).toBe(true)
  })

  it('detects an endpoint sitting inside the rect', () => {
    const r = rect('r', 200, 100)
    expect(segmentIntersectsRect(200, 100, 600, 100, r, 0)).toBe(true)
  })

  it('handles a segment parallel to a slab that runs alongside the rect', () => {
    const r = rect('r', 200, 100)
    // Vertical segment with dx==0, sitting clear of the rect's x-extent.
    expect(segmentIntersectsRect(500, 0, 500, 400, r, 0)).toBe(false)
    // Same vertical segment, on top of the rect's x-extent.
    expect(segmentIntersectsRect(200, 0, 200, 400, r, 0)).toBe(true)
  })
})

describe('perpDistance', () => {
  it('returns 0 for a point on the line', () => {
    expect(perpDistance(0, 0, 10, 0, 5, 0)).toBeCloseTo(0)
  })

  it('returns the y-offset for a horizontal line', () => {
    expect(perpDistance(0, 0, 10, 0, 5, 3)).toBeCloseTo(3)
  })

  it('falls back to point-to-point distance for a degenerate segment', () => {
    expect(perpDistance(5, 5, 5, 5, 8, 9)).toBeCloseTo(5)
  })
})
