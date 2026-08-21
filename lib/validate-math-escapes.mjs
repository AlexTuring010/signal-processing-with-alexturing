/**
 * Build-time validator: every `<InlineMath>{'…'}</InlineMath>` /
 * `<BlockMath>{'…'}</BlockMath>` child is a **JS string literal**, so a TeX
 * command has to be written with a DOUBLED backslash in the source:
 *
 *     <InlineMath>{'\\beta'}</InlineMath>     ✅  string value is  \beta
 *     <InlineMath>{'\beta'}</InlineMath>      ❌  string value is  <BS>eta
 *
 * A lone backslash is a legal JS escape, so nothing fails: TypeScript is happy,
 * ESLint is happy, `next build` is happy, and the page ships a red KaTeX
 * "ParseError" where the symbol should be. `/practice` is server-rendered on
 * demand, so not even prerendering catches it.
 *
 * This is the single most persistent authoring trap in the repo — hence a guard.
 * Plain `.mjs` so it can run as a build hook without a TypeScript runtime.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, relative, resolve } from 'node:path'
import { glob } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const PATTERNS = ['content/**/*.tsx', 'components/**/*.tsx', 'app/**/*.tsx', 'app/**/*.mdx']

/** Read the JS string literal that starts right after `{'`, honouring escapes. */
function readStringLiteral(src, start) {
  let i = start
  let raw = ''
  for (;;) {
    const c = src[i]
    if (c === undefined) return null // unterminated — let the compiler complain
    if (c === '\\') {
      raw += src[i] + src[i + 1]
      i += 2
      continue
    }
    if (c === "'") return raw
    raw += c
    i += 1
  }
}

const OPEN = /<(?:Inline|Block)Math>\{'/g

async function main() {
  const files = []
  for (const pattern of PATTERNS) {
    for await (const f of glob(pattern, { cwd: repoRoot })) files.push(f)
  }

  const failures = []
  let checked = 0

  for (const file of files.sort()) {
    const src = await readFile(resolve(repoRoot, file), 'utf8')
    OPEN.lastIndex = 0
    let m
    while ((m = OPEN.exec(src)) !== null) {
      const raw = readStringLiteral(src, m.index + m[0].length)
      if (raw === null) continue
      checked += 1
      // Remove every legal doubled backslash; a survivor is a lone one.
      if (raw.replace(/\\\\/g, '').includes('\\')) {
        const line = src.slice(0, m.index).split('\n').length
        failures.push({ file: relative('.', file).replaceAll('\\', '/'), line, raw })
      }
    }
  }

  if (failures.length > 0) {
    console.error(
      `[validate-math-escapes] ${failures.length} math literal(s) use a single backslash ` +
        `where TeX needs a doubled one:\n`,
    )
    for (const f of failures) {
      console.error(`  ${f.file}:${f.line}`)
      console.error(`    found: {'${f.raw}'}`)
      console.error(`    want:  {'${f.raw.replace(/\\(?!\\)/g, '\\\\')}'}\n`)
    }
    console.error(
      'These compile fine and render a red KaTeX ParseError on the page. Double the backslash.',
    )
    process.exit(1)
  }

  console.log(
    `[validate-math-escapes] OK — ${checked} math literals across ${files.length} files, all escaped correctly.`,
  )
}

main().catch((err) => {
  console.error('[validate-math-escapes] failed to run:', err)
  process.exit(1)
})
