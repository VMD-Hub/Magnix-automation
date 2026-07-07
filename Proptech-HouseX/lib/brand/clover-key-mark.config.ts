/**
 * Chìa khóa cỏ bốn lá — geometry cho House X mark (thay chữ X).
 * Tham chiếu: đài sen clover + thân lưới + chân răng cưa.
 */

export const CLOVER_KEY_VIEWBOX = "0 0 40 56" as const;

/** Tâm đài clover (bow). */
export const CLOVER_KEY_BOW_CENTER = { x: 20, y: 13 } as const;

export const CLOVER_KEY_LEAF_ROTATIONS = [0, 90, 180, 270] as const;

/** Lá tim — scale nhỏ hơn CloverMark standalone. */
export const CLOVER_KEY_HEART_LEAF =
  "M0 0 C-1.1-0.8-2.4-2.6-3.5-4.5 C-4.2-6.1-3.8-7.8-2.2-8.2 C-0.9-8.5 0-8.1 0-8.1 C0-8.1 0.9-8.5 2.2-8.2 C3.8-7.8 4.2-6.1 3.5-4.5 C2.4-2.6 1.1-0.8 0 0";

/** Gân lá — filigree tối giản. */
export const CLOVER_KEY_LEAF_VEIN = "M0-8.1 L0 0";

export const CLOVER_KEY_SHANK = {
  x: 16.5,
  y: 22,
  width: 7,
  height: 18,
  rx: 1.2,
} as const;

/** Lưới thân khóa — đường chéo. */
export const CLOVER_KEY_SHANK_HATCH: ReadonlyArray<{ x1: number; y1: number; x2: number; y2: number }> = [
  { x1: 17, y1: 23, x2: 23, y2: 29 },
  { x1: 17, y1: 27, x2: 23, y2: 33 },
  { x1: 17, y1: 31, x2: 23, y2: 37 },
  { x1: 19, y1: 23, x2: 23, y2: 27 },
  { x1: 17, y1: 35, x2: 21, y2: 39 },
];

/** Chân răng (bit). */
export const CLOVER_KEY_BIT_PATH =
  "M16.5 40 H23.5 V44 H21 V46 H23.5 V48 H19 V50 H23.5 V52 H16.5 V40 Z";

export const CLOVER_KEY_STROKE = {
  leaf: 1.05,
  vein: 0.45,
  shank: 1.1,
  hatch: 0.35,
  bit: 1.05,
} as const;

export const CLOVER_KEY_GOLD_BODY = {
  x1: "8%",
  y1: "0%",
  x2: "92%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#fffef5" },
    { offset: "14%", color: "#ffe566" },
    { offset: "40%", color: "#daa520" },
    { offset: "65%", color: "#c8941a" },
    { offset: "88%", color: "#96700a" },
    { offset: "100%", color: "#5c3d08" },
  ],
} as const;

export const CLOVER_KEY_GOLD_HIGHLIGHT = {
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#ffffff" },
    { offset: "40%", color: "#fff8dc" },
    { offset: "100%", color: "#ffe566" },
  ],
} as const;

export const CLOVER_KEY_SHADOW_COLOR = "#2a1a04";
