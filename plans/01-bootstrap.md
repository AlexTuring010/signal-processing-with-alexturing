# 01 — Bootstrap: Scaffold the empty site

**Goal:** Set up the Next.js project with all infrastructure, theming, nav, MDX support, math rendering, and Vercel deployment — but **no educational content yet**. After this task is complete, the site should be a polished, deployable empty shell that's ready to receive content section by section.

This plan is for Claude Code to execute end-to-end. The output is a working repo deployed to Vercel.

---

## Acceptance criteria

When this is done, all of the following must be true:

1. `npm run dev` starts a working dev server with zero errors
2. Site loads at `localhost:3000` with a styled landing page
3. Dark/light theme toggle works and persists across reloads
4. Sidebar navigation shell exists (with placeholder section list)
5. An MDX page works end-to-end: a placeholder page like `/foundations/signals` renders MDX content with KaTeX math, a sample `<Callout>`, and a sample `<Viz>` (which can be a placeholder component)
6. Search bar exists in the header (can be non-functional placeholder for now, but rendered)
7. Progress + bookmarks system has its `localStorage` plumbing in place (can be tested with one fake "section complete" toggle on the placeholder page)
8. Repo is initialized, pushed to GitHub, and deployed to Vercel — public URL accessible
9. Mobile layout works (sidebar collapses into a hamburger menu)
10. Lighthouse score >= 90 on Performance, Accessibility, Best Practices

---

## Stack (already decided in `CLAUDE.md`)

- Next.js (App Router, TypeScript)
- Tailwind CSS
- MDX with KaTeX
- Vercel deployment

---

## Step-by-step

### 1. Create the Next.js project

```bash
npx create-next-app@latest signal-processing-with-alexturing \
  --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"
cd signal-processing-with-alexturing
```

### 2. Install dependencies

```bash
# MDX + math
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install rehype-katex remark-math katex
npm install gray-matter

# UI utilities
npm install clsx tailwind-merge
npm install lucide-react           # icons
npm install zustand                # lightweight state for theme/progress/bookmarks

# Math rendering helper
npm install react-katex
```

### 3. Configure MDX + math

In `next.config.mjs`:

- Add `@next/mdx` plugin
- Configure `remark-math` and `rehype-katex`
- Allow `.mdx` page extensions

In `app/layout.tsx`:

- Import `katex/dist/katex.min.css` globally
- Set `<html>` lang to `el` (Greek)
- Wrap with theme provider

### 4. Folder structure (create all of these as empty/placeholder)

```
/app
  /(content)
    /foundations
      /signals/page.mdx        ← placeholder MDX with sample content for QA
    layout.tsx                 ← content layout with sidebar
  /practice/page.tsx           ← placeholder
  /formulas/page.tsx           ← placeholder
  /bookmarks/page.tsx          ← placeholder
  layout.tsx                   ← root layout (theme, fonts, header)
  page.tsx                     ← landing page
  globals.css

/components
  /ui                          (Button, Card, Tabs, Collapsible, Toggle)
  /math                        (BlockMath, InlineMath, Eq)
  /viz                         (PlaceholderViz — a simple component for now)
  /layout
    Header.tsx
    Sidebar.tsx
    MobileNav.tsx
    ProgressDot.tsx
    Bookmark.tsx
    ThemeToggle.tsx
    SearchBar.tsx
  /content
    Callout.tsx
    Example.tsx
    LabBox.tsx
    Recap.tsx
    NextUp.tsx
    ExamProblem.tsx

/lib
  storage.ts                   ← localStorage helpers for theme/progress/bookmarks
  store.ts                     ← Zustand store
  utils.ts                     ← cn() helper, etc.
  content-index.ts             ← static array of sections (slug, title, order, prerequisites)

/content
  sections.ts                  ← single source of truth for navigation/sidebar

/public
  /favicon.ico
  /og-image.png                ← placeholder
```

### 5. Theming

- CSS variables for colors in `globals.css`, with `[data-theme="dark"]` overrides
- `ThemeToggle` component flips `data-theme` on `<html>` and persists to `localStorage`
- Detect `prefers-color-scheme` on first load
- Tailwind config uses CSS variables so utilities respond to theme automatically

Color palette (refine later, this is starting point):
- **Light:** clean white background, dark navy text, blue accent (matches NKUA slide aesthetic loosely without copying)
- **Dark:** deep slate background, off-white text, brighter blue accent

Typography:
- Headings: a clean modern sans (Inter or similar via `next/font`)
- Body: same family, slightly larger line-height (1.7) for readability of math-heavy content
- Math: KaTeX default
- Greek + English must look harmonious. Test with a Greek paragraph and an English technical-term-heavy paragraph side by side.

### 6. Layout shell

