const MASK64 = (1n << 64n) - 1n;
const FNV_OFFSET = 1469598103934665603n;
const FNV_PRIME = 1099511628211n;

/** FNV-1a 64-bit hash của một token → BigInt. */
function fnv1a64(token: string): bigint {
  let hash = FNV_OFFSET;
  for (let i = 0; i < token.length; i++) {
    hash ^= BigInt(token.charCodeAt(i));
    hash = (hash * FNV_PRIME) & MASK64;
  }
  return hash;
}

/**
 * SimHash 64-bit của danh sách token → chuỗi hex 16 ký tự.
 * Hai văn bản gần giống nhau cho SimHash có khoảng cách Hamming nhỏ.
 */
export function simhash(tokens: string[]): string {
  const v = new Array<number>(64).fill(0);
  for (const t of tokens) {
    const h = fnv1a64(t);
    for (let i = 0; i < 64; i++) {
      if ((h >> BigInt(i)) & 1n) v[i] += 1;
      else v[i] -= 1;
    }
  }
  let result = 0n;
  for (let i = 0; i < 64; i++) {
    if (v[i] > 0) result |= 1n << BigInt(i);
  }
  return result.toString(16).padStart(16, "0");
}

/** Khoảng cách Hamming giữa 2 SimHash hex (0–64). */
export function hammingDistance(aHex: string, bHex: string): number {
  let x = (BigInt("0x" + aHex) ^ BigInt("0x" + bHex)) & MASK64;
  let count = 0;
  while (x > 0n) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}
