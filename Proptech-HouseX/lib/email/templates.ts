import { getSiteUrl, getBrandName } from "@/lib/site-config";

export type OutboundEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
};

function siteUrl(): string {
  return getSiteUrl();
}

const EMAIL_CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a;box-shadow:inset 0 1px 0 rgba(255,255,255,0.35),0 2px 0 #96700a,0 4px 14px rgba(218,165,32,0.35)";

const DEFAULT_FOOTER_VI = (brand: string) =>
  `Email tự động từ ${brand} — vui lòng không trả lời trực tiếp.`;

const REPLY_FOOTER_VI = (brand: string) =>
  `Email tự động từ ${brand} — bạn có thể phản hồi email này nếu cần khiếu nại.`;

const REPLY_FOOTER_EN = (brand: string) =>
  `Automated message from ${brand} — you may reply to this email to request a review.`;

function layout(title: string, body: string, footerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  ${body}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">${footerHtml}</p>
</body></html>`;
}

/** Layout dùng chung — auth, biên tập, transactional. */
export function transactionalEmailLayout(
  title: string,
  body: string,
  options?: { allowReply?: boolean },
): string {
  const brand = getBrandName();
  const footer = options?.allowReply
    ? `${REPLY_FOOTER_VI(brand)}<br><span style="font-size:11px;color:#94a3b8;font-style:italic">${REPLY_FOOTER_EN(brand)}</span>`
    : DEFAULT_FOOTER_VI(brand);
  return layout(title, body, footer);
}

export function verifyEmailEmail(name: string, verifyUrl: string): OutboundEmail {
  const brand = getBrandName();
  const subject = `Xác nhận email tài khoản ${brand}`;
  const text = `Xin chào ${name},

Cảm ơn bạn đã đăng ký ${brand}. Vui lòng xác nhận email bằng link sau (hiệu lực 72 giờ):
${verifyUrl}

Sau khi xác nhận, bạn có thể dùng email này để nhận thông báo tin đăng, nhắc nhở và khôi phục mật khẩu.

— ${brand}`;

  const html = transactionalEmailLayout(
    subject,
    `<p>Xin chào <strong>${name}</strong>,</p>
<p>Cảm ơn bạn đã đăng ký <strong>${brand}</strong>. Nhấn nút bên dưới để xác nhận email (hiệu lực <strong>72 giờ</strong>):</p>
<p style="text-align:center;margin:28px 0">
  <a href="${verifyUrl}" style="${EMAIL_CTA_STYLE}">Xác nhận email</a>
</p>
<p style="font-size:13px;color:#64748b">Hoặc copy link: ${verifyUrl}</p>
<p>Email đã xác nhận sẽ được dùng để gửi <strong>nhắc tin đăng</strong>, <strong>thông báo</strong> và <strong>khôi phục mật khẩu</strong> khi cần.</p>`,
  );

  return { to: "", subject, html, text, tags: ["auth", "email_verify"] };
}

export function passwordResetEmail(name: string, resetUrl: string): OutboundEmail {
  const brand = getBrandName();
  const subject = `Đặt lại mật khẩu ${brand}`;
  const text = `Xin chào ${name},

Chúng tôi nhận được yêu cầu đặt lại mật khẩu ${brand}. Link (hiệu lực 1 giờ):
${resetUrl}

Nếu bạn không yêu cầu, hãy bỏ qua email này.

— ${brand}`;

  const html = transactionalEmailLayout(
    subject,
    `<p>Xin chào <strong>${name}</strong>,</p>
<p>Nhấn nút bên dưới để đặt lại mật khẩu (hiệu lực <strong>1 giờ</strong>):</p>
<p style="text-align:center;margin:28px 0">
  <a href="${resetUrl}" style="${EMAIL_CTA_STYLE}">Đặt lại mật khẩu</a>
</p>
<p style="font-size:13px;color:#64748b">Hoặc copy link: ${resetUrl}</p>
<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`,
  );

  return { to: "", subject, html, text, tags: ["auth", "password_reset"] };
}

export function buildVerifyUrl(token: string): string {
  return `${siteUrl()}/xac-nhan-email?token=${encodeURIComponent(token)}`;
}

export function buildResetUrl(token: string): string {
  return `${siteUrl()}/dat-lai-mat-khau?token=${encodeURIComponent(token)}`;
}
