import { prisma } from "@/lib/prisma";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Shared include shape so API + SSR page return identical relations. */
export const projectDetailInclude = {
  developer: true,
  unitTypes: { orderBy: { priceFrom: "asc" } },
  legalDocs: { orderBy: { createdAt: "desc" } },
} as const;

/**
 * Resolve a project by its slug (preferred, used by public routes) or by id.
 * Returns the full detail shape with developer, unit types and legal docs.
 */
export async function getProjectBySlugOrId(slugOrId: string) {
  if (uuidRegex.test(slugOrId)) {
    const byId = await prisma.project.findFirst({
      where: { id: slugOrId, deletedAt: null },
      include: projectDetailInclude,
    });
    if (byId) return byId;
  }

  return prisma.project.findFirst({
    where: { slug: slugOrId, deletedAt: null },
    include: projectDetailInclude,
  });
}

export type ProjectDetail = NonNullable<
  Awaited<ReturnType<typeof getProjectBySlugOrId>>
>;
