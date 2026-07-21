"use client";

import { projects } from "@/lib/projects";
import { useT } from "@/lib/i18n";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const t = useT();
  return (
    <section id="projects" className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 sm:p-10 md:p-14">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        {t("projects.eyebrow")}
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        {t("projects.headline")}
      </p>
      <div className="space-y-8">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
