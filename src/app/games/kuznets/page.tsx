import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "КУЗНЕЦ — merge-игра на физике",
  description:
    "Роняй заготовки, сплавляй одинаковые от меди до мифрила. Полный жар даёт удар молотом, который сваривает выбранный слиток с ближайшим таким же. Vanilla JS + matter.js, без сборки.",
  openGraph: {
    title: "КУЗНЕЦ — merge-игра на физике",
    description:
      "Кузнечный merge на matter.js: восемь металлов, механика перековки, таблица рекордов. Играется в браузере и на телефоне.",
    type: "website",
  },
};

// Игра — самостоятельный статический бандл в public/, чтобы тот же файл
// без правок уезжал в архив Яндекс.Игр. Здесь только рамка и метаданные.
export default function KuznetsPage() {
  return (
    <div className="flex h-dvh flex-col bg-[#0b0908]">
      <header className="flex flex-none items-center justify-between border-b border-white/10 px-4 py-2">
        <Link href="/" className="font-mono text-sm font-semibold text-white/80 hover:text-white">
          vitaly.dev
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-white/35 sm:inline">
            Vanilla JS · matter.js
          </span>
          <Link
            href="/projects/kuznets"
            className="rounded-full border border-white/15 px-3.5 py-1 text-xs text-white/75 transition-colors hover:border-[#ff7a18] hover:text-white"
          >
            Как сделано
          </Link>
        </div>
      </header>

      <iframe
        src="/games/kuznets/index.html"
        title="КУЗНЕЦ"
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}
