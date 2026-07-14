import type { MetadataRoute } from "next";
import { getPublicSupabase } from "@/lib/supabase";

const SITE_URL = "https://durianacademy.com";

export const revalidate = 3600; // refresh hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/classes",
    "/products",
    "/core",
    "/reviews",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const db = getPublicSupabase();
  if (!db) return staticRoutes;

  const [classes, products] = await Promise.all([
    db.from("classes").select("slug, updated_at").eq("published", true),
    db.from("products").select("slug, updated_at").eq("published", true),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  for (const row of (classes.data as { slug: string | null; updated_at: string }[]) || []) {
    if (row.slug)
      dynamicRoutes.push({
        url: `${SITE_URL}/classes/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
  }
  for (const row of (products.data as { slug: string | null; updated_at: string }[]) || []) {
    if (row.slug)
      dynamicRoutes.push({
        url: `${SITE_URL}/products/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
  }

  return [...staticRoutes, ...dynamicRoutes];
}
