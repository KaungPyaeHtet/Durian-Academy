import { site } from "@/lib/site";
import { FacebookIcon } from "./icons";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-leaf-800/40 bg-leaf-800 text-leaf-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream p-1.5">
              <LogoMark size={34} className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-cream">
                {site.name}
              </span>
              <span className="text-[11px] font-medium lowercase tracking-wide text-gold-300">
                make it bold
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-leaf-200">
            Preparing students for AP, SAT, IGCSE, A-Levels and Myanmar G12 —
            with the confidence to make it bold.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">Programs</h3>
          <ul className="mt-4 space-y-2 text-sm text-leaf-200">
            <li>Advanced Placement (AP)</li>
            <li>SAT</li>
            <li>IGCSE</li>
            <li>A-Levels</li>
            <li>Myanmar G12</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-leaf-200">
            <li>{site.location}</li>
            <li>
              <a className="hover:text-cream" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="hover:text-cream" href={`tel:${site.phone.replace(/\s/g, "")}`}>
                {site.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">Follow</h3>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-500"
          >
            <FacebookIcon className="h-4 w-4" />
            Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-leaf-700/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-leaf-300 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built for students who aim higher.</p>
        </div>
      </div>
    </footer>
  );
}
