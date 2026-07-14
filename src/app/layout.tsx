import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Vitaly Zelenov — Full-stack developer shipping with Claude Code",
  description:
    "I'm Vitaly. Full-stack developer 4 months in, shipping real products with Claude Code + Cursor. MedKompas (healthtech marketplace) live, newforms in progress, open tools for AI-native devs.",
  metadataBase: new URL("https://vitalyzelenov.dev"),
  openGraph: {
    title: "Vitaly Zelenov — Full-stack developer shipping with Claude Code",
    description:
      "Real products shipped with AI as a co-worker. MedKompas, newforms, and open tools.",
    url: "https://vitalyzelenov.dev",
    siteName: "Vitaly Zelenov",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitaly Zelenov — Full-stack developer",
    description: "Shipping real products with Claude Code. Available for contract work.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
