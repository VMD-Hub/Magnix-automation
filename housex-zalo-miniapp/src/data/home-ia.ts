/** IA trang chủ Mini App — Dịch vụ · Công cụ · Tin/chính sách (không lẫn promo/cẩm nang). */

export type HomeNavItem = {
  id: string;
  label: string;
  tone: string;
  to: string;
  kind: "route" | "webview" | "scroll";
  scrollTarget?: string;
};

export type HomeServiceItem = {
  id: string;
  /** Nhãn ngắn trên lưới icon */
  label: string;
  title: string;
  desc: string;
  path: string;
};

export type HomeToolItem = {
  id: string;
  title: string;
  path: string;
};

export type HomeArticleItem = {
  id: string;
  title: string;
  dek: string;
  path: string;
  imageUrl: string;
};

/** Thanh nhanh — hành động chính, không lẫn utility. */
export const QUICK_ACTIONS: HomeNavItem[] = [
  {
    id: "du-an",
    label: "Dự án",
    tone: "#9b111e",
    to: "#projects",
    kind: "scroll",
    scrollTarget: "projects",
  },
  {
    id: "tu-van",
    label: "Tư vấn",
    tone: "#b81425",
    to: "/tu-van",
    kind: "route",
  },
  {
    id: "cong-cu-hub",
    label: "Công cụ",
    tone: "#7a0e18",
    to: "/cong-cu",
    kind: "route",
  },
  {
    id: "khuyen-mai",
    label: "Ưu đãi",
    tone: "#b81425",
    to: "/khuyen-mai",
    kind: "webview",
  },
];

/**
 * Hệ sinh thái dịch vụ House X — tạo thu nhập + uy tín với khách.
 * Mở landing web nhúng trong khung Mini App (#/mo/...) — giữ tab bar, không nhảy openWebview.
 */
export const HOME_SERVICES: HomeServiceItem[] = [
  {
    id: "vay-mua-nha",
    label: "Vay mua nhà",
    title: "Vay mua nhà & căn hộ",
    desc: "Sơ loại hồ sơ, so sánh gói ngân hàng, đồng hành giải ngân.",
    path: "/tai-chinh/vay-mua-nha",
  },
  {
    id: "vay-the-chap",
    label: "Thế chấp",
    title: "Vay thế chấp & tái tài trợ",
    desc: "Bổ sung vốn hoặc chuyển khoản vay — hồ sơ TSĐB.",
    path: "/tai-chinh/vay-the-chap",
  },
  {
    id: "vay-sxkd",
    label: "Vay SXKD",
    title: "Vay sản xuất kinh doanh",
    desc: "Vốn lưu động / máy móc có thế chấp BĐS cho hộ KD & SME.",
    path: "/tai-chinh/vay-sxkd",
  },
  {
    id: "bao-hiem-tai-san",
    label: "Bảo hiểm",
    title: "Bảo hiểm nhà, kho & xe",
    desc: "Kèm điều kiện vay hoặc mua độc lập — phi nhân thọ.",
    path: "/tai-chinh/bao-hiem-tai-san",
  },
  {
    id: "tham-dinh-gia",
    label: "Định giá",
    title: "Thẩm định giá bất động sản",
    desc: "Chủ nhà, ngân hàng, thừa kế, visa — chứng thư chuẩn ngành.",
    path: "/dinh-gia",
  },
  {
    id: "noi-that",
    label: "Nội thất",
    title: "Thi công & nội thất",
    desc: "Thiết kế đến hoàn thiện — một đầu mối tư vấn.",
    path: "/noi-that",
  },
  {
    id: "ky-gui",
    label: "Ký gửi",
    title: "Ký gửi nhà đất",
    desc: "Đăng / ký gửi sản phẩm để tiếp cận người mua.",
    path: "/dang-ky/moi-gioi",
  },
  {
    id: "dich-vu-hub",
    label: "Tất cả",
    title: "Hub dịch vụ House X",
    desc: "Tài chính · định giá · nội thất trên một nền tảng.",
    path: "/dich-vu",
  },
];

