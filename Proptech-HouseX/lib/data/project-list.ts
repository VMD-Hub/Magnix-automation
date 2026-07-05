import { prisma } from "@/lib/prisma";
import { withDbTimeout } from "@/lib/db/query-timeout";
import type { ProjectCardData } from "@/components/projects/project-card";
import {
  parseProjectOverview,
  resolveLandingHeroImage,
} from "@/lib/content/project-landing";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import {
  listCatalogProjectCards,
  listDemoProjectCards,
} from "@/lib/preview/demo-projects";
import { mergeMissingGoLiveCommercialCards } from "@/lib/data/merge-go-live-project-cards";
import { INTERNAL_DEMO_PROJECT_SLUGS } from "@/lib/deploy/internal-demo-content";

export type ProjectListParams = {
  province?: string;
  district?: string;
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI";
  page?: number;
  pageSize?: number;
};

export type ProjectListResult = {
  items: ProjectCardData[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  /** true khi đang hiển thị dự án demo (chưa seed / DB offline). */
  isDemo?: boolean;
  /** true khi đang hiển thị catalog go-live tĩnh (8 landing thương mại). */
  isCatalog?: boolean;
};

function rowToCard(p: {
  slug: string;
  name: string;
  projectType: string;
  status: string;
  province: string;
  district: string;
  overviewData: unknown;
  developer: { name: string } | null;
  unitTypes: { priceFrom: { toString(): string } | null }[];
  _count: { listings: number };
}): ProjectCardData {
  const overview = parseProjectOverview(p.overviewData);
  const hero = resolveLandingHeroImage(overview.landing, p.name);
  return {
    slug: p.slug,
    name: p.name,
    projectType: p.projectType,
    status: p.status,
    province: p.province,
    district: p.district,
    developerName: p.developer?.name ?? null,
    priceFrom: p.unitTypes[0]?.priceFrom?.toString() ?? null,
    listingCount: p._count.listings,
    imageUrl: hero?.url ?? null,
  };
}

function paginateCatalog(
  cards: ProjectCardData[],
  page: number,
  pageSize: number,
  isCatalog: boolean,
): ProjectListResult {
  const total = cards.length;
  const start = (page - 1) * pageSize;
  return {
    items: cards.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    isCatalog,
  };
}

/** Danh sách dự án public — SSR trang /du-an. */
export async function listProjects(
  params: ProjectListParams = {},
): Promise<ProjectListResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 12));

  const where = {
    deletedAt: null,
    slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] },
    ...(params.province ? { province: params.province } : {}),
    ...(params.district ? { district: params.district } : {}),
    ...(params.projectType ? { projectType: params.projectType } : {}),
  };

  try {
    if (params.projectType === "THUONG_MAI") {
      const rows = await withDbTimeout(
        prisma.project.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: {
            developer: { select: { name: true } },
            unitTypes: {
              select: { priceFrom: true },
              orderBy: { priceFrom: "asc" },
              take: 1,
            },
            _count: { select: { listings: true } },
          },
        }),
      );
      const merged = mergeMissingGoLiveCommercialCards(rows.map(rowToCard));
      return paginateCatalog(
        merged,
        page,
        pageSize,
        merged.length > rows.length,
      );
    }

    const [rows, total] = await withDbTimeout(
      Promise.all([
        prisma.project.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            developer: { select: { name: true } },
            unitTypes: {
              select: { priceFrom: true },
              orderBy: { priceFrom: "asc" },
              take: 1,
            },
            _count: { select: { listings: true } },
          },
        }),
        prisma.project.count({ where }),
      ]),
    );

    if (total > 0) {
      return {
        items: rows.map(rowToCard),
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      };
    }
  } catch {
    // DB offline — thử catalog go-live bên dưới.
  }

  const catalogItems = listCatalogProjectCards({
    projectType: params.projectType,
    province: params.province,
    district: params.district,
  });
  if (catalogItems.length > 0) {
    return paginateCatalog(catalogItems, page, pageSize, true);
  }

  if (!allowDemoProjectFallback()) {
    return {
      items: [],
      pagination: { page, pageSize, total: 0, totalPages: 1 },
    };
  }

  const demoItems = listDemoProjectCards({ projectType: params.projectType });
  return {
    items: demoItems,
    pagination: {
      page: 1,
      pageSize,
      total: demoItems.length,
      totalPages: 1,
    },
    isDemo: demoItems.length > 0,
  };
}
