import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { affiliateSitemapEntries } from "@/lib/content/affiliate-verticals";
import { getSiteUrl } from "@/lib/site-config";

const BASE = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const affiliate = affiliateSitemapEntries(BASE).map((e) => ({
    url: e.url,
    changeFrequency: "weekly" as const,
    priority: e.priority,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/mua-ban`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/cho-thue`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/du-an`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/tin-tuc`, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/cong-cu`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE}/cong-cu/tinh-khoan-vay`, changeFrequency: "monthly", priority: 0.7 },
    ...affiliate,
    { url: `${BASE}/dang-ky/khach-hang`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dang-ky/moi-gioi`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/gioi-thieu`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/lien-he`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dieu-khoan`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/bao-mat`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [listings, projects, articles] = await Promise.all([
      prisma.listing.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        select: { code: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.project.findMany({
        where: { deletedAt: null },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 500,
      }),
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
        take: 2000,
      }),
    ]);

    return [
      ...staticRoutes,
      ...listings.map((l) => ({
        url: `${BASE}/tin-dang/${l.code}`,
        lastModified: l.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...projects.map((p) => ({
        url: `${BASE}/du-an/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...articles.map((a) => ({
        url: `${BASE}/tin-tuc/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
