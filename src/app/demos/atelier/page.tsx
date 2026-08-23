import type { Metadata } from "next";
import { AtelierClient } from "./AtelierClient";

export const metadata: Metadata = {
  title: "ATELIER — онлайн-запись",
  description:
    "Демо: многошаговая запись на услугу. Выбор услуги и мастера, календарь со свободными слотами, валидация телефона, подтверждение.",
};

export default function Page() {
  return <AtelierClient />;
}