/** Công cụ tự phục vụ — webview /cong-cu/* */
export const HOME_TOOLS_CORE: HomeToolItem[] = [
  {
    id: "tinh-vay",
    title: "Tính lãi suất / khoản vay",
    path: "/cong-cu/tinh-khoan-vay",
  },
  {
    id: "han-muc",
    title: "Hạn mức vay & DTI",
    path: "/cong-cu/tinh-han-muc-vay",
  },
  {
    id: "dieu-kien",
    title: "Điều kiện mua NOXH",
    path: "/cong-cu/dieu-kien-noxh",
  },
  {
    id: "tham-dinh-hs",
    title: "Thẩm định hồ sơ vay NOXH",
    path: "/cong-cu/tham-dinh-vay-noxh",
  },
  {
    id: "mau-son",
    title: "Chọn màu / mệnh nhà",
    path: "/cong-cu/chon-mau-son-theo-menh",
  },
  {
    id: "huong-nha",
    title: "Xem hướng nhà",
    path: "/cong-cu/xem-huong-nha",
  },
  {
    id: "ban-lv",
    title: "Hướng bàn làm việc",
    path: "/cong-cu/phong-thuy-van-phong",
  },
  {
    id: "tuoi-xay",
    title: "Tuổi xây / sửa nhà",
    path: "/cong-cu/kiem-tra-tuoi-xay-nha",
  },
];

export function toolsForLane(lane: "noxh" | "cctm"): HomeToolItem[] {
  if (lane === "cctm") {
    return [
      HOME_TOOLS_CORE[0],
      HOME_TOOLS_CORE[1],
      HOME_TOOLS_CORE[5],
      HOME_TOOLS_CORE[6],
      HOME_TOOLS_CORE[4],
      HOME_TOOLS_CORE[7],
      HOME_TOOLS_CORE[2],
      HOME_TOOLS_CORE[3],
    ];
  }
  return HOME_TOOLS_CORE;
}

/**
 * Tin / chính sách — nghị định, điều kiện, gói vay, quy trình.
 * Không đưa vòng quay / cẩm nang tiện ích / điều khoản website vào đây.
 */
export const HOME_ARTICLES_NOXH: HomeArticleItem[] = [
  {
    id: "dk-noxh-2026",
    title: "Điều kiện mua nhà ở xã hội 2026 — tóm tắt",
    dek: "Đối tượng, thu nhập, nhà ở — quy định đang áp dụng.",
    path: "/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    imageUrl: "/images/hero/housex-hero-brand-ruby-skyline.webp",
  },
  {
    id: "goi-120k",
    title: "Gói vay NOXH 120.000 tỷ — NHCSXH",
    dek: "Chính sách tín dụng ưu đãi cho người mua nhà ở xã hội.",
    path: "/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026",
    imageUrl: "/images/hero/housex-hero-brand-ruby-skyline.webp",
  },
  {
    id: "quy-trinh",
    title: "Mua NOXH khác gì thương mại — quy trình 7 bước",
    dek: "So sánh điều kiện, 7 bước đợt mở bán, checklist hồ sơ.",
    path: "/tin-tuc/quy-trinh-mua-thue-mua-noxh-2026",
    imageUrl: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  },
];

export const HOME_ARTICLES_CCTM: HomeArticleItem[] = [
  {
    id: "dk-77",
    title: "Điều kiện nhà ở khi mua NOXH — Điều 77",
    dek: "Ràng buộc pháp lý về hiện trạng nhà ở của hộ gia đình.",
    path: "/tin-tuc/dieu-kien-nha-o-mua-noxh-dieu-77-2026",
    imageUrl: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  },
  {
    id: "dk-noxh-2026",
    title: "Chính sách nhà ở xã hội 2026 — điểm cần biết",
    dek: "Cập nhật điều kiện và lộ trình vay ưu đãi.",
    path: "/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat",
    imageUrl: "/images/hero/housex-hero-brand-ruby-skyline.webp",
  },
  {
    id: "goi-120k",
    title: "Gói tín dụng nhà ở — góc nhìn người mua căn hộ",
    dek: "Chính sách vay ảnh hưởng khả năng chi trả căn hộ thương mại.",
    path: "/tin-tuc/vay-noxh-goi-120000-ty-nhcsxh-2026",
    imageUrl: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  },
];
