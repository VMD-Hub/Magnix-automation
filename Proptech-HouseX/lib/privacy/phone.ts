/**
 * Che số điện thoại — BẮT BUỘC dùng phía server trước khi render/JSON hoá.
 * Số đầy đủ chỉ được trả về cho người dùng đã đăng nhập qua API reveal.
 *
 * Ví dụ: "0901234567" → "0901 234 ***"
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 6) return "***";
  const visible = digits.slice(0, Math.min(7, digits.length - 3));
  const head = visible.slice(0, 4);
  const mid = visible.slice(4);
  return [head, mid, "***"].filter(Boolean).join(" ");
}

/** Chuẩn hoá số để tạo link tel: (giữ + và chữ số). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
