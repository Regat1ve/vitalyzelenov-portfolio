"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Service = { id: string; name: string; min: number; price: number; note: string };
type Master = { id: string; name: string; role: string; rating: number; hue: string };

const SERVICES: Service[] = [
  { id: "s1", name: "Мужская стрижка", min: 45, price: 2200, note: "Мойка, стрижка, укладка" },
  { id: "s2", name: "Стрижка + борода", min: 75, price: 3400, note: "Комплекс, горячее полотенце" },
  { id: "s3", name: "Камуфляж седины", min: 40, price: 1800, note: "Тонирование без аммиака" },
  { id: "s4", name: "Детская стрижка", min: 30, price: 1500, note: "До 12 лет, без записи по будням" },
];

const MASTERS: Master[] = [
  { id: "m1", name: "Егор", role: "Топ-барбер", rating: 4.9, hue: "#6366f1" },
  { id: "m2", name: "Тимур", role: "Барбер", rating: 4.7, hue: "#f97316" },
  { id: "m3", name: "Аня", role: "Колорист", rating: 5.0, hue: "#14b8a6" },
];

const SLOTS = ["10:00", "11:15", "12:30", "14:00", "15:15", "16:30", "17:45", "19:00"];
const WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const STEPS = ["Услуга", "Мастер", "Время", "Контакты"];

// Детерминированная «занятость»: одинаковая на сервере и в браузере.
function busy(dayKey: number, slotIndex: number, masterId: string) {
  const seed = dayKey * 31 + slotIndex * 7 + masterId.charCodeAt(1);
  return (seed * 2654435761) % 10 < 4;
}

