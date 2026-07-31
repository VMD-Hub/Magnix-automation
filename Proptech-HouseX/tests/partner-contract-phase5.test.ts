import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PARTNER_CONTRACT_TITLE,
  PARTNER_CONTRACT_VERSION,
  buildPartnerContractSnapshotHtml,
} from "@/lib/content/partner-contract";
import {
  computePartnerContractSigHash,
  isPartnerContractGateEnabled,
} from "@/lib/data/partner-contract";
import { partnerContractSignSchema } from "@/lib/validation/partner-contract";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSrc(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("Phase 5 — partner e-contract light", () => {
  it("ships versioned terms without public HH %", () => {
    assert.equal(PARTNER_CONTRACT_VERSION, "HX-PC-2026-08");
    assert.match(PARTNER_CONTRACT_TITLE, /hợp tác/i);
    const snap = buildPartnerContractSnapshotHtml({
      brokerName: "CTV Test",
      brokerId: "b1",
      signedAtIso: "2026-08-01T00:00:00.000Z",
      hasCanvasSignature: false,
    });
    assert.match(snap, /HX-PC-2026-08/);
    assert.doesNotMatch(snap, /0,\s*5\s*%|0\.5\s*%|15\.000\.000/i);
  });

  it("sig hash is stable for same inputs", () => {
    const a = computePartnerContractSigHash({
      version: PARTNER_CONTRACT_VERSION,
      brokerId: "broker-1",
      signedAtIso: "2026-08-01T00:00:00.000Z",
      otpProof: "abc",
      signatureDataUrl: null,
    });
    const b = computePartnerContractSigHash({
      version: PARTNER_CONTRACT_VERSION,
      brokerId: "broker-1",
      signedAtIso: "2026-08-01T00:00:00.000Z",
      otpProof: "abc",
      signatureDataUrl: null,
    });
    assert.equal(a, b);
    assert.equal(a.length, 64);
  });

  it("gate defaults on; false disables", () => {
    const prev = process.env.AFFILIATE_CONTRACT_GATE_ENABLED;
    delete process.env.AFFILIATE_CONTRACT_GATE_ENABLED;
    assert.equal(isPartnerContractGateEnabled(), true);
    process.env.AFFILIATE_CONTRACT_GATE_ENABLED = "false";
    assert.equal(isPartnerContractGateEnabled(), false);
    process.env.AFFILIATE_CONTRACT_GATE_ENABLED = "true";
    assert.equal(isPartnerContractGateEnabled(), true);
    if (prev === undefined) delete process.env.AFFILIATE_CONTRACT_GATE_ENABLED;
    else process.env.AFFILIATE_CONTRACT_GATE_ENABLED = prev;
  });

  it("sign schema requires accepted + 6-digit otp", () => {
    assert.throws(() =>
      partnerContractSignSchema.parse({ otp: "123", accepted: true }),
    );
    assert.throws(() =>
      partnerContractSignSchema.parse({ otp: "123456", accepted: false }),
    );
    const ok = partnerContractSignSchema.parse({
      otp: "123456",
      accepted: true,
    });
    assert.equal(ok.otp, "123456");
  });

  it("ships CTV + admin routes and claim gate", () => {
    for (const rel of [
      "app/api/ctv/partner-contract/route.ts",
      "app/api/ctv/partner-contract/request-otp/route.ts",
      "app/api/ctv/partner-contract/sign/route.ts",
      "app/api/admin/brokers/[id]/partner-contract/route.ts",
      "app/moi-gioi/e-contract/page.tsx",
      "prisma/migrations/20260801010000_partner_contract_otp/migration.sql",
    ]) {
      assert.ok(readSrc(rel).length > 40, rel);
    }
    const cases = readSrc("app/api/ctv/cases/route.ts");
    assert.match(cases, /assertPartnerContractSigned/);
    const lib = readSrc("lib/data/partner-contract.ts");
    assert.match(lib, /CONTRACT_REQUIRED/);
    const schema = readSrc("prisma/schema.prisma");
    assert.match(schema, /PARTNER_CONTRACT/);
  });

  it("session profile and UI expose contract status", () => {
    const profile = readSrc("lib/auth/session-profile.ts");
    assert.match(profile, /partnerContractStatus/);
    const account = readSrc("app/moi-gioi/tai-khoan/page.tsx");
    assert.match(account, /\/moi-gioi\/e-contract/);
    const drop = readSrc("components/ctv/ctv-case-drop-form.tsx");
    assert.match(drop, /CONTRACT_REQUIRED/);
  });
});
