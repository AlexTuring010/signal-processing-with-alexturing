/**
 * Sprite preview renderer. Builds a 2 (stages) × 5 (moods) grid of
 * Σιγμάκι, all wearing whatever items you pass on the command line,
 * and rasterizes to PNG with sharp so we can iterate visually:
 *
 *   node scripts/sprite-preview/preview.mjs --body signal-shirt
 *   node scripts/sprite-preview/preview.mjs --head harmonic-crown --eyes spectrum-glasses
 *
 * Mirrors the body geometry and item paths from the live source
 * (PetSprite.tsx + components/collectibles/sprites/**). Update both
 * places if the body changes.
 *
 * Output: scripts/sprite-preview/tmp/preview.png
 */
import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// ---------- Concrete colors (mirrors theme tokens for the dark theme) ----------
const COLORS = {
  bg: '#0f141e',
  fg: '#e7eaf0',
  bgElevated: '#19202c',
  accent: '#79a4c2',
  accentSoft: '#cfe6f5',
  accentSoftDarker: '#b8d4e3',
  danger: '#d97766',
  warn: '#f5c97a',
  success: '#86c79a',
  white: '#ffffff',
}

// ---------- BODY SVG ----------
function bodySvg(stage, mood) {
  const adult = stage === 'adult'
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const eyeY = mood === 'asleep' ? 53 : 50
  const eyeOpen = mood !== 'asleep'
  const tilt = mood === 'sick' ? -6 : 0

  const rxOuter = bodyW / 2
  const ryOuter = bodyH / 2

  const cheekColor = `url(#cheek-${stage}-${mood})`
  const bodyFill = `url(#body-${stage}-${mood})`

  const eyes = eyeOpen
    ? `
        <ellipse cx="50" cy="${eyeY}" rx="4" ry="${mood === 'sad' || mood === 'sick' ? 4.2 : 5}" fill="${COLORS.fg}" />
        <circle cx="51.2" cy="${eyeY - 1.4}" r="1.4" fill="${COLORS.white}" />
        <ellipse cx="70" cy="${eyeY}" rx="4" ry="${mood === 'sad' || mood === 'sick' ? 4.2 : 5}" fill="${COLORS.fg}" />
        <circle cx="71.2" cy="${eyeY - 1.4}" r="1.4" fill="${COLORS.white}" />
      `
    : `
        <path d="M45 53 Q50 57 55 53" stroke="${COLORS.fg}" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M65 53 Q70 57 75 53" stroke="${COLORS.fg}" stroke-width="2" fill="none" stroke-linecap="round" />
      `

  const mouth =
    mood === 'happy'
      ? `<path d="M53 72 Q60 78 67 72" stroke="${COLORS.fg}" stroke-width="2" fill="none" stroke-linecap="round" />`
      : mood === 'neutral'
        ? `<line x1="55" y1="73" x2="65" y2="73" stroke="${COLORS.fg}" stroke-width="2" stroke-linecap="round" />`
        : mood === 'sad' || mood === 'sick'
          ? `<path d="M53 76 Q60 70 67 76" stroke="${COLORS.fg}" stroke-width="2" fill="none" stroke-linecap="round" />`
          : `<ellipse cx="60" cy="74" rx="3" ry="2" fill="${COLORS.fg}" opacity="0.7" />`

  const cheeks =
    mood === 'happy' || mood === 'neutral'
      ? `
          <circle cx="44" cy="58" r="6" fill="${cheekColor}" />
          <circle cx="76" cy="58" r="6" fill="${cheekColor}" />
        `
      : ''

  const antenna = adult
    ? `
        <line x1="60" y1="${60 - ryOuter}" x2="60" y2="${60 - ryOuter - 8}" stroke="${COLORS.accent}" stroke-width="2" stroke-linecap="round" />
        <circle cx="60" cy="${60 - ryOuter - 10}" r="3" fill="${COLORS.accent}" />
      `
    : ''

  const sickThermometer =
    mood === 'sick'
      ? `
          <g transform="translate(82 36)">
            <rect x="-2" y="-10" width="4" height="14" rx="2" fill="${COLORS.bgElevated}" stroke="${COLORS.fg}" stroke-width="1" />
            <circle cx="0" cy="6" r="3.5" fill="${COLORS.danger}" stroke="${COLORS.fg}" stroke-width="1" />
            <line x1="0" y1="-7" x2="0" y2="3" stroke="${COLORS.danger}" stroke-width="2" stroke-linecap="round" />
          </g>
        `
      : ''

  return {
    defs: `
      <radialGradient id="body-${stage}-${mood}" cx="42%" cy="38%" r="65%">
        <stop offset="0%" stop-color="${COLORS.accentSoft}" />
        <stop offset="100%" stop-color="${COLORS.accent}" />
      </radialGradient>
      <radialGradient id="cheek-${stage}-${mood}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${COLORS.danger}" stop-opacity="0.55" />
        <stop offset="100%" stop-color="${COLORS.danger}" stop-opacity="0" />
      </radialGradient>
    `,
    insideTilt: ({ bodySlot }) => `
      <ellipse cx="${60 - bodyW * 0.28}" cy="${60 + bodyH * 0.46}" rx="6" ry="3.5" fill="${COLORS.accent}" />
      <ellipse cx="${60 + bodyW * 0.28}" cy="${60 + bodyH * 0.46}" rx="6" ry="3.5" fill="${COLORS.accent}" />
      <ellipse cx="60" cy="60" rx="${rxOuter}" ry="${ryOuter}" fill="${bodyFill}" />
      <ellipse cx="50" cy="48" rx="14" ry="18" fill="${COLORS.white}" opacity="0.18" />
      ${bodySlot ?? ''}
      <ellipse cx="${60 - bodyW * 0.5 + 2}" cy="62" rx="5" ry="7" fill="${COLORS.accent}" />
      <ellipse cx="${60 + bodyW * 0.5 - 2}" cy="62" rx="5" ry="7" fill="${COLORS.accent}" />
      ${antenna}
      ${cheeks}
      ${eyes}
      ${mouth}
      ${sickThermometer}
    `,
    tilt,
  }
}

