# signal-processing-with-alexturing

An **interactive study companion** for the **K21 — Communication Systems** course at the University of Athens (Department of Informatics & Telecommunications, 4th semester). Built to help my Greek-speaking classmates *understand* the material rather than memorize it.

**Live: [signal-processing-with-alexturing.vercel.app](https://signal-processing-with-alexturing.vercel.app)**

The site is **in Greek** because its audience is. This README is in English for anyone landing on the repo from outside the course.

## What's on the site

- **Long-form lessons** in MDX, structured around the course syllabus. Each section has its own pedagogical plan in `plans/` that gets handed to Claude Code one at a time for incremental drafting.
- **Interactive math** — KaTeX-rendered equations, `<Eq id="…" />` for named formulas you can cross-reference, sliders and Canvas/SVG demos for signal-shaping intuition.
- **Comment system on every section** — Supabase-backed, magic-link or Google sign-in. Authors can edit/delete their own posts within 10 minutes; moderator role for the rest. Includes a special `is_claude_reply` flag for assistant-authored replies (moderator-gated).
- **Practice hub** with past exam problems indexed by topic.
- **Formula sheet** as an interactive page rather than a PDF.
- **Gamification** — an "orchard" with trees that produce apples for engagement, plus per-section collectible skins. The most recent commits in the repo's history are working through Phase 5 of the collectibles roll-out.

## Stack

- **Next.js 15** (App Router) · **TypeScript** · **React 19**
- **Tailwind CSS** with CSS variables for theming
- **MDX** content with `remark-math` + `rehype-katex`
- **D3.js** for data-driven visualizations; **Canvas/SVG** for simple animations
- **Zustand + localStorage** for client-side state (theme, progress, bookmarks)
- **Supabase** (Postgres + Auth + RLS) for comments, replies, profiles, leaderboard
- **Vercel** auto-deploys from `main`

## Repository layout

```
app/                Next.js App Router
  (content)/        All study content, grouped under one route group
  practice/         Exam-problem hub
  formulas/         Interactive formula sheet
  sign-in/, profile/, auth/...    Supabase auth flows
  page.tsx          Landing
components/
  layout/           Header, Sidebar, Theme toggle, TOC
  content/          Callout, Example, LabBox, Recap, NextUp, ExamProblem
  math/             KaTeX wrappers
  viz/              Interactive visualizations
content/sections.ts Single source of truth for nav
lib/                Stores, storage utilities, signal helpers, Supabase clients
plans/              Per-section pedagogical plans
supabase/migrations Postgres schema + RLS policies
scripts/review/     Moderator workflow CLI — list-pending, reply, resolve
```

## Built with Claude Code — and the `/comments-review` skill

The whole site is an experiment in **collaborative authoring with Claude Code**. I write the pedagogical plans in `plans/` one section at a time, hand each plan to Claude as the input for a focused drafting session, and review/edit the resulting MDX before it ships. The site grew section-by-section this way, not in one big push.

The most interesting piece is the **closed loop with my readers**:

```
classmate spots an error or confusion          /comments-review skill
   in a section                                                │
        │                                                      │
        ▼                                                      ▼
   posts a comment            ──── stored in Supabase ────▶  fetches pending
   (magic-link auth, free text)                              comments by section
                                                              │
                                                              ▼
                                                       analyzes against
                                                       the source MDX
                                                              │
                                                              ▼
                                                       proposes site changes
                                                       (typo fix, clarification,
                                                        new example, …)
                                                              │
                                                              ▼
                                                       I review + accept
                                                              │
                                                              ▼
                                                       comment marked resolved
                                                       with the diff that
                                                       addressed it
```

The skill that runs this is invoked as `/comments-review` from Claude Code. Under the hood it uses the same moderator endpoints that `npm run comments:list / comments:reply / comments:resolve` expose, but instead of replying *to* the comment, it reads the comment, reads the relevant section's MDX, and **proposes the edit that resolves the underlying issue**. The original commenter then sees the change shipped on the site, not just a reply text.

This is the part of the site I'm proudest of architecturally. The moderation pipeline is the same one `is_claude_reply` toggles in the Supabase schema — Claude's edits are first-class citizens, not bolted on.

## Project artefacts (the "how" of the work)

- **`CLAUDE.md`** — the hard rules for working on the site (audience definition, tech stack, naming conventions, pedagogy non-negotiables)
- **`COMMITMENTS.md`** — what the site promises its users; the bar everything new must clear
- **`plans/`** — per-section pedagogical plans, written by me, consumed by Claude one at a time

The disciplined-process-as-document pattern is the same one from [ai-class-hw2](https://github.com/AlexTuring010/ai-class-hw2) — works well for projects with a long surface area and a single human author.

## Develop

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run typecheck            # tsc --noEmit
npm run lint                 # ESLint
npm run comments:list        # moderator workflow (needs Supabase env vars in .env.local)
```

Supabase env vars (see `.env.local.example`) are needed for the comment system; otherwise the site runs read-only just fine.

## License

[MIT](LICENSE) — applies to my own code in this repo. Past-exam content under `past_exams/` and lecture-slide content under `slides/` are course material and retain their original copyright.
