import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DTA_HAPPY_HOME_INVENTORY_A10 } from "../lib/content/dta-happy-home-inventory-a10";
import { buildDtaUnitListingCopy } from "../lib/content/dta-happy-home-listing-copy";
import {
  buildDtaHappyHomeListingDetail,
  listDtaHappyHomeListingCards,
} from "../lib/preview/dta-happy-home-listings";

describe("DTA Happy Home A10 listings", () => {
  it("has 30 inventory units with unique titles", () => {
    assert.equal(DTA_HAPPY_HOME_INVENTORY_A10.length, 30);
    const cards = listDtaHappyHomeListingCards();
    assert.equal(cards.length, 30);
    const titles = new Set(cards.map((c) => c.title));
    assert.equal(titles.size, 30);
  });

  it("each listing mentions official CĐT price and Q4/2027 handover", () => {
    const detail = buildDtaHappyHomeListingDetail("DTA-HH-A10201");
    assert.ok(detail?.description?.includes("giá chính thức từ CĐT"));
    assert.ok(detail?.description?.includes("Quý IV / 2027"));
    assert.ok(detail?.description?.includes("/cong-cu/tinh-khoan-vay"));
  });

  it("copy includes CTA links rotated across units", () => {
    const c0 = buildDtaUnitListingCopy(DTA_HAPPY_HOME_INVENTORY_A10[0]!, 0);
    const c1 = buildDtaUnitListingCopy(DTA_HAPPY_HOME_INVENTORY_A10[1]!, 1);
    assert.ok(c0.description.includes("/cong-cu/tinh-khoan-vay"));
    assert.ok(c1.description.includes("/lien-he"));
  });

  it("premium unit A10-425 has largest area in copy", () => {
    const u = DTA_HAPPY_HOME_INVENTORY_A10.find((x) => x.unitCode === "A10-425");
    assert.ok(u && u.netAreaM2 >= 50);
    const copy = buildDtaUnitListingCopy(u!, 18);
    assert.match(copy.title, /A10-425/);
    assert.match(copy.description, /50,68/);
  });

  it("titles use emotional hooks and keep NOXH SEO anchors", () => {
    const hookPattern =
      /lương|thuê trọ|trả góp|sở hữu|an cư|giấc mơ|đốt|CĐT|KCN|đầu tiên|xứng đáng|bỏ lỡ|cơ hội|TOD|metro|quy hoạch|đô thị|hạ tầng|vệ tinh|tương lai|Vành đai|cao tốc|Quốc lộ|25B|25C|Long Thành|liên vùng|kết nối/i;
    for (let i = 0; i < DTA_HAPPY_HOME_INVENTORY_A10.length; i++) {
      const u = DTA_HAPPY_HOME_INVENTORY_A10[i]!;
      const copy = buildDtaUnitListingCopy(u, i);
      assert.match(copy.title, hookPattern, copy.title);
      assert.match(copy.title, /NOXH|Happy Home|Nhơn Trạch/i, copy.title);
      assert.ok(copy.title.includes(u.unitCode), copy.title);
    }
  });

  it("includes TOD and future-urban title hooks in the rotation", () => {
    const todPattern = /TOD|metro|quy hoạch|đô thị tương lai|vệ tinh|ngầm/i;
    const titles = DTA_HAPPY_HOME_INVENTORY_A10.map((u, i) =>
      buildDtaUnitListingCopy(u, i).title,
    );
    assert.ok(
      titles.some((t) => todPattern.test(t)),
      "expected at least one TOD-themed title",
    );
    assert.match(
      buildDtaUnitListingCopy(DTA_HAPPY_HOME_INVENTORY_A10[12]!, 12).title,
      /TOD|metro/i,
    );
  });
});
