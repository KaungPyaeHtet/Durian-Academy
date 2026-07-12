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
  name: string;
  role: string | null; // e.g. "Founder & Instructor"
  subjects: string | null; // e.g. "AP Calculus, Physics"
  bio: string | null;
  image_url: string | null;
  sort_order: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
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
