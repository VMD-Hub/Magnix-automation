import { createHash } from "crypto";

export type AbVariant = "A" | "B";

export type AbSubjectPick = {
  variant: AbVariant;
  /** True when this lead is in the A/B test bucket (not always-B control). */
  inTestBucket: boolean;
  subject: string;
};

/**
 * Deterministic A/B subject (ADR-017 P2).
 * Default: 15% of audience gets variant A; rest get B (or single subject if A===B).
 */
export function pickAbSubject(input: {
  leadId: string;
  campaignKey: string;
  subjectA: string;
  subjectB: string;
  /** Share of audience in test arm A — default 15 (10–20 per ADR). */
  testPercent?: number;
}): AbSubjectPick {
  const pct = Math.min(50, Math.max(0, input.testPercent ?? 15));
  const digest = createHash("sha256")
    .update(`${input.leadId}:${input.campaignKey}:ab-subject`)
    .digest();
  const bucket = digest[0]! % 100;
  const inTestBucket = bucket < pct;
  const variant: AbVariant = inTestBucket ? "A" : "B";
  const subject = variant === "A" ? input.subjectA : input.subjectB;
  return { variant, inTestBucket, subject };
}

/** ISO week key e.g. 2026-W30 — used as campaign cadence key. */
export function isoWeekCampaignKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
