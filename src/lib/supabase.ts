import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Public (anon) client — safe to use for reads. RLS on the website tables only
 * exposes rows where `published = true`. Returns null when env isn't configured
 * yet, so pages can fall back to an empty / coming-soon state.
 */
export function getPublicSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export type ClassItem = {
  id: string;
  slug: string | null;
  title: string;
  subject: string | null;
  summary: string | null;
  description: string | null;
  schedule: string | null;
  starts_on: string | null; // ISO date
  seats: number | null;
  fee: string | null;
  mode: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type StaffItem = {
  id: string;
  slug: string | null;
  name: string;
  role: string | null; // e.g. "Founder & Instructor"
  subjects: string | null; // e.g. "AP Calculus, Physics"
  bio: string | null;
  image_url: string | null;
  sort_order: number | null;
  kind: "core" | "teacher"; // 'core' shows on /core; 'teacher' is hidden there
  rating_sum: number;
  rating_count: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

// A public teacher review (from the `teacher_reviews` view — no email exposed).
export type TeacherReview = {
  id: string;
  teacher_id: string;
  name: string | null; // null => posted anonymously
  stars: number;
  review: string | null;
  created_at: string;
};

// A review access code (handed to enrolled students, scoped to one class).
export type ReviewCode = {
  id: string;
  code: string;
  class_id: string;
  label: string | null;
  active: boolean;
  created_at: string;
};

// A class↔teacher link row. `staff` is present when the query joins it in.
export type ClassTeacher = {
  id: string;
  class_id: string;
  teacher_id: string;
  subjects: string | null; // subjects this teacher covers in this class
  sort_order: number | null;
  created_at: string;
  staff?: StaffItem | null;
};

export type ProductItem = {
  id: string;
  slug: string | null;
  title: string;
  category: string | null;
  summary: string | null;
  description: string | null;
  price: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};
