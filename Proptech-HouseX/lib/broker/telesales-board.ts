/**
 * Broker-scoped telesales board — reuses Ops SOP helpers (telesales.ts + activity).
 * Does NOT clone ops pool filters; queue = assigned / CTV-owned only.
 */
import type { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  OpsLeadPatchError,
} from "@/lib/leads/ops-lead-board";
import {
  maskLeadPhone,
  mergeLeadOpsMeta,
  readLeadOpsMeta,
} from "@/lib/leads/ops-meta";
import { getNurtureScript } from "@/lib/leads/nurture-scripts";
import {
  appendSalesActivity,
  assignLead,
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
import {
  assertLeadReadableByBroker,
  type BrokerTelesalesAccess,
  type BrokerTelesalesType,
} from "@/lib/broker/telesales-access";

const leadListInclude = {
  customer: { select: { name: true, phone: true, email: true } },
  project: { select: { name: true, slug: true } },
  listing: { select: { code: true, propertyType: true } },
  noxhCases: {
    where: { caseStatus: "ACTIVE" },
    select: { code: true, objectGroup: true, intendToBorrow: true, brokerId: true },
    take: 1,
  },
} satisfies Prisma.LeadInclude;

export type BrokerTelesalesLead = Prisma.LeadGetPayload<{
  include: typeof leadListInclude;
}>;

function brokerLeadWhere(
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">,
  status?: LeadStatus,
): Prisma.LeadWhereInput {
  const ownAssigned: Prisma.LeadWhereInput = {
    assignedBrokerId: access.brokerId,
  };

  const scope: Prisma.LeadWhereInput =
    access.brokerType === "CTV"
      ? {
          OR: [
            ownAssigned,
            {
              noxhCases: {
                some: {
                  brokerId: access.brokerId,
                  caseStatus: "ACTIVE",
                },
              },
            },
          ],
        }
      : ownAssigned;

  return {
    ...scope,
    ...(status ? { status } : {}),
  };
}

export async function listBrokerTelesalesLeads(
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">,
  filters: { status?: LeadStatus } = {},
): Promise<BrokerTelesalesLead[]> {
  return prisma.lead.findMany({
    where: brokerLeadWhere(access, filters.status),
    include: leadListInclude,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getBrokerTelesalesLead(
  leadId: string,
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">,
): Promise<BrokerTelesalesLead | null> {
  const row = await prisma.lead.findUnique({
    where: { id: leadId },
    include: leadListInclude,
  });
  if (!row) return null;
  assertLeadReadableByBroker(row, access);
  return row;
}

export function serializeBrokerTelesalesListItem(row: BrokerTelesalesLead) {
  const ops = readLeadOpsMeta(row.opsMeta);
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
    /** List always masked — full phone only via contact bundle. */
    phoneMasked: maskLeadPhone(phone),
    projectName: row.project?.name ?? null,
    noxhCaseCode: row.noxhCases[0]?.code ?? null,
    assignedBrokerId: row.assignedBrokerId,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeBrokerTelesalesDetail(row: BrokerTelesalesLead) {
  const ops = readLeadOpsMeta(row.opsMeta);
  const script = getNurtureScript(ops.nurtureScriptId);
  return {
    ...serializeBrokerTelesalesListItem(row),
    message: row.message,
    opsNote: ops.opsNote,
    nurtureScriptId: ops.nurtureScriptId,
    nurtureScriptLabel: script?.label ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getBrokerTelesalesContactBundle(
  leadId: string,
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">,
) {
  const row = await getBrokerTelesalesLead(leadId, access);
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

  return {
    detail: serializeBrokerTelesalesDetail(row),
    /** Unmask — own lead/case only (asserted above). */
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
      "Phase 1: deep-link gọi/SMS/Zalo. Server OA/SMS chỉ dành cho Ops.",
  };
}

function telesalesNote(result: TelesalesResult): string {
  const labels: Record<TelesalesResult, string> = {
    CONNECTED: "Đàm thoại thành công",
    SEND_INFO: "Khách xin gửi thông tin / kết bạn Zalo",
    NO_ANSWER: "Không nghe máy / bận",
    WRONG_NUMBER: "Sai số",
    HARD_REJECT: "Từ chối cứng",
    NOT_THIS_PROJECT: "Không quan tâm dự án hiện tại — ấm lead dự án khác",
    SMS_SENT: "Mở SMS chào",
    ZALO_OPENED: "Mở Zalo để xem / nhắn",
  };
  return labels[result];
}

async function patchBrokerLeadStatus(
  leadId: string,
  patch: {
    status?: LeadStatus;
    nurtureScriptId?: string | null;
    opsNote?: string | null;
  },
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return;

  const opsMetaPatch: Parameters<typeof mergeLeadOpsMeta>[1] = {};
  if (patch.opsNote !== undefined) opsMetaPatch.opsNote = patch.opsNote;
  if (patch.nurtureScriptId !== undefined) {
    opsMetaPatch.nurtureScriptId = patch.nurtureScriptId;
  }

  let nextOpsMeta: unknown = lead.opsMeta;
  if (Object.keys(opsMetaPatch).length > 0) {
    nextOpsMeta = mergeLeadOpsMeta(nextOpsMeta, opsMetaPatch);
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(nextOpsMeta !== lead.opsMeta
        ? { opsMeta: nextOpsMeta as Prisma.InputJsonValue }
        : {}),
    },
  });
}

export async function recordBrokerTelesalesContact(input: {
  leadId: string;
  result: TelesalesResult;
  note?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">;
}) {
  const row = await getBrokerTelesalesLead(input.leadId, input.access);
  if (!row) {
    throw new OpsLeadPatchError("NOT_FOUND", "Không tìm thấy lead trong phạm vi.");
  }

  const mapped = mapResultToActivity(input.result);
  const now = new Date();

  if (mapped.channel === "phone" && mapped.type !== "NOTE") {
    const bundle = await getBrokerTelesalesContactBundle(
      input.leadId,
      input.access,
    );
    if (
      bundle?.callBlockedUntil &&
      new Date(bundle.callBlockedUntil) > now &&
      input.result === "NO_ANSWER" &&
      bundle.lastContact?.reason === "NO_ANSWER"
    ) {
      throw new OpsLeadPatchError(
        "CALL_COOLDOWN",
        `Đang trong cửa sổ chống gọi trùng đến ${bundle.callBlockedUntil}. Dùng SMS/Zalo hoặc chờ Task gọi lại.`,
      );
    }
  }

  const { activity } = await appendSalesActivity({
    leadId: input.leadId,
    type: mapped.type,
    channel: mapped.channel,
    note: input.note ?? telesalesNote(input.result),
    reason: input.result,
    actorId: input.actorId,
    occurredAt: now,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    metadata: {
      telesales: true,
      result: input.result,
      lane: "broker",
      brokerType: input.access.brokerType,
    },
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
        metadata: { telesales: true, lane: "broker" },
      });
    }
  }

  if (mapped.assignWarmScript) {
    await patchBrokerLeadStatus(input.leadId, {
      nurtureScriptId: WARM_OTHER_PROJECTS_SCRIPT_ID,
      status: mapped.suggestLeadStatus,
      opsNote: input.note
        ? `${readLeadOpsMeta(row.opsMeta).opsNote ?? ""}\n[Ấm] ${input.note}`.trim()
        : undefined,
    });
  } else if (mapped.suggestLeadStatus) {
    const terminal = row.status === "WON" || row.status === "LOST";
    if (!terminal && row.status !== mapped.suggestLeadStatus) {
      await patchBrokerLeadStatus(input.leadId, {
        status: mapped.suggestLeadStatus,
      });
    }
  }

  return {
    activity,
    bundle: await getBrokerTelesalesContactBundle(input.leadId, input.access),
  };
}

/** Super: gán lead pool Ops → môi giới INTERNAL (rời pool). */
export async function assignOpsLeadToInternalBroker(input: {
  leadId: string;
  brokerId: string;
  assignedBy: string;
  reason?: string | null;
  correlationId: string;
  idempotencyKey: string;
}) {
  const broker = await prisma.broker.findUnique({
    where: { id: input.brokerId },
    select: { id: true, brokerType: true, fullName: true },
  });
  if (!broker || broker.brokerType !== "INTERNAL") {
    throw new OpsLeadPatchError(
      "INVALID_BROKER",
      "Chỉ gán lead cho môi giới nội sàn (brokerType = INTERNAL).",
    );
  }

  const lead = await prisma.lead.findFirst({
    where: {
      id: input.leadId,
      assignedBrokerId: null,
    },
    select: { id: true },
  });
  if (!lead) {
    throw new OpsLeadPatchError(
      "NOT_FOUND",
      "Lead không còn trong pool Ops (đã gán hoặc không tồn tại).",
    );
  }

  const now = new Date();
  const result = await assignLead({
    leadId: input.leadId,
    ownerId: input.brokerId,
    assignedBy: input.assignedBy,
    assignedAt: now,
    reason: input.reason ?? "assign_internal_floor",
    acceptanceSlaMinutes: 60,
    firstResponseSlaMinutes: 240,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
  });

  return {
    ...result,
    broker: { id: broker.id, fullName: broker.fullName },
  };
}

export async function listInternalBrokers() {
  return prisma.broker.findMany({
    where: { brokerType: "INTERNAL" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      ctvCode: true,
      userAccount: { select: { email: true } },
    },
    orderBy: { fullName: "asc" },
    take: 100,
  });
}

export async function patchBrokerTypeAdmin(
  brokerId: string,
  brokerType: BrokerTelesalesType | "FREE" | "AGENCY" | "CTV",
) {
  return prisma.broker.update({
    where: { id: brokerId },
    data: { brokerType },
    select: {
      id: true,
      fullName: true,
      phone: true,
      brokerType: true,
      ctvCode: true,
    },
  });
}
