import type { PrismaClient } from "@prisma/client";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
} from "@/lib/deploy/internal-demo-content";

/**
 * Soft-delete dự án + tin đăng mẫu nội bộ khỏi DB production.
 * Idempotent — an toàn chạy nhiều lần trước/sau deploy.
 */
export async function hideInternalDemoContent(prisma: PrismaClient) {
  const now = new Date();

  const demoProjects = await prisma.project.findMany({
    where: {
      slug: { in: [...INTERNAL_DEMO_PROJECT_SLUGS] },
      deletedAt: null,
    },
    select: { id: true, slug: true },
  });

  const demoProjectIds = demoProjects.map((p) => p.id);

  const listingsByCode = await prisma.listing.updateMany({
    where: {
      deletedAt: null,
      code: { in: [...INTERNAL_DEMO_LISTING_CODES] },
    },
    data: { deletedAt: now },
  });

  const listingsByProject =
    demoProjectIds.length > 0
      ? await prisma.listing.updateMany({
          where: {
            deletedAt: null,
            projectId: { in: demoProjectIds },
          },
          data: { deletedAt: now },
        })
      : { count: 0 };

  const projects = await prisma.project.updateMany({
    where: {
      slug: { in: [...INTERNAL_DEMO_PROJECT_SLUGS] },
      deletedAt: null,
    },
    data: { deletedAt: now },
  });

  return {
    projectsHidden: projects.count,
    listingsHidden: listingsByCode.count + listingsByProject.count,
    slugs: demoProjects.map((p) => p.slug),
  };
}
