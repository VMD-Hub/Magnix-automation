import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDraftSheetKey,
  mapSheetDraftStatus,
  mapSheetRowToDraftFields,
  mergeDraftSheetIntoExisting,
} from "../lib/content/content-draft-sheet-sync.ts";
import { assertContentDraftReadyForL3 } from "../lib/content/content-draft-gates.ts";

describe("content-draft sheet sync map", () => {
  it("map status Sheet → Admin", () => {
    assert.equal(mapSheetDraftStatus("published"), "PUBLISHED");
    assert.equal(mapSheetDraftStatus("rejected"), "REJECTED");
    assert.equal(mapSheetDraftStatus("approved"), "APPROVED");
    assert.equal(mapSheetDraftStatus("pending_l3"), "PENDING_L3");
    assert.equal(mapSheetDraftStatus("draft"), "DRAFT");
    assert.equal(mapSheetDraftStatus(""), "DRAFT");
  });

  it("build sheet key from source + title + ymd", () => {
    const key = buildDraftSheetKey({
      source_normalized_key: "apify:tiktok:1",
      title: "Thu nhập 12tr đủ NƠXH?",
      created_at: "2026-07-21T10:00:00Z",
    });
    assert.ok(key);
    assert.match(key!, /^apify:tiktok:1::.+::2026-07-21$/);
  });

  it("map row có title", () => {
    const m = mapSheetRowToDraftFields({
      source_normalized_key: "src:1",
      title: "Checklist hồ sơ NƠXH",
      hook_line: "Không biết giấy tờ gì?",
      artifact_markdown: "## Checklist\n- CCCD",
      status: "draft",
      created_at: "2026-07-20",
      segment: "NOXH",
    });
    assert.ok(m);
    assert.equal(m!.status, "DRAFT");
    assert.match(m!.normalizedKey, /^sheet-draft:/);
    assert.equal(m!.hookLine, "Không biết giấy tờ gì?");
    assert.equal(m!.segment, "NOXH");
  });

  it("merge không đè body/status khi đã PENDING_L3", () => {
    const mapped = mapSheetRowToDraftFields({
      source_normalized_key: "src:2",
      title: "Title mới từ Sheet",
      hook_line: "Hook Sheet",
      artifact_markdown: "Body Sheet",
      status: "draft",
      created_at: "2026-07-21",
    })!;
    const merged = mergeDraftSheetIntoExisting(
      {
        status: "PENDING_L3",
        ctaToolId: "noxh-check",
        scheduledAt: new Date("2026-08-01T10:00:00Z"),
        articleId: null,
        hookLine: "Hook đã sửa tay",
        artifactMarkdown: "Body đã sửa tay",
      },
      mapped,
    );
    assert.equal(merged.status, "PENDING_L3");
    assert.equal(merged.hookLine, "Hook đã sửa tay");
    assert.equal(merged.artifactMarkdown, "Body đã sửa tay");
    assert.equal(merged.title, "Title mới từ Sheet");
  });

  it("merge cập nhật body khi còn DRAFT", () => {
    const mapped = mapSheetRowToDraftFields({
      source_normalized_key: "src:3",
      title: "Title sync",
      hook_line: "Hook sync",
      artifact_markdown: "Body sync",
      status: "draft",
      created_at: "2026-07-21",
    })!;
    const merged = mergeDraftSheetIntoExisting(
      {
        status: "DRAFT",
        ctaToolId: null,
        scheduledAt: null,
        articleId: null,
        hookLine: "old",
        artifactMarkdown: "old",
      },
      mapped,
    );
    assert.equal(merged.status, "DRAFT");
    assert.equal(merged.hookLine, "Hook sync");
    assert.equal(merged.artifactMarkdown, "Body sync");
  });
});

describe("content-draft L3 gate", () => {
  it("fail khi thiếu CTA tool", () => {
    const r = assertContentDraftReadyForL3({
      title: "Bài test",
      hookLine: "Nỗi đau",
      artifactMarkdown: "Body",
      ctaToolId: null,
      ctaLabel: "CTA",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, false);
    assert.ok(r.errors.some((e) => e.includes("CTA tool")));
  });

  it("pass khi đủ CTA + checklist", () => {
    const r = assertContentDraftReadyForL3({
      title: "Bài test",
      hookLine: "Nỗi đau NƠXH",
      artifactMarkdown: "## Body",
      ctaToolId: "noxh-check",
      ctaLabel: "Kiểm tra điều kiện",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    });
    assert.equal(r.pass, true);
    assert.equal(r.errors.length, 0);
  });
});
