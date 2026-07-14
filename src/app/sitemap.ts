import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE = "https://vitalyzelenov-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/tools/claude-md`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
  const projectPaths: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticPaths, ...projectPaths];
}
