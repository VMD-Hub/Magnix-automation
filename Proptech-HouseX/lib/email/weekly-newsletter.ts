import { getBrandName, getSiteUrl } from "@/lib/site-config";

export const WEEKLY_NEWSLETTER_SEQUENCE_ID = "weekly-newsletter";

const CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a";

export const WEEKLY_NEWSLETTER_SUBJECTS = {
  A: "Điểm tin NOXH tuần này — chính sách & dự án SoR",
  B: "Bản tin House X: điều kiện NOXH + dự án đang nhận hồ sơ",
} as const;

export function buildWeeklyNewsletterEmail(input: {
  recipientName: string;
  weekKey: string;
  subject: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string; ctaUrl: string; tags: string[] } {
  const brand = getBrandName();
  const name = input.recipientName.trim() || "bạn";
  const base = getSiteUrl().replace(/\/$/, "");
  const ctaUrl = `${base}/wiki-nha-o-xa-hoi`;
  const projectsUrl = `${base}/du-an/nha-o-xa-hoi`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${input.subject}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  <p>Xin chào <strong>${name}</strong>,</p>
  <p>Bản tin tuần <strong>${input.weekKey}</strong> — cập nhật thưa, value-first (không ép gọi).</p>
  <ul>
    <li>Chính sách / điều kiện NOXH đáng chú ý trong tuần</li>
    <li>Dự án đang / sắp nhận hồ sơ trên hệ thống ${brand}</li>
    <li>Công cụ kiểm tra điều kiện — rà lại hồ sơ trước khi nộp</li>
  </ul>
  <p style="text-align:center;margin:28px 0">
    <a href="${ctaUrl}" style="${CTA_STYLE}">Đọc cẩm nang NOXH</a>
  </p>
  <p style="font-size:13px;color:#64748b">Hoặc xem dự án: <a href="${projectsUrl}">${projectsUrl}</a></p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">
    Bạn nhận email vì đã opt-in bản tin.
    <a href="${input.unsubscribeUrl}" style="color:#64748b">Hủy đăng ký email marketing</a>.
  </p>
</body></html>`;

  const text = `Xin chào ${name},

Bản tin tuần ${input.weekKey} từ ${brand}.
- Wiki nhà ở xã hội: ${ctaUrl}
- Dự án: ${projectsUrl}

Hủy đăng ký: ${input.unsubscribeUrl}
— ${brand}`;

  return {
    subject: input.subject,
    html,
    text,
    ctaUrl,
    tags: ["marketing", "weekly_newsletter", input.weekKey],
  };
}
