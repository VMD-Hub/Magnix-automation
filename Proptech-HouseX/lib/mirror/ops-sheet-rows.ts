import type { InboundUidLead, NoxhCase, NoxhDocStatus, NoxhDocType } from "@prisma/client";
import { maskInboundUid, readInboundOpsMeta } from "@/lib/inbound/ops-meta";
import { segmentLabel } from "@/lib/inbound/segment-labels";
import { countDocProgress } from "@/lib/noxh-case/doc-catalog";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import { maskPhone } from "@/lib/privacy/phone";

export const INBOUND_MIRROR_HEADERS = [
  "uid_masked",
  "uid_source",
  "normalized_key",
  "captured_at",
  "text",
  "segment",
  "segment_label",
  "score",
  "interest_key",
  "classify_method",
  "consent_basis",
  "magnix_status",
  "ops_status",
  "ops_note",
  "platform_lead_id",
  "tags",
] as const;

export const NOXH_MIRROR_HEADERS = [
  "code",
  "customer_name",
  "phone_masked",
  "milestone",
  "milestone_label",
  "case_status",
  "broker_name",
  "project_name",
  "doc_percent",
  "ops_note",
  "updated_at",
] as const;

type NoxhCaseMirrorRow = NoxhCase & {
  broker: { fullName: string } | null;
  project: { name: string } | null;
  documents: { docType: NoxhDocType; status: NoxhDocStatus }[];
};

export function inboundLeadToMirrorRow(row: InboundUidLead): string[] {
  const ops = readInboundOpsMeta(row.meta);
  const tags = Array.isArray(row.tags)
    ? (row.tags as string[]).join(",")
    : String(row.tags ?? "");

  return [
    maskInboundUid(row.uid),
    row.uidSource,
    row.normalizedKey,
    row.capturedAt.toISOString(),
    (row.text ?? "").slice(0, 5000),
    row.segment,
    segmentLabel(row.segment),
    String(row.score),
    row.interestKey ?? "",
    row.classifyMethod,
    row.consentBasis ?? "",
    row.status,
    ops.ops_status,
    ops.ops_note ?? "",
    ops.platform_lead_id ?? "",
    tags,
  ];
}

export function noxhCaseToMirrorRow(row: NoxhCaseMirrorRow): string[] {
  const progress = countDocProgress(row.documents);
  return [
    row.code,
    row.customerName,
    maskPhone(row.phone),
    row.milestone,
    MILESTONE_LABEL[row.milestone],
    row.caseStatus,
    row.broker?.fullName ?? "",
    row.project?.name ?? "",
    String(progress.percent),
    row.opsNote ?? "",
    row.updatedAt.toISOString(),
  ];
}

export function buildOpsMirrorSheetValues(input: {
  syncedAt: string;
  inbound: InboundUidLead[];
  noxhCases: NoxhCaseMirrorRow[];
}): string[][] {
  const values: string[][] = [
    ["# synced_at", input.syncedAt, "source=postgres", "read_only_mirror"],
    [],
    ["# inbound_uid_leads"],
    [...INBOUND_MIRROR_HEADERS],
    ...input.inbound.map(inboundLeadToMirrorRow),
    [],
    ["# noxh_cases_active"],
    [...NOXH_MIRROR_HEADERS],
    ...input.noxhCases.map(noxhCaseToMirrorRow),
  ];
  return values;
}
