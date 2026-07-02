import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildListingTitle,
  resolveListingDisplayTitle,
  resolveListingMetaTitle,
} from "../lib/content/title";
import { buildDtaHappyHomeListingDetail } from "../lib/preview/dta-happy-home-listings";
import { getPublicListingByCode } from "../lib/data/listing-browse";

describe("listing display title", () => {
  it("prefers editorial title over generic template", () => {
    const generic = buildListingTitle({
      transactionType: "SALE",
      propertyType: "can_ho",
      area: 32.85,
      district: "Nhơn Trạch",
      province: "Đồng Nai",
    });
    const display = resolveListingDisplayTitle({
      transactionType: "SALE",
      propertyType: "can_ho",
      area: 32.85,
      district: "Nhơn Trạch",
      province: "Đồng Nai",
      title: "Mua nhà NOXH bằng lương — A10-201 32,85m², chỉ 448 triệu",
    });
    assert.notEqual(display, generic);
    assert.match(display, /NOXH/);
  });

  it("meta title appends listing code when missing", () => {
    const meta = resolveListingMetaTitle({
      transactionType: "SALE",
      propertyType: "can_ho",
      district: "Nhơn Trạch",
      province: "Đồng Nai",
      code: "DTA-HH-A10201",
      title: "Trả góp như thuê trọ — NOXH Nhơn Trạch 448 triệu",
    });
    assert.match(meta, /DTA-HH-A10201/);
  });

  it("DTA demo detail exposes emotional hook title", async () => {
    const detail = buildDtaHappyHomeListingDetail("DTA-HH-A10201");
    assert.ok(detail?.title);
    assert.match(detail!.title!, /lương|thuê trọ|NOXH/i);

    const publicDetail = await getPublicListingByCode("DTA-HH-A10201");
    assert.ok(publicDetail?.title);
    assert.equal(publicDetail!.title, detail!.title);
    assert.match(
      resolveListingDisplayTitle(publicDetail!),
      /Mua nhà NOXH bằng lương/,
    );
  });
});
