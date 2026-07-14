import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { projects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} — case study`,
    description: p.caseStudy.tagline,
    openGraph: {
      title: `${p.title} — case study`,
      description: p.caseStudy.tagline,
      images: ["/banner.jpg"],
    },
  };
}

const statusLabel: Record<string, string> = {
  live: "Live",
  "pre-launch": "Pre-launch",
  "in-progress": "In progress",
  "open-source": "Open source",
};

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href="/#projects"
          className="text-sm font-mono text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] transition-colors"
        >
          ← back to projects
        </Link>

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[color:var(--color-muted)]">
              {statusLabel[project.status]}
            </span>
            <span className="text-xs font-mono text-[color:var(--color-muted)]">·</span>
            <span className="text-xs font-mono text-[color:var(--color-muted)]">
              {project.timeline}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-[color:var(--color-muted)] leading-relaxed max-w-2xl">
            {project.caseStudy.tagline}
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-10 ring-1 ring-[color:var(--color-border)]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            The problem
          </h2>
          <p className="text-lg leading-relaxed">{project.caseStudy.problem}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            How I built it
          </h2>
          <ul className="space-y-3">
            {project.caseStudy.approach.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-sm text-[color:var(--color-accent)] flex-shrink-0 pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-mono bg-[color:var(--color-code)] text-[color:var(--color-muted)]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-4">
            Who did what — Claude vs me
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
              <h3 className="font-mono text-sm uppercase tracking-widest text-[color:var(--color-accent)] mb-3">
                Claude Code shipped
              </h3>
              <ul className="space-y-2 text-sm">
                {project.caseStudy.aiSplit.claude.map((c, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-[color:var(--color-muted)] flex-shrink-0">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
              <h3 className="font-mono text-sm uppercase tracking-widest text-[color:var(--color-accent)] mb-3">
                I shipped
              </h3>
              <ul className="space-y-2 text-sm">
                {project.caseStudy.aiSplit.me.map((c, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-[color:var(--color-muted)] flex-shrink-0">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            Where it stands
          </h2>
          <p className="text-lg leading-relaxed">{project.caseStudy.outcome}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            What I learned
          </h2>
          <ul className="space-y-3">
            {project.caseStudy.lessons.map((l, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="text-[color:var(--color-accent)] flex-shrink-0 pt-1">◆</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>

        {project.links.filter((l) => !l.href.startsWith("/projects/")).length > 0 && (
          <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-[color:var(--color-border)]">
            {project.links
              .filter((l) => !l.href.startsWith("/projects/"))
              .map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center h-10 px-4 rounded-md border border-[color:var(--color-border)] font-medium text-sm hover:bg-[color:var(--color-code)] transition-colors"
                >
                  {l.label}
                </a>
              ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-[color:var(--color-border)]">
          <p className="text-lg font-medium mb-4">
            Want a case study like this for your product?
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center h-11 px-5 rounded-md bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Get in touch
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
