import type { ArticleDetail } from "@/lib/data/article-types";
import { DTA_HAPPY_HOME_IMAGES } from "@/lib/content/dta-happy-home-images";
import { PHU_THO_DMC_IMAGES } from "@/lib/content/phu-tho-dmc-images";

const HERO = {
  civic: "/images/hero/housex-hero-slide-01-civic-center.webp",
  metroHub: "/images/hero/housex-hero-slide-02-metro-hub.webp",
  thuThiemNight: "/images/hero/housex-thu-thiem-civic-center-night.webp",
  thuThiemDay: "/images/hero/housex-thu-thiem-civic-center-day.webp",
  skyline: "/images/hero/hcmc-skyline-river-day.webp",
  bitexcoMetro: "/images/hero/hcmc-bitexco-metro-day.webp",
  viaduct: "/images/hero/concept-b-metro-viaduct-day.png",
  urban: "/images/hero/urban-skyline-golden-hour.jpg",
} as const;

export type EditorialFigure = {
  url: string;
  alt: string;
  caption: string;
  source?: string;
};

export type EditorialCover = {
  url: string;
  alt: string;
  caption: string;
};

/** Ảnh đại diện + metadata báo chí theo slug. */
export const ARTICLE_EDITORIAL_COVERS: Record<string, EditorialCover> = {
  "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc": {
    url: PHU_THO_DMC_IMAGES.hero.url,
    alt: PHU_THO_DMC_IMAGES.hero.alt,
    caption:
      "Phối cảnh Nhà ở xã hội Lý Thường Kiệt (Phú Thọ DMC) — dự án NOXH được quan tâm nhất TP.HCM đầu 2026.",
  },
  "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026": {
    url: PHU_THO_DMC_IMAGES.gallery[0].url,
    alt: "Phối cảnh block NOXH Lý Thường Kiệt",
    caption: "Công trình NOXH tại 324 Lý Thường Kiệt, Quận 10 — bàn giao dự kiến 08/2026.",
  },
  "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026": {
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: DTA_HAPPY_HOME_IMAGES.hero.alt,
    caption:
      "DTA Happy Home Nhơn Trạch — lựa chọn NOXH vùng ven so với NOXH nội thành Lý Thường Kiệt.",
  },
  "lai-suat-vay-noxh-duoi-35-tuoi-nhnn-2026": {
    url: DTA_HAPPY_HOME_IMAGES.paymentPlans[1].url,
    alt: "Minh họa phương thức thanh toán vay NOXH DTA Happy Home",
    caption:
      "Gói vay ngân hàng liên kết — tham khảo chính sách CĐT, kết hợp khung ưu đãi NHNN.",
  },
  "quy-hoach-tong-the-tphcm-tam-nhin-100-nam-sieu-do-thi": {
    url: HERO.skyline,
    alt: "Toàn cảnh đường chân trời TP.HCM — minh họa siêu đô thị đa trung tâm",
    caption:
      "Đề cương quy hoạch 2025–2050 hướng tới siêu đô thị 20–22 triệu dân và GRDP ~1.200 tỷ USD.",
  },
  "tod-xuong-song-phat-trien-do-thi-viet-nam-2025-2045": {
    url: HERO.metroHub,
    alt: "Minh họa trung tâm giao thông công cộng và phát triển đô thị TOD",
    caption:
      "TOD (Transit-Oriented Development) — mô hình phát triển quanh ga metro, đường sắt.",
  },
  "tp-hcm-5-khu-tod-metro-so-2-ben-thanh-tham-luong": {
    url: HERO.bitexcoMetro,
    alt: "Minh họa metro và cao ốc trung tâm TP.HCM",
    caption:
      "TP.HCM duyệt ~940 ha quy hoạch TOD dọc tuyến metro số 2 Bến Thành – Tham Lương.",
  },
  "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026": {
    url: HERO.thuThiemNight,
    alt: "Khu vực Thủ Thiêm về đêm — điểm đầu tuyến đường sắt Thủ Thiêm – Long Thành",
    caption:
      "Tuyến đường sắt ~47,7 km, tổng mức đầu tư dự kiến ~175.000 tỷ đồng, khởi công Q3/2026.",
  },
  "nhon-trach-cu-tang-truong-ha-tang-tod-2026": {
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: "DTA City Nhơn Trạch — khu đô thị vệ tinh gần hành lang sân bay Long Thành",
    caption:
      "Nhơn Trạch bứt phá hạ tầng 25B, Vành đai 3 và ga đường sắt quy hoạch — vùng TOD tương lai.",
  },
  "tien-do-noxh-kdc-chang-song-phuoc-tan-2026": {
    url: "https://khome.asia/wp-content/uploads/2025/12/nxh2-1.webp",
    alt: "Phối cảnh NOXH KDC Chàng Sông Phước Tân",
    caption: "Dự án NOXH tại Phước Tân, Biên Hòa — giai đoạn hạ tầng và móng.",
  },
  "dieu-kien-mua-nha-o-xa-hoi-2026-tom-tat": {
    url: HERO.urban,
    alt: "Minh họa an cư và nhà ở đô thị",
    caption: "Tóm tắt điều kiện mua nhà ở xã hội theo Luật Nhà ở — cập nhật 2026.",
  },
};

