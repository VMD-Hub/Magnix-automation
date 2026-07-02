import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import { NOXH_CATALOG_TITLE } from "@/lib/content/messaging/noxh-public";

export type ProjectCatalogBannerVariant = "all" | "THUONG_MAI" | "NHA_O_XA_HOI";

export type ProjectCatalogBannerConfig = {
  title: string;
  alt: string;
  jpg: string;
  webp: string;
  jpgMd: string;
  webpMd: string;
  objectPosition: string;
};

const [civic, metro] = HOUSEX_HERO_SLIDES;

/** Banner danh mục /du-an — rộng, thấp hơn hero trang chi tiết dự án. */
export const PROJECT_CATALOG_BANNERS: Record<
  ProjectCatalogBannerVariant,
  ProjectCatalogBannerConfig
> = {
  all: {
    title: "Dự án bất động sản",
    alt: "Toàn cảnh đô thị — danh mục dự án HouseX",
    jpg: metro.jpg,
    webp: metro.webp,
    jpgMd: metro.jpgMd,
    webpMd: metro.webpMd,
    objectPosition: metro.objectPosition,
  },
  THUONG_MAI: {
    title: "Dự án thương mại",
    alt: "Phối cảnh đô thị thương mại — danh mục dự án HouseX",
    jpg: civic.jpg,
    webp: civic.webp,
    jpgMd: civic.jpgMd,
    webpMd: civic.webpMd,
    objectPosition: civic.objectPosition,
  },
  NHA_O_XA_HOI: {
    title: NOXH_CATALOG_TITLE,
    alt: "Khu căn hộ nhà ở xã hội — danh mục dự án miền Nam trên HouseX",
    jpg: civic.jpg,
    webp: civic.webp,
    jpgMd: civic.jpgMd,
    webpMd: civic.webpMd,
    objectPosition: "50% 55%",
  },
};

export function projectCatalogBannerVariant(
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI",
): ProjectCatalogBannerVariant {
  if (projectType === "THUONG_MAI") return "THUONG_MAI";
  if (projectType === "NHA_O_XA_HOI") return "NHA_O_XA_HOI";
  return "all";
}
