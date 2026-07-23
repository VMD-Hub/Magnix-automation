import { articlePath } from "@/lib/content/article-routes";

/** Copy trang /cong-cu — ngôn ngữ người mua nhà, không jargon Proptech. */

export const TOOLS_HUB_COPY = {
  metaTitle: "Công cụ mua nhà miễn phí",
  metaDescription:
    "Công cụ miễn phí trên House X: tính vay, kiểm tra NOXH, xem hướng nhà, tuổi xây dựng và dự toán chi phí — dùng ngay trên trình duyệt.",
  kicker: "HouseX · Công cụ",
  title: "Công cụ mua nhà thông minh",
  subtitle:
    "Tính khoản vay, ước lượng chi phí và chuẩn bị quyết định — ngay trên trình duyệt, không cần đăng ký.",
  calculatorsHeading: "Máy tính & tra cứu",
  calculatorsIntro: "Bắt đầu bằng công cụ phù hợp nhu cầu của bạn.",
  servicesHeading: "Cần tư vấn chuyên sâu?",
  servicesIntro:
    "Đội ngũ HouseX đồng hành vay vốn, thẩm định giá và thiết kế không gian sống sau khi bạn đã có con số sơ bộ.",
} as const;

export const LOAN_CALC_COPY = {
  metaTitle: "Tính trả góp hàng tháng — khoản vay mua nhà",
  metaDescription:
    "Tính trả góp / khoản vay mua nhà theo dư nợ giảm dần hoặc trả góp đều: tiền trả hàng tháng, tổng lãi, lịch trả nợ chi tiết và xuất PDF miễn phí trên House X.",
  kicker: "Công cụ · Vay mua nhà",
  title: "Tính trả góp hàng tháng",
  subtitle:
    "Nhập giá nhà và tỷ lệ vay — xem tiền trả hàng tháng, tổng lãi và lịch trả nợ chi tiết. Xuất PDF để lưu hoặc gửi ngân hàng.",
  primaryCta: "Bắt đầu tính",
  primaryCtaHref: "#tinh-toan",
  secondaryCta: "Nhận tư vấn vay",
  secondaryCtaHref: "/tai-chinh#tu-van",
  faqHeading: "Câu hỏi thường gặp về tính trả góp / vay mua nhà",
} as const;

export const LOAN_AFFORDABILITY_COPY = {
  metaTitle: "Tính hạn mức vay theo thu nhập 2026",
  metaDescription:
    "Ước tính hạn mức vay mua nhà theo thu nhập, DTI, chi phí sinh hoạt, đồng vay vợ chồng và CIC — mô phỏng cách ngân hàng thẩm định. Miễn phí trên House X.",
  kicker: "Máy tính hạn mức vay",
  title: "Tính hạn mức vay mua nhà",
  subtitle:
    "Nhập thu nhập, hộ gia đình và nghĩa vụ trả nợ — xem hạn mức vay theo DTI và chi phí sinh hoạt/đầu người, như ngân hàng thẩm định.",
  primaryCta: "Bắt đầu tính",
  primaryCtaHref: "#tinh-toan",
  secondaryCta: "Nhận tư vấn vay",
  secondaryCtaHref: "/tai-chinh#tu-van",
  faqHeading: "Câu hỏi thường gặp về hạn mức vay mua nhà",
} as const;

export const NOXH_CHECK_COPY = {
  metaTitle: "Kiểm tra điều kiện mua NOXH 2026",
  metaDescription:
    "Tự kiểm tra điều kiện mua nhà ở xã hội theo Luật Nhà ở 2023 và NĐ 100/2024 (sửa NĐ 136/2026): đối tượng, nhà ở, thu nhập và khả năng vay. Miễn phí trên House X.",
  kicker: "HouseX · Công cụ",
  title: "Kiểm tra điều kiện mua nhà ở xã hội",
  subtitle:
    "Trả lời vài câu hỏi để biết bạn có đủ điều kiện mua NOXH không, vướng ở đâu và cần làm gì tiếp — theo quy định mới nhất năm 2026.",
  primaryCta: "Bắt đầu kiểm tra",
  primaryCtaHref: "#kiem-tra",
  secondaryCta: "Nhận tư vấn chuyên gia",
  secondaryCtaHref: "/lien-he",
  faqHeading: "Câu hỏi thường gặp về điều kiện mua NOXH",
} as const;

export const NOXH_LOAN_ASSESSMENT_HUB_COPY = {
  metaTitle: "Thẩm định vay NOXH — bộ công cụ miễn phí",
  metaDescription:
    "Tự thẩm định vay mua nhà ở xã hội: kiểm tra thời hạn vay, hạn mức theo thu nhập và lịch trả nợ trước khi đặt cọc. Tham khảo — không thay quyết định ngân hàng.",
  kicker: "House X · Công cụ NOXH",
  title: "Thẩm định vay mua nhà ở xã hội",
  subtitle:
    "Ba bước sàng lọc sơ bộ trước khi cọc: tuổi vay → hạn mức → khoản trả hàng tháng. Kết quả mang tính tham khảo — ngân hàng mới quyết định duyệt hồ sơ.",
  toolsHeading: "Chọn công cụ phù hợp",
  toolsIntro: "Bắt đầu từ kiểm tra nhanh thời hạn vay nếu bạn chưa rõ tuổi cuối kỳ vay; sau đó tính hạn mức và khoản trả.",
  articlesHeading: "Hướng dẫn & cụm bài thẩm định vay",
  articlesIntro:
    "Đọc thêm trước khi nộp hồ sơ: CIC, hồ sơ vay, sai lầm thường gặp và checklist trước cọc.",
} as const;

