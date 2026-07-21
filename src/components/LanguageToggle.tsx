"use client";

import { useLang } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  const next = lang === "en" ? "ru" : "en";
  return (
    <button
      onClick={() => setLang(next)}
      aria-label={t("toggle.lang.aria")}
      className="h-9 min-w-9 px-2 rounded-md border border-[color:var(--color-border)] flex items-center justify-center text-xs font-mono font-medium hover:bg-[color:var(--color-code)] transition-colors"
    >
      {lang.toUpperCase()}
    </button>
  );
}
