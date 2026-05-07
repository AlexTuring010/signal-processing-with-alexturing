import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { CHAPTERS, ALL_SECTIONS } from '@/content/sections'

export type SearchEntry = {
  title: string
  slug: string
  url: string
  chapter: string
  excerpt: string
}

const CONTENT_ROOT = path.join(process.cwd(), 'app', '(content)')

function chapterTitleFor(slug: string): string {
  for (const c of CHAPTERS) {
    if (c.sections.some((s) => s.slug === slug)) return c.title
  }
  return ''
}

function extractDescription(src: string): string {
  const m = src.match(/description:\s*(['"`])([\s\S]*?)\1/)
  if (!m) return ''
  return m[2].replace(/\s+/g, ' ').trim()
}

function readExcerpt(slug: string): string {
  const candidates = [
    path.join(CONTENT_ROOT, slug, 'page.mdx'),
    path.join(CONTENT_ROOT, slug, 'page.tsx'),
  ]
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue
    const raw = fs.readFileSync(file, 'utf8')
    const desc = extractDescription(raw)
    if (desc) return desc
  }
  return ''
}

let cached: SearchEntry[] | null = null

export function buildSearchIndex(): SearchEntry[] {
  if (cached && process.env.NODE_ENV === 'production') return cached
  const entries = ALL_SECTIONS.filter((s) => s.available).map<SearchEntry>((s) => ({
    title: s.title,
    slug: s.slug,
    url: `/${s.slug}`,
    chapter: chapterTitleFor(s.slug),
    excerpt: readExcerpt(s.slug),
  }))
  cached = entries
  return entries
}
