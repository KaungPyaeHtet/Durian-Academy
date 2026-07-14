-- Durian Academy — 0003: Teachers, class↔teacher links, and ratings
-- Run this in your website Supabase project (SQL Editor → paste → Run).
-- Safe to re-run (idempotent).

-- ============================================================================
-- 1) Distinguish CORE members from TEACHERS, and hold rating aggregates.
--    Teachers live in the same `staff` table (so their profile/description is
--    reused) but are hidden from the public "core members" listing. They stay
--    published so their popup + rating still work.
-- ============================================================================
alter table public.staff
  add column if not exists kind text not null default 'core';   -- 'core' | 'teacher'

alter table public.staff
  add column if not exists rating_sum   integer not null default 0;
alter table public.staff
  add column if not exists rating_count integer not null default 0;

-- guard the allowed values
alter table public.staff drop constraint if exists staff_kind_check;
alter table public.staff
  add constraint staff_kind_check check (kind in ('core', 'teacher'));

create index if not exists staff_kind_idx on public.staff (kind, sort_order asc);

-- ============================================================================
-- 2) CLASS ↔ TEACHER links.
--    A class can have many teachers; each teacher handles one or more subjects
--    in that class (stored in `subjects`, e.g. "AP Calculus, AP Physics").
-- ============================================================================
create table if not exists public.class_teachers (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.staff(id)   on delete cascade,
  subjects   text,                                  -- subjects this teacher covers in this class
  sort_order integer not null default 0,            -- lower = shown first
  created_at timestamptz not null default now(),
  unique (class_id, teacher_id)
);

create index if not exists class_teachers_class_idx   on public.class_teachers (class_id, sort_order asc);
create index if not exists class_teachers_teacher_idx on public.class_teachers (teacher_id);

alter table public.class_teachers enable row level security;

-- anon may read links (the app only queries them for published classes/teachers)
drop policy if exists "public read class_teachers" on public.class_teachers;
create policy "public read class_teachers"
  on public.class_teachers for select
  to anon
  using (true);

-- ============================================================================
-- 3) TEACHER RATINGS.
--    Each row is one rating (1–5 stars). Anon can insert (students rate);
--    a trigger keeps the aggregate on `staff` in sync.
-- ============================================================================
create table if not exists public.teacher_ratings (
  id         uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.staff(id) on delete cascade,
  stars      smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists teacher_ratings_teacher_idx on public.teacher_ratings (teacher_id);

alter table public.teacher_ratings enable row level security;

-- anon may add a rating, and read ratings
drop policy if exists "public insert teacher_ratings" on public.teacher_ratings;
create policy "public insert teacher_ratings"
  on public.teacher_ratings for insert
  to anon
  with check (stars between 1 and 5);

drop policy if exists "public read teacher_ratings" on public.teacher_ratings;
create policy "public read teacher_ratings"
  on public.teacher_ratings for select
  to anon
  using (true);

-- keep staff.rating_sum / rating_count in sync with the ratings table
create or replace function public.apply_teacher_rating()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.staff
      set rating_sum = rating_sum + new.stars,
          rating_count = rating_count + 1
      where id = new.teacher_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.staff
      set rating_sum = greatest(rating_sum - old.stars, 0),
          rating_count = greatest(rating_count - 1, 0)
      where id = old.teacher_id;
    return old;
  end if;
  return null;
end $$;

drop trigger if exists trg_teacher_rating_ins on public.teacher_ratings;
create trigger trg_teacher_rating_ins after insert on public.teacher_ratings
  for each row execute function public.apply_teacher_rating();

drop trigger if exists trg_teacher_rating_del on public.teacher_ratings;
create trigger trg_teacher_rating_del after delete on public.teacher_ratings
  for each row execute function public.apply_teacher_rating();
