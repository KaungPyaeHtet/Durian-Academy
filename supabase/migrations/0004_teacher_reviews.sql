-- Durian Academy — 0004: proper teacher reviews (text + optional name/email)
-- Run this in your website Supabase project (SQL Editor → paste → Run).
-- Safe to re-run (idempotent).

-- ---- richer reviews: written text + optional identity ----
alter table public.teacher_ratings add column if not exists name   text;
alter table public.teacher_ratings add column if not exists email  text;
alter table public.teacher_ratings add column if not exists review text;

-- The base table now holds emails, so the public must NOT read it directly.
-- Anon keeps INSERT (submitting a review) but loses raw SELECT.
drop policy if exists "public read teacher_ratings" on public.teacher_ratings;

-- Public-facing reviews WITHOUT the email column. The view is owned by the
-- table owner, so it can read the rows; we only expose the safe columns.
create or replace view public.teacher_reviews as
  select id, teacher_id, name, stars, review, created_at
  from public.teacher_ratings;

grant select on public.teacher_reviews to anon, authenticated;
