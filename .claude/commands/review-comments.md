---
description: Run the pending-comments review loop end to end (list, triage, reply, resolve, push).
---

Run the comments review loop. Follow `plans/COMMENTS_LOOP.md` exactly —
re-read it now before doing anything else; it is the spec, this command
is just the trigger.

High-level steps (do not skip any):

1. Read `plans/COMMENTS_LOOP.md` in full.
2. Run `npm run comments:list` and parse the JSON.
3. If the queue is empty, say so and stop.
4. For each pending comment, oldest first:
   - Open the file the comment refers to (slug → file mapping is in
     COMMENTS_LOOP.md). Verify the comment's claims against what the
     file actually says — never reply from memory.
   - Pick a verdict: **fix** / **reply only** / **redirect**.
   - If verdict is *fix*: edit files **to the full teaching bar — don't
     rush or cut corners (see COMMENTS_LOOP §5)**, then commit with
     message ending `(comment <8-char id prefix>)`.
   - `npm run comments:reply -- <id> "<Greek 2–3 sentence body>"`
   - `npm run comments:resolve -- <id> <category> <points> "[reason]"`
5. If any commits were made, `git push` once at the end.
6. Report a one-line summary per comment to the moderator.

Hard requirements:

- Never auto-agree. If a comment is wrong, the reply says so politely.
- Default to redirect over rewrite when deciding *whether* to touch the
  content — the site is anchored to lecture material, so only fix a real
  bug or gap.
- But once you decide to fix, **do not cut corners.** Fix to the full
  teaching bar in `CLAUDE.md` (intuition first, derive don't assert,
  zero assumptions, worked example/viz where it helps, a plain-language
  sentence after every formula). Minimal in *scope* — touch only the
  comment's topic — but never minimal in *quality*. A correct-but-terse
  one-liner is not a finished fix; build it for the next reader who hits
  the same wall, not just to close the comment.
- Always resolve every comment processed. The pending queue should be
  empty after a successful pass.
- Hard stops (math typology, `(content)` layout, auth+RLS, open
  commitments): leave pending, surface to the moderator.
