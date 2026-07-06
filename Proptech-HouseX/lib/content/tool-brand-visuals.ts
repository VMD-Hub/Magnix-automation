/** Ảnh thương hiệu riêng cho từng công cụ & dịch vụ HouseX. */

export type ToolBrandVisualVariant =
  | "loan-calculator"
  | "loan-affordability"
  | "finance-hub"
  | "noxh-check"
  | "construction-cost-quick"
  | "construction-cost-detail"
  | "construction-materials"
  | "interior-hub"
  | "business-loan";

type ImagePaths = { jpg: string; webp: string };

export const TOOL_BRAND_IMAGES: Record<ToolBrandVisualVariant, ImagePaths> = {
  "loan-calculator": {
    jpg: "/images/tools/loan-calculator.png",
    webp: "/images/tools/loan-calculator.webp",
  },
  "loan-affordability": {
    jpg: "/images/tools/loan-affordability.png",
    webp: "/images/tools/loan-affordability.webp",
  },
  "finance-hub": {
    jpg: "/images/tools/finance-hub.png",
    webp: "/images/tools/finance-hub.webp",
  },
  "noxh-check": {
    jpg: "/images/tools/noxh-check.png",
    webp: "/images/tools/noxh-check.webp",
  },
  "construction-cost-quick": {
    jpg: "/images/tools/construction-cost-quick.png",
    webp: "/images/tools/construction-cost-quick.webp",
  },
  "construction-cost-detail": {
    jpg: "/images/tools/construction-cost-detail.png",
    webp: "/images/tools/construction-cost-detail.webp",
  },
  "construction-materials": {
    jpg: "/images/tools/construction-materials.png",
    webp: "/images/tools/construction-materials.webp",
  },
  "interior-hub": {
    jpg: "/images/tools/interior-hub.png",
    webp: "/images/tools/interior-hub.webp",
  },
  "business-loan": {
    jpg: "/images/tools/business-loan.png",
    webp: "/images/tools/business-loan.webp",
  },
};

/** Map tool id (registry) → ảnh thương hiệu. */
export const TOOL_ID_BRAND_VISUAL: Record<string, ToolBrandVisualVariant> = {
  loan: "loan-calculator",
  affordability: "loan-affordability",
  "noxh-check": "noxh-check",
  "uoc-tinh-chi-phi-xay-nha": "construction-cost-quick",
  "du-toan-xay-nha-chi-tiet": "construction-cost-detail",
  "du-tru-vat-lieu-xay-dung": "construction-materials",
};

export function toolBrandVisualForId(toolId: string): ToolBrandVisualVariant | null {
  return TOOL_ID_BRAND_VISUAL[toolId] ?? null;
}

export function toolBrandPaths(variant: ToolBrandVisualVariant): ImagePaths {
  return TOOL_BRAND_IMAGES[variant];
}

export function toolBrandImageJpg(toolId: string): string | null {
  const v = toolBrandVisualForId(toolId);
  return v ? TOOL_BRAND_IMAGES[v].jpg : null;
}

export function toolBrandImageWebp(toolId: string): string | null {
  const v = toolBrandVisualForId(toolId);
  return v ? TOOL_BRAND_IMAGES[v].webp : null;
}

export function toolBrandImageJpgByVariant(variant: ToolBrandVisualVariant): string {
  return TOOL_BRAND_IMAGES[variant].jpg;
}

export function toolBrandImageWebpByVariant(variant: ToolBrandVisualVariant): string {
  return TOOL_BRAND_IMAGES[variant].webp;
}
