"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/* ---------- детерминированные данные: сид, чтобы SSR и клиент совпадали ---------- */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Day = { d: string; now: number; prev: number };

function buildSeries(days: number): Day[] {
  const rnd = mulberry32(20260823 + days);
  const out: Day[] = [];
  const start = new Date(Date.UTC(2026, 7, 23) - (days - 1) * 86400000);
  let base = 780_000;
  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    base += (rnd() - 0.45) * 42_000;
    const season = 1 + Math.sin(i / 6) * 0.09;
    const now = Math.max(220_000, base * season * (weekend ? 0.72 : 1));
    out.push({
      d: date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", timeZone: "UTC" }),
      now: Math.round(now),
      prev: Math.round(now * (0.78 + rnd() * 0.24)),
    });
  }
  return out;
}

const CHANNELS = [
  { name: "Органический поиск", v: 4_180_000 },
  { name: "Прямые заходы", v: 3_240_000 },
  { name: "Email-рассылка", v: 2_110_000 },
  { name: "Партнёры", v: 1_460_000 },
  { name: "Соцсети", v: 980_000 },
  { name: "Платная реклама", v: 640_000 },
];

type Status = "Оплачен" | "В сборке" | "Отправлен" | "Возврат";

const STATUS_STYLE: Record<Status, string> = {
  "Оплачен": "bg-emerald-500/12 text-emerald-300 ring-emerald-500/25",
  "В сборке": "bg-amber-500/12 text-amber-300 ring-amber-500/25",
  "Отправлен": "bg-sky-500/12 text-sky-300 ring-sky-500/25",
  "Возврат": "bg-rose-500/12 text-rose-300 ring-rose-500/25",
};

type Order = {
  id: string;
  client: string;
  city: string;
  status: Status;
  sum: number;
  items: number;
};

const ORDERS: Order[] = (() => {
  const rnd = mulberry32(77);
  const names = [
    "Альфа-Групп", "Северный Дом", "Ритм", "Мануфактура 12", "Овента", "Крафт-Лаб",
    "Дельта Трейд", "Мосткрепёж", "Гринвуд", "Ясная Логистика", "Пик", "Сатурн-НН",
    "Белый Куб", "Реаком", "Тонус", "Аквилон",
  ];
  const cities = ["Москва", "Санкт-Петербург", "Нижний Новгород", "Казань", "Екатеринбург", "Новосибирск"];
  const statuses: Status[] = ["Оплачен", "В сборке", "Отправлен", "Возврат"];
  return names.map((client, i) => ({
    id: "ORD-" + (48210 + i * 7),
    client,
    city: cities[Math.floor(rnd() * cities.length)],
    status: statuses[Math.floor(rnd() * (rnd() > 0.82 ? 4 : 3))],
    sum: Math.round((18_000 + rnd() * 340_000) / 100) * 100,
    items: 1 + Math.floor(rnd() * 9),
  }));
})();

const money = (n: number) => n.toLocaleString("ru-RU") + " ₽";
const compact = (n: number) =>
  n === 0 ? "0" : n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(".", ",") + " млн" : Math.round(n / 1000) + " тыс";

