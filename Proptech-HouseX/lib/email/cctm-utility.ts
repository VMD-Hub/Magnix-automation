import { getBrandName, getSiteUrl } from "@/lib/site-config";

export const CCTM_UTILITY_SEQUENCE_ID = "cctm-utility-email";

export const CCTM_UTILITY_SUBJECTS = {
  A: "Công cụ BĐS House X — dữ liệu & utility cho CCTM",
  B: "Utility nhà thương mại: định hướng nhu cầu trước khi gọi khách",
} as const;

const CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a";

/** ADR-017 P3 — cohort CCTM / môi giới quan tâm công cụ. */
export function buildCctmUtilityEmail(input: {
  recipientName: string;
  subject: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string; ctaUrl: string; tags: string[] } {
  const brand = getBrandName();
  const name = input.recipientName.trim() || "bạn";
  const base = getSiteUrl().replace(/\/$/, "");
  const ctaUrl = `${base}/cong-cu`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${input.subject}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  <p>Xin chào <strong>${name}</strong>,</p>
  <p>Bạn đang ở phân khúc <strong>nhà thương mại / utility BĐS</strong>. ${brand} có bộ công cụ hỗ trợ phân tích nhu cầu — value-first, không ép bán.</p>
  <ul>
    <li>Công cụ tài chính / khả năng vay</li>
    <li>Tra cứu dự án & listing trên hệ thống</li>
    <li>Kênh CTV khi bạn sẵn sàng hợp tác</li>
  </ul>
  <p style="text-align:center;margin:28px 0">
    <a href="${ctaUrl}" style="${CTA_STYLE}">Mở bộ công cụ House X</a>
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">
    <a href="${input.unsubscribeUrl}" style="color:#64748b">Hủy đăng ký email marketing</a>.
  </p>
</body></html>`;

  const text = `Xin chào ${name},

Utility BĐS / CCTM trên ${brand}:
${ctaUrl}

Hủy đăng ký: ${input.unsubscribeUrl}
— ${brand}`;

  return {
    subject: input.subject,
    html,
    text,
    ctaUrl,
    tags: ["marketing", "cctm_utility"],
  };
}
