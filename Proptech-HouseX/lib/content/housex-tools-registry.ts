/**
 * Registry công cụ House X — nguồn sự thật cho hub, sitemap, liên kết chéo.
 */

import type { ToolCardDef } from "@/lib/content/housex-tools-copy";

export type ToolCategoryId =
  | "tai-chinh"
  | "phong-thuy"
  | "xay-dung"
  | "noxh";

export type ToolCategory = {
  id: ToolCategoryId;
  title: string;
  intro: string;
  order: number;
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "tai-chinh",
    order: 1,
    title: "Vay mua nhà",
    intro: "Thẩm định vay, hạn mức, tính trả góp và lịch trả nợ chi tiết — mạnh hơn các trang BĐS thông thường.",
  },
  {
    id: "phong-thuy",
    order: 2,
    title: "Phong thủy & tuổi làm nhà",
    intro: "Tra cứu hướng nhà, tuổi động thổ, màu sơn và bàn làm việc — miễn phí, kết quả tức thì.",
  },
  {
    id: "xay-dung",
    order: 3,
    title: "Xây dựng & chi phí",
    intro: "Ước tính chi phí, dự toán chi tiết và dự trù vật liệu trước khi gặp nhà thầu.",
  },
  {
    id: "noxh",
    order: 4,
    title: "Nhà ở xã hội (NOXH)",
    intro: "Kiểm tra điều kiện và thẩm định vay NOXH theo quy định 2026.",
  },
];

export const ALL_TOOLS: (ToolCardDef & { category: ToolCategoryId })[] = [
  {
    id: "loan",
    category: "tai-chinh",
    href: "/tinh-tra-gop",
    title: "Tính khoản vay mua nhà",
    desc: "Dư nợ giảm dần hoặc trả góp đều — lịch trả nợ chi tiết, xuất PDF.",
    cta: "Tính ngay",
    ready: true,
    badge: "Phổ biến",
  },
  {
    id: "affordability",
    category: "tai-chinh",
    href: "/cong-cu/tinh-han-muc-vay",
    title: "Tính hạn mức vay mua nhà",
    desc: "Ước tính số tiền vay tối đa theo thu nhập, DTI — như ngân hàng thẩm định.",
    cta: "Tính ngay",
    ready: true,
  },
  {
    id: "xem-huong-nha",
    category: "phong-thuy",
    href: "/cong-cu/xem-huong-nha",
    title: "Xem hướng nhà theo tuổi",
    desc: "La bàn Bát trạch: cung mệnh, 4 hướng tốt/xấu cho cửa, giường, bếp.",
    cta: "Xem hướng",
    ready: true,
    badge: "Phong thủy",
  },
  {
    id: "kiem-tra-tuoi-xay-nha",
    category: "phong-thuy",
    href: "/cong-cu/kiem-tra-tuoi-xay-nha",
    title: "Kiểm tra tuổi xây/sửa nhà",
    desc: "Tam Tai, Kim Lâu, Hoang Ốc — biết năm nào nên động thổ, gợi ý năm hợp.",
    cta: "Kiểm tra tuổi",
    ready: true,
    badge: "Phong thủy",
  },
  {
    id: "phong-thuy-van-phong",
    category: "phong-thuy",
    href: "/cong-cu/phong-thuy-van-phong",
    title: "Phong thủy bàn làm việc",
    desc: "Hướng ngồi, cửa phòng và bố trí bàn theo Bát trạch — văn phòng & WFH.",
    cta: "Xem hướng bàn",
    ready: true,
  },
  {
    id: "chon-mau-son-theo-menh",
    category: "phong-thuy",
    href: "/cong-cu/chon-mau-son-theo-menh",
    title: "Chọn màu sơn theo mệnh",
    desc: "Màu nội thất & ngoại thất theo Ngũ hành — tương sinh, tránh khắc.",
    cta: "Xem màu hợp",
    ready: true,
  },
  {
    id: "uoc-tinh-chi-phi-xay-nha",
    category: "xay-dung",
    href: "/cong-cu/uoc-tinh-chi-phi-xay-nha",
    title: "Ước tính chi phí xây nhà",
    desc: "Khái toán nhanh: diện tích × đơn giá/m² theo khu vực và gói thi công.",
    cta: "Ước tính ngay",
    ready: true,
    badge: "Xây dựng",
  },
  {
    id: "du-toan-xay-nha-chi-tiet",
    category: "xay-dung",
    href: "/cong-cu/du-toan-xay-nha-chi-tiet",
    title: "Dự toán xây nhà chi tiết",
    desc: "Bóc tách móng, sàn, mái, ban công — đơn giá theo hạng mục.",
    cta: "Dự toán chi tiết",
    ready: true,
  },
  {
    id: "du-tru-vat-lieu-xay-dung",
    category: "xay-dung",
    href: "/cong-cu/du-tru-vat-lieu-xay-dung",
    title: "Dự trù vật liệu xây dựng",
    desc: "Xi măng, cát, đá, gạch, thép — theo diện tích sàn và số tầng.",
    cta: "Dự trù vật tư",
    ready: true,
  },
  {
    id: "noxh-loan-hub",
    category: "noxh",
    href: "/cong-cu/tham-dinh-vay-noxh",
    title: "Thẩm định vay NOXH",
    desc: "Bộ công cụ: tuổi vay 60 giây, hạn mức và khoản trả — trước khi cọc.",
    cta: "Mở bộ công cụ",
    ready: true,
    badge: "NOXH",
  },
  {
    id: "noxh-check",
    category: "noxh",
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    desc: "Đối tượng, nhà ở, thu nhập & khả năng vay — quy định 2026.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "NOXH",
  },
  {
    id: "noxh-loan-quick",
    category: "noxh",
    href: "/cong-cu/kiem-tra-vay-noxh",
    title: "Kiểm tra vay NOXH 60 giây",
    desc: "Xưng hô + năm sinh — ước tính tuổi vay sơ bộ.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "NOXH",
  },
];

export function toolsByCategory(categoryId: ToolCategoryId) {
  return ALL_TOOLS.filter((t) => t.category === categoryId);
}

export function relatedTools(currentId: string, category?: ToolCategoryId, limit = 4) {
  const same = ALL_TOOLS.filter(
    (t) => t.ready && t.id !== currentId && t.category === category,
  );
  const others = ALL_TOOLS.filter(
    (t) => t.ready && t.id !== currentId && t.category !== category,
  );
  return [...same, ...others].slice(0, limit);
}

export function toolSitemapPaths(): string[] {
  return ALL_TOOLS.filter((t) => t.ready).map((t) => t.href);
}
