export type StackKey =
  | "nextjs"
  | "react-vite"
  | "prisma"
  | "authjs"
  | "maplibre"
  | "express"
  | "tanstack-table"
  | "python-etl"
  | "postgres"
  | "i18next";

export type Stage = "pre-launch" | "growth" | "mature";

export type StackOption = { key: StackKey; label: string; blurb: string };

export const STACKS: StackOption[] = [
  { key: "nextjs", label: "Next.js (App Router)", blurb: "SSR, RSC, Server Actions" },
  { key: "react-vite", label: "React + Vite (SPA)", blurb: "Client-side only, no SSR" },
  { key: "prisma", label: "Prisma", blurb: "Schema, migrations, client" },
  { key: "authjs", label: "Auth.js (NextAuth)", blurb: "OAuth, magic-link, JWT" },
  { key: "maplibre", label: "MapLibre GL", blurb: "WebGL maps, OSM tiles" },
  { key: "express", label: "Express (Node)", blurb: "REST API, middleware" },
  { key: "tanstack-table", label: "TanStack Table", blurb: "Virtualized data grid" },
  { key: "python-etl", label: "Python ETL", blurb: "Data ingestion, pipelines" },
  { key: "postgres", label: "PostgreSQL", blurb: "Raw SQL, migrations, indexes" },
  { key: "i18next", label: "i18next", blurb: "Multi-language content" },
];

export const STAGES: Array<{ key: Stage; label: string; blurb: string }> = [
  { key: "pre-launch", label: "Pre-launch", blurb: "< 100 users/day expected. Bias toward simplicity." },
  { key: "growth", label: "Growth", blurb: "10–1,000 users/day. Add complexity as traffic demands." },
  { key: "mature", label: "Mature", blurb: "1,000+ users/day. Reliability and observability first." },
];

const stackRules: Record<StackKey, string> = {
  nextjs: `## Next.js
- Prefer **Server Components** by default. Only reach for \`"use client"\` when you need state, effects, or event handlers.
- **Server Actions** are the default mutation path. Do not add REST/tRPC layers for problems Server Actions solve.
- Do not add \`useEffect\` for data fetching in RSC-capable routes. Fetch in the component.
- Every \`route.ts\` handler must validate input at the top and return a typed \`Response\`.
- Ask before adding a new provider layer to \`layout.tsx\` — the tree gets fat fast.`,

  "react-vite": `## React + Vite (SPA)
- No SSR. Do not import Node-only modules into client code.
- Fetch through a single typed client (fetch wrapper or tanstack-query). Do not scatter \`fetch\` calls in components.
- Use \`Suspense\` + code-splitting for any route that pulls a heavy dep (charts, maps, editors).
- Vite env vars must be prefixed \`VITE_\` and read only in one config module — do not sprinkle \`import.meta.env\` across the codebase.`,

  prisma: `## Prisma
- **Do not over-normalize.** Ask before splitting a table. \`User\` + \`UserProfile\` is a smell in a pre-launch app.
- Every schema change goes through \`prisma migrate dev\` locally, is reviewed by hand, then \`prisma migrate deploy\` in prod. No \`db push\` outside of throwaway prototypes.
- Do not use \`onDelete: Cascade\` without asking. Explicit application-layer deletes are safer.
- Wrap multi-write flows in \`prisma.$transaction\`. Do not rely on hope.
- Never expose \`prisma.$queryRaw\` to user input without \`Prisma.sql\` template tag.`,

  authjs: `## Auth.js
- **Never generate the auth flow from scratch.** Use provider adapters (\`@auth/prisma-adapter\`, GitHub/Google OAuth, magic-link).
- Session strategy: JWT for stateless, database for anything with revocation needs. Pick once, do not switch mid-project.
- Do not write custom cookie handling — use Auth.js callbacks (\`jwt\`, \`session\`).
- Rate-limit the credentials/magic-link routes at the edge or in middleware. Do not skip.
- Auth-related code changes require an explicit "auth" tag in the commit message so they surface in review.`,

  maplibre: `## MapLibre GL
- Load the library **lazily** — do not import in the top layout. Use \`dynamic()\` (Next.js) or \`React.lazy\` (Vite).
- WebGL context is expensive. Do not remount the map on every filter change — mutate sources/layers in place.
- Use vector tiles when possible (OSM, self-hosted). Do not shard \`fetch\` calls per marker.
- Cluster markers past ~100 points. GL layers, not DOM.
- All map events go through a single reducer or store — do not attach listeners in random components.`,

  express: `## Express (Node)
- Every route has: input validation (zod/yup), auth check, handler, typed response. In that order.
- Do not put business logic inside route handlers — keep them as thin adapters over service functions.
- One place for CORS, one place for error handling, one place for rate limits. Do not duplicate middleware.
- Async errors must go through \`next(err)\` — never let a promise reject silently.
- Log requests with a request-id (uuid) — every log line downstream carries it.`,

  "tanstack-table": `## TanStack Table
- Use \`useReactTable\` with **column defs as a stable reference** (\`useMemo\` or module const). Recreating column defs kills memoization.
- Virtualize any table over ~200 rows (\`@tanstack/react-virtual\`).
- Sort/filter/paginate on the server for datasets that grow past a few thousand rows. Do not ship in-memory shortcuts you will regret.
- Do not use table state for app-wide filters — lift shared filters into route state.`,

  "python-etl": `## Python ETL
- Every pipeline step is idempotent. Re-running must not double-insert or corrupt.
- Use \`pathlib.Path\`, never string concatenation for file paths.
- Long-running jobs must write progress to stdout with a timestamp — otherwise stalls are invisible in production.
- Type hints on every public function. \`mypy --strict\` on the core modules.
- Do not vendor secrets — read from env, fail loud if missing.`,

  postgres: `## PostgreSQL
- Every foreign key gets an index. Every text column you filter on gets an index. Every JSONB path you query gets an index.
- \`EXPLAIN ANALYZE\` before shipping any query that touches > 10k rows.
- Migrations are additive by default. Column drops go through: add nullable → backfill → app stops writing → drop.
- Never \`SELECT *\` in application code past the prototype stage.`,

  i18next: `## i18next
- One namespace per feature domain. Do not dump everything into \`common.json\`.
- Keys are English sentences (\`"Book an appointment"\`), not codes (\`"btn.book"\`). Easier to spot missing translations in code review.
- Never interpolate user-controlled strings into translations — use \`{{variable}}\` interpolation with \`escapeValue: true\`.
- Load locales lazily by route. Do not ship all languages in the initial bundle.`,
};

