import Image from "next/image";
import type { Project } from "@/lib/projects";

const statusColor: Record<Project["status"], string> = {
  live: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "pre-launch": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "open-source": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

const statusLabel: Record<Project["status"], string> = {
  live: "Live",
  "pre-launch": "Pre-launch",
  "in-progress": "In progress",
  "open-source": "Open source",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] overflow-hidden hover:border-[color:var(--color-accent)]/50 transition-colors">
      <div className="relative w-full aspect-[16/9] bg-[color:var(--color-code)]">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor[project.status]}`}
          >
            {statusLabel[project.status]}
          </span>
        </div>
        <p className="text-sm text-[color:var(--color-muted)] mb-1">
          {project.role}
        </p>
        <p className="text-xs font-mono text-[color:var(--color-muted)] mb-4">
          {project.timeline}
        </p>
        <p className="text-base leading-relaxed mb-4">{project.summary}</p>
        <ul className="space-y-1.5 mb-5 text-sm text-[color:var(--color-muted)]">
          {project.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[color:var(--color-accent)] flex-shrink-0">→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-[color:var(--color-code)] text-[color:var(--color-muted)]"
            >
              {s}
            </span>
          ))}
        </div>
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-4 text-sm">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[color:var(--color-accent)] hover:underline font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
