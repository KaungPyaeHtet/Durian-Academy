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
  slogan: "Make it bold.",
  description:
    "Exam preparation (AP, SAT, IGCSE, A-Level, Myanmar G12) and study-abroad / scholarship guidance for Myanmar students.",
  areaServed: "MM",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yangon",
    addressCountry: "MM",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61591489172634",
    "https://www.tiktok.com/@durianacademy",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Programs",
    itemListElement: [
      "Advanced Placement (AP)",
      "SAT",
      "IGCSE",
      "A-Level",
      "Myanmar G12",
    ].map((name) => ({
      "@type": "Course",
      name,
      provider: { "@type": "EducationalOrganization", name: "Durian Academy" },
    })),
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Durian Academy — AP, SAT, IGCSE, A-Level & Myanmar G12 Tuition | Study Abroad Prep",
    template: "%s | Durian Academy",
  },
  description:
    "Durian Academy helps Myanmar students prepare for AP, SAT, IGCSE, A-Level and Myanmar G12 exams and apply to top universities abroad — with experienced instructors, small classes and scholarship guidance (incl. NUS ASEAN Scholarship).",
  keywords: [
    // Programs / exams students search for
    "AP tutoring Myanmar",
    "SAT prep Yangon",
    "SAT preparation Myanmar",
    "IGCSE tuition Yangon",
    "IGCSE Myanmar",
    "A Level tuition Myanmar",
    "Myanmar G12",
    "Grade 12 matriculation",
    "exam preparation Myanmar",
    // Study abroad / scholarships
    "study abroad Myanmar",
    "university admission Myanmar",
    "ASEAN scholarship",
    "NUS ASEAN Undergraduate Scholarship",
    "scholarships for Burmese students",
    // Brand + Burmese-language terms
    "Durian Academy",
    "ဒူးရင်းသီး အကယ်ဒမီ",
    "နိုင်ငံခြားပညာသင်",
    "ကျောင်းလျှောက်",
    "AP သင်တန်း",
    "SAT သင်တန်း",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Durian Academy — Exam Prep & Study-Abroad Guidance for Myanmar Students",
    description:
      "AP, SAT, IGCSE, A-Level and Myanmar G12 preparation plus university admissions and scholarship guidance for Myanmar students.",
    url: SITE_URL,
    siteName: "Durian Academy",
    locale: "my_MM",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Durian Academy — Exam Prep for Myanmar Students",
    description:
      "AP, SAT, IGCSE, A-Level and Myanmar G12 prep plus study-abroad and scholarship guidance.",
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
