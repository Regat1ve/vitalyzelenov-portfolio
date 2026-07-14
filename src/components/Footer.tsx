import { config } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--color-border)] py-8 mt-16 text-sm text-[color:var(--color-muted)]">
      <div className="mx-auto max-w-3xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {year} {config.name}. Built with Next.js 16, deployed on Vercel,
          shipped with Claude Code.
        </p>
        <a
          href={config.links.github}
          className="font-mono hover:text-[color:var(--color-foreground)] transition-colors"
        >
          source
        </a>
      </div>
    </footer>
  );
}
