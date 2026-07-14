import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FacebookIcon } from "@/components/icons";
import {
  getPublicSupabase,
  type ClassItem,
  type ClassTeacher,
} from "@/lib/supabase";
import { site } from "@/lib/site";
import { Markdown } from "@/components/Markdown";
import ClassTeachers from "@/components/ClassTeachers";
import { ShareButton } from "@/components/ShareButton";

export const revalidate = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fmtDate(d: string | null) {
  if (!d) return null;
  const date = new Date(d + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getClassTeachers(classId: string): Promise<ClassTeacher[]> {
  const db = getPublicSupabase();
  if (!db) return [];
  const { data } = await db
    .from("class_teachers")
    .select("*, staff(*)")
    .eq("class_id", classId)
    .order("sort_order", { ascending: true });
  // Only keep links whose teacher is published (RLS returns null otherwise).
  return ((data as ClassTeacher[]) || []).filter((l) => l.staff);
}

async function getClass(key: string): Promise<ClassItem | null> {
  const db = getPublicSupabase();
  if (!db) return null;
  const { data } = await db
    .from("classes")
    .select("*")
    .eq("slug", key)
    .eq("published", true)
    .maybeSingle();
  if (data) return data as ClassItem;
  if (UUID.test(key)) {
    const { data: byId } = await db
      .from("classes")
      .select("*")
      .eq("id", key)
      .eq("published", true)
      .maybeSingle();
    return (byId as ClassItem) || null;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getClass(slug);
  if (!c) return { title: "Class not found" };
  return {
    title: c.title,
    description: c.summary || `${c.title} at Durian Academy`,
    openGraph: {
      title: c.title,
      description: c.summary || undefined,
      images: c.image_url ? [c.image_url] : undefined,
    },
  };
}

export default async function ClassDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getClass(slug);
  if (!c) notFound();

  const teachers = await getClassTeachers(c.id);
  const starts = fmtDate(c.starts_on);
  const facts: { label: string; value: string }[] = [];
  if (c.schedule) facts.push({ label: "Schedule", value: c.schedule });
  if (starts) facts.push({ label: "Starts", value: starts });
  if (c.mode) facts.push({ label: "Mode", value: c.mode });
  if (c.seats != null) facts.push({ label: "Seats", value: String(c.seats) });
  if (c.fee) facts.push({ label: "Fee", value: c.fee });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
          <div>
            <Link
              href="/classes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 hover:text-leaf-700"
            >
              ← All classes
            </Link>
          </div>

          {c.subject && (
            <span className="mt-6 inline-block rounded-full border border-gold-400/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-600">
              {c.subject}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {c.title}
          </h1>
          {c.summary && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {c.summary}
            </p>
          )}

          {c.image_url && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-leaf-50">
              <Image
                src={c.image_url}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {facts.length > 0 && (
            <dl className="mt-8 grid gap-4 rounded-2xl border border-leaf-100 bg-white p-6 shadow-card sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                    {f.label}
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {teachers.length > 0 && <ClassTeachers links={teachers} />}

          {c.description && (
            <div className="mt-8">
              <Markdown>{c.description}</Markdown>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-leaf-100 pt-8">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
            >
              Register interest
            </Link>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-leaf-300 px-6 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
            >
              <FacebookIcon className="h-4 w-4" />
              Ask a question
            </a>
            <ShareButton path={`/classes/${c.slug ?? c.id}`} />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
