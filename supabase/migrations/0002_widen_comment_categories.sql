-- Widen the comments.category check constraint to allow:
--   * 'tip'         — user added a useful tip / extra insight
--   * 'appreciation' — positive feedback / kudos (no points by default)
--
-- Run this once in the Supabase SQL editor on top of an environment that
-- already has 0001_init.sql applied.

alter table public.comments
  drop constraint if exists comments_category_check;

alter table public.comments
  add constraint comments_category_check
  check (category in (
    'valid-correction',
    'useful-clarification',
    'helpful-suggestion',
    'common-misconception',
    'wrong-but-helpful',
    'duplicate',
    'unclear',
    'low-effort',
    'spam',
    'tip',
    'appreciation'
  ));
