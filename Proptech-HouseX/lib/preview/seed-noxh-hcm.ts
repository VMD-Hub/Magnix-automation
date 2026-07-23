import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import {
  allNoxhHcmDefs,
  buildNoxhHcmSeedLanding,
} from "@/lib/preview/noxh-hcm-projects";

/** Seed 26 NOXH TP.HCM mega-city — salesRegion SOUTH · PIPELINE_CDT. */
export async function seedNoxhHcmProjects(
  prisma: PrismaClient,
): Promise<void> {
  for (const def of allNoxhHcmDefs()) {
    const developer = await prisma.developer.upsert({
      where: { taxCode: def.developerTax },
      update: {
        name: def.developerName,
        verified: false,
        logoUrl: def.developerLogo ?? null,
      },
      create: {
        name: def.developerName,
        taxCode: def.developerTax,
        verified: false,
        logoUrl: def.developerLogo ?? null,
      },
    });

    const landing = buildNoxhHcmSeedLanding(def.slug);
    if (!landing) continue;

    const overview = buildOverviewData(null, {
      totalUnits: def.totalUnits,
      ...(def.blocks != null && def.blocks > 0 ? { blocks: def.blocks } : {}),
      landing,
    });

    const existing = await prisma.project.findUnique({
      where: { slug: def.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.project.update({
        where: { slug: def.slug },
        data: {
          name: def.name,
          overviewData: overview as object,
          description: def.description,
          seoTitle: def.seoTitle,
          seoDesc: def.seoDesc,
          lat: def.lat,
          lng: def.lng,
          status: def.status,
          province: def.province,
          district: def.district,
          ward: def.ward,
          address: def.address,
          totalArea: def.totalArea ?? null,
          handoverDate: def.handoverDate ?? null,
          salesRegion: "SOUTH",
          leadLane: "PIPELINE_CDT",
          developerId: developer.id,
        },
      });
      continue;
    }

    await prisma.project.create({
      data: {
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
}
