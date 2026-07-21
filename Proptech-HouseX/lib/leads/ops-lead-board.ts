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
import { isValidVnPhone, normalizeVnPhone } from "@/lib/phone";
import {
  appendSalesActivity,
  listSalesActivitiesForLead,
} from "@/lib/sales-core/service";
import {
  CALLBACK_SLA_HOURS,
  WARM_OTHER_PROJECTS_SCRIPT_ID,
  callBlockedUntil,
  mapResultToActivity,
  smsDeepLink,
  telDeepLink,
  zaloOpenHint,
  type TelesalesResult,
} from "@/lib/leads/telesales";
import { resolveCallCueForLead } from "@/lib/leads/telesales-project-facts";

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
  [LEAD_SOURCE.HOT_MANUAL]: "Hot — nhập tay",
  [LEAD_SOURCE.ADS_OFFLINE]: "Ads offline",
  [LEAD_SOURCE.PARTNER]: "Đối tác / công ty",
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

const HOT_SOURCES = [
  LEAD_SOURCE.HOT_MANUAL,
  LEAD_SOURCE.ADS_OFFLINE,
  LEAD_SOURCE.PARTNER,
  LEAD_SOURCE.OPS_MANUAL,
] as const;

type HotLeadSource = (typeof HOT_SOURCES)[number];

function resolveHotSource(source: string | undefined): HotLeadSource {
  if (source && (HOT_SOURCES as readonly string[]).includes(source)) {
    return source as HotLeadSource;
  }
  return LEAD_SOURCE.HOT_MANUAL;
}

export type CreateOpsHotLeadInput = {
  name: string;
  phone: string;
  source?: string;
  segment?: LeadSegment | null;
  note?: string | null;
  actorId: string;
};

export async function createOpsHotLead(input: CreateOpsHotLeadInput) {
  const normalizedPhone = normalizeVnPhone(input.phone);
  if (!isValidVnPhone(normalizedPhone)) {
    throw new OpsLeadPatchError("INVALID_PHONE", "SĐT Việt Nam không hợp lệ.");
  }
  const source = resolveHotSource(input.source);
  const displayPhone = digitsFromNormalized(normalizedPhone);
  const name = input.name.trim() || "Khách hot";

  const existing = await prisma.customer.findUnique({
    where: { normalizedPhone },
    select: { id: true },
  });

  const correlationId = `ops-hot-${Date.now()}`;
  const result = await prisma.$transaction(async (tx) => {
    const customer =
      existing ??
      (await tx.customer.create({
        data: {
          name,
          phone: displayPhone,
          normalizedPhone,
        },
      }));

    if (existing) {
      await tx.customer.update({
        where: { id: customer.id },
        data: { name },
      });
    }

    const openLead = await tx.lead.findFirst({
      where: {
        customerId: customer.id,
        status: { in: ["NEW", "CONTACTED", "QUALIFIED"] },
        assignedBrokerId: null,
        source: { notIn: [...OPS_EXCLUDED_SOURCES] },
      },
      orderBy: { createdAt: "desc" },
    });
    if (openLead) {
      return { leadId: openLead.id, created: false as const, customerId: customer.id };
    }

    const opsMeta = mergeLeadOpsMeta(null, {
      opsNote: input.note ?? null,
      channels: { phone: displayPhone },
    });

    const lead = await tx.lead.create({
      data: {
        customerId: customer.id,
        source,
        segment: input.segment ?? null,
        status: "NEW",
        message: input.note ?? "Lead hot — Ops nhập tay",
        opsMeta: opsMeta as Prisma.InputJsonValue,
      },
    });

    return { leadId: lead.id, created: true as const, customerId: customer.id };
  });

  if (result.created) {
    await appendSalesActivity({
      leadId: result.leadId,
      type: "TASK",
      channel: "phone",
      note: "Gọi lần 1",
      reason: "CALL_FIRST",
      actorId: input.actorId,
      occurredAt: new Date(),
      dueAt: new Date(),
      correlationId: `${correlationId}:task`,
      idempotencyKey: `${correlationId}:task`,
      metadata: { telesales: true, hotCreate: true },
    });
  }

  const row = await getOpsLeadForAdmin(result.leadId);
  return { ...result, lead: row };
}

function digitsFromNormalized(normalized: string): string {
  if (normalized.startsWith("+84")) return `0${normalized.slice(3)}`;
  return normalized;
}

export async function getOpsLeadContactBundle(leadId: string) {
  const row = await getOpsLeadForAdmin(leadId);
  if (!row) return null;

  const phone =
    readLeadOpsMeta(row.opsMeta).channels.phone ?? row.customer?.phone ?? null;
  const activities = await listSalesActivitiesForLead(leadId, 40);
  const lastPhone = activities.find(
    (a) =>
      a.channel === "phone" &&
      (a.type === "CONTACT_ATTEMPT" || a.type === "CONNECTED"),
  );
  const openCallback = activities.find(
    (a) =>
      a.type === "TASK" &&
      a.reason === "CALL_BACK" &&
      a.dueAt &&
      a.dueAt.getTime() > Date.now() - 7 * 24 * 3_600_000,
  );
  const blockedUntil = callBlockedUntil(
    lastPhone?.occurredAt ?? null,
    lastPhone?.reason ?? null,
  );

  const { callCue, deferredSegment } = await resolveCallCueForLead({
    segment: row.segment,
    projectId: row.projectId,
  });

  return {
    detail: serializeOpsLeadDetail(row),
    phone,
    deepLinks: phone
      ? {
          tel: telDeepLink(phone),
          sms: smsDeepLink(phone),
          zalo: zaloOpenHint(phone),
        }
      : null,
    lastContact: lastPhone
      ? {
          at: lastPhone.occurredAt.toISOString(),
          type: lastPhone.type,
          reason: lastPhone.reason,
          channel: lastPhone.channel,
          actorId: lastPhone.actorId,
          note: lastPhone.note,
        }
      : null,
    callBlockedUntil: blockedUntil?.toISOString() ?? null,
    openCallbackTask: openCallback
      ? {
          id: openCallback.id,
          dueAt: openCallback.dueAt?.toISOString() ?? null,
          note: openCallback.note,
        }
      : null,
    activities: activities.map((a) => ({
      id: a.id,
      type: a.type,
      channel: a.channel,
      note: a.note,
      reason: a.reason,
      actorId: a.actorId,
      occurredAt: a.occurredAt.toISOString(),
      dueAt: a.dueAt?.toISOString() ?? null,
    })),
    conversionHint:
      "Chỉ sang /admin/conversion khi đã đàm thoại OK và có hướng căn/dự án cụ thể.",
    callCue,
    deferredSegment,
  };
}

