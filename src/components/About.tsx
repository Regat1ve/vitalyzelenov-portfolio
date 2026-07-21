"use client";

import { useT } from "@/lib/i18n";

export function About() {
  const t = useT();
  return (
    <section id="about" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-6">
        {t("about.eyebrow")}
      </h2>
      <div className="space-y-6 text-lg leading-relaxed max-w-2xl">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>
          {t("about.p3.pre")}
          <em>{t("about.p3.em")}</em>
          {t("about.p3.post")}
        </p>
      </div>
    </section>
  );
}
