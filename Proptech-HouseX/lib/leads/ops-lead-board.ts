import type { LeadSegment, LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LEAD_SOURCE } from "@/lib/leads/source";
import {
  maskLeadPhone,
  mergeLeadOpsMeta,
  readLeadOpsMeta,
} from "@/lib/leads/ops-meta";
import {
  getNurtureScript,
  NURTURE_SCRIPT_CATALOG,
} from "@/lib/leads/nurture-scripts";
import { createCommissionOnWon } from "@/lib/rules/commission-trigger";
import { recordStatusChange } from "@/lib/data/status-history";
import { enqueueEvent } from "@/lib/events/outbox";
import type { CommissionOverride } from "@/lib/validation/lead";
import { tryEnqueueLeadNurture } from "@/lib/leads/nurture-auto";
import {
  formatLegacyNoxhLeadPreviewVi,
  parseLegacyNoxhLeadMessage,
} from "@/lib/leads/noxh-legacy-message";
import { NOXH_OBJECT_GROUPS } from "@/lib/finance/noxh-rules";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";

const OPS_EXCLUDED_SOURCES = new Set([
  LEAD_SOURCE.REFERRAL,
  LEAD_SOURCE.CTV_CLAIM,
]);

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  [LEAD_SOURCE.ZALO_ADS]: "Zalo Ads",
  [LEAD_SOURCE.FANPAGE]: "Fanpage",
  [LEAD_SOURCE.TOOL_NOXH_CHECK]: "Tool NOXH check",
  [LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK]: "Tool vay nhanh",
  [LEAD_SOURCE.MINIAPP_CONSULT]: "Mini App tư vấn",
  [LEAD_SOURCE.WEB_LEAD]: "Web form",
  [LEAD_SOURCE.OPS_MANUAL]: "Ops nhập tay",
  [LEAD_SOURCE.ORGANIC]: "Web (legacy)",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Mới",
  CONTACTED: "Đã tiếp nhận",
  QUALIFIED: "Đã liên hệ",
  WON: "Thành công",
  LOST: "Đóng",
};

export type OpsLeadListFilters = {
  status?: LeadStatus;
  source?: string;
  segment?: LeadSegment;
};

const leadListInclude = {
  customer: { select: { name: true, phone: true, email: true } },
  project: { select: { name: true, slug: true } },
  listing: { select: { code: true, propertyType: true } },
  noxhCases: {
    where: { caseStatus: "ACTIVE" },
    select: { code: true, objectGroup: true, intendToBorrow: true },
    take: 1,
  },
} satisfies Prisma.LeadInclude;

export type OpsLeadWithRelations = Prisma.LeadGetPayload<{
  include: typeof leadListInclude;
}>;

function opsLeadWhere(filters: OpsLeadListFilters): Prisma.LeadWhereInput {
  return {
    assignedBrokerId: null,
    source: { notIn: [...OPS_EXCLUDED_SOURCES] },
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.source ? { source: filters.source } : {}),
    ...(filters.segment ? { segment: filters.segment } : {}),
  };
}

export async function listOpsLeadsForAdmin(
  filters: OpsLeadListFilters = {},
): Promise<OpsLeadWithRelations[]> {
  return prisma.lead.findMany({
    where: opsLeadWhere(filters),
    include: leadListInclude,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getOpsLeadForAdmin(
  id: string,
): Promise<OpsLeadWithRelations | null> {
  return prisma.lead.findFirst({
    where: {
      id,
      assignedBrokerId: null,
      source: { notIn: [...OPS_EXCLUDED_SOURCES] },
    },
    include: leadListInclude,
  });
}

export type OpsLeadPatchInput = {
  status?: LeadStatus;
  opsNote?: string | null;
  nurtureScriptId?: string | null;
  channels?: Partial<{
    phone: string | null;
    zalo: string | null;
    email: string | null;
    facebook: string | null;
  }>;
  commission?: CommissionOverride;
};

export class OpsLeadPatchError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "OpsLeadPatchError";
  }
}

export async function patchOpsLeadForAdmin(
  id: string,
  patch: OpsLeadPatchInput,
): Promise<OpsLeadWithRelations | null> {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: {
        id,
        assignedBrokerId: null,
        source: { notIn: [...OPS_EXCLUDED_SOURCES] },
      },
      include: {
        referral: { select: { brokerId: true } },
        listing: { select: { price: true } },
        commission: { select: { id: true } },
        customer: { select: { name: true, phone: true, email: true } },
      },
    });

    if (!lead) return null;

    const movingToWon =
      patch.status === "WON" && lead.status !== "WON" && patch.status !== undefined;

    let commissionResult = null;
    if (movingToWon) {
      commissionResult = await createCommissionOnWon(tx, lead, patch.commission);
      if (
        !commissionResult.created &&
        commissionResult.reason !== "ALREADY_EXISTS"
      ) {
        throw new OpsLeadPatchError(
          commissionResult.reason,
          commissionResult.reason === "NO_BROKER_ATTRIBUTION"
            ? "Không thể chuyển WON: lead chưa gắn broker."
            : "Không thể chuyển WON: thiếu thông tin hoa hồng.",
        );
      }
    }

    const opsMetaPatch: Parameters<typeof mergeLeadOpsMeta>[1] = {};
    if (patch.opsNote !== undefined) opsMetaPatch.opsNote = patch.opsNote;
    if (patch.nurtureScriptId !== undefined) {
      opsMetaPatch.nurtureScriptId = patch.nurtureScriptId;
    }
    if (patch.channels !== undefined) opsMetaPatch.channels = patch.channels;

    let nextOpsMeta: unknown = lead.opsMeta;
    if (Object.keys(opsMetaPatch).length > 0) {
      nextOpsMeta = mergeLeadOpsMeta(nextOpsMeta, opsMetaPatch);
    }

    const movingToContacted =
      patch.status === "CONTACTED" && lead.status !== "CONTACTED";

    if (movingToContacted && lead.customer) {
      const ops = readLeadOpsMeta(nextOpsMeta);
      const nurtureMeta = await tryEnqueueLeadNurture(tx, {
        leadId: lead.id,
        opsMeta: nextOpsMeta,
        nurtureScriptId: ops.nurtureScriptId,
        segment: lead.segment,
        source: lead.source,
        trigger: "status_contacted",
        contact: {
          name: lead.customer.name,
          phone: lead.customer.phone,
          email: lead.customer.email,
        },
      });
      if (nurtureMeta) nextOpsMeta = nurtureMeta;
    }

    const updated = await tx.lead.update({
      where: { id },
      data: {
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(nextOpsMeta !== lead.opsMeta
          ? { opsMeta: nextOpsMeta as Prisma.InputJsonValue }
          : {}),
      },
      include: leadListInclude,
    });

    if (patch.status !== undefined && patch.status !== lead.status) {
      await recordStatusChange(tx, {
        entity: "lead",
        entityId: lead.id,
        fromStatus: lead.status,
        toStatus: patch.status,
        actor: "admin",
      });
    }

    if (movingToWon) {
      await enqueueEvent(
        tx,
        "lead.won",
        { leadId: updated.id, status: updated.status },
        `lead.won:${updated.id}`,
      );
      if (commissionResult?.created) {
        await enqueueEvent(
          tx,
          "commission.created",
          {
            commissionId: commissionResult.commissionId,
            leadId: updated.id,
            brokerId: commissionResult.brokerId,
            amount: String(commissionResult.amount),
            rate: commissionResult.rate,
          },
          `commission.created:${commissionResult.commissionId}`,
        );
      }
    }

    return updated;
  });
}

