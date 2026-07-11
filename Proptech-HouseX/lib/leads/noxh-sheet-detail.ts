/**
 * Parse tab `noxh_leads_detail` — chi tiết wizard forward từ NOXH_DETAIL_WEBHOOK.
 * Header: scripts/init-magnix-sheet.mjs · n8n detail-02-prepare-append.js
 */

import type { BadDebtStatus } from "@/lib/finance/credit-readiness";
import type { LeadTier } from "@/lib/finance/noxh-lead";
import type { NoxhEligibilityInput } from "@/lib/validation/noxh-lead";
import { evaluateNoxhEligibility } from "@/lib/finance/noxh-eligibility";
import { assessCreditReadiness } from "@/lib/finance/credit-readiness";
import { classifyLead } from "@/lib/finance/noxh-lead";
import {
  buildNoxhWizardSnapshot,
  type NoxhWizardSnapshot,
} from "@/lib/leads/noxh-wizard-snapshot";
import type { NoxhObjectGroupId } from "@/lib/finance/noxh-rules";

export const NOXH_DETAIL_SHEET_HEADERS = [
  "lead_id",
  "tier",
  "object_group",
  "marital_status",
  "applicant_income",
  "spouse_income",
  "owns_home",
  "area_per_person",
  "intend_to_borrow",
  "existing_debt",
  "card_limit",
  "bad_debt",
  "timeframe",
  "dti",
  "evaluation_reasons",
  "credit_reasons",
  "next_steps",
  "rules_version",
  "contact_name",
  "contact_phone",
  "contact_email",
  "created_at",
] as const;

export type NoxhSheetDetailRow = {
  leadId: string;
  tier: LeadTier | null;
  capturedAt: string;
  wizardInput: NoxhEligibilityInput;
  /** Ghi chú: Sheet không lưu everBenefitedHousingPolicy — mặc định false khi backfill. */
  everBenefitedAssumedFalse: true;
};

const OBJECT_GROUPS = new Set<string>([
  "MERIT",
  "POOR_RURAL",
  "POOR_URBAN",
  "LOW_INCOME_URBAN",
  "WORKER",
  "ARMED_FORCES",
  "CIVIL_SERVANT",
  "RETURNED_OFFICIAL_HOUSING",
  "LAND_RECOVERED",
  "NONE",
]);

const MARITAL = new Set(["SINGLE", "SINGLE_WITH_MINOR", "MARRIED"]);
const BAD_DEBT = new Set(["NONE", "GROUP_2_PLUS", "UNKNOWN"]);
const TIMEFRAME = new Set([
  "NOW",
  "WITHIN_3M",
  "WITHIN_6M_PLUS",
  "UNSURE",
]);
const TIERS = new Set(["HOT", "WARM", "COLD", "OUT"]);

