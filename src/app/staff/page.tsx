import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/ComingSoon";
import { Markdown } from "@/components/Markdown";
import { getPublicSupabase, type StaffItem } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Teachers & Staff",
  description:
    "Meet the instructors and team behind Durian Academy — experienced teachers guiding students through AP, SAT, IGCSE, A-Levels and Myanmar G12.",
};

export const revalidate = 60; // ISR

async function getStaff(): Promise<StaffItem[]> {
  const db = getPublicSupabase();
  if (!db) return [];
  const { data } = await db
    .from("staff")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data as StaffItem[]) || [];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function TeachersPage() {
  const staff = await getStaff();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {staff.length === 0 ? (
          <ComingSoon
            eyebrow="Teachers & Staff"
            title="Meet our team, coming soon"
            description="We're preparing profiles of the instructors and team behind Durian Academy. Check back soon."
          />
        ) : (
          <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Our people
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Teachers &amp; staff
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              The experienced instructors and team guiding our students.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((s) => (
                <StaffCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function StaffCard({ s }: { s: StaffItem }) {
  return (
    <article className="flex flex-col rounded-2xl border border-leaf-100 bg-white p-6 text-center shadow-card">
      <div className="mx-auto">
        {s.image_url ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-leaf-50">
            <Image
              src={s.image_url}
              alt={s.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-leaf-600 font-display text-3xl font-semibold text-cream ring-4 ring-leaf-50">
            {initials(s.name)}
          </div>
        )}
      </div>

      <h2 className="mt-5 font-display text-xl font-semibold text-ink">
        {s.name}
      </h2>
      {s.role && (
        <p className="mt-1 text-sm font-semibold text-leaf-600">{s.role}</p>
      )}
      {s.subjects && (
        <p className="mt-2 inline-flex flex-wrap justify-center gap-1.5">
          {s.subjects.split(",").map((t) => (
            <span
              key={t}
              className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-medium text-leaf-600"
            >
              {t.trim()}
            </span>
          ))}
        </p>
      )}
      {s.bio && (
        <div className="mt-4 border-t border-leaf-50 pt-4 text-left text-sm text-ink-soft [&>*:first-child]:mt-0">
          <Markdown>{s.bio}</Markdown>
        </div>
      )}
    </article>
  );
}
