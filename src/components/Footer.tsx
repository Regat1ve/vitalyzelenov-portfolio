"use client";

import { config } from "@/lib/config";
import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--color-border)] py-8 mt-16 text-sm text-[color:var(--color-muted)]">
      <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 flex flex-col sm:flex-row items-center justify-between gap-3">
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
