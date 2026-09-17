import type { MetadataRoute } from "next";
import { getCatalog } from "@/server/services/book-service";
import { siteUrl } from "@/lib/utils";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/explore", priority: 0.8, changeFrequency: "daily" },
  { path: "/search", priority: 0.6, changeFrequency: "weekly" },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" },
  { path: "/signup", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const { books } = await getCatalog();
  const bookEntries = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...bookEntries];
}