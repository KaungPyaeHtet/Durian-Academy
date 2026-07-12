import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Turn a title into a URL-friendly slug (ASCII). */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, "") // trim hyphens
    .slice(0, 60);
}

/**
 * Produce a slug that's unique within `table`. Falls back to a short random
 * token when the title has no ASCII characters (e.g. Burmese-only titles),
 * and appends one on collisions.
 */
export async function uniqueSlug(
  db: SupabaseClient,
  table: "classes" | "products",
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(title) || "item";
  let candidate = base;

  for (let i = 0; i < 6; i++) {
    let q = db.from(table).select("id").eq("slug", candidate).limit(1);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q;
    if (!data || data.length === 0) return candidate;
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}
