import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LEAD_SOURCE } from "@/lib/leads/source";

const OPS_EXCLUDED_SOURCES = [
  LEAD_SOURCE.REFERRAL,
  LEAD_SOURCE.CTV_CLAIM,
] as const;

const opsLeadBaseWhere = {
  assignedBrokerId: null,
  source: { notIn: [...OPS_EXCLUDED_SOURCES] },
} satisfies Prisma.LeadWhereInput;

/** Số liệu header Admin Ops — thay ping Telegram nội bộ. */
export async function getAdminQueueCounts() {
  const [opsLeadsNew, opsLeadsActive, conflictsOpen] = await Promise.all([
    prisma.lead.count({
      where: { ...opsLeadBaseWhere, status: "NEW" },
    }),
    prisma.lead.count({
      where: {
        ...opsLeadBaseWhere,
        status: { in: ["NEW", "CONTACTED", "QUALIFIED"] },
      },
    }),
    prisma.attributionConflict.count({
      where: { status: "OPEN" },
    }),
  ]);

  return {
    opsLeadsNew,
    opsLeadsActive,
    conflictsOpen,
    fetchedAt: new Date().toISOString(),
  };
}

export type AdminQueueCounts = Awaited<ReturnType<typeof getAdminQueueCounts>>;
