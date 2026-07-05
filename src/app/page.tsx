import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FacebookIcon, Icon } from "@/components/icons";
import { LogoMark } from "@/components/Logo";
import {
  site,
  programs,
  stats,
  reasons,
  steps,
  testimonials,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="flex-1">
        <Hero />
        <StatStrip />
        <Programs />
        <WhyUs />
        <Approach />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="bg-hero">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-leaf-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            AP · SAT · IGCSE · A-Levels · Myanmar G12
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Master the exams that open doors.{" "}
            <span className="text-gold-500">Make it bold.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {site.name} prepares students for the world&apos;s most demanding
            exams — AP, SAT, IGCSE, A-Levels and Myanmar G12 — with experienced
            instructors, small classes and a proven, results-driven approach.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-6 py-3 text-sm font-semibold text-cream shadow-card transition-colors hover:bg-leaf-700"
            >
              <FacebookIcon className="h-4 w-4" />
              Message us on Facebook
            </a>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 rounded-full border border-leaf-300 px-6 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
            >
              Explore programs
            </a>
          </div>
          <p className="mt-6 text-sm text-ink-soft/80">
            Trusted by students preparing for university at home and abroad.
          </p>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-leaf-100 bg-white/80 p-6 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={28} className="h-7 w-7" />
            <p className="font-display text-sm font-semibold text-leaf-600">
              This term at Durian
            </p>
          </div>
          <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-semibold text-gold-600">
            Enrolling now
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {programs.slice(0, 5).map((p) => (
            <div
              key={p.code}
              className="flex items-center justify-between rounded-xl border border-leaf-50 bg-cream/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-14 items-center justify-center rounded-lg bg-leaf-600 text-xs font-bold text-cream">
                  {p.code}
                </span>
                <span className="text-sm font-medium text-ink">{p.name}</span>
              </div>
              <Icon name="spark" className="h-4 w-4 text-gold-500" />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gold-300/40 blur-xl" />
    </div>
  );
}

function StatStrip() {
  return (
    <section className="border-y border-leaf-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center lg:text-left">
            <p className="font-display text-4xl font-semibold text-leaf-600">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>}
    </div>
  );
}

function Programs() {
  return (
    <section id="programs" className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
      <SectionHeading
        eyebrow="Programs"
        title="Five curricula, one standard of teaching"
        intro="Whether the goal is a top university abroad or the matriculation exam at home, we prepare students for the qualification that matters to them."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <article
            key={p.code}
            className="group flex flex-col rounded-2xl border border-leaf-100 bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-600 font-display text-sm font-bold text-cream">
                {p.code}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">
                {p.name}
              </h3>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
              {p.blurb}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-medium text-leaf-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
        <div className="flex flex-col justify-center rounded-2xl border border-dashed border-leaf-200 bg-leaf-50/50 p-6">
          <p className="font-display text-lg font-semibold text-leaf-700">
            Not sure which fits?
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Tell us the student&apos;s goal and we&apos;ll recommend the right
            path.
          </p>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-700"
          >
            <FacebookIcon className="h-4 w-4" />
            Ask us
          </a>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <SectionHeading
          eyebrow="Why Durian Academy"
          title="The kind of teaching that changes results"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="flex gap-4 rounded-2xl border border-leaf-100 bg-cream/40 p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                <Icon name={r.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
      <SectionHeading
        eyebrow="Our approach"
        title="A clear path from where they are to where they want to be"
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-leaf-100 bg-white p-6 shadow-card"
          >
            <span className="font-display text-4xl font-semibold text-leaf-100">
              0{i + 1}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-leaf-700 text-cream">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">
          In their words
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Students who trusted the process
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.quote}
              className="flex flex-col rounded-2xl bg-leaf-600/60 p-6 ring-1 ring-leaf-500/40"
            >
              <Icon name="spark" className="h-5 w-5 text-gold-300" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-leaf-50">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-leaf-500/40 pt-4">
                <p className="text-sm font-semibold text-cream">{t.name}</p>
                <p className="text-xs text-leaf-200">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
      <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-hero p-8 shadow-card sm:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading
              eyebrow="Get started"
              title="Ready to help your student aim higher?"
              intro="Message us on Facebook and tell us the exam and timeline. We'll get back with a plan, class options and the next intake."
            />
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf-600 px-6 py-3.5 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-leaf-700"
            >
              <FacebookIcon className="h-4 w-4" />
              Message on Facebook
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-leaf-300 px-6 py-3.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-white"
            >
              Email {site.email}
            </a>
            <p className="mt-1 text-center text-xs text-ink-soft">
              {site.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
