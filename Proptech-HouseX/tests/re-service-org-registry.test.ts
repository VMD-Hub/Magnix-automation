import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getReServiceOrgById,
  listReServiceOrgs,
  RE_SERVICE_ORG_SEED,
} from "../lib/admin/re-service-org-registry.ts";

describe("re-service-org-registry", () => {
  it("seed has records and list filters by admin unit", () => {
    assert.ok(RE_SERVICE_ORG_SEED.length >= 8);
    const { items, counts } = listReServiceOrgs({ adminUnit: "dong-nai" });
    assert.ok(items.every((i) => i.adminUnitNew === "dong-nai"));
    assert.equal(items.length, 3);
    assert.ok(counts.total >= counts.filtered);
  });

  it("get by id and default readerEligible false", () => {
    const row = getReServiceOrgById("dn-san-dai-dong-cat");
    assert.ok(row);
    assert.equal(row?.confidence, "HIGH");
    assert.equal(row?.readerEligible, false);
  });

  it("q search matches name", () => {
    const { items } = listReServiceOrgs({ q: "ALG" });
    assert.equal(items.length, 1);
    assert.equal(items[0]?.id, "tn-san-alg");
  });
});
