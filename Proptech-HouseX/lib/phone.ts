/**
 * Chuẩn hoá số điện thoại Việt Nam về dạng E.164 (+84...).
 * Dùng làm khoá định danh khách (`Customer.normalizedPhone @unique`) — gốc của
 * identity resolution & chống trùng khách (P0).
 */
export function normalizeVnPhone(raw: string): string {
  let s = (raw ?? "").trim().replace(/[^\d+]/g, "");

  if (s.startsWith("+")) {
    // giữ nguyên +, bỏ mọi dấu + thừa
    s = "+" + s.slice(1).replace(/\+/g, "");
  } else if (s.startsWith("84")) {
    s = "+" + s;
  } else if (s.startsWith("0")) {
    s = "+84" + s.slice(1);
  } else if (s.length > 0) {
    s = "+84" + s;
  }

  return s;
}

/** Kiểm tra thô độ dài hợp lệ của SĐT VN sau khi normalize (+84 + 9 chữ số). */
export function isValidVnPhone(normalized: string): boolean {
  return /^\+84\d{9}$/.test(normalized);
}
