import type { Metadata } from "next";
import { PulseClient } from "./PulseClient";

export const metadata: Metadata = {
  title: "PULSE — аналитический дашборд",
  description:
    "Демо: SaaS-дашборд. Метрики, график с кроссхейром, сортируемая таблица заказов, фильтры по периоду и статусу.",
};

export default function Page() {
  return <PulseClient />;
}
