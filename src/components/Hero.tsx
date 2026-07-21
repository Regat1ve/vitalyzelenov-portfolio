"use client";

import Image from "next/image";
import Link from "next/link";
import { config } from "@/lib/config";
import { useT } from "@/lib/i18n";
import { Metrics } from "./Metrics";

export function Hero() {
  const t = useT();
  return (
    <section id="top" className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden">
      <div className="absolute inset-x-0 -top-6 h-[42vh] md:h-[52vh] -z-10 pointer-events-none">
        <Image
          src="/banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--color-background)]/60 to-[color:var(--color-background)]" />
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:gap-10">
        <div className="flex-1 pt-4">
          <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-accent)] mb-4">
            {t("hero.location")}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            {t("hero.greeting")} <br />
            <span className="text-[color:var(--color-muted)]">
              {t("hero.tagline")}
            </span>
          </h1>
          <p className="text-lg text-[color:var(--color-muted)] leading-relaxed mb-6 max-w-xl">
            {t("hero.pitch")}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
              {t("hero.badge.availability")}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
              {t("hero.badge.remote")}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center h-11 px-5 rounded-md bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {t("hero.cta.projects")}
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center h-11 px-5 rounded-md border border-[color:var(--color-border)] font-medium text-sm hover:bg-[color:var(--color-code)] transition-colors"
            >
              {t("hero.cta.hire")}
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0 mb-6 md:mb-0">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-2 ring-[color:var(--color-border)] shadow-2xl shadow-black/30">
            <Image
              src="/avatar.png"
              alt={`${config.name} — Regative`}
              fill
              sizes="200px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Metrics />
    </section>
  );
}
