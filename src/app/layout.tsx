import type { Metadata } from "next";
import {
  DM_Sans,
  Figtree,
  Fraunces,
  Inter,
  Lexend,
  Manrope,
  Noto_Sans_Myanmar,
  Noto_Serif_Myanmar,
  Padauk,
  Onest,
  Plus_Jakarta_Sans,
  Work_Sans,
} from "next/font/google";
import "./globals.css";

// Candidate body fonts — each exposes its own CSS variable so the dev
// font-switcher can swap the active `--font-active` between them at runtime.
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"] });

const bodyFonts = [
  lexend,
  inter,
  manrope,
  jakarta,
  dmSans,
  onest,
  figtree,
  workSans,
];

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Burmese/Myanmar fonts — the Latin display serif (Fraunces) has no Myanmar
// glyphs, so Burmese text needs its own font. Each exposes its own CSS variable
// so the dev Myanmar-font switcher can swap `--font-myanmar-active` at runtime.
const notoSerifMyanmar = Noto_Serif_Myanmar({
  variable: "--font-noto-serif-mm",
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
});
const notoSansMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-sans-mm",
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
});
const padauk = Padauk({
  variable: "--font-padauk",
  subsets: ["myanmar"],
  weight: ["400", "700"],
});

const myanmarFonts = [notoSerifMyanmar, notoSansMyanmar, padauk];

const SITE_URL = "https://durianacademy.com";

// Structured data (schema.org) describing the academy and the exam-prep
// programs it offers — improves how the site appears in search results.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Durian Academy",
  alternateName: "ဒူးရင်းသီး အကယ်ဒမီ",
  url: SITE_URL,
  slogan: "Make it BOLD.",
  description:
    "Advanced Placement (AP) preparation and study-abroad / scholarship guidance for Myanmar students.",
  areaServed: "MM",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yangon",
    addressCountry: "MM",
  },
  sameAs: [
    "https://www.facebook.com/durianacademy",
    "https://www.tiktok.com/@durianacademy",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programs",
    itemListElement: [
      {
        "@type": "Course",
        name: "Advanced Placement (AP)",
        provider: {
          "@type": "EducationalOrganization",
          name: "Durian Academy",
        },
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Durian Academy — Advanced Placement (AP) Prep for Myanmar Students",
    template: "%s | Durian Academy",
  },
  description:
    "Durian Academy helps Myanmar students master Advanced Placement (AP) courses and apply to top universities abroad, with experienced instructors and small classes.",
  keywords: [
    // AP-focused for launch
    "AP tutoring Myanmar",
    "Advanced Placement Myanmar",
    "AP prep Yangon",
    "College Board AP",
    "AP Calculus Myanmar",
    // Study abroad / scholarships
    "study abroad Myanmar",
    "university admission Myanmar",
    "ASEAN scholarship",
    "NUS ASEAN Undergraduate Scholarship",
    // Brand + Burmese-language terms
    "Durian Academy",
    "ဒူးရင်းသီး အကယ်ဒမီ",
    "နိုင်ငံခြားပညာသင်",
    "ကျောင်းလျှောက်",
    "AP သင်တန်း",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Durian Academy — Advanced Placement (AP) Prep for Myanmar Students",
    description:
      "Master AP courses and apply to top universities abroad with Durian Academy.",
    url: SITE_URL,
    siteName: "Durian Academy",
    locale: "my_MM",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Durian Academy — Advanced Placement (AP) Prep",
    description:
      "AP courses and study-abroad guidance for Myanmar students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFonts.map((f) => f.variable).join(" ")} ${
        fraunces.variable
      } ${myanmarFonts.map((f) => f.variable).join(" ")} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-cream text-ink">
        <script
          type="application/ld+json"
          // Structured data helps Google understand the org + the courses offered.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