/** Khối markdown ảnh minh hoạ trong thân bài (chuẩn báo chí). */
export function editorialFigure(f: EditorialFigure): string {
  const source = f.source ? ` — Nguồn: ${f.source}` : "";
  return `![${f.alt}](${f.url})\n\n*Ảnh: ${f.caption}${source}*`;
}

export const EDITORIAL_FIGURES = {
  ltkPhoiCanh: editorialFigure({
    url: PHU_THO_DMC_IMAGES.hero.url,
    alt: PHU_THO_DMC_IMAGES.hero.alt,
    caption: "Phối cảnh Phú Thọ DMC tại 324 Lý Thường Kiệt, Quận 10",
    source: "minh họa dự án",
  }),
  ltkMatBang: editorialFigure({
    url: PHU_THO_DMC_IMAGES.gallery[4].url,
    alt: "Mặt bằng tầng NOXH Lý Thường Kiệt",
    caption: "Layout căn Studio / 1PN / 2PN — diện tích 34,5–77 m²",
    source: "minh họa dự án",
  }),
  dtaPhoiCanh: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.hero.url,
    alt: DTA_HAPPY_HOME_IMAGES.hero.alt,
    caption: "Khu NOXH DTA Happy Home trong DTA City Nhơn Trạch",
    source: "CĐT Đệ Tam",
  }),
  dtaMatBang: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.floorPlans.master.url,
    alt: "Mặt bằng tổng thể DTA Happy Home",
    caption: "Quy mô 2.192 căn NOXH — giá CĐT 448–700 triệu/căn",
    source: "CĐT Đệ Tam",
  }),
  noxhEligibility: editorialFigure({
    url: HERO.urban,
    alt: "Minh họa an cư đô thị và nhà ở xã hội",
    caption:
      "Khung pháp lý NOXH: Luật Nhà ở 2023, NĐ 100/2024 và NĐ 136/2026 (mức trần thu nhập từ 07/04/2026).",
    source: "minh họa",
  }),
  dtaMap: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.locationMap.url,
    alt: DTA_HAPPY_HOME_IMAGES.locationMap.alt,
    caption: DTA_HAPPY_HOME_IMAGES.locationMap.caption,
  }),
  hcmSkyline: editorialFigure({
    url: HERO.skyline,
    alt: "Toàn cảnh TP.HCM — minh họa siêu đô thị",
    caption: "Quy hoạch tổng thể hướng tới siêu đô thị đa trung tâm",
    source: "HouseX",
  }),
  metroHub: editorialFigure({
    url: HERO.metroHub,
    alt: "Minh họa ga metro và trung tâm giao thông",
    caption: "TOD lấy ga làm trung tâm phát triển dân cư và dịch vụ",
    source: "HouseX",
  }),
  metroViaduct: editorialFigure({
    url: HERO.viaduct,
    alt: "Minh họa đường sắt đô thị trên cao",
    caption: "Hạ tầng đường sắt liên vùng mở không gian đô thị vệ tinh",
    source: "HouseX",
  }),
  thuThiem: editorialFigure({
    url: HERO.thuThiemDay,
    alt: "Khu Thủ Thiêm — điểm đầu tuyến đường sắt Thủ Thiêm – Long Thành",
    caption: "Ga Thủ Thiêm kết nối metro số 2 và tuyến tới sân bay Long Thành",
    source: "HouseX",
  }),
  bitexcoMetro: editorialFigure({
    url: HERO.bitexcoMetro,
    alt: "Minh họa metro trung tâm TP.HCM",
    caption: "5 khu TOD dọc metro số 2 — tổng diện tích gần 940 ha",
    source: "HouseX",
  }),
  nhonTrachInfra: editorialFigure({
    url: DTA_HAPPY_HOME_IMAGES.progress[0].url,
    alt: "Tiến độ Khu đô thị DTA City Nhơn Trạch",
    caption: "Hạ tầng KCN – đô thị vệ tinh sân bay Long Thành đang hoàn thiện",
    source: "CĐT Đệ Tam",
  }),
} as const;

export function applyEditorialMedia(article: ArticleDetail): ArticleDetail {
  const cover = ARTICLE_EDITORIAL_COVERS[article.slug];
  if (!cover) return article;
  return {
    ...article,
    coverImageUrl: cover.url,
    coverImageAlt: cover.alt,
    coverImageCaption: cover.caption,
  };
}

export function absoluteArticleImageUrl(
  url: string,
  siteUrl: string,
): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${siteUrl.replace(/\/$/, "")}${url}`;
  return url;
}
