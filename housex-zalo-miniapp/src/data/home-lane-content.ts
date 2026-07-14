import type { HomeBanner } from "@/data/home-content";
import { HOME_TAGLINE } from "@/data/home-content";
import {
  HOME_ARTICLES_CCTM,
  HOME_ARTICLES_NOXH,
  HOME_SERVICES,
  QUICK_ACTIONS,
  toolsForLane,
  type HomeArticleItem,
  type HomeNavItem,
  type HomeServiceItem,
  type HomeToolItem,
} from "@/data/home-ia";

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

export type LaneHomeCopy = {
  kicker: string;
  projectsTitle: string;
  projectsLead: string;
  showPromo: boolean;
  /** Dòng giá trị trên banner brand gộp */
  valueLine: string;
  supportLine: string;
  banners: HomeBanner[];
  quickActions: HomeNavItem[];
  services: HomeServiceItem[];
  tools: HomeToolItem[];
  articles: HomeArticleItem[];
};

export function laneHomeCopy(lane: "noxh" | "cctm"): LaneHomeCopy {
  if (lane === "noxh") {
    return {
      kicker: "PROPTECH · NOXH",
      projectsTitle: "Dự án NOXH nổi bật",
      projectsLead: "Pháp lý rõ · lộ trình vay · chọn dự án phù hợp điều kiện.",
      showPromo: true,
      valueLine: "Nhà ở xã hội — rõ pháp lý, rõ lộ trình",
      supportLine: "Điều kiện · vay · hồ sơ minh bạch",
      banners: NOXH_BANNERS,
      quickActions: QUICK_ACTIONS,
      services: HOME_SERVICES,
      tools: toolsForLane("noxh"),
      articles: HOME_ARTICLES_NOXH,
    };
  }
  return {
    kicker: "PROPTECH · THƯƠNG MẠI",
    projectsTitle: "Căn hộ thương mại",
    projectsLead: "Vị trí · thanh toán · tiến độ — chọn lọc bởi House X.",
    showPromo: false,
    valueLine: "Căn hộ thương mại — vị trí & lộ trình thanh toán",
    supportLine: "House X · chọn lọc dự án đô thị",
    banners: CCTM_BANNERS,
    quickActions: QUICK_ACTIONS.filter((a) => a.id !== "khuyen-mai"),
    services: HOME_SERVICES,
    tools: toolsForLane("cctm"),
    articles: HOME_ARTICLES_CCTM,
  };
}
