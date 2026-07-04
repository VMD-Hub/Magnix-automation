import { test } from "node:test";
import assert from "node:assert/strict";
import { listingRemovalEmail } from "../lib/email/listing-removal-template";

const baseInput = {
  to: "poster@example.com",
  posterName: "Nguyễn Văn A",
  listingId: "HX-2026-001",
  listingTitle: "Căn hộ 2PN Quận 7",
  noticeDate: "04/07/2026",
  reason: "incorrect_price" as const,
};

test("listingRemovalEmail: subject song ngữ cố định", () => {
  const mail = listingRemovalEmail(baseInput);
  assert.match(mail.subject, /Listing Removal Notice/);
  assert.match(mail.subject, /Thông báo gỡ bỏ tin đăng/);
});

test("listingRemovalEmail: chỉ chèn một lý do được chọn", () => {
  const mail = listingRemovalEmail(baseInput);
  assert.match(mail.text, /Sai giá/);
  assert.match(mail.text, /Incorrect price/);
  assert.doesNotMatch(mail.text, /Tin trùng/);
  assert.doesNotMatch(mail.text, /Duplicate listing/);
  assert.doesNotMatch(mail.html, /Vi phạm pháp lý/);
});

test("listingRemovalEmail: gợi ý xử lý theo lý do", () => {
  const mail = listingRemovalEmail({
    ...baseInput,
    reason: "duplicate_listing",
  });
  assert.match(mail.text, /chỉ giữ một tin đại diện/);
  assert.match(mail.text, /one representative listing/);
});

test("listingRemovalEmail: SLA khiếu nại mặc định 7 ngày làm việc", () => {
  const mail = listingRemovalEmail(baseInput);
  assert.match(mail.text, /7 ngày làm việc/);
  assert.match(mail.text, /7 business days/);
});

test("listingRemovalEmail: action hidden thay đổi mô tả", () => {
  const mail = listingRemovalEmail({ ...baseInput, action: "hidden" });
  assert.match(mail.text, /tạm ẩn/);
  assert.match(mail.text, /temporarily hidden/);
});

test("listingRemovalEmail: tags cho webhook / n8n", () => {
  const mail = listingRemovalEmail(baseInput);
  assert.deepEqual(mail.tags, ["editorial", "listing_removal", "incorrect_price", "removed"]);
});

test("listingRemovalEmail: footer cho phép phản hồi", () => {
  const mail = listingRemovalEmail(baseInput);
  assert.match(mail.html, /phản hồi email này/);
  assert.match(mail.html, /reply to this email/);
});
