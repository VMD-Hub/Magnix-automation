/**
 * Chuyển Lead.message kiểu pipe (lead cũ) sang nhãn tiếng Việt cho Ops.
 * Không có số tiền VND — chỉ có trong wizardSnapshot (lead mới) hoặc Google Sheet.
 */

import type { LeadTier } from "@/lib/finance/noxh-lead";
import type { CreditFlag } from "@/lib/finance/credit-readiness";
import type { NoxhOverall } from "@/lib/finance/noxh-eligibility";
import type { ConditionStatus } from "@/lib/finance/noxh-eligibility";
import {
  OVERALL_LABELS,
  REASON_CODE_LABELS,
  STATUS_LABELS,
  TIER_LABELS,
} from "@/lib/leads/noxh-wizard-snapshot";

const CREDIT_FLAG_LABELS_LOCAL = {
  NOT_APPLICABLE: { vi: "Không vay NH", en: "Not borrowing" },
  CLEAN: { vi: "Tín dụng thuận lợi", en: "Clean credit" },
  CAUTION: { vi: "Tín dụng cần lưu ý", en: "Credit caution" },
  BLOCKER: { vi: "Rào cản tín dụng", en: "Credit blocker" },
} as const;

export type ParsedLegacyNoxhMessage = {
  raw: string;
  tier: LeadTier | null;
  overall: NoxhOverall | null;
  housing: ConditionStatus | null;
  income: ConditionStatus | null;
  incomeNearCeiling: boolean;
  intendToBorrow: boolean | null;
  creditFlag: CreditFlag | null;
  dtiBucket: string | null;
  reasonCodes: string[];
  rulesVersion: string | null;
};

function readKv(segment: string): [string, string] | null {
  const i = segment.indexOf("=");
  if (i <= 0) return null;
  return [segment.slice(0, i).trim(), segment.slice(i + 1).trim()];
}

export function parseLegacyNoxhLeadMessage(
  message: string | null | undefined,
): ParsedLegacyNoxhMessage | null {
  if (!message || !message.includes("[NOXH check]")) return null;

  const out: ParsedLegacyNoxhMessage = {
    raw: message,
    tier: null,
    overall: null,
    housing: null,
    income: null,
    incomeNearCeiling: false,
    intendToBorrow: null,
    creditFlag: null,
    dtiBucket: null,
    reasonCodes: [],
    rulesVersion: null,
  };

  for (const part of message.split("|")) {
    const seg = part.trim();
    if (!seg || seg === "[NOXH check]") continue;
    if (seg === "income_near_ceiling") {
      out.incomeNearCeiling = true;
      continue;
    }
    const kv = readKv(seg);
    if (!kv) continue;
    const [key, value] = kv;
    switch (key) {
      case "tier":
        if (["HOT", "WARM", "COLD", "OUT"].includes(value)) {
          out.tier = value as LeadTier;
        }
        break;
      case "overall":
        if (["ELIGIBLE", "CONDITIONAL", "NOT_ELIGIBLE"].includes(value)) {
          out.overall = value as NoxhOverall;
        }
        break;
      case "housing":
      case "income":
        if (["PASS", "FAIL", "CONDITIONAL", "UNKNOWN"].includes(value)) {
          if (key === "housing") out.housing = value as ConditionStatus;
          else out.income = value as ConditionStatus;
        }
        break;
      case "borrow":
        out.intendToBorrow = value === "yes";
        break;
      case "credit":
        if (
          ["NOT_APPLICABLE", "CLEAN", "CAUTION", "BLOCKER"].includes(value)
        ) {
          out.creditFlag = value as CreditFlag;
        }
        break;
      case "dti":
        out.dtiBucket = value;
        break;
      case "reasons":
        out.reasonCodes = value.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "rules":
        out.rulesVersion = value;
        break;
      default:
        break;
    }
  }

  return out.tier || out.overall ? out : null;
}

/** Một dòng cho danh sách Ops Leads. */
export function formatLegacyNoxhLeadPreviewVi(
  parsed: ParsedLegacyNoxhMessage,
): string {
  const parts: string[] = [];
  if (parsed.tier) {
    parts.push(TIER_LABELS[parsed.tier].vi);
  }
  if (parsed.overall) {
    parts.push(OVERALL_LABELS[parsed.overall].vi);
  }
  if (parsed.housing) {
    parts.push(`Nhà ở: ${STATUS_LABELS[parsed.housing].vi}`);
  }
  if (parsed.income) {
    let income = `Thu nhập: ${STATUS_LABELS[parsed.income].vi}`;
    if (parsed.incomeNearCeiling) income += " (sát trần)";
    parts.push(income);
  }
  if (parsed.intendToBorrow != null) {
    parts.push(parsed.intendToBorrow ? "Có vay NH" : "Không vay");
  }
  if (parsed.creditFlag && parsed.creditFlag !== "NOT_APPLICABLE") {
    const c = CREDIT_FLAG_LABELS_LOCAL[parsed.creditFlag];
    parts.push(c.vi);
  }
  if (parsed.dtiBucket) {
    parts.push(`DTI ~${parsed.dtiBucket}`);
  }
  return parts.join(" · ");
}

export function legacyReasonLabelsVi(codes: string[]): string[] {
  return codes.map((c) => REASON_CODE_LABELS[c]?.vi ?? c);
}

export { CREDIT_FLAG_LABELS_LOCAL as LEGACY_CREDIT_LABELS };
