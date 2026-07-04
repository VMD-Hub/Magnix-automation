/**
 * Gửi email test qua provider đã cấu hình (Resend hoặc n8n webhook).
 *
 * Usage:
 *   EMAIL_TEST_TO=you@example.com npm run go-live:smoke-email
 *
 * Cần: RESEND_API_KEY hoặc EMAIL_WEBHOOK_URL (+ EMAIL_FROM nếu Resend)
 */
import { sendEmail } from "../lib/email/send";
import { transactionalEmailLayout } from "../lib/email/templates";
import { getBrandName } from "../lib/site-config";

async function main() {
  const to =
    process.env.EMAIL_TEST_TO?.trim() ||
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  if (!to) {
    console.error("Thiếu EMAIL_TEST_TO hoặc NEXT_PUBLIC_SUPPORT_EMAIL");
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY?.trim() && !process.env.EMAIL_WEBHOOK_URL?.trim()) {
    console.error("Chưa cấu hình RESEND_API_KEY hoặc EMAIL_WEBHOOK_URL");
    console.error("Email sẽ chỉ log [email:dev] — không phải production.");
  }

  const brand = getBrandName();
  const result = await sendEmail({
    to,
    subject: `[${brand}] Email production smoke test`,
    html: transactionalEmailLayout(
      "Email production OK",
      `<p>Nếu bạn nhận được email này, provider transactional email trên VPS đã hoạt động.</p><p style="font-size:13px;color:#64748b">${new Date().toISOString()}</p>`,
    ),
    text: `${brand} email smoke test — ${new Date().toISOString()}`,
    tags: ["smoke", "go-live"],
  });

  if (!result.ok) {
    console.error("✖ Gửi email thất bại:", result.error);
    process.exit(1);
  }

  console.log(`✔ Email smoke OK — provider: ${result.provider}`);
  console.log(`  To: ${to.replace(/(.{2}).*(@.*)/, "$1***$2")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
