import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/ComingSoon";
import { LogoMark } from "@/components/Logo";
import { getPublicSupabase, type ProductItem } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Products",
  description: "Application services and products from Durian Academy.",
};

export const revalidate = 60; // ISR

async function getProducts(): Promise<ProductItem[]> {
  const db = getPublicSupabase();
  if (!db) return [];
  const { data } = await db
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data as ProductItem[]) || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {products.length === 0 ? (
          <ComingSoon
            eyebrow="Products"
            title="Products & services, coming soon"
            description="This is where we'll offer our application services and other products. We're putting it together — follow us for the launch."
          />
        ) : (
          <section className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
              Products & services
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              How we can help
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">
              Application services and resources — tap one for details.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function ProductCard({ p }: { p: ProductItem }) {
  return (
    <Link
      href={`/products/${p.slug ?? p.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40"
    >
      {p.image_url ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-leaf-50">
          <Image
            src={p.image_url}
            alt={p.title}
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
        {p.category && (
          <span className="w-fit rounded-full border border-gold-400/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-600">
            {p.category}
          </span>
        )}
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">
          {p.title}
        </h2>
        {p.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {p.summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5">
          {p.price ? (
            <span className="font-display text-lg font-semibold text-leaf-600">
              {p.price}
            </span>
          ) : (
            <span />
          )}
          <span className="text-sm font-semibold text-leaf-600">
            Details{" "}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
