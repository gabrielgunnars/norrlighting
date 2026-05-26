-- ─────────────────────────────────────────────────────────────────────────────
-- Norrlighting — Supabase database setup
-- Run this in: Supabase dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- Projects
create table if not exists projects (
  id          text    primary key,
  slug        text    unique not null,
  name        text    not null default '',
  category    text    not null default '',
  location    text    not null default '',
  year        text    not null default '',
  description text    not null default '',
  details     text    not null default '',
  images      jsonb   not null default '[]',
  cover_index int     not null default 0,
  created_at  bigint  not null default (extract(epoch from now()) * 1000)::bigint
);

-- Team
create table if not exists team (
  id         text  primary key,
  name       text  not null default '',
  role       text  not null default '',
  bio        text  not null default '',
  photo      text,
  sort_order int   not null default 0
);

-- Awards
create table if not exists awards (
  id         text  primary key,
  image      text,
  name       text  not null default '',
  result     text  not null default 'Winner',
  subtext    text  not null default '',
  sort_order int   not null default 0
);

-- Site config  (single row, id always = 1)
create table if not exists site_config (
  id                   int    primary key default 1,
  hero_image           text,
  hero_video           text,
  featured_project_ids jsonb  not null default '[]',
  instagram_images     jsonb  not null default '[]'
);

-- Site content (single row, id always = 1)
create table if not exists site_content (
  id   int   primary key default 1,
  data jsonb not null default '{}'
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- The admin panel is protected by its own password UI.
-- The anon key is used for both reads (public site) and writes (admin).

alter table projects    enable row level security;
alter table team        enable row level security;
alter table awards      enable row level security;
alter table site_config enable row level security;
alter table site_content enable row level security;

create policy "public_all" on projects     for all to anon using (true) with check (true);
create policy "public_all" on team         for all to anon using (true) with check (true);
create policy "public_all" on awards       for all to anon using (true) with check (true);
create policy "public_all" on site_config  for all to anon using (true) with check (true);
create policy "public_all" on site_content for all to anon using (true) with check (true);

-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Create this manually in the Supabase dashboard:
--   Storage → New bucket → Name: "media" → toggle Public ON → Create
-- (Cannot be created via SQL)