const stageRules: Record<Stage, string> = {
  "pre-launch": `## Stage: pre-launch (< 100 users/day)
- **Bias toward the simplest thing that ships.** No retry queues, no exponential backoff, no 12-field validators for a 4-field form.
- No feature flags for features you have not launched yet.
- No microservices. One deploy, one process, one database.
- Observability = console logs + one uptime check. Add real APM after real traffic.
- Add complexity when traffic asks for it, not before.`,

  growth: `## Stage: growth (10–1,000 users/day)
- Add structured logging (JSON) and error tracking (Sentry or similar). Console logs are no longer enough.
- Rate limit user-facing mutations. Cache read-heavy endpoints with a short TTL.
- Every migration reviewed for lock impact — no \`ALTER TABLE\` on hot tables without an explicit plan.
- Feature flags allowed for risky launches. Kill switches for anything that touches money or PII.`,

  mature: `## Stage: mature (1,000+ users/day)
- Every incident produces a postmortem. Every postmortem produces at least one commit.
- SLOs are written down. Alerts wake someone up only when an SLO is at risk.
- Zero-downtime migrations only. Multi-step add-column-then-backfill-then-drop is the default.
- Any change to auth, billing, or data-export flow requires review from a second pair of eyes before deploy.
- Read replicas for any query that does not need up-to-the-second consistency.`,
};

const coreRules = `## Core rules (always apply)
- Match the language of user-facing text to the user's language.
- Never add features, refactoring, or abstractions beyond what the task requires.
- Never add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code.
- Default to no comments. Only add one when the WHY is non-obvious.
- Do not explain WHAT the code does — well-named identifiers already do that.
- Prefer editing existing files to creating new ones.
- For destructive git operations (\`--force\`, \`reset --hard\`, branch deletion), confirm before running.
- Never skip pre-commit hooks (\`--no-verify\`) unless explicitly asked.`;

export function generateClaudeMd(
  projectName: string,
  stage: Stage,
  stacks: StackKey[]
): string {
  const header = `# ${projectName || "Project"} — CLAUDE.md

> Generated with the CLAUDE.md Generator by Vitaly Zelenov.
> Read this before you touch anything.

## Project context
${projectName ? `- **Name:** ${projectName}` : ""}
- **Stage:** ${stage}
- **Stack:** ${stacks.length ? stacks.join(", ") : "(edit this line — describe your stack)"}

Edit the paragraph above with anything else that shapes decisions: users, region, deploy target, team size.
`;

  const parts: string[] = [header, coreRules, stageRules[stage]];
  for (const s of stacks) {
    parts.push(stackRules[s]);
  }
  parts.push(`## When in doubt
Ask before adding a dependency. Ask before changing the schema. Ask before touching auth or payments. Everything else — ship the simplest version and iterate.`);

  return parts.join("\n\n");
}
