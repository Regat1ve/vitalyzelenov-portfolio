export type Project = {
  slug: string;
  title: string;
  status: "live" | "pre-launch" | "in-progress" | "open-source";
  role: string;
  timeline: string;
  summary: string;
  bullets: string[];
  stack: string[];
  image: string;
  imageAlt: string;
  links: Array<{ label: string; href: string }>;
};

export const projects: Project[] = [
  {
    slug: "medkompas",
    title: "MedKompas",
    status: "pre-launch",
    role: "Co-founder, full-stack",
    timeline: "4 months, part-time (Mar–Jul 2026)",
    summary:
      "Healthtech marketplace for medical tourism inside Russia. Map + filters + booking flow, connecting clinics with domestic and inbound patients. Onboarding first partner clinics right now.",
    bullets: [
      "Vite + React 19 + TypeScript on the client. One flow (map + booking), no SSR gymnastics over MapLibre.",
      "Express + Prisma + Postgres on the server. Wrote the JWT + bcrypt + rate-limit stack from scratch, no black-box RLS.",
      "MapLibre + OSM ingestion pipeline in Python (~800 LOC) instead of Google Maps. Free tiles, own styling, no vendor lock.",
      "i18next for RU/EN, CN/AR staged. Medical tourism is inbound too.",
      "Beget hosting, Apache + .htaccess. Clinics trust RU-hosted TLS.",
    ],
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Express",
      "Prisma",
      "PostgreSQL",
      "MapLibre",
      "i18next",
      "Python (ETL)",
    ],
    image: "/projects/medkompas-placeholder.svg",
    imageAlt: "MedKompas marketplace screenshot placeholder",
    links: [],
  },
  {
    slug: "newforms",
    title: "newforms",
    status: "in-progress",
    role: "Solo dev · OVERKON side project",
    timeline: "In active development (Jul 2026)",
    summary:
      "Form-analytics SaaS for teams that outgrow Google Forms but do not want Typeform pricing. Built to keep my AI-assisted stack sharp between MedKompas releases.",
    bullets: [
      "Next.js 16 with App Router + Server Actions. Auth.js for magic-link + OAuth.",
      "Prisma with a single-migration philosophy. Every schema change is reviewed by hand before it hits prod.",
      "TanStack Table for the response viewer. Virtualized, keyboard-first, exportable.",
      "Owns its own CSV/JSON export path — no third-party analytics vendor.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Auth.js",
      "Prisma",
      "PostgreSQL",
      "TanStack Table",
      "Server Actions",
    ],
    image: "/projects/newforms-placeholder.svg",
    imageAlt: "newforms dashboard screenshot placeholder",
    links: [],
  },
  {
    slug: "claude-md-generator",
    title: "CLAUDE.md Generator",
    status: "open-source",
    role: "Author",
    timeline: "Built July 2026 · MIT",
    summary:
      "The single biggest lever on Claude Code output is a well-written CLAUDE.md. Most devs skip it or copy a stale template. This tool asks a few questions about your stack and stage, then generates an opinionated CLAUDE.md you can drop straight into a repo.",
    bullets: [
      "Modular by stack: Next.js, Prisma, Auth.js, MapLibre, Express, TanStack Table, Python ETL.",
      "Adjusts rules by project stage (pre-launch, growth, mature) — the same prompt should not apply to a 0-user prototype and a Series-B codebase.",
      "Adds explicit guardrails against Claude's known failure modes: over-normalization, retry storms, generated auth, docstring bloat.",
      "One-click copy or download. No sign-up, no tracking.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4"],
    image: "/projects/claude-md-tool-placeholder.svg",
    imageAlt: "CLAUDE.md Generator preview",
    links: [{ label: "Open the tool →", href: "/tools/claude-md" }],
  },
];
