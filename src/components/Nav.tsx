"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useT } from "@/lib/i18n";

export function Nav() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[color:var(--color-background)]/70 border-b border-[color:var(--color-border)]">
      <nav className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight hover:text-[color:var(--color-accent)] transition-colors">
          vitaly.dev
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-[color:var(--color-muted)]">
          <Link href="/#projects" className="hover:text-[color:var(--color-foreground)] transition-colors">
            {t("nav.projects")}
          </Link>
          <Link href="/#methodology" className="hover:text-[color:var(--color-foreground)] transition-colors hidden sm:inline">
            {t("nav.methodology")}
          </Link>
          <Link href="/#faq" className="hover:text-[color:var(--color-foreground)] transition-colors hidden md:inline">
            {t("nav.faq")}
          </Link>
          <Link href="/tools/claude-md" className="hover:text-[color:var(--color-foreground)] transition-colors">
            {t("nav.tools")}
          </Link>
          <Link href="/#contact" className="hover:text-[color:var(--color-foreground)] transition-colors">
            {t("nav.contact")}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
