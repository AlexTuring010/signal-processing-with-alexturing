# Comments review loop — for AlexTuring + Claude

This file is the runbook for the comments-review workflow on the site.
When AlexTuring asks Claude to "check for new comments", Claude follows
the steps below.

---

## How comments work on the site

- Every page (theory + practice exercises + homepage) has a `<Comments>`
  component at the bottom.
- Comments are stored client-side in `localStorage` under keys like
  `spwa:comments:foundations/fourier-transform`.
- Each comment has `status`: `pending` ("Προς review") or `resolved`.
- Each comment can have **replies**. Replies authored by `Claude`
  (with `isClaudeReply: true`) render with the Claude logo
  (`public/claude.png`).
- There is no server. Comments don't sync between devices and don't
  appear in any database. AlexTuring is the source of truth.

## What Claude is supposed to do

When AlexTuring says **"Check for new comments"** (or similar), Claude:

1. **Read all `pending` comments**. AlexTuring will paste the
   comment dump (JSON copied from `localStorage`) or describe them.

2. **Triage each comment.** For every one, decide:
   - **Agree** — there's a real issue (mistake, confusing prose, missing
     piece). Plan a concrete change to the site.
   - **Disagree** — the comment is asking for something that doesn't
     belong, contradicts the site's pedagogy, or is based on a
     misunderstanding. Say so.
   - **Partial** — agree with part, push back on part.

   **Don't just rubber-stamp.** Comments are user feedback, not orders.
   The site has a teaching philosophy in `CLAUDE.md` — defend it when
   relevant.

3. **Reply on the site.** For every triaged comment, draft a short reply
   (2-3 sentences max — no walls of text). The reply explains:
   - Whether Claude agrees or disagrees and why.
   - What change (if any) is being made.

   These replies are added to the same `localStorage` key with
   `isClaudeReply: true` so they render with the Claude avatar. They
   appear under the original comment as a threaded reply.

4. **Make a plan.** Write a short plan listing the concrete changes:
   - Files to edit, exact location, what changes.
   - Which comments will be marked `resolved` after the change.
   - Which comments will stay `pending` (because Claude disagreed) or
     be flagged for AlexTuring's call.

5. **Implement the changes.** Edit the files per the plan, build, commit.

6. **Mark resolved.** For each comment whose underlying issue is now
   fixed, flip its status to `resolved`. Disagreed comments stay
   `pending` with the disagreement explained in the reply.

## Reply rules (important)

- **Never automatically agree.** If a comment is wrong or
  misunderstanding the material, say so politely.
- **Keep replies short.** 2-3 sentences. No essays. The detailed
  explanation goes in the actual page edit, not in the reply.
- **Be specific.** "Σου αλλάζω το βήμα 4 της απόδειξης για να γίνει πιο
  σαφές" beats "θα το δω".
- **Don't promise changes you don't make in the same pass.** If a
  change is deferred, say "θα το αντιμετωπίσω σε επόμενη επανάληψη"
  and leave the comment `pending`.

## Operational notes

- Comments are localStorage-only. To see them all, AlexTuring opens
  DevTools → Application → Local Storage and filters keys starting with
  `spwa:comments:`. The JSON value of each key is the array of comments
  for that slug.
- Until we add a backend, the canonical comment list lives on
  AlexTuring's browser. To trigger a review pass, AlexTuring exports
  the JSON and pastes it into the chat.
- This file (`plans/COMMENTS_LOOP.md`) is the spec. Update it when the
  workflow changes.
