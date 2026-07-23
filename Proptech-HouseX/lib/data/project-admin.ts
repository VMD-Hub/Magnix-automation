import { prisma } from "@/lib/prisma";
import type { LeadLane, Prisma, SalesRegion } from "@prisma/client";
import {
  buildOverviewData,
  defaultProjectLanding,
  parseProjectOverview,
} from "@/lib/content/project-landing";
import { inferPrismaSalesRegionFromProvince } from "@/lib/content/noxh-province-registry";
import type { ProjectAdminSaveInput } from "@/lib/validation/project-admin";
import { projectDetailInclude } from "@/lib/data/project";

function resolveSalesRegion(
  input: Pick<ProjectAdminSaveInput, "salesRegion" | "province">,
): SalesRegion | null {
  if (input.salesRegion) {
    return input.salesRegion;
  }
  return inferPrismaSalesRegionFromProvince(input.province) as SalesRegion | null;
}

export async function listProjectsForAdmin(opts?: {
  salesRegion?: SalesRegion | null;
}) {
  return prisma.project.findMany({
    where: {
      deletedAt: null,
      ...(opts?.salesRegion ? { salesRegion: opts.salesRegion } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      developer: { select: { id: true, name: true } },
      _count: { select: { unitTypes: true, listings: true } },
    },
  });
}

export async function getProjectForAdmin(id: string) {
  return prisma.project.findFirst({
    where: { id, deletedAt: null },
    include: {
      ...projectDetailInclude,
      unitTypes: { orderBy: { priceFrom: "asc" } },
    },
  });
}

export async function listDevelopersForAdmin() {
  return prisma.developer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, verified: true },
  });
}

function toOverviewJson(
  input: Pick<ProjectAdminSaveInput, "totalUnits" | "blocks" | "landing">,
  existing?: unknown,
): Prisma.InputJsonValue {
  return buildOverviewData(existing, {
    totalUnits: input.totalUnits ?? undefined,
    blocks: input.blocks ?? undefined,
    landing: input.landing,
  }) as Prisma.InputJsonValue;
}

export async function createProjectFromAdmin(input: ProjectAdminSaveInput) {
  const { totalUnits, blocks, landing, ...data } = input;
  return prisma.project.create({
    data: {
      developerId: data.developerId,
      slug: data.slug,
      name: data.name,
      projectType: data.projectType,
      status: data.status,
      province: data.province,
      district: data.district,
      ward: data.ward,
      address: data.address,
      lat: data.lat ?? undefined,
      lng: data.lng ?? undefined,
      totalArea: data.totalArea ?? undefined,
      density: data.density ?? undefined,
      salesRegion: resolveSalesRegion(data),
      leadLane: (data.leadLane ?? null) as LeadLane | null,
      description: data.description,
      handoverDate: data.handoverDate ?? undefined,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      overviewData: toOverviewJson({ totalUnits, blocks, landing }),
    },
    include: projectDetailInclude,
  });
}

export async function updateProjectFromAdmin(
  id: string,
  input: ProjectAdminSaveInput,
) {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return null;

  const { totalUnits, blocks, landing, ...data } = input;
  return prisma.project.update({
    where: { id },
    data: {
      developerId: data.developerId,
      slug: data.slug,
      name: data.name,
      projectType: data.projectType,
      status: data.status,
      province: data.province,
      district: data.district,
      ward: data.ward,
      address: data.address,
      lat: data.lat ?? undefined,
      lng: data.lng ?? undefined,
      totalArea: data.totalArea ?? undefined,
      density: data.density ?? undefined,
      salesRegion: resolveSalesRegion(data),
      leadLane:
        data.leadLane !== undefined
          ? (data.leadLane as LeadLane | null)
          : undefined,
      description: data.description,
      handoverDate: data.handoverDate ?? undefined,
      seoTitle: data.seoTitle,
      seoDesc: data.seoDesc,
      overviewData: toOverviewJson(
        { totalUnits, blocks, landing },
        existing.overviewData,
      ),
    },
    include: projectDetailInclude,
  });
}

/** Nhân bản dự án — giữ landing, loại hình, pháp lý; slug/name mới. */
export async function cloneProjectForAdmin(
  sourceId: string,
  newSlug: string,
  newName?: string,
) {
  const source = await prisma.project.findFirst({
    where: { id: sourceId, deletedAt: null },
    include: {
      unitTypes: true,
      legalDocs: true,
    },
  });
  if (!source) return null;

  const overview = parseProjectOverview(source.overviewData);
  const landing =
    overview.landing ?? defaultProjectLanding(newName ?? source.name);

  return prisma.project.create({
    data: {
      developerId: source.developerId,
      slug: newSlug,
      name: newName ?? `${source.name} (bản sao)`,
      projectType: source.projectType,
      status: "SAP_MO_BAN",
      province: source.province,
      district: source.district,
      ward: source.ward,
      address: source.address,
      lat: source.lat,
      lng: source.lng,
      totalArea: source.totalArea,
      density: source.density,
      salesRegion:
        source.salesRegion ??
        (inferPrismaSalesRegionFromProvince(source.province) as SalesRegion | null),
      leadLane: source.leadLane,
      description: source.description,
      handoverDate: source.handoverDate,
      seoTitle: source.seoTitle ? `${source.seoTitle} — bản sao` : undefined,
      seoDesc: source.seoDesc,
      overviewData: buildOverviewData(null, {
        totalUnits: overview.totalUnits,
        blocks: overview.blocks,
        landing,
      }) as Prisma.InputJsonValue,
      unitTypes: {
        create: source.unitTypes.map((u) => ({
          name: u.name,
          areaMin: u.areaMin,
          areaMax: u.areaMax,
          bedrooms: u.bedrooms,
          priceFrom: u.priceFrom,
          floorPlanUrl: u.floorPlanUrl,
        })),
      },
      legalDocs: {
        create: source.legalDocs.map((d) => ({
          docType: d.docType,
          status: d.status,
          issuedDate: d.issuedDate,
          fileUrl: d.fileUrl,
        })),
      },
    },
    include: projectDetailInclude,
  });
}
