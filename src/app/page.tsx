import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MessengerIcon } from "@/components/icons";
import { InterestForm } from "@/components/InterestForm";
import ProgramLogo from "@/components/ProgramLogo";
import Appointments from "@/components/Appointments";
import { site, programs } from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="flex-1">
        <Hero />
        <Programs />
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
          <h1 className="font-myanmar font-bold leading-[1.6] tracking-tight text-gold-500">
            <span className="block text-2xl sm:text-4xl lg:text-5xl">
              ထူးထူးခြားခြားနဲ့
            </span>
            <span className="mt-6 block text-4xl sm:text-6xl lg:text-7xl">
              သက်သက်သာသာ
            </span>
          </h1>
        </div>

        <Appointments />
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
        title="Every curriculum, one standard of teaching"
        intro="From top universities abroad to the matriculation exam at home, we prepare students for the qualification that matters most to them."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p, i) => {
          // Only AP is live. For the rest we render a self-contained "coming
          // soon" card and deliberately DO NOT output the name/blurb/tags into
          // the HTML, so the unreleased details can't be inspected yet.
          if (p.code !== "AP") {
            return (
              <article
                key={p.code}
                className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl bg-leaf-800 p-7 text-center shadow-card"
              >
                <span className="h-px w-8 bg-gold-400/70" />
                <span className="text-sm uppercase tracking-[0.35em] text-cream">
                  Coming soon
                </span>
                <span className="h-px w-8 bg-gold-400/70" />
              </article>
            );
          }
          return (
            <article
              key={p.code}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40"
            >
              {/* accent bar that fills in on hover */}
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold-400 transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <ProgramLogo src={p.logo} alt={`${p.name} logo`} index={i} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                {p.name}
              </h3>
              <span className="mt-3 block h-px w-10 bg-gold-400/70" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                {p.blurb}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-leaf-500">
                {p.tags.map((t, ti) => (
                  <span key={t} className="flex items-center gap-2.5">
                    {ti > 0 && (
                      <span className="h-1 w-1 rounded-full bg-gold-400" />
                    )}
                    {t}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Get started"
            title="Register your interest"
            intro="Fill in your details and our team will reach out with a study plan and class options."
          />
          <div className="mt-8 flex flex-col gap-3">
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Email:</span> {site.email}
            </p>
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Location:</span>{" "}
              {site.location}
            </p>
          </div>

          <a
            href={site.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-3 rounded-2xl border border-leaf-100 bg-white p-4 shadow-card transition-colors hover:border-gold-400/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-cream">
              <MessengerIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">
                Chat with us on Messenger
              </span>
              <span className="block text-xs text-ink-soft">
                We usually reply within a day
              </span>
            </span>
            <span className="ml-auto text-leaf-600">→</span>
          </a>
        </div>

        <InterestForm />
      </div>
    </section>
  );
}
