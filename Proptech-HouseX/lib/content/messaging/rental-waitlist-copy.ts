/**
 * ADR-018 Wave 2 — copy waitlist quan tâm quản lý vận hành sau.
 * Reader-facing: tiếng Việt rõ, không viết tắt nội bộ (QL / digest / NEED_PM).
 * Không bán dịch vụ quản lý căn; không cold-call.
 */

import { WAITLIST_NO_COLD_CALL } from "@/lib/content/messaging/interest-waitlist-copy";

export const RENTAL_NEED_PM_NO_PROMISE =
  "House X / Minh An chưa mở dịch vụ quản lý vận hành căn — form này chỉ để ghi nhận nhu cầu quan tâm.";

export const rentalNeedPmWaitlistCopy = {
  title: "Đăng ký nhận cập nhật khi có dịch vụ quản lý",
  intro: `${RENTAL_NEED_PM_NO_PROMISE} ${WAITLIST_NO_COLD_CALL} Chúng tôi chỉ liên hệ khi có cập nhật phù hợp và bạn đồng ý kênh liên hệ.`,
  placeholderMessage:
    "Số căn, khu vực, đang tự quản hay nhờ người khác… (không bắt buộc)",
  consentLabel:
    "Tôi đồng ý nhận cập nhật khi House X / Minh An mở dịch vụ quản lý vận hành phù hợp. Không gọi điện chỉ vì đăng ký. Đây không phải đăng ký mua dịch vụ quản lý ngay.",
  submitLabel: "Đăng ký nhận cập nhật",
  successTitle: "Đã ghi nhận nhu cầu quan tâm",
  successBody: `${RENTAL_NEED_PM_NO_PROMISE} ${WAITLIST_NO_COLD_CALL} Bạn có thể dùng công cụ dòng tiền hoặc bài thuế trên hub cho thuê nếu cần ước tính ngay.`,
  successToolCta: "Tính dòng tiền cho thuê",
  successToolHref: "/cong-cu/dong-tien-cho-thue",
  successHubCta: "Về hub cho thuê",
  successHubHref: "/cho-thue",
  compactTrigger: "Quan tâm quản lý vận hành sau",
} as const;

export const rentalTaxHelpFormCopy = {
  intro:
    "Minh An Land tiếp nhận nhu cầu về thuế và hợp đồng thuê. Nếu bạn đồng ý, chúng tôi có thể giới thiệu đối tác kế toán hoặc pháp lý — không thay thế tư vấn của kế toán viên / luật sư.",
  partnerConsentLabel:
    "Tôi đồng ý Minh An Land chuyển thông tin liên hệ cho đối tác kế toán hoặc pháp lý để hỗ trợ thuế hoặc hợp đồng thuê (có thể rút bất cứ lúc nào — xem chính sách bảo mật).",
} as const;
