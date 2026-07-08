import { test } from "node:test";
import assert from "node:assert/strict";
import { maskPhone } from "../lib/privacy/phone";
import {
  serializeCaseForCtv,
  serializeCaseListItemForCtv,
} from "../lib/noxh-case/serialize-ctv";

test("Contact Firewall — CTV không thấy SĐT đầy đủ", () => {
  const row = {
    id: "1",
    code: "HX-NOXH-000001",
    customerName: "Trần Thị Mai",
    phone: "0903123456",
    milestone: "M2_DOCUMENTS" as const,
    milestoneSub: "M2_COLLECTING",
    caseStatus: "ACTIVE",
    opsNote: null,
    attributionLockedAt: null,
    updatedAt: new Date(),
    project: { name: "DTA Happy Home" },
    documents: [
      {
        id: "d1",
        docType: "DOC_ID" as const,
        status: "PASSED" as const,
        rejectReason: null,
        ctvActionHint: null,
        receivedAt: null,
        passedAt: null,
      },
    ],
    assistLogs: [],
  };

  const detail = serializeCaseForCtv(row);
  assert.equal(detail.customerName, "Trần Thị Mai");
  assert.ok(!detail.phoneMasked.includes("3456"));
  assert.ok(detail.phoneMasked.includes("***"));

  const list = serializeCaseListItemForCtv(row);
  assert.ok(!("documents" in list && (list as { phone?: string }).phone));
  assert.equal((list as { phoneMasked: string }).phoneMasked, detail.phoneMasked);
});

test("maskPhone không lộ 4 số cuối", () => {
  const masked = maskPhone("0903123456");
  assert.ok(!masked.replace(/\s/g, "").endsWith("3456"));
});
