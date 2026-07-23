import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findProvinceByDistrict,
  findProvinceByName,
  findProvinceBySlug,
  getListingBrowseProvinces,
  provinceFromSlug,
  resolveListingBrowseLocation,
} from "../lib/content/listing-browse-locations";
import {
  canThoBrowseDistrictFlatList,
  isCanThoMegaCityProvince,
  provincesMatchingCanThoMegaCity,
} from "../lib/content/can-tho-browse-locations-2025";
import {
  dongNaiBrowseDistrictFlatList,
  isDongNaiMegaCityProvince,
  provincesMatchingDongNaiMegaCity,
} from "../lib/content/dong-nai-browse-locations-2025";
import {
  hcmBrowseDistrictFlatList,
  isHcmMegaCityProvince,
  provincesMatchingHcmMegaCity,
} from "../lib/content/hcm-browse-locations-2025";
import {
  isTayNinhMegaProvince,
  provincesMatchingTayNinhMegaProvince,
  tayNinhBrowseDistrictFlatList,
} from "../lib/content/tay-ninh-browse-locations-2025";

describe("listing browse locations", () => {
  it("registers planned provinces without separate Long An, Binh Duong or Binh Phuoc entry", () => {
    const slugs = getListingBrowseProvinces().map((p) => p.slug);
    assert.ok(slugs.includes("tp-hcm"));
    assert.ok(slugs.includes("dong-nai"));
    assert.ok(slugs.includes("can-tho"));
    assert.ok(slugs.includes("tay-ninh"));
    assert.ok(slugs.includes("binh-thuan"));
    assert.ok(!slugs.includes("long-an"));
    assert.ok(!slugs.includes("binh-duong"));
    assert.ok(!slugs.includes("binh-phuoc"));
  });

  it("TP.HCM mega city includes legacy province aliases for filtering", () => {
    const names = provincesMatchingHcmMegaCity();
    assert.ok(names.includes("TP. Hồ Chí Minh"));
    assert.ok(names.includes("Bình Dương"));
    assert.ok(names.includes("Bà Rịa - Vũng Tàu"));
    assert.ok(isHcmMegaCityProvince("Bình Dương"));
  });

  it("Can Tho mega city includes Hau Giang and Soc Trang aliases", () => {
    const names = provincesMatchingCanThoMegaCity();
    assert.ok(names.includes("TP. Cần Thơ"));
    assert.ok(names.includes("Cần Thơ"));
    assert.ok(names.includes("Hậu Giang"));
    assert.ok(names.includes("Sóc Trăng"));
    assert.ok(isCanThoMegaCityProvince("Hậu Giang"));
    assert.ok(isCanThoMegaCityProvince("Sóc Trăng"));
    assert.ok(isCanThoMegaCityProvince("TP. Cần Thơ"));
  });

  it("Tay Ninh mega province includes Long An alias", () => {
    const names = provincesMatchingTayNinhMegaProvince();
    assert.ok(names.includes("Tây Ninh"));
    assert.ok(names.includes("Long An"));
    assert.ok(isTayNinhMegaProvince("Long An"));
  });

  it("TP. Dong Nai mega city includes legacy province aliases for filtering", () => {
    const names = provincesMatchingDongNaiMegaCity();
    assert.ok(names.includes("TP. Đồng Nai"));
    assert.ok(names.includes("Đồng Nai"));
    assert.ok(names.includes("Bình Phước"));
    assert.ok(isDongNaiMegaCityProvince("Bình Phước"));
    assert.ok(isDongNaiMegaCityProvince("Đồng Nai"));
  });

  it("HCM browse list includes BRVT and Con Dao zones", () => {
    const flat = hcmBrowseDistrictFlatList();
    assert.ok(flat.includes("Phường Vũng Tàu"));
    assert.ok(flat.includes("Phường Bà Rịa"));
    assert.ok(flat.includes("Đặc khu Côn Đảo"));
    assert.ok(flat.includes("Dĩ An"));
  });

  it("Can Tho browse list includes Hau Giang and Soc Trang zones", () => {
    const flat = canThoBrowseDistrictFlatList();
    assert.ok(flat.includes("Vị Thanh"));
    assert.ok(flat.includes("Sóc Trăng"));
  });

  it("Tay Ninh browse list includes Long An legacy districts", () => {
    const flat = tayNinhBrowseDistrictFlatList();
    assert.ok(flat.includes("Đức Hòa"));
    assert.ok(flat.includes("Mỹ Hạnh Nam"));
    assert.ok(flat.includes("Trảng Bàng"));
  });

  it("Dong Nai browse list includes Binh Phuoc zones", () => {
    const flat = dongNaiBrowseDistrictFlatList();
    assert.ok(flat.includes("Nhơn Trạch"));
    assert.ok(flat.includes("Đồng Xoài"));
    assert.ok(flat.includes("Chơn Thành"));
  });

  it("HCM province has district optgroups", () => {
    const hcm = findProvinceBySlug("tp-hcm");
    assert.ok(hcm?.districtGroups && hcm.districtGroups.length >= 5);
  });

  it("Can Tho, Tay Ninh and Dong Nai provinces have district optgroups", () => {
    const canTho = findProvinceBySlug("can-tho");
    assert.ok(canTho?.districtGroups && canTho.districtGroups.length >= 2);
    const tayNinh = findProvinceBySlug("tay-ninh");
    assert.ok(tayNinh?.districtGroups && tayNinh.districtGroups.length >= 2);
    const dongNai = findProvinceBySlug("dong-nai");
    assert.ok(dongNai?.districtGroups && dongNai.districtGroups.length >= 2);
    assert.equal(dongNai?.label, "TP. Đồng Nai");
  });

  it("merges Nhon Trach from DTA catalog listings", () => {
    const dongNai = findProvinceBySlug("dong-nai");
    assert.ok(dongNai?.districts.includes("Nhơn Trạch"));
  });

  it("resolves province slug to canonical central city name", () => {
    assert.equal(provinceFromSlug("dong-nai"), "TP. Đồng Nai");
  });

  it("maps legacy Dong Nai and Binh Phuoc province names to TP. Dong Nai browse entry", () => {
    assert.equal(findProvinceByName("Đồng Nai")?.slug, "dong-nai");
    assert.equal(findProvinceByName("Bình Phước")?.slug, "dong-nai");
  });

  it("maps legacy Binh Duong province name to TP.HCM browse entry", () => {
    assert.equal(findProvinceByName("Bình Dương")?.slug, "tp-hcm");
  });

  it("maps legacy Long An province name to Tay Ninh browse entry", () => {
    assert.equal(findProvinceByName("Long An")?.slug, "tay-ninh");
  });

  it("maps legacy Hau Giang and Soc Trang to Can Tho browse entry", () => {
    assert.equal(findProvinceByName("Hậu Giang")?.slug, "can-tho");
    assert.equal(findProvinceByName("Sóc Trăng")?.slug, "can-tho");
  });

  it("resolves legacy long-an slug to Tay Ninh", () => {
    assert.equal(findProvinceBySlug("long-an")?.slug, "tay-ninh");
    assert.equal(provinceFromSlug("long-an"), "Tây Ninh");
  });

  it("resolves legacy binh-phuoc slug to TP. Dong Nai", () => {
    assert.equal(findProvinceBySlug("binh-phuoc")?.slug, "dong-nai");
    assert.equal(provinceFromSlug("binh-phuoc"), "TP. Đồng Nai");
  });

  it("resolves legacy district-only URL to owning province", () => {
    const loc = resolveListingBrowseLocation({ district: "Nhơn Trạch" });
    assert.equal(loc.province, "TP. Đồng Nai");
    assert.equal(loc.provinceSlug, "dong-nai");
    assert.equal(loc.district, "Nhơn Trạch");
  });

  it("resolves Dong Xoai district to TP. Dong Nai mega city", () => {
    const loc = resolveListingBrowseLocation({ district: "Đồng Xoài" });
    assert.equal(loc.provinceSlug, "dong-nai");
  });

  it("resolves Di An district to TP.HCM mega city", () => {
    const loc = resolveListingBrowseLocation({ district: "Dĩ An" });
    assert.equal(loc.provinceSlug, "tp-hcm");
  });

  it("resolves Duc Hoa district to Tay Ninh mega province", () => {
    const loc = resolveListingBrowseLocation({ district: "Đức Hòa" });
    assert.equal(loc.provinceSlug, "tay-ninh");
  });

  it("findProvinceByDistrict works for HCM legacy districts", () => {
    assert.equal(findProvinceByDistrict("Thủ Đức")?.slug, "tp-hcm");
  });
});
