import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[color:var(--color-background)]/70 border-b border-[color:var(--color-border)]">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight hover:text-[color:var(--color-accent)] transition-colors">
          vitaly.dev
        </Link>
        <div className="flex items-center gap-6 text-sm text-[color:var(--color-muted)]">
          <Link href="/#projects" className="hover:text-[color:var(--color-foreground)] transition-colors">
            Projects
          </Link>
          <Link href="/#methodology" className="hover:text-[color:var(--color-foreground)] transition-colors hidden sm:inline">
            Methodology
          </Link>
          <Link href="/tools/claude-md" className="hover:text-[color:var(--color-foreground)] transition-colors">
            Tools
          </Link>
          <Link href="/#contact" className="hover:text-[color:var(--color-foreground)] transition-colors">
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
