-- =============================================================================
-- user_progress — per-user "I marked this lecture as completed" record.
-- =============================================================================
-- One row per (user, slug) pair. The slug column matches the static section
-- index in `content/sections.ts` (e.g. "lectures/L03-divide-and-conquer-i").
--
-- The client-side CompleteToggle continues to use localStorage as a guest /
-- offline fallback. When the user signs in, the client hydrates from this
-- table and starts mirroring writes through here.
-- =============================================================================

create table if not exists public.user_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  slug         text not null check (length(slug) between 1 and 200),
  completed_at timestamptz not null default now(),
  primary key (user_id, slug)
);

-- Quick "all completed for this user" lookup (covered by the PK already,
-- but the explicit index makes the intent and ORDER BY plans cleaner).
create index if not exists user_progress_user_idx
  on public.user_progress (user_id, completed_at desc);

-- -----------------------------------------------------------------------------
-- RLS — each user can read & write only their own rows.
-- -----------------------------------------------------------------------------
alter table public.user_progress enable row level security;

drop policy if exists user_progress_select on public.user_progress;
create policy user_progress_select
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists user_progress_insert on public.user_progress;
create policy user_progress_insert
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists user_progress_delete on public.user_progress;
create policy user_progress_delete
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- We intentionally do NOT allow UPDATE — completion is a binary toggle.
-- To "uncheck" a section, the client deletes the row.
