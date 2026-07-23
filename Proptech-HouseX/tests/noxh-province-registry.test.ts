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

test("P0 registry: 14 entries, 14 hubs enabled (Quảng Ninh on)", () => {
  assert.equal(NOXH_PROVINCE_REGISTRY_P0.length, 14);
  assert.equal(listNoxhProvinceHubsEnabled().length, 14);
  assert.ok(getNoxhProvinceBySlug("tp-ho-chi-minh")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("ha-noi")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("bac-ninh")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("quang-ninh")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("da-nang")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("dong-thap")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("an-giang")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("khanh-hoa")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("lam-dong")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("dak-lak")?.hubEnabled);
  assert.ok(getNoxhProvinceBySlug("gia-lai")?.hubEnabled);
});

test("resolve canonical: Bình Dương → TP.HCM; Long An → Tây Ninh", () => {
  assert.equal(resolveNoxhProvinceCanonical("Bình Dương")?.slug, "tp-ho-chi-minh");
  assert.equal(resolveNoxhProvinceCanonical("Long An")?.slug, "tay-ninh");
  assert.equal(resolveNoxhProvinceCanonical("Bình Phước")?.slug, "dong-nai");
  assert.equal(resolveNoxhProvinceCanonical("Tiền Giang")?.slug, "dong-thap");
  assert.equal(resolveNoxhProvinceCanonical("Kiên Giang")?.slug, "an-giang");
  assert.equal(resolveNoxhProvinceCanonical("Ninh Thuận")?.slug, "khanh-hoa");
  assert.equal(resolveNoxhProvinceCanonical("Nha Trang")?.slug, "khanh-hoa");
  assert.equal(resolveNoxhProvinceCanonical("Bình Thuận")?.slug, "lam-dong");
  assert.equal(resolveNoxhProvinceCanonical("Đắk Nông")?.slug, "lam-dong");
  assert.equal(resolveNoxhProvinceCanonical("Đà Lạt")?.slug, "lam-dong");
  assert.equal(resolveNoxhProvinceCanonical("Phú Yên")?.slug, "dak-lak");
  assert.equal(resolveNoxhProvinceCanonical("Bình Định")?.slug, "gia-lai");
  assert.equal(resolveNoxhProvinceCanonical("Quy Nhơn")?.slug, "gia-lai");
  assert.equal(resolveNoxhProvinceCanonical("Bắc Giang")?.slug, "bac-ninh");
  assert.equal(resolveNoxhProvinceCanonical("Yên Phong")?.slug, "bac-ninh");
  assert.equal(resolveNoxhProvinceCanonical("Hạ Long")?.slug, "quang-ninh");
  assert.equal(resolveNoxhProvinceCanonical("Quảng Ninh")?.slug, "quang-ninh");
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
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("ninh-thuan"),
    "/du-an/nha-o-xa-hoi/khanh-hoa",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("binh-thuan"),
    "/du-an/nha-o-xa-hoi/lam-dong",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("dak-nong"),
    "/du-an/nha-o-xa-hoi/lam-dong",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("phu-yen"),
    "/du-an/nha-o-xa-hoi/dak-lak",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("binh-dinh"),
    "/du-an/nha-o-xa-hoi/gia-lai",
  );
  assert.equal(
    resolveNoxhLegacyHubRedirectPath("bac-giang"),
    "/du-an/nha-o-xa-hoi/bac-ninh",
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
  assert.equal(resolveNoxhProvinceHubEntry("khanh-hoa")?.slug, "khanh-hoa");
  assert.equal(resolveNoxhProvinceHubEntry("lam-dong")?.slug, "lam-dong");
  assert.equal(resolveNoxhProvinceHubEntry("dak-lak")?.slug, "dak-lak");
  assert.equal(resolveNoxhProvinceHubEntry("gia-lai")?.slug, "gia-lai");
  assert.equal(resolveNoxhProvinceHubEntry("bac-ninh")?.slug, "bac-ninh");
  assert.equal(resolveNoxhProvinceHubEntry("quang-ninh")?.slug, "quang-ninh");
  assert.equal(resolveNoxhProvinceHubEntry("binh-duong"), undefined);
  assert.equal(
    listNoxhProvinceHubsEnabled()
      .map((e) => e.slug)
      .sort()
      .join(","),
    "an-giang,bac-ninh,can-tho,da-nang,dak-lak,dong-nai,dong-thap,gia-lai,ha-noi,khanh-hoa,lam-dong,quang-ninh,tay-ninh,tp-ho-chi-minh",
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
  assert.equal(inferPrismaSalesRegionFromProvince("Khánh Hòa"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Ninh Thuận"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Lâm Đồng"), "SOUTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Bình Thuận"), "SOUTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Đắk Lắk"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Gia Lai"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Phú Yên"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Bình Định"), "CENTRAL");
  assert.equal(inferPrismaSalesRegionFromProvince("Bắc Ninh"), "NORTH");
  assert.equal(inferPrismaSalesRegionFromProvince("Bắc Giang"), "NORTH");
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
