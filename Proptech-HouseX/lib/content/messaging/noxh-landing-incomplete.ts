/**
 * Copy công khai khi dự án NOXH chưa đủ dữ liệu / CĐT chưa công bố đủ.
 *
 * Quy ước biên tập (KHÔNG đưa lên trang người đọc):
 * - Nguồn nội bộ: “PDF”, “research”, “slug”, “catalog”, “danh mục nội bộ”, “ưu tiên tên”…
 * - Chỉ dùng nguồn để viết lại bằng tiếng Việt cho người mua nhà.
 * - Thiếu thông tin → “đang xác minh” + câu giữ chân bên dưới.
 * - Phân biệt dự án trùng tên: nói địa danh (Cam Ranh / Thủ Đức), không đưa slug URL.
 */

/** Nhãn tiện ích khi chưa có danh sách CĐT. */
export const NOXH_AMENITIES_VERIFYING =
  "Tiện ích nội khu — đang xác minh" as const;

/** Highlight loại hình khi chưa rõ. */
export const NOXH_TYPE_VERIFYING =
  "Đang xác minh theo công bố chủ đầu tư." as const;

/**
 * Câu giữ chân / soft follow — gắn cuối mô tả khi thiếu dữ liệu.
 * Không giải thích quy trình nội bộ cho người đọc.
 */
export const NOXH_UPDATING_SOON =
  "Chúng tôi đang theo dõi để cập nhật thông tin dự án đến quý vị sớm nhất." as const;

/** Câu giá/suất khi chưa có công bố — dùng trong mô tả ngắn. */
export const NOXH_PRICE_VERIFYING_SHORT =
  "Giá và suất đang được xác minh." as const;

/** FAQ giá khi chưa có công bố (+ soft CTA đăng ký nhận tin). */
export const NOXH_PRICE_FAQ_VERIFYING =
  "Giá và suất đang được xác minh theo công bố Sở Xây dựng hoặc chủ đầu tư. Đăng ký nhận thông tin trên trang dự án để House X cập nhật sớm cho bạn." as const;