// ---------- ITEM SPRITES ----------
const ITEMS = {
  'signal-shirt': {
    slot: 'body',
    render: ({ adult }) => {
      const rx = adult ? 39 : 35
      const ry = adult ? 38 : 34
      // Neckline geometry: high on the sides (just below the arms),
      // dipping down in the middle to pass *under* the mouth. Solves
      // the "shirt covers face vs shirt is too small" tradeoff that
      // a flat-chord ellipse can't avoid.
      //
      //   sideY    — y where the neckline meets the body silhouette
      //   ctrlY    — Q-bezier control point pulling the curve down at
      //              center; apex of the curve sits roughly halfway
      //              between sideY and ctrlY.
      const sideY = adult ? 8 : 8     // shoulder line (below arms)
      const ctrlY = adult ? 32 : 30   // pulls curve under the mouth
      const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
      const SHIRT = '#3eb371'         // saturated mint green
      const SHIRT_OUTLINE = '#1f6e44'
      return `
        <g transform="translate(60 60)">
          <!-- Shirt: lower body silhouette (arc, sweep=0 to go through
               the bottom of the body) + U-shaped neckline (Q curve
               dipping under the mouth). -->
          <path
            d="M ${-xAtSide} ${sideY}
               A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
               Q 0 ${ctrlY} ${-xAtSide} ${sideY}
               Z"
            fill="${SHIRT}" />
          <!-- Stitched neckline accent following the same curve. -->
          <path
            d="M ${-xAtSide + 1} ${sideY}
               Q 0 ${ctrlY - 1} ${xAtSide - 1} ${sideY}"
            stroke="${SHIRT_OUTLINE}" stroke-width="1.2" fill="none" stroke-linecap="round" />
          <!-- Small sine wave print on the front of the shirt. Baby's
               shirt is shorter, so push the wave up a touch on baby. -->
          <path
            d="M ${-xAtSide * 0.5} ${adult ? 26 : 23}
               Q ${-xAtSide * 0.25} ${adult ? 23 : 20} 0 ${adult ? 26 : 23}
               Q ${xAtSide * 0.25} ${adult ? 29 : 26} ${xAtSide * 0.5} ${adult ? 26 : 23}"
            stroke="${SHIRT_OUTLINE}" stroke-width="1.3" fill="none" stroke-linecap="round" />
        </g>
      `
    },
  },
  'am-jacket': {
    slot: 'body',
    render: ({ adult }) => {
      const rx = adult ? 39 : 35
      const ry = adult ? 38 : 34
      // Jacket sits a touch higher than the t-shirt — formal piece up
      // at the chest, but still below the cheek line.
      const sideY = 8
      const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
      const JACKET = '#a87f5a' // muted tan
      const JACKET_DARK = '#6b4f37'
      const LAPEL = '#bd987a'
      // V-cut: deep V from the neckline down to (0, vTipY). The path is
      // a single closed shape with the V as a notch, so body color
      // shows through naturally.
      const vTipY = 22 // below the mouth (mouth bottom y_rel=18)
      const vHalfW = 8 // neckline opening half-width at sideY
      return `
        <g transform="translate(60 60)">
          <!-- Jacket: lower body silhouette with a V notch at the top. -->
          <path
            fill="${JACKET}"
            d="M ${-xAtSide} ${sideY}
               A ${rx} ${ry} 0 0 1 ${xAtSide} ${sideY}
               L ${vHalfW} ${sideY}
               L 0 ${vTipY}
               L ${-vHalfW} ${sideY}
               Z" />
          <!-- Neckline stitching along the shoulder chords (left and
               right of the V opening). -->
          <path
            d="M ${-xAtSide + 1} ${sideY} L ${-vHalfW} ${sideY}
               M ${vHalfW} ${sideY} L ${xAtSide - 1} ${sideY}"
            stroke="${JACKET_DARK}" stroke-width="1.2" stroke-linecap="round" />
          <!-- Lapels: thin triangles flanking the V notch, sitting on
               top of the jacket fabric. -->
          <path
            d="M ${-vHalfW} ${sideY}
               L ${-vHalfW - 5} ${sideY + 5}
               L 0 ${vTipY}
               Z"
            fill="${LAPEL}" />
          <path
            d="M ${vHalfW} ${sideY}
               L ${vHalfW + 5} ${sideY + 5}
               L 0 ${vTipY}
               Z"
            fill="${LAPEL}" />
          <!-- Single button below the V tip. -->
          <circle cx="0" cy="${vTipY + 5}" r="1.6" fill="${COLORS.warn}" />
          <circle cx="-0.4" cy="${vTipY + 4.6}" r="0.6" fill="${COLORS.white}" opacity="0.75" />
          <!-- Soft fabric highlight on the upper-left. -->
          <path
            d="M ${-xAtSide * 0.85} ${sideY + 4}
               Q ${-xAtSide * 0.55} ${sideY + 10} ${-xAtSide * 0.25} ${sideY + 16}"
            stroke="${COLORS.white}" stroke-width="1" fill="none" opacity="0.3" stroke-linecap="round" />
        </g>
      `
    },
  },
  'harmonic-crown': {
    slot: 'head',
    render: ({ adult }) => {
      const headY = adult ? 22 : 26
      const spikes = [
        { dx: -10, h: 5 },
        { dx: -5, h: 8 },
        { dx: 0, h: 11 },
        { dx: 5, h: 8 },
        { dx: 10, h: 5 },
      ]
      const spikePaths = spikes
        .map(
          (s) =>
            `<path d="M${s.dx - 1.5} 0 L${s.dx} ${-s.h} L${s.dx + 1.5} 0 Z" fill="${COLORS.warn}" />`,
        )
        .join('')
      return `
        <g transform="translate(60 ${headY - 2})">
          <path d="M-13 0 L-13 4 Q-13 6 -11 6 L11 6 Q13 6 13 4 L13 0 Z" fill="${COLORS.warn}" />
          ${spikePaths}
          <circle cx="0" cy="-11" r="1.5" fill="${COLORS.danger}" />
          <circle cx="-0.5" cy="-11.4" r="0.5" fill="${COLORS.white}" opacity="0.9" />
        </g>
      `
    },
  },
  'welcome-beanie': {
    slot: 'head',
    render: ({ adult }) => {
      const headY = adult ? 22 : 26
      return `
        <g transform="translate(60 ${headY})">
          <path d="M-18 1 L-18 4 Q-18 6 -16 6 L16 6 Q18 6 18 4 L18 1 Z" fill="${COLORS.warn}" />
          <path d="M-15 1 Q-13 -7 -7 -8 Q0 -10 7 -8 Q13 -7 15 1 Z" fill="${COLORS.warn}" />
          <ellipse cx="-5" cy="-4" rx="4" ry="2" fill="${COLORS.white}" opacity="0.3" />
          <circle cx="0" cy="-11" r="2.5" fill="${COLORS.accentSoft}" />
        </g>
      `
    },
  },
  'fm-headphones': {
    slot: 'head',
    render: ({ adult }) => {
      const headY = adult ? 22 : 26
      return `
        <g transform="translate(60 ${headY})">
          <path d="M-18 6 Q-18 -8 0 -8 Q18 -8 18 6" stroke="${COLORS.fg}" stroke-width="2.4" fill="none" stroke-linecap="round" />
          <ellipse cx="-19" cy="8" rx="4.5" ry="5.5" fill="${COLORS.fg}" />
          <ellipse cx="-19" cy="8" rx="2.8" ry="3.6" fill="${COLORS.accent}" />
          <ellipse cx="19" cy="8" rx="4.5" ry="5.5" fill="${COLORS.fg}" />
          <ellipse cx="19" cy="8" rx="2.8" ry="3.6" fill="${COLORS.accent}" />
        </g>
      `
    },
  },
  'spectrum-glasses': {
    slot: 'eyes',
    render: () => `
      <g>
        <defs>
          <linearGradient id="glasses-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${COLORS.danger}" stop-opacity="0.55" />
            <stop offset="50%" stop-color="${COLORS.success}" stop-opacity="0.55" />
            <stop offset="100%" stop-color="${COLORS.accent}" stop-opacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="5.5" fill="url(#glasses-fill)" />
        <circle cx="70" cy="50" r="5.5" fill="url(#glasses-fill)" />
        <circle cx="50" cy="50" r="5.5" fill="none" stroke="${COLORS.fg}" stroke-width="1.5" />
        <circle cx="70" cy="50" r="5.5" fill="none" stroke="${COLORS.fg}" stroke-width="1.5" />
        <line x1="55.5" y1="50" x2="64.5" y2="50" stroke="${COLORS.fg}" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="48" cy="48" r="1.1" fill="${COLORS.white}" opacity="0.75" />
        <circle cx="68" cy="48" r="1.1" fill="${COLORS.white}" opacity="0.75" />
      </g>
    `,
  },
}

// ---------- COMPOSITION ----------
function buildPetSvg(stage, mood, equipped) {
  const adult = stage === 'adult'
  const body = bodySvg(stage, mood)
  const itemProps = { stage, mood, adult }

  const headItem = equipped.head ? ITEMS[equipped.head]?.render(itemProps) : ''
  const eyesItem = equipped.eyes ? ITEMS[equipped.eyes]?.render(itemProps) : ''
  const bodySlotItem = equipped.body ? ITEMS[equipped.body]?.render(itemProps) : ''
  const accessoryItem = equipped.accessory
    ? ITEMS[equipped.accessory]?.render(itemProps)
    : ''

  return `
    <g>
      <defs>${body.defs}</defs>
      <g transform="translate(60 60) rotate(${body.tilt}) translate(-60 -60)">
        ${body.insideTilt({ bodySlot: bodySlotItem })}
      </g>
      ${eyesItem}
      ${headItem}
      ${accessoryItem}
    </g>
  `
}

// ---------- GRID ----------
function buildGrid(equipped) {
  const STAGES = ['baby', 'adult']
  const MOODS = ['happy', 'neutral', 'sad', 'sick', 'asleep']
  const TILE_W = 120
  const TILE_H = 110
  const PAD = 6

  const tiles = []
  // Header row with mood labels
  STAGES.forEach((stage, ri) => {
    MOODS.forEach((mood, ci) => {
      const tx = ci * (TILE_W + PAD)
      const ty = ri * (TILE_H + PAD + 16) + 16 // leave room for stage label
      tiles.push(`
        <text x="${tx + 4}" y="${ty - 4}" font-size="9" fill="${COLORS.fg}" font-family="sans-serif">${stage} · ${mood}</text>
        <g transform="translate(${tx} ${ty})">${buildPetSvg(stage, mood, equipped)}</g>
      `)
    })
  })

  const W = MOODS.length * (TILE_W + PAD) - PAD
  const H = STAGES.length * (TILE_H + PAD + 16)

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="${H * 2}">
  <rect width="${W}" height="${H}" fill="${COLORS.bg}" />
  ${tiles.join('\n')}
</svg>
  `.trim()
}

// ---------- CLI ----------
function parseArgs() {
  const out = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i += 2) {
    const k = argv[i]?.replace(/^--/, '')
    const v = argv[i + 1]
    if (!k) continue
    out[k] = v
  }
  return out
}

const args = parseArgs()
const equipped = {
  head: args.head ?? null,
  eyes: args.eyes ?? null,
  body: args.body ?? null,
  accessory: args.accessory ?? null,
}

const svg = buildGrid(equipped)
const here = dirname(fileURLToPath(import.meta.url))
const outPath = `${here}/tmp/preview.png`
mkdirSync(`${here}/tmp`, { recursive: true })

const png = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync(outPath, png)
writeFileSync(`${here}/tmp/preview.svg`, svg)
console.log('Wrote', outPath)
console.log('Equipped:', equipped)
