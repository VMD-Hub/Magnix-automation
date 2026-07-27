import { faqBlocksToPlainText } from "@/lib/content/faq-content";
import { noxhEligibilityFaqForRegion } from "@/lib/content/noxh-eligibility-faq";
import type { ProjectLanding } from "@/lib/content/project-landing";

/**
 * Thông điệp CTA chuẩn mọi landing nhà ở xã hội (AIO + conversion).
 * Không dùng cụm mơ hồ kiểu “hỗ trợ tư vấn điều kiện / đồng hành…”.
 */
export const HOUSEX_NOXH_CTA_MESSAGE =
  "House X tư vấn hồ sơ mua nhà ở xã hội miễn phí và cập nhật tiến độ dự án. Đăng ký ngay!" as const;

export const HOUSEX_NOXH_CTA = {
  label: "Đăng ký tư vấn hồ sơ miễn phí",
  href: "/lien-he",
  subtext: HOUSEX_NOXH_CTA_MESSAGE,
} as const;

/** FAQ / soft-follow khi cần nêu cách liên hệ House X. */
export const HOUSEX_NOXH_CONSULT_FAQ_ANSWER =
  "House X tư vấn hồ sơ mua nhà ở xã hội miễn phí và cập nhật tiến độ dự án. [Đăng ký ngay](/lien-he)." as const;

export function housexNoxhCtaSubtext(phone?: string): string {
  if (phone?.trim()) {
    return `House X tư vấn hồ sơ mua nhà ở xã hội miễn phí và cập nhật tiến độ dự án. Hotline ${phone.trim()} — đăng ký ngay.`;
  }
  return HOUSEX_NOXH_CTA_MESSAGE;
}

/** Gói dịch vụ HouseX cho landing NOXH — mô hình hành trình trọn vòng đời (tham chiếu Citics Agent). */
export const HOUSEX_NOXH_SERVICES: NonNullable<ProjectLanding["services"]> = [
  {
    title: "Tư vấn hồ sơ mua nhà ở xã hội miễn phí",
    text: "Rà soát điều kiện đối tượng, thu nhập, nhà ở và checklist hồ sơ theo Luật Nhà ở — đăng ký ngay để được cập nhật đợt mở bán.",
    href: "/lien-he",
  },
  {
    title: "Tính khoản vay NHCSXH",
    text: "Mô phỏng dòng tiền vay gói 120.000 tỷ: vốn tự có, lãi suất ưu đãi, thời hạn trả — số liệu minh bạch để lên kế hoạch tài chính.",
    href: "/tinh-tra-gop",
  },
  {
    title: "Tra cứu pháp lý dự án",
    text: "Tổng hợp GPXD, quy hoạch 1/500, chấp thuận nhà ở xã hội ngay trên trang dự án — nền tảng dữ liệu giúp quyết định an tâm hơn.",
    href: "#project-legal-heading",
  },
  {
    title: "Định giá tham chiếu khu vực",
    text: "So sánh mức giá nhà ở xã hội với thị trường xung quanh — hỗ trợ đánh giá mức độ cạnh tranh trước khi đặt cọc.",
    href: "/cong-cu/dinh-gia",
  },
  {
    title: "Cập nhật tiến độ & đợt mở bán",
    text: "Nhận thông báo khi có bảng giá, lịch nộp hồ sơ và tiến độ dự án — đăng ký tư vấn miễn phí trên House X.",
    href: "/lien-he",
  },
];

/** FAQ dịch vụ HouseX — gắn cuối mọi landing NOXH. */
export function housexNoxhServiceFaqs(projectName: string) {
  return [
    {
      q: `House X hỗ trợ mua ${projectName} như thế nào?`,
      a: HOUSEX_NOXH_CONSULT_FAQ_ANSWER,
    },
    {
      q: "Vay mua nhà ở xã hội qua NHCSXH được bao nhiêu phần trăm?",
      a: "Theo chương trình tín dụng 120.000 tỷ, đối tượng nhà ở xã hội thường được vay tối đa 70% giá trị căn (tùy ngân hàng và hồ sơ). Dùng công cụ tính khoản vay trên House X để ước lượng trước.",
    },
  ];
}

/** FAQ điều kiện NOXH — dùng chung, có tên tỉnh/khu vực. */
export function noxhEligibilityFaq(regionLabel: string) {
  const item = noxhEligibilityFaqForRegion(regionLabel);
  return { q: item.q, a: faqBlocksToPlainText(item.blocks) };
}

/**
 * Gắn CTA chuẩn NOXH.
 * `attachServices: false` khi landing đã có services riêng (vd. DTA Happy Home).
 */
export function applyHousexNoxhCta(
  landing: ProjectLanding,
  opts?: { phone?: string; attachServices?: boolean },
): ProjectLanding {
  if (opts?.attachServices !== false) {
    landing.services = HOUSEX_NOXH_SERVICES;
  }
  landing.ctaLabel = HOUSEX_NOXH_CTA.label;
  landing.ctaHref = HOUSEX_NOXH_CTA.href;
  landing.ctaSubtext = housexNoxhCtaSubtext(opts?.phone);
  return landing;
}

/** Gắn gói dịch vụ + CTA chuẩn vào landing NOXH (factory tỉnh / seed). */
export function attachHousexNoxhServices(landing: ProjectLanding): ProjectLanding {
  return applyHousexNoxhCta(landing);
}