export async function recordOpsTelesalesContact(input: {
  leadId: string;
  result: TelesalesResult;
  note?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  const row = await getOpsLeadForAdmin(input.leadId);
  if (!row) {
    throw new OpsLeadPatchError("NOT_FOUND", "Không tìm thấy lead Ops.");
  }

  const mapped = mapResultToActivity(input.result);
  const now = new Date();

  if (mapped.channel === "phone" && mapped.type !== "NOTE") {
    const bundle = await getOpsLeadContactBundle(input.leadId);
    if (
      bundle?.callBlockedUntil &&
      new Date(bundle.callBlockedUntil) > now &&
      input.result === "NO_ANSWER"
    ) {
      // Allow logging NO_ANSWER only once in window — block repeat phone attempts
    }
    if (
      bundle?.callBlockedUntil &&
      new Date(bundle.callBlockedUntil) > now &&
      (input.result === "CONNECTED" ||
        input.result === "SEND_INFO" ||
        input.result === "NO_ANSWER" ||
        input.result === "WRONG_NUMBER" ||
        input.result === "HARD_REJECT" ||
        input.result === "NOT_THIS_PROJECT")
    ) {
      // Re-logging CONNECTED during cooldown is OK; blocking new call attempts:
      // UI blocks Call button. Server: block NO_ANSWER spam only if last was also NO_ANSWER within window
      if (
        input.result === "NO_ANSWER" &&
        bundle.lastContact?.reason === "NO_ANSWER"
      ) {
        throw new OpsLeadPatchError(
          "CALL_COOLDOWN",
          `Đang trong cửa sổ chống gọi trùng đến ${bundle.callBlockedUntil}. Dùng SMS/Zalo hoặc chờ Task gọi lại.`,
        );
      }
    }
  }

  const { activity } = await appendSalesActivity({
    leadId: input.leadId,
    type: mapped.type,
    channel: mapped.channel,
    note: input.note ?? TELESALES_NOTE(input.result),
    reason: input.result,
    actorId: input.actorId,
    occurredAt: now,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    metadata: { telesales: true, result: input.result },
  });

  if (mapped.createCallbackTask) {
    const open = await prisma.salesActivity.findFirst({
      where: {
        leadId: input.leadId,
        type: "TASK",
        reason: "CALL_BACK",
        dueAt: { gte: new Date(now.getTime() - 24 * 3_600_000) },
      },
    });
    if (!open) {
      await appendSalesActivity({
        leadId: input.leadId,
        type: "TASK",
        channel: "phone",
        note: "Gọi lại sau miss / hẹn gửi tin",
        reason: "CALL_BACK",
        actorId: input.actorId,
        occurredAt: now,
        dueAt: new Date(now.getTime() + CALLBACK_SLA_HOURS * 3_600_000),
        correlationId: `${input.correlationId}:callback`,
        idempotencyKey: `${input.idempotencyKey}:callback`,
        metadata: { telesales: true },
      });
    }
  }

  if (mapped.assignWarmScript) {
    await patchOpsLeadForAdmin(input.leadId, {
      nurtureScriptId: WARM_OTHER_PROJECTS_SCRIPT_ID,
      status: mapped.suggestLeadStatus,
      opsNote: input.note
        ? `${readLeadOpsMeta(row.opsMeta).opsNote ?? ""}\n[Ấm] ${input.note}`.trim()
        : undefined,
    });
  } else if (mapped.suggestLeadStatus) {
    const terminal = row.status === "WON" || row.status === "LOST";
    if (!terminal && row.status !== mapped.suggestLeadStatus) {
      await patchOpsLeadForAdmin(input.leadId, {
        status: mapped.suggestLeadStatus,
      });
    }
  }

  return {
    activity,
    bundle: await getOpsLeadContactBundle(input.leadId),
  };
}

function TELESALES_NOTE(result: TelesalesResult): string {
  const labels: Record<TelesalesResult, string> = {
    CONNECTED: "Đàm thoại thành công",
    SEND_INFO: "Khách xin gửi thông tin / kết bạn Zalo",
    NO_ANSWER: "Không nghe máy / bận",
    WRONG_NUMBER: "Sai số",
    HARD_REJECT: "Từ chối cứng",
    NOT_THIS_PROJECT: "Không quan tâm dự án hiện tại — ấm lead dự án khác",
    SMS_SENT: "Ops mở SMS chào",
    ZALO_OPENED: "Ops mở Zalo để xem / nhắn",
  };
  return labels[result];
}

