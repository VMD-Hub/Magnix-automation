/**
 * House X Mark Iteration 6b — xanh đậm chủ đạo · gold O + X.
 */

export const HOUSEX_MARK_VIEWBOX = "0 0 48 48" as const;
export const CHROME_X_VIEWBOX = "0 0 48 48" as const;
export const RADAR_O_VIEWBOX = "0 0 24 24" as const;

export const HOUSEX_SILVER_GRADIENT = {
  x1: "0%",
  y1: "0%",
  x2: "100%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#ffffff" },
    { offset: "45%", color: "#f5f5f7" },
    { offset: "100%", color: "#e8e8ec" },
  ],
} as const;

/** X gold metallic — facet vàng House X. */
export const CHROME_X_GRADIENT = {
  x1: "12%",
  y1: "6%",
  x2: "88%",
  y2: "94%",
  stops: [
    { offset: "0%", color: "#fffef5" },
    { offset: "18%", color: "#ffe566" },
    { offset: "42%", color: "#daa520" },
    { offset: "68%", color: "#c9940a" },
    { offset: "88%", color: "#b8860b" },
    { offset: "100%", color: "#96700a" },
  ],
} as const;

export const CHROME_X_GRADIENT_ON_DARK = {
  x1: "10%",
  y1: "5%",
  x2: "90%",
  y2: "95%",
  stops: [
    { offset: "0%", color: "#fff9e6" },
    { offset: "30%", color: "#f0c14a" },
    { offset: "55%", color: "#daa520" },
    { offset: "100%", color: "#b8860b" },
  ],
} as const;

export const CHROME_X_HIGHLIGHT = {
  x1: "28%",
  y1: "0%",
  x2: "72%",
  y2: "100%",
  stops: [
    { offset: "0%", color: "#ffffff" },
    { offset: "100%", color: "#fff8dc" },
  ],
} as const;

export const CHROME_X_ARMS = [
  { x1: 11, y1: 11, x2: 37, y2: 37 },
  { x1: 37, y1: 11, x2: 11, y2: 37 },
] as const;

export const CHROME_X_TIPS = [
  [11, 11],
  [37, 37],
  [37, 11],
  [11, 37],
] as const;

export const CHROME_X_STROKE = 7.2;
export const CHROME_X_CAP_R = 4.1;

/** O rada — gold. */
export const RADAR_O_GRADIENT = {
  x1: "15%",
  y1: "8%",
  x2: "85%",
  y2: "92%",
  stops: [
    { offset: "0%", color: "#fff3c4" },
    { offset: "40%", color: "#daa520" },
    { offset: "100%", color: "#b8860b" },
  ],
} as const;

export const RADAR_O_CORE = { cx: 12, cy: 12, r: 2.7 } as const;

export const RADAR_O_ARCS_LEFT = [
  "M 9.2 8.4 Q 5.8 12 9.2 15.6",
  "M 7.4 6.2 Q 2.8 12 7.4 17.8",
  "M 5.6 4.2 Q 0 12 5.6 19.8",
] as const;

export const RADAR_O_ARCS_RIGHT = [
  "M 14.8 8.4 Q 18.2 12 14.8 15.6",
  "M 16.6 6.2 Q 21.2 12 16.6 17.8",
  "M 18.4 4.2 Q 24 12 18.4 19.8",
] as const;

export const RADAR_O_STROKE = 1.7;
export const RADAR_O_ARC_OPACITY = [0.5, 0.72, 0.95] as const;

export const HOUSEX_RADA_ICON = {
  xLeft: `M ${CHROME_X_ARMS[0].x1} ${CHROME_X_ARMS[0].y1} L ${CHROME_X_ARMS[0].x2} ${CHROME_X_ARMS[0].y2}`,
  xRight: `M ${CHROME_X_ARMS[1].x1} ${CHROME_X_ARMS[1].y1} L ${CHROME_X_ARMS[1].x2} ${CHROME_X_ARMS[1].y2}`,
  core: { cx: 24, cy: 24, r: 2.8 },
  quadrantArcs: [] as string[],
};

export const HOUSEX_HOUSE_PATH =
  "M14 24 L24 14 L34 24 V36 H14 V24 Z";

export const HOUSEX_COLORS = {
  /** Xanh đậm chủ đạo — chữ HOUSE, .vn */
  navy: "#0f2744",
  navyOnDark: "#c8d9eb",
  navyMuted: "#1e3a5f",
  gold: "#daa520",
  goldLight: "#ffe566",
  goldDark: "#96700a",
  silverBorder: "#dcdce0",
  xShadow: "#061525",
} as const;

export const HOUSEX_STROKE = {
  radar: RADAR_O_STROKE,
} as const;

export const HOUSEX_RADA_ARC_OPACITY = RADAR_O_ARC_OPACITY;
