# Plan 05 — Guest commenting (no account required)

Reverses the "decline" recommendation in plan 04 for the unauthenticated
posting ask (comment `5a99c457`). Audience is small (~50–200 K21
students at NKUA), site is not on any spam-bot radar, mod cleanup is
cheap. The captcha + rate-limit infrastructure was over-engineering.

## What we're shipping

- Visitors can post a comment **without signing in**.
- All guest comments + replies render as **"Επισκέπτης"** with no
  avatar and a visually distinct, dashed border. No display name field.
- No points, no leaderboard entry, no self-delete, no privacy toggles
  for guests. Sign-in is the path to all of those.
- Mods can still delete guest content; the rest of the moderation flow
  (review, points, replies as Claude) is unchanged.

## Why no display name

The only abuse vector worse than spam at this audience size is
**impersonation**: a guest setting `display_name = "Μαρία
Παπαδοπούλου"` and posting something embarrassing in a real
classmate's name. Free-text guest names invite this; a fixed
"Επισκέπτης" with a distinct visual style closes the door.

If a guest cares enough about identity to ask for one, the magic-link
sign-in is one click away.

## Why no captcha (and what happens if we're wrong)

Spam bots target known patterns. The Supabase REST endpoint is one,
but the form is JS-mediated and the audience is tiny. Realistic risk
for v1 is near-zero.

If spam *does* happen:
1. Mod runs `delete from public.comments where author_id is null and created_at > '...'`.
2. We add Cloudflare Turnstile in 30 minutes (form-side script, one
   server-side verify call).
3. Spam was a temporary cost; the friction reduction stays a
   permanent benefit.

That trade is fine.

## Schema (migration `0005_guest_commenting.sql`)

```sql
alter table public.comments alter column author_id drop not null;
alter table public.replies  alter column author_id drop not null;
```

No new columns. **No `guest_session_id`** for self-delete — at this
audience size, the right answer for typos is "post a follow-up" or
"ask a mod to nuke it"; the cookie+RLS dance for self-delete adds
complexity without a real win.

## RLS

Split each insert policy into a `_user` half (current behaviour) and a
`_guest` half (strictly constrained):

```sql
drop policy if exists comments_insert on public.comments;

create policy comments_insert_user on public.comments
  for insert with check (
    author_id is not null
    and auth.uid() = author_id
    and status in ('pending', 'general')
    and visibility in ('public', 'mod_only')
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );

create policy comments_insert_guest on public.comments
  for insert with check (
    author_id is null
    and status = 'pending'
    and visibility = 'public'
    and is_anonymous = false
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );
```

Same split on replies (`replies_insert_user` keeps current rules;
`replies_insert_guest` requires `author_id is null`,
`is_claude_reply = false`, `is_anonymous = false`).

**Delete:** `comments_delete_own` stays gated on `auth.uid()` —
guests have no self-delete path. `comments_delete_mod` continues to
cover the cleanup case.

## App changes

### Composer (`CommentsClient`, `SectionComments`)

- Stop short-circuiting to the "Συνδέσου για να αφήσεις σχόλιο"
  card when `me === null`.
- Always render the textarea + submit. When signed-in: show the
  three privacy toggles + the "Ως: <avatar> <name>" line. When
  guest: show a "Posting ως Επισκέπτης — χωρίς πόντους" pill and a
  small "Συνδέσου" link below.
- Insert payload differs by branch:
  - Signed-in: `author_id: me.id`, all toggle fields as today.
  - Guest: `author_id: null`, `visibility: 'public'`,
    `is_anonymous: false`, `status: 'pending'`. RLS rejects anything
    else.
- Optimistic row uses `author: null` for guests; the renderer is
  responsible for the "Επισκέπτης" treatment.

### Reply form

Same pattern: when `me` is null, render a stripped-down reply form
that submits with `author_id: null`. No "Reply ως Claude" toggle.

### Render

- When `comment.author_id === null` (or `reply.author_id === null`):
  - Render the name as **"Επισκέπτης"**.
  - No `UserAvatar` — use a generic placeholder (small dashed circle
    with `User` icon, muted).
  - Wrapper border becomes `border-dashed border-fg-subtle/40` to
    visually separate from named comments.
  - All anon/mod-only suffixes skip (none apply to guests by RLS).

- `author_id IS NULL` is the source of truth for "is guest". Don't
  confuse with anonymized authors: a signed-in user posting
  anonymously has `author_id` set + `is_anonymous: true`, and the
  anonymize helper has already stripped `author` to a placeholder.

### `anonymize.ts` tweak

`shouldReveal(authorId: string | null, viewer)` should accept null —
guests are never anonymized (is_anonymous is forbidden for them by
RLS), but the type needs to allow null to keep TS happy.

## Out of scope

- Captcha / rate limit (revisit only if spam happens).
- Guest self-delete.
- Guest display-name input (deliberately omitted — impersonation).
- Guest reactions / upvotes / anything that needs identity.

## Phasing

1. Migration `0005_guest_commenting.sql`.
2. Types + anonymize helper (allow null `author_id`).
3. Render: "Επισκέπτης" path + dashed-border styling.
4. Composer + reply form: guest branch.
5. Smoke build + push.

## Bookkeeping

Comment `5a99c457` was previously resolved as `helpful-suggestion`+2
with a "Declined" reason. We're now shipping the underlying ask. The
CLI doesn't have an update path; if you want the leaderboard fair,
manually bump the points / clear the "Declined" reason in Supabase.
A follow-up reply is fine via `comments:reply`.
