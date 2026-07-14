# vitalyzelenov-portfolio

Personal portfolio site for [Vitaly Zelenov](https://www.linkedin.com/in/vitaly-zelenov-8abaa824a/) — full-stack developer shipping real products with Claude Code.

## What's here

- One-page portfolio at `/` — Hero, About, Projects (MedKompas, newforms, CLAUDE.md Generator), Methodology, Contact.
- Open tool at `/tools/claude-md` — **CLAUDE.md Generator**. Pick your stack + stage, download an opinionated `CLAUDE.md` for your repo.

## Stack

- Next.js 16 (App Router, Server Components by default)
- React 19
- TypeScript
- Tailwind CSS v4
- Geist Sans + Geist Mono
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # one-pager
│   ├── globals.css
│   └── tools/
│       └── claude-md/
│           └── page.tsx             # CLAUDE.md Generator page
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── ProjectCard.tsx
│   ├── Methodology.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── ThemeScript.tsx
│   ├── ThemeToggle.tsx
│   └── ClaudeMdGenerator.tsx        # client component
└── lib/
    ├── config.ts                    # name, links, contact
    ├── projects.ts                  # portfolio project data
    └── claude-md-templates.ts       # stack + stage rule modules
```

## Content edits

- **Personal info & links** — `src/lib/config.ts`
- **Portfolio projects** — `src/lib/projects.ts`
- **Methodology rules** — `src/components/Methodology.tsx`
- **CLAUDE.md rules per stack/stage** — `src/lib/claude-md-templates.ts`

## Assets to replace

- `public/avatar-placeholder.svg` → real avatar photo
- `public/projects/medkompas-placeholder.svg` → real MedKompas screenshot
- `public/projects/newforms-placeholder.svg` → real newforms screenshot
- `public/projects/claude-md-tool-placeholder.svg` → optional real tool screenshot

## License

MIT — see [LICENSE](./LICENSE).
