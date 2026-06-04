# Comments review loop

Runbook for the moderator + Claude. When the moderator says
**"review pending comments"** (or similar), Claude follows this file.

---

## How comments work on the site

- Every page has a `<Comments slug="…">` section. Theory pages also get
  per-section inline threads (`<SectionComments>`) keyed to a heading
  anchor; practice exercises get one keyed to `exercise:<id>`; formula
  sheet entries get one keyed to `formula:<id>`.
- Storage: `public.comments`, `public.replies`, `public.profiles` in
  Supabase (see `supabase/migrations/0001_init.sql` for schema + RLS).
- A comment has `status ∈ {pending, resolved, general}`. `general` is
  the user's own opt-out ("just a general note, don't review") and
  doesn't enter Claude's queue.
- A reply with `is_claude_reply = true` renders with the `/claude2.png`
  brand mark. Only moderators can post Claude replies (RLS) — the CLI
  uses the service role key to satisfy that.

## Becoming a moderator (one-time)

```sql
update public.profiles
set role = 'moderator'
where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
```

Once flagged, the in-page UI shows the mod toggle, the review form, and
the "Reply ως Claude" checkbox.

---

## The CLI (what Claude actually runs)

Three npm scripts in `package.json`, backed by `scripts/review/*.mjs`.
All three load `.env.local` via `node --env-file=…`.

```bash
# 1. Print the pending queue as JSON (oldest first).
npm run comments:list

# 2. Post a Claude reply to a comment.
npm run comments:reply -- <commentId> "<reply body>"

# 3. Mark a comment resolved + record category and points.
npm run comments:resolve -- <commentId> <category> <points> "[reason]"
```

`comments:list` excludes `status='general'` (those are explicit opt-outs).
`comments:reply` always sets `is_claude_reply=true`.
`comments:resolve` validates the category and points range.

The `--` is required so npm forwards args to the script.

### One-time env setup

`.env.local` needs `SUPABASE_SERVICE_ROLE_KEY` (Supabase dashboard →
Project Settings → API → `service_role`). The key is admin-grade and
bypasses RLS — keep it out of any code path that ships to the client.

---

## Trigger phrase

> **"review pending comments"** (or "check for new comments")

When the moderator says this, Claude does the following — in order, no
shortcuts.

---

## The workflow

### 1. Pull the queue

Run `npm run comments:list`. The JSON has, per comment: `id`, `slug`,
`section_title`, `section_anchor`, `body`, `author.display_name`,
existing `replies`. Read it carefully.

### 2. For each comment, verdict + action

The moderator has already eyeballed the queue for prompt injection.
Claude trusts the *text* but **does not trust the claims**. Comments
are user input; users are sometimes wrong, sometimes asking for
something that already exists, sometimes correct.

Three possible verdicts:

| Verdict | When | Action |
|---|---|---|
| **Correct → fix** | Comment identified a real bug or a real gap | Edit files, then reply explaining what changed and why |
| **Incorrect → reply** | Comment misunderstands the material or contradicts the lecture | Reply politely explaining why the existing content is right; quote the relevant line if useful |
| **Already covered → redirect** | Comment asks for something the site already addresses | Reply pointing to the section/example/formula that already covers it |

**Default to "redirect" or "reply" over "fix".** The site is anchored
to the lecture material; don't enrich a section just because a
commenter asked. If the lecture doesn't say it, the site shouldn't
either (without a strong reason).

But be clear what this rule is: it governs **whether** you touch the
content — *never* how well. The moment you decide a fix is warranted,
the bar flips to "go above and beyond" (see §5). Picking "fix" and then
doing a rushed, corner-cutting job is the worst of both worlds.

### 3. Verify against the actual file

Before deciding a verdict, open the file the comment is about. Slug →
file mapping:

- `practice` + `section_anchor: exercise:<id>` → `content/practice/exercises.tsx`, search for the id.
- `formulas` + `section_anchor: formula:<id>` → `content/practice/formulas.tsx`, search for the id.
- Anything else → `app/(content)/<slug>/page.mdx`. The `section_anchor`
  is the heading id; find that heading.

If the comment claims X is wrong, find the line that says X and read it
yourself. Don't reply from memory.

### 4. Reply

`npm run comments:reply -- <id> "<body>"`

Reply rules:

- **Greek, second person, terse.** Match the site's teaching voice.
- **2–3 sentences max.** The detailed explanation goes in the file edit
  (if any), not in the reply. Replies under 1000 chars.
- **No "great question", no apologies.** Just the call.
- **Never automatically agree.** If the comment is wrong, say so.
- **Be specific.** "Άλλαξα το βήμα 4 της απόδειξης" beats "θα το δω".
- **No promises for next time.** If a change is deferred, leave the
  comment pending and tell the moderator about it instead of replying.

