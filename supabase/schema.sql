-- cyberdocs — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- Free tier is enough for a personal project.

-- =========================================================
-- ARTICLES — public: readable and writable by anyone, no login required
-- (mirrors the ADMIN_TOKEN-gated behaviour already enforced at the API layer)
-- =========================================================
create table if not exists public.articles (
  slug text primary key,
  title text not null,
  description text not null default '',
  category text not null default 'Нотатки',
  difficulty text not null default 'beginner',
  tags text[] not null default '{}',
  article_date date not null default current_date,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.articles enable row level security;

drop policy if exists "articles_public_select" on public.articles;
create policy "articles_public_select" on public.articles for select using (true);

drop policy if exists "articles_public_insert" on public.articles;
create policy "articles_public_insert" on public.articles for insert with check (true);

drop policy if exists "articles_public_update" on public.articles;
create policy "articles_public_update" on public.articles for update using (true);

drop policy if exists "articles_public_delete" on public.articles;
create policy "articles_public_delete" on public.articles for delete using (true);

-- =========================================================
-- TOOLS — private: each authenticated user only sees and manages their own
-- =========================================================
create table if not exists public.tools (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'Інше',
  difficulty text not null default 'beginner',
  summary text not null default '',
  site text not null default '',
  tags text[] not null default '{}',
  use_case text not null default '',
  commands jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  primary key (user_id, id)
);

alter table public.tools enable row level security;

drop policy if exists "tools_owner_all" on public.tools;
create policy "tools_owner_all" on public.tools
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- NOTES — private: each authenticated user only sees and manages their own
-- =========================================================
create table if not exists public.notes (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Без назви',
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  primary key (user_id, id)
);

alter table public.notes enable row level security;

drop policy if exists "notes_owner_all" on public.notes;
create policy "notes_owner_all" on public.notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Helpful indexes for the common queries the app makes
create index if not exists tools_user_id_idx on public.tools (user_id, created_at desc);
create index if not exists notes_user_id_idx on public.notes (user_id, created_at desc);
create index if not exists articles_created_at_idx on public.articles (created_at desc);
