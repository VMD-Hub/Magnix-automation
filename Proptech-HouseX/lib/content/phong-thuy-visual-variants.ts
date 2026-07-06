/** Biến thể hình ảnh phong thủy — bát quái, la bàn, ngũ hành… */

export type PhongThuyVisualVariant =
  | "bagua-compass"
  | "luo-pan"
  | "build-age"
  | "ngu-hanh"
  | "office-desk";

export const PHONG_THUY_TOOL_VISUALS: Record<string, PhongThuyVisualVariant> = {
  "xem-huong-nha": "luo-pan",
  "kiem-tra-tuoi-xay-nha": "build-age",
  "phong-thuy-van-phong": "office-desk",
  "chon-mau-son-theo-menh": "ngu-hanh",
};

export const PHONG_THUY_TOOL_IDS = Object.keys(PHONG_THUY_TOOL_VISUALS);

export function phongThuyVisualForTool(toolId: string): PhongThuyVisualVariant | null {
  return PHONG_THUY_TOOL_VISUALS[toolId] ?? null;
}

export function isPhongThuyTool(toolId: string): boolean {
  return toolId in PHONG_THUY_TOOL_VISUALS;
}

/** Hero hub & trang Bát trạch mặc định. */
export const PHONG_THUY_HUB_HERO_VARIANT: PhongThuyVisualVariant = "luo-pan";
