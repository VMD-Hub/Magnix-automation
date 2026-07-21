import assert from "node:assert/strict";
import { describe, it, before } from "node:test";
import {
  resolveEspAdapterMode,
  isEspSyncEnabled,
} from "../lib/email/esp-adapter.ts";
import { createDryRunEspAdapter } from "../lib/email/esp-adapters/dry-run.ts";
import { buildInactiveReengageEmail } from "../lib/email/inactive-reengage.ts";
import { buildCctmUtilityEmail } from "../lib/email/cctm-utility.ts";
import {
  getNurtureScript,
  CCTM_UTILITY_EMAIL_SCRIPT_ID,
  INACTIVE_REENGAGE_SCRIPT_ID,
} from "../lib/leads/nurture-scripts.ts";

describe("ADR-017 P3 — ESP adapter / inactive / CCTM", () => {
  before(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
    process.env.EMAIL_ESP_ADAPTER = "dry_run";
  });

  it("catalog has inactive + CCTM email scripts", () => {
    assert.equal(getNurtureScript(INACTIVE_REENGAGE_SCRIPT_ID)?.channel, "email");
    assert.equal(getNurtureScript(CCTM_UTILITY_EMAIL_SCRIPT_ID)?.segment, "CCTM");
  });

  it("resolves ESP adapter mode", () => {
    assert.equal(resolveEspAdapterMode(), "dry_run");
    assert.equal(isEspSyncEnabled(), true);
  });

  it("dry_run adapter upserts without network", async () => {
    const adapter = createDryRunEspAdapter();
    const result = await adapter.upsertContact({
      leadId: "lead-1",
      email: "a@example.test",
      tags: ["housx_marketing"],
      consented: true,
      segment: "CCTM",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.provider, "dry_run");
      assert.ok(result.externalId);
      assert.equal(result.dryRun, true);
    }
  });

  it("builds inactive reengage + CCTM utility templates", () => {
    const r = buildInactiveReengageEmail({
      recipientName: "An",
      subject: "Test",
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
    });
    assert.match(r.html, /một thư duy nhất/i);
    assert.match(r.html, /Hủy đăng ký/);

    const c = buildCctmUtilityEmail({
      recipientName: "An",
      subject: "CCTM",
      unsubscribeUrl: "https://example.test/huy-dang-ky-email?token=t",
    });
    assert.match(c.html, /cong-cu/);
    assert.match(c.text, /Utility/);
  });
});
