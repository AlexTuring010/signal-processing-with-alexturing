# Comments review loop — for the moderator + Claude

Runbook for the comments-review workflow. When the moderator asks Claude
to "check for new comments", Claude follows the steps below.

---

## How comments work on the site

- Every page (theory + practice exercise + homepage) has a `<Comments slug="…">` section.
- Comments + replies are stored in **Supabase** (Postgres). Tables:
  `public.comments`, `public.replies`, `public.profiles`.
- Each comment has `status` (`pending` / `resolved`) and review fields
  (`category`, `points_awarded`, `points_reason`, `reviewed_at`,
  `reviewed_by`).
- Replies authored by the moderator with `is_claude_reply = true` render
  with the Claude logo (`public/claude.png`).
- Section context: `comments.section_title` + `comments.section_anchor`
  identify which heading on a long theory page the user clicked
  "Σχόλιο" next to.
- Auth: Supabase Auth (magic link + Google). Posting requires sign-in;
  reading is public. RLS enforces the rules — see
  `supabase/migrations/0001_init.sql`.

---

## Becoming a moderator

Moderator capability is granted by setting `profiles.role = 'moderator'`
on your row. RLS does not let users self-promote, so this is a one-time
SQL run from the Supabase dashboard:

```sql
update public.profiles
set role = 'moderator'
where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
```

Once flagged, the site shows the **Review mode** toggle, the per-comment
review form, the "Reply ως Claude" checkbox, and unrestricted
delete/resolve actions.

---

## What Claude does on a review pass

When the moderator says **"Check for new comments"** (or similar):

1. **Pull pending comments.** Either:
   - the moderator pastes a query result from Supabase, or
   - the moderator describes them, or
   - if Claude has DB read access, run:
     ```sql
     select c.*, p.display_name as author_name
     from public.comments c
     join public.profiles p on p.id = c.author_id
     where c.status = 'pending'
     order by c.created_at desc;
     ```

2. **Triage each comment.** For every one, decide:
   - **Agree** — there's a real issue (mistake, confusing prose, missing
     piece). Plan a concrete change.
   - **Disagree** — the comment misunderstands the material, or asks
     for something that contradicts the site's pedagogy. Say so.
   - **Partial** — agree with part, push back on part.

   **Don't rubber-stamp.** Comments are user feedback, not orders.
   Defend the teaching philosophy in `CLAUDE.md` when relevant.

3. **Reply on the site.** For each triaged comment, the moderator (signed
   in) opens the page, ticks "Reply ως Claude" on the reply form, and
   posts. Replies are 2–3 sentences max — no walls of text:
   - Whether Claude agrees / disagrees and why.
   - What change (if any) is being made.

4. **Make a plan.** Short list of concrete edits:
   - Files to change, exact location, what changes.
   - Which comments will be marked `resolved` after the change.
   - Which stay `pending` (Claude disagreed) or need the moderator's
     final call.

5. **Implement the changes.** Edit files per the plan, build, commit.

6. **Mark resolved + score.** With Review mode on, the moderator opens
   the **Review & δώσε πόντους** form on each addressed comment, picks a
   `category`, accepts/edits the default points, and saves. Then flips
   `pending → resolved` via the status badge. Disagreed comments stay
   `pending` with the disagreement explained in the reply.

---

## Reply rules (important)

- **Never automatically agree.** If a comment is wrong, say so politely.
- **Keep replies short.** 2–3 sentences. No essays. The detailed
  explanation goes in the actual page edit, not in the reply.
- **Be specific.** "Άλλαξα το βήμα 4 της απόδειξης για να γίνει πιο
  σαφές" beats "θα το δω".
- **Don't promise changes you don't make in the same pass.** If a
  change is deferred, say "θα το αντιμετωπίσω σε επόμενη επανάληψη"
  and leave the comment `pending`.

---

## Categories and default points

Defined in `lib/supabase/types.ts` and enforced as a check constraint in
`supabase/migrations/0001_init.sql`:

| Category | Default points |
|---|---|
| Έγκυρη διόρθωση | 8 |
| Ζητάει χρήσιμη διευκρίνηση | 5 |
| Καλή πρόταση | 5 |
| Συχνή παρανόηση | 3 |
| Λάθος αλλά αποκαλυπτικό | 1 |
| Διπλό | 1 |
| Ασαφές | 0 |
| Χωρίς ουσία | 0 |
| Spam | 0 |

The reviewer can override the default in the form before saving.

---

## Operational notes

- This file (`plans/COMMENTS_LOOP.md`) is the spec. Update it when the
  workflow changes.
- DB access from Claude is optional but useful: configure a read-only
  Postgres MCP server pointed at the Supabase connection string for
  offline triage.
- To soft-reset a contributor's points, set `points_awarded = 0` and
  null out `category` / `points_reason` / `reviewed_at` / `reviewed_by`.
