-- Tales of Laila — database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Laila',
  birthdate date,
  created_at timestamptz not null default now()
);

create table if not exists feedings (
  id uuid primary key default gen_random_uuid(),
  time timestamptz not null default now(),
  amount text,
  food text
);

create table if not exists litter_logs (
  id uuid primary key default gen_random_uuid(),
  time timestamptz not null default now()
);

create table if not exists grooming_logs (
  id uuid primary key default gen_random_uuid(),
  time timestamptz not null default now(),
  kind text
);

create table if not exists zoomies_logs (
  id uuid primary key default gen_random_uuid(),
  time timestamptz not null default now()
);

create table if not exists weights (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  value numeric not null
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  description text not null
);

-- Row Level Security: OFF for now since this app has no auth yet (single-user,
-- personal use, anon key only). This means anyone with your deployed URL's
-- anon key could read/write the data. That's an acceptable tradeoff for a
-- personal for-fun project, but if you ever add a cat-sitter/partner login or
-- make the URL public, add Supabase Auth + RLS policies scoped to auth.uid().

alter table profile enable row level security;
alter table feedings enable row level security;
alter table litter_logs enable row level security;
alter table grooming_logs enable row level security;
alter table zoomies_logs enable row level security;
alter table weights enable row level security;
alter table milestones enable row level security;

create policy "public read/write - profile" on profile for all using (true) with check (true);
create policy "public read/write - feedings" on feedings for all using (true) with check (true);
create policy "public read/write - litter_logs" on litter_logs for all using (true) with check (true);
create policy "public read/write - grooming_logs" on grooming_logs for all using (true) with check (true);
create policy "public read/write - zoomies_logs" on zoomies_logs for all using (true) with check (true);
create policy "public read/write - weights" on weights for all using (true) with check (true);
create policy "public read/write - milestones" on milestones for all using (true) with check (true);
