import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listEmailNurtureScripts } from "../lib/admin/email-marketing-ops.ts";

describe("email marketing admin catalog", () => {
  it("lists only email-channel nurture scripts", () => {
    const scripts = listEmailNurtureScripts();
    assert.ok(scripts.length >= 3);
    assert.ok(scripts.every((s) => s.id && s.label));
    assert.ok(scripts.some((s) => s.id === "noxh-tool-email-welcome"));
    assert.ok(scripts.some((s) => s.id === "weekly-newsletter"));
  });
});
