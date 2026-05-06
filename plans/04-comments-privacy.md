# Plan 04 — Comments privacy: mod-only + anonymous + unauthenticated

Three feature requests came in via the comments queue. They look similar
("I want to comment with less exposure") but they sit at very different
points on the cost/risk curve. Treating them as one ask would either
under-build or over-build.

## The three requests

| ID | Slug | Ask | Source |
|---|---|---|---|
| (a) | `homepage` | Comments visible only to moderators | `389a6246` |
| (b) | `homepage` | Comments where the author's name is hidden from other readers | `389a6246` |
| (c) | `homepage` | Commenting without signing in | `5a99c457` |

Both comments come from the same author. The framing is *"ντρέπομαι να
το βλέπουν όλοι"* and *"unecessary τριβή"* — the underlying need is
**lower the social cost of asking a question**.

## Recommendation at a glance

- **(a) ship** — small migration, contained RLS change, real demand.
- **(b) ship alongside (a)** — same migration, similar surface.
- **(c) decline (or defer)** — fundamentally different trust model;
  adds spam/captcha/rate-limit infrastructure and breaks the
  points/leaderboard framing that the site is built around. (a)+(b)
  already cover the underlying need.

A reader who wants to ask without exposure gets it via (a) ("only mods
will read this") or (b) ("name hidden from classmates"). Both still
attribute the comment in the database, so points and the leaderboard
keep working.

---

## (a) Mod-only-visible comments

A signed-in user can flag a comment "για moderators μόνο" when posting.
Other readers don't see it; the author sees it; moderators see it.

### Schema

```sql
alter table public.comments
  add column visibility text not null default 'public'
  check (visibility in ('public', 'mod_only'));

create index comments_visibility_idx on public.comments(visibility);
```

### RLS

Replace the public read policy:

```sql
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments
  for select using (
    visibility = 'public'
    or auth.uid() = author_id
    or public.is_moderator()
  );
```

The insert policy widens to allow `visibility in ('public', 'mod_only')`
(default `'public'`), no other change.

Replies inherit visibility from their parent comment via the
`comment_id` join — readers who can't see the comment can't see its
replies either, because the SELECT on `replies` already needs the
parent row visible (in practice, our queries always go
`comments → replies`, so this is effectively automatic). To be safe,
add an RLS check:

```sql
drop policy if exists replies_read on public.replies;
create policy replies_read on public.replies
  for select using (
    exists (
      select 1 from public.comments c
      where c.id = replies.comment_id
        and (
          c.visibility = 'public'
          or auth.uid() = c.author_id
          or public.is_moderator()
        )
    )
  );
```

### UI

`CommentsClient` new-comment form already has a "γενικό σχόλιο" toggle
(opts the comment out of the review queue). Add a second toggle:

> ☐ Μόνο για moderators (δεν θα το βλέπουν οι υπόλοιποι)

Mutually exclusive with "γενικό σχόλιο"? Probably yes — a mod-only
comment is by definition for review/help, not a general note. Enforce
that in the form, not in the schema.

Render side: comments where `visibility = 'mod_only'` get a small badge
("👁 Ορατό μόνο σε εσένα + moderators") so the author isn't confused
about why nobody's replying.

### Points

Mod-only comments still earn points like normal. The leaderboard stays
fair; the privacy is purely a read-side concern.

### Edge cases

- A mod-only comment that the moderator wants to resolve as
  `appreciation` or low-effort: same flow as today.
- If the moderator wants to "promote" a mod-only comment to public
  (because the answer would help others), that needs a moderator-only
  UPDATE path — out of scope for v1, but trivially supported by the
  existing `comments_update_mod` policy. Just need a UI button.

---

## (b) Anonymous comments

A signed-in user can flag a comment as anonymous. Other readers see a
placeholder name ("Ανώνυμος Φοιτητής") and a generic avatar. Mods
still see the real identity (so the points/leaderboard still works and
abuse is still attributable).

### Schema

```sql
alter table public.comments
  add column is_anonymous boolean not null default false;

alter table public.replies
  add column is_anonymous boolean not null default false;
```

### Server-side projection (the actual privacy boundary)

RLS doesn't help here — the `profiles` table is publicly readable by
design (avatars + names render alongside comments). We need to **strip
the author identity in the server query before it reaches the client**
when `is_anonymous = true` and the viewer is not a moderator and not
the author themselves.

Two implementations:

1. **App-layer stripping** in `components/layout/Comments.tsx` (and
   `SectionComments.tsx`): after the join, if a comment has
   `is_anonymous` and the viewer isn't `me?.isModerator` and isn't the
   author, replace `author` with `{ id: null, display_name: 'Ανώνυμος
   Φοιτητής', avatar_url: null, role: 'user' }`. Same for replies.

2. **DB-layer view** that does the stripping. Cleaner but requires a
   security-definer view + extra RLS plumbing. Overkill for v1.

Pick **(1)**. The leak risk is low because the projection happens in
the same Server Component that ships HTML — there's no API endpoint
returning raw `author_id` to the public.

> ⚠️ Caveat: the realtime subscription (if/when added) would bypass
> this stripping. Disable realtime for anonymous comments, or apply
> the same projection in the client subscription handler. Note this in
> the migration's comment.

### UI

Form: third toggle "Ανώνυμα (το όνομά σου δεν θα φαίνεται)".
Compatible with both "public" and "mod-only" visibility.

Render: anonymous comments show a generic avatar (a mortarboard icon
in `bg-bg-soft text-fg-muted`) and the name "Ανώνυμος Φοιτητής". A
small "(εσύ)" suffix appears for the author themselves so they can
recognize their own. Mods see the real name with an "(ανώνυμα)" suffix
so they know how it appears to readers.

### Points / leaderboard

Anonymous comments still earn points and still appear on the
leaderboard under the user's real name. The leaderboard doesn't need
to change. (If the user is uncomfortable with that, they can use
mod-only instead, which doesn't show on the leaderboard preview at
all — current behaviour, since the preview only summarizes resolved
counts.) Decision: don't add a "hide me from leaderboard entirely"
flag now; revisit if asked.

### Replies

Mirror the same flag on `replies`. Anonymous replies are useful for
the same social reason. Same projection rule.

`is_claude_reply` replies are never anonymous (they're branded as
Claude).

---

## (c) Unauthenticated commenting — recommendation: decline

The site's social contract is built around three things that all
require an authenticated profile:

1. **Points + leaderboard.** Without an identity there is nobody to
   award points to.
2. **10-minute self-delete window.** Without an identity we can't
   verify "your own" comment.
3. **Abuse mitigation.** Magic-link sign-in is the cheap rate limit;
   once it's gone, we need to add it back somewhere.

Allowing it means:

- Schema: nullable `comments.author_id`, plus a guest-side identifier
  (random per-session token in a cookie) for self-delete.
- Anti-abuse: Cloudflare Turnstile (or hCaptcha) on the form + IP/UA
  rate limit in an Edge Function. Without these, expect spam within
  the week.
- Display: "Επισκέπτης" placeholder, no avatar, no points, no
  leaderboard entry. A second-class commenter type by construction.
- Reply flow: replies-from-guests is a separate decision (probably
  not, to limit abuse surface).

The cost is real (one new external dep, one new Edge Function, two
new schema decisions, ongoing spam triage) and the benefit is mostly
covered by (a)+(b). The friction of "send me a magic link" is *one*
email click; it's also the line that keeps the site from becoming a
moderation problem.

**Recommended response to the user:** politely decline, point them at
the planned (a) and (b) flags as the answer to the underlying
question. Reply something like:

> "Το χωρίς-σύνδεση σχόλιο φέρνει πολλά συνεπακόλουθα (spam, χωρίς
> πόντους, χωρίς διαγραφή του δικού σου). Φτιάχνουμε δύο εναλλακτικές:
> (1) σχόλιο ορατό μόνο στους moderators και (2) ανώνυμο σχόλιο
> (κρυμμένο όνομα). Καλύπτουν το ίδιο πρόβλημα χωρίς να σπάμε το
> points model."

