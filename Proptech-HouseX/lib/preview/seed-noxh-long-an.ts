import type { PrismaClient } from "@prisma/client";
import { buildOverviewData } from "@/lib/content/project-landing";
import {
  allNoxhLongAnDefs,
  buildNoxhLongAnSeedLanding,
} from "@/lib/preview/noxh-long-an-projects";

/** Seed 6 dự án NOXH Long An vào Postgres. */
export async function seedNoxhLongAnProjects(prisma: PrismaClient): Promise<void> {
  for (const def of allNoxhLongAnDefs()) {
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

    const landing = buildNoxhLongAnSeedLanding(def.slug);
    if (!landing) continue;

    const overview = buildOverviewData(null, {
      totalUnits: def.totalUnits,
      blocks: def.blocks,
      landing,
    });

    await prisma.project.upsert({
      where: { slug: def.slug },
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
