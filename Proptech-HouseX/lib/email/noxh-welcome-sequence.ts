import { getBrandName, getSiteUrl, getSocialChannels } from "@/lib/site-config";
import { NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID } from "@/lib/leads/nurture-scripts";

export const NOXH_WELCOME_SEQUENCE_ID = NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID;

export type WelcomeStepIndex = 1 | 2 | 3;

export type WelcomeCtaUrlKey = "zalo_oa" | "tool_noxh" | "projects_noxh";

export type NoxhWelcomeStepDef = {
  stepIndex: WelcomeStepIndex;
  /** Production delay — n8n Wait; in-process runner gửi ngay khi gọi. */
  delayDays: number;
  ctaUrlKey: WelcomeCtaUrlKey;
  subject: string;
  preheader: string;
};

/**
 * ADR-017 Welcome MVP — copy L0 stub (value-first, 1 CTA).
 * Agent 8 + L2/L3 trước khi blast production volume lớn.
 */
export const NOXH_WELCOME_STEPS: NoxhWelcomeStepDef[] = [
  {
    stepIndex: 1,
    delayDays: 0,
    ctaUrlKey: "zalo_oa",
    subject: "Checklist điều kiện NOXH + lộ trình của bạn",
    preheader: "Tài liệu miễn phí — không gọi làm phiền chỉ vì bạn đăng ký.",
  },
  {
    stepIndex: 2,
    delayDays: 1,
    ctaUrlKey: "tool_noxh",
    subject: "3 lỗi hồ sơ NOXH khiến đơn bị bác (tránh sớm)",
    preheader: "Kiểm tra lại điều kiện trong 1 phút trên công cụ House X.",
  },
  {
    stepIndex: 3,
    delayDays: 3,
    ctaUrlKey: "projects_noxh",
    subject: "Dự án NOXH đang / sắp nhận hồ sơ (cập nhật SoR)",
    preheader: "Chỉ dự án có trên hệ thống — CTA tư vấn khi bạn sẵn sàng.",
  },
];

export function getNoxhWelcomeStep(
  stepIndex: number,
): NoxhWelcomeStepDef | null {
  return NOXH_WELCOME_STEPS.find((s) => s.stepIndex === stepIndex) ?? null;
}

export function resolveWelcomeCtaUrl(key: WelcomeCtaUrlKey): string {
  const base = getSiteUrl().replace(/\/$/, "");
  switch (key) {
    case "zalo_oa": {
      const zalo = getSocialChannels().find((c) => c.id === "zalo")?.href;
      return zalo?.trim() || `${base}/lien-he`;
    }
    case "tool_noxh":
      return `${base}/cong-cu/dieu-kien-noxh`;
    case "projects_noxh":
      return `${base}/du-an/nha-o-xa-hoi`;
    default:
      return `${base}/lien-he`;
  }
}

const CTA_STYLE =
  "display:inline-block;background:#DAA520;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;border:1px solid #96700a";

