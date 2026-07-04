import { getEditorialContactEmail } from "@/lib/content/legal-contact";
import {
  getListingRemovalReason,
  LISTING_REMOVAL_APPEAL_BUSINESS_DAYS,
  type ListingRemovalReasonCode,
} from "@/lib/email/listing-removal-reasons";
import { transactionalEmailLayout, type OutboundEmail } from "@/lib/email/templates";
import { getBrandName } from "@/lib/site-config";

export type ListingRemovalAction = "removed" | "hidden";

export type ListingRemovalEmailInput = {
  to: string;
  posterName: string;
  listingId: string;
  listingTitle: string;
  /** Chuỗi hiển thị, ví dụ "04/07/2026" */
  noticeDate: string;
  reason: ListingRemovalReasonCode;
  action?: ListingRemovalAction;
  appealBusinessDays?: number;
  supportEmail?: string;
};

const ACTION_COPY: Record<
  ListingRemovalAction,
  { statusVi: string; statusEn: string }
> = {
  removed: {
    statusVi: "đã bị gỡ bỏ khỏi nền tảng",
    statusEn: "has been removed from the platform",
  },
  hidden: {
    statusVi: "đã bị tạm ẩn khỏi nền tảng",
    statusEn: "has been temporarily hidden from the platform",
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bilingualBlock(vi: string, en: string): string {
  return `<p>${vi}</p><p style="font-size:13px;color:#64748b;font-style:italic;margin-top:4px">${en}</p>`;
}

/**
 * Email tự động song ngữ — thông báo gỡ bỏ / tạm ẩn tin đăng.
 * Chỉ chèn một lý do + gợi ý xử lý theo `reason`.
 */
export function listingRemovalEmail(input: ListingRemovalEmailInput): OutboundEmail {
  const action = input.action ?? "removed";
  const appealDays = input.appealBusinessDays ?? LISTING_REMOVAL_APPEAL_BUSINESS_DAYS;
  const supportEmail = input.supportEmail?.trim() || getEditorialContactEmail();
  const reason = getListingRemovalReason(input.reason);
  const actionCopy = ACTION_COPY[action];
  const brand = getBrandName();

  const posterName = escapeHtml(input.posterName.trim() || "bạn");
  const listingId = escapeHtml(input.listingId.trim());
  const listingTitle = escapeHtml(input.listingTitle.trim());
  const noticeDate = escapeHtml(input.noticeDate.trim());
  const supportEmailHtml = escapeHtml(supportEmail);

  const subject = `[House X] Thông báo gỡ bỏ tin đăng / Listing Removal Notice`;

  const text = `Chào ${input.posterName.trim() || "bạn"},
Hello ${input.posterName.trim() || "there"},

House X xin thông báo tin đăng dưới đây ${actionCopy.statusVi}:
House X would like to inform you that the following listing ${actionCopy.statusEn}:

- Mã tin / Listing ID: ${input.listingId}
- Tiêu đề / Title: ${input.listingTitle}
- Ngày thông báo / Notice date: ${input.noticeDate}

LÝ DO GỠ BỎ / REASON FOR REMOVAL
${reason.labelVi} / ${reason.labelEn}
${reason.reasonVi}
${reason.reasonEn}

Hướng xử lý / Next step
${reason.actionHintVi}
${reason.actionHintEn}

Nếu bạn cho rằng đây là nhầm lẫn, vui lòng phản hồi email này hoặc liên hệ ${supportEmail} trong vòng ${appealDays} ngày làm việc để được xem xét lại.
If you believe this is an error, please reply to this email or contact ${supportEmail} within ${appealDays} business days for a review.

Bạn có thể cập nhật lại nội dung tin và gửi yêu cầu đăng lại sau khi đã điều chỉnh đúng theo tiêu chuẩn của ${brand}.
You may update the listing and request republication after it has been adjusted to meet ${brand} standards.

${brand} luôn ưu tiên tính minh bạch, chất lượng thông tin và trải nghiệm an toàn cho người dùng.
${brand} always prioritizes transparency, content quality, and a safe user experience.

Trân trọng / Best regards,
Đội ngũ ${brand} / ${brand} Team`;

  const htmlBody = `
${bilingualBlock(
  `Chào <strong>${posterName}</strong>,`,
  `Hello <strong>${posterName}</strong>,`,
)}
${bilingualBlock(
  `House X xin thông báo tin đăng dưới đây <strong>${actionCopy.statusVi}</strong>:`,
  `House X would like to inform you that the following listing <strong>${actionCopy.statusEn}</strong>:`,
)}
<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
  <tr><td style="padding:6px 0;color:#64748b;width:38%">Mã tin / Listing ID</td><td style="padding:6px 0"><strong>${listingId}</strong></td></tr>
  <tr><td style="padding:6px 0;color:#64748b">Tiêu đề / Title</td><td style="padding:6px 0">${listingTitle}</td></tr>
  <tr><td style="padding:6px 0;color:#64748b">Ngày thông báo / Notice date</td><td style="padding:6px 0">${noticeDate}</td></tr>
</table>

<h3 style="font-size:15px;margin:20px 0 8px;color:#0f172a">Lý do gỡ bỏ / Reason for removal</h3>
${bilingualBlock(
  `Tin đăng của bạn đã được xử lý vì lý do sau:`,
  `Your listing has been actioned for the following reason:`,
)}
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:12px 0">
  <p style="margin:0 0 6px"><strong>${escapeHtml(reason.labelVi)}</strong> / <em>${escapeHtml(reason.labelEn)}</em></p>
  <p style="margin:0">${escapeHtml(reason.reasonVi)}</p>
  <p style="margin:6px 0 0;font-size:13px;color:#64748b;font-style:italic">${escapeHtml(reason.reasonEn)}</p>
</div>

<h3 style="font-size:15px;margin:20px 0 8px;color:#0f172a">Hướng xử lý / Next steps</h3>
${bilingualBlock(escapeHtml(reason.actionHintVi), escapeHtml(reason.actionHintEn))}
${bilingualBlock(
  `Nếu bạn cho rằng đây là nhầm lẫn, vui lòng phản hồi email này hoặc liên hệ <a href="mailto:${supportEmailHtml}" style="color:#9B111E">${supportEmailHtml}</a> trong vòng <strong>${appealDays}</strong> ngày làm việc để được xem xét lại.`,
  `If you believe this is an error, please reply to this email or contact <a href="mailto:${supportEmailHtml}" style="color:#9B111E">${supportEmailHtml}</a> within <strong>${appealDays}</strong> business days for a review.`,
)}
${bilingualBlock(
  `Bạn có thể cập nhật lại nội dung tin và gửi yêu cầu đăng lại sau khi đã điều chỉnh đúng theo tiêu chuẩn của ${escapeHtml(brand)}.`,
  `You may update the listing and request republication after it has been adjusted to meet ${escapeHtml(brand)} standards.`,
)}
${bilingualBlock(
  `${escapeHtml(brand)} luôn ưu tiên tính minh bạch, chất lượng thông tin và trải nghiệm an toàn cho người dùng.`,
  `${escapeHtml(brand)} always prioritizes transparency, content quality, and a safe user experience.`,
)}
<p style="margin-top:24px">Trân trọng,<br><strong>Đội ngũ ${escapeHtml(brand)}</strong><br><span style="font-size:13px;color:#64748b;font-style:italic">Best regards,<br><strong>${escapeHtml(brand)} Team</strong></span></p>`;

  const html = transactionalEmailLayout(subject, htmlBody, { allowReply: true });

  return {
    to: input.to.trim(),
    subject,
    html,
    text,
    tags: ["editorial", "listing_removal", input.reason, action],
  };
}
