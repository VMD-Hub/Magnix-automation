import { maskPhone } from "@/lib/privacy/phone";
import type { NoxhDocStatus, NoxhDocType, NoxhMilestone } from "@prisma/client";
import {
  DOC_STATUS_LABEL,
  countDocProgress,
} from "@/lib/noxh-case/doc-catalog";
import { evaluateCtvLockCompliance } from "@/lib/noxh-case/ctv-lock-compliance";
import {
  MILESTONE_LABEL,
  milestoneProgressLabel,
} from "@/lib/noxh-case/milestone-labels";

/** Contact Firewall — CTV: tên đầy đủ, SĐT mask, không email. */
export type CtvCaseDocumentView = {
  id: string;
  docType: NoxhDocType;
  label: string;
  status: NoxhDocStatus;
  statusLabel: string;
  rejectReason: string | null;
  ctvActionHint: string | null;
  receivedAt: string | null;
  passedAt: string | null;
};

export type CtvCaseListItem = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked: string;
  projectName: string | null;
  dealTier: string | null;
  exclusiveStatus: string | null;
  milestone: NoxhMilestone;
  milestoneLabel: string;
  milestoneProgress: string;
  milestoneSub: string | null;
  caseStatus: string;
  docPercent: number;
  docPassed: number;
  docRequired: number;
  opsNote: string | null;
  attributionLocked: boolean;
  consultScheduledAt: string | null;
  lockExpiresAt: string | null;
  lockCompliance: {
    businessDaysUntilLockExpiry: number | null;
    calendarDaysUntilLockExpiry: number | null;
    daysSinceValidCare: number | null;
    hasRecentProgress: boolean;
    needsProgressWarning: boolean;
    needsScheduleWarning: boolean;
    canExtendLock: boolean;
  };
  updatedAt: string;
};

export type CtvCaseDetail = CtvCaseListItem & {
  documents: CtvCaseDocumentView[];
  missingDocs: CtvCaseDocumentView[];
  assistLogs: {
    id: string;
    assistType: string;
    message: string;
    createdAt: string;
  }[];
  careActivities: {
    id: string;
    activityType: string;
    occurredAt: string;
    note: string;
    imageUrls: string[];
    status: string;
  }[];
};

type CaseWithDocs = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  milestone: NoxhMilestone;
  milestoneSub: string | null;
  caseStatus: string;
  opsNote: string | null;
  attributionLockedAt: Date | null;
  consultScheduledAt: Date | null;
  lockExpiresAt: Date | null;
  dealTier?: string | null;
  exclusiveStatus?: string | null;
  exclusiveStartedAt?: Date | null;
  lastValidCareAt?: Date | null;
  updatedAt: Date;
  project: { name: string } | null;
  documents: {
    id: string;
    docType: NoxhDocType;
    status: NoxhDocStatus;
    rejectReason: string | null;
    ctvActionHint: string | null;
    receivedAt: Date | null;
    passedAt: Date | null;
  }[];
  assistLogs?: {
    id: string;
    assistType: string;
    message: string;
    createdAt: Date;
  }[];
  careActivities?: {
    id: string;
    activityType: string;
    occurredAt: Date;
    note: string;
    imageUrls: string[];
    status: string;
  }[];
};

const DOC_TYPE_LABEL: Record<NoxhDocType, string> = {
  DOC_ID: "CMND/CCCD",
  DOC_MARRIAGE: "Giấy tờ hôn nhân",
  DOC_RESIDENCE: "Giấy xác nhận cư trú",
  DOC_OBJECT: "Xác nhận đối tượng NOXH",
  DOC_HOUSING: "Xác nhận điều kiện nhà ở",
  DOC_INCOME: "Xác nhận thu nhập",
  DOC_APPLICATION: "Đơn đăng ký NOXH",
  DOC_DEPOSIT_PROOF: "Biên lai booking cọc",
  DOC_CIC: "Tra cứu CIC",
  DOC_BANK_INCOME: "Chứng minh thu nhập vay",
  DOC_LOAN_APP: "Hồ sơ vay NHCSXH",
};

