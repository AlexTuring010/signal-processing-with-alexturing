/**
 * Copy the past-exam scans into public/exams/ under stable ASCII slugs.
 * Phone photos (12 MP) are downscaled; already-small scans are copied as-is.
 * Originals in past_exams/ are never modified.
 *
 * Run from the repo root:  node scripts/build-exam-assets.mjs
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const OUT = 'public/exams'
const MAX_W = 1600
const QUALITY = 82

// source → output page files, in page order
const PAPERS = {
  'sept-2025': ['past_exams/2025_sept_exam.jpg'],
  'jan-2026': ['past_exams/Epi-Ptyxio-Jan-26_1.jpg', 'past_exams/Epi-Ptyxio-Jan-26_2.jpg'],
  'june-2025': ['past_exams/Syst-Epik-June-2025.pdf'],
  'proodos-a-2025': ['past_exams/proodos_a1.jpg', 'past_exams/proodos_a2.jpg'],
  'proodos-b-2025': ['past_exams/proodos_b1.jpg', 'past_exams/proodos_b2.jpg'],
  'proodos-april-2026': ['past_exams/προοδος_2026.jpg'],
  // NB: Greek capital Beta (U+0392) in these two filenames, not Latin B
  'june-2026': ['past_exams/6-17-2026-Β1.jpg', 'past_exams/6-17-2026-Β2.jpg'],
}

fs.mkdirSync(OUT, { recursive: true })

const report = []
for (const [source, files] of Object.entries(PAPERS)) {
  for (let i = 0; i < files.length; i++) {
    const src = files[i]
    if (!fs.existsSync(src)) { console.log('MISSING:', src); continue }
    const ext = path.extname(src).toLowerCase()
    const dest = path.join(OUT, `${source}-p${i + 1}${ext === '.pdf' ? '.pdf' : '.jpg'}`)
    const before = fs.statSync(src).size

    if (ext === '.pdf') {
      fs.copyFileSync(src, dest)
      report.push([dest, before, before, 'copied (pdf)'])
      continue
    }

    // failOn:'none' so the two truncated Πρόοδος A scans still transcode
    const img = sharp(src, { failOn: 'none' })
    const meta = await img.metadata()
    // 5% slack: shaving a handful of pixels off an already-small scan only
    // costs bytes (re-encode inflates), it doesn't save any.
    const resize = meta.width > MAX_W * 1.05
    await img
      .rotate() // honour EXIF orientation
      .resize(resize ? { width: MAX_W } : undefined)
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(dest)
    let after = fs.statSync(dest).size
    let note = `${meta.width}x${meta.height} → ${MAX_W}w`
    // Re-encoding an already-small, already-optimised scan can inflate it.
    // When we didn't downscale and the result is no smaller, keep the original.
    if (!resize && after >= before) {
      fs.copyFileSync(src, dest)
      after = before
      note = `${meta.width}x${meta.height} (kept — re-encode was larger)`
    } else if (!resize) {
      note = `${meta.width}x${meta.height} (kept size, recompressed)`
    }
    report.push([dest, before, after, note])
  }
}

let tb = 0, ta = 0
console.log(
  '\n' + 'output'.padEnd(34) + 'before'.padStart(10) + 'after'.padStart(10) + '  note',
)
for (const [d, b, a, n] of report) {
  tb += b; ta += a
  console.log(
    d.padEnd(34),
    (Math.round(b / 1024) + 'K').padStart(10),
    (Math.round(a / 1024) + 'K').padStart(10),
    ' ' + n,
  )
}
console.log('\nTOTAL', Math.round(tb / 1024) + 'K', '->', Math.round(ta / 1024) + 'K')
