"use client";

import { config } from "@/lib/config";
import { useT } from "@/lib/i18n";

const channels = [
  { label: "Email", value: config.links.email, href: `mailto:${config.links.email}` },
  { label: "LinkedIn", value: "vitaly-zelenov", href: config.links.linkedin },
  { label: "GitHub", value: "@regat1ve", href: config.links.github },
  { label: "Telegram", value: "@regative", href: config.links.telegram },
];

export function Contact() {
  const t = useT();
  return (
    <section id="contact" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        {t("contact.eyebrow")}
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 max-w-xl">
        {t("contact.headline")}
      </p>
      <p className="text-lg text-[color:var(--color-muted)] mb-8 max-w-xl">
        {t("contact.body")}
      </p>
      <ul className="space-y-3">
        {channels.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              className="group flex items-center justify-between py-3 border-b border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] transition-colors"
            >
              <span className="font-mono text-sm uppercase tracking-widest text-[color:var(--color-muted)] group-hover:text-[color:var(--color-foreground)] transition-colors w-32">
                {c.label}
              </span>
              <span className="text-base font-medium">
                {c.value}
                <span className="ml-2 text-[color:var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
