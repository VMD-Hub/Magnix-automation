import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateContentDraftPagePublishDue,
  resolvePagePublishScheduledMs,
  wantsFacebookPagePublish,
} from "../lib/content/content-page-publish-due.ts";

describe("content-page-publish due (P4.3)", () => {
  const now = Date.parse("2026-07-21T12:00:00+07:00");

  it("honor scheduledAt column trước meta.scheduled_at", () => {
    const ms = resolvePagePublishScheduledMs(
      new Date("2026-07-21T10:00:00+07:00"),
      { scheduled_at: "2026-07-22T10:00:00+07:00" },
    );
    assert.equal(ms, Date.parse("2026-07-21T10:00:00+07:00"));
  });

  it("fallback meta.scheduled_at khi cột null", () => {
    const ms = resolvePagePublishScheduledMs(null, {
      scheduled_at: "2026-07-21T10:00:00+07:00",
    });
    assert.equal(ms, Date.parse("2026-07-21T10:00:00+07:00"));
  });

  it("FB_PAGE channel = wants page", () => {
    assert.equal(wantsFacebookPagePublish("FB_PAGE", {}), true);
    assert.equal(
      wantsFacebookPagePublish(null, { target_channel: "facebook_page" }),
      true,
    );
    assert.equal(wantsFacebookPagePublish("WEBSITE", {}), false);
  });

  it("not due khi scheduledAt tương lai", () => {
    const r = evaluateContentDraftPagePublishDue(
      {
        status: "APPROVED",
        publishChannel: "FB_PAGE",
        scheduledAt: new Date("2026-07-22T10:00:00+07:00"),
        artifactMarkdown: "A".repeat(50),
        meta: {},
      },
      now,
    );
    assert.equal(r.due, false);
    if (!r.due) assert.equal(r.reason, "not_due");
  });

  it("due khi APPROVED + FB_PAGE + body + lịch đã tới", () => {
    const r = evaluateContentDraftPagePublishDue(
      {
        status: "APPROVED",
        publishChannel: "FB_PAGE",
        scheduledAt: new Date("2026-07-21T10:00:00+07:00"),
        artifactMarkdown: "Nội dung đủ dài để đăng Facebook Page NƠXH test body.",
        meta: {},
      },
      now,
    );
    assert.equal(r.due, true);
  });

  it("due khi không có lịch (đăng ngay)", () => {
    const r = evaluateContentDraftPagePublishDue(
      {
        status: "APPROVED",
        publishChannel: "FB_PAGE",
        scheduledAt: null,
        artifactMarkdown: "Nội dung đủ dài để đăng Facebook Page NƠXH test body.",
        meta: { target_channel: "facebook_page" },
      },
      now,
    );
    assert.equal(r.due, true);
  });

  it("block đã published trong meta", () => {
    const r = evaluateContentDraftPagePublishDue(
      {
        status: "APPROVED",
        publishChannel: "FB_PAGE",
        artifactMarkdown: "Nội dung đủ dài để đăng Facebook Page NƠXH test body.",
        meta: { fb_post_id: "123_456" },
      },
      now,
    );
    assert.equal(r.due, false);
    if (!r.due) assert.equal(r.reason, "already_published");
  });
});
