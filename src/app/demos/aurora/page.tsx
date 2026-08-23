import type { Metadata } from "next";
import { AuroraClient } from "./AuroraClient";

export const metadata: Metadata = {
  title: "AURORA — 3D-витрина продукта",
  description:
    "Демо: скролл-сторителлинг на React Three Fiber. Процедурная 3D-сцена, шейдерная деформация, частицы, движение камеры от скролла.",
};

export default function Page() {
  return <AuroraClient />;
}
