import { getBrandName, getSiteUrl } from "@/lib/site-config";

export const WAITLIST_DIGEST_SEQUENCE_ID = "waitlist-email-digest";

const CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a";

export const WAITLIST_DIGEST_SUBJECTS = {
  A: "Cập nhật tiến độ dự án bạn theo dõi (email phụ)",
  B: "Tin waitlist House X — không gọi điện chỉ vì đăng ký",
} as const;

/** ADR-016: email phụ; in-app vẫn mặc định. */
export function buildWaitlistDigestEmail(input: {
  recipientName: string;
  weekKey: string;
  subject: string;
  unsubscribeUrl: string;
  projectHint?: string | null;
}): { subject: string; html: string; text: string; ctaUrl: string; tags: string[] } {
  const brand = getBrandName();
  const name = input.recipientName.trim() || "bạn";
  const base = getSiteUrl().replace(/\/$/, "");
  const ctaUrl = `${base}/khach-hang/tai-khoan`;
  const hint = input.projectHint?.trim();

  const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${input.subject}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  <p>Xin chào <strong>${name}</strong>,</p>
  <p>Đây là <strong>email phụ</strong> cho đăng ký nhận tin (waitlist). Cập nhật chính vẫn nằm trong thông báo tài khoản Mini App / web.</p>
  ${hint ? `<p>Dự án bạn quan tâm: <strong>${hint}</strong>.</p>` : ""}
  <p>Tuần <strong>${input.weekKey}</strong>: tin chính sách / tiến độ thưa — không framing «sắp hết» khi chưa mở bán SoR.</p>
  <p style="text-align:center;margin:28px 0">
    <a href="${ctaUrl}" style="${CTA_STYLE}">Xem thông báo tài khoản</a>
  </p>
  <p style="font-size:13px;color:#64748b">Không gọi điện chỉ vì bạn đăng ký nhận cập nhật.</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">
    <a href="${input.unsubscribeUrl}" style="color:#64748b">Hủy đăng ký email marketing</a>.
  </p>
</body></html>`;

  const text = `Xin chào ${name},

Email phụ waitlist ${brand} — tuần ${input.weekKey}.
${hint ? `Dự án: ${hint}\n` : ""}
Xem thông báo tài khoản: ${ctaUrl}
Không gọi điện chỉ vì đăng ký nhận tin.

Hủy đăng ký: ${input.unsubscribeUrl}
— ${brand}`;

  return {
    subject: input.subject,
    html,
    text,
    ctaUrl,
    tags: ["marketing", "waitlist_digest", input.weekKey],
  };
}
