/** Trang /gioi-thieu — giới thiệu, tầm nhìn, sứ mệnh, mục tiêu, giá trị (góc người mua). */

export const ABOUT_INTRO = {
  promise: "Thông tin chuẩn · Sản phẩm thật",
  lead:
    "là cổng bất động sản Proptech — nơi người mua nhà được đặt ở trung tâm: tìm căn phù hợp, so sánh dự án và chuẩn bị quyết định với thông tin rõ ràng, liên hệ an toàn.",
} as const;

export const ABOUT_VISION = {
  title: "Tầm nhìn",
  body: "Trở thành điểm đến đầu tiên của người Việt khi tìm nhà — mỗi bước từ khám phá, so sánh đến liên hệ đều minh bạch và đáng tin.",
} as const;

export const ABOUT_MISSION = {
  title: "Sứ mệnh",
  body: "Giúp người mua và thuê tiết kiệm thời gian, tránh thông tin nhiễu — thông qua tin đăng rõ ràng, dự án có chiều sâu và công cụ hỗ trợ quyết định trên cùng một nền tảng.",
} as const;

export const ABOUT_GOALS = {
  title: "Mục tiêu",
  items: [
    "Người mua nhìn thấy đúng sản phẩm, đúng giá, đúng vị trí trước khi đi xem thực tế.",
    "Khách hàng liên hệ an toàn — không lo số điện thoại bị lộ tràn lan.",
    "Hành trình chọn nhà có căn cứ: tin đăng, dự án, tính vay và tham khảo định giá liền mạch.",
    "Môi giới và chủ nhà đăng tin chất lượng được tiếp cận đúng khách hàng.",
  ],
} as const;

export type AboutValueItem = { title: string; desc: string };

export const ABOUT_VALUES = {
  title: "Giá trị dành cho bạn",
  intro:
    "Quy trình kiểm soát chất lượng được thiết kế xoay quanh lợi ích người dùng — để bạn yên tâm khám phá, không phải để \"cảnh báo\" hay gây áp lực.",
  items: [
    {
      title: "Tin rõ trước khi bạn quyết định",
      desc: "Ảnh, mô tả, vị trí và giá niêm yết được kiểm tra trước khi hiển thị — bạn so sánh dễ hơn, ít đi xem oan.",
    },
    {
      title: "Một BĐS — một tin đại diện",
      desc: "Gom tin trùng, giảm nhiễu khi lướt danh sách — tập trung vào lựa chọn phù hợp.",
    },
    {
      title: "Liên hệ khi bạn sẵn sàng",
      desc: "Số điện thoại được bảo vệ; chỉ hiện sau khi bạn đăng ký và xác nhận email.",
    },
    {
      title: "Cộng đồng cùng giữ chất lượng",
      desc: "Góp ý khi thấy thông tin chưa khớp — chúng tôi cập nhật để trải nghiệm tốt hơn cho mọi người.",
    },
    {
      title: "Công cụ cho hành trình mua nhà",
      desc: "Tính khoản vay, tham khảo định giá, dịch vụ tài chính và nội thất — trên cùng cổng House X.",
    },
  ] as AboutValueItem[],
} as const;

/** Công khai: không dùng tên chương trình nội bộ "Rada". */
export const TRUST_TECH = {
  title: "Công nghệ kiểm tra thông tin House X",
  tagline: "Thông tin sát thực tế, trước khi bạn khám phá",
  lead: "Lớp công nghệ hỗ trợ đối chiếu địa chỉ, giá và hình ảnh — giúp tin trên sàn khớp thực tế hơn trước khi bạn thấy.",
  bullets: [
    "Đối chiếu vị trí, giá niêm yết và nội dung mô tả theo tiêu chuẩn hiển thị.",
    "Gom tin trùng — ưu tiên tin đại diện, giảm nhiễu khi bạn so sánh.",
    "Lắng nghe phản hồi từ cộng đồng để cập nhật thông tin kịp thời.",
  ],
} as const;