**Header (sticky, full width):**
- Site title "Signal Processing with AlexTuring" (left)
- Search bar (center, expands on focus)
- Theme toggle, GitHub link (right)

**Sidebar (sticky, left, desktop only):**
- Site sections grouped by chapter (Intro, Foundations, Randomness, Noise, Modulation, ...)
- Each item has a tiny progress dot (empty/half/full circle from `lucide-react`)
- Current section highlighted
- Collapsible chapter groups

**Right TOC (sticky, desktop only, on content pages):**
- In-page headings (h2, h3)
- Active heading highlighted as user scrolls

**Mobile:**
- Sidebar becomes drawer behind a hamburger
- Right TOC hidden; replaced by a "On this page" expandable at the top of the article

**Footer:**
- Minimal: link to GitHub repo, "Made with care for K21 classmates"

### 7. State / persistence (via Zustand + localStorage)

```ts
// lib/store.ts
type Store = {
  theme: 'light' | 'dark' | 'system'
  setTheme: (t) => void

  completed: Set<string>           // section slugs marked complete
  toggleComplete: (slug) => void

  bookmarks: Set<string>           // anchor ids
  toggleBookmark: (id) => void
}
```

Hydrate from `localStorage` on mount, persist on every change.

### 8. Sample placeholder MDX page

Create `app/(content)/foundations/signals/page.mdx` with content that exercises every component we'll need:

```mdx
---
title: "Σήματα — Εισαγωγή (placeholder)"
slug: "foundations/signals"
order: 1
prerequisites: []
examWeight: 5
lastUpdated: "2026-05-04"
---

# Σήματα

Αυτή είναι μια placeholder σελίδα για να ελέγξουμε ότι όλα δουλεύουν.

<Callout type="intuition">
  Ένα signal είναι απλά μια ποσότητα που αλλάζει στον χρόνο. Το παράδειγμα στη ζωή μας: ο ήχος της φωνής μας.
</Callout>

Η μαθηματική περιγραφή ενός cosine signal είναι:

$$
x(t) = A \cos(2\pi f t + \phi)
$$

όπου $A$ είναι το πλάτος (amplitude), $f$ η συχνότητα (frequency).

<Viz name="placeholder" />

<Example title="Παράδειγμα 1">
Lorem ipsum λύση...
</Example>

<LabBox title="🧪 Lab — Προαιρετικό">
```matlab
t = 0:0.001:1;
x = cos(2*pi*5*t);
plot(t, x);
```
</LabBox>

<Recap>
- Τι είναι ένα signal
- Πώς γράφεται μαθηματικά
</Recap>

<NextUp slug="foundations/fourier" />
```

This page is the QA harness — every component must render correctly here before the bootstrap is "done".

### 9. Search

- Install `flexsearch` or set up `pagefind` (pagefind is better for MDX content but requires a build step)
- For bootstrap, just a placeholder input that opens a modal with "Search coming soon"; full implementation is fine in a follow-up
- Make sure the UI placement and styling are done so it looks complete

### 10. Deployment

- Initialize git, push to a new GitHub repo (user will create the repo and provide URL — Claude Code should ask for it before pushing)
- Connect to Vercel: user does this via the Vercel UI (instruction: import project → select repo → defaults are fine for Next.js → deploy)
- Add a `README.md` with: project description, dev setup, deployment notes
- Confirm the deployed site loads the placeholder page correctly

### 11. Quality gates before declaring done

- [ ] Type checking passes (`tsc --noEmit`)
- [ ] ESLint passes
- [ ] Build succeeds (`npm run build`)
- [ ] All 10 acceptance criteria from the top of this file met
- [ ] Mobile layout tested at 375px width (iPhone SE) and works
- [ ] Theme toggle smooth, no flash of wrong theme on reload (use the standard "blocking script in `<head>`" trick)
- [ ] KaTeX renders correctly in both themes (white background math on dark theme is a common bug)

---

## What is NOT in this task

- ❌ Real educational content (other than the QA placeholder page)
- ❌ Real visualizations (just the `<Viz name="placeholder" />` component that renders a styled empty box with a label)
- ❌ Working search index
- ❌ Real chapter list (just stub it with the section names from `00-overview.md`)
- ❌ Past exam content

These will all come in subsequent plans, one section at a time.

## Open questions to ask the user before starting

1. GitHub repo name preference? (default suggestion: `signal-processing-with-alexturing`)
2. Vercel — does the user want to set up the Vercel project themselves, or have Claude Code provide step-by-step instructions for them to follow?
3. Domain — stay on `*.vercel.app` for now, or do they want a custom domain?

---

## After this is done

The next plan (`02-...`) will tackle the **Intro** section — the very first piece of educational content — with full pedagogical care. We'll write that plan together in the planning chat after the bootstrap site is live and we've poked around it.