function mapDoc(d: CaseWithDocs["documents"][number]): CtvCaseDocumentView {
  return {
    id: d.id,
    docType: d.docType,
    label: DOC_TYPE_LABEL[d.docType] ?? d.docType,
    status: d.status,
    statusLabel: DOC_STATUS_LABEL[d.status],
    rejectReason: d.rejectReason,
    ctvActionHint: d.ctvActionHint,
    receivedAt: d.receivedAt?.toISOString() ?? null,
    passedAt: d.passedAt?.toISOString() ?? null,
  };
}

export function serializeCaseForCtv(caseRow: CaseWithDocs): CtvCaseDetail {
  const docs = caseRow.documents.map(mapDoc);
  const progress = countDocProgress(caseRow.documents);
  const missingDocs = docs.filter(
    (d) => d.status === "MISSING" || d.status === "REJECTED",
  );

  const compliance = evaluateCtvLockCompliance({
    consultScheduledAt: caseRow.consultScheduledAt,
    lockExpiresAt: caseRow.lockExpiresAt,
    attributionLockedAt: caseRow.attributionLockedAt,
    caseStatus: caseRow.caseStatus,
    assistLogs: caseRow.assistLogs ?? [],
    exclusiveStartedAt: caseRow.exclusiveStartedAt,
    lastValidCareAt: caseRow.lastValidCareAt,
    exclusiveStatus: caseRow.exclusiveStatus,
    alreadyExtended: caseRow.exclusiveStatus === "EXTENDED",
  });

  return {
    id: caseRow.id,
    code: caseRow.code,
    customerName: caseRow.customerName,
    phoneMasked: maskPhone(caseRow.phone),
    projectName: caseRow.project?.name ?? null,
    dealTier: caseRow.dealTier ?? null,
    exclusiveStatus: caseRow.exclusiveStatus ?? null,
    milestone: caseRow.milestone,
    milestoneLabel: MILESTONE_LABEL[caseRow.milestone],
    milestoneProgress: milestoneProgressLabel(caseRow.milestone),
    milestoneSub: caseRow.milestoneSub,
    caseStatus: caseRow.caseStatus,
    docPercent: progress.percent,
    docPassed: progress.passed,
    docRequired: progress.required,
    opsNote: caseRow.opsNote,
    attributionLocked: !!caseRow.attributionLockedAt,
    consultScheduledAt: caseRow.consultScheduledAt?.toISOString() ?? null,
    lockExpiresAt: caseRow.lockExpiresAt?.toISOString() ?? null,
    lockCompliance: {
      businessDaysUntilLockExpiry: compliance.businessDaysUntilLockExpiry,
      calendarDaysUntilLockExpiry: compliance.calendarDaysUntilLockExpiry,
      daysSinceValidCare: compliance.daysSinceValidCare,
      hasRecentProgress: compliance.hasRecentProgress,
      needsProgressWarning: compliance.needsProgressWarning,
      needsScheduleWarning: compliance.needsScheduleWarning,
      canExtendLock: compliance.canExtendLock,
    },
    updatedAt: caseRow.updatedAt.toISOString(),
    documents: docs,
    missingDocs,
    assistLogs: (caseRow.assistLogs ?? []).map((l) => ({
      id: l.id,
      assistType: l.assistType,
      message: l.message,
      createdAt: l.createdAt.toISOString(),
    })),
    careActivities: (caseRow.careActivities ?? []).map((a) => ({
      id: a.id,
      activityType: a.activityType,
      occurredAt: a.occurredAt.toISOString(),
      note: a.note,
      imageUrls: a.imageUrls,
      status: a.status,
    })),
  };
}

export function serializeCaseListItemForCtv(
  caseRow: CaseWithDocs,
): CtvCaseListItem {
  const detail = serializeCaseForCtv(caseRow);
  const {
    documents: _d,
    missingDocs: _m,
    assistLogs: _a,
    careActivities: _c,
    ...list
  } = detail;
  return list;
}
