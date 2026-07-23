import assert from "node:assert/strict";
import test from "node:test";
import {
  dualAddressFromProvinceRaw,
  formatDualAddress,
  getNoxhProvinceBySlug,
  listNoxhProvinceHubsEnabled,
  NOXH_LEGACY_HUB_REDIRECTS,
  NOXH_PROVINCE_REGISTRY_P0,
  resolveLegacyNoxhHubRedirect,
  resolveNoxhProvinceCanonical,
} from "../lib/content/noxh-province-registry";

test("P0 registry: 6 entries, 4 hubs enabled", () => {
  assert.equal(NOXH_PROVINCE_REGISTRY_P0.length, 6);
  assert.equal(listNoxhProvinceHubsEnabled().length, 4);
  assert.ok(getNoxhProvinceBySlug("tp-ho-chi-minh")?.hubEnabled);
  assert.equal(getNoxhProvinceBySlug("dong-thap")?.hubEnabled, false);
});

test("resolve canonical: Bình Dương → TP.HCM; Long An → Tây Ninh", () => {
  assert.equal(resolveNoxhProvinceCanonical("Bình Dương")?.slug, "tp-ho-chi-minh");
  assert.equal(resolveNoxhProvinceCanonical("Long An")?.slug, "tay-ninh");
  assert.equal(resolveNoxhProvinceCanonical("Bình Phước")?.slug, "dong-nai");
  assert.equal(resolveNoxhProvinceCanonical("Tiền Giang")?.slug, "dong-thap");
  assert.equal(resolveNoxhProvinceCanonical("Kiên Giang")?.slug, "an-giang");
});

test("legacy hub redirects map old slugs", () => {
  assert.equal(resolveLegacyNoxhHubRedirect("binh-duong"), "tp-ho-chi-minh");
  assert.equal(resolveLegacyNoxhHubRedirect("long-an"), "tay-ninh");
  assert.equal(NOXH_LEGACY_HUB_REDIRECTS["binh-phuoc"], "dong-nai");
});

test("dual address: legacy province yields two lines", () => {
  const dual = dualAddressFromProvinceRaw("Bình Dương", {
    district: "Thuận An",
  });
  const formatted = formatDualAddress(dual);
  assert.match(formatted.primary, /TP\. Hồ Chí Minh/);
  assert.match(formatted.legacyLine ?? "", /Bình Dương/);
  assert.match(formatted.compact, /trước thuộc/);
});
