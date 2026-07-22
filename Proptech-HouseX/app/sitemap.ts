import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { affiliateSitemapEntries } from "@/lib/content/affiliate-verticals";
import {
  COMMERCIAL_CATALOG_PATH,
  NOXH_CATALOG_PATH,
} from "@/lib/content/project-catalog-routes";
import { toolSitemapPaths } from "@/lib/content/housex-tools-registry";
import { listExpertSlugs } from "@/lib/content/editorial-trust";
import { getCatalogSlugs } from "@/lib/seed/catalog-project-slugs";
import { listDemoSaleListingCards } from "@/lib/preview/demo-listings";
import { articlePath, NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";
import { getSiteUrl } from "@/lib/site-config";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
} from "@/lib/deploy/internal-demo-content";

const BASE = getSiteUrl();

function catalogProjectSitemapEntries(): MetadataRoute.Sitemap {
  return getCatalogSlugs().map((slug) => ({
    url: `${BASE}/du-an/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
}

function catalogListingSitemapEntries(): MetadataRoute.Sitemap {
  if (!allowDemoProjectFallback()) return [];
  return listDemoSaleListingCards().map((l) => ({
    url: `${BASE}/tin-dang/${l.code}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
}

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
    { url: `${BASE}${NOXH_CATALOG_PATH}`, changeFrequency: "daily", priority: 0.92 },
    { url: `${BASE}${COMMERCIAL_CATALOG_PATH}`, changeFrequency: "daily", priority: 0.88 },
    { url: `${BASE}/tin-tuc`, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}${NOXH_HANDBOOK_PATH}`, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/cong-cu`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${BASE}/khuyen-mai`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/phong-thuy`, changeFrequency: "weekly", priority: 0.8 },
    ...toolSitemapPaths().map((path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "monthly" as const,
      priority: path.includes("xem-huong") || path.includes("kiem-tra-tuoi") ? 0.75 : 0.7,
    })),
    ...affiliate,
    // Không đưa /dang-ky/* vào sitemap — pages robots noindex (Ahrefs: noindex in sitemap).
    { url: `${BASE}/gioi-thieu`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/gioi-thieu/cau-chuyen`, changeFrequency: "monthly", priority: 0.35 },
    { url: `${BASE}/gioi-thieu/phuong-phap-bien-tap`, changeFrequency: "monthly", priority: 0.45 },
    { url: `${BASE}/doi-ngu`, changeFrequency: "monthly", priority: 0.45 },
    // /chuyen-gia hub 301 → /doi-ngu; chỉ index trang chuyên gia theo slug.
    ...listExpertSlugs().map((slug) => ({
      url: `${BASE}/chuyen-gia/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    { url: `${BASE}/hop-tac`, changeFrequency: "monthly", priority: 0.45 },
    { url: `${BASE}/cau-hoi-thuong-gap`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/lien-he`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dieu-khoan`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/dieu-khoan/phu-luc-a`, changeFrequency: "yearly", priority: 0.25 },
    { url: `${BASE}/dieu-khoan/phu-luc-b`, changeFrequency: "yearly", priority: 0.25 },
    { url: `${BASE}/chinh-sach-khieu-nai`, changeFrequency: "yearly", priority: 0.35 },
    { url: `${BASE}/bao-mat`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [listings, projects, articles] = await Promise.all([
      prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
          code: { notIn: [...INTERNAL_DEMO_LISTING_CODES] },
          OR: [
            { projectId: null },
            { project: { slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] } } },
          ],
        },
        select: { code: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.project.findMany({
        where: {
          deletedAt: null,
          slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] },
        },
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

    const projectEntries =
      projects.length > 0
        ? projects.map((p) => ({
            url: `${BASE}/du-an/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.85,
          }))
        : catalogProjectSitemapEntries();

    const listingEntries =
      listings.length > 0
        ? listings.map((l) => ({
            url: `${BASE}/tin-dang/${l.code}`,
            lastModified: l.updatedAt,
            changeFrequency: "daily" as const,
            priority: 0.8,
          }))
        : catalogListingSitemapEntries();

    return [
      ...staticRoutes,
      ...listingEntries,
      ...projectEntries,
      ...articles.map((a) => ({
        url: `${BASE}${articlePath(a.slug)}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    ];
  } catch {
    return [
      ...staticRoutes,
      ...catalogListingSitemapEntries(),
      ...catalogProjectSitemapEntries(),
    ];
  }
}
