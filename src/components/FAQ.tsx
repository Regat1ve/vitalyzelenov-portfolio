"use client";

import { useT } from "@/lib/i18n";

const qKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function FAQ() {
  const t = useT();
  return (
    <section id="faq" className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 sm:p-10 md:p-14">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        {t("faq.eyebrow")}
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        {t("faq.headline")}
      </p>
      <div className="space-y-4">
        {qKeys.map((k) => (
          <details
            key={k}
            className="group rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] open:border-[color:var(--color-accent)]/40"
          >
            <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 select-none">
              <span className="font-medium text-base md:text-lg">
                {t(`faq.${k}.q`)}
              </span>
              <span className="font-mono text-[color:var(--color-accent)] text-sm group-open:rotate-45 transition-transform flex-shrink-0">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-[color:var(--color-muted)] leading-relaxed">
              {t(`faq.${k}.a`)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
