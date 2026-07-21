import type {
  PartnerTarget,
  PartnerTargetKind,
  PartnerTargetStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PARTNER_TARGET_ACTIVE_SOFT_CAP } from "@/lib/admin/partner-target-labels";

export {
  PARTNER_TARGET_ACTIVE_SOFT_CAP,
  PARTNER_TARGET_KIND_LABEL,
  PARTNER_TARGET_STATUS_LABEL,
} from "@/lib/admin/partner-target-labels";

const ACTIVE_STATUSES: PartnerTargetStatus[] = [
  "TARGET",
  "CONTACTED",
  "MEETING",
];

export type PartnerTargetWrite = {
  orgName?: string;
  kind?: PartnerTargetKind;
  areaHint?: string | null;
  contactName?: string | null;
  contactChannel?: string | null;
  status?: PartnerTargetStatus;
  nextAction?: string | null;
  nextActionAt?: string | null;
  notes?: string | null;
};

export async function listPartnerTargets(
  status: PartnerTargetStatus | "ALL",
): Promise<PartnerTarget[]> {
  return prisma.partnerTarget.findMany({
    where: status === "ALL" ? undefined : { status },
    orderBy: [{ nextActionAt: "asc" }, { updatedAt: "desc" }],
    take: 200,
  });
}

export async function countActivePartnerTargets(): Promise<number> {
  return prisma.partnerTarget.count({
    where: { status: { in: ACTIVE_STATUSES } },
  });
}

export async function getPartnerTargetById(
  id: string,
): Promise<PartnerTarget | null> {
  return prisma.partnerTarget.findUnique({ where: { id } });
}

function parseNextActionAt(raw: string | null | undefined): Date | null {
  if (raw == null || raw === "") return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createPartnerTarget(
  input: PartnerTargetWrite & { orgName: string },
): Promise<PartnerTarget> {
  return prisma.partnerTarget.create({
    data: {
      orgName: input.orgName,
      kind: input.kind ?? "OTHER",
      areaHint: input.areaHint ?? null,
      contactName: input.contactName ?? null,
      contactChannel: input.contactChannel ?? null,
      status: input.status ?? "TARGET",
      nextAction: input.nextAction ?? null,
      nextActionAt: parseNextActionAt(input.nextActionAt),
      notes: input.notes ?? null,
    },
  });
}

export async function updatePartnerTarget(
  id: string,
  input: PartnerTargetWrite,
): Promise<PartnerTarget> {
  const existing = await getPartnerTargetById(id);
  if (!existing) throw new Error("NOT_FOUND");

  return prisma.partnerTarget.update({
    where: { id },
    data: {
      ...(input.orgName !== undefined ? { orgName: input.orgName } : {}),
      ...(input.kind !== undefined ? { kind: input.kind } : {}),
      ...(input.areaHint !== undefined ? { areaHint: input.areaHint } : {}),
      ...(input.contactName !== undefined
        ? { contactName: input.contactName }
        : {}),
      ...(input.contactChannel !== undefined
        ? { contactChannel: input.contactChannel }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.nextAction !== undefined
        ? { nextAction: input.nextAction }
        : {}),
      ...(input.nextActionAt !== undefined
        ? { nextActionAt: parseNextActionAt(input.nextActionAt) }
        : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
    },
  });
}

export async function deletePartnerTarget(id: string): Promise<void> {
  const existing = await getPartnerTargetById(id);
  if (!existing) throw new Error("NOT_FOUND");
  await prisma.partnerTarget.delete({ where: { id } });
}
