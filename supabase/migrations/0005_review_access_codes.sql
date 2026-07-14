-- Durian Academy — 0005: gate teacher reviews behind class access codes
-- Run this in your website Supabase project (SQL Editor → paste → Run).
-- Safe to re-run (idempotent).

-- A code is handed to an enrolled student. It is tied to one class and can be
-- used to review that class's teachers (one review per teacher per code).
create table if not exists public.review_codes (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  class_id   uuid not null references public.classes(id) on delete cascade,
  label      text,                       -- optional note (student name / batch)
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists review_codes_class_idx on public.review_codes (class_id);

-- Which teacher a given code has already reviewed (prevents re-voting).
create table if not exists public.review_code_uses (
  code_id    uuid not null references public.review_codes(id) on delete cascade,
  teacher_id uuid not null references public.staff(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (code_id, teacher_id)
);

-- Reviews may now ONLY be inserted through the RPC below (drop anon insert).
drop policy if exists "public insert teacher_ratings" on public.teacher_ratings;

-- Lock down the code tables — only the SECURITY DEFINER RPC (and the admin
-- service-role key, which bypasses RLS) may touch them.
alter table public.review_codes enable row level security;
alter table public.review_code_uses enable row level security;

-- Validate a code, ensure the teacher belongs to that code's class, ensure the
-- code hasn't already reviewed this teacher, then insert the review.
create or replace function public.submit_review(
  p_code    text,
  p_teacher uuid,
  p_stars   smallint,
  p_name    text default null,
  p_email   text default null,
  p_review  text default null
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.review_codes%rowtype;
begin
  if p_stars is null or p_stars < 1 or p_stars > 5 then
    return 'invalid_stars';
  end if;

  select * into v_code from public.review_codes
    where lower(code) = lower(btrim(p_code)) and active = true;
  if not found then
    return 'invalid_code';
  end if;

  -- the teacher must be assigned to this code's class
  if not exists (
    select 1 from public.class_teachers
    where class_id = v_code.class_id and teacher_id = p_teacher
  ) then
    return 'teacher_not_in_class';
  end if;

  -- one review per teacher per code
  if exists (
    select 1 from public.review_code_uses
    where code_id = v_code.id and teacher_id = p_teacher
  ) then
    return 'already_reviewed';
  end if;

  insert into public.teacher_ratings (teacher_id, stars, name, email, review)
    values (
      p_teacher,
      p_stars,
      nullif(btrim(p_name), ''),
      nullif(btrim(p_email), ''),
      nullif(btrim(p_review), '')
    );

  insert into public.review_code_uses (code_id, teacher_id)
    values (v_code.id, p_teacher);

  return 'ok';
end;
$$;

grant execute on function public.submit_review(text, uuid, smallint, text, text, text)
  to anon, authenticated;
