/**
 * Coordinate constants for the pet sprite viewBox (`0 0 120 110`).
 * Item authors anchor their SVG to these points so a new hat doesn't
 * have to reverse-engineer the body's geometry.
 *
 * The body is centered at (60, 60). Sizes shift between baby and adult
 * (baby: 70×68, adult: 78×76) so anchors that follow the body shape are
 * exposed as functions of `adult`.
 */

/** Eyes anchor — center of the face, between the two eye ellipses. */
export const EYES_ANCHOR = { x: 60, y: 50 } as const

/** Body center — used by body-slot items (capes, scarves, shirts). */
export const BODY_CENTER = { x: 60, y: 60 } as const

/** Accessory anchor — sits to the right of the body. */
export const ACCESSORY_ANCHOR = { x: 92, y: 60 } as const

/** Top of the head — sits just above the body, scaled by stage. */
export function headAnchor(adult: boolean): { x: number; y: number } {
  // Body height: baby 68, adult 76. Top of body = 60 - bodyH/2.
  // We anchor the hat *at* the top of the head; item authors translate
  // upward as needed to leave clearance for the antenna tuft.
  return { x: 60, y: adult ? 22 : 26 }
}

/**
 * Rectangular zone where the sick-mood thermometer renders. Head-slot
 * items must avoid drawing into this rectangle so the thermometer stays
 * legible while the pet is sick.
 */
export const SICK_THERMOMETER_ZONE = {
  x: 78,
  y: 26,
  width: 18,
  height: 20,
} as const

/**
 * Below this size (px), body-slot items render without the small detail
 * passes (stitching, prints, embroidery). Item authors may also skip
 * the layer entirely if it would read as visual noise.
 */
export const MIN_BODY_RENDER_SIZE = 64

/**
 * Below this size, accessory items don't render at all — too small to
 * read. The pet button uses ~36 px so it's well below this floor.
 */
export const MIN_ACCESSORY_RENDER_SIZE = 80
