/**
 * Tọa độ đèn hero cinematic — % khung hình (object-cover, tâm).
 * Dùng chung cho SVG cột đèn + bake ảnh đêm.
 */

export type StreetLamp = {
  id: string;
  /** % từ trái */
  x: number;
  /** % từ trên — chân cột */
  y: number;
  /** Chiều cao cột (đơn vị viewBox 100) */
  poleH: number;
  scale: number;
};

export type WindowLight = {
  /** % từ trái */
  x: number;
  /** % từ trên */
  y: number;
  w: number;
  h: number;
  /** 0–1 */
  opacity: number;
  warm?: boolean;
};

/** Cột đèn dọc viaduct — khớp lan can trái + lối đi phải trong concept B */
export const STREET_LAMPS: readonly StreetLamp[] = [
  { id: "vL1", x: 16.5, y: 86, poleH: 10.5, scale: 1.12 },
  { id: "vL2", x: 20.5, y: 78, poleH: 9.5, scale: 1 },
  { id: "vL3", x: 24, y: 70, poleH: 8.5, scale: 0.86 },
  { id: "vL4", x: 27.5, y: 63, poleH: 7.5, scale: 0.74 },
  { id: "vL5", x: 30.5, y: 57, poleH: 6.5, scale: 0.62 },
  { id: "vR1", x: 73.5, y: 73, poleH: 9, scale: 0.92 },
  { id: "vR2", x: 85, y: 61, poleH: 8, scale: 0.78 },
  { id: "vR3", x: 92, y: 53, poleH: 7, scale: 0.66 },
  { id: "rd1", x: 39, y: 53, poleH: 5.5, scale: 0.46 },
  { id: "rd2", x: 47, y: 51, poleH: 5, scale: 0.42 },
  { id: "rd3", x: 55, y: 49.5, poleH: 4.8, scale: 0.4 },
  { id: "rd4", x: 63, y: 48, poleH: 4.5, scale: 0.38 },
] as const;

function windowGrid(
  originX: number,
  originY: number,
  cols: number,
  rows: number,
  cellW: number,
  cellH: number,
  gapX: number,
  gapY: number,
  litMask: number[][],
  warm = true,
): WindowLight[] {
  const out: WindowLight[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!litMask[row]?.[col]) continue;
      out.push({
        x: originX + col * (cellW + gapX),
        y: originY + row * (cellH + gapY),
        w: cellW,
        h: cellH,
        opacity: warm ? 0.5 + (row % 3) * 0.1 : 0.4,
        warm,
      });
    }
  }
  return out;
}

/** Cửa sổ sáng — lưới bám khối tòa (không rải lên bầu trời) */
export const BUILDING_WINDOW_LIGHTS: readonly WindowLight[] = [
  ...windowGrid(7.5, 30, 3, 7, 1.1, 1.8, 0.28, 0.35, [
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [0, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
  ]),
  ...windowGrid(20, 32, 4, 6, 0.95, 1.6, 0.25, 0.32, [
    [1, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 0, 1],
    [1, 1, 1, 0],
  ]),
  ...windowGrid(34, 30, 5, 6, 0.9, 1.55, 0.22, 0.3, [
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ]),
  ...windowGrid(48, 28, 4, 7, 0.85, 1.5, 0.24, 0.28, [
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 1],
  ], false),
  ...windowGrid(62, 26, 4, 8, 0.88, 1.52, 0.26, 0.3, [
    [1, 1, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
  ], false),
  ...windowGrid(76, 24, 3, 9, 0.82, 1.45, 0.24, 0.28, [
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 1],
  ], false),
  { x: 57, y: 42, w: 1.8, h: 2.8, opacity: 0.65, warm: false },
  { x: 59.5, y: 42, w: 1.8, h: 2.8, opacity: 0.6, warm: false },
];

/** Đèn tàu metro — 2 đèn pha khi ban đêm */
export const TRAIN_HEADLIGHTS = [
  { x: 58.5, y: 71, r: 0.9 },
  { x: 62.5, y: 71, r: 0.9 },
] as const;
