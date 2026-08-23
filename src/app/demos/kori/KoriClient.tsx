"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  cat: "Керамика" | "Текстиль" | "Свет" | "Дерево";
  price: number;
  old?: number;
  stock: number;
  rating: number;
  from: string;
  to: string;
};

const PRODUCTS: Product[] = [
  { id: "k1", name: "Чаша Kumo", cat: "Керамика", price: 3400, stock: 12, rating: 4.8, from: "#e0e7ff", to: "#a5b4fc" },
  { id: "k2", name: "Кружка Suna", cat: "Керамика", price: 1900, old: 2400, stock: 4, rating: 4.6, from: "#fde68a", to: "#f59e0b" },
  { id: "k3", name: "Ваза Hoshi", cat: "Керамика", price: 6800, stock: 0, rating: 4.9, from: "#bbf7d0", to: "#34d399" },
  { id: "t1", name: "Плед Yuki", cat: "Текстиль", price: 8900, stock: 7, rating: 4.7, from: "#fecdd3", to: "#fb7185" },
  { id: "t2", name: "Полотенце Nami", cat: "Текстиль", price: 1200, stock: 40, rating: 4.4, from: "#bae6fd", to: "#38bdf8" },
  { id: "t3", name: "Подушка Mori", cat: "Текстиль", price: 3200, old: 3900, stock: 9, rating: 4.5, from: "#ddd6fe", to: "#8b5cf6" },
  { id: "l1", name: "Лампа Akari", cat: "Свет", price: 12400, stock: 3, rating: 5.0, from: "#fef3c7", to: "#fbbf24" },
  { id: "l2", name: "Бра Kage", cat: "Свет", price: 7600, stock: 5, rating: 4.3, from: "#e2e8f0", to: "#94a3b8" },
  { id: "d1", name: "Поднос Ki", cat: "Дерево", price: 4100, stock: 15, rating: 4.6, from: "#fed7aa", to: "#fb923c" },
  { id: "d2", name: "Табурет Hira", cat: "Дерево", price: 15800, old: 18500, stock: 2, rating: 4.8, from: "#d9f99d", to: "#84cc16" },
  { id: "d3", name: "Полка Tana", cat: "Дерево", price: 9900, stock: 0, rating: 4.2, from: "#cffafe", to: "#22d3ee" },
  { id: "k4", name: "Тарелка Ame", cat: "Керамика", price: 2600, stock: 22, rating: 4.5, from: "#f5d0fe", to: "#e879f9" },
];

const CATS = ["Все", "Керамика", "Текстиль", "Свет", "Дерево"] as const;
const SORTS = [
  { k: "pop", label: "По популярности" },
  { k: "asc", label: "Сначала дешевле" },
  { k: "desc", label: "Сначала дороже" },
] as const;

const CART_KEY = "kori-cart-v1";
const money = (n: number) => n.toLocaleString("ru-RU") + " ₽";
const PROMOS: Record<string, number> = { KORI10: 0.1, HELLO: 0.05 };
const FREE_FROM = 15_000;

