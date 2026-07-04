import { getEditorialContactEmail } from "@/lib/content/legal-contact";
import {
  getListingReportReason,
  type ListingReportReasonCode,
} from "@/lib/email/listing-report-reasons";
import { transactionalEmailLayout, type OutboundEmail } from "@/lib/email/templates";
import { getBrandName, getSiteUrl } from "@/lib/site-config";

export type ListingReportEmailInput = {
  listingCode: string;
  listingTitle: string;
  reasonCode: ListingReportReasonCode;
  message: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  leadId: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Thông báo nội bộ → biên tập / hỗ trợ. */
export function listingReportEditorialEmail(
  input: ListingReportEmailInput,
): OutboundEmail {
  const reason = getListingReportReason(input.reasonCode);
  const site = getSiteUrl();
  const url = site ? `${site}/tin-dang/${input.listingCode}` : input.listingCode;

  const html = transactionalEmailLayout(
    "Báo cáo tin đăng mới",
    `
      <p><strong>Mã tin:</strong> ${escapeHtml(input.listingCode)}</p>
      <p><strong>Tiêu đề:</strong> ${escapeHtml(input.listingTitle)}</p>
      <p><strong>Lý do:</strong> ${escapeHtml(reason.labelVi)}</p>
      <p><strong>Người báo cáo:</strong> ${escapeHtml(input.reporterName)} · ${escapeHtml(input.reporterPhone)}${
        input.reporterEmail ? ` · ${escapeHtml(input.reporterEmail)}` : ""
      }</p>
      <p><strong>Mô tả:</strong></p>
      <p style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px">${escapeHtml(input.message)}</p>
      <p><a href="${escapeHtml(url)}">Xem tin trên site</a></p>
      <p style="font-size:13px;color:#64748b">Lead ID: ${escapeHtml(input.leadId)}</p>
    `,
  );

  return {
    to: getEditorialContactEmail(),
    subject: `[${getBrandName()}] Báo cáo tin ${input.listingCode} — ${reason.labelVi}`,
    html,
    text: [
      `Báo cáo tin ${input.listingCode}`,
      `Lý do: ${reason.labelVi}`,
      `Người gửi: ${input.reporterName} / ${input.reporterPhone}`,
      input.reporterEmail ? `Email: ${input.reporterEmail}` : "",
      `Mô tả: ${input.message}`,
      `URL: ${url}`,
      `Lead: ${input.leadId}`,
    ]
      .filter(Boolean)
      .join("\n"),
    tags: ["listing_report", "editorial"],
  };
}

/** Xác nhận tiếp nhận — SLA 24h làm việc (copy chính sách). */
export function listingReportAckEmail(
  input: Pick<ListingReportEmailInput, "listingCode" | "reporterName"> & { to: string },
): OutboundEmail {
  const html = transactionalEmailLayout(
    "Đã tiếp nhận báo cáo",
    `
      <p>Xin chào ${escapeHtml(input.reporterName)},</p>
      <p>House X đã nhận báo cáo của bạn về tin <strong>${escapeHtml(input.listingCode)}</strong>.</p>
      <p>Chúng tôi sẽ xác nhận và phân loại trong <strong>24 giờ làm việc</strong>, và xử lý khiếu nại thông thường trong <strong>3 ngày làm việc</strong> theo Chính sách xử lý khiếu nại.</p>
      <p style="font-size:13px;color:#64748b">This is an automated acknowledgment.</p>
    `,
  );

  return {
    to: input.to,
    subject: `${getBrandName()} — Đã nhận báo cáo tin ${input.listingCode}`,
    html,
    text: `House X đã nhận báo cáo tin ${input.listingCode}. Xác nhận trong 24 giờ làm việc.`,
    tags: ["listing_report", "ack"],
  };
}
