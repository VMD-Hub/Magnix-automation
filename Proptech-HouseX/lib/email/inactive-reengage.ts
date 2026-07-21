import { getBrandName, getSiteUrl } from "@/lib/site-config";

export const INACTIVE_REENGAGE_SEQUENCE_ID = "email-inactive-reengage";

export const INACTIVE_REENGAGE_SUBJECTS = {
  A: "Bạn còn muốn nhận email từ House X?",
  B: "Xác nhận nhận bản tin — hoặc hủy chỉ một cú nhấp",
} as const;

const CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a";

/** ADR-017 P3 — 1-shot re-engage sau ~90 ngày không tương tác. */
export function buildInactiveReengageEmail(input: {
  recipientName: string;
  subject: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string; ctaUrl: string; tags: string[] } {
  const brand = getBrandName();
  const name = input.recipientName.trim() || "bạn";
  const base = getSiteUrl().replace(/\/$/, "");
  const ctaUrl = `${base}/tin-tuc/cam-nang-noxh`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${input.subject}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  <p>Xin chào <strong>${name}</strong>,</p>
  <p>Đã lâu chúng tôi chưa thấy bạn mở email từ <strong>${brand}</strong>. Đây là <strong>một thư duy nhất</strong> hỏi bạn còn muốn nhận bản tin / lộ trình hữu ích không.</p>
  <p style="text-align:center;margin:28px 0">
    <a href="${ctaUrl}" style="${CTA_STYLE}">Vẫn muốn nhận — xem cẩm nang</a>
  </p>
  <p style="font-size:13px;color:#64748b">Nếu không còn nhu cầu, hủy đăng ký bên dưới — chúng tôi sẽ không gửi marketing email nữa.</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">
    <a href="${input.unsubscribeUrl}" style="color:#64748b">Hủy đăng ký email marketing</a>.
  </p>
</body></html>`;

  const text = `Xin chào ${name},

Đây là một thư duy nhất từ ${brand}: bạn còn muốn nhận email không?
Tiếp tục: ${ctaUrl}
Hủy đăng ký: ${input.unsubscribeUrl}

— ${brand}`;

  return {
    subject: input.subject,
    html,
    text,
    ctaUrl,
    tags: ["marketing", "inactive_reengage"],
  };
}
