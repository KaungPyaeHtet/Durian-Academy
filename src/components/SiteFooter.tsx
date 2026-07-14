import { site } from "@/lib/site";
import { FacebookIcon, TikTokIcon } from "./icons";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-leaf-800/40 bg-leaf-800 text-leaf-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream">
              <LogoMark size={30} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-cream">
                {site.name}
              </span>
              <span className="text-[11px] font-medium tracking-wide text-gold-300">
                make it BOLD
              </span>
            </span>
          </div>
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
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cream">Follow</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-500"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </a>
            <a
              href={site.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-leaf-500"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </a>
          </div>
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
