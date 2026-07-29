import assert from "node:assert/strict";
import test from "node:test";
import {
  formatPartnerReferralNote,
  parsePartnerReferralKind,
} from "../lib/leads/rental-partner-referral";
import { resolveRentalKpiWindow } from "../lib/admin/rental-kpi";
import {
  rentalNeedPmWaitlistCopy,
  RENTAL_NEED_PM_NO_PROMISE,
} from "../lib/content/messaging/rental-waitlist-copy";
import { leadCreateSchema } from "../lib/validation/lead";

test("formatPartnerReferralNote HANDED", () => {
  const note = formatPartnerReferralNote({
    kind: "ACCOUNTING",
    partnerLabel: "KT-A",
  });
  assert.match(
    note,
    /^RENTAL_PARTNER_REFERRAL\|status=HANDED\|kind=ACCOUNTING\|partner=KT-A$/,
  );
});

test("parsePartnerReferralKind", () => {
  assert.equal(parsePartnerReferralKind("BOTH"), "BOTH");
  assert.equal(parsePartnerReferralKind("legal"), "LEGAL");
  assert.equal(parsePartnerReferralKind("x"), null);
});

test("resolveRentalKpiWindow defaults 30", () => {
  assert.equal(resolveRentalKpiWindow(null), 30);
  assert.equal(resolveRentalKpiWindow("7"), 7);
  assert.equal(resolveRentalKpiWindow("99"), 30);
});

test("NEED_PM copy không hứa QL", () => {
  assert.match(RENTAL_NEED_PM_NO_PROMISE, /chưa mở dịch vụ quản lý/i);
  assert.match(rentalNeedPmWaitlistCopy.consentLabel, /Không phải đăng ký mua/i);
});

test("leadCreateSchema partnerReferral cho tax_help orphan", () => {
  const parsed = leadCreateSchema.parse({
    name: "A",
    phone: "0901234567",
    rentalIntent: "tax_help",
    partnerReferralOptIn: true,
    partnerReferralKind: "accounting",
  });
  assert.equal(parsed.partnerReferralOptIn, true);
  assert.equal(parsed.partnerReferralKind, "ACCOUNTING");
  assert.equal(parsed.rentalIntent, "tax_help");
});

test("PartnerReferralConsentError code", async () => {
  const { PartnerReferralConsentError } = await import(
    "../lib/leads/rental-partner-referral"
  );
  const err = new PartnerReferralConsentError();
  assert.equal(err.code, "PARTNER_CONSENT_REQUIRED");
  assert.match(err.message, /consent/i);
});
