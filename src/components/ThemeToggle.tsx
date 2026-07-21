"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  if (!mounted) {
    return (
      <button
        aria-label={t("toggle.theme.dark")}
        className="h-9 w-9 rounded-md border border-[color:var(--color-border)]"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? t("toggle.theme.light") : t("toggle.theme.dark")}
      className="h-9 w-9 rounded-md border border-[color:var(--color-border)] flex items-center justify-center text-sm hover:bg-[color:var(--color-code)] transition-colors"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
