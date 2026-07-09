/** Nội dung thương hiệu & IA trang chủ Mini App — DNA House X. */

export type HomeBanner = {
  id: string;
  /** Gradient hoặc ảnh từ web House X */
  imageUrl?: string;
  gradient?: string;
  headline: string;
  subline: string;
};

export type HomeShortcut = {
  id: string;
  label: string;
  /** Emoji / ký tự ngắn trong vòng tròn */
  icon: string;
  /** Màu nền icon */
  tone: string;
  /** route nội bộ hoặc web path (mở webview) */
  to: string;
  kind: "route" | "webview" | "scroll";
  scrollTarget?: string;
};

export type HomeInsightLink = {
  id: string;
  title: string;
  desc: string;
  path: string;
};

export const HOME_TAGLINE =
  "Nền tảng bất động sản · Công nghệ minh bạch · Sản phẩm là trung tâm";

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: "noxh",
    gradient: "var(--hx-ruby-gradient)",
    imageUrl: "/images/hero/housex-hero-brand-ruby-skyline.webp",
    headline: "Nhà ở xã hội — rõ pháp lý, rõ lộ trình",
    subline: "Ruby Fire · minh bạch từ điều kiện đến vay",
  },
  {
    id: "tools",
    gradient:
      "linear-gradient(135deg, #5c0b12 0%, #7a0e18 45%, #3d070c 100%)",
    headline: "Công cụ thật — không chỉ form thu lead",
    subline: "Kiểm tra điều kiện & khả năng vay trước khi quyết định",
  },
  {
    id: "platform",
    gradient:
      "linear-gradient(135deg, #1a1214 0%, #5c0b12 40%, #9b111e 100%)",
    headline: "House X — Proptech cho người mua nhà",
    subline: "Dự án chọn lọc · Cẩm nang · Tin tức & pháp lý",
  },
];

/** Tone = brand ruby/gold mix — đồng bộ web, không cyan. */
export const HOME_SHORTCUTS: HomeShortcut[] = [
  {
    id: "cam-nang",
    label: "Cẩm nang NOXH",
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
    id: "tham-dinh",
    label: "Thẩm định",
    icon: "📊",
    tone: "#5c0b12",
    to: "/cong-cu/tham-dinh-vay-noxh",
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
    id: "tin-tuc",
    label: "Tin tức",
    icon: "📰",
    tone: "#7a0e18",
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

export const HOME_INSIGHTS: HomeInsightLink[] = [
  {
    id: "promo",
    title: "Vòng quay may mắn NOXH",
    desc: "Khuyến mãi House X — quà tặng sau HĐMB NOXH",
    path: "/khuyen-mai",
  },
  {
    id: "news",
    title: "Tin tức & thị trường",
    desc: "Cập nhật NOXH, chính sách và xu hướng nhà ở",
    path: "/tin-tuc",
  },
  {
    id: "handbook",
    title: "Cẩm nang nhà ở xã hội",
    desc: "Hướng dẫn từng bước — đối tượng, hồ sơ, vay",
    path: "/tin-tuc/cam-nang-noxh",
  },
  {
    id: "legal",
    title: "Điều khoản & pháp lý",
    desc: "Minh bạch quyền lợi khi dùng nền tảng House X",
    path: "/dieu-khoan",
  },
  {
    id: "privacy",
    title: "Chính sách bảo mật",
    desc: "Bảo vệ thông tin cá nhân & SĐT liên hệ",
    path: "/chinh-sach-bao-mat",
  },
];