export function KoriClient() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Все");
  const [sort, setSort] = useState<(typeof SORTS)[number]["k"]>("pop");
  const [maxPrice, setMaxPrice] = useState(16000);
  const [inStock, setInStock] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  // ref, а не state: флаг «гидрация прошла» не должен вызывать перерисовку
  const hydrated = useRef(false);

  // корзина переживает перезагрузку — но localStorage может быть недоступен
  useEffect(() => {
    try {
      // Поднять сохранённую корзину можно только после гидрации: на сервере localStorage
      // нет, а чтение в первом рендере разошлось бы с серверной разметкой.
      const raw = localStorage.getItem(CART_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* приватный режим или заблокированные куки — просто стартуем с пустой корзиной */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* не критично: корзина живёт в памяти до перезагрузки */
    }
  }, [cart]);

  const list = useMemo(() => {
    const f = PRODUCTS.filter(
      (p) =>
        (cat === "Все" || p.cat === cat) && p.price <= maxPrice && (!inStock || p.stock > 0)
    );
    if (sort === "asc") return [...f].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...f].sort((a, b) => b.price - a.price);
    return [...f].sort((a, b) => b.rating - a.rating);
  }, [cat, sort, maxPrice, inStock]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id)!, qty }))
        .filter((l) => l.p),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const discount = applied ? Math.round(subtotal * PROMOS[applied]) : 0;
  const shipping = subtotal === 0 || subtotal - discount >= FREE_FROM ? 0 : 490;
  const total = subtotal - discount + shipping;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, PRODUCTS.find((p) => p.id === id)?.stock ?? 99);
      return next;
    });

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1c1917]">
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold tracking-[0.2em]">KŌRI</span>
            <span className="hidden text-xs text-[#78716c] sm:inline">предметы для дома</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/demos"
              className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-[#57534e] transition-colors hover:border-black/30 hover:text-black"
            >
              ← Все демо
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative rounded-full bg-[#1c1917] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Корзина
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f97316] px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-4 pt-10">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Вещи, которые переживут моду
        </h1>
        <p className="mt-3 max-w-lg text-[#57534e]">
          Небольшие тиражи, честные материалы. Доставка от {money(FREE_FROM)} — бесплатно.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-black/[0.07] py-4">
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  cat === c ? "bg-[#1c1917] text-white" : "bg-black/[0.04] text-[#57534e] hover:bg-black/[0.08]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="ml-auto flex items-center gap-2 text-sm text-[#57534e]">
            До {money(maxPrice)}
            <input
              type="range"
              min={1000}
              max={16000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-32 accent-[#1c1917]"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[#57534e]">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 accent-[#1c1917]"
            />
            В наличии
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#1c1917]"
          >
            {SORTS.map((s) => (
              <option key={s.k} value={s.k}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-[#78716c]">Найдено: {list.length}</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
              <div
                className="relative flex aspect-[4/3] items-center justify-center"
                style={{ background: `linear-gradient(140deg, ${p.from}, ${p.to})` }}
              >
                <span className="text-6xl font-light text-white/70 transition-transform duration-500 group-hover:scale-110">
                  {p.name.split(" ")[1]?.[0] ?? p.name[0]}
                </span>
                {p.old && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#f97316] px-2.5 py-1 text-xs font-medium text-white">
                    −{Math.round((1 - p.price / p.old) * 100)} %
                  </span>
                )}
                {p.stock === 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
                    Нет в наличии
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-medium">{p.name}</h3>
                  <span className="shrink-0 text-xs text-[#78716c]">★ {p.rating.toFixed(1)}</span>
                </div>
                <p className="mb-3 text-xs text-[#78716c]">{p.cat}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold">{money(p.price)}</span>
                    {p.old && <span className="text-sm text-[#a8a29e] line-through">{money(p.old)}</span>}
                  </div>
                  <button
                    disabled={p.stock === 0}
                    onClick={() => add(p.id)}
                    className="rounded-full bg-[#1c1917] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-[#a8a29e]"
                  >
                    {cart[p.id] ? `В корзине · ${cart[p.id]}` : "В корзину"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-16 text-center text-[#78716c]">Под эти фильтры ничего не подошло</p>
        )}

        <p className="mt-14 text-center text-sm text-[#78716c]">
          Демо-проект.{" "}
          <Link href="/#contact" className="underline underline-offset-4 hover:text-black">
            Нужен такой магазин →
          </Link>
        </p>
      </div>

      {/* корзина */}
      {open && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4">
              <h2 className="text-lg font-semibold">Корзина</h2>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none text-[#78716c] hover:text-black">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 && <p className="py-16 text-center text-[#78716c]">Пока пусто</p>}
              <ul className="space-y-4">
                {lines.map(({ p, qty }) => (
                  <li key={p.id} className="flex gap-3">
                    <div
                      className="h-16 w-16 shrink-0 rounded-lg"
                      style={{ background: `linear-gradient(140deg, ${p.from}, ${p.to})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-[#78716c]">{money(p.price)} за штуку</p>
                      <div className="mt-2 inline-flex items-center rounded-full border border-black/10">
                        <button onClick={() => setQty(p.id, qty - 1)} className="px-3 py-1 hover:bg-black/[0.04]">−</button>
                        <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                        <button onClick={() => setQty(p.id, qty + 1)} className="px-3 py-1 hover:bg-black/[0.04]">+</button>
                      </div>
                    </div>
                    <span className="font-medium tabular-nums">{money(p.price * qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lines.length > 0 && (
              <div className="space-y-3 border-t border-black/[0.07] px-5 py-4">
                <div className="flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value.toUpperCase())}
                    placeholder="Промокод (KORI10)"
                    className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#1c1917]"
                  />
                  <button
                    onClick={() => setApplied(PROMOS[promo] ? promo : null)}
                    className="rounded-md border border-black/10 px-4 text-sm hover:bg-black/[0.04]"
                  >
                    Применить
                  </button>
                </div>
                {promo && !PROMOS[promo] && <p className="text-xs text-rose-600">Такого промокода нет</p>}
                {applied && <p className="text-xs text-emerald-600">Промокод {applied} применён</p>}

                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#57534e]">Товары</dt>
                    <dd className="tabular-nums">{money(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>Скидка</dt>
                      <dd className="tabular-nums">−{money(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[#57534e]">Доставка</dt>
                    <dd className="tabular-nums">{shipping === 0 ? "бесплатно" : money(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-black/[0.07] pt-2 text-base font-semibold">
                    <dt>Итого</dt>
                    <dd className="tabular-nums">{money(total)}</dd>
                  </div>
                </dl>

                {shipping > 0 && (
                  <p className="text-xs text-[#78716c]">
                    Добавьте товаров на {money(FREE_FROM - (subtotal - discount))} — и доставка станет бесплатной
                  </p>
                )}

                <button className="w-full rounded-full bg-[#1c1917] py-3 font-medium text-white transition-opacity hover:opacity-90">
                  Оформить заказ
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
