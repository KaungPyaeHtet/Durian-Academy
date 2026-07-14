import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TeacherReviewCard } from "@/components/ReviewsBrowser";
import {
  getPublicSupabase,
  type StaffItem,
  type TeacherReview,
} from "@/lib/supabase";

export const revalidate = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getTeacher(
  key: string
): Promise<{ teacher: StaffItem; reviews: TeacherReview[] } | null> {
  const db = getPublicSupabase();
  if (!db) return null;

  // Look up by slug (the pretty URL); fall back to id for old links.
  const column = UUID.test(key) ? "id" : "slug";
  const tRes = await db
    .from("staff")
    .select("*")
    .eq(column, key)
    .eq("published", true)
    .eq("kind", "teacher")
    .maybeSingle();
  if (!tRes.data) return null;
  const teacher = tRes.data as StaffItem;

  const rRes = await db
    .from("teacher_reviews")
    .select("*")
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });

  return { teacher, reviews: (rRes.data as TeacherReview[]) || [] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTeacher(slug);
  if (!data) return { title: "Teacher not found" };
  const { teacher, reviews } = data;
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length
      : 0;
  const desc =
    reviews.length > 0
      ? `${avg.toFixed(1)}/5 from ${reviews.length} student review${
          reviews.length === 1 ? "" : "s"
        } at Durian Academy.`
      : `Reviews for ${teacher.name} at Durian Academy.`;
  return {
    title: `${teacher.name} — Reviews`,
    description: desc,
    openGraph: { title: `${teacher.name} — Durian Academy`, description: desc },
  };
}

export default async function TeacherReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTeacher(slug);
  if (!data) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 hover:text-leaf-700"
          >
            ← All reviews
          </Link>
          <div className="mt-6">
            <TeacherReviewCard
              teacher={{ ...data.teacher, reviews: data.reviews, classIds: [] }}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
