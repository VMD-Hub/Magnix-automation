import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapSheetRowToQueueFields,
  mapSheetStatusToQueue,
  mergeSheetIntoExisting,
  parseSheetScore,
  rowsFromSheetValues,
} from "../lib/content/content-queue-sheet-sync.ts";

describe("content-queue sheet sync map", () => {
  it("map status Sheet → Admin", () => {
    assert.equal(mapSheetStatusToQueue("published"), "PUBLISHED");
    assert.equal(mapSheetStatusToQueue("rejected"), "REJECTED");
    assert.equal(mapSheetStatusToQueue("classified"), "INTAKE");
    assert.equal(mapSheetStatusToQueue("qualified"), "INTAKE");
  });

  it("parse score", () => {
    assert.equal(parseSheetScore("82"), 82);
    assert.equal(parseSheetScore(""), null);
  });

  it("map row có normalized_key", () => {
    const m = mapSheetRowToQueueFields({
      normalized_key: "apify:tiktok:1",
      text: "Thu nhập 12tr có mua NƠXH?",
      score: "88",
      status: "classified",
      platform: "tiktok",
      post_url: "https://example.com/p/1",
    });
    assert.ok(m);
    assert.equal(m!.normalizedKey, "sheet:apify:tiktok:1");
    assert.equal(m!.score, 88);
    assert.equal(m!.platform, "tiktok");
    assert.equal(m!.status, "INTAKE");
  });

  it("merge không đè status khi đã PENDING_L3", () => {
    const mapped = mapSheetRowToQueueFields({
      normalized_key: "k1",
      text: "Hello world content enough",
      status: "qualified",
      score: 90,
    })!;
    const merged = mergeSheetIntoExisting(
      {
        status: "PENDING_L3",
        ctaToolId: "noxh-check",
        ctaLabel: "CTA",
        ctaHref: "/cong-cu/dieu-kien-noxh",
        l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
        articleId: null,
        scheduledAt: new Date("2026-08-01T10:00:00Z"),
        painPoint: "Đã ghi tay",
      },
      mapped,
    );
    assert.equal(merged.status, "PENDING_L3");
    assert.equal(merged.painPoint, "Đã ghi tay");
    assert.equal(merged.score, 90);
  });

  it("rowsFromSheetValues đọc header", () => {
    const rows = rowsFromSheetValues([
      ["normalized_key", "text", "score", "status"],
      ["apify:fb:9", "Caption", "70", "qualified"],
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]!.normalized_key, "apify:fb:9");
  });
});
