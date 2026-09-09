-- Built-in articles are stored as Markdown files, not rows in public.articles.
-- Remove the FK so bookmarks can reference both built-in and database articles.
alter table public.saved_articles
  drop constraint if exists saved_articles_article_slug_fkey;
