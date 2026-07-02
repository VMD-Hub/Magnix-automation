import type { Prisma, ProjectUnitStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getProjectBySlugOrId } from "@/lib/data/project";
import type {
  ProjectInventoryPageFilters,
  ProjectUnitListQuery,
} from "@/lib/validation/project-unit";
import { ACTIVE_UNIT_BOOKING_STATUSES } from "@/lib/rules/unit-booking-rules";

/** Kích thước trang mặc định trên landing (Phase A — hiển thị toàn bộ giỏ hàng nhỏ). */
export const PROJECT_INVENTORY_PAGE_SIZE = 200;

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Include shape dùng chung API + SSR bảng hàng. */
export const projectUnitListInclude = {
  unitType: {
    select: {
      id: true,
      name: true,
      bedrooms: true,
      areaMin: true,
      areaMax: true,
    },
  },
  _count: {
    select: {
      bookings: {
        where: { status: { in: ACTIVE_UNIT_BOOKING_STATUSES } },
      },
    },
  },
} as const;

export type ProjectUnitListItem = Prisma.ProjectUnitGetPayload<{
  include: typeof projectUnitListInclude;
}>;

/** Pure — dễ test, map query → Prisma where (public read, lọc soft-delete). */
export function buildProjectUnitListWhere(
  projectId: string,
  query: ProjectUnitListQuery,
): Prisma.ProjectUnitWhereInput {
  return {
    projectId,
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.block ? { block: query.block } : {}),
    ...(query.unitTypeId ? { unitTypeId: query.unitTypeId } : {}),
    ...(query.minFloor != null || query.maxFloor != null
      ? {
          floor: {
            ...(query.minFloor != null ? { gte: query.minFloor } : {}),
            ...(query.maxFloor != null ? { lte: query.maxFloor } : {}),
          },
        }
      : {}),
    ...(query.minPrice != null || query.maxPrice != null
      ? {
          price: {
            ...(query.minPrice != null ? { gte: query.minPrice } : {}),
            ...(query.maxPrice != null ? { lte: query.maxPrice } : {}),
          },
        }
      : {}),
  };
}

const listOrderBy: Prisma.ProjectUnitOrderByWithRelationInput[] = [
  { block: "asc" },
  { floor: "asc" },
  { code: "asc" },
];

async function getProjectUnitSummary(projectId: string) {
  const rows = await prisma.projectUnit.groupBy({
    by: ["status"],
    where: { projectId, deletedAt: null },
    _count: { _all: true },
  });

  const summary: Record<ProjectUnitStatus, number> = {
    AVAILABLE: 0,
    HELD: 0,
    BOOKED: 0,
    DEPOSITED: 0,
    SOLD: 0,
    HANDED_OVER: 0,
    LIQUIDATED: 0,
  };

  let total = 0;
  for (const row of rows) {
    summary[row.status] = row._count._all;
    total += row._count._all;
  }

  return { byStatus: summary, total };
}

/**
 * Danh sách căn trong giỏ hàng dự án (Phase A read-only).
 * `summary` = toàn dự án; `items` = theo bộ lọc + phân trang.
 */
export async function listProjectUnits(
  slugOrId: string,
  query: ProjectUnitListQuery,
) {
  const project = await getProjectBySlugOrId(slugOrId);
  if (!project) return null;

  const where = buildProjectUnitListWhere(project.id, query);

  const [items, filteredTotal, summary] = await Promise.all([
    prisma.projectUnit.findMany({
      where,
      orderBy: listOrderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: projectUnitListInclude,
    }),
    prisma.projectUnit.count({ where }),
    getProjectUnitSummary(project.id),
  ]);

  return {
    project: {
      id: project.id,
      slug: project.slug,
      name: project.name,
      status: project.status,
    },
    items,
    summary,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total: filteredTotal,
      totalPages: Math.ceil(filteredTotal / query.pageSize) || 0,
    },
  };
}

async function getProjectBlocks(projectId: string) {
  const rows = await prisma.projectUnit.findMany({
    where: { projectId, deletedAt: null, block: { not: null } },
    select: { block: true },
    distinct: ["block"],
    orderBy: { block: "asc" },
  });
  return rows.map((r) => r.block!).filter(Boolean);
}

export type ProjectInventoryPageData = NonNullable<
  Awaited<ReturnType<typeof getProjectInventoryForPage>>
>;

/** Giỏ hàng cho trang landing dự án (SSR read-only). */
export async function getProjectInventoryForPage(
  slugOrId: string,
  filters: ProjectInventoryPageFilters = {},
) {
  const result = await listProjectUnits(slugOrId, {
    ...filters,
    page: 1,
    pageSize: PROJECT_INVENTORY_PAGE_SIZE,
  });
  if (!result) return null;

  const blocks = await getProjectBlocks(result.project.id);
  return { ...result, blocks };
}

/** Chi tiết 1 căn — `unitRef` = uuid hoặc mã căn trong phạm vi dự án. */
export async function getProjectUnitByRef(
  slugOrId: string,
  unitRef: string,
) {
  const project = await getProjectBySlugOrId(slugOrId);
  if (!project) return null;

  const unit = await prisma.projectUnit.findFirst({
    where: uuidRegex.test(unitRef)
      ? { id: unitRef, projectId: project.id, deletedAt: null }
      : { code: unitRef, projectId: project.id, deletedAt: null },
    include: projectUnitListInclude,
  });

  if (!unit) return { project: null, unit: null };

  return {
    project: {
      id: project.id,
      slug: project.slug,
      name: project.name,
      status: project.status,
      projectType: project.projectType,
    },
    unit,
  };
}
