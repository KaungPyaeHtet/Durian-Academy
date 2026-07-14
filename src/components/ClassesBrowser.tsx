"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoMark } from "@/components/Logo";
import type { ClassItem } from "@/lib/supabase";

export default function ClassesBrowser({ classes }: { classes: ClassItem[] }) {
  // Build the filter list from the subjects actually present, in a stable order.
  const subjects = useMemo(() => {
    const present = new Set(
      classes.map((c) => c.subject).filter((s): s is string => !!s)
    );
    return Array.from(present);
  }, [classes]);

  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? classes : classes.filter((c) => c.subject === active);

  const chip = (label: string) => {
    const isActive = active === label;
    return (
      <button
        key={label}
        onClick={() => setActive(label)}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
          isActive
            ? "border-leaf-600 bg-leaf-600 text-cream"
            : "border-leaf-200 text-leaf-700 hover:border-gold-400 hover:bg-leaf-50"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      {subjects.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2.5">
          {chip("All")}
          {subjects.map((s) => chip(s))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <ClassCard key={c.id} c={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 rounded-2xl border border-leaf-100 bg-white px-4 py-8 text-center text-sm text-ink-soft">
          No classes in this category yet.
        </p>
      )}
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
