"use client";

import { useState } from "react";
import { seniors } from "@/lib/site";

/**
 * Compact booking card (used in the hero): pick a consultant, then open their
 * real scheduling page. Booking URLs live in src/lib/site.ts (Google Calendar /
 * Cal.com / Calendly), where the actual available times are shown.
 */
export default function Appointments() {
  const [selectedId, setSelectedId] = useState(seniors[0]?.id ?? "");
  const senior = seniors.find((s) => s.id === selectedId) ?? seniors[0];

  return (
    <div className="relative">
      <div className="rounded-3xl border border-leaf-100 bg-white/80 p-6 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
              Book a session
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">
              Free 1-on-1 consultation
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
            Open
          </span>
        </div>

        {/* Consultant picker */}
        <label
          htmlFor="senior-select"
          className="mt-5 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
        >
          Choose a consultant
        </label>
        <select
          id="senior-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-leaf-200 bg-cream/60 px-4 py-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-gold-400"
        >
          {seniors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {senior && (
          <>
            <p className="mt-2 text-xs text-ink-soft">
              {senior.role} · via {senior.provider}
            </p>
            <p className="font-myanmar mt-2 text-sm leading-relaxed text-ink-soft">
              {senior.blurb}
            </p>
          </>
        )}

        {/* Booking CTA */}
        {senior && senior.bookingUrl ? (
          <a
            href={senior.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-3 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
          >
            Book with {senior.name}
          </a>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-leaf-200 bg-cream/40 px-4 py-3 text-xs text-ink-soft">
            Booking link coming soon for {senior?.name}.
          </p>
        )}
      </div>
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gold-300/40 blur-xl" />
    </div>
  );
}
