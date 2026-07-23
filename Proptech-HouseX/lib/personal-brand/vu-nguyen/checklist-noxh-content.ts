import { getContactFormIntentHref } from "@/lib/content/contact-form-routing";
import { VU_NGUYEN_SERVICE_NOTE } from "@/lib/personal-brand/vu-nguyen/profile-content";

/**
 * Checklist rà soát pháp lý NOXH — in + web /vu-nguyen/checklist-noxh
 * Sub-project: docs/strategy/personal-brand/projects/vu-nguyen-profile/sale-kit/
 */

export const NOXH_LEGAL_CHECKLIST = {
  title: "Checklist rà soát 10 điểm rủi ro pháp lý & tài chính NOXH",
  subtitle:
    "Dùng khi gặp khách hoặc tự kiểm tra trước khi đặt cọc — tick từng mục, ghi chú bên lề.",
  author: "Vũ Nguyễn · Co-Founder House X",
  disclaimer: VU_NGUYEN_SERVICE_NOTE,
  sections: [
    {
      id: "phap-ly-du-an",
      title: "A. Pháp lý dự án & sản phẩm",
      items: [
        {
          id: "a1",
          label: "Chủ đầu tư / pháp nhân bán hàng có đúng tên trên giấy phép?",
          hint: "Đối chiếu HĐ mua bán với GPĐT, quyết định giao đất.",
        },
        {
          id: "a2",
          label: "Dự án đã đủ điều kiện bán nhà ở hình thành trong tương lai / NOXH?",
          hint: "Thông báo Sở Xây dựng, điều kiện mở bán theo từng đợt.",
        },
        {
          id: "a3",
          label: "Quy hoạch / lộ giới / hướng không gian có ảnh hưởng căn hộ?",
          hint: "Tra cứu cổng quy hoạch địa phương; ghi nhận trên bản đồ.",
        },
        {
          id: "a4",
          label: "Tiến độ thi công & cam kết bàn giao có khớp hợp đồng?",
          hint: "Phạt chậm tiến độ, force majeure, điều kiện bàn giao.",
        },
      ],
    },
    {
      id: "so-hong-hop-dong",
      title: "B. Sổ hồng & hợp đồng",
      items: [
        {
          id: "b1",
          label: "Loại HĐ: đặt cọc / mua bán / hình thành trong tương lai — đúng giai đoạn?",
          hint: "Không nhầm HĐ vay với HĐ mua bán.",
        },
        {
          id: "b2",
          label: "Điều khoản đặt cọc: hoàn trả / phạt một chiều / chuyển nhượng cọc?",
          hint: "Đánh dấu điều khoản dễ bị lợi dụng ở lề HĐ.",
        },
        {
          id: "b3",
          label: "Nghĩa vụ tài chính gắn với BĐS (thế chấp, công trình vi phạm)?",
          hint: "Yêu cầu xác nhận của ngân hàng / chủ đầu tư.",
        },
      ],
    },
    {
      id: "noxh-doi-tuong",
      title: "C. Điều kiện NOXH & hồ sơ",
      items: [
        {
          id: "c1",
          label: "Người mua đủ điều kiện đối tượng NOXH (thu nhập, không sở hữu nhà…)?",
          hint: "Dùng wizard: timnhaxahoi.com/cong-cu/dieu-kien-noxh",
        },
        {
          id: "c2",
          label: "Hồ sơ M1–M2: CMND/CCCD, hộ khẩu/KT3, xác nhận thu nhập — đủ mẫu?",
          hint: "Khớp checklist Ops House X.",
        },
      ],
    },
    {
      id: "tai-chinh",
      title: "D. Tài chính & dòng tiền",
      items: [
        {
          id: "d1",
          label: "DTI / khả năng trả góp sau ưu đãi lãi suất có an toàn?",
          hint: "Tính thử: timnhaxahoi.com/tinh-tra-gop",
        },
      ],
    },
  ],
  footerCta: {
    profile: "/vu-nguyen",
    review: getContactFormIntentHref("ra-soat-phap-ly-15-phut"),
    tools: "/cong-cu/dieu-kien-noxh",
  },
} as const;
