-- Comment privacy: mod-only visibility + anonymous attribution.
--
-- Two independent privacy dimensions:
--   * visibility = 'mod_only'  → only the author + moderators can SELECT.
--                                Public READ policy enforces this — no
--                                client-side leak possible.
--   * is_anonymous = true      → identity stripped server-side before render
--                                (mods + author still see the real name).
--                                NOT enforced at RLS — the profiles table is
--                                public-read by design, so the privacy
--                                boundary is the app layer (see
--                                components/layout/Comments.tsx and
--                                SectionComments.tsx).
--
-- Author can still self-delete within 10 min (RLS uses author_id, which is
-- unchanged); leaderboard still works (groups by author_id).
--
-- Run this once in the Supabase SQL editor on top of 0001/0002/0003.

alter table public.comments
  add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'mod_only'));

alter table public.comments
  add column if not exists is_anonymous boolean not null default false;

alter table public.replies
  add column if not exists is_anonymous boolean not null default false;

create index if not exists comments_visibility_idx on public.comments(visibility);

-- ---- comments SELECT --------------------------------------------------------
-- Public read for visibility='public'; author + moderators see everything.
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments
  for select using (
    visibility = 'public'
    or auth.uid() = author_id
    or public.is_moderator()
  );

-- ---- replies SELECT ---------------------------------------------------------
-- A reply is visible iff its parent comment is visible to the viewer.
-- This protects mod-only threads from leaking via the replies table.
drop policy if exists replies_read on public.replies;
create policy replies_read on public.replies
  for select using (
    exists (
      select 1
      from public.comments c
      where c.id = replies.comment_id
        and (
          c.visibility = 'public'
          or auth.uid() = c.author_id
          or public.is_moderator()
        )
    )
  );

-- ---- comments INSERT --------------------------------------------------------
-- Allow visibility ∈ {public, mod_only} on insert; everything else unchanged.
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert
  with check (
    auth.uid() = author_id
    and status in ('pending', 'general')
    and visibility in ('public', 'mod_only')
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );
