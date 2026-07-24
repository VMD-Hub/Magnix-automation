/** Trang /gioi-thieu — giới thiệu, giá trị, sứ mệnh, lợi ích (góc người mua + đối tác). */

export const ABOUT_SEO = {
  metaTitle: "House X — Cổng Proptech tìm nhà an toàn và chính xác",
  metaDescription:
    "House X giúp bạn tìm, so sánh và liên hệ an toàn với tin đăng kiểm chứng — ảnh, vị trí và giá được kiểm tra trước khi hiển thị.",
} as const;

export const ABOUT_HERO = {
  kicker: "Về House X",
  h1: "Nền tảng số tìm nhà Việt Nam",
} as const;

export const ABOUT_CORE_VALUES = {
  title: "Giá trị cốt lõi",
  items: [
    {
      title: "Dữ liệu thực — giá trị thật",
      desc: "Mỗi tin lên House X đều qua kiểm duyệt ảnh, vị trí và giá. Bạn quyết định trên dữ liệu đã được lọc, không phải tin thô.",
      iconId: "du-lieu-thuc",
      iconAlt: "Biểu tượng dữ liệu đã kiểm chứng",
    },
    {
      title: "Một dự án — một chân dung",
      desc: "Cùng một dự án thì giá trị và tiện ích phải thống nhất — không vẽ khác với thực tế dự án đang có. House X giữ một diện mạo rõ cho từng dự án để bạn so sánh đúng.",
      iconId: "mot-du-an",
      iconAlt: "Biểu tượng một dự án một chân dung",
    },
    {
      title: "Bảo mật kết nối",
      desc: "Thông tin liên hệ được bảo vệ. Số điện thoại chỉ hiện khi bạn sẵn sàng và đã xác thực.",
      iconId: "bao-mat-ket-noi",
      iconAlt: "Biểu tượng bảo mật kết nối",
    },
    {
      title: "Đồng hành an cư",
      desc: "House X đi cùng từ tính vay, điều kiện nhà ở xã hội đến thiết kế–thi công — không dừng ở bước tìm tin.",
      iconId: "dong-hanh-an-cu",
      iconAlt: "Biểu tượng đồng hành an cư",
    },
  ],
} as const;

export const ABOUT_MISSION_VISION = {
  title: "Sứ mệnh & Tầm nhìn",
  items: [
    {
      title: "Sứ mệnh",
      lead: "Đơn giản hóa hành trình tìm tổ ấm.",
      body: "Giúp người Việt tiết kiệm thời gian và bớt âu lo vì thông tin ảo — nhờ dữ liệu chính trực và sự đồng hành thấu hiểu trên từng bước.",
      iconId: "su-menh",
      iconAlt: "Biểu tượng sứ mệnh — lộ trình tìm tổ ấm được đơn giản hóa",
    },
    {
      title: "Tầm nhìn",
      lead: "Trở thành điểm tựa đầu tiên trên mọi bước đường an cư:",
      body: "nơi mỗi quyết định bắt đầu bằng sự minh bạch và kết thúc bằng sự an tâm.",
      iconId: "tam-nhin",
      iconAlt: "Biểu tượng tầm nhìn — nhìn xa tới điểm tựa an cư",
    },
  ],
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
  title: "Tìm nhà trên dữ liệu đã kiểm chứng",
  body: "Duyệt tin thật, so sánh rõ — hoặc đăng ký để lưu nhu cầu và để House X đồng hành đến khi bạn sẵn sàng liên hệ.",
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
    desc: "Hành trình hình thành House X — từ Sài Gòn mưa đến thông tin chuẩn, sản phẩm thật.",
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
