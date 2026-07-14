import Link from "next/link";
import { site } from "@/lib/site";
import { LogoMark } from "./Logo";
import MobileNav from "./MobileNav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Classes" },
  { href: "/products", label: "Products" },
  { href: "/reviews", label: "Reviews" },
  { href: "/core", label: "Core" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={40} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-leaf-600">
              {site.name}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-gold-500">
              make it BOLD
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const cls =
              "text-sm font-medium text-ink-soft transition-colors hover:text-leaf-600";
            // hash links scroll within a page; route links use client navigation
            return item.href.includes("#") ? (
              <a key={item.href} href={item.href} className={cls}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={cls}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <MobileNav nav={nav} />
      </div>
    </header>
  );
}
