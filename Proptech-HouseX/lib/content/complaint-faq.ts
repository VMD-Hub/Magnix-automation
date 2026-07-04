import type { RichFaqItem } from "@/lib/content/faq-content";

/** FAQ khiếu nại — hiển thị công khai + FAQPage JSON-LD trên /chinh-sach-khieu-nai */
export const COMPLAINT_FAQ: RichFaqItem[] = [
  {
    q: "Gửi khiếu nại trên House X qua kênh nào?",
    blocks: [
      {
        type: "p",
        text: "Bạn có thể gửi khiếu nại qua nút “Báo cáo tin” trên từng tin đăng, form tại trang Liên hệ, email hỗ trợ hoặc email biên tập được công bố trên website. Ghi rõ mã tin, đường dẫn trang và mô tả vấn đề để đội xử lý phân loại nhanh hơn.",
      },
    ],
  },
  {
    q: "House X xác nhận và xử lý khiếu nại trong bao lâu?",
    blocks: [
      {
        type: "p",
        text: "House X xác nhận đã tiếp nhận khiếu nại hợp lệ trong vòng 24 giờ làm việc. Khiếu nại thông thường được phân loại và xử lý trong 03 ngày làm việc.",
      },
      {
        type: "p",
        text: "Vụ việc cần xác minh thêm với chủ tin, đối tác hoặc bên thứ ba có thể kéo dài hơn — House X sẽ thông báo lý do và thời hạn dự kiến. Thời hạn có thể thay đổi tùy tính chất vụ việc và quy định pháp luật hiện hành.",
      },
      {
        type: "p",
        text: "Báo cáo khẩn cấp (nghi ngờ lừa đảo, lộ dữ liệu): xem thêm quy trình SLA chi tiết tại Phụ lục A trong mục Điều khoản sử dụng.",
      },
    ],
  },
  {
    q: "Làm sao báo cáo tin đăng sai hoặc nghi ngờ lừa đảo?",
    blocks: [
      {
        type: "p",
        text: "Trên trang tin đăng, chọn “Báo cáo tin” và mô tả cụ thể: sai giá, sai ảnh, sai vị trí, trùng lặp hoặc dấu hiệu lừa đảo. Bạn cũng có thể gửi email biên tập kèm mã tin hoặc URL trang.",
      },
      {
        type: "ul",
        items: [
          "House X rà soát nội dung, lịch sử chỉnh sửa và có thể liên hệ chủ tin để xác minh.",
          "Kết quả có thể là chỉnh sửa, gắn nhãn cảnh báo, ẩn tạm thời hoặc gỡ tin.",
          "Trường hợp nghiêm trọng có thể chuyển bộ phận pháp lý hoặc cơ quan có thẩm quyền.",
        ],
      },
    ],
  },
  {
    q: "Khiếu nại về dịch vụ trả phí được giải quyết thế nào?",
    blocks: [
      {
        type: "p",
        text: "Khiếu nại liên quan gói đăng tin, nổi bật, CTV hoặc dịch vụ số khác được xử lý theo Chính sách xử lý khiếu nại và Phụ lục B — Chính sách hoàn tiền trong mục Điều khoản sử dụng.",
      },
      {
        type: "p",
        text: "Gửi kèm mã giao dịch, ngày thanh toán và mô tả sự cố. House X xác minh trạng thái dịch vụ trước khi phản hồi chấp thuận hoặc từ chối hoàn tiền.",
      },
    ],
  },
  {
    q: "House X có thông báo kết quả xử lý khiếu nại không?",
    blocks: [
      {
        type: "p",
        text: "Có. Sau khi hoàn tất xử lý, House X thông báo kết quả qua kênh liên hệ bạn đã cung cấp (email hoặc phản hồi form), trong phạm vi pháp luật và Chính sách bảo mật cho phép.",
      },
      {
        type: "p",
        text: "Nội dung phản hồi có thể là tóm tắt biện pháp đã áp dụng (ví dụ: đã chỉnh sửa tin, đã gỡ tin, đã từ chối do thiếu căn cứ) mà vẫn bảo vệ dữ liệu cá nhân các bên liên quan.",
      },
    ],
  },
  {
    q: "Không đồng ý với kết quả xử lý — tôi có thể làm gì?",
    blocks: [
      {
        type: "p",
        text: "Bạn có thể gửi khiếu nại bổ sung trong vòng 7 ngày kể từ khi nhận phản hồi, kèm bằng chứng hoặc thông tin mới. House X xem xét lại trên cơ sở hồ sơ giao dịch và điều khoản áp dụng.",
      },
      {
        type: "p",
        text: "Với tranh chấp dịch vụ trả phí, tham chiếu thêm mục Khiếu nại tại Phụ lục B. Quyền khiếu nại theo pháp luật bảo vệ người tiêu dùng vẫn được tôn trọng.",
      },
    ],
  },
];

export const COMPLAINT_FAQ_HEADING = "Câu hỏi thường gặp về khiếu nại & báo cáo tin";
