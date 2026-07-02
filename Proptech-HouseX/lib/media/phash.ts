/**
 * Perceptual hash (pHash) cho ảnh — phát hiện ảnh trùng/ăn cắp/stock giữa các
 * listing. Phần toán học thuần (DCT) tách riêng để test được không cần file ảnh;
 * việc giải mã ảnh → ma trận xám do worker (sharp) đảm nhiệm.
 */

const SIZE = 32; // ảnh đưa về 32x32 xám
const LOW = 8; // lấy 8x8 hệ số tần số thấp

// Hệ số DCT-II 1 chiều, precompute cho N=32.
function buildDctMatrix(n: number): number[][] {
  const m: number[][] = [];
  for (let u = 0; u < n; u++) {
    m[u] = [];
    const cu = u === 0 ? Math.SQRT1_2 : 1;
    for (let x = 0; x < n; x++) {
      m[u][x] = cu * Math.cos(((2 * x + 1) * u * Math.PI) / (2 * n));
    }
  }
  return m;
}

const DCT = buildDctMatrix(SIZE);

/**
 * Tính pHash 64-bit (hex 16 ký tự) từ ma trận xám phẳng độ dài 32*32 (0–255).
 */
export function dctPhash(gray: number[]): string {
  if (gray.length !== SIZE * SIZE) {
    throw new Error(`dctPhash cần ${SIZE * SIZE} pixel, nhận ${gray.length}`);
  }

  // DCT 2D = DCT theo hàng rồi theo cột.
  const rows: number[][] = [];
  for (let y = 0; y < SIZE; y++) {
    const row = new Array<number>(SIZE).fill(0);
    for (let u = 0; u < SIZE; u++) {
      let s = 0;
      for (let x = 0; x < SIZE; x++) s += gray[y * SIZE + x] * DCT[u][x];
      row[u] = s;
    }
    rows.push(row);
  }
  const coef: number[][] = [];
  for (let u = 0; u < LOW; u++) {
    coef[u] = new Array<number>(LOW).fill(0);
    for (let v = 0; v < LOW; v++) {
      let s = 0;
      for (let y = 0; y < SIZE; y++) s += rows[y][v] * DCT[u][y];
      coef[u][v] = s;
    }
  }

  // Median của 8x8 (bỏ hệ số DC [0][0]).
  const vals: number[] = [];
  for (let u = 0; u < LOW; u++)
    for (let v = 0; v < LOW; v++) if (!(u === 0 && v === 0)) vals.push(coef[u][v]);
  const sorted = [...vals].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  let bit = 0;
  let result = 0n;
  for (let u = 0; u < LOW; u++) {
    for (let v = 0; v < LOW; v++) {
      if (coef[u][v] > median) result |= 1n << BigInt(bit);
      bit++;
    }
  }
  return result.toString(16).padStart(16, "0");
}

/** Khoảng cách Hamming giữa 2 pHash hex (0–64). */
export function phashHamming(aHex: string, bHex: string): number {
  let x = BigInt("0x" + aHex) ^ BigInt("0x" + bHex);
  let count = 0;
  while (x > 0n) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}
