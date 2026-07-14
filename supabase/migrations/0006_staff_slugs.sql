-- Durian Academy — 0006: shareable slugs for staff (teacher review URLs)
-- Run this in your website Supabase project (SQL Editor → paste → Run).
-- Safe to re-run (idempotent).

alter table public.staff add column if not exists slug text;

-- Backfill slugs from names for existing rows, de-duplicating collisions.
with s as (
  select
    id,
    nullif(trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')), '') as base,
    row_number() over (
      partition by nullif(trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')), '')
      order by created_at
    ) as rn
  from public.staff
  where slug is null or slug = ''
)
update public.staff st
set slug = case
  when s.base is null then 'teacher-' || left(st.id::text, 8)
  when s.rn = 1 then s.base
  else s.base || '-' || s.rn
end
from s
where st.id = s.id;

create unique index if not exists staff_slug_key on public.staff (slug);
