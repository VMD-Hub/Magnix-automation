import type {
  NoxhDocStatus,
  NoxhMilestone,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { enqueueEvent } from "@/lib/events/outbox";
import {
  mergeInboundOpsMeta,
  readInboundOpsMeta,
} from "@/lib/inbound/ops-meta";
import { buildDocumentChecklist, countDocProgress } from "@/lib/noxh-case/doc-catalog";
import {
  computeClaimLockExpiry,
  evaluateCtvClaim,
  type ClaimRejectReason,
} from "@/lib/noxh-case/attribution-claim";
import { queueConflictFromCtvClaim } from "@/lib/attribution/conflict";
import {
  computeExtendedLockExpiry,
  evaluateCtvLockCompliance,
} from "@/lib/noxh-case/ctv-lock-compliance";
import { accrueNoxhCommissionOnSigned } from "@/lib/noxh-case/commission-accrual";
import { notifyBrokerMilestoneChange } from "@/lib/noxh-case/case-maintenance";

const caseInclude = {
  project: { select: { id: true, name: true, slug: true } },
  broker: { select: { id: true, fullName: true, ctvCode: true } },
  documents: { orderBy: { docType: "asc" as const } },
  assistLogs: { orderBy: { createdAt: "desc" as const }, take: 20 },
  lead: {
    select: {
      id: true,
      status: true,
      message: true,
      source: true,
      commission: true,
    },
  },
} satisfies Prisma.NoxhCaseInclude;

export async function generateNoxhCaseCode(): Promise<string> {
  const count = await prisma.noxhCase.count();
  return `HX-NOXH-${String(count + 1).padStart(6, "0")}`;
}

export class CtvClaimError extends Error {
  constructor(
    public code: ClaimRejectReason,
    message: string,
  ) {
    super(message);
    this.name = "CtvClaimError";
  }
}

export class CtvScheduleError extends Error {
  constructor(
    public code: "INVALID_CONSULT_SCHEDULE" | "CONSULT_SCHEDULE_PAST",
    message: string,
  ) {
    super(message);
    this.name = "CtvScheduleError";
  }
}

export type PlatformNoxhCaseRejectReason =
  | "INVALID_PHONE"
  | "INBOUND_NOT_FOUND"
  | "LEAD_NOT_FOUND"
  | "CASE_EXISTS";

export class PlatformNoxhCaseError extends Error {
  constructor(
    public code: PlatformNoxhCaseRejectReason,
    message: string,
    public existingCaseId?: string,
    public existingCaseCode?: string,
  ) {
    super(message);
    this.name = "PlatformNoxhCaseError";
  }
}

/** Ops tạo hồ sơ NOXH từ lead sàn / Magnix inbound — không gán CTV. */
export async function createPlatformNoxhCase(params: {
  customerName: string;
  phone: string;
  projectId?: string | null;
  objectGroup?: NoxhObjectGroupId;
  intendToBorrow?: boolean;
  opsNote?: string;
  leadId?: string | null;
  inboundLeadId?: string | null;
}) {
  const normalizedPhone = normalizeVnPhone(params.phone);
  if (!isValidVnPhone(normalizedPhone)) {
    throw new PlatformNoxhCaseError(
      "INVALID_PHONE",
      "Số điện thoại không hợp lệ.",
    );
  }

  const objectGroup = params.objectGroup ?? "WORKER";
  const intendToBorrow = params.intendToBorrow ?? false;

  return prisma.$transaction(async (tx) => {
    let inbound: Awaited<ReturnType<typeof tx.inboundUidLead.findUnique>> = null;
    if (params.inboundLeadId) {
      inbound = await tx.inboundUidLead.findUnique({
        where: { id: params.inboundLeadId },
      });
      if (!inbound) {
        throw new PlatformNoxhCaseError(
          "INBOUND_NOT_FOUND",
          "Không tìm thấy inbound lead.",
        );
      }

      const inboundOps = readInboundOpsMeta(inbound.meta);
      if (inboundOps.noxh_case_id) {
        const existing = await tx.noxhCase.findUnique({
          where: { id: inboundOps.noxh_case_id },
          include: caseInclude,
        });
        if (existing) {
          return { case: existing, created: false as const, inbound };
        }
      }
    }

    let leadId = params.leadId ?? null;
    if (!leadId && inbound) {
      const inboundOps = readInboundOpsMeta(inbound.meta);
      leadId = inboundOps.platform_lead_id;
    }

    let lead = leadId
      ? await tx.lead.findUnique({ where: { id: leadId } })
      : null;
    if (leadId && !lead) {
      throw new PlatformNoxhCaseError("LEAD_NOT_FOUND", "Không tìm thấy lead sàn.");
    }

    if (lead) {
      const existingByLead = await tx.noxhCase.findUnique({
        where: { leadId: lead.id },
        include: caseInclude,
      });
      if (existingByLead) {
        throw new PlatformNoxhCaseError(
          "CASE_EXISTS",
          `Lead đã có hồ sơ ${existingByLead.code}.`,
          existingByLead.id,
          existingByLead.code,
        );
      }
    }

    const customer = await tx.customer.upsert({
      where: { normalizedPhone },
      update: { name: params.customerName, phone: params.phone },
      create: {
        name: params.customerName,
        phone: params.phone,
        normalizedPhone,
      },
    });

    if (!lead) {
      const message =
        inbound?.text ??
        `[Ops NOXH] ${params.customerName}`;
      const source = inbound
        ? `magnix:${inbound.uidSource}`
        : "ops_noxh";

      lead = await tx.lead.create({
        data: {
          customerId: customer.id,
          projectId: params.projectId ?? undefined,
          source,
          message,
          // Giữ NEW — fairplay R4 qua NoxhCase active (xem attribution-claim).
        },
      });
    } else {
      lead = await tx.lead.update({
        where: { id: lead.id },
        data: {
          customerId: customer.id,
          projectId: params.projectId ?? lead.projectId ?? undefined,
        },
      });
    }

    const code = await generateNoxhCaseCodeInTx(tx);
    const now = new Date();

    const noxhCase = await tx.noxhCase.create({
      data: {
        code,
        customerName: params.customerName,
        phone: params.phone,
        normalizedPhone,
        brokerId: null,
        leadId: lead.id,
        projectId: params.projectId ?? lead.projectId ?? undefined,
        objectGroup,
        intendToBorrow,
        milestone: "M1_RECEIVED",
        milestoneSub: "M1_SCHEDULED",
        firstContactedAt: now,
        opsNote: params.opsNote ?? null,
      },
      include: caseInclude,
    });

    const checklist = buildDocumentChecklist({ objectGroup, intendToBorrow });
    await tx.caseDocument.createMany({
      data: checklist.map((d) => ({
        caseId: noxhCase.id,
        docType: d.docType,
        status: d.initialStatus,
        ctvActionHint: d.ctvActionHint,
      })),
    });

    await tx.caseMilestoneEvent.create({
      data: {
        caseId: noxhCase.id,
        toMilestone: "M1_RECEIVED",
        milestoneSub: "M1_SCHEDULED",
        actor: "admin",
        opsNote: params.opsNote ?? undefined,
      },
    });

    await enqueueEvent(
      tx,
      "noxh_case.created",
      {
        caseId: noxhCase.id,
        caseCode: code,
        brokerId: null,
        milestone: "M1_RECEIVED",
        customerName: params.customerName,
        normalizedPhone,
      },
      `noxh_case.created:${noxhCase.id}`,
    );

    if (inbound) {
      const meta = mergeInboundOpsMeta(inbound.meta, {
        ops_status: "converted",
        platform_lead_id: lead.id,
        noxh_case_id: noxhCase.id,
        noxh_case_code: code,
      });
      await tx.inboundUidLead.update({
        where: { id: inbound.id },
        data: { meta: meta as Prisma.InputJsonValue },
      });
    }

    const withDocs = await tx.noxhCase.findUniqueOrThrow({
      where: { id: noxhCase.id },
      include: caseInclude,
    });

    return { case: withDocs, created: true as const, inbound };
  });
}

export async function createCtvClaim(params: {
  brokerId: string;
  brokerPhone: string;
  customerName: string;
  phone: string;
  projectId?: string;
  objectGroup?: NoxhObjectGroupId;
  intendToBorrow?: boolean;
  message?: string;
  consultScheduledAt: Date;
}) {
  const normalizedPhone = normalizeVnPhone(params.phone);
  const brokerNormalizedPhone = normalizeVnPhone(params.brokerPhone);
  const objectGroup = params.objectGroup ?? "WORKER";
  const intendToBorrow = params.intendToBorrow ?? false;

  return prisma.$transaction(async (tx) => {
    const evaluation = await evaluateCtvClaim(tx, {
      normalizedPhone,
      brokerId: params.brokerId,
      brokerNormalizedPhone,
    });
    if (!evaluation.ok) {
      await queueConflictFromCtvClaim(tx, {
        normalizedPhone,
        brokerId: params.brokerId,
        reason: evaluation.reason,
        customerName: params.customerName,
      });
      throw new CtvClaimError(evaluation.reason, evaluation.message);
    }

    const lockExpiresAt = computeClaimLockExpiry();
    const code = await generateNoxhCaseCodeInTx(tx);

    const customer = await tx.customer.upsert({
      where: { normalizedPhone },
      update: { name: params.customerName },
      create: {
        name: params.customerName,
        phone: params.phone,
        normalizedPhone,
      },
    });

    const lead = await tx.lead.create({
      data: {
        customerId: customer.id,
        projectId: params.projectId,
        assignedBrokerId: params.brokerId,
        source: "ctv_claim",
        message: params.message,
        status: "NEW",
      },
    });

    const noxhCase = await tx.noxhCase.create({
      data: {
        code,
        customerName: params.customerName,
        phone: params.phone,
        normalizedPhone,
        brokerId: params.brokerId,
        leadId: lead.id,
        projectId: params.projectId,
        objectGroup,
        intendToBorrow,
        lockExpiresAt,
        consultScheduledAt: params.consultScheduledAt,
        milestone: "M1_RECEIVED",
        milestoneSub: "M1_SCHEDULED",
      },
      include: caseInclude,
    });

    const checklist = buildDocumentChecklist({ objectGroup, intendToBorrow });
    await tx.caseDocument.createMany({
      data: checklist.map((d) => ({
        caseId: noxhCase.id,
        docType: d.docType,
        status: d.initialStatus,
        ctvActionHint: d.ctvActionHint,
      })),
    });

    await tx.caseMilestoneEvent.create({
      data: {
        caseId: noxhCase.id,
        toMilestone: "M1_RECEIVED",
        milestoneSub: "M1_SCHEDULED",
        actor: params.brokerId,
      },
    });

    await tx.attributionLock.upsert({
      where: { customerId: customer.id },
      create: {
        customerId: customer.id,
        brokerId: params.brokerId,
        source: "ctv_claim",
        expiresAt: lockExpiresAt,
      },
      update: {
        brokerId: params.brokerId,
        source: "ctv_claim",
        lockedAt: new Date(),
        expiresAt: lockExpiresAt,
      },
    });

    await enqueueEvent(
      tx,
      "noxh_case.created",
      {
        caseId: noxhCase.id,
        caseCode: code,
        brokerId: params.brokerId,
        milestone: "M1_RECEIVED",
        customerName: params.customerName,
        normalizedPhone,
      },
      `noxh_case.created:${noxhCase.id}`,
    );

    const withDocs = await tx.noxhCase.findUniqueOrThrow({
      where: { id: noxhCase.id },
      include: caseInclude,
    });

    return withDocs;
  });
}

async function generateNoxhCaseCodeInTx(
  tx: Prisma.TransactionClient,
): Promise<string> {
  const count = await tx.noxhCase.count();
  return `HX-NOXH-${String(count + 1).padStart(6, "0")}`;
}

export async function listNoxhCasesForBroker(brokerId: string) {
  return prisma.noxhCase.findMany({
    where: { brokerId },
    orderBy: { updatedAt: "desc" },
    include: caseInclude,
  });
}

export async function getNoxhCaseForBroker(caseId: string, brokerId: string) {
  return prisma.noxhCase.findFirst({
    where: { id: caseId, brokerId },
    include: caseInclude,
  });
}

export async function listNoxhCasesForAdmin(filters?: {
  status?: "ACTIVE" | "ALL";
  milestone?: NoxhMilestone;
}) {
  const where: Prisma.NoxhCaseWhereInput =
    filters?.status === "ACTIVE" ? { caseStatus: "ACTIVE" } : {};

  if (filters?.milestone) {
    where.milestone = filters.milestone;
  }

  return prisma.noxhCase.findMany({
    where,
    orderBy: [{ caseStatus: "asc" }, { updatedAt: "desc" }],
    include: caseInclude,
  });
}

export async function getNoxhCaseForAdmin(caseId: string) {
  return prisma.noxhCase.findUnique({
    where: { id: caseId },
    include: caseInclude,
  });
}

export async function updateNoxhCaseAdmin(
  caseId: string,
  patch: {
    milestone?: NoxhMilestone;
    milestoneSub?: string | null;
    caseStatus?: "ACTIVE" | "UNREACHABLE" | "DECLINED" | "COMPLETED" | "RELEASED";
    opsNote?: string | null;
    objectGroup?: string;
    intendToBorrow?: boolean;
    projectId?: string | null;
    markContacted?: boolean;
  },
  actor = "admin",
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.noxhCase.findUnique({
      where: { id: caseId },
      include: { documents: true, lead: true },
    });
    if (!existing) return null;

    const now = new Date();
    const data: Prisma.NoxhCaseUpdateInput = {};

    if (patch.opsNote !== undefined) data.opsNote = patch.opsNote;
    if (patch.milestoneSub !== undefined) data.milestoneSub = patch.milestoneSub;
    if (patch.caseStatus !== undefined) {
      data.caseStatus = patch.caseStatus;
      if (patch.caseStatus === "COMPLETED") data.completedAt = now;
      if (patch.caseStatus === "RELEASED") data.lockExpiresAt = now;
    }
    if (patch.projectId !== undefined) {
      data.project = patch.projectId
        ? { connect: { id: patch.projectId } }
        : { disconnect: true };
    }
    if (patch.objectGroup !== undefined || patch.intendToBorrow !== undefined) {
      const objectGroup = (patch.objectGroup ??
        existing.objectGroup) as NoxhObjectGroupId;
      const intendToBorrow = patch.intendToBorrow ?? existing.intendToBorrow;
      data.objectGroup = objectGroup;
      data.intendToBorrow = intendToBorrow;

      await tx.caseDocument.deleteMany({ where: { caseId } });
      const checklist = buildDocumentChecklist({ objectGroup, intendToBorrow });
      await tx.caseDocument.createMany({
        data: checklist.map((d) => ({
          caseId,
          docType: d.docType,
          status: d.initialStatus,
          ctvActionHint: d.ctvActionHint,
        })),
      });
    }

    if (patch.markContacted) {
      data.firstContactedAt = existing.firstContactedAt ?? now;
      data.milestoneSub = "M1_REACHED";
      if (existing.leadId) {
        await tx.lead.update({
          where: { id: existing.leadId },
          data: { status: "CONTACTED" },
        });
      }
    }

    if (patch.milestone && patch.milestone !== existing.milestone) {
      if (patch.milestone === "M3_SUBMITTED") {
        const progress = countDocProgress(existing.documents);
        if (progress.percent < 100) {
          throw new Error("DOCS_INCOMPLETE");
        }
      }
      data.milestone = patch.milestone;
      if (patch.milestone === "M5_SIGNED") {
        data.caseStatus = "COMPLETED";
        data.completedAt = now;
      }
      await tx.caseMilestoneEvent.create({
        data: {
          caseId,
          fromMilestone: existing.milestone,
          toMilestone: patch.milestone,
          milestoneSub: patch.milestoneSub ?? undefined,
          opsNote: patch.opsNote ?? undefined,
          actor,
        },
      });
      await enqueueEvent(
        tx,
        "noxh_case.milestone_changed",
        {
          caseId,
          caseCode: existing.code,
          brokerId: existing.brokerId,
          fromMilestone: existing.milestone,
          toMilestone: patch.milestone,
          milestoneSub: patch.milestoneSub ?? null,
          opsNote: patch.opsNote ?? null,
        },
        `noxh_case.milestone:${caseId}:${patch.milestone}:${now.getTime()}`,
      );

      if (existing.brokerId) {
        await notifyBrokerMilestoneChange(tx, {
          brokerId: existing.brokerId,
          caseId,
          caseCode: existing.code,
          toMilestone: patch.milestone,
          opsNote: patch.opsNote,
        });
      }

      if (patch.milestone === "M5_SIGNED") {
        await accrueNoxhCommissionOnSigned(tx, {
          id: caseId,
          code: existing.code,
          leadId: existing.leadId,
          brokerId: existing.brokerId,
        }, now);
      }
    }

    return tx.noxhCase.update({
      where: { id: caseId },
      data,
      include: caseInclude,
    });
  });
}

