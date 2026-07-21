"use client";

import { useT } from "@/lib/i18n";

export function Metrics() {
  const t = useT();
  const stats = [
    { value: "4", label: t("metrics.months") },
    { value: "4", label: t("metrics.products") },
    { value: "~800", label: t("metrics.loc") },
    { value: "40%", label: t("metrics.cut") },
  ];
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[color:var(--color-border)] pt-8 mt-10">
      {stats.map((s) => (
        <div key={s.label} className="space-y-1">
          <dt className="font-mono text-3xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
            {s.value}
          </dt>
          <dd className="text-xs text-[color:var(--color-muted)] leading-snug">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
