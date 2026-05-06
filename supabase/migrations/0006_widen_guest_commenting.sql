-- Widen guest comment insert policy to allow:
--   * status = 'general'   (guest can mark their comment as a general note)
--   * visibility = 'mod_only' (guest can send a private note to mods)
--
-- Anonymity stays forbidden for guests (is_anonymous = false): a guest
-- already has no display name, so the flag would be redundant noise.
--
-- After submitting a mod-only post, the guest's own view of the comment
-- vanishes on next refresh (RLS: visibility='mod_only' AND author_id is
-- null AND auth.uid() is null → no match). That's expected — the guest
-- explicitly opted into "send to mods only".
--
-- Run this once in the Supabase SQL editor on top of 0005.

drop policy if exists comments_insert_guest on public.comments;

create policy comments_insert_guest on public.comments
  for insert
  with check (
    author_id is null
    and status in ('pending', 'general')
    and visibility in ('public', 'mod_only')
    and is_anonymous = false
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );
