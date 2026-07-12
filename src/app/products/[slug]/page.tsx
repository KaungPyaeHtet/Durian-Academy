import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FacebookIcon } from "@/components/icons";
import { getPublicSupabase, type ProductItem } from "@/lib/supabase";
import { site } from "@/lib/site";
import { Markdown } from "@/components/Markdown";

export const revalidate = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getProduct(key: string): Promise<ProductItem | null> {
  const db = getPublicSupabase();
  if (!db) return null;
  const { data } = await db
    .from("products")
    .select("*")
    .eq("slug", key)
    .eq("published", true)
    .maybeSingle();
  if (data) return data as ProductItem;
  if (UUID.test(key)) {
    const { data: byId } = await db
      .from("products")
      .select("*")
      .eq("id", key)
      .eq("published", true)
      .maybeSingle();
    return (byId as ProductItem) || null;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.title,
    description: p.summary || `${p.title} — Durian Academy`,
    openGraph: {
      title: p.title,
      description: p.summary || undefined,
      images: p.image_url ? [p.image_url] : undefined,
    },
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 hover:text-leaf-700"
            >
              ← All products
            </Link>
          </div>

          {p.category && (
            <span className="mt-6 inline-block rounded-full border border-gold-400/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-600">
              {p.category}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {p.title}
          </h1>
          {p.summary && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {p.summary}
            </p>
          )}

          {p.image_url && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-leaf-50">
              <Image
                src={p.image_url}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {p.price && (
            <p className="mt-8 font-display text-2xl font-semibold text-leaf-600">
              {p.price}
            </p>
          )}

          {p.description && (
            <div className="mt-6">
              <Markdown>{p.description}</Markdown>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-leaf-100 pt-8">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
            >
              Enquire
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
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
