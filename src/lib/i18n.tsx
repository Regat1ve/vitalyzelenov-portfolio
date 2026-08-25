"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ru";
const STORAGE_KEY = "lang";

// ponytail: strings colocated with the code that renders them would be nicer,
// but 40+ short strings across 9 components is small enough that one flat dict
// is the shorter path. Split by namespace prefix when it grows past ~120 keys.
const dict = {
  en: {
    // Nav
    "nav.projects": "Projects",
    "nav.services": "Services",
    "nav.demos": "Demos",
    "nav.methodology": "Methodology",
    "nav.faq": "FAQ",
    "nav.tools": "Tools",
    "nav.contact": "Contact",

    // Theme + language toggle a11y
    "toggle.theme.light": "Switch to light mode",
    "toggle.theme.dark": "Switch to dark mode",
    "toggle.lang.aria": "Switch language",

    // Hero
    "hero.location": "Nizhny Novgorod, Russia · UTC+3",
    "hero.greeting": "Hi, I’m Vitaly.",
    "hero.tagline": "I ship real products with Claude Code.",
    "hero.pitch":
      "Full-stack developer, four months in. I code with AI as a co-worker, not a novelty. Two products in production or pre-launch, one open tool in the wild, and a discipline for cutting what does not need to ship.",
    "hero.badge.availability": "Open to inquiries",
    "hero.badge.remote": "Remote · EU + US East hours",
    "hero.cta.projects": "See projects",
    "hero.cta.hire": "Hire me",

    // Metrics
    "metrics.months": "months shipping with Claude Code",
    "metrics.products": "products live, pre-launch, or open source",
    "metrics.loc": "LOC of Python ETL owned end-to-end",
    "metrics.cut": "of Claude’s first-pass output cut on review",

    // About
    "about.eyebrow": "About",
    "about.p1":
      "I started coding seriously in March 2026. Instead of grinding tutorials for a year, I picked a real problem — bootstrapping a medical-tourism marketplace inside Russia — and shipped MedKompas with Claude Code alongside me. Five months in, the marketplace is live and taking patient enquiries while we line up the first clinics.",
    "about.p2":
      "The uncomfortable truth is that AI writes a lot of good code and even more code you should never merge. My advantage is not typing speed. It is knowing what to keep, what to cut, and what Claude cannot decide for you: schema shape, auth boundaries, the trade-offs a co-founder actually cares about.",
    "about.p3.pre": "I am opening my calendar for contract and freelance work with founders who want someone to ",
    "about.p3.em": "ship",
    "about.p3.post": ", not to babysit tooling.",

    // Projects section
    "projects.eyebrow": "Projects",
    "projects.headline": "Eight things I shipped this year.",
    "projects.status.live": "Live",
    "projects.status.pre-launch": "Pre-launch",
    "projects.status.in-progress": "In progress",
    "projects.status.open-source": "Open source",

    // Methodology
    "methodology.eyebrow": "Methodology",
    "methodology.headline": "Five rules I ship by.",
    "methodology.r1.title": "Tell Claude your stage before you tell it your task.",
    "methodology.r1.body":
      "Pre-launch, single-region, <100 users/day is a different problem than a Series-B codebase. Claude defaults to the bigger one every time. One paragraph in CLAUDE.md kills 40% of over-engineering.",
    "methodology.r2.title": "Own schema, auth, and the trade-offs.",
    "methodology.r2.body":
      "Every schema decision on MedKompas was mine. Auth flow was written by hand and reviewed line by line. Claude is a fast typist, not a co-founder.",
    "methodology.r3.title": "Ship the version you kept after cutting.",
    "methodology.r3.body":
      "I delete ~40% of what Claude writes on the first pass. Retry queues, 12-field validators, three layers of abstraction on top of Prisma — none of that lives past review.",
    "methodology.r4.title": "Real code beats promised code.",
    "methodology.r4.body":
      "OSM ingestion pipeline in Python, JWT stack from scratch, memory-leak trace in a cron job. Claude helped. I own the read-through.",
    "methodology.r5.title": "Use AI to compress the boring 80%. Sit in the important 20%.",
    "methodology.r5.body":
      "Boilerplate, glue code, first-draft components — Claude ships. Model design, auth boundaries, taste-checks on every merge — I ship.",

    // Services
    "services.eyebrow": "Hire me for",
    "services.headline": "Four things I can start on this week.",
    "services.s1.meta": "2–4 weeks",
    "services.s1.title": "MVP from empty repo to live URL",
    "services.s1.body":
      "Next.js or React + Postgres, auth written by hand, the one flow that actually matters, deployed on a real domain. This is exactly what MedKompas and newforms are.",
    "services.s2.meta": "3–10 days",
    "services.s2.title": "Data pipelines and integrations",
    "services.s2.body":
      "Pull from APIs and feeds you do not control, deduplicate, normalize, land it in Postgres on a schedule. Python + Prisma. remote-work-radar ingests three job boards this way.",
    "services.s3.meta": "1–2 weeks",
    "services.s3.title": "An AI feature inside your existing product",
    "services.s3.body":
      "Claude API for classification, extraction, drafting, or chat over your own data. I work with these models every working day, so I know where they break and what they cost.",
    "services.s4.meta": "2–5 days",
    "services.s4.title": "Audit of AI-generated code",
    "services.s4.body":
      "You shipped fast with Cursor or Copilot and now nobody can read it. I cut what should not be there and write the CLAUDE.md that stops it growing back.",
    "services.note":
      "Fixed scope and fixed timeline, agreed before anything starts. If the job turns out bigger than the estimate, you hear it on day two, not on the deadline.",
    "services.cta": "Describe your task",
    "services.demos.title": "Four live demos you can click through",
    "services.demos.body": "3D product page, analytics dashboard, store with a cart, booking flow — all working code, not mockups.",

    // FAQ
    "faq.eyebrow": "FAQ",
    "faq.headline": "Questions founders actually ask.",
    "faq.q1.q": "Are you actually only 4 months in?",
    "faq.q1.a":
      "Yes. First serious line of code was March 2026. What compresses the timeline is not talent — it is Claude Code + tight scope + reviewing every diff. I still miss things a five-year veteran wouldn’t, and I say so up front.",
    "faq.q2.q": "Do you just prompt-engineer while Claude does everything?",
    "faq.q2.a":
      "No. Claude ships boilerplate, first-draft components, and glue code fast. I own schema decisions, auth boundaries, and every merge review. On MedKompas I deleted ~40% of what Claude wrote on the first pass. Discipline is the leverage.",
    "faq.q3.q": "Timezone overlap?",
    "faq.q3.a":
      "UTC+3 (Nizhny Novgorod). Comfortable overlap window with EU business hours all day and US East Coast until 24:00 MSK. Not stretching to US Pacific — quality drops after midnight my time.",
    "faq.q4.q": "What kind of work do you want?",
    "faq.q4.a":
      "Founders who need a full flow shipped end-to-end — auth, data model, main feature, deploy. Or a founding engineer role at a pre-seed / seed startup. Not interested in agencies subcontracting to me.",

    // Contact
    "contact.eyebrow": "Contact",
    "contact.headline": "Want someone to actually ship it?",
    "contact.body":
      "Available for contract & freelance. Comfortable with EU and US East Coast hours. Best routes below — email or LinkedIn get the fastest answer.",

    "project.demo-lab.role": "Author",
    "project.demo-lab.timeline": "Built in one day, August 2026",
    "project.demo-lab.summary":
      "Four working interfaces built to be clicked, not looked at: a scroll-driven 3D product page, an analytics dashboard, a store with a persistent cart, and a four-step booking flow.",
    "project.demo-lab.imageAlt":
      "AURORA demo — a reflective distorted sphere inside a wireframe cage on a dark field",
    "project.demo-lab.b1":
      "AURORA — React Three Fiber scene: shader-displaced geometry, particle shell, procedural environment from lightformers. No external models, no HDR files. Scroll drives camera, distortion and palette.",
    "project.demo-lab.b2":
      "PULSE — analytics dashboard. Charts hand-written in SVG, no charting library. Crosshair tooltip, sortable table, filters. Palette validated for colour-vision deficiency before shipping.",
    "project.demo-lab.b3":
      "KŌRI — storefront. Category, price and stock filters, three sort modes, cart that survives a reload, promo codes and a free-shipping threshold.",
    "project.demo-lab.b4":
      "ATELIER — booking in four steps. Calendar with busy slots blocked, phone mask and validation, confirmation screen with the order summary.",
    "project.demo-lab.b5":
      "All four are statically prerendered. The 3D bundle is a dynamic import, so it never touches the first load of the other pages.",
    "project.kuznets.role": "Solo — design, code, art",
    "project.kuznets.timeline": "Built in one day, August 2026",
    "project.kuznets.summary":
      "A physics merge game set in a forge. Drop billets, fuse matching ones up an eight-step ladder from copper to mithril. The genre twist is Reforge: a heat meter that buys one hammer strike, welding any ingot to its nearest twin anywhere on the field.",
    "project.kuznets.imageAlt":
      "KUZNETS — coloured metal ingots piled at the bottom of a dark forge, score and heat meter above",
    "project.kuznets.b1":
      "Vanilla JS + matter.js, no build step. The same folder runs on Vercel and inside a Yandex.Games archive — nothing to compile, nothing to configure per host.",
    "project.kuznets.b2":
      "Reforge fixes the genre's worst moment: a lone ingot buried under the pile with its pair unreachable. Heat builds from every fusion; a full meter spends on one targeted weld.",
    "project.kuznets.b3":
      "Fixed 60 Hz timestep with a substep accumulator, so a 144 Hz laptop and a throttled phone run identical physics instead of drifting apart.",
    "project.kuznets.b4":
      "The basin height adapts to the viewport shape — a tall phone gets a deeper forge — and the floor body moves with it rather than the field being letterboxed.",
    "project.kuznets.b5":
      "Bodies are the ingots themselves, not circles wearing an ingot picture — the collision shape is the same trapezoid as the sprite, so resting ingots touch face to face and need no disc painted underneath.",
    "project.kuznets.b6":
      "Tier palette run through a colour-vision-deficiency validator before anything was rendered: worst adjacent pair ΔE 17.4 under deuteranopia. Warm and cool alternate up the ladder so neighbours never blur together.",
    "project.kuznets.b7":
      "Sound is synthesised in WebAudio — a noise transient through a bandpass plus two detuned triangles, pitched by tier. No audio files ship at all, and it mutes on tab blur and during ads, as the platform requires.",
    "project.kuznets.b8":
      "Yandex Games SDK is optional at runtime: leaderboard, interstitials and language detection when the platform is there, a plain game when it is not.",
    "project.link.playIt": "Play it →",
    "project.link.openDemos": "Open the demos →",

    // Footer
    "footer.copyright":
      "© {year} Vitaly Zelenov. Built with Next.js 16, deployed on Vercel, shipped with Claude Code.",
    "footer.source": "source",

    // ProjectCard link labels (translated shells; project names stay EN)
    "project.link.caseStudy": "Read case study →",
    "project.link.medkompasSite": "medkompas13.ru →",
    "project.link.openTool": "Open the tool →",
    "project.link.playbookRepo": "Playbook repo →",
    "project.link.liveSite": "Live site →",
    "project.link.repo": "Repo →",

    // Project card content (per project)
    "project.medkompas.role": "Co-founder, full-stack",
    "project.medkompas.timeline": "4 months, part-time (Mar–Jul 2026)",
    "project.medkompas.summary":
      "Healthtech marketplace for medical tourism inside Russia. Map + filters + booking flow, connecting clinics with domestic and inbound patients. Deployed and taking patient enquiries, pre-launch on the clinic side.",
    "project.medkompas.imageAlt":
      "MedKompas homepage — search bar, region stats, 17 doctors listed",
    "project.medkompas.b1":
      "Vite + React 19 + TypeScript on the client. One flow (map + booking), no SSR gymnastics over MapLibre.",
    "project.medkompas.b2":
      "Express + Prisma + Postgres on the server. Wrote the JWT + bcrypt + rate-limit stack from scratch, no black-box RLS.",
    "project.medkompas.b3":
      "MapLibre + OSM ingestion pipeline in Python (~800 LOC) instead of Google Maps. Free tiles, own styling, no vendor lock.",
    "project.medkompas.b4":
      "i18next for RU/EN, CN/AR staged. Medical tourism is inbound too.",
    "project.medkompas.b5":
      "Beget hosting, Apache + .htaccess. Clinics trust RU-hosted TLS.",

    "project.newforms.role": "Solo dev · OVERKON side project",
    "project.newforms.timeline": "In active development (Jul 2026)",
    "project.newforms.summary":
      "Form-analytics SaaS for teams that outgrow Google Forms but do not want Typeform pricing. Built to keep my AI-assisted stack sharp between MedKompas releases.",
    "project.newforms.imageAlt":
      "newforms dashboard mock — response stats, 14-day sparkline, response table",
    "project.newforms.b1":
      "Next.js 16 with App Router + Server Actions. Auth.js for magic-link + OAuth.",
    "project.newforms.b2":
      "Prisma with a single-migration philosophy. Every schema change is reviewed by hand before it hits prod.",
    "project.newforms.b3":
      "TanStack Table for the response viewer. Virtualized, keyboard-first, exportable.",
    "project.newforms.b4":
      "Owns its own CSV/JSON export path — no third-party analytics vendor.",

    "project.claude-md-generator.role": "Author",
    "project.claude-md-generator.timeline": "Built July 2026 · MIT",
    "project.claude-md-generator.summary":
      "The single biggest lever on Claude Code output is a well-written CLAUDE.md. Most devs skip it or copy a stale template. This tool asks a few questions about your stack and stage, then generates an opinionated CLAUDE.md you can drop straight into a repo.",
    "project.claude-md-generator.imageAlt":
      "CLAUDE.md Generator UI — form + live markdown preview",
    "project.claude-md-generator.b1":
      "Modular by stack: Next.js, Prisma, Auth.js, MapLibre, Express, TanStack Table, Python ETL.",
    "project.claude-md-generator.b2":
      "Adjusts rules by project stage (pre-launch, growth, mature) — the same prompt should not apply to a 0-user prototype and a Series-B codebase.",
    "project.claude-md-generator.b3":
      "Adds explicit guardrails against Claude’s known failure modes: over-normalization, retry storms, generated auth, docstring bloat.",
    "project.claude-md-generator.b4": "One-click copy or download. No sign-up, no tracking.",

    "project.remote-work-radar.role": "Author",
    "project.remote-work-radar.timeline": "Started July 2026 · MIT",
    "project.remote-work-radar.summary":
      "OSS job board for developers locked out of Upwork, Mercor, Deel, and Contra. Aggregates remote-first feeds that do not gatekeep by country, filters US-only postings by default, flags scam patterns, and ships beginner-mode explanations for people writing their first cover letter.",
    "project.remote-work-radar.imageAlt":
      "remote-work-radar /jobs page — filterable list of 540 remote postings with entry-level and scam badges",
    "project.remote-work-radar.b1":
      "Monorepo: Next.js 16 web app, Python 3.13 ETL, Prisma + Postgres schema package.",
    "project.remote-work-radar.b2":
      "Three live sources at ship: WeWorkRemotely RSS, RemoteOK JSON API, HN ‘Who is hiring?’ via Algolia search-by-date. 440 unique jobs on first pull.",
    "project.remote-work-radar.b3":
      "Deterministic dedup — hash(normalized title + normalized company). Same posting seen on two boards becomes one Job row with two source refs.",
    "project.remote-work-radar.b4":
      "Beginner mode is the default, not a feature flag. Glossary explains hourly vs retainer, 4 cover letter templates that do not fake seniority, scam detector flags ‘training fee’ asks.",
    "project.remote-work-radar.b5":
      "MCP server planned so Claude Code can search, score fit, and draft applications against the same DB.",
  },
  ru: {
    // Nav
    "nav.projects": "Проекты",
    "nav.services": "Услуги",
    "nav.demos": "Демо",
    "nav.methodology": "Методология",
    "nav.faq": "FAQ",
    "nav.tools": "Инструменты",
    "nav.contact": "Контакты",

    // Theme + language toggle a11y
    "toggle.theme.light": "Переключить на светлую тему",
    "toggle.theme.dark": "Переключить на тёмную тему",
    "toggle.lang.aria": "Переключить язык",

    // Hero
    "hero.location": "Нижний Новгород · МСК (UTC+3)",
    "hero.greeting": "Привет, я Виталий.",
    "hero.tagline": "Делаю реальные продукты в паре с Claude Code.",
    "hero.pitch":
      "Full-stack разработчик, четыре месяца в деле. Работаю с AI как с коллегой, а не как с игрушкой. Два продукта в проде или на предзапуске, один открытый инструмент в открытом доступе, и привычка резать всё, что не должно доехать до релиза.",
    "hero.badge.availability": "Открыт к контактам",
    "hero.badge.remote": "Удалённо · рабочие часы по МСК",
    "hero.cta.projects": "К проектам",
    "hero.cta.hire": "Нанять меня",

    // Metrics
    "metrics.months": "месяца шиплю с Claude Code",
    "metrics.products": "продукта в проде, на предзапуске или в опенсорсе",
    "metrics.loc": "строк Python ETL, полностью на мне",
    "metrics.cut": "первого драфта Claude режу на ревью",

    // About
    "about.eyebrow": "Обо мне",
    "about.p1":
      "Всерьёз начал кодить в марте 2026-го. Вместо года туториалов взял реальную задачу — начать двигать медицинский туризм внутри России — и вытащил MedKompas вместе с Claude Code. Пять месяцев спустя маркетплейс работает и собирает заявки от пациентов, клиники — следующий шаг.",
    "about.p2":
      "Правда в том, что AI пишет много хорошего кода и ещё больше кода, который никогда не стоит мёржить. Моё преимущество — не скорость набора. Это понимание, что оставить, что вырезать, и что Claude за тебя не решит: форма схемы, границы авторизации, компромиссы, которые волнуют реального сооснователя.",
    "about.p3.pre":
      "Открываю календарь для контрактной и фриланс-работы с основателями, которым нужен человек, который ",
    "about.p3.em": "шипит",
    "about.p3.post": ", а не нянчит инструменты.",

    // Projects section
    "projects.eyebrow": "Проекты",
    "projects.headline": "Восемь штук, которые я выпустил в этом году.",
    "projects.status.live": "В проде",
    "projects.status.pre-launch": "Предзапуск",
    "projects.status.in-progress": "В работе",
    "projects.status.open-source": "Open source",

    // Methodology
    "methodology.eyebrow": "Методология",
    "methodology.headline": "Пять правил, по которым я работаю.",
    "methodology.r1.title": "Сначала расскажи Claude про стадию, потом про задачу.",
    "methodology.r1.body":
      "Предзапуск, один регион, <100 пользователей в день — это другая задача, чем кодовая база Series B. Claude по умолчанию решает вторую. Один абзац в CLAUDE.md убирает 40% переусложнения.",
    "methodology.r2.title": "Схема, авторизация и компромиссы — только на тебе.",
    "methodology.r2.body":
      "Каждое решение по схеме в MedKompas принимал я. Auth-флоу писал руками и ревьюил построчно. Claude — быстрый машинист, а не сооснователь.",
    "methodology.r3.title": "Шипь версию, которая осталась после чистки.",
    "methodology.r3.body":
      "Я удаляю ~40% того, что Claude пишет в первый заход. Ретрай-очереди, валидаторы на 12 полей, три слоя абстракций поверх Prisma — ничего из этого не переживает ревью.",
    "methodology.r4.title": "Живой код важнее обещанного.",
    "methodology.r4.body":
      "OSM-пайплайн на Python, JWT-стек с нуля, разбор утечки памяти в крон-джобе. Claude помог. Прочитал и подписал — я.",
    "methodology.r5.title": "AI сжимает скучные 80%. Ты сидишь в важных 20%.",
    "methodology.r5.body":
      "Бойлерплейт, склеивающий код, первые драфты компонентов — шипит Claude. Модель данных, границы авторизации, вкусовые решения на каждом мёрже — шиплю я.",

    // Services
    "services.eyebrow": "Зачем меня нанимают",
    "services.headline": "Четыре задачи, за которые могу взяться на этой неделе.",
    "services.s1.meta": "2–4 недели",
    "services.s1.title": "MVP от пустого репозитория до живого адреса",
    "services.s1.body":
      "Next.js или React + Postgres, авторизация руками, один флоу, ради которого всё затевалось, и деплой на реальном домене. Ровно так сделаны MedKompas и newforms.",
    "services.s2.meta": "3–10 дней",
    "services.s2.title": "Данные и интеграции",
    "services.s2.body":
      "Забрать из чужих API и фидов, убрать дубли, привести к одному виду и по расписанию класть в Postgres. Python + Prisma. Так работает remote-work-radar на трёх источниках вакансий.",
    "services.s3.meta": "1–2 недели",
    "services.s3.title": "AI-фича внутри существующего продукта",
    "services.s3.body":
      "Claude API под классификацию, извлечение данных, генерацию текстов или чат по вашим данным. С этими моделями работаю каждый день и знаю, где они ломаются и сколько стоят.",
    "services.s4.meta": "2–5 дня",
    "services.s4.title": "Аудит кода, написанного нейросетью",
    "services.s4.body":
      "Быстро собрали на Cursor или Copilot, а теперь это невозможно читать. Вырезаю лишнее и пишу CLAUDE.md, чтобы оно не выросло снова.",
    "services.note":
      "Фиксированный объём и срок, согласованные до старта. Если задача оказывается больше оценки, вы узнаёте об этом на второй день, а не в дедлайн.",
    "services.cta": "Описать задачу",
    "services.demos.title": "Четыре демо, которые можно потрогать",
    "services.demos.body": "3D-витрина, аналитический дашборд, магазин с корзиной и онлайн-запись — всё рабочий код, не макеты.",

    // FAQ
    "faq.eyebrow": "FAQ",
    "faq.headline": "Вопросы, которые реально задают основатели.",
    "faq.q1.q": "Ты правда всего 4 месяца в деле?",
    "faq.q1.a":
      "Да. Первая серьёзная строчка кода — март 2026-го. Сроки сжимает не талант, а Claude Code + узкий скоуп + ревью каждого диффа. Я всё ещё пропускаю то, что не пропустил бы ветеран с пятью годами опыта, и говорю об этом честно с самого начала.",
    "faq.q2.q": "Ты просто промптишь, а Claude делает всё за тебя?",
    "faq.q2.a":
      "Нет. Claude быстро выдаёт бойлерплейт, первые драфты компонентов и склеивающий код. Решения по схеме, границы авторизации и ревью каждого мёржа — на мне. На MedKompas я удалил ~40% того, что Claude выдал первым заходом. Дисциплина — вот рычаг.",
    "faq.q3.q": "Как со временем?",
    "faq.q3.a":
      "МСК (UTC+3). Основное окно — весь рабочий день по МСК. С европейскими и восточно-американскими командами работаю до 24:00 МСК. До Западного побережья США не тянусь — качество падает после полуночи.",
    "faq.q4.q": "Какую работу ищешь?",
    "faq.q4.a":
      "Основателей, которым нужен полный флоу под ключ — авторизация, модель данных, основная фича, деплой. Или роль founding engineer в pre-seed / seed-стартапе. Работать через агентство ради галочки — не интересно.",

    // Contact
    "contact.eyebrow": "Контакты",
    "contact.headline": "Нужен человек, который реально доведёт до релиза?",
    "contact.body":
      "Открыт к контракту и фрилансу. Работаю по МСК, с европейскими и восточно-американскими командами — комфортно. Самые быстрые каналы — почта и LinkedIn.",

    "project.demo-lab.role": "Автор",
    "project.demo-lab.timeline": "Собрано за один день, август 2026",
    "project.demo-lab.summary":
      "Четыре рабочих интерфейса, которые можно потрогать, а не рассматривать: 3D-витрина со скролл-анимацией, аналитический дашборд, магазин с живучей корзиной и запись в четыре шага.",
    "project.demo-lab.imageAlt":
      "Демо AURORA — отражающая сфера внутри каркасной оболочки на тёмном фоне",
    "project.demo-lab.b1":
      "AURORA — сцена на React Three Fiber: шейдерная деформация геометрии, поле частиц, процедурное окружение из lightformer-ов. Ни одной внешней модели и ни одного HDR-файла. Скролл двигает камеру, деформацию и палитру.",
    "project.demo-lab.b2":
      "PULSE — аналитический дашборд. Графики написаны руками в SVG, без библиотек. Кроссхейр с подсказкой, сортируемая таблица, фильтры. Палитра проверена на дальтонизм до выкатки.",
    "project.demo-lab.b3":
      "KŌRI — магазин. Фильтры по категории, цене и наличию, три режима сортировки, корзина переживает перезагрузку, промокоды и порог бесплатной доставки.",
    "project.demo-lab.b4":
      "ATELIER — запись в четыре шага. Календарь с заблокированными занятыми слотами, маска и валидация телефона, экран подтверждения со сводкой заказа.",
    "project.demo-lab.b5":
      "Все четыре предрендерятся статически. 3D-бандл вынесен в динамический импорт и не попадает в первую загрузку остальных страниц.",
    "project.kuznets.role": "Один — геймдизайн, код, графика",
    "project.kuznets.timeline": "Собрано за один день, август 2026",
    "project.kuznets.summary":
      "Merge-игра на физике в кузнице. Роняешь заготовки, одинаковые сплавляются по лестнице из восьми металлов от меди до мифрила. Своё поверх жанра — перековка: шкала жара покупает удар молотом, который сваривает выбранный слиток с ближайшим таким же где угодно на поле.",
    "project.kuznets.imageAlt":
      "КУЗНЕЦ — цветные слитки в нижней части тёмного горна, сверху счёт и шкала жара",
    "project.kuznets.b1":
      "Чистый JS и matter.js, без сборки. Одна и та же папка едет и на Vercel, и в архив Яндекс.Игр — нечего компилировать и нечего донастраивать под площадку.",
    "project.kuznets.b2":
      "Перековка чинит худший момент жанра: одинокий слиток завален грудой, а его пара недостижима. Жар копится с каждого сплава, полная шкала тратится на один точечный шов.",
    "project.kuznets.b3":
      "Физика идёт фиксированным тиком 60 Гц с накопителем подшагов: ноутбук на 144 Гц и придушенный телефон считают одно и то же, а не расходятся.",
    "project.kuznets.b4":
      "Высота горна подстраивается под форму экрана — на вытянутом телефоне бассейн глубже, — и пол двигается вместе с ней, вместо того чтобы обрамлять поле пустыми полями.",
    "project.kuznets.b5":
      "Тело в физике — сам слиток, а не круг с картинкой слитка: форма тела повторяет силуэт спрайта, поэтому лежащие слитки касаются гранями и подложка под ними не нужна.",
    "project.kuznets.b6":
      "Палитра тиров прогнана через валидатор на дальтонизм до того, как был отрисован первый спрайт: худшая соседняя пара ΔE 17.4 при дейтеранопии. Тёплые и холодные чередуются по лестнице, поэтому соседи никогда не сливаются.",
    "project.kuznets.b7":
      "Звук синтезируется в WebAudio: шумовой транзиент через полосовой фильтр и два расстроенных треугольника, высота зависит от тира. В игре нет ни одного аудиофайла, и она глохнет при уходе со вкладки и на рекламе — этого требует площадка.",
    "project.kuznets.b8":
      "SDK Яндекс.Игр подключается по желанию: на площадке есть таблица рекордов, реклама и определение языка, вне её — просто игра.",
    "project.link.playIt": "Играть →",
    "project.link.openDemos": "Открыть демо →",

    // Footer
    "footer.copyright":
      "© {year} Виталий Зеленов. Сделано на Next.js 16, деплой на Vercel, писал в паре с Claude Code.",
    "footer.source": "исходник",

    // ProjectCard link labels
    "project.link.caseStudy": "Читать кейс →",
    "project.link.medkompasSite": "medkompas13.ru →",
    "project.link.openTool": "Открыть инструмент →",
    "project.link.playbookRepo": "Плейбук на GitHub →",
    "project.link.liveSite": "Открыть сайт →",
    "project.link.repo": "Репозиторий →",

    // Project card content (per project)
    "project.medkompas.role": "Сооснователь, full-stack",
    "project.medkompas.timeline": "5 месяцев, part-time (март–август 2026)",
    "project.medkompas.summary":
      "Healthtech-маркетплейс для медицинского туризма внутри России. Карта + фильтры + бронирование, связывает клиники с российскими и въездными пациентами. Развёрнут и собирает заявки от пациентов, по клиникам — стадия pre-launch.",
    "project.medkompas.imageAlt":
      "Главная MedKompas — поиск, статистика по регионам, список из 17 врачей",
    "project.medkompas.b1":
      "На клиенте — Vite + React 19 + TypeScript. Один флоу (карта + бронирование), без SSR-гимнастики поверх MapLibre.",
    "project.medkompas.b2":
      "На сервере — Express + Prisma + Postgres. JWT + bcrypt + rate-limit написал с нуля, без чёрного ящика RLS.",
    "project.medkompas.b3":
      "MapLibre + пайплайн ETL для OSM на Python (~800 строк) вместо Google Maps. Бесплатные тайлы, своя стилистика, никакого вендор-лока.",
    "project.medkompas.b4":
      "i18next для RU/EN, CN/AR — на очереди. Медицинский туризм двусторонний.",
    "project.medkompas.b5":
      "Хостинг Beget, Apache + .htaccess. Клиникам важен TLS на российских серверах.",

    "project.newforms.role": "Соло-разработчик · сайд-проект OVERKON",
    "project.newforms.timeline": "В активной разработке (июль 2026)",
    "project.newforms.summary":
      "SaaS для аналитики форм для команд, которым уже мало Google Forms, но платить как за Typeform не хочется. Держу AI-стек в форме между релизами MedKompas.",
    "project.newforms.imageAlt":
      "Мокап дашборда newforms — статистика ответов, спарклайн за 14 дней, таблица",
    "project.newforms.b1":
      "Next.js 16 с App Router + Server Actions. Auth.js для magic-link и OAuth.",
    "project.newforms.b2":
      "Prisma с философией одной миграции. Каждое изменение схемы читается руками до прода.",
    "project.newforms.b3":
      "TanStack Table для просмотра ответов. Виртуализация, клавиатурная навигация, экспорт.",
    "project.newforms.b4":
      "Свой путь CSV/JSON-экспорта — без сторонних аналитических вендоров.",

    "project.claude-md-generator.role": "Автор",
    "project.claude-md-generator.timeline": "Собрано в июле 2026 · MIT",
    "project.claude-md-generator.summary":
      "Самый большой рычаг для качества вывода Claude Code — хорошо написанный CLAUDE.md. Большинство разработчиков либо пропускают его, либо копируют устаревший шаблон. Инструмент задаёт пару вопросов про стек и стадию — и выдаёт годный CLAUDE.md, который можно кинуть в репозиторий.",
    "project.claude-md-generator.imageAlt":
      "Интерфейс CLAUDE.md Generator — форма + живой markdown-предпросмотр",
    "project.claude-md-generator.b1":
      "Модульно по стеку: Next.js, Prisma, Auth.js, MapLibre, Express, TanStack Table, Python ETL.",
    "project.claude-md-generator.b2":
      "Правила подстраиваются под стадию (предзапуск, рост, зрелость) — один и тот же промпт не годится и для прототипа без пользователей, и для Series-B кодовой базы.",
    "project.claude-md-generator.b3":
      "Явные ограждения против известных фейлов Claude: переусложнение нормализации, ретрай-штормы, генерируемая авторизация, раздувание docstring.",
    "project.claude-md-generator.b4":
      "Копирование или скачивание в один клик. Без регистрации и трекинга.",

    "project.remote-work-radar.role": "Автор",
    "project.remote-work-radar.timeline": "Начато в июле 2026 · MIT",
    "project.remote-work-radar.summary":
      "OSS-агрегатор вакансий для разработчиков, отрезанных от Upwork, Mercor, Deel и Contra. Собирает фиды remote-first, которые не гейткипят по стране, по умолчанию фильтрует US-only, помечает мошеннические паттерны и шиплит режим для новичков с объяснениями для тех, кто пишет первое cover letter.",
    "project.remote-work-radar.imageAlt":
      "Страница /jobs remote-work-radar — фильтруемый список из 540 удалённых вакансий с бейджами entry-level и скам",
    "project.remote-work-radar.b1":
      "Монорепо: веб-приложение на Next.js 16, ETL на Python 3.13, пакет схемы Prisma + Postgres.",
    "project.remote-work-radar.b2":
      "Три живых источника на релизе: WeWorkRemotely RSS, RemoteOK JSON API, HN «Who is hiring?» через Algolia search-by-date. 440 уникальных вакансий на первом пулле.",
    "project.remote-work-radar.b3":
      "Детерминированный дедуп — hash(нормализованное имя + нормализованная компания). Одна и та же вакансия с двух бордов превращается в одну строку Job с двумя ссылками на источник.",
    "project.remote-work-radar.b4":
      "Beginner mode — не флаг, а дефолт. Глоссарий про почасовку и ретейнеры, 4 шаблона cover letter без выпендрёжа, детектор скама помечает запросы «плата за обучение».",
    "project.remote-work-radar.b5":
      "MCP-сервер в планах, чтобы Claude Code мог искать, оценивать fit и черновиком писать заявки поверх той же БД.",
  },
} as const;

type Key = keyof typeof dict.en;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  // ponytail: accepts arbitrary strings so dynamic keys (`project.${slug}.summary`)
  // don't need casts. Falls back to key name if missing, so a typo is visible
  // instead of silent. Tighten to `Key` if fat-fingered keys become a problem.
  t: (k: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // ponytail: SSR always renders EN; on mount we swap to the stored value.
  // Users with lang=ru see a brief EN flash on first paint. Upgrade to a
  // cookie-based server default if that ever becomes a real complaint.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ru" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t = (k: string): string => {
    const kk = k as Key;
    return dict[lang][kk] ?? dict.en[kk] ?? k;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error("useLang must be used inside <LanguageProvider>");
  return c;
}

export function useT(): (k: string) => string {
  return useLang().t;
}
