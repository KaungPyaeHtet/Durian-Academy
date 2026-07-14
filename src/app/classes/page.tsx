import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/ComingSoon";
import ClassesBrowser from "@/components/ClassesBrowser";
import { getPublicSupabase, type ClassItem } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Upcoming classes and new course announcements from Durian Academy — AP, SAT, IGCSE, A-Levels and Myanmar G12.",
};

export const revalidate = 60; // ISR

async function getClasses(): Promise<ClassItem[]> {
  const db = getPublicSupabase();
  if (!db) return [];
  const { data } = await db
    .from("classes")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data as ClassItem[]) || [];
}

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {classes.length === 0 ? (
          <ComingSoon
            eyebrow="Classes"
            title="New classes, coming soon"
            description="This is where we'll announce upcoming classes, schedules and new course intakes. Check back soon — or follow us to be the first to know."
          />
        ) : (
          <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Classes
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Our classes
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Filter by type and tap any class to see the full details.
            </p>

            <ClassesBrowser classes={classes} />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
