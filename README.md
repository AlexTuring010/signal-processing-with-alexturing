# Signal Processing Class Hub

Διαδραστικός οδηγός για το μάθημα **K21 — Συστήματα Επικοινωνιών** (ΕΚΠΑ ΔΙΤ, 4ο εξάμηνο). Φτιαγμένο για να καταλαβαίνουν την ύλη οι συμφοιτητές μας — όχι απλά να την αποστηθίζουν.

## Stack

- **Framework:** Next.js 15 (App Router) · TypeScript · React 19
- **Styling:** Tailwind CSS με CSS variables για theming
- **Content:** MDX με `remark-math` + `rehype-katex` για math
- **Vizes:** D3.js (incoming) · Canvas/SVG για απλά demos
- **State:** Zustand + `localStorage` (theme, progress, bookmarks)
- **Deployment:** Vercel (auto από `main`)

## Local development

```bash
npm install
npm run dev
```

Άνοιξε [http://localhost:3000](http://localhost:3000).

### Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

## Repo layout

Δες το [`CLAUDE.md`](./CLAUDE.md) για πλήρες όνομα συμβάσεων και την παιδαγωγική φιλοσοφία.

```
app/                Next.js App Router
  (content)/        Όλες οι ενότητες ύλης (ομαδοποιημένες σε ένα route group)
  page.tsx          Landing
components/
  layout/           Header, Sidebar, Theme, TOC
  content/          Callout, Example, LabBox, Recap, NextUp, ExamProblem
  math/             KaTeX wrappers
  viz/              Interactive visualizations (placeholder for now)
content/sections.ts Single source of truth για το navigation
lib/                store, storage, utilities
plans/              Per-section pedagogical plans (input για Claude Code)
```

## Authoring content

Κάθε ενότητα είναι ένα `app/(content)/<chapter>/<section>/page.mdx`. Το frontmatter ορίζει `title`, `slug`, `prerequisites`, `examWeight`, `lastUpdated`. Νέες ενότητες πρέπει να καταχωρούνται και στο `content/sections.ts` για να εμφανίζονται στο sidebar.

Στο MDX μπορείς να γράψεις math με `$inline$` και `$$display$$` syntax — το `remark-math` + `rehype-katex` το χειρίζονται αυτόματα. Για named εξισώσεις χρησιμοποίησε `<Eq id="eq:..."`.

## Deployment

Push στο `main` → auto-deploy στο Vercel. Δεν χρειάζεται καμία ρύθμιση — το `next.config.mjs` και τα defaults του Vercel τα αναλαμβάνουν.

## License

Φτιαγμένο για τους συμφοιτητές του K21. Δεν περιλαμβάνεται tracking ή analytics.
