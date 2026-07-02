/**
 * HouseX Clover Mark — nguồn geometry duy nhất.
 * Luxury gold wire (Kim) — tubular 3D, không phẳng mỏng.
 * Favicon: `housex-mark.config` → `npm run brand:sync-favicon`.
 */

export const CLOVER_VIEWBOX = "0 0 48 48" as const;

export const CLOVER_CENTER = { x: 24, y: 22 } as const;

/** Nét dây vàng — dày hơn để đọc như sản phẩm kim loại. */
export const CLOVER_STROKE_WIDTH = 2.15;
export const CLOVER_SHADOW_STROKE = 2.65;
export const CLOVER_HIGHLIGHT_STROKE = 0.95;

export const CLOVER_LEAF_ROTATIONS = [0, 90, 180, 270] as const;

export const CLOVER_HEART_LEAF =
  "M0 0 C-1.5-1-3.2-3.5-4.8-6 C-5.8-8.2-5.2-10.5-3-11.2 C-1.2-11.6 0-11 0-11 C0-11 1.2-11.6 3-11.2 C5.2-10.5 5.8-8.2 4.8-6 C3.2-3.5 1.5-1 0 0";

export const CLOVER_STEM =
  "M0 0.5 C-0.8 0.8-1.8 1.2-2.2 2.2 C-2.6 3.2-1.8 3.8-1 3.4 C-0.4 3.1 0 2.6 0.2 3 M0.2 3 C0.6 5 1.5 7.2 2.8 9.5 C4 11.8 5.5 14 7.2 16";

/** Thân dây vàng — ánh sáng từ trên-trái (luxury product). */
export const CLOVER_GOLD_BODY = {
  x1: "8%",
  y1: "0%",
  x2: "92%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#fffef5" },
    { offset: "12%", color: "#ffe566" },
    { offset: "38%", color: "#daa520" },
    { offset: "62%", color: "#c8941a" },
    { offset: "85%", color: "#96700a" },
    { offset: "100%", color: "#5c3d08" },
  ],
} as const;

/** Highlight specular trên mép dây. */
export const CLOVER_GOLD_HIGHLIGHT = {
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#ffffff" },
    { offset: "35%", color: "#fff8dc" },
    { offset: "70%", color: "#ffe566" },
    { offset: "100%", color: "#daa520" },
  ],
} as const;

export const CLOVER_SHADOW_COLOR = "#2a1a04";

/** @deprecated alias — dùng CLOVER_GOLD_BODY */
export const CLOVER_GOLD_GRADIENT = CLOVER_GOLD_BODY;

export type CloverStrokeLayer = "shadow" | "body" | "highlight";

export type CloverPathLayer = {
  d: string;
  layer: CloverStrokeLayer;
  rotate?: number;
  /** Dịch nhẹ cho lớp bóng (3D). */
  offsetY?: number;
};

/** Thứ tự vẽ: shadow → body → highlight (mỗi path). */
export function cloverPathLayers(): CloverPathLayer[] {
  const out: CloverPathLayer[] = [];

  for (const deg of CLOVER_LEAF_ROTATIONS) {
    out.push({ d: CLOVER_HEART_LEAF, layer: "shadow", rotate: deg, offsetY: 0.45 });
    out.push({ d: CLOVER_HEART_LEAF, layer: "body", rotate: deg });
    out.push({ d: CLOVER_HEART_LEAF, layer: "highlight", rotate: deg });
  }

  out.push({ d: CLOVER_STEM, layer: "shadow", offsetY: 0.45 });
  out.push({ d: CLOVER_STEM, layer: "body" });
  out.push({ d: CLOVER_STEM, layer: "highlight" });

  return out;
}

export function cloverStrokeWidth(layer: CloverStrokeLayer): number {
  switch (layer) {
    case "shadow":
      return CLOVER_SHADOW_STROKE;
    case "body":
      return CLOVER_STROKE_WIDTH;
    case "highlight":
      return CLOVER_HIGHLIGHT_STROKE;
  }
}

export function cloverLayerOpacity(layer: CloverStrokeLayer): number {
  switch (layer) {
    case "shadow":
      return 0.42;
    case "body":
      return 1;
    case "highlight":
      return 0.78;
  }
}
