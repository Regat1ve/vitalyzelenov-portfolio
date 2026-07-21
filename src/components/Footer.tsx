"use client";

import { config } from "@/lib/config";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--color-border)] py-8 mt-16 text-sm text-[color:var(--color-muted)]">
      <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>{t("footer.copyright").replace("{year}", String(year))}</p>
        <a
          href={config.links.github}
          className="font-mono hover:text-[color:var(--color-foreground)] transition-colors"
        >
          {t("footer.source")}
        </a>
      </div>
    </footer>
  );
}
