import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ClaudeMdGenerator } from "@/components/ClaudeMdGenerator";

export const metadata: Metadata = {
  title: "CLAUDE.md Generator — Vitaly Zelenov",
  description:
    "Opinionated CLAUDE.md generator for real projects. Pick your stack, pick your stage, drop the output into your repo.",
};

export default function ClaudeMdToolPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 w-full mx-auto max-w-[1280px] px-6 lg:px-10 py-12">
        <div className="mb-10 max-w-2xl">
          <Link
            href="/"
            className="text-sm font-mono text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] transition-colors"
          >
            ← back to portfolio
          </Link>
          <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            CLAUDE.md Generator
          </h1>
          <p className="text-lg text-[color:var(--color-muted)] leading-relaxed">
            The single biggest lever on Claude Code output is a well-written{" "}
            <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[color:var(--color-code)]">
              CLAUDE.md
            </code>
            . Most repos skip it or copy a stale template that fights their
            stack. Pick what you actually use, pick your stage, download the
            result.
          </p>
          <p className="mt-3 text-sm text-[color:var(--color-muted)]">
            No sign-up, no tracking, no storage. Everything runs in your browser.
          </p>
        </div>
        <ClaudeMdGenerator />
      </main>
      <Footer />
    </>
  );
}