/* ---------- график: две линии + кроссхейр ---------- */
function TrendChart({ data }: { data: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 260;
  const PAD = { t: 16, r: 56, b: 26, l: 8 };
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const max = Math.max(...data.flatMap((d) => [d.now, d.prev])) * 1.08;
  const x = (i: number) => PAD.l + (i / (data.length - 1)) * iw;
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const path = (k: "now" | "prev") =>
    data.map((d, i) => (i ? "L" : "M") + x(i).toFixed(1) + "," + y(d[k]).toFixed(1)).join(" ");
  const area = path("now") + " L" + x(data.length - 1) + "," + (PAD.t + ih) + " L" + x(0) + "," + (PAD.t + ih) + " Z";
  const last = data[data.length - 1];
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Выручка по дням: текущий и прошлый период"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - PAD.l) / iw) * (data.length - 1));
          setHover(Math.min(data.length - 1, Math.max(0, i)));
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={PAD.l + iw} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,.07)" />
            <text x={PAD.l + iw + 8} y={y(t) + 4} fill="#8b8b85" fontSize="10">
              {compact(t)}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="pulse-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3987e5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3987e5" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={area} fill="url(#pulse-fill)" />
        <path d={path("prev")} fill="none" stroke="#d95926" strokeWidth="2" strokeDasharray="5 4" />
        <path d={path("now")} fill="none" stroke="#3987e5" strokeWidth="2" strokeLinecap="round" />

        <circle cx={x(data.length - 1)} cy={y(last.now)} r="4" fill="#3987e5" stroke="#0b0b0d" strokeWidth="2" />

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ih} stroke="rgba(255,255,255,.28)" />
            <circle cx={x(hover)} cy={y(data[hover].now)} r="5" fill="#3987e5" stroke="#0b0b0d" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(data[hover].prev)} r="5" fill="#d95926" stroke="#0b0b0d" strokeWidth="2" />
          </g>
        )}

        <text x={PAD.l} y={H - 6} fill="#8b8b85" fontSize="10">{data[0].d}</text>
        <text x={PAD.l + iw} y={H - 6} fill="#8b8b85" fontSize="10" textAnchor="end">{last.d}</text>
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-3 rounded-lg border border-white/12 bg-[#101014]/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="mb-1.5 font-medium text-white">{data[hover].d}</div>
          <div className="flex items-center gap-2 whitespace-nowrap text-[#c3c2b7]">
            <span className="h-2 w-2 rounded-sm" style={{ background: "#3987e5" }} />
            Текущий: <span className="text-white">{money(data[hover].now)}</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap text-[#c3c2b7]">
            <span className="h-2 w-2 rounded-sm" style={{ background: "#d95926" }} />
            Прошлый: <span className="text-white">{money(data[hover].prev)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- горизонтальные бары по каналам ---------- */
function ChannelBars() {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...CHANNELS.map((c) => c.v));
  return (
    <ul className="space-y-3">
      {CHANNELS.map((c, i) => (
        <li
          key={c.name}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className="grid grid-cols-[minmax(0,140px)_1fr_auto] items-center gap-3 text-sm"
        >
          <span className="truncate text-[#c3c2b7]">{c.name}</span>
          <span className="relative h-2.5 rounded-full bg-white/[0.06]">
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-opacity"
              style={{
                width: `${(c.v / max) * 100}%`,
                background: "#3987e5",
                opacity: hover === null || hover === i ? 1 : 0.45,
              }}
            />
          </span>
          <span className="tabular-nums text-white">{compact(c.v)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- страница ---------- */
const RANGES = [
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
  { label: "90 дней", days: 90 },
];

export function PulseClient() {
  const [days, setDays] = useState(30);
  const [status, setStatus] = useState<Status | "Все">("Все");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: keyof Order; dir: 1 | -1 }>({ k: "sum", dir: -1 });

  const series = useMemo(() => buildSeries(days), [days]);

  const kpi = useMemo(() => {
    const now = series.reduce((s, d) => s + d.now, 0);
    const prev = series.reduce((s, d) => s + d.prev, 0);
    const orders = Math.round(now / 24_800);
    return [
      { label: "Выручка", value: money(now), delta: (now / prev - 1) * 100 },
      { label: "Заказов", value: orders.toLocaleString("ru-RU"), delta: 8.4 },
      { label: "Средний чек", value: money(Math.round(now / orders)), delta: 3.1 },
      { label: "Возвраты", value: "2,7 %", delta: -0.6 },
    ];
  }, [series]);

  const rows = useMemo(() => {
    const f = ORDERS.filter(
      (o) =>
        (status === "Все" || o.status === status) &&
        (q.trim() === "" || (o.client + o.city + o.id).toLowerCase().includes(q.trim().toLowerCase()))
    );
    return [...f].sort((a, b) => {
      const A = a[sort.k];
      const B = b[sort.k];
      if (typeof A === "number" && typeof B === "number") return (A - B) * sort.dir;
      return String(A).localeCompare(String(B), "ru") * sort.dir;
    });
  }, [status, q, sort]);

  const toggle = (k: keyof Order) =>
    setSort((s) => (s.k === k ? { k, dir: (s.dir * -1) as 1 | -1 } : { k, dir: -1 }));

  // обычная функция, а не компонент: иначе React пересоздаёт его на каждый рендер
  const th = (k: keyof Order, label: string, right = false) => (
    <th key={k} className={`px-4 py-3 font-medium ${right ? "text-right" : ""}`}>
      <button onClick={() => toggle(k)} className="inline-flex items-center gap-1 hover:text-white">
        {label}
        <span className="text-[10px] opacity-60">{sort.k === k ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
      </button>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0b0b0d]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#3987e5] text-xs font-bold">P</span>
            <span className="font-semibold tracking-tight">Pulse Analytics</span>
          </div>
          <Link
            href="/demos"
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            ← Все демо
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Обзор продаж</h1>
            <p className="text-sm text-[#8b8b85]">Данные демонстрационные, обновление раз в час</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-white/10 p-1">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  days === r.days ? "bg-white/10 text-white" : "text-[#8b8b85] hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpi.map((k) => (
            <div key={k.label} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-[#8b8b85]">{k.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{k.value}</p>
              <p className={`mt-1 text-xs ${k.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta).toFixed(1).replace(".", ",")} % к прошлому периоду
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-medium">Выручка по дням</h2>
              <div className="flex gap-4 text-xs text-[#c3c2b7]">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded" style={{ background: "#3987e5" }} /> Текущий период
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded" style={{ background: "#d95926" }} /> Прошлый период
                </span>
              </div>
            </div>
            <TrendChart data={series} />
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <h2 className="mb-4 font-medium">Источники выручки</h2>
            <ChannelBars />
          </section>
        </div>

        <section className="rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] p-4">
            <h2 className="font-medium">Последние заказы</h2>
            <div className="flex flex-wrap gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Поиск по клиенту или номеру"
                className="w-56 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm outline-none placeholder:text-[#6f6f6a] focus:border-[#3987e5]"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status | "Все")}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm outline-none focus:border-[#3987e5]"
              >
                {["Все", "Оплачен", "В сборке", "Отправлен", "Возврат"].map((s) => (
                  <option key={s} value={s} className="bg-[#0b0b0d]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-[#8b8b85]">
                <tr className="border-b border-white/[0.08]">
                  {th("id", "Заказ")}
                  {th("client", "Клиент")}
                  {th("city", "Город")}
                  {th("status", "Статус")}
                  {th("items", "Позиций", true)}
                  {th("sum", "Сумма", true)}
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-mono text-xs text-[#8b8b85]">{o.id}</td>
                    <td className="px-4 py-3">{o.client}</td>
                    <td className="px-4 py-3 text-[#c3c2b7]">{o.city}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${STATUS_STYLE[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#c3c2b7]">{o.items}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{money(o.sum)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[#8b8b85]">
                      Ничего не нашлось
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="pb-6 text-center text-sm text-[#8b8b85]">
          Демо-проект.{" "}
          <Link href="/#contact" className="underline underline-offset-4 hover:text-white">
            Нужен такой дашборд под ваши данные →
          </Link>
        </p>
      </main>
    </div>
  );
}
