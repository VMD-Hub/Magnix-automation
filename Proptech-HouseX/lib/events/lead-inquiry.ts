import type { Prisma } from "@prisma/client";
import { getSiteUrl } from "@/lib/site-config";
import type { LeadCreatedPayload } from "@/lib/events/types";
import { fromPrismaLeadSegment } from "@/lib/rules/lead-segment";

type Tx = Prisma.TransactionClient;

export async function buildLeadCreatedPayload(
  tx: Tx,
  lead: {
    id: string;
    source: string;
    sourceMeta?: unknown;
    segment?: import("@prisma/client").LeadSegment | null;
    message: string | null;
    assignedBrokerId: string | null;
    createdAt: Date;
    projectId: string | null;
    listingId: string | null;
  },
  contact: { name: string; phone: string; email?: string },
): Promise<LeadCreatedPayload> {
  const site = getSiteUrl();

  if (lead.projectId) {
    const project = await tx.project.findUnique({
      where: { id: lead.projectId },
      select: {
        id: true,
        name: true,
        slug: true,
        projectType: true,
        province: true,
      },
    });
    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }
    return {
      leadId: lead.id,
      source: lead.source,
      sourceMeta: (lead.sourceMeta as LeadCreatedPayload["sourceMeta"]) ?? null,
      segment: fromPrismaLeadSegment(lead.segment),
      message: lead.message,
      contact: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email ?? null,
      },
      context: {
        kind: "project",
        entityId: project.id,
        entityName: project.name,
        slug: project.slug,
        listingCode: null,
        projectType: project.projectType,
        province: project.province,
        adminUrl: `${site}/du-an/${project.slug}`,
      },
      assignedBrokerId: lead.assignedBrokerId,
      createdAt: lead.createdAt.toISOString(),
    };
  }

  if (lead.listingId) {
    const listing = await tx.listing.findUnique({
      where: { id: lead.listingId },
      select: {
        id: true,
        code: true,
        province: true,
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            projectType: true,
            province: true,
          },
        },
      },
    });
    if (!listing) {
      throw new Error("LISTING_NOT_FOUND");
    }
    const project = listing.project;
    return {
      leadId: lead.id,
      source: lead.source,
      sourceMeta: (lead.sourceMeta as LeadCreatedPayload["sourceMeta"]) ?? null,
      segment: fromPrismaLeadSegment(lead.segment),
      message: lead.message,
      contact: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email ?? null,
      },
      context: {
        kind: "listing",
        entityId: listing.id,
        entityName: project?.name ?? `Tin ${listing.code}`,
        slug: project?.slug ?? null,
        listingCode: listing.code,
        projectType: project?.projectType ?? "THUONG_MAI",
        province: listing.province ?? project?.province ?? null,
        adminUrl: `${site}/tin-dang/${listing.code}`,
      },
      assignedBrokerId: lead.assignedBrokerId,
      createdAt: lead.createdAt.toISOString(),
    };
  }

  throw new Error("LEAD_CONTEXT_REQUIRED");
}

/** Best-effort push realtime — outbox vẫn là nguồn retry chính. */
export async function forwardLeadCreatedBestEffort(
  payload: LeadCreatedPayload,
): Promise<void> {
  const url = process.env.EVENTS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EVENTS_WEBHOOK_SECRET
          ? { "x-events-secret": process.env.EVENTS_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type: "lead.created",
        payload,
        sentAt: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error(
      "[lead] realtime forward failed:",
      err instanceof Error ? err.message : err,
    );
  }
}
