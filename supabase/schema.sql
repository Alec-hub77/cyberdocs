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

-- =========================================================
-- SAVED ARTICLES — private bookmarks, owned by one user
-- =========================================================
create table if not exists public.saved_articles (
  user_id uuid not null references auth.users(id) on delete cascade,
  -- An article can be a database article or a bundled Markdown article.
  -- Its existence is verified by the application before saving.
  article_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, article_slug)
);

alter table public.saved_articles enable row level security;

drop policy if exists "saved_articles_owner_all" on public.saved_articles;
create policy "saved_articles_owner_all" on public.saved_articles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists saved_articles_user_id_idx on public.saved_articles (user_id, created_at desc);

-- Each user receives an independent copy of the starter catalogue.
create table if not exists public.tool_templates (
  id text primary key,
  name text not null,
  category text not null,
  difficulty text not null,
  summary text not null default '',
  site text not null default '',
  tags text[] not null default '{}',
  use_case text not null default '',
  commands jsonb not null default '[]'
);

create table if not exists public.command_group_templates (
  id text primary key,
  title text not null,
  tool text not null,
  items jsonb not null default '[]'
);

create table if not exists public.command_groups (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  tool text not null,
  items jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  primary key (user_id, id)
);

alter table public.tool_templates enable row level security;
alter table public.command_group_templates enable row level security;
alter table public.command_groups enable row level security;

drop policy if exists "command_groups_owner_all" on public.command_groups;
create policy "command_groups_owner_all" on public.command_groups
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists command_groups_user_id_idx on public.command_groups (user_id, created_at desc);

