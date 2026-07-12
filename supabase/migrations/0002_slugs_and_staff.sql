-- Durian Academy — 0002: shareable slugs + Teachers & Staff
-- Run this in your website Supabase project (SQL Editor → Run). Safe to re-run.

-- ---- shareable slug URLs (and image columns, in case 0001 predated them) ----
alter table public.classes  add column if not exists slug text;
alter table public.products add column if not exists slug text;
alter table public.classes  add column if not exists image_url text;
alter table public.products add column if not exists image_url text;

create unique index if not exists classes_slug_key  on public.classes (slug);
create unique index if not exists products_slug_key on public.products (slug);

-- ---- Teachers & Staff ----
create table if not exists public.staff (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,               -- e.g. "Founder & Instructor"
  subjects    text,               -- e.g. "AP Calculus, Physics"
  bio         text,               -- supports Markdown
  image_url   text,               -- profile photo (Supabase Storage)
  sort_order  integer not null default 0,  -- lower = shown first
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_staff_updated on public.staff;
create trigger trg_staff_updated before update on public.staff
  for each row execute function public.set_updated_at();

alter table public.staff enable row level security;

drop policy if exists "public read published staff" on public.staff;
create policy "public read published staff"
  on public.staff for select
  to anon
  using (published = true);

create index if not exists staff_order_idx
  on public.staff (sort_order asc, created_at desc);
