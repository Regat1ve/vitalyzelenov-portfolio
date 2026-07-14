import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://vitalyzelenov-portfolio.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Vitaly Zelenov — Full-stack developer shipping with Claude Code",
    template: "%s — Vitaly Zelenov",
  },
  description:
    "Full-stack developer, four months in. Real products shipped with Claude Code + Cursor: MedKompas (healthtech marketplace), newforms (form-analytics SaaS), and the open CLAUDE.md Generator. Open for contract.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "Vitaly Zelenov",
    "Regative",
    "Claude Code",
    "AI-native developer",
    "full-stack",
    "Next.js",
    "React",
    "Prisma",
    "freelance",
    "contract",
  ],
  authors: [{ name: "Vitaly Zelenov", url: SITE_URL }],
  creator: "Vitaly Zelenov",
  openGraph: {
    title: "Vitaly Zelenov — Full-stack developer shipping with Claude Code",
    description:
      "Real products shipped with AI as a co-worker. MedKompas, newforms, and the open CLAUDE.md Generator.",
    url: SITE_URL,
    siteName: "Vitaly Zelenov",
    images: [
      {
        url: "/banner.jpg",
        width: 1680,
        height: 504,
        alt: "Vitaly Zelenov · full-stack developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitaly Zelenov — Full-stack developer shipping with Claude Code",
    description: "Real products shipped with Claude Code. Available for contract.",
    images: ["/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
