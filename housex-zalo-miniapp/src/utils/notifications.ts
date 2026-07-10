/** Nhãn loại thông báo Agent — Mini App /agent/thong-bao */
export function brokerNotificationCategory(type: string): string {
  if (type.startsWith("attribution.")) return "Xung đột";
  if (type.startsWith("noxh_case.") || type.startsWith("case.")) return "Hồ sơ";
  if (type.startsWith("commission.")) return "Hoa hồng";
  return "Hệ thống";
}

/** Ẩn ref conflict id ở cuối body (dùng dedupe server). */
export function stripNotificationRef(body: string): string {
  return body.replace(/\s\[[0-9a-f]{8}\]$/i, "");
}
