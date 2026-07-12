import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/ComingSoon";
import { LogoMark } from "@/components/Logo";
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
              Upcoming classes
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Explore what&apos;s starting soon — tap a class for full details.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <ClassCard key={c.id} c={c} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function ClassCard({ c }: { c: ClassItem }) {
  return (
    <Link
      href={`/classes/${c.slug ?? c.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40"
    >
      {c.image_url ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-leaf-50">
          <Image
            src={c.image_url}
            alt={c.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-leaf-600/[0.04]">
          <LogoMark size={48} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {c.subject && (
          <span className="w-fit rounded-full border border-gold-400/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-600">
            {c.subject}
          </span>
        )}
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">
          {c.title}
        </h2>
        {c.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {c.summary}
          </p>
        )}
        {c.schedule && (
          <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
            <span className="h-1 w-1 rounded-full bg-gold-400" />
            {c.schedule}
          </p>
        )}
        <span className="mt-auto pt-5 text-sm font-semibold text-leaf-600">
          View class{" "}
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
