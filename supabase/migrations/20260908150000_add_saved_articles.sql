create table if not exists public.saved_articles (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_slug text not null references public.articles(slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, article_slug)
);

alter table public.saved_articles enable row level security;

create policy "saved_articles_owner_all" on public.saved_articles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists saved_articles_user_id_idx on public.saved_articles (user_id, created_at desc);
