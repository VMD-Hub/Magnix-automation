import { sendEmail } from "@/lib/email/send";
import { getSiteUrl } from "@/lib/site-config";

export async function sendPromotionWinEmail(input: {
  to: string;
  name: string;
  prizeLabel: string;
  redemptionCode: string;
  campaignName: string;
}) {
  const siteUrl = getSiteUrl();
  const subject = `Chúc mừng! Bạn trúng ${input.prizeLabel} — ${input.campaignName}`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h1 style="color:#b91c1c;font-size:22px">Chúc mừng ${input.name}!</h1>
      <p>Bạn đã trúng <strong>${input.prizeLabel}</strong> trong chương trình <strong>${input.campaignName}</strong>.</p>
      <p>Mã quà của bạn: <strong style="font-size:18px;letter-spacing:1px">${input.redemptionCode}</strong></p>
      <p style="color:#475569;font-size:14px">
        Phần quà có giá trị khi bạn ký hợp đồng mua bán nhà ở xã hội thành công qua HouseX.
        Quà vật lý sẽ được trao tận nơi sau khi hoàn tất giao dịch.
      </p>
      <p><a href="${siteUrl}/khuyen-mai" style="color:#b91c1c">Xem chi tiết tại trang Khuyến mãi</a></p>
      <p style="color:#94a3b8;font-size:12px">HouseX — Nền tảng nhà ở xã hội</p>
    </div>
  `.trim();

  const text = [
    `Chúc mừng ${input.name}!`,
    `Bạn trúng ${input.prizeLabel} — mã ${input.redemptionCode}.`,
    `Quà có giá trị sau khi ký HĐMB NOXH qua HouseX.`,
    `${siteUrl}/khuyen-mai`,
  ].join("\n");

  return sendEmail({
    to: input.to,
    subject,
    html,
    text,
    tags: ["promotion-win"],
  });
}