insert into public.tool_templates (
  id, name, category, difficulty, summary, site, tags, use_case, commands
) values
  ('kali-linux', 'Kali Linux', 'Дистрибутив', 'beginner', 'Дистрибутив Linux на базі Debian з попередньо встановленими security-інструментами для навчання й легального аудиту.', 'https://www.kali.org', ARRAY['linux', 'дистрибутив']::text[], 'Домашня лабораторія у віртуальній машині для практики без встановлення десятків окремих утиліт вручну.', '[]'::jsonb),
  ('nmap', 'Nmap', 'Сканування мережі', 'beginner', 'Утиліта для сканування портів і виявлення хостів та служб у мережі.', 'https://nmap.org', ARRAY['мережі', 'recon', 'сканування']::text[], 'Перший крок розвідки: які хости живі, які порти відкриті, яка версія служби на них слухає.', '[]'::jsonb),
  ('wireshark', 'Wireshark', 'Аналіз трафіку', 'beginner', 'Аналізатор мережевого трафіку з графічним інтерфейсом для перегляду пакетів у реальному часі.', 'https://www.wireshark.org', ARRAY['мережі', 'трафік', 'аналіз']::text[], 'Побачити наживо, як виглядає TCP-рукостискання, DNS-запит чи незашифрований HTTP-трафік.', '[]'::jsonb),
  ('burp-suite', 'Burp Suite', 'Веб-безпека', 'intermediate', 'Проксі-сервер для перехоплення, аналізу та модифікації HTTP(S)-трафіку між браузером і сервером.', 'https://portswigger.net/burp', ARRAY['web', 'proxy', 'pentest']::text[], 'Дослідження логіки веб-застосунку через перехоплення запитів і ручну зміну параметрів у контрольованому середовищі.', '[]'::jsonb),
  ('metasploit', 'Metasploit Framework', 'Фреймворк експлуатації', 'advanced', 'Фреймворк для розробки, тестування та документування дозволених сценаріїв експлуатації у навчальних лабораторіях.', 'https://www.metasploit.com', ARRAY['exploitation', 'framework']::text[], 'Використовується виключно на офіційних навчальних платформах або у власній ізольованій лабораторії з письмовим дозволом.', '[]'::jsonb),
  ('theharvester', 'theHarvester', 'OSINT', 'beginner', 'Інструмент збору email-адрес, піддоменів та імен з публічних джерел.', 'https://github.com/laramies/theHarvester', ARRAY['osint', 'recon']::text[], 'Швидкий огляд публічного цифрового сліду домену перед глибшим аналізом.', '[]'::jsonb),
  ('shodan', 'Shodan', 'OSINT', 'intermediate', 'Пошукова система пристроїв, підключених до інтернету, з можливістю фільтрації за банерами служб.', 'https://www.shodan.io', ARRAY['osint', 'iot', 'recon']::text[], 'Оцінка того, які власні сервіси випадково опинилися відкритими в інтернет.', '[]'::jsonb),
  ('hashcat', 'Hashcat', 'Криптографія', 'advanced', 'Високопродуктивний інструмент відновлення паролів за хешем із використанням GPU.', 'https://hashcat.net/hashcat/', ARRAY['криптографія', 'паролі']::text[], 'Аудит стійкості власної парольної політики на дозволених для тестування хешах.', '[]'::jsonb),
  ('wazuh', 'Wazuh', 'Blue team / SIEM', 'intermediate', 'Відкрита платформа виявлення загроз, моніторингу логів та реагування на інциденти.', 'https://wazuh.com', ARRAY['blue-team', 'siem', 'monitoring']::text[], 'Практика захисної сторони: збір логів, кореляція подій, базові правила виявлення.', '[]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  difficulty = excluded.difficulty,
  summary = excluded.summary,
  site = excluded.site,
  tags = excluded.tags,
  use_case = excluded.use_case,
  commands = excluded.commands;

insert into public.command_group_templates (id, title, tool, items) values
  ('linux-basics', 'Linux: базова навігація та права доступу', 'bash', '[{"cmd":"pwd","desc":"Показати поточний каталог"},{"cmd":"ls -la","desc":"Список файлів з прихованими та деталями"},{"cmd":"cd /var/log","desc":"Перейти в каталог логів"},{"cmd":"cat /etc/passwd","desc":"Переглянути список локальних користувачів"},{"cmd":"chmod 750 script.sh","desc":"Встановити права: власник rwx, група r-x, інші —"},{"cmd":"ps aux","desc":"Список усіх запущених процесів"},{"cmd":"ss -tulpn","desc":"Показати відкриті TCP/UDP порти та процеси, що їх слухають"},{"cmd":"man nmap","desc":"Відкрити довідку по команді nmap"}]'::jsonb),
  ('networking', 'Мережева діагностика', 'bash', '[{"cmd":"ip a","desc":"Показати мережеві інтерфейси та IP-адреси"},{"cmd":"ping -c 4 example.com","desc":"Перевірити доступність хоста (4 пакети)"},{"cmd":"traceroute example.com","desc":"Показати маршрут пакетів до хоста"},{"cmd":"dig example.com","desc":"Отримати DNS-запис для домену"},{"cmd":"whois example.com","desc":"Отримати реєстраційну інформацію домену"},{"cmd":"curl -I https://example.com","desc":"Отримати лише HTTP-заголовки відповіді"}]'::jsonb),
  ('nmap', 'Nmap: сканування у власній лабораторії', 'nmap', '[{"cmd":"nmap -sn 192.168.56.0/24","desc":"Виявити живі хости в підмережі (без сканування портів)"},{"cmd":"nmap -sV 192.168.56.10","desc":"Визначити версії служб на відкритих портах"},{"cmd":"nmap -p 1-1000 192.168.56.10","desc":"Просканувати перші 1000 портів"},{"cmd":"nmap -A 192.168.56.10","desc":"Агресивне сканування: ОС, версії, скрипти, traceroute"},{"cmd":"nmap -oN scan_result.txt 192.168.56.10","desc":"Зберегти результат сканування у файл"}]'::jsonb),
  ('osint', 'OSINT: розвідка з відкритих джерел', 'theHarvester', '[{"cmd":"theHarvester -d example.com -b all","desc":"Зібрати публічні email та піддомени з усіх джерел"},{"cmd":"whois example.com","desc":"Реєстраційні дані домену"},{"cmd":"dig +short example.com ANY","desc":"Короткий вивід усіх доступних DNS-записів"}]'::jsonb),
  ('web-recon', 'Веб-розвідка', 'bash', '[{"cmd":"curl -s -D - https://example.com -o /dev/null","desc":"Показати заголовки відповіді без тіла сторінки"},{"cmd":"whatweb https://example.com","desc":"Визначити технології, що використовує сайт"},{"cmd":"gobuster dir -u https://example.com -w wordlist.txt","desc":"Перебір каталогів сайту за списком слів (лише на дозволених цілях)"}]'::jsonb),
  ('git-hygiene', 'Git-гігієна для security-практиків', 'git', '[{"cmd":"git log -p -- config.env","desc":"Перевірити історію файлу на випадковий витік секретів"},{"cmd":"git secrets --scan","desc":"Проскановане репозиторію на наявність відомих патернів секретів"},{"cmd":"git diff --staged","desc":"Переглянути зміни перед комітом, щоб не закомітити зайве"}]'::jsonb)
on conflict (id) do update set
  title = excluded.title,
  tool = excluded.tool,
  items = excluded.items;

create or replace function public.seed_user_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tools (
    id, user_id, name, category, difficulty, summary, site, tags, use_case, commands
  )
  select
    template.id, new.id, template.name, template.category, template.difficulty,
    template.summary, template.site, template.tags, template.use_case, template.commands
  from public.tool_templates as template
  on conflict (user_id, id) do nothing;

  insert into public.command_groups (id, user_id, title, tool, items)
  select template.id, new.id, template.title, template.tool, template.items
  from public.command_group_templates as template
  on conflict (user_id, id) do nothing;

  return new;
end;
$$;

revoke all on function public.seed_user_workspace() from public;

drop trigger if exists seed_user_workspace_on_signup on auth.users;
create trigger seed_user_workspace_on_signup
  after insert on auth.users
  for each row execute function public.seed_user_workspace();

-- Existing accounts also receive the starter catalogue. Existing personal rows win on ID conflict.
insert into public.tools (
  id, user_id, name, category, difficulty, summary, site, tags, use_case, commands
)
select
  template.id, account.id, template.name, template.category, template.difficulty,
  template.summary, template.site, template.tags, template.use_case, template.commands
from auth.users as account
cross join public.tool_templates as template
on conflict (user_id, id) do nothing;

insert into public.command_groups (id, user_id, title, tool, items)
select template.id, account.id, template.title, template.tool, template.items
from auth.users as account
cross join public.command_group_templates as template
on conflict (user_id, id) do nothing;

