import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import {
  buildHoGuomXanhSeedLanding,
  HGX_DEF,
  HGX_PROJECT_SLUG,
} from "@/lib/preview/ho-guom-xanh-mock";

/** Seed NOXH Hồ Gươm Xanh (Thuận An) vào Postgres. */
export async function seedHoGuomXanhNoxh(prisma: PrismaClient): Promise<void> {
  const def = HGX_DEF;
  const developer = await prisma.developer.upsert({
    where: { taxCode: def.developerTax },
    update: {
      name: def.developerName,
      verified: true,
      logoUrl: def.developerLogo ?? null,
    },
    create: {
      name: def.developerName,
      taxCode: def.developerTax,
      verified: true,
      logoUrl: def.developerLogo ?? null,
    },
  });

  const landing = buildHoGuomXanhSeedLanding();
  const overview = buildOverviewData(null, {
    totalUnits: def.totalUnits,
    ...(def.blocks != null && def.blocks > 0 ? { blocks: def.blocks } : {}),
    landing,
  });

  await prisma.project.upsert({
    where: { slug: HGX_PROJECT_SLUG },
    update: {
      name: def.name,
      overviewData: overview as object,
      description: def.description,
      seoTitle: def.seoTitle,
      seoDesc: def.seoDesc,
      lat: def.lat,
      lng: def.lng,
      status: def.status,
      handoverDate: def.handoverDate ?? null,
      totalArea: def.totalArea ?? null,
      salesRegion: "SOUTH",
      leadLane: "PIPELINE_CDT",
    },
    create: {
      developerId: developer.id,
      slug: def.slug,
      name: def.name,
      projectType: def.projectType,
      status: def.status,
      province: def.province,
      district: def.district,
      ward: def.ward,
      address: def.address,
      lat: def.lat,
      lng: def.lng,
      totalArea: def.totalArea ?? null,
      handoverDate: def.handoverDate ?? null,
      salesRegion: "SOUTH",
      leadLane: "PIPELINE_CDT",
      overviewData: overview as object,
      description: def.description,
      seoTitle: def.seoTitle,
      seoDesc: def.seoDesc,
      unitTypes: {
        create: def.unitTypes.map((u) => ({
          name: u.name,
          areaMin: u.areaMin ?? null,
          areaMax: u.areaMax ?? null,
          bedrooms: u.bedrooms ?? null,
          priceFrom: u.priceFrom ?? null,
        })),
      },
      legalDocs: {
        create: def.legalDocs.map((ld) => ({
          docType: ld.docType,
          status: ld.status,
          issuedDate: ld.issuedDate ?? null,
        })),
      },
    },
  });
}
