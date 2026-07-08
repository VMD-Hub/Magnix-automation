import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildOpsMirrorSheetValues,
  inboundLeadToMirrorRow,
} from "../lib/mirror/ops-sheet-rows";

describe("ops sheet mirror rows", () => {
  it("masks uid in inbound row", () => {
    const row = inboundLeadToMirrorRow({
      id: "1",
      uid: "123456789",
      uidSource: "fb_ads",
      normalizedKey: "fb_ads:123456789",
      capturedAt: new Date("2026-07-08T00:00:00.000Z"),
      text: "test",
      segment: "noxh_income",
      score: 80,
      interestKey: null,
      tags: ["noxh_income"],
      meta: { ops_status: "pending" },
      classifyMethod: "regex",
      consentBasis: "ads",
      status: "classified",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    assert.equal(row[0], "123***89");
    assert.equal(row[2], "fb_ads:123456789");
  });

  it("includes noxh_case_code from inbound meta", () => {
    const row = inboundLeadToMirrorRow({
      id: "1",
      uid: "999",
      uidSource: "n8n_manual",
      normalizedKey: "n8n_manual:999",
      capturedAt: new Date("2026-07-08T00:00:00.000Z"),
      text: null,
      segment: "noxh_income",
      score: 70,
      interestKey: null,
      tags: [],
      meta: {
        ops_status: "converted",
        noxh_case_code: "HX-NOXH-000042",
      },
      classifyMethod: "regex",
      consentBasis: "ads",
      status: "classified",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const codeIdx = row.indexOf("HX-NOXH-000042");
    assert.ok(codeIdx >= 0);
  });

  it("builds sheet sections with headers", () => {
    const values = buildOpsMirrorSheetValues({
      syncedAt: "2026-07-08T08:00:00.000Z",
      inbound: [],
      noxhCases: [],
    });
    assert.equal(values[0][0], "# synced_at");
    assert.equal(values[2][0], "# inbound_uid_leads");
    assert.equal(values[3][0], "uid_masked");
    assert.equal(values[5][0], "# noxh_cases_active");
  });
});
