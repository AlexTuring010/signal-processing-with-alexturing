-- =============================================================================
-- Signal Processing Class Hub — initial schema
-- =============================================================================
-- Tables: profiles, comments, replies
-- Auth   : Supabase Auth (auth.users) — magic link + Google OAuth
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles: one row per signed-in user
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 40),
  avatar_url   text,
  role         text not null default 'user' check (role in ('user', 'moderator')),
  created_at   timestamptz not null default now()
);

-- Auto-create a profile row when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(new.email, '@', 1),
      'Φοιτητής'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the *current* user a moderator?
create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'moderator'
  );
$$;

-- -----------------------------------------------------------------------------
-- comments: one per submission
-- -----------------------------------------------------------------------------
create table if not exists public.comments (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  page_title      text,
  section_title   text,
  section_anchor  text,
  body            text not null check (length(body) between 1 and 2000),
  author_id       uuid not null references public.profiles(id) on delete cascade,
  status          text not null default 'pending'
                  check (status in ('pending', 'resolved')),
  category        text check (category in (
                    'valid-correction','useful-clarification','helpful-suggestion',
                    'common-misconception','wrong-but-helpful','duplicate',
                    'unclear','low-effort','spam'
                  )),
  points_awarded  int  not null default 0 check (points_awarded between 0 and 50),
  points_reason   text,
  reviewed_at     timestamptz,
  reviewed_by     uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists comments_slug_idx       on public.comments(slug);
create index if not exists comments_author_idx     on public.comments(author_id);
create index if not exists comments_created_idx    on public.comments(created_at desc);
create index if not exists comments_status_idx     on public.comments(status);

-- -----------------------------------------------------------------------------
-- replies: threaded under a comment
-- -----------------------------------------------------------------------------
create table if not exists public.replies (
  id               uuid primary key default gen_random_uuid(),
  comment_id       uuid not null references public.comments(id) on delete cascade,
  body             text not null check (length(body) between 1 and 1000),
  author_id        uuid not null references public.profiles(id) on delete cascade,
  is_claude_reply  boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists replies_comment_idx on public.replies(comment_id);

-- =============================================================================
-- Row-level security
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.replies  enable row level security;

-- ---- profiles ---------------------------------------------------------------
-- Public read (avatars + names are shown alongside comments).
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select using (true);

-- Users update their own profile, but cannot escalate role.
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- Moderators can update anything (e.g. promote another user).
drop policy if exists profiles_update_mod on public.profiles;
create policy profiles_update_mod on public.profiles
  for update using (public.is_moderator());

-- No public INSERT — profiles are only created via the auth trigger.
-- No public DELETE — cascade from auth.users handles cleanup.

-- ---- comments ---------------------------------------------------------------
-- Public read so anonymous visitors see the conversation.
drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments
  for select using (true);

-- Signed-in users can post as themselves; cannot self-award points or self-resolve.
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert
  with check (
    auth.uid() = author_id
    and status = 'pending'
    and category is null
    and points_awarded = 0
    and reviewed_at is null
    and reviewed_by is null
  );

-- Authors can delete their own comment within 10 minutes of posting.
drop policy if exists comments_delete_own on public.comments;
create policy comments_delete_own on public.comments
  for delete using (
    auth.uid() = author_id
    and created_at > now() - interval '10 minutes'
  );

-- Moderators can update + delete any comment (review, resolve, points).
drop policy if exists comments_update_mod on public.comments;
create policy comments_update_mod on public.comments
  for update using (public.is_moderator());

drop policy if exists comments_delete_mod on public.comments;
create policy comments_delete_mod on public.comments
  for delete using (public.is_moderator());

-- ---- replies ---------------------------------------------------------------
drop policy if exists replies_read on public.replies;
create policy replies_read on public.replies
  for select using (true);

-- Regular users post replies as themselves; is_claude_reply must be false.
drop policy if exists replies_insert_user on public.replies;
create policy replies_insert_user on public.replies
  for insert
  with check (
    auth.uid() = author_id
    and is_claude_reply = false
  );

-- Moderators may post replies on behalf of Claude (is_claude_reply = true).
drop policy if exists replies_insert_claude on public.replies;
create policy replies_insert_claude on public.replies
  for insert
  with check (
    auth.uid() = author_id
    and is_claude_reply = true
    and public.is_moderator()
  );

drop policy if exists replies_delete_own on public.replies;
create policy replies_delete_own on public.replies
  for delete using (
    auth.uid() = author_id
    and created_at > now() - interval '10 minutes'
  );

drop policy if exists replies_delete_mod on public.replies;
create policy replies_delete_mod on public.replies
  for delete using (public.is_moderator());
