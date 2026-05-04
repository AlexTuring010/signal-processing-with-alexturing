/**
 * Re-export of the static section index from /content. Lives in /lib so
 * components can import from a "logic" path without crossing into /content.
 */
export {
  CHAPTERS,
  ALL_SECTIONS,
  AVAILABLE_COUNT,
  findSection,
  type Section,
  type Chapter,
} from '@/content/sections'
