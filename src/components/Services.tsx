"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

const items = ["s1", "s2", "s3", "s4"] as const;

export function Services() {
  const t = useT();
  return (
    <section id="services" className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 sm:p-10 md:p-14">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        {t("services.eyebrow")}
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        {t("services.headline")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((k) => (
          <div
            key={k}
            className="rounded-lg border border-[color:var(--color-border)] p-5 flex flex-col"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-accent)] mb-3">
              {t(`services.${k}.meta`)}
            </span>
            <h3 className="font-medium text-base md:text-lg mb-2">
              {t(`services.${k}.title`)}
            </h3>
            <p className="text-[color:var(--color-muted)] leading-relaxed text-sm">
              {t(`services.${k}.body`)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-[color:var(--color-muted)] leading-relaxed max-w-2xl">
        {t("services.note")}
      </p>
      <Link
        href="#contact"
        className="mt-6 inline-flex items-center h-11 px-5 rounded-md bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {t("services.cta")}
      </Link>
    </section>
  );
}
