import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";
import {
  TOOL_BRAND_IMAGES,
  toolBrandImageJpg,
} from "@/lib/content/tool-brand-visuals";
import { HUB_VERTICAL_CARDS, VERTICAL_VISUALS } from "@/lib/content/housex-services-visuals";

const financeHub = TOOL_BRAND_IMAGES["finance-hub"];
const loanCalc = TOOL_BRAND_IMAGES["loan-calculator"];
const loanAffordability = TOOL_BRAND_IMAGES["loan-affordability"];
const noxhCheck = TOOL_BRAND_IMAGES["noxh-check"];
const costQuick = TOOL_BRAND_IMAGES["construction-cost-quick"];
const costDetail = TOOL_BRAND_IMAGES["construction-cost-detail"];
const materials = TOOL_BRAND_IMAGES["construction-materials"];
const interiorHub = TOOL_BRAND_IMAGES["interior-hub"];
const valuationHero = HUB_VERTICAL_CARDS["dinh-gia"].image;

/** Banner trang công cụ — rộng, thấp (cùng tỷ lệ catalog /du-an). */
export const TOOLS_HUB_BANNER = {
  jpg: HOUSEX_HERO_SLIDES[1]!.jpgMd,
  webp: HOUSEX_HERO_SLIDES[1]!.webpMd,
  objectPosition: HOUSEX_HERO_SLIDES[1]!.objectPosition,
  alt: "Kết nối đô thị — công cụ mua nhà HouseX",
};

export const LOAN_CALC_BANNER = {
  jpg: loanCalc.jpg,
  webp: loanCalc.webp,
  objectPosition: "50% 45%",
  alt: "Máy tính khoản vay mua nhà — lịch trả nợ HouseX",
};

export const LOAN_AFFORDABILITY_BANNER = {
  jpg: loanAffordability.jpg,
  webp: loanAffordability.webp,
  objectPosition: "50% 45%",
  alt: "Tính hạn mức vay mua nhà theo thu nhập — HouseX",
};

export const NOXH_CHECK_BANNER = {
  jpg: noxhCheck.jpg,
  webp: noxhCheck.webp,
  objectPosition: "50% 45%",
  alt: "Kiểm tra điều kiện mua nhà ở xã hội — HouseX",
};

export const CONSTRUCTION_COST_QUICK_BANNER = {
  jpg: costQuick.jpg,
  webp: costQuick.webp,
  objectPosition: "50% 45%",
  alt: "Ước tính chi phí xây nhà — HouseX",
};

export const CONSTRUCTION_COST_DETAIL_BANNER = {
  jpg: costDetail.jpg,
  webp: costDetail.webp,
  objectPosition: "50% 45%",
  alt: "Dự toán xây nhà chi tiết — HouseX",
};

export const CONSTRUCTION_MATERIALS_BANNER = {
  jpg: materials.jpg,
  webp: materials.webp,
  objectPosition: "50% 45%",
  alt: "Dự trù vật liệu xây dựng — HouseX",
};

export const BAT_TRACH_BANNER = {
  jpg: HOUSEX_HERO_SLIDES[1]!.jpgMd,
  webp: HOUSEX_HERO_SLIDES[1]!.webpMd,
  objectPosition: "50% 45%",
  alt: "Xem hướng nhà theo tuổi chuẩn Bát trạch — House X",
};

/** Ảnh minh hoạ thẻ công cụ — mỗi tool một ảnh thương hiệu. */
export const TOOL_CARD_IMAGES: Record<string, string> = {
  loan: loanCalc.jpg,
  affordability: loanAffordability.jpg,
  "noxh-check": noxhCheck.jpg,
  "uoc-tinh-chi-phi-xay-nha": costQuick.jpg,
  "du-toan-xay-nha-chi-tiet": costDetail.jpg,
  "du-tru-vat-lieu-xay-dung": materials.jpg,
  "xem-huong-nha": BAT_TRACH_BANNER.jpg,
  "kiem-tra-tuoi-xay-nha": HOUSEX_HERO_SLIDES[0]!.jpgMd,
  "phong-thuy-van-phong": HOUSEX_HERO_SLIDES[1]!.jpgMd,
  "chon-mau-son-theo-menh": HOUSEX_HERO_SLIDES[0]!.jpgMd,
};

export function toolCardImage(toolId: string): string {
  return toolBrandImageJpg(toolId) ?? TOOL_CARD_IMAGES[toolId] ?? loanCalc.jpg;
}

export { toolBrandImageWebp as toolCardImageWebp } from "@/lib/content/tool-brand-visuals";

export const TOOL_SERVICE_IMAGES: Record<string, string> = {
  "tai-chinh": financeHub.jpg,
  "dinh-gia": valuationHero,
  "noi-that": interiorHub.jpg,
};

export const TOOL_SERVICE_IMAGES_WEBP: Record<string, string | undefined> = {
  "tai-chinh": financeHub.webp,
  "dinh-gia": undefined,
  "noi-that": interiorHub.webp,
};

export const LOAN_CALC_TRUST_STATS = VERTICAL_VISUALS["tai-chinh"].stats;
