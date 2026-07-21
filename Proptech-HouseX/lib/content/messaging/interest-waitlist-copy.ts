/**
 * ADR-016 P0 — copy cam kết kênh Interest / Waitlist.
 * Nguồn chân lý wording cho form, CTA, playbook (không spam gọi).
 */

export type LeadCaptureIntent = "consult" | "waitlist";

/** Câu cứng — mọi CTA / form waitlist phải truyền đạt ý này. */
export const WAITLIST_NO_COLD_CALL =
  "Không gọi điện chỉ vì bạn đăng ký nhận cập nhật.";

export const WAITLIST_CHANNEL_DEFAULT =
  "Cập nhật mặc định qua thông báo trên Mini App / tài khoản House X (và OA khi bạn đồng ý).";

export const WAITLIST_WHEN_WE_CALL =
  "Chỉ gọi điện khi bạn bấm «Tôi muốn được tư vấn», hoặc khi dự án mở bán và bạn đồng ý nhận cuộc gọi.";

export const WAITLIST_MINIAPP_VALUE =
  "Nên đăng ký tài khoản Mini App, để hồ sơ đầy đủ và làm bài lọc đối tượng — biết sớm mình có thuộc diện quan tâm không.";

export const interestWaitlistFormCopy = {
  title: "Đăng ký nhận thông tin dự án",
  titleWithName: (projectName: string) =>
    `Đăng ký nhận tin — ${projectName}`,
  intro: `${WAITLIST_CHANNEL_DEFAULT} ${WAITLIST_NO_COLD_CALL}`,
  placeholderMessage:
    "Ví dụ: quan tâm NOXH khu vực Long An, chưa chọn dự án cụ thể, muốn theo tiến độ mở bán…",
  consentLabel:
    "Cập nhật mặc định qua thông báo trên Mini App / tài khoản House X (và OA khi bạn đồng ý). Tôi đồng ý nhận cập nhật tiến độ / chính sách theo thông tin đã cung cấp. Không gọi điện chỉ vì bạn đăng ký nhận cập nhật.",
  submitLabel: "Đăng ký nhận cập nhật",
  successTitle: "Đã ghi nhận đăng ký nhận tin",
  successBody: `${WAITLIST_NO_COLD_CALL} ${WAITLIST_CHANNEL_DEFAULT} ${WAITLIST_MINIAPP_VALUE}`,
  successAccountCta: "Mở tài khoản / Mini App",
  successEligibilityCta: "Làm bài lọc đối tượng NOXH",
  successEligibilityHref: "/cong-cu/dieu-kien-noxh",
  successNotificationsHref: "/khach-hang/tai-khoan",
  compactTrigger: "Đăng ký nhận tin (không gọi làm phiền)",
} as const;

export const interestWaitlistCtaCopy = {
  bannerHeadline: (projectName: string) => `Quan tâm ${projectName}?`,
  bannerSubtext: `${WAITLIST_NO_COLD_CALL} Để lại liên hệ để nhận cập nhật tiến độ — ưu tiên thông báo trên Mini App.`,
  suggestedLabel: "Đăng ký nhận thông tin dự án",
} as const;

export const interestWaitlistOpsCopy = {
  playbookTitle: "Đăng ký nhận tin / Waitlist (ADR-016)",
  playbookSubtitle:
    "Khách sợ bị gọi telesales — cohort này không dùng SLA gọi nóng.",
  rules: [
    "Đăng ký nhận tin ≠ xin tư vấn gọi ngay. Không gọi chỉ vì có SĐT waitlist.",
    "Mặc định: cập nhật in-app / tài khoản (OA khi bật + consent).",
    "Chỉ gọi khi khách xin tư vấn, hoặc sau mở bán + khách đồng ý kênh gọi.",
    "Khuyến khích Mini App + hồ sơ + bài lọc đối tượng — không ép gọi.",
    `Nhắc khách (và ghi nhớ Ops): «${WAITLIST_NO_COLD_CALL}»`,
  ],
} as const;

/** Dự án chưa bán / tin sớm → form waitlist; đang bán → tư vấn. */
export function leadCaptureIntentForProjectStatus(
  status: string | null | undefined,
): LeadCaptureIntent {
  if (status === "SAP_MO_BAN") return "waitlist";
  return "consult";
}
