-- Guest commenting: allow visitors to post without an account.
--
-- All guest comments + replies render as "Επισκέπτης" with no display
-- name field (deliberate — closes the impersonation vector). No points,
-- no leaderboard, no self-delete. Mods clean up; if spam ever happens,
-- captcha is a 30-min add-on.
--
-- See plans/05-guest-commenting.md for the full reasoning.
--
-- Run this once in the Supabase SQL editor on top of 0001-0004.

-- ---- columns ----------------------------------------------------------------
alter table public.comments alter column author_id drop not null;
alter table public.replies  alter column author_id drop not null;

-- ---- comments INSERT --------------------------------------------------------
-- Split into a "user" half (current behaviour) and a "guest" half with
-- strict constraints. RLS evaluates them as OR — at least one must
-- succeed for the row to land.
drop policy if exists comments_insert      on public.comments;
drop policy if exists comments_insert_user on public.comments;
drop policy if exists comments_insert_guest on public.comments;

create policy comments_insert_user on public.comments
  for insert
  with check (
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
  for insert
  with check (
    author_id is null
    and status = 'pending'
    and visibility = 'public'
    and is_anonymous = false
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );

-- ---- replies INSERT ---------------------------------------------------------
-- replies_insert_claude already exists and is moderator-gated; leave it.
-- Split the user-insert policy similarly.
drop policy if exists replies_insert      on public.replies;
drop policy if exists replies_insert_user on public.replies;
drop policy if exists replies_insert_guest on public.replies;

create policy replies_insert_user on public.replies
  for insert
  with check (
    author_id is not null
    and auth.uid() = author_id
    and is_claude_reply = false
  );

create policy replies_insert_guest on public.replies
  for insert
  with check (
    author_id is null
    and is_claude_reply = false
    and is_anonymous = false
  );

-- ---- delete ----------------------------------------------------------------
-- Guests have no self-delete (no session token, deliberately). Mods cover
-- cleanup via the existing comments_delete_mod / replies_delete_mod.
-- The comments_delete_own / replies_delete_own policies already require
-- auth.uid() = author_id, so they naturally exclude null-author rows.
