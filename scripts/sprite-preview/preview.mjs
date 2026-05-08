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
      const sideY = 8
      const ctrlY = adult ? 32 : 30
      const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
      // Dark blue gradient — distinct from the body's lighter blue.
      const STITCH = '#0f2447'
      const waveY = adult ? 26 : 24
      const waveHalfW = adult ? 9 : 8
      const gradId = `signal-shirt-fill-${adult ? 'a' : 'b'}`
      return `
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3a5e96" />
            <stop offset="100%" stop-color="#162a52" />
          </linearGradient>
        </defs>
        <g transform="translate(60 60)">
          <!-- Shirt fill: lower body silhouette + U-neck Q curve. -->
          <path
            d="M ${-xAtSide} ${sideY}
               A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
               Q 0 ${ctrlY} ${-xAtSide} ${sideY}
               Z"
            fill="url(#${gradId})" />
          <!-- Centered sine wave print. -->
          <path
            d="M ${-waveHalfW} ${waveY}
               Q ${-waveHalfW * 0.5} ${waveY - 2.2} 0 ${waveY}
               Q ${waveHalfW * 0.5} ${waveY + 2.2} ${waveHalfW} ${waveY}"
            stroke="${STITCH}" stroke-width="1.3" fill="none" stroke-linecap="round" />
          <!-- Stitched neckline — traces the U-curve boundary. -->
          <path
            d="M ${-xAtSide + 1} ${sideY}
               Q 0 ${ctrlY - 1} ${xAtSide - 1} ${sideY}"
            stroke="${STITCH}" stroke-width="1.2" fill="none" stroke-linecap="round" />
        </g>
      `
    },
  },
  // NOTE: this mirrors the *current* AmJacket.tsx (rectangular shape +
  // V-cut filled with bg-elevated). It does not yet follow the U-neck
  // body-silhouette contract used by SignalShirt; that retrofit is a
  // separate user-reviewed task.
  'am-jacket': {
    slot: 'body',
    render: ({ adult }) => {
      const w = adult ? 32 : 28
      const h = adult ? 26 : 22
      return `
        <g transform="translate(60 60)">
          <path
            d="M${-w / 2} ${-h / 2 + 4}
               Q${-w / 2} ${-h / 2} ${-w / 2 + 4} ${-h / 2}
               L${w / 2 - 4} ${-h / 2}
               Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 4}
               L${w / 2} ${h / 2}
               Q${w / 2} ${h / 2 + 4} ${w / 2 - 3} ${h / 2 + 4}
               L${-w / 2 + 3} ${h / 2 + 4}
               Q${-w / 2} ${h / 2 + 4} ${-w / 2} ${h / 2}
               Z"
            fill="${COLORS.accent}" />
          <path d="M-7 ${-h / 2 + 1} L0 ${h / 2 - 6} L7 ${-h / 2 + 1} Z" fill="${COLORS.bgElevated}" />
          <path d="M-7 ${-h / 2 + 1} L-2 ${-h / 2 + 6} L-3 ${h / 2 - 9} L-7 ${h / 2 - 5} Z" fill="${COLORS.accentSoft}" />
          <path d="M7 ${-h / 2 + 1} L2 ${-h / 2 + 6} L3 ${h / 2 - 9} L7 ${h / 2 - 5} Z" fill="${COLORS.accentSoft}" />
          <circle cx="0" cy="${h / 2 - 7}" r="1.4" fill="${COLORS.warn}" />
          <circle cx="-0.3" cy="${h / 2 - 7.3}" r="0.5" fill="${COLORS.white}" opacity="0.7" />
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
  // ---------- Decoration sprites — return their own <svg> ----------
  'fdm-rug': {
    slot: 'floor',
    decorViewBox: '0 0 240 28',
    decorContent: `
      <line x1="6" y1="6" x2="6" y2="22" stroke="#7e6747" stroke-width="1" />
      <line x1="3" y1="8" x2="3" y2="20" stroke="#7e6747" stroke-width="1" />
      <line x1="9" y1="8" x2="9" y2="20" stroke="#7e6747" stroke-width="1" />
      <line x1="234" y1="6" x2="234" y2="22" stroke="#7e6747" stroke-width="1" />
      <line x1="231" y1="8" x2="231" y2="20" stroke="#7e6747" stroke-width="1" />
      <line x1="237" y1="8" x2="237" y2="20" stroke="#7e6747" stroke-width="1" />
      <rect x="12" y="4" width="216" height="20" rx="2" fill="#a17b5e" />
      <rect x="14" y="6" width="212" height="16" rx="1.5" fill="none" stroke="#5d4633" stroke-width="0.6" opacity="0.7" />
      <rect x="16" y="8" width="208" height="2.2" fill="#cda07f" opacity="0.85" />
      <rect x="16" y="11" width="208" height="2.2" fill="#b78b65" opacity="0.85" />
      <rect x="16" y="14" width="208" height="2.2" fill="#cda07f" opacity="0.85" />
      <rect x="16" y="17" width="208" height="2.2" fill="#b78b65" opacity="0.85" />
      <rect x="16" y="20" width="208" height="1.8" fill="#cda07f" opacity="0.7" />
    `,
  },
  'modulation-portrait': {
    slot: 'wall',
    decorViewBox: '0 0 60 40',
    decorContent: `
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#8a6f3a" />
      <rect x="4" y="4" width="52" height="32" rx="1" fill="none" stroke="#5a4720" stroke-width="0.6" />
      <rect x="6" y="6" width="48" height="28" fill="#dde9f0" />
      <path d="M 8 20 Q 10 14 12 20 Q 14 26 16 20 Q 18 13 20 20 Q 22 27 24 20 Q 26 12 28 20 Q 30 28 32 20 Q 34 13 36 20 Q 38 27 40 20 Q 42 14 44 20 Q 46 26 48 20 Q 50 16 52 20"
        stroke="#3a5e96" stroke-width="0.9" fill="none" stroke-linecap="round" />
      <path d="M 8 12 Q 30 6 52 12" stroke="#162a52" stroke-width="0.7" fill="none" stroke-dasharray="1.2 1.4" opacity="0.7" />
      <path d="M 8 28 Q 30 34 52 28" stroke="#162a52" stroke-width="0.7" fill="none" stroke-dasharray="1.2 1.4" opacity="0.7" />
      <line x1="4" y1="4" x2="4" y2="36" stroke="#c5a36a" stroke-width="0.6" opacity="0.6" />
    `,
  },
  'diode-frame': {
    slot: 'wall',
    decorViewBox: '0 0 60 40',
    decorContent: `
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#3d3a36" />
      <rect x="4" y="4" width="52" height="32" rx="1" fill="none" stroke="#1f1d1a" stroke-width="0.6" />
      <rect x="6" y="6" width="48" height="28" fill="#dde6e7" />
      <line x1="10" y1="20" x2="22" y2="20" stroke="#2a3540" stroke-width="1" stroke-linecap="round" />
      <path d="M 22 14 L 22 26 L 32 20 Z" fill="#2a3540" />
      <line x1="32" y1="14" x2="32" y2="26" stroke="#2a3540" stroke-width="1.4" stroke-linecap="round" />
      <line x1="32" y1="20" x2="50" y2="20" stroke="#2a3540" stroke-width="1" stroke-linecap="round" />
      <text x="14" y="14" font-size="5" fill="#2a3540" font-family="serif">+</text>
      <text x="44" y="14" font-size="5" fill="#2a3540" font-family="serif">-</text>
    `,
  },
  'realizations-armchair': {
    slot: 'chair',
    decorViewBox: '0 0 50 60',
    decorContent: `
      <rect x="9" y="6" width="32" height="32" rx="6" fill="#a87f9c" />
      <rect x="6" y="32" width="38" height="14" rx="3" fill="#8e6783" />
      <rect x="3" y="26" width="6" height="20" rx="2" fill="#8e6783" />
      <rect x="41" y="26" width="6" height="20" rx="2" fill="#8e6783" />
      <rect x="6" y="46" width="4" height="6" fill="#5a3f51" />
      <rect x="40" y="46" width="4" height="6" fill="#5a3f51" />
      <path d="M 12 20 Q 25 22 38 20" stroke="#5a3f51" stroke-width="0.7" fill="none" opacity="0.6" />
      <path d="M 12 14 Q 17 11 22 14 Q 27 17 32 14 Q 37 11 38 13" stroke="#dac2d0" stroke-width="0.7" fill="none" stroke-linecap="round" />
      <path d="M 12 24 Q 18 27 24 24 Q 30 21 38 26" stroke="#dac2d0" stroke-width="0.7" fill="none" stroke-linecap="round" opacity="0.85" />
      <path d="M 12 30 Q 19 28 26 31 Q 33 34 38 30" stroke="#dac2d0" stroke-width="0.7" fill="none" stroke-linecap="round" opacity="0.7" />
      <ellipse cx="16" cy="14" rx="6" ry="3" fill="white" opacity="0.18" />
    `,
  },
  'static-lamp': {
    slot: 'lamp',
    decorViewBox: '0 0 50 60',
    decorContent: `
      <ellipse cx="25" cy="14" rx="22" ry="10" fill="#ffe9b3" opacity="0.25" />
      <path d="M 12 6 L 38 6 L 42 22 L 8 22 Z" fill="#cbb78a" />
      <path d="M 14 8 L 36 8 L 37 12 L 13 12 Z" fill="white" opacity="0.25" />
      <line x1="8" y1="22" x2="42" y2="22" stroke="#7a6845" stroke-width="0.8" />
      <rect x="24" y="22" width="2" height="28" fill="#8a724b" />
      <ellipse cx="25" cy="52" rx="9" ry="3" fill="#5d4d31" />
      <ellipse cx="25" cy="52" rx="6" ry="1.6" fill="#7a6845" />
      <circle cx="6" cy="14" r="0.7" fill="white" opacity="0.7" />
      <circle cx="9" cy="20" r="0.5" fill="white" opacity="0.6" />
      <circle cx="44" cy="16" r="0.6" fill="white" opacity="0.7" />
      <circle cx="41" cy="22" r="0.5" fill="white" opacity="0.6" />
      <circle cx="3" cy="20" r="0.5" fill="white" opacity="0.5" />
      <circle cx="47" cy="20" r="0.5" fill="white" opacity="0.5" />
      <circle cx="20" cy="3" r="0.4" fill="white" opacity="0.5" />
      <circle cx="32" cy="2" r="0.5" fill="white" opacity="0.6" />
    `,
  },
  'snr-lamp': {
    slot: 'lamp',
    decorViewBox: '0 0 50 60',
    decorContent: `
      <ellipse cx="20" cy="22" rx="16" ry="9" fill="#cfe6f5" opacity="0.32" />
      <path d="M 8 14 L 32 8 L 34 18 L 10 24 Z" fill="#3a5e96" />
      <path d="M 10 15 L 30 10 L 31 13 L 11 18 Z" fill="white" opacity="0.22" />
      <line x1="8" y1="14" x2="10" y2="24" stroke="#162a52" stroke-width="0.8" />
      <text x="14" y="20" font-size="6" fill="white" font-family="sans-serif" font-weight="700" opacity="0.85">S/N</text>
      <line x1="33" y1="13" x2="38" y2="30" stroke="#5d6f8a" stroke-width="1.4" stroke-linecap="round" />
      <line x1="38" y1="30" x2="32" y2="48" stroke="#5d6f8a" stroke-width="1.4" stroke-linecap="round" />
      <ellipse cx="32" cy="50" rx="9" ry="2.6" fill="#162a52" />
      <ellipse cx="32" cy="50" rx="6" ry="1.4" fill="#3a5e96" />
      <circle cx="33" cy="13" r="1.2" fill="#162a52" />
      <circle cx="32" cy="48" r="1.4" fill="#162a52" />
    `,
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

// ---------- DECORATION CARD ----------
function buildDecorationCard(item) {
  const W = 320
  const H = 240
  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="${H * 2}">
  <rect width="${W}" height="${H}" fill="${COLORS.bg}" />
  <text x="12" y="20" font-size="11" fill="${COLORS.fg}" font-family="sans-serif">${item.slot} · ${item.decorViewBox}</text>
  <g transform="translate(40 50)">
    <svg viewBox="${item.decorViewBox}" width="240" height="160" preserveAspectRatio="xMidYMid meet">
      ${item.decorContent}
    </svg>
  </g>
</svg>
  `.trim()
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
const here = dirname(fileURLToPath(import.meta.url))

if ('all' in args) {
  // Generate one preview PNG per item in the registry, into a
  // committed `previews/` directory so we have a persistent visual
  // catalog of every accessory shipped to date.
  const dir = `${here}/previews`
  mkdirSync(dir, { recursive: true })
  for (const id of Object.keys(ITEMS)) {
    if (id.startsWith('_')) continue // skip debug placeholders
    const item = ITEMS[id]
    const isWearable = ['head', 'eyes', 'body', 'accessory'].includes(item.slot)
    if (isWearable) {
      const equippedForItem = {
        head: null,
        eyes: null,
        body: null,
        accessory: null,
      }
      equippedForItem[item.slot] = id
      const svg = buildGrid(equippedForItem)
      const png = await sharp(Buffer.from(svg)).png().toBuffer()
      const outPath = `${dir}/${id}.png`
      writeFileSync(outPath, png)
      console.log('Wrote', outPath)
    } else {
      // Decorations don't equip on the pet — render them inside their
      // own viewBox on a soft background card.
      const svg = buildDecorationCard(item)
      const png = await sharp(Buffer.from(svg)).png().toBuffer()
      const outPath = `${dir}/${id}.png`
      writeFileSync(outPath, png)
      console.log('Wrote', outPath)
    }
  }
} else {
  const equipped = {
    head: args.head ?? null,
    eyes: args.eyes ?? null,
    body: args.body ?? null,
    accessory: args.accessory ?? null,
  }
  const svg = buildGrid(equipped)
  const outPath = `${here}/tmp/preview.png`
  mkdirSync(`${here}/tmp`, { recursive: true })
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  writeFileSync(outPath, png)
  writeFileSync(`${here}/tmp/preview.svg`, svg)
  console.log('Wrote', outPath)
  console.log('Equipped:', equipped)
}
