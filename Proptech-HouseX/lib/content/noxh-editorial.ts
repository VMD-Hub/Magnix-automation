import { faqBlocksToPlainText } from "@/lib/content/faq-content";
import { noxhEligibilityFaqForRegion } from "@/lib/content/noxh-eligibility-faq";
import type { ProjectLanding } from "@/lib/content/project-landing";

/** Gói dịch vụ HouseX cho landing NOXH — mô hình hành trình trọn vòng đời (tham chiếu Citics Agent). */
export const HOUSEX_NOXH_SERVICES: NonNullable<ProjectLanding["services"]> = [
  {
    title: "Rà soát điều kiện mua NOXH",
    text: "Checklist thu nhập, nhà ở, hộ khẩu và đối tượng ưu tiên theo Luật Nhà ở — giúp bạn biết mình có đủ điều kiện trước khi nộp hồ sơ đợt mở bán.",
    href: "/lien-he",
  },
  {
    title: "Tính khoản vay NHCSXH",
    text: "Mô phỏng dòng tiền vay gói 120.000 tỷ: vốn tự có, lãi suất ưu đãi, thời hạn trả — số liệu minh bạch để lên kế hoạch tài chính.",
    href: "/cong-cu/tinh-khoan-vay",
  },
  {
    title: "Tra cứu pháp lý dự án",
    text: "Tổng hợp GPXD, quy hoạch 1/500, chấp thuận NOXH ngay trên trang dự án — nền tảng dữ liệu giúp quyết định an tâm hơn.",
    href: "#project-legal-heading",
  },
  {
    title: "Định giá tham chiếu khu vực",
    text: "So sánh mức giá NOXH với thị trường xung quanh — hỗ trợ đánh giá mức độ cạnh tranh trước khi đặt cọc.",
    href: "/cong-cu/dinh-gia",
  },
  {
    title: "Nhận tin đợt mở bán",
    text: "Đăng ký nhận thông báo khi CĐT/Sở Xây dựng công bố bảng giá và thời gian nộp hồ sơ — không bỏ lỡ suất NOXH.",
    href: "/lien-he",
  },
];

export const HOUSEX_NOXH_CTA = {
  label: "Đăng ký tư vấn NOXH",
  href: "/lien-he",
  subtext:
    "HouseX đồng hành từ rà soát điều kiện, tính vay NHCSXH đến theo dõi tiến độ — một điểm chạm, minh bạch dữ liệu.",
} as const;

/** FAQ dịch vụ HouseX — gắn cuối mọi landing NOXH. */
export function housexNoxhServiceFaqs(projectName: string) {
  return [
    {
      q: `HouseX hỗ trợ mua ${projectName} như thế nào?`,
      a: "HouseX cung cấp thông tin dự án có cấu trúc, công cụ tính vay NHCSXH, tra cứu pháp lý và kết nối tư vấn điều kiện NOXH — giúp bạn chuẩn bị hồ sơ trước từng đợt mở bán, không thay thế vai trò CĐT.",
    },
    {
      q: "Vay mua nhà ở xã hội qua NHCSXH được bao nhiêu phần trăm?",
      a: "Theo chương trình tín dụng 120.000 tỷ, đối tượng NOXH thường được vay tối đa 70% giá trị căn (tùy ngân hàng và hồ sơ). Dùng công cụ tính khoản vay trên HouseX để ước lượng trước.",
    },
  ];
}

/** FAQ điều kiện NOXH — dùng chung, có tên tỉnh/khu vực. */
export function noxhEligibilityFaq(regionLabel: string) {
  const item = noxhEligibilityFaqForRegion(regionLabel);
  return { q: item.q, a: faqBlocksToPlainText(item.blocks) };
}

/** Gắn gói dịch vụ + CTA chuẩn vào landing NOXH. */
export function attachHousexNoxhServices(landing: ProjectLanding): ProjectLanding {
  landing.services = HOUSEX_NOXH_SERVICES;
  landing.ctaLabel = HOUSEX_NOXH_CTA.label;
  landing.ctaHref = HOUSEX_NOXH_CTA.href;
  landing.ctaSubtext = HOUSEX_NOXH_CTA.subtext;
  return landing;
}
