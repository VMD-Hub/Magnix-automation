import type { HomeBanner, HomeInsightLink, HomeShortcut } from "@/data/home-content";
import { HOME_TAGLINE } from "@/data/home-content";

export { HOME_TAGLINE };

export const NOXH_BANNERS: HomeBanner[] = [
  {
    id: "noxh-legal",
    gradient: "var(--hx-ruby-gradient)",
    imageUrl: "/images/hero/housex-hero-brand-ruby-skyline.webp",
    headline: "Nhà ở xã hội — rõ pháp lý, rõ lộ trình",
    subline: "Điều kiện · vay · hồ sơ minh bạch",
  },
  {
    id: "noxh-tools",
    gradient: "linear-gradient(135deg, #5c0b12 0%, #7a0e18 45%, #3d070c 100%)",
    headline: "Công cụ thật trước khi quyết định",
    subline: "Kiểm tra điều kiện & khả năng vay",
  },
  {
    id: "noxh-promo",
    gradient: "linear-gradient(135deg, #1a1214 0%, #5c0b12 40%, #9b111e 100%)",
    headline: "Vòng quay may mắn NOXH",
    subline: "Khuyến mãi House X sau HĐMB",
  },
];

export const CCTM_BANNERS: HomeBanner[] = [
  {
    id: "cctm-lifestyle",
    gradient: "linear-gradient(135deg, #1a1214 0%, #2a1a1c 35%, #5c0b12 100%)",
    imageUrl: "/images/hero/housex-thu-thiem-civic-center-night.webp",
    headline: "Căn hộ thương mại — vị trí & lộ trình thanh toán",
    subline: "House X · chọn lọc dự án đô thị",
  },
  {
    id: "cctm-solena",
    gradient: "linear-gradient(135deg, #3d070c 0%, #7a0e18 50%, #1a1214 100%)",
    headline: "Solena Green Town Bình Tân",
    subline: "Phân khu Block B2 · KDC Vĩnh Lộc",
  },
];

export const NOXH_SHORTCUTS: HomeShortcut[] = [
  {
    id: "cam-nang",
    label: "Cẩm nang",
    icon: "📘",
    tone: "#9b111e",
    to: "/tin-tuc/cam-nang-noxh",
    kind: "webview",
  },
  {
    id: "khuyen-mai",
    label: "Vòng quay",
    icon: "🎡",
    tone: "#daa520",
    to: "/khuyen-mai",
    kind: "webview",
  },
  {
    id: "dieu-kien",
    label: "Điều kiện",
    icon: "✓",
    tone: "#7a0e18",
    to: "/cong-cu/dieu-kien-noxh",
    kind: "webview",
  },
  {
    id: "vay-60s",
    label: "Vay 60 giây",
    icon: "⏱",
    tone: "#b81425",
    to: "/cong-cu/kiem-tra-vay-noxh",
    kind: "webview",
  },
  {
    id: "du-an",
    label: "Dự án",
    icon: "🏠",
    tone: "#daa520",
    to: "#projects",
    kind: "scroll",
    scrollTarget: "projects",
  },
  {
    id: "tu-van",
    label: "Tư vấn",
    icon: "💬",
    tone: "#9b111e",
    to: "/tu-van",
    kind: "route",
  },
  {
    id: "phap-ly",
    label: "Pháp lý",
    icon: "⚖",
    tone: "#e8c547",
    to: "/dieu-khoan",
    kind: "webview",
  },
];

export const CCTM_SHORTCUTS: HomeShortcut[] = [
  {
    id: "du-an",
    label: "Dự án",
    icon: "🏢",
    tone: "#daa520",
    to: "#projects",
    kind: "scroll",
    scrollTarget: "projects",
  },
  {
    id: "tu-van",
    label: "Tư vấn",
    icon: "💬",
    tone: "#9b111e",
    to: "/tu-van",
    kind: "route",
  },
  {
    id: "vay",
    label: "Tính vay",
    icon: "📊",
    tone: "#7a0e18",
    to: "/cong-cu/tinh-khoan-vay",
    kind: "webview",
  },
  {
    id: "tin-tuc",
    label: "Tin tức",
    icon: "📰",
    tone: "#b81425",
    to: "/tin-tuc",
    kind: "webview",
  },
  {
    id: "phap-ly",
    label: "Pháp lý",
    icon: "⚖",
    tone: "#e8c547",
    to: "/dieu-khoan",
    kind: "webview",
  },
];

export const NOXH_INSIGHTS: HomeInsightLink[] = [
  {
    id: "promo",
    title: "Vòng quay may mắn NOXH",
    desc: "Khuyến mãi House X — quà tặng sau HĐMB",
    path: "/khuyen-mai",
  },
  {
    id: "handbook",
    title: "Cẩm nang nhà ở xã hội",
    desc: "Đối tượng, hồ sơ, vay — từng bước",
    path: "/tin-tuc/cam-nang-noxh",
  },
  {
    id: "legal",
    title: "Điều khoản & pháp lý",
    desc: "Minh bạch quyền lợi khi dùng House X",
    path: "/dieu-khoan",
  },
];

export const CCTM_INSIGHTS: HomeInsightLink[] = [
  {
    id: "news",
    title: "Tin tức & thị trường",
    desc: "Xu hướng căn hộ & chính sách tín dụng",
    path: "/tin-tuc",
  },
  {
    id: "legal",
    title: "Điều khoản sử dụng",
    desc: "Quyền lợi và trách nhiệm trên nền tảng",
    path: "/dieu-khoan",
  },
];

export function laneHomeCopy(lane: "noxh" | "cctm") {
  if (lane === "noxh") {
    return {
      kicker: "PROPTECH · NOXH",
      projectsTitle: "Dự án NOXH nổi bật",
      projectsLead: "Pháp lý rõ · lộ trình vay · chọn dự án phù hợp điều kiện.",
      showPromo: true,
      banners: NOXH_BANNERS,
      shortcuts: NOXH_SHORTCUTS,
      insights: NOXH_INSIGHTS,
    };
  }
  return {
    kicker: "PROPTECH · THƯƠNG MẠI",
    projectsTitle: "Căn hộ thương mại",
    projectsLead: "Vị trí · thanh toán · tiến độ — chọn lọc bởi House X.",
    showPromo: false,
    banners: CCTM_BANNERS,
    shortcuts: CCTM_SHORTCUTS,
    insights: CCTM_INSIGHTS,
  };
}
