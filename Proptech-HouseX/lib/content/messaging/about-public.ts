/** Trang /gioi-thieu — giới thiệu, giá trị, sứ mệnh, lợi ích (góc người mua + đối tác). */

export const ABOUT_SEO = {
  metaTitle: "House X — Cổng Proptech tìm nhà an toàn và chính xác",
  metaDescription:
    "House X giúp bạn tìm, so sánh và liên hệ an toàn với tin đăng kiểm chứng — ảnh, vị trí và giá được kiểm tra trước khi hiển thị.",
} as const;

export const ABOUT_HERO = {
  kicker: "Về House X",
  h1: "Giới thiệu House X — Cổng Proptech tìm nhà an toàn và chính xác",
  intro:
    "House X là cổng Proptech đặt người tìm nhà ở trung tâm: tìm, so sánh và liên hệ an toàn với tin đăng đã được kiểm chứng. Chúng tôi giúp bạn ra quyết định nhanh và ít rủi ro hơn khi mua hoặc thuê bất động sản.",
} as const;

export const ABOUT_CORE_VALUES = {
  title: "Giá trị cốt lõi",
  items: [
    {
      title: "Thông tin chuẩn",
      desc: "Ảnh, mô tả, vị trí và giá được kiểm tra trước khi hiển thị.",
    },
    {
      title: "Minh bạch",
      desc: "Một BĐS — một tin đại diện; gom tin trùng để giảm nhiễu.",
    },
    {
      title: "An toàn liên hệ",
      desc: "Số điện thoại được bảo vệ và chỉ hiện sau khi bạn xác thực.",
    },
    {
      title: "Công cụ hỗ trợ quyết định",
      desc: "Tính khoản vay, kiểm tra điều kiện mua nhà ở xã hội, tham khảo hạn mức vay, định giá, dịch vụ tài chính và thiết kế — thi công nội thất.",
    },
  ],
} as const;

export const ABOUT_MISSION_VISION = {
  title: "Sứ mệnh & Tầm nhìn",
  mission:
    "Giúp người mua và người thuê tiết kiệm thời gian và tránh thông tin nhiễu bằng dữ liệu và công cụ đáng tin trên cùng một nền tảng.",
  vision:
    "Trở thành điểm đến đầu tiên của người Việt khi tìm nhà — nơi mỗi bước đều minh bạch và đáng tin.",
} as const;

export const ABOUT_BUYER_BENEFITS = {
  title: "Lợi ích cho bạn (người mua & người thuê)",
  items: [
    "Tìm chính xác theo nhu cầu, vị trí và ngân sách.",
    "So sánh dễ dàng, tiết kiệm thời gian — tránh bị môi giới dẫn đi xem sản phẩm không trung thực.",
    "Liên hệ khi sẵn sàng, bảo vệ thông tin cá nhân.",
    "Công cụ tính toán tài chính tích hợp giúp định hướng ngân sách.",
  ],
} as const;

export const ABOUT_PARTNER_SECTION = {
  title: "Dành cho môi giới & chủ nhà",
  items: [
    "Đăng tin chất lượng, tiếp cận đúng khách hàng.",
    "Hệ thống ưu tiên tin đại diện, giảm cạnh tranh nhiễu.",
  ],
  ctas: [
    { label: "Đăng ký đăng tin", href: "/dang-ky/moi-gioi" },
    { label: "Tìm hiểu chương trình CTV", href: "/moi-gioi/dang-ky-ctv" },
  ],
} as const;

export const ABOUT_CTA = {
  title: "Bắt đầu hành trình tìm nhà",
  body: "Nhập nhu cầu hoặc đăng ký để bảo vệ liên hệ của bạn — House X đồng hành từ bước so sánh đến khi bạn sẵn sàng trao đổi.",
  primary: { label: "Tìm nhà ngay", href: "/mua-ban" },
  secondary: { label: "Đăng ký", href: "/dang-ky/khach-hang" },
} as const;

/** Quy trình 3 bước — hiển thị trên About và Hợp tác. */
export const ABOUT_PROCESS_STEPS = [
  {
    step: "01",
    title: "Tìm & so sánh",
    desc: "Lọc theo khu vực, loại hình, dự án — ảnh, vị trí và giá niêm yết rõ ràng.",
  },
  {
    step: "02",
    title: "Kiểm chứng thông tin",
    desc: "Đối chiếu địa chỉ, gom tin trùng, rà soát theo tiêu chuẩn hiển thị.",
  },
  {
    step: "03",
    title: "Liên hệ khi sẵn sàng",
    desc: "Số môi giới được che — chỉ hiện sau khi bạn đăng ký và xác nhận email.",
  },
] as const;

export const ABOUT_QUICK_LINKS = [
  {
    title: "Câu chuyện thương hiệu",
    desc: "Hành trình hình thành House X — từ Sài Gòn mưa đến cam kết thông tin chuẩn.",
    href: "/gioi-thieu/cau-chuyen",
  },
  {
    title: "Phương pháp biên tập",
    desc: "Quy trình kiểm chứng tin công khai — từ nhận tin đến phản hồi cộng đồng.",
    href: "/gioi-thieu/phuong-phap-bien-tap",
  },
  {
    title: "Chính sách bảo mật",
    desc: "Cách chúng tôi bảo vệ số điện thoại và dữ liệu cá nhân.",
    href: "/bao-mat",
  },
  {
    title: "Đội ngũ & biên tập",
    desc: "Ban lãnh đạo, biên tập viên và chuyên gia rà soát House X.",
    href: "/doi-ngu",
  },
  {
    title: "Hợp tác & đăng tin",
    desc: "Dành cho môi giới, chủ nhà và cộng tác viên.",
    href: "/hop-tac",
  },
] as const;