function parseNumber(raw: string | undefined): number {
  if (!raw?.trim()) return 0;
  const n = Number(String(raw).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function parseYesNo(raw: string | undefined): boolean {
  return String(raw ?? "").trim().toLowerCase() === "yes";
}

function parseOptionalArea(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function rowToRecord(
  headers: string[],
  cells: string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < headers.length; i++) {
    out[headers[i]] = cells[i] ?? "";
  }
  return out;
}

export function parseNoxhSheetDetailRow(
  headers: string[],
  cells: string[],
): NoxhSheetDetailRow | null {
  const r = rowToRecord(headers, cells);
  const leadId = r.lead_id?.trim();
  if (!leadId) return null;

  const objectGroup = r.object_group?.trim();
  if (!objectGroup || !OBJECT_GROUPS.has(objectGroup)) return null;

  const maritalStatus = r.marital_status?.trim();
  if (!maritalStatus || !MARITAL.has(maritalStatus)) return null;

  const badDebt = r.bad_debt?.trim();
  if (!badDebt || !BAD_DEBT.has(badDebt)) return null;

  const timeframe = r.timeframe?.trim();
  if (!timeframe || !TIMEFRAME.has(timeframe)) return null;

  const tierRaw = r.tier?.trim();
  const tier = tierRaw && TIERS.has(tierRaw) ? (tierRaw as LeadTier) : null;

  const ownsHome = parseYesNo(r.owns_home);
  const applicantIncome = parseNumber(r.applicant_income);
  const spouseIncome = parseNumber(r.spouse_income);

  const wizardInput: NoxhEligibilityInput = {
    objectGroup: objectGroup as NoxhObjectGroupId,
    ownsHomeInProvince: ownsHome,
    areaPerPersonSqm: ownsHome
      ? parseOptionalArea(r.area_per_person)
      : undefined,
    everBenefitedHousingPolicy: false,
    maritalStatus: maritalStatus as NoxhEligibilityInput["maritalStatus"],
    applicantMonthlyIncome: applicantIncome,
    spouseMonthlyIncome:
      maritalStatus === "MARRIED" ? spouseIncome : undefined,
    intendToBorrow: parseYesNo(r.intend_to_borrow),
    existingMonthlyDebtPayment: parseNumber(r.existing_debt) || undefined,
    creditCardLimitTotal: parseNumber(r.card_limit) || undefined,
    badDebtSelfOrSpouse: badDebt as BadDebtStatus,
    timeframe: timeframe as NoxhEligibilityInput["timeframe"],
  };

  const capturedAt = r.created_at?.trim() || new Date().toISOString();

  return {
    leadId,
    tier,
    capturedAt,
    wizardInput,
    everBenefitedAssumedFalse: true,
  };
}

/** Gộp nhiều dòng cùng lead_id — giữ bản mới nhất theo created_at. */
export function dedupeNoxhSheetDetailRows(
  rows: NoxhSheetDetailRow[],
): Map<string, NoxhSheetDetailRow> {
  const map = new Map<string, NoxhSheetDetailRow>();
  for (const row of rows) {
    const prev = map.get(row.leadId);
    if (!prev || row.capturedAt >= prev.capturedAt) {
      map.set(row.leadId, row);
    }
  }
  return map;
}

export function buildWizardSnapshotFromSheetRow(
  row: NoxhSheetDetailRow,
): NoxhWizardSnapshot {
  const i = row.wizardInput;
  const evaluation = evaluateNoxhEligibility(i);
  const householdIncome =
    i.maritalStatus === "MARRIED"
      ? i.applicantMonthlyIncome + (i.spouseMonthlyIncome ?? 0)
      : i.applicantMonthlyIncome;

  const credit = assessCreditReadiness({
    intendToBorrow: i.intendToBorrow,
    householdMonthlyIncome: householdIncome,
    existingMonthlyDebtPayment: i.existingMonthlyDebtPayment,
    creditCardLimitTotal: i.creditCardLimitTotal,
    badDebtSelfOrSpouse: i.badDebtSelfOrSpouse,
  });

  let classification = classifyLead(evaluation, credit, {
    timeframe: i.timeframe,
    hasContact: true,
  });

  if (row.tier && row.tier !== classification.tier) {
    classification = { ...classification, tier: row.tier };
  }

  return buildNoxhWizardSnapshot({
    wizardInput: i,
    evaluation,
    credit,
    classification,
    householdMonthlyIncome: householdIncome,
    capturedAt: row.capturedAt,
  });
}

export function parseNoxhSheetDetailTable(
  values: string[][],
): NoxhSheetDetailRow[] {
  if (values.length < 2) return [];

  const headerRow = values[0].map((h) => String(h).trim().toLowerCase());
  const expected = [...NOXH_DETAIL_SHEET_HEADERS];
  const headerOk =
    expected.length <= headerRow.length &&
    expected.every((h, i) => headerRow[i] === h);

  const headers = headerOk ? expected.map(String) : headerRow;

  const rows: NoxhSheetDetailRow[] = [];
  for (let i = 1; i < values.length; i++) {
    const parsed = parseNoxhSheetDetailRow(headers, values[i] ?? []);
    if (parsed) rows.push(parsed);
  }
  return rows;
}
