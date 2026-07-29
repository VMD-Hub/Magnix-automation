/**
 * ADR-018 Wave 2 — referral kế toán / pháp lý HĐ thuê.
 * Consent ledger (ADR-015) + SalesActivity handoff Minh An → partner.
 */

import { createHash } from "crypto";
import type { PrismaClient } from "@prisma/client";
import {
  appendSalesActivity,
  recordConsent,
} from "@/lib/sales-core/service";

/** Purpose/channel consent — chia sẻ liên hệ với đối tác KT/PL qua Minh An. */
export const PARTNER_REFERRAL_PURPOSE = "partner_referral" as const;
export const PARTNER_REFERRAL_CHANNEL = "partner" as const;
export const PARTNER_REFERRAL_POLICY_VERSION = "rental-partner-referral-v1";

export const RENTAL_PARTNER_REFERRAL_META_KIND = "RENTAL_PARTNER_REFERRAL" as const;

export type PartnerReferralKind = "ACCOUNTING" | "LEGAL" | "BOTH";

export const PARTNER_REFERRAL_KIND_LABEL: Record<PartnerReferralKind, string> = {
  ACCOUNTING: "Kế toán / thuế cho thuê",
  LEGAL: "Pháp lý hợp đồng thuê",
  BOTH: "Kế toán + pháp lý HĐ thuê",
};

export type GrantPartnerReferralConsentInput = {
  leadId: string;
  source: string;
  kind: PartnerReferralKind;
  proofType?: string;
  proofRef?: string | null;
  actorId?: string;
  correlationId?: string;
};

export async function grantPartnerReferralConsent(
  input: GrantPartnerReferralConsentInput,
): Promise<{ granted: true; consentId: string } | { granted: false; reason: string }> {
  const leadId = input.leadId.trim();
  if (!leadId) return { granted: false, reason: "missing_lead_id" };

  const correlationId =
    input.correlationId?.trim() ||
    `partner-referral-consent:${leadId}:${Date.now()}`;
  const idempotencyKey = `consent:partner_referral:partner:grant:${leadId}`;

  try {
    const { record } = await recordConsent({
      subjectType: "LEAD",
      subjectId: leadId,
      leadId,
      customerId: null,
      purpose: PARTNER_REFERRAL_PURPOSE,
      channel: PARTNER_REFERRAL_CHANNEL,
      action: "GRANTED",
      proofType: input.proofType ?? "web_form_checkbox",
      proofRef: input.proofRef ?? null,
      proofMetadata: {
        source: input.source,
        kind: input.kind,
        lane: "rental",
      },
      policyVersion: PARTNER_REFERRAL_POLICY_VERSION,
      actorId: input.actorId ?? "system:lead-capture",
      source: input.source,
      occurredAt: new Date(),
      correlationId,
      idempotencyKey,
    });
    return { granted: true, consentId: record.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[rental-partner-referral] grant consent failed", {
      leadKey: createHash("sha256").update(leadId).digest("hex").slice(0, 12),
      message,
    });
    return { granted: false, reason: message };
  }
}

export type RecordPartnerReferralHandedInput = {
  leadId: string;
  actorId: string;
  kind?: PartnerReferralKind;
  partnerLabel?: string;
  note?: string;
  correlationId?: string;
};

export function formatPartnerReferralNote(
  input: Omit<
    RecordPartnerReferralHandedInput,
    "leadId" | "actorId" | "correlationId"
  >,
): string {
  const parts = [
    RENTAL_PARTNER_REFERRAL_META_KIND,
    "status=HANDED",
  ];
  if (input.kind) parts.push(`kind=${input.kind}`);
  if (input.partnerLabel?.trim()) {
    parts.push(`partner=${input.partnerLabel.trim().slice(0, 80)}`);
  }
  if (input.note?.trim()) {
    parts.push(`note=${input.note.trim().slice(0, 120)}`);
  }
  return parts.join("|");
}

/** Ops ghi nhận đã chuyển lead cho đối tác KT/PL (sau khi có consent). */
export async function recordPartnerReferralHanded(
  input: RecordPartnerReferralHandedInput,
) {
  const occurredAt = new Date();
  const correlationId =
    input.correlationId ??
    `rental-partner-referral:${input.leadId}:${occurredAt.toISOString()}`;
  const note = formatPartnerReferralNote(input);
  const idempotencyKey = `rental-partner-referral:${input.leadId}:HANDED:${occurredAt.getTime()}`;

  return appendSalesActivity({
    leadId: input.leadId,
    type: "NOTE",
    channel: "ops",
    note,
    reason: "rental_partner_referral_handed",
    actorId: input.actorId,
    occurredAt,
    correlationId,
    idempotencyKey,
    metadata: {
      kind: RENTAL_PARTNER_REFERRAL_META_KIND,
      status: "HANDED",
      referralKind: input.kind ?? null,
      partnerLabel: input.partnerLabel ?? null,
    },
  });
}

export async function countPartnerReferralsHanded(
  db: PrismaClient,
  from: Date,
  to: Date = new Date(),
): Promise<number> {
  const rows = await db.salesActivity.findMany({
    where: {
      type: "NOTE",
      occurredAt: { gte: from, lte: to },
      OR: [
        {
          note: {
            startsWith: `${RENTAL_PARTNER_REFERRAL_META_KIND}|status=HANDED`,
          },
        },
        { reason: "rental_partner_referral_handed" },
      ],
    },
    select: { id: true, note: true, metadata: true },
  });
  return rows.filter((r) => {
    const meta = r.metadata as { kind?: string; status?: string } | null;
    if (
      meta?.kind === RENTAL_PARTNER_REFERRAL_META_KIND &&
      meta.status === "HANDED"
    ) {
      return true;
    }
    return (r.note ?? "").includes("status=HANDED");
  }).length;
}

export type PartnerReferralConsentStatus = {
  granted: boolean;
  action: string | null;
  occurredAt: string | null;
};

/** Trạng thái consent partner_referral để Ops biết có được share hay không. */
export async function getPartnerReferralConsentStatus(
  leadId: string,
): Promise<PartnerReferralConsentStatus> {
  const { getEffectiveConsent } = await import("@/lib/sales-core/service");
  const effective = await getEffectiveConsent({
    subjectType: "LEAD",
    subjectId: leadId,
    purpose: PARTNER_REFERRAL_PURPOSE,
    channel: PARTNER_REFERRAL_CHANNEL,
  });
  return {
    granted: effective.granted,
    action: effective.action,
    occurredAt: effective.occurredAt
      ? effective.occurredAt.toISOString()
      : null,
  };
}

export class PartnerReferralConsentError extends Error {
  readonly code = "PARTNER_CONSENT_REQUIRED" as const;
  constructor(message = "Thiếu consent partner_referral — không được chuyển SĐT cho đối tác.") {
    super(message);
    this.name = "PartnerReferralConsentError";
  }
}

/** Fail-closed ADR-015: handoff chỉ khi consent hiệu lực. */
export async function assertPartnerReferralConsentForHandOff(
  leadId: string,
): Promise<PartnerReferralConsentStatus> {
  const status = await getPartnerReferralConsentStatus(leadId);
  if (!status.granted) {
    throw new PartnerReferralConsentError();
  }
  return status;
}

export function parsePartnerReferralKind(
  raw: unknown,
): PartnerReferralKind | null {
  if (raw === "ACCOUNTING" || raw === "LEGAL" || raw === "BOTH") return raw;
  if (raw === "accounting") return "ACCOUNTING";
  if (raw === "legal") return "LEGAL";
  if (raw === "both") return "BOTH";
  return null;
}
