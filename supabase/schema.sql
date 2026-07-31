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

-- Only signed-in Supabase users may read or change dashboard data.

alter table profile enable row level security;
alter table feedings enable row level security;
alter table litter_logs enable row level security;
alter table grooming_logs enable row level security;
alter table zoomies_logs enable row level security;
alter table weights enable row level security;
alter table milestones enable row level security;

drop policy if exists "public read/write - profile" on profile;
drop policy if exists "public read/write - feedings" on feedings;
drop policy if exists "public read/write - litter_logs" on litter_logs;
drop policy if exists "public read/write - grooming_logs" on grooming_logs;
drop policy if exists "public read/write - zoomies_logs" on zoomies_logs;
drop policy if exists "public read/write - weights" on weights;
drop policy if exists "public read/write - milestones" on milestones;

drop policy if exists "authenticated access - profile" on profile;
drop policy if exists "authenticated access - feedings" on feedings;
drop policy if exists "authenticated access - litter_logs" on litter_logs;
drop policy if exists "authenticated access - grooming_logs" on grooming_logs;
drop policy if exists "authenticated access - zoomies_logs" on zoomies_logs;
drop policy if exists "authenticated access - weights" on weights;
drop policy if exists "authenticated access - milestones" on milestones;

create policy "authenticated access - profile" on profile for all to authenticated using (true) with check (true);
create policy "authenticated access - feedings" on feedings for all to authenticated using (true) with check (true);
create policy "authenticated access - litter_logs" on litter_logs for all to authenticated using (true) with check (true);
create policy "authenticated access - grooming_logs" on grooming_logs for all to authenticated using (true) with check (true);
create policy "authenticated access - zoomies_logs" on zoomies_logs for all to authenticated using (true) with check (true);
create policy "authenticated access - weights" on weights for all to authenticated using (true) with check (true);
create policy "authenticated access - milestones" on milestones for all to authenticated using (true) with check (true);
