import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  return (
    <section id="projects" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        Projects
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        Three things I built this year.
      </p>
      <div className="space-y-8">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
