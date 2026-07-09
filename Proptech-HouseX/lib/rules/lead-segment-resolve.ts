import type { Prisma } from "@prisma/client";
import type { LeadCreateInput } from "@/lib/validation/lead";
import {
  projectTypeToLeadSegment,
  toPrismaLeadSegment,
  type LeadSegmentInput,
} from "@/lib/rules/lead-segment";

type Tx = Prisma.TransactionClient;

/** Suy segment từ body hoặc project/listing — không đoán mù. */
export async function resolveLeadSegment(
  tx: Tx,
  body: Pick<LeadCreateInput, "segment" | "projectId" | "listingId">,
): Promise<LeadSegmentInput | null> {
  if (body.segment) return body.segment;

  if (body.projectId) {
    const project = await tx.project.findUnique({
      where: { id: body.projectId },
      select: { projectType: true },
    });
    if (project) return projectTypeToLeadSegment(project.projectType);
  }

  if (body.listingId) {
    const listing = await tx.listing.findUnique({
      where: { id: body.listingId },
      select: { project: { select: { projectType: true } } },
    });
    if (listing?.project) {
      return projectTypeToLeadSegment(listing.project.projectType);
    }
  }

  return null;
}

export async function resolveLeadSegmentPrisma(
  tx: Tx,
  body: Pick<LeadCreateInput, "segment" | "projectId" | "listingId">,
) {
  const input = await resolveLeadSegment(tx, body);
  return input ? toPrismaLeadSegment(input) : null;
}
