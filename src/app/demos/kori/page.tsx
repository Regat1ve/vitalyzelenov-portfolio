import type { Metadata } from "next";
import { KoriClient } from "./KoriClient";

export const metadata: Metadata = {
  title: "KŌRI — интернет-магазин",
  description:
    "Демо: каталог с фильтрами и сортировкой, корзина с сохранением между визитами, промокод и расчёт доставки.",
};

export default function Page() {
  return <KoriClient />;
}