function marketingLayout(input: {
  title: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}): string {
  const brand = getBrandName();
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>${input.title}</title></head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333333;max-width:560px;margin:0 auto;padding:24px;background:#F5F5F7">
  <p style="font-size:20px;font-weight:bold;color:#9B111E">House <span style="color:#DAA520">X</span></p>
  ${input.bodyHtml}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
  <p style="font-size:12px;color:#64748b">
    Bạn nhận email này vì đã đồng ý nhận lộ trình / bản tin từ ${brand}.
    <a href="${input.unsubscribeUrl}" style="color:#64748b">Hủy đăng ký email marketing</a>.
  </p>
</body></html>`;
}

export type BuiltWelcomeEmail = {
  subject: string;
  html: string;
  text: string;
  ctaUrl: string;
  tags: string[];
};

/** Build E1–E3 body. L3 note: copy stub — refine via Agent 8 before high volume. */
export function buildNoxhWelcomeEmail(input: {
  stepIndex: WelcomeStepIndex;
  recipientName: string;
  unsubscribeUrl: string;
}): BuiltWelcomeEmail | null {
  const step = getNoxhWelcomeStep(input.stepIndex);
  if (!step) return null;

  const brand = getBrandName();
  const name = input.recipientName.trim() || "bạn";
  const ctaUrl = resolveWelcomeCtaUrl(step.ctaUrlKey);
  const unsub = input.unsubscribeUrl;

  const bodies: Record<
    WelcomeStepIndex,
    { html: string; text: string; ctaLabel: string }
  > = {
    1: {
      ctaLabel: "Nhận thông báo mở bán qua Zalo",
      html: `<p>Xin chào <strong>${name}</strong>,</p>
<p>Cảm ơn bạn đã dùng công cụ kiểm tra điều kiện NOXH trên <strong>${brand}</strong>.</p>
<p>Chúng tôi sẽ gửi <strong>checklist hồ sơ + lộ trình</strong> phù hợp trường hợp của bạn (value-first — không ép gọi điện).</p>
<p style="text-align:center;margin:28px 0">
  <a href="${ctaUrl}" style="${CTA_STYLE}">Nhận thông báo mở bán qua Zalo</a>
</p>
<p style="font-size:13px;color:#64748b">Một CTA duy nhất: theo dõi OA/Zalo để nhận tin mở bán khi có xác nhận trên hệ thống.</p>`,
      text: `Xin chào ${name},

Cảm ơn bạn đã dùng công cụ kiểm tra điều kiện NOXH trên ${brand}.
Chúng tôi gửi checklist / lộ trình phù hợp — không ép gọi điện chỉ vì bạn đăng ký.

CTA: Nhận thông báo mở bán qua Zalo
${ctaUrl}

Hủy đăng ký: ${unsub}
— ${brand}`,
    },
    2: {
      ctaLabel: "Kiểm tra lại điều kiện NOXH",
      html: `<p>Xin chào <strong>${name}</strong>,</p>
<p>Ba lỗi hồ sơ NOXH hay gặp khiến đơn bị bác:</p>
<ol>
  <li>Thiếu giấy tờ chứng minh đối tượng / thu nhập đúng mẫu.</li>
  <li>Kê khai diện tích nhà ở hiện hữu không khớp thực tế.</li>
  <li>Chưa tách rõ nhu cầu vay — DTI / nợ xấu chưa rà trước.</li>
</ol>
<p>Hãy mở lại công cụ để rà nhanh trong ~1 phút.</p>
<p style="text-align:center;margin:28px 0">
  <a href="${ctaUrl}" style="${CTA_STYLE}">Kiểm tra lại điều kiện NOXH</a>
</p>`,
      text: `Xin chào ${name},

3 lỗi hồ sơ NOXH hay bị bác:
1) Thiếu giấy tờ đối tượng/thu nhập đúng mẫu
2) Kê khai diện tích nhà ở không khớp
3) Chưa rà DTI / nợ xấu trước khi nộp

CTA: Kiểm tra lại điều kiện
${ctaUrl}

Hủy đăng ký: ${unsub}
— ${brand}`,
    },
    3: {
      ctaLabel: "Xem dự án NOXH trên House X",
      html: `<p>Xin chào <strong>${name}</strong>,</p>
<p>Dưới đây là hướng dẫn xem các dự án NOXH <strong>đang / sắp nhận hồ sơ</strong> đã có trên hệ thống ${brand} (SoR — không tin đồn).</p>
<p style="text-align:center;margin:28px 0">
  <a href="${ctaUrl}" style="${CTA_STYLE}">Xem dự án NOXH trên House X</a>
</p>
<p style="font-size:13px;color:#64748b">Khi sẵn sàng, bạn có thể yêu cầu tư vấn 1:1 từ trang dự án hoặc Zalo — không bị gọi chỉ vì mở email.</p>`,
      text: `Xin chào ${name},

Xem dự án NOXH đang / sắp nhận hồ sơ trên ${brand} (dữ liệu hệ thống):
${ctaUrl}

Khi sẵn sàng, yêu cầu tư vấn 1:1 — không gọi chỉ vì mở email.

Hủy đăng ký: ${unsub}
— ${brand}`,
    },
  };

  const body = bodies[input.stepIndex];
  return {
    subject: step.subject,
    html: marketingLayout({
      title: step.subject,
      bodyHtml: body.html,
      unsubscribeUrl: unsub,
    }),
    text: body.text,
    ctaUrl,
    tags: ["marketing", "noxh_welcome", `e${input.stepIndex}`],
  };
}
