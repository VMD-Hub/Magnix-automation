import assert from "node:assert/strict";
import test from "node:test";
import {
  dualAddressFromProvinceRaw,
  formatDualAddress,
  getNoxhProvinceBySlug,
  inferPrismaSalesRegionFromProvince,
  listNoxhProvinceHubsEnabled,
  NOXH_LEGACY_HUB_REDIRECTS,
  NOXH_PROVINCE_REGISTRY_P0,
  planProjectSalesRegionBackfill,
  provincesMatchingNoxhHub,
  resolveLegacyNoxhHubRedirect,
  resolveNoxhLegacyHubRedirectPath,
  resolveNoxhProvinceCanonical,
} from "../lib/content/noxh-province-registry";
import {
  buildNoxhProvinceHubFaqs,
  resolveNoxhProvinceHubEntry,
} from "../lib/content/noxh-province-hub";

test("P0 registry: 8 entries, 8 hubs enabled (An Giang on)", () => {
  assert.equal(NOXH_PROVINCE_REGISTRY_P0.length, 8);
  assert.equal(listNoxhProvinceHubsEnabled().length, 8);
  assert.ok(getNoxhProvinceBySlug("tp-ho-chi-minh")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("ha-noi")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("da-nang")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("dong-thap")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("an-giang")?.hubEnabled);
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

test("legacy hub redirect path: enabled → hub; disabled → national", () => {
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("binh-duong"),
    "/du-an/nha-o-xa-hoi/tp-ho-chi-minh",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("long-an"),
    "/du-an/nha-o-xa-hoi/tay-ninh",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("tien-giang"),
    "/du-an/nha-o-xa-hoi/dong-thap",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("kien-giang"),
    "/du-an/nha-o-xa-hoi/an-giang",
  );
});

test("provincesMatchingNoxhHub includes aliases", () => {
  const hcm = provincesMatchingNoxhHub("tp-ho-chi-minh");
  assert.ok(hcm.includes("TP. Hồ Chí Minh"));
  assert.ok(hcm.includes("Bình Dương"));
  assert.ok(hcm.includes("Bà Rịa - Vũng Tàu"));
});

test("hub entry resolve: enabled only", () => {
  assert.equal(resolveNoxhProvinceHubEntry("tp-ho-chi-minh")?.slug, "tp-ho-chi-minh");
  assert.equal(resolveNoxhProvinceHubEntry("dong-thap")?.slug, "dong-thap");
  assert.equal(resolveNoxhProvinceHubEntry("an-giang")?.slug, "an-giang");
  assert.equal(resolveNoxhProvinceHubEntry("binh-duong"), undefined);
  assert.equal(
    listNoxhProvinceHubsEnabled()
      .map((e) => e.slug)
      .sort()
      .join(","),
    "an-giang,can-tho,da-nang,dong-nai,dong-thap,ha-noi,tay-ninh,tp-ho-chi-minh",
  );
});

test("hub FAQ mentions aliases without salesRegion", () => {
  const entry = resolveNoxhProvinceHubEntry("tp-ho-chi-minh");
  assert.ok(entry);
  const faqs = buildNoxhProvinceHubFaqs(entry!);
  const blob = JSON.stringify(faqs);
  assert.match(blob, /Bình Dương/);
  assert.doesNotMatch(blob, /salesRegion|SOUTH|leadLane/i);
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

test("infer Prisma salesRegion from province", () => {
  assert.equal(inferPrismaSalesRegionFromProvince("Bình Dương"), "SOUTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Long An"), "SOUTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Hà Nội"), "NORTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Đà Nẵng"), "CENTRAL");
});

test("plan salesRegion backfill: null → set; mismatch needs force", () => {
  assert.deepEqual(planProjectSalesRegionBackfill("Bình Dương", null), {
    action: "set",
    next: "SOUTH",
  });
  assert.deepEqual(planProjectSalesRegionBackfill("Bình Dương", "SOUTH"), {
    action: "skip",
    reason: "already_ok",
  });
  assert.deepEqual(planProjectSalesRegionBackfill("Bình Dương", "NORTH"), {
    action: "skip",
    reason: "keep_existing",
  });
  assert.deepEqual(
    planProjectSalesRegionBackfill("Bình Dương", "NORTH", { force: true }),
    { action: "set", next: "SOUTH" },
  );
  assert.deepEqual(planProjectSalesRegionBackfill("Hà Nội", null), {
    action: "set",
    next: "NORTH",
  });
  assert.deepEqual(planProjectSalesRegionBackfill("Hải Phòng", null), {
    action: "skip",
    reason: "no_infer",
  });
});
