/**
 * Công nghệ kiểm tra thông tin — tên nội bộ: Rada House X.
 * Trên site công khai chỉ dùng TRUST_TECH_* (không lộ tên Rada).
 */

export const TRUST_TECH_HEADING = "Công nghệ kiểm tra thông tin House X" as const;

export const TRUST_TECH_TAGLINE =
  "Thông tin sát thực tế, trước khi bạn khám phá" as const;

export const TRUST_TECH_SHORT =
  "Công nghệ House X đối chiếu địa chỉ, giá và hình ảnh — giúp tin trên sàn sát thực tế hơn." as const;

export const TRUST_TECH_ABOUT_LEAD =
  "Lớp công nghệ hỗ trợ đối chiếu thông minh trên House X — giúp tin đăng khớp vị trí, giá và hình ảnh trước khi bạn thấy trên sàn." as const;

export const TRUST_TECH_ABOUT_BULLETS = [
  "Đối chiếu vị trí, giá niêm yết và nội dung mô tả theo tiêu chuẩn hiển thị.",
  "Gom tin trùng — ưu tiên tin đại diện, giảm nhiễu khi bạn so sánh.",
  "Lắng nghe phản hồi từ cộng đồng để cập nhật thông tin kịp thời.",
] as const;

/** @deprecated Dùng TRUST_TECH_* — giữ alias tránh vỡ import cũ. */
export const RADA_PROGRAM_NAME = TRUST_TECH_HEADING;
/** @deprecated */
export const RADA_TAGLINE = TRUST_TECH_TAGLINE;
/** @deprecated */
export const RADA_SHORT = TRUST_TECH_SHORT;
/** @deprecated */
export const RADA_ABOUT_LEAD = TRUST_TECH_ABOUT_LEAD;
/** @deprecated */
export const RADA_ABOUT_BULLETS = TRUST_TECH_ABOUT_BULLETS;
