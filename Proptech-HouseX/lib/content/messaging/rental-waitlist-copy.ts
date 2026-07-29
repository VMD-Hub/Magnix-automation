/**
 * ADR-018 Wave 2 — copy waitlist NEED_PM (quan tâm QL sau).
 * Không bán Lớp 3; không cold-call; không hứa quản lý căn.
 */

import { WAITLIST_NO_COLD_CALL } from "@/lib/content/messaging/interest-waitlist-copy";

export const RENTAL_NEED_PM_NO_PROMISE =
  "Đây chỉ là danh sách quan tâm — House X / Minh An chưa mở dịch vụ quản lý vận hành căn.";

export const rentalNeedPmWaitlistCopy = {
  title: "Đăng ký quan tâm quản lý sau",
  intro: `${RENTAL_NEED_PM_NO_PROMISE} ${WAITLIST_NO_COLD_CALL} Chúng tôi chỉ liên hệ khi có cập nhật chính sách / gói phù hợp và bạn đồng ý kênh liên hệ.`,
  placeholderMessage:
    "Số căn, khu vực, đang tự quản hay nhờ người khác… (không bắt buộc)",
  consentLabel:
    "Tôi đồng ý nhận cập nhật khi House X / Minh An mở gói quản lý vận hành phù hợp. Không gọi điện chỉ vì đăng ký danh sách chờ. Không phải đăng ký mua dịch vụ quản lý ngay.",
  submitLabel: "Ghi danh sách chờ",
  successTitle: "Đã ghi vào danh sách chờ QL sau",
  successBody: `${RENTAL_NEED_PM_NO_PROMISE} ${WAITLIST_NO_COLD_CALL} Bạn có thể dùng công cụ dòng tiền / thuế trên hub cho thuê nếu cần ước tính ngay.`,
  successToolCta: "Tính dòng tiền cho thuê",
  successToolHref: "/cong-cu/dong-tien-cho-thue",
  successHubCta: "Về hub cho thuê",
  successHubHref: "/cho-thue",
  compactTrigger: "Quan tâm QL sau (danh sách chờ)",
} as const;

export const rentalTaxHelpFormCopy = {
  intro:
    "Minh An Land tiếp nhận nhu cầu thuế / HĐ thuê. Nếu bạn đồng ý, chúng tôi có thể giới thiệu đối tác kế toán hoặc pháp lý — không tư vấn thuế thay luật sư/KTV.",
  partnerConsentLabel:
    "Tôi đồng ý Minh An Land chuyển thông tin liên hệ cho đối tác kế toán / pháp lý để hỗ trợ thuế hoặc HĐ thuê (có thể rút bất cứ lúc nào — xem chính sách bảo mật).",
} as const;
