import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildWizardSnapshotFromSheetRow,
  dedupeNoxhSheetDetailRows,
  NOXH_DETAIL_SHEET_HEADERS,
  parseNoxhSheetDetailRow,
  parseNoxhSheetDetailTable,
} from "../lib/leads/noxh-sheet-detail.ts";

const SAMPLE_ROW = [
  "lead-abc",
  "WARM",
  "WORKER",
  "MARRIED",
  "20000000",
  "15000000",
  "no",
  "",
  "yes",
  "8000000",
  "50000000",
  "UNKNOWN",
  "NOW",
  "0.42",
  '["a"]',
  '["b"]',
  '["c"]',
  "2026-04-ND136",
  "Test",
  "0901234567",
  "a@b.com",
  "2026-07-01T10:00:00.000Z",
];

describe("parseNoxhSheetDetailRow", () => {
  it("parses sheet cells into wizard input", () => {
    const row = parseNoxhSheetDetailRow(
      [...NOXH_DETAIL_SHEET_HEADERS],
      SAMPLE_ROW,
    );
    assert.ok(row);
    assert.equal(row.leadId, "lead-abc");
    assert.equal(row.tier, "WARM");
    assert.equal(row.wizardInput.applicantMonthlyIncome, 20_000_000);
    assert.equal(row.wizardInput.spouseMonthlyIncome, 15_000_000);
  });

  it("dedupes by latest capturedAt", () => {
    const older = parseNoxhSheetDetailRow(
      [...NOXH_DETAIL_SHEET_HEADERS],
      [...SAMPLE_ROW.slice(0, 21), "2026-06-01T00:00:00.000Z"],
    )!;
    const newer = parseNoxhSheetDetailRow(
      [...NOXH_DETAIL_SHEET_HEADERS],
      SAMPLE_ROW,
    )!;
    const map = dedupeNoxhSheetDetailRows([older, newer]);
    assert.equal(map.get("lead-abc")?.capturedAt, "2026-07-01T10:00:00.000Z");
  });

  it("builds admin wizard snapshot with VND amounts", () => {
    const row = parseNoxhSheetDetailRow(
      [...NOXH_DETAIL_SHEET_HEADERS],
      SAMPLE_ROW,
    )!;
    const snap = buildWizardSnapshotFromSheetRow(row);
    assert.equal(snap.situation.householdMonthlyIncome, 35_000_000);
    assert.ok(snap.listPreviewVi.includes("35.000.000"));
    assert.equal(snap.tier, "WARM");
  });

  it("parses full table with header row", () => {
    const table = parseNoxhSheetDetailTable([
      [...NOXH_DETAIL_SHEET_HEADERS],
      SAMPLE_ROW,
    ]);
    assert.equal(table.length, 1);
  });
});