If the moderator disagrees and wants (c) anyway, the migration sketch
is in the Appendix — but it should be a separate plan with its own
abuse/captcha section, not bundled with (a)/(b).

---

## Migration sketch (a + b)

`supabase/migrations/0004_comment_privacy.sql`:

```sql
-- Comment privacy: mod-only visibility + anonymous attribution.
--
-- visibility = 'mod_only'  → only the author + moderators can SELECT
-- is_anonymous = true      → identity stripped server-side before render
--                            (mods + author still see the real name)

alter table public.comments
  add column visibility   text    not null default 'public'
  check (visibility in ('public', 'mod_only'));
alter table public.comments
  add column is_anonymous boolean not null default false;

alter table public.replies
  add column is_anonymous boolean not null default false;

create index if not exists comments_visibility_idx on public.comments(visibility);

drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments
  for select using (
    visibility = 'public'
    or auth.uid() = author_id
    or public.is_moderator()
  );

drop policy if exists replies_read on public.replies;
create policy replies_read on public.replies
  for select using (
    exists (
      select 1 from public.comments c
      where c.id = replies.comment_id
        and (
          c.visibility = 'public'
          or auth.uid() = c.author_id
          or public.is_moderator()
        )
    )
  );

-- Insert policy widens to allow visibility ∈ {public, mod_only}.
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert with check (
    auth.uid() = author_id
    and status in ('pending', 'general')
    and visibility in ('public', 'mod_only')
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );
```

## App-side changes (a + b)

- `lib/supabase/types.ts` — add `visibility` and `is_anonymous` to
  `CommentRow` / `ReplyRow`.
- `components/layout/Comments.tsx` and `SectionComments.tsx` — strip
  `author` for anonymous rows when viewer is not author and not mod.
  Same change in any other Server Component that fetches comments.
- `components/layout/CommentsClient.tsx` — three checkboxes in the
  composer: γενικό / mod-only / ανώνυμα; mutual exclusion between
  γενικό and mod-only; tooltip explanations.
- `scripts/review/list-pending.mjs` — surface `visibility` and
  `is_anonymous` in the JSON so the review CLI shows the context.
  Mod-only mod-targeted comments should still appear in pending; in
  fact they're the *most* targeted ones.
- Render: badges next to the comment header — "👁 mod-only" and/or
  "🎭 ανώνυμα".

## Phasing

1. Migration `0004_comment_privacy.sql` — apply in Supabase SQL editor.
2. Server-side stripping (smallest unit that's correct on its own; old
   form still posts everything as public/named — no regression).
3. Form toggles (composer) + badges (render).
4. Review CLI surfacing.

Each step should be a self-contained commit. Step 2 must land before
step 3 — if the form starts setting `is_anonymous` before the
projection is in place, names leak.

## Open questions for the moderator

- (a)+(b) — names: keep "Ανώνυμος Φοιτητής" or pick a more
  course-flavoured placeholder ("Ανώνυμος K21"?).
- (a)+(b) — should mod-only comments be excluded from the per-page
  comment count badge in the sidebar? Probably yes (otherwise readers
  see "12 σχόλια" but only 8 actually render). Easy: count where
  `visibility = 'public' or viewer can see`.
- (b) — anonymous on `replies` too, yes/no? Default yes; same flag.
- (c) — accept the recommendation to decline, or insist on a separate
  plan with captcha/rate-limit?