export function serializeOpsLeadListItem(row: OpsLeadWithRelations) {
  const ops = readLeadOpsMeta(row.opsMeta);
  const script = getNurtureScript(ops.nurtureScriptId);
  const phone =
    ops.channels.phone ?? row.customer?.phone ?? null;

  return {
    id: row.id,
    status: row.status,
    statusLabel: LEAD_STATUS_LABELS[row.status],
    source: row.source,
    sourceLabel: LEAD_SOURCE_LABELS[row.source] ?? row.source,
    segment: row.segment,
    customerName: row.customer?.name ?? null,
    phoneMasked: maskLeadPhone(phone),
    nurtureScriptId: ops.nurtureScriptId,
    nurtureScriptLabel: script?.label ?? null,
    projectName: row.project?.name ?? null,
    listingTitle: row.listing?.code ?? null,
    messagePreview: ops.wizardSnapshot?.listPreviewVi
      ? ops.wizardSnapshot.listPreviewVi.length > 140
        ? `${ops.wizardSnapshot.listPreviewVi.slice(0, 140)}…`
        : ops.wizardSnapshot.listPreviewVi
      : row.message
        ? (() => {
            const legacy = parseLegacyNoxhLeadMessage(row.message);
            const text = legacy
              ? formatLegacyNoxhLeadPreviewVi(legacy)
              : row.message;
            return text.length > 140 ? `${text.slice(0, 140)}…` : text;
          })()
        : null,
    noxhCaseCode: row.noxhCases[0]?.code ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeOpsLeadDetail(row: OpsLeadWithRelations) {
  const ops = readLeadOpsMeta(row.opsMeta);
  const script = getNurtureScript(ops.nurtureScriptId);
  const linkedCase = row.noxhCases[0];
  const objectGroupId = linkedCase?.objectGroup as
    | NoxhObjectGroupId
    | undefined;
  const objectGroupLabel =
    objectGroupId && NOXH_OBJECT_GROUPS[objectGroupId]
      ? NOXH_OBJECT_GROUPS[objectGroupId].label
      : null;

  return {
    ...serializeOpsLeadListItem(row),
    message: row.message,
    wizardSnapshot: ops.wizardSnapshot ?? null,
    objectGroupLabel,
    intendToBorrowFromCase: linkedCase?.intendToBorrow ?? null,
    opsNote: ops.opsNote,
    channels: {
      phone: ops.channels.phone ?? row.customer?.phone ?? null,
      zalo: ops.channels.zalo ?? null,
      email: ops.channels.email ?? row.customer?.email ?? null,
      facebook: ops.channels.facebook ?? null,
    },
    nurtureScript: script
      ? {
          id: script.id,
          label: script.label,
          description: script.description,
          channel: script.channel,
        }
      : null,
    nurtureCatalog: NURTURE_SCRIPT_CATALOG.map((s) => ({
      id: s.id,
      label: s.label,
      channel: s.channel,
    })),
    project: row.project,
    listing: row.listing,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function countOpsLeadsByStatus(rows: { status: LeadStatus }[]) {
  const counts: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    WON: 0,
    LOST: 0,
  };
  for (const row of rows) {
    counts[row.status] += 1;
  }
  return counts;
}
