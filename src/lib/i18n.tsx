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
    "hero.badge.availability": "Open for contract · $30–50/hr",
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
      "I started coding seriously in March 2026. Instead of grinding tutorials for a year, I picked a real problem — my mom’s medical clinic needed a marketplace — and shipped it with Claude Code alongside me. Four months later MedKompas is onboarding partner clinics.",
    "about.p2":
      "The uncomfortable truth is that AI writes a lot of good code and even more code you should never merge. My advantage is not typing speed. It is knowing what to keep, what to cut, and what Claude cannot decide for you: schema shape, auth boundaries, the trade-offs a co-founder actually cares about.",
    "about.p3.pre": "I am opening my calendar for contract and freelance work with founders who want someone to ",
    "about.p3.em": "ship",
    "about.p3.post": ", not to babysit tooling.",

    // Projects section
    "projects.eyebrow": "Projects",
    "projects.headline": "Four things I shipped this year.",
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

    // FAQ
    "faq.eyebrow": "FAQ",
    "faq.headline": "Questions founders actually ask.",
    "faq.q1.q": "Are you actually only 4 months in?",
    "faq.q1.a":
      "Yes. First serious line of code was March 2026. What compresses the timeline is not talent — it is Claude Code + tight scope + reviewing every diff. I still miss things a five-year veteran wouldn’t, and I say so up front.",
    "faq.q2.q": "Do you just prompt-engineer while Claude does everything?",
    "faq.q2.a":
      "No. Claude ships boilerplate, first-draft components, and glue code fast. I own schema decisions, auth boundaries, and every merge review. On MedKompas I deleted ~40% of what Claude wrote on the first pass. Discipline is the leverage.",
    "faq.q3.q": "What’s your rate?",
    "faq.q3.a":
      "$30–50/hr depending on scope and length. Prefer 1-week paid trial → month-to-month contract. Fixed-price for well-scoped tickets. Currency: USDC via Bybit or wire transfer.",
    "faq.q4.q": "You’re in Russia. How do payments work?",
    "faq.q4.a":
      "Bybit USDC works globally. Wise wire works for most EU/US clients. I do not touch Payoneer or PayPal. Invoices in USD, standard NET-30 or NET-7 for smaller engagements.",
    "faq.q5.q": "Timezone overlap?",
    "faq.q5.a":
      "UTC+3 (Nizhny Novgorod). Comfortable overlap window with EU business hours all day and US East Coast until 24:00 MSK. Not stretching to US Pacific — quality drops after midnight my time.",
    "faq.q6.q": "What kind of work do you want?",
    "faq.q6.a":
      "Founders who need a full flow shipped end-to-end — auth, data model, main feature, deploy. Or a founding engineer role at a pre-seed / seed startup. Not interested in agencies subcontracting to me at half rate.",

    // Contact
    "contact.eyebrow": "Contact",
    "contact.headline": "Want someone to actually ship it?",
    "contact.body":
      "Available for contract & freelance. Comfortable with EU and US East Coast hours. Best routes below — email or LinkedIn get the fastest answer.",

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
      "Healthtech marketplace for medical tourism inside Russia. Map + filters + booking flow, connecting clinics with domestic and inbound patients. Onboarding first partner clinics right now.",
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
    "nav.methodology": "Методология",
    "nav.faq": "FAQ",
    "nav.tools": "Инструменты",
    "nav.contact": "Контакты",

    // Theme + language toggle a11y
    "toggle.theme.light": "Переключить на светлую тему",
    "toggle.theme.dark": "Переключить на тёмную тему",
    "toggle.lang.aria": "Переключить язык",

    // Hero
    "hero.location": "Нижний Новгород, Россия · UTC+3",
    "hero.greeting": "Привет, я Виталий.",
    "hero.tagline": "Делаю реальные продукты в паре с Claude Code.",
    "hero.pitch":
      "Full-stack разработчик, четыре месяца в деле. Работаю с AI как с коллегой, а не как с игрушкой. Два продукта в проде или на предзапуске, один открытый инструмент в открытом доступе, и привычка резать всё, что не должно доехать до релиза.",
    "hero.badge.availability": "Открыт к контракту · $30–50/час",
    "hero.badge.remote": "Удалённо · часы ЕС и восточное побережье США",
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
      "Всерьёз начал кодить в марте 2026-го. Вместо года туториалов взял реальную задачу — маркетплейс для клиники моей мамы — и вытащил его вместе с Claude Code. Через четыре месяца MedKompas уже подключает партнёрские клиники.",
    "about.p2":
      "Правда в том, что AI пишет много хорошего кода и ещё больше кода, который никогда не стоит мёржить. Моё преимущество — не скорость набора. Это понимание, что оставить, что вырезать, и что Claude за тебя не решит: форма схемы, границы авторизации, компромиссы, которые волнуют реального сооснователя.",
    "about.p3.pre":
      "Открываю календарь для контрактной и фриланс-работы с основателями, которым нужен человек, который ",
    "about.p3.em": "шипит",
    "about.p3.post": ", а не нянчит инструменты.",

    // Projects section
    "projects.eyebrow": "Проекты",
    "projects.headline": "Четыре штуки, которые я выпустил в этом году.",
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

    // FAQ
    "faq.eyebrow": "FAQ",
    "faq.headline": "Вопросы, которые реально задают основатели.",
    "faq.q1.q": "Ты правда всего 4 месяца в деле?",
    "faq.q1.a":
      "Да. Первая серьёзная строчка кода — март 2026-го. Сроки сжимает не талант, а Claude Code + узкий скоуп + ревью каждого диффа. Я всё ещё пропускаю то, что не пропустил бы ветеран с пятью годами опыта, и говорю об этом честно с самого начала.",
    "faq.q2.q": "Ты просто промптишь, а Claude делает всё за тебя?",
    "faq.q2.a":
      "Нет. Claude быстро выдаёт бойлерплейт, первые драфты компонентов и склеивающий код. Решения по схеме, границы авторизации и ревью каждого мёржа — на мне. На MedKompas я удалил ~40% того, что Claude выдал первым заходом. Дисциплина — вот рычаг.",
    "faq.q3.q": "Какая ставка?",
    "faq.q3.a":
      "$30–50/час в зависимости от скоупа и длины проекта. Предпочитаю недельный платный триал → месячный контракт. Fixed-price для чётко скоупированных задач. Валюта: USDC через Bybit или SWIFT.",
    "faq.q4.q": "Ты из России. Как с оплатой?",
    "faq.q4.a":
      "Bybit USDC работает по всему миру. Wise-перевод подходит большинству клиентов из ЕС и США. Payoneer и PayPal не трогаю. Инвойсы в USD, стандартный NET-30 или NET-7 для мелких контрактов.",
    "faq.q5.q": "Как со временем?",
    "faq.q5.a":
      "UTC+3 (Нижний Новгород). Комфортное окно — весь рабочий день ЕС и восточное побережье США до 24:00 МСК. До Западного побережья не тянусь — качество падает после полуночи.",
    "faq.q6.q": "Какую работу ищешь?",
    "faq.q6.a":
      "Основателей, которым нужен полный флоу под ключ — авторизация, модель данных, основная фича, деплой. Или роль founding engineer в pre-seed / seed-стартапе. Работать через агентство за половину ставки — не интересно.",

    // Contact
    "contact.eyebrow": "Контакты",
    "contact.headline": "Нужен человек, который реально доведёт до релиза?",
    "contact.body":
      "Открыт к контракту и фрилансу. Часы ЕС и восточного побережья США — норм. Самые быстрые каналы — почта и LinkedIn.",

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
    "project.medkompas.timeline": "4 месяца, part-time (март–июль 2026)",
    "project.medkompas.summary":
      "Healthtech-маркетплейс для медицинского туризма внутри России. Карта + фильтры + бронирование, связывает клиники с российскими и въездными пациентами. Прямо сейчас подключаем первые партнёрские клиники.",
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
