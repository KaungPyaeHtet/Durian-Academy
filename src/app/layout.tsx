import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://durianacademy.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Durian Academy — AP, SAT, IGCSE, A-Levels & Myanmar G12 Prep",
    template: "%s | Durian Academy",
  },
  description:
    "Durian Academy prepares students for AP, SAT, IGCSE, A-Levels and Myanmar G12 with experienced instructors, small classes and a proven, results-driven approach.",
  keywords: [
    "Durian Academy",
    "AP tutoring",
    "SAT prep",
    "IGCSE",
    "A Levels",
    "Myanmar G12",
    "exam preparation",
    "Myanmar academy",
  ],
  openGraph: {
    title: "Durian Academy — Exam Prep Done Right",
    description:
      "AP, SAT, IGCSE, A-Levels and Myanmar G12 preparation with experienced instructors and a proven track record.",
    url: SITE_URL,
    siteName: "Durian Academy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Durian Academy — Exam Prep Done Right",
    description:
      "AP, SAT, IGCSE, A-Levels and Myanmar G12 preparation with experienced instructors.",
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
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
