@AGENTS.md

# vitalyzelenov-portfolio — CLAUDE.md

Personal portfolio + open tool site. Public repo, deployed on Vercel.

## Project context

- **Stage:** pre-launch / low-traffic personal site
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Deploy target:** Vercel
- **Audience:** hiring managers, founders, other devs looking at the CLAUDE.md Generator tool

## Core rules (always apply)

- Never add features, refactoring, or abstractions beyond what the task requires.
- Never add error handling, fallbacks, or validation for scenarios that cannot happen.
- Default to no comments. Only add one when the WHY is non-obvious.
- Do not explain WHAT the code does — well-named identifiers already do that.
- Prefer editing existing files to creating new ones.
- Match user-facing text style: honest, direct, lowercase-permissive in body copy where it reads more naturally (never in proper nouns or sentence starts).
- Do not reintroduce em-dashes in body copy. Two clean sentences beat one long clause chain.

## Stage: pre-launch

- No feature flags, no A/B tests, no analytics beyond Vercel's built-in.
- One deploy, one Node runtime, no edge middleware unless a real reason appears.
- Add complexity when someone actually asks for it.

## Next.js 16

- Server Components by default. Client components only when they need state, effects, or event handlers (currently: `ThemeToggle`, `ClaudeMdGenerator`).
- No `useEffect` for data fetching — this is a static site, data is imported at build time.
- Metadata lives on each page's `page.tsx` as `export const metadata`.

## Tailwind CSS v4

- CSS variables live in `globals.css` under `:root` and `.dark`. Add new tokens there, not inline.
- Do not add ad-hoc utility classes when a variable already exists (`[color:var(--color-muted)]`, not `text-zinc-500`).
- Dark mode uses the `.dark` class on `<html>`, toggled by `ThemeToggle` + `ThemeScript`. Do not switch to `prefers-color-scheme` media queries — the toggle must persist.

## Content

- Portfolio project entries: `src/lib/projects.ts`. Each project has `status`, `bullets`, `stack`, one image.
- Methodology rules: `src/components/Methodology.tsx`. Keep at 5 or fewer, add-only after a real new lesson.
- CLAUDE.md Generator rules per stack/stage: `src/lib/claude-md-templates.ts`. Add a new stack module by extending `StackKey`, `STACKS`, and `stackRules` — three touchpoints, no more.

## Personal info

- `src/lib/config.ts` — single source of truth for name, location, contact channels. Do not hardcode these anywhere else.

## Images

- All project screenshots live in `public/projects/`. SVG placeholders are checked in — they get replaced with real screenshots by hand.
- Avatar is `public/avatar-placeholder.svg` and gets replaced with a real photo.

## When in doubt

Ask before adding a dependency. Ask before touching the CLAUDE.md Generator's rule set — those are opinionated and should stay so.