export async function updateCaseDocumentAdmin(
  caseId: string,
  docId: string,
  patch: {
    status: NoxhDocStatus;
    rejectReason?: string | null;
  },
  actor = "admin",
) {
  const now = new Date();
  const data: Prisma.CaseDocumentUpdateInput = {
    status: patch.status,
    updatedBy: actor,
  };

  if (patch.status === "RECEIVED") data.receivedAt = now;
  if (patch.status === "REVIEWING") data.reviewedAt = now;
  if (patch.status === "PASSED") {
    data.passedAt = now;
    data.rejectReason = null;
  }
  if (patch.status === "REJECTED") {
    data.rejectReason = patch.rejectReason ?? "Cần bổ sung";
  }

  const doc = await prisma.caseDocument.update({
    where: { id: docId, caseId },
    data,
  });

  await prisma.noxhCase.update({
    where: { id: caseId },
    data: { updatedAt: now },
  });

  return doc;
}

export async function createCaseAssistLog(params: {
  caseId: string;
  brokerId: string;
  assistType: "NUDGE" | "ESCORT" | "NOTE";
  message: string;
}) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.caseAssistLog.create({ data: params });

    await maybeExtendCtvLockOnProgress(tx, params.caseId);

    return log;
  });
}

async function maybeExtendCtvLockOnProgress(
  tx: Prisma.TransactionClient,
  caseId: string,
) {
  const caseRow = await tx.noxhCase.findUnique({
    where: { id: caseId },
    include: {
      assistLogs: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!caseRow?.brokerId || !caseRow.lockExpiresAt) return;

  const compliance = evaluateCtvLockCompliance({
    consultScheduledAt: caseRow.consultScheduledAt,
    lockExpiresAt: caseRow.lockExpiresAt,
    attributionLockedAt: caseRow.attributionLockedAt,
    caseStatus: caseRow.caseStatus,
    assistLogs: caseRow.assistLogs,
  });

  if (!compliance.canExtendLock) return;

  const nextExpiry = computeExtendedLockExpiry(caseRow.lockExpiresAt);
  if (nextExpiry <= caseRow.lockExpiresAt) return;

  const customer = await tx.customer.findUnique({
    where: { normalizedPhone: caseRow.normalizedPhone },
    select: { id: true },
  });

  await tx.noxhCase.update({
    where: { id: caseId },
    data: { lockExpiresAt: nextExpiry },
  });

  if (customer) {
    await tx.attributionLock.updateMany({
      where: { customerId: customer.id },
      data: { expiresAt: nextExpiry },
    });

    await tx.attributionEvent.create({
      data: {
        customerId: customer.id,
        toBroker: caseRow.brokerId,
        reason: "lock_extended",
      },
    });
  }
}

export async function updateCtvConsultSchedule(
  caseId: string,
  brokerId: string,
  consultScheduledAt: Date,
) {
  const row = await prisma.noxhCase.findFirst({
    where: { id: caseId, brokerId, caseStatus: "ACTIVE" },
  });
  if (!row) return null;

  return prisma.noxhCase.update({
    where: { id: caseId },
    data: { consultScheduledAt },
    include: caseInclude,
  });
}

export async function createCtvNudge(params: {
  caseId: string;
  brokerId: string;
  docType?: string;
  message?: string;
}) {
  const caseRow = await prisma.noxhCase.findFirst({
    where: { id: params.caseId, brokerId: params.brokerId },
    include: { documents: true },
  });
  if (!caseRow) return null;

  const hint =
    params.message ??
    (params.docType
      ? caseRow.documents.find((d) => d.docType === params.docType)
          ?.ctvActionHint
      : null) ??
    "CTV yêu cầu HouseX nhắc khách hoàn thiện hồ sơ.";

  const log = await prisma.$transaction(async (tx) => {
    const created = await tx.caseAssistLog.create({
      data: {
        caseId: params.caseId,
        brokerId: params.brokerId,
        assistType: "NUDGE",
        message: hint,
      },
    });

    await enqueueEvent(
      tx,
      "noxh_case.ctv_nudge",
      {
        caseId: params.caseId,
        caseCode: caseRow.code,
        brokerId: params.brokerId,
        docType: params.docType ?? null,
        message: hint,
      },
      `noxh_case.ctv_nudge:${created.id}`,
    );

    return created;
  });

  return log;
}

/** Đóng băng attribution khi booking chuyển cọc — gọi từ unit-booking convert. */
export async function freezeNoxhCaseOnDeposit(
  tx: Prisma.TransactionClient,
  normalizedPhone: string,
  unitBookingId: string,
) {
  const now = new Date();
  const activeCase = await tx.noxhCase.findFirst({
    where: {
      normalizedPhone,
      caseStatus: "ACTIVE",
    },
    orderBy: { createdAt: "desc" },
  });
  if (!activeCase) return null;

  return tx.noxhCase.update({
    where: { id: activeCase.id },
    data: {
      attributionLockedAt: now,
      unitBookingId,
      lockExpiresAt: null,
    },
  });
}