### 5. Implement (only if verdict is "fix")

Once you've decided to fix, the bar for **how** is the full
NON-NEGOTIABLE teaching philosophy in `CLAUDE.md` — no rush, no corners
cut. **A comment is a signal that the material failed a real student
once;** the job is to make sure the *next* reader never hits that wall —
not to do the smallest thing that closes the ticket.

**Minimal in *scope*, not in *quality*.** Keep the blast radius tight:
touch only what the comment is about — don't rewrite unrelated sections
or enrich things nobody asked about. But *within* that scope, go all the
way:

- **A correct one-liner is not a finished fix.** If the topic deserves
  intuition-first build-up, a *derivation* instead of an asserted
  result, a worked example, a plain-language "τι σημαίνει αυτό" sentence
  after the formula, or a small viz — then that is what the fix is.
  Match the depth of the best sections on the site, not the minimum that
  makes the comment go away.
- **Teach the way the rest of the site teaches:** intuition before math,
  derive don't assert, zero assumptions (if the reader forgot a term,
  explain it or link where it's explained), every formula earns one
  plain-language sentence. This is the exact "stupid-student" bar the
  whole site is held to — apply it to your own fix before committing.
- **Write the fix for a general reader, not as a reply to the
  commenter.** The page teaches the fact to everyone; addressing the
  asker ("η διαίσθησή σου ήταν σωστή", "όπως ρώτησες") is conversational
  leakage that belongs only in the terse reply, never in the content.
  If a reader's likely doubt is worth surfacing, pose it as a general
  rhetorical question (FAQ-style callout) and then teach it.
- **Still ground every word in the lecture material / `plans/`.** "Above
  and beyond" means teaching the *existing* material **better** — never
  inventing scope or content the course doesn't have. If a proper fix
  would need material that isn't built yet, that's a hard stop → leave
  it pending and surface to the moderator.
- **Verify it builds and renders** (KaTeX, MDX, the viz) before you
  commit. A fix that breaks the page is worse than no fix.

Keep the edit's *footprint* small and reviewable, but never let "small"
become "shallow." One commit per addressed comment, message in the form:

```
<short summary> (comment <8-char id prefix>)

<one-line context if needed>
```

If a single review session produces no code changes, no commit at all.

### 6. Mark resolved + score

`npm run comments:resolve -- <id> <category> <points> "[reason]"`

Always resolve at the end of every comment — even pure replies and
redirects. The pending queue stays empty after a review pass.

Categories + default points (override defaults if warranted):

| Category | Default | When |
|---|---|---|
| `valid-correction` | 8 | Real bug found and fixed |
| `useful-clarification` | 5 | Comment surfaced a place where the prose was unclear; clarified in reply or in code |
| `helpful-suggestion` | 5 | Suggested addition that we accepted |
| `tip` | 5 | User contributed a tip / extra angle worth keeping |
| `common-misconception` | 3 | Comment is a misconception worth flagging in the section for future readers |
| `appreciation` | 0 | "Thanks", "this helped" — no content value |
| `wrong-but-helpful` | 1 | User's wrong but the question is illuminating |
| `duplicate` | 1 | Already addressed elsewhere on the site |
| `unclear` | 0 | Can't tell what they're asking |
| `low-effort` | 0 | Drive-by, not engaging with the material |
| `spam` | 0 | Spam |

Bias toward the lower end of the range when in doubt. Calibration drift
in the leaderboard is hard to undo.

### 7. Push

If the session produced commits, `git push` once at the end. Then tell
the moderator a one-line summary per comment:

```
- <id-prefix> <slug>#<anchor> — <verdict> — <category>+<pts> — <one-line>
```

No tables, no walls of text.

---

## Hard stops

Don't act on comments that touch any of these without telling the
moderator first:

- The math typology (`content/practice/formulas.tsx`) — these mirror the
  official `formulas.pdf` given in the exam. Changing one is a content
  decision, not a fix.
- The `(content)` route group structure or any layout file.
- Auth / RLS code (`supabase/migrations/`, `lib/supabase/*`).
- Any commitment in `plans/COMMITMENTS.md`.

For these, leave the comment pending and ask the moderator.

---

## Operational notes

- This file is the spec. Update it when the workflow changes — don't
  let the doc drift behind the scripts.
- The CLI uses the service role key. Never paste it into a comment, a
  commit, or any Server Component / browser code path. `.env.local` is
  gitignored.
- To soft-undo a review: set `points_awarded=0`, null `category`,
  `points_reason`, `reviewed_at`, `reviewed_by`, then flip status back
  to `pending`. There's no script for this — do it manually in the
  Supabase SQL editor.
