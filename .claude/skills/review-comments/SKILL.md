---
name: review-comments
description: Run the pending-comments review loop end to end. Use when the moderator says "review pending comments", "check for new comments", "process the queue", or similar. Pulls the queue via the CLI, triages each comment against the actual file, replies, marks resolved with category + points, commits any code changes, and pushes.
---

You are the moderator's reviewer for this site's comment queue. Follow
the runbook in `plans/COMMENTS_LOOP.md` exactly. **Re-read that file at
the start of every invocation** — it is the spec; this skill is just
the trigger.

## High-level steps

1. Read `plans/COMMENTS_LOOP.md` in full. Do not skim.
2. Run `npm run comments:list` and parse the JSON output.
3. If the queue is empty: tell the moderator, do nothing else, exit.
4. For each pending comment, in order (oldest first):
   - Open the file the comment is about (use the slug → file mapping
     in COMMENTS_LOOP.md). Verify the comment's claims against what
     the file actually says — do not reply from memory.
   - Pick a verdict: **fix** / **reply only** / **redirect**.
   - If verdict is **fix**: edit the file(s), commit with a message
     ending `(comment <8-char id prefix>)`.
   - Run `npm run comments:reply -- <id> "<body>"` with a Greek,
     2–3 sentence reply that matches the rules in COMMENTS_LOOP.md.
   - Run `npm run comments:resolve -- <id> <category> <points> "[reason]"`
     with the appropriate category from the table.
5. If any commits were made this pass, `git push` once at the end.
6. Report a one-line summary per comment to the moderator:
   ```
   - <id-prefix> <slug>#<anchor> — <verdict> — <category>+<pts> — <one-line>
   ```

## Hard requirements

- **Never invent.** If a comment claims something is wrong, locate the
  exact line in the file and quote-check it.
- **Never auto-agree.** If the comment is wrong, the reply says so.
- **Default to redirect over rewrite.** The site is anchored to lecture
  material; only fix when there's a real bug or gap.
- **Always resolve every comment** you process. The pending queue
  should be empty after a successful pass.
- **Hard stops** (math typology / `(content)` layout / auth+RLS /
  open commitments): do not act, leave pending, surface to the
  moderator.

## Failure modes to watch for

- `comments:list` errors mentioning missing env: the moderator hasn't
  pasted `SUPABASE_SERVICE_ROLE_KEY` into `.env.local`. Tell them and
  exit.
- Empty queue: don't fabricate work.
- A comment that requires interactive judgment from the moderator
  (e.g. policy decision): leave it pending and call it out by id in
  the summary.

## What this skill does NOT do

- Does not run on a schedule. Trigger is always the moderator typing
  the phrase or invoking the slash command.
- Does not bypass the COMMENTS_LOOP.md rules. If the runbook and this
  file disagree, the runbook wins — update the runbook first if rules
  need to change, then this skill.
