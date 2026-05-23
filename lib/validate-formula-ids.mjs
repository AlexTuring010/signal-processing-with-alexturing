/**
 * Build-time validator: scans `content/practice/exercises.tsx` for
 * `formulaIds: [...]` arrays and confirms every referenced ID exists in
 * `content/practice/formulas.tsx` (the FORMULA_SHEET source of truth).
 * Wired as the `prebuild` npm script so a dangling reference fails the
 * build before Next.js even starts.
 *
 * Plain `.mjs` rather than `.ts` so it can run as a build hook without
 * a TypeScript runtime — we only need to scan source text, not evaluate
 * the JSX-laden formula definitions.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const formulasPath = resolve(repoRoot, 'content/practice/formulas.tsx')
const exercisesPath = resolve(repoRoot, 'content/practice/exercises.tsx')

function extractDefinedIds(src) {
  // `id: 'xxx'` or `id: "xxx"` inside FORMULA_SHEET entries.
  const re = /\bid:\s*['"]([a-z0-9-]+)['"]/g
  const out = new Set()
  let m
  while ((m = re.exec(src)) !== null) out.add(m[1])
  return out
}

function extractReferencedIds(src) {
  // `formulaIds: [ 'a', 'b', ... ]` — capture array body, then pull
  // each quoted string. Allows commas, whitespace, line breaks inside.
  const arrRe = /formulaIds:\s*\[([^\]]*)\]/g
  const refs = new Map()
  let m
  while ((m = arrRe.exec(src)) !== null) {
    const idRe = /['"]([a-z0-9-]+)['"]/g
    let im
    while ((im = idRe.exec(m[1])) !== null) {
      const id = im[1]
      refs.set(id, (refs.get(id) ?? 0) + 1)
    }
  }
  return refs
}

async function main() {
  const [formulasSrc, exercisesSrc] = await Promise.all([
    readFile(formulasPath, 'utf8'),
    readFile(exercisesPath, 'utf8'),
  ])

  const defined = extractDefinedIds(formulasSrc)
  const referenced = extractReferencedIds(exercisesSrc)

  const totalRefs = [...referenced.values()].reduce((a, b) => a + b, 0)
  console.log(
    `[validate-formula-ids] ${defined.size} ids in FORMULA_SHEET, ` +
      `${referenced.size} unique ids referenced across ${totalRefs} declarations.`,
  )

  const dangling = []
  for (const [id, count] of referenced) {
    if (!defined.has(id)) dangling.push({ id, count })
  }

  if (dangling.length > 0) {
    console.error(
      `[validate-formula-ids] FAIL — ${dangling.length} dangling reference(s) in exercises.tsx:`,
    )
    for (const { id, count } of dangling) {
      console.error(`  - "${id}" referenced ${count}× but not in FORMULA_SHEET`)
    }
    console.error(
      '\nFix: either restore the missing id in content/practice/formulas.tsx, ' +
        'or update the formulaIds reference in content/practice/exercises.tsx.',
    )
    process.exit(1)
  }

  console.log('[validate-formula-ids] OK — every formulaIds reference resolves.')
}

main().catch((err) => {
  console.error('[validate-formula-ids] crashed:', err)
  process.exit(1)
})
