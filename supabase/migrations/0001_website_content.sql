-- Durian Academy — public website content
-- Run this in your NEW (website) Supabase project:
--   Dashboard → SQL Editor → paste → Run
-- Safe to run once on a fresh project.

-- ============ CLASSES (announcements) ============
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subject     text,               -- e.g. AP, SAT, IGCSE, A-Level, Myanmar G12
  summary     text,               -- one-line teaser shown on cards
  description text,               -- longer details
  schedule    text,               -- e.g. "Mon / Wed / Fri, 5–7pm"
  starts_on   date,
  seats       integer,
  fee         text,               -- free text so you can write "Contact us", currency, etc.
  mode        text,               -- e.g. "In-person", "Online", "Hybrid"
  image_url   text,               -- public URL of the card image (Supabase Storage)
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============ PRODUCTS (application services) ============
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,               -- e.g. "University Application", "Essay Review"
  summary     text,
  description text,
  price       text,               -- free text
  image_url   text,               -- public URL of the card image (Supabase Storage)
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_classes_updated on public.classes;
create trigger trg_classes_updated before update on public.classes
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

-- ============ Row Level Security ============
-- Public (anon) may read ONLY published rows. All writes happen server-side
-- with the service-role key, which bypasses RLS — so no write policy is needed.
alter table public.classes  enable row level security;
alter table public.products enable row level security;

drop policy if exists "public read published classes" on public.classes;
create policy "public read published classes"
  on public.classes for select
  to anon
  using (published = true);

drop policy if exists "public read published products" on public.products;
create policy "public read published products"
  on public.products for select
  to anon
  using (published = true);

-- helpful ordering index
create index if not exists classes_created_idx  on public.classes (created_at desc);
create index if not exists products_created_idx on public.products (created_at desc);
