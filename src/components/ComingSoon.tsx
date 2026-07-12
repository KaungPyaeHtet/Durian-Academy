import Link from "next/link";
import { site } from "@/lib/site";
import { FacebookIcon } from "./icons";

export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-hero">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-leaf-600">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {eyebrow}
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-6 py-3 text-sm font-semibold text-cream shadow-card transition-colors hover:bg-leaf-700"
          >
            <FacebookIcon className="h-4 w-4" />
            Follow for updates
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-leaf-300 px-6 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
