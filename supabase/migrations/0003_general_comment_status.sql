-- Add a third comment status: 'general'.
--
-- A user can mark their own comment as a "general / no review needed"
-- comment when posting. General comments:
--   * don't show up in the mod's "pending" count
--   * don't show the amber "Προς review" badge
--   * still display normally to readers
--
-- Mods can still promote a general comment to resolved (or re-open it
-- to pending) via the existing toggle if it turns out to be valuable.
--
-- Run this once in the Supabase SQL editor on top of 0001_init.sql.

alter table public.comments
  drop constraint if exists comments_status_check;

alter table public.comments
  add constraint comments_status_check
  check (status in ('pending', 'resolved', 'general'));

-- Update the public insert policy: signed-in users can insert with
-- status 'pending' (default) or 'general' (opted out of review). They
-- still cannot self-resolve, self-categorize, or self-award points.
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert
  with check (
    auth.uid() = author_id
    and status in ('pending', 'general')
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );
