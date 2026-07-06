/** @deprecated — dùng tool-brand-visuals.ts */
export type { ToolBrandVisualVariant as FinanceVisualVariant } from "@/lib/content/tool-brand-visuals";
export {
  TOOL_ID_BRAND_VISUAL as FINANCE_TOOL_VISUALS,
  TOOL_BRAND_IMAGES as FINANCE_TOOL_IMAGE_PATHS,
  toolBrandVisualForId as financeVisualForTool,
  toolBrandImageJpgByVariant as financeImageForVariant,
  toolBrandImageWebpByVariant as financeWebpForVariant,
  toolBrandImageJpg as financeImageForTool,
} from "@/lib/content/tool-brand-visuals";

import type { ToolBrandVisualVariant } from "@/lib/content/tool-brand-visuals";

/** Hero trang /tai-chinh */
export const FINANCE_HUB_VISUAL: ToolBrandVisualVariant = "finance-hub";