export const NOXH_LOAN_ASSESSMENT_HUB_TOOLS: ToolCardDef[] = [
  {
    id: "noxh-loan-quick",
    href: "/cong-cu/kiem-tra-vay-noxh",
    title: "Kiểm tra nhanh thời hạn vay",
    desc: "Ước tính tuổi cuối kỳ vay theo năm sinh — trước khi chọn kỳ hạn vay NOXH.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "Bước 1",
  },
  {
    id: "affordability",
    href: "/cong-cu/tinh-han-muc-vay",
    title: "Tính hạn mức vay",
    desc: "Thu nhập, DTI và chi phí sinh hoạt — ước tính số tiền vay tối đa.",
    cta: "Tính ngay",
    ready: true,
    badge: "Bước 2",
  },
  {
    id: "loan",
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính trả góp hàng tháng",
    desc: "Lịch trả nợ chi tiết, tổng lãi — xuất PDF để đối chiếu.",
    cta: "Tính ngay",
    ready: true,
    badge: "Bước 3",
  },
];

export const NOXH_LOAN_ASSESSMENT_HUB_ARTICLES = [
  {
    href: articlePath("tham-dinh-khoan-vay-mua-nha-o-xa-hoi"),
    label: "Thẩm định vay NOXH — bài trụ cột",
  },
  {
    href: articlePath("kiem-tra-kha-nang-vay-noxh-60-giay"),
    label: "Vì sao mỗi người có thời hạn vay NOXH khác nhau",
  },
  {
    href: articlePath("cach-tra-cic-an-toan-truoc-khi-vay"),
    label: "Tra CIC an toàn trước khi vay",
  },
  {
    href: articlePath("checklist-truoc-khi-dat-coc-noxh"),
    label: "Checklist trước khi đặt cọc",
  },
] as const;

export type ToolCardDef = {
  id: string;
  href: string;
  title: string;
  desc: string;
  cta: string;
  ready: boolean;
  badge?: string;
};

export const TOOL_HUB_CARDS: ToolCardDef[] = [
  {
    id: "noxh-loan-hub",
    href: "/cong-cu/tham-dinh-vay-noxh",
    title: "Thẩm định vay NOXH",
    desc: "Bộ công cụ: kiểm tra nhanh thời hạn vay, hạn mức và khoản trả — trước khi cọc.",
    cta: "Mở bộ công cụ",
    ready: true,
    badge: "NOXH",
  },
  {
    id: "loan",
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính trả góp hàng tháng",
    desc: "Dư nợ giảm dần hoặc trả góp đều — lịch trả nợ chi tiết, xuất PDF.",
    cta: "Tính ngay",
    ready: true,
    badge: "Phổ biến",
  },
  {
    id: "affordability",
    href: "/cong-cu/tinh-han-muc-vay",
    title: "Tính hạn mức vay mua nhà",
    desc: "Ước tính số tiền vay tối đa theo thu nhập, DTI và hạn mức thẻ — như ngân hàng thẩm định.",
    cta: "Tính ngay",
    ready: true,
  },
  {
    id: "xem-huong-nha",
    href: "/cong-cu/xem-huong-nha",
    title: "Xem hướng nhà theo tuổi",
    desc: "La bàn Bát trạch: nhập năm sinh âm lịch & giới tính — sơ đồ 8 hướng tốt/xấu.",
    cta: "Xem hướng ngay",
    ready: true,
    badge: "Phong thủy",
  },
  {
    id: "kiem-tra-tuoi-xay-nha",
    href: "/cong-cu/kiem-tra-tuoi-xay-nha",
    title: "Kiểm tra tuổi xây/sửa nhà",
    desc: "Tam Tai, Kim Lâu, Hoang Ốc — năm nào nên động thổ.",
    cta: "Kiểm tra tuổi",
    ready: true,
    badge: "Phong thủy",
  },
  {
    id: "uoc-tinh-chi-phi-xay-nha",
    href: "/cong-cu/uoc-tinh-chi-phi-xay-nha",
    title: "Ước tính chi phí xây nhà",
    desc: "Khái toán nhanh theo m² và khu vực.",
    cta: "Ước tính",
    ready: true,
    badge: "Xây dựng",
  },
  {
    id: "noxh-check",
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    desc: "Đối tượng, nhà ở, thu nhập & khả năng vay — theo quy định mới nhất 2026.",
    cta: "Kiểm tra ngay",
    ready: true,
    badge: "Mới",
  },
];
