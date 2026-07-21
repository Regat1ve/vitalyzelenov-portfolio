"use client";

import { useT } from "@/lib/i18n";

const ruleKeys = ["r1", "r2", "r3", "r4", "r5"] as const;

export function Methodology() {
  const t = useT();
  return (
    <section id="methodology" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        {t("methodology.eyebrow")}
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        {t("methodology.headline")}
      </p>
      <div className="space-y-6">
        {ruleKeys.map((k, i) => (
          <div
            key={k}
            className="flex gap-5 pt-6 border-t border-[color:var(--color-border)] first:border-t-0 first:pt-0"
          >
            <div className="font-mono text-sm text-[color:var(--color-accent)] flex-shrink-0 pt-1">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t(`methodology.${k}.title`)}
              </h3>
              <p className="text-[color:var(--color-muted)] leading-relaxed">
                {t(`methodology.${k}.body`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
