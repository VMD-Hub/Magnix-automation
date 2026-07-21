/**
 * Copy công khai hub Phong thủy — SEO + liên kết nội bộ.
 */

import { articlePath, PHONG_THUY_HUB_PATH } from "@/lib/content/article-routes";

export const PHONG_THUY_HUB_KICKER = "Kiến thức & công cụ miễn phí" as const;

export const PHONG_THUY_HUB_TITLE =
  "Phong thủy nhà ở — hướng nhà, tuổi xây, màu sơn" as const;

export const PHONG_THUY_HUB_SUBTITLE =
  "Tra cứu Bát trạch, Kim Lâu, Hoang Ốc, Tam Tai và màu sơn theo mệnh — kết quả tức thì trên trình duyệt, không cần đăng ký. Kết hợp bài biên tập Q&A để chọn nhà và bố trí không gian hợp lý." as const;

export const PHONG_THUY_HUB_INTRO =
  "House X tổng hợp phong thủy nhà ở theo hướng thực dụng: công cụ tính toán minh bạch (Bát trạch, tuổi động thổ, Ngũ hành) và bài viết giải thích từng khái niệm — giúp bạn tham khảo trước khi chọn hướng cửa, năm xây hoặc màu nội thất." as const;

export const PHONG_THUY_HUB_SEO_TITLE =
  "Phong thủy nhà ở — hướng nhà, tuổi xây, màu sơn" as const;

export const PHONG_THUY_HUB_SEO_DESCRIPTION =
  "Phong thủy nhà ở trên House X: xem hướng Bát trạch, tuổi xây (Kim Lâu, Hoang Ốc, Tam Tai), màu sơn Ngũ hành — kèm bài kiến thức biên tập." as const;

export const PHONG_THUY_TOOLS_HEADING = "Công cụ phong thủy miễn phí" as const;

export const PHONG_THUY_TOOLS_INTRO =
  "Tính trực tiếp trên trình duyệt — không lưu dữ liệu cá nhân. Dùng trước khi xem nhà mẫu hoặc ký hợp đồng mua bán." as const;

export const PHONG_THUY_ARTICLES_HEADING = "Bài viết phong thủy nhà ở" as const;

export const PHONG_THUY_FAQ_HEADING =
  "Câu hỏi thường gặp về phong thủy khi mua nhà" as const;

/** Bài nền & liên kết công cụ — hiển thị trên hub `/phong-thuy`. */
export const PHONG_THUY_PILLAR_LINKS = [
  {
    href: "/cong-cu/xem-huong-nha",
    label: "Xem hướng nhà Bát trạch",
  },
  {
    href: "/cong-cu/kiem-tra-tuoi-xay-nha",
    label: "Kiểm tra tuổi xây/sửa nhà",
  },
  {
    href: articlePath("huong-nha-hop-tuoi-bat-trach-tom-tat"),
    label: "Hướng nhà hợp tuổi — tóm tắt Bát trạch",
  },
  {
    href: articlePath("kim-lau-hoang-oc-tam-tai-xay-nha-giai-thich"),
    label: "Kim Lâu, Hoang Ốc, Tam Tai là gì?",
  },
  {
    href: "/cong-cu/chon-mau-son-theo-menh",
    label: "Chọn màu sơn theo mệnh",
  },
  {
    href: "/cong-cu/phong-thuy-van-phong",
    label: "Phong thủy bàn làm việc",
  },
] as const;

export { PHONG_THUY_HUB_PATH } from "@/lib/content/article-routes";
