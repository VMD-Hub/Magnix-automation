import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPromotionTermsMarkdown } from "../lib/content/promotion-terms";
import { renderPromotionTermsMarkdown } from "../lib/content/promotion-terms-render";

test("buildPromotionTermsMarkdown includes broker exclusion clause", () => {
  const md = buildPromotionTermsMarkdown({
    campaignName: "Test Campaign",
    startAt: new Date("2026-01-01"),
    endAt: new Date("2026-07-01"),
  });
  assert.match(md, /Loại trừ môi giới/);
  assert.match(md, /Loại trừ nhà ở thương mại/);
  assert.match(md, /Phân hệ sản phẩm/);
  assert.match(md, /không có giá trị quy đổi thành tiền mặt/);
  assert.match(md, /30 ngày/);
});

test("renderPromotionTermsMarkdown renders prize table", () => {
  const md = buildPromotionTermsMarkdown({
    campaignName: "Test",
    startAt: new Date("2026-01-01"),
    endAt: new Date("2026-07-01"),
  });
  const html = renderPromotionTermsMarkdown(md);
  assert.match(html, /<table/);
  assert.match(html, /Tủ lạnh/);
  assert.match(html, /hỗ trợ hồ sơ NOXH/i);
});
