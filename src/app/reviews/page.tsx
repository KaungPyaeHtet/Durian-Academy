import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/ComingSoon";
import ReviewsBrowser, {
  type ReviewTeacher,
} from "@/components/ReviewsBrowser";
import {
  getPublicSupabase,
  type StaffItem,
  type TeacherReview,
} from "@/lib/supabase";
import { REVIEWS_ENABLED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Teacher Reviews",
  description:
    "Read student reviews and ratings for Durian Academy teachers across AP, SAT, IGCSE, A-Level and Myanmar G12.",
};

export const revalidate = 60;

async function getData(): Promise<{
  teachers: ReviewTeacher[];
  classes: { id: string; title: string }[];
}> {
  const db = getPublicSupabase();
  if (!db) return { teachers: [], classes: [] };

  const [teachersRes, reviewsRes, linksRes, classesRes] = await Promise.all([
    db
      .from("staff")
      .select("*")
      .eq("published", true)
      .eq("kind", "teacher")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    db.from("teacher_reviews").select("*").order("created_at", { ascending: false }),
    db.from("class_teachers").select("class_id, teacher_id"),
    db.from("classes").select("id, title").eq("published", true),
  ]);

  const staff = (teachersRes.data as StaffItem[]) || [];
  const reviews = (reviewsRes.data as TeacherReview[]) || [];
  const links =
    (linksRes.data as { class_id: string; teacher_id: string }[]) || [];
  const allClasses =
    (classesRes.data as { id: string; title: string }[]) || [];

  const reviewsByTeacher = new Map<string, TeacherReview[]>();
  for (const r of reviews) {
    const arr = reviewsByTeacher.get(r.teacher_id) ?? [];
    arr.push(r);
    reviewsByTeacher.set(r.teacher_id, arr);
  }

  const classIdsByTeacher = new Map<string, string[]>();
  const usedClassIds = new Set<string>();
  for (const l of links) {
    const arr = classIdsByTeacher.get(l.teacher_id) ?? [];
    arr.push(l.class_id);
    classIdsByTeacher.set(l.teacher_id, arr);
    usedClassIds.add(l.class_id);
  }

  const teachers: ReviewTeacher[] = staff.map((t) => ({
    ...t,
    reviews: reviewsByTeacher.get(t.id) ?? [],
    classIds: classIdsByTeacher.get(t.id) ?? [],
  }));

  // Only offer class filters that actually have teachers assigned.
  const classes = allClasses.filter((c) => usedClassIds.has(c.id));

  return { teachers, classes };
}

export default async function ReviewsPage() {
  if (!REVIEWS_ENABLED) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1">
          <ComingSoon
            eyebrow="Reviews"
            title="Teacher reviews, coming soon"
            description="We're putting the finishing touches on our review system. Soon you'll be able to see ratings and honest feedback from our students."
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  const { teachers, classes } = await getData();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {teachers.length === 0 ? (
          <ComingSoon
            eyebrow="Reviews"
            title="Teacher reviews, coming soon"
            description="Once students start reviewing our teachers, their ratings and feedback will show up here."
          />
        ) : (
          <section className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Reviews
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Rate my teacher
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Honest ratings from Durian Academy students. Filter by class to
              find a teacher, and reviews are left by verified class members.
            </p>

            <ReviewsBrowser teachers={teachers} classes={classes} />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
