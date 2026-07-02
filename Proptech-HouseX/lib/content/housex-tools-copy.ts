/** Copy trang /cong-cu — ngôn ngữ người mua nhà, không jargon Proptech. */

export const TOOLS_HUB_COPY = {
  metaTitle: "Công cụ mua nhà — HouseX",
  metaDescription:
    "Tính khoản vay mua nhà, chuẩn bị hồ sơ và kết nối dịch vụ tài chính, thẩm định trên HouseX — miễn phí.",
  kicker: "HouseX · Công cụ",
  title: "Công cụ mua nhà thông minh",
  subtitle:
    "Tính khoản vay, ước lượng chi phí và chuẩn bị quyết định — ngay trên trình duyệt, không cần đăng ký.",
  calculatorsHeading: "Máy tính & tra cứu",
  calculatorsIntro: "Bắt đầu bằng công cụ phù hợp nhu cầu của bạn.",
  servicesHeading: "Cần tư vấn chuyên sâu?",
  servicesIntro:
    "Đội ngũ HouseX đồng hành vay vốn, thẩm định giá và thiết kế không gian sống sau khi bạn đã có con số sơ bộ.",
} as const;

export const LOAN_CALC_COPY = {
  metaTitle: "Tính khoản vay mua nhà — Lịch trả nợ & PDF | HouseX",
  metaDescription:
    "Tính khoản vay mua bất động sản theo dư nợ giảm dần hoặc trả góp đều: số tiền trả hàng tháng, tổng lãi, lịch trả nợ chi tiết và xuất PDF miễn phí.",
  kicker: "Máy tính vay mua nhà",
  title: "Tính khoản vay mua nhà",
  subtitle:
    "Nhập giá nhà và tỷ lệ vay — xem tiền trả hàng tháng, tổng lãi và lịch trả nợ chi tiết. Xuất PDF để lưu hoặc gửi ngân hàng.",
  primaryCta: "Bắt đầu tính",
  primaryCtaHref: "#tinh-toan",
  secondaryCta: "Nhận tư vấn vay",
  secondaryCtaHref: "/tai-chinh#tu-van",
  faqHeading: "Câu hỏi thường gặp về vay mua nhà",
} as const;

export type ToolCardDef = {
  id: string;
  href: string;
  title: string;
  desc: string;
  cta: string;
  ready: boolean;
  badge?: string;
};

export const TOOL_HUB_CARDS: ToolCardDef[] = [
  {
    id: "loan",
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính khoản vay mua nhà",
    desc: "Dư nợ giảm dần hoặc trả góp đều — lịch trả nợ chi tiết, xuất PDF.",
    cta: "Tính ngay",
    ready: true,
    badge: "Phổ biến",
  },
  {
    id: "affordability",
    href: "/cong-cu/kha-nang-vay",
    title: "Khả năng vay tối đa",
    desc: "Ước tính hạn mức theo thu nhập và nghĩa vụ trả nợ an toàn.",
    cta: "Sắp ra mắt",
    ready: false,
  },
  {
    id: "noxh-check",
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    desc: "Checklist thu nhập, cư trú và đối tượng theo Luật Nhà ở.",
    cta: "Sắp ra mắt",
    ready: false,
  },
];
