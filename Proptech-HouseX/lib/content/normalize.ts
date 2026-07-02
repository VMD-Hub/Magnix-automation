/** Chuẩn hoá text mô tả để fingerprint: bỏ URL, SĐT, dấu câu, gộp khoảng trắng. */
export function normalizeText(input: string): string {
  return (input ?? "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[\d][\d.\-\s]{7,}[\d]/g, " ") // chuỗi giống số điện thoại
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tách shingle (n-gram từ) để SimHash bắt được trùng lặp gần. */
export function shingles(text: string, n = 2): string[] {
  const words = text.split(" ").filter(Boolean);
  if (words.length < n) return words;
  const out: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    out.push(words.slice(i, i + n).join(" "));
  }
  return out;
}
