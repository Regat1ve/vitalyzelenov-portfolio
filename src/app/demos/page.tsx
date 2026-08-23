import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Демо-работы — Vitaly Zelenov",
  description:
    "Четыре рабочих демо: 3D-витрина на React Three Fiber, аналитический дашборд, интернет-магазин с корзиной и онлайн-запись на услугу.",
};

const DEMOS = [
  {
    href: "/demos/aurora",
    name: "AURORA",
    kind: "3D · WebGL",
    title: "Витрина продукта со скролл-анимацией",
    body:
      "Процедурная сцена на React Three Fiber: шейдерная деформация геометрии, поле частиц, движение камеры и палитра, привязанные к прокрутке. Ни одной внешней модели и ни одного HDR — страница не ждёт ассетов.",
    stack: ["React Three Fiber", "Three.js", "WebGL", "Next.js 16"],
    from: "#2e1065",
    to: "#7c3aed",
  },
  {
    href: "/demos/pulse",
    name: "PULSE",
    kind: "Дашборд · B2B",
    title: "Аналитика продаж для внутренней команды",
    body:
      "Метрики с динамикой, график выручки с кроссхейром и всплывающей подсказкой, разбивка по каналам, таблица заказов с сортировкой, поиском и фильтром по статусу. Палитра проверена на дальтонизм.",
    stack: ["React", "SVG-графики без библиотек", "TypeScript"],
    from: "#0c4a6e",
    to: "#3987e5",
  },
  {
    href: "/demos/kori",
    name: "KŌRI",
    kind: "E-commerce",
    title: "Магазин предметов для дома",
    body:
      "Каталог с фильтрами по категории, цене и наличию, три режима сортировки. Корзина живёт между визитами, считает промокод и порог бесплатной доставки. Товара нет в наличии — кнопка честно заблокирована.",
    stack: ["React", "localStorage", "Tailwind"],
    from: "#7c2d12",
    to: "#f97316",
  },
  {
    href: "/demos/atelier",
    name: "ATELIER",
    kind: "Заявки · Лидогенерация",
    title: "Онлайн-запись в четыре шага",
    body:
      "Услуга, мастер, календарь на две недели со свободными слотами, контакты. Маска и валидация телефона, блокировка занятого времени, экран подтверждения со сводкой заказа.",
    stack: ["React", "Многошаговая форма", "Валидация"],
    from: "#134e4a",
    to: "#14b8a6",
  },
];

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
      <header className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight hover:opacity-70">
            vitaly.dev
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-xs transition-colors hover:border-[color:var(--color-accent)]"
          >
            Написать
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-accent)]">
          Демо-работы
        </p>
        <h1 className="mb-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Четыре интерфейса, которые можно потрогать
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
          Это не картинки из Figma. Каждый экран — работающий код: данные считаются, фильтры
          фильтруют, корзина помнит содержимое, форма проверяет телефон. Открывайте и кликайте.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {DEMOS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] transition-colors hover:border-[color:var(--color-accent)]"
            >
              <div
                className="relative flex h-40 items-end p-5"
                style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})` }}
              >
                <span className="absolute right-5 top-5 rounded-full bg-black/25 px-3 py-1 text-xs text-white/85">
                  {d.kind}
                </span>
                <span className="text-2xl font-semibold tracking-[0.2em] text-white">{d.name}</span>
              </div>
              <div className="p-5">
                <h2 className="mb-2 text-lg font-medium">{d.title}</h2>
                <p className="mb-4 text-sm leading-relaxed text-[color:var(--color-muted)]">{d.body}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {d.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1 font-mono text-[11px] text-[color:var(--color-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-[color:var(--color-accent)]">
                  Открыть демо →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-14 text-center text-sm text-[color:var(--color-muted)]">
          Все четыре собраны с нуля под этот раздел.{" "}
          <Link href="/#contact" className="underline underline-offset-4">
            Обсудить свою задачу →
          </Link>
        </p>
      </main>
    </div>
  );
}
