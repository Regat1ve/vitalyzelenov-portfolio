"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { setAuroraScroll } from "@/components/demos/AuroraScene";

// WebGL only makes sense in the browser, and it is 600 KB — keep it out of the first load.
const AuroraScene = dynamic(
  () => import("@/components/demos/AuroraScene").then((m) => m.AuroraScene),
  { ssr: false }
);

const CHAPTERS = [
  {
    kicker: "01 — Материал",
    title: "Форма, которая дышит",
    body:
      "Геометрия деформируется шейдером в реальном времени: смещение вершин по шуму, никакой предзаписанной анимации. Двенадцать тысяч полигонов держат шестьдесят кадров даже на встроенной графике.",
  },
  {
    kicker: "02 — Свет",
    title: "Три источника, ноль текстур",
    body:
      "Ни одной внешней модели и ни одного HDR-файла. Вся картинка собрана процедурно — значит страница весит меньше и не ждёт загрузки ассетов перед первым кадром.",
  },
  {
    kicker: "03 — Скролл",
    title: "Прокрутка как раскадровка",
    body:
      "Позиция скролла — единственный вход в сцену. Камера отъезжает и поднимается, деформация растёт, палитра перетекает из фиолетового в янтарный. Курсор добавляет параллакс.",
  },
  {
    kicker: "04 — Итог",
    title: "Готово к продукту",
    body:
      "Тот же каркас принимает вашу модель из Blender, конфигуратор цветов или разбор товара по слоям. Сцена, интерфейс и контент разделены — контент правится без касания 3D.",
  },
];

export function AuroraClient() {
  const wrap = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = wrap.current;
        if (!el) return;
        const total = el.scrollHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        setAuroraScroll(p);
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="relative bg-[#05030f] text-white">
      {/* glow behind the canvas — cheaper than a bloom pass */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute left-1/3 top-1/4 h-[40vmin] w-[40vmin] rounded-full bg-fuchsia-500/20 blur-[100px]" />
      </div>

      <div className="fixed inset-0 z-0">
        <AuroraScene />
      </div>

      {/* progress rail */}
      <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        {CHAPTERS.map((c, i) => (
          <span
            key={c.kicker}
            className="h-8 w-px bg-white/20"
            style={{
              backgroundColor:
                progress * (CHAPTERS.length - 1) >= i - 0.5 ? "rgba(196,181,253,0.9)" : undefined,
            }}
          />
        ))}
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-mono text-sm tracking-[0.3em] text-white/70">AURORA</span>
        <Link
          href="/demos"
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-white/50 hover:text-white"
        >
          ← Все демо
        </Link>
      </header>

      <section className="relative z-20 flex min-h-[92vh] flex-col justify-center px-6 sm:px-10">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-violet-300/80">
          Скролл-сторителлинг · WebGL
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          Продукт, который
          <br />
          показывает себя сам
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/60">
          Одна сцена на React Three Fiber, полностью управляемая прокруткой. Без видео, без
          спрайтов, без внешних моделей — только геометрия и свет.
        </p>
        <div className="mt-10 flex items-center gap-3 text-xs text-white/40">
          <span className="h-8 w-5 rounded-full border border-white/25 p-1">
            <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
          </span>
          Крутите вниз
        </div>
      </section>

      {CHAPTERS.map((c, i) => (
        <section
          key={c.kicker}
          className={`relative z-20 flex min-h-screen items-center px-6 sm:px-10 ${
            i % 2 ? "justify-end" : ""
          }`}
        >
          <div className="max-w-md rounded-2xl border border-white/10 bg-black/35 p-7 backdrop-blur-md sm:p-9">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-violet-300/80">
              {c.kicker}
            </p>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h2>
            <p className="leading-relaxed text-white/60">{c.body}</p>
          </div>
        </section>
      ))}

      <footer className="relative z-20 border-t border-white/10 px-6 py-14 text-center sm:px-10">
        <p className="mb-2 text-sm text-white/40">
          Демо-проект. React Three Fiber · Next.js 16 · Tailwind
        </p>
        <Link href="/#contact" className="text-lg font-medium underline underline-offset-4">
          Собрать такое же под ваш продукт →
        </Link>
      </footer>
    </div>
  );
}