const money = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export function AtelierClient() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [master, setMaster] = useState<Master | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  // 14 дней вперёд от фиксированной даты — чтобы демо выглядело одинаково у всех
  const days = useMemo(() => {
    const base = Date.UTC(2026, 7, 24);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base + i * 86400000);
      return {
        key: i,
        num: d.getUTCDate(),
        wd: WD[(d.getUTCDay() + 6) % 7],
        month: d.toLocaleDateString("ru-RU", { month: "long", timeZone: "UTC" }),
        weekend: d.getUTCDay() === 0,
      };
    });
  }, []);

  const digits = phone.replace(/\D/g, "");
  const phoneOk = digits.length === 11;
  const nameOk = name.trim().length >= 2;

  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
    if (!d) return "";
    const p = ["+7"];
    if (d.length > 1) p.push(" (" + d.slice(1, 4));
    if (d.length >= 4) p.push(") " + d.slice(4, 7));
    if (d.length >= 7) p.push("-" + d.slice(7, 9));
    if (d.length >= 9) p.push("-" + d.slice(9, 11));
    return p.join("");
  };

  const canNext = [!!service, !!master, day !== null && !!slot, nameOk && phoneOk][step];
  const chosenDay = days.find((d) => d.key === day);

  if (done) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0f0f10] px-5 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">
            ✓
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Записали</h1>
          <p className="mb-6 text-white/60">
            {chosenDay?.num} {chosenDay?.month}, {slot} · {master?.name}
          </p>
          <dl className="mb-6 space-y-2 rounded-xl bg-white/[0.04] p-4 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-white/50">Услуга</dt>
              <dd>{service?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Длительность</dt>
              <dd>{service?.min} мин</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Клиент</dt>
              <dd>{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Телефон</dt>
              <dd>{phone}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
              <dt>К оплате в салоне</dt>
              <dd>{money(service?.price ?? 0)}</dd>
            </div>
          </dl>
          <p className="mb-6 text-xs text-white/40">
            Это демонстрация — заявка никуда не ушла. В боевой версии здесь letter в CRM,
            SMS клиенту и напоминание за два часа.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDone(false);
                setStep(0);
                setService(null);
                setMaster(null);
                setDay(null);
                setSlot(null);
                setName("");
                setPhone("");
                setComment("");
                setTouched(false);
              }}
              className="flex-1 rounded-full border border-white/15 py-3 text-sm hover:border-white/40"
            >
              Записаться ещё раз
            </button>
            <Link href="/demos" className="flex-1 rounded-full bg-white py-3 text-center text-sm font-medium text-black">
              Все демо
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <span className="text-lg font-semibold tracking-[0.25em]">ATELIER</span>
          <Link
            href="/demos"
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            ← Все демо
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="mb-1 text-3xl font-semibold tracking-tight">Онлайн-запись</h1>
        <p className="mb-8 text-white/50">Четыре шага, около минуты</p>

        {/* прогресс */}
        <ol className="mb-9 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm transition-colors ${
                  i < step
                    ? "bg-emerald-500/20 text-emerald-300"
                    : i === step
                      ? "bg-white text-black"
                      : "bg-white/[0.06] text-white/40"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span className={`hidden text-sm sm:block ${i === step ? "text-white" : "text-white/40"}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-white/10" />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setService(s)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  service?.id === s.id
                    ? "border-white bg-white/[0.06]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="shrink-0 font-semibold">{money(s.price)}</span>
                </div>
                <p className="text-sm text-white/50">{s.note}</p>
                <p className="mt-2 text-xs text-white/35">{s.min} минут</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {MASTERS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMaster(m)}
                className={`rounded-xl border p-5 text-center transition-colors ${
                  master?.id === m.id ? "border-white bg-white/[0.06]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <span
                  className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full text-xl font-semibold"
                  style={{ background: m.hue }}
                >
                  {m.name[0]}
                </span>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-white/50">{m.role}</p>
                <p className="mt-1 text-xs text-white/35">★ {m.rating.toFixed(1)}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && master && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-white/50">Выберите день</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => (
                  <button
                    key={d.key}
                    disabled={d.weekend}
                    onClick={() => {
                      setDay(d.key);
                      setSlot(null);
                    }}
                    className={`w-16 shrink-0 rounded-xl border py-3 text-center transition-colors ${
                      day === d.key
                        ? "border-white bg-white text-black"
                        : d.weekend
                          ? "cursor-not-allowed border-white/5 text-white/20"
                          : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span className="block text-xs opacity-60">{d.wd}</span>
                    <span className="block text-lg font-medium">{d.num}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-white/35">Воскресенье — выходной</p>
            </div>

            {day !== null && (
              <div>
                <p className="mb-3 text-sm text-white/50">Свободное время у мастера {master.name}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {SLOTS.map((t, i) => {
                    const taken = busy(day, i, master.id);
                    return (
                      <button
                        key={t}
                        disabled={taken}
                        onClick={() => setSlot(t)}
                        className={`rounded-lg border py-2.5 text-sm transition-colors ${
                          slot === t
                            ? "border-white bg-white text-black"
                            : taken
                              ? "cursor-not-allowed border-white/5 text-white/20 line-through"
                              : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/50">Как к вам обращаться</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={`w-full rounded-lg border bg-white/[0.04] px-4 py-3 outline-none transition-colors ${
                    touched && !nameOk ? "border-rose-500/60" : "border-white/10 focus:border-white/40"
                  }`}
                  placeholder="Виталий"
                />
                {touched && !nameOk && <span className="mt-1 block text-xs text-rose-400">Минимум два символа</span>}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm text-white/50">Телефон</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  onBlur={() => setTouched(true)}
                  inputMode="tel"
                  className={`w-full rounded-lg border bg-white/[0.04] px-4 py-3 outline-none transition-colors ${
                    touched && !phoneOk ? "border-rose-500/60" : "border-white/10 focus:border-white/40"
                  }`}
                  placeholder="+7 (___) ___-__-__"
                />
                {touched && !phoneOk && <span className="mt-1 block text-xs text-rose-400">Нужны все 11 цифр</span>}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm text-white/50">Комментарий мастеру</span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 outline-none focus:border-white/40"
                  placeholder="Необязательно"
                />
              </label>
            </div>

            <aside className="h-fit rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-3 text-sm text-white/50">Ваша запись</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/50">Услуга</dt>
                  <dd className="text-right">{service?.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/50">Мастер</dt>
                  <dd>{master?.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/50">Когда</dt>
                  <dd className="text-right">
                    {chosenDay?.num} {chosenDay?.month}, {slot}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold">
                  <dt>Итого</dt>
                  <dd>{money(service?.price ?? 0)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        )}

        <div className="mt-9 flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full border border-white/15 px-6 py-3 text-sm transition-colors hover:border-white/40 disabled:opacity-25"
          >
            Назад
          </button>
          <button
            onClick={() => {
              if (step === 3) {
                setTouched(true);
                if (canNext) setDone(true);
              } else if (canNext) setStep((s) => s + 1);
            }}
            disabled={!canNext && step !== 3}
            className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {step === 3 ? "Записаться" : "Дальше"}
          </button>
        </div>

        <p className="mt-12 text-center text-sm text-white/40">
          Демо-проект.{" "}
          <Link href="/#contact" className="underline underline-offset-4 hover:text-white">
            Нужна запись на сайт →
          </Link>
        </p>
      </main>
    </div>
  );
}
