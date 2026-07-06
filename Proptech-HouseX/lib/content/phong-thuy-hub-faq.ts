import type { RichFaqItem } from "@/lib/content/faq-content";

/** FAQ hub `/phong-thuy` — AIO / FAQPage. */
export const PHONG_THUY_HUB_FAQ: RichFaqItem[] = [
  {
    q: "Phong thủy nhà ở nên xem theo hướng nào trước?",
    blocks: [
      {
        type: "p",
        text: "Thứ tự tham khảo phổ biến: (1) hướng nhà và cửa chính theo Bát trạch — xác định cung mệnh gia chủ; (2) năm xây/sửa theo tuổi mụ — tránh Kim Lâu, Tam Tai nếu gia đình quan tâm; (3) màu sơn, bố trí phòng theo Ngũ hành. House X có công cụ cho từng bước trên trang này.",
      },
    ],
  },
  {
    q: "Xem hướng nhà theo tuổi nào — vợ hay chồng?",
    blocks: [
      {
        type: "p",
        text: "Theo Bát trạch truyền thống, hướng nhà và cửa chính thường lấy theo gia chủ — người trụ cột kinh tế hoặc người đứng tên mua/xây nhà. Phòng ngủ và bàn làm việc riêng có thể bố trí theo cung mệnh từng người.",
      },
      {
        type: "ul",
        items: [
          "Dùng công cụ xem hướng nhà với năm sinh âm lịch và giới tính của gia chủ.",
          "Nếu hai vợ chồng khác nhóm Đông/Tây tứ mệnh, ưu tiên hướng cát cho không gian chung, cá nhân hóa phòng riêng.",
        ],
      },
    ],
  },
  {
    q: "Kim Lâu, Hoang Ốc và Tam Tai có bắt buộc tránh khi xây nhà không?",
    blocks: [
      {
        type: "p",
        text: "Đây là quan niệm dân gian được nhiều gia đình Việt tham khảo trước động thổ. Kim Lâu liên quan tuổi mụ chia 9; Hoang Ốc chia 6; Tam Tai theo tam hợp địa chi. Nhiều người chọn năm không phạm hoặc mượn tuổi — tùy vùng miền và thói quen gia đình.",
      },
      {
        type: "ul",
        items: [
          "Công cụ kiểm tra tuổi xây nhà trên House X tính tuổi mụ = năm xây − năm sinh + 1.",
          "Quyết định thực tế nên cân nhắc thêm tiến độ dự án, hợp đồng và khả năng tài chính.",
        ],
      },
    ],
  },
  {
    q: "Phong thủy có thay thế được pháp lý và tài chính khi mua nhà không?",
    blocks: [
      {
        type: "p",
        text: "Không. Phong thủy là tham khảo văn hóa — không thay thế sổ đỏ, hợp đồng, thẩm định vay hay điều kiện NOXH. House X khuyến nghị kết hợp: công cụ phong thủy + thẩm định vay, kiểm tra pháp lý dự án trước khi cọc.",
      },
    ],
  },
  {
    q: "House X tính phong thủy như thế nào — có lưu dữ liệu cá nhân không?",
    blocks: [
      {
        type: "p",
        text: "Các công cụ Bát trạch, tuổi xây nhà và màu sơn chạy hoàn toàn trên trình duyệt của bạn. Chúng tôi không yêu cầu đăng nhập và không gửi năm sinh hay giới tính lên máy chủ khi bạn chỉ tra cứu.",
      },
    ],
  },
];
